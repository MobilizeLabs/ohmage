
PromptView.renderNumberPrompt = (function () {

    /**
     * This value determines the range that will default to number picker.
     */
    var MAX_RANGE_FOR_NUMBER_PICKER = 20;

    /**
     * Returns the default value for number prompts. If the default value for
     * the current prompt is not specified, then the method will use the minimum
     * value. If this is also null then zero will be returned.
     * @return Default value that should be used for number prompts.
     */
    var getNumberPromptDefaultValue = function (promptModel) {
        if (promptModel.getDefaultValue() !== null) {
            return promptModel.getDefaultValue();
        } else if (promptModel.getMinValue() !== null) {
            return promptModel.getMinValue();
        } else {
            return 0;
        }
    };

    var createNumberPicker = function (promptModel, defaultValue) {

        //Create the actual number counter field.
        var count = document.createElement('p');
        count.className = 'number-counter';

        count.innerHTML = defaultValue || getNumberPromptDefaultValue(prompt);

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

        var menu = mwf.decorator.Menu(prompt.getText());

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
        var subtractCallback = function () {
            var currentValue = parseInt(count.innerHTML, 10);
            if(currentValue > minValue){
                count.innerHTML =  currentValue - 1;
            }
            updateSignStyle();
        };

        promptModel.getResponse = function () {
            return parseInt(count.innerHTML, 10);
        };

        promptModel.isValid = function () {
            return true;
        };

        TouchEnabledItemModel.bindTouchEvent(menuPlusItem, plus, addCallback);
        TouchEnabledItemModel.bindTouchEvent(menuMinusItem, minus, subtractCallback);

        var container = document.createElement('div');
        container.appendChild(mwf.decorator.SingleClickButton("Switch to Number Input", function(){
            container.innerHTML = "";
            container.appendChild(createNumberInput(promptModel.getResponse()));
        }));
        container.appendChild(menu);
        return container;
    };

    var createNumberInput = function (promptModel, defaultValue) {

        var minValue = promptModel.getMinValue();
        var maxValue = promptModel.getMaxValue();

        var rangeMessage = "Please enter a number between " + minValue + " and " + maxValue + ", inclusive.";

        var isValueInRange = function (inputString) {
            if(inputString === ""){return false;}
            var input = parseInt(inputString, 10);
            return (minValue <= input && input <= maxValue);
        };

        var isInteger = function (s) {
            return String(s).search (/^(\+|-)?\d+\s*$/) !== -1;
        };

        var isSign = function (s) {
            return String(s).search (/^(\+|-)?$/) !== -1;
        };

        var validateNumberInputKeyPress = function(evt) {

            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode( key );

            var result = (evt.target || evt.srcElement).value + key;
            var cancelKey = function () {
                theEvent.returnValue = false;
                if (theEvent.preventDefault) {
                    theEvent.preventDefault();
                }
            };

            if (!isSign(result)) {
                if (!isInteger(key)) {
                    cancelKey();
                }
            }

        };

        var textBox = document.createElement('input');
        textBox.value = defaultValue || getNumberPromptDefaultValue(promptModel);
        textBox.onkeypress = validateNumberInputKeyPress;

        var form = mwf.decorator.Form(prompt.getText());
        form.addLabel(rangeMessage);
        form.addItem(textBox);

        promptModel.isValid = function () {
            if (!isValueInRange(textBox.value)) {
                promptModel.setErrorMessage(rangeMessage);
                return false;
            }
            return true;
        };

        promptModel.getResponse = function () {
            return parseInt(textBox.value, 10);
        };

        var container = document.createElement('div');
        container.appendChild(mwf.decorator.SingleClickButton("Switch to Number Picker", function () {
           container.innerHTML = "";
           container.appendChild(createNumberPicker(promptModel, (isValueInRange(textBox.value))? promptModel.getResponse():false));
        }));
        container.appendChild(form);
        return container;

    };

    return function (promptModel) {
        if (promptModel.getMaxValue() - promptModel.getMinValue() <= MAX_RANGE_FOR_NUMBER_PICKER) {
            return createNumberPicker(promptModel);
        } else {
            return createNumberInput(promptModel);
        }
    };

}());

