/**
 * Created by Administrator on 2014/10/26.
 */

HY.GUI.ScrollBar = function(config){
	this.init(config);
}
HY.GUI.ScrollBar.prototype = new HY.GUI.View();
HY.GUI.ScrollBar.prototype.defaultScrollBarWidth = 10;
HY.GUI.ScrollBar.prototype.defaultScrollBarLength = 100;
HY.GUI.ScrollBar.prototype.defaultScrollBarDirection = 0;			//0表示水平方向滚动条
HY.GUI.ScrollBar.prototype.defaultBorderColor = null;
HY.GUI.ScrollBar.prototype.defaultBorderWidth = 0;
HY.GUI.ScrollBar.prototype.defaultBackgroundColor = "#bbbbbb";
HY.GUI.ScrollBar.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._scrollBar = new HY.GUI.View({
        x:0,
        y:0,
        width:0,
        height:0,
        dragEnable:true,
        mouseEnable:true,
        dragZone:{x:0,y:0,width:1000000,height:1000000},
        backgroundColor:'#777777'
    });
    if(config.insetLT != undefined){ this._insetLT = config.insetLT; } else { this._insetLT = 0; }
    if(config.insetRB != undefined){ this._insetRB = config.insetRB; } else { this._insetRB = 0; }
    if(config.scrollBarDirection != undefined){ this._scrollBarDirection = config.scrollBarDirection; } else { this._scrollBarDirection = this.defaultScrollBarDirection; }
    if(config.scrollBarWidth != undefined){ this._scrollBarWidth = config.scrollBarWidth; } else { this._scrollBarWidth = this.defaultScrollBarWidth; }
    if(config.scrollBarLength != undefined){ this._scrollBarLength != config.scrollBarLength; } else { this._scrollBarLength = this.defaultScrollBarLength; }
    if(config.scrollEvent != undefined){ this.addEventListener("scroll",config.scrollEvent.selector,config.scrollEvent.target); }

    this._offsetLength = 0;
    this._showLength = 1;
    this._fullLength = 1;
}
HY.GUI.ScrollBar.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("widthchanged",this._scrollBarWidthChanged,this);
    this.addEventListener("heightchanged",this._scrollBarHeightChanged,this);
    this._scrollBar.addEventListener("drag",this._scrollBarDrag,this);
    this.addChildNodeAtLayer(this._scrollBar,0);
}
HY.GUI.ScrollBar.prototype.getInsetLT = function(){
	return this._insetLT;
}
HY.GUI.ScrollBar.prototype.setInsetLT = function(length){
    if(this._insetLT != length){
        this._insetLT = length;
        this.needLayoutSubNodes();
    }
}
HY.GUI.ScrollBar.prototype.getInsetRB = function(){
	return this._insetRB;
}
HY.GUI.ScrollBar.prototype.setInsetRB = function(length){
    if(this._insetRB != length){
        this._insetRB = length;
        this.needLayoutSubNodes();
    }
}
HY.GUI.ScrollBar.prototype.getScrollBarWidth = function(){
	return this._scrollBarWidth;
}
HY.GUI.ScrollBar.prototype.setScrollBarWidth = function(width){
    if(this._scrollBarWidth != width){
        this._scrollBarWidth  = width;
        this.needLayoutSubNodes();
    }
}
HY.GUI.ScrollBar.prototype.getScrollBarLength = function(){
    return this._scrollBarLength;
}
HY.GUI.ScrollBar.prototype.setScrollBarLength = function(length){
    if(this._scrollBarLength != length){
        this._scrollBarLength = length;
        this.needLayoutSubNodes();
    }
}
HY.GUI.ScrollBar.prototype.getScrollParam = function(){
	if(this._scrollBarDirection == 0){
		return {offsetLen:this._scrollBar.getX()-this._insetLT,showLen:this._scrollBar.getWidth(),fullLen:this.getWidth()-this._insetLT-this._insetRB};
	}else{
		return {offsetLen:this._scrollBar.getY()-this._insetLT,showLen:this._scrollBar.getHeight(),fullLen:this.getHeight()-this._insetLT-this._insetRB};
	}
}
HY.GUI.ScrollBar.prototype.setScrollParam = function(offsetLength,showLength,fullLength){
    this._offsetLength = (offsetLength < 0) ? 0 : offsetLength;
    this._showLength = (showLength < 0) ? 1 : showLength;
    this._fullLength = (fullLength < 0) ? 1 : fullLength;
    this.needLayoutSubNodes();
}
HY.GUI.ScrollBar.prototype.onScroll = function(sender,e){
	this.launchEvent("scroll",[this,e]);
}
HY.GUI.ScrollBar.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    if(this._scrollBarDirection == 0){
        this.setWidth(this._scrollBarLength);
        this.setHeight(this._scrollBarWidth);
        this._scrollBar.setX((this.getWidth()-this._insetLT-this._insetRB)*this._offsetLength/this._fullLength);
        this._scrollBar.setY(0);
        this._scrollBar.setWidth((this.getWidth()-this._insetLT-this._insetRB)*this._showLength/this._fullLength);
        this._scrollBar.setHeight(this._scrollBarWidth);
        this._scrollBar.setLimitMinX(this._insetLT);
        this._scrollBar.setLimitMaxX(this.getWidth()-this._scrollBar.getWidth()-this._insetRB);
        this._scrollBar.setLimitMinY(0);
        this._scrollBar.setLimitMaxY(0);
    }else{
        this.setWidth(this._scrollBarWidth);
        this.setHeight(this._scrollBarLength);
        this._scrollBar.setX(0);
        this._scrollBar.setY((this.getHeight()-this._insetLT-this._insetRB)*this._offsetLength/this._fullLength);
        this._scrollBar.setWidth(this._scrollBarWidth);
        this._scrollBar.setHeight((this.getHeight()-this._insetLT-this._insetRB)*this._showLength/this._fullLength);
        this._scrollBar.setLimitMinX(0);
        this._scrollBar.setLimitMaxX(0);
        this._scrollBar.setLimitMinY(this._insetLT);
        this._scrollBar.setLimitMaxY(this.getHeight()-this._scrollBar.getHeight()-this._insetRB);
    }
}
HY.GUI.ScrollBar.prototype._scrollBarWidthChanged = function(sender){
    if(this._scrollBarDirection == 0){
        if(this.getWidth() != this._scrollBarLength){
            this.needLayoutSubNodes();
        }
    }else{
        if(this.getWidth() != this._scrollBarWidth){
            this.needLayoutSubNodes();
        }
    }
}
HY.GUI.ScrollBar.prototype._scrollBarHeightChanged = function(sender){
    if(this._scrollBarDirection == 0){
        if(this.getHeight() != this._scrollBarWidth){
            this.needLayoutSubNodes();
        }
    }else{
        if(this.getHeight() != this._scrollBarLength){
            this.needLayoutSubNodes();
        }
    }
}
HY.GUI.ScrollBar.prototype._scrollBarDrag = function(sender,e){
    this.onScroll(this,e);
}
