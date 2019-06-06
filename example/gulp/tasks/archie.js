const { docToArchieML } = require('@newswire/doc-to-archieml');
const { google } = require('googleapis');
const fs = require('fs');

async function main() {
  // this method looks for the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS
  // environment variables to establish authentication
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/documents.readonly']
  });

  // pass in the valid authentication and ID of the sheet you want to process
  const results = await docToArchieML({
    documentId: process.env.DOCUMENT_ID,
    auth
  });

  const json = JSON.stringify(results);

  // `results` is your JavaScript object representing the processed data in the spreadsheet
  // write `results` to a local file
  fs.writeFile('./src/data/archie.json', json, 'utf8', error => {
    error && console.log('Error with Google Doc data!');
  });
}

module.exports = cb => {
  main().catch(console.error);
  cb();
};
