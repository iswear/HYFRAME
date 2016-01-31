HY.Game.Unit = function(config){
    this.init(config);
}
HY.Game.Unit.prototype = new HY.Game.Node();
HY.Game.Unit.prototype.defaultName = "新零件";
HY.Game.Unit.prototype.defaultWidth = 50;
HY.Game.Unit.prototype.defaultHeight = 50;
HY.Game.Unit.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.name != undefined){ this._name = config.name; } else { this._name = this.defaultName; }
    if(config.texture != undefined){ this._texture = config.texture; } else { this._texture = null; }
    if(config.actions != undefined){ this._actions = config.actions; } else { this._actions = {}; }
    if(config.actionFrames != undefined){ this._actionFrames = config.actionFrames; } else { this._actionFrames = {}; }
    if(config.collidedEnable != undefined){ this._collidedEnable = config.collidedEnable; } else { this._collidedEnable = true; }
    if(config.localCollidedPolygon){ this._localCollidedPolygon =  config.localCollidedPolygon;} else {this._localCollidedPolygon = null;}
    if(config.enterCollidedEvent){ this.addEventListener("entercollided",config.enterCollidedEvent.selector,config.enterCollidedEvent.target); }
    if(config.outCollidedEvent){ this.addEventListener("outcollided",config.enterCollidedEvent.selector,config.enterCollidedEvent.target); }

    this._collidedRange = null;
    this._detectorCollidedPolygon = null;
    this._childUnits = [];
}
HY.Game.Unit.prototype.removeChildNode = function(pNode){
    for(var i = this._childUnits.length-1;i>=0;--i){
        if(this._childUnits[i] == pNode){
            this._childUnits.splice(i,1);
        }
    }
    this.superCall("removeChildNode",[pNode]);
}
HY.Game.Unit.prototype.getName = function(){
    return this._name;
}
HY.Game.Unit.prototype.setName = function(pName){
    this._name = pName;
}
HY.Game.Unit.prototype.getTexture = function(){
    return this._texture;
}
HY.Game.Unit.prototype.setTexture = function(pTexture){
    this._texture = pTexture;
    this.reRender();
}
HY.Game.Unit.prototype.getCollidedEnable = function(){
    return this._collidedEnable;
}
HY.Game.Unit.prototype.setCollidedEnable = function(pValue){
    this._collidedEnable = pValue;
}
HY.Game.Unit.prototype.getLocalCollidedPolygon = function(){
    return this._localCollidedPolygon;
}
HY.Game.Unit.prototype.setLocalCollidedPolygon = function(pPolygon){
    if(pPolygon && pPolygon.length > 1){
        this._collidedPolygon = [];
        var len = config.collidedPolygon.length;
        for(var i=0;i<len;++i){
            this._collidedPolygon.push(new HY.Vect2D(config.collidedPolygon[i]));
        }
    } else {
        this._collidedPolygon = null;
    }
}
HY.Game.Unit.prototype.getDetectorCollidedPolygon = function(){
    return this._detectorCollidedPolygon;
}
HY.Game.Unit.prototype.setDetectorCollidedPolygon = function(pPolygon){
    this._detectorCollidedPolygon = pPolygon;
}
HY.Game.Unit.prototype.getCollidedRange = function(){
    return this._collidedRange;
}
HY.Game.Unit.prototype.setCollidedRange = function(pRange){
    this._collidedRange = pRange;
}
HY.Game.Unit.prototype.getActions = function(){
    return this._actions;
}
HY.Game.Unit.prototype.setActions = function(pActions){
    this._actions = pActions;
}
HY.Game.Unit.prototype.getActionsByName = function(pName){
    if(this._actions && this._actions[pName]){
        return this._actions[pName];
    }else{
        return null;
    }
}
HY.Game.Unit.prototype.setActionsByName = function(pName,pActions){
    if (this._actions) {
        this._actions[pName] = pActions;
    } else {
        this._actions = {};
        this._actions[pName] = pActions;
    }
}
HY.Game.Unit.prototype.removeActionsByName = function(pName,pChildRemove){
	if(this._actions){
		delete this._actions[pName];
	}
	if(pChildRemove){
		var childUnits = this.getChildUnits();
		var len = childUnits.length;
		for(var i=0; i<len ; ++i){
			childUnits[i].removeActionsByName(pName,true);
		}
	}
}
HY.Game.Unit.prototype.getActionFrames = function(){
	return this._actionFrames;
}
HY.Game.Unit.prototype.setActionFrames = function(pActionFrames){
    this._actionFrames = pActionFrames;
}
HY.Game.Unit.prototype.getActionFramesByName = function(pName){
    if(this._actionFrames && this._actionFrames[pName]){
        return this._actionFrames[pName];
    }else{
        return null;
    }
}
HY.Game.Unit.prototype.setActionFramesByName = function(pName,pFrames) {
    if (this._actionFrames) {
        this._actionFrames[pName] = pFrames;
    } else {
        this._actionFrames = {};
        this._actionFrames[pName] = pFrames;
    }
}
HY.Game.Unit.prototype.removeActionFramesByName = function(pName,pChildRemove){
	if(this._actionFrames){
		delete this._actionFrames[pName];
	}
	if(pChildRemove){
		var childUnits = this.getChildUnits();
		var len = childUnits.length;
		for(var i=0; i<len ; ++i){
			childUnits[i].removeActionFramesByName(pName,true);
		}
	}
}
HY.Game.Unit.prototype.getKeyFrame = function(pName,pTime){
	var frames = this.getActionFramesByName(pName);
    if(frames){
        var len = frames.length;
        for(var i = 0;i<len;++i){
            if(frames[i].time == pTime){
                return frames[i];
            }
        }
    }
	return null;
}
HY.Game.Unit.prototype.addKeyFrame = function(pName,pTime){
    if(this._actionFrames){
        if(!this._actionFrames[pName]){
            this._actionFrames[pName] = [];
        }
    }else{
        this._actionFrames = {};
        this._actionFrames[pName] = [];
    }
    var frames = this._actionFrames[pName];
	var len = frames.length;
	if(len > 0){
		for(var i=0; i<len ; ++i){
			if(frames[i].time > pTime){
				if(i>0){
					var newframe = HY.Game.Factory.cloneKeyFrame(frames[i-1]);
					newframe.time = pTime;
					newframe.tween = false;
					frames.splice(i,0,newframe);
				}else{
					var newframe = HY.Game.Factory.cloneKeyFrame(frames[i]);
					newframe.time = pTime;
					newframe.tween = false;
					frames.splice(i,0,newframe);
				}
				return;
			}else if(frames[i].time == pTime){
				return;
			}
		}
		var newframe = HY.Game.Factory.cloneKeyFrame(frames[i-1]);
		newframe.time = pTime;
		newframe.tween = false;
		frames.push(newframe);
		return;
	}else{
		var newframe = HY.Game.Factory.createDefaultKeyFrame();
		newframe.time = pTime;
		newframe.tween = false;
		newframe.spriteParam.x = this.getX();
		newframe.spriteParam.y = this.getY();
		newframe.spriteParam.width = this.getWidth();
		newframe.spriteParam.height = this.getHeight();
		newframe.spriteParam.anchorX = this.getAnchorX();
		newframe.spriteParam.anchorY = this.getAnchorY();
		newframe.spriteParam.rotateAngleZ = this.getRotateZ();
		newframe.spriteParam.alpha = this.getAlpha();
		newframe.spriteParam.texture = this.getTexture();
		frames.push(newframe);
		return;
	}
}
HY.Game.Unit.prototype.removeKeyFrame = function(pName,pTime){
	var frames = this.getActionFramesByName(pName);
    if(frames){
        var len = frames.length;
        for(var i=0;i<len;++i){
            if(frames[i].time == pTime){
                frames.splice(i,1);
                break;
            }
        }
    }
}
HY.Game.Unit.prototype.addTweenAtFrame = function(pName,pTime){
	var frames = this.getActionFramesByName(pName);
    if(frames){
        var len = frames.length;
        for(var i=0; i<len ; ++i){
            if(frames[i].time > pTime){
                if(i>0){
                    frames[i-1].tween = true;
                }
                break;
            }else if(frames[i].time == pTime){
                break;
            }
        }
    }
}
HY.Game.Unit.prototype.removeTweenAtFrame = function(pName,pTime){
	var frames = this.getActionFramesByName(pName);
    if(frames){
        var len = frames.length;
        for(var i=0; i<len ; ++i){
            if(frames[i].time > pTime){
                if(i>0){
                    frames[i-1].tween = false;
                }
                break;
            }else if(frames[i].time == pTime){
                break;
            }
        }
    }
}
HY.Game.Unit.prototype.runActionByName = function(pName,pClass){
    if(!(this._actions && this._actions[pName] && this._actions[pName].length > 0)){
        this.compileActionByName(pName,0);
    }
    var curactions = this._actions[pName];
	if(curactions){
		for(var i =curactions.length-1;i>=0;--i){
            if(pClass != undefined){ curactions[i].setClass(pClass); }
			this.runAction(curactions[i],HY.Core.Action.DELMode.DELNONE,true);
		}
	}
    var childUnits = this.getChildUnits();
    for(var i = childUnits.length-1;i>=0;--i){
        childUnits[i].runActionByName(pName,pClass);
    }
}
HY.Game.Unit.prototype.runActionLoopByName = function(pName,pDuration,pClass){
    this.runActionByName(pName,pClass);
    var retaction = new HY.Core.Action.Schedule({
        repeat:1,
        class:pClass,
        delay:pDuration,
        target:this,
        param:{name:pName,duration:pDuration,class:pClass},
        selector:function(param){
            this.runActionLoopByName(param.name,param.duration,param.class);
        }
    });
    this.runAction(retaction,HY.Core.Action.DELMode.DELNONE,true);
}
HY.Game.Unit.prototype.compileActionByName = function(pName,pMinDuration){
    var actionframes = this.getActionFramesByName(pName);
    if(actionframes && actionframes.length > 0){
        if(!this._actions){
            this._actions = {};
        }
        if(!this._actions[pName]){
            this._actions[pName] = [];
        }

        var preframe = null,curframe = null;
        var curactions = this._actions[pName];
        curactions.splice(0,curactions.length);
        var len = actionframes.length;
        for(var i=0;i<len;++i){
            curframe = actionframes[i];
            if(preframe == null || !preframe.tween){
                var actionStart = new HY.Core.Action.Schedule({
                    delay:curframe.time,
                    selector:function(pParam){
                        this.setX(pParam.x);
                        this.setY(pParam.y);
                        this.setWidth(pParam.width);
                        this.setHeight(pParam.height);
                        this.setAnchorX(pParam.anchorX);
                        this.setAnchorY(pParam.anchorY);
                        this.setRotateZ(pParam.rotateAngleZ);
                        this.setAlpha(pParam.alpha);
                        this.setTexture(pParam.texture);
                    },
                    target:this,
                    param:curframe.spriteParam,
                    repeat:1
                });
                curactions.push(actionStart);
            }else{
                var deltatime = curframe.time - preframe.time;
                if(preframe.spriteParam.x != curframe.spriteParam.x || preframe.spriteParam.y != curframe.spriteParam.y){
                    var actionmoveto = new HY.Core.Action.MoveTo({
                        delay:preframe.time,
                        targetX:curframe.spriteParam.x,
                        targetY:curframe.spriteParam.y,
                        duration:deltatime
                    });
                    curactions.push(actionmoveto);
                }
                if(preframe.spriteParam.width != curframe.spriteParam.width || preframe.spriteParam.height != curframe.spriteParam.height){
                    var actionscaleto = new HY.Core.Action.ScaleTo({
                        delay:preframe.time,
                        targetWidth:curframe.spriteParam.width,
                        targetHeight:curframe.spriteParam.height,
                        duration:deltatime
                    });
                    curactions.push(actionscaleto);
                }
                if(preframe.spriteParam.anchorX != curframe.spriteParam.anchorX || preframe.spriteParam.anchorY != curframe.spriteParam.anchorY){
                    var actionanchormoveto = new HY.Core.Action.AnchorMoveTo({
                        delay:preframe.time,													//继承自HY.Core.Action.Base
                        targetX:curframe.spriteParam.anchorX,
                        targetY:curframe.spriteParam.anchorY,
                        duration:deltatime
                    });
                    curactions.push(actionanchormoveto);
                }
                if(preframe.spriteParam.rotateAngleZ != curframe.spriteParam.rotateAngleZ){
                    var actionrotateto = new HY.Core.Action.RotateTo({
                        delay:preframe.time,												//继承自 HY.Core.Action.Base
                        targetAngle:curframe.spriteParam.rotateAngleZ,
                        duration:deltatime
                    });
                    curactions.push(actionrotateto);
                }
                if(preframe.spriteParam.alpha != curframe.spriteParam.alpha){
                    var actionfadeto = new HY.Core.Action.FadeTo({
                        delay:preframe.time,
                        targetAlpha:curframe.spriteParam.alpha,
                        duration:deltatime
                    });
                    curactions.push(actionfadeto);
                }
                if(curframe.spriteParam.texture) {
                    if (!preframe.spriteParam.texture) {
                        var actionschedule = new HY.Core.Action.Schedule({
                            delay: preframe.time,
                            selector: function (pParam) {
                                this.setTexture(pParam.texture);
                            },
                            target: this,
                            param: curframe.spriteParam,
                            repeat: 1
                        });
                        curactions.push(actionschedule);
                    } else {
                        if (preframe.spriteParam.texture.src != curframe.spriteParam.texture.src ||
                            preframe.spriteParam.texture.srcX != curframe.spriteParam.texture.srcX ||
                            preframe.spriteParam.texture.srcY != curframe.spriteParam.texture.srcY ||
                            preframe.spriteParam.texture.srcWidth != curframe.spriteParam.texture.srcWidth ||
                            preframe.spriteParam.texture.srcHeight != curframe.spriteParam.texture.srcHeight) {
                            var actionschedule = new HY.Core.Action.Schedule({
                                delay: preframe.time,
                                selector: function (pParam) {
                                    this.setTexture(pParam.texture);
                                },
                                target: this,
                                param: curframe.spriteParam,
                                repeat: 1
                            });
                            curactions.push(actionschedule);
                        }
                    }
                }
            }
            preframe = curframe;
        }
    }
}
HY.Game.Unit.prototype.getChildUnits = function(){
	return this._childUnits;
}
HY.Game.Unit.prototype.getChildUnitIndex = function(pUnit){
	for(var i = this._childUnits.length-1; i>=0;--i){
		if(this._childUnits[i] == pUnit){
			return i;
		}
	}
	return -1;
}
HY.Game.Unit.prototype.addChildUnit = function(pUnit){
    this._childUnits.push(pUnit);
	this.addChildNodeAtLayer(pUnit,0);
}
HY.Game.Unit.prototype.addChildUnitAt = function(pUnit,pIndex){
	if(pIndex < this._childUnits.length){
		var preunit = this._childUnits[pIndex];
        var nodeindex = this.getChildNodeIndexAtLayer(preunit);
		this.addChildNodeAtLayersIndex(pUnit,0,nodeindex);
		this._childUnits.splice(pIndex,0,pUnit);
	}else{
		this.addChildUnit(pUnit);
	}
}
HY.Game.Unit.prototype.removeChildUnit = function(pUnit){
    var len = this._childUnits.length;
    for(var i = this._childUnits.length-1;i>=0;--i){
        if(this._childUnits[i] == pUnit){
            this._childUnits.splice(i,1);
        }
    }
    this.removeChildNodeAtLayer(pUnit,0);
}
HY.Game.Unit.prototype.removeChildUnitAt = function(pIndex){
	if(pIndex < this._childUnits.length){
		var delunit = this._childUnits[pIndex];
        this.removeChildNode(delunit);
	}
}
HY.Game.Unit.prototype.adjustToFrame = function(pName,pFrame,pAdjustChild){
	var keyframes = this.getActionFramesByName(pName);
    if(keyframes) {
        var len = keyframes.length;
        var time = pFrame/10;
        var texture = null;
        var i;
        for(i = 0; i<len ; ++i){
            if(keyframes[i].time > time){
                break;
            }
            if(keyframes[i].spriteParam.texture){
                texture = keyframes[i].spriteParam.texture;
            }
        }
        if(i>0){
            var preframe = keyframes[i-1];
            if(i<len && preframe.tween){
                var nextframe = keyframes[i];
                var progress = (time-preframe.time)/(nextframe.time-preframe.time);
                this.setX(preframe.spriteParam.x+(nextframe.spriteParam.x-preframe.spriteParam.x)*progress);
                this.setY(preframe.spriteParam.y+(nextframe.spriteParam.y-preframe.spriteParam.y)*progress);
                this.setWidth(preframe.spriteParam.width+(nextframe.spriteParam.width-preframe.spriteParam.width)*progress);
                this.setHeight(preframe.spriteParam.height+(nextframe.spriteParam.height-preframe.spriteParam.height)*progress);
                this.setAnchorX(preframe.spriteParam.anchorX+(nextframe.spriteParam.anchorX-preframe.spriteParam.anchorX)*progress);
                this.setAnchorY(preframe.spriteParam.anchorY+(nextframe.spriteParam.anchorY-preframe.spriteParam.anchorY)*progress);
                this.setRotateZ(preframe.spriteParam.rotateAngleZ+(nextframe.spriteParam.rotateAngleZ-preframe.spriteParam.rotateAngleZ)*progress);
                //this.setAlpha(preframe.spriteParam.alpha+(nextframe.spriteParam.alpha-preframe.spriteParam.alpha)*progress);
                this.setTexture(texture);
            }else{
                this.setX(preframe.spriteParam.x);
                this.setY(preframe.spriteParam.y);
                this.setWidth(preframe.spriteParam.width);
                this.setHeight(preframe.spriteParam.height);
                this.setAnchorX(preframe.spriteParam.anchorX);
                this.setAnchorY(preframe.spriteParam.anchorY);
                this.setRotateZ(preframe.spriteParam.rotateAngleZ);
                //this.setAlpha(preframe.spriteParam.alpha);
                this.setTexture(texture);
            }
        }
    }
    if(pAdjustChild){
        var childunits = this.getChildUnits();
        len = childunits.length;
        for(i=0;i<len;++i){
            childunits[i].adjustToFrame(pName,pFrame,pAdjustChild);
        }
    }
}
HY.Game.Unit.prototype.onPaint = function(pRc,pRect,isCacheRc){
    if(this._texture != null){
        var app = this.getApplication();
        var image = app.getResourceManager().getImage(this._texture.src,null,null,null);
        if(image != null){
            try{
                if(this._texture.srcWidth <= 0){ this._texture.srcWidth = image.width;}
                if(this._texture.srcHeight <= 0){ this._texture.srcHeight = image.height; }
                pRc.drawImageExt(image,this._texture.srcX,this._texture.srcY,this._texture.srcWidth,this._texture.srcHeight,-this._anchorPixelX,-this._anchorPixelY,this.getWidth(),this.getHeight());
            }catch (err){}
        }
    }
    this.superCall("onPaint",[pRc,pRect,isCacheRc]);
}
HY.Game.Unit.prototype.onEnterCollided = function(pObject){
    this.launchEvent("entercollided",[this,pObject]);
}
HY.Game.Unit.prototype.onOutCollided = function(pObject){
    this.launchEvent("endcollided",[this,pObject]);
}