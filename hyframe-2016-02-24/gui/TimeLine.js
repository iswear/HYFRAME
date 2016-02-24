HY.GUI.TimeLine = function(config){
    this.init(config);
}
HY.GUI.TimeLine.prototype = new HY.GUI.View();
HY.GUI.TimeLine.prototype.defaultCacheEnable = true;
HY.GUI.TimeLine.prototype.defaultFrameWidth = 7;
HY.GUI.TimeLine.prototype.defaultSecondDivide = 20;
HY.GUI.TimeLine.prototype.defaultMinDuration = 10;
HY.GUI.TimeLine.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.frameWidth != undefined){ this._frameWidth = config.frameWidth; } else { this._frameWidth = this.defaultFrameWidth; }
    if(config.secondDivide != undefined){ this._secondDivide = config.secondDivide; } else { this._secondDivide  = this.defaultSecondDivide; }
    if(config.minDuration != undefined){ this._minDuration = config.minDuration; } else { this._minDuration = this.defaultMinDuration; }
    if(config.keyFrames != undefined){ this._keyFrames = config.keyFrames; } else { this._keyFrames = []; }
    if(config.dataSource != undefined){ this._dataSource = config.dataSource; } else { this._dataSource = null; }
    this._selectedFrameIndex = -1;
}
HY.GUI.TimeLine.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("paint",this._paintTimeLine,this);
    this.addEventListener("mousedown",this._timelineMouseDown,this);
    this.setMinLayoutWidth(this._frameWidth*this._secondDivide*this._minDuration);
    this._sortKeyFrames();
}
HY.GUI.TimeLine.prototype.getMinDuration = function(){
    return this._minDuration;
}
HY.GUI.TimeLine.prototype.setMinDuration = function(minDuration){
    if(this._minDuration != minDuration){
        this._minDuration = minDuration;
        this.setMinLayoutWidth(this._frameWidth * this._secondDivide * this._minDuration);
        this.needLayoutSubNodes();
        this.reRender();
    }
}
HY.GUI.TimeLine.prototype.getKeyFrames = function(){
    return this._keyFrames;
}
HY.GUI.TimeLine.prototype.setKeyFrames = function(keyFrames){
    if(this._keyFrames != keyFrames){
        this._keyFrames = keyFrames;
        this._sortKeyFrames();
        this.reRender();
    }
}
HY.GUI.TimeLine.prototype.getSelectedFrameIndex = function(){
    return this._selectedFrameIndex;
}
HY.GUI.TimeLine.prototype.setSelectedFrameIndex = function(frameIndex){
    if(this._selectedFrameIndex != frameIndex){
        this._selectedFrameIndex = frameIndex;
        this.reRender();
    }
}
HY.GUI.TimeLine.prototype.getDataSource = function(){
    return this._dataSource;
}
HY.GUI.TimeLine.prototype.setDataSource = function(dataSource){
    this._dataSource = dataSource;
}
HY.GUI.TimeLine.prototype.addKeyFrameAt = function(frameIndex){
    if(frameIndex < 0){
        return;
    }
    var dataSource = this;
    if(this._dataSource){
        dataSource = this._dataSource;
    }
    var frameTime = frameIndex / this._secondDivide;
    for(var i= 0,len=this._keyFrames.length; i<len ; ++i){
        if(frameTime < this._keyFrames[i].time){
            var preframe = null, nextframe=this._keyFrames[i];
            if(i > 0){
                preframe = this._keyFrames[i-1];
            }
            var curframe = {time:frameTime, tween:false};
            curframe.tween = this._keyFrames[i].tween;
            curframe.param = dataSource.paramOfAddKeyFrameAt(preframe,curframe,nextframe);
            this._keyFrames.splice(i,0,curframe);
            this.reRender();
            return;
        }else if(frameTime == this._keyFrames[i].time){
            return;
        }
    }
    var preframe = null;
    if(this._keyFrames.length > 0){
        preframe = this._keyFrames[this._keyFrames.length-1];
    }
    var curframe = {time:frameTime,tween:false};
    curframe.param = dataSource.paramOfAddKeyFrameAt(preframe,curframe,null);
    this._keyFrames.push(curframe);
    this.reRender();
}
HY.GUI.TimeLine.prototype.removeKeyFrameAt = function(frameIndex){
    var frameTime = frameIndex / this._secondDivide;
    for(var i= 0,len=this._keyFrames.length;i<len;++i){
        if(frameTime == this._keyFrames[i].time){
            this._keyFrames.splice(i,1);
            this.reRender();
            return;
        }else if(frameTime < this._keyFrames[i].time){
            return;
        }
    }
}
HY.GUI.TimeLine.prototype.addTweenAniAt = function(frameIndex){
    if(frameIndex < 0){
        return;
    }
    var frameTime = frameIndex / this._secondDivide;
    for(var i= 0,len=this._keyFrames.length;i<len;++i){
        if(frameTime <= this._keyFrames[i].time){
            this._keyFrames[i].tween = true;
            this.reRender();
            return;
        }
    }
}
HY.GUI.TimeLine.prototype.removeTweenAniAt = function(frameIndex){
    var frameTime = frameIndex / this._secondDivide;
    for(var i= 0,len=this._keyFrames.length;i<len;++i){
        if(frameTime <= this._keyFrames[i].time){
            this._keyFrames[i].tween = false;
            this.reRender();
            return;
        }
    }
}
HY.GUI.TimeLine.prototype._sortKeyFrames = function(){
    for(var i = 1, len = this._keyFrames.length; i<len; ++i){
        for(var j=i-1 ; j>=0 ; --j){
            if(this._keyFrames[j].time > this._keyFrames[j+1].time){
                var tempframe = this._keyFrames[i];
                this._keyFrames[j] = this._keyFrames[j+1];
                this._keyFrames[j+1] = tempframe;
            }else{
                break;
            }
        }
    }
    this.reRender();
}
HY.GUI.TimeLine.prototype._paintTimeLine = function(sender,dc,rect){
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

    dc.setFillStyle("#ff0000");
    if(this._selectedFrameIndex > 0){
        var selRectX = this._selectedFrameIndex * this._frameWidth;
        if(selRectX < this.getWidth()){
            dc.fillRect(selRectX+1,0,6,this.getHeight()-1);
        }
    }
    if(this._keyFrames && this._keyFrames.length > 0){
        dc.setStrokeStyle("#00ff00");
        dc.beginPath();
        for(var i=this._keyFrames.length - 1; i>=1;--i){
            if(this._keyFrames[i].tween == 1){
                var preTime = this._keyFrames[i-1].time;
                var curTime = this._keyFrames[i].time;
                var preX = preTime*this._secondDivide*this._frameWidth+this._frameWidth;
                var curX = curTime*this._secondDivide*this._frameWidth;
                var lineY = this.getHeight()-3.5;
                dc.moveTo(preX+1,lineY-1);
                dc.lineTo(curX-1,lineY-1);
                dc.lineTo(curX-5,lineY);
                dc.moveTo(curX-1,lineY-1);
                dc.lineTo(curX-5,lineY-2);
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
HY.GUI.TimeLine.prototype._timelineMouseDown = function(sender, e){
    var localPoint = this.transPointFromCanvas(new HY.Vect2D({x: e.offsetX,y: e.offsetY}));
    this.setSelectedFrameIndex(Math.floor(localPoint.x/this._frameWidth));
}

HY.GUI.TimeLine.prototype.paramOfAddKeyFrameAt = function(preFrame,newFrame,nextFrame){
    return null;
}