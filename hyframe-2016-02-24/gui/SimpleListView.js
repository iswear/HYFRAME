/**
 * Created by Administrator on 2015/11/7.
 */
HY.GUI.SimpleListCellView = function(config){
    this.init(config);
}
HY.GUI.SimpleListCellView.prototype = new HY.GUI.ListCellView();
HY.GUI.SimpleListCellView.prototype.defaultEditEnable = true;
HY.GUI.SimpleListCellView.prototype.defaultNormalColor = null;
HY.GUI.SimpleListCellView.prototype.defaultHoverColor = null;
HY.GUI.SimpleListCellView.prototype.defaultActiveColor = "#0000ff";
HY.GUI.SimpleListCellView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._textBox = new HY.GUI.TextBox({editEnable:true,mouseEnable:false,cursor:'default'});
    if(config.editEnable != undefined){ this._editEnable = config.editEnable; } else { this._editEnable = this.defaultEditEnable; }
    if(config.editDelay != undefined){ this._editDelay = config.editDelay; } else { this._editDelay = 200; }
    this.__initEditStartTime = 0;
    this.__initEditValid = true;
}
HY.GUI.SimpleListCellView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("mousedown",this._initEditStatus,this);
    this.addEventListener("mousemove",this._breakEditStatus,this);
    this.addEventListener("mouseup",this._enterEditStatus, this);
    this.addChildNodeAtLayer(this._textBox, 0);
}
HY.GUI.SimpleListCellView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    this._textBox.setX(2);
    this._textBox.setY(0);
    this._textBox.setWidth(this.getWidth()-4);
    this._textBox.setHeight(this.getHeight());
}
HY.GUI.SimpleListCellView.prototype.getMinLayoutWidth = function(){
    return this._textBox.getMinLayoutWidth() + 5;
}
HY.GUI.SimpleListCellView.prototype.getTextBox = function(){
    return this._textBox;
}
HY.GUI.SimpleListCellView.prototype.getText = function(){
    return this._textBox.getText();
}
HY.GUI.SimpleListCellView.prototype.setText = function(text){
    this._textBox.setText(text);
}
HY.GUI.SimpleListCellView.prototype.getEditEnable = function(){
    return this._editEnable;
}
HY.GUI.SimpleListCellView.prototype.setEditEnable = function(editEnable){
    this._editEnable = editEnable;
}
HY.GUI.SimpleListCellView.prototype.getEditDelay = function(){
    return this._editDelay;
}
HY.GUI.SimpleListCellView.prototype.setEditDelay = function(delay){
    this._editDelay = delay;
}
HY.GUI.SimpleListCellView.prototype._initEditStatus = function(sender, e){
    this.__initEditStartTime = (new Date()).getTime();
    this.__initEditValid = true;
}
HY.GUI.SimpleListCellView.prototype._breakEditStatus = function(sender, e){
    this.__initEditValid = false;
}
HY.GUI.SimpleListCellView.prototype._enterEditStatus = function(sender, e){
    if(this._editEnable){
        if(this.__initEditValid && (new Date()).getTime() - this.__initEditStartTime > this._editDelay){
            this._textBox.focus(e);
        }
    }
}

HY.GUI.SimpleListView = function(config){
    this.init(config);
}
HY.GUI.SimpleListView.prototype = new HY.GUI.ListView();
HY.GUI.SimpleListView.prototype.defaultRowHeight = 20;
HY.GUI.SimpleListView.prototype.defaultCellSelectEnable = false;
HY.GUI.SimpleListView.prototype.defaultCellEditEnAble = false;
HY.GUI.SimpleListView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.items != undefined){ this._items = config.items; } else { this._items = null; }
    if(config.rowHeight != undefined){ this._rowHeight = config.rowHeight; } else { this._rowHeight = this.defaultRowHeight; }
    if(config.cellSelectEnable != undefined){ this._cellSelectEnable = config.cellSelectEnable; } else { this._cellSelectEnable = this.defaultCellSelectEnable; }
    if(config.cellEditEnable != undefined){ this._cellEidtEnable = config.cellEditEnable; } else { this._cellEditEnable = this.defaultCellEditEnAble; }
    this._selCellPath = {sectionIndex:-1, cellIndex:-1};
}
HY.GUI.SimpleListView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("cellmousedown",this._cellSelected,this);
}
HY.GUI.SimpleListView.prototype.getItems = function(){
    return this._items;
}
HY.GUI.SimpleListView.prototype.setItems = function(items){
    this._items = items;
    this.reloadData();
}
HY.GUI.SimpleListView.prototype.getRowHeight = function(){
    return this._rowHeight;
}
HY.GUI.SimpleListView.prototype.setRowHeight = function(rowHeight){
    this._rowHeight = rowHeight;
    this.reloadData();
}
HY.GUI.SimpleListView.prototype.getCellSelectEnable = function(){
    return this._cellSelectEnable;
}
HY.GUI.SimpleListView.prototype.setCellSelectEnable = function(cellSelectEnable){
    this._cellSelectEnable = cellSelectEnable;
}
HY.GUI.SimpleListView.prototype.getCellEditEnable = function(){
    return this._cellEditEnable;
}
HY.GUI.SimpleListView.prototype.setCellEditEnable = function(cellEditEnable){
    this._cellEditEnable = cellEditEnable;
    this.reloadData();
}
HY.GUI.SimpleListView.prototype.getSelectedCellPath = function(){
    return this._selCellPath;
}
HY.GUI.SimpleListView.prototype.setSelectedCellPath = function(sectionIndex, cellIndex){
    if(this._selCellPath.sectionIndex != sectionIndex || this._selCellPath.cellIndex != cellIndex){
        var curSelView = this.getListCellViewOfCellPath(this._selCellPath.sectionIndex, this._selCellPath.cellIndex);
        var nextSelView = this.getListCellViewOfCellPath(sectionIndex, cellIndex);
        var oldSectionIndex = this._selCellPath.sectionIndex;
        var oldCellIndex = this._selCellPath.cellIndex;
        this._selCellPath.sectionIndex = sectionIndex;
        this._selCellPath.cellIndex = cellIndex;
        if(curSelView){
            curSelView.setSelected(false);
            this.onCellUnSelected(this, oldSectionIndex, oldCellIndex);
        }
        if(nextSelView){
            nextSelView.setSelected(true);
            this.onCellSelected(this, sectionIndex, cellIndex);
        }
    }
}

HY.GUI.SimpleListView.prototype._cellSelected = function(sender, e, cellView){
    if(this._cellSelectEnable){
        this.setSelectedCellPath(cellView.getSectionIndex(),cellView.getCellIndex());
    }
}
HY.GUI.SimpleListView.prototype._cellTextChanged = function(sender, sectionIndex, cellIndex){

}
HY.GUI.SimpleListView.prototype.onCellSelected = function(sender, sectionIndex, cellIndex){
    this.launchEvent("cellselected",[sender, sectionIndex, cellIndex]);
}
HY.GUI.SimpleListView.prototype.onCellUnSelected = function(sender, sectionIndex, cellIndex){
    this.launchEvent("cellunselected",[sender, sectionIndex, cellIndex]);
}
HY.GUI.SimpleListView.prototype.onCellTextChanged = function(sender, sectionIndex, cellIndex){

}

HY.GUI.SimpleListView.prototype.numberOfListSection = function(listView){
    return 1;
}
HY.GUI.SimpleListView.prototype.heightOfListSection = function(listView,sectionIndex){
    return 0;
}
HY.GUI.SimpleListView.prototype.numberOfListCellInSection = function(listView, sectionIndex, cellIndex){
    if(this._items){
        return this._items.length;
    }else{
        return 0;
    }
}
HY.GUI.SimpleListView.prototype.heightOfListCellInSection = function(listView, sectionIndex, cellIndex){
    return this._rowHeight;
}
HY.GUI.SimpleListView.prototype.contextMenuOfListCellInSection = function(listView, sectionIndex, cellIndex){
    return null;
}
HY.GUI.SimpleListView.prototype.viewOfListSection = function(listView, sectionIndex){
    var sectionView = listView.getReuseSectionOfIdentity("listsection");
    if(sectionView == null){
        sectionView = new HY.GUI.ListSectionView({reuseIdentity:'listsection'});
    }
    return sectionView;
}
HY.GUI.SimpleListView.prototype.viewOfListCellInSection = function(listView, sectionIndex, cellIndex){
    var cellView = listView.getReuseCellOfIdentity("listcell");
    if(cellView == null) {
        cellView = new HY.GUI.SimpleListCellView({reuseIdentity: "listcell"});
    }
    cellView.setText(this._items[cellIndex]);
    cellView.setEditEnable(this._cellEditEnable);
    if(sectionIndex == this._selCellPath.sectionIndex && cellIndex == this._selCellPath.cellIndex){
        cellView.setSelected(true);
    }else{
        cellView.setSelected(false);
    }
    return cellView;
}
