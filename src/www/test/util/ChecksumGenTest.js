/**
 * @author Zorayr Khalapyan
 * @version 4/10/13
 */

module("util.ChecksumGen", {
    setup: function () {
        "use strict";
    },
    teardown: function () {
        "use strict";
    }
});

test("Test generating checksum for a string.", function () {
    "use strict";
    ///
    var checksum = ChecksumGen.getChecksum("test-string");
    ///
    ok(checksum === -1500777192, "Checksum should be deterministic and return the same value each time.");
});

test("Test generating checksum for an object.", function () {
    "use strict";
    ///
    var checksum = ChecksumGen.getChecksum({someValue : "test-string"});
    ///
    ok(checksum === 39819891, "Checksum should be deterministic and return the same value each time.");
});

test("Test generated checksum should be different for strings that are similar.", function () {
    "use strict";
    ///
    var checksum1 = ChecksumGen.getChecksum({someValue : "test-stringg"}),
        checksum2 = ChecksumGen.getChecksum({someValue : "test-strind"}),
        checksum3 = ChecksumGen.getChecksum({someValue : "test-strin"}),
        checksum4 = ChecksumGen.getChecksum({someValue : "test-strinG"});
    ///
    ok(checksum1 !== checksum2 && checksum1 !== checksum3 && checksum1 !== checksum4, "Checksums for different strings should be different.");
    ok(checksum2 !== checksum3 && checksum2 !== checksum4, "Checksums for different strings should be different.");
    ok(checksum3 !== checksum4, "Checksums for different strings should be different.");
});



