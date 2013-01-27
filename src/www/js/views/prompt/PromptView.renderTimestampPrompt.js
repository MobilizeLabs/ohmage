PromptView.renderTimestampPrompt = function (promptModel) {

    var date = new Date();
    var dateTimePicker = new DateTimePicker();
    var datePicker = dateTimePicker.createDatePicker(date);
    var timePicker = dateTimePicker.createTimePicker(date);

    promptModel.isValid = function () {

        if (!datePicker.isValid()) {
            promptModel.setErrorMessage("Please specify date in the format: YYYY-MM-DD.");
            return false;

        } else if (!timePicker.isValid()) {
            promptModel.setErrorMessage("Please specify time in the format: HH-MM.");
            return false;
        }

        return true;
    };

    promptModel.getResponse = function () {
        return datePicker.value + 'T' + timePicker.value + ":00";
    };

    return DateTimePicker.createDateTimeForm(prompt.getText(), datePicker, timePicker);

};