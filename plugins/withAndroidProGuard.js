const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Expo config plugin to configure ProGuard/R8 for Android builds
 * This ensures:
 * - R8/ProGuard is enabled for minification and obfuscation
 * - Mapping files are generated for deobfuscation
 * - ProGuard rules are properly applied
 * 
 * Note: For Expo managed workflow, R8 is enabled by default for production builds.
 * This plugin ensures ProGuard rules are properly referenced.
 */
const withAndroidProGuard = (config) => {
  // Configure app-level build.gradle to ensure ProGuard rules are referenced
  config = withAppBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;

    // Ensure ProGuard rules file is referenced in release buildType
    if (buildGradle.includes('buildTypes')) {
      // Check if release buildType exists
      if (buildGradle.includes('release')) {
        // Ensure proguard-rules.pro is referenced
        if (!buildGradle.includes('proguard-rules.pro')) {
          // Add proguardFiles to release block
          buildGradle = buildGradle.replace(
            /(release\s*\{[^}]*)/,
            (match) => {
              // Check if minifyEnabled is already present
              if (match.includes('minifyEnabled')) {
                // Add proguardFiles after minifyEnabled
                if (!match.includes('proguardFiles')) {
                  return match + "\n            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'";
                }
              } else {
                // Add both minifyEnabled and proguardFiles
                return match + "\n            minifyEnabled true\n            shrinkResources true\n            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'";
              }
              return match;
            }
          );
        }
      }
    }

    config.modResults.contents = buildGradle;
    return config;
  });

  return config;
};

module.exports = withAndroidProGuard;

