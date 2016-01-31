HY.GUI.ScrollView = function(config){
	this.init(config);
}
HY.GUI.ScrollView.prototype = new HY.GUI.View();
HY.GUI.ScrollView.prototype.defaultBackgroundColor = "#ffffff";
HY.GUI.ScrollView.prototype.defaultScrollEnable = true;
HY.GUI.ScrollView.prototype.defaultScrollStep = 20;
HY.GUI.ScrollView.prototype.defaultWidthFit = false;
HY.GUI.ScrollView.prototype.defaultHeightFit = false;
HY.GUI.ScrollView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.widthFit){ this._widthFit = config.widthFit; } else { this._widthFit = this.defaultWidthFit; }
    if(config.heightFit){ this._heightFit = config.heightFit; } else { this._heightFit = this.defaultHeightFit; }
    if(config.scrollStep != undefined){ this._scrollStep = config.scrollStep; } else { this._scrollStep = this.defaultScrollStep; }
    if(config.contentView != undefined){ this._contentView = config.contentView; } else { this._contentView = new HY.GUI.View({}); }
    this._hScrollBar = new HY.GUI.ScrollBar({
        scrollBarDirection:0,
        scrollBarWidth:10,
        scrollBarLength:this.getWidth(),
        x:0,
        y:this.getHeight()-10
    });
    this._vScrollBar = new HY.GUI.ScrollBar({
        scrollBarDirection:1,
        scrollBarWidth:10,
        scrollBarLength:this.getHeight(),
        x:this.getWidth()-10,
        y:0
    });
}
HY.GUI.ScrollView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("mousewheel",this._selfMouseWheel,this);
    this._hScrollBar.addEventListener("scroll",this._hScrollBarScroll,this);
    this._vScrollBar.addEventListener("scroll",this._vScrollBarScroll,this);
    this._contentView.setX(0);
    this._contentView.setY(0);
    this._contentView.addEventListener("xchanged",this._contentViewXChanged,this);
    this._contentView.addEventListener("ychanged",this._contentViewYChanged,this);
    this._contentView.addEventListener("widthchanged",this._contentViewWidthChanged,this);
    this._contentView.addEventListener("heightchanged",this._contentViewHeightChanged,this);
    this.addChildNodeAtLayer(this._contentView,0);
    this.addChildNodeAtLayer(this._vScrollBar,1);
    this.addChildNodeAtLayer(this._hScrollBar,1);
}
HY.GUI.ScrollView.prototype.getWidthFit = function(){
    return this._widthFit;
}
HY.GUI.ScrollView.prototype.setWidthFit = function(widthFit){
    this._widthFit = widthFit;
}
HY.GUI.ScrollView.prototype.getHeightFit = function(){
    return this._heightFit;
}
HY.GUI.ScrollView.prototype.setHeightFit = function(heightFit){
    this._heightFit = heightFit;
}
HY.GUI.ScrollView.prototype.setContentView = function(pView){
	if(this._contentView != pView){
        this._contentView.removeFromParent(false);
        this._contentView = pView;
        this._contentView.setX(0);
        this._contentView.setY(0);
        this._contentView.addEventListener("xchanged",this._contentViewXChanged,this);
        this._contentView.addEventListener("ychanged",this._contentViewYChanged,this);
        this._contentView.addEventListener("widthchanged",this._contentViewWidthChanged,this);
        this._contentView.addEventListener("heightchanged",this._contentViewHeightChanged,this);
        this.addChildNodeAtLayer(pView,0);
	}
}
HY.GUI.ScrollView.prototype.getContentView = function(){
	return this._contentView;
}
HY.GUI.ScrollView.prototype.getScrollStep = function(){
    return this._scrollStep;
}
HY.GUI.ScrollView.prototype.setScrollStep = function(scrollStep){
    this._scrollStep = scrollStep;
}
HY.GUI.ScrollView.prototype.getContentOffsetX = function(){
    return -this._contentView.getX();
}
HY.GUI.ScrollView.prototype.setContentOffsetX = function(pX){
	this._contentView.setX(-pX);
}
HY.GUI.ScrollView.prototype.getContentOffsetY = function(){
    return -this._contentView.getY();
}
HY.GUI.ScrollView.prototype.setContentOffsetY = function(pY){
	this._contentView.setY(-pY);
}
HY.GUI.ScrollView.prototype.getShowWidth = function(){
    return (this._vScrollBar.getVisible())?(this.getWidth()-this._vScrollBar.getScrollBarWidth()):this.getWidth();
}
HY.GUI.ScrollView.prototype.getShowHeight = function(){
    return (this._hScrollBar.getVisible())?(this.getHeight()-this._hScrollBar.getScrollBarWidth()):this.getHeight();
}
HY.GUI.ScrollView.prototype.getContentWidth = function(){
    return this._contentView.getWidth();
}
HY.GUI.ScrollView.prototype.setContentWidth = function(pWidth){
	this._contentView.setWidth(pWidth);
}
HY.GUI.ScrollView.prototype.getContentHeight = function(){
    return this._contentView.getHeight();
}
HY.GUI.ScrollView.prototype.setContentHeight = function(pHeight){
	this._contentView.setHeight(pHeight);
}
HY.GUI.ScrollView.prototype.setHScrollParam = function(pOffsetLen,pShowLen,pFullLen){
    var showWidth = this.getShowWidth();
    this._contentView.setX(-showWidth*pOffsetLen/pShowLen);
    this._contentView.setWidth(showWidth*pFullLen/pShowLen);
}
HY.GUI.ScrollView.prototype.getHScrollParam = function(){
    var offsetX = this.getContentOffsetX();
    var showWidth = this.getShowWidth();
    var contentWidth = this.getContentWidth();
    offsetX = (offsetX+showWidth>contentWidth)?(contentWidth-showWidth):offsetX;
    return {offsetLen:offsetX,showLen:showWidth,fullLen:contentWidth};
}
HY.GUI.ScrollView.prototype.setVScrollParam = function(pOffsetLen,pShowLen,pFullLen){
    var showHeight = this.getShowHeight();
    this._contentView.setY(-showHeight*pOffsetLen/pShowLen);
    this._contentView.setWidth(showHeight*pFullLen/pShowLen);
}
HY.GUI.ScrollView.prototype.getVScrollParam = function(){
    var offsetY = this.getContentOffsetY();
    var showHeight = this.getShowHeight();
    var contentHeight = this.getContentHeight();
    offsetY = (offsetY+showHeight>contentHeight)?(contentHeight-showHeight):offsetY;
    return {offsetLen:offsetY,showLen:showHeight,fullLen:contentHeight};
}
HY.GUI.ScrollView.prototype.checkScrollBarStatus = function(){
    this._hScrollBar.setY(this.getHeight()-this._vScrollBar.getScrollBarWidth());
    this._hScrollBar.setScrollBarLength(this.getWidth());
    this._vScrollBar.setX(this.getWidth()-this._hScrollBar.getScrollBarWidth());
    this._vScrollBar.setScrollBarLength(this.getHeight());
    var contentWidth, contentHeight;
    if(this.getWidthFit()){
        contentWidth = this._contentView.getMinLayoutWidth();
    }else{
        contentWidth = this._contentView.getWidth();
    }
    if(this.getHeightFit()){
        contentHeight = this._contentView.getMinLayoutHeight();
    }else{
        contentHeight = this._contentView.getHeight();
    }
    if(contentWidth <= this.getWidth() - this._vScrollBar.getScrollBarWidth()){
        this._hScrollBar.setVisible(false);
        if(contentHeight > this.getHeight()){
            this._vScrollBar.setVisible(true);
        }else{
            this._vScrollBar.setVisible(false);
        }
    }else if(contentWidth <= this.getWidth()){
        if(contentHeight > this.getHeight()){
            this._hScrollBar.setVisible(true);
            this._vScrollBar.setVisible(true);
        }else{
            this._hScrollBar.setVisible(false);
            this._vScrollBar.setVisible(false);
        }
    }else{
        this._hScrollBar.setVisible(true);
        if(contentHeight > this.getHeight() - this._hScrollBar.getScrollBarWidth()){
            this._vScrollBar.setVisible(true);
        }else{
            this._vScrollBar.setVisible(false);
        }
    }
    if(this._vScrollBar.getVisible()){
        this._hScrollBar.setInsetRB(this._vScrollBar.getScrollBarWidth());
    }else{
        this._hScrollBar.setInsetRB(0);
    }
    if(this._hScrollBar.getVisible()){
        this._vScrollBar.setInsetRB(this._hScrollBar.getScrollBarWidth());
    }else{
        this._vScrollBar.setInsetRB(0);
    }
    if(this.getWidthFit()){
        var showWidth = this.getShowWidth();
        if(showWidth > contentWidth){
            this._contentView.setWidth(showWidth);
        }else{
            this._contentView.setWidth(contentWidth);
        }
    }
    if(this.getHeightFit()){
        var showHeight = this.getShowHeight();
        if(showHeight > contentHeight){
            this._contentView.setHeight(showHeight);
        }else{
            this._contentView.setHeight(contentHeight);
        }
    }
}
HY.GUI.ScrollView.prototype.updateToHScrollBar = function(){
	var scrollparam = this.getHScrollParam();
	this._hScrollBar.setScrollParam(scrollparam.offsetLen,scrollparam.showLen,scrollparam.fullLen);
}
HY.GUI.ScrollView.prototype.updateToVScrollBar = function(){
	var scrollparam = this.getVScrollParam();
	this._vScrollBar.setScrollParam(scrollparam.offsetLen,scrollparam.showLen,scrollparam.fullLen);
}
HY.GUI.ScrollView.prototype.updateToScrollBar = function(){
	this.checkScrollBarStatus();
	this.updateToHScrollBar();
	this.updateToVScrollBar();
}
HY.GUI.ScrollView.prototype.updateFromHScrollBar = function(){
	var scrollparam = this._hScrollBar.getScrollParam();
	this.setHScrollParam(scrollparam.offsetLen,scrollparam.showLen,scrollparam.fullLen);
}
HY.GUI.ScrollView.prototype.updateFromVScrollBar = function(){
	var scrollparam = this._vScrollBar.getScrollParam();
	this.setVScrollParam(scrollparam.offsetLen,scrollparam.showLen,scrollparam.fullLen);
}
HY.GUI.ScrollView.prototype.updateFromScrollBar = function(){
	this.updateFromHScrollBar();
	this.updateFromVScrollBar();
}
HY.GUI.ScrollView.prototype.onContentOffsetXChanged = function(sender){
    this.launchEvent("contentoffsetxchanged",[this]);
}
HY.GUI.ScrollView.prototype.onContentOffsetYChanged = function(sender){
    this.launchEvent("contentoffsetychanged",[this]);
}
HY.GUI.ScrollView.prototype.onContentWidthChanged = function(sender){
    this.launchEvent("contentwidthchanged",[this]);
}
HY.GUI.ScrollView.prototype.onContentHeightChanged = function(sender){
    this.launchEvent("contentheightchanged",[this]);
}
HY.GUI.ScrollView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    this.updateToScrollBar();
}
HY.GUI.ScrollView.prototype._selfMouseWheel = function(sender,e){
    var offsetY = this.getContentOffsetY();
    var contentHeight = this.getContentHeight();
    var showHeight = this._hScrollBar.getVisible()?(this.getHeight()-this._hScrollBar.getHeight()):this.getHeight();
    if(e.wheelDelta > 0){
        offsetY -= this._scrollStep;
        if(offsetY < 0){
            this.setContentOffsetY(0);
        }else{
            this.setContentOffsetY(offsetY);
        }
    }else{
        if(contentHeight > showHeight){
            offsetY += this._scrollStep;
            if(offsetY + showHeight > contentHeight){
                this.setContentOffsetY(contentHeight-showHeight);
            }else{
                this.setContentOffsetY(offsetY);
            }
        }else{
            this.setContentOffsetY(0);
        }
    }
}
HY.GUI.ScrollView.prototype._contentViewXChanged = function(){
    this.onContentOffsetXChanged(this);
    this.needLayoutSubNodes();
}
HY.GUI.ScrollView.prototype._contentViewYChanged = function(){
    this.onContentOffsetYChanged(this);
    this.needLayoutSubNodes();
}
HY.GUI.ScrollView.prototype._contentViewWidthChanged = function(){
    this.onContentWidthChanged(this);
    this.needLayoutSubNodes();
}
HY.GUI.ScrollView.prototype._contentViewHeightChanged = function(){
    this.onContentHeightChanged(this);
    this.needLayoutSubNodes();
}
HY.GUI.ScrollView.prototype._hScrollBarScroll = function(sender,e){
    this.updateFromHScrollBar();
}
HY.GUI.ScrollView.prototype._vScrollBarScroll = function(sender,e){
    this.updateFromVScrollBar();
}