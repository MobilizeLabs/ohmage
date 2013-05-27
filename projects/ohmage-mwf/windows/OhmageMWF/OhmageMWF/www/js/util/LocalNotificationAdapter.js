var LocalNotificationAdapter = (function(){
  
    var self = this;
    
    var isLocalNotificationAvailable = function(){
        return typeof plugins !== "undefined" && typeof(plugins.localNotification) !== "undefined";
    };
    
    self.add = function(options){
        if (isLocalNotificationAvailable()) {
            if(DeviceDetection.isDeviceAndroid()){
                plugins.localNotification.add({
                    date        : options.date,
                    message     : "You have a pending survey.",//options.message,
                    ticker      : "You have a pending survey.",
                    repeatDaily : options.repeatDaily,
                    id          : options.id
                });
            }else if(DeviceDetection.isDeviceiOS()){
                plugins.localNotification.add({
                    date        : options.date,
                    message     : options.message,
                    background  : "goToPendingSurveys",
                    badge       : 1,
                    id          : options.id,
                    sound       :'horn.caf'
                });
            }
        }
    };
    
    self.cancel = function(id){
        if (isLocalNotificationAvailable()) {
            console.log("LocalNotificationAdapter: cancel(" + id + ")");
            plugins.localNotification.cancel(id);   
        }
    };
    
    self.cancelAll = function(){
        if (isLocalNotificationAvailable()) {
            console.log("LocalNotificationAdapter: cancelAll()");
            plugins.localNotification.cancelAll();
        }
    };
    
    return self;
})();

function goToPendingSurveys(){
    window.location = "pending-surveys.html";
}
