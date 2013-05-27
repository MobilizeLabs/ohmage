var SurveyResponseView = function(surveyResponseController){
    var self = {};

    var campaign = surveyResponseController.getCampaign();
    var survey = surveyResponseController.getSurvey();
    var surveyResponseModel = surveyResponseController.getSurveyResponseModel();

    var renderSurveyResponseDetailsView = function(){
        var location = surveyResponseModel.getLocation();
        var surveyResponseDetailsView = mwf.decorator.Menu(survey.getTitle());
        surveyResponseDetailsView.addMenuLinkItem("Campaign", null, campaign.getName());
        surveyResponseDetailsView.addMenuLinkItem("Survey", null, survey.getTitle());
        surveyResponseDetailsView.addMenuLinkItem("Time Submitted", null, surveyResponseModel.getSubmitDateString());
        surveyResponseDetailsView.addMenuLinkItem("GPS Status", null, surveyResponseModel.getLocationStatus());
        if(location !== null){
            surveyResponseDetailsView.addMenuLinkItem("GPS Location", null, location.latitude + ", " + location.longitude);
        }

        $(surveyResponseDetailsView).find("a").css('background', "transparent");
        return surveyResponseDetailsView;
    };

    var renderUserResponsesView = function(){
        var userResponsesView = mwf.decorator.Menu("User Responses");
        for (var promptID in surveyResponseModel.data._responses) {
            var prompt = survey.getPrompt(promptID);
            var value  = surveyResponseModel.data._responses[promptID].value;

            // Don't display prompts that were conditionally not displayed.
            if( value === SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE ) {
                continue;
            }

            userResponsesView.addMenuLinkItem(prompt.getText(), null, prompt.summarizeResponse(value));
        }
        $(userResponsesView).find("a").css('background', "transparent");
        return userResponsesView;
    };

    self.render = function(){
        var surveyResponseDetailsView = renderSurveyResponseDetailsView();
        var userResponsesView = renderUserResponsesView();
        userResponsesView.style.display = "none";
        var controlButtons = mwf.decorator.DoubleClickButton("Delete", surveyResponseController.deleteSurveyResponseCallback,
                                                             "Upload", surveyResponseController.uploadSurveyResponseCallback);
        var displayUserResponsesButton = mwf.decorator.SingleClickButton("View User Responses", function(){
            if(displayUserResponsesButton.getLabel() === "View User Responses"){
                displayUserResponsesButton.setLabel("Hide User Responses");
                userResponsesView.style.display = "block";
            }else{
                userResponsesView.style.display = "none";
                displayUserResponsesButton.setLabel("View User Responses");
            }
        });
        var surveyResponseViewContainer = document.createElement('div');
        surveyResponseViewContainer.appendChild(surveyResponseDetailsView);
        surveyResponseViewContainer.appendChild(controlButtons);
        surveyResponseViewContainer.appendChild(displayUserResponsesButton);
        surveyResponseViewContainer.appendChild(userResponsesView);
        surveyResponseViewContainer.appendChild(mwf.decorator.SingleClickButton("Upload Queue", PageNavigation.openUploadQueueView));
        return surveyResponseViewContainer;
    };

    return self;
};