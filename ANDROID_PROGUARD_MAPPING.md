# Android ProGuard/R8 Mapping Files Configuration

## Overview

This document explains how mapping files (deobfuscation files) are handled for Android builds with ProGuard/R8 obfuscation to resolve the warning: "There is no deobfuscation file associated with this App Bundle."

## What Are Mapping Files?

When Android apps use R8/ProGuard to obfuscate and minify code (which reduces app size), the code becomes difficult to read. Mapping files map the obfuscated code back to the original source code, making crash reports readable for debugging.

## Solution Implemented

### 1. ProGuard Rules File

Created `android/proguard-rules.pro` with rules for:
- React Native classes and methods
- Firebase and Google Sign-In classes  
- Expo modules compatibility
- Native method names for debugging
- Your app's custom classes

### 2. Config Plugin

Created `plugins/withAndroidProGuard.js` that:
- Ensures ProGuard rules are properly referenced in build.gradle
- Configures R8/ProGuard settings for release builds
- Automatically applies during Expo builds

### 3. Build Configuration

For Expo apps:
- **R8/ProGuard is enabled by default** for production builds in Expo SDK 53+
- **Mapping files are automatically generated** during the build process
- The files are located in: `android/app/build/outputs/mapping/release/mapping.txt`

## How Mapping Files Work with EAS Build

### Automatic Upload (Recommended Method)

When using **EAS Build** and **EAS Submit**, mapping files are **automatically uploaded** to Google Play Console:

```bash
# Build the app
eas build --platform android --profile production

# Submit to Play Console (automatically uploads mapping file)
eas submit --platform android
```

The `eas submit` command automatically:
1. Finds the mapping file from the build
2. Uploads it alongside the AAB to Google Play Console
3. Associates it with the correct version code

### Manual Upload

If you're manually uploading the AAB to Google Play Console:

1. **Download the mapping file** from EAS Build:
   - Go to https://expo.dev
   - Navigate to your project → Builds
   - Find your production build
   - Download the build artifacts
   - Extract and locate `mapping.txt` file

2. **Upload to Google Play Console**:
   - Go to Google Play Console → Your App → Release → Production (or your track)
   - Find your release version
   - Click on the release → "Upload files" or "Deobfuscation file"
   - Upload `mapping.txt`
   - **Important**: Ensure the version code matches your AAB exactly

## Location of Mapping Files

Mapping files are generated during the build at:
```
android/app/build/outputs/mapping/release/mapping.txt
```

**Critical**: Each build generates a unique mapping file. You **MUST** use the mapping file from the exact same build as your AAB, otherwise deobfuscation won't work.

## Verifying the Fix

After uploading your AAB and mapping file:

1. Go to Google Play Console
2. Navigate to Release → Production (or your release track)
3. Check that the warning is gone: "There is no deobfuscation file associated with this App Bundle"
4. Verify crash reports show readable code (not obfuscated class/method names)

## Troubleshooting

### Warning Still Appears

If you still see the warning:
- ✅ Check that you uploaded the mapping file from the **same build** as your AAB
- ✅ Verify the version code of the mapping file matches the AAB version code exactly
- ✅ Wait a few minutes for Google Play Console to process the file
- ✅ Ensure you're checking the correct release track (internal, alpha, beta, or production)

### Mapping File Not Found in Build

If you can't find the mapping file:
- R8/ProGuard is enabled by default for production builds in Expo
- Check EAS Build artifacts for `mapping.txt`
- Verify the build completed successfully
- For local builds, check `android/app/build/outputs/mapping/release/`

### Crash Reports Still Obfuscated

If crash reports show obfuscated code:
- Verify the mapping file version code matches the AAB version code exactly
- Ensure you uploaded the mapping file from the correct build
- Wait for Google Play Console to process the file (can take a few minutes)
- Check that the mapping file wasn't corrupted during upload/download

## Best Practices

1. **Always use `eas submit`**: This automatically handles mapping file uploads
2. **Store mapping files**: Save mapping files for each release in case you need them later for debugging
3. **Version matching**: Always ensure mapping file version code matches AAB version code
4. **Test with internal track**: Upload mapping files to internal testing first to verify they work before production

## Files Created/Modified

- ✅ `android/proguard-rules.pro` - ProGuard rules for React Native, Firebase, Expo
- ✅ `plugins/withAndroidProGuard.js` - Config plugin to ensure ProGuard is properly configured
- ✅ `app.json` - Added ProGuard plugin to plugins array
- ✅ `eas.json` - Existing configuration (no changes needed)

## Next Steps

1. **Rebuild your app** with the new configuration:
   ```bash
   eas build --platform android --profile production
   ```

2. **Submit using EAS Submit** (recommended - handles mapping file automatically):
   ```bash
   eas submit --platform android
   ```

3. **Or manually upload**:
   - Download the mapping file from your EAS build
   - Upload AAB to Google Play Console
   - Upload the matching mapping.txt file

4. **Verify**:
   - Check Google Play Console - warning should be gone
   - Test crash reporting to ensure deobfuscation works

## Additional Resources

- [Android R8 Documentation](https://developer.android.com/studio/build/shrink-code)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Google Play Console - Upload Mapping Files](https://support.google.com/googleplay/android-developer/answer/9848633)

## Notes

- ✅ R8/ProGuard is enabled by default for production builds in Expo
- ✅ Mapping files are generated automatically during builds  
- ✅ EAS Submit automatically uploads mapping files (recommended)
- ✅ Always keep mapping files for each release for debugging purposes
- ✅ The warning will disappear once the mapping file is uploaded to Google Play Console
