/**
 * @author Zorayr Khalapyan
 * @version 4/8/13
 */

var AuthView = function () {
    "use strict";
    var that = AbstractView();

    /**
     * Caches the loaded HTML view.
     * @type {String}
     */
    var view = null;

    /**
     * The URL to load the HTML.
     * @type {string}
     */
    var VIEW_URL = "./views/auth/auth-view.html";

    /**
     * Returns true if the input received from the user is not empty.
     * @returns {boolean} True if the user has completed all required fields.
     */
    var isInputValid = function () {

        if ($('#username').val().length === 0 && $('#password').val().length === 0) {
            MessageDialogController.showMessage('Please enter your username and pass word.', function () {
                $('#username').focus();
            });
            return false;
        }

        if ($('#username').val().length === 0) {
            MessageDialogController.showMessage('Please enter your username.', function () {
                $('#username').focus();
            });
            return false;
        }

        if ($('#password').val().length === 0) {
            MessageDialogController.showMessage('Please enter your password.', function () {
                $('#password').focus();
            });
            return false;
        }

        return true;
    };

    var encloseHTMLResponse = function (htmlResponse) {
        var div = document.createElement("div");
        div.innerHTML = htmlResponse;
        return div;
    };

    var loginCallback = function () {

        if (!isInputValid()) {
            return;
        }

        var username = $("#username").val();
        var password = $("#password").val();

        Spinner.show();

        //On successful authentication, redirects the user to the dashboard.
        auth.authenticateByHash(username, password, function (success, response) {

            Spinner.hide(function () {
                if (success) {
                    PageNavigation.openDashboard();
                } else if (response) {
                    MessageDialogController.showMessage(response);
                } else {
                    MessageDialogController.showMessage("Unable to login. Please try again.");
                }
            });

        }, false);
    };

    that.initializeView = function (onSuccessCallback) {
        if (view === null) {
            PageViewService.loadPageView(VIEW_URL, function (response) {
                //Save the view, and invoke the callback to notify that the
                //initialization process is complete.
                view = encloseHTMLResponse(response);
                console.log(view);
                view.getElementByID("auth-form").onsubmit(function (e) {
                    e.preventDefault();
                    loginCallback();
                    return false;
                });
                onSuccessCallback();
            });
        } else {
            onSuccessCallback();
        }
    };

    that.render = function () {
        return view;
    };

    return that;
};
