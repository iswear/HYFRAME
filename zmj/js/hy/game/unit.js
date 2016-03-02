var hy = hy || {};
hy.game = hy.game || {};
hy.game.Unit = hy.extend(hy.RichNode);
hy.game.Unit.prototype.defaultAnchorX = 0.5;
hy.game.Unit.prototype.defaultAnchorY = 0.5;
hy.game.Unit.prototype.defaultName = "unit";
hy.game.Unit.prototype.init = function(config){
    this.superCall("init",[config]);
    this._name = this.isUndefined(config.name) ? this.defaultName : config.name;
    this._image = this.isUndefined(config.image) ? null : config.image;
    this._mirror = this.isUndefined(config.mirror) ? hy.game.MIRROR_NONE : config.mirror;
    this._actionFrames = this.isUndefined(config.actionFrames) ? {} : config.actionFrames;
    this._childUnits = [];
    this.__compiledActions = {};
    this.addObserver(this.notifyPaint, this, this._paintUnitImg);
}
hy.game.Unit.prototype.setName = function(name){
    this._name = name;
}
hy.game.Unit.prototype.getName = function(){
    return this._name;
}
hy.game.Unit.prototype.setImage = function(image){
    if(this._image != image){
        this._image = image;
        this.refresh();
    }
}
hy.game.Unit.prototype.getImage = function(){
    return this._image;
}
hy.game.Unit.prototype.setActionFrames = function(actionFrames){
    this._actionFrames = actionFrames;
}
hy.game.Unit.prototype.getActionFrames = function(){
    return this._actionFrames;
}
hy.game.Unit.prototype.setActionFramesOfName = function(name, frames){
    if(!this._actionFrames){
        this._actionFrames = {};
    }
    this._actionFrames[name] = frames;
}
hy.game.Unit.prototype.getActionFramesOfName = function(name){
    if(this._actionFrames){
        return this._actionFrames[name];
    }else{
        return null;
    }
}
hy.game.Unit.prototype.addChildUnit = function(unit){
    this._childUnits.push(unit);
    this.addChildNodeAtLayer(unit,0);
}
hy.game.Unit.prototype.addChildUnitAtIndex = function(unit,index){
    if(index < this._childUnits.length){
        var preunit = this._childUnits[index];
        var nodeindex = this.getChildNodeIndexAtLayer(preunit);
        this.addChildNodeAtLayersIndex(unit,0,nodeindex);
        this._childUnits.splice(index,0,unit);
    }else{
        this.addChildUnit(unit);
    }
}
hy.game.Unit.prototype.getChildUnits = function(){
    return this._childUnits;
}
hy.game.Unit.prototype.getChildUnitAtIndex = function(index){
    if(index < this._childUnits.length){
        return null;
    }
    return this._childUnits[index];
}

hy.game.Unit.prototype.removeChildUnit = function(unit,clean){
    for(var i = this._childUnits.length-1;i>=0;--i){
        if(this._childUnits[i] == unit){
            this._childUnits.splice(i,1);
        }
    }
    this.removeChildNode(unit,clean);
}
hy.game.Unit.prototype.removeChildUnitAtIndex = function(index,clean){
    if(index < this._childUnits.length){
        var delunit = this._childUnits[index];
        this._childUnits.splice(index,1);
        this.removeChildNode(delunit,clean);
    }
}
hy.game.Unit.prototype.runActionOfName = function(name, loop, target, selector, childrenrun){
    var action = this.__compiledActions[name];
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
hy.game.Unit.prototype.compileActionOfName = function(name){
    var frames = this.getActionFramesOfName(name);
    if(frames != null){
        var len = frames.length;
        var syncAcArr = [];
        for(var i=0;i<len;++i){
            var AsyncAcArr = [];
            var curframe = frames[i];
            if(i == 0){
                this._checkActionFrame(null,curframe);
                AsyncAcArr.push(new hy.action.Scheduler({
                    interval:curframe[hy.game.frame.param.TIME],
                    repeats:1,
                    target:this,
                    selector:this._runActionScheduler,
                    param:curframe
                }));
            }else{
                var preframe = frames[i-1];
                this._checkActionFrame(preframe,curframe);
                var deltaParam,deltaTime = curframe[hy.game.frame.param.TIME]-preframe[hy.game.frame.param.TIME];
                if(curframe[hy.game.frame.param.TWEEN] > 0){
                    if(curframe[hy.game.frame.param.X] != preframe[hy.game.frame.param.X]){
                        deltaParam = curframe[hy.game.frame.param.X]-preframe[hy.game.frame.param.X];
                        AsyncAcArr.push(new hy.action.MoveX({
                            targetOffset:deltaParam,
                            offsetFun:(deltaParam/deltaTime)+"*t"
                        }));
                    }
                    if(curframe[hy.game.frame.param.Y] != preframe[hy.game.frame.param.Y]){
                        deltaParam = curframe[hy.game.frame.param.Y]-preframe[hy.game.frame.param.Y];
                        AsyncAcArr.push(new hy.action.MoveY({
                            targetOffset:deltaParam,
                            offsetFun:(deltaParam/deltaTime)+"*t"
                        }));
                    }
                    if(curframe[hy.game.frame.param.WIDTH] != preframe[hy.game.frame.param.WIDTH]){
                        deltaParam = curframe[hy.game.frame.param.WIDTH]-preframe[hy.game.frame.param.WIDTH];
                        AsyncAcArr.push(new hy.action.ResizeWidth({
                            targetOffset:deltaParam,
                            offsetFun:(deltaParam/deltaTime)+"*t"
                        }));
                    }
                    if(curframe[hy.game.frame.param.HEIGHT] != preframe[hy.game.frame.param.HEIGHT]){
                        deltaParam = curframe[hy.game.frame.param.HEIGHT]-preframe[hy.game.frame.param.HEIGHT];
                        AsyncAcArr.push(new hy.action.ResizeHeight({
                            targetOffset:deltaParam,
                            offsetFun:(deltaParam/deltaTime)+"*t"
                        }));
                    }
                    if(curframe[hy.game.frame.param.SCALEX] != preframe[hy.game.frame.param.SCALEX]){
                        deltaParam = curframe[hy.game.frame.param.SCALEX]-preframe[hy.game.frame.param.SCALEX];
                        AsyncAcArr.push(new hy.action.ScaleX({
                            targetOffset:deltaParam,
                            offsetFun:(deltaParam/deltaTime)+"*t"
                        }));
                    }
                    if(curframe[hy.game.frame.param.SCALEY] != preframe[hy.game.frame.param.SCALEY]){
                        deltaParam = curframe[hy.game.frame.param.SCALEY]-preframe[hy.game.frame.param.SCALEY];
                        AsyncAcArr.push(new hy.action.ScaleY({
                            targetOffset:deltaParam,
                            offsetFun:(deltaParam/deltaTime)+"*t"
                        }));
                    }
                    if(curframe[hy.game.frame.param.ANCHORX] != preframe[hy.game.frame.param.ANCHORX]){
                        deltaParam = curframe[hy.game.frame.param.ANCHORX]-preframe[hy.game.frame.param.ANCHORX];
                        AsyncAcArr.push(new hy.action.MoveAnchorX({
                            targetOffset:deltaParam,
                            offsetFun:(deltaParam/deltaTime)+"*t"
                        }));
                    }
                    if(curframe[hy.action.MoveAnchorY] != preframe[hy.action.MoveAnchorY]){
                        deltaParam = curframe[hy.action.MoveAnchorY]-preframe[hy.action.MoveAnchorY];
                        AsyncAcArr.push(new hy.action.MoveAnchorY({
                            targetOffset:deltaParam,
                            offsetFun:(deltaParam/deltaTime)+"*t"
                        }));
                    }
                    if(curframe[hy.game.frame.param.ROTATEZ] != preframe[hy.game.frame.param.ROTATEZ]){
                        deltaParam = curframe[hy.game.frame.param.ROTATEZ]-preframe[hy.game.frame.param.ROTATEZ];
                        AsyncAcArr.push(new hy.action.RotateZ({
                            targetOffset:deltaParam,
                            offsetFun:(deltaParam/deltaTime)+"*t"
                        }));
                    }
                    if(curframe[hy.game.frame.param.ALPHA] != preframe[hy.game.frame.param.ALPHA]){
                        deltaParam = curframe[hy.game.frame.param.ALPHA]-preframe[hy.game.frame.param.ALPHA];
                        AsyncAcArr.push(new hy.action.Fade({
                            targetOffset:deltaParam,
                            offsetFun:(deltaParam/deltaTime)+"*t"
                        }));
                    }
                }else{
                    AsyncAcArr.push(new hy.action.Scheduler({
                        interval:deltaTime,
                        repeats:1,
                        target:this,
                        selector:this._runActionScheduler,
                        param:curframe
                    }));
                }
            }
            syncAcArr.push(new HY.Core.Action.AsyncList({actions:AsyncAcArr}))
        }
        var resultAction = new HY.Core.Action.SyncList({actions:syncAcArr});
        this.__compiledActions[name] = new HY.Core.Action.SyncList({actions:syncAcArr});
        return resultAction;
    }
}
hy.game.Unit.prototype._checkActionFrame = function(preframe, curframe){
    if(preframe != null){
        if(curframe[hy.game.frame.param.TWEEN] == undefined){
            curframe[hy.game.frame.param.TWEEN] = 0;
        }
        if(curframe[hy.game.frame.param.X] == undefined){
            curframe[hy.game.frame.param.X] = preframe[hy.game.frame.param.X];
        }
        if(curframe[hy.game.frame.param.Y] == undefined){
            curframe[hy.game.frame.param.Y] = preframe[hy.game.frame.param.Y];
        }
        if(curframe[hy.game.frame.param.WIDTH] == undefined){
            curframe[hy.game.frame.param.WIDTH] = preframe[hy.game.frame.param.WIDTH];
        }
        if(curframe[hy.game.frame.param.HEIGHT] == undefined){
            curframe[hy.game.frame.param.HEIGHT] = preframe[hy.game.frame.param.HEIGHT];
        }
        if(curframe[hy.game.frame.param.SCALEX] == undefined){
            curframe[hy.game.frame.param.SCALEX] = preframe[hy.game.frame.param.SCALEX];
        }
        if(curframe[hy.game.frame.param.SCALEY] == undefined){
            curframe[hy.game.frame.param.SCALEY] = preframe[hy.game.frame.param.SCALEY];
        }
        if(curframe[hy.game.frame.param.ANCHORX] == undefined){
            curframe[hy.game.frame.param.ANCHORX] = preframe[hy.game.frame.param.ANCHORX];
        }
        if(curframe[hy.game.frame.param.ANCHORY] == undefined){
            curframe[hy.game.frame.param.ANCHORY] = preframe[hy.game.frame.param.ANCHORY];
        }
        if(curframe[hy.game.frame.param.ROTATEZ] == undefined){
            curframe[hy.game.frame.param.ROTATEZ] = preframe[hy.game.frame.param.ROTATEZ];
        }
        if(curframe[hy.game.frame.param.ALPHA] == undefined){
            curframe[hy.game.frame.param.ALPHA] = preframe[hy.game.frame.param.ALPHA];
        }
    }else{
        if(curframe[hy.game.frame.param.TWEEN] == undefined){
            curframe[hy.game.frame.param.TWEEN] = 0;
        }
        if(curframe[hy.game.frame.param.X] == undefined){
            curframe[hy.game.frame.param.X] = this.getX();
        }
        if(curframe[hy.game.frame.param.Y] == undefined){
            curframe[hy.game.frame.param.Y] = this.getY();
        }
        if(curframe[hy.game.frame.param.WIDTH] == undefined){
            curframe[hy.game.frame.param.WIDTH] = this.getWidth();
        }
        if(curframe[hy.game.frame.param.HEIGHT] == undefined){
            curframe[hy.game.frame.param.HEIGHT] = this.getHeight();
        }
        if(curframe[hy.game.frame.param.SCALEX] == undefined){
            curframe[hy.game.frame.param.SCALEX] = this.getScaleX();
        }
        if(curframe[hy.game.frame.param.SCALEY] == undefined){
            curframe[hy.game.frame.param.SCALEY] = this.getScaleY();
        }
        if(curframe[hy.game.frame.param.ANCHORX] == undefined){
            curframe[hy.game.frame.param.ANCHORX] = this.getAnchorX();
        }
        if(curframe[hy.game.frame.param.ANCHORY] == undefined){
            curframe[hy.game.frame.param.ANCHORY] = this.getAnchorY();
        }
        if(curframe[hy.game.frame.param.ROTATEZ] == undefined){
            curframe[hy.game.frame.param.ROTATEZ] = this.getRotateZ();
        }
        if(curframe[hy.game.frame.param.ALPHA] == undefined){
            curframe[hy.game.frame.param.ALPHA] = this.getAlpha();
        }
    }
}
hy.game.Unit.prototype._runActionScheduler = function(frame){
    this.setX(frame[hy.game.frame.param.X]);
    this.setY(frame[hy.game.frame.param.Y]);
    this.setWidth(frame[hy.game.frame.param.WIDTH]);
    this.setHeight(frame[hy.game.frame.param.HEIGHT]);
    this.setScaleX(frame[hy.game.frame.param.SCALEX]);
    this.setScaleY(frame[hy.game.frame.param.SCALEY]);
    this.setAnchorX(frame[hy.game.frame.param.ANCHORX]);
    this.setAnchorY(frame[hy.game.frame.param.ANCHORY]);
    this.setRotateZ(frame[hy.game.frame.param.ROTATEZ]);
    this.setAlpha(frame[hy.game.frame.param.ALPHA]);
}
hy.game.Unit.prototype._paintUnitImg = function(sender, dc, rect){
    if(this._image) {
        var app = this.getApplication();
        if (app) {
            var loader = app.getFileLoader();
            if (typeof(this._image) == "string") {
                var image = loader.getImage(this._image);
                if (image) {
                    this._paintUnitImgSubFun(dc, rect, image, 0, 0, image.width, image.height);
                } else {
                    loader.loadImageAsync(this._image, this, this._loadUnitImgCB);
                }
            } else {
                var image = loader.getImage(this._image.URL);
                if (image) {
                    this._paintUnitImgSubFun(dc, rect, image, this._image.srcX, this._image.srcY, this._image.srcWidth, this._image.srcHeight);
                } else {
                    loader.loadImageAsync(this._image, this, this._loadUnitImgCB);
                }
            }
        }
    }else{
        dc.setFillStyle("#f00");
        dc.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
}
hy.game.Unit.prototype._paintUnitImgSubFun = function(dc, rect, image, srcX, srcY, srcWidth, srcHeight){
    switch (this._mirror){
        case hy.game.MIRROR_X:{
            dc.pushTransform(0, 0, -1, 1, 0, false);
            dc.drawImageExt(image,srcX,srcY,srcWidth,srcHeight,rect.x-rect.width,rect.y,rect.width,rect.height);
            dc.popTransform();
            break;
        }
        case hy.game.MIRROR_Y:{
            dc.pushTransform(0, 0, 1, -1, 0, false);
            dc.drawImageExt(image, srcX, srcY, srcWidth, srcHeight, rect.x, rect.y-rect.height, rect.width, rect.height);
            dc.popTransform();
            break;
        }
        case hy.game.MIRROR_BOTH:{
            dc.pushTransform(0, 0, -1, -1, 0, false);
            dc.drawImageExt(image, srcX, srcY, srcWidth, srcHeight, rect.x-rect.width, rect.y-rect.height, rect.width, rect.height);
            dc.popTransform();
            break;
        }
        default :{
            dc.drawImageExt(image, srcX, srcY, srcWidth, srcHeight, rect.x, rect.y, rect.width, rect.height);
            break;
        }
    }
}
hy.game.Unit.prototype._loadUnitImgCB = function(url,success){
    if(success){
        this.refresh();
    }
}

