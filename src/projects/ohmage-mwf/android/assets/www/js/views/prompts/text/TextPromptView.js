/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var TextPromptView = function (promptModel) {
    "use strict";
    var that = AbstractPromptView(promptModel);

    //Get the minimum and maximum text length allowed values for this
    //prompt. It is assumed that these values might be nulls.
    var maxValue = promptModel.getMaxValue();
    var minValue = promptModel.getMinValue();

    var textarea = document.createElement('textarea');

    /**
     * Removes white space from the response and returns it.
     * @returns {String}
     */
    that.getResponse = function () {
        return textarea.value.replace(/^\s+|\s+$/g, "");
    };

    that.isValid = function () {

        var inputLength = that.getResponse().length;

        if (inputLength < minValue) {
            that.setErrorMessage("Please enter text more than " + minValue + " characters in length.");
            return false;
        }

        if (inputLength > maxValue) {
            that.setErrorMessage("Please enter text no longer than " + maxValue + " characters.");
            return false;
        }

        return true;
    };

    that.render = function () {
        var form = mwf.decorator.Form(promptModel.getText());
        form.addItem(textarea);
        return form;
    };

    return that;
};