/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var AbstractPromptView = function (promptModel) {
    "use strict";
    var that = {};

    that.getResponse = function () {
        return promptModel.getDefaultValue();
    };

    that.isValid = function () {
        return true;
    };

    /**
     *
     */
    that.render = function () {
        return (renderSupported()) ? getView()(promptModel) : promptViews.unsupported(promptModel);
    };

    return that;

};