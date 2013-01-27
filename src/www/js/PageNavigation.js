/**
 * PageNavigation provides the flexability for stateful JavaScript based page
 * transitions and allows developers to abstract files names from page names.
 *
 * @class PageNavigation
 * @author Zorayr Khalapyan
 * @version 7/30/2012
 *
 */
var PageNavigation;
var PageNavigationInitializer = function () {
    PageNavigation  = (function () {
        var that = {};

        /**
         * Stores key value pairs for a current page transition. Before redirecting
         * to a new page, previous values should be cleared.
         */
        var pageParameters = new LocalMap('page-parameters');

        /**
         * Stores parameters before a transition. Before a page redirect, previous
         * values stored in the permanent storage will be erased and replaced by
         * these values.
         */
        var currentParameters = {};

        /**
         * Clears all stored page parameters.
         */
        var resetSavedPageParameters = function(){
            pageParameters.erase();
        };

        /**
         * Sets a page parameter for the current page transition. If both value and
         * defaultValue parameters are not defined not the parameter will not be
         * set.
         * @param name The key for the page parameter.
         * @param value The value of the parameter to save.
         * @param defaultValue Value that will be saved in case value parameter is
         *        not defined.
         */
        that.setPageParameter = function(name, value, defaultValue){
            if( typeof(value) !== "undefined" ){
                currentParameters[name] = value.toString();
            }else if( typeof(defaultValue) !== "undefined" ){
                currentParameters[name] = defaultValue.toString();
            }
        };

        that.unsetPageParameter = function(name){
            pageParameters.release(name);
        };

        /**
         * Method redirects the user to a specified URL.
         * @param url The URL to redirect to. If null or undefined, the method exits
         *            without redirecting the user.
         */
        that.redirect = function(url){
            if( typeof(url) !== "undefined" ){
                //resetSavedPageParameters();
                pageParameters.importMap(currentParameters);
                document.location = url;
            }
        };

        /**
         * Returns true if the specified parameter has been set.
         */
        that.isPageParameterSet = function(parameterName){
            return that.getPageParameter(parameterName) !== null;
        };

        /**
         * Returns an object containing all stored key=>value pairs.
         */
        that.getPageParameters = function(){
            return pageParameters.getMap();
        };

        /**
         * Retreives the value for the specified page parameter.
         * @param name The key of the value to retreive.
         */
        that.getPageParameter = function(name){
            return pageParameters.get(name);
        };

        /**
         * Redirects the user to the page that displays a list of set reminders and
         * allows users to select a reminder or create a new reminder.
         */
        that.openRemindersView = function(){
            that.redirect("reminders.html");
        };

        /**
         * Opens the view for the specified reminder.
         * @param uuid The UUID of the reminder to display.
         */
        that.openReminderView = function(uuid){
            that.setPageParameter("uuid", uuid);
            that.redirect("reminder.html");
        };

        /**
         * Redirects the user to a new reminder view.
         */
        that.openNewReminderView = function(){
            that.unsetPageParameter("uuid");
            that.redirect("reminder.html");
        };


        /**
         * Redirects the user to the page that displays a list of installed
         * campaigns.
         */
        that.openInstalledCampaignsView = function(){
            that.redirect("installed-campaigns.html");
        };

        /**
         * Redirects the user to the page that displays a list of available
         * campaigns.
         */
        that.openAvailableCampaignsView = function(){
            that.redirect("available-campaigns.html");
        };

        /**
         * Redirects the user to the page that displays a list of surveys for the
         * specified campaign.
         * @param campaignURN The unique identifier of the campaign to display.
         */
        that.openCampaignView = function(campaignURN){
            that.setPageParameter("campaign-urn", campaignURN);
            that.redirect("campaign.html");
        };

        that.openServerChangeView = function() {
            that.redirect( "change-server.html" );
        };

        /**
         * Redirects the user to the page that displays the campaign's surveys.
         * @param campaignURN The unique identifier of the survey's campaign.
         * @param surveyID The unique identifier of the survey to display.
         */
        that.openSurveyView = function(campaignURN, surveyID){
            that.setPageParameter("campaign-urn", campaignURN);
            that.setPageParameter("survey-id", surveyID);
            that.redirect("survey.html");
        };

        that.openPendingSurveysView = function(){
            that.redirect("pending-surveys.html");
        };

        /**
         * Redirects the user to the page that displays a list of submitted but
         * not yet uploaded surveys.
         */
        that.openUploadQueueView = function(){
            that.redirect("upload-queue.html");
        };

        /**
         * Opens survey response view that displays all the details about the
         * specified response.
         */
        that.openSurveyResponseView = function( surveyKey ) {
            that.setPageParameter( "survey-key", surveyKey );
            that.redirect( "survey-response-view.html" );
        };

        /**
         * Redirects the user to tha authentication page.
         */
        that.openAuthenticationPage = function() {
            that.redirect( "auth.html" );
        };

        /**
         * Redirects users to the main dashboard.
         */
        that.openDashboard = function() {
            that.redirect( "index.html" );
        };

        that.openChangePasswordPage = function() {
            that.redirect("change-password.html");
        };

        that.openPrivacyPage = function() {
            that.redirect("privacy.html");
        };

        that.openProfilePage = function() {
            that.redirect("profile.html");
        };

        that.openHelpMenuView = function(){
            that.redirect("help-menu.html");
        };

        that.openHelpSectionView = function(index){
            that.setPageParameter("help-section-index", index);
            that.redirect("help-section.html");
        };

        that.goBack = function(){
            if (typeof (navigator.app) !== "undefined") {
                navigator.app.backHistory();
            } else {
                window.history.back();
            }
        };

        that.goForward = function(){
            if (typeof (navigator.app) !== "undefined") {
                navigator.app.forwardHistory();
            } else {
                window.history.forward();
            }
        };


        return that;
    }());
};
