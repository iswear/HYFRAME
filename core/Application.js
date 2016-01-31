var g_arrow = 0;
var g_cycletime = 0;
var g_cyclecount = 0;
HY.Core.Application = function(config){
    this.init(config);
}
HY.Core.Application.prototype = new HY.Object();
HY.Core.Application.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.appWidth != undefined){ this._appWidth = config.appWidth; } else { this._appWidth = 400; }
    if(config.appHeight != undefined){ this._appHeight = config.appHeight; } else { this._appHeight = 300; }
    if(config.fullScreen != undefined){ this._fullScreen = config.fullScreen; } else { this._fullScreen = true; }
    if(config.scaleMode != undefined){ this._scaleMode = config.scaleMode; } else { this._scaleMode = 0; }
    if(config.refreshMode != undefined){ this._refreshMode = config.refreshMode; } else { this._refreshMode = 0; }

    this._renderContext = null;
    this._scaleX = 1;
    this._scaleY = 1;
    this._rootNode = null;
    this._focusNode = null;
    this._mouseDownNode = [];
    this._mouseOverNode = [];
    this._waitDragNode = [];
    this._waitScrollNode = [];
    this._mousePos = [];
    this._dragClipBoard = [];
    this._mouseDownFlag = false;

    this._mouseCursor = null;
    this._inputCursor = document.createElement("input");
    this._inputNode = null;
    this._contextMenu = null;
    this._clipBoard = null;
    this._renderLoopHandle = null;
    this._preFrameTime = null;
    this._reRenderFlag = true;

    this._actionManager =  new HY.Core.Action.Manager({});		//动作管理器
    this._resourceManager = new HY.Core.Resource.Manager({});	//资源管理器

    /*临时调试*/
    this._console = document.getElementById("1");
}
HY.Core.Application.prototype.initConstraint = function(config){
    this.superCall("initConstraint");
    if(this._renderContext){
        this._renderContext.setWidth(this._appWidth);
    }
    if(this._renderContext){
        this._renderContext.setHeight(this._appHeight);
    }
    this._inputCursor.type = "text";
    this._inputCursor.style.zIndex = "999";
    this._inputCursor.style.position = "absolute";
    this._inputCursor.style.borderStyle = "solid";
    this._inputCursor.style.backgroundColor = "transparent";
    this._inputCursor.style.display = "none";
    HY.Core.Event.addListener(this._inputCursor,this,"mousedown",function(e){
        var pEvent = new HY.Core.Event.eArg(e,this);
        pEvent.stopDispatch();
    });
    HY.Core.Event.addListener(this._inputCursor,this,"mouseup",function(e){
        var pEvent = new HY.Core.Event.eArg(e,this);
        pEvent.stopDispatch();
    });
    HY.Core.Event.addListener(this._inputCursor,this,"keypress",function(e){
        var pEvent = new HY.Core.Event.eArg(e,this);
        if(pEvent.keyCode == HY.Core.Event.KEYCODE.ENTER){
            if(this._inputNode){
                try{
                    this._inputNode.blur();
                }catch (err){
                    window.console.log(err);
                }
            }
        }
    });
    document.body.appendChild(this._inputCursor);
}
HY.Core.Application.prototype.showContextMenu = function(e,node,menuItems,menuType){
    if(this._rootNode != null){
        if(this._contextMenu == null){
            this._contextMenu = new HY.GUI.SimpleListView({
                width:150,
                rowHeight:25,
                borderWidth:1,
                borderColor:'#222222',
                backgroundColor:'#ffffff',
                autoSizeFit:true
            });
            this._contextMenu.addEventListener("cellmousedown",function(sender,e,cellView){
                this._contextMenu.setUserProperty("menushown",true);
            },this);
            this._contextMenu.addEventListener("cellmouseup",function(sender,e,cellView){
                var menutype = this._contextMenu.getUserProperty("menutype");
                var menunode = this._contextMenu.getUserProperty("menunode");
                if(menutype == 0 && menunode.onContextMenu){
                    menunode.onContextMenu(sender,e,cellView);
                }
                if(menutype == 1 && menunode.onDropItem){
                    menunode.onDropItem(sender,e,cellView);
                }
                this._contextMenu.setUserProperty("menushown",false);
                this.hideContextMenu();
            },this);
            this._rootNode.addChildNodeAtLayer(this._contextMenu,2);
        }
        if(menuType == 0){
            this._contextMenu.setUserProperty("menunode",node);
            this._contextMenu.setUserProperty("menutype",0);
            this._contextMenu.setX(e.offsetX-this._rootNode.getX());
            this._contextMenu.setY(e.offsetY-this._rootNode.getY());
            this._contextMenu.setItems(menuItems);
            this._contextMenu.setVisible(true);
        }else{
            var pos = node.transPointToCanvas(new HY.Vect2D({x:0,y:node.getHeight()}));
            this._contextMenu.setUserProperty("menunode",node);
            this._contextMenu.setUserProperty("menutype",1);
            this._contextMenu.setX(pos.x-this._rootNode.getX());
            this._contextMenu.setY(pos.y-this._rootNode.getY());
            this._contextMenu.setItems(menuItems);
            this._contextMenu.setVisible(true);
        }
    }
}
HY.Core.Application.prototype.hideContextMenu = function(){
    if(this._contextMenu != null){
        if(!this._contextMenu.getUserProperty("menushown")){
            this._contextMenu.setVisible(false);
        }
        var menutype = this._contextMenu.getUserProperty("menutype");
        var menunode = this._contextMenu.getUserProperty("menunode");
        if(menunode && menutype == 1){
            menunode.setSelected(false);
        }
    }
}
HY.Core.Application.prototype.getClipBoard = function(){
	return this._clipBoard;
}
HY.Core.Application.prototype.setClipBoard = function(pData){
	this._clipBoard = pData;
}
HY.Core.Application.prototype.getDragClipBoard = function(identifier){
	if(identifier == undefined){ identifier = 0; }
	if(identifier < this._dragClipBoard.length){
		return this._dragClipBoard[identifier];
	}else{
		return null;
	}
}
HY.Core.Application.prototype.setDragClipBoard = function(pData,pEvent){
    var eid = pEvent.identifier;
	if(eid == undefined){ eid = 0; }
	this._dragClipBoard[eid] = pData;
}
HY.Core.Application.prototype.getFocusNode = function(){
    return this._focusNode;
}
HY.Core.Application.prototype.setFocusNode = function(pNode, e){
    if(pNode){
        if(this._focusNode){
            if(this._focusNode != pNode){
                this._focusNode.blur(this._focusNode);
                this._focusNode = pNode;
                this._focusNode.onFocus(this._focusNode, e);
            }
        }else{
            this._focusNode = pNode;
            this._focusNode.onFocus(this._focusNode, e);
        }
    }
}
HY.Core.Application.prototype.getMouseDownNode = function(identifier){
	if(identifier == undefined){ identifier = 0; }
	if(identifier < this._mouseDownNode.length){
		return this._mouseDownNode[identifier];
	}else{
		return null;
	}
}
HY.Core.Application.prototype.setMouseDownNode = function(pNode,e){
    var eid = e.identifier;
	if(eid == undefined){ eid = 0; }
    this._mouseDownNode[eid] = pNode;
    if(pNode){
        pNode.onMouseDown(pNode, e);
    }
}
HY.Core.Application.prototype.getMouseDownNodes = function(){
    return this._mouseDownNode;
}
HY.Core.Application.prototype.getWaitDragNode = function(identifier){
    if(identifier == undefined){ identifier = 0; }
    if(identifier < this._waitDragNode.length){
        return this._waitDragNode[identifier];
    }else{
        return null;
    }
}
HY.Core.Application.prototype.setWaitDragNode = function(pNode,pEvent){
    var eid = pEvent.identifier;
    if(eid == undefined){ eid = 0; }
    if(this._waitDragNode[eid]){
        if(this._waitDragNode[eid] != pNode){
            var tempDragNode = this._waitDragNode[eid];
            this._waitDragNode[eid] = pNode;
            tempDragNode.onEndDrag(tempDragNode,pEvent);
            if(pNode){
                pNode.onStartDrag(pNode,pEvent);
            }
        }
    }else{
        this._waitDragNode[eid] = pNode;
        if(pNode){
            pNode.onStartDrag(pNode,pEvent);
        }
    }
}
HY.Core.Application.prototype.getWaitDragNodes = function(){
    return this._waitDragNode;
}
HY.Core.Application.prototype.getWaitScrollNode = function(identifier){
    if(identifier == undefined){ identifier = 0; }
    if(identifier < this._waitScrollNode.length){
        return this._waitScrollNode[identifier];
    }else{
        return null;
    }
}
HY.Core.Application.prototype.setWaitScrollNode = function(pNode, pEvent){
    var eid = pEvent.identifier;
    if(eid == undefined){ eid = 0; }
    this._waitScrollNode[eid] = pNode;
}
HY.Core.Application.prototype.getWaitScrollNodes = function(){
    return this._waitScrollNode;
}
HY.Core.Application.prototype.getMouseOverNode = function(identifier){
	if(identifier == undefined){ identifier = 0; }
	if(identifier < this._mouseOverNode.length){
		return this._mouseOverNode[identifier];
	}else{
		return null;
	}
}
HY.Core.Application.prototype.setMouseOverNode = function(pNode,pEvent){
    var eid = pEvent.identifier;
	if(eid == undefined){ eid = 0; }
    if(this._mouseOverNode[eid]){
        if(this._mouseOverNode[eid] != pNode){
            var tempOverNode = this._mouseOverNode[eid];
            this._mouseOverNode[eid] = pNode;
            tempOverNode.onMouseOut(tempOverNode,pEvent);
            if(pNode){
                pNode.onMouseOver(pNode,pEvent);
            }
        }
    }else{
        this._mouseOverNode[eid] = pNode;
        if(pNode){
            pNode.onMouseOver(pNode,pEvent);
        }
    }
}
HY.Core.Application.prototype.getMouseOverNodes = function(){
	return this._mouseOverNode;
}
HY.Core.Application.prototype.getMousePos = function(identifier){
	if(identifier == undefined){ identifier = 0; }
	if(identifier < this._mousePos.length){
		return this._mousePos[identifier];
	}else{
		return null;
	}
}
HY.Core.Application.prototype.setMousePos = function(pPos,pEvent){
    var eid = pEvent.identifier;
	if(eid == undefined){ eid = 0; }
	this._mousePos[eid] = pPos;
}
HY.Core.Application.prototype.getMousePoses = function(){
    return this._mousePos;
}
HY.Core.Application.prototype.isMouseDown = function(){
	if(HY.isMobilePlatform()){
		return true;
	}else{
		return this._mouseDownFlag;
	}
}
HY.Core.Application.prototype.setMouseDown = function(pDown){
    return this._mouseDownFlag = pDown;
}
HY.Core.Application.prototype.setInputNode = function(node){
    this._inputNode = node;
}
HY.Core.Application.prototype.getInputCursor = function(){
    return this._inputCursor;
}
HY.Core.Application.prototype.setMouseCursor = function(cursor){
    if(cursor){
        if(this._mouseCursor != cursor){
            this._mouseCursor = cursor;
            this._renderContext.getCanvas().style.cursor = cursor;
        }
    }else{
        this._mouseCursor = null;
        this._renderContext.getCanvas().style.cursor = "default";
    }
}
HY.Core.Application.prototype.getAppWidth = function(){
    return this._appWidth;
}
HY.Core.Application.prototype.setAppWidth = function(pWidth){
    this._appWidth = pWidth;
    if(this._renderContext){
        this._renderContext.setWidth(pWidth);
    }
}
HY.Core.Application.prototype.getAppHeight = function(){
    return this._appHeight;
}
HY.Core.Application.prototype.setAppHeight = function(pHeight){
    this._appHeight = pHeight;
    if(this._renderContext){
        this._renderContext.setHeight(pHeight);
    }
}
HY.Core.Application.prototype.getScaleX = function(){
    return this._scaleX;
}
HY.Core.Application.prototype.getScaleY = function(){
    return this._scaleY;
}
HY.Core.Application.prototype.getActionManager = function(){
    return this._actionManager;
}
HY.Core.Application.prototype.getResourceManager = function(){
    return this._resourceManager;
}
HY.Core.Application.prototype.getRenderContext = function(){
    return this._renderContext;
}
HY.Core.Application.prototype.initApp = function(){
    this.initContext();
    this.initEventDispatcher();
}
HY.Core.Application.prototype.initContext = function(){
    var doc = document;
    if(this._renderCanvasLocation == null){
        this._renderCanvasLocation = doc.body;
    }
    var canvas = doc.createElement("canvas");
    canvas.innerText = "您的浏览器不支持CANVAS画布标签，请下载支持HTML5的浏览器，如Chrome,IE9+,FireFox,Safari,Opera等";
    canvas.style.display = "none";
    canvas.style.backgroundColor = "#ffeeaa";
    this._renderContext = new HY.Core.RenderContext({canvas:canvas});
    if(this._fullScreen){
        var winSize = HY.getDocumentSize();
        canvas.style.position = "absolute";
		canvas.style.left = "0px";
        canvas.style.top = "0px";
        canvas.style.width = winSize.width+"px";
        canvas.style.height = winSize.height+"px";
        switch (this._scaleMode){
            case 0:
            {
                this.setAppWidth(winSize.width);
                this.setAppHeight(winSize.height);
                this._scaleX = 1;
                this._scaleY = 1;
                break;
            }
            case 1:
            {
                this._appHeight = Math.floor(this._appWidth * winSize.height/winSize.width);
                this.setAppWidth(this._appWidth);
                this.setAppHeight(this._appHeight);
                this._scaleX = this._appWidth/winSize.width;
                this._scaleY = this._appHeight/winSize.height;
                break;
            }
            case 2:
            {
                this._appWidth = Math.floor(this._appHeight * winSize.width/winSize.height);
                this.setAppWidth(this._appWidth);
                this.setAppHeight(this._appHeight);
                this._scaleX = this._appWidth/winSize.width;
                this._scaleY = this._appHeight/winSize.height;
                break;
            }
            default :
            {
                this.setAppWidth(this._appWidth);
                this.setAppHeight(this._appHeight);
                this._scaleX = this._appWidth/winSize.width;
                this._scaleY = this._appHeight/winSize.height;
                break;
            }
        }
        window.addEventListener("resize",function(){
            var newWinSize = HY.getDocumentSize();
            var renderCanvas = this._renderContext.getCanvas();
            renderCanvas.style.width = newWinSize.width+"px";
            renderCanvas.style.height = newWinSize.height+"px";
            switch (this._scaleMode){
                case 0:
                {
                    this.setAppWidth(newWinSize.width);
                    this.setAppHeight(newWinSize.height);
                    this._scaleX = 1;
                    this._scaleY = 1;
                    break;
                }
                case 1:
                {
                    this._appHeight = Math.floor(this._appWidth * newWinSize.height/newWinSize.width);
                    this.setAppWidth(this._appWidth);
                    this.setAppHeight(this._appHeight);
                    this._scaleX = this._appWidth/newWinSize.width;
                    this._scaleY = this._appHeight/newWinSize.height;
                    break;
                }
                case 2:
                {
                    this._appWidth = Math.floor(this._appHeight * newWinSize.width/newWinSize.height);
                    this.setAppWidth(this._appWidth);
                    this.setAppHeight(this._appHeight);
                    this._scaleX = this._appWidth/newWinSize.width;
                    this._scaleY = this._appHeight/newWinSize.height;
                    break;
                }
                default :
                {
                    this.setAppWidth(this._appWidth);
                    this.setAppHeight(this._appHeight);
                    this._scaleX = this._appWidth/newWinSize.width;
                    this._scaleY = this._appHeight/newWinSize.height;
                    break;
                }
            }
            if(this._rootNode){
                this._rootNode._dispatchCanvasSizeChanged(newWinSize);
                this.reRender();
            }
        }.bind(this));
    }else{
		canvas.style.left = "0px";
		canvas.style.top = "0px";
        canvas.style.width = this._appWidth + "px";
        canvas.style.height = this._appHeight + "px";
        canvas.width = this._appWidth;
        canvas.height = this._appHeight;
    }
    this._renderCanvasLocation.appendChild(canvas);
}
HY.Core.Application.prototype.initEventDispatcher = function(){
    var doc = document;
    var canvas = this._renderContext.getCanvas();
	if(HY.isMobilePlatform()){
		HY.Core.Event.addListener(doc,this,"touchstart",function(e){
            if(this._rootNode != null){
                var pevent = event?event:e;
                var touchcount = pevent.changedTouches.length;
                var renderCanvas = this.getRenderContext().getCanvas();
                for(var i=0;i<touchcount;++i){
                    var curtouch = new HY.Core.Event.eArg(pevent,this,renderCanvas,pevent.changedTouches[i]);
                    this.setMousePos(new HY.Vect2D({x:curtouch.offsetX,y:curtouch.offsetY}),curtouch);
                    this.setMouseDownNode(null,curtouch);
                    this.setMouseOverNode(null,curtouch);
                    this.setWaitDragNode(null,curtouch);
                    curtouch.stopDispatch();
                    curtouch.preventDefault();
                }
            }
		});
		HY.Core.Event.addListener(doc,this,"touchmove",function(e){
            if(this._rootNode != null) {
                var pevent = event?event:e;
                var touchcount = pevent.changedTouches.length;
                var renderCanvas = this.getRenderContext().getCanvas();
                for(var i=0;i<touchcount;++i){
                    var curtouch = new HY.Core.Event.eArg(pevent,this,renderCanvas,pevent.changedTouches[i]);
                    var mousePos = this.getMousePos(curtouch.identifier);
                    if(!mousePos || mousePos.x != curtouch.offsetX || mousePos.y != curtouch.offsetY){
                        var mouseDownNode = this.getMouseDownNode(curtouch.identifier);
                        var waitDragNode = this.getWaitDragNode(curtouch.identifier);
                        this.setMousePos(new HY.Vect2D({x:curtouch.offsetX,y:curtouch.offsetY}),curtouch);
                        this.setMouseOverNode(null,curtouch);
                        if(waitDragNode && waitDragNode != mouseDownNode){
                            this.setMouseDownNode(waitDragNode,curtouch);
                            mouseDownNode = waitDragNode;
                        }
                        if(mouseDownNode && mouseDownNode.isDraging()){
                            mouseDownNode.onDrag(mouseDownNode,curtouch);
                        }
                    }
                    curtouch.stopDispatch();
                    curtouch.preventDefault();
                }
            }
		});
		HY.Core.Event.addListener(doc,this,"touchend",function(e){
            if(this._rootNode != null){
                var pevent = event?event:e;
                var touchcount = pevent.changedTouches.length;
                var renderCanvas = this.getRenderContext().getCanvas();
                for(var i=0;i<touchcount;++i){
                    var curtouch = new HY.Core.Event.eArg(pevent,this,renderCanvas,pevent.changedTouches[i]);
                    this.setMousePos(null,curtouch);
                    var mouseDownNode = this.getMouseDownNode(curtouch.identifier);
                    this.setMouseDownNode(null,curtouch);
                    this.setMouseOverNode(null,curtouch);
                    this.setWaitDragNode(null,curtouch);
                    if(mouseDownNode){
                        mouseDownNode.onMouseUp(mouseDownNode,curtouch);
                        if(mouseDownNode.isDraging()){
                            mouseDownNode.onEndDrag(mouseDownNode,curtouch);
                        }
                    }
                    curtouch.stopDispatch();
                    curtouch.preventDefault();
                }
            }
		});
		HY.Core.Event.addListener(doc,this,"touchcancel",function(e){
            if(this._rootNode != null){
                var pevent = event?event:e;
                var touchcount = pevent.changedTouches.length;
                var renderCanvas = this.getRenderContext().getCanvas();
                for(var i=0;i<touchcount;++i){
                    var curtouch = new HY.Core.Event.eArg(pevent,this,renderCanvas,pevent.changedTouches[i]);
                    this.setMousePos(null,curtouch);
                    var mouseDownNode = this.getMouseDownNode(curtouch.identifier);
                    this.setMouseDownNode(null,curtouch);
                    this.setMouseOverNode(null,curtouch);
                    this.setWaitDragNode(null,curtouch);
                    if(mouseDownNode){
                        mouseDownNode.onMouseUp(mouseDownNode,pevent);
                        if(mouseDownNode.isDraging()){
                            mouseDownNode.onEndDrag(mouseDownNode,curtouch);
                        }
                    }
                    curtouch.stopDispatch();
                    curtouch.preventDefault();
                }
            }
		});
		HY.Core.Event.addListener(canvas,this,"touchstart",function(e){
            if(this._rootNode){
                var pevent = event?event:e;
                var renderCanvas = this.getRenderContext().getCanvas();
                var touchcount = pevent.changedTouches.length;
                for(var i=0;i<touchcount;++i){
                    var curtouch = new HY.Core.Event.eArg(pevent,this,renderCanvas,pevent.changedTouches[i]);
                    this.setMousePos(new HY.Vect2D({x:curtouch.offsetX,y:curtouch.offsetY}),curtouch);
                    this.setMouseDownNode(null,curtouch);
                    this.setMouseOverNode(null,curtouch);
                    this.setWaitDragNode(null,curtouch);
                    this._rootNode._dispatchMouseDownEvent(curtouch);
                    curtouch.stopDispatch();
                    curtouch.preventDefault();
                }
                this.hideContextMenu();
			}
		});
		HY.Core.Event.addListener(canvas,this,"touchmove",function(e){
            if(this._rootNode){
                var pevent = event?event:e;
                var touchcount = pevent.changedTouches.length;
                var renderCanvas = this.getRenderContext().getCanvas();
                for(var i=0;i<touchcount;++i){
                    var curtouch = new HY.Core.Event.eArg(pevent,this,renderCanvas,pevent.changedTouches[i]);
                    var mousePos = this.getMousePos(curtouch.identifier);
                    if(!mousePos || mousePos.x != curtouch.offsetX || mousePos.y != curtouch.offsetY){
                        this.setMousePos(new HY.Vect2D({x:curtouch.offsetX,y:curtouch.offsetY}),curtouch);
                        var mouseDownNode = this.getMouseDownNode(curtouch.identifier);
                        var waitDragNode = this.getWaitDragNode(curtouch.identifier);
                        if(waitDragNode && waitDragNode != mouseDownNode){
                            this.setMouseDownNode(waitDragNode,curtouch);
                            waitDragNode = mouseDownNode;
                        }
                        if(mouseDownNode && mouseDownNode.isDraging()){
                            mouseDownNode.onDrag(mouseDownNode,curtouch);
                        }else{
                            if (!this._rootNode._dispatchMouseMoveEvent(curtouch)) {
                                this.setMouseOverNode(null, curtouch);
                            }
                        }
                    }
                    curtouch.stopDispatch();
                    curtouch.preventDefault();
                }
            }
		});
		HY.Core.Event.addListener(canvas,this,"touchend",function(e){
            if(this._rootNode){
                var pevent = event?event:e;
                var touchcount = pevent.changedTouches.length;
                var renderCanvas = this.getRenderContext().getCanvas();
                for(var i=0;i<touchcount;++i){
                    var curtouch = new HY.Core.Event.eArg(pevent,this,renderCanvas,pevent.changedTouches[i]);
                    this.setMousePos(null,curtouch);
                    var mouseDownNode = this.getMouseDownNode(curtouch.identifier);
                    this.setMouseDownNode(null,curtouch);
                    this.setMouseOverNode(null,curtouch);
                    this.setWaitDragNode(null,curtouch);
                    if(mouseDownNode){
                        mouseDownNode.onMouseUp(mouseDownNode,curtouch);
                        if(mouseDownNode.isDraging()){
                            mouseDownNode.onEndDrag(mouseDownNode,curtouch);
                        }
                    }
                    curtouch.stopDispatch();
                    curtouch.preventDefault();
                }
            }
		});
		HY.Core.Event.addListener(canvas,this,"touchcancel",function(e){
            if(this._rootNode){
                var pevent = event?event:e;
                var touchcount = pevent.changedTouches.length;
                var renderCanvas = this.getRenderContext().getCanvas();
                for(var i=0;i<touchcount;++i){
                    var curtouch = new HY.Core.Event.eArg(pevent,this,renderCanvas,pevent.changedTouches[i]);
                    this.setMousePos(null,curtouch);
                    var mouseDownNode = this.getMouseDownNode(curtouch.identifier);
                    this.setMouseDownNode(null,curtouch);
                    this.setMouseOverNode(null,curtouch);
                    this.setWaitDragNode(null,curtouch);
                    if(mouseDownNode){
                        mouseDownNode.onMouseUp(mouseDownNode,curtouch);
                        if(mouseDownNode.isDraging()){
                            mouseDownNode.onEndDrag(mouseDownNode,curtouch);
                        }
                    }
                    curtouch.stopDispatch();
                    curtouch.preventDefault();
                }
            }
		});
	}else{
		HY.Core.Event.addListener(doc,this,"keydown",function(e){
			if(this._rootNode != null){
                var renderCanvas = this.getRenderContext().getCanvas();
				var pEvent = new HY.Core.Event.eArg(e, this, renderCanvas);
				this._rootNode._dispatchKeyDownEvent(pEvent);
			}
		});
		HY.Core.Event.addListener(doc,this,"keypress",function(e){
			if(this._rootNode != null){
                var renderCanvas = this.getRenderContext().getCanvas();
				var pEvent = new HY.Core.Event.eArg(e, this, renderCanvas);
				this._rootNode._dispatchKeyPressEvent(pEvent);
			}
		});
		HY.Core.Event.addListener(doc,this,"keyup",function(e){
			if(this._rootNode != null){
                var renderCanvas = this.getRenderContext().getCanvas();
				var pEvent = new HY.Core.Event.eArg(e, this, renderCanvas);
				this._rootNode._dispatchKeyUpEvent(pEvent);
			}
		});
		HY.Core.Event.addListener(doc,this,"mousedown",function(e){
			this.setMouseDown(true);
            if(this._rootNode != null){
                var renderCanvas = this.getRenderContext().getCanvas();
                var pEvent = new HY.Core.Event.eArg(e, this, renderCanvas);
                this.setMouseDownNode(null,pEvent);
                this.setWaitDragNode(null,pEvent);
                this.setMousePos(new HY.Vect2D({x:pEvent.offsetX,y:pEvent.offsetY}),pEvent);
            }
            pEvent.stopDispatch();
            pEvent.preventDefault();
		});
		HY.Core.Event.addListener(doc,this,"mousemove",function(e){
            if(this._rootNode != null){
                var renderCanvas = this.getRenderContext().getCanvas();
                var pEvent = new HY.Core.Event.eArg(e, this, renderCanvas);
                var mousePos = this.getMousePos(pEvent.identifier);
                if(!mousePos || mousePos.x != pEvent.offsetX || mousePos.y != pEvent.offsetY){
                    this.setMousePos(new HY.Vect2D({x:pEvent.offsetX,y:pEvent.offsetY}),pEvent);
                    if (this.isMouseDown()) {
                        var mouseDownNode = this.getMouseDownNode(pEvent.identifier);
                        var waitDragNode = this.getWaitDragNode(pEvent.identifier);
                        this.setMouseOverNode(null,pEvent);
                        this.setWaitScrollNode(null,pEvent);
                        if(waitDragNode && waitDragNode != mouseDownNode){
                            this.setMouseDownNode(waitDragNode,pEvent);
                            mouseDownNode = waitDragNode;
                        }
                        if(mouseDownNode && mouseDownNode.isDraging()){
                            mouseDownNode.onDrag(mouseDownNode,pEvent);
                        }
                    }
                }
                pEvent.stopDispatch();
                pEvent.preventDefault();
            }
		});
		HY.Core.Event.addListener(doc,this,"mouseup",function(e){
			this.setMouseDown(false);
            if(this._rootNode != null){
                var renderCanvas = this.getRenderContext().getCanvas();
                var pEvent = new HY.Core.Event.eArg(e, this, renderCanvas);
                var mouseDownNode = this.getMouseDownNode(pEvent.identifier);
                this.setMouseDownNode(null,pEvent);
                this.setWaitDragNode(null,pEvent);
                if(mouseDownNode){
                    mouseDownNode.onMouseUp(mouseDownNode,pEvent);
                    if(mouseDownNode.isDraging()){
                        mouseDownNode.onEndDrag(mouseDownNode,pEvent);
                    }
                }
                pEvent.stopDispatch();
                pEvent.preventDefault();
            }
		});
		HY.Core.Event.addListener(doc,this,"mousewheel",function(e){
            if(this._rootNode != null){
                var renderCanvas = this.getRenderContext().getCanvas();
                var pEvent = new HY.Core.Event.eArg(e, this, renderCanvas);
                var waitScrollNode = this.getWaitScrollNode(pEvent.identifier);
                if(waitScrollNode != null){
                    waitScrollNode._dispatchMouseWheelEvent(pEvent);
                }
                pEvent.stopDispatch();
                pEvent.preventDefault();
            }
		});
		HY.Core.Event.addListener(doc,this,"DOMMouseScroll",function(e){
            if(this._rootNode != null){
                var renderCanvas = this.getRenderContext().getCanvas();
                var pEvent = new HY.Core.Event.eArg(e, this, renderCanvas);
                var waitScrollNode = this.getWaitScrollNode(pEvent.identifier);
                if(waitScrollNode != null){
                    waitScrollNode._dispatchMouseWheelEvent(pEvent);
                }
                pEvent.stopDispatch();
                pEvent.preventDefault();
            }
		});
		HY.Core.Event.addListener(canvas,this,"click",function(e){
			if(this._rootNode != null){
				var pEvent = new HY.Core.Event.eArg(e,this);
				this._rootNode._dispatchClickEvent(pEvent);
                pEvent.stopDispatch();
                pEvent.preventDefault();
			}
		});
		HY.Core.Event.addListener(canvas,this,"dblclick",function(e){
			if(this._rootNode != null){
				var pEvent = new HY.Core.Event.eArg(e,this);
				this._rootNode._dispatchDblClickEvent(pEvent);
                pEvent.stopDispatch();
                pEvent.preventDefault();
			}
		});
		HY.Core.Event.addListener(canvas,this,"contextmenu",function(e){
			if(this._rootNode != null){
				var pEvent = new HY.Core.Event.eArg(e,this);
				this._rootNode._dispatchContextMenuEvent(pEvent);
                pEvent.stopDispatch();
                pEvent.preventDefault();
			}
		});
		HY.Core.Event.addListener(canvas,this,"mousedown", function (e) {
			this.setMouseDown(true);
            if(this._rootNode != null){
                var pEvent = new HY.Core.Event.eArg(e,this);
                this.setWaitDragNode(null,pEvent);
                this.setMouseDownNode(null,pEvent);
                this._rootNode._dispatchMouseDownEvent(pEvent);
                this.hideContextMenu();
                pEvent.stopDispatch();
                pEvent.preventDefault();
            }
		});
		HY.Core.Event.addListener(canvas,this,"mousemove",function(e){
            if(this._rootNode != null) {
                var pEvent = new HY.Core.Event.eArg(e, this);
                var mousePos = this.getMousePos(pEvent.identifier);
                if(!mousePos || mousePos.x != pEvent.offsetX || mousePos.y != pEvent.offsetY){
                    this.setMousePos(new HY.Vect2D({x: pEvent.offsetX, y: pEvent.offsetY}), pEvent);
                    if (this.isMouseDown()) {
                        var mouseDownNode = this.getMouseDownNode(pEvent.identifier);
                        var waitDragNode = this.getWaitDragNode(pEvent.identifier);
                        if(waitDragNode && waitDragNode != mouseDownNode){
                            this.setMouseDownNode(waitDragNode,pEvent);
                            mouseDownNode = waitDragNode;
                        }
                        if(mouseDownNode && mouseDownNode.isDraging()){
                            mouseDownNode.onDrag(mouseDownNode,pEvent);
                        }else{
                            if (!this._rootNode._dispatchMouseMoveEvent(pEvent)) {
                                this.setMouseOverNode(null, pEvent);
                            }
                        }
                    }else{
                        if (!this._rootNode._dispatchMouseMoveEvent(pEvent)) {
                            this.setMouseOverNode(null, pEvent);
                        }
                    }
                }
                pEvent.stopDispatch();
                pEvent.preventDefault();
            }
		});
		HY.Core.Event.addListener(canvas,this,"mouseup",function(e){
			this.setMouseDown(false);
            if(this._rootNode != null){
                var renderCanvas = this.getRenderContext().getCanvas();
                var pEvent = new HY.Core.Event.eArg(e, this, renderCanvas);
                var mouseDownNode = this.getMouseDownNode(pEvent.identifier);
                this.setMouseDownNode(null,pEvent);
                this.setWaitDragNode(null,pEvent);
                if(mouseDownNode){
                    mouseDownNode.onMouseUp(mouseDownNode,pEvent);
                    if(mouseDownNode.isDraging()){
                        mouseDownNode.onEndDrag(mouseDownNode,pEvent);
                    }
                }
                pEvent.stopDispatch();
                pEvent.preventDefault();
            }
		});
	}
}
HY.Core.Application.prototype.reRender = function(){
	this._reRenderFlag = true;
}
HY.Core.Application.prototype.show = function(){
    if(this._renderContext != null){
        this.resume();
        this._renderContext.getCanvas().style.display = "";
    }
}
HY.Core.Application.prototype.hide = function(){
    if(this._renderContext != null){
        this.pause();
        this._renderContext.getCanvas().style.display = "none";
    }
}
HY.Core.Application.prototype.pause = function(){
    this._actionManager.pause();
}
HY.Core.Application.prototype.resume = function(){
    this._actionManager.resume();
}
HY.Core.Application.prototype.run = function(pNode){
    this._preFrameTime = 0;
    this._rootNode = pNode;
    this._rootNode.setApplication(this);
    this._rootNode.setParent(null);
    this.initApp();
	this._renderLoopHandle = 0;
    if (window.requestAnimationFrame)
        window.requestAnimationFrame(this.runLoop.bind(this));
    else if (window.msRequestAnimationFrame)
        window.msRequestAnimationFrame(this.runLoop.bind(this));
    else if (window.webkitRequestAnimationFrame)
        window.webkitRequestAnimationFrame(this.runLoop.bind(this));
    else if (window.mozRequestAnimationFrame)
        window.mozRequestAnimationFrame(this.runLoop.bind(this));
    else if (window.oRequestAnimationFrame)
        window.oRequestAnimationFrame(this.runLoop.bind(this));
    else
        this._renderLoopHandle = window.setInterval(this.runLoop.bind(this), 16.7);
    this._rootNode._dispatchFinishLaunch();
}
HY.Core.Application.prototype.runLoop = function() {
	this.renderLoop();
    if(this._renderLoopHandle == 0){
        window.requestAnimationFrame(this.runLoop.bind(this));
    }
}
HY.Core.Application.prototype.renderLoop = function(){
    var curFrameTime,deltatime;
    var now_1 = (new Date()).getTime();
    if(this._preFrameTime != 0){
        curFrameTime = (new Date()).getTime();
        deltatime = curFrameTime - this._preFrameTime;
        this._actionManager.runActions(deltatime);
        this._preFrameTime = curFrameTime;
    }else{
        this._preFrameTime = (new Date()).getTime();
        deltatime = 0;
    }
    var now_2 = (new Date()).getTime();
    if(this._rootNode){
        var now1 = (new Date()).getTime();


        if(this._refreshMode == 1 || this._reRenderFlag){
        	this._reRenderFlag = false;
            this._renderContext.clearApiCount();
            this._renderContext.clearRect(0,0,this._appWidth,this._appHeight);
            this._rootNode._dispatchPaintEvent(this._renderContext,deltatime);
        }

        var now2 = (new Date()).getTime();
        g_cycletime += deltatime;
        g_cyclecount ++;
        if(g_cycletime >= 1000){
            this._console.innerText = (now_2-now_1)+"|"+(now2-now1)+"|"+deltatime+"|"+g_cyclecount;
            g_cycletime = 0;
            g_cyclecount = 0;
        }
    }
}