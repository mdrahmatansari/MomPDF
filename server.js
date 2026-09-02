const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const pdfService = require('./services/pdfService');

const app = express();
const PORT = process.env.PORT || 3000;

// Directories
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PROCESSED_DIR = path.join(__dirname, 'processed');
const PUBLIC_DIR = path.join(__dirname, 'public');

[UPLOADS_DIR, PROCESSED_DIR, PUBLIC_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Security & Optimization Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${uniqueSuffix}_${sanitized}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 * 1024 } // 100GB Limit
});

// Helper to save processed buffer to disk and return metadata
function saveProcessedFile(buffer, originalFilename, prefix = 'mompdf_') {
  const cleanPrefix = prefix.replace('_', '');
  const fileId = `${cleanPrefix}_${Date.now()}_${Math.round(Math.random() * 1e6)}`;
  const ext = path.extname(originalFilename) || '.pdf';
  const base = path.basename(originalFilename, ext);
  const outFilename = `${base}_${cleanPrefix}_MomPDF${ext}`;
  const filePath = path.join(PROCESSED_DIR, `${fileId}_${outFilename}`);

  fs.writeFileSync(filePath, Buffer.from(buffer));
  return {
    fileId: `${fileId}_${outFilename}`,
    filename: outFilename,
    downloadUrl: `/api/download/${fileId}_${outFilename}`,
    size: buffer.length
  };
}

// Cleanup uploaded files
function cleanupFiles(files) {
  if (!files) return;
  const fileList = Array.isArray(files) ? files : [files];
  fileList.forEach((f) => {
    const p = typeof f === 'string' ? f : f.path;
    if (p && fs.existsSync(p)) {
      try {
        fs.unlinkSync(p);
      } catch (err) {
        console.error('Error deleting temp file:', err);
      }
    }
  });
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'MomPDF',
    tagline: 'Everything PDF in One Place',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Universal Processing Endpoint
app.post('/api/process', upload.array('files', 500), async (req, res) => {
  const tool = (req.body.tool || 'merge').toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const files = req.files || [];
  const options = req.body || {};

  if (!files.length && tool !== 'html-to-pdf') {
    return res.status(400).json({
      success: false,
      message: 'Please upload at least one file.'
    });
  }

  try {
    let result;
    const firstFile = files[0];
    let fileBuffers = [];

    // Safely load buffers into memory and handle Node.js physical limits
    try {
      fileBuffers = files.map((f) => fs.readFileSync(f.path));
    } catch (err) {
      if (err.code === 'ERR_FS_FILE_TOO_LARGE' || err.message.includes('buffer size')) {
        throw new Error('File size exceeds the physical memory limit that the server can process at once (approx 2GB). Please compress or split the file first.');
      }
      throw err;
    }

    switch (tool) {
      case 'merge':
      case 'merge_pdf':
        const mergedBuffer = await pdfService.merge(fileBuffers, options);
        result = saveProcessedFile(mergedBuffer, firstFile.originalname, 'merged');
        break;

      case 'split':
      case 'split_pdf':
        const splitResult = await pdfService.split(fileBuffers[0], options);
        if (Array.isArray(splitResult)) {
          // Zip all pages together
          const zipId = `split_${Date.now()}_pages.zip`;
          const zipPath = path.join(PROCESSED_DIR, zipId);
          const output = fs.createWriteStream(zipPath);
          const archive = archiver('zip', { zlib: { level: 9 } });

          await new Promise((resolve, reject) => {
            output.on('close', resolve);
            archive.on('error', reject);
            archive.pipe(output);
            splitResult.forEach((p) => {
              const nameStr = String(p.pageNumber);
              const fileName = nameStr.includes('_') || nameStr.includes('-')
                ? `${nameStr}.pdf`
                : `page_${nameStr}.pdf`;
              archive.append(Buffer.from(p.buffer), { name: fileName });
            });
            archive.finalize();
          });

          const baseName = path.basename(firstFile.originalname, path.extname(firstFile.originalname));
          result = {
            fileId: zipId,
            filename: `${baseName}_split_MomPDF.zip`,
            downloadUrl: `/api/download/${zipId}`,
            size: fs.statSync(zipPath).size
          };
        } else {
          result = saveProcessedFile(splitResult, firstFile.originalname, 'split');
        }
        break;

      case 'compress':
      case 'compress_pdf':
        const originalSize = fileBuffers[0].length;
        const compressedBuffer = await pdfService.compress(fileBuffers[0], options);
        result = saveProcessedFile(compressedBuffer, firstFile.originalname, 'compressed');
        const compressedSize = compressedBuffer.length;
        let savedSize = originalSize - compressedSize;
        if (savedSize < 0) savedSize = 0;
        let percentage = originalSize > 0 ? ((savedSize / originalSize) * 100).toFixed(1) : 0;

        result.compressionStats = {
          originalSize,
          compressedSize,
          savedSize,
          percentage
        };
        break;

      case 'rotate':
      case 'rotate_pdf':
        const rotatedBuffer = await pdfService.rotate(fileBuffers[0], options);
        result = saveProcessedFile(rotatedBuffer, firstFile.originalname, 'rotated');
        break;

      case 'watermark':
      case 'pdf_add_watermark':
        const watermarkedBuffer = await pdfService.watermark(fileBuffers[0], options);
        result = saveProcessedFile(watermarkedBuffer, firstFile.originalname, 'watermarked');
        break;

      case 'pagenumber':
      case 'add_pdf_page_number':
        const numberedBuffer = await pdfService.addPageNumbers(fileBuffers[0], options);
        result = saveProcessedFile(numberedBuffer, firstFile.originalname, 'numbered');
        break;

      case 'protect':
      case 'protect-pdf':
        const protectedBuffer = await pdfService.protect(fileBuffers[0], options);
        result = saveProcessedFile(protectedBuffer, firstFile.originalname, 'protected');
        break;

      case 'unlock':
      case 'unlock_pdf':
        const unlockedBuffer = await pdfService.unlock(fileBuffers[0], options);
        result = saveProcessedFile(unlockedBuffer, firstFile.originalname, 'unlocked');
        break;

      case 'crop':
      case 'crop-pdf':
        const croppedBuffer = await pdfService.crop(fileBuffers[0], options);
        result = saveProcessedFile(croppedBuffer, firstFile.originalname, 'cropped');
        break;

      case 'organize':
      case 'organize-pdf':
        const organizedBuffer = await pdfService.organize(fileBuffers[0], options);
        result = saveProcessedFile(organizedBuffer, firstFile.originalname, 'organized');
        break;

      case 'remove-pages':
        const removedBuffer = await pdfService.removePages(fileBuffers[0], options);
        result = saveProcessedFile(removedBuffer, firstFile.originalname, 'pages_removed');
        break;

      case 'jpg_to_pdf':
      case 'jpg-to-pdf':
      case 'image_to_pdf':
        const imgPdfBuffer = await pdfService.jpgToPdf(fileBuffers, options);
        result = saveProcessedFile(imgPdfBuffer, firstFile.originalname, 'to_PDF');
        break;

      case 'pdf_to_jpg':
      case 'pdf-to-jpg':
        const jpgList = await pdfService.pdfToJpg(fileBuffers[0], options);
        if (jpgList.length === 1) {
          result = saveProcessedFile(jpgList[0].buffer, 'page_1.jpg', 'mompdf');
        } else {
          // Zip all JPGs
          const zipId = `pdf_images_${Date.now()}.zip`;
          const zipPath = path.join(PROCESSED_DIR, zipId);
          const output = fs.createWriteStream(zipPath);
          const archive = archiver('zip', { zlib: { level: 9 } });

          await new Promise((resolve, reject) => {
            output.on('close', resolve);
            archive.on('error', reject);
            archive.pipe(output);
            jpgList.forEach((p) => {
              archive.append(p.buffer, { name: `page_${p.page}.jpg` });
            });
            archive.finalize();
          });

          const baseName = path.basename(firstFile.originalname, path.extname(firstFile.originalname));
          result = {
            fileId: zipId,
            filename: `${baseName}_to_JPG_MomPDF.zip`,
            downloadUrl: `/api/download/${zipId}`,
            size: fs.statSync(zipPath).size
          };
        }
        break;

      case 'word_to_pdf':
      case 'word-to-pdf':
        const wPdfBuffer = await pdfService.wordToPdf(fileBuffers[0], options);
        result = saveProcessedFile(wPdfBuffer, firstFile.originalname.replace(/\.docx?$/i, '.pdf'), 'word_to_pdf');
        break;

      case 'pdf_to_word':
      case 'pdf-to-word':
        const docxBuffer = await pdfService.pdfToWord(fileBuffers[0], options);
        result = saveProcessedFile(docxBuffer, firstFile.originalname.replace(/\.pdf$/i, '.docx'), 'pdf_to_word');
        break;

      case 'excel_to_pdf':
      case 'excel-to-pdf':
        const exPdfBuffer = await pdfService.excelToPdf(fileBuffers[0], options);
        result = saveProcessedFile(exPdfBuffer, firstFile.originalname.replace(/\.xlsx?$/i, '.pdf'), 'excel_to_pdf');
        break;

      case 'pdf_to_excel':
      case 'pdf-to-excel':
        const xlsxBuffer = await pdfService.pdfToExcel(fileBuffers[0], options);
        result = saveProcessedFile(xlsxBuffer, firstFile.originalname.replace(/\.pdf$/i, '.xlsx'), 'pdf_to_excel');
        break;

      case 'powerpoint_to_pdf':
      case 'powerpoint-to-pdf':
        const pptPdfBuffer = await pdfService.powerpointToPdf(fileBuffers[0], options);
        result = saveProcessedFile(pptPdfBuffer, firstFile.originalname.replace(/\.pptx?$/i, '.pdf'), 'ppt_to_pdf');
        break;

      case 'pdf_to_powerpoint':
      case 'pdf-to-powerpoint':
        const pptBuffer = await pdfService.pdfToPowerpoint(fileBuffers[0], options);
        result = saveProcessedFile(pptBuffer, firstFile.originalname.replace(/\.pdf$/i, '.docx'), 'pdf_to_ppt');
        break;

      case 'ocr-pdf':
      case 'ocr':
        const ocrBuffer = await pdfService.ocr(fileBuffers[0], options);
        result = saveProcessedFile(ocrBuffer, firstFile.originalname, 'ocr');
        break;

      case 'pdf-summarize':
      case 'summarize':
        const summary = await pdfService.summarize(fileBuffers[0], options);
        // Create both JSON summary and download-able text
        const summaryTxt = Buffer.from(
          `MomPDF AI SUMMARY\n` +
          `====================================\n\n` +
          `Executive Summary:\n${summary.executiveSummary}\n\n` +
          `Key Highlights:\n` +
          summary.keyHighlights.map((k) => `${k.id}. ${k.highlight}`).join('\n')
        );
        result = saveProcessedFile(summaryTxt, `${firstFile.originalname}_summary.txt`, 'summary');
        result.summaryData = summary;
        break;

      case 'translate-pdf':
      case 'translate':
        const transBuffer = await pdfService.translate(fileBuffers[0], options);
        result = saveProcessedFile(transBuffer, firstFile.originalname, 'translated');
        break;

      case 'repair-pdf':
      case 'repair':
        const repBuffer = await pdfService.repair(fileBuffers[0], options);
        result = saveProcessedFile(repBuffer, firstFile.originalname, 'repaired');
        break;

      case 'sign-pdf':
      case 'sign':
        const signBuffer = await pdfService.sign(fileBuffers[0], options);
        result = saveProcessedFile(signBuffer, firstFile.originalname, 'signed');
        break;

      case 'redact-pdf':
      case 'redact':
        const redactBuffer = await pdfService.redact(fileBuffers[0], options);
        result = saveProcessedFile(redactBuffer, firstFile.originalname, 'redacted');
        break;

      case 'compare-pdf':
      case 'compare':
        const compBuffers = fileBuffers.length >= 2 ? fileBuffers : [fileBuffers[0], fileBuffers[0]];
        const compBuffer = await pdfService.compare(compBuffers, options);
        result = saveProcessedFile(compBuffer, 'comparison_report.pdf', 'compared');
        break;

      case 'convert-pdf-to-pdfa':
      case 'pdfa':
        const pdfaBuffer = await pdfService.convertPdfA(fileBuffers[0], options);
        result = saveProcessedFile(pdfaBuffer, firstFile.originalname, 'pdfa');
        break;

      case 'html-to-pdf':
      case 'html_to_pdf':
        let htmlContent = '';
        if (files && files.length > 0) {
          htmlContent = fs.readFileSync(files[0].path, 'utf8');
        } else if (req.body.html) {
          htmlContent = req.body.html;
        } else if (req.body.url) {
          htmlContent = req.body.url;
        }
        const htmlPdfBuffer = await pdfService.htmlToPdf(htmlContent, options);
        const outName = firstFile ? firstFile.originalname.replace(/\.html?$/i, '.pdf') : 'document.pdf';
        result = saveProcessedFile(htmlPdfBuffer, outName, 'converted');
        break;

      case 'edit':
      case 'edit-pdf':
      case 'edit_pdf':
        const editedBuffer = await pdfService.edit(fileBuffers[0], options);
        result = saveProcessedFile(editedBuffer, firstFile.originalname, 'edited');
        break;

      case 'scan':
      case 'scan-pdf':
      case 'scan_pdf':
        const scanPdfBuffer = await pdfService.scan(fileBuffers, options);
        result = saveProcessedFile(scanPdfBuffer, 'scanned_document.pdf', 'mompdf_scan');
        break;

      default:
        // Default fallback to compress/save
        const defBuffer = await pdfService.compress(fileBuffers[0], options);
        result = saveProcessedFile(defBuffer, firstFile.originalname, 'processed');
    }

    // Clean up uploaded temp files
    cleanupFiles(files);

    res.json({
      success: true,
      message: 'File processed successfully!',
      data: result
    });
  } catch (error) {
    cleanupFiles(files);
    console.error(`Error processing tool [${tool}]:`, error);
    res.status(500).json({
      success: false,
      message: error.message || "We couldn't process your file right now. Please try again."
    });
  }
});

// Download endpoint
app.get('/api/download/:fileId', (req, res) => {
  const rawFileId = req.params.fileId;
  const sanitized = path.basename(rawFileId);
  const filePath = path.join(PROCESSED_DIR, sanitized);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found or expired.');
  }

  res.download(filePath, sanitized.replace(/^[a-zA-Z0-9]+_\d+_\d+_/i, ''));
});

// Serve Static Frontend
app.use(express.static(PUBLIC_DIR));

// Dedicated Clean Tool Routes: /pdf/:tool e.g. /pdf/merge, /pdf/compress, /pdf/watermark
app.get('/pdf/:tool', (req, res) => {
  const tool = req.params.tool.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const directHtml = path.join(PUBLIC_DIR, `${tool}.html`);
  const underscoreHtml = path.join(PUBLIC_DIR, `${tool.replace(/-/g, '_')}.html`);
  if (fs.existsSync(directHtml)) {
    return res.sendFile(directHtml);
  } else if (fs.existsSync(underscoreHtml)) {
    return res.sendFile(underscoreHtml);
  }
  res.sendFile(path.join(PUBLIC_DIR, 'workspace.html'));
});

// Fallback to index.html for unknown routes
app.get('*', (req, res) => {
  const possiblePath = path.join(PUBLIC_DIR, req.path);
  if (fs.existsSync(possiblePath) && fs.statSync(possiblePath).isFile()) {
    return res.sendFile(possiblePath);
  }
  const htmlPath = path.join(PUBLIC_DIR, `${req.path}.html`);
  if (fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Garbage Collection Cron: remove files older than 15 minutes
setInterval(() => {
  const now = Date.now();
  const maxAge = 15 * 60 * 1000; // 15 mins

  [UPLOADS_DIR, PROCESSED_DIR].forEach((dir) => {
    fs.readdir(dir, (err, files) => {
      if (err) return;
      files.forEach((file) => {
        const fullPath = path.join(dir, file);
        fs.stat(fullPath, (err, stat) => {
          if (err) return;
          if (now - stat.mtimeMs > maxAge) {
            fs.unlink(fullPath, () => { });
          }
        });
      });
    });
  });
}, 5 * 60 * 1000);

// Global error handler for middleware (e.g. Multer limits)
app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: 'File upload limit exceeded or too many files.' });
  }
  res.status(500).json({ success: false, message: err.message || 'Internal server error.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  MomPDF Server Running!`);
  console.log(`  Brand: MomPDF`);
  console.log(`  Tagline: Everything PDF in One Place`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`========================================`);
});
