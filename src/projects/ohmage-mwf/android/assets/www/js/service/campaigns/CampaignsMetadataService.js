/**
 * This service class is responsible for downloading and setting campaigns
 * metadata which includes a list of available campaigns among other
 * information.
 *
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */
var CampaignsMetadataService = (function () {
    "use strict";

    var that = {};

    var onErrorCallbackClosure = function (onErrorCallback) {
        return function (serviceResponse) {
            Spinner.hide(function () {
                if (onErrorCallback) {
                    onErrorCallback(serviceResponse);
                }
            });
        };
    };

    var onSuccessCallbackClosure = function (onSuccessCallback) {
        return function (serviceResponse) {
            Spinner.hide(function () {

                if (serviceResponse.result === "success") {
                    that.setCampaignsMetadata(serviceResponse.data);
                    if (onSuccessCallback) {
                        onSuccessCallback();
                    }
                }
            });
        };
    };

    that.setCampaignsMetadata = function (metadata) {
        var campaigns = LocalMap("all-campaigns"),
            campaignURN;

        campaigns.erase();

        for (campaignURN in metadata) {
            if (metadata.hasOwnProperty(campaignURN)) {
                campaigns.set(campaignURN, metadata[campaignURN]);
            }
        }
    };

    /**
     * Downloads a list of campaigns.
     */
    that.download = function (forceUpdate, onSuccessCallback, onErrorCallback) {

        //By default, the campaigns metadata is not updated if it has already
        //been downloaded.
        if (forceUpdate === undefined) {
            forceUpdate = false;
        }

        //If campaigns metadata has already been downloaded, and the user did
        //not request a forced update, then automatically proceed to the success
        //callback.
        if (!forceUpdate && !CampaignsModel.isEmpty()) {
            if (onSuccessCallback) {
                onSuccessCallback();
            }

        //Otherwise, initiate a service call to download campaigns metadat.
        } else {

            Spinner.show();

            ServiceController.serviceCall(
                "POST",
                ConfigManager.getCampaignReadUrl(),
                {
                    output_format: 'short'
                },
                "JSON",
                onSuccessCallbackClosure(onSuccessCallback),
                onErrorCallbackClosure(onErrorCallback)
            );
        }


    };

    return that;
}());