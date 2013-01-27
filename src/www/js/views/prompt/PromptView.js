
var PromptView = (function () {

    var PROMPT_HANDLERS = {
        "single_choice"        : PromptView.renderSingleChoicePrompt,
        "single_choice_custom" : PromptView.renderSingleChoiceCustomPrompt,
        "multi_choice"         : PromptView.renderMultiChoicePrompt,
        "multi_choice_custom"  : PromptView.renderMultiChoiceCustomPrompt,
        "text"                 : PromptView.renderTextPrompt,
        "timestamp"            : PromptView.renderTimestampPrompt,
        "hours_before_now"     : PromptView.renderHoursBeforeNow,
        "unsupported"          : PromptView.renderUnsupportedPrompt
    };

    return function(promptModel) {
        var that = {};

        /**
        * Returns true if rendering for the current prompt is supported.
        * @return true if rendering for the current prompt is supported; false,
        *         otherwise.
        */
        that.renderSupported = function () {
            return typeof PROMPT_HANDLERS[promptModel.getType()] === 'function';
        };

        /**
        *
        */
        that.render = function () {
            return (that.renderSupported())? PROMPT_HANDLERS[promptModel.getType()](promptModel) :
                                            PROMPT_HANDLERS.unsupported(promptModel);
        };

        return that;
    };

}());

PromptView.createChoiceMenu = function (promptModel, isSingleChoice, isCustom) {

    var properties = promptModel.getProperties(),
        menu = mwf.decorator.Menu(promptModel.getText()),
        i;

    for (i = 0; i < properties.length; i += 1) {

        //Handle single choice prompts.
        if (isSingleChoice) {
            menu.addMenuRadioItem(promptModel.getID(),   //Name
                                  properties[i].key,     //Value
                                  properties[i].label);  //Label

        //Handle multiple choice prompts.
        } else {
            menu.addMenuCheckboxItem(promptModel.getID(),       //Name
                                     properties[i].key,    //Value
                                     properties[i].label); //Label
        }

    }

    promptModel.getResponse = function () {

        //If the prompt type allows custom choice, then extract the value
        //of the user selection instead of the provided answer key.
        var type = (isCustom) ? 'label' : 'value';

        //Handle single choice answers.
        if (isSingleChoice) {
            return (menu.getSelectedOptions())[0][type];

        //Handle multiple choice answers.
        } else {
            var responses = [],
                selection = menu.getSelectedOptions(),
                i;

            for (i = 0; i < selection.length; i += 1) {
                responses.push(selection[i][type]);
            }

            return responses;
        }

    };

    return menu;

};

PromptView.createCustomChoiceMenu = function (promptModel, choice_menu, isSingleChoice) {

    //Add an option in the menu for creating new options.
    choice_menu.addMenuIconItem('Add custom option', null, 'img/plus.png');

    choice_menu.getLastMenuItem().onclick = function () {
        form.style.display = 'block';
    };

    //Create the form for allowing the user to add a new option.
    var form = mwf.decorator.Form('Custom Choice');

    //By default the custom choice form is hidden.
    form.style.display = 'none';

    //Add a new text box input field for specifying the new choice.
    form.addTextBox('new-choice', 'new-choice');

    var hideCustomChoiceMenu = function () {
        //Hide the 'add option button'.
        form.style.display = 'none';

        //Clear the user input textbox.
        document.getElementById('new-choice').value = "";

    };

    var addProperty = function () {

        //Get the value specified by the user.
        var newChoice = document.getElementById('new-choice').value;

        if (newChoice.length === 0) {
            MessageDialogController.showMessage('Please specify an option to add.');
            return false;
        }

        //Create a new property with the value specified.
        var prop = promptModel.addProperty(newChoice);

        //If the property is invalid, alert the user and cancel the add.
        if (!prop) {
            MessageDialogController.showMessage('Option with that label already exists.');
            return false;
        }

        var addOptionItem = choice_menu.getLastMenuItem();

        choice_menu.removeMenuItem(addOptionItem);

        //Depending on if the choices are single-choice or multiple-choice,
        //add either a radio button menu item or a checkbox menu item.
        if (isSingleChoice) {
            choice_menu.addMenuRadioItem(promptModel.getID(), prop.key, prop.label);
        }else{
            choice_menu.addMenuCheckboxItem(promptModel.getID(), prop.key, prop.label);
        }

        hideCustomChoiceMenu();

        choice_menu.addMenuItem(addOptionItem, true);

        return true;
    };

    form.addInputButton('Create New Choice', addProperty);
    form.addInputButton('Cancel', hideCustomChoiceMenu);

    //Cancel's form's default action to prevent the page from refreshing.
    $(form).submit(function (e) {
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
