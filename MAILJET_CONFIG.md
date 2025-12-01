# Mailjet Configuration

## ✅ Configuration Status

Your Mailjet API credentials have been set in Firebase Functions config:

- **API Key**: `bfc441e8dd2a33fc2121a9c35b1f8bde`
- **API Secret**: `49a2f0b53d1671ecffe6d4d2205ec2b0`

## Verification

To verify the configuration is set correctly, run:

```bash
cd functions
firebase functions:config:get
```

You should see the mailjet configuration in the output.

## Next Steps

### 1. Deploy Functions (if not already deployed)

The config has been set, but you need to deploy your functions for the changes to take effect:

```bash
cd functions
npm run build
firebase deploy --only functions
```

### 2. Test Email Sending

After deployment, you can test email sending by triggering a notification that sends an email (e.g., inviting a guest to an event).

## Security Note

⚠️ **Important**: These credentials are now stored in Firebase Functions config. To view or update them:

- **View config**: `firebase functions:config:get`
- **Update config**: 
  ```bash
  firebase functions:config:set mailjet.api_key="NEW_KEY" mailjet.api_secret="NEW_SECRET"
  ```

## Mailjet Setup

Make sure in your Mailjet account:

1. ✅ API Key and Secret are active
2. ✅ Sender email `kinshipsync@kinshipsync.com` (or your configured sender) is verified
3. ✅ Domain is verified (if using custom domain)

## Code Reference

The Mailjet configuration is used in:
- `functions/src/mailjet.ts` - Email sending Cloud Function
- Called from `services/notificationService.ts` - `sendEmailNotificationInternal()`

The function will automatically use these credentials from Firebase config when sending emails.

