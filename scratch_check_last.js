window.mompdfTool = "crop_pdf";</script>
</head>

<body>

  <header class="header">
    <nav>
      <a href="index.html" class="brand" title="MomPDF - Everything PDF in One Place">
        <img src="img/mompdf.svg" alt="MomPDF">
      </a>

      <ul class="nav-links">
        <li class="nav-item"><a href="merge_pdf.html" data-i18n="merge_pdf">Merge PDF</a></li>
        <li class="nav-item"><a href="split_pdf.html" data-i18n="split_pdf">Split PDF</a></li>
        <li class="nav-item"><a href="compress_pdf.html" data-i18n="compress_pdf">Compress PDF</a></li>

        <!-- Convert PDF Dropdown -->
        <li class="nav-item">
          <button type="button" class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false"
            onclick="this.parentElement.classList.toggle('is-open'); event.stopPropagation();" data-i18n="convert_pdf">
            Convert PDF
            <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="dropdown-menu convert-dropdown">
            <!-- Left Column: Convert to PDF -->
            <div>
              <div class="menu-column-header" data-i18n="convert_to_pdf">
                <span class="column-dot" style="background:#E11D48;"></span>
                Convert to PDF
              </div>
              <div class="menu-items-list">
                <a href="jpg_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEE2E2; color:#E11D48;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="jpg_to_pdf">JPG to PDF</span>
                    <span class="menu-item-desc" data-i18n="convert_jpg_png_webp_images">Convert JPG, PNG, WebP
                      images</span>
                  </div>
                </a>
                <a href="word_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#EFF6FF; color:#2563EB;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="word_to_pdf">Word to PDF</span>
                    <span class="menu-item-desc" data-i18n="docx_and_doc_documents">DOCX and DOC documents</span>
                  </div>
                </a>
                <a href="powerpoint_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FFF7ED; color:#EA580C;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="powerpoint_to_pdf">PowerPoint to PDF</span>
                    <span class="menu-item-desc" data-i18n="pptx_presentation_slides">PPTX presentation slides</span>
                  </div>
                </a>
                <a href="excel_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F0FDF4; color:#16A34A;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="3" y1="15" x2="21" y2="15"></line>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                      <line x1="15" y1="3" x2="15" y2="21"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="excel_to_pdf">Excel to PDF</span>
                    <span class="menu-item-desc" data-i18n="xlsx_and_xls_spreadsheets">XLSX and XLS spreadsheets</span>
                  </div>
                </a>
                <a href="html-to-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FAF5FF; color:#9333EA;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
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
              <div class="menu-column-header" data-i18n="convert_from_pdf">
                <span class="column-dot" style="background:#2563EB;"></span>
                Convert from PDF
              </div>
              <div class="menu-items-list">
                <a href="pdf_to_jpg.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF2F2; color:#E11D48;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="pdf_to_jpg">PDF to JPG</span>
                    <span class="menu-item-desc" data-i18n="extract_highresolution_images">Extract high-resolution
                      images</span>
                  </div>
                </a>
                <a href="pdf_to_word.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#EFF6FF; color:#2563EB;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="pdf_to_word">PDF to Word</span>
                    <span class="menu-item-desc" data-i18n="editable_word_docx_format">Editable Word DOCX format</span>
                  </div>
                </a>
                <a href="pdf_to_powerpoint.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FFF7ED; color:#EA580C;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="pdf_to_powerpoint">PDF to PowerPoint</span>
                    <span class="menu-item-desc" data-i18n="editable_presentation_slides">Editable presentation
                      slides</span>
                  </div>
                </a>
                <a href="pdf_to_excel.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F0FDF4; color:#16A34A;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text">
                    <span class="menu-item-title" data-i18n="pdf_to_excel">PDF to Excel</span>
                    <span class="menu-item-desc" data-i18n="extract_tabular_data_into_xlsx">Extract tabular data into
                      XLSX</span>
                  </div>
                </a>
                <a href="convert-pdf-to-pdfa.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F1F5F9; color:#475569;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
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
          <button type="button" class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false"
            onclick="this.parentElement.classList.toggle('is-open'); event.stopPropagation();"
            data-i18n="all_pdf_tools">
            All PDF Tools
            <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="dropdown-menu mega-menu-dropdown">
            <!-- Column 1: Organize -->
            <div>
              <div class="menu-column-header" data-i18n="organize_pdf">
                <span class="column-dot" style="background:#E11D48;"></span>
                Organize PDF
              </div>
              <div class="menu-items-list">
                <a href="merge_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEE2E2; color:#E11D48;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="merge_pdf">Merge PDF</span></div>
                </a>
                <a href="split_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF3C7; color:#D97706;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="6" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
                      <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
                      <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="split_pdf">Split PDF</span></div>
                </a>
                <a href="remove-pages.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEE2E2; color:#DC2626;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="remove_pages">Remove Pages</span>
                  </div>
                </a>
                <a href="organize-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#E0E7FF; color:#4338CA;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="organize_pdf">Organize PDF</span>
                  </div>
                </a>
                <a href="scan-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#CCFBF1; color:#0D9488;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z">
                      </path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="scan_to_pdf">Scan to PDF</span>
                  </div>
                </a>
              </div>
            </div>

            <!-- Column 2: Optimize & Edit -->
            <div>
              <div class="menu-column-header">
                <span class="column-dot" style="background:#16A34A;"></span>
                Optimize &amp; Edit
              </div>
              <div class="menu-items-list">
                <a href="compress_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#DCFCE7; color:#16A34A;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9M8 17l4 4 4-4"></path>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="compress_pdf">Compress PDF</span>
                  </div>
                </a>
                <a href="repair-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF3C7; color:#B45309;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path
                        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z">
                      </path>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="repair_pdf">Repair PDF</span>
                  </div>
                </a>
                <a href="ocr-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F3E8FF; color:#7E22CE;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="ocr_pdf">OCR PDF</span></div>
                </a>
                <a href="rotate_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#E0E7FF; color:#4F46E5;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="rotate_pdf">Rotate PDF</span>
                  </div>
                </a>
                <a href="add_pdf_page_number.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F1F5F9; color:#334155;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="4" y1="9" x2="20" y2="9"></line>
                      <line x1="4" y1="15" x2="20" y2="15"></line>
                      <line x1="10" y1="3" x2="8" y2="21"></line>
                      <line x1="16" y1="3" x2="14" y2="21"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="page_numbers">Page Numbers</span>
                  </div>
                </a>
                <a href="pdf_add_watermark.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FFE4E6; color:#E11D48;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="add_watermark">Add
                      Watermark</span></div>
                </a>
                <a href="crop-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF9C3; color:#A16207;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 2v14a2 2 0 0 0 2 2h14"></path>
                      <path d="M18 22V8a2 2 0 0 0-2-2H2"></path>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="crop_pdf">Crop PDF</span></div>
                </a>
              </div>
            </div>

            <!-- Column 3: Convert -->
            <div>
              <div class="menu-column-header" data-i18n="convert_pdf">
                <span class="column-dot" style="background:#2563EB;"></span>
                Convert PDF
              </div>
              <div class="menu-items-list">
                <a href="pdf_to_word.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#EFF6FF; color:#2563EB;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="pdf_to_word">PDF to Word</span>
                  </div>
                </a>
                <a href="word_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#EFF6FF; color:#1D4ED8;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="word_to_pdf">Word to PDF</span>
                  </div>
                </a>
                <a href="pdf_to_excel.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F0FDF4; color:#16A34A;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="pdf_to_excel">PDF to Excel</span>
                  </div>
                </a>
                <a href="excel_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F0FDF4; color:#15803D;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <line x1="3" y1="15" x2="21" y2="15"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="excel_to_pdf">Excel to PDF</span>
                  </div>
                </a>
                <a href="pdf_to_powerpoint.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FFF7ED; color:#EA580C;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="pdf_to_ppt">PDF to PPT</span>
                  </div>
                </a>
                <a href="pdf_to_jpg.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF2F2; color:#E11D48;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="pdf_to_jpg">PDF to JPG</span>
                  </div>
                </a>
                <a href="jpg_to_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEF2F2; color:#BE123C;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="jpg_to_pdf">JPG to PDF</span>
                  </div>
                </a>
              </div>
            </div>

            <!-- Column 4: Security & AI -->
            <div>
              <div class="menu-column-header" data-i18n="security_ai">
                <span class="column-dot" style="background:#9333EA;"></span>
                Security &amp; AI
              </div>
              <div class="menu-items-list">
                <a href="protect-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FEE2E2; color:#DC2626;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="protect_pdf">Protect PDF</span>
                  </div>
                </a>
                <a href="unlock_pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#DCFCE7; color:#16A34A;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="unlock_pdf">Unlock PDF</span>
                  </div>
                </a>
                <a href="sign-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#E0E7FF; color:#4338CA;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="sign_pdf">Sign PDF</span></div>
                </a>
                <a href="redact-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#F1F5F9; color:#0F172A;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor"></rect>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="redact_pdf">Redact PDF</span>
                  </div>
                </a>
                <a href="compare-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#EFF6FF; color:#2563EB;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="compare_pdf">Compare PDF</span>
                  </div>
                </a>
                <a href="pdf-summarize.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#FAF5FF; color:#9333EA;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                      </polygon>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="ai_summarizer">AI
                      Summarizer</span></div>
                </a>
                <a href="translate-pdf.html" class="menu-item-link">
                  <div class="menu-item-icon" style="background:#ECFEFF; color:#0891B2;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path
                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                      </path>
                    </svg>
                  </div>
                  <div class="menu-item-text"><span class="menu-item-title" data-i18n="translate_pdf">Translate
                      PDF</span></div>
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


  <!-- Dedicated PDF Tool Workspace Application -->
  <main id="workspaceApp"></main>


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
            <li><a href="terms.html" data-i18n="terms_conditions">Terms &amp; conditions</a></li>
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
              <path d="M3.6 2.4l12.7 12.7-3.9 3.9L3.6 2.4z" fill="#00E676"></path>
              <path d="M3.6 21.6l12.7-12.7-3.9-3.9L3.6 21.6z" fill="#FF3D00"></path>
              <path d="M3.6 2.4v19.2l12.7-9.6L3.6 2.4z" fill="#00B0FF"></path>
              <path d="M19.4 10.1l-3.1-1.8-3.9 3.7 3.9 3.7 3.1-1.8c.9-.5.9-1.4 0-1.9z" fill="#FFD600"></path>
            </svg>
            <div class="store-badge-text">
              <span class="store-badge-sub">GET IT ON</span>
              <span class="store-badge-name">Google Play</span>
            </div>
          </a>

          <!-- App Store -->
          <a href="#" class="store-badge" title="Download on the App Store">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.13.64-2.79 1.41-.58.67-.99 1.74-.95 2.78 1.07.08 2.11-.57 2.73-1.32z">
              </path>
            </svg>
            <div class="store-badge-text">
              <span class="store-badge-sub">Download on the</span>
              <span class="store-badge-name">App Store</span>
            </div>
          </a>

          <!-- Mac App Store -->
          <a href="#" class="store-badge" title="Download on the Mac App Store">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.13.64-2.79 1.41-.58.67-.99 1.74-.95 2.78 1.07.08 2.11-.57 2.73-1.32z">
              </path>
            </svg>
            <div class="store-badge-text">
              <span class="store-badge-sub">Download on the</span>
              <span class="store-badge-name">Mac App Store</span>
            </div>
          </a>

          <!-- Microsoft Store -->
          <a href="#" class="store-badge" title="Get it from Microsoft Store">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="3" width="9" height="9" fill="#F25022"></rect>
              <rect x="13" y="3" width="9" height="9" fill="#7FBA00"></rect>
              <rect x="2" y="13" width="9" height="9" fill="#00A4EF"></rect>
              <rect x="13" y="13" width="9" height="9" fill="#FFB900"></rect>
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
            <button type="button" class="footer-lang-pill" id="footerLangBtn"
              onclick="window.mompdfOpenLangModal(); event.stopPropagation();" aria-expanded="false"
              aria-haspopup="dialog">
              <span id="currentLangFlagSvg" class="pill-flag-svg"><svg class="flag-icon" viewBox="0 0 640 480">
                  <g fill-rule="evenodd">
                    <path fill="#bd3d44" d="M0 0h640v480H0z"></path>
                    <path stroke="#fff" stroke-width="37"
                      d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640"></path>
                    <path fill="#192f5d" d="M0 0h256v258.5H0z"></path>
                    <g fill="#fff">
                      <circle cx="25" cy="20" r="7"></circle>
                      <circle cx="76" cy="20" r="7"></circle>
                      <circle cx="128" cy="20" r="7"></circle>
                      <circle cx="180" cy="20" r="7"></circle>
                      <circle cx="230" cy="20" r="7"></circle>
                      <circle cx="51" cy="45" r="7"></circle>
                      <circle cx="102" cy="45" r="7"></circle>
                      <circle cx="154" cy="45" r="7"></circle>
                      <circle cx="205" cy="45" r="7"></circle>
                      <circle cx="25" cy="70" r="7"></circle>
                      <circle cx="76" cy="70" r="7"></circle>
                      <circle cx="128" cy="70" r="7"></circle>
                      <circle cx="180" cy="70" r="7"></circle>
                      <circle cx="230" cy="70" r="7"></circle>
                      <circle cx="51" cy="95" r="7"></circle>
                      <circle cx="102" cy="95" r="7"></circle>
                      <circle cx="154" cy="95" r="7"></circle>
                      <circle cx="205" cy="95" r="7"></circle>
                      <circle cx="25" cy="120" r="7"></circle>
                      <circle cx="76" cy="120" r="7"></circle>
                      <circle cx="128" cy="120" r="7"></circle>
                      <circle cx="180" cy="120" r="7"></circle>
                      <circle cx="230" cy="120" r="7"></circle>
                      <circle cx="51" cy="145" r="7"></circle>
                      <circle cx="102" cy="145" r="7"></circle>
                      <circle cx="154" cy="145" r="7"></circle>
                      <circle cx="205" cy="145" r="7"></circle>
                      <circle cx="25" cy="170" r="7"></circle>
                      <circle cx="76" cy="170" r="7"></circle>
                      <circle cx="128" cy="170" r="7"></circle>
                      <circle cx="180" cy="170" r="7"></circle>
                      <circle cx="230" cy="170" r="7"></circle>
                      <circle cx="51" cy="195" r="7"></circle>
                      <circle cx="102" cy="195" r="7"></circle>
                      <circle cx="154" cy="195" r="7"></circle>
                      <circle cx="205" cy="195" r="7"></circle>
                      <circle cx="25" cy="220" r="7"></circle>
                      <circle cx="76" cy="220" r="7"></circle>
                      <circle cx="128" cy="220" r="7"></circle>
                      <circle cx="180" cy="220" r="7"></circle>
                      <circle cx="230" cy="220" r="7"></circle>
                    </g>
                  </g>
                </svg></span>
              <span id="currentLangLabel">English</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>

          <!-- Right Cluster: Socials + Copyright (No GitHub) -->
          <div class="footer-right-cluster">
            <div class="footer-social-icons">
              <!-- X / Twitter -->
              <a href="https://twitter.com" target="_blank" rel="noopener" class="social-icon-link" title="X / Twitter"
                aria-label="X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z">
                  </path>
                </svg>
              </a>
              <!-- Facebook -->
              <a href="https://facebook.com" target="_blank" rel="noopener" class="social-icon-link" title="Facebook"
                aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z">
                  </path>
                </svg>
              </a>
              <!-- LinkedIn -->
              <a href="https://linkedin.com" target="_blank" rel="noopener" class="social-icon-link" title="LinkedIn"
                aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M7.86 18.5V10.13H5.07v8.37z">
                  </path>
                </svg>
              </a>
              <!-- Instagram -->
              <a href="https://instagram.com" target="_blank" rel="noopener" class="social-icon-link" title="Instagram"
                aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z">
                  </path>
                </svg>
              </a>
              <!-- TikTok -->
              <a href="https://tiktok.com" target="_blank" rel="noopener" class="social-icon-link" title="TikTok"
                aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z">
                  </path>
                </svg>
              </a>
              <!-- Reddit -->
              <a href="https://reddit.com" target="_blank" rel="noopener" class="social-icon-link" title="Reddit"
                aria-label="Reddit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z">
                  </path>
                </svg>
              </a>
            </div>
            <div class="footer-copyright-text" data-i18n="mompdf_2026_everything_pdf">
              © MomPDF 2026 ® - Everything PDF in One Place
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <!-- Luxury SaaS Language Selection Modal -->
  <div class="footer-lang-backdrop" id="footerLangModalBackdrop"
    onclick="if(event.target === this) window.mompdfCloseLangModal();" role="dialog" aria-modal="true"
    aria-labelledby="langModalTitle">
    <div class="footer-lang-modal" onclick="event.stopPropagation();">
      <div class="lang-modal-header">
        <div class="lang-header-top">
          <div class="lang-header-title-group">
            <div class="lang-header-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <div class="lang-header-text">
              <h3 id="langModalTitle" data-i18n="select_your_language">Select your language</h3>
              <p data-i18n="choose_your_preferred_interface">Choose your preferred interface language across MomPDF
                tools</p>
            </div>
          </div>
          <button type="button" class="lang-modal-close" onclick="window.mompdfCloseLangModal();"
            aria-label="Close dialog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="lang-search-wrapper">
          <svg class="lang-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="langSearchInput" class="lang-search-input"
            placeholder="Search language or country (e.g. Hindi, French, Español, 日本語)..."
            data-i18n-placeholder="search_language_or_country"
            oninput="window.mompdfFilterLanguages &amp;&amp; window.mompdfFilterLanguages(this.value);"
            autocomplete="off">
        </div>
      </div>
      <div class="lang-modal-body">
        <div class="lang-grid" id="langCardsGrid">

          <button type="button" class="lang-card active" data-code="en" data-country="us" data-name="english"
            data-native="english"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('English', 'en', 'us'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <g fill-rule="evenodd">
                    <path fill="#bd3d44" d="M0 0h640v480H0z"></path>
                    <path stroke="#fff" stroke-width="37"
                      d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640"></path>
                    <path fill="#192f5d" d="M0 0h256v258.5H0z"></path>
                    <g fill="#fff">
                      <circle cx="25" cy="20" r="7"></circle>
                      <circle cx="76" cy="20" r="7"></circle>
                      <circle cx="128" cy="20" r="7"></circle>
                      <circle cx="180" cy="20" r="7"></circle>
                      <circle cx="230" cy="20" r="7"></circle>
                      <circle cx="51" cy="45" r="7"></circle>
                      <circle cx="102" cy="45" r="7"></circle>
                      <circle cx="154" cy="45" r="7"></circle>
                      <circle cx="205" cy="45" r="7"></circle>
                      <circle cx="25" cy="70" r="7"></circle>
                      <circle cx="76" cy="70" r="7"></circle>
                      <circle cx="128" cy="70" r="7"></circle>
                      <circle cx="180" cy="70" r="7"></circle>
                      <circle cx="230" cy="70" r="7"></circle>
                      <circle cx="51" cy="95" r="7"></circle>
                      <circle cx="102" cy="95" r="7"></circle>
                      <circle cx="154" cy="95" r="7"></circle>
                      <circle cx="205" cy="95" r="7"></circle>
                      <circle cx="25" cy="120" r="7"></circle>
                      <circle cx="76" cy="120" r="7"></circle>
                      <circle cx="128" cy="120" r="7"></circle>
                      <circle cx="180" cy="120" r="7"></circle>
                      <circle cx="230" cy="120" r="7"></circle>
                      <circle cx="51" cy="145" r="7"></circle>
                      <circle cx="102" cy="145" r="7"></circle>
                      <circle cx="154" cy="145" r="7"></circle>
                      <circle cx="205" cy="145" r="7"></circle>
                      <circle cx="25" cy="170" r="7"></circle>
                      <circle cx="76" cy="170" r="7"></circle>
                      <circle cx="128" cy="170" r="7"></circle>
                      <circle cx="180" cy="170" r="7"></circle>
                      <circle cx="230" cy="170" r="7"></circle>
                      <circle cx="51" cy="195" r="7"></circle>
                      <circle cx="102" cy="195" r="7"></circle>
                      <circle cx="154" cy="195" r="7"></circle>
                      <circle cx="205" cy="195" r="7"></circle>
                      <circle cx="25" cy="220" r="7"></circle>
                      <circle cx="76" cy="220" r="7"></circle>
                      <circle cx="128" cy="220" r="7"></circle>
                      <circle cx="180" cy="220" r="7"></circle>
                      <circle cx="230" cy="220" r="7"></circle>
                    </g>
                  </g>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">English</span>
                <span class="lang-name-en">English</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="es" data-country="es" data-name="spanish"
            data-native="español"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Spanish', 'es', 'es'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#c60b1e" d="M0 0h640v480H0z"></path>
                  <path fill="#ffc400" d="M0 120h640v240H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Español</span>
                <span class="lang-name-en">Spanish</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="fr" data-country="fr" data-name="french"
            data-native="français"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('French', 'fr', 'fr'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#002654" d="M0 0h213.3v480H0z"></path>
                  <path fill="#fff" d="M213.3 0h213.4v480H213.3z"></path>
                  <path fill="#ce1126" d="M426.7 0H640v480H426.7z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Français</span>
                <span class="lang-name-en">French</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="de" data-country="de" data-name="german"
            data-native="deutsch"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('German', 'de', 'de'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#000" d="M0 0h640v160H0z"></path>
                  <path fill="#d00" d="M0 160h640v160H0z"></path>
                  <path fill="#ffce00" d="M0 320h640v160H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Deutsch</span>
                <span class="lang-name-en">German</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="it" data-country="it" data-name="italian"
            data-native="italiano"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Italian', 'it', 'it'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#009246" d="M0 0h213.3v480H0z"></path>
                  <path fill="#fff" d="M213.3 0h213.4v480H213.3z"></path>
                  <path fill="#ce2b37" d="M426.7 0H640v480H426.7z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Italiano</span>
                <span class="lang-name-en">Italian</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="pt" data-country="pt" data-name="portuguese"
            data-native="português"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Portuguese', 'pt', 'pt'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#046a38" d="M0 0h256v480H0z"></path>
                  <path fill="#da291c" d="M256 0h384v480H256z"></path>
                  <circle cx="256" cy="240" r="70" fill="#ffc72c"></circle>
                  <path fill="#da291c" d="M236 215h40v50h-40z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Português</span>
                <span class="lang-name-en">Portuguese</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="ja" data-country="ja" data-name="japanese"
            data-native="日本語"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Japanese', 'ja', 'ja'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#fff" d="M0 0h640v480H0z"></path>
                  <circle cx="320" cy="240" r="130" fill="#bc002d"></circle>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">日本語</span>
                <span class="lang-name-en">Japanese</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="ko" data-country="ko" data-name="korean" data-native="한국어"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Korean', 'ko', 'ko'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#fff" d="M0 0h640v480H0z"></path>
                  <path fill="#c60c30" d="M320 130a110 110 0 0 1 0 220 55 55 0 0 1 0-110 55 55 0 0 0 0-110z"></path>
                  <path fill="#003478" d="M320 130a55 55 0 0 1 0 110 55 55 0 0 0 0 110 110 110 0 0 1 0-220z"></path>
                  <circle cx="160" cy="140" r="10" fill="#000"></circle>
                  <circle cx="480" cy="140" r="10" fill="#000"></circle>
                  <circle cx="160" cy="340" r="10" fill="#000"></circle>
                  <circle cx="480" cy="340" r="10" fill="#000"></circle>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">한국어</span>
                <span class="lang-name-en">Korean</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="zh-CN" data-country="cn" data-name="chinese (simp)"
            data-native="中文 (简体)"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Chinese (Simp)', 'zh-CN', 'cn'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#de2910" d="M0 0h640v480H0z"></path>
                  <polygon fill="#ffde00"
                    points="100,50 112,87 151,87 120,110 131,148 100,125 69,148 80,110 49,87 88,87"></polygon>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">中文 (简体)</span>
                <span class="lang-name-en">Chinese (Simp)</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="zh-TW" data-country="tw" data-name="chinese (trad)"
            data-native="中文 (繁體)"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Chinese (Trad)', 'zh-TW', 'tw'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#fe0000" d="M0 0h640v480H0z"></path>
                  <path fill="#000095" d="M0 0h320v240H0z"></path>
                  <circle cx="160" cy="120" r="50" fill="#fff"></circle>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">中文 (繁體)</span>
                <span class="lang-name-en">Chinese (Trad)</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="hi" data-country="in" data-name="hindi"
            data-native="हिन्दी"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Hindi', 'hi', 'in'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#f93" d="M0 0h640v160H0z"></path>
                  <path fill="#fff" d="M0 160h640v160H0z"></path>
                  <path fill="#128807" d="M0 320h640v160H0z"></path>
                  <circle cx="320" cy="240" r="55" fill="none" stroke="#000080" stroke-width="7"></circle>
                  <circle cx="320" cy="240" r="10" fill="#000080"></circle>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">हिन्दी</span>
                <span class="lang-name-en">Hindi</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="ar" data-country="sa" data-name="arabic"
            data-native="العربية"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Arabic', 'ar', 'sa'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#006c35" d="M0 0h640v480H0z"></path>
                  <path stroke="#fff" stroke-width="12" fill="none" d="M160 300h320M200 280l-40 20 40 20"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">العربية</span>
                <span class="lang-name-en">Arabic</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="ru" data-country="ru" data-name="russian"
            data-native="русский"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Russian', 'ru', 'ru'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#fff" d="M0 0h640v160H0z"></path>
                  <path fill="#0039a6" d="M0 160h640v160H0z"></path>
                  <path fill="#d52b1e" d="M0 320h640v160H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Русский</span>
                <span class="lang-name-en">Russian</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="tr" data-country="tr" data-name="turkish"
            data-native="türkçe"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Turkish', 'tr', 'tr'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#e30a17" d="M0 0h640v480H0z"></path>
                  <circle cx="280" cy="240" r="110" fill="#fff"></circle>
                  <circle cx="310" cy="240" r="88" fill="#e30a17"></circle>
                  <polygon fill="#fff" points="390,240 425,252 412,216 440,240 405,240"></polygon>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Türkçe</span>
                <span class="lang-name-en">Turkish</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="id" data-country="id" data-name="indonesian"
            data-native="bahasa indonesia"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Indonesian', 'id', 'id'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#e70011" d="M0 0h640v240H0z"></path>
                  <path fill="#fff" d="M0 240h640v240H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Bahasa Indonesia</span>
                <span class="lang-name-en">Indonesian</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="vi" data-country="vi" data-name="vietnamese"
            data-native="tiếng việt"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Vietnamese', 'vi', 'vi'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#da251d" d="M0 0h640v480H0z"></path>
                  <polygon fill="#ff0"
                    points="320,130 355,230 460,230 375,295 407,395 320,335 233,395 265,295 180,230 285,230"></polygon>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Tiếng Việt</span>
                <span class="lang-name-en">Vietnamese</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="nl" data-country="nl" data-name="dutch"
            data-native="nederlands"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Dutch', 'nl', 'nl'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#ae1c28" d="M0 0h640v160H0z"></path>
                  <path fill="#fff" d="M0 160h640v160H0z"></path>
                  <path fill="#21468b" d="M0 320h640v160H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Nederlands</span>
                <span class="lang-name-en">Dutch</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="pl" data-country="pl" data-name="polish"
            data-native="polski"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Polish', 'pl', 'pl'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#fff" d="M0 0h640v240H0z"></path>
                  <path fill="#dc143c" d="M0 240h640v240H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Polski</span>
                <span class="lang-name-en">Polish</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="sv" data-country="se" data-name="swedish"
            data-native="svenska"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Swedish', 'sv', 'se'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#006aa7" d="M0 0h640v480H0z"></path>
                  <path fill="#fecc00" d="M180 0h70v480h-70zM0 205h640v70H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Svenska</span>
                <span class="lang-name-en">Swedish</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="no" data-country="no" data-name="norwegian"
            data-native="norsk"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Norwegian', 'no', 'no'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#ba0c2f" d="M0 0h640v480H0z"></path>
                  <path fill="#fff" d="M160 0h110v480H160zM0 185h640v110H0z"></path>
                  <path fill="#00205b" d="M190 0h50v480h-50zM0 215h640v50H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Norsk</span>
                <span class="lang-name-en">Norwegian</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="da" data-country="dk" data-name="danish"
            data-native="dansk"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Danish', 'da', 'dk'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#c60c30" d="M0 0h640v480H0z"></path>
                  <path fill="#fff" d="M180 0h70v480h-70zM0 205h640v70H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Dansk</span>
                <span class="lang-name-en">Danish</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="fi" data-country="fi" data-name="finnish"
            data-native="suomi"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Finnish', 'fi', 'fi'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#fff" d="M0 0h640v480H0z"></path>
                  <path fill="#002f6c" d="M180 0h90v480H180zM0 195h640v90H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Suomi</span>
                <span class="lang-name-en">Finnish</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="el" data-country="gr" data-name="greek"
            data-native="ελληνικά"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Greek', 'el', 'gr'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#0d5eaf" d="M0 0h640v480H0z"></path>
                  <path stroke="#fff" stroke-width="53" d="M0 80h640M0 186h640M0 293h640M0 400h640"></path>
                  <path fill="#0d5eaf" d="M0 0h240v240H0z"></path>
                  <path fill="#fff" d="M95 0h50v240H95zM0 95h240v50H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Ελληνικά</span>
                <span class="lang-name-en">Greek</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="cs" data-country="cz" data-name="czech"
            data-native="čeština"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Czech', 'cs', 'cz'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#fff" d="M0 0h640v240H0z"></path>
                  <path fill="#d7141a" d="M0 240h640v240H0z"></path>
                  <polygon fill="#11457e" points="0,0 300,240 0,480"></polygon>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Čeština</span>
                <span class="lang-name-en">Czech</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="hu" data-country="hu" data-name="hungarian"
            data-native="magyar"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Hungarian', 'hu', 'hu'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#ce2939" d="M0 0h640v160H0z"></path>
                  <path fill="#fff" d="M0 160h640v160H0z"></path>
                  <path fill="#477050" d="M0 320h640v160H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Magyar</span>
                <span class="lang-name-en">Hungarian</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="ro" data-country="ro" data-name="romanian"
            data-native="română"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Romanian', 'ro', 'ro'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#002b7f" d="M0 0h213.3v480H0z"></path>
                  <path fill="#fcd116" d="M213.3 0h213.4v480H213.3z"></path>
                  <path fill="#ce1126" d="M426.7 0H640v480H426.7z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Română</span>
                <span class="lang-name-en">Romanian</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="uk" data-country="ua" data-name="ukrainian"
            data-native="українська"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Ukrainian', 'uk', 'ua'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#0057b7" d="M0 0h640v240H0z"></path>
                  <path fill="#ffd700" d="M0 240h640v240H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">Українська</span>
                <span class="lang-name-en">Ukrainian</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="th" data-country="th" data-name="thai" data-native="ไทย"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Thai', 'th', 'th'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#a51931" d="M0 0h640v480H0z"></path>
                  <path fill="#f4f5f8" d="M0 80h640v320H0z"></path>
                  <path fill="#2d2a4a" d="M0 160h640v160H0z"></path>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">ไทย</span>
                <span class="lang-name-en">Thai</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="bn" data-country="bd" data-name="bengali"
            data-native="বাংলা"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Bengali', 'bn', 'bd'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#006a4e" d="M0 0h640v480H0z"></path>
                  <circle cx="270" cy="240" r="140" fill="#f42a41"></circle>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">বাংলা</span>
                <span class="lang-name-en">Bengali</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <button type="button" class="lang-card " data-code="he" data-country="il" data-name="hebrew"
            data-native="עברית"
            onclick="window.mompdfSelectLang &amp;&amp; window.mompdfSelectLang('Hebrew', 'he', 'il'); event.stopPropagation();">
            <div class="lang-card-left">
              <div class="lang-flag-box">
                <svg class="flag-icon" viewBox="0 0 640 480">
                  <path fill="#fff" d="M0 0h640v480H0z"></path>
                  <path fill="#0038b8" d="M0 60h640v60H0zM0 360h640v60H0z"></path>
                  <polygon fill="none" stroke="#0038b8" stroke-width="12" points="320,175 365,255 275,255"></polygon>
                  <polygon fill="none" stroke="#0038b8" stroke-width="12" points="320,295 365,215 275,215"></polygon>
                </svg>
              </div>
              <div class="lang-card-text">
                <span class="lang-name-native">עברית</span>
                <span class="lang-name-en">Hebrew</span>
              </div>
            </div>
            <div class="lang-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </button>

          <div class="lang-empty-state" id="langEmptyState">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <h4 data-i18n="no_languages_found">No languages found</h4>
            <p data-i18n="try_searching_with_another">Try searching with another keyword or native script</p>
          </div>
        </div>
         // Custom Crop JS
    let currentPdf = null;
    let currentScale = 0; // 0 means not calculated yet
    let pageNum = 1;
    let totalPages = 1;
    let pdfFile = null;
    let isDragging = false;
    let isResizing = false;
    let resizeHandle = null;
    let cropBoxData = { x: 0, y: 0, w: 0, h: 0 };
    let startX, startY;
    
    let canvas, ctx, cropBox, canvasWrapper;

    // Load PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

    // Intercept mompdfWorkspace to inject our custom UI directly into its layout
    window.addEventListener('load', () => {
      if (window.mompdfWorkspace) {
        const origLoadFiles = window.mompdfWorkspace.loadFilesIntoStudio.bind(window.mompdfWorkspace);
        window.mompdfWorkspace.loadFilesIntoStudio = async function(files) {
          if (files && files.length > 0) {
            
            // 1. Let the workspace build the standard layout headers/footers
            // But first, override the renderControls for crop_pdf on the instance!
            this.toolDef.renderControls = () => `
              <div style="background: #e0f2fe; color: #0284c7; padding: 16px; border-radius: 8px; margin-bottom: 24px; display: flex; gap: 12px; align-items: flex-start; font-size: 13px; line-height: 1.5;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0; margin-top: 1px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <div>Click and drag to select the area you want to keep. Resize if needed.</div>
              </div>
              <div style="text-align: right; margin-bottom: 20px;">
                <a href="#" id="cropResetBtn" style="color: var(--danger); font-size: 14px; text-decoration: underline; font-weight: 500; cursor: pointer;">Reset all</a>
              </div>
              <div class="control-item">
                <div class="control-item-label">Pages:</div>
                <div style="display: flex; gap: 20px; align-items: center; margin-top: 10px;">
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: var(--text-color);">
                    <input type="radio" name="cropPages" value="all" checked style="accent-color: var(--primary); width: 16px; height: 16px;" /> All pages
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: var(--text-color);">
                    <input type="radio" name="cropPages" value="current" style="accent-color: var(--primary); width: 16px; height: 16px;" /> Current page
                  </label>
                </div>
              </div>
            `;
            
            origLoadFiles(files);
            
            // 2. Inject our viewer into the canvas area
            const canvasArea = document.getElementById('canvasContentArea');
            canvasArea.innerHTML = `
              <div id="cropViewerContainer" style="position: relative; overflow: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; width: 100%; height: 75vh; min-height: 500px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div id="cropCanvasWrapper" style="position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin: 40px auto; background: white;">
                  <canvas id="cropPdfCanvas"></canvas>
                  <div id="cropBox" style="position: absolute; border: 2px dashed var(--primary); background: rgba(59, 130, 246, 0.1); cursor: move; box-sizing: border-box;">
                    <div class="resize-handle nw" style="position: absolute; top: -5px; left: -5px; width: 10px; height: 10px; background: var(--primary); border-radius: 50%; cursor: nwse-resize;"></div>
                    <div class="resize-handle ne" style="position: absolute; top: -5px; right: -5px; width: 10px; height: 10px; background: var(--primary); border-radius: 50%; cursor: nesw-resize;"></div>
                    <div class="resize-handle sw" style="position: absolute; bottom: -5px; left: -5px; width: 10px; height: 10px; background: var(--primary); border-radius: 50%; cursor: nesw-resize;"></div>
                    <div class="resize-handle se" style="position: absolute; bottom: -5px; right: -5px; width: 10px; height: 10px; background: var(--primary); border-radius: 50%; cursor: nwse-resize;"></div>
                  </div>
                </div>
                
                <style>
                  #cropToolbar {
                    position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(20px);
                    background: #2b2b2b; color: white; padding: 8px 12px; border-radius: 8px;
                    display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);
                    opacity: 0; visibility: hidden; transition: all 0.2s ease; z-index: 10000;
                  }
                  #cropViewerContainer:hover #cropToolbar { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
                  .ct-btn { background: transparent; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 4px; transition: background 0.2s; }
                  .ct-btn:hover { background: rgba(255,255,255,0.15); }
                  .ct-input { background: #444; color: white; border: 1px solid #555; border-radius: 4px; padding: 4px 8px; text-align: center; font-size: 14px; outline: none; width: 45px; font-weight: 500; }
                  .ct-divider { width: 1px; height: 24px; background: #555; margin: 0 2px; }
                </style>
                <div id="cropToolbar">
                  <button id="cropPrevPage" class="ct-btn" title="Previous Page"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                  <button id="cropNextPage" class="ct-btn" title="Next Page"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                  
                  <div style="display: flex; align-items: center; gap: 8px; margin: 0 4px;">
                    <input type="number" id="cropPageInput" value="1" min="1" class="ct-input" />
                    <span style="color: #cbd5e1; font-size: 14px; font-weight: 500;">/ <span id="cropTotalPages">1</span></span>
                  </div>
                  
                  <div class="ct-divider"></div>
                  
                  <button id="cropZoomOut" class="ct-btn" title="Zoom Out"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg></button>
                  <button id="cropZoomIn" class="ct-btn" title="Zoom In"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></button>
                  <div class="ct-input" id="cropZoomText" style="width: 55px; cursor: default;">100%</div>
                  <div class="ct-divider"></div>
                  <button id="cropFitWidthBtn" class="ct-btn" title="Fit Width"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="12" x2="2" y2="12"></line><polyline points="5 15 2 12 5 9"></polyline><polyline points="19 15 22 12 19 9"></polyline><line x1="22" y1="4" x2="22" y2="20"></line><line x1="2" y1="4" x2="2" y2="20"></line></svg></button>
                  <div class="ct-divider"></div>
                  <button id="cropSettingsBtn" class="ct-btn" title="Settings"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                </div>
              </div>
            `;
            
            // Rename the main action button
            const mainBtn = document.getElementById('mainActionBtn');
            if (mainBtn) {
               mainBtn.innerHTML = 'Crop PDF <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:5px;"><polyline points="20 6 9 17 4 12"></polyline></svg>';
               mainBtn.style.fontSize = '18px';
               mainBtn.style.padding = '14px';
               mainBtn.type = 'button';
               mainBtn.onclick = handleCropSubmit; 
            }

            // Bind global variables
            canvas = document.getElementById('cropPdfCanvas');
            ctx = canvas.getContext('2d');
            cropBox = document.getElementById('cropBox');
            canvasWrapper = document.getElementById('cropCanvasWrapper');
            
            pdfFile = files[0];
            const arrayBuffer = await pdfFile.arrayBuffer();
            currentPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            totalPages = currentPdf.numPages;
            document.getElementById('cropTotalPages').innerText = totalPages;
            
            bindCropEvents();
            
            currentScale = 0; // reset for auto-fit on render
            await renderPage(1);
          } else {
            origLoadFiles(files);
          }
        };
      }
    });

    async function renderPage(num) {
      if (!currentPdf) return;
      const page = await currentPdf.getPage(num);
      
      // Auto-fit calculate on first render
      if (currentScale === 0) {
         const container = document.getElementById('cropViewerContainer');
         const unscaled = page.getViewport({ scale: 1.0 });
         // Leave 60px padding on width and height
         const scaleW = (container.clientWidth - 80) / unscaled.width;
         const scaleH = (container.clientHeight - 80) / unscaled.height;
         const fitScale = Math.min(scaleW, scaleH);
         currentScale = fitScale < 1.0 ? fitScale : 1.0;
      }
      
      const viewport = page.getViewport({ scale: currentScale });
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvasWrapper.style.width = viewport.width + 'px';
      canvasWrapper.style.height = viewport.height + 'px';

      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;

      resetCropBox();
      document.getElementById('cropPageInput').value = num;
      document.getElementById('cropZoomText').innerText = Math.round(currentScale * 100) + '%';
    }

    function resetCropBox() {
      cropBoxData = { x: 0, y: 0, w: canvas.width, h: canvas.height };
      updateCropBoxDOM();
    }

    function updateCropBoxDOM() {
      cropBox.style.left = cropBoxData.x + 'px';
      cropBox.style.top = cropBoxData.y + 'px';
      cropBox.style.width = cropBoxData.w + 'px';
      cropBox.style.height = cropBoxData.h + 'px';
    }

    function bindCropEvents() {
      // Drag and resize logic
      canvasWrapper.addEventListener('mousedown', (e) => {
        const rect = canvasWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (e.target.classList.contains('resize-handle')) {
          isResizing = true; resizeHandle = e.target.className.split(' ')[1];
          startX = e.clientX; startY = e.clientY;
        } else if (e.target === cropBox || cropBox.contains(e.target)) {
          isDragging = true; startX = e.clientX; startY = e.clientY;
        } else {
          cropBoxData = { x: x, y: y, w: 0, h: 0 };
          isResizing = true; resizeHandle = 'se';
          startX = e.clientX; startY = e.clientY;
          updateCropBoxDOM();
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging && !isResizing) return;
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        startX = e.clientX; startY = e.clientY;
        if (isDragging) {
          cropBoxData.x = Math.max(0, Math.min(canvas.width - cropBoxData.w, cropBoxData.x + dx));
          cropBoxData.y = Math.max(0, Math.min(canvas.height - cropBoxData.h, cropBoxData.y + dy));
        } else if (isResizing) {
          if (resizeHandle.includes('e')) cropBoxData.w = Math.max(10, Math.min(canvas.width - cropBoxData.x, cropBoxData.w + dx));
          if (resizeHandle.includes('s')) cropBoxData.h = Math.max(10, Math.min(canvas.height - cropBoxData.y, cropBoxData.h + dy));
          if (resizeHandle.includes('w')) {
            const oldX = cropBoxData.x; cropBoxData.x = Math.max(0, Math.min(cropBoxData.x + cropBoxData.w - 10, cropBoxData.x + dx));
            cropBoxData.w += (oldX - cropBoxData.x);
          }
          if (resizeHandle.includes('n')) {
            const oldY = cropBoxData.y; cropBoxData.y = Math.max(0, Math.min(cropBoxData.y + cropBoxData.h - 10, cropBoxData.y + dy));
            cropBoxData.h += (oldY - cropBoxData.y);
          }
        }
        updateCropBoxDOM();
      });

      window.addEventListener('mouseup', () => { isDragging = false; isResizing = false; resizeHandle = null; });

      document.getElementById('cropPrevPage').onclick = () => { if (pageNum > 1) { pageNum--; renderPage(pageNum); } };
      document.getElementById('cropNextPage').onclick = () => { if (pageNum < totalPages) { pageNum++; renderPage(pageNum); } };
      document.getElementById('cropZoomIn').onclick = () => { if (currentScale < 3.0) { currentScale += 0.2; renderPage(pageNum); } };
      document.getElementById('cropZoomOut').onclick = () => { if (currentScale > 0.4) { currentScale -= 0.2; renderPage(pageNum); } };
      document.getElementById('cropFitWidthBtn').onclick = () => { currentScale = 0; renderPage(pageNum); };
      
      document.getElementById('cropResetBtn').onclick = (e) => { e.preventDefault(); resetCropBox(); };
      
      document.getElementById('cropSettingsBtn').onclick = (e) => {
        const sidebar = document.getElementById('toolSpecificSidebar');
        if (sidebar) {
          sidebar.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
          sidebar.style.transition = 'box-shadow 0.3s ease';
          setTimeout(() => { sidebar.style.boxShadow = 'none'; }, 800);
        }
      };
    }

    async function handleCropSubmit() {
      if (cropBoxData.w < 20 || cropBoxData.h < 20) return;
      const submitBtn = document.getElementById('mainActionBtn');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Processing...';
      submitBtn.style.cursor = 'wait';

      const scaleFactor = 1.0 / currentScale;
      const actX = cropBoxData.x * scaleFactor;
      const actY = cropBoxData.y * scaleFactor;
      const actW = cropBoxData.w * scaleFactor;
      const actH = cropBoxData.h * scaleFactor;

      const pageMode = document.querySelector('input[name="cropPages"]:checked').value;

      const formData = new FormData();
      formData.append('files', pdfFile);
      formData.append('x', actX);
      formData.append('y', actY);
      formData.append('width', actW);
      formData.append('height', actH);
      formData.append('pageMode', pageMode);
      formData.append('currentPage', pageNum);
      formData.append('tool', 'crop');

      try {
        const response = await fetch('/api/process', { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Failed to process PDF');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        let filename = 'mompdf_cropped.pdf';
        const disposition = response.headers.get('content-disposition');
        if (disposition && disposition.indexOf('filename=') !== -1) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
            if (matches && matches[1]) filename = matches[1].replace(/['"]/g, '');
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        submitBtn.innerHTML = origText;
        submitBtn.style.cursor = 'pointer';
      }
    }
  