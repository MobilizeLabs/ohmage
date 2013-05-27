
var ItemController = function (surveyController) {
    "use strict";

    var that = {};

    var surveyModel = surveyController.getSurveyModel();

    /**
     * An array of items associated with the current survey.
     */
    var surveyItems = surveyModel.getItems();

    /**
     * The response object for the current survey.
     */
    var surveyResponse = SurveyResponseModel.init(surveyModel.getID(), surveyModel.getCampaign().getURN());

    /**
    * Stores the index of the currently displayed survey item. Initialized to
     * the first item at index 0.
    */
    var currentItemIndex = 0;

    /**
     * Callback for survey completed event. The actual response will not be
     * submitted but will be passed as a reference object to this callback.
     */
    var surveyCompletedCallback = null;

    /**
     * Message displayed to the user when exiting the current survey without
     * submitting.
     */
    var confirmToLeaveMessage = "Data from your current survey response will be lost. Are you sure you would like to continue?";

    /**
     * Returns currently displayed item. Returns null if current index is out
     * of bounds.
     *
     * @returns Current item.
     */
    var getCurrentItem = function () {
        return surveyItems[currentItemIndex] || null;
    };

    /**
     * Returns current survey item's condition.
     * @returns {String|null}
     */
    var getCurrentCondition = function () {
        return getCurrentItem().getCondition();
    };

    /**
     * Boolean method that returns true if the current condition of the prompt
     * fails.
     * @returns {Boolean}
     */
    var failsCondition = function () {
        var currentCondition = getCurrentCondition(),
            currentResponse  = surveyResponse.getResponses();
        return currentCondition &&
               !ConditionalParser.parse(currentCondition, currentResponse);
    };

    /**
     * Buffer that stores currently displayed/rendered items. This approach
     * is used for storing user entered data when the user goes to the previous
     * prompt.
     */
    var itemBuffer = {};

    /**
     * Method invoked when the user completes the survey and clicks submit.
     */
    var done = function () {
        surveyResponse.submit();
        surveyCompletedCallback(surveyResponse);
    };

    var processResponse = function (skipped) {
        var prompt = getCurrentItem();
        if (skipped) {
            if (!prompt.isSkippable()) {
                return false;
            }
            surveyResponse.setPromptSkipped(prompt.getID());
            return true;
        }

        //Handle invalid responses.
        if (!prompt.isValid()) {
            MessageDialogController.showMessage(prompt.getErrorMessage());
            return false;
        }

        //Save the response.
        surveyResponse.recordUserResponse(prompt.getID(), prompt.getResponse(), prompt.getType() === "photo");

        return true;
    };

    var nextPrompt = function (skipped) {
        if (processResponse(skipped)) {
            currentItemIndex += 1;
            while (currentItemIndex < surveyItems.length && failsCondition()) {
                surveyResponse.setPromptNotDisplayed(getCurrentItem().getID());
                currentItemIndex += 1;
            }
            render();
        }
    };

    var previousPrompt = function () {
        if (currentItemIndex > 0) {
            currentItemIndex -= 1;
        }

        //Skip all prompts that fail the condition.
        while (currentItemIndex > 0 && failsCondition()) {
            currentItemIndex -= 1;
        }

        render();

    };

    /**
     * Enables or disables next, previous, submit, and skip buttons.
     */

    var render = function () {

        //Clear the current contents of the main container.
        container.innerHTML = "";

        var controlButtons;

        //Render prompt if not at the last prompt.
        if (currentItemIndex < surveyItems.length) {

            //Displayed buffered prompts if possible, else render the prompt and
            //save the rendered content.
            if (!itemBuffer[getCurrentItem().getID()]) {
                container.appendChild(itemBuffer[getCurrentItem().getID()] = getCurrentItem().render());
            } else {
                container.appendChild(itemBuffer[getCurrentItem().getID()]);
            }

            controlButtons = getControlButtons(false);


        //Render submit page if at the last prompt.
        } else {

            var menu = mwf.decorator.Menu('Survey Completed');
            menu.addMenuTextItem('Done with ' + surveyModel.getTitle());
            container.appendChild(menu);

            controlButtons = getControlButtons(true);
        }

        container.appendChild(controlButtons);

    };

    /**
     * Fetches the current location and renders the first prompt.
     *
     * @param callback Function that will be invoked when the survey has been
     *                 completed.
     */
    that.start = function (callback) {

        if (ConfigManager.getGpsEnabled()) {
            //Update survey response geolocation information.
            surveyResponse.acquireLocation();
        }

        //Render the initial prompt.
        render();

        //Save the callback to be invoked when the survey has been completed.
        surveyCompletedCallback = callback;

        overrideBackButtonFunctionality();

    };

    /**
     * Aborts the current survey participation and deletes the users responses.
     * This method should be called to do the clean up before the user navigates
     * to another page without completing the survey.
     */
    that.abort = function () {
        resetBackButtonFunctionality();
        if (surveyResponse !== null && !surveyResponse.isSubmitted()) {
            SurveyResponseModel.deleteSurveyResponse(surveyResponse);
        }
    };

    /**
     * Method used for getting user's confirmation before exiting an incomplete
     * survey. In case of a positive confirmation, the current survey response
     * will be aborted response gets deleted from localStorage) and the
     * specified callback is invoked.
     *
     * @param positiveConfirmationCallback A callback invoked when the user
     *        confirms the current action.
     */
    that.confirmSurveyExit = function (positiveConfirmationCallback) {
        MessageDialogController.showConfirm(confirmToLeaveMessage, function (isResponseYes) {
            if (isResponseYes) {
                that.abort();
                if (typeof positiveConfirmationCallback === "function") {
                    positiveConfirmationCallback();
                }
            }
        }, "Yes,No");
    };

    return that;
};





