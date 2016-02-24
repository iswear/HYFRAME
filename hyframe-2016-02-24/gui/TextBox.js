/**
 * Created by Administrator on 2014/10/23.
 */
HY.GUI.TextBox = function(config){
    this.init(config);
}
HY.GUI.TextBox.prototype = new HY.GUI.Label();
HY.GUI.TextBox.prototype.defaultText = "";
HY.GUI.TextBox.prototype.defaultTextAlign = HY.GUI.TEXTALIGNLEFT;
HY.GUI.TextBox.prototype.backgroundColor = "#ffffff";
HY.GUI.TextBox.prototype.defaultBorderWidth = 0.0;
HY.GUI.TextBox.prototype.defaultCursor = "text";
HY.GUI.TextBox.prototype.defaultBorderColor = "#408aec";
HY.GUI.TextBox.prototype.defaultMouseEnable = true;
HY.GUI.TextBox.prototype.defaultEditEnable = true;
HY.GUI.TextBox.prototype.defaultClipBound = true;
HY.GUI.TextBox.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.editEnable){ this._editEnable = config.editEnable; } else { this._editEnable = this.defaultEditEnable; }
    if(config.editDelay){ this._editDelay = config.editDelay; } else { this._editDelay = this.defaultEditDelay; }

    this._editing = false;
}
HY.GUI.TextBox.prototype.getEditEnable = function(){
	return this._editEnable;
}
HY.GUI.TextBox.prototype.setEditEnable = function(editEnable){
	this._editEnable = editEnable;
}
HY.GUI.TextBox.prototype.getEditDelay = function(){
    return this._editDelay;
}
HY.GUI.TextBox.prototype.setEditDelay = function(delay){
    this._editDelay = delay;
}
HY.GUI.TextBox.prototype.isEditing = function(){
    return this._editing;
}
HY.GUI.TextBox.prototype.setText = function(pText){
    if(this._editing){
		var app = this.getApplication();
		if(app){
            var inputCursor = app.getInputCursor();
            inputCursor.value = pText;
		}else{
			this.superCall("setText",[pText]);
		}
    }else{
		this.superCall("setText",[pText]);
    }
}
HY.GUI.TextBox.prototype.getText = function(){
    if(this._editing){
		var app = this.getApplication();
		if (app) {
            var inputCursor = app.getInputCursor();
			return inputCursor.value;
		} else {
			return this.superCall("getText");
		}
    }else {
		return this.superCall("getText");
    }
}
HY.GUI.TextBox.prototype.focus = function(e){
    var value = this.superCall("focus",[e]);
    if(value && e){
        if(this._editEnable){
            var app = this.getApplication();
            if(app){
                var pageOffset = new HY.Vect2D({x:e.pageX,y:e.pageY});
                var localOffset = this.transPointFromCanvas(new HY.Vect2D({x:e.offsetX,y:e.offsetY}));
                pageOffset.x -= localOffset.x;
                pageOffset.y -= localOffset.y;
                var inputCursor = app.getInputCursor();
                inputCursor.style.left = pageOffset.x + "px";
                inputCursor.style.top =  (pageOffset.y-this.getBorderWidth()) + "px";
                inputCursor.style.width = (this.getWidth()-this.getBorderWidth()) + "px";
                inputCursor.style.height = (this.getHeight()-2*this.getBorderWidth()) + "px";
                if(this.getBackgroundColor() == null){
                    inputCursor.style.backgroundColor = "transparent";
                }else{
                    inputCursor.style.backgroundColor = this.getBackgroundColor();
                }
                inputCursor.style.lineHeight = (this.getHeight()-this.getBorderWidth()) +"px";
                inputCursor.style.borderWidth = this.getBorderWidth()+"px";
                inputCursor.style.borderColor = this.getBorderColor();
                inputCursor.style.fontFamily = this.getFontFamily();
                inputCursor.style.fontSize = this.getFontSize() + "px";
                inputCursor.style.color = "#000000";//this.getTextColor();
                inputCursor.value = this.getText();
                inputCursor.setSelectionRange(0,this.getText().length);
                inputCursor.focus();
                inputCursor.style.display = "inline";
                app.setInputNode(this);
                this.setBorderWidth(0);
                this.setText("");
                this.__tempBorderWidth = this.getBorderWidth();
                this._editing = true;
            }
        }
    }
    return value;
}
HY.GUI.TextBox.prototype.blur = function(){
    var value = this.superCall("blur");
    if(value){
        var app = this.getApplication();
        var inputCursor = app.getInputCursor();
        if(inputCursor.style.display == "inline"){
            this._editing = false;
            this.setText(inputCursor.value);
            inputCursor.blur();
            inputCursor.value = "";
            inputCursor.style.display = "none";
            this.setBorderWidth(this.__tempBorderWidth);
        }
    }
    return value;
}

