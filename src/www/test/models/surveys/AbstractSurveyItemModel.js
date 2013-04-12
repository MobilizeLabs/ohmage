/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 */

if (!fixture) {
    var fixture = {};
}

module("models.surveys.AbstractSurveyItemModel", {
    setup: function () {
        "use strict";
        fixture.getTestAbstractSurveyItemModel = function () {
            var surveyModelMock = {getID : function () { return "survey-id"; }},
                campaignModelMock = {getURN : function () { return "campaign-urn"; }},
                itemData = {id : "test-item-id", condition : "condition"},
                abstractSurveyItemModel = AbstractSurveyItemModel(itemData, surveyModelMock, campaignModelMock);
            return abstractSurveyItemModel;
        };
    },

    teardown: function () {
        "use strict";
        delete fixture.getTestAbstractSurveyItemModel;
    }
});


test("Test accessing abstract survey item model properties.", function () {
    "use strict";
    var abstractSurveyItemModel = fixture.getTestAbstractSurveyItemModel();
    ///
    var id = abstractSurveyItemModel.getID(),
        surveyID = abstractSurveyItemModel.getSurveyID(),
        campaignURN = abstractSurveyItemModel.getCampaignURN(),
        condition = abstractSurveyItemModel.getCondition();
    ///
    strictEqual(id, "test-item-id");
    strictEqual(surveyID, "survey-id");
    strictEqual(campaignURN, "campaign-urn");
    strictEqual(condition, "condition");
});
