var hy = hy || {};
hy.platform = {};
hy.platform.isMobile = function(){
    if(hy.platform._isMobile == undefined){
        hy.platform._isMobile = (navigator.userAgent.toLowerCase().indexOf("mobile") != -1);
    }
    return hy.platform._isMobile;
}
hy.platform.isDeskTop = function(){
    if(hy.platform._isMobile == undefined){
        hy.platform._isMobile = (navigator.userAgent.toLowerCase().indexOf("mobile") != -1);
    }
    return !hy.platform._isMobile;
}
hy.platform.isIE = function(){
    if(hy.platform._isIE == undefined){
        hy.platform._isIE = (navigator.userAgent.toLowerCase().indexOf("msie") != -1);
    }
    return hy.platform._isIE;
}