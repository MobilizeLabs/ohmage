/**
 * @author Zorayr Khalapyan
 * @version 4/8/13
 */

var AuthView = function () {
    "use strict";
    var that = AbstractView();

    /**
     * Caches the generated DOM fragment for user's authentication view.
     * @type {String}
     */
    var view = null;

    var usernameField;

    var passwordField;

    var getUsername = function () {
        return usernameField.value;
    };

    var getPassword = function () {
        return passwordField.value;
    };

    /**
     * Returns true if the input received from the user is not empty.
     * @returns {boolean} True if the user has completed all required fields.
     */
    var isInputComplete = function () {

        var username = getUsername();
        var password = getPassword();

        if (username.length === 0 && password.length === 0) {
            MessageDialogController.showMessage('Please enter your username and password.', function () {
                usernameField.focus();
            });
            return false;
        }

        if (username.length === 0) {
            MessageDialogController.showMessage('Please enter your username.', function () {
                usernameField.focus();
            });
            return false;
        }

        if (password.length === 0) {
            MessageDialogController.showMessage('Please enter your password.', function () {
                passwordField.focus();
            });
            return false;
        }

        return true;
    };

    /**
     * Invokes the login callback if the user has entered all the required
     * information.
     */
    var loginCallbackWrapper = function () {
        if (isInputComplete()) {
            that.loginCallback(getUsername(), getPassword());
        }
    };

    /**
     * Controller should override this function in order to process the
     * username and password entered by the user.
     * @param username User's username.
     * @param password User's password.
     */
    that.loginCallback = function (username, password) {};

    that.initializeView = function (onSuccessCallback) {
        if (view === null) {

            usernameField = document.createElement('input');
            passwordField = document.createElement('input');
            passwordField.type = "password";

            view = mwf.decorator.Form("Please Login");
            view.addLabel("Username");
            view.addItem(usernameField);
            view.addLabel("Password");
            view.addItem(passwordField);
            view.addSubmitButton("Secure Login");

            view.setOnSubmitCallback(loginCallbackWrapper);
        }

        if (AuthenticationModel.isUserLocked()) {
            usernameField.value = AuthenticationModel.getUsername();
            usernameField.disabled = true;
        } else {
            usernameField.disabled = false;
            usernameField.value = "";
        }

        passwordField.value = "";

        onSuccessCallback();

    };

    that.render = function () {
        return view;
    };

    return that;
};
