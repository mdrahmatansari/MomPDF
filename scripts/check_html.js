const fs = require('fs');
const cheerio = require('cheerio');
const files = fs.readdirSync('./public').filter(f => f.endsWith('.html'));

let ok = true;
files.forEach(f => {
    const content = fs.readFileSync('./public/' + f, 'utf-8');
    const $ = cheerio.load(content);
    if ($('head').length !== 1 || $('body').length !== 1 || $('html').length !== 1) {
        console.log(f, 'has issues:', 'html:', $('html').length, 'head:', $('head').length, 'body:', $('body').length);
        ok = false;
    }
});
if (ok) {
    console.log('All HTML files have exactly one html, head, and body tag.');
}
