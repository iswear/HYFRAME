HY.Game.Unit = function(config){
    this.init(config);
}
HY.Game.Unit.prototype = new HY.Core.Node();
HY.Game.Unit.prototype.defaultName = "新零件";
HY.Game.Unit.prototype.defaultWidth = 50;
HY.Game.Unit.prototype.defaultHeight = 50;
HY.Game.Unit.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.name != undefined){ this._name = config.name; } else { this._name = this.defaultName; }
    if(config.texture != undefined){ this._texture = config.texture; } else { this._texture = null; }
    if(config.actionFrames != undefined){ this._actionFrames = config.actionFrames; } else { this._actionFrames = {}; }
    this._compiledActions = {};
    this._childUnits = [];
}
HY.Game.Unit.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("paint",this._selfPaint,this);
}
HY.Game.Unit.prototype.removeClearUp = function(node, notClearUp){
    this.superCall("removeClearUp",[node, notClearUp]);
    for(var i=this._childUnits.length-1 ; i>=0 ;--i){
        if(this._childUnits[i] == node){
            this._childUnits.splice(i,1);
        }
    }
}
HY.Game.Unit.prototype.getName = function(){
    return this._name;
}
HY.Game.Unit.prototype.setName = function(name){
    this._name = name;
}
HY.Game.Unit.prototype.getTexture = function(){
    return this._texture;
}
HY.Game.Unit.prototype.setTexture = function(texture){
    this._texture = texture;
    this.reRender();
}
HY.Game.Unit.prototype.getChildUnits = function(){
    return this._childUnits;
}
HY.Game.Unit.prototype.getChildUnitAtIndex = function(index){
    if(index < this._childUnits.length){
        return
    }
    return this._childUnits[index];
}
HY.Game.Unit.prototype.addChildUnit = function(unit){
    this._childUnits.push(unit);
    this.addChildNodeAtLayer(unit,0);
}
HY.Game.Unit.prototype.addChildUnitAtIndex = function(unit,index){
    if(index < this._childUnits.length){
        var preunit = this._childUnits[index];
        var nodeindex = this.getChildNodeIndexAtLayer(preunit);
        this.addChildNodeAtLayersIndex(unit,0,nodeindex);
        this._childUnits.splice(index,0,unit);
    }else{
        this.addChildUnit(unit);
    }
}
HY.Game.Unit.prototype.removeChildUnit = function(unit,notClearUp){
    var len = this._childUnits.length;
    for(var i = this._childUnits.length-1;i>=0;--i){
        if(this._childUnits[i] == unit){
            this._childUnits.splice(i,1);
        }
    }
    this.removeChildNode(unit,notClearUp);
}
HY.Game.Unit.prototype.removeChildUnitAtIndex = function(index,notClearUp){
    if(index < this._childUnits.length){
        var delunit = this._childUnits[index];
        this._childUnits.splice(index,1);
        this.removeChildNode(delunit,notClearUp);
    }
}
HY.Game.Unit.prototype.getActionFrames = function(){
    return this._actionFrames;
}
HY.Game.Unit.prototype.setActionFrames = function(actionFrames){
    this._actionFrames = actionFrames;
}
HY.Game.Unit.prototype.getActionFramesOfName = function(name){
    if(this._actionFrames){
        return this._actionFrames[name];
    }else{
        return null;
    }
}
HY.Game.Unit.prototype.setActionFramesOfName = function(name, frames){
    if(!this._actionFrames){
        this._actionFrames = {};
    }
    this._actionFrames[name] = frames;
}
HY.Game.Unit.prototype.getActions = function(){
    return this._compiledActions;
}
HY.Game.Unit.prototype.setActions = function(actions){
    this._compiledActions = actions;
}
HY.Game.Unit.prototype.getActionOfName = function(name){
    if(!this._compiledActions){
        return this._compiledActions[name];
    }else{
        return null;
    }
}
HY.Game.Unit.prototype.setActionOfName = function(name, action){
    if(!this._compiledActions){
        this._compiledActions = {};
    }
    this._compiledActions[name] = action;
}
HY.Game.Unit.prototype.runActionOfName = function(name, loop, target, selector, childrenrun){
    var action = this.getActionOfName(name);
    if(!action){
        action = this.compileActionOfName(name);
    }
    if(action){
        this.runAction(action, loop, target, selector);
    }
    if(childrenrun){
        for(var i=this._childUnits.length-1;i>=0;--i){
            this._childUnits[i].runActionOfName(name, loop, target, selector, childrenrun);
        }
    }
}
HY.Game.Unit.prototype.compileActionOfName = function(name){
    var frames = this.getActionFramesOfName(name);
    if(frames != null){
        var len = frames.length;
        var syncAcArr = [];
        for(var i=0;i<len;++i){
            var AsyncAcArr = [];
            var curframe = frames[i];
            if(i == 0){
                this._checkActionFrame(null,curframe);
                AsyncAcArr.push(new HY.Core.Action.Scheduler({interval:curframe[HY.Game.Frame.Param.time],repeats:1,target:this,selector:this._runActionScheduler,param:curframe}));
            }else{
                var preframe = frames[i-1];
                this._checkActionFrame(preframe,curframe);
                var deltaParam,deltaTime = curframe[HY.Game.Frame.Param.time]-preframe[HY.Game.Frame.Param.time];
                if(curframe[HY.Game.Frame.Param.tween] > 0){
                    if(curframe[HY.Game.Frame.Param.x] != preframe[HY.Game.Frame.Param.x]){
                        deltaParam = curframe[HY.Game.Frame.Param.x]-preframe[HY.Game.Frame.Param.x];
                        AsyncAcArr.push(new HY.Core.Action.MoveX({targetOffset:deltaParam,offsetFun:(deltaParam/deltaTime)+"*t"}));
                    }
                    if(curframe[HY.Game.Frame.Param.y] != preframe[HY.Game.Frame.Param.y]){
                        deltaParam = curframe[HY.Game.Frame.Param.y]-preframe[HY.Game.Frame.Param.y];
                        AsyncAcArr.push(new HY.Core.Action.MoveY({targetOffset:deltaParam,offsetFun:(deltaParam/deltaTime)+"*t"}));
                    }
                    if(curframe[HY.Game.Frame.Param.width] != preframe[HY.Game.Frame.Param.width]){
                        deltaParam = curframe[HY.Game.Frame.Param.width]-preframe[HY.Game.Frame.Param.width];
                        AsyncAcArr.push(new HY.Core.Action.ResizeWidth({targetOffset:deltaParam,offsetFun:(deltaParam/deltaTime)+"*t"}));
                    }
                    if(curframe[HY.Game.Frame.Param.height] != preframe[HY.Game.Frame.Param.height]){
                        deltaParam = curframe[HY.Game.Frame.Param.height]-preframe[HY.Game.Frame.Param.height];
                        AsyncAcArr.push(new HY.Core.Action.ResizeHeight({targetOffset:deltaParam,offsetFun:(deltaParam/deltaTime)+"*t"}));
                    }
                    if(curframe[HY.Game.Frame.Param.scaleX] != preframe[HY.Game.Frame.Param.scaleX]){
                        deltaParam = curframe[HY.Game.Frame.Param.scaleX]-preframe[HY.Game.Frame.Param.scaleX];
                        AsyncAcArr.push(new HY.Core.Action.ScaleX({targetOffset:deltaParam,offsetFun:(deltaParam/deltaTime)+"*t"}));
                    }
                    if(curframe[HY.Game.Frame.Param.scaleY] != preframe[HY.Game.Frame.Param.scaleY]){
                        deltaParam = curframe[HY.Game.Frame.Param.scaleY]-preframe[HY.Game.Frame.Param.scaleY];
                        AsyncAcArr.push(new HY.Core.Action.ScaleY({targetOffset:deltaParam,offsetFun:(deltaParam/deltaTime)+"*t"}));
                    }
                    if(curframe[HY.Game.Frame.Param.anchorX] != preframe[HY.Game.Frame.Param.anchorX]){
                        deltaParam = curframe[HY.Game.Frame.Param.anchorX]-preframe[HY.Game.Frame.Param.anchorX];
                        AsyncAcArr.push(new HY.Core.Action.MoveAnchorX({targetOffset:deltaParam,offsetFun:(deltaParam/deltaTime)+"*t"}));
                    }
                    if(curframe[HY.Game.Frame.Param.anchorY] != preframe[HY.Game.Frame.Param.anchorY]){
                        deltaParam = curframe[HY.Game.Frame.Param.anchorY]-preframe[HY.Game.Frame.Param.anchorY];
                        AsyncAcArr.push(new HY.Core.Action.MoveAnchorY({targetOffset:deltaParam,offsetFun:(deltaParam/deltaTime)+"*t"}));
                    }
                    if(curframe[HY.Game.Frame.Param.rotateZ] != preframe[HY.Game.Frame.Param.rotateZ]){
                        deltaParam = curframe[HY.Game.Frame.Param.rotateZ]-preframe[HY.Game.Frame.Param.rotateZ];
                        AsyncAcArr.push(new HY.Core.Action.RotateZ({targetOffset:deltaParam,offsetFun:(deltaParam/deltaTime)+"*t"}));
                    }
                    if(curframe[HY.Game.Frame.Param.alpha] != preframe[HY.Game.Frame.Param.alpha]){
                        deltaParam = curframe[HY.Game.Frame.Param.alpha]-preframe[HY.Game.Frame.Param.alpha];
                        AsyncAcArr.push(new HY.Core.Action.Fade({targetOffset:deltaParam,offsetFun:(deltaParam/deltaTime)+"*t"}));
                    }
                }else{
                    AsyncAcArr.push(new HY.Core.Action.Scheduler({interval:deltaTime,repeats:1,target:this,selector:this._runActionScheduler,param:curframe}));
                }
            }
            syncAcArr.push(new HY.Core.Action.AsyncList({actions:AsyncAcArr}))
        }
        var resultAction = new HY.Core.Action.SyncList({actions:syncAcArr});
        this.setActionOfName(name,new HY.Core.Action.SyncList({actions:syncAcArr}));
        return resultAction;
    }
}
HY.Game.Unit.prototype._checkActionFrame = function(preframe, curframe){
    if(preframe != null){
        if(curframe[HY.Game.Frame.Param.tween] == undefined){
            curframe[HY.Game.Frame.Param.tween] = 0;
        }
        if(curframe[HY.Game.Frame.Param.x] == undefined){
            curframe[HY.Game.Frame.Param.x] = preframe[HY.Game.Frame.Param.x];
        }
        if(curframe[HY.Game.Frame.Param.y] == undefined){
            curframe[HY.Game.Frame.Param.y] = preframe[HY.Game.Frame.Param.y];
        }
        if(curframe[HY.Game.Frame.Param.width] == undefined){
            curframe[HY.Game.Frame.Param.width] = preframe[HY.Game.Frame.Param.width];
        }
        if(curframe[HY.Game.Frame.Param.height] == undefined){
            curframe[HY.Game.Frame.Param.height] = preframe[HY.Game.Frame.Param.height];
        }
        if(curframe[HY.Game.Frame.Param.scaleX] == undefined){
            curframe[HY.Game.Frame.Param.scaleX] = preframe[HY.Game.Frame.Param.scaleX];
        }
        if(curframe[HY.Game.Frame.Param.scaleY] == undefined){
            curframe[HY.Game.Frame.Param.scaleY] = preframe[HY.Game.Frame.Param.scaleY];
        }
        if(curframe[HY.Game.Frame.Param.anchorX] == undefined){
            curframe[HY.Game.Frame.Param.anchorX] = preframe[HY.Game.Frame.Param.anchorX];
        }
        if(curframe[HY.Game.Frame.Param.anchorY] == undefined){
            curframe[HY.Game.Frame.Param.anchorY] = preframe[HY.Game.Frame.Param.anchorY];
        }
        if(curframe[HY.Game.Frame.Param.rotateZ] == undefined){
            curframe[HY.Game.Frame.Param.rotateZ] = preframe[HY.Game.Frame.Param.rotateZ];
        }
        if(curframe[HY.Game.Frame.Param.alpha] == undefined){
            curframe[HY.Game.Frame.Param.alpha] = preframe[HY.Game.Frame.Param.alpha];
        }
    }else{
        if(curframe[HY.Game.Frame.Param.tween] == undefined){
            curframe[HY.Game.Frame.Param.tween] = 0;
        }
        if(curframe[HY.Game.Frame.Param.x] == undefined){
            curframe[HY.Game.Frame.Param.x] = this.getX();
        }
        if(curframe[HY.Game.Frame.Param.y] == undefined){
            curframe[HY.Game.Frame.Param.y] = this.getY();
        }
        if(curframe[HY.Game.Frame.Param.width] == undefined){
            curframe[HY.Game.Frame.Param.width] = this.getWidth();
        }
        if(curframe[HY.Game.Frame.Param.height] == undefined){
            curframe[HY.Game.Frame.Param.height] = this.getHeight();
        }
        if(curframe[HY.Game.Frame.Param.scaleX] == undefined){
            curframe[HY.Game.Frame.Param.scaleX] = this.getScaleX();
        }
        if(curframe[HY.Game.Frame.Param.scaleY] == undefined){
            curframe[HY.Game.Frame.Param.scaleY] = this.getScaleY();
        }
        if(curframe[HY.Game.Frame.Param.anchorX] == undefined){
            curframe[HY.Game.Frame.Param.anchorX] = this.getAnchorX();
        }
        if(curframe[HY.Game.Frame.Param.anchorY] == undefined){
            curframe[HY.Game.Frame.Param.anchorY] = this.getAnchorY();
        }
        if(curframe[HY.Game.Frame.Param.rotateZ] == undefined){
            curframe[HY.Game.Frame.Param.rotateZ] = this.getRotateZ();
        }
        if(curframe[HY.Game.Frame.Param.alpha] == undefined){
            curframe[HY.Game.Frame.Param.alpha] = this.getAlpha();
        }
    }
}
HY.Game.Unit.prototype._runActionScheduler = function(frame){
    this.setX(frame[HY.Game.Frame.Param.x]);
    this.setY(frame[HY.Game.Frame.Param.y]);
    this.setWidth(frame[HY.Game.Frame.Param.width]);
    this.setHeight(frame[HY.Game.Frame.Param.height]);
    this.setScaleX(frame[HY.Game.Frame.Param.scaleX]);
    this.setScaleY(frame[HY.Game.Frame.Param.scaleY]);
    this.setAnchorX(frame[HY.Game.Frame.Param.anchorX]);
    this.setAnchorY(frame[HY.Game.Frame.Param.anchorY]);
    this.setRotateZ(frame[HY.Game.Frame.Param.rotateZ]);
    this.setAlpha(frame[HY.Game.Frame.Param.alpha]);
}
HY.Game.Unit.prototype._selfPaint = function(dc,rect){
}

