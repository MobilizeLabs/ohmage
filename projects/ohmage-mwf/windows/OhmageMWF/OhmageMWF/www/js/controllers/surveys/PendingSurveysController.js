var PendingSurveysController = function(){
    var self = {};
    
    self.render = function(){
        var pendingSurveys = ReminderModel.getPendingSurveys();
        var onSurveyClickCallback = function(survey){
            alert(survey.getID());
        };
        var surveyListView = new SurveyListView(pendingSurveys, "Pending Surveys", onSurveyClickCallback);
        surveyListView.setEmptyListViewParameters("You have no pending surveys.", "Please navigate to the reminders to set new notifications.", PageNavigation.openRemindersView);
        return surveyListView.render();
    };
    
    return self;
    
};