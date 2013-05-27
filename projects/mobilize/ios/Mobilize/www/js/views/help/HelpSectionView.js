var HelpSectionView = function(section){
    var self = {};
    self.render = function(){
        
        var image = document.createElement('img');
        image.className = "help-section-image";
        image.src = section.img;

        var textBlock = document.createElement('p');
        textBlock.className = "help-section-text";
        textBlock.innerHTML = section.text || "";
        
        var div = document.createElement('div');
        div.className = "help-section-container";
        div.appendChild(image);
        div.appendChild(textBlock);
        
        var container = mwf.decorator.Content(section.title);
        container.addItem(div);
        return container;
    };  
    return self;
};