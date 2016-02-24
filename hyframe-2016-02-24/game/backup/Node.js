/*
 */
HY.Game.Node = function(config){
    this.init(config);
}
HY.Game.Node.prototype = new HY.Core.Node();
HY.Game.Node.prototype.defaultAnchorX = 0.5;
HY.Game.Node.prototype.defaultAnchorY = 0.5;
HY.Game.Node.prototype.defaultClipBound = false;
HY.Game.Node.prototype.defaultDragEnable = false;
HY.Game.Node.prototype.defaultResizeEnable = false;
HY.Game.Node.prototype.defaultDragZone = {x:-1000000,y:-1000000,width:2000000,height:2000000};
HY.Game.Node.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.dragZone != undefined){ this._dragZone = new HY.Rect2D(config.dragZone); } else { this._dragZone = new HY.Rect2D(this.defaultDragZone); }
    if(config.dragLimitZone != undefined){ this._dragLimitZone = config.dragLimitZone; } else { this._dragLimitZone = null; }
    this.__dragStartCanvasPoint = null;
    this.__dragStartPosition = null;
    this.__resizeStartCanvasPoint = null;
    this.__resizeStartPosition  = null;
    this.__resizeStartSize = null;
    this.__resizeDirection = 0;
    this.__rotateStartAngle = 0;
    this.__rotateStartCanvasAngle = 0;
    this.__accumlateTime = 0;
}
HY.Game.Node.prototype.getDragZone = function(){
    return this._dragZone;
}
HY.Game.Node.prototype.setDragZone = function(pZone) {
    this._dragZone = pZone;
}
HY.Game.Node.prototype.getDragLimitZone = function(){
    return this._dragLimitZone;
}
HY.Game.Node.prototype.setDragLimitZone = function(pZone){
    this._dragLimitZone = pZone;
}
HY.Game.Node.prototype.resetAccumulateTime = function(){
    this.__accumlateTime = 0;
}
HY.Game.Node.prototype.getAccumulateTime = function(){
    return this.__accumlateTime;
}
HY.Game.Node.prototype.onStartDrag = function(pEvent){
    this.superCall("onStartDrag",[pEvent]);
    this.__dragStartCanvasPoint = new HY.Vect2D({x:pEvent.offsetX,y:pEvent.offsetY});
    this.__dragStartPosition = new HY.Vect2D({x:this.getX(), y:this.getY()});
}
HY.Game.Node.prototype.onStartResize = function(pEvent){
    this.superCall("onStartResize",[pEvent]);
    this.__resizeStartCanvasPoint = new HY.Vect2D({x:pEvent.offsetX,y:pEvent.offsetY});
    this.__resizeStartPosition = new HY.Vect2D({x:this.getX(), y:this.getY()});
    this.__resizeStartSize = new HY.Size2D({width:this.getWidth(), height:this.getHeight()});
}
HY.Game.Node.prototype.onStartRotate = function(pEvent){
    this.superCall("onStartRotate",[pEvent]);
    var anchorInCanvas = this.transPointToCanvas(new HY.Vect2D({x:0,y:0}));
    var vectorInCanvas = new HY.Vect2D({x:pEvent.offsetX-anchorInCanvas.x, y:pEvent.offsetY-anchorInCanvas.y});
    this.__rotateStartAngle = this.getRotateZ();
    this.__rotateStartCanvasAngle = vectorInCanvas.getAngle();
}
HY.Game.Node.prototype.onPaint = function(pRc,pRect,pCacheRc){
    this.superCall("onPaint",[pRc,pRect,pCacheRc]);
    var maxx = this.getWidth()-this._anchorPixelX;
    var maxy = this.getHeight()-this._anchorPixelY;
    if(this._resizeEnable){
        var resizeIcon = new Image();
        resizeIcon.src = HY.ImageData.resizeIcon;
        pRc.drawImage(resizeIcon,-this._anchorPixelX,-this._anchorPixelY);
        pRc.drawImage(resizeIcon,maxx-10,maxy-10);
    }
    if(this._rotateEnable){
        var rotateIcon = new Image();
        rotateIcon.src = HY.ImageData.rotateIcon;
        pRc.drawImage(rotateIcon,-this._anchorPixelX,maxy-10);
        pRc.drawImage(rotateIcon,maxx-10,-this._anchorPixelY);
    }
}
HY.Game.Node.prototype._dispatchRotateEvent = function(pEvent){
    var posInCanvas = this.transPointToCanvas(new HY.Vect2D({x:0,y:0}));
    var vect2dInCanvas = new HY.Vect2D({x:pEvent.offsetX-posInCanvas.x,y:pEvent.offsetY-posInCanvas.y});
    var newAngle = this.__rotateStartAngle+vect2dInCanvas.getAngle()-this.__rotateStartCanvasAngle;
    this.setRotateZ(newAngle);
    this.onRotate(pEvent);
}
HY.Game.Node.prototype._dispatchResizeEvent = function(pEvent){
    var curCanvasOffset = new HY.Vect2D({x:pEvent.offsetX,y:pEvent.offsetY});
    var offsetVectAtCanvas = new HY.Vect2D({});
    var offsetVectAtThis = new HY.Vect2D({});
    var scaleX,scaleY;
    var newSize = new HY.Size2D({});
    offsetVectAtCanvas.x = curCanvasOffset.x - this.__resizeStartCanvasPoint.x;
    offsetVectAtCanvas.y = curCanvasOffset.y - this.__resizeStartCanvasPoint.y;
    offsetVectAtThis = this.transVectorFromCanvas(offsetVectAtCanvas);
    switch (this.__resizeDirection){
        case HY.Game.RESIZENORTHWEST:{
            var leftTop = new HY.Vect2D({});
            leftTop.x = -this.getAnchorX()*this.__resizeStartSize.width;
            leftTop.y = -this.getAnchorY()*this.__resizeStartSize.height;
            scaleX = (leftTop.x+offsetVectAtThis.x)*1.0/leftTop.x;
            scaleY = (leftTop.y+offsetVectAtThis.y)*1.0/leftTop.y;
            break;
        }
        //case HY.Game.RESIZENORTHEAST:{
        //    var rightTop = new HY.Vect2D({});
        //    rightTop.x = (1-this.getAnchorX())*this.__resizeStartSize.width;
        //    rightTop.y = -this.getAnchorY()*this.__resizeStartSize.height;
        //    scaleX = (rightTop.x+offsetVectAtThis.x)*1.0/rightTop.x;
        //    scaleY = (rightTop.y+offsetVectAtThis.y)*1.0/rightTop.y;
        //    break;
        //}
        case HY.Game.RESIZESOUTHEAST:{
            var rightBottom = new HY.Vect2D({});
            rightBottom.x = (1-this.getAnchorX())*this.__resizeStartSize.width;
            rightBottom.y = (1-this.getAnchorY())*this.__resizeStartSize.height;
            scaleX = (rightBottom.x+offsetVectAtThis.x)*1.0/rightBottom.x;
            scaleY = (rightBottom.y+offsetVectAtThis.y)*1.0/rightBottom.y;
            break;
        }
        //case HY.Game.RESIZESOUTHWEST:{
        //    var leftBottom = new HY.Vect2D({});
        //    leftBottom.x = -this.getAnchorX()*this.__resizeStartSize.width;
        //    leftBottom.y = (1-this.getAnchorY())*this.__resizeStartSize.height;
        //    scaleX = (leftBottom.x+offsetVectAtThis.x)*1.0/leftBottom.x;
        //    scaleY = (leftBottom.y+offsetVectAtThis.y)*1.0/leftBottom.y;
        //    break;
        //}
        default :{
            break;
        }
    }
    newSize.width = this.__resizeStartSize.width*scaleX;
    newSize.height = this.__resizeStartSize.height*scaleY;
    if(newSize.width > 10){
        this.setWidth(newSize.width);
    }else{
        this.setWidth(10);
    }
    if(newSize.height > 10){
        this.setHeight(newSize.height);
    }else{
        this.setHeight(10);
    }
    this.onResize(pEvent);
}
HY.Game.Node.prototype._dispatchDragEvent = function(pEvent){
    var curCanvasOffset = new HY.Vect2D({x:pEvent.offsetX,y:pEvent.offsetY});
    var parent = this.getParent();
    var offsetVect = new HY.Vect2D({});
    var newPosition = new HY.Vect2D({});
    if(parent == null){
        offsetVect.x = curCanvasOffset.x - this.__dragStartCanvasPoint.x;
        offsetVect.y = curCanvasOffset.y - this.__dragStartCanvasPoint.y;
        newPosition.x = this.__dragStartPosition.x + offsetVect.x;
        newPosition.y = this.__dragStartPosition.y + offsetVect.y;
    }else{
        var curCanvasInParent = parent.transPointFromCanvas(curCanvasOffset);
        var startCanvasInParent = parent.transPointFromCanvas(this.__dragStartCanvasPoint);
        offsetVect.x = curCanvasInParent.x - startCanvasInParent.x;
        offsetVect.y = curCanvasInParent.y - startCanvasInParent.y;
        newPosition.x = this.__dragStartPosition.x + offsetVect.x;
        newPosition.y = this.__dragStartPosition.y + offsetVect.y;
    }
    if(this._dragLimitZone){
        if(this._dragLimitZone.type == 1){
            if(newPosition.x < this._dragLimitZone.x){
                newPosition.x = this._dragLimitZone.x;
            }else if(newPosition.x > this._dragLimitZone.x+this._dragLimitZone.width){
                newPosition.x = this._dragLimitZone.x + this._dragLimitZone.width;
            }
            if(newPosition.y < this._dragLimitZone.y){
                newPosition.y = this._dragLimitZone.y;
            }else if(newPosition.y > this._dragLimitZone.y + this._dragLimitZone.height){
                newPosition.y = this._dragLimitZone.y + this._dragLimitZone.height;
            }
            this.setX(newPosition.x);
            this.setY(newPosition.y);
        }else if(this._dragLimitZone.type == 2){
            var deltaVect = new HY.Vect2D({x:newPosition.x-this._dragLimitZone.x,y:newPosition.y - this._dragLimitZone.y});
            if(deltaVect.moldSquare() > this._dragLimitZone.radius*this._dragLimitZone.radius){
                deltaVect.normalize();
                newPosition.x = this._dragLimitZone.x + deltaVect.x * this._dragLimitZone.radius;
                newPosition.y = this._dragLimitZone.y + deltaVect.y * this._dragLimitZone.radius;
            }
            this.setX(newPosition.x);
            this.setY(newPosition.y);
        }else{
            this.setX(newPosition.x);
            this.setY(newPosition.y);
        }
    }else{
        this.setX(newPosition.x);
        this.setY(newPosition.y);
    }
    this.onDrag(pEvent);
}
HY.Game.Node.prototype._dispatchMouseDownEvent = function(pEvent){
    if(this._visible){
        var app = this.getApplication();
        var epointincom = this.transPointFromCanvas(new HY.Vect2D({x:pEvent.offsetX,y:pEvent.offsetY}));
        var lefttop = new HY.Vect2D({});
        lefttop.x = -this._anchorPixelX;
        lefttop.y = -this._anchorPixelY;
        var rightbottom = new HY.Vect2D({});
        rightbottom.x = this._width - this._anchorPixelX;
        rightbottom.y = this._height - this._anchorPixelY;
        if(this._clipBound){
            if(epointincom.x >= lefttop.x && epointincom.x <= rightbottom.x  && epointincom.y >= lefttop.y && epointincom.y <= rightbottom.y){
                if(this._mouseEnable){
                    if(this.getDragEnable()){
                        app.setWaitDragElement(this,pEvent);
                    }
                }
                var layers = this.getLayers();
                var i = layers.length-1;
                for(;i>=0;--i){
                    var layer = layers[i];
                    if(layer){
                        var j = layer.length-1;
                        for(;j>=0;--j){
                            if(layer[j]._dispatchMouseDownEvent(pEvent)){
                                return true;
                            }
                        }
                    }
                }
                if(this._mouseEnable){
                    this.onMouseDown(pEvent);
                    /*drag and resize event*/
                    if(this._rotateEnable){
                        if((epointincom.x >= rightbottom.x-10 && epointincom.y <= lefttop.y+10) || (epointincom.x >= rightbottom.x-10 && epointincom.y <= lefttop.y+10)){
                            this.onStartRotate(pEvent);
                        }
                    }
                    if(this._resizeEnable && !this.isRotating()){
                        if(epointincom.x <= lefttop.x+10 && epointincom.y <= lefttop.y+10){
                            this.__resizeDirection = HY.Game.RESIZENORTHWEST;
                            this.onStartResize(pEvent);
                        }else if(epointincom.x >= rightbottom.x-10 && epointincom.y >= rightbottom.y-10){
                            this.__resizeDirection = HY.Game.RESIZESOUTHEAST;
                            this.onStartResize(pEvent);
                        }
                    }
                    if(this._dragEnable && !this.isRotating() && !this.isResizing()){
                        if(epointincom.x >= this._dragZone.x && epointincom.x <= this._dragZone.x + this._dragZone.width
                            && epointincom.y >= this._dragZone.y && epointincom.y <= this._dragZone.y + this._dragZone.height){
                            this.onStartDrag(pEvent);
                        }
                    }
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            var flag = false;
            if(this._mouseEnable){
                if(epointincom.x > lefttop.x && epointincom.x < rightbottom.x  && epointincom.y > lefttop.y && epointincom.y < rightbottom.y){
                    flag = true;
                    if(this.getDragEnable()){
                        app.setWaitDragElement(this,pEvent);
                    }
                }
            }
            var layers = this.getLayers();
            var i = layers.length-1;
            for(;i>=0;--i){
                var layer = layers[i];
                if(layer){
                    var j = layer.length-1;
                    for(;j>=0;--j){
                        if(layer[j]._dispatchMouseDownEvent(pEvent)){
                            return true;
                        }
                    }
                }
            }
            if(flag){
                this.onMouseDown(pEvent);
                if(this._rotateEnable){
                    if((epointincom.x >= rightbottom.x-10 && epointincom.y <= lefttop.y+10) || (epointincom.x <= lefttop.x+10 && epointincom.y >= rightbottom.y-10)){
                        this.onStartRotate(pEvent);
                    }
                }
                if(this._resizeEnable && !this.isRotating()){
                    if(epointincom.x <= lefttop.x+10 && epointincom.y <= lefttop.y+10){
                        this.__resizeDirection = HY.Game.RESIZENORTHWEST;
                        this.onStartResize();
                    }else if(epointincom.x >= rightbottom.x-10 && epointincom.y >= rightbottom.y-10){
                        this.__resizeDirection = HY.Game.RESIZESOUTHEAST;
                        this.onStartResize();
                    }
                }
                if(this._dragEnable && !this.isRotating() && !this.isResizing()){
                    if(epointincom.x >= this._dragZone.x && epointincom.x <= this._dragZone.x + this._dragZone.width
                        && epointincom.y >= this._dragZone.y && epointincom.y <= this._dragZone.y + this._dragZone.height){
                        this.onStartDrag(pEvent);
                    }
                }
                return true;
            }
        }
    }else{
        return false;
    }
}
HY.Game.Node.prototype._dispatchMouseMoveEvent = function(pEvent){
    if(this._visible){
        var app = this.getApplication();
        var epointincom = this.transPointFromCanvas(new HY.Vect2D({x:pEvent.offsetX,y:pEvent.offsetY}));
        var lefttop = new HY.Vect2D({});
        lefttop.x = -this._anchorPixelX;
        lefttop.y = -this._anchorPixelY;
        var rightbottom = new HY.Vect2D({});
        rightbottom.x = this._width - this._anchorPixelX;
        rightbottom.y = this._height - this._anchorPixelY;
        if(this._clipBound){
            if(epointincom.x >= lefttop.x && epointincom.x <= rightbottom.x  && epointincom.y >= lefttop.y && epointincom.y <= rightbottom.y){
                if(this._mouseEnable){
                    if(this.getScrollEnable()){
                        app.setWaitScrollElement(this,pEvent);
                    }
                }
                var layers = this.getLayers();
                var i = layers.length-1;
                for(;i>=0;--i){
                    var layer = layers[i];
                    if(layer){
                        var j = layer.length-1;
                        for(;j>=0;--j){
                            if(layer[j]._dispatchMouseMoveEvent(pEvent)){
                                return true;
                            }
                        }
                    }
                }
                if(this._mouseEnable){
                    app.setMouseOverElement(this,pEvent);
                    this.onMouseMove(pEvent);
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            var flag = false;
            if(this._mouseEnable){
                if(epointincom.x >= lefttop.x && epointincom.x <= rightbottom.x  && epointincom.y >= lefttop.y && epointincom.y <= rightbottom.y){
                    flag = true;
                    if(this.getScrollEnable()){
                        app.setWaitScrollElement(this,pEvent);
                    }
                }
            }
            var layers = this.getLayers();
            var i = layers.length-1;
            for(;i>=0;--i){
                var layer = layers[i];
                if(layer){
                    var j = layer.length-1;
                    for(;j>=0;--j){
                        if(layer[j]._dispatchMouseMoveEvent(pEvent)){
                            return true;
                        }
                    }
                }
            }
            if(flag){
                app.setMouseOverElement(this,pEvent);
                this.onMouseMove(pEvent);
                return true;
            }else{
                return false;
            }
        }
    }else{
        return false;
    }
}