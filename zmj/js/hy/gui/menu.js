/*
items:[
{
name:
dropItems:[
    {
        name:,
        icon:
    }
]
}
]
 */
var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.Menu = hy.extend(hy.gui.View);
hy.gui.Menu.prototype.notifyMenu = "menu";
hy.gui.Menu.prototype.defaultMouseEnable = false;
hy.gui.Menu.prototype.init = function(config){
	this.superCall("init", [config]);
	this._menuItems = this.isUndefined(config.menuItems) ? null : config.menuItems;
	this._dropDownItems = [];
    this.__needMallocMenuItems = true;
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutMenuItems);
    this.addObserver(this.notifyEnterFrame, this, this._mallocMenuItems);
}
hy.gui.Menu.prototype.setMenuItems = function(items){
    this._menuItems = items;
    this.needMallocMenuItems();
}
hy.gui.Menu.prototype.getMenuItems = function(){
    return this._menuItems;
}
hy.gui.Menu.prototype.needMallocMenuItems = function(){
    this.__needMallocMenuItems = true;
}
hy.gui.Menu.prototype._layoutMenuItems = function(sender){
    for(var i = 0, count = this._dropDownItems.length ; i < count ; ++i){
        var dropDownMenu = this._dropDownItems[i];
        dropDownMenu.setHeight(this.getHeight());
    }
}
hy.gui.Menu.prototype._mallocMenuItems = function(){
    if(this.__needMallocMenuItems){
        this.__needMallocMenuItems = false;
        var itemCount = this._menuItems.length;
        var dropDownCount = this._dropDownItems.length;
        var startX = 0;
        for(var i = 0 ; i < itemCount ; ++i){
            var dropDownMenu = null;
            if(i < dropDownCount){
                dropDownMenu = this._dropDownItems[i];
            }else{
                dropDownMenu = new hy.gui.DropDownMenu({activeColor:'#0f0'});
                dropDownMenu.addObserver(dropDownMenu.notifyDropDownMenu, this, this._dropDownMenuMenu);
                this.addChildNodeAtLayer(dropDownMenu, 0);
            }
            dropDownMenu.setText(this._menuItems[i].name);
            dropDownMenu.setX(startX);
            dropDownMenu.setY(0);
            dropDownMenu.setWidth(dropDownMenu.getTextMeasuredLength() + 20);
            dropDownMenu.setHeight(this.getHeight());
            dropDownMenu.setUserProperty("menuindex",i);
            dropDownMenu.setDropItems(this._menuItems[i].dropItems);
            startX += dropDownMenu.getWidth();
        }
        if(itemCount < dropDownCount){
            for(var i = dropDownCount - 1 ; i >= itemCount  ; --i){
                this._dropDownItems[i].removeFromParent(true);
                this._dropDownItems.splice(i, 1);
            }
        }
    }
}
hy.gui.Menu.prototype._dropDownMenuMenu = function(sender, e, dropDownIndex){
    var menuIndex = sender.getUserProperty("menuindex");
    this.postNotification(this.notifyMenu, this, [e, menuIndex, dropDownIndex]);
}
