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

    // Remove window title bar (removes the "kinshipSync" bar at the top)
    mainActivity.$['android:windowNoTitle'] = 'true';

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

    // Note: We'll check for existing edge-to-edge code but still add navigation bar visibility if needed

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

      // Add imports for immersive mode
      if (!mainActivity.includes('import androidx.core.view.WindowCompat')) {
        const importMatch = mainActivity.match(/(import .+\n)+/);
        if (importMatch) {
          mainActivity = mainActivity.replace(
            importMatch[0],
            importMatch[0] + 'import androidx.core.view.WindowCompat\nimport androidx.core.view.WindowInsetsControllerCompat\n'
          );
        } else {
          mainActivity = mainActivity.replace(
            /(package .+\n)/,
            `$1import androidx.core.view.WindowCompat\nimport androidx.core.view.WindowInsetsControllerCompat\n`
          );
        }
      }

      // Add enableEdgeToEdge() call in onCreate, before super.onCreate()
      if (mainActivity.includes('override fun onCreate')) {
        if (!mainActivity.includes('enableEdgeToEdge()')) {
          // Find onCreate and add enableEdgeToEdge() with immersive mode
          mainActivity = mainActivity.replace(
            /(override fun onCreate\([^)]*\)\s*\{)\s*/,
            `$1\n        enableEdgeToEdge()\n        // Enable immersive mode - navigation bar hidden, appears only on swipe from bottom\n        WindowCompat.setDecorFitsSystemWindows(window, false)\n        val insetsController = WindowCompat.getInsetsController(window, window.decorView)\n        insetsController?.apply {\n            hide(androidx.core.view.WindowInsetsCompat.Type.navigationBars())\n            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE\n        }\n`
          );
        } else if (!mainActivity.includes('BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE')) {
          // Add immersive mode setup if enableEdgeToEdge already exists
          mainActivity = mainActivity.replace(
            /(enableEdgeToEdge\(\))\s*/,
            `$1\n        // Enable immersive mode - navigation bar hidden, appears only on swipe from bottom\n        WindowCompat.setDecorFitsSystemWindows(window, false)\n        val insetsController = WindowCompat.getInsetsController(window, window.decorView)\n        insetsController?.apply {\n            hide(androidx.core.view.WindowInsetsCompat.Type.navigationBars())\n            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE\n        }\n`
          );
        }
      } else if (mainActivity.includes('fun onCreate')) {
        // Handle non-override onCreate (less common)
        if (!mainActivity.includes('enableEdgeToEdge()')) {
          mainActivity = mainActivity.replace(
            /(fun onCreate\([^)]*\)\s*\{)\s*/,
            `$1\n        enableEdgeToEdge()\n        // Enable immersive mode - navigation bar hidden, appears only on swipe from bottom\n        WindowCompat.setDecorFitsSystemWindows(window, false)\n        val insetsController = WindowCompat.getInsetsController(window, window.decorView)\n        insetsController?.apply {\n            hide(androidx.core.view.WindowInsetsCompat.Type.navigationBars())\n            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE\n        }\n`
          );
        } else if (!mainActivity.includes('BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE')) {
          mainActivity = mainActivity.replace(
            /(enableEdgeToEdge\(\))\s*/,
            `$1\n        // Enable immersive mode - navigation bar hidden, appears only on swipe from bottom\n        WindowCompat.setDecorFitsSystemWindows(window, false)\n        val insetsController = WindowCompat.getInsetsController(window, window.decorView)\n        insetsController?.apply {\n            hide(androidx.core.view.WindowInsetsCompat.Type.navigationBars())\n            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE\n        }\n`
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

      // Add imports for immersive mode
      if (!mainActivity.includes('import androidx.core.view.WindowCompat')) {
        const importMatch = mainActivity.match(/(import .+;\n)+/);
        if (importMatch) {
          mainActivity = mainActivity.replace(
            importMatch[0],
            importMatch[0] + 'import androidx.core.view.WindowCompat;\nimport androidx.core.view.WindowInsetsControllerCompat;\n'
          );
        } else {
          mainActivity = mainActivity.replace(
            /(package .+;\n)/,
            `$1import androidx.core.view.WindowCompat;\nimport androidx.core.view.WindowInsetsControllerCompat;\n`
          );
        }
      }

      // Add EdgeToEdge.enable() call in onCreate
      if (mainActivity.includes('protected void onCreate')) {
        if (!mainActivity.includes('EdgeToEdge.enable')) {
          mainActivity = mainActivity.replace(
            /(protected void onCreate\([^)]*\)\s*\{)\s*/,
            `$1\n        EdgeToEdge.enable(this);\n        // Enable immersive mode - navigation bar hidden, appears only on swipe from bottom\n        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);\n        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());\n        if (insetsController != null) {\n            insetsController.hide(androidx.core.view.WindowInsetsCompat.Type.navigationBars());\n            insetsController.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);\n        }\n`
          );
        } else if (!mainActivity.includes('BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE')) {
          // Add immersive mode setup if EdgeToEdge.enable already exists
          mainActivity = mainActivity.replace(
            /(EdgeToEdge\.enable\(this\);)\s*/,
            `$1\n        // Enable immersive mode - navigation bar hidden, appears only on swipe from bottom\n        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);\n        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());\n        if (insetsController != null) {\n            insetsController.hide(androidx.core.view.WindowInsetsCompat.Type.navigationBars());\n            insetsController.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);\n        }\n`
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
