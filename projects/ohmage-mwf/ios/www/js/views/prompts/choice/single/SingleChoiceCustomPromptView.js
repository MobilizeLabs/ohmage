/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var SingleChoiceCustomPromptView = function (promptModel) {
    "use strict";
    return AbstractCustomChoicePromptView(promptModel, true);
};