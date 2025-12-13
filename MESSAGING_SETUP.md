# Messaging Service Setup Guide

This guide explains how to configure the messaging service integration for sending text messages, emails, and push notifications.

## Overview

The mobile app now uses the `kinshipsync-messaging` service API instead of Firebase Cloud Functions for sending notifications. The messaging service is hosted at: `https://kinshipsync-messaging.vercel.app`

## Configuration

### Option 1: .env File (Recommended for Local Development)

Create a `.env` file in the root of the `kinshipsync-mobile` directory:

```env
MESSAGING_API_URL=https://kinshipsync-messaging.vercel.app
MESSAGING_API_TOKEN=your_api_token_here
```

**Note:** The `.env` file is automatically loaded by `babel-plugin-inline-dotenv` during the build process. Make sure to:
- Copy `.env.example` to `.env` and fill in your values
- Add `.env` to `.gitignore` (never commit your `.env` file!)
- The variables are inlined at build time, so you need to restart your dev server after changing `.env`

### Option 2: EAS Secrets (Recommended for Production Builds)

For production builds with EAS, use EAS Secrets to securely store your API token:

```bash
# Set the messaging API token as an EAS secret
eas secret:create --scope project --name MESSAGING_API_TOKEN --value your_api_token_here

# Optionally set the API URL (though it's already in eas.json)
eas secret:create --scope project --name MESSAGING_API_URL --value https://kinshipsync-messaging.vercel.app
```

**Note:** EAS Secrets are automatically available as environment variables during the build process. They are:
- Encrypted and stored securely
- Only accessible during builds
- Not included in your code or app bundle

To view your secrets:
```bash
eas secret:list
```

To delete a secret:
```bash
eas secret:delete --name MESSAGING_API_TOKEN
```

### Option 3: app.json Configuration (Not Recommended)

The messaging API URL is already configured in `app.json`. You can add the token here, but it's **not recommended** for production as it will be included in your app bundle:

```json
{
  "expo": {
    "extra": {
      "messagingApiUrl": "https://kinshipsync-messaging.vercel.app",
      "messagingApiToken": "your_api_token_here"
    }
  }
}
```

### Option 4: SecureStore (Runtime Configuration)

Store the API token securely using SecureStore at runtime:

```typescript
import { setMessagingApiToken } from './services/messagingService';

// Set the token (e.g., after user login or app initialization)
await setMessagingApiToken('your_api_token_here');
```

## Priority Order

The messaging service checks for the API token in this order:

1. `process.env.MESSAGING_API_TOKEN` (from `.env` file or EAS Secrets - inlined at build time)
2. `Constants.expoConfig.extra.messagingApiToken` (app.json)
3. SecureStore `messagingApiToken` key (runtime)

**For Production Builds:**
- Use **EAS Secrets** (Option 2) - most secure, recommended for production
- The token is inlined at build time and not exposed in the app bundle

**For Local Development:**
- Use **.env file** (Option 1) - easiest for development
- Restart your dev server after changing `.env` values

## API Endpoints

The messaging service provides three endpoints:

- **POST /email** - Send email notifications
- **POST /text** - Send SMS/text messages
- **POST /push** - Send push notifications

All endpoints require authentication via the API token in the `Authorization: Bearer <token>` header or `x-api-token` header.

## Usage

The messaging service is automatically used by `notificationService.ts`. The following functions now use the messaging API:

- `sendPushNotificationInternal()` - Sends push notifications
- `sendSMSNotificationInternal()` - Sends SMS/text messages
- `sendEmailNotificationInternal()` - Sends email notifications

No changes are needed in your existing code that calls these functions.

## Getting Your API Token

Contact your backend administrator or check your messaging service configuration to obtain the API token. The token should match the `API_TOKEN` environment variable configured in your `kinshipsync-messaging` service.

## Setup Checklist

### For Local Development:
- [ ] Copy `.env.example` to `.env`
- [ ] Add your `MESSAGING_API_TOKEN` to `.env`
- [ ] Restart your Expo dev server (`npm start` or `expo start`)

### For Production Builds:
- [ ] Set EAS secrets: `eas secret:create --scope project --name MESSAGING_API_TOKEN --value your_token`
- [ ] Verify secrets: `eas secret:list`
- [ ] Build with EAS: `eas build --platform ios` or `eas build --platform android`

## Troubleshooting

### "Messaging API token not found" Warning

This means the API token hasn't been configured. Use one of the configuration options above to set it.

### Environment Variables Not Loading

- **For .env files:** Make sure you've restarted your dev server after creating/modifying `.env`
- **For EAS builds:** Verify secrets are set with `eas secret:list`
- **Check babel.config.js:** Ensure `babel-plugin-inline-dotenv` is configured correctly

### Authentication Errors (401/403)

- Verify the API token is correct
- Ensure the token matches the `API_TOKEN` in your messaging service environment
- Check that the token is being sent in the request headers

### Network Errors

- Verify the `MESSAGING_API_URL` is correct
- Check your internet connection
- Ensure the messaging service is deployed and accessible
