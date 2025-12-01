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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const functions = __importStar(require("firebase-functions/v1"));
// Initialize Twilio client with credentials from environment variables
// IMPORTANT: These environment variables must be set using Firebase CLI:
// firebase functions:config:set twilio.account_sid="YOUR_TWILIO_ACCOUNT_SID" twilio.auth_token="YOUR_TWILIO_AUTH_TOKEN" twilio.phone_number="YOUR_TWILIO_PHONE_NUMBER"
// Note: Config values set via firebase functions:config:set are automatically available as environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";
// Twilio API endpoint
const TWILIO_API_URL = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
/**
 * Callable Cloud Function to send SMS via Twilio.
 * This function should be called from the mobile client.
 *
 * @param {object} data - The data for the SMS.
 * @param {string} data.toPhoneNumber - Recipient's phone number in E.164 format (e.g., +1234567890).
 * @param {string} data.message - SMS message content.
 * @param {string} [data.fromPhoneNumber] - Sender phone number (optional, uses configured Twilio number if not provided).
 */
exports.sendSMS = functions.https.onCall(async (data, _context) => {
    // Optional: Authenticate the user if necessary
    // if (!context.auth) {
    //   throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    // }
    const { toPhoneNumber, message, fromPhoneNumber } = data;
    if (!toPhoneNumber || !message) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with \"toPhoneNumber\" and \"message\".");
    }
    // Validate phone number format (basic E.164 format check)
    if (!/^\+[1-9]\d{1,14}$/.test(toPhoneNumber)) {
        throw new functions.https.HttpsError("invalid-argument", "Phone number must be in E.164 format (e.g., +1234567890).");
    }
    // Validate message length (Twilio supports up to 1600 characters for concatenated SMS)
    if (message.length === 0) {
        throw new functions.https.HttpsError("invalid-argument", "Message cannot be empty.");
    }
    if (message.length > 1600) {
        throw new functions.https.HttpsError("invalid-argument", "Message cannot exceed 1600 characters.");
    }
    // Validate Twilio configuration
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
        throw new functions.https.HttpsError("failed-precondition", "Twilio credentials are not configured. Please set them using firebase functions:config:set twilio.account_sid=\"YOUR_SID\" twilio.auth_token=\"YOUR_TOKEN\" twilio.phone_number=\"YOUR_NUMBER\".");
    }
    const senderPhoneNumber = fromPhoneNumber || TWILIO_PHONE_NUMBER;
    if (!senderPhoneNumber) {
        throw new functions.https.HttpsError("failed-precondition", "Twilio phone number is not configured and no fromPhoneNumber was provided. Please set twilio.phone_number or provide fromPhoneNumber.");
    }
    try {
        // Twilio API requires Basic Auth with Account SID as username and Auth Token as password
        const authHeader = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
        // Twilio API endpoint for sending SMS
        const response = await fetch(TWILIO_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Basic ${authHeader}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                From: senderPhoneNumber,
                To: toPhoneNumber,
                Body: message,
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.error || errorMessage;
            }
            catch {
                // If parsing fails, use the text as-is
                errorMessage = errorText || errorMessage;
            }
            functions.logger.error("Twilio API error:", response.status, errorMessage);
            throw new Error(errorMessage);
        }
        const result = await response.json();
        functions.logger.info("Twilio SMS sent successfully:", result.sid);
        return {
            success: true,
            message: "SMS sent successfully!",
            messageId: result.sid, // Twilio message SID
            status: result.status,
        };
    }
    catch (error) {
        const errorMessage = error.message || "Unknown error";
        functions.logger.error("Error sending SMS with Twilio:", errorMessage, error);
        throw new functions.https.HttpsError("internal", "Failed to send SMS.", errorMessage);
    }
});
//# sourceMappingURL=twilio.js.map