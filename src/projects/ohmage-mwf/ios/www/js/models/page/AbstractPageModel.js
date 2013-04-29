/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 */

var AbstractPageModel = function () {
    "use strict";
    var abstractPageModel = null;

    return function () {
        if (abstractPageModel === null) {
            abstractPageModel = {
                title : "default title"
            };
        }

        return abstractPageModel;
    };
};