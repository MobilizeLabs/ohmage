
/**
 * return createCustomChoiceMenu(prompt, this.multi_choice(prompt, true), false);
 */
PromptView.renderMultiChoicePrompt = function (promptModel, isCustom) {

    var choiceMenu = PromptView.createChoiceMenu(promptModel, false, isCustom);

    promptModel.isValid = function () {

        if (choiceMenu.getSelectedOptions().length === 0) {
            promptModel.setErrorMessage("Please select an option.");
            return false;
        }

        return true;
    };

    return choiceMenu;
};
