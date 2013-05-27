/**
 * The class encapsulates and facilitates device detection based on the current
 * devices user agent string.
 * 
 * @class DeviceDetection 
 * @author Zorayr Khalapyan
 * @version 8/8/2012
 */
var DeviceDetection = (function(){
    var self = {};
    
    var matchUserAgent = function(agentRegexp){
        return navigator.userAgent.match(agentRegexp);
    };
    
    self.isOnDevice = function(){
        return matchUserAgent(/(iPhone|iPod|iPad|Android|BlackBerry)/);
    };

    self.isDeviceiOS = function(){
        return matchUserAgent(/(iPhone|iPod|iPad)/);
    };

    self.isDeviceAndroid = function(){
        return matchUserAgent(/(Android)/);
    };

    return self;
    
}());