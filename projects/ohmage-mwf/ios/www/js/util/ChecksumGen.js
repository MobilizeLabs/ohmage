/**
 * Object for generating checksum of an object.
 * @author Zorayr Khalapyan
 * @version 4/10/13
 * @constructor
 */

var ChecksumGen = (function () {
    "use strict";

    var that = {};
    that.getChecksum = function (obj) {
        var string = JSON.stringify(obj);
        var hash = 0,
            i,
            singleCharacter;
        for (i = 0; i < string.length; i += 1) {
            singleCharacter = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + singleCharacter;
            //Convert to 32 bit integer.
            hash = hash & hash;
        }
        return hash;
    };
    return that;
}());
