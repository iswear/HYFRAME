/**
 * Created by Administrator on 2014/11/3.//ImageClip//ImageClip
 */
HY.GUI.ImageView = function(config){
    this.init(config);
}
HY.GUI.ImageView.prototype = new HY.GUI.View();
HY.GUI.ImageView.prototype.defaultReverse = HY.GUI.REVERSENONE;
HY.GUI.ImageView.prototype.defaultCacheEnable = true;
HY.GUI.ImageView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.image != undefined){ this._image = config.image; } else { this._image = null; }
    if(config.reverse != undefined){ this._reverse = config.reverse; } else { this._reverse = this.defaultReverse; }
}
HY.GUI.ImageView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("paint",this._selfPaint,this);
}
HY.GUI.ImageView.prototype.getImage = function(){
    return this._image;
}
HY.GUI.ImageView.prototype.setImage = function(pImage){
    this._image = pImage;
    this.reRender();
}
HY.GUI.ImageView.prototype._selfPaint = function(sender, dc, rect) {
    if (this._image != null) {
        var app = this.getApplication();
        if (typeof(this._image) == "string") {
            var image = app.getResourceManager().getImage(this._image,this._image);
            if (image) {
                switch (this.reverse) {
                    case HY.GUI.REVERSEXAXIS:
                        dc.pushTransfrom(0, 0, -1, 1, 0, false);
                        dc.drawImageExt(image, 0, 0, this.getWidth(), this.getHeight());
                        dc.popTransform();
                        break;
                    case HY.GUI.REVERSEYAXIS:
                        dc.pushTransfrom(0, 0, 1, -1, 0, false);
                        dc.drawImageExt(image, 0, 0, this.getWidth(), this.getHeight());
                        dc.popTransform();
                        break;
                    case HY.GUI.REVERSEBOTH:
                        dc.pushTransfrom(0, 0, -1, -1, false);
                        dc.drawImageExt(image, 0, 0, this.getWidth(), this.getHeight());
                        dc.popTransform();
                        break;
                    default:
                        dc.drawImageExt(image, 0, 0, this.getWidth(), this.getHeight());
                        break;
                }
            }
        } else {
            if (this._image.src) {
                if(!this._image.key){
                    this._image.key = this._image.src;
                }
                var image = app.getResourceManager().getImage( this._image.key,this._image.src);
                if (image) {
                    if (this._image.srcX < 0) {
                        this._image.srcX = 0;
                    }
                    if (this._image.srcY < 0) {
                        this._image.srcY = 0;
                    }
                    if (this._image.srcWidth <= 0) {
                        this._image.srcWidth = image.width;
                    }
                    if (this._image.srcHeight <= 0) {
                        this._image.srcHeight = image.height;
                    }
                    switch (this._image.reverse) {
                        case HY.GUI.REVERSEXAXIS:
                            dc.pushTransfrom(0, 0, -1, 1, 0, false);
                            dc.drawImageExt(image, this._image.srcX, this._image.srcY, this._image.srcWidth, this._image.srcHeight, 0, 0, this.getWidth(), this.getHeight());
                            dc.popTransform();
                            break;
                        case HY.GUI.REVERSEYAXIS:
                            dc.pushTransfrom(0, 0, 1, -1, 0, false);
                            dc.drawImageExt(image, this._image.srcX, this._image.srcY, this._image.srcWidth, this._image.srcHeight, 0, 0, this.getWidth(), this.getHeight());
                            dc.popTransform();
                            break;
                        case HY.GUI.REVERSEBOTH:
                            dc.pushTransfrom(0, 0, -1, -1, false);
                            dc.drawImageExt(image, this._image.srcX, this._image.srcY, this._image.srcWidth, this._image.srcHeight, 0, 0, this.getWidth(), this.getHeight());
                            dc.popTransform();
                            break;
                        default:
                            dc.drawImageExt(image, this._image.srcX, this._image.srcY, this._image.srcWidth, this._image.srcHeight, 0, 0, this.getWidth(), this.getHeight());
                            break;
                    }
                }
            }
        }
    }
}