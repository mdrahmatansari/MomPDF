const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const mapping = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n-mapping.json'), 'utf8'));

// Prepare sorted keys by length (longest first to avoid partial matches)
const sortedMapping = Object.keys(mapping).map(k => ({ key: k, val: mapping[k] })).sort((a, b) => b.key.length - a.key.length);

function injectI18n(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content, { decodeEntities: false });

  let modifications = 0;

  function processNode(node) {
    if (node.type === 'text') {
      let text = node.data.trim();
      if (!text) return;
      
      // Look for a perfect match first
      for (const {key, val} of sortedMapping) {
        if (text === key) {
          const parent = $(node).parent();
          if (parent.length && !parent.attr('data-i18n') && parent[0].name !== 'script' && parent[0].name !== 'style') {
            parent.attr('data-i18n', val);
            modifications++;
          }
          return;
        }
      }
    } else if (node.type === 'tag') {
      if (node.name === 'script' || node.name === 'style') return;
      
      // Check placeholders
      if (node.attribs && node.attribs.placeholder) {
        const ph = node.attribs.placeholder.trim();
        for (const {key, val} of sortedMapping) {
          if (ph === key) {
             if (!node.attribs['data-i18n-placeholder']) {
               $(node).attr('data-i18n-placeholder', val);
               modifications++;
             }
             break;
          }
        }
      }
      
      // Process children
      if (node.children) {
        node.children.forEach(processNode);
      }
    }
  }

  $('body').each(function() {
    processNode(this);
  });
  
  if (modifications > 0) {
    fs.writeFileSync(filePath, $.html());
    console.log(`Injected ${modifications} tags into ${path.basename(filePath)}`);
  }
}

const files = fs.readdirSync(PUBLIC_DIR).filter(f => f.endsWith('.html'));
files.forEach(f => injectI18n(path.join(PUBLIC_DIR, f)));
console.log('Finished injecting i18n attributes!');
