var SurveyListView = function (title) {
    "use strict";
    var that = AbstractView();

    var emptyListText = "No Surveys Found";
    var emptyListDetails = null;
    var emptyListClickCallback = null;

    var surveyList;

    var onSurveyClickCallbackClosure = function (surveyModel) {
        return function () {
            that.onSurveyClickCallback(surveyModel);
        };
    };

    that.initializeView = function (onSuccessCallback) {
        surveyList = CampaignsModel.getAllSurveys();
        onSuccessCallback();
    };

    that.setEmptyListViewParameters = function (listText, listDetails, listClickCallback) {
        emptyListText = listText;
        emptyListDetails = listDetails;
        emptyListClickCallback = listClickCallback;
    };

    that.onSurveyClickCallback = function (surveyModel) {};

    that.render = function (surveyListMenu) {

        surveyListMenu = surveyListMenu || mwf.decorator.Menu(title);
        var menuItem,
            i;

        if (surveyList.length > 0) {
            for (i = 0; i < surveyList.length; i += 1) {
                menuItem = surveyListMenu.addMenuLinkItem(surveyList[i].getTitle(), null, surveyList[i].getDescription());
                TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, onSurveyClickCallbackClosure(surveyList[i]), "menu-highlight");
            }

        } else if (emptyListText !== null) {
            menuItem = surveyListMenu.addMenuLinkItem(emptyListText, null, emptyListDetails);
            TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, emptyListClickCallback, "menu-highlight");
        }

        return surveyListMenu;
    };

    return that;
};