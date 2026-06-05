const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const PODFILE_HOOK = `
    # Xcode 26 + prebuilt React-Core: disable Swift explicit modules on all pod targets.
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        build_config.build_settings['SWIFT_ENABLE_EXPLICIT_MODULES'] = 'NO'
      end
    end`;

/**
 * Ensures SWIFT_ENABLE_EXPLICIT_MODULES=NO is applied to every CocoaPods target.
 * Required for Xcode 26 when using React Native prebuilt binaries (SDK 55 default).
 */
function withIosXcode26SwiftModulesFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) {
        return config;
      }

      let podfile = fs.readFileSync(podfilePath, 'utf8');
      if (podfile.includes('SWIFT_ENABLE_EXPLICIT_MODULES')) {
        return config;
      }

      const anchor = 'react_native_post_install(';
      const anchorIndex = podfile.indexOf(anchor);
      if (anchorIndex === -1) {
        return config;
      }

      let depth = 0;
      let insertIndex = -1;
      for (let i = anchorIndex; i < podfile.length; i += 1) {
        const char = podfile[i];
        if (char === '(') {
          depth += 1;
        } else if (char === ')') {
          depth -= 1;
          if (depth === 0) {
            insertIndex = i + 1;
            break;
          }
        }
      }

      if (insertIndex === -1) {
        return config;
      }

      podfile =
        podfile.slice(0, insertIndex) + PODFILE_HOOK + podfile.slice(insertIndex);
      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
}

module.exports = withIosXcode26SwiftModulesFix;
