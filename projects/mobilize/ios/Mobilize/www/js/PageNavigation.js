/**
 * PageNavigation provides the flexability for stateful JavaScript based page
 * transitions and allows developers to abstract files names from page names.
 *
 * @class PageNavigation
 * @author Zorayr Khalapyan
 * @version 7/30/2012
 *
 */
var PageNavigation = (function(){

    var self = {};

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
    self.setPageParameter = function(name, value, defaultValue){
        if( typeof(value) !== "undefined" ){
            currentParameters[name] = new String(value);
        }else if( typeof(defaultValue) !== "undefined" ){
            currentParameters[name] = new String(defaultValue);
        }
    };

    self.unsetPageParameter = function(name){
        pageParameters.release(name);
    };

    /**
     * Method redirects the user to a specified URL.
     * @param url The URL to redirect to. If null or undefined, the method exits
     *            without redirecting the user.
     */
    self.redirect = function(url){
        if( typeof(url) !== "undefined" ){
            //resetSavedPageParameters();
            pageParameters.importMap(currentParameters);
            document.location = url;
        }
    };

    /**
     * Returns true if the specified parameter has been set.
     */
    self.isPageParameterSet = function(parameterName){
        return self.getPageParameter(parameterName) !== null;
    };

    /**
     * Returns an object containing all stored key=>value pairs.
     */
    self.getPageParameters = function(){
        return pageParameters.getMap();
    };

    /**
     * Retreives the value for the specified page parameter.
     * @param name The key of the value to retreive.
     */
    self.getPageParameter = function(name){
        return pageParameters.get(name);
    };

    /**
     * Redirects the user to the page that displays a list of set reminders and
     * allows users to select a reminder or create a new reminder.
     */
    self.openRemindersView = function(){
        self.redirect("reminders.html");
    };

    /**
     * Opens the view for the specified reminder.
     * @param uuid The UUID of the reminder to display.
     */
    self.openReminderView = function(uuid){
        self.setPageParameter("uuid", uuid);
        self.redirect("reminder.html");
    };

    /**
     * Redirects the user to a new reminder view.
     */
    self.openNewReminderView = function(){
        self.unsetPageParameter("uuid");
        self.redirect("reminder.html");
    };


    /**
     * Redirects the user to the page that displays a list of installed
     * campaigns.
     */
    self.openInstalledCampaignsView = function(){
        self.redirect("installed-campaigns.html");
    };

    /**
     * Redirects the user to the page that displays a list of available
     * campaigns.
     */
    self.openAvailableCampaignsView = function(){
        self.redirect("available-campaigns.html");
    };

    /**
     * Redirects the user to the page that displays a list of surveys for the
     * specified campaign.
     * @param campaignURN The unique identifier of the campaign to display.
     */
    self.openCampaignView = function(campaignURN){
        self.setPageParameter("campaign-urn", campaignURN);
        self.redirect("campaign.html");
    };

    self.openServerChangeView = function() {
        self.redirect( "change-server.html" );
    };

    /**
     * Redirects the user to the page that displays the campaign's surveys.
     * @param campaignURN The unique identifier of the survey's campaign.
     * @param surveyID The unique identifier of the survey to display.
     */
    self.openSurveyView = function(campaignURN, surveyID){
        self.setPageParameter("campaign-urn", campaignURN);
        self.setPageParameter("survey-id", surveyID);
        self.redirect("survey.html");
    };

    self.openPendingSurveysView = function(){
        self.redirect("pending-surveys.html");
    };

    /**
     * Redirects the user to the page that displays a list of submitted but
     * not yet uploaded surveys.
     */
    self.openUploadQueueView = function(){
        self.redirect("upload-queue.html");
    };

    /**
     * Opens survey response view that displays all the details about the
     * specified response.
     */
    self.openSurveyResponseView = function( surveyKey ) {
        self.setPageParameter( "survey-key", surveyKey );
        self.redirect( "survey-response-view.html" );
    };

    /**
     * Redirects the user to tha authentication page.
     */
    self.openAuthenticationPage = function() {
        if (DeviceDetection.isOnDevice()) {
            self.redirect( "auth.html" );
        } else {
            self.redirect( "browser-auth.html" );
        }
    };

    /**
     * Redirects users to the main dashboard.
     */
    self.openDashboard = function() {
        self.redirect( "index.html" );
    };

    self.openChangePasswordPage = function() {
        self.redirect("change-password.html");
    };

    self.openPrivacyPage = function() {
        self.redirect("privacy.html");
    };

    self.openProfilePage = function() {
        self.redirect("profile.html");
    };

    self.openHelpMenuView = function(){
        self.redirect("help-menu.html");
    };

    self.openHelpSectionView = function(index){
        self.setPageParameter("help-section-index", index);
        self.redirect("help-section.html");
    };

    self.goBack = function(){
        if (typeof (navigator.app) !== "undefined") {
            navigator.app.backHistory();
        } else {
            window.history.back();
        }
    };

    self.goForward = function(){
        if (typeof (navigator.app) !== "undefined") {
            navigator.app.forwardHistory();
        } else {
            window.history.forward();
        }
    };


    return self;
}());
