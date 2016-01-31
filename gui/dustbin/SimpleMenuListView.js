/**
 * Created by Administrator on 2015/11/8.
 */
HY.GUI.SimpleMenuListCellView = function(config){
    this.init(config);
}
HY.GUI.SimpleMenuListCellView.prototype = new HY.GUI.MenuListCellView();
HY.GUI.SimpleMenuListCellView.prototype.defaultText = "menu";
HY.GUI.SimpleMenuListCellView.prototype.defaultNormalColor = null;
HY.GUI.SimpleMenuListCellView.prototype.defaultHoverColor = "#00ff00";
HY.GUI.SimpleMenuListCellView.prototype.defaultActiveColor = "#0000ff";
HY.GUI.SimpleMenuListCellView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._menuLabel = new HY.GUI.Label({textAlign:HY.GUI.TEXTALIGNLEFT});
    if(config.text != null){ this._menuLabel.setText(config.text); } else { this._menuLabel.setText(this.defaultText); }

    if(config.cellMouseUpEvent != undefined){ this.addEventListener("cellmouseup",config.cellMouseUpEvent.selector,config.cellMouseUpEvent.target); }
    if(config.cellMouseDownEvent != undefined){ this.addEventListener("cellmousedown",config.cellMouseDownEvent.selector,config.cellMouseDownEvent.target); }
}
HY.GUI.SimpleMenuListCellView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("mouseup",this._cellMouseUp,this);
    this.addEventListener("mousedown",this._cellMouseDown,this);
    this._menuLabel.addEventListener("mouseup",this._cellMouseUp,this);
    this._menuLabel.addEventListener("mousedown",this._cellMouseDown,this);
    this.addChildNodeAtLayer(this._menuLabel,0);
}
HY.GUI.SimpleMenuListCellView.prototype.getText = function(){
    return this._menuLabel.getText();
}
HY.GUI.SimpleMenuListCellView.prototype.setText = function(text){
    this._menuLabel.setText(text);
}
HY.GUI.SimpleMenuListCellView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    this._menuLabel.setX(5);
    this._menuLabel.setY(0);
    this._menuLabel.setWidth(this.getWidth()-10);
    this._menuLabel.setHeight(this.getHeight());
}
HY.GUI.SimpleMenuListCellView.prototype.onCellMouseUp = function(e){
    this.launchEvent("cellmouseup",[this,e]);
}
HY.GUI.SimpleMenuListCellView.prototype.onCellMouseDown = function(e){
    this.launchEvent("cellmousedown",[this,e]);
}
HY.GUI.SimpleMenuListCellView.prototype._cellMouseUp = function(sender, e){
    this.onCellMouseUp(e);
}
HY.GUI.SimpleMenuListCellView.prototype._cellMouseDown = function(sender, e){
    this.onCellMouseDown(e)
}


HY.GUI.SimpleMenuListView = function(config){
    this.init(config);
}
HY.GUI.SimpleMenuListView.prototype = new HY.GUI.MenuListView();
HY.GUI.SimpleMenuListView.prototype.defaultRowHeight = 20;
HY.GUI.SimpleMenuListView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.items != undefined){ this._items = config.items; } else { this._items = null; }
    if(config.rowHeight != undefined){ this._rowHeight = config.rowHeight; } else { this._rowHeight = this.defaultRowHeight; }

    if(config.cellMouseUpEvent != undefined){ this.addEventListener("cellmouseup",config.cellMouseUpEvent.selector,config.cellMouseUpEvent.target); }
    if(config.cellMouseDownEvent != undefined){ this.addEventListener("cellmousedown",config.cellMouseDownEvent.selector,config.cellMouseDownEvent.target); }
}
HY.GUI.SimpleMenuListView.prototype.getItems = function(){
    return this._items;
}
HY.GUI.SimpleMenuListView.prototype.setItems = function(items){
    this._items = items;
    this.reloadData();
}
HY.GUI.SimpleMenuListView.prototype.getRowHeight = function(){
    return this._rowHeight;
}
HY.GUI.SimpleMenuListView.prototype.setRowHeight = function(rowHeight){
    this._rowHeight = rowHeight;
    this.reloadData();
}
HY.GUI.SimpleMenuListView.prototype.onCellMouseUp = function(e,sectionIndex,cellIndex){
    this.launchEvent("cellmouseup",[this, e, sectionIndex,cellIndex]);
}
HY.GUI.SimpleMenuListView.prototype.onCellMouseDown = function(e,sectionIndex,cellIndex){
    this.launchEvent("cellmousedown",[this, e, sectionIndex,cellIndex]);
}
HY.GUI.SimpleMenuListView.prototype._cellMouseUp = function(sender, e){
    this.onCellMouseUp(e,sender.getSectionIndex(),sender.getCellIndex());
}
HY.GUI.SimpleMenuListView.prototype._cellMouseDown = function(sender, e){
    this.onCellMouseDown(e,sender.getSectionIndex(),sender.getCellIndex());
}
HY.GUI.SimpleMenuListView.prototype.numberOfMenuListSection = function(menuListView){
    return 1;
}
HY.GUI.SimpleMenuListView.prototype.heightOfMenuListSection = function(menuListView, sectionIndex){
    return 0;
}
HY.GUI.SimpleMenuListView.prototype.numberOfMenuListCellInSection = function(menuListView, sectionIndex){
    if(this._items){
        return this._items.length;
    }else{
        return 0;
    }
}
HY.GUI.SimpleMenuListView.prototype.heightOfMenulistCellInSection = function(menuListView, sectionIndex, cellIndex){
    return this._rowHeight;
}
HY.GUI.SimpleMenuListView.prototype.viewOfMenuListSection  = function(menuListView, sectionIndex){
    var sectionView = menuListView.getReuseSectionOfIdentity("menusection");
    if(sectionView == null){
        sectionView = new HY.GUI.MenuListSectionView({reuseIdentity:"menusection"});
    }
    return sectionView;
}
HY.GUI.SimpleMenuListView.prototype.viewOfMenuListCellInSection = function(menuListView, sectionIndex, cellIndex){
    var cellView = menuListView.getReuseCellOfIdentity("menucell");
    if(cellView == null){
        cellView = new HY.GUI.SimpleMenuListCellView({reuseIdentity:"menucell"});
        cellView.addEventListener("cellmouseup",menuListView._cellMouseUp,menuListView);
        cellView.addEventListener("cellmousedown",menuListView._cellMouseDown,menuListView);
    }
    cellView.setText(this._items[cellIndex]);
    return cellView;
}
