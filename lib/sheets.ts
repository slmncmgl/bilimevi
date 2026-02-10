import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function getContractByToken(token: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: 'Sözleşme Onayları!A2:K1000',
  });

  const rows = response.data.values || [];
  const row = rows.find(r => r[0] === token);
  
  if (!row) return null;
  
  return {
    tally_submission_id: row[0],
    approval_status: row[1],
    approved_at: row[2],
    approved_ip: row[3],
    contract_version: row[4],
    contract_html: row[5],
    student_tc_no: row[6],
    student_name: row[7],
    danisman_tc_no: row[8],
    danisman_adi: row[9],
    notes: row[10],
  };
}

export async function updateApprovalStatus(token: string, ip: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: 'Sözleşme Onayları!A2:A1000',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(r => r[0] === token);
  
  if (rowIndex === -1) throw new Error('Contract not found');
  
  const actualRow = rowIndex + 2;
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: `Sözleşme Onayları!B${actualRow}:D${actualRow}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        'APPROVED',
        new Date().toISOString(),
        ip
      ]]
    }
  });
}
