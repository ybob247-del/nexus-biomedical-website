import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

console.log('🔍 Testing Twilio Account Status...\n');
console.log('Account SID:', accountSid ? accountSid.substring(0, 10) + '...' : 'NOT SET');
console.log('Phone Number:', twilioPhone || 'NOT SET');

if (!accountSid || !authToken || !twilioPhone) {
  console.error('❌ Twilio credentials not configured');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

// Test account status
try {
  const account = await client.api.accounts(accountSid).fetch();
  
  console.log('\n✅ Twilio Account Status:');
  console.log('   Status:', account.status);
  console.log('   Type:', account.type);
  console.log('   Friendly Name:', account.friendlyName);
  
  // Test SMS capability by sending to verified number
  console.log('\n📱 Attempting to send test SMS to +14693483227...');
  
  const message = await client.messages.create({
    body: '🧪 Test SMS from Nexus Biomedical Intelligence. Your account upgrade is successful! Reply STOP to unsubscribe.',
    from: twilioPhone,
    to: '+14693483227'
  });
  
  console.log('\n✅ SMS SENT SUCCESSFULLY!');
  console.log('   Message SID:', message.sid);
  console.log('   Status:', message.status);
  console.log('   To:', message.to);
  console.log('   From:', message.from);
  console.log('\n🎉 Twilio account is fully operational!');
  console.log('   Error 30044 has been resolved.');
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ SMS FAILED:');
  console.error('   Error Code:', error.code);
  console.error('   Error Message:', error.message);
  
  if (error.code === 30044) {
    console.error('\n⚠️  STILL IN TRIAL MODE');
    console.error('   Please add credit to your Twilio account at:');
    console.error('   https://console.twilio.com/billing');
  } else if (error.code === 21608) {
    console.error('\n⚠️  UNVERIFIED NUMBER');
    console.error('   The destination number is not verified in your trial account.');
    console.error('   Please verify +14693483227 at:');
    console.error('   https://console.twilio.com/verified-caller-ids');
  }
  
  process.exit(1);
}
