HY.GUI.MListView = function(config){
    this.init(config);
}
HY.GUI.MListView.prototype = new HY.GUI.MScrollView();
HY.GUI.MListView.prototype.defaultWidthFit = true;
HY.GUI.MListView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.dataSource != undefined){ this._dataSource = config.dataSource; } else { this._dataSource = null; }
    if(config.listCellSelectedEvent != undefined){ this.addEventListener("listcellselected",config.listCellSelectedEvent.selector,config.listCellSelectedEvent.target); }
    this._reuseSectionViews = {};
    this._reuseCellViews = {};
    this._sectionViews = [];
    this._cellViews = [];
    this._sections = [];//{layout:{},view:{},cells:[]}
}
HY.GUI.MListView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.reloadData();
    this._contentView.addEventListener("ychanged",this._mallocListViews,this);
}
HY.GUI.MListView.prototype.getDataSource = function(){
    return this._dataSource;
}
HY.GUI.MListView.prototype.setDataSource = function(dataSource){
    this._dataSource = dataSource;
    this.reloadData();
}
HY.GUI.MListView.prototype.getReuseSectionOfIdentity = function(reuseIdentity){
    if(this._reuseSectionViews[reuseIdentity] && this._reuseSectionViews[reuseIdentity].length > 0){
        return this._reuseSectionViews[reuseIdentity].pop();
    }else{
        return null;
    }
}
HY.GUI.MListView.prototype.getReuseCellOfIdentity = function(reuseIdentity){
    if(this._reuseCellViews[reuseIdentity] && this._reuseCellViews[reuseIdentity].length > 0){
        return this._reuseCellViews[reuseIdentity].pop();
    }else{
        return null;
    }
}
HY.GUI.MListView.prototype.reloadData = function(){
    var dataSource = this._dataSource;
    if(dataSource == null){
        dataSource = this;
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
    this._mallocListViews();
}
HY.GUI.MListView.prototype._setSectionView = function(sectionIndex,sectionView){
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
HY.GUI.MListView.prototype._recycleSectionView = function(sectionIndex){
    if(sectionIndex < this._sections.length){
        var section = this._sections[sectionIndex];
        if(section.view != null){
            var reuseIdentity = section.view.getReuseIdentity();
            if(!this._reuseSectionViews[reuseIdentity]){
                this._reuseSectionViews[reuseIdentity] = [];
            }
            this._reuseSectionViews[reuseIdentity].push(section.view);
            section.view.setSectionIndex(-1);
            section.view.removeFromParent(true);
            section.view = null;
        }
    }
}
HY.GUI.MListView.prototype._recycleAllSectionViews = function(){
    for(var i=this._sectionViews.length-1;i>=0;--i){
        var sectionView = this._sectionViews[i];
        this._recycleSectionView(sectionView.getSectionIndex());
        this._sectionViews.splice(i,1);
    }
}
HY.GUI.MListView.prototype._setCellView = function(sectionIndex,cellIndex,cellView){
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
            if(!cell.view.checkEventListener("mouseup",this._listCellViewMouseUp,this)){
                cell.view.addEventListener("mouseup",this._listCellViewMouseUp,this);
            }
            this._cellViews.push(cellView);
            this.getContentView().addChildNodeAtLayer(cellView,0);
        }
    }
}
HY.GUI.MListView.prototype._recycleCellView = function(sectionIndex,cellIndex){
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
HY.GUI.MListView.prototype._recycleAllCellViews = function(){
    for(var i=this._cellViews.length-1;i>=0;--i){
        var cellView = this._cellViews[i];
        this._recycleCellView(cellView.getSectionIndex(),cellView.getCellIndex());
        this._cellViews.splice(i,1);
    }
}
HY.GUI.MListView.prototype._mallocListViews = function(){
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
                    this._setSectionView(i,sectionView);
                }
            }
            var cellNum = section.cells.length;
            for(var j=0;j<cellNum;++j){
                var cell = section.cells[j];
                if(cell.layout.y < contentMaxY && cell.layout.y + cell.layout.height > contentOffsetY && cell.layout.height > 0){
                    if(!cell.view){
                        var cellview = dataSource.viewOfListCellInSection(this,i,j);
                        this._setCellView(i,j,cellview);
                    }
                }else{
                    break;
                }
            }
        }else{
            break;
        }
    }
}
HY.GUI.MListView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    var contentWidth = this.getContentWidth();
    for(var i = this._sectionViews.length-1;i>=0;--i){
        this._sectionViews[i].setWidth(contentWidth);
    }
    for(var i = this._cellViews.length-1;i>=0;--i){
        this._cellViews[i].setWidth(contentWidth);
    }
}
HY.GUI.MListView.prototype._listCellViewMouseUp = function(sender){
    this.onListCellSelected(this, sender.getSectionIndex(), sender.getCellIndex());
}
HY.GUI.MListView.prototype.onListCellSelected = function(sender,sectionIndex, cellIndex){
    this.launchEvent("listcellselected",[this, sectionIndex, cellIndex]);
}
HY.GUI.MListView.prototype.numberOfListSection = function(listView){
    return 0;
}
HY.GUI.MListView.prototype.heightOfListSection = function(listView,sectionIndex){
    return 0;
}
HY.GUI.MListView.prototype.numberOfListCellInSection = function(listView,sectionIndex,cellIndex){
    return 0;
}
HY.GUI.MListView.prototype.heightOfListCellInSection = function(listView,sectionIndex,cellIndex){
    return 0;
}
HY.GUI.MListView.prototype.viewOfListSection = function(listView,sectionIndex){
    return null;
}
HY.GUI.MListView.prototype.viewOfListCellInSection = function(listView,sectionIndex,cellIndex){
    return null;
}

