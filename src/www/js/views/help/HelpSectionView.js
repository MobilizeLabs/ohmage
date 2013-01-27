
var HelpSectionView = function (section) {
    var that = {};
    that.render = function () {
        var image, textBlock, div, container;
        image = document.createElement('img');
        image.className = "help-section-image";
        image.src = section.img;
        textBlock = document.createElement('p');
        textBlock.className = "help-section-text";
        textBlock.innerHTML = section.text || "";
        div = document.createElement('div');
        div.className = "help-section-container";
        div.appendChild(image);
        div.appendChild(textBlock);
        container = mwf.decorator.Content(section.title);
        container.addItem(div);
        return container;
    };  
    return that;
};