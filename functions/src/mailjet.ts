import * as functions from "firebase-functions/v1"; // Use v1 for consistency
import Mailjet from "node-mailjet"; // Corrected import for node-mailjet

// Initialize Mailjet client lazily to ensure config is available
// IMPORTANT: Config must be set using Firebase CLI:
// firebase functions:config:set mailjet.api_key="YOUR_MAILJET_API_KEY" mailjet.api_secret="YOUR_MAILJET_API_SECRET"
function getMailjetClient() {
  // eslint-disable-next-line import/namespace
  const apiKey = functions.config().mailjet?.api_key;
  // eslint-disable-next-line import/namespace
  const apiSecret = functions.config().mailjet?.api_secret;
  
  if (!apiKey || !apiSecret) {
    throw new Error("Mailjet API credentials are not configured. Please set them using firebase functions:config:set");
  }
  
  return Mailjet.apiConnect(apiKey, apiSecret);
}

// Define the interface for the data payload expected by the sendEmail function
interface SendEmailData {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  fromEmail?: string;
  fromName?: string;
}

/**
 * Callable Cloud Function to send emails via Mailjet.
 * This function should be called from the mobile client.
 *
 * @param {object} data - The data for the email.
 * @param {string} data.toEmail - Recipient's email address.
 * @param {string} data.toName - Recipient's name (optional).
 * @param {string} data.subject - Email subject.
 * @param {string} data.htmlContent - HTML content of the email.
 * @param {string} [data.fromEmail='kinshipsync@kinshipsync.com'] - Sender's email address.
 * @param {string} [data.fromName='KinshipSync'] - Sender's name.
 */
export const sendEmail = functions.https.onCall(async (data: SendEmailData, _context) => {
  // Optional: Authenticate the user if necessary
  // if (!context.auth) {
  //   throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  // }

  const { toEmail, toName, subject, htmlContent, fromEmail, fromName } = data;

  if (!toEmail || !subject || !htmlContent) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with \"toEmail\", \"subject\", and \"htmlContent\"."
    );
  }

  try {
    const mailjet = getMailjetClient();
    const request = mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: fromEmail || "kinshipsync@kinshipsync.com", // Replace with your verified sender email
              Name: fromName || "KinshipSync",
            },
            To: [
              {
                Email: toEmail,
                Name: toName || "",
              },
            ],
            Subject: subject,
            HTMLPart: htmlContent,
          },
        ],
      });

    const result = await request;
    functions.logger.info("Mailjet email sent successfully:", result.body);
    return { success: true, message: "Email sent successfully!" };
  } catch (error: any) {
    functions.logger.error("Error sending email with Mailjet:", error.statusCode, error.message, error.response?.body);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to send email.",
      error.message
    );
  }
});
