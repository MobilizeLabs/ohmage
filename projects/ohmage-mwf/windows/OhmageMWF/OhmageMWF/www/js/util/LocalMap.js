/**
 * The class is designed to facilitate flexible permanent storage of key value 
 * pairs utilzing HTML5 localStorage.
 *  
 * @class LocalMap
 * @author Zorayr Khalapyan
 * @version 7/30/2012
 */
var LocalMap = function (name) {
    var self = {};

    //Prevent compatability issues in different execution environments.
    if (typeof (localStorage) === "undefined") {
        localStorage = {};
    }

    if (typeof (localStorage[name]) === "undefined") {
        localStorage[name] = JSON.stringify({});
    }

    var setMap = function (map) {
        localStorage[name] = JSON.stringify(map);
    };

    self.getMap = function () {
        return JSON.parse(localStorage[name]);
    };

    self.set = function (name, object) {
        var map = self.getMap();
        map[name] = object;
        setMap(map);
    };

    self.importMap = function (object) {
        var map = self.getMap();
        var key;
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                map[key] = object[key];
            }
        }
        setMap(map);
    };

    self.get = function (name) {
        var map = self.getMap();
        return typeof(map[name]) !== "undefined" ? map[name] : null;
    };
    
    self.length = function () {
        var map = self.getMap();
        var size = 0, key;
        for (key in map) {
            if (map.hasOwnProperty(key)) size++;
        }
        return size;
    };

    self.erase = function () {
        localStorage[name] = JSON.stringify({});
    };

    self.isSet = function (name) {
        return self.get(name) != null;
    };

    self.release = function (name) {
        var map = self.getMap();
        if (map[name]) {
            delete map[name];
        }
        setMap(map);
    };

    return self;

};

LocalMap.destroy = function () {
    for (var item in localStorage) {
        if (localStorage.hasOwnProperty(item)) {
            delete localStorage[item];    
        }
    }    
};

LocalMap.exists = function (name) {
    return (localStorage[name]) ? true : false;
};
