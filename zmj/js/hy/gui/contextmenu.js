/**
 * Created by iswear on 16/3/23.
 */
var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.ContextMenu = hy.extend(hy.gui.View);
hy.gui.ContextMenu.prototype.defaultBorderWidth = 1;
hy.gui.ContextMenu.prototype.defaultBorderColor = "#000000";
hy.gui.ContextMenu.prototype.notifyContextMenuItemDown = "contextmenuitemdown";
hy.gui.ContextMenu.prototype.notifyContextMenuItemUp = "contextmenuitemup";
hy.gui.ContextMenu.prototype.init = function(config){
    this.superCall("init",[config]);
    this._menuList = new hy.gui.SimpleListView({
        cellHeight:23,
        normalColor:"#ffffff",
        scrollBarVisible:false,
        cellSelectEnable:false,
        cellEditEnable:false,
        cellMoveEnable:false
    });
    this.addChildNodeAtLayer(this._menuList, 0);
    this._menuList.addObserver(this._menuList.notifyListCellMouseDown, this, this._menuListCellMouseDown);
    this._menuList.addObserver(this._menuList.notifyListCellMouseUp, this, this._menuListCellMouseUp);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutContextMenu);
}
hy.gui.ContextMenu.prototype.setItems = function(items){
    this._menuList.setItems(items);
    this.setHeight(23*items.length+2);
}
hy.gui.ContextMenu.prototype._menuListCellMouseDown = function(sender, cell, e){
    var cellIndex = cell.getCellIndex();
    this.postNotification(this.notifyContextMenuItemDown, [cellIndex]);
}
hy.gui.ContextMenu.prototype._menuListCellMouseUp = function(sender, cell, e){
    var cellIndex = cell.getCellIndex();
    this.postNotification(this.notifyContextMenuItemUp, [cellIndex]);
}
hy.gui.ContextMenu.prototype._layoutContextMenu = function(sender){
    this._menuList.setX(1);
    this._menuList.setY(1);
    this._menuList.setWidth(this.getWidth()-2);
    this._menuList.setHeight(this.getHeight()-2);
}