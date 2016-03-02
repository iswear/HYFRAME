var hy = hy || {};
hy.Node = hy.extend(hy.Observable);
hy.Node.prototype.notifySyncX = "syncx";
hy.Node.prototype.notifySyncY = "syncy";
hy.Node.prototype.notifySyncWidth = "syncwidth";
hy.Node.prototype.notifySyncHeight = "syncheight";
hy.Node.prototype.notifySyncAnchorX = "syncanchorx";
hy.Node.prototype.notifySyncAnchorY = "syncanchory";
hy.Node.prototype.notifySyncScaleX = "syncscalex";
hy.Node.prototype.notifySyncScaleY = "syncscaley";
hy.Node.prototype.notifySyncAlpha = "syncalpha";
hy.Node.prototype.notifySyncRotateZ = "syncrotatez";
hy.Node.prototype.notifySyncVisible = "syncvisible";
hy.Node.prototype.notifySyncClipBound = "syncclipbound";
hy.Node.prototype.notifySyncCornorRadius = "synccornorradius";

hy.Node.prototype.notifyClick = "click";
hy.Node.prototype.notifyDblClick = "dblclick";
hy.Node.prototype.notifyMouseMove = "mousemove";
hy.Node.prototype.notifyMouseOver = "mouseover";
hy.Node.prototype.notifyMouseDown = "mousedown";
hy.Node.prototype.notifyMouseUp = "mouseup";
hy.Node.prototype.notifyMouseOut = "mouseout";
hy.Node.prototype.notifyMouseWheel = "mousewheel";
hy.Node.prototype.notifyContextMenu = "contextmenu";
hy.Node.prototype.notifyKeyDown = "keydown";
hy.Node.prototype.notifyKeyPress = "keypress";
hy.Node.prototype.notifyKeyUp = "keyup";
hy.Node.prototype.notifyLayoutSubNodes = "layoutsubnodes";
hy.Node.prototype.notifyFocus = "focus";
hy.Node.prototype.notifyBlur = "blur";
hy.Node.prototype.notifyEnterFrame = "enterframe";
hy.Node.prototype.notifyPaint = "paint";
hy.Node.prototype.notifyDraging = "draging";
hy.Node.prototype.notifyDragEnd = "dragend";

hy.Node.prototype.defaultX = 0;
hy.Node.prototype.defaultY = 0;
hy.Node.prototype.defaultWidth = 100;
hy.Node.prototype.defaultHeight = 50;
hy.Node.prototype.defaultAnchorX = 0;
hy.Node.prototype.defaultAnchorY = 0;
hy.Node.prototype.defaultAlpha = 1.0;
hy.Node.prototype.defaultRotateZ = 0;
hy.Node.prototype.defaultCursor = null;
hy.Node.prototype.defaultVisible = true;
hy.Node.prototype.defaultClipBound = false;
hy.Node.prototype.defaultCornorRadius = 0;
hy.Node.prototype.defaultMouseEnable = true;
hy.Node.prototype.defaultDragEnable = true;
hy.Node.prototype.defaultWheelEnable = true;
hy.Node.prototype.defaultDragZone = {x0:-Infinity,y0:-Infinity,x1:Infinity,y1:Infinity};
hy.Node.prototype.defaultContextMenu = null;
hy.Node.prototype.defaultMinX = 0;
hy.Node.prototype.defaultMaxX = Infinity;
hy.Node.prototype.defaultMinY = 0;
hy.Node.prototype.defaultMaxY = Infinity;

hy.Node.prototype.init = function(config){
    this.superCall("init",[config]);
    this._x = this.isUndefined(config.x) ? this.defaultX : config.x;
    this._y = this.isUndefined(config.y) ? this.defaultY : config.y;
    this._width = this.isUndefined(config.width) ? this.defaultWidth : config.width;
    this._height = this.isUndefined(config.height) ? this.defaultHeight : config.height;
    this._anchorX = this.isUndefined(config.anchorX) ? this.defaultAnchorX : config.anchorX;
    this._anchorY = this.isUndefined(config.anchorY) ? this.defaultAnchorY : config.anchorY;
    this._scaleX = this.isUndefined(config.scaleX) ? 1 : config.scaleX;
    this._scaleY = this.isUndefined(config.scaleY) ? 1 : config.scaleY;
    this._alpha = this.isUndefined(config.alpha) ? this.defaultAlpha : config.alpha;
    this._rotateZ = this.isUndefined(config.rotateZ) ? this.defaultRotateZ : config.rotateZ;
    this._visible = this.isUndefined(config.visible) ? this.defaultVisible : config.visible;
    this._clipBound = this.isUndefined(config.clipBound) ? this.defaultClipBound : config.clipBound;
    this._cornorRadius = this.isUndefined(config.cornorRadius) ? this.defaultCornorRadius : config.cornorRadius;
    this._cursor = this.isUndefined(config.cursor) ? this.defaultCursor : config.cursor;
    this._mouseEnable = this.isUndefined(config.mouseEnable) ? this.defaultMouseEnable : config.mouseEnable;
    this._dragEnable = this.isUndefined(config.dragEnable) ? this.defaultDragEnable : config.dragEnable;
    this._wheelEnable = this.isUndefined(config.wheelEnable) ? this.defaultWheelEnable : config.wheelEnable;
    this._dragZone = this.isUndefined(config.dragZone) ? this.defaultDragZone : config.dragZone;
    this._contextMenu = this.isUndefined(config.contextMenu) ? this.defaultContextMenu : config.contextMenu;
    this._tag = this.isUndefined(config.tag) ? 0 : config.tag;
    this._minX = this.isUndefined(config.minX) ? (-Infinity) : config.minX;
    this._maxX = this.isUndefined(config.maxX) ? Infinity : config.maxX;
    this._minY = this.isUndefined(config.minY) ? (-Infinity) : config.minY;
    this._maxY = this.isUndefined(config.maxY) ? Infinity : config.maxY;
    this._minWidth = this.isUndefined(config.minWidth) ? this.defaultMinX : config.minWidth;
    this._maxWidth = this.isUndefined(config.maxWidth) ? this.defaultMaxX : config.maxWidth;
    this._minHeight = this.isUndefined(config.minHeight) ? this.defaultMinY : config.minHeight;
    this._maxHeight = this.isUndefined(config.maxHeight) ? this.defaultMaxY : config.maxHeight;

    this._paintInheritInfo = {};
    this._application = null;
    this._parent = null;
    this._childNodeLayers = [];
    this._anchorPixelX = 0;
    this._anchorPixelY = 0;
    this._sinRotateZ = 0;
    this._cosRotateZ = 0;
    this._needLayoutSubNodes = true;
    this.__dragStartCanvasPoint = null;
    this.__dragStartParentPoint = null;
    this.__dragReady = false;

    this.addObserver(this.notifyPaint,this,this._clipBoundForNode);
    this.addObserver(this.notifySyncWidth,this,this._syncAnchorPixelX);
    this.addObserver(this.notifySyncAnchorX,this,this._syncAnchorPixelX);
    this.addObserver(this.notifySyncHeight,this,this._syncAnchorPixelY);
    this.addObserver(this.notifySyncAnchorY,this,this._syncAnchorPixelY);
    this.addObserver(this.notifySyncRotateZ,this,this._syncSinRotateZ);
    this.addObserver(this.notifySyncRotateZ,this,this._syncCosRotateZ);
    this.addObserver(this.notifyDraging,this,this._nodeDragImpl);
    this.addObserver(this.notifyDragEnd,this,this._nodeDragEnd);
}
hy.Node.prototype.sync = function(){
    this.superCall("sync",null);
    this._syncAnchorPixelX();
    this._syncAnchorPixelY();
    this._syncSinRotateZ();
    this._syncCosRotateZ();
}
hy.Node.prototype.setX = function(x){
    if(this._x != x){
        x = (x > this._minX) ? x : this._minX;
        x = (x < this._maxX) ? x : this._maxX;
        if(this._x != x){
            this._x = x;
            this.refresh();
            this.postNotification(this.notifySyncX,null);
        }
    }
}
hy.Node.prototype.getX = function(){
    return this._x;
}
hy.Node.prototype.setY = function(y){
    if(this._y != y){
        y = (y > this._minY) ? y : this._minY;
        y = (y < this._maxY) ? y : this._maxY;
        if(this._y != y){
            this._y = y;
            this.refresh();
            this.postNotification(this.notifySyncY,null);
        }
    }
}
hy.Node.prototype.getY = function(){
    return this._y;
}
hy.Node.prototype.setWidth = function(width){
    if(this._width != width){
        width = (width > this._minWidth) ? width : this._minWidth;
        width = (width < this._maxWidth) ? width : this._maxWidth;
        if(this._width != width) {
            this._width = width;
            this.needLayoutSubNodes();
            this.refresh();
            this.postNotification(this.notifySyncWidth, null);
        }
    }
}
hy.Node.prototype.getWidth = function(){
    return this._width;
}
hy.Node.prototype.setHeight = function(height){
    if(this._height != height){
        height = (height > this._minHeight) ? height : this._minHeight;
        height = (height < this._maxHeight) ? height : this._maxHeight;
        if(this._height != height){
            this._height = height;
            this.needLayoutSubNodes();
            this.refresh();
            this.postNotification(this.notifySyncHeight, null);
        }
    }
}
hy.Node.prototype.getHeight = function(){
    return this._height;
}
hy.Node.prototype.setAnchorX = function(anchorX){
    if(this._anchorX != anchorX){
        this._anchorX = anchorX;
        this.needLayoutSubNodes();
        this.refresh();
        this.postNotification(this.notifySyncAnchorX, null);
    }
}
hy.Node.prototype.getAnchorX = function(){
    return this._anchorX;
}
hy.Node.prototype.setAnchorY = function(anchorY){
    if(this._anchorY != anchorY){
        this._anchorY = anchorY;
        this.needLayoutSubNodes();
        this.refresh();
        this.postNotification(this.notifySyncAnchorY, null);
    }
}
hy.Node.prototype.getAnchorY = function(){
    return this._anchorY;
}
hy.Node.prototype.setScaleX = function(scaleX){
    if(this._scaleX != scaleX){
        this._scaleX = scaleX;
        this.refresh();
        this.postNotification(this.notifySyncScaleX,null);
    }
}
hy.Node.prototype.getScaleX = function(){
    return this._scaleX;
}
hy.Node.prototype.setScaleY = function(scaleY){
    if(this._scaleY != scaleY){
        this._scaleY = scaleY;
        this.refresh();
        this.postNotification(this.notifySyncScaleY,null);
    }
}
hy.Node.prototype.getScaleY = function(){
    return this._scaleY;
}
hy.Node.prototype.setAlpha = function(alpha){
    if(this._alpha != alpha){
        this._alpha = alpha;
        this.refresh();
        this.postNotification(this.notifySyncAlpha, null);
    }
}
hy.Node.prototype.getAlpha = function(){
    return this._alpha;
}
hy.Node.prototype.setRotateZ = function(rotateZ){
    if(this._rotateZ != rotateZ){
        this._rotateZ = rotateZ;
        this.refresh();
        this.postNotification(this.notifySyncRotateZ, null);
    }
}
hy.Node.prototype.getRotateZ = function(){
    return this._rotateZ;
}
hy.Node.prototype.setVisible = function(visible){
    if(this._visible != visible){
        this._visible = visible;
        this.refresh();
        this.postNotification(this.notifySyncVisible, null);
    }
}
hy.Node.prototype.getVisible = function(){
    return this._visible;
}
hy.Node.prototype.setClipBound = function(clipBound){
    if(this._clipBound != clipBound){
        this._clipBound = clipBound;
        this.refresh();
        this.postNotification(this.notifySyncClipBound, null);
    }
}
hy.Node.prototype.getClipBound = function(){
    return this._clipBound;
}
hy.Node.prototype.setCornorRadius = function(radius){
    if(this._cornorRadius != radius){
        this._cornorRadius = radius;
        this.refresh();
        this.postNotification(this.notifySyncCornorRadius,null);
    }
}
hy.Node.prototype.getCornorRadius = function(){
    return this._cornorRadius;
}
hy.Node.prototype.setCursor = function(cursor){
    this._cursor = cursor;
}
hy.Node.prototype.getCursor = function(){
    return this._cursor;
}
hy.Node.prototype.setMouseEnable = function(mouseEnable){
    this._mouseEnable = mouseEnable;
}
hy.Node.prototype.getMouseEnable = function(){
    return this._mouseEnable;
}
hy.Node.prototype.setDragEnable = function(dragEnable){
    this._dragEnable = dragEnable;
}
hy.Node.prototype.getDragEnable = function(){
    return this._dragEnable;
}
hy.Node.prototype.setWheelEnable = function(wheelEnable){
    this._wheelEnable = wheelEnable;
}
hy.Node.prototype.getWheelEnable = function(){
    return this._wheelEnable;
}
hy.Node.prototype.setDragZone = function(dragZone){
    this._dragZone = dragZone;
}
hy.Node.prototype.getDragZone = function(){
    return this._dragZone;
}
hy.Node.prototype.setContextMenu = function(contextMenu){
    this._contextMenu = contextMenu;
}
hy.Node.prototype.getContextMenu = function(){
    return this._contextMenu;
}
hy.Node.prototype.setTag = function(tag){
    this._tag = tag;
}
hy.Node.prototype.getTag = function(){
    return this._tag;
}
hy.Node.prototype.setMinX = function(minX){
    this._minX = minX;
    if(this._x < minX){
        this.setX(minX);
    }
}
hy.Node.prototype.getMinX = function(){
    return this._minX;
}
hy.Node.prototype.setMinY = function(minY){
    this._minY = minY;
    if(this._y < minY){
        this.setY(minY);
    }
}
hy.Node.prototype.getMinY = function(){
    return this._minY;
}
hy.Node.prototype.setMaxX = function(maxX){
    this._maxX = maxX;
    if(this._x > maxX){
        this.setX(maxX);
    }
}
hy.Node.prototype.getMaxX = function(){
    return this._maxX;
}
hy.Node.prototype.setMaxY = function(maxY){
    this._maxY = maxY;
    if(this._y > maxY){
        this.setY(maxY);
    }
}
hy.Node.prototype.getMaxY = function(){
    return this._maxY;
}
hy.Node.prototype.setMinWidth = function(minWidth){
    this._minWidth = minWidth;
    if(this._width < minWidth){
        this.setWidth(minWidth);
    }
}
hy.Node.prototype.getMinWidth = function(){
    return this._minWidth;
}
hy.Node.prototype.setMinHeight = function(minHeight){
    this._minHeight = minHeight;
    if(this._height < minHeight){
        this.setHeight(minHeight);
    }
}
hy.Node.prototype.getMinHeight = function(){
    return this._minHeight;
}
hy.Node.prototype.setMaxWidth = function(maxWidth){
    this._maxWidth = maxWidth;
    if(this._width > maxWidth){
        this.setWidth(maxWidth);
    }
}
hy.Node.prototype.getMaxWidth = function(){
    return this._maxWidth;
}
hy.Node.prototype.setMaxHeight = function(maxHeight){
    this._maxHeight = maxHeight;
    if(this._height > maxHeight){
        this.setHeight(maxHeight);
    }
}
hy.Node.prototype.getMaxHeight = function(){
    return this._maxHeight;
}
hy.Node.prototype.setPaintInheritValue = function(key, value){
    this._paintInheritInfo[key] = value;
}
hy.Node.prototype.getPaintInheritValue = function(key){
    return this._paintInheritInfo[key];
}

hy.Node.prototype.setApplication = function(app){
    this._application = app;
}
hy.Node.prototype.getApplication = function(){
    if(!this._application){
        var parent = this._parent;
        if(parent == null){
            this._application = null;
        }else{
            this._application = parent.getApplication();
        }
    }
    return this._application;
}
hy.Node.prototype.setParent = function(parent){
    this._parent = parent;
}
hy.Node.prototype.getParent = function(){
    return this._parent;
}

hy.Node.prototype.getLayers = function(){
    return this._childNodeLayers;
}
hy.Node.prototype.getLayerAtIndex = function(layerIndex){
    if(layerIndex < this._childNodeLayers.length){
        return this._childNodeLayers[layerIndex];
    }else{
        return null;
    }
}
hy.Node.prototype.getChildNodeAt = function(layerIndex , nodeIndex){
    if(layerIndex < this._childNodeLayers.length){
        var layer = this._childNodeLayers[layerIndex];
        if(nodeIndex < layer.length){
            return layer[nodeIndex];
        }else{
            return null;
        }
    }else{
        return null;
    }
}
hy.Node.prototype.getChildNodeLocation = function(node){
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
hy.Node.prototype.getChildNodeIndexAtLayer = function(node, layerIndex){
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
hy.Node.prototype.addChildNode = function(node){
    this.addChildNodeAtLayer(node,0);
}
hy.Node.prototype.addChildNodeAtLayer = function(node, layerIndex){
    if(node){
        if(!this._childNodeLayers[layerIndex]){
            this._childNodeLayers[layerIndex] = [];
        }
        node.setParent(this);
        this._childNodeLayers[layerIndex].push(node);
        this.refresh();
        this.needLayoutSubNodes();
    }
}
hy.Node.prototype.addChildNodeAtLocation = function(node,layerIndex,nodeIndex){
    if(node){
        if(!this._childNodeLayers[layerIndex]){
            this._childNodeLayers[layerIndex] = [];
        }
        var i = this._childNodeLayers[layerIndex].length;
        node.setParent(this);
        if(i < nodeIndex){
            this._childNodeLayers[layerIndex].push(node);
            this.needLayoutSubNodes();
            this.refresh();
            return i;
        }else {
            this._childNodeLayers[layerIndex].splice(nodeIndex,0,node);
            this.needLayoutSubNodes();
            this.refresh();
            return nodeIndex;
        }
    }
}
hy.Node.prototype.removeChildNode = function(node, clean){
    for(var i = this._childNodeLayers.length-1;i>=0;--i){
        var layer = this._childNodeLayers[i];
        if(layer){
            for(var j = layer.length-1;j>=0;--j){
                if(node == layer[j]){
                    layer.splice(j,1);
                    if(clean){
                        node.clean();
                    }
                    this.refresh();
                }
            }
        }
    }
}
hy.Node.prototype.removeChildNodeAtLayer = function(layerIndex,node,clean){
    if(layerIndex < this._childNodeLayers.length){
        var layer = this._childNodeLayers[layerIndex];
        if(layer){
            for(var i = layer.length-1;i>=0;--i){
                if(node == layer[i]){
                    layer.splice(i,1);
                    if(clean){
                        node.clean();
                    }
                    this.refresh();
                }
            }
        }
    }
}
hy.Node.prototype.removeChildNodeAtLocation = function (layerIndex,nodeIndex,clean) {
    if(layerIndex < this._childNodeLayers.length){
        var layer = this._childNodeLayers[layerIndex];
        if(layer){
            if(nodeIndex < layer.length){
                layer.splice(nodeIndex,1);
                if(clean){
                    layer[nodeIndex].clean();
                }
                this.refresh();
            }
        }
    }
}
hy.Node.prototype.removeFromParent = function(clean){
    var parent = this.getParent();
    if(parent != null){
        parent.removeChildNode(this,clean);
    }
}
hy.Node.prototype.runAction = function(action,target,callBack,loop){
    var app = this.getApplication();
    if(app){
        app.getActionManager().addActionBinder(this,action,target,callBack,loop);
    }
}
hy.Node.prototype.stopAction = function(action){
    var app = this.getApplication();
    if(app){
        app.getActionManager().removeActionOfSprite(this,action);
    }
}
hy.Node.prototype.stopAllActions = function(){
    var app = this.getApplication();
    if(app){
        app.getActionManager().removeAllActionsOfSprite(this);
    }
}

hy.Node.prototype.focus = function(e){
    var app = this.getApplication();
    if(app){
        app.setFocusNode(e,this);
        return true;
    }else{
        return false;
    }
}
hy.Node.prototype.blur = function(){
    var app = this.getApplication();
    if(app && app.getFocusNode() == this){
        app.setFocusNode(null);
    }else{
        return false;
    }
}
hy.Node.prototype.dragReady = function(){
    return this.__dragReady;
}
hy.Node.prototype.mouseOverIdOnIt = function(){
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
hy.Node.prototype.mouseDownIdOnIt = function(){
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

hy.Node.prototype.getAnchorPixelX = function(){
    return this._anchorPixelX;
}
hy.Node.prototype.getAnchorPixelY = function(){
    return this._anchorPixelY;
}
hy.Node.prototype.getSinRotateZ = function(){
    return this._sinRotateZ;
}
hy.Node.prototype.getCosRotateZ = function(){
    return this._cosRotateZ;
}
hy.Node.prototype.transPointToAncestorNode = function(point, ancestorNode){
    var parentNode = this.getParent();
    var newPoint = {x:point.x,y:point.y};
    var anglesin = this.getSinRotateZ();
    var anglecos = this.getCosRotateZ();
    newPoint.x = this.getX() + (point.x*this.getScaleX()*anglecos-point.y*this.getScaleY()*anglesin);
    newPoint.y = this.getY() + (point.x*this.getScaleX()*anglesin+point.y*this.getScaleY()*anglecos);
    if(parentNode == null || parentNode == ancestorNode){
        return newPoint;
    }else{
        return parentNode.transPointToAncestorNode(newPoint,ancestorNode);
    }

}
hy.Node.prototype.transVectorToAncestorNode = function(vector,ancestorNode){
    var parentNode = this.getParent();
    var newVector = {x:vector.x, y:vector.y};
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
hy.Node.prototype.transPointFromAncestorNode = function(point,ancestorNode){
    var newPoint = {x:point.x, y:point.y};
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
hy.Node.prototype.transVectorFromAncestorNode = function(vector,ancestorNode){
    var newVector = {x:vector.x, y:vector.y};
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

hy.Node.prototype.needLayoutSubNodes = function(){
    this._needLayoutSubNodes = true;
}
hy.Node.prototype.refresh = function() {
    var app = this.getApplication();
    if (app) {
        app.refresh();
    }
}

hy.Node.prototype._dispatchKeyDown = function (e) {
    for(var i = 0, len = this._childNodeLayers.length ; i < len ; ++i){
        var layer = this._childNodeLayers[i];
        if(layer){
            for(var j = 0, len2 = layer.length ; j < len2 ; ++j){
                layer[j]._dispatchKeyDown(e);
            }
        }
    }
    this.postNotification(this.notifyKeyDown,[e]);
}
hy.Node.prototype._dispatchKeyPress = function (e) {
    for(var i = 0, len = this._childNodeLayers.length ; i < len ; ++i){
        var layer = this._childNodeLayers[i];
        if(layer){
            for(var j = 0, len2 = layer.length ; j < len2 ; ++j){
                layer[j]._dispatchKeyPress(e);
            }
        }
    }
    this.postNotification(this.notifyKeyPress,[e]);
}
hy.Node.prototype._dispatchKeyUp = function (e) {
    for(var i = 0, len = this._childNodeLayers.length ; i < len ; ++i){
        var layer = this._childNodeLayers[i];
        if(layer){
            for(var j = 0, len2 = layer.length ; j < len2 ; ++j){
                layer[j]._dispatchKeyUp(e);
            }
        }
    }
    this.postNotification(this.notifyKeyUp,[e]);
}
hy.Node.prototype._dispatchClick = function (e) {
    if(this._visible){
        var localPoint = this.transPointFromAncestorNode({x:e.offsetX,y:e.offsetY},null);
        var localLefTop = {x:this._anchorPixelX,y:this._anchorPixelY};
        var localRigBot = {x:this._width + this._anchorPixelX,y:this._height + this._anchorPixelY};
        if(this._clipBound){
            if(localPoint.x >= localLefTop.x && localPoint.x <= localRigBot.x
                && localPoint.y >= localLefTop.y && localPoint.y <= localRigBot.y){
                for(var i = this._childNodeLayers.length-1;i>=0;--i){
                    var layer = this._childNodeLayers[i];
                    if(layer){
                        for(var j = layer.length-1;j>=0;--j){
                            if(layer[j]._dispatchClick(e)){
                                return true;
                            }
                        }
                    }
                }
                if(this._mouseEnable){
                    this.postNotification(this.notifyClick,[e]);
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
                        if(layer[j]._dispatchClick(e)){
                            return true;
                        }
                    }
                }
            }
            if(this._mouseEnable){
                if(localPoint.x >= localLefTop.x && localPoint.x <= localRigBot.x
                    && localPoint.y >= localLefTop.y && localPoint.y <= localRigBot.y){
                    this.postNotification(this.notifyClick,[e]);
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
hy.Node.prototype._dispatchDblClick = function(e){
    if(this._visible){
        var localPoint = this.transPointFromAncestorNode({x:e.offsetX,y:e.offsetY},null);
        var localLefTop = {x:this._anchorPixelX,y:this._anchorPixelY};
        var localRigBot = {x:this._width + this._anchorPixelX,y:this._height + this._anchorPixelY};
        if(this._clipBound){
            if(localPoint.x >= localLefTop.x && localPoint.x <= localRigBot.x
                && localPoint.y >= localLefTop.y && localPoint.y <= localRigBot.y){
                for(var i = this._childNodeLayers.length-1;i>=0;--i){
                    var layer = this._childNodeLayers[i];
                    if(layer){
                        for(var j = layer.length-1;j>=0;--j){
                            if(layer[j]._dispatchDblClick(e)){
                                return true;
                            }
                        }
                    }
                }
                if(this._mouseEnable){
                    this.postNotification(this.notifyDblClick,[e]);
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
                        if(layer[j]._dispatchDblClick(e)){
                            return true;
                        }
                    }
                }
            }
            if(this._mouseEnable){
                if(localPoint.x >= localLefTop.x && localPoint.x <= localRigBot.x
                    && localPoint.y >= localLefTop.y && localPoint.y <= localRigBot.y){
                    this.postNotification(this.notifyDblClick,[e]);
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
hy.Node.prototype._dispatchMouseDown = function(e){
    if(this._visible){
        var app = this.getApplication();
        var localPoint = this.transPointFromAncestorNode({x:e.offsetX,y:e.offsetY},null);
        var localLefTop = {x:this._anchorPixelX,y:this._anchorPixelY};
        var localRigBot = {x:this._width + this._anchorPixelX,y:this._height + this._anchorPixelY};
        if(this._clipBound){
            if(localPoint.x >= localLefTop.x && localPoint.x <= localRigBot.x
                && localPoint.y >= localLefTop.y && localPoint.y <= localRigBot.y){
                if(this._mouseEnable && e.button == 0){
                    if(this._dragEnable && this._dragZone
                        && localPoint.x >= this._dragZone.x0 && localPoint.x <= this._dragZone.x1
                        && localPoint.y >= this._dragZone.y0 && localPoint.y <= this._dragZone.y1){
                        app.setMouseDragNode(e,this);
                    }
                }
                var layers = this.getLayers();
                for(var i = layers.length-1;i>=0;--i){
                    var layer = layers[i];
                    if(layer){
                        for(var j = layer.length-1;j>=0;--j){
                            if(layer[j]._dispatchMouseDown(e)){
                                return true;
                            }
                        }
                    }
                }
                if(this._mouseEnable){
                    app.setMouseDownNode(e,this);
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            var flag = false;
            if(this._mouseEnable && e.button == 0){
                if(localPoint.x > localLefTop.x && localPoint.x < localRigBot.x
                    && localPoint.y > localLefTop.y && localPoint.y < localRigBot.y) {
                    flag = true;
                    if (this._dragEnable && this._dragZone
                        && localPoint.x >= this._dragZone.x0 && localPoint.x <= this._dragZone.x1
                        && localPoint.y >= this._dragZone.y0 && localPoint.y <= this._dragZone.y1 ) {
                        app.setMouseDragNode(e,this);
                    }
                }
            }
            var layers = this.getLayers();
            for(var i = layers.length-1;i>=0;--i){
                var layer = layers[i];
                if(layer){
                    for(var j = layer.length-1;j>=0;--j){
                        if(layer[j]._dispatchMouseDown(e)){
                            return true;
                        }
                    }
                }
            }
            if(flag){
                app.setMouseDownNode(e,this);
                return true;
            }else{
                return false;
            }
        }
    }else{
        return false;
    }
}
hy.Node.prototype._dispatchMouseMove = function(e){
    if(this._visible){
        var app = this.getApplication();
        var localPoint = this.transPointFromAncestorNode({x:e.offsetX,y:e.offsetY},null);
        var localLefTop = {x:this._anchorPixelX,y:this._anchorPixelY};
        var localRigBot = {x:this._width + this._anchorPixelX,y:this._height + this._anchorPixelY};
        if(this._clipBound){
            if(localPoint.x >= localLefTop.x && localPoint.x <= localRigBot.x
                && localPoint.y >= localLefTop.y && localPoint.y <= localRigBot.y){
                if(this._mouseEnable){
                    if(this.getWheelEnable()){
                        app.setMouseWheelNode(e,this);
                    }
                }
                var layers = this.getLayers();
                for(var i=layers.length-1;i>=0;--i){
                    var layer = layers[i];
                    if(layer){
                        for(var j = layer.length-1;j>=0;--j){
                            if(layer[j]._dispatchMouseMove(e)){
                                return true;
                            }
                        }
                    }
                }
                if(this._mouseEnable){
                    app.setMouseOverNode(e,this);
                    this.postNotification(this.notifyMouseMove,[e]);
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
                if(localPoint.x >= localLefTop.x && localPoint.x <= localRigBot.x
                    && localPoint.y >= localLefTop.y && localPoint.y <= localRigBot.y){
                    flag = true;
                    if(this.getWheelEnable()){
                        app.setMouseWheelNode(e,this);
                    }
                }
            }
            var layers = this.getLayers();
            for(var i=layers.length-1;i>=0;--i){
                var layer = layers[i];
                if(layer){
                    for(var j=layer.length-1;j>=0;--j){
                        if(layer[j]._dispatchMouseMove(e)){
                            return true;
                        }
                    }
                }
            }
            if(flag){
                app.setMouseOverNode(e,this);
                this.postNotification(this.notifyMouseMove,[e]);
                return true;
            }else{
                return false;
            }
        }
    }else{
        return false;
    }
}
hy.Node.prototype._dispatchContextMenu = function(e){
    if(this._visible){
        var localPoint = this.transPointFromAncestorNode({x:e.offsetX,y:e.offsetY},null);
        var localLefTop = {x:this._anchorPixelX,y:this._anchorPixelY};
        var localRigBot = {x:this._width + this._anchorPixelX,y:this._height + this._anchorPixelY};
        if(this._clipBound){
            if(localPoint.x >= localLefTop.x && localPoint.x <= localRigBot.x
                && localPoint.y >= localLefTop.y && localPoint.y <= localRigBot.y){
                for(var i = this._childNodeLayers.length-1;i>=0;--i){
                    var layer = this._childNodeLayers[i];
                    if(layer){
                        for(var j = layer.length-1;j>=0;--j){
                            if(layer[j]._dispatchContextMenu(e)){
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
                        this.postNotification(this.notifyContextMenu,[e,null]);
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
                        if(layer[j]._dispatchContextMenu(e)){
                            return true;
                        }
                    }
                }
            }
            if(this._mouseEnable){
                if(localPoint.x >= localLefTop.x && localPoint.x <= localRigBot.x
                    && localPoint.y >= localLefTop.y && localPoint.y <= localRigBot.y){
                    if(this._contextMenu != null && this._contextMenu.length > 0){
                        var app = this.getApplication();
                        if(app != null){
                            app.showContextMenu(e,this,this._contextMenu,0);
                        }
                    }else{
                        this.postNotification(this.notifyContextMenu,[e,null]);
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
hy.Node.prototype._dispatchLoop = function(dc,deltaTime,paint){
    /*进入当前帧*/
    this.postNotification(this.notifyEnterFrame,[deltaTime]);
    /*重新布局*/
    if(this._needLayoutSubNodes){
        this.postNotification(this.notifyLayoutSubNodes,null);
        this._needLayoutSubNodes = false;
    }
    /*绘制操作*/
    if(this._visible && paint){
        dc.pushTransform(this._x,this._y,this._scaleX,this._scaleY,this._rotateZ,this._clipBound);
        var rect = {x:this._anchorPixelX,y:this._anchorPixelY,width:this._width,height:this._height};
        this.postNotification(this.notifyPaint,[dc,rect]);
        for(var i = 0, layerCount = this._childNodeLayers.length ; i < layerCount ; ++i){
            var layer = this._childNodeLayers[i];
            if(layer){
                for( var j = 0, nodeCount = layer.length ; j < nodeCount ; ++j){
                    layer[j]._dispatchLoop(dc,deltaTime,true);
                }
            }
        }
        dc.popTransform();
    }else{
        for(var i = 0, layerCount = this._childNodeLayers.length ; i < layerCount ; ++i){
            var layer = this._childNodeLayers[i];
            if(layer){
                for( var j = 0, nodeCount = layer.length ; j < nodeCount ; ++j){
                    layer[j]._dispatchLoop(dc,deltaTime,false);
                }
            }
        }
    }
}

hy.Node.prototype._nodeDragInit = function(e){
    this.__dragStartCanvasPoint = {x:e.offsetX,y:e.offsetY};
    this.__dragStartParentPoint = {x:this.getX(), y:this.getY()};
    this.__dragReady = true;
}
hy.Node.prototype._nodeDragImpl = function(sender, e){
    var parent = this.getParent();
    if(parent == null){
        this.setX(e.offsetX + this.__dragStartParentPoint.x - this.__dragStartCanvasPoint.x);
        this.setY(e.offsetY + this.__dragStartParentPoint.y - this.__dragStartCanvasPoint.y);
    }else{
        var parentCurPoint = parent.transPointFromAncestorNode({x:e.offsetX,y:e.offsetY},null);
        var parentStartPoint = parent.transPointFromAncestorNode(this.__dragStartCanvasPoint,null);
        this.setX(parentCurPoint.x + this.__dragStartParentPoint.x - parentStartPoint.x);
        this.setY(parentCurPoint.y + this.__dragStartParentPoint.y - parentStartPoint.y);
    }
}
hy.Node.prototype._nodeDragEnd = function(sender, e){
    this.__dragReady = false;
}
hy.Node.prototype._clipBoundForNode = function(sender, dc, rect){
    if(this._clipBound){
        dc.beginPath();
        if(this._cornorRadius > 0){
            var rbx = rect.x + rect.width;
            var rby = rect.y + rect.height;
            dc.moveTo(rect.x,rect.y+this._cornorRadius);
            dc.arcTo(rect.x,rect.y,rect.x+this._cornorRadius,rect.y,this._cornorRadius);
            dc.lineTo(rbx-this._cornorRadius,rect.y);
            dc.arcTo(rbx,rect.y,rbx,rect.y+this._cornorRadius,this._cornorRadius);
            dc.lineTo(rbx,rby-this._cornorRadius);
            dc.arcTo(rbx,rby,rbx-this._cornorRadius,rby,this._cornorRadius);
            dc.lineTo(rect.x+this._cornorRadius,rby);
            dc.arcTo(rect.x,rby,rect.x,rby-this._cornorRadius,this._cornorRadius);
            dc.lineTo(rect.x,rect.y+this._cornorRadius);
        }else{
            dc.rect(rect.x,rect.y,rect.width,rect.height);
        }
        dc.clip();
    }
}

hy.Node.prototype._syncAnchorPixelX = function(sender){
    this._anchorPixelX = -Math.round(this._anchorX * this._width);
}
hy.Node.prototype._syncAnchorPixelY = function(sender){
    this._anchorPixelY = -Math.round(this._anchorY * this._height);
}
hy.Node.prototype._syncSinRotateZ = function(sender){
    this._sinRotateZ = Math.sin(this._rotateZ);
}
hy.Node.prototype._syncCosRotateZ = function(sender){
    this._cosRotateZ = Math.cos(this._rotateZ);
}
hy.Node.prototype.destory = function(){
    this.superCall("destory");
}
