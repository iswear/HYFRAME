var hy = hy || {};
hy.game = hy.game || {};
hy.game.Model = hy.extend(hy.gui.Unit);
hy.game.Model.prototype.init = function(config){
    this.superCall("init",[config]);
    this._actionNames = this.isUndefined() ? [] : config.actionNames;
}
hy.game.Model.prototype.getActionNames = function(){
    return this._actionNames;
}
hy.game.Model.prototype.setActionNames = function(actionnames){
    this._actionNames = actionnames;
}
