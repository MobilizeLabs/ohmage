/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 * @param screen Visible DOM element.
 */
var PageController = (function () {
    "use strict";

    var that = AbstractEventPublisher("PageController");

    var screen = null;

    var log = Logger("PageController");

    /**
     * The root page name of the application. Visiting this page clears out the
     * page stack. Also, hitting back from this page on Androids will exit the
     * application.
     */
    var rootPageName = null;

    /**
     * Stores a mapping between registered page names and page models.
     * @type {{}}
     */
    var registeredPages = {};

    /**
     * Clears the current working screen.
     */
    var clearScreen = function () {
        if (screen !== null) {
            while (screen.hasChildNodes()) {
                screen.removeChild(screen.lastChild);
            }
        }
    };

    /**
     * The callback is invoked when the user hits the back button on an Android
     * device. If the back button is pressed from the index page (or also known
     * as the root page), then exit the application; otherwise, navigate to the
     * previous page.
     */
    var androidBackButtonCallback = function () {
        if (PageStackModel.getStackSize() === 1) {
            navigator.app.exitApp();
        } else {
            that.goBack();
        }
    };

    /**
     * Switches the first letter of the given string to upper case.
     * @param pageName The page name to capitalize.
     * @returns {string}
     */
    var capitalize = function (pageName) {
        return pageName.charAt(0).toUpperCase() + pageName.slice(1);
    };

    that.setDefaultBackButtonHandler = function () {
        //Currently, only Android devices have a built in back button.
        if (DeviceDetection.isDeviceAndroid()) {

            //Attach a back button handler.
            document.addEventListener("backbutton", androidBackButtonCallback, true);

            //Right before the user navigates away from the current HTML page,
            //remove the back button listener.
            $(window).bind('beforeunload', function () {
                document.removeEventListener("backbutton", androidBackButtonCallback, false);
            });
        }
    };

    that.setRootPageModel = function (newRootPageModel) {
        rootPageName = newRootPageModel.getPageName();
    };

    that.setRootPageName = function (newRootPageName) {
        rootPageName = newRootPageName;
    };

    that.setScreen = function (newScreen) {
        screen = newScreen;
    };

    /**
     * Used for registering multiple page models with single invocation.
     */
    that.registerPages = function () {
        var pageModel, i, numArgs;
        for (i = 0, numArgs = arguments.length; i < numArgs; i += 1) {
            that.registerPage(arguments[i]);
        }
    };

    /**
     * Associates the page model's name with the page model. Page models need to
     * be registered prior to navigating to model. This tT will also create
     * an PaoeController.openPageModelName() function that can be used instead
     * of PageController.goTo(PageName). To see all the registered models, use
     * PageController.getRegisteredPages().
     *
     * @param pageModel The model to register.
     */
    that.registerPage = function (pageModel) {
        var pageName = pageModel.getPageName();
        registeredPages[pageName] = pageModel;
        log.info("Registered page: " + pageName);
        that["open" + capitalize(pageName)] = (function (pageName) {
            return function (pageParams) {
                that.goTo(pageName, pageParams);
            };
        }(pageName));
        that.triggerPageRegisteredEvent(pageModel.getPageName());
    };

    that.unregisterPage = function (pageModel) {
        var pageName = pageModel.getPageName();
        if (that.isPageRegistered(pageName)) {
            delete registeredPages[pageName];
            delete that["open" + capitalize(pageName)];
            log.info("Unregistered page [$1].", pageName);
        }
    };

    /**
     * Returns currently rendered page name if any; otherwise, returns false.
     * @returns {string}
     */
    that.getCurrentPageName = function () {
        return PageStackModel.top().pageName;
    };

    /**
     * Returns true if the specified page name has been registered.
     * @param pageName The name of the page model to check.
     * @returns {boolean} True if the page has been registered; false,
     * otherwise.
     */
    that.isPageRegistered = function (pageName) {
        return registeredPages[pageName];
    };

    /**
     * Removes all pages from registration, clears the page stack, and clears
     * the root page name.
     */
    that.unregisterAllPages = function () {
        PageStackModel.clearPageStack();
        registeredPages = {};
        rootPageName = null;
    };

    /**
     * Returns page model given the page name. The page model has to be
     * registered; otherwise, the method will return null.
     * @param pageName The name of the page to fetch.
     * @returns {*} The page model registered under the specified name.
     */
    that.getPageModel = function (pageName) {
        return registeredPages[pageName] || null;
    };

    /**
     * Returns true if the specified page model is that of the root page.
     * @param pageModel The page model to compare to the root page model.
     * @returns {boolean} True if pageModel is the root page model; false,
     * otherwise.
     */
    that.isRootPage = function (pageModel) {
        return pageModel.getPageName() === rootPageName;
    };

    /**
     * If the stack contains more than the root page, the the stack is popped
     * and the top of the stack is rendered.
     * @returns {boolean} If there is only one or less pages in the stack, then
     * the function returns false, and no change takes place; otherwise, true.
     */
    that.goBack = function () {
        if (PageStackModel.getStackSize() > 1) {
            PageStackModel.pop();
            that.render(that.getPageModel(that.getCurrentPageName()));
            return true;
        }
        return false;
    };

    that.goTo = function (pageName, pageParams) {
        //If the page with the specified name has not been registered, return
        //false indicating that the current page has not been changed.
        if (!that.isPageRegistered(pageName)) {
            log.error("Page [$1] is not registered!", pageName);
            return false;
        }

        var pageModel = that.getPageModel(pageName);

        //Update the page stack. If the user is visiting the root page, then
        //clear out the stack and only leave the root page model name in the
        //stack.
        if (that.isRootPage(pageModel)) {
            PageStackModel.clearPageStack();
        }
        PageStackModel.push(pageName, pageParams);

        that.triggerPageLoadedEvent(pageName);

        //Finally render the page on the screen.
        that.render(pageModel);



        //Return true to indicate that the page has been successfully
        //transitioned.
        return true;
    };

    that.getPageParameter = function (pageParamName) {
        var pageParams = PageStackModel.getCurrentPageParams();
        return pageParams.hasOwnProperty(pageParamName) ? pageParams[pageParamName] : null;
    };

    /**
     * Return all the registered pages.
     * @returns {{}} An object containing all the registered pages. The key of
     * the object is the name of the page.
     */
    that.getRegisteredPages = function () {
        return registeredPages;
    };

    /**
     * Refreshes the current page. This should redraw the current page
     * reflecting any updates to the model.
     */
    that.refresh = function () {
        that.render(that.getPageModel(that.getCurrentPageName()));
    };

    /**
     * Opens the root page. This is equivalent of "go home".
     */
    that.goToRootPage = function () {
        log.info("Redirecting to root page from page [$1].", that.getCurrentPageName());
        that.goTo(rootPageName);
    };

    /**
     * Given a page model, first clears the screen then renders the specified
     * page.
     * @param pageModel The page model to render.
     */
    that.render = function (pageModel) {
        log.info("Initializing [$1] page.", pageModel.getPageName());

        pageModel.initialize(function () {
            clearScreen();
            var pageView =  PageView(pageModel),
                renderedView = pageView.render();
            if (renderedView) {
                screen.appendChild(pageView.render());
                log.info("Rendered [$1] page.", pageModel.getPageName());
            } else {
                log.error("Unable to render page [$1] because the rendered object is invalid.", pageModel.getPageName());
            }


        });
    };

    that.registerEvent("PageLoaded");
    that.registerEvent("PageRegistered");

    return that;
}());
