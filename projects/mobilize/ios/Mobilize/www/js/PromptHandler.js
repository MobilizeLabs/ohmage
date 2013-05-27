

/**
 * PromptHandler is responsible for rendering individual prompts and also
 * overriding prompt.getResponse() and prompt.isValid(), as appropriate.
 */
function PromptHandler(prompt){

    /**
     * Returns true if rendering for the current prompt is supported.
     * @return true if rendering for the current prompt is supported; false,
     *         otherwise.
     */
    this.renderSupported = function(){
       return typeof handlers[prompt.getType()] === 'function';
    };

    /**
     *
     */
    this.render = function() {
        return (this.renderSupported())? handlers[prompt.getType()](prompt) :
                                         handlers.unsupported(prompt);
    };
}

PromptHandler.Handlers = function(){

    /**
     * Namespace abbreviation for Mobile Web Framework JS Decorators library.
     */
    var mwfd = mwf.decorator;

    var createChoiceMenu = function(prompt, isSingleChoice, isCustom){

        var properties = prompt.getProperties();

        var menu = mwfd.Menu(prompt.getText());

        for(var i = 0; i < properties.length; i++){

            //Handle single choice prompts.
            if(isSingleChoice){
                menu.addMenuRadioItem(prompt.getID(),        //Name
                                      properties[i].key,     //Value
                                      properties[i].label);  //Label

            //Handle multiple choice prompts.
            } else {
                menu.addMenuCheckboxItem(prompt.getID(),       //Name
                                         properties[i].key,    //Value
                                         properties[i].label); //Label
            }

        }


        prompt.getResponse = function(){

            //If the prompt type allows custom choice, then extract the value
            //of the user selection instead of the provided answer key.
            var type = (isCustom) ? 'label' : 'value';

            //Handle single choice answers.
            if(isSingleChoice){
                return (menu.getSelectedOptions())[0][type];

            //Handle multiple choice answers.
            } else {
                var responses = [];
                var selection = menu.getSelectedOptions();

                for(var i = 0; i < selection.length; i++){
                    responses.push(selection[i][type]);
                }

                return responses;
            }

        };

        return menu;

    };

    var createCustomChoiceMenu = function(prompt, choice_menu, isSingleChoice){

        //Add an option in the menu for creating new options.
        choice_menu.addMenuIconItem('Add custom option', null, 'img/plus.png');

        choice_menu.getLastMenuItem().onclick = function(){
            form.style.display = 'block';
        };

        //Create the form for allowing the user to add a new option.
        var form = mwfd.Form('Custom Choice');

        //By default the custom choice form is hidden.
        form.style.display = 'none';

        //Add a new text box input field for specifying the new choice.
        form.addTextBox('new-choice', 'new-choice');

        var hideCustomChoiceMenu = function(){
            //Hide the 'add option button'.
            form.style.display = 'none';

            //Clear the user input textbox.
            document.getElementById('new-choice').value = "";

        };

        var addProperty = function(){

            //Get the value specified by the user.
            var newChoice = document.getElementById('new-choice').value;

            if(newChoice.length == 0){
                MessageDialogController.showMessage('Please specify an option to add.');
                return false;
            }

            //Create a new property with the value specified.
            var prop = prompt.addProperty(newChoice);

            //If the property is invalid, alert the user and cancel the add.
            if(!prop){
                MessageDialogController.showMessage('Option with that label already exists.');
                return false;
            }

            var addOptionItem = choice_menu.getLastMenuItem();

            choice_menu.removeMenuItem(addOptionItem);

            //Depending on if the choices are single-choice or multiple-choice,
            //add either a radio button menu item or a checkbox menu item.
            if(isSingleChoice){
                choice_menu.addMenuRadioItem(prompt.getID(), prop.key, prop.label);
            }else{
                choice_menu.addMenuCheckboxItem(prompt.getID(), prop.key, prop.label);
            }

            hideCustomChoiceMenu();

            choice_menu.addMenuItem(addOptionItem, true);

            return true;
        };

        form.addInputButton('Create New Choice', addProperty);
        form.addInputButton('Cancel', hideCustomChoiceMenu);

        //Cancel's form's default action to prevent the page from refreshing.
        $(form).submit(function(e){
           addProperty();
           e.preventDefault();
           return false;
        });

        //This continer will hold both prexisting options and the new option
        //form.
        var container = document.createElement('div');
        container.appendChild(choice_menu);
        container.appendChild(form);
        return container;
    };


    this.single_choice = function(prompt, isCustom){

        var choiceMenu = createChoiceMenu(prompt, true, isCustom);

        prompt.isValid = function(){

            if(choiceMenu.getSelectedOptions().length !== 1){
                prompt.setErrorMessage("Please select a single option.");
                return false;
            }

            return true;

        };

        return choiceMenu;

    };

    this.multi_choice = function(prompt, isCustom){

        var choiceMenu = createChoiceMenu(prompt, false, isCustom);

        prompt.isValid = function(){

            if(choiceMenu.getSelectedOptions().length === 0){
                prompt.setErrorMessage("Please select an option.");
                return false;
            }

            return true;
        };

        return choiceMenu;
    };


    this.single_choice_custom = function(prompt){
        return createCustomChoiceMenu(prompt, this.single_choice(prompt, true), true);
    };

    this.multi_choice_custom = function(prompt){
        return createCustomChoiceMenu(prompt, this.multi_choice(prompt, true), false);
    };

    this.hours_before_now = function(prompt){
        return this.number(prompt);
    };


    /**
     * Returns the default value for number prompts. If the default value for
     * the current prompt is not specified, then the method will use the minimum
     * value. If this is also null then zero will be returned.
     * @return Default value that should be used for number prompts.
     */
    var getNumberPromptDefaultValue = function(prompt){
        if(prompt.getDefaultValue() !== null){
            return prompt.getDefaultValue();
        } else if(prompt.getMinValue() !== null){
            return prompt.getMinValue();
        } else{
            return 0;
        }
    };


    var createNumberInput = function(prompt, defaultValue){

        var minValue = prompt.getMinValue();
        var maxValue = prompt.getMaxValue();

        var rangeMessage = "Please enter a number between " + minValue + " and " + maxValue + ", inclusive.";

        var isValueInRange = function(inputString){
            if(inputString === ""){return false;}
            var input = parseInt(inputString, 10);
            return (minValue <= input && input <= maxValue);
        };

        var isInteger = function(s) {
            return String(s).search (/^(\+|-)?\d+\s*$/) !== -1
        };

        var isSign = function(s){
            return String(s).search (/^(\+|-)?$/) !== -1
        };

        var validateNumberInputKeyPress = function(evt) {

            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode( key );

            var result = (evt.target || evt.srcElement).value + key;
            var cancelKey = function(){
                theEvent.returnValue = false;
                if(theEvent.preventDefault) {theEvent.preventDefault();}
            };

            if(!isSign(result)){
                if(!isInteger(key)) {
                    cancelKey();
                }
            }

        };

        var textBox = document.createElement('input');
        textBox.value = defaultValue || getNumberPromptDefaultValue(prompt);
        textBox.onkeypress = validateNumberInputKeyPress;

        var form = mwfd.Form(prompt.getText());
        form.addLabel(rangeMessage);
        form.addItem(textBox);

        prompt.isValid = function(){
            if( !isValueInRange(textBox.value) ){
                prompt.setErrorMessage(rangeMessage);
                return false;
            }
            return true;
        };

        prompt.getResponse = function(){
            return parseInt(textBox.value, 10);
        };

        var container = document.createElement('div');
        container.appendChild(mwfd.SingleClickButton("Switch to Number Picker", function(){
           container.innerHTML = "";
           container.appendChild(createNumberPicker(prompt, (isValueInRange(textBox.value))? prompt.getResponse():false));
        }));
        container.appendChild(form);
        return container;

    };

    var createNumberPicker = function(prompt, defaultValue){

        //Create the actual number counter field.
        var count = document.createElement('p');
        count.className = 'number-counter';

        count.innerHTML = defaultValue || getNumberPromptDefaultValue(prompt);

        //Get the minimum and maximum allowed values for this number prompt. It
        //is assumed that these values might be nulls.
        var maxValue = prompt.getMaxValue();
        var minValue = prompt.getMinValue();

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

        var menu = mwfd.Menu(prompt.getText());

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

        prompt.getResponse = function(){
            return parseInt(count.innerHTML, 10);
        };

        prompt.isValid = function(){
            return true;
        };

        TouchEnabledItemModel.bindTouchEvent(menuPlusItem, plus, addCallback);
        TouchEnabledItemModel.bindTouchEvent(menuMinusItem, minus, subtractCallback);

        var container = document.createElement('div');
        container.appendChild(mwfd.SingleClickButton("Switch to Number Input", function(){
            container.innerHTML = "";
            container.appendChild(createNumberInput(prompt, prompt.getResponse()));
        }));
        container.appendChild(menu);
        return container;
    };

    /**
     * This value determines the range that will default to number picker.
     */
    var MAX_RANGE_FOR_NUMBER_PICKER = 20;

    this.number = function(prompt){
        if(prompt.getMaxValue() - prompt.getMinValue() <= MAX_RANGE_FOR_NUMBER_PICKER){
            return createNumberPicker(prompt);
        }else{
            return createNumberInput(prompt);
        }
    };


    this.text = function(prompt){

        //Get the minimum and maximum text length allowed values for this
        //prompt. It is assumed that these values might be nulls.
        var maxValue = prompt.getMaxValue();
        var minValue = prompt.getMinValue();

        var form = mwfd.Form(prompt.getText());

        var textarea = document.createElement('textarea');

        form.addItem(textarea);

        prompt.isValid = function()
        {
            //Remove any heading or trailing white space.
            textarea.value = textarea.value.replace(/^\s+|\s+$/g,"");

            //Get the length of the user input text.
            var inputLength = textarea.value.length;

            if(inputLength < minValue){
                prompt.setErrorMessage("Please enter text more than " + minValue + " characters in length.");
                return false;
            }

            if(inputLength > maxValue){
                prompt.setErrorMessage("Please enter text no longer than " + maxValue + " characters.");
                return false;
            }

            return true;
        };

        prompt.getResponse = function()
        {
            //Removes white space from the response and returns it.
            return textarea.value.replace(/^\s+|\s+$/g,"");
        };

        return form;

    };

    this.photo = function(prompt){

        var container = document.createElement('div');

        var imgForm = mwf.decorator.Form('Image');
        imgForm.style.display = 'none';
        container.appendChild(imgForm);

        //This will store the image preview.
        var image = document.createElement('img');
        image.style.width = "100%";
        imgForm.addItem(image);

        //This is the method that will be called after the user takes a picture
        //or after the user uploads/selects a picture via the file input method.
        var recordImage = function(imageData, encode){

            //Display the capture image.
            image.src =  ((encode) ? "data:image/jpeg;base64," : "") + imageData;
            imgForm.style.display = 'block';

            //Save the image and store the returned UUID within the image's
            //alt attribute.
            image.alt = SurveyResponseModel.saveImage(imageData);

        };

        //Detect PhoneGap camera support. If possible, allow the user to take a
        //photo.
        if(navigator.camera){
            var takeImageButton = mwfd.SingleClickButton(prompt.getText(), function(){

                function onSuccess(imageData) {
                    recordImage(imageData, true);
                }

                function onFail(message) {
                    MessageDialogController.showMessage('Failed because: ' + message);
                }

                navigator.camera.getPicture(onSuccess, onFail, {quality: 25,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            });

            container.appendChild(takeImageButton);

        //Downgrade to file input form.
        } else {

            var fileInputForm = mwfd.Form(prompt.getText());

            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInputForm.addItem(fileInput);
            fileInput.onchange = function(){

                var input = this.files[0];

                if(input){
                    Base64.getBase64ImageFromInput(input, function(imageData){
                        recordImage(imageData, false);
                    });
                }else{
                    MessageDialogController.showMessage("Please select an image.");
                }

            }

            container.appendChild(fileInputForm);
        }


        prompt.isValid = function(){
            if(!image.alt){
                prompt.setErrorMessage("Please take an image to submit.");
                return false;
            }
            return true;
        };

        prompt.getResponse = function(){
            return image.alt;
        };

        return container;

    };

    this.timestamp = function(prompt){

        var date = new Date();
        var dateTimePicker = new DateTimePicker();
        var datePicker = dateTimePicker.createDatePicker(date);
        var timePicker = dateTimePicker.createTimePicker(date);

        prompt.isValid = function(){

            if(!datePicker.isValid()){
                prompt.setErrorMessage("Please specify date in the format: YYYY-MM-DD.");
                return false;

            } else if(!timePicker.isValid()){
                prompt.setErrorMessage("Please specify time in the format: HH-MM.");
                return false;
            }

            return true;
        };

        prompt.getResponse = function(){
            return datePicker.value + 'T' + timePicker.value + ":00";
        };

        return DateTimePicker.createDateTimeForm(prompt.getText(), datePicker, timePicker);

    };


    this.unsupported = function(prompt){

        var menu = mwfd.Menu(prompt.getText());

        menu.addMenuTextItem("Unfortunatly current prompt type is not supported.");

        prompt.getResponse = function(){
            return SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE;
        };

        return menu;
    };
}

var handlers = new PromptHandler.Handlers();