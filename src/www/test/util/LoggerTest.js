/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 */
module("util.Logger");

test("Logger should correctly save namespace.", function () {
    "use strict";
    ///
    var log = Logger("namespace");
    ///
    strictEqual(log.getNamespace(), "namespace", "The namespace of the logger should equal to 'namespace'.");
});

test("Formatted message should prepend namespace name.", function () {
    "use strict";
    var log = Logger("namespace");
    ///
    var formattedOutput = log.info("message");
    ///
    strictEqual(formattedOutput, "namespace: message", "namespace should be prepended to the message.");
});

test("Argument insertion should work correctly.", function () {
    "use strict";
    var log = Logger("namespace");
    ///
    var formattedOutput = log.info("message $1", "test-case");
    ///
    strictEqual(formattedOutput, "namespace: message test-case", "The argument should be correctly inserted.");
});

test("Argument insertion should work correctly with several arguments.", function () {
    "use strict";
    var log = Logger("namespace");
    ///
    var formattedOutput = log.info("$1 - message - $2", "test-insertion-1", "test-insertion-2");
    ///
    strictEqual(formattedOutput, "namespace: test-insertion-1 - message - test-insertion-2", "The arguments should be correctly inserted.");
});

