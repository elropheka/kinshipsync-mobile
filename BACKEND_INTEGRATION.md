# Backend Integration Guide - KinshipSync Mobile

## Overview

This guide explains how to integrate the KinshipSync mobile app with your backend API running on `http://localhost:5001/api/v1`.

## Current Setup

**✅ Already Configured:**
- Axios instance pointing to `http://localhost:5001/api/v1` in development
- Bearer token authentication in request headers
- Error handling and toast notifications
- Secure token storage using expo-secure-store

**⚠️ Needs Integration:**
- Authentication flow (Firebase → Backend JWT exchange)
- User profile sync with backend database
- API endpoint alignment

---

## Integration Steps

### Step 1: Update Backend to Accept Firebase Tokens

The mobile app uses **Firebase Authentication**. We need to exchange Firebase ID tokens for backend JWT tokens.

**Backend Changes Needed:**

Create endpoint: `POST /auth/firebase/exchange-token`

```typescript
// backend/src/controllers/auth.controller.ts

export const exchangeFirebaseToken = async (req, res) => {
  try {
    const { firebaseToken, userData } = req.body;

    // Verify Firebase token (optional - can trust mobile client)
    // const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    // Create user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userData.email,
          displayName: userData.displayName,
          emailVerified: userData.emailVerified,
          authProvider: 'firebase',
          authProviderId: userData.uid,
          isActive: true,
        }
      });
    }

    // Generate backend JWT
    const token = generateJWT({ userId: user.id, email: user.email });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token exchange failed',
      message: error.message
    });
  }
};
```

### Step 2: Update Mobile App - Add Token Exchange

Update `services/authService.ts`:

```typescript
// Add this function
export const exchangeFirebaseTokenForBackendJWT = async (
  firebaseToken: string,
  userData: {
    uid: string;
    email: string;
    displayName?: string;
    emailVerified: boolean;
  }
) => {
  try {
    const response = await axiosInstance.post('/auth/firebase/exchange-token', {
      firebaseToken,
      userData
    });

    return {
      backendToken: response.data.data.token,
      backendUser: response.data.data.user
    };
  } catch (error) {
    console.error('Failed to exchange Firebase token:', error);
    throw error;
  }
};
```

### Step 3: Update AuthContext - Integrate Backend JWT

Modify the `onAuthStateChanged` handler in `context/AuthContext.tsx`:

```typescript
// Around line 138-154, replace token storage logic with:

try {
  console.log('[AuthContext] Attempting to get ID token.');
  const firebaseIdToken = await firebaseUser.getIdToken();

  // Exchange Firebase token for backend JWT
  const { backendToken, backendUser } = await exchangeFirebaseTokenForBackendJWT(
    firebaseIdToken,
    {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: appUser.displayName,
      emailVerified: firebaseUser.emailVerified
    }
  );

  // Store BACKEND token (not Firebase token)
  await SecureStore.setItemAsync(TOKEN_KEY, backendToken);

  // Update Redux with backend user data
  dispatch(setAuthUserAndToken({
    user: {
      ...appUser,
      id: backendUser.id, // Add backend user ID
    },
    token: backendToken
  }));

} catch (error) {
  console.error('[AuthContext] Error exchanging token:', error);
  // Fallback to Firebase token if backend is unavailable
  const firebaseIdToken = await firebaseUser.getIdToken();
  await SecureStore.setItemAsync(TOKEN_KEY, firebaseIdToken);
  dispatch(setAuthUserAndToken({ user: appUser, token: firebaseIdToken }));
}
```

### Step 4: Update Sign Up - Create Backend User

Modify `handleSignUp` in `context/AuthContext.tsx`:

```typescript
// Around line 244, after creating Firestore profile, add:

try {
  // Create user in backend database
  const backendResponse = await axiosInstance.post('/users', {
    email: credentials.email,
    displayName: `${credentials.first_name} ${credentials.last_name}`,
    firstName: credentials.first_name,
    lastName: credentials.last_name,
    phone: credentials.phone,
    authProvider: 'firebase',
    authProviderId: newUserUid,
    avatarUrl: avatarUrl,
  });

  console.log('[AuthContext] Backend user created:', backendResponse.data);
} catch (backendError) {
  console.error('[AuthContext] Failed to create backend user:', backendError);
  // Continue anyway - will be created on first login
}
```

---

## Testing Integration

### Test 1: User Registration

```bash
# 1. Start backend
cd backend
npm run dev

# Backend should be running on http://localhost:5001

# 2. Start mobile app
cd ../kinshipsync-mobile
npm start

# 3. Register new user in mobile app
# - Enter email, password, name
# - Submit registration

# 4. Check backend logs
# Should see:
# - POST /auth/firebase/exchange-token
# - User created in database
# - JWT token issued

# 5. Check mobile app
# - Should navigate to home screen
# - Token should be stored in SecureStore
```

### Test 2: User Login

```bash
# 1. Sign out from mobile app

# 2. Sign in with registered credentials

# 3. Backend should:
# - Receive Firebase token
# - Find existing user
# - Issue JWT token

# 4. Mobile app should:
# - Store backend JWT
# - Navigate to home
# - All API calls use backend JWT
```

### Test 3: API Calls with Backend JWT

```bash
# After login, test API endpoints:

# GET /users/profile
# GET /events
# POST /events
# etc.

# All requests should include:
# Header: "Authorization: Bearer {backend-jwt}"
```

---

## API Endpoint Alignment

### Required Backend Endpoints

**Authentication:**
- ✅ `POST /auth/register` - User registration (existing)
- ✅ `POST /auth/login` - User login (existing)
- ⚠️ `POST /auth/firebase/exchange-token` - **NEW** - Exchange Firebase token for JWT

**Users:**
- ✅ `POST /users` - Create user profile
- ✅ `GET /users/profile` - Get current user profile
- ✅ `PUT /users/profile` - Update user profile

**Events:**
- ✅ `GET /events` - List events
- ✅ `POST /events` - Create event
- ✅ `GET /events/:id` - Get event details
- ✅ `PUT /events/:id` - Update event
- ✅ `DELETE /events/:id` - Delete event

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

---

## Environment Configuration

### Backend (.env)

```env
PORT=5001
DATABASE_URL=mongodb://admin:password@localhost:27017/kinshipsync?authSource=admin&replicaSet=rs0
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:19006
```

### Mobile App (axiosInstance.ts)

```typescript
// Already configured correctly:
const DEV_API_URL = 'http://localhost:5001/api/v1';
const PROD_API_URL = 'https://api.yourdomain.com/api/v1';

const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;
```

---

## Troubleshooting

### Issue: "Network Error" in Mobile App

**Cause:** Cannot connect to backend

**Solutions:**
1. **Check backend is running:**
   ```bash
   curl http://localhost:5001/api/v1/health
   ```

2. **For Android Emulator:**
   Use `10.0.2.2` instead of `localhost`:
   ```typescript
   const DEV_API_URL = 'http://10.0.2.2:5001/api/v1';
   ```

3. **For iOS Simulator:**
   `localhost` should work, but try your machine's IP:
   ```typescript
   const DEV_API_URL = 'http://192.168.1.x:5001/api/v1';
   ```

4. **For Physical Device:**
   Use your computer's local IP address:
   ```bash
   # Find your IP
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Update mobile app
   const DEV_API_URL = 'http://192.168.1.x:5001/api/v1';
   ```

### Issue: "401 Unauthorized" on API Calls

**Cause:** Backend JWT not stored correctly

**Check:**
1. Token is being stored:
   ```typescript
   const token = await SecureStore.getItemAsync('authToken');
   console.log('Token:', token);
   ```

2. Token is sent in headers:
   ```typescript
   // In axios interceptor
   config.headers.Authorization = `Bearer ${token}`;
   ```

3. Backend validates token correctly

### Issue: User Not Created in Backend

**Cause:** Token exchange endpoint not called

**Check:**
1. Backend endpoint exists: `POST /auth/firebase/exchange-token`
2. Mobile app calls the endpoint after Firebase auth
3. Check network tab for API call
4. Check backend logs for incoming request

---

## Migration Strategy

### Option 1: Gradual Migration (Recommended)

**Phase 1:** Keep Firebase as primary, sync with backend
- Firebase Auth for authentication
- Backend JWT for API calls
- Data stored in both Firestore + Backend DB

**Phase 2:** Backend becomes source of truth
- Backend DB is primary data store
- Firestore used for real-time features only
- All reads/writes go to backend first

**Phase 3:** Minimize Firebase usage
- Keep Firebase Auth only
- Move all data to backend
- Use backend for push notifications

### Option 2: Full Backend Migration

**Steps:**
1. Disable Firebase writes
2. Migrate all data to backend
3. Update all API calls to use backend
4. Keep Firebase Auth as identity provider
5. Use backend for all data operations

---

## Quick Start Checklist

- [ ] Backend running on port 5001
- [ ] Added `POST /auth/firebase/exchange-token` endpoint
- [ ] Updated `authService.ts` with token exchange method
- [ ] Modified AuthContext to call backend on auth
- [ ] Tested user registration
- [ ] Tested user login
- [ ] Verified API calls work with backend JWT
- [ ] Checked user profile syncs correctly

---

## Next Steps

1. **Test locally** - Register/login/API calls
2. **Deploy backend** - Using GitHub Actions CI/CD
3. **Update mobile app** - Change PROD_API_URL to production domain
4. **Test in production** - End-to-end testing
5. **Monitor** - Check logs, error rates, performance

---

## Support

**Backend not responding?**
```bash
# Check backend status
docker-compose ps
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

**Mobile app can't connect?**
```bash
# Check your local IP
ipconfig getifaddr en0  # macOS
hostname -I  # Linux

# Update DEV_API_URL with your IP
```

**Token issues?**
```bash
# Clear mobile app data
# Reinstall app
# Check SecureStore has token
```

---

You're now ready to integrate the mobile app with your backend! 🚀
