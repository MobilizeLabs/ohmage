/**
 * The service is responsible for downloading campaign configuration and passing
 * the data to CampaignsModel to install and save. The service class also parses
 * the downloaded campaign configuration XML to JSON format.
 *
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */
var CampaignDownloadService = (function () {
    "use strict";

    var that = {};

    /**
     * Converts the downloaded campaign XML to JSON for storage.
     * @param campaignXML The downloaded campaign configuration in XML format.
     * @returns {*} JSON version of the campaign configuration.
     */
    var parseCampaignXML = function (campaignXML) {
        /*
         * There is apparently a very weird problem running JavaScript within
         * PhoneGap – the engine is so restrictive that when encountering the word
         * ‘default’, used within the prompt’s XML configuration file as a property
         * storing the default value, it interprets it as a keyword crashing the
         * system. This renders the XML2JSON conversion impossible. The only
         * solution I currently found was to replace all ‘default’  parameters within
         * the XML string to ‘def’ prior to converting to JSON. I am assuming the
         * problem is from the XML2JSON plugin’s use of the dot operator instead of
         * the array-access syntax to do the parsing, but debugging the plugin is
         * not working – there are only two xml->json parsers and I have tested
         * both. Everything works fine on the desktop side, but once placed within
         * PhoneGap the bug comes up.
         * See GitHub issue #151 for more details.
         */
        var cleanXML = campaignXML.replace(/<default>/g, "<defaultValue>")
            .replace(/<\/default>/g, "</defaultValue>")
            .replace(/<default\/>/g, "<defaultValue/>");

        //Convert the XML configuration to a JSON representation.
        var json = $.xml2json.parser(cleanXML);

        return json.campaign;
    };

    var onErrorCallbackClosure = function (onErrorCallback) {
        return function (response) {
            Spinner.hide(function () {
                if (onErrorCallback) {
                    onErrorCallback(response);
                }
            });
        };
    };

    var onSuccessCallbackClosure = function (campaignURN, onSuccessCallback) {
        return function (response) {
            Spinner.hide(function () {
                if (response.result === "success") {
                    CampaignsModel.installCampaign(campaignURN, parseCampaignXML(response.data[campaignURN].xml));
                    if (onSuccessCallback) {
                        onSuccessCallback();
                    }
                }
            });
        };
    };

    that.downloadCampaign = function (campaignURN, onSuccessCallback, onErrorCallback) {
        Spinner.show();

        ServiceController.serviceCall(
            "POST",
            ConfigManager.getCampaignReadUrl(),
            {
                campaign_urn_list: campaignURN,
                output_format    : 'long'
            },
            "JSON",
            onSuccessCallbackClosure(campaignURN, onSuccessCallback),
            onErrorCallbackClosure(onErrorCallback)
        );

    };

    return that;

}());