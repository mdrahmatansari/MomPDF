const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateFavicons() {
  const svgPath = path.join(__dirname, '../public/img/mompdf-icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const faviconsDir = path.join(__dirname, '../public/img/favicons-pdf');
  if (!fs.existsSync(faviconsDir)) {
    fs.mkdirSync(faviconsDir, { recursive: true });
  }

  // 1. Generate 32x32 Favicon PNG
  const favicon32Path = path.join(faviconsDir, 'favicon-32x32.png');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(favicon32Path);
  console.log('Generated favicon-32x32.png');

  // 2. Generate 192x192 App Icon PNG
  const appIconPath = path.join(__dirname, '../public/img/app-icon.png');
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(appIconPath);
  console.log('Generated app-icon.png');

  // 3. Generate public/favicon.ico (copy of 32x32 png or standard format)
  const icoPath = path.join(__dirname, '../public/favicon.ico');
  const favicon32Buffer = fs.readFileSync(favicon32Path);
  fs.writeFileSync(icoPath, favicon32Buffer);
  console.log('Generated public/favicon.ico');

  console.log('All favicons generated successfully from mompdf-icon.svg!');
}

generateFavicons().catch(err => {
  console.error('Error generating favicons:', err);
});
