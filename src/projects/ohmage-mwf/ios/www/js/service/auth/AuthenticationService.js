/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */
var AuthenticationService = (function () {
    "use strict";
    var that = {};

    /**
     * Decoupled for testability.
     * @type {ServiceController}
     */
    var serviceController = ServiceController;

    /**
     * Endpoint for user authentication via authentication token.
     */
    var AUTH_TOKEN_URL = '/app/user/auth_token';

    /**
     * Endpoint for user authentication via hash password.
     */
    var HASHED_PASSWORD_AUTH_URL = '/app/user/auth';

    /**
     * Function invoked when either of the authentication methods succeeds.
     * @param username The username of the user that logged in.
     */
    var onSuccessfulAuthentication = function (username) {
        //Clear the user from the authentication sate error if any.
        AuthenticationModel.setAuthErrorState(false);
        AuthenticationModel.setUsername(username);
    };

    /**
     * Callback closure invoked when the user fails authentication via both
     * authentication methods.
     *
     * @param onErrorCallback The
     * @returns {Function}
     */
    var onErrorCallbackClosure = function (onErrorCallback) {
        return function (response) {
            onErrorCallback(false, response ? response.errors[0].text : null);
        };
    };

    var onHashedPasswordSuccessCallbackClosure = function (username, callback) {
        return function (response) {
            AuthenticationModel.setHashedPassword(response.hashed_password);
            onSuccessfulAuthentication(username);
            callback(true);
        };
    };

    var onAuthTokenSuccessCallbackClosure = function (username, useCookieStorage, callback) {
        return function (response) {
            AuthenticationModel.setAuthToken(response.token);
            onSuccessfulAuthentication(username);
            callback(true);
        };
    };

    /**
     * Authenticates the user via the hashed password method and if the
     * authentication was successful, invokes the callback method with a single
     * boolean argument true; otherwise, invokes the callback with two arguments
     * (false, "error explanation"). If the user is already authenticated via
     * the hashed password method, the callback will be invoked immediately.
     *
     * @param username User's username.
     * @param password User's password.
     * @param callback Invoked on authentication check.
     */
    that.authenticateByHash = function (username, password, callback) {

        if (AuthenticationModel.isUserAuthenticatedByHash()) {
            callback(true);

        } else {
            //Make an API call since the user is not authenticated by hashed
            //password.
            serviceController.serviceCall(
                "POST",
                HASHED_PASSWORD_AUTH_URL,
                {
                    user : username,
                    password: password,
                    client: '1'
                },
                'JSON',
                onHashedPasswordSuccessCallbackClosure(username, callback),
                onErrorCallbackClosure(callback)
            );
        }
    };

    /**
     * Checks if the user is authenticated via the auth token method. If
     * the authentication was successful, then the callback method will be
     * invoked with a single boolean argument true, otherwise callback will be
     * invoked with arguments (false, error explanation).
     *
     * @param username User's username.
     * @param password User's password.
     * @param callback Invoked when authentication completes.
     * @param useCookieStorage if set to true, the auth_token will be saved as a
     * cookie.
     */
    that.authenticateByToken = function (username, password, callback, useCookieStorage) {
        if (AuthenticationModel.isUserAuthenticatedByToken()) {
            callback(true);

        } else {
            //Make an API call.
            serviceController.serviceCall(
                "POST",
                AUTH_TOKEN_URL,
                {
                    user : username,
                    password: password,
                    client: '1'
                },
                'JSON',
                onAuthTokenSuccessCallbackClosure(username, useCookieStorage, callback),
                onErrorCallbackClosure(callback)
            );
        }
    };

    /**
     * Allows setting a mocked version of the service controller for testing.
     * @visibleForTesting
     * @param newServiceController The service controller to use to communicate
     * with the server.
     */
    that.setServiceController = function (newServiceController) {
        serviceController = newServiceController;
    };

    return that;
}());