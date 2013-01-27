
/**
 * Singleton Model!
 */
var CampaignsModel;
var CampaignsModelInitializer = function () {
    CampaignsModel = (function() {
        var that = {};

        /**
         * Stores a list of all available campaigns.
         */
        var allCampaigns = LocalMap("all-campaigns");

        /**
         * Stores a list of installed camapigns.
         */
        var installedCampaigns = LocalMap("installed-campaigns");

        /**
         * Returns true campaign metadata has not been downloaded. This doesn't
         * have anything to do installed campaigns.
         * @return True if campaigns metadata has not been downloaded.
         */
        that.isEmpty = function () {
            return allCampaigns.length() === 0;
        };

        /**
         * Returns the number of currently installed campaigns.
         * @return Number of currently installed campaigns.
         */
        that.getInstalledCampaignsCount = function () {
            return installedCampaigns.length();
        };

        that.getCampaign = function (campaignURN) {
            return CampaignModel(campaignURN);
        };

        /**
         * Deletes the specified campaign from the local storage. This method will
         * also delete all reminders associated with the provided campaign.
         * @param urn Unique campaign identifier.
         */
        that.uninstallCampaign = function (urn) {
            installedCampaigns.release(urn);
            ReminderModel.deleteCampaignReminders(urn);
        };

        /**
         * Returns all available campaigns even if they are installed.
         */
        that.getAllCampaigns = function () {
            var campaigns = {}, campaignURN;
            for(campaignURN in allCampaigns.getMap()){
                campaigns[campaignURN] = CampaignsModel.getCampaign(campaignURN);
            }
            return campaigns;
        };

        that.getAvailableCampaigns = function() {
            var campaigns = {}, campaignURN;
            for (campaignURN in allCampaigns.getMap()) {
                if (!installedCampaigns.isSet(campaignURN)) {
                    campaigns[campaignURN] = CampaignsModel.getCampaign(campaignURN);
                }
            }
            return campaigns;
        };

        /**
         * Returns a list of campaign objects that the user has currently installed.
         */
        that.getInstalledCampaigns = function () {
            var campaigns = {}, campaignURN;
            for (campaignURN in installedCampaigns.getMap()) {
                campaigns[campaignURN] = CampaignsModel.getCampaign(campaignURN);
            }
            return campaigns;
        };

        /**
         * Downloads a list of campaigns.
         */
        that.download = function (force, onSuccess, onError) {

            if (typeof(force) === undefined) {
                force = false;
            }


            if (!force && !that.isEmpty()) {
                if (onSuccess) {
                    onSuccess();
                }
                return;
            }

            var _onError = function (response) {
                Spinner.hide(function(){
                    if(onError){
                        onError(response);
                    }
                });
            };

            var _onSuccess = function (response) {
                Spinner.hide(function () {

                    if (response.result === "success") {

                        var campaigns = LocalMap("all-campaigns"), urn;

                        campaigns.erase();

                        for (urn in response.data) {
                            campaigns.set(urn, response.data[urn]);
                        }

                        if (onSuccess) {
                            onSuccess();
                        }
                    }
                });


            };

            Spinner.show();

            ServiceController.serviceCall(
                 "POST",
                 ConfigManager.getCampaignReadUrl(),
                 {
                     user:          auth.getUsername(),
                     password:      auth.getHashedPassword(),
                     client:        ConfigManager.getClientName(),
                     output_format: 'short'
                 },
                 "JSON",
                 _onSuccess,
                 _onError
            );
        };

        return that;
    }());
};


