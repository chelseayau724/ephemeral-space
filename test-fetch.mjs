import fetch from 'node-fetch';

const testEndpoint = async (url) => {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const text = await res.text();
    console.log(`\n${url}:`);
    console.log(`Status: ${res.status}`);
    console.log(`Body (first 300 chars): ${text.substring(0, 300)}`);
  } catch (err) {
    console.log(`\n${url}: ERROR - ${err.message}`);
  }
};

await testEndpoint('http://localhost:3000/');
await testEndpoint('http://localhost:3000/api/spaces/1234');
