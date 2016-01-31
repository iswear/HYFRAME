/**
 * Created by Administrator on 2015/11/8.
 */
HY.GUI.MenuListView = function(config){
    this.init(config);
}
HY.GUI.MenuListView.prototype = new HY.GUI.View();
HY.GUI.MenuListView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.dataSource != undefined){ this._dataSource = config.dataSource; } else { this._dataSource = null; }
    if(config.menuListCellSelectedEvent != undefined){ this.addEventListener("listcellselected",config.menuListCellSelectedEvent.selector,config.menuListCellSelectedEvent.target); }
    this._reuseSectionViews = {};
    this._reuseCellViews = {};
    this._sectionViews = [];
    this._cellViews = [];
}
HY.GUI.MenuListView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.reloadData();
}
HY.GUI.MenuListView.prototype.getDataSource = function(){
    return this._dataSource;
}
HY.GUI.MenuListView.prototype.setDataSource = function(dataSource){
    this._dataSource = dataSource;
    this.reloadData();
}
HY.GUI.MenuListView.prototype.getReuseCellOfIdentity = function(reuseIdentity){
    if(this._reuseCellViews[reuseIdentity] && this._reuseCellViews[reuseIdentity].length > 0){
        return this._reuseCellViews[reuseIdentity].pop();
    }else{
        return null;
    }
}
HY.GUI.MenuListView.prototype.getReuseSectionOfIdentity = function(reuseIdentity){
    if(this._reuseSectionViews[reuseIdentity] && this._reuseSectionViews[reuseIdentity].length > 0){
        return this._reuseSectionViews[reuseIdentity].pop();
    }else{
        return null;
    }
}
HY.GUI.MenuListView.prototype._setCellView = function(sectionIndex,cellIndex,cellView){
    cellView.setSectionIndex(sectionIndex);
    cellView.setCellIndex(cellIndex);
    if(!cellView.checkEventListener("mouseup",this._menuListCellViewMouseUp,this)){
        cellView.addEventListener("mouseup",this._menuListCellViewMouseUp,this);
    }
    this._cellViews.push(cellView);
    this.addChildNodeAtLayer(cellView,0);
}
HY.GUI.MenuListView.prototype._recycleAllCellViews = function(){
    for(var i=this._cellViews.length-1;i>=0;--i){
        var cellView = this._cellViews[i];
        var reuseIdentity = cellView.getReuseIdentity();
        if(!this._reuseCellViews[reuseIdentity]){
            this._reuseCellViews[reuseIdentity] = [];
        }
        this._reuseCellViews[reuseIdentity].push(cellView);
        cellView.setSectionIndex(-1);
        cellView.setCellIndex(-1);
        cellView.removeFromParent(true);
        this._cellViews.splice(i,1);
    }
}
HY.GUI.MenuListView.prototype._setSectionView = function(sectionIndex,sectionView){
    sectionView.setSectionIndex(sectionIndex);
    this._sectionViews.push(sectionView);
    this.addChildNodeAtLayer(sectionView,0);
}
HY.GUI.MenuListView.prototype._recycleAllSectionViews = function(){
    for(var i=this._sectionViews.length-1;i>=0;--i){
        var sectionView = this._sectionViews[i];
        var reuseIdentity = sectionView.getReuseIdentity();
        if(!this._reuseSectionViews[reuseIdentity]){
            this._reuseSectionViews[reuseIdentity] = [];
        }
        this._reuseSectionViews[reuseIdentity].push(sectionView);
        sectionView.setSectionIndex(-1);
        sectionView.removeFromParent(true);
        this._sectionViews.splice(i,1);
    }
}
HY.GUI.MenuListView.prototype.reloadData = function(){
    var dataSource = this;
    if(this._dataSource != null){
        dataSource = this._dataSource;
    }
    this._recycleAllCellViews();
    this._recycleAllSectionViews();
    var sectionNum = dataSource.numberOfMenuListSection(this);
    var cursory = 0;
    for(var i=0;i<sectionNum;++i){
        var sectionHeight = dataSource.heightOfMenuListSection(this,i);
        if(sectionHeight > 0){
            var sectionView = dataSource.viewOfMenuListSection(this,i);
            sectionView.setX(0);
            sectionView.setY(cursory);
            sectionView.setWidth(this.getWidth());
            sectionView.setHeight(sectionHeight);
            this._setSectionView(i,sectionView);
            cursory += sectionHeight;
        }
        var cellNum = dataSource.numberOfMenuListCellInSection(this,i);
        for(var j=0;j<cellNum;++j){
            var cellHeight = dataSource.heightOfMenulistCellInSection(this,i,j);
            if(cellHeight > 0){
                var cellView = dataSource.viewOfMenuListCellInSection(this,i,j);
                cellView.setX(0);
                cellView.setY(cursory);
                cellView.setWidth(this.getWidth());
                cellView.setHeight(cellHeight);
                this._setCellView(i,j,cellView);
                cursory += cellHeight;
            }
        }
    }
    this.setHeight(cursory);
}
HY.GUI.MenuListView.prototype._menuListCellViewMouseUp = function(sender){
    this.onMenuListCellSelected(sender.getSectionIndex(),sender.getCellIndex());
}
HY.GUI.MenuListView.prototype.onMenuListCellSelected = function(sectionIndex,cellIndex){
    this.launchEvent("menulistcellselected",[this,sectionIndex,cellIndex]);
}
HY.GUI.MenuListView.prototype.numberOfMenuListSection = function(menuListView){
    return 0;
}
HY.GUI.MenuListView.prototype.heightOfMenuListSection = function(menuListView, sectionIndex){
    return 0;
}
HY.GUI.MenuListView.prototype.numberOfMenuListCellInSection = function(menuListView, sectionIndex){
    return 0;
}
HY.GUI.MenuListView.prototype.heightOfMenulistCellInSection = function(menuListView, sectionIndex, cellIndex){
    return 0;
}
HY.GUI.MenuListView.prototype.viewOfMenuListSection  = function(menuListView, sectionIndex){
    return null;
}
HY.GUI.MenuListView.prototype.viewOfMenuListCellInSection = function(menuListView, sectionIndex, cellIndex){
    return null;
}