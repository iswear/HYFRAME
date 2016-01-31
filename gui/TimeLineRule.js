/**
 * Created by Administrator on 2015/11/21.
 */
HY.GUI.TimeLineRule = function(config){
    this.init(config);
}
HY.GUI.TimeLineRule.prototype = new HY.GUI.View();
HY.GUI.TimeLineRule.prototype.defaultHeight = 20;
HY.GUI.TimeLineRule.prototype.defaultBackgroundColor = "#FFFFFF";
HY.GUI.TimeLineRule.prototype.defaultClipBound = false;
HY.GUI.TimeLineRule.prototype.defaultCacheEnable = true;
HY.GUI.TimeLineRule.prototype.defaultFrameWidth = 7;
HY.GUI.TimeLineRule.prototype.defaultSecondDivide = 10;
HY.GUI.TimeLineRule.prototype.defaultDuration = 10;
HY.GUI.TimeLineRule.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.duration != undefined){ this._duration = config.duration; } else { this._duration = this.defaultDuration; }
    if(config.frameWidth != undefined){ this._frameWidth = config.frameWidth; } else { this._frameWidth = this.defaultFrameWidth; }
    if(config.secondDivide != undefined){ this._secondDivide = config.secondDivide; } else { this._secondDivide = this.defaultSecondDivide; }
}
HY.GUI.TimeLineRule.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("paint",this._selfPaint,this);
    this.setMinLayoutWidth(this._duration * this._secondDivide * this._frameWidth);
}
HY.GUI.TimeLineRule.prototype.getFrameWidth = function(){
    return this._frameWidth;
}
HY.GUI.TimeLineRule.prototype.setFrameWidth = function(frameWidth) {
    if (this._frameWidth != frameWidth) {
        this._frameWidth = frameWidth;
        this.setMinLayoutWidth(this._duration * this._secondDivide * this._frameWidth);
        this.needLayoutSubNodes();
        this.reRender();
    }
}
HY.GUI.TimeLineRule.prototype.getSecondDivide = function(){
    return this._secondDivide;
}
HY.GUI.TimeLineRule.prototype.setSecondDivide = function(secondDivide){
    if(this._secondDivide != secondDivide){
        this._secondDivide = secondDivide;
        this.setMinLayoutWidth(this._duration * this._secondDivide * this._frameWidth);
        this.needLayoutSubNodes();
        this.reRender();
    }
}
HY.GUI.TimeLineRule.prototype.getDuration = function(){
    return this._duration;
}
HY.GUI.TimeLineRule.prototype.setDuration = function(duration){
    if(this._duration != duration){
        this._duration = duration;
        this.setMinLayoutWidth(this._duration * this._secondDivide * this._frameWidth);
        this.needLayoutSubNodes();
        this.reRender();
    }
}
HY.GUI.TimeLineRule.prototype._selfPaint = function(sender,dc,rect){
    this.superCall("onPaint",[dc,rect]);
    var accx = 0;
    dc.setStrokeStyle("#000000");
    dc.setFont("10px sans-serif");
    dc.beginPath();
    dc.moveTo(0,this.getHeight());
    dc.lineTo(this.getWidth(),this.getHeight());
    for(var i=0;accx<=this.getWidth();++i){
        if(i%this._secondDivide == 0){
            dc.moveTo(accx+0.5,this.getHeight()-10);
            dc.lineTo(accx+0.5,this.getHeight()-2);
            dc.strokeText(i/this._secondDivide,accx,this.getHeight()*1/2);
        }else{
            dc.moveTo(accx+0.5,this.getHeight()-6);
            dc.lineTo(accx+0.5,this.getHeight()-2);
        }
        accx += this._frameWidth;
    }
    dc.stroke();
}

