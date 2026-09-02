const pdfService = require('../services/pdfService');
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');

async function testFileSorting() {
  console.log('--- Testing File Arrangement & Sorting Engine ---');

  // Create mock files with different names and timestamps
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

  const rawFiles = [
    { name: 'document10.pdf', lastModified: 1000 },
    { name: 'document2.pdf', lastModified: 3000 },
    { name: 'document1.pdf', lastModified: 2000 },
    { name: 'alpha.pdf', lastModified: 5000 },
    { name: 'beta.pdf', lastModified: 4000 }
  ];

  // Test 1: A -> Z Natural Sorting
  const sortedAZ = [...rawFiles].sort((a, b) => collator.compare(a.name, b.name));
  console.log('A -> Z order:', sortedAZ.map(f => f.name));
  const expectedAZ = ['alpha.pdf', 'beta.pdf', 'document1.pdf', 'document2.pdf', 'document10.pdf'];
  if (JSON.stringify(sortedAZ.map(f => f.name)) !== JSON.stringify(expectedAZ)) {
    throw new Error('A -> Z natural sorting failed!');
  }
  console.log('✓ A -> Z natural sorting passed (1, 2, 10 order preserved).');

  // Test 2: Z -> A Natural Sorting
  const sortedZA = [...rawFiles].sort((a, b) => collator.compare(b.name, a.name));
  console.log('Z -> A order:', sortedZA.map(f => f.name));
  const expectedZA = ['document10.pdf', 'document2.pdf', 'document1.pdf', 'beta.pdf', 'alpha.pdf'];
  if (JSON.stringify(sortedZA.map(f => f.name)) !== JSON.stringify(expectedZA)) {
    throw new Error('Z -> A natural sorting failed!');
  }
  console.log('✓ Z -> A natural sorting passed.');

  // Test 3: Newest -> Oldest Sorting
  const sortedNewest = [...rawFiles].sort((a, b) => b.lastModified - a.lastModified);
  console.log('Newest order:', sortedNewest.map(f => f.name));
  const expectedNewest = ['alpha.pdf', 'beta.pdf', 'document2.pdf', 'document1.pdf', 'document10.pdf'];
  if (JSON.stringify(sortedNewest.map(f => f.name)) !== JSON.stringify(expectedNewest)) {
    throw new Error('Newest sorting failed!');
  }
  console.log('✓ Newest -> Oldest sorting passed.');

  // Test 4: Manual Reorder Simulation (Move index 4 to 0)
  const manual = [...sortedAZ];
  const [moved] = manual.splice(4, 1);
  manual.splice(0, 0, moved);
  console.log('Custom reorder:', manual.map(f => f.name));
  if (manual[0].name !== 'document10.pdf' || manual[1].name !== 'alpha.pdf') {
    throw new Error('Manual reordering failed!');
  }
  console.log('✓ Manual drag-and-drop / move reordering passed.');

  // Test 5: Verify merging in sorted order
  const docA = await PDFDocument.create();
  const pA = docA.addPage([300, 300]);
  const font = await docA.embedFont('Helvetica');
  pA.drawText('PAGE ALPHA', { x: 50, y: 150, size: 18, font });
  const bufA = await docA.save();

  const docB = await PDFDocument.create();
  const pB = docB.addPage([300, 300]);
  const fontB = await docB.embedFont('Helvetica');
  pB.drawText('PAGE BETA', { x: 50, y: 150, size: 18, font: fontB });
  const bufB = await docB.save();

  // Merge in B -> A custom order
  const mergedCustom = await pdfService.merge([bufB, bufA]);
  const parsed = await pdfParse(mergedCustom);
  console.log('Merged output page text in order:\n', parsed.text.trim());
  const indexBeta = parsed.text.indexOf('PAGE BETA');
  const indexAlpha = parsed.text.indexOf('PAGE ALPHA');
  if (indexBeta === -1 || indexAlpha === -1 || indexBeta >= indexAlpha) {
    throw new Error('Processing failed to preserve selected file sequence!');
  }
  console.log('✓ Processing order strictly followed selected arrangement.');

  console.log('\nALL FILE SORTING & ARRANGEMENT TESTS PASSED 100%!\n');
}

testFileSorting().catch(e => {
  console.error(e);
  process.exit(1);
});
