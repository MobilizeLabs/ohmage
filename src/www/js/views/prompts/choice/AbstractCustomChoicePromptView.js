/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 * @constructor
 * @param promptModel {PromptModel}
 * @param isSingleChoice {Boolean}
 */
var AbstractCustomChoicePromptView = function (promptModel, isSingleChoice) {
    "use strict";
    var that;

    if (isSingleChoice) {
        that = SingleChoicePromptView(promptModel, true);
    } else {
        that = MultiChoicePromptView(promptModel, true);
    }

    /**
     * Since we are going to rename that.render, we will need to keep a
     * reference of the original render function. This is similar to calling
     * super.render etc.
     */
    var renderChoiceView = that.render;

    /**
     * Menu view that stores all the answer options.
     */
    var choiceMenu;

    var newChoiceForm = null;

    /**
     * The text field where the user types in the new input.
     */
    var newChoiceField;

    /**
     * Hides the new choice form and clears the new choice input field.
     */
    var hideCustomChoiceMenu = function () {
        newChoiceForm.style.display = 'none';
        newChoiceField.value = "";
    };

    /**
     * First removes the last item in the choice menu (which is the button that
     * allows users to add a new option), then adds either a radio menu item or
     * a checkbox menu item depending on the type of prompt, and then adds the
     * last menu item back onto the menu.
     * @param key {String} The key to be the name of the new menu item.
     * @param label {String} The display value of the new menu item.
     */
    var addNewOptionToMenu = function (key, label) {
        var addOptionItem = choiceMenu.getLastMenuItem();
        choiceMenu.removeMenuItem(addOptionItem);
        if (isSingleChoice) {
            choiceMenu.addMenuRadioItem(promptModel.getID(), key, label);
        } else {
            choiceMenu.addMenuCheckboxItem(promptModel.getID(), key, label);
        }
        choiceMenu.addMenuItem(addOptionItem, true);
    };

    var addNewChoiceCallback = function () {

        var newChoiceValue = newChoiceField.value,
            newPropertyKey;

        if (newChoiceValue.length === 0) {
            MessageDialogController.showMessage('Please specify an option to add.');
            return false;
        }

        if (promptModel.isDuplicatePropertyLabel(newChoiceValue)) {
            MessageDialogController.showMessage('Option with that label already exists.');
            return false;
        }

        newPropertyKey = promptModel.addProperty(newChoiceValue);
        addNewOptionToMenu(newPropertyKey, newChoiceValue);
        hideCustomChoiceMenu();

        return true;

    };

    /**
     * Create the form for allowing the user to add a new option. By default the
     * form is hidden.
     */
    var createNewChoiceForm = function () {
        if (newChoiceForm === null) {
            newChoiceForm = mwf.decorator.Form('Custom Choice');
            newChoiceField = document.createElement('input');
            newChoiceForm.addItem(newChoiceField);
            newChoiceForm.addInputButton('Create New Choice', addNewChoiceCallback);
            newChoiceForm.addInputButton('Cancel', hideCustomChoiceMenu);
            newChoiceForm.setOnSubmitCallback(addNewChoiceCallback);
            newChoiceForm.style.display = 'none';
        }
    };

    that.render = function () {
        renderChoiceView();
        createNewChoiceForm();

        choiceMenu = that.getChoiceMenu();
        choiceMenu.addMenuIconItem('Add custom option', null, 'img/plus.png');
        choiceMenu.getLastMenuItem().onclick = function () {
            newChoiceForm.style.display = 'block';
        };

        var container = document.createElement('div');
        container.appendChild(choiceMenu);
        container.appendChild(newChoiceForm);
        return container;
    };

    return that;
};