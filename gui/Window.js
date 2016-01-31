HY.GUI.Window = function(config){
    this.init(config);
}
HY.GUI.Window.prototype = new HY.Core.RichNode();
HY.GUI.Window.prototype.defaultBackgroundColor = "#000000";
HY.GUI.Window.prototype.defaultTitle = "title";
HY.GUI.Window.prototype.defaultDragZone = {x:0,y:0,width:99999.0,height:30};
HY.GUI.Window.prototype.defaultDragEnable = true;
HY.GUI.Window.prototype.defaultAnchorMoveEnable = false;
HY.GUI.Window.prototype.defaultResizeEnable = true;
HY.GUI.Window.prototype.defaultRotateEnable = false;
HY.GUI.Window.prototype.defaultCloseEnable = false;
HY.GUI.Window.prototype.defaultLayoutStyle = 1;
HY.GUI.Window.prototype.defaultAdjustBorder = 5;
HY.GUI.Window.prototype.defaultClipBound = true;
HY.GUI.Window.prototype.defaultAnchorX = 0;
HY.GUI.Window.prototype.defaultAnchorY = 0;
HY.GUI.Window.prototype.defaultIcon = {
	src:HY.ImageData.systemIcon,
	srcX:0,
	srcY:0,
    srcWidth:20,
	srcHeight:20
};
HY.GUI.Window.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._titleIcon = new HY.GUI.ImageView({
        mouseEnable:false
    });
    this._titleLabel = new HY.GUI.Label({
        fontSize:13,
        textColor:'#ffffff',
        textAlign:HY.GUI.TEXTALIGNLEFT,
        mouseEnable:false
    });
    this._closeBtn = new HY.GUI.View({
        mouseEnable:true,
        backgroundColor:"#ff0000",
        cacheEnable:true
    });
    if(config.title) { this._titleLabel.setText(config.title); } else { this._titleLabel.setText(this.defaultTitle); }
    if(config.icon) { this._titleIcon.setImage(config.icon); } else { this._titleIcon.setImage(this.defaultIcon); }
    if(config.closeEnable) { this._closeEnable = config.closeEnable; } else { this._closeEnable = this.defaultCloseEnable; }
    if(config.viewPort) { this._viewPort = config.viewPort; } else { this._viewPort = new HY.GUI.View({backgroundColor:"#ffffff"}); }
}
HY.GUI.Window.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addChildNodeAtLayer(this._titleIcon,0);
    this.addChildNodeAtLayer(this._titleLabel,0);
    this.addChildNodeAtLayer(this._closeBtn,0);
    this.addChildNodeAtLayer(this._viewPort,0);
    this._closeBtn.addEventListener("paint",this._closeBtnPaint,this);
    this._closeBtn.addEventListener("mouseup",this._closeBtnMouseUp,this);
}
HY.GUI.Window.prototype.layoutSubNodes = function(){
	this.superCall("layoutSubNodes");
	this._titleIcon.setX(5);
	this._titleIcon.setY(5);
	this._titleIcon.setWidth(20);
	this._titleIcon.setHeight(20);
	this._titleLabel.setX(30);
	this._titleLabel.setY(5);
	this._titleLabel.setWidth(this.getWidth()-60);
	this._titleLabel.setHeight(20);
	this._closeBtn.setX(this.getWidth()-25);
	this._closeBtn.setY(5);
	this._closeBtn.setWidth(20);
	this._closeBtn.setHeight(20);
	this._viewPort.setX(5);
	this._viewPort.setY(30);
	this._viewPort.setWidth(this.getWidth()-10);
	this._viewPort.setHeight(this.getHeight()-35);
}
HY.GUI.Window.prototype.showCloseBtn = function(){
    this._closeBtn.setVisible(true);
}
HY.GUI.Window.prototype.hideCloseBtn = function(){
    this._closeBtn.setVisible(false);
}
HY.GUI.Window.prototype.getViewPort = function(){
    return this._viewPort;
}
HY.GUI.Window.prototype.setViewPort = function(pView){
	if(this._viewPort != pView){
        this._viewPort.removeFromParent();
	}
	this._viewPort = pView;
	this.addChildNodeAtLayer(this._viewPort,0);
	this.needLayoutSubNodes();
}
HY.GUI.Window.prototype.getTitle = function(){
	return this._titleLabel.getText();
}
HY.GUI.Window.prototype.setTitle = function(pTitle){
    this._titleLabel.setText(pTitle);
}
HY.GUI.Window.prototype.getIcon = function(){
	return this._titleIcon.getImage();
}
HY.GUI.Window.prototype.setIcon = function(pImage){
    this._titleIcon.setImage(pImage);
}
HY.GUI.Window.prototype.onClose = function(sender){
    this.launchEvent("close",[this]);
}
HY.GUI.Window.prototype._closeBtnMouseUp = function(sender,e){
    this.onClose(this);
}
HY.GUI.Window.prototype._closeBtnPaint = function(sender,dc,rect){
    dc.setLineWidth(2);
    dc.setStrokeStyle("#ffffff");
    dc.beginPath();
    dc.moveTo(sender.getWidth()/4,sender.getWidth()/4);
    dc.lineTo(sender.getWidth()*3/4,sender.getWidth()*3/4);
    dc.moveTo(sender.getWidth()*3/4,sender.getWidth()/4);
    dc.lineTo(sender.getWidth()/4,sender.getWidth()*3/4);
    dc.stroke();
}