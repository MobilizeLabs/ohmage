/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 * @constructor
 */
var MessageModel = function (messageData, surveyModel, campaignModel) {
    "use strict";
    var that = AbstractSurveyItemModel(messageData, surveyModel, campaignModel);

    that.getMessageText = function () {
        return messageData.messagetext;
    };

    return that;
};

