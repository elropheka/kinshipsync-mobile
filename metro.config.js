const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for path aliases
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
};

// Add support for firebase
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

// Ensure expo-router is transformed so EXPO_ROUTER_APP_ROOT can be inlined
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Make sure expo-router is included in the transform
config.resolver.sourceExts = [...config.resolver.sourceExts];

module.exports = config;