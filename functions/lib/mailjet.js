"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const functions = __importStar(require("firebase-functions/v1")); // Use v1 for consistency
const node_mailjet_1 = __importDefault(require("node-mailjet")); // Corrected import for node-mailjet
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
    return node_mailjet_1.default.apiConnect(apiKey, apiSecret);
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
exports.sendEmail = functions.https.onCall(async (data, _context) => {
    // Optional: Authenticate the user if necessary
    // if (!context.auth) {
    //   throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    // }
    const { toEmail, toName, subject, htmlContent, fromEmail, fromName } = data;
    if (!toEmail || !subject || !htmlContent) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with \"toEmail\", \"subject\", and \"htmlContent\".");
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
    }
    catch (error) {
        functions.logger.error("Error sending email with Mailjet:", error.statusCode, error.message, error.response?.body);
        throw new functions.https.HttpsError("internal", "Failed to send email.", error.message);
    }
});
//# sourceMappingURL=mailjet.js.map