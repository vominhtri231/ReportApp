//User data FOFRM ID
const formDefinitionSheetId = '1gCnWXa80IWS6jBu-RXRsx8fhev9xr5P_MNOoWu3oDbM';

function getUser(email) {
  Logger.log("Get user with email : " + email);
  const spreadSheet = SpreadsheetApp.openById(formDefinitionSheetId);
  const sheet = spreadSheet.getSheetByName("user");
  const sheetData = getAllData(sheet.getDataRange().getValues());
  const currentUser = sheetData.find(item => {
    return String(item.email) === email;
  });
  return currentUser;
}

function saveForm(savingData, workPlace) {
  Logger.log("Saving : " + savingData + " with work place :" + workPlace);
  const spreadSheet = SpreadsheetApp.openById(formDefinitionSheetId);
  const savingDestinationSheet = spreadSheet.getSheetByName("saving destination");
  const savingDestinations = getAllData(savingDestinationSheet.getDataRange().getValues());
  const savingDestination =
    savingDestinations.find(savingDestination => savingDestination["Work place"] === workPlace);

  if (savingDestination == undefined) {
    return;
  }

  const savingSpreadSheet = SpreadsheetApp.openByUrl(savingDestination["Spreadsheet url"]);
  const savingSheet = savingSpreadSheet.getSheetByName(savingDestination["sheet name"]);
  savingSheet.appendRow(savingData);
}