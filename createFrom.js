function createForm() {
    const form = FormApp.create('New Form');
    const item = form.addCheckboxItem();

    item.setTitle('Condiments');
    item.setChoices([
        item.createChoice('Ketchup'),
        item.createChoice('Mustard'),
        item.createChoice('Relish')
    ]);

    ScriptApp.newTrigger('onFormSubmit')
        .forForm(form)
        .onFormSubmit()
        .create();
}