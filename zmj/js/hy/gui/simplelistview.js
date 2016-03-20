var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.SimpleListView = hy.extend(hy.gui.ListView);
hy.gui.SimpleListView.prototype.notifySyncListCellText = "synclistcelltext";
hy.gui.SimpleListView.prototype.notifyListCellSelected = "listcellselected";
hy.gui.SimpleListView.prototype.notifyListCellUnSelected = "listcellunselected";
hy.gui.SimpleListView.prototype.defaultCellHeight = 20;
hy.gui.SimpleListView.prototype.defaultCellMoveEnable = false;
hy.gui.SimpleListView.prototype.defaultCellEditEnable = false;
hy.gui.SimpleListView.prototype.defaultCellSelectEnable = false;
hy.gui.SimpleListView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._items = this.isUndefined(config.items) ? null : config.items;
    this._cellHeight = this.isUndefined(config.cellHeight) ? this.defaultCellHeight : config.cellHeight;
    this._cellMoveEnable = this.isUndefined(config.cellMoveEnable) ? this.defaultCellMoveEnable : config.cellMoveEnable;
    this._cellEditEnable = this.isUndefined(config.cellEditEnable) ? this.defaultCellEditEnAble : config.cellEditEnable;
    this._cellSelectEnable = this.isUndefined(config.cellSelectEnable) ? this.defaultCellSelectEnable : config.cellSelectEnable;
    this._selCellIndex = -1;
    this.__moveCellInit = false;
    this.__moveOverCellIndex = -1;
}
hy.gui.SimpleListView.prototype.setItems = function(items){
    this._items = items;
    this.needReloadList();
}
hy.gui.SimpleListView.prototype.getItems = function(){
    return this._items;
}
hy.gui.SimpleListView.prototype.setCellHeight = function(cellHeight){
    this._cellHeight = cellHeight;
    this.needReloadList();
}
hy.gui.SimpleListView.prototype.getCellHeight = function(){
    return this._cellHeight;
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
hy.gui.SimpleListView.prototype.setCellSelectEnable = function(selectEnable){
    this._cellSelectEnable = selectEnable;
}
hy.gui.SimpleListView.prototype.getCellSelectEnable = function(){
    return this._cellSelectEnable;
}
hy.gui.SimpleListView.prototype.setSelectedIndex = function(cellIndex){
    if(this._selCellIndex != cellIndex ){
        var curSelView = this.getCellViewOfCellIndex(this._selCellIndex);
        var nextSelView = this.getCellViewOfCellIndex(cellIndex);
        var oldSelCellIndex = this._selCellIndex;
        this._selCellIndex = cellIndex;
        if(curSelView){
            curSelView.setSelected(false);
        }
        if(nextSelView){
            nextSelView.setSelected(true);
        }
        if(oldSelCellIndex >= 0){
            this.postNotification(this.notifyListCellUnSelected, [oldSelCellIndex]);
        }
        if(this._selCellIndex >= 0){
            this.postNotification(this.notifyListCellSelected, [this._selCellIndex]);
        }
    }
}
hy.gui.SimpleListView.prototype.getSelectedIndex = function(){
    return this._selCellIndex;
}
hy.gui.SimpleListView.prototype.moveCellFromTo = function(fromIndex, toIndex){
    if(fromIndex < this._items.length && toIndex <= this._items.length){
        if(fromIndex < toIndex){
            this._items.splice(toIndex, 0 , this._items[fromIndex]);
            this._items.splice(fromIndex, 1);
            this.needReloadList();
            return toIndex-1;
        }else if(fromIndex > toIndex){
            this._items.splice(toIndex, 0 , this._items[fromIndex]);
            this._items.splice(fromIndex+1, 1);
            this.needReloadList();
            return toIndex;
        }
    }
}

hy.gui.SimpleListView.prototype._changedListCellText = function(sender){
    var cellView = sender.getParent();
    if(cellView){
        var cellIndex = cellView.getCellIndex();
        if(cellIndex >= 0){
            this._items[cellIndex].name = sender.getText();
            this.postNotification(this.notifySyncListCellText, [cellIndex]);
        }
    }
}
hy.gui.SimpleListView.prototype._selectListCell = function(sender, e){
    if(this._cellSelectEnable){
        var cellIndex = sender.getCellIndex();
        this.setSelectedIndex(cellIndex);
        if(this._cellMoveEnable){
            this.__moveCellInit = true;
        }
    }
}
hy.gui.SimpleListView.prototype._moveOverListCell = function(sender, e){
    if(this.__moveCellInit){
        this.__moveOverCellIndex = sender.getCellIndex();
    }
}
hy.gui.SimpleListView.prototype._moveLocListCell = function(sender, e){
    if(this.__moveCellInit){
        if(this.__moveOverCellIndex>=0 && this._selCellIndex>=0 && this.__moveOverCellIndex != this._selCellIndex){
            var overCellView = this.getCellViewOfCellIndex(this.__moveOverCellIndex);
            var pointOverCellView = overCellView.transPointFromAncestorNode({x: e.offsetX,y: e.offsetY},null);
            if(pointOverCellView.y < overCellView.getHeight()/2){
                overCellView.setCellInsertMode(1);
            }else{
                overCellView.setCellInsertMode(2);
            }
        }
    }
}
hy.gui.SimpleListView.prototype._moveOutListCell = function(sender, e){
    this.__moveOverCellIndex = -1;
    sender.setCellInsertMode(0);
}
hy.gui.SimpleListView.prototype._moveOkListCell = function(sender, e){
    if(this.__moveCellInit){
        if(this.__moveOverCellIndex>=0 && this._selCellIndex>=0 && this.__moveOverCellIndex != this._selCellIndex){
            var overCellView = this.getCellViewOfCellIndex(this.__moveOverCellIndex);
            if(overCellView){
                if(overCellView.getCellInsertMode() == 1){
                    this.setSelectedIndex(this.moveCellFromTo(this._selCellIndex,this.__moveOverCellIndex));
                }else{
                    this.setSelectedIndex(this.moveCellFromTo(this._selCellIndex,this.__moveOverCellIndex + 1));
                }
                overCellView.setCellInsertMode(0);
            }else{
                this.setSelectedIndex(this.moveCellFromTo(this._selCellIndex,this.__moveOverCellIndex + 1));
            }
        }
        this.__moveCellInit = false;
    }
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
        return cellView.getCellTextMeasuredLength() + this.getHeight - 5;
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
        var editBox = cellView.getCellEditBox();
        editBox.addObserver(editBox.notifySyncText, this, this._changedListCellText);
        cellView.addObserver(cellView.notifyMouseDown, this, this._selectListCell);
        cellView.addObserver(cellView.notifyMouseOver, this, this._moveOverListCell);
        cellView.addObserver(cellView.notifyMouseMove, this, this._moveLocListCell);
        cellView.addObserver(cellView.notifyMouseOut, this, this._moveOutListCell);
        cellView.addObserver(cellView.notifyMouseUp, this, this._moveOkListCell);
    }
    cellView.setCellText(this._items[cellIndex].name);
    cellView.setCellEditEnable(this._cellEditEnable);
    if(cellIndex == this._selCellIndex){
        cellView.setSelected(true);
    }else{
        cellView.setSelected(false);
    }
    return cellView;
}