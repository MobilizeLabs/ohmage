/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var AbstractChoicePromptView = function (promptModel, isSingleChoice, isCustom) {
    "use strict";
    var that = AbstractPromptView(promptModel);

    var properties = promptModel.getProperties();

    var choiceMenu = null;

    that.getNumberOfSelectedOptions = function () {
        return choiceMenu.getSelectedOptions().length;
    };

    that.getChoiceMenu = function () {
        return choiceMenu;
    };

    that.getResponse = function () {

        //If the prompt type allows custom choice, then extract the value
        //of the user selection instead of the provided answer key.
        var type = isCustom ? 'label' : 'value';

        //Handle single choice answers.
        if (isSingleChoice) {
            return (choiceMenu.getSelectedOptions())[0][type];
        }

        //Handle multi choice answers.
        var responses = [],
            selection = choiceMenu.getSelectedOptions(),
            i;

        for (i = 0; i < selection.length; i += 1) {
            responses.push(selection[i][type]);
        }

        return responses;

    };

    that.render = function () {
        var key,
            promptModelID = promptModel.getID();
        if (choiceMenu === null) {
            choiceMenu = mwf.decorator.Menu(promptModel.getText());
            for (key in properties) {
                if (properties.hasOwnProperty(key)) {
                    if (isSingleChoice) {
                        choiceMenu.addMenuRadioItem(promptModelID, key, properties[key]);
                    } else {
                        choiceMenu.addMenuCheckboxItem(promptModelID, key, properties[key]);
                    }
                }
            }

        }
        return choiceMenu;

    };

    return that;
};