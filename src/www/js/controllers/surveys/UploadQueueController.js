var UploadQueueController = function () {
    "use strict";
    var that = {};

    var uploadQueueView;

    var refreshView = function () {
        PageController.refresh();
    };

    var deleteAllCallback = function () {
        var pendingResponses = SurveyResponseStoreModel.getPendingResponses(),
            message = "Are you sure you would like to delete all your responses?",
            buttonLabels = 'Yes,No',
            surveyResponseUUID;

        var confirmationCallback = function (yesDeleteAllSurveysResponses) {
            if (yesDeleteAllSurveysResponses) {
                for (surveyResponseUUID in pendingResponses) {
                    if (pendingResponses.hasOwnProperty(surveyResponseUUID)) {
                        SurveyResponseStoreModel.deleteSurveyResponse(pendingResponses[surveyResponseUUID].response);
                    }
                }
                refreshView();
            }
        };
        MessageDialogController.showConfirm(message, confirmationCallback, buttonLabels);
    };

    var uploadAllCallback = function () {
        var uploadAllDoneCallback = function (successfulUploadCount) {
            var message;
            if (successfulUploadCount === 0) {
                message = "Unable to upload any surveys at this time.";
            } else {
                message = "Successfully uploaded " + successfulUploadCount + " survey(s).";
            }

            MessageDialogController.showMessage(message, refreshView);
        },
            pendingResponses = SurveyResponseStoreModel.getPendingResponses();
        SurveyResponseUploadService.uploadAll(pendingResponses, uploadAllDoneCallback, ConfigManager.getGpsEnabled());
    };

    var onPendingUploadClickCallback = function (surveyResponseKey) {
        PageController.openSurveyResponse({surveyResponseKey : surveyResponseKey});
    };

    that.getView = function () {
        uploadQueueView = UploadQueueView(that);
        uploadQueueView.deleteAllResponsesCallback = deleteAllCallback;
        uploadQueueView.uploadAllResponsesCallback = uploadAllCallback;
        uploadQueueView.onPendingUploadClickCallback = onPendingUploadClickCallback;
        return uploadQueueView;

    };

    return that;
};