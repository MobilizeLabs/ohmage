/**
 *
 * @author Zorayr Khalapyan
 * @version 4/15/13
 * @constructor
 */
var ImageStoreModel = (function () {
    "use strict";
    var that = {};

    var images  = LocalMap("images");

    /**
     * Saves the provided based64 image and returns a UUID that was used to map
     * that specified image in store. You can use this value to later retrieve
     * that image.
     */
    that.recordImage = function (base64Image) {
        var imageUUID = UUIDGen.generate();
        images.set(imageUUID, base64Image);
        return imageUUID;
    };

    that.getImage = function (imageUUID) {
        return images.get(imageUUID);
    };

    that.deleteImage = function (imageUUID) {
        images.release(imageUUID);
    };

    that.deleteAllImages = function () {
        images.erase();
    };

    return that;
}());