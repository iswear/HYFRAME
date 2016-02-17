var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.SimpleTreeView = hy.extend(hy.gui.TreeView);
hy.gui.SimpleTreeView.prototype.defaultNodeHeight = 20;
hy.gui.SimpleTreeView.prototype.defaultNodeMoveEnable = true;
hy.gui.SimpleTreeView.prototype.defaultNodeEditEnable = false;
hy.gui.SimpleTreeView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._nodeHeight = this.isUndefined(config.nodeHeight) ? this.defaultNodeHeight : config.nodeHeight;
    this._nodeEditEnable = this.isUndefined(config.nodeEditEnable) ? this.defaultNodeEditEnable : config.nodeEditEnable;
    this._nodeMoveEnable = this.isUndefined(config.nodeMoveEnable) ? this.defaultNodeMoveEnable : config.nodeEditEnable;
    this._selNodePath = null;
    this._mouseOverNodePath = null;
    this.__prepareNodeMove = false;
}
hy.gui.SimpleTreeView.prototype.setSelectedNodePath = function(nodePath){
    if(this._selNodePath){
        if(nodePath){
            if(!this._compareNodePath(nodePath,nodePath.length,this._selNodePath,this._selNodePath.length)){
                var tempNodePath = this._selNodePath;
                this._selNodePath = nodePath;
                if(tempNodePath){
                    var selectedNodeView = this.getNodeViewOfNodePath(tempNodePath,tempNodePath.length);
                    if(selectedNodeView){
                        selectedNodeView.setSelected(false);
                    }
                }
            }
        }else{
            this._selNodePath = nodePath;
        }
    }else{
        this._selNodePath = nodePath;
    }
    if(this._selNodePath){
        var selectedNodeView = this.getNodeViewOfNodePath(this._selNodePath,this._selNodePath.length);
        if(selectedNodeView){
            selectedNodeView.setSelected(true);
        }
    }
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

hy.gui.SimpleTreeView.prototype._compareNodePath = function(srcNodePath,srcDeepth,targetNodePath,targetDeepth){
    if(srcNodePath && targetNodePath) {
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
    return 300;
}
hy.gui.SimpleTreeView.prototype.contextMenuOfNodeInPath = function(treeView, nodePath){
    return null;
}
hy.gui.SimpleTreeView.prototype.viewOfNodeInPath = function(treeView,nodePath) {
    var node = this.getRoot();
    if (node) {
        var nodeDeepth = nodePath.length;
        for (var i = 0; i < nodeDeepth; ++i) {
            node = node.childNodes[nodePath[i]];
        }
        var nodeView = treeView.getReuseNodeViewOfIdentity("nodeview");
        if (nodeView == null) {
            nodeView = new hy.gui.SimpleTreeNodeView({reuseIdentity: "nodeview"});
        }
        if (this._selNodePath && this._compareNodePath(nodePath, nodePath.length, this._selNodePath, this._selNodePath.length)) {
            nodeView.setSelected(true);
        } else {
            nodeView.setSelected(false);
        }
        nodeView.setNodeEditEnable(this._nodeEditEnable);
        nodeView.setNodeData(node);
        if (node.leaf) {
            nodeView.getNodeIcon().setImage(this._leafNodeIcon);
        } else if (node.expanded) {
            nodeView.getNodeIcon().setImage(this._expandedNodeIcon);
        } else {
            nodeView.getNodeIcon().setImage(this._unExpandedNodeIcon);
        }
        return nodeView;
    } else {
        return null;
    }
}