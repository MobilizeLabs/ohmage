/**
 * @author Zorayr Khalapyan
 * @version 4/13/13
 */

var SurveyView = function (surveyController) {
    "use strict";
    var that = AbstractView();


    /**
     * Buffer that stores currently displayed/rendered items. This approach
     * is used for storing user entered data when the user goes to the previous
     * prompt.
     */
    var itemBuffer = {};

    /**
     * Stores the view for each item keyed on item ID.
     */
    var itemViews = {};

    var viewContainer = null;

    var renderControlButtons = function () {

        var controlButtonsPanel = document.createElement('div'),
            currentItem = surveyController.getCurrentItem(),
            isOnSubmitPage = surveyController.isOnSubmitPage();

        //If the prompt is skippable, then enable the skip button.
        if (!isOnSubmitPage && currentItem.isSkippable()) {
            controlButtonsPanel.appendChild(mwf.decorator.SingleClickButton(currentItem.getSkipLabel(), that.skipButtonCallback));
        }

        //Handle first prompt.
        if (surveyController.isOnFirstItem()) {
            controlButtonsPanel.appendChild(mwf.decorator.SingleClickButton("Next Prompt", that.nextButtonCallback));

        //Handle submit page.
        } else if (isOnSubmitPage) {
            controlButtonsPanel.appendChild(mwf.decorator.DoubleClickButton("Previous", that.previousButtonCallback, "Submit", that.submitButtonCallback));

        //Handle prompts in the middle.
        } else {
            controlButtonsPanel.appendChild(mwf.decorator.DoubleClickButton("Previous", that.previousButtonCallback, "Next", that.nextButtonCallback));
        }

        return controlButtonsPanel;
    };

    that.getCurrentItemView = function () {
        return itemViews[surveyController.getCurrentItem().getID()];
    };

    that.render = function () {
        var controlButtons = renderControlButtons(),
            currentItem,
            currentItemID,
            surveyCompletedMenu,
            promptView;

        if (viewContainer === null) {
            viewContainer = document.createElement('div');
        } else {
            viewContainer.innerHTML = "";
        }

        if (!surveyController.isOnSubmitPage()) {
            currentItem = surveyController.getCurrentItem();
            currentItemID = currentItem.getID();

            if (!itemBuffer[currentItemID]) {
                itemViews[currentItemID] = PromptViewFactory.getView(currentItem);
                itemBuffer[currentItemID] = itemViews[currentItemID].render();
            }
            viewContainer.appendChild(itemBuffer[currentItemID]);

            //Render submit page if at the last prompt.
        } else {

            surveyCompletedMenu = mwf.decorator.Menu('Survey Completed');
            surveyCompletedMenu.addMenuTextItem('Done with ' + surveyController.getSurveyModel().getTitle());
            viewContainer.appendChild(surveyCompletedMenu);
        }

        viewContainer.appendChild(controlButtons);

        return viewContainer;
    };

    that.nextButtonCallback = function () {};
    that.previousButtonCallback = function () {};
    that.skipButtonCallback = function () {};
    that.submitButtonCallback = function () {};

    return that;
};
