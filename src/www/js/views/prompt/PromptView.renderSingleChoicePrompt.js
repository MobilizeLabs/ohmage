

//return createCustomChoiceMenu(prompt, this.single_choice(prompt, true), true);
PromptView.renderSingleChoicePrompt = function (promptModel, isCustom) {
    
    var choiceMenu = PromptView.createChoiceMenu(promptModel, true, isCustom);

    promptModel.isValid = function () {

        if (choiceMenu.getSelectedOptions().length !== 1) {
            promptModel.setErrorMessage("Please select a single option.");
            return false;
        }
        return true;
    };
    
    return choiceMenu;
    
};

  