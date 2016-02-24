/**
 * Created by Administrator on 2015/10/31.
 */
HY.GUI.MenuListCellView = function(config){
    this.init(config);
}
HY.GUI.MenuListCellView.prototype = new HY.GUI.View();
HY.GUI.MenuListCellView.prototype.defaultReuseIdentity = "default";
HY.GUI.MenuListCellView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.reuseIdentity != undefined){ this._reuseIdentity = config.reuseIdentity; } else { this._reuseIdentity = this.defaultReuseIdentity; }
    this._sectionIndex = -1;
    this._cellIndex = -1;
}
HY.GUI.MenuListCellView.prototype.getReuseIdentity = function(){
    return this._reuseIdentity;
}
HY.GUI.MenuListCellView.prototype.setReuseIdentity = function(reuseIdentity){
    this._reuseIdentity = reuseIdentity;
}
HY.GUI.MenuListCellView.prototype.getSectionIndex = function(){
    return this._sectionIndex;
}
HY.GUI.MenuListCellView.prototype.setSectionIndex = function(sectionIndex){
    this._sectionIndex = sectionIndex;
}
HY.GUI.MenuListCellView.prototype.getCellIndex = function(){
    return this._cellIndex;
}
HY.GUI.MenuListCellView.prototype.setCellIndex = function(cellIndex){
    this._cellIndex = cellIndex;
}