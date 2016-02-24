var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.Panel = hy.extend(hy.gui.View);
hy.gui.Panel.prototype.defaultHeadViewFit = true;
hy.gui.Panel.prototype.init = function(config){
    this.superCall("init",[config]);
    this._mainView = this.isUndefined(config.mainView) ? new hy.gui.View({}) : config.mainView;
    this._headView = new hy.gui.View({normalColor:'#000'});
    this._titleIcon = new hy.gui.ImageView({});
    this._titleLabel = new hy.gui.Label({});

    this.addChildNodeAtLayer(this._mainView, 0);
    this.addChildNodeAtLayer(this._headView, 0);
    this._headView.addChildNodeAtLayer(this._titleLabel, 0);
    this._headView.addChildNodeAtLayer(this._titleIcon, 0);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutPanel);
}
hy.gui.Panel.prototype.getMainView = function(){
    return this._mainView;
}
hy.gui.Panel.prototype.getHeadView = function(){
    return this._headView;
}
hy.gui.Panel.prototype.getTitleLabel = function(){
    return this._titleLabel;
}
hy.gui.Panel.prototype.getTitleIcon = function(){
    return this._titleIcon;
}
hy.gui.Panel.prototype._layoutPanel = function(){
    this._headView.setX(0);
    this._headView.setY(0);
    this._headView.setWidth(this.getWidth());
    this._headView.setHeight(20);
    this._titleIcon.setX(3);
    this._titleIcon.setY(3);
    this._titleIcon.setWidth(14);
    this._titleIcon.setHeight(14);
    this._titleLabel.setX(20);
    this._titleLabel.setY(3);
    this._titleLabel.setWidth(this.getWidth()-30);
    this._titleLabel.setHeight(14);
    this._mainView.setX(0);
    this._mainView.setY(20);
    this._mainView.setWidth(this.getWidth());
    this._mainView.setHeight(this.getHeight()-20);
}