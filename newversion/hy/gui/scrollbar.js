var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.ScrollBar = hy.extend(hy.gui.View);
hy.gui.ScrollBar.prototype.notifySyncPaddingLeft = "syncpaddingleft";
hy.gui.ScrollBar.prototype.notifySyncPaddingRight = "syncpaddingright";
hy.gui.ScrollBar.prototype.notifySyncPaddingTop = "syncpaddingtop";
hy.gui.ScrollBar.prototype.notifySyncPaddingBottom = "syncpaddingbottom";
hy.gui.ScrollBar.prototype.notifySyncScrollRate = "syncscrolledrate";
hy.gui.ScrollBar.prototype.notifyScrollBarDrag = "scrollbardrag";
hy.gui.ScrollBar.prototype.defaultPaddingLeft = 0;
hy.gui.ScrollBar.prototype.defaultPaddingRight = 0;
hy.gui.ScrollBar.prototype.defaultPaddingTop = 0;
hy.gui.ScrollBar.prototype.defaultPaddingBottom = 0;
hy.gui.ScrollBar.prototype.defaultScrollDirection = 0;//0表示水平 1表示竖直方向
hy.gui.ScrollBar.prototype.defaultMouseEnable = false;
hy.gui.ScrollBar.prototype.defaultNormalColor = "#aaa";
hy.gui.ScrollBar.prototype.init = function(config){
    this.superCall("init",[config]);
    this._paddingLeft = this.isUndefined(config.paddingLeft) ? this.defaultPaddingLeft : config.paddingLeft;
    this._paddingRight = this.isUndefined(config.paddingRight) ? this.defaultPaddingRight : config.paddingRight;
    this._paddingTop = this.isUndefined(config.paddingTop) ? this.defaultPaddingTop : config.paddingTop;
    this._paddingBottom = this.isUndefined(config.paddingBottom) ? this.defaultPaddingBottom : config.paddingBottom;
    this._scrollDirection = this.isUndefined(config.scrollDirection) ? this.defaultScrollDirection : config.scrollDirection;
    this._scrollBar = new hy.gui.View({mouseEnable:true,dragEnable:true,normalColor:'#000',activeColor:'#000'});
    this.__scrolledRate = 0;
    this.__visibleRate = 0.5;
    this.addChildNodeAtLayer(this._scrollBar, 0);
    this._scrollBar.addObserver(this._scrollBar.notifyDraging, this, this._dragScrollBar);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutScrollBar);
    this.addObserver(this.notifySyncPaddingLeft, this, this.needLayoutSubNodes);
    this.addObserver(this.notifySyncPaddingRight, this, this.needLayoutSubNodes);
    this.addObserver(this.notifySyncPaddingTop, this, this.needLayoutSubNodes);
    this.addObserver(this.notifySyncPaddingBottom, this, this.needLayoutSubNodes);
    this.addObserver(this.notifySyncScrollRate, this, this.needLayoutSubNodes);
}
hy.gui.ScrollBar.prototype.setPaddingLeft = function(paddingLeft){
    if(this._paddingLeft != paddingLeft){
        this._paddingLeft = paddingLeft;
        this.postNotification(this.notifySyncPaddingLeft, null);
    }
}
hy.gui.ScrollBar.prototype.getPaddingLeft = function(){
    return this._paddingLeft;
}
hy.gui.ScrollBar.prototype.setPaddingRight = function(paddingRight){
    if(this._paddingRight != paddingRight){
        this._paddingRight = paddingRight;
        this.postNotification(this.notifySyncPaddingRight, null);
    }
}
hy.gui.ScrollBar.prototype.getPaddingRight = function(){
    return this._paddingRight;
}
hy.gui.ScrollBar.prototype.setPaddingTop = function(paddingTop){
    if(this._paddingTop != paddingTop){
        this._paddingTop = paddingTop;
        this.postNotification(this.notifySyncPaddingTop, null);
    }
}
hy.gui.ScrollBar.prototype.getPaddingTop = function(){
    return this._paddingTop;
}
hy.gui.ScrollBar.prototype.setPaddingBottom = function(paddingBottom){
    if(this._paddingBottom != paddingBottom){
        this._paddingBottom = paddingBottom;
        this.postNotification(this.notifySyncPaddingBottom, null);
    }
}
hy.gui.ScrollBar.prototype.getPaddingBottom = function(){
    return this._paddingBottom;
}
hy.gui.ScrollBar.prototype.setScrollRate = function(scrolledLen,visibleLen,overallLen){
    var scrolledRate = scrolledLen / overallLen;
    var visibleRate = visibleLen / overallLen;
    if(this.__scrolledRate != scrolledRate || this.__visibleRate != visibleRate){
        this.__scrolledRate = scrolledLen / overallLen;
        this.__visibleRate = visibleLen / overallLen;

        this.postNotification(this.notifySyncScrollRate, null);
    }
}
hy.gui.ScrollBar.prototype.getScrollRate = function(){
    return {scrolledRate:this.__scrolledRate, visibleRate:this.__visibleRate, overallRate:1};
}
hy.gui.ScrollBar.prototype._dragScrollBar = function(sender, e){
    if(this._scrollDirection == 0){
        var overallLen = this.getWidth() - this._paddingLeft - this._paddingRight;
        var scrolledLen = this._scrollBar.getX() - this._paddingLeft;
        this.__scrolledRate = scrolledLen / overallLen;
    }else{
        var overallLen = this.getHeight() - this._paddingTop - this._paddingBottom;
        var scrolledLen = this._scrollBar.getY() - this._paddingTop;
        this.__scrolledRate = scrolledLen / overallLen;
    }
    this.postNotification(this.notifyScrollBarDrag, [e]);
}
hy.gui.ScrollBar.prototype._layoutScrollBar = function(sender){
    if(this.__visibleRate >= 1){
        this._scrollBar.setVisible(false);
    }else{
        var width = this.getWidth() - this._paddingLeft - this._paddingRight;
        var height = this.getHeight() - this._paddingTop - this._paddingBottom;
        if(width > 0 && height > 0){
            if(this._scrollDirection == 0){
                var scrolledLen = this.__scrolledRate * width;
                var visibleLen = this.__visibleRate * width;
                this._scrollBar.setVisible(true);
                this._scrollBar.setX(scrolledLen + this._paddingLeft);
                this._scrollBar.setY(this._paddingTop);
                this._scrollBar.setWidth(visibleLen);
                this._scrollBar.setHeight(height);
                this._scrollBar.setMinX(this._paddingLeft);
                this._scrollBar.setMaxX(width + this._paddingLeft - visibleLen);
                this._scrollBar.setMinY(this._paddingTop);
                this._scrollBar.setMaxY(this._paddingTop);
            }else{
                var scrolledLen = this.__scrolledRate * height;
                var visibleLen = this.__visibleRate * height;
                this._scrollBar.setVisible(true);
                this._scrollBar.setX(this._paddingLeft);
                this._scrollBar.setY(scrolledLen + this._paddingTop);
                this._scrollBar.setWidth(width);
                this._scrollBar.setHeight(visibleLen);
                this._scrollBar.setMinX(this._paddingLeft);
                this._scrollBar.setMaxX(this._paddingLeft);
                this._scrollBar.setMinY(this._paddingTop);
                this._scrollBar.setMaxY(height + this._paddingTop - visibleLen);
            }
        }else{
            this._scrollBar.setVisible(false);
        }
    }
}
