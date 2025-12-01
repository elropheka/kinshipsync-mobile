# Push Notification Fix

## Problem
Push notifications were not being received because the app uses **Expo Push Tokens**, but the Cloud Function was trying to send notifications using **FCM (Firebase Cloud Messaging)** tokens. These are incompatible systems.

## Solution
Updated the Cloud Function to support both Expo Push Tokens and FCM tokens by:
1. Detecting token type automatically
2. Sending Expo tokens through Expo's Push API
3. Sending FCM tokens through Firebase Cloud Messaging

## Changes Made

### 1. Cloud Function Updates (`functions/src/index.ts`)
- Added `expo-server-sdk` package support
- Created `sendExpoNotification()` function to send via Expo Push API
- Created `sendPushNotificationToTokens()` helper that automatically detects token type
- Updated all notification sending code to use the unified function

### 2. Notification Service Updates (`services/notificationService.ts`)
- Improved error logging with emoji indicators for better debugging
- Added more detailed console logs for token saving and notification sending
- Enhanced error messages to help diagnose issues

### 3. Package Dependencies (`functions/package.json`)
- Added `expo-server-sdk: ^3.7.0` dependency

## Next Steps

### 1. Install Dependencies
```bash
cd functions
npm install
```

### 2. Deploy Cloud Functions
```bash
npm run build
firebase deploy --only functions
```

### 3. Verify Token Registration
After deploying, check your console logs when the app starts:
- ✅ Look for "Expo Push Token obtained" message
- ✅ Look for "Push token saved successfully" message
- Check Firestore to verify tokens are saved in `users/{userId}/fcmTokens` array

### 4. Test Push Notifications
1. Create a test notification (e.g., invite a guest to an event)
2. Check Cloud Function logs: `firebase functions:log`
3. Look for:
   - "Sending X notification(s) via Expo Push API" or "via FCM"
   - "Successfully sent X notification(s)"

## Troubleshooting

### If notifications still don't work:

1. **Check token exists in Firestore**
   - Go to Firestore console
   - Check `users/{userId}` document
   - Verify `fcmTokens` array contains your Expo push token

2. **Check Cloud Function logs**
   ```bash
   firebase functions:log --only sendPushNotification
   ```
   Look for error messages about:
   - Missing tokens
   - Invalid tokens
   - Expo API errors

3. **Verify permissions**
   - Ensure notification permissions are granted on the device
   - Check that the device is a physical device (not simulator/emulator)

4. **Check Expo project ID**
   - Verify the project ID in `services/notificationService.ts` matches your EAS project ID
   - Found in `app.json` under `extra.eas.projectId`

5. **Test with Expo Push Notification Tool**
   - Visit: https://expo.dev/notifications
   - Enter your Expo push token
   - Send a test notification

## Token Types

- **Expo Push Tokens**: Start with `ExponentPushToken[` or `ExpoPushToken[`
  - Used in Expo managed workflow
  - Sent through Expo's Push API
  
- **FCM Tokens**: Standard Firebase tokens
  - Used in bare React Native or custom native code
  - Sent through Firebase Cloud Messaging

The updated Cloud Function now handles both automatically!

