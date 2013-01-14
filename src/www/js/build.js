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
        self.redirect( "auth.html" );
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

/**
 * The server is designed to be as stateless as possible. Since the server does
 * not keep session IDs, authentication information must be sent with each call
 * to the server. The server has two authentication URLs, one which is
 * completely stateless and one which uses a temporary authentication token that
 * is stored on the server. The stateless authentication should be used when the
 * client wants to be permanently logged in, and the other should be used for
 * less secure environments (such as web browsers).
 *
 * @author Zorayr Khalapyan
 */
function UserAuthentication() {

    var that = {};

    /**
     * Endpoint for user authentication via authentication token.
     */
    var TOKEN_AUTH_URL = '/app/user/auth_token';

    /**
     * Authentication token cookie name.
     */
    var TOKEN_AUTH_COOKIE_NAME = 'auth_token';

    /**
     * Endpoint for user authentication via hash password.
     */
    var HASH_AUTH_URL = '/app/user/auth';

    /**
     * Hash authentication cookie name.
     */
    var HASH_AUTH_COOKIE_NAME = 'hashed_password';

    /**
     * The name of the cookie that stores usernames.
     */
    var USERNAME_COOKIE_NAME = 'username';

    var AUTH_ERROR_STATE_COOKIE_NAME = 'auth-error';

    /* This is the regular expression for the password string. The password
     * must contain at least one lower case character, one upper case
     * character, one digit, and one of a set of special characters. It must be
     * between 8 and 16 characters, inclusive.
    */
    var PLAINTEXT_PASSWORD_PATTERN_STRING =
        "^" + // Beginning of the line.
        "(" + // Beginning of group 1.
                "(" + // Beginning of subgroup 1-1.
                        "?=.*" + // This group must consist of at least one of the
                                 // following characters.
                        "[a-z]" + // A lower case character.
                ")" + // End of subgroup 1-1.
                "(" + // Beginning of subgroup 1-2.
                        "?=.*" + // This group must consist of at least one of the
                         // following characters.
                        "[A-Z]" +// An upper case character.
                ")" + // End of subgroup 1-2.
                "(" + // Beginning of subgroup 1-3.
                        "?=.*" + // This group must consist of at least one of the
                         // following characters.
                        "\\d" + // A digit.
                ")" + // End of subgroup 1-3.
                "(" + // Beginning of subgroup 1-4.
                        "?=.*" + // This group must consist of at least one of the
                         // following characters.
                        "[,\\.<>:\\[\\]!@#$%^&*+-/=?_{|}]" +
                ")" + // End of subgroup 1-4.
                "." + // All of the previous subgroups must be true.
                "{8,16}" + // There must be at least 8 and no more than 16
                           // characters.
        ")" + // End of group 1.
        "$";  // End of the line.

    var PASSWORD_REQUIREMENTS =
		"The password must " +
		"be between 8 and 16 characters, " +
		"contain at least one lower case character, " +
		"contain at least one upper case character, " +
		"contain at least one digit, " +
		"and contain at least one of the following characters " +
			"',', " +
			"'.', " +
			"'<', " +
			"'>', " +
			"'[', " +
			"']', " +
			"'!', " +
			"'@', " +
			"'#', " +
			"'$', " +
			"'%', " +
			"'^', " +
			"'&', " +
			"'*', " +
			"'+', " +
			"'-', " +
			"'/', " +
			"'=', " +
			"'?', " +
			"'_', " +
			"'{', " +
			"'}', " +
			"'|', " +
			"':'.";
                    
    var sessionMap = new LocalMap('credentials');
    var session = function(name, value){
        if(typeof(value) !== "undefined"){
            sessionMap.set(name, value);
        }
        return sessionMap.get(name);
    };
    
    /**
     * Return true if cookie with the specified name exists. Optionally,
     * redirects the user to the provided redirect URL in case the user is
     * authenticated.
     *
     * The method is used for encapsulating common behavior between checking
     * user authentication in both token and hash methods. The authentication
     * cookie is usually either 'auth-token' or 'hashed-password'.
     *
     * @param authCookieName The name of the authentication cookie to check.
     *
     */
    var authenticationCheck = function(authCookieName, redirectURL){

        if(that.isInAuthErrorState()){
            return false;
        }

        if(session(authCookieName) !== null){

            PageNavigation.redirect(redirectURL);

            return true;

        }else{
            return false;
        }
    };

    that.getPasswordRequirements = function(){
        return PASSWORD_REQUIREMENTS;
    };

    that.isPasswordValid = function(password){
        return (new RegExp(PLAINTEXT_PASSWORD_PATTERN_STRING)).test(password);
    };

    that.isUserLocked = function(){
        return that.getUsername() != null;
    }

    that.setAuthErrorState = function(state){
        session(AUTH_ERROR_STATE_COOKIE_NAME, state);
    };

    that.isInAuthErrorState = function(){
        return session(AUTH_ERROR_STATE_COOKIE_NAME);
    }

    /**
     * Returns the authentication token if it exists, or null otherwise.
     * @return The authentication token if it exists, or null otherwise.
     */
    that.getAuthToken = function(){
        return session(TOKEN_AUTH_COOKIE_NAME);
    }

    /**
     * Returns the hashed password if it exists, or null otherwise.
     * @return The hashed password if it exists, or null otherwise.
     */
    that.getHashedPassword = function(){
        return session(HASH_AUTH_COOKIE_NAME);
    }

    /**
     * Logs out the currently logged in user. This method is authentication
     * method agnostic and works with both hashed and token authentication
     * methods.
     *
     */
    that.logout = function(){
        
        var message = "All data will be lost. Are you sure you would like to proceed?";

        MessageDialogController.showConfirm(message, function(yes){
            if(yes){

                console.log("UserAuthentication: User confirmed logout. Deleting data...");
                //Erase any authentication related data.
                session(TOKEN_AUTH_COOKIE_NAME, null);
                session(HASH_AUTH_COOKIE_NAME, null);
                session(USERNAME_COOKIE_NAME, null);
                session(AUTH_ERROR_STATE_COOKIE_NAME, null);
                
                //ToDo: Decouple these two lines from user authentication. Maybe
                //in the form of event subscribers. 
                ReminderModel.cancelAll();
                window.localStorage.clear();
                window.localStorage['page-parameters'] = "{}";
                PageNavigation.openAuthenticationPage();

            }
        }, "Yes,No");
    };
    
    
    that.checkpoint = function(){
        if(!that.isUserAuthenticated() || that.isInAuthErrorState() ){
            console.log("User failed checkpoint - redirecting to the authentication page.");
            PageNavigation.redirect('auth.html');
        }
    };

    /**
     * Method agnostic authentication check - this method will return true if
     * the user is either authentication via the hashed password method or via
     * the authentication token method.
     *
     * @param redirectURL If specified, authenticaated users will be redirected
     *        to this URL.
     */
    that.isUserAuthenticated = function(redirectURL){

        if(that.isUserAuthenticatedByHash() ||
           that.isUserAuthenticatedByToken()){

           PageNavigation.redirect(redirectURL);

           return true;

        }

        return false;
    };

    /**
     * Checks if the user is authorized via password hash. If an optional
     * redirect URL is specified, then an authenticated user will be redirected
     * to that URL.
     *
     * @param redirectURL The URL to redirct the user if the user is
     *        authenticated.
     *
     * @return True if the user is authenticated, false otherwise.
     */
    that.isUserAuthenticatedByHash = function(redirectURL){
        return authenticationCheck(HASH_AUTH_COOKIE_NAME, redirectURL);
    };

    /**
     * Checks if the user is authenticated via auth token method. If an optional
     * redirect URL is specified, then an authenticated user will be redirected
     * to that URL.
     *
     * @param redirectURL The URL to redirct the user if the user is
     *        authenticated.
     *
     * @return True if the user is authenticated, false otherwise.
     */
    that.isUserAuthenticatedByToken = function(redirectURL){
        return authenticationCheck(TOKEN_AUTH_COOKIE_NAME, redirectURL);
    };

    /**
     * Returns currently logged in user's username, or null if non exists.
     * @return Currently logged in user's username, or null if non exists.
     */
    that.getUsername = function(){
        return session(USERNAME_COOKIE_NAME);
    }

    /**
     * Checks if the user is authenticated via the hashed password method. If
     * the authentication was successful, then the callback method will be
     * invoked with a single boolean argument true, otherwise callback will be
     * invoked with arguments (false, error explanation).
     *
     * @param username User's username.
     * @param password User's password.
     * @param callback Invoked on authentication check.
     */
    that.authenticateByHash = function(username, password, callback){

        if(that.isUserAuthenticatedByHash()){
            callback(true);
        }

        //On successful authentication, save the hashed password in a cookie and
        //then invoke the callback.
        var onSuccess = function(response){

            //Save the hashed password in a cookie.
            session(HASH_AUTH_COOKIE_NAME, response.hashed_password);
            session(USERNAME_COOKIE_NAME, username);

            that.setAuthErrorState(false);

            callback(true);
        };

        var onError = function(response){
            callback(false, (response) ? response.errors[0].text : null);
        };


       //Make an API call.
       ServiceController.serviceCall(
           "POST",
           HASH_AUTH_URL,
           {
                user : username,
                password: password,
                client: '1'
           },
           'JSON',
           onSuccess,
           onError
         );

    };

    /**
     * Checks if the user is authenticated via the auth token method. If
     * the authentication was successful, then the callback method will be
     * invoked with a single boolean argument true, otherwise callback will be
     * invoked with arguments (false, error explanation).
     *
     * @param username User's username.
     * @param password User's password.
     * @param callback Invoked on authentication check.
     */
    that.authenticateByToken = function (username, password, callback) {
        if (that.isUserAuthorizedByToken()) {
            callback(true);
        }

        //On successful authentication, save the token in a cookie and the
        //invoke the callback.
        var onSuccess = function(response){
            //Save the authentication token in a cookie and invoke the callback.
            session(TOKEN_AUTH_COOKIE_NAME, response.token);
            session(USERNAME_COOKIE_NAME, username);

            that.setAuthErrorState(false);

            callback(true);
        };

        var onError = function(response){
            callback(false, (response) ? response.errors[0].text : null);
        };

        //Make an API call.
        ServiceController.serviceCall(
           "POST",
           TOKEN_AUTH_URL,
           {
                user : username,
                password: password,
                client: '1'
           },
           'JSON',
           onSuccess,
           onError
         );

    };
    
    return that;    
}

var auth = new UserAuthentication ();

if(typeof(checkpoint) != 'undefined'){
    auth.checkpoint();
}

var ConfigManager = (function () {

    var that = {};

    var configMap = LocalMap("config");

    /**
     * If set to true, will use test server for deployement.
     */
    var TEST_MODE = true;

    /**
     * List of available servers.
     */
    var SERVERS = [

        //Test server.
        "https://test.ohmage.org",

        //Prod server.
        "https://pilots.mobilizelabs.org"
    ];

    /**
     * Configuration blueprint. To add new configuration value, add a new
     * property to this object and an accessor function will be generated. The
     * actual working values will be saved in a localStorage object.
     */
    var config = {

        /**
         * ohmage server URL.
         */
        SERVER_ENDPOINT : SERVERS[ (TEST_MODE) ? 0 : 1 ],

        /**
         * URL for reading campaigns.
         */
        CAMPAIGN_READ_URL : '/app/campaign/read',

        /**
         * URL for uploading surveys.
         */
        SURVEY_UPLOAD_URL : '/app/survey/upload',

        /**
         * Allows users to change their passwords.
         */
        PASSWORD_CHANGE_URL : '/app/user/change_password',

        /**
         * Enables GPS acquisition.
         */
        GPS_ENABLED : true,

        /**
         * If set to true, the user will be asked to either upload after submitting
         * or wait and upload manually. This functionality is mostly useful for
         * debugging upload queue.
         */
        CONFIRM_TO_UPLOAD_ON_SUBMIT : true,

        /**
         * Client property sent with AJAX requests.
         */
        CLIENT_NAME : "ohmage-mwf"

    };

    that.reset = function() {
        configMap.importMap( config );
    };

    /**
     * Generic method for accessing any available property.
     */
    that.getProperty = function ( propertyName ) {
        return configMap.get( propertyName );
    };

    /**
     * Returns a list of available servers.
     */
    that.getServers = function() {
        return SERVERS;
    };

    var property, camelCaseGetterName, camelCaseSetterName;

    var toCamelCase = function( g ) {
        return g[1].toUpperCase();
    };

    /**
     * Creates a closure function to return the specified value. This is used
     * to iterate through all the config properties and create accessor
     * functions to return the config's value.
     */
    var addPropertyGetter = function( propertyName ) {
        return function(){
            return that.getProperty( propertyName );
        }
    };

    var addPropertySetter = function( propertyName ) {
      return function( newConfigValue ) {
          configMap.set( propertyName, newConfigValue );
      };
    };

    for( property in config ) {

        //Convert CONSTNAT_CASE to camelCase.
        camelCaseGetterName = ("get_" + property.toLowerCase()).replace(/_([a-z])/g, toCamelCase );
        camelCaseSetterName = ("set_" + property.toLowerCase()).replace(/_([a-z])/g, toCamelCase );

        //Create accessor functions to allow users to get and set config values.
        that[ camelCaseGetterName ] = addPropertyGetter( property );
        that[ camelCaseSetterName ] = addPropertySetter( property );
    }

    //Transfer any values in config that have not been saved in localStorage.
    for( var key in config ) {
        if ( !configMap.isSet( key ) ) {
            configMap.set( key, config[ key ] );
        }
    }

    return that;

})();
var CampaignController = function ( campaignModel ) {

    var that = {};

    var deleteCampaignConfirmationCallback = function (yes) {
        if (yes) {
             CampaignsModel.uninstallCampaign(campaignModel.getURN());
             PageNavigation.goBack();
         }
    };

    that.deleteCampaignHandler = function () {
         var message = "All data will be lost. Are you sure you would like to proceed?";
         MessageDialogController.showConfirm(message, deleteCampaignConfirmationCallback, "Yes,No");
    };

    that.renderCampaignView = function () {
        var campaignView = CampaignView(campaignModel);
        campaignView.openSurveyViewHandler = CampaignController.openSurveyViewHandler;
        campaignView.deleteCampaignHandler = that.deleteCampaignHandler;
        return campaignView.render();
    };

    return that;
};

CampaignController.openSurveyViewHandler = function (campaignURN, surveyID) {
    PageNavigation.openSurveyView(campaignURN, surveyID);
};
/**
 * Singleton Model!
 */
var CampaignsController = (function () {

    var that = {};

    /**
     * On success, update the current view which will show the newly installed
     * campaign.
     */
    var onCampaignInstallSuccess = function () {
        PageNavigation.openInstalledCampaignsView();
    };

    /**
     * On error, just display an alert to the user with the error message.
     */
    var onCampaignInstallError = function () {
        MessageDialogController.showMessage("Unable to install campaign. Please try again later.");
    };

    /**
     * When the campaign list has been sucessfully refreshed, refresh the view.
     */
    var onCampaignListRefreshSuccess = function () {
        MessageDialogController.showMessage("All campaigns have been updated.", PageNavigation.openAvailableCampaignsView);
    };

    /**
     * If there was an error during the campaign list refresh process, display an
     * error message to the user.
     */
    var onCampaignListRefreshError = function () {
        MessageDialogController.showMessage("Unable to download all campaigns. Please try again.");
    };

    /**
     * Handler for installing a new campaign.
     */
    that.installNewCampaignHandler = function (campaignURN) {
        CampaignModel.install(campaignURN, onCampaignInstallSuccess, onCampaignInstallError);
    };

    /**
     * Handler for opening an already installed campaign.
     */
    that.openMyCampaignHandler = function (campaignURN) {
        PageNavigation.openCampaignView(campaignURN);
    };

    that.refreshCampaignsListHandler = function () {
        CampaignsModel.download(true, onCampaignListRefreshSuccess, onCampaignListRefreshError);
    };

    that.renderInstalledCampaigns = function () {
        var campaignsView = CampaignsView(CampaignsModel);
        campaignsView.openMyCampaignHandler = that.openMyCampaignHandler;
        return campaignsView.renderMyCampaigns();
    };

    that.renderAvailableCampaigns = function () {
        var campaignsView = CampaignsView(CampaignsModel);
        campaignsView.installNewCampaignHandler = that.installNewCampaignHandler;
        campaignsView.refreshCampaignsListHandler = that.refreshCampaignsListHandler;
        return campaignsView.renderAvailableCampaigns();
    };

    return that;

})();
var ChangeServerController = function() {
  var that = {};
  that.renderChangeServerView = function() {
      var changeServerView = ChangeServerView( ConfigManager.getServers() );  
      changeServerView.saveButtonHandler = function() {
          ConfigManager.setServerEndpoint( changeServerView.getSelectedServer() );
          console.log( "ChangeServerController: Saved a new server endpoint [" + ConfigManager.getServerEndpoint() + "]." );
          MessageDialogController.showMessage( "Your selection has been saved.", PageNavigation.openAuthenticationPage );
      };
      return changeServerView.render();
  };
  return that;
};var HelpController = function(){
    var self = {};
    
    var helpModel  = new HelpModel();
    
    self.renderHelpMenu = function(){
        var helpMenuView = new HelpMenuView(helpModel.getAllSections());
        return helpMenuView.render();
    };
    
    self.renderHelpSection = function(index){
        var helpSectionView = new HelpSectionView(helpModel.getHelpSection(index));
        return helpSectionView.render();
    };
    
    return self;  
};var MessageDialogController = (function () {
    
    var that = {};
    
    /**
     * Invokes the method 'fun' if it is a valid function. In case the function
     * method is null, or undefined then the error will be silently ignored.
     *
     * @param fun  the name of the function to be invoked.
     * @param args the arguments to pass to the callback function.
     */
    var invoke = function( fun, args ) {
        if( fun && typeof fun === 'function' ) {
            fun( args );
        }
    };
    
    that.showMessage = function( message, callback, title, buttonName ) {

        title = title || "ohmage";
        buttonName = buttonName || 'OK';

        if( navigator.notification && navigator.notification.alert ) {

            navigator.notification.alert(
                message,    // message
                callback,   // callback
                title,      // title
                buttonName  // buttonName
            );

        } else {

            alert( message );
            invoke( callback );
        }

    };

    that.showConfirm = function( message, callback, buttonLabels, title ) {

        //Set default values if not specified by the user.
        buttonLabels = buttonLabels || 'OK,Cancel';
        var buttonList = buttonLabels.split(',');

        title = title || "ohmage";

        //Use Cordova version of the confirm box if possible.
        if(navigator.notification && navigator.notification.confirm){

                var _callback = function(index){
                    if( callback ) {

                        if(DeviceDetection.isDeviceiOS())
                            index = buttonList.length - index;

                        callback( index == 1 );
                    }
                };

                navigator.notification.confirm(
                    message,      // message
                    _callback,    // callback
                    title,        // title
                    buttonLabels  // buttonName
                );

        //Default to the usual JS confirm method.
        } else {
            invoke( callback, confirm( message ) );
        }
        
    };

    return that;
    
})();var ProfileController = function() {
    var that = {};
    
    that.changePasswordHandler = function() {
        PageNavigation.openChangePasswordPage();
    };
    
    that.enableGpsHandler = function() {
        ConfigManager.setGpsEnabled( true );
        PageNavigation.openProfilePage();
    };
    
    that.disableGpsHandler = function() {
        ConfigManager.setGpsEnabled( false );
        PageNavigation.openProfilePage();
    };
    
    that.clearCustomizedChoicesHandler = function() {
        var confirmMessage = "Are you sure you would like to clear all your custom choices?";
        var confirmButtonLabels = "Yes,No";
        var confirmCallback = function( confirmed ) {
            if( confirmed ) {
                CustomPropertiesVault.deleteAllCustomProperties();
                MessageDialogController.showMessage( "All custom choices have been cleared." );
            }
        };
        MessageDialogController.showConfirm( confirmMessage, confirmCallback, confirmButtonLabels );
    };
    
    that.logoutAndClearDataHandler = function() {
        if( auth.logout() ) {
            PageNavigation.openAuthenticationPage();
        }
    };
    
    that.renderProfileView = function() {
      
        var profileView = ProfileView();
        
        //Attach handlers to the view.
        profileView.changePasswordHandler = that.changePasswordHandler;
        profileView.clearCustomizedChoicesHandler = that.clearCustomizedChoicesHandler;
        profileView.logoutAndClearDataHandler = that.logoutAndClearDataHandler;
        profileView.disableGpsHandler = that.disableGpsHandler;
        profileView.enableGpsHandler = that.enableGpsHandler;
        
        return profileView.render();
    };
    
    return that;
};
var PromptController = function( surveyController, container ) {

    var that = {};

    var surveyModel = surveyController.getSurveyModel();
    
    /**
     * An array of prompts associated with the current survey.
     */
    var prompts = surveyModel.getPrompts();

    /**
     * The response object for the current survey.
     */
    var surveyResponse = SurveyResponseModel.init(surveyModel.getID(), surveyModel.getCampaign().getURN());

    /**
    * Stores the index of the currently displayed prompt. Initialized to the
    * first prompt.
    */
    var currentPromptIndex = 0;

    /**
     * Callback for survey completed event. The actual response will not be
     * submitted but will be passed as a reference object to this callback.
     */
    var surveyDoneCallback = null;

    /**
     * If running on an Android device, this method gets invoked when the user
     * hits the back button.
     */
    var androidBackButtonCallback = null;

    /**
     * Message displayed to the user when exiting the current survey without
     * submitting.
     */
    var confirmToLeaveMessage = "Data from your current survey response will be lost. Are you sure you would like to continue?";

    var androidBackButtonCallbackWrapper = function(){
       if(androidBackButtonCallback !== null){
           androidBackButtonCallback();
       }
    };

    var overrideBackButtonFunctionality = function(){
        if(DeviceDetection.isDeviceAndroid()){
            invokeOnReady(function(){
               console.log("Overriding back button on Android devices for current survey navigation.");
               document.addEventListener("backbutton", androidBackButtonCallbackWrapper, true);
        });
      }
    };

    var resetBackButtonFunctionality = function(){
        if(DeviceDetection.isDeviceAndroid()){
            document.removeEventListener("backbutton", androidBackButtonCallbackWrapper, false);
        }
    };

    /**
     * Returns currently displayed prompt. Returns null if current index is out
     * of bounds.
     *
     * @return Current prompt.
     */
    var getCurrentPrompt = function() {
        return prompts[ currentPromptIndex ] || null;
    };

    /**
     * Returns current prompt's condition.
     */
    var getCurrentCondition = function() {
        return getCurrentPrompt().getCondition();
    };

    /**
     * Boolean method that returns true if the current condition of the prompt
     * fails.
     */
    var failsCondition = function() {
        var currentCondition = getCurrentCondition();
        var currentResponse  = surveyResponse.getResponses();
        return currentCondition &&
               !ConditionalParser.parse(currentCondition, currentResponse);
    };

    /**
     * Buffer that stores currently displayed/rendered prompts. This approach
     * is used for storing user entered data when the user goes to the previous
     * prompt.
     */
    var promptBuffer = {};

    /**
     * Method invoked when the user completes the survey and clicks submit.
     */
    var done = function() {
        resetBackButtonFunctionality();
        surveyResponse.submit();
        surveyDoneCallback( surveyResponse );
    };

    var processResponse = function( skipped ) {
        var prompt = getCurrentPrompt();
        if( skipped ) {
            if( !prompt.isSkippable() ){
                return false;
            }
            surveyResponse.promptSkipped( prompt.getID() );
            return true;
        }

        //Handle invalid responses.
        if( !prompt.isValid() ) {
            MessageDialogController.showMessage( prompt.getErrorMessage() );
            return false;
        }

        //Save the response.
        surveyResponse.respond( prompt.getID(), prompt.getResponse(), prompt.getType() == "photo" );

        return true;
    };

    var nextPrompt = function(skipped){
        if(processResponse(skipped)){
            currentPromptIndex++;
            while(currentPromptIndex < prompts.length && failsCondition()){
                surveyResponse.promptNotDisplayed(getCurrentPrompt().getID());
                currentPromptIndex++;
            }
            render();
        }
    };

    var previousPrompt = function(){
        if(currentPromptIndex > 0){
            currentPromptIndex--;
        }

        //Skip all prompts that fail the condition.
        while(currentPromptIndex > 0 && failsCondition()){
            currentPromptIndex--;
        }

        render();

    };

    /**
     * Enables or disables next, previous, submit, and skip buttons.
     */
    var getControlButtons = function (submitPage) {
        var panel = document.createElement('div');

        //If the prompt is skippable, then enable the skip button.
        if(!submitPage && getCurrentPrompt().isSkippable()){
            panel.appendChild(mwf.decorator.SingleClickButton(getCurrentPrompt().getSkipLabel(), function(){
                nextPrompt(true);
            }));
        }

        androidBackButtonCallback = previousPrompt;

        //Handle first prompt.
        if(currentPromptIndex == 0){
            panel.appendChild(mwf.decorator.SingleClickButton("Next Prompt", function(){
                nextPrompt(false);
            }));

            androidBackButtonCallback = function(){
                that.confirmSurveyExit(function(){
                    PageNavigation.goBack();
                });
            };

        //Handle submit page.
        } else if(submitPage){
           panel.appendChild(mwf.decorator.DoubleClickButton("Previous", previousPrompt, "Submit", done));

        //Handle prompts in the middle.
        } else{
            panel.appendChild(mwf.decorator.DoubleClickButton("Previous", previousPrompt, "Next", function(){
                nextPrompt(false);
            }));
        }

        return panel;
    };

    var render = function(){

        //Clear the current contents of the main container.
        container.innerHTML = "";

        var controlButtons;

        //Render prompt if not at the last prompt.
        if(currentPromptIndex < prompts.length) {

            //Dislpayed buffered prompts if possible, else render the prompt and
            //save the rendered content.
            if(!promptBuffer[getCurrentPrompt().getID()]){
                container.appendChild(promptBuffer[getCurrentPrompt().getID()] = getCurrentPrompt().render());
            }else{
                container.appendChild(promptBuffer[getCurrentPrompt().getID()]);
            }

            controlButtons = getControlButtons(false);


        //Render submit page if at the last prompt.
        } else {

            var menu = mwf.decorator.Menu('Survey Completed');
            menu.addMenuTextItem('Done with ' + surveyModel.getTitle());
            container.appendChild(menu);

            controlButtons = getControlButtons(true);
        }

        container.appendChild(controlButtons);

    };

    /**
     * Fetches the current location and renders the first prompt.
     *
     * @param callback Function that will be invoked when the survey has been
     *                 completed.
     */
    that.start = function( callback ) {
        
        if( ConfigManager.getGpsEnabled() ) {
            //Update survey response geolocation information.
            surveyResponse.setLocation();
        }
        
        //Render the initial prompt.
        render();

        //Save the callback to be invoked when the survey has been completed.
        surveyDoneCallback = callback;

        overrideBackButtonFunctionality();

    };

    /**
     * Aborts the current survey participation and deletes the users responses.
     * This method should be called to do the clean up before the user navigates
     * to another page without completing the survey.
     */
    that.abort = function(){
        resetBackButtonFunctionality();
        if(surveyResponse !== null && !surveyResponse.isSubmitted()){
            SurveyResponseModel.deleteSurveyResponse(surveyResponse);
        }
    };

    /**
     * Method used for getting user's confirmation before exiting an incomplete
     * survey. In case of a positive confirmation, the current survey response
     * will be aborted (resonse get's deleted from localStorage) and the
     * specified callback is invoked.
     *
     * @param positiveConfirmationCallback A callback invoked when the user
     *        confirms the current action.
     */
    that.confirmSurveyExit = function(positiveConfirmationCallback){
        MessageDialogController.showConfirm(confirmToLeaveMessage, function(isResponseYes){
            if( isResponseYes ){
                that.abort();
                if( typeof(positiveConfirmationCallback) === "function" ){
                    positiveConfirmationCallback();
                }
            }
        }, "Yes,No");
    };

    return that;
}





var ReminderController = function(uuid){
  
    var self = {};
    
    var model = (uuid)? new ReminderModel(uuid) : new ReminderModel();
    
    self.render = function(){
        return (new ReminderView(model, self)).render();
    };
    
    self.save = function(campaignURN, surveyID, title, date, supressionWindow, recurrences, excludeWeekends){
        model.setAssociation(campaignURN, surveyID);
        model.setSupressionWindow(supressionWindow);
        model.setExcludeWeekends(excludeWeekends);
        model.setTitle(title);
        model.setMessage("Reminder: " + title);
        model.cancelAllNotifications();
        
        //Returns a new date that is 24 hours ahead of the specified day.
        var nextDay = function(date){
            return new Date(date.getTime() + (24 * 60 * 60 * 1000));
        };
        
        //If the user has set an alarm with an initial date in the past, then
        //skip the current day. Otherwise, a notification will be triggered 
        //as soon as the reminder is set.
        if(date.getTime() < new Date().getTime()){
            date = nextDay(date);
        }
        
        for(var i = 0; i < recurrences; i++){
            if(model.excludeWeekends()){
                while(date.getDay() === 6 || date.getDay() === 0){
                    date = nextDay(date);
                }
            } 
            model.addNotification(date);
            date = nextDay(date);
        }
        
        model.save();
    };
       
    self.getReminderCount = function(){
        return getAllReminders().length;
    };
    
    return self;
};
var RemindersController = function(){
    var self = {};
    
    self.render = function(){
        var reminders = ReminderModel.getCurrentReminders();
        var view = new RemindersView(reminders);
        return view.render();
    };
    
    return self;
};var ServiceController = ( function( ) {

    var that = {};
    
    /**
     * Invokes the method 'fun' if it is a valid function. In case the function
     * method is null, or undefined then the error will be silently ignored.
     *
     * @param fun  the name of the function to be invoked.
     * @param args the arguments to pass to the callback function.
     */
    var invoke = function( fun, args ) {
        if( fun && typeof fun === 'function' ) {
            fun( args );
        }
    };
    
    var onSuccess = function( onSuccessCallback, onErrorCallback, url, redirectOnAuthError ) {
        
        return function( response ) {
            
            console.log("Received response for URL (" + url + ") with the following response data: " + JSON.stringify(response));

            switch( response.result ) {

                case 'success':
                    invoke(onSuccessCallback, response);
                    break;

                case 'failure':{
                    invoke(onErrorCallback, response);

                    //If the API request failed because of authentication related
                    //error, then redirect the user to the authentication page.
                    if( redirectOnAuthError ) {
                        for( var i = 0; i < response.errors.length; i++ ) {
                            if(response.errors[i].code == '0200'){
                                auth.setAuthErrorState( true );
                                PageNavigation.openAuthenticationPage();
                                break;
                            }

                        }
                    }

                    break;
                }


                default:
                    invoke( onSuccess, response );
                    break;
            }
            
        };
        
        
    };
    
    var onError = function( onErrorCallback, url ) {
        return function() {
            console.log("AJAX exception for url " + (ConfigManager.getServerEndpoint() + url));
            invoke( onErrorCallback, false );
        };
        
    };

    /**
     * The method is the primary point of interaction with the Ohmage API.
     *
     * On API call response, the method will analyze the contents of the response
     * and depending on the contents will either invoke onSuccess or onError
     * callbacks.
     *
     * URL argument is the relative path for the API URL. Ohmage server path will be
     * augmented prior to AJAX calls.
     *
     * @param type      The AJAX call type i.e. POST/GET/DELETE.
     * @param url       The API URL extension i.e. /app/survey/upload.
     * @param data      The data sent with the AJAX call.
     * @param dataType  The data type for the AJAX call i.e. XML, JSON, JSONP.
     * @param onSuccessCallback The callback on API call success.
     * @param onErrorCallback   The callback on API call error.
     * @param redirectOnAuthError
     */
    that.serviceCall = function( type, url, data, dataType, onSuccessCallback, onErrorCallback, redirectOnAuthError ) {

        //By default, redirect the user to the login page on authentication error.
        redirectOnAuthError = (typeof(redirectOnAuthError) == 'undefined')? true : redirectOnAuthError;

        console.log("Initiating an API call for URL (" + ConfigManager.getServerEndpoint() + url + ") with the following input data: " + JSON.stringify(data));

        $.ajax({
            type     : type,
            url      : ConfigManager.getServerEndpoint() + url,
            data     : data,
            dataType : dataType,
            success  : onSuccess( onSuccessCallback, onErrorCallback, url, redirectOnAuthError ),
            error    : onError( onErrorCallback, url )
        });

    };
    
    return that;
    
  
} )();var PendingSurveysController = function(){
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
    
};var SurveyController = function( surveyModel ) {

    var that = {};
    
    /**
     * Callback for when the user completes the survey.
     */
    var onSurveyComplete = function( surveyResponse ){

        ReminderModel.supressSurveyReminders( surveyModel.getID() );

        var afterSurveyComplete = function() {
            PageNavigation.goBack();
        };

        //Confirmation box related properties.
        var title = 'ohmage';
        var buttonLabels = 'Yes,No';
        var message = "Would you like to upload your response?";
        var callback = function( yes ) {

            //Yes upload my response now. 
            if( yes ) {

                var uploader = new SurveyResponseUploadController( surveyModel, surveyResponse);

                var onSuccess = function( response ) {
                    MessageDialogController.showMessage( "Successfully uploaded your survey response.", function() {
                        SurveyResponseModel.deleteSurveyResponse( surveyResponse );
                        afterSurveyComplete();
                    });

                };

                var onError = function( error ) {
                    MessageDialogController.showMessage( "Unable to upload your survey response at this time.", afterSurveyComplete );
                };

                uploader.upload( onSuccess, onError, ConfigManager.getGpsEnabled() );

            } else {
                afterSurveyComplete();
            }
        }

        if( ConfigManager.getConfirmToUploadOnSubmit() ) {
            MessageDialogController.showConfirm( message, callback, buttonLabels, title );
        }else{
            callback( true );
        }

    };
    
    /**
     * If the survey is currently rendered, this stores the PromptController 
     * object used to iterate through different prompts.
     */
    that.promptController = null;
    
    /**
     * Starts a new PromptController object with the current survey. This method
     * should be used to start off the survey. The prompts will be displayed one
     * by one, user response will be gathered in a SurveyResponse, etc.
     */
    that.start = function( container ) {

        //Start the actual survey.
        that.promptController = new PromptController( that, container );
        that.promptController.start( onSurveyComplete );
        
        return that.promptController;
    };
    
    /**
     * Returns the survey model associated with this controller.
     */
    that.getSurveyModel = function() {
        return surveyModel;
    };
    
    return that;
    
};
var SurveyResponseController = function(surveyResponseModel){
    var self = {};
    
    
    var campaign = new Campaign(surveyResponseModel.getCampaignURN());
    var survey = campaign.getSurvey(surveyResponseModel.getSurveyID());
    
    
    self.render = function(){
        return new SurveyResponseView(self).render();
    };

    /**
     * Button callback that will initialize a survey response upload. If the
     * upload is successful, then a message is displayed to the user and then
     * the entire queue is displayed. If unsuccessful, an error message is
     * displayed and the user has the option to retry.
     */
    self.uploadSurveyResponseCallback = function() {
        var onSuccess = function(response){
            MessageDialogController.showMessage("Successfully uploaded your survey response.", function(){
                SurveyResponseModel.deleteSurveyResponse(surveyResponseModel);
                PageNavigation.openUploadQueueView();
            });
        };
        var onError = function(error){
            MessageDialogController.showMessage("Unable to upload survey response at this time. Please try again later.");
        };
        (new SurveyResponseUploadController(survey, surveyResponseModel)).upload( onSuccess, onError, ConfigManager.getGpsEnabled() );
    };

    /**
     * Button handler for deleting an individual survey response. The user
     * will be prompted for confirmation before deleting the survey response.
     */
    self.deleteSurveyResponseCallback = function(){
        var message = "Are you sure you would like to delete your response?";
        MessageDialogController.showConfirm(message, function(yes){
            if(yes){
                SurveyResponseModel.deleteSurveyResponse(surveyResponseModel);
                PageNavigation.openUploadQueueView();
            }
        }, "Yes,No");
    };
    
    self.getSurvey = function(){
        return survey;
    };
    
    self.getSurveyResponseModel = function(){
        return surveyResponseModel;
    };
    
    self.getCampaign = function(){
        return campaign;
    };
    
    return self;
};
/**
 * SurveyResponseUploadController is responsible for the actual upload of the response
 * data.
 */
var SurveyResponseUploadController = function( surveyModel, surveyResponse ) {

    var that = {};

    /**
     * Compiles and returns an upload package with the current values set in the
     * survey response. In this case, no extra check of validity or availaility
     * of GPS location will be done - what you see, is what you get.
     */
    var getResponseData = function(){

        var responseData = surveyResponse.getUploadData();

        var data = {
                        campaign_urn               : surveyResponse.getCampaignURN(),
                        campaign_creation_timestamp: surveyModel.getCampaign().getCreationTimestamp(),
                        user                       : auth.getUsername(),
                        password                   : auth.getHashedPassword(),
                        client                     : ConfigManager.getClientName(),
                        surveys                    : JSON.stringify([responseData.responses]),
                        images                     : JSON.stringify(responseData.images)
                   };

        return data;

    };

    /**
     * Recursively tries to acquire the user's current geolocation until GPS
     * location is successfuly acquired or the user chooses to quit trying.
     *
     * @param At base case, callback will be invoked with a single boolean
     *        parameter indicating the success or failure of acquiring the GPS
     *        location i.e. false == user quit or unable to get GPS location.
     */
    var setResponseLocation = function( callback ) {

        //Show the spinner while trying to acquire user's GPS location.
        Spinner.show();

        //Start the Geolocation process.
        surveyResponse.setLocation(function(success){

            //On response, hide the spinner.
            Spinner.hide();

            //If the GPS location was succsesfuly set, then invoke the
            //callback and exit.
            if(success){
                callback(true);


            //In case the geolocation process timed out or was unsuccessful,
            //then ask the user if he/she would like to retry the process.
            }else{

                var errorMessage = "Geolocation failed. Would you like to try again?"

                MessageDialogController.showConfirm(errorMessage, function(yes){

                    //In case the user chooses to try the geolocation process
                    //again, then recursively call this function.
                    if(yes){
                        setResponseLocation(callback);

                    //If the user is tired of trying and quits, invoke the
                    //callback indicating failure.
                    }else{
                        callback(false);
                    }
                }, "Yes,No");


            }
        });

    };

    var getFinalizedUploadResponse = function(callback, requireLocation){

        var returnResponseData = function(){
            callback(getResponseData());
        };

        //If the survey response does not have a valid location and the location
        //parameter is required, then ask the user if he/she wants to try to
        //get the GPS location for the survey.
        if( !surveyResponse.isLocationAvailable() && requireLocation ) {

            var message = "Survey '" + surveyModel.getTitle() + "' does not have a valid GPS location. Would you like to try set it?";

            var confirmCallback = function( yes ) {

                //If the user wants to get the current GPS location, then try
                //to acquire the current GPS location.
                if( yes ) {

                    setResponseLocation(function(){
                        returnResponseData();
                    });

                }else{
                    returnResponseData();
                }
            };

            MessageDialogController.showConfirm( message, confirmCallback, "Yes,No" );

        //If validity of survey response location is not required or is
        //correctly set, then invoke the callback with the upload response data.
        } else {
            returnResponseData();
        }
    };

    /**
     * Uploads a single survey response object.
     * @param onSuccess Success response callback from API call.
     * @param onError Error response callback from API call.
     * @param requireLocation If set to true, the user will be asked to try to
     *        set the GPS location if the survey is lacking one.
     */
    that.upload = function( onSuccess, onError, requireLocation ) {

        if( typeof(requireLocation) === "undefined" ) {
            requireLocation = new Date().getTime() - surveyResponse.getSubmitDate().getTime() < 120000;
        }

        getFinalizedUploadResponse( function( data ) {

            var _onError = function( error ) {
                Spinner.hide( function() {
                    if( onError ) {
                        onError( error );
                    }
                });
            };

            var _onSuccess = function( response ) {
                console.log("SurveyResponseUploadController: Successfully returned from single survey response upload script.");
                Spinner.hide( function() {
                    if( onSuccess ) {
                        onSuccess( response );
                    }
                });
            };

            Spinner.show();

            ServiceController.serviceCall(
                 "POST",
                 ConfigManager.getSurveyUploadUrl(),
                 data,
                 "JSON",
                 _onSuccess,
                 _onError
            );

        }, requireLocation);

    };

    return that;

};

/**
 * Given an object of pending responses with key == uuid of the response,
 * recursively tries to upload the surveys and invokes the callback with the
 * final number of successfully uploaded surveys.
 */
SurveyResponseUploadController.uploadAll = function( pendingResponses, uploadCompletedCallback, requireLocation ){

    //Counts the number of successful uploads.
    var count = 0;

    //Construct an array of IDs. This allows much easier access with an index
    //inside the recursive call.
    var uuidList = [];
    for(var uuid in pendingResponses){
        uuidList.push(uuid);
    }

    var upload = function(i) {

        if( i >= uuidList.length ) {
            Spinner.hide(function(){
                if(typeof(uploadCompletedCallback) === "function"){
                    uploadCompletedCallback(count);
                }
            });

        }else{

            //Get the current survey and surveyResponse object to upload.
            var survey = pendingResponses[uuidList[i]].survey;
            var surveyResponse = pendingResponses[uuidList[i]].response;

            var uploadNextSurveyResponse = function(){
                upload(++i);
            };

            var onSuccess = function(response){
                count++;
                SurveyResponseModel.deleteSurveyResponse(surveyResponse);
                uploadNextSurveyResponse();
            };

            var onError = function(error){
                uploadNextSurveyResponse();
            };

            new SurveyResponseUploadController(survey, surveyResponse).upload(onSuccess, onError, requireLocation);

        }

    };

    Spinner.show();
    upload(0);
};
var SurveysController = (function() {
    var that = {};    
    return that;
})();

/**
 * 
 */
SurveysController.renderSurveyList = function () {
    var campaigns = CampaignsModel.getInstalledCampaigns(),
        surveyMenu = mwf.decorator.Menu("Available Surveys"),
        campaignURN,
        noAvailableSurveysMenuItem;
    for (campaignURN in campaigns) {
        if(campaigns[campaignURN].isRunning()){
            CampaignView.renderSurveyList(campaigns[campaignURN], surveyMenu, CampaignController.openSurveyViewHandler);
        }
    }
    if (surveyMenu.size() == 0) {
        noAvailableSurveysMenuItem = surveyMenu.addMenuLinkItem("No Available Surveys", null, "Please install a campaign, to view available surveys.");
        TouchEnabledItemModel.bindTouchEvent(noAvailableSurveysMenuItem, noAvailableSurveysMenuItem, PageNavigation.openAvailableCampaignsView, "menu-highlight");
    }
    return surveyMenu;
};var UploadQueueController = function(){
    var that = {};
    
    var pendingResponses = SurveyResponseModel.getPendingResponses();
    
    var refreshView = function(){
        PageNavigation.openUploadQueueView();
    };
    
    that.deleteAllCallback = function(){
        var message = "Are you sure you would like to delete all your responses?";
        var buttonLabels = 'Yes,No';
        var confirmationCallback = function(yes){
            if(yes){
                for(var uuid in pendingResponses){
                    SurveyResponseModel.deleteSurveyResponse(pendingResponses[uuid].response);
                }
                refreshView();
            }
        };
        MessageDialogController.showConfirm(message, confirmationCallback, buttonLabels);
    };
    
    that.uploadAllCallback = function(){
        var uploadAllDoneCallback = function(successfulUploadCount){
            var message;
            if(successfulUploadCount === 0){
                message = "Unable to upload any surveys at this time.";
            }else{
                message = "Successfully uploaded " + successfulUploadCount + " survey(s).";
            }  
            MessageDialogController.showMessage(message, function(){
                refreshView();
            });
        };
        SurveyResponseUploadController.uploadAll( pendingResponses, uploadAllDoneCallback, ConfigManager.getGpsEnabled() );
    };
    
    that.getPendingResponses = function() {
        return pendingResponses;
    };
    
    that.render = function() {
        var uploadQueueView = new UploadQueueView(that);
        return uploadQueueView.render();
    };
    
    return that;
};
Init.invokeOnReady( function() {

    if( auth.isUserLocked() ) {

        //If the user is in a locked state, force the username field to
        //be read only.
        $("#username").val(auth.getUsername())
                      .attr('readonly', true);


        mwf.decorator.TopButton("Switch User", null, function(){
            if(auth.logout()){

                $("#username").val("")
                              .attr('readonly', false);

                mwf.decorator.TopButton.remove();
            }
        }, true);
    } else {
        mwf.decorator.TopButton("Switch Server", null, PageNavigation.openServerChangeView, true);
    }

    var isInputValid = function(){

        if($('#username').val().length == 0 && $('#password').val().length == 0){
            MessageDialogController.showMessage('Please enter your username and password.', function(){
                $('#username').focus();
            });

            return false;
        }

        if($('#username').val().length == 0){
            MessageDialogController.showMessage('Please enter your username.', function(){
                $('#username').focus();
            });

            return false;
        }

        if($('#password').val().length == 0){
            MessageDialogController.showMessage('Please enter your password.', function(){
                $('#password').focus();
            });

            return false;
        }

        return true;

    };

    var login = function(){
        if(!isInputValid()){
            return;
        }

        var username = $("#username").val();
        var password = $("#password").val();

        Spinner.show();

        //On successful authentication, redirects the user to the dashboard.
        auth.authenticateByHash(username, password, function(success, response){

           Spinner.hide(function(){
               if(success){
                   PageNavigation.openDashboard();
               }else if(response){
                   MessageDialogController.showMessage( response );
               }else{
                   MessageDialogController.showMessage( "Unable to login. Please try again." );
               }
           });


        }, false);
    };

    //Disable the form element from refreshing and instead try to login.
    $("#auth-form").submit(function(e){
        e.preventDefault();
        login();
        return false;
    });

});

Init.invokeOnReady( function () {

    if (CampaignsModel.getInstalledCampaignsCount() > 0 ) {
        mwf.decorator.TopButton("My Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
    }
    
    var onSuccess = function () {
        $("#view").append(CampaignsController.renderAvailableCampaigns());
    };

    var onError = function () {
        MessageDialogController.showMessage("Unable to download campaigns. Please try again later.")
    };

    CampaignsModel.download(false, onSuccess, onError);
    
    

});

 Init.invokeOnReady( function () {

     var campaignURN = PageNavigation.getPageParameter('campaign-urn');

     //If a specific campaign is not specified, take the user to the
     //campaigns view where the user may be able to choose an appropriate
     //campaign.
     if (campaignURN === null) {
         PageNavigation.goBack();
     }

     var campaignModel = CampaignModel(campaignURN);

     document.getElementById('view').appendChild(CampaignController(campaignModel).renderCampaignView());

     mwf.decorator.TopButton("My Campaigns", null, PageNavigation.openInstalledCampaignsView, true);

 });

Init.invokeOnReady(function() {
    $('#view').append((new ChangeServerController()).renderChangeServerView());
});
Init.invokeOnReady(function() {
    $('#help-container').append((new HelpController()).renderHelpMenu());
});
Init.invokeOnReady( function() {
    var helpController = new HelpController();
    var sectionIndex = PageNavigation.getPageParameter('help-section-index');
    if(sectionIndex === null){ PageNavigation.goBack(); }
    $('#help-container').append(helpController.renderHelpSection(sectionIndex));
});
Init.invokeOnReady( function() {

    mwf.decorator.TopButton("Logout" , null, auth.logout, true);

    var queueSize = SurveyResponseModel.getUploadQueueSize();
    var queueLabel = "Queue (" + queueSize + ")";

    var dashboard = mwf.decorator.Menu();

    dashboard.addMenuImageItem('Campaigns', 'installed-campaigns.html',    'img/dash/dash_campaigns.png');
    dashboard.addMenuImageItem('Surveys',   'surveys.html',                'img/dash/dash_surveys.png');
    dashboard.addMenuImageItem( queueLabel, 'upload-queue.html',           'img/dash/dash_upqueue.png');
    dashboard.addMenuImageItem('Profile',   'profile.html',                'img/dash/dash_profile.png');
    dashboard.addMenuImageItem('Help',      'help-menu.html',              'img/dash/dash_help.png');
    dashboard.addMenuImageItem('Reminders', 'reminders.html',              'img/dash/dash_reminders.png');

    if(DeviceDetection.isDeviceAndroid()){
        var androidBackButtonCallback = function(){
            navigator.app.exitApp();
        };
        $(window).bind('beforeunload', function() {
           document.removeEventListener("backbutton", androidBackButtonCallback, false);
        });
        document.addEventListener("backbutton", androidBackButtonCallback, true);
    }


    $('#dashboard').append(dashboard);

});

Init.invokeOnReady(function () {

    mwf.decorator.TopButton("Add Campaign", null, PageNavigation.openAvailableCampaignsView, true);

    if (CampaignsModel.getInstalledCampaignsCount() > 0) {
        $('#view').append(CampaignsController.renderInstalledCampaigns());
        $("#view").append(mwf.decorator.SingleClickButton("Upload Queue", PageNavigation.openUploadQueueView));
    } else {
        PageNavigation.openAvailableCampaignsView();
    }
});

Init.invokeOnReady(function() {

    var isInputValid = function(){

        if($('#current-password').val().length == 0){
            MessageDialogController.showMessage('Please enter your current password.');
            $('#current-password').focus();

            return false;
        }

        if($('#new-password').val().length == 0){
            MessageDialogController.showMessage('Please enter your new password.');
            $('#new-password').focus();
            return false;
        }


        if($('#confirm-password').val().length == 0){
            MessageDialogController.showMessage('Please confirm your password.');
            $('#confirm-password').focus();
            return false;
        }

        if($('#new-password').val() != $('#confirm-password').val()){
            MessageDialogController.showMessage('New password and password confirmation do not match.');
            $('#confirm-password').focus();
            return false;
        }

        if(!auth.isPasswordValid($('#new-password').val())){
            MessageDialogController.showMessage(auth.getPasswordRequirements());
            $('#new-password').focus();
            return false;
        }

        return true;

    };

    $("#change-password").click(function(){

        if(!isInputValid())
            return;

        var currentPassword = $("#current-password").val();
        var newPassword     = $("#new-password").val();

        var onSuccess = function() {
            Spinner.hide(function(){
                auth.setAuthErrorState(true);
                MessageDialogController.showMessage('Your password has been successfully changed. Please login to continue.');
                PageNavigation.openAuthenticationPage();
            });


        };

        var onError = function(response){
            Spinner.hide(function(){
                if(response){
                    MessageDialogController.showMessage(response.errors[0].text);
                }else{
                    MessageDialogController.showMessage('Network error occured. Please try again.');
                }

                $('#current-password').focus();
            });



        };

        Spinner.show();

        ServiceController.serviceCall(
             "POST",
             ConfigManager.getPasswordChangeUrl(),
             {
                 auth_token:   auth.getHashedPassword(),
                 client:       ConfigManager.getClientName(),
                 user:         auth.getUsername(),
                 password:     currentPassword,
                 new_password: newPassword

             },
             "JSON",
             onSuccess,
             onError,
             false
        );

   });

});
Init.invokeOnReady(function() {
    $("#pending-surveys").append(new PendingSurveysController().render());
    $("#pending-surveys").append(mwf.decorator.SingleClickButton("Dashboard",  PageNavigation.openDashboard));
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
    $(document).unbind("backbutton");
});
Init.invokeOnReady(function() {

    (function(){

        var label = (auth.isUserAuthenticated()) ? "Dashboard" : "Login";
        var goBack = function(){

            if(auth.isUserAuthenticated()){
                PageNavigation.openDashboard();
            }else{
                PageNavigation.openAuthenticationPage();
            }

        };

        mwf.decorator.TopButton(label, null, goBack, true);

        $("#go-back-button").append(mwf.decorator.SingleClickButton(label, goBack));

    })();

});
Init.invokeOnReady(function() {
    $('#view').append(ProfileController().renderProfileView());
});
Init.invokeOnReady(function() {
    var controller = new ReminderController(PageNavigation.getPageParameter('uuid'));
    $("#view-container").append(controller.render());
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
});
Init.invokeOnReady(function() {
    $("#reminders").append((new RemindersController()).render());
    $("#reminders").append(mwf.decorator.DoubleClickButton("Dashboard", PageNavigation.openDashboard,
                                                           "Pending", PageNavigation.openPendingSurveysView));
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
});
Init.invokeOnReady(function() {

    //Required for retreiving specific campaign configuration file.
    var campaignURN = PageNavigation.getPageParameter('campaign-urn');

    //Required for getting a specific survey from the campaign.
    var surveyID    = PageNavigation.getPageParameter('survey-id');

    //If a specific campaign is not specified, take the user to the
    //campaigns view where the user may be able to choose an appropriate
    //campaign.
    if( campaignURN === null || surveyID === null ) {

        PageNavigation.goBack();

    } else {

        PageNavigation.unsetPageParameter("survey-id");

        var campaign = new CampaignModel( campaignURN );
        var surveyModel = campaign.getSurvey( surveyID );

        var surveyController = SurveyController( surveyModel );

        var navigation = surveyController.start(document.getElementById('survey'));

        mwf.decorator.TopButton("All Surveys", null, function(){
            navigation.confirmSurveyExit(function() {
                PageNavigation.openCampaignView(campaignURN, surveyID);
            });
        }, true);

        $("#header-link").click(function() {
            navigation.confirmSurveyExit(function() {
                PageNavigation.openDashboard();
            });
        });
    }
});
Init.invokeOnReady(function() {
    var surveyKey = PageNavigation.getPageParameter('survey-key');
    if(surveyKey === null){ PageNavigation.goBack(); }
    var surveyResponse = SurveyResponseModel.restoreSurveyResponse(surveyKey);
    var surveyResponseController = new SurveyResponseController(surveyResponse);
    document.getElementById("survey-response-view").appendChild(surveyResponseController.render());
    mwf.decorator.TopButton("Upload Queue", null, PageNavigation.openUploadQueueView, true);
});    
Init.invokeOnReady(function() {
    $("#view").append(SurveysController.renderSurveyList());
    $("#view").append(mwf.decorator.SingleClickButton("Upload Queue", PageNavigation.openUploadQueueView));
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView , true);

});

Init.invokeOnReady(function() {
    var uploadQueueController = new UploadQueueController();
    document.getElementById('upload-queue-menu').appendChild(uploadQueueController.render());
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
});
var Init = (function() {

    var that = {};

   /**
    * Method for invoking functions once the DOM and the device are ready.
    * This is a replacement function for the JQuery provided method i.e.
    * $(document).ready(...).
    */
    that.invokeOnReady = function ( callback ) {
        $(document).ready(function() {

            //Wait for the device ready event only if the the application is running
            //on a mobile browser embedded in a Cordova deployment.
            if ( DeviceDetection.isOnDevice() && DeviceDetection.isNativeApplication() ) {
                document.addEventListener("deviceready", callback, false);
            } else if ( callback && typeof( callback ) === 'function' ) {
                callback();
            }

        });
    }

    return that;

})();var CustomPropertiesVault = function(prompt){
   var self = {};
   
   var vault = new LocalMap(CustomPropertiesVault.VAULT_LOCAL_MAP_NAME);
   
   var campaignURN = prompt.getCampaignURN();
   var surveyID    = prompt.getSurveyID();
   var promptID    = prompt.getID();
      
   var campaignProperties, surveyProperties, promptProperties;
   
   var read = function(){
       campaignProperties = vault.get(campaignURN) || {};
       surveyProperties   = campaignProperties[surveyID] || {};
       promptProperties   = surveyProperties[promptID]   || [];    
   };
   
   var write = function(){
       surveyProperties[promptID] = promptProperties;
       campaignProperties[surveyID] = surveyProperties;
       vault.set(campaignURN, campaignProperties);
   };
   
   self.addCustomProperty = function(customChoice){
       read();
       promptProperties.push(customChoice);
       write();
   };
   
   self.getCustomProperties = function(){
       read();
       return promptProperties;
   };
   
   self.deleteCustomProperties = function(){
       read();
       promptProperties = [];
       write();
   };
   
   return self;
};

CustomPropertiesVault.VAULT_LOCAL_MAP_NAME = 'custom-properties-vault';

CustomPropertiesVault.deleteAllCustomProperties = function(){
    (new LocalMap(CustomPropertiesVault.VAULT_LOCAL_MAP_NAME)).erase(); 
};var CampaignModel = function (campaignURN) {

    var that = {};

    var metadata = (new LocalMap("all-campaigns").get(campaignURN));
    var campaign = (new LocalMap("campaign-configurations")).get(campaignURN);

    /**
     * Returns surveys associated with this campaign.
     */
    that.getSurveys = function () {

        //Get the list of surveys from the campaign.
        var surveys  = campaign.surveys.survey;

        //If survey is returned as a single item, then go ahead and place
        //it in an array. This is a kind of a dirty fix, if you have any
        //better ideas of approaching the situation - please be my guest.
        return (!surveys.length)? [surveys] : surveys;
    };

    that.isRunning = function () {
        return metadata.running_state === 'running';
    };

    /**
    * Returns a survey associated with the provided survey ID. If the campaign,
    * doesn't contain a survey with the provided ID, a null value will be
    * returned.
    */
    that.getSurvey = function (id) {

       //Get a list of all the possible surveys.
       var surveys = that.getSurveys();

       //Iterate through the list of retrieved surveys. If a ID match is found,
       //return the survey.
       for (var i = 0; i < surveys.length; i++) {
          if (surveys[i].id == id) {
              return SurveyModel( surveys[i], that );
          }
       }

       //If no match was found, return null.
       return null;
    };

    /**
     * Returns the name of the current campaign.
     */
    that.getName = function () {
        return metadata.name;
    };

    /**
     * Returns the URN for this campaign.
     */
    that.getURN = function () {
        return campaignURN;
    };

    /**
     * Return's the campaign's creation timestamp.
     */
    that.getCreationTimestamp = function () {
        return metadata.creation_timestamp;
    };

    /**
     * Returns the description for this campaign.
     */
    that.getDescription = function () {
        return metadata.description;
    };

    return that;
};

/**
 *
 *
 */
CampaignModel.install = function (urn, onSuccess, onError) {

    Spinner.show();

    var _onError = function(response){

        Spinner.hide(function(){
            if(onError){
                onError(response);
            }
        });
    };

    var _onSuccess = function(response) {

        Spinner.hide(function(){

            if(response.result === "success"){

                var installedCampaigns = new LocalMap("installed-campaigns");
                installedCampaigns.set(urn, Math.round(new Date().getTime() / 1000));

                var campaignConfigurations = new LocalMap("campaign-configurations");
                campaignConfigurations.set(urn, CampaignModel.parse(response.data[urn].xml));

                if(onSuccess){
                    onSuccess();
                }
            }
        });



    };

    ServiceController.serviceCall(
         "POST",
         ConfigManager.getCampaignReadUrl(),
         {
             user:            auth.getUsername(),
             password:        auth.getHashedPassword(),
             client:          ConfigManager.getClientName(),
             campaign_urn_list: urn,
             output_format:   'long'
         },
         "JSON",
         _onSuccess,
         _onError
    );

}

CampaignModel.parse = function(campaignXML){

    /*
     * There is apparently a very weird problem running JavaScript within
     * PhoneGap – the engine is so restrictive that when encountering the word
     * ‘default’, used within the prompt’s XML configuration file as a property
     * storing the default value, it interprets it as a keyword crushing the
     * system. This renders the XML2JSON conversion impossible. The only
     * solution I currently found was to replace all ‘default’  parameters within
     * the XML string to ‘def’ prior to converting to JSON. I am assuming the
     * problem is from the XML2JSON plugin’s use of the dot operator instead of
     * the array-access syntax to do the parsing, but debugging the plugin is
     * not working – there are only two xml->json parsers and I have tested
     * both. Everything works fine on the desktop side, but once placed within
     * PhoneGap the bug comes up.
     */
    var cleanXML = campaignXML.replace(/<default>/g, "<defaultValue>")
                              .replace(/<\/default>/g, "</defaultValue>")
                              .replace(/<default\/>/g, "<defaultValue/>");

    //Convert the XML configuration to a JSON representation.
    var json = $.xml2json.parser(cleanXML);

    return json.campaign;

}/**
 * Singleton Model!
 */
var CampaignsModel = (function() {

    var that = {};

    /**
     * Stores a list of all available campaigns.
     */
    var allCampaigns = new LocalMap("all-campaigns");

    /**
     * Stores a list of installed camapigns.
     */
    var installedCampaigns = new LocalMap("installed-campaigns");

    /**
     * Returns true campaign metadata has not been downloaded. This doesn't
     * have anything to do installed campaigns.
     * @return True if campaigns metadata has not been downloaded.
     */
    that.isEmpty = function () {
        return allCampaigns.length() === 0;
    };

    /**
     * Returns the number of currently installed campaigns.
     * @return Number of currently installed campaigns.
     */
    that.getInstalledCampaignsCount = function () {
        return installedCampaigns.length();
    };

    that.getCampaign = function (campaignURN) {
        return CampaignModel(campaignURN);
    };

    /**
     * Deletes the specified campaign from the local storage. This method will
     * also delete all reminders associated with the provided campaign.
     * @param urn Unique campaign identifier.
     */
    that.uninstallCampaign = function (urn) {
        installedCampaigns.release(urn);
        ReminderModel.deleteCampaignReminders(urn);
    };

    /**
     * Returns all available campaigns even if they are installed.
     */
    that.getAllCampaigns = function () {
        var campaigns = {};
        for(var campaignURN in allCampaigns.getMap()){
            campaigns[campaignURN] = CampaignsModel.getCampaign(campaignURN);
        }
        return campaigns;
    };

    that.getAvailableCampaigns = function() {
        var campaigns = {};
        for (var campaignURN in allCampaigns.getMap()) {
            if( !installedCampaigns.isSet( campaignURN )){
                campaigns[campaignURN] = CampaignsModel.getCampaign(campaignURN);
            }
        }
        return campaigns;
    };

    /**
     * Returns a list of campaign objects that the user has currently installed.
     */
    that.getInstalledCampaigns = function () {
        var campaigns = {};
        for (var campaignURN in installedCampaigns.getMap()) {
            campaigns[campaignURN] = CampaignsModel.getCampaign(campaignURN);
        }
        return campaigns;
    };

    /**
     * Downloads a list of campaigns.
     */
    that.download = function (force, onSuccess, onError) {

        if (typeof(force) == undefined) {
            force = false;
        }


        if (!force && !that.isEmpty()) {
            if (onSuccess) {
                onSuccess();
            }
            return;
        }

        var _onError = function (response) {
            Spinner.hide(function(){
                if(onError){
                    onError(response);
                }
            });
        };

        var _onSuccess = function (response) {
            Spinner.hide(function () {

                if (response.result === "success") {

                    var campaigns = new LocalMap("all-campaigns");

                    campaigns.erase();

                    for (var urn in response.data) {
                        campaigns.set(urn, response.data[urn]);
                    }

                    if (onSuccess) {
                        onSuccess();
                    }
                }
            });


        };

        Spinner.show();

        ServiceController.serviceCall(
             "POST",
             ConfigManager.getCampaignReadUrl(),
             {
                 user:          auth.getUsername(),
                 password:      auth.getHashedPassword(),
                 client:        ConfigManager.getClientName(),
                 output_format: 'short'
             },
             "JSON",
             _onSuccess,
             _onError
        );
    };

    return that;
})();


var HelpModel = function(){
    var self = {};
    var helpSections = [
        {
         title:'Using the Dashboard',
         text: 'Dashboard is the main page of the application. It allows \n\
                quick access to campaigns, surveys, the upload queue, help \n\
                tutorials and also allows users to log out.',
         img:  'img/screenshots/dashboard.png'
        },

        {
         title:'Installing Campaigns',
         text: 'To install a new campaign, navigate to the campaigns section\n\
                from the dashboard, and click on one of the campaigns listed \n\
                under the \'Available Campaigns\' menu. If there are currently\n\
                no campaigns installed on the phone, you will automatically be\n\
                redirected to the available campaigns section. ',
         img:  'img/screenshots/installing-campaigns.png'
        },

        {
         title:'Taking Surveys',
         text: 'Click on one of the surveys to answer survey related prompts.',
         img:  'img/screenshots/taking-surveys.png'
        },

        {
         title:'Uploading Responses',
         text: 'You can view responses that have not been uploaded in the upload\n\
                queue section. Here you have the option to delete all the pending\n\
                uploads, upload all responses, or upload/delete individual survey\n\
                responses.',
         img:  'img/screenshots/uploading-responses.png'
        },

        {
         title:'Changing Password',
         text: 'Enter your current password, a new password and a confirmation\n\
                of the new password to change your password. When your password\n\
                is successfully changed, you will be directed to the login page\n\
                where you can use your new password to login.',
         img:  'img/screenshots/changing-password.png'
        }

    ];
    
    self.getAllSections = function(){
        return helpSections;
    };
    
    self.getHelpSection = function(index){
        return helpSections[index];
    };
    
    return self;
    
};
/**
 * Represents an individual prompts.
 * @author Zorayr Khalapyan
 */
var PromptModel = function (promptData, survey, campaign) {

    var that = {};

    /**
     * Stores error message in case validation fails.
     */
    var errorMsg = null;

    /**
     * Default handler for the current prompt. The handler knows how to display
     * the prompt and analyze the response.
     */
    var handler = new PromptHandler(that);

    var customPropertiesVault = null;

    /**
     * Stores a list of current specified and custom properties which are just
     * (key, value) pairs.
     */
    var properties = null;

    /**
     * The method initlization the list of both specified and custom properties.
     * This method should be invoked when this prompt is initialized.
     */
    var setProperties = function(){
        if(!promptData.properties || !promptData.properties.property){
            properties = [];
        } else if(!promptData.properties.property.length){
            properties = [promptData.properties.property];
        }else{
            properties = promptData.properties.property;
        }

        var customProperties = customPropertiesVault.getCustomProperties();
        for(var i = 0; i < customProperties.length; i++){
            properties.push(customProperties[i]);
        }
    };

    /**
     * Detects if the specified property is already in the property list of this
     * prompt. The method returns true if the property is a duplicate, false
     * otherwise.
     */
    var isDuplicatePropertyLabel = function(property){
        for(var i = 0; i < properties.length; i++){
            if(properties[i].label == property.label){
                return true;
            }
        }
        return false;
    };

    that.summarizeResponse = function(responseValue){
        var summary = "";

        if(responseValue === SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE ||
           responseValue === SurveyResponseModel.SKIPPED_PROMPT_VALUE ) {
            return responseValue;
        }

        switch(that.getType()){

            case 'photo':
                if(responseValue !== SurveyResponseModel.SKIPPED_PROMPT_VALUE){
                    var base64 = Base64.formatImageSrcString(SurveyResponseModel.getImage(responseValue));
                    summary = "<center><img src='" + base64 + "' width='100%' /></center>";
                }else{
                    summary = responseValue;
                }

                break;

            case 'single_choice':
                summary = that.getProperty(responseValue[0]).label;

                break;

            case 'multi_choice':
                var keys = new String(responseValue).split(',');
                var labels = [];
                for(var key in keys){
                    labels.push(that.getProperty(key).label);
                }
                summary = labels.join(", ");

                break;

            default:
                summary = responseValue;
        }
        
        return summary;
    };

    that.render = function(){
        return handler.render();
    };

    /**
    * Default validator for this prompt. Each individual prompt type should
    * override this method. By default, every response is valid.
    *
    * @return True.
    *
    */
    that.isValid = function(){
        return true;
    };

    /**
     * Returns validation error message or false if none. If this method is
     * called without calling isValid on the current prompt, then isValid will
     * be automatically called before retreiving the error message.
     */
    that.getErrorMessage = function(){
        if(errorMsg === null){
            that.isValid();
        }

        return (errorMsg)? errorMsg : false;
    };

    /**
     * Set an error message for the current prompt.
     * @param message The new error message.
     */
    that.setErrorMessage = function(message){
        errorMsg = message;
    };

    /**
     * Returns the default response for this prompt. Each individual prompt type
     * should override this method in order to return the correct response.
     */
    that.getResponse = function() {
        return that.getDefaultValue();
    };

   /**
    * Returns a list of properties for this prompt.
    */
    that.getProperties = function(){
        return properties;
    };

    that.getProperty = function(key){
        var properties = that.getProperties();
        for(var i = 0; i < properties.length; i++){
            if(properties[i].key == key){
                return properties[i];
            }
        }
        return null;
    };

    /**
     * Returns minimum value allowed for the current prompt's response, or null
     * if the minimum value is undefined.
     * @return minimum value allowed for the current prompt's response, or null
     *         if undefined.
     */
    that.getMinValue = function(){
        var minProperty = that.getProperty("min");
        return minProperty !== null ? minProperty.label : null;
    };

    /**
     * Returns maximum value allowed for the current prompt's response, or null
     * if the maximum value is undefined.
     * @return maximum value allowed for the current prompt's response, or null
     *        if undefined.
     */
    that.getMaxValue = function(){
        var maxProperty = that.getProperty("max");
        return maxProperty !== null ? maxProperty.label : null;
    };

   /**
    * Adds a new property to this prompt. If the property label already exists,
    * then the method will have no side effects and will return false.
    */
   that.addProperty = function(label, key){
        //By default, property key is the index of the array.
        var property = { key:key || properties.length, label:label };
        if(!isDuplicatePropertyLabel(property)){
            properties.push(property);
            customPropertiesVault.addCustomProperty(property);
            return property;
        }else{
            return false
        }
    };

    that.getCampaignURN = function(){
        return campaign.getURN();
    };

    that.getSurveyID = function(){
        return survey.getID();
    };

    /**
     * Returns the ID of the current prompt.
     * @return The ID of the current prompt.
     */
    that.getID = function(){
        return promptData.id;
    };

    /**
     * Returns the conditional statement associated with the current prompt.
     */
    that.getCondition = function(){
        if( typeof(promptData.condition) !== "undefined" ) {
            var condition = promptData.condition;
            condition = condition.replace(/&gt;/g, ">");
            condition = condition.replace(/&lt;/g, "<");
            return condition;
        }
        return null;
    };

    /**
     * Returns the type of the current prompt.
     * @return the type of the current prompt.
     */
    that.getType = function(){
        return promptData.prompttype;
    };

    /**
     * Returns text related to this prompt. If prompt text is undefined, then an
     * empty string will be returned.
     */
    that.getText = function(){
        return promptData.prompttext || "";
    };

    /**
     * Returns true if the prompt may be skipped.
     * @return true if the prompt may be skipped.
     */
    that.isSkippable = function(){
        return promptData.skippable === "true";
    };

    /**
     * Returns the label that should be displayed inside the skip button.
     */
    that.getSkipLabel = function(){
        return promptData.skiplabel;
    };

    /**
     * Returns the default value for this prompt.
     * @return Default value for this prompt.
     */
    that.getDefaultValue = function(){
        //Access the default value of the prompt with array accessing schema
        //in order to bypass JS keyword use 'default'.
        return (typeof(promptData.defaultvalue) !== 'undefined')? promptData.defaultvalue : null;
    };

    //Initialization.
    (function(){
       customPropertiesVault = new CustomPropertiesVault(that);
       setProperties();
    }());

    return that;
};/**
 * @class ReminderModel
 * @author Zorayr Khalapyan
 * @version 8/13/2012
 */
var ReminderModel = function( uuid ) {

    var that = {};
    var title = "";
    var campaignURN = "";
    var surveyID = ""
    var message = "";
    var ticker = "";
    var notificationAdapter = LocalNotificationAdapter;

    /**
     * Supression window in hours. Default is 24.
     */
    var supressionWindow = 24;

    /**
     * If true, weekends will be excluded in recurring reminders.
     */
    var excludeWeekends = false;

    /**
     * A list of individual notifications i.e. objects that contain id and date.
     */
    var notifications = [];

    /**
     * Cancels a set notification with the provided ID.
     */
    var cancelNotification = function( notification ) {
        //Don't cancel notifications that are in the past.
        if( notification.date.getTime() >= new Date().getTime() ) {
            console.log("ReminderModel: Canceling notification with id [" + notification.id + "] associated with survey [" + surveyID + "]");
            notificationAdapter.cancel( notification.id );
        }
    };

    /**
     * Returns a JSON representation of the current reminder model. All time
     * related data will be stored as integers.
     * @visibleForTesting
     */
     that.toJSON = function(){
        var reminderJSON = {
            title             : title,
            campaign_urn      : campaignURN,
            survey_id         : surveyID,
            message           : message,
            ticker            : ticker,
            supression_window : supressionWindow,
            exclude_weekends  : excludeWeekends
        };
        reminderJSON.notifications = [];
        for(var i = 0; i < notifications.length; i++){
            reminderJSON.notifications.push({
               id   : notifications[i].id,
               time : notifications[i].date.getTime()
            });
        }
        return reminderJSON;
    };

    /**
     * Adds a new notification with the specified date to the current reminder
     * model.
     */
    that.addNotification = function( date ){
        var id = ReminderModel.getNextAvailableNotificationID();
        var options = {
            date        : date,
            message     : message,
            ticker      : ticker,
            repeatDaily : false,
            id          : id
        };
        console.log("ReminderModel: Notification was set with the following options - " + JSON.stringify(options));
        notificationAdapter.add(options);
        notifications.push({id : id, date : date});
        return options;
    };

    /**
     * Saves the current reminder in localStorage.
     */
    that.save = function(){
        ReminderModel.reminders.set( uuid, that.toJSON() );
    };

    /**
     * Returns true if the current reminder has been saved in localStorage.
     */
    that.isSaved = function(){
        return ReminderModel.reminders.isSet(uuid);
    };

    /**
     * This method is useful when updating the reminder. Instead of deleting and
     * recreating a reminder - the controller can cancel all the current set
     * notifications, and add new reminders according to the user's
     * modification.
     */
    that.cancelAllNotifications = function(){
        for(var i = 0; i < notifications.length; i++){
            cancelNotification( notifications[i] );
        }
        notifications = [];
        that.save();
    };

    /**
     * Cancels all set notifications for this reminder and then deletes this
     * reminder from the localStorage.
     */
    that.deleteReminder = function() {
        console.log("ReminderModel: Deleting reminder with the following UUID [" + uuid + "].");
        that.cancelAllNotifications();
        ReminderModel.reminders.release(uuid);
    };

    /**
     * Given a cutoff date, cancel all notifications that occured within the
     * suppresion window's timeperiod.
     */
    that.suppress = function( date ){
        date = date || new Date();
        var activeNotifications = [], i = 0;
        var suppressionWindowTime = supressionWindow * 60 * 60 * 1000;
        var surveySuppressed = false;
        for( i; i < notifications.length; i++ ) {
            if( notifications[i].date.getTime() - date.getTime() < suppressionWindowTime ) {
                cancelNotification( notifications[i] );
                surveySuppressed = true;
            } else {
                activeNotifications.push( notifications[i] );
            }
        }
        notifications = activeNotifications;
        //If all the notifications have been suppressed, delete this reminder
        //model. Otherwise, save the updates.
        if(notifications.length === 0){
            that.deleteReminder();
        }else{
            that.save();
        }
        return surveySuppressed;
    };

    /**
     * Restores a reminder with the specified UUID from localStorage.
     */
    that.restore = function( storedUUID ){
        var object       = ReminderModel.reminders.get(storedUUID);
        uuid             = storedUUID;
        title            = object.title;
        campaignURN      = object.campaign_urn;
        surveyID         = object.survey_id;
        message          = object.message;
        ticker           = object.ticker;
        supressionWindow = object.supression_window;
        excludeWeekends  = object.exclude_weekends;
        notifications = [];
        for(var i = 0; i < object.notifications.length; i++){
            notifications.push({
                id   : object.notifications[i].id,
                date : new Date( object.notifications[i].time )
            });
        }
    };

    that.setAssociation = function(newCampaignURN, newSurveyID){
        campaignURN = newCampaignURN
        surveyID    = newSurveyID;
    };

    that.setMessage = function( newMessage ){
        message = newMessage;
        ticker  = newMessage;
    };

    that.setTitle = function( newTitle ){
        title = newTitle;
    };

    that.setSupressionWindow = function( newSupressionWindow ){
        supressionWindow = newSupressionWindow;
    };

    that.setExcludeWeekends = function( newExcludeWeekends ){
        excludeWeekends = newExcludeWeekends;
    };

    /**
     * A remineder is expired if it doesn't have any more notificationss, or if
     * the last notification is in the past.
     */
    that.isExpired = function(){
        return notifications.length == 0
            || notifications[notifications.length - 1].date.getTime() <= new Date().getTime();
    };

    that.getUUID = function(){
        return uuid;
    };

    that.getCampaignURN = function(){
        return campaignURN;
    };

    that.getSurveyID = function(){
        return surveyID;
    };

    that.getTitle = function(){
        return title;
    };

    /**
     * Returns the date of the earliest set notification for this reminder.
     */
    that.getDate = function(){
        return (notifications.length !== 0)? notifications[0].date : null;
    };

    that.getSupressionWindow = function(){
        return parseInt(supressionWindow);
    };

    that.excludeWeekends = function(){
        return excludeWeekends;
    };

    that.getRecurrence = function(){
        return notifications.length;
    };

    /**
     * Returns current notifications.
     * @visibleForTesting
     */
    that.getNotifications = function() {
        return notifications;
    };

    that.getMessage = function() {
        return message;
    };

    /**
     * Replaces the reference to the LocalNotificationAdapter.
     * @visibleForTesting
     */
    that.setNotificationAdapter = function ( newNotificationAdapter ) {
        notificationAdapter = newNotificationAdapter;
    };

    //Initialization: if the user has specified a UUID for this reminder than
    //restore the saved model from localStorage. Otherwise, generate a new
    //unique identifier.
    (function(){
        if(typeof(uuid) !== "undefined"){
            that.restore(uuid);
        }else{
            uuid = UUIDGen.generate();
        }
    }());



    return that;
};


ReminderModel.getNextAvailableNotificationID = function(){

    if(!ReminderModel.remindersMetadata.isSet('last-id')){
        ReminderModel.remindersMetadata.set('last-id', 0);
    }

    var id = ReminderModel.remindersMetadata.get('last-id');
    ReminderModel.remindersMetadata.set('last-id', id + 1);
    return id;
};

ReminderModel.remindersMetadata = new LocalMap("reminders-metadata");
ReminderModel.reminders = new LocalMap("reminders");

/**
 * Returns all saved reminders.
 */
ReminderModel.getAllReminders = function(){
    var remindersMap = ReminderModel.reminders.getMap();
    var allReminders = [];
    for(var uuid in remindersMap){
        if(remindersMap.hasOwnProperty(uuid)){
            allReminders.push( new ReminderModel(uuid) );
        }
    }
    return allReminders;
};

/**
 * Cancels all set notifications for saved reminders.
 */
ReminderModel.cancelAll = function() {
    console.log("ReminderModel: Cancelling all reminders.");
    var reminders = ReminderModel.getAllReminders();
    for( var i = 0; i < reminders.length; i++ ) {
        reminders[i].deleteReminder();
    }
};

/**
 * Supresses all reminders associated with the specified survey.
 */
ReminderModel.supressSurveyReminders = function( surveyID ) {
    console.log("ReminderModel: Supressing all reminders for survey [" + surveyID + "].");
    var reminders = ReminderModel.getAllReminders(), i = 0;
    for(i; i < reminders.length; i++){
        if(reminders[i].getSurveyID() === surveyID && reminders[i].suppress()){
            break;
        }
    }
};

/**
 * Deletes all reminders associated with the specified campaign.
 */
ReminderModel.deleteCampaignReminders = function(campaignURN){
    console.log("ReminderModel: Deleting all reminders associated with campaign [" + campaignURN + "].");
    var reminders = ReminderModel.getAllReminders(), i = 0;
    for(i; i < reminders.length; i++){
        if(reminders[i].getCampaignURN() === campaignURN){
            reminders[i].deleteReminder();
        }
    }
};

ReminderModel.getPendingSurveys = function(){
    var currentDate = new Date().getTime();
    var reminders = ReminderModel.getAllReminders();
    var campaign, surveys = [], i = 0;
    for(i; i < reminders.length; i++){
        if(reminders[i].getDate().getTime() < currentDate){
            campaign = new Campaign(reminders[i].getCampaignURN());
            surveys.push(campaign.getSurvey(reminders[i].getSurveyID()));
        }
    }
    return surveys;
};

/**
 * Returns all reminders that have at least single notification in the future.
 */
ReminderModel.getCurrentReminders = function() {
    var reminders = ReminderModel.getAllReminders();
    var currentReminders = [], i = 0;
    for(i; i < reminders.length; i++){
        if( !reminders[i].isExpired() ){
            currentReminders.push( reminders[i] );
        }
    }
    return currentReminders;
};var SurveyModel = function( surveyData, campaign ) {

    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods.
     */
    var that = {};

    /**
     * Returns the title of the current survey.
     * @return Current survey's title, or empty string if undefined.
     */
    that.getTitle = function() {
        return surveyData.title || "";
    };

    /**
     * Returns the description of the current survey.
     * @return Current survey's description, or emptry string if undefined.
     */
    that.getDescription = function() {
        return surveyData.description || "";
    };

    /**
     * Returns the ID of the current survey.
     * @return Current survey's ID.
     */
    that.getID = function() {
        return surveyData.id;
    };

    /**
     * Returns a reference to this survey's campaign.
     * @return Reference to this survey's campaign.
     */
    that.getCampaign = function() {
        return campaign;
    };

    /**
     * Returns an array of prompt objects associated with this survey.
     */
    that.getPrompts = function(){
        var promptList = surveyData.contentlist.prompt;
        var prompts = new Array();
        if(promptList.length){    
            for(var i = 0; i < promptList.length; i++){
                prompts[i] = new Prompt( promptList[i], that, campaign );
            }
        } else {
            prompts.push( new Prompt(promptList, that, campaign) );
        }
        return prompts;
    };

    /**
     * Returns a prompt, given a prompt ID.
     * @param id ID of the prompt to return.
     * @return Prompt object or null.
     */
    that.getPrompt = function( id ) {
        var prompts = that.getPrompts();
        for( var i = 0; i < prompts.length; i++ ) {
            if( prompts[ i ].getID() == id ) {
                return prompts[ i ];
            }
        }
        return null;
    };
    
    return that;
}
/**
 * The class represents the responses gathered from the user for a particular
 * survey.
 *
 * @author Zorayr Khalapyan
 * @param id
 * @param uuid The unique identifier for this survey response.
 * @param urn The URN of the campaign associated with this survey.
 */
var SurveyResponseModel = function (id, uuid, urn){

    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods.
     */
    var that = {};

    /**
     * Working data of the survey response. Saving and restoring surveys from
     * local storage will only save and restore this data object.
     */
    that.data = {};

    /**
     * An optional variable that associates this survey response with the
     * surveys' comapaign. This value should be used to create a Survey object
     * from a SurveyResponseModel object.
     */
    that.data.campaign_urn = urn;

    /**
     * Initially, location status is set to unavailable. This should change
     * after invoking setLocation(..), or manuallySetLocation(..).
     */
    that.data.location_status = SurveyResponseModel.LocationStatus.UNAVAILABLE;

    /**
     * A UUID unique to this survey response.
     */
    that.data.survey_key = uuid;

    /**
     * A string defining a survey in the campaign's associated configuration
     * file at the XPath /surveys/survey/id.
     */
    that.data.survey_id = id;

    /**
     * A string representing a standard time zone.
     */
    that.data.timezone = jstz.determine_timezone().name();

    /**
     * An int specifying the number of milliseconds since the epoch.
     * This value will be set on survey response submission.
     */
    that.data.time = null;

    /**
     * An array composed of prompt responses and/or repeatable sets. By default
     * user has no responses. This object is not to be confused with the
     * responses object that will be submited to the server.
     */
    that.data._responses = {};

    /**
     * An object with variable properties that describes the survey's launch
     * context. See the trigger framework page for a description of the object's
     * contents. The object must contain the property launch_time.
     */
    that.data.survey_launch_context = {
        launch_time     : new Date().getTime(),
        launch_timezone : jstz.determine_timezone().name(),
        active_triggers : []
    };

    /**
     * An object for housing location data.
     */
    that.data.location = null;

    /**
     * Returns true if the location has been set.
     *
     * @return true if the location for this survey response has been set.
     */
    that.isLocationAvailable = function () {
        return that.data.location != null;
    };

    that.manuallySetLocation = function (location) {
        that.data.location_status = SurveyResponseModel.LocationStatus.VALID;
        that.data.location = location;
    };

    /**
     * Invokes the geolocation API in order to get the current GPS location for
     * this survey response. Callback will be invoked on either error or success
     * with a single boolean parameter success/true, error/false.
     */
    that.setLocation = function (callback) {

        that.data.location_status = SurveyResponseModel.LocationStatus.UNAVAILABLE;
        that.data.location = null;

        mwf.touch.geolocation.getPosition(

            function (pos) {

                //Create a new location object to house
                //the location data.
                that.data.location = {};

                //Currently, there is no way of determining the geolocation
                //provider but it's almost always going to be from the GPS
                //device.
                that.data.location.provider = 'GPS';

                that.data.location.latitude  = pos.latitude;
                that.data.location.longitude = pos.longitude;
                that.data.location.accuracy  = pos.accuracy;

                //A string describing location status. Must be one of:
                //unavailable, valid, inaccurate, stale.
                that.data.location_status = SurveyResponseModel.LocationStatus.VALID;

                //A long value representing the milliseconds since the epoch at
                //hich time this location value was collected.
                that.data.location.time = new Date().getTime();

                //The timezone ID for the timezone of the device when this
                //location value was collected.
                that.data.location.timezone = jstz.determine_timezone().name();

                that.save();

                if(callback){
                    callback(true);
                }
            },

            //On error, delete the location object if any and also set an
            //appropriate location status.
            function(message) {

                that.data.location = null;
                that.data.location_status = SurveyResponseModel.LocationStatus.UNAVAILABLE;

                that.save();

                if (callback) {
                    callback(false);
                }

            }
        );
    };

    /**
     * Adds a response to the current response list.
     */
    that.respond = function (promptID, value, isImage) {
        that.data._responses[promptID] = {"value": value, "isImage": isImage};
        that.save();
    };

    /**
     * Marks the specified prompt as skipped.
     */
    that.promptSkipped = function (promptID) {
        that.respond(promptID, SurveyResponseModel.SKIPPED_PROMPT_VALUE, false);
    };

    /**
     * Marks the specified prompt as not displayed.
     */
    that.promptNotDisplayed = function (promptID) {
        that.respond(promptID, SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE, false);
    };

    that.submit = function (callback) {
        //Save the submit time.
        that.data.time = new Date().getTime();

        //Save the survey in the pool.
        that.save();

        if(typeof(callback) !== "undefined"){
            callback();
        }
    };

    /**
     * Returns UUIDs of all images associated with this response.
     * @return Array of UUIDs.
     */
    that.getImageIds = function () {
        var images = [];
        for (var promptID in that.data._responses) {
            var response = that.data._responses[promptID];
            if(response.isImage){
                images.push(response.value);
            }
        }
        return images;
    };

    /**
     * Returns data that can be uploaded to the surver as response data.
     */
    that.getUploadData = function () {

        //The idea here is that during response collection, responses is treated
        //as an object out of the idea that JavaScript does not support
        //associative arrays and in order to search through a list of objects,
        //it would have taken O(n) time. Instead, we use an object which has
        //key-value pair access time of O(1), but needs some extra conversion
        //before getting uploaded to the surver.
        var responses = [];

        var images = {};

        for (var promptID in that.data._responses) {
            var response = that.data._responses[promptID];
            responses.push({
                prompt_id: promptID,
                value: response.value
            });
            if(response.isImage){
                var base64Image = SurveyResponseModel.getImage(response.value);
                images[response.value] = base64Image.substring(base64Image.indexOf(',') + 1);
            }
        }

        var surveyResponse = {
            survey_key           : that.data.survey_key,
            time                 : that.data.time,
            timezone             : that.data.timezone,
            location_status      : that.data.location_status,
            survey_id            : that.data.survey_id,
            survey_launch_context: that.data.survey_launch_context,

            //UPDATE: Seems like they removed this from the Wiki docs.
            //Single Prompt Response is a JSON object and not an array. Not sure
            //why so, but its noted by the documentation.
            //responses: (responses.length == 1)? responses[0]:responses

            responses: responses
        }

        //Only set location, if available.
        if(that.data.location !== null){
            surveyResponse.location = that.data.location;
        }

        return {"responses" : surveyResponse, "images": images};
    };

    /**
     * Replaces the current working data. This is used for restoring a survey
     * response from an external storage.
     */
    that.setData = function (data) {
        that.data = data;
    };

    /**
     * Returns the currently gathered user responses in a map form
     * i.e. {prompt_id : prompt_value}. This method is used as the data source
     * for conditional prompt evaluation.
     */
    that.getResponses = function () {
        var data = {};
        for(var promptID in that.data._responses){
            data[promptID] = that.data._responses[promptID].value;
        }
        return data;
    };

    /**
     * Saves the current response in the response pool.
     */
    that.save = function () {
        SurveyResponseModel.saveSurveyResponse(that);
    };


    /**
     * Returns the recorded response value for the given prompt,
     * or null if not specified.
     */
    that.getResponse = function (promptID) {
        return (that.data._responses[promptID])? that.data._responses[promptID].value : null;
    };

    /**
     * Returns the current working data. The returned object contains all
     * response identifiying information including campaign URN, location,
     * location status, responses, survey_id, survey_key, survey launch context,
     * time, and timezone.
     */
    that.getData = function () {
        return that.data;
    };

    that.getLocationStatus = function () {
        return that.data.location_status;
    };

    that.getLocation = function () {
        return that.data.location;
    };

    that.getSurveyID = function () {
      return that.data.survey_id;
    };

    that.getSurveyKey = function () {
        return that.data.survey_key;
    };

    that.isSubmitted = function () {
        return (that.data.time === null)? false : true;
    };

    that.getSubmitDateString = function () {
        return that.getSubmitDate().toString().substr(0, 24);
    };

    that.getSubmitDate = function () {
        return new Date(that.data.time);
    };

    that.getCampaignURN = function () {
        return that.data.campaign_urn;
    };

    return that;
}


SurveyResponseModel.responses = new LocalMap("suvey-responses");

SurveyResponseModel.init = function(id, urn){
    return new SurveyResponseModel(id, UUIDGen.generate(), urn);
};

SurveyResponseModel.saveSurveyResponse = function(surveyResponseModel){
    SurveyResponseModel.responses.set(surveyResponseModel.getSurveyKey(), surveyResponseModel.getData());
};

/**
 * Enumaration object that describes location status.
 */
SurveyResponseModel.LocationStatus = {
    UNAVAILABLE : "unavailable",
    VALID       : "valid",
    INACCURATE  : 'inaccurate',
    STALE       : 'stale'
};

/**
 * The function restores a stored SurveyResponseModel object.
 */
SurveyResponseModel.restoreSurveyResponse = function (survey_key) {
    var data = SurveyResponseModel.responses.get(survey_key);
    if(data === null){
        return false;
    }
    var surveyResponseModel = new SurveyResponseModel(data.id, data.survey_key, data.campaign_urn);
    surveyResponseModel.setData(data);
    return surveyResponseModel;
};

/**
 * Deletes the survey response with it associated images if any.
 */
SurveyResponseModel.deleteSurveyResponse = function (surveyResponseModel) {

    //Delete response images.
    var images = surveyResponseModel.getImageIds();
    for(var i = 0; i < images.length; i++){
        SurveyResponseModel.deleteImage(images[i]);
    }

    //Delete the response from the local storage map.
    SurveyResponseModel.responses.release(surveyResponseModel.getSurveyKey());
};


/**
 * Saves the provided image URI and returns a UUID that mapps to that image's
 * URI.
 */
SurveyResponseModel.saveImage = function (imageURI) {
    var images = SurveyResponseModel.getImages();
    var uuid = UUIDGen.generate();

    images[uuid] = imageURI;

    SurveyResponseModel.setImages(images);

    return uuid;
};

SurveyResponseModel.getImage = function (uuid) {
    return SurveyResponseModel.getImages()[uuid];
};

SurveyResponseModel.deleteImage = function (uuid) {
    var images = SurveyResponseModel.getImages();
    if(images[uuid])
        delete images[uuid];
    SurveyResponseModel.setImages(images);
};

SurveyResponseModel.setImages = function (images) {
    localStorage.images = JSON.stringify(images);
};

SurveyResponseModel.getImages = function () {
    return (localStorage.images)? JSON.parse(localStorage.images) : {};
};

/**
 * Returns all pending survey responses.
 */
SurveyResponseModel.getPendingResponses = function () {
    var pendingResponses = {};
    for(var uuid in SurveyResponseModel.responses.getMap()){
        var response = SurveyResponseModel.restoreSurveyResponse(uuid);
        //Skip survey responses that were not completed.
        if(!response.isSubmitted()){
            continue;
        }
        var campaign = CampaignsModel.getCampaign(response.getCampaignURN());
        var survey = campaign.getSurvey(response.getSurveyID());
        pendingResponses[uuid] = {'survey': survey, 'response': response};
    }
    return pendingResponses;
}

/**
 * Returns the number of survey responses that have not been submitted.
 */
SurveyResponseModel.getUploadQueueSize = function () {
    var size = 0;
    for(var uuid in SurveyResponseModel.responses.getMap()){
        var response = SurveyResponseModel.restoreSurveyResponse(uuid);
        if(response.isSubmitted()){
            size++;
        }
    }
    return size;
};

/**
 * Value tag that indicates skipped prompt response value.
 */
SurveyResponseModel.SKIPPED_PROMPT_VALUE = "SKIPPED";

/**
* Value tag that indicates not displayed prompt response value.
*/
SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE = "NOT_DISPLAYED";
ConditionalParser = (function(){
  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */
  
  function quote(s) {
    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
     return '"' + s
      .replace(/\\/g, '\\\\')  // backslash
      .replace(/"/g, '\\"')    // closing quote character
      .replace(/\x08/g, '\\b') // backspace
      .replace(/\t/g, '\\t')   // horizontal tab
      .replace(/\n/g, '\\n')   // line feed
      .replace(/\f/g, '\\f')   // form feed
      .replace(/\r/g, '\\r')   // carriage return
      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
      + '"';
  }
  
  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function(input, data, startRule) {
      var parseFunctions = {
        "statement": parse_statement,
        "sentence": parse_sentence,
        "parenthetical": parse_parenthetical,
        "expression": parse_expression,
        "id": parse_id,
        "condition": parse_condition,
        "value": parse_value,
        "conjunction": parse_conjunction
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "statement";
      }
      
      var pos = 0;
      var reportFailures = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        var escapeChar;
        var length;
        
        if (charCode <= 0xFF) {
          escapeChar = 'x';
          length = 2;
        } else {
          escapeChar = 'u';
          length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }
        
        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }
        
        rightmostFailuresExpected.push(failure);
      }
      
      function parse_statement() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_sentence();
        if (result0 !== null) {
          result1 = parse_conjunction();
          if (result1 !== null) {
            result2 = parse_sentence();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, l, c, r) {return conj(l, c, r)})(pos0, result0[0], result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          result0 = parse_sentence();
        }
        return result0;
      }
      
      function parse_sentence() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_parenthetical();
        if (result0 !== null) {
          result1 = parse_conjunction();
          if (result1 !== null) {
            result2 = parse_parenthetical();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, l, c, r) {return conj(l, c, r);})(pos0, result0[0], result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_parenthetical();
          if (result0 !== null) {
            result1 = parse_conjunction();
            if (result1 !== null) {
              result2 = parse_expression();
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, l, c, r) {return conj(l, c, r);})(pos0, result0[0], result0[1], result0[2]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            result0 = parse_expression();
            if (result0 !== null) {
              result1 = parse_conjunction();
              if (result1 !== null) {
                result2 = parse_parenthetical();
                if (result2 !== null) {
                  result0 = [result0, result1, result2];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, l, c, r) {return conj(l, c, r); })(pos0, result0[0], result0[1], result0[2]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              result0 = parse_expression();
              if (result0 !== null) {
                result1 = parse_conjunction();
                if (result1 !== null) {
                  result2 = parse_expression();
                  if (result2 !== null) {
                    result0 = [result0, result1, result2];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset, l, c, r) {return conj(l, c, r);})(pos0, result0[0], result0[1], result0[2]);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                result0 = parse_parenthetical();
                if (result0 === null) {
                  result0 = parse_expression();
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_parenthetical() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 40) {
          result0 = "(";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"(\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_sentence();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 41) {
              result2 = ")";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\")\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, s) {return s})(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_expression() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_id();
        if (result0 !== null) {
          result1 = parse_condition();
          if (result1 !== null) {
            result2 = parse_value();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, id, c, value) {return cond(data[id], c, value)})(pos0, result0[0], result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_id() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        if (/^[a-zA-Z0-9_]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[a-zA-Z0-9_]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[a-zA-Z0-9_]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[a-zA-Z0-9_]");
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, id) {return concat(id);})(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_condition() {
        var result0;
        
        if (input.substr(pos, 4) === " == ") {
          result0 = " == ";
          pos += 4;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\" == \"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 4) === " != ") {
            result0 = " != ";
            pos += 4;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\" != \"");
            }
          }
          if (result0 === null) {
            if (input.substr(pos, 3) === " > ") {
              result0 = " > ";
              pos += 3;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\" > \"");
              }
            }
            if (result0 === null) {
              if (input.substr(pos, 3) === " < ") {
                result0 = " < ";
                pos += 3;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\" < \"");
                }
              }
              if (result0 === null) {
                if (input.substr(pos, 4) === " >= ") {
                  result0 = " >= ";
                  pos += 4;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\" >= \"");
                  }
                }
                if (result0 === null) {
                  if (input.substr(pos, 4) === " <= ") {
                    result0 = " <= ";
                    pos += 4;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\" <= \"");
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_value() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        if (/^[a-zA-Z0-9_]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[a-zA-Z0-9_]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[a-zA-Z0-9_]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[a-zA-Z0-9_]");
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, value) {return concat(value);})(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_conjunction() {
        var result0;
        
        if (input.substr(pos, 5) === " and ") {
          result0 = " and ";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\" and \"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 4) === " or ") {
            result0 = " or ";
            pos += 4;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\" or \"");
            }
          }
        }
        return result0;
      }
      
      
      function cleanupExpected(expected) {
        expected.sort();
        
        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }
      
      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return { line: line, column: column };
      }
      
          function concat(array){
              return array.join("");
          }
      
          function trim(string){
              return string.replace(/^\s*([\S\s]*?)\s*$/, '$1');
          }
      
          function cond(leftValue, condition, rightValue){
      
              switch(trim(condition)){
                  case '==':
                      return leftValue == rightValue;
                  case '!=':
                      return leftValue != rightValue;
                  case '>':
                      return leftValue > rightValue;
                  case '<':
                      return leftValue < rightValue;
                  case '>=':
                      return leftValue >= rightValue;
                  case '<=':
                      return leftValue <= rightValue;
                  default:
                      return false;
      
              }
      
          }
      
          function conj(leftValue, conjunction, rightValue){
              switch(trim(conjunction)){
                  case 'and':
                      return leftValue && rightValue;
                  case 'or':
                      return leftValue || rightValue;
      
              }
          }
      
      
      
      var result = parseFunctions[startRule]();
      
      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();
        
        throw new this.SyntaxError(
          cleanupExpected(rightmostFailuresExpected),
          found,
          offset,
          errorPosition.line,
          errorPosition.column
        );
      }
      
      return result;
    },
    
    /* Returns the parser source code. */
    toSource: function() { return this._source; }
  };
  
  /* Thrown when a parser encounters a syntax error. */
  
  result.SyntaxError = function(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;
      
      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }
      
      foundHumanized = found ? quote(found) : "end of input";
      
      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }
    
    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})();/*
 * PEG.js 0.7.0
 *
 * http://pegjs.majda.cz/
 *
 * Copyright (c) 2010-2012 David Majda
 * Licensend under the MIT license.
 */
var PEG = (function(undefined) {

var PEG = {
  /* PEG.js version (uses semantic versioning). */
  VERSION: "0.7.0",

  /*
   * Generates a parser from a specified grammar and returns it.
   *
   * The grammar must be a string in the format described by the metagramar in
   * the parser.pegjs file.
   *
   * Throws |PEG.parser.SyntaxError| if the grammar contains a syntax error or
   * |PEG.GrammarError| if it contains a semantic error. Note that not all
   * errors are detected during the generation and some may protrude to the
   * generated parser and cause its malfunction.
   */
  buildParser: function(grammar, options) {
    return PEG.compiler.compile(PEG.parser.parse(grammar), options);
  }
};

/* Thrown when the grammar contains an error. */

PEG.GrammarError = function(message) {
  this.name = "PEG.GrammarError";
  this.message = message;
};

PEG.GrammarError.prototype = Error.prototype;

/* Like Python's |range|, but without |step|. */
function range(start, stop) {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }

  var result = new Array(Math.max(0, stop - start));
  for (var i = 0, j = start; j < stop; i++, j++) {
    result[i] = j;
  }
  return result;
}

function find(array, callback) {
  var length = array.length;
  for (var i = 0; i < length; i++) {
    if (callback(array[i])) {
      return array[i];
    }
  }
}

function contains(array, value) {
  /*
   * Stupid IE does not have Array.prototype.indexOf, otherwise this function
   * would be a one-liner.
   */
  var length = array.length;
  for (var i = 0; i < length; i++) {
    if (array[i] === value) {
      return true;
    }
  }
  return false;
}

function each(array, callback) {
  var length = array.length;
  for (var i = 0; i < length; i++) {
    callback(array[i], i);
  }
}

function map(array, callback) {
  var result = [];
  var length = array.length;
  for (var i = 0; i < length; i++) {
    result[i] = callback(array[i], i);
  }
  return result;
}

function pluck(array, key) {
  return map(array, function (e) { return e[key]; });
}

function keys(object) {
  var result = [];
  for (var key in object) {
    result.push(key);
  }
  return result;
}

function values(object) {
  var result = [];
  for (var key in object) {
    result.push(object[key]);
  }
  return result;
}

/*
 * Returns a string padded on the left to a desired length with a character.
 *
 * The code needs to be in sync with the code template in the compilation
 * function for "action" nodes.
 */
function padLeft(input, padding, length) {
  var result = input;

  var padLength = length - input.length;
  for (var i = 0; i < padLength; i++) {
    result = padding + result;
  }

  return result;
}

/*
 * Returns an escape sequence for given character. Uses \x for characters <=
 * 0xFF to save space, \u for the rest.
 *
 * The code needs to be in sync with the code template in the compilation
 * function for "action" nodes.
 */
function escape(ch) {
  var charCode = ch.charCodeAt(0);
  var escapeChar;
  var length;

  if (charCode <= 0xFF) {
    escapeChar = 'x';
    length = 2;
  } else {
    escapeChar = 'u';
    length = 4;
  }

  return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
}

/*
 * Surrounds the string with quotes and escapes characters inside so that the
 * result is a valid JavaScript string.
 *
 * The code needs to be in sync with the code template in the compilation
 * function for "action" nodes.
 */
function quote(s) {
  /*
   * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a string
   * literal except for the closing quote character, backslash, carriage return,
   * line separator, paragraph separator, and line feed. Any character may
   * appear in the form of an escape sequence.
   *
   * For portability, we also escape escape all control and non-ASCII
   * characters. Note that "\0" and "\v" escape sequences are not used because
   * JSHint does not like the first and IE the second.
   */
  return '"' + s
    .replace(/\\/g, '\\\\')  // backslash
    .replace(/"/g, '\\"')    // closing quote character
    .replace(/\x08/g, '\\b') // backspace
    .replace(/\t/g, '\\t')   // horizontal tab
    .replace(/\n/g, '\\n')   // line feed
    .replace(/\f/g, '\\f')   // form feed
    .replace(/\r/g, '\\r')   // carriage return
    .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
    + '"';
}

/*
 * Escapes characters inside the string so that it can be used as a list of
 * characters in a character class of a regular expression.
 */
function quoteForRegexpClass(s) {
  /*
   * Based on ECMA-262, 5th ed., 7.8.5 & 15.10.1.
   *
   * For portability, we also escape escape all control and non-ASCII
   * characters.
   */
  return s
    .replace(/\\/g, '\\\\')  // backslash
    .replace(/\//g, '\\/')   // closing slash
    .replace(/\]/g, '\\]')   // closing bracket
    .replace(/-/g, '\\-')    // dash
    .replace(/\0/g, '\\0')   // null
    .replace(/\t/g, '\\t')   // horizontal tab
    .replace(/\n/g, '\\n')   // line feed
    .replace(/\v/g, '\\x0B') // vertical tab
    .replace(/\f/g, '\\f')   // form feed
    .replace(/\r/g, '\\r')   // carriage return
    .replace(/[\x01-\x08\x0E-\x1F\x80-\uFFFF]/g, escape);
}

/*
 * Builds a node visitor -- a function which takes a node and any number of
 * other parameters, calls an appropriate function according to the node type,
 * passes it all its parameters and returns its value. The functions for various
 * node types are passed in a parameter to |buildNodeVisitor| as a hash.
 */
function buildNodeVisitor(functions) {
  return function(node) {
    return functions[node.type].apply(null, arguments);
  };
}

function findRuleByName(ast, name) {
  return find(ast.rules, function(r) { return r.name === name; });
}
PEG.parser = (function(){
  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */
  
  function quote(s) {
    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
     return '"' + s
      .replace(/\\/g, '\\\\')  // backslash
      .replace(/"/g, '\\"')    // closing quote character
      .replace(/\x08/g, '\\b') // backspace
      .replace(/\t/g, '\\t')   // horizontal tab
      .replace(/\n/g, '\\n')   // line feed
      .replace(/\f/g, '\\f')   // form feed
      .replace(/\r/g, '\\r')   // carriage return
      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
      + '"';
  }
  
  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function(input, startRule) {
      var parseFunctions = {
        "grammar": parse_grammar,
        "initializer": parse_initializer,
        "rule": parse_rule,
        "choice": parse_choice,
        "sequence": parse_sequence,
        "labeled": parse_labeled,
        "prefixed": parse_prefixed,
        "suffixed": parse_suffixed,
        "primary": parse_primary,
        "action": parse_action,
        "braced": parse_braced,
        "nonBraceCharacters": parse_nonBraceCharacters,
        "nonBraceCharacter": parse_nonBraceCharacter,
        "equals": parse_equals,
        "colon": parse_colon,
        "semicolon": parse_semicolon,
        "slash": parse_slash,
        "and": parse_and,
        "not": parse_not,
        "question": parse_question,
        "star": parse_star,
        "plus": parse_plus,
        "lparen": parse_lparen,
        "rparen": parse_rparen,
        "dot": parse_dot,
        "identifier": parse_identifier,
        "literal": parse_literal,
        "string": parse_string,
        "doubleQuotedString": parse_doubleQuotedString,
        "doubleQuotedCharacter": parse_doubleQuotedCharacter,
        "simpleDoubleQuotedCharacter": parse_simpleDoubleQuotedCharacter,
        "singleQuotedString": parse_singleQuotedString,
        "singleQuotedCharacter": parse_singleQuotedCharacter,
        "simpleSingleQuotedCharacter": parse_simpleSingleQuotedCharacter,
        "class": parse_class,
        "classCharacterRange": parse_classCharacterRange,
        "classCharacter": parse_classCharacter,
        "bracketDelimitedCharacter": parse_bracketDelimitedCharacter,
        "simpleBracketDelimitedCharacter": parse_simpleBracketDelimitedCharacter,
        "simpleEscapeSequence": parse_simpleEscapeSequence,
        "zeroEscapeSequence": parse_zeroEscapeSequence,
        "hexEscapeSequence": parse_hexEscapeSequence,
        "unicodeEscapeSequence": parse_unicodeEscapeSequence,
        "eolEscapeSequence": parse_eolEscapeSequence,
        "digit": parse_digit,
        "hexDigit": parse_hexDigit,
        "letter": parse_letter,
        "lowerCaseLetter": parse_lowerCaseLetter,
        "upperCaseLetter": parse_upperCaseLetter,
        "__": parse___,
        "comment": parse_comment,
        "singleLineComment": parse_singleLineComment,
        "multiLineComment": parse_multiLineComment,
        "eol": parse_eol,
        "eolChar": parse_eolChar,
        "whitespace": parse_whitespace
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "grammar";
      }
      
      var pos = 0;
      var reportFailures = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        var escapeChar;
        var length;
        
        if (charCode <= 0xFF) {
          escapeChar = 'x';
          length = 2;
        } else {
          escapeChar = 'u';
          length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }
        
        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }
        
        rightmostFailuresExpected.push(failure);
      }
      
      function parse_grammar() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse___();
        if (result0 !== null) {
          result1 = parse_initializer();
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result3 = parse_rule();
            if (result3 !== null) {
              result2 = [];
              while (result3 !== null) {
                result2.push(result3);
                result3 = parse_rule();
              }
            } else {
              result2 = null;
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, initializer, rules) {
              return {
                type:        "grammar",
                initializer: initializer !== "" ? initializer : null,
                rules:       rules,
                startRule:   rules[0].name
              };
            })(pos0, result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_initializer() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_action();
        if (result0 !== null) {
          result1 = parse_semicolon();
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, code) {
              return {
                type: "initializer",
                code: code
              };
            })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_rule() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_identifier();
        if (result0 !== null) {
          result1 = parse_string();
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result2 = parse_equals();
            if (result2 !== null) {
              result3 = parse_choice();
              if (result3 !== null) {
                result4 = parse_semicolon();
                result4 = result4 !== null ? result4 : "";
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, name, displayName, expression) {
              return {
                type:        "rule",
                name:        name,
                displayName: displayName !== "" ? displayName : null,
                expression:  expression
              };
            })(pos0, result0[0], result0[1], result0[3]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_choice() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_sequence();
        if (result0 !== null) {
          result1 = [];
          pos2 = pos;
          result2 = parse_slash();
          if (result2 !== null) {
            result3 = parse_sequence();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos2;
            }
          } else {
            result2 = null;
            pos = pos2;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos2 = pos;
            result2 = parse_slash();
            if (result2 !== null) {
              result3 = parse_sequence();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, tail) {
              if (tail.length > 0) {
                var alternatives = [head].concat(map(
                    tail,
                    function(element) { return element[1]; }
                ));
                return {
                  type:         "choice",
                  alternatives: alternatives
                };
              } else {
                return head;
              }
            })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_sequence() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = [];
        result1 = parse_labeled();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_labeled();
        }
        if (result0 !== null) {
          result1 = parse_action();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, elements, code) {
              var expression = elements.length !== 1
                ? {
                    type:     "sequence",
                    elements: elements
                  }
                : elements[0];
              return {
                type:       "action",
                expression: expression,
                code:       code
              };
            })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          result0 = [];
          result1 = parse_labeled();
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_labeled();
          }
          if (result0 !== null) {
            result0 = (function(offset, elements) {
                return elements.length !== 1
                  ? {
                      type:     "sequence",
                      elements: elements
                    }
                  : elements[0];
              })(pos0, result0);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_labeled() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_identifier();
        if (result0 !== null) {
          result1 = parse_colon();
          if (result1 !== null) {
            result2 = parse_prefixed();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, label, expression) {
              return {
                type:       "labeled",
                label:      label,
                expression: expression
              };
            })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          result0 = parse_prefixed();
        }
        return result0;
      }
      
      function parse_prefixed() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_and();
        if (result0 !== null) {
          result1 = parse_action();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, code) {
              return {
                type: "semantic_and",
                code: code
              };
            })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_and();
          if (result0 !== null) {
            result1 = parse_suffixed();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, expression) {
                return {
                  type:       "simple_and",
                  expression: expression
                };
              })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            result0 = parse_not();
            if (result0 !== null) {
              result1 = parse_action();
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, code) {
                  return {
                    type: "semantic_not",
                    code: code
                  };
                })(pos0, result0[1]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              result0 = parse_not();
              if (result0 !== null) {
                result1 = parse_suffixed();
                if (result1 !== null) {
                  result0 = [result0, result1];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset, expression) {
                    return {
                      type:       "simple_not",
                      expression: expression
                    };
                  })(pos0, result0[1]);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                result0 = parse_suffixed();
              }
            }
          }
        }
        return result0;
      }
      
      function parse_suffixed() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_primary();
        if (result0 !== null) {
          result1 = parse_question();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, expression) {
              return {
                type:       "optional",
                expression: expression
              };
            })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_primary();
          if (result0 !== null) {
            result1 = parse_star();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, expression) {
                return {
                  type:       "zero_or_more",
                  expression: expression
                };
              })(pos0, result0[0]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            result0 = parse_primary();
            if (result0 !== null) {
              result1 = parse_plus();
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, expression) {
                  return {
                    type:       "one_or_more",
                    expression: expression
                  };
                })(pos0, result0[0]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              result0 = parse_primary();
            }
          }
        }
        return result0;
      }
      
      function parse_primary() {
        var result0, result1, result2;
        var pos0, pos1, pos2, pos3;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_identifier();
        if (result0 !== null) {
          pos2 = pos;
          reportFailures++;
          pos3 = pos;
          result1 = parse_string();
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result2 = parse_equals();
            if (result2 !== null) {
              result1 = [result1, result2];
            } else {
              result1 = null;
              pos = pos3;
            }
          } else {
            result1 = null;
            pos = pos3;
          }
          reportFailures--;
          if (result1 === null) {
            result1 = "";
          } else {
            result1 = null;
            pos = pos2;
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, name) {
              return {
                type: "rule_ref",
                name: name
              };
            })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          result0 = parse_literal();
          if (result0 === null) {
            pos0 = pos;
            result0 = parse_dot();
            if (result0 !== null) {
              result0 = (function(offset) { return { type: "any" }; })(pos0);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              result0 = parse_class();
              if (result0 === null) {
                pos0 = pos;
                pos1 = pos;
                result0 = parse_lparen();
                if (result0 !== null) {
                  result1 = parse_choice();
                  if (result1 !== null) {
                    result2 = parse_rparen();
                    if (result2 !== null) {
                      result0 = [result0, result1, result2];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
                if (result0 !== null) {
                  result0 = (function(offset, expression) { return expression; })(pos0, result0[1]);
                }
                if (result0 === null) {
                  pos = pos0;
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_action() {
        var result0, result1;
        var pos0, pos1;
        
        reportFailures++;
        pos0 = pos;
        pos1 = pos;
        result0 = parse_braced();
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, braced) { return braced.substr(1, braced.length - 2); })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("action");
        }
        return result0;
      }
      
      function parse_braced() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 123) {
          result0 = "{";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"{\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          result2 = parse_braced();
          if (result2 === null) {
            result2 = parse_nonBraceCharacter();
          }
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_braced();
            if (result2 === null) {
              result2 = parse_nonBraceCharacter();
            }
          }
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 125) {
              result2 = "}";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"}\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, parts) {
              return "{" + parts.join("") + "}";
            })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_nonBraceCharacters() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_nonBraceCharacter();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_nonBraceCharacter();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return chars.join(""); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_nonBraceCharacter() {
        var result0;
        
        if (/^[^{}]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[^{}]");
          }
        }
        return result0;
      }
      
      function parse_equals() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 61) {
          result0 = "=";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"=\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "="; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_colon() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 58) {
          result0 = ":";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\":\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return ":"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_semicolon() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 59) {
          result0 = ";";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\";\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return ";"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_slash() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 47) {
          result0 = "/";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"/\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "/"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_and() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 38) {
          result0 = "&";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"&\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "&"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_not() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 33) {
          result0 = "!";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"!\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "!"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_question() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 63) {
          result0 = "?";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"?\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "?"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_star() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 42) {
          result0 = "*";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"*\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "*"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_plus() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 43) {
          result0 = "+";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"+\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "+"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_lparen() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 40) {
          result0 = "(";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"(\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "("; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_rparen() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 41) {
          result0 = ")";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\")\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return ")"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_dot() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 46) {
          result0 = ".";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\".\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "."; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_identifier() {
        var result0, result1, result2;
        var pos0, pos1;
        
        reportFailures++;
        pos0 = pos;
        pos1 = pos;
        result0 = parse_letter();
        if (result0 === null) {
          if (input.charCodeAt(pos) === 95) {
            result0 = "_";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"_\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 36) {
              result0 = "$";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"$\"");
              }
            }
          }
        }
        if (result0 !== null) {
          result1 = [];
          result2 = parse_letter();
          if (result2 === null) {
            result2 = parse_digit();
            if (result2 === null) {
              if (input.charCodeAt(pos) === 95) {
                result2 = "_";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\"_\"");
                }
              }
              if (result2 === null) {
                if (input.charCodeAt(pos) === 36) {
                  result2 = "$";
                  pos++;
                } else {
                  result2 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"$\"");
                  }
                }
              }
            }
          }
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_letter();
            if (result2 === null) {
              result2 = parse_digit();
              if (result2 === null) {
                if (input.charCodeAt(pos) === 95) {
                  result2 = "_";
                  pos++;
                } else {
                  result2 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"_\"");
                  }
                }
                if (result2 === null) {
                  if (input.charCodeAt(pos) === 36) {
                    result2 = "$";
                    pos++;
                  } else {
                    result2 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"$\"");
                    }
                  }
                }
              }
            }
          }
          if (result1 !== null) {
            result2 = parse___();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, tail) {
              return head + tail.join("");
            })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("identifier");
        }
        return result0;
      }
      
      function parse_literal() {
        var result0, result1, result2;
        var pos0, pos1;
        
        reportFailures++;
        pos0 = pos;
        pos1 = pos;
        result0 = parse_doubleQuotedString();
        if (result0 === null) {
          result0 = parse_singleQuotedString();
        }
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 105) {
            result1 = "i";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"i\"");
            }
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result2 = parse___();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, value, flags) {
              return {
                type:       "literal",
                value:      value,
                ignoreCase: flags === "i"
              };
            })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("literal");
        }
        return result0;
      }
      
      function parse_string() {
        var result0, result1;
        var pos0, pos1;
        
        reportFailures++;
        pos0 = pos;
        pos1 = pos;
        result0 = parse_doubleQuotedString();
        if (result0 === null) {
          result0 = parse_singleQuotedString();
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, string) { return string; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("string");
        }
        return result0;
      }
      
      function parse_doubleQuotedString() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 34) {
          result0 = "\"";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\\"\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          result2 = parse_doubleQuotedCharacter();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_doubleQuotedCharacter();
          }
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 34) {
              result2 = "\"";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"\\\"\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return chars.join(""); })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_doubleQuotedCharacter() {
        var result0;
        
        result0 = parse_simpleDoubleQuotedCharacter();
        if (result0 === null) {
          result0 = parse_simpleEscapeSequence();
          if (result0 === null) {
            result0 = parse_zeroEscapeSequence();
            if (result0 === null) {
              result0 = parse_hexEscapeSequence();
              if (result0 === null) {
                result0 = parse_unicodeEscapeSequence();
                if (result0 === null) {
                  result0 = parse_eolEscapeSequence();
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_simpleDoubleQuotedCharacter() {
        var result0, result1;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        pos2 = pos;
        reportFailures++;
        if (input.charCodeAt(pos) === 34) {
          result0 = "\"";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\\"\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 92) {
            result0 = "\\";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\\\\"");
            }
          }
          if (result0 === null) {
            result0 = parse_eolChar();
          }
        }
        reportFailures--;
        if (result0 === null) {
          result0 = "";
        } else {
          result0 = null;
          pos = pos2;
        }
        if (result0 !== null) {
          if (input.length > pos) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("any character");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, char_) { return char_; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_singleQuotedString() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 39) {
          result0 = "'";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"'\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          result2 = parse_singleQuotedCharacter();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_singleQuotedCharacter();
          }
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 39) {
              result2 = "'";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"'\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return chars.join(""); })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_singleQuotedCharacter() {
        var result0;
        
        result0 = parse_simpleSingleQuotedCharacter();
        if (result0 === null) {
          result0 = parse_simpleEscapeSequence();
          if (result0 === null) {
            result0 = parse_zeroEscapeSequence();
            if (result0 === null) {
              result0 = parse_hexEscapeSequence();
              if (result0 === null) {
                result0 = parse_unicodeEscapeSequence();
                if (result0 === null) {
                  result0 = parse_eolEscapeSequence();
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_simpleSingleQuotedCharacter() {
        var result0, result1;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        pos2 = pos;
        reportFailures++;
        if (input.charCodeAt(pos) === 39) {
          result0 = "'";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"'\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 92) {
            result0 = "\\";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\\\\"");
            }
          }
          if (result0 === null) {
            result0 = parse_eolChar();
          }
        }
        reportFailures--;
        if (result0 === null) {
          result0 = "";
        } else {
          result0 = null;
          pos = pos2;
        }
        if (result0 !== null) {
          if (input.length > pos) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("any character");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, char_) { return char_; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_class() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        reportFailures++;
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 91) {
          result0 = "[";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"[\"");
          }
        }
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 94) {
            result1 = "^";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"^\"");
            }
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result2 = [];
            result3 = parse_classCharacterRange();
            if (result3 === null) {
              result3 = parse_classCharacter();
            }
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_classCharacterRange();
              if (result3 === null) {
                result3 = parse_classCharacter();
              }
            }
            if (result2 !== null) {
              if (input.charCodeAt(pos) === 93) {
                result3 = "]";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\"]\"");
                }
              }
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 105) {
                  result4 = "i";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"i\"");
                  }
                }
                result4 = result4 !== null ? result4 : "";
                if (result4 !== null) {
                  result5 = parse___();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, inverted, parts, flags) {
              var partsConverted = map(parts, function(part) { return part.data; });
              var rawText = "["
                + inverted
                + map(parts, function(part) { return part.rawText; }).join("")
                + "]"
                + flags;
        
              return {
                type:       "class",
                inverted:   inverted === "^",
                ignoreCase: flags === "i",
                parts:      partsConverted,
                // FIXME: Get the raw text from the input directly.
                rawText:    rawText
              };
            })(pos0, result0[1], result0[2], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("character class");
        }
        return result0;
      }
      
      function parse_classCharacterRange() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_classCharacter();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 45) {
            result1 = "-";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"-\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_classCharacter();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, begin, end) {
              if (begin.data.charCodeAt(0) > end.data.charCodeAt(0)) {
                throw new this.SyntaxError(
                  "Invalid character range: " + begin.rawText + "-" + end.rawText + "."
                );
              }
        
              return {
                data:    [begin.data, end.data],
                // FIXME: Get the raw text from the input directly.
                rawText: begin.rawText + "-" + end.rawText
              };
            })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_classCharacter() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_bracketDelimitedCharacter();
        if (result0 !== null) {
          result0 = (function(offset, char_) {
              return {
                data:    char_,
                // FIXME: Get the raw text from the input directly.
                rawText: quoteForRegexpClass(char_)
              };
            })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_bracketDelimitedCharacter() {
        var result0;
        
        result0 = parse_simpleBracketDelimitedCharacter();
        if (result0 === null) {
          result0 = parse_simpleEscapeSequence();
          if (result0 === null) {
            result0 = parse_zeroEscapeSequence();
            if (result0 === null) {
              result0 = parse_hexEscapeSequence();
              if (result0 === null) {
                result0 = parse_unicodeEscapeSequence();
                if (result0 === null) {
                  result0 = parse_eolEscapeSequence();
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_simpleBracketDelimitedCharacter() {
        var result0, result1;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        pos2 = pos;
        reportFailures++;
        if (input.charCodeAt(pos) === 93) {
          result0 = "]";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"]\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 92) {
            result0 = "\\";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\\\\"");
            }
          }
          if (result0 === null) {
            result0 = parse_eolChar();
          }
        }
        reportFailures--;
        if (result0 === null) {
          result0 = "";
        } else {
          result0 = null;
          pos = pos2;
        }
        if (result0 !== null) {
          if (input.length > pos) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("any character");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, char_) { return char_; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_simpleEscapeSequence() {
        var result0, result1, result2;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 92) {
          result0 = "\\";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\\\\"");
          }
        }
        if (result0 !== null) {
          pos2 = pos;
          reportFailures++;
          result1 = parse_digit();
          if (result1 === null) {
            if (input.charCodeAt(pos) === 120) {
              result1 = "x";
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\"x\"");
              }
            }
            if (result1 === null) {
              if (input.charCodeAt(pos) === 117) {
                result1 = "u";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\"u\"");
                }
              }
              if (result1 === null) {
                result1 = parse_eolChar();
              }
            }
          }
          reportFailures--;
          if (result1 === null) {
            result1 = "";
          } else {
            result1 = null;
            pos = pos2;
          }
          if (result1 !== null) {
            if (input.length > pos) {
              result2 = input.charAt(pos);
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("any character");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, char_) {
              return char_
                .replace("b", "\b")
                .replace("f", "\f")
                .replace("n", "\n")
                .replace("r", "\r")
                .replace("t", "\t")
                .replace("v", "\x0B"); // IE does not recognize "\v".
            })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_zeroEscapeSequence() {
        var result0, result1;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 2) === "\\0") {
          result0 = "\\0";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\\\0\"");
          }
        }
        if (result0 !== null) {
          pos2 = pos;
          reportFailures++;
          result1 = parse_digit();
          reportFailures--;
          if (result1 === null) {
            result1 = "";
          } else {
            result1 = null;
            pos = pos2;
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "\x00"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_hexEscapeSequence() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 2) === "\\x") {
          result0 = "\\x";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\\\x\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_hexDigit();
          if (result1 !== null) {
            result2 = parse_hexDigit();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, h1, h2) {
              return String.fromCharCode(parseInt(h1 + h2, 16));
            })(pos0, result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_unicodeEscapeSequence() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 2) === "\\u") {
          result0 = "\\u";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\\\u\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_hexDigit();
          if (result1 !== null) {
            result2 = parse_hexDigit();
            if (result2 !== null) {
              result3 = parse_hexDigit();
              if (result3 !== null) {
                result4 = parse_hexDigit();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, h1, h2, h3, h4) {
              return String.fromCharCode(parseInt(h1 + h2 + h3 + h4, 16));
            })(pos0, result0[1], result0[2], result0[3], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_eolEscapeSequence() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 92) {
          result0 = "\\";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\\\\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_eol();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, eol) { return eol; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_digit() {
        var result0;
        
        if (/^[0-9]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[0-9]");
          }
        }
        return result0;
      }
      
      function parse_hexDigit() {
        var result0;
        
        if (/^[0-9a-fA-F]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[0-9a-fA-F]");
          }
        }
        return result0;
      }
      
      function parse_letter() {
        var result0;
        
        result0 = parse_lowerCaseLetter();
        if (result0 === null) {
          result0 = parse_upperCaseLetter();
        }
        return result0;
      }
      
      function parse_lowerCaseLetter() {
        var result0;
        
        if (/^[a-z]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[a-z]");
          }
        }
        return result0;
      }
      
      function parse_upperCaseLetter() {
        var result0;
        
        if (/^[A-Z]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[A-Z]");
          }
        }
        return result0;
      }
      
      function parse___() {
        var result0, result1;
        
        result0 = [];
        result1 = parse_whitespace();
        if (result1 === null) {
          result1 = parse_eol();
          if (result1 === null) {
            result1 = parse_comment();
          }
        }
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_whitespace();
          if (result1 === null) {
            result1 = parse_eol();
            if (result1 === null) {
              result1 = parse_comment();
            }
          }
        }
        return result0;
      }
      
      function parse_comment() {
        var result0;
        
        reportFailures++;
        result0 = parse_singleLineComment();
        if (result0 === null) {
          result0 = parse_multiLineComment();
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("comment");
        }
        return result0;
      }
      
      function parse_singleLineComment() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        if (input.substr(pos, 2) === "//") {
          result0 = "//";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"//\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          pos2 = pos;
          reportFailures++;
          result2 = parse_eolChar();
          reportFailures--;
          if (result2 === null) {
            result2 = "";
          } else {
            result2 = null;
            pos = pos2;
          }
          if (result2 !== null) {
            if (input.length > pos) {
              result3 = input.charAt(pos);
              pos++;
            } else {
              result3 = null;
              if (reportFailures === 0) {
                matchFailed("any character");
              }
            }
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            pos2 = pos;
            reportFailures++;
            result2 = parse_eolChar();
            reportFailures--;
            if (result2 === null) {
              result2 = "";
            } else {
              result2 = null;
              pos = pos2;
            }
            if (result2 !== null) {
              if (input.length > pos) {
                result3 = input.charAt(pos);
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("any character");
                }
              }
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_multiLineComment() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        if (input.substr(pos, 2) === "/*") {
          result0 = "/*";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"/*\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          pos2 = pos;
          reportFailures++;
          if (input.substr(pos, 2) === "*/") {
            result2 = "*/";
            pos += 2;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\"*/\"");
            }
          }
          reportFailures--;
          if (result2 === null) {
            result2 = "";
          } else {
            result2 = null;
            pos = pos2;
          }
          if (result2 !== null) {
            if (input.length > pos) {
              result3 = input.charAt(pos);
              pos++;
            } else {
              result3 = null;
              if (reportFailures === 0) {
                matchFailed("any character");
              }
            }
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            pos2 = pos;
            reportFailures++;
            if (input.substr(pos, 2) === "*/") {
              result2 = "*/";
              pos += 2;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"*/\"");
              }
            }
            reportFailures--;
            if (result2 === null) {
              result2 = "";
            } else {
              result2 = null;
              pos = pos2;
            }
            if (result2 !== null) {
              if (input.length > pos) {
                result3 = input.charAt(pos);
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("any character");
                }
              }
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            if (input.substr(pos, 2) === "*/") {
              result2 = "*/";
              pos += 2;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"*/\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_eol() {
        var result0;
        
        reportFailures++;
        if (input.charCodeAt(pos) === 10) {
          result0 = "\n";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\n\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 2) === "\r\n") {
            result0 = "\r\n";
            pos += 2;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\r\\n\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 13) {
              result0 = "\r";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"\\r\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 8232) {
                result0 = "\u2028";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"\\u2028\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 8233) {
                  result0 = "\u2029";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"\\u2029\"");
                  }
                }
              }
            }
          }
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("end of line");
        }
        return result0;
      }
      
      function parse_eolChar() {
        var result0;
        
        if (/^[\n\r\u2028\u2029]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[\\n\\r\\u2028\\u2029]");
          }
        }
        return result0;
      }
      
      function parse_whitespace() {
        var result0;
        
        reportFailures++;
        if (/^[ \t\x0B\f\xA0\uFEFF\u1680\u180E\u2000-\u200A\u202F\u205F\u3000]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[ \\t\\x0B\\f\\xA0\\uFEFF\\u1680\\u180E\\u2000-\\u200A\\u202F\\u205F\\u3000]");
          }
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("whitespace");
        }
        return result0;
      }
      
      
      function cleanupExpected(expected) {
        expected.sort();
        
        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }
      
      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return { line: line, column: column };
      }
      
      
      var result = parseFunctions[startRule]();
      
      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();
        
        throw new this.SyntaxError(
          cleanupExpected(rightmostFailuresExpected),
          found,
          offset,
          errorPosition.line,
          errorPosition.column
        );
      }
      
      return result;
    },
    
    /* Returns the parser source code. */
    toSource: function() { return this._source; }
  };
  
  /* Thrown when a parser encounters a syntax error. */
  
  result.SyntaxError = function(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;
      
      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }
      
      foundHumanized = found ? quote(found) : "end of input";
      
      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }
    
    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})();
PEG.compiler = {
  /*
   * Names of passes that will get run during the compilation (in the specified
   * order).
   */
  appliedPassNames: [
    "reportMissingRules",
    "reportLeftRecursion",
    "removeProxyRules",
    "computeVarNames",
    "computeParams"
  ],

  /*
   * Generates a parser from a specified grammar AST. Throws |PEG.GrammarError|
   * if the AST contains a semantic error. Note that not all errors are detected
   * during the generation and some may protrude to the generated parser and
   * cause its malfunction.
   */
  compile: function(ast, options) {
    var that = this;

    each(this.appliedPassNames, function(passName) {
      that.passes[passName](ast);
    });

    var source = this.emitter(ast, options);
    var result = eval(source);
    result._source = source;

    return result;
  }
};

/*
 * Compiler passes.
 *
 * Each pass is a function that is passed the AST. It can perform checks on it
 * or modify it as needed. If the pass encounters a semantic error, it throws
 * |PEG.GrammarError|.
 */
PEG.compiler.passes = {
  /* Checks that all referenced rules exist. */
  reportMissingRules: function(ast) {
    function nop() {}

    function checkExpression(node) { check(node.expression); }

    function checkSubnodes(propertyName) {
      return function(node) { each(node[propertyName], check); };
    }

    var check = buildNodeVisitor({
      grammar:      checkSubnodes("rules"),
      rule:         checkExpression,
      choice:       checkSubnodes("alternatives"),
      sequence:     checkSubnodes("elements"),
      labeled:      checkExpression,
      simple_and:   checkExpression,
      simple_not:   checkExpression,
      semantic_and: nop,
      semantic_not: nop,
      optional:     checkExpression,
      zero_or_more: checkExpression,
      one_or_more:  checkExpression,
      action:       checkExpression,

      rule_ref:
        function(node) {
          if (!findRuleByName(ast, node.name)) {
            throw new PEG.GrammarError(
              "Referenced rule \"" + node.name + "\" does not exist."
            );
          }
        },

      literal:      nop,
      any:          nop,
      "class":      nop
    });

    check(ast);
  },

  /* Checks that no left recursion is present. */
  reportLeftRecursion: function(ast) {
    function nop() {}

    function checkExpression(node, appliedRules) {
      check(node.expression, appliedRules);
    }

    function checkSubnodes(propertyName) {
      return function(node, appliedRules) {
        each(node[propertyName], function(subnode) {
          check(subnode, appliedRules);
        });
      };
    }

    var check = buildNodeVisitor({
      grammar:     checkSubnodes("rules"),

      rule:
        function(node, appliedRules) {
          check(node.expression, appliedRules.concat(node.name));
        },

      choice:      checkSubnodes("alternatives"),

      sequence:
        function(node, appliedRules) {
          if (node.elements.length > 0) {
            check(node.elements[0], appliedRules);
          }
        },

      labeled:      checkExpression,
      simple_and:   checkExpression,
      simple_not:   checkExpression,
      semantic_and: nop,
      semantic_not: nop,
      optional:     checkExpression,
      zero_or_more: checkExpression,
      one_or_more:  checkExpression,
      action:       checkExpression,

      rule_ref:
        function(node, appliedRules) {
          if (contains(appliedRules, node.name)) {
            throw new PEG.GrammarError(
              "Left recursion detected for rule \"" + node.name + "\"."
            );
          }
          check(findRuleByName(ast, node.name), appliedRules);
        },

      literal:      nop,
      any:          nop,
      "class":      nop
    });

    check(ast, []);
  },

  /*
   * Removes proxy rules -- that is, rules that only delegate to other rule.
   */
  removeProxyRules: function(ast) {
    function isProxyRule(node) {
      return node.type === "rule" && node.expression.type === "rule_ref";
    }

    function replaceRuleRefs(ast, from, to) {
      function nop() {}

      function replaceInExpression(node, from, to) {
        replace(node.expression, from, to);
      }

      function replaceInSubnodes(propertyName) {
        return function(node, from, to) {
          each(node[propertyName], function(subnode) {
            replace(subnode, from, to);
          });
        };
      }

      var replace = buildNodeVisitor({
        grammar:      replaceInSubnodes("rules"),
        rule:         replaceInExpression,
        choice:       replaceInSubnodes("alternatives"),
        sequence:     replaceInSubnodes("elements"),
        labeled:      replaceInExpression,
        simple_and:   replaceInExpression,
        simple_not:   replaceInExpression,
        semantic_and: nop,
        semantic_not: nop,
        optional:     replaceInExpression,
        zero_or_more: replaceInExpression,
        one_or_more:  replaceInExpression,
        action:       replaceInExpression,

        rule_ref:
          function(node, from, to) {
            if (node.name === from) {
              node.name = to;
            }
          },

        literal:      nop,
        any:          nop,
        "class":      nop
      });

      replace(ast, from, to);
    }

    var indices = [];

    each(ast.rules, function(rule, i) {
      if (isProxyRule(rule)) {
        replaceRuleRefs(ast, rule.name, rule.expression.name);
        if (rule.name === ast.startRule) {
          ast.startRule = rule.expression.name;
        }
        indices.push(i);
      }
    });

    indices.reverse();

    each(indices, function(index) {
      ast.rules.splice(index, 1);
    });
  },

  /*
   * Computes names of variables used for storing match results and parse
   * positions in generated code. These variables are organized as two stacks.
   * The following will hold after running this pass:
   *
   *   * All nodes except "grammar" and "rule" nodes will have a |resultVar|
   *     property. It will contain a name of the variable that will store a
   *     match result of the expression represented by the node in generated
   *     code.
   *
   *   * Some nodes will have a |posVar| property. It will contain a name of the
   *     variable that will store a parse position in generated code.
   *
   *   * All "rule" nodes will contain |resultVars| and |posVars| properties.
   *     They will contain a list of values of |resultVar| and |posVar|
   *     properties used in rule's subnodes. (This is useful to declare
   *     variables in generated code.)
   */
  computeVarNames: function(ast) {
    function resultVar(index) { return "result" + index; }
    function posVar(index)    { return "pos"    + index; }

    function computeLeaf(node, index) {
      node.resultVar = resultVar(index.result);

      return { result: 0, pos: 0 };
    }

    function computeFromExpression(delta) {
      return function(node, index) {
        var depth = compute(
              node.expression,
              {
                result: index.result + delta.result,
                pos:    index.pos    + delta.pos
              }
            );

        node.resultVar = resultVar(index.result);
        if (delta.pos !== 0) {
          node.posVar = posVar(index.pos);
        }

        return {
          result: depth.result + delta.result,
          pos:    depth.pos    + delta.pos
        };
      };
    }

    var compute = buildNodeVisitor({
      grammar:
        function(node, index) {
          each(node.rules, function(node) {
            compute(node, index);
          });
        },

      rule:
        function(node, index) {
          var depth = compute(node.expression, index);

          node.resultVar  = resultVar(index.result);
          node.resultVars = map(range(depth.result + 1), resultVar);
          node.posVars    = map(range(depth.pos),        posVar);
        },

      choice:
        function(node, index) {
          var depths = map(node.alternatives, function(alternative) {
            return compute(alternative, index);
          });

          node.resultVar = resultVar(index.result);

          return {
            result: Math.max.apply(null, pluck(depths, "result")),
            pos:    Math.max.apply(null, pluck(depths, "pos"))
          };
        },

      sequence:
        function(node, index) {
          var depths = map(node.elements, function(element, i) {
            return compute(
              element,
              { result: index.result + i, pos: index.pos + 1 }
            );
          });

          node.resultVar = resultVar(index.result);
          node.posVar    = posVar(index.pos);

          return {
            result:
              node.elements.length > 0
                ? Math.max.apply(
                    null,
                    map(depths, function(d, i) { return i + d.result; })
                  )
                : 0,

            pos:
              node.elements.length > 0
                ? 1 + Math.max.apply(null, pluck(depths, "pos"))
                : 1
          };
        },

      labeled:      computeFromExpression({ result: 0, pos: 0 }),
      simple_and:   computeFromExpression({ result: 0, pos: 1 }),
      simple_not:   computeFromExpression({ result: 0, pos: 1 }),
      semantic_and: computeLeaf,
      semantic_not: computeLeaf,
      optional:     computeFromExpression({ result: 0, pos: 0 }),
      zero_or_more: computeFromExpression({ result: 1, pos: 0 }),
      one_or_more:  computeFromExpression({ result: 1, pos: 0 }),
      action:       computeFromExpression({ result: 0, pos: 1 }),
      rule_ref:     computeLeaf,
      literal:      computeLeaf,
      any:          computeLeaf,
      "class":      computeLeaf
    });

    compute(ast, { result: 0, pos: 0 });
  },

  /*
   * This pass walks through the AST and tracks what labels are visible at each
   * point. For "action", "semantic_and" and "semantic_or" nodes it computes
   * parameter names and values for the function used in generated code. (In the
   * emitter, user's code is wrapped into a function that is immediately
   * executed. Its parameter names correspond to visible labels and its
   * parameter values to their captured values). Implicitly, this pass defines
   * scoping rules for labels.
   *
   * After running this pass, all "action", "semantic_and" and "semantic_or"
   * nodes will have a |params| property containing an object mapping parameter
   * names to the expressions that will be used as their values.
   */
  computeParams: function(ast) {
    var envs = [];

    function scoped(f) {
      envs.push({});
      f();
      envs.pop();
    }

    function nop() {}

    function computeForScopedExpression(node) {
      scoped(function() { compute(node.expression); });
    }

    function computeParams(node) {
      var env = envs[envs.length - 1], params = {}, name;

      for (name in env) {
        params[name] = env[name];
      }
      node.params = params;
    }

    var compute = buildNodeVisitor({
      grammar:
        function(node) {
          each(node.rules, compute);
        },

      rule:         computeForScopedExpression,

      choice:
        function(node) {
          scoped(function() { each(node.alternatives, compute); });
        },

      sequence:
        function(node) {
          var env = envs[envs.length - 1], name;

          function fixup(name) {
            each(pluck(node.elements, "resultVar"), function(resultVar, i) {
              if ((new RegExp("^" + resultVar + "(\\[\\d+\\])*$")).test(env[name])) {
                env[name] = node.resultVar + "[" + i + "]"
                          + env[name].substr(resultVar.length);
              }
            });
          }

          each(node.elements, compute);

          for (name in env) {
            fixup(name);
          }
        },

      labeled:
        function(node) {
          envs[envs.length - 1][node.label] = node.resultVar;

          scoped(function() { compute(node.expression); });
        },

      simple_and:   computeForScopedExpression,
      simple_not:   computeForScopedExpression,
      semantic_and: computeParams,
      semantic_not: computeParams,
      optional:     computeForScopedExpression,
      zero_or_more: computeForScopedExpression,
      one_or_more:  computeForScopedExpression,

      action:
        function(node) {
          scoped(function() {
            compute(node.expression);
            computeParams(node);
          });
        },

      rule_ref:     nop,
      literal:      nop,
      any:          nop,
      "class":      nop
    });

    compute(ast);
  }
};
/* Emits the generated code for the AST. */
PEG.compiler.emitter = function(ast, options) {
  options = options || {};
  if (options.cache === undefined) {
    options.cache = false;
  }
  if (options.trackLineAndColumn === undefined) {
    options.trackLineAndColumn = false;
  }

  /*
   * Codie 1.1.0
   *
   * https://github.com/dmajda/codie
   *
   * Copyright (c) 2011-2012 David Majda
   * Licensend under the MIT license.
   */
  var Codie = (function(undefined) {

  function stringEscape(s) {
    function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
    return s
      .replace(/\\/g,   '\\\\') // backslash
      .replace(/"/g,    '\\"')  // closing double quote
      .replace(/\x08/g, '\\b')  // backspace
      .replace(/\t/g,   '\\t')  // horizontal tab
      .replace(/\n/g,   '\\n')  // line feed
      .replace(/\f/g,   '\\f')  // form feed
      .replace(/\r/g,   '\\r')  // carriage return
      .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
      .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
      .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
  }

  function push(s) { return '__p.push(' + s + ');'; }

  function pushRaw(template, length, state) {
    function unindent(code, level, unindentFirst) {
      return code.replace(
        new RegExp('^.{' + level +'}', "gm"),
        function(str, offset) {
          if (offset === 0) {
            return unindentFirst ? '' : str;
          } else {
            return "";
          }
        }
      );
    }

    var escaped = stringEscape(unindent(
          template.substring(0, length),
          state.indentLevel(),
          state.atBOL
        ));

    return escaped.length > 0 ? push('"' + escaped + '"') : '';
  }


  var Codie = {
    /* Codie version (uses semantic versioning). */
    VERSION: "1.1.0",

    /*
     * Specifies by how many characters do #if/#else and #for unindent their
     * content in the generated code.
     */
    indentStep: 2,

    /* Description of #-commands. Extend to define your own commands. */
    commands: {
      "if":   {
        params:  /^(.*)$/,
        compile: function(state, prefix, params) {
          return ['if(' + params[0] + '){', []];
        },
        stackOp: "push"
      },
      "else": {
        params:  /^$/,
        compile: function(state) {
          var stack = state.commandStack,
              insideElse = stack[stack.length - 1] === "else",
              insideIf   = stack[stack.length - 1] === "if";

          if (insideElse) { throw new Error("Multiple #elses."); }
          if (!insideIf)  { throw new Error("Using #else outside of #if."); }

          return ['}else{', []];
        },
        stackOp: "replace"
      },
      "for":  {
        params:  /^([a-zA-Z_][a-zA-Z0-9_]*)[ \t]+in[ \t]+(.*)$/,
        init:    function(state) {
          state.forCurrLevel = 0;  // current level of #for loop nesting
          state.forMaxLevel  = 0;  // maximum level of #for loop nesting
        },
        compile: function(state, prefix, params) {
          var c = '__c' + state.forCurrLevel, // __c for "collection"
              l = '__l' + state.forCurrLevel, // __l for "length"
              i = '__i' + state.forCurrLevel; // __i for "index"

          state.forCurrLevel++;
          if (state.forMaxLevel < state.forCurrLevel) {
            state.forMaxLevel = state.forCurrLevel;
          }

          return [
            c + '=' + params[1] + ';'
              + l + '=' + c + '.length;'
              + 'for(' + i + '=0;' + i + '<' + l + ';' + i + '++){'
              + params[0] + '=' + c + '[' + i + '];',
            [params[0], c, l, i]
          ];
        },
        exit:    function(state) { state.forCurrLevel--; },
        stackOp: "push"
      },
      "end":  {
        params:  /^$/,
        compile: function(state) {
          var stack = state.commandStack, exit;

          if (stack.length === 0) { throw new Error("Too many #ends."); }

          exit = Codie.commands[stack[stack.length - 1]].exit;
          if (exit) { exit(state); }

          return ['}', []];
        },
        stackOp: "pop"
      },
      "block": {
        params: /^(.*)$/,
        compile: function(state, prefix, params) {
          var x = '__x', // __x for "prefix",
              n = '__n', // __n for "lines"
              l = '__l', // __l for "length"
              i = '__i'; // __i for "index"

          /*
           * Originally, the generated code used |String.prototype.replace|, but
           * it is buggy in certain versions of V8 so it was rewritten. See the
           * tests for details.
           */
          return [
            x + '="' + stringEscape(prefix.substring(state.indentLevel())) + '";'
              + n + '=(' + params[0] + ').toString().split("\\n");'
              + l + '=' + n + '.length;'
              + 'for(' + i + '=0;' + i + '<' + l + ';' + i + '++){'
              + n + '[' + i +']=' + x + '+' + n + '[' + i + ']+"\\n";'
              + '}'
              + push(n + '.join("")'),
            [x, n, l, i]
          ];
        },
        stackOp: "nop"
      }
    },

    /*
     * Compiles a template into a function. When called, this function will
     * execute the template in the context of an object passed in a parameter and
     * return the result.
     */
    template: function(template) {
      var stackOps = {
        push:    function(stack, name) { stack.push(name); },
        replace: function(stack, name) { stack[stack.length - 1] = name; },
        pop:     function(stack)       { stack.pop(); },
        nop:     function()            { }
      };

      function compileExpr(state, expr) {
        state.atBOL = false;
        return [push(expr), []];
      }

      function compileCommand(state, prefix, name, params) {
        var command, match, result;

        command = Codie.commands[name];
        if (!command) { throw new Error("Unknown command: #" + name + "."); }

        match = command.params.exec(params);
        if (match === null) {
          throw new Error(
            "Invalid params for command #" + name + ": " + params + "."
          );
        }

        result = command.compile(state, prefix, match.slice(1));
        stackOps[command.stackOp](state.commandStack, name);
        state.atBOL = true;
        return result;
      }

      var state = {               // compilation state
            commandStack: [],     //   stack of commands as they were nested
            atBOL:        true,   //   is the next character to process at BOL?
            indentLevel:  function() {
              return Codie.indentStep * this.commandStack.length;
            }
          },
          code = '',              // generated template function code
          vars = ['__p=[]'],      // variables used by generated code
          name, match, result, i;

      /* Initialize state. */
      for (name in Codie.commands) {
        if (Codie.commands[name].init) { Codie.commands[name].init(state); }
      }

      /* Compile the template. */
      while ((match = /^([ \t]*)#([a-zA-Z_][a-zA-Z0-9_]*)(?:[ \t]+([^ \t\n][^\n]*))?[ \t]*(?:\n|$)|#\{([^}]*)\}/m.exec(template)) !== null) {
        code += pushRaw(template, match.index, state);
        result = match[2] !== undefined && match[2] !== ""
          ? compileCommand(state, match[1], match[2], match[3] || "") // #-command
          : compileExpr(state, match[4]);                             // #{...}
        code += result[0];
        vars = vars.concat(result[1]);
        template = template.substring(match.index + match[0].length);
      }
      code += pushRaw(template, template.length, state);

      /* Check the final state. */
      if (state.commandStack.length > 0) { throw new Error("Missing #end."); }

      /* Sanitize the list of variables used by commands. */
      vars.sort();
      for (i = 0; i < vars.length; i++) {
        if (vars[i] === vars[i - 1]) { vars.splice(i--, 1); }
      }

      /* Create the resulting function. */
      return new Function("__v", [
        '__v=__v||{};',
        'var ' + vars.join(',') + ';',
        'with(__v){',
        code,
        'return __p.join("").replace(/^\\n+|\\n+$/g,"");};'
      ].join(''));
    }
  };

  return Codie;

  })();

  var templates = (function() {
    var name,
        templates = {},
        sources = {
          grammar: [
            '(function(){',
            '  /*',
            '   * Generated by PEG.js 0.7.0.',
            '   *',
            '   * http://pegjs.majda.cz/',
            '   */',
            '  ',
            /* This needs to be in sync with |quote| in utils.js. */
            '  function quote(s) {',
            '    /*',
            '     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a',
            '     * string literal except for the closing quote character, backslash,',
            '     * carriage return, line separator, paragraph separator, and line feed.',
            '     * Any character may appear in the form of an escape sequence.',
            '     *',
            '     * For portability, we also escape escape all control and non-ASCII',
            '     * characters. Note that "\\0" and "\\v" escape sequences are not used',
            '     * because JSHint does not like the first and IE the second.',
            '     */',
            '     return \'"\' + s',
            '      .replace(/\\\\/g, \'\\\\\\\\\')  // backslash',
            '      .replace(/"/g, \'\\\\"\')    // closing quote character',
            '      .replace(/\\x08/g, \'\\\\b\') // backspace',
            '      .replace(/\\t/g, \'\\\\t\')   // horizontal tab',
            '      .replace(/\\n/g, \'\\\\n\')   // line feed',
            '      .replace(/\\f/g, \'\\\\f\')   // form feed',
            '      .replace(/\\r/g, \'\\\\r\')   // carriage return',
            '      .replace(/[\\x00-\\x07\\x0B\\x0E-\\x1F\\x80-\\uFFFF]/g, escape)',
            '      + \'"\';',
            '  }',
            '  ',
            '  var result = {',
            '    /*',
            '     * Parses the input with a generated parser. If the parsing is successfull,',
            '     * returns a value explicitly or implicitly specified by the grammar from',
            '     * which the parser was generated (see |PEG.buildParser|). If the parsing is',
            '     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.',
            '     */',
            '    parse: function(input, startRule) {',
            '      var parseFunctions = {',
            '        #for rule in node.rules',
            '          #{string(rule.name) + ": parse_" + rule.name + (rule !== node.rules[node.rules.length - 1] ? "," : "")}',
            '        #end',
            '      };',
            '      ',
            '      if (startRule !== undefined) {',
            '        if (parseFunctions[startRule] === undefined) {',
            '          throw new Error("Invalid rule name: " + quote(startRule) + ".");',
            '        }',
            '      } else {',
            '        startRule = #{string(node.startRule)};',
            '      }',
            '      ',
            '      #{posInit("pos")};',
            '      var reportFailures = 0;', // 0 = report, anything > 0 = do not report
            '      #{posInit("rightmostFailuresPos")};',
            '      var rightmostFailuresExpected = [];',
            '      #if options.cache',
            '        var cache = {};',
            '      #end',
            '      ',
            /* This needs to be in sync with |padLeft| in utils.js. */
            '      function padLeft(input, padding, length) {',
            '        var result = input;',
            '        ',
            '        var padLength = length - input.length;',
            '        for (var i = 0; i < padLength; i++) {',
            '          result = padding + result;',
            '        }',
            '        ',
            '        return result;',
            '      }',
            '      ',
            /* This needs to be in sync with |escape| in utils.js. */
            '      function escape(ch) {',
            '        var charCode = ch.charCodeAt(0);',
            '        var escapeChar;',
            '        var length;',
            '        ',
            '        if (charCode <= 0xFF) {',
            '          escapeChar = \'x\';',
            '          length = 2;',
            '        } else {',
            '          escapeChar = \'u\';',
            '          length = 4;',
            '        }',
            '        ',
            '        return \'\\\\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), \'0\', length);',
            '      }',
            '      ',
            '      #if options.trackLineAndColumn',
            '        function clone(object) {',
            '          var result = {};',
            '          for (var key in object) {',
            '            result[key] = object[key];',
            '          }',
            '          return result;',
            '        }',
            '        ',
            '        function advance(pos, n) {',
            '          var endOffset = pos.offset + n;',
            '          ',
            '          for (var offset = pos.offset; offset < endOffset; offset++) {',
            '            var ch = input.charAt(offset);',
            '            if (ch === "\\n") {',
            '              if (!pos.seenCR) { pos.line++; }',
            '              pos.column = 1;',
            '              pos.seenCR = false;',
            '            } else if (ch === "\\r" || ch === "\\u2028" || ch === "\\u2029") {',
            '              pos.line++;',
            '              pos.column = 1;',
            '              pos.seenCR = true;',
            '            } else {',
            '              pos.column++;',
            '              pos.seenCR = false;',
            '            }',
            '          }',
            '          ',
            '          pos.offset += n;',
            '        }',
            '        ',
            '      #end',
            '      function matchFailed(failure) {',
            '        if (#{posOffset("pos")} < #{posOffset("rightmostFailuresPos")}) {',
            '          return;',
            '        }',
            '        ',
            '        if (#{posOffset("pos")} > #{posOffset("rightmostFailuresPos")}) {',
            '          rightmostFailuresPos = #{posClone("pos")};',
            '          rightmostFailuresExpected = [];',
            '        }',
            '        ',
            '        rightmostFailuresExpected.push(failure);',
            '      }',
            '      ',
            '      #for rule in node.rules',
            '        #block emit(rule)',
            '        ',
            '      #end',
            '      ',
            '      function cleanupExpected(expected) {',
            '        expected.sort();',
            '        ',
            '        var lastExpected = null;',
            '        var cleanExpected = [];',
            '        for (var i = 0; i < expected.length; i++) {',
            '          if (expected[i] !== lastExpected) {',
            '            cleanExpected.push(expected[i]);',
            '            lastExpected = expected[i];',
            '          }',
            '        }',
            '        return cleanExpected;',
            '      }',
            '      ',
            '      #if !options.trackLineAndColumn',
            '        function computeErrorPosition() {',
            '          /*',
            '           * The first idea was to use |String.split| to break the input up to the',
            '           * error position along newlines and derive the line and column from',
            '           * there. However IE\'s |split| implementation is so broken that it was',
            '           * enough to prevent it.',
            '           */',
            '          ',
            '          var line = 1;',
            '          var column = 1;',
            '          var seenCR = false;',
            '          ',
            '          for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {',
            '            var ch = input.charAt(i);',
            '            if (ch === "\\n") {',
            '              if (!seenCR) { line++; }',
            '              column = 1;',
            '              seenCR = false;',
            '            } else if (ch === "\\r" || ch === "\\u2028" || ch === "\\u2029") {',
            '              line++;',
            '              column = 1;',
            '              seenCR = true;',
            '            } else {',
            '              column++;',
            '              seenCR = false;',
            '            }',
            '          }',
            '          ',
            '          return { line: line, column: column };',
            '        }',
            '      #end',
            '      ',
            '      #if node.initializer',
            '        #block emit(node.initializer)',
            '      #end',
            '      ',
            '      var result = parseFunctions[startRule]();',
            '      ',
            '      /*',
            '       * The parser is now in one of the following three states:',
            '       *',
            '       * 1. The parser successfully parsed the whole input.',
            '       *',
            '       *    - |result !== null|',
            '       *    - |#{posOffset("pos")} === input.length|',
            '       *    - |rightmostFailuresExpected| may or may not contain something',
            '       *',
            '       * 2. The parser successfully parsed only a part of the input.',
            '       *',
            '       *    - |result !== null|',
            '       *    - |#{posOffset("pos")} < input.length|',
            '       *    - |rightmostFailuresExpected| may or may not contain something',
            '       *',
            '       * 3. The parser did not successfully parse any part of the input.',
            '       *',
            '       *   - |result === null|',
            '       *   - |#{posOffset("pos")} === 0|',
            '       *   - |rightmostFailuresExpected| contains at least one failure',
            '       *',
            '       * All code following this comment (including called functions) must',
            '       * handle these states.',
            '       */',
            '      if (result === null || #{posOffset("pos")} !== input.length) {',
            '        var offset = Math.max(#{posOffset("pos")}, #{posOffset("rightmostFailuresPos")});',
            '        var found = offset < input.length ? input.charAt(offset) : null;',
            '        #if options.trackLineAndColumn',
            '          var errorPosition = #{posOffset("pos")} > #{posOffset("rightmostFailuresPos")} ? pos : rightmostFailuresPos;',
            '        #else',
            '          var errorPosition = computeErrorPosition();',
            '        #end',
            '        ',
            '        throw new this.SyntaxError(',
            '          cleanupExpected(rightmostFailuresExpected),',
            '          found,',
            '          offset,',
            '          errorPosition.line,',
            '          errorPosition.column',
            '        );',
            '      }',
            '      ',
            '      return result;',
            '    },',
            '    ',
            '    /* Returns the parser source code. */',
            '    toSource: function() { return this._source; }',
            '  };',
            '  ',
            '  /* Thrown when a parser encounters a syntax error. */',
            '  ',
            '  result.SyntaxError = function(expected, found, offset, line, column) {',
            '    function buildMessage(expected, found) {',
            '      var expectedHumanized, foundHumanized;',
            '      ',
            '      switch (expected.length) {',
            '        case 0:',
            '          expectedHumanized = "end of input";',
            '          break;',
            '        case 1:',
            '          expectedHumanized = expected[0];',
            '          break;',
            '        default:',
            '          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")',
            '            + " or "',
            '            + expected[expected.length - 1];',
            '      }',
            '      ',
            '      foundHumanized = found ? quote(found) : "end of input";',
            '      ',
            '      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";',
            '    }',
            '    ',
            '    this.name = "SyntaxError";',
            '    this.expected = expected;',
            '    this.found = found;',
            '    this.message = buildMessage(expected, found);',
            '    this.offset = offset;',
            '    this.line = line;',
            '    this.column = column;',
            '  };',
            '  ',
            '  result.SyntaxError.prototype = Error.prototype;',
            '  ',
            '  return result;',
            '})()'
          ],
          rule: [
            'function parse_#{node.name}() {',
            '  #if options.cache',
            '    var cacheKey = "#{node.name}@" + #{posOffset("pos")};',
            '    var cachedResult = cache[cacheKey];',
            '    if (cachedResult) {',
            '      pos = #{posClone("cachedResult.nextPos")};',
            '      return cachedResult.result;',
            '    }',
            '    ',
            '  #end',
            '  #if node.resultVars.length > 0',
            '    var #{node.resultVars.join(", ")};',
            '  #end',
            '  #if node.posVars.length > 0',
            '    var #{node.posVars.join(", ")};',
            '  #end',
            '  ',
            '  #if node.displayName !== null',
            '    reportFailures++;',
            '  #end',
            '  #block emit(node.expression)',
            '  #if node.displayName !== null',
            '    reportFailures--;',
            '    if (reportFailures === 0 && #{node.resultVar} === null) {',
            '      matchFailed(#{string(node.displayName)});',
            '    }',
            '  #end',
            '  #if options.cache',
            '    ',
            '    cache[cacheKey] = {',
            '      nextPos: #{posClone("pos")},',
            '      result:  #{node.resultVar}',
            '    };',
            '  #end',
            '  return #{node.resultVar};',
            '}'
          ],
          choice: [
            '#block emit(alternative)',
            '#block nextAlternativesCode'
          ],
          "choice.next": [
            'if (#{node.resultVar} === null) {',
            '  #block code',
            '}'
          ],
          sequence: [
            '#{posSave(node)};',
            '#block code'
          ],
          "sequence.iteration": [
            '#block emit(element)',
            'if (#{element.resultVar} !== null) {',
            '  #block code',
            '} else {',
            '  #{node.resultVar} = null;',
            '  #{posRestore(node)};',
            '}'
          ],
          "sequence.inner": [
            '#{node.resultVar} = [#{pluck(node.elements, "resultVar").join(", ")}];'
          ],
          simple_and: [
            '#{posSave(node)};',
            'reportFailures++;',
            '#block emit(node.expression)',
            'reportFailures--;',
            'if (#{node.resultVar} !== null) {',
            '  #{node.resultVar} = "";',
            '  #{posRestore(node)};',
            '} else {',
            '  #{node.resultVar} = null;',
            '}'
          ],
          simple_not: [
            '#{posSave(node)};',
            'reportFailures++;',
            '#block emit(node.expression)',
            'reportFailures--;',
            'if (#{node.resultVar} === null) {',
            '  #{node.resultVar} = "";',
            '} else {',
            '  #{node.resultVar} = null;',
            '  #{posRestore(node)};',
            '}'
          ],
          semantic_and: [
            '#{node.resultVar} = (function(#{(options.trackLineAndColumn ? ["offset", "line", "column"] : ["offset"]).concat(keys(node.params)).join(", ")}) {#{node.code}})(#{(options.trackLineAndColumn ? ["pos.offset", "pos.line", "pos.column"] : ["pos"]).concat(values(node.params)).join(", ")}) ? "" : null;'
          ],
          semantic_not: [
            '#{node.resultVar} = (function(#{(options.trackLineAndColumn ? ["offset", "line", "column"] : ["offset"]).concat(keys(node.params)).join(", ")}) {#{node.code}})(#{(options.trackLineAndColumn ? ["pos.offset", "pos.line", "pos.column"] : ["pos"]).concat(values(node.params)).join(", ")}) ? null : "";'
          ],
          optional: [
            '#block emit(node.expression)',
            '#{node.resultVar} = #{node.resultVar} !== null ? #{node.resultVar} : "";'
          ],
          zero_or_more: [
            '#{node.resultVar} = [];',
            '#block emit(node.expression)',
            'while (#{node.expression.resultVar} !== null) {',
            '  #{node.resultVar}.push(#{node.expression.resultVar});',
            '  #block emit(node.expression)',
            '}'
          ],
          one_or_more: [
            '#block emit(node.expression)',
            'if (#{node.expression.resultVar} !== null) {',
            '  #{node.resultVar} = [];',
            '  while (#{node.expression.resultVar} !== null) {',
            '    #{node.resultVar}.push(#{node.expression.resultVar});',
            '    #block emit(node.expression)',
            '  }',
            '} else {',
            '  #{node.resultVar} = null;',
            '}'
          ],
          action: [
            '#{posSave(node)};',
            '#block emit(node.expression)',
            'if (#{node.resultVar} !== null) {',
            '  #{node.resultVar} = (function(#{(options.trackLineAndColumn ? ["offset", "line", "column"] : ["offset"]).concat(keys(node.params)).join(", ")}) {#{node.code}})(#{(options.trackLineAndColumn ? [node.posVar + ".offset", node.posVar + ".line", node.posVar + ".column"] : [node.posVar]).concat(values(node.params)).join(", ")});',
            '}',
            'if (#{node.resultVar} === null) {',
            '  #{posRestore(node)};',
            '}'
          ],
          rule_ref: [
            '#{node.resultVar} = parse_#{node.name}();'
          ],
          literal: [
            '#if node.value.length === 0',
            '  #{node.resultVar} = "";',
            '#else',
            '  #if !node.ignoreCase',
            '    #if node.value.length === 1',
            '      if (input.charCodeAt(#{posOffset("pos")}) === #{node.value.charCodeAt(0)}) {',
            '    #else',
            '      if (input.substr(#{posOffset("pos")}, #{node.value.length}) === #{string(node.value)}) {',
            '    #end',
            '  #else',
            /*
             * One-char literals are not optimized when case-insensitive
             * matching is enabled. This is because there is no simple way to
             * lowercase a character code that works for character outside ASCII
             * letters. Moreover, |toLowerCase| can change string length,
             * meaning the result of lowercasing a character can be more
             * characters.
             */
            '    if (input.substr(#{posOffset("pos")}, #{node.value.length}).toLowerCase() === #{string(node.value.toLowerCase())}) {',
            '  #end',
            '    #if !node.ignoreCase',
            '      #{node.resultVar} = #{string(node.value)};',
            '    #else',
            '      #{node.resultVar} = input.substr(#{posOffset("pos")}, #{node.value.length});',
            '    #end',
            '    #{posAdvance(node.value.length)};',
            '  } else {',
            '    #{node.resultVar} = null;',
            '    if (reportFailures === 0) {',
            '      matchFailed(#{string(string(node.value))});',
            '    }',
            '  }',
            '#end'
          ],
          any: [
            'if (input.length > #{posOffset("pos")}) {',
            '  #{node.resultVar} = input.charAt(#{posOffset("pos")});',
            '  #{posAdvance(1)};',
            '} else {',
            '  #{node.resultVar} = null;',
            '  if (reportFailures === 0) {',
            '    matchFailed("any character");',
            '  }',
            '}'
          ],
          "class": [
            'if (#{regexp}.test(input.charAt(#{posOffset("pos")}))) {',
            '  #{node.resultVar} = input.charAt(#{posOffset("pos")});',
            '  #{posAdvance(1)};',
            '} else {',
            '  #{node.resultVar} = null;',
            '  if (reportFailures === 0) {',
            '    matchFailed(#{string(node.rawText)});',
            '  }',
            '}'
          ]
        };

    for (name in sources) {
      templates[name] = Codie.template(sources[name].join('\n'));
    }

    return templates;
  })();

  function fill(name, vars) {
    vars.string  = quote;
    vars.pluck   = pluck;
    vars.keys    = keys;
    vars.values  = values;
    vars.emit    = emit;
    vars.options = options;

    /* Position-handling macros */
    if (options.trackLineAndColumn) {
      vars.posInit    = function(name) {
        return "var "
             + name
             + " = "
             + "{ offset: 0, line: 1, column: 1, seenCR: false }";
      };
      vars.posClone   = function(name) { return "clone(" + name + ")"; };
      vars.posOffset  = function(name) { return name + ".offset"; };

      vars.posAdvance = function(n)    { return "advance(pos, " + n + ")"; };
    } else {
      vars.posInit    = function(name) { return "var " + name + " = 0"; };
      vars.posClone   = function(name) { return name; };
      vars.posOffset  = function(name) { return name; };

      vars.posAdvance = function(n) {
        return n === 1 ? "pos++" : "pos += " + n;
      };
    }
    vars.posSave    = function(node) {
      return node.posVar + " = " + vars.posClone("pos");
    };
    vars.posRestore = function(node) {
      return "pos" + " = " + vars.posClone(node.posVar);
    };

    return templates[name](vars);
  }

  function emitSimple(name) {
    return function(node) { return fill(name, { node: node }); };
  }

  var emit = buildNodeVisitor({
    grammar: emitSimple("grammar"),

    initializer: function(node) { return node.code; },

    rule: emitSimple("rule"),

    /*
     * The contract for all code fragments generated by the following functions
     * is as follows.
     *
     * The code fragment tries to match a part of the input starting with the
     * position indicated in |pos|. That position may point past the end of the
     * input.
     *
     * * If the code fragment matches the input, it advances |pos| to point to
     *   the first chracter following the matched part of the input and sets
     *   variable with a name stored in |node.resultVar| to an appropriate
     *   value. This value is always non-|null|.
     *
     * * If the code fragment does not match the input, it returns with |pos|
     *   set to the original value and it sets a variable with a name stored in
     *   |node.resultVar| to |null|.
     *
     * The code can use variables with names stored in |resultVar| and |posVar|
     * properties of the current node's subnodes. It can't use any other
     * variables.
     */

    choice: function(node) {
      var code, nextAlternativesCode;

      for (var i = node.alternatives.length - 1; i >= 0; i--) {
        nextAlternativesCode = i !== node.alternatives.length - 1
          ? fill("choice.next", { node: node, code: code })
          : '';
        code = fill("choice", {
          alternative:          node.alternatives[i],
          nextAlternativesCode: nextAlternativesCode
        });
      }

      return code;
    },

    sequence: function(node) {
      var code = fill("sequence.inner", { node: node });

      for (var i = node.elements.length - 1; i >= 0; i--) {
        code = fill("sequence.iteration", {
          node:    node,
          element: node.elements[i],
          code:    code
        });
      }

      return fill("sequence", { node: node, code: code });
    },

    labeled: function(node) { return emit(node.expression); },

    simple_and:   emitSimple("simple_and"),
    simple_not:   emitSimple("simple_not"),
    semantic_and: emitSimple("semantic_and"),
    semantic_not: emitSimple("semantic_not"),
    optional:     emitSimple("optional"),
    zero_or_more: emitSimple("zero_or_more"),
    one_or_more:  emitSimple("one_or_more"),
    action:       emitSimple("action"),
    rule_ref:     emitSimple("rule_ref"),
    literal:      emitSimple("literal"),
    any:          emitSimple("any"),

    "class": function(node) {
      var regexp;

      if (node.parts.length > 0) {
        regexp = '/^['
          + (node.inverted ? '^' : '')
          + map(node.parts, function(part) {
              return part instanceof Array
                ? quoteForRegexpClass(part[0])
                  + '-'
                  + quoteForRegexpClass(part[1])
                : quoteForRegexpClass(part);
            }).join('')
          + ']/' + (node.ignoreCase ? 'i' : '');
      } else {
        /*
         * Stupid IE considers regexps /[]/ and /[^]/ syntactically invalid, so
         * we translate them into euqivalents it can handle.
         */
        regexp = node.inverted ? '/^[\\S\\s]/' : '/^(?!)/';
      }

      return fill("class", { node: node, regexp: regexp });
    }
  });

  return emit(ast);
};

return PEG;

})();

if (typeof module !== "undefined") {
  module.exports = PEG;
}var Base64 = {

    /**
     * This implementation relies on Cordova 1.5 or above implementations.
     */
    getBase64ImageFromInput : function(input, callback) {

        var imageReader = new FileReader();

        imageReader.onloadend = function(evt) {
            if(callback)
                callback(evt.target.result);
        };

        imageReader.readAsDataURL(input);
    },
    
    formatImageSrcString : function(base64){
        return (base64.match(/(base64)/))? base64 : "data:image/jpeg;base64," + base64;
    }
       
}
var DateTimePicker = function(){
    
    /**
     * Regular expression for validating the time component of a timestamp prompt.
     */
    var DATE_REGEX = "[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])";

    /**
     * Regular expression for validating the time component of a timestamp prompt.
     */
    var TIME_REGEX = "^(([0-9])|([0-1][0-9])|([2][0-3])):(([0-9])|([0-5][0-9]))$";

    //Left pads 'd' to '0d', if necessary.
    var leftPad = function(number){
        return ((String(number)).length === 1) ? "0" + number : number;
    };

    /**
     * Returns date formated as YYYY-MM-DD.
     */
    var getFullDate = function(date){
        return date.getFullYear() + "-" +
               leftPad(date.getMonth() + 1) + "-" +
               leftPad(date.getDate());
    };
    
    this.createDatePicker = function(date){
        date = date || new Date();

        var datePicker = document.createElement('input');
        datePicker.type = 'date';
        datePicker.value = getFullDate(date);

        //Handle browsers that don't support HTML5's input=date.
        //This is kind of a hack since Android browser engine sets the input
        //type to 'date' but doesn't really support it.
        if(datePicker.type === 'text' || navigator.userAgent.match(/(Android)/)){
            $(datePicker).scroller({dateFormat:'yyyy-mm-dd', dateOrder:'yymmdd'});
        }
        
        datePicker.isValid = function(){
            return datePicker.value.match(DATE_REGEX);
        };

        return datePicker;
    };

    this.createTimePicker = function(date){
        date = date || new Date();

        var timePicker = document.createElement('input');
        timePicker.type = 'time';
        timePicker.value = leftPad(date.getHours()) + ":" + leftPad(date.getMinutes());

        //Handle browsers that don't support HTML5's input=time.
        if(timePicker.type === 'text' || navigator.userAgent.match(/(Android)/)){
            $(timePicker).scroller({preset:'time', ampm: false, timeFormat:'HH:ii'});
        }
        
        timePicker.isValid = function(){
            return timePicker.value.match(TIME_REGEX);
        };
        
        timePicker.getInput = function(){
            return timePicker.value;
        };
        
        timePicker.getHours = function(){
            return parseInt(timePicker.getInput().split(":")[0], 10);
        };
        
        timePicker.getMinutes = function(){
            return parseInt(timePicker.getInput().split(":")[1], 10);
        };
        
        
        return timePicker;
    };

};

DateTimePicker.createDateTimeForm = function(title, datePicker, timePicker){
    
    var form = mwf.decorator.Form(title);

    form.addLabel("Select Date");
    form.addItem(datePicker);

    form.addLabel("Select Time");
    form.addItem(timePicker);

    return form;
};

/**
 * Returns HH:MM
 */
DateTimePicker.getPaddedTime = function(date){
    return date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "" ) + date.getMinutes();
};

/**
 * The class encapsulates and facilitates device detection based on the current
 * device's user agent string.
 *
 * @class DeviceDetection
 * @author Zorayr Khalapyan
 * @version 11/05/2012
 */
var DeviceDetection = (function() {
    var self = {};

    var userAgent = navigator.userAgent;

    var documentURL = document.URL;

    var matchUserAgent = function( agentRegexp ) {
        return userAgent.match(agentRegexp);
    };

    /**
     * Returns true if the user is on a mobile device.
     */
    self.isOnDevice = function() {
        return matchUserAgent(/(iPhone|iPod|iPad|Android|BlackBerry)/);
    };

    /**
     * Returns true if the user is currently on an iPhone, iPod, or an iPad.
     */
    self.isDeviceiOS = function() {
        return matchUserAgent( /(iPhone|iPod|iPad)/ );
    };

    /**
     * Returns true if the user is currently on an Android device.
     */
    self.isDeviceAndroid = function() {
        return matchUserAgent(/(Android)/);
    };

    /**
     * Returns true if the current application is running on a Cordova build.
     */
    self.isNativeApplication = function() {
        return documentURL.indexOf( 'http://' ) === -1 &&
               documentURL.indexOf( 'https://' ) === -1;
    };

    /**
     * The method sets the current user agent string and can be used for agent
     * spoofing or for testing.
     */
    self.setUserAgent = function( newUserAgent ) {
        userAgent = newUserAgent;
    };

    /**
     * The method sets the current document URL string and can be used for
     * testing native application detection.
     */
    self.setDocumentURL = function( newDocumentURL ) {
        documentURL = newDocumentURL;
    };

    return self;

}());/**
 * The class is designed to facilitate flexible permanent storage of key value
 * pairs utilzing HTML5 localStorage.
 *
 * @class LocalMap
 * @author Zorayr Khalapyan
 * @version 10/25/2012
 */
var LocalMap = function ( name ) {
    var that = {};

    //Prevent compatability issues in different execution environments.
    if ( !localStorage ) {
        localStorage = {};
    }

    if ( !localStorage[name] ) {
        localStorage[name] = "{}";
    }

    var setMap = function ( map ) {
        localStorage[name] = JSON.stringify( map );
    };

    that.getMap = function () {
        return JSON.parse( localStorage[name] );
    };

    /**
     * Stores the specified (key, value) pair in the localStorage
     * under the map's namespace.
     */
    that.set = function ( name, object ) {
        var map = that.getMap();
        map[ name ] = object;
        setMap( map );
    };

    that.get = function ( name ) {
        var map = that.getMap();
        return typeof( map[ name ] ) !== "undefined" ? map[name] : null;
    };

    that.importMap = function ( object ) {
        var map = that.getMap();
        var key;
        for ( key in object ) {
            if (object.hasOwnProperty(key)) {
                map[key] = object[key];
            }
        }
        setMap(map);
    };

    that.length = function () {
        var map = that.getMap();
        var size = 0, key;
        for (key in map) {
            if (map.hasOwnProperty(key)) size++;
        }
        return size;
    };

    that.erase = function () {
        localStorage[name] = JSON.stringify({});
    };

    that.isSet = function (name) {
        return that.get(name) != null;
    };

    that.release = function (name) {
        var map = that.getMap();
        if (map[name]) {
            delete map[name];
        }
        setMap(map);
    };

    that.deleteNamespace = function(){
        if (localStorage.hasOwnProperty(name)) {
            delete localStorage[name];
        }
    };

    return that;

};

LocalMap.destroy = function () {
    for ( var item in localStorage ) {
        if ( localStorage.hasOwnProperty( item ) ) {
            delete localStorage[ item ];
        }
    }
};

LocalMap.exists = function (name) {
    return (localStorage[name]) ? true : false;
};
var LocalNotificationAdapter = (function(){

    var that = {};

    var isLocalNotificationAvailable = function(){
        return typeof plugins !== "undefined" && typeof(plugins.localNotification) !== "undefined";
    };

    that.add = function(options){
        if (isLocalNotificationAvailable()) {
            if(DeviceDetection.isDeviceAndroid()){
                plugins.localNotification.add({
                    date        : options.date,
                    message     : "You have a pending survey.",//options.message,
                    ticker      : "You have a pending survey.",
                    repeatDaily : options.repeatDaily,
                    id          : options.id
                });
            }else if(DeviceDetection.isDeviceiOS()){
                plugins.localNotification.add({
                    date        : options.date,
                    message     : options.message,
                    background  : "goToPendingSurveys",
                    badge       : 1,
                    id          : options.id,
                    sound       :'horn.caf'
                });
            }
        }
    };

    that.cancel = function(id){
        if (isLocalNotificationAvailable()) {
            console.log("LocalNotificationAdapter: cancel(" + id + ")");
            plugins.localNotification.cancel(id);
        }
    };

    that.cancelAll = function(){
        if (isLocalNotificationAvailable()) {
            console.log("LocalNotificationAdapter: cancelAll()");
            plugins.localNotification.cancelAll();
        }
    };

    return that;
})();

function goToPendingSurveys(){
    window.location = "pending-surveys.html";
}
/*
 * The conscucted HTML will have the following structure:
 *
 *  <div class = "spinner-background" id = "spinner-background"></div>
 *
 *  <div class = "spinner-container">
 *    <div class = "spinner">
 *          <img src = "img/spinner_standard.gif" class = "spinner-img"/>
 *          <a href = "cancel_redirect_url" class = "cancel-link">
 *            Cancel Loading...
 *          </a>
 *    </div>
 *  </div>
 *
 */
var Spinner = new (function(){

    /**
     * Preload spinner image.
     */
    var spinnerImage = $('<img>')
                           .attr('src', 'img/spinner.gif' + '?' + new Date().getTime())
                           .addClass('spinner-img')
                           .attr('id','spinner-img');
    var isLoading = false;

    var container = $("<div>");
    container.attr("class", "spinner-container");
    container.attr("id"   , "spinner-container");

    var spinner = $("<div>");
    spinner.attr("class", "spinner");
    spinner.attr("id"   , "spinner");


    var cancelLink = $("<a>");
    cancelLink.attr("href" , null);
    cancelLink.attr("class", "cancel_link");
    cancelLink.text("Cancel Loading...");
    cancelLink.hide();

    spinner.append(spinnerImage);
    spinner.append(cancelLink);
    container.append(spinner);

    /**
     * Dislpays a loading spinner with a cancel link on a transparent background
     * that completely covers the document.
     *
     * To hide the displayed spinner, use hide_spinner().

     */
    this.show = function(cancelCallback){

        if(isLoading){
            console.log("Spinner: show() canceled because spinner is already active.");
            return;
        }else{
            isLoading = true;
        }
        console.log("Spinner: Showing spinner.");

        //Force to reload the GIF - otherwise, the user will notice glitches. 
        $("#spinner-img").attr('src','')
                         .attr('src', 'img/spinner.gif' + "?" + new Date().getTime());
        $("#spinner-img").show();
        //Display the transparent background.
        showBackground();


        if(cancelCallback){
            cancelLink.show();
            cancelLink.onClick = function(){
                cancelCallback();
            };

        }

        $(document.body).append(container);

        //Calculate the left and top positions for the spinner div. Take into
        //account the fact that the user might have scrolled the window up or down
        //and even in that case, the div should be displayed about at the center of
        //the page.
        var spinnerTop = 140 + $(window).scrollTop() + "px";

        var spinnerLeft = $(window).scrollLeft() +
                          ($(window).width() - spinner.outerWidth()) / 2 + "px";


        //Set the top and left values for the spinner div.
        spinner.css("top" , spinnerTop);
        spinner.css("left", spinnerLeft);

    };

    var timer = null;
    var currentOrientation = null;
    var docWidth, docHeight;

    /**
     * The method resizes the translucent background image when the orientation of
     * the device changes.
     */
    var detectOrientation = function(){

        if(!window.orientation || !isLoading)
            return;

        //This is some crazy magic that I never want to visit again.
        if(currentOrientation == null || currentOrientation != window.orientation){
            var width, height, topOffset;

            if(isPortrait()){
                topOffset = 140;
                width = Math.min(docWidth, docHeight);
                height = Math.max(docWidth, docHeight);

            }else if(isLandscape()){
                topOffset = 80;
                width = Math.max(docWidth, docHeight) + 50;
                height = Math.min(docWidth, docHeight);
            }

            $("#spinner-background").width("0px").width(width + "px");
            $("#spinner-background").height("0px").height(height + "px");

            currentOrientation = window.orientation;

            var spinnerTop =  $(window).scrollTop() + topOffset + "px";
            var spinnerLeft = $(window).scrollLeft() + (width - $("#spinner").outerWidth()) / 2 + "px";

            //Set the top and left values for the spinner div.
            $("#spinner").css("top" , spinnerTop);
            $("#spinner").css("left", spinnerLeft);
        }
    };

    //Create a div tag to represent the transparent spinner background.
    var background = $(document.createElement("div"));

    background.attr("class", "spinner-background");
    background.attr("id"   , "spinner-background");

    /**
     * The method displays the spinner's transparent background. A div that covers
     * the entire document's area will be added to the document's body with the ID
     * of spinner_background.
     */
    var showBackground = function(){

        //Append the created background to the body of the
        $(document.body).append(background);

        docWidth  = $(document).width();
        docHeight = $(document).height();

        //Set the backgrounds width and height to equal to the width and height of
        //the current document.
        $("#spinner-background").width(docWidth + "px");
        $("#spinner-background").height(docHeight + "px");

        timer = setInterval(function(){
            detectOrientation();
        }, 15);

    };


    /**
     * Removes the spinner transparent background and also the loading sign with the
     * cancel link.
     */
    this.hide = function(callback){

        if(!isLoading){
            console.log("Spinner: hide() canceled because spinner is already inactive.");
            if(callback){
                callback();
                return;
            }
        }else{
            isLoading = false;
        }

        console.log("Spinner: Hiding spinner.");
        
        var fadeOutCallback = function(){
          $("#spinner-background,#spinner-container").remove();
            if(callback){
                callback();
            }  
        };
        
        cancelLink.hide();
        
        if($("#spinner-container").is(":visible") === false){
            $("#spinner-background").hide();
            $("#spinner-container").hide();
            
            fadeOutCallback();
        }else{
            $("#spinner-background").fadeOut(25);
            $("#spinner-container").fadeOut(25, fadeOutCallback());
        }

        //Cancel orientation detection timer.
        if(timer){
            clearInterval(timer);
            delete timer;
        }
    };

    function isLandscape(){
        return ( window.orientation == 90 || window.orientation == -90 );
    }

    function isPortrait(){
        return ( window.orientation == 0 || window.orientation == 180 );
    }




});/**
 * @class TouchEnabledModel
 * @author Zorayr Khalapyan
 * @version 8/9/2012
 */
var TouchEnabledItemModel = (function() {
    var self = {};

    var TOUCH_MOVE_SENSITIVITY = 15;

    self.bindClickEvents = function(item, highlightItem, onClickCallback, onMouseoverHighlightClass){
        if(typeof(onClickCallback) === "function"){
            $(item).mouseover(function(){
                $(highlightItem).addClass(onMouseoverHighlightClass);
            }).mouseout(function(){
                $(highlightItem).removeClass(onMouseoverHighlightClass);
            }).click(onClickCallback);
        }
    };

    self.bindTouchEvents = function(item, highlightItem, onTouchCallback, onTouchHighlightClass){

        self.bindClickEvents(item, function(e){
            e.preventDefault();
            return false;
        });

        var moveCounter;

        $(item).bind("touchstart", function(e){
            moveCounter = 0;
            $(highlightItem).addClass(onTouchHighlightClass);
        });

        $(item).bind("touchmove", function(e){
            if($(highlightItem).is("." + onTouchHighlightClass)){
                moveCounter++;
                var item = e.srcElement;
                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                var elm = $(item).offset();
                var x = touch.pageX - elm.left;
                var y = touch.pageY - elm.top;
                if(moveCounter > TOUCH_MOVE_SENSITIVITY || !((x < $(item).width() && x > 0) && (y < $(item).height() && y > 0))){
                    $(highlightItem).removeClass(onTouchHighlightClass);
                }
            }
        });

        $(item).bind("touchend", function(e){
            e.preventDefault();
            if(moveCounter <= TOUCH_MOVE_SENSITIVITY && $(highlightItem).is("." + onTouchHighlightClass)){
                $(highlightItem).removeClass(onTouchHighlightClass);
                if(typeof(onTouchCallback) === "function"){ onTouchCallback(e); }
            }
        });
    };

    self.bindTouchEvent = function(item, highlightItem, onTouchCallback, highlightClass){
        highlightItem = highlightItem || item;
        highlightClass = highlightClass || "pressed";
        if(DeviceDetection.isOnDevice()){
            self.bindTouchEvents(item, highlightItem, onTouchCallback, highlightClass);
        }else{
            self.bindClickEvents(item, highlightItem, onTouchCallback, highlightClass);
        }
    };

    return self;
}());
var UUIDGen = {

    generate : function(){
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }

        // Bits 12-15 of the time_hi_and_version field to 0010.
        s[14] = "4";

        // Bits 6-7 of the clock_seq_hi_and_reserved to 01.
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";

        return s.join("");
    }
}/* 
 * Original script by Josh Fraser (http://www.onlineaspect.com)
 * Continued and maintained by Jon Nylander at https://bitbucket.org/pellepim/jstimezonedetect
 *
 * Provided under the Do Whatever You Want With This Code License.
 */

/**
 * Namespace to hold all the code for timezone detection.
 */
var jstz = (function () {
    'use strict';
    var HEMISPHERE_SOUTH = 's',
        
        /** 
         * Gets the offset in minutes from UTC for a certain date.
         * @param {Date} date
         * @returns {Number}
         */
        get_date_offset = function (date) {
            var offset = -date.getTimezoneOffset();
            return (offset !== null ? offset : 0);
        },
        
        get_january_offset = function () {
            return get_date_offset(new Date(2010, 0, 1, 0, 0, 0, 0));
        },
    
        get_june_offset = function () {
            return get_date_offset(new Date(2010, 5, 1, 0, 0, 0, 0));
        },
        
        /**
         * Private method.
         * Checks whether a given date is in daylight savings time.
         * If the date supplied is after june, we assume that we're checking
         * for southern hemisphere DST.
         * @param {Date} date
         * @returns {Boolean}
         */
        date_is_dst = function (date) {
            var base_offset = ((date.getMonth() > 5 ? get_june_offset() 
                                                : get_january_offset())),
                date_offset = get_date_offset(date); 
            
            return (base_offset - date_offset) !== 0;
        },
    
        /**
         * This function does some basic calculations to create information about 
         * the user's timezone.
         * 
         * Returns a key that can be used to do lookups in jstz.olson.timezones.
         * 
         * @returns {String}  
         */
        
        lookup_key = function () {
            var january_offset = get_january_offset(), 
                june_offset = get_june_offset(), 
                diff = get_january_offset() - get_june_offset();
                
            if (diff < 0) {
                return january_offset + ",1";
            } else if (diff > 0) {
                return june_offset + ",1," + HEMISPHERE_SOUTH;
            }
            
            return january_offset + ",0";
        },
    
        /**
         * Uses get_timezone_info() to formulate a key to use in the olson.timezones dictionary.
         * 
         * Returns a primitive object on the format:
         * {'timezone': TimeZone, 'key' : 'the key used to find the TimeZone object'}
         * 
         * @returns Object 
         */
        determine_timezone = function () {
            var key = lookup_key();
            return new jstz.TimeZone(jstz.olson.timezones[key]);
        };
    
    return {
        determine_timezone : determine_timezone,
        date_is_dst : date_is_dst
    };
}());

/**
 * A simple object containing information of utc_offset, which olson timezone key to use, 
 * and if the timezone cares about daylight savings or not.
 * 
 * @constructor
 * @param {string} offset - for example '-11:00'
 * @param {string} olson_tz - the olson Identifier, such as "America/Denver"
 * @param {boolean} uses_dst - flag for whether the time zone somehow cares about daylight savings.
 */
jstz.TimeZone = (function () {
    'use strict';    
    var timezone_name = null,
        uses_dst = null,
        utc_offset = null,
        
        name = function () {
            return timezone_name;
        },
        
        dst = function () {
            return uses_dst;
        },
        
        offset = function () {
            return utc_offset;
        },
        
        /**
         * Checks if a timezone has possible ambiguities. I.e timezones that are similar.
         * 
         * If the preliminary scan determines that we're in America/Denver. We double check
         * here that we're really there and not in America/Mazatlan.
         * 
         * This is done by checking known dates for when daylight savings start for different
         * timezones.
         */
        ambiguity_check = function () {
            var ambiguity_list = jstz.olson.ambiguity_list[timezone_name],
                length = ambiguity_list.length, 
                i = 0,
                tz = ambiguity_list[0];
            
            for (; i < length; i += 1) {
                tz = ambiguity_list[i];
        
                if (jstz.date_is_dst(jstz.olson.dst_start_dates[tz])) {
                    timezone_name = tz;
                    return;
                }   
            }
        },
        
        /**
         * Checks if it is possible that the timezone is ambiguous.
         */
        is_ambiguous = function () {
            return typeof (jstz.olson.ambiguity_list[timezone_name]) !== 'undefined';
        },
        
        /**
        * Constructor for jstz.TimeZone
        */
        Constr = function (tz_info) {
            utc_offset = tz_info[0];
            timezone_name = tz_info[1];
            uses_dst = tz_info[2];
            if (is_ambiguous()) {
                ambiguity_check();
            }
        };
    
    /**
     * Public API for jstz.TimeZone
     */
    Constr.prototype = {
        constructor : jstz.TimeZone,
        name : name,
        dst : dst,
        offset : offset
    };
    
    return Constr;
}());

jstz.olson = {};

/*
 * The keys in this dictionary are comma separated as such:
 * 
 * First the offset compared to UTC time in minutes.
 *  
 * Then a flag which is 0 if the timezone does not take daylight savings into account and 1 if it 
 * does.
 * 
 * Thirdly an optional 's' signifies that the timezone is in the southern hemisphere, 
 * only interesting for timezones with DST.
 * 
 * The mapped arrays is used for constructing the jstz.TimeZone object from within 
 * jstz.determine_timezone();
 */
jstz.olson.timezones = (function () {
    "use strict";
    return {
        '-720,0'   : ['-12:00', 'Etc/GMT+12', false],
        '-660,0'   : ['-11:00', 'Pacific/Pago_Pago', false],
        '-600,1'   : ['-11:00', 'America/Adak', true],
        '-660,1,s' : ['-11:00', 'Pacific/Apia', true],
        '-600,0'   : ['-10:00', 'Pacific/Honolulu', false],
        '-570,0'   : ['-10:30', 'Pacific/Marquesas', false],
        '-540,0'   : ['-09:00', 'Pacific/Gambier', false],
        '-540,1'   : ['-09:00', 'America/Anchorage', true],
        '-480,1'   : ['-08:00', 'America/Los_Angeles', true],
        '-480,0'   : ['-08:00', 'Pacific/Pitcairn', false],
        '-420,0'   : ['-07:00', 'America/Phoenix', false],
        '-420,1'   : ['-07:00', 'America/Denver', true],
        '-360,0'   : ['-06:00', 'America/Guatemala', false],
        '-360,1'   : ['-06:00', 'America/Chicago', true],
        '-360,1,s' : ['-06:00', 'Pacific/Easter', true],
        '-300,0'   : ['-05:00', 'America/Bogota', false],
        '-300,1'   : ['-05:00', 'America/New_York', true],
        '-270,0'   : ['-04:30', 'America/Caracas', false],
        '-240,1'   : ['-04:00', 'America/Halifax', true],
        '-240,0'   : ['-04:00', 'America/Santo_Domingo', false],
        '-240,1,s' : ['-04:00', 'America/Asuncion', true],
        '-210,1'   : ['-03:30', 'America/St_Johns', true],
        '-180,1'   : ['-03:00', 'America/Godthab', true],
        '-180,0'   : ['-03:00', 'America/Argentina/Buenos_Aires', false],
        '-180,1,s' : ['-03:00', 'America/Montevideo', true],
        '-120,0'   : ['-02:00', 'America/Noronha', false],
        '-120,1'   : ['-02:00', 'Etc/GMT+2', true],
        '-60,1'    : ['-01:00', 'Atlantic/Azores', true],
        '-60,0'    : ['-01:00', 'Atlantic/Cape_Verde', false],
        '0,0'      : ['00:00', 'Etc/UTC', false],
        '0,1'      : ['00:00', 'Europe/London', true],
        '60,1'     : ['+01:00', 'Europe/Berlin', true],
        '60,0'     : ['+01:00', 'Africa/Lagos', false],
        '60,1,s'   : ['+01:00', 'Africa/Windhoek', true],
        '120,1'    : ['+02:00', 'Asia/Beirut', true],
        '120,0'    : ['+02:00', 'Africa/Johannesburg', false],
        '180,1'    : ['+03:00', 'Europe/Moscow', true],
        '180,0'    : ['+03:00', 'Asia/Baghdad', false],
        '210,1'    : ['+03:30', 'Asia/Tehran', true],
        '240,0'    : ['+04:00', 'Asia/Dubai', false],
        '240,1'    : ['+04:00', 'Asia/Yerevan', true],
        '270,0'    : ['+04:30', 'Asia/Kabul', false],
        '300,1'    : ['+05:00', 'Asia/Yekaterinburg', true],
        '300,0'    : ['+05:00', 'Asia/Karachi', false],
        '330,0'    : ['+05:30', 'Asia/Kolkata', false],
        '345,0'    : ['+05:45', 'Asia/Kathmandu', false],
        '360,0'    : ['+06:00', 'Asia/Dhaka', false],
        '360,1'    : ['+06:00', 'Asia/Omsk', true],
        '390,0'    : ['+06:30', 'Asia/Rangoon', false],
        '420,1'    : ['+07:00', 'Asia/Krasnoyarsk', true],
        '420,0'    : ['+07:00', 'Asia/Jakarta', false],
        '480,0'    : ['+08:00', 'Asia/Shanghai', false],
        '480,1'    : ['+08:00', 'Asia/Irkutsk', true],
        '525,0'    : ['+08:45', 'Australia/Eucla', true],
        '525,1,s'  : ['+08:45', 'Australia/Eucla', true],
        '540,1'    : ['+09:00', 'Asia/Yakutsk', true],
        '540,0'    : ['+09:00', 'Asia/Tokyo', false],
        '570,0'    : ['+09:30', 'Australia/Darwin', false],
        '570,1,s'  : ['+09:30', 'Australia/Adelaide', true],
        '600,0'    : ['+10:00', 'Australia/Brisbane', false],
        '600,1'    : ['+10:00', 'Asia/Vladivostok', true],
        '600,1,s'  : ['+10:00', 'Australia/Sydney', true],
        '630,1,s'  : ['+10:30', 'Australia/Lord_Howe', true],
        '660,1'    : ['+11:00', 'Asia/Kamchatka', true],
        '660,0'    : ['+11:00', 'Pacific/Noumea', false],
        '690,0'    : ['+11:30', 'Pacific/Norfolk', false],
        '720,1,s'  : ['+12:00', 'Pacific/Auckland', true],
        '720,0'    : ['+12:00', 'Pacific/Tarawa', false],
        '765,1,s'  : ['+12:45', 'Pacific/Chatham', true],
        '780,0'    : ['+13:00', 'Pacific/Tongatapu', false],
        '840,0'    : ['+14:00', 'Pacific/Kiritimati', false]
    };
}());

/**
 * This object contains information on when daylight savings starts for
 * different timezones.
 * 
 * The list is short for a reason. Often we do not have to be very specific
 * to single out the correct timezone. But when we do, this list comes in
 * handy.
 * 
 * Each value is a date denoting when daylight savings starts for that timezone.
 */
jstz.olson.dst_start_dates = (function () {
    "use strict";
    return {
        'America/Denver' : new Date(2011, 2, 13, 3, 0, 0, 0),
        'America/Mazatlan' : new Date(2011, 3, 3, 3, 0, 0, 0),
        'America/Chicago' : new Date(2011, 2, 13, 3, 0, 0, 0),
        'America/Mexico_City' : new Date(2011, 3, 3, 3, 0, 0, 0),
        'Atlantic/Stanley' : new Date(2011, 8, 4, 7, 0, 0, 0),
        'America/Asuncion' : new Date(2011, 9, 2, 3, 0, 0, 0),
        'America/Santiago' : new Date(2011, 9, 9, 3, 0, 0, 0),
        'America/Campo_Grande' : new Date(2011, 9, 16, 5, 0, 0, 0),
        'America/Montevideo' : new Date(2011, 9, 2, 3, 0, 0, 0),
        'America/Sao_Paulo' : new Date(2011, 9, 16, 5, 0, 0, 0),
        'America/Los_Angeles' : new Date(2011, 2, 13, 8, 0, 0, 0),
        'America/Santa_Isabel' : new Date(2011, 3, 5, 8, 0, 0, 0),
        'America/Havana' : new Date(2011, 2, 13, 2, 0, 0, 0),
        'America/New_York' : new Date(2011, 2, 13, 7, 0, 0, 0),
        'Asia/Gaza' : new Date(2011, 2, 26, 23, 0, 0, 0),
        'Asia/Beirut' : new Date(2011, 2, 27, 1, 0, 0, 0),
        'Europe/Minsk' : new Date(2011, 2, 27, 2, 0, 0, 0),
        'Europe/Helsinki' : new Date(2011, 2, 27, 4, 0, 0, 0),
        'Europe/Istanbul' : new Date(2011, 2, 28, 5, 0, 0, 0),
        'Asia/Damascus' : new Date(2011, 3, 1, 2, 0, 0, 0),
        'Asia/Jerusalem' : new Date(2011, 3, 1, 6, 0, 0, 0),
        'Africa/Cairo' : new Date(2010, 3, 30, 4, 0, 0, 0),
        'Asia/Yerevan' : new Date(2011, 2, 27, 4, 0, 0, 0),
        'Asia/Baku'    : new Date(2011, 2, 27, 8, 0, 0, 0),
        'Pacific/Auckland' : new Date(2011, 8, 26, 7, 0, 0, 0),
        'Pacific/Fiji' : new Date(2010, 11, 29, 23, 0, 0, 0),
        'America/Halifax' : new Date(2011, 2, 13, 6, 0, 0, 0),
        'America/Goose_Bay' : new Date(2011, 2, 13, 2, 1, 0, 0),
        'America/Miquelon' : new Date(2011, 2, 13, 5, 0, 0, 0),
        'America/Godthab' : new Date(2011, 2, 27, 1, 0, 0, 0)
    };
}());

/**
 * The keys in this object are timezones that we know may be ambiguous after
 * a preliminary scan through the olson_tz object.
 * 
 * The array of timezones to compare must be in the order that daylight savings
 * starts for the regions.
 */
jstz.olson.ambiguity_list = {
    'America/Denver' : ['America/Denver', 'America/Mazatlan'],
    'America/Chicago' : ['America/Chicago', 'America/Mexico_City'],
    'America/Asuncion' : ['Atlantic/Stanley', 'America/Asuncion', 'America/Santiago', 'America/Campo_Grande'],
    'America/Montevideo' : ['America/Montevideo', 'America/Sao_Paulo'],
    'Asia/Beirut' : ['Asia/Gaza', 'Asia/Beirut', 'Europe/Minsk', 'Europe/Helsinki', 'Europe/Istanbul', 'Asia/Damascus', 'Asia/Jerusalem', 'Africa/Cairo'],
    'Asia/Yerevan' : ['Asia/Yerevan', 'Asia/Baku'],
    'Pacific/Auckland' : ['Pacific/Auckland', 'Pacific/Fiji'],
    'America/Los_Angeles' : ['America/Los_Angeles', 'America/Santa_Isabel'],
    'America/New_York' : ['America/Havana', 'America/New_York'],
    'America/Halifax' : ['America/Goose_Bay', 'America/Halifax'],
    'America/Godthab' : ['America/Miquelon', 'America/Godthab']
};

var CampaignView = function ( campaignModel ) {
    var that = {};
    that.deleteCampaignHandler = function () {};
    that.openSurveyViewHandler = function () {};
    that.render = function () {
        var container = document.createElement('div');
        if (campaignModel.isRunning()) {
            container.appendChild(CampaignView.renderSurveyList(campaignModel, mwf.decorator.Menu("Available Surveys"), that.openSurveyViewHandler));
        } else {
            var errorContainer = mwf.decorator.Content('Inactive Campaign');
            errorContainer.addTextBlock('This campaign is currently inactive and does not open for participation.');
            container.appendChil(errorContainer);
        }
        container.appendChild(mwf.decorator.SingleClickButton("Delete Campaign", that.deleteCampaignHandler));
        return container;
    };
    return that;
};

CampaignView.renderSurveyList = function (campaignModel, surveyMenu, callback) {
    var openSurveyViewCallback = function (surveyID) {
        return function () {
            callback(campaignModel.getURN(), surveyID);
        };
    };
    var surveys = campaignModel.getSurveys();
    var surveyMenuItem;
    for (var i = 0; i < surveys.length; i++) {
        surveyMenuItem = surveyMenu.addMenuLinkItem(surveys[i].title, null, surveys[i].description);
        TouchEnabledItemModel.bindTouchEvent(surveyMenuItem, surveyMenuItem, openSurveyViewCallback(surveys[i].id), "menu-highlight");
    }
    return surveyMenu;
};
var CampaignsView = function (campaignsModel) {
    
    var that = {};
    
    /**
     * Callback for installing a new campaign.
     */
    var installNewCampaignHandlerCallback = function (campaignURN) {
        return function () {
            that.installNewCampaignHandler(campaignURN);
        }
    };
    
    /**
     * Callback for opening an already installed campaign.
     */
    var openMyCampaignHandlerCallback = function (campaignURN) {
        return function () {
            that.openMyCampaignHandler(campaignURN);
        };
    };
    
    that.installNewCampaignHandler = function (campaignURN) {};   
    that.openMyCampaignHandler = function (campaignURN) {};
    that.refreshCampaignsListHandler = function () {};
    
    /**
     * Displays a list of installed campaigns.
     */
    that.renderMyCampaigns = function () {
        var myCampaignsMenu = mwf.decorator.Menu("My Campaigns"),
            installedCampaigns = campaignsModel.getInstalledCampaigns(),
            campaignModel,
            campaignMenuItem;
        for (var campaignURN in installedCampaigns) {
            campaignModel = installedCampaigns[campaignURN];
            //Ignore inactive campaigns.
            if (campaignModel.isRunning()) {
                campaignMenuItem = myCampaignsMenu.addMenuLinkItem(campaignModel.getName());
                TouchEnabledItemModel.bindTouchEvent(campaignMenuItem, campaignMenuItem, openMyCampaignHandlerCallback(campaignURN), "menu-highlight");
            }
        }
        return myCampaignsMenu;
    };
    
    that.renderAvailableCampaigns = function () {
        var container = document.createElement("div"),
            availableCampaignsMenu = mwf.decorator.Menu("Available Campaigns"),
            availableCampaigns = campaignsModel.getAvailableCampaigns(),
            campaignModel,
            campaignMenuItem;
        for (var campaignURN in availableCampaigns) {
            campaignModel = availableCampaigns[campaignURN];
            //Ignore inactive campaigns.
            if (campaignModel.isRunning()) {
                campaignMenuItem = availableCampaignsMenu.addMenuLinkItem(campaignModel.getName());
                TouchEnabledItemModel.bindTouchEvent(campaignMenuItem, campaignMenuItem, installNewCampaignHandlerCallback(campaignURN), "menu-highlight");
            }
        }
        $(availableCampaignsMenu).find("a").css('background', "url('img/plus.png') no-repeat 95% center");
        container.appendChild(availableCampaignsMenu);
        container.appendChild(mwf.decorator.SingleClickButton("Refresh Campaigns", that.refreshCampaignsListHandler));
        return container;
    };
    
    return that;
};var ChangeServerView = function( servers ) {
    
    var that = {};
    
    /**
     * Handler for the save button. Should be implemented in the controller.
     */
    that.saveButtonHandler = function() {};
    
    that.render = function( ) {
        var form = mwf.decorator.Form("Available Servers");
        var select = document.createElement("select");
        for( var i = 0; i < servers.length; i++ ){
            var option = document.createElement('option');
            option.value = servers[i];
            option.innerHTML = servers[i];
            select.appendChild(option);
            if( servers[i] === ConfigManager.getServerEndpoint() ){
                option.selected = "selected";
            }
        }
        form.addLabel("Server Endpoint");
        form.addItem( select );
        that.getSelectedServer = function(){
            return select.options[ select.selectedIndex ].value;
        };
        form.addInputButton( "Save Selection", that.saveButtonHandler );
        return form;
    };

    return that;    
};

var HelpMenuView = function(sections){
    var self = {};
    self.render = function(){
        var menu = mwf.decorator.Menu('Help Menu');
        var menuItem; 
        var openHelpSectionCallback = function(index){
            return function(){
                PageNavigation.openHelpSectionView(index);
            }
        };
        for(var i = 0; i < sections.length; i++){
            menuItem = menu.addMenuLinkItem(sections[i].title, null, null);
            TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, openHelpSectionCallback(i), "menu-highlight");   
        }
        return menu;
    };
    return self;
};
var HelpSectionView = function (section) {
    var that = {};
    that.render = function () {
        var image, textBlock, div, container;
        image = document.createElement('img');
        image.className = "help-section-image";
        image.src = section.img;
        textBlock = document.createElement('p');
        textBlock.className = "help-section-text";
        textBlock.innerHTML = section.text || "";
        div = document.createElement('div');
        div.className = "help-section-container";
        div.appendChild(image);
        div.appendChild(textBlock);
        container = mwf.decorator.Content(section.title);
        container.addItem(div);
        return container;
    };  
    return that;
};
var ProfileView = function( ) {
    
    var that = {};
    
    that.changePasswordHandler = function() {};
    that.clearCustomizedChoicesHandler = function() {};
    that.enableGpsHandler = function() {};
    that.disableGpsHandler = function() {};
    that.logoutAndClearDataHandler = function() {};
    
    that.render = function() {
        var menu = mwf.decorator.Menu( auth.getUsername() );
        
        var changePasswordMenuItem = menu.addMenuLinkItem('Change Password', null, 'Easily change your password.');
        TouchEnabledItemModel.bindTouchEvent(changePasswordMenuItem, changePasswordMenuItem, that.changePasswordHandler, "menu-highlight");
        var clearCustomChoicesMenuItem = menu.addMenuLinkItem('Clear Customized Choices', null, "Erase any saved custom choices.");
        TouchEnabledItemModel.bindTouchEvent(clearCustomChoicesMenuItem, clearCustomChoicesMenuItem, that.clearCustomizedChoicesHandler, "menu-highlight");
        
        if( !ConfigManager.getGpsEnabled() ) {
            var enableGpsMenuItem = menu.addMenuLinkItem('Enable GPS Acquisition', null, "By enabling GPS acquisition, all uploaded surveys will be geotaged with your current location.");
            TouchEnabledItemModel.bindTouchEvent( enableGpsMenuItem, enableGpsMenuItem, that.enableGpsHandler, "menu-highlight");
        } else {
            var disableGpsMenuItem = menu.addMenuLinkItem('Disable GPS Acquisition', null, "By disabling GPS acquisition, uploaded surveys will not include GPS location.");
            TouchEnabledItemModel.bindTouchEvent( disableGpsMenuItem, disableGpsMenuItem, that.disableGpsHandler, "menu-highlight");
        }
        
        var logoutMenuItem = menu.addMenuLinkItem('Logout and Clear Data', null, "When you logout, all the data stored on the phone will be completely erased.");
        TouchEnabledItemModel.bindTouchEvent(logoutMenuItem, logoutMenuItem, that.logoutAndClearDataHandler, "menu-highlight");
        return menu;
    };
    
    return that;
};
var PromptView = function ( promptModel ) {

    var that = {};
    
    /**
     * Returns true if rendering for the current prompt is supported.
     * @return true if rendering for the current prompt is supported; false,
     *         otherwise.
     */
    that.renderSupported = function(){
       return typeof handlers[prompt.getType()] === 'function';
    };

    /**
     *
     */
    that.render = function() {
        return (this.renderSupported())? handlers[prompt.getType()](prompt) :
                                         handlers.unsupported(prompt);
    };
    
    return that;
};

PromptView.createChoiceMenu = function (promptModel, isSingleChoice, isCustom) {

    var properties = promptModel.getProperties();

    var menu = mwf.decorator.Menu(promptModel.getText());

    for (var i = 0; i < properties.length; i += 1) {

        //Handle single choice prompts.
        if(isSingleChoice){
            menu.addMenuRadioItem(prompt.getID(),        //Name
                                    properties[i].key,     //Value
                                    properties[i].label);  //Label

        //Handle multiple choice prompts.
        } else {
            menu.addMenuCheckboxItem(prompt.getID(),       //Name
                                        properties[i].key,    //Value
                                        properties[i].label); //Label
        }

    }


    prompt.getResponse = function(){

        //If the prompt type allows custom choice, then extract the value
        //of the user selection instead of the provided answer key.
        var type = (isCustom) ? 'label' : 'value';

        //Handle single choice answers.
        if(isSingleChoice){
            return (menu.getSelectedOptions())[0][type];

        //Handle multiple choice answers.
        } else {
            var responses = [];
            var selection = menu.getSelectedOptions();

            for(var i = 0; i < selection.length; i++){
                responses.push(selection[i][type]);
            }

            return responses;
        }

    };

    return menu;

};

var createCustomChoiceMenu = function(prompt, choice_menu, isSingleChoice){

    //Add an option in the menu for creating new options.
    choice_menu.addMenuIconItem('Add custom option', null, 'img/plus.png');

    choice_menu.getLastMenuItem().onclick = function(){
        form.style.display = 'block';
    };

    //Create the form for allowing the user to add a new option.
    var form = mwfd.Form('Custom Choice');

    //By default the custom choice form is hidden.
    form.style.display = 'none';

    //Add a new text box input field for specifying the new choice.
    form.addTextBox('new-choice', 'new-choice');

    var hideCustomChoiceMenu = function(){
        //Hide the 'add option button'.
        form.style.display = 'none';

        //Clear the user input textbox.
        document.getElementById('new-choice').value = "";

    };

    var addProperty = function(){

        //Get the value specified by the user.
        var newChoice = document.getElementById('new-choice').value;

        if(newChoice.length == 0){
            MessageDialogController.showMessage('Please specify an option to add.');
            return false;
        }

        //Create a new property with the value specified.
        var prop = prompt.addProperty(newChoice);

        //If the property is invalid, alert the user and cancel the add.
        if(!prop){
            MessageDialogController.showMessage('Option with that label already exists.');
            return false;
        }

        var addOptionItem = choice_menu.getLastMenuItem();

        choice_menu.removeMenuItem(addOptionItem);

        //Depending on if the choices are single-choice or multiple-choice,
        //add either a radio button menu item or a checkbox menu item.
        if(isSingleChoice){
            choice_menu.addMenuRadioItem(prompt.getID(), prop.key, prop.label);
        }else{
            choice_menu.addMenuCheckboxItem(prompt.getID(), prop.key, prop.label);
        }

        hideCustomChoiceMenu();

        choice_menu.addMenuItem(addOptionItem, true);

        return true;
    };

    form.addInputButton('Create New Choice', addProperty);
    form.addInputButton('Cancel', hideCustomChoiceMenu);

    //Cancel's form's default action to prevent the page from refreshing.
    $(form).submit(function(e){
        addProperty();
        e.preventDefault();
        return false;
    });

    //This continer will hold both prexisting options and the new option
    //form.
    var container = document.createElement('div');
    container.appendChild(choice_menu);
    container.appendChild(form);
    return container;
};

PromptView.renderMultiChoicePrompt = function (promptModel, isCustom) {

    var choiceMenu = PromptView.createChoiceMenu(promptModel, false, isCustom);

    promptModel.isValid = function () {

        if (choiceMenu.getSelectedOptions().length === 0) {
            promptModel.setErrorMessage("Please select an option.");
            return false;
        }

        return true;
    };

    return choiceMenu;
};

PromptView.renderNumberPrompt = (function () {
    
    /**
     * This value determines the range that will default to number picker.
     */
    var MAX_RANGE_FOR_NUMBER_PICKER = 20;
    
    /**
     * Returns the default value for number prompts. If the default value for
     * the current prompt is not specified, then the method will use the minimum
     * value. If this is also null then zero will be returned.
     * @return Default value that should be used for number prompts.
     */
    var getNumberPromptDefaultValue = function (promptModel) {
        if (promptModel.getDefaultValue() !== null) {
            return promptModel.getDefaultValue();
        } else if (promptModel.getMinValue() !== null) {
            return promptModel.getMinValue();
        } else {
            return 0;
        }
    };
    
    var createNumberPicker = function (promptModel, defaultValue) {

        //Create the actual number counter field.
        var count = document.createElement('p');
        count.className = 'number-counter';

        count.innerHTML = defaultValue || getNumberPromptDefaultValue(prompt);

        //Get the minimum and maximum allowed values for this number prompt. It
        //is assumed that these values might be nulls.
        var maxValue = promptModel.getMaxValue();
        var minValue = promptModel.getMinValue();

        //Create the plus sign.
        var plus = document.createElement('p');
        plus.innerHTML = '+';

        //Create the minus sign.
        var minus = document.createElement('p');
        minus.innerHTML = '-';

        //Either disables or enables the +/- depending on if the value is below
        //or above the allowed range.
        var updateSignStyle = function(){

            //Get the integerer representation of the current value.
            var currentValue = parseInt(count.innerHTML, 10);

            plus.className = (currentValue < maxValue)? 'math-sign plus' :
                                                        'math-sign-disabled plus';

            minus.className = (currentValue > minValue)? 'math-sign minus' :
                                                            'math-sign-disabled minus';
        };

        updateSignStyle();

        var menu = mwfd.Menu(prompt.getText());

        //Add the plus sign to the menu and configure the click event handler
        //for this item.
        var menuPlusItem = menu.addMenuItem(plus);
        var addCallback = function(e){
            var currentValue = parseInt(count.innerHTML, 10);
            if(currentValue < maxValue){
                count.innerHTML =  currentValue + 1;
            }
            updateSignStyle();
        };

        //Add the counter for the menu.
        menu.addMenuItem(count);

        //Add the minus sign to the menu and configure the click event handler
        //for this item.
        var menuMinusItem = menu.addMenuItem(minus);
        var subtractCallback = function () {
            var currentValue = parseInt(count.innerHTML, 10);
            if(currentValue > minValue){
                count.innerHTML =  currentValue - 1;
            }
            updateSignStyle();
        };

        promptModel.getResponse = function () {
            return parseInt(count.innerHTML, 10);
        };

        promptModel.isValid = function () {
            return true;
        };

        TouchEnabledItemModel.bindTouchEvent(menuPlusItem, plus, addCallback);
        TouchEnabledItemModel.bindTouchEvent(menuMinusItem, minus, subtractCallback);

        var container = document.createElement('div');
        container.appendChild(mwfd.SingleClickButton("Switch to Number Input", function(){
            container.innerHTML = "";
            container.appendChild(createNumberInput(promptModel.getResponse()));
        }));
        container.appendChild(menu);
        return container;
    };

    var createNumberInput = function (promptModel, defaultValue) {

        var minValue = promptModel.getMinValue();
        var maxValue = promptModel.getMaxValue();

        var rangeMessage = "Please enter a number between " + minValue + " and " + maxValue + ", inclusive.";

        var isValueInRange = function (inputString) {
            if(inputString === ""){return false;}
            var input = parseInt(inputString, 10);
            return (minValue <= input && input <= maxValue);
        };

        var isInteger = function (s) {
            return String(s).search (/^(\+|-)?\d+\s*$/) !== -1
        };

        var isSign = function (s) {
            return String(s).search (/^(\+|-)?$/) !== -1
        };

        var validateNumberInputKeyPress = function(evt) {

            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode( key );

            var result = (evt.target || evt.srcElement).value + key;
            var cancelKey = function () {
                theEvent.returnValue = false;
                if (theEvent.preventDefault) {
                    theEvent.preventDefault();
                }
            };

            if (!isSign(result)) {
                if (!isInteger(key)) {
                    cancelKey();
                }
            }

        };

        var textBox = document.createElement('input');
        textBox.value = defaultValue || getNumberPromptDefaultValue(promptModel);
        textBox.onkeypress = validateNumberInputKeyPress;

        var form = mwfd.Form(prompt.getText());
        form.addLabel(rangeMessage);
        form.addItem(textBox);

        promptModel.isValid = function () {
            if (!isValueInRange(textBox.value)) {
                promptModel.setErrorMessage(rangeMessage);
                return false;
            }
            return true;
        };

        promptModel.getResponse = function () {
            return parseInt(textBox.value, 10);
        };

        var container = document.createElement('div');
        container.appendChild(mwfd.SingleClickButton("Switch to Number Picker", function () {
           container.innerHTML = "";
           container.appendChild(createNumberPicker(promptModel, (isValueInRange(textBox.value))? promptModel.getResponse():false));
        }));
        container.appendChild(form);
        return container;

    };
    
    return function (promptModel) {
        if (promptModel.getMaxValue() - promptModel.getMinValue() <= MAX_RANGE_FOR_NUMBER_PICKER) {
            return createNumberPicker(promptModel);
        } else {
            return createNumberInput(promptModel);
        }
    };

})();


PromptView.renderPhotoPrompt = function (promptModel) {

    var container = document.createElement('div');

    var imgForm = mwf.decorator.Form('Image');
    imgForm.style.display = 'none';
    container.appendChild(imgForm);

    //This will store the image preview.
    var image = document.createElement('img');
    image.style.width = "100%";
    imgForm.addItem(image);

    //This is the method that will be called after the user takes a picture
    //or after the user uploads/selects a picture via the file input method.
    var recordImage = function (imageData, encode) {

        //Display the capture image.
        image.src =  ((encode) ? "data:image/jpeg;base64," : "") + imageData;
        imgForm.style.display = 'block';

        //Save the image and store the returned UUID within the image's
        //alt attribute.
        image.alt = SurveyResponseModel.saveImage(imageData);

    };

    //Detect PhoneGap camera support. If possible, allow the user to take a
    //photo.
    if (navigator.camera) {
        var takeImageButton = mwf.decorator.SingleClickButton(promptModel.getText(), function(){

            var onSuccess = function (imageData) {
                recordImage(imageData, true);
            }

            var onFail = function (message) {
                MessageDialogController.showMessage('Failed because: ' + message);
            }

            navigator.camera.getPicture(onSuccess, onFail, {quality: 25,
                destinationType: Camera.DestinationType.DATA_URL
            });
        });

        container.appendChild(takeImageButton);

    //Downgrade to file input form.
    } else {

        var fileInputForm = mwf.decorator.Form(promptModel.getText());

        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInputForm.addItem(fileInput);
        fileInput.onchange = function () {

            var input = this.files[0];

            if(input){
                Base64.getBase64ImageFromInput(input, function (imageData) {
                    recordImage(imageData, false);
                });
            }else{
                MessageDialogController.showMessage("Please select an image.");
            }

        }

        container.appendChild(fileInputForm);
    }


    promptModel.isValid = function () {
        if (!image.alt) {
            promptModel.setErrorMessage("Please take an image to submit.");
            return false;
        }
        return true;
    };

    promptModel.getResponse = function () {
        return image.alt;
    };

    return container;

};

PromptView.renderSingleChoicePrompt = function (promptModel, isCustom) {
    
    var choiceMenu = createChoiceMenu(promptModel, true, isCustom);

    promptModel.isValid = function () {

        if (choiceMenu.getSelectedOptions().length !== 1) {
            promptModel.setErrorMessage("Please select a single option.");
            return false;
        }
        return true;
    };
    
    return choiceMenu;
    
};
  
PromptView.renderTextPrompt = function (promptModel) {

    //Get the minimum and maximum text length allowed values for this
    //prompt. It is assumed that these values might be nulls.
    var maxValue = promptModel.getMaxValue();
    var minValue = promptModel.getMinValue();

    var form = mwf.decorator.Form(promptModel.getText());

    var textarea = document.createElement('textarea');

    form.addItem(textarea);

    promptModel.isValid = function () {
        
        //Remove any heading or trailing white space.
        textarea.value = textarea.value.replace(/^\s+|\s+$/g,"");

        //Get the length of the user input text.
        var inputLength = textarea.value.length;

        if (inputLength < minValue) {
            promptModel.setErrorMessage("Please enter text more than " + minValue + " characters in length.");
            return false;
        }

        if (inputLength > maxValue) {
            promptModel.setErrorMessage("Please enter text no longer than " + maxValue + " characters.");
            return false;
        }

        return true;
    };

    promptModel.getResponse = function () {
        //Removes white space from the response and returns it.
        return textarea.value.replace(/^\s+|\s+$/g,"");
    };

    return form;

};PromptView.renderTimestampPrompt = function (promptModel) {

    var date = new Date();
    var dateTimePicker = new DateTimePicker();
    var datePicker = dateTimePicker.createDatePicker(date);
    var timePicker = dateTimePicker.createTimePicker(date);

    promptModel.isValid = function () {

        if (!datePicker.isValid()) {
            promptModel.setErrorMessage("Please specify date in the format: YYYY-MM-DD.");
            return false;

        } else if (!timePicker.isValid()) {
            promptModel.setErrorMessage("Please specify time in the format: HH-MM.");
            return false;
        }

        return true;
    };

    promptModel.getResponse = function () {
        return datePicker.value + 'T' + timePicker.value + ":00";
    };

    return DateTimePicker.createDateTimeForm(prompt.getText(), datePicker, timePicker);

};PromptView.renderUnsupportedPrompt = function (promptModel) {

    var menu = mwf.decorator.Menu(promptModel.getText());

    menu.addMenuTextItem("Unfortunatly current prompt type is not supported.");

    promptModel.getResponse = function(){
        return SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE;
    };

    return menu;
};PromptHandler.Handlers = function(){


    var createChoiceMenu = function(prompt, isSingleChoice, isCustom){

        var properties = prompt.getProperties();

        var menu = mwfd.Menu(prompt.getText());

        for(var i = 0; i < properties.length; i++){

            //Handle single choice prompts.
            if(isSingleChoice){
                menu.addMenuRadioItem(prompt.getID(),        //Name
                                      properties[i].key,     //Value
                                      properties[i].label);  //Label

            //Handle multiple choice prompts.
            } else {
                menu.addMenuCheckboxItem(prompt.getID(),       //Name
                                         properties[i].key,    //Value
                                         properties[i].label); //Label
            }

        }


        prompt.getResponse = function(){

            //If the prompt type allows custom choice, then extract the value
            //of the user selection instead of the provided answer key.
            var type = (isCustom) ? 'label' : 'value';

            //Handle single choice answers.
            if(isSingleChoice){
                return (menu.getSelectedOptions())[0][type];

            //Handle multiple choice answers.
            } else {
                var responses = [];
                var selection = menu.getSelectedOptions();

                for(var i = 0; i < selection.length; i++){
                    responses.push(selection[i][type]);
                }

                return responses;
            }

        };

        return menu;

    };

    var createCustomChoiceMenu = function(prompt, choice_menu, isSingleChoice){

        //Add an option in the menu for creating new options.
        choice_menu.addMenuIconItem('Add custom option', null, 'img/plus.png');

        choice_menu.getLastMenuItem().onclick = function(){
            form.style.display = 'block';
        };

        //Create the form for allowing the user to add a new option.
        var form = mwfd.Form('Custom Choice');

        //By default the custom choice form is hidden.
        form.style.display = 'none';

        //Add a new text box input field for specifying the new choice.
        form.addTextBox('new-choice', 'new-choice');

        var hideCustomChoiceMenu = function(){
            //Hide the 'add option button'.
            form.style.display = 'none';

            //Clear the user input textbox.
            document.getElementById('new-choice').value = "";

        };

        var addProperty = function(){

            //Get the value specified by the user.
            var newChoice = document.getElementById('new-choice').value;

            if(newChoice.length == 0){
                MessageDialogController.showMessage('Please specify an option to add.');
                return false;
            }

            //Create a new property with the value specified.
            var prop = prompt.addProperty(newChoice);

            //If the property is invalid, alert the user and cancel the add.
            if(!prop){
                MessageDialogController.showMessage('Option with that label already exists.');
                return false;
            }

            var addOptionItem = choice_menu.getLastMenuItem();

            choice_menu.removeMenuItem(addOptionItem);

            //Depending on if the choices are single-choice or multiple-choice,
            //add either a radio button menu item or a checkbox menu item.
            if(isSingleChoice){
                choice_menu.addMenuRadioItem(prompt.getID(), prop.key, prop.label);
            }else{
                choice_menu.addMenuCheckboxItem(prompt.getID(), prop.key, prop.label);
            }

            hideCustomChoiceMenu();

            choice_menu.addMenuItem(addOptionItem, true);

            return true;
        };

        form.addInputButton('Create New Choice', addProperty);
        form.addInputButton('Cancel', hideCustomChoiceMenu);

        //Cancel's form's default action to prevent the page from refreshing.
        $(form).submit(function(e){
           addProperty();
           e.preventDefault();
           return false;
        });

        //This continer will hold both prexisting options and the new option
        //form.
        var container = document.createElement('div');
        container.appendChild(choice_menu);
        container.appendChild(form);
        return container;
    };






    this.single_choice_custom = function(prompt){
        return createCustomChoiceMenu(prompt, this.single_choice(prompt, true), true);
    };

    this.multi_choice_custom = function(prompt){
        return createCustomChoiceMenu(prompt, this.multi_choice(prompt, true), false);
    };

    this.hours_before_now = function(prompt){
        return this.number(prompt);
    };


   



    




}

var ReminderListView = function(reminders, listTitle, onReminderClickCallback){
    var self = {};
    
    self.render = function(menu){
        
        menu = menu || mwf.decorator.Menu(listTitle);
        
        var onReminderClickCallbackClosure = function(reminder){
            return function(){
                onReminderClickCallback(reminder);
            }
        };
        
        var i, title, date, time, menuItem;
        
        for(i = 0; i < reminders.length; i++){   
            title = reminders[i].getTitle();
            date  = reminders[i].getDate();
            time   = "Reminder set for " + DateTimePicker.getPaddedTime(date) + ".";
            menuItem = menu.addMenuLinkItem(title, null, time);
            TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, onReminderClickCallbackClosure(reminders[i]), "menu-highlight");
        }
        
        return menu;
        
    };
    
    return self;
};var ReminderView = function(reminder, controller){

    var self = this;

    var createSuppressionWindowSelectInput = function(){
        var select = document.createElement('select');
        select.className = "supression-window-select";
        for(var i = 1; i <= 24; i++){
            var option = document.createElement('option');
            option.value = i;
            option.innerHTML = i + " hour" + ((i != 1) ? "s" : "");
            select.appendChild(option);

            if(i === reminder.getSupressionWindow()){
                option.selected = "selected";
            }
        }
        select.getInput = function(){
            return select.options[select.selectedIndex].value;
        };
        return select;
    };

    var createReminderRecurrenceSelectInput = function(){
        var select = document.createElement('select');
        select.className = "recurrence-select";
        for(var i = 1; i < 31; i++){
            var option = document.createElement('option');
            option.value = i;
            option.innerHTML = i;
            select.appendChild(option);

            if(i === reminder.getRecurrence()){
                option.selected = "selected";
            }
        }
        select.getInput = function(){
            return select.options[select.selectedIndex].value;
        };
        return select;
    };


    var createSurveySelectInput = function(){

       var createOption = function(title, surveyID, campaignURN){
            var option = document.createElement('option');
            option.survey = {title: title, surveyID: surveyID, campaignURN: campaignURN};
            option.innerHTML = title;
            return option;
        };

        var select = document.createElement('select');
        select.className = "reminder-survey-select";
        var campaigns = Campaigns.getInstalledCampaigns();
        select.appendChild(createOption("Select a Survey to Continue"));

        for(var i = 0; i < campaigns.length; i++){
            if(campaigns[i].isRunning()){
                var surveys = campaigns[i].getSurveys();
                var campaignURN = campaigns[i].getURN();
                for(var j = 0; j < surveys.length; j++){
                    var survey = surveys[j];
                    var option = createOption(survey.title, survey.id, campaignURN);
                    if(reminder.getCampaignURN() === campaignURN && reminder.getSurveyID() === survey.id){
                        option.selected = "selected";
                    }
                    select.appendChild(option);
                }
            }
        }

        select.getInput = function(){
            return select.options[select.selectedIndex].survey;
        };
        return select;
    };

    var createTimePickerInput = function(){
        var date = reminder.getDate();
        if(date === null){
            date = new Date();
            date.setTime(date.getTime() + 10 * 60 * 1000);
        }
        var dateTimePicker = new DateTimePicker();
        var timePicker = dateTimePicker.createTimePicker(date);
        timePicker.className = timePicker.className + " time-picker-input";
        return timePicker;
    };

    var createExcludeWeekendsChecbkoxInput = function(){


        var checkbox = document.createElement('input');
        var id = UUIDGen.generate();
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', id);
        if(reminder.excludeWeekends()){
            checkbox.checked = "checked";
        }

        var label = document.createElement('label');
        label.innerHTML = "Exclude Weekends: ";
        label.setAttribute("for", id);

        var container = document.createElement('div');
        container.style.textAlign = "center";
        container.appendChild(label);
        container.appendChild(checkbox);
        container.excludeWeekends = function(){
            return checkbox.checked;
        };
        return container;
    };

    var cancel = function(){
        PageNavigation.openRemindersView();
    };

    var save = function(surveySelect, timePicker, suppressionSelect, recurrenceSelect, weekendsCheckbox){
       return function(){
            if(surveySelect.selectedIndex === 0){
                alert("Please select a survey to add a reminder.");
                return;
            }

            var survey = surveySelect.getInput();
            var date = new Date();
            date.setHours(timePicker.getHours());
            date.setMinutes(timePicker.getMinutes());
            console.log("time picker getMinutes() -- " + timePicker.getMinutes());
            console.log("date getMinutes() -- " + date.getMinutes());
            var supression = suppressionSelect.getInput();
            var recurrences = recurrenceSelect.getInput();
            var excludeWeekends = weekendsCheckbox.excludeWeekends();

            controller.save( survey.campaignURN,
                             survey.surveyID,
                             survey.title,
                             date,
                             supression,
                             recurrences,
                             excludeWeekends
                           );

            PageNavigation.openRemindersView();

       };

    };


    var deleteReminderCallback = function() {
        var confirmMessage = "Are you sure you would like to delete the reminder for " + reminder.getTitle() + "?";
        var callback = function( yes ) {
            if( yes ) {
                reminder.deleteReminder();
                PageNavigation.openRemindersView();
            }
        };
        MessageDialogController.showConfirm( confirmMessage, callback, "Yes,No" );
    };

    self.render = function() {
        var timePicker = createTimePickerInput();
        var surveySelect = createSurveySelectInput();
        var suppressionSelect = createSuppressionWindowSelectInput();
        var recurrenceSelect = createReminderRecurrenceSelectInput();
        var weekendsCheckbox = createExcludeWeekendsChecbkoxInput();

        var inputs = mwf.decorator.Form("Create New Reminder");
        inputs.addLabel("Reminder Survey");
        inputs.addItem(surveySelect);
        inputs.addLabel("Select Time");
        inputs.addItem(timePicker);
        inputs.addLabel("Suppression Window");
        inputs.addItem(suppressionSelect);
        inputs.addLabel("Recurrence (number of days)");
        inputs.addItem(recurrenceSelect);
        inputs.addLabel("Preferences");
        inputs.addItem(weekendsCheckbox);

        var saveCallback = save(surveySelect, timePicker, suppressionSelect, recurrenceSelect, weekendsCheckbox);
        var actions = document.createElement('div');
        actions.appendChild(mwf.decorator.DoubleClickButton("Cancel", cancel, "Save", saveCallback));

        if(reminder.isSaved()){
            actions.appendChild(mwf.decorator.SingleClickButton("Delete Reminder", deleteReminderCallback));
        }

        var container = document.createElement('div');
        container.appendChild(inputs);
        container.appendChild(actions);
        return container;

    };

    return self;
};var RemindersView = function(reminders){

    var self = {};
    
    var newReminderCallback = function(){
        PageNavigation.openNewReminderView();
    };
    
    var editReminderCallback = function(reminder){
        return function(){
            PageNavigation.openReminderView(reminder.getUUID());
        };
    };
    
    self.render = function(){
        
        var numInstalledCampaigns = Campaigns.getInstalledCampaignsCount();
        var menu = mwf.decorator.Menu("Available Reminders");
        
        if(numInstalledCampaigns === 0){
            var noAvailableSurveysMenuItem = menu.addMenuLinkItem("No Available Surveys", null, "Please install a campaign, to create custom reminders.");
            TouchEnabledItemModel.bindTouchEvent(noAvailableSurveysMenuItem, noAvailableSurveysMenuItem, PageNavigation.openAvailableCampaignsView, "menu-highlight"); 
        }else if(reminders.length > 0){
            var title, date, time, reminderMenuItem;
            for(var i = 0; i < reminders.length; i++){   
                title = reminders[i].getTitle();
                date  = reminders[i].getDate();
                time   = "Reminder set for " + DateTimePicker.getPaddedTime(date) + ".";
                reminderMenuItem = menu.addMenuLinkItem(title, null, time);
                TouchEnabledItemModel.bindTouchEvent(reminderMenuItem, reminderMenuItem, editReminderCallback(reminders[i]), "menu-highlight");
            }
        }else{
            var noReminderFoundMenuItem = menu.addMenuLinkItem("No Reminder Found", null, "Click to add a new reminder.");
            TouchEnabledItemModel.bindTouchEvent(noReminderFoundMenuItem, noReminderFoundMenuItem, newReminderCallback, "menu-highlight");
        }
        
        var container = document.createElement('div');
        container.appendChild(menu);
        if(numInstalledCampaigns > 0){
            container.appendChild(mwf.decorator.SingleClickButton("Add Reminder", newReminderCallback));
        }
        return container;
        
    };
    
    return self;
};

var SurveyListView = function(surveys, title, onSurveyClickCallback){
    
    var self = {};
    
    var emptyListText = "No Surveys Found";
    var emptyListDetails = null;
    var emptyListClickCallback = null;
    
    self.setEmptyListViewParameters = function(listText, listDetails, listClickCallback){
        emptyListText = listText;
        emptyListDetails = listDetails;
        emptyListClickCallback = listClickCallback;
    };
    
    self.render = function(menu){
        
        menu = menu || mwf.decorator.Menu(title);
        var menuItem;
        if(surveys.length > 0) {
            var onSurveyClickCallbackClosure = function(survey){
                return function(){
                    PageNavigation.openSurveyView(survey.getCampaign().getURN(), survey.getID());
                };
            };

            for(var i = 0; i < surveys.length; i++){
                menuItem = menu.addMenuLinkItem(surveys[i].getTitle(), null, surveys[i].getDescription());
                TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, onSurveyClickCallbackClosure(surveys[i]), "menu-highlight");   
            }
        }else if (emptyListText !== null) {
            menuItem = menu.addMenuLinkItem(emptyListText, null, emptyListDetails);
            TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, emptyListClickCallback, "menu-highlight");
        }
        
        return menu;
    };
    
    return self;
};var SurveyResponseView = function(surveyResponseController){
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
};var SurveyView = function( surveyModel ) {
    
    var that = {};
    
    that.startSurveyButtonHandler = function() {};
    
    that.renderSummary = function() {
        var content = mwf.decorator.Content();
        content.setTitle( surveyModel.getTitle() );
        content.addTextBlock( surveyModel.getDescription() );
        return content;
    };
    
    that.render = function() {
        var container = document.createElement('div');
        container.appendChild( that.renderSummary() );
        container.appendChild( mwf.decorator.SingleClickButton( "Start Survey", that.startSurveyButtonHandler ) );
        return container;
    };
    
    return that;
};var UploadQueueView = function(uploadQueueController){
    var self = {};
    
    var pendingResponses = uploadQueueController.getPendingResponses();
    
    var uploadQueueMenuTitle = "Pending Uploads";
    
    var renderEmptyUploadQueueView = function(){
        var emptyUploadQueueView = mwf.decorator.Content(uploadQueueMenuTitle);
        emptyUploadQueueView.addTextBlock('Upload queue is empty.');
        return emptyUploadQueueView;
    };
            
    self.render = function(){
        var queueMenu = mwf.decorator.Menu(uploadQueueMenuTitle);
        var onSurveyClickCallback = function(response){
            return function(){
                PageNavigation.openSurveyResponseView(response.getSurveyKey());
            };
        };
        var survey, response, details, menuItem;
        for(var uuid in pendingResponses){
            survey   = pendingResponses[uuid].survey;
            response = pendingResponses[uuid].response;
            details  = "Submitted on " + response.getSubmitDateString() + ".";
            menuItem = queueMenu.addMenuLinkItem(survey.getTitle(), null, details);
            TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, onSurveyClickCallback(response), "menu-highlight");   
        }

        var container = document.createElement('div');
        if(queueMenu.size() > 0){
            container.appendChild(queueMenu);
            container.appendChild(mwf.decorator.DoubleClickButton("Delete All", uploadQueueController.deleteAllCallback, 
                                                                  "Upload All", uploadQueueController.uploadAllCallback));
        } else {
            container.appendChild(renderEmptyUploadQueueView());
        }
        
        container.appendChild(mwf.decorator.SingleClickButton("Dashboard", PageNavigation.openDashboard));
        return container;
    };
    return self;
};