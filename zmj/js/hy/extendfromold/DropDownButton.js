HY.GUI.DropDownButton = function(config){
	this.init(config);
}
HY.GUI.DropDownButton.prototype = new HY.GUI.Button();
HY.GUI.DropDownButton.prototype.init = function (config) {
    this.superCall("init",[config]);
    if(config.dropItems){ this.setDropItems(config.dropItems); } else { this.setDropItems(null); }
    if(config.dropItemEvent){ this.addEventListener("dropitem",config.dropItemEvent.selector,config.dropItemEvent.target); }
    this.addEventListener("mouseup",this._dropDownButtonMouseUp,this);
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
HY.GUI.DropDownButton.prototype._dropDownButtonMouseUp = function(sender,e){
    if(this._dropItems != null && this._dropItems.length > 0){
        var app = this.getApplication();
        if(app){
            app.showContextMenu(e,this,this._dropItems,1);
            this.setSelected(true);
        }
    }
}
