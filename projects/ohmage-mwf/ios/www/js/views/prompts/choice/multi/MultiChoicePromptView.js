/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var MultiChoicePromptView = function (promptModel, isCustom) {
    "use strict";
    var that = AbstractChoicePromptView(promptModel, false, isCustom);
    that.isValid = function () {
        if (that.getNumberOfSelectedOptions() === 0) {
            that.setErrorMessage("Please select an option.");
            return false;
        }
        return true;
    };
    return that;
};