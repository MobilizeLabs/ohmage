/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var NumberInputView = function (promptModel) {
    "use strict";
    var that = AbstractNumberPromptView(promptModel);

    var minValue = promptModel.getMinValue();
    var maxValue = promptModel.getMaxValue();

    var userInputField = null;

    var isValueInRange = function (inputString) {
        if (inputString === "") {
            return false;
        }
        var input = parseInt(inputString, 10);
        return (minValue <= input && input <= maxValue);
    };

    var isInteger = function (s) {
        return String(s).search(/^(\+|-)?\d+\s*$/) !== -1;
    };

    var isSign = function (s) {
        return String(s).search(/^(\+|-)?$/) !== -1;
    };

    var rangeMessage = "Please enter a number between " + minValue + " and " + maxValue + ", inclusive.";

    var validateNumberInputKeyPress = function (evt) {

        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);

        var result = (evt.target || evt.srcElement).value + key;
        var cancelKey = function () {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) {
                theEvent.preventDefault();
            }
        };

        if (!isSign(result)) {
            if (!isInteger(key)) {
                cancelKey();
            }
        }
    };

    that.isValid = function () {
        if (!isValueInRange(textBox.value)) {
            that.setErrorMessage(rangeMessage);
            return false;
        }
        return true;
    };

    that.getResponse = function () {
        return parseInt(textBox.value, 10);
    };

    that.render = function (promptModel, defaultValue) {

        userInputField = document.createElement('input');
        userInputField.value = defaultValue || that.getNumberPromptDefaultValue(promptModel);
        userInputField.onkeypress = validateNumberInputKeyPress;

        var form = mwfd.Form(promptModel.getText());
        form.addLabel(rangeMessage);
        form.addItem(userInputField);

        var container = document.createElement('div');
        container.appendChild(mwfd.SingleClickButton("Switch to Number Picker", function () {
            container.innerHTML = "";
            container.appendChild(createNumberPicker(promptModel, (isValueInRange(userInputField.value)) ? that.getResponse() : false));
        }));
        container.appendChild(form);
        return container;

    };

    return that;
};