/**
 * @author Zorayr Khalapyan
 * @version 5/7/13
 */
var ChangePasswordController = (function () {
    "use strict";
    var that = {};

    var onSuccess = function () {
        Spinner.hide(function () {
            AuthenticationModel.setAuthErrorState(true);
            MessageDialogController.showMessage('Your password has been successfully changed. Please login to continue.', function () {
                PageController.openAuth();
            });
        });
    };

    var onError = function (response) {
        Spinner.hide(function () {
            if (response) {
                MessageDialogController.showMessage(response.errors[0].text);
            } else {
                MessageDialogController.showMessage('Network error occurred. Please try again.');
            }
        });
    };

    var changePasswordCallback = function (username, currentPassword, newPassword) {

        Spinner.show();

        ServiceController.serviceCall(
            "POST",
            ConfigManager.getPasswordChangeUrl(),
            {
                auth_token:   AuthenticationModel.getHashedPassword(),
                client:       ConfigManager.getClientName(),
                user:         username,
                password:     currentPassword,
                new_password: newPassword

            },
            "JSON",
            onSuccess,
            onError,
            false
        );
    };

    that.getView = function () {
        var view = ChangePasswordView();
        view.changePasswordCallback = changePasswordCallback;
        return view;
    };

    return that;
}());