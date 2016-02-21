var hy = hy || {};
hy.Application = hy.extend(hy.Observable);
hy.Application.prototype.notifySyncWinWidth = "syncwinwidth";
hy.Application.prototype.notifySyncWinHeight = "syncwinheight";
hy.Application.prototype.notifySyncRenderContext = "syncrendercontext";
hy.Application.prototype.defaultWinWidth = 600;
hy.Application.prototype.defaultWinHeight = 400;
hy.Application.prototype.init = function(config){
    this.superCall("init",[config]);
    this._winWidth = this.isUndefined(config.winWidth) ? this.defaultWinWidth : config.winWidth;
    this._winHeight = this.isUndefined(config.winHeight) ? this.defaultWinHeight : config._winHeight;
    this._fullScreen = this.isUndefined(config.fullScreen) ? true : config.fullScreen;
    this._refreshMode = this.isUndefined(config.refreshMode) ? 0 : config.refreshMode;
    this._scaleMode = this.isUndefined(config.scaleMode) ? 0 : config.scaleMode;

    this._renderContext = null;
    this._scaleX = 1;
    this._scaleY = 1;

    this._mainLoopHandler = 0;
    this._mainLoop = this.mainLoop.bind(this);
    this._preLoopTime = 0;

    this._refresh = true;

    this._mouseDown = false;
    this._mouseCursor = "default";

    this._focusNode = null;
    this._mouseDownNodes = [];
    this._mouseOverNodes = [];
    this._mouseDragNodes = [];
    this._mouseWheelNodes = [];
    this._mousePoints = [];

    this._runNodeStack = [];
    this._runNode = null;

    this._actionManager = new hy.action.Manager({});
    this._fileLoader = new hy.net.FileLoader({});
    this._inputTextBox = new hy.html.TextBox({});
    this._contextMenu = new hy.gui.SimpleListView({});
    //this._inputNode = null;
    //this._inputTextBox = document.createElement("input");
    //this._inputTextBox.type = "text";
    //this._inputTextBox.style.zIndex = "999";
    //this._inputTextBox.style.position = "absolute";
    //this._inputTextBox.style.borderStyle = "solid";
    //this._inputTextBox.style.backgroundColor = "transparent";
    //this._inputTextBox.style.display = "none";
    //hy.event.addEventListener(this._inputTextBox,this,"mousedown",function(e){
    //    var e = event ? event : e;
    //    try{
    //        e.stopPropagation();
    //    }catch (err){
    //        e.cancelBubble = true;
    //    }
    //});
    //hy.event.addEventListener(this._inputTextBox,this,"mouseup",function(e){
    //    var e = event ? event : e;
    //    try{
    //        e.stopPropagation();
    //    }catch (err){
    //        e.cancelBubble = true;
    //    }
    //});
    //hy.event.addEventListener(this._inputTextBox,this,"keypress",function(e){
    //    var e = event ? event : e;
    //    if(e.keyCode == hy.event.key.ENTER){
    //        if(this._inputNode){
    //            try{
    //                this._inputNode.postNotification(this._inputNode.notifyBlur,[e]);
    //            }catch (err){
    //                window.console.log(err);
    //            }
    //        }
    //    }
    //});
    //document.body.appendChild(this._inputTextBox);

    this.addObserver(this.notifySyncWinWidth,this,this._syncRenderContextSize);
    this.addObserver(this.notifySyncWinHeight,this,this._syncRenderContextSize);
    this.addObserver(this.notifySyncRenderContext,this,this._syncRenderContextSize);
}
hy.Application.prototype.sync = function(){
    this.superCall("sync",null);
    this._syncRenderContextSize();
}
hy.Application.prototype.setWinWidth = function(width){
    if(this._winWidth != width){
        this._winWidth = width;
        this.postNotification(this.notifySyncWinWidth,null);
    }
}
hy.Application.prototype.setWinWidth = function(){
    return this._winWidth;
}
hy.Application.prototype.setWinHeight = function(height){
    if(this._winHeight != height){
        this._winHeight = height;
        this.postNotification(this.notifySyncWinHeight,null);
    }
}
hy.Application.prototype.getWinHeight = function(){
    return this._winHeight;
}
hy.Application.prototype.setRenderContext = function(renderContext){
    if(this._renderContext != renderContext){
        this._renderContext = renderContext;
        if(this._renderContext){
            this.postNotification(this.notifySyncRenderContext,null);
        }
    }
}
hy.Application.prototype.getRenderContext = function(){
    return this._renderContext;
}
hy.Application.prototype.getScaleX = function(){
    return this._scaleX;
}
hy.Application.prototype.getScaleY = function(){
    return this._scaleY;
}

hy.Application.prototype.setMouseDown = function(down){
    this._mouseDown = down;
}
hy.Application.prototype.getMouseDown = function(){
    return this._mouseDown;
}
hy.Application.prototype.setMouseCursor = function(mouseCursor){
    if(this._renderContext){
        var canvas = this._renderContext.getCanvas();
        if(canvas){
            if(mouseCursor){
                if(this._mouseCursor != mouseCursor){
                    this._mouseCursor = mouseCursor;
                    canvas.style.cursor = mouseCursor;
                }
            }else{
                this._mouseCursor = "default";
                canvas.style.cursor = this._mouseCursor;
            }
        }
    }
}

hy.Application.prototype.setInputNode = function(node){
    this._inputNode = node;
}
hy.Application.prototype.getInputNode = function(){
    return this._inputNode;
}
hy.Application.prototype.getInputTextBox = function(){
    return this._inputTextBox;
}

hy.Application.prototype.setFocusNode = function(e,node){
    if(node){
        if(this._focusNode){
            if(this._focusNode != node){
                var preFocusNode = this._focusNode;
                this._focusNode = node;
                preFocusNode.postNotification(preFocusNode.notifyBlur,[e]);
                node.postNotification(node.notifyFocus,[e]);
            }
        }else{
            this._focusNode = node;
            node.postNotification(node.notifyFocus,[e]);
        }
    }else{
        if(this._focusNode){
            var preFocusNode = this._focusNode;
            this._focusNode = null;
            preFocusNode.postNotification(preFocusNode.notifyBlur,[e]);
        }
    }
}
hy.Application.prototype.getFocusNode = function(){
    return this._focusNode;
}

hy.Application.prototype.setMouseDownNode = function(e,node){
    this._mouseDownNodes[e.identifier] = node;
    if(node){
        this.setFocusNode(e, node);
        node.postNotification(node.notifyMouseDown,[e]);
    }else{
        this.setFocusNode(e, null);
    }
}
hy.Application.prototype.getMouseDownNode = function(id){
    if(id < this._mouseDownNodes.length){
        return this._mouseDownNodes[id];
    }else{
        return null;
    }
}
hy.Application.prototype.getMouseDownNodes = function(){
    return this._mouseDownNodes;
}

hy.Application.prototype.setMouseOverNode = function(e,node){
    if(this._mouseOverNodes[e.identifier]){
        if(this._mouseOverNodes[e.identifier] != node){
            var preOverNode = this._mouseOverNodes[e.identifier];
            this._mouseOverNodes[e.identifier] = node;
            preOverNode.postNotification(preOverNode.notifyMouseOut,[e]);
            if(node){
                node.postNotification(node.notifyMouseOver,[e]);
            }
        }
    }else{
        this._mouseOverNodes[e.identifier] = node;
        if(node){
            node.postNotification(node.notifyMouseOver,[e]);
        }
    }
}
hy.Application.prototype.getMouseOverNode = function(id){
    if(id < this._mouseOverNodes.length){
        return this._mouseOverNodes[id];
    }else{
        return null;
    }
}
hy.Application.prototype.getMouseOverNodes = function(){
    return this._mouseOverNodes;
}

hy.Application.prototype.setMouseDragNode = function(e,node){
    this._mouseDragNodes[e.identifier] = node;
    if(node){
        node._nodeDragInit(e);
    }
}
hy.Application.prototype.getMouseDragNode = function(id){
    if(id < this._mouseDragNodes.length){
        return this._mouseDragNodes[id];
    }else{
        return null;
    }
}
hy.Application.prototype.getMouseDragNodes = function(){
    return this._mouseDragNodes;
}

hy.Application.prototype.setMouseWheelNode = function(e,node){
    this._mouseWheelNodes[e.identifier] = node;
}
hy.Application.prototype.getMouseWheelNode = function(id){
    if(id < this._mouseWheelNodes.length){
        return this._mouseWheelNodes[id];
    }else{
        return null;
    }
}
hy.Application.prototype.getMouseWheelNodes = function(){
    return this._mouseWheelNodes;
}

hy.Application.prototype.setMousePoint = function(e,point){
    this._mousePoints[e.identifier] = location;
}
hy.Application.prototype.getMousePoint = function(id){
    if(id < this._mousePoints.length){
        return this._mousePoints[id];
    }else{
        return null;
    }
}
hy.Application.prototype.getMousePoints = function(){
    return this._mousePoints;
}

hy.Application.prototype.showContextMenu = function(e,node,menuItems,menuType){}
hy.Application.prototype.hideContextMenu = function(){}
hy.Application.prototype.getActionManager = function(){
    return this._actionManager;
}
hy.Application.prototype.getFileLoader = function(){
    return this._fileLoader;
}

hy.Application.prototype.pause = function(){
    this._actionManager.pause();
}
hy.Application.prototype.resume = function(){
    this._actionManager.resume();
}


//var time = 0;
//var count = 0;
hy.Application.prototype.refresh = function(){
    this._refresh = true;
}
hy.Application.prototype.pushRunNode = function(node){
    if(node){
        node.setApplication(this);
        node.setParent(null);
        this._runNodeStack.push(node);
        this._runNode = node;
    }
}
hy.Application.prototype.popRunNode = function(node){
    var node = this._runNode;
    this._runNodeStack.pop();
    if(this._runNodeStack.length > 0){
        this._runNode = this._runNodeStack[this._runNodeStack.length-1];
    }else{
        this._runNode = null;
    }
}
hy.Application.prototype.run = function(node){
    this._preLoopTime = 0;
    this._mainLoopHandler = 0;
    this.pushRunNode(node);
    this.initApp();
    this.mainLoop();
}
hy.Application.prototype.mainLoop = function(){
    var deltaTime;
    if(this._preLoopTime != 0){
        var curFrameTime = (new Date()).getTime();
        deltaTime = curFrameTime - this._preLoopTime;
        this._preLoopTime = curFrameTime;
    }else{
        this._preLoopTime = (new Date()).getTime();
        deltaTime = 0;
    }
    if(this._runNode){
        if(this._refresh || this._refreshMode == 1){
            this._refresh = false;
            this._renderContext.clearRect(0,0,this._winWidth,this._winHeight);
            this._runNode._dispatchLoop(this._renderContext, deltaTime, true);
        }
    }
    //time += deltaTime;
    //count ++;
    //if(time > 3000){
    //    console.log(count/3);
    //    time = 0;
    //    count = 0;
    //}
    if(this._mainLoopHandler == 0){
        if (window.requestAnimationFrame)
            window.requestAnimationFrame(this._mainLoop);
        else if (window.msRequestAnimationFrame)
            window.msRequestAnimationFrame(this._mainLoop);
        else if (window.webkitRequestAnimationFrame)
            window.webkitRequestAnimationFrame(this._mainLoop);
        else if (window.mozRequestAnimationFrame)
            window.mozRequestAnimationFrame(this._mainLoop);
        else if (window.oRequestAnimationFrame)
            window.oRequestAnimationFrame(this._mainLoop);
        else
            this._mainLoopHandler = window.setInterval(this._mainLoop, 16.7);
    }
}

hy.Application.prototype.initApp = function(){
    this.initContext();
    this.initEventDispatcher();
}
hy.Application.prototype.initContext = function(){
    if(!this._renderContext){
        var doc = document;
        var canvas = document.createElement("canvas");
        canvas.innerText = "your brower doesn't support canvas element!";
        //canvas.style.backgroundColor = "#000000";
        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
        doc.body.appendChild(canvas);
        this.setRenderContext(new hy.RenderContext({canvas:canvas}));
        this._syncRenderContextSize();
        hy.event.addEventListener(window, "resize" , this, this._syncRenderContextSize);
    }
}
hy.Application.prototype.initEventDispatcher = function(){
    var doc = document;
    var canvas = this._renderContext.getCanvas();
    if(hy.platform.isMobile()){
        hy.event.addEventListener(doc,"touchstart", this, function(e){
            if(this._runNode){
                var e = event ? event : e;
                var canvas = this._renderContext.getCanvas();
                for(var i= 0, touchCount = e.changedTouches.length ;i<touchCount;++i){
                    var curTouch = hy.event.createEvent(e,this,canvas,e.changedTouches[i]);
                    this.setMousePoint({x:curTouch.offsetX,y:curTouch.offsetY},curTouch);
                    this.setMouseDownNode(curTouch, null);
                    this.setMouseDragNode(curTouch, null);
                }
            }
        });
        hy.event.addEventListener(doc,"touchmove", this, function(e){
            if(this._runNode != null) {
                var e = event?event:e;
                var canvas = this.getRenderContext().getCanvas();
                for(var i= 0,touchCount=e.changedTouches.length ; i<touchCount ; ++i){
                    var curTouch = hy.event.createEvent(e,this,canvas,e.changedTouches[i]);
                    var mousePoint = this.getMousePoint(curTouch.identifier);
                    if(!mousePoint || mousePoint.x != curTouch.offsetX || mousePoint.y != curTouch.offsetY){
                        var mouseDownNode = this.getMouseDownNode(curTouch.identifier);
                        var mouseDragNode = this.getMouseDragNode(curTouch.identifier);
                        this.setMousePoint({x:curTouch.offsetX,y:curTouch.offsetY},curTouch);
                        this.setMouseOverNode(curTouch, null);
                        if(mouseDragNode){
                            if(mouseDragNode != mouseDownNode){
                                this.setMouseDownNode(curTouch,mouseDragNode);
                            }
                            if(mouseDragNode.dragReady()){
                                mouseDragNode.postNotification(mouseDragNode.notifyDraging,[curTouch]);
                            }
                        }
                    }
                }
            }
        });
        hy.event.addEventListener(doc,"touchend", this, function(e){
            if(this._runNode != null){
                var e = event?event:e;
                var canvas = this.getRenderContext().getCanvas();
                for(var i= 0,touchCount=e.changedTouches.length ; i<touchCount ; ++i){
                    var curTouch = hy.event.createEvent(e,this,canvas,e.changedTouches[i]);
                    var mouseDownNode = this.getMouseDownNode(curTouch.identifier);
                    this.setMousePoint(curTouch, null);
                    this.setMouseDownNode(curTouch, null);
                    this.setMouseDragNode(curTouch, null);
                    this.setMouseOverNode(curTouch, null);
                    if(mouseDownNode){
                        mouseDownNode.postNotification(mouseDownNode.notifyMouseDown,[curTouch]);
                        if(mouseDownNode.dragReady()){
                            mouseDownNode.postNotification(mouseDownNode.notifyDragEnd,[curTouch]);
                        }
                    }
                }
            }
        });
        hy.event.addEventListener(doc,"touchcancel", this, function(e){
            if(this._runNode != null){
                var e = event?event:e;
                var canvas = this.getRenderContext().getCanvas();
                for(var i= 0,touchCount=e.changedTouches.length ; i<touchCount ; ++i){
                    var curTouch = hy.event.createEvent(e,this,canvas,e.changedTouches[i]);
                    var mouseDownNode = this.getMouseDownNode(curTouch.identifier);
                    this.setMousePoint(curTouch, null);
                    this.setMouseDownNode(curTouch, null);
                    this.setMouseDragNode(curTouch, null);
                    this.setMouseOverNode(curTouch, null);
                    if(mouseDownNode){
                        mouseDownNode.postNotification(mouseDownNode.notifyMouseDown,[curTouch]);
                        if(mouseDownNode.dragReady()){
                            mouseDownNode.postNotification(mouseDownNode.notifyDragEnd,[curTouch]);
                        }
                    }
                }
            }
        });
        hy.event.addEventListener(canvas,"touchstart", this, function(e){
            if(this._runNode){
                var e = event?event:e;
                var canvas = this.getRenderContext().getCanvas();
                for(var i= 0,touchCount = e.changedTouches.length ; i<touchCount ; ++i){
                    var curTouch = hy.event.createEvent(e,this,canvas,e.changedTouches[i]);
                    this.setMousePoint({x:curTouch.offsetX,y:curTouch.offsetY},curTouch);
                    this._runNode._dispatchMouseDown(curTouch);
                }
                this.hideContextMenu();
            }
        });
        hy.event.addEventListener(canvas,"touchmove", this, function(e){
            if(this._runNode){
                var e = event?event:e;
                var canvas = this.getRenderContext().getCanvas();
                for(var i= 0,touchCount = e.changedTouches.length ; i<touchCount ; ++i){
                    var curTouch = hy.event.createEvent(e,this,canvas,e.changedTouches[i]);
                    var mousePoint = this.getMousePoint(curTouch.identifier);
                    if(!mousePoint || mousePoint.x != curTouch.offsetX || mousePoint.y != curTouch.offsetY){
                        this.setMousePoint({x:curTouch.offsetX,y:curTouch.offsetY},curTouch);
                        var mouseDownNode = this.getMouseDownNode(curTouch.identifier);
                        var mouseDragNode = this.getMouseDragNode(curTouch.identifier);
                        if(mouseDragNode){
                            if(mouseDragNode != mouseDownNode){
                                this.setMouseDownNode(curTouch, mouseDragNode);
                            }
                            if(mouseDragNode.dragReady()){
                                mouseDragNode.postNotification(mouseDragNode.notifyDraging,[curTouch]);
                            }else{
                                if(!this._runNode._dispatchMouseMove(curTouch)){
                                    this.setMouseOverNode(curTouch, null);
                                }
                            }
                        }else{
                            if(!this._runNode._dispatchMouseMove(curTouch)){
                                this.setMouseOverNode(curTouch, null);
                            }
                        }
                    }
                }
            }
        });
        hy.event.addEventListener(canvas,"touchend", this, function(e){
            if(this._runNode){
                var e = event?event:e;
                var canvas = this.getRenderContext().getCanvas();
                for(var i= 0,touchCount = e.changedTouches.length ; i<touchCount ; ++i){
                    var curTouch = hy.event.createEvent(e,this,canvas,e.changedTouches[i]);
                    var mouseDownNode = this.getMouseDownNode(curTouch.identifier);
                    this.setMousePoint(curTouch, null);
                    this.setMouseDownNode(curTouch, null);
                    this.setMouseOverNode(curTouch, null);
                    this.setMouseDragNode(curTouch, null);
                    if(mouseDownNode){
                        mouseDownNode.postNotification(mouseDownNode.notifyMouseUp,[curTouch]);
                        if(mouseDownNode.dragReady()){
                            mouseDownNode.postNotification(mouseDownNode.notifyDragEnd,[curTouch]);
                        }
                    }
                }
            }
        });
        hy.event.addEventListener(canvas,"touchcancel", this, function(e){
            if(this._runNode){
                var e = event?event:e;
                var canvas = this.getRenderContext().getCanvas();
                for(var i= 0,touchCount = e.changedTouches.length ; i<touchCount ; ++i){
                    var curTouch = hy.event.createEvent(e,this,canvas,e.changedTouches[i]);
                    var mouseDownNode = this.getMouseDownNode(curTouch.identifier);
                    this.setMousePoint(curTouch, null);
                    this.setMouseDownNode(curTouch, null);
                    this.setMouseOverNode(curTouch, null);
                    this.setMouseDragNode(curTouch, null);
                    if(mouseDownNode){
                        mouseDownNode.postNotification(mouseDownNode.notifyMouseUp,[curTouch]);
                        if(mouseDownNode.dragReady()){
                            mouseDownNode.postNotification(mouseDownNode.notifyDragEnd,[curTouch]);
                        }
                    }
                }
            }
        });
    }else{
        hy.event.addEventListener(doc,"keydown", this, function(e){
            if(this._runNode){
                var canvas = this.getRenderContext().getCanvas();
                var e = hy.event.createEvent(e, this, canvas);
                this._runNode._dispatchKeyDown(e);
            }
        });
        hy.event.addEventListener(doc,"keypress", this, function(e){
            if(this._runNode){
                var canvas = this.getRenderContext().getCanvas();
                var e = hy.event.createEvent(e, this, canvas);
                this._runNode._dispatchKeyPress(e);
            }
        });
        hy.event.addEventListener(doc,"keyup", this, function(e){
            if(this._runNode){
                var canvas = this.getRenderContext().getCanvas();
                var e = hy.event.createEvent(e, this, canvas);
                this._runNode._dispatchKeyUp(e);
            }
        });
        hy.event.addEventListener(doc,"mousedown", this, function(e){
            this.setMouseDown(true);
            if(this._runNode){
                var canvas = this.getRenderContext().getCanvas();
                var e = hy.event.createEvent(e, this, canvas);
                this.setMouseDownNode(e , null);
                this.setMouseDragNode(e , null);
                this.setMousePoint({x:e.offsetX,y:e.offsetY},e);
            }
        });
        hy.event.addEventListener(doc,"mousemove", this, function(e){
            if(this._runNode){
                var canvas = this.getRenderContext().getCanvas();
                var e = hy.event.createEvent(e, this, canvas);
                var mousePoint = this.getMousePoint(e.identifier);
                if(!mousePoint || mousePoint.x != e.offsetX || mousePoint.y != e.offsetY){
                    this.setMousePoint({x:e.offsetX,y:e.offsetY},e);
                    if (this.getMouseDown()) {
                        var mouseDownNode = this.getMouseDownNode(e.identifier);
                        var mouseDragNode = this.getMouseDragNode(e.identifier);
                        this.setMouseOverNode(e, null);
                        this.setMouseWheelNode(e, null);
                        if(mouseDragNode){
                            if(mouseDragNode != mouseDownNode){
                                this.setMouseDownNode(e, mouseDragNode);
                            }
                            if(mouseDragNode && mouseDragNode.dragReady()){
                                mouseDragNode.postNotification(mouseDragNode.notifyDraging, [e]);
                            }
                        }
                    }
                }
            }
        });
        hy.event.addEventListener(doc,"mouseup", this, function(e){
            this.setMouseDown(false);
            if(this._runNode){
                var canvas = this.getRenderContext().getCanvas();
                var e = hy.event.createEvent(e, this, canvas);
                var mouseDownNode = this.getMouseDownNode(e.identifier);
                this.setMouseDownNode(e , null);
                this.setMouseDragNode(e , null);
                if(mouseDownNode){
                    mouseDownNode.postNotification(mouseDownNode.notifyMouseDown,[e]);
                    if(mouseDownNode.dragReady()){
                        mouseDownNode.postNotification(mouseDownNode.notifyDragEnd,[e]);
                    }
                }
            }
        });
        hy.event.addEventListener(doc,"mousewheel", this, function(e){
            if(this._runNode){
                var canvas = this.getRenderContext().getCanvas();
                var e = hy.event.createEvent(e, this, canvas);
                var mouseWheelNode = this.getMouseWheelNode(e.identifier);
                if(mouseWheelNode){
                    mouseWheelNode.postNotification(mouseWheelNode.notifyMouseWheel,[e]);
                }
            }
        });
        hy.event.addEventListener(doc,"DOMMouseScroll",this, function(e){
            if(this._runNode){
                var canvas = this.getRenderContext().getCanvas();
                var e = hy.event.createEvent(e, this, canvas);
                var mouseWheelNode = this.getMouseWheelNode(e.identifier);
                if(mouseWheelNode){
                    mouseWheelNode.postNotification(mouseWheelNode.notifyMouseWheel,[e]);
                }
            }
        });
        hy.event.addEventListener(canvas,"click", this, function(e){
            if(this._runNode){
                var e = hy.event.createEvent(e,this);
                if(e.button == 0){
                    this._runNode._dispatchClick(e);
                }
                e.stopDispatch();
                e.preventDefault();
            }
        });
        hy.event.addEventListener(canvas,"dblclick", this, function(e){
            if(this._runNode){
                var e = hy.event.createEvent(e,this);
                if(e.button == 0){
                    this._runNode._dispatchDblClick(e);
                }
                e.stopDispatch();
                e.preventDefault();
            }
        });
        hy.event.addEventListener(canvas,"contextmenu", this, function(e){
            if(this._runNode){
                var e = hy.event.createEvent(e,this);
                this._runNode._dispatchContextMenu(e);
                e.stopDispatch();
                e.preventDefault();
            }
        });
        hy.event.addEventListener(canvas,"mousedown", this, function(e){
            this.setMouseDown(true);
            if(this._runNode){
                var e = hy.event.createEvent(e,this);
                if(e.button == 0){
                    this._runNode._dispatchMouseDown(e);
                }
                this.hideContextMenu();
                e.stopDispatch();
                e.preventDefault();
            }
        });
        hy.event.addEventListener(canvas,"mousemove", this, function(e){
            if(this._runNode) {
                var e = hy.event.createEvent(e, this);
                var mousePoint = this.getMousePoint(e.identifier);
                if(!mousePoint || mousePoint.x != e.offsetX || mousePoint.y != e.offsetY){
                    this.setMousePoint({x: e.offsetX, y: e.offsetY}, e);
                    if (this.getMouseDown()) {
                        var mouseDownNode = this.getMouseDownNode(e.identifier);
                        var mouseDragNode = this.getMouseDragNode(e.identifier);
                        if(mouseDragNode){
                            if(mouseDragNode != mouseDownNode){
                                this.setMouseDownNode(e , mouseDragNode);
                            }
                            if(mouseDragNode && mouseDragNode.dragReady()){
                                mouseDragNode.postNotification(mouseDragNode.notifyDraging,[e]);
                            }else{
                                if(!this._runNode._dispatchMouseMove(e)){
                                    this.setMouseOverNode(e, null);
                                }
                            }
                        }else{
                            if (!this._runNode._dispatchMouseMove(e)) {
                                this.setMouseOverNode(e, null);
                            }
                        }
                    }else{
                        if (!this._runNode._dispatchMouseMove(e)) {
                            this.setMouseOverNode(e, null);
                        }
                    }
                }
                e.stopDispatch();
                e.preventDefault();
            }
        });
        hy.event.addEventListener(canvas,"mouseup", this, function(e){
            this.setMouseDown(false);
            if(this._runNode){
                var canvas = this.getRenderContext().getCanvas();
                var e = hy.event.createEvent(e, this, canvas);
                var mouseDownNode = this.getMouseDownNode(e.identifier);
                this.setMouseDownNode(e , null);
                this.setMouseDragNode(e , null);
                if(mouseDownNode){
                    mouseDownNode.postNotification(mouseDownNode.notifyMouseUp,[e]);
                    if(mouseDownNode.dragReady()){
                        mouseDownNode.postNotification(mouseDownNode.notifyDragEnd,[e]);
                    }
                }
                e.stopDispatch();
                e.preventDefault();
            }
        });
    }
}
hy.Application.prototype._syncRenderContextSize = function(){
    if(this._renderContext){
        var canvas = this._renderContext.getCanvas();
        if(canvas){
            var docSize = hy.dom.getDocumentSize();
            canvas.style.width = docSize.width + "px";
            canvas.style.height = docSize.height + "px";
            if(this._fullScreen){
                switch(this._scaleMode){
                    case 0:{
                        this._winWidth = docSize.width;
                        this._winHeight = docSize.height;
                        break;
                    }
                    case 1:{
                        var winHeight = Math.floor(this._winWidth * docSize.height / docSize.width);
                        this._winHeight = docSize.height;
                        break;
                    }
                    case 2:{
                        var winWidth = Math.floor(this._winHeight *  docSize.width / docSize.height);
                        this._winWidth = docSize.width;
                        break;
                    }
                    default :
                        break;
                }
            }else{
                this._winWidth = docSize.width;
                this._winHeight = docSize.height;
            }
            //this._renderContext.setSize(this._winWidth, this._winHeight);
            canvas.setAttribute("width",this._winWidth);
            canvas.setAttribute("height",this._winHeight);
            this._scaleX = this._winWidth / docSize.width;
            this._scaleY = this._winHeight / docSize.height;
            this.refresh();
        }
    }
}