import fetch from 'node-fetch';

const VERCEL_TOKEN = '3erzSijTnIDou0Usekoy67np';
const PROJECT_ID = 'prj_HGiyDIsgDOoKxdyfCfXIm0YmDvxk';
const TEAM_ID = 'team_cnXgfRnIu6RNpxHN6v6EZXLQ';

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

console.log('Setting DATABASE_URL on Vercel production deployment...');
console.log('DATABASE_URL length:', DATABASE_URL.length);

// Set environment variable for production
const url = `https://api.vercel.com/v9/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`;

const payload = {
  key: 'DATABASE_URL',
  value: DATABASE_URL,
  target: ['production'],
  type: 'encrypted'
};

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => {
  console.log('Response:', JSON.stringify(data, null, 2));
  if (data.id) {
    console.log('✓ DATABASE_URL successfully set on Vercel production!');
  } else if (data.error) {
    console.error('✗ Error:', data.error);
    process.exit(1);
  }
  process.exit(0);
})
.catch(err => {
  console.error('Request error:', err.message);
  process.exit(1);
});
