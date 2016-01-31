HY.GUI.DropDownButton = function(config){
	this.init(config);
}
HY.GUI.DropDownButton.prototype = new HY.GUI.Button();
HY.GUI.DropDownButton.prototype.initMember = function (config) {
    this.superCall("initMember",[config]);
    if(config.dropItems){ this._dropItems = config.dropItems; } else { this._dropItems = null; }
    if(config.dropItemEvent){ this.addEventListener("dropitem",config.dropItemEvent.selector,config.dropItemEvent.target); }
}
HY.GUI.DropDownButton.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("mouseup",this._selfMouseUp,this);
}
HY.GUI.DropDownButton.prototype.getDropItems = function(){
	return this._dropItems;
}
HY.GUI.DropDownButton.prototype.setDropItems = function(pItems){
	this._dropItems = pItems;
}
HY.GUI.DropDownButton.prototype.onDropItem = function(sender,e,menuCellView){
	this.launchEvent("dropitem",[this,e,menuCellView]);
}
HY.GUI.DropDownButton.prototype._selfMouseUp = function(sender,e){
    if(this._dropItems != null && this._dropItems.length > 0){
        var app = this.getApplication();
        if(app){
            app.showContextMenu(e,this,this._dropItems,1);
            this.setSelected(true);
        }
    }
}
