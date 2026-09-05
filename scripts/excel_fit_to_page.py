import openpyxl
import sys
import os

def auto_fit(input_path, output_path):
    try:
        # Load workbook
        wb = openpyxl.load_workbook(input_path)
        
        # Iterate over all sheets and apply fit-to-width
        for sheet in wb.worksheets:
            # Enable fitToPage property
            if sheet.sheet_properties.pageSetUpPr is None:
                sheet.sheet_properties.pageSetUpPr = openpyxl.worksheet.properties.PageSetupProperties(fitToPage=True)
            else:
                sheet.sheet_properties.pageSetUpPr.fitToPage = True
                
            # Fit all columns to exactly 1 page wide (prevents columns cutting)
            # fitToHeight = 0 allows rows to flow to subsequent pages naturally
            sheet.page_setup.fitToWidth = 1
            sheet.page_setup.fitToHeight = 0
            
            # Save modified workbook
        wb.save(output_path)
        print("SUCCESS")
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python excel_fit_to_page.py <input.xlsx> <output.xlsx>")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if not os.path.exists(input_file):
        print(f"ERROR: File not found {input_file}")
        sys.exit(1)
        
    auto_fit(input_file, output_file)
