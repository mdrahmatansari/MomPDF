const fs = require('fs');
const path = require('path');

const publicDir = 'e:/MomPDF/public';
const getAllFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(file));
        } else {
            results.push(file);
        }
    });
    return results;
};

const allFiles = getAllFiles(publicDir).map(f => f.replace(/\\/g, '/'));
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));

let htmlContents = '';
htmlFiles.forEach(f => {
    htmlContents += fs.readFileSync(f, 'utf-8');
});

const cssFiles = allFiles.filter(f => f.endsWith('.css'));
let cssContents = '';
cssFiles.forEach(f => {
    cssContents += fs.readFileSync(f, 'utf-8');
});

const fullContent = htmlContents + cssContents;

const unused = [];

allFiles.forEach(f => {
    if (f.endsWith('.html')) return; // skip HTML files
    
    const relativePath = f.replace(publicDir + '/', '');
    const filename = path.basename(f);
    
    // Check if the relative path or filename is mentioned anywhere in the HTML/CSS
    if (!fullContent.includes(relativePath) && !fullContent.includes(filename)) {
        unused.push(relativePath);
    }
});

console.log("Potentially unused files:");
console.log(unused.join('\n'));
