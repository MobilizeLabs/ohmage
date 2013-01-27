
PromptView.renderTextPrompt = function (promptModel) {

    //Get the minimum and maximum text length allowed values for this
    //prompt. It is assumed that these values might be nulls.
    var maxValue = promptModel.getMaxValue();
    var minValue = promptModel.getMinValue();

    var form = mwf.decorator.Form(promptModel.getText());

    var textarea = document.createElement('textarea');

    form.addItem(textarea);

    promptModel.isValid = function () {
        
        //Remove any heading or trailing white space.
        textarea.value = textarea.value.replace(/^\s+|\s+$/g,"");

        //Get the length of the user input text.
        var inputLength = textarea.value.length;

        if (inputLength < minValue) {
            promptModel.setErrorMessage("Please enter text more than " + minValue + " characters in length.");
            return false;
        }

        if (inputLength > maxValue) {
            promptModel.setErrorMessage("Please enter text no longer than " + maxValue + " characters.");
            return false;
        }

        return true;
    };

    promptModel.getResponse = function () {
        //Removes white space from the response and returns it.
        return textarea.value.replace(/^\s+|\s+$/g,"");
    };

    return form;

};