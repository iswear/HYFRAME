HY.GUI.MScrollView = function(config){
    this.init(config);
}
HY.GUI.MScrollView.prototype = new HY.GUI.View();
HY.GUI.MScrollView.prototype.defaultWidthFit = false;
HY.GUI.MScrollView.prototype.defaultHeightFit = false;
HY.GUI.MScrollView.prototype.initMember = function(config) {
    this.superCall("initMember",[config]);
    if(config.contentView != undefined){ this._contentView = config.contentView; } else { this._contentView = new HY.GUI.MScrollContentView({}); }
    if(config.widthFit != undefined){ this._widthFit = config.widthFit; } else { this._widthFit = this.defaultWidthFit; }
    if(config.heightFit != undefined){ this._heightFit = config.heightFit; } else { this._heightFit = this.defaultHeightFit; }
}
HY.GUI.MScrollView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this._contentView.setX(0);
    this._contentView.setY(0);
    this._contentView.addEventListener("xchanged",this._contentViewXChanged,this);
    this._contentView.addEventListener("ychanged",this._contentViewHeightChanged,this);
    this._contentView.addEventListener("widthchanged",this._contentViewWidthChanged,this);
    this._contentView.addEventListener("heightchanged",this._contentViewHeightChanged,this);
    this.addChildNodeAtLayer(this._contentView,0);
}
HY.GUI.MScrollView.prototype.getWidthFit = function(){
    return this._widthFit;
}
HY.GUI.MScrollView.prototype.setWidthFit = function(widthFit){
    this._widthFit = widthFit;
}
HY.GUI.MScrollView.prototype.getHeightFit = function(){
    return this._heightFit;
}
HY.GUI.MScrollView.prototype.setHeightFit = function(heightFit){
    this._heightFit = heightFit;
}
HY.GUI.MScrollView.prototype.getContentView = function(){
    return this._contentView;
}
HY.GUI.MScrollView.prototype.setContentView = function(view){
    if(view && this._contentView != view){
        this._contentView.removeFromParent();
        this._contentView = view;
        this._contentView.setX(0);
        this._contentView.setY(0);
        this._contentView.addEventListener("xchanged",this._contentViewXChanged,this);
        this._contentView.addEventListener("ychanged",this._contentViewHeightChanged,this);
        this._contentView.addEventListener("widthchanged",this._contentViewWidthChanged,this);
        this._contentView.addEventListener("heightchanged",this._contentViewHeightChanged,this);
        this.addChildNodeAtLayer(this._contentView,0);
        this.needLayoutSubNodes();
    }
}
HY.GUI.MScrollView.prototype.getContentOffsetX = function(){
    return -this._contentView.getX();
}
HY.GUI.MScrollView.prototype.setContentOffsetX = function(x){
    this._contentView.setX(-x);
}
HY.GUI.MScrollView.prototype.getContentOffsetY = function(){
    return -this._contentView.getY();
}
HY.GUI.MScrollView.prototype.setContentOffsetY = function(y){
    this._contentView.setY(-y);
}
HY.GUI.MScrollView.prototype.getContentWidth = function(){
    return this._contentView.getWidth();
}
HY.GUI.MScrollView.prototype.setContentWidth = function(width){
    this._contentView.setWidth(width);
}
HY.GUI.MScrollView.prototype.getContentHeight = function(){
    return this._contentView.getHeight();
}
HY.GUI.MScrollView.prototype.setContentHeight = function(height){
    this._contentView.setHeight(height);
}
HY.GUI.MScrollView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    var contentOffsetX = this.getContentOffsetX();
    var contentOffsetY = this.getContentOffsetY();
    var showWidth = this.getWidth();
    var showHeight = this.getHeight();
    var contentWidth, contentHeight;
    if(this.getWidthFit()){
        if(this._contentView.getMinLayoutWidth() < showWidth){
            contentWidth = showWidth;
        }else{
            contentWidth = this._contentView.getMinLayoutWidth();
        }
    }else{
        contentWidth = this._contentView.getWidth();
    }
    if(this.getHeightFit()){
        if(this._contentView.getMinLayoutHeight() < showHeight){
            contentHeight = showHeight;
        }else{
            contentHeight = this._contentView.getMinLayoutHeight();
        }
    }else{
        contentHeight = this._contentView.getHeight();
    }
    var width = (contentWidth>showWidth)?(contentWidth-showWidth):0;
    var height = (contentHeight>showHeight)?(contentHeight-showHeight):0;
    if(contentOffsetX > width){
        contentOffsetX = width;
    }
    if(contentOffsetY > height){
        contentOffsetY = height;
    }
    this._contentView.setLimitMinX(-width);
    this._contentView.setLimitMaxX(0);
    this._contentView.setLimitMinY(-height);
    this._contentView.setLimitMaxY(0);
    this.setContentWidth(contentWidth);
    this.setContentHeight(contentHeight);
    this.setContentOffsetX(contentOffsetX);
    this.setContentOffsetY(contentOffsetY);
}
HY.GUI.MScrollView.prototype._contentViewWidthChanged = function(){
    this.needLayoutSubNodes();
}
HY.GUI.MScrollView.prototype._contentViewHeightChanged = function(){
    this.needLayoutSubNodes();
}
