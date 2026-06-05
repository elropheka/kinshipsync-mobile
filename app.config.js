const appJson = require('./app.json');

const ONE_SIGNAL_APP_ID = '8d7630da-1b46-425d-a912-c9002e7c79a4';
const GOOGLE_IOS_URL_SCHEME =
  'com.googleusercontent.apps.433750501084-425hb71ogrc7p04p7cujs0t2qct3igkj';

/** @param {{ config: import('expo/config').ExpoConfig }} ctx */
module.exports = ({ config }) => {
  const { expo } = appJson;
  const oneSignalMode =
    process.env.EAS_BUILD_PROFILE === 'production' ? 'production' : 'development';

  const { newArchEnabled: _newArchEnabled, ...expoBase } = expo;
  const { deviceFamilies: _deviceFamilies, ...ios } = expoBase.ios ?? {};
  const { targetSdkVersion: _targetSdk, compileSdkVersion: _compileSdk, ...android } =
    expoBase.android ?? {};

  return {
    ...config,
    ...expoBase,
    ios: {
      ...ios,
      infoPlist: {
        ...ios.infoPlist,
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [GOOGLE_IOS_URL_SCHEME],
          },
        ],
      },
    },
    android,
    plugins: [
      ['onesignal-expo-plugin', { mode: oneSignalMode }],
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
          },
        },
      ],
      'expo-router',
      'expo-font',
      'expo-web-browser',
      'expo-apple-authentication',
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme: GOOGLE_IOS_URL_SCHEME,
        },
      ],
      '@react-native-community/datetimepicker',
      'expo-secure-store',
    ],
    extra: {
      ...expoBase.extra,
      oneSignalAppId: ONE_SIGNAL_APP_ID,
    },
  };
};
