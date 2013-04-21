/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var AbstractPromptView = function (promptModel) {
    "use strict";
    var that = {};

    var errorMessage;

    that.getResponse = function () {
        return promptModel.getDefaultValue();
    };

    that.isValid = function () {
        return true;
    };

    that.setErrorMessage = function (newErrorMessage) {
        errorMessage = newErrorMessage;
    };

    that.getErrorMessage = function () {
        return errorMessage;
    };

    that.render = function () {
        var div = document.createElement('div');
        div.innerHTML = "Please override render().";
        return div;
    };

    /**
     * In most practical sense, this is used for NumberPromptView to switch
     * between two types of view that represent the same prompt: number picker
     * and number input view.
     *
     * What this function actually does, is copy the common functions
     * between the current view and the specified view. Copy in a sense that we
     * replace the functions in that by functions in newView. So every time now
     * someone calls that.render(), we are actually  calling newView.render().
     *
     * Note that we cannot achieve this just by that = newView, because this is
     * not allowed (or at least, doesn't work) in JavaScript.
     *
     * @param newView The new view to replace the current view.
     */
    that.switchViewTo = function (newView) {
        var viewFunction;
        for (viewFunction in that) {
            if (that.hasOwnProperty(viewFunction) && newView.hasOwnProperty(viewFunction)) {
                that[viewFunction] = newView[viewFunction];
            }
        }
    };

    return that;

};