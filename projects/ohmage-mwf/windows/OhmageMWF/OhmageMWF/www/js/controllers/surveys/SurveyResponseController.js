var SurveyResponseController = function(surveyResponseModel){
    var self = {};
    
    
    var campaign = new Campaign(surveyResponseModel.getCampaignURN());
    var survey = campaign.getSurvey(surveyResponseModel.getSurveyID());
    
    
    self.render = function(){
        return new SurveyResponseView(self).render();
    };

    /**
     * Button callback that will initialize a survey response upload. If the
     * upload is successful, then a message is displayed to the user and then
     * the entire queue is displayed. If unsuccessful, an error message is
     * displayed and the user has the option to retry.
     */
    self.uploadSurveyResponseCallback = function() {
        var onSuccess = function(response){
            showMessage("Successfully uploaded your survey response.", function(){
                SurveyResponseModel.deleteSurveyResponse(surveyResponseModel);
                PageNavigation.openUploadQueueView();
            });
        };
        var onError = function(error){
            showMessage("Unable to upload survey response at this time. Please try again later.");
        };
        (new SurveyResponseUploader(survey, surveyResponseModel)).upload(onSuccess, onError);
    };

    /**
     * Button handler for deleting an individual survey response. The user
     * will be prompted for confirmation before deleting the survey response.
     */
    self.deleteSurveyResponseCallback = function(){
        var message = "Are you sure you would like to delete your response?";
        showConfirm(message, function(yes){
            if(yes){
                SurveyResponseModel.deleteSurveyResponse(surveyResponseModel);
                PageNavigation.openUploadQueueView();
            }
        }, "Yes,No");
    };
    
    self.getSurvey = function(){
        return survey;
    };
    
    self.getSurveyResponseModel = function(){
        return surveyResponseModel;
    };
    
    self.getCampaign = function(){
        return campaign;
    };
    
    return self;
};
