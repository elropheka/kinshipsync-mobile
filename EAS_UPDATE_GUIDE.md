# EAS Update Setup Guide

Your project is now configured for EAS Update! This allows you to push over-the-air (OTA) updates to your app without going through the app stores.

## What Was Configured

### 1. Package Installation
- ✅ Installed `expo-updates` package

### 2. Configuration Files

#### `eas.json`
- Added update channels for development, preview, and production
- Each build profile now has a corresponding channel

#### `app.json`
- Added updates configuration with:
  - Update URL pointing to your Expo project
  - Automatic update checking on app load
  - Enabled updates by default

#### `app/_layout.tsx`
- Added update checking logic that:
  - Checks for updates when the app starts (production only)
  - Downloads updates in the background
  - Automatically applies updates on next app restart

## How to Use EAS Update

### 1. Build Your App (First Time)

Build your app with EAS Build for each platform:

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

This creates the initial app binary that will receive OTA updates.

### 2. Publish Updates

After making changes to your JavaScript/TypeScript code:

```bash
# For production channel
eas update --branch production --message "Your update description"

# For preview/testing
eas update --branch preview --message "Testing new feature"

# For development
eas update --branch development --message "Dev update"
```

### 3. Check Update Status

```bash
# List all updates
eas update:list

# View specific update details
eas update:view [update-id]
```

### 4. Rollback an Update

If you need to rollback:

```bash
eas update:rollback
```

## Important Notes

### What Can Be Updated?
✅ JavaScript/TypeScript code  
✅ Styles and UI  
✅ Assets (images, fonts)  
✅ Most configuration changes  

### What CANNOT Be Updated?
❌ Native code changes  
❌ Expo SDK upgrades (requires new build)  
❌ Plugin changes  
❌ Permissions changes  
❌ App icons and splash screens  

### Update Strategy

The current setup:
- Checks for updates on app load (`checkAutomatically: "ON_LOAD"`)
- Downloads updates in the background
- Applies updates on next app restart
- For immediate updates, uncomment the `Updates.reloadAsync()` line in `app/_layout.tsx`

### Testing Updates

1. Build a development or preview build:
   ```bash
   eas build --platform android --profile preview
   ```

2. Install the build on a device

3. Publish an update:
   ```bash
   eas update --branch preview --message "Test update"
   ```

4. Close and reopen the app to see the update

## Best Practices

1. **Always test updates on preview builds first**
2. **Use meaningful commit messages** - they appear in the update history
3. **Monitor update adoption** through EAS dashboard
4. **Keep builds updated** - publish new builds periodically to include SDK updates
5. **Use branches effectively**:
   - `production` - Live updates for end users
   - `preview` - Testing for QA
   - `development` - Internal testing

## Troubleshooting

### Updates Not Showing

1. Check that you're not in development mode (`__DEV__ = false`)
2. Ensure the app is built with EAS Build (not Expo Go)
3. Verify the update was published to the correct channel
4. Check the device's network connection

### Force Update Check

Users can manually check for updates by:
- Completely closing and reopening the app
- Or you can add a "Check for Updates" button in your app

### Emergency Rollback

If an update breaks the app:
```bash
eas update:rollback --branch production
```

## Commands Summary

```bash
# Publish an update
eas update --branch production --message "Update description"

# Build the app
eas build --platform ios --profile production
eas build --platform android --profile production

# List updates
eas update:list

# View update details
eas update:view [update-id]

# Rollback update
eas update:rollback --branch production
```

## Additional Resources

- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS Update Best Practices](https://docs.expo.dev/eas-update/how-it-works/)
- [Update Channels](https://docs.expo.dev/eas-update/update-channels/)

## Need Help?

If you encounter issues:
1. Check the [EAS Update troubleshooting guide](https://docs.expo.dev/eas-update/troubleshooting/)
2. Review your build logs
3. Check the update logs in the EAS dashboard

