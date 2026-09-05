const fs = require('fs');
const path = require('path');
const http = require('http');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

const postData = 
`--${boundary}\r\n` +
`Content-Disposition: form-field; name="tool"\r\n\r\n` +
`powerpoint_to_pdf\r\n` +
`--${boundary}\r\n` +
`Content-Disposition: form-data; name="files"; filename="dummy.pptx"\r\n` +
`Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation\r\n\r\n` +
`dummy data\r\n` +
`--${boundary}--\r\n`;

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/process',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
