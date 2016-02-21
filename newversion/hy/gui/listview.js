var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.ListView = hy.extend(hy.gui.ScrollView);
hy.gui.ListView.prototype.notifyListCellMouseDown = "listcellmousedown";
hy.gui.ListView.prototype.notifyListCellMouseUp = "listcellmouseup";
hy.gui.ListView.prototype.notifyListCellMouseOver = "listcellmouseover";
hy.gui.ListView.prototype.notifyListCellMouseOut = "listcellmouseout";
hy.gui.ListView.prototype.notifyListCellMouseMove = "listcellmousemove";
hy.gui.ListView.prototype.notifyListCellClick = "listcellclick";
hy.gui.ListView.prototype.notifyListCellDblClick = "listcelldblclick";
hy.gui.ListView.prototype.notifyListCellContextMenu = "listcellcontextmenu";
hy.gui.ListView.prototype.defaultWidthFit = true;
hy.gui.ListView.prototype.defaultHeightFit = false;
hy.gui.ListView.prototype.defaultHeaderViewFloat = false;
hy.gui.ListView.prototype.defaultFooterViewFloat = false;
hy.gui.ListView.prototype.init = function(config) {
    this.superCall("init", [config]);
    this._dataSource = this.isUndefined(config.dataSource) ? null : config.dataSource;
    this._headerView = this.isUndefined(config.headerView) ? null : config.headerView;
    this._headerViewFloat = this.isUndefined(config.headerViewFloat) ? this.defaultHeaderViewFloat : config.headerViewFloat;
    this._footerView = this.isUndefined(config.footerView) ? null : config.footerView;
    this._footerViewFloat = this.isUndefined(config.footerViewFloat) ? this.defaultFooterViewFloat : config.footerViewFloat;
    this._reuseCellViews = {};
    this._cellViews = [];
    this._cellInfos = [];/*{y:(Number),height:(Number),view:(view)}*/
    this.__needReloadList = false;
    this.__needMallocListView = false;
    var contentView = this.getContentView();
    contentView.addObserver(contentView.notifySyncY, this, this.needMallocListView);
    contentView.addObserver(contentView.notifySyncHeight, this, this.needMallocListView);
    this.addObserver(this.notifyEnterFrame, this, this._reloadList);
    this.addObserver(this.notifyEnterFrame, this, this._mallocListView);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutListCellViews);
    this.needReloadList();
}
hy.gui.ListView.prototype.setDataSource = function(dataSource){
    this._dataSource = dataSource;
}
hy.gui.ListView.prototype.getDataSource = function(){
    return this._dataSource;
}
hy.gui.ListView.prototype.setHeaderView = function(headerView){
    this._headerView = headerView;
}
hy.gui.ListView.prototype.getHeaderView = function(){
    return this._headerView;
}
hy.gui.ListView.prototype.setHeaderViewFloat = function(float){
    this._headerViewFloat = float;
}
hy.gui.ListView.prototype.getHeaderViewFloat = function(){
    return this._headerViewFloat;
}
hy.gui.ListView.prototype.setFooterView = function(footerView){
    this._footerView = footerView;
}
hy.gui.ListView.prototype.getFooterView = function(){
    return this._footerView;
}
hy.gui.ListView.prototype.setFooterViewFloat = function(float){
    this._footerViewFloat = float;
}
hy.gui.ListView.prototype.getFooterViewFloat = function(){
    return this._footerViewFloat;
}
hy.gui.ListView.prototype.getCellViewOfCellIndex = function(cellIndex){
    if(cellIndex >= 0 && cellIndex < this._cellInfos.length) {
        return this._cellInfos[cellIndex].view;
    }else{
        return null;
    }
}
hy.gui.ListView.prototype.getReuseCellViewOfIdentity = function(reuseIdentity){
    if(this._reuseCellViews[reuseIdentity] && this._reuseCellViews[reuseIdentity].length > 0){
        return this._reuseCellViews[reuseIdentity].pop();
    }else{
        return null;
    }
}

hy.gui.ListView.prototype.needReloadList = function(){
    this.__needReloadList = true;
}
hy.gui.ListView.prototype.needMallocListView = function(){
    this.__needMallocListView = true;
}
hy.gui.ListView.prototype._reloadList = function(){
    if(this.__needReloadList){
        this.__needReloadList = false;
        var dataSource = this;
        if(this._dataSource != null) {
            dataSource = this._dataSource;
        }
        this._recycleAllCellViews();
        this._cellInfos = [];
        var cellsNum = dataSource.numberOfListCell(this);
        var cursorY=0;
        if(this._headerView){
            if(this._headerView.getParent() != this){
                this._headerView.removeFromParent(false);
                this.getContentView().addChildNodeAtLayer(this._headerView, 0);
            }
            cursorY += this._headerView.getHeight();
        }
        for(var i=0;i<cellsNum;++i){
            /*cell layout info*/
            var cellInfo = {y:0,height:0,view:null};
            cellInfo.y = cursorY;
            cellInfo.height = dataSource.heightOfListCell(this);
            cursorY += cellInfo.height;
            this._cellInfos.push(cellInfo);
        }
        if(this._footerView){
            if(this._footerView.getParent() != this){
                this._footerView.removeFromParent(false);
                this.getContentView().addChildNodeAtLayer(this._footerView, 0);
            }
            cursorY += this._footerView.getHeight();
        }
        this.setContentHeight(cursorY);
        this.needMallocListView();
    }
}
hy.gui.ListView.prototype._mallocListView = function(){
    if(this.__needMallocListView){
        this.__needMallocListView = false;
        var dataSource = this;
        if(this._dataSource != null){
            dataSource = this._dataSource;
        }
        var contentOffsetY = this.getContentOffsetY();
        var contentMaxY = contentOffsetY + this.getHeight();
        for(var i=this._cellViews.length-1;i>=0;--i){
            var cellView = this._cellViews[i];
            if(cellView.getY() >= contentMaxY || (cellView.getY()+cellView.getHeight() <= contentOffsetY)){
                var reuseIdentity = cellView.getReuseIdentity();
                if(!this._reuseCellViews[reuseIdentity]){
                    this._reuseCellViews[reuseIdentity] = [];
                }
                this._reuseCellViews[reuseIdentity].push(cellView);
                this._cellInfos[cellView.getCellIndex()].view = null;
                cellView.setCellIndex(-1);
                cellView.removeFromParent(false);
                cellView.setSelected(false);
                this._cellViews.splice(i, 1);
            }
        }
        var cellWidth = this.getContentWidth();
        var cellMaxWidth = 0;
        for(var i= 0, cellNum = this._cellInfos.length ; i < cellNum ; ++i){
            var cellInfo = this._cellInfos[i];
            if(cellInfo.y < contentMaxY){
                if(cellInfo.y + cellInfo.height > contentOffsetY && cellInfo.height > 0){
                    if(!cellInfo.view){
                        var cellView = dataSource.viewOfListCell(this,i);
                        if(cellView != null){
                            var contextMenu = dataSource.contextMenuOfListCell(this,i);
                            cellView.setContextMenu(contextMenu);
                            cellView.setX(0);
                            cellView.setY(cellInfo.y);
                            cellView.setWidth(cellWidth);
                            cellView.setHeight(cellInfo.height);
                            cellView.setCellIndex(i);
                            cellView.addObserver(this.notifyMouseDown, this, this._mouseDownListCell);
                            cellView.addObserver(this.notifyMouseUp, this, this._mouseUpListCell);
                            cellView.addObserver(this.notifyMouseOver, this, this._mouseOverListCell);
                            cellView.addObserver(this.notifyMouseOut, this, this._mouseOutListCell);
                            cellView.addObserver(this.notifyMouseMove, this, this._mouseMoveListCell);
                            cellView.addObserver(this.notifyClick, this, this._clickListCell);
                            cellView.addObserver(this.notifyDblClick, this, this._dblclickListCell);
                            cellView.addObserver(this.notifyContextMenu, this, this._contextMenuListCell);
                            this._cellViews.push(cellView);
                            this.getContentView().addChildNodeAtLayer(cellView, 0);
                            cellInfo.view = cellView;
                        }
                    }
                    var cellViewWidth = dataSource.widthOfListCell(this, i);
                    if(cellViewWidth > cellMaxWidth){
                        cellMaxWidth = cellViewWidth;
                    }
                }
            }else{
                break;
            }
        }
        this.setContentWidth(cellMaxWidth);
    }
}
hy.gui.ListView.prototype._recycleAllCellViews = function(){
    for(var i=this._cellViews.length-1;i>=0;--i){
        var cellView = this._cellViews[i];
        var reuseIdentity = cellView.getReuseIdentity();
        if(!this._reuseCellViews[reuseIdentity]){
            this._reuseCellViews[reuseIdentity] = [];
        }
        this._reuseCellViews[reuseIdentity].push(cellView);
        this._cellInfos[cellView.getCellIndex()].view = null;
        cellView.setCellIndex(-1);
        cellView.removeFromParent(false);
        cellView.setSelected(false);
        this._cellViews.splice(i, 1);
    }
}
hy.gui.ListView.prototype._layoutListCellViews = function(){
    var contentwidth = this.getContentWidth();
    for(var i = 0,len = this._cellViews.length ; i < len ; ++i){
        this._cellViews[i].setWidth(contentwidth);
    }
}
hy.gui.ListView.prototype._mouseDownListCell = function(sender, e){
    this.postNotification(this.notifyListCellMouseDown, [sender, e]);
}
hy.gui.ListView.prototype._mouseUpListCell = function(sender, e){
    this.postNotification(this.notifyListCellMouseUp, [sender, e]);
}
hy.gui.ListView.prototype._mouseOverListCell = function(sender, e){
    this.postNotification(this.notifyListCellMouseOver, [sender, e]);
}
hy.gui.ListView.prototype._mouseOutListCell = function(sender, e){
    this.postNotification(this.notifyListCellMouseOut, [sender, e]);
}
hy.gui.ListView.prototype._mouseMoveListCell = function(sender, e){
    this.postNotification(this.notifyListCellMouseMove, [sender, e]);
}
hy.gui.ListView.prototype._clickListCell = function(sender, e){
    this.postNotification(this.notifyListCellClick, [sender, e]);
}
hy.gui.ListView.prototype._dblclickListCell = function(sender, e){
    this.postNotification(this.notifyListCellDblClick, [sender, e]);
}
hy.gui.ListView.prototype._contextMenuListCell = function(sender, e){
    this.postNotification(this.notifyListCellContextMenu, [sender, e]);
}


hy.gui.ListView.prototype.numberOfListCell = function(listView, cellIndex){
    return 0;
}
hy.gui.ListView.prototype.widthOfListCell = function(listView, cellIndex){
    return 0;
}
hy.gui.ListView.prototype.heightOfListCell = function(listView, cellIndex){
    return 0;
}
hy.gui.ListView.prototype.contextMenuOfListCell = function(listView, cellIndex){
    return null;
}
hy.gui.ListView.prototype.viewOfListCell = function(listView, cellIndex){
    return null;
}
