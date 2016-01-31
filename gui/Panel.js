/**
 * Created by Administrator on 2014/12/7.
 */
HY.GUI.Panel = function(config){
    this.init(config);
}
HY.GUI.Panel.prototype = new HY.GUI.View();
HY.GUI.Panel.prototype.defaultDragEnable = false;
HY.GUI.Panel.prototype.defaultResizeEnable = false;
HY.GUI.Panel.prototype.defaultMouseTrigger = false;
HY.GUI.Panel.prototype.defaultBackgroundColor = null;
HY.GUI.Panel.prototype.defaultHeaderConstraint = true;
HY.GUI.Panel.prototype.defaultTitle = "title";
HY.GUI.Panel.prototype.defaultIcon = {
	src:HY.ImageData.systemIcon,
	srcX:0,
	srcY:0,
	srcHeight:20,
	srcWidth:20
};
HY.GUI.Panel.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._headerView = new HY.GUI.View({
        backgroundColor:'#333333'
    });
    this._titleLabel =  new HY.GUI.Label({
        fontSize:9,
        textColor:'#ffffff',
        textAlign:HY.GUI.TEXTALIGNLEFT,
        mouseEnable:false
    });
    this._titleIcon = new HY.GUI.ImageView({
        mouseEnable:false
    });
    if(config.viewPort != undefined){ this._viewPort = config.viewPort; } else { this._viewPort = new HY.GUI.View({backgroundColor:'#ffffff'}); }
    if(config.title != undefined){ this._titleLabel.setText(config.title); } else { this._titleLabel.setTitle(this.defaultTitle); }
    if(config.icon != undefined){ this._titleIcon.setImage(config.icon); } else { this._titleIcon.setImage(this.defaultIcon); }
    if(config.headerConstraint != undefined){ this._headerConstraint = config.headerConstraint; } else { this._headerConstraint=this.defaultHeaderConstraint; }
}
HY.GUI.Panel.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this._headerView.addChildNodeAtLayer(this._titleLabel,0);
    this._headerView.addChildNodeAtLayer(this._titleIcon,0);
    this.addChildNodeAtLayer(this._headerView,0);
    this.addChildNodeAtLayer(this._viewPort,0);
}
HY.GUI.Panel.prototype.layoutSubNodes = function () {
	this.superCall("layoutSubNodes");
    if(this._headerConstraint){
        this._headerView.setX(0);
        this._headerView.setY(0);
        this._headerView.setWidth(this.getWidth());
        this._headerView.setHeight(20);
        this._viewPort.setX(0);
        this._viewPort.setY(20);
        this._viewPort.setWidth(this.getWidth());
        this._viewPort.setHeight(this.getHeight()-20);
    }else{
        this._headerView.setY(0);
        this._headerView.setHeight(20);
        this._viewPort.setX(0);
        this._viewPort.setY(20);
        this._viewPort.setWidth(this.getWidth());
        this._viewPort.setHeight(this.getHeight()-20);
    }
    this._titleIcon.setX(3);
    this._titleIcon.setY(3);
    this._titleIcon.setWidth(14);
    this._titleIcon.setHeight(14);
    this._titleLabel.setX(23);
    this._titleLabel.setY(3);
    this._titleLabel.setWidth(this.getWidth()-40);
    this._titleLabel.setHeight(14);
}
HY.GUI.Panel.prototype.getViewPort = function(){
	return this._viewPort;
}
HY.GUI.Panel.prototype.getHeaderView = function(){
    return this._headerView;
}
HY.GUI.Panel.prototype.getTitleLabel = function(){
    return this._titleLabel;
}
HY.GUI.Panel.prototype.getTitleIcon = function(){
    return this._titleIcon;
}
HY.GUI.Panel.prototype.getTitle = function(){
	return this._titleLabel.getText();
}
HY.GUI.Panel.prototype.setTitle = function(pTitle) {
    this._titleLabel.setText(pTitle);
}
HY.GUI.Panel.prototype.getIcon = function(){
	return this._titleIcon.getImage();
}
HY.GUI.Panel.prototype.setIcon = function(pImage){
	this._titleIcon.setImage(pImage);
}
HY.GUI.Panel.prototype.getHeaderConstraint = function(){
    return this._headerConstraint;
}
HY.GUI.Panel.prototype.setHeaderConstraint = function(pBool){
    this._headerConstraint = pBool;
}