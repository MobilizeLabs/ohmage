/**
 * This view can be used to display the title and the description of the survey
 * before starting the survey (which means you start taking the prompts etc.
 * @param surveyModel The survey model to represent.
 *
 * @returns {{}}
 * @author Zorayr Khalapyan
 * @constructor
 */
var SurveyStartView = function (surveyModel) {
    "use strict";
    var that = {};

    that.startSurveyButtonHandler = function () {};

    that.renderSummary = function () {
        var content = mwf.decorator.Content();
        content.setTitle(surveyModel.getTitle());
        content.addTextBlock(surveyModel.getDescription());
        return content;
    };

    that.render = function () {
        var container = document.createElement('div');
        container.appendChild(that.renderSummary());
        container.appendChild(mwf.decorator.SingleClickButton("Start Survey", that.startSurveyButtonHandler));
        return container;
    };

    return that;
};