var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.SimpleListView = hy.extend(hy.gui.ListView);
hy.gui.SimpleListView.prototype.defaultCellHeight = 20;
hy.gui.SimpleListView.prototype.defaultCellMoveEnable = true;
hy.gui.SimpleListView.prototype.defaultCellEditEnable = false;
hy.gui.SimpleListView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._items = this.isUndefined(config.items) ? null : config.items;
    this._cellHeight = this.isUndefined(config.cellHeight) ? this.defaultCellHeight : config.cellHeight;
    this._cellMoveEnable = this.isUndefined(config.cellMoveEnable) ? this.defaultCellMoveEnable : config.cellMoveEnable;
    this._cellEditEnable = this.isUndefined(config.cellEditEnable) ? this.defaultCellEditEnAble : config.cellEditEnable;
    this._selCellIndex = -1;
}
hy.gui.SimpleListView.prototype.setItems = function(items){
    this._items = items;
}
hy.gui.SimpleListView.prototype.getItems = function(){
    return this._items;
}
hy.gui.SimpleListView.prototype.setRowHeight = function(rowHeight){
    this._rowHeight = rowHeight;
}
hy.gui.SimpleListView.prototype.getRowHeight = function(){
    return this._rowHeight;
}
hy.gui.SimpleListView.prototype.setCellMoveEnable = function(cellMoveEnable){
    this._cellMoveEnable = cellMoveEnable;
}
hy.gui.SimpleListView.prototype.getCellMoveEnable = function(){
    return this._cellMoveEnable;
}
hy.gui.SimpleListView.prototype.setCellEditEnable = function(cellEditEnable){
    this._cellEditEnable = cellEditEnable;
}
hy.gui.SimpleListView.prototype.getCellEditEnable = function() {
    return this._cellEditEnable;
}
hy.gui.SimpleListView.prototype.setSelectedIndex = function(cellIndex){
    if(this._selCellIndex != cellIndex ){
        var curSelView = this.getListCellViewOfCellPath(this._selCellIndex);
        var nextSelView = this.getListCellViewOfCellPath(cellIndex);
        var oldCellIndex = this._selCellIndex;
        this._selCellIndex = cellIndex;
        if(curSelView){
            curSelView.setSelected(false);
        }
        if(nextSelView){
            nextSelView.setSelected(true);
        }
    }
}
hy.gui.SimpleListView.prototype.getSelectedIndex = function(){
    return this._selCellIndex;
}

hy.gui.SimpleListView.prototype.numberOfListCell = function(listView){
    if(this._items){
        return this._items.length;
    }else{
        return 0;
    }
}
hy.gui.SimpleListView.prototype.widthOfListCell = function(listView, cellIndex){
    var cellView = listView.getCellViewOfCellIndex(cellIndex);
    if(cellView){
        return cellView.getCellTextMeasuredLength();
    }else{
        return 0;
    }
}
hy.gui.SimpleListView.prototype.heightOfListCell = function(listView, cellIndex){
    return this._cellHeight;
}
hy.gui.SimpleListView.prototype.contextMenuOfListCell = function(listView, cellIndex){
    return null;
}
hy.gui.SimpleListView.prototype.viewOfListCell = function(listView, cellIndex){
    var cellView = listView.getReuseCellViewOfIdentity("listcell");
    if(cellView == null) {
        cellView = new hy.gui.SimpleListCellView({reuseIdentity: "listcell"});
    }
    cellView.setCellText(this._items[cellIndex]);
    cellView.setCellEditEnable(this._cellEditEnable);
    if(cellIndex == this._selCellIndex){
        cellView.setSelected(true);
    }else{
        cellView.setSelected(false);
    }
    return cellView;
}