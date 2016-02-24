/**
 * Created by Administrator on 2015/10/31.
 */
HY.GUI.MListCellView = function(config){
    this.init(config);
}
HY.GUI.MListCellView.prototype = new HY.GUI.View();
HY.GUI.MListCellView.prototype.defaultReuseIdentity = "default";
HY.GUI.MListCellView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.reuseIdentity != undefined){ this._reuseIdentity = config.reuseIdentity; } else { this._reuseIdentity = this.defaultReuseIdentity; }
    this._sectionIndex = -1;
    this._cellIndex = -1;
}
HY.GUI.MListCellView.prototype.getReuseIdentity = function(){
    return this._reuseIdentity;
}
HY.GUI.MListCellView.prototype.setReuseIdentity = function(reuseIdentity){
    this._reuseIdentity = reuseIdentity;
}
HY.GUI.MListCellView.prototype.getSectionIndex = function(){
    return this._sectionIndex;
}
HY.GUI.MListCellView.prototype.setSectionIndex = function(sectionIndex){
    this._sectionIndex = sectionIndex;
}
HY.GUI.MListCellView.prototype.getCellIndex = function(){
    return this._cellIndex;
}
HY.GUI.MListCellView.prototype.setCellIndex = function(cellIndex){
    this._cellIndex = cellIndex;
}