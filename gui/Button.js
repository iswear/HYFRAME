/**
 * Created by songtao on 14-10-23.
 */
HY.GUI.Button = function(config){
    this.init(config);
}
HY.GUI.Button.prototype = new HY.GUI.View();
HY.GUI.Button.prototype.defaultWidth = 60;
HY.GUI.Button.prototype.defaultHeight = 30;
HY.GUI.Button.prototype.defaultTitle = "Button";
HY.GUI.Button.prototype.defaultNormalColor = null;
HY.GUI.Button.prototype.defaultHoverColor = "#00ff00";
HY.GUI.Button.prototype.defaultActiveColor = "#0000ff";
HY.GUI.Button.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._titleLabel = new HY.GUI.Label({});
    if(config.title != undefined){ this._titleLabel.setText(config.title); } else { this._titleLabel.setText(this.defaultTitle); }

}
HY.GUI.Button.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addChildNodeAtLayer(this._titleLabel,0);
}
HY.GUI.Button.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    this._titleLabel.setX(0);
    this._titleLabel.setY(0);
    this._titleLabel.setWidth(this.getWidth());
    this._titleLabel.setHeight(this.getHeight());
}
HY.GUI.Button.prototype.getMinLayoutWidth = function(){
	return this._titleLabel.getMinLayoutWidth();
}
HY.GUI.Button.prototype.getMinLayoutHeight = function(){
	return this._titleLabel.getMinLayoutHeight();
}
HY.GUI.Button.prototype.getTitleLabel = function(){
    return this._titleLabel;
}