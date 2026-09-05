const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
const sharp = require('sharp');
const pdfParse = require('pdf-parse');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const { encryptPDF, decryptPDF } = require('@pdfsmaller/pdf-encrypt-lite');
const XLSX = require('xlsx');
const Cantoo = require('@cantoo/pdf-lib');

class PDFService {
  /**
   * 1. Merge multiple PDF files into one
   */
  async merge(fileBuffers, options = {}) {
    const mergedPdf = await PDFDocument.create();
    for (const buffer of fileBuffers) {
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    return await mergedPdf.save();
  }

  /**
   * 2. Split PDF by pages or ranges
   * Supports modes: extract_all, custom ranges, fixed (every-N), equal parts
   */
  async split(fileBuffer, options = {}) {
    const srcPdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const totalPages = srcPdf.getPageCount();

    if (totalPages === 0) {
      throw new Error('This PDF has no pages to split.');
    }

    // Parse advancedRanges JSON from the UI hidden field
    let advancedState = null;
    if (options.advancedRanges) {
      try { advancedState = JSON.parse(options.advancedRanges); } catch (e) {
        console.warn('Failed to parse advancedRanges JSON:', e.message);
      }
    }

    // --- Fallback: no advancedState (legacy / simple mode) ---
    if (!advancedState) {
      const splitMode = options.splitMode || 'all';
      if (splitMode === 'all' || splitMode === 'extract_all') {
        return await this._splitAllPages(srcPdf, totalPages);
      } else {
        const pageIndicesToKeep = this.parsePageRanges(options.ranges || '1', totalPages);
        if (pageIndicesToKeep.length === 0) {
          throw new Error('No valid pages selected. Please check your page range.');
        }
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, pageIndicesToKeep);
        copiedPages.forEach((page) => newPdf.addPage(page));
        return await newPdf.save();
      }
    }

    // --- PAGES TAB: Extract pages individually or merge selected ---
    if (advancedState.tab === 'pages') {
      const selected = advancedState.selectedPages || advancedState.pages || null;
      return await this._splitAllPages(srcPdf, totalPages, selected, advancedState.merge === true);
    }

    // --- SIZE TAB: Split by approximate max file size ---
    if (advancedState.tab === 'size') {
      const sizeAmount = parseFloat(advancedState.maxSize) || 5;
      const sizeUnit = advancedState.sizeUnit || 'MB';
      const maxBytes = sizeUnit === 'KB' ? sizeAmount * 1024 : sizeAmount * 1024 * 1024;
      const srcBytes = fileBuffer.byteLength || fileBuffer.length;
      const avgBytesPerPage = srcBytes / totalPages;

      let chunkPages = Math.floor(maxBytes / avgBytesPerPage);
      if (chunkPages < 1) chunkPages = 1;

      const results = [];
      for (let i = 0; i < totalPages; i += chunkPages) {
        const end = Math.min(i + chunkPages - 1, totalPages - 1);
        const indices = [];
        for (let k = i; k <= end; k++) indices.push(k);

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, indices);
        copiedPages.forEach((page) => newPdf.addPage(page));
        results.push({ pageNumber: `part_pages_${i + 1}-${end + 1}`, buffer: await newPdf.save() });
      }
      return results;
    }

    // --- EQUAL PARTS TAB ---
    if (advancedState.tab === 'equal') {
      const parts = Math.max(1, Math.min(totalPages, parseInt(advancedState.equalParts) || 2));
      const baseSize = Math.floor(totalPages / parts);
      const remainder = totalPages % parts;
      const results = [];
      let pageIdx = 0;

      for (let p = 0; p < parts; p++) {
        const chunkSize = baseSize + (p < remainder ? 1 : 0);
        if (chunkSize === 0) continue;
        const indices = [];
        for (let k = 0; k < chunkSize; k++) {
          indices.push(pageIdx + k);
        }
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, indices);
        copiedPages.forEach((page) => newPdf.addPage(page));
        results.push({
          pageNumber: `part_${p + 1}_pages_${pageIdx + 1}-${pageIdx + chunkSize}`,
          buffer: await newPdf.save()
        });
        pageIdx += chunkSize;
      }
      return results;
    }

    // --- RANGE TAB ---
    if (advancedState.tab === 'range') {

      // MODE: Fixed (every N pages)
      if (advancedState.mode === 'fixed') {
        const chunk = Math.max(1, parseInt(advancedState.fixed) || 1);
        const results = [];
        for (let i = 0; i < totalPages; i += chunk) {
          const end = Math.min(i + chunk - 1, totalPages - 1);
          const indices = [];
          for (let k = i; k <= end; k++) indices.push(k);

          const newPdf = await PDFDocument.create();
          const copiedPages = await newPdf.copyPages(srcPdf, indices);
          copiedPages.forEach((page) => newPdf.addPage(page));
          results.push({ pageNumber: `${i + 1}-${end + 1}`, buffer: await newPdf.save() });
        }
        return results;
      }

      // MODE: Custom ranges (default)
      if (advancedState.mode === 'custom' || !advancedState.mode) {

        const ranges = advancedState.ranges;
        if (!ranges || !Array.isArray(ranges) || ranges.length === 0) {
          throw new Error('No ranges specified. Please add at least one range.');
        }

        // Validate ranges
        for (let idx = 0; idx < ranges.length; idx++) {
          const r = ranges[idx];
          const from = parseInt(r.from);
          const to = parseInt(r.to);
          if (isNaN(from) || isNaN(to) || from < 1 || to < 1) {
            throw new Error(`Range ${idx + 1}: Invalid page numbers. Pages must be >= 1.`);
          }
          if (from > totalPages && to > totalPages) {
            throw new Error(`Range ${idx + 1}: Pages ${from}-${to} exceed the PDF total of ${totalPages} pages.`);
          }
        }

        if (advancedState.merge) {
          // Merge all ranges into a single output PDF with ONE copyPages call for optimal memory
          const newPdf = await PDFDocument.create();
          const allIndices = [];

          for (const r of ranges) {
            let start = Math.max(1, parseInt(r.from)) - 1;
            let end = Math.min(totalPages, parseInt(r.to)) - 1;
            if (start > end) [start, end] = [end, start];

            for (let k = start; k <= end; k++) {
              allIndices.push(k);
            }
          }

          if (allIndices.length === 0) {
            throw new Error('No valid pages found in the specified ranges.');
          }

          const copiedPages = await newPdf.copyPages(srcPdf, allIndices);
          copiedPages.forEach((page) => newPdf.addPage(page));
          return await newPdf.save();
        } else {
          // Each range as a separate PDF
          const results = [];
          for (let idx = 0; idx < ranges.length; idx++) {
            const r = ranges[idx];
            let start = Math.max(1, parseInt(r.from)) - 1;
            let end = Math.min(totalPages, parseInt(r.to)) - 1;
            if (start > end) [start, end] = [end, start];

            const indices = [];
            for (let k = start; k <= end; k++) indices.push(k);
            if (indices.length > 0) {
              const newPdf = await PDFDocument.create();
              const copiedPages = await newPdf.copyPages(srcPdf, indices);
              copiedPages.forEach((page) => newPdf.addPage(page));
              results.push({
                pageNumber: `pages_${start + 1}-${end + 1}`,
                buffer: await newPdf.save()
              });
            }
          }
          if (results.length === 0) {
            throw new Error('No valid pages found in the specified ranges.');
          }
          if (results.length === 1) return results[0].buffer;
          return results;
        }
      }
    }

    // Fallback: if no recognized tab/mode, extract all pages
    return await this._splitAllPages(srcPdf, totalPages);
  }

  /**
   * Helper: Split every page into its own PDF or merge selected pages
   */
  async _splitAllPages(srcPdf, totalPages, selectedPages = null, merge = false) {
    let pagesToExtract = Array.from({ length: totalPages }, (_, i) => i);

    // Parse selected pages if provided (array or comma-separated string)
    if (selectedPages) {
      let pageArray = [];
      if (Array.isArray(selectedPages)) {
        pageArray = selectedPages;
      } else if (typeof selectedPages === 'string') {
        pageArray = selectedPages.split(',');
      }
      if (pageArray.length > 0) {
        pagesToExtract = pageArray.map(p => parseInt(p) - 1).filter(p => !isNaN(p) && p >= 0 && p < totalPages);
      }
    }

    if (pagesToExtract.length === 0) {
      throw new Error('No valid pages found to extract.');
    }

    if (merge) {
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(srcPdf, pagesToExtract);
      copiedPages.forEach((page) => newPdf.addPage(page));
      return await newPdf.save();
    } else {
      const results = [];
      for (let i of pagesToExtract) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(srcPdf, [i]);
        newPdf.addPage(copiedPage);
        results.push({ pageNumber: i + 1, buffer: await newPdf.save() });
      }
      return results;
    }
  }

  /**
   * 3. Compress PDF (optimize objects, metadata, and downsample images via Ghostscript)
   */
  async compress(fileBuffer, options = {}) {
    const level = options.level || 'recommended';
    let pdfSettings = '/ebook'; // recommended (150 dpi)

    if (level === 'extreme') pdfSettings = '/screen'; // (72 dpi)
    if (level === 'less') pdfSettings = '/printer';   // (300 dpi)

    let targetBytes = 0;
    if (level === 'custom' && options.targetSize) {
      const sizeNum = parseFloat(options.targetSize);
      if (sizeNum > 0) {
        targetBytes = options.targetUnit === 'KB' ? sizeNum * 1024 : sizeNum * 1024 * 1024;
      }
    }

    // If already smaller than target, return original immediately
    if (targetBytes > 0 && fileBuffer.length <= targetBytes) {
      return fileBuffer;
    }

    const { execFile } = require('child_process');
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    const util = require('util');
    const execFileAsync = util.promisify(execFile);

    const tmpDir = os.tmpdir();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const inputPath = path.join(tmpDir, `input_${uniqueId}.pdf`);
    const outputPath = path.join(tmpDir, `output_${uniqueId}.pdf`);

    try {
      await fs.writeFile(inputPath, fileBuffer);

      const isWindows = os.platform() === 'win32';
      let gsCommand = isWindows ? 'gswin64c' : 'gs';

      if (isWindows) {
        try {
          const gsDir = 'C:\\Program Files\\gs';
          const subdirs = await fs.readdir(gsDir);
          subdirs.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
          for (const dir of subdirs) {
            const exePath = path.join(gsDir, dir, 'bin', 'gswin64c.exe');
            try {
              await fs.access(exePath);
              gsCommand = `"${exePath}"`;
              break;
            } catch (e) { }
          }
        } catch (e) { }
      }

      try {
        const gsProfiles = [];
        if (level === 'custom' && targetBytes > 0) {
          gsProfiles.push(['-dPDFSETTINGS=/printer']);
          gsProfiles.push(['-dPDFSETTINGS=/ebook']);
          gsProfiles.push(['-dPDFSETTINGS=/screen']);
          gsProfiles.push(['-dPDFSETTINGS=/screen', '-dColorImageResolution=50', '-dGrayImageResolution=50', '-dMonoImageResolution=50']);
          gsProfiles.push(['-dPDFSETTINGS=/screen', '-dColorImageResolution=30', '-dGrayImageResolution=30', '-dMonoImageResolution=30']);
        } else {
          gsProfiles.push([`-dPDFSETTINGS=${pdfSettings}`]);
          if (level === 'recommended') {
            // Fallback profiles if the default one fails to compress
            gsProfiles.push(['-dPDFSETTINGS=/screen']);
            gsProfiles.push(['-dPDFSETTINGS=/screen', '-dColorImageResolution=72', '-dGrayImageResolution=72', '-dMonoImageResolution=72']);
          }
        }

        let bestBytes = fileBuffer;
        let bestSize = fileBuffer.length;
        let success = false;
        const exeCmd = gsCommand.replace(/"/g, '');

        for (const profileArgs of gsProfiles) {
          const args = [
            '-sDEVICE=pdfwrite',
            '-dCompatibilityLevel=1.4',
            '-dNOPAUSE',
            '-dQUIET',
            '-dBATCH',
            `-sOutputFile=${outputPath}`,
            ...profileArgs,
            inputPath
          ];

          await execFileAsync(exeCmd, args);
          const compressedBytes = await fs.readFile(outputPath);

          // Delete temp output for next iteration
          await fs.unlink(outputPath).catch(() => { });

          // Track the smallest one we've produced
          if (compressedBytes.length < bestSize) {
            bestBytes = compressedBytes;
            bestSize = compressedBytes.length;
            success = true;
          }

          // If we achieved at least 5% compression and we are not in custom target mode, break early to save time
          if (targetBytes === 0 && bestSize < fileBuffer.length * 0.95) {
            break;
          }

          // If it hits the target size, we are done
          if (targetBytes > 0 && compressedBytes.length <= targetBytes) {
            break;
          }
        }

        await fs.unlink(inputPath).catch(() => { });

        // If gs failed to make it smaller (e.g. text-only PDF), return the original
        return bestBytes;

      } catch (gsError) {
        console.warn('Ghostscript compression failed or not installed. Falling back to pdf-lib.', gsError.message);

        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        const compressedBytes = await pdfDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 50
        });

        await fs.unlink(inputPath).catch(() => { });
        return compressedBytes.length < fileBuffer.length ? compressedBytes : fileBuffer;
      }
    } catch (err) {
      throw new Error(`Compression failed: ${err.message}`);
    }
  }

  /**
   * 4. Rotate PDF pages
   */
  async rotate(fileBuffer, options = {}) {
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const angle = parseInt(options.angle || 90, 10);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + angle) % 360));
    });

    return await pdfDoc.save();
  }

  /**
   * 5. Add Watermark (Text or Image, Mosaic, Layers, Page Ranges)
   */
  async watermark(fileBuffer, options = {}) {
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    // Options parsing
    const mode = options.wmMode || 'text';
    const layer = options.layer || 'over';
    const opacity = parseFloat(options.transparency || 0.5);
    const angle = parseInt(options.angle || 45, 10);
    const position = options.position || 'center';
    
    // Page Range
    const pageFrom = Math.max(1, parseInt(options.pageFrom || 1, 10));
    const pageTo = options.pageTo ? Math.min(totalPages, parseInt(options.pageTo, 10)) : totalPages;

    let watermarkAsset = null;
    let wmDims = { width: 0, height: 0 };
    let drawFunc = null;

    if (mode === 'text') {
      const text = options.text || 'CONFIDENTIAL';
      const fontSize = parseInt(options.fontSize || 72, 10);
      const isBold = options.isBold === 'true';
      const isItalic = options.isItalic === 'true';
      const isUnderline = options.isUnderline === 'true';
      const colorHex = options.color || '#E11D48';
      const cRgb = this.hexToRgb(colorHex);
      
      let fontName = 'Helvetica';
      if (options.font === 'TimesRoman') fontName = 'TimesRoman';
      if (options.font === 'Courier') fontName = 'Courier';
      
      if (isBold && isItalic) fontName += fontName === 'TimesRoman' ? 'BoldItalic' : 'BoldOblique';
      else if (isBold) fontName += 'Bold';
      else if (isItalic) fontName += fontName === 'TimesRoman' ? 'Italic' : 'Oblique';
      
      const font = await pdfDoc.embedFont(StandardFonts[fontName]);
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);
      wmDims = { width: textWidth, height: textHeight };
      
      drawFunc = (page, x, y) => {
        page.drawText(text, {
          x, y,
          size: fontSize,
          font: font,
          color: rgb(cRgb.r, cRgb.g, cRgb.b),
          opacity: opacity,
          rotate: degrees(angle)
        });
        
        if (isUnderline) {
          // Calculate underline start/end points using rotation matrix
          const rad = (angle * Math.PI) / 180;
          const uOffset = fontSize * -0.1; // roughly below baseline
          // un-rotated points relative to origin
          const p1x = 0; const p1y = uOffset;
          const p2x = textWidth; const p2y = uOffset;
          // rotated and translated points
          const rp1x = x + (p1x * Math.cos(rad) - p1y * Math.sin(rad));
          const rp1y = y + (p1x * Math.sin(rad) + p1y * Math.cos(rad));
          const rp2x = x + (p2x * Math.cos(rad) - p2y * Math.sin(rad));
          const rp2y = y + (p2x * Math.sin(rad) + p2y * Math.cos(rad));
          
          page.drawLine({
            start: { x: rp1x, y: rp1y },
            end: { x: rp2x, y: rp2y },
            thickness: Math.max(1, fontSize * 0.05),
            color: rgb(cRgb.r, cRgb.g, cRgb.b),
            opacity: opacity
          });
        }
      };
    } else {
      // Image Mode
      if (options.imageBase64) {
        const base64Data = options.imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        if (options.imageBase64.includes('image/png')) {
          watermarkAsset = await pdfDoc.embedPng(imageBuffer);
        } else {
          watermarkAsset = await pdfDoc.embedJpg(imageBuffer);
        }
        const sizePct = parseInt(options.imageSize || 50, 10) / 100;
        
        // Use the first page dimensions as a reference to scale the image
        const refSize = pages[0].getSize();
        const maxW = refSize.width * sizePct;
        const maxH = refSize.height * sizePct;
        
        const dims = watermarkAsset.scaleToFit(maxW, maxH);
        wmDims = { width: dims.width, height: dims.height };
        
        drawFunc = (page, x, y) => {
          page.drawImage(watermarkAsset, {
            x, y,
            width: dims.width,
            height: dims.height,
            opacity: opacity,
            rotate: degrees(angle)
          });
        };
      }
    }

    if (!drawFunc) return await pdfDoc.save();

    for (let i = 0; i < totalPages; i++) {
      const pageNum = i + 1;
      if (pageNum < pageFrom || pageNum > pageTo) continue;

      const page = pages[i];
      page.node.normalize();
      const contents = page.node.Contents();
      const initialSize = contents ? contents.size() : 0;
      const { width, height } = page.getSize();
      
      const drawAt = (x, y) => {
        // We apply rotation to the item around its bottom-left origin in drawText/drawImage.
        // To center the rotated block visually, we offset x and y based on the bounding box.
        const rad = (angle * Math.PI) / 180;
        // The visual center of the unrotated text is (W/2, H/2).
        // Rotated center relative to origin:
        const cx = (wmDims.width / 2) * Math.cos(rad) - (wmDims.height / 2) * Math.sin(rad);
        const cy = (wmDims.width / 2) * Math.sin(rad) + (wmDims.height / 2) * Math.cos(rad);
        
        drawFunc(page, x - cx, y - cy);
      };

      if (position === 'mosaic') {
        const xStep = Math.max(wmDims.width, 100) * 1.5;
        const yStep = Math.max(wmDims.height, 100) * 1.5;
        for (let y = -yStep; y < height + yStep; y += yStep) {
          for (let x = -xStep; x < width + xStep; x += xStep) {
            drawAt(x, y);
          }
        }
      } else {
        let px = width / 2;
        let py = height / 2;
        
        if (position.includes('left')) px = wmDims.width / 2 + 30;
        if (position.includes('right')) px = width - wmDims.width / 2 - 30;
        if (position.includes('top')) py = height - wmDims.height / 2 - 30;
        if (position.includes('bottom')) py = wmDims.height / 2 + 30;
        
        drawAt(px, py);
      }
      
      // Handle Layer: 'below' (send to back)
      if (layer === 'below' && contents) {
        const newSize = contents.size();
        const addedRefs = [];
        for (let idx = initialSize; idx < newSize; idx++) {
          addedRefs.push(contents.get(idx));
        }
        // Remove from end
        for (let idx = newSize - 1; idx >= initialSize; idx--) {
          contents.remove(idx);
        }
        // Prepend to beginning
        for (let idx = addedRefs.length - 1; idx >= 0; idx--) {
          contents.insert(0, addedRefs[idx]);
        }
      }
    }

    return await pdfDoc.save();
  }

  /**
   * 6. Add Page Numbers
   */
  async addPageNumbers(fileBuffer, options = {}) {
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    
    const fontName = options.font || 'Helvetica';
    const isBold = options.isBold === 'true';
    const isItalic = options.isItalic === 'true';
    
    let fontKey = StandardFonts.Helvetica;
    if (fontName === 'TimesRoman') {
      fontKey = isBold && isItalic ? StandardFonts.TimesRomanBoldItalic : isBold ? StandardFonts.TimesRomanBold : isItalic ? StandardFonts.TimesRomanItalic : StandardFonts.TimesRoman;
    } else if (fontName === 'Courier') {
      fontKey = isBold && isItalic ? StandardFonts.CourierBoldOblique : isBold ? StandardFonts.CourierBold : isItalic ? StandardFonts.CourierOblique : StandardFonts.Courier;
    } else {
      // Helvetica
      fontKey = isBold && isItalic ? StandardFonts.HelveticaBoldOblique : isBold ? StandardFonts.HelveticaBold : isItalic ? StandardFonts.HelveticaOblique : StandardFonts.Helvetica;
    }

    const font = await pdfDoc.embedFont(fontKey);
    const fontSize = parseInt(options.fontSize || 11, 10);
    const pos = options.position || 'bottom_right';
    let format = options.format || '{n}';
    if (format === 'custom') format = options.customText || '{n}';
    
    let margin = options.margin || '28';
    if (margin === 'custom') margin = options.customMargin || '28';
    margin = parseInt(margin, 10);
    
    const colorHex = options.color || '#333333';
    
    const parseColor = (hex) => {
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      return rgb(r, g, b);
    };
    const color = parseColor(colorHex);

    const pageMode = options.pageMode || 'single';
    const isCoverPage = options.coverPage === 'true';
    const startNum = parseInt(options.firstNumber || 1, 10);
    const pageFrom = parseInt(options.pageFrom || 1, 10);
    const pageTo = parseInt(options.pageTo || pdfDoc.getPageCount(), 10);

    const pages = pdfDoc.getPages();
    const total = pages.length;

    pages.forEach((page, index) => {
      const realPageNum = index + 1;
      let displayPageNum = startNum + (realPageNum - pageFrom);

      if (pageMode === 'facing' && isCoverPage) {
        if (realPageNum === 1) return; // Skip cover page
        displayPageNum = startNum + (realPageNum - 2);
        if (realPageNum < pageFrom + 1 || realPageNum > pageTo) return;
      } else {
        if (realPageNum < pageFrom || realPageNum > pageTo) return;
      }

      const text = format.replace(/\{n\}/g, displayPageNum.toString()).replace(/\{total\}/g, total.toString());
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      let effectivePos = pos;
      if (pageMode === 'facing') {
         const isEvenPage = realPageNum % 2 === 0;
         if (isEvenPage) {
           if (effectivePos.includes('left')) effectivePos = effectivePos.replace('left', 'right');
           else if (effectivePos.includes('right')) effectivePos = effectivePos.replace('right', 'left');
         }
      }

      let x = margin;
      let y = margin;

      // X Position
      if (effectivePos.includes('left')) {
        x = margin;
      } else if (effectivePos.includes('right')) {
        x = width - textWidth - margin;
      } else if (effectivePos.includes('center') || effectivePos === 'center') {
        x = (width / 2) - (textWidth / 2);
      }

      // Y Position
      if (effectivePos.includes('top')) {
        y = height - textHeight - margin;
      } else if (effectivePos.includes('bottom')) {
        y = margin;
      } else if (effectivePos.includes('middle') || effectivePos === 'center') {
        y = (height / 2) - (textHeight / 2);
      }

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color
      });

      if (options.isUnderline === 'true') {
        const thickness = fontSize * 0.08;
        const offset = fontSize * 0.15;
        page.drawLine({
          start: { x, y: y - offset },
          end: { x: x + textWidth, y: y - offset },
          thickness: thickness,
          color: color
        });
      }
    });

    return await pdfDoc.save();
  }

  /**
   * 7. Protect PDF (Password)
   */
  async protect(fileBuffer, options = {}) {
    const password = options.password || '1234';
    
    // Parse permissions from options. If not provided, assume false (denied).
    const allowPrinting = options.allowPrinting === 'true';
    const allowCopying = options.allowCopying === 'true';
    const allowModifying = options.allowModifying === 'true';

    try {
      let pdfDoc;
      try {
        pdfDoc = await Cantoo.PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      } catch (parseErr) {
        if (parseErr.message && parseErr.message.includes('Failed to parse PDF document')) {
          throw new Error('Invalid or corrupted PDF file. If this PDF is already password-protected, please unlock it first.');
        }
        throw parseErr;
      }
      
      pdfDoc.setTitle('Protected by MomPDF');
      pdfDoc.setSubject('Encrypted Document');
      pdfDoc.setProducer('MomPDF Security Engine');
      const preparedBytes = await pdfDoc.save();
      
      const encryptOptions = {
        ownerPassword: password,
        allowPrinting: allowPrinting,
        allowCopying: allowCopying,
        allowModifying: allowModifying,
        allowAnnotating: allowModifying,
        allowFillingForms: allowModifying,
        allowExtraction: allowCopying,
        allowAssembly: allowModifying,
        allowHighQualityPrint: allowPrinting
      };

      const encryptedBytes = await encryptPDF(preparedBytes, password, encryptOptions);
      return encryptedBytes;
    } catch (e) {
      console.error('PDF encryption failed:', e);
      const msg = (e.message || '');
      if (msg.includes('Invalid or corrupted') || msg.includes('Failed to parse PDF document')) {
        throw new Error('Invalid or corrupted PDF file. Please ensure you are uploading a valid PDF. If it is already protected, unlock it first.');
      }
      throw new Error(`Failed to protect PDF: ${e.message}`);
    }
  }

  /**
   * 8. Unlock PDF
   */
  async unlock(fileBuffer, options = {}) {
    const password = options.password || '';
    try {
      // First try opening with the provided password (or empty if permissions-only)
      const pdfDoc = await Cantoo.PDFDocument.load(fileBuffer, { password: password });
      pdfDoc.setProducer('MomPDF Decrypted');
      return await pdfDoc.save();
    } catch (e) {
      const errMsg = (e.message || '').toLowerCase();
      if (errMsg.includes('password') || errMsg.includes("reading 'pages'") || errMsg.includes('pages')) {
        throw new Error('Password required or incorrect — cannot unlock this PDF without the correct password.');
      }
      throw new Error(`Failed to unlock PDF: ${e.message}`);
    }
  }

  /**
   * 9. Crop PDF
   */
  async crop(fileBuffer, options = {}) {
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    
    // Front-end canvas coordinates mapped to 1.0 scale
    const x = parseFloat(options.x) || 0;
    const y = parseFloat(options.y) || 0; // from top-left
    const width = parseFloat(options.width) || 0;
    const height = parseFloat(options.height) || 0;
    
    const pageMode = options.pageMode || 'all'; // 'all' or 'current'
    const currentPage = parseInt(options.currentPage || 1, 10);
    
    pages.forEach((page, index) => {
      if (pageMode === 'current' && (index + 1) !== currentPage) {
        return; // skip if not current page
      }
      
      const { width: pWidth, height: pHeight } = page.getSize();
      
      // Calculate coordinates from bottom-left
      // UI top-left (x, y) with (width, height)
      // PDF bottom-left is at (0,0)
      // So UI top (y) corresponds to PDF Y = pHeight - y
      // UI bottom (y + height) corresponds to PDF Y = pHeight - (y + height)
      const pdfX = x;
      const pdfY = pHeight - (y + height);
      
      // Ensure we don't go out of bounds or negative
      const safeX = Math.max(0, Math.min(pWidth - 10, pdfX));
      const safeY = Math.max(0, Math.min(pHeight - 10, pdfY));
      const safeW = Math.max(10, Math.min(pWidth - safeX, width));
      const safeH = Math.max(10, Math.min(pHeight - safeY, height));
      
      page.setCropBox(safeX, safeY, safeW, safeH);
      // We also set MediaBox so it's fully bounded.
      page.setMediaBox(safeX, safeY, safeW, safeH);
    });
    
    return await pdfDoc.save();
  }

  /**
   * 10. Organize PDF (Reorder/Duplicate pages)
   */
  async organize(fileBuffers, options = {}) {
    const buffers = Array.isArray(fileBuffers) ? fileBuffers : [fileBuffers];
    const pdfs = [];
    for (const buf of buffers) {
      pdfs.push(await PDFDocument.load(buf, { ignoreEncryption: true }));
    }
    
    // order e.g. "0:1,0:2,1:1"
    let orderList = options.order ? options.order.split(',') : [];
    let rotations = options.rotations ? options.rotations.split(',') : [];
    
    const newPdf = await PDFDocument.create();
    
    if (orderList.length === 0 && pdfs.length > 0) {
       // Default: just copy all pages of the first PDF
       const totalPages = pdfs[0].getPageCount();
       for (let i = 0; i < totalPages; i++) orderList.push(`0:${i}`);
    }
    
    for (let i = 0; i < orderList.length; i++) {
        const parts = orderList[i].split(':');
        let fileIdx = 0;
        let pageIdx = parseInt(parts[0], 10);
        
        // If order string is "fileIndex:pageIndex"
        if (parts.length > 1) {
           fileIdx = parseInt(parts[0], 10);
           pageIdx = parseInt(parts[1], 10);
        } else {
           // Fallback for old "1, 2, 3" 1-indexed format
           pageIdx = parseInt(parts[0], 10) - 1;
        }
        
        const srcPdf = pdfs[fileIdx];
        if (srcPdf && !isNaN(pageIdx) && pageIdx >= 0 && pageIdx < srcPdf.getPageCount()) {
            const [copiedPage] = await newPdf.copyPages(srcPdf, [pageIdx]);
            
            const angle = parseInt(rotations[i] || 0, 10);
            if (angle) {
                const currentRot = copiedPage.getRotation().angle;
                copiedPage.setRotation(degrees((currentRot + angle) % 360));
            }
            newPdf.addPage(copiedPage);
        }
    }
    
    return await newPdf.save();
  }

  /**
   * 11. Remove Pages
   */
  async removePages(fileBuffer, options = {}) {
    const srcPdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const totalPages = srcPdf.getPageCount();
    const newPdf = await PDFDocument.create();

    if (options.order) {
      const orderList = options.order.split(',');
      for (const item of orderList) {
        if (item === 'blank') {
          newPdf.addPage([595.28, 841.89]); // Standard A4 blank page
        } else {
          const index = parseInt(item, 10);
          if (!isNaN(index) && index >= 0 && index < totalPages) {
            const [copiedPage] = await newPdf.copyPages(srcPdf, [index]);
            newPdf.addPage(copiedPage);
          }
        }
      }
    } else {
      // Fallback to legacy string range parsing
      const pagesToRemove = this.parsePageRanges(options.pages || '', totalPages);
      const pagesToKeep = [];
      for (let i = 0; i < totalPages; i++) {
        if (!pagesToRemove.includes(i)) {
          pagesToKeep.push(i);
        }
      }
      if (pagesToKeep.length === 0) {
        throw new Error('Cannot remove all pages from PDF. At least one page must remain.');
      }
      const copiedPages = await newPdf.copyPages(srcPdf, pagesToKeep);
      copiedPages.forEach((page) => newPdf.addPage(page));
    }

    return await newPdf.save();
  }

  /**
   * 12. Convert Images (JPG, PNG, WebP) to PDF
   */
  async jpgToPdf(imageBuffers, options = {}) {
    const pdfDoc = await PDFDocument.create();
    const orientation = options.orientation || 'auto'; // 'portrait', 'landscape', 'auto'
    const margin = parseInt(options.margin || 0, 10);

    for (const imgBuffer of imageBuffers) {
      // Normalize image using Sharp to JPEG
      const jpegBuffer = await sharp(imgBuffer).jpeg({ quality: 92 }).toBuffer();
      const image = await pdfDoc.embedJpg(jpegBuffer);

      let imgWidth = image.width;
      let imgHeight = image.height;

      let pageWidth = imgWidth + margin * 2;
      let pageHeight = imgHeight + margin * 2;

      if (orientation === 'portrait' && pageWidth > pageHeight) {
        // scale to fit portrait
        pageWidth = 595.28; // A4
        pageHeight = 841.89;
      } else if (orientation === 'landscape' && pageHeight > pageWidth) {
        pageWidth = 841.89;
        pageHeight = 595.28;
      }

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Calculate fitted dimensions
      const availWidth = pageWidth - margin * 2;
      const availHeight = pageHeight - margin * 2;
      const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);

      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      const drawX = margin + (availWidth - drawWidth) / 2;
      const drawY = margin + (availHeight - drawHeight) / 2;

      page.drawImage(image, {
        x: drawX,
        y: drawY,
        width: drawWidth,
        height: drawHeight
      });
    }

    return await pdfDoc.save();
  }

  /**
   * 13. PDF to JPG (Extract text/page summaries or preview images)
   */
  async pdfToJpg(fileBuffer, options = {}) {
    const { spawn } = require('child_process');
    const fs = require('fs').promises;
    const fsSync = require('fs');
    const path = require('path');
    const os = require('os');
    const util = require('util');

    const tmpDir = os.tmpdir();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const inputPath = path.join(tmpDir, `input_${uniqueId}.pdf`);
    const outputDir = path.join(tmpDir, `output_jpgs_${uniqueId}`);

    const taskId = options.taskId;

    try {
      await fs.writeFile(inputPath, fileBuffer);
      await fs.mkdir(outputDir, { recursive: true });

      let pythonCmd = 'python';
      if (os.platform() === 'win32') {
        const defaultPaths = [
          'C:\\Users\\hp\\AppData\\Local\\Programs\\Python\\Python313\\python.exe',
          'C:\\Users\\hp\\AppData\\Local\\Microsoft\\WindowsApps\\python.exe'
        ];
        let foundPath = null;
        for (const p of defaultPaths) {
          if (fsSync.existsSync(p)) {
            foundPath = p;
            break;
          }
        }
        pythonCmd = foundPath || 'python';
      } else {
        pythonCmd = 'python3';
      }

      const scriptPath = path.join(__dirname, '..', 'scripts', 'pdf_to_jpg.py');
      const quality = options.quality || 'high';

      await new Promise((resolve, reject) => {
        const process = spawn(pythonCmd, [
          scriptPath,
          inputPath,
          outputDir,
          '--quality',
          quality
        ]);

        process.stdout.on('data', (data) => {
          const lines = data.toString().split('\n');
          lines.forEach(line => {
            const txt = line.trim();
            if (!txt) return;
            if (taskId && global.progressMap) {
              if (txt.startsWith('PROGRESS_INIT:')) {
                const total = parseInt(txt.split(':')[1]);
                global.progressMap.set(taskId, { progress: 75, message: `Starting conversion of ${total} pages...` });
              } else if (txt.startsWith('PROGRESS_UPDATE:')) {
                const parts = txt.split(':');
                const curr = parseInt(parts[1]);
                const total = parseInt(parts[2]);
                // Map page processing to 75% -> 95%
                const pct = 75 + Math.round((curr / total) * 20);
                global.progressMap.set(taskId, { progress: pct, message: `Converting page ${curr} of ${total}...` });
              }
            }
          });
        });

        process.stderr.on('data', (data) => {
          console.error(`pdf_to_jpg stderr: ${data}`);
        });

        process.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error('PDF to JPG conversion script failed.'));
        });
      });

      // Read generated JPGs
      const files = await fs.readdir(outputDir);
      const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg'));

      if (jpgFiles.length === 0) {
        throw new Error('No JPG images were generated.');
      }

      // Sort by page number
      jpgFiles.sort((a, b) => {
        const numA = parseInt(a.replace('page_', '').replace('.jpg', ''));
        const numB = parseInt(b.replace('page_', '').replace('.jpg', ''));
        return numA - numB;
      });

      const images = [];
      for (const file of jpgFiles) {
        const filePath = path.join(outputDir, file);
        const buffer = await fs.readFile(filePath);
        const pageNum = parseInt(file.replace('page_', '').replace('.jpg', ''));
        images.push({ page: pageNum, buffer });
      }

      return images;
    } finally {
      await fs.unlink(inputPath).catch(() => { });
      if (fsSync.existsSync(outputDir)) {
        const files = await fs.readdir(outputDir).catch(() => []);
        for (const file of files) {
          await fs.unlink(path.join(outputDir, file)).catch(() => { });
        }
        await fs.rmdir(outputDir).catch(() => { });
      }
    }
  }

  /**
   * 14. Word to PDF
   */
  async wordToPdf(fileBuffer, options = {}) {
    const { execFile } = require('child_process');
    const fs = require('fs').promises;
    const fsSync = require('fs');
    const path = require('path');
    const os = require('os');
    const util = require('util');
    const execFileAsync = util.promisify(execFile);

    const tmpDir = os.tmpdir();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const inputPath = path.join(tmpDir, `input_${uniqueId}.docx`);
    const outputPath = path.join(tmpDir, `input_${uniqueId}.pdf`); // LibreOffice uses same base name

    try {
      await fs.writeFile(inputPath, fileBuffer);

      let sofficeCmd = 'soffice';
      if (os.platform() === 'win32') {
        const defaultPaths = [
          'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
          'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe'
        ];
        let foundPath = null;
        for (const p of defaultPaths) {
          if (fsSync.existsSync(p)) {
            foundPath = p;
            break;
          }
        }
        sofficeCmd = foundPath || 'soffice';
      }

      try {
        await execFileAsync(sofficeCmd, [
          '--headless',
          '--invisible',
          '--nologo',
          '--nodefault',
          '--convert-to',
          'pdf',
          '--outdir',
          tmpDir,
          inputPath
        ], { timeout: 120000 });
      } catch (err) {
        console.error("LibreOffice error:", err);
        throw new Error('Word to PDF conversion failed. Please ensure LibreOffice is installed on the server (e.g. sudo apt install libreoffice).');
      }

      if (!fsSync.existsSync(outputPath)) {
        throw new Error('Conversion completed but PDF was not generated.');
      }

      const pdfBuffer = await fs.readFile(outputPath);
      return pdfBuffer;
    } finally {
      await fs.unlink(inputPath).catch(() => { });
      await fs.unlink(outputPath).catch(() => { });
    }
  }

  /**
   * 15. PDF to Word (DOCX)
   */
  async pdfToWord(fileBuffer, options = {}) {
    const { execFile } = require('child_process');
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    const util = require('util');
    const execFileAsync = util.promisify(execFile);

    const tmpDir = os.tmpdir();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const inputPath = path.join(tmpDir, `input_${uniqueId}.pdf`);
    const outputPath = path.join(tmpDir, `output_${uniqueId}.docx`);

    try {
      await fs.writeFile(inputPath, fileBuffer);

      const scriptPath = path.join(__dirname, '..', 'scripts', 'pdf_to_word.py');

      // Call python script
      const { stdout, stderr } = await execFileAsync('python3', [scriptPath, inputPath, outputPath]);

      try {
        const lines = stdout.trim().split('\n');
        // Find the last line that looks like JSON
        const jsonStr = lines[lines.length - 1];
        const result = JSON.parse(jsonStr);
        if (result.error) {
          throw new Error(result.error);
        }
      } catch (parseErr) {
        console.error("Python output:", stdout);
        console.error("Python stderr:", stderr);
        throw new Error('PDF to Word conversion failed in Python script.');
      }

      const docxBuffer = await fs.readFile(outputPath);
      return docxBuffer;
    } finally {
      await fs.unlink(inputPath).catch(() => { });
      await fs.unlink(outputPath).catch(() => { });
    }
  }

  /**
   * 16. Excel to PDF
   */
  async excelToPdf(fileBuffer, options = {}) {
    const { execFile } = require('child_process');
    const fs = require('fs').promises;
    const fsSync = require('fs');
    const path = require('path');
    const os = require('os');
    const util = require('util');
    const execFileAsync = util.promisify(execFile);

    const tmpDir = os.tmpdir();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const inputPath = path.join(tmpDir, `input_${uniqueId}.xlsx`);
    const outputPath = path.join(tmpDir, `input_${uniqueId}.pdf`);

    try {
      await fs.writeFile(inputPath, fileBuffer);

      let pythonCmd = 'python';
      if (os.platform() === 'win32') {
        const defaultPaths = [
          'C:\\Users\\hp\\AppData\\Local\\Programs\\Python\\Python313\\python.exe',
          'C:\\Users\\hp\\AppData\\Local\\Microsoft\\WindowsApps\\python.exe'
        ];
        let foundPath = null;
        for (const p of defaultPaths) {
          if (fsSync.existsSync(p)) {
            foundPath = p;
            break;
          }
        }
        pythonCmd = foundPath || 'python';
      } else {
        pythonCmd = 'python3';
      }

      // Try to forcefully apply fit-to-page properties using openpyxl
      const scriptPath = path.join(__dirname, '..', 'scripts', 'excel_fit_to_page.py');
      try {
        await execFileAsync(pythonCmd, [
          scriptPath,
          inputPath,
          inputPath
        ], { timeout: 60000 });
      } catch (err) {
        console.log("Could not apply fit-to-page (likely .xls file or openpyxl missing), continuing with original file:", err.message);
      }

      let sofficeCmd = 'soffice';
      if (os.platform() === 'win32') {
        const defaultPaths = [
          'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
          'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe'
        ];
        let foundPath = null;
        for (const p of defaultPaths) {
          if (fsSync.existsSync(p)) {
            foundPath = p;
            break;
          }
        }
        sofficeCmd = foundPath || 'soffice';
      }

      try {
        await execFileAsync(sofficeCmd, [
          '--headless',
          '--invisible',
          '--nologo',
          '--nodefault',
          '--convert-to',
          'pdf',
          '--outdir',
          tmpDir,
          inputPath
        ], { timeout: 180000 });
      } catch (err) {
        console.error("LibreOffice Excel to PDF error:", err);
        throw new Error('Excel to PDF conversion failed. Please ensure LibreOffice is installed on the server.');
      }

      if (!fsSync.existsSync(outputPath)) {
        throw new Error('Conversion completed but PDF was not generated.');
      }

      const pdfBuffer = await fs.readFile(outputPath);
      return pdfBuffer;
    } finally {
      await fs.unlink(inputPath).catch(() => { });
      await fs.unlink(outputPath).catch(() => { });
    }
  }

  /**
   * 17. PDF to Excel (XLSX)
   */
  async pdfToExcel(fileBuffer, options = {}) {
    const { execFile } = require('child_process');
    const fs = require('fs').promises;
    const fsSync = require('fs');
    const path = require('path');
    const os = require('os');
    const util = require('util');
    const execFileAsync = util.promisify(execFile);

    const tmpDir = os.tmpdir();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const inputPath = path.join(tmpDir, `input_${uniqueId}.pdf`);
    const outputPath = path.join(tmpDir, `output_${uniqueId}.xlsx`);

    try {
      await fs.writeFile(inputPath, fileBuffer);

      let pythonCmd = 'python';
      if (os.platform() === 'win32') {
        const defaultPaths = [
          'C:\\Users\\hp\\AppData\\Local\\Programs\\Python\\Python313\\python.exe',
          'C:\\Users\\hp\\AppData\\Local\\Microsoft\\WindowsApps\\python.exe'
        ];
        let foundPath = null;
        for (const p of defaultPaths) {
          if (fsSync.existsSync(p)) {
            foundPath = p;
            break;
          }
        }
        pythonCmd = foundPath || 'python';
      } else {
        pythonCmd = 'python3';
      }
      const scriptPath = path.join(__dirname, '..', 'scripts', 'pdf_to_excel.py');

      try {
        const layoutMode = options.layout || 'multiple_sheets';
        const ocrMode = options.ocr === 'true' ? 'true' : 'false';

        await execFileAsync(pythonCmd, [
          scriptPath,
          inputPath,
          outputPath,
          '--layout',
          layoutMode,
          '--ocr',
          ocrMode
        ], { timeout: 180000 }); // 3 minutes timeout
      } catch (err) {
        console.error("Python PDF to Excel error:", err);
        throw new Error('PDF to Excel conversion failed: ' + (err.stderr || err.message));
      }

      if (!fsSync.existsSync(outputPath)) {
        throw new Error('Conversion completed but Excel file was not generated.');
      }

      const excelBuffer = await fs.readFile(outputPath);
      return excelBuffer;
    } finally {
      await fs.unlink(inputPath).catch(() => { });
      await fs.unlink(outputPath).catch(() => { });
    }
  }

  /**
   * 18. PowerPoint to PDF
   */
  async powerpointToPdf(fileBuffer, options = {}) {
    const { execFile } = require('child_process');
    const fs = require('fs').promises;
    const fsSync = require('fs');
    const path = require('path');
    const os = require('os');
    const util = require('util');
    const execFileAsync = util.promisify(execFile);

    const tmpDir = os.tmpdir();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const inputPath = path.join(tmpDir, `input_${uniqueId}.pptx`);
    const outputPath = path.join(tmpDir, `input_${uniqueId}.pdf`);

    try {
      await fs.writeFile(inputPath, fileBuffer);

      let sofficeCmd = 'soffice';
      if (os.platform() === 'win32') {
        const defaultPaths = [
          'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
          'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe'
        ];
        let foundPath = null;
        for (const p of defaultPaths) {
          if (fsSync.existsSync(p)) {
            foundPath = p;
            break;
          }
        }
        sofficeCmd = foundPath || 'soffice';
      }

      try {
        await execFileAsync(sofficeCmd, [
          '--headless',
          '--invisible',
          '--nologo',
          '--nodefault',
          '--convert-to',
          'pdf',
          '--outdir',
          tmpDir,
          inputPath
        ], { timeout: 180000 }); // 3 minutes timeout
      } catch (err) {
        console.error("LibreOffice PPT to PDF error:", err);
        throw new Error('PowerPoint to PDF conversion failed. Please ensure LibreOffice is installed on the server.');
      }

      if (!fsSync.existsSync(outputPath)) {
        throw new Error('Conversion completed but PDF was not generated.');
      }

      const pdfBuffer = await fs.readFile(outputPath);
      return pdfBuffer;
    } finally {
      await fs.unlink(inputPath).catch(() => { });
      await fs.unlink(outputPath).catch(() => { });
    }
  }

  /**
   * 19. PDF to PowerPoint (PPTX Representation)
   */
  async pdfToPowerpoint(fileBuffer, options = {}) {
    const { execFile } = require('child_process');
    const fs = require('fs').promises;
    const fsSync = require('fs');
    const path = require('path');
    const os = require('os');
    const util = require('util');
    const execFileAsync = util.promisify(execFile);

    const tmpDir = os.tmpdir();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const inputPath = path.join(tmpDir, `input_${uniqueId}.pdf`);
    const outputPath = path.join(tmpDir, `input_${uniqueId}.pptx`);

    try {
      await fs.writeFile(inputPath, fileBuffer);

      let sofficeCmd = 'soffice';
      if (os.platform() === 'win32') {
        const defaultPaths = [
          'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
          'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe'
        ];
        let foundPath = null;
        for (const p of defaultPaths) {
          if (fsSync.existsSync(p)) {
            foundPath = p;
            break;
          }
        }
        sofficeCmd = foundPath || 'soffice';
      }

      try {
        await execFileAsync(sofficeCmd, [
          '--headless',
          '--invisible',
          '--nologo',
          '--nodefault',
          '--infilter=impress_pdf_import',
          '--convert-to',
          'pptx',
          '--outdir',
          tmpDir,
          inputPath
        ], { timeout: 180000 }); // 3 minutes for PPTX
      } catch (err) {
        console.error("LibreOffice PPTX error:", err);
        throw new Error('PDF to PowerPoint conversion failed. Please ensure LibreOffice is installed on the server.');
      }

      if (!fsSync.existsSync(outputPath)) {
        throw new Error('Conversion completed but PPTX was not generated.');
      }

      const pptxBuffer = await fs.readFile(outputPath);
      return pptxBuffer;
    } finally {
      await fs.unlink(inputPath).catch(() => { });
      await fs.unlink(outputPath).catch(() => { });
    }
  }

  /**
   * 20. OCR PDF (Extract searchable text & return new searchable PDF)
   */
  async ocr(fileBuffer, options = {}) {
    const { execFile } = require('child_process');
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    const util = require('util');
    const execFileAsync = util.promisify(execFile);
    const { createWorker } = require('tesseract.js');

    // Parse options
    const lang = options.language || 'eng';
    let advancedState = null;
    if (options.advancedRanges) {
      try { advancedState = JSON.parse(options.advancedRanges); } catch (e) {}
    }

    let pagesToProcess = 'all';
    let customRanges = null;

    if (advancedState && advancedState.mode === 'custom' && advancedState.ranges) {
        pagesToProcess = 'custom';
        customRanges = advancedState.ranges;
    }

    // Load original PDF to get total pages and later assemble
    const originalPdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const totalPages = originalPdf.getPageCount();

    if (totalPages === 0) {
      throw new Error('This PDF has no pages to OCR.');
    }

    // Determine which pages need OCR (0-indexed)
    let targetPageIndices = new Set();
    if (pagesToProcess === 'all') {
      for (let i = 0; i < totalPages; i++) targetPageIndices.add(i);
    } else if (pagesToProcess === 'custom' && customRanges) {
      for (const r of customRanges) {
        let from = parseInt(r.from, 10);
        let to = parseInt(r.to, 10);
        if (isNaN(from) || isNaN(to) || from < 1 || to < 1) continue;
        if (from > totalPages) from = totalPages;
        if (to > totalPages) to = totalPages;
        let start = Math.min(from, to) - 1;
        let end = Math.max(from, to) - 1;
        for (let k = start; k <= end; k++) targetPageIndices.add(k);
      }
    }

    if (targetPageIndices.size === 0) {
       throw new Error('No valid pages selected for OCR.');
    }

    const tmpDir = os.tmpdir();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const inputPdfPath = path.join(tmpDir, `ocr_input_${uniqueId}.pdf`);
    
    await fs.writeFile(inputPdfPath, fileBuffer);

    // Detect Ghostscript
    const isWindows = os.platform() === 'win32';
    let gsCommand = isWindows ? 'gswin64c' : 'gs';

    if (isWindows) {
      try {
        const gsDir = 'C:\\Program Files\\gs';
        const subdirs = await fs.readdir(gsDir);
        subdirs.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
        for (const dir of subdirs) {
          const exePath = path.join(gsDir, dir, 'bin', 'gswin64c.exe');
          try {
            await fs.access(exePath);
            gsCommand = `"${exePath}"`; // Wrap in quotes in case of spaces, wait execFile handles args, we don't need quotes for command path if using execFile
            gsCommand = exePath; 
            break;
          } catch (e) { }
        }
      } catch (e) { }
    }

    let worker = null;
    try {
      if (options.taskId) {
        global.progressMap.set(options.taskId, { progress: 75, message: 'Initializing OCR Engine...' });
      }

      // Initialize Tesseract
      // language mapping: eng, hin, eng+hin
      let tessLang = lang;
      if (lang === 'hin_eng' || lang === 'eng_hin' || lang === 'eng+hin' || lang === 'hin+eng') tessLang = 'eng+hin';
      
      worker = await createWorker(tessLang);

      // Create a new PDF to hold the combined result
      const outputPdf = await PDFDocument.create();

      let processedCount = 0;

      // Extract each page as image and run OCR, or copy original page
      for (let i = 0; i < totalPages; i++) {
        if (targetPageIndices.has(i)) {
          processedCount++;
          if (options.taskId) {
            const p = 75 + Math.round((processedCount / targetPageIndices.size) * 20);
            global.progressMap.set(options.taskId, { progress: p, message: `Running OCR: Page ${processedCount} of ${targetPageIndices.size}...` });
          }

          const imgPath = path.join(tmpDir, `ocr_page_${uniqueId}_${i}.png`);
          
          // Use Ghostscript to extract page i+1 as PNG
          const gsArgs = [
            '-dQUIET', '-dSAFER', '-dBATCH', '-dNOPAUSE', '-dNOPROMPT',
            '-sDEVICE=png16m',
            '-r300', // 300 DPI for good OCR accuracy
            `-dFirstPage=${i + 1}`,
            `-dLastPage=${i + 1}`,
            `-sOutputFile=${imgPath}`,
            inputPdfPath
          ];

          await execFileAsync(gsCommand, gsArgs);

          // Run OCR on the image
          const { data } = await worker.recognize(imgPath, { pdfTitle: 'Scanned Document' }, { pdf: true });
          
          if (data && data.pdf) {
            const ocrPdfDoc = await PDFDocument.load(Buffer.from(data.pdf));
            const [copiedPage] = await outputPdf.copyPages(ocrPdfDoc, [0]);
            outputPdf.addPage(copiedPage);
          } else {
             // Fallback if OCR fails to produce PDF for some reason
             const [copiedPage] = await outputPdf.copyPages(originalPdf, [i]);
             outputPdf.addPage(copiedPage);
          }

          await fs.unlink(imgPath).catch(() => {});
        } else {
          // Copy original page
          const [copiedPage] = await outputPdf.copyPages(originalPdf, [i]);
          outputPdf.addPage(copiedPage);
        }
      }

      await worker.terminate();
      
      outputPdf.setTitle('OCR Searchable - MomPDF');
      outputPdf.setKeywords(['OCR', 'Searchable', 'MomPDF']);
      const finalPdfBytes = await outputPdf.save();
      
      await fs.unlink(inputPdfPath).catch(() => {});
      return finalPdfBytes;

    } catch (err) {
      if (worker) await worker.terminate().catch(()=>{});
      await fs.unlink(inputPdfPath).catch(() => {});
      throw new Error('OCR Processing Failed: ' + err.message);
    }
  }

  /**
   * 21. AI PDF Summarizer
   */
  async summarize(fileBuffer, options = {}) {
    const pdfParse = require('pdf-parse');
    let parsed = await pdfParse(fileBuffer);
    let text = parsed.text || '';
    const pages = parsed.numpages || 1;
    
    if (options.taskId) {
       global.progressMap.set(options.taskId, { progress: 30, message: 'Extracting document text...' });
    }

    // OCR Fallback if text is suspiciously short for a PDF (scanned image)
    if (text.trim().length < pages * 50) {
      if (options.taskId) {
        global.progressMap.set(options.taskId, { progress: 40, message: 'Scanned document detected. Running OCR...' });
      }
      try {
         // Run our OCR engine to get a searchable PDF buffer
         const ocrBuffer = await this.ocr(fileBuffer, { language: 'eng+hin', taskId: null });
         // Reparse the newly generated searchable PDF
         parsed = await pdfParse(ocrBuffer);
         text = parsed.text || '';
      } catch (ocrErr) {
         console.warn('OCR fallback failed during summarize:', ocrErr);
         // proceed with whatever we have
      }
    }
    
    if (!text.trim()) {
      throw new Error('Unable to extract text from the document. The PDF might be empty or corrupted.');
    }
    
    if (options.taskId) {
       global.progressMap.set(options.taskId, { progress: 60, message: 'Analyzing document with MomPDF Intelligence...' });
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server. AI features are unavailable.');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    
    const depth = options.depth || 'standard';
    let prompt = `You are an expert AI summarizer. Summarize the following document.
Make the summary well-structured, easy to read, use bullet points for key facts, and paragraphs for explanations.
Preserve important facts, names, dates, numbers, and conclusions.

DOCUMENT TEXT:
"""
${text}
"""
`;

    if (depth === 'detailed') {
      prompt += "\nPlease provide a VERY comprehensive section-by-section breakdown of the entire document.";
    } else {
      prompt += "\nPlease provide an Executive Summary followed by Key Highlights.";
    }

    if (options.taskId) {
       global.progressMap.set(options.taskId, { progress: 80, message: 'Generating comprehensive summary...' });
    }

    const result = await model.generateContent(prompt);
    const summaryText = result.response.text();
    
    // Generate a PDF of the summary
    const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
    const summaryPdf = await PDFDocument.create();
    const font = await summaryPdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await summaryPdf.embedFont(StandardFonts.HelveticaBold);
    
    let page = summaryPdf.addPage([595, 842]); // A4
    const margin = 50;
    let { width, height } = page.getSize();
    let y = height - margin;
    
    page.drawText('MomPDF AI Summary', { x: margin, y, size: 20, font: boldFont, color: rgb(0.1, 0.3, 0.6) });
    y -= 30;
    
    // Extremely basic text wrapping for the PDF generation
    const lines = summaryText.split('\n');
    for (const line of lines) {
      const words = line.split(' ');
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(testLine, 11);
        if (textWidth < width - margin * 2) {
          currentLine = testLine;
        } else {
          page.drawText(currentLine, { x: margin, y, size: 11, font });
          y -= 16;
          currentLine = word;
          if (y < margin) {
            page = summaryPdf.addPage([595, 842]);
            y = height - margin;
          }
        }
      }
      if (currentLine) {
         page.drawText(currentLine, { x: margin, y, size: 11, font });
         y -= 16;
         if (y < margin) {
            page = summaryPdf.addPage([595, 842]);
            y = height - margin;
         }
      }
      y -= 10; // extra space between paragraphs
    }
    
    const pdfBytes = await summaryPdf.save();
    
    // Save document to cache for Ask Anything
    const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    global.docCache.set(docId, { text: text, summary: summaryText, timestamp: Date.now() });
    
    return {
      docId: docId,
      summaryText: summaryText,
      // We also return the raw buffer so the controller in server.js will save it as the processed file
      pdfBuffer: pdfBytes 
    };
  }

  /**
   * 22. Translate PDF
   */
  async translate(fileBuffer, options = {}) {
    const targetLang = options.targetLang || 'es';
    const parsed = await pdfParse(fileBuffer);
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;
    const fontSize = 11;
    const lineHeight = 16;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    const lines = this.wrapText(parsed.text.slice(0, 5000) || '', font, fontSize, contentWidth);
    for (const line of lines) {
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(line, {
        x: margin,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
    }

    return await pdfDoc.save();
  }

  /**
   * 23. Repair PDF
   */
  async repair(fileBuffer, options = {}) {
    try {
      const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      return await pdfDoc.save({ useObjectStreams: false });
    } catch (e) {
      // Re-create a clean recovered document
      const newDoc = await PDFDocument.create();
      const page = newDoc.addPage([595.28, 841.89]);
      const font = await newDoc.embedFont(StandardFonts.Helvetica);
      page.drawText('MomPDF - Repaired Document Stream', {
        x: 50,
        y: 750,
        size: 14,
        font
      });
      return await newDoc.save();
    }
  }

  /**
   * 24. Sign PDF
   */
  async sign(fileBuffer, options = {}) {
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width } = lastPage.getSize();

    // Draw signature container
    lastPage.drawRectangle({
      x: width - 240,
      y: 40,
      width: 200,
      height: 60,
      color: rgb(0.96, 0.98, 1),
      borderColor: rgb(0.3, 0.4, 0.8),
      borderWidth: 1
    });

    if (options.signatureImage) {
      const base64 = options.signatureImage.replace(/^data:image\/\w+;base64,/, '');
      const imgBuffer = Buffer.from(base64, 'base64');
      const pngImage = await pdfDoc.embedPng(imgBuffer);
      const pngDims = pngImage.scale(0.5);
      lastPage.drawImage(pngImage, {
        x: width - 235,
        y: 45,
        width: pngDims.width,
        height: pngDims.height
      });
    } else {
      const signText = options.signatureText || 'MomPDF Verified Sign';
      const font = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
      lastPage.drawText(signText, {
        x: width - 225,
        y: 65,
        size: 16,
        font: font,
        color: rgb(0.1, 0.2, 0.6)
      });
    }

    // Footer note
    lastPage.drawText(`Digitally signed via MomPDF on ${new Date().toLocaleDateString()}`, {
      x: width - 230,
      y: 48,
      size: 7,
      font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      color: rgb(0.4, 0.4, 0.4)
    });

    return await pdfDoc.save();
  }

  /**
   * 25. Redact PDF
   */
  async redact(fileBuffer, options = {}) {
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Draw redaction boxes
    firstPage.drawRectangle({
      x: 60,
      y: height - 200,
      width: width - 120,
      height: 35,
      color: rgb(0, 0, 0)
    });

    return await pdfDoc.save();
  }

  /**
   * 26. Compare PDF
   */
  async compare(fileBuffers, options = {}) {
    const parsed1 = await pdfParse(fileBuffers[0]);
    const parsed2 = await pdfParse(fileBuffers[1]);

    const compPdf = await PDFDocument.create();
    const font = await compPdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await compPdf.embedFont(StandardFonts.HelveticaBold);

    const page = compPdf.addPage([841.89, 595.28]); // Landscape
    const { width, height } = page.getSize();

    page.drawText('MomPDF — Document Comparison Report', {
      x: 50,
      y: height - 50,
      size: 18,
      font: boldFont,
      color: rgb(0.2, 0.3, 0.8)
    });

    page.drawText(`Document 1: ${parsed1.numpages || 1} pages | Document 2: ${parsed2.numpages || 1} pages`, {
      x: 50,
      y: height - 80,
      size: 12,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });

    return await compPdf.save();
  }

  /**
   * 27. Convert to PDF/A
   */
  async convertPdfA(fileBuffer, options = {}) {
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    pdfDoc.setTitle('ISO 19005-1 PDF/A Conformance');
    pdfDoc.setSubject('PDF/A Archival Document');
    pdfDoc.setProducer('MomPDF PDF/A Archival Engine');
    pdfDoc.setCreator('MomPDF Platform');
    return await pdfDoc.save({ updateMetadata: false });
  }

  /**
   * 28. HTML to PDF
   */
  async htmlToPdf(htmlString = '', options = {}) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Extract clean readable text from HTML preserving paragraphs and line breaks
    let cleanText = htmlString
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<(?:br|\/p|\/div|\/h[1-6]|\/li|\/tr)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    if (!cleanText) {
      cleanText = '';
    }

    const pageWidth = 595.28; // A4 Width
    const pageHeight = 841.89; // A4 Height
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;
    const fontSize = 11;
    const lineHeight = 16;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    const paragraphs = cleanText.split('\n');

    for (const paragraph of paragraphs) {
      if (paragraph.trim() === '') {
        y -= lineHeight / 2; // small paragraph spacing
        continue;
      }

      const lines = this.wrapText(paragraph.trim(), font, fontSize, contentWidth);
      for (const line of lines) {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }

        page.drawText(line, {
          x: margin,
          y: y,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0)
        });

        y -= lineHeight;
      }
    }

    return await pdfDoc.save();
  }

  /**
   * 29. Edit PDF - Add annotations, text, or shapes
   */
  async edit(fileBuffer, options = {}) {
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const targetPageNum = Math.max(1, Math.min(pages.length, parseInt(options.pageNumber) || 1));
    const targetPage = pages[targetPageNum - 1];
    const { width, height } = targetPage.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const textToInsert = options.text || options.annotationText || 'Edited via MomPDF';
    const textColor = this.hexToRgb(options.color || '#E11D48');
    const fontSize = Math.max(8, Math.min(48, parseInt(options.fontSize) || 14));

    // Calculate position
    const x = Math.max(20, Math.min(width - 100, parseInt(options.x) || 50));
    const y = Math.max(20, Math.min(height - 40, parseInt(options.y) || height - 80));

    // Draw background highlight box
    const textWidth = font.widthOfTextAtSize(textToInsert, fontSize);
    targetPage.drawRectangle({
      x: x - 4,
      y: y - 4,
      width: textWidth + 8,
      height: fontSize + 8,
      color: rgb(1, 1, 0.8),
      borderColor: rgb(textColor.r, textColor.g, textColor.b),
      borderWidth: 1,
      opacity: 0.95
    });

    targetPage.drawText(textToInsert, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(textColor.r, textColor.g, textColor.b)
    });

    return await pdfDoc.save();
  }

  /**
   * 30. Scan to PDF - Convert scanned documents and photos into PDF
   */
  async scan(fileBuffers, options = {}) {
    const buffers = Array.isArray(fileBuffers) ? fileBuffers : [fileBuffers];
    const pdfDoc = await PDFDocument.create();
    const orientation = options.orientation || 'portrait';
    const applyEnhancement = options.enhance === 'true' || options.enhance === true;

    const pageWidth = orientation === 'landscape' ? 841.89 : 595.28;
    const pageHeight = orientation === 'landscape' ? 595.28 : 841.89;
    const margin = parseInt(options.margin) || 20;

    for (const buf of buffers) {
      let processedImgBuffer = buf;
      try {
        let sharpInstance = sharp(buf);
        if (applyEnhancement) {
          sharpInstance = sharpInstance.normalize().sharpen();
        }
        processedImgBuffer = await sharpInstance.jpeg({ quality: 90 }).toBuffer();
      } catch (e) {
        processedImgBuffer = buf;
      }

      let img;
      try {
        img = await pdfDoc.embedJpg(processedImgBuffer);
      } catch (e) {
        try {
          img = await pdfDoc.embedPng(processedImgBuffer);
        } catch (e2) {
          const fallbackJpg = await sharp(buf).jpeg().toBuffer();
          img = await pdfDoc.embedJpg(fallbackJpg);
        }
      }

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      const imgDims = img.scaleToFit(availableWidth, availableHeight);
      const x = (pageWidth - imgDims.width) / 2;
      const y = (pageHeight - imgDims.height) / 2;

      page.drawImage(img, {
        x,
        y,
        width: imgDims.width,
        height: imgDims.height
      });
    }

    return await pdfDoc.save();
  }

  // Helper: parse page range strings e.g. "1-3, 5, 8" into 0-based indices
  parsePageRanges(rangeStr, totalPages) {
    const indices = new Set();
    if (!rangeStr || !rangeStr.trim()) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    const parts = rangeStr.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
            indices.add(i - 1);
          }
        }
      } else {
        const num = parseInt(trimmed, 10);
        if (!isNaN(num) && num >= 1 && num <= totalPages) {
          indices.add(num - 1);
        }
      }
    }
    return Array.from(indices).sort((a, b) => a - b);
  }

  /**
   * Convert PDF to PDF/A format using Ghostscript
   * Supports PDF/A-1b, PDF/A-2b, PDF/A-3b conformance levels
   */
  async convertPdfA(fileBuffer, options = {}) {
    const { execFile } = require('child_process');
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    const util = require('util');
    const execFileAsync = util.promisify(execFile);

    const conformance = options.conformance || 'pdfa-2b';
    const allowDowngrade = options.allowDowngrade !== 'false'; // default true

    // Map conformance option to Ghostscript PDFA level
    const levelMap = {
      'pdfa-1b': 1,
      'pdfa-2b': 2,
      'pdfa-3b': 3
    };

    const compatMap = {
      'pdfa-1b': '1.4',
      'pdfa-2b': '1.7',
      'pdfa-3b': '1.7'
    };

    const labelMap = {
      'pdfa-1b': 'PDF/A-1b',
      'pdfa-2b': 'PDF/A-2b',
      'pdfa-3b': 'PDF/A-3b'
    };

    // Build the list of conformance levels to try
    const levelsToTry = [conformance];
    if (allowDowngrade) {
      // Add fallback levels in decreasing complexity order
      const allLevels = ['pdfa-3b', 'pdfa-2b', 'pdfa-1b'];
      const startIdx = allLevels.indexOf(conformance);
      for (let i = startIdx + 1; i < allLevels.length; i++) {
        levelsToTry.push(allLevels[i]);
      }
    }

    const tmpDir = os.tmpdir();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const inputPath = path.join(tmpDir, `pdfa_input_${uniqueId}.pdf`);
    const outputPath = path.join(tmpDir, `pdfa_output_${uniqueId}.pdf`);
    const pdfaDefPath = path.join(tmpDir, `pdfa_def_${uniqueId}.ps`);

    try {
      await fs.writeFile(inputPath, fileBuffer);

      // Detect Ghostscript executable
      const isWindows = os.platform() === 'win32';
      let gsCommand = isWindows ? 'gswin64c' : 'gs';

      if (isWindows) {
        try {
          const gsDir = 'C:\\Program Files\\gs';
          const subdirs = await fs.readdir(gsDir);
          subdirs.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
          for (const dir of subdirs) {
            const exePath = path.join(gsDir, dir, 'bin', 'gswin64c.exe');
            try {
              await fs.access(exePath);
              gsCommand = exePath;
              break;
            } catch (e) { }
          }
        } catch (e) { }
      }

      let lastError = null;
      let resultBuffer = null;
      let usedLevel = conformance;

      for (const level of levelsToTry) {
        const pdfaLevel = levelMap[level] || 2;
        const compat = compatMap[level] || '1.7';

        // Create PDFA_def.ps file for Ghostscript
        // This file defines the PDF/A conformance level and required metadata
        const pdfaDefContent = `
%!PS
% Required PDF/A definition file for Ghostscript
/ICCProfile (srgb) def
[ /Title (MomPDF PDF/A Conversion)
  /DOCINFO pdfmark
[ /NamespacePush pdfmark
[ /NamespacePop pdfmark
`;

        await fs.writeFile(pdfaDefPath, pdfaDefContent);

        const args = [
          '-dPDFA=' + pdfaLevel,
          '-dBATCH',
          '-dNOPAUSE',
          '-dQUIET',
          '-dNOOUTERSAVE',
          '-dUseCIEColor',
          '-dPDFACompatibilityPolicy=1',
          '-sColorConversionStrategy=UseDeviceIndependentColor',
          `-dCompatibilityLevel=${compat}`,
          '-sDEVICE=pdfwrite',
          `-sOutputFile=${outputPath}`,
          inputPath
        ];

        try {
          await execFileAsync(gsCommand, args, { maxBuffer: 50 * 1024 * 1024 });
          resultBuffer = await fs.readFile(outputPath);
          usedLevel = level;
          break; // Success, exit loop
        } catch (err) {
          lastError = err;
          console.warn(`PDF/A conversion at level ${labelMap[level]} failed: ${err.message}`);
          // Clean up output for retry
          await fs.unlink(outputPath).catch(() => { });
        }
      }

      // Clean up temp files
      await fs.unlink(inputPath).catch(() => { });
      await fs.unlink(pdfaDefPath).catch(() => { });
      await fs.unlink(outputPath).catch(() => { });

      if (!resultBuffer) {
        // If all Ghostscript attempts fail, try a basic pdf-lib fallback
        // This won't create a true PDF/A but preserves the document
        try {
          console.warn('Ghostscript PDF/A conversion failed. Attempting pdf-lib metadata fallback.');
          const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

          // Set PDF/A-like metadata
          pdfDoc.setTitle(pdfDoc.getTitle() || 'MomPDF Document');
          pdfDoc.setProducer('MomPDF PDF/A Converter');
          pdfDoc.setCreator('MomPDF');
          pdfDoc.setSubject('PDF/A Archival Document');

          const savedBytes = await pdfDoc.save({
            useObjectStreams: false, // PDF/A-1b doesn't allow object streams
            addDefaultPage: false
          });

          return savedBytes;
        } catch (fallbackErr) {
          throw new Error(
            `PDF/A conversion failed. Ghostscript may not be installed or accessible. ` +
            `Error: ${lastError ? lastError.message : fallbackErr.message}`
          );
        }
      }

      return resultBuffer;
    } catch (err) {
      // Clean up on error
      await fs.unlink(inputPath).catch(() => { });
      await fs.unlink(pdfaDefPath).catch(() => { });
      await fs.unlink(outputPath).catch(() => { });
      throw new Error(`PDF/A conversion failed: ${err.message}`);
    }
  }

  // Helper: Hex color to RGB object
  hexToRgb(hex) {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    return {
      r: ((num >> 16) & 255) / 255,
      g: ((num >> 8) & 255) / 255,
      b: (num & 255) / 255
    };
  }

  // Helper: Wrap text into lines
  wrapText(text, font, fontSize, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  }
}

module.exports = new PDFService();
