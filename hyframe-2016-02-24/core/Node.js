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
HY.Core.Node.prototype.defaultDragZone = {x:-1000000,y:-1000000,width:2000000,height:2000000};
HY.Core.Node.prototype.init = function(config){
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

    this.superCall("init",[config]);

    if(config.x != undefined){ this.setX(config.x); } else { this.setX(this.defaultX); }
    if(config.y != undefined){ this.setY(config.y); } else { this.setY(this.defaultY); }
    if(config.width != undefined){ this.setWidth(config.width); } else{ this.setWidth(this.defaultWidth); }
    if(config.height != undefined){ this.setHeight(config.height); } else { this.setHeight(this.defaultHeight); }
    if(config.scaleX != undefined){ this.setScaleX(config.scaleX); } else { this.setScaleX(1); }
    if(config.scaleY != undefined){ this.setScaleY(config.scaleY); } else { this.setScaleY(1); }
    if(config.anchorX != undefined){ this.setAnchorX(config.anchorX); } else { this.setAnchorY(this.defaultAnchorX); }
    if(config.anchorY != undefined){ this.setAnchorY(config.anchorY); } else { this.setAnchorY(this.defaultAnchorY); }
    if(config.alpha != undefined){ this.setAlpha(config.alpha); } else { this.setAlpha(this.defaultAlpha); }
    if(config.rotateZ != undefined){ this.setRotateZ(config.rotateZ); } else { this.setRotateZ(this.defaultRotateZ); }

    if(config.borderWidth != undefined){ this.setBorderWidth(config.borderWidth); } else { this.setBorderWidth(this.defaultBorderWidth); }
    if(config.borderColor != undefined){ this.setBorderColor(config.borderColor); } else { this.setBorderColor(this.defaultBorderColor); }
    if(config.cornorRadius != undefined){ this.setCornorRadius(config.cornorRadius); } else { this.setCornorRadius(this.defaultCornorRadius); }
    if(config.backgroundColor != undefined){ this.setBackgroundColor(config.backgroundColor); } else { this.setBackgroundColor(this.defaultBackgroundColor); }
    if(config.visible != undefined){ this.setVisible(config.visible); } else { this.setVisible(this.defaultVisible); }
    if(config.clipBound != undefined){ this.setClipBound(config.clipBound); } else { this.setClipBound(this.defaultClipBound); }
    if(config.cacheEnable != undefined){ this.setCacheEnable(config.cacheEnable); } else { this.setCacheEnable(this.defaultCacheEnable); }
    if(config.dragZone != undefined){ this.setDragZone(new HY.Vect2D(config.dragZone)); } else { this.setDragZone(new HY.Rect2D(this.defaultDragZone)); }

    if(config.cursor != undefined){ this.setCursor(config.cursor); } else { this.setCursor(this.defaultCursor); }
    if(config.mouseEnable != undefined){ this.setMouseEnable(config.mouseEnable); } else { this.setMouseEnable(this.defaultMouseEnable); }
    if(config.dragEnable != undefined){ this.setDragEnable(config.dragEnable); } else { this.setDragEnable(this.defaultDragEnable); }
    if(config.scrollEnable != undefined){ this.setScrollEnable(config.scrollEnable); } else { this.setScrollEnable(this.defaultScrollEnable); }
    if(config.contextMenu != undefined){ this.setContextMenu(config.contextMenu); } else { this.setContextMeuu(null); }

    this.needLayoutSubNodes();
}

HY.Core.Node.prototype.getX = function(){
    return this._x;
}
HY.Core.Node.prototype.setX = function(x){
    if(x != this._x){
        this._x = x;
        this.onXChanged(this);
        this.reRender();
    }
}
HY.Core.Node.prototype.getY = function(){
    return this._y;
}
HY.Core.Node.prototype.setY = function(y){
    if(y != this._y){
        this._y = y;
        this.onYChanged(this);
        this.reRender();
    }
}
HY.Core.Node.prototype.getWidth = function(){
    return this._width;
}
HY.Core.Node.prototype.setWidth = function(width) {
    if(width != this._width){
        this._width = width;
        this._anchorPixelX = -Math.round(width * this._anchorX);
        this.onWidthChanged(this);
        this.needLayoutSubNodes();
        this.updateCache();
        this.reRender();
    }
}
HY.Core.Node.prototype.getHeight = function(){
    return this._height;
}
HY.Core.Node.prototype.setHeight = function(height){
    if(height != this._height){
        this._height = height;
        this._anchorPixelY = -Math.round(height * this._anchorY);
        this.onHeightChanged(this);
        this.needLayoutSubNodes();
        this.updateCache();
        this.reRender();
    }
}
HY.Core.Node.prototype.getScaleX = function(){
    return this._scaleX;
}
HY.Core.Node.prototype.setScaleX = function(scaleX){
    if(this._scaleX != scaleX){
        this._scaleX = scaleX;
        this.reRender();
    }
}
HY.Core.Node.prototype.getScaleY = function(){
    return this._scaleY;
}
HY.Core.Node.prototype.setScaleY = function(scaleY){
    if(this._scaleY != scaleY){
        this._scaleY = scaleY;
        this.reRender();
    }
}
HY.Core.Node.prototype.getAnchorX = function () {
    return this._anchorX;
}
HY.Core.Node.prototype.setAnchorX = function(x){
    if(this._anchorX != x){
        this._anchorX = x;
        this._anchorPixelX = -Math.round(x * this._width);
        this.onAnchorXChanged(this);
        this.reRender();
    }
}
HY.Core.Node.prototype.getAnchorY = function () {
    return this._anchorY;
}
HY.Core.Node.prototype.setAnchorY = function(y){
    if(this._anchorY != y){
        this._anchorY = y;
        this._anchorPixelY = -Math.round(y * this._height);
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
HY.Core.Node.prototype.setAlpha = function(alpha){
    if(alpha > 1){ alpha = 1; }else if(alpha < 0){ alpha = 0; }
    if(this._alpha != alpha){
        this._alpha = alpha;
        this.onAlphaChanged(this);
        this.reRender();
    }
}
HY.Core.Node.prototype.rotateZ = function(angle){
    this.setRotateZ(this.getRotateZ()+angle);
}
HY.Core.Node.prototype.getRotateZ = function(){
    return this._rotateZ;
}
HY.Core.Node.prototype.setRotateZ = function(angle){
    if(angle != this._rotateZ){
        this._rotateZ = angle;
        this._sinAngleZ = Math.sin(angle);
        this._cosAngleZ = Math.cos(angle);
        this.onAngleChanged(this);
        this.reRender();
    }
}
HY.Core.Node.prototype.getBorderWidth = function(){
    return this._borderWidth;
}
HY.Core.Node.prototype.setBorderWidth = function(width){
    if(this._borderWidth != width){
        this._borderWidth = width;
        this.reRender();
    }
}
HY.Core.Node.prototype.getBorderColor = function(){
    return this._borderColor;
}
HY.Core.Node.prototype.setBorderColor = function(color){
    if(this._borderColor != color){
        this._borderColor = color;
        this.reRender();
    }
}
HY.Core.Node.prototype.getCornorRadius = function(){
    return this._cornorRadius;
}
HY.Core.Node.prototype.setCornorRadius = function(radius){
    if(this._cornorRadius != radius){
        this._cornorRadius = radius;
        this.reRender();
    }
}
HY.Core.Node.prototype.getBackgroundColor = function(){
    return this._backgroundColor;
}
HY.Core.Node.prototype.setBackgroundColor = function(color){
    if(this._backgroundColor != color){
        this._backgroundColor = color;
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
HY.Core.Node.prototype.setClipBound = function(clip){
    if(this._clipBound != clip){
        this._clipBound = clip;
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
HY.Core.Node.prototype.setCursor = function(cursor){
    this._cursor = cursor;
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
HY.Core.Node.prototype.setDragEnable = function(dragEnable){
    this._dragEnable = dragEnable;
}
HY.Core.Node.prototype.getDragZone = function(){
    return this._dragZone;
}
HY.Core.Node.prototype.setDragZone = function(zone){
    this._dragZone = zone;
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
HY.Core.Node.prototype.setContextMenu = function(contextMenu){
    this._contextMenu = contextMenu;
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
HY.Core.Node.prototype.setApplication = function(app){
    this._application = app;
}
HY.Core.Node.prototype.getParent = function(){
    return this._parent;
}
HY.Core.Node.prototype.setParent = function(node){
    this._parent = node;
}
HY.Core.Node.prototype.getLayers = function(){
    return this._childNodeLayers;
}
HY.Core.Node.prototype.getLayerAtIndex = function(index){
    if(index < this._childNodeLayers.length){
        return this._childNodeLayers[index];
    }else{
        return null;
    }
}
HY.Core.Node.prototype.getChildNodesAtLayer = function(layerIndex){
    if(layerIndex < this._childNodeLayers.length){
        return this._childNodeLayers[layerIndex];
    }else{
        return null;
    }
}
HY.Core.Node.prototype.getChildNodeLocation = function(node){
    for(var i=this._childNodeLayers.length-1;i>=0;--i){
        var curlayer = this._childNodeLayers[i];
        if(curlayer){
            for(var j=curlayer.length-1;j>=0;--j){
                var curnode = curlayer[j];
                if(curnode == node){
                    return {layerIndex:i-1,nodeIndex:j-1};
                }
            }
        }
    }
    return {layerIndex:-1,nodeIndex:-1};
}
HY.Core.Node.prototype.getChildNodeIndexAtLayer = function(node,layerIndex){
    if(this._childNodeLayers){
        if(layerIndex < this._childNodeLayers.length){
            if(this._childNodeLayers[layerIndex]){
                var curlayer = this._childNodeLayers.length;
                for(var i = curlayer.length-1;i>=0;--i){
                    if(curlayer[i] == node){
                        return i;
                    }
                }
            }
        }
    }
    return -1;
}
HY.Core.Node.prototype.addChildNode = function(node){
    this.addChildNodeAtLayer(node,0);
}
HY.Core.Node.prototype.addChildNodeAtLayer = function(node,layerIndex){
    if(node){
        if(!this._childNodeLayers[layerIndex]){
            this._childNodeLayers[layerIndex] = [];
        }
        node.setParent(this);
        this._childNodeLayers[layerIndex].push(node);
        this.reRender();
    }

}
HY.Core.Node.prototype.addChildNodeAtLayersIndex = function(node,layerIndex,nodeIndex){
    if(node){
        if(!this._childNodeLayers[layerIndex]){
            this._childNodeLayers[layerIndex] = [];
        }
        var i = this._childNodeLayers[layerIndex].length;
        node.setParent(this);
        if(i < nodeIndex){
            this._childNodeLayers[layerIndex].push(node);
            return i;
        }else {
            this._childNodeLayers[layerIndex].splice(nodeIndex,0,node);
            return nodeIndex;
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
HY.Core.Node.prototype.transPointToAncestorNode = function(point,ancestorNode) {
    var parentNode = this.getParent();
    var newPoint = new HY.Vect2D({x:point.x,y:point.y});
    var anglesin = this.getSinRotateZ();
    var anglecos = this.getCosRotateZ();
    newPoint.x = this.getX() + (point.x*this.getScaleX()*anglecos-point.y*this.getScaleY()*anglesin);
    newPoint.y = this.getY() + (point.x*this.getScaleX()*anglesin+point.y*this.getScaleY()*anglecos);
    if(parentNode == null || parentNode == pAncestorNode){
        return newPoint;
    }else{
        return parentNode.transPointToAncestorNode(newPoint,ancestorNode);
    }
}
HY.Core.Node.prototype.transVectorToAncestorNode = function(vector,ancestorNode){
    var parentNode = this.getParent();
    var newVector = new HY.Vect2D({x:vector.x, y:vector.y});
    var angleSin = this.getSinRotateZ();
    var angleCos = this.getCosRotateZ();
    newVector.x = (vector.x * this.getScaleX() * angleCos - vector.y * this.getScaleY() * angleSin);
    newVector.y = (vector.x * this.getScaleX() * angleSin + vector.y * this.getScaleY() * angleCos);
    if(parentNode == null || parentNode == ancestorNode){
        return newVector;
    }else{
        return parentNode.transVectorToAncestorNode(newVector, ancestorNode);
    }
}
HY.Core.Node.prototype.transPointFromAncestorNode = function(point,ancestorNode){
    var newPoint = new HY.Vect2D({x:point.x, y:point.y});
    var parentNode = this.getParent();
    if(parentNode != null && parentNode != ancestorNode){
        newPoint = parentNode.transPointFromAncestorNode(point,ancestorNode);
    }
    var offsetX = newPoint.x - this.getX();
    var offsetY = newPoint.y - this.getY();
    var angleSin = this.getSinRotateZ();
    var angleCos = this.getCosRotateZ();
    newPoint.x = (offsetX * angleCos + offsetY * angleSin)/this.getScaleX();
    newPoint.y = (offsetY * angleCos - offsetX * angleSin)/this.getScaleY();
    return newPoint;
}
HY.Core.Node.prototype.transVectorFromAncestorNode = function(vector,ancestorNode){
    var newVector = new HY.Vect2D({x:vector.x, y:vector.y});
    var parentNode = this.getParent();
    if(parentNode != null && parentNode != ancestorNode){
        newVector = parentNode.transVectorFromAncestorNode(vector,ancestorNode);
    }
    var angleSin = this.getSinRotateZ();
    var angleCos = this.getCosRotateZ();
    newVector.x = (vector.x * angleCos + vector.y * angleSin) / this.getScaleX();
    newVector.y = (vector.y * angleCos - vector.x * angleSin) / this.getScaleY();
    return newVector;
}
HY.Core.Node.prototype.transPointFromCanvas = function(point){
    return this.transPointFromAncestorNode(point, null);
}
HY.Core.Node.prototype.transPointToCanvas = function(point){
    return this.transPointToAncestorNode(point,null);
}
HY.Core.Node.prototype.transVectorFromCanvas = function(vector){
    return this.transVectorFromAncestorNode(vector,null);
}
HY.Core.Node.prototype.transVectorToCanvas = function(vector){
    return this.transVectorToAncestorNode(vector,null);
}
HY.Core.Node.prototype.transPointFromParent = function(point){
    return this.transPointFromAncestorNode(point,this.getParent());
}
HY.Core.Node.prototype.transPointToParent = function(point){
    return this.transPointToAncestorNode(point,this.getParent());
}
HY.Core.Node.prototype.transVectorFromParent = function(vector){
    return this.transVectorFromAncestorNode(vector,this.getParent());
}
HY.Core.Node.prototype.transVectorToParent = function(vector){
    return this.transVectorToAncestorNode(vector,this.getParent());
}

HY.Core.Node.prototype.runAction = function(action,loop,target,callBack){
    var app = this.getApplication();
    if(app && app.getActionManager()){
        app.getActionManager().addActionLink(this,action,loop,target,callBack);
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

HY.Core.Node.prototype.addEventListener = function(type,callBack,target){
	if(!this._events[type]){
		this._events[type] = [];
	}
	this._events[type].push({callBack:callBack,target:target});
}
HY.Core.Node.prototype.checkEventListener = function(type,callBack,target){
    if(this._events[type]){
        for(var i=this._events[type].length-1;i>=0;--i){
            if(this._events[type][i].callBack == callBack && this._events[type][i].target == target){
                return true;
            }
        }
    }
    return false;
}
HY.Core.Node.prototype.removeEventListenerOfType = function(type,callBack,target){
    if(this._events[type]){
        for(var i = this._events[type].length-1; i>=0;--i){
            if(this._events[type][i].callBack == callBack && this._events[type][i].target == target){
                this._events[type].splice(i,1);
            }
        }
    }
}
HY.Core.Node.prototype.removeAllEventListenerOfType = function(type){
    if(this._events[type]){
        this._events[type] = [];
    }
}
HY.Core.Node.prototype.removeAllEventListener = function(){
    this._events = {};
}

HY.Core.Node.prototype.launchEvent = function(type,params){
	var events = this._events[type];
	if(events){
		var len = events.length;
		for(var i=0;i<len;++i){
			var eListener = events[i];
            eListener.callBack.apply(eListener.target,params);
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
HY.Core.Node.prototype.onCanvasSizeChanged = function(sender,newSize){
    this.launchEvent("canvassizechanged",[this,newSize]);
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
HY.Core.Node.prototype.onPaint = function(sender,dc,rect){
    var lmaxx = rect.x + rect.width;
    var lmaxy = rect.y + rect.height;
    var lmaxx1 = rect.x + rect.width;
    var lmaxy1 = rect.y + rect.height;
    ///*绘制背景色*/
    if(this._backgroundColor){
        dc.setFillStyle(this._backgroundColor);
        this._createEdgePath(dc, rect.x, rect.y, lmaxx, lmaxy, this._borderWidth);
        dc.fill();
    }
    this.launchEvent("paint",[this,dc,rect]);
    /*绘制边框*/
    if(this._borderColor != null && this._borderWidth > 0) {
        dc.setLineWidth(this._borderWidth);
        dc.setStrokeStyle(this._borderColor);
        this._createEdgePath(dc, rect.x, rect.y, lmaxx, lmaxy, this._borderWidth);
        dc.stroke();
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
HY.Core.Node.prototype._createEdgePath = function(dc,minx,miny,maxx,maxy,offset){
    dc.beginPath();
    if(offset != 0){
        var hoffset = offset/2;
        minx += hoffset;
        miny += hoffset;
        maxx -= hoffset;
        maxy -= hoffset;
    }
    if(this._cornorRadius && this._cornorRadius!=0){
        dc.moveTo(minx,this._cornorRadius+miny);
        dc.arcTo(minx,miny,minx+this._cornorRadius,miny,this._cornorRadius);
        dc.lineTo(maxx-this._cornorRadius,miny);
        dc.arcTo(maxx,miny,maxx,miny+this._cornorRadius,this._cornorRadius);
        dc.lineTo(maxx,maxy-this._cornorRadius);
        dc.arcTo(maxx,maxy,maxx-this._cornorRadius,maxy,this._cornorRadius);
        dc.lineTo(minx+this._cornorRadius,maxy);
        dc.arcTo(minx,maxy,minx,miny-this._cornorRadius,this._cornorRadius);
    }else{
        dc.moveTo(minx,miny);
        dc.lineTo(maxx,miny);
        dc.lineTo(maxx,maxy);
        dc.lineTo(minx,maxy);
    }
    dc.closePath();
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
HY.Core.Node.prototype._dispatchPaintEvent = function (dc,pDeltaTime) {
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
        dc.pushTransform(this._x,this._y,this._scaleX,this._scaleY,this._rotateZ,this._clipBound);
        var lminx = this._anchorPixelX;
        var lminy = this._anchorPixelY;
        ///*开启裁剪*/
        if(this._clipBound){
            this._createEdgePath(dc,lminx,lminy,lminx+this.getWidth(),lminy+this.getHeight(),0);
            dc.clip();
        }
        if(this._cacheEnable){
            if(!this._cached){
                this._cacheContext.setWidth(this._width);
                this._cacheContext.setHeight(this._height);
                this._cacheContext.clearRect(0,0,this._width,this._height);
                this._cacheContext.setGlobalAlpha(this._alpha);
                this.onPaint(this,this._cacheContext,new HY.Rect2D({x:0,y:0,width:this._width,height:this._height}));
                this._cached = true;
            }
            dc.drawImage(this._cacheContext.getCanvas(),lminx,lminy);
        }else{
            dc.setGlobalAlpha(this._alpha);
            this.onPaint(this,dc,new HY.Rect2D({x:lminx,y:lminy,width:this._width,height:this._height}));
        }
        /*绘制子控件*/
        for( var i= 0,layercount=this._childNodeLayers.length ; i<layercount ; ++i){
            var layer = this._childNodeLayers[i];
            if(layer){
                for(var j= 0,nodecount=layer.length ; j<nodecount ; ++j){
                    layer[j]._dispatchPaintEvent(dc,pDeltaTime);
                }
            }
        }
        dc.popTransform();
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