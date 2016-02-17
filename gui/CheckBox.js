HY.GUI.CheckBox = function(config) {
    this.init(config);
}
HY.GUI.CheckBox.prototype = new HY.GUI.View();
HY.GUI.CheckBox.prototype.defaultCacheEnable = true;
HY.GUI.CheckBox.prototype.defaultChecked = false;
HY.GUI.CheckBox.prototype.defaultWidth = 15.0;
HY.GUI.CheckBox.prototype.defaultHeight = 15.0;
HY.GUI.CheckBox.prototype.init = function(config) {
    this.superCall("init", [config]);
    if (config.checked) { this.setChecked(config.checked); } else { this.setChecked(this.defaultChecked); }
    this.addEventListener("paint", this._paintCheckBox, this);
    this.addEventListener("mouseup", this._checkBoxMouseUp, this);
}
HY.GUI.CheckBox.prototype.initConstraint = function(){
    this.superCall("initConstraint");
}
HY.GUI.CheckBox.prototype.setWidth = function (pWidth) { }
HY.GUI.CheckBox.prototype.setHeight = function (pHeight) { }
HY.GUI.CheckBox.prototype.setChecked = function(pCheck){
    if(this._checked != pCheck){
        this._checked = pCheck;
        this.onCheckedChanged(this,pCheck);
        this.reRender();
    }
}
HY.GUI.CheckBox.prototype.getChecked = function(){
    return this._checked;
}
HY.GUI.CheckBox.prototype.onCheckedChanged = function(sender,checked){
    this.launchEvent("checkedchanged",[this,checked]);
}
HY.GUI.CheckBox.prototype._paintCheckBox = function(sender,dc,rect){
    var lineWidth = 2.0/15.0*this.getWidth();
    var lefttop = new HY.Vect2D({});
    lefttop.x = -this.getAnchorX()*this.getWidth();
    lefttop.y = -this.getAnchorY()*this.getHeight();
    dc.setLineWidth(lineWidth);
    dc.setStrokeStyle("#408aec");
    dc.strokeRect(lefttop.x,lefttop.y,this.getWidth(),this.getHeight());
    if(this._checked){
        dc.beginPath();
        dc.moveTo(lefttop.x+lineWidth,lefttop.y+this.getHeight()/2);
        dc.lineTo(lefttop.x+this.getWidth()/3,lefttop.y+this.getHeight()-lineWidth);
        dc.lineTo(lefttop.x+this.getWidth()-lineWidth,lineWidth);
        dc.strokeStyle = "#408aec";
        dc.stroke();
    }
}
HY.GUI.CheckBox.prototype._checkBoxMouseUp = function(sender,e){
    this.setChecked(!this._checked);
}