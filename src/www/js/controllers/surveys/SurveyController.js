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
    var surveyResponse = null;

    /**
     * Stores the index of the currently displayed survey item. Initialized to
     * the first item at index 0.
     */
    var currentItemIndex = 0;

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
    var currentItemFailsCondition = function () {
        var currentCondition = getCurrentCondition(),
            currentResponse  = surveyResponse.getResponses();
        return currentCondition &&
            !ConditionalParser.parse(currentCondition, currentResponse);
    };

    /**
     * Whether the user has uploaded the survey response, or has chosen to wait
     * and upload the survey response later (or failed to upload the response),
     * this method will be eventually called to redirect the user to the next
     * page.
     */
    var afterSurveyCompleted = function () {
        PageController.goBack();
    };

    var onUploadConfirmCallback = function (yesUploadNow) {

        if (yesUploadNow) {

            var uploader = SurveyResponseUploadService(surveyModel, surveyResponse),
                onSuccess = function (response) {
                    MessageDialogController.showMessage("Successfully uploaded your survey response.", function () {
                        SurveyResponseStoreModel.deleteSurveyResponse(surveyResponse);
                        afterSurveyCompleted();
                    });
                },
                onError = function (error) {
                    MessageDialogController.showMessage("Unable to upload your survey response at this time.", afterSurveyCompleted);
                };

            uploader.upload(onSuccess, onError, ConfigManager.getGpsEnabled());

        } else {
            MessageDialogController.showMessage("Your survey response has been saved. You may upload it any time from the survey upload queue.", function () {
                afterSurveyCompleted();
            });
        }
    };

    /**
     * Callback for when the user completes taking survey.
     */
    var submitCallback = function () {

        surveyResponse.submit();

        ReminderModel.supressSurveyReminders(surveyModel.getID());

        //Confirmation box related properties.
        var buttonLabels = 'Yes,No';
        var message = "Would you like to upload your response?";

        if (ConfigManager.getConfirmToUploadOnSubmit()) {
            MessageDialogController.showConfirm(message, onUploadConfirmCallback, buttonLabels);
        } else {
            onUploadConfirmCallback(true);
        }

    };

    var recordSkippedResponse = function () {
        surveyResponse.setPromptSkipped(that.getCurrentItem().getID());
    };

    var recordPromptResponse = function () {
        var currentPromptModel = that.getCurrentItem(),
            currentPromptResponse = surveyView.getCurrentItemView().getResponse();
        surveyResponse.recordUserResponse(currentPromptModel.getID(), currentPromptResponse, currentPromptModel.getType() === "photo");
        return true;
    };

    var renderNextItem = function () {
        currentItemIndex += 1;
        while (currentItemIndex < surveyItems.length && currentItemFailsCondition()) {
            surveyResponse.setPromptNotDisplayed(that.getCurrentItem().getID());
            currentItemIndex += 1;
        }
        surveyView.render();
    };

    var skipItem = function () {
        recordSkippedResponse();
        renderNextItem();
    };

    var goToNextItem = function () {
        var itemView = surveyView.getCurrentItemView();
        if (itemView.isValid()) {
            recordPromptResponse();
            renderNextItem();
        } else {
            MessageDialogController.showMessage(itemView.getErrorMessage());
        }
    };

    var goToPreviousItem = function () {
        if (currentItemIndex > 0) {
            currentItemIndex -= 1;
        }

        //Skip all prompts that fail the condition.
        while (currentItemIndex > 0 && currentItemFailsCondition()) {
            currentItemIndex -= 1;
        }

        surveyView.render();
    };

    that.initializeSurvey = function () {
        surveyResponse = SurveyResponseModel(surveyModel.getID(), surveyModel.getCampaign().getURN());
        if (ConfigManager.getGpsEnabled()) {
            surveyResponse.acquireLocation();
        }
    };

    that.getView = function () {
        if (surveyView === null) {
            surveyView = SurveyView(that);
            surveyView.nextButtonCallback = goToNextItem;
            surveyView.skipButtonCallback = skipItem;
            surveyView.previousButtonCallback = goToPreviousItem;
            surveyView.submitButtonCallback = submitCallback;
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
        var confirmToLeaveMessage = "Data from your current survey response will be lost. Are you sure you would like to continue?";
        MessageDialogController.showConfirm(confirmToLeaveMessage, function (isResponseYes) {
            if (isResponseYes) {
                abort();
                if (typeof positiveConfirmationCallback === "function") {
                    positiveConfirmationCallback();
                }
            }
        }, "Yes,No");
    };

    return that;
};
