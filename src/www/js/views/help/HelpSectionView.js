var HelpSectionView = function (helpSection) {
    "use strict";
    var that = AbstractView();

    that.render = function () {

        var image = document.createElement('img');
        image.className = "help-section-image";
        image.src = helpSection.img;

        var textBlock = document.createElement('p');
        textBlock.className = "help-section-text";
        textBlock.innerHTML = helpSection.text || "";

        var div = document.createElement('div');
        div.className = "help-section-container";
        div.appendChild(image);
        div.appendChild(textBlock);

        var container = mwf.decorator.Content(helpSection.title);
        container.addItem(div);
        return container;
    };
    return that;
};