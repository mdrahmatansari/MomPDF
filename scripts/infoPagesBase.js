const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ABOUT_PATH = path.join(PUBLIC_DIR, 'about.html');

// Read about.html to extract common header, footer, and language modal
const aboutHtml = fs.readFileSync(ABOUT_PATH, 'utf8');

// Extract header: from <header class="header"> to </header>
const headerMatch = aboutHtml.match(/<header class="header">[\s\S]*?<\/header>/);
const headerHtml = headerMatch ? headerMatch[0] : '';

// Extract footer: from <footer class="footer"> to </html>
const footerMatch = aboutHtml.match(/<footer class="footer">[\s\S]*$/);
const footerHtml = footerMatch ? footerMatch[0] : '';

if (!headerHtml || !footerHtml) {
  console.error('Failed to extract header or footer from about.html');
  process.exit(1);
}

// Common CSS Styles from about.html
const commonStyles = `
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

    /* Executive / Feature Spotlight Card */
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

    /* Legal / Article Cards */
    .legal-card {
      background: #FFFFFF;
      border: 1.5px solid #F1F5F9;
      border-radius: 20px;
      padding: 36px;
      margin-bottom: 28px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }
    .legal-card h3 {
      font-size: 20px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .legal-card p, .legal-card li {
      font-size: 14.5px;
      color: #475569;
      line-height: 1.75;
      margin-bottom: 12px;
    }
    .legal-card ul {
      padding-left: 24px;
      margin-bottom: 14px;
    }
    .legal-highlight-box {
      background: #FFF1F2;
      border-left: 4px solid #E11D48;
      border-radius: 0 12px 12px 0;
      padding: 16px 20px;
      margin: 18px 0;
      font-size: 14px;
      color: #881337;
      font-weight: 500;
    }

    /* Pricing Cards & Grid */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 28px;
      margin-bottom: 70px;
    }
    .pricing-card {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 24px;
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: all 0.3s ease;
    }
    .pricing-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.08);
    }
    .pricing-card.featured {
      border-color: #E11D48;
      box-shadow: 0 20px 40px -15px rgba(225, 29, 72, 0.15);
    }
    .pricing-card.featured::before {
      content: "MOST POPULAR";
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.5px;
      padding: 4px 16px;
      border-radius: 999px;
    }
    .pricing-plan-name {
      font-size: 20px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 6px;
    }
    .pricing-plan-desc {
      font-size: 13.5px;
      color: #64748B;
      margin: 0 0 20px;
      line-height: 1.5;
    }
    .price-tag {
      font-size: 44px;
      font-weight: 900;
      color: #0F172A;
      margin: 10px 0 24px;
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    .price-tag span {
      font-size: 15px;
      font-weight: 600;
      color: #64748B;
    }
    .pricing-features-list {
      list-style: none;
      padding: 0;
      margin: 0 0 32px;
      flex: 1;
    }
    .pricing-features-list li {
      font-size: 14px;
      color: #334155;
      padding: 8px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px dashed #F1F5F9;
    }
    .pricing-features-list li:last-child {
      border-bottom: none;
    }
    .pricing-check {
      color: #E11D48;
      font-weight: 900;
      font-size: 16px;
    }

    /* Comparison Table */
    .table-container {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 70px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }
    .feature-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .feature-table th, .feature-table td {
      padding: 16px 20px;
      border-bottom: 1px solid #F1F5F9;
    }
    .feature-table th {
      background: #F8FAFC;
      font-weight: 800;
      color: #0F172A;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    .feature-table tr:last-child td {
      border-bottom: none;
    }
    .feature-table tr:hover td {
      background: #FFF1F2;
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
      transition: all 0.2s ease;
    }
    .faq-card:hover {
      border-color: #FDA4AF;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.04);
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
`;

function buildFullPage({ title, description, heroBadge, heroTitle, heroSubtitle, heroTrustChips, mainContent }) {
  const chipsHtml = heroTrustChips.map(c => `<span class="trust-chip">${c}</span>`).join('\n        ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="icon" type="image/svg+xml" href="img/mompdf-icon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="img/favicons-pdf/favicon-32x32.png?v=3" />
  <link rel="apple-touch-icon" href="img/app-icon.png?v=3" />
  <link rel="stylesheet" href="css/mompdf.ui.css" />
  <style>
${commonStyles}
  </style>
</head>
<body>
  
${headerHtml}
  
  <main class="main">
    <section class="hero" style="padding: 56px 24px 28px;">
      <div class="hero-badge">${heroBadge}</div>
      <h1 class="hero-title" style="max-width: 860px; margin: 0 auto 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.5px;">
        ${heroTitle}
      </h1>
      <p class="hero-subtitle" style="max-width: 720px; margin: 0 auto; font-size: 16.5px;">
        ${heroSubtitle}
      </p>

      <div class="hero-trust-bar">
        ${chipsHtml}
      </div>
    </section>

    <div class="about-wrap">
${mainContent}
    </div>
  </main>
  
${footerHtml}
`;
}

module.exports = {
  PUBLIC_DIR,
  buildFullPage
};
