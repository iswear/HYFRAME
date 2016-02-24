HY.GUI.Menu = function(config){
	this.init(config);
}
HY.GUI.Menu.prototype = new HY.GUI.View();
HY.GUI.Menu.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.items){ this._items = config.items; } else { this._items = null; }
    if(config.menuItemEvent){ this.addEventListener("menuitem",config.menuItemEvent.selector,config.menuItemEvent.target); }
    this._dropDownButtons = [];
}
HY.GUI.Menu.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this._mallocMenuItemView();
}
HY.GUI.Menu.prototype.setHeight = function(pHeight){
	this.superCall("setHeight",[pHeight]);
	for(var i = this._dropDownButtons.length-1;i>=0;--i){
		this._dropDownButtons[i].setHeight(pHeight);
	}
}
HY.GUI.Menu.prototype.getItems = function(){
	return this._items;
}
HY.GUI.Menu.prototype.setItems = function(pItems){
	if(this._items){
		for(var i = this._items.length-1;i>=0;--i){
			this.clearUpItem(this._items[i]);
		}
	}
	this._items = pItems;
	this._mallocMenuItemView();
}
HY.GUI.Menu.prototype.clearUpItem = function(pItem){
	if(pItem){
		pItem.userProperty = null;
	}
}
HY.GUI.Menu.prototype.getMinLayoutWidth = function(){
	var maxwidth = 0;
	for(var i = this._dropDownButtons.length-1;i>=0;--i){
		maxwidth += this._dropDownButtons[i].getWidth();
	}
	return maxwidth;
}
HY.GUI.Menu.prototype.onMenuItem = function(sender,e,menuIndex,sectionIndex,cellIndex){
	this.launchEvent("menuitem",[this,e,menuIndex,sectionIndex,cellIndex]);
}
HY.GUI.Menu.prototype._mallocMenuItemView = function(){
	var len = this._items.length;
	var btncount = this._dropDownButtons.length;
	var startx = 0;
	for(var i=0;i<len;++i){
		var btn = null;
		if(i<btncount){
			btn = this._dropDownButtons[i];
			btn.setTitle(this._items[i].title);
			btn.setDropItems(this._items[i].dropItems);
			btn.setX(startx);
			btn.setY(0);
			btn.setWidth(this.getMinLayoutWidth()+20);
			btn.setHeight(this.getHeight());
		}else{
			btn = new HY.GUI.DropDownButton({backgroundColor:'#ffffff',title:this._items[i].title,dropItems:this._items[i].dropItems});
			btn.setX(startx);
			btn.setY(0);
			btn.setWidth(btn.getMinLayoutWidth()+20);
			btn.setHeight(this.getHeight());
			btn.addEventListener("dropitem",this._itemsDropEvent,this);
			this.addChildNodeAtLayer(btn,0);
			this._dropDownButtons.push(btn);
		}
		btn.setUserProperty("menuindex",i);
		startx += btn.getWidth();
	}
	if(len < btncount){
		for(var i=len;i<btncount;++i){
			this.removeChildNode(this._dropDownButtons[i],0);
		}
		this._dropDownButtons.splice(len,btncount-len);
	}
}
HY.GUI.Menu.prototype._itemsDropEvent = function(sender,e,sectionIndex,cellIndex){
    this.onMenuItem(this,e,sender.getUserProperty("menuindex"),sectionIndex,cellIndex);
}