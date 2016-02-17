HY.GUI.ListView = function(config){
    this.init(config);
}
HY.GUI.ListView.prototype = new HY.GUI.ScrollView();
HY.GUI.ListView.prototype.defaultWidthFit = true;
HY.GUI.ListView.prototype.defaultAutoSizeFit = false;
HY.GUI.ListView.prototype.defaultHeaderViewFloat = false;
HY.GUI.ListView.prototype.defaultFooterViewFloat = false;
HY.GUI.ListView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.dataSource != undefined){ this._dataSource = config.dataSource; } else { this._dataSource = null; }
    if(config.autoSizeFit != undefined){ this._autoSizeFit = config.autoSizeFit; } else { this._autoSizeFit = this.defaultAutoSizeFit; }
    if(config.headerViewFloat != undefined){ this._headerViewFloat = config.headerViewFloat; } else { this._headerViewFloat = this.defaultHeaderViewFloat; }
    if(config.footerViewFloat != undefined){ this._footerViewFloat = config.footerViewFloat; } else { this._footerViewFloat = this.defaultFooterViewFloat; }
    this._reuseSectionViews = {};
    this._reuseCellViews = {};
    this._sectionViews = [];
    this._cellViews = [];
    this._sections = [];/*{y:(Number),height:(Number),view:(View),cells:(Array)}*/
    this._headerView = null;
    this._footerView = null;
}
HY.GUI.ListView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("enterframe",this._listViewEnterFrame,this);
    this.reloadData();
}
HY.GUI.ListView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    var width = this.getWidth();
    for(var i = this._sectionViews.length-1;i>=0;--i){
        this._sectionViews[i].setWidth(width);
    }
    for(var i = this._cellViews.length-1;i>=0;--i){
        this._cellViews[i].setWidth(width);
    }
}
HY.GUI.ListView.prototype.getDataSource = function(){
    return this._dataSource;
}
HY.GUI.ListView.prototype.setDataSource = function(dataSource){
    this._dataSource = dataSource;
    this.reloadData();
}
HY.GUI.ListView.prototype.getAutoSizeFit = function(){
    return this._autoSizeFit;
}
HY.GUI.ListView.prototype.setAutoSizeFit = function(autoSizeFit){
    this._autoSizeFit = autoSizeFit;
    this.reloadData();
}
HY.GUI.ListView.prototype.getHeaderView = function(){
    return this._headerView;
}
HY.GUI.ListView.prototype.setHeaderView = function(headerView){
    if(this._headerView != headerView){
        if(this._headerView){
            this._headerView.removeFromParent(false);
        }
        if(headerView){
            this._headerView = headerView;
            this.getContentView().addChildNodeAtLayer(this._headerView, 1);
        }else{
            this._headerView = null;
        }
    }
}
HY.GUI.ListView.prototype.getFooterView = function(){
    return this._footerView;
}
HY.GUI.ListView.prototype.setFooterView = function(footerView){
    if(this._footerView != footerView){
        if(this._footerView){
            this._footerView.removeFromParent(false);
        }
        if(footerView){
            this._footerView = footerView;
            this.getContentView().addChildNodeAtLayer(this._footerView,1);
        }else{
            this._footerView = null;
        }
    }
}
HY.GUI.ListView.prototype.getHeaderViewFloat = function(){
    return this._headerViewFloat;
}
HY.GUI.ListView.prototype.setHeaderViewFloat = function(headerFloat){
    this._headerViewFloat = headerFloat;
}
HY.GUI.ListView.prototype.getFooterViewFloat = function(){
    return this._footerViewFloat;
}
HY.GUI.ListView.prototype.setFooterViewFloat = function(footerView){
    this._footerViewFloat = footerView;
}
HY.GUI.ListView.prototype.getSectionViewOfIndex = function(sectionIndex){
    for(var i=this._sectionViews.length-1; i>= 0; --i){
        var sectionView = this._sectionViews[i];
        if(sectionView.getSectionIndex() == sectionIndex){
            return sectionView;
        }
    }
    return null;
}
HY.GUI.ListView.prototype.getListCellViewOfCellPath = function(sectionIndex, cellIndex){
    for(var i = this._cellViews.length-1; i>=0; --i){
        var cellView = this._cellViews[i];
        if(cellView.getSectionIndex() == sectionIndex && cellView.getCellIndex() == cellIndex){
            return cellView;
        }
    }
    return null;
}
HY.GUI.ListView.prototype.getReuseSectionOfIdentity = function(reuseIdentity){
    if(this._reuseSectionViews[reuseIdentity] && this._reuseSectionViews[reuseIdentity].length > 0){
        return this._reuseSectionViews[reuseIdentity].pop();
    }else{
        return null;
    }
}
HY.GUI.ListView.prototype.getReuseCellOfIdentity = function(reuseIdentity){
    if(this._reuseCellViews[reuseIdentity] && this._reuseCellViews[reuseIdentity].length > 0){
        return this._reuseCellViews[reuseIdentity].pop();
    }else{
        return null;
    }
}

HY.GUI.ListView.prototype.reloadData = function(){
    var dataSource = this;
    if(this._dataSource != null) {
        dataSource = this._dataSource;
    }
    this._recycleAllSectionViews();
    this._recycleAllCellViews();
    this._sections = [];
    var sectionsNum = dataSource.numberOfListSection(this);
    var cursorY=0;
    if(this._headerView){
        cursorY += this._headerView.getHeight();
    }
    for(var i=0;i<sectionsNum;++i){
        var section = {y:0,height:0,view:null,cells:[]};
        section.y = cursorY;
        section.height = dataSource.heightOfListSection(this,i);
        cursorY += section.height;
        var cellsNum = dataSource.numberOfListCellInSection(this,i);
        for(var j=0;j<cellsNum;++j){
            var cell = {layout:{y:0,height:0},view:null};
            cell.y = cursorY;
            cell.height = dataSource.heightOfListCellInSection(this,i,j);
            section.cells.push(cell);
            cursorY += cell.height;
        }
        this._sections.push(section);
    }
    if(this._footerView){
        cursorY += this._footerView.getHeight();
    }
    this.getContentView().setMinLayoutHeight(cursorY);
    this.getContentView().setHeight(cursorY);
    if(this._autoSizeFit){
        this.setHeight(cursorY);
    }
    this._mallocListViews();
}
HY.GUI.ListView.prototype._setSectionView = function(sectionIndex,sectionView){
    if(sectionIndex < this._sections.length){
        var section = this._sections[sectionIndex];
        sectionView.setX(0);
        sectionView.setY(section.y);
        sectionView.setWidth(this.getContentWidth());
        sectionView.setHeight(section.height);
        sectionView.setSectionIndex(sectionIndex);
        section.view = sectionView;
        this._sectionViews.push(sectionView);
        this.getContentView().addChildNodeAtLayer(sectionView,0);
    }
}
HY.GUI.ListView.prototype._recycleSectionView = function(sectionIndex){
    if(sectionIndex < this._sections.length){
        var section = this._sections[sectionIndex];
        if(section.view != null){
            var reuseIdentity = section.view.getReuseIdentity();
            if(!this._reuseSectionViews[reuseIdentity]){
                this._reuseSectionViews[reuseIdentity] = [];
            }
            this._reuseSectionViews[reuseIdentity].push(section.view);
            section.view.setSectionIndex(-1);
            section.view.removeFromParent();
            section.view = null;
        }
    }
}
HY.GUI.ListView.prototype._recycleAllSectionViews = function(){
    for(var i=this._sectionViews.length-1;i>=0;--i){
        var sectionView = this._sectionViews[i];
        this._recycleSectionView(sectionView.getSectionIndex());
        this._sectionViews.splice(i,1);
    }
}
HY.GUI.ListView.prototype._setCellView = function(sectionIndex,cellIndex,cellView){
    if(sectionIndex < this._sections.length){
        var section = this._sections[sectionIndex];
        var cells = section.cells;
        if(cellIndex < cells.length){
            var cell = cells[cellIndex];
            cellView.setX(0);
            cellView.setY(cell.y);
            cellView.setWidth(this.getContentWidth());
            cellView.setHeight(cell.height);
            cellView.setSectionIndex(sectionIndex);
            cellView.setCellIndex(cellIndex);
            cell.view = cellView;
            this._cellViews.push(cellView);
            this.getContentView().addChildNodeAtLayer(cellView,0);
        }
    }
}
HY.GUI.ListView.prototype._recycleCellView = function(sectionIndex,cellIndex){
    if(sectionIndex < this._sections.length){
        var section = this._sections[sectionIndex];
        var cells = section.cells;
        if(cellIndex < cells.length){
            var cell = cells[cellIndex];
            if(cell.view != null){
                var reuseIdentity = cell.view.getReuseIdentity();
                if(!this._reuseCellViews[reuseIdentity]){
                    this._reuseCellViews[reuseIdentity] = [];
                }
                this._reuseCellViews[reuseIdentity].push(cell.view);
                cell.view.setSectionIndex(-1);
                cell.view.setCellIndex(-1);
                cell.view.removeFromParent(true);
                cell.view = null;
            }
        }
    }
}
HY.GUI.ListView.prototype._recycleAllCellViews = function(){
    for(var i=this._cellViews.length-1;i>=0;--i){
        var cellView = this._cellViews[i];
        this._recycleCellView(cellView.getSectionIndex(),cellView.getCellIndex());
        this._cellViews.splice(i,1);
    }
}
HY.GUI.ListView.prototype._mallocListViews = function(){
    var dataSource = this;
    if(this._dataSource != null){
        dataSource = this._dataSource;
    }
    var contentOffsetY = this.getContentOffsetY();
    var contentMaxY = contentOffsetY + this.getHeight();
    for(var i=this._sectionViews.length-1;i>=0;--i){
        var sectionView = this._sectionViews[i];
        if(sectionView.getY() > contentMaxY || (sectionView.getY()+sectionView.getHeight()<contentOffsetY)){
            this._recycleSectionView(sectionView.getSectionIndex());
            this._sectionViews.splice(i,1);
        }
    }
    for(var i=this._cellViews.length-1;i>=0;--i){
        var cellView = this._cellViews[i];
        if(cellView.getY() > contentMaxY || (cellView.getY()+cellView.getHeight()<contentOffsetY)){
            this._recycleCellView(cellView.getSectionIndex(),cellView.getCellIndex());
            this._cellViews.splice(i,1);
        }
    }
    var sectionNum = this._sections.length;
    for(var i=0;i<sectionNum;++i){
        var section = this._sections[i];
        if(section.y < contentMaxY){
            if(section.y + section.height > contentOffsetY && section.height > 0){
                if(!section.view){
                    var sectionView = dataSource.viewOfListSection(this,i);
                    var contextMenu = dataSource.contextMenuOfListSection(this,i);
                    sectionView.setContextMenu(contextMenu);
                    this._setSectionView(i,sectionView);
                }
            }
            var cellNum = section.cells.length;
            for(var j=0;j<cellNum;++j){
                var cell = section.cells[j];
                if(cell.y < contentMaxY && cell.y + cell.height > contentOffsetY && cell.height > 0){
                    if(!cell.view){
                        var cellView = dataSource.viewOfListCellInSection(this,i,j);
                        if(cellView != null){
                            var contextMenu = dataSource.contextMenuOfListCellInSection(this,i,j);
                            if(contextMenu){
                                cellView.setContextMenu(contextMenu);
                            }
                            this._setCellView(i,j,cellView);
                            if(!cellView.checkEventListener("mousedown",this._cellMouseDown,this)){
                                cellView.addEventListener("mousedown",this._cellMouseDown,this);
                                cellView.addEventListener("mouseup",this._cellMouseUp,this);
                                cellView.addEventListener("mouseover",this._cellMouseOver,this);
                                cellView.addEventListener("mouseout",this._cellMouseOut,this);
                                cellView.addEventListener("mousemove",this._cellMouseMove,this);
                                cellView.addEventListener("dblclick",this._cellDblClick,this);
                                cellView.addEventListener("contextmenu",this._cellContextMenu,this);
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }else{
            break;
        }
    }
    var minLayoutWidth = 0,contentWidth=0;
    for(var i=this._cellViews.length-1;i>=0;--i){
        if(minLayoutWidth < this._cellViews[i].getMinLayoutWidth()){
            minLayoutWidth = this._cellViews[i].getMinLayoutWidth();
        }
    }
    this.getContentView().setMinLayoutWidth(minLayoutWidth);
    this.getContentView().setWidth(minLayoutWidth);
}

HY.GUI.ListView.prototype._cellMouseDown = function(sender, e){
    this.onCellMouseDown(this, e, sender);
}
HY.GUI.ListView.prototype._cellMouseUp = function(sender, e){
    this.onCellMouseUp(this, e, sender);
}
HY.GUI.ListView.prototype._cellMouseOver = function(sender, e){
    this.onCellMouseOver(this, e, sender);
}
HY.GUI.ListView.prototype._cellMouseOut = function(sender, e){
    this.onCellMouseOut(this, e, sender);
}
HY.GUI.ListView.prototype._cellMouseMove = function(sender, e){
    this.onCellMouseMove(this, e, sender);
}
HY.GUI.ListView.prototype._cellDblClick = function(sender, e){
    this.onCellDblClick(this, e, sender);
}
HY.GUI.ListView.prototype._cellContextMenu = function(sender, e, menuCellView){
    this.onCellContextMenu(this, e, sender, menuCellView);
}
HY.GUI.ListView.prototype._listViewEnterFrame = function(deltaTime){
    if(this._headerView){
        if(this._headerViewFloat){
            this._headerView.setY(this.getContentOffsetY());
        }else{
            this._headerView.setY(0);
        }
    }
    if(this._footerView){
        if(this._footerViewFloat){
            this._footerView.setY(this.getContentView().getHeight()-this.getShowHeight()-this.getContentOffsetY()-this._footerView.getHeight());
        }else{
            this._footerView.setY(this.getContentView().getHeight() - this._footerView.getHeight());
        }
    }
}

HY.GUI.ListView.prototype.onCellMouseDown = function(sender,e,cellView){
    this.launchEvent("cellmousedown",[sender,e,cellView]);
}
HY.GUI.ListView.prototype.onCellMouseUp = function(sender,e,cellView){
    this.launchEvent("cellmouseup",[sender, e, cellView]);
}
HY.GUI.ListView.prototype.onCellMouseOver = function(sender,e,cellView){
    this.launchEvent("cellmouseover",[sender, e , cellView]);
}
HY.GUI.ListView.prototype.onCellMouseOut = function(sender,e,cellView){
    this.launchEvent("cellmouseout",[sender, e, cellView]);
}
HY.GUI.ListView.prototype.onCellMouseMove = function(sender,e,cellView){
    this.launchEvent("cellmousemove",[sender, e, cellView]);
}
HY.GUI.ListView.prototype.onCellDblClick = function(sender,e,cellView){
    this.launchEvent("celldblclick",[sender,e,cellView]);
}
HY.GUI.ListView.prototype.onCellContextMenu = function(sender,e,cellView,menuCellView){
    this.launchEvent("cellcontextmenu",[sender, e, cellView, menuCellView]);
}

HY.GUI.ListView.prototype.numberOfListSection = function(listView){
    return 0;
}
HY.GUI.ListView.prototype.heightOfListSection = function(listView,sectionIndex){
    return 0;
}
HY.GUI.ListView.prototype.numberOfListCellInSection = function(listView, sectionIndex, cellIndex){
    return 0;
}
HY.GUI.ListView.prototype.heightOfListCellInSection = function(listView, sectionIndex, cellIndex){
    return 0;
}
HY.GUI.ListView.prototype.contextMenuOfListSection = function(listView, sectionIndex){
    return null;
}
HY.GUI.ListView.prototype.contextMenuOfListCellInSection = function(listView, sectionIndex, cellIndex){
    return null;
}
HY.GUI.ListView.prototype.viewOfListSection = function(listView, sectionIndex){
    return null;
}
HY.GUI.ListView.prototype.viewOfListCellInSection = function(listView, sectionIndex, cellIndex){
    return null;
}


