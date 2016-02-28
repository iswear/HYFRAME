var modeleditor = modeleditor || {};
modeleditor.class = modeleditor || {};
modeleditor.class.NameTreeNode = hy.extend(hy.gui.TreeNodeView);
modeleditor.class.NameTreeNode.prototype.defaultReuseIdentity = "structtreenode";
modeleditor.class.NameTreeNode.prototype.defaultActiveColor = "#0f0";
modeleditor.class.NameTreeNode.prototype.init = function(config){
    this.superCall("init", [config]);
    this._nodeIcon = new hy.gui.ImageView({mouseEnable:false});
    this._nodeEditBox = new hy.gui.TextBox({mouseEnable:false, editEnable:false, textHorAlign:hy.gui.TEXT_HORALIGN_LEFT});
    this._nodeUnit = null;
    this.addChildNodeAtLayer(this._nodeIcon, 0);
    this.addChildNodeAtLayer(this._nodeEditBox, 0);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutTreeNodeView);
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
        this._nodeExpandIcon.setVisible(true);
        this._nodeUnit = nodeUnit;
    }
}
modeleditor.class.NameTreeNode.prototype.getNodeUnit = function(){
    return this._nodeUnit;
}
modeleditor.class.NameTreeNode.prototype._layoutTreeNodeView = function(sender){
    var nodeDeepth = this._nodePath.length;
    this._nodeIcon.setX(nodeDeepth*this.getHeight()+this.getHeight());
    this._nodeIcon.setY(0);
    this._nodeIcon.setWidth(this.getHeight());
    this._nodeIcon.setHeight(this.getHeight());
    this._nodeEditBox.setX(nodeDeepth*this.getHeight()+this.getHeight()+this.getHeight());
    this._nodeEditBox.setY(0);
    this._nodeEditBox.setWidth(this.getWidth()-this._nodeIcon.getWidth()-this._nodeIcon.getX());
    this._nodeEditBox.setHeight(this.getHeight());
}

modeleditor.class.NameTree = hy.extend(hy.gui.TreeView);
modeleditor.class.NameTree.prototype.notifySyncNodeText = "syncnodetext";
modeleditor.class.NameTree.prototype.defaultNodeHeight = 20;
modeleditor.class.NameTree.prototype.defaultNodeEditEnable = false;
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
    if(node){
        var nodeDeepth = nodePath.length;
        for(var i=0;i<nodeDeepth;++i){
            node = node.childNodes[nodePath[i]];
        }
        if(!node || node.leaf || !node.expanded || !node.childNodes){
            return 0;
        }else{
            return node.childNodes.length;
        }
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