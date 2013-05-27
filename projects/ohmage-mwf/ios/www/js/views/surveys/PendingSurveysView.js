/**
 * @author Zorayr Khalapyan
 */
var PendingSurveysView = function (pendingSurveys) {
    "use strict";
    var that = AbstractView();

    that.onSurveyClickCallback = function (surveyModel) {};

    that.render = function () {
        var container = document.createElement("div"),
            surveyListView = SurveyListView("Pending Surveys", pendingSurveys);
        surveyListView.onSurveyClickCallback = that.onSurveyClickCallback;
        surveyListView.setEmptyListViewParameters("You have no pending surveys.",
            "Please navigate to the reminders to set new notifications.",
            PageController.openReminders);
        container.appendChild(surveyListView.render());
        container.appendChild(mwf.decorator.SingleClickButton("View Reminders", function () {
            PageController.openReminders();
        }));
        return container;
    };

    return that;
};
