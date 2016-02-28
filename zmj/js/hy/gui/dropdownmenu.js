/*
dropItems:[
{
    name:,
    icon:
}
]
 */
var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.DropDownMenu = hy.extend(hy.gui.Label);
hy.gui.DropDownMenu.prototype.defaultMouseEnable = true;
hy.gui.DropDownMenu.prototype.defaultTextHorAlign = hy.gui.TEXT_HORALIGN_CENTER;
hy.gui.DropDownMenu.prototype.defaultTextVerAlign = hy.gui.TEXT_VERALIGN_CENTER;
hy.gui.DropDownMenu.prototype.notifyDropDownMenu = "dropdownmenu";
hy.gui.DropDownMenu.prototype.init = function(config){
	this.superCall("init",[config]);
    this._dropItems = this.isUndefined(config.dropItems) ? null: config.dropItems;
    this.addObserver(this.notifyMouseUp, this, this._showDropDownMenu);
}
hy.gui.DropDownMenu.prototype.setDropItems = function(items){
    this._dropItems = items;
}
hy.gui.DropDownMenu.prototype.getDropItems = function(){
    return this._dropItems;
}
hy.gui.DropDownMenu.prototype._showDropDownMenu = function(sender, e){
    if(e.button == 0 && this._dropItems != null && this._dropItems.length > 0){
        var app = this.getApplication();
        if(app){
            app.showContextMenu(e, this, this._dropItems, 1);
        }
    }
}