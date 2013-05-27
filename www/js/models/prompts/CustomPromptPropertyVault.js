/**
 * The vault stores (key, value) pairs mapped to a hierarchical object that is
 * mapped from campaign URN, to survey ID, to prompt ID. The stored values are
 * actually  custom properties added to prompts; for example, when the user
 * creates a custom choice in a multiple custom choice prompt, this object will
 * store that custom choice for future use.
 *
 * @author Zorayr Khalapyan
 * @version 4/11/13
 * @constructor
 */

var CustomPromptPropertyVault = function (promptModel) {
    "use strict";
    var that = {};

    var vault = LocalMap(CustomPromptPropertyVault.VAULT_LOCAL_MAP_NAME);

    var campaignURN = promptModel.getCampaignURN(),
        surveyID    = promptModel.getSurveyID(),
        promptID    = promptModel.getID();

    var campaignProperties,
        surveyProperties,
        promptProperties;

    var read = function () {
        campaignProperties = vault.get(campaignURN) || {};
        surveyProperties   = campaignProperties[surveyID] || {};
        promptProperties   = surveyProperties[promptID]   || {};
    };

    var write = function () {
        surveyProperties[promptID] = promptProperties;
        campaignProperties[surveyID] = surveyProperties;
        vault.set(campaignURN, campaignProperties);
    };

    that.addCustomProperty = function (key, label) {
        read();
        promptProperties[key] = label;
        write();
    };

    that.getCustomProperties = function () {
        read();
        return promptProperties;
    };

    that.deleteCustomProperties = function () {
        read();
        promptProperties = {};
        write();
    };

    return that;
};

CustomPromptPropertyVault.VAULT_LOCAL_MAP_NAME = 'custom-properties-vault';

CustomPromptPropertyVault.deleteAllCustomProperties = function () {
    "use strict";
    LocalMap(CustomPromptPropertyVault.VAULT_LOCAL_MAP_NAME).erase();
};