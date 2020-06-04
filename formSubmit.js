const POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";
const FORM_ID = '18JRcFUe0gV5CXIPIKJsBbjAHlkF_Q_jHFuLHImep3n8';
const channelName = 'welcome';
const nameSheetFormData='submitForm';

//User data FOFRM ID
const userDataSheetID='1j721Cl8pFMAu-jm07m7N08Z3P32K0DHttZ22DbIS9ms';
const userSubmitMailAdress='sang@gmail.com';

function onFormSubmit() {
  var fields=[];
  var uploadData = [];
  var lastFormResponse = FormApp.openById(FORM_ID).getResponses().slice(-1)[0];
  var respondentEmail = lastFormResponse.getRespondentEmail();
  var itemResponses = lastFormResponse.getItemResponses();
  var editResponseUrl = lastFormResponse.getEditResponseUrl();
  const responses = itemResponses.map(itemResponse => {
    return {
      title: itemResponse.getItem().getTitle(),
      response: itemResponse.getResponse()
    }
  });
  for (var i in responses) {
      //get work's station
      if (responses[i]["title"] === "該当事業所") {
          var workStation = responses[i].response;
        }
      var temp = {
        title: responses[i]["title"],
        value: responses[i]["response"],
        short: true
      };
      fields.push(temp);
      uploadData.push(responses[i]["response"]);
  };
  
  uploadData.push(editResponseUrl);
  
  //add data to upload - User's mail submit form
  //uploadData.push(responses[i]["response"]);
  var userSubmit = getUserSubmit(userSubmitMailAdress);
  uploadData.push(userSubmit.SlackId);
  
  const httpResponse = sendToSlack({
      fields: fields,
      mentions: [userSubmit.SlackId],
      fallback: "入社登録システム"
    }, channelName);
  
  saveForm(uploadData,workStation);
  
  Logger.log(respondentEmail);
  Logger.log(editResponseUrl);
  Logger.log(uploadData);
}

function sendToSlack(data, channelName) {
  var properties = PropertiesService.getScriptProperties();
  var accessToken = properties.getProperty("accessToken");
  var d = new Date();
  var timeStamp = d.getTime();
  var payload = {
    token: accessToken,
    username: "入社登録システム",
    channel: channelName,
    attachments: [{
      fallback: data.fallback,
      pretext: data.mentions
        .filter(mention => mention != undefined)
        .map(mention => "<@" + mention + ">")
        .reduce((acc, mention) => acc + ", " + mention) +
               "\n下記の通り入社登録を受け付けました。\n" +
               "ご確認ください。",
      fields: data.fields,
      color: "good", //左側のバーの色,
      "footer": "ロギングタイム：",
       "ts": ""+timeStamp
    }],
  };
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: 'Bearer ' + accessToken,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(POST_MESSAGE_URL, options);
}

function saveForm(uploadData,fileName) {
  const fileId = getIdFilebyName(fileName);
  const spreadSheet = SpreadsheetApp.openById(fileId);
  const checkinFormSheet = spreadSheet.getSheetByName(nameSheetFormData);
  const checkinFormData = getAllData(checkinFormSheet.getDataRange().getValues());
  Logger.log("data upload+ "+uploadData);
  checkinFormSheet.appendRow(uploadData);
}

function getIdFilebyName(fileName) {
  var files = DriveApp.getFilesByName(fileName);
  while (files.hasNext()) {
      var file = files.next();
      return file.getId();
  }
}

function getUserSubmit(userMailAdress) {
  var spreadSheet = SpreadsheetApp.openById(userDataSheetID);
  var sheet = spreadSheet.getSheetByName("ユーザー");
  var sheetData = getAllData(sheet.getDataRange().getValues());
  var currentUser = sheetData.find(item => {
    return String(item.email) === userSubmitMailAdress;
  });
  return currentUser;
}