HY.GUI.TimeLine = function(config){
    this.init(config);
}
HY.GUI.TimeLine.prototype = new HY.GUI.View();
HY.GUI.TimeLine.prototype.defaultCacheEnable = true;
HY.GUI.TimeLine.prototype.defaultFrameWidth = 7;
HY.GUI.TimeLine.prototype.defaultSecondDivide = 10;
HY.GUI.TimeLine.prototype.defaultDuration = 10;
HY.GUI.TimeLine.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.duration != undefined){ this._duration = config.duration; } else { this._duration = this.defaultDuration; }
    if(config.frameWidth != undefined){ this._frameWidth = config.frameWidth; } else { this._frameWidth = this.defaultFrameWidth; }
    if(config.secondDivide != undefined){ this._secondDivide = config.secondDivide; } else { this._secondDivide  = this.defaultSecondDivide; }
    if(config.keyFrames != undefined){ this._keyFrames = config.keyFrames; } else { this._keyFrames = null; }
}
HY.GUI.TimeLine.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("paint",this._selfPaint,this);
}
HY.GUI.TimeLine.prototype.getFrameWidth = function(){
    return this._frameWidth;
}
HY.GUI.TimeLine.prototype.setFrameWidth = function(frameWidth){
    if(this._frameWidth != frameWidth){
        this._frameWidth = frameWidth;
        this.setMinLayoutWidth(this._frameWidth * this._secondDivide * this._duration);
        this.needLayoutSubNodes();
        this.reRender();
    }
}
HY.GUI.TimeLine.prototype.getSecondDivide = function(){
    return this._secondDivide;
}
HY.GUI.TimeLine.prototype.setFrameDuration = function(secondDivide){
    if(this._secondDivide != secondDivide){
        this._secondDivide = secondDivide;
        this.setMinLayoutWidth(this._frameWidth * this._secondDivide * this._duration);
        this.needLayoutSubNodes();
        this.reRender();
    }
}
HY.GUI.TimeLine.prototype.getDuration = function(){
    return this._duration;
}
HY.GUI.TimeLine.prototype.setDuration = function(duration){
    if(this._duration != duration){
        this._duration = duration;
        this.setMinLayoutWidth(this._frameWidth * this._secondDivide * this._duration);
        this.needLayoutSubNodes();
        this.reRender();
    }
}
HY.GUI.TimeLine.prototype.getKeyFrames = function(){
    return this._keyFrames;
}
HY.GUI.TimeLine.prototype.setKeyFrames = function(keyFrames){
    this._keyFrames = keyFrames;
    this.reRender();
}
HY.GUI.TimeLine.prototype.addKeyFrameAt = function(time){

}
HY.GUI.TimeLine.prototype.delKeyFrameAt = function(time){

}
HY.GUI.TimeLine.prototype._selfPaint = function(sender,dc,rect){
    dc.setStrokeStyle("#666666");
    dc.beginPath();
    dc.moveTo(0,this.getHeight()-0.5);
    dc.lineTo(this.getWidth(),this.getHeight()-0.5);
    for(var i= 0, accx = 0; accx < this.getWidth() ;++i){
        dc.moveTo(accx+0.5,0);
        dc.lineTo(accx+0.5,this.getHeight());
        accx += this._frameWidth;
    }
    dc.stroke();
    if(this._keyFrames && this._keyFrames.length > 0){
        dc.setStrokeStyle("#ff0000");
        dc.beginPath();
        for(var i=this._keyFrames.length - 1; i>=1;--i){
            if(this._keyFrames[i].tween == 1){
                var preTime = this._keyFrames[i-1].time;
                var curTime = this._keyFrames[i].time;
                var preX = preTime*this._secondDivide*this._frameWidth+this._frameWidth;
                var curX = curTime*this._secondDivide*this._frameWidth;
                var lineY = this.getHeight()-3.5;
                dc.moveTo(preX+1,lineY);
                dc.lineTo(curX-1,lineY);
                dc.lineTo(curX-5,lineY+1);
                dc.moveTo(curX-1,lineY);
                dc.lineTo(curX-5,lineY-1);
            }
        }
        dc.stroke();
        dc.setFillStyle("#000000");
        dc.beginPath();
        var rectY = this.getHeight()-7;
        var rectOffset = (this._frameWidth-4)/2;
        for(var i=this._keyFrames.length - 1; i>=0;--i){
            var curTime = this._keyFrames[i].time;
            var curX = curTime*this._secondDivide*this._frameWidth+rectOffset;
            dc.rect(curX,rectY,5,5);
        }
        dc.fill();
    }
}