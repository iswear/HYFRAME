/********************************action manager***************************************/
HY.Core.Action = {};
HY.Core.Action.Status = {};
HY.Core.Action.Status.FINISH = 1;
HY.Core.Action.Status.UNFINISH = 0;

HY.Core.Action.Manager = function(config){
    this.init(config);
}
HY.Core.Action.Manager.prototype = new HY.Object();
HY.Core.Action.Manager.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._actionLinkList = [];
    this._paused = false;
}
HY.Core.Action.Manager.prototype.pause = function(){
    this._paused = true;
}
HY.Core.Action.Manager.prototype.resume = function(){
    this._paused = false;
}
HY.Core.Action.Manager.prototype.addActionLink = function(sprite,action){
    var newActionLink = new HY.Core.Action.Link({sprite:sprite,action:action});
    newActionLink.initRunParamsBeforeDelay();
    this._actionLinkList.push(newActionLink);
}
HY.Core.Action.Manager.prototype.resetAllActions = function(){
    var i = this._actionLinkList.length-1;
    for(;i>=0;--i){
        var curlink = this._actionLinkList[i];
        curlink.reset();
    }
}
HY.Core.Action.Manager.prototype.resetActionInSprite = function(sprite,action,childReset){
    var i,j;
    for(i=this._actionLinkList.length-1;i>=0;--i){
        var curLink = this._actionLinkList[i];
        if(curLink.getSprite() == sprite && curLink.getAction() == action){
            curLink.reset();
        }
    }
    if(childReset){
        var layers = sprite.getLayers();
        for(i = layers.length-1;i>=0;--i){
            var layer = layers[i];
            if(layer){
                for(j = layer.length-1;j>=0;--j){
                    this.resetActionInSprite(layer[j],action,childReset);
                }
            }
        }
    }
}
HY.Core.Action.Manager.prototype.resetAllActionInSprite = function(sprite,childReset){
    var i,j;
    for(i=this._actionLinkList.length-1;i>=0;--i){
        var curLink = this._actionLinkList[i];
        if(curLink.getSprite() == sprite){
            curLink.reset();
        }
    }
    if(childReset){
        var layers = sprite.getLayers();
        for(i = layers.length-1;i>=0;--i){
            var layer = layers[i];
            if(layer){
                for(j = layer.length-1;j>=0;--j){
                    this.resetAllActionInSprite(layer[j],childReset);
                }
            }
        }
    }
}
HY.Core.Action.Manager.prototype.removeAllAction = function(){
    for(var i=this._actionLinkList.length-1;i>=0;--i){
        var curactionlink = this._actionLinkList[i];
        curactionlink.setRemoveFlag(true);
    }
}
HY.Core.Action.Manager.prototype.removeActionInSprite = function(sprite,action,childRemoved){
    var i,j;
    for(i=this._actionLinkList.length-1;i>=0;--i){
        var curActionLink = this._actionLinkList[i];
        if(curActionLink._sprite == sprite && curActionLink._action == action){
            curActionLink.setRemoveFlag(true);
        }
    }
    if(childRemoved){
        var layers = sprite.getLayers();
        for(i = layers.length-1;i>=0;--i){
            var layer = layers[i];
            if(layer){
                for(j = layer.length-1;j>=0;--j){
                    this.removeActionInSprite(layer[j],action,ChildRemoved);
                }
            }
        }
    }
}
HY.Core.Action.Manager.prototype.removeAllActionInSprite = function(sprite,childRemoved){
    var i,j;
    for( i = this._actionLinkList.length-1;i>=0;--i){
        var curActionLink = this._actionLinkList[i];
        if(curActionLink._sprite == sprite){
            curActionLink.setRemoveFlag(true);
        }
    }
    if(childRemoved){
        var layers = sprite.getLayers();
        for(i = layers.length-1;i>=0;--i){
            var layer = layers[i];
            for(j = layer.length-1;j>=0;--j){
                this.removeAllActionInSprite(layer[j],childRemoved);
            }
        }
    }
}
HY.Core.Action.Manager.prototype.removeActionInSpriteInGroup = function(sprite,group,childRemoved){
    var i,j;
    for( i = this._actionLinkList.length-1;i>=0;--i){
        var curActionLink = this._actionLinkList[i];
        if(curActionLink._sprite == sprite && curActionLink._action.getGroup() == group){
            curActionLink.setRemoveFlag(true);
        }
    }
    if(childRemoved){
        var layers = sprite.getLayers();
        for(i = layers.length-1;i>=0;--i){
            var layer = layers[i];
            if(layer){
                for(j = layer.length-1;j>=0;--j){
                    this.removeActionInSpriteWithGroup(layer[j],group,childRemoved);
                }
            }
        }
    }
}
HY.Core.Action.Manager.prototype.removeActionInSpriteOutGroup = function(sprite,group,childRemoved){
    var i,j;
    for(i=this._actionLinkList.length-1;i>0;--i){
        var curActionLink = this._actionLinkList[i-1];
        if(curActionLink._sprite == sprite && curActionLink._action.getGroup() != group){
            curActionLink.setRemoveFlag(true);
        }
    }
    if(childRemoved){
        var layers = sprite.getLayers();
        for(i = layers.length-1;i>=0;--i){
            var layer = layers[i];
            for(j = layer.length-1;j>=0;--j){
                this.removeActionInSpriteWithoutGroup(layer[j],group,childRemoved);
            }
        }
    }
}
HY.Core.Action.Manager.prototype.runActions = function(deltaTime){
    if(!this._paused){
        var i=this._actionLinkList.length-1;
        for(;i>=0;--i){
            var curActionLink = this._actionLinkList[i];
            if(!curActionLink.getRemoveFlag()){
                var a = curActionLink.execute(deltaTime);
                if(a == HY.Core.Action.Status.FINISH){
                    this._actionLinkList.splice(i,1);
                    curActionLink.getAction().onEndAction(curActionLink);
                }
            }else{
                this._actionLinkList.splice(i,1);
            }
        }
    }
}

/*********************************action link*************************************/
HY.Core.Action.Link = function(config){
    this.init(config);
}
HY.Core.Action.Link.prototype = new HY.Object();
HY.Core.Action.Link.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._removeFlag = false;
    this._rtParams = {};
    if(config.action != undefined){ this._action = config.action; } else { this._action = null; }
    if(config.sprite != undefined){ this._sprite = config.sprite; } else { this._sprite = null; }
}
HY.Core.Action.Link.prototype.getAction = function(){
    return this._action;
}
HY.Core.Action.Link.prototype.getSprite = function(){
    return this._sprite;
}
HY.Core.Action.Link.prototype.getRtParams = function(){
    return this._rtParams;
}
HY.Core.Action.Link.prototype.getRemoveFlag = function(){
    return this._removeFlag;
}
HY.Core.Action.Link.prototype.setRemoveFlag = function(removeFlag){
    this._removeFlag = removeFlag;
}
HY.Core.Action.Link.prototype.initRunParamsBeforeDelay = function(){
    this._action.initRunParamsBeforeDelay(this);
}
HY.Core.Action.Link.prototype.initRunParamsAfterDelay = function(){
    this._action.initRunParamsAfterDelay(this);
}
HY.Core.Action.Link.prototype.reset = function(){
    this._action.initRunParamsBeforeDelay(this);
}
HY.Core.Action.Link.prototype.execute = function(deltaTime){
    if(this._sprite.checkActionLegal(this._action,this._rtParams,deltaTime)){
        var result = this._action.execute(this,deltaTime);
        return result;
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

/********************************base action*************************************/
/*配置项
 var config = {
 delay:10
 group:
 endSelector:
 endTarget:
 endParam:
 }
 */
HY.Core.Action.Base = function(config){
    this.init(config);
}
HY.Core.Action.Base.prototype = new HY.Object();
HY.Core.Action.Base.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.delay != undefined){ this._delay = config.delay; } else { this._delay = 0; }
    if(config.group != undefined){ this._group = config.group; } else { this._group = 0; }
    if(config.endTarget != undefined){ this._endTarget = config.endTarget; } else { this._endTarget = null; }
    if(config.endSelector != undefined){ this._endSelector = config.endSelector; } else { this._endSelector = null; }
    if(config.endParam != undefined){ this._endParam = config.endParam; } else { this._endParam = null; }
}
HY.Core.Action.Base.prototype.getGroup = function(){
    return this._group;
}
HY.Core.Action.Base.prototype.getDelay = function(){
    return this._delay;
}
HY.Core.Action.Base.prototype.getEndTarget = function(){
    return this._endTarget;
}
HY.Core.Action.Base.prototype.getEndSelector = function(){
    return this._endSelector;
}
HY.Core.Action.Base.prototype.getEndParam = function(){
    return this._endParam;
}
HY.Core.Action.Base.prototype.initRunParamsBeforeDelay = function(actionLink){
    var runParams = actionLink.getRtParams();
    runParams._delayFinish = false;
    runParams._accumlateTime = 0;
}
HY.Core.Action.Base.prototype.initRunParamsAfterDelay = function(actionLink){}
HY.Core.Action.Base.prototype.execute = function(actionLink,deltaTime){
    var runParams = actionLink.getRtParams();
    runParams._accumlateTime += deltaTime;
    if(!runParams._delayFinish){
        if(runParams._accumlateTime >= this._delay){
            runParams._delayFinish = true;
            this.initRunParamsAfterDelay(actionLink);
        }
        return HY.Core.Action.Status.UNFINISH;
    }else{
        return HY.Core.Action.Status.FINISH;
    }
}
HY.Core.Action.Base.prototype.onEndAction = function(actionLink){
    if(this._endSelector){
        if(this._endTarget != null){
            this._endSelector.call(this._endTarget,this._endParam);
        }else{
            this._endSelector.call(this,this._endParam);
        }
    }
}

//计划定时器Schedule
//配置项
// var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     repeat:1										//重复次数
//	 selector:null,									//函数
//	 target:null,									//this
//	 param:null,									//参数
// }

HY.Core.Action.Schedule = function(config){
    this.init(config);
}
HY.Core.Action.Schedule.prototype = new HY.Core.Action.Base();
HY.Core.Action.Schedule.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.selector != undefined ){ this._selector = config.selector; } else { this._selector = null; }
    if(config.target != undefined){ this._target = config.target; } else { this._target = null; }
    if(config.param != undefined){ this._param = config.param; } else { this._param = null; }
    if(config.repeat != undefined){ this._repeat = config.repeat; } else { this._repeat = 1; }
}
HY.Core.Action.Schedule.prototype.getSelector = function(){
    return this._selector;
}
HY.Core.Action.Schedule.prototype.getTarget = function(){
    return this._target;
}
HY.Core.Action.Schedule.prototype.getParam = function(){
    return this._param;
}
HY.Core.Action.Schedule.prototype.getRepeat = function(){
    return this._repeat;
}
HY.Core.Action.Schedule.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsBeforeDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    runParams._accumlateRepeats = 0;
}
HY.Core.Action.Schedule.prototype.execute =  function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    if(runParams._delayFinish){
        if(this._selector != null){
            if(this._target != null){
                this._selector.call(this._target,this._param);
            }else{
                this._selector.call(actionLink.getSprite(),this._param);
            }
        }
        runParams._delayFinish = false;
        runParams._accumlateTime = 0;
        if(this._repeat > 0){
            runParams._accumlateRepeats += 1;
            if(runParams._accumlateRepeats >= this._repeat){
                return HY.Core.Action.Status.FINISH;
            }else{
                return HY.Core.Action.Status.UNFINISH;
            }
        }else{
            return HY.Core.Action.Status.UNFINISH;
        }
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//沿着X轴方向移动
//配置项
// var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     speedX:
//     accelerateX:
// }
HY.Core.Action.MoveAlongX = function(config){
    this.init(config);
}
HY.Core.Action.MoveAlongX.prototype = new HY.Core.Action.Base();
HY.Core.Action.MoveAlongX.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedX != undefined){ this._speedX = config.speedX; } else { this._speedX = 0; }
    if(config.accelerateX != undefined){ this._accelerateX = config.accelerateX; } else { this._accelerateX = 0; }
}
HY.Core.Action.MoveAlongX.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    runParams._curSpeedX = this._speedX;
    runParams._curAccelerateX = this._accelerateX;
}
HY.Core.Action.MoveAlongX.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        runParams._curSpeedX += runParams._curAccelerateX * deltaTime;
        sprite.setX(sprite.getX()+runParams._curSpeedX * deltaTime);
        return HY.Core.Action.Status.UNFINISH;
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//沿着X轴方向移动到坐标targetX
//配置项
// var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     speedX:
//     accelerateX:
//     targetX;
// }
HY.Core.Action.MoveAlongXTo = function(config){
    this.init(config);
}
HY.Core.Action.MoveAlongXTo.prototype = new HY.Core.Action.Base();
HY.Core.Action.MoveAlongXTo.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedX != undefined){ this._speedX = config.speedX; } else { this._speedX = 0; }
    if(config.accelerateX != undefined){ this._accelerateX = config.accelerateX; } else { this._accelerateX = 0; }
    if(config.targetX != undefined){ this._targetX = config.targetX; } else { this._targetX = 0; }
}
HY.Core.Action.MoveAlongXTo.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    runParams._curSpeedX = this._speedX;
    runParams._curAccelerateX = this._accelerateX;
    runParams._curDistanceX = 0;
    runParams._distanceX = this._targetX-sprite.getX();
}
HY.Core.Action.MoveAlongXTo.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        var deltaX = runParams._curSpeedX * deltaTime;
        var deltaX2 = runParams._distanceX-runParams._curDistanceX;
        runParams._curSpeedX += runParams._curAccelerateX * deltaTime;
        if(Math.abs(deltaX) < Math.abs(deltaX2)){
            sprite.setX(sprite.getX()+deltaX);
            runParams._curDistanceX += deltaX;
            return HY.Core.Action.Status.FINISH;
        }else{
            sprite.setX(sprite.getX()+deltaX2);
            runParams._curDistanceX += deltaX2;
            return HY.Core.Action.Status.UNFINISH;
        }
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//沿着Y轴方向移动
//配置项
// var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     speedY:
//     accelerateY:
// }
HY.Core.Action.MoveAlongY = function(config){
    this.init(config);
}
HY.Core.Action.MoveAlongY.prototype = new HY.Core.Action.Base();
HY.Core.Action.MoveAlongY.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedY != undefined){ this._speedY = config.speedY; } else { this._speedY = 0; }
    if(config.accelerateY != undefined){ this._accelerateY = config.accelerateY; } else{ this._accelerateY = 0; }
}
HY.Core.Action.MoveAlongY.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    runParams._curSpeedY = this._speedY;
    runParams._curAccelerateY = this._accelerateY;
}
HY.Core.Action.MoveAlongY.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        runParams._curSpeedY += runParams._curAccelerateY * deltaTime;
        sprite.setY(sprite.getY()+runParams._curSpeedY * deltaTime);
        return HY.Core.Action.Status.UNFINISH;
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//沿着X轴方向移动到坐标targetX
//配置项
// var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     speedX:
//     accelerateX:
//     targetX;
// }
HY.Core.Action.MoveAlongYTo = function(config){
    this.init(config);
}
HY.Core.Action.MoveAlongXTo.prototype = new HY.Core.Action.Base();
HY.Core.Action.MoveAlongXTo.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedY != undefined){ this._speedY = config.speedY; } else { this._speedX = 0; }
    if(config.accelerateY != undefined){ this._accelerateY = config.accelerateY; } else { this._accelerateY = 0; }
    if(config.targetY != undefined){ this._targetY = config.targetY; } else { this._targetY = 0; }
}
HY.Core.Action.MoveAlongXTo.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    runParams._curSpeedY = this._speedY;
    runParams._curAccelerateY = this._accelerateY;
    runParams._curDistanceY = 0;
    runParams._distanceY = this._targetY-sprite.getY();
}
HY.Core.Action.MoveAlongXTo.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        var deltaY = runParams._curSpeedY * deltaTime;
        var deltaY2 = runParams._distanceY-runParams._curDistanceY;
        runParams._curSpeedY += runParams._curAccelerateY * deltaTime;
        if(Math.abs(deltaY) < Math.abs(deltaY2)){
            sprite.setY(sprite.getY()+deltaY);
            runParams._curDistanceY += deltaY;
            return HY.Core.Action.Status.FINISH;
        }else{
            sprite.setY(sprite.getY()+deltaY2);
            runParams._curDistanceY += deltaY2;
            return HY.Core.Action.Status.UNFINISH;
        }
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//沿着Z轴方向转动
//配置项
// var config = {
//    delay:10
//    group:
//    endSelector:
//    endTarget:
//    endParam:
//
//    speedAngle:
//    accelerateAngle
// }
HY.Core.Action.Rotate = function(config){
    this.init(config);
}
HY.Core.Action.Rotate.prototype = new HY.Core.Action.Base();
HY.Core.Action.Rotate.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedAngle != undefined){ this._speedAngle = config.speedAngle; } else { this._speedAngle = 0; }
    if(config.accelerateAngle != undefined){ this._accelerateAngle = config.accelerateAngle; } else { this._accelerateAngle = 0; }
}
HY.Core.Action.Rotate.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    runParams._curSpeedAngle = this._speedAngle;
    runParams._curAccelerateAngle = this._accelerateAngle;
}
HY.Core.Action.Rotate.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        var deltaAngle = runParams._curSpeedAngle * deltaTime;
        runParams._curSpeedAngle += runParams._curAccelerateAngle * deltaTime;
        sprite.rotateZ(deltaAngle);
        return HY.Core.Action.Status.UNFINISH;
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//沿着Z轴方向转动到targetAngle
//配置项
//var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     speedAngle:
//     accelerateAngle:
//     distanceAngle
//}
HY.Core.Action.RotateTo = function(config){
    this.init(config);
}
HY.Core.Action.RotateTo.prototype = new HY.Core.Action.Base();
HY.Core.Action.RotateTo.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedAngle != undefined){ this._speedAngle = config.speedAngle; } else { this._speedAngle = 0; }
    if(config.accelerateAngle != undefined){ this._accelerateAngle = config.accelerateAngle; } else { this._accelerateAngle = 0; }
    if(config.targetAngle != undefined){ this._targetAngle = config.targetAngle; } else { this._targetAngle = 0; }
}
HY.Core.Action.RotateTo.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    runParams._curSpeedAngle = this._speedAngle;
    runParams._curAccelerateAngle = this._accelerateAngle;
    runParams._curDistanceAngle = 0;
    runParams._distanceAngle = this._targetAngle - sprite.getRotateZ();
}
HY.Core.Action.RotateTo.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        var deltaAngle = runParams._curSpeedAngle * deltaTime;
        var deltaAngle2 = runParams._distanceAngle - runParams._curDistanceAngle;
        runParams._curSpeedAngle += runParams._curAccelerateAngle * deltaTime;
        if(Math.abs(deltaAngle) <  Math.abs(deltaAngle2)){
            runParams._curDistanceAngle += deltaAngle;
            sprite.rotateZ(deltaAngle);
            return HY.Core.Action.Status.UNFINISH;
        }else{
            runParams._curDistanceAngle += deltaAngle2;
            sprite.rotateZ(deltaAngle2);
            return HY.Core.Action.Status.UNFINISH;
        }
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//沿着X轴方向缩放
//配置项
//var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     speedScaleX:
//     accelerateScaleX:
//}
HY.Core.Action.ScaleAlongX = function(config){
    this.init(config);
}
HY.Core.Action.ScaleAlongX.prototype = new HY.Core.Action.Base();
HY.Core.Action.ScaleAlongX.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedScaleX != undefined){ this._speedScaleX = config.speedScaleX; } else { this._speedScaleX = 0; }
    if(config.accelerateScaleX != undefined){ this._accelerateScaleX = config.accelerateScaleX; } else { this._accelerateScaleX = 0; }
}
HY.Core.Action.ScaleAlongX.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    runParams._curSpeedScaleX = this._speedScaleX;
    runParams._curAccelerateScaleX = this._accelerateScaleX;
}
HY.Core.Action.ScaleAlongX.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        runParams._curSpeedScaleX += runParams._curAccelerateScaleX * deltaTime;
        sprite.setScaleX(sprite.getScaleX()+runParams._curSpeedScaleX * deltaTime);
        return HY.Core.Action.Status.UNFINISH;
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//沿着X轴方向缩放到TARGETSCALE
//配置项
//var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     speedScaleX:
//     accelerateScaleX:
//     targetScaleX
//}
HY.Core.Action.ScaleAlongXTo = function(config){
    this.init(config);
}
HY.Core.Action.ScaleAlongXTo.prototype = new HY.Core.Action.Base();
HY.Core.Action.ScaleAlongXTo.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedScaleX != undefined){ this._speedScaleX = config.speedScaleX; } else { this._speedScaleX = 0; }
    if(config.accelerateScaleX != undefined){ this._accelerateScaleX = config.accelerateScaleX; } else { this._accelerateScaleX = 0; }
    if(config.targetScaleX != undefined){ this._targetScaleX = config.targetScaleX; } else { this._targetScaleX = 0; }
}
HY.Core.Action.ScaleAlongXTo.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    runParams._curSpeedScaleX = this._speedScaleX;
    runParams._curAccelerateScaleX = this._accelerateScaleX;
    runParams._curDistanceScaleX = 0;
    runParams._distanceScaleX = this._targetScaleX - sprite.getScaleX();
}
HY.Core.Action.ScaleAlongXTo.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        var deltaScaleX = runParams._curSpeedScaleX * deltaTime;
        var deltaScaleX2 = runParams._distanceScaleX - this._curDistanceScaleX;
        runParams._curSpeedScaleX += runParams._curAccelerateScaleX * deltaTime;
        if(Math.abs(deltaScaleX) < Math.abs(deltaScaleX2)){
            runParams._curDistanceScaleX += deltaScaleX;
            sprite.setScaleX(sprite.getScaleX()+deltaScaleX);
            return HY.Core.Action.Status.UNFINISH;
        }else{
            runParams._curDistanceScaleX += deltaScaleX2;
            sprite.setScaleX(sprite.getScaleX()+deltaScaleX2);
            return HY.Core.Action.Status.FINISH;
        }
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//沿着Y轴方向缩放
//配置项
//var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     speedScaleY:
//     accelerateScaleY:
//}
HY.Core.Action.ScaleAlongY = function(config){
    this.init(config);
}
HY.Core.Action.ScaleAlongY.prototype = new HY.Core.Action.Base();
HY.Core.Action.ScaleAlongY.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedScaleY){ this._speedScaleY = config.speedScaleY; } else { this._speedScaleY = 0; }
    if(config.accelerateScaleY){ this._accelerateScaleY = config.accelerateScaleY; } else { this._accelerateScaleY = 0; }
}
HY.Core.Action.ScaleAlongY.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    runParams._curSpeedScaleY = this._speedScaleY;
    runParams._curAccelerateScaleY = this._accelerateScaleY;
}
HY.Core.Action.ScaleAlongY.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        runParams._curSpeedScaleY += runParams._curAccelerateScaleY * deltaTime;
        sprite.setScaleY(sprite.getScaleY()+runParams._curSpeedScaleY * deltaTime);
        return HY.Core.Action.Status.UNFINISH;
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//沿着Y轴方向缩放到TARGETSCALE
//配置项
//var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     speedScaleY:
//     accelerateScaleY:
//     targetScaleY
//}
HY.Core.Action.ScaleAlongYTo = function(config){
    this.init(config);
}
HY.Core.Action.ScaleAlongYTo.prototype = new HY.Core.Action.Base();
HY.Core.Action.ScaleAlongYTo.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedScaleY){ this._speedScaleY = config.speedScaleY; } else { this._speedScaleY = 0; }
    if(config.accelerateScaleY){ this._accelerateScaleY = config.accelerateScaleY; } else { this._accelerateScaleY = 0; }
    if(config.targetScaleY){ this._targetScaleY = config.targetScaleY; } else { this._targetScaleY = 0; }
}
HY.Core.Action.ScaleAlongYTo.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    runParams._curSpeedScaleY = this._speedScaleY;
    runParams._curAccelerateScaleY = this._accelerateScaleY;
    runParams._curDistanceScaleY = 0;
    runParams._distanceScaleY = this._targetScaleY - sprite.getScaleY();
}
HY.Core.Action.ScaleAlongYTo.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        var deltaScaleY = runParams._curSpeedScaleY * deltaTime;
        var deltaScaleY2 = runParams._distanceScaleY - this._curDistanceScaleY;
        runParams._curSpeedScaleY += runParams._curAccelerateScaleY * deltaTime;
        if(Math.abs(deltaScaleY) < Math.abs(deltaScaleY2)){
            runParams._curDistanceScaleY += deltaScaleY;
            sprite.setScaleY(sprite.getScaleY()+deltaScaleY);
            return HY.Core.Action.Status.UNFINISH;
        }else{
            runParams._curDistanceScaleY += deltaScaleY2;
            sprite.setScaleY(sprite.getScaleY()+deltaScaleY2);
            return HY.Core.Action.Status.FINISH;
        }
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//淡入淡出
//配置项
// var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     speedFade:
//     accelerateFade:
// }
HY.Core.Action.Fade = function(config){
    this.init(config);
}
HY.Core.Action.Fade.prototype = new HY.Core.Action.Base();
HY.Core.Action.Fade.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedFade != undefined){ this._speedFade = config.speedFade; } else { this._speedFade = 0; }
    if(config.accelerateFade != undefined){ this._accelerateFade = config.accelerateFade; } else { this._accelerateFade = 0; }
}
HY.Core.Action.Fade.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    runParams._curSpeedFade = this._speedFade;
    runParams._curAccelerateFade = this._accelerateFade;
}
HY.Core.Action.Fade.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        runParams._curSpeedFade += runParams._curAccelerateFade * deltaTime;
        var alpha = this.getAlpha()+runParams._curSpeedFade * deltaTime;
        sprite.setAlpha(alpha);
        if(alpha < 0 || alpha > 1){
            return HY.Core.Action.Status.FINISH;
        }else{
            return HY.Core.Action.Status.UNFINISH;
        }
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}

//沿着X轴方向移动到坐标targetAlpha
//配置项
// var config = {
//     delay:10
//     group:
//     endSelector:
//     endTarget:
//     endParam:
//
//     speedFade:
//     accelerateFade:
//     targetAlpha;
// }
HY.Core.Action.FadeTo = function(config){
    this.init(config);
}
HY.Core.Action.MoveAlongXTo.prototype = new HY.Core.Action.Base();
HY.Core.Action.MoveAlongXTo.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.speedFade != undefined){ this._speedFade = config.speedFade; } else { this._speedFade = 0; }
    if(config.accelerateFade != undefined){ this._accelerateFade = config.accelerateFade; } else { this._accelerateFade = 0; }
    if(config.targetAlpha != undefined){ this._targetAlpha = config.targetAlpha; } else { this._targetAlpha = 0; }
}
HY.Core.Action.MoveAlongXTo.prototype.initRunParamsAfterDelay = function(actionLink){
    this.superCall("initRunParamsAfterDelay",[actionLink]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    runParams._curSpeedFade = this._speedFade;
    runParams._curAccelerateFade = this._accelerateFade;
    runParams._curDistanceAlpha = 0;
    runParams._distanceAlpha = this._targetAlpha-sprite.getAlpha();
}
HY.Core.Action.MoveAlongXTo.prototype.execute = function(actionLink,deltaTime){
    this.superCall("execute",[actionLink,deltaTime]);
    var runParams = actionLink.getRtParams();
    var sprite = actionLink.getSprite();
    if(runParams._delayFinish){
        var deltaAlpha = runParams._curSpeedFade * deltaTime;
        var deltaAplha2 = runParams._distanceAlpha-runParams._curDistanceAlpha;
        runParams._curSpeedFade += runParams._curAccelerateFade * deltaTime;
        if(Math.abs(deltaAlpha) < Math.abs(deltaAplha2)){
            sprite.setAlpha(sprite.getAlpha()+deltaAlpha);
            runParams._curDistanceAlpha += deltaAlpha;
            return HY.Core.Action.Status.FINISH;
        }else{
            sprite.setAlpha(sprite.getAlpha()+deltaAplha2);
            runParams._curDistanceAlpha += deltaAplha2;
            return HY.Core.Action.Status.UNFINISH;
        }
    }else{
        return HY.Core.Action.Status.UNFINISH;
    }
}
