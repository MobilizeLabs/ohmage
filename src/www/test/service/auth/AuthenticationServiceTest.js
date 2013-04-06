/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 */

if (!fixture) {
    var fixture = {};
}

module("service.auth.AuthenticationService", {
    setup: function () {
        "use strict";
        fixture.serviceController = mock(ServiceController);
        fixture.serviceController.serviceCall = mockFunction();
        AuthenticationService.setServiceController(fixture.serviceController);

        //Initially the user is logged out.
        AuthenticationModel.logout();
    },

    teardown: function () {
        "use strict";
        AuthenticationService.setServiceController(ServiceController);
        delete fixture.serviceController;
    }
});

test("Test successful authentication with hashed password.", function () {
    "use strict";
    when(fixture.serviceController.serviceCall)(anything()).then(function (type, url, data, dataType, onSuccessCallback, onErrorCallback) {
        onSuccessCallback({hashed_password : "hashed-password-value"});
    });
    ///
    AuthenticationService.authenticateByHash("username", "password", function () {});
    ///
    ok(AuthenticationModel.isUserAuthenticatedByHash(), "User should be authenticated by hash after a successful authentication service call.");
    ok(AuthenticationModel.getUsername() === "username", "Saved username should equal to the username with which the user logged in.");
});

test("Test successful authentication with auth token.", function () {
    "use strict";
    when(fixture.serviceController.serviceCall)(anything()).then(function (type, url, data, dataType, onSuccessCallback, onErrorCallback) {
        onSuccessCallback({token : "auth-token-value"});
    });
    ///
    AuthenticationService.authenticateByToken("username", "password", function () {});
    ///
    ok(AuthenticationModel.isUserAuthenticatedByToken(), "User should be authenticated by auth token after a successful authentication service call.");
    ok(AuthenticationModel.getUsername() === "username", "Saved username should equal to the username with which the user logged in.");
});

test("Test failed authentication with hashed password.", function () {
    "use strict";
    when(fixture.serviceController.serviceCall)(anything()).then(function (type, url, data, dataType, onSuccessCallback, onErrorCallback) {
        onErrorCallback({errors : [ {text: "Unable to login."} ]});
    });
    ///
    AuthenticationService.authenticateByHash("username", "password", function () {});
    ///
    ok(!AuthenticationModel.isUserAuthenticatedByHash(), "User should not be authenticated by hash after a failed authentication service call.");
});

test("Test failed authentication with auth token.", function () {
    "use strict";
    when(fixture.serviceController.serviceCall)(anything()).then(function (type, url, data, dataType, onSuccessCallback, onErrorCallback) {
        onErrorCallback({errors : [ {text: "Unable to login."} ]});
    });
    ///
    AuthenticationService.authenticateByToken("username", "password", function () {});
    ///
    ok(!AuthenticationModel.isUserAuthenticatedByToken(), "User should not be authenticated by auth token after a failed authentication service call.");
});