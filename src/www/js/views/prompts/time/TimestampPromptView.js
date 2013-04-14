/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var TimestampPromptView = function (promptModel) {
    "use strict";
    var that = AbstractPromptView(promptModel);

    var date = new Date();
    var dateTimePicker = new DateTimePicker();
    var datePicker = dateTimePicker.createDatePicker(date);
    var timePicker = dateTimePicker.createTimePicker(date);


    that.isValid = function () {

        if (!datePicker.isValid()) {
            that.setErrorMessage("Please specify date in the format: YYYY-MM-DD.");
            return false;

        }

        if (!timePicker.isValid()) {
            that.setErrorMessage("Please specify time in the format: HH-MM.");
            return false;
        }

        return true;
    };

    that.getResponse = function () {
        return datePicker.value + 'T' + timePicker.value + ":00";
    };

    that.render = function () {
        return DateTimePicker.createDateTimeForm(promptModel.getText(), datePicker, timePicker);
    };

    return that;
};