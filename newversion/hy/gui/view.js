var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.View = hy.extend(hy.RichNode);
hy.gui.View.prototype.notifySyncBackgroundColor = "syncbackgroundcolor";
hy.gui.View.prototype.notifySyncBorderColor = "syncbordercolor";
hy.gui.View.prototype.notifySyncBorderWidth = "syncborderwidth";
hy.gui.View.prototype.notifySyncSelected = "syncselected";
hy.gui.View.prototype.defaultDragEnable = false;
hy.gui.View.prototype.defaultWheelEnable = false;
hy.gui.View.prototype.defaultResizeEnable = false;
hy.gui.View.prototype.defaultRotateEnable = false;
hy.gui.View.prototype.defaultAnchorMoveEnable = false;
hy.gui.View.prototype.defaultAdjustLayoutStyle = 1;
hy.gui.View.prototype.defaultNormalColor = null;
hy.gui.View.prototype.defaultActiveColor = null;
hy.gui.View.prototype.defaultSelected = false;
hy.gui.View.prototype.defaultBorderWidth = 0;
hy.gui.View.prototype.defaultBorderColor = null;
hy.gui.View.prototype.defaultAnchorX = 0;
hy.gui.View.prototype.defaultAnchorY = 0;
hy.gui.View.prototype.defaultClipBound = true;
hy.gui.View.prototype.init = function(config){
    this.superCall("init",[config]);
    this._backgroundColor = this.isUndefined(config.normalColor) ? this.defaultNormalColor : config.normalColor;
    this._normalColor = this.isUndefined(config.normalColor) ? this.defaultNormalColor : config.normalColor;
    this._activeColor = this.isUndefined(config.activeColor) ? this.defaultActiveColor : config.activeColor;
    this._selected = this.isUndefined(config.selected) ? this.defaultSelected : config.selected;
    this._borderWidth = this.isUndefined(config.borderWidth) ? this.defaultBorderWidth : config.borderWidth;
    this._borderColor = this.isUndefined(config.borderColor) ? this.defaultBorderColor : config.borderColor;
    this._borderColor = this
    this.addObserver(this.notifySyncBackgroundColor,this,this.refresh);
    this.addObserver(this.notifySyncBorderWidth,this,this.refresh);
    this.addObserver(this.notifySyncBorderColor,this,this.refresh);
    this.addObserver(this.notifySyncSelected,this,this._syncBackgroundColor);
    this.addObserver(this.notifyMouseDown,this,this._syncBackgroundColor);
    this.addObserver(this.notifyMouseUp,this,this._syncBackgroundColor);
    this.addObserver(this.notifyPaint,this,this._paintViewBKAndBorder);
}
hy.gui.View.prototype.setBackgroundColor = function(color){
    if(this._backgroundColor != color){
        this._backgroundColor = color;
        this.postNotification(this.notifySyncBackgroundColor,null);
    }
}
hy.gui.View.prototype.getBackgroundColor = function(){
    return this._backgroundColor;
}
hy.gui.View.prototype.setNormalColor = function(color){
    this._normalColor = color;
}
hy.gui.View.prototype.getNormalColor = function(){
    return this._normalColor;
}
hy.gui.View.prototype.setActiveColor = function(color){
    this._activeColor = color;
}
hy.gui.View.prototype.getActiveColor = function(){
    return this._activeColor;
}
hy.gui.View.prototype.setSelected = function(selected){
    if(this._selected != selected){
        this._selected = selected;
        this.postNotification(this.notifySyncSelected,null);
    }
}
hy.gui.View.prototype.getSelected = function(){
    return this._selected;
}
hy.gui.View.prototype.setBorderWidth = function(width){
    if(this._borderWidth != width){
        this._borderWidth = width;
        this.postNotification(this.notifySyncBorderWidth,null);
    }
}
hy.gui.View.prototype.getBorderWidth = function(){
    return this._borderWidth;
}
hy.gui.View.prototype.setBorderColor = function(color){
    if(this._borderColor != color){
        this._borderColor = color;
        this.postNotification(this.notifySyncBorderColor,null);
    }
}
hy.gui.View.prototype.getBorderColor = function(){
    return this._borderColor;
}
hy.gui.View.prototype._syncBackgroundColor = function(){
    if(this._selected){
        this.setBackgroundColor(this._activeColor);
    }else{
        if(this.mouseDownIdOnIt() < 0){
            this.setBackgroundColor(this._normalColor);
        }else{
            this.setBackgroundColor(this._activeColor);
        }
    }
}
hy.gui.View.prototype._readyViewPath = function(dc, rect){
    var offset = this._borderWidth/2;
    dc.beginPath();
    if(this._cornorRadius > 0){
        var ltx = rect.x + offset;
        var lty = rect.y + offset;
        var rbx = rect.x + rect.width-offset;
        var rby = rect.y + rect.height-offset;
        dc.moveTo(ltx,lty+this._cornorRadius);
        dc.arcTo(ltx,lty,ltx+this._cornorRadius,lty,this._cornorRadius);
        dc.lineTo(rbx-this._cornorRadius,lty);
        dc.arcTo(rbx,lty,rbx,lty+this._cornorRadius,this._cornorRadius);
        dc.lineTo(rbx,rby-this._cornorRadius);
        dc.arcTo(rbx,rby,rbx-this._cornorRadius,rby,this._cornorRadius);
        dc.lineTo(ltx+this._cornorRadius,rby);
        dc.arcTo(ltx,rby,ltx,rby-this._cornorRadius,this._cornorRadius);
        dc.lineTo(ltx,lty+this._cornorRadius);
    }else{
        dc.rect(rect.x+offset,rect.y+offset,rect.width-this._borderWidth,rect.height-this._borderWidth);
    }
}
hy.gui.View.prototype._paintViewBKAndBorder = function(sender, dc, rect){
    /*如果裁剪启用继承*/
    var borderPathReady = false;
    var parent = this.getParent();
    if(this._clipBound){
        if(parent == null || this._backgroundColor){
            this.setPaintInheritValue("backgroundColor",this._backgroundColor);
        }else{
            this.setPaintInheritValue("backgroundColor",parent.getPaintInheritValue("backgroundColor"));
        }
    }else{
        this.setPaintInheritValue("backgroundColor",null);
    }
    if(this._backgroundColor){
        this._readyViewPath(dc,rect);
        if(this._backgroundColor){
            dc.setFillStyle(this._backgroundColor);
            dc.fill();
        }
        borderPathReady = true;
    }
    if(this._borderWidth > 0 && this._borderColor){
        if(!borderPathReady){
            this._readyViewPath(dc,rect);
        }
        if(this._borderWidth > 0 && this._borderColor){
            dc.setLineWidth(this._borderWidth);
            dc.setStrokeStyle(this._borderColor);
            dc.stroke();
        }
    }
}
