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
        return parseInt(userInputField.value, 10);
    };

    that.render = function (currentValue) {

        userInputField = document.createElement('input');
        userInputField.value = currentValue || that.getNumberPromptDefaultValue(promptModel);
        userInputField.onkeypress = validateNumberInputKeyPress;

        var form = mwf.decorator.Form(promptModel.getText());
        form.addLabel(rangeMessage);
        form.addItem(userInputField);

        var container = document.createElement('div');
        container.appendChild(mwf.decorator.SingleClickButton("Switch to Number Picker", function () {
            container.innerHTML = "";
            that = NumberPickerView(promptModel, (isValueInRange(userInputField.value)) ? that.getResponse() : promptModel.getDefaultValue());
            container.appendChild(that.render());
        }));
        container.appendChild(form);
        return container;

    };

    return that;
};