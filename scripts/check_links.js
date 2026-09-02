const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const publicDir = 'e:/MomPDF/public';
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

let errors = [];

files.forEach(file => {
    const filePath = path.join(publicDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(content);
    
    // Check links
    $('a[href]').each((i, el) => {
        let href = $(el).attr('href');
        if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#')) {
            let targetPath = path.join(publicDir, href.split('?')[0].split('#')[0]);
            if (!fs.existsSync(targetPath)) {
                errors.push(`[${file}] Broken link: ${href}`);
            }
        }
    });

    // Check scripts
    $('script[src]').each((i, el) => {
        let src = $(el).attr('src');
        if (src && !src.startsWith('http')) {
            let targetPath = path.join(publicDir, src.split('?')[0]);
            if (!fs.existsSync(targetPath)) {
                errors.push(`[${file}] Broken script src: ${src}`);
            }
        }
    });

    // Check styles
    $('link[rel="stylesheet"][href]').each((i, el) => {
        let href = $(el).attr('href');
        if (href && !href.startsWith('http')) {
            let targetPath = path.join(publicDir, href.split('?')[0]);
            if (!fs.existsSync(targetPath)) {
                errors.push(`[${file}] Broken stylesheet: ${href}`);
            }
        }
    });
    
    // Check images
    $('img[src], link[rel="icon"][href], link[rel="apple-touch-icon"][href]').each((i, el) => {
        let src = $(el).attr('src') || $(el).attr('href');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            let targetPath = path.join(publicDir, src.split('?')[0]);
            if (!fs.existsSync(targetPath)) {
                errors.push(`[${file}] Broken image/icon: ${src}`);
            }
        }
    });
});

if (errors.length > 0) {
    console.log(errors.join('\n'));
} else {
    console.log("No broken links or references found.");
}
