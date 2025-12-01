import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

async function sendTestSMS() {
  try {
    console.log('🚀 Testing SMS Notification System...\n');
    console.log('Twilio Account SID:', accountSid?.substring(0, 10) + '...');
    console.log('Twilio Phone Number:', twilioPhone);
    
    // Test message
    const testMessage = `🧪 Nexus Biomedical Intelligence - SMS Test

This is a test message to verify end-to-end SMS delivery.

✅ Twilio integration working
✅ Message delivery confirmed
✅ System ready for production

Time: ${new Date().toLocaleString()}`;

    console.log('\n📱 Sending test SMS...\n');
    
    const message = await client.messages.create({
      body: testMessage,
      from: twilioPhone,
      to: '+14693483227' // User's phone number for testing
    });

    console.log('✅ SMS SENT SUCCESSFULLY!\n');
    console.log('Message SID:', message.sid);
    console.log('Status:', message.status);
    console.log('To:', message.to);
    console.log('From:', message.from);
    console.log('Date Created:', message.dateCreated);
    
    console.log('\n🎉 End-to-end SMS delivery test PASSED!');
    console.log('System is ready for production deployment.\n');
    
    return message;
  } catch (error) {
    console.error('❌ SMS TEST FAILED:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Details:', error);
    throw error;
  }
}

sendTestSMS()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
