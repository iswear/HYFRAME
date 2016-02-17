var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.SimpleListCellView = hy.extend(hy.gui.ListCellView);
hy.gui.SimpleListCellView.prototype.defaultCellEditEnable = false;
hy.gui.SimpleListCellView.prototype.defaultReuseIdentity = "simplelistcell";
hy.gui.SimpleListCellView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._cellEditEnable = this.isUndefined(config.cellEditEnable) ? this.defaultCellEditEnable : config.cellEditEnable;
    this._cellEditDelay = this.isUndefined(config.cellEditDelay) ? 200 : config.cellEditDelay;
    this._cellEditBox = new hy.gui.TextBox({editEnable:false, mouseEnable:false, lineNum:1 });
    this.__initEditStartTime = 0;
    this.__initEditValid = true;
    this.addChildNodeAtLayer(this._cellEditBox, 0);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutSimpleListCellView);
    this.addObserver(this.notifyMouseDown, this, this._cellEditBoxReady);
    this.addObserver(this.notifyMouseMove,this,this._cellEditBoxInvalid);
    this.addObserver(this.notifyMouseUp,this,this._cellEditBoxEnter);
}
hy.gui.SimpleListCellView.prototype.setCellText = function(text){
    this._cellEditBox.setText(text);
}
hy.gui.SimpleListCellView.prototype.getCellText = function(){
    return this._cellEditBox.getText();
}
hy.gui.SimpleListCellView.prototype.setCellEditEnable = function(editEnable){
    this._cellEditEnable = editEnable;
}
hy.gui.SimpleListCellView.prototype.getCellEditEnable = function(){
    return this._cellEditEnable;
}
hy.gui.SimpleListCellView.prototype.setCellEditDelay = function(editDelay){
    this._cellEditDelay = editDelay;
}
hy.gui.SimpleListCellView.prototype.getCellEditDelay = function(){
    return this._cellEditDelay;
}
hy.gui.SimpleListCellView.prototype.getCellTextMeasuredLength = function(){
    return this._cellEditBox.getTextMeasuredLength();
}
hy.gui.SimpleListCellView.prototype._layoutSimpleListCellView = function(sender){
    this._cellEditBox.setX(0);
    this._cellEditBox.setY(0);
    this._cellEditBox.setWidth(this.getWidth());
    this._cellEditBox.setHeight(this.getHeight());
}
hy.gui.SimpleListCellView.prototype._cellEditBoxReady = function(sender, e){
    this.__initEditStartTime = (new Date()).getTime();
    this.__initEditValid = true;
}
hy.gui.SimpleListCellView.prototype._cellEditBoxInvalid = function(sender, e){
    this.__initEditValid = false;
}
hy.gui.SimpleListCellView.prototype._cellEditBoxEnter = function(sender, e){
    if(this._cellEditEnable){
        if(this.__initEditValid && (new Date()).getTime() - this.__initEditStartTime > this._cellEditDelay){
            this._cellEditBox.focus(e);
        }
    }
}
