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
    var setPageParameter = function(name, value, defaultValue){
        if( typeof(value) !== "undefined" ){
            currentParameters[name] = value;
        }else if( typeof(defaultValue) !== "undefined" ){
            currentParameters[name] = defaultValue;
        }
    };


    /**
     * Method redirects the user to a specified URL.
     * @param url The URL to redirect to. If null or undefined, the method exits
     *            without redirecting the user.
     */
    self.redirect = function(url){
        if( typeof(url) !== "undefined" ){
            resetSavedPageParameters();
            pageParameters.importMap(currentParameters);    
            document.location = url;
        }
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
        setPageParameter("uuid", uuid);
        self.redirect("reminder.html");
    };

    /**
     * Redirects the user to the page that displays a list of available or 
     * installed campaigns.
     * @param installed If set to true, only installed campaigns will be 
     *        displayed. By default, this value is set to true.
     */
    self.openCampaignsView = function(installed){
        setPageParameter("display-installed-campaigns", installed, true);
        self.redirect("campaigns.html");
    };

    /**
     * Redirects the user to the page that displays a list of surveys for the 
     * specified campaign.
     * @param campaignURN The unique identifier of the campaign to display.
     */
    self.openCampaignView = function(campaignURN){
        setPageParameter("campaign-urn", campaignURN);
        self.redirect("campaign.html");
    };
    
    /**
     * Redirects the user to the page that displays the campaign's surveys.
     * @param campaignURN The unique identifier of the survey's campaign.
     * @param surveyID The unique identifier of the survey to display.
     */
    self.openSurveyView = function(campaignURN, surveyID){
        setPageParameter("campaign-urn", campaignURN);
        setPageParameter("survey-id", surveyID);
        self.redirect("survey.html");
    };

    /**
     * Redirects the user to the page that displays a list of submitted but 
     * not yet uploaded surveys.
     */
    self.openUploadQueueView = function(){
        self.redirect("upload-queue.html");
    };

    /**
     * Redirects the user to tha authentication page.
     */
    self.openAuthenticationPage = function(){
        self.redirect("auth.html");
    };

    /**
     * Redirects users to the main dashboard.
     */
    self.openDashboard = function(){
        self.redirect("index.html");
    };
    
    self.openPrivacyPage = function(){
        self.redirect("privacy.html");
    }
    
    return self;
}());
