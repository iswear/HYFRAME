var hy = hy || {};
hy.gui.Timeline = hy.extend(hy.gui.View);
hy.gui.Timeline.prototype.notifySyncDuration = "syncduration";
hy.gui.Timeline.prototype.notifySyncSelectedFrame = "syncselectedframe";
hy.gui.Timeline.prototype.defaultHeight = 20;
hy.gui.Timeline.prototype.defaultClipBound = false;
hy.gui.Timeline.prototype.defaultDuration = 3000;
hy.gui.Timeline.prototype.defaultSecondDivide = 20;
hy.gui.Timeline.prototype.init = function(config){
	this.superCall("init",[config]);
	this._secondDivide = this.isUndefined(config.secondDivide) ? this.defaultSecondDivide : config.secondDivide;
	this._duration = this.isUndefined(config.duration) ? this.defaultDuration : config.duration;
	this._keyFrames = this.isUndefined(config.keyFrames) ? [] : config.keyFrames;
	this._selectedFrame = -1;
	this.addObserver(this.notifyPaint, this, this._paintTimeline);
	this.addObserver(this.notifyMouseDown, this, this._mouseDownTimeline);
}
hy.gui.Timeline.prototype.setDuration = function(duration){
	if(this._duration != duration){
		this._duration = duration;
		this.refresh();
		this.postNotification(this.notifySyncDuration, null);
	}
}
hy.gui.Timeline.prototype.getDuration = function(){
	return this._duration;
}
hy.gui.Timeline.prototype.setSelectedFrame = function(frame){
	if(this._selectedFrame != frame){
		this._selectedFrame = frame;
		this.refresh();
		this.postNotification(this.notifySyncSelectedFrame, null);
	}
}
hy.gui.Timeline.prototype.getSelectedFrame = function(){
	return this._selectedFrame;
}
hy.gui.Timeline.prototype.setKeyFrames = function(keyFrames){
	if(this._keyFrames != keyFrames){
		this._keyFrames = keyFrames;
		this.refresh();
	}
}
hy.gui.Timeline.prototype.getKeyFrames = function(){
	return this._keyFrames;
}
hy.gui.Timeline.prototype._sortKeyFrames = function(keyFrames){
	for(var i = 1, len = this._keyFrames.length ; i < len ; ++i){
		for(var j = i - 1 ; j >= 0 ; --j){
			if(this._keyFrames[j].time > this._keyFrames[j+1].time){
				var tempFrame = this._keyFrames[i];
				this._keyFrames[j] = this._keyFrames[j+1];
				this._keyFrames[j+1] = tempFrame;
			}else{
				break;
			}
		}
	}
	return keyFrames;
}
hy.gui.Timeline.prototype._paintTimeline = function(sender, dc, rect){
	dc.setStrokeStyle(hy.gui.colors.DGRAY);
	dc.setLineWidth(1);
	dc.beginPath();
	var frameNum = this._duration * this._secondDivide / 1000;
	var width = this.getWidth();
	var height = this.getHeight();
	for(var i= 0, x = 0; i < frameNum && x < width ; ++i){
		dc.moveTo(x+0.5, 0);
		dc.lineTo(x+0.5, height);
		x += 8;
	}
	dc.stroke();
	dc.setFillStyle(hy.gui.colors.RED);
	if(this._selectedFrame >= 0){
		var selRectX = this._selectedFrame * 8;
		if(selRectX < width){
			dc.fillRect(selRectX+1, 0, 7, height-1);
		}
	}
	if(this._keyFrames && this._keyFrames.length > 0){
		dc.setStrokeStyle(hy.gui.colors.GREEN);
		dc.beginPath();
		for(var i=this._keyFrames.length - 1; i >= 1;--i){
			if(this._keyFrames[i].tween == 1){
				var preTime = this._keyFrames[i-1].time;
				var curTime = this._keyFrames[i].time;
				var preX = preTime * this._secondDivide * 8 / 1000 + 8;
				var curX = curTime * this._secondDivide * 8 / 1000;
				var lineY = height-3.5;
				dc.moveTo(preX+1,lineY-1);
				dc.lineTo(curX-1,lineY-1);
				dc.lineTo(curX-5,lineY);
				dc.moveTo(curX-1,lineY-1);
				dc.lineTo(curX-5,lineY-2);
			}
		}
		dc.stroke();
		dc.setFillStyle(hy.gui.colors.GREEN);
		dc.beginPath();
		var rectY = height-7;
		var rectOffset = 2;
		for(var i=this._keyFrames.length - 1; i>=0;--i){
			var curTime = this._keyFrames[i].time;
			var curX = curTime*this._secondDivide*this._frameWidth / 1000 + rectOffset;
			dc.rect(curX,rectY,5,5);
		}
		dc.fill();
	}
}
hy.gui.Timeline.prototype._mouseDownTimeline = function(sender, e){
	var localPoint = this.transPointFromAncestorNode({x: e.offsetX, y: e.offsetY}, null);
	this.setSelectedFrame(Math.floor(localPoint.x / 8));
}