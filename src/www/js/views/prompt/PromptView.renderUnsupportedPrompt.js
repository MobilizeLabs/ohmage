PromptView.renderUnsupportedPrompt = function (promptModel) {

    var menu = mwf.decorator.Menu(promptModel.getText());

    menu.addMenuTextItem("Unfortunatly current prompt type is not supported.");

    promptModel.getResponse = function(){
        return SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE;
    };

    return menu;
};