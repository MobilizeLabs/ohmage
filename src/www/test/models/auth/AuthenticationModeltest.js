/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 */

if (!fixture) {
    var fixture = {};
}

module("models.auth.AuthenticationModel", {
    setup: function () {
        "use strict";
    },

    teardown: function () {
        "use strict";
        AuthenticationModel.logout();
    }
});

test("Test user authentication in logged out state.", function () {
    "use strict";
    ///
    var isUserAuthenticated = AuthenticationModel.isUserAuthenticated();
    ///
    ok(!isUserAuthenticated, "User should not be authenticated in a logged out state.");
});

test("Test authentication by hashed password.", function () {
    "use strict";
    AuthenticationModel.setHashedPassword("hashed-password");
    ///
    var isUserAuthenticated = AuthenticationModel.isUserAuthenticated();
    ///
    ok(isUserAuthenticated, "User should be authenticated if hashed password is set.");
});

test("Test authentication by auth token (local storage version).", function () {
    "use strict";
    AuthenticationModel.setAuthToken("auth-token-value");
    ///
    var isUserAuthenticated = AuthenticationModel.isUserAuthenticated();
    ///
    ok(isUserAuthenticated, "User should be authenticated if auth token is set.");
});

test("Test authentication by auth token (cookie).", function () {
    "use strict";
    $.cookie("auth_token", "auth-token-value", {path : "/"});
    ///
    var isUserAuthenticated = AuthenticationModel.isUserAuthenticated();
    ///
    ok(isUserAuthenticated, "User should be authenticated if auth token cookie is set.");
});

test("Test authentication after logging out from auth token authentication (cookie).", function () {
    "use strict";
    $.cookie("auth_token", "auth-token-value", {path : "/"});
    ///
    AuthenticationModel.logout();
    ///
    ok(!AuthenticationModel.isUserAuthenticated(), "User should not be authenticated after logging out.");
});

test("Test authentication after logging out from auth token authentication (local storage).", function () {
    "use strict";
    AuthenticationModel.setAuthToken("auth-token-value");
    ///
    AuthenticationModel.logout();
    ///
    ok(!AuthenticationModel.isUserAuthenticated(), "User should not be authenticated after logging out.");
});

test("Test authentication after logging out from hashed password authentication.", function () {
    "use strict";
    AuthenticationModel.setHashedPassword("hashed-password");
    ///
    AuthenticationModel.logout();
    ///
    ok(!AuthenticationModel.isUserAuthenticated(), "User should not be authenticated after logging out.");
});

test("Test authentication error state detection (when in error state).", function () {
    "use strict";
    AuthenticationModel.setAuthErrorState(true);
    ///
    var isInAuthErrorState = AuthenticationModel.isInAuthErrorState();
    ///
    ok(AuthenticationModel.isInAuthErrorState(), "User should be in authentication error state if the state was set to true.");
});

test("Test authentication error state detection (when not in error state).", function () {
    "use strict";
    AuthenticationModel.setAuthErrorState(false);
    ///
    var isInAuthErrorState = AuthenticationModel.isInAuthErrorState();
    ///
    ok(!AuthenticationModel.isInAuthErrorState(), "User should not be in authentication error state if the state was set to false.");
});

test("Test user's locked state when the username is set.", function () {
    "use strict";
    AuthenticationModel.setUsername("test-username");
    ///
    var isUserLocked = AuthenticationModel.isUserLocked();
    ///
    ok(isUserLocked, "User should be in a locked state when the username field is set.");
});

test("Test user's locked state when the username is not set.", function () {
    "use strict";
    ///
    var isUserLocked = AuthenticationModel.isUserLocked();
    ///
    ok(!isUserLocked, "User should not be in a locked state when the username field is not set.");
});