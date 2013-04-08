/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */
var AuthenticationController = (function () {
    "use strict";
    var that = {};

    /**
     * This is the regular expression for the password string. The password
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

    /**
     * Message that indicates the requirements of a valid password. This is the
     * error message given to the user on failed login.
     * @type {string}
     */
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

    that.getPasswordRequirements = function () {
        return PASSWORD_REQUIREMENTS;
    };

    that.isPasswordValid = function (password) {
        return (new RegExp(PLAINTEXT_PASSWORD_PATTERN_STRING)).test(password);
    };

    that.logoutUser = function () {
        var confirmationMessage = "All data will be lost. Are you sure you would like to proceed?";
        MessageDialogController.showConfirm(confirmationMessage, function (yes) {
            if (yes) {
                AuthenticationModel.logout();
            }
        }, "Yes,No");
    };

    that.failsCheckpoint = function () {
        return !that.isUserAuthenticated() || that.isInAuthErrorState();
    };

    that.getView = function () {
        return AuthView();
    };

    return that;
}());