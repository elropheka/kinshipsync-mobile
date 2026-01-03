/**
 * Email templates for various notification types
 * All templates return objects with subject and htmlContent properties
 */

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
}

// Brand colors from Colors.ts
const BRAND_COLORS = {
  teal: '#008080',
  lightTeal: '#4DB6AC',
  baseNude: '#F5EBDD',
  lightNude: '#FBF6EF',
  brown: '#A47551',
  darkBrown: '#7B4E2D',
  white: '#FFFFFF',
  textDark: '#076678',
  textSecondary: '#687076',
};

/**
 * Wraps email content in a beautiful styled HTML template
 */
const wrapEmailTemplate = (title: string, content: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND_COLORS.lightNude};">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${BRAND_COLORS.lightNude};">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: ${BRAND_COLORS.white}; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND_COLORS.teal} 0%, ${BRAND_COLORS.lightTeal} 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: ${BRAND_COLORS.white}; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                ${title}
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6;">
                ${content}
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: ${BRAND_COLORS.baseNude}; padding: 24px 40px; text-align: center; border-top: 1px solid ${BRAND_COLORS.lightNude};">
              <p style="margin: 0; color: ${BRAND_COLORS.textSecondary}; font-size: 14px; line-height: 1.5;">
                <strong style="color: ${BRAND_COLORS.teal};">KinshipSync</strong><br>
                Bringing families together, one event at a time.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Helper to create styled content sections
 */
const createContentSection = (content: string): string => {
  return content.replace(/<p>/g, '<p style="margin: 0 0 16px 0;">')
    .replace(/<h2>/g, '<h2 style="margin: 0 0 24px 0; color: ' + BRAND_COLORS.teal + '; font-size: 24px; font-weight: 600;">')
    .replace(/<strong>/g, '<strong style="color: ' + BRAND_COLORS.darkBrown + '; font-weight: 600;">');
};

/**
 * Helper to create info boxes
 */
const createInfoBox = (items: { label: string; value: string }[]): string => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 16px; background-color: ${BRAND_COLORS.lightNude}; border-left: 3px solid ${BRAND_COLORS.teal};">
        <strong style="color: ${BRAND_COLORS.teal}; display: block; margin-bottom: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${item.label}</strong>
        <span style="color: ${BRAND_COLORS.textDark}; font-size: 16px;">${item.value}</span>
      </td>
    </tr>
  `).join('');
  
  return `
    <table role="presentation" style="width: 100%; margin: 24px 0; border-collapse: collapse;">
      ${itemsHtml}
    </table>
  `;
};

/**
 * Generic notification email template
 */
export const getGenericNotificationEmail = (title: string, body: string): EmailTemplate => {
  const content = createContentSection(`
    <p>${body}</p>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);
  
  return {
    subject: title,
    htmlContent: wrapEmailTemplate(title, content),
  };
};

/**
 * Event invitation email template
 */
export const getEventInvitationEmail = (
  guestName: string,
  organizerName: string,
  eventName: string,
  eventDate: string,
  eventTime?: string,
  eventLocation?: string
): EmailTemplate => {
  const formattedDate = formatDateForSMS(eventDate);
  const formattedTime = formatTimeForSMS(eventTime);
  
  const infoItems = [
    { label: '📅 Event', value: eventName },
    { label: '📆 Date', value: formattedDate },
  ];
  
  if (formattedTime) {
    infoItems.push({ label: '⏰ Time', value: formattedTime });
  }
  
  if (eventLocation) {
    infoItems.push({ label: '📍 Location', value: eventLocation });
  }

  const content = createContentSection(`
    <h2>🎉 You're Invited!</h2>
    <p>Hi ${guestName},</p>
    <p><strong>${organizerName}</strong> has invited you to <strong>${eventName}</strong>.</p>
    ${createInfoBox(infoItems)}
    <p style="margin-top: 24px; padding: 16px; background-color: ${BRAND_COLORS.lightNude}; border-radius: 8px; text-align: center;">
      Please RSVP in the app or visit the event website to confirm your attendance.
    </p>
  `);

  return {
    subject: `You're invited to ${eventName}!`,
    htmlContent: wrapEmailTemplate("You're Invited!", content),
  };
};

/**
 * RSVP reminder email template
 */
export const getRsvpReminderEmail = (
  guestName: string,
  organizerName: string,
  eventName: string,
  eventDate: string,
  eventTime?: string,
  eventLocation?: string
): EmailTemplate => {
  const formattedDate = formatDateForSMS(eventDate);
  const formattedTime = formatTimeForSMS(eventTime);
  
  const infoItems = [
    { label: '📅 Event', value: eventName },
    { label: '📆 Date', value: formattedDate },
  ];
  
  if (formattedTime) {
    infoItems.push({ label: '⏰ Time', value: formattedTime });
  }
  
  if (eventLocation) {
    infoItems.push({ label: '📍 Location', value: eventLocation });
  }

  const content = createContentSection(`
    <h2>⏰ RSVP Reminder</h2>
    <p>Hi ${guestName},</p>
    <p>This is a friendly reminder that <strong>${organizerName}</strong> has invited you to <strong>${eventName}</strong>.</p>
    ${createInfoBox(infoItems)}
    <p style="margin-top: 24px; padding: 16px; background-color: ${BRAND_COLORS.lightNude}; border-radius: 8px; text-align: center;">
      Please RSVP in the app or visit the event website to confirm your attendance.
    </p>
  `);

  return {
    subject: `Reminder: You're invited to ${eventName}!`,
    htmlContent: wrapEmailTemplate('RSVP Reminder', content),
  };
};

/**
 * Team member added email template
 */
export const getTeamMemberAddedEmail = (
  recipientName: string,
  memberName: string,
  teamName: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>New Team Member</h2>
    <p>Hi ${recipientName},</p>
    <p><strong>${memberName}</strong> has joined the <strong>${teamName}</strong> team.</p>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'New Team Member',
    htmlContent: wrapEmailTemplate('New Team Member', content),
  };
};

/**
 * Family tree update email template
 */
export const getFamilyTreeUpdateEmail = (
  recipientName: string,
  teamName: string,
  updateDetails: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Family Tree Update</h2>
    <p>Hi ${recipientName},</p>
    <p>The family tree for <strong>${teamName}</strong> has been updated: ${updateDetails}.</p>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Family Tree Update',
    htmlContent: wrapEmailTemplate('Family Tree Update', content),
  };
};

/**
 * Team task update email template
 */
export const getTeamTaskUpdateEmail = (
  recipientName: string,
  taskTitle: string,
  teamName: string,
  status: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Team Task Update</h2>
    <p>Hi ${recipientName},</p>
    <p>Task "<strong>${taskTitle}</strong>" in <strong>${teamName}</strong> is now <strong>${status}</strong>.</p>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Team Task Update',
    htmlContent: wrapEmailTemplate('Team Task Update', content),
  };
};

/**
 * Vendor booking email template
 */
export const getVendorBookingEmail = (
  recipientName: string,
  vendorName: string,
  eventName: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Vendor Booked</h2>
    <p>Hi ${recipientName},</p>
    <p><strong>${vendorName}</strong> has been booked for <strong>${eventName}</strong>.</p>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Vendor Booked',
    htmlContent: wrapEmailTemplate('Vendor Booked', content),
  };
};

/**
 * Vendor confirmation email template
 */
export const getVendorConfirmationEmail = (
  recipientName: string,
  vendorName: string,
  eventName: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Vendor Confirmed</h2>
    <p>Hi ${recipientName},</p>
    <p><strong>${vendorName}</strong> has confirmed for <strong>${eventName}</strong>.</p>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Vendor Confirmed',
    htmlContent: wrapEmailTemplate('Vendor Confirmed', content),
  };
};

/**
 * Vendor quote email template
 */
export const getVendorQuoteEmail = (
  recipientName: string,
  vendorName: string,
  eventName: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>New Vendor Quote</h2>
    <p>Hi ${recipientName},</p>
    <p>You have a new quote from <strong>${vendorName}</strong> for <strong>${eventName}</strong>.</p>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'New Vendor Quote',
    htmlContent: wrapEmailTemplate('New Vendor Quote', content),
  };
};

/**
 * Budget item added email template
 */
export const getBudgetItemAddedEmail = (
  recipientName: string,
  itemName: string,
  eventName: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>New Budget Item</h2>
    <p>Hi ${recipientName},</p>
    <p>"<strong>${itemName}</strong>" has been added to the budget for <strong>${eventName}</strong>.</p>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'New Budget Item',
    htmlContent: wrapEmailTemplate('New Budget Item', content),
  };
};

/**
 * Payment made email template
 */
export const getPaymentMadeEmail = (
  recipientName: string,
  itemName: string,
  amount: number,
  eventName: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Payment Recorded</h2>
    <p>Hi ${recipientName},</p>
    <div style="margin: 24px 0; padding: 20px; background-color: ${BRAND_COLORS.lightNude}; border-radius: 8px; border-left: 4px solid ${BRAND_COLORS.teal};">
      <p style="margin: 0 0 8px 0; color: ${BRAND_COLORS.textSecondary}; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Amount</p>
      <p style="margin: 0; font-size: 32px; font-weight: 600; color: ${BRAND_COLORS.teal};">$${amount.toFixed(2)}</p>
      <p style="margin: 8px 0 0 0; color: ${BRAND_COLORS.textDark};">for "<strong>${itemName}</strong>" in <strong>${eventName}</strong></p>
    </div>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Payment Recorded',
    htmlContent: wrapEmailTemplate('Payment Recorded', content),
  };
};

/**
 * Budget milestone email template
 */
export const getBudgetMilestoneEmail = (
  recipientName: string,
  eventName: string,
  percentage: number
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Budget Milestone</h2>
    <p>Hi ${recipientName},</p>
    <div style="margin: 24px 0; padding: 20px; background-color: ${BRAND_COLORS.lightNude}; border-radius: 8px; text-align: center;">
      <p style="margin: 0 0 8px 0; color: ${BRAND_COLORS.textSecondary}; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Budget Allocated</p>
      <p style="margin: 0; font-size: 48px; font-weight: 600; color: ${BRAND_COLORS.teal};">${percentage}%</p>
      <p style="margin: 8px 0 0 0; color: ${BRAND_COLORS.textDark};">for <strong>${eventName}</strong></p>
    </div>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Budget Milestone',
    htmlContent: wrapEmailTemplate('Budget Milestone', content),
  };
};

/**
 * RSVP received email template
 */
export const getRsvpReceivedEmail = (
  recipientName: string,
  guestName: string,
  rsvpStatus: string,
  eventName: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>New RSVP</h2>
    <p>Hi ${recipientName},</p>
    <p><strong>${guestName}</strong> has ${rsvpStatus} for <strong>${eventName}</strong>.</p>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'New RSVP',
    htmlContent: wrapEmailTemplate('New RSVP', content),
  };
};

/**
 * Guest milestone email template
 */
export const getGuestMilestoneEmail = (
  recipientName: string,
  eventName: string,
  count: number
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Guest Milestone</h2>
    <p>Hi ${recipientName},</p>
    <div style="margin: 24px 0; padding: 20px; background-color: ${BRAND_COLORS.lightNude}; border-radius: 8px; text-align: center;">
      <p style="margin: 0 0 8px 0; color: ${BRAND_COLORS.textSecondary}; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Confirmed Guests</p>
      <p style="margin: 0; font-size: 48px; font-weight: 600; color: ${BRAND_COLORS.teal};">${count}</p>
      <p style="margin: 8px 0 0 0; color: ${BRAND_COLORS.textDark};">for <strong>${eventName}</strong></p>
    </div>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Guest Milestone',
    htmlContent: wrapEmailTemplate('Guest Milestone', content),
  };
};

/**
 * Schedule added email template
 */
export const getScheduleAddedEmail = (
  recipientName: string,
  scheduleTitle: string,
  eventName: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>New Schedule Item</h2>
    <p>Hi ${recipientName},</p>
    <p>"<strong>${scheduleTitle}</strong>" has been added to the schedule for <strong>${eventName}</strong>.</p>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'New Schedule Item',
    htmlContent: wrapEmailTemplate('New Schedule Item', content),
  };
};

/**
 * Schedule conflict email template
 */
export const getScheduleConflictEmail = (
  recipientName: string,
  eventName: string,
  item1: string,
  item2: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Schedule Conflict</h2>
    <p>Hi ${recipientName},</p>
    <p>A conflict has been detected between "<strong>${item1}</strong>" and "<strong>${item2}</strong>" in <strong>${eventName}</strong>.</p>
    <div style="margin: 24px 0; padding: 16px; background-color: #FFF8E1; border-left: 4px solid #FFC107; border-radius: 4px;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>⚠️ Action Required:</strong> Please review and resolve this conflict in the app.
      </p>
    </div>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Schedule Conflict',
    htmlContent: wrapEmailTemplate('Schedule Conflict', content),
  };
};

/**
 * Schedule reminder email template
 */
export const getScheduleReminderEmail = (
  recipientName: string,
  scheduleTitle: string,
  eventName: string,
  time: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Schedule Reminder</h2>
    <p>Hi ${recipientName},</p>
    <p>"<strong>${scheduleTitle}</strong>" for <strong>${eventName}</strong> is coming up at <strong>${time}</strong>.</p>
    <div style="margin: 24px 0; padding: 16px; background-color: ${BRAND_COLORS.lightNude}; border-left: 4px solid ${BRAND_COLORS.teal}; border-radius: 4px;">
      <p style="margin: 0; color: ${BRAND_COLORS.textDark}; font-size: 16px; font-weight: 600;">
        ⏰ ${time}
      </p>
    </div>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Schedule Reminder',
    htmlContent: wrapEmailTemplate('Schedule Reminder', content),
  };
};

/**
 * Task reminder email template
 */
export const getTaskReminderEmail = (
  recipientName: string,
  taskTitle: string,
  eventName: string,
  dueDate: string
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Task Reminder</h2>
    <p>Hi ${recipientName},</p>
    <p>Task "<strong>${taskTitle}</strong>" for <strong>${eventName}</strong> is due on <strong>${dueDate}</strong>.</p>
    <div style="margin: 24px 0; padding: 16px; background-color: ${BRAND_COLORS.lightNude}; border-left: 4px solid ${BRAND_COLORS.teal}; border-radius: 4px;">
      <p style="margin: 0; color: ${BRAND_COLORS.textDark}; font-size: 16px; font-weight: 600;">
        📅 Due: ${dueDate}
      </p>
    </div>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Task Reminder',
    htmlContent: wrapEmailTemplate('Task Reminder', content),
  };
};

/**
 * Event countdown email template
 */
export const getEventCountdownEmail = (
  recipientName: string,
  eventName: string,
  daysLeft: number
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Event Countdown</h2>
    <p>Hi ${recipientName},</p>
    <div style="margin: 24px 0; padding: 32px; background: linear-gradient(135deg, ${BRAND_COLORS.teal} 0%, ${BRAND_COLORS.lightTeal} 100%); border-radius: 12px; text-align: center;">
      <p style="margin: 0 0 8px 0; color: ${BRAND_COLORS.white}; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Days Until</p>
      <p style="margin: 0; font-size: 64px; font-weight: 700; color: ${BRAND_COLORS.white}; line-height: 1;">${daysLeft}</p>
      <p style="margin: 8px 0 0 0; color: ${BRAND_COLORS.white}; font-size: 18px; font-weight: 500;">${eventName}</p>
    </div>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Event Countdown',
    htmlContent: wrapEmailTemplate('Event Countdown', content),
  };
};

/**
 * Planning progress email template
 */
export const getPlanningProgressEmail = (
  recipientName: string,
  eventName: string,
  percentage: number
): EmailTemplate => {
  const content = createContentSection(`
    <h2>Planning Progress</h2>
    <p>Hi ${recipientName},</p>
    <p>You've completed <strong>${percentage}%</strong> of your planning tasks for <strong>${eventName}</strong>.</p>
    <div style="margin: 24px 0;">
      <div style="background-color: ${BRAND_COLORS.lightNude}; border-radius: 8px; height: 24px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, ${BRAND_COLORS.teal} 0%, ${BRAND_COLORS.lightTeal} 100%); height: 100%; width: ${percentage}%; transition: width 0.3s ease;"></div>
      </div>
      <p style="margin: 8px 0 0 0; text-align: center; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
        ${percentage}% Complete
      </p>
    </div>
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.lightNude}; color: ${BRAND_COLORS.textSecondary}; font-size: 14px;">
      View details in the app.
    </p>
  `);

  return {
    subject: 'Planning Progress',
    htmlContent: wrapEmailTemplate('Planning Progress', content),
  };
};

/**
 * Helper function to format date to dd-mm-yyyy format
 */
export const formatDateForSMS = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Error formatting date for SMS:', error);
    return dateString; // Return original if parsing fails
  }
};

/**
 * Helper function to format time to "6pm UTC" format
 */
export const formatTimeForSMS = (timeString: string | undefined): string => {
  if (!timeString) return '';
  
  try {
    let formattedTime = timeString.trim();
    
    // Try to parse ISO 8601 format (e.g., "2024-12-12T18:00:00Z" or "18:00:00")
    // Or HH:MM format (e.g., "18:00" or "6:00 PM")
    let hours = 0;
    let minutes = 0;
    let isPM = false;
    
    // Check if it's already in 12-hour format with am/pm
    const amPmMatch = formattedTime.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
    if (amPmMatch) {
      hours = parseInt(amPmMatch[1], 10);
      minutes = amPmMatch[2] ? parseInt(amPmMatch[2], 10) : 0;
      isPM = amPmMatch[3].toLowerCase() === 'pm';
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
    } else {
      // Try to parse 24-hour format (HH:MM or HH:MM:SS)
      const timeMatch = formattedTime.match(/(\d{1,2}):(\d{2})(?::\d{2})?/);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
        
        // Convert to 12-hour format
        isPM = hours >= 12;
        if (hours > 12) {
          hours -= 12;
        } else if (hours === 0) {
          hours = 12;
        }
      } else {
        // If we can't parse it, return as-is with UTC appended if needed
        if (!formattedTime.toLowerCase().includes('utc') && 
            !formattedTime.toLowerCase().includes('gmt') &&
            !formattedTime.match(/\+\d{2}:\d{2}/)) {
          formattedTime = `${formattedTime} UTC`;
        }
        return formattedTime;
      }
    }
    
    // Format as "6pm" or "6:30pm"
    const timeStr = minutes > 0 ? `${hours}:${String(minutes).padStart(2, '0')}${isPM ? 'pm' : 'am'}` : `${hours}${isPM ? 'pm' : 'am'}`;
    return `${timeStr} UTC`;
  } catch (error) {
    console.error('Error formatting time for SMS:', error);
    // Return original with UTC appended if not present
    let result = timeString.trim();
    if (!result.toLowerCase().includes('utc') && 
        !result.toLowerCase().includes('gmt') &&
        !result.match(/\+\d{2}:\d{2}/)) {
      result = `${result} UTC`;
    }
    return result;
  }
};

/**
 * Event invitation SMS template - matches email format
 */
export const getEventInvitationSMS = (
  guestName: string,
  organizerName: string,
  eventName: string,
  eventDate: string,
  eventTime?: string,
  eventLocation?: string
): string => {
  const formattedDate = formatDateForSMS(eventDate);
  const formattedTime = formatTimeForSMS(eventTime);
  
  let message = `You're Invited!\n\n`;
  message += `Hi ${guestName},\n\n`;
  message += `${organizerName} has invited you to ${eventName}.\n\n`;
  message += `Event: ${eventName}\n`;
  message += `Date: ${formattedDate}`;
  
  if (formattedTime) {
    message += `\nTime: ${formattedTime}`;
  }
  
  if (eventLocation) {
    message += `\n Location: ${eventLocation}`;
  }
  
  message += `\n\nPlease RSVP in the app or visit the event website to confirm your attendance.`;
  
  return message;
};

/**
 * RSVP reminder SMS template - matches email format
 */
export const getRsvpReminderSMS = (
  guestName: string,
  organizerName: string,
  eventName: string,
  eventDate: string,
  eventTime?: string,
  eventLocation?: string
): string => {
  const formattedDate = formatDateForSMS(eventDate);
  const formattedTime = formatTimeForSMS(eventTime);
  
  let message = `RSVP Reminder\n\n`;
  message += `Hi ${guestName},\n\n`;
  message += `This is a friendly reminder that ${organizerName} has invited you to ${eventName}.\n\n`;
  message += `Event: ${eventName}\n`;
  message += `Date: ${formattedDate}`;
  
  if (formattedTime) {
    message += `\nTime: ${formattedTime}`;
  }
  
  if (eventLocation) {
    message += `\nLocation: ${eventLocation}`;
  }
  
  message += `\n\nPlease RSVP in the app or visit the event website to confirm your attendance.`;
  
  return message;
};

