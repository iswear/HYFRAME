var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.TimelineRule = hy.extend(hy.gui.View);
hy.gui.TimelineRule.prototype.notifyAsyncDuration = "syncduration";
hy.gui.TimelineRule.prototype.notifyAsyncSelectedFrame = "syncselectedframe";
hy.gui.TimelineRule.prototype.defaultHeight = 20;
hy.gui.TimelineRule.prototype.defaultClipBound = false;
hy.gui.TimelineRule.prototype.defaultDuration = 3000;
hy.gui.TimelineRule.prototype.defaultSecondDivide = 20;
hy.gui.TimelineRule.prototype.init = function(config){
    this.superCall("init",[config]);
    this._secondDivide = this.isUndefined(config.secondDivide) ? this.defaultSecondDivide : config.secondDivide;
    this._duration = this.isUndefined(config.duration) ? this.defaultDuration : config.duration;
    this._selectedFrame = -1;
    this.addObserver(this.notifyPaint, this, this._paintTimeLineRule);
}
hy.gui.TimelineRule.prototype.setDuration = function(duration){
    if(this._duration == duration){
        this._duration = duration;
        this.refresh();
        this.postNotification(this.notifyAsyncDuration, null);
    }
}
hy.gui.TimelineRule.prototype.getDuration = function(){
    return this._duration;
}
hy.gui.TimelineRule.prototype.setSelectedFrame = function(frame){
    if(this._selectedFrame != frame){
        this._selectedFrame = frame;
        this.refresh();
        this.postNotification(this.notifyAsyncSelectedFrame, null);
    }
}
hy.gui.TimelineRule.prototype.getSelectedFrame = function(){
    return this._selectedFrame;
}
hy.gui.TimelineRule.prototype._paintTimeLineRule = function(sender, dc, rect){
    /*宽度为8*/
    dc.setStrokeStyle(hy.gui.colors.DBLACK);
    dc.setFont("10px sans-serif");
    dc.beginPath();
    var frameNum = this._secondDivide * this._duration / 1000;
    var longY = this.getHeight() - 16;
    var halfLongY = this.getHeight() - 13;
    var shortY = this.getHeight() - 10;
    var bottomY = this.getHeight() - 2;
    var x = 0;
    var width = this.getWidth();
    for(var i = 0; i < frameNum && x < width; ++i){
        if(i % this._secondDivide == 0){
            dc.moveTo(x+0.5, longY);
            dc.lineTo(x+0.5, bottomY);
            dc.strokeText(i/this._secondDivide, x+2, this.getHeight() - 13);
        }else if( i % this._secondDivide == this._secondDivide / 2 ){
            dc.moveTo(x+0.5, halfLongY);
            dc.lineTo(x+0.5, bottomY);
        }else{
            dc.moveTo(x+0.5, shortY);
            dc.lineTo(x+0.5, bottomY);
        }
        x = x + 8;
    }
    dc.stroke();
}
hy.gui.TimelineRule.prototype._mouseDownTimelineRule = function(sender, e){
    var localPoint = this.transPointFromAncestorNode({x: e.offsetX, y: e.offsetY}, null);
    this.setSelectedFrame(Math.floor(localPoint.x / 8));
}