if(!fixture){
    var fixture = {};
}

module( "util.DeviceDetection", {
  setup: function() {

    //Stores user agent strings.
    fixture.agents = {};

    //Test Chrome browser user agent string running in a Mac.
    fixture.agents.Chrome = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17"

    //Test Android device user agent string.
    fixture.agents.Android = "Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1";

    //Test iOS device user agent strings.
    fixture.agents.iPhone = "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; ja-jp) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5";
    fixture.agents.iPad = "Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25";
    fixture.agents.iPod = "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; ja-jp) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5";
  },

  teardown: function() {
      delete fixture.agents;
  }
});

test( "Test isOnDevice() on Android : true", function() {

    DeviceDetection.setUserAgent( fixture.agents.Android );

    ///
    var isOnDevice = DeviceDetection.isOnDevice();
    ///

    ok(isOnDevice, "Android user agent should be considered as a mobile device.");
});

test( "Test isOnDevice() on iPhone : true", function() {

    DeviceDetection.setUserAgent( fixture.agents.iPhone );

    ///
    var isOnDevice = DeviceDetection.isOnDevice();
    ///

    ok(isOnDevice, "iPhone user agent should be considered as a mobile device.");
});

test( "Test isOnDevice() on Chrome Browser : false", function() {

    DeviceDetection.setUserAgent( fixture.agents.Chrome );

    ///
    var isOnDevice = DeviceDetection.isOnDevice();
    ///

    ok(!isOnDevice, "Chrome browser user agent should not be considered as a mobile device.");
});

test( "Test isDeviceiOS() on iPhone : true", function() {

    DeviceDetection.setUserAgent( fixture.agents.iPhone );

    ///
    var isDeviceiOS = DeviceDetection.isDeviceiOS();
    ///

    ok(isDeviceiOS, "iPhone user agent should be considered as a iOS device.");
});

test( "Test isDeviceiOS() on iPad : true", function() {

    DeviceDetection.setUserAgent( fixture.agents.iPad );

    ///
    var isDeviceiOS = DeviceDetection.isDeviceiOS();
    ///

    ok(isDeviceiOS, "iPad user agent should be considered as a iOS device.");
});

test( "Test isDeviceiOS() on iPod : true", function() {

    DeviceDetection.setUserAgent( fixture.agents.iPod );

    ///
    var isDeviceiOS = DeviceDetection.isDeviceiOS();
    ///

    ok(isDeviceiOS, "iPod user agent should be considered as a iOS device.");
});

test( "Test isDeviceiOS() on Android : false", function() {

    DeviceDetection.setUserAgent( fixture.agents.Android );

    ///
    var isDeviceiOS = DeviceDetection.isDeviceiOS();
    ///

    ok(!isDeviceiOS, "Android user agent should not be considered as an iOS device.");
});

test( "Test isDeviceiOS() on Chrome : false", function() {

    DeviceDetection.setUserAgent( fixture.agents.Chrome );

    ///
    var isDeviceiOS = DeviceDetection.isDeviceiOS();
    ///

    ok(!isDeviceiOS, "Chrome user agent should not be considered as an iOS device.");
});

test( "Test isDeviceAndroid() on Android : true", function() {

    DeviceDetection.setUserAgent( fixture.agents.Android );

    ///
    var isDeviceAndroid = DeviceDetection.isDeviceAndroid();
    ///

    ok(isDeviceAndroid, "Android user agent should be considered as an Android device.");
});

test( "Test isDeviceAndroid() on iPhone : false", function() {

    DeviceDetection.setUserAgent( fixture.agents.iPhone );

    ///
    var isDeviceAndroid = DeviceDetection.isDeviceAndroid();
    ///

    ok(!isDeviceAndroid, "iPhone user agent should not be considered as an Android device.");
});

test( "Test isNativeApplication on a native app : true", function() {

    DeviceDetection.setDocumentURL( "file://www/index.html" );

    ///
    var isNativeApplication = DeviceDetection.isNativeApplication();
    ///

    ok(isNativeApplication, "Accessing a page using the file:// protocol should indicate Cordova deployment.");
});

test( "Test isNativeApplication on a native app : false", function() {

    DeviceDetection.setDocumentURL( "http://www.rocking-apps.com/og/index.html" );

    ///
    var isNativeApplication = DeviceDetection.isNativeApplication();
    ///

    ok(!isNativeApplication, "Accessing a page using the http:// protocol should indicate web deployment.");
});