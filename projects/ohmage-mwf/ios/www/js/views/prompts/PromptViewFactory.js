/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var PromptViewFactory = (function () {
    "use strict";

    var that = {};

    /**
     * Maps prompt views to prompt view types.
     * @type {{}}
     */
    var promptViews = {
        "single_choice"        : "SingleChoicePromptView",
        "multi_choice"         : "MultiChoicePromptView",
        "single_choice_custom" : "SingleChoiceCustomPromptView",
        "multi_choice_custom"  : "MultiChoiceCustomPromptView",
        "number"               : "NumberPromptView",
        "hours_before_now"     : "NumberPromptView",
        "text"                 : "TextPromptView",
        "photo"                : "PhotoPromptView",
        "timestamp"            : "TimestampPromptView"
    };

    that.getView = function (promptModel) {
        var promptView = window[promptViews[promptModel.getType()]];
        if (promptView !== undefined) {
            return promptView(promptModel);
        }
        return UnsupportedPromptView(promptModel);
    };

    return that;

}());