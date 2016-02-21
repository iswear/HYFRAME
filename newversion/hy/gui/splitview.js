var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.SplitView = hy.extend(hy.gui.View);
hy.gui.SplitView.prototype.defaultSplitSpace = 4;
hy.gui.SplitView.prototype.defaultAdjustEnable = true;
hy.gui.SplitView.prototype.defaultSplitDirection = 0;
hy.gui.SplitView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._splitViews = this.isUndefined(config.splitViews) ? null : config.splitViews;
    this._splitSpace = this.isUndefined(config.splitSpace) ? this.defaultSplitSpace : config.splitSpace;
    this._splitDirection = this.isUndefined(config.splitDirection) ? this.defaultSplitDirection : config.splitDirection;
    this._splitInitLayout = this.isUndefined(config.splitInitLayout) ? null : config.splitInitLayout;
    this._adjustEnable = this.isUndefined(config.adjustEnable) ? this.defaultAdjustEnable : config.adjustEnable;
    this._autoAdjustViewIndex = this.isUndefined(config.autoAdjustViewIndex) ? -1 : config.autoAdjustViewIndex;
    this._splitSpaceViews = [];
    this.addObserver(this.notifySyncWidth, this, this._resizeSplitViewWidth);
    this.addObserver(this.notifySyncHeight, this, this._resizeSplitViewHeight);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutSplitViews);
}
hy.gui.SplitView.prototype.sync = function(){
    this.superCall("sync",null);
    this._syncSplitSpaceViews();
}
hy.gui.SplitView.prototype._syncSplitSpaceViews = function(){
    if(this._splitViews && this._splitViews.length > 0){
        var viewCount = this._splitViews.length;
        /*删除残存分割视图*/
        for(var i=this._splitSpaceViews.length-1;i>=0;--i){
            this._splitSpaceViews[i].removeFromParent(true);
            this._splitSpaceViews.splice(i,1);
        }
        /*添加所有需要视图*/
        for(var i = 0; i<viewCount ; ++i){
            this.addChildNodeAtLayer(this._splitViews[i], 0);
            if(i < viewCount -1){
                var spaceView = new hy.gui.View({
                    mouseEnable:true,
                    dragEnable:this._adjustEnable,
                    normalColor:'#aaa'
                });
                if(this._adjustEnable){
                    if(this._splitDirection == 0){
                        spaceView.setMinY(0);
                        spaceView.setMaxY(0);
                        spaceView.setCursor("ew-resize");
                    }else{
                        spaceView.setMinX(0);
                        spaceView.setMaxX(0);
                        spaceView.setCursor("ns-resize");
                    }
                    spaceView.addObserver(this.notifyDraging,this,this.needLayoutSubNodes);
                }else{
                    spaceView.setCursor(null);
                }
                spaceView.addObserver();
                this._splitSpaceViews.push(spaceView);
                this.addChildNodeAtLayer(spaceView, 0);
            }
        }
        /*初始化布局*/
        if(this._splitDirection == 0){
            if(!this._splitInitLayout || this._splitInitLayout.length != viewCount){
                this._splitInitLayout = [];
                var averageWidth = this.getWidth() - this._splitSpace * (viewCount - 1);
                var averageViewWidth = averageWidth / viewCount;
                var x = 0;
                for(var i = 0, splitViewCount = viewCount - 1; i < splitViewCount ; ++i){
                    x += averageViewWidth;
                    this._splitSpaceViews[i].setX(x);
                    x += this._splitSpace;
                }
            }else{
                var x = 0;
                for(var i = 0, splitViewCount = (this._autoAdjustViewIndex < viewCount) ? this._autoAdjustViewIndex : (viewCount - 1) ; i < splitViewCount ; ++i){
                    x += this._splitInitLayout[i];
                    this._splitSpaceViews[i].setX(x);
                    x += this._splitSpace;
                }
                var reverseX = this.getWidth();
                for(var i = viewCount - 1 ; i > this._autoAdjustViewIndex ; --i){
                    reverseX -= (this._splitInitLayout[i]+this._splitSpace);
                    this._splitSpaceViews[i-1].setX(reverseX);
                }
            }
        }else{
            if(!this._splitInitLayout || this._splitInitLayout.length != viewCount){
                this._splitInitLayout = [];
                var averageHeight = this.getHeight() - this._splitSpace * (viewCount - 1);
                var averageViewHeight = averageHeight / viewCount;
                var y = 0;
                for(var i = 0, splitViewCount = viewCount - 1; i < splitViewCount ; ++i){
                    y += averageViewHeight;
                    this._splitSpaceViews[i].setY(y);
                    y += this._splitSpace;
                }
            }else{
                var y = 0;
                for(var i = 0, splitViewCount = (this._autoAdjustViewIndex < viewCount) ? this._autoAdjustViewIndex : (viewCount - 1) ; i < splitViewCount ; ++i){
                    y += this._splitInitLayout[i];
                    this._splitSpaceViews[i].setY(y);
                    y += this._splitSpace;
                }
                var reverseY = this.getHeight();
                for(var i = viewCount - 1 ; i > this._autoAdjustViewIndex ; --i){
                    reverseY -= (this._splitInitLayout[i]+this._splitSpace);
                    this._splitSpaceViews[i-1].setX(reverseY);
                }
            }
        }
    }else{
        for(var i=this._splitSpaceViews.length-1;i>=0;--i){
            this._splitSpaceViews[i].removeFromParent(true);
        }
    }
}
hy.gui.SplitView.prototype._resizeSplitViewWidth = function(){
    if(this._splitDirection == 0){
        var viewCount = this._splitViews.length;
        if(this._autoAdjustViewIndex < 0){
            var x = 0;
            for(var i = 0, splitViewCount = viewCount - 1 ; i < splitViewCount ; ++i){
                x += this._splitViews[i].getWidth();
                this._splitSpaceViews[i].setX(x);
                x += this._splitSpace;
            }
        }else{
            var x = 0;
            for(var i = 0, splitViewCount = (this._autoAdjustViewIndex < viewCount) ? this._autoAdjustViewIndex : (viewCount - 1) ; i < splitViewCount ; ++i){
                x += this._splitViews[i].getWidth();
                this._splitSpaceViews[i].setX(x);
                x += this._splitSpace;
            }
            var reverseX = this.getWidth();
            for(var i = viewCount - 1 ; i > this._autoAdjustViewIndex ; --i){
                reverseX -= (this._splitViews[i].getWidth()+this._splitSpace);
                this._splitSpaceViews[i-1].setX(reverseX);
            }
        }
    }
}
hy.gui.SplitView.prototype._resizeSplitViewHeight = function(){
    if(this._splitDirection != 0){
        var viewCount = this._splitViews.length;
        if(this._autoAdjustViewIndex < 0) {
            var y = 0;
            for(var i = 0, splitViewCount = viewCount - 1 ; i < splitViewCount ; ++i){
                y += this._splitViews[i].getHeight();
                this._splitSpaceViews[i].setY(y);
                y += this._splitSpace;
            }
        }else{
            var y = 0;
            for(var i = 0, splitViewCount = (this._autoAdjustViewIndex < viewCount) ? this._autoAdjustViewIndex : (viewCount - 1) ; i < splitViewCount ; ++i){
                y += this._splitViews[i].getHeight();
                this._splitSpaceViews[i].setY(y);
                y += this._splitSpace;
            }
            var reverseY = this.getHeight();
            for(var i = viewCount - 1 ; i > this._autoAdjustViewIndex ; --i){
                reverseY -= (this._splitViews[i].getHeight()+this._splitSpace);
                this._splitSpaceViews[i-1].setX(reverseY);
            }
        }
    }
}
hy.gui.SplitView.prototype._layoutSplitViews = function(){
    if(this._splitDirection == 0){
        var viewCount = this._splitViews.length;
        for(var i = 0; i < viewCount ; ++i){
            if(i == 0){
                var splitView = this._splitViews[i];
                var spaceView = this._splitSpaceViews[i];
                spaceView.setWidth(this._splitSpace);
                spaceView.setHeight(this.getHeight());
                spaceView.setMinX(0);
                splitView.setX(0);
                splitView.setY(0);
                splitView.setWidth(spaceView.getX());
                splitView.setHeight(this.getHeight());
            }else if(i == viewCount -1){
                var splitView = this._splitViews[i];
                var preSpaceView = this._splitSpaceViews[i-1];
                preSpaceView.setMaxX(this.getWidth()-this._splitSpace);
                splitView.setX(preSpaceView.getX()+this._splitSpace);
                splitView.setY(0);
                splitView.setWidth(this.getWidth()-splitView.getX());
                splitView.setHeight(this.getHeight());
            }else{
                var splitView = this._splitViews[i];
                var spaceView = this._splitSpaceViews[i];
                var preSpaceView = this._splitSpaceViews[i-1];
                spaceView.setWidth(this._splitSpace);
                spaceView.setHeight(this.getHeight());
                spaceView.setMinX(preSpaceView.getX()+this._splitSpace);
                preSpaceView.setMaxX(spaceView.getX()-this._splitSpace);
                splitView.setX(preSpaceView.getX()+this._splitSpace);
                splitView.setY(0);
                splitView.setWidth(spaceView.getX()-preSpaceView.getX()-this._splitSpace);
                splitView.setHeight(this.getHeight());
            }
        }
    }else{
        var viewCount = this._splitViews.length;
        for(var i = 0; i < viewCount ; ++i){
            if(i == 0){
                var splitView = this._splitViews[i];
                var spaceView = this._splitSpaceViews[i];
                spaceView.setWidth(this.getWidth());
                spaceView.setHeight(this._splitSpace);
                spaceView.setMinX(0);
                splitView.setX(0);
                splitView.setY(0);
                splitView.setWidth(this.getWidth());
                splitView.setHeight(spaceView.getX());
            }else if(i == viewCount -1){
                var splitView = this._splitViews[i];
                var preSpaceView = this._splitSpaceViews[i-1];
                preSpaceView.setMaxY(this.getHeight()-this._splitSpace);
                splitView.setX(0);
                splitView.setY(preSpaceView.getY()+this._splitSpace);
                splitView.setWidth(this.getWidth());
                splitView.setHeight(this.getHeight()-splitView.getY());
            }else{
                var splitView = this._splitViews[i];
                var spaceView = this._splitSpaceViews[i];
                var preSpaceView = this._splitSpaceViews[i-1];
                spaceView.setWidth(this.getWidth());
                spaceView.setHeight(this._splitSpace);
                spaceView.setMinY(preSpaceView.getY()+this._splitSpace);
                preSpaceView.setMaxY(spaceView.getY()-this._splitSpace);
                splitView.setX(0);
                splitView.setY(preSpaceView.getY()+this._splitSpace);
                splitView.setWidth(this.getWidth());
                splitView.setHeight(spaceView.getY()-preSpaceView.getY()-this._splitSpace);
            }
        }
    }
}