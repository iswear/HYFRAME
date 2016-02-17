/**
 * Created by Administrator on 2015/9/26.
 */
HY.Core.RenderContext = function(config){
    this.init(config);
}
HY.Core.RenderContext.prototype = new HY.Object();
HY.Core.RenderContext.prototype.defaultWidth = 300;
HY.Core.RenderContext.prototype.defaultHeight = 200;
HY.Core.RenderContext.prototype.init = function(config){
    this._context = null;
    this._statusStack = [];
    this._curStatus = {};

    this.superCall("init",[config]);
    if(config.canvas != undefined){ this.setCanvas(config.canvas); } else { this.setCanvas(document.createElement("canvas")); }
    if(config.width != undefined){ this.setWidth(config.width); } else { this.setWidth(this.defaultWidth); }
    if(config.height != undefined){ this.setHeight(config.height); } else { this.setHeight(this.defaultHeight); }
    this.syncStatusFromContext();
}
HY.Core.RenderContext.prototype.syncStatusFromContext = function(){
    if(this._context){
        this._curStatus._fillStyle = this._context.fillStyle;
        this._curStatus._strokeStyle = this._context.strokeStyle;
        this._curStatus._shadowColor = this._context.shadowColor;
        this._curStatus._shadowBlur = this._context.shadowBlur;
        this._curStatus._shadowOffsetX = this._context.shadowOffsetX;
        this._curStatus._shadowOffsetY = this._context.shadowOffsetY;
        this._curStatus._lineCap = this._context.lineCap;
        this._curStatus._lineJoin = this._context.lineJoin;
        this._curStatus._lineWidth = this._context.lineWidth;
        this._curStatus._miterLimit = this._context.miterLimit;
        this._curStatus._font = this._context.font;
        this._curStatus._textAlign = this._context.textAlign;
        this._curStatus._textBaseline = this._context.textBaseline;
        this._curStatus._globalAlpha = this._context.globalAlpha;
        this._curStatus._globalCompositeOperation = this._context.globalCompositeOperation;
    }else{
        this._curStatus._fillStyle = null;
        this._curStatus._strokeStyle = null;
        this._curStatus._shadowColor = null;
        this._curStatus._shadowBlur = 0;
        this._curStatus._shadowOffsetX = 0;
        this._curStatus._shadowOffsetY = 0;
        this._curStatus._lineCap = null;
        this._curStatus._lineJoin = null;
        this._curStatus._lineWidth = 0;
        this._curStatus._miterLimit = 0;
        this._curStatus._font = null;
        this._curStatus._textAlign = null;
        this._curStatus._textBaseline = null;
        this._curStatus._globalAlpha = 0;
        this._curStatus._globalCompositeOperation = null;
    }
}
HY.Core.RenderContext.prototype.syncStatusToContext = function(){
    this._context.fillStyle = this._curStatus._fillStyle;
    this._context.strokeStyle = this._curStatus._strokeStyle;
    this._context.shadowColor = this._curStatus._shadowColor;
    this._context.shadowBlur = this._curStatus._shadowBlur;
    this._context.shadowOffsetX = this._curStatus._shadowOffsetX;
    this._context.shadowOffsetY = this._curStatus._shadowOffsetY;
    this._context.lineCap = this._curStatus._lineCap;
    this._context.lineJoin = this._curStatus._lineJoin;
    this._context.lineWidth = this._curStatus._lineWidth;
    this._context.miterLimit = this._curStatus.miterLimit;
    this._context.font = this._curStatus._font;
    this._context.textAlign = this._curStatus._textAlign;
    this._context.textBaseline = this._curStatus._textBaseline;
    this._context.globalAlpha = this._curStatus._globalAlpha;
    this._context.globalCompositeOperation = this._curStatus._globalCompositeOperation;
}
HY.Core.RenderContext.prototype.cloneStatus = function(status){
    var statusobj = {};
    statusobj._fillStyle = this._curStatus._fillStyle;
    statusobj._strokeStyle = this._curStatus._strokeStyle;
    statusobj._shadowColor = this._curStatus._shadowColor;
    statusobj._shadowBlur = this._curStatus._shadowBlur;
    statusobj._shadowOffsetX = this._curStatus._shadowOffsetX;
    statusobj._shadowOffsetY = this._curStatus._shadowOffsetY;
    statusobj._lineCap = this._curStatus._lineCap;
    statusobj._lineJoin = this._curStatus._lineJoin;
    statusobj._lineWidth = this._curStatus._lineWidth;
    statusobj._miterLimit = this._curStatus._miterLimit;
    statusobj._font = this._curStatus._font;
    statusobj._textAlign = this._curStatus._textAlign;
    statusobj._textBaseline = this._curStatus._textBaseline;
    statusobj._globalAlpha = this._curStatus._globalAlpha;
    statusobj._globalCompositeOperation = this._curStatus._globalCompositeOperation;
    return statusobj;
}
HY.Core.RenderContext.prototype.getCanvas = function(){
    return this._canvas;
}
HY.Core.RenderContext.prototype.setCanvas = function(pCanvas){
    this.addApiCount("e_canvas");
    if(this._canvas != pCanvas){
        this.addApiCount("f_canvas");
        this._canvas = pCanvas;
        if(this._canvas) {
            this._canvas.width = this._width?this._width:0;
            this._canvas.height = this._height?this._height:0;
            this._context = this._canvas.getContext("2d");
        }
        this._statusStack = [];
        this._curStatus = {};
        this.syncStatusFromContext();
    }
}
HY.Core.RenderContext.prototype.getWidth = function(){
    return this._width;
}
HY.Core.RenderContext.prototype.setWidth = function(pWidth){
    this.addApiCount("e_width");
    if(this._width != pWidth){
        this.addApiCount("f_width");
        this._width = pWidth;
        this.syncStatusToContext();
        if(this._canvas){
            this._canvas.width = pWidth;
        }
    }
}
HY.Core.RenderContext.prototype.getHeight = function(){
    return this._height;
}
HY.Core.RenderContext.prototype.setHeight = function(pHeight){
    this.addApiCount("e_height");
    if(this._height != pHeight){
        this.addApiCount("f_height");
        this._height = pHeight;
        this.syncStatusToContext();
        if(this._canvas){
            this._canvas.height = pHeight;
        }
    }
}
HY.Core.RenderContext.prototype.getFillStyle = function(){
    return this._curStatus._fillStyle;
}
HY.Core.RenderContext.prototype.setFillStyle = function(pfillstyle){
    this.addApiCount("e_fillstyle");
    if(this._curStatus._fillStyle != pfillstyle){
        this.addApiCount("f_fillstyle");
        this._curStatus._fillStyle = pfillstyle;
        this._context.fillStyle = pfillstyle;
        this._curStatus._fillStyle = this._context.fillStyle;
    }
}
HY.Core.RenderContext.prototype.getStrokeStyle = function(){
    return this._curStatus._strokeStyle;
}
HY.Core.RenderContext.prototype.setStrokeStyle = function(pStrokeStyle){
    this.addApiCount("e_strokestyle");
    if(this._curStatus._strokeStyle != pStrokeStyle){
        this.addApiCount("f_strokestyle");
        this._curStatus._strokeStyle = pStrokeStyle;
        this._context.strokeStyle = pStrokeStyle;
    }
}
HY.Core.RenderContext.prototype.getShadowColor = function(){
    return this._curStatus._shadowColor;
}
HY.Core.RenderContext.prototype.setShadowColor = function(pShadowColor){
    this.addApiCount("e_shadowcolor");
    if(this._curStatus._shadowColor != pShadowColor){
        this.addApiCount("f_shadowcolor");
        this._curStatus._shadowColor = pShadowColor;
        this._context.shadowColor = pShadowColor;
    }
}
HY.Core.RenderContext.prototype.getShadowBlur =function(){
    return this._curStatus._shadowBlur;
}
HY.Core.RenderContext.prototype.setShadowBlur = function(pShadowBlur){
    this.addApiCount("e_shadowblur")
    if(this._curStatus._shadowBlur != pShadowBlur){
        this.addApiCount("f_shadowblur");
        this._curStatus._shadowBlur = pShadowBlur;
        this._context.shadowBlur = pShadowBlur;
    }
}
HY.Core.RenderContext.prototype.getShadowOffsetX = function(){
    return this._curStatus._shadowOffsetX;
}
HY.Core.RenderContext.prototype.setShadowOffsetX = function(pShadowOffsetX){
    this.addApiCount("e_shadowoffsetx");
    if(this._curStatus._shadowOffsetX != pShadowOffsetX){
        this.addApiCount("f_shadowoffsetx");
        this._curStatus._shadowOffsetX = pShadowOffsetX;
        this._context.shadowOffsetX = pShadowOffsetX;
    }
}
HY.Core.RenderContext.prototype.getShadowOffsetY = function(){
    return this._curStatus._shadowOffsetY;
}
HY.Core.RenderContext.prototype.setShadowOffsetY = function(pShadowOffsetY){
    this.addApiCount("e_shadowoffsety");
    if(this._curStatus._shadowOffsetY != pShadowOffsetY){
        this.addApiCount("f_shadowoffsety");
        this._curStatus._shadowOffsetY = pShadowOffsetY;
        this._context.shadowOffsetY = pShadowOffsetY;
    }
}
HY.Core.RenderContext.prototype.getLineCap = function(){
    return this._curStatus._lineCap;
}
HY.Core.RenderContext.prototype.setLineCap = function(pLineCap){
    this.addApiCount("e_linecap");
    if(this._curStatus._lineCap != pLineCap){
        this.addApiCount("f_linecap");
        this._curStatus._lineCap = pLineCap;
        this._context.lineCap = pLineCap;
    }
}
HY.Core.RenderContext.prototype.getLineJoin = function(){
    return this._curStatus._lineJoin;
}
HY.Core.RenderContext.prototype.setLineJoin = function(pLineJoin){
    this.addApiCount("e_linejoin");
    if(this._curStatus._lineJoin != pLineJoin){
        this.addApiCount("f_linejoin");
        this._curStatus._lineJoin = pLineJoin;
        this._context.lineJoin = pLineJoin;
    }
}
HY.Core.RenderContext.prototype.getLineWidth = function(){
    return this._curStatus._lineWidth;
}
HY.Core.RenderContext.prototype.setLineWidth = function(pLineWidth){
    this.addApiCount("e_linewidth");
    if(this._curStatus._lineWidth != pLineWidth){
        this.addApiCount("f_linewidth");
        this._curStatus._lineWidth = pLineWidth;
        this._context.lineWidth = pLineWidth;
    }
}
HY.Core.RenderContext.prototype.getMiterLimit = function(){
    return this._curStatus._miterLimit;
}
HY.Core.RenderContext.prototype.setMiterLimit = function(pMiterLimit){
    this.addApiCount("e_miterlimit");
    if(this._curStatus._miterLimit != pMiterLimit){
        this.addApiCount("f_miterlimit");
        this._curStatus._miterLimit = pMiterLimit;
        this._context.miterLimit = pMiterLimit;
    }
}
HY.Core.RenderContext.prototype.getFont = function(){
    return this._curStatus._font;
}
HY.Core.RenderContext.prototype.setFont = function(pFont){
    this.addApiCount("e_font");
    if(this._curStatus._font != pFont){
        this.addApiCount("f_font");
        this._curStatus._font = pFont;
        this._context.font = pFont;
    }
}
HY.Core.RenderContext.prototype.getTextAlign = function(){
    return this._curStatus._textAlign;
}
HY.Core.RenderContext.prototype.setTextAlign = function(pTextAlign){
    this.addApiCount("e_textalign");
    if(this._curStatus._textAlign != pTextAlign){
        this.addApiCount("f_textalign");
        this._curStatus._textAlign = pTextAlign;
        this._context.textAlign = pTextAlign;
    }
}
HY.Core.RenderContext.prototype.getTextBaseline = function(){
    return this._curStatus._textBaseline;
}
HY.Core.RenderContext.prototype.setTextBaseline = function(pBaseTextAlign){
    this.addApiCount("e_textbaseline");
    if(this._curStatus._textBaseline != pBaseTextAlign){
        this.addApiCount("f_textbaseline");
        this._curStatus._textBaseline = pBaseTextAlign;
        this._context.textBaseline = pBaseTextAlign;
    }
}
HY.Core.RenderContext.prototype.getGlobalAlpha = function(){
    return this._curStatus._globalAlpha;
}
HY.Core.RenderContext.prototype.setGlobalAlpha = function(pAlpha){
    this.addApiCount("e_globalalpha");
    if(this._curStatus._globalAlpha != pAlpha){
        this.addApiCount("f_globalalpha");
        this._curStatus._globalAlpha = pAlpha;
        this._context.globalAlpha = pAlpha;
    }
}
HY.Core.RenderContext.prototype.getGlobalCompositeOperation = function(){
    return this._curStatus._globalCompositeOperation;
}
HY.Core.RenderContext.prototype.setGlobalCompositeOperation = function(pValue){
    if(this._curStatus._globalCompositeOperation != pValue){
        this._curStatus._globalCompositeOperation = pValue;
        this._context.globalCompositeOperation = pValue;
    }
}
HY.Core.RenderContext.prototype.createLinearGradient = function(x0,y0,x1,y1){
    this.addApiCount("createLinearGradient");
    return this._context.createLinearGradient(x0,y0,x1,y1);
}
HY.Core.RenderContext.prototype.createPattern = function(image,repeatMode){
    this.addApiCount("createPattern");
    return this._context.createPattern(image,repeatMode);
}
HY.Core.RenderContext.prototype.createRadialGradient = function(x0,y0,r0,x1,y1,r1){
    this.addApiCount("createRadialGradient");
    return this._context.createRadialGradient(x0,y0,r0,x1,y1,r1);
}
HY.Core.RenderContext.prototype.rect = function(x,y,width,height){
    this.addApiCount("rect");
    this._context.rect(x,y,width,height);
}
HY.Core.RenderContext.prototype.fillRect = function(x,y,width,height){
    this.addApiCount("fillRect");
    this._context.fillRect(x,y,width,height);
}
HY.Core.RenderContext.prototype.strokeRect = function(x,y,width,height){
    this.addApiCount("strokerect");
    this._context.strokeRect(x,y,width,height);
}
HY.Core.RenderContext.prototype.clearRect = function(x,y,width,height){
    this.addApiCount("clearrect");
    this._context.clearRect(x,y,width,height);
}
HY.Core.RenderContext.prototype.fill = function(){
    this.addApiCount("fill");
    this._context.fill();
}
HY.Core.RenderContext.prototype.stroke = function(){
    this.addApiCount("stroke");
    this._context.stroke();
}
HY.Core.RenderContext.prototype.beginPath = function(){
    this.addApiCount("beginpath");
    this._context.beginPath();
}
HY.Core.RenderContext.prototype.moveTo = function(x, y){
    this.addApiCount("moveTo");
    this._context.moveTo(x, y);
}
HY.Core.RenderContext.prototype.lineTo = function(x, y){
    this.addApiCount("lineto");
    this._context.lineTo(x, y);
}
HY.Core.RenderContext.prototype.closePath = function(){
    this.addApiCount("closepath");
    this._context.closePath();
}
HY.Core.RenderContext.prototype.clip = function(){
    this.addApiCount("clip");
    this._context.clip();
}
HY.Core.RenderContext.prototype.quadraticCurveTo = function(cpx,cpy,x,y){
    this.addApiCount("quadraticCurveTo");
    this._context.quadraticCurveTo(cpx,cpy,x,y);
}
HY.Core.RenderContext.prototype.bezierCurveTo = function(cp1x,cp1y,cp2x,cp2y,x,y){
    this.addApiCount("bezierCurveTo")
    this._context.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);
}
HY.Core.RenderContext.prototype.arc = function(x,y,r,sAngle,eAngle,counterclockwise){
    this.addApiCount("arc");
    this._context.arc(x,y,r,sAngle,eAngle,counterclockwise);
}
HY.Core.RenderContext.prototype.arcTo = function(x1,y1,x2,y2,r){
    this.addApiCount("arcto");
    this._context.arcTo(x1,y1,x2,y2,r);
}
HY.Core.RenderContext.prototype.isPointInPath = function(x, y){
    this.addApiCount("ispointinpath");
    return this._context.isPointInPath(x, y);
}
HY.Core.RenderContext.prototype.fillText = function(text,x,y){
    this.addApiCount("filltext");
    this._context.fillText(text,x,y);
}
HY.Core.RenderContext.prototype.fillTextExt = function(text,x,y,maxWidth){
    this.addApiCount("filltextext");
    this._context.fillText(text,x,y,maxWidth);
}
HY.Core.RenderContext.prototype.strokeText = function(text,x,y){
    this.addApiCount("stroketext");
    this._context.strokeText(text,x,y);
}
HY.Core.RenderContext.prototype.strokeTextExt = function(text,x,y,maxWidth){
    this.addApiCount("stroketextext");
    this._context.strokeText(text,x,y,maxWidth);
}
HY.Core.RenderContext.prototype.measureTextWidth = function(text){
    this.addApiCount("measureTextWidth");
    return this._context.measureText(text).width;
}
HY.Core.RenderContext.prototype.drawImage = function(img,x,y){
    this.addApiCount("drawImage");
    this._context.drawImage(img,x,y);
}
HY.Core.RenderContext.prototype.drawImageExt = function(img,sx,sy,swidth,sheight,x,y,width,height){
    this.addApiCount("drawImageExt");
    this._context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
}
HY.Core.RenderContext.prototype.createImageData = function(width,height){
    this.addApiCount("createImageData");
    this._context.createImageData(width,height);
}
HY.Core.RenderContext.prototype.getImageData = function(x,y,width,height){
    this.addApiCount("getImageData");
    return this._context.getImageData(x,y,width,height);
}
HY.Core.RenderContext.prototype.putImageData = function(imgData,x,y){
    this.addApiCount("putImageData");
    this._context.putImageData(imgData,x,y);
}
HY.Core.RenderContext.prototype.putImageDataExt = function(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight){
    this.addApiCount("putImageDataExt");
    this._context.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
}
HY.Core.RenderContext.prototype.pushTransform = function(x, y, scaleX, scaleY, rotate, pClip){
    this._statusStack.push(this.cloneStatus(this._curStatus));
    this.addApiCount("save");
    this._context.save();
    if(x != 0 || y != 0){
        this.addApiCount("translate");
        this._context.translate(x, y);
    }
    if(rotate != 0){
        this.addApiCount("rotate");
        this._context.rotate(rotate);
    }
    if(scaleX != 1 || scaleY != 1){
        this.addApiCount("scale");
        this._context.scale(scaleX,scaleY);
    }
}
HY.Core.RenderContext.prototype.popTransform = function(){
    this._context.restore();
    this._curStatus = this._statusStack.pop();
}
HY.Core.RenderContext.prototype.toDataURL = function(){
    return this._canvas.toDataURL();
}

var apiCount = {};
HY.Core.RenderContext.prototype.clearApiCount = function(){
    apiCount = {};
}
HY.Core.RenderContext.prototype.addApiCount = function(apiname){
    if(!apiCount){
        apiCount = {};
    }
    if(apiCount[apiname] == undefined){
        apiCount[apiname] = 1;
    }else{
        apiCount[apiname]++;
    }
}
