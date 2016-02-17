var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.Label = hy.extend(hy.gui.View);
hy.gui.Label.prototype.notifySyncText = "synctext";
hy.gui.Label.prototype.notifySyncTextFont = "synctextfont";
hy.gui.Label.prototype.notifySyncTextColor = "synctextcolor";
hy.gui.Label.prototype.notifySyncTextHidden = "synctexthidden";
hy.gui.Label.prototype.notifySyncTextHorAlign = "synctexthoralign";
hy.gui.Label.prototype.notifySyncTextVerAlign = "synctextveralign";
hy.gui.Label.prototype.notifySyncTextLineHeight = "synctextlineheight";
hy.gui.Label.prototype.notifySyncTextLineNum = "synctextlinenum";
hy.gui.Label.prototype.notifySyncTextPadding = "synctextpadding";
hy.gui.Label.prototype.defaultText = "Label";
hy.gui.Label.prototype.defaultTextColor = "#000000";
hy.gui.Label.prototype.defaultTextHorAlign = hy.gui.TEXT_VERALIGN_CENTER;
hy.gui.Label.prototype.defaultTextVerAlign = hy.gui.TEXT_VERALIGN_CENTER;
hy.gui.Label.prototype.defaultLineHeight = 0;
hy.gui.Label.prototype.defaultTextFont = "12px sans-serif italic bold";
hy.gui.Label.prototype.defaultMouseEnable = false;
hy.gui.Label.prototype.defaultTextPaddingLeft = 0;
hy.gui.Label.prototype.defaultTextPaddingRight = 0;
hy.gui.Label.prototype.defaultTextPaddingTop = 0;
hy.gui.Label.prototype.defaultTextPaddingBottom = 0;
hy.gui.Label.prototype.init = function(config){
    this.superCall("init",[config]);
    this._text = this.isUndefined(config.text) ? this.defaultText : config.text;
    this._textFont = this.isUndefined(config.textFont) ? this.defaultTextFont : config.textFont;
    this._textColor = this.isUndefined(config.textColor) ? this.defaultTextColor : config.textColor;
    this._textHidden = this.isUndefined(config.textHidden) ? false : config.textHidden;
    this._textHorAlign = this.isUndefined(config.textHorAlign) ? this.defaultTextHorAlign : config.textHorAlign;
    this._textVerAlign = this.isUndefined(config.textVerAlign) ? this.defaultTextVerAlign : config.textVerAlign;
    this._textLineHeight = this.isUndefined(config.textLineHeight) ? this.defaultLineHeight : config.textLineHeight;
    this._textLineNum = this.isUndefined(config.textLineNum) ? 1 : config.textLineNum;
    this._textPaddingLeft = this.isUndefined(config.textPaddingLeft) ? this.defaultTextPaddingLeft : config.textPaddingLeft;
    this._textPaddingRight = this.isUndefined(config.textPaddingRight) ? this.defaultTextPaddingRight : config.textPaddingRight;
    this._textPaddingTop = this.isUndefined(config.textPaddingTop) ? this.defaultTextPaddingTop : config.textPaddingTop;
    this._textPaddingBottom = this.isUndefined(config.textPaddingBottom) ? this.defaultTextPaddingBottom : config.textPaddingBottom;
    this.__textFontSizeInvalid = true;
    this.__textFontSize = 0;
    this.__textLayoutInvalid = true;
    this.__textMutliLines = null;
    this.__textSingleLineWidth = 0;
    this.__textCacheInvalid = true;
    this.__textCacheRenderContext = new hy.RenderContext({});

    this.addObserver(this.notifySyncText,this,this._syncLabelTextLayoutInvalid);
    this.addObserver(this.notifySyncText,this,this._syncLabelTextMeasuredLength);
    this.addObserver(this.notifySyncText,this,this._syncLabelRenderCacheInvalid);
    this.addObserver(this.notifySyncTextFont,this,this._syncLabelTextFontSizeInvalid);
    this.addObserver(this.notifySyncTextFont,this,this._syncLabelTextLayoutInvalid);
    this.addObserver(this.notifySyncTextFont,this,this._syncLabelTextMeasuredLength);
    this.addObserver(this.notifySyncTextFont,this,this._syncLabelRenderCacheInvalid);
    this.addObserver(this.notifySyncTextColor,this,this._syncLabelRenderCacheInvalid);
    this.addObserver(this.notifySyncTextHorAlign,this,this._syncLabelRenderCacheInvalid);
    this.addObserver(this.notifySyncTextLineHeight,this,this._syncLabelTextLayoutInvalid);
    this.addObserver(this.notifySyncTextLineHeight,this,this._syncLabelRenderCacheInvalid);
    this.addObserver(this.notifySyncTextLineNum,this,this._syncLabelRenderCacheInvalid);
    this.addObserver(this.notifySyncTextLineNum,this,this._syncLabelTextLayoutInvalid);
    this.addObserver(this.notifySyncTextPadding,this,this._syncLabelRenderCacheInvalid);
    this.addObserver(this.notifySyncWidth,this,this._syncLabelTextSizeReason);
    this.addObserver(this.notifyPaint,this,this._paintLabelText);
    this.addObserver(this.notifySyncText,this,this.refresh);
    this.addObserver(this.notifySyncTextFont,this,this.refresh);
    this.addObserver(this.notifySyncTextColor,this,this.refresh);
    this.addObserver(this.notifySyncTextHidden,this,this.refresh);
    this.addObserver(this.notifySyncTextHorAlign,this,this.refresh);
    this.addObserver(this.notifySyncTextVerAlign,this,this.refresh);
    this.addObserver(this.notifySyncTextLineHeight,this,this.refresh);
    this.addObserver(this.notifySyncTextLineNum,this,this.refresh);
    this.addObserver(this.notifySyncTextPadding,this,this.refresh);
    this.__textCacheRenderContext.getCanvas().style.zIndex = 100;
    this.__textCacheRenderContext.getCanvas().style.backgroundColor = "green";
}
hy.gui.Label.prototype.sync = function(){
    this.superCall("sync",null);
    this._syncLabelTextFontSizeInvalid();
    this._syncLabelRenderCacheInvalid();
    this._syncLabelTextLayoutInvalid();
    this._syncLabelTextMeasuredLength();
}
hy.gui.Label.prototype.setText = function(text){
    if(this._text != text){
        this._text = text;
        this._
        this.postNotification(this.notifySyncText,null);
    }
}
hy.gui.Label.prototype.getText = function(){
    return this._text;
}
hy.gui.Label.prototype.setTextFont = function(font){
    if(this._textFont != font){
        this._textFont = font;
        this.postNotification(this.notifySyncTextFont,null);
    }
}
hy.gui.Label.prototype.getTextFont = function(){
    return this._textFont;
}
hy.gui.Label.prototype.setTextColor = function(color){
    if(this._textColor != color){
        this._textColor = color;
        this.postNotification(this.notifySyncTextColor,null);
    }
}
hy.gui.Label.prototype.getTextColor = function(){
    return this._textColor;
}
hy.gui.Label.prototype.setTextHidden = function(hidden){
    if(this._textHidden != hidden){
        this._textHidden = hidden;
        this.postNotification(this.notifySyncTextHidden,null);
    }
}
hy.gui.Label.prototype.getTextHidden = function(){
    return this._textHidden;
}
hy.gui.Label.prototype.setTextHorAlign = function(textAlign){
    if(this._textHorAlign != textAlign){
        this._textHorAlign = textAlign;
        this.postNotification(this.notifySyncTextHorAlign,null);
    }
}
hy.gui.Label.prototype.getTextHorAlign = function(){
    return this._textHorAlign;
}
hy.gui.Label.prototype.setTextVerAlign = function(textAlign){
    if(this._textVerAlign != textAlign){
        this._textVerAlign = textAlign;
        this.postNotification(this.notifySyncTextVerAlign,null);
    }
}
hy.gui.Label.prototype.getTextVerAlign = function(){
    return this._textVerAlign;
}
hy.gui.Label.prototype.setTextLineHeight = function(lineHeight){
    if(this._textLineHeight != lineHeight){
        this._textLineHeight = lineHeight;
        this.postNotification(this.notifySyncTextLineHeight,null);
    }
}
hy.gui.Label.prototype.getTextLineHeight = function(){
    return this._textLineHeight;
}
hy.gui.Label.prototype.setTextLineNum = function(lineNum){
    if(this._textLineNum != lineNum){
        this._textLineNum = lineNum;
        this.postNotification(this.notifySyncTextLineNum,null);
    }
}
hy.gui.Label.prototype.getTextLineNum = function(){
    return this._textLineNum;
}
hy.gui.Label.prototype.setTextPaddingLeft = function(padding){
    if(this._textPaddingLeft != padding){
        this._textPaddingLeft = padding;
        this.postNotification(this.notifySyncTextPadding,null);
    }
}
hy.gui.Label.prototype.getTextPaddingLeft = function(){
    return this._textPaddingLeft;
}
hy.gui.Label.prototype.setTextPaddingRight = function(padding){
    if(this._textPaddingRight != padding){
        this._textPaddingRight = padding;
        this.postNotification(this.notifySyncTextPadding,null);
    }
}
hy.gui.Label.prototype.getTextPaddingRight = function(){
    return this._textPaddingRight;
}
hy.gui.Label.prototype.setTextPaddingTop = function(padding){
    if(this._textPaddingTop != padding){
        this._textPaddingTop = padding;
        this.postNotification(this.notifySyncTextPadding,null);
    }
}
hy.gui.Label.prototype.getTextPaddingTop = function(){
    return this._textPaddingTop;
}
hy.gui.Label.prototype.setTextPaddingBottom = function(padding){
    if(this._textPaddingBottom != padding){
        this._textPaddingBottom = padding;
        this.postNotification(this.notifySyncTextPadding,null);
    }
}
hy.gui.Label.prototype.getTextPaddingBottom = function(){
    return this._textPaddingBottom;
}
hy.gui.Label.prototype.getTextMeasuredLength = function(){
    return this.__textSingleLineWidth;
}
hy.gui.Label.prototype._syncLabelTextMeasuredLength = function(){
    this.__textSingleLineWidth = hy.textlayouter.getInstance().getTextLayoutWidth(this._text,this._textFont);
}
hy.gui.Label.prototype._syncLabelRenderCacheInvalid = function(){
    this.__textCacheInvalid = true;
}
hy.gui.Label.prototype._syncLabelTextLayoutInvalid = function(){
    this.__textLayoutInvalid = true;
}
hy.gui.Label.prototype._syncLabelTextFontSizeInvalid = function(){
    this.__textFontSizeInvalid = true;
}
hy.gui.Label.prototype._syncLabelTextSizeReason = function(){
    if(this._textLineNum != 1){
        this.__textLayoutInvalid = true;
        this.__textCacheInvalid = true;
    }
}
hy.gui.Label.prototype._pickupLabelTextFontSize = function(){
    var reg = /[1-9][0-9]*px/i;
    var fontSize = this._textFont.match(reg);
    if(fontSize != null){
        this.__textFontSize = parseInt(fontSize[0].substr(0,fontSize[0].length-2));
    }else{
        this.__textFontSize = 12;
    }
    this.__textFontSizeInvalid = false;
}
hy.gui.Label.prototype._layoutLabelText = function(){
    if(this._textLineNum != 1){
        this.__textMutliLines = hy.textlayouter.getInstance().getTextLayoutArray(this._text,this._textFont,this.getWidth()-this._textPaddingLeft-this._textPaddingRight);
    }else{
        this.__textMutliLines = [this._text];
    }
    this.__textLayoutInvalid = false;
}
hy.gui.Label.prototype._paintLabelTextCache = function(){
    var lineHeight = (this._textLineHeight > this.__textFontSize) ? this._textLineHeight : this.__textFontSize;
    var lineNum = (this._textLineNum < 1 || this._textLineNum > this.__textMutliLines.length) ? this.__textMutliLines.length : this._textLineNum;
    var borderWidth = (this._borderColor && this._borderWidth > 0) ? this._borderWidth : 0;
    var cacheWidth, cacheHeight = lineNum * lineHeight;
    if(lineNum == 1){
        cacheWidth = this.__textSingleLineWidth;
    }else{
        cacheWidth = this.getWidth() - this._textPaddingLeft - this._textPaddingRight - 2*borderWidth;
    }
    if(cacheWidth > 0 && cacheHeight > 0){
        var textx=0,texty=lineHeight/2;
        this.__textCacheRenderContext.setSize(cacheWidth,cacheHeight);
        this.__textCacheRenderContext.clearRect(0,0,cacheWidth,cacheHeight);
        this.__textCacheRenderContext.setTextBaseline("middle");
        switch (this._textHorAlign){
            case hy.gui.TEXT_HORALIGN_LEFT:{
                textx = 0;
                this.__textCacheRenderContext.setTextAlign("left");
                break;
            }
            case hy.gui.TEXT_HORALIGN_RIGHT:{
                textx = cacheWidth;
                this.__textCacheRenderContext.setTextAlign("right");
                break;
            }
            default :{
                textx = cacheWidth / 2;
                this.__textCacheRenderContext.setTextAlign("center");
                break;
            }
        }
        this.__textCacheRenderContext.setFillStyle(this._textColor);
        for(var i = 0 ; i < lineNum ; ++i){
            this.__textCacheRenderContext.fillText(this.__textMutliLines[i],textx,texty);
            texty += lineHeight;
        }
    }else{
        this.__textCacheRenderContext.setSize(0,0);
    }
    this.__textCacheInvalid = false;
}
hy.gui.Label.prototype._paintLabelText = function(sender, dc, rect){
    if(this.__textFontSizeInvalid){
        this._pickupLabelTextFontSize();
    }
    if(this.__textLayoutInvalid){
        this._layoutLabelText();
    }
    if(this.__textCacheInvalid){
        this._paintLabelTextCache();
    }
    var cacheRenderSize = this.__textCacheRenderContext.getSize();
    if(!this._textHidden && cacheRenderSize.width > 0 && cacheRenderSize.height > 0){
        var srcwidth,srcheight;
        var borderWidth = (this._borderColor && this._borderWidth > 0) ? this._borderWidth : 0;
        var desx = this._textPaddingLeft+borderWidth;
        var desy = this._textPaddingTop+borderWidth;
        var labelwidth = rect.width - desx - this._textPaddingRight - borderWidth;
        var labelheight = rect.height - desy - this._textPaddingBottom - borderWidth;
        if(labelwidth > 0 && labelheight > 0){
            srcwidth = (cacheRenderSize.width < labelwidth) ? cacheRenderSize.width:labelwidth;
            srcheight = (cacheRenderSize.height < labelheight) ? cacheRenderSize.height:labelheight;
            switch (this._textHorAlign){
                case hy.gui.TEXT_HORALIGN_LEFT:{
                    break;
                }
                case hy.gui.TEXT_HORALIGN_RIGHT:{
                    desx += labelwidth - srcwidth;
                    break;
                }
                default :{
                    desx += (labelwidth - srcwidth)/2;
                    break;
                }
            }
            switch (this._textVerAlign){
                case hy.gui.TEXT_VERALIGN_TOP:{
                    break;
                }
                case hy.gui.TEXT_VERALIGN_BOTTOM:{
                    desy += (labelheight-srcheight);
                    break;
                }
                default :{
                    desy += (labelheight-srcheight)/2;
                    break;
                }
            }
            dc.drawImageExt(this.__textCacheRenderContext.getCanvas(),0,0,srcwidth,srcheight,desx,desy,srcwidth,srcheight);
        }
    }
}