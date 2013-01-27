
PromptView.renderPhotoPrompt = function (promptModel) {

    var container = document.createElement('div');

    var imgForm = mwf.decorator.Form('Image');
    imgForm.style.display = 'none';
    container.appendChild(imgForm);

    //This will store the image preview.
    var image = document.createElement('img');
    image.style.width = "100%";
    imgForm.addItem(image);

    //This is the method that will be called after the user takes a picture
    //or after the user uploads/selects a picture via the file input method.
    var recordImage = function (imageData, encode) {

        //Display the capture image.
        image.src =  ((encode) ? "data:image/jpeg;base64," : "") + imageData;
        imgForm.style.display = 'block';

        //Save the image and store the returned UUID within the image's
        //alt attribute.
        image.alt = SurveyResponseModel.saveImage(imageData);

    };

    //Detect PhoneGap camera support. If possible, allow the user to take a
    //photo.
    if (navigator.camera) {
        var takeImageButton = mwf.decorator.SingleClickButton(promptModel.getText(), function(){

            var onSuccess = function (imageData) {
                recordImage(imageData, true);
            };

            var onFail = function (message) {
                MessageDialogController.showMessage('Failed because: ' + message);
            };

            navigator.camera.getPicture(onSuccess, onFail, {quality: 25,
                destinationType: navigator.Camera.DestinationType.DATA_URL
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

            if(input){
                Base64.getBase64ImageFromInput(input, function (imageData) {
                    recordImage(imageData, false);
                });
            }else{
                MessageDialogController.showMessage("Please select an image.");
            }

        };

        container.appendChild(fileInputForm);
    }


    promptModel.isValid = function () {
        if (!image.alt) {
            promptModel.setErrorMessage("Please take an image to submit.");
            return false;
        }
        return true;
    };

    promptModel.getResponse = function () {
        return image.alt;
    };

    return container;

};
