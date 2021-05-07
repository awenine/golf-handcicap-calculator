import { tableMaker } from "./helperModules.js";

//TODO extract & combine bottom 2 functions
// for individual pages
export async function fetchAndRenderTable(documentID, sheetNumber, tableContainer, hasLinkedColumn = false) {
  console.log('here');
  const dataTable = await fetch(`https://spreadsheets.google.com/feeds/cells/${documentID}/${sheetNumber}/public/values?alt=json-in-script`)
    .then(response => {
      if (!response.ok) {
        console.log('there is an error in the gsheets response');
        throw new Error('Error fetching GSheet');
      }
      return response.text();
    })
    .then(resultText => {
      const formattedText = resultText
        .replace('gdata.io.handleScriptLoaded(', '')
        .slice(0, -2);
      return JSON.parse(formattedText);
    })
    .then(
      (data) => tableMaker(data.feed.entry.map(cell => cell.gs$cell), tableContainer, hasLinkedColumn)
    )
    .catch(err => {
      throw new Error(
        'Failed to fetch from GSheets API. Check your Sheet Id and the public availability of your GSheet.'
      );
    });
  return dataTable;
}

// for index page
export async function fetchTable(documentID, sheetNumber) {
  const dataTable = await fetch(`https://spreadsheets.google.com/feeds/cells/${documentID}/${sheetNumber}/public/values?alt=json-in-script`)
    .then(response => {
      if (!response.ok) {
        console.log('there is an error in the gsheets response');
        throw new Error('Error fetching GSheet');
      }
      return response.text();
    })
    .then(resultText => {
      const formattedText = resultText
        .replace('gdata.io.handleScriptLoaded(', '')
        .slice(0, -2);
        return JSON.parse(formattedText);
    })
    .then(
      (data) => data.feed.entry.map(cell => cell.gs$cell)
    )
    .catch(err => {
      throw new Error(
        'Failed to fetch from GSheets API. Check your Sheet Id and the public availability of your GSheet.'
      );
    });
  return dataTable;
}
