
var SurveyController = function (surveyModel) {

    var that = {};

    /**
     * Callback for when the user completes the survey.
     */
    var onSurveyComplete = function (surveyResponse) {

        ReminderModel.supressSurveyReminders(surveyModel.getID());

        var afterSurveyComplete = function () {
            PageNavigation.goBack();
        };

        //Confirmation box related properties.
        var title = 'ohmage';
        var buttonLabels = 'Yes,No';
        var message = "Would you like to upload your response?";
        var callback = function (yes) {

            //Yes upload my response now.
            if (yes) {

                var uploader = new SurveyResponseUploadController( surveyModel, surveyResponse);

                var onSuccess = function () {
                    MessageDialogController.showMessage( "Successfully uploaded your survey response.", function () {
                        SurveyResponseModel.deleteSurveyResponse( surveyResponse );
                        afterSurveyComplete();
                    });

                };

                var onError = function () {
                    MessageDialogController.showMessage( "Unable to upload your survey response at this time.", afterSurveyComplete );
                };

                uploader.upload(onSuccess, onError, ConfigManager.getGpsEnabled());

            } else {
                afterSurveyComplete();
            }
        };

        if( ConfigManager.getConfirmToUploadOnSubmit() ) {
            MessageDialogController.showConfirm( message, callback, buttonLabels, title );
        }else{
            callback( true );
        }

    };

    /**
     * If the survey is currently rendered, this stores the PromptController
     * object used to iterate through different prompts.
     */
    that.promptController = null;

    /**
     * Starts a new PromptController object with the current survey. This method
     * should be used to start off the survey. The prompts will be displayed one
     * by one, user response will be gathered in a SurveyResponse, etc.
     */
    that.start = function( container ) {

        //Start the actual survey.
        that.promptController = new PromptController( that, container );
        that.promptController.start( onSurveyComplete );

        return that.promptController;
    };

    /**
     * Returns the survey model associated with this controller.
     */
    that.getSurveyModel = function() {
        return surveyModel;
    };

    return that;

};
