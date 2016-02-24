/**
 * Created by Administrator on 2015/10/28.
 */
HY.GUI.MScrollContentView = function(config){
    this.init(config);
}
HY.GUI.MScrollContentView.prototype = new HY.GUI.View();
HY.GUI.MScrollContentView.prototype.defaultDragEnable = true;
HY.GUI.MScrollContentView.prototype.defaultClipBound = false;
HY.GUI.MScrollContentView.prototype.defaultBackgroundColor = null;
HY.GUI.MScrollContentView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this.__preFrameX = 0;
    this.__preFrameY = 0;
    this.__dragSpeedX = 0;
    this.__dragSpeedY = 0;
    this.__xSliderAction = null;
    this.__ySliderAction = null;
}
HY.GUI.MScrollContentView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("xchanged",this._selfXChanged,this);
    this.addEventListener("ychanged",this._selfYChanged,this);
    this.addEventListener("startdrag",this._selfStartDrag,this);
    this.addEventListener("enddrag",this._selfEndDrag,this);
    this.addEventListener("enterframe",this._selfEnterFrame,this);
}
HY.GUI.MScrollContentView.prototype.checkActionLegal = function(pAction,pRunParams,pDeltaTime){
    if(this.__xSliderAction == pAction){
        if(pRunParams._curAccelerateX * pRunParams._curSpeedX >= 0){
            this.stopAction(this.__xSliderAction);
            this.__xSliderAction = null;
            window.console.log("checkactionlegal stopx");
        }
    }
    if(this.__ySliderAction == pAction){
        if(pRunParams._curAccelerateY * pRunParams._curSpeedY >= 0){
            this.stopAction(this.__ySliderAction);
            this.__ySliderAction = null;
            window.console.log("checkactionlegal stopy");
        }
    }
    window.console.log("checkactionlegal");
    return true;
}
HY.GUI.MScrollContentView.prototype._selfXChanged = function(sender){
    if(this.getX() <= this.getLimitMinX() || this.getX() >= this.getLimitMaxX()){
        if(this.__xSliderAction != null){
            this.stopAction(this.__xSliderAction);
            this.__xSliderAction = null;
            window.console.log("xstop");
        }
    }
}
HY.GUI.MScrollContentView.prototype._selfYChanged = function(sender){
    if(this.getY() <= this.getLimitMinY() || this.getY() >= this.getLimitMaxY()){
        if(this.__ySliderAction != null){
            this.stopAction(this.__ySliderAction);
            this.__ySliderAction = null;
            window.console.log("ystop");
        }
    }
}
HY.GUI.MScrollContentView.prototype._selfStartDrag = function(sender,event){
    if(this.__xSliderAction != null){
        this.stopAction(this.__xSliderAction);
    }
    if(this.__ySliderAction != null){
        this.stopAction(this.__ySliderAction);
    }
    this.stopAction(this.__ySliderAction);
    this.__preFrameX = this.getX();
    this.__preFrameY = this.getY();
    this.__dragSpeedX = 0;
    this.__dragSpeedY = 0;
}
HY.GUI.MScrollContentView.prototype._selfEndDrag = function (sender,event){
    if(this.__dragSpeedX != 0){
        this.__xSliderAction = new HY.Core.Action.MoveAlongX({
            speedX:this.__dragSpeedX,
            accelerateX:-2500*(this.__dragSpeedX/Math.abs(this.__dragSpeedX))
        });
        this.runAction(this.__xSliderAction);
    }
    if(this.__dragSpeedY != 0){
        this.__ySliderAction = new HY.Core.Action.MoveAlongY({
            speedY:this.__dragSpeedY,
            accelerateY:-2500*(this.__dragSpeedY/Math.abs(this.__dragSpeedY))
        });
        this.runAction(this.__ySliderAction);
        window.console.log("ystart:"+this.__dragSpeedY);
    }
}
HY.GUI.MScrollContentView.prototype._selfEnterFrame = function(sender,deltatime){
    this.__dragSpeedX = (this.getX()-this.__preFrameX)*1000/deltatime;
    this.__dragSpeedY = (this.getY()-this.__preFrameY)*1000/deltatime;
    this.__preFrameX = this.getX();
    this.__preFrameY = this.getY();
}