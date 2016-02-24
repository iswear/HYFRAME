HY.Game.Model = function(config){
    this.init(config);
}
HY.Game.Model.prototype = new HY.Game.Unit();
HY.Game.Model.prototype.defaultName = "新装配件";
HY.Game.Model.prototype.defaultWidth = 100;
HY.Game.Model.prototype.defaultHeight = 100;
HY.Game.Model.prototype.defaultDragEnable = false;
HY.Game.Model.prototype.defaultResizeEnable = false;
HY.Game.Model.prototype.defaultMouseTrigger = false;
HY.Game.Model.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.actionNames != undefined){ this._actionNames = config.actionNames; } else { this._actionNames = []; }
}
HY.Game.Model.prototype.getActionNames = function(){
    return this._actionNames;
}
HY.Game.Model.prototype.setActionNames = function(pActionnames){
    this._actionNames = pActionnames;
}
HY.Game.Model.prototype.addActionName = function(pName){
    var len = this._actionNames.length;
    var i = 0;
    for(; i<len ; ++i){
        var curname = this._actionNames[i];
        if(curname.name == pName){
            break;
        }
    }
    if(i >= len){
        this._actionNames.push({name:pName});
        return true;
    }else{
        return false;
    }
}
HY.Game.Model.prototype.removeActionNameByName = function(pName){
    var i = this._actionNames.length-1;
    for(; i>=0 ; --i){
        if(this._actionNames[i] == pName){
            this._actionNames.splice(i,1);
        }
    }
}
HY.Game.Model.prototype.removeActionNameByIndex = function(pIndex){
    var len = this._actionNames.length;
    if(pIndex < len){
        this._actionNames.splice(pIndex,1);
    }
}