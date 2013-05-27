Init.invokeOnReady(function() {
    var controller = new ReminderController(PageNavigation.getPageParameter('uuid'));
    $("#view-container").append(controller.render());
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
});