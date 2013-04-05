var ProfileController = function () {
    "use strict";

    var that = {};

    var profileView = ProfileView();

    profileView.changePasswordHandler = function () {
        PageNavigation.openChangePasswordPage();
    };

    profileView.enableGpsHandler = function () {
        ConfigManager.setGpsEnabled(true);
        PageController.refresh();
    };

    profileView.disableGpsHandler = function () {
        ConfigManager.setGpsEnabled(false);
        PageController.refresh();
    };

    profileView.clearCustomizedChoicesHandler = function () {
        var confirmMessage = "Are you sure you would like to clear all your custom choices?";
        var confirmButtonLabels = "Yes,No";
        var confirmCallback = function (confirmed) {
            if (confirmed) {
                CustomPropertiesVault.deleteAllCustomProperties();
                MessageDialogController.showMessage("All custom choices have been cleared.");
            }
        };
        MessageDialogController.showConfirm(confirmMessage, confirmCallback, confirmButtonLabels);
    };

    profileView.logoutAndClearDataHandler = function () {
        if (auth.logout()) {
            PageNavigation.openAuthenticationPage();
        }
    };

    that.getView = function () {
        return profileView;
    };

    return that;
};