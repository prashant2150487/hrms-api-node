import http from 'http';

const loginData = {
  email: 'admin@techcorp.com',
  password: 'Admin@123',
  subdomain: 'techcorp'
};

const postData = JSON.stringify({
  email: loginData.email,
  password: loginData.password
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'x-tenant-subdomain': 'techcorp'
  }
};

console.log('🚀 Sending login request to:', `http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    try {
      const data = JSON.parse(body);
      console.log('Response Payload:', JSON.stringify(data, null, 2));
      if (res.statusCode === 200 && data.data && data.data.token) {
        console.log('✅ Login verification successful!');
      } else {
        console.log('❌ Login verification failed logic!');
      }
    } catch (e) {
      console.log('Body trace:', body,e);
      console.log('❌ Login verification failed parsing!');
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Connection Problem: ${e.message}`);
});

req.write(postData);
req.end();
