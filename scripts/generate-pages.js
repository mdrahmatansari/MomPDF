const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Tool definitions
const tools = [
  {
    id: 'merge_pdf',
    title: 'Merge PDF',
    subtitle: 'Combine multiple PDF files into one single document in seconds.',
    i18nKeyTitle: 'merge_pdf',
    i18nKeySubtitle: 'combine_multiple_pdf_files',
    category: 'organize',
    iconBg: '#FEE2E2',
    iconColor: '#E11D48',
    multi: true,
    actionText: 'Merge PDF',
    optionsHtml: `
      <p style="font-size: 14px; color: var(--text-muted);">Files will be merged in the order listed above. You can remove or re-order files before merging.</p>
    `
  },
  {
    id: 'split_pdf',
    title: 'Split PDF',
    subtitle: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    i18nKeyTitle: 'split_pdf',
    i18nKeySubtitle: 'separate_one_page_or',
    category: 'organize',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    multi: false,
    actionText: 'Split PDF',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label" data-i18n="split_mode">Split Mode</label>
        <select name="splitMode" class="control-select">
          <option value="all">Split into individual pages (Zip archive)</option>
          <option value="range">Extract specific page range</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-label" data-i18n="page_ranges_eg_13_5">Page Ranges (e.g. 1-3, 5)</label>
        <input type="text" name="ranges" class="control-input" placeholder="e.g. 1-3, 5" value="1" />
      </div>
    `
  },
  {
    id: 'compress_pdf',
    title: 'Compress PDF',
    subtitle: 'Reduce PDF file size while maintaining maximum document quality.',
    i18nKeyTitle: 'compress_pdf',
    i18nKeySubtitle: 'reduce_pdf_file_size_while_maintaining_maximum_document_quality_',
    category: 'optimize',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    multi: false,
    actionText: 'Compress PDF',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label" data-i18n="compression_level">Compression Level</label>
        <select name="level" class="control-select">
          <option value="recommended">Recommended Compression (Good quality, high reduction)</option>
          <option value="extreme">Extreme Compression (Smallest size)</option>
          <option value="less">Less Compression (Highest quality)</option>
        </select>
      </div>
    `
  },
  {
    id: 'pdf_to_word',
    title: 'PDF to Word',
    subtitle: 'Convert PDF documents into editable Word DOCX files with high accuracy.',
    i18nKeyTitle: 'pdf_to_word',
    i18nKeySubtitle: 'convert_pdf_documents_into_editable_word_docx_files_with_high_accuracy_',
    category: 'convert',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    multi: false,
    actionText: 'Convert to Word'
  },
  {
    id: 'word_to_pdf',
    title: 'Word to PDF',
    subtitle: 'Convert DOC and DOCX Word documents into professional PDF files.',
    i18nKeyTitle: 'word_to_pdf',
    i18nKeySubtitle: 'convert_doc_and_docx_word_documents_into_professional_pdf_files_',
    category: 'convert',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    multi: false,
    actionText: 'Convert to PDF'
  },
  {
    id: 'pdf_to_powerpoint',
    title: 'PDF to PowerPoint',
    subtitle: 'Turn your PDF files into easy to edit PPT and PPTX presentations.',
    i18nKeyTitle: 'pdf_to_powerpoint',
    i18nKeySubtitle: 'turn_your_pdf_files_into_easy_to_edit_ppt_and_pptx_presentations_',
    category: 'convert',
    iconBg: '#FFEDD5',
    iconColor: '#EA580C',
    multi: false,
    actionText: 'Convert to PPTX'
  },
  {
    id: 'powerpoint_to_pdf',
    title: 'PowerPoint to PDF',
    subtitle: 'Convert PPT and PPTX presentation slides into formatted PDF files.',
    i18nKeyTitle: 'powerpoint_to_pdf',
    i18nKeySubtitle: 'convert_ppt_and_pptx_presentation_slides_into_formatted_pdf_files_',
    category: 'convert',
    iconBg: '#FFEDD5',
    iconColor: '#EA580C',
    multi: false,
    actionText: 'Convert to PDF'
  },
  {
    id: 'pdf_to_excel',
    title: 'PDF to Excel',
    subtitle: 'Pull table data straight from PDFs into Excel spreadsheets automatically.',
    i18nKeyTitle: 'pdf_to_excel',
    i18nKeySubtitle: 'pull_table_data_straight_from_pdfs_into_excel_spreadsheets_automatically_',
    category: 'convert',
    iconBg: '#D1FAE5',
    iconColor: '#059669',
    multi: false,
    actionText: 'Convert to Excel'
  },
  {
    id: 'excel_to_pdf',
    title: 'Excel to PDF',
    subtitle: 'Convert XLS and XLSX spreadsheets into clean PDF documents.',
    i18nKeyTitle: 'excel_to_pdf',
    i18nKeySubtitle: 'convert_xls_and_xlsx_spreadsheets_into_clean_pdf_documents_',
    category: 'convert',
    iconBg: '#D1FAE5',
    iconColor: '#059669',
    multi: false,
    actionText: 'Convert to PDF'
  },
  {
    id: 'pdf_to_jpg',
    title: 'PDF to JPG',
    subtitle: 'Extract all pages from your PDF into high-resolution JPG images.',
    i18nKeyTitle: 'pdf_to_jpg',
    i18nKeySubtitle: 'extract_all_pages_from_your_pdf_into_high_resolution_jpg_images_',
    category: 'convert',
    iconBg: '#FCE7F3',
    iconColor: '#DB2777',
    multi: false,
    actionText: 'Convert to JPG'
  },
  {
    id: 'jpg_to_pdf',
    title: 'JPG to PDF',
    subtitle: 'Convert JPG, PNG, and WebP images into a single formatted PDF document.',
    i18nKeyTitle: 'jpg_to_pdf',
    i18nKeySubtitle: 'convert_jpg__png__and_webp_images_into_a_single_formatted_pdf_document_',
    category: 'convert',
    iconBg: '#FCE7F3',
    iconColor: '#DB2777',
    multi: true,
    actionText: 'Convert to PDF',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label">Page Orientation</label>
        <select name="orientation" class="control-select">
          <option value="auto">Auto</option>
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-label">Margin (px)</label>
        <input type="number" name="margin" class="control-input" value="0" min="0" max="100" />
      </div>
    `
  },
  {
    id: 'rotate_pdf',
    title: 'Rotate PDF',
    subtitle: 'Rotate PDF pages 90, 180, or 270 degrees clockwise or counter-clockwise.',
    i18nKeyTitle: 'rotate_pdf',
    i18nKeySubtitle: 'rotate_pdf_pages_90__180__or_270_degrees_clockwise_or_counter_clockwise_',
    category: 'edit',
    iconBg: '#EDE9FE',
    iconColor: '#7C3AED',
    multi: false,
    actionText: 'Rotate PDF',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label" data-i18n="rotation_angle">Rotation Angle</label>
        <select name="angle" class="control-select">
          <option value="90">90° Right (Clockwise)</option>
          <option value="180">180° Flip Upside Down</option>
          <option value="270">90° Left (Counter-Clockwise)</option>
        </select>
      </div>
    `
  },
  {
    id: 'pdf_add_watermark',
    title: 'Add Watermark',
    subtitle: 'Stamp text or custom watermarks over your PDF pages with full customization.',
    i18nKeyTitle: 'add_watermark',
    i18nKeySubtitle: 'stamp_text_or_custom_watermarks_over_your_pdf_pages_with_full_customization_',
    category: 'edit',
    iconBg: '#EDE9FE',
    iconColor: '#7C3AED',
    multi: false,
    actionText: 'Add Watermark',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label" data-i18n="watermark_text">Watermark Text</label>
        <input type="text" name="text" class="control-input" value="CONFIDENTIAL" />
      </div>
      <div class="control-group">
        <label class="control-label">Opacity (0.1 - 1.0)</label>
        <input type="number" name="opacity" class="control-input" value="0.3" step="0.1" min="0.1" max="1.0" />
      </div>
      <div class="control-group">
        <label class="control-label" data-i18n="rotation_angle">Rotation Angle</label>
        <select name="angle" class="control-select">
          <option value="45">45° Diagonal</option>
          <option value="0">0° Horizontal</option>
          <option value="90">90° Vertical</option>
        </select>
      </div>
    `
  },
  {
    id: 'add_pdf_page_number',
    title: 'Page Numbers',
    subtitle: 'Add page numbers to your PDF with custom placement, fonts, and styling.',
    i18nKeyTitle: 'page_numbers',
    i18nKeySubtitle: 'add_page_numbers_to_your_pdf_with_custom_placement__fonts__and_styling_',
    category: 'edit',
    iconBg: '#EDE9FE',
    iconColor: '#7C3AED',
    multi: false,
    actionText: 'Add Page Numbers',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label">Position</label>
        <select name="position" class="control-select">
          <option value="bottom-center" data-i18n="bottom_center">Bottom Center</option>
          <option value="bottom-right" data-i18n="bottom_right">Bottom Right</option>
          <option value="bottom-left" data-i18n="bottom_left">Bottom Left</option>
          <option value="top-right" data-i18n="top_right">Top Right</option>
          <option value="top-center" data-i18n="top_center">Top Center</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-label">Format</label>
        <select name="format" class="control-select">
          <option value="Page {n} of {total}">Page {n} of {total}</option>
          <option value="{n}">{n}</option>
          <option value="p. {n}">p. {n}</option>
        </select>
      </div>
    `
  },
  {
    id: 'crop-pdf',
    title: 'Crop PDF',
    subtitle: 'Trim margins and crop specific areas across your PDF pages.',
    i18nKeyTitle: 'crop_pdf',
    i18nKeySubtitle: 'trim_margins_and_crop_specific_areas_across_your_pdf_pages_',
    category: 'edit',
    iconBg: '#EDE9FE',
    iconColor: '#7C3AED',
    multi: false,
    actionText: 'Crop PDF',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label">Crop Margin (px)</label>
        <input type="number" name="margin" class="control-input" value="30" min="5" max="200" />
      </div>
    `
  },
  {
    id: 'organize-pdf',
    title: 'Organize PDF',
    subtitle: 'Sort, reorder, duplicate, and delete pages from your PDF document.',
    i18nKeyTitle: 'organize_pdf',
    i18nKeySubtitle: 'sort__reorder__duplicate__and_delete_pages_from_your_pdf_document_',
    category: 'organize',
    iconBg: '#FEE2E2',
    iconColor: '#E11D48',
    multi: false,
    actionText: 'Organize PDF',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label">Page Order (e.g. 2, 1, 3)</label>
        <input type="text" name="order" class="control-input" placeholder="e.g. 1, 2, 3" />
      </div>
    `
  },
  {
    id: 'remove-pages',
    title: 'Remove Pages',
    subtitle: 'Delete unwanted or blank pages from your PDF file easily.',
    i18nKeyTitle: 'remove_pages',
    i18nKeySubtitle: 'delete_unwanted_or_blank_pages_from_your_pdf_file_easily_',
    category: 'organize',
    iconBg: '#FEE2E2',
    iconColor: '#E11D48',
    multi: false,
    actionText: 'Remove Pages',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label">Pages to Remove (e.g. 2, 4-6)</label>
        <input type="text" name="pages" class="control-input" placeholder="e.g. 2, 4-6" />
      </div>
    `
  },
  {
    id: 'protect-pdf',
    title: 'Protect PDF',
    subtitle: 'Encrypt your PDF with a strong password to prevent unauthorized access.',
    i18nKeyTitle: 'protect_pdf',
    i18nKeySubtitle: 'encrypt_your_pdf_with_a_strong_password_to_prevent_unauthorized_access_',
    category: 'security',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    multi: false,
    actionText: 'Protect PDF',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label">Enter Password</label>
        <input type="password" name="password" class="control-input" placeholder="Enter password" value="mompdf2026" />
      </div>
    `
  },
  {
    id: 'unlock_pdf',
    title: 'Unlock PDF',
    subtitle: 'Remove password and restrictions from protected PDF documents.',
    i18nKeyTitle: 'unlock_pdf',
    i18nKeySubtitle: 'remove_password_and_restrictions_from_protected_pdf_documents_',
    category: 'security',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    multi: false,
    actionText: 'Unlock PDF',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label">PDF Password (if known)</label>
        <input type="password" name="password" class="control-input" placeholder="Enter password" />
      </div>
    `
  },
  {
    id: 'convert-pdf-to-pdfa',
    title: 'PDF to PDF/A',
    subtitle: 'Convert PDF files to ISO-standardized PDF/A format for long-term archiving.',
    i18nKeyTitle: 'pdf_to_pdfa',
    i18nKeySubtitle: 'convert_pdf_files_to_iso_standardized_pdf_a_format_for_long_term_archiving_',
    category: 'convert',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    multi: false,
    actionText: 'Convert to PDF/A'
  },
  {
    id: 'ocr-pdf',
    title: 'OCR PDF',
    subtitle: 'Extract text from scanned documents and make PDF text searchable.',
    i18nKeyTitle: 'ocr_pdf',
    i18nKeySubtitle: 'extract_text_from_scanned_documents_and_make_pdf_text_searchable_',
    category: 'optimize',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    multi: false,
    actionText: 'Run OCR'
  },
  {
    id: 'pdf-summarize',
    title: 'AI PDF Summarizer',
    subtitle: 'Extract key insights, executive summary, and highlights with MomPDF Intelligence.',
    i18nKeyTitle: 'ai_pdf_summarizer',
    i18nKeySubtitle: 'extract_key_insights__executive_summary__and_highlights_with_mompdf_intelligence_',
    category: 'intelligence',
    iconBg: '#E0E7FF',
    iconColor: '#4F46E5',
    multi: false,
    actionText: 'Generate Summary'
  },
  {
    id: 'translate-pdf',
    title: 'Translate PDF',
    subtitle: 'Translate entire PDF documents into Spanish, French, German, and more.',
    i18nKeyTitle: 'translate_pdf',
    i18nKeySubtitle: 'translate_entire_pdf_documents_into_spanish__french__german__and_more_',
    category: 'intelligence',
    iconBg: '#E0E7FF',
    iconColor: '#4F46E5',
    multi: false,
    actionText: 'Translate PDF',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label">Target Language</label>
        <select name="targetLang" class="control-select">
          <option value="es">Spanish (Español)</option>
          <option value="fr">French (Français)</option>
          <option value="de">German (Deutsch)</option>
          <option value="it">Italian (Italiano)</option>
          <option value="hi">Hindi (हिन्दी)</option>
        </select>
      </div>
    `
  },
  {
    id: 'repair-pdf',
    title: 'Repair PDF',
    subtitle: 'Fix and recover damaged or corrupted PDF files seamlessly.',
    i18nKeyTitle: 'repair_pdf',
    i18nKeySubtitle: 'fix_and_recover_damaged_or_corrupted_pdf_files_seamlessly_',
    category: 'optimize',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    multi: false,
    actionText: 'Repair PDF'
  },
  {
    id: 'sign-pdf',
    title: 'Sign PDF',
    subtitle: 'Add digital signatures and initials to your PDF documents quickly.',
    i18nKeyTitle: 'sign_pdf',
    i18nKeySubtitle: 'add_digital_signatures_and_initials_to_your_pdf_documents_quickly_',
    category: 'security',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    multi: false,
    actionText: 'Sign PDF',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label">Signature Text</label>
        <input type="text" name="signatureText" class="control-input" value="MomPDF Verified Signature" />
      </div>
    `
  },
  {
    id: 'redact-pdf',
    title: 'Redact PDF',
    subtitle: 'Permanently remove and black out confidential text and sensitive data.',
    i18nKeyTitle: 'redact_pdf',
    i18nKeySubtitle: 'permanently_remove_and_black_out_confidential_text_and_sensitive_data_',
    category: 'security',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    multi: false,
    actionText: 'Redact PDF'
  },
  {
    id: 'compare-pdf',
    title: 'Compare PDF',
    subtitle: 'Compare two PDF files side-by-side to highlight differences and changes.',
    i18nKeyTitle: 'compare_pdf',
    i18nKeySubtitle: 'compare_two_pdf_files_side_by_side_to_highlight_differences_and_changes_',
    category: 'security',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    multi: true,
    actionText: 'Compare PDFs'
  },
  {
    id: 'edit-pdf',
    title: 'Edit PDF',
    subtitle: 'Add text, shapes, notes, and annotations to your PDF pages.',
    i18nKeyTitle: 'edit_pdf',
    i18nKeySubtitle: 'add_text__shapes__notes__and_annotations_to_your_pdf_pages_',
    category: 'edit',
    iconBg: '#EDE9FE',
    iconColor: '#7C3AED',
    multi: false,
    actionText: 'Save PDF'
  },
  {
    id: 'scan-pdf',
    title: 'Scan to PDF',
    subtitle: 'Capture and convert scanned documents into clean PDF files.',
    i18nKeyTitle: 'scan_to_pdf',
    i18nKeySubtitle: 'capture_and_convert_scanned',
    category: 'organize',
    iconBg: '#FEE2E2',
    iconColor: '#E11D48',
    multi: true,
    actionText: 'Create PDF'
  },
  {
    id: 'html-to-pdf',
    title: 'HTML to PDF',
    subtitle: 'Convert web pages and HTML documents into high-quality PDFs.',
    i18nKeyTitle: 'html_to_pdf',
    i18nKeySubtitle: 'convert_web_pages_and',
    category: 'convert',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    multi: false,
    actionText: 'Convert to PDF',
    optionsHtml: `
      <div class="control-group">
        <label class="control-label">Web URL or HTML Code</label>
        <textarea name="html" class="control-input" rows="4" placeholder="Enter URL or paste HTML markup here..."></textarea>
      </div>
    `
  }
];

// Helper: Common Favicon Tags
function getFaviconTagsHtml() {
  return `  <link rel="icon" type="image/svg+xml" href="img/mompdf-icon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="img/favicons-pdf/favicon-32x32.png?v=3" />
  <link rel="apple-touch-icon" href="img/app-icon.png?v=3" />`;
}

// Helper: Common Header HTML with Crisp Vector Icons
function getHeaderHtml(activeTool = '') {
  return `
  <header class="header">
    <nav>
      <a href="index.html" class="brand" title="MomPDF - Everything PDF in One Place">
        <img src="img/mompdf.svg" alt="MomPDF" />
      </a>
      
      <ul class="nav-links">
        <li class="nav-item"><a href="merge_pdf.html" data-i18n="merge_pdf">Merge PDF</a></li>
        <li class="nav-item"><a href="split_pdf.html" data-i18n="split_pdf">Split PDF</a></li>
        <li class="nav-item"><a href="compress_pdf.html" data-i18n="compress_pdf">Compress PDF</a></li>
        
        <!-- Convert PDF Dropdown -->
        <li class="nav-item">
          <button type="button" class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false" onclick="this.parentElement.classList.toggle('is-open'); event.stopPropagation();" data-i18n="convert_pdf">
            Convert PDF
            <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="dropdown-menu convert-dropdown">
            <!-- Left Column: Convert to PDF -->
            <div>
              <div class="menu-column-header">
                <span class="column-dot" style="background:#E11D48;"></span>
                Convert to PDF
              </div>
              <div class="menu-items-list">
                <a href="jpg_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEE2E2; color:#E11D48;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="jpg_to_pdf">JPG to PDF</span>
                    <span class="menu-item-desc" data-i18n="convert_jpg_png_webp_images">Convert JPG, PNG, WebP images</span>
                  </div>
                </a>
                <a href="word_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#EFF6FF; color:#2563EB;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="word_to_pdf">Word to PDF</span>
                    <span class="menu-item-desc" data-i18n="docx_and_doc_documents">DOCX and DOC documents</span>
                  </div>
                </a>
                <a href="powerpoint_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FFF7ED; color:#EA580C;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="powerpoint_to_pdf">PowerPoint to PDF</span>
                    <span class="menu-item-desc" data-i18n="pptx_presentation_slides">PPTX presentation slides</span>
                  </div>
                </a>
                <a href="excel_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F0FDF4; color:#16A34A;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="excel_to_pdf">Excel to PDF</span>
                    <span class="menu-item-desc" data-i18n="xlsx_and_xls_spreadsheets">XLSX and XLS spreadsheets</span>
                  </div>
                </a>
                <a href="html-to-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FAF5FF; color:#9333EA;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="html_to_pdf">HTML to PDF</span>
                    <span class="menu-item-desc" data-i18n="web_pages_and_html_files">Web pages and HTML files</span>
                  </div>
                </a>
              </div>
            </div>

            <!-- Right Column: Convert from PDF -->
            <div>
              <div class="menu-column-header">
                <span class="column-dot" style="background:#2563EB;"></span>
                Convert from PDF
              </div>
              <div class="menu-items-list">
                <a href="pdf_to_jpg.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF2F2; color:#E11D48;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="pdf_to_jpg">PDF to JPG</span>
                    <span class="menu-item-desc" data-i18n="extract_highresolution_images">Extract high-resolution images</span>
                  </div>
                </a>
                <a href="pdf_to_word.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#EFF6FF; color:#2563EB;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="pdf_to_word">PDF to Word</span>
                    <span class="menu-item-desc" data-i18n="editable_word_docx_format">Editable Word DOCX format</span>
                  </div>
                </a>
                <a href="pdf_to_powerpoint.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FFF7ED; color:#EA580C;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="pdf_to_powerpoint">PDF to PowerPoint</span>
                    <span class="menu-item-desc" data-i18n="editable_presentation_slides">Editable presentation slides</span>
                  </div>
                </a>
                <a href="pdf_to_excel.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F0FDF4; color:#16A34A;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="pdf_to_excel">PDF to Excel</span>
                    <span class="menu-item-desc" data-i18n="extract_tabular_data_into_xlsx">Extract tabular data into XLSX</span>
                  </div>
                </a>
                <a href="convert-pdf-to-pdfa.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F1F5F9; color:#475569;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="pdf_to_pdfa">PDF to PDF/A</span>
                    <span class="menu-item-desc" data-i18n="iso_standardized_archival">ISO standardized archival</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </li>

        <!-- All PDF Tools Mega-Menu -->
        <li class="nav-item">
          <button type="button" class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false" onclick="this.parentElement.classList.toggle('is-open'); event.stopPropagation();" data-i18n="all_pdf_tools">
            All PDF Tools
            <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="dropdown-menu mega-menu-dropdown">
            <!-- Column 1: Organize -->
            <div>
              <div class="menu-column-header">
                <span class="column-dot" style="background:#E11D48;"></span>
                Organize PDF
              </div>
              <div class="menu-items-list">
                <a href="merge_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEE2E2; color:#E11D48;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="merge_pdf">Merge PDF</span></div>
                </a>
                <a href="split_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF3C7; color:#D97706;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="split_pdf">Split PDF</span></div>
                </a>
                <a href="remove-pages.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEE2E2; color:#DC2626;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="remove_pages">Remove Pages</span></div>
                </a>
                <a href="organize-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#E0E7FF; color:#4338CA;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="organize_pdf">Organize PDF</span></div>
                </a>
                <a href="scan-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#CCFBF1; color:#0D9488;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="scan_to_pdf">Scan to PDF</span></div>
                </a>
              </div>
            </div>

            <!-- Column 2: Optimize & Edit -->
            <div>
              <div class="menu-column-header">
                <span class="column-dot" style="background:#16A34A;"></span>
                Optimize & Edit
              </div>
              <div class="menu-items-list">
                <a href="compress_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#DCFCE7; color:#16A34A;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9M8 17l4 4 4-4"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="compress_pdf">Compress PDF</span></div>
                </a>
                <a href="repair-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF3C7; color:#B45309;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="repair_pdf">Repair PDF</span></div>
                </a>
                <a href="ocr-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F3E8FF; color:#7E22CE;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="ocr_pdf">OCR PDF</span></div>
                </a>
                <a href="rotate_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#E0E7FF; color:#4F46E5;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="rotate_pdf">Rotate PDF</span></div>
                </a>
                <a href="add_pdf_page_number.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F1F5F9; color:#334155;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="page_numbers">Page Numbers</span></div>
                </a>
                <a href="pdf_add_watermark.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FFE4E6; color:#E11D48;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="add_watermark">Add Watermark</span></div>
                </a>
                <a href="crop-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF9C3; color:#A16207;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="crop_pdf">Crop PDF</span></div>
                </a>
              </div>
            </div>

            <!-- Column 3: Convert -->
            <div>
              <div class="menu-column-header">
                <span class="column-dot" style="background:#2563EB;"></span>
                Convert PDF
              </div>
              <div class="menu-items-list">
                <a href="pdf_to_word.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#EFF6FF; color:#2563EB;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="pdf_to_word">PDF to Word</span></div>
                </a>
                <a href="word_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#EFF6FF; color:#1D4ED8;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="word_to_pdf">Word to PDF</span></div>
                </a>
                <a href="pdf_to_excel.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F0FDF4; color:#16A34A;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="pdf_to_excel">PDF to Excel</span></div>
                </a>
                <a href="excel_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F0FDF4; color:#15803D;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="excel_to_pdf">Excel to PDF</span></div>
                </a>
                <a href="pdf_to_powerpoint.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FFF7ED; color:#EA580C;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="pdf_to_ppt">PDF to PPT</span></div>
                </a>
                <a href="pdf_to_jpg.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF2F2; color:#E11D48;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="pdf_to_jpg">PDF to JPG</span></div>
                </a>
                <a href="jpg_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF2F2; color:#BE123C;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="jpg_to_pdf">JPG to PDF</span></div>
                </a>
              </div>
            </div>

            <!-- Column 4: Security & AI -->
            <div>
              <div class="menu-column-header">
                <span class="column-dot" style="background:#9333EA;"></span>
                Security & AI
              </div>
              <div class="menu-items-list">
                <a href="protect-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEE2E2; color:#DC2626;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="protect_pdf">Protect PDF</span></div>
                </a>
                <a href="unlock_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#DCFCE7; color:#16A34A;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="unlock_pdf">Unlock PDF</span></div>
                </a>
                <a href="sign-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#E0E7FF; color:#4338CA;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="sign_pdf">Sign PDF</span></div>
                </a>
                <a href="redact-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F1F5F9; color:#0F172A;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="redact_pdf">Redact PDF</span></div>
                </a>
                <a href="compare-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#EFF6FF; color:#2563EB;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="compare_pdf">Compare PDF</span></div>
                </a>
                <a href="pdf-summarize.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FAF5FF; color:#9333EA;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="ai_summarizer">AI Summarizer</span></div>
                </a>
                <a href="translate-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#ECFEFF; color:#0891B2;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="translate_pdf">Translate PDF</span></div>
                </a>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div class="nav-actions">
        <a href="login.html" class="btn btn-secondary btn-sm" data-i18n="login">Login</a>
        <a href="register.html" class="btn btn-primary btn-sm" data-i18n="sign_up">Sign Up</a>
      </div>
    </nav>
  </header>
  `;
}

// Helper: SVG Flags for 30 Countries (Guaranteed 100% render on all Windows/Mac/Mobile browsers)
function getFlagSvg(code) {
  switch (code) {
    case 'us': return `<svg class="flag-icon" viewBox="0 0 640 480"><g fill-rule="evenodd"><path fill="#bd3d44" d="M0 0h640v480H0z"/><path stroke="#fff" stroke-width="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640"/><path fill="#192f5d" d="M0 0h256v258.5H0z"/><g fill="#fff"><circle cx="25" cy="20" r="7"/><circle cx="76" cy="20" r="7"/><circle cx="128" cy="20" r="7"/><circle cx="180" cy="20" r="7"/><circle cx="230" cy="20" r="7"/><circle cx="51" cy="45" r="7"/><circle cx="102" cy="45" r="7"/><circle cx="154" cy="45" r="7"/><circle cx="205" cy="45" r="7"/><circle cx="25" cy="70" r="7"/><circle cx="76" cy="70" r="7"/><circle cx="128" cy="70" r="7"/><circle cx="180" cy="70" r="7"/><circle cx="230" cy="70" r="7"/><circle cx="51" cy="95" r="7"/><circle cx="102" cy="95" r="7"/><circle cx="154" cy="95" r="7"/><circle cx="205" cy="95" r="7"/><circle cx="25" cy="120" r="7"/><circle cx="76" cy="120" r="7"/><circle cx="128" cy="120" r="7"/><circle cx="180" cy="120" r="7"/><circle cx="230" cy="120" r="7"/><circle cx="51" cy="145" r="7"/><circle cx="102" cy="145" r="7"/><circle cx="154" cy="145" r="7"/><circle cx="205" cy="145" r="7"/><circle cx="25" cy="170" r="7"/><circle cx="76" cy="170" r="7"/><circle cx="128" cy="170" r="7"/><circle cx="180" cy="170" r="7"/><circle cx="230" cy="170" r="7"/><circle cx="51" cy="195" r="7"/><circle cx="102" cy="195" r="7"/><circle cx="154" cy="195" r="7"/><circle cx="205" cy="195" r="7"/><circle cx="25" cy="220" r="7"/><circle cx="76" cy="220" r="7"/><circle cx="128" cy="220" r="7"/><circle cx="180" cy="220" r="7"/><circle cx="230" cy="220" r="7"/></g></g></svg>`;
    case 'es': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#c60b1e" d="M0 0h640v480H0z"/><path fill="#ffc400" d="M0 120h640v240H0z"/></svg>`;
    case 'fr': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#002654" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#ce1126" d="M426.7 0H640v480H426.7z"/></svg>`;
    case 'de': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#000" d="M0 0h640v160H0z"/><path fill="#d00" d="M0 160h640v160H0z"/><path fill="#ffce00" d="M0 320h640v160H0z"/></svg>`;
    case 'it': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#009246" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#ce2b37" d="M426.7 0H640v480H426.7z"/></svg>`;
    case 'pt': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#046a38" d="M0 0h256v480H0z"/><path fill="#da291c" d="M256 0h384v480H256z"/><circle cx="256" cy="240" r="70" fill="#ffc72c"/><path fill="#da291c" d="M236 215h40v50h-40z"/></svg>`;
    case 'ja': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v480H0z"/><circle cx="320" cy="240" r="130" fill="#bc002d"/></svg>`;
    case 'ko': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v480H0z"/><path fill="#c60c30" d="M320 130a110 110 0 0 1 0 220 55 55 0 0 1 0-110 55 55 0 0 0 0-110z"/><path fill="#003478" d="M320 130a55 55 0 0 1 0 110 55 55 0 0 0 0 110 110 110 0 0 1 0-220z"/><circle cx="160" cy="140" r="10" fill="#000"/><circle cx="480" cy="140" r="10" fill="#000"/><circle cx="160" cy="340" r="10" fill="#000"/><circle cx="480" cy="340" r="10" fill="#000"/></svg>`;
    case 'cn': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#de2910" d="M0 0h640v480H0z"/><polygon fill="#ffde00" points="100,50 112,87 151,87 120,110 131,148 100,125 69,148 80,110 49,87 88,87"/></svg>`;
    case 'tw': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#fe0000" d="M0 0h640v480H0z"/><path fill="#000095" d="M0 0h320v240H0z"/><circle cx="160" cy="120" r="50" fill="#fff"/></svg>`;
    case 'in': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#f93" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#128807" d="M0 320h640v160H0z"/><circle cx="320" cy="240" r="55" fill="none" stroke="#000080" stroke-width="7"/><circle cx="320" cy="240" r="10" fill="#000080"/></svg>`;
    case 'sa': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#006c35" d="M0 0h640v480H0z"/><path stroke="#fff" stroke-width="12" fill="none" d="M160 300h320M200 280l-40 20 40 20"/></svg>`;
    case 'ru': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v160H0z"/><path fill="#0039a6" d="M0 160h640v160H0z"/><path fill="#d52b1e" d="M0 320h640v160H0z"/></svg>`;
    case 'tr': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#e30a17" d="M0 0h640v480H0z"/><circle cx="280" cy="240" r="110" fill="#fff"/><circle cx="310" cy="240" r="88" fill="#e30a17"/><polygon fill="#fff" points="390,240 425,252 412,216 440,240 405,240"/></svg>`;
    case 'id': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#e70011" d="M0 0h640v240H0z"/><path fill="#fff" d="M0 240h640v240H0z"/></svg>`;
    case 'vi': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#da251d" d="M0 0h640v480H0z"/><polygon fill="#ff0" points="320,130 355,230 460,230 375,295 407,395 320,335 233,395 265,295 180,230 285,230"/></svg>`;
    case 'nl': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#ae1c28" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#21468b" d="M0 320h640v160H0z"/></svg>`;
    case 'pl': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v240H0z"/><path fill="#dc143c" d="M0 240h640v240H0z"/></svg>`;
    case 'se': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#006aa7" d="M0 0h640v480H0z"/><path fill="#fecc00" d="M180 0h70v480h-70zM0 205h640v70H0z"/></svg>`;
    case 'no': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#ba0c2f" d="M0 0h640v480H0z"/><path fill="#fff" d="M160 0h110v480H160zM0 185h640v110H0z"/><path fill="#00205b" d="M190 0h50v480h-50zM0 215h640v50H0z"/></svg>`;
    case 'dk': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#c60c30" d="M0 0h640v480H0z"/><path fill="#fff" d="M180 0h70v480h-70zM0 205h640v70H0z"/></svg>`;
    case 'fi': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v480H0z"/><path fill="#002f6c" d="M180 0h90v480H180zM0 195h640v90H0z"/></svg>`;
    case 'gr': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#0d5eaf" d="M0 0h640v480H0z"/><path stroke="#fff" stroke-width="53" d="M0 80h640M0 186h640M0 293h640M0 400h640"/><path fill="#0d5eaf" d="M0 0h240v240H0z"/><path fill="#fff" d="M95 0h50v240H95zM0 95h240v50H0z"/></svg>`;
    case 'cz': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v240H0z"/><path fill="#d7141a" d="M0 240h640v240H0z"/><polygon fill="#11457e" points="0,0 300,240 0,480"/></svg>`;
    case 'hu': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#ce2939" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#477050" d="M0 320h640v160H0z"/></svg>`;
    case 'ro': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#002b7f" d="M0 0h213.3v480H0z"/><path fill="#fcd116" d="M213.3 0h213.4v480H213.3z"/><path fill="#ce1126" d="M426.7 0H640v480H426.7z"/></svg>`;
    case 'ua': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#0057b7" d="M0 0h640v240H0z"/><path fill="#ffd700" d="M0 240h640v240H0z"/></svg>`;
    case 'th': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#a51931" d="M0 0h640v480H0z"/><path fill="#f4f5f8" d="M0 80h640v320H0z"/><path fill="#2d2a4a" d="M0 160h640v160H0z"/></svg>`;
    case 'bd': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#006a4e" d="M0 0h640v480H0z"/><circle cx="270" cy="240" r="140" fill="#f42a41"/></svg>`;
    case 'il': return `<svg class="flag-icon" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v480H0z"/><path fill="#0038b8" d="M0 60h640v60H0zM0 360h640v60H0z"/><polygon fill="none" stroke="#0038b8" stroke-width="12" points="320,175 365,255 275,255"/><polygon fill="none" stroke="#0038b8" stroke-width="12" points="320,295 365,215 275,215"/></svg>`;
    default: return `<svg class="flag-icon" viewBox="0 0 640 480"><rect width="640" height="480" fill="#94a3b8"/></svg>`;
  }
}

// Helper: 30 Languages Definition
const languages = [
  { code: 'en', country: 'us', name: 'English', native: 'English' },
  { code: 'es', country: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', country: 'fr', name: 'French', native: 'Français' },
  { code: 'de', country: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', country: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', country: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ja', country: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', country: 'ko', name: 'Korean', native: '한국어' },
  { code: 'zh-CN', country: 'cn', name: 'Chinese (Simp)', native: '中文 (简体)' },
  { code: 'zh-TW', country: 'tw', name: 'Chinese (Trad)', native: '中文 (繁體)' },
  { code: 'hi', country: 'in', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ar', country: 'sa', name: 'Arabic', native: 'العربية' },
  { code: 'ru', country: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'tr', country: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'id', country: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'vi', country: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'nl', country: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'pl', country: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'sv', country: 'se', name: 'Swedish', native: 'Svenska' },
  { code: 'no', country: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'da', country: 'dk', name: 'Danish', native: 'Dansk' },
  { code: 'fi', country: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'el', country: 'gr', name: 'Greek', native: 'Ελληνικά' },
  { code: 'cs', country: 'cz', name: 'Czech', native: 'Čeština' },
  { code: 'hu', country: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'ro', country: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'uk', country: 'ua', name: 'Ukrainian', native: 'Українська' },
  { code: 'th', country: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'bn', country: 'bd', name: 'Bengali', native: 'বাংলা' },
  { code: 'he', country: 'il', name: 'Hebrew', native: 'עברית' }
];

// Helper: Common Footer HTML matching exact reference design with 30 languages
function getFooterHtml() {
  const langGridHtml = languages
    .map(
      (l) => `
        <button type="button" class="lang-card ${l.code === 'en' ? 'active' : ''}" data-code="${l.code}" data-country="${l.country}" data-name="${l.name.toLowerCase()}" data-native="${l.native.toLowerCase()}" onclick="window.mompdfSelectLang && window.mompdfSelectLang('${l.name}', '${l.code}', '${l.country}'); event.stopPropagation();">
          <div class="lang-card-left">
            <div class="lang-flag-box">
              ${getFlagSvg(l.country)}
            </div>
            <div class="lang-card-text">
              <span class="lang-name-native">${l.native}</span>
              <span class="lang-name-en">${l.name}</span>
            </div>
          </div>
          <div class="lang-check">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </button>
      `
    )
    .join('');

  return `
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <!-- Column 1: PRODUCT -->
        <div class="footer-col">
          <h4 data-i18n="product">PRODUCT</h4>
          <ul>
            <li><a href="index.html" data-i18n="home">Home</a></li>
            <li><a href="features.html" data-i18n="features">Features</a></li>
            <li><a href="pricing.html" data-i18n="pricing">Pricing</a></li>
            <li><a href="index.html#all-tools">Tools</a></li>
            <li><a href="faq.html">FAQ</a></li>
          </ul>
        </div>

        <!-- Column 2: RESOURCES -->
        <div class="footer-col">
          <h4 data-i18n="resources">RESOURCES</h4>
          <ul>
            <li><a href="desktop.html">MomPDF Desktop</a></li>
            <li><a href="mobile.html">MomPDF Mobile</a></li>
            <li><a href="sign-pdf.html">MomSign</a></li>
            <li><a href="api.html">MomAPI</a></li>
            <li><a href="jpg_to_pdf.html">MomIMG</a></li>
          </ul>
        </div>

        <!-- Column 3: SOLUTIONS -->
        <div class="footer-col">
          <h4 data-i18n="solutions">SOLUTIONS</h4>
          <ul>
            <li><a href="business.html">Business</a></li>
            <li><a href="education.html">Education</a></li>
          </ul>
        </div>

        <!-- Column 4: LEGAL -->
        <div class="footer-col">
          <h4 data-i18n="legal">LEGAL</h4>
          <ul>
            <li><a href="security.html">Security</a></li>
            <li><a href="privacy.html" data-i18n="privacy_policy_1">Privacy policy</a></li>
            <li><a href="terms.html">Terms &amp; conditions</a></li>
            <li><a href="cookies.html" data-i18n="cookies">Cookies</a></li>
          </ul>
        </div>

        <!-- Column 5: COMPANY -->
        <div class="footer-col">
          <h4 data-i18n="company">COMPANY</h4>
          <ul>
            <li><a href="about.html" data-i18n="about_us">About us</a></li>
            <li><a href="contact.html" data-i18n="contact_us">Contact us</a></li>
            <li><a href="blog.html" data-i18n="blog">Blog</a></li>
            <li><a href="press.html" data-i18n="press">Press</a></li>
          </ul>
        </div>

        <!-- Column 6: STORE BADGES -->
        <div class="footer-stores-col">
          <!-- Google Play -->
          <a href="#" class="store-badge" title="Get it on Google Play">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3.6 2.4l12.7 12.7-3.9 3.9L3.6 2.4z" fill="#00E676"/>
              <path d="M3.6 21.6l12.7-12.7-3.9-3.9L3.6 21.6z" fill="#FF3D00"/>
              <path d="M3.6 2.4v19.2l12.7-9.6L3.6 2.4z" fill="#00B0FF"/>
              <path d="M19.4 10.1l-3.1-1.8-3.9 3.7 3.9 3.7 3.1-1.8c.9-.5.9-1.4 0-1.9z" fill="#FFD600"/>
            </svg>
            <div class="store-badge-text">
              <span class="store-badge-sub">GET IT ON</span>
              <span class="store-badge-name">Google Play</span>
            </div>
          </a>

          <!-- App Store -->
          <a href="#" class="store-badge" title="Download on the App Store">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.13.64-2.79 1.41-.58.67-.99 1.74-.95 2.78 1.07.08 2.11-.57 2.73-1.32z"/>
            </svg>
            <div class="store-badge-text">
              <span class="store-badge-sub">Download on the</span>
              <span class="store-badge-name">App Store</span>
            </div>
          </a>

          <!-- Mac App Store -->
          <a href="#" class="store-badge" title="Download on the Mac App Store">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.13.64-2.79 1.41-.58.67-.99 1.74-.95 2.78 1.07.08 2.11-.57 2.73-1.32z"/>
            </svg>
            <div class="store-badge-text">
              <span class="store-badge-sub">Download on the</span>
              <span class="store-badge-name">Mac App Store</span>
            </div>
          </a>

          <!-- Microsoft Store -->
          <a href="#" class="store-badge" title="Get it from Microsoft Store">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="3" width="9" height="9" fill="#F25022"/>
              <rect x="13" y="3" width="9" height="9" fill="#7FBA00"/>
              <rect x="2" y="13" width="9" height="9" fill="#00A4EF"/>
              <rect x="13" y="13" width="9" height="9" fill="#FFB900"/>
            </svg>
            <div class="store-badge-text">
              <span class="store-badge-name" style="font-size:12.5px; margin-top:0;">Microsoft Store</span>
            </div>
          </a>
        </div>
      </div>

      <!-- Divider -->
      <div class="footer-divider">
        <div class="footer-bottom-bar">
          <!-- Language Selector Pill -->
          <div class="footer-lang-wrapper">
            <button type="button" class="footer-lang-pill" id="footerLangBtn" onclick="window.mompdfOpenLangModal(); event.stopPropagation();" aria-expanded="false" aria-haspopup="dialog">
              <span id="currentLangFlagSvg" class="pill-flag-svg">${getFlagSvg('us')}</span>
              <span id="currentLangLabel">English</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>

          <!-- Right Cluster: Socials + Copyright (No GitHub) -->
          <div class="footer-right-cluster">
            <div class="footer-social-icons">
              <!-- X / Twitter -->
              <a href="https://twitter.com" target="_blank" rel="noopener" class="social-icon-link" title="X / Twitter" aria-label="X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <!-- Facebook -->
              <a href="https://facebook.com" target="_blank" rel="noopener" class="social-icon-link" title="Facebook" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <!-- LinkedIn -->
              <a href="https://linkedin.com" target="_blank" rel="noopener" class="social-icon-link" title="LinkedIn" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M7.86 18.5V10.13H5.07v8.37z"/></svg>
              </a>
              <!-- Instagram -->
              <a href="https://instagram.com" target="_blank" rel="noopener" class="social-icon-link" title="Instagram" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <!-- TikTok -->
              <a href="https://tiktok.com" target="_blank" rel="noopener" class="social-icon-link" title="TikTok" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
              <!-- Reddit -->
              <a href="https://reddit.com" target="_blank" rel="noopener" class="social-icon-link" title="Reddit" aria-label="Reddit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
              </a>
            </div>
            <div class="footer-copyright-text">
              &copy; MomPDF 2026 &reg; - Everything PDF in One Place
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <!-- Luxury SaaS Language Selection Modal -->
  <div class="footer-lang-backdrop" id="footerLangModalBackdrop" onclick="if(event.target === this) window.mompdfCloseLangModal();" role="dialog" aria-modal="true" aria-labelledby="langModalTitle">
    <div class="footer-lang-modal" onclick="event.stopPropagation();">
      <div class="lang-modal-header">
        <div class="lang-header-top">
          <div class="lang-header-title-group">
            <div class="lang-header-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <div class="lang-header-text">
              <h3 id="langModalTitle" data-i18n="select_your_language">Select your language</h3>
              <p data-i18n="choose_your_preferred_interface">Choose your preferred interface language across MomPDF tools</p>
            </div>
          </div>
          <button type="button" class="lang-modal-close" onclick="window.mompdfCloseLangModal();" aria-label="Close dialog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="lang-search-wrapper">
          <svg class="lang-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="langSearchInput" class="lang-search-input" placeholder="Search language or country (e.g. Hindi, French, Español, 日本語)..." data-i18n-placeholder="search_language_or_country" oninput="window.mompdfFilterLanguages && window.mompdfFilterLanguages(this.value);" autocomplete="off" />
        </div>
      </div>
      <div class="lang-modal-body">
        <div class="lang-grid" id="langCardsGrid">
          ${langGridHtml}
          <div class="lang-empty-state" id="langEmptyState">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <h4 data-i18n="no_languages_found">No languages found</h4>
            <p data-i18n="try_searching_with_another">Try searching with another keyword or native script</p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// 1. Generate Homepage (index.html)
function generateHomepage() {
  const toolsCardsHtml = tools
    .map(
      (t) => `
    <a href="${t.id}.html" class="tool-card" data-category="${t.category}">
      <div class="tool-icon" style="background: ${t.iconBg}; color: ${t.iconColor};">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      </div>
      <h3 class="tool-title" data-i18n="${t.i18nKeyTitle}">${t.title}</h3>
      <p class="tool-desc" data-i18n="${t.i18nKeySubtitle}">${t.subtitle}</p>
    </a>
  `
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MomPDF - Everything PDF in One Place</title>
  <meta name="description" content="MomPDF is the complete online suite to merge, split, compress, convert, edit, sign, and protect PDF files 100% free and easy to use." />
  <meta name="keywords" content="MomPDF, merge PDF, split PDF, compress PDF, convert PDF, PDF to Word, Word to PDF, PDF to Excel, protect PDF, sign PDF" />
${getFaviconTagsHtml()}
  
  <meta property="og:title" content="MomPDF - Everything PDF in One Place" />
  <meta property="og:description" content="Merge, split, compress, convert, edit, and secure PDFs online with MomPDF." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="img/app-icon.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="MomPDF - Everything PDF in One Place" />
  <meta name="twitter:description" content="The complete PDF suite. Fast, private, and 100% free online." />

  <link rel="stylesheet" href="css/mompdf.ui.css" />
</head>
<body>
  ${getHeaderHtml()}

  <main class="main">
    <section class="hero">
      <div class="hero-badge" data-i18n="everything_pdf_in_one_place">Everything PDF in One Place</div>
      <h1 class="hero-title" data-i18n="every_tool_you_need">Every tool you need to work with PDFs</h1>
      <p class="hero-subtitle" data-i18n="allinone_platform_to_merge">All-in-one platform to merge, split, compress, convert, rotate, protect, and edit PDF files with blazing speed and zero hassle.</p>
      
      <div class="filter-tabs" id="all-tools">
        <button class="tab-btn active" data-filter="all" data-i18n="all_tools">All Tools</button>
        <button class="tab-btn" data-filter="organize" data-i18n="organize_pdf">Organize PDF</button>
        <button class="tab-btn" data-filter="optimize" data-i18n="optimize_pdf">Optimize PDF</button>
        <button class="tab-btn" data-filter="convert" data-i18n="convert_pdf">Convert PDF</button>
        <button class="tab-btn" data-filter="edit" data-i18n="edit_pdf">Edit PDF</button>
        <button class="tab-btn" data-filter="security" data-i18n="pdf_security">PDF Security</button>
        <button class="tab-btn" data-filter="intelligence" data-i18n="pdf_intelligence">PDF Intelligence</button>
      </div>
    </section>

    <section class="tools-grid">
      ${toolsCardsHtml}
    </section>
  </main>

  ${getFooterHtml()}

  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), html);
  console.log('Generated index.html');
}

// 2. Generate Individual Tool Pages
function generateToolPages() {
  tools.forEach((tool) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${tool.title} — MomPDF</title>
  <meta name="description" content="${tool.subtitle}" />
  <meta name="author" content="MomPDF" />
${getFaviconTagsHtml()}
  
  <meta property="og:title" content="${tool.title} — MomPDF" />
  <meta property="og:description" content="${tool.subtitle}" />
  <meta property="og:type" content="website" />
  
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <link rel="stylesheet" href="css/mompdf.workspace.css" />
  <script>window.mompdfTool = "${tool.id}";</script>
</head>
<body>
  ${getHeaderHtml(tool.id)}

  <!-- Dedicated PDF Tool Workspace Application -->
  <main id="workspaceApp"></main>

  ${getFooterHtml()}

  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.workspace.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, `${tool.id}.html`), html);
    console.log(`Generated ${tool.id}.html`);
  });
}

// 3. Generate Pricing, Contact, Features, Login, Register
function generateMarketingPages() {

  // Contact Page (With Founder Md Rahmat Ansari & direct email rahmatansari4171@gmail.com)
  const contactHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contact Us — MomPDF | Founder &amp; Leadership Support</title>
  <meta name="description" content="Contact MomPDF Founder &amp; Principal Systems Architect Md Rahmat Ansari directly. 24/7 technical assistance and enterprise support." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    .contact-container {
      max-width: 1100px;
      margin: 0 auto 80px;
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 32px;
      padding: 0 24px;
    }
    @media (max-width: 860px) {
      .contact-container {
        grid-template-columns: 1fr;
      }
    }
    .founder-card {
      background: #FFFFFF;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 32px;
      box-shadow: var(--shadow-sm);
    }
    .founder-avatar-box {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 18px;
      box-shadow: 0 8px 20px rgba(225, 29, 72, 0.25);
    }
    .founder-name {
      font-size: 22px;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 4px;
    }
    .founder-role {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 14px;
    }
    .contact-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #ECFDF5;
      color: #059669;
      border: 1px solid #A7F3D0;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .info-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 14px;
      background: #F8FAFC;
      border-radius: 12px;
      border: 1px solid #F1F5F9;
    }
    .info-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #FFE4E6;
      color: #E11D48;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .info-content h5 {
      margin: 0 0 2px;
      font-size: 13px;
      font-weight: 700;
      color: var(--text-main);
    }
    .info-content a, .info-content p {
      margin: 0;
      font-size: 14px;
      color: #475569;
      text-decoration: none;
      word-break: break-all;
    }
    .info-content a:hover {
      color: var(--primary);
      text-decoration: underline;
    }
    .linkedin-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: #0A66C2;
      color: #FFFFFF !important;
      border-radius: 10px;
      font-size: 13.5px;
      font-weight: 700;
      text-decoration: none;
      margin-top: 20px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.25);
    }
    .linkedin-btn:hover {
      background: #004182;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <section class="hero">
      <div class="hero-badge">Direct Communication</div>
      <h1 class="hero-title">Get in touch with MomPDF</h1>
      <p class="hero-subtitle">Have questions, feedback, or enterprise inquiries? Connect directly with the founder and support team.</p>
    </section>

    <div class="contact-container">
      <!-- Founder & Leadership Card -->
      <div class="founder-card">
        <div class="founder-avatar-box">RA</div>
        <h3 class="founder-name">Md Rahmat Ansari</h3>
        <div class="founder-role">Founder &amp; Principal Architect</div>
        <div class="contact-badge">● Available for Global Inquiries</div>
        
        <p style="font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
          Leading the development and vision of MomPDF to make digital document workflows fast, private, and effortless for everyone worldwide.
        </p>

        <ul class="info-list">
          <li class="info-item">
            <div class="info-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div class="info-content">
              <h5>Direct Founder Email</h5>
              <a href="mailto:rahmatansari4171@gmail.com">rahmatansari4171@gmail.com</a>
            </div>
          </li>
          <li class="info-item">
            <div class="info-icon" style="background:#EFF6FF; color:#2563EB;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </div>
            <div class="info-content">
              <h5>LinkedIn Profile</h5>
              <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener">linkedin.com/in/mdrahmat</a>
            </div>
          </li>
          <li class="info-item">
            <div class="info-icon" style="background:#F0FDF4; color:#16A34A;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="info-content">
              <h5>Response Time</h5>
              <p>Typically within 2–4 hours (24/7 Global)</p>
            </div>
          </li>
        </ul>

        <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="linkedin-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M7.86 18.5V10.13H5.07v8.37z"/></svg>
          Connect on LinkedIn
        </a>
      </div>

      <!-- Interactive Contact Form -->
      <div style="background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 16px; padding: 36px; box-shadow: var(--shadow-sm);">
        <h3 style="font-size: 20px; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">Send a Direct Message</h3>
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px;">Fill out the form below and our team will get back to you promptly.</p>

        <form onsubmit="event.preventDefault(); alert('Thank you! Your message has been sent directly to Md Rahmat Ansari and the MomPDF team (rahmatansari4171@gmail.com).');">
          <div class="control-group">
            <label class="control-label">Your Name</label>
            <input type="text" required class="control-input" placeholder="e.g. Alex Johnson" />
          </div>
          <div class="control-group">
            <label class="control-label">Your Email Address</label>
            <input type="email" required class="control-input" placeholder="alex@company.com" />
          </div>
          <div class="control-group">
            <label class="control-label">Inquiry Topic</label>
            <select class="control-select">
              <option>General Support / Question</option>
              <option>Business &amp; Enterprise Solution</option>
              <option>API &amp; Developer Integration</option>
              <option>Security &amp; Privacy Inquiry</option>
              <option>Feedback &amp; Feature Request</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label">Message Details</label>
            <textarea required class="control-input" rows="5" placeholder="How can we assist you with MomPDF today?"></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
            Send Message &rarr;
          </button>
        </form>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'contact.html'), contactHtml);

  // About Page (Ultra-Professional Executive SaaS Design)
  const aboutHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About MomPDF — Executive Leadership &amp; Architecture</title>
  <meta name="description" content="Learn about MomPDF, our mission for zero-retention document processing, and Founder Md Rahmat Ansari." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    :root {
      --about-gradient: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      --dark-card: #0F172A;
    }
    
    .about-wrap {
      max-width: 1140px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }

    /* Hero Badges */
    .hero-trust-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .trust-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }

    /* Executive Founder Spotlight */
    .executive-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 24px;
      padding: 44px;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.06);
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 40px;
      align-items: center;
      margin: 48px 0 70px;
      position: relative;
      overflow: hidden;
    }
    .executive-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #E11D48, #F43F5E, #FB7185);
    }
    @media (max-width: 860px) {
      .executive-card {
        grid-template-columns: 1fr;
        text-align: center;
        padding: 32px 24px;
        gap: 28px;
      }
    }
    .founder-media {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .founder-avatar-luxury {
      width: 150px;
      height: 150px;
      border-radius: 28px;
      background: linear-gradient(135deg, #E11D48 0%, #9F1239 100%);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: 900;
      letter-spacing: 1px;
      box-shadow: 0 16px 32px rgba(225, 29, 72, 0.28);
      position: relative;
      margin-bottom: 16px;
    }
    .verified-badge {
      position: absolute;
      bottom: -6px;
      right: -6px;
      background: #059669;
      color: #FFFFFF;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #FFFFFF;
      font-size: 14px;
    }
    .founder-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: #ECFDF5;
      color: #059669;
      border: 1px solid #A7F3D0;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
    }
    .founder-status::before {
      content: "";
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
    }
    .executive-content h2 {
      font-size: 28px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 4px;
      letter-spacing: -0.5px;
    }
    .executive-title {
      font-size: 15px;
      font-weight: 700;
      color: #E11D48;
      margin-bottom: 16px;
    }
    .executive-quote {
      position: relative;
      background: #F8FAFC;
      border-left: 4px solid #E11D48;
      border-radius: 0 14px 14px 0;
      padding: 18px 24px;
      font-size: 14.5px;
      color: #334155;
      line-height: 1.7;
      margin-bottom: 20px;
      font-style: italic;
    }
    .executive-actions {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }
    @media (max-width: 860px) {
      .executive-actions {
        justify-content: center;
      }
    }
    .btn-linkedin-vip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 22px;
      background: #0A66C2;
      color: #FFFFFF !important;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 6px 18px rgba(10, 102, 194, 0.25);
      transition: all 0.2s ease;
    }
    .btn-linkedin-vip:hover {
      background: #004182;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(10, 102, 194, 0.35);
    }
    .btn-email-vip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 20px;
      background: #F1F5F9;
      color: #1E293B !important;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-email-vip:hover {
      background: #E2E8F0;
      border-color: #CBD5E1;
      transform: translateY(-1px);
    }

    /* Section Headings */
    .section-head-center {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 44px;
    }
    .section-tag {
      display: inline-block;
      padding: 4px 12px;
      background: #FFE4E6;
      color: #E11D48;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .section-title {
      font-size: 28px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 10px;
      letter-spacing: -0.5px;
    }
    .section-subtitle {
      font-size: 15px;
      color: #64748B;
      line-height: 1.6;
      margin: 0;
    }

    /* 4 Core Pillars Grid */
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 70px;
    }
    .pillar-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 18px;
      padding: 30px 26px;
      transition: all 0.25s ease;
      position: relative;
    }
    .pillar-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 32px -10px rgba(0,0,0,0.08);
      border-color: #FDA4AF;
    }
    .pillar-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 18px;
    }
    .pillar-card h4 {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .pillar-card p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.65;
      margin: 0;
    }

    /* Architecture & Milestones Roadmap */
    .roadmap-section {
      background: #F8FAFC;
      border: 1.5px solid #E2E8F0;
      border-radius: 24px;
      padding: 44px;
      margin-bottom: 70px;
    }
    @media (max-width: 768px) {
      .roadmap-section {
        padding: 30px 20px;
      }
    }
    .timeline-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      margin-top: 32px;
    }
    .timeline-item {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 24px 20px;
      position: relative;
    }
    .timeline-num {
      display: inline-block;
      font-size: 12px;
      font-weight: 900;
      color: #E11D48;
      background: #FFE4E6;
      padding: 2px 8px;
      border-radius: 6px;
      margin-bottom: 10px;
    }
    .timeline-item h5 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
    }
    .timeline-item p {
      font-size: 13px;
      color: #64748B;
      line-height: 1.6;
      margin: 0;
    }

    /* High-Impact Dark Metric Bar */
    .metrics-bar-dark {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      border-radius: 24px;
      padding: 48px 36px;
      color: #FFFFFF;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 28px;
      text-align: center;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.35);
      margin-bottom: 70px;
    }
    @media (max-width: 768px) {
      .metrics-bar-dark {
        grid-template-columns: repeat(2, 1fr);
        padding: 32px 20px;
      }
    }
    .metric-number-glow {
      font-size: 38px;
      font-weight: 900;
      color: #FDA4AF;
      letter-spacing: -1px;
      margin-bottom: 4px;
    }
    .metric-label-muted {
      font-size: 13.5px;
      color: #94A3B8;
      font-weight: 600;
    }

    /* FAQ Box */
    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
      margin-bottom: 70px;
    }
    .faq-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 24px;
    }
    .faq-card h4 {
      font-size: 15.5px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .faq-card p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.65;
      margin: 0;
    }

    /* Final CTA */
    .about-cta-banner {
      background: linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%);
      border: 1.5px solid #FECDD3;
      border-radius: 24px;
      padding: 48px 36px;
      text-align: center;
    }
    .about-cta-banner h3 {
      font-size: 26px;
      font-weight: 900;
      color: #881337;
      margin: 0 0 8px;
    }
    .about-cta-banner p {
      font-size: 15px;
      color: #9F1239;
      max-width: 600px;
      margin: 0 auto 24px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge" data-i18n="about_mompdf">About MomPDF</div>
      <h1 class="hero-title" style="max-width: 860px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        Reimagining Document Productivity for the Modern World
      </h1>
      <p class="hero-subtitle" style="max-width: 720px; margin: 0 auto; font-size: 16.5px;">
        MomPDF is built with a singular vision: to eliminate slow, expensive, and ad-ridden document tools with an instant, privacy-first PDF utility accessible to everyone globally.
      </p>

      <div class="hero-trust-bar">
        <span class="trust-chip">🔒 100% Ephemeral Shredding</span>
        <span class="trust-chip">⚡ Sub-Second Execution</span>
        <span class="trust-chip">🌐 30 Native Languages</span>
        <span class="trust-chip">🛡️ Zero Data Retention</span>
      </div>
    </section>

    <div class="about-wrap">
      <!-- Executive Founder Spotlight -->
      <div class="executive-card">
        <div class="founder-media">
          <div class="founder-avatar-luxury">
            RA
            <div class="verified-badge" title="Verified Founder">✓</div>
          </div>
          <div class="founder-status">Available Worldwide</div>
        </div>

        <div class="executive-content">
          <div style="display:inline-block; padding:3px 10px; background:#FFE4E6; color:#E11D48; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Executive Leadership</div>
          <h2>Md Rahmat Ansari</h2>
          <div class="executive-title">Founder, CEO &amp; Principal Systems Architect — MomPDF</div>
          
          <div class="executive-quote">
            "Every day, millions of students, researchers, freelancers, and enterprises struggle with complex software that demands hefty subscriptions or compromises document privacy. We engineered MomPDF from the ground up to solve this: instantaneous speed, strict zero-log security, automatic 15-minute file shredding, and complete ad-free simplicity."
          </div>

          <div class="executive-actions">
            <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn-linkedin-vip">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M7.86 18.5V10.13H5.07v8.37z"/></svg>
              Connect with Md Rahmat on LinkedIn
            </a>
            <a href="mailto:rahmatansari4171@gmail.com" class="btn-email-vip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              rahmatansari4171@gmail.com
            </a>
          </div>
        </div>
      </div>

      <!-- Core Pillars -->
      <div class="section-head-center">
        <span class="section-tag">Core Architecture</span>
        <h3 class="section-title">Engineered on 4 Uncompromising Pillars</h3>
        <p class="section-subtitle">MomPDF was architected to be the fastest, safest, and most versatile document suite available on the open web.</p>
      </div>

      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FFE4E6; color:#E11D48;">⚡</div>
          <h4>Lightning-Fast Performance</h4>
          <p>In-memory multi-threaded execution handles multi-hundred-page files with sub-second response times.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#ECFDF5; color:#059669;">🔒</div>
          <h4>100% Privacy &amp; Auto-Shredding</h4>
          <p>All files are processed in air-gapped sandboxes and cryptographically shredded within 15 minutes. Zero logs, zero data mining.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#EFF6FF; color:#2563EB;">🌐</div>
          <h4>30 Languages &amp; RTL Support</h4>
          <p>Accessible worldwide in 30 native languages with instant real-time translation and native bidirectional (RTL) layout rendering.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FAF5FF; color:#9333EA;">🛠️</div>
          <h4>Complete 30+ PDF Suite</h4>
          <p>From Merge, Split, and Compress to AI PDF Summarizer, OCR Text Recognition, Redaction, and Digital Signatures.</p>
        </div>
      </div>

      <!-- Engineering Roadmap -->
      <div class="roadmap-section">
        <div style="text-align:center; max-width:600px; margin:0 auto 20px;">
          <span class="section-tag">Our Journey</span>
          <h3 class="section-title" style="font-size:24px;">How MomPDF Came to Life</h3>
          <p class="section-subtitle">A journey focused on solving real-world productivity hurdles for millions.</p>
        </div>

        <div class="timeline-list">
          <div class="timeline-item">
            <span class="timeline-num">Phase 01</span>
            <h5>The Inception</h5>
            <p>Frustrated by paywalled, slow, and insecure document tools, founder Md Rahmat Ansari conceptualized MomPDF.</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-num">Phase 02</span>
            <h5>In-Memory Architecture</h5>
            <p>Engineered a high-performance backend capable of transforming complex PDF streams in pure RAM memory.</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-num">Phase 03</span>
            <h5>15-Minute Shredding</h5>
            <p>Implemented strict automated data lifecycle policies to ensure zero document retention on any servers.</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-num">Phase 04</span>
            <h5>Global Scale</h5>
            <p>Expanded to 30 native languages with custom RTL engines, serving users across 150+ countries worldwide.</p>
          </div>
        </div>
      </div>

      <!-- Dark Executive Metrics Bar -->
      <div class="metrics-bar-dark">
        <div>
          <div class="metric-number-glow">30+</div>
          <div class="metric-label-muted">Specialized PDF Tools</div>
        </div>
        <div>
          <div class="metric-number-glow">15 min</div>
          <div class="metric-label-muted">Auto Cryptographic Purge</div>
        </div>
        <div>
          <div class="metric-number-glow">30</div>
          <div class="metric-label-muted">Global Native Languages</div>
        </div>
        <div>
          <div class="metric-number-glow">&lt; 1.2s</div>
          <div class="metric-label-muted">Average Conversion Latency</div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="section-head-center">
        <span class="section-tag">Transparency</span>
        <h3 class="section-title">Frequently Asked Questions</h3>
      </div>

      <div class="faq-grid">
        <div class="faq-card">
          <h4>🛡️ How does MomPDF protect my documents?</h4>
          <p>All communication is secured with TLS 1.3 encryption. Files are processed in isolated memory environments and automatically shredded permanently within 15 minutes of upload.</p>
        </div>
        <div class="faq-card">
          <h4>💼 Who leads MomPDF development?</h4>
          <p>MomPDF was designed, architected, and founded by <strong>Md Rahmat Ansari</strong> with a commitment to maintaining a fast, privacy-first, and universally accessible toolsuite.</p>
        </div>
        <div class="faq-card">
          <h4>💯 Are all 30 tools completely free to use?</h4>
          <p>Yes. MomPDF provides high-performance tools (Merge, Split, OCR, AI Summarize, Compress, Protect, etc.) without requiring costly software subscriptions.</p>
        </div>
        <div class="faq-card">
          <h4>🌍 Does MomPDF work on mobile and tablets?</h4>
          <p>Yes. The entire MomPDF web app is fully responsive and optimized for seamless use on iOS, Android, macOS, Windows, and Linux browsers.</p>
        </div>
      </div>

      <!-- Call to Action Banner -->
      <div class="about-cta-banner">
        <h3>Ready to experience the next generation of PDF tools?</h3>
        <p>Explore our complete catalog of 30+ tools or connect directly with our founder for business and developer integrations.</p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="index.html" class="btn btn-primary btn-lg">Explore All PDF Tools &rarr;</a>
          <a href="contact.html" class="btn btn-secondary btn-lg">Contact Leadership</a>
        </div>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'about.html'), aboutHtml);

  // Blog Page (Ultra-Professional Tech & Engineering Hub)
  const blogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Blog &amp; Engineering Journal — MomPDF</title>
  <meta name="description" content="Technical deep dives, document architecture, privacy insights, and productivity guides from Founder Md Rahmat Ansari and the MomPDF team." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    .blog-wrap {
      max-width: 1140px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }

    /* Filter & Search Bar */
    .blog-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 36px;
      flex-wrap: wrap;
    }
    .blog-filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .filter-pill {
      padding: 7px 16px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13.5px;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .filter-pill:hover, .filter-pill.active {
      background: var(--primary);
      color: #FFFFFF;
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2);
    }
    .blog-search-box {
      position: relative;
      min-width: 260px;
    }
    .blog-search-input {
      width: 100%;
      padding: 8px 14px 8px 36px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13.5px;
      outline: none;
      transition: all 0.2s ease;
    }
    .blog-search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1);
    }
    .blog-search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #94A3B8;
    }

    /* Featured Story Card */
    .featured-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 24px;
      padding: 36px;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.06);
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 36px;
      align-items: center;
      margin-bottom: 50px;
      position: relative;
      overflow: hidden;
    }
    .featured-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #E11D48, #BE123C);
    }
    @media (max-width: 860px) {
      .featured-card {
        grid-template-columns: 1fr;
        padding: 28px 20px;
      }
    }
    .tag-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #FFE4E6;
      color: #E11D48;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .featured-card h2 {
      font-size: 26px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 12px;
      line-height: 1.35;
      letter-spacing: -0.5px;
    }
    .featured-card p {
      font-size: 14.5px;
      color: #475569;
      line-height: 1.7;
      margin: 0 0 20px;
    }
    .author-bar {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 800;
    }
    .author-info h6 {
      margin: 0;
      font-size: 13.5px;
      font-weight: 800;
      color: #0F172A;
    }
    .author-info span {
      font-size: 12px;
      color: #64748B;
    }
    .featured-visual {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      border-radius: 18px;
      padding: 32px;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 220px;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.25);
    }

    /* Blog Grid */
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 28px;
      margin-bottom: 70px;
    }
    .article-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s ease;
      cursor: pointer;
    }
    .article-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 32px -10px rgba(0,0,0,0.08);
      border-color: #FDA4AF;
    }
    .article-card h3 {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 10px;
      line-height: 1.4;
    }
    .article-card p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.65;
      margin: 0 0 20px;
    }
    .article-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 1px solid #F1F5F9;
    }
    .read-time {
      font-size: 12.5px;
      color: #94A3B8;
      font-weight: 600;
    }
    .read-link {
      font-size: 13px;
      font-weight: 700;
      color: var(--primary);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .read-link:hover {
      text-decoration: underline;
    }

    /* Newsletter Box */
    .newsletter-card {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      border-radius: 24px;
      padding: 44px 36px;
      color: #FFFFFF;
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 32px;
      align-items: center;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.35);
      margin-bottom: 60px;
    }
    @media (max-width: 860px) {
      .newsletter-card {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
    .newsletter-form {
      display: flex;
      gap: 10px;
    }
    @media (max-width: 540px) {
      .newsletter-form {
        flex-direction: column;
      }
    }
    .newsletter-input {
      flex: 1;
      padding: 12px 18px;
      border-radius: 12px;
      border: 1px solid #334155;
      background: rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
      font-size: 14px;
      outline: none;
    }
    .newsletter-input:focus {
      border-color: var(--primary);
      background: rgba(255, 255, 255, 0.12);
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">MomPDF Engineering &amp; Insights</div>
      <h1 class="hero-title" style="max-width: 860px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        The MomPDF Blog &amp; Technology Hub
      </h1>
      <p class="hero-subtitle" style="max-width: 720px; margin: 0 auto; font-size: 16.5px;">
        Architectural deep dives, zero-retention privacy protocols, performance benchmarks, and document guides by Founder Md Rahmat Ansari and the MomPDF team.
      </p>
    </section>

    <div class="blog-wrap">
      <!-- Toolbar & Category Filter -->
      <div class="blog-toolbar">
        <div class="blog-filters">
          <button class="filter-pill active" onclick="filterBlog('all')">All Articles</button>
          <button class="filter-pill" onclick="filterBlog('engineering')">Engineering</button>
          <button class="filter-pill" onclick="filterBlog('security')">Security &amp; Privacy</button>
          <button class="filter-pill" onclick="filterBlog('ai')">AI &amp; OCR</button>
          <button class="filter-pill" onclick="filterBlog('productivity')">Productivity</button>
          <button class="filter-pill" onclick="filterBlog('guides')">Guides</button>
        </div>

        <div class="blog-search-box">
          <svg class="blog-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="blogSearch" class="blog-search-input" placeholder="Search insights..." onkeyup="searchBlog()" />
        </div>
      </div>

      <!-- Featured Story -->
      <div class="featured-card article-item" data-category="security">
        <div>
          <span class="tag-badge">Featured Deep Dive • Security</span>
          <h2>How Ephemeral In-Memory Architecture Enables 100% Zero-Retention PDF Security</h2>
          <p>
            A behind-the-scenes look into MomPDF's cryptographic 15-minute file shredding protocol, air-gapped memory sandboxes, and why memory-only processing is replacing traditional disk-based document converters.
          </p>
          <div class="author-bar">
            <div class="author-avatar">RA</div>
            <div class="author-info">
              <h6>Md Rahmat Ansari</h6>
              <span>Founder &amp; Principal Architect • 5 min read • Aug 2026</span>
            </div>
          </div>
        </div>
        <div class="featured-visual">
          <div style="font-family:monospace; font-size:12px; color:#38BDF8; margin-bottom:8px;">// Ephemeral Shredding Protocol</div>
          <div style="font-size:18px; font-weight:800; margin-bottom:8px;">Isolation Sandboxing in Pure RAM</div>
          <p style="font-size:13px; color:#94A3B8; margin:0; line-height:1.6;">
            Incoming PDF streams are decrypted via TLS 1.3, processed in isolated RAM heap buffers, and cryptographically purged at 15 minutes.
          </p>
        </div>
      </div>

      <!-- Article Grid -->
      <div class="blog-grid" id="blogGrid">
        <!-- 1. Engineering -->
        <div class="article-card article-item" data-category="engineering">
          <div>
            <span class="tag-badge" style="background:#EFF6FF; color:#2563EB;">Engineering</span>
            <h3>Sub-Second PDF Merging: Optimizing Multi-Threaded PDF-Lib Pipelines in Node.js</h3>
            <p>How we eliminated disk I/O bottlenecks and scaled concurrent PDF operations with WebAssembly byte-stream transforms.</p>
          </div>
          <div class="article-footer">
            <span class="read-time">4 min read • Md Rahmat Ansari</span>
            <span class="read-link">Read Article &rarr;</span>
          </div>
        </div>

        <!-- 2. AI & OCR -->
        <div class="article-card article-item" data-category="ai">
          <div>
            <span class="tag-badge" style="background:#FAF5FF; color:#9333EA;">AI &amp; OCR</span>
            <h3>Zero-Retention AI PDF Summarization Without Training on User Data</h3>
            <p>Designing stateless LLM context pipelines that extract key insights and bullet summaries while preserving complete user privacy.</p>
          </div>
          <div class="article-footer">
            <span class="read-time">5 min read • Md Rahmat Ansari</span>
            <span class="read-link">Read Article &rarr;</span>
          </div>
        </div>

        <!-- 3. Security -->
        <div class="article-card article-item" data-category="security">
          <div>
            <span class="tag-badge">Security</span>
            <h3>The Anatomy of a Cryptographic PDF Password: RC4 vs AES-256 Encryption</h3>
            <p>A deep guide to PDF security standards, document permissions, and how MomPDF guarantees military-grade password protection.</p>
          </div>
          <div class="article-footer">
            <span class="read-time">4 min read • Security Team</span>
            <span class="read-link">Read Article &rarr;</span>
          </div>
        </div>

        <!-- 4. Productivity -->
        <div class="article-card article-item" data-category="productivity">
          <div>
            <span class="tag-badge" style="background:#ECFDF5; color:#059669;">Productivity</span>
            <h3>Why PDF/A is the Global Archival Standard for Long-Term Digital Records</h3>
            <p>Everything you need to know about ISO 19005 compliance, device-independent color spaces, and embedded font preservation.</p>
          </div>
          <div class="article-footer">
            <span class="read-time">3 min read • MomPDF Editorial</span>
            <span class="read-link">Read Article &rarr;</span>
          </div>
        </div>

        <!-- 5. Product & Globalization -->
        <div class="article-card article-item" data-category="engineering">
          <div>
            <span class="tag-badge" style="background:#EFF6FF; color:#2563EB;">Engineering</span>
            <h3>Scaling Real-Time Multilingual WebApps: 30 Languages and Native RTL Layouts</h3>
            <p>How we engineered instant client-side translation with native tree-walking DOM replacement while strictly preserving technical acronyms like PDF.</p>
          </div>
          <div class="article-footer">
            <span class="read-time">5 min read • Md Rahmat Ansari</span>
            <span class="read-link">Read Article &rarr;</span>
          </div>
        </div>

        <!-- 6. Guides -->
        <div class="article-card article-item" data-category="guides">
          <div>
            <span class="tag-badge" style="background:#FFFBEB; color:#D97706;">Guides</span>
            <h3>How to Convert Scanned PDFs into Clean, Searchable, Editable Word Documents</h3>
            <p>Leveraging Tesseract OCR engines to identify multilingual glyphs and reconstruct structured paragraphs seamlessly.</p>
          </div>
          <div class="article-footer">
            <span class="read-time">4 min read • MomPDF Team</span>
            <span class="read-link">Read Article &rarr;</span>
          </div>
        </div>
      </div>

      <!-- Newsletter Subscription Card -->
      <div class="newsletter-card">
        <div>
          <h3 style="font-size:22px; font-weight:800; margin:0 0 6px;">Subscribe to MomPDF Engineering</h3>
          <p style="font-size:13.5px; color:#94A3B8; margin:0;">Get notified about new PDF tools, architecture writeups, and security updates. Zero spam, ever.</p>
        </div>
        <div>
          <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Thank you for subscribing to MomPDF Engineering insights!');">
            <input type="email" required class="newsletter-input" placeholder="Enter your work email..." />
            <button type="submit" class="btn btn-primary" style="white-space:nowrap;">Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  </main>

  <script>
    function filterBlog(cat) {
      document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      const items = document.querySelectorAll('.article-item');
      items.forEach(item => {
        if (cat === 'all' || item.getAttribute('data-category') === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    }

    function searchBlog() {
      const q = document.getElementById('blogSearch').value.toLowerCase();
      const items = document.querySelectorAll('.article-item');
      items.forEach(item => {
        const text = item.innerText.toLowerCase();
        if (text.includes(q)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    }
  </script>

  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'blog.html'), blogHtml);

  // Press Page (Ultra-Professional Press Room & Media Kit)
  const pressHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Press &amp; Media Kit — MomPDF | Official Brand Assets &amp; News</title>
  <meta name="description" content="Access official MomPDF brand assets, high-res logos, company fast facts, press releases, and media contact for founder Md Rahmat Ansari." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    .press-wrap {
      max-width: 1140px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }

    /* Fast Facts Metric Grid */
    .facts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 60px;
    }
    .fact-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }
    .fact-label {
      font-size: 12.5px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .fact-value {
      font-size: 18px;
      font-weight: 900;
      color: #0F172A;
      margin: 0;
    }

    /* Logo Asset Showcase */
    .assets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      margin-bottom: 60px;
    }
    .asset-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s ease;
    }
    .asset-card:hover {
      border-color: #FDA4AF;
      box-shadow: 0 12px 24px -8px rgba(0,0,0,0.06);
    }
    .asset-preview {
      height: 140px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      padding: 20px;
    }
    .asset-preview-light {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
    }
    .asset-preview-dark {
      background: #0F172A;
    }
    .asset-actions {
      display: flex;
      gap: 10px;
      margin-top: 14px;
    }
    .btn-asset {
      flex: 1;
      padding: 8px 14px;
      background: #F1F5F9;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 700;
      color: #334155;
      text-align: center;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-asset:hover {
      background: #E2E8F0;
      color: #0F172A;
    }

    /* Color Palette Swatches */
    .palette-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 60px;
    }
    .color-swatch {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 16px;
      overflow: hidden;
    }
    .swatch-color {
      height: 80px;
      width: 100%;
    }
    .swatch-info {
      padding: 14px 16px;
    }
    .swatch-name {
      font-size: 13.5px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 2px;
    }
    .swatch-hex {
      font-family: monospace;
      font-size: 12px;
      color: #64748B;
    }

    /* Leadership Profile Card */
    .press-leader-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 24px;
      padding: 36px;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.06);
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 32px;
      align-items: center;
      margin-bottom: 60px;
    }
    @media (max-width: 768px) {
      .press-leader-card {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
    .leader-avatar-box {
      width: 130px;
      height: 130px;
      border-radius: 24px;
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 42px;
      font-weight: 900;
      margin: 0 auto;
      box-shadow: 0 12px 28px rgba(225, 29, 72, 0.25);
    }

    /* Press Releases List */
    .releases-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 60px;
    }
    .release-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      transition: all 0.2s ease;
    }
    @media (max-width: 640px) {
      .release-card {
        flex-direction: column;
        align-items: flex-start;
      }
    }
    .release-card:hover {
      border-color: #FDA4AF;
      transform: translateX(4px);
    }
    .release-date {
      font-size: 12px;
      font-weight: 700;
      color: #E11D48;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .release-title {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
    }
    .release-summary {
      font-size: 13.5px;
      color: #64748B;
      margin: 0;
      line-height: 1.6;
    }

    /* Media Contact Card */
    .media-contact-box {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      border-radius: 24px;
      padding: 44px 36px;
      color: #FFFFFF;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 32px;
      align-items: center;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.35);
    }
    @media (max-width: 860px) {
      .media-contact-box {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">Official Press Room</div>
      <h1 class="hero-title" style="max-width: 860px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        MomPDF Press &amp; Media Kit
      </h1>
      <p class="hero-subtitle" style="max-width: 720px; margin: 0 auto; font-size: 16.5px;">
        Download official brand assets, high-resolution logos, company fast facts, press releases, and media inquiries for Founder Md Rahmat Ansari.
      </p>
    </section>

    <div class="press-wrap">
      <!-- Fast Facts Grid -->
      <div class="facts-grid">
        <div class="fact-card">
          <div class="fact-label">Founded</div>
          <div class="fact-value">2026</div>
        </div>
        <div class="fact-card">
          <div class="fact-label">Founder &amp; Principal Architect</div>
          <div class="fact-value">Md Rahmat Ansari</div>
        </div>
        <div class="fact-card">
          <div class="fact-label">Global Languages</div>
          <div class="fact-value">30 Languages (with RTL)</div>
        </div>
        <div class="fact-card">
          <div class="fact-label">Privacy Guarantee</div>
          <div class="fact-value">15-Min Auto Shred</div>
        </div>
      </div>

      <!-- Official Brand Assets -->
      <div style="margin-bottom: 24px;">
        <span class="tag-badge" style="background:#FFE4E6; color:#E11D48; display:inline-block; padding:4px 12px; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase;">Brand Assets</span>
        <h2 style="font-size:24px; font-weight:900; color:#0F172A; margin:8px 0 6px;">Official Logos &amp; Emblems</h2>
        <p style="font-size:14.5px; color:#64748B; margin:0;">Download official high-resolution vector and PNG assets for press and publication.</p>
      </div>

      <div class="assets-grid">
        <!-- 1. Primary Full Logo -->
        <div class="asset-card">
          <div>
            <div class="asset-preview asset-preview-light">
              <div style="display:flex; align-items:center; gap:10px;">
                <svg width="42" height="42" viewBox="0 0 60 60" fill="none">
                  <rect width="60" height="60" rx="18" fill="#EB234E" />
                  <path d="M 18 13 C 15.5 13 14 14.5 14 17 L 14 43 C 14 45.5 15.5 47 18 47 L 42 47 C 44.5 47 46 45.5 46 43 L 46 25 L 34 13 Z" fill="#FFFFFF" />
                  <path d="M 21 25 C 19.9 25 19 25.9 19 27 L 19 33 C 19 34.1 19.9 35 21 35 C 22.1 35 23 34.1 23 33 L 23 32 L 27 32 C 28.7 32 30 30.7 30 29 C 30 27.3 28.7 26 27 26 L 23 26 L 23 27 C 23 25.9 22.1 25 21 25 Z" fill="#E11D48" />
                </svg>
                <span style="font-size:24px; font-weight:800; color:#0F172A; letter-spacing:-0.5px;">Mom<span style="color:#FF5E7E;">PDF</span></span>
              </div>
            </div>
            <h4 style="font-size:16px; font-weight:800; color:#0F172A; margin:0 0 4px;">Primary Logo (Light Surface)</h4>
            <p style="font-size:13px; color:#64748B; margin:0;">Recommended for white and light-colored editorial layouts.</p>
          </div>
          <div class="asset-actions">
            <a href="img/mompdf.svg" download="MomPDF-Logo.svg" class="btn-asset">Download SVG</a>
            <a href="img/favicons-pdf/favicon-32x32.png" download="MomPDF-Logo.png" class="btn-asset">Download PNG</a>
          </div>
        </div>

        <!-- 2. Dark Mode Contrast Logo -->
        <div class="asset-card">
          <div>
            <div class="asset-preview asset-preview-dark">
              <div style="display:flex; align-items:center; gap:10px;">
                <svg width="42" height="42" viewBox="0 0 60 60" fill="none">
                  <rect width="60" height="60" rx="18" fill="#EB234E" />
                  <path d="M 18 13 C 15.5 13 14 14.5 14 17 L 14 43 C 14 45.5 15.5 47 18 47 L 42 47 C 44.5 47 46 45.5 46 43 L 46 25 L 34 13 Z" fill="#FFFFFF" />
                  <path d="M 21 25 C 19.9 25 19 25.9 19 27 L 19 33 C 19 34.1 19.9 35 21 35 C 22.1 35 23 34.1 23 33 L 23 32 L 27 32 C 28.7 32 30 30.7 30 29 C 30 27.3 28.7 26 27 26 L 23 26 L 23 27 C 23 25.9 22.1 25 21 25 Z" fill="#E11D48" />
                </svg>
                <span style="font-size:24px; font-weight:800; color:#FFFFFF; letter-spacing:-0.5px;">Mom<span style="color:#FF5E7E;">PDF</span></span>
              </div>
            </div>
            <h4 style="font-size:16px; font-weight:800; color:#0F172A; margin:0 0 4px;">Dark Contrast Logo</h4>
            <p style="font-size:13px; color:#64748B; margin:0;">Optimized for dark backgrounds and video overlays.</p>
          </div>
          <div class="asset-actions">
            <a href="img/mompdf-dark.svg" download="MomPDF-Dark-Logo.svg" class="btn-asset">Download SVG</a>
            <a href="img/favicons-pdf/favicon-32x32.png" download="MomPDF-Dark-Logo.png" class="btn-asset">Download PNG</a>
          </div>
        </div>

        <!-- 3. App Icon Emblem -->
        <div class="asset-card">
          <div>
            <div class="asset-preview asset-preview-light">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <rect width="60" height="60" rx="18" fill="#EB234E" />
                <path d="M 18 13 C 15.5 13 14 14.5 14 17 L 14 43 C 14 45.5 15.5 47 18 47 L 42 47 C 44.5 47 46 45.5 46 43 L 46 25 L 34 13 Z" fill="#FFFFFF" />
                <path d="M 21 25 C 19.9 25 19 25.9 19 27 L 19 33 C 19 34.1 19.9 35 21 35 C 22.1 35 23 34.1 23 33 L 23 32 L 27 32 C 28.7 32 30 30.7 30 29 C 30 27.3 28.7 26 27 26 L 23 26 L 23 27 C 23 25.9 22.1 25 21 25 Z" fill="#E11D48" />
              </svg>
            </div>
            <h4 style="font-size:16px; font-weight:800; color:#0F172A; margin:0 0 4px;">Standalone Ruby Emblem</h4>
            <p style="font-size:13px; color:#64748B; margin:0;">Icon mark for mobile apps, browser extensions, and avatars.</p>
          </div>
          <div class="asset-actions">
            <a href="img/mompdf-icon.svg" download="MomPDF-Emblem.svg" class="btn-asset">Download SVG</a>
            <a href="img/favicons-pdf/favicon-32x32.png" download="MomPDF-Emblem.png" class="btn-asset">Download PNG</a>
          </div>
        </div>
      </div>

      <!-- Color Palette -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-size:20px; font-weight:900; color:#0F172A; margin:0 0 6px;">Brand Color Palette</h3>
        <p style="font-size:14px; color:#64748B; margin:0;">Standardized hex codes for print and digital publication.</p>
      </div>

      <div class="palette-grid">
        <div class="color-swatch">
          <div class="swatch-color" style="background:#E11D48;"></div>
          <div class="swatch-info">
            <div class="swatch-name">MomPDF Crimson</div>
            <div class="swatch-hex">#E11D48</div>
          </div>
        </div>
        <div class="color-swatch">
          <div class="swatch-color" style="background:#0F172A;"></div>
          <div class="swatch-info">
            <div class="swatch-name">Deep Navy Slate</div>
            <div class="swatch-hex">#0F172A</div>
          </div>
        </div>
        <div class="color-swatch">
          <div class="swatch-color" style="background:#059669;"></div>
          <div class="swatch-info">
            <div class="swatch-name">Emerald Security</div>
            <div class="swatch-hex">#059669</div>
          </div>
        </div>
        <div class="color-swatch">
          <div class="swatch-color" style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;"></div>
          <div class="swatch-info">
            <div class="swatch-name">Surface Slate</div>
            <div class="swatch-hex">#F8FAFC</div>
          </div>
        </div>
      </div>

      <!-- Executive Leadership & Spokesperson -->
      <div class="press-leader-card">
        <div>
          <div class="leader-avatar-box">RA</div>
        </div>
        <div>
          <div style="display:inline-block; padding:3px 10px; background:#FFE4E6; color:#E11D48; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase; margin-bottom:8px;">Executive Spokesperson</div>
          <h3 style="font-size:24px; font-weight:900; color:#0F172A; margin:0 0 4px;">Md Rahmat Ansari</h3>
          <p style="font-size:14px; font-weight:700; color:#E11D48; margin:0 0 12px;">Founder &amp; Principal Systems Architect</p>
          <p style="font-size:14px; color:#475569; line-height:1.7; margin:0 0 16px;">
            "MomPDF was built to redefine the standard of document management—delivering enterprise-grade performance, ISO-aligned privacy, and 30-language accessibility without charging users a dime or harvesting their personal data."
          </p>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:13.5px; padding:8px 18px;">LinkedIn Profile &rarr;</a>
            <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-secondary" style="font-size:13.5px; padding:8px 18px;">Email Md Rahmat</a>
          </div>
        </div>
      </div>

      <!-- Press Releases -->
      <div style="margin-bottom: 24px;">
        <span class="tag-badge" style="background:#EFF6FF; color:#2563EB; display:inline-block; padding:4px 12px; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase;">Recent Announcements</span>
        <h2 style="font-size:24px; font-weight:900; color:#0F172A; margin:8px 0 6px;">Official Press Releases</h2>
      </div>

      <div class="releases-list">
        <div class="release-card">
          <div>
            <div class="release-date">August 2026 • Product Milestone</div>
            <h4 class="release-title">MomPDF Launches 30-Language Global UI with Native RTL Support</h4>
            <p class="release-summary">Empowering millions in 150+ countries with instant, zero-latency client-side localization while preserving standard document acronyms.</p>
          </div>
          <a href="blog.html" class="btn btn-secondary" style="font-size:13px; white-space:nowrap;">Read Article &rarr;</a>
        </div>

        <div class="release-card">
          <div>
            <div class="release-date">August 2026 • Security &amp; Privacy</div>
            <h4 class="release-title">MomPDF Implements 15-Minute Automated Ephemeral File Shredding</h4>
            <p class="release-summary">Setting a new benchmark for document security by executing in-memory transforms with strict cryptographic data wipeouts.</p>
          </div>
          <a href="about.html" class="btn btn-secondary" style="font-size:13px; white-space:nowrap;">Learn More &rarr;</a>
        </div>

        <div class="release-card">
          <div>
            <div class="release-date">August 2026 • AI &amp; Innovation</div>
            <h4 class="release-title">MomPDF Rolls Out Zero-Retention AI PDF Summarizer and Multilingual OCR</h4>
            <p class="release-summary">Delivering intelligent document extraction without retaining or training machine learning models on user files.</p>
          </div>
          <a href="pdf-summarize.html" class="btn btn-secondary" style="font-size:13px; white-space:nowrap;">Try Tool &rarr;</a>
        </div>
      </div>

      <!-- Media Inquiry Box -->
      <div class="media-contact-box">
        <div>
          <h3 style="font-size:22px; font-weight:900; margin:0 0 8px;">Direct Press &amp; Media Inquiries</h3>
          <p style="font-size:14px; color:#94A3B8; margin:0; line-height:1.6;">
            For interview requests, podcast appearances, product reviews, or high-resolution media requests, contact our founder directly.
          </p>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-primary" style="text-align:center; font-weight:700;">
            ✉️ rahmatansari4171@gmail.com
          </a>
          <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn btn-secondary" style="text-align:center; background:rgba(255,255,255,0.08); color:#fff; border-color:#334155;">
            LinkedIn: linkedin.com/in/mdrahmat
          </a>
        </div>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'press.html'), pressHtml);

  // Helper: Top Segmented Compliance Tabs for all Legal & Trust Pages
  function getComplianceTabsHtml(activePage) {
    const tabs = [
      { id: 'security', label: '🔒 Security & Encryption', href: 'security.html' },
      { id: 'privacy', label: '🛡️ Privacy Policy', href: 'privacy.html' },
      { id: 'terms', label: '📄 Terms & Conditions', href: 'terms.html' },
      { id: 'cookies', label: '🍪 Cookie Policy', href: 'cookies.html' }
    ];
    return `
    <div class="compliance-tabs-bar">
      ${tabs.map(t => `<a href="${t.href}" class="compliance-tab ${activePage === t.id ? 'active' : ''}">${t.label}</a>`).join('\n      ')}
    </div>`;
  }

  // Shared CSS for all Trust & Compliance pages
  const complianceCss = `
    @keyframes pulse-live {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .live-pulse-dot {
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
      display: inline-block;
      animation: pulse-live 2s infinite;
      vertical-align: middle;
      margin-right: 6px;
    }
    .trust-container {
      max-width: 1140px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }
    .compliance-tabs-bar {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin: 16px auto 40px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: 6px;
      border-radius: 9999px;
      max-width: 740px;
      border: 1px solid rgba(226, 232, 240, 0.8);
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
      position: relative;
      z-index: 10;
      flex-wrap: wrap;
    }
    .compliance-tab {
      padding: 10px 22px;
      font-size: 13.5px;
      font-weight: 700;
      color: #64748B;
      border-radius: 9999px;
      text-decoration: none;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }
    .compliance-tab:hover {
      color: #0F172A;
      background: rgba(241, 245, 249, 0.8);
      transform: translateY(-1px);
    }
    .compliance-tab.active {
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #FFFFFF;
      box-shadow: 0 4px 16px rgba(225, 29, 72, 0.35);
    }
    .trust-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 36px;
      align-items: start;
    }
    @media (max-width: 880px) {
      .trust-layout {
        grid-template-columns: 1fr;
      }
      .trust-sidebar {
        display: none;
      }
      .compliance-tabs-bar {
        margin: 16px auto 36px;
      }
    }
    .trust-sidebar {
      position: sticky;
      top: 90px;
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
    }
    .trust-sidebar-title {
      font-size: 12px;
      font-weight: 800;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 14px;
    }
    .trust-nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      font-size: 13.5px;
      font-weight: 600;
      color: #475569;
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.2s ease;
      margin-bottom: 4px;
    }
    .trust-nav-item:hover {
      background: #FFF1F2;
      color: #E11D48;
      transform: translateX(4px);
    }
    .trust-content-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 24px;
      padding: 44px;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.03), 0 0 1px 1px rgba(0,0,0,0.02);
    }
    .trust-meta-bar {
      display: flex;
      gap: 20px;
      padding-bottom: 24px;
      margin-bottom: 32px;
      border-bottom: 1.5px solid #F1F5F9;
      font-size: 13px;
      color: #64748B;
      flex-wrap: wrap;
    }
    .trust-meta-item strong {
      color: #0F172A;
    }
    .trust-section {
      margin-bottom: 48px;
      padding-bottom: 40px;
      border-bottom: 1.5px solid #F8FAFC;
    }
    .trust-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .trust-section h2 {
      font-size: 22px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 18px;
      letter-spacing: -0.3px;
      position: relative;
      padding-bottom: 10px;
    }
    .trust-section h2::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 36px;
      height: 3px;
      background: #E11D48;
      border-radius: 9999px;
    }
    .trust-section p, .trust-section li {
      font-size: 15px;
      color: #475569;
      line-height: 1.8;
      margin-bottom: 16px;
    }
    .trust-section ul {
      padding-left: 22px;
      margin-bottom: 18px;
    }
    .highlight-banner {
      background: #F0FDF4;
      border: 1.5px solid #BBF7D0;
      border-left: 4px solid #16A34A;
      border-radius: 16px;
      padding: 20px 24px;
      margin: 24px 0;
      box-shadow: 0 4px 12px rgba(22, 163, 74, 0.04);
    }
    .highlight-banner p {
      margin: 0;
      color: #15803D;
      font-weight: 600;
      font-size: 14.5px;
    }
    .info-banner {
      background: #EFF6FF;
      border: 1.5px solid #BFDBFE;
      border-left: 4px solid #2563EB;
      border-radius: 16px;
      padding: 20px 24px;
      margin: 24px 0;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.04);
    }
    .info-banner p {
      margin: 0;
      color: #1E40AF;
      font-weight: 600;
      font-size: 14.5px;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin: 24px 0 32px;
    }
    .mini-feature-card {
      background: #F8FAFC;
      border: 1.5px solid #F1F5F9;
      border-radius: 18px;
      padding: 24px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .mini-feature-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-3px);
      box-shadow: 0 10px 25px -5px rgba(225, 29, 72, 0.06);
    }
    .mini-card-icon {
      font-size: 26px;
      margin-bottom: 12px;
    }
    .mini-feature-card h4 {
      font-size: 15px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
    }
    .mini-feature-card p {
      font-size: 13px;
      color: #64748B;
      margin: 0;
      line-height: 1.5;
    }
    .data-flow-box {
      background: #0F172A;
      border-radius: 20px;
      padding: 30px;
      color: #FFFFFF;
      margin: 28px 0;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.35);
    }
    .data-flow-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 16px;
      margin-top: 18px;
      position: relative;
    }
    .flow-step {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 18px;
      text-align: center;
      transition: all 0.2s ease;
    }
    .flow-step:hover {
      background: rgba(255, 255, 255, 0.09);
      border-color: #FDA4AF;
      transform: translateY(-2px);
    }
    .flow-step-num {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      margin: 0 auto 10px;
      box-shadow: 0 4px 10px rgba(225, 29, 72, 0.4);
    }
    .flow-step-title {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 4px;
      color: #FFFFFF;
    }
    .flow-step-desc {
      font-size: 11.5px;
      color: #94A3B8;
      line-height: 1.4;
      margin: 0;
    }
    .trust-leader-box {
      background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
      border: 1.5px solid #E2E8F0;
      border-radius: 20px;
      padding: 26px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
    }
    .legal-highlight {
      background: none;
      padding: 0;
      font-weight: inherit;
      color: inherit;
    }
    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    .pill-green {
      background: #DCFCE7;
      color: #15803D;
      border: 1px solid #BBF7D0;
    }
    .pill-blue {
      background: #EFF6FF;
      color: #1D4ED8;
      border: 1px solid #BFDBFE;
    }
    .pill-amber {
      background: #FEF3C7;
      color: #B45309;
      border: 1px solid #FDE68A;
    }
    .pill-rose {
      background: #FFE4E6;
      color: #BE123C;
      border: 1px solid #FECDD3;
    }
    .key-takeaways-box {
      background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
      border: 1.5px solid #E2E8F0;
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 36px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
    }
    .key-takeaways-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .key-takeaways-title {
      font-size: 15.5px;
      font-weight: 900;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .takeaway-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
    }
    .takeaway-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 16px 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
      transition: all 0.2s ease;
    }
    .takeaway-card:hover {
      border-color: #CBD5E1;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.04);
    }
    .takeaway-card strong {
      display: block;
      font-size: 14px;
      color: #0F172A;
      margin-bottom: 6px;
    }
    .takeaway-card p {
      font-size: 12.5px;
      color: #64748B;
      margin: 0;
      line-height: 1.5;
    }
  `;

  // =========================================================================
  // 1. SECURITY & ENCRYPTION PAGE (High-Tech Luxury SaaS Architecture)
  // =========================================================================
  const securityHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Security &amp; Cryptographic Architecture — MomPDF</title>
  <meta name="description" content="Explore MomPDF's bank-grade security infrastructure. In-memory RAM sandboxing, TLS 1.3 encryption, zero AI model training, and automated 15-minute file shredding." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    ${complianceCss}

    /* Clean Hero Trust Bar */
    .hero-trust-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .trust-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }

    /* Interactive Cryptographic Pipeline Diagram */
    .pipeline-container {
      background: #0F172A;
      border: 1.5px solid #1E293B;
      border-radius: 24px;
      padding: 36px;
      color: #FFFFFF;
      margin: 32px 0 44px;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.4);
    }
    .pipeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .pipeline-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      position: relative;
    }
    .pipeline-step {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      padding: 22px;
      position: relative;
      transition: all 0.2s ease;
    }
    .pipeline-step:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: #E11D48;
      transform: translateY(-3px);
    }
    .step-badge-num {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 900;
      margin-bottom: 14px;
      box-shadow: 0 4px 12px rgba(225, 29, 72, 0.35);
    }
    .step-title {
      font-size: 15px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 6px;
    }
    .step-desc {
      font-size: 12.5px;
      color: #94A3B8;
      line-height: 1.5;
      margin: 0;
    }

    /* 6 Detailed Security Pillar Cards */
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin: 32px 0 44px;
    }
    .pillar-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      transition: all 0.2s ease;
    }
    .pillar-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -6px rgba(0,0,0,0.05);
    }
    .pillar-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #FFE4E6;
      color: #E11D48;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 16px;
    }
    .pillar-card h3 {
      font-size: 17px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .pillar-card p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.6;
      margin: 0;
    }

    /* Compliance Table */
    .compliance-matrix {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0 36px;
      font-size: 14px;
    }
    .compliance-matrix th {
      background: #F8FAFC;
      color: #0F172A;
      font-weight: 800;
      text-align: left;
      padding: 14px 18px;
      border-bottom: 2px solid #E2E8F0;
    }
    .compliance-matrix td {
      padding: 14px 18px;
      border-bottom: 1px solid #F1F5F9;
      color: #475569;
    }
    .compliance-matrix tr:hover td {
      background: #FAFAFA;
    }
    .status-badge-green {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #DCFCE7;
      color: #15803D;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
    }

    /* FAQ Box */
    .sec-faq-item {
      background: #F8FAFC;
      border: 1.5px solid #F1F5F9;
      border-radius: 16px;
      padding: 22px 26px;
      margin-bottom: 14px;
    }
    .sec-faq-q {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .sec-faq-a {
      font-size: 14px;
      color: #475569;
      line-height: 1.65;
      margin: 0;
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <!-- Clean Light Security Hero (Matching About Us, Contact Us, Blog & Press) -->
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">Bank-Grade Cryptographic Safeguards</div>
      <h1 class="hero-title" style="max-width: 900px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        Enterprise-Grade Document Security &amp; Zero-Retention Sandbox Architecture
      </h1>
      <p class="hero-subtitle" style="max-width: 760px; margin: 0 auto; font-size: 16.5px;">
        MomPDF is engineered from the kernel up to eliminate document retention risks. Files are processed purely in ephemeral RAM buffers, encrypted via TLS 1.3, and irreversibly shredded within 15 minutes.
      </p>

      <div class="hero-trust-bar">
        <span class="trust-chip">🔒 100% In-Memory RAM Engine</span>
        <span class="trust-chip">⏱️ 15 Min Auto Shredding</span>
        <span class="trust-chip">🛡️ TLS 1.3 256-Bit GCM Cipher</span>
        <span class="trust-chip">⚡ 0 MB Permanent Disk Storage</span>
      </div>
    </section>

    <div class="trust-container">
      ${getComplianceTabsHtml('security')}

      <div class="trust-layout">
        <!-- Sidebar Navigation -->
        <aside class="trust-sidebar">
          <div class="trust-sidebar-title">Security Architecture</div>
          <a href="#pipeline-section" class="trust-nav-item">1. In-Memory Lifecycle</a>
          <a href="#pillars-section" class="trust-nav-item">2. 6 Security Pillars</a>
          <a href="#encryption-deep" class="trust-nav-item">3. TLS 1.3 &amp; Cipher Suites</a>
          <a href="#shredder-protocol" class="trust-nav-item">4. Automated Shredding</a>
          <a href="#compliance-matrix" class="trust-nav-item">5. Compliance Standards</a>
          <a href="#security-faq" class="trust-nav-item">6. Security FAQs</a>
          <a href="#security-contact" class="trust-nav-item">7. Vulnerability Disclosure</a>
        </aside>

        <!-- Main Content Card -->
        <div class="trust-content-card">
          <div class="trust-meta-bar">
            <div class="trust-meta-item">Security Framework: <strong>ISO/IEC 27001 &amp; SOC 2 Aligned</strong></div>
            <div class="trust-meta-item">Enforcement: <strong>Automated Zero-Retention</strong></div>
            <div class="trust-meta-item">Effective Version: <strong>2026.4</strong></div>
          </div>

          <!-- Key Executive Highlights Box -->
          <div class="key-takeaways-box">
            <div class="key-takeaways-header">
              <h3 class="key-takeaways-title">⚡ Key Security Highlights &amp; Enforcements</h3>
              <span class="pill-badge pill-green">Bank-Grade Certified</span>
            </div>
            <div class="takeaway-grid">
              <div class="takeaway-card">
                <strong>TLS 1.3 &amp; AES-256</strong>
                <p>All transfers encrypted via strict 256-bit GCM cipher suites with preloaded HSTS.</p>
              </div>
              <div class="takeaway-card">
                <strong>RAM-Only Sandboxing</strong>
                <p>Pure in-memory execution with complete child-process kernel isolation.</p>
              </div>
              <div class="takeaway-card">
                <strong>15-Min Hard Shred</strong>
                <p>Automated reaper permanently deletes temporary buffers and unlinks pointers.</p>
              </div>
              <div class="takeaway-card">
                <strong>Zero AI Training</strong>
                <p>Zero model harvesting, zero text scraping, and zero third-party data broker sharing.</p>
              </div>
            </div>
          </div>

          <!-- 1. Cryptographic Pipeline Box -->
          <section id="pipeline-section" class="trust-section">
            <h2>1. Ephemeral In-Memory Sandbox Pipeline</h2>
            <p>
              Unlike legacy PDF services that write uploaded documents to unencrypted, persistent hard drive clusters, MomPDF utilizes a strictly ephemeral, memory-first execution engine:
            </p>

            <div class="pipeline-container">
              <div class="pipeline-header">
                <div>
                  <h4 style="font-size:18px; font-weight:900; margin:0 0 4px; color:#fff;">MomPDF 4-Stage Cryptographic Data Flow</h4>
                  <p style="font-size:13px; color:#94A3B8; margin:0;">Zero permanent storage at every stage of the document journey.</p>
                </div>
                <span style="font-size:12px; background:rgba(225,29,72,0.2); color:#FDA4AF; padding:4px 12px; border-radius:9999px; font-weight:800; text-transform:uppercase;">Real-Time Enforced</span>
              </div>

              <div class="pipeline-grid">
                <div class="pipeline-step">
                  <div class="step-badge-num">1</div>
                  <div class="step-title">Encrypted Ingress</div>
                  <p class="step-desc">Document streams over TLS 1.3 with 256-bit AES-GCM and strict HSTS headers.</p>
                </div>
                <div class="pipeline-step">
                  <div class="step-badge-num">2</div>
                  <div class="step-title">RAM Sandbox</div>
                  <p class="step-desc">File loads into isolated memory space with strict child process boundaries.</p>
                </div>
                <div class="pipeline-step">
                  <div class="step-badge-num">3</div>
                  <div class="step-title">Single-Use Delivery</div>
                  <p class="step-desc">Transformed output delivered via cryptographically signed temporary token.</p>
                </div>
                <div class="pipeline-step">
                  <div class="step-badge-num">4</div>
                  <div class="step-title">Auto Shred (15m)</div>
                  <p class="step-desc">Background daemon executes DoD 5220.22-M unlinking &amp; memory zeroization.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 2. 6 Security Pillars Grid -->
          <section id="pillars-section" class="trust-section">
            <h2>2. The Six Architectural Pillars of MomPDF Security</h2>
            <div class="pillars-grid">
              <div class="pillar-card">
                <div class="pillar-icon-box">🔒</div>
                <h3>TLS 1.3 &amp; AES-256 Encryption</h3>
                <p>All in-flight traffic is encrypted with modern elliptic curve cipher suites preventing packet interception.</p>
              </div>
              <div class="pillar-card">
                <div class="pillar-icon-box">⚡</div>
                <h3>RAM-Only Sandboxing</h3>
                <p>Processes execute purely in dynamic RAM buffers without creating long-term physical disk logs.</p>
              </div>
              <div class="pillar-card">
                <div class="pillar-icon-box">⏱️</div>
                <h3>15-Minute File Shredder</h3>
                <p>Automated background reaper permanently deletes output artifacts exactly 15 minutes after completion.</p>
              </div>
              <div class="pillar-card">
                <div class="pillar-icon-box">🛡️</div>
                <h3>Zero AI Model Harvesting</h3>
                <p>Document text is processed strictly for inference and never stored, indexed, or used to train LLMs.</p>
              </div>
              <div class="pillar-card">
                <div class="pillar-icon-box">🚫</div>
                <h3>Zero Human Access</h3>
                <p>No engineer, operator, or automated script has credentials to view or inspect user document payloads.</p>
              </div>
              <div class="pillar-card">
                <div class="pillar-icon-box">🌐</div>
                <h3>DDoS &amp; Rate Safeguards</h3>
                <p>Advanced rate limiting, input sanitization, and buffer overflow protections keep the infrastructure bulletproof.</p>
              </div>
            </div>
          </section>

          <!-- 3. TLS 1.3 Deep Dive -->
          <section id="encryption-deep" class="trust-section">
            <h2>3. Transport Layer Security (TLS 1.3) Specifications</h2>
            <p>
              Every API call and web interaction with MomPDF requires TLS 1.3 negotiation with forward secrecy. Legacy, vulnerable protocols (TLS 1.0, 1.1, and SSLv3) are permanently blocked at the ingress gateway.
            </p>
            <ul>
              <li><strong>Preloaded HSTS:</strong> Enforces HTTPS with <code>max-age=31536000; includeSubDomains; preload</code> to block SSL stripping.</li>
              <li><strong>Perfect Forward Secrecy (PFS):</strong> Session keys are ephemeral and unique to each connection, preventing retrospective decryption.</li>
              <li><strong>Input Validation:</strong> File headers and MIME types are inspected at byte level to block malicious binary injections.</li>
            </ul>
          </section>

          <!-- 4. Shredder Protocol -->
          <section id="shredder-protocol" class="trust-section">
            <h2>4. Cryptographic File Shredding Protocol</h2>
            <p>
              MomPDF guarantees an irreversible data wipeout after transformation:
            </p>
            <div class="highlight-banner">
              <p>✓ <strong>15-Minute Hard Guarantee:</strong> Once the 15-minute timer expires, all memory allocations are unlinked and disk pointers zeroized. No document recovery is possible by any party.</p>
            </div>
            <p>
              Users are encouraged to download and save their processed files promptly. We do not maintain any long-term backups or user document archives.
            </p>
          </section>

          <!-- 5. Compliance Matrix -->
          <section id="compliance-matrix" class="trust-section">
            <h2>5. International Privacy &amp; Compliance Matrix</h2>
            <table class="compliance-matrix">
              <thead>
                <tr>
                  <th>Framework / Regulation</th>
                  <th>Jurisdiction</th>
                  <th>Compliance Status</th>
                  <th>Implementation Highlights</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>GDPR</strong></td>
                  <td>European Union</td>
                  <td><span class="status-badge-green">✓ Fully Compliant</span></td>
                  <td>Articles 5, 17, 32 (Data Minimization &amp; Right to Erasure).</td>
                </tr>
                <tr>
                  <td><strong>CCPA / CPRA</strong></td>
                  <td>California, USA</td>
                  <td><span class="status-badge-green">✓ Fully Compliant</span></td>
                  <td>Zero sale or sharing of user data; zero behavioral profiling.</td>
                </tr>
                <tr>
                  <td><strong>ISO/IEC 27001</strong></td>
                  <td>International</td>
                  <td><span class="status-badge-green">✓ Aligned</span></td>
                  <td>Information security management architecture &amp; least-privilege access.</td>
                </tr>
                <tr>
                  <td><strong>SOC 2 Type II</strong></td>
                  <td>Global Enterprise</td>
                  <td><span class="status-badge-green">✓ Aligned</span></td>
                  <td>Security, availability, and confidentiality trust principles.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- 6. Security FAQs -->
          <section id="security-faq" class="trust-section">
            <h2>6. Frequently Asked Security Questions</h2>
            
            <div class="sec-faq-item">
              <div class="sec-faq-q">Q: Are my uploaded documents permanently saved on MomPDF servers?</div>
              <p class="sec-faq-a">No. MomPDF operates under a strict zero-retention policy. Documents are processed in isolated RAM buffers and permanently shredded after 15 minutes.</p>
            </div>

            <div class="sec-faq-item">
              <div class="sec-faq-q">Q: Can MomPDF employees or support staff view the contents of my PDF?</div>
              <p class="sec-faq-a">No. The processing pipeline is 100% automated. No human has administrative access to inspect or read customer document streams.</p>
            </div>

            <div class="sec-faq-item">
              <div class="sec-faq-q">Q: Does MomPDF use my documents to train AI or OCR machine learning models?</div>
              <p class="sec-faq-a">No. AI Summarization and OCR operations run strictly for real-time inference and are immediately discarded without training any AI models.</p>
            </div>

            <div class="sec-faq-item">
              <div class="sec-faq-q">Q: Who owns the copyright and intellectual property of converted files?</div>
              <p class="sec-faq-a">You do. You retain 100% full, unrestricted ownership and copyright over all files processed on MomPDF.</p>
            </div>
          </section>

          <!-- 7. Security Leadership & Bug Bounty -->
          <section id="security-contact" class="trust-section">
            <h2>7. Security Leadership &amp; Vulnerability Disclosure</h2>
            <p>
              We prioritize responsible security research. If you discover a potential vulnerability or have questions regarding enterprise security, reach out directly to our engineering leadership:
            </p>

            <div class="trust-leader-box">
              <div>
                <strong style="font-size:16px; color:#0F172A;">Md Rahmat Ansari</strong>
                <p style="margin:2px 0 0; font-size:13px; color:#64748B;">Founder &amp; Principal Security Systems Architect</p>
                <p style="margin:4px 0 0; font-size:12px; color:#E11D48; font-weight:700;">Average Security Response Time: &lt; 4 Hours</p>
              </div>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-primary" style="font-size:13.5px; padding:9px 18px;">
                  ✉️ rahmatansari4171@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:13.5px; padding:9px 18px;">
                  LinkedIn Profile &rarr;
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'security.html'), securityHtml);

  // =========================================================================
  // 2. PRIVACY POLICY PAGE (High-Tech Luxury SaaS Architecture)
  // =========================================================================
  const privacyHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy &amp; Zero Retention Guarantee — MomPDF</title>
  <meta name="description" content="Review the MomPDF Privacy Policy. Strict zero-retention guarantee, zero document logging, automated 15-minute shredding, and full GDPR/CCPA compliance." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    ${complianceCss}

    /* Clean Hero Trust Bar */
    .hero-trust-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .trust-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }

    /* Privacy Table */
    .privacy-data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0 36px;
      font-size: 14px;
    }
    .privacy-data-table th {
      background: #F8FAFC;
      color: #0F172A;
      font-weight: 800;
      text-align: left;
      padding: 14px 18px;
      border-bottom: 2px solid #E2E8F0;
    }
    .privacy-data-table td {
      padding: 14px 18px;
      border-bottom: 1px solid #F1F5F9;
      color: #475569;
    }
    .privacy-data-table tr:hover td {
      background: #FAFAFA;
    }
    .tag-no-collect {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      background: #DCFCE7;
      color: #15803D;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
    }
    .tag-minimal {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      background: #EFF6FF;
      color: #1D4ED8;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
    }

    /* 6 Pillar Cards Grid */
    .priv-pillars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin: 32px 0 44px;
    }
    .priv-pillar-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      transition: all 0.2s ease;
    }
    .priv-pillar-card:hover {
      border-color: #A7F3D0;
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -6px rgba(0,0,0,0.05);
    }
    .priv-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #D1FAE5;
      color: #059669;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 16px;
    }
    .priv-pillar-card h3 {
      font-size: 17px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .priv-pillar-card p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.6;
      margin: 0;
    }

    /* FAQ Item */
    .priv-faq-item {
      background: #F8FAFC;
      border: 1.5px solid #F1F5F9;
      border-radius: 16px;
      padding: 22px 26px;
      margin-bottom: 14px;
    }
    .priv-faq-q {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .priv-faq-a {
      font-size: 14px;
      color: #475569;
      line-height: 1.65;
      margin: 0;
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <!-- Clean Light Privacy Hero (Matching About Us, Contact Us, Blog & Press) -->
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">Zero-Knowledge Privacy Architecture</div>
      <h1 class="hero-title" style="max-width: 900px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        Global Privacy Policy &amp; Absolute Zero Data Retention Commitment
      </h1>
      <p class="hero-subtitle" style="max-width: 760px; margin: 0 auto; font-size: 16.5px;">
        Privacy is not a setting on MomPDF—it is our core kernel architecture. We operate under strict zero-log protocols: we never inspect, index, sell, or train AI models on your files.
      </p>

      <div class="hero-trust-bar">
        <span class="trust-chip">🛡️ 0 Logs Document Content Retention</span>
        <span class="trust-chip">⏱️ 15 Min Automated Memory Purge</span>
        <span class="trust-chip">🚫 0 Trackers Third-Party Ad Networks</span>
        <span class="trust-chip">✓ 100% GDPR &amp; CCPA Enforced</span>
      </div>
    </section>

    <div class="trust-container">
      ${getComplianceTabsHtml('privacy')}

      <div class="trust-layout">
        <!-- Sidebar Navigation -->
        <aside class="trust-sidebar">
          <div class="trust-sidebar-title">Privacy Sections</div>
          <a href="#privacy-principles" class="trust-nav-item">1. Core Principles</a>
          <a href="#privacy-pillars" class="trust-nav-item">2. 6 Privacy Guarantees</a>
          <a href="#data-matrix" class="trust-nav-item">3. Data Transparency Matrix</a>
          <a href="#lifecycle-protocol" class="trust-nav-item">4. 15-Min File Lifecycle</a>
          <a href="#global-rights" class="trust-nav-item">5. Your Privacy Rights</a>
          <a href="#privacy-faq" class="trust-nav-item">6. Privacy FAQs</a>
          <a href="#dpo-leadership" class="trust-nav-item">7. Privacy Officer Contact</a>
        </aside>

        <!-- Main Content Card -->
        <div class="trust-content-card">
          <div class="trust-meta-bar">
            <div class="trust-meta-item">Architecture: <strong>Zero-Log Ephemeral Engine</strong></div>
            <div class="trust-meta-item">Governing Laws: <strong>GDPR, CCPA &amp; CPRA</strong></div>
            <div class="trust-meta-item">Effective Version: <strong>2026.4</strong></div>
          </div>

          <!-- Key Executive Highlights Box -->
          <div class="key-takeaways-box">
            <div class="key-takeaways-header">
              <h3 class="key-takeaways-title">🛡️ Key Privacy Highlights &amp; Enforcements</h3>
              <span class="pill-badge pill-green">Zero Data Retention Enforced</span>
            </div>
            <div class="takeaway-grid">
              <div class="takeaway-card">
                <strong>Zero Document Logs</strong>
                <p>Files are never inspected, indexed, or stored beyond the temporary 15-minute window.</p>
              </div>
              <div class="takeaway-card">
                <strong>Auto 15-Min Purge</strong>
                <p>Complete memory buffer wipeout and physical file unlinking after 15 minutes.</p>
              </div>
              <div class="takeaway-card">
                <strong>Zero AI Training</strong>
                <p>Your contracts, taxes, and medical files are never fed into LLMs or machine learning models.</p>
              </div>
              <div class="takeaway-card">
                <strong>Zero Ad Trackers</strong>
                <p>Zero cross-site pixels, zero third-party profiling cookies, and zero commercial data broker sales.</p>
              </div>
            </div>
          </div>

          <div class="highlight-banner" style="background:#ECFDF5; border-color:#A7F3D0; border-left-color:#059669;">
            <p style="color:#065F46;">
              🛡️ <strong>Absolute Zero-Retention Guarantee:</strong> MomPDF will NEVER inspect, index, extract, sell, or monetize any data contained within your uploaded documents.
            </p>
          </div>

          <!-- 1. Core Principles -->
          <section id="privacy-principles" class="trust-section">
            <h2>1. Privacy by Design &amp; Data Minimization</h2>
            <p>
              Founded by <strong>Md Rahmat Ansari</strong>, MomPDF was created with a clear objective: to provide individuals, businesses, and researchers with a reliable, ultra-fast document platform that respects total privacy.
            </p>
            <p>
              We enforce <em>Strict Data Minimization</em> under Article 5 of the GDPR. You do not need to register an account or provide personal information to use our online PDF tools. Every document transformation is treated as an isolated, temporary transaction.
            </p>
          </section>

          <!-- 2. 6 Privacy Pillars Grid -->
          <section id="privacy-pillars" class="trust-section">
            <h2>2. The Six Core Guarantees of MomPDF Privacy</h2>
            <div class="priv-pillars-grid">
              <div class="priv-pillar-card">
                <div class="priv-icon-box">🚫</div>
                <h3>Zero Human Access</h3>
                <p>All conversions and edits are 100% automated. No operator or administrator can inspect your document contents.</p>
              </div>
              <div class="priv-pillar-card">
                <div class="priv-icon-box">⏱️</div>
                <h3>15-Minute Automatic Purge</h3>
                <p>Temporary outputs are automatically and permanently deleted from RAM and storage buffers exactly 15 minutes after generation.</p>
              </div>
              <div class="priv-pillar-card">
                <div class="priv-icon-box">🤖</div>
                <h3>Zero AI Model Training</h3>
                <p>We never use customer files to train machine learning models, OCR networks, or generative AI datasets.</p>
              </div>
              <div class="priv-pillar-card">
                <div class="priv-icon-box">🛑</div>
                <h3>Zero Commercial Data Sale</h3>
                <p>We do not sell, rent, license, or barter user data to third-party data brokers, marketers, or analytics conglomerates.</p>
              </div>
              <div class="priv-pillar-card">
                <div class="priv-icon-box">🔒</div>
                <h3>TLS 1.3 Transport Security</h3>
                <p>All file uploads and downloads are strictly encrypted in transit using 256-bit AES-GCM cipher suites.</p>
              </div>
              <div class="priv-pillar-card">
                <div class="priv-icon-box">🍪</div>
                <h3>No Advertising Trackers</h3>
                <p>We do not install cross-site tracking cookies, Facebook Pixels, or Google AdSense profiling scripts.</p>
              </div>
            </div>
          </section>

          <!-- 3. Data Transparency Matrix -->
          <section id="data-matrix" class="trust-section">
            <h2>3. Complete Data Transparency &amp; Collection Matrix</h2>
            <p>
              We believe in complete transparency regarding the information processed across our platform:
            </p>
            <table class="privacy-data-table">
              <thead>
                <tr>
                  <th>Data Category</th>
                  <th>Collected?</th>
                  <th>Technical Purpose</th>
                  <th>Retention Period</th>
                  <th>Third-Party Sharing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Uploaded Documents &amp; Files</strong></td>
                  <td><span class="tag-no-collect">Never Retained</span></td>
                  <td>Execute requested transformation in RAM sandbox.</td>
                  <td>Max 15 Mins (Auto Shred)</td>
                  <td>Zero / Prohibited</td>
                </tr>
                <tr>
                  <td><strong>Document Text / OCR Payload</strong></td>
                  <td><span class="tag-no-collect">Never Stored</span></td>
                  <td>Real-time optical character recognition &amp; summarization.</td>
                  <td>Instant Ephemeral</td>
                  <td>Zero / Prohibited</td>
                </tr>
                <tr>
                  <td><strong>Language / Theme Cookies</strong></td>
                  <td><span class="tag-minimal">Client-Side Only</span></td>
                  <td>Remember 30-language choice and UI dark mode.</td>
                  <td>Persistent in Browser</td>
                  <td>Zero / Prohibited</td>
                </tr>
                <tr>
                  <td><strong>Server Status Telemetry</strong></td>
                  <td><span class="tag-minimal">Anonymized</span></td>
                  <td>Monitor HTTP response codes, errors, and platform health.</td>
                  <td>Aggregated (No PII)</td>
                  <td>Zero / Prohibited</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- 4. 15-Minute Document Lifecycle -->
          <section id="lifecycle-protocol" class="trust-section">
            <h2>4. The 15-Minute Document Lifecycle Protocol</h2>
            <p>
              From the instant you drop a file onto MomPDF to its final deletion, the data lifecycle follows a strict irreversible path:
            </p>
            <ul>
              <li><strong>Step 1 (Ingestion):</strong> Document transfers over encrypted TLS 1.3 straight to an isolated in-memory buffer.</li>
              <li><strong>Step 2 (Execution):</strong> Specialized PDF micro-engine performs the operation (merge, compress, edit, convert).</li>
              <li><strong>Step 3 (Hand-off):</strong> A cryptographically signed token is issued to your browser for immediate download.</li>
              <li><strong>Step 4 (Purge):</strong> At T+15 minutes, an automated background cleanup cron permanently zeroes out the buffer.</li>
            </ul>
          </section>

          <!-- 5. Global Privacy Rights -->
          <section id="global-rights" class="trust-section">
            <h2>5. Your Privacy Rights Under GDPR, CCPA &amp; Global Frameworks</h2>
            <p>
              Regardless of your geographic location, MomPDF extends universal privacy rights to all users:
            </p>
            <ul>
              <li><strong>Right to Erasure (GDPR Art. 17):</strong> Files are destroyed automatically within 15 minutes by architectural design.</li>
              <li><strong>Right to Access &amp; Portability:</strong> You may download your transformed files immediately at any point within the 15-minute window.</li>
              <li><strong>Right to Non-Discrimination (CCPA):</strong> We never restrict features, degrade performance, or charge fees based on privacy rights exercises.</li>
            </ul>
          </section>

          <!-- 6. Privacy FAQs -->
          <section id="privacy-faq" class="trust-section">
            <h2>6. Frequently Asked Privacy Questions</h2>
            
            <div class="priv-faq-item">
              <div class="priv-faq-q">Q: Does MomPDF read or analyze the text inside my contracts or bank statements?</div>
              <p class="priv-faq-a">Never. Our software operates programmatically in isolated memory spaces without extracting, inspecting, or storing readable document text.</p>
            </div>

            <div class="priv-faq-item">
              <div class="priv-faq-q">Q: Do you sell user data to advertising companies or data brokers?</div>
              <p class="priv-faq-a">No. MomPDF does not participate in data brokerage or advertising tracking networks. We have never sold user data and never will.</p>
            </div>

            <div class="priv-faq-item">
              <div class="priv-faq-q">Q: What happens if I forget to download my transformed file after 15 minutes?</div>
              <p class="priv-faq-a">For your security, the file will be permanently deleted and cannot be recovered. You will simply need to upload the original file again to re-process it.</p>
            </div>
          </section>

          <!-- 7. DPO Leadership Contact -->
          <section id="dpo-leadership" class="trust-section">
            <h2>7. Data Protection Officer &amp; Founder Leadership</h2>
            <p>
              For privacy inquiries, GDPR data deletion confirmations, or compliance audits, contact our Data Protection Officer directly:
            </p>

            <div class="trust-leader-box">
              <div>
                <strong style="font-size:16px; color:#0F172A;">Md Rahmat Ansari</strong>
                <p style="margin:2px 0 0; font-size:13px; color:#64748B;">Founder &amp; Chief Data Protection Officer (DPO)</p>
                <p style="margin:4px 0 0; font-size:12px; color:#E11D48; font-weight:700;">Direct Privacy Response Line</p>
              </div>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-primary" style="font-size:13.5px; padding:9px 18px;">
                  ✉️ rahmatansari4171@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:13.5px; padding:9px 18px;">
                  LinkedIn Profile &rarr;
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'privacy.html'), privacyHtml);

  // =========================================================================
  // 3. TERMS & CONDITIONS PAGE (High-Tech Luxury SaaS Architecture)
  // =========================================================================
  const termsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Terms &amp; Conditions — MomPDF | User Agreement &amp; SLA</title>
  <meta name="description" content="Review MomPDF Terms and Conditions. 100% document ownership rights, acceptable use policies, 99.9% uptime SLA, and clear SaaS user agreements." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    ${complianceCss}

    /* Clean Hero Trust Bar */
    .hero-trust-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .trust-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }

    /* 6 Terms Pillar Cards */
    .terms-pillars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin: 32px 0 44px;
    }
    .terms-pillar-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      transition: all 0.2s ease;
    }
    .terms-pillar-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -6px rgba(225, 29, 72, 0.08);
    }
    .terms-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #DBEAFE;
      color: #2563EB;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 16px;
    }
    .terms-pillar-card h3 {
      font-size: 17px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .terms-pillar-card p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.6;
      margin: 0;
    }

    /* Comparison Table */
    .terms-compare-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0 36px;
      font-size: 14px;
    }
    .terms-compare-table th {
      background: #F8FAFC;
      color: #0F172A;
      font-weight: 800;
      text-align: left;
      padding: 14px 18px;
      border-bottom: 2px solid #E2E8F0;
    }
    .terms-compare-table td {
      padding: 14px 18px;
      border-bottom: 1px solid #F1F5F9;
      color: #475569;
    }
    .terms-compare-table tr:hover td {
      background: #FAFAFA;
    }
    .terms-check {
      color: #16A34A;
      font-weight: 700;
    }

    /* FAQ Item */
    .terms-faq-item {
      background: #F8FAFC;
      border: 1.5px solid #F1F5F9;
      border-radius: 16px;
      padding: 22px 26px;
      margin-bottom: 14px;
    }
    .terms-faq-q {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .terms-faq-a {
      font-size: 14px;
      color: #475569;
      line-height: 1.65;
      margin: 0;
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <!-- Clean Light Terms Hero (Matching About Us, Contact Us, Blog & Press) -->
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">Transparent SaaS Agreement</div>
      <h1 class="hero-title" style="max-width: 900px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        Terms &amp; Conditions — Clear, Fair &amp; User-First
      </h1>
      <p class="hero-subtitle" style="max-width: 760px; margin: 0 auto; font-size: 16.5px;">
        Built on respect for creator ownership. You retain 100% intellectual property rights over every file processed on our platform.
      </p>

      <div class="hero-trust-bar">
        <span class="trust-chip">📄 100% User Document Ownership</span>
        <span class="trust-chip">⚡ 99.9% SLA Target Uptime</span>
        <span class="trust-chip">⏱️ 15 Min Auto Retention Purge</span>
        <span class="trust-chip">🌐 150+ Countries Supported</span>
      </div>
    </section>

    <div class="trust-container">
      ${getComplianceTabsHtml('terms')}

      <div class="trust-layout">
        <!-- Sidebar Navigation -->
        <aside class="trust-sidebar">
          <div class="trust-sidebar-title">Terms Outline</div>
          <a href="#acceptance" class="trust-nav-item">1. Acceptance of Terms</a>
          <a href="#terms-pillars" class="trust-nav-item">2. 6 Core Commitments</a>
          <a href="#ownership" class="trust-nav-item">3. Document Ownership</a>
          <a href="#acceptable-use" class="trust-nav-item">4. Acceptable Use Policy</a>
          <a href="#comparison" class="trust-nav-item">5. Terms Comparison</a>
          <a href="#availability" class="trust-nav-item">6. Service SLA &amp; 15-Min Purge</a>
          <a href="#liability" class="trust-nav-item">7. Limitation of Liability</a>
          <a href="#terms-faq" class="trust-nav-item">8. Terms FAQs</a>
          <a href="#legal-contact" class="trust-nav-item">9. Legal &amp; Enterprise Desk</a>
        </aside>

        <!-- Main Content -->
        <div class="trust-content-card">
          <div class="trust-meta-bar">
            <div class="trust-meta-item">Document: <strong>SaaS Service Agreement</strong></div>
            <div class="trust-meta-item">Version: <strong>2.4 (Global Edition)</strong></div>
            <div class="trust-meta-item">Effective Date: <strong>August 2026</strong></div>
          </div>

          <!-- Key Executive Highlights Box -->
          <div class="key-takeaways-box">
            <div class="key-takeaways-header">
              <h3 class="key-takeaways-title">📄 Key Terms Highlights &amp; Legal Commitments</h3>
              <span class="pill-badge pill-blue">Fair &amp; User-First Agreement</span>
            </div>
            <div class="takeaway-grid">
              <div class="takeaway-card">
                <strong>100% User Ownership</strong>
                <p>You retain full, unrestricted intellectual property rights and copyrights on all documents.</p>
              </div>
              <div class="takeaway-card">
                <strong>15-Min File Shredding</strong>
                <p>Converted files are shredded permanently after 15 minutes to guarantee zero long-term retention.</p>
              </div>
              <div class="takeaway-card">
                <strong>99.9% Uptime SLA</strong>
                <p>High-reliability cloud compute clusters ensure uninterrupted document tools 24/7.</p>
              </div>
              <div class="takeaway-card">
                <strong>Commercial &amp; Education</strong>
                <p>Free for personal, academic, and commercial business document management workflows.</p>
              </div>
            </div>
          </div>

          <div class="info-banner">
            <p>📄 <strong>100% User Ownership:</strong> You retain complete, unrestricted copyright and intellectual property rights over every file you upload to MomPDF.</p>
          </div>

          <!-- Section 1 -->
          <section id="acceptance" class="trust-section">
            <h2>1. Acceptance of Agreement &amp; Scope</h2>
            <p>
              By accessing, browsing, or utilizing the MomPDF web application, API endpoints, or workspace utilities, you agree to comply with and be bound by these Terms and Conditions, our Security Protocols, and our Privacy Policy.
            </p>
            <p>
              Founded by <strong>Md Rahmat Ansari</strong>, MomPDF is operated with an uncompromising commitment to transparent, accessible, and privacy-first document tooling worldwide.
            </p>
          </section>

          <!-- Section 2: 6 Terms Pillars Grid -->
          <section id="terms-pillars" class="trust-section">
            <h2>2. The Six Principles of MomPDF Terms</h2>
            <div class="terms-pillars-grid">
              <div class="terms-pillar-card">
                <div class="terms-icon-box">📄</div>
                <h3>100% User Ownership</h3>
                <p>You retain full intellectual property rights, copyright, and ownership over every document you upload.</p>
              </div>
              <div class="terms-pillar-card">
                <div class="terms-icon-box">⏱️</div>
                <h3>15-Minute Purge Window</h3>
                <p>Transformed files are temporary and shredded after 15 minutes to guarantee zero long-term retention.</p>
              </div>
              <div class="terms-pillar-card">
                <div class="terms-icon-box">🛡️</div>
                <h3>Safe &amp; Clean Platform</h3>
                <p>We prohibit malicious payloads, viruses, or disruptive DDoS attempts to safeguard all users.</p>
              </div>
              <div class="terms-pillar-card">
                <div class="terms-icon-box">⚡</div>
                <h3>99.9% Uptime SLA</h3>
                <p>Our microservice cluster is architected for uninterrupted high-speed document processing 24/7.</p>
              </div>
              <div class="terms-pillar-card">
                <div class="terms-icon-box">🌍</div>
                <h3>Global Fair Access</h3>
                <p>Available worldwide in 30+ localized languages across desktop, tablet, and mobile platforms.</p>
              </div>
              <div class="terms-pillar-card">
                <div class="terms-icon-box">⚖️</div>
                <h3>Fair SaaS Governance</h3>
                <p>Clear liability standards, no hidden subscription traps, and prompt executive support.</p>
              </div>
            </div>
          </section>

          <!-- Section 3 -->
          <section id="ownership" class="trust-section">
            <h2>3. Intellectual Property &amp; Ephemeral Processing License</h2>
            <p>
              MomPDF does not claim any intellectual property, ownership, or copyright over any documents, images, or files you upload.
            </p>
            <p>
              You grant MomPDF only the ephemeral, temporary technical license necessary to process the requested transformation (e.g. merge, compress, convert, edit) and deliver the output file back to your device.
            </p>
          </section>

          <!-- Section 4 -->
          <section id="acceptable-use" class="trust-section">
            <h2>4. Acceptable Use Policy</h2>
            <p>You agree not to use MomPDF to:</p>
            <ul>
              <li>Upload malicious software, virus-infected archives, or exploit payloads.</li>
              <li>Attempt to reverse-engineer, DDoS, or disrupt our backend compute infrastructure.</li>
              <li>Process unlawful content that violates copyright or international law.</li>
            </ul>
          </section>

          <!-- Section 5: Comparison Table -->
          <section id="comparison" class="trust-section">
            <h2>5. How MomPDF Terms Compare to Industry Standards</h2>
            <table class="terms-compare-table">
              <thead>
                <tr>
                  <th>Policy Dimension</th>
                  <th>MomPDF Standard</th>
                  <th>Generic Online PDF Converters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Document Ownership</strong></td>
                  <td><span class="terms-check">✓ 100% User Retained</span></td>
                  <td>Often ambiguous / Broad licenses claimed</td>
                </tr>
                <tr>
                  <td><strong>File Retention</strong></td>
                  <td><span class="terms-check">✓ Irreversible 15-Min Auto Shred</span></td>
                  <td>Days, weeks, or indefinite retention</td>
                </tr>
                <tr>
                  <td><strong>AI Model Training</strong></td>
                  <td><span class="terms-check">✓ Strictly Zero Model Training</span></td>
                  <td>May train internal models on uploads</td>
                </tr>
                <tr>
                  <td><strong>Account Requirement</strong></td>
                  <td><span class="terms-check">✓ Optional / Zero Gatekeeping</span></td>
                  <td>Forced sign-up / Paywalls</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Section 6 -->
          <section id="availability" class="trust-section">
            <h2>6. Service Availability &amp; 15-Minute Purge Policy</h2>
            <p>
              MomPDF provides tools with a target of 99.9% uptime across 150+ countries. Because our servers automatically destroy all processed files after 15 minutes, users are responsible for saving transformed documents locally.
            </p>
          </section>

          <!-- Section 7 -->
          <section id="liability" class="trust-section">
            <h2>7. Warranty Disclaimers &amp; Limitation of Liability</h2>
            <p>
              MomPDF is provided on an "as is" and "as available" basis. To the maximum extent permitted by law, MomPDF and its founder <strong>Md Rahmat Ansari</strong> shall not be liable for any indirect, incidental, or consequential damages resulting from document loss or service interruption.
            </p>
          </section>

          <!-- Section 8: FAQ -->
          <section id="terms-faq" class="trust-section">
            <h2>8. Frequently Asked Terms Questions</h2>
            
            <div class="terms-faq-item">
              <div class="terms-faq-q">Q: Can MomPDF claim copyright or commercial rights to my converted PDFs?</div>
              <p class="terms-faq-a">No. You retain 100% of all intellectual property, copyright, and commercial ownership over all files uploaded and created on MomPDF.</p>
            </div>

            <div class="terms-faq-item">
              <div class="terms-faq-q">Q: Can I use MomPDF for commercial, business, or enterprise projects?</div>
              <p class="terms-faq-a">Yes. MomPDF is fully authorized for individual, educational, and commercial business document workflows.</p>
            </div>

            <div class="terms-faq-item">
              <div class="terms-faq-q">Q: What happens if my file fails to download before the 15-minute expiration?</div>
              <p class="terms-faq-a">Because we permanently shred files after 15 minutes for your privacy, simply upload your original file again to generate a fresh download token.</p>
            </div>
          </section>

          <!-- Section 9: Leadership Contact -->
          <section id="legal-contact" class="trust-section">
            <h2>9. Legal &amp; Enterprise Support</h2>
            <p>
              For enterprise licensing, SLA agreements, or legal questions, contact our leadership directly:
            </p>
            <div class="trust-leader-box">
              <div>
                <strong style="font-size:16px; color:#0F172A;">Md Rahmat Ansari</strong>
                <p style="margin:2px 0 0; font-size:13px; color:#64748B;">Founder &amp; Principal Systems Architect</p>
                <p style="margin:4px 0 0; font-size:12px; color:#E11D48; font-weight:700;">Legal &amp; Enterprise SLA Desk</p>
              </div>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-primary" style="font-size:13.5px; padding:9px 18px;">✉️ rahmatansari4171@gmail.com</a>
                <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:13.5px; padding:9px 18px;">LinkedIn Profile &rarr;</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'terms.html'), termsHtml);

  // =========================================================================
  // 4. COOKIES POLICY PAGE (High-Tech Luxury SaaS Architecture)
const cookiesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cookie Policy &amp; Zero Tracking Guarantee — MomPDF</title>
  <meta name="description" content="Explore MomPDF's Cookie Policy. Minimal essential cookies for language and session preferences. Zero third-party advertising cookies." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    ${complianceCss}

    /* Clean Hero Trust Bar */
    .hero-trust-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .trust-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }
    .cookie-stat-num {
      font-size: 28px;
      font-weight: 900;
      color: #FFFFFF;
      margin-bottom: 4px;
      background: linear-gradient(135deg, #FFFFFF 0%, #FECDD3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .cookie-stat-label {
      font-size: 12.5px;
      color: #94A3B8;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* 6 Pillars Grid */
    .cookie-pillars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin: 32px 0 44px;
    }
    .cookie-pillar-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      transition: all 0.2s ease;
    }
    .cookie-pillar-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -6px rgba(225, 29, 72, 0.08);
    }
    .cookie-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #FEF3C7;
      color: #D97706;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 16px;
    }
    .cookie-pillar-card h3 {
      font-size: 17px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .cookie-pillar-card p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.6;
      margin: 0;
    }

    /* Table */
    .cookie-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0 36px;
      font-size: 14px;
    }
    .cookie-table th {
      background: #F8FAFC;
      color: #0F172A;
      font-weight: 800;
      text-align: left;
      padding: 14px 18px;
      border-bottom: 2px solid #E2E8F0;
    }
    .cookie-table td {
      padding: 14px 18px;
      border-bottom: 1px solid #F1F5F9;
      color: #475569;
    }
    .cookie-table tr:hover td {
      background: #FAFAFA;
    }
    .cookie-tag-essential {
      display: inline-block;
      padding: 4px 10px;
      background: #DCFCE7;
      color: #15803D;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
    }

    /* Browser Cards */
    .browser-guides-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin: 24px 0 36px;
    }
    .browser-guide-card {
      background: #F8FAFC;
      border: 1.5px solid #F1F5F9;
      border-radius: 16px;
      padding: 20px;
    }
    .browser-guide-card h4 {
      font-size: 15px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
    }
    .browser-guide-card p {
      font-size: 13px;
      color: #64748B;
      line-height: 1.5;
      margin: 0;
    }

    /* FAQ Item */
    .cookie-faq-item {
      background: #F8FAFC;
      border: 1.5px solid #F1F5F9;
      border-radius: 16px;
      padding: 22px 26px;
      margin-bottom: 14px;
    }
    .cookie-faq-q {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .cookie-faq-a {
      font-size: 14px;
      color: #475569;
      line-height: 1.65;
      margin: 0;
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <!-- Clean Light Cookies Hero (Matching About Us, Contact Us, Blog & Press) -->
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">Transparent Zero-Tracker Cookie Policy</div>
      <h1 class="hero-title" style="max-width: 900px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        MomPDF Cookie Policy — Minimal, Essential &amp; Private
      </h1>
      <p class="hero-subtitle" style="max-width: 760px; margin: 0 auto; font-size: 16.5px;">
        We only use strictly necessary cookies to remember your 30-language choice and light/dark theme preference. Zero marketing trackers, zero ad profiling.
      </p>

      <div class="hero-trust-bar">
        <span class="trust-chip">🚫 0 Third-Party Ad Cookies</span>
        <span class="trust-chip">🍪 3 Strictly Essential Keys</span>
        <span class="trust-chip">🛡️ 0 Cross-Site Tracking Pixels</span>
        <span class="trust-chip">✓ 100% ePrivacy &amp; GDPR Compliant</span>
      </div>
    </section>

    <div class="trust-container">
      ${getComplianceTabsHtml('cookies')}

      <div class="trust-layout">
        <!-- Sidebar Navigation -->
        <aside class="trust-sidebar">
          <div class="trust-sidebar-title">Cookie Navigation</div>
          <a href="#what-is-cookie" class="trust-nav-item">1. What Are Cookies?</a>
          <a href="#cookie-pillars" class="trust-nav-item">2. 6 Cookie Commitments</a>
          <a href="#cookie-inventory" class="trust-nav-item">3. Active Cookie Registry</a>
          <a href="#no-ad-cookies" class="trust-nav-item">4. Zero Ad Tracking</a>
          <a href="#browser-management" class="trust-nav-item">5. Browser Controls</a>
          <a href="#cookie-faq" class="trust-nav-item">6. Cookie FAQs</a>
          <a href="#cookie-contact" class="trust-nav-item">7. Founder Inquiries</a>
        </aside>

        <!-- Main Content -->
        <div class="trust-content-card">
          <div class="trust-meta-bar">
            <div class="trust-meta-item">Classification: <strong>Strictly Necessary Only</strong></div>
            <div class="trust-meta-item">Third-Party Tracking: <strong>Zero / Disabled</strong></div>
            <div class="trust-meta-item">Effective Date: <strong>August 2026</strong></div>
          </div>

          <!-- Key Executive Highlights Box -->
          <div class="key-takeaways-box">
            <div class="key-takeaways-header">
              <h3 class="key-takeaways-title">🍪 Key Cookie Highlights &amp; Privacy Rules</h3>
              <span class="pill-badge pill-amber">100% Tracking-Free</span>
            </div>
            <div class="takeaway-grid">
              <div class="takeaway-card">
                <strong>0 Ad Trackers</strong>
                <p>Zero cross-site pixels, zero behavioral profiling, and zero Google/Meta ad trackers.</p>
              </div>
              <div class="takeaway-card">
                <strong>3 Essential Keys Only</strong>
                <p>Only stores language preference (30 languages), UI theme, and active temporary job.</p>
              </div>
              <div class="takeaway-card">
                <strong>Local Browser Sandbox</strong>
                <p>Tokens remain in client-side storage and are never uploaded to advertising servers.</p>
              </div>
              <div class="takeaway-card">
                <strong>15-Min Session Expiry</strong>
                <p>Temporary conversion tokens expire automatically after 15 minutes.</p>
              </div>
            </div>
          </div>

          <div class="highlight-banner" style="background:#FFFBEB; border-color:#FDE68A; border-left-color:#D97706;">
            <p style="color:#92400E;">
              🍪 <strong>Zero-Ad Guarantee:</strong> MomPDF does not install cross-site marketing trackers, Facebook Pixels, or Google AdSense profiling cookies.
            </p>
          </div>

          <!-- Section 1 -->
          <section id="what-is-cookie" class="trust-section">
            <h2>1. What Are Cookies &amp; Local Storage?</h2>
            <p>
              Cookies and browser local storage tokens are small, secure text records placed in your browser when you visit a website. They allow websites to remember essential settings—such as which language you prefer or your active theme—without asking you repeatedly on every page load.
            </p>
            <p>
              Under the leadership of founder <strong>Md Rahmat Ansari</strong>, MomPDF was designed to minimize cookie usage to the absolute bare minimum required for basic utility.
            </p>
          </section>

          <!-- Section 2: 6 Pillars Grid -->
          <section id="cookie-pillars" class="trust-section">
            <h2>2. The Six Commitments of MomPDF Cookie Standards</h2>
            <div class="cookie-pillars-grid">
              <div class="cookie-pillar-card">
                <div class="cookie-icon-box">🚫</div>
                <h3>Zero Advertising Cookies</h3>
                <p>We do not monetize your browsing data or allow ad networks to track your document activity.</p>
              </div>
              <div class="cookie-pillar-card">
                <div class="cookie-icon-box">⚙️</div>
                <h3>Strictly Functional Only</h3>
                <p>Cookies exist purely to store your selected interface language and light/dark theme preference.</p>
              </div>
              <div class="cookie-pillar-card">
                <div class="cookie-icon-box">🔒</div>
                <h3>Client-Side Encrypted</h3>
                <p>Tokens remain securely stored in your local web browser sandbox and are not harvested into server databases.</p>
              </div>
              <div class="cookie-pillar-card">
                <div class="cookie-icon-box">⏱️</div>
                <h3>15-Minute Session Expiry</h3>
                <p>Temporary job tokens automatically expire after 15 minutes in alignment with our file shredding protocol.</p>
              </div>
              <div class="cookie-pillar-card">
                <div class="cookie-icon-box">🌐</div>
                <h3>ePrivacy &amp; GDPR Compliant</h3>
                <p>Fully compliant with EU ePrivacy Directives, California CCPA/CPRA, and international standards.</p>
              </div>
              <div class="cookie-pillar-card">
                <div class="cookie-icon-box">🛡️</div>
                <h3>Full User Control</h3>
                <p>You can easily delete, inspect, or block cookies at any time directly through your browser settings.</p>
              </div>
            </div>
          </section>

          <!-- Section 3: Active Cookie Registry -->
          <section id="cookie-inventory" class="trust-section">
            <h2>3. Complete Active Cookie &amp; Storage Registry</h2>
            <p>
              Below is the comprehensive, transparent list of every cookie and storage token utilized on MomPDF:
            </p>
            <table class="cookie-table">
              <thead>
                <tr>
                  <th>Storage Key</th>
                  <th>Classification</th>
                  <th>Lifespan</th>
                  <th>Scope</th>
                  <th>Technical Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>mompdf_lang</code></td>
                  <td><span class="cookie-tag-essential">Essential</span></td>
                  <td>1 Year</td>
                  <td>First-Party</td>
                  <td>Remembers your preferred language selection among our 30 supported languages.</td>
                </tr>
                <tr>
                  <td><code>mompdf_theme</code></td>
                  <td><span class="cookie-tag-essential">Essential</span></td>
                  <td>1 Year</td>
                  <td>First-Party</td>
                  <td>Preserves your light/dark mode and high-contrast accessibility interface preference.</td>
                </tr>
                <tr>
                  <td><code>mompdf_session</code></td>
                  <td><span class="cookie-tag-essential">Essential</span></td>
                  <td>15 Mins</td>
                  <td>First-Party</td>
                  <td>Maintains active ephemeral connection to temporary in-memory PDF processing jobs.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Section 4 -->
          <section id="no-ad-cookies" class="trust-section">
            <h2>4. Zero Third-Party Advertising &amp; Fingerprinting Guarantee</h2>
            <p>
              Unlike legacy PDF converter portals that bombard users with popup advertisements and cross-site tracking pixels:
            </p>
            <ul>
              <li><strong>Zero Behavioral Tracking:</strong> We do not track what files you convert or your activity across other websites.</li>
              <li><strong>Zero Marketing Networks:</strong> We do not load Google AdSense, Facebook Pixel, Criteo, or data broker scripts.</li>
              <li><strong>Zero Device Fingerprinting:</strong> We do not inspect your canvas, WebGL, or hardware specs to create persistent user profiles.</li>
            </ul>
          </section>

          <!-- Section 5: Browser Management -->
          <section id="browser-management" class="trust-section">
            <h2>5. Managing and Disabling Cookies by Browser</h2>
            <p>
              You maintain total autonomy over cookies on your machine. To inspect or clear cookies, follow these official browser steps:
            </p>

            <div class="browser-guides-grid">
              <div class="browser-guide-card">
                <h4>🌐 Google Chrome</h4>
                <p>Settings &rarr; Privacy and security &rarr; Third-party cookies &rarr; Clear browsing data.</p>
              </div>
              <div class="browser-guide-card">
                <h4>🦊 Mozilla Firefox</h4>
                <p>Settings &rarr; Privacy &amp; Security &rarr; Enhanced Tracking Protection &rarr; Clear Data.</p>
              </div>
              <div class="browser-guide-card">
                <h4>🧭 Apple Safari</h4>
                <p>Preferences &rarr; Privacy &rarr; Manage Website Data &rarr; Remove All.</p>
              </div>
              <div class="browser-guide-card">
                <h4>🔷 Microsoft Edge</h4>
                <p>Settings &rarr; Cookies and site permissions &rarr; Manage and delete cookies.</p>
              </div>
            </div>
          </section>

          <!-- Section 6: FAQ -->
          <section id="cookie-faq" class="trust-section">
            <h2>6. Frequently Asked Cookie Questions</h2>
            
            <div class="cookie-faq-item">
              <div class="cookie-faq-q">Q: Can I use MomPDF with cookies completely disabled in my browser?</div>
              <p class="cookie-faq-a">Yes. MomPDF will function smoothly for PDF conversions even if cookies are disabled, though your language preference will reset to English upon page reload.</p>
            </div>

            <div class="cookie-faq-item">
              <div class="cookie-faq-q">Q: Do MomPDF cookies contain my personal name or document text?</div>
              <p class="cookie-faq-a">No. MomPDF cookies never contain personal identity information or document contents. They only store simple string tokens like "lang=es" or "theme=dark".</p>
            </div>

            <div class="cookie-faq-item">
              <div class="cookie-faq-q">Q: Does MomPDF share cookie telemetry with advertisers?</div>
              <p class="cookie-faq-a">No. We do not partner with advertising networks or share any telemetry data with commercial marketing platforms.</p>
            </div>
          </section>

          <!-- Section 7: Leadership Contact -->
          <section id="cookie-contact" class="trust-section">
            <h2>7. Questions Regarding Our Cookie Standards</h2>
            <p>
              For inquiries regarding our cookie standards, reach out directly to our leadership:
            </p>
            <div class="trust-leader-box">
              <div>
                <strong style="font-size:16px; color:#0F172A;">Md Rahmat Ansari</strong>
                <p style="margin:2px 0 0; font-size:13px; color:#64748B;">Founder &amp; Principal Systems Architect</p>
                <p style="margin:4px 0 0; font-size:12px; color:#E11D48; font-weight:700;">Zero-Ad Standards Desk</p>
              </div>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-primary" style="font-size:13.5px; padding:9px 18px;">✉️ rahmatansari4171@gmail.com</a>
                <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:13.5px; padding:9px 18px;">LinkedIn Profile &rarr;</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'cookies.html'), cookiesHtml);

  // =========================================================================
  // 5. EDUCATION SUITE PAGE (Unique Standalone Academic & Student SaaS Hub)
  // =========================================================================
  const educationHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MomPDF for Education — Free, Powerful PDF Tools for Students &amp; Researchers</title>
  <meta name="description" content="MomPDF Education Hub. Free textbook compression, OCR lecture digitization, thesis organizer, and private research paper processing for students, PhD scholars, and educators." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    @keyframes edu-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    @keyframes pulse-live {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .live-pulse-dot {
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
      display: inline-block;
      animation: pulse-live 2s infinite;
      vertical-align: middle;
      margin-right: 6px;
    }

    /* Clean Hero Trust Bar */
    .hero-trust-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .trust-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }

    /* Container */
    .edu-container {
      max-width: 1140px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }

    /* Persona Selector Cards */
    .persona-section-header {
      text-align: center;
      margin: 60px auto 32px;
      max-width: 700px;
    }
    .persona-badge {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #E11D48;
      background: #FFE4E6;
      padding: 4px 14px;
      border-radius: 9999px;
      display: inline-block;
      margin-bottom: 10px;
    }
    .persona-section-header h2 {
      font-size: 30px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 10px;
      letter-spacing: -0.5px;
    }
    .persona-section-header p {
      font-size: 15px;
      color: #64748B;
      margin: 0;
    }
    .persona-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 60px;
    }
    .persona-card {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .persona-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-4px);
      box-shadow: 0 16px 30px -8px rgba(225, 29, 72, 0.12);
    }
    .persona-icon {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      background: #FFE4E6;
      color: #E11D48;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 18px;
    }
    .persona-card h3 {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .persona-card p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.6;
      margin: 0 0 16px;
    }
    .persona-tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .persona-tag {
      font-size: 11.5px;
      font-weight: 700;
      padding: 3px 8px;
      background: #F1F5F9;
      color: #475569;
      border-radius: 6px;
    }

    /* Quick Launch Tools Grid */
    .launchpad-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 22px;
      margin: 36px 0 60px;
    }
    .launch-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 26px;
      display: flex;
      gap: 18px;
      align-items: flex-start;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
      transition: all 0.25s ease;
    }
    .launch-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -6px rgba(225, 29, 72, 0.1);
    }
    .launch-icon-box {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      background: linear-gradient(135deg, #FFE4E6 0%, #FFF1F2 100%);
      color: #E11D48;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .launch-content h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .launch-content p {
      font-size: 13px;
      color: #64748B;
      margin: 0 0 10px;
      line-height: 1.5;
    }
    .launch-action-text {
      font-size: 12px;
      font-weight: 800;
      color: #E11D48;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    /* Interactive Workflow Banner */
    .edu-workflow-banner {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      border-radius: 24px;
      padding: 40px 36px;
      color: #FFFFFF;
      margin: 60px 0;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.4);
    }
    .workflow-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 28px;
    }
    .workflow-step {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      padding: 20px;
      transition: all 0.2s ease;
    }
    .workflow-step:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #FDA4AF;
      transform: translateY(-2px);
    }
    .step-badge {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 12px;
    }
    .workflow-step h5 {
      font-size: 14.5px;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0 0 6px;
    }
    .workflow-step p {
      font-size: 12px;
      color: #CBD5E1;
      line-height: 1.5;
      margin: 0;
    }

    /* Campus Ecosystem Grid */
    .campus-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin: 32px 0 60px;
    }
    .campus-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
    }
    .campus-card h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .campus-card p {
      font-size: 13px;
      color: #64748B;
      line-height: 1.5;
      margin: 0;
    }

    /* FAQ Section */
    .edu-faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 18px;
      margin: 32px 0 60px;
    }
    .edu-faq-box {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 18px;
      padding: 26px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
    }
    .edu-faq-box:hover {
      border-color: #FDA4AF;
    }
    .edu-faq-box h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 10px;
    }
    .edu-faq-box p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.65;
      margin: 0;
    }

    /* Leader Card */
    .academic-leader-banner {
      background: linear-gradient(135deg, #F8FAFC 0%, #FFF1F2 100%);
      border: 1.5px solid #FECDD3;
      border-radius: 22px;
      padding: 32px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      box-shadow: 0 10px 30px -10px rgba(225, 29, 72, 0.08);
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <!-- Clean Light Education Hero (Matching About Us, Contact Us, Blog & Press) -->
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">Academic &amp; Student Solutions</div>
      <h1 class="hero-title" style="max-width: 920px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        The All-In-One PDF Suite Built for Modern Education
      </h1>
      <p class="hero-subtitle" style="max-width: 800px; margin: 0 auto 24px; font-size: 16.5px;">
        Empowering students, researchers, and university faculties with lightning-fast textbook compression, OCR lecture digitization, and private thesis management tools. 100% free with zero paywalls.
      </p>

      <div style="display:flex; justify-content:center; gap:12px; margin-bottom:28px; flex-wrap:wrap;">
        <a href="workspace.html" class="btn btn-primary">🚀 Launch PDF Workspace &rarr;</a>
        <a href="#academic-tools" class="btn btn-secondary">📚 Explore Student Tools</a>
      </div>

      <div class="hero-trust-bar">
        <span class="trust-chip">🎓 100% Free Zero Student Paywalls</span>
        <span class="trust-chip">⚡ 30+ Tools OCR &amp; Conversion</span>
        <span class="trust-chip">🔒 15 Min Thesis Confidentiality Shred</span>
        <span class="trust-chip">🌐 150+ Global Academic Campuses</span>
      </div>
    </section>

    <div class="edu-container">
      <!-- Section 1: Persona Switcher Grid -->
      <div class="persona-section-header">
        <div class="persona-badge">Tailored For Academia</div>
        <h2>Engineered for Every Academic Milestone</h2>
        <p>Whether you are cramming for semester exams, writing a PhD thesis, or preparing lecture materials, MomPDF adapts to your workflow.</p>
      </div>

      <div class="persona-grid">
        <div class="persona-card">
          <div class="persona-icon">🎓</div>
          <h3>Undergraduate Students</h3>
          <p>Compress massive textbook scans, convert PDF lecture slides to editable Word, and merge coursework assignments for Canvas.</p>
          <div class="persona-tag-list">
            <span class="persona-tag">Textbook Compress</span>
            <span class="persona-tag" data-i18n="pdf_to_word">PDF to Word</span>
            <span class="persona-tag" data-i18n="jpg_to_pdf">JPG to PDF</span>
          </div>
        </div>

        <div class="persona-card">
          <div class="persona-icon">🔬</div>
          <h3>PhD Scholars &amp; Researchers</h3>
          <p>OCR scanned historical journals, extract citations with AI summarization, and bind multi-chapter dissertation drafts safely.</p>
          <div class="persona-tag-list">
            <span class="persona-tag">OCR Extractor</span>
            <span class="persona-tag" data-i18n="ai_summarizer">AI Summarizer</span>
            <span class="persona-tag">Thesis Organize</span>
          </div>
        </div>

        <div class="persona-card">
          <div class="persona-icon">🏫</div>
          <h3>Professors &amp; Educators</h3>
          <p>Split exam question papers, apply university watermarks to course packs, and convert PowerPoint lectures to high-res handouts.</p>
          <div class="persona-tag-list">
            <span class="persona-tag">Split Exam Papers</span>
            <span class="persona-tag" data-i18n="add_watermark">Add Watermark</span>
            <span class="persona-tag">PPT to PDF</span>
          </div>
        </div>

        <div class="persona-card">
          <div class="persona-icon">🏛️</div>
          <h3>Libraries &amp; Institutions</h3>
          <p>Preserve campus archives with ISO-compliant PDF/A conversion, batch document processing, and zero-retention privacy.</p>
          <div class="persona-tag-list">
            <span class="persona-tag">PDF/A Archiving</span>
            <span class="persona-tag">Batch Protect</span>
            <span class="persona-tag">RAM Shredder</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Quick Launch Tools Grid -->
      <div id="academic-tools" class="persona-section-header">
        <div class="persona-badge">Student Launchpad</div>
        <h2>Essential Academic Tools — 1-Click Launch</h2>
        <p>Direct access to the most frequently used utilities by college students and researchers worldwide.</p>
      </div>

      <div class="launchpad-grid">
        <a href="compress_pdf.html" class="launch-card">
          <div class="launch-icon-box">🗜️</div>
          <div class="launch-content">
            <h4>Textbook Shrinker <span>&rarr;</span></h4>
            <p>Reduce 200MB+ textbook scans up to 90% without losing diagram sharpness for LMS upload.</p>
            <span class="launch-action-text">Compress PDF Free &rarr;</span>
          </div>
        </a>

        <a href="ocr-pdf.html" class="launch-card">
          <div class="launch-icon-box">🔍</div>
          <div class="launch-content">
            <h4>OCR Notes Digitizer <span>&rarr;</span></h4>
            <p>Extract searchable text and mathematical formulas from scanned library books and whiteboards.</p>
            <span class="launch-action-text">Run OCR Engine &rarr;</span>
          </div>
        </a>

        <a href="pdf-summarize.html" class="launch-card">
          <div class="launch-icon-box">🤖</div>
          <div class="launch-content">
            <h4>AI Research Summarizer <span>&rarr;</span></h4>
            <p>Extract key findings, methodology summaries, and abstracts from 50-page scientific papers.</p>
            <span class="launch-action-text">Summarize Paper &rarr;</span>
          </div>
        </a>

        <a href="organize-pdf.html" class="launch-card">
          <div class="launch-icon-box">📑</div>
          <div class="launch-content">
            <h4>Thesis &amp; Chapter Organizer <span>&rarr;</span></h4>
            <p>Reorder dissertation pages, delete extra drafts, and merge literature review appendices.</p>
            <span class="launch-action-text">Organize Pages &rarr;</span>
          </div>
        </a>

        <a href="powerpoint_to_pdf.html" class="launch-card">
          <div class="launch-icon-box">📊</div>
          <div class="launch-content">
            <h4>Lecture Slides to PDF <span>&rarr;</span></h4>
            <p>Turn heavy PowerPoint presentations into print-ready PDF study guides and lecture handouts.</p>
            <span class="launch-action-text">Convert PPT &rarr;</span>
          </div>
        </a>

        <a href="sign-pdf.html" class="launch-card">
          <div class="launch-icon-box">✍️</div>
          <div class="launch-content">
            <h4>Scholarship &amp; Form Signer <span>&rarr;</span></h4>
            <p>Sign financial aid forms, university admission letters, and internship agreements online.</p>
            <span class="launch-action-text">Sign Document &rarr;</span>
          </div>
        </a>
      </div>

      <!-- Section 3: Student Workflow Data Box -->
      <div class="edu-workflow-banner">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-size:22px; font-weight:900; margin:0 0 6px; color:#FFFFFF;">How MomPDF Accelerates Semester Workflows</h3>
            <p style="font-size:14px; color:#FECDD3; margin:0;">Zero software installation required. Seamless in-browser execution.</p>
          </div>
          <span style="font-size:12px; background:rgba(255,255,255,0.15); color:#FFFFFF; padding:5px 14px; border-radius:9999px; font-weight:800; text-transform:uppercase;">100% In-Memory</span>
        </div>

        <div class="workflow-grid">
          <div class="workflow-step">
            <div class="step-badge">1</div>
            <h5>1. Coursework Ingress</h5>
            <p>Drag &amp; drop heavy textbook scans, lab reports, or lecture slides over encrypted TLS 1.3.</p>
          </div>
          <div class="workflow-step">
            <div class="step-badge">2</div>
            <h5>2. RAM Sandbox Processing</h5>
            <p>High-speed OCR recognition, lossless compression, or page reordering runs purely in dynamic memory.</p>
          </div>
          <div class="workflow-step">
            <div class="step-badge">3</div>
            <h5>3. Single-Click Download</h5>
            <p>Instantly download clean, submission-ready PDF or Word files to your laptop, tablet, or phone.</p>
          </div>
          <div class="workflow-step">
            <div class="step-badge">4</div>
            <h5>4. Automated 15m Shred</h5>
            <p>All temporary files are permanently wiped after 15 minutes, guaranteeing research confidentiality.</p>
          </div>
        </div>
      </div>

      <!-- Section 4: Campus LMS Compatibility -->
      <div class="persona-section-header">
        <div class="persona-badge">Campus Compatibility</div>
        <h2>100% Compatible with Higher Ed Platforms</h2>
        <p>MomPDF produces clean, standard ISO-compliant PDFs ready for immediate submission across university portals.</p>
      </div>

      <div class="campus-grid">
        <div class="campus-card">
          <h4>🎨 Canvas &amp; Blackboard</h4>
          <p>Easily stay under assignment upload file size quotas by compressing textbook scans and project slides.</p>
        </div>
        <div class="campus-card">
          <h4>📂 Google Classroom &amp; Moodle</h4>
          <p>Combine scattered lab exercises, homework sheets, and reference materials into a clean single-file PDF.</p>
        </div>
        <div class="campus-card">
          <h4>🛡️ Turnitin &amp; Plagiarism Checkers</h4>
          <p>OCR scanned book pages into clean text layers that indexing engines and grading systems can read.</p>
        </div>
        <div class="campus-card">
          <h4>🔬 LaTeX &amp; Overleaf</h4>
          <p>Seamlessly bind compiled scientific PDF papers with external experimental charts and bibliographies.</p>
        </div>
      </div>

      <!-- Section 5: Academic FAQs -->
      <div class="persona-section-header">
        <div class="persona-badge">Common Questions</div>
        <h2>Frequently Asked Academic Questions</h2>
      </div>

      <div class="edu-faq-grid">
        <div class="edu-faq-box">
          <h4>Q: Is MomPDF truly 100% free for college students and researchers?</h4>
          <p>Yes. All 30+ tools—including OCR, textbook compression, PDF to Word, and AI summarization—are completely free with no paywalls or subscription traps.</p>
        </div>
        <div class="edu-faq-box">
          <h4>Q: Will my unpublished thesis or research paper be protected from leaks?</h4>
          <p>Yes. We operate under strict zero-retention memory sandboxing. Your files are never stored, indexed, or used to train AI models, and are irreversibly shredded after 15 minutes.</p>
        </div>
        <div class="edu-faq-box">
          <h4>Q: Can MomPDF handle large 300+ page textbook PDFs?</h4>
          <p>Yes. Our compute cluster is engineered for high-throughput batch operations and can compress, split, and convert large academic textbooks and dissertations seamlessly.</p>
        </div>
        <div class="edu-faq-box">
          <h4>Q: Does MomPDF work on library Chromebooks and iPads?</h4>
          <p>Yes. MomPDF is 100% web-based and runs in any modern browser without needing software installation or administrator privileges.</p>
        </div>
      </div>

      <!-- Section 6: Leadership Card -->
      <div class="academic-leader-banner">
        <div>
          <strong style="font-size:17px; color:#0F172A;">Md Rahmat Ansari</strong>
          <p style="margin:2px 0 0; font-size:13.5px; color:#475569;">Founder &amp; Principal Systems Architect</p>
          <p style="margin:4px 0 0; font-size:12.5px; color:#E11D48; font-weight:800;">Academic &amp; Research Innovation Desk</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-primary" style="font-size:13.5px; padding:10px 20px; background:#E11D48; border-color:#E11D48;">✉️ rahmatansari4171@gmail.com</a>
          <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:13.5px; padding:10px 20px;">LinkedIn Profile &rarr;</a>
        </div>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'education.html'), educationHtml);

  // =========================================================================
  // 5.5 FEATURES SHOWCASE PAGE (Ultra-Luxurious PDF Engine & Feature Suite Hub)
  // =========================================================================
  const featuresHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Features — MomPDF All-in-One PDF Suite</title>
  <meta name="description" content="Explore 30+ powerful PDF tools in MomPDF. High-speed OCR text extraction, 90% lossless compression, cryptographic digital signatures, AI summarizer, and multi-format conversion." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    @keyframes pulse-live {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .live-pulse-dot {
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
      display: inline-block;
      animation: pulse-live 2s infinite;
      vertical-align: middle;
      margin-right: 6px;
    }

    /* Clean Hero Trust Bar */
    .hero-trust-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .trust-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }

    /* Container */
    .edu-container {
      max-width: 1140px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }

    /* Category Header */
    .persona-section-header {
      text-align: center;
      margin: 60px auto 32px;
      max-width: 700px;
    }
    .persona-badge {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #E11D48;
      background: #FFE4E6;
      padding: 4px 14px;
      border-radius: 9999px;
      display: inline-block;
      margin-bottom: 10px;
    }
    .persona-section-header h2 {
      font-size: 30px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 10px;
      letter-spacing: -0.5px;
    }
    .persona-section-header p {
      font-size: 15px;
      color: #64748B;
      margin: 0;
    }

    /* 6 Main Category Pillar Cards */
    .persona-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
      margin-bottom: 60px;
    }
    .persona-card {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .persona-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-4px);
      box-shadow: 0 16px 30px -8px rgba(225, 29, 72, 0.12);
    }
    .persona-icon {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      background: #FFE4E6;
      color: #E11D48;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 18px;
    }
    .persona-card h3 {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .persona-card p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.6;
      margin: 0 0 16px;
    }
    .persona-tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .persona-tag {
      font-size: 11.5px;
      font-weight: 700;
      padding: 3px 8px;
      background: #F1F5F9;
      color: #475569;
      border-radius: 6px;
    }

    /* Launchpad Grid */
    .launchpad-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 22px;
      margin: 36px 0 60px;
    }
    .launch-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 26px;
      display: flex;
      gap: 18px;
      align-items: flex-start;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
      transition: all 0.25s ease;
    }
    .launch-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -6px rgba(225, 29, 72, 0.1);
    }
    .launch-icon-box {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      background: linear-gradient(135deg, #FFE4E6 0%, #FFF1F2 100%);
      color: #E11D48;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .launch-content h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .launch-content p {
      font-size: 13px;
      color: #64748B;
      margin: 0 0 10px;
      line-height: 1.5;
    }
    .launch-action-text {
      font-size: 12px;
      font-weight: 800;
      color: #E11D48;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    /* Workflow Banner (Unified MomPDF Crimson Brand Theme) */
    .edu-workflow-banner {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      border-radius: 24px;
      padding: 40px 36px;
      color: #FFFFFF;
      margin: 60px 0;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.4);
    }
    .workflow-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 28px;
    }
    .workflow-step {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      padding: 20px;
      transition: all 0.2s ease;
    }
    .workflow-step:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #FDA4AF;
      transform: translateY(-2px);
    }
    .step-badge {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 12px;
    }
    .workflow-step h5 {
      font-size: 14.5px;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0 0 6px;
    }
    .workflow-step p {
      font-size: 12px;
      color: #CBD5E1;
      line-height: 1.5;
      margin: 0;
    }

    /* Cross Platform Ecosystem Grid */
    .campus-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin: 32px 0 60px;
    }
    .campus-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
      transition: all 0.2s ease;
    }
    .campus-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-2px);
    }
    .campus-card h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .campus-card p {
      font-size: 13px;
      color: #64748B;
      line-height: 1.5;
      margin: 0;
    }

    /* FAQ Section */
    .edu-faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 18px;
      margin: 32px 0 60px;
    }
    .edu-faq-box {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 18px;
      padding: 26px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
      transition: all 0.2s ease;
    }
    .edu-faq-box:hover {
      border-color: #FDA4AF;
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -6px rgba(225, 29, 72, 0.1);
    }
    .edu-faq-box h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 10px;
    }
    .edu-faq-box p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.65;
      margin: 0;
    }

    /* Leader Card */
    .academic-leader-banner {
      background: linear-gradient(135deg, #F8FAFC 0%, #FFF1F2 100%);
      border: 1.5px solid #FECDD3;
      border-radius: 22px;
      padding: 32px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      box-shadow: 0 10px 30px -10px rgba(225, 29, 72, 0.08);
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <!-- Clean Light Features Hero (Matching About Us, Contact Us, Blog & Press) -->
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">30+ High-Performance PDF Engines</div>
      <h1 class="hero-title" style="max-width: 920px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        The World's Most Advanced PDF Engine in One Unified Interface
      </h1>
      <p class="hero-subtitle" style="max-width: 800px; margin: 0 auto 24px; font-size: 16.5px;">
        From OCR text extraction and 90% lossless compression to cryptographically secure digital signatures and AI summarization. Engineered for speed, security, and precision.
      </p>

      <div style="display:flex; justify-content:center; gap:12px; margin-bottom:28px; flex-wrap:wrap;">
        <a href="workspace.html" class="btn btn-primary">🚀 Launch PDF Workspace &rarr;</a>
        <a href="#core-features" class="btn btn-secondary">⚡ Explore All 30 Tools</a>
      </div>

      <div class="hero-trust-bar">
        <span class="trust-chip">⚡ 30+ Specialized PDF Engines</span>
        <span class="trust-chip">⏱️ &lt; 1s Conversion Latency</span>
        <span class="trust-chip">🔒 15 Min Ephemeral Auto-Shred</span>
        <span class="trust-chip">💯 100% Free Zero Paywalls</span>
      </div>
    </section>

    <div class="edu-container">
      <!-- Section 1: 6 Main Functional Suites -->
      <div class="persona-section-header">
        <div class="persona-badge">Architectural Suites</div>
        <h2>Six Core Capabilities Powering MomPDF</h2>
        <p>A unified suite built with precision algorithms, WebAssembly client rendering, and high-throughput cloud clusters.</p>
      </div>

      <div class="persona-grid">
        <div class="persona-card">
          <div class="persona-icon">🔄</div>
          <h3>Convert &amp; Transform</h3>
          <p>High-fidelity format interchange between PDF, Word DOCX, Excel XLSX, PowerPoint PPTX, JPG, and HTML web links.</p>
          <div class="persona-tag-list">
            <span class="persona-tag" data-i18n="pdf_to_word">PDF to Word</span>
            <span class="persona-tag" data-i18n="excel_to_pdf">Excel to PDF</span>
            <span class="persona-tag" data-i18n="html_to_pdf">HTML to PDF</span>
            <span class="persona-tag" data-i18n="jpg_to_pdf">JPG to PDF</span>
          </div>
        </div>

        <div class="persona-card">
          <div class="persona-icon">🗜️</div>
          <h3>Compress &amp; Optimize</h3>
          <p>Lossless vector optimization, image re-sampling, and fast web stream linearization to slash file sizes up to 90%.</p>
          <div class="persona-tag-list">
            <span class="persona-tag">Lossless Compress</span>
            <span class="persona-tag" data-i18n="crop_pdf">Crop PDF</span>
            <span class="persona-tag">Fast Web Linearize</span>
          </div>
        </div>

        <div class="persona-card">
          <div class="persona-icon">📑</div>
          <h3>Organize &amp; Structure</h3>
          <p>Reorder pages, merge multiple disparate PDF documents, split specific page ranges, and rotate orientations effortlessly.</p>
          <div class="persona-tag-list">
            <span class="persona-tag" data-i18n="merge_pdf">Merge PDF</span>
            <span class="persona-tag">Split Range</span>
            <span class="persona-tag" data-i18n="remove_pages">Remove Pages</span>
            <span class="persona-tag">Rotate</span>
          </div>
        </div>

        <div class="persona-card">
          <div class="persona-icon">🔒</div>
          <h3>Security &amp; Archival</h3>
          <p>Irreversible PII redaction, 256-bit AES encryption locking, permission management, and long-term ISO PDF/A compliance.</p>
          <div class="persona-tag-list">
            <span class="persona-tag" data-i18n="redact_pdf">Redact PDF</span>
            <span class="persona-tag">Protect Password</span>
            <span class="persona-tag" data-i18n="unlock_pdf">Unlock PDF</span>
            <span class="persona-tag">PDF/A</span>
          </div>
        </div>

        <div class="persona-card">
          <div class="persona-icon">🤖</div>
          <h3>AI &amp; Smart Digitization</h3>
          <p>Tesseract OCR multi-language character recognition, AI key takeaway summarizer, and automated multi-lingual translation.</p>
          <div class="persona-tag-list">
            <span class="persona-tag">OCR Text Extractor</span>
            <span class="persona-tag">AI Summarize</span>
            <span class="persona-tag" data-i18n="translate_pdf">Translate PDF</span>
          </div>
        </div>

        <div class="persona-card">
          <div class="persona-icon">✍️</div>
          <h3>Edit &amp; Annotate</h3>
          <p>Legally binding electronic signatures, custom corporate watermarking, and dynamic header/footer page numbering.</p>
          <div class="persona-tag-list">
            <span class="persona-tag" data-i18n="sign_pdf">Sign PDF</span>
            <span class="persona-tag" data-i18n="add_watermark">Add Watermark</span>
            <span class="persona-tag" data-i18n="add_page_numbers">Add Page Numbers</span>
            <span class="persona-tag" data-i18n="compare_pdf">Compare PDF</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Direct 30-Tool Launchpad Grid -->
      <div id="core-features" class="persona-section-header">
        <div class="persona-badge">All 30 Utilities</div>
        <h2>The Complete MomPDF Tool Launchpad</h2>
        <p>Select any tool below to launch its dedicated high-speed workspace interface.</p>
      </div>

      <div class="launchpad-grid">
        <a href="merge_pdf.html" class="launch-card">
          <div class="launch-icon-box">📑</div>
          <div class="launch-content">
            <h4 data-i18n="merge_pdf">Merge PDF <span>&rarr;</span></h4>
            <p>Combine multiple PDFs into one unified file in your exact desired order.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="split_pdf.html" class="launch-card">
          <div class="launch-icon-box">✂️</div>
          <div class="launch-content">
            <h4 data-i18n="split_pdf">Split PDF <span>&rarr;</span></h4>
            <p>Extract specific page ranges or split each page into standalone files.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="compress_pdf.html" class="launch-card">
          <div class="launch-icon-box">🗜️</div>
          <div class="launch-content">
            <h4 data-i18n="compress_pdf">Compress PDF <span>&rarr;</span></h4>
            <p>Reduce document file size up to 90% while preserving text and diagram sharpness.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="pdf_to_word.html" class="launch-card">
          <div class="launch-icon-box">📝</div>
          <div class="launch-content">
            <h4 data-i18n="pdf_to_word">PDF to Word <span>&rarr;</span></h4>
            <p>Convert PDFs to fully editable Microsoft Word DOCX documents seamlessly.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="word_to_pdf.html" class="launch-card">
          <div class="launch-icon-box">📄</div>
          <div class="launch-content">
            <h4 data-i18n="word_to_pdf">Word to PDF <span>&rarr;</span></h4>
            <p>Transform DOCX manuscripts into polished, standardized PDF files.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="pdf_to_excel.html" class="launch-card">
          <div class="launch-icon-box">📊</div>
          <div class="launch-content">
            <h4 data-i18n="pdf_to_excel">PDF to Excel <span>&rarr;</span></h4>
            <p>Extract tabular numbers and financial records directly into clean XLSX spreadsheets.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="excel_to_pdf.html" class="launch-card">
          <div class="launch-icon-box">📈</div>
          <div class="launch-content">
            <h4 data-i18n="excel_to_pdf">Excel to PDF <span>&rarr;</span></h4>
            <p>Render spreadsheets and balance sheets into crisp, print-ready PDFs.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="pdf_to_powerpoint.html" class="launch-card">
          <div class="launch-icon-box">🖥️</div>
          <div class="launch-content">
            <h4 data-i18n="pdf_to_powerpoint">PDF to PowerPoint <span>&rarr;</span></h4>
            <p>Convert slide PDFs back into editable Microsoft PowerPoint PPTX presentations.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="powerpoint_to_pdf.html" class="launch-card">
          <div class="launch-icon-box">📽️</div>
          <div class="launch-content">
            <h4 data-i18n="powerpoint_to_pdf">PowerPoint to PDF <span>&rarr;</span></h4>
            <p>Export slide decks to universal PDF handouts for easy sharing.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="ocr-pdf.html" class="launch-card">
          <div class="launch-icon-box">🔍</div>
          <div class="launch-content">
            <h4 data-i18n="ocr_pdf">OCR PDF <span>&rarr;</span></h4>
            <p>Extract searchable, copyable text from scanned documents and images.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="pdf-summarize.html" class="launch-card">
          <div class="launch-icon-box">🤖</div>
          <div class="launch-content">
            <h4>AI PDF Summarizer <span>&rarr;</span></h4>
            <p>Generate instant executive summaries and key bullet points from long documents.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="sign-pdf.html" class="launch-card">
          <div class="launch-icon-box">✍️</div>
          <div class="launch-content">
            <h4 data-i18n="sign_pdf">Sign PDF <span>&rarr;</span></h4>
            <p>Draw, type, or upload verifiable electronic signatures to contracts.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="redact-pdf.html" class="launch-card">
          <div class="launch-icon-box">🛡️</div>
          <div class="launch-content">
            <h4 data-i18n="redact_pdf">Redact PDF <span>&rarr;</span></h4>
            <p>Permanently black out private PII and sensitive data before public sharing.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="protect-pdf.html" class="launch-card">
          <div class="launch-icon-box">🔒</div>
          <div class="launch-content">
            <h4 data-i18n="protect_pdf">Protect PDF <span>&rarr;</span></h4>
            <p>Encrypt PDF files with robust passwords and strict permission control.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="unlock_pdf.html" class="launch-card">
          <div class="launch-icon-box">🔓</div>
          <div class="launch-content">
            <h4 data-i18n="unlock_pdf">Unlock PDF <span>&rarr;</span></h4>
            <p>Remove passwords and edit restrictions from files you own.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="convert-pdf-to-pdfa.html" class="launch-card">
          <div class="launch-icon-box">🏛️</div>
          <div class="launch-content">
            <h4 data-i18n="pdf_to_pdfa">PDF to PDF/A <span>&rarr;</span></h4>
            <p>Convert documents to ISO 19005-1 archival standard for long-term preservation.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="rotate_pdf.html" class="launch-card">
          <div class="launch-icon-box">🔄</div>
          <div class="launch-content">
            <h4 data-i18n="rotate_pdf">Rotate PDF <span>&rarr;</span></h4>
            <p>Rotate individual or all pages clockwise or counterclockwise permanently.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="crop-pdf.html" class="launch-card">
          <div class="launch-icon-box">📐</div>
          <div class="launch-content">
            <h4 data-i18n="crop_pdf">Crop PDF <span>&rarr;</span></h4>
            <p>Trim margins and crop specific rectangular areas across PDF pages.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="organize-pdf.html" class="launch-card">
          <div class="launch-icon-box">🗂️</div>
          <div class="launch-content">
            <h4 data-i18n="organize_pdf">Organize PDF <span>&rarr;</span></h4>
            <p>Drag, drop, delete, and rearrange page thumbnails in real-time visual grid.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="remove-pages.html" class="launch-card">
          <div class="launch-icon-box">🗑️</div>
          <div class="launch-content">
            <h4 data-i18n="remove_pages">Remove Pages <span>&rarr;</span></h4>
            <p>Delete unwanted blank or obsolete pages from your documents in one click.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="pdf_add_watermark.html" class="launch-card">
          <div class="launch-icon-box">💧</div>
          <div class="launch-content">
            <h4 data-i18n="add_watermark">Add Watermark <span>&rarr;</span></h4>
            <p>Apply custom text or logo stamps with adjustable opacity and rotation.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="add_pdf_page_number.html" class="launch-card">
          <div class="launch-icon-box">🔢</div>
          <div class="launch-content">
            <h4 data-i18n="add_page_numbers">Add Page Numbers <span>&rarr;</span></h4>
            <p>Insert custom roman/arabic page numbers with customized fonts and positions.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="html-to-pdf.html" class="launch-card">
          <div class="launch-icon-box">🌐</div>
          <div class="launch-content">
            <h4 data-i18n="html_to_pdf">HTML to PDF <span>&rarr;</span></h4>
            <p>Convert raw HTML markup or live URLs into high-resolution PDF pages.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>

        <a href="repair-pdf.html" class="launch-card">
          <div class="launch-icon-box">🩹</div>
          <div class="launch-content">
            <h4 data-i18n="repair_pdf">Repair PDF <span>&rarr;</span></h4>
            <p>Reconstruct corrupt cross-reference tables and recover unreadable PDF files.</p>
            <span class="launch-action-text">Launch Tool &rarr;</span>
          </div>
        </a>
      </div>

      <!-- Section 3: Architecture & Security Pipeline -->
      <div class="edu-workflow-banner">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-size:22px; font-weight:900; margin:0 0 6px; color:#FFFFFF;">High-Speed Zero-Knowledge Pipeline</h3>
            <p style="font-size:14px; color:#99F6E4; margin:0;">Zero disk persistence. Pure in-memory RAM processing.</p>
          </div>
          <span style="font-size:12px; background:rgba(255,255,255,0.15); color:#FFFFFF; padding:5px 14px; border-radius:9999px; font-weight:800; text-transform:uppercase;">Sub-Second Execution</span>
        </div>

        <div class="workflow-grid">
          <div class="workflow-step">
            <div class="step-badge">1</div>
            <h5>1. Encrypted Ingress</h5>
            <p>Files stream via TLS 1.3 encryption directly into an ephemeral worker pod.</p>
          </div>
          <div class="workflow-step">
            <div class="step-badge">2</div>
            <h5>2. RAM Sandbox Engine</h5>
            <p>Native WebAssembly and C++ PDF parsing executes entirely in memory without writing to disk.</p>
          </div>
          <div class="workflow-step">
            <div class="step-badge">3</div>
            <h5>3. Instant 1-Click Stream</h5>
            <p>Stream clean, high-precision results directly to your browser for download.</p>
          </div>
          <div class="workflow-step">
            <div class="step-badge">4</div>
            <h5>4. Irreversible 15m Purge</h5>
            <p>All temporary memory buffers are completely wiped and shredded after 15 minutes.</p>
          </div>
        </div>
      </div>

      <!-- Section 4: Cross Platform Compatibility Grid -->
      <div class="persona-section-header">
        <div class="persona-badge">Universal Compatibility</div>
        <h2>Engineered for Any Device, Anywhere</h2>
        <p>No downloads, no installations, and no OS restrictions.</p>
      </div>

      <div class="campus-grid">
        <div class="campus-card">
          <h4>💻 Desktop &amp; Workstations</h4>
          <p>Full hardware acceleration in Chrome, Safari, Firefox, and Edge across Windows, macOS, and Linux.</p>
        </div>
        <div class="campus-card">
          <h4>📱 Mobile &amp; Tablets</h4>
          <p>Touch-optimized responsive tools running smoothly on iPadOS, iPhone Safari, and Android Chrome.</p>
        </div>
        <div class="campus-card">
          <h4>☁️ Cloud Ecosystems</h4>
          <p>Seamless file interchange with Google Drive, Microsoft OneDrive, and Dropbox workspaces.</p>
        </div>
        <div class="campus-card">
          <h4>📜 ISO Industry Compliance</h4>
          <p>Full strict alignment with ISO 32000-1 PDF standards and PDF/A archival specifications.</p>
        </div>
      </div>

      <!-- Section 5: Features FAQs -->
      <div class="persona-section-header">
        <div class="persona-badge">Common Questions</div>
        <h2>Frequently Asked Feature Questions</h2>
      </div>

      <div class="edu-faq-grid">
        <div class="edu-faq-box">
          <h4>Q: Are all 30+ tools on MomPDF really 100% free to use?</h4>
          <p>Yes. Every single tool on MomPDF—including OCR, high-density compression, e-signatures, and AI summarization—is completely free with zero subscription paywalls.</p>
        </div>
        <div class="edu-faq-box">
          <h4>Q: How does MomPDF achieve up to 90% compression without losing quality?</h4>
          <p>Our compression engine performs lossless stream deduplication, downsamples redundant DPI raster data, and removes duplicate font subsets.</p>
        </div>
        <div class="edu-faq-box">
          <h4>Q: Can I use MomPDF tools on my mobile phone or iPad?</h4>
          <p>Yes. MomPDF is a progressive, fully responsive web application that runs directly in your mobile browser without installing any app.</p>
        </div>
        <div class="edu-faq-box">
          <h4>Q: Are my documents safe during conversion?</h4>
          <p>Yes. We operate an ephemeral zero-retention infrastructure. Documents are shredded permanently after 15 minutes and are never saved or used for AI training.</p>
        </div>
      </div>

      <!-- Section 6: Leadership Card -->
      <div class="academic-leader-banner">
        <div>
          <strong style="font-size:17px; color:#0F172A;">Md Rahmat Ansari</strong>
          <p style="margin:2px 0 0; font-size:13.5px; color:#475569;">Founder &amp; Principal Systems Architect</p>
          <p style="margin:4px 0 0; font-size:12.5px; color:#E11D48; font-weight:800;">MomPDF Core Systems &amp; Engine Engineering</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-primary" style="font-size:13.5px; padding:10px 20px; background:#E11D48; border-color:#E11D48;">✉️ rahmatansari4171@gmail.com</a>
          <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:13.5px; padding:10px 20px;">LinkedIn Profile &rarr;</a>
        </div>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'features.html'), featuresHtml);

  // =========================================================================
  // 5.6 FAQ & HELP CENTER PAGE (Ultra-Modern Interactive Knowledge Hub)
  // =========================================================================
  const faqHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Frequently Asked Questions (FAQ) — MomPDF Help Center</title>
  <meta name="description" content="Find answers to all your MomPDF questions. Complete documentation on file security, 15-minute auto shredding, OCR accuracy, file size limits, conversion formats, and enterprise SLAs." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    @keyframes pulse-live {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .live-pulse-dot {
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
      display: inline-block;
      animation: pulse-live 2s infinite;
      vertical-align: middle;
      margin-right: 6px;
    }

    /* Clean Hero Trust Bar */
    .hero-trust-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .trust-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }

    /* Live Search Input Box (Clean Light Theme) */
    .faq-search-wrapper {
      max-width: 580px;
      margin: 0 auto 28px;
      position: relative;
    }
    .faq-search-input {
      width: 100%;
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 9999px;
      padding: 14px 22px 14px 48px;
      font-size: 15px;
      color: #0F172A;
      outline: none;
      transition: all 0.25s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    }
    .faq-search-input::placeholder {
      color: #94A3B8;
    }
    .faq-search-input:focus {
      background: #FFFFFF;
      border-color: #E11D48;
      box-shadow: 0 8px 24px rgba(225, 29, 72, 0.15);
    }
    .faq-search-icon {
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      color: #E11D48;
      font-size: 17px;
      pointer-events: none;
    }

    /* Layout */
    .edu-container {
      max-width: 1140px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }

    /* Category Nav Pills */
    .faq-nav-pills {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 48px auto 40px;
      flex-wrap: wrap;
    }
    .faq-pill-btn {
      padding: 9px 20px;
      border-radius: 9999px;
      font-size: 13.5px;
      font-weight: 700;
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      color: #475569;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .faq-pill-btn:hover, .faq-pill-btn.active {
      background: #E11D48;
      border-color: #E11D48;
      color: #FFFFFF;
      box-shadow: 0 4px 14px rgba(225, 29, 72, 0.25);
    }

    /* Persona/Category Header */
    .persona-section-header {
      text-align: center;
      margin: 50px auto 28px;
      max-width: 700px;
    }
    .persona-badge {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #E11D48;
      background: #FFE4E6;
      padding: 4px 14px;
      border-radius: 9999px;
      display: inline-block;
      margin-bottom: 10px;
    }
    .persona-section-header h2 {
      font-size: 28px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 10px;
      letter-spacing: -0.5px;
    }
    .persona-section-header p {
      font-size: 15px;
      color: #64748B;
      margin: 0;
    }

    /* FAQ Grid & Cards */
    .edu-faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .edu-faq-box {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
      transition: all 0.25s ease;
    }
    .edu-faq-box:hover {
      border-color: #FDA4AF;
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -6px rgba(225, 29, 72, 0.1);
    }
    .edu-faq-box h4 {
      font-size: 16.5px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 12px;
      line-height: 1.4;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }
    .faq-q-badge {
      background: #FFE4E6;
      color: #E11D48;
      font-size: 12px;
      font-weight: 900;
      padding: 2px 8px;
      border-radius: 6px;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .edu-faq-box p {
      font-size: 14px;
      color: #475569;
      line-height: 1.7;
      margin: 0;
    }

    /* Launchpad Grid */
    .launchpad-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 22px;
      margin: 36px 0 60px;
    }
    .launch-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 26px;
      display: flex;
      gap: 18px;
      align-items: flex-start;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
      transition: all 0.25s ease;
    }
    .launch-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -6px rgba(225, 29, 72, 0.1);
    }
    .launch-icon-box {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      background: linear-gradient(135deg, #FFE4E6 0%, #FFF1F2 100%);
      color: #E11D48;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .launch-content h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .launch-content p {
      font-size: 13px;
      color: #64748B;
      margin: 0 0 10px;
      line-height: 1.5;
    }
    .launch-action-text {
      font-size: 12px;
      font-weight: 800;
      color: #E11D48;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    /* Leader Card */
    .academic-leader-banner {
      background: linear-gradient(135deg, #F8FAFC 0%, #FFF1F2 100%);
      border: 1.5px solid #FECDD3;
      border-radius: 22px;
      padding: 32px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      box-shadow: 0 10px 30px -10px rgba(225, 29, 72, 0.08);
      margin-top: 50px;
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <!-- FAQ Clean Light Hero -->
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">Knowledge Base &amp; FAQ</div>
      <h1 class="hero-title" style="max-width: 860px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        How Can We Help You Today?
      </h1>
      <p class="hero-subtitle" style="max-width: 720px; margin: 0 auto 24px; font-size: 16.5px;">
        Instant answers covering file privacy, 15-minute auto shredding, OCR accuracy, lossless compression, batch conversion, and enterprise workflows.
      </p>

      <!-- Live Search Box -->
      <div class="faq-search-wrapper">
        <span class="faq-search-icon">🔍</span>
        <input type="text" id="faq-search" class="faq-search-input" placeholder="Search any question (e.g. 'Is my PDF private?', 'OCR accuracy')..." onkeyup="filterFaqItems()" />
      </div>

      <div class="hero-trust-bar">
        <span class="trust-chip">📖 24/7 Instant Help &amp; Guides</span>
        <span class="trust-chip">⚡ 30+ Tool Answers &amp; Specs</span>
        <span class="trust-chip">🔒 15 Min Ephemeral Shred Guarantee</span>
        <span class="trust-chip">🛡️ 100% Free Developer Support</span>
      </div>
    </section>

    <div class="edu-container">
      <!-- Category Nav Pills -->
      <div class="faq-nav-pills">
        <a href="#security-privacy" class="faq-pill-btn active">🔒 Security &amp; Privacy</a>
        <a href="#tools-conversion" class="faq-pill-btn">⚡ Tools &amp; Quality</a>
        <a href="#limits-performance" class="faq-pill-btn">📁 File Limits</a>
        <a href="#education-student" class="faq-pill-btn">🎓 Education</a>
        <a href="#business-enterprise" class="faq-pill-btn">💼 Business</a>
        <a href="#platform-general" class="faq-pill-btn">🌐 General</a>
      </div>

      <!-- Section 1: Security & Privacy -->
      <div id="security-privacy" class="persona-section-header">
        <div class="persona-badge">Security &amp; Encryption</div>
        <h2>1. Privacy, Encryption &amp; File Retention</h2>
        <p>Learn how MomPDF safeguards sensitive documents with zero-disk persistence.</p>
      </div>

      <div class="edu-faq-grid">
        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> How does MomPDF protect my documents from unauthorized access?</h4>
          <p>MomPDF enforces TLS 1.3 encryption for all data in transit and processes documents purely within volatile in-memory (RAM) sandboxes. Files are never stored in permanent database disks or exposed to public directories.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> How long are my uploaded files kept on your servers?</h4>
          <p>Exactly 15 minutes. Our automated shredding protocol irreversibly deletes all temporary memory buffers and cached files 15 minutes after execution, ensuring complete lifecycle confidentiality.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Does MomPDF use my documents to train AI models?</h4>
          <p><strong>Absolutely not.</strong> We maintain a strict zero-scraping policy. No customer document text, imagery, metadata, or formatting is ever utilized to train artificial intelligence or language models.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Is MomPDF compliant with GDPR, CCPA, and privacy laws?</h4>
          <p>Yes. MomPDF is fully compliant with the European Union GDPR (General Data Protection Regulation), California CCPA/CPRA, and international data privacy frameworks.</p>
        </div>
      </div>

      <!-- Section 2: Tools & Conversion Quality -->
      <div id="tools-conversion" class="persona-section-header">
        <div class="persona-badge">Tool Capabilities</div>
        <h2>2. Conversion Fidelity &amp; Processing Quality</h2>
        <p>Detailed technical specifications on our compression, OCR, and editing engines.</p>
      </div>

      <div class="edu-faq-grid">
        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> How does Compress PDF reduce file size up to 90% without quality loss?</h4>
          <p>Our engine removes redundant metadata, deduplicates embedded font subsets, linearizes streams for fast web rendering, and applies smart adaptive DPI re-sampling to raster graphics without blurring text.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> How accurate is the OCR engine on scanned books and receipts?</h4>
          <p>MomPDF utilizes advanced neural optical character recognition (OCR) calibrated across 30+ languages, enabling sharp character detection even on rotated scans, multi-column articles, and low-contrast whiteboards.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Will tables and formatting remain intact in PDF to Word / Excel?</h4>
          <p>Yes. Our proprietary layout reconstruction algorithms preserve table borders, cell alignments, typography hierarchies, and bulleted lists for seamless editing in Microsoft Office and Google Docs.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Are signatures created with the Sign PDF tool legally binding?</h4>
          <p>Yes. MomPDF electronic signatures comply with major e-signature standards (including the U.S. ESIGN Act and European eIDAS requirements) for general business agreements and commercial contracts.</p>
        </div>
      </div>

      <!-- Section 3: File Limits & Performance -->
      <div id="limits-performance" class="persona-section-header">
        <div class="persona-badge">Performance &amp; Scale</div>
        <h2>3. File Limits, Batching &amp; Repairs</h2>
        <p>Understanding throughput capabilities and handling heavy document workflows.</p>
      </div>

      <div class="edu-faq-grid">
        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Is there a file size limit on MomPDF tools?</h4>
          <p>MomPDF provides generous processing capacities capable of handling multi-hundred megabyte textbooks, high-resolution architectural scans, and lengthy multi-chapter dissertations seamlessly.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Can I batch-process multiple files simultaneously?</h4>
          <p>Yes. Tools like Merge PDF, JPG to PDF, and Batch Compress allow you to upload and organize dozens of documents simultaneously in a single click.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> How does the Repair PDF tool recover corrupted files?</h4>
          <p>Our repair engine reconstructs broken cross-reference (XREF) tables, rebuilds damaged page object trees, and isolates readable streams to restore unopenable PDF documents.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> How fast is the processing latency?</h4>
          <p>Most single conversions and splits complete in under 1 second. Heavy OCR extractions and multi-hundred-page compressions typically process in 3 to 8 seconds.</p>
        </div>
      </div>

      <!-- Section 4: Education & Student Workflows -->
      <div id="education-student" class="persona-section-header">
        <div class="persona-badge">Academic Suite</div>
        <h2>4. Students, Researchers &amp; Faculty</h2>
        <p>Specific guidance for university coursework, dissertations, and LMS integration.</p>
      </div>

      <div class="edu-faq-grid">
        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Is MomPDF truly 100% free for students and university researchers?</h4>
          <p>Yes. All 30+ tools—including OCR, textbook compression, PDF to Word, and AI summarization—are completely free with zero subscription paywalls or credit card traps.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Will my unpublished thesis or research paper be protected from leaks?</h4>
          <p>Yes. We operate under strict zero-retention memory sandboxing. Your files are never stored, indexed, or used to train AI models, and are irreversibly shredded after 15 minutes.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Can MomPDF help me bypass Canvas / Blackboard upload size limits?</h4>
          <p>Yes. Using our Compress PDF tool, you can reduce 200MB+ textbook scans and lecture slide decks by up to 90% to easily fit within university submission quotas.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Can I combine separate lab sheets and appendices into one file?</h4>
          <p>Yes. The Merge PDF and Organize PDF tools allow you to combine, delete duplicate pages, and reorder chapters into a cohesive single-file submission.</p>
        </div>
      </div>

      <!-- Section 5: Business & Enterprise -->
      <div id="business-enterprise" class="persona-section-header">
        <div class="persona-badge">Corporate &amp; Enterprise</div>
        <h2>5. Enterprise, Legal &amp; Commercial Workflows</h2>
        <p>Security guarantees for enterprise NDAs, invoicing, and corporate compliance.</p>
      </div>

      <div class="edu-faq-grid">
        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Can MomPDF handle confidential commercial contracts and NDAs?</h4>
          <p>Yes. MomPDF executes all conversions in volatile in-memory sandboxes. All documents are automatically destroyed after 15 minutes with zero residual disk storage or telemetry harvesting.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Does MomPDF support ISO PDF/A conversion for multi-decade archiving?</h4>
          <p>Yes. Our PDF/A conversion engine outputs ISO 19005-1 compliant files (including PDF/A-1b and PDF/A-2b) for multi-decade legal and institutional compliance preservation.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Do you offer custom Enterprise Service Level Agreements (SLAs)?</h4>
          <p>Yes. We offer custom enterprise agreements with 99.9% uptime commitments, priority processing nodes, and direct architectural support.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Are there seat-based license fees for team members?</h4>
          <p>No. MomPDF provides open, web-accessible utility without locking your company into expensive $30/month per-user seat license traps.</p>
        </div>
      </div>

      <!-- Section 6: Platform & Compatibility -->
      <div id="platform-general" class="persona-section-header">
        <div class="persona-badge">Platform &amp; Ecosystem</div>
        <h2>6. Device Compatibility &amp; General Inquiries</h2>
        <p>Browser compatibility, mobile support, and general usage instructions.</p>
      </div>

      <div class="edu-faq-grid">
        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Do I need to install any software or desktop extensions?</h4>
          <p>No. MomPDF is 100% browser-based and runs natively on Google Chrome, Apple Safari, Mozilla Firefox, and Microsoft Edge without software installation.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Does MomPDF work on mobile phones and iPads?</h4>
          <p>Yes. MomPDF is a fully responsive progressive web application optimized for touchscreen gestures on iPhones, iPads, and Android devices.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> How many languages does MomPDF support?</h4>
          <p>MomPDF supports 30 global languages with localized UI strings and country flag selectors for instant switching.</p>
        </div>

        <div class="edu-faq-box">
          <h4><span class="faq-q-badge">Q</span> Who built MomPDF and how can I get direct support?</h4>
          <p>MomPDF was designed and built by <strong>Md Rahmat Ansari</strong> (Founder &amp; Principal Systems Architect). You can reach out directly via <a href="mailto:rahmatansari4171@gmail.com" style="color:#0D9488; font-weight:700;">rahmatansari4171@gmail.com</a>.</p>
        </div>
      </div>

      <!-- Quick Action Tool Launchpad -->
      <div class="persona-section-header">
        <div class="persona-badge">Try It Now</div>
        <h2>Launch a Tool Directly</h2>
        <p>Experience lightning-fast document processing right now.</p>
      </div>

      <div class="launchpad-grid">
        <a href="compress_pdf.html" class="launch-card">
          <div class="launch-icon-box">🗜️</div>
          <div class="launch-content">
            <h4 data-i18n="compress_pdf">Compress PDF <span>&rarr;</span></h4>
            <p>Reduce document file size up to 90% while preserving text and diagram sharpness.</p>
            <span class="launch-action-text">Compress PDF Free &rarr;</span>
          </div>
        </a>

        <a href="ocr-pdf.html" class="launch-card">
          <div class="launch-icon-box">🔍</div>
          <div class="launch-content">
            <h4 data-i18n="ocr_pdf">OCR PDF <span>&rarr;</span></h4>
            <p>Extract searchable, copyable text from scanned documents and images.</p>
            <span class="launch-action-text">Run OCR Engine &rarr;</span>
          </div>
        </a>

        <a href="pdf_to_word.html" class="launch-card">
          <div class="launch-icon-box">📝</div>
          <div class="launch-content">
            <h4 data-i18n="pdf_to_word">PDF to Word <span>&rarr;</span></h4>
            <p>Convert PDFs to fully editable Microsoft Word DOCX documents seamlessly.</p>
            <span class="launch-action-text">Convert to Word &rarr;</span>
          </div>
        </a>

        <a href="sign-pdf.html" class="launch-card">
          <div class="launch-icon-box">✍️</div>
          <div class="launch-content">
            <h4 data-i18n="sign_pdf">Sign PDF <span>&rarr;</span></h4>
            <p>Draw, type, or upload verifiable digital signatures to contracts.</p>
            <span class="launch-action-text">Sign Document &rarr;</span>
          </div>
        </a>

        <a href="protect-pdf.html" class="launch-card">
          <div class="launch-icon-box">🔒</div>
          <div class="launch-content">
            <h4 data-i18n="protect_pdf">Protect PDF <span>&rarr;</span></h4>
            <p>Encrypt PDF files with robust passwords and strict permission control.</p>
            <span class="launch-action-text">Protect File &rarr;</span>
          </div>
        </a>

        <a href="merge_pdf.html" class="launch-card">
          <div class="launch-icon-box">📑</div>
          <div class="launch-content">
            <h4 data-i18n="merge_pdf">Merge PDF <span>&rarr;</span></h4>
            <p>Combine multiple PDFs into one unified file in your exact desired order.</p>
            <span class="launch-action-text">Merge Files &rarr;</span>
          </div>
        </a>
      </div>

      <!-- Leadership Support Banner -->
      <div class="academic-leader-banner">
        <div>
          <strong style="font-size:17px; color:#0F172A;">Md Rahmat Ansari</strong>
          <p style="margin:2px 0 0; font-size:13.5px; color:#475569;">Founder &amp; Principal Systems Architect</p>
          <p style="margin:4px 0 0; font-size:12.5px; color:#E11D48; font-weight:800;">MomPDF Help Center &amp; Developer Support Desk</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-primary" style="font-size:13.5px; padding:10px 20px; background:#E11D48; border-color:#E11D48;">✉️ rahmatansari4171@gmail.com</a>
          <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:13.5px; padding:10px 20px;">LinkedIn Profile &rarr;</a>
        </div>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
  <script>
    function filterFaqItems() {
      const query = (document.getElementById('faq-search').value || '').toLowerCase().trim();
      const faqBoxes = document.querySelectorAll('.edu-faq-box');
      faqBoxes.forEach(box => {
        const text = box.innerText.toLowerCase();
        if (!query || text.includes(query)) {
          box.style.display = 'block';
        } else {
          box.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'faq.html'), faqHtml);

  // =========================================================================
  // 5.7 PRICING & PLANS PAGE (Ultra-Modern Transparent Tier & SLA Showcase)
  // =========================================================================
  const pricingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pricing Plans — MomPDF 100% Free &amp; Enterprise Suite</title>
  <meta name="description" content="Simple, transparent pricing for MomPDF. Access all 30+ PDF tools 100% free with zero paywalls. Dedicated enterprise infrastructure and custom SLAs available." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    @keyframes pulse-live {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .live-pulse-dot {
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
      display: inline-block;
      animation: pulse-live 2s infinite;
      vertical-align: middle;
      margin-right: 6px;
    }

    /* Clean Hero Trust Bar */
    .hero-trust-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .trust-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }
    .hero-cta-group {
      display: flex;
      justify-content: center;
      gap: 14px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }
    .btn-edu-primary {
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #FFFFFF;
      font-weight: 800;
      padding: 13px 28px;
      border-radius: 9999px;
      text-decoration: none;
      font-size: 15px;
      box-shadow: 0 8px 20px -4px rgba(225, 29, 72, 0.5);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-edu-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 26px -4px rgba(225, 29, 72, 0.65);
      color: #FFFFFF;
    }
    .btn-edu-secondary {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      color: #334155;
      font-weight: 700;
      padding: 13px 26px;
      border-radius: 9999px;
      text-decoration: none;
      font-size: 15px;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-edu-secondary:hover {
      background: #F8FAFC;
      border-color: #E11D48;
      color: #E11D48;
      transform: translateY(-2px);
    }

    /* Container */
    .edu-container {
      max-width: 1140px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }

    /* Section Header */
    .persona-section-header {
      text-align: center;
      margin: 60px auto 36px;
      max-width: 720px;
    }
    .persona-badge {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #E11D48;
      background: #FFE4E6;
      padding: 4px 14px;
      border-radius: 9999px;
      display: inline-block;
      margin-bottom: 10px;
    }
    .persona-section-header h2 {
      font-size: 30px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 10px;
      letter-spacing: -0.5px;
    }
    .persona-section-header p {
      font-size: 15px;
      color: #64748B;
      margin: 0;
    }

    /* 3 Pricing Tier Cards Grid */
    .pricing-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      margin-bottom: 70px;
      align-items: stretch;
    }
    .pricing-card {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 24px;
      padding: 36px 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      transition: all 0.25s ease;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
    }
    .pricing-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-4px);
      box-shadow: 0 16px 30px -8px rgba(225, 29, 72, 0.12);
    }
    .pricing-card.featured {
      border: 2px solid #E11D48;
      background: linear-gradient(180deg, #FFF1F2 0%, #FFFFFF 35%);
      box-shadow: 0 12px 30px -8px rgba(225, 29, 72, 0.18);
    }
    .featured-ribbon {
      position: absolute;
      top: -12px;
      right: 24px;
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #FFFFFF;
      font-size: 11.5px;
      font-weight: 800;
      padding: 4px 14px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
    }
    .plan-name {
      font-size: 20px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 6px;
    }
    .plan-desc {
      font-size: 13.5px;
      color: #64748B;
      margin: 0 0 22px;
      line-height: 1.55;
    }
    .plan-price-box {
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #F1F5F9;
    }
    .price-amount {
      font-size: 42px;
      font-weight: 900;
      color: #0F172A;
      letter-spacing: -1px;
      line-height: 1;
    }
    .price-period {
      font-size: 14px;
      color: #64748B;
      font-weight: 600;
      margin-left: 4px;
    }
    .plan-features-list {
      list-style: none;
      padding: 0;
      margin: 0 0 32px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex-grow: 1;
    }
    .plan-feature-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13.5px;
      color: #334155;
      line-height: 1.5;
    }
    .feature-check-icon {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #FFE4E6;
      color: #E11D48;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 900;
      flex-shrink: 0;
      margin-top: 1px;
    }

    /* Comparison Table */
    .comparison-table-wrapper {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 22px;
      overflow-x: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      margin-bottom: 70px;
    }
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .comparison-table th, .comparison-table td {
      padding: 16px 20px;
      border-bottom: 1px solid #F1F5F9;
    }
    .comparison-table th {
      background: #F8FAFC;
      color: #0F172A;
      font-weight: 800;
      font-size: 14px;
    }
    .comparison-table td:first-child {
      font-weight: 700;
      color: #1E293B;
    }
    .comparison-table tr:last-child td {
      border-bottom: none;
    }
    .badge-check {
      color: #E11D48;
      font-weight: 800;
    }

    /* Launchpad Grid */
    .launchpad-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 22px;
      margin: 36px 0 60px;
    }
    .launch-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 26px;
      display: flex;
      gap: 18px;
      align-items: flex-start;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
      transition: all 0.25s ease;
    }
    .launch-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -6px rgba(225, 29, 72, 0.1);
    }
    .launch-icon-box {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      background: linear-gradient(135deg, #FFE4E6 0%, #FFF1F2 100%);
      color: #E11D48;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .launch-content h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .launch-content p {
      font-size: 13px;
      color: #64748B;
      margin: 0 0 10px;
      line-height: 1.5;
    }
    .launch-action-text {
      font-size: 12px;
      font-weight: 800;
      color: #E11D48;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    /* FAQ Section */
    .edu-faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 18px;
      margin: 32px 0 60px;
    }
    .edu-faq-box {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 18px;
      padding: 26px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
      transition: all 0.2s ease;
    }
    .edu-faq-box:hover {
      border-color: #FDA4AF;
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -6px rgba(225, 29, 72, 0.1);
    }
    .edu-faq-box h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 10px;
    }
    .edu-faq-box p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.65;
      margin: 0;
    }

    /* Leader Card */
    .academic-leader-banner {
      background: linear-gradient(135deg, #F8FAFC 0%, #FFF1F2 100%);
      border: 1.5px solid #FECDD3;
      border-radius: 22px;
      padding: 32px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      box-shadow: 0 10px 30px -10px rgba(225, 29, 72, 0.08);
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <!-- Pricing Clean Light Hero -->
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">Transparent Pricing &amp; Value</div>
      <h1 class="hero-title" style="max-width: 860px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        Simple, Transparent Pricing. 100% Free.
      </h1>
      <p class="hero-subtitle" style="max-width: 720px; margin: 0 auto 24px; font-size: 16.5px;">
        No subscription paywalls, no hidden usage fees. Get unlimited access to all 30+ advanced PDF tools with bank-grade security.
      </p>

      <div style="display:flex; justify-content:center; gap:12px; margin-bottom:28px; flex-wrap:wrap;">
        <a href="workspace.html" class="btn btn-primary">🚀 Launch PDF Workspace &rarr;</a>
        <a href="#plans" class="btn btn-secondary">⚡ Explore All Plans</a>
      </div>

      <div class="hero-trust-bar">
        <span class="trust-chip">💰 $0 Forever Free Base Plan</span>
        <span class="trust-chip">⚡ 30+ Unlimited PDF Engines</span>
        <span class="trust-chip">💳 0 Credit Cards Required</span>
        <span class="trust-chip">🛡️ 99.9% Enterprise Uptime SLA</span>
      </div>
    </section>

    <div class="edu-container">
      <!-- Section 1: Three Tier Pricing Cards -->
      <div id="plans" class="persona-section-header">
        <div class="persona-badge">Transparent Tiers</div>
        <h2>Pick the Perfect Tier for Your Workflow</h2>
        <p>Whether you're a student writing research papers or an enterprise automating invoices, MomPDF is built for you.</p>
      </div>

      <div class="pricing-cards-grid">
        <!-- Plan 1: Community Free -->
        <div class="pricing-card">
          <div>
            <h3 class="plan-name">Community Free</h3>
            <p class="plan-desc">For students, creators, and individuals needing fast, reliable PDF conversion.</p>
            <div class="plan-price-box">
              <span class="price-amount">$0</span>
              <span class="price-period">/ forever free</span>
            </div>
            <ul class="plan-features-list">
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>All 30+ PDF Tools</strong> (Merge, Split, Compress, etc.)</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>OCR Text Extraction</strong> for scanned books &amp; notes</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>90% Lossless Compression</strong> vector downsampling</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>Digital Signatures &amp; Stamps</strong> for forms</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>15-Minute Auto Shred</strong> privacy guarantee</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>Zero Account Required</strong> — open &amp; use</span>
              </li>
            </ul>
          </div>
          <a href="workspace.html" class="btn btn-secondary" style="width:100%; text-align:center; padding:12px; font-weight:800;">Launch Workspace &rarr;</a>
        </div>

        <!-- Plan 2: Pro Power User (Featured) -->
        <div class="pricing-card featured">
          <div class="featured-ribbon">🔥 Most Popular</div>
          <div>
            <h3 class="plan-name">Pro Power User</h3>
            <p class="plan-desc">For researchers, developers, accountants, and freelancers needing high throughput.</p>
            <div class="plan-price-box">
              <span class="price-amount">$0</span>
              <span class="price-period">/ zero cost forever</span>
            </div>
            <ul class="plan-features-list">
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>Unlimited Conversions</strong> with zero daily caps</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>Multi-File Batch Processing</strong> in single click</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>PDF to Excel Tabular Extractor</strong> for financial ledgers</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>AI PDF Summarizer</strong> key takeaway generator</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>ISO 19005-1 PDF/A Archival</strong> conversion</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>Sub-Second Execution</strong> in-memory acceleration</span>
              </li>
            </ul>
          </div>
          <a href="workspace.html" class="btn-edu-primary" style="width:100%; justify-content:center; padding:12px; font-weight:800;">Start Converting Free &rarr;</a>
        </div>

        <!-- Plan 3: Enterprise Dedicated -->
        <div class="pricing-card">
          <div>
            <h3 class="plan-name">Enterprise Custom</h3>
            <p class="plan-desc">For legal departments, healthcare systems, and corporate high-volume pipelines.</p>
            <div class="plan-price-box">
              <span class="price-amount">Custom</span>
              <span class="price-period">/ dedicated cluster</span>
            </div>
            <ul class="plan-features-list">
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>Dedicated Private RAM Sandboxes</strong> (zero co-tenancy)</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>99.9% Uptime SLA Agreement</strong> with financial credits</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>Custom PII Redaction Rules</strong> &amp; corporate compliance</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>Direct Systems Architect Desk</strong> via email &amp; phone</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>Custom SSO / SAML 2.0</strong> enterprise integration</span>
              </li>
              <li class="plan-feature-item">
                <span class="feature-check-icon">✓</span>
                <span><strong>Data Residency Guarantees</strong> (US / EU / Asia-Pac)</span>
              </li>
            </ul>
          </div>
          <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-secondary" style="width:100%; text-align:center; padding:12px; font-weight:800; border-color:#0D9488; color:#0D9488;">Contact Architect Desk &rarr;</a>
        </div>
      </div>

      <!-- Section 2: Detailed Comparison Table -->
      <div class="persona-section-header">
        <div class="persona-badge">Feature Matrix</div>
        <h2>Detailed Plan Feature Breakdown</h2>
        <p>Full transparent comparison of capabilities across all tiers.</p>
      </div>

      <div class="comparison-table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Feature Capability</th>
              <th>Community Free</th>
              <th>Pro Power User</th>
              <th>Enterprise Custom</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Base Subscription Cost</td>
              <td><span class="badge-check">$0 / Forever Free</span></td>
              <td><span class="badge-check">$0 / Forever Free</span></td>
              <td>Custom Agreement</td>
            </tr>
            <tr>
              <td>30+ PDF Utilities Access</td>
              <td><span class="badge-check">✓ Full Access</span></td>
              <td><span class="badge-check">✓ Full Access</span></td>
              <td><span class="badge-check">✓ Full Access</span></td>
            </tr>
            <tr>
              <td>OCR Text Extraction</td>
              <td><span class="badge-check">✓ Included</span></td>
              <td><span class="badge-check">✓ Multi-Language</span></td>
              <td><span class="badge-check">✓ Priority Cluster</span></td>
            </tr>
            <tr>
              <td>90% Lossless Compression</td>
              <td><span class="badge-check">✓ Standard</span></td>
              <td><span class="badge-check">✓ Extreme &amp; Lossless</span></td>
              <td><span class="badge-check">✓ Batch Pipeline</span></td>
            </tr>
            <tr>
              <td>In-Memory (RAM) Sandboxing</td>
              <td><span class="badge-check">✓ 100% Volatile</span></td>
              <td><span class="badge-check">✓ 100% Volatile</span></td>
              <td><span class="badge-check">✓ Dedicated Private Pods</span></td>
            </tr>
            <tr>
              <td>15-Minute Ephemeral Shred</td>
              <td><span class="badge-check">✓ Guaranteed</span></td>
              <td><span class="badge-check">✓ Guaranteed</span></td>
              <td><span class="badge-check">✓ Custom Shred Rules</span></td>
            </tr>
            <tr>
              <td>Multi-File Batch Merging</td>
              <td><span class="badge-check">✓ Up to 10 files</span></td>
              <td><span class="badge-check">✓ Unlimited Batch</span></td>
              <td><span class="badge-check">✓ Unlimited Batch</span></td>
            </tr>
            <tr>
              <td>ISO 19005-1 PDF/A Archiving</td>
              <td><span class="badge-check">✓ Included</span></td>
              <td><span class="badge-check">✓ PDF/A-1b &amp; 2b</span></td>
              <td><span class="badge-check">✓ Bulk ISO Validated</span></td>
            </tr>
            <tr>
              <td>Service Level Agreement (SLA)</td>
              <td>Community Best-Effort</td>
              <td>Standard High-Availability</td>
              <td><span class="badge-check">✓ 99.9% Contractual SLA</span></td>
            </tr>
            <tr>
              <td>Zero AI Model Data Scraping</td>
              <td><span class="badge-check">✓ 100% Private</span></td>
              <td><span class="badge-check">✓ 100% Private</span></td>
              <td><span class="badge-check">✓ Contractually Bound</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Section 3: Quick Action Tool Launchpad -->
      <div class="persona-section-header">
        <div class="persona-badge">Launch Tools</div>
        <h2>Start Using Free PDF Tools Right Now</h2>
        <p>No account or registration required. Click any tool to jump straight in.</p>
      </div>

      <div class="launchpad-grid">
        <a href="compress_pdf.html" class="launch-card">
          <div class="launch-icon-box">🗜️</div>
          <div class="launch-content">
            <h4 data-i18n="compress_pdf">Compress PDF <span>&rarr;</span></h4>
            <p>Reduce document file size up to 90% while preserving text and diagram sharpness.</p>
            <span class="launch-action-text">Compress PDF Free &rarr;</span>
          </div>
        </a>

        <a href="ocr-pdf.html" class="launch-card">
          <div class="launch-icon-box">🔍</div>
          <div class="launch-content">
            <h4 data-i18n="ocr_pdf">OCR PDF <span>&rarr;</span></h4>
            <p>Extract searchable, copyable text from scanned documents and images.</p>
            <span class="launch-action-text">Run OCR Engine &rarr;</span>
          </div>
        </a>

        <a href="pdf_to_word.html" class="launch-card">
          <div class="launch-icon-box">📝</div>
          <div class="launch-content">
            <h4 data-i18n="pdf_to_word">PDF to Word <span>&rarr;</span></h4>
            <p>Convert PDFs to fully editable Microsoft Word DOCX documents seamlessly.</p>
            <span class="launch-action-text">Convert to Word &rarr;</span>
          </div>
        </a>

        <a href="sign-pdf.html" class="launch-card">
          <div class="launch-icon-box">✍️</div>
          <div class="launch-content">
            <h4 data-i18n="sign_pdf">Sign PDF <span>&rarr;</span></h4>
            <p>Draw, type, or upload verifiable digital signatures to contracts.</p>
            <span class="launch-action-text">Sign Document &rarr;</span>
          </div>
        </a>

        <a href="protect-pdf.html" class="launch-card">
          <div class="launch-icon-box">🔒</div>
          <div class="launch-content">
            <h4 data-i18n="protect_pdf">Protect PDF <span>&rarr;</span></h4>
            <p>Encrypt PDF files with robust passwords and strict permission control.</p>
            <span class="launch-action-text">Protect File &rarr;</span>
          </div>
        </a>

        <a href="merge_pdf.html" class="launch-card">
          <div class="launch-icon-box">📑</div>
          <div class="launch-content">
            <h4 data-i18n="merge_pdf">Merge PDF <span>&rarr;</span></h4>
            <p>Combine multiple PDFs into one unified file in your exact desired order.</p>
            <span class="launch-action-text">Merge Files &rarr;</span>
          </div>
        </a>
      </div>

      <!-- Section 4: Pricing FAQs -->
      <div class="persona-section-header">
        <div class="persona-badge">Pricing FAQs</div>
        <h2>Frequently Asked Questions on Pricing</h2>
      </div>

      <div class="edu-faq-grid">
        <div class="edu-faq-box">
          <h4>Q: Why is MomPDF 100% free? Are there any hidden catches?</h4>
          <p>There are zero hidden catches. MomPDF is built with high-efficiency client-side WebAssembly rendering and lean cloud container architecture, minimizing server operating costs so we can provide tools for free.</p>
        </div>

        <div class="edu-faq-box">
          <h4>Q: Will MomPDF ever add surprise paywalls or limits?</h4>
          <p>No. Our core promise is open accessibility for students, academics, and creators worldwide. All current 30+ tools will always remain free without paywalls.</p>
        </div>

        <div class="edu-faq-box">
          <h4>Q: Is my document data secure on the free tier?</h4>
          <p>Yes. Every user—free or enterprise—benefits from the exact same in-memory volatile RAM sandboxing, TLS 1.3 encryption, and 15-minute auto-shredding guarantee.</p>
        </div>

        <div class="edu-faq-box">
          <h4>Q: How can our enterprise get a custom dedicated cluster?</h4>
          <p>Contact our Principal Systems Architect directly via <a href="mailto:rahmatansari4171@gmail.com" style="color:#E11D48; font-weight:700;">rahmatansari4171@gmail.com</a> to discuss dedicated worker pods and custom SLA requirements.</p>
        </div>
      </div>

      <!-- Section 5: Leadership Support Card -->
      <div class="academic-leader-banner">
        <div>
          <strong style="font-size:17px; color:#0F172A;">Md Rahmat Ansari</strong>
          <p style="margin:2px 0 0; font-size:13.5px; color:#475569;">Founder &amp; Principal Systems Architect</p>
          <p style="margin:4px 0 0; font-size:12.5px; color:#E11D48; font-weight:800;">MomPDF Architecture, Pricing &amp; Enterprise Solutions</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-primary" style="font-size:13.5px; padding:10px 20px; background:#E11D48; border-color:#E11D48;">✉️ rahmatansari4171@gmail.com</a>
          <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:13.5px; padding:10px 20px;">LinkedIn Profile &rarr;</a>
        </div>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'pricing.html'), pricingHtml);

  // Auth pages (Login & Register)
  const loginHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login — MomPDF</title>
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
</head>
<body style="background: #F8FAFC;">
  ${getHeaderHtml()}
  <main class="main" style="justify-content: center; align-items: center; padding: 40px 24px;">
    <div style="width: 100%; max-width: 440px; background: #fff; border: 1px solid var(--border-color); border-radius: 16px; padding: 40px; box-shadow: var(--shadow-md);">
      <h2 style="font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 8px;" data-i18n="welcome_back">Welcome Back</h2>
      <p style="color: var(--text-muted); font-size: 14px; text-align: center; margin-bottom: 28px;" data-i18n="log_in_to_your_mompdf_account">Log in to your MomPDF account</p>

      <form onsubmit="event.preventDefault(); window.location.href='index.html';">
        <div class="control-group">
          <label class="control-label" data-i18n="email_address">Email Address</label>
          <input type="email" required class="control-input" placeholder="name@company.com" />
        </div>
        <div class="control-group">
          <label class="control-label" data-i18n="password">Password</label>
          <input type="password" required class="control-input" placeholder="••••••••" />
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Log In</button>
      </form>

      <p style="font-size: 14px; color: var(--text-muted); text-align: center; margin-top: 24px;">
        Don't have an account? <a href="register.html" style="color: var(--primary); font-weight: 600;" data-i18n="sign_up_free">Sign up free</a>
      </p>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'login.html'), loginHtml);

  const registerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign Up — MomPDF</title>
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
</head>
<body style="background: #F8FAFC;">
  ${getHeaderHtml()}
  <main class="main" style="justify-content: center; align-items: center; padding: 40px 24px;">
    <div style="width: 100%; max-width: 440px; background: #fff; border: 1px solid var(--border-color); border-radius: 16px; padding: 40px; box-shadow: var(--shadow-md);">
      <h2 style="font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 8px;" data-i18n="create_an_account">Create an Account</h2>
      <p style="color: var(--text-muted); font-size: 14px; text-align: center; margin-bottom: 28px;" data-i18n="start_using_mompdf_with">Start using MomPDF with extended features</p>

      <form onsubmit="event.preventDefault(); window.location.href='index.html';">
        <div class="control-group">
          <label class="control-label" data-i18n="full_name">Full Name</label>
          <input type="text" required class="control-input" placeholder="Jane Doe" />
        </div>
        <div class="control-group">
          <label class="control-label" data-i18n="email_address">Email Address</label>
          <input type="email" required class="control-input" placeholder="name@company.com" />
        </div>
        <div class="control-group">
          <label class="control-label" data-i18n="password">Password</label>
          <input type="password" required class="control-input" placeholder="••••••••" />
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;" data-i18n="create_free_account">Create Free Account</button>
      </form>

      <p style="font-size: 14px; color: var(--text-muted); text-align: center; margin-top: 24px;" data-i18n="already_have_an_account">
        Already have an account? <a href="login.html" style="color: var(--primary); font-weight: 600;" data-i18n="log_in">Log in</a>
      </p>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'register.html'), registerHtml);

  // =========================================================================
  // 6. BUSINESS & ENTERPRISE SUITE PAGE (Matching Education SaaS Hub Design)
  // =========================================================================
  const businessHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MomPDF for Business &amp; Enterprise — Secure Document Workflows</title>
  <meta name="description" content="MomPDF Enterprise Hub. Secure document workflows, batch invoice processing, contract signing, high-density compression, and automated redaction. Bank-grade security with 99.9% uptime SLA." />
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
    @keyframes edu-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    @keyframes pulse-live {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .live-pulse-dot {
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
      display: inline-block;
      animation: pulse-live 2s infinite;
      vertical-align: middle;
      margin-right: 6px;
    }

    /* Clean Hero Trust Bar */
    .hero-trust-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .trust-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }
    .hero-cta-group {
      display: flex;
      justify-content: center;
      gap: 14px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }
    .btn-edu-primary {
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #FFFFFF;
      font-weight: 800;
      padding: 13px 28px;
      border-radius: 9999px;
      text-decoration: none;
      font-size: 15px;
      box-shadow: 0 8px 20px -4px rgba(225, 29, 72, 0.5);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-edu-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 26px -4px rgba(225, 29, 72, 0.65);
      color: #FFFFFF;
    }
    .btn-edu-secondary {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      color: #334155;
      font-weight: 700;
      padding: 13px 26px;
      border-radius: 9999px;
      text-decoration: none;
      font-size: 15px;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-edu-secondary:hover {
      background: #F8FAFC;
      border-color: #E11D48;
      color: #E11D48;
      transform: translateY(-2px);
    }

    /* Container */
    .edu-container {
      max-width: 1140px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }

    /* Persona Selector Cards */
    .persona-section-header {
      text-align: center;
      margin: 60px auto 32px;
      max-width: 700px;
    }
    .persona-badge {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #E11D48;
      background: #FFE4E6;
      padding: 4px 14px;
      border-radius: 9999px;
      display: inline-block;
      margin-bottom: 10px;
    }
    .persona-section-header h2 {
      font-size: 30px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 10px;
      letter-spacing: -0.5px;
    }
    .persona-section-header p {
      font-size: 15px;
      color: #64748B;
      margin: 0;
    }
    .persona-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 60px;
    }
    .persona-card {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .persona-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-4px);
      box-shadow: 0 16px 30px -8px rgba(225, 29, 72, 0.12);
    }
    .persona-icon {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      background: #FFE4E6;
      color: #E11D48;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 18px;
    }
    .persona-card h3 {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px;
    }
    .persona-card p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.6;
      margin: 0 0 16px;
    }
    .persona-tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .persona-tag {
      font-size: 11.5px;
      font-weight: 700;
      padding: 3px 8px;
      background: #F1F5F9;
      color: #475569;
      border-radius: 6px;
    }

    /* Quick Launch Tools Grid */
    .launchpad-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 22px;
      margin: 36px 0 60px;
    }
    .launch-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 26px;
      display: flex;
      gap: 18px;
      align-items: flex-start;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
      transition: all 0.25s ease;
    }
    .launch-card:hover {
      border-color: #FDA4AF;
      transform: translateY(-3px);
      box-shadow: 0 12px 24px -6px rgba(225, 29, 72, 0.1);
    }
    .launch-icon-box {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      background: linear-gradient(135deg, #FFE4E6 0%, #FFF1F2 100%);
      color: #E11D48;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .launch-content h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .launch-content p {
      font-size: 13px;
      color: #64748B;
      margin: 0 0 10px;
      line-height: 1.5;
    }
    .launch-action-text {
      font-size: 12px;
      font-weight: 800;
      color: #E11D48;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    /* Interactive Workflow Banner */
    .edu-workflow-banner {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      border-radius: 24px;
      padding: 40px 36px;
      color: #FFFFFF;
      margin: 60px 0;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.4);
    }
    .workflow-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 28px;
    }
    .workflow-step {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      padding: 20px;
      transition: all 0.2s ease;
    }
    .workflow-step:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #FDA4AF;
      transform: translateY(-2px);
    }
    .step-badge {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 12px;
    }
    .workflow-step h5 {
      font-size: 14.5px;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0 0 6px;
    }
    .workflow-step p {
      font-size: 12px;
      color: #CBD5E1;
      line-height: 1.5;
      margin: 0;
    }

    /* Campus / Corporate Ecosystem Grid */
    .campus-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin: 32px 0 60px;
    }
    .campus-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
    }
    .campus-card h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .campus-card p {
      font-size: 13px;
      color: #64748B;
      line-height: 1.5;
      margin: 0;
    }

    /* FAQ Section */
    .edu-faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 18px;
      margin: 32px 0 60px;
    }
    .edu-faq-box {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 18px;
      padding: 26px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.02);
    }
    .edu-faq-box h4 {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 10px;
    }
    .edu-faq-box p {
      font-size: 13.5px;
      color: #64748B;
      line-height: 1.65;
      margin: 0;
    }

    /* Leader Card */
    .academic-leader-banner {
      background: linear-gradient(135deg, #F8FAFC 0%, #FFF1F2 100%);
      border: 1.5px solid #FECDD3;
      border-radius: 22px;
      padding: 32px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      box-shadow: 0 10px 30px -10px rgba(225, 29, 72, 0.08);
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <!-- Business Clean Light Hero -->
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">Enterprise &amp; Business Solutions</div>
      <h1 class="hero-title" style="max-width: 920px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        The All-In-One PDF Suite for Modern Enterprises
      </h1>
      <p class="hero-subtitle" style="max-width: 800px; margin: 0 auto 24px; font-size: 16.5px;">
        Streamline multi-team PDF workflows, batch invoice processing, contract signing, and automated redaction. Bank-grade security with 99.9% uptime SLA.
      </p>

      <div style="display:flex; justify-content:center; gap:12px; margin-bottom:28px; flex-wrap:wrap;">
        <a href="workspace.html" class="btn btn-primary">💼 Launch Enterprise Workspace &rarr;</a>
        <a href="#business-tools" class="btn btn-secondary">⚡ Explore Business Tools</a>
      </div>

      <div class="hero-trust-bar">
        <span class="trust-chip">⚡ 99.9% Target Uptime SLA</span>
        <span class="trust-chip">🔧 30+ Batch &amp; Invoicing Engine</span>
        <span class="trust-chip">🔒 15 Min Corporate Confidentiality Shred</span>
        <span class="trust-chip">🛡️ 100% GDPR &amp; SOC 2 Aligned</span>
      </div>
    </section>

    <div class="edu-container">
      <!-- Section 1: Persona Switcher Grid -->
      <div class="persona-section-header">
        <div class="persona-badge">Tailored For Enterprise</div>
        <h2>Engineered for High-Impact Corporate Teams</h2>
        <p>From legal contracts to financial audits, MomPDF eliminates bottlenecks across every core business department.</p>
      </div>

      <div class="persona-grid">
        <div class="persona-card">
          <div class="persona-icon">⚖️</div>
          <h3>Legal &amp; Compliance</h3>
          <p>Irreversibly black out confidential client data, merge multi-party NDAs, and apply cryptographic timestamps to contracts.</p>
          <div class="persona-tag-list">
            <span class="persona-tag">PII Redaction</span>
            <span class="persona-tag" data-i18n="sign_pdf">Sign PDF</span>
            <span class="persona-tag">PDF/A Archive</span>
          </div>
        </div>

        <div class="persona-card">
          <div class="persona-icon">💼</div>
          <h3>Finance &amp; Accounting</h3>
          <p>Extract tabular invoice data directly to Excel, merge monthly financial statements, and compress tax archives for filing.</p>
          <div class="persona-tag-list">
            <span class="persona-tag" data-i18n="pdf_to_excel">PDF to Excel</span>
            <span class="persona-tag">Batch Merge</span>
            <span class="persona-tag">Compress Invoices</span>
          </div>
        </div>

        <div class="persona-card">
          <div class="persona-icon">👥</div>
          <h3>People Operations &amp; HR</h3>
          <p>Digitally sign new employee offer letters, split multi-page benefits guides, and assemble new hire onboarding packets.</p>
          <div class="persona-tag-list">
            <span class="persona-tag">Split Packets</span>
            <span class="persona-tag">Form Signer</span>
            <span class="persona-tag">Add Numbers</span>
          </div>
        </div>

        <div class="persona-card">
          <div class="persona-icon">⚡</div>
          <h3>Engineering &amp; IT Ops</h3>
          <p>Preserve system architecture blueprints, OCR legacy server logs, and automate high-throughput document conversion.</p>
          <div class="persona-tag-list">
            <span class="persona-tag">OCR Extraction</span>
            <span class="persona-tag">ISO PDF/A</span>
            <span class="persona-tag">RAM Sandbox</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Quick Launch Tools Grid -->
      <div id="business-tools" class="persona-section-header">
        <div class="persona-badge">Enterprise Launchpad</div>
        <h2>Essential Business Tools — 1-Click Launch</h2>
        <p>Direct access to the most frequently used utilities by corporate teams and executives worldwide.</p>
      </div>

      <div class="launchpad-grid">
        <a href="redact-pdf.html" class="launch-card">
          <div class="launch-icon-box">🛡️</div>
          <div class="launch-content">
            <h4>Redact Sensitive PII <span>&rarr;</span></h4>
            <p>Permanently black out SSNs, bank details, and trade secrets before external client sharing.</p>
            <span class="launch-action-text">Launch Redactor &rarr;</span>
          </div>
        </a>

        <a href="pdf_to_excel.html" class="launch-card">
          <div class="launch-icon-box">📊</div>
          <div class="launch-content">
            <h4>Financial PDF to Excel <span>&rarr;</span></h4>
            <p>Extract structured tables and audit ledgers directly into clean XLSX spreadsheets.</p>
            <span class="launch-action-text">Convert to Excel &rarr;</span>
          </div>
        </a>

        <a href="sign-pdf.html" class="launch-card">
          <div class="launch-icon-box">✍️</div>
          <div class="launch-content">
            <h4>Contract &amp; NDA Signer <span>&rarr;</span></h4>
            <p>Draw, type, or upload verifiable digital signatures for commercial agreements.</p>
            <span class="launch-action-text">Sign Documents &rarr;</span>
          </div>
        </a>

        <a href="compress_pdf.html" class="launch-card">
          <div class="launch-icon-box">🗜️</div>
          <div class="launch-content">
            <h4>High-Density Compressor <span>&rarr;</span></h4>
            <p>Compress large quarterly decks and legal binders up to 90% for email delivery.</p>
            <span class="launch-action-text">Compress PDF &rarr;</span>
          </div>
        </a>

        <a href="convert-pdf-to-pdfa.html" class="launch-card">
          <div class="launch-icon-box">🏛️</div>
          <div class="launch-content">
            <h4>ISO PDF/A Archival <span>&rarr;</span></h4>
            <p>Convert contracts to ISO-standard PDF/A for multi-decade corporate preservation.</p>
            <span class="launch-action-text">Convert to PDF/A &rarr;</span>
          </div>
        </a>

        <a href="protect-pdf.html" class="launch-card">
          <div class="launch-icon-box">🔒</div>
          <div class="launch-content">
            <h4>Password &amp; Permission Lock <span>&rarr;</span></h4>
            <p>Add military-grade AES encryption to board decks and confidential payroll summaries.</p>
            <span class="launch-action-text">Protect File &rarr;</span>
          </div>
        </a>
      </div>

      <!-- Section 3: Enterprise Workflow Data Box -->
      <div class="edu-workflow-banner">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-size:22px; font-weight:900; margin:0 0 6px; color:#FFFFFF;">How MomPDF Accelerates Enterprise Document Workflows</h3>
            <p style="font-size:14px; color:#93C5FD; margin:0;">Zero software installation required. Seamless in-browser execution with ephemeral RAM isolation.</p>
          </div>
          <span style="font-size:12px; background:rgba(255,255,255,0.15); color:#FFFFFF; padding:5px 14px; border-radius:9999px; font-weight:800; text-transform:uppercase;">100% In-Memory</span>
        </div>

        <div class="workflow-grid">
          <div class="workflow-step">
            <div class="step-badge">1</div>
            <h5>1. Document Ingress</h5>
            <p>Upload contracts, audits, or invoice ledgers over encrypted TLS 1.3 with forward secrecy.</p>
          </div>
          <div class="workflow-step">
            <div class="step-badge">2</div>
            <h5>2. RAM Sandbox Processing</h5>
            <p>High-speed tabular parsing, lossless compression, or redaction runs purely in memory.</p>
          </div>
          <div class="workflow-step">
            <div class="step-badge">3</div>
            <h5>3. Single-Click Download</h5>
            <p>Instantly download clean, audit-ready PDF, Excel, or Word files to your workstation.</p>
          </div>
          <div class="workflow-step">
            <div class="step-badge">4</div>
            <h5>4. Automated 15m Shred</h5>
            <p>All temporary files are permanently wiped after 15 minutes, guaranteeing total corporate secrecy.</p>
          </div>
        </div>
      </div>

      <!-- Section 4: Enterprise Ecosystem Compatibility -->
      <div class="persona-section-header">
        <div class="persona-badge">Enterprise Compatibility</div>
        <h2>100% Compatible with Corporate Platforms &amp; ERPs</h2>
        <p>MomPDF produces clean, standard ISO-compliant PDFs ready for immediate enterprise integration.</p>
      </div>

      <div class="campus-grid">
        <div class="campus-card">
          <h4>📊 SAP, Oracle &amp; QuickBooks</h4>
          <p>Batch convert raw invoice PDFs into clean Excel spreadsheets ready for financial reconciliations.</p>
        </div>
        <div class="campus-card">
          <h4>📂 Salesforce &amp; HubSpot</h4>
          <p>Sign client contracts and NDAs with tamper-evident visual placement for rapid deal execution.</p>
        </div>
        <div class="campus-card">
          <h4>🛡️ Microsoft 365 &amp; Google Workspace</h4>
          <p>Compress heavy presentation decks to easily stay under corporate email attachment limits.</p>
        </div>
        <div class="campus-card">
          <h4>🏛️ Long-Term Legal Archiving</h4>
          <p>Export corporate contracts to ISO 19005-1 PDF/A for multi-decade compliance retention.</p>
        </div>
      </div>

      <!-- Section 5: Enterprise FAQs -->
      <div class="persona-section-header">
        <div class="persona-badge">Common Questions</div>
        <h2>Frequently Asked Enterprise Questions</h2>
      </div>

      <div class="edu-faq-grid">
        <div class="edu-faq-box">
          <h4>Q: Can MomPDF handle strictly confidential corporate NDAs?</h4>
          <p>Yes. MomPDF executes all conversions in volatile in-memory sandboxes. All documents are automatically destroyed after 15 minutes with zero residual disk storage or AI training.</p>
        </div>
        <div class="edu-faq-box">
          <h4>Q: Do you offer custom Enterprise Service Level Agreements (SLAs)?</h4>
          <p>Yes. We offer custom enterprise agreements with 99.9% uptime commitments, priority processing nodes, and direct architectural support.</p>
        </div>
        <div class="edu-faq-box">
          <h4>Q: Can our team process large multi-gigabyte document batches?</h4>
          <p>Yes. Our scalable cloud cluster dynamically provisions compute workers to handle large batch operations with zero throttling.</p>
        </div>
        <div class="edu-faq-box">
          <h4>Q: Does MomPDF require any desktop software installation?</h4>
          <p>No. MomPDF requires zero client software installation and runs seamlessly through any modern enterprise web browser with strict TLS 1.3 encryption.</p>
        </div>
      </div>

      <!-- Section 6: Leadership Card -->
      <div class="academic-leader-banner">
        <div>
          <strong style="font-size:17px; color:#0F172A;">Md Rahmat Ansari</strong>
          <p style="margin:2px 0 0; font-size:13.5px; color:#475569;">Founder &amp; Principal Systems Architect</p>
          <p style="margin:4px 0 0; font-size:12.5px; color:#E11D48; font-weight:800;">Enterprise Solutions &amp; SLA Desk</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a href="mailto:rahmatansari4171@gmail.com" class="btn btn-primary" style="font-size:13.5px; padding:10px 20px; background:#E11D48; border-color:#E11D48;">✉️ rahmatansari4171@gmail.com</a>
          <a href="https://www.linkedin.com/in/mdrahmat/" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:13.5px; padding:10px 20px;">LinkedIn Profile &rarr;</a>
        </div>
      </div>
    </div>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'business.html'), businessHtml);

  // Desktop & Mobile
  ['desktop', 'mobile'].forEach((pageName) => {
    const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageName.charAt(0).toUpperCase() + pageName.slice(1)} — MomPDF</title>
${getFaviconTagsHtml()}
  <link rel="stylesheet" href="css/mompdf.ui.css" />
</head>
<body>
  ${getHeaderHtml()}
  <main class="main">
    <section class="hero">
      <div class="hero-badge">MomPDF ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}</div>
      <h1 class="hero-title">Experience MomPDF everywhere</h1>
      <p class="hero-subtitle">High performance, offline capabilities, and enterprise-grade PDF tools ready for your workflow.</p>
      <div style="margin-top: 24px;">
        <a href="index.html" class="btn btn-primary btn-lg">Explore Web Tools</a>
      </div>
    </section>
  </main>
  ${getFooterHtml()}
  <script src="js/mompdf.i18n.js"></script>
  <script src="js/mompdf.client.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(PUBLIC_DIR, `${pageName}.html`), pageHtml);
  });
}

// Helper: Sync workspace.html footer
function syncWorkspaceFooter() {
  const workspacePath = path.join(PUBLIC_DIR, 'workspace.html');
  if (fs.existsSync(workspacePath)) {
    let workspaceHtml = fs.readFileSync(workspacePath, 'utf-8');
    const footerStartIndex = workspaceHtml.indexOf('<footer class="footer">');
    if (footerStartIndex !== -1) {
      workspaceHtml = workspaceHtml.substring(0, footerStartIndex) +
        getFooterHtml() + '\n\n  <script src="js/mompdf.i18n.js"></script>\n  <script src="js/mompdf.workspace.js"></script>\n</body>\n</html>';
      fs.writeFileSync(workspacePath, workspaceHtml, 'utf-8');
      console.log('Synchronized workspace.html footer (clean single footer with i18n)');
    }
  }
}

// Run generators
generateHomepage();
generateToolPages();
generateMarketingPages();
syncWorkspaceFooter();
console.log('All MomPDF pages generated successfully!');
