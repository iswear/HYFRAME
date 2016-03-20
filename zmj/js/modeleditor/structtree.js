var modeleditor = modeleditor || {};
modeleditor.class = modeleditor || {};

modeleditor.class.StructTreeNode = hy.extend(hy.gui.TreeNodeView);
modeleditor.class.StructTreeNode.prototype.defaultNodeEditEnable = false;
modeleditor.class.StructTreeNode.prototype.defaultReuseIdentity = "structtreenode";
modeleditor.class.StructTreeNode.prototype.defaultActiveColor = hy.gui.colors.BLUE;
modeleditor.class.StructTreeNode.prototype.init = function(config){
    this.superCall("init", [config]);
    this._nodeIcon = new hy.gui.ImageView({mouseEnable:false});
    this._nodeEditBox = new hy.gui.TextBox({mouseEnable:false, editEnable:false, textHorAlign:hy.gui.TEXT_HORALIGN_LEFT});
    this._nodeExpandIcon = new hy.gui.View({mouseEnable:true});
    this._nodeEditEnable = this.isUndefined(config.nodeEditEnable) ? this.defaultNodeEditEnable : config.nodeEditEnable;
    this._nodeUnit = null;
    this.addChildNodeAtLayer(this._nodeIcon, 0);
    this.addChildNodeAtLayer(this._nodeEditBox, 0);
    this.addChildNodeAtLayer(this._nodeExpandIcon, 0);
    this._nodeExpandIcon.addObserver(this._nodeExpandIcon.notifyPaint, this, this._paintNodeExpandIcon);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutTreeNodeView);
    this.addObserver(this.notifyMouseDown, this, this._nodeEditBoxReady);
    this.addObserver(this.notifyMouseMove, this, this._nodeEditBoxInvalid);
    this.addObserver(this.notifyMouseUp, this, this._nodeEditBoxEnter);
}
modeleditor.class.StructTreeNode.prototype.getNodeIcon = function(){
    return this._nodeIcon;
}
modeleditor.class.StructTreeNode.prototype.getNodeEditBox = function(){
    return this._nodeEditBox;
}
modeleditor.class.StructTreeNode.prototype.getNodeExpandIcon = function(){
    return this._nodeExpandIcon;
}
modeleditor.class.StructTreeNode.prototype.setNodeEditEnable = function(editEnable){
    this._nodeEditEnable = editEnable;
}
modeleditor.class.StructTreeNode.prototype.getNodeEditEnable = function(){
    return this._nodeEditEnable;
}
modeleditor.class.StructTreeNode.prototype.setNodeUnit = function(nodeUnit){
    if(nodeUnit){
        this._nodeEditBox.setText(nodeUnit.getName());
        this._nodeExpandIcon.setVisible(true);
        this._nodeUnit = nodeUnit;
    }
}
modeleditor.class.StructTreeNode.prototype.getNodeUnit = function(){
    return this._nodeUnit;
}
modeleditor.class.StructTreeNode.prototype._layoutTreeNodeView = function(sender){
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
modeleditor.class.StructTreeNode.prototype._paintNodeExpandIcon = function(sender,dc,rect){
    var width = sender.getWidth();
    var height = sender.getHeight();
    dc.beginPath();
    if(this._nodeUnit.getUserProperty("expanded")){
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
modeleditor.class.StructTreeNode.prototype._nodeEditBoxReady = function(sender, e){
    if(this.getSelected()){
        this.__initEditValid = true;
    }else{
        this.__initEditValid = false;
    }
}
modeleditor.class.StructTreeNode.prototype._nodeEditBoxInvalid = function(sender, e){
    this.__initEditValid = false;
}
modeleditor.class.StructTreeNode.prototype._nodeEditBoxEnter = function(sender, e){
    if(this._nodeEditEnable){
        if(this.__initEditValid){
            this._nodeEditBox.focus(e);
        }
    }
}

modeleditor.class.StructTree = hy.extend(hy.gui.TreeView);
modeleditor.class.StructTree.prototype.notifySyncNodeText = "syncnodetext";
modeleditor.class.StructTree.prototype.defaultNodeHeight = 20;
modeleditor.class.StructTree.prototype.defaultNodeEditEnable = false;
modeleditor.class.StructTree.prototype.init = function(config){
    this.superCall("init",[config]);
    this._nodeHeight = this.isUndefined(config.nodeHeight) ? this.defaultNodeHeight : config.nodeHeight;
    this._nodeEditEnable = this.isUndefined(config.nodeEditEnable) ? this.defaultNodeEditEnable : config.nodeEditEnable;
    this.addObserver(this.notifyTreeNodeDrag, this, this._dragSimpleNode);
}
modeleditor.class.StructTree.prototype.setNodeHeight = function(nodeHeight){
    this._nodeHeight = nodeHeight;
}
modeleditor.class.StructTree.prototype.getNodeHeight = function(){
    return this._nodeHeight;
}
modeleditor.class.StructTree.prototype.setNodeEditEnable = function(editAble){
    this._nodeEditEnable = editAble;
}
modeleditor.class.StructTree.prototype.getNodeEditEnable = function(){
    return this._nodeEditEnable;
}
modeleditor.class.StructTree.prototype.getNodeUnitOfNodePath = function(nodePath,nodeDeepth){
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

modeleditor.class.StructTree.prototype._dragStructNode = function(sender ,fromPath, toPath){
    if(fromPath && toPath){
        var fromParNodeUnit = this.getNodeUnitOfNodePath(fromPath, fromPath.length - 1);
        var toParNodeUnit = this.getNodeUnitOfNodePath(toPath, toPath.length - 1);
        var fromNodeUnit = this.getNodeUnitOfNodePath(fromPath, fromPath.length);
        var fromIndex = fromPath[fromPath.length - 1];
        var toIndex = toPath[toPath.length - 1];
        if(fromParNodeUnit == toParNodeUnit){
            if(fromIndex > toIndex){
                fromParNodeUnit.removeChildUnitAtIndex(fromIndex, false);
                toParNodeUnit.addChildUnitAtIndex(fromNodeUnit, toIndex);
                this.needReloadTree();
            }else if(fromIndex < toIndex){
                fromParNodeUnit.removeChildUnitAtIndex(fromIndex, false);
                toParNodeUnit.addChildUnitAtIndex(fromNodeUnit, toIndex-1);
                toPath[toPath.length - 1] = toIndex - 1;
                this.needReloadTree();
            }
        }else{
            fromParNodeUnit.removeChildUnitAtIndex(fromIndex, false);
            toParNodeUnit.addChildUnitAtIndex(fromNodeUnit, toIndex);
            this.needReloadTree();
        }
    }
    this.setSelectedNodePath(toPath);
}
modeleditor.class.StructTree.prototype._changedTreeNodeText = function(sender){
    var nodeView = sender.getParent();
    if(nodeView){
        var nodePath = nodeView.getNodePath();
        var nodeUnit = nodeView.getNodeUnit();
        if(nodePath && nodeUnit && nodeUnit.getName() != sender.getText()){
            nodeUnit.setName(sender.getText());
            this.postNotification(this.notifySyncNodeText, [nodePath]);
        }
    }
}
modeleditor.class.StructTree.prototype._expandedTreeNode = function(sender){
    var nodeView = sender.getParent();
    if(nodeView){
        var nodeUnit = nodeView.getNodeUnit();
        if(nodeUnit.getUserProperty("expanded")){
            nodeUnit.setUserProperty("expanded", false);
        }else{
            nodeUnit.setUserProperty("expanded", true);
        }
        this.needReloadTree();
    }
}

modeleditor.class.StructTree.prototype.numberOfNodeInPath = function(treeView, nodePath){
    var node = this.getRoot();
    var nodeDeepth = nodePath.length;
    for(var i=0;i<nodeDeepth;++i){
        if(node){
            node = node.getChildUnitAtIndex(nodePath[i]);
        }else{
            return 0;
        }
    }
    if(node && node.getUserProperty("expanded")){
        var childUnits = node.getChildUnits();
        return childUnits.length;
    }else{
        return 0;
    }
}
modeleditor.class.StructTree.prototype.heightOfNodeInPath = function(treeView, nodePath){
    return this._nodeHeight;
}
modeleditor.class.StructTree.prototype.widthOfNodeInPath = function(treeView, nodePath){
    var nodeView = treeView.getNodeViewOfNodePath(nodePath, nodePath.length);
    if(nodeView){
        return nodeView.getHeight() * (nodePath.length+2) + 10;
    }else{
        return 0;
    }
}
modeleditor.class.StructTree.prototype.contextMenuOfNodeInPath = function(treeView, nodePath){
    if(nodePath.length == 0){
        return [{name:"添加子节点"}];
    }else{
        return [{name:"添加子节点"},{name:"隐藏/可见"},{name:'删除'}];
    }
}
modeleditor.class.StructTree.prototype.viewOfNodeInPath = function(treeView,nodePath) {
    var nodeRoot = this.getRoot();
    if (nodeRoot) {
        var nodeDeepth = nodePath.length;
        for (var i = 0; i < nodeDeepth; ++i) {
            nodeRoot = nodeRoot.getChildUnitAtIndex(nodePath[i]);
        }
        var nodeView = treeView.getReuseNodeViewOfIdentity("treenode");
        if (nodeView == null) {
            nodeView = new modeleditor.class.StructTreeNode({reuseIdentity: "treenode"});
            var nodeEditBox = nodeView.getNodeEditBox();
            nodeEditBox.addObserver(nodeEditBox.notifySyncText, this, this._changedTreeNodeText);
            var expandIcon = nodeView.getNodeExpandIcon();
            expandIcon.addObserver(expandIcon.notifyMouseDown, this, this._expandedTreeNode);
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
        nodeView.setNodeEditEnable(this._nodeEditEnable);
        return nodeView;
    } else {
        return null;
    }
}