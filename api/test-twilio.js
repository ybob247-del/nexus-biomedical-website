// Test Twilio credentials by sending a test SMS
import twilio from 'twilio';

export default async function handler(req, res) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    // Validate environment variables exist
    if (!accountSid || !authToken || !twilioPhone) {
      return res.status(500).json({
        success: false,
        error: 'Missing Twilio credentials',
        details: {
          hasAccountSid: !!accountSid,
          hasAuthToken: !!authToken,
          hasPhoneNumber: !!twilioPhone
        }
      });
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Validate credentials by fetching account info
    const account = await client.api.accounts(accountSid).fetch();

    return res.status(200).json({
      success: true,
      message: 'Twilio credentials are valid',
      accountInfo: {
        sid: account.sid,
        friendlyName: account.friendlyName,
        status: account.status,
        twilioPhoneNumber: twilioPhone
      }
    });

  } catch (error) {
    console.error('Twilio validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Invalid Twilio credentials',
      details: error.message
    });
  }
}
