var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.ListCellView = hy.extend(hy.gui.View);
hy.gui.ListCellView.prototype.defaultReuseIdentity = "listcell";
hy.gui.ListCellView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._reuseIdentity = this.isUndefined(config.reuseIdentity) ? this.defaultReuseIdentity : config.reuseIdentity;
    this._cellIndex = -1;
}
hy.gui.ListCellView.prototype.setReuseIdentity = function(reuseIdentity){
    this._reuseIdentity = reuseIdentity;
}
hy.gui.ListCellView.prototype.getReuseIdentity = function(){
    return this._reuseIdentity;
}
hy.gui.ListCellView.prototype.setCellIndex = function(cellIndex){
    this._cellIndex = cellIndex;
}
hy.gui.ListCellView.prototype.getCellIndex = function(){
    return this._cellIndex;
}