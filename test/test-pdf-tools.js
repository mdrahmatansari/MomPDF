const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const sharp = require('sharp');
const pdfParse = require('pdf-parse');
const pdfService = require('../services/pdfService');

async function createSamplePdf(text = 'MomPDF Sample Document', numPages = 2) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= numPages; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]);
    page.drawText(`${text} - Page ${i}`, {
      x: 50,
      y: 750,
      size: 20,
      font,
      color: rgb(0.1, 0.1, 0.1)
    });
    page.drawText(`This is a test paragraph for MomPDF verification.`, {
      x: 50,
      y: 700,
      size: 12,
      font,
      color: rgb(0.3, 0.3, 0.3)
    });
  }

  return await pdfDoc.save();
}

async function createSampleImage() {
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e11d48" />
      <text x="200" y="150" font-family="Arial" font-size="24" fill="#ffffff" text-anchor="middle">MomPDF Image Test</text>
    </svg>
  `;
  return await sharp(Buffer.from(svg)).jpeg().toBuffer();
}

async function runTests() {
  console.log('========================================');
  console.log('  Running MomPDF PDF Engine Test Suite  ');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  const samplePdf1 = await createSamplePdf('Doc 1', 2);
  const samplePdf2 = await createSamplePdf('Doc 2', 3);
  const sampleImg = await createSampleImage();

  await test('1. Merge PDF', async () => {
    const res = await pdfService.merge([samplePdf1, samplePdf2]);
    const doc = await PDFDocument.load(res);
    if (doc.getPageCount() !== 5) throw new Error(`Expected 5 pages, got ${doc.getPageCount()}`);
  });

  await test('2. Split PDF (All Pages)', async () => {
    const res = await pdfService.split(samplePdf1, { splitMode: 'all' });
    if (!Array.isArray(res) || res.length !== 2) throw new Error(`Expected 2 split items`);
  });

  await test('3. Split PDF (Range)', async () => {
    const res = await pdfService.split(samplePdf2, { splitMode: 'range', ranges: '1-2' });
    const doc = await PDFDocument.load(res);
    if (doc.getPageCount() !== 2) throw new Error(`Expected 2 pages in range`);
  });

  await test('4. Compress PDF', async () => {
    const res = await pdfService.compress(samplePdf1);
    if (!res || res.length === 0) throw new Error('Compression returned empty buffer');
  });

  await test('5. Rotate PDF', async () => {
    const res = await pdfService.rotate(samplePdf1, { angle: 90 });
    const doc = await PDFDocument.load(res);
    const rotation = doc.getPage(0).getRotation().angle;
    if (rotation !== 90) throw new Error(`Expected rotation 90, got ${rotation}`);
  });

  await test('6. Add Watermark', async () => {
    const res = await pdfService.watermark(samplePdf1, { text: 'CONFIDENTIAL' });
    const doc = await PDFDocument.load(res);
    if (doc.getPageCount() !== 2) throw new Error('Page count mismatch');
  });

  await test('7. Add Page Numbers', async () => {
    const res = await pdfService.addPageNumbers(samplePdf1, { position: 'bottom-center' });
    const doc = await PDFDocument.load(res);
    if (doc.getPageCount() !== 2) throw new Error('Page count mismatch');
  });

  await test('8. Protect PDF', async () => {
    const res = await pdfService.protect(samplePdf1, { password: 'test' });
    if (!res || res.length === 0) throw new Error('Encryption returned empty buffer');
    const doc = await PDFDocument.load(res, { ignoreEncryption: true });
    if (doc.getPageCount() !== 2) throw new Error('Page count mismatch');
  });

  await test('9. Unlock PDF', async () => {
    const res = await pdfService.unlock(samplePdf1, { password: 'test' });
    if (!res || res.length === 0) throw new Error('Empty buffer');
  });

  await test('10. Crop PDF', async () => {
    const res = await pdfService.crop(samplePdf1, { margin: 20 });
    const doc = await PDFDocument.load(res);
    if (doc.getPageCount() !== 2) throw new Error('Page count mismatch');
  });

  await test('11. Organize PDF', async () => {
    const res = await pdfService.organize(samplePdf1, { order: [1, 0] });
    const doc = await PDFDocument.load(res);
    if (doc.getPageCount() !== 2) throw new Error('Page count mismatch');
  });

  await test('12. Remove Pages', async () => {
    const res = await pdfService.removePages(samplePdf2, { pages: '2' });
    const doc = await PDFDocument.load(res);
    if (doc.getPageCount() !== 2) throw new Error(`Expected 2 pages after removing 1, got ${doc.getPageCount()}`);
  });

  await test('13. JPG to PDF', async () => {
    const res = await pdfService.jpgToPdf([sampleImg, sampleImg]);
    const doc = await PDFDocument.load(res);
    if (doc.getPageCount() !== 2) throw new Error(`Expected 2 pages, got ${doc.getPageCount()}`);
  });

  await test('14. PDF to JPG', async () => {
    const res = await pdfService.pdfToJpg(samplePdf1);
    if (!Array.isArray(res) || res.length !== 2) throw new Error('Expected 2 extracted JPGs');
  });

  await test('15. Word to PDF & PDF to Word', async () => {
    const wPdf = await pdfService.wordToPdf(Buffer.from('MomPDF Word Sample Text'));
    const doc = await PDFDocument.load(wPdf);
    if (doc.getPageCount() < 1) throw new Error('Empty PDF');

    const docxBuf = await pdfService.pdfToWord(wPdf);
    if (!docxBuf || docxBuf.length === 0) throw new Error('Empty DOCX buffer');
  });

  await test('16. AI Summarizer', async () => {
    const summary = await pdfService.summarize(samplePdf1);
    if (!summary.executiveSummary || !summary.keyHighlights) throw new Error('Invalid summary object');
  });

  await test('17. Sign PDF', async () => {
    const signed = await pdfService.sign(samplePdf1, { signatureText: 'John Doe' });
    const doc = await PDFDocument.load(signed);
    if (doc.getPageCount() !== 2) throw new Error('Page count mismatch');
  });

  await test('18. Redact PDF', async () => {
    const redacted = await pdfService.redact(samplePdf1);
    const doc = await PDFDocument.load(redacted);
    if (doc.getPageCount() !== 2) throw new Error('Page count mismatch');
  });

  await test('19. PDF/A Conversion', async () => {
    const pdfa = await pdfService.convertPdfA(samplePdf1);
    const doc = await PDFDocument.load(pdfa);
    if (doc.getTitle() !== 'ISO 19005-1 PDF/A Conformance') throw new Error('Title tag mismatch');
  });

  await test('20. HTML to PDF (No unwanted headers, pure user content)', async () => {
    const pdfParse = require('pdf-parse');
    const userHtml = '<h1>Invoice #1042</h1><p>Customer: John Doe</p><p>Total Amount: $250.00</p>';
    const htmlPdf = await pdfService.htmlToPdf(userHtml);
    const doc = await PDFDocument.load(htmlPdf);
    if (doc.getPageCount() < 1) throw new Error('Empty HTML PDF');

    const parsed = await pdfParse(htmlPdf);
    if (parsed.text.includes('MomPDF — HTML to PDF Export')) {
      throw new Error('Unwanted "MomPDF — HTML to PDF Export" header found in generated PDF!');
    }
    if (parsed.text.includes('HTML to PDF Export')) {
      throw new Error('Unwanted "HTML to PDF Export" text found in generated PDF!');
    }
    if (!parsed.text.includes('Invoice #1042') || !parsed.text.includes('Total Amount: $250.00')) {
      throw new Error('User original content was missing from generated PDF!');
    }

    // Test Exchanged / Shared PDF flow: pass through another PDF tool (e.g. compress/merge)
    const compressedPdf = await pdfService.compress(htmlPdf);
    const parsedCompressed = await pdfParse(compressedPdf);
    if (parsedCompressed.text.includes('MomPDF — HTML to PDF Export')) {
      throw new Error('Unwanted header reappeared during exchange/re-processing!');
    }
  });

  await test('21. Edit PDF (Annotations & text stamps)', async () => {
    const editedPdf = await pdfService.edit(samplePdf1, { text: 'CONFIDENTIAL NOTE', fontSize: 18, color: '#E11D48' });
    const doc = await PDFDocument.load(editedPdf);
    if (doc.getPageCount() < 1) throw new Error('Failed to edit PDF');
    const parsed = await pdfParse(editedPdf);
    if (!parsed.text.includes('CONFIDENTIAL NOTE')) {
      throw new Error('Edited text not found in PDF output');
    }
  });

  await test('22. Scan to PDF (Image scan conversion)', async () => {
    const imgBuf = await sharp({
      create: {
        width: 300,
        height: 200,
        channels: 3,
        background: { r: 240, g: 240, b: 240 }
      }
    }).jpeg().toBuffer();

    const scanPdf = await pdfService.scan([imgBuf], { orientation: 'portrait', enhance: true });
    const doc = await PDFDocument.load(scanPdf);
    if (doc.getPageCount() !== 1) throw new Error('Scan PDF page count mismatch');
  });

  console.log(`\n========================================`);
  console.log(`  Tests Completed: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal error running tests:', e);
  process.exit(1);
});
