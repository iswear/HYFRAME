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
HY.Core.Action.Manager.prototype.addActionLink = function(sprite,action,loop,target,selector){
    var actionLink = new HY.Core.Action.Link({sprite:sprite,action:action,loop:loop,target:target,selector:selector});
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
HY.Core.Action.Link.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.action != undefined){ this._action = config.action; } else { this._action = null; }
    if(config.sprite != undefined){ this._sprite = config.sprite; } else { this._sprite = null; }
    if(config.loop != undefined){ this._loop = config.loop; } else { this._loop = false; }
    if(config.target != undefined){ this._target = config.target; } else { this._target = null; }
    if(config.selector != undefined){ this._selector = config.selector; } else { this._selector = null; }
    this._removeFlag = false;
    this._runParams = {};
}
HY.Core.Action.Link.prototype.getAction = function(){
    return this._action;
}
HY.Core.Action.Link.prototype.getSprite = function(){
    return this._sprite;
}
HY.Core.Action.Link.prototype.getLoop = function(){
    return this._loop;
}
HY.Core.Action.Link.prototype.setLoop = function(loop){
    this._loop = loop;
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
    if(this._selector != null){
        this._selector.apply(this._target,[this._action,result]);
    }
    return result;
}

HY.Core.Action.Scheduler = function(config){
    this.init(config);
}
HY.Core.Action.Scheduler.prototype = new HY.Object();
HY.Core.Action.Scheduler.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.interval != undefined){ this._interval = config.interval; } else { this._interval = 0; }
    if(config.repeats != undefined){ this._repeats = config.repeats; } else { this._repeats = 0; }
    if(config.target != undefined){ this._target = config.target; } else { this._target = null; }
    if(config.selector != undefined){ this._selector = config.selector; } else { this._selector = null; }
    if(config.param != undefined){ this._param = config.param; } else { this._param = null; }
}
HY.Core.Action.Scheduler.prototype.getInterval = function(){
    return this._interval;
}
HY.Core.Action.Scheduler.prototype.getRepeats = function(){
    return this._repeats;
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
            this._selector.apply(this._target,[this._param]);
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
HY.Core.Action.Animation.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.targetOffset != undefined){ this._targetOffset = config.targetOffset; } else { this._targetOffset = undefined; }
    if(config.offsetFun != undefined){ this._offsetFun = eval("(function(t){ return "+config.offsetFun+"; })"); } else { this._offsetFun = function(t){ return 0; }; }
}
HY.Core.Action.Animation.prototype.getTargetOffset = function(){
    return this._targetOffset;
}
HY.Core.Action.Animation.prototype.getOffsetFun = function(){
    return this._offsetFun;
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
HY.Core.Action.List.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.actions != undefined){ this._actions = config.actions; } else { this._actions = []; }
}
HY.Core.Action.List.prototype.getActions = function(){
    return this._actions;
}

HY.Core.Action.SyncList = function(config){
    this.init(config);
}
HY.Core.Action.SyncList.prototype = new HY.Core.Action.List();
HY.Core.Action.SyncList.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
}
HY.Core.Action.SyncList.prototype.execute = function(actionLink, deltaTime){
    var initFlag = actionLink.getRunParams("inited");
    var actionLinks;
    if(!initFlag){
        actionLinks = [];
        var sprite = actionLink.getSprite();
        var actions = this.getActions();
        var actionNum = actions.length;
        for(var i=0;i<actionNum;++i){
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
HY.Core.Action.AsyncList.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
}
HY.Core.Action.AsyncList.prototype.execute = function(actionLink, deltaTime){
    var initFlag = actionLink.getRunParams("inited");
    var actionLinks;
    if(!initFlag){
        actionLinks = [];
        var sprite = actionLink.getSprite();
        var actions = this.getActions();
        var actionNum = actions.length;
        for(var i=0;i<actionNum;++i){
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