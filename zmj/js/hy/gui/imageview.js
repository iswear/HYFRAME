var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.ImageView = hy.extend(hy.gui.View);
hy.gui.ImageView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._image = this.isUndefined(config.image) ? null : config.image;
    this._mirror = this.isUndefined(config.mirror) ? hy.gui.MIRROR_NONE : config.mirror;
    this.addObserver(this.notifyPaint, this, this._paintImageViewImg);
}
hy.gui.ImageView.prototype.setImage = function(image){
    if(this._image != image){
        this._image = image;
        this.refresh();
    }
}
hy.gui.ImageView.prototype.getImage = function(){
    return this._image;
}
hy.gui.ImageView.prototype.setMirror = function(mirror){
    if(this._mirror != mirror){
        this._mirror = mirror;
        this.refresh();
    }
}
hy.gui.ImageView.prototype.getMirror = function(){
    return this._mirror;
}
hy.gui.ImageView.prototype._paintImageViewImgSubFun = function(dc, rect, image, srcX, srcY, srcWidth, srcHeight){
    switch (this._mirror){
        case hy.gui.MIRROR_X:{
            dc.pushTransform(0, 0, -1, 1, 0, false);
            dc.drawImageExt(image,srcX,srcY,srcWidth,srcHeight,rect.x-rect.width,rect.y,rect.width,rect.height);
            dc.popTransform();
            break;
        }
        case hy.gui.MIRROR_Y:{
            dc.pushTransform(0, 0, 1, -1, 0, false);
            dc.drawImageExt(image, srcX, srcY, srcWidth, srcHeight, rect.x, rect.y-rect.height, rect.width, rect.height);
            dc.popTransform();
            break;
        }
        case hy.gui.MIRROR_BOTH:{
            dc.pushTransform(0, 0, -1, -1, 0, false);
            dc.drawImageExt(image, srcX, srcY, srcWidth, srcHeight, rect.x-rect.width, rect.y-rect.height, rect.width, rect.height);
            dc.popTransform();
            break;
        }
        default :{
            dc.drawImageExt(image, srcX, srcY, srcWidth, srcHeight, rect.x, rect.y, rect.width, rect.height);
            break;
        }
    }
}
hy.gui.ImageView.prototype._paintImageViewImg = function(sender, dc, rect){
    if(this._image != null){
        var app = this.getApplication();
        if(app){
            var loader = app.getFileLoader();
            if(typeof(this._image) == "string"){
                var image = loader.getImage(this._image);
                if(image){
                    this._paintImageViewImgSubFun(dc, rect, image, 0, 0, image.width, image.height);
                }else{
                    loader.loadImageAsync(this._image,this,this._loadImageViewImgCB);
                }
            }else{
                var image = loader.getImage(this._image.URL);
                if(image){
                    this._paintImageViewImgSubFun(dc, rect, image, this._image.srcX, this._image.srcY, this._image.srcWidth, this._image.srcHeight);
                }else{
                    loader.loadImageAsync(this._image,this,this._loadImageViewImgCB);
                }
            }
        }
    }
}
hy.gui.ImageView.prototype._loadImageViewImgCB = function(url,success){
    if(success){
        this.refresh();
    }
}