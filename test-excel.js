const pdfService = require('./services/pdfService.js');
const fs = require('fs');
const XLSX = require('xlsx');

async function test() {
    try {
        console.log("Generating sample Excel file...");
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
            ["Hello", "World"],
            [123, 456]
        ]);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        console.log("Running excelToPdf...");
        const pdfBuffer = await pdfService.excelToPdf(excelBuffer);
        
        console.log("PDF generated! Size:", pdfBuffer.length);
    } catch(e) {
        console.error("Caught error:", e);
    }
}
test();
