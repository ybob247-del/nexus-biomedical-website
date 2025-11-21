import OpenAI from 'openai';
import https from 'https';

async function testOpenAI() {
  console.log('🔍 Testing OpenAI API Connection...\n');

  // Check if API key exists
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is not set');
    process.exit(1);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  console.log(`✅ API Key found: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`   Key type: ${apiKey.startsWith('sk-proj-') ? 'Project Key' : apiKey.startsWith('sk-') ? 'User Key' : 'Unknown'}\n`);

  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey
    });

    console.log('📡 Testing API connection with a simple completion...\n');

    // Test with a simple completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Say "Hello, OpenAI is working!" in exactly 5 words.'
        }
      ],
      max_tokens: 20
    });

    console.log('✅ SUCCESS! OpenAI API is working!\n');
    console.log('Response:', completion.choices[0].message.content);
    console.log('\nAPI Details:');
    console.log('- Model:', completion.model);
    console.log('- Usage:', JSON.stringify(completion.usage, null, 2));
    console.log('\n🎉 OpenAI integration is fully functional!');

  } catch (error) {
    console.error('❌ OpenAI API Error:\n');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    
    if (error.status) {
      console.error('HTTP Status:', error.status);
    }

    if (error.code) {
      console.error('Error Code:', error.code);
    }

    if (error.type) {
      console.error('Error Type:', error.type);
    }

    console.error('\n📋 Troubleshooting Steps:');
    
    if (error.message.includes('Incorrect API key')) {
      console.error('1. Check that your API key is valid');
      console.error('2. Go to https://platform.openai.com/api-keys');
      console.error('3. Create a new API key (use user-level key, not project-scoped)');
      console.error('4. Update OPENAI_API_KEY in Manus Settings → Secrets');
    } else if (error.message.includes('quota')) {
      console.error('1. Check your OpenAI billing at https://platform.openai.com/account/billing');
      console.error('2. Add payment method if needed');
      console.error('3. Check usage limits');
    } else if (error.message.includes('project')) {
      console.error('1. You may be using a project-scoped API key');
      console.error('2. Try creating a user-level API key instead');
      console.error('3. Go to https://platform.openai.com/api-keys');
      console.error('4. Create new key WITHOUT selecting a specific project');
    } else {
      console.error('1. Check your internet connection');
      console.error('2. Verify API key is correctly set');
      console.error('3. Check OpenAI status: https://status.openai.com');
    }

    process.exit(1);
  }
}

testOpenAI();
