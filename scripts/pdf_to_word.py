import sys
import json
from pdf2docx import Converter

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing input or output file paths"}))
        sys.exit(1)
        
    pdf_file = sys.argv[1]
    docx_file = sys.argv[2]
    
    try:
        # Create pdf2docx converter object
        cv = Converter(pdf_file)
        
        # Convert all pages
        cv.convert(docx_file, start=0, end=None)
        cv.close()
        
        print(json.dumps({"success": True, "output": docx_file}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
