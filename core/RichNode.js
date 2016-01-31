/**
 * Created by Administrator on 2015/11/28.
 */
HY.Core.RichNode = function(config){
    this.init(config);
}
HY.Core.RichNode.prototype = new HY.Core.Node();
HY.Core.RichNode.prototype.defaultAnchorMoveEnable = true;
HY.Core.RichNode.prototype.defaultResizeEnable = true;
HY.Core.RichNode.prototype.defaultRotateEnable = true;
HY.Core.RichNode.prototype.defaultAnchorX = 0;
HY.Core.RichNode.prototype.defaultAnchorY = 0;
HY.Core.RichNode.prototype.defaultLayoutStyle = 1;// 0gamenode布局 1guinode布局
HY.Core.RichNode.prototype.defaultAdjustBorder = 4;
HY.Core.RichNode.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.anchorMoveEnable != undefined){ this._anchorMoveEnable = config.anchorMoveEnable; } else { this._anchorMoveEnable = this.defaultAnchorMoveEnable; }
    if(config.rotateEnable != undefined){ this._rotateEnable = config.rotateEnable; } else { this._rotateEnable = this.defaultRotateEnable; }
    if(config.resizeEnable != undefined){ this._resizeEnable = config.resizeEnable; } else { this._resizeEnable = this.defaultResizeEnable; }
    if(config.layoutStyle != undefined){ this._layoutStyle = config.layoutStyle; } else { this._layoutStyle = this.defaultLayoutStyle; }
    if(config.adjustBorder != undefined){ this._adjustBorder = config.adjustBorder } else { this._adjustBorder = this.defaultAdjustBorder; }

    if(config.rotateEvent != undefined){ this.addEventListener("rotate",config.rotateEvent.selector,config.rotateEvent.target); }
    if(config.resizeEvent != undefined){ this.addEventListener("resize",config.resizeEvent.selector,config.resizeEvent.target); }
    if(config.anchorMoveEvent != undefined){ this.addEventListener("anchormove",config.anchorMoveEvent.selector,config.anchorMoveEvent.target); }

    this._anchorNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5});

    /*
    spaceView.setCursor("ew-resize");
}else{
    spaceView.setCursor("ns-resize");
    */
    this._nwResizeNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:"nw-resize"});
    this._nResizeNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:"ns-resize"});
    this._neResizeNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:"ne-resize"});
    this._eResizeNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:"ew-resize"});
    this._seResizeNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:"se-resize"});
    this._sResizeNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:"ns-resize"});
    this._swResizeNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:"sw-resize"});
    this._wResizeNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:"ew-resize"});

    this._nwRotateNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:""});
    this._neRotateNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:""});
    this._seRotateNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:""});
    this._swRotateNode = new HY.Core.Node({anchorX:0.5,anchorY:0.5,cursor:""});

    this.__resizeNodeIndex = -1;
    this.__rotateNodeIndex = -1;

    this.__rotateStartEventAngle = null;
    this.__rotateStartAngle = null;

    this.__resizeStartVector = null;
    this.__resizeStartSize = null;
    this.__resizeStartPos = null;

    this.__anchorStartMoveFlag = false;
    this.__anchorStartEventPos = null;
    this.__anchorStartAnchor = null;
    this.__anchorStartPos = null;
}
HY.Core.RichNode.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this._nwRotateNode.addEventListener("drag",this._nwRotateNodeDrag,this);
    this._neRotateNode.addEventListener("drag",this._neRotateNodeDrag,this);
    this._seRotateNode.addEventListener("drag",this._seRotateNodeDrag,this);
    this._swRotateNode.addEventListener("drag",this._swRotateNodeDrag,this);

    this._nwRotateNode.addEventListener("enddrag",this._unLockRotate,this);
    this._neRotateNode.addEventListener("enddrag",this._unLockRotate,this);
    this._seRotateNode.addEventListener("enddrag",this._unLockRotate,this);
    this._swRotateNode.addEventListener("enddrag",this._unLockRotate,this);

    this._nwResizeNode.addEventListener("drag",this._nwResizeNodeDrag,this);
    this._nResizeNode.addEventListener("drag",this._nResizeNodeDrag,this);
    this._neResizeNode.addEventListener("drag",this._neResizeNodeDrag,this);
    this._eResizeNode.addEventListener("drag",this._eResizeNodeDrag,this);
    this._seResizeNode.addEventListener("drag",this._seResizeNodeDrag,this);
    this._sResizeNode.addEventListener("drag",this._sResizeNodeDrag,this);
    this._swResizeNode.addEventListener("drag",this._swResizeNodeDrag,this);
    this._wResizeNode.addEventListener("drag",this._wResizeNodeDrag,this);

    this._nwResizeNode.addEventListener("enddrag",this._unLockResize,this);
    this._nResizeNode.addEventListener("enddrag",this._unLockResize,this);
    this._neResizeNode.addEventListener("enddrag",this._unLockResize,this);
    this._eResizeNode.addEventListener("enddrag",this._unLockResize,this);
    this._seResizeNode.addEventListener("enddrag",this._unLockResize,this);
    this._sResizeNode.addEventListener("enddrag",this._unLockResize,this);
    this._swResizeNode.addEventListener("enddrag",this._unLockResize,this);
    this._wResizeNode.addEventListener("enddrag",this._unLockResize,this);

    this._anchorNode.addEventListener("drag",this._anchorNodeDrag,this);
    this._anchorNode.addEventListener("enddrag",this._unLockAnchorMove,this);
    this._anchorNode.addEventListener("paint",this._anchorNodePaint,this);



    this._nwRotateNode.setVisible(this._rotateEnable);
    this._neRotateNode.setVisible(this._rotateEnable);
    this._seRotateNode.setVisible(this._rotateEnable);
    this._swRotateNode.setVisible(this._rotateEnable);

    this._nwResizeNode.setVisible(this._resizeEnable);
    this._nResizeNode.setVisible(this._resizeEnable);
    this._neResizeNode.setVisible(this._resizeEnable);
    this._eResizeNode.setVisible(this._resizeEnable);
    this._seResizeNode.setVisible(this._resizeEnable);
    this._sResizeNode.setVisible(this._resizeEnable);
    this._swResizeNode.setVisible(this._resizeEnable);
    this._wResizeNode.setVisible(this._resizeEnable);

    this._anchorNode.setVisible(this._anchorMoveEnable);


    this.addChildNodeAtLayer(this._nwRotateNode,0);
    this.addChildNodeAtLayer(this._neRotateNode,0);
    this.addChildNodeAtLayer(this._seRotateNode,0);
    this.addChildNodeAtLayer(this._swRotateNode,0);

    this.addChildNodeAtLayer(this._nwResizeNode,0);
    this.addChildNodeAtLayer(this._nResizeNode,0);
    this.addChildNodeAtLayer(this._neResizeNode,0);
    this.addChildNodeAtLayer(this._eResizeNode,0);
    this.addChildNodeAtLayer(this._seResizeNode,0);
    this.addChildNodeAtLayer(this._sResizeNode,0);
    this.addChildNodeAtLayer(this._swResizeNode,0);
    this.addChildNodeAtLayer(this._wResizeNode,0);
    this.addChildNodeAtLayer(this._anchorNode,0);
}
HY.Core.RichNode.prototype.getRotateEnable = function(){
    return this._rotateEnable;
}
HY.Core.RichNode.prototype.setRotateEnable = function(rotateEnable){
    this._rotateEnable = rotateEnable;
    this._nwRotateNode.setVisible(rotateEnable);
    this._neRotateNode.setVisible(rotateEnable);
    this._seRotateNode.setVisible(rotateEnable);
    this._swRotateNode.setVisible(rotateEnable);
}
HY.Core.RichNode.prototype.getResizeEnable = function(){
    return this._resizeEnable;
}
HY.Core.RichNode.prototype.setResizeEnable = function(resizeEnable){
    this._resizeEnable = resizeEnable;
    this._nwResizeNode.setVisible(resizeEnable);
    this._nResizeNode.setVisible(resizeEnable);
    this._neResizeNode.setVisible(resizeEnable);
    this._eResizeNode.setVisible(resizeEnable);
    this._seResizeNode.setVisible(resizeEnable);
    this._sResizeNode.setVisible(resizeEnable);
    this._swResizeNode.setVisible(resizeEnable);
    this._wResizeNode.setVisible(resizeEnable);
}
HY.Core.RichNode.prototype.getAnchorMoveEnable = function(){
    return this._anchorMoveEnable;
}
HY.Core.RichNode.prototype.setAnchorMoveEnable = function(anchorMoveAble){
    this._anchorMoveEnable = anchorMoveAble;
    this._anchorNode.setVisible(anchorMoveAble);
}
HY.Core.RichNode.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    if(this._layoutStyle == 1){
        var ltCoor = this.getLeftTopCoor();
        var rbCoor = this.getRightBottomCoor();
        var centerx = Math.floor((ltCoor.x+rbCoor.x)/2);
        var middley = Math.floor((ltCoor.y+rbCoor.y)/2);
        var offset = this._adjustBorder/2;
        this._anchorNode.setX(0);
        this._anchorNode.setY(0);
        this._anchorNode.setWidth(6);
        this._anchorNode.setHeight(6);
        this._nwRotateNode.setX(ltCoor.x);
        this._nwRotateNode.setY(ltCoor.y);
        this._neRotateNode.setX(rbCoor.x);
        this._neRotateNode.setY(ltCoor.y);
        this._seRotateNode.setX(rbCoor.x);
        this._seRotateNode.setY(rbCoor.y);
        this._swRotateNode.setX(ltCoor.x);
        this._swRotateNode.setY(rbCoor.y);
        this._nwResizeNode.setX(ltCoor.x+offset);
        this._nwResizeNode.setY(ltCoor.y+offset);
        this._nResizeNode.setX(centerx);
        this._nResizeNode.setY(ltCoor.y+offset);
        this._neResizeNode.setX(rbCoor.x-offset);
        this._neResizeNode.setY(ltCoor.y+offset);
        this._eResizeNode.setX(rbCoor.x-offset);
        this._eResizeNode.setY(middley);
        this._seResizeNode.setX(rbCoor.x-offset);
        this._seResizeNode.setY(rbCoor.y-offset);
        this._sResizeNode.setX(centerx);
        this._sResizeNode.setY(rbCoor.y-offset);
        this._swResizeNode.setX(ltCoor.x+offset);
        this._swResizeNode.setY(rbCoor.y-offset);
        this._wResizeNode.setX(ltCoor.x+offset);
        this._wResizeNode.setY(middley);


        this._nwRotateNode.setWidth(this._adjustBorder*2);
        this._nwRotateNode.setHeight(this._adjustBorder*2);
        this._neRotateNode.setWidth(this._adjustBorder*2);
        this._neRotateNode.setHeight(this._adjustBorder*2);
        this._seRotateNode.setWidth(this._adjustBorder*2);
        this._seRotateNode.setHeight(this._adjustBorder*2);
        this._swRotateNode.setWidth(this._adjustBorder*2);
        this._swRotateNode.setHeight(this._adjustBorder*2);
        this._nwResizeNode.setWidth(this._adjustBorder);
        this._nwResizeNode.setHeight(this._adjustBorder);
        this._nResizeNode.setWidth(this.getWidth()-this._adjustBorder);
        this._nResizeNode.setHeight(this._adjustBorder);
        this._neResizeNode.setWidth(this._adjustBorder);
        this._neResizeNode.setHeight(this._adjustBorder);
        this._eResizeNode.setWidth(this._adjustBorder);
        this._eResizeNode.setHeight(this.getHeight()-this._adjustBorder);
        this._seResizeNode.setWidth(this._adjustBorder);
        this._seResizeNode.setHeight(this._adjustBorder);
        this._sResizeNode.setWidth(this.getWidth()-this._adjustBorder);
        this._sResizeNode.setHeight(this._adjustBorder);
        this._swResizeNode.setWidth(this._adjustBorder);
        this._swResizeNode.setHeight(this._adjustBorder);
        this._wResizeNode.setWidth(this._adjustBorder);
        this._wResizeNode.setHeight(this.getHeight()-this._adjustBorder);

    }else{
        var ltCoor = this.getLeftTopCoor();
        var rbCoor = this.getRightBottomCoor();
        var centerx = Math.floor((ltCoor.x+rbCoor.x)/2);
        var middley = Math.floor((ltCoor.y+rbCoor.y)/2);
        var offset = this._adjustBorder/2;
        this._anchorNode.setX(0);
        this._anchorNode.setY(0);
        this._anchorNode.setWidth(this._adjustBorder);
        this._anchorNode.setHeight(this._adjustBorder);
        this._nwRotateNode.setX(ltCoor.x-offset);
        this._nwRotateNode.setY(ltCoor.y-offset);
        this._neRotateNode.setX(rbCoor.x+offset);
        this._neRotateNode.setY(ltCoor.y-offset);
        this._seRotateNode.setX(rbCoor.x+offset);
        this._seRotateNode.setY(rbCoor.y+offset);
        this._swRotateNode.setX(ltCoor.x-offset);
        this._swRotateNode.setY(rbCoor.y+offset);
        this._nResizeNode.setX(centerx);
        this._nResizeNode.setY(ltCoor.y);
        this._neResizeNode.setX(rbCoor.x);
        this._neResizeNode.setY(ltCoor.y);
        this._eResizeNode.setX(rbCoor.x);
        this._eResizeNode.setY(middley);
        this._seResizeNode.setX(rbCoor.x);
        this._seResizeNode.setY(rbCoor.y);
        this._sResizeNode.setX(centerx);
        this._sResizeNode.setY(rbCoor.y);
        this._swResizeNode.setX(ltCoor.x);
        this._swResizeNode.setY(rbCoor.y);
        this._wResizeNode.setX(ltCoor.x);
        this._wResizeNode.setY(middley);

        this._nwRotateNode.setWidth(this._adjustBorder*2);
        this._nwRotateNode.setHeight(this._adjustBorder*2);
        this._neRotateNode.setWidth(this._adjustBorder*2);
        this._neRotateNode.setHeight(this._adjustBorder*2);
        this._seRotateNode.setWidth(this._adjustBorder*2);
        this._seRotateNode.setHeight(this._adjustBorder*2);
        this._swRotateNode.setWidth(this._adjustBorder*2);
        this._swRotateNode.setHeight(this._adjustBorder*2);
        this._nwResizeNode.setWidth(this._adjustBorder);
        this._nwResizeNode.setHeight(this._adjustBorder);
        this._nResizeNode.setWidth(this._adjustBorder);
        this._nResizeNode.setHeight(this._adjustBorder);
        this._neResizeNode.setWidth(this._adjustBorder);
        this._neResizeNode.setHeight(this._adjustBorder);
        this._eResizeNode.setWidth(this._adjustBorder);
        this._eResizeNode.setHeight(this._adjustBorder);
        this._seResizeNode.setWidth(this._adjustBorder);
        this._seResizeNode.setHeight(this._adjustBorder);
        this._sResizeNode.setWidth(this._adjustBorder);
        this._sResizeNode.setHeight(this._adjustBorder);
        this._swResizeNode.setWidth(this._adjustBorder);
        this._swResizeNode.setHeight(this._adjustBorder);
        this._wResizeNode.setWidth(this._adjustBorder);
        this._wResizeNode.setHeight(this._adjustBorder);

    }

}
HY.Core.RichNode.prototype.onRotate = function(sender,e){
    this.launchEvent("rotate",[this,e]);
}
HY.Core.RichNode.prototype.onResize = function(sender,e){
    this.launchEvent("resize",[this,e]);
}
HY.Core.RichNode.prototype.onAnchorMove = function(sender,e){
    this.launchEvent("anchormove",[this,e]);
}
HY.Core.RichNode.prototype._initRotate = function(e){
    var anchorInCanvas = this.transPointToCanvas(new HY.Vect2D({x:0,y:0}));
    var vectorInCanvas = new HY.Vect2D({x:e.offsetX-anchorInCanvas.x, y:e.offsetY-anchorInCanvas.y});
    this.__rotateStartEventAngle = vectorInCanvas.getAngle();
    this.__rotateStartAngle = this.getRotateZ();
}
HY.Core.RichNode.prototype._runRotate = function(e){
    var anchorInCanvas = this.transPointToCanvas(new HY.Vect2D({x:0,y:0}));
    var vect2dInCanvas = new HY.Vect2D({x:e.offsetX-anchorInCanvas.x,y:e.offsetY-anchorInCanvas.y});
    this.setRotateZ(this.__rotateStartAngle+vect2dInCanvas.getAngle()-this.__rotateStartEventAngle);
}
HY.Core.RichNode.prototype._initResize = function(e){
    this.__resizeStartVector = this.transPointFromCanvas(new HY.Vect2D({x: e.offsetX,y: e.offsetY}));;
    this.__resizeStartSize = new HY.Size2D({width:this.getWidth(),height:this.getHeight()});
    this.__resizeStartPos = new HY.Vect2D({x:this.getX(), y:this.getY()});
}
HY.Core.RichNode.prototype._runWidthResize = function(e){
    if(this._layoutStyle == 1){
        var anchorOffsetVectorInThis = this.transVectorFromParent(new HY.Vect2D({x: this.getX()-this.__resizeStartPos.x, y: this.getY()-this.__resizeStartPos.y}));
        var eventVectorInThis = this.transPointFromCanvas(new HY.Vect2D({x: e.offsetX, y: e.offsetY}));
        eventVectorInThis.x += anchorOffsetVectorInThis.x;
        eventVectorInThis.y += anchorOffsetVectorInThis.y;
        var widthInc,xInc,yInc;
        var centerX = (0.5-this.getAnchorX())*this.__resizeStartSize.width;
        if(this.__resizeStartVector.x - centerX  > 0){
            widthInc = eventVectorInThis.x - this.__resizeStartVector.x;
            xInc = widthInc * this.getAnchorX();
        }else{
            widthInc = this.__resizeStartVector.x - eventVectorInThis.x;
            xInc = widthInc * (this.getAnchorX()-1);
        }
        var vectorIncInParent = this.transVectorToParent(new HY.Vect2D({x:xInc,y:0}));
        this.setX(this.__resizeStartPos.x+vectorIncInParent.x);
        this.setY(this.__resizeStartPos.y+vectorIncInParent.y);
        this.setWidth(this.__resizeStartSize.width+widthInc);
    }else{
        var eventVectorInThis = this.transPointFromCanvas(new HY.Vect2D({x: e.offsetX, y: e.offsetY}));
        var centerX = (0.5-this.getAnchorX())*this.__resizeStartSize.width;
        var widthInc = (this.__resizeStartVector.x-centerX>0)?((1==this.getAnchorX())?0:(eventVectorInThis.x - this.__resizeStartVector.x)/(1-this.getAnchorX())):((0==this.getAnchorX())?0:(this.__resizeStartVector.x - eventVectorInThis.x)/this.getAnchorX());
        this.setWidth(this.__resizeStartSize.width+widthInc);
    }
}
HY.Core.RichNode.prototype._runHeightResize = function(e){
    if(this._layoutStyle == 1){
        var anchorOffsetVectorInThis = this.transVectorFromParent(new HY.Vect2D({x: this.getX()-this.__resizeStartPos.x, y: this.getY()-this.__resizeStartPos.y}));
        var eventVectorInThis = this.transPointFromCanvas(new HY.Vect2D({x: e.offsetX, y: e.offsetY}));
        eventVectorInThis.x += anchorOffsetVectorInThis.x;
        eventVectorInThis.y += anchorOffsetVectorInThis.y;
        var heightInc,xInc,yInc;
        var centerY = (0.5-this.getAnchorY())*this.__resizeStartSize.height;
        if(this.__resizeStartVector.y - centerY > 0){
            heightInc = eventVectorInThis.y - this.__resizeStartVector.y;
            yInc = heightInc * this.getAnchorY();
        }else{
            heightInc = this.__resizeStartVector.y - eventVectorInThis.y;
            yInc = heightInc * (this.getAnchorY()-1);
        }
        var vectorIncInParent = this.transVectorToParent(new HY.Vect2D({x:0,y:yInc}));
        this.setX(this.__resizeStartPos.x+vectorIncInParent.x);
        this.setY(this.__resizeStartPos.y+vectorIncInParent.y);
        this.setHeight(this.__resizeStartSize.height+heightInc);
    }else{
        var eventVectorInThis = this.transPointFromCanvas(new HY.Vect2D({x: e.offsetX, y: e.offsetY}));
        var centerY = (0.5-this.getAnchorY())*this.__resizeStartSize.height;
        var heightInc = (this.__resizeStartVector.y-centerY>0)?((1==this.getAnchorY())?0:(eventVectorInThis.y - this.__resizeStartVector.y)/(1-this.getAnchorY())):((0==this.getAnchorY())?0:(this.__resizeStartVector.y - eventVectorInThis.y)/this.getAnchorY());
        this.setHeight(this.__resizeStartSize.height+heightInc);
    }
}
HY.Core.RichNode.prototype._runBothResize = function(e){
    if(this._layoutStyle == 1){
        var anchorOffsetVectorInThis = this.transVectorFromParent(new HY.Vect2D({x: this.getX()-this.__resizeStartPos.x, y: this.getY()-this.__resizeStartPos.y}));
        var eventVectorInThis = this.transPointFromCanvas(new HY.Vect2D({x: e.offsetX, y: e.offsetY}));
        eventVectorInThis.x += anchorOffsetVectorInThis.x;
        eventVectorInThis.y += anchorOffsetVectorInThis.y;
        var widthInc,heightInc,xInc,yInc;
        var centerX = (0.5-this.getAnchorX())*this.__resizeStartSize.width;
        var centerY = (0.5-this.getAnchorY())*this.__resizeStartSize.height;
        if(this.__resizeStartVector.x - centerX  > 0){
            widthInc = eventVectorInThis.x - this.__resizeStartVector.x;
            xInc = widthInc * this.getAnchorX();
        }else{
            widthInc = this.__resizeStartVector.x - eventVectorInThis.x;
            xInc = widthInc * (this.getAnchorX()-1);
        }
        if(this.__resizeStartVector.y - centerY > 0){
            heightInc = eventVectorInThis.y - this.__resizeStartVector.y;
            yInc = heightInc * this.getAnchorY();
        }else{
            heightInc = this.__resizeStartVector.y - eventVectorInThis.y;
            yInc = heightInc * (this.getAnchorY()-1);
        }
        var vectorIncInParent = this.transVectorToParent(new HY.Vect2D({x:xInc,y:yInc}));
        this.setX(this.__resizeStartPos.x+vectorIncInParent.x);
        this.setY(this.__resizeStartPos.y+vectorIncInParent.y);
        this.setWidth(this.__resizeStartSize.width+widthInc);
        this.setHeight(this.__resizeStartSize.height+heightInc);
    }else{
        var eventVectorInThis = this.transPointFromCanvas(new HY.Vect2D({x: e.offsetX, y: e.offsetY}));
        var centerX = (0.5-this.getAnchorX())*this.__resizeStartSize.width;
        var centerY = (0.5-this.getAnchorY())*this.__resizeStartSize.height;
        var widthInc = (this.__resizeStartVector.x-centerX>0)?((1==this.getAnchorX())?0:(eventVectorInThis.x - this.__resizeStartVector.x)/(1-this.getAnchorX())):((0==this.getAnchorX())?0:(this.__resizeStartVector.x - eventVectorInThis.x)/this.getAnchorX());
        var heightInc = (this.__resizeStartVector.y-centerY>0)?((1==this.getAnchorY())?0:(eventVectorInThis.y - this.__resizeStartVector.y)/(1-this.getAnchorY())):((0==this.getAnchorY())?0:(this.__resizeStartVector.y - eventVectorInThis.y)/this.getAnchorY());
        this.setWidth(this.__resizeStartSize.width+widthInc);
        this.setHeight(this.__resizeStartSize.height+heightInc);
    }
}
HY.Core.RichNode.prototype._initAnchorMove = function(e){
    this.__anchorStartEventPos = new HY.Vect2D({x: e.offsetX,y: e.offsetY});
    this.__anchorStartAnchor = new HY.Vect2D({x:this.getAnchorX(),y:this.getAnchorY()});
    this.__anchorStartPos = new HY.Vect2D({x: this.getX() ,y:this.getY()});
}
HY.Core.RichNode.prototype._runAnchorMove = function(e){
    var offsetVector = new HY.Vect2D({x: e.offsetX-this.__anchorStartEventPos.x,y: e.offsetY-this.__anchorStartEventPos.y});
    var offsetVectorInThis = this.transVectorFromCanvas(offsetVector);
    var offsetVectorInParent = null;
    var parentNode = this.getParent();
    if(parentNode){
        offsetVectorInParent = parentNode.transVectorFromCanvas(offsetVector);
    }else{
        offsetVectorInParent = offsetVector;
    }
    this.setX(this.__anchorStartPos.x+offsetVectorInParent.x);
    this.setY(this.__anchorStartPos.y+offsetVectorInParent.y);
    this.setAnchorX(this.__anchorStartAnchor.x+offsetVectorInThis.x/this.getWidth());
    this.setAnchorY(this.__anchorStartAnchor.y+offsetVectorInThis.y/this.getHeight());
}
HY.Core.RichNode.prototype._unLockRotate = function(e){
    this.__rotateNodeIndex = -1;
}
HY.Core.RichNode.prototype._unLockResize = function(){
    this.__resizeNodeIndex = -1;
}
HY.Core.RichNode.prototype._unLockAnchorMove = function(sender,e){
    this.__anchorStartMoveFlag = false;
}
HY.Core.RichNode.prototype._nwRotateNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__rotateNodeIndex == 0){
        this._runRotate(e);
    }else{
        if(this.__rotateNodeIndex == -1){
            this._initRotate(e);
            this.__rotateNodeIndex = 0;
        }
    }
    this.onRotate(this,e);
}
HY.Core.RichNode.prototype._neRotateNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__rotateNodeIndex == 1){
        this._runRotate(e);
    }else{
        if(this.__rotateNodeIndex == -1){
            this._initRotate(e);
            this.__rotateNodeIndex = 1;
        }
    }
    this.onRotate(this,e);
}
HY.Core.RichNode.prototype._seRotateNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__rotateNodeIndex == 2){
        this._runRotate(e);
    }else{
        if(this.__rotateNodeIndex == -1){
            this._initRotate(e);
            this.__rotateNodeIndex = 2;
        }
    }
    this.onRotate(this,e);
}
HY.Core.RichNode.prototype._swRotateNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__rotateNodeIndex == 3){
        this._runRotate(e);
    }else{
        if(this.__rotateNodeIndex == -1){
            this._initRotate(e);
            this.__rotateNodeIndex = 3;
        }
    }
    this.onRotate(this,e);
}
HY.Core.RichNode.prototype._nwResizeNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__resizeNodeIndex == 0){
        this._runBothResize(e);
    }else{
        if(this.__resizeNodeIndex == -1){
            this._initResize(e);
            this.__resizeNodeIndex = 0;
        }
    }
    this.onResize(this,e);
}
HY.Core.RichNode.prototype._nResizeNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__resizeNodeIndex == 1){
        this._runHeightResize(e);
    }else{
        if(this.__resizeNodeIndex == -1){
            this._initResize(e);
            this.__resizeNodeIndex = 1;
        }
    }
    this.onResize(this,e);
}
HY.Core.RichNode.prototype._neResizeNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__resizeNodeIndex == 2){
        this._runBothResize(e);
    }else{
        if(this.__resizeNodeIndex == -1){
            this._initResize(e);
            this.__resizeNodeIndex = 2;
        }
    }
    this.onResize(this,e);
}
HY.Core.RichNode.prototype._eResizeNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__resizeNodeIndex == 3){
        this._runWidthResize(e);
    }else{
        if(this.__resizeNodeIndex == -1){
            this._initResize(e);
            this.__resizeNodeIndex = 3;
        }
    }
    this.onResize(this,e);
}
HY.Core.RichNode.prototype._seResizeNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__resizeNodeIndex == 4){
        this._runBothResize(e);
    }else{
        if(this.__resizeNodeIndex == -1){
            this._initResize(e);
            this.__resizeNodeIndex = 4;
        }
    }
    this.onResize(this,e);
}
HY.Core.RichNode.prototype._sResizeNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__resizeNodeIndex == 5){
        this._runHeightResize(e);
    }else{
        if(this.__resizeNodeIndex == -1){
            this._initResize(e);
            this.__resizeNodeIndex = 5;
        }
    }
    this.onResize(this,e);
}
HY.Core.RichNode.prototype._swResizeNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__resizeNodeIndex == 6){
        this._runBothResize(e);
    }else{
        if(this.__resizeNodeIndex == -1){
            this._initResize(e);
            this.__resizeNodeIndex = 6;
        }
    }
    this.onResize(this,e);
}
HY.Core.RichNode.prototype._wResizeNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__resizeNodeIndex == 7){
        this._runWidthResize(e);
    }else{
        if(this.__resizeNodeIndex == -1){
            this._initResize(e);
            this.__resizeNodeIndex = 7;
        }
    }
    this.onResize(this,e);
}
HY.Core.RichNode.prototype._anchorNodeDrag = function(sender,e){
    this.needLayoutSubNodes();
    if(this.__anchorStartMoveFlag){
        this._runAnchorMove(e);
    }else{
        this._initAnchorMove(e);
        this.__anchorStartMoveFlag = true;
    }
    this.onAnchorMove(this,e);
}
HY.Core.RichNode.prototype._anchorNodePaint = function(sender,dc,rect){
    dc.setStrokeStyle("#0000ff");
    dc.setFillStyle("#0000ff");
    dc.beginPath();
    dc.moveTo(3,0);
    dc.lineTo(30,0);
    dc.stroke();
    dc.beginPath();
    dc.moveTo(30,0);
    dc.lineTo(20,3);
    dc.lineTo(20,-3);
    dc.closePath();
    dc.fill();
    dc.setStrokeStyle("#00ff00");
    dc.setFillStyle("#00ff00");
    dc.beginPath();
    dc.moveTo(0,3);
    dc.lineTo(0,30);
    dc.stroke();
    dc.moveTo(0,30);
    dc.lineTo(3,20);
    dc.lineTo(-3,20);
    dc.closePath();
    dc.fill();
}