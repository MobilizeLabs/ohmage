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
        return choiceMenu();
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
        var i;
        if (choiceMenu === null) {
            choiceMenu = mwf.decorator.Menu(promptModel.getText());

            for (i = 0; i < properties.length; i  += 1) {

                //Handle single choice prompts.
                if (isSingleChoice) {
                    choiceMenu.addMenuRadioItem(promptModel.getID(),   //Name
                                          properties[i].key,     //Value
                                          properties[i].label);  //Label

                //Handle multiple choice prompts.
                } else {
                    choiceMenu.addMenuCheckboxItem(promptModel.getID(),  //Name
                                             properties[i].key,    //Value
                                             properties[i].label); //Label
                }

            }
        }

        return choiceMenu;

    };

    return that;
};