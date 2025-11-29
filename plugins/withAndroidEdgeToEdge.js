const { withAndroidManifest, withMainActivity } = require('@expo/config-plugins');

/**
 * Expo config plugin to enable edge-to-edge display on Android 15+ (SDK 35+)
 * This ensures the app displays correctly on Android 15 and handles window insets properly
 * 
 * Features:
 * - Enables edge-to-edge using enableEdgeToEdge() for backward compatibility
 * - Ensures proper window insets handling
 * - Compatible with Android 15+ (SDK 35+)
 */
const withAndroidEdgeToEdge = (config) => {
  // Step 1: Modify AndroidManifest.xml to ensure proper activity configuration
  config = withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const { manifest } = androidManifest;

    if (!manifest.application) {
      return config;
    }

    const application = Array.isArray(manifest.application)
      ? manifest.application[0]
      : manifest.application;

    if (!application.activity) {
      return config;
    }

    const activities = Array.isArray(application.activity)
      ? application.activity
      : [application.activity];

    // Find or create the main activity
    let mainActivity = activities.find(
      (activity) =>
        activity.$['android:name'] === '.MainActivity' ||
        activity.$['android:name'] === 'com.kinship.kinshipsync.MainActivity' ||
        (activity.$['android:name'] && activity.$['android:name'].includes('MainActivity'))
    );

    if (!mainActivity) {
      mainActivity = activities[0];
    }

    // Enable edge-to-edge by setting windowSoftInputMode
    if (!mainActivity.$['android:windowSoftInputMode']) {
      mainActivity.$['android:windowSoftInputMode'] = 'adjustResize';
    }

    // Ensure proper configuration for edge-to-edge
    if (!mainActivity.$['android:configChanges']) {
      mainActivity.$['android:configChanges'] =
        'keyboard|keyboardHidden|orientation|screenSize|uiMode';
    }

    return config;
  });

  // Step 2: Modify MainActivity to enable edge-to-edge
  config = withMainActivity(config, (config) => {
    let mainActivity = config.modResults.contents;

    // Check if edge-to-edge is already enabled
    if (mainActivity.includes('enableEdgeToEdge') || mainActivity.includes('EdgeToEdge.enable')) {
      return config;
    }

    // Expo SDK 53 uses Kotlin by default
    const isKotlin = mainActivity.includes('fun ') || mainActivity.includes('class MainActivity') && !mainActivity.includes('public class MainActivity');

    if (isKotlin) {
      // Kotlin implementation
      // Add import if not present
      if (!mainActivity.includes('import androidx.activity.enableEdgeToEdge')) {
        // Find the last import statement (Kotlin imports don't have semicolons)
        const importMatch = mainActivity.match(/(import .+\n)+/);
        if (importMatch) {
          mainActivity = mainActivity.replace(
            importMatch[0],
            importMatch[0] + 'import androidx.activity.enableEdgeToEdge\n'
          );
        } else {
          // Add import after package declaration
          mainActivity = mainActivity.replace(
            /(package .+\n)/,
            `$1import androidx.activity.enableEdgeToEdge\n`
          );
        }
      }

      // Add enableEdgeToEdge() call in onCreate, before super.onCreate()
      if (mainActivity.includes('override fun onCreate')) {
        if (!mainActivity.includes('enableEdgeToEdge()')) {
          // Find onCreate and add enableEdgeToEdge() as first line
          mainActivity = mainActivity.replace(
            /(override fun onCreate\([^)]*\)\s*\{)\s*/,
            `$1\n        enableEdgeToEdge()\n`
          );
        }
      } else if (mainActivity.includes('fun onCreate')) {
        // Handle non-override onCreate (less common)
        if (!mainActivity.includes('enableEdgeToEdge()')) {
          mainActivity = mainActivity.replace(
            /(fun onCreate\([^)]*\)\s*\{)\s*/,
            `$1\n        enableEdgeToEdge()\n`
          );
        }
      }
    } else {
      // Java implementation
      // Add import if not present
      if (!mainActivity.includes('import androidx.activity.EdgeToEdge')) {
        const importMatch = mainActivity.match(/(import .+;\n)+/);
        if (importMatch) {
          mainActivity = mainActivity.replace(
            importMatch[0],
            importMatch[0] + 'import androidx.activity.EdgeToEdge;\n'
          );
        } else {
          mainActivity = mainActivity.replace(
            /(package .+;\n)/,
            `$1import androidx.activity.EdgeToEdge;\n`
          );
        }
      }

      // Add EdgeToEdge.enable() call in onCreate
      if (mainActivity.includes('protected void onCreate')) {
        if (!mainActivity.includes('EdgeToEdge.enable')) {
          mainActivity = mainActivity.replace(
            /(protected void onCreate\([^)]*\)\s*\{)\s*/,
            `$1\n        EdgeToEdge.enable(this);\n`
          );
        }
      }
    }

    config.modResults.contents = mainActivity;
    return config;
  });

  return config;
};

module.exports = withAndroidEdgeToEdge;
