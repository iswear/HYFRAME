/**
 * Created by Administrator on 2015/10/31.
 */
HY.GUI.ListSectionView = function(config){
    this.init(config);
}
HY.GUI.ListSectionView.prototype = new HY.GUI.View();
HY.GUI.ListSectionView.prototype.defaultReuseIdentity = "default";
HY.GUI.ListSectionView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.reuseIdentity != undefined){ this._reuseIdentity = config.reuseIdentity; } else { this._reuseIdentity = this.defaultReuseIdentity; }
    this._sectionIndex = -1;
}
HY.GUI.ListSectionView.prototype.getReuseIdentity = function(){
    return this._reuseIdentity;
}
HY.GUI.ListSectionView.prototype.setReuseIdentity = function(reuseIdentity){
    this._reuseIdentity = reuseIdentity;
}
HY.GUI.ListSectionView.prototype.getSectionIndex = function(){
    return this._sectionIndex;
}
HY.GUI.ListSectionView.prototype.setSectionIndex = function(sectionIndex){
    this._sectionIndex = sectionIndex;
}