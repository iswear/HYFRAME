/**
 * Created by Administrator on 2015/10/31.
 */
HY.GUI.TreeNodeView = function(config){
    this.init(config);
}
HY.GUI.TreeNodeView.prototype = new HY.GUI.View();
HY.GUI.TreeNodeView.prototype.defaultReuseIdentity = "default";
HY.GUI.TreeNodeView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.reuseIdentity != undefined){ this._reuseIdentity = config.reuseIdentity; } else { this._reuseIdentity = this.defaultReuseIdentity; }
    this._nodePath = null;
}
HY.GUI.TreeNodeView.prototype.getReuseIdentity = function(){
    return this._reuseIdentity;
}
HY.GUI.TreeNodeView.prototype.setReuseIdentity = function(reuseIdentity){
    this._reuseIdentity = reuseIdentity;
}
HY.GUI.TreeNodeView.prototype.getNodePath = function(){
    return this._nodePath;
}
HY.GUI.TreeNodeView.prototype.setNodePath = function(nodePath){
    this._nodePath = nodePath;
}