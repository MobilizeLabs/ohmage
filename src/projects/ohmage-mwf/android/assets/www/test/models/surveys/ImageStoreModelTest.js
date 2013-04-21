/**
 * @author Zorayr Khalapyan
 * @version 4/15/13
 */
if (!fixture) {
    var fixture = {};
}

module("models.surveys.ImageStoreModel", {
    setup: function () {
        "use strict";
    },

    teardown: function () {
        "use strict";
        ImageStoreModel.deleteAllImages();
    }
});

test("Test storing an image.", function () {
    "use strict";
    ///
    var imageUUID = ImageStoreModel.recordImage("image-base64-value");
    ///
    strictEqual(ImageStoreModel.getImage(imageUUID), "image-base64-value", "The base64 image value should match the value specified.");
});

test("Test deleting an image.", function () {
    "use strict";
    var imageUUID = ImageStoreModel.recordImage("image-base64-value");
    ///
    ImageStoreModel.deleteImage(imageUUID);
    ///
    strictEqual(ImageStoreModel.getImage(imageUUID), null, "After deleting the image, the UUID should not exist.");
});

test("Test deleting all the images.", function () {
    "use strict";
    var imageUUID = ImageStoreModel.recordImage("image-base64-value");
    ///
    ImageStoreModel.deleteAllImages();
    ///
    strictEqual(ImageStoreModel.getImage(imageUUID), null, "After deleting the image, the UUID should not exist.");
});

