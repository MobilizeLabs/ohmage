/**
 * The class is designed to facilitate flexible permanent storage of key value
 * pairs utilzing HTML5 localStorage.
 *
 * @class LocalMap
 * @author Zorayr Khalapyan
 * @version 10/25/2012
 */
var LocalMap = function ( name ) {
    var that = {};

    //Prevent compatability issues in different execution environments.
    if ( !localStorage ) {
        localStorage = {};
    }

    if ( !localStorage[name] ) {
        localStorage[name] = "{}";
    }

    var setMap = function ( map ) {
        localStorage[name] = JSON.stringify( map );
    };

    that.getMap = function () {
        return JSON.parse( localStorage[name] );
    };

    /**
     * Stores the specified (key, value) pair in the localStorage
     * under the map's namespace.
     */
    that.set = function ( name, object ) {
        var map = that.getMap();
        map[ name ] = object;
        setMap( map );
    };

    that.get = function ( name ) {
        var map = that.getMap();
        return typeof( map[ name ] ) !== "undefined" ? map[name] : null;
    };

    that.importMap = function ( object ) {
        var map = that.getMap();
        var key;
        for ( key in object ) {
            if (object.hasOwnProperty(key)) {
                map[key] = object[key];
            }
        }
        setMap(map);
    };

    that.length = function () {
        var map = that.getMap();
        var size = 0, key;
        for (key in map) {
            if (map.hasOwnProperty(key)) size++;
        }
        return size;
    };

    that.erase = function () {
        localStorage[name] = JSON.stringify({});
    };

    that.isSet = function (name) {
        return that.get(name) != null;
    };

    that.release = function (name) {
        var map = that.getMap();
        if (map[name]) {
            delete map[name];
        }
        setMap(map);
    };

    that.deleteNamespace = function(){
        if (localStorage.hasOwnProperty(name)) {
            delete localStorage[name];
        }
    };

    return that;

};

LocalMap.destroy = function () {
    for ( var item in localStorage ) {
        if ( localStorage.hasOwnProperty( item ) ) {
            delete localStorage[ item ];
        }
    }
};

LocalMap.exists = function (name) {
    return (localStorage[name]) ? true : false;
};
