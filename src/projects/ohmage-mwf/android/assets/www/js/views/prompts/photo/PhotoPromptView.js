/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

var PhotoPromptView = function (promptModel) {
    "use strict";
    var that = AbstractPromptView(promptModel);


    var imageField = null;

    var imageForm = null;

    //This is the method that will be called after the user takes a picture
    //or after the user uploads/selects a picture via the file input method.
    var recordImage = function (imageData, encode) {
        try {

            //Save the image and store the returned UUID within the image's
            //alt attribute.
            imageField.alt = ImageStoreModel.recordImage(imageData);

            //Display the captured image.
            imageField.src =  (encode ? "data:image/jpeg;base64," : "") + imageData;
            imageForm.style.display = 'block';

        } catch (err) {
            MessageDialogController.showMessage("Unfortunately, you have exceeded the storage capacity. Please upload a smaller image.");
        }

    };

    that.isValid = function () {
        if (!imageField.alt) {
            that.setErrorMessage("Please take an image to submit.");
            return false;
        }
        return true;
    };

    that.getResponse = function () {
        return imageField.alt;
    };

    that.render = function () {

        var container = document.createElement('div');

        imageForm = mwf.decorator.Form('Image');
        imageForm.style.display = 'none';
        container.appendChild(imageForm);

        //This will store the image preview.
        imageField = document.createElement('img');
        imageField.style.width = "100%";
        imageForm.addItem(imageField);


        //Detect PhoneGap camera support. If possible, allow the user to take a
        //photo.
        if (navigator.camera) {
            var takeImageButton = mwf.decorator.SingleClickButton(promptModel.getText(), function () {

                function onSuccess(imageData) {
                    recordImage(imageData, true);
                }

                function onFail(message) {
                    MessageDialogController.showMessage('Failed because: ' + message);
                }

                navigator.camera.getPicture(onSuccess, onFail, {
                    quality: 25,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            });

            container.appendChild(takeImageButton);

        //Downgrade to file input form.
        } else {

            var fileInputForm = mwf.decorator.Form(promptModel.getText());

            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInputForm.addItem(fileInput);
            fileInput.onchange = function () {

                var input = this.files[0];

                if (input) {
                    Base64.getBase64ImageFromInput(input, function (imageData) {
                        recordImage(imageData, false);
                    });
                } else {
                    MessageDialogController.showMessage("Please select an image.");
                }

            };

            container.appendChild(fileInputForm);
        }

        return container;

    };

    return that;
};