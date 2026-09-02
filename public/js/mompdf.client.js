/**
 * MomPDF Universal Client Controller
 * Brand: MomPDF | Tagline: Everything PDF in One Place
 */

(function () {
  'use strict';

  class MomPDFApp {
    constructor() {
      this.tool = this.detectTool();
      this.files = [];
      this.init();
    }

    detectTool() {
      if (window.mompdfTool) return window.mompdfTool;
      const path = window.location.pathname.toLowerCase();
      const match = path.match(/\/([a-z0-9_-]+)(?:\.html)?$/);
      if (match && match[1] && match[1] !== 'index') {
        return match[1];
      }
      return 'merge';
    }

    init() {
      this.dropzone = document.getElementById('dropzone');
      this.fileInput = document.getElementById('fileInput');
      this.selectBtn = document.getElementById('selectFilesBtn');
      this.fileListContainer = document.getElementById('fileList');
      this.workArea = document.getElementById('workArea');
      this.controlsArea = document.getElementById('toolControls');
      this.progressArea = document.getElementById('progressArea');
      this.successArea = document.getElementById('successArea');
      this.actionBtn = document.getElementById('actionBtn');
      this.downloadBtn = document.getElementById('downloadBtn');
      this.resetBtn = document.getElementById('resetBtn');
      this.errorBanner = document.getElementById('errorBanner');

      if (this.dropzone && this.fileInput) {
        this.bindDropzoneEvents();
      }

      if (this.actionBtn) {
        this.actionBtn.addEventListener('click', () => this.processTask());
      }

      if (this.resetBtn) {
        this.resetBtn.addEventListener('click', () => this.resetUI());
      }

      // Filter tabs on index page
      this.bindFilterTabs();
    }

    bindDropzoneEvents() {
      if (this.selectBtn) {
        this.selectBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.fileInput.click();
        });
      }

      this.dropzone.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
          this.fileInput.click();
        }
      });

      this.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length) {
          this.addFiles(Array.from(e.target.files));
        }
      });

      ['dragenter', 'dragover'].forEach((eventName) => {
        this.dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          this.dropzone.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach((eventName) => {
        this.dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          this.dropzone.classList.remove('drag-over');
        });
      });

      this.dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length) {
          this.addFiles(Array.from(dt.files));
        }
      });
    }

    addFiles(newFiles) {
      this.hideError();
      const isMultiFileTool = ['merge', 'merge_pdf', 'jpg_to_pdf', 'jpg-to-pdf', 'compare-pdf', 'compare'].includes(this.tool);

      if (!isMultiFileTool && newFiles.length > 1) {
        this.files = [newFiles[0]];
      } else if (!isMultiFileTool) {
        this.files = newFiles;
      } else {
        this.files = [...this.files, ...newFiles];
      }

      this.renderFiles();
    }

    renderFiles() {
      if (!this.fileListContainer) return;
      this.fileListContainer.innerHTML = '';

      if (this.files.length === 0) {
        if (this.controlsArea) this.controlsArea.style.display = 'none';
        return;
      }

      // Add Sort Toolbar if multiple files
      if (this.files.length >= 2) {
        const toolbar = document.createElement('div');
        toolbar.className = 'sort-toolbar';
        toolbar.style.cssText = 'width: 100%; margin-bottom: 14px; display: flex; justify-content: flex-end; align-items: center; gap: 8px;';
        toolbar.innerHTML = `
          <label style="font-size: 13px; font-weight: 700; color: var(--text-muted);" data-i18n="arrange">Arrange:</label>
          <select class="sort-select" style="padding: 6px 12px; border-radius: 8px; border: 1px solid var(--border-color); font-weight: 700;">
            <option value="custom" ${this.currentSort === 'custom' ? 'selected' : ''} data-i18n="custom_order">Custom Order</option>
            <option value="az" ${this.currentSort === 'az' ? 'selected' : ''} data-i18n="a_z">A &rarr; Z</option>
            <option value="za" ${this.currentSort === 'za' ? 'selected' : ''} data-i18n="z_a">Z &rarr; A</option>
            <option value="newest" ${this.currentSort === 'newest' ? 'selected' : ''} data-i18n="newest_oldest">Newest &rarr; Oldest</option>
            <option value="oldest" ${this.currentSort === 'oldest' ? 'selected' : ''} data-i18n="oldest_newest">Oldest &rarr; Newest</option>
          </select>
        `;
        toolbar.querySelector('select').addEventListener('change', (e) => {
          this.sortFiles(e.target.value);
        });
        this.fileListContainer.appendChild(toolbar);
      }

      const grid = document.createElement('div');
      grid.className = 'file-list-grid';

      this.files.forEach((file, index) => {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.draggable = true;
        card.innerHTML = `
          <div style="position: absolute; top: 6px; left: 6px; background: var(--primary); color: #fff; font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 9999px;">#${index + 1}</div>
          <button class="file-remove-btn" title="Remove">&times;</button>
          <div class="file-thumb">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <div class="file-name" title="${this.escapeHtml(file.name)}">${this.escapeHtml(file.name)}</div>
          <div class="file-meta">${this.formatFileSize(file.size)}</div>
          <div style="display: flex; gap: 4px; margin-top: 6px;">
            <button type="button" class="reorder-left-btn" style="padding: 2px 8px; font-size: 12px; font-weight: 700; border-radius: 4px; border: 1px solid var(--border-color); background: #f8fafc; cursor: pointer;" ${index === 0 ? 'disabled' : ''}>&larr;</button>
            <button type="button" class="reorder-right-btn" style="padding: 2px 8px; font-size: 12px; font-weight: 700; border-radius: 4px; border: 1px solid var(--border-color); background: #f8fafc; cursor: pointer;" ${index === this.files.length - 1 ? 'disabled' : ''}>&rarr;</button>
          </div>
        `;

        card.querySelector('.file-remove-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          this.removeFile(index);
        });

        const leftBtn = card.querySelector('.reorder-left-btn');
        if (leftBtn) {
          leftBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.moveFile(index, index - 1);
          });
        }

        const rightBtn = card.querySelector('.reorder-right-btn');
        if (rightBtn) {
          rightBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.moveFile(index, index + 1);
          });
        }

        grid.appendChild(card);
      });

      this.fileListContainer.appendChild(grid);

      if (this.controlsArea) {
        this.controlsArea.style.display = 'block';
      }
      
      if (window.mompdfI18n) {
        window.mompdfI18n.applyTranslations();
      }
    }

    sortFiles(mode) {
      this.currentSort = mode;
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
      if (mode === 'az') {
        this.files.sort((a, b) => collator.compare(a.name, b.name));
      } else if (mode === 'za') {
        this.files.sort((a, b) => collator.compare(b.name, a.name));
      } else if (mode === 'newest') {
        this.files.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
      } else if (mode === 'oldest') {
        this.files.sort((a, b) => (a.lastModified || 0) - (b.lastModified || 0));
      }
      this.renderFiles();
    }

    moveFile(fromIndex, toIndex) {
      if (toIndex < 0 || toIndex >= this.files.length) return;
      this.currentSort = 'custom';
      const [moved] = this.files.splice(fromIndex, 1);
      this.files.splice(toIndex, 0, moved);
      this.renderFiles();
    }

    removeFile(index) {
      this.files.splice(index, 1);
      this.renderFiles();
    }

    async processTask() {
      if (this.files.length === 0 && this.tool !== 'html-to-pdf') {
        this.showError(window.mompdfI18n ? window.mompdfI18n.t('please_select_at_least_one') : 'Please select at least one file to process.');
        return;
      }

      this.hideError();
      this.showProgress();

      const formData = new FormData();
      formData.append('tool', this.tool);

      this.files.forEach((file) => {
        formData.append('files', file);
      });

      // Gather additional tool options from controls
      this.appendToolOptions(formData);

      try {
        // Animate fake progress
        this.animateProgressBar();

        const response = await fetch('/api/process', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || (window.mompdfI18n ? window.mompdfI18n.t('processing_failed_please') : 'Processing failed. Please try again.'));
        }

        this.showSuccess(data.data);
      } catch (err) {
        this.hideProgress();
        this.showError(err.message || (window.mompdfI18n ? window.mompdfI18n.t('something_went_wrong_please') : 'Something went wrong. Please try again.'));
      }
    }

    appendToolOptions(formData) {
      // Gather inputs inside #toolControls
      if (!this.controlsArea) return;
      const inputs = this.controlsArea.querySelectorAll('input, select, textarea');
      inputs.forEach((input) => {
        if (input.name) {
          formData.append(input.name, input.value);
        }
      });
    }

    animateProgressBar() {
      const bar = document.getElementById('progressBar');
      const text = document.getElementById('progressText');
      if (!bar) return;

      let percent = 0;
      const interval = setInterval(() => {
        if (percent >= 90) {
          clearInterval(interval);
        } else {
          percent += 15;
          bar.style.width = `${percent}%`;
          if (text) text.innerText = (window.mompdfI18n ? window.mompdfI18n.t('processing') : 'Processing...') + ` ${percent}%`;
        }
      }, 150);
    }

    showProgress() {
      if (this.workArea) this.workArea.style.display = 'none';
      if (this.controlsArea) this.controlsArea.style.display = 'none';
      if (this.progressArea) {
        this.progressArea.style.display = 'block';
        const bar = document.getElementById('progressBar');
        if (bar) bar.style.width = '10%';
      }
    }

    hideProgress() {
      if (this.progressArea) this.progressArea.style.display = 'none';
      if (this.workArea) this.workArea.style.display = 'block';
      if (this.controlsArea && this.files.length > 0) {
        this.controlsArea.style.display = 'block';
      }
    }

    showSuccess(result) {
      if (this.progressArea) this.progressArea.style.display = 'none';
      if (this.workArea) this.workArea.style.display = 'none';
      if (this.controlsArea) this.controlsArea.style.display = 'none';

      if (this.successArea) {
        this.successArea.style.display = 'block';
        const nameEl = document.getElementById('resultFileName');
        const sizeEl = document.getElementById('resultFileSize');

        if (nameEl) nameEl.innerText = result.filename || 'Processed_MomPDF.pdf';
        if (sizeEl) sizeEl.innerText = this.formatFileSize(result.size || 0);

        if (this.downloadBtn) {
          this.downloadBtn.href = result.downloadUrl;
          this.downloadBtn.setAttribute('download', result.filename || 'download.pdf');
        }
      }
    }

    resetUI() {
      this.files = [];
      if (this.fileInput) this.fileInput.value = '';
      if (this.fileListContainer) this.fileListContainer.innerHTML = '';
      if (this.successArea) this.successArea.style.display = 'none';
      if (this.progressArea) this.progressArea.style.display = 'none';
      if (this.controlsArea) this.controlsArea.style.display = 'none';
      if (this.workArea) this.workArea.style.display = 'block';
      this.hideError();
    }

    showError(msg) {
      if (!this.errorBanner) {
        alert(msg);
        return;
      }
      this.errorBanner.innerText = msg;
      this.errorBanner.style.display = 'block';
    }

    hideError() {
      if (this.errorBanner) {
        this.errorBanner.style.display = 'none';
      }
    }

    formatFileSize(bytes) {
      if (!bytes || bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, (s) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[s]));
    }

    bindFilterTabs() {
      const tabs = document.querySelectorAll('.tab-btn');
      const cards = document.querySelectorAll('.tool-card');
      if (!tabs.length || !cards.length) return;

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');

          const filter = tab.getAttribute('data-filter');
          cards.forEach((card) => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });

      // Enable drag and drop directly onto tool cards
      cards.forEach((card) => {
        card.addEventListener('dragover', (e) => {
          e.preventDefault();
          card.style.transform = 'translateY(-4px) scale(1.02)';
          card.style.borderColor = 'var(--primary)';
        });
        card.addEventListener('dragleave', (e) => {
          e.preventDefault();
          card.style.transform = '';
          card.style.borderColor = '';
        });
        card.addEventListener('drop', async (e) => {
          e.preventDefault();
          card.style.transform = '';
          card.style.borderColor = '';
          const dt = e.dataTransfer;
          if (dt && dt.files && dt.files.length) {
            const href = card.getAttribute('href');
            const targetTool = href.replace(/\.html$/, '');
            try {
              // Cache file in IndexedDB
              const dbReq = indexedDB.open('MomPDF_Workspace_DB', 1);
              dbReq.onsuccess = async (ev) => {
                const db = ev.target.result;
                const tx = db.transaction('cached_files', 'readwrite');
                const store = tx.objectStore('cached_files');
                const fileDataList = await Promise.all(
                  Array.from(dt.files).map(async (file) => ({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified,
                    buffer: await file.arrayBuffer()
                  }))
                );
                store.put({ toolId: targetTool, files: fileDataList, timestamp: Date.now() });
                tx.oncomplete = () => {
                  window.location.href = href;
                };
              };
              dbReq.onerror = () => {
                window.location.href = href;
              };
            } catch (err) {
              window.location.href = href;
            }
          }
        });
      });
    }
  }

  // Global language modal handlers
  window.mompdfOpenLangModal = function() {
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

  window.mompdfCloseLangModal = function() {
    const backdrop = document.getElementById('footerLangModalBackdrop');
    if (backdrop) backdrop.classList.remove('is-open');
  };

  window.mompdfFilterLanguages = function(query) {
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
  window.mompdfSelectLang = function(name, code, country) {
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
    } catch (e) {}

    // Trigger instant translation
    if (window.mompdfI18n && typeof window.mompdfI18n.setLanguage === 'function') {
      window.mompdfI18n.setLanguage(code);
    }
  };

  // Global instance
  document.addEventListener('DOMContentLoaded', () => {
    window.mompdf = new MomPDFApp();

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
    } catch (e) {}
    
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

