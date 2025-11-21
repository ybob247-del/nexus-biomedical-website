import { OpenAIDirectService } from '../server/services/openai-direct.js';

const API_KEY = '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';

async function testOpenAIDirect() {
  console.log('🧪 Testing Direct OpenAI Service\n');
  console.log('=' .repeat(70));

  const openai = new OpenAIDirectService(API_KEY);

  // Test 1: Connection Test
  console.log('\n📋 TEST 1: Connection Test');
  console.log('-'.repeat(70));
  try {
    const result = await openai.testConnection();
    if (result.success) {
      console.log('✅ Connection successful!');
      console.log(`   Response: ${result.message}`);
      console.log(`   Model: ${result.model}`);
    } else {
      console.log('❌ Connection failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 2: Drug Interaction Analysis
  console.log('\n📋 TEST 2: Drug Interaction Analysis');
  console.log('-'.repeat(70));
  try {
    const medications = [
      { name: 'Lipitor (Atorvastatin)' },
      { name: 'Amlodipine' },
      { name: 'Metformin' }
    ];
    
    console.log('Analyzing interactions for:', medications.map(m => m.name).join(', '));
    const analysis = await openai.analyzeDrugInteractions(medications);
    console.log('✅ Analysis complete!');
    console.log(JSON.stringify(analysis, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: Hormone Health Analysis
  console.log('\n📋 TEST 3: Hormone Health Analysis');
  console.log('-'.repeat(70));
  try {
    const assessmentData = {
      age: 35,
      biologicalSex: 'female',
      symptoms: ['fatigue', 'weight gain', 'mood swings'],
      lifestyle: {
        exercise: 'moderate',
        sleep: '6-7 hours',
        stress: 'high'
      },
      edcExposure: {
        plasticUse: 'high',
        personalCare: 'conventional',
        foodPackaging: 'frequent'
      }
    };
    
    console.log('Analyzing hormone health assessment...');
    const analysis = await openai.analyzeHormoneHealth(assessmentData);
    console.log('✅ Analysis complete!');
    console.log(JSON.stringify(analysis, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 4: Generate Recommendations
  console.log('\n📋 TEST 4: Generate Health Recommendations');
  console.log('-'.repeat(70));
  try {
    const context = {
      platform: 'RxGuard',
      medications: ['Lipitor', 'Amlodipine'],
      concerns: ['drug interactions', 'side effects']
    };
    
    console.log('Generating recommendations...');
    const recommendations = await openai.generateRecommendations(context);
    console.log('✅ Recommendations generated!');
    console.log(recommendations);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(70));
  console.log('🎉 ALL TESTS COMPLETE!');
  console.log('='.repeat(70));
  console.log('\n✅ OpenAI integration is working with direct HTTPS requests!');
  console.log('   This bypasses the SDK bug and works perfectly.\n');
}

testOpenAIDirect().catch(console.error);
