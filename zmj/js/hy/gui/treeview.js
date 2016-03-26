var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.TreeView = hy.extend(hy.gui.ScrollView);
hy.gui.TreeView.prototype.notifyTreeNodeMouseDown = "treenodemosuedown";
hy.gui.TreeView.prototype.notifyTreeNodeMouseUp = "treenodemouseup";
hy.gui.TreeView.prototype.notifyTreeNodeMouseOver = "treenodemouseover";
hy.gui.TreeView.prototype.notifyTreeNodeMouseOut = "treenodemouseout";
hy.gui.TreeView.prototype.notifyTreeNodeMouseMove = "treenodemousemove";
hy.gui.TreeView.prototype.notifyTreeNodeClick = "treenodeclick";
hy.gui.TreeView.prototype.notifyTreeNodeDblclick = "treenodedblclick";
hy.gui.TreeView.prototype.notifyTreeNodeContextMenu = "treenodecontextmenu";
hy.gui.TreeView.prototype.notifyTreeNodeDrag = "treenodedrag";
hy.gui.TreeView.prototype.notifyTreeNodeSelected = "treenodeselected";
hy.gui.TreeView.prototype.notifyTreeNodeUnSelected = "treenodeunselected";
hy.gui.TreeView.prototype.defaultWidthFit = true;
hy.gui.TreeView.prototype.defaultHeightFit = false;
hy.gui.TreeView.prototype.defaultHeaderViewFloat = false;
hy.gui.TreeView.prototype.defaultFooterViewFloat = false;
hy.gui.TreeView.prototype.defaultNodeDragEnable = false;
hy.gui.TreeView.prototype.defaultNodeSelectEnable = false;
hy.gui.TreeView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._dataSource = this.isUndefined(config.dataSource) ? null : config.dataSource;
    this._headerView = this.isUndefined(config.headerView) ? null : config.headerView;
    this._headerViewFloat = this.isUndefined(config.headerViewFloat) ? this.defaultHeaderViewFloat : config.headerViewFloat;
    this._footerView = this.isUndefined(config.footerView) ? null : config.footerView;
    this._footerViewFloat = this.isUndefined(config.footerViewFloat) ? this.defaultFooterViewFloat : config.footerViewFloat;
    this._root = this.isUndefined(config.root) ? null : config.root;
    this._nodeDragEnable = this.isUndefined(config.nodeDragEnable) ? this.defaultNodeDragEnable : config.nodeDragEnable;
    this._nodeSelectEnable = this.isUndefined(config.nodeSelectEnable) ? this.defaultNodeSelectEnable : config.nodeSelectEnable;
    this._reuseNodeViews = {};
    this._nodeViews = [];
    this._nodeInfos = {};/*{y:,height:,view:,childNodes:}*/
    this._selNodePath = null;
    this.__dragNodeInit = false;
    this.__dragOverNodePath = null;
    this.__needReloadTree = false;
    this.__needMallocTreeView = false;
    var contentView = this.getContentView();
    if(this._headerView){
        contentView.addChildNodeAtLayer(this._headerView, 0);
    }
    if(this._footerView){
        contentView.addChildNodeAtLayer(this._footerView, 0);
    }
    contentView.addObserver(this.notifySyncY, this, this.needMallocTreeView);
    contentView.addObserver(this.notifySyncHeight, this, this.needMallocTreeView);
    this.addObserver(this.notifyEnterFrame, this, this._reloadTree);
    this.addObserver(this.notifyEnterFrame, this, this._mallocTreeView);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutTreeNodeViews);
    this.needReloadTree();
}
hy.gui.TreeView.prototype.setRoot = function(root){
    this._root = root;
}
hy.gui.TreeView.prototype.getRoot = function(){
    return this._root;
}
hy.gui.TreeView.prototype.setDataSource = function(dataSource){
    this._dataSource = dataSource;
}
hy.gui.TreeView.prototype.getDataSource = function(){
    return this._dataSource;
}
hy.gui.TreeView.prototype.getNodeViewOfNodePath = function(nodePath,nodeDeepth){
    if(nodePath && nodeDeepth <= nodePath.length){
        var node = this._nodeInfos;
        for(var i=0;i<nodeDeepth;++i){
            if(node.childNodes && nodePath[i] < node.childNodes.length){
                node = node.childNodes[nodePath[i]];
            }else{
                return null;
            }
        }
        if(node){
            return node.view;
        }
    }else{
        return null;
    }
}
hy.gui.TreeView.prototype.getReuseNodeViewOfIdentity = function(reuseIdentity){
    if(this._reuseNodeViews[reuseIdentity] && this._reuseNodeViews[reuseIdentity].length > 0){
        return this._reuseNodeViews[reuseIdentity].pop();
    }else{
        return null;
    }
}
hy.gui.TreeView.prototype.setNodeDragEnable = function(moveEnable){
    this._nodeDragEnable = moveEnable;
}
hy.gui.TreeView.prototype.getNodeDragEnable = function(){
    return this._nodeDragEnable;
}
hy.gui.TreeView.prototype.setNodeSelectEnable = function(selectEnable){
    this._nodeSelectEnable = selectEnable;
}
hy.gui.TreeView.prototype.getNodeSelectEnable = function(){
    return this._nodeSelectEnable;
}
hy.gui.TreeView.prototype.setSelectedNodePath = function(nodePath){
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
hy.gui.TreeView.prototype.getSelectedNodePath = function(){
    return this._selNodePath;
}

hy.gui.TreeView.prototype.needReloadTree = function(){
    this.__needReloadTree = true;
}
hy.gui.TreeView.prototype.needMallocTreeView = function(){
    this.__needMallocTreeView = true;
}
hy.gui.TreeView.prototype._reloadTree = function(){
    if(this.__needReloadTree){
        this.__needReloadTree = false;
        if(this._root){
            var dataSource = this._dataSource;
            if(dataSource == null){
                dataSource = this;
            }
            this._recycleAllNodeView();
            var starty = 0;
            if(this._headerView){
                starty = this._headerView.getHeight();
            }
            this._nodeInfos = {y:0,height:0,nodePath:[],view:null,childNodes:[]};
            var layoutY = this._reloadTreeNode(dataSource, this._nodeInfos, "", starty);
            this.setContentHeight(layoutY);
            this._mallocTreeView();
        }
    }
}
hy.gui.TreeView.prototype._reloadTreeNode = function(dataSource , nodeInfo, nodePathStr, layoutY){
    var nodePath = [];
    if(nodePathStr.length > 0){
        var nodePathSplit = nodePathStr.split("-");
        var nodePathLen = nodePathSplit.length;
        for(var i=0;i<nodePathLen;++i){
            nodePath.push(parseInt(nodePathSplit[i]));
        }
    }
    var nodeHeight = dataSource.heightOfNodeInPath(this,nodePath);
    nodeInfo.y = layoutY;
    nodeInfo.height = nodeHeight;
    nodeInfo.nodePath = nodePath;
    layoutY += nodeHeight;
    var childNodeNum = dataSource.numberOfNodeInPath(this,nodePath);
    for(var i=0;i<childNodeNum;++i){
        var childNode = {y:0,height:0,nodePath:null,view:null,childNodes:[]};
        var nextNodePathStr = "";
        if(nodePathStr == ""){
            nextNodePathStr = ""+i;
        }else{
            nextNodePathStr = nodePathStr + "-" + i;
        }
        layoutY = this._reloadTreeNode(dataSource, childNode, nextNodePathStr, layoutY);
        nodeInfo.childNodes.push(childNode);
    }
    this.needMallocTreeView();
    return layoutY;
}
hy.gui.TreeView.prototype._mallocTreeView = function(){
    if(this.__needMallocTreeView){
        this.__needMallocTreeView = false;
        var dataSource = this._dataSource;
        if(dataSource == null){
            dataSource = this;
        }
        var contentOffsetY = this.getContentOffsetY();
        var contentMaxY = contentOffsetY+this.getHeight();
        for(var i=this._nodeViews.length-1;i>=0;--i){
            var nodeView = this._nodeViews[i];
            if(nodeView.getY() >= contentMaxY || (nodeView.getY()+nodeView.getHeight() <= contentOffsetY)){
                var reuseIdentity = nodeView.getReuseIdentity();
                if(!this._reuseNodeViews[reuseIdentity]){
                    this._reuseNodeViews[reuseIdentity] = [];
                }
                this._reuseNodeViews[reuseIdentity].push(nodeView);
                var nodePath = nodeView.getNodePath();
                var nodeInfo = this._nodeInfos;
                for(var j=0, nodeDeepth = nodePath.length;j<nodeDeepth;++j) {
                    nodeInfo = nodeInfo.childNodes[nodePath[j]];
                }
                nodeInfo.view = null;
                nodeView.setNodePath(null);
                nodeView.removeFromParent(false);
                nodeView.setSelected(false);
                this._nodeViews.splice(i, 1);
            }
        }
        var maxContentWidth =this._mallocTreeNodeViews(dataSource,this._nodeInfos,contentOffsetY,contentMaxY,0);
        this.setContentWidth(maxContentWidth);
    }
}
hy.gui.TreeView.prototype._mallocTreeNodeViews = function(dataSource, nodeInfo ,offsetY , maxY, maxContentWidth){
    if(nodeInfo.y < maxY){
        if(nodeInfo.y + nodeInfo.height > offsetY && nodeInfo.height > 0){
            if(!nodeInfo.view){
                var nodeView = dataSource.viewOfNodeInPath(this,nodeInfo.nodePath);
                var contextMenu = dataSource.contextMenuOfNodeInPath(this,nodeInfo.nodePath);
                nodeView.setContextMenu(contextMenu);
                nodeView.setX(0);
                nodeView.setY(nodeInfo.y);
                nodeView.setWidth(this.getContentWidth());
                nodeView.setHeight(nodeInfo.height);
                nodeView.setNodePath(nodeInfo.nodePath);
                nodeView.addObserver(this.notifyMouseDown, this, this._mouseDownTreeNode);
                nodeView.addObserver(this.notifyMouseUp, this, this._mouseUpTreeNode);
                nodeView.addObserver(this.notifyMouseOver, this, this._mouseOverTreeNode);
                nodeView.addObserver(this.notifyMouseOut, this, this._mouseOutTreeNode);
                nodeView.addObserver(this.notifyMouseMove, this, this._mouseMoveTreeNode);
                nodeView.addObserver(this.notifyClick, this, this._clickTreeNode);
                nodeView.addObserver(this.notifyDblClick, this, this._dblclickTreeNode);
                nodeView.addObserver(this.notifyContextMenu, this, this._contextMenuTreeNode);
                this._nodeViews.push(nodeView);
                this.getContentView().addChildNodeAtLayer(nodeView, 0);
                nodeInfo.view = nodeView;
            }
            var nodeWidth = this.widthOfNodeInPath(this, nodeInfo.nodePath);
            if(nodeWidth > maxContentWidth){
                maxContentWidth = nodeWidth;
            }
        }
        if(nodeInfo.childNodes){
            var childNodeLength = nodeInfo.childNodes.length;
            for(var i=0;i<childNodeLength;++i){
                maxContentWidth = this._mallocTreeNodeViews(dataSource,nodeInfo.childNodes[i],offsetY,maxY,maxContentWidth);
            }
        }
    }
    return maxContentWidth;
}
hy.gui.TreeView.prototype._recycleAllNodeView = function(){
    for(var i=this._nodeViews.length-1;i>=0;--i){
        var nodeView = this._nodeViews[i];
        var reuseIdentity = nodeView.getReuseIdentity();
        if(!this._reuseNodeViews[reuseIdentity]){
            this._reuseNodeViews[reuseIdentity] = [];
        }
        this._reuseNodeViews[reuseIdentity].push(nodeView);
        var nodePath = nodeView.getNodePath();
        var nodeInfo = this._nodeInfos;
        for(var j= 0,nodeDeepth=nodePath.length ; j < nodeDeepth ; ++j){
            nodeInfo = nodeInfo.childNodes[nodePath[j]];
        }
        nodeInfo.view = null;
        nodeView.setNodePath(null);
        nodeView.removeFromParent(false);
        nodeView.setSelected(false);
        this._nodeViews.splice(i,1);
    }
}
hy.gui.TreeView.prototype._layoutTreeNodeViews = function(){
    var contentWidth = this.getContentWidth();
    for(var i= 0, len = this._nodeViews.length ; i < len ; ++i){
        this._nodeViews[i].setWidth(contentWidth);
    }
}

hy.gui.TreeView.prototype._compareNodePath = function(srcNodePath,srcDeepth,targetNodePath,targetDeepth){
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
hy.gui.TreeView.prototype._checkIsChildNode = function(parentNodePath,parentDeepth,childNodePath,childDeepth){
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
hy.gui.TreeView.prototype._mouseDownTreeNode = function(sender, e){
    if(this._nodeSelectEnable){
        this.setSelectedNodePath(sender.getNodePath());
        if(this._nodeDragEnable){
            this.__dragNodeInit = true;
        }
    }
    this.postNotification(this.notifyTreeNodeMouseDown, [sender, e]);
}
hy.gui.TreeView.prototype._mouseUpTreeNode = function(sender, e){
    if(this.__dragNodeInit){
        if(this._selNodePath && this.__dragOverNodePath){
            var overNodeView = this.getNodeViewOfNodePath(this.__dragOverNodePath, this.__dragOverNodePath.length);
            var toNodePath = hy.clone(this.__dragOverNodePath);
            if(overNodeView){
                switch (overNodeView.getNodeInsertMode()){
                    case 1:{
                        this.postNotification(this.notifyTreeNodeDrag, [this._selNodePath, toNodePath]);
                        break;
                    }
                    case 2:{
                        toNodePath[toNodePath.length - 1] = toNodePath[toNodePath.length - 1] + 1;
                        this.postNotification(this.notifyTreeNodeDrag, [this._selNodePath, toNodePath]);
                        break;
                    }
                    case 3:{
                        toNodePath.push(0);
                        this.postNotification(this.notifyTreeNodeDrag, [this._selNodePath, toNodePath]);
                        break;
                    }
                    default :{
                        break;
                    }
                }
                overNodeView.setNodeInsertMode(0);
            }
        }
        this.__dragNodeInit = false;
    }
    this.postNotification(this.notifyTreeNodeMouseUp, [sender, e]);
}
hy.gui.TreeView.prototype._mouseOverTreeNode = function(sender, e){
    if(this.__dragNodeInit){
        this.__dragOverNodePath = sender.getNodePath();
    }
    this.postNotification(this.notifyTreeNodeMouseOver, [sender ,e]);
}
hy.gui.TreeView.prototype._mouseOutTreeNode = function(sender, e){
    this.__dragOverNodePath = null;
    sender.setNodeInsertMode(0);
    this.postNotification(this.notifyTreeNodeMouseOut, [sender, e]);
}
hy.gui.TreeView.prototype._mouseMoveTreeNode = function(sender, e){
    if(this.__dragNodeInit){
        if(this.__dragOverNodePath
            && this._selNodePath
            && !this._compareNodePath(this.__dragOverNodePath, this.__dragOverNodePath.length, this._selNodePath, this._selNodePath.length)
            && !this._checkIsChildNode(this._selNodePath, this._selNodePath.length, this.__dragOverNodePath, this.__dragOverNodePath.length)){
            var overNodeView = this.getNodeViewOfNodePath(this.__dragOverNodePath, this.__dragOverNodePath.length);
            if(overNodeView){
                var overNodeData = overNodeView.getNodeData();
                var pointOverNodeView = overNodeView.transPointFromAncestorNode({x: e.offsetX, y: e.offsetY}, null);
                if(overNodeData.leaf){
                    if(pointOverNodeView.y < overNodeView.getHeight()/4 && this.__dragOverNodePath.length > 0){
                        overNodeView.setNodeInsertMode(1);
                    }else if(pointOverNodeView.y > 3*overNodeView.getHeight()/4 && this.__dragOverNodePath.length > 0){
                        overNodeView.setNodeInsertMode(2);
                    }else{
                        overNodeView.setNodeInsertMode(0);
                    }
                }else{
                    if(pointOverNodeView.y < overNodeView.getHeight()/4 && this.__dragOverNodePath.length > 0){
                        overNodeView.setNodeInsertMode(1);
                    }else if(pointOverNodeView.y > 3*overNodeView.getHeight()/4 && this.__dragOverNodePath.length > 0){
                        overNodeView.setNodeInsertMode(2);
                    }else{
                        overNodeView.setNodeInsertMode(3);
                    }
                }
            }
        }
    }
    this.postNotification(this.notifyTreeNodeMouseMove, [sender, e]);
}
hy.gui.TreeView.prototype._clickTreeNode = function(sender, e){
    this.postNotification(this.notifyTreeNodeClick, [sender, e]);
}
hy.gui.TreeView.prototype._dblclickTreeNode = function(sender, e){
    this.postNotification(this.notifyTreeNodeDblclick, [sender, e]);
}
hy.gui.TreeView.prototype._contextMenuTreeNode = function(sender, e){
    this.postNotification(this.notifyTreeNodeContextMenu, [sender, e]);
}

hy.gui.TreeView.prototype.numberOfNodeInPath = function(treeView,nodePath){
    return 0;
}
hy.gui.TreeView.prototype.widthOfNodeInPath = function(treeView, nodePath){
    return 0;
}
hy.gui.TreeView.prototype.heightOfNodeInPath = function(treeView,nodePath){
    return 0;
}
hy.gui.TreeView.prototype.contextMenuOfNodeInPath = function(treeView,nodePath){
    return null;
}
hy.gui.TreeView.prototype.viewOfNodeInPath = function(treeView,nodePath){
    return null;
}