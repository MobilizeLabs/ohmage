/**
 * @author Zorayr Khalapyan
 * @version 4/10/13
 */

var ChecksumGen = (function () {
    "use strict";

    var that = {};
    that.getChecksum = function (obj) {
        var string = JSON.stringify(obj);
        var hash = 0,
            i,
            char;
        for (i = 0; i < string.length; i += 1) {
            char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            //Convert to 32 bit integer.
            hash = hash & hash;
        }
        return hash;
    };
    return that;
}());
