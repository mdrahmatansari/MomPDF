import fitz  # PyMuPDF
import sys
import os
import argparse

def convert_pdf_to_jpg(input_pdf, output_dir, quality="high"):
    try:
        # Determine DPI based on quality
        dpi = 300 if quality == "high" else 150
        
        doc = fitz.open(input_pdf)
        total_pages = len(doc)
        
        if total_pages == 0:
            print("ERROR: No pages found in the PDF.")
            sys.exit(1)
            
        print(f"PROGRESS_INIT:{total_pages}", flush=True)
        
        generated_files = []
        
        for i in range(total_pages):
            page = doc.load_page(i)
            # Matrix for rendering at specific DPI
            zoom = dpi / 72.0
            mat = fitz.Matrix(zoom, zoom)
            
            # Get pixel map
            pix = page.get_pixmap(matrix=mat, alpha=False)
            
            output_file = os.path.join(output_dir, f"page_{i + 1}.jpg")
            
            # Save as JPG
            pix.save(output_file, output="jpg")
            generated_files.append(output_file)
            
            print(f"PROGRESS_UPDATE:{i + 1}:{total_pages}", flush=True)
            
        print(f"PROGRESS_DONE", flush=True)
        
    except Exception as e:
        print(f"ERROR: {str(e)}", flush=True)
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert PDF to JPGs")
    parser.add_argument("input_pdf", help="Input PDF file path")
    parser.add_argument("output_dir", help="Output directory path")
    parser.add_argument("--quality", default="high", choices=["high", "standard"], help="Image quality (high=300DPI, standard=150DPI)")
    args = parser.parse_args()

    if not os.path.exists(args.input_pdf):
        print(f"ERROR: File not found {args.input_pdf}", flush=True)
        sys.exit(1)
        
    if not os.path.exists(args.output_dir):
        os.makedirs(args.output_dir)

    convert_pdf_to_jpg(args.input_pdf, args.output_dir, quality=args.quality)
