const http = require('http');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to make HTTP requests using built-in http module
function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(postData);
    }
    req.end();
  });
}

async function main() {
  const testEmail = 'test_fetch_user@example.com';
  const testPassword = 'Password123!';

  try {
    // 1. Ensure test user exists
    let user = await prisma.user.findUnique({ where: { email: testEmail } });
    if (!user) {
      console.log('Creating test user via /auth/signup...');
      const signupRes = await request('POST', '/auth/signup', {
        email: testEmail,
        password: testPassword,
        fullName: 'Test Fetch User',
        phoneNumber: '+919999999999',
        dateOfBirth: '1995-05-15',
        emailNotifications: true
      });
      console.log('Signup response:', signupRes);
    }

    // 2. Sign in to get access token
    console.log('Signing in...');
    const signinRes = await request('POST', '/auth/signin', {
      identifier: testEmail,
      password: testPassword
    });
    console.log('Signin response:', signinRes);

    const token = signinRes.data?.access_token;
    if (!token) {
      throw new Error('Failed to obtain token');
    }

    // 3. Define endpoints to test
    const authHeaders = {
      Authorization: `Bearer ${token}`
    };

    const endpoints = [
      '/cycles',
      '/cycles/predictions',
      '/logs/range?start=2024-01-01&end=2028-12-31',
      '/analytics/summary',
      '/ai/profile'
    ];

    console.log('\nTesting Endpoints:');
    for (const url of endpoints) {
      const res = await request('GET', url, null, authHeaders);
      if (res.status === 200 || res.status === 201) {
        console.log(`✅ GET ${url} -> Status: ${res.status}`);
        console.log('   Data:', JSON.stringify(res.data, null, 2).slice(0, 150) + '...');
      } else {
        console.error(`❌ GET ${url} -> Failed! Status: ${res.status}`);
        console.error('   Response:', res.data);
      }
    }
  } catch (e) {
    console.error('Test run failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
