const fs = require('fs');
const pdfService = require('../services/pdfService');
const pdfParse = require('pdf-parse');

async function testFullHtmlExportFlow() {
  console.log('--- Testing HTML to PDF Export & Share/Exchange Pipeline ---');

  const userHtml = `
    <!DOCTYPE html>
    <html>
      <head><title>My Private Contract</title></head>
      <body>
        <h1>CONFIDENTIAL AGREEMENT</h1>
        <p>This agreement is entered into between Party A and Party B on August 29, 2026.</p>
        <p>Clause 1: All terms remain strictly confidential.</p>
      </body>
    </html>
  `;

  // Step 1: Generate PDF from HTML
  const pdfBytes = await pdfService.htmlToPdf(userHtml);
  console.log('1. Generated PDF bytes length:', pdfBytes.length);

  // Step 2: Inspect generated PDF text
  const parsed1 = await pdfParse(pdfBytes);
  console.log('\n--- Generated PDF Extracted Text ---');
  console.log(parsed1.text.trim());
  console.log('------------------------------------\n');

  if (parsed1.text.includes('MomPDF — HTML to PDF Export') || parsed1.text.includes('HTML to PDF Export')) {
    throw new Error('FAILED: Unwanted "MomPDF — HTML to PDF Export" header found in generated PDF!');
  }

  if (!parsed1.text.includes('CONFIDENTIAL AGREEMENT') || !parsed1.text.includes('Party A and Party B')) {
    throw new Error('FAILED: Original user content missing!');
  }

  console.log('✓ Step 1 & 2 Passed: PDF contains strictly user content without any injected branding/header.');

  // Step 3: Simulate Sharing / Exchanging PDF through other operations (e.g. Merge & Compress)
  const compressed = await pdfService.compress(pdfBytes);
  const parsed2 = await pdfParse(compressed);

  if (parsed2.text.includes('MomPDF — HTML to PDF Export')) {
    throw new Error('FAILED: Unwanted header appeared in shared/compressed file!');
  }

  console.log('✓ Step 3 Passed: Exchanged/shared PDF retains pure user content.');
  console.log('\nALL HTML-TO-PDF EXPORT TESTS PASSED WITH 100% SUCCESS!\n');
}

testFullHtmlExportFlow().catch((e) => {
  console.error(e);
  process.exit(1);
});
