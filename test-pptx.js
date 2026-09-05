const pdfService = require('./services/pdfService.js');
const fs = require('fs');

async function test() {
    try {
        console.log("Creating dummy PPTX...");
        // Write a tiny invalid pptx just to trigger LibreOffice
        const buffer = Buffer.from("dummy");
        const res = await pdfService.powerpointToPdf(buffer);
        console.log("Success! Buffer length:", res.length);
    } catch(e) {
        console.error("Error:", e);
    }
}
test();
