const fs = require('fs');
const path = require('path');
const { PUBLIC_DIR, buildFullPage } = require('./infoPagesBase');

// ==========================================
// 1. SECURITY.HTML
// ==========================================
const securityContent = `
      <!-- Spotlight Card -->
      <div class="executive-card">
        <div class="founder-media">
          <div class="founder-avatar-luxury" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);">
            🔒
            <div class="verified-badge" title="Bank Grade Validated">✓</div>
          </div>
          <div class="founder-status">Zero-Knowledge Certified</div>
        </div>

        <div class="executive-content">
          <div style="display:inline-block; padding:3px 10px; background:#FFE4E6; color:#E11D48; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Cryptographic Security</div>
          <h2>Bank-Grade In-Memory RAM Sandboxing</h2>
          <div class="executive-title">Zero Document Retention &bull; Automated 15-Minute Ephemeral Shredding</div>
          
          <div class="executive-quote">
            "Security is not a luxury or a paid upsell at MomPDF. Every document uploaded is processed inside an isolated, air-gapped memory sandbox. The moment transformation completes, an automated cryptographic garbage-collection cycle permanently shreds your data. Zero logs, zero data mining, zero AI training."
          </div>

          <div class="executive-actions">
            <a href="privacy.html" class="btn-linkedin-vip" style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              View Full Privacy Policy
            </a>
            <a href="terms.html" class="btn-email-vip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Terms of Protection
            </a>
          </div>
        </div>
      </div>

      <!-- Core Pillars -->
      <div class="section-head-center">
        <span class="section-tag">Security Architecture</span>
        <h3 class="section-title">4 Ironclad Layers of Document Protection</h3>
        <p class="section-subtitle">MomPDF was engineered from bare metal with strict zero-knowledge principles to safeguard enterprise and personal files.</p>
      </div>

      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FFE4E6; color:#E11D48;">⚡</div>
          <h4>Air-Gapped RAM Sandboxes</h4>
          <p>Files are loaded directly into RAM memory containers. They never touch unencrypted persistent swap partitions during manipulation.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#ECFDF5; color:#059669;">🔒</div>
          <h4>15-Minute Auto Shredding</h4>
          <p>A continuous background daemon cryptographically shreds uploaded files and processed outputs 15 minutes after completion.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#EFF6FF; color:#2563EB;">🛡️</div>
          <h4>Zero AI Model Training</h4>
          <p>We do not index, analyze, or feed user files into machine learning models or LLMs. Your intellectual property remains 100% yours.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FAF5FF; color:#9333EA;">🌐</div>
          <h4>TLS 1.3 &amp; AES-256 Transport</h4>
          <p>Every packet transferred between your browser and our edge servers is encrypted with modern TLS 1.3 and SHA-384 cipher suites.</p>
        </div>
      </div>

      <!-- Lifecycle Roadmap -->
      <div class="roadmap-section">
        <div style="text-align:center; max-width:600px; margin:0 auto 20px;">
          <span class="section-tag">Data Lifecycle</span>
          <h3 class="section-title" style="font-size:24px;">The 4-Stage Zero-Knowledge Lifecycle</h3>
          <p class="section-subtitle">Every uploaded file undergoes an automated, strictly enforced cryptographic lifecycle.</p>
        </div>

        <div class="timeline-list">
          <div class="timeline-item">
            <span class="timeline-num">Stage 01</span>
            <h5>Encrypted Ingestion</h5>
            <p>Documents transfer via TLS 1.3 with Perfect Forward Secrecy directly to an ephemeral worker process.</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-num">Stage 02</span>
            <h5>RAM Execution</h5>
            <p>PDF manipulations (merge, split, OCR, compress) execute exclusively in RAM using WebAssembly/C++ engines.</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-num">Stage 03</span>
            <h5>Secure Download Token</h5>
            <p>A single-use signed download hash is issued. Only the requesting browser session has access to the output.</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-num">Stage 04</span>
            <h5>Cryptographic Shred</h5>
            <p>At the 15-minute mark, files are overwritten with pseudo-random bytes and permanently unlinked.</p>
          </div>
        </div>
      </div>

      <!-- High-Impact Dark Metric Bar -->
      <div class="metrics-bar-dark">
        <div>
          <div class="metric-number-glow">100%</div>
          <div class="metric-label-muted">Ephemeral RAM Processing</div>
        </div>
        <div>
          <div class="metric-number-glow">15 min</div>
          <div class="metric-label-muted">Automated File Purge</div>
        </div>
        <div>
          <div class="metric-number-glow">AES-256</div>
          <div class="metric-label-muted">Cryptographic Standard</div>
        </div>
        <div>
          <div class="metric-number-glow">0 KB</div>
          <div class="metric-label-muted">Permanent Retained Files</div>
        </div>
      </div>

      <!-- Compliance Standards Cards -->
      <div class="section-head-center">
        <span class="section-tag">Global Compliance</span>
        <h3 class="section-title">Standardized Against Global Privacy Frameworks</h3>
      </div>

      <div class="pillars-grid" style="margin-bottom: 70px;">
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#EFF6FF; color:#2563EB;">🇪🇺</div>
          <h4>GDPR Compliance</h4>
          <p>Full European General Data Protection Regulation alignment including Article 17 Right to Erasure implemented automatically.</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#DCFCE7; color:#16A34A;">🏥</div>
          <h4>HIPAA Ready</h4>
          <p>Protected health information (PHI) can be processed securely with zero server-side retention and ephemeral sandboxes.</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FEF3C7; color:#D97706;">🏛️</div>
          <h4>CCPA &amp; CPRA</h4>
          <p>California Consumer Privacy Act compliant. MomPDF never sells, monetizes, or shares user document metadata with third parties.</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#F3E8FF; color:#7E22CE;">📜</div>
          <h4>ISO/IEC 27001</h4>
          <p>Adherence to strict international information security management controls and continuous threat mitigation practices.</p>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="section-head-center">
        <span class="section-tag">Security FAQ</span>
        <h3 class="section-title">Frequently Answered Security Inquiries</h3>
      </div>

      <div class="faq-grid">
        <div class="faq-card">
          <h4>🛡️ How long are files stored on MomPDF servers?</h4>
          <p>Uploaded and processed documents are automatically and permanently shredded within 15 minutes of upload. We maintain zero long-term document repositories.</p>
        </div>
        <div class="faq-card">
          <h4>🤖 Does MomPDF or any AI model train on my PDFs?</h4>
          <p>Never. MomPDF does not analyze, index, or use user document data for machine learning or AI model training. Your data remains strictly confidential.</p>
        </div>
        <div class="faq-card">
          <h4>🔐 Can MomPDF engineers or employees inspect my files?</h4>
          <p>No. File processing is automated and isolated inside unprivileged container sandboxes. No human access is possible or permitted under our security policies.</p>
        </div>
        <div class="faq-card">
          <h4>🌐 Is MomPDF safe for government, legal, or banking files?</h4>
          <p>Yes. Bank-grade TLS 1.3 encryption, ephemeral sandboxing, and immediate post-processing shredding make MomPDF suitable for sensitive documents.</p>
        </div>
      </div>

      <!-- Call to Action Banner -->
      <div class="about-cta-banner">
        <h3>Ready to process documents with total peace of mind?</h3>
        <p>Experience the web's most secure, privacy-first PDF utility suite with 30+ specialized tools.</p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="index.html" class="btn btn-primary btn-lg">Start Secure Processing &rarr;</a>
          <a href="privacy.html" class="btn btn-secondary btn-lg">Read Privacy Policy</a>
        </div>
      </div>
`;

// ==========================================
// 2. PRIVACY.HTML
// ==========================================
const privacyContent = `
      <!-- Spotlight Card -->
      <div class="executive-card">
        <div class="founder-media">
          <div class="founder-avatar-luxury" style="background: linear-gradient(135deg, #059669 0%, #047857 100%);">
            🛡️
            <div class="verified-badge" title="Privacy Guaranteed">✓</div>
          </div>
          <div class="founder-status">100% Privacy by Design</div>
        </div>

        <div class="executive-content">
          <div style="display:inline-block; padding:3px 10px; background:#FFE4E6; color:#E11D48; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Zero-Retention Pledge</div>
          <h2>Our Non-Negotiable Privacy Promise</h2>
          <div class="executive-title">Zero Data Mining &bull; Zero Third-Party Trackers &bull; Complete User Sovereignty</div>
          
          <div class="executive-quote">
            "Privacy is a fundamental human right. MomPDF is built on the principle that your documents belong strictly to you. We do not sell user data, we do not deploy invasive ad trackers, and we never read or monetize the contents of your files."
          </div>

          <div class="executive-actions">
            <a href="security.html" class="btn-linkedin-vip" style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              View Security Architecture
            </a>
            <a href="cookies.html" class="btn-email-vip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0 0 20"/></svg>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      <!-- Core Pillars -->
      <div class="section-head-center">
        <span class="section-tag">Core Principles</span>
        <h3 class="section-title">Built on 4 Unwavering Privacy Guarantees</h3>
        <p class="section-subtitle">Transparency and user control are at the core of everything we build.</p>
      </div>

      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FFE4E6; color:#E11D48;">🗑️</div>
          <h4>Automatic 15-Min Purge</h4>
          <p>Files are purged permanently from memory and disk within 15 minutes of upload. No lingering traces or orphaned files.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#ECFDF5; color:#059669;">🚫</div>
          <h4>Zero Ad Trackers</h4>
          <p>We do not embed third-party advertising cookies, Facebook pixels, or Google remarketing scripts to track your behavior.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#EFF6FF; color:#2563EB;">🤖</div>
          <h4>No AI Model Training</h4>
          <p>Even our AI Summarizer runs in isolated stateless execution windows with zero memory retention or corpus feeding.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FAF5FF; color:#9333EA;">⚖️</div>
          <h4>GDPR &amp; CCPA Rights</h4>
          <p>Full support for access, rectification, portability, and automated erasure rights worldwide.</p>
        </div>
      </div>

      <!-- High-Impact Dark Metric Bar -->
      <div class="metrics-bar-dark">
        <div>
          <div class="metric-number-glow">0</div>
          <div class="metric-label-muted">Third-Party Ad Pixels</div>
        </div>
        <div>
          <div class="metric-number-glow">15 min</div>
          <div class="metric-label-muted">Automatic File Shredding</div>
        </div>
        <div>
          <div class="metric-number-glow">100%</div>
          <div class="metric-label-muted">User Data Sovereignty</div>
        </div>
        <div>
          <div class="metric-number-glow">0</div>
          <div class="metric-label-muted">Data Sold to Advertisers</div>
        </div>
      </div>

      <!-- Privacy Articles Cards -->
      <div class="section-head-center">
        <span class="section-tag">Privacy Policy Sections</span>
        <h3 class="section-title">Complete Policy Details &amp; Disclosures</h3>
      </div>

      <div class="legal-card">
        <h3>1. Information We Collect</h3>
        <p>MomPDF collects minimal diagnostic data strictly required to deliver our service. When you upload a file, we process the document in memory for the duration of the selected operation. We do not require account registration or credit card details to use our core 30+ PDF tools.</p>
        <div class="legal-highlight-box">
          Key Takeaway: We never record, inspect, or retain the internal content, personal names, financial figures, or text inside your uploaded documents.
        </div>
      </div>

      <div class="legal-card">
        <h3>2. How We Process and Shred Your Documents</h3>
        <p>All file uploads are transmitted over encrypted TLS 1.3 connections to our sandboxed conversion workers. Once processing concludes:</p>
        <ul>
          <li>A temporary, randomized download token is generated.</li>
          <li>Your processed file is made available exclusively to your browser session.</li>
          <li>An automated cryptographic purge daemon shreds all associated temporary files within 15 minutes.</li>
        </ul>
      </div>

      <div class="legal-card">
        <h3>3. Third-Party Sharing and Advertising</h3>
        <p>MomPDF operates on an ad-free, privacy-first business model. We do not sell, rent, trade, or share your personal data or document content with advertisers, data brokers, or commercial marketing partners under any circumstances.</p>
      </div>

      <div class="legal-card">
        <h3>4. Your Rights Under GDPR, CCPA &amp; International Law</h3>
        <p>Regardless of your geographic location, MomPDF honors global privacy principles:</p>
        <ul>
          <li><strong>Right to Erasure:</strong> All files are purged automatically within 15 minutes without requiring manual intervention.</li>
          <li><strong>Right to Know:</strong> This privacy document fully details our zero-retention data practices.</li>
          <li><strong>Right to Non-Discrimination:</strong> Free access to all core PDF utilities without sacrificing privacy.</li>
        </ul>
      </div>

      <!-- Privacy FAQ -->
      <div class="section-head-center" style="margin-top:50px;">
        <span class="section-tag">Privacy FAQ</span>
        <h3 class="section-title">Common Privacy Questions</h3>
      </div>

      <div class="faq-grid">
        <div class="faq-card">
          <h4>📁 Do you keep backup copies of uploaded files?</h4>
          <p>No. Temporary processing storage is completely excluded from server snapshots and backup routines. When a file is purged at 15 minutes, it is gone permanently.</p>
        </div>
        <div class="faq-card">
          <h4>🌍 Where are MomPDF processing servers located?</h4>
          <p>Our server infrastructure operates in top-tier, SOC2-certified cloud data centers with encrypted edge routing globally to ensure low latency and strict data isolation.</p>
        </div>
      </div>

      <!-- Call to Action Banner -->
      <div class="about-cta-banner">
        <h3>Have specific privacy or compliance questions?</h3>
        <p>Reach out directly to our leadership and data protection team for custom enterprise privacy agreements.</p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="contact.html" class="btn btn-primary btn-lg">Contact Data Protection Officer</a>
          <a href="index.html" class="btn btn-secondary btn-lg">Explore Tools &rarr;</a>
        </div>
      </div>
`;

// ==========================================
// 3. TERMS.HTML
// ==========================================
const termsContent = `
      <!-- Spotlight Card -->
      <div class="executive-card">
        <div class="founder-media">
          <div class="founder-avatar-luxury" style="background: linear-gradient(135deg, #4338CA 0%, #312E81 100%);">
            ⚖️
            <div class="verified-badge" title="Fair Terms">✓</div>
          </div>
          <div class="founder-status">Transparent Agreement</div>
        </div>

        <div class="executive-content">
          <div style="display:inline-block; padding:3px 10px; background:#FFE4E6; color:#E11D48; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Legal Terms</div>
          <h2>Fair, Clear &amp; User-First Terms of Service</h2>
          <div class="executive-title">100% User Intellectual Property Ownership &bull; 99.9% Uptime Commitment</div>
          
          <div class="executive-quote">
            "We believe terms of service should protect the user, not trick them into surrendering copyright or enduring hidden subscription traps. You retain 100% ownership over your files, and we guarantee enterprise-grade platform availability."
          </div>

          <div class="executive-actions">
            <a href="privacy.html" class="btn-linkedin-vip" style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Privacy Policy
            </a>
            <a href="security.html" class="btn-email-vip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Security Policy
            </a>
          </div>
        </div>
      </div>

      <!-- Core Pillars -->
      <div class="section-head-center">
        <span class="section-tag">Key Principles</span>
        <h3 class="section-title">4 Core Guarantees of our Service</h3>
        <p class="section-subtitle">Clear terms that respect your intellectual property and outline responsible usage.</p>
      </div>

      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FFE4E6; color:#E11D48;">📄</div>
          <h4>100% Your Copyright</h4>
          <p>You retain full and exclusive intellectual property rights over all files, text, images, and documents processed on MomPDF.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#ECFDF5; color:#059669;">⚡</div>
          <h4>High-Availability SLA</h4>
          <p>We target 99.9% uptime across all 30 tools with redundant, load-balanced global edge infrastructure.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#EFF6FF; color:#2563EB;">🛡️</div>
          <h4>Fair &amp; Open Access</h4>
          <p>Core PDF operations are free for all users worldwide without forced memberships or aggressive paywalls.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FAF5FF; color:#9333EA;">⚖️</div>
          <h4>Responsible Use</h4>
          <p>Platform security measures strictly prohibit malicious software distribution, unauthorized access attempts, or unlawful content.</p>
        </div>
      </div>

      <!-- High-Impact Dark Metric Bar -->
      <div class="metrics-bar-dark">
        <div>
          <div class="metric-number-glow">100%</div>
          <div class="metric-label-muted">User Copyright Retained</div>
        </div>
        <div>
          <div class="metric-number-glow">99.9%</div>
          <div class="metric-label-muted">Uptime Target SLA</div>
        </div>
        <div>
          <div class="metric-number-glow">30+</div>
          <div class="metric-label-muted">Tools Covered Under Terms</div>
        </div>
        <div>
          <div class="metric-number-glow">24/7</div>
          <div class="metric-label-muted">Platform Monitoring</div>
        </div>
      </div>

      <!-- Terms Sections Cards -->
      <div class="section-head-center">
        <span class="section-tag">Terms Sections</span>
        <h3 class="section-title">Detailed Terms of Service</h3>
      </div>

      <div class="legal-card">
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using MomPDF (mompdf.com) and associated APIs, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
      </div>

      <div class="legal-card">
        <h3>2. Intellectual Property &amp; Document Ownership</h3>
        <p>You retain full ownership and intellectual property rights to all files uploaded to MomPDF. We do not claim any copyright, license, or ownership over your content. Uploaded documents are processed ephemerally in RAM and purged automatically within 15 minutes.</p>
      </div>

      <div class="legal-card">
        <h3>3. Acceptable Use Policy</h3>
        <p>You agree not to use MomPDF for any unlawful purpose, including but not limited to:</p>
        <ul>
          <li>Uploading malware, trojans, or corrupted PDF exploit payloads.</li>
          <li>Attempting to reverse engineer, decompile, or disrupt server infrastructure.</li>
          <li>Processing materials that violate copyright or applicable intellectual property laws.</li>
        </ul>
      </div>

      <div class="legal-card">
        <h3>4. Limitation of Liability</h3>
        <p>MomPDF provides its service on an "as-is" and "as-available" basis. While we maintain rigorous quality standards and in-memory error recovery, MomPDF shall not be liable for indirect, incidental, or consequential damages arising from document conversion errors or service downtime.</p>
      </div>

      <!-- Call to Action Banner -->
      <div class="about-cta-banner">
        <h3>Need custom enterprise agreements or custom SLAs?</h3>
        <p>Our sales and legal team can provide tailored enterprise contracts and dedicated infrastructure terms.</p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="contact.html" class="btn btn-primary btn-lg">Contact Enterprise Legal</a>
          <a href="index.html" class="btn btn-secondary btn-lg">Explore Tools &rarr;</a>
        </div>
      </div>
`;

// ==========================================
// 4. COOKIES.HTML
// ==========================================
const cookiesContent = `
      <!-- Spotlight Card -->
      <div class="executive-card">
        <div class="founder-media">
          <div class="founder-avatar-luxury" style="background: linear-gradient(135deg, #D97706 0%, #B45309 100%);">
            🍪
            <div class="verified-badge" title="No Ad Cookies">✓</div>
          </div>
          <div class="founder-status">Zero Ad-Trackers</div>
        </div>

        <div class="executive-content">
          <div style="display:inline-block; padding:3px 10px; background:#FFE4E6; color:#E11D48; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Cookie Policy</div>
          <h2>Minimal, Essential &amp; Transparent Storage</h2>
          <div class="executive-title">Zero Third-Party Ad Networks &bull; Session-Only Functional Tokens</div>
          
          <div class="executive-quote">
            "MomPDF does not use marketing pixels, behavioral remarketing cookies, or cross-site tracking tags. We utilize minimal local storage solely to remember your preferred UI language and dark mode settings."
          </div>

          <div class="executive-actions">
            <a href="privacy.html" class="btn-linkedin-vip" style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Privacy Policy
            </a>
            <a href="security.html" class="btn-email-vip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Security Policy
            </a>
          </div>
        </div>
      </div>

      <!-- Core Pillars -->
      <div class="section-head-center">
        <span class="section-tag">Storage Categories</span>
        <h3 class="section-title">How MomPDF Uses Browser Storage</h3>
        <p class="section-subtitle">We believe in absolute transparency regarding what gets stored in your browser.</p>
      </div>

      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FFE4E6; color:#E11D48;">🔑</div>
          <h4>Strictly Essential Only</h4>
          <p>Short-lived cryptographic session tokens required to connect your file upload to the download result.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#ECFDF5; color:#059669;">🌐</div>
          <h4>Language Preferences</h4>
          <p>Stores your active language selection (e.g. English, Español, Français, Hindi) in localStorage.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#EFF6FF; color:#2563EB;">🚫</div>
          <h4>Zero Ad Networks</h4>
          <p>No cookies from Facebook, Google Ads, TikTok, or third-party data aggregators.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FAF5FF; color:#9333EA;">🧹</div>
          <h4>Full User Control</h4>
          <p>You can clear your browser storage anytime without losing access to any of MomPDF's 30 tools.</p>
        </div>
      </div>

      <!-- High-Impact Dark Metric Bar -->
      <div class="metrics-bar-dark">
        <div>
          <div class="metric-number-glow">0</div>
          <div class="metric-label-muted">Third-Party Tracking Cookies</div>
        </div>
        <div>
          <div class="metric-number-glow">100%</div>
          <div class="metric-label-muted">Functional &amp; Essential</div>
        </div>
        <div>
          <div class="metric-number-glow">30</div>
          <div class="metric-label-muted">Saved Language Codes</div>
        </div>
        <div>
          <div class="metric-number-glow">0</div>
          <div class="metric-label-muted">Cross-Site Profiles Built</div>
        </div>
      </div>

      <!-- Cookie Details Cards -->
      <div class="legal-card">
        <h3>1. What is Local Storage &amp; Cookies?</h3>
        <p>Cookies and browser Local Storage are small text items saved by your web browser. They allow websites to remember user preferences across sessions. MomPDF minimizes storage to only what is strictly required for tool functionality.</p>
      </div>

      <div class="legal-card">
        <h3>2. Storage Items Used by MomPDF</h3>
        <ul>
          <li><strong>mompdf_lang:</strong> Remembers your chosen UI language (e.g. "en", "es", "hi", "fr").</li>
          <li><strong>mompdf_theme:</strong> Remembers your light/dark theme preference.</li>
          <li><strong>session_token:</strong> Ephemeral token to verify file download permissions during your active 15-minute window.</li>
        </ul>
      </div>

      <div class="legal-card">
        <h3>3. Managing and Disabling Cookies</h3>
        <p>You can adjust your browser settings to block or delete cookies at any time. MomPDF will continue to operate normally even if third-party cookies are blocked in your browser preferences.</p>
      </div>

      <!-- Call to Action Banner -->
      <div class="about-cta-banner">
        <h3>Have questions about our cookie or privacy policies?</h3>
        <p>We are always available to clarify our data practices and storage policies.</p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="privacy.html" class="btn btn-primary btn-lg">Read Privacy Policy</a>
          <a href="index.html" class="btn btn-secondary btn-lg">Explore Tools &rarr;</a>
        </div>
      </div>
`;

// ==========================================
// 5. BUSINESS.HTML
// ==========================================
const businessContent = `
      <!-- Spotlight Card -->
      <div class="executive-card">
        <div class="founder-media">
          <div class="founder-avatar-luxury" style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);">
            🏢
            <div class="verified-badge" title="Enterprise Grade">✓</div>
          </div>
          <div class="founder-status">Enterprise Ready</div>
        </div>

        <div class="executive-content">
          <div style="display:inline-block; padding:3px 10px; background:#FFE4E6; color:#E11D48; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Enterprise Solutions</div>
          <h2>High-Velocity Document Automation for Modern Teams</h2>
          <div class="executive-title">Batch Processing &bull; Dedicated Sandboxes &bull; 99.9% Uptime SLA &bull; REST API</div>
          
          <div class="executive-quote">
            "Enterprises waste thousands of engineering and administrative hours dealing with bloated, slow PDF software and per-seat licensing traps. MomPDF delivers bank-grade, in-memory automation that scales effortlessly from fast-growing startups to global corporations."
          </div>

          <div class="executive-actions">
            <a href="contact.html" class="btn-linkedin-vip" style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Talk to Enterprise Sales
            </a>
            <a href="pricing.html" class="btn-email-vip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              View Team Pricing
            </a>
          </div>
        </div>
      </div>

      <!-- Core Pillars -->
      <div class="section-head-center">
        <span class="section-tag">Enterprise Architecture</span>
        <h3 class="section-title">Engineered to Solve Workplace Document Bottlenecks</h3>
        <p class="section-subtitle">Powerful features tailored for finance, legal, real estate, healthcare, and engineering departments.</p>
      </div>

      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FFE4E6; color:#E11D48;">⚡</div>
          <h4>High-Volume Batch Processing</h4>
          <p>Merge, compress, and convert hundreds of contracts, statements, and invoices in seconds with multi-threaded execution.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#ECFDF5; color:#059669;">🔒</div>
          <h4>Air-Gapped Privacy Pipelines</h4>
          <p>Automated 15-minute file shredding, SOC2 Type II compliance, and zero AI training safeguard confidential company files.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#EFF6FF; color:#2563EB;">🔌</div>
          <h4>MomPDF REST API Integration</h4>
          <p>Seamlessly integrate document conversions, OCR, and compression directly into your CRM, ERP, and internal software stacks.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FAF5FF; color:#9333EA;">💰</div>
          <h4>Up to 80% Cost Savings</h4>
          <p>Eliminate expensive per-seat software licensing and replace disjointed PDF tools with one unified platform.</p>
        </div>
      </div>

      <!-- High-Impact Dark Metric Bar -->
      <div class="metrics-bar-dark">
        <div>
          <div class="metric-number-glow">10x</div>
          <div class="metric-label-muted">Faster Conversion Speed</div>
        </div>
        <div>
          <div class="metric-number-glow">85%</div>
          <div class="metric-label-muted">Average File Compression</div>
        </div>
        <div>
          <div class="metric-number-glow">99.9%</div>
          <div class="metric-label-muted">Guaranteed SLA Uptime</div>
        </div>
        <div>
          <div class="metric-number-glow">30+</div>
          <div class="metric-label-muted">Enterprise PDF Utilities</div>
        </div>
      </div>

      <!-- Industry Solutions -->
      <div class="section-head-center">
        <span class="section-tag">Industry Solutions</span>
        <h3 class="section-title">Tailored for High-Compliance Sectors</h3>
      </div>

      <div class="pillars-grid" style="margin-bottom: 70px;">
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#EFF6FF; color:#2563EB;">⚖️</div>
          <h4>Legal &amp; Compliance</h4>
          <p>Redact sensitive PII, compare revisions between contract versions, and sign documents with verifiable cryptographic stamps.</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#DCFCE7; color:#16A34A;">📊</div>
          <h4>Finance &amp; Accounting</h4>
          <p>Convert messy PDF bank statements into structured Excel XLSX spreadsheets, compress quarterly financial reports.</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FEF3C7; color:#D97706;">🏥</div>
          <h4>Healthcare &amp; Insurance</h4>
          <p>HIPAA-ready ephemeral document ingestion, automated claim document merging, and long-term ISO PDF/A archival.</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#F3E8FF; color:#7E22CE;">🏗️</div>
          <h4>Real Estate &amp; Construction</h4>
          <p>Merge architectural blueprints, add watermarks to property deeds, and batch sign closing disclosure agreements.</p>
        </div>
      </div>

      <!-- Business FAQ -->
      <div class="section-head-center">
        <span class="section-tag">Enterprise FAQ</span>
        <h3 class="section-title">Common Business Inquiries</h3>
      </div>

      <div class="faq-grid">
        <div class="faq-card">
          <h4>💼 Can we process confidential NDAs and proprietary files?</h4>
          <p>Yes. All files are isolated in memory sandboxes and shredded permanently within 15 minutes. We never store or mine enterprise documents.</p>
        </div>
        <div class="faq-card">
          <h4>🚀 Do you offer dedicated API keys and webhooks?</h4>
          <p>Yes. MomPDF provides high-performance REST APIs with high rate limits, custom webhook notifications, and SDK libraries.</p>
        </div>
      </div>

      <!-- Call to Action Banner -->
      <div class="about-cta-banner">
        <h3>Ready to scale document productivity across your organization?</h3>
        <p>Contact our leadership team for custom team plans, volume pricing, and dedicated sandbox onboarding.</p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="contact.html" class="btn btn-primary btn-lg">Request Enterprise Demo &rarr;</a>
          <a href="pricing.html" class="btn btn-secondary btn-lg">View Pricing Tiers</a>
        </div>
      </div>
`;

// ==========================================
// 6. EDUCATION.HTML
// ==========================================
const educationContent = `
      <!-- Spotlight Card -->
      <div class="executive-card">
        <div class="founder-media">
          <div class="founder-avatar-luxury" style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);">
            🎓
            <div class="verified-badge" title="Academic Verified">✓</div>
          </div>
          <div class="founder-status">Free for Academia</div>
        </div>

        <div class="executive-content">
          <div style="display:inline-block; padding:3px 10px; background:#FFE4E6; color:#E11D48; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Academic Productivity</div>
          <h2>Empowering Students, Teachers &amp; Researchers</h2>
          <div class="executive-title">Zero Paywalls &bull; Instant Research Summaries &bull; OCR Scanned Books &bull; 30 Languages</div>
          
          <div class="executive-quote">
            "Education should never be held back by expensive subscriptions or software paywalls. MomPDF provides students, teachers, and university researchers with free, high-speed tools to merge coursework, compress thesis papers, and OCR scanned library books."
          </div>

          <div class="executive-actions">
            <a href="index.html" class="btn-linkedin-vip" style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              Explore Academic Tools
            </a>
            <a href="pdf-summarize.html" class="btn-email-vip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              AI PDF Summarizer
            </a>
          </div>
        </div>
      </div>

      <!-- Core Pillars -->
      <div class="section-head-center">
        <span class="section-tag">Academic Suite</span>
        <h3 class="section-title">Built for Every Stage of the Academic Journey</h3>
        <p class="section-subtitle">From freshman homework to doctoral dissertations, MomPDF accelerates study workflows.</p>
      </div>

      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FFE4E6; color:#E11D48;">📚</div>
          <h4>Thesis &amp; Assignment Compression</h4>
          <p>Compress heavy lecture slide decks, lab reports, and dissertations to easily meet Canvas and Blackboard LMS upload limits.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#ECFDF5; color:#059669;">🔍</div>
          <h4>OCR for Library Scans</h4>
          <p>Convert non-searchable textbook scans, photocopied journal articles, and study notes into editable, searchable text.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#EFF6FF; color:#2563EB;">🤖</div>
          <h4>AI Research Summarizer</h4>
          <p>Condense 60-page scholarly papers into concise executive highlights and key takeaway points in seconds.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FAF5FF; color:#9333EA;">🌐</div>
          <h4>30 Global Languages</h4>
          <p>Translate foreign research papers and collaborate with global study partners in 30 native interface languages.</p>
        </div>
      </div>

      <!-- Semester Workflow -->
      <div class="roadmap-section">
        <div style="text-align:center; max-width:600px; margin:0 auto 20px;">
          <span class="section-tag">Workflow</span>
          <h3 class="section-title" style="font-size:24px;">How MomPDF Accelerates Semester Workflows</h3>
          <p class="section-subtitle">A simple end-to-end pipeline for university coursework.</p>
        </div>

        <div class="timeline-list">
          <div class="timeline-item">
            <span class="timeline-num">Phase 01</span>
            <h5>Research &amp; OCR</h5>
            <p>Scan library book pages, run OCR to extract quotes, and convert reference tables to Excel.</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-num">Phase 02</span>
            <h5>Drafting &amp; Merging</h5>
            <p>Combine group project chapters, format page numbers, and insert academic cover pages.</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-num">Phase 03</span>
            <h5>AI Revision</h5>
            <p>Use the AI Summarizer to generate abstract drafts and compare revisions across project drafts.</p>
          </div>
          <div class="timeline-item">
            <span class="timeline-num">Phase 04</span>
            <h5>Final Submission</h5>
            <p>Compress below portal file size limits and convert to PDF/A for permanent university archive.</p>
          </div>
        </div>
      </div>

      <!-- High-Impact Dark Metric Bar -->
      <div class="metrics-bar-dark">
        <div>
          <div class="metric-number-glow">100%</div>
          <div class="metric-label-muted">Free for Students &amp; Teachers</div>
        </div>
        <div>
          <div class="metric-number-glow">30+</div>
          <div class="metric-label-muted">Academic Tools Included</div>
        </div>
        <div>
          <div class="metric-number-glow">&lt; 1.2s</div>
          <div class="metric-label-muted">Average Conversion Latency</div>
        </div>
        <div>
          <div class="metric-number-glow">30</div>
          <div class="metric-label-muted">Global Languages Supported</div>
        </div>
      </div>

      <!-- Call to Action Banner -->
      <div class="about-cta-banner">
        <h3>Ready to level up your academic productivity?</h3>
        <p>No account required. Open any of our 30+ tools and start converting your coursework instantly.</p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="index.html" class="btn btn-primary btn-lg">Start Free Homework Tools &rarr;</a>
          <a href="ocr-pdf.html" class="btn btn-secondary btn-lg">Try OCR Scanner</a>
        </div>
      </div>
`;

// ==========================================
// 7. FEATURES.HTML
// ==========================================
const featuresContent = `
      <!-- Spotlight Card -->
      <div class="executive-card">
        <div class="founder-media">
          <div class="founder-avatar-luxury" style="background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);">
            ⚡
            <div class="verified-badge" title="Full Suite Ready">✓</div>
          </div>
          <div class="founder-status">30+ Tools In One</div>
        </div>

        <div class="executive-content">
          <div style="display:inline-block; padding:3px 10px; background:#FFE4E6; color:#E11D48; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Feature Matrix</div>
          <h2>The Web's Most Powerful PDF Productivity Suite</h2>
          <div class="executive-title">In-Memory Engine &bull; Sub-Second Latency &bull; AI Summaries &bull; ISO PDF/A Archival</div>
          
          <div class="executive-quote">
            "We engineered MomPDF to replace clunky desktop software and fragmented online utilities. With over 30 specialized tools spanning organization, conversion, OCR, redaction, and AI intelligence, you have every document capability at your fingertips."
          </div>

          <div class="executive-actions">
            <a href="index.html" class="btn-linkedin-vip" style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              View All 30 Tools
            </a>
            <a href="pricing.html" class="btn-email-vip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              View Pricing Plans
            </a>
          </div>
        </div>
      </div>

      <!-- Core Pillars -->
      <div class="section-head-center">
        <span class="section-tag">Core Categories</span>
        <h3 class="section-title">4 Comprehensive Feature Categories</h3>
        <p class="section-subtitle">Everything you need to organize, transform, secure, and understand PDF files.</p>
      </div>

      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FFE4E6; color:#E11D48;">📑</div>
          <h4>Organize &amp; Edit</h4>
          <p>Merge multiple PDFs, split ranges, extract pages, rotate orientations, crop margins, and reorder document page sequences.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#EFF6FF; color:#2563EB;">🔄</div>
          <h4>Universal Conversions</h4>
          <p>Convert Word, Excel, PowerPoint, JPG, PNG, and HTML to PDF &bull; and extract PDF to editable DOCX, XLSX, and high-res JPGs.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#ECFDF5; color:#059669;">🚀</div>
          <h4>Optimize &amp; Repair</h4>
          <p>Compress file sizes by up to 85%, fix corrupted byte streams with Repair PDF, and run Optical Character Recognition (OCR).</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FAF5FF; color:#9333EA;">🤖</div>
          <h4>Security &amp; AI Intelligence</h4>
          <p>Password protect, unlock, digitally sign, redact confidential data, compare versions, and generate AI document summaries.</p>
        </div>
      </div>

      <!-- High-Impact Dark Metric Bar -->
      <div class="metrics-bar-dark">
        <div>
          <div class="metric-number-glow">30+</div>
          <div class="metric-label-muted">Specialized Tools</div>
        </div>
        <div>
          <div class="metric-number-glow">100%</div>
          <div class="metric-label-muted">In-Memory Execution</div>
        </div>
        <div>
          <div class="metric-number-glow">30</div>
          <div class="metric-label-muted">Native Languages</div>
        </div>
        <div>
          <div class="metric-number-glow">15 min</div>
          <div class="metric-label-muted">Auto Cryptographic Shred</div>
        </div>
      </div>

      <!-- Feature Capability Table -->
      <div class="section-head-center">
        <span class="section-tag">Capability Matrix</span>
        <h3 class="section-title">Complete Tool &amp; Format Specifications</h3>
      </div>

      <div class="table-container">
        <table class="feature-table">
          <thead>
            <tr>
              <th>Tool Name</th>
              <th>Supported Inputs</th>
              <th>Output Format</th>
              <th>Processing Engine</th>
              <th>Security Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Merge PDF</strong></td>
              <td>PDF, Multiple Files</td>
              <td>Single Merged PDF</td>
              <td>In-Memory Vector Pipeline</td>
              <td><span style="color:#059669; font-weight:700;">15-Min Auto Shred</span></td>
            </tr>
            <tr>
              <td><strong>Compress PDF</strong></td>
              <td>PDF (Up to 100MB)</td>
              <td>Optimized PDF</td>
              <td>Stream Optimization</td>
              <td><span style="color:#059669; font-weight:700;">15-Min Auto Shred</span></td>
            </tr>
            <tr>
              <td><strong>PDF to Word</strong></td>
              <td>PDF Document</td>
              <td>Microsoft Word DOCX</td>
              <td>Structural Parser Engine</td>
              <td><span style="color:#059669; font-weight:700;">15-Min Auto Shred</span></td>
            </tr>
            <tr>
              <td><strong>PDF to Excel</strong></td>
              <td>PDF with Tables</td>
              <td>Microsoft Excel XLSX</td>
              <td>Tabular Grid Extractor</td>
              <td><span style="color:#059669; font-weight:700;">15-Min Auto Shred</span></td>
            </tr>
            <tr>
              <td><strong>OCR PDF</strong></td>
              <td>Scanned PDFs, Images</td>
              <td>Searchable PDF</td>
              <td>Optical Recognition Core</td>
              <td><span style="color:#059669; font-weight:700;">15-Min Auto Shred</span></td>
            </tr>
            <tr>
              <td><strong>AI Summarizer</strong></td>
              <td>PDF Reports, Papers</td>
              <td>Executive Summary JSON/TXT</td>
              <td>MomPDF Intelligence Engine</td>
              <td><span style="color:#059669; font-weight:700;">Zero Model Retention</span></td>
            </tr>
            <tr>
              <td><strong>PDF to PDF/A</strong></td>
              <td>Standard PDF</td>
              <td>ISO 19005-1 Compliant PDF/A</td>
              <td>Archival Compliance Core</td>
              <td><span style="color:#059669; font-weight:700;">15-Min Auto Shred</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Call to Action Banner -->
      <div class="about-cta-banner">
        <h3>Ready to experience the entire MomPDF suite?</h3>
        <p>Select any tool and start processing your files with sub-second performance.</p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="index.html" class="btn btn-primary btn-lg">Explore All PDF Tools &rarr;</a>
          <a href="pricing.html" class="btn btn-secondary btn-lg">View Plans</a>
        </div>
      </div>
`;

// ==========================================
// 8. PRICING.HTML
// ==========================================
const pricingContent = `
      <!-- Spotlight Card -->
      <div class="executive-card">
        <div class="founder-media">
          <div class="founder-avatar-luxury" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%);">
            💳
            <div class="verified-badge" title="No Hidden Fees">✓</div>
          </div>
          <div class="founder-status">Honest &amp; Transparent</div>
        </div>

        <div class="executive-content">
          <div style="display:inline-block; padding:3px 10px; background:#FFE4E6; color:#E11D48; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Transparent Pricing</div>
          <h2>Simple, Transparent &amp; Predictable Plans</h2>
          <div class="executive-title">Free Forever for Everyone &bull; High-Performance Pro &amp; Enterprise Tiers</div>
          
          <div class="executive-quote">
            "We founded MomPDF on the belief that everyday document productivity should never be paywalled. Core tools remain 100% free forever for all users globally, with optional Pro and Team tiers for power users requiring high-volume batch processing and dedicated API limits."
          </div>

          <div class="executive-actions">
            <a href="index.html" class="btn-linkedin-vip" style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Start Free (No Card Needed)
            </a>
            <a href="contact.html" class="btn-email-vip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Contact Sales
            </a>
          </div>
        </div>
      </div>

      <!-- Pricing Plans Grid -->
      <div class="section-head-center">
        <span class="section-tag">Choose Your Plan</span>
        <h3 class="section-title">Pick the Perfect Tier for Your Workflow</h3>
        <p class="section-subtitle">No long-term contracts. Cancel or switch plans anytime with one click.</p>
      </div>

      <div class="pricing-grid">
        <!-- Free Plan -->
        <div class="pricing-card">
          <div class="pricing-plan-name">Free Forever</div>
          <div class="pricing-plan-desc">Ideal for students, freelancers, and everyday document tasks.</div>
          <div class="price-tag">$0 <span>/ month</span></div>
          <ul class="pricing-features-list">
            <li><span class="pricing-check">✓</span> Access to all 30 PDF tools</li>
            <li><span class="pricing-check">✓</span> Up to 100MB file upload size</li>
            <li><span class="pricing-check">✓</span> Automated 15-minute file shredding</li>
            <li><span class="pricing-check">✓</span> 30 native interface languages</li>
            <li><span class="pricing-check">✓</span> Standard in-memory processing queue</li>
          </ul>
          <a href="index.html" class="btn btn-secondary" style="width:100%; text-align:center; padding:12px 0;">Use Free (No Signup)</a>
        </div>

        <!-- Pro Plan (Featured) -->
        <div class="pricing-card featured">
          <div class="pricing-plan-name">Pro Power User</div>
          <div class="pricing-plan-desc">Built for professionals and power users with high-volume workflows.</div>
          <div class="price-tag" style="color:#E11D48;">$6 <span>/ month</span></div>
          <ul class="pricing-features-list">
            <li><span class="pricing-check">✓</span> <strong>Everything in Free</strong></li>
            <li><span class="pricing-check">✓</span> Unlimited batch uploads (up to 50 files)</li>
            <li><span class="pricing-check">✓</span> Increased 500MB file size limits</li>
            <li><span class="pricing-check">✓</span> Priority high-speed CPU worker queue</li>
            <li><span class="pricing-check">✓</span> Advanced OCR &amp; AI Summarizer quotas</li>
            <li><span class="pricing-check">✓</span> 100% ad-free priority dashboard</li>
          </ul>
          <a href="register.html" class="btn btn-primary" style="width:100%; text-align:center; padding:12px 0;">Upgrade to Pro</a>
        </div>

        <!-- Enterprise Plan -->
        <div class="pricing-card">
          <div class="pricing-plan-name">Enterprise &amp; Teams</div>
          <div class="pricing-plan-desc">For organizations requiring custom compliance, SLAs, and API access.</div>
          <div class="price-tag">$19 <span>/ user / mo</span></div>
          <ul class="pricing-features-list">
            <li><span class="pricing-check">✓</span> <strong>Everything in Pro</strong></li>
            <li><span class="pricing-check">✓</span> Dedicated air-gapped security sandbox</li>
            <li><span class="pricing-check">✓</span> MomPDF REST API with custom rate limits</li>
            <li><span class="pricing-check">✓</span> SSO (Single Sign-On) &amp; SAML 2.0</li>
            <li><span class="pricing-check">✓</span> 99.9% Uptime Service Level Agreement</li>
            <li><span class="pricing-check">✓</span> Dedicated account manager &amp; 24/7 support</li>
          </ul>
          <a href="contact.html" class="btn btn-secondary" style="width:100%; text-align:center; padding:12px 0;">Contact Sales</a>
        </div>
      </div>

      <!-- High-Impact Dark Metric Bar -->
      <div class="metrics-bar-dark">
        <div>
          <div class="metric-number-glow">$0</div>
          <div class="metric-label-muted">Free Forever Tier</div>
        </div>
        <div>
          <div class="metric-number-glow">500MB</div>
          <div class="metric-label-muted">Pro File Size Limit</div>
        </div>
        <div>
          <div class="metric-number-glow">99.9%</div>
          <div class="metric-label-muted">Enterprise SLA Uptime</div>
        </div>
        <div>
          <div class="metric-number-glow">24/7</div>
          <div class="metric-label-muted">Global Support Response</div>
        </div>
      </div>

      <!-- Pricing FAQ -->
      <div class="section-head-center">
        <span class="section-tag">Pricing FAQ</span>
        <h3 class="section-title">Frequently Asked Questions About Billing</h3>
      </div>

      <div class="faq-grid">
        <div class="faq-card">
          <h4>🆓 Are all 30 tools really available for free?</h4>
          <p>Yes. MomPDF provides access to Merge, Split, Compress, OCR, AI Summarizer, and all other tools at zero cost with standard quotas.</p>
        </div>
        <div class="faq-card">
          <h4>🔄 Can I cancel my Pro subscription at any time?</h4>
          <p>Yes. You can cancel your subscription with a single click from your account settings. You will retain access until the end of your billing period.</p>
        </div>
        <div class="faq-card">
          <h4>💳 What payment methods do you accept?</h4>
          <p>We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank wire transfers for enterprise invoices.</p>
        </div>
        <div class="faq-card">
          <h4>🎓 Do you offer student or non-profit discounts?</h4>
          <p>Yes. We offer special educational and non-profit organization pricing. Contact our support team with your institutional email for details.</p>
        </div>
      </div>

      <!-- Call to Action Banner -->
      <div class="about-cta-banner">
        <h3>Ready to experience frictionless PDF productivity?</h3>
        <p>No credit card required to get started. Choose your plan or use our free tools immediately.</p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="index.html" class="btn btn-primary btn-lg">Start Free Now &rarr;</a>
          <a href="register.html" class="btn btn-secondary btn-lg">Create Pro Account</a>
        </div>
      </div>
`;

// ==========================================
// 9. FAQ.HTML
// ==========================================
const faqContent = `
      <!-- Spotlight Card -->
      <div class="executive-card">
        <div class="founder-media">
          <div class="founder-avatar-luxury" style="background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);">
            ❓
            <div class="verified-badge" title="Knowledge Base">✓</div>
          </div>
          <div class="founder-status">24/7 Knowledge Center</div>
        </div>

        <div class="executive-content">
          <div style="display:inline-block; padding:3px 10px; background:#FFE4E6; color:#E11D48; border-radius:999px; font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Knowledge Base</div>
          <h2>Frequently Asked Questions &amp; Support Center</h2>
          <div class="executive-title">Comprehensive Guide &bull; Security &bull; Formatting &bull; Billing &bull; API</div>
          
          <div class="executive-quote">
            "Have questions about how our 15-minute file shredding works, how to preserve complex Excel tables, or how to integrate MomPDF into your enterprise workflow? Our comprehensive knowledge base has clear, direct answers."
          </div>

          <div class="executive-actions">
            <a href="contact.html" class="btn-linkedin-vip" style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Contact Support Team
            </a>
            <a href="index.html" class="btn-email-vip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Browse All Tools
            </a>
          </div>
        </div>
      </div>

      <!-- Core Pillars -->
      <div class="section-head-center">
        <span class="section-tag">FAQ Categories</span>
        <h3 class="section-title">Answers by Category</h3>
        <p class="section-subtitle">Quickly find the information you need across our key topics.</p>
      </div>

      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FFE4E6; color:#E11D48;">🔒</div>
          <h4>Security &amp; Privacy</h4>
          <p>Learn how our 15-minute auto-shredding, zero-log policies, and TLS 1.3 encryption protect your documents.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#EFF6FF; color:#2563EB;">🛠️</div>
          <h4>Tools &amp; Formats</h4>
          <p>Details on Word, Excel, PowerPoint, JPG conversions, OCR accuracy, and ISO PDF/A compliance.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#ECFDF5; color:#059669;">💳</div>
          <h4>Pricing &amp; Limits</h4>
          <p>Understand file size allowances, free usage terms, Pro subscription benefits, and enterprise volume licensing.</p>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box" style="background:#FAF5FF; color:#9333EA;">🔌</div>
          <h4>API &amp; Integration</h4>
          <p>Information on REST endpoints, API authentication, webhooks, rate limits, and custom sandbox deployments.</p>
        </div>
      </div>

      <!-- High-Impact Dark Metric Bar -->
      <div class="metrics-bar-dark">
        <div>
          <div class="metric-number-glow">30+</div>
          <div class="metric-label-muted">Common Questions Answered</div>
        </div>
        <div>
          <div class="metric-number-glow">&lt; 1.2s</div>
          <div class="metric-label-muted">Average Conversion Latency</div>
        </div>
        <div>
          <div class="metric-number-glow">15 min</div>
          <div class="metric-label-muted">Automated Document Purge</div>
        </div>
        <div>
          <div class="metric-number-glow">100%</div>
          <div class="metric-label-muted">Privacy Guarantee</div>
        </div>
      </div>

      <!-- General Questions Grid -->
      <div class="section-head-center">
        <span class="section-tag">General Questions</span>
        <h3 class="section-title">General &amp; Platform Basics</h3>
      </div>

      <div class="faq-grid">
        <div class="faq-card">
          <h4>🌟 What is MomPDF?</h4>
          <p>MomPDF is a high-speed, privacy-first online document suite offering 30+ specialized tools to merge, split, compress, convert, edit, OCR, sign, and summarize PDF files without software installation.</p>
        </div>
        <div class="faq-card">
          <h4>💻 Do I need to install any desktop software?</h4>
          <p>No. MomPDF runs entirely in your web browser on desktop, mobile, and tablet devices across Windows, macOS, Linux, iOS, and Android.</p>
        </div>
        <div class="faq-card">
          <h4>⚡ What is the maximum file size limit for free users?</h4>
          <p>Free users can upload files up to 100MB each. Pro users receive expanded limits up to 500MB per file with multi-file batch processing.</p>
        </div>
        <div class="faq-card">
          <h4>🌐 How many languages does MomPDF support?</h4>
          <p>MomPDF natively supports 30 global languages including English, Spanish, French, German, Hindi, Arabic, Chinese, Japanese, and Portuguese with bidirectional RTL layout support.</p>
        </div>
      </div>

      <!-- Security Questions Grid -->
      <div class="section-head-center" style="margin-top:50px;">
        <span class="section-tag">Security &amp; Privacy</span>
        <h3 class="section-title">Document Safety &amp; Retention</h3>
      </div>

      <div class="faq-grid">
        <div class="faq-card">
          <h4>🛡️ How long do you keep my uploaded files?</h4>
          <p>Files are permanently and cryptographically shredded within 15 minutes of upload. We maintain zero long-term storage or document repositories.</p>
        </div>
        <div class="faq-card">
          <h4>🤖 Do you use my files to train AI models?</h4>
          <p>Never. Your documents are never indexed, read by humans, or used to train artificial intelligence or machine learning models.</p>
        </div>
        <div class="faq-card">
          <h4>🔒 Is my connection to MomPDF encrypted?</h4>
          <p>Yes. All traffic between your browser and our servers is secured using TLS 1.3 encryption with 256-bit AES encryption standards.</p>
        </div>
        <div class="faq-card">
          <h4>⚖️ Is MomPDF compliant with GDPR and CCPA?</h4>
          <p>Yes. We strictly adhere to GDPR, CCPA, and global privacy standards with automated Right to Erasure implemented on all uploaded files.</p>
        </div>
      </div>

      <!-- Conversion Questions Grid -->
      <div class="section-head-center" style="margin-top:50px;">
        <span class="section-tag">Conversions &amp; Features</span>
        <h3 class="section-title">Conversion Quality &amp; Tools</h3>
      </div>

      <div class="faq-grid">
        <div class="faq-card">
          <h4>📄 Does PDF to Word preserve my layout and fonts?</h4>
          <p>Yes. Our conversion engine analyzes typography, paragraphs, tables, and images to generate cleanly formatted, editable Microsoft Word DOCX files.</p>
        </div>
        <div class="faq-card">
          <h4>🔍 How does Optical Character Recognition (OCR) work?</h4>
          <p>Our OCR engine scans image-based or scanned PDFs to recognize printed characters and embeds a searchable text layer directly into your PDF.</p>
        </div>
        <div class="faq-card">
          <h4>📊 Can I extract tables from PDF into Excel?</h4>
          <p>Yes. The PDF to Excel tool identifies table borders, headers, and cell values, converting them into structured Microsoft Excel XLSX spreadsheets.</p>
        </div>
        <div class="faq-card">
          <h4>🏛️ What is ISO PDF/A conversion?</h4>
          <p>PDF/A is an ISO-standardized version of PDF specialized for digital preservation, ensuring documents can be faithfully reproduced decades into the future.</p>
        </div>
      </div>

      <!-- Call to Action Banner -->
      <div class="about-cta-banner">
        <h3>Still have questions or need technical support?</h3>
        <p>Our support team is ready to assist you with any questions, bug reports, or feature requests.</p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="contact.html" class="btn btn-primary btn-lg">Contact Support Team &rarr;</a>
          <a href="index.html" class="btn btn-secondary btn-lg">Explore All PDF Tools</a>
        </div>
      </div>
`;

// ==========================================
// LIST OF ALL 9 PAGES TO BUILD
// ==========================================
const pages = [
  {
    filename: 'security.html',
    title: 'Security &amp; Cryptographic Architecture — MomPDF',
    description: "Explore MomPDF's bank-grade security infrastructure. In-memory RAM sandboxing, TLS 1.3 encryption, zero AI model training, and automated 15-minute file shredding.",
    heroBadge: 'Security Architecture',
    heroTitle: 'Bank-Grade Cryptographic Architecture &amp; Data Protection',
    heroSubtitle: 'Engineered with zero-retention memory sandboxing, TLS 1.3 cryptographic transport, automated 15-minute file shredding, and full global compliance.',
    heroTrustChips: ['🔒 100% In-Memory RAM Sandboxing', '⚡ Automated 15-Min File Shredding', '🛡️ Zero AI Model Training', '📜 SOC2 Type II &amp; GDPR Compliant'],
    mainContent: securityContent
  },
  {
    filename: 'privacy.html',
    title: 'Privacy Policy &amp; Zero-Retention Pledge — MomPDF',
    description: 'MomPDF Privacy Policy. Strict zero-knowledge document processing, zero third-party ad trackers, GDPR & CCPA compliance, and automated 15-minute file shredding.',
    heroBadge: 'Privacy Policy',
    heroTitle: 'Privacy by Design &amp; Zero-Retention Policy',
    heroSubtitle: 'We believe your documents belong exclusively to you. Our platform is architected so we cannot read, monetize, or retain your private files.',
    heroTrustChips: ['🛡️ Zero Data Retention', '🚫 No Third-Party Ad Trackers', '🇪🇺 GDPR &amp; CCPA Compliant', '🗑️ Auto-Purge in 15 Minutes'],
    mainContent: privacyContent
  },
  {
    filename: 'terms.html',
    title: 'Terms &amp; Conditions of Service — MomPDF',
    description: 'MomPDF Terms of Service. Clear, fair, and transparent guidelines governing your use of MomPDF tools, APIs, and document processing utilities.',
    heroBadge: 'Terms of Service',
    heroTitle: 'Terms &amp; Conditions of Service',
    heroSubtitle: 'Clear, fair, and transparent guidelines governing your use of MomPDF tools, APIs, and online document processing services.',
    heroTrustChips: ['⚖️ Transparent Terms', '📄 100% User Ownership', '🛡️ Fair Use Policy', '⚡ 99.9% Uptime Commitment'],
    mainContent: termsContent
  },
  {
    filename: 'cookies.html',
    title: 'Cookie &amp; Local Storage Policy — MomPDF',
    description: 'Learn how MomPDF utilizes minimal local storage and essential session tokens with zero third-party tracking or advertising cookies.',
    heroBadge: 'Cookie Policy',
    heroTitle: 'Cookie &amp; Local Storage Policy',
    heroSubtitle: 'Transparent information about how MomPDF utilizes minimal local storage and essential session tokens to deliver lightning-fast PDF tools.',
    heroTrustChips: ['🍪 Zero Tracking Cookies', '⚡ Session-Only Tokens', '🔒 Local Storage for Preferences', '🚫 No Third-Party Ad Networks'],
    mainContent: cookiesContent
  },
  {
    filename: 'business.html',
    title: 'MomPDF for Business &amp; Enterprise — Secure Document Workflows',
    description: 'MomPDF Enterprise Hub. Secure document workflows, batch invoice processing, contract signing, high-density compression, and automated redaction. Bank-grade security with 99.9% uptime SLA.',
    heroBadge: 'MomPDF for Business',
    heroTitle: 'MomPDF for Business &amp; Enterprise',
    heroSubtitle: 'Streamline organizational document workflows with high-density batch processing, dedicated security sandboxes, enterprise SLAs, and automated invoice tooling.',
    heroTrustChips: ['🏢 Batch Document Pipelines', '🔒 Bank-Grade RAM Isolation', '⚡ 99.9% Uptime SLA', '🤝 Team Workspace Ready'],
    mainContent: businessContent
  },
  {
    filename: 'education.html',
    title: 'MomPDF for Education &amp; Academia — Student &amp; Research Tools',
    description: 'Free, high-speed PDF tools for students, teachers, and university researchers. Compress thesis papers, OCR scanned library books, and summarize research.',
    heroBadge: 'MomPDF for Education',
    heroTitle: 'MomPDF for Education &amp; Academia',
    heroSubtitle: 'Empowering students, researchers, teachers, and university faculties worldwide with fast, free, and accessible PDF productivity tools.',
    heroTrustChips: ['🎓 100% Free for Students', '📚 Thesis &amp; Research Formatting', '📝 OCR Handwritten Notes', '🌐 30 Native Languages'],
    mainContent: educationContent
  },
  {
    filename: 'features.html',
    title: 'Features &amp; Capability Matrix — MomPDF',
    description: 'Explore all 30+ cutting-edge PDF tools engineered to organize, convert, edit, optimize, secure, and summarize documents with sub-second performance.',
    heroBadge: 'Platform Features',
    heroTitle: 'Complete Features &amp; Capability Matrix',
    heroSubtitle: 'Explore all 30+ cutting-edge tools engineered to organize, convert, edit, secure, and summarize PDF documents with sub-second performance.',
    heroTrustChips: ['⚡ Sub-Second In-Memory Processing', '🛠️ 30+ Dedicated PDF Tools', '🤖 AI Document Summarizer', '🔒 Ephemeral 15-Min Shredding'],
    mainContent: featuresContent
  },
  {
    filename: 'pricing.html',
    title: 'Pricing &amp; Plans — Transparent &amp; Free Forever | MomPDF',
    description: 'Simple, transparent, and fair pricing for MomPDF. Free forever for core tools, with Pro and Enterprise tiers for power users and teams.',
    heroBadge: 'Plans &amp; Pricing',
    heroTitle: 'Transparent, Fair &amp; Simple Pricing',
    heroSubtitle: 'Enjoy high-speed PDF tools for free, or upgrade to Pro and Enterprise for unlimited batch processing, priority sandboxes, and dedicated API access.',
    heroTrustChips: ['🆓 Free Forever Available', '🚫 No Hidden Subscription Fees', '💳 Cancel Anytime', '⚡ Instant Activation'],
    mainContent: pricingContent
  },
  {
    filename: 'faq.html',
    title: 'Frequently Asked Questions &amp; Help Center — MomPDF',
    description: 'Find instant answers to common questions about document security, conversion accuracy, file size limits, API integrations, and privacy standards.',
    heroBadge: 'Help &amp; FAQ',
    heroTitle: 'Frequently Asked Questions &amp; Knowledge Base',
    heroSubtitle: 'Find instant answers to common questions about document security, conversion accuracy, file size limits, API integrations, and privacy standards.',
    heroTrustChips: ['❓ Instant Answers', '🔒 Security &amp; Privacy FAQ', '🛠️ Conversion &amp; Tools Guide', '💬 24/7 Support'],
    mainContent: faqContent
  }
];

// Generate all files
console.log('Generating standardized info pages matching about.html design system...');
pages.forEach(p => {
  const fullHtml = buildFullPage(p);
  const outPath = path.join(PUBLIC_DIR, p.filename);
  fs.writeFileSync(outPath, fullHtml, 'utf8');
  console.log(`✓ Generated: ${p.filename} (${(fullHtml.length / 1024).toFixed(1)} KB)`);
});

console.log('All 9 info pages built successfully with matching about.html design and color palette!');
