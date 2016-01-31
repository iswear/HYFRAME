/**
 * Created by Administrator on 2015/10/31.
 */
HY.GUI.MGridCellView = function(config){
    this.init(config);
}
HY.GUI.MGridCellView.prototype = new HY.GUI.View();
HY.GUI.MGridCellView.prototype.defaultReuseIdentity = "default";
HY.GUI.MGridCellView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.reuseIdentity != undefined){ this._reuseIdentity = config.reuseIdentity; } else { this._reuseIdentity = this.defaultReuseIdentity; }
    this._sectionIndex = -1;
    this._cellIndex = -1;
}
HY.GUI.MGridCellView.prototype.getReuseIdentity = function(){
    return this._reuseIdentity;
}
HY.GUI.MGridCellView.prototype.setReuseIdentity = function(reuseIdentity){
    this._reuseIdentity = reuseIdentity;
}
HY.GUI.MGridCellView.prototype.getSectionIndex = function(){
    return this._sectionIndex;
}
HY.GUI.MGridCellView.prototype.setSectionIndex = function(sectionIndex){
    this._sectionIndex = sectionIndex;
}
HY.GUI.MGridCellView.prototype.getCellIndex = function(){
    return this._cellIndex;
}
HY.GUI.MGridCellView.prototype.setCellIndex = function(cellIndex){
    this._cellIndex = cellIndex;
}