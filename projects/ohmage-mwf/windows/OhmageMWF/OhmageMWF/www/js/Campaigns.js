var Campaigns = new (function() {

    var self = this;
    
    var allCampaigns       = new LocalMap("all-campaigns");
    
    var installedCampaigns = new LocalMap("installed-campaigns");

    /**
     * Returns true campaign metadata has not been downloaded. This doesn't 
     * have anything to do installed campaigns.
     */
    this.isEmpty = function(){
        return allCampaigns.length() == 0;
    };
    
    /**
     * Returns the number of currently installed campaigns.
     */
    this.getInstalledCampaignsCount = function(){
        return self.getInstalledCampaigns().length;
    };

    /**
     * Deletes the specified campaign from the local storage.
     * @param urn Unique campaign identifier.
     */
    this.uninstallCampaign = function(urn){
        installedCampaigns.release(urn);
        ReminderModel.deleteCampaignReminders(urn);
    };

    /**
     * Returns a list of campaign objects that the user has currently installed.
     */
    this.getInstalledCampaigns = function(){
        var campaigns = [];
        for(var urn in installedCampaigns.getMap()){
            campaigns.push(new Campaign(urn));
        }
        return campaigns;
    };

    this.render = function(installed){

        //By default, only the installed campaigns will be displayed.
        if(typeof(installed) == 'undefined')
            installed = true;

        //If the user hasn't installed any campaigns, then just display the
        //available campaigns so the user can install one.
        if(installedCampaigns.length() == 0){
            installed = false;
        }

        var availableMenu = mwf.decorator.Menu("Available Campaigns");
        var installedMenu = mwf.decorator.Menu("My Campaigns");

        //Callback for installing a new campaign.
        var install = function(urn){
            return function(){
                //On success, update the current view which will show the newly
                //installed campaign.
                var onSuccess = function(){
                    PageNavigation.openInstalledCampaignsView();
                };
                
                //On error, just display an alert to the user with the error
                //message.
                var onError = function(){
                    showMessage("Unable to install campaign. Please try again later.");
                };
                
                Campaign.install(urn, onSuccess, onError);
            }
        };
        
        //Callback for opening an already installed campaign.
        var open = function(urn){
            return function(){
                PageNavigation.openCampaignView(urn);
            }
        }
        
        var campaign, campaignMenuItem;
        for(var urn in allCampaigns.getMap()){

            var campaign = new Campaign(urn);
            
            //Ignore inactive campaigns.
            if(!campaign.isRunning()){
                continue;
            }

            //If the campaign has been installed, place it in the installed 
            //campaigns menu.
            if(installedCampaigns.isSet(urn)){
                campaignMenuItem = installedMenu.addMenuLinkItem(allCampaigns.get(urn).name);
                TouchEnabledItemModel.bindTouchEvent(campaignMenuItem, campaignMenuItem, open(urn), "menu-highlight");
            }else{
                campaignMenuItem = availableMenu.addMenuLinkItem(allCampaigns.get(urn).name);
                TouchEnabledItemModel.bindTouchEvent(campaignMenuItem, campaignMenuItem, install(urn), "menu-highlight");
            }

        }

        var container = document.createElement('div');

        if(installed){
            mwf.decorator.TopButton("Add Campaign", null, PageNavigation.openAvailableCampaignsView, true)
            container.appendChild(installedMenu);
            container.appendChild(mwf.decorator.SingleClickButton("Upload Queue", PageNavigation.openUploadQueueView));
        }

        if(!installed && availableMenu.size() > 0){

            if(installedCampaigns.length() > 0){
                mwf.decorator.TopButton("My Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
            }

            $(availableMenu).find("a").css('background', "url('img/plus.png') no-repeat 95% center");

            container.appendChild(availableMenu);
            container.appendChild(mwf.decorator.SingleClickButton("Refresh Campaigns", function(){
                var onSuccess = function(){
                    showMessage("All campaigns have been updated.", PageNavigation.openAvailableCampaignsView);
                };
                var onError = function(){
                    showMessage("Unable to download all campaigns. Please try again.");
                };
                Campaigns.download(true, onSuccess, onError);
            }));
        }
        return container;
    };


    this.download = function(force, onSuccess, onError){

        if(typeof(force) == undefined)
            force = false;

        if(!force && !self.isEmpty()){
            if(onSuccess)
                onSuccess();
            return;
        }

        var _onError = function(response){
            Spinner.hide(function(){
                if(onError){
                    onError(response);
                }
            });
        };

        var _onSuccess = function(response) {
            Spinner.hide(function(){

                if(response.result === "success"){

                    var campaigns = new LocalMap("all-campaigns");

                    campaigns.erase();

                    for(var urn in response.data){
                        campaigns.set(urn, response.data[urn]);
                    }

                    if(onSuccess){
                        onSuccess();
                    }
                }
            });


        };

        Spinner.show();

        api(
             "POST",
             CAMPAIGN_READ_URL,
             {
                 user:          auth.getUsername(),
                 password:      auth.getHashedPassword(),
                 client:        'MWoC',
                 output_format: 'short'
             },
             "JSON",
             _onSuccess,
             _onError
        );
    }

})();


