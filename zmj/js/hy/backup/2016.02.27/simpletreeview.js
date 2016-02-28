var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.SimpleTreeView = hy.extend(hy.gui.TreeView);
hy.gui.SimpleTreeView.prototype.notifySyncNodeText = "syncnodetext";
hy.gui.SimpleTreeView.prototype.notifyTreeNodeSelected = "treenodeselected";
hy.gui.SimpleTreeView.prototype.notifyTreeNodeUnSelected = "treenodeunselected";
hy.gui.SimpleTreeView.prototype.defaultNodeHeight = 20;
hy.gui.SimpleTreeView.prototype.defaultNodeMoveEnable = false;
hy.gui.SimpleTreeView.prototype.defaultNodeEditEnable = false;
hy.gui.SimpleTreeView.prototype.defaultNodeSelectEnable = false;
hy.gui.SimpleTreeView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._nodeHeight = this.isUndefined(config.nodeHeight) ? this.defaultNodeHeight : config.nodeHeight;
    this._nodeEditEnable = this.isUndefined(config.nodeEditEnable) ? this.defaultNodeEditEnable : config.nodeEditEnable;
    this._nodeMoveEnable = this.isUndefined(config.nodeMoveEnable) ? this.defaultNodeMoveEnable : config.nodeMoveEnable;
    this._nodeSelectEnable = this.isUndefined(config.nodeSelectEnable) ? this.defaultNodeSelectEnable : config.nodeSelectEnable;
    this._selNodePath = null;
    this.__moveNodeInit = false;
    this.__moveOverNodePath = null;
    this.__prepareNodeMove = false;
}
hy.gui.SimpleTreeView.prototype.getSelectedNodePath = function(){
    return this._selNodePath;
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
hy.gui.SimpleTreeView.prototype.setNodeMoveEnable = function(moveEnable){
    this._nodeMoveEnable = moveEnable;
}
hy.gui.SimpleTreeView.prototype.getNodeMoveEnable = function(){
    return this._nodeMoveEnable;
}
hy.gui.SimpleTreeView.prototype.setNodeSelectEnable = function(selectEnable){
    this._nodeSelectEnable = selectEnable;
}
hy.gui.SimpleTreeView.prototype.getNodeSelectEnable = function(){
    return this._nodeSelectEnable;
}
hy.gui.SimpleTreeView.prototype.setSelectedNodePath = function(nodePath){
    if(!this._compareNodePath(nodePath, nodePath ? nodePath.length : 0, this._selNodePath, this._selNodePath ? this._selNodePath.length : 0)){
        var oldSelNodePath = this._selNodePath;
        var oldSelNodeView = this.getNodeViewOfNodePath(oldSelNodePath, oldSelNodePath ? oldSelNodePath.length : 0);
        this._selNodePath = nodePath;
        var selNodeView = this.getNodeViewOfNodePath(nodePath, nodePath ? nodePath.length : 0);
        if(oldSelNodeView){
            oldSelNodeView.setSelected(false);
        }
        if(selNodeView){
            selNodeView.setSelected(true);
        }
        if(oldSelNodePath){
            this.postNotification(this.notifyTreeNodeUnSelected, [oldSelNodePath]);
        }
        if(nodePath){
            this.postNotification(this.notifyTreeNodeSelected,[nodePath]);
        }
    }
}
hy.gui.SimpleTreeView.prototype.getSelectedNodePath = function(){
    return this._selNodePath;
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
hy.gui.SimpleTreeView.prototype.moveNodeFromTo = function(fromPath, toPath){
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
                toParNodeData.childNodes.splice(toIndex, 0, fromNodeData);
                fromParNodeData.childNodes.splice(fromIndex, 1);
                toPath[toPath.length - 1] = toPath[toPath.length - 1] - 1;
                this.needReloadTree();
            }
        }else{
            if(!toParNodeData.leaf){
                if(!toParNodeData.childNodes){
                    toParNodeData.childNodes = [];
                }
                toParNodeData.childNodes.splice(toIndex, 0 , fromNodeData);
                fromParNodeData.childNodes.splice(fromIndex, 1);
                this.needReloadTree();
            }
        }
    }
    return toPath;
}

hy.gui.SimpleTreeView.prototype._compareNodePath = function(srcNodePath,srcDeepth,targetNodePath,targetDeepth){
    if(srcNodePath){
        if(targetNodePath){
            if(srcNodePath == targetNodePath) {
                return true;
            }else{
                if(srcDeepth == targetDeepth){
                    for(var i=srcDeepth-1;i>=0;--i){
                        if(srcNodePath[i] != targetNodePath[i]){
                            return false;
                        }
                    }
                    return true;
                }else{
                    return false;
                }
            }
        }else{
            return false;
        }
    }else{
        if(targetNodePath){
            return false;
        }else{
            return true;
        }
    }
}
hy.gui.SimpleTreeView.prototype._checkIsChildNode = function(parentNodePath,parentDeepth,childNodePath,childDeepth){
    if(parentNodePath && childNodePath){
        if(parentNodePath.length == 0){
            return true;
        }else{
            if(childDeepth <= parentDeepth){
                return false;
            }else{
                for(var i=parentDeepth-1;i>=0;--i){
                    if(childNodePath[i] != parentNodePath[i]){
                        return false;
                    }
                }
                return true;
            }
        }
    }else{
        return false;
    }
}
hy.gui.SimpleTreeView.prototype._changedTreeNodeText = function(sender){
    var nodeView = sender.getParent();
    if(nodeView){
        var nodePath = nodeView.getNodePath();
        var nodeData = nodeView.getNodeData();
        if(nodePath && nodeData){
            nodeData.name = sender.getText();
            this.postNotification(this.notifySyncNodeText, [nodePath]);
        }
    }
}
hy.gui.SimpleTreeView.prototype._selectTreeNode = function(sender){
    if(this._nodeSelectEnable){
        this.setSelectedNodePath(sender.getNodePath());
        if(this._nodeMoveEnable){
            this.__moveNodeInit = true;
        }
    }
}
hy.gui.SimpleTreeView.prototype._moveOverTreeNode = function(sender, e){
    if(this.__moveNodeInit){
        this.__moveOverNodePath = sender.getNodePath();
    }
}
hy.gui.SimpleTreeView.prototype._moveLocTreeNode = function(sender, e){
    if(this.__moveNodeInit){
        if(this.__moveOverNodePath
            && this._selNodePath
            && !this._compareNodePath(this.__moveOverNodePath, this.__moveOverNodePath.length, this._selNodePath, this._selNodePath.length)
            && !this._checkIsChildNode(this._selNodePath, this._selNodePath.length, this.__moveOverNodePath, this.__moveOverNodePath.length)){
            var overNodeView = this.getNodeViewOfNodePath(this.__moveOverNodePath, this.__moveOverNodePath.length);
            if(overNodeView){
                var overNodeData = overNodeView.getNodeData();
                var pointOverNodeView = overNodeView.transPointFromAncestorNode({x: e.offsetX, y: e.offsetY}, null);
                if(overNodeData.leaf){
                    if(pointOverNodeView.y < overNodeView.getHeight()/4 && this.__moveOverNodePath.length > 0){
                        overNodeView.setNodeInsertMode(1);
                    }else if(pointOverNodeView.y > 3*overNodeView.getHeight()/4 && this.__moveOverNodePath.length > 0){
                        overNodeView.setNodeInsertMode(2);
                    }else{
                        overNodeView.setNodeInsertMode(0);
                    }
                }else{
                    if(pointOverNodeView.y < overNodeView.getHeight()/4 && this.__moveOverNodePath.length > 0){
                        overNodeView.setNodeInsertMode(1);
                    }else if(pointOverNodeView.y > 3*overNodeView.getHeight()/4 && this.__moveOverNodePath.length > 0){
                        overNodeView.setNodeInsertMode(2);
                    }else{
                        overNodeView.setNodeInsertMode(3);
                    }
                }
            }
        }
    }
}
hy.gui.SimpleTreeView.prototype._moveOutTreeNode = function(sender, e){
    this.__moveOverNodePath = null;
    sender.setNodeInsertMode(0);
}
hy.gui.SimpleTreeView.prototype._moveOkTreeNode = function(sender, e){
    if(this.__moveNodeInit){
        if(this._selNodePath && this.__moveOverNodePath){
            var overNodeView = this.getNodeViewOfNodePath(this.__moveOverNodePath, this.__moveOverNodePath.length);
            var toNodePath = hy.clone(this.__moveOverNodePath);
            if(overNodeView){
                switch (overNodeView.getNodeInsertMode()){
                    case 1:{
                        this.setSelectedNodePath(this.moveNodeFromTo(this._selNodePath, toNodePath));
                        break;
                    }
                    case 2:{
                        toNodePath[toNodePath.length - 1] = toNodePath[toNodePath.length - 1] + 1;
                        this.setSelectedNodePath(this.moveNodeFromTo(this._selNodePath, toNodePath));
                        break;
                    }
                    case 3:{
                        toNodePath.push(0);
                        this.setSelectedNodePath(this.moveNodeFromTo(this._selNodePath, toNodePath));
                        break;
                    }
                    default :{
                        break;
                    }
                }
                overNodeView.setNodeInsertMode(0);
            }
        }
        this.__moveNodeInit = false;
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
            nodeView.addObserver(nodeView.notifyMouseDown, this, this._selectTreeNode);
            nodeView.addObserver(nodeView.notifyMouseOver, this, this._moveOverTreeNode);
            nodeView.addObserver(nodeView.notifyMouseMove, this, this._moveLocTreeNode);
            nodeView.addObserver(nodeView.notifyMouseOut, this, this._moveOutTreeNode);
            nodeView.addObserver(nodeView.notifyMouseUp, this, this._moveOkTreeNode);
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