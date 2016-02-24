var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.Menu = hy.extend(hy.gui.View);
hy.gui.Menu.prototype.init = function(config){
	this.superCall("init", [config]);
	this._items = this.isUndefined(config.items) ? null : config.items;
	this._dropDownButtons = [];
}

