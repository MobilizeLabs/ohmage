/**
 * @author Zorayr Khalapyan
 * @version 4/7/13
 */

var ChangePasswordView = function () {
    "use strict";
    var that = AbstractView();

    /**
     * Caches the generated DOM fragment for password change.
     * @type {String}
     */
    var view = null;

    var usernameField;

    var currentPasswordField;

    var newPasswordField;

    var newPasswordConfirmationField;

    var getUsername = function () {
        return usernameField.value;
    };

    var getCurrentPassword = function () {
        return currentPasswordField.value;
    };

    var getNewPassword = function () {
        return newPasswordField.value;
    };

    var getNewPasswordConfirmation = function () {
        return newPasswordConfirmationField.value;
    };

    var isInputEmpty = function (inputField, inputName) {
        var userInput = inputField.value;
        if (userInput.length === 0) {
            MessageDialogController.showMessage('Please enter your ' + inputName + '.', function () {
                inputField.focus();
            });
            return true;
        }
        return false;
    };

    /**
     * Returns true if the input received from the user is not empty.
     * @returns {boolean} True if the user has completed all required fields.
     */
    var isInputComplete = function () {

        return !(isInputEmpty(usernameField, "username")
                || isInputEmpty(currentPasswordField, "current password")
                || isInputEmpty(newPasswordField, "new password")
                || isInputEmpty(newPasswordConfirmationField, "new password confirmation"));

    };

    /**
     * Returns true if the new password matches the new password confirmation.
     * @returns {boolean} True if the new password matches the confirmation.
     */
    var isValidPasswordConfirmation = function () {
        return getNewPassword() === getNewPasswordConfirmation();
    };

    /**
     * Returns true if the new password matches all the requirements.
     * @returns {boolean} True if the new password is valid.
     */
    var isNewPasswordValid = function () {
        if (!AuthenticationController.isPasswordValid(getNewPassword())) {
            MessageDialogController.showMessage(AuthenticationController.getPasswordRequirements());
            newPasswordField.focus();
            return false;
        }
        return true;
    };

    /**
     * Invokes the change password callback if the user has entered all the
     * required information.
     */
    var changePasswordCallbackWrapper = function () {
        if (isInputComplete() && isNewPasswordValid()) {
            if (isValidPasswordConfirmation()) {
                that.changePasswordCallback(getUsername(), getCurrentPassword(), getNewPassword());
            } else {
                MessageDialogController.showMessage("Please enter matching password confirmation.", function () {
                    newPasswordConfirmationField.focus();
                });
            }
        }
    };

    /**
     * Controller should override this function in order to process the
     * password change.
     * @param username User's username.
     * @param currentPassword User's current password.
     * @param newPassword User's new password.
     */
    that.changePasswordCallback = function (username, currentPassword, newPassword) {};

    that.initializeView = function (onSuccessCallback) {
        if (view === null) {

            usernameField = document.createElement('input');

            if (AuthenticationModel.getUsername() !== null) {
                usernameField.value = AuthenticationModel.getUsername();
                usernameField.readonly = true;
            }

            currentPasswordField = document.createElement('input');
            currentPasswordField.type = "password";

            newPasswordField = document.createElement('input');
            newPasswordField.type = "password";

            newPasswordConfirmationField = document.createElement('input');
            newPasswordConfirmationField.type = "password";


            view = mwf.decorator.Form("Please Login");
            view.addLabel("Username");
            view.addItem(usernameField);
            view.addLabel("Current Password");
            view.addItem(currentPasswordField);
            view.addLabel("New Password");
            view.addItem(newPasswordField);
            view.addLabel("New Password Confirmation");
            view.addItem(newPasswordConfirmationField);
            view.addSubmitButton("Change Password");

            view.setOnSubmitCallback(changePasswordCallbackWrapper);
        }

        //Clear saved values because of DOM caching.
        currentPasswordField.value = "";
        newPasswordField.value = "";
        newPasswordConfirmationField.value = "";

        onSuccessCallback();

    };

    that.render = function () {
        return view;
    };

    return that;
};

