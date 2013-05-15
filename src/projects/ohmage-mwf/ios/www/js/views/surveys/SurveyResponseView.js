/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */
var SurveyResponseView = function (surveyResponseController) {
    "use strict";
    var that = AbstractView();

    var campaignModel = surveyResponseController.getCampaign();
    var surveyModel = surveyResponseController.getSurvey();
    var surveyResponseModel = surveyResponseController.getSurveyResponseModel();

    var renderSurveyResponseDetailsView = function () {
        var location = surveyResponseModel.getLocation(),
            surveyResponseDetailsView = mwf.decorator.Menu(surveyModel.getTitle());
        surveyResponseDetailsView.addMenuLinkItem("Campaign", null, campaignModel.getName());
        surveyResponseDetailsView.addMenuLinkItem("Survey", null, surveyModel.getTitle());
        surveyResponseDetailsView.addMenuLinkItem("Time Submitted", null, surveyResponseModel.getSubmitDateString());
        surveyResponseDetailsView.addMenuLinkItem("GPS Status", null, surveyResponseModel.getLocationStatus());
        if (location !== null) {
            surveyResponseDetailsView.addMenuLinkItem("GPS Location", null, location.latitude + ", " + location.longitude);
        }
        $(surveyResponseDetailsView).find("a").css('background', "transparent");
        return surveyResponseDetailsView;
    };

    var renderUserResponsesView = function () {
        var userResponsesView = mwf.decorator.Menu("User Responses"),
            userResponses = surveyResponseModel.getResponses(),
            promptModel,
            userResponseValue,
            promptID;

        for (promptID in userResponses) {
            if (userResponses.hasOwnProperty(promptID)) {
                promptModel = surveyModel.getItem(promptID);
                userResponseValue  = userResponses[promptID];
                // Don't display prompts that were conditionally not displayed.
                if (userResponseValue !== surveyResponseModel.getNotDisplayedPromptValue()) {
                    userResponsesView.addMenuLinkItem(promptModel.getText(), null, promptModel.summarizeResponse(userResponseValue));
                }

            }
        }
        $(userResponsesView).find("a").css('background', "transparent");
        return userResponsesView;
    };

    that.render = function () {
        var surveyResponseDetailsView = renderSurveyResponseDetailsView();
        var userResponsesView = renderUserResponsesView();
        userResponsesView.style.display = "none";
        var controlButtons = mwf.decorator.DoubleClickButton("Delete", that.deleteSurveyResponseCallback,
                                                             "Upload", that.uploadSurveyResponseCallback);
        var displayUserResponsesButton = mwf.decorator.SingleClickButton("View User Responses", function () {
            if (displayUserResponsesButton.getLabel() === "View User Responses") {
                displayUserResponsesButton.setLabel("Hide User Responses");
                userResponsesView.style.display = "block";
            } else {
                userResponsesView.style.display = "none";
                displayUserResponsesButton.setLabel("View User Responses");
            }
        });
        var surveyResponseViewContainer = document.createElement('div');
        surveyResponseViewContainer.appendChild(surveyResponseDetailsView);
        surveyResponseViewContainer.appendChild(controlButtons);
        surveyResponseViewContainer.appendChild(displayUserResponsesButton);
        surveyResponseViewContainer.appendChild(userResponsesView);
        surveyResponseViewContainer.appendChild(mwf.decorator.SingleClickButton("Upload Queue", PageController.openQueue));
        return surveyResponseViewContainer;
    };


    that.deleteSurveyResponseCallback = function () {};
    that.uploadSurveyResponseCallback = function () {};

    return that;
};