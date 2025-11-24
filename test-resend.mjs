import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

console.log('Testing Resend API key...');
console.log('API key exists:', !!process.env.RESEND_API_KEY);
console.log('API key starts with re_:', process.env.RESEND_API_KEY?.startsWith('re_'));

try {
  // Test by fetching domains (lightweight API call)
  const response = await fetch('https://api.resend.com/domains', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('✅ Resend API key is valid!');
    console.log('Domains:', data.data?.length || 0);
    process.exit(0);
  } else {
    console.error('❌ Resend API key validation failed:',data);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error testing Resend API:', error.message);
  process.exit(1);
}
