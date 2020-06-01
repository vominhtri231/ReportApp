const FORM_ID = "1-MEiqHFhQLK82RBcaQoNymAbYWNw8tQ9zG5BxdtfAjQ";

function onFormSubmit() {
  const lastFormResponse = FormApp.openById(FORM_ID).getResponses().slice(-1)[0];
  const respondentEmail = lastFormResponse.getRespondentEmail();
  const itemResponses = lastFormResponse.getItemResponses();
  const editResponseUrl = lastFormResponse.getEditResponseUrl();
  const responses = itemResponses.map(itemResponse => {
    return {
      title: itemResponse.getItem().getTitle(),
      response: itemResponse.getResponse()
    }
  });
  Logger.log(respondentEmail);
  Logger.log(editResponseUrl);
  Logger.log(responses);
}