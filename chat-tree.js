function ChatTree(element) {

    function load(items) {
        element.addEventListener("keydown",arrowsKeyboard);
        element.addEventListener("click",(e)=>{
            e.stopPropagation();
            e.target.focus();
        });
        element.addEventListener("dblclick",showHideGroups);

        clear();
        items.forEach((item)=>{
            let li = document.createElement("li");
            let span = document.createElement("span");
            span.setAttribute("tabindex","1");
            if(item.type !== "group"){
                span.appendChild(document.createTextNode(item.name));
            }

            li.appendChild(span);
            element.appendChild(li);
            if(item.type === "group"){
                span.innerHTML = ('&#128193'+item.name);
                span.classList.add("group");
                if(item.items.length>0){
                    let hiddenUL = _createHiddenUl(item.items);
                    if(!!hiddenUL){
                        li.appendChild(hiddenUL);
                    }

                }
            }
        });
        // override by main.js:
        element.querySelector(":scope >li >span").focus();
    }

    function arrowsKeyboard(e){
        if (e.keyCode == '38') {
            // up arrow
            let elements = document.querySelectorAll("li");
            let displayedElements =[];
            for(let i=0;i<elements.length; i++){
                if (elements[i].offsetParent !== null) {
                    displayedElements.push(elements[i]);
                }
            }
            let index = displayedElements.indexOf(e.target.parentElement);
            if(index>0){
                let elem = displayedElements[index-1];
                elem.querySelector("span").focus();
            }
        }
        else if (e.keyCode == '40') {
            // down arrow
            let elements = document.querySelectorAll("li");
            let displayedElements =[];
            for(let i=0;i<elements.length; i++){
                if (elements[i].offsetParent !== null) {
                    displayedElements.push(elements[i]);
                }
            }
            let index = displayedElements.indexOf(e.target.parentElement);
            if(index<displayedElements.length-1){
                let elem = displayedElements[index+1];
                elem.querySelector("span").focus();
            }
        }
        else if (e.keyCode == '37' && e.target.classList.contains("group")) {
            // left arrow
            let ul = e.target.parentElement.querySelector(":scope > ul");
            if(!!ul){
                if(ul.classList.contains("hidden")){
                    let parent = ul.parentElement.parentElement;
                    while(parent.tagName!== "LI"){
                        parent = parent.parentElement;
                        if(!parent){
                            return;
                        }
                    }
                    parent.querySelector(":scope > span").focus();
                }
                else{
                    ul.classList.add("hidden");
                }
            }
            else{
                let parent = e.target.parentElement.parentElement.parentElement
                parent.querySelector(":scope > span").focus();
            }
        }
        else if (e.keyCode == '39' && e.target.classList.contains("group")) {
            // right arrow
            let ul = e.target.parentElement.querySelector(":scope > ul");
            if(!!ul){
                ul.classList.remove("hidden");
            }
        }
    }

    function _createHiddenUl(items,level){
        let tab = '&nbsp'+'&nbsp'+'&nbsp'+'&nbsp';
        if(level===undefined){
            level = tab;
        }
        else{level+=tab;}
        let ul;
        if(items.length>0){
            ul = document.createElement("ul");
            ul.classList.add("hidden");
        }
        else {return ;}
        items.forEach((item)=> {
            let li = document.createElement("li");
            let span = document.createElement("span");
            // span.innerHTML = (level+item.name)
            if(item.type !== "group"){
                span.innerHTML = (level+item.name);
            }
            span.setAttribute("tabindex","1");;
            li.appendChild(span);
            ul.appendChild(li);
            if (item.type === "group") {
                span.innerHTML = (level+'&#128193'+item.name);
                span.classList.add("group");
                let hiddenUL = _createHiddenUl(item.items,level);
                if(!!hiddenUL){
                    li.appendChild(hiddenUL);
                }
            }
        });
        return ul;
    }

    function clear() {
        while(element.firstChild ){
            element.removeChild( element.firstChild );
        }
    }

    function showHideGroups(e){
        // debugger;
        e.stopPropagation();
        if(e.target.classList.contains("group")){
            let uls = e.target.parentElement.querySelectorAll(":scope > ul")
            for(let i=0;i<uls.length;i++){
                uls[i].classList.toggle("hidden");
            }
        }
    }

    return {
        load,
        clear,
        element,
    };
}