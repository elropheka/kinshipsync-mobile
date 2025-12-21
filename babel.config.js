module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'babel-plugin-inline-dotenv',
        {
          path: '.env', // Path to .env file (for local development)
          systemVar: 'overwrite', // Use system environment variables if available
          // For EAS builds, environment variables are provided via EAS Secrets
          // and are automatically available as process.env variables
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
