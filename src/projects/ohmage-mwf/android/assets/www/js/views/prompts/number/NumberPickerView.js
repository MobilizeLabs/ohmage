/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var NumberPickerView = function (promptModel, defaultValue) {
    "use strict";
    var that = AbstractNumberPromptView(promptModel);

    var maxValue = promptModel.getMaxValue();

    var minValue = promptModel.getMinValue();

    var numberInputField;

    var plusSign;

    var minusSign;

    /**
     * Either disables or enables the +/- depending on if the value is below
     * or above the allowed range.
     */
    var updateSignStyle = function () {
        var currentValue = that.getResponse();
        plusSign.className = (currentValue < maxValue) ? 'math-sign plus' : 'math-sign-disabled plus';
        minusSign.className = (currentValue > minValue) ? 'math-sign minus' : 'math-sign-disabled minus';
    };

    that.getResponse = function () {
        return parseInt(numberInputField.innerHTML, 10);
    };

    that.render = function (currentValue) {

        numberInputField = document.createElement('p');
        numberInputField.className = 'number-counter';
        numberInputField.innerHTML = currentValue || that.getNumberPromptDefaultValue(promptModel);

        plusSign = document.createElement('p');
        plusSign.innerHTML = '+';

        minusSign = document.createElement('p');
        minusSign.innerHTML = '-';

        updateSignStyle();

        var menu = mwf.decorator.Menu(promptModel.getText());

        //Add the plus sign to the menu and configure the click event handler
        //for this item.
        var menuPlusItem = menu.addMenuItem(plusSign);
        var addCallback = function (e) {
            var currentValue = parseInt(numberInputField.innerHTML, 10);
            if (currentValue < maxValue) {
                numberInputField.innerHTML =  currentValue + 1;
            }
            updateSignStyle();
        };

        //Add the counter for the menu.
        menu.addMenuItem(numberInputField);

        //Add the minus sign to the menu and configure the click event handler
        //for this item.
        var menuMinusItem = menu.addMenuItem(minusSign);
        var subtractCallback = function (e) {
            var currentValue = parseInt(numberInputField.innerHTML, 10);
            if (currentValue > minValue) {
                numberInputField.innerHTML =  currentValue - 1;
            }
            updateSignStyle();
        };


        TouchEnabledItemModel.bindTouchEvent(menuPlusItem, plusSign, addCallback);
        TouchEnabledItemModel.bindTouchEvent(menuMinusItem, minusSign, subtractCallback);

        var container = document.createElement('div');
        container.appendChild(mwf.decorator.SingleClickButton("Switch to Number Input", function () {
            container.innerHTML = "";
            that.switchViewTo(NumberInputView(promptModel, that.getResponse()));
            container.appendChild(that.render());
        }));
        container.appendChild(menu);
        return container;
    };

    return that;
};