const fs = require('fs');
const http = require('http');
const { PDFDocument } = require('pdf-lib');

async function testHttpMerge() {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  
  const doc1 = await PDFDocument.create();
  doc1.addPage([400, 400]);
  const buf1 = await doc1.save();

  const doc2 = await PDFDocument.create();
  doc2.addPage([400, 400]);
  const buf2 = await doc2.save();

  let body = '';
  // Field: tool
  body += '--' + boundary + '\r\n';
  body += 'Content-Disposition: form-data; name="tool"\r\n\r\n';
  body += 'merge\r\n';

  // File 1
  body += '--' + boundary + '\r\n';
  body += 'Content-Disposition: form-data; name="files"; filename="test1.pdf"\r\n';
  body += 'Content-Type: application/pdf\r\n\r\n';
  
  const headBuf = Buffer.from(body);
  const midBuf = Buffer.from('\r\n--' + boundary + '\r\nContent-Disposition: form-data; name="files"; filename="test2.pdf"\r\nContent-Type: application/pdf\r\n\r\n');
  const tailBuf = Buffer.from('\r\n--' + boundary + '--\r\n');

  const fullPayload = Buffer.concat([headBuf, Buffer.from(buf1), midBuf, Buffer.from(buf2), tailBuf]);

  const req = http.request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/process',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      'Content-Length': fullPayload.length
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('HTTP /api/process Response Status:', res.statusCode);
      const parsed = JSON.parse(data);
      console.log('HTTP Response Success:', parsed.success);
      console.log('Processed File:', parsed.data.filename);
      console.log('Download URL:', parsed.data.downloadUrl);
      console.log('All API tests completed successfully!');
    });
  });

  req.on('error', (e) => console.error('HTTP Request Error:', e));
  req.write(fullPayload);
  req.end();
}

testHttpMerge();
