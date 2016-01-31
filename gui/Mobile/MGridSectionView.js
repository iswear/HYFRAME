/**
 * Created by Administrator on 2015/10/31.
 */
HY.GUI.MGridSectionView = function(config){
    this.init(config);
}
HY.GUI.MGridSectionView.prototype = new HY.GUI.View();
HY.GUI.MGridSectionView.prototype.defaultReuseIdentity = "default";
HY.GUI.MGridSectionView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.reuseIdentity != undefined){ this._reuseIdentity = config.reuseIdentity; } else { this._reuseIdentity = this.defaultReuseIdentity; }
    this._sectionIndex = -1;
}
HY.GUI.MGridSectionView.prototype.getReuseIdentity = function(){
    return this._reuseIdentity;
}
HY.GUI.MGridSectionView.prototype.setReuseIdentity = function(reuseIdentity){
    this._reuseIdentity = reuseIdentity;
}
HY.GUI.MGridSectionView.prototype.getSectionIndex = function(){
    return this._sectionIndex;
}
HY.GUI.MGridSectionView.prototype.setSectionIndex = function(sectionIndex){
    this._sectionIndex = sectionIndex;
}