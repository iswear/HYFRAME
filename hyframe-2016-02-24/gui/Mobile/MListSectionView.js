/**
 * Created by Administrator on 2015/10/31.
 */
HY.GUI.MListSectionView = function(config){
    this.init(config);
}
HY.GUI.MListSectionView.prototype = new HY.GUI.View();
HY.GUI.MListSectionView.prototype.defaultReuseIdentity = "default";
HY.GUI.MListSectionView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.reuseIdentity != undefined){ this._reuseIdentity = config.reuseIdentity; } else { this._reuseIdentity = this.defaultReuseIdentity; }
    this._sectionIndex = -1;
}
HY.GUI.MListSectionView.prototype.getReuseIdentity = function(){
    return this._reuseIdentity;
}
HY.GUI.MListSectionView.prototype.setReuseIdentity = function(reuseIdentity){
    this._reuseIdentity = reuseIdentity;
}
HY.GUI.MListSectionView.prototype.getSectionIndex = function(){
    return this._sectionIndex;
}
HY.GUI.MListSectionView.prototype.setSectionIndex = function(sectionIndex){
    this._sectionIndex = sectionIndex;
}