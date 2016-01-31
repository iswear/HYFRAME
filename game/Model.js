/**
 * Created by Administrator on 2016/1/9 0009.
 */
HY.Game.Model = function(config){
    this.init(config);
}
HY.Game.Model.prototype = new HY.Game.Unit();
HY.Game.Model.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.actionNames != undefined){ this._actionNames = config.actionNames; } else { this._actionNames = []; }
}
HY.Game.Model.prototype.getActionNames = function(){
    return this._actionNames;
}
HY.Game.Model.prototype.setActionNames = function(actionnames){
    this._actionNames = actionnames;
}