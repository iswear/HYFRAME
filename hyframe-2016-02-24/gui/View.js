/**
 * Created by Administrator on 2014/10/15.
 */
HY.GUI.View = function(config){
    this.init(config);
}
HY.GUI.View.prototype = new HY.Core.Node();
HY.GUI.View.prototype.defaultClipBound = true;
HY.GUI.View.prototype.defaultLimitMinWidth = 0;
HY.GUI.View.prototype.defaultLimitMaxWidth = 1000000;
HY.GUI.View.prototype.defaultLimitMinHeight = 0;
HY.GUI.View.prototype.defaultLimitMaxHeight = 1000000;
HY.GUI.View.prototype.defaultLimitMinX = -1000000;
HY.GUI.View.prototype.defaultLimitMaxX = 1000000;
HY.GUI.View.prototype.defaultLimitMinY = -1000000;
HY.GUI.View.prototype.defaultLimitMaxY = 1000000;
HY.GUI.View.prototype.defaultAnchorX = 0;
HY.GUI.View.prototype.defaultAnchorY = 0;
HY.GUI.View.prototype.defaultRotateZ = 0;
HY.GUI.View.prototype.defaultNormalColor = null;
HY.GUI.View.prototype.defaultHoverColor = null;
HY.GUI.View.prototype.defaultActiveColor = null;
HY.GUI.View.prototype.defaultSelected = false;
HY.GUI.View.prototype.defaultDragEnable = false;
HY.GUI.View.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.selected != undefined){ this._selected = config.selected; } else { this._selected = this.defaultSelected; }
    if(config.normalColor != undefined){ this._normalColor =  config.normalColor; } else { this._normalColor = this.defaultNormalColor; }
    if(config.hoverColor != undefined) { this._hoverColor = config.hoverColor; } else { this._hoverColor = this.defaultHoverColor; }
    if(config.activeColor != undefined) { this._activeColor = config.activeColor; } else { this._activeColor = this.defaultActiveColor; }

    if(config.limitMinWidth != undefined){ this._limitMinWidth = config.limitMinWidth; } else { this._limitMinWidth = this.defaultLimitMinWidth; }
    if(config.limitMaxWidth != undefined){ this._limitMaxWidth = config.limitMaxWidth; } else { this._limitMaxWidth = this.defaultLimitMaxWidth; }
    if(config.limitMinHeight != undefined){ this._limitMinHeight = config.limitMinHeight; } else { this._limitMinHeight = this.defaultLimitMinHeight; }
    if(config.limitMaxHeight != undefined){ this._limitMaxHeight = config.limitMaxHeight; } else { this._limitMaxHeight = this.defaultLimitMaxHeight; }
    if(config.limitMinX != undefined){ this._limitMinX = config.limitMinX; } else { this._limitMinX = this.defaultLimitMinX; }
    if(config.limitMaxX != undefined){ this._limitMaxX = config.limitMaxX; } else { this._limitMaxX = this.defaultLimitMaxX; }
    if(config.limitMinY != undefined){ this._limitMinY = config.limitMinY; } else { this._limitMinY = this.defaultLimitMinY; }
    if(config.limitMaxY != undefined){ this._limitMaxY = config.limitMaxY; } else { this._limitMaxY = this.defaultLimitMaxY; }

    if(config.selectedEvent != undefined){ this.addEventListener("selected",config.selectedEvent.selector,config.selectedEvent.target); }
    if(config.unSelectedEvent != undefined){ this.addEventListener("unselected",config.unSelectedEvent.selector,config.unSelectedEvent.target); }
}
HY.GUI.View.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    if(!this._normalColor){ this._normalColor = this.getBackgroundColor(); }
    if(!this._hoverColor){ this._hoverColor = this.getBackgroundColor(); }
    if(!this._activeColor){ this._activeColor = this.getBackgroundColor(); }
    this.setBackgroundColor(this._normalColor);
}
HY.GUI.View.prototype.getSelected = function(){
    return this._selected;
}
HY.GUI.View.prototype.setSelected = function(selected){
    if(this._selected != selected){
        this._selected = selected;
        if(this._selected){
            this.onSelected(this);
        }else{
            this.onUnselected(this);
        }
        this.applyBackgroundColor();
    }
}
HY.GUI.View.prototype.getNormalColor = function(){
    return this._normalColor;
}
HY.GUI.View.prototype.setNormalColor = function(color){
    this._normalColor = color;
    this.applyBackgroundColor();
}
HY.GUI.View.prototype.getHoverColor = function(){
    return this._hoverColor;
}
HY.GUI.View.prototype.setHoverColor = function(color){
    this._hoverColor = color;
    this.applyBackgroundColor();
}
HY.GUI.View.prototype.getActiveColor = function(){
    return this._activeColor;
}
HY.GUI.View.prototype.setActiveColor = function(color){
    this._activeColor = color;
    this.applyBackgroundColor();
}
HY.GUI.View.prototype.applyBackgroundColor = function(){
    if(this._selected){
        this.setBackgroundColor(this._activeColor);
    }else{
        if(this.downIdentityOnThis() < 0){
            if(this.overIdentityOnThis() < 0){
                this.setBackgroundColor(this._normalColor);
            }else{
                this.setBackgroundColor(this._hoverColor);
            }
        }else{
            this.setBackgroundColor(this._activeColor);
        }
    }
}
HY.GUI.View.prototype.setX = function(pX){
	if(pX < this._limitMinX){
		pX = this._limitMinX;
	}else if(pX > this._limitMaxX){
		pX = this._limitMaxX;
	}
	this.superCall("setX",[pX]);
}
HY.GUI.View.prototype.setY = function(pY){
	if(pY < this._limitMinY){
		pY = this._limitMinY;
	}else if(pY > this._limitMaxY){
		pY = this._limitMaxY;
	}
	this.superCall("setY",[pY]);
}
HY.GUI.View.prototype.setWidth = function(pWidth){
	if(pWidth < this._limitMinWidth){
		pWidth = this._limitMinWidth;
	}else if(pWidth > this._limitMaxWidth){
		pWidth = this._limitMaxWidth;
	}
	this.superCall("setWidth",[pWidth]);
}
HY.GUI.View.prototype.setHeight = function(pHeight){
	if(pHeight < this._limitMinHeight){
		pHeight = this._limitMinHeight;
	}else if(pHeight > this._limitMaxHeight){
		pHeight = this._limitMaxHeight;
	}
	this.superCall("setHeight",[pHeight]);
}
HY.GUI.View.prototype.getLimitMinWidth = function(){
    return this._limitMinWidth;
}
HY.GUI.View.prototype.setLimitMinWidth = function(pWidth){
    this._limitMinWidth = pWidth;
	this.setWidth(this.getWidth());
}
HY.GUI.View.prototype.getLimitMaxWidth = function(){
    return this._limitMaxWidth;
}
HY.GUI.View.prototype.setLimitMaxWidth = function(pWidth){
    this._limitMaxWidth = pWidth;
	this.setWidth(this.getWidth());
}
HY.GUI.View.prototype.getLimitMinHeight = function(){
    return this._limitMinHeight;
}
HY.GUI.View.prototype.setLimitMinHeight = function(pHeight){
    this._limitMinHeight = pHeight;
	this.setHeight(this.getHeight());
}
HY.GUI.View.prototype.getLimitMaxHeight = function(){
    return this._limitMaxHeight;
}
HY.GUI.View.prototype.setLimitMaxHeight = function(pHeight){
    this._limitMaxHeight = pHeight;
	this.setHeight(this.getHeight());
}
HY.GUI.View.prototype.getLimitMinX = function(){
    return this._limitMinX;
}
HY.GUI.View.prototype.setLimitMinX = function(pX){
    this._limitMinX = pX;
	this.setX(this.getX());
}
HY.GUI.View.prototype.getLimitMaxX = function(){
    return this._limitMaxX;
}
HY.GUI.View.prototype.setLimitMaxX = function(pX){
    this._limitMaxX = pX;
	this.setX(this.getX());
}
HY.GUI.View.prototype.getLimitMinY = function(){
    return this._limitMinY;
}
HY.GUI.View.prototype.setLimitMinY = function(pY){
    this._limitMinY = pY;
	this.setY(this.getY());
}
HY.GUI.View.prototype.getLimitMaxY = function(){
    return this._limitMaxY;
}
HY.GUI.View.prototype.setLimitMaxY = function(pY){
    this._limitMaxY = pY;
	this.setY(this.getY());
}
HY.GUI.View.prototype.onMouseDown = function(sender,e){
    this.superCall("onMouseDown",[sender,e]);
    this.applyBackgroundColor();
}
HY.GUI.View.prototype.onMouseUp = function(sender,e){
    this.superCall("onMouseUp",[sender,e]);
    this.applyBackgroundColor();
}
HY.GUI.View.prototype.onMouseOver = function(sender,e){
    this.superCall("onMouseOver",[sender,e]);
    this.applyBackgroundColor();
}
HY.GUI.View.prototype.onMouseOut = function(sender,e){
    this.superCall("onMouseOut",[sender,e]);
    this.applyBackgroundColor();
}
HY.GUI.View.prototype.onSelected = function(sender){
    this.launchEvent("selected",[this]);
}
HY.GUI.View.prototype.onUnselected = function(sender){
    this.launchEvent("unselected",[this]);
}
