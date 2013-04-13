/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var NumberPickerView = function (promptModel, defaultValue) {
    "use strict";
    var that = AbstractNumberPromptView(promptModel);


    that.getResponse = function () {
        return parseInt(count.innerHTML, 10);
    };

    that.render = function () {

        //Create the actual number counter field.
        var count = document.createElement('p');
        count.className = 'number-counter';

        count.innerHTML = defaultValue || that.getNumberPromptDefaultValue(promptModel);

        //Get the minimum and maximum allowed values for this number prompt. It
        //is assumed that these values might be nulls.
        var maxValue = promptModel.getMaxValue();
        var minValue = promptModel.getMinValue();

        //Create the plus sign.
        var plus = document.createElement('p');
        plus.innerHTML = '+';

        //Create the minus sign.
        var minus = document.createElement('p');
        minus.innerHTML = '-';

        //Either disables or enables the +/- depending on if the value is below
        //or above the allowed range.
        var updateSignStyle = function(){

            //Get the integerer representation of the current value.
            var currentValue = parseInt(count.innerHTML, 10);

            plus.className = (currentValue < maxValue)? 'math-sign plus' :
                'math-sign-disabled plus';

            minus.className = (currentValue > minValue)? 'math-sign minus' :
                'math-sign-disabled minus';
        };

        updateSignStyle();

        var menu = mwfd.Menu(promptModel.getText());

        //Add the plus sign to the menu and configure the click event handler
        //for this item.
        var menuPlusItem = menu.addMenuItem(plus);
        var addCallback = function(e){
            var currentValue = parseInt(count.innerHTML, 10);
            if(currentValue < maxValue){
                count.innerHTML =  currentValue + 1;
            }
            updateSignStyle();
        };

        //Add the counter for the menu.
        menu.addMenuItem(count);

        //Add the minus sign to the menu and configure the click event handler
        //for this item.
        var menuMinusItem = menu.addMenuItem(minus);
        var subtractCallback = function(e){
            var currentValue = parseInt(count.innerHTML, 10);
            if(currentValue > minValue){
                count.innerHTML =  currentValue - 1;
            }
            updateSignStyle();
        };


        TouchEnabledItemModel.bindTouchEvent(menuPlusItem, plus, addCallback);
        TouchEnabledItemModel.bindTouchEvent(menuMinusItem, minus, subtractCallback);

        var container = document.createElement('div');
        container.appendChild(mwfd.SingleClickButton("Switch to Number Input", function(){
            container.innerHTML = "";
            container.appendChild(createNumberInput(promptModel, promptModel.getResponse()));
        }));
        container.appendChild(menu);
        return container;
    };

    return that;
};