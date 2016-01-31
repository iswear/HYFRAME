/**
 * Created by songtao on 14-10-23.
 */
HY.GUI.Label = function(config){
    this.init(config);
}
HY.GUI.Label.prototype = new HY.GUI.View();
HY.GUI.Label.prototype.defaultText = "Label";
HY.GUI.Label.prototype.defaultTextColor = "#000000";
HY.GUI.Label.prototype.defaultTextAlign = HY.GUI.TEXTALIGNCENTER;
HY.GUI.Label.prototype.defaultVerticalAlign = HY.GUI.TEXTVERTICALALIGNMIDDLE;
HY.GUI.Label.prototype.defaultMouseEnable = false;
HY.GUI.Label.prototype.defaultCacheEnable = true;
HY.GUI.Label.prototype.defaultFontSize = 12;
HY.GUI.Label.prototype.defaultFontFamily = "sans-serif";
HY.GUI.Label.prototype.defaultFontItalic = false;
HY.GUI.Label.prototype.defaultFontBold = false;
HY.GUI.Label.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.fontSize != undefined){ this._fontSize = config.fontSize; } else { this._fontSize = this.defaultFontSize; }
    if(config.fontFamily != undefined){ this._fontFamily = config.fontFamily } else{ this._fontFamily = this.defaultFontFamily; }
    if(config.fontItalic != undefined){ this._fontItalic = config.fontItalic; } else { this._fontItalic = false; }
    if(config.fontBold != undefined){ this._fontBold = config.fontBold; } else { this._fontBold = false; }
    if(config.lineHeight != undefined){ this._lineHeight = config.lineHeight; } else { this._lineHeight = Math.floor(this._fontSize*3/2); }
    if(config.text != undefined){ this._text = config.text; } else { this._text = this.defaultText; }
    if(config.textColor != undefined){ this._textColor = config.textColor; } else { this._textColor = this.defaultTextColor; }
    if(config.textAlign != undefined){ this._textAlign = config.textAlign; } else { this._textAlign = this.defaultTextAlign; }
    if(config.verticalAlign != undefined){ this._verticalAlign = config.verticalAlign; } else { this._verticalAlign = this.defaultVerticalAlign; }
    if(config.numberOfLines != undefined){ this._numberOfLines = config.numberOfLines; } else { this._numberOfLines = 1; }
    if(config.textChangedEvent != undefined){ this.addEventListener("textchanged",config.textChangedEvent.selector,config.textChangedEvent.target); }
    this._font = null;
    this._textLayoutArray = null;
}
HY.GUI.Label.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("paint",this._selfPaint,this);
    this.addEventListener("widthchanged",this._selfWidthChanged,this);
    this._initFont();
    this._initLayout(this.getWidth());
}
HY.GUI.Label.prototype.getFontSize = function(){
    return this._fontSize;
}
HY.GUI.Label.prototype.setFontSize = function(fontsize){
    if(this._fontSize != fontsize){
        this._fontSize = fontsize;
        this._initFont();
        this._initLayout(this.getWidth());
        this.updateCache();
        this.reRender();
    }
}
HY.GUI.Label.prototype.getFontFamily = function(){
    return this._fontFamily;
}
HY.GUI.Label.prototype.setFontFamily = function(fontfamily){
    if(this._fontFamily != fontfamily){
        this._fontFamily = fontfamily;
        this._initFont();
        this._initLayout(this.getWidth());
        this.updateCache();
        this.reRender();
    }
}
HY.GUI.Label.prototype.getFontItalic = function(){
    return this._fontItalic;
}
HY.GUI.Label.prototype.setFontItalic = function(fontitalic){
    if(this._fontItalic != fontitalic){
        this._fontItalic = fontitalic;
        this._initFont();
        this.updateCache();
        this.reRender();
    }
}
HY.GUI.Label.prototype.getFontBold = function(){
    return this._fontBold;
}
HY.GUI.Label.prototype.setFontBold = function(fontbold){
    if(this._fontBold != fontbold){
        this._fontBold = fontbold;
        this._initFont();
        this.updateCache();
        this.reRender();
    }
}
HY.GUI.Label.prototype.getText = function(){
    return this._text;
}
HY.GUI.Label.prototype.setText = function(pText){
    if(this._text != pText){
        this._text = pText;
        this._initLayout(this.getWidth());
        this.updateCache();
        this.reRender();
    }
}
HY.GUI.Label.prototype.getTextColor = function(){
    return this._textColor;
}
HY.GUI.Label.prototype.setTextColor = function(pColor){
    if(this._textColor != pColor){
        this._textColor = pColor;
        this.updateCache();
        this.reRender();
    }
}
HY.GUI.Label.prototype.getTextAlign = function(){
    return this._textAlign;
}
HY.GUI.Label.prototype.setTextAlign = function(pAlign){
    if(this._textAlign != pAlign){
        this._textAlign = pAlign;
        this.updateCache();
        this.reRender();
    }
}
HY.GUI.Label.prototype.getVerticalAlign = function(){
    return this._verticalAlign;
}
HY.GUI.Label.prototype.setVerticalAlign = function(pAlign){
    if(this._verticalAlign != pAlign){
        this._verticalAlign = pAlign;
        this.updateCache();
        this.reRender();
    }
}
HY.GUI.Label.prototype.onTextChanged = function(sender){
    this.launchEvent("textchanged",[this]);
}
HY.GUI.Label.prototype._selfPaint = function(sender,dc,rect){
    if(this._numberOfLines >= 0){
        if(this._numberOfLines == 1){
            var textx,texty;
            var lineheight = (this._lineHeight>this._fontSize)?this._lineHeight:this._fontSize;
            switch (this._verticalAlign){
                case HY.GUI.TEXTVERTICALALIGNTOP:{
                    texty = lineheight/2;
                    break;
                }
                case HY.GUI.TEXTVERTICALALIGNBOTTOM:{
                    texty = this.getHeight() - lineheight/2;
                    break;
                }
                default :{
                    texty = this.getHeight()/2;
                    break;
                }
            }
            dc.setTextBaseline('middle');
            switch (this._textAlign){
                case HY.GUI.TEXTALIGNLEFT:{
                    dc.setTextAlign('left');
                    textx = 0;
                    break;
                }
                case HY.GUI.TEXTALIGNCRIGHT:{
                    dc.setTextAlign('right');
                    textx = this.getWidth();
                    break;
                }
                default :{
                    dc.setTextAlign('center');
                    textx = this.getWidth()/2;
                    break;
                }
            }
            dc.setFont(this._font);
            dc.setFillStyle(this._textColor);
            dc.fillText(this._text,textx,texty);
        }else{
            var lineheight = (this._lineHeight>this._fontSize)?this._lineHeight:this._fontSize;
            var linenum = 0;
            var textx = 0,texty = lineheight/2;
            if(this._numberOfLines > 0 && this._numberOfLines < this._textLayoutArray.length){
                linenum = this._numberOfLines;
            }else{
                linenum = this._textLayoutArray.length;
            }
            switch (this._textAlign){
                case HY.GUI.TEXTALIGNLEFT:{
                    dc.setTextAlign('left');
                    textx = 0;
                    break;
                }
                case HY.GUI.TEXTALIGNCRIGHT:{
                    dc.setTextAlign('right');
                    textx = this.getWidth();
                    break;
                }
                default :{
                    dc.setTextAlign('center');
                    textx = this.getWidth()/2;
                    break;
                }
            }
            dc.setTextBaseline('middle');
            switch (this._verticalAlign){
                case HY.GUI.TEXTVERTICALALIGNMIDDLE:{
                    if(this.getMinLayoutHeight() < this.getHeight()){
                        texty = (this.getHeight()-this.getMinLayoutHeight())/2+texty;
                    }
                    break;
                }
                case HY.GUI.TEXTVERTICALALIGNBOTTOM:{
                    texty = this.getHeight() - this.getMinLayoutHeight() + texty;
                    break;
                }
                default :{
                    break;
                }
            }
            dc.setFont(this._font);
            dc.setFillStyle(this._textColor);
            for(var i=0;i<linenum;++i){
                var text = this._textLayoutArray[i];
                dc.fillText(this._textLayoutArray[i],textx,texty);
                texty += lineheight;
            }
        }
    }
}
HY.GUI.Label.prototype._selfWidthChanged = function(sender){
    if(this._numberOfLines != 1){
        this._initLayout(this.getWidth());
    }
}
HY.GUI.Label.prototype._initFont = function(){
    this._font = this._fontSize + "px " + this._fontFamily;
    if(this._fontItalic){
        this._font += " italic";
    }
    if(this._fontBold){
        this._font += " bold";
    }
}
HY.GUI.Label.prototype._initLayout = function(maxwidth){
    this._initTextLayoutArray(maxwidth);
    this._initMinLayoutWidth();
    this._initMinLayoutHeight();
}
HY.GUI.Label.prototype._initTextLayoutArray = function(maxWidth){
    if(this._numberOfLines != 1){
        this._textLayoutArray = HY.Core.TextLayouter.instance.getTextLayoutArray(this._text,this._font,maxWidth);
    }else{
        this._textLayoutArray = null;
    }
}
HY.GUI.Label.prototype._initMinLayoutWidth = function(){
    if(this._numberOfLines == 1){
        this.setMinLayoutWidth(HY.Core.TextLayouter.instance.getTextLayoutWidth(this._text,this._font));
    }else if(this._numberOfLines == 0){
        this.setMinLayoutWidth(this.getWidth());
    }
}
HY.GUI.Label.prototype._initMinLayoutHeight = function(){
    if(this._numberOfLines == 1){
        if(this._lineHeight < this._fontSize){
            this.setMinLayoutHeight(this._fontSize);
        }else{
            this.setMinLayoutHeight(this._lineHeight);
        }
    }else{
        if(this._textLayoutArray == null){
            this.setMinLayoutHeight(0);
        }else{
            if(this._lineHeight < this._fontSize){
                if(this._numberOfLines > 0 && this._numberOfLines < this._textLayoutArray.length){
                    this.setMinLayoutHeight(this._fontSize * this._numberOfLines);
                }else{
                    this.setMinLayoutHeight(this._fontSize * this._textLayoutArray.length);
                }
            }else{
                if(this._numberOfLines > 0 && this._numberOfLines < this._textLayoutArray.length){
                    this.setMinLayoutHeight(this._lineHeight * this._numberOfLines);
                }else{
                    this.setMinLayoutHeight(this._lineHeight * this._textLayoutArray.length);
                }
            }
        }
    }
}