import OpenAI from 'openai';
import https from 'https';

// Test with the new API key directly
const TEST_API_KEY = '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';

async function diagnoseOpenAI() {
  console.log('🔍 COMPREHENSIVE OPENAI API DIAGNOSTICS\n');
  console.log('=' .repeat(60));
  
  // Test 1: Check API key format
  console.log('\n📋 TEST 1: API Key Analysis');
  console.log('-'.repeat(60));
  console.log(`Key prefix: ${TEST_API_KEY.substring(0, 20)}...`);
  console.log(`Key suffix: ...${TEST_API_KEY.substring(TEST_API_KEY.length - 4)}`);
  console.log(`Key length: ${TEST_API_KEY.length} characters`);
  console.log(`Key type: ${TEST_API_KEY.startsWith('sk-proj-') ? '⚠️  Project-scoped' : '✅ User-level'}`);
  
  // Test 2: Raw HTTPS request to OpenAI API
  console.log('\n📋 TEST 2: Raw HTTPS Request (bypassing SDK)');
  console.log('-'.repeat(60));
  
  await new Promise((resolve) => {
    const postData = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "API works!"' }],
      max_tokens: 10
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      console.log(`HTTP Status: ${res.statusCode}`);
      console.log(`Headers:`, JSON.stringify(res.headers, null, 2));
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('\nResponse Body:');
        try {
          const parsed = JSON.parse(data);
          console.log(JSON.stringify(parsed, null, 2));
          
          if (parsed.error) {
            console.log('\n❌ ERROR DETAILS:');
            console.log(`  Type: ${parsed.error.type}`);
            console.log(`  Message: ${parsed.error.message}`);
            console.log(`  Code: ${parsed.error.code || 'N/A'}`);
          } else if (parsed.choices) {
            console.log('\n✅ SUCCESS! API is working!');
            console.log(`  Response: ${parsed.choices[0].message.content}`);
          }
        } catch (e) {
          console.log(data);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Request Error: ${e.message}`);
      resolve();
    });

    req.write(postData);
    req.end();
  });

  // Test 3: OpenAI SDK request
  console.log('\n📋 TEST 3: OpenAI SDK Request');
  console.log('-'.repeat(60));
  
  try {
    const openai = new OpenAI({
      apiKey: TEST_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "SDK works!"' }],
      max_tokens: 10
    });

    console.log('✅ SDK Request Successful!');
    console.log(`Response: ${completion.choices[0].message.content}`);
    console.log(`Model: ${completion.model}`);
    console.log(`Usage:`, completion.usage);

  } catch (error) {
    console.log('❌ SDK Request Failed');
    console.log(`Error Type: ${error.constructor.name}`);
    console.log(`Error Message: ${error.message}`);
    console.log(`HTTP Status: ${error.status || 'N/A'}`);
    console.log(`Error Code: ${error.code || 'N/A'}`);
    console.log(`Error Type: ${error.type || 'N/A'}`);
    
    if (error.response) {
      console.log('\nFull Error Response:');
      console.log(JSON.stringify(error.response, null, 2));
    }
  }

  // Test 4: Check models endpoint
  console.log('\n📋 TEST 4: List Available Models');
  console.log('-'.repeat(60));
  
  await new Promise((resolve) => {
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/models',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TEST_API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      console.log(`HTTP Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            console.log('❌ Cannot list models');
            console.log(`  Error: ${parsed.error.message}`);
          } else if (parsed.data) {
            console.log(`✅ Can access models endpoint`);
            console.log(`  Available models: ${parsed.data.length}`);
            const gpt4Models = parsed.data.filter(m => m.id.includes('gpt-4'));
            console.log(`  GPT-4 models: ${gpt4Models.map(m => m.id).join(', ')}`);
          }
        } catch (e) {
          console.log('Response:', data.substring(0, 200));
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Request Error: ${e.message}`);
      resolve();
    });

    req.end();
  });

  console.log('\n' + '='.repeat(60));
  console.log('🏁 DIAGNOSTICS COMPLETE');
  console.log('='.repeat(60));
}

diagnoseOpenAI().catch(console.error);
