const FORM_ID = "1DgRkAcbP1VEDiuYWgyXsS0yPEnvqL0xGrvOg6XBEb6Y";

function setUpTrigger() {
  const form = FormApp.openById(FORM_ID);
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
}

function onFormSubmit() {
  const lastFormResponse = FormApp.openById(FORM_ID).getResponses().slice(-1)[0];
  const respondentEmail = lastFormResponse.getRespondentEmail();
  const editResponseUrl = lastFormResponse.getEditResponseUrl();
  const itemResponses = getItemResponses(lastFormResponse);

  const fields = itemResponses.map(itemResponse => ({
    title: itemResponse.title,
    value: itemResponse.response,
    short: true
  }));
  const savingData = [...itemResponses.map(itemResponse => itemResponse.response), editResponseUrl];
  const workStation = itemResponses.find(itemResponse => itemResponse.title === "該当事業所").response;

  const user = getUser(respondentEmail);

  sendToSlack({
    fields: fields,
    mentions: [user.slackId],
  });

  saveForm(savingData, workStation);
}

function getItemResponses(lastFormResponse) {
  const itemResponses = lastFormResponse.getItemResponses();
  return itemResponses.map(itemResponse => {
    return {
      title: itemResponse.getItem().getTitle(),
      response: itemResponse.getResponse()
    }
  });
}