var AutoLoader = (function(){
    
    var self = this;
    
    var selectors = [];
    
    var INIT_FILE_NAMESPACE = "init";
    
    var TYPE_ROOT_CONFIG = {
        "js"  : "js/",
        "css" : "css/"
    };
    
    var modules = {
        "JQuery": {
            type: "js",
            namespace: "jquery",
            files: ["jquery.js", 
                    "jquery.extensions.js", 
                    "jquery.xml2json.js"]

        },
        "MWF-Decorators": {
            type: "js",
            namespace: "mwf",
            files: ["mwf.js", 
                    "decorator.js", 
                    "button.js", 
                    "content.js", 
                    "menu.js", 
                    "form.js", 
                    "header.js", 
                    "footer.js"]

        },
        "Utilities": {
            type: "js",
            namespace: "util",
            files: ["Base64.js", 
                    "DateTimePicker.js", 
                    "LocalMap.js", 
                    "LocalNotificationAdapter.js", 
                    "Spinner.js", 
                    "Strings.js", 
                    "UUIDGen.js", 
                    "jstz.js"]

        },
        "PEG.js": {
            type: "js",
            namespace: "pegjs",
            files: ["peg-0.7.0.js", 
                    "ConditionalParser.js"]

        },
        "Views": {
            type: "js",
            namespace: "views",
            files: ["ReminderView.js"]

        },
        "Controllers": {
            type: "js",
            namespace: "controllers",
            files: ["ReminderController.js"]

        },
        "Application": {
            type: "js",
            namespace: "",
            files: ["Campaign.js", 
                    "Campaigns.js", 
                    "Help.js", 
                    "PageNavigation.js", 
                    "Profile.js", 
                    "Prompt.js", 
                    "PromptHandler.js", 
                    "Reminders.js", 
                    "Survey.js", 
                    "SurveyResponse.js", 
                    "SurveyResponseUploader.js", 
                    "UploadQueue.js", 
                    "UserAuthentication.js", 
                    "api.js", 
                    "navigation.js"]

        }


    };
    
    var loadModule = function(module){
        var type = module.type;
        var namespace = module.namespace;
        for(var i = 0; i < module.files.length; i++){
            loadFile(type, namespace, module.files[i]);
        }
    };
    
    var loadFile = function(type, namespace, file){
        var url = buildFileURL(type, namespace, file);
        console.log("AutoLoader: Loading file " + url + ".");
        var tag = null;
        switch(type){
            case "js":
                tag = createScriptTag(url);
                break;
            case "css":
                tag = createStyleTag(url);
                break;
        }
        document.getElementsByTagName("head")[0].appendChild(tag);
    }
    
    var buildFileURL = function(type, namespace, file){
        namespace = (namespace.length !== 0)? (namespace + "/") : "";
        return TYPE_ROOT_CONFIG[type] + namespace + file;
    }
    
    var createScriptTag = function(url){
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = url;
        return script;
    };
    
    var createStyleTag = function(url){
        var style = document.createElement('style');
        style.type = "text/css";
        style.src = url;
        return style;
    };
    
    var hasValidSelector = function(module){
        if(typeof(module.selector) === "undefined"){
            return true;
        }
        for(var i = 0; i < selectors.length; i++){
            if(selectors[i] === module.selector){
                return true;
            }
        }
        return false;
    };
    
    self.setSelectors = function(newSelectors){
        selectors = newSelectors;
    };
    
    self.load = function(initFile){
        for(var moduleName in modules){
            if(hasValidSelector(modules[moduleName])){
                console.log("AutoLoader: Loading module " + moduleName + ".");
                loadModule(modules[moduleName]);
            }
        }
        console.log("Done loading. Initializing application.");
        if(initFile){
            loadFile("js", INIT_FILE_NAMESPACE, initFile);    
        }
        
    };
    return self;
    
})();
