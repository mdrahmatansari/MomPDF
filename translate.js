const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');

const mapping = JSON.parse(fs.readFileSync('e:/MomPDF/scripts/i18n-mapping.json', 'utf8'));
const enDict = {};
for (const [englishText, key] of Object.entries(mapping)) {
  enDict[key] = englishText;
}

const missingLangs = ['id', 'vi', 'nl', 'pl', 'sv', 'no', 'da', 'fi', 'el', 'cs', 'hu', 'ro', 'uk', 'th', 'bn'];
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  let content = fs.readFileSync('e:/MomPDF/public/js/mompdf.i18n.js', 'utf8');
  
  for (const lang of missingLangs) {
    if (content.includes(`'${lang}': {`)) {
      console.log(`Language ${lang} already exists, skipping.`);
      continue;
    }
    
    console.log(`Translating to ${lang}...`);
    const dict = {};
    const keys = Object.keys(enDict);
    
    // Batch translate everything to avoid rate limits / speed up. 
    // Join with a unique delimiter.
    const delimiter = ' ||| ';
    const textsToTranslate = Object.values(enDict);
    
    try {
      // Split into chunks of 50 to avoid URI too long errors
      const chunkSize = 50;
      let translatedTexts = [];
      
      for (let i = 0; i < textsToTranslate.length; i += chunkSize) {
        const chunk = textsToTranslate.slice(i, i + chunkSize);
        const textToTranslate = chunk.join(delimiter);
        
        let targetLang = lang;
        if (targetLang === 'zh-CN') targetLang = 'zh-cn';
        if (targetLang === 'zh-TW') targetLang = 'zh-tw';
        
        const res = await translate(textToTranslate, { to: targetLang });
        const parts = res.text.split(/\|\|\|/g).map(s => s.trim());
        
        if (parts.length === chunk.length) {
          translatedTexts = translatedTexts.concat(parts);
        } else {
          console.warn(`Mismatch in chunk size for ${lang}! Fallback to individual translation.`);
          for (let j = 0; j < chunk.length; j++) {
            const r = await translate(chunk[j], { to: targetLang });
            translatedTexts.push(r.text.trim());
            await delay(100);
          }
        }
        await delay(500);
      }
      
      for (let i = 0; i < keys.length; i++) {
        dict[keys[i]] = translatedTexts[i] || enDict[keys[i]]; // Fallback to EN if missing
      }
      
      const dictString = `\n    '${lang}': ${JSON.stringify(dict, null, 6).replace(/"([^"]+)":/g, "'$1':").replace(/"/g, "'")},`;
      content = content.replace(/const translations = \{/, `const translations = {${dictString}`);
      fs.writeFileSync('e:/MomPDF/public/js/mompdf.i18n.js', content);
      console.log(`Injected ${lang} dictionary!`);
      
    } catch (err) {
      console.error(`Error translating to ${lang}:`, err.message);
    }
  }
}

main();
