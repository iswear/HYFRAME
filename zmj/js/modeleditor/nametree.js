var modeleditor = modeleditor || {};
modeleditor.class = modeleditor || {};
modeleditor.class.NameTreeNode = hy.extend(hy.gui.TreeNodeView);
modeleditor.class.NameTreeNode.prototype.defaultReuseIdentity = "structtreenode";
modeleditor.class.NameTreeNode.prototype.defaultActiveColor = hy.gui.colors.BLUE;
modeleditor.class.NameTreeNode.prototype.init = function(config){
    this.superCall("init", [config]);
    this._nodeIcon = new hy.gui.ImageView({mouseEnable:false});
    this._nodeEditBox = new hy.gui.TextBox({mouseEnable:false, editEnable:false, textHorAlign:hy.gui.TEXT_HORALIGN_LEFT});
    this._nodeUnit = null;
    this.addChildNodeAtLayer(this._nodeIcon, 0);
    this.addChildNodeAtLayer(this._nodeEditBox, 0);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutTreeNodeView);
    this.addObserver(this.notifyPaint, this, this._paintSeparateLine);
}
modeleditor.class.NameTreeNode.prototype.getNodeIcon = function(){
    return this._nodeIcon;
}
modeleditor.class.NameTreeNode.prototype.getNodeEditBox = function(){
    return this._nodeEditBox;
}
modeleditor.class.NameTreeNode.prototype.setNodeUnit = function(nodeUnit){
    if(nodeUnit){
        this._nodeEditBox.setText(nodeUnit.getName());
        this._nodeUnit = nodeUnit;
    }
}
modeleditor.class.NameTreeNode.prototype.getNodeUnit = function(){
    return this._nodeUnit;
}
modeleditor.class.NameTreeNode.prototype._layoutTreeNodeView = function(sender){
    var nodeDeepth = this._nodePath.length;
    this._nodeIcon.setX(0);
    this._nodeIcon.setY(0);
    this._nodeIcon.setWidth(this.getHeight());
    this._nodeIcon.setHeight(this.getHeight());
    this._nodeEditBox.setX(this.getHeight());
    this._nodeEditBox.setY(0);
    this._nodeEditBox.setWidth(this.getWidth()-this.getHeight());
    this._nodeEditBox.setHeight(this.getHeight());
}
modeleditor.class.NameTreeNode.prototype._paintSeparateLine = function(sender, dc , rect){
    dc.setStrokeStyle("#666");
    dc.setLineWidth(1);
    dc.beginPath();
    dc.moveTo(0, this.getHeight() - 0.5);
    dc.lineTo(this.getWidth(), this.getHeight() - 0.5);
    dc.stroke();
}

modeleditor.class.NameTree = hy.extend(hy.gui.TreeView);
modeleditor.class.NameTree.prototype.notifySyncNodeText = "syncnodetext";
modeleditor.class.NameTree.prototype.defaultNodeHeight = 20;
modeleditor.class.NameTree.prototype.defaultNodeEditEnable = false;
modeleditor.class.NameTree.prototype.defaultNodeSelectEnable = true;
modeleditor.class.NameTree.prototype.init = function(config) {
    this.superCall("init", [config]);
    this._nodeHeight = this.isUndefined(config.nodeHeight) ? this.defaultNodeHeight : config.nodeHeight;
}
modeleditor.class.NameTree.prototype.setNodeHeight = function(nodeHeight){
    this._nodeHeight = nodeHeight;
}
modeleditor.class.NameTree.prototype.getNodeHeight = function(){
    return this._nodeHeight;
}
modeleditor.class.NameTree.prototype.getNodeUnitOfNodePath = function(nodePath,nodeDeepth){
    if(nodePath && nodeDeepth >= 0 && nodeDeepth <= nodePath.length){
        var node = this.getRoot();
        if(node){
            for(var i=0; i<nodeDeepth; ++i){
                node = node.getChildUnitAtIndex(nodePath[i]);
                if(!node){
                    break;
                }
            }
            return node;
        }else{
            return null;
        }
    }else{
        return null;
    }
}

modeleditor.class.NameTree.prototype.numberOfNodeInPath = function(treeView, nodePath){
    var node = this.getRoot();
    var nodeDeepth = nodePath.length;
    for(var i=0;i<nodeDeepth;++i){
        if(node){
            node = node.getChildUnitAtIndex(nodePath[i]);
        }else{
            return 0;
        }
    }
    if(node){
        var childUnits = node.getChildUnits();
        return childUnits.length;
    }else{
        return 0;
    }
}
modeleditor.class.NameTree.prototype.heightOfNodeInPath = function(treeView, nodePath){
    return this._nodeHeight;
}
modeleditor.class.NameTree.prototype.widthOfNodeInPath = function(treeView, nodePath){
    var nodeView = treeView.getNodeViewOfNodePath(nodePath, nodePath.length);
    if(nodeView){
        return nodeView.getHeight() * (nodePath.length+2) + 10;
    }else{
        return 0;
    }
}
modeleditor.class.NameTree.prototype.contextMenuOfNodeInPath = function(treeView, nodePath){
    return null;
}
modeleditor.class.NameTree.prototype.viewOfNodeInPath = function(treeView,nodePath) {
    var nodeRoot = this.getRoot();
    if (nodeRoot) {
        var nodeDeepth = nodePath.length;
        for (var i = 0; i < nodeDeepth; ++i) {
            nodeRoot = nodeRoot.getChildUnitAtIndex(nodePath[i]);
        }
        var nodeView = treeView.getReuseNodeViewOfIdentity("treenode");
        if (nodeView == null) {
            nodeView = new modeleditor.class.NameTreeNode ({reuseIdentity: "treenode"});
            var nodeIcon = nodeView.getNodeIcon();
            if(nodePath.length == 0){
                nodeIcon.setImage(hy.config.PATH + "res/images/icon_model.png");
            }else{
                nodeIcon.setImage(hy.config.PATH + "res/images/icon_unit.png");
            }
        }
        if (this._selNodePath && this._compareNodePath(nodePath, nodePath.length, this._selNodePath, this._selNodePath.length)) {
            nodeView.setSelected(true);
        } else {
            nodeView.setSelected(false);
        }
        nodeView.setNodeUnit(nodeRoot);
        return nodeView;
    } else {
        return null;
    }
}