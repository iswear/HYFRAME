/**
 * Created by Administrator on 2015/11/2.
 */
HY.GUI.MGridView = function(config){
    this.init(config);
}
HY.GUI.MGridView.prototype = new HY.GUI.MScrollView();
HY.GUI.MGridView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.dataSource != undefined){ this._dataSource = config.dataSource; } else{ this._dataSource = null; }
    if(config.gridCellSelectedEvent != undefined){ this.addEventListener("gridcellselected",config.gridCellSelectedEvent.selector,config.gridCellSelectedEvent.target); }
    this._reuseSectionViews = {};
    this._reuseCellViews = {};
    this._sectionViews = [];
    this._cellViews = [];
    this._sections = [];
}
HY.GUI.MGridView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.reloadData();
    this._contentView.addEventListener("xchanged",this._mallocGridViews,this);
    this._contentView.addEventListener("ychanged",this._mallocGridViews,this);
}
HY.GUI.MGridView.prototype.getDataSource = function(){
    return this._dataSource;
}
HY.GUI.MGridView.prototype.setDataSource = function(dataSource){
    this._dataSource = dataSource;
    this.reloadData();
}
HY.GUI.MGridView.prototype.getReuseSectionOfIdentity = function(reuseIdentity){
    if(this._reuseSectionViews[reuseIdentity] && this._reuseSectionViews[reuseIdentity].length > 0){
        return this._reuseSectionViews[reuseIdentity].pop();
    }else{
        return null;
    }
}
HY.GUI.MGridView.prototype.getReuseCellOfIdentity = function(reuseIdentity){
    if(this._reuseCellViews[reuseIdentity] && this._reuseCellViews[reuseIdentity].length > 0){
        return this._reuseCellViews[reuseIdentity].pop();
    }else{
        return null;
    }
}
HY.GUI.MGridView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    var contentWidth = this.getContentWidth();
    for(var i = this._sectionViews.length-1;i>=0;--i){
        this._sectionViews[i].setWidth(contentWidth);
    }
}
HY.GUI.MGridView.prototype.reloadData = function(){
    var dataSource = this;
    if(this._dataSource != null){
        dataSource = this._dataSource;
    }
    this._recycleAllSectionViews();
    this._recycleAllCellViews();
    this._sections = [];
    var sectionNum = dataSource.numberOfGridSection(this);
    var cursorX = 0;
    var cursorY = 0;
    for(var i=0;i<sectionNum;++i){
        var section = {layout:{y:0,height:0},rowNum:0,rowHeight:0,colNum:0,colWidth:0,view:null,cells:[]};
        section.layout.y = cursorY;
        section.layout.height = dataSource.heightOfGridSection(this,i);
        section.rowNum = dataSource.rowNumOfGridSection(this,i);
        section.rowHeight = dataSource.rowHeightOfGridSection(this,i);
        section.colNum = dataSource.colNumOfGridSection(this,i);
        section.colWidth = dataSource.colWidthOfGridSection(this,i);
        cursorY += section.layout.height;
        var cellNum = dataSource.numberOfGridCellInSection(this,i);
        for(var j= 0,cellCount=0;j<section.rowNum;++j){
            for(var k=0;k<section.colNum && cellCount<cellNum;++k){
                var cell = {layout:{x:section.colWidth*k,y:cursorY+section.rowHeight*j}};
                section.cells.push(cell);
                cellCount++;
            }
        }
        cursorY += section.rowHeight * section.rowNum;
        if(cursorX < section.colWidth * section.colNum){
            cursorX = section.colWidth * section.colNum;
        }
        this._sections.push(section);
    }
    this.getContentView().setMinLayoutWidth(cursorX);
    this.getContentView().setWidth(cursorX);
    this.getContentView().setMinLayoutHeight(cursorY);
    this.getContentView().setHeight(cursorY);
    this._mallocGridViews();
}
HY.GUI.MGridView.prototype._setSectionView = function(sectionIndex,sectionView){
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
HY.GUI.MGridView.prototype._recycleSectionView = function(sectionIndex){
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
HY.GUI.MGridView.prototype._recycleAllSectionViews = function(){
    for(var i=this._sectionViews.length-1;i>=0;--i){
        var sectionView = this._sectionViews[i];
        this._recycleSectionView(sectionView.getSectionIndex());
        this._sectionViews.splice(i,1);
    }
}
HY.GUI.MGridView.prototype._setCellView = function(sectionIndex,cellIndex,cellView){
    if(sectionIndex < this._sections.length){
        var section = this._sections[sectionIndex];
        var cells = section.cells;
        if(cellIndex < cells.length){
            var cell = cells[cellIndex];
            cellView.setX(cell.layout.x);
            cellView.setY(cell.layout.y);
            cellView.setSectionIndex(sectionIndex);
            cellView.setCellIndex(cellIndex);
            cell.view = cellView;
            this._cellViews.push(cellView);
            if(!cellView.checkEventListener("mouseup",this._GridCellViewMouseUp,this)){
                cellView.addEventListener("mouseup",this._GridCellViewMouseUp,this);
            }
            this.getContentView().addChildNodeAtLayer(cellView,0);
        }
    }
}
HY.GUI.MGridView.prototype._recycleCellView = function(sectionIndex,cellIndex){
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
HY.GUI.MGridView.prototype._recycleAllCellViews = function(sectionIndex,cellIndex){
    for(var i=this._cellViews.length-1;i>=0;--i){
        var cellView = this._cellViews[i];
        this._recycleCellView(cellView.getSectionIndex(),cellView.getCellIndex());
        this._cellViews.splice(i,1);
    }
}
HY.GUI.MGridView.prototype._mallocGridViews = function(){
    var dataSource = this;
    if(this._dataSource != null){
        dataSource = this._dataSource;
    }
    var contentOffsetX = this.getContentOffsetX();
    var contentOffsetY = this.getContentOffsetY();
    var contentMaxX = contentOffsetX+this.getWidth();
    var contentMaxY = contentOffsetY+this.getHeight();
    for(var i=this._sectionViews.length-1;i>=0;--i){
        var sectionView = this._sectionViews[i];
        if(sectionView.getY() > contentMaxY || sectionView.getY()+sectionView.getHeight()<contentOffsetY){
            this._recycleSectionView(sectionView.getSectionIndex());
            this._sectionViews.splice(i,1);
        }
    }
    for(var i=this._cellViews.length-1;i>=0;--i){
        var cellView = this._cellViews[i];
        if(cellView.getX()>contentMaxX || cellView.getX()+cellView.getWidth()<contentOffsetX
            || cellView.getY()>contentMaxY || cellView.getY()+cellView.getHeight()<contentOffsetY){
            this._recycleCellView(cellView.getSectionIndex(), cellView.getCellIndex());
            this._cellViews.splice(i,1);
        }
    }
    var sectionNum = this._sections.length;
    for(var i=0;i<sectionNum;++i){
        var section = this._sections[i];
        if(section.layout.y < contentMaxY){
            if(section.layout.y + section.layout.height > contentOffsetY && section.layout.height > 0 ){
                if(!section.view){
                    var sectionView = dataSource.viewOfGridSection(this,i);
                    this._setSectionView(i,sectionView);
                }
            }
            if(section.rowHeight > 0 && section.colWidth > 0){
                var cellNum = section.cells.length;
                for(var j= 0,cellCount=0;j<section.rowNum;++j){
                    for(var k=0;k<section.colNum && cellCount<cellNum;++k){
                        var cell = section.cells[cellCount];
                        if(cell.layout.y < contentMaxY && cell.layout.x < contentMaxX
                            && cell.layout.y + section.rowHeight > contentOffsetY && cell.layout.x + section.colWidth > contentOffsetX ){
                            if(!cell.view){
                                var cellView = dataSource.viewOfGridCellInSection(this,i,cellCount);
                                cellView.setWidth(section.colWidth);
                                cellView.setHeight(section.rowHeight);
                                this._setCellView(i,cellCount,cellView);
                            }
                        }
                        cellCount++;
                    }
                }
            }
        }else{
            break;
        }
    }
}
HY.GUI.MGridView.prototype._GridCellViewMouseUp = function(sender){
    this.onGridCellSelected(this,sender.getSectionIndex(),sender.getCellIndex());
}
HY.GUI.MGridView.prototype.onGridCellSelected = function(sender,sectionIndex, cellIndex){
    this.launchEvent("gridcellselected",[this, sectionIndex, cellIndex]);
}
HY.GUI.MGridView.prototype.numberOfGridSection = function(gridView){
    return 0;
}
HY.GUI.MGridView.prototype.heightOfGridSection = function(gridView,sectionIndex){
    return 0;
}
HY.GUI.MGridView.prototype.rowNumOfGridSection = function(gridView,sectionIndex){
    return 0;
}
HY.GUI.MGridView.prototype.colNumOfGridSection = function(gridView,sectionIndex){
    return 0;
}
HY.GUI.MGridView.prototype.rowHeightOfGridSection = function(gridView,sectionIndex){
    return 0;
}
HY.GUI.MGridView.prototype.colWidthOfGridSection = function(gridView,sectionIndex){
    return 0;
}
HY.GUI.MGridView.prototype.numberOfGridCellInSection = function(gridView,sectionIndex){
    return 0;
}
HY.GUI.MGridView.prototype.viewOfGridSection = function(gridView, sectionIndex){
    return null;
}
HY.GUI.MGridView.prototype.viewOfGridCellInSection = function(gridView, sectionIndex, cellIndex){
    return null;
}

