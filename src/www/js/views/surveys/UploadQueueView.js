var UploadQueueView = function () {
    "use strict";
    var that = AbstractView();

    var uploadQueueMenuTitle = "Pending Uploads";

    var renderEmptyUploadQueueView = function () {
        var emptyUploadQueueView = mwf.decorator.Content(uploadQueueMenuTitle);
        emptyUploadQueueView.addTextBlock('Upload queue is empty.');
        return emptyUploadQueueView;
    };

    that.render = function () {
        var pendingResponses = SurveyResponseStoreModel.getPendingResponses(),
            queueMenu = mwf.decorator.Menu(uploadQueueMenuTitle),
            onSurveyClickCallback = function (response) {
                return function () {
                    PageNavigation.openSurveyResponseView(response.getSurveyKey());
                };
            },
            survey,
            response,
            details,
            menuItem,
            uuid;

        for (uuid in pendingResponses) {
            if (pendingResponses.hasOwnProperty(uuid)) {
                survey   = pendingResponses[uuid].survey;
                response = pendingResponses[uuid].response;
                details  = "Submitted on " + response.getSubmitDateString() + ".";
                menuItem = queueMenu.addMenuLinkItem(survey.getTitle(), null, details);
                TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, onSurveyClickCallback(response), "menu-highlight");
            }
        }

        var container = document.createElement('div');

        if (queueMenu.size() > 0) {
            container.appendChild(queueMenu);
            container.appendChild(mwf.decorator.DoubleClickButton("Delete All", that.deleteAllResponsesCallback, "Upload All", that.uploadAllResponsesCallback));
        } else {
            container.appendChild(renderEmptyUploadQueueView());
        }

        container.appendChild(mwf.decorator.SingleClickButton("Dashboard", PageController.openDashboard));
        return container;
    };

    that.deleteAllResponsesCallback = function () {};
    that.uploadAllResponsesCallback = function () {};

    return that;
};