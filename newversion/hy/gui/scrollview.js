var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.ScrollView = hy.extend(hy.gui.View);
hy.gui.ScrollView.prototype.notifySyncContentOffsetX = "synccontentoffsetx";
hy.gui.ScrollView.prototype.notifySyncContentOffsetY = "synccontentoffsety";
hy.gui.ScrollView.prototype.notifySyncContentWidth = "synccontentwidth";
hy.gui.ScrollView.prototype.notifySyncContentHeight = "synccontentheight";
hy.gui.ScrollView.prototype.defaultWheelEnable = true;
hy.gui.ScrollView.prototype.defaultWheelStep = 20;
hy.gui.ScrollView.prototype.defaultWidthFit = false;
hy.gui.ScrollView.prototype.defaultHeightFit = false;
hy.gui.ScrollView.prototype.defaultBackgroundColor = "#f00";
hy.gui.ScrollView.prototype.defaultScrollBarVisible = true;
hy.gui.ScrollView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._widthFit = this.isUndefined(config.widthFit) ? this.defaultWidthFit : config.widthFit;
    this._heightFit = this.isUndefined(config.heightFit) ? this.defaultHeightFit : config.heightFit;
    this._wheelStep = this.isUndefined(config.wheelStep) ? this.defaultWheelStep : config.wheelStep;
    this._scrollBarVisible = this.isUndefined(config.scrollBarVisible) ? this.defaultScrollBarVisible : config.scrollBarVisible;
    this._contentView = this.isUndefined(config.contentView) ? (new hy.gui.View({normalColor:null,activeColor:null})) : config.contentView;
    this._horScrollBar = new hy.gui.ScrollBar({paddingLeft:0, paddingRight:0,paddingTop:1,paddingBottom:1,height:10,scrollDirection:0});
    this._verScrollBar = new hy.gui.ScrollBar({paddingLeft:1, paddingRight:1,paddingTop:0,paddingBottom:0,width:10,scrollDirection:1});
    this.addChildNodeAtLayer(this._contentView, 0);
    this.addChildNodeAtLayer(this._horScrollBar, 1);
    this.addChildNodeAtLayer(this._verScrollBar, 1);

    this._horScrollBar.addObserver(this._horScrollBar.notifyScrollBarDrag,this,this._syncLocalScrollFromHorBar);
    this._verScrollBar.addObserver(this._verScrollBar.notifyScrollBarDrag,this,this._syncLocalScrollFromVerBar);
    this.addObserver(this.notifySyncContentOffsetX, this, this._syncLocalScrollToHorBar);
    this.addObserver(this.notifySyncContentOffsetY, this, this._syncLocalScrollToVerBar);
    this.addObserver(this.notifySyncContentWidth, this, this.needLayoutSubNodes);
    this.addObserver(this.notifySyncContentHeight, this, this.needLayoutSubNodes);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutScrollView);
    this.addObserver(this.notifyMouseWheel, this, this._wheelScrollView);
}
hy.gui.ScrollView.prototype.setWidthFit = function(widthFit){
    this._widthFit = widthFit;
    this.needLayoutSubNodes();
}
hy.gui.ScrollView.prototype.getWidthFit = function(){
    return this._widthFit;
}
hy.gui.ScrollView.prototype.setHeightFit = function(heightFit){
    this._heightFit = heightFit;
    this.needLayoutSubNodes();
}
hy.gui.ScrollView.prototype.getHeightFit = function(){
    return this._heightFit;
}
//hy.gui.ScrollView.prototype.getContentView = function(){
//    return this._contentView;
//}
hy.gui.ScrollView.prototype.setContentOffsetX = function(offsetX){
    if(this._contentView.getX() != -offsetX){
        this._contentView.setX(-offsetX);
        this.postNotification(this.notifySyncContentOffsetX, null);
    }
}
hy.gui.ScrollView.prototype.getContentOffsetX = function(){
    return -this._contentView.getX();
}
hy.gui.ScrollView.prototype.setContentOffsetY = function(offsetY){
    if(this._contentView.getY() != -offsetY){
        this._contentView.setY(-offsetY);
        this.postNotification(this.notifySyncContentOffsetY, null);
    }
}
hy.gui.ScrollView.prototype.getContentOffsetY = function(){
    return -this._contentView.getY();
}
hy.gui.ScrollView.prototype.setContentWidth = function(width){
    if(this._contentView.getWidth() != width){
        this._contentView.setWidth(width);
        this.postNotification(this.notifySyncContentWidth, null);
    }
}
hy.gui.ScrollView.prototype.getContentWidth = function(){
    return this._contentView.getWidth();
}
hy.gui.ScrollView.prototype.setContentHeight = function(height){
    if(this._contentView.getHeight() != height){
        this._contentView.setHeight(height);
        this.postNotification(this.notifySyncContentHeight, null);
    }
}
hy.gui.ScrollView.prototype.getContentHeight = function(){
    return this._contentView.getHeight();
}
hy.gui.ScrollView.prototype._layoutScrollView = function(sender){
    this._horScrollBar.setX(0);
    this._horScrollBar.setY(this.getHeight() - this._horScrollBar.getHeight());
    this._horScrollBar.setWidth(this.getWidth());
    this._verScrollBar.setX(this.getWidth() - this._verScrollBar.getWidth());
    this._verScrollBar.setY(0);
    this._verScrollBar.setHeight(this.getHeight());
    if(this._scrollBarVisible){
        var horBarVisible = false;
        var verBarVisible = false;
        var width = this.getWidth();
        var height = this.getHeight();
        var minContentWidth = this._contentView.getWidth();
        var minContentHeight = this._contentView.getHeight();
        if(this.getWidthFit()){
            minContentWidth = this._contentView.getMinWidth();
        }
        if(this.getHeightFit()){
            minContentHeight = this._contentView.getMinHeight();
        }
        if(minContentWidth <= width && minContentHeight <= height){
            /*两者都不显示*/
            this._horScrollBar.setPaddingRight(0);
            this._verScrollBar.setPaddingBottom(0);
        }else if(minContentWidth > width && minContentHeight <= height - this._horScrollBar.getHeight()){
            /*只显示横向*/
            this._horScrollBar.setPaddingRight(this._verScrollBar.getWidth());
            this._verScrollBar.setPaddingBottom(0);
            horBarVisible = true;
            height = height - this._horScrollBar.getHeight();
        }else if(minContentHeight > height && minContentWidth <= width - this._verScrollBar.getWidth()){
            /*只显示纵向*/
            this._horScrollBar.setPaddingRight(0);
            this._verScrollBar.setPaddingBottom(this._horScrollBar.getHeight());
            verBarVisible = true;
            width = width - this._verScrollBar.getWidth();
        }else{
            /*两者都显示*/
            this._horScrollBar.setPaddingRight(this._verScrollBar.getWidth());
            this._verScrollBar.setPaddingBottom(this._horScrollBar.getHeight());
            horBarVisible = true;
            verBarVisible = true;
            width = width - this._verScrollBar.getWidth();
            height = height - this._horScrollBar.getHeight();
        }
        this._horScrollBar.setVisible(horBarVisible);
        this._verScrollBar.setVisible(verBarVisible);
        if(this.getWidthFit()){
            this._contentView.setWidth((width > minContentWidth) ? width : minContentWidth);
        }
        if(this.getHeightFit()){
            this._contentView.setHeight((height > minContentHeight) ? height : minContentHeight);
        }
    }else{
        if(this.getWidthFit()){
            if(this._contentView.getWidth() < this.getWidth()){
                this._contentView.setWidth(this.getWidth());
            }
        }
        if(this.getHeightFit()){
            if(this._contentView.getHeight() < this.getHeight()){
                this._contentView.setHeight(this.getHeight());
            }
        }
        this._hScrollBar.setVisible(false);
        this._hScrollBar.setVisible(false);
    }
    this._syncLocalScrollToHorBar(null);
    this._syncLocalScrollToVerBar(null);
}
hy.gui.ScrollView.prototype._wheelScrollView = function(sender, e){
    if(e.wheelDelta > 0){
        var newOffset = this.getContentOffsetY() - this._wheelStep;
        if(newOffset > 0){
            this.setContentOffsetY(newOffset);
        }else{
            this.setContentOffsetY(0);
        }
    }else{
        var newOffset = this.getContentOffsetY() + this._wheelStep;
        var overallHeight = this.getContentHeight();
        var visibleHeight = this.getHeight();
        if(this._horScrollBar.getVisible()){
            visibleHeight -= this._horScrollBar.getHeight();
        }
        if(newOffset + visibleHeight > overallHeight){
            this.setContentOffsetY(overallHeight - visibleHeight);
        }else{
            this.setContentOffsetY(newOffset);
        }
    }
}
hy.gui.ScrollView.prototype._syncLocalScrollToHorBar = function(sender){
    var overallWidth = this.getContentWidth();
    var scrolledWidth = this.getContentOffsetX();
    var visibleWidth = this.getWidth();
    if(this._verScrollBar.getVisible()){
        visibleWidth -= this._verScrollBar.getWidth();
    }
    this._horScrollBar.setScrollRate(scrolledWidth, visibleWidth, overallWidth);
}
hy.gui.ScrollView.prototype._syncLocalScrollToVerBar = function(sender){
    var overallHeight = this.getContentHeight();
    var scrolledHeight = this.getContentOffsetY();
    var visibleHeight = this.getHeight();
    if(this._horScrollBar.getVisible()){
        visibleHeight -= this._horScrollBar.getHeight();
    }
    this._verScrollBar.setScrollRate(scrolledHeight, visibleHeight, overallHeight);
}
hy.gui.ScrollView.prototype._syncLocalScrollFromHorBar = function(sender, e){
    var scrolledRate = this._horScrollBar.getScrollRate();
    this._contentView.setX(-scrolledRate.scrolledRate * this._contentView.getWidth());
}
hy.gui.ScrollView.prototype._syncLocalScrollFromVerBar = function(sender, e){
    var scrolledRate = this._verScrollBar.getScrollRate();
    this._contentView.setY(-scrolledRate.scrolledRate * this._contentView.getHeight());
}