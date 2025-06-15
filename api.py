from flask import Flask, request, jsonify
from flask_cors import CORS
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import datetime

app = Flask(__name__)
CORS(app)

# Google Sheets setup
scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('credentials.json', scope)
client = gspread.authorize(creds)

# Your Google Sheet ID (the long string in the URL)
SHEET_ID = '1YOUR_SHEET_ID_HERE'  # Replace with your actual sheet ID

@app.route('/update', methods=['POST'])
def update_sheet():
    try:
        # Get the current date
        today = datetime.datetime.now().strftime('%Y-%m-%d')
        
        # Open the sheet
        sheet = client.open_by_key(SHEET_ID).sheet1
        
        # Find the next empty row
        next_row = len(sheet.get_all_values()) + 1
        
        # Add the new entry
        sheet.update_cell(next_row, 1, today)  # Date in first column
        sheet.update_cell(next_row, 2, 'Yes')  # 'Yes' in second column
        
        return jsonify({'success': True, 'message': 'Updated successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 