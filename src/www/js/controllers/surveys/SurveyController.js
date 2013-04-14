var SurveyController = function (surveyModel) {
    "use strict";
    var that = {};

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
     * Message displayed to the user when exiting the current survey without
     * submitting.
     */
    var confirmToLeaveMessage = "Data from your current survey response will be lost. Are you sure you would like to continue?";

    var surveyView = null;

    /**
     * Returns current survey item's condition.
     * @returns {String|null}
     */
    var getCurrentCondition = function () {
        return that.getCurrentItem().getCondition();
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
     * Callback for when the user completes taking survey.
     */
    var onSurveyComplete = function (surveyResponse) {

        surveyResponse.submit();
        surveyCompletedCallback(surveyResponse);

        ReminderModel.supressSurveyReminders(surveyModel.getID());

        //Confirmation box related properties.
        var title = 'ohmage';
        var buttonLabels = 'Yes,No';
        var message = "Would you like to upload your response?";


        if (ConfigManager.getConfirmToUploadOnSubmit()) {
            MessageDialogController.showConfirm(message, onUploadConfirmCallback, buttonLabels, title);
        } else {
            onUploadConfirmCallback(true);
        }

        if (DeviceDetection.isNativeApplication()) {
            PageController.goBack();
        } else {
            window.onbeforeunload = null;
            close();
        }

    };

    var onUploadConfirmCallback = function (yes) {

        //Yes upload my response now.
        if (yes) {

            var uploader = new SurveyResponseUploadController(surveyModel, surveyResponse);

            var onSuccess = function (response) {
                MessageDialogController.showMessage("Successfully uploaded your survey response.", function () {
                    SurveyResponseModel.deleteSurveyResponse(surveyResponse);
                    afterSurveyComplete();
                });
            };

            var onError = function (error) {
                MessageDialogController.showMessage("Unable to upload your survey response at this time.", afterSurveyComplete);
            };

            uploader.upload(onSuccess, onError, ConfigManager.getGpsEnabled());

        } else {
            MessageDialogController.showMessage("Your survey response has been saved. You may upload it any time from the survey upload queue.", function () {
                afterSurveyComplete();
            });
        }
    };

    var processResponse = function (skipped) {
        var prompt = that.getCurrentItem();
        if (skipped) {
            if (!prompt.isSkippable()) {
                return false;
            }
            surveyResponse.promptSkipped(prompt.getID());
            return true;
        }

        //Handle invalid responses.
        if (!prompt.isValid()) {
            MessageDialogController.showMessage(prompt.getErrorMessage());
            return false;
        }

        //Save the response.
        surveyResponse.respond(prompt.getID(), prompt.getResponse(), prompt.getType() === "photo");

        return true;
    };

    var nextPrompt = function (skipped) {
        if (processResponse(skipped)) {
            currentItemIndex += 1;
            while (currentItemIndex < surveyItems.length && failsCondition()) {
                surveyResponse.promptNotDisplayed(that.getCurrentItem().getID());
                currentItemIndex += 1;
            }
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

    };


    /**
     * Aborts the current survey participation and deletes the users responses.
     * This method should be called to do the clean up before the user navigates
     * to another page without completing the survey.
     */
    var abort = function () {
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
    var confirmSurveyExit = function (positiveConfirmationCallback) {
        MessageDialogController.showConfirm(confirmToLeaveMessage, function (isResponseYes) {
            if (isResponseYes) {
                abort();
                if (typeof positiveConfirmationCallback === "function") {
                    positiveConfirmationCallback();
                }
            }
        }, "Yes,No");
    };

    /**
     * Fetches the current location and renders the first prompt.
     */
    that.startSurvey = function () {
        if (ConfigManager.getGpsEnabled()) {
            surveyResponse.setLocation();
        }
    };

    that.getView = function () {
        if (surveyView === null) {
            surveyView = SurveyView(that);
        }
        return surveyView;

    };

    /**
     * Returns the survey model associated with this controller.
     * @returns {SurveyModel}
     */
    that.getSurveyModel = function () {
        return surveyModel;
    };

    that.isOnFirstItem = function () {
        return currentItemIndex === 0;
    };

    that.isOnSubmitPage = function () {
        return currentItemIndex === surveyItems.length;
    };

    /**
     * Returns currently displayed item. Returns null if current index is out
     * of bounds.
     *
     * @returns Current item.
     */
    that.getCurrentItem = function () {
        return surveyItems[currentItemIndex] || null;
    };

    return that;
};
