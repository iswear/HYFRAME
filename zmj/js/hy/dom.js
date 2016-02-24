var hy = hy || {};
hy.dom = {};
hy.dom.getDocumentSize = function(){
    var size = {};
    if(window.innerHeight){
        size.width = window.innerWidth;
        size.height = window.innerHeight;
    }else if(window.document.documentElement.clientHeight){
        size.width = window.document.documentElement.clientWidth;
        size.height = window.document.documentElement.clientHeight;
    }else{
        size.width = window.document.body.clientWidth;
        size.height = window.document.body.clientHeight;
    }
    return size;
}
hy.dom.parsePxStrToInt = function(value){
    try{
        if(value.length > 2 && value.toLowerCase().indexOf("px") != -1){
            return parseInt(value.substr(0,value.length-2));
        }else{
            return 0;
        }
    }catch(err){
        return 0;
    }
}
hy.dom.getElementPositionInPage = function(element){
    var position = {x:0,y:0};
    /*
    if(element.offsetLeft){
        position.x = element.offsetLeft;
    }else{
        position.x = hy.dom.parsePxStrToInt(element.style.left);
    }
    if(element.offsetTop){
        position.y = element.offsetTop;
    }else{
        position.y = hy.dom.parsePxStrToInt(element.style.top);
    }
    */
    return position;
}