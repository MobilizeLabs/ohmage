/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var NumberPromptView = function (promptModel) {
    "use strict";

    var that;

    /**
     * This value determines the range that will default to number picker.
     */
    var MAX_RANGE_FOR_NUMBER_PICKER = 20;

    if (promptModel.getMaxValue() - promptModel.getMinValue() <= MAX_RANGE_FOR_NUMBER_PICKER) {
        that = NumberPickerView(promptModel);
    } else {
        that = NumberInputView(promptModel);
    }

    return that;
};