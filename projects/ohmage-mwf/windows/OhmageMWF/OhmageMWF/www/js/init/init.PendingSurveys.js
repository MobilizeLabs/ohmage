invokeOnReady(function(){
    $("#pending-surveys").append(new PendingSurveysController().render());
    $("#pending-surveys").append(mwf.decorator.SingleClickButton("Dashboard",  PageNavigation.openDashboard));
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
    $(document).unbind("backbutton");
});