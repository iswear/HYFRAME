HY.GUI.SplitView = function(config){
    this.init(config);
}
HY.GUI.SplitView.prototype = new HY.GUI.View();
HY.GUI.SplitView.prototype.defaultSplitDirection = 0;			//水平划分
HY.GUI.SplitView.prototype.defaultSplitSpace = 4;
HY.GUI.SplitView.prototype.defaultAdjustEnable = true;
HY.GUI.SplitView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.splitSpace != undefined){ this._splitSpace = config.splitSpace; } else { this._splitSpace = this.defaultSplitSpace; }
    if(config.splitViews != undefined){ this._splitViews = config.splitViews; } else { this._splitViews = null; }
    if(config.splitInitLayout != undefined){ this._splitInitLayout = config.splitInitLayout; } else { this._splitInitLayout = null; }
    if(config.splitDirection != undefined){ this._splitDirection = config.splitDirection; } else { this._splitDirection = this.defaultSplitDirection; }
    if(config.adjustEnable != undefined){ this._adjustEnable = config.adjustEnable; } else { this._adjustEnable = this.defaultAdjustEnable; }
    if(config.autoAdjustViewIndex != undefined){ this._autoAdjustViewIndex = config.autoAdjustViewIndex; } else { this._autoAdjustViewIndex = -1; }
    this._splitSpaceViews = [];
}
HY.GUI.SplitView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("widthchanged",this._selfWidthChanged,this);
    this.addEventListener("heightchanged",this._selfHeightChanged,this);
    this.setSplitViews(this._splitViews,this._splitInitLayout);
}
HY.GUI.SplitView.prototype.getAutoAdjustViewIndex = function(){
    return this._autoAdjustViewIndex;
}
HY.GUI.SplitView.prototype.setAutoAdjustViewIndex = function(pIndex){
    this._autoAdjustViewIndex = pIndex;
}
HY.GUI.SplitView.prototype.getSplitViews = function(){
    return this._splitViews;
}
HY.GUI.SplitView.prototype.setSplitViews = function(pSplitViews,pSplitLayout){
    if(pSplitViews && pSplitViews.length > 0){
        var i;
        var viewCount = pSplitViews.length;
        var spaceViewCount = viewCount-1;
        for(i=this._splitViews.length-1;i>=0;--i){
            this._splitViews[i].removeFromParent();
        }
        this._splitViews = pSplitViews;
        for(i=spaceViewCount;i>=0;--i){
            this.addChildNodeAtLayer(this._splitViews[i],0);
        }
        if(spaceViewCount > this._splitSpaceViews.length){
            for(i=this._splitSpaceViews.length;i<spaceViewCount;++i){
                var spaceView = new HY.GUI.View({
                    mouseEnable:true,
                    dragEnable:this._adjustEnable,
                    backgroundColor:'#aaaaaa',
                    dragZone:{x:0,y:0,width:1000000,height:1000000}
                });
                if(this._adjustEnable){
                    if(this._splitDirection == 0){
                        spaceView.setCursor("ew-resize");
                    }else{
                        spaceView.setCursor("ns-resize");
                    }
                }else{
                    spaceView.setCursor(null);
                }
                spaceView.addEventListener("drag",this._spaceViewDrag,this);
                this._splitSpaceViews.push(spaceView);
                this.addChildNodeAtLayer(spaceView,0);
            }
        }else{
            for(i=this._splitSpaceViews.length-1;i>=0;--i){
                var spaceView = this._splitSpaceViews[i];
                if(i>=spaceViewCount){
                    spaceView.removeFromParent();
                }else{
                    if(this._adjustEnable){
                        if(this._splitDirection == 0){
                            spaceView.setCursor("ew-resize");
                        }else{
                            spaceView.setCursor("ns-resize");
                        }
                    }else{
                        spaceView.setCursor(null);
                    }
                }
            }
            this._splitSpaceViews.splice(spaceViewCount,this._splitSpaceViews.length-spaceViewCount);
        }
        if(pSplitLayout != this._splitInitLayout){
            this._splitInitLayout = pSplitLayout;
        }
        if(this._splitDirection == 0){
            var avaWidth = this.getWidth() - this._splitSpace * this._splitSpaceViews.length;
            if(!this._splitInitLayout || this._splitInitLayout.length != viewCount){
                this._splitInitLayout = [];
                var viewWidth = avaWidth / viewCount;
                for(var i=0;i<viewCount;++i){
                    this._splitInitLayout.push(viewWidth);
                }
            }
            var widthNoAdjust = 0;
            var autoAdjustIndex = this._autoAdjustViewIndex;
            if(this._autoAdjustViewIndex < 0 || this._autoAdjustViewIndex >= viewCount){
                autoAdjustIndex = viewCount-1;
            }
            for(var i=0;i<viewCount;++i){
                if(i != autoAdjustIndex){
                    this._splitViews[i].setWidth(this._splitInitLayout[i]);
                    widthNoAdjust += this._splitInitLayout[i];
                }
            }
            this._splitViews[autoAdjustIndex].setWidth(this.getWidth() - widthNoAdjust);
        }else{
            var avaHeight = this.getHeight() - this._splitSpace * this._splitSpaceViews.length;
            var viewCount = this._splitViews.length;
            if(!this._splitInitLayout || this._splitInitLayout.length != viewCount){
                this._splitInitLayout = [];
                var viewHeight = avaHeight / viewCount;
                for(var i=0;i<viewCount;++i){
                    this._splitInitLayout.push(viewHeight);
                }
            }
            var heightNoAdjust = 0;
            var autoAdjustIndex = this._autoAdjustViewIndex;
            if(this._autoAdjustViewIndex < 0 || this._autoAdjustViewIndex >= viewCount){
                autoAdjustIndex = viewCount-1;
            }
            for(var i=0;i<viewCount;++i){
                if(i != autoAdjustIndex){
                    this._splitViews[i].setHeight(this._splitInitLayout[i]);
                    heightNoAdjust += this._splitInitLayout[i];
                }
            }
            this._splitViews[autoAdjustIndex].setHeight(this.getHeight() - heightNoAdjust);
        }
        this.layoutSplitViews();
    }
}
HY.GUI.SplitView.prototype.layoutSplitViews = function(splitLayout){
    if (this._splitDirection == 0) {
        var spaceViewCount = this._splitViews.length - 1;
        var limitMinX = 0;
        for(var i=0;i<spaceViewCount;++i){
            var splitView = this._splitViews[i];
            var nextSplitView = this._splitViews[i+1];
            var spaceView = this._splitSpaceViews[i];
            if(i == spaceViewCount - 1){
                spaceView.setLimitMaxX(this.getWidth()-this._splitSpace);
            }else{
                spaceView.setLimitMaxX(limitMinX+splitView.getWidth()+nextSplitView.getWidth());
            }
            spaceView.setLimitMinX(limitMinX);
            spaceView.setLimitMaxY(0);
            spaceView.setLimitMinY(0);
            spaceView.setX(limitMinX+splitView.getWidth());
            limitMinX += splitView.getWidth()+this._splitSpace;
        }
    } else {
        var spaceViewCount = this._splitViews.length - 1;
        var limitMinY = 0;
        for(var i=0;i<spaceViewCount;++i){
            var splitView = this._splitViews[i];
            var nextSplitView = this._splitViews[i+1];
            var spaceView = this._splitSpaceViews[i];
            spaceView.setLimitMinX(0);
            spaceView.setLimitMaxX(0);
            spaceView.setLimitMinY(limitMinY);
            if(i == spaceViewCount-1){
                spaceView.setLimitMaxY(this.getHeight()-this._splitSpace);
            }else{
                spaceView.setLimitMaxY(limitMinY+splitView.getHeight()+nextSplitView.getHeight());
            }
            spaceView.setY(limitMinY+splitView.getHeight());
            limitMinY += nextSplitView.getHeight()+this._splitSpace;
        }
    }
}
HY.GUI.SplitView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    if(this._splitDirection == 0){
        var viewCount = this._splitViews.length;
        for(var i = viewCount-1;i>=0;--i){
            var splitView = this._splitViews[i];
            var spaceView, preSpaceView;
            splitView.setY(0);
            splitView.setHeight(this.getHeight());
            if(i == 0){
                var spaceView = this._splitSpaceViews[i];
                spaceView.setWidth(this._splitSpace);
                spaceView.setHeight(this.getHeight());
                splitView.setX(0);
                splitView.setWidth(spaceView.getX());
            }else if(i == viewCount-1){
                var preSpaceView = this._splitSpaceViews[i-1];
                splitView.setX(preSpaceView.getX()+this._splitSpace);
                splitView.setWidth(this.getWidth()-preSpaceView.getX()-this._splitSpace);
            }else{
                var preSpaceView = this._splitSpaceViews[i-1];
                var spaceView = this._splitSpaceViews[i];
                spaceView.setWidth(this._splitSpace);
                spaceView.setHeight(this.getHeight());
                splitView.setX(preSpaceView.getX()+this._splitSpace);
                splitView.setWidth(spaceView.getX()-preSpaceView.getX()-this._splitSpace);
            }
        }
    }else{
        var viewCount = this._splitViews.length;
        for(var i=viewCount-1;i>=0;--i){
            var splitView = this._splitViews[i];
            splitView.setX(0);
            splitView.setWidth(this.getWidth());
            if(i==0){
                var spaceView = this._splitSpaceViews[i];
                spaceView.setWidth(this.getWidth());
                spaceView.setHeight(this._splitSpace);
                splitView.setY(0);
                splitView.setHeight(spaceView.getY());
            }else if(i==viewCount-1){
                var preSpaceView = this._splitSpaceViews[i-1];
                splitView.setY(preSpaceView.getY()+this._splitSpace);
                splitView.setHeight(this.getHeight()-preSpaceView.getY()-this._splitSpace);
            }else{
                var preSpaceView = this._splitSpaceViews[i-1];
                var spaceView = this._splitSpaceViews[i];
                spaceView.setWidth(this.getWidth());
                spaceView.setHeight(this._splitSpace);
                splitView.setY(preSpaceView.getY()+this._splitSpace);
                splitView.setHeight(spaceView.getY()-preSpaceView.getY()-this._splitSpace);
            }
        }
    }
}
HY.GUI.SplitView.prototype._spaceViewDrag = function(){
    this.needLayoutSubNodes();
}
HY.GUI.SplitView.prototype._selfWidthChanged = function(sender){
    if(this._splitDirection == 0){
        var viewCount = this._splitViews.length;
        var widthNoAdjust = 0;
        var autoAdjustIndex = this._autoAdjustViewIndex;
        if(this._autoAdjustViewIndex < 0 || this._autoAdjustViewIndex >= viewCount){
            autoAdjustIndex = viewCount-1;
        }
        for(var i=0;i<viewCount;++i){
            if(i != autoAdjustIndex){
                widthNoAdjust += this._splitViews[i].getWidth();
            }
        }
        widthNoAdjust += this._splitSpaceViews.length * this._splitSpace;
        this._splitViews[autoAdjustIndex].setWidth(this.getWidth() - widthNoAdjust);
    }
    this.layoutSplitViews();
}
HY.GUI.SplitView.prototype._selfHeightChanged = function(sender){
    if(this._splitDirection != 0){
        var viewCount = this._splitViews.length;
        var heightNoAdjust = 0;
        var autoAdjustIndex = this._autoAdjustViewIndex;
        if(this._autoAdjustViewIndex < 0 || this._autoAdjustViewIndex >= viewCount){
            autoAdjustIndex = viewCount-1;
        }
        for(var i=0;i<viewCount;++i){
            if(i != autoAdjustIndex){
                heightNoAdjust += this._splitViews[i].getHeight();
            }
        }
        heightNoAdjust += this._splitSpaceViews.length * this._splitSpace;
        this._splitViews[autoAdjustIndex].setHeight(this.getHeight() - heightNoAdjust);
    }
    this.layoutSplitViews();
}
