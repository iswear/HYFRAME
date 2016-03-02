var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.SimpleTreeView = hy.extend(hy.gui.TreeView);
hy.gui.SimpleTreeView.prototype.notifySyncNodeText = "syncnodetext";
hy.gui.SimpleTreeView.prototype.defaultNodeHeight = 20;
hy.gui.SimpleTreeView.prototype.defaultNodeEditEnable = false;
hy.gui.SimpleTreeView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._nodeHeight = this.isUndefined(config.nodeHeight) ? this.defaultNodeHeight : config.nodeHeight;
    this._nodeEditEnable = this.isUndefined(config.nodeEditEnable) ? this.defaultNodeEditEnable : config.nodeEditEnable;
    this.addObserver(this.notifyTreeNodeDrag, this, this._dragSimpleNode);
}
hy.gui.SimpleTreeView.prototype.setNodeHeight = function(nodeHeight){
    this._nodeHeight = nodeHeight;
}
hy.gui.SimpleTreeView.prototype.getNodeHeight = function(){
    return this._nodeHeight;
}
hy.gui.SimpleTreeView.prototype.setNodeEditEnable = function(editAble){
    this._nodeEditEnable = editAble;
}
hy.gui.SimpleTreeView.prototype.getNodeEditEnable = function(){
    return this._nodeEditEnable;
}
hy.gui.SimpleTreeView.prototype.getNodeDataOfNodePath = function(nodePath,nodeDeepth){
    if(nodePath && nodeDeepth >= 0 && nodeDeepth <= nodePath.length){
        var node = this.getRoot();
        if(node){
            for(var i=0; i<nodeDeepth; ++i){
                if(node.childNodes && nodePath[i] < node.childNodes.length){
                    node = node.childNodes[nodePath[i]];
                }else{
                    return null;
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

hy.gui.SimpleTreeView.prototype._dragSimpleNode = function(sender ,fromPath, toPath){
    if(fromPath && toPath){
        var fromParNodeData = this.getNodeDataOfNodePath(fromPath, fromPath.length - 1);
        var toParNodeData = this.getNodeDataOfNodePath(toPath, toPath.length - 1);
        var fromNodeData = this.getNodeDataOfNodePath(fromPath, fromPath.length);
        var fromIndex = fromPath[fromPath.length - 1];
        var toIndex = toPath[toPath.length - 1];
        if(fromParNodeData == toParNodeData){
            if(fromIndex > toIndex){
                fromParNodeData.childNodes.splice(fromIndex, 1);
                toParNodeData.childNodes.splice(toIndex, 0, fromNodeData);
                this.needReloadTree();
            }else if(fromIndex < toIndex){
                fromParNodeData.childNodes.splice(fromIndex, 1);
                toParNodeData.childNodes.splice(toIndex - 1, 0, fromNodeData);
                toPath[toPath.length - 1] = toIndex - 1;
                this.needReloadTree();
            }
        }else{
            if(!toParNodeData.leaf){
                if(!toParNodeData.childNodes){
                    toParNodeData.childNodes = [];
                }
                fromParNodeData.childNodes.splice(fromIndex, 1);
                toParNodeData.childNodes.splice(toIndex, 0 , fromNodeData);
                this.needReloadTree();
            }
        }
    }
    this.setSelectedNodePath(toPath);
}
hy.gui.SimpleTreeView.prototype._changedTreeNodeText = function(sender){
    var nodeView = sender.getParent();
    if(nodeView){
        var nodePath = nodeView.getNodePath();
        var nodeData = nodeView.getNodeData();
        if(nodePath && nodeData && nodeData.name != sender.getText()){
            nodeData.name = sender.getText();
            this.postNotification(this.notifySyncNodeText, [nodePath]);
        }
    }
}
hy.gui.SimpleTreeView.prototype._expandedTreeNode = function(sender){
    var nodeView = sender.getParent();
    if(nodeView){
        var nodeData = nodeView.getNodeData();
        if(nodeData.expanded){
            nodeData.expanded = false;
        }else{
            nodeData.expanded = true;
        }
        this.needReloadTree();
    }
}

hy.gui.SimpleTreeView.prototype.numberOfNodeInPath = function(treeView, nodePath){
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
hy.gui.SimpleTreeView.prototype.heightOfNodeInPath = function(treeView, nodePath){
    return this._nodeHeight;
}
hy.gui.SimpleTreeView.prototype.widthOfNodeInPath = function(treeView, nodePath){
    var simpleNodeView = treeView.getNodeViewOfNodePath(nodePath, nodePath.length);
    if(simpleNodeView){
        return simpleNodeView.getHeight() * (nodePath.length+2) + 10;
    }else{
        return 0;
    }
}
hy.gui.SimpleTreeView.prototype.contextMenuOfNodeInPath = function(treeView, nodePath){
    return null;
}
hy.gui.SimpleTreeView.prototype.viewOfNodeInPath = function(treeView,nodePath) {
    var nodeRoot = this.getRoot();
    if (nodeRoot) {
        var nodeDeepth = nodePath.length;
        for (var i = 0; i < nodeDeepth; ++i) {
            nodeRoot = nodeRoot.childNodes[nodePath[i]];
        }
        var nodeView = treeView.getReuseNodeViewOfIdentity("simpletreenode");
        if (nodeView == null) {
            nodeView = new hy.gui.SimpleTreeNodeView({reuseIdentity: "simpletreenode"});
            var nodeEditBox = nodeView.getNodeEditBox();
            nodeEditBox.addObserver(nodeEditBox.notifySyncText, this, this._changedTreeNodeText);
            var expandedIcon = nodeView.getNodeExpandIcon();
            expandedIcon.addObserver(expandedIcon.notifyMouseDown, this, this._expandedTreeNode);
        }
        if (this._selNodePath && this._compareNodePath(nodePath, nodePath.length, this._selNodePath, this._selNodePath.length)) {
            nodeView.setSelected(true);
        } else {
            nodeView.setSelected(false);
        }
        nodeView.setNodeData(nodeRoot);
        nodeView.setNodeEditEnable(this._nodeEditEnable);
        return nodeView;
    } else {
        return null;
    }
}