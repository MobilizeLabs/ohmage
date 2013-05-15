/**
 * CampaignsModel is used for managing campaigns metadata which includes a list
 * of all available downloaded or set campaigns. The object also keeps track of
 * installed campaigns which have been downloaded by the user and are available
 * for participation.
 *
 * @author Zorayr Khalapyan
 * @version 4/5/13
 * @constructor
 */

var CampaignsModel = (function () {
    "use strict";
    var that = {};

    /**
     * Stores a list of all available campaigns.
     * @type {LocalMap}
     */
    var allCampaigns = LocalMap("all-campaigns");

    /**
     * Stores campaign configurations when a campaign is installed.
     * @type {LocalMap}
     */
    var campaignConfigurations = new LocalMap("campaign-configurations");

    /**
     * Stores a list of installed campaigns.
     * @type {LocalMap}
     */
    var installedCampaigns = LocalMap("installed-campaigns");

    /**
     * Cached use to control the number of campaign models created.
     * @type {{}}
     */
    var campaignCache = {};

    var log = Logger("CampaignsModel");

    /**
     * The method is used to extract out CampaignModels from allCampaigns and
     * installedCampaigns objects which are LocalMaps.
     *
     * @param campaignsLocalMap The LocalMap that stores URN:CampaignModel.
     * @param [filterCallback] Acts a filter that takes in a campaign URN and
     * responds with either true if the campaign should be included in the
     * result, or false, if the campaign should be ignored.
     * @returns {string:CampaignModel}
     */
    var getCampaignModelsFromLocalMap = function (campaignsLocalMap, filterCallback) {
        var campaigns = {},
            campaignURN,
            campaignsMap = campaignsLocalMap.getMap();

        //If a filter was not set, create a filter that accepts all campaigns.
        if (filterCallback === undefined) {
            filterCallback = function () { return true; };
        }

        for (campaignURN in campaignsMap) {
            if (campaignsMap.hasOwnProperty(campaignURN)) {
                if (filterCallback(campaignURN)) {
                    campaigns[campaignURN] = that.getCampaign(campaignURN);
                }
            }
        }
        return campaigns;
    };

    /**
     * Returns true campaign metadata has not been downloaded. Remember that
     * this method doesn't have anything to do installed campaigns (does not
     * indicate that campaigns have been installed, but merely that some
     * campaigns metadata has been downloaded or set).
     * @return {boolean} True if campaigns metadata has not been set.
     */
    that.isEmpty = function () {
        return allCampaigns.length() === 0;
    };

    /**
     * Marks the campaign as installed and saves the campaign configuration.
     * @param campaignURN The URN of the installed campaign.
     * @param campaignConfiguration The campaign configuration to save.
     */
    that.installCampaign = function (campaignURN, campaignConfiguration) {
        log.info("Installing campaign with URN [$1].", campaignURN);
        //Mark the campaign as installed by setting a timestamp.
        installedCampaigns.set(campaignURN, Math.round(new Date().getTime() / 1000));
        campaignConfigurations.set(campaignURN, campaignConfiguration);
    };

    /**
     * Returns the number of currently installed campaigns.
     * @return {number} Number of currently installed campaigns.
     */
    that.getInstalledCampaignsCount = function () {
        return installedCampaigns.length();
    };

    /**
     * Returns a CampaignModel corresponding to the specified campaign URN.
     * @param campaignURN The URN of the campaign to return.
     * @returns {CampaignModel}
     */
    that.getCampaign = function (campaignURN) {
        if (campaignCache[campaignURN] === undefined) {
            campaignCache[campaignURN] = CampaignModel(campaignURN);
        }
        return campaignCache[campaignURN];
    };

    /**
     *
     * @param campaignURN
     * @param surveyID
     * @returns {SurveyModel}
     */
    that.getSurvey = function (campaignURN, surveyID) {
        return that.getCampaign(campaignURN).getSurvey(surveyID);
    };

    /**
     * Deletes the specified campaign from the local storage. This method will
     * also delete all reminders associated with the provided campaign.
     * @param campaignURN Unique campaign identifier.
     */
    that.uninstallCampaign = function (campaignURN) {
        log.info("Uninstalling campaign with URN [$1]", campaignURN);
        installedCampaigns.release(campaignURN);
        campaignConfigurations.release(campaignURN);
        //TODO: Use publish-subscribe pattern instead!
        //ReminderModel.deleteCampaignReminders(campaignURN);
    };

    /**
     * Uninstalls all available campaigns.
     */
    that.uninstallAllCampaigns = function () {
        var allCampaigns = that.getAllCampaigns(),
            campaignURN;
        for (campaignURN in allCampaigns) {
            if (allCampaigns.hasOwnProperty(campaignURN)) {
                that.uninstallCampaign(campaignURN);
            }
        }
    };

    /**
     * Returns all available campaigns even if they are installed. So both
     * installed and not-installed campaigns will be returned.
     */
    that.getAllCampaigns = function () {
        return getCampaignModelsFromLocalMap(allCampaigns);
    };

    /**
     * Returns all those campaigns that are available but have not been
     * installed. Note that the returned value is a JavaScript object
     * (key -> CampaignModel) and not an array list.
     * @returns {{}}
     */
    that.getAvailableCampaigns = function () {
        return getCampaignModelsFromLocalMap(allCampaigns, function (campaignURN) {
            return !installedCampaigns.isSet(campaignURN);
        });
    };

    /**
     * Returns a list of campaign objects that the user has currently
     * installed. The returned object's key is the URN of the campaign.
     */
    that.getInstalledCampaigns = function () {
        return getCampaignModelsFromLocalMap(installedCampaigns);
    };

    /**
     * Returns all currently installed surveys. This basically combines all the
     * surveys from all the installed campaigns.
     * @returns {Array}
     */
    that.getAllSurveys = function () {
        var allSurveys = [],
            installedCampaigns = that.getInstalledCampaigns(),
            campaignURN,
            campaignModel,
            surveyID,
            campaignSurveys;
        for (campaignURN in installedCampaigns) {
            if (installedCampaigns.hasOwnProperty(campaignURN)) {
                campaignModel = that.getCampaign(campaignURN);
                campaignSurveys = campaignModel.getSurveys();
                for (surveyID in campaignSurveys) {
                    if (campaignSurveys.hasOwnProperty(surveyID)) {
                        allSurveys.push(campaignSurveys[surveyID]);
                    }
                }
            }
        }
        return allSurveys;
    };

    return that;
}());


