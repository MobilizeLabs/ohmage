/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var AbstractNumberPromptView = function (promptModel) {
    "use strict";
    var that = AbstractPromptView(promptModel);

    /**
     * Returns the default value for number prompts. If the default value for
     * the current prompt is not specified, then the method will use the minimum
     * value. If this is also null, then zero will be returned.
     * @returns {Number} Default value that should be used for number prompts.
     */
    that.getNumberPromptDefaultValue = function (promptModel) {
        if (promptModel.getDefaultValue() !== null) {
            return promptModel.getDefaultValue();
        }

        if (promptModel.getMinValue() !== null) {
            return promptModel.getMinValue();
        }

        return 0;
    };

    return that;
};