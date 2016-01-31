/**
 * Created by Administrator on 2015/10/31.
 */
HY.GUI.ListCellView = function(config){
    this.init(config);
}
HY.GUI.ListCellView.prototype = new HY.GUI.View();
HY.GUI.ListCellView.prototype.defaultReuseIdentity = "default";
HY.GUI.ListCellView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.reuseIdentity != undefined){ this._reuseIdentity = config.reuseIdentity; } else { this._reuseIdentity = this.defaultReuseIdentity; }
    this._sectionIndex = -1;
    this._cellIndex = -1;
}
HY.GUI.ListCellView.prototype.getReuseIdentity = function(){
    return this._reuseIdentity;
}
HY.GUI.ListCellView.prototype.setReuseIdentity = function(reuseIdentity){
    this._reuseIdentity = reuseIdentity;
}
HY.GUI.ListCellView.prototype.getSectionIndex = function(){
    return this._sectionIndex;
}
HY.GUI.ListCellView.prototype.setSectionIndex = function(sectionIndex){
    this._sectionIndex = sectionIndex;
}
HY.GUI.ListCellView.prototype.getCellIndex = function(){
    return this._cellIndex;
}
HY.GUI.ListCellView.prototype.setCellIndex = function(cellIndex){
    this._cellIndex = cellIndex;
}