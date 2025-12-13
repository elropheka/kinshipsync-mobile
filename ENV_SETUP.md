# Environment Variables Setup Guide

This guide explains how to set up environment variables for both local development and EAS production builds.

## Quick Start

### For Local Development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your values:
   ```env
   MESSAGING_API_URL=https://kinshipsync-messaging.vercel.app
   MESSAGING_API_TOKEN=your_api_token_here
   ```

3. Restart your Expo dev server:
   ```bash
   npm start -- --clear
   # or
   expo start --clear
   ```

### For EAS Production Builds:

1. Set EAS Secrets (one-time setup):
   ```bash
   # Set the messaging API token
   eas secret:create --scope project --name MESSAGING_API_TOKEN --value your_api_token_here
   
   # Optionally set the API URL (though it's already in eas.json)
   eas secret:create --scope project --name MESSAGING_API_URL --value https://kinshipsync-messaging.vercel.app
   ```

2. Verify secrets are set:
   ```bash
   eas secret:list
   ```

3. Build your app:
   ```bash
   eas build --platform ios
   # or
   eas build --platform android
   ```

## How It Works

### Local Development

- **babel-plugin-inline-dotenv** reads your `.env` file
- Variables are inlined into your code at build time
- You must restart Metro bundler after changing `.env` values

### EAS Production Builds

- EAS Secrets are automatically available as `process.env` variables during builds
- Secrets are encrypted and never included in your code repository
- The `eas.json` file already includes `MESSAGING_API_URL` in the build environment

## Environment Variable Priority

The app checks for environment variables in this order:

1. `process.env.MESSAGING_API_TOKEN` (from `.env` or EAS Secrets)
2. `process.env.MESSAGING_API_URL` (from `.env` or EAS Secrets)
3. `Constants.expoConfig.extra.messagingApiUrl` (from `app.json`)
4. SecureStore (runtime storage)

## Managing EAS Secrets

### View all secrets:
```bash
eas secret:list
```

### Update a secret:
```bash
eas secret:create --scope project --name MESSAGING_API_TOKEN --value new_token_value
```

### Delete a secret:
```bash
eas secret:delete --name MESSAGING_API_TOKEN
```

## Important Notes

- ✅ **DO** commit `.env.example` to version control
- ❌ **DON'T** commit `.env` to version control (it's in `.gitignore`)
- ✅ **DO** use EAS Secrets for production builds
- ❌ **DON'T** hardcode sensitive values in `app.json` or code
- 🔄 **ALWAYS** restart Metro bundler after changing `.env` files

## Troubleshooting

### Variables not loading in development:
- Make sure `.env` file exists in the project root
- Restart Metro bundler with `--clear` flag
- Check that `babel-plugin-inline-dotenv` is in `babel.config.js`

### Variables not loading in EAS builds:
- Verify secrets are set: `eas secret:list`
- Check that secret names match exactly (case-sensitive)
- Ensure you're using the correct EAS project

### "Messaging API token not found" warning:
- For development: Check your `.env` file
- For production: Verify EAS secrets are set
- The token can also be set at runtime using SecureStore
