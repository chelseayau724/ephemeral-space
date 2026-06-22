#!/usr/bin/env node
const http = require('http');

const testAPI = (path) => {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: data.substring(0, 200) });
        }
      });
    });
    req.on('error', (e) => resolve({ error: e.message }));
    req.setTimeout(3000, () => { req.abort(); resolve({ error: 'timeout' }); });
  });
};

(async () => {
  console.log('Testing API endpoints...\n');

  console.log('1. GET /api/spaces/1234:');
  const result1 = await testAPI('/api/spaces/1234');
  console.log(JSON.stringify(result1, null, 2));

  console.log('\n2. GET / (homepage):');
  const result2 = await testAPI('/');
  console.log(`Status: ${result2.status}, Content-Type: ${result2.data?.type || 'unknown'}`);

  console.log('\n3. GET /wardrobe:');
  const result3 = await testAPI('/wardrobe');
  console.log(`Status: ${result3.status}`);
})()
