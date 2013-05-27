/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var SingleChoicePromptView = function (promptModel, isCustom) {
    "use strict";
    var that = AbstractChoicePromptView(promptModel, true, isCustom);

    that.isValid = function () {
        if (that.getNumberOfSelectedOptions() !== 1) {
            that.setErrorMessage("Please select a single option.");
            return false;
        }
        return true;
    };

    return that;
};