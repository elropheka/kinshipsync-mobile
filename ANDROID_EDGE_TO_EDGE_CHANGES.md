# Android Edge-to-Edge Implementation

This document outlines the changes made to support Android 15+ (SDK 35+) edge-to-edge display requirements.

## Overview

Starting with Android 15 (API level 35), apps targeting this SDK version will display edge-to-edge by default. This means your app's content will extend behind system bars like the status and navigation bars, utilizing the full screen area.

## Changes Made

### 1. Expo Config Plugin (`plugins/withAndroidEdgeToEdge.js`)

Created a custom Expo config plugin that:
- **Enables edge-to-edge** using `enableEdgeToEdge()` (Kotlin) for backward compatibility with Android versions prior to 15
- **Configures AndroidManifest.xml** to ensure proper activity settings for edge-to-edge
- **Modifies MainActivity** to automatically call `enableEdgeToEdge()` in the `onCreate()` method

### 2. App Configuration (`app.json`)

#### Orientation Restriction Removed
- Changed `orientation: "portrait"` to `orientation: "default"`
- This allows the app to support both portrait and landscape orientations on large-screen devices (tablets, foldables)
- Addresses the Android 16 requirement that orientation restrictions will be ignored for large-screen devices

#### Android SDK Configuration
- Added `targetSdkVersion: 35` - Targets Android 15 (API level 35)
- Added `compileSdkVersion: 35` - Compiles with Android 15 SDK
- Added necessary permissions array for clarity

#### Config Plugin Integration
- Added `./plugins/withAndroidEdgeToEdge` to the plugins array
- This plugin runs during the Expo build process to modify native Android code

### 3. Root Layout Updates (`app/_layout.tsx`)

#### SafeAreaProvider Integration
- Wrapped the entire app with `SafeAreaProvider` from `react-native-safe-area-context`
- This ensures proper safe area inset handling throughout the app for edge-to-edge display

#### StatusBar Configuration
- Set `translucent={Platform.OS === 'android'}` to allow content to extend behind the status bar
- Maintains the existing `barStyle` and `backgroundColor` settings

## Benefits

1. **Android 15+ Compliance**: The app now properly supports edge-to-edge display on Android 15 and later
2. **Large Screen Support**: Removed orientation restrictions enable better support for tablets and foldables
3. **Backward Compatibility**: The `enableEdgeToEdge()` call ensures consistent behavior across Android versions
4. **Proper Inset Handling**: SafeAreaProvider ensures UI elements aren't obscured by system bars

## Testing Checklist

Before releasing, please test the following:

- [ ] App displays correctly on Android 15+ devices
- [ ] Status bar content is visible and not obscured
- [ ] Navigation bar (if present) doesn't hide UI elements
- [ ] Safe area insets work correctly on devices with notches/cutouts
- [ ] App works in both portrait and landscape orientations
- [ ] Large screen devices (tablets) display correctly in all orientations
- [ ] Edge-to-edge doesn't cause layout issues on older Android versions (backward compatibility)

## Technical Details

### Edge-to-Edge API

The plugin uses `androidx.activity.enableEdgeToEdge()` which:
- Is part of the AndroidX Activity library
- Available in AndroidX Activity 1.8.0+
- Works with Android 14+ (API 34+) but is required for Android 15+ (API 35+)
- Handles window insets automatically

### Deprecated APIs Avoided

We're no longer using deprecated APIs:
- `setStatusBarColor()` - deprecated in Android 15
- `setNavigationBarColor()` - deprecated in Android 15
- `setDecorFitsSystemWindows()` - deprecated in Android 15

Instead, the app uses the modern edge-to-edge approach with proper inset handling.

## Future Considerations

- **Android 16**: Starting with Android 16 (API 36), orientation restrictions will be ignored for large-screen devices. We've already removed the portrait-only restriction to prepare for this.

- **No Opt-Out**: In Android 16, there will be no way to opt out of edge-to-edge display, so this implementation is future-proof.

## Resources

- [Android Edge-to-Edge Documentation](https://developer.android.com/develop/ui/views/layout/edge-to-edge)
- [Android 15 Behavior Changes](https://developer.android.com/about/versions/15/behavior-changes-15)
- [Expo Config Plugins](https://docs.expo.dev/config-plugins/introduction/)

## Notes

- After making these changes, you'll need to rebuild the Android app with `eas build --platform android` or `expo run:android`
- The config plugin modifies native code during the build process
- SafeAreaView components throughout the app will automatically benefit from the SafeAreaProvider wrapper

