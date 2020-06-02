const formDefinitionSheetId = "1fD0DGQsPxZNIc9eqnEPTN-ulvPqVauNpDzOX9rUTVtg";

function createForm() {
    const form = FormApp.openById('1X3mq_0poumeRrbuzcTDZ4HZ2sG3dpG7OGaGJz_HzuPQ');

    clearForm(form);

    const formDefines = readFormDefinition("form define");
    for (const formDefine of formDefines) {
        generateFormItem(form, formDefine);
    }

    // form.setRequireLogin(true)
    form.setAllowResponseEdits(true)

    ScriptApp.newTrigger('onFormSubmit')
        .forForm(form)
        .onFormSubmit()
        .create();
}


function clearForm(form) {
    const items = form.getItems();
    while (items.length > 0) {
        form.deleteItem(items.pop());
    }
}

function generateFormItem(form, formDefine) {
    let item;
    Logger.log(formDefine);

    if (formDefine.type === "text") {
        item = form.addTextItem();
    }

    if (formDefine.type === 'drop-down') {
        item = form.addListItem();
    }

    if (formDefine.type === 'choice') {
        item = form.addMultipleChoiceItem();
    }

    if (formDefine.type === 'checkbox') {
        item = form.addCheckboxItem();
    }

    if (formDefine.type === 'date') {
        item = form.addDateItem();
    }

    if (formDefine.type === 'page-break') {
        item = form.addPageBreakItem();
    }

    if (item != undefined) {
        item.setTitle(formDefine.description);

        if (typeof item.setRequired === "function") {
            item.setRequired(formDefine.required);
        }

        if (formDefine.data && typeof item.setChoiceValues === "function") {
            const choicesData = readFormDefinition(formDefine.data);
            const choiceValues = choicesData.map(choiceData => choiceData.value);
            Logger.log(choiceValues);
            item.setChoiceValues(choiceValues);
        }
    }
}

function readFormDefinition(sheetName) {
    const spreadSheet = SpreadsheetApp.openById(formDefinitionSheetId);
    const sheet = spreadSheet.getSheetByName(sheetName);
    return getAllData(sheet.getDataRange().getValues());
}
