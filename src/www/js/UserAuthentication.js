
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
var UserAuthentication = function() {

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

    that.isUserLocked = function () {
        return that.getUsername() !== null;
    };

    that.setAuthErrorState = function (state) {
        session(AUTH_ERROR_STATE_COOKIE_NAME, state);
    };

    that.isInAuthErrorState = function(){
        return session(AUTH_ERROR_STATE_COOKIE_NAME);
    };

    /**
     * Returns the authentication token if it exists, or null otherwise.
     * @return The authentication token if it exists, or null otherwise.
     */
    that.getAuthToken = function(){
        return session(TOKEN_AUTH_COOKIE_NAME);
    };

    /**
     * Returns the hashed password if it exists, or null otherwise.
     * @return The hashed password if it exists, or null otherwise.
     */
    that.getHashedPassword = function(){
        return session(HASH_AUTH_COOKIE_NAME);
    };

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
    };

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
};


