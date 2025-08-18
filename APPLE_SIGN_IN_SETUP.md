# Apple Sign In Setup Guide

## Overview
This guide explains how to set up Apple Sign In for the KinshipSync mobile app.

## What's Already Implemented
✅ `expo-apple-authentication` package installed  
✅ Apple Sign In UI buttons in sign-in and create account screens  
✅ Firebase OAuth provider integration  
✅ iOS entitlements configured  
✅ Platform-specific rendering (iOS only)  
✅ Loading states and error handling  

## iOS Configuration

### 1. App Store Connect Setup
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select your app
3. Go to "App Information" → "App Store" → "App Information"
4. Enable "Sign In with Apple" capability

### 2. Xcode Project Configuration
1. Open your iOS project in Xcode
2. Select your target
3. Go to "Signing & Capabilities"
4. Click "+" and add "Sign In with Apple" capability

### 3. Bundle ID Configuration
Ensure your bundle identifier matches what's configured in:
- `app.json`: `com.kinship.kinshipsync`
- Xcode project settings
- App Store Connect

## Testing

### Development Testing
1. Use a physical iOS device (Apple Sign In doesn't work in simulator)
2. Ensure you're signed into iCloud on the device
3. Test both sign-in and sign-up flows

### Production Testing
1. Test with TestFlight builds
2. Verify Apple Sign In works with production Firebase configuration
3. Test on different iOS versions (12.0+)

## Troubleshooting

### Common Issues
1. **"Apple Authentication is not available"**
   - Ensure you're on a physical iOS device
   - Check that user is signed into iCloud
   - Verify entitlements are properly configured

2. **"Sign In with Apple" capability not showing**
   - Check App Store Connect configuration
   - Verify Xcode project settings
   - Clean and rebuild project

3. **Firebase authentication fails**
   - Verify Firebase OAuth provider is configured
   - Check Firebase console for Apple provider settings
   - Ensure bundle ID matches Firebase configuration

## Code Structure

### Key Files
- `context/AuthContext.tsx` - Main Apple Sign In logic
- `app/(auth)/signIn.tsx` - Sign-in screen with Apple button
- `app/(auth)/createAccount.tsx` - Create account screen with Apple button
- `ios/kinshipSync/kinshipSync.entitlements` - iOS entitlements

### Key Functions
- `handleSignInWithApple()` - Main Apple Sign In handler
- `AppleAuthentication.signInAsync()` - Apple authentication
- `OAuthProvider('apple.com')` - Firebase OAuth integration

## Security Notes
- Apple Sign In tokens are handled securely through Firebase
- User data is stored in Firestore with proper authentication
- No sensitive Apple credentials are stored locally

## Next Steps
1. Test on physical iOS device
2. Configure Firebase OAuth provider for Apple
3. Test production builds
4. Monitor authentication success rates
