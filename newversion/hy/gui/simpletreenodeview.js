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
hy.gui.SimpleTreeNodeView.prototype = new HY.GUI.View();
hy.gui.SimpleTreeNodeView.prototype.defaultNodeEditEnable = false;
hy.gui.SimpleTreeNodeView.prototype.defaultReuseIdentity = "simpletreenode";
hy.gui.SimpleTreeNodeView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._nodeEditEnable = this.isUndefined(config.nodeEditEnable) ? this.defaultNodeEditEnable : config.nodeEditEnable;
    this._nodeEditDelay = this.isUndefined(config.nodeEditDelay) ? 200 : config.nodeEditDelay;
    this._nodeIcon = new hy.gui.ImageView({mouseEnable:false});
    this._nodeEditBox = new hy.gui.TextBox({mouseEnable:false, editEnable:false});
    this._nodeExpandIcon = new hy.gui.View({mouseEnable:true});
    this._nodeData = null;
    this._nodePath = null;
    this._nodeInsertMode = 0;
}
hy.gui.SimpleTreeNodeView.prototype.getNodeIcon = function(){
    return this._nodeIcon;
}
hy.gui.SimpleTreeNodeView.prototype.getNodeTextBox = function(){
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
}
hy.gui.SimpleTreeNodeView.prototype.getNodePath = function(){
    return this._nodePath;
}
hy.gui.SimpleTreeNodeView.prototype.setNodeData = function(nodeData){
    if(nodeData){
        this._nodeEditBox.setText(nodeData.name);
        var nodeDeepth = 0;
        if(this._nodePath){
            nodeDeepth = this._nodePath.length;
        }
        if(nodeData.leaf){
            this._nodeExpandIcon.setVisible(false);
        }else{
            this._nodeExpandIcon.setVisible(true);
        }
        return this._nodeData = nodeData;
    }
}
hy.gui.SimpleTreeNodeView.prototype.getNodeData = function(){
    return this._nodeData;
}
hy.gui.SimpleTreeNodeView.prototype.setNodeInsertMode = function(mode){
    this._nodeInsertMode = mode;
}
hy.gui.SimpleTreeNodeView.prototype.getNodeInsertMode = function(){
    return this._nodeInsertMode;
}
hy.gui.SimpleTreeNodeView.prototype._nodeInsertModePaint = function(sender, dc, rect){
    switch(this._nodeInsertMode){
        case  1:{//作为子节点
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                var y = 1;
                var width = this.getWidth()-x-1;
                var height = this.getHeight()-2;
                dc.setStrokeStyle("#ff0000");
                dc.strokeRect(x,y,width,height);
            }
            break;
        }
        case 2:{//插入上方
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                dc.setStrokeStyle("#ff0000");
                dc.beginPath();
                dc.moveTo(x,1);
                dc.lineTo(this.getWidth(),1);
                dc.stroke();
            }
            break;
        }
        case 3:{//插入下方
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                var y = this.getHeight()-1;
                dc.setStrokeStyle("#ff0000");
                dc.beginPath();
                dc.moveTo(x,y);
                dc.lineTo(this.getWidth(),y);
                dc.stroke();
            }
            break;
        }
        default :
            break;
    }
}
hy.gui.SimpleTreeNodeView.prototype._nodeExpandIconPaint = function(sender,dc,rect){
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
    dc.setFillStyle("#000000");
    dc.fill();
}