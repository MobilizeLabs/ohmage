/**
 * Generic view that enables displaying a list of surveys in a menu.
 *
 * @author Zorayr Khalapyan
 * @param title The title of the survey list menu UI.
 * @param [surveyList] List of surveys to display. Default to all available.
 * @returns {*}
 * @constructor
 */
var SurveyListView = function (title, surveyList) {
    "use strict";
    var that = AbstractView();

    var emptyListText = "No Surveys Found";
    var emptyListDetails = null;
    var emptyListClickCallback = null;

    var onSurveyClickCallbackClosure = function (surveyModel) {
        return function () {
            that.onSurveyClickCallback(surveyModel);
        };
    };

    that.initializeView = function (onSuccessCallback) {
        //Don't override the survey list if one is already provided.
        surveyList = surveyList || CampaignsModel.getAllSurveys();
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