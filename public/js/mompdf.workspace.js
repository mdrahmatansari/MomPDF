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
      multiFile: false,
      desc: 'Rotate PDF pages 90°, 180°, or 270° clockwise or counter-clockwise.',
      actionLabel: 'Rotate PDF',
      renderControls: () => `
        <div style="background-color: #e6f3fb; padding: 15px; border-radius: 6px; margin-bottom: 24px; font-size: 14px; color: #1e293b; display: flex; align-items: flex-start; gap: 12px; line-height: 1.5;">
          <svg style="min-width:20px; max-width:20px; color:#0ea5e9; margin-top:2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <div>Mouse over PDF file below and a ↻ icon will appear, click on the arrows to rotate PDFs.</div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
          <div style="font-weight:700; font-size:16px; color:#1e293b;">Rotation</div>
          <a href="#" style="color:#e11d48; font-weight:600; text-decoration:underline; font-size:14px;" onclick="window.mompdfWorkspace.rotateBy(-parseInt(document.getElementById('rotateAngleInput').value) || 0); event.preventDefault();">Reset all</a>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; align-items:center; background:#f8fafc; border-radius:8px; overflow:hidden; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.1); transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="window.mompdfWorkspace.rotateBy(90)">
            <div style="background:#e11d48; color:white; padding:16px 20px; display:flex; align-items:center; justify-content:center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M21 13a9 9 0 1 1-3-7.7L21 8"></path></svg>
            </div>
            <div style="padding:16px 20px; font-weight:500; color:#334155; flex:1; font-size:15px;">RIGHT</div>
          </div>

          <div style="display:flex; align-items:center; background:#f8fafc; border-radius:8px; overflow:hidden; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.1); transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="window.mompdfWorkspace.rotateBy(-90)">
            <div style="background:#e11d48; color:white; padding:16px 20px; display:flex; align-items:center; justify-content:center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="scale(-1, 1)"><path d="M21 2v6h-6"></path><path d="M21 13a9 9 0 1 1-3-7.7L21 8"></path></svg>
            </div>
            <div style="padding:16px 20px; font-weight:500; color:#334155; flex:1; font-size:15px;">LEFT</div>
          </div>
        </div>
        <input type="hidden" name="angle" id="rotateAngleInput" value="0" />
      `,
      renderPreview: (tool, files) => {
        if (!files || files.length === 0) {
          return `<div style="text-align:center; padding:40px; color:#64748B;">No file selected</div>`;
        }
        return renderMultiFileGrid(files);
      }
    },
    pdf_add_watermark: {
      id: 'pdf_add_watermark',
      name: 'Watermark PDF',
      badge: 'Edit',
      desc: 'Stamp customizable text or image watermark over PDF pages.',
      actionLabel: 'Apply Watermark',
      renderControls: () => `
        <style>
          .wm-header { text-align: center; font-size: 24px; font-weight: 700; color: #2d3748; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; display: none; }
          
          .wm-tabs { display: flex; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; }
          .wm-tab { flex: 1; padding: 16px 10px; text-align: center; cursor: pointer; background: #fff; position: relative; border: 1px solid transparent; border-bottom: none; border-radius: 4px 4px 0 0; }
          .wm-tab.active { border-color: #e2e8f0; }
          .wm-tab.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: #fff; }
          .wm-tab.active .wm-tab-icon { color: #2d3748; border-bottom: 3px solid #2d3748; }
          .wm-tab:not(.active) .wm-tab-icon { color: #a0aec0; border-bottom: 3px solid transparent; }
          .wm-tab:not(.active) .wm-tab-text { color: #a0aec0; }
          .wm-tab .wm-tab-text { font-size: 14px; margin-top: 8px; font-weight: 500; }
          .wm-tab-icon { font-size: 28px; font-weight: 700; display: inline-block; line-height: 1; padding: 0 4px; }
          .wm-check { position: absolute; top: 12px; left: 12px; width: 18px; height: 18px; background: #10b981; color: #fff; border-radius: 50%; font-size: 12px; display: flex; align-items: center; justify-content: center; }

          .wm-label { font-size: 14px; font-weight: 700; color: #4a5568; margin-bottom: 8px; }
          .wm-input { width: 100%; padding: 10px; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 14px; color: #4a5568; outline: none; }
          .wm-input:focus { border-color: #a0aec0; }
          .wm-select { border: none; background: transparent; font-size: 12px; cursor: pointer; outline: none; color: #4a5568; appearance: auto; }
          
          .wm-btn-icon { background: none; border: none; font-size: 16px; cursor: pointer; padding: 4px 8px; color: #2d3748; border-radius: 4px; }
          .wm-btn-icon:hover { background: #f7fafc; }
          .wm-btn-icon.active { background: #edf2f7; }

          .wm-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); width: 64px; height: 64px; border: 1px solid #cbd5e0; background: #fff; gap: 0; }
          .wm-grid-cell { border-right: 1px dashed #cbd5e0; border-bottom: 1px dashed #cbd5e0; cursor: pointer; position: relative; }
          .wm-grid-cell:nth-child(3n) { border-right: none; }
          .wm-grid-cell:nth-child(n+7) { border-bottom: none; }
          .wm-grid-cell.active::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: #f56565; border-radius: 50%; }

          .wm-row { display: flex; gap: 20px; margin-bottom: 24px; }
          .wm-col { flex: 1; }

          .wm-pages-input { display: flex; align-items: center; border: 1px solid #cbd5e0; border-radius: 4px; overflow: hidden; background: #fff; }
          .wm-pages-label { padding: 8px 12px; font-size: 14px; color: #4a5568; border-right: 1px solid #cbd5e0; white-space: nowrap; }
          .wm-pages-field { width: 100%; border: none; padding: 8px 12px; outline: none; font-size: 14px; color: #4a5568; }

          .wm-layer-btn { flex: 1; padding: 24px 10px; text-align: center; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; background: #f7fafc; color: #a0aec0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; transition: all 0.2s; font-size: 14px; }
          .wm-layer-btn.active { border-color: #e53e3e; color: #e53e3e; background: #fff5f5; }
          .wm-layer-icon { width: 32px; height: 32px; fill: currentColor; }
        </style>

        <div class="wm-header">Watermark options</div>

        <div class="wm-tabs">
          <div class="wm-tab active" id="wmModeTextBtn" onclick="window.mompdfWorkspace.setWatermarkModeUI('text')">
            <div class="wm-check" id="wmTextCheck">✓</div>
            <div class="wm-tab-icon" style="font-family: serif;">A</div>
            <div class="wm-tab-text">Place text</div>
          </div>
          <div class="wm-tab" id="wmModeImageBtn" onclick="window.mompdfWorkspace.setWatermarkModeUI('image')">
            <div class="wm-check" id="wmImageCheck" style="display:none;">✓</div>
            <div class="wm-tab-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            </div>
            <div class="wm-tab-text">Place image</div>
          </div>
          <input type="hidden" name="wmMode" id="wmModeInput" value="text" />
        </div>

        <div id="wmTextControls" style="margin-bottom: 24px;">
          <div class="wm-label">Text:</div>
          <input type="text" name="text" id="watermarkTextInput" class="wm-input" value="MomPDF" placeholder="MomPDF" oninput="window.mompdfWorkspace.updateWatermarkLivePreview()" />
          
          <div class="wm-label" style="margin-top: 24px;">Text format:</div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <select name="font" id="wmFontInput" class="wm-select" onchange="window.mompdfWorkspace.updateWatermarkLivePreview()">
              <option value="Helvetica" selected>Arial</option>
              <option value="TimesRoman">Times New Roman</option>
              <option value="Courier">Courier</option>
            </select>
            
            <div style="display: flex; align-items: center;">
              <span style="font-weight:bold; font-size:14px; margin-right:2px;">T</span>
              <span style="font-weight:bold; font-size:10px; margin-right:4px;">T</span>
              <select name="fontSize" id="wmFontSizeInput" class="wm-select" onchange="window.mompdfWorkspace.updateWatermarkLivePreview()">
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
                <option value="72" selected>72</option>
                <option value="96">96</option>
              </select>
            </div>

            <div style="display: flex; gap: 4px; align-items: center; margin-left: auto;">
              <button type="button" id="wmBoldBtn" class="wm-btn-icon active" style="font-weight: 800; color: #e53e3e;" onclick="window.mompdfWorkspace.toggleWmFormat('bold')">B</button>
              <input type="hidden" name="isBold" id="wmIsBold" value="true" />
              
              <button type="button" id="wmItalicBtn" class="wm-btn-icon" style="font-style: italic; font-family: serif; font-weight: 700;" onclick="window.mompdfWorkspace.toggleWmFormat('italic')">I</button>
              <input type="hidden" name="isItalic" id="wmIsItalic" value="false" />
              
              <button type="button" id="wmUnderlineBtn" class="wm-btn-icon" style="text-decoration: underline; font-weight: 700;" onclick="window.mompdfWorkspace.toggleWmFormat('underline')">U</button>
              <input type="hidden" name="isUnderline" id="wmIsUnderline" value="false" />
              
              <label style="cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 28px; height: 28px; position: relative;">
                <span style="font-weight: 700; font-size: 16px;">A</span>
                <div id="wmColorIndicator" style="width: 18px; height: 3px; background: #333; margin-top: -2px;"></div>
                <input type="color" name="color" id="watermarkColorInput" value="#333333" style="opacity: 0; position: absolute; inset: 0; width: 100%; height: 100%; cursor: pointer;" onchange="document.getElementById('wmColorIndicator').style.background = this.value; window.mompdfWorkspace.updateWatermarkLivePreview()" />
              </label>
            </div>
          </div>
        </div>

        <div id="wmImageControls" style="display: none; margin-bottom: 24px;">
          <div class="wm-label">Add Image</div>
          <button type="button" style="width: 100%; padding: 12px; background: #f7fafc; border: 1px dashed #cbd5e0; border-radius: 4px; cursor: pointer; font-weight: 600; color: #4a5568;" onclick="document.getElementById('wmImageUpload').click()">+ Choose Image (JPG/PNG)</button>
          <input type="file" id="wmImageUpload" accept="image/png, image/jpeg, image/jpg" style="display:none;" onchange="window.mompdfWorkspace.handleWmImageUpload(event)" />
          <input type="hidden" name="imageBase64" id="wmImageBase64Input" value="" />
          <div id="wmImageFileName" style="font-size: 12px; color: #718096; margin-top: 8px; text-align: center;">No image selected</div>
          
          <div class="wm-label" style="margin-top: 24px;">Image Size (%)</div>
          <input type="range" name="imageSize" id="wmImageSizeInput" style="width:100%; margin-top: 8px;" min="10" max="100" step="5" value="50" oninput="window.mompdfWorkspace.updateWatermarkLivePreview()" />
        </div>

        <div class="wm-label">Position:</div>
        <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 24px;">
          <div class="wm-grid">
            <div class="wm-grid-cell" onclick="window.mompdfWorkspace.setWmPosition('top_left', this)"></div>
            <div class="wm-grid-cell" onclick="window.mompdfWorkspace.setWmPosition('top_center', this)"></div>
            <div class="wm-grid-cell" onclick="window.mompdfWorkspace.setWmPosition('top_right', this)"></div>
            <div class="wm-grid-cell" onclick="window.mompdfWorkspace.setWmPosition('middle_left', this)"></div>
            <div class="wm-grid-cell active" onclick="window.mompdfWorkspace.setWmPosition('center', this)"></div>
            <div class="wm-grid-cell" onclick="window.mompdfWorkspace.setWmPosition('middle_right', this)"></div>
            <div class="wm-grid-cell" onclick="window.mompdfWorkspace.setWmPosition('bottom_left', this)"></div>
            <div class="wm-grid-cell" onclick="window.mompdfWorkspace.setWmPosition('bottom_center', this)"></div>
            <div class="wm-grid-cell" onclick="window.mompdfWorkspace.setWmPosition('bottom_right', this)"></div>
          </div>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: #4a5568;">
            <input type="checkbox" id="wmMosaicCheck" onchange="window.mompdfWorkspace.toggleMosaic(this.checked)" style="width: 18px; height: 18px; border: 1px solid #cbd5e0; cursor: pointer;" />
            Mosaic
          </label>
          <input type="hidden" name="position" id="wmPositionInput" value="center" />
        </div>

        <div class="wm-row">
          <div class="wm-col">
            <div class="wm-label">Transparency:</div>
            <select name="transparency" id="wmOpacityInput" class="wm-input" onchange="window.mompdfWorkspace.updateWatermarkLivePreview()">
              <option value="1">No transparency</option>
              <option value="0.75">75%</option>
              <option value="0.5" selected>50%</option>
              <option value="0.25">25%</option>
            </select>
          </div>
          <div class="wm-col">
            <div class="wm-label">Rotation:</div>
            <select name="angle" id="wmRotationInput" class="wm-input" onchange="window.mompdfWorkspace.updateWatermarkLivePreview()">
              <option value="0">Do not rotate</option>
              <option value="45" selected>45 degrees</option>
              <option value="90">90 degrees</option>
              <option value="180">180 degrees</option>
              <option value="270">270 degrees</option>
            </select>
          </div>
        </div>
        <div class="wm-label" style="margin-top: 24px;">Pages:</div>
        <div class="wm-row" style="margin-bottom: 24px;">
          <div class="wm-col wm-pages-input">
            <div class="wm-pages-label">from page</div>
            <input type="number" name="pageFrom" id="wmPageFrom" class="wm-pages-field" value="1" min="1" oninput="window.mompdfWorkspace.updateWatermarkLivePreview()" />
          </div>
          <div class="wm-col wm-pages-input">
            <div class="wm-pages-label">to</div>
            <input type="number" name="pageTo" id="wmPageTo" class="wm-pages-field" value="15" min="1" oninput="window.mompdfWorkspace.updateWatermarkLivePreview()" />
          </div>
        </div>

        <div class="wm-label">Layer</div>
        <div class="wm-row" style="gap: 16px; margin-bottom: 0;">
          <label style="flex: 1; border: 1px solid #e53e3e; border-radius: 6px; padding: 16px; text-align: center; cursor: pointer; color: #e53e3e; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" onclick="document.querySelectorAll('.wm-layer-label').forEach(l => {l.style.borderColor='#e2e8f0'; l.style.color='#718096'; l.style.background='#f7fafc'}); this.style.borderColor='#e53e3e'; this.style.color='#e53e3e'; this.style.background='#fff';" class="wm-layer-label">
            <input type="radio" name="layer" value="over" checked style="display:none;" onchange="window.mompdfWorkspace.updateWatermarkLivePreview()" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin: 0 auto 8px;"><path d="M12 2L4 6l8 4 8-4-8-4zM4 10l8 4 8-4M4 14l8 4 8-4"/></svg>
            <div style="font-size: 13px; font-weight: 500; line-height: 1.2;">Over the PDF<br/>content</div>
          </label>
          <label style="flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; text-align: center; cursor: pointer; color: #718096; background: #f7fafc; transition: all 0.2s ease;" onclick="document.querySelectorAll('.wm-layer-label').forEach(l => {l.style.borderColor='#e2e8f0'; l.style.color='#718096'; l.style.background='#f7fafc'}); this.style.borderColor='#e53e3e'; this.style.color='#e53e3e'; this.style.background='#fff';" class="wm-layer-label">
            <input type="radio" name="layer" value="below" style="display:none;" onchange="window.mompdfWorkspace.updateWatermarkLivePreview()" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin: 0 auto 8px; opacity: 0.7;"><path d="M12 2L4 6l8 4 8-4-8-4zM4 10l8 4 8-4M4 14l8 4 8-4"/></svg>
            <div style="font-size: 13px; font-weight: 500; line-height: 1.2;">Below the PDF<br/>content</div>
          </label>
        </div>
      `,
      renderPreview: () => ''
    },
    add_pdf_page_number: {
      id: 'add_pdf_page_number',
      name: 'Page Numbers',
      badge: 'Edit',
      desc: 'Add page numbers to your PDF with custom placement, fonts, and styling.',
      actionLabel: `Add page numbers`,
      renderControls: () => `
        <style>
          #controlsPanelHeading { display: none; }
          .pn-title { font-size: 22px; font-weight: 700; color: #1e293b; text-align: center; margin-bottom: 12px; }
          .pn-divider { height: 1px; background: #e2e8f0; margin: 0 -24px 24px -24px; }
          .pn-label { font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px; }
          .pn-row { display: flex; gap: 16px; margin-bottom: 20px; }
          .pn-col { flex: 1; }
          
          #mainActionBtn {
            background-color: #dc2626 !important;
            color: #ffffff !important;
            border-radius: 8px !important;
            padding: 16px 20px !important;
            font-size: 18px !important;
            font-weight: 700 !important;
            box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2) !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            margin-top: 24px !important;
            width: 100% !important;
            transition: background-color 0.2s !important;
          }
          #mainActionBtn:hover {
            background-color: #b91c1c !important;
          }

          .pn-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); width: 64px; height: 64px; border: 1px solid #cbd5e0; background: #fff; gap: 0; }
          .pn-grid-cell { border-right: 1px dashed #cbd5e0; border-bottom: 1px dashed #cbd5e0; cursor: pointer; position: relative; }
          .pn-grid-cell:nth-child(3n) { border-right: none; }
          .pn-grid-cell:nth-child(n+7) { border-bottom: none; }
          .pn-grid-cell.active::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: #ef4444; border-radius: 50%; }
          
          .pn-input-group { display: flex; align-items: center; border: 1px solid #cbd5e0; border-radius: 4px; overflow: hidden; background: #fff; height: 36px; }
          .pn-input-label { padding: 0 10px; font-size: 13px; color: #475569; border-right: 1px solid #cbd5e0; background: #f8fafc; display: flex; align-items: center; height: 100%; white-space: nowrap; }
          .pn-input { width: 100%; border: none; padding: 0 10px; outline: none; font-size: 13px; color: #475569; height: 100%; background: #fff; }
          
          .pn-select { width: 100%; height: 36px; padding: 0 10px; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 13px; color: #475569; background: #fff; outline: none; cursor: pointer; appearance: auto; }
        </style>

        <div class="pn-title">Page Number options</div>
        <div class="pn-divider"></div>

        <div class="pn-label">Page mode</div>
        <div style="display:flex; gap:16px; margin-bottom:20px; align-items:center;">
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:13px; color:#475569;">
            <input type="radio" name="pageMode" value="single" checked onchange="document.getElementById('pnCoverPageContainer').style.display='none'; window.mompdfWorkspace.updatePageNumberLivePreview()" style="width:16px; height:16px; cursor:pointer; accent-color:#16a34a;" />
            Single page
          </label>
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:13px; color:#475569;">
            <input type="radio" name="pageMode" value="facing" onchange="document.getElementById('pnCoverPageContainer').style.display='flex'; window.mompdfWorkspace.updatePageNumberLivePreview()" style="width:16px; height:16px; cursor:pointer; accent-color:#16a34a;" />
            Facing pages
          </label>
        </div>
        <div id="pnCoverPageContainer" style="display:none; margin-bottom:20px;">
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:13px; color:#475569;">
            <input type="checkbox" name="coverPage" id="pnCoverPageCheck" value="true" onchange="window.mompdfWorkspace.updatePageNumberLivePreview()" style="width:16px; height:16px; cursor:pointer; accent-color:#16a34a;" />
            First page is cover page
          </label>
        </div>

        <div class="pn-row">
          <div class="pn-col" style="flex: 0 0 auto; width: auto;">
            <div class="pn-label">Position:</div>
            <div class="pn-grid">
              <div class="pn-grid-cell" onclick="window.mompdfWorkspace.setPnPosition('top_left', this)"></div>
              <div class="pn-grid-cell" onclick="window.mompdfWorkspace.setPnPosition('top_center', this)"></div>
              <div class="pn-grid-cell" onclick="window.mompdfWorkspace.setPnPosition('top_right', this)"></div>
              <div class="pn-grid-cell" onclick="window.mompdfWorkspace.setPnPosition('middle_left', this)"></div>
              <div class="pn-grid-cell" onclick="window.mompdfWorkspace.setPnPosition('center', this)"></div>
              <div class="pn-grid-cell" onclick="window.mompdfWorkspace.setPnPosition('middle_right', this)"></div>
              <div class="pn-grid-cell" onclick="window.mompdfWorkspace.setPnPosition('bottom_left', this)"></div>
              <div class="pn-grid-cell" onclick="window.mompdfWorkspace.setPnPosition('bottom_center', this)"></div>
              <div class="pn-grid-cell active" onclick="window.mompdfWorkspace.setPnPosition('bottom_right', this)"></div>
            </div>
            <input type="hidden" name="position" id="pnPositionInput" value="bottom_right" />
          </div>
          <div class="pn-col">
            <div class="pn-label">Margin:</div>
            <select name="margin" id="pnMarginInput" class="pn-select" onchange="const c=document.getElementById('pnCustomMarginContainer'); if(this.value==='custom') { c.style.display='block'; } else { c.style.display='none'; } window.mompdfWorkspace.updatePageNumberLivePreview()">
              <option value="28" selected>Recommended</option>
              <option value="14">Small</option>
              <option value="42">Medium</option>
              <option value="56">Large</option>
              <option value="custom">Custom</option>
            </select>
            <div id="pnCustomMarginContainer" style="display:none; margin-top:8px;">
               <input type="number" name="customMargin" id="pnCustomMarginInput" class="pn-input" style="border:1px solid #cbd5e0; height:32px; border-radius:4px;" placeholder="Margin (px)" oninput="window.mompdfWorkspace.updatePageNumberLivePreview()" />
            </div>
          </div>
        </div>

        <div class="pn-label">Pages</div>
        <div class="pn-row">
          <div class="pn-col">
            <div class="pn-input-group">
              <div class="pn-input-label">First number:</div>
              <input type="number" name="firstNumber" id="pnFirstNumber" class="pn-input" value="1" min="1" oninput="window.mompdfWorkspace.updatePageNumberLivePreview()" />
            </div>
          </div>
        </div>

        <div class="pn-label">Which pages do you want to number?</div>
        <div class="pn-row">
          <div class="pn-col">
            <div class="pn-input-group">
              <div class="pn-input-label">from page</div>
              <input type="number" name="pageFrom" id="pnPageFrom" class="pn-input" value="1" min="1" oninput="window.mompdfWorkspace.updatePageNumberLivePreview()" />
            </div>
          </div>
          <div class="pn-col">
            <div class="pn-input-group">
              <div class="pn-input-label">to</div>
              <input type="number" name="pageTo" id="pnPageTo" class="pn-input" value="" placeholder="e.g. 15" min="1" oninput="window.mompdfWorkspace.updatePageNumberLivePreview()" />
            </div>
          </div>
        </div>

        <div class="pn-label">Text:</div>
        <div style="margin-bottom:20px;">
          <select name="format" id="pnFormatInput" class="pn-select" onchange="const c=document.getElementById('pnCustomTextContainer'); if(this.value==='custom') { c.style.display='block'; } else { c.style.display='none'; } window.mompdfWorkspace.updatePageNumberLivePreview()">
            <option value="{n}" selected>Insert only page number (recommended)</option>
            <option value="Page {n}">Page {n}</option>
            <option value="Page {n} of {total}">Page {n} of {total}</option>
            <option value="custom">Custom text</option>
          </select>
        </div>
        <div id="pnCustomTextContainer" style="display:none; margin-bottom:20px;">
          <input type="text" name="customText" id="pnCustomTextInput" class="pn-select" placeholder="e.g. Doc - {n}" oninput="window.mompdfWorkspace.updatePageNumberLivePreview()" />
        </div>

        <div class="pn-label">Text format:</div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
          <select name="font" id="pnFontInput" class="pn-select" style="width: auto; padding:0 8px; height:28px;" onchange="window.mompdfWorkspace.updatePageNumberLivePreview()">
            <option value="Helvetica" selected>Arial</option>
            <option value="TimesRoman">Times New Roman</option>
            <option value="Courier">Courier</option>
          </select>

          <div style="display:flex; align-items:baseline; gap:2px; margin-left:4px;">
            <span style="font-weight:bold; font-size:14px; color:#475569;">T</span>
            <span style="font-weight:bold; font-size:10px; color:#475569;">T</span>
          </div>
          <select name="fontSize" id="pnFontSizeInput" class="pn-select" style="width: auto; padding:0 8px; height:28px;" onchange="window.mompdfWorkspace.updatePageNumberLivePreview()">
            <option value="8">8</option>
            <option value="11" selected>11</option>
            <option value="14">14</option>
            <option value="18">18</option>
            <option value="24">24</option>
          </select>

          <div style="display:flex; gap:2px; align-items:center; margin-left:8px;">
            <button type="button" id="pnBoldBtn" class="wm-btn-icon" style="font-weight:800; font-size:14px; color:#475569; padding:2px 6px;" onclick="window.mompdfWorkspace.togglePnFormat('bold')">B</button>
            <input type="hidden" name="isBold" id="pnIsBold" value="false" />

            <button type="button" id="pnItalicBtn" class="wm-btn-icon" style="font-style:italic; font-family:serif; font-weight:700; font-size:14px; color:#475569; padding:2px 6px;" onclick="window.mompdfWorkspace.togglePnFormat('italic')">I</button>
            <input type="hidden" name="isItalic" id="pnIsItalic" value="false" />

            <button type="button" id="pnUnderlineBtn" class="wm-btn-icon" style="text-decoration:underline; font-weight:700; font-size:14px; color:#475569; padding:2px 6px;" onclick="window.mompdfWorkspace.togglePnFormat('underline')">U</button>
            <input type="hidden" name="isUnderline" id="pnIsUnderline" value="false" />

            <label style="cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; width:28px; height:28px; position:relative; margin-left:8px;">
              <span style="font-weight:700; font-size:16px; color:#475569;">A</span>
              <div id="pnColorIndicator" style="width:14px; height:3px; background:#333; margin-top:-2px;"></div>
              <input type="color" name="color" id="pnColorInput" value="#333333" style="opacity:0; position:absolute; inset:0; width:100%; height:100%; cursor:pointer;" onchange="document.getElementById('pnColorIndicator').style.background = this.value; window.mompdfWorkspace.updatePageNumberLivePreview()" />
            </label>
          </div>
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
          <input type="password" name="password" id="protectPassword" class="control-input" placeholder="Enter password" required />
        </div>
        <div class="control-item">
          <div class="control-item-label">Confirm Password</div>
          <input type="password" id="protectConfirm" class="control-input" placeholder="Re-enter password" required oninput="if(this.value !== document.getElementById('protectPassword').value) { this.setCustomValidity('Passwords do not match'); } else { this.setCustomValidity(''); }" />
        </div>
        <div class="control-item" style="margin-top:20px;">
          <div class="control-item-label" style="margin-bottom:10px;">Permissions (Optional)</div>
          <label style="display:flex; align-items:center; gap:8px; margin-bottom:8px; cursor:pointer; font-size:14px; color:#475569;">
            <input type="checkbox" name="allowPrinting" value="true" checked style="width:16px; height:16px; accent-color:var(--primary);" />
            Allow Printing
          </label>
          <label style="display:flex; align-items:center; gap:8px; margin-bottom:8px; cursor:pointer; font-size:14px; color:#475569;">
            <input type="checkbox" name="allowCopying" value="true" checked style="width:16px; height:16px; accent-color:var(--primary);" />
            Allow Copying Text
          </label>
          <label style="display:flex; align-items:center; gap:8px; margin-bottom:8px; cursor:pointer; font-size:14px; color:#475569;">
            <input type="checkbox" name="allowModifying" value="true" style="width:16px; height:16px; accent-color:var(--primary);" />
            Allow Editing (Modify/Annotate)
          </label>
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
          <div class="control-item-label">Organize Actions</div>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">
            <button type="button" onclick="window.mompdfWorkspace.sortOrganize(1)" style="flex:1; padding:8px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:4px; cursor:pointer;">Sort 1→9</button>
            <button type="button" onclick="window.mompdfWorkspace.sortOrganize(-1)" style="flex:1; padding:8px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:4px; cursor:pointer;">Sort 9→1</button>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button type="button" onclick="document.getElementById('addPageInput').click()" style="flex:1; padding:8px; background:#f8fafc; border:1px dashed #94a3b8; border-radius:4px; cursor:pointer; font-weight:600; color:var(--primary);">+ Add Page</button>
            <input type="file" id="addPageInput" style="display:none;" accept="application/pdf" onchange="window.mompdfWorkspace.addOrganizePage(event)">
            <button type="button" onclick="window.mompdfWorkspace.resetOrganize()" style="flex:1; padding:8px; background:#fef2f2; border:1px solid #fecaca; border-radius:4px; cursor:pointer; color:#dc2626;">Reset Settings</button>
          </div>
          <p style="font-size:12px; color:var(--text-muted); margin-top:12px;">Drag pages to reorder. Click rotate (↻) or delete (×) on each page.</p>
        </div>
      `,
      renderPreview: () => `
        <div id="organizePreviewContainer" style="display:flex; flex-wrap:wrap; gap:20px; padding:20px; width:100%; min-height:400px; align-content:flex-start; background:#F8FAFC; border-radius:8px;">
          <div style="width:100%; text-align:center; padding:40px; color:#94a3b8; font-weight:600;">Loading pages...</div>
        </div>
      `
    },
    remove_pages: {
      id: 'remove_pages',
      name: 'Remove PDF Pages',
      badge: 'Organize',
      desc: 'Select and permanently delete unwanted pages from your PDF file.',
      actionLabel: 'Remove Selected Pages',
      renderControls: () => `
        <div class="control-item">
          <div class="control-item-label">Modify Pages</div>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">Click the <b>Remove (×)</b> button on any page preview to delete it instantly.</p>
          <button type="button" onclick="window.mompdfWorkspace.addRemoveBlankPage()" style="width:100%; padding:10px; background:#f8fafc; border:1px dashed #94a3b8; border-radius:4px; cursor:pointer; font-weight:600; color:var(--primary); transition:background 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">+ Add New Blank Page</button>
        </div>
      `,
      renderPreview: () => `
        <div id="removePreviewContainer" style="display:flex; flex-wrap:wrap; gap:20px; padding:20px; width:100%; min-height:400px; align-content:flex-start; background:#F8FAFC; border-radius:8px;">
          <div style="width:100%; text-align:center; padding:40px; color:#94a3b8; font-weight:600;">Loading pages...</div>
        </div>
      `
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
      actionLabel: 'Convert to Excel',
      renderControls: () => `
        <div class="control-item">
          <div class="option-cards-group" style="display:flex; flex-direction:column; gap:0; border:1px solid var(--border-color); border-radius:8px; overflow:hidden;">
            <div class="option-card active" onclick="selectOptionCard(this, 'ocr', 'false'); this.style.background='#F8FAFC'; this.querySelector('.check-icon').style.display='flex'; this.nextElementSibling.style.background='transparent'; this.nextElementSibling.querySelector('.check-icon').style.display='none';" style="border:none; border-bottom:1px solid var(--border-color); border-radius:0; padding:16px; display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; cursor:pointer;">
              <input type="radio" name="ocr" value="false" checked style="display:none;" />
              <div>
                <div class="option-card-title" style="color:#E11D48; font-size:15px; font-weight:600;">Standard Mode</div>
                <div class="option-card-desc" style="margin-top:4px; font-size:14px; color:var(--text-main);">Convert PDFs with selectable text into editable Excel files.</div>
              </div>
              <div class="check-icon" style="width:24px; height:24px; border-radius:50%; background:#10B981; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-left:15px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
            <div class="option-card" onclick="selectOptionCard(this, 'ocr', 'true'); this.style.background='#F8FAFC'; this.querySelector('.check-icon').style.display='flex'; this.previousElementSibling.style.background='transparent'; this.previousElementSibling.querySelector('.check-icon').style.display='none';" style="border:none; border-radius:0; padding:16px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; background:transparent;">
              <input type="radio" name="ocr" value="true" style="display:none;" />
              <div>
                <div class="option-card-title" style="color:#E11D48; font-size:15px; font-weight:600; display:flex; align-items:center; gap:8px;">
                  OCR Mode
                </div>
                <div class="option-card-desc" style="margin-top:4px; font-size:14px; color:var(--text-main);">Convert scanned PDFs with non-selectable text into editable Excel files.</div>
              </div>
              <div class="check-icon" style="width:24px; height:24px; border-radius:50%; background:#10B981; display:none; align-items:center; justify-content:center; flex-shrink:0; margin-left:15px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

        <div class="control-item" style="margin-top:24px; border-top:1px solid var(--border-color); padding-top:20px;">
          <div class="control-item-label" style="font-size:14px; font-weight:700; color:var(--text-main); margin-bottom:12px;">Layout: <span style="color:#E11D48; cursor:help; font-weight:normal;" title="Choose how output sheets are organized">ⓘ</span></div>
          <div class="option-cards-group" style="display:flex; gap:12px;">
            <div class="option-card" onclick="selectOptionCard(this, 'layout', 'one_sheet'); this.style.borderColor='#E11D48'; this.style.background='#fff'; this.nextElementSibling.style.borderColor='transparent'; this.nextElementSibling.style.background='#F8FAFC';" style="flex:1; padding:12px 10px; text-align:center; border-radius:6px; background:#F8FAFC; justify-content:center;">
              <input type="radio" name="layout" value="one_sheet" style="display:none;" />
              <div style="font-size:14px; color:var(--text-muted);">One sheet</div>
            </div>
            <div class="option-card active" onclick="selectOptionCard(this, 'layout', 'multiple_sheets'); this.style.borderColor='#E11D48'; this.style.background='#fff'; this.previousElementSibling.style.borderColor='transparent'; this.previousElementSibling.style.background='#F8FAFC';" style="flex:1; padding:12px 10px; text-align:center; border-color:#E11D48; border-radius:6px; background:#fff; justify-content:center;">
              <input type="radio" name="layout" value="multiple_sheets" checked style="display:none;" />
              <div style="font-size:14px; color:#E11D48;">Multiple sheets</div>
            </div>
          </div>
        </div>
      `
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
        <style>
          .ocr-info-card { background: #FDF4FF; border: 1px solid #F5D0FE; border-radius: 10px; padding: 20px 22px; margin-bottom: 24px; }
          .ocr-info-card .ocr-info-icon { display: flex; align-items: flex-start; gap: 14px; }
          .ocr-info-card .ocr-info-icon svg { min-width: 22px; color: #D946EF; margin-top: 2px; }
          .ocr-info-card h4 { font-size: 15px; font-weight: 700; color: #4A044E; margin: 0 0 6px; }
          .ocr-info-card p { font-size: 13.5px; color: #701A75; line-height: 1.6; margin: 0; }
          
          .ocr-section-label { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
          .ocr-select-wrapper { position: relative; margin-bottom: 24px; }
          .ocr-select-wrapper select { width: 100%; padding: 13px 40px 13px 16px; border: 2px solid #E2E8F0; border-radius: 10px; font-size: 15px; font-weight: 600; color: #334155; background: #fff; appearance: none; cursor: pointer; outline: none; transition: border-color 0.2s; }
          .ocr-select-wrapper select:focus { border-color: #D946EF; box-shadow: 0 0 0 3px rgba(217,70,239,0.12); }
          .ocr-select-wrapper::after { content: ''; position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #64748B; pointer-events: none; }
          
          .ocr-pages-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px; margin-bottom: 24px; }
          .ocr-radio-group { display: flex; flex-direction: column; gap: 12px; }
          .ocr-radio-label { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer; }
          .ocr-radio-label input[type="radio"] { width: 18px; height: 18px; accent-color: #D946EF; cursor: pointer; }
          .ocr-range-input { display: none; margin-top: 12px; }
          .ocr-range-input input { width: 100%; padding: 10px 14px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s; }
          .ocr-range-input input:focus { border-color: #D946EF; }
          .ocr-range-help { font-size: 12px; color: #64748B; margin-top: 6px; }
        </style>

        <div class="ocr-info-card">
          <div class="ocr-info-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path>
            </svg>
            <div>
              <h4>Optical Character Recognition</h4>
              <p>Extract text from scanned PDFs. The tool will add a selectable, searchable text layer while preserving the original layout and images.</p>
            </div>
          </div>
        </div>

        <div class="ocr-section-label">Select Document Language</div>
        <div class="ocr-select-wrapper">
          <select name="language" id="ocrLanguage">
            <option value="eng" selected>English</option>
            <option value="hin">Hindi (हिन्दी)</option>
            <option value="hin_eng">Hindi + English (Mixed)</option>
          </select>
        </div>

        <div class="ocr-pages-card">
          <div class="ocr-section-label" style="margin-bottom:14px;">Pages to Process</div>
          <div class="ocr-radio-group">
            <label class="ocr-radio-label" onclick="document.getElementById('ocrRangeGroup').style.display='none'; window.mompdfWorkspace.ocrUpdateAdvancedRanges('all');">
              <input type="radio" name="pageMode" value="all" checked /> All Pages
            </label>
            <label class="ocr-radio-label" onclick="document.getElementById('ocrRangeGroup').style.display='block'; window.mompdfWorkspace.ocrUpdateAdvancedRanges('custom');">
              <input type="radio" name="pageMode" value="custom" /> Custom Pages
            </label>
            <div class="ocr-range-input" id="ocrRangeGroup">
              <input type="text" id="ocrCustomRanges" placeholder="e.g., 1, 3-5, 8" oninput="window.mompdfWorkspace.ocrUpdateAdvancedRanges('custom')" />
              <div class="ocr-range-help">Enter page numbers and/or ranges separated by commas.</div>
            </div>
          </div>
          <!-- Hidden field to carry advancedRanges data to the backend -->
          <input type="hidden" name="advancedRanges" id="ocrAdvancedRanges" value='{"mode":"all","ranges":[]}' />
        </div>
      `,
      renderPreview: (tool, files) => {
        if (!files || files.length === 0) return '';
        const f = files[0];
        const sizeStr = f.size > 1048576 ? (f.size / 1048576).toFixed(1) + ' MB' : Math.round(f.size / 1024) + ' KB';
        return `
          <div style="background:#fff; border:1px solid var(--border-color); border-radius:12px; padding:40px; text-align:center; box-shadow:var(--shadow-md); max-width:420px; width:100%;">
            <div style="width:64px; height:64px; border-radius:16px; background:linear-gradient(135deg, #FDF4FF, #FAE8FF); display:flex; align-items:center; justify-content:center; margin:0 auto 18px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D946EF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <h4 style="font-size:16px; font-weight:700; color:var(--text-main); margin:0 0 6px; word-break:break-all;">${f.name}</h4>
            <p style="font-size:13px; color:var(--text-muted); margin:0 0 16px;">Size: ${sizeStr}</p>
            <div style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #FDF4FF, #FDF4FF); border:1px solid #F5D0FE; border-radius:8px; padding:10px 18px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D946EF" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span style="font-size:13px; font-weight:600; color:#A21CAF;">Ready for OCR Analysis</span>
            </div>
          </div>
        `;
      }
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
      actionLabel: 'Convert to PDF/A',
      renderControls: () => `
        <style>
          .pdfa-info-card { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 20px 22px; margin-bottom: 24px; }
          .pdfa-info-card .pdfa-info-icon { display: flex; align-items: flex-start; gap: 14px; }
          .pdfa-info-card .pdfa-info-icon svg { min-width: 22px; color: #3B82F6; margin-top: 2px; }
          .pdfa-info-card h4 { font-size: 15px; font-weight: 700; color: #1E3A5F; margin: 0 0 6px; }
          .pdfa-info-card p { font-size: 13.5px; color: #475569; line-height: 1.6; margin: 0; }

          .pdfa-section-label { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }

          .pdfa-select-wrapper { position: relative; margin-bottom: 20px; }
          .pdfa-select-wrapper select { width: 100%; padding: 13px 40px 13px 16px; border: 2px solid #E2E8F0; border-radius: 10px; font-size: 15px; font-weight: 600; color: #334155; background: #fff; appearance: none; cursor: pointer; outline: none; transition: border-color 0.2s; }
          .pdfa-select-wrapper select:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
          .pdfa-select-wrapper::after { content: ''; position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #64748B; pointer-events: none; }

          .pdfa-level-desc { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px 18px; margin-bottom: 20px; }
          .pdfa-level-desc .pdfa-level-base { font-size: 13px; color: #64748B; margin-bottom: 10px; line-height: 1.5; }
          .pdfa-level-desc ul { margin: 0; padding: 0 0 0 20px; }
          .pdfa-level-desc ul li { font-size: 13px; color: #475569; margin-bottom: 6px; line-height: 1.5; }
          .pdfa-level-desc ul li:last-child { margin-bottom: 0; }

          .pdfa-downgrade-card { display: flex; align-items: flex-start; gap: 14px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 16px 18px; cursor: pointer; transition: all 0.2s; }
          .pdfa-downgrade-card:hover { border-color: #86EFAC; background: #ECFDF5; }
          .pdfa-downgrade-card input[type="checkbox"] { width: 20px; height: 20px; margin-top: 2px; accent-color: #16A34A; cursor: pointer; flex-shrink: 0; }
          .pdfa-downgrade-card .pdfa-dg-text h5 { font-size: 14px; font-weight: 700; color: #166534; margin: 0 0 4px; }
          .pdfa-downgrade-card .pdfa-dg-text p { font-size: 12.5px; color: #4B5563; line-height: 1.5; margin: 0; }
        </style>

        <div class="pdfa-info-card">
          <div class="pdfa-info-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <div>
              <h4>PDF/A is an ISO-standardized version of the Portable Document Format (PDF)</h4>
              <p>Specialized for use in the archiving and long-term preservation of electronic documents. Choose with what conformance level you want to convert your document:</p>
            </div>
          </div>
        </div>

        <div class="pdfa-section-label">Set the PDF/A conformance level</div>

        <div class="pdfa-select-wrapper">
          <select name="conformance" id="pdfaConformanceSelect" onchange="window.mompdfUpdatePdfaDesc && window.mompdfUpdatePdfaDesc(this.value)">
            <option value="pdfa-1b">PDF/A-1b</option>
            <option value="pdfa-2b" selected>PDF/A-2b</option>
            <option value="pdfa-3b">PDF/A-3b</option>
          </select>
        </div>

        <div class="pdfa-level-desc" id="pdfaLevelDesc">
          <div class="pdfa-level-base">Based on PDF 1.7 (ISO 32000-1). Level B (basic) conformance requirements plus new features:</div>
          <ul>
            <li>JPEG 2000 image compression</li>
            <li>Support for transparency effects and layers</li>
            <li>Embedding of OpenType fonts</li>
            <li>Provisions for digital signatures in accordance with the PDF Advanced Electronic Signatures</li>
            <li>The option of embedding PDF/A files to facilitate archiving of sets of documents with a single file</li>
          </ul>
        </div>

        <label class="pdfa-downgrade-card" onclick="event.stopPropagation();">
          <input type="hidden" name="allowDowngrade" value="false" />
          <input type="checkbox" name="allowDowngrade" value="true" checked />
          <div class="pdfa-dg-text">
            <h5>Allow Downgrade of PDF/A Compliance Level</h5>
            <p>In order to convert to PDF/A, when certain elements are found in the original PDF, it's possible that a conformance downgrade is needed to be able to perform the conversion.</p>
          </div>
        </label>
      `,
      renderPreview: (tool, files) => {
        if (!files || files.length === 0) return '';
        const f = files[0];
        const sizeStr = f.size > 1048576 ? (f.size / 1048576).toFixed(1) + ' MB' : Math.round(f.size / 1024) + ' KB';
        return `
          <div style="background:#fff; border:1px solid var(--border-color); border-radius:12px; padding:40px; text-align:center; box-shadow:var(--shadow-md); max-width:420px; width:100%;">
            <div style="width:64px; height:64px; border-radius:16px; background:linear-gradient(135deg, #EFF6FF, #DBEAFE); display:flex; align-items:center; justify-content:center; margin:0 auto 18px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h4 style="font-size:16px; font-weight:700; color:var(--text-main); margin:0 0 6px; word-break:break-all;">${f.name}</h4>
            <p style="font-size:13px; color:var(--text-muted); margin:0 0 16px;">Size: ${sizeStr}</p>
            <div style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #EFF6FF, #F0F9FF); border:1px solid #BFDBFE; border-radius:8px; padding:10px 18px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path></svg>
              <span style="font-size:13px; font-weight:600; color:#1D4ED8;">Converting to PDF/A archival format</span>
            </div>
          </div>
        `;
      }
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

  window.generatePdfThumbnail = async function (file, containerId, targetWidth = 220) {
    const container = document.getElementById(containerId);
    if (!container || !file || file.type !== 'application/pdf') {
      if (container) container.innerHTML = `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
      return;
    }

    if (!window.pdfjsLib) {
      await new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
        s.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
          resolve();
        };
        document.head.appendChild(s);
      });
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1.0 });
      const scale = targetWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale: scale });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      canvas.style.display = 'block';

      await page.render({
        canvasContext: ctx,
        viewport: scaledViewport
      }).promise;

      if (document.getElementById(containerId)) {
        const c = document.getElementById(containerId);
        c.innerHTML = '';
        c.appendChild(canvas);
      }

      pdf.destroy();
    } catch (err) {
      console.warn("Could not generate thumbnail:", err);
      if (document.getElementById(containerId)) {
        document.getElementById(containerId).innerHTML = `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>`;
      }
    }
  };

  window.generateAllPdfPagesThumbnails = async function (file, containerId, targetWidth = 180) {
    const container = document.getElementById(containerId);
    if (!container || !file || file.type !== 'application/pdf') return 0;

    container.innerHTML = `<div style="padding: 20px; font-weight: bold; color: #475569;">Loading preview...</div>`;

    if (!window.pdfjsLib) {
      await new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
        s.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
          resolve();
        };
        document.head.appendChild(s);
      });
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      container.innerHTML = '';
      
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = targetWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';
        canvas.style.border = '1px solid #e2e8f0';

        await page.render({
          canvasContext: ctx,
          viewport: scaledViewport
        }).promise;

        const pageWrapper = document.createElement('div');
        pageWrapper.className = 'pdf-page-wrapper';
        pageWrapper.style.position = 'relative';
        pageWrapper.style.margin = '10px';
        pageWrapper.style.background = '#fff';
        pageWrapper.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        pageWrapper.style.transition = 'transform 0.3s ease, margin 0.3s ease';
        
        // Live preview overlay container
        const pnLiveContainer = document.createElement('div');
        pnLiveContainer.className = 'livePreviewOverlayContainer';
        pnLiveContainer.style.position = 'absolute';
        pnLiveContainer.style.inset = '0';
        pnLiveContainer.style.pointerEvents = 'none';
        pnLiveContainer.style.zIndex = '20';
        pnLiveContainer.style.overflow = 'hidden';

        pageWrapper.appendChild(canvas);
        pageWrapper.appendChild(pnLiveContainer);
        container.appendChild(pageWrapper);
      }

      pdf.destroy();
      return totalPages;
    } catch (err) {
      console.warn("Could not generate thumbnails:", err);
      container.innerHTML = `<div style="padding: 20px; color: #E11D48;">Failed to load PDF preview.</div>`;
      return 0;
    }
  };

  window.generateOrganizePdfThumbnails = async function (file, containerId, targetWidth = 180) {
    const container = document.getElementById(containerId);
    if (!container || !file || file.type !== 'application/pdf') return;

    container.innerHTML = `<div style="padding: 20px; font-weight: bold; color: #475569; width:100%; text-align:center;">Loading Organize Preview...</div>`;

    if (!window.pdfjsLib) {
      await new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
        s.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
          resolve();
        };
        document.head.appendChild(s);
      });
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const state = {
        pdfDocument: pdf,
        pages: new Array(pdf.numPages)
      };
      
      const renderPage = async (i) => {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = targetWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';

        await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
        
        state.pages[i - 1] = {
          id: `org_page_${0}_${i}_${Date.now()}`,
          fileIndex: 0,
          pageIndex: i - 1, // 0-indexed
          rotation: 0,
          canvas: canvas
        };
        
        // Progress indication
        const progress = Math.round((i / pdf.numPages) * 100);
        if (container.querySelector('#orgLoadingText')) {
            container.querySelector('#orgLoadingText').innerText = `Loading pages... ${progress}%`;
        } else {
            container.innerHTML = `<div id="orgLoadingText" style="padding: 20px; font-weight: bold; color: #475569; width:100%; text-align:center;">Loading pages... ${progress}%</div>`;
        }
      };

      const concurrencyLimit = 5;
      for (let i = 1; i <= pdf.numPages; i += concurrencyLimit) {
        const promises = [];
        for (let j = 0; j < concurrencyLimit && (i + j) <= pdf.numPages; j++) {
            promises.push(renderPage(i + j));
        }
        await Promise.all(promises);
      }
      
      window.mompdfWorkspace.organizeState = state;
      window.mompdfWorkspace.renderOrganizeGrid(containerId);
    } catch (err) {
      console.warn("Could not generate organize thumbnails:", err);
      container.innerHTML = `<div style="padding: 20px; color: #E11D48; width:100%; text-align:center;">Failed to load PDF preview.</div>`;
    }
  };

  window.generateRemovePdfThumbnails = async function (file, containerId, targetWidth = 180) {
    const container = document.getElementById(containerId);
    if (!container || !file || file.type !== 'application/pdf') return;

    container.innerHTML = `<div style="padding: 20px; font-weight: bold; color: #475569; width:100%; text-align:center;">Loading Preview...</div>`;

    if (!window.pdfjsLib) {
      await new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
        s.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
          resolve();
        };
        document.head.appendChild(s);
      });
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const state = {
        pdfDocument: pdf,
        pages: new Array(pdf.numPages)
      };
      
      const renderPage = async (i) => {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = targetWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';

        await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
        
        state.pages[i - 1] = {
          id: `remove_page_${0}_${i}_${Date.now()}`,
          originalIndex: i - 1,
          isBlank: false,
          canvas: canvas
        };
        
        const progress = Math.round((i / pdf.numPages) * 100);
        if (container.querySelector('#rmLoadingText')) {
            container.querySelector('#rmLoadingText').innerText = `Loading pages... ${progress}%`;
        } else {
            container.innerHTML = `<div id="rmLoadingText" style="padding: 20px; font-weight: bold; color: #475569; width:100%; text-align:center;">Loading pages... ${progress}%</div>`;
        }
      };

      const concurrencyLimit = 5;
      for (let i = 1; i <= pdf.numPages; i += concurrencyLimit) {
        const promises = [];
        for (let j = 0; j < concurrencyLimit && (i + j) <= pdf.numPages; j++) {
            promises.push(renderPage(i + j));
        }
        await Promise.all(promises);
      }
      
      window.mompdfWorkspace.removeState = state;
      window.mompdfWorkspace.renderRemoveGrid(containerId);
    } catch (err) {
      console.warn("Could not generate remove thumbnails:", err);
      container.innerHTML = `<div style="padding: 20px; color: #E11D48; width:100%; text-align:center;">Failed to load PDF preview.</div>`;
    }
  };

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

  // PDF/A conformance level description updater
  window.mompdfUpdatePdfaDesc = function (val) {
    const descEl = document.getElementById('pdfaLevelDesc');
    if (!descEl) return;

    const descriptions = {
      'pdfa-1b': {
        base: 'Based on PDF 1.4 (ISO 19005-1). Level B (basic) conformance for visual appearance preservation:',
        items: [
          'All fonts must be embedded in the document',
          'Color spaces must be device-independent (ICC profiles)',
          'Encryption and password protection not allowed',
          'Audio and video content not permitted',
          'JavaScript and executable file launches prohibited'
        ]
      },
      'pdfa-2b': {
        base: 'Based on PDF 1.7 (ISO 32000-1). Level B (basic) conformance requirements plus new features:',
        items: [
          'JPEG 2000 image compression',
          'Support for transparency effects and layers',
          'Embedding of OpenType fonts',
          'Provisions for digital signatures in accordance with the PDF Advanced Electronic Signatures',
          'The option of embedding PDF/A files to facilitate archiving of sets of documents with a single file'
        ]
      },
      'pdfa-3b': {
        base: 'Based on PDF 1.7 (ISO 32000-1). Level B (basic) conformance with maximum flexibility:',
        items: [
          'All PDF/A-2b features are included',
          'Allows embedding of any file format (XML, CSV, CAD, spreadsheets, etc.)',
          'Ideal for hybrid archiving with machine-readable data',
          'Supports ZUGFeRD and Factur-X electronic invoicing standards',
          'Perfect for documents that need associated source data files'
        ]
      }
    };

    const desc = descriptions[val] || descriptions['pdfa-2b'];
    descEl.innerHTML = `
      <div class="pdfa-level-base">${desc.base}</div>
      <ul>${desc.items.map(item => '<li>' + item + '</li>').join('')}</ul>
    `;
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

    ocrUpdateAdvancedRanges(mode) {
      const state = { mode: mode, ranges: [] };
      if (mode === 'custom') {
        const input = document.getElementById('ocrCustomRanges');
        if (input && input.value.trim() !== '') {
          const parts = input.value.split(',');
          for (let p of parts) {
            p = p.trim();
            if (!p) continue;
            if (p.includes('-')) {
              const [start, end] = p.split('-');
              state.ranges.push({ from: parseInt(start, 10), to: parseInt(end, 10) });
            } else {
              const val = parseInt(p, 10);
              state.ranges.push({ from: val, to: val });
            }
          }
        }
      }
      const hidden = document.getElementById('ocrAdvancedRanges');
      if (hidden) hidden.value = JSON.stringify(state);
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

            <!-- AI Summary View -->
            <div id="aiSummaryStage" style="display:none; width:100%; max-width:800px; margin:0 auto; padding-bottom: 40px;">
              <div style="background:#fff; border-radius:12px; border:1px solid #E2E8F0; padding:32px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid #F1F5F9;">
                  <div style="background:linear-gradient(135deg, #FDF4FF, #FAE8FF); padding:10px; border-radius:10px; color:#D946EF;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                  </div>
                  <div>
                    <h2 style="font-size:20px; font-weight:700; color:#1e293b; margin:0;">AI Summary</h2>
                    <p style="font-size:13px; color:#64748B; margin:0;" id="aiSummaryFileInfo">Processed document</p>
                  </div>
                </div>

                <div id="aiSummaryContent" style="font-size:15px; line-height:1.7; color:#334155; margin-bottom:32px; white-space: pre-wrap;">
                  <!-- Summary will be injected here -->
                </div>

                <div style="display:flex; gap:12px; margin-bottom:40px; flex-wrap:wrap;">
                  <button type="button" onclick="window.mompdfWorkspace.copyAISummary()" style="background:#F8FAFC; border:1px solid #E2E8F0; padding:8px 16px; border-radius:6px; font-size:13px; font-weight:600; color:#475569; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copy Summary
                  </button>
                  <a id="aiDownloadTxtBtn" href="#" style="background:#F8FAFC; border:1px solid #E2E8F0; padding:8px 16px; border-radius:6px; font-size:13px; font-weight:600; color:#475569; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Download TXT
                  </a>
                  <a id="aiDownloadPdfBtn" href="#" style="background:#F8FAFC; border:1px solid #E2E8F0; padding:8px 16px; border-radius:6px; font-size:13px; font-weight:600; color:#475569; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download PDF
                  </a>
                </div>

                <div style="border-top:1px dashed #CBD5E1; margin:0 -32px; margin-bottom:32px;"></div>

                <div style="margin-bottom:16px;">
                  <h3 style="font-size:16px; font-weight:700; color:#1e293b; margin:0 0 4px;">Ask Anything about this PDF</h3>
                  <p style="font-size:13px; color:#64748B; margin:0;">Have follow-up questions? Ask the AI.</p>
                </div>

                <div id="aiChatHistory" style="display:flex; flex-direction:column; gap:16px; margin-bottom:20px; max-height:400px; overflow-y:auto; padding-right:10px;">
                  <!-- Chat messages inject here -->
                </div>

                <div style="display:flex; gap:10px;">
                  <input type="text" id="aiQuestionInput" placeholder="Ask a question about your PDF..." style="flex:1; padding:12px 16px; border:1px solid #CBD5E1; border-radius:8px; font-size:14px; outline:none;" onkeypress="if(event.key === 'Enter') window.mompdfWorkspace.askAIQuestion()" />
                  <button type="button" id="aiAskBtn" onclick="window.mompdfWorkspace.askAIQuestion()" style="background:#4A044E; color:#fff; border:none; padding:0 24px; border-radius:8px; font-weight:600; font-size:14px; cursor:pointer;">
                    Ask
                  </button>
                </div>
                
                <div style="margin-top:32px; text-align:center;">
                  <button type="button" onclick="window.mompdfWorkspace.startOver()" style="background:transparent; border:none; color:#3B82F6; font-size:14px; font-weight:600; cursor:pointer; text-decoration:underline;">
                    Summarize Another PDF
                  </button>
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

      // Check if tool expects non-PDF inputs
      const nonPdfTools = ['word_to_pdf', 'excel_to_pdf', 'powerpoint_to_pdf', 'image_to_pdf', 'html_to_pdf', 'jpg_to_pdf'];
      const expectsPdf = !nonPdfTools.includes(this.toolId);

      const validFiles = expectsPdf
        ? this.files.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
        : this.files;

      if (validFiles.length < this.files.length) {
        if (this.showToast) this.showToast(expectsPdf ? 'Non-PDF files were ignored.' : 'Invalid files were ignored.');
      }
      this.files = validFiles;

      if (this.files.length === 0) {
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
        let html = '';
        if (this.toolDef.multiFile) {
          html = `<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:20px; padding:20px; width:100%;">`;
          this.files.forEach((f, i) => {
            const thumbId = 'thumb_' + Math.random().toString(36).substr(2, 9);
            html += `
              <div id="previewCard_${i}" style="background:#fff; border-radius:8px; padding:12px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.05); width:260px; position:relative; transition:transform 0.3s ease;">
                <div class="page-order-badge" style="position:absolute; top:-10px; left:-10px; background:var(--primary); color:#fff; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; box-shadow:0 2px 4px rgba(0,0,0,0.1); z-index:10;">#${i + 1}</div>
                <div id="${thumbId}" style="min-height:280px; display:flex; align-items:center; justify-content:center; background:#F8FAFC; margin-bottom:12px; border:1px solid #E2E8F0; overflow:hidden; border-radius:4px;">
                  <div class="spinner" style="width:24px; height:24px; border:3px solid var(--border-color); border-top:3px solid var(--primary); border-radius:50%; animation:spin 1s linear infinite;"></div>
                </div>
                <div style="font-size:13px; font-weight:500; color:#475569; word-break:break-all; padding:0 4px;">
                  ${escapeHtml(f.name)}
                </div>
              </div>
            `;
            setTimeout(() => window.generatePdfThumbnail(f, thumbId, 240), 0);
          });
          html += `</div>`;
        } else {
          // Single file view (or tool specifically requiring single file)
          html = `
            <div style="display:flex; justify-content:center; align-items:flex-start; width:100%; height:100%; padding:20px;">
              <div id="mainPreviewCard" style="background:#fff; border-radius:8px; padding:12px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.05); max-width:800px; width:100%; position:relative; transition:transform 0.3s ease;">
                
                <!-- Action Buttons: Delete & Add -->
                <div style="position:absolute; top:-12px; right:-12px; display:flex; gap:8px; z-index:50;">
                  <button type="button" onclick="document.getElementById('fileInput').click()" style="width:36px; height:36px; border-radius:50%; background:#fff; border:1px solid #e2e8f0; color:#3b82f6; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 4px rgba(0,0,0,0.1);" title="Add/Change PDF">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                  <button type="button" onclick="window.mompdfWorkspace.files=[]; window.mompdfWorkspace.resetWorkspace();" style="width:36px; height:36px; border-radius:50%; background:#fff; border:1px solid #e2e8f0; color:#ef4444; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 4px rgba(0,0,0,0.1);" title="Delete PDF">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>

                <div id="editLiveOverlay" style="display:none; position:absolute; top:20%; left:50%; transform:translate(-50%, 0); background:#FEF9C3; border:1px solid #E11D48; border-radius:4px; padding:6px 12px; font-weight:700; color:#E11D48; font-size:16px; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.1); z-index:20;">Approved &amp; Verified</div>
                
                <div style="position:relative; margin-bottom:12px;">
                  <div id="singlePreviewContainer" style="min-height:340px; display:flex; align-items:center; justify-content:center; flex-wrap:wrap; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; overflow:hidden;">
                    <div class="spinner" style="width:24px; height:24px; border:3px solid var(--border-color); border-top:3px solid var(--primary); border-radius:50%; animation:spin 1s linear infinite;"></div>
                  </div>
                  <!-- Isolated Watermark Overlay container -->
                  <div id="wmLiveContainer" style="display:none; position:absolute; inset:0; pointer-events:none; z-index:20; overflow:hidden;"></div>
                </div>

                <div style="font-size:14px; font-weight:500; color:#475569; word-break:break-all; padding:0 8px;">
                  ${escapeHtml(this.files[0].name)}
                </div>
              </div>
            </div>
          `;

          if (this.toolId === 'add_pdf_page_number' || this.toolId === 'pdf_add_watermark' || this.toolId === 'rotate_pdf') {
            setTimeout(async () => {
              const total = await window.generateAllPdfPagesThumbnails(this.files[0], 'singlePreviewContainer', 200);
              
              if (this.toolId === 'add_pdf_page_number') {
                const pTo = document.getElementById('pnPageTo');
                if (pTo && total > 0) pTo.value = total;
                this.updatePageNumberLivePreview();
              } else if (this.toolId === 'pdf_add_watermark') {
                const wmTo = document.getElementById('wmPageTo');
                if (wmTo && total > 0) wmTo.value = total;
                this.updateWatermarkLivePreview();
              }
            }, 0);
          } else if (this.toolId === 'organize_pdf') {
            setTimeout(() => window.generateOrganizePdfThumbnails(this.files[0], 'singlePreviewContainer', 180), 0);
          } else if (this.toolId === 'remove_pages') {
            setTimeout(() => window.generateRemovePdfThumbnails(this.files[0], 'singlePreviewContainer', 180), 0);
          } else {
            setTimeout(() => window.generatePdfThumbnail(this.files[0], 'singlePreviewContainer', 300), 0);
          }
        }

        html += `
          <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        `;

        canvasArea.innerHTML = html;

        // Initial setup for specific tools on the unified card
        if (this.toolId === 'pdf_add_watermark') {
          const wm = document.getElementById('wmLiveContainer');
          if (wm) wm.style.display = 'block';
          setTimeout(() => this.updateWatermarkLivePreview(), 100);
        }
        if (this.toolId === 'edit_pdf') {
          const ed = document.getElementById('editLiveOverlay');
          if (ed) ed.style.display = 'block';
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

    setWatermarkModeUI(mode) {
      document.getElementById('wmModeInput').value = mode;
      document.getElementById('wmModeTextBtn').classList.toggle('active', mode === 'text');
      document.getElementById('wmModeImageBtn').classList.toggle('active', mode === 'image');
      document.getElementById('wmTextCheck').style.display = mode === 'text' ? 'flex' : 'none';
      document.getElementById('wmImageCheck').style.display = mode === 'image' ? 'flex' : 'none';

      document.getElementById('wmTextControls').style.display = mode === 'text' ? 'block' : 'none';
      document.getElementById('wmImageControls').style.display = mode === 'image' ? 'block' : 'none';
      this.updateWatermarkLivePreview();
    }

    toggleWmFormat(fmt) {
      const btn = document.getElementById(`wm${fmt.charAt(0).toUpperCase() + fmt.slice(1)}Btn`);
      const input = document.getElementById(`wmIs${fmt.charAt(0).toUpperCase() + fmt.slice(1)}`);
      if (btn && input) {
        const isActive = input.value === 'true';
        input.value = isActive ? 'false' : 'true';
        if (isActive) btn.classList.remove('active');
        else btn.classList.add('active');
        this.updateWatermarkLivePreview();
      }
    }

    setWmPosition(pos, element) {
      document.getElementById('wmPositionInput').value = pos;
      document.querySelectorAll('.wm-grid-cell').forEach(c => c.classList.remove('active'));
      element.classList.add('active');
      this.updateWatermarkLivePreview();
    }

    toggleMosaic(isChecked) {
      document.querySelectorAll('.wm-grid-cell').forEach(c => {
        c.style.pointerEvents = isChecked ? 'none' : 'auto';
        c.style.opacity = isChecked ? '0.3' : '1';
      });
      this.updateWatermarkLivePreview();
    }

    setWmLayer(layer) {
      document.getElementById('wmLayerInput').value = layer;
      document.getElementById('wmLayerOverBtn').classList.toggle('active', layer === 'over');
      document.getElementById('wmLayerBelowBtn').classList.toggle('active', layer === 'below');
    }

    handleWmImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      document.getElementById('wmImageFileName').innerText = file.name;

      const reader = new FileReader();
      reader.onload = (ev) => {
        document.getElementById('wmImageBase64Input').value = ev.target.result;
        this.updateWatermarkLivePreview();
      };
      reader.readAsDataURL(file);
    }

    togglePnFormat(fmt) {
      const btn = document.getElementById(`pn${fmt.charAt(0).toUpperCase() + fmt.slice(1)}Btn`);
      const input = document.getElementById(`pnIs${fmt.charAt(0).toUpperCase() + fmt.slice(1)}`);
      if (btn && input) {
        const isActive = input.value === 'true';
        input.value = isActive ? 'false' : 'true';
        if (isActive) btn.classList.remove('active');
        else btn.classList.add('active');
        this.updatePageNumberLivePreview();
      }
    }

    setPnPosition(pos, element) {
      document.getElementById('pnPositionInput').value = pos;
      document.querySelectorAll('.pn-grid-cell').forEach(c => c.classList.remove('active'));
      element.classList.add('active');
      this.updatePageNumberLivePreview();
    }

    updatePageNumberLivePreview() {
      // Find all live preview containers in the multi-page preview grid
      const containers = document.querySelectorAll('.livePreviewOverlayContainer');
      if (containers.length === 0) return;

      const pos = document.getElementById('pnPositionInput') ? document.getElementById('pnPositionInput').value : 'bottom_right';
      
      let marginRaw = document.getElementById('pnMarginInput') ? document.getElementById('pnMarginInput').value : '28';
      if (marginRaw === 'custom') {
        marginRaw = document.getElementById('pnCustomMarginInput') ? document.getElementById('pnCustomMarginInput').value : '28';
      }
      marginRaw = parseInt(marginRaw) || 28;

      let formatStr = document.getElementById('pnFormatInput') ? document.getElementById('pnFormatInput').value : '{n}';
      if (formatStr === 'custom') {
        formatStr = document.getElementById('pnCustomTextInput') ? document.getElementById('pnCustomTextInput').value : '{n}';
      }
      
      const font = document.getElementById('pnFontInput') ? document.getElementById('pnFontInput').value : 'Helvetica';
      const size = document.getElementById('pnFontSizeInput') ? document.getElementById('pnFontSizeInput').value : '11';
      const isBold = document.getElementById('pnIsBold') ? document.getElementById('pnIsBold').value === 'true' : false;
      const isItalic = document.getElementById('pnIsItalic') ? document.getElementById('pnIsItalic').value === 'true' : false;
      const isUnderline = document.getElementById('pnIsUnderline') ? document.getElementById('pnIsUnderline').value === 'true' : false;
      const color = document.getElementById('pnColorInput') ? document.getElementById('pnColorInput').value : '#333333';

      const pageMode = document.querySelector('input[name="pageMode"]:checked')?.value || 'single';
      const isCoverPage = document.getElementById('pnCoverPageCheck')?.checked;
      const totalPages = parseInt(document.getElementById('pnPageTo')?.value || containers.length);
      const startNum = parseInt(document.getElementById('pnFirstNumber')?.value || 1);
      const pageFrom = parseInt(document.getElementById('pnPageFrom')?.value || 1);
      const pageTo = parseInt(document.getElementById('pnPageTo')?.value || totalPages);

      // We need to scale down the margin if the canvas is scaled down. 
      // Assuming original A4 width ~595, canvas width is ~200, scale factor is ~0.33
      // We'll apply it via CSS percent or fixed smaller px based on container size
      
      containers.forEach((overlay, idx) => {
        overlay.innerHTML = '';
        
        const realPageNum = idx + 1;
        let displayPageNum = startNum + (realPageNum - pageFrom);

        if (pageMode === 'facing' && isCoverPage) {
          if (realPageNum === 1) {
            return; // Skip cover page
          }
          displayPageNum = startNum + (realPageNum - 2); 
          if (realPageNum < pageFrom + 1 || realPageNum > pageTo) return;
        } else {
          if (realPageNum < pageFrom || realPageNum > pageTo) return;
        }

        const el = document.createElement('div');
        const text = formatStr.replace('{n}', displayPageNum).replace('{total}', totalPages);
        
        el.innerText = text;
        el.style.fontFamily = font === 'TimesRoman' ? 'serif' : (font === 'Courier' ? 'monospace' : 'sans-serif');
        el.style.fontSize = `${Math.max(10, size * 0.7)}px`; // Scaled down for thumbnail
        el.style.fontWeight = isBold ? 'bold' : 'normal';
        el.style.fontStyle = isItalic ? 'italic' : 'normal';
        el.style.textDecoration = isUnderline ? 'underline' : 'none';
        el.style.color = color;
        el.style.position = 'absolute';
        el.style.whiteSpace = 'nowrap';
        
        const marginStr = `${Math.max(4, marginRaw * 0.4)}px`; // Scaled margin

        // Handle Facing Pages horizontal swap
        let effectivePos = pos;
        if (pageMode === 'facing') {
           // even pages in 'facing' get left/right swapped
           const isEvenPage = realPageNum % 2 === 0;
           if (isEvenPage) {
             if (effectivePos.includes('left')) effectivePos = effectivePos.replace('left', 'right');
             else if (effectivePos.includes('right')) effectivePos = effectivePos.replace('right', 'left');
           }
        }

        if (effectivePos.includes('top')) el.style.top = marginStr;
        if (effectivePos.includes('bottom')) el.style.bottom = marginStr;
        if (effectivePos.includes('left')) el.style.left = marginStr;
        if (effectivePos.includes('right')) el.style.right = marginStr;
        
        if (effectivePos.includes('center') || effectivePos === 'center') {
          if (effectivePos.includes('top') || effectivePos.includes('bottom')) {
            el.style.left = '50%';
            el.style.transform = 'translateX(-50%)';
          } else if (effectivePos.includes('middle')) {
            el.style.top = '50%';
            el.style.transform = 'translateY(-50%)';
          } else {
            // true center
            el.style.top = '50%';
            el.style.left = '50%';
            el.style.transform = 'translate(-50%, -50%)';
          }
        }
        
        if (effectivePos === 'middle_left') {
          el.style.top = '50%';
          el.style.transform = 'translateY(-50%)';
        }
        if (effectivePos === 'middle_right') {
          el.style.top = '50%';
          el.style.transform = 'translateY(-50%)';
        }

        overlay.appendChild(el);
      });
    }

    updateWatermarkLivePreview() {
      // Find all live preview containers
      const containers = document.querySelectorAll('.livePreviewOverlayContainer');
      if (containers.length === 0) return;

      const mode = document.getElementById('wmModeInput') ? document.getElementById('wmModeInput').value : 'text';
      const pos = document.getElementById('wmPositionInput') ? document.getElementById('wmPositionInput').value : 'top_left';
      const mosaic = document.getElementById('wmMosaicCheck') && document.getElementById('wmMosaicCheck').checked;
      const opacity = document.getElementById('wmOpacityInput') ? document.getElementById('wmOpacityInput').value : '1';
      const angle = document.getElementById('wmRotationInput') ? document.getElementById('wmRotationInput').value : '0';
      const layer = document.querySelector('input[name="layer"]:checked') ? document.querySelector('input[name="layer"]:checked').value : 'over';
      
      const totalPages = parseInt(document.getElementById('wmPageTo')?.value || containers.length);
      const pageFrom = parseInt(document.getElementById('wmPageFrom')?.value || 1);
      const pageTo = parseInt(document.getElementById('wmPageTo')?.value || totalPages);

      const applyStyles = (el) => {
        el.style.opacity = opacity;
        el.style.transform = `rotate(${angle}deg)`;
        el.style.pointerEvents = 'none';
        if (layer === 'below') {
          el.style.mixBlendMode = 'multiply';
        }
      };

      const createContent = () => {
        if (mode === 'text') {
          const el = document.createElement('div');
          const text = document.getElementById('watermarkTextInput').value || 'MomPDF';
          const font = document.getElementById('wmFontInput').value;
          const size = document.getElementById('wmFontSizeInput').value;
          const isBold = document.getElementById('wmIsBold').value === 'true';
          const isItalic = document.getElementById('wmIsItalic').value === 'true';
          const isUnderline = document.getElementById('wmIsUnderline').value === 'true';
          const color = document.getElementById('watermarkColorInput').value;

          el.innerText = text;
          el.style.fontFamily = font === 'TimesRoman' ? 'serif' : (font === 'Courier' ? 'monospace' : 'sans-serif');
          // Scale size down slightly for thumbnail preview relative to original size
          el.style.fontSize = `${Math.max(12, size * 0.35)}px`;
          el.style.fontWeight = isBold ? 'bold' : 'normal';
          el.style.fontStyle = isItalic ? 'italic' : 'normal';
          el.style.textDecoration = isUnderline ? 'underline' : 'none';
          el.style.color = color;
          el.style.whiteSpace = 'nowrap';
          applyStyles(el);
          return el;
        } else {
          const imgBase64 = document.getElementById('wmImageBase64Input').value;
          if (!imgBase64) return null;
          const el = document.createElement('img');
          el.src = imgBase64;
          const scale = document.getElementById('wmImageSizeInput').value / 100;
          el.style.maxWidth = `${scale * 100}%`;
          el.style.maxHeight = `${scale * 100}%`;
          el.style.objectFit = 'contain';
          applyStyles(el);
          return el;
        }
      };

      containers.forEach((overlay, idx) => {
        overlay.innerHTML = '';
        const realPageNum = idx + 1;
        
        // Check Page Range
        if (realPageNum < pageFrom || realPageNum > pageTo) {
          return;
        }

        if (mosaic) {
          overlay.style.display = 'grid';
          overlay.style.gridTemplateColumns = 'repeat(3, 1fr)';
          overlay.style.gridTemplateRows = 'repeat(3, 1fr)';
          overlay.style.alignItems = 'center';
          overlay.style.justifyItems = 'center';
          overlay.style.gap = '20px';

          for (let i = 0; i < 9; i++) {
            const content = createContent();
            if (content) overlay.appendChild(content);
          }
        } else {
          overlay.style.display = 'flex';
          overlay.style.flexDirection = 'column';
          overlay.style.justifyContent = pos.includes('top') ? 'flex-start' : (pos.includes('bottom') ? 'flex-end' : 'center');
          overlay.style.alignItems = pos.includes('left') ? 'flex-start' : (pos.includes('right') ? 'flex-end' : 'center');

          const content = createContent();
          if (content) {
            // Add some padding to avoid clipping the edges exactly
            content.style.margin = '20px';
            overlay.appendChild(content);
          }
        }
      });
    }

    rotateBy(delta) {
      const input = document.getElementById('rotateAngleInput');
      let currentAngle = parseInt(input ? input.value : 0) || 0;
      let newAngle = (currentAngle + delta) % 360;
      if (newAngle < 0) newAngle += 360;
      this.setRotateAngle(newAngle);
    }

    setRotateAngle(angle) {
      const input = document.getElementById('rotateAngleInput');
      const preview = document.getElementById('rotatePreviewBox');
      const label = document.getElementById('rotateAngleLabel');

      if (input) input.value = angle;
      if (preview) preview.style.transform = `rotate(${angle}deg)`;

      if (label) {
        if (angle === 90) label.innerText = 'Rotated 90° Right';
        else if (angle === 180) label.innerText = 'Rotated 180° Flip';
        else if (angle === 270) label.innerText = 'Rotated 90° Left';
        else label.innerText = 'Original Orientation';
      }

      // Rotate real file previews if in grid mode or individual page mode
      const cards = document.querySelectorAll('.page-card-thumb, [id^="thumb_"], .pdf-page-wrapper');
      cards.forEach(card => {
        card.style.transform = `rotate(${angle}deg)`;
        card.style.transition = 'transform 0.3s ease, margin 0.3s ease';
        if (card.classList.contains('pdf-page-wrapper')) {
          if (angle % 180 !== 0) {
            card.style.margin = '40px';
          } else {
            card.style.margin = '10px';
          }
        }
      });
    }

    renderOrganizeGrid(containerId = 'singlePreviewContainer') {
      const container = document.getElementById(containerId);
      if (!container || !this.organizeState) return;
      container.innerHTML = '';
      
      this.organizeState.pages.forEach((pageObj, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'organize-page-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.margin = '15px';
        wrapper.style.background = '#fff';
        wrapper.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        wrapper.style.border = '1px solid #e2e8f0';
        wrapper.style.cursor = 'grab';
        wrapper.draggable = true;
        wrapper.dataset.index = index;
        
        // Setup rotation
        const canvasContainer = document.createElement('div');
        canvasContainer.style.transition = 'transform 0.3s ease, margin 0.3s ease';
        canvasContainer.style.transform = `rotate(${pageObj.rotation}deg)`;
        if (pageObj.rotation % 180 !== 0) {
            canvasContainer.style.margin = '40px';
        } else {
            canvasContainer.style.margin = '0px';
        }
        canvasContainer.style.overflow = 'hidden';
        canvasContainer.appendChild(pageObj.canvas);
        
        // Action buttons
        const actions = document.createElement('div');
        actions.style.position = 'absolute';
        actions.style.top = '-12px';
        actions.style.right = '-12px';
        actions.style.display = 'flex';
        actions.style.gap = '8px';
        actions.style.zIndex = '10';
        
        const rotBtn = document.createElement('button');
        rotBtn.innerHTML = '↻';
        rotBtn.title = 'Rotate';
        rotBtn.style.cssText = 'width:32px;height:32px;border-radius:50%;background:#3b82f6;color:#fff;border:none;cursor:pointer;font-size:16px;box-shadow:0 2px 4px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;';
        rotBtn.onclick = (e) => { e.stopPropagation(); this.rotateOrganizePage(index); };
        
        const delBtn = document.createElement('button');
        delBtn.innerHTML = '×';
        delBtn.title = 'Delete';
        delBtn.style.cssText = 'width:32px;height:32px;border-radius:50%;background:#ef4444;color:#fff;border:none;cursor:pointer;font-size:18px;font-weight:bold;line-height:1;box-shadow:0 2px 4px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;';
        delBtn.onclick = (e) => { e.stopPropagation(); this.deleteOrganizePage(index); };
        
        actions.appendChild(rotBtn);
        actions.appendChild(delBtn);
        
        // Page Label
        const label = document.createElement('div');
        label.innerText = `${index + 1}`;
        label.style.position = 'absolute';
        label.style.bottom = '-15px';
        label.style.left = '50%';
        label.style.transform = 'translateX(-50%)';
        label.style.background = '#1e293b';
        label.style.color = '#fff';
        label.style.padding = '4px 12px';
        label.style.borderRadius = '12px';
        label.style.fontSize = '12px';
        label.style.fontWeight = 'bold';
        label.style.zIndex = '10';
        
        wrapper.appendChild(canvasContainer);
        wrapper.appendChild(actions);
        wrapper.appendChild(label);
        
        // Drag events
        wrapper.ondragstart = (e) => { e.dataTransfer.setData('text/plain', index); wrapper.style.opacity = '0.4'; };
        wrapper.ondragend = (e) => { wrapper.style.opacity = '1'; };
        wrapper.ondragover = (e) => { e.preventDefault(); wrapper.style.border = '2px dashed #3b82f6'; };
        wrapper.ondragleave = (e) => { wrapper.style.border = '1px solid #e2e8f0'; };
        wrapper.ondrop = (e) => {
            e.preventDefault();
            wrapper.style.border = '1px solid #e2e8f0';
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const toIndex = index;
            if (fromIndex !== toIndex && !isNaN(fromIndex)) {
                const moved = this.organizeState.pages.splice(fromIndex, 1)[0];
                this.organizeState.pages.splice(toIndex, 0, moved);
                this.renderOrganizeGrid(containerId);
            }
        };
        
        container.appendChild(wrapper);
      });
    }
    
    rotateOrganizePage(index) {
        if (!this.organizeState) return;
        this.organizeState.pages[index].rotation = (this.organizeState.pages[index].rotation + 90) % 360;
        this.renderOrganizeGrid();
    }
    
    deleteOrganizePage(index) {
        if (!this.organizeState) return;
        if (this.organizeState.pages.length <= 1) {
            if (this.showToast) this.showToast('Cannot delete the last page.');
            return;
        }
        this.organizeState.pages.splice(index, 1);
        this.renderOrganizeGrid();
    }
    
    sortOrganize(dir) {
        if (!this.organizeState) return;
        this.organizeState.pages.sort((a, b) => {
            const aVal = a.fileIndex * 10000 + a.pageIndex;
            const bVal = b.fileIndex * 10000 + b.pageIndex;
            return dir === 1 ? aVal - bVal : bVal - aVal;
        });
        this.renderOrganizeGrid();
    }
    
    resetOrganize() {
        if (!this.organizeState || !this.files || !this.files.length) return;
        this.files = [this.files[0]]; 
        window.generateOrganizePdfThumbnails(this.files[0], 'singlePreviewContainer', 180);
    }
    
    addOrganizePage(e) {
        const file = e.target.files[0];
        if (!file || file.type !== 'application/pdf') return;
        
        const fileIndex = this.files.length;
        this.files.push(file);
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target.result;
                const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const newPages = new Array(pdf.numPages);
                
                const renderPage = async (i) => {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.0 });
                    const scale = 180 / viewport.width;
                    const scaledViewport = page.getViewport({ scale: scale });

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = scaledViewport.width;
                    canvas.height = scaledViewport.height;
                    canvas.style.width = '100%';
                    canvas.style.height = 'auto';
                    canvas.style.display = 'block';

                    await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
                    
                    newPages[i - 1] = {
                      id: `org_page_${fileIndex}_${i}_${Date.now()}`,
                      fileIndex: fileIndex,
                      pageIndex: i - 1,
                      rotation: 0,
                      canvas: canvas
                    };
                };

                const concurrencyLimit = 5;
                for (let i = 1; i <= pdf.numPages; i += concurrencyLimit) {
                    const promises = [];
                    for (let j = 0; j < concurrencyLimit && (i + j) <= pdf.numPages; j++) {
                        promises.push(renderPage(i + j));
                    }
                    await Promise.all(promises);
                }
                
                this.organizeState.pages.push(...newPages);
                this.renderOrganizeGrid();
            } catch(err) {
                if (this.showToast) this.showToast('Failed to add PDF.');
            }
            e.target.value = '';
        };
        reader.readAsArrayBuffer(file);
    }

    renderRemoveGrid(containerId = 'removePreviewContainer') {
        const container = document.getElementById(containerId);
        if (!container || !this.removeState) return;
        
        container.innerHTML = '';
        
        this.removeState.pages.forEach((page, index) => {
            const card = document.createElement('div');
            card.style.cssText = 'position:relative; width:180px; background:#fff; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center; transition:box-shadow 0.2s;';
            card.onmouseover = () => card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            card.onmouseout = () => card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            
            const thumbWrap = document.createElement('div');
            thumbWrap.style.cssText = 'width:100%; height:240px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative;';
            
            if (page.isBlank) {
                const blankLabel = document.createElement('div');
                blankLabel.innerText = 'Blank Page';
                blankLabel.style.cssText = 'color:#94a3b8; font-size:14px; font-weight:600; text-align:center; padding:40px;';
                thumbWrap.appendChild(blankLabel);
            } else if (page.canvas) {
                const clone = document.createElement('canvas');
                clone.width = page.canvas.width;
                clone.height = page.canvas.height;
                clone.style.cssText = 'max-width:100%; max-height:100%; object-fit:contain;';
                clone.getContext('2d').drawImage(page.canvas, 0, 0);
                thumbWrap.appendChild(clone);
            }
            
            const controls = document.createElement('div');
            controls.style.cssText = 'width:100%; padding:10px; border-top:1px solid #e2e8f0; background:#f8fafc; display:flex; justify-content:space-between; align-items:center;';
            
            const num = document.createElement('div');
            num.innerText = `Page ${index + 1}`;
            num.style.cssText = 'font-size:12px; font-weight:600; color:#475569;';
            
            const delBtn = document.createElement('button');
            delBtn.innerHTML = '× Remove';
            delBtn.title = 'Remove Page';
            delBtn.style.cssText = 'border:none; background:#fee2e2; color:#ef4444; border-radius:4px; width:auto; height:24px; padding:0 8px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600;';
            delBtn.onclick = () => this.removeRemovePage(index);
            
            controls.appendChild(num);
            controls.appendChild(delBtn);
            
            card.appendChild(thumbWrap);
            card.appendChild(controls);
            container.appendChild(card);
        });
    }

    removeRemovePage(index) {
        if (!this.removeState) return;
        if (this.removeState.pages.length <= 1) {
            if (this.showToast) this.showToast('Cannot delete the last page.');
            return;
        }
        this.removeState.pages.splice(index, 1);
        this.renderRemoveGrid('removePreviewContainer');
    }

    addRemoveBlankPage() {
        if (!this.removeState) return;
        this.removeState.pages.push({
            id: `remove_blank_${Date.now()}`,
            isBlank: true,
            originalIndex: -1
        });
        this.renderRemoveGrid('removePreviewContainer');
    }

    updateCropPreview(margin) {
      const frame = document.getElementById('mainPreviewCard');
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

      const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const formData = new FormData();
      formData.append('tool', this.toolId);
      formData.append('taskId', taskId);
      this.files.forEach((f) => formData.append('files', f));

      if (this.toolId === 'organize_pdf' && this.organizeState && this.organizeState.pages) {
          const order = this.organizeState.pages.map(p => `${p.fileIndex}:${p.pageIndex}`).join(',');
          const rotations = this.organizeState.pages.map(p => p.rotation).join(',');
          formData.append('order', order);
          formData.append('rotations', rotations);
      } else if (this.toolId === 'remove_pages' && this.removeState && this.removeState.pages) {
          const order = this.removeState.pages.map(p => p.isBlank ? 'blank' : p.originalIndex).join(',');
          formData.append('order', order);
      }

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
        let progressInterval;

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const uploadPct = Math.round((e.loaded / e.total) * 70); // Upload is 0-70%
            if (bar) bar.style.width = `${uploadPct}%`;
            if (heading) heading.textContent = uploadPct < 70 ? `Uploading... ${uploadPct}%` : 'Processing...';

            // Start real progress polling once upload is done
            if (uploadPct >= 70 && !progressInterval) {
              progressInterval = setInterval(() => {
                fetch(`/api/progress/${taskId}`)
                  .then(r => r.json())
                  .then(data => {
                    if (data && data.progress) {
                      if (bar) bar.style.width = `${data.progress}%`;
                      if (heading && data.message) heading.textContent = data.message;
                      if (data.progress === 100) clearInterval(progressInterval);
                    }
                  })
                  .catch(err => console.error('Progress check error', err));
              }, 1000);
            }
          }
        });

        xhr.addEventListener('load', () => {
          if (progressInterval) clearInterval(progressInterval);
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
            if (this.toolId === 'pdf_summarize' && data.data && data.data.summaryData) {
               setTimeout(() => this.showAIResult(data.data.summaryData), 300);
            } else {
               setTimeout(() => this.showSuccess(data.data), 300);
            }
          } catch (err) {
            document.getElementById('processingStage').style.display = 'none';
            document.getElementById('studioStage').style.display = 'grid';
            this.showToast(err.message || 'Something went wrong. Please try again.');
          }
          resolve();
        });

        xhr.addEventListener('error', () => {
          if (progressInterval) clearInterval(progressInterval);
          document.getElementById('processingStage').style.display = 'none';
          document.getElementById('studioStage').style.display = 'grid';
          this.showToast('Network error. Please check your connection and try again.');
          resolve();
        });

        xhr.addEventListener('timeout', () => {
          if (progressInterval) clearInterval(progressInterval);
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
    
    showAIResult(summaryData) {
      document.getElementById('processingStage').style.display = 'none';
      document.getElementById('studioStage').style.display = 'none';
      document.getElementById('dropzoneStage').style.display = 'none';
      document.getElementById('successStage').style.display = 'none';
      document.getElementById('aiSummaryStage').style.display = 'block';

      this.currentDocId = summaryData.docId;
      this.aiChatHistory = [];

      const infoEl = document.getElementById('aiSummaryFileInfo');
      if (infoEl) {
        infoEl.innerText = `${this.files[0].name} (${this.formatSize(this.files[0].size)})`;
      }
      
      const contentEl = document.getElementById('aiSummaryContent');
      if (contentEl) {
        // Simple markdown parsing for bullets and headings
        let htmlContent = summaryData.summaryText
          .replace(/^### (.*$)/gim, '<h3 style="font-size:16px; font-weight:700; color:#1e293b; margin-top:24px; margin-bottom:12px;">$1</h3>')
          .replace(/^## (.*$)/gim, '<h2 style="font-size:18px; font-weight:700; color:#1e293b; margin-top:24px; margin-bottom:12px;">$1</h2>')
          .replace(/^\* (.*$)/gim, '<li style="margin-bottom:6px; margin-left:20px;">$1</li>')
          .replace(/^- (.*$)/gim, '<li style="margin-bottom:6px; margin-left:20px;">$1</li>');
        contentEl.innerHTML = htmlContent;
      }

      const txtBtn = document.getElementById('aiDownloadTxtBtn');
      if (txtBtn) {
        txtBtn.href = summaryData.txtDownloadUrl;
        txtBtn.setAttribute('download', `${this.files[0].name}_summary.txt`);
      }

      const pdfBtn = document.getElementById('aiDownloadPdfBtn');
      if (pdfBtn) {
        pdfBtn.href = summaryData.pdfDownloadUrl;
        pdfBtn.setAttribute('download', `${this.files[0].name}_summary.pdf`);
      }
      
      const chatHistory = document.getElementById('aiChatHistory');
      if (chatHistory) chatHistory.innerHTML = '';
    }
    
    copyAISummary() {
       const contentEl = document.getElementById('aiSummaryContent');
       if (contentEl) {
          navigator.clipboard.writeText(contentEl.innerText).then(() => {
             this.showToast('Summary copied to clipboard!');
          });
       }
    }
    
    async askAIQuestion() {
      const input = document.getElementById('aiQuestionInput');
      const askBtn = document.getElementById('aiAskBtn');
      const chatBox = document.getElementById('aiChatHistory');
      if (!input || !input.value.trim() || !this.currentDocId) return;

      const question = input.value.trim();
      input.value = '';
      input.disabled = true;
      askBtn.disabled = true;
      askBtn.innerText = 'Asking...';

      // Add User Message
      const userMsg = document.createElement('div');
      userMsg.style.cssText = 'background:#F1F5F9; padding:12px 16px; border-radius:12px 12px 0 12px; align-self:flex-end; max-width:80%; font-size:14px; color:#334155;';
      userMsg.innerText = question;
      chatBox.appendChild(userMsg);
      chatBox.scrollTop = chatBox.scrollHeight;

      try {
        const response = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             docId: this.currentDocId,
             question: question,
             history: this.aiChatHistory
          })
        });
        const data = await response.json();
        
        const aiMsg = document.createElement('div');
        aiMsg.style.cssText = 'background:#FDF4FF; border:1px solid #F5D0FE; padding:12px 16px; border-radius:12px 12px 12px 0; align-self:flex-start; max-width:90%; font-size:14px; color:#701A75;';
        
        if (data.success) {
           aiMsg.innerText = data.answer;
           this.aiChatHistory.push({ role: 'user', text: question });
           this.aiChatHistory.push({ role: 'ai', text: data.answer });
        } else {
           aiMsg.style.color = '#E11D48';
           aiMsg.style.background = '#FFE4E6';
           aiMsg.style.borderColor = '#FDA4AF';
           aiMsg.innerText = data.message || 'Error communicating with AI.';
        }
        chatBox.appendChild(aiMsg);
      } catch (err) {
        const aiMsg = document.createElement('div');
        aiMsg.style.cssText = 'background:#FFE4E6; border:1px solid #FDA4AF; padding:12px 16px; border-radius:12px 12px 12px 0; align-self:flex-start; max-width:90%; font-size:14px; color:#E11D48;';
        aiMsg.innerText = 'Network error while asking question.';
        chatBox.appendChild(aiMsg);
      }

      chatBox.scrollTop = chatBox.scrollHeight;
      input.disabled = false;
      askBtn.disabled = false;
      askBtn.innerText = 'Ask';
      input.focus();
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

