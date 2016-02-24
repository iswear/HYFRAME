/*
 nodeData:{
 id:,
 name:,
 leaf:,
 expanded:,
 childNodes:
 }
 */
var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.SimpleTreeNodeView = hy.extend(hy.gui.TreeNodeView);
hy.gui.SimpleTreeNodeView.prototype.defaultNodeEditEnable = false;
hy.gui.SimpleTreeNodeView.prototype.defaultReuseIdentity = "simpletreenode";
hy.gui.SimpleTreeNodeView.prototype.defaultActiveColor = "#0f0";
hy.gui.SimpleTreeNodeView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._nodeEditEnable = this.isUndefined(config.nodeEditEnable) ? this.defaultNodeEditEnable : config.nodeEditEnable;
    this._nodeEditDelay = this.isUndefined(config.nodeEditDelay) ? 200 : config.nodeEditDelay;
    this._nodeIcon = new hy.gui.ImageView({mouseEnable:false});
    this._nodeEditBox = new hy.gui.TextBox({mouseEnable:false, editEnable:false, textHorAlign:hy.gui.TEXT_HORALIGN_LEFT});
    this._nodeExpandIcon = new hy.gui.View({mouseEnable:true});
    this._nodeData = null;
    this._nodePath = null;
    this._nodeInsertMode = 0;
    this.__initEditValid = false;
    this.addChildNodeAtLayer(this._nodeIcon, 0);
    this.addChildNodeAtLayer(this._nodeEditBox, 0);
    this.addChildNodeAtLayer(this._nodeExpandIcon, 0);
    this._nodeExpandIcon.addObserver(this._nodeExpandIcon.notifyPaint, this, this._paintNodeExpandIcon);
    this.addObserver(this.notifyPaint, this, this._paintNodeInsertMode);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutTreeNodeView);
    this.addObserver(this.notifyMouseDown, this, this._nodeEditBoxReady);
    this.addObserver(this.notifyMouseMove, this, this._nodeEditBoxInvalid);
    this.addObserver(this.notifyMouseUp, this, this._nodeEditBoxEnter);
}
hy.gui.SimpleTreeNodeView.prototype.getNodeIcon = function(){
    return this._nodeIcon;
}
hy.gui.SimpleTreeNodeView.prototype.getNodeEditBox = function(){
    return this._nodeEditBox;
}
hy.gui.SimpleTreeNodeView.prototype.getNodeExpandIcon = function(){
    return this._nodeExpandIcon;
}
hy.gui.SimpleTreeNodeView.prototype.setNodeEditEnable = function(editEnable){
    this._nodeEditEnable = editEnable;
}
hy.gui.SimpleTreeNodeView.prototype.getNodeEditEnable = function(){
    return this._nodeEditEnable;
}
hy.gui.SimpleTreeNodeView.prototype.setNodeEditDelay = function(editDelay){
    this._nodeEditDelay = editDelay;
}
hy.gui.SimpleTreeNodeView.prototype.getNodeEditDelay = function(){
    return this._nodeEditDelay;
}
hy.gui.SimpleTreeNodeView.prototype.setNodePath = function(nodePath){
    this._nodePath = nodePath;
    this.needLayoutSubNodes();
}
hy.gui.SimpleTreeNodeView.prototype.getNodePath = function(){
    return this._nodePath;
}
hy.gui.SimpleTreeNodeView.prototype.setNodeData = function(nodeData){
    if(nodeData){
        this._nodeEditBox.setText(nodeData.name);
        if(nodeData.leaf){
            this._nodeExpandIcon.setVisible(false);
        }else{
            this._nodeExpandIcon.setVisible(true);
        }
        this._nodeData = nodeData;
    }
}
hy.gui.SimpleTreeNodeView.prototype.getNodeData = function(){
    return this._nodeData;
}
hy.gui.SimpleTreeNodeView.prototype.setNodeInsertMode = function(mode){
    if(this._nodeInsertMode != mode){
        this._nodeInsertMode = mode;
        this.refresh();
    }
}
hy.gui.SimpleTreeNodeView.prototype.getNodeInsertMode = function(){
    return this._nodeInsertMode;
}
hy.gui.SimpleTreeNodeView.prototype._layoutTreeNodeView = function(sender){
    var nodeDeepth = this._nodePath.length;
    this._nodeIcon.setX(nodeDeepth*this.getHeight()+this.getHeight());
    this._nodeIcon.setY(0);
    this._nodeIcon.setWidth(this.getHeight());
    this._nodeIcon.setHeight(this.getHeight());
    this._nodeEditBox.setX(nodeDeepth*this.getHeight()+this.getHeight()+this.getHeight());
    this._nodeEditBox.setY(0);
    this._nodeEditBox.setWidth(this.getWidth()-this._nodeIcon.getWidth()-this._nodeIcon.getX());
    this._nodeEditBox.setHeight(this.getHeight());
    this._nodeExpandIcon.setX(nodeDeepth*this.getHeight());
    this._nodeExpandIcon.setY(0);
    this._nodeExpandIcon.setWidth(this.getHeight());
    this._nodeExpandIcon.setHeight(this.getHeight());
}
hy.gui.SimpleTreeNodeView.prototype._paintNodeExpandIcon = function(sender,dc,rect){
    var width = sender.getWidth();
    var height = sender.getHeight();
    dc.beginPath();
    if(this._nodeData.expanded){
        dc.moveTo(width/2, height/3);
        dc.lineTo(5*width/6, height/3);
        dc.lineTo(2*width/3, 2*height/3);
    }else{
        dc.moveTo(width/2, height/3);
        dc.lineTo(5*width/6, height/2);
        dc.lineTo(width/2, 2*height/3);
    }
    dc.closePath();
    dc.setFillStyle("#000");
    dc.fill();
}
hy.gui.SimpleTreeNodeView.prototype._paintNodeInsertMode = function(sender, dc, rect){
    switch(this._nodeInsertMode){
        case  1:{//插入上方
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                dc.setStrokeStyle("#00f");
                dc.strokeRect(x, -1, this.getWidth()-x, 2);
            }
            break;
        }
        case 2:{//插入下方
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                dc.setStrokeStyle("#00f");
                dc.strokeRect(x, this.getHeight()-1, this.getWidth()-x, 2);
            }
            break;
        }
        case 3:{//作为子节点
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                var y = 1;
                var width = this.getWidth()-x-1;
                var height = this.getHeight()-2;
                dc.setStrokeStyle("#00f");
                dc.strokeRect(x,y,width,height);
            }
            break;
        }
        default :
            break;
    }
}
hy.gui.SimpleTreeNodeView.prototype._nodeEditBoxReady = function(sender, e){
    if(this.getSelected()){
        this.__initEditValid = true;
    }else{
        this.__initEditValid = false;
    }
}
hy.gui.SimpleTreeNodeView.prototype._nodeEditBoxInvalid = function(sender, e){
    this.__initEditValid = false;
}
hy.gui.SimpleTreeNodeView.prototype._nodeEditBoxEnter = function(sender, e){
    if(this._nodeEditEnable){
        if(this.__initEditValid){
            this._nodeEditBox.focus(e);
        }
    }
}