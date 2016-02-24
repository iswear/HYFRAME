var hy = hy || {};
hy.RichNode = hy.extend(hy.Node);
hy.RichNode.prototype.notifyResizing = "resizing";
hy.RichNode.prototype.notifyResizeEnd = "resizeend";
hy.RichNode.prototype.notifyRotating = "rotating";
hy.RichNode.prototype.notifyRotateEnd = "rotateend";
hy.RichNode.prototype.notifyAnchorMoving = "anchormoving";
hy.RichNode.prototype.notifyAnchorMoveEnd = "anchormoveend";
hy.RichNode.prototype.defaultAnchorMoveEnable = true;
hy.RichNode.prototype.defaultResizeEnable = true;
hy.RichNode.prototype.defaultRotateEnable = true;
hy.RichNode.prototype.defaultAdjustLayoutStyle = 1;//0:gamenode布局模式;1:guinode布局模式
hy.RichNode.prototype.defaultAdjustEdge = 6;
hy.RichNode.prototype.init = function(config){
    this.superCall("init",[config]);
    this._anchorMoveEnable = this.isUndefined(config.anchorMoveEnable) ? this.defaultAnchorMoveEnable : config.anchorMoveEnable;
    this._resizeEnable = this.isUndefined(config.resizeEnable) ? this.defaultResizeEnable : config.resizeEnable;
    this._rotateEnable = this.isUndefined(config.rotateEnable) ? this.defaultRotateEnable : config.rotateEnable;
    this._adjustLayoutStyle = this.isUndefined(config.adjustLayoutStyle) ? this.defaultAdjustLayoutStyle : config.adjustLayoutStyle;
    this._adjustEdge = this.isUndefined(config.adjustEdge) ? this.defaultAdjustEdge : config.adjustEdge;
}
hy.RichNode.prototype.sync = function(){
    this.superCall("sync",null);
    this._syncAnchorEnv();
    this._syncResizeEnv();
    this._syncRotateEnv();
}
hy.RichNode.prototype.getResizeEnable = function(){
    return this._resizeEnable;
}
hy.RichNode.prototype.setResizeEnable = function(resizeEnable){
    if(this._resizeEnable != resizeEnable){
        this._resizeEnable = resizeEnable;
        this._syncResizeEnv();
    }
}
hy.RichNode.prototype.getRotateEnable = function(){
    return this._rotateEnable;
}
hy.RichNode.prototype.setRotateEnable = function(rotateEnable){
    if(this._rotateEnable != rotateEnable){
        this._rotateEnable = rotateEnable;
        this._syncRotateEnv();
    }
}
hy.RichNode.prototype.getAnchorMoveEnable = function(){
    return this._anchorMoveEnable;
}
hy.RichNode.prototype.setAnchorMoveEnable = function(anchorMoveEnable){
    if(this._anchorMoveEnable != anchorMoveEnable){
        this._anchorMoveEnable = anchorMoveEnable;
        this._syncAnchorEnv();
    }
}

hy.RichNode.prototype._syncResizeEnv = function(){
    if(this._resizeEnable){
        this._resizeNWnode = new hy.Node({anchorX:0.5,anchorY:0.5,width:this._adjustEdge, height: this._adjustEdge, tag:0, cursor:"nw-resize"});
        this._resizeNnode = new hy.Node({anchorX:0.5,anchorY:0.5,width:this._adjustEdge, height: this._adjustEdge, tag:1,cursor:"ns-resize"});
        this._resizeNEnode = new hy.Node({anchorX:0.5,anchorY:0.5,width:this._adjustEdge, height: this._adjustEdge, tag:2,cursor:"ne-resize"});
        this._resizeEnode = new hy.Node({anchorX:0.5,anchorY:0.5,width:this._adjustEdge, height: this._adjustEdge, tag:3,cursor:"ew-resize"});
        this._resizeSEnode = new hy.Node({anchorX:0.5,anchorY:0.5,width:this._adjustEdge, height: this._adjustEdge, tag:4,cursor:"se-resize"});
        this._resizeSnode = new hy.Node({anchorX:0.5,anchorY:0.5,width:this._adjustEdge, height: this._adjustEdge,tag:5,cursor:"ns-resize"});
        this._resizeSWnode = new hy.Node({anchorX:0.5,anchorY:0.5,width:this._adjustEdge, height: this._adjustEdge,tag:6,cursor:"sw-resize"});
        this._reiszeWnode = new hy.Node({anchorX:0.5,anchorY:0.5,width:this._adjustEdge, height: this._adjustEdge,tag:7,cursor:"ew-resize"});
        if(this._adjustLayoutStyle != 0) {
            this._resizeNWnode.setAnchorX(0);
            this._resizeNWnode.setAnchorY(0);
            this._resizeNnode.setAnchorX(0.5);
            this._resizeNnode.setAnchorY(0);
            this._resizeNEnode.setAnchorX(1);
            this._resizeNEnode.setAnchorY(0);
            this._resizeEnode.setAnchorX(1);
            this._resizeEnode.setAnchorY(0.5);
            this._resizeSEnode.setAnchorX(1);
            this._resizeSEnode.setAnchorY(1);
            this._resizeSnode.setAnchorX(0.5);
            this._resizeSnode.setAnchorY(1);
            this._resizeSWnode.setAnchorX(0);
            this._resizeSWnode.setAnchorY(1);
            this._reiszeWnode.setAnchorX(0);
            this._reiszeWnode.setAnchorY(0.5);
        }
        this.addChildNodeAtLayer(this._resizeNWnode,1);
        this.addChildNodeAtLayer(this._resizeNnode,1);
        this.addChildNodeAtLayer(this._resizeNEnode,1);
        this.addChildNodeAtLayer(this._resizeEnode,1);
        this.addChildNodeAtLayer(this._resizeSEnode,1);
        this.addChildNodeAtLayer(this._resizeSnode,1);
        this.addChildNodeAtLayer(this._resizeSWnode,1);
        this.addChildNodeAtLayer(this._reiszeWnode,1);
        this._resizeNWnode.addObserver(this._resizeNWnode.notifyDraging,this,this._resizeNodesDraging);
        this._resizeNWnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._resizeNodesDragEnd);
        this._resizeNnode.addObserver(this._resizeNWnode.notifyDraging,this,this._resizeNodesDraging);
        this._resizeNnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._resizeNodesDragEnd);
        this._resizeNEnode.addObserver(this._resizeNWnode.notifyDraging,this,this._resizeNodesDraging);
        this._resizeNEnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._resizeNodesDragEnd);
        this._resizeEnode.addObserver(this._resizeNWnode.notifyDraging,this,this._resizeNodesDraging);
        this._resizeEnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._resizeNodesDragEnd);
        this._resizeSEnode.addObserver(this._resizeNWnode.notifyDraging,this,this._resizeNodesDraging);
        this._resizeSEnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._resizeNodesDragEnd);
        this._resizeSnode.addObserver(this._resizeNWnode.notifyDraging,this,this._resizeNodesDraging);
        this._resizeSnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._resizeNodesDragEnd);
        this._resizeSWnode.addObserver(this._resizeNWnode.notifyDraging,this,this._resizeNodesDraging);
        this._resizeSWnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._resizeNodesDragEnd);
        this._reiszeWnode.addObserver(this._resizeNWnode.notifyDraging,this,this._resizeNodesDraging);
        this._reiszeWnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._resizeNodesDragEnd);
        this.addObserver(this.notifyLayoutSubNodes,this,this._layoutResizeNodes);
        this.__resizeReady = false;
        this.__resizeStartVector = null;
        this.__resizeStartPoint = null;
        this.__resizeStartSize = null;
    }else{
        if(this._resizeNWnode){
            this.removeObserver(this.notifyLayoutSubNodes,this,this._layoutResizeNodes);
            this._resizeNWnode.removeFromParent(true);
            this._resizeNnode.removeFromParent(true);
            this._resizeNEnode.removeFromParent(true);
            this._resizeEnode.removeFromParent(true);
            this._resizeSEnode.removeFromParent(true);
            this._resizeSnode.removeFromParent(true);
            this._resizeSWnode.removeFromParent(true);
            this._reiszeWnode.removeFromParent(true);
            delete this._resizeNWnode;
            delete this._resizeNnode;
            delete this._resizeNEnode;
            delete this._resizeEnode;
            delete this._resizeSEnode;
            delete this._resizeSnode;
            delete this._resizeSWnode;
            delete this._reiszeWnode;
            delete this.__resizeReady;
            delete this.__resizeStartVector;
            delete this.__resizeStartPoint;
            delete this.__resizeStartSize;
        }
    }
}
hy.RichNode.prototype._syncRotateEnv = function(){
    if(this._rotateEnable){
        this._rotateNWnode = new hy.Node({anchorX:0.75,anchorY:0.75,width:this._adjustEdge*2, height: this._adjustEdge*2,tag:0,cursor:""});
        this._rotateNEnode = new hy.Node({anchorX:0.25,anchorY:0.75,width:this._adjustEdge*2, height: this._adjustEdge*2,tag:1,cursor:""});
        this._rotateSEnode = new hy.Node({anchorX:0.25,anchorY:0.25,width:this._adjustEdge*2, height: this._adjustEdge*2,tag:2,cursor:""});
        this._rotateSWnode = new hy.Node({anchorX:0.75,anchorY:0.25,width:this._adjustEdge*2, height: this._adjustEdge*2,tag:3,cursor:""});
        if(this._adjustLayoutStyle != 0){
            this._rotateNWnode.setAnchorX(0);
            this._rotateNWnode.setAnchorY(0);
            this._rotateNEnode.setAnchorX(1);
            this._rotateNEnode.setAnchorY(0);
            this._rotateSEnode.setAnchorX(1);
            this._rotateSEnode.setAnchorY(1);
            this._rotateSWnode.setAnchorX(0);
            this._rotateSWnode.setAnchorY(1);
        }
        this.addChildNodeAtLayer(this._rotateNWnode,0);
        this.addChildNodeAtLayer(this._rotateNEnode,0);
        this.addChildNodeAtLayer(this._rotateSEnode,0);
        this.addChildNodeAtLayer(this._rotateSWnode,0);
        this._rotateNWnode.addObserver(this._resizeNWnode.notifyDraging,this,this._rotateNodesDraging,this);
        this._rotateNWnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._rotateNodesDragEnd,this);
        this._rotateNEnode.addObserver(this._resizeNWnode.notifyDraging,this,this._rotateNodesDraging,this);
        this._rotateNEnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._rotateNodesDragEnd,this);
        this._rotateSEnode.addObserver(this._resizeNWnode.notifyDraging,this,this._rotateNodesDraging,this);
        this._rotateSEnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._rotateNodesDragEnd,this);
        this._rotateSWnode.addObserver(this._resizeNWnode.notifyDraging,this,this._rotateNodesDraging,this);
        this._rotateSWnode.addObserver(this._resizeNWnode.notifyDragEnd,this,this._rotateNodesDragEnd,this);
        this.addObserver(this.notifyLayoutSubNodes,this,this._layoutRotateNodes);
        this.__rotateReady = false;
        this.__rotateStartEventAngle = 0;
        this.__rotateStartAngle = 0;
    }else{
        if(this._rotateNWnode){
            this.removeObserver(this.notifyLayoutSubNodes,this,this._layoutRotateNodes);
            this._rotateNWnode.removeFromParent(false);
            this._rotateNEnode.removeFromParent(false);
            this._rotateSEnode.removeFromParent(false);
            this._rotateSWnode.removeFromParent(false);
            delete this._rotateNWnode;
            delete this._rotateNEnode;
            delete this._rotateSEnode;
            delete this._rotateSWnode;
            delete this.__rotateReady;
            delete this.__rotateStartEventAngle;
            delete this.__rotateStartAngle;
        }
    }
}
hy.RichNode.prototype._syncAnchorEnv = function(){
    if(this._anchorMoveEnable){
        this._anchorNode = new hy.Node({anchorX:0.5,anchorY:0.5, width:6, height: 6});
        this.addChildNodeAtLayer(this._anchorNode, 2);
        this._anchorNode.addObserver(this._anchorNode.notifyDraging,this,this._anchorNodeDraging);
        this._anchorNode.addObserver(this._anchorNode.notifyDragEnd,this,this._anchorNodeDragEnd);
        this.addObserver(this.notifyLayoutSubNodes,this,this._layoutAnchorNode);
        this.__anchorMoveReady = false;
        this.__anchorStartEventPoint = null;
        this.__anchorStartPoint = null;
        this.__anchorStartAnchor = null;
    }else{
        if(this._anchorNode){
            this.removeObserver(this.notifyLayoutSubNodes,this,this._layoutAnchorNode);
            this._anchorNode.removeFromParent(false);
            delete this._anchorNode;
            delete this.__anchorMoveReady;
            delete this.__anchorStartEventPoint;
            delete this.__anchorStartPoint;
            delete this.__anchorStartAnchor;
        }
    }
}

hy.RichNode.prototype._layoutResizeNodes = function(){
    var localLefTop = {x:this.getAnchorPixelX(),y:this.getAnchorPixelY()};
    var localRigBot = {x:this.getWidth()+localLefTop.x,y:this.getHeight()+localLefTop.y};
    var localEnter = {x:(localLefTop.x+localRigBot.x)/2,y:(localLefTop.y+localRigBot.y)/2};
    this._resizeNWnode.setX(localLefTop.x);
    this._resizeNWnode.setY(localLefTop.y);
    this._resizeNnode.setX(localEnter.x);
    this._resizeNnode.setY(localLefTop.y);
    this._resizeNEnode.setX(localRigBot.x);
    this._resizeNEnode.setY(localLefTop.y);
    this._resizeEnode.setX(localRigBot.x);
    this._resizeEnode.setY(localEnter.y);
    this._resizeSEnode.setX(localRigBot.x);
    this._resizeSEnode.setY(localRigBot.y);
    this._resizeSnode.setX(localEnter.x);
    this._resizeSnode.setY(localRigBot.y);
    this._resizeSWnode.setX(localLefTop.x);
    this._resizeSWnode.setY(localRigBot.y);
    this._reiszeWnode.setX(localLefTop.x);
    this._reiszeWnode.setY(localEnter.y);
}
hy.RichNode.prototype._layoutRotateNodes = function(){
    var localLefTop = {x:this.getAnchorPixelX(),y:this.getAnchorPixelY()};
    var localRigBot = {x:this.getWidth()+localLefTop.x,y:this.getHeight()+localLefTop.y};
    var localEnter = {x:(localLefTop.x+localRigBot.x)/2,y:(localLefTop.y+localRigBot.y)/2};
    this._rotateNWnode.setX(localLefTop.x);
    this._rotateNWnode.setY(localLefTop.y);
    this._rotateNEnode.setX(localRigBot.x);
    this._rotateNEnode.setY(localLefTop.y);
    this._rotateSEnode.setX(localRigBot.x);
    this._rotateSEnode.setY(localRigBot.y);
    this._rotateSWnode.setX(localLefTop.x);
    this._rotateSWnode.setY(localRigBot.y);
}
hy.RichNode.prototype._layoutAnchorNode = function(){
    this._anchorNode.setX(0);
    this._anchorNode.setY(0);
}
hy.RichNode.prototype._resizeNodesDraging = function(sender, e){
    if(!this.__resizeReady){
        this.__resizeReady = true;
        this.__resizeStartVector = this.transPointFromAncestorNode({x: e.offsetX,y: e.offsetY},null);
        this.__resizeStartSize = {width:this.getWidth(),height:this.getHeight()};
        this.__resizeStartPoint = {x:this.getX(), y:this.getY()};
    }else{
        switch (sender.getTag()){
            case 0:case 2:case 4:case 6:{
                if(this._adjustLayoutStyle == 1){
                    var localAnchorOffset  = this.transVectorFromAncestorNode({x: this.getX()-this.__resizeStartPoint.x, y: this.getY()-this.__resizeStartPoint.y},this.getParent());
                    var localEventPoint = this.transPointFromAncestorNode({x: e.offsetX, y: e.offsetY},null);
                    localEventPoint.x += localAnchorOffset.x;
                    localEventPoint.y += localAnchorOffset.y;
                    var widthInc,heightInc,xInc,yInc;
                    var centerX = (0.5-this.getAnchorX())*this.__resizeStartSize.width;
                    var centerY = (0.5-this.getAnchorY())*this.__resizeStartSize.height;
                    if(this.__resizeStartVector.x - centerX  > 0){
                        widthInc = localEventPoint.x - this.__resizeStartVector.x;
                        xInc = widthInc * this.getAnchorX();
                    }else{
                        widthInc = this.__resizeStartVector.x - localEventPoint.x;
                        xInc = widthInc * (this.getAnchorX()-1);
                    }
                    if(this.__resizeStartVector.y - centerY > 0){
                        heightInc = localEventPoint.y - this.__resizeStartVector.y;
                        yInc = heightInc * this.getAnchorY();
                    }else{
                        heightInc = this.__resizeStartVector.y - localEventPoint.y;
                        yInc = heightInc * (this.getAnchorY()-1);
                    }
                    var vectorIncInParent = this.transVectorToAncestorNode({x:xInc,y:yInc},this.getParent());
                    this.setX(this.__resizeStartPoint.x+vectorIncInParent.x);
                    this.setY(this.__resizeStartPoint.y+vectorIncInParent.y);
                    this.setWidth(this.__resizeStartSize.width+widthInc);
                    this.setHeight(this.__resizeStartSize.height+heightInc);
                }else{
                    var localEventPoint = this.transPointFromAncestorNode({x: e.offsetX, y: e.offsetY}, null);
                    var centerX = (0.5-this.getAnchorX())*this.__resizeStartSize.width;
                    var centerY = (0.5-this.getAnchorY())*this.__resizeStartSize.height;
                    var widthInc = (this.__resizeStartVector.x-centerX>0)?((1==this.getAnchorX())?0:(localEventPoint.x - this.__resizeStartVector.x)/(1-this.getAnchorX())):((0==this.getAnchorX())?0:(this.__resizeStartVector.x - localEventPoint.x)/this.getAnchorX());
                    var heightInc = (this.__resizeStartVector.y-centerY>0)?((1==this.getAnchorY())?0:(localEventPoint.y - this.__resizeStartVector.y)/(1-this.getAnchorY())):((0==this.getAnchorY())?0:(this.__resizeStartVector.y - localEventPoint.y)/this.getAnchorY());
                    this.setWidth(this.__resizeStartSize.width+widthInc);
                    this.setHeight(this.__resizeStartSize.height+heightInc);
                }
                this.postNotification(this.notifyResizing,[this.getWidth(),this.getHeight()]);
                break;
            }
            case 1:case 5:{
                if(this._adjustLayoutStyle == 1){
                    var localAnchorOffset  = this.transVectorFromAncestorNode({x: this.getX()-this.__resizeStartPoint.x, y: this.getY()-this.__resizeStartPoint.y},this.getParent());
                    var localEventPoint = this.transPointFromAncestorNode({x: e.offsetX, y: e.offsetY},null);
                    localEventPoint.x += localAnchorOffset.x;
                    localEventPoint.y += localAnchorOffset.y;
                    var heightInc,yInc;
                    var centerY = (0.5-this.getAnchorY())*this.__resizeStartSize.height;
                    if(this.__resizeStartVector.y - centerY > 0){
                        heightInc = localEventPoint.y - this.__resizeStartVector.y;
                        yInc = heightInc * this.getAnchorY();
                    }else{
                        heightInc = this.__resizeStartVector.y - localEventPoint.y;
                        yInc = heightInc * (this.getAnchorY()-1);
                    }
                    var vectorIncInParent = this.transVectorToAncestorNode({x:0,y:yInc},this.getParent());
                    this.setX(this.__resizeStartPoint.x+vectorIncInParent.x);
                    this.setY(this.__resizeStartPoint.y+vectorIncInParent.y);
                    this.setHeight(this.__resizeStartSize.height+heightInc);
                }else{
                    var localEventPoint = this.transPointFromAncestorNode({x: e.offsetX, y: e.offsetY}, null);
                    var centerY = (0.5-this.getAnchorY())*this.__resizeStartSize.height;
                    var heightInc = (this.__resizeStartVector.y-centerY>0)?((1==this.getAnchorY())?0:(localEventPoint.y - this.__resizeStartVector.y)/(1-this.getAnchorY())):((0==this.getAnchorY())?0:(this.__resizeStartVector.y - localEventPoint.y)/this.getAnchorY());
                    this.setHeight(this.__resizeStartSize.height+heightInc);
                }
                this.postNotification(this.notifyResizing,[this.getWidth(),this.getHeight()]);
                break;
            }
            case 3:case 7:{
                if(this._adjustLayoutStyle == 1){
                    var localAnchorOffset  = this.transVectorFromAncestorNode({x: this.getX()-this.__resizeStartPoint.x, y: this.getY()-this.__resizeStartPoint.y},this.getParent());
                    var localEventPoint = this.transPointFromAncestorNode({x: e.offsetX, y: e.offsetY},null);
                    localEventPoint.x += localAnchorOffset.x;
                    localEventPoint.y += localAnchorOffset.y;
                    var widthInc,xInc;
                    var centerX = (0.5-this.getAnchorX())*this.__resizeStartSize.width;
                    if(this.__resizeStartVector.x - centerX  > 0){
                        widthInc = localEventPoint.x - this.__resizeStartVector.x;
                        xInc = widthInc * this.getAnchorX();
                    }else{
                        widthInc = this.__resizeStartVector.x - localEventPoint.x;
                        xInc = widthInc * (this.getAnchorX()-1);
                    }
                    var vectorIncInParent = this.transVectorToAncestorNode({x:xInc,y:0},this.getParent());
                    this.setX(this.__resizeStartPoint.x+vectorIncInParent.x);
                    this.setY(this.__resizeStartPoint.y+vectorIncInParent.y);
                    this.setWidth(this.__resizeStartSize.width+widthInc);
                }else{
                    var localEventPoint = this.transPointFromAncestorNode({x: e.offsetX, y: e.offsetY}, null);
                    var centerX = (0.5-this.getAnchorX())*this.__resizeStartSize.width;
                    var widthInc = (this.__resizeStartVector.x-centerX>0)?((1==this.getAnchorX())?0:(localEventPoint.x - this.__resizeStartVector.x)/(1-this.getAnchorX())):((0==this.getAnchorX())?0:(this.__resizeStartVector.x - localEventPoint.x)/this.getAnchorX());
                    this.setWidth(this.__resizeStartSize.width+widthInc);
                }
                this.postNotification(this.notifyResizing,[this.getWidth(),this.getHeight()]);
                break;
            }
            default :
                break;
        }
        this.needLayoutSubNodes();
    }
}
hy.RichNode.prototype._resizeNodesDragEnd = function(sender, e){
    this.__resizeReady = false;
    this.postNotification(this.notifyResizeEnd,[this.getWidth(),this.getHeight()]);
}
hy.RichNode.prototype._rotateNodesDraging = function(sender, e){
    if(!this.__rotateReady){
        this.__rotateReady = true;
        var canvasPoint = this.transPointToAncestorNode({x:0,y:0},null);
        var canvasVector = {x:e.offsetX-canvasPoint.x, y:e.offsetY-canvasPoint.y};
        this.__rotateStartEventAngle = hy.geometry.vector.getAngle(canvasVector);
        this.__rotateStartAngle = this.getRotateZ();
    }else{
        var canvasPoint = this.transPointToAncestorNode({x:0,y:0},null);
        var canvasVector = {x:e.offsetX-canvasPoint.x,y:e.offsetY-canvasPoint.y};
        this.setRotateZ(this.__rotateStartAngle+hy.geometry.vector.getAngle(canvasVector)-this.__rotateStartEventAngle);
        this.postNotification(this.notifyRotating,[this.getRotateZ()]);
        this.needLayoutSubNodes();
    }
}
hy.RichNode.prototype._rotateNodesDragEnd = function(sender, e){
    this.__rotateReady = false;
    this.postNotification(this.notifyRotateEnd,[this.getRotateZ()]);
}
hy.RichNode.prototype._anchorNodeDraging = function(sender, e){
    if(!this.__anchorMoveReady){
        this.__anchorMoveReady = true;
        this.__anchorStartEventPoint = {x: e.offsetX,y: e.offsetY};
        this.__anchorStartAnchor = {x:this.getAnchorX(),y:this.getAnchorY()};
        this.__anchorStartPoint = {x: this.getX() ,y:this.getY()};
    }else{
        var offsetVector = {x: e.offsetX-this.__anchorStartEventPoint.x,y: e.offsetY-this.__anchorStartEventPoint.y};
        var localOffsetVector = this.transVectorFromAncestorNode(offsetVector, null);
        var parentOffsetVector = null;
        var parentNode = this.getParent();
        if(parentNode){
            parentOffsetVector = parentNode.transVectorFromAncestorNode(offsetVector, null);
        }else{
            parentOffsetVector = offsetVector;
        }
        this.setX(this.__anchorStartPoint.x+parentOffsetVector.x);
        this.setY(this.__anchorStartPoint.y+parentOffsetVector.y);
        this.setAnchorX(this.__anchorStartAnchor.x+localOffsetVector.x/this.getWidth());
        this.setAnchorY(this.__anchorStartAnchor.y+localOffsetVector.y/this.getHeight());
        this.postNotification(this.notifyAnchorMoving,[this.getAnchorX(),this.getAnchorY()]);
        this.needLayoutSubNodes();
    }
}
hy.RichNode.prototype._anchorNodeDragEnd = function(sender, e){
    this._anchorMoveReady = false;
    this.postNotification(this.notifyAnchorMoveEnd,[this.getAnchorX(),this.getAnchorY()]);
}