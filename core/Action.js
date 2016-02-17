/********************************action manager***************************************/
HY.Core.Action = {};
HY.Core.Action.Status = {};
HY.Core.Action.Status.FINISH = 1;
HY.Core.Action.Status.UNFINISH = 0;

HY.Core.Action.Manager = function(config){
    this.init(config);
}
HY.Core.Action.Manager.prototype = new HY.Object();
HY.Core.Action.Manager.prototype.init = function(config){
    this._actionLinkList = [];
    this._paused = false;
    this.superCall("init",[config]);
}
HY.Core.Action.Manager.prototype.pause = function(){
    this._paused = true;
}
HY.Core.Action.Manager.prototype.resume = function(){
    this._paused = false;
}
HY.Core.Action.Manager.prototype.addActionLink = function(sprite,action,loop,target,callBack){
    var actionLink = new HY.Core.Action.Link({sprite:sprite,action:action,loop:loop,target:target,callBack:callBack});
    this._actionLinkList.push(actionLink);
}
HY.Core.Action.Manager.prototype.removeAllActions =  function(){
    for(var i=this._actionLinkList.length-1;i>=0;--i){
        var actionlink = this._actionLinkList[i];
        actionlink.setRemoveFlag(true);
    }
}
HY.Core.Action.Manager.prototype.removeActionOfSprite = function(sprite,action){
    for(var i=this._actionLinkList.length-1; i >= 0; --i){
        var actionLink = this._actionLinkList[i];
        if(actionLink.getSprite() == sprite && actionLink.getAction() == action){
            actionLink.setRemoveFlag(true);
        }
    }
}
HY.Core.Action.Manager.prototype.removeAllActionsOfSprite = function(sprite){
    for(var i=this._actionLinkList.length-1; i>=0 ;--i){
        var actionLink = this._actionLinkList[i];
        if(actionLink.getSprite() == sprite){
            actionLink.setRemoveFlag(true);
        }
    }
}
HY.Core.Action.Manager.prototype.runActions = function(deltaTime){
    if(!this._paused){
        for(var i=this._actionLinkList.length-1;i>=0;--i){
            var actionLink = this._actionLinkList[i];
            if(!actionLink.getRemoveFlag()){
                var result = actionLink.execute(deltaTime);
                actionLink.setRemoveFlag(result == HY.Core.Action.Status.FINISH && !actionLink.getLoop());
            }else{
                this._actionLinkList.splice(i,1);
            }
        }
    }
}

HY.Core.Action.Link = function(config){
    this.init(config);
}
HY.Core.Action.Link.prototype = new HY.Object();
HY.Core.Action.Link.prototype.init = function(config){
    this._removeFlag = false;
    this._runParams = {};
    this.superCall("init",[config]);
    if(config.action != undefined){ this.setAction(config.action); } else { this.setAction(null); }
    if(config.sprite != undefined){ this.setSprite(config.sprite); } else { this.setSprite(null); }
    if(config.loop != undefined){ this.setLoop(config.loop); } else { this.setLoop(false); }
    if(config.target != undefined){ this.setTarget(config.target); } else { this.setTarget(null); }
    if(config.callBack != undefined){ this.setCallBack(config.callBack); } else { this.setCallBack(null); }
}
HY.Core.Action.Link.prototype.getAction = function(){
    return this._action;
}
HY.Core.Action.Link.prototype.setAction = function(action){
    this._action = action;
}
HY.Core.Action.Link.prototype.getSprite = function(){
    return this._sprite;
}
HY.Core.Action.Link.prototype.setSprite = function(sprite){
    this._sprite = sprite;
}
HY.Core.Action.Link.prototype.getLoop = function(){
    return this._loop;
}
HY.Core.Action.Link.prototype.setLoop = function(loop){
    this._loop = loop;
}
HY.Core.Action.Link.prototype.getTarget = function(){
    return this._target;
}
HY.Core.Action.Link.prototype.setTarget = function(target){
    this._target = target;
}
HY.Core.Action.Link.prototype.getCallBack = function(){
    return this._callBack;
}
HY.Core.Action.Link.prototype.setCallBack = function(callBack){
    this._callBack = callBack;
}
HY.Core.Action.Link.prototype.getRunParams = function(key){
    return this._runParams[key];
}
HY.Core.Action.Link.prototype.setRunParams = function(key,value){
    this._runParams[key] = value;
}
HY.Core.Action.Link.prototype.delRunParams = function(key){
    delete this._runParams[key];
}
HY.Core.Action.Link.prototype.getRemoveFlag = function(){
    return this._removeFlag;
}
HY.Core.Action.Link.prototype.setRemoveFlag = function(removeFlag){
    this._removeFlag = removeFlag;
}
HY.Core.Action.Link.prototype.execute = function(deltaTime){
    var result = this._action.execute(this,deltaTime);
    if(this._callBack != null){
        this._callBack.apply(this._target,[this._action,result]);
    }
    return result;
}

HY.Core.Action.Scheduler = function(config){
    this.init(config);
}
HY.Core.Action.Scheduler.prototype = new HY.Object();
HY.Core.Action.Scheduler.prototype.init = function(config){
    this.superCall("init",[config]);
    if(config.interval != undefined){ this.setInterval(config.interval); } else { this.setInterval(0); }
    if(config.repeats != undefined){ this.setRepeats(config.repeats); } else { this.setRepeats(0); }
    if(config.target != undefined){ this.setTarget(config.target); } else { this.setTarget(null); }
    if(config.callBack != undefined){ this.setCallBack(config.callBack); } else { this.setCallBack(null); }
    if(config.param != undefined){ this.setParam(config.param); } else { this.setParam(null); }
}
HY.Core.Action.Scheduler.prototype.getInterval = function(){
    return this._interval;
}
HY.Core.Action.Scheduler.prototype.setInterval = function(interval){
    this._interval = interval;
}
HY.Core.Action.Scheduler.prototype.getRepeats = function(){
    return this._repeats;
}
HY.Core.Action.Scheduler.prototype.setRepeats = function(repeats){
    this._repeats = repeats;
}
HY.Core.Action.Scheduler.prototype.getTarget = function(){
    return this._target;
}
HY.Core.Action.Scheduler.prototype.setTarget = function(target){
    this._target = target;
}
HY.Core.Action.Scheduler.prototype.getCallBack = function(){
    return this._callBack;
}
HY.Core.Action.Scheduler.prototype.setCallBack = function(callBack){
    this._callBack = callBack;
}
HY.Core.Action.Scheduler.prototype.getParam = function(){
    return this._param;
}
HY.Core.Action.Scheduler.prototype.setParam = function(param){
    this._param = param;
}
HY.Core.Action.Scheduler.prototype.execute = function(actionLink,deltaTime){
    if(this._repeats == 0){
        return HY.Core.Action.Status.FINISH;
    }else{
        var inited = actionLink.getRunParams("inited");
        var repeats, sumTime;
        if(inited){
            repeats = actionLink.getRunParams("repeats");
            sumTime = actionLink.getRunParams("sumtime");
        }else{
            repeats = 0;
            sumTime = 0;
            actionLink.setRunParams("repeats",0);
            actionLink.setRunParams("sumtime",0);
        }
        sumTime += deltaTime;
        if(sumTime >= this._interval){
            this._callBack.apply(this._target,[this._param]);
            sumTime -= this._interval;
            repeats += 1;
        }
        if(repeats >= this._repeats){
            actionLink.setRunParams("inited",false);
            return HY.Core.Action.Status.FINISH;
        }else{
            actionLink.setRunParams("repeats",repeats);
            actionLink.setRunParams("sumtime",sumTime);
            return HY.Core.Action.Status.UNFINISH;
        }
    }
}

HY.Core.Action.Base = function(config){
    this.init(config);
}
HY.Core.Action.Base.prototype = new HY.Object();
HY.Core.Action.Base.prototype.execute = function(){}

HY.Core.Action.Animation = function(config){
    this.init(config);
}
HY.Core.Action.Animation.prototype = new HY.Core.Action.Base();
HY.Core.Action.Animation.prototype.init = function(config){
    this.superCall("init",[config]);
    if(config.targetOffset != undefined){ this.setTargetOffset(config.targetOffset); } else { this.setTarget(undefined); }
    if(config.offsetFun != undefined){ this.setOffsetFun(config.offsetFun); } else { this.setOffsetFun("0"); }
}
HY.Core.Action.Animation.prototype.getTargetOffset = function(){
    return this._targetOffset;
}
HY.Core.Action.Animation.prototype.setTargetOffset = function(targetOffset){
    this._targetOffset = targetOffset;
}
HY.Core.Action.Animation.prototype.getOffsetFun = function(){
    return this._offsetFun;
}
HY.Core.Action.Animation.prototype.setOffsetFun = function(offsetFun){
    this._offsetFun = eval("(function(t){ return "+offsetFun+"; })");
}
HY.Core.Action.Animation.prototype.execute = function(){}

HY.Core.Action.MoveX = function(config){
    this.init(config);
}
HY.Core.Action.MoveX.prototype = new HY.Core.Action.Animation();
HY.Core.Action.MoveX.prototype.execute = function(actionLink, deltaTime){
    var sprite = actionLink.getSprite();
    var offsetX,sumTime;
    var initFlag = actionLink.getRunParams("inited");
    if(initFlag){
        offsetX = actionLink.getRunParams("offsetx");
        sumTime = actionLink.getRunParams("sumtime");
    }else{
        offsetX = 0;
        sumTime = 0;
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("offsetx",offsetX);
        actionLink.setRunParams("sumtime",sumTime);
    }
    sumTime += deltaTime;
    var newOffsetX = this._offsetFun(sumTime);
    if((offsetX-this._targetOffset)*(newOffsetX-this._targetOffset) <= 0){
        actionLink.setRunParams("inited",false);
        sprite.setX(sprite.getX()+this._targetOffset-offsetX);
        return HY.Core.Action.Status.FINISH;
    }else{
        actionLink.setRunParams("offsetx",newOffsetX);
        actionLink.setRunParams("sumtime",sumTime);
        sprite.setX(sprite.getX()+newOffsetX-offsetX);
        return HY.Core.Action.Status.UNFINISH;
    }
}

HY.Core.Action.MoveY = function(config){
    this.init(config);
}
HY.Core.Action.MoveY.prototype = new HY.Core.Action.Animation();
HY.Core.Action.MoveY.prototype.execute = function(actionLink, deltaTime){
    var sprite = actionLink.getSprite();
    var offsetY,sumTime;
    var initFlag = actionLink.getRunParams("inited");
    if(initFlag){
        offsetY = actionLink.getRunParams("offsety");
        sumTime = actionLink.getRunParams("sumtime");
    }else{
        offsetY = 0;
        sumTime = 0;
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("offsety",offsetY);
        actionLink.setRunParams("sumtime",sumTime);
    }
    sumTime += deltaTime;
    var newOffsetY = this._offsetFun(sumTime);
    if((offsetY-this._targetOffset)*(newOffsetY-this._targetOffset) <= 0){
        actionLink.setRunParams("inited",false);
        sprite.setY(sprite.getY()+this._targetOffset-offsetY);
        return HY.Core.Action.Status.FINISH;
    }else{
        actionLink.setRunParams("offsety",newOffsetY);
        actionLink.setRunParams("sumtime",sumTime);
        sprite.setY(sprite.getY()+newOffsetY-offsetY);
        return HY.Core.Action.Status.UNFINISH;
    }
}

HY.Core.Action.ResizeWidth = function(config){
    this.init(config);
}
HY.Core.Action.ResizeWidth.prototype = new HY.Core.Action.Animation();
HY.Core.Action.ResizeWidth.prototype.execute = function(actionLink, deltaTime){
    var sprite = actionLink.getSprite();
    var offsetWidth,sumTime;
    var initFlag = actionLink.getRunParams("inited");
    if(initFlag){
        offsetWidth = actionLink.getRunParams("offsetwidth");
        sumTime = actionLink.getRunParams("sumtime");
    }else{
        offsetWidth = 0;
        sumTime = 0;
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("offsetwidth",offsetWidth);
        actionLink.setRunParams("sumtime",sumTime);
    }
    sumTime += deltaTime;
    var newOffsetWidth = this._offsetFun(sumTime);
    if((offsetWidth-this._targetOffset)*(newOffsetWidth-this._targetOffset) <= 0){
        actionLink.setRunParams("inited",false);
        sprite.setWidth(sprite.getWidth()+this._targetOffset-offsetWidth);
        return HY.Core.Action.Status.FINISH;
    }else{
        actionLink.setRunParams("offsetwidth",newOffsetWidth);
        actionLink.setRunParams("sumtime",sumTime);
        sprite.setWidth(sprite.getWidth()+newOffsetWidth-offsetWidth);
        return HY.Core.Action.Status.UNFINISH;
    }
}

HY.Core.Action.ResizeHeight = function(config){
    this.init(config);
}
HY.Core.Action.ResizeHeight.prototype = new HY.Core.Action.Animation();
HY.Core.Action.ResizeHeight.prototype.execute = function(actionLink, deltaTime){
    var sprite = actionLink.getSprite();
    var offsetHeight,sumTime;
    var initFlag = actionLink.getRunParams("inited");
    if(initFlag){
        offsetHeight = actionLink.getRunParams("offsetheight");
        sumTime = actionLink.getRunParams("sumtime");
    }else{
        offsetHeight = 0;
        sumTime = 0;
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("offsetheight",offsetHeight);
        actionLink.setRunParams("sumtime",sumTime);
    }
    sumTime += deltaTime;
    var newOffsetHeight = this._offsetFun(sumTime);
    if((offsetHeight-this._targetOffset)*(newOffsetHeight-this._targetOffset) <= 0){
        actionLink.setRunParams("inited",false);
        sprite.setHeight(sprite.getHeight()+this._targetOffset-offsetHeight);
        return HY.Core.Action.Status.FINISH;
    }else{
        actionLink.setRunParams("offsetheight",newOffsetHeight);
        actionLink.setRunParams("sumtime",sumTime);
        sprite.setHeight(sprite.getHeight()+newOffsetHeight-offsetHeight);
        return HY.Core.Action.Status.UNFINISH;
    }
}

HY.Core.Action.ScaleX = function(config){
    this.init(config);
}
HY.Core.Action.ScaleX.prototype = new HY.Core.Action.Animation();
HY.Core.Action.ScaleX.prototype.execute = function(actionLink, deltaTime){
    var sprite = actionLink.getSprite();
    var offsetScaleX,sumTime;
    var initFlag = actionLink.getRunParams("inited");
    if(initFlag){
        offsetScaleX = actionLink.getRunParams("offsetscalex");
        sumTime = actionLink.getRunParams("sumtime");
    }else{
        offsetScaleX = 0;
        sumTime = 0;
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("startscalex",startScaleX);
        actionLink.setRunParams("offsetscalex",offsetScaleX);
        actionLink.setRunParams("sumtime",sumTime);
    }
    sumTime += deltaTime;
    var newOffsetScaleX = this._offsetFun(sumTime);
    if((offsetScaleX-this._targetOffset)*(newOffsetScaleX-this._targetOffset) <= 0){
        actionLink.setRunParams("inited",false);
        sprite.setScaleX(sprite.getScaleX()+this._targetOffset-offsetScaleX);
        return HY.Core.Action.Status.FINISH;
    }else{
        actionLink.setRunParams("offsetscalex",newOffsetScaleX);
        actionLink.setRunParams("sumtime",sumTime);
        sprite.setScaleX(sprite.getScaleX()+newOffsetScaleX-offsetScaleX);
        return HY.Core.Action.Status.UNFINISH;
    }
}

HY.Core.Action.ScaleY = function(config){
    this.init(config);
}
HY.Core.Action.ScaleY.prototype = new HY.Core.Action.Animation();
HY.Core.Action.ScaleY.prototype.execute = function(actionLink, deltaTime){
    var sprite = actionLink.getSprite();
    var offsetScaleY,sumTime;
    var initFlag = actionLink.getRunParams("inited");
    if(initFlag){
        offsetScaleY = actionLink.getRunParams("offsetscaley");
        sumTime = actionLink.getRunParams("sumtime");
    }else{
        offsetScaleY = 0;
        sumTime = 0;
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("offsetscaley",offsetScaleY);
        actionLink.setRunParams("sumtime",sumTime);
    }
    sumTime += deltaTime;
    var newOffsetScaleY = this._offsetFun(sumTime);
    if((offsetScaleY-this._targetOffset)*(newOffsetScaleY-this._targetOffset) <= 0){
        actionLink.setRunParams("inited",false);
        sprite.setScaleY(sprite.getScaleY()+this._targetOffset-offsetScaleY);
        return HY.Core.Action.Status.FINISH;
    }else{
        actionLink.setRunParams("offsetscaley",newOffsetScaleY);
        actionLink.setRunParams("sumtime",sumTime);
        sprite.setScaleY(sprite.getScaleY()+newOffsetScaleY-offsetScaleY);
        return HY.Core.Action.Status.UNFINISH;
    }
}

HY.Core.Action.MoveAnchorX = function(config){
    this.init(config);
}
HY.Core.Action.MoveAnchorX.prototype = new HY.Core.Action.Animation();
HY.Core.Action.MoveAnchorX.prototype.execute = function(actionLink, deltaTime){
    var sprite = actionLink.getSprite();
    var offsetX,sumTime;
    var initFlag = actionLink.getRunParams("inited");
    if(initFlag){
        offsetX = actionLink.getRunParams("offsetx");
        sumTime = actionLink.getRunParams("sumtime");
    }else{
        offsetX = 0;
        sumTime = 0;
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("offsetx",offsetX);
        actionLink.setRunParams("sumtime",sumTime);
    }
    sumTime += deltaTime;
    var newOffsetX = this._offsetFun(sumTime);
    if((offsetX-this._targetOffset)*(newOffsetX-this._targetOffset) <= 0){
        actionLink.setRunParams("inited",false);
        sprite.setAnchorX(sprite.getAnchorX()+this._targetOffset-offsetX);
        return HY.Core.Action.Status.FINISH;
    }else{
        actionLink.setRunParams("offsetx",newOffsetX);
        actionLink.setRunParams("sumtime",sumTime);
        sprite.setAnchorX(sprite.getAnchorX()+newOffsetX-offsetX);
        return HY.Core.Action.Status.UNFINISH;
    }
}

HY.Core.Action.MoveAnchorY = function(config){
    this.init(config);
}
HY.Core.Action.MoveAnchorY.prototype = new HY.Core.Action.Animation();
HY.Core.Action.MoveAnchorY.prototype.execute = function(actionLink, deltaTime){
    var sprite = actionLink.getSprite();
    var offsetY,sumTime;
    var initFlag = actionLink.getRunParams("inited");
    if(initFlag){
        offsetY = actionLink.getRunParams("offsety");
        sumTime = actionLink.getRunParams("sumtime");
    }else{
        offsetY = 0;
        sumTime = 0;
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("offsety",offsetY);
        actionLink.setRunParams("sumtime",sumTime);
    }
    sumTime += deltaTime;
    var newOffsetY = this._offsetFun(sumTime);
    if((offsetY-this._targetOffset)*(newOffsetY-this._targetOffset) <= 0){
        actionLink.setRunParams("inited",false);
        sprite.setAnchorY(sprite.getAnchorY()+this._targetOffset-offsetY);
        return HY.Core.Action.Status.FINISH;
    }else{
        actionLink.setRunParams("offsety",newOffsetY);
        actionLink.setRunParams("sumtime",sumTime);
        sprite.setAnchorY(sprite.getAnchorY()+newOffsetY-offsetY);
        return HY.Core.Action.Status.UNFINISH;
    }
}

HY.Core.Action.RotateZ = function(config){
    this.init(config);
}
HY.Core.Action.RotateZ.prototype = new HY.Core.Action.Animation();
HY.Core.Action.RotateZ.prototype.execute = function(actionLink, deltaTime){
    var sprite = actionLink.getSprite();
    var offsetAngle,sumTime;
    var initFlag = actionLink.getRunParams("inited");
    if(initFlag){
        offsetAngle = actionLink.getRunParams("offsetangle");
        sumTime = actionLink.getRunParams("sumtime");
    }else{
        offsetAngle = 0;
        sumTime = 0;
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("offsetangle",offsetAngle);
        actionLink.setRunParams("sumtime",sumTime);
    }
    sumTime += deltaTime;
    var newOffsetAngle = this._offsetFun(sumTime);
    if((offsetAngle-this._targetOffset)*(newOffsetAngle-this._targetOffset) <= 0){
        actionLink.setRunParams("inited",false);
        sprite.rotateZ(this._targetOffset-offsetAngle);
        return HY.Core.Action.Status.FINISH;
    }else{
        actionLink.setRunParams("offsetangle",newOffsetAngle);
        actionLink.setRunParams("sumtime",sumTime);
        sprite.rotateZ(newOffsetAngle-offsetAngle);
        return HY.Core.Action.Status.UNFINISH;
    }
}

HY.Core.Action.Fade = function(config){
    this.init(config);
}
HY.Core.Action.Fade.prototype = new HY.Core.Action.Animation();
HY.Core.Action.Fade.prototype.execute = function(actionLink, deltaTime){
    var sprite = actionLink.getSprite();
    var offsetAlpha,sumTime;
    var initFlag = actionLink.getRunParams("inited");
    if(initFlag){
        offsetAlpha = actionLink.getRunParams("offsetalpha");
        sumTime = actionLink.getRunParams("sumtime");
    }else{
        offsetAlpha = 0;
        sumTime = 0;
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("offsetalpha",offsetAlpha);
        actionLink.setRunParams("sumtime",sumTime);
    }
    sumTime += deltaTime;
    var newOffsetAlpha = this._offsetFun(sumTime);
    if((offsetAlpha-this._targetOffset)*(newOffsetAlpha-this._targetOffset) <= 0){
        actionLink.setRunParams("inited",false);
        sprite.setAlpha(sprite.getAlpha()+this._targetOffset-offsetAlpha);
        return HY.Core.Action.Status.FINISH;
    }else{
        actionLink.setRunParams("offsetAlpha",newOffsetAlpha);
        actionLink.setRunParams("sumTime",sumTime);
        sprite.setAlpha(sprite.getAlpha()+newOffsetAlpha-offsetAlpha);
        return HY.Core.Action.Status.UNFINISH;
    }
}

HY.Core.Action.List = function(config){
    this.init(config);
}
HY.Core.Action.List.prototype = new HY.Core.Action.Base();
HY.Core.Action.List.prototype.init = function(config){
    this.superCall("init",[config]);
    if(config.actions != undefined){ this.setActions(config.actions); } else { this.setActions([]); }
}
HY.Core.Action.List.prototype.getActions = function(){
    return this._actions;
}
HY.Core.Action.List.prototype.setActions = function(actions){
    this._actions = actions;
}

HY.Core.Action.SyncList = function(config){
    this.init(config);
}
HY.Core.Action.SyncList.prototype = new HY.Core.Action.List();
HY.Core.Action.SyncList.prototype.execute = function(actionLink, deltaTime){
    var initFlag = actionLink.getRunParams("inited");
    var actionLinks;
    if(!initFlag){
        actionLinks = [];
        var sprite = actionLink.getSprite();
        var actions = this.getActions();
        for(var i= 0, actionNum = actions.length;i<actionNum;++i){
            actionLinks.push(new HY.Core.Action.Link({sprite:sprite, action:actions[i]}));
        }
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("actionlinks",actionLinks);
    }else{
        actionLinks = actionLink.getRunParams("actionlinks",actionLinks);
    }
    if(actionLinks.length == 0){
        actionLink.setRunParams("inited",false);
        return HY.Core.Action.Status.FINISH;
    }else{
        var curActionLink = actionLinks[0];
        if(curActionLink.execute(deltaTime) == HY.Core.Action.Status.FINISH){
            actionLinks.splice(0,1);
        }
        return HY.Core.Action.Status.UNFINISH;
    }
}

HY.Core.Action.AsyncList = function(config){
    this.init(config);
}
HY.Core.Action.AsyncList.prototype = new HY.Core.Action.List();
HY.Core.Action.AsyncList.prototype.execute = function(actionLink, deltaTime){
    var initFlag = actionLink.getRunParams("inited");
    var actionLinks;
    if(!initFlag){
        actionLinks = [];
        var sprite = actionLink.getSprite();
        var actions = this.getActions();
        for(var i= 0, actionNum = actions.length;i<actionNum;++i){
            actionLinks.push(new HY.Core.Action.Link({sprite:sprite, action:actions[i]}));
        }
        actionLink.setRunParams("inited",true);
        actionLink.setRunParams("actionlinks",actionLinks);
    }else{
        actionLinks = actionLink.getRunParams("actionlinks");
    }
    if(actionLinks.length == 0){
        actionLink.setRunParams("inited",false);
        return HY.Core.Action.Status.FINISH;
    }else{
        var curActionLink = null;
        for(var i=actionLinks.length-1;i>=0;--i){
            curActionLink = actionLinks[i];
            if(curActionLink.execute(deltaTime) == HY.Core.Action.Status.FINISH){
                actionLinks.splice(i,1);
            }
        }
        return HY.Core.Action.Status.UNFINISH;
    }
}