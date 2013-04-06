/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */
var AuthenticationModel = (function () {
    "use strict";
    var that = {};

    /**
     * The name of the parameter that stores the authentication token.
     */
    var AUTH_TOKEN_PARAM_NAME = 'auth_token';

    /**
     * The name of the parameter that stores the hashed password.
     */
    var HASHED_PASSWORD_PARAM_NAME = 'hashed_password';

    /**
     * The name of the parameter that stores the username.
     */
    var USERNAME_PARAM_NAME = 'username';

    /**
     * The name of the parameter that stores user's authentication error state.
     * @type {string}
     */
    var AUTH_ERROR_STATE_PARAM_NAME = 'auth-error';

    /**
     * Stores credentials for the current authentication session.
     * @type {LocalMap}
     */
    var sessionMap = new LocalMap('credentials');

    /**
     * Acts both as a setter and a getter for session values. If a value is
     * specified, then the parameter will be changed to that value and returned.
     * Otherwise, the value of the parameter if any will be returned without any
     * modification.
     *
     * @param name The name of the session parameter.
     * @param [value] The value to be assigned to the parameter.
     * @returns {String}
     */
    var session = function (name, value) {
        if (value !== undefined) {
            sessionMap.set(name, value);
        }
        return sessionMap.get(name);
    };

    /**
     * Returns true if cookie or a session variable with the specified name is
     * set. The method is used for encapsulating common behavior between
     * checking user authentication in both token and hash methods.
     * @param authParameterName The name of the authentication cookie to check.
     */
    var checkAuthentication = function (authParameterName) {
        if (that.isInAuthErrorState()) {
            return false;
        }
        return session(authParameterName) !== null || $.cookie(authParameterName) !== null;
    };

    /**
     * Returns true if there is currently a logged in user.
     * @returns {boolean} True it currently a user is logged in; false,
     * otherwise.
     */
    that.isUserLocked = function () {
        return that.getUsername() !== null;
    };

    /**
     * Used to set current logged in user's authentication error state. Remember
     * that when a user is in error state, only two actions will be available:
     * (1) user logs out and logs back in, or (2) same user logs in back agai,
     * and continues without losing any data.
     *
     * @param authErrorState {Boolean} True if the user is currently in
     * authentication error state; false, otherwise.
     */
    that.setAuthErrorState = function (authErrorState) {
        session(AUTH_ERROR_STATE_PARAM_NAME, authErrorState);
    };

    /**
     * Returns true if the user is currently in error state and locked.
     * @returns {Boolean} True if the user is in authentication error state.
     */
    that.isInAuthErrorState = function () {
        return session(AUTH_ERROR_STATE_PARAM_NAME);
    };

    /**
     * Returns the authentication token if it exists, or null otherwise.
     * @return {String} The authentication token if it exists, or null otherwise.
     */
    that.getAuthToken = function () {
        //Authentication token may either have been saved as a cookie or as a
        //session parameter (i.e. localStorage).
        return session(AUTH_TOKEN_PARAM_NAME) || $.cookie(AUTH_TOKEN_PARAM_NAME);
    };

    /**
     * Returns the hashed password if it exists, or null otherwise.
     * @return The hashed password if it exists, or null otherwise.
     */
    that.getHashedPassword = function () {
        return session(HASHED_PASSWORD_PARAM_NAME);
    };

    /**
     * Logs out the currently logged in user. This method is authentication
     * method agnostic and works with both hashed and token authentication
     * methods. localStorage will be completely erased.
     */
    that.logout = function () {
        //Erase any authentication related data.
        session(AUTH_TOKEN_PARAM_NAME, null);
        session(HASHED_PASSWORD_PARAM_NAME, null);
        session(USERNAME_PARAM_NAME, null);
        session(AUTH_ERROR_STATE_PARAM_NAME, null);

        //This is the cookie tracked by unified login page.
        $.cookie("auth_token", null, {path : "/"});

        //TODO: Decouple these two lines from user authentication. Maybe in the form of event subscribers.
        ReminderModel.cancelAll();
        //window.localStorage.clear();

    };

    /**
     * Checks if the user is authorized via password hash.
     * @return {Boolean} True if the user is authenticated, false otherwise.
     */
    that.isUserAuthenticatedByHash = function () {
        return checkAuthentication(HASHED_PASSWORD_PARAM_NAME);
    };

    /**
     * Checks if the user is authenticated via auth token method.
     * @return {Boolean} True if the user is authenticated; false, otherwise.
     */
    that.isUserAuthenticatedByToken = function () {
        return checkAuthentication(AUTH_TOKEN_PARAM_NAME);
    };

    /**
     * Method agnostic authentication check - this method will return true if
     * the user is either authentication via the hashed password method or via
     * the authentication token method.
     */
    that.isUserAuthenticated = function () {
        return that.isUserAuthenticatedByHash() || that.isUserAuthenticatedByToken();
    };

    /**
     * Returns currently logged in user's username, or null if non exists.
     * @return {String} Currently logged in user's username, or null if non exists.
     */
    that.getUsername = function () {
        return session(USERNAME_PARAM_NAME);
    };

    /**
     * Sets user's username.
     * @param username The username to set.
     * @returns {String} The set username.
     */
    that.setUsername = function (username) {
        return session(USERNAME_PARAM_NAME, username);
    };

    that.setAuthToken = function (authToken, useCookie) {
        if (useCookie) {
            $.cookie(AUTH_TOKEN_PARAM_NAME, authToken, {path : "/"});
        } else {
            session(AUTH_TOKEN_PARAM_NAME, authToken);
        }
    };

    that.setHashedPassword = function (hashedPassword) {
        return session(HASHED_PASSWORD_PARAM_NAME, hashedPassword);
    };

    return that;

}());