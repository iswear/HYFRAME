HY.GUI.ListView = function(config){
    this.init(config);
}
HY.GUI.ListView.prototype = new HY.GUI.ScrollView();
HY.GUI.ListView.prototype.defaultWidthFit = true;
HY.GUI.ListView.prototype.defaultAutoSizeFit = false;
HY.GUI.ListView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.dataSource != undefined){ this._dataSource = config.dataSource; } else { this._dataSource = null; }
    if(config.autoSizeFit != undefined){ this._autoSizeFit = config.autoSizeFit; } else { this._autoSizeFit = this.defaultAutoSizeFit; }
    this._reuseSectionViews = {};
    this._reuseCellViews = {};
    this._sectionViews = [];
    this._cellViews = [];
    this._sections = [];/*{layout:{},view:{},cells:[]}*/
}
HY.GUI.ListView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
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
    for(var i=0;i<sectionsNum;++i){
        var section = {layout:{y:0,height:0},view:null,cells:[]};
        section.layout.y = cursorY;
        section.layout.height = dataSource.heightOfListSection(this,i);
        cursorY += section.layout.height;
        var cellsNum = dataSource.numberOfListCellInSection(this,i);
        for(var j=0;j<cellsNum;++j){
            var cell = {layout:{y:0,height:0},view:null};
            cell.layout.y = cursorY;
            cell.layout.height = dataSource.heightOfListCellInSection(this,i,j);
            section.cells.push(cell);
            cursorY += cell.layout.height;
        }
        this._sections.push(section);
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
        sectionView.setY(section.layout.y);
        sectionView.setWidth(this.getContentWidth());
        sectionView.setHeight(section.layout.height);
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
            cellView.setY(cell.layout.y);
            cellView.setWidth(this.getContentWidth());
            cellView.setHeight(cell.layout.height);
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
        if(section.layout.y < contentMaxY){
            if(section.layout.y + section.layout.height > contentOffsetY && section.layout.height > 0){
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
                if(cell.layout.y < contentMaxY && cell.layout.y + cell.layout.height > contentOffsetY && cell.layout.height > 0){
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


