import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

async function checkTwilioAccount() {
  try {
    console.log('🔍 Checking Twilio Account Status...\n');
    
    // Get account info
    const account = await client.api.accounts(accountSid).fetch();
    
    console.log('📋 ACCOUNT INFORMATION:');
    console.log('Account SID:', account.sid);
    console.log('Account Name:', account.friendlyName);
    console.log('Account Status:', account.status);
    console.log('Account Type:', account.type);
    console.log('Date Created:', account.dateCreated);
    
    // Check if trial account
    if (account.type === 'Trial') {
      console.log('\n⚠️  TRIAL ACCOUNT DETECTED');
      console.log('Trial accounts have restrictions:');
      console.log('- Can only send SMS to verified phone numbers');
      console.log('- Messages include trial notice');
      console.log('- Limited number of messages');
      
      // Get verified phone numbers
      console.log('\n📱 Checking Verified Phone Numbers...');
      try {
        const validationRequests = await client.validationRequests.list({limit: 20});
        
        if (validationRequests.length > 0) {
          console.log('Verified numbers:');
          validationRequests.forEach(req => {
            console.log(`  - ${req.phoneNumber} (validated: ${req.validationCode ? 'Yes' : 'No'})`);
          });
        } else {
          console.log('No verified numbers found via validation requests API');
        }
      } catch (err) {
        console.log('Could not fetch validation requests:', err.message);
      }
      
      // Try to get outgoing caller IDs (verified numbers)
      try {
        const callerIds = await client.outgoingCallerIds.list({limit: 20});
        
        if (callerIds.length > 0) {
          console.log('\nVerified Outgoing Caller IDs:');
          callerIds.forEach(callerId => {
            console.log(`  - ${callerId.phoneNumber} (${callerId.friendlyName})`);
          });
        } else {
          console.log('\n❌ No verified phone numbers found!');
          console.log('You need to verify +14693483227 in your Twilio console:');
          console.log('https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
        }
      } catch (err) {
        console.log('Could not fetch caller IDs:', err.message);
      }
    } else {
      console.log('\n✅ FULL ACCOUNT - No restrictions on sending SMS');
    }
    
    // Get recent messages
    console.log('\n📬 Recent SMS Messages (last 5):');
    const messages = await client.messages.list({limit: 5});
    
    if (messages.length === 0) {
      console.log('No messages found');
    } else {
      messages.forEach((msg, index) => {
        console.log(`\n${index + 1}. Message SID: ${msg.sid}`);
        console.log(`   To: ${msg.to}`);
        console.log(`   From: ${msg.from}`);
        console.log(`   Status: ${msg.status}`);
        console.log(`   Date: ${msg.dateCreated}`);
        console.log(`   Error: ${msg.errorCode || 'None'} ${msg.errorMessage || ''}`);
      });
    }
    
    console.log('\n✅ Account check complete!');
    
  } catch (error) {
    console.error('❌ Error checking Twilio account:', error.message);
    console.error('Error code:', error.code);
    throw error;
  }
}

checkTwilioAccount()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
