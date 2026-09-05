const pdfService = require('./services/pdfService.js');
const fs = require('fs');

async function test() {
    try {
        console.log("Running excelToPdf on fitted file...");
        const excelBuffer = fs.readFileSync('test_fitted.xlsx');
        const pdfBuffer = await pdfService.excelToPdf(excelBuffer);
        
        console.log("PDF generated! Size:", pdfBuffer.length);
        fs.writeFileSync('test_fitted.pdf', pdfBuffer);
    } catch(e) {
        console.error("Caught error:", e);
    }
}
test();
