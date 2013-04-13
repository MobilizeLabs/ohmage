/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var UnsupportedPromptView = function (promptModel) {
    "use strict";
    var that = AbstractPromptView(promptModel);

    that.getResponse = function () {
        return SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE;
    };

    that.render = function () {
        var menu = mwf.decorator.Menu(promptModel.getText());
        menu.addMenuTextItem("Unfortunately current prompt type is not supported.");
        return menu;
    };

    return that;
};