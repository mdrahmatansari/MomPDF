/**
 * MomPDF Reusable Dedicated Workspace Studio Controller
 * Supports all 29 PDF Tools with file state caching, live studio previews, custom controls, and share/download.
 */

(function () {
  'use strict';

  // --- 1. File Cache Helper (Removed for Performance) ---
  // We no longer cache files in IndexedDB because reading large PDFs into ArrayBuffers
  // blocks the main thread, causes UI freezing, and leads to massive memory leaks.
  // Files are now managed purely in-memory via the window/class instance.

  // --- 2. Tool Definitions & Studio Configurations (29 Tools) ---
  const TOOL_REGISTRY = {
    merge_pdf: {
      id: 'merge_pdf',
      name: 'Merge PDF',
      badge: 'Organize',
      desc: 'Combine multiple PDF files into one single document in seconds.',
      multiFile: true,
      actionLabel: 'Merge PDFs',
      renderControls: (tool, files) => `
        <div class="control-item">
          <div class="control-item-label">Merge Sequence <span class="badge">${files.length} Files</span></div>
          <p style="font-size:13px; color:var(--text-muted);">Files will be merged in the exact order shown. You can drag and drop cards to reorder.</p>
        </div>
      `,
      renderPreview: (tool, files) => renderMultiFileGrid(files)
    },
    split_pdf: {
      id: 'split_pdf',
      name: 'Split PDF',
      badge: 'Organize',
      desc: 'Separate one page or a whole set for easy conversion into independent PDF files.',
      actionLabel: 'Split PDF',
      renderControls: (tool, files) => `
        <div class="control-item">
          <div class="control-item-label">Split Options</div>
          <p style="font-size:13px; color:var(--text-muted);">Split into individual pages. Each page will be saved as a separate PDF. All files will be downloaded as a ZIP archive.</p>
        </div>
        <input type="hidden" name="advancedRanges" value='${JSON.stringify({ tab: "pages", mode: "extract_all" })}' />
      `,
      renderPreview: (tool, files) => {
        if (!files || !files[0]) return '';
        return `
          <div style="background:#fff; border:1px solid var(--border-color); border-radius:8px; padding:36px; text-align:center; box-shadow:var(--shadow-md); max-width:400px; width:100%;">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <h4 style="font-size:16px; font-weight:700; color:var(--text-main); margin-top:14px; word-break:break-all;">${files[0].name}</h4>
            <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Size: ${files[0].size > 1048576 ? (files[0].size / 1048576).toFixed(1) + ' MB' : Math.round(files[0].size / 1024) + ' KB'}</p>
            <p style="font-size:12px; color:#0369a1; background:#f0f9ff; border:1px solid #bae6fd; border-radius:6px; padding:8px 12px; margin-top:16px;">ℹ️ Each page will be extracted as a separate PDF file.</p>
          </div>
        `;
      }
    },
    compress_pdf: {
      id: 'compress_pdf',
      name: 'Compress PDF',
      badge: 'Optimize',
      desc: 'Reduce PDF file size while maintaining maximum document quality.',
      actionLabel: 'Compress PDF',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Compression Level</div>
          <div class="option-cards-group">
            <div class="option-card active" onclick="selectOptionCard(this, 'level', 'recommended')">
              <input type="radio" name="level" value="recommended" checked style="margin-top:3px;" />
              <div>
                <div class="option-card-title">Recommended Compression</div>
                <div class="option-card-desc">Optimal balance between high quality and small file size.</div>
              </div>
            </div>
            <div class="option-card" onclick="selectOptionCard(this, 'level', 'extreme')">
              <input type="radio" name="level" value="extreme" style="margin-top:3px;" />
              <div>
                <div class="option-card-title">Extreme Compression</div>
                <div class="option-card-desc">Lowest file size, ideal for fast email sharing.</div>
              </div>
            </div>
            <div class="option-card" onclick="selectOptionCard(this, 'level', 'less')">
              <input type="radio" name="level" value="less" style="margin-top:3px;" />
              <div>
                <div class="option-card-title">Less Compression</div>
                <div class="option-card-desc">Highest visual quality with moderate size reduction.</div>
              </div>
            </div>
            <div class="option-card" onclick="selectOptionCard(this, 'level', 'custom')">
              <input type="radio" name="level" value="custom" style="margin-top:3px;" />
              <div>
                <div class="option-card-title" style="color:var(--primary-color);">Custom Target Size</div>
                <div class="option-card-desc">Set exactly how much you want to compress.</div>
              </div>
            </div>
          </div>
          <div id="customSizeInputContainer" style="display:none; margin-top:16px;">
            <div class="control-item-label" style="margin-bottom:6px;">Target File Size</div>
            <div style="display:flex; gap:10px;">
              <input type="number" name="targetSize" class="control-input" placeholder="e.g. 1.5" min="0.01" step="0.01" style="flex:1;" />
              <select name="targetUnit" class="control-input" style="width:80px; flex:none;">
                <option value="MB">MB</option>
                <option value="KB">KB</option>
              </select>
            </div>
          </div>
        </div>
      `
    },
    rotate_pdf: {
      id: 'rotate_pdf',
      name: 'Rotate PDF',
      badge: 'Edit',
      desc: 'Rotate PDF pages 90°, 180°, or 270° clockwise or counter-clockwise.',
      actionLabel: 'Rotate PDF',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Rotation Direction</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <button type="button" class="btn btn-secondary" onclick="window.mompdfWorkspace.setRotateAngle(90)">
              ↻ 90° Right
            </button>
            <button type="button" class="btn btn-secondary" onclick="window.mompdfWorkspace.setRotateAngle(270)">
              ↺ 90° Left
            </button>
            <button type="button" class="btn btn-secondary" style="grid-column: span 2;" onclick="window.mompdfWorkspace.setRotateAngle(180)">
              ⇅ 180° Flip
            </button>
          </div>
          <input type="hidden" name="angle" id="rotateAngleInput" value="90" />
        </div>
      `,
      renderPreview: (tool, files) => `
        <div id="rotatePreviewBox" style="width:280px; height:380px; background:#fff; border:2px solid #CBD5E1; border-radius:8px; display:flex; align-items:center; justify-content:center; box-shadow:var(--shadow-lg); transition:transform 0.3s ease;">
          <div style="text-align:center;">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
            <div style="font-size:14px; font-weight:700; color:var(--text-main); margin-top:10px;">Preview Document</div>
            <div id="rotateAngleLabel" style="font-size:12px; color:var(--primary); font-weight:700; margin-top:4px;">Rotated 90° Right</div>
          </div>
        </div>
      `
    },
    pdf_add_watermark: {
      id: 'pdf_add_watermark',
      name: 'Watermark PDF',
      badge: 'Edit',
      desc: 'Stamp customizable text or image watermark over PDF pages.',
      actionLabel: 'Apply Watermark',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Watermark Text</div>
          <input type="text" name="text" id="watermarkTextInput" class="control-input" value="CONFIDENTIAL" oninput="window.mompdfWorkspace.updateWatermarkLivePreview()" />
        </div>
        <div class="control-item">
          <div class="control-item-label">Opacity (<span id="opacityVal">0.3</span>)</div>
          <input type="range" name="opacity" id="watermarkOpacityInput" class="control-input" min="0.1" max="1.0" step="0.05" value="0.3" oninput="window.mompdfWorkspace.updateWatermarkLivePreview()" />
        </div>
        <div class="control-item">
          <div class="control-item-label">Rotation Angle</div>
          <select name="angle" id="watermarkAngleInput" class="control-select" onchange="window.mompdfWorkspace.updateWatermarkLivePreview()">
            <option value="45" selected>45° Diagonal</option>
            <option value="0">0° Horizontal</option>
            <option value="90">90° Vertical</option>
          </select>
        </div>
        <div class="control-item">
          <div class="control-item-label">Font Color</div>
          <input type="color" name="color" id="watermarkColorInput" class="control-input" value="#E11D48" onchange="window.mompdfWorkspace.updateWatermarkLivePreview()" />
        </div>
      `,
      renderPreview: () => `
        <div class="watermark-preview-box">
          <div id="watermarkLiveText" class="watermark-text-overlay" style="color:#E11D48; opacity:0.3; transform:rotate(45deg); font-size:32px;">
            CONFIDENTIAL
          </div>
          <div style="font-size:13px; color:#94A3B8; text-align:center; padding:40px;">
            <p style="margin-bottom:12px; font-weight:700;">Document Content Page</p>
            <p>Live watermark preview overlay rendered on top of document.</p>
          </div>
        </div>
      `
    },
    add_pdf_page_number: {
      id: 'add_pdf_page_number',
      name: 'Page Numbers',
      badge: 'Edit',
      desc: 'Add page numbers to your PDF with custom placement, fonts, and styling.',
      actionLabel: 'Add Page Numbers',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Position on Page</div>
          <select name="position" class="control-select">
            <option value="bottom-center" selected>Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-right">Top Right</option>
            <option value="top-center">Top Center</option>
          </select>
        </div>
        <div class="control-item">
          <div class="control-item-label">Numbering Format</div>
          <select name="format" class="control-select">
            <option value="Page {n} of {total}" selected>Page {n} of {total}</option>
            <option value="{n}">{n}</option>
            <option value="p. {n}">p. {n}</option>
          </select>
        </div>
      `
    },
    protect_pdf: {
      id: 'protect_pdf',
      name: 'Protect PDF',
      badge: 'Security',
      desc: 'Encrypt your PDF with a strong password to prevent unauthorized access.',
      actionLabel: 'Protect PDF',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Password</div>
          <input type="password" name="password" class="control-input" placeholder="Enter password" value="mompdf2026" required />
        </div>
        <div class="control-item">
          <div class="control-item-label">Confirm Password</div>
          <input type="password" class="control-input" placeholder="Re-enter password" value="mompdf2026" required />
        </div>
      `
    },
    unlock_pdf: {
      id: 'unlock_pdf',
      name: 'Unlock PDF',
      badge: 'Security',
      desc: 'Remove password and restrictions from protected PDF documents.',
      actionLabel: 'Unlock PDF',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Password (if known)</div>
          <input type="password" name="password" class="control-input" placeholder="Enter password to decrypt" />
        </div>
      `
    },
    crop_pdf: {
      id: 'crop_pdf',
      name: 'Crop PDF',
      badge: 'Edit',
      desc: 'Trim page margins and crop specific areas across your PDF pages.',
      actionLabel: 'Crop PDF',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Crop Margin (px)</div>
          <input type="number" name="margin" class="control-input" value="30" min="5" max="200" oninput="window.mompdfWorkspace.updateCropPreview(this.value)" />
        </div>
      `,
      renderPreview: () => `
        <div id="cropPreviewBox" style="width:320px; height:440px; background:#fff; border:2px dashed #E11D48; border-radius:4px; display:flex; align-items:center; justify-content:center; box-shadow:var(--shadow-md); position:relative;">
          <div style="font-size:13px; font-weight:700; color:var(--primary);">Active Crop Frame</div>
        </div>
      `
    },
    organize_pdf: {
      id: 'organize_pdf',
      name: 'Organize PDF',
      badge: 'Organize',
      desc: 'Sort, reorder, duplicate, and delete pages from your PDF document.',
      actionLabel: 'Save Organized PDF',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Page Actions</div>
          <p style="font-size:13px; color:var(--text-muted);">Drag pages to reorder. Click rotate or delete icons on each page card.</p>
        </div>
      `,
      renderPreview: () => renderInteractivePageCards(6)
    },
    remove_pages: {
      id: 'remove_pages',
      name: 'Remove PDF Pages',
      badge: 'Organize',
      desc: 'Select and permanently delete unwanted pages from your PDF file.',
      actionLabel: 'Remove Selected Pages',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Pages to Delete</div>
          <input type="text" name="pages" id="removePagesInput" class="control-input" placeholder="e.g. 2, 4-6" />
          <p style="font-size:12px; color:var(--text-muted); margin-top:6px;">Click on pages in the preview to select/deselect them for removal.</p>
        </div>
      `,
      renderPreview: () => renderInteractivePageCards(6, true)
    },
    jpg_to_pdf: {
      id: 'jpg_to_pdf',
      name: 'JPG to PDF',
      badge: 'Convert',
      desc: 'Convert JPG, PNG, and WebP images into a single formatted PDF document.',
      multiFile: true,
      actionLabel: 'Convert to PDF',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Page Orientation</div>
          <select name="orientation" class="control-select">
            <option value="auto" selected>Auto</option>
            <option value="portrait">Portrait (A4)</option>
            <option value="landscape">Landscape (A4)</option>
          </select>
        </div>
        <div class="control-item">
          <div class="control-item-label">Margin (px)</div>
          <input type="number" name="margin" class="control-input" value="0" min="0" max="100" />
        </div>
      `,
      renderPreview: (tool, files) => renderMultiFileGrid(files)
    },
    pdf_to_jpg: {
      id: 'pdf_to_jpg',
      name: 'PDF to JPG',
      badge: 'Convert',
      desc: 'Extract all pages from your PDF into high-resolution JPG images.',
      actionLabel: 'Convert to JPG',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Image Quality</div>
          <select name="quality" class="control-select">
            <option value="high" selected>High Resolution (300 DPI)</option>
            <option value="standard">Standard Web (150 DPI)</option>
          </select>
        </div>
      `
    },
    word_to_pdf: {
      id: 'word_to_pdf',
      name: 'Word to PDF',
      badge: 'Convert',
      desc: 'Convert DOC and DOCX Word documents into professional PDF files.',
      actionLabel: 'Convert to PDF'
    },
    pdf_to_word: {
      id: 'pdf_to_word',
      name: 'PDF to Word',
      badge: 'Convert',
      desc: 'Convert PDF documents into editable Word DOCX files with high accuracy.',
      actionLabel: 'Convert to Word'
    },
    excel_to_pdf: {
      id: 'excel_to_pdf',
      name: 'Excel to PDF',
      badge: 'Convert',
      desc: 'Convert XLS and XLSX spreadsheets into clean PDF documents.',
      actionLabel: 'Convert to PDF'
    },
    pdf_to_excel: {
      id: 'pdf_to_excel',
      name: 'PDF to Excel',
      badge: 'Convert',
      desc: 'Pull table data straight from PDFs into Excel spreadsheets automatically.',
      actionLabel: 'Convert to Excel'
    },
    powerpoint_to_pdf: {
      id: 'powerpoint_to_pdf',
      name: 'PowerPoint to PDF',
      badge: 'Convert',
      desc: 'Convert PPT and PPTX presentation slides into formatted PDF files.',
      actionLabel: 'Convert to PDF'
    },
    pdf_to_powerpoint: {
      id: 'pdf_to_powerpoint',
      name: 'PDF to PowerPoint',
      badge: 'Convert',
      desc: 'Turn your PDF files into easy to edit PPT and PPTX presentations.',
      actionLabel: 'Convert to PPTX'
    },
    ocr_pdf: {
      id: 'ocr_pdf',
      name: 'OCR PDF',
      badge: 'Optimize',
      desc: 'Extract text from scanned documents and make PDF text searchable.',
      actionLabel: 'Run OCR Processing',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">OCR Document Language</div>
          <select name="language" class="control-select">
            <option value="eng" selected>English</option>
            <option value="spa">Spanish (Español)</option>
            <option value="fra">French (Français)</option>
            <option value="deu">German (Deutsch)</option>
            <option value="hin">Hindi (हिन्दी)</option>
          </select>
        </div>
      `
    },
    pdf_summarize: {
      id: 'pdf_summarize',
      name: 'AI PDF Summarizer',
      badge: 'Intelligence',
      desc: 'Extract key insights, executive summary, and highlights with MomPDF Intelligence.',
      actionLabel: 'Generate AI Summary',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Summary Depth</div>
          <select name="depth" class="control-select">
            <option value="standard" selected>Executive Summary & Highlights</option>
            <option value="detailed">Comprehensive Section Breakdown</option>
          </select>
        </div>
      `
    },
    translate_pdf: {
      id: 'translate_pdf',
      name: 'Translate PDF',
      badge: 'Intelligence',
      desc: 'Translate entire PDF documents into other languages seamlessly.',
      actionLabel: 'Translate PDF',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Target Language</div>
          <select name="targetLang" class="control-select">
            <option value="es" selected>Spanish (Español)</option>
            <option value="fr">French (Français)</option>
            <option value="de">German (Deutsch)</option>
            <option value="it">Italian (Italiano)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="pt">Portuguese (Português)</option>
          </select>
        </div>
      `
    },
    repair_pdf: {
      id: 'repair_pdf',
      name: 'Repair PDF',
      badge: 'Optimize',
      desc: 'Fix and recover damaged or corrupted PDF files seamlessly.',
      actionLabel: 'Repair Document'
    },
    sign_pdf: {
      id: 'sign_pdf',
      name: 'Sign PDF',
      badge: 'Security',
      desc: 'Draw or type digital signatures and place them on your PDF documents.',
      actionLabel: 'Sign & Save PDF',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Signature Text</div>
          <input type="text" name="signatureText" id="signTextInput" class="control-input" value="MomPDF Verified Signature" />
        </div>
      `,
      renderPreview: () => `
        <div class="signature-pad-container">
          <div style="font-size:14px; font-weight:700; color:var(--text-main); margin-bottom:8px; width:100%;">
            Draw Your Signature
          </div>
          <canvas id="signatureCanvas" class="signature-canvas" width="460" height="200"></canvas>
          <div class="signature-controls">
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.mompdfWorkspace.clearSignature()">Clear Signature</button>
            <span style="font-size:12px; color:var(--text-muted);">Use mouse or touch</span>
          </div>
        </div>
      `
    },
    redact_pdf: {
      id: 'redact_pdf',
      name: 'Redact PDF',
      badge: 'Security',
      desc: 'Permanently remove and blackout confidential text and sensitive data.',
      actionLabel: 'Apply Redactions'
    },
    compare_pdf: {
      id: 'compare_pdf',
      name: 'Compare PDF',
      badge: 'Security',
      desc: 'Compare two PDF files side-by-side to highlight differences and changes.',
      multiFile: true,
      actionLabel: 'Compare Documents',
      renderPreview: (tool, files) => `
        <div class="compare-container">
          <div class="compare-box">
            <div class="compare-box-header">Document 1: ${files[0] ? files[0].name : 'Primary PDF'}</div>
            <div style="flex:1; background:#F8FAFC; border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:13px;">
              Primary Document Preview
            </div>
          </div>
          <div class="compare-box">
            <div class="compare-box-header">Document 2: ${files[1] ? files[1].name : 'Comparison PDF'}</div>
            <div style="flex:1; background:#F8FAFC; border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:13px;">
              Comparison Document Preview
            </div>
          </div>
        </div>
      `
    },
    convert_pdf_to_pdfa: {
      id: 'convert_pdf_to_pdfa',
      name: 'Convert to PDF/A',
      badge: 'Convert',
      desc: 'Convert PDF files to ISO-standardized PDF/A format for long-term archiving.',
      actionLabel: 'Convert to PDF/A'
    },
    html_to_pdf: {
      id: 'html_to_pdf',
      name: 'HTML to PDF',
      badge: 'Convert',
      desc: 'Convert web pages and HTML documents into high-quality PDFs.',
      actionLabel: 'Generate PDF',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Web URL or HTML Content</div>
          <textarea name="html" class="control-input" rows="6" placeholder="Paste HTML markup here or enter web content..."></textarea>
        </div>
      `
    },
    edit_pdf: {
      id: 'edit_pdf',
      name: 'Edit PDF',
      badge: 'Edit',
      desc: 'Add text, shapes, notes, and annotations to your PDF pages.',
      actionLabel: 'Apply Edits & Save',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Annotation Text</div>
          <input type="text" name="text" id="editTextContent" class="control-input" value="Approved &amp; Verified" placeholder="Enter text to add to PDF" oninput="window.mompdfWorkspace.updateEditLivePreview()" />
        </div>
        <div class="control-item">
          <div class="control-item-label">Target Page Number</div>
          <input type="number" name="pageNumber" class="control-input" value="1" min="1" max="100" />
        </div>
        <div class="control-item">
          <div class="control-item-label">Font Size (px)</div>
          <input type="number" name="fontSize" class="control-input" value="16" min="8" max="48" oninput="window.mompdfWorkspace.updateEditLivePreview()" />
        </div>
        <div class="control-item">
          <div class="control-item-label">Text Color</div>
          <input type="color" name="color" id="editTextColor" class="control-input" value="#E11D48" onchange="window.mompdfWorkspace.updateEditLivePreview()" />
        </div>
      `,
      renderPreview: () => `
        <div id="editPreviewBox" style="width:300px; height:400px; background:#fff; border:2px solid #CBD5E1; border-radius:8px; box-shadow:var(--shadow-md); position:relative; padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="font-size:12px; color:#94A3B8; border-bottom:1px dashed #CBD5E1; padding-bottom:6px;">Page 1 Header</div>
          <div id="editLiveOverlay" style="background:#FEF9C3; border:1px solid #E11D48; border-radius:4px; padding:6px 12px; font-weight:700; color:#E11D48; font-size:16px; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.06);">
            Approved &amp; Verified
          </div>
          <div style="font-size:11px; color:#94A3B8; text-align:center;">Interactive Document Page</div>
        </div>
      `
    },
    scan_pdf: {
      id: 'scan_pdf',
      name: 'Scan to PDF',
      badge: 'Convert',
      desc: 'Capture and convert scanned documents and photos into clean PDF files.',
      multiFile: true,
      actionLabel: 'Convert Scan to PDF',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Page Orientation</div>
          <select name="orientation" class="control-select">
            <option value="portrait" selected>Portrait (A4)</option>
            <option value="landscape">Landscape (A4)</option>
          </select>
        </div>
        <div class="control-item">
          <div class="control-item-label">Scan Enhancement</div>
          <select name="enhance" class="control-select">
            <option value="true" selected>Auto-Enhance Contrast &amp; Sharpen</option>
            <option value="false">Original Scan Image</option>
          </select>
        </div>
        <div class="control-item">
          <div class="control-item-label">Page Margin (px)</div>
          <input type="number" name="margin" class="control-input" value="20" min="0" max="60" />
        </div>
      `,
      renderPreview: (tool, files) => renderMultiFileGrid(files)
    }
  };

  // Helper renderers for previews
  function renderMultiFileGrid(files) {
    if (!files || files.length === 0) return '';
    return `
      <div class="pages-grid" id="multiFilesGrid">
        ${files
        .map(
          (f, i) => `
          <div class="page-card" 
               draggable="true" 
               data-index="${i}"
               ondragstart="window.mompdfWorkspace.handleDragStart(event, ${i})"
               ondragover="window.mompdfWorkspace.handleDragOver(event, ${i})"
               ondragleave="window.mompdfWorkspace.handleDragLeave(event, ${i})"
               ondrop="window.mompdfWorkspace.handleDrop(event, ${i})"
               ondragend="window.mompdfWorkspace.handleDragEnd(event)">
            <div class="page-order-badge">#${i + 1}</div>
            <div class="page-card-actions">
              <button type="button" class="page-action-btn" title="Remove File" onclick="window.mompdfWorkspace.removeFile(${i})">&times;</button>
            </div>
            <div class="page-card-thumb">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <div class="page-card-number" title="${escapeHtml(f.name)}" style="max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              ${escapeHtml(f.name)}
            </div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
              ${window.mompdfWorkspace ? window.mompdfWorkspace.formatSize(f.size) : ''}
            </div>
            <div class="page-reorder-actions">
              <button type="button" class="reorder-btn" title="Move Left" ${i === 0 ? 'disabled' : ''} onclick="window.mompdfWorkspace.moveFile(${i}, ${i - 1})">&larr;</button>
              <button type="button" class="reorder-btn" title="Move Right" ${i === files.length - 1 ? 'disabled' : ''} onclick="window.mompdfWorkspace.moveFile(${i}, ${i + 1})">&rarr;</button>
            </div>
          </div>
        `
        )
        .join('')}
      </div>
    `;
  }

  function renderInteractivePageCards(count = 4, forRemoval = false) {
    let cards = '';
    for (let i = 1; i <= count; i++) {
      cards += `
        <div class="page-card" id="pageCard_${i}" onclick="window.mompdfWorkspace.togglePageSelection(${i}, ${forRemoval})">
          <div class="page-card-actions">
            <button type="button" class="page-action-btn" title="Rotate Page" onclick="event.stopPropagation(); window.mompdfWorkspace.rotateSinglePage(${i})">↻</button>
          </div>
          <div class="page-card-thumb" id="thumb_${i}">Page ${i}</div>
          <div class="page-card-number">Page ${i}</div>
        </div>
      `;
    }
    return `<div class="pages-grid">${cards}</div>`;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (s) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[s]));
  }

  // Helper for option card selection
  window.selectOptionCard = function (el, radioName, val) {
    const parent = el.closest('.option-cards-group');
    if (parent) {
      parent.querySelectorAll('.option-card').forEach((c) => c.classList.remove('active'));
    }
    el.classList.add('active');
    const radio = el.querySelector(`input[name="${radioName}"]`);
    if (radio) radio.checked = true;

    if (radioName === 'splitMode') {
      const rangeBox = document.getElementById('rangeInputContainer');
      if (rangeBox) rangeBox.style.display = val === 'range' ? 'block' : 'none';
    }

    if (radioName === 'level') {
      const customBox = document.getElementById('customSizeInputContainer');
      if (customBox) customBox.style.display = val === 'custom' ? 'block' : 'none';
    }
  };

  // --- 3. Main Workspace Controller Class ---
  class MomPDFWorkspace {
    constructor() {
      this.toolId = this.detectToolId();
      this.toolDef = TOOL_REGISTRY[this.toolId] || TOOL_REGISTRY.merge_pdf;
      this.files = [];
      this.init();
    }

    detectToolId() {
      if (window.mompdfTool) {
        return this.normalizeToolId(window.mompdfTool);
      }
      const path = window.location.pathname.toLowerCase();
      const match = path.match(/\/(?:pdf\/)?([a-z0-9_-]+)(?:\.html)?$/);
      if (match && match[1]) {
        return this.normalizeToolId(match[1]);
      }
      return 'merge_pdf';
    }

    normalizeToolId(id) {
      const clean = id.replace(/-/g, '_').replace(/\.html$/, '');
      if (clean === 'merge') return 'merge_pdf';
      if (clean === 'split') return 'split_pdf';
      if (clean === 'compress') return 'compress_pdf';
      if (clean === 'rotate') return 'rotate_pdf';
      if (clean === 'watermark') return 'pdf_add_watermark';
      if (clean === 'pagenumber' || clean === 'page_numbers') return 'add_pdf_page_number';
      if (clean === 'protect') return 'protect_pdf';
      if (clean === 'unlock') return 'unlock_pdf';
      if (clean === 'crop') return 'crop_pdf';
      if (clean === 'organize') return 'organize_pdf';
      if (clean === 'pdfa') return 'convert_pdf_to_pdfa';
      if (clean === 'ocr') return 'ocr_pdf';
      if (clean === 'summarize') return 'pdf_summarize';
      if (clean === 'translate') return 'translate_pdf';
      if (clean === 'repair') return 'repair_pdf';
      if (clean === 'sign') return 'sign_pdf';
      if (clean === 'redact') return 'redact_pdf';
      if (clean === 'compare') return 'compare_pdf';
      if (clean === 'edit' || clean === 'edit_pdf') return 'edit_pdf';
      if (clean === 'scan' || clean === 'scan_pdf') return 'scan_pdf';
      if (clean === 'html_to_pdf' || clean === 'html') return 'html_to_pdf';
      return clean;
    }

    updateEditLivePreview() {
      const textInp = document.getElementById('editTextContent');
      const colorInp = document.getElementById('editTextColor');
      const sizeInp = document.querySelector('input[name="fontSize"]');
      const overlay = document.getElementById('editLiveOverlay');
      if (overlay) {
        if (textInp && textInp.value) overlay.innerText = textInp.value;
        if (colorInp && colorInp.value) {
          overlay.style.color = colorInp.value;
          overlay.style.borderColor = colorInp.value;
        }
        if (sizeInp && sizeInp.value) {
          overlay.style.fontSize = `${sizeInp.value}px`;
        }
      }
    }

    async init() {
      this.renderWorkspaceShell();
      this.bindDropzone();

      // File caching has been removed to prevent memory leaks and UI freezing for large PDFs.
      // The application now processes files purely in-memory during the active session.
    }

    renderWorkspaceShell() {
      const container = document.getElementById('workspaceApp');
      if (!container) return;

      container.innerHTML = `
        <div class="workspace-wrapper">
          <!-- Top Sticky Navbar -->
          <div class="workspace-navbar">
            <div class="workspace-nav-left">
              <a href="index.html" class="back-to-tools-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                PDF Tools
              </a>
              <div class="workspace-tool-title-group">
                <span class="workspace-tool-badge">${this.toolDef.badge}</span>
                <h1 class="workspace-tool-heading">${this.toolDef.name}</h1>
              </div>
            </div>

            <div class="workspace-nav-right" id="topNavRight">
              <div id="fileInfoChip" class="file-info-chip" style="display:none;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                <span id="fileInfoText">0 Files</span>
              </div>
              <button id="startOverBtn" class="btn btn-secondary btn-sm" style="display:none;" onclick="window.mompdfWorkspace.startOver()">
                Start Over
              </button>
            </div>
          </div>

          <!-- Main View Container -->
          <div id="viewContainer" style="flex:1; display:flex; flex-direction:column;">
            <!-- Dropzone View (Initial Stage) -->
            <div id="dropzoneStage" style="padding: 40px 24px; max-width: 860px; margin: 0 auto; width: 100%;">
              <div class="tool-header">
                <h1>${this.toolDef.name}</h1>
                <p>${this.toolDef.desc}</p>
              </div>

              <div id="dropzone" class="dropzone-container">
                <input type="file" id="fileInput" ${this.toolDef.multiFile ? 'multiple' : ''} style="display:none;" />
                <div class="dropzone-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <div class="dropzone-title">Select ${this.toolDef.multiFile ? 'PDF files' : 'PDF file'}</div>
                <div class="dropzone-subtitle">or drag and drop your document here</div>
                <button id="selectFileBtn" class="btn btn-primary btn-lg">Choose File</button>
              </div>
            </div>

            <!-- Dedicated Studio View (Two-Column Workspace) -->
            <div id="studioStage" class="workspace-studio" style="display:none;">
              <!-- Left / Main Document Panel -->
              <div class="workspace-canvas-panel">
                <div class="canvas-header">
                  <div class="canvas-title">Workspace Preview</div>
                  <div id="canvasExtraActions"></div>
                </div>
                <div class="canvas-content-area" id="canvasContentArea"></div>
              </div>

              <!-- Right Sidebar Controls Panel -->
              <div class="workspace-controls-panel">
                <div class="controls-header" id="controlsPanelHeading">${this.toolDef.name} Settings</div>
                <form id="workspaceForm" onsubmit="event.preventDefault(); window.mompdfWorkspace.executeProcess();">
                  <div id="toolSpecificControls">
                    ${this.toolDef.renderControls ? this.toolDef.renderControls(this.toolDef, this.files) : '<p style="font-size:13px; color:var(--text-muted);">Ready to process with default high-quality settings.</p>'}
                  </div>
                  <button type="submit" id="mainActionBtn" class="workspace-action-btn">
                    ${this.toolDef.actionLabel || 'Process PDF'} &rarr;
                  </button>
                </form>
              </div>
            </div>

            <!-- Processing / Progress View -->
            <div id="processingStage" style="display:none; padding:60px 24px; max-width:600px; margin:0 auto; width:100%;">
              <div class="progress-container" style="display:block;">
                <div class="spinner"></div>
                <h3 id="progressHeading" style="font-size:22px; font-weight:800; color:var(--text-main); margin-bottom:8px;">Processing your PDF...</h3>
                <p style="font-size:14px; color:var(--text-muted);">MomPDF is executing ${this.toolDef.name} with high performance.</p>
                <div class="progress-bar-bg">
                  <div id="progressBarFill" class="progress-bar-fill" style="width: 15%;"></div>
                </div>
              </div>
            </div>

            <!-- Success / Download View -->
            <div id="successStage" style="display:none; width:100%; max-width:800px; margin:0 auto;">
              <div class="download-hero-section">
                
                <div class="success-icon-wrap">
                  <div class="confetti confetti-1"></div>
                  <div class="confetti confetti-2"></div>
                  <div class="confetti confetti-3"></div>
                  <div class="confetti confetti-4"></div>
                  <div class="confetti confetti-5"></div>
                  <div class="success-circle-check">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                
                <h2 class="download-hero-title">Your file is ready!</h2>
                <p class="download-hero-subtitle">Your PDF has been processed successfully and is ready to download.</p>
                
                <div class="file-info-card">
                  <div class="file-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-3 14H8.5v-2H10c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1H7v7h1.5v-2H11v2zm-1.5-4.5h-1v1h1v-1zm4.5 4.5h-1.5V11.5h2.5v1.5h-1v1h1v1.5h-1v1.5zm4 0h-1.5v-4c0-.55-.45-1-1-1h-1.5v-1.5h3c.55 0 1 .45 1 1v5z"/></svg>
                  </div>
                  <div class="file-info-content">
                    <div class="file-info-label">File</div>
                    <div class="file-info-pill" id="successFileName">document.pdf</div>
                    <div class="file-info-status">
                      (<span id="successFileSize">0 KB</span>) has been processed cleanly.
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline></svg>
                    </div>
                  </div>
                </div>

                <div class="action-buttons-row">
                  <a id="downloadResultBtn" href="#" class="btn-hero-download" download>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download File
                  </a>
                  <button type="button" class="btn-hero-share" onclick="window.mompdfWorkspace.copyShareLink()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                    Share / Copy Link
                  </button>
                </div>

                <div class="divider-with-text">What's next?</div>

                <div class="next-steps-row">
                  <a href="#" class="next-step-card" onclick="event.preventDefault(); window.mompdfWorkspace.startOver();">
                    <div class="next-step-icon ns-blue">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <div class="next-step-content">
                      <div class="next-step-title">Process Another File</div>
                      <div class="next-step-desc">Upload and process another PDF</div>
                    </div>
                    <svg class="next-step-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </a>
                  
                  <a href="index.html" class="next-step-card">
                    <div class="next-step-icon ns-purple">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    </div>
                    <div class="next-step-content">
                      <div class="next-step-title">All PDF Tools</div>
                      <div class="next-step-desc">Explore more PDF tools</div>
                    </div>
                    <svg class="next-step-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      `;

      if (window.mompdfI18n) {
        window.mompdfI18n.applyTranslations();
      }
    }

    bindDropzone() {
      const dropzone = document.getElementById('dropzone');
      const fileInput = document.getElementById('fileInput');
      const selectBtn = document.getElementById('selectFileBtn');

      if (!dropzone || !fileInput) return;

      if (selectBtn) {
        selectBtn.addEventListener('click', (e) => {
          e.preventDefault();
          fileInput.click();
        });
      }

      dropzone.addEventListener('click', (e) => {
        if (!e.target.closest('button')) fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length) {
          this.handleFilesUploaded(Array.from(e.target.files));
          fileInput.value = ''; // Reset input to allow selecting the same file again
        }
      });

      ['dragenter', 'dragover'].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          dropzone.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          dropzone.classList.remove('drag-over');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length) {
          this.handleFilesUploaded(Array.from(dt.files));
        }
      });
    }

    handleFilesUploaded(newFiles) {
      if (this.toolDef.multiFile) {
        // Prevent exact duplicates by name and size
        const existingSigs = new Set(this.files.map(f => f.name + '_' + f.size));
        const uniqueNew = newFiles.filter(f => !existingSigs.has(f.name + '_' + f.size));
        this.files = [...this.files, ...uniqueNew];
      } else {
        this.files = [newFiles[0]];
      }

      // Allow only PDF files unless it's HTML to PDF
      const validFiles = this.files.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
      if (validFiles.length < this.files.length && this.toolId !== 'html_to_pdf') {
        if (this.showToast) this.showToast('Non-PDF files were ignored.');
      }
      this.files = this.toolId === 'html_to_pdf' ? this.files : validFiles;

      if (this.files.length === 0 && this.toolId !== 'html_to_pdf') {
        return; // Don't proceed if no valid files
      }

      this.loadFilesIntoStudio(this.files);
    }

    loadFilesIntoStudio(files) {
      this.files = files;
      if (!this.files.length) return;

      // Update Top Nav File Info
      const chip = document.getElementById('fileInfoChip');
      const text = document.getElementById('fileInfoText');
      const startOverBtn = document.getElementById('startOverBtn');

      if (chip && text) {
        chip.style.display = 'flex';
        text.innerText = this.files.length === 1 ? `${this.files[0].name} (${this.formatSize(this.files[0].size)})` : `${this.files.length} Files Selected`;
      }
      if (startOverBtn) startOverBtn.style.display = 'inline-flex';

      // Switch View
      document.getElementById('dropzoneStage').style.display = 'none';
      document.getElementById('processingStage').style.display = 'none';
      document.getElementById('successStage').style.display = 'none';
      document.getElementById('studioStage').style.display = 'grid';

      // Render Preview & Controls
      const canvasArea = document.getElementById('canvasContentArea');
      const controlsArea = document.getElementById('toolSpecificControls');
      const controlsHeading = document.getElementById('controlsPanelHeading');
      const mainBtn = document.getElementById('mainActionBtn');

      if (controlsHeading) {
        controlsHeading.innerText = `${this.toolDef.name} Settings`;
      }
      if (mainBtn) {
        mainBtn.innerHTML = `${this.toolDef.actionLabel || 'Process PDF'} &rarr;`;
      }

      // Render Canvas Header Actions (e.g. Sorting Toolbar for multi-file tools)
      const extraActions = document.getElementById('canvasExtraActions');
      if (extraActions) {
        if (this.toolDef.multiFile && this.files.length >= 2) {
          extraActions.innerHTML = `
            <div class="sort-toolbar">
              <label style="font-size:13px; font-weight:700; color:var(--text-muted); display:flex; align-items:center; gap:5px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
                Arrange:
              </label>
              <select class="sort-select" onchange="window.mompdfWorkspace.sortFiles(this.value)">
                <option value="custom" ${this.currentSort === 'custom' ? 'selected' : ''}>Custom Order</option>
                <option value="az" ${this.currentSort === 'az' ? 'selected' : ''}>A &rarr; Z</option>
                <option value="za" ${this.currentSort === 'za' ? 'selected' : ''}>Z &rarr; A</option>
                <option value="newest" ${this.currentSort === 'newest' ? 'selected' : ''}>Newest &rarr; Oldest</option>
                <option value="oldest" ${this.currentSort === 'oldest' ? 'selected' : ''}>Oldest &rarr; Newest</option>
              </select>
              <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('fileInput').click()">+ Add More Files</button>
            </div>
          `;
        } else if (this.toolDef.multiFile) {
          extraActions.innerHTML = `
            <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('fileInput').click()">+ Add More Files</button>
          `;
        } else {
          extraActions.innerHTML = '';
        }
      }

      if (canvasArea) {
        if (this.toolDef.renderPreview) {
          canvasArea.innerHTML = this.toolDef.renderPreview(this.toolDef, this.files);
        } else {
          canvasArea.innerHTML = `
            <div style="background:#fff; border:1px solid var(--border-color); border-radius:8px; padding:36px; text-align:center; box-shadow:var(--shadow-md); max-width:400px; width:100%;">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <h4 style="font-size:16px; font-weight:700; color:var(--text-main); margin-top:14px; word-break:break-all;">${escapeHtml(this.files[0].name)}</h4>
              <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Size: ${this.formatSize(this.files[0].size)}</p>
            </div>
          `;
        }
      }

      if (controlsArea && this.toolDef.renderControls) {
        controlsArea.innerHTML = this.toolDef.renderControls(this.toolDef, this.files);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Initialize signature pad if tool is sign
      if (this.toolId === 'sign_pdf') {
        this.initSignaturePad();
      }

      if (window.mompdfI18n) {
        window.mompdfI18n.applyTranslations();
      }
    }

    sortFiles(mode) {
      this.currentSort = mode;
      if (mode === 'az') {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        this.files.sort((a, b) => collator.compare(a.name, b.name));
      } else if (mode === 'za') {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        this.files.sort((a, b) => collator.compare(b.name, a.name));
      } else if (mode === 'newest') {
        this.files.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
      } else if (mode === 'oldest') {
        this.files.sort((a, b) => (a.lastModified || 0) - (b.lastModified || 0));
      }
      this.loadFilesIntoStudio(this.files);
      const label = mode === 'az' ? 'A → Z' : mode === 'za' ? 'Z → A' : mode === 'newest' ? 'Newest → Oldest' : mode === 'oldest' ? 'Oldest → Newest' : 'Custom Order';
      this.showToast(`Files arranged: ${label}`);
    }

    moveFile(fromIndex, toIndex) {
      if (toIndex < 0 || toIndex >= this.files.length) return;
      this.currentSort = 'custom';
      const [moved] = this.files.splice(fromIndex, 1);
      this.files.splice(toIndex, 0, moved);
      this.loadFilesIntoStudio(this.files);
    }

    handleDragStart(e, index) {
      this.draggedIndex = index;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index);
      const card = e.currentTarget;
      setTimeout(() => card.classList.add('dragging'), 0);
    }

    handleDragOver(e, index) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const card = e.currentTarget;
      card.classList.add('drag-over');
    }

    handleDragLeave(e, index) {
      e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e, targetIndex) {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-over');
      if (this.draggedIndex !== undefined && this.draggedIndex !== null && this.draggedIndex !== targetIndex) {
        this.moveFile(this.draggedIndex, targetIndex);
      }
    }

    handleDragEnd(e) {
      e.currentTarget.classList.remove('dragging');
      document.querySelectorAll('.page-card').forEach((c) => c.classList.remove('drag-over'));
      this.draggedIndex = null;
    }

    removeFile(index) {
      this.files.splice(index, 1);
      if (this.files.length === 0) {
        this.startOver();
      } else {
        this.loadFilesIntoStudio(this.files);
      }
    }

    setRotateAngle(deg) {
      const box = document.getElementById('rotatePreviewBox');
      const input = document.getElementById('rotateAngleInput');
      const label = document.getElementById('rotateAngleLabel');
      if (input) input.value = deg;
      if (box) box.style.transform = `rotate(${deg}deg)`;
      if (label) label.innerText = `Rotated ${deg}°`;
      this.showToast(`Rotation set to ${deg}°`);
    }

    updateWatermarkLivePreview() {
      const textInput = document.getElementById('watermarkTextInput');
      const opacityInput = document.getElementById('watermarkOpacityInput');
      const angleInput = document.getElementById('watermarkAngleInput');
      const colorInput = document.getElementById('watermarkColorInput');
      const opacityVal = document.getElementById('opacityVal');
      const overlay = document.getElementById('watermarkLiveText');

      if (!overlay) return;

      const text = textInput ? textInput.value : 'CONFIDENTIAL';
      const opacity = opacityInput ? opacityInput.value : 0.3;
      const angle = angleInput ? angleInput.value : 45;
      const color = colorInput ? colorInput.value : '#E11D48';

      if (opacityVal) opacityVal.innerText = opacity;
      overlay.innerText = text;
      overlay.style.opacity = opacity;
      overlay.style.color = color;
      overlay.style.transform = `rotate(${angle}deg)`;
    }

    updateCropPreview(margin) {
      const frame = document.getElementById('cropPreviewBox');
      if (frame) {
        const padding = Math.min(Math.max(margin, 10), 100);
        frame.style.padding = `${padding}px`;
      }
    }

    togglePageSelection(pageNum, forRemoval) {
      const card = document.getElementById(`pageCard_${pageNum}`);
      if (!card) return;

      if (forRemoval) {
        card.classList.toggle('selected-for-removal');
        const selected = Array.from(document.querySelectorAll('.page-card.selected-for-removal'))
          .map((c) => c.id.replace('pageCard_', ''))
          .join(', ');
        const input = document.getElementById('removePagesInput');
        if (input) input.value = selected;
      }
    }

    rotateSinglePage(pageNum) {
      const thumb = document.getElementById(`thumb_${pageNum}`);
      if (thumb) {
        const currentRot = parseInt(thumb.getAttribute('data-rot') || '0', 10);
        const nextRot = (currentRot + 90) % 360;
        thumb.setAttribute('data-rot', nextRot);
        thumb.style.transform = `rotate(${nextRot}deg)`;
        this.showToast(`Page ${pageNum} rotated ${nextRot}°`);
      }
    }

    initSignaturePad() {
      const canvas = document.getElementById('signatureCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#0F172A';

      let drawing = false;

      const start = (e) => {
        drawing = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        ctx.moveTo(x, y);
      };

      const draw = (e) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
      };

      const stop = () => {
        drawing = false;
      };

      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', draw);
      window.addEventListener('mouseup', stop);

      canvas.addEventListener('touchstart', start);
      canvas.addEventListener('touchmove', draw);
      window.addEventListener('touchend', stop);
    }

    clearSignature() {
      const canvas = document.getElementById('signatureCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.showToast('Signature cleared');
    }

    async executeProcess() {
      if (!this.files.length && this.toolId !== 'html_to_pdf') {
        this.showToast('Please select at least one PDF file to process.');
        return;
      }

      // Show processing view immediately
      document.getElementById('studioStage').style.display = 'none';
      document.getElementById('dropzoneStage').style.display = 'none';
      document.getElementById('processingStage').style.display = 'block';

      const bar = document.getElementById('progressBarFill');
      const heading = document.getElementById('progressHeading');
      if (bar) bar.style.width = '0%';

      const formData = new FormData();
      formData.append('tool', this.toolId);
      this.files.forEach((f) => formData.append('files', f));

      // Append form fields
      const form = document.getElementById('workspaceForm');
      if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach((inp) => {
          if (inp.name) {
            if ((inp.type === 'radio' || inp.type === 'checkbox') && !inp.checked) {
              return; // Skip unchecked options
            }
            formData.append(inp.name, inp.value);
          }
        });
      }

      // Use XMLHttpRequest for real upload progress tracking
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        let fakeProgressInterval;

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const uploadPct = Math.round((e.loaded / e.total) * 70); // Upload is 0-70%
            if (bar) bar.style.width = `${uploadPct}%`;
            if (heading) heading.textContent = uploadPct < 70 ? `Uploading... ${uploadPct}%` : 'Compressing and optimizing your PDF...';
            
            // Start fake progress once upload is done
            if (uploadPct >= 70 && !fakeProgressInterval) {
              let currentPct = 70;
              fakeProgressInterval = setInterval(() => {
                if (currentPct < 95) {
                  currentPct += Math.random() * 2;
                  if (currentPct > 95) currentPct = 95;
                  if (bar) bar.style.width = `${currentPct}%`;
                  
                  // Update text dynamically based on percentage to make it feel active
                  if (heading) {
                    if (currentPct > 90) heading.textContent = 'Finalizing compression...';
                    else if (currentPct > 80) heading.textContent = 'Optimizing images and fonts...';
                  }
                }
              }, 800);
            }
          }
        });

        xhr.addEventListener('load', () => {
          if (fakeProgressInterval) clearInterval(fakeProgressInterval);
          if (bar) bar.style.width = '98%';
          if (heading) heading.textContent = 'Almost done...';
          try {
            if (!xhr.responseText) {
              throw new Error('Server returned an empty response. The file might be too large or the connection was lost.');
            }
            const data = JSON.parse(xhr.responseText);
            if (xhr.status < 200 || xhr.status >= 300 || !data.success) {
              throw new Error(data.message || 'Processing failed. Please try again.');
            }
            if (bar) bar.style.width = '100%';
            setTimeout(() => this.showSuccess(data.data), 300);
          } catch (err) {
            document.getElementById('processingStage').style.display = 'none';
            document.getElementById('studioStage').style.display = 'grid';
            this.showToast(err.message || 'Something went wrong. Please try again.');
          }
          resolve();
        });

        xhr.addEventListener('error', () => {
          if (fakeProgressInterval) clearInterval(fakeProgressInterval);
          document.getElementById('processingStage').style.display = 'none';
          document.getElementById('studioStage').style.display = 'grid';
          this.showToast('Network error. Please check your connection and try again.');
          resolve();
        });

        xhr.addEventListener('timeout', () => {
          if (fakeProgressInterval) clearInterval(fakeProgressInterval);
          document.getElementById('processingStage').style.display = 'none';
          document.getElementById('studioStage').style.display = 'grid';
          this.showToast('Request timed out. Your PDF may be too large — try a smaller file.');
          resolve();
        });

        xhr.open('POST', '/api/process');
        xhr.timeout = 300000; // 5 minutes timeout for large files
        xhr.send(formData);
      });
    }

    showSuccess(result) {
      document.getElementById('processingStage').style.display = 'none';
      document.getElementById('studioStage').style.display = 'none';
      document.getElementById('dropzoneStage').style.display = 'none';
      document.getElementById('successStage').style.display = 'block';

      this.currentDownloadUrl = result.downloadUrl;

      const nameEl = document.getElementById('successFileName');
      const sizeEl = document.getElementById('successFileSize');
      const dlBtn = document.getElementById('downloadResultBtn');

      if (nameEl) nameEl.innerText = result.filename || 'Processed.pdf';
      if (sizeEl) sizeEl.innerText = this.formatSize(result.size || 0);
      if (dlBtn) {
        dlBtn.href = result.downloadUrl;
        dlBtn.setAttribute('download', result.filename || 'document.pdf');
      }

      const existingStats = document.getElementById('compStatsBox');
      if (existingStats) existingStats.remove();

      if (result.compressionStats) {
        const stats = result.compressionStats;
        const origStr = this.formatSize(stats.originalSize);
        const compStr = this.formatSize(stats.compressedSize);
        const savedStr = this.formatSize(stats.savedSize);

        const statsHtml = `
          <div id="compStatsBox" style="background:#F3F4F6; border:1px solid #E5E7EB; border-radius:12px; padding:16px; margin-bottom:24px; display:flex; gap:16px; justify-content:space-around; text-align:center;">
            <div>
              <div style="font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700;">Original Size</div>
              <div style="font-size:16px; font-weight:700; color:#111827;">${origStr}</div>
            </div>
            <div>
              <div style="font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700;">Compressed</div>
              <div style="font-size:16px; font-weight:700; color:#10B981;">${compStr}</div>
            </div>
            <div>
              <div style="font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700;">Saved</div>
              <div style="font-size:16px; font-weight:700; color:#111827;">${stats.percentage}%</div>
            </div>
          </div>
        `;
        const actionRow = document.querySelector('.action-buttons-row');
        if (actionRow) {
          actionRow.insertAdjacentHTML('beforebegin', statsHtml);
        }
      }

      this.showToast('Your file is ready for download!');
    }

    copyShareLink() {
      if (!this.currentDownloadUrl) {
        this.showToast('No active download link.');
        return;
      }
      const fullUrl = window.location.origin + this.currentDownloadUrl;
      navigator.clipboard.writeText(fullUrl).then(() => {
        this.showToast('✓ Share link copied to clipboard!');
      }).catch(() => {
        this.showToast(`Link: ${fullUrl}`);
      });
    }

    startOver() {
      this.files = [];
      document.getElementById('successStage').style.display = 'none';
      document.getElementById('processingStage').style.display = 'none';
      document.getElementById('studioStage').style.display = 'none';
      document.getElementById('dropzoneStage').style.display = 'block';

      const chip = document.getElementById('fileInfoChip');
      const startOverBtn = document.getElementById('startOverBtn');
      if (chip) chip.style.display = 'none';
      if (startOverBtn) startOverBtn.style.display = 'none';
      const fileInput = document.getElementById('fileInput');
      if (fileInput) fileInput.value = '';
    }

    showToast(message) {
      const existing = document.querySelector('.mompdf-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = 'mompdf-toast';
      toast.innerText = message;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    formatSize(bytes) {
      if (!bytes || bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }

  // Global language modal handlers
  window.mompdfOpenLangModal = function () {
    const backdrop = document.getElementById('footerLangModalBackdrop');
    if (backdrop) {
      backdrop.classList.add('is-open');
      const input = document.getElementById('langSearchInput');
      if (input) {
        input.value = '';
        window.mompdfFilterLanguages('');
        setTimeout(() => input.focus(), 120);
      }
    }
  };

  window.mompdfCloseLangModal = function () {
    const backdrop = document.getElementById('footerLangModalBackdrop');
    if (backdrop) backdrop.classList.remove('is-open');
  };

  window.mompdfFilterLanguages = function (query) {
    const q = (query || '').toLowerCase().trim();
    let visibleCount = 0;
    document.querySelectorAll('.lang-card').forEach((card) => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const nativeName = (card.getAttribute('data-native') || '').toLowerCase();
      const code = (card.getAttribute('data-code') || '').toLowerCase();
      const match = !q || name.includes(q) || nativeName.includes(q) || code.includes(q);
      card.style.display = match ? 'flex' : 'none';
      if (match) visibleCount++;
    });
    const emptyState = document.getElementById('langEmptyState');
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  // Global language selector function
  window.mompdfSelectLang = function (name, code, country) {
    const currentLabel = document.getElementById('currentLangLabel');
    const currentFlagSvg = document.getElementById('currentLangFlagSvg');
    if (currentLabel) currentLabel.innerText = name;

    document.querySelectorAll('.lang-card').forEach((btn) => {
      const isActive = btn.getAttribute('data-code') === code;
      btn.classList.toggle('active', isActive);
      if (isActive && currentFlagSvg) {
        const flagSvg = btn.querySelector('.flag-icon');
        if (flagSvg) {
          currentFlagSvg.innerHTML = flagSvg.outerHTML;
        }
      }
    });

    window.mompdfCloseLangModal();
    try {
      localStorage.setItem('mompdf_lang', code);
    } catch (e) { }

    // Trigger instant translation
    if (window.mompdfI18n && typeof window.mompdfI18n.setLanguage === 'function') {
      window.mompdfI18n.setLanguage(code);
    }
  };

  // Auto-init on page load
  document.addEventListener('DOMContentLoaded', () => {
    window.mompdfWorkspace = new MomPDFWorkspace();

    // Restore saved language and ensure footer pill is updated
    try {
      const savedLang = localStorage.getItem('mompdf_lang');
      if (savedLang) {
        if (window.mompdfI18n && typeof window.mompdfI18n.setLanguage === 'function') {
          window.mompdfI18n.setLanguage(savedLang);
        }
      }
      if (window.mompdfI18n && typeof window.mompdfI18n.updateFooterPill === 'function') {
        window.mompdfI18n.updateFooterPill();
      }
    } catch (e) { }

    // Close dropdowns on outside click & escape key listener
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item')) {
        document.querySelectorAll('.nav-item.is-open').forEach((el) => el.classList.remove('is-open'));
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.mompdfCloseLangModal();
      }
    });
  });
})();

