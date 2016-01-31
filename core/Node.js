HY.Core.Node = function(config){
    this.init(config);
}
HY.Core.Node.prototype = new HY.Object();
HY.Core.Node.prototype.defaultX = 0;
HY.Core.Node.prototype.defaultY = 0;
HY.Core.Node.prototype.defaultWidth = 100;
HY.Core.Node.prototype.defaultHeight = 20;
HY.Core.Node.prototype.defaultAnchorX = 0;
HY.Core.Node.prototype.defaultAnchorY = 0;
HY.Core.Node.prototype.defaultAlpha = 1.0;
HY.Core.Node.prototype.defaultRotateZ = 0;
HY.Core.Node.prototype.defaultBorderWidth = 0;
HY.Core.Node.prototype.defaultBorderColor = null;
HY.Core.Node.prototype.defaultCornorRadius = 0;
HY.Core.Node.prototype.defaultBackgroundColor = null;
HY.Core.Node.prototype.defaultVisible = true;
HY.Core.Node.prototype.defaultClipBound = false;
HY.Core.Node.prototype.defaultCacheEnable = true;
HY.Core.Node.prototype.defaultCursor = null;
HY.Core.Node.prototype.defaultMouseEnable = true;
HY.Core.Node.prototype.defaultDragEnable = true;
HY.Core.Node.prototype.defaultScrollEnable = false;
HY.Core.Node.prototype.defaultRender = true;
HY.Core.Node.prototype.defaultDragZone = {x:-1000000,y:-1000000,width:2000000,height:2000000};
HY.Core.Node.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.x != undefined){ this._x = config.x; } else { this._x = this.defaultX; }
    if(config.y != undefined){ this._y = config.y; } else { this._y = this.defaultY; }
    if(config.width != undefined){ this._width = config.width; } else{ this._width = this.defaultWidth; }
    if(config.height != undefined){ this._height = config.height; } else { this._height = this.defaultHeight; }
    if(config.scaleX != undefined){ this._scaleX = config.scaleX; } else { this._scaleX = 1; }
    if(config.scaleY != undefined){ this._scaleY = config.scaleY; } else { this._scaleY = 1; }
    if(config.anchorX != undefined){ this._anchorX = config.anchorX; } else { this._anchorX = this.defaultAnchorX; }
    if(config.anchorY != undefined){ this._anchorY = config.anchorY; } else { this._anchorY = this.defaultAnchorY; }
    if(config.alpha != undefined){ this._alpha = config.alpha; } else { this._alpha = this.defaultAlpha; }
    if(config.rotateZ != undefined){ this._rotateZ = config.rotateZ; } else { this._rotateZ = this.defaultRotateZ; }

    if(config.borderWidth != undefined){ this._borderWidth = config.borderWidth; } else { this._borderWidth = this.defaultBorderWidth; }
    if(config.borderColor != undefined){ this._borderColor = config.borderColor; } else { this._borderColor = this.defaultBorderColor; }
    if(config.cornorRadius != undefined){ this._cornorRadius = config.cornorRadius; } else { this._cornorRadius = this.defaultCornorRadius; }
    if(config.backgroundColor != undefined){ this._backgroundColor = config.backgroundColor; } else { this._backgroundColor = this.defaultBackgroundColor; }
    if(config.visible != undefined){ this._visible = config.visible; } else { this._visible = this.defaultVisible; }
    if(config.clipBound != undefined){ this._clipBound = config.clipBound; } else { this._clipBound = this.defaultClipBound; }
    if(config.cacheEnable != undefined){ this._cacheEnable = config.cacheEnable; } else { this._cacheEnable = this.defaultCacheEnable; }
    if(config.dragZone != undefined){ this._dragZone = new HY.Rect2D(config.dragZone); } else { this._dragZone = new HY.Rect2D(this.defaultDragZone); }

    if(config.cursor != undefined){ this._cursor = config.cursor; } else { this._cursor = this.defaultCursor; }
    if(config.mouseEnable != undefined){ this._mouseEnable = config.mouseEnable; } else { this._mouseEnable = this.defaultMouseEnable; }
    if(config.dragEnable != undefined){ this._dragEnable = config.dragEnable; } else { this._dragEnable = this.defaultDragEnable; }
    if(config.scrollEnable != undefined){ this._scrollEnable = config.scrollEnable; } else { this._scrollEnable = this.defaultScrollEnable; }
    if(config.contextMenu != undefined){ this._contextMenu = config.contextMenu; } else { this._contextMenu = null; }

    if(config.finishLaunchEvent != undefined){ this.addEventListener("finishlaunch",config.finishLaunchEvent.selector,config.finishLaunchEvent.target); }
    if(config.canvasSizeChangeEvent != undefined){ this.addEventListener("canvassizechanged",config.canvasSizeChangeEvent.selector,config.canvasSizeChangeEvent.target); }
    if(config.firstShowEvent != undefined){ this.addEventListener("firstshow",config.firstShowEvent.selector,config.firstShowEvent.target); }
    if(config.enterFrameEvent != undefined){ this.addEventListener("enterframe",config.enterFrameEvent.selector,config.enterFrameEvent.target); }
    if(config.endFrameEvent != undefined){ this.addEventListener("endframe",config.endFrameEvent.selector,config.endFrameEvent.target); }

    if(config.clickEvent != undefined){ this.addEventListener("click",config.clickEvent.selector,config.clickEvent.target); }
    if(config.dblClickEvent != undefined){ this.addEventListener("dblclick",config.dblClickEvent.selector,config.dblClickEvent.target); }
    if(config.mouseDownEvent != undefined){ this.addEventListener("mousedown",config.mouseDownEvent.selector,config.mouseDownEvent.target); }
    if(config.mouseMoveEvent != undefined){ this.addEventListener("mousemove",config.mouseMoveEvent.selector,config.mouseMoveEvent.target); }
    if(config.mouseUpEvent != undefined){ this.addEventListener("mouseup",config.mouseUpEvent.selector,config.mouseUpEvent.target); }
    if(config.mouseWheelEvent != undefined){ this.addEventListener("mousewheel",config.mouseWheelEvent.selector,config.mouseWheelEvent.target); }
    if(config.mouseOverEvent != undefined){ this.addEventListener("mouseover",config.mouseOverEvent.selector,config.mouseOverEvent.target); }
    if(config.mouseOutEvent != undefined){ this.addEventListener("mouseout",config.mouseOutEvent.selector,config.mouseOutEvent.target); }
    if(config.keyDownEvent != undefined){ this.addEventListener("keydown",config.keyDownEvent.selector,config.keyDownEvent.target); }
    if(config.keyPressEvent != undefined){ this.addEventListener("keypress",config.keyPressEvent.selector,config.keyPressEvent.target); }
    if(config.keyUpEvent != undefined){ this.addEventListener("keyup",config.keyUpEvent.selector,config.keyUpEvent.target); }
    if(config.contextMenuEvent != undefined){ this.addEventListener("contextmenu",config.contextMenuEvent.selector,config.contextMenuEvent.target); }
    if(config.focusEvent != undefined){ this.addEventListener("focus",config.focusEvent.selector,config.focusEvent.target); }
    if(config.blurEvent != undefined){ this.addEventListener("blue",config.blurEvent.selector,config.blurEvent.target); }
    if(config.paintEvent != undefined){ this.addEventListener("paint",config.paintEvent.selector,config.paintEvent.target); }
    if(config.startDragEvent != undefined){ this.addEventListener("startdrag",config.startDragEvent.selector,config.startDragEvent.target); }
    if(config.dragEvent != undefined){ this.addEventListener("drag",config.dragEvent.selector,config.dragEvent.target); }
    if(config.endDragEvent != undefined){ this.addEventListener("enddrag",config.endDragEvent.selector,config.endDragEvent.target); }

    if(config.xChangedEvent != undefined){ this.addEventListener("xchanged",config.xChangedEvent.selector,config.xChangedEvent.target); }
    if(config.yChangedEvent != undefined){ this.addEventListener("ychanged",config.yChangedEvent.selector,config.yChangedEvent.target); }
    if(config.widthChangedEvent != undefined){ this.addEventListener("widthchanged",config.widthChangedEvent.selector,config.widthChangedEvent.target); }
    if(config.heightChangedEvent != undefined){ this.addEventListener("heightchanged",config.heightChangedEvent.selector,config.heightChangedEvent.target); }
    if(config.anchorXChangedEvent != undefined){ this.addEventListener("anchorxchanged",config.anchorXChangedEvent.selector,config.anchorXChangedEvent.target); }
    if(config.anchorYChangedEvent != undefined){ this.addEventListener("anchorychanged",config.anchorYChangedEvent.selector,config.anchorYChangedEvent.target); }
    if(config.angleChangedEvent != undefined){ this.addEventListener("anglechanged",config.angleChangedEvent.selector,config.angleChangedEvent.target); }
    if(config.alphaChangedEvent != undefined){ this.addEventListener("alphachanged",config.alphaChangedEvent.selector,config.alphaChangedEvent.target); }

    this._minLayoutWidth = 0;
    this._minLayoutHeight = 0;
    this._parent = null;
    this._application = null;

    this._sinAngleZ = 0;
    this._cosAngleZ = 0;

    this._anchorPixelX = 0;
    this._anchorPixelY = 0;
    this._userProperty = {};

    this._childNodeLayers = [];
    this._events = {};

    this._layoutflag = false;
    this._isFirstShow = true;
    this._cached = false;
    this._cacheContext = null;

    this.__dragStartCanvasPoint = null;//in this parent location
    this.__dragStartPosition = null;
    this.__isDraging  = false;
}
HY.Core.Node.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.needLayoutSubNodes();
    this._sinAngleZ = Math.sin(this._rotateZ);
    this._cosAngleZ = Math.cos(this._rotateZ);
    this._anchorPixelX = -Math.round(this._width * this._anchorX);
    this._anchorPixelY = -Math.round(this._height * this._anchorY);
    if(this._cacheEnable){
        this._cached = false;
        this._cacheContext = new HY.Core.RenderContext({width:this._width,height:this._height});
    }
}
HY.Core.Node.prototype.getX = function(){
    return this._x;
}
HY.Core.Node.prototype.setX = function(pX){
    if(pX != this._x){
        this._x = pX;
        this.onXChanged(this);
        this.reRender();
    }
}
HY.Core.Node.prototype.getY = function(){
    return this._y;
}
HY.Core.Node.prototype.setY = function(pY){
    if(pY != this._y){
        this._y = pY;
        this.onYChanged(this);
        this.reRender();
    }
}
HY.Core.Node.prototype.getWidth = function(){
    return this._width;
}
HY.Core.Node.prototype.setWidth = function(pWidth) {
    if(pWidth != this._width){
        if(this._cacheEnable){
            this._cacheContext.setWidth(pWidth);
        }
        this._width = pWidth;
        this._anchorPixelX = -Math.round(pWidth * this._anchorX);
        this.needLayoutSubNodes();
        this.onWidthChanged(this);
        this.updateCache();
        this.reRender();
    }
}
HY.Core.Node.prototype.getHeight = function(){
    return this._height;
}
HY.Core.Node.prototype.setHeight = function(pHeight){
    if(pHeight != this._height){
        if(this._cacheEnable){
            this._cacheContext.setHeight(pHeight);
        }
        this._height = pHeight;
        this._anchorPixelY = -Math.round(pHeight * this._anchorY);
        this.needLayoutSubNodes();
        this.onHeightChanged(this);
        this.updateCache();
        this.reRender();
    }
}
HY.Core.Node.prototype.getScaleX = function(){
    return this._scaleX;
}
HY.Core.Node.prototype.setScaleX = function(pScaleX){
    if(this._scaleX != pScaleX){
        this._scaleX = pScaleX;
        this.reRender();
    }
}
HY.Core.Node.prototype.getScaleY = function(){
    return this._scaleY;
}
HY.Core.Node.prototype.setScaleY = function(pScaleY){
    if(this._scaleY != pScaleY){
        this._scaleX = pScaleY;
        this.reRender();
    }
}
HY.Core.Node.prototype.getAnchorX = function () {
    return this._anchorX;
}
HY.Core.Node.prototype.setAnchorX = function(pX){
    if(this._anchorX != pX){
        this._anchorX = pX;
        this._anchorPixelX = -Math.round(pX * this._width);
        this.onAnchorXChanged(this);
        this.reRender();
    }
}
HY.Core.Node.prototype.getAnchorY = function () {
    return this._anchorY;
}
HY.Core.Node.prototype.setAnchorY = function(pY){
    if(this._anchorY != pY){
        this._anchorY = pY;
        this._anchorPixelY = -Math.round(pY * this._height);
        this.onAnchorYChanged(this);
        this.reRender();
    }
}
HY.Core.Node.prototype.getLeftTopCoor = function(){
    return new HY.Vect2D({x:this._anchorPixelX,y:this._anchorPixelY});
}
HY.Core.Node.prototype.getRightBottomCoor = function(){
    return new HY.Vect2D({x:this._width+this._anchorPixelX,y:this._height+this._anchorPixelY});
}
HY.Core.Node.prototype.getAlpha = function(){
    return this._alpha;
}
HY.Core.Node.prototype.setAlpha = function(pAlpha){
    if(pAlpha > 1){ pAlpha = 1; }else if(pAlpha < 0){ pAlpha = 0; }
    if(this._alpha != pAlpha){
        this._alpha = pAlpha;
        this.onAlphaChanged(this);
        this.reRender();
    }
}
HY.Core.Node.prototype.rotateZ = function(pAngle){
    this.setRotateZ(this.getRotateZ()+pAngle);
}
HY.Core.Node.prototype.getRotateZ = function(){
    return this._rotateZ;
}
HY.Core.Node.prototype.setRotateZ = function(pAngle){
    if(pAngle != this._rotateZ){
        this._rotateZ = pAngle;
        this._sinAngleZ = Math.sin(pAngle);
        this._cosAngleZ = Math.cos(pAngle);
        this.onAngleChanged(this);
        this.reRender();
    }
}
HY.Core.Node.prototype.getBorderWidth = function(){
    return this._borderWidth;
}
HY.Core.Node.prototype.setBorderWidth = function(pWidth){
    if(this._borderWidth != pWidth){
        this._borderWidth = pWidth;
        this.reRender();
    }
}
HY.Core.Node.prototype.getBorderColor = function(){
    return this._borderColor;
}
HY.Core.Node.prototype.setBorderColor = function(pColor){
    if(this._borderColor != pColor){
        this._borderColor = pColor;
        this.reRender();
    }
}
HY.Core.Node.prototype.getCornorRadius = function(){
    return this._cornorRadius;
}
HY.Core.Node.prototype.setCornorRadius = function(pRadius){
    if(this._cornorRadius != pRadius){
        this._cornorRadius = pRadius;
        this.reRender();
    }
}
HY.Core.Node.prototype.getBackgroundColor = function(){
    return this._backgroundColor;
}
HY.Core.Node.prototype.setBackgroundColor = function(pColor){
    if(this._backgroundColor != pColor){
        this._backgroundColor = pColor;
        this.reRender();
    }
}
HY.Core.Node.prototype.getVisible = function(){
    return this._visible;
}
HY.Core.Node.prototype.setVisible = function(visible){
    if(this._visible != visible){
        this._visible = visible;
        this.reRender();
    }
}
HY.Core.Node.prototype.getClipBound = function(){
    return this._clipBound;
}
HY.Core.Node.prototype.setClipBound = function(pClip){
    if(this._clipBound != pClip){
        this._clipBound = pClip;
        this.reRender();
    }
}
HY.Core.Node.prototype.getCacheEnable = function(){
    return this._cacheEnable;
}
HY.Core.Node.prototype.setCacheEnable = function(cacheEnable){
    if(this._cacheEnable != cacheEnable){
        if(cacheEnable){
            this._cached = false;
            this._cacheContext = new HY.Core.RenderContext({width:this._width,height:this._height});
        }else{
            this._cached = false;
            this._cacheContext = null;
        }
        this._cacheEnable = cacheEnable;
    }
}
HY.Core.Node.prototype.getCursor = function(){
    return this._cursor;
}
HY.Core.Node.prototype.setCursor = function(pCursor){
    this._cursor = pCursor;
}
HY.Core.Node.prototype.getMouseEnable = function(){
    return this._mouseEnable;
}
HY.Core.Node.prototype.setMouseEnable = function(mouseEnable){
    this._mouseEnable = mouseEnable;
}
HY.Core.Node.prototype.getDragEnable = function(){
    return this._dragEnable;
}
HY.Core.Node.prototype.setDragEnable = function(pDrag){
    this._dragEnable = pDrag;
}
HY.Core.Node.prototype.getDragZone = function(){
    return this._dragZone;
}
HY.Core.Node.prototype.setDragZone = function(pZone){
    this._dragZone = pZone;
}
HY.Core.Node.prototype.getScrollEnable = function(){
    return this._scrollEnable;
}
HY.Core.Node.prototype.setScrollEnable = function(scrollEnable){
    this._scrollEnable = scrollEnable;
}
HY.Core.Node.prototype.getContextMenu = function(){
    return this._contextMenu;
}
HY.Core.Node.prototype.setContextMenu = function(pContextmenu){
    this._contextMenu = pContextmenu;
}
HY.Core.Node.prototype.setApplication = function(pApp){
    this._application = pApp;
}
HY.Core.Node.prototype.getApplication = function(){
    if(this._application == null){
        var parent = this._parent;
        if(parent == null){
            return null;
        }else{
            return parent.getApplication();
        }
    }else{
        return this._application;
    }
}
HY.Core.Node.prototype.getParent = function(){
    return this._parent;
}
HY.Core.Node.prototype.setParent = function(pNode){
    this._parent = pNode;
}
HY.Core.Node.prototype.getLayers = function(){
    return this._childNodeLayers;
}
HY.Core.Node.prototype.getLayerAtIndex = function(pIndex){
    if(pIndex < this._childNodeLayers.length){
        return this._childNodeLayers[pIndex];
    }else{
        return null;
    }
}
HY.Core.Node.prototype.getChildNodesAtLayer = function(pLayer){
    if(pLayer < this._childNodeLayers.length){
        return this._childNodeLayers[pLayer];
    }else{
        return null;
    }
}
HY.Core.Node.prototype.getChildNodeLocation = function(pNode){
    for(var i=this._childNodeLayers.length-1;i>=0;--i){
        var curlayer = this._childNodeLayers[i];
        if(curlayer){
            for(var j=curlayer.length-1;j>=0;--j){
                var curnode = curlayer[j];
                if(curnode == pNode){
                    return {layer:i-1,index:j-1};
                }
            }
        }
    }
    return {layer:-1,index:-1};
}
HY.Core.Node.prototype.getChildNodeIndexAtLayer = function(pNode,pLayer){
    if(this._childNodeLayers){
        if(pLayer < this._childNodeLayers.length){
            if(this._childNodeLayers[pLayer]){
                var curlayer = this._childNodeLayers.length;
                for(var i = curlayer.length-1;i>=0;--i){
                    if(curlayer[i] == pNode){
                        return i;
                    }
                }
            }
        }
    }
    return -1;
}
HY.Core.Node.prototype.addChildNode = function(pNode){
    this.addChildNodeAtLayer(pNode,0);
}
HY.Core.Node.prototype.addChildNodeAtLayer = function(pNode,pLayer){
    if(pNode){
        if(!this._childNodeLayers[pLayer]){
            this._childNodeLayers[pLayer] = [];
        }
        pNode.setParent(this);
        this._childNodeLayers[pLayer].push(pNode);
        this.reRender();
    }

}
HY.Core.Node.prototype.addChildNodeAtLayersIndex = function(pNode,pLayer,pIndex){
    if(pNode){
        if(!this._childNodeLayers[pLayer]){
            this._childNodeLayers[pLayer] = [];
        }
        var i = this._childNodeLayers[pLayer].length;
        pNode.setParent(this);
        if(i < pIndex){
            this._childNodeLayers[pLayer].push(pNode);
            return i;
        }else {
            this._childNodeLayers[pLayer].splice(pIndex,0,pNode);
            return pIndex;
        }
        this.reRender();
    }
}
HY.Core.Node.prototype.removeChildNode = function(node,notClearUp){
    for(var i = this._childNodeLayers.length-1;i>=0;--i){
        var layer = this._childNodeLayers[i];
        if(layer){
            for(var j = layer.length-1;j>=0;--j){
                if(node == layer[j]){
                    layer.splice(j,1);
                    this.removeClearUp(node,notClearUp);
                    this.reRender();
                }
            }
        }
    }
}
HY.Core.Node.prototype.removeChildNodeAtLayer = function(node,layerIndex,notClearUp){
    if(layerIndex < this._childNodeLayers.length){
        var layer = this._childNodeLayers[layerIndex];
        if(layer){
            for(var i = layer.length-1;i>=0;--i){
                if(node == layer[i]){
                    layer.splice(i,1);
                    this.removeClearUp(node,notClearUp);
                    this.reRender();
                }
            }
        }
    }
}
HY.Core.Node.prototype.removeChildNodeAtLayersIndex = function(index,layerIndex,notClearUp){
    if(layerIndex < this._childNodeLayers.length){
        var layer = this._childNodeLayers[layerIndex];
        if(layer){
            if(index < layer.length){
                layer.splice(index,1);
                this.removeClearUp(layer[index],notClearUp);
                this.reRender();
            }
        }
    }
}
HY.Core.Node.prototype.removeFromParent = function(notClearUp){
    var parent = this.getParent();
    if(parent != null){
        parent.removeChildNode(this,notClearUp);
    }
}
HY.Core.Node.prototype.removeClearUp = function(node,notClearUp){
    if(!notClearUp){
        var app = this.getApplication();
        node.setParent(null);
        node.setApplication(null);
        node.setCacheEnable(false);
        node.stopAllActions(true);
        node.removeAllUserProperty();
        node.removeAllEventListener();
    }
}
HY.Core.Node.prototype.getSinRotateZ = function(){
    return this._sinAngleZ;
}
HY.Core.Node.prototype.getCosRotateZ = function(){
    return this._cosAngleZ;
}
HY.Core.Node.prototype.setUserProperty = function(key, value){
    this._userProperty[key] = value;
}
HY.Core.Node.prototype.getUserProperty = function(key){
    return this._userProperty[key];
}
HY.Core.Node.prototype.removeUserProperty = function(key){
    delete this._userProperty[key];
}
HY.Core.Node.prototype.removeAllUserProperty = function(){
    this._userProperty = {};
}
HY.Core.Node.prototype.getMinLayoutWidth = function(){
    return this._minLayoutWidth;
}
HY.Core.Node.prototype.setMinLayoutWidth = function(minLayoutWidth){
    this._minLayoutWidth = minLayoutWidth;
}
HY.Core.Node.prototype.getMinLayoutHeight = function(){
    return this._minLayoutHeight;
}
HY.Core.Node.prototype.setMinLayoutHeight = function(minLayoutHeight){
    this._minLayoutHeight = minLayoutHeight;
}
HY.Core.Node.prototype.focus = function(e){
    var app = this.getApplication();
    if(app){
        app.setFocusNode(this, e);
        return true;
    }else{
        return false;
    }
}
HY.Core.Node.prototype.blur = function(){
    var app = this.getApplication();
    if(app && app.getFocusNode() == this){
        app.setFocusNode(null);
        return true;
    }else{
        return false;
    }
}
HY.Core.Node.prototype.isDraging = function(){
    return this.__isDraging;
}
HY.Core.Node.prototype.overIdentityOnThis = function(){
	var app = this.getApplication();
	if(app){
		var overNodes = app.getMouseOverNodes();
		if(overNodes){
			for(var i = overNodes.length-1;i>=0;--i){
				if(overNodes[i] == this){
                    return i;
				}
			}
		}
		return -1;
	}else{
		return -1;
	}
}
HY.Core.Node.prototype.downIdentityOnThis = function(){
	var app = this.getApplication();
	if(app){
		var downNodes = app.getMouseDownNodes();
		if(downNodes){
			for(var i=downNodes.length-1;i>=0;--i){
				if(downNodes[i] == this){
					return i;
				}
			}
		}
		return -1;
	}else{
		return -1;
	}
}
HY.Core.Node.prototype.transPointToAncestorNode = function(pPoint,pAncestorNode) {
    var parentNode = this.getParent();
    var newPoint = new HY.Vect2D({x:pPoint.x,y:pPoint.y});
    var anglesin = this.getSinRotateZ();
    var anglecos = this.getCosRotateZ();
    newPoint.x = this.getX() + (pPoint.x*this.getScaleX()*anglecos-pPoint.y*this.getScaleY()*anglesin);
    newPoint.y = this.getY() + (pPoint.x*this.getScaleX()*anglesin+pPoint.y*this.getScaleY()*anglecos);
    if(parentNode == null || parentNode == pAncestorNode){
        return newPoint;
    }else{
        return parentNode.transPointToAncestorNode(newPoint,pAncestorNode);
    }
}
HY.Core.Node.prototype.transVectorToAncestorNode = function(pVector,pAncestorNode){
    var parentNode = this.getParent();
    var newVector = new HY.Vect2D({x:pVector.x, y:pVector.y});
    var angleSin = this.getSinRotateZ();
    var angleCos = this.getCosRotateZ();
    newVector.x = (pVector.x * this.getScaleX() * angleCos - pVector.y * this.getScaleY() * angleSin);
    newVector.y = (pVector.x * this.getScaleX() * angleSin + pVector.y * this.getScaleY() * angleCos);
    if(parentNode == null || parentNode == pAncestorNode){
        return newVector;
    }else{
        return parentNode.transVectorToAncestorNode(newVector, pAncestorNode);
    }
}
HY.Core.Node.prototype.transPointFromAncestorNode = function(pPoint,pAncestorNode){
    var newPoint = new HY.Vect2D({x:pPoint.x, y:pPoint.y});
    var parentNode = this.getParent();
    if(parentNode != null && parentNode != pAncestorNode){
        newPoint = parentNode.transPointFromAncestorNode(pPoint,pAncestorNode);
    }
    var offsetX = newPoint.x - this.getX();
    var offsetY = newPoint.y - this.getY();
    var angleSin = this.getSinRotateZ();
    var angleCos = this.getCosRotateZ();
    newPoint.x = (offsetX * angleCos + offsetY * angleSin)/this.getScaleX();
    newPoint.y = (offsetY * angleCos - offsetX * angleSin)/this.getScaleY();
    return newPoint;
}
HY.Core.Node.prototype.transVectorFromAncestorNode = function(pVector,pAncestorNode){
    var newVector = new HY.Vect2D({x:pVector.x, y:pVector.y});
    var parentNode = this.getParent();
    if(parentNode != null && parentNode != pAncestorNode){
        newVector = parentNode.transVectorFromAncestorNode(pVector,pAncestorNode);
    }
    var angleSin = this.getSinRotateZ();
    var angleCos = this.getCosRotateZ();
    newVector.x = (pVector.x * angleCos + pVector.y * angleSin) / this.getScaleX();
    newVector.y = (pVector.y * angleCos - pVector.x * angleSin) / this.getScaleY();
    return newVector;
}
HY.Core.Node.prototype.transPointFromCanvas = function(pPoint){
    return this.transPointFromAncestorNode(pPoint, null);
}
HY.Core.Node.prototype.transPointToCanvas = function(pPoint){
    return this.transPointToAncestorNode(pPoint,null);
}
HY.Core.Node.prototype.transVectorFromCanvas = function(pVector){
    return this.transVectorFromAncestorNode(pVector,null);
}
HY.Core.Node.prototype.transVectorToCanvas = function(pVector){
    return this.transVectorToAncestorNode(pVector,null);
}
HY.Core.Node.prototype.transPointFromParent = function(pPoint){
    return this.transPointFromAncestorNode(pPoint,this.getParent());
}
HY.Core.Node.prototype.transPointToParent = function(pPoint){
    return this.transPointToAncestorNode(pPoint,this.getParent());
}
HY.Core.Node.prototype.transVectorFromParent = function(pVector){
    return this.transVectorFromAncestorNode(pVector,this.getParent());
}
HY.Core.Node.prototype.transVectorToParent = function(pVector){
    return this.transVectorToAncestorNode(pVector,this.getParent());
}

HY.Core.Node.prototype.runAction = function(action,loop,target,selector){
    var app = this.getApplication();
    if(app && app.getActionManager()){
        app.getActionManager().addActionLink(this,action,loop,target,selector);
    }
}
HY.Core.Node.prototype.stopAction = function(action){
    var app = this.getApplication();
    if(app && app.getActionManager()){
        app.getActionManager().removeActionOfSprite(this,action);
    }
}
HY.Core.Node.prototype.stopAllActions = function(){
    var app = this.getApplication();
    if(app && app.getActionManager()){
        app.getActionManager().removeAllActionsOfSprite(this);
    }
}

HY.Core.Node.prototype.updateCache = function(){
    if(this._cacheEnable){
        this._cached = false;
    }
}
HY.Core.Node.prototype.needLayoutSubNodes = function(){
	this._layoutflag = true;
}
HY.Core.Node.prototype.layoutSubNodes = function(){}
HY.Core.Node.prototype.reRender = function(){
	var app = this.getApplication();
	if(app){
		app.reRender();
	}
    if(this._cacheEnable){
        this._cached = false;
    }
}

HY.Core.Node.prototype.addEventListener = function(pType,pSelector,pTarget){
	if(!this._events[pType]){
		this._events[pType] = [];
	}
	this._events[pType].push({selector:pSelector,target:pTarget});
}
HY.Core.Node.prototype.checkEventListener = function(pType,pSelector,pTarget){
    if(this._events[pType]){
        for(var i=this._events[pType].length-1;i>=0;--i){
            if(this._events[pType][i].selector == pSelector && this._events[pType][i].target == pTarget){
                return true;
            }
        }
    }
    return false;
}
HY.Core.Node.prototype.removeEventListenerOfType = function(pType,pSelector,pTarget){
    if(this._events[pType]){
        for(var i = this._events[pType].length-1; i>=0;--i){
            if(this._events[pType][i].selector == pSelector && this._events[pType][i].target == pTarget){
                this._events[pType].splice(i,1);
            }
        }
    }
}
HY.Core.Node.prototype.removeAllEventListenerOfType = function(pType){
    if(this._events[pType]){
        this._events[pType] = [];
    }
}
HY.Core.Node.prototype.removeAllEventListener = function(){
    this._events = {};
}

HY.Core.Node.prototype.launchEvent = function(pType,eParamarray){
	var events = this._events[pType];
	if(events){
		var len = events.length;
		for(var i=0;i<len;++i){
			var eListener = events[i];
            eListener.selector.apply(eListener.target,eParamarray);
		}
	}
}
HY.Core.Node.prototype.onXChanged = function(sender) {
    this.launchEvent("xchanged",[this]);
}
HY.Core.Node.prototype.onYChanged = function(sender){
    this.launchEvent("ychanged",[this]);
}
HY.Core.Node.prototype.onWidthChanged = function(sender){
    this.launchEvent("widthchanged",[this]);
}
HY.Core.Node.prototype.onHeightChanged = function(sender){
    this.launchEvent("heightchanged",[this]);
}
HY.Core.Node.prototype.onAnchorXChanged = function(sender){
    this.launchEvent("anchorxchanged",[this]);
}
HY.Core.Node.prototype.onAnchorYChanged = function(sender){
    this.launchEvent("anchorychanged",[this]);
}
HY.Core.Node.prototype.onAngleChanged = function(sender){
    this.launchEvent("anglechanged",[this]);
}
HY.Core.Node.prototype.onAlphaChanged = function(sender){
    this.launchEvent("alphachanged",[this]);
}
HY.Core.Node.prototype.onFinishLaunch = function(sender){
    this.launchEvent("finishlaunch",[this]);
}
HY.Core.Node.prototype.onCanvasSizeChanged = function(sender,pNewSize){
    this.launchEvent("canvassizechanged",[this,pNewSize]);
}
HY.Core.Node.prototype.onFirstShow = function(sender){
	this.launchEvent("firstshow",[this]);
}
HY.Core.Node.prototype.onClick = function(sender,e){
	this.launchEvent("click",[this,e]);
}
HY.Core.Node.prototype.onDblClick = function (sender,e) {
	this.launchEvent("dblclick",[this,e]);
}
HY.Core.Node.prototype.onMouseDown = function(sender,e){
	this.launchEvent("mousedown",[this,e]);
    this.focus(e);
}
HY.Core.Node.prototype.onMouseMove = function(sender,e){
	this.launchEvent("mousemove",[this,e]);
}
HY.Core.Node.prototype.onMouseUp = function(sender,e){
    if(this.__isDraging){
        this.__isDraging = false;
    }
	this.launchEvent("mouseup",[this,e]);
}
HY.Core.Node.prototype.onMouseWheel = function(sender,e){
	this.launchEvent("mousewheel",[this,e]);
}
HY.Core.Node.prototype.onMouseOver = function(sender,e){
    this.launchEvent("mouseover",[this,e]);
    var app = this.getApplication();
    if(app){
        app.setMouseCursor(this._cursor);
    }
}
HY.Core.Node.prototype.onMouseOut = function(sender,e){
	this.launchEvent("mouseout",[this,e]);
}
HY.Core.Node.prototype.onKeyDown = function(sender,e){
	this.launchEvent("keydown",[this,e]);
}
HY.Core.Node.prototype.onKeyPress = function(sender,e){
    this.launchEvent("keypress",[this,e]);
}
HY.Core.Node.prototype.onKeyUp = function(sender,e){
	this.launchEvent("keyup",[this,e]);
}
HY.Core.Node.prototype.onContextMenu = function(sender,e,menuCellView){
    this.launchEvent("contextmenu",[this,e,menuCellView]);
}
HY.Core.Node.prototype.onFocus = function(sender,e){
	this.launchEvent("focus",[this,e]);
}
HY.Core.Node.prototype.onBlur = function(sender){
	this.launchEvent("blur",[this]);
}
HY.Core.Node.prototype.onEnterFrame = function(sender,pDeltaTime){
	this.launchEvent("enterframe",[this,pDeltaTime]);
}
HY.Core.Node.prototype.onEndFrame = function(sender,pDeltaTime){
    this.launchEvent("endframe",[this,pDeltaTime]);
}
HY.Core.Node.prototype.onPaint = function(sender,pRc,pRect){
    var lmaxx = pRect.x + pRect.width;
    var lmaxy = pRect.y + pRect.height;
    var lmaxx1 = pRect.x + pRect.width;
    var lmaxy1 = pRect.y + pRect.height;
    ///*绘制背景色*/
    if(this._backgroundColor){
        pRc.setFillStyle(this._backgroundColor);
        this._createEdgePath(pRc, pRect.x, pRect.y, lmaxx, lmaxy, this._borderWidth);
        pRc.fill();
    }
    this.launchEvent("paint",[this,pRc,pRect]);
    /*绘制边框*/
    if(this._borderColor != null && this._borderWidth > 0) {
        pRc.setLineWidth(this._borderWidth);
        pRc.setStrokeStyle(this._borderColor);
        this._createEdgePath(pRc, pRect.x, pRect.y, lmaxx, lmaxy, this._borderWidth);
        pRc.stroke();
    }
}
HY.Core.Node.prototype.onStartDrag = function(sender,e){
    this.__dragStartCanvasPoint = new HY.Vect2D({x:e.offsetX,y:e.offsetY});
    this.__dragStartPosition = new HY.Vect2D({x:this.getX(), y:this.getY()});
    this.__isDraging = true;
    this.launchEvent("startdrag",[this,e]);
}
HY.Core.Node.prototype.onDrag = function(sender,e) {
    var parent = this.getParent();
    var offsetVect = new HY.Vect2D({});
    var newPosition = new HY.Vect2D({});
    if(parent == null){
        offsetVect.x = e.offsetX - this.__dragStartCanvasPoint.x;
        offsetVect.y = e.offsetY - this.__dragStartCanvasPoint.y;
        newPosition.x = this.__dragStartPosition.x + offsetVect.x;
        newPosition.y = this.__dragStartPosition.y + offsetVect.y;
        this.setX(newPosition.x);
        this.setY(newPosition.y);
    }else{
        var curCanvasInParent = parent.transPointFromCanvas(new HY.Vect2D({x:e.offsetX,y:e.offsetY}));
        var startCanvasInParent = parent.transPointFromCanvas(this.__dragStartCanvasPoint);
        offsetVect.x = curCanvasInParent.x - startCanvasInParent.x;
        offsetVect.y = curCanvasInParent.y - startCanvasInParent.y;
        newPosition.x = this.__dragStartPosition.x + offsetVect.x;
        newPosition.y = this.__dragStartPosition.y + offsetVect.y;
        this.setX(newPosition.x);
        this.setY(newPosition.y);
    }
    this.launchEvent("drag",[this,e]);
}
HY.Core.Node.prototype.onEndDrag = function(sender,e){
    this.__isDraging = false;
    this.launchEvent("enddrag",[this,e]);
}
HY.Core.Node.prototype._dispatchFinishLaunch = function(){
    for(var i = this._childNodeLayers.length-1;i>=0;--i){
        var layer = this._childNodeLayers[i];
        if(layer){
            for(var j = layer.length-1;j>=0;--j){
                layer[j]._dispatchFinishLaunch();
            }
        }
    }
    this.onFinishLaunch(this);
}
HY.Core.Node.prototype._dispatchCanvasSizeChanged = function(pNewSize){
    for(var i = this._childNodeLayers.length-1;i>=0;--i){
        var layer = this._childNodeLayers[i];
        if(layer){
            for(var j = layer.length-1;j>=0;--j){
                layer[j]._dispatchCanvasSizeChanged(pNewSize);
            }
        }
    }
    this.onCanvasSizeChanged(this,pNewSize);
}
HY.Core.Node.prototype._createEdgePath = function(pRc,minx,miny,maxx,maxy,offset){
    pRc.beginPath();
    if(offset != 0){
        var hoffset = offset/2;
        minx += hoffset;
        miny += hoffset;
        maxx -= hoffset;
        maxy -= hoffset;
    }
    if(this._cornorRadius && this._cornorRadius!=0){
        pRc.moveTo(minx,this._cornorRadius+miny);
        pRc.arcTo(minx,miny,minx+this._cornorRadius,miny,this._cornorRadius);
        pRc.lineTo(maxx-this._cornorRadius,miny);
        pRc.arcTo(maxx,miny,maxx,miny+this._cornorRadius,this._cornorRadius);
        pRc.lineTo(maxx,maxy-this._cornorRadius);
        pRc.arcTo(maxx,maxy,maxx-this._cornorRadius,maxy,this._cornorRadius);
        pRc.lineTo(minx+this._cornorRadius,maxy);
        pRc.arcTo(minx,maxy,minx,miny-this._cornorRadius,this._cornorRadius);
    }else{
        pRc.moveTo(minx,miny);
        pRc.lineTo(maxx,miny);
        pRc.lineTo(maxx,maxy);
        pRc.lineTo(minx,maxy);
    }
    pRc.closePath();
}
HY.Core.Node.prototype._dispatchEnterFrame = function(pDeltaTime){
    this.onEnterFrame(this,pDeltaTime);
    for(var i = this._childNodeLayers.length-1;i>=0;--i){
        var layer = this._childNodeLayers[i];
        if(layer){
            for(var j = layer.length-1;j>=0;--j){
                layer[j]._dispatchEnterFrame(pDeltaTime);
            }
        }
    }
    this.onEndFrame(this,pDeltaTime);
}
HY.Core.Node.prototype._dispatchPaintEvent = function (pRc,pDeltaTime) {
    this.onEnterFrame(this,pDeltaTime);
	if(this._layoutflag){
		this.layoutSubNodes();
		this._layoutflag = false;
	}
    if(this._visible){
        if(this._isFirstShow){
            this.onFirstShow(this);
            this._isFirstShow = false;
        }
        pRc.pushTransform(this._x,this._y,this._scaleX,this._scaleY,this._rotateZ,this._clipBound);
        var lminx = this._anchorPixelX;
        var lminy = this._anchorPixelY;
        ///*开启裁剪*/
        if(this._clipBound){
            this._createEdgePath(pRc,lminx,lminy,lminx+this.getWidth(),lminy+this.getHeight(),0);
            pRc.clip();
        }
        if(this._cacheEnable){
            if(!this._cached){
                this._cacheContext.clearRect(0,0,this._width,this._height);
                this._cacheContext.setGlobalAlpha(this._alpha);
                this.onPaint(this,this._cacheContext,new HY.Rect2D({x:0,y:0,width:this._width,height:this._height}));
                this._cached = true;
            }
            pRc.drawImage(this._cacheContext.getCanvas(),lminx,lminy);
        }else{
            pRc.setGlobalAlpha(this._alpha);
            this.onPaint(this,pRc,new HY.Rect2D({x:lminx,y:lminy,width:this._width,height:this._height}));
        }
        /*绘制子控件*/
        var layoutcount = this._childNodeLayers.length;
        for( var i=0;i<layoutcount;++i){
            var layer = this._childNodeLayers[i];
            if(layer){
                var nodecount = layer.length;
                for(var j=0;j<nodecount;++j){
                    layer[j]._dispatchPaintEvent(pRc,pDeltaTime);
                }
            }
        }
        pRc.popTransform();
    }
    this.onEndFrame(this,pDeltaTime);
}
HY.Core.Node.prototype._dispatchKeyUpEvent = function(e){
	for(var i = this._childNodeLayers.length-1;i>=0;--i){
		var layer = this._childNodeLayers[i];
		if(layer){
			for(var j = layer.length-1;j>=0;--j){
				layer[j]._dispatchKeyUpEvent(e);
			}
		}
	}
	this.onKeyUp(this,e);
}
HY.Core.Node.prototype._dispatchKeyPressEvent = function(e){
	for(var i = this._childNodeLayers.length-1;i>=0;--i){
		var layer = this._childNodeLayers[i];
		if(layer){
			for(var j = layer.length-1;j>=0;--j){
				layer[j]._dispatchKeyPressEvent(e);
			}
		}
	}
	this.onKeyPress(this,e);
}
HY.Core.Node.prototype._dispatchKeyDownEvent = function(e){
	for(var i = this._childNodeLayers.length-1;i>=0;--i){
		var layer = this._childNodeLayers[i];
		if(layer){
			for(var j = layer.length-1;j>=0;--j){
				layer[j]._dispatchKeyDownEvent(e);
			}
		}
	}
	this.onKeyDown(this,e);
}
HY.Core.Node.prototype._dispatchMouseWheelEvent = function(e){
	this.onMouseWheel(this,e);
}
HY.Core.Node.prototype._dispatchClickEvent = function(e) {
    if(this._visible){
        var epointincom = this.transPointFromCanvas(new HY.Vect2D({x:e.offsetX,y:e.offsetY}));
        var lefttop = new HY.Vect2D({});
        lefttop.x = this._anchorPixelX;
        lefttop.y = this._anchorPixelY;
        var rightbottom = new HY.Vect2D({});
        rightbottom.x = this._width + this._anchorPixelX;
        rightbottom.y = this._height + this._anchorPixelY;
        if(this._clipBound){
            if(epointincom.x >= lefttop.x && epointincom.x <= rightbottom.x  && epointincom.y >= lefttop.y && epointincom.y <= rightbottom.y){
				for(var i = this._childNodeLayers.length-1;i>=0;--i){
					var layer = this._childNodeLayers[i];
					if(layer){
						for(var j = layer.length-1;j>=0;--j){
							if(layer[j]._dispatchClickEvent(e)){
								return true;
							}
						}
					}
				}
                if(this._mouseEnable){
                    this.onClick(this,e);
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
			for(var i = this._childNodeLayers.length-1;i>=0;--i){
				var layer = this._childNodeLayers[i];
				if(layer){
					for(var j = layer.length-1;j>=0;--j){
						if(layer[j]._dispatchClickEvent(e)){
							return true;
						}
					}
				}
			}
            if(this._mouseEnable){
                if(epointincom.x >= lefttop.x && epointincom.x <= rightbottom.x  && epointincom.y >= lefttop.y && epointincom.y <= rightbottom.y){
                    this.onClick(this,e);
                    return true;
                }else{
                    return false;
                }
            }
        }
    }else{
        return false;
    }
}
HY.Core.Node.prototype._dispatchDblClickEvent = function(e){
    if(this._visible){
        var epointincom = this.transPointFromCanvas(new HY.Vect2D({x:e.offsetX,y:e.offsetY}));
        var lefttop = new HY.Vect2D({});
        lefttop.x = this._anchorPixelX;
        lefttop.y = this._anchorPixelY;
        var rightbottom = new HY.Vect2D({});
        rightbottom.x = this._width + this._anchorPixelX;
        rightbottom.y = this._height + this._anchorPixelY;
        if(this._clipBound){
            if(epointincom.x >= lefttop.x && epointincom.x <= rightbottom.x  && epointincom.y >= lefttop.y && epointincom.y <= rightbottom.y){
				for(var i = this._childNodeLayers.length-1;i>=0;--i){
					var layer = this._childNodeLayers[i];
					if(layer){
						for(var j = layer.length-1;j>=0;--j){
							if(layer[j]._dispatchDblClickEvent(e)){
								return true;
							}
						}
					}
				}
                if(this._mouseEnable){
                    this.onDblClick(this,e);
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
			for(var i = this._childNodeLayers.length-1;i>=0;--i){
				var layer = this._childNodeLayers[i];
				if(layer){
					for(var j = layer.length-1;j>=0;--j){
						if(layer[j]._dispatchDblClickEvent(e)){
							return true;
						}
					}
				}
			}
            if(this._mouseEnable){
                if(epointincom.x >= lefttop.x && epointincom.x <= rightbottom.x  && epointincom.y >= lefttop.y && epointincom.y <= rightbottom.y){
                    this.onDblClick(this,e);
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }
    }else{
        return false;
    }
}
HY.Core.Node.prototype._dispatchContextMenuEvent = function(e) {
    if(this._visible){
        var epointincom = this.transPointFromCanvas(new HY.Vect2D({x:e.offsetX,y:e.offsetY}));
        var lefttop = new HY.Vect2D({});
        lefttop.x = this._anchorPixelX;
        lefttop.y = this._anchorPixelY;
        var rightbottom = new HY.Vect2D({});
        rightbottom.x = this._width + this._anchorPixelX;
        rightbottom.y = this._height + this._anchorPixelY;
        if(this._clipBound){
            if(epointincom.x >= lefttop.x && epointincom.x <= rightbottom.x  && epointincom.y >= lefttop.y && epointincom.y <= rightbottom.y){
				for(var i = this._childNodeLayers.length-1;i>=0;--i){
					var layer = this._childNodeLayers[i];
					if(layer){
						for(var j = layer.length-1;j>=0;--j){
							if(layer[j]._dispatchContextMenuEvent(e)){
								return true;
							}
						}
					}
				}
                if(this._mouseEnable){
                    if(this._contextMenu != null && this._contextMenu.length > 0){
                        var app = this.getApplication();
                        if(app != null){
                            app.showContextMenu(e,this,this._contextMenu,0);
                        }
                    }else{
                        this.onContextMenu(this,e,null);
                    }
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
			for(var i = this._childNodeLayers.length-1;i>=0;--i){
				var layer = this._childNodeLayers[i];
				if(layer){
					for(var j = layer.length-1;j>=0;--j){
						if(layer[j]._dispatchContextMenuEvent(e)){
							return true;
						}
					}
				}
			}
            if(this._mouseEnable){
                if(epointincom.x >= lefttop.x && epointincom.x <= rightbottom.x  && epointincom.y >= lefttop.y && epointincom.y <= rightbottom.y){
                    if(this._contextMenu != null && this._contextMenu.length > 0){
                        var app = this.getApplication();
                        if(app != null){
                            app.showContextMenu(e,this,this._contextMenu,0);
                        }
                    }else{
                        this.onContextMenu(this,e,null);
                    }
                    return true;
                }else{
                    return false;
                }
            }
        }
    }else{
        return false;
    }
}
HY.Core.Node.prototype._dispatchMouseDownEvent = function(e){
    if(this._visible){
        var app = this.getApplication();
        var epointincom = this.transPointFromCanvas(new HY.Vect2D({x:e.offsetX,y:e.offsetY}));
        var lefttop = new HY.Vect2D({});
        lefttop.x = this._anchorPixelX;
        lefttop.y = this._anchorPixelY;
        var rightbottom = new HY.Vect2D({});
        rightbottom.x = this._width + this._anchorPixelX;
        rightbottom.y = this._height + this._anchorPixelY;
        if(this._clipBound){
            if(epointincom.x >= lefttop.x && epointincom.x <= rightbottom.x  && epointincom.y >= lefttop.y && epointincom.y <= rightbottom.y){
                if(this._mouseEnable){
                    if(this._dragEnable && !this.isDraging() && this._dragZone && epointincom.x >= this._dragZone.x && epointincom.x <= this._dragZone.x + this._dragZone.width
                        && epointincom.y >= this._dragZone.y && epointincom.y <= this._dragZone.y + this._dragZone.height){
                        app.setWaitDragNode(this,e);
                    }
                }
                var layers = this.getLayers();
                for(var i = layers.length-1;i>=0;--i){
                    var layer = layers[i];
                    if(layer){
                        for(var j = layer.length-1;j>=0;--j){
                            if(layer[j]._dispatchMouseDownEvent(e)){
                                return true;
                            }
                        }
                    }
                }
                if(this._mouseEnable){
                    app.setMouseDownNode(this,e);
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
                if(epointincom.x > lefttop.x && epointincom.x < rightbottom.x  && epointincom.y > lefttop.y && epointincom.y < rightbottom.y) {
                    flag = true;
                    if (this._dragEnable && !this.isDraging() && this._dragZone && epointincom.x >= this._dragZone.x && epointincom.x <= this._dragZone.x + this._dragZone.width
                        && epointincom.y >= this._dragZone.y && epointincom.y <= this._dragZone.y + this._dragZone.height ) {
                        app.setWaitDragNode(this, e);
                    }
                }
            }
            var layers = this.getLayers();
            for(var i = layers.length-1;i>=0;--i){
                var layer = layers[i];
                if(layer){
                    for(var j = layer.length-1;j>=0;--j){
                        if(layer[j]._dispatchMouseDownEvent(e)){
                            return true;
                        }
                    }
                }
            }
            if(flag){
                app.setMouseDownNode(this,e);
                return true;
            }else{
                return false;
            }
        }
    }else{
        return false;
    }
}
HY.Core.Node.prototype._dispatchMouseMoveEvent = function(e){
    if(this._visible){
        var app = this.getApplication();
        var epointincom = this.transPointFromCanvas(new HY.Vect2D({x:e.offsetX,y:e.offsetY}));
        var lefttop = new HY.Vect2D({});
        lefttop.x = this._anchorPixelX;
        lefttop.y = this._anchorPixelY;
        var rightbottom = new HY.Vect2D({});
        rightbottom.x = this._width + this._anchorPixelX;
        rightbottom.y = this._height + this._anchorPixelY;
        if(this._clipBound){
            if(epointincom.x >= lefttop.x && epointincom.x <= rightbottom.x  && epointincom.y >= lefttop.y && epointincom.y <= rightbottom.y){
                if(this._mouseEnable){
                    if(this.getScrollEnable()){
                        app.setWaitScrollNode(this,e);
                    }
                }
                var layers = this.getLayers();
                for(var i=layers.length-1;i>=0;--i){
                    var layer = layers[i];
                    if(layer){
                        for(var j = layer.length-1;j>=0;--j){
                            if(layer[j]._dispatchMouseMoveEvent(e)){
                                return true;
                            }
                        }
                    }
                }
                if(this._mouseEnable){
                    app.setMouseOverNode(this,e);
                    this.onMouseMove(this,e);
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
                        app.setWaitScrollNode(this,e);
                    }
                }
            }
            var layers = this.getLayers();
            for(var i=layers.length-1;i>=0;--i){
                var layer = layers[i];
                if(layer){
                    for(var j=layer.length-1;j>=0;--j){
                        if(layer[j]._dispatchMouseMoveEvent(e)){
                            return true;
                        }
                    }
                }
            }
            if(flag){
                app.setMouseOverNode(this,e);
                this.onMouseMove(this,e);
                return true;
            }else{
                return false;
            }
        }
    }else{
        return false;
    }
}