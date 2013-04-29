/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 */

var Logger = (function () {
    "use strict";

    var ARG_INSERT_SENTINEL = "$";

    var formatOutput = function (namespace, message, args) {
        var i, argsLength, arg;
        for (i = 0, argsLength = args.length; i < argsLength; i += 1) {
            arg = args[i];
            if (typeof arg !== "string") {
                arg = JSON.stringify(arg);
            }
            message = message.replace(ARG_INSERT_SENTINEL + i, arg);
        }
        return namespace + ": " + message;
    };

    var log = function (namespace, message, args) {
        var output = formatOutput(namespace, message, args);
        console.log(output);
        return output;
    };

    var debug = function (namespace, message, args) {
        var output = formatOutput(namespace, message, args);
        console.debug(output);
        return output;
    };

    var warn = function (namespace, message, args) {
        var output = formatOutput(namespace, message, args);
        console.warn(output);
        return output;
    };

    var error = function (namespace, message, args) {
        var output = formatOutput(namespace, message, args);
        console.error(output);
        return output;
    };

    var info = function (namespace, message, args) {
        var output = formatOutput(namespace, message, args);
        console.info(output);
        return output;
    };

    return function (namespace) {
        var that = {};

        that.log = function (message) {
            return log(namespace, message, arguments);
        };

        that.debug = function (message) {
            return debug(namespace, message, arguments);
        };

        that.warn = function (message) {
            return warn(namespace, message, arguments);
        };

        that.error = function (message) {
            return error(namespace, message, arguments);
        };

        that.info = function (message) {
            return info(namespace, message, arguments);
        };

        /**
         * Returns the namespace of the current logger.
         * @returns {String} The name of the current logger.
         */
        that.getNamespace = function () {
            return namespace;
        };

        /**
         * @visibleForTesting
         */
        that.formatOutput = formatOutput;

        return that;
    };
}());