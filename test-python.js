const pdfService = require('./services/pdfService.js');
const fs = require('fs');

async function test() {
    try {
        console.log("Creating dummy PDF...");
        // Actually, just sending a dummy buffer will cause pdfplumber to fail to open it as a PDF,
        // but it should NOT throw ModuleNotFoundError! It should throw "Error opening PDF".
        const buffer = Buffer.from("dummy");
        await pdfService.pdfToExcel(buffer);
    } catch(e) {
        console.error("Caught error:", e.message);
    }
}
test();
