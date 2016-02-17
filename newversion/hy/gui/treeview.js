var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.TreeView = hy.extend(hy.gui.ScrollView);
hy.gui.TreeView.prototype = new HY.GUI.View();
hy.gui.TreeView.prototype.defaultWidthFit = true;
hy.gui.TreeView.prototype.defaultHeightFit = true;
hy.gui.TreeView.prototype.defaultHeaderViewFloat = false;
hy.gui.TreeView.prototype.defaultFooterViewFloat = false;
hy.gui.TreeView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._dataSource = this.isUndefined(config.dataSource) ? null : config.dataSource;
    this._headerView = this.isUndefined(config.headerView) ? null : config.headerView;
    this._headerViewFloat = this.isUndefined(config.headerViewFloat) ? this.defaultHeaderViewFloat : config.headerViewFloat;
    this._footerView = this.isUndefined(config.footerView) ? null : config.footerView;
    this._footerViewFloat = this.isUndefined(config.footerViewFloat) ? this.defaultFooterViewFloat : config.footerViewFloat;
    this._reuseNodeViews = {};
    this._nodeViews = [];
    this._nodeInfos = {};/*{y:,height:,view:,childNodes:}*/
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
hy.gui.TreeView.prototype.getReuseNodeOfIdentity = function(reuseIdentity){
    if(this._reuseNodeViews[reuseIdentity] && this._reuseNodeViews[reuseIdentity].length > 0){
        return this._reuseNodeViews[reuseIdentity].pop();
    }else{
        return null;
    }
}

hy.gui.TreeView.prototype.reloadTree = function(){
    var dataSource = this._dataSource;
    if(dataSource == null){
        dataSource = this;
    }
    this._recycleAllNodeView();
    this._nodeInfos = {y:0,height:0,nodePath:null,view:null,childNodes:[]};
    var layoutY = this._reloadTreeNode(dataSource, this._nodeRoot, "", 0);
    //this.getContentView().setMinLayoutHeight(layoutY);
    //this.getContentView().setHeight(layoutY);
    //this._mallocTreeView();
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
    return layoutY;
}
hy.gui.TreeView.prototype._mallocTreeView = function(){
    var dataSource = this._dataSource;
    if(dataSource == null){
        dataSource = this;
    }
    var contentOffsetY = this.getContentOffsetY();
    var contentMaxY = contentOffsetY+this.getHeight();
    for(var i=this._nodeViews.length-1;i>=0;--i){
        var nodeView = this._nodeViews[i];
        if(nodeView.getY() > contentMaxY || (nodeView.getY()+nodeView.getHeight()<contentOffsetY)){
            var reuseIdentity = nodeView.getReuseIdentity();
            if(!this._reuseNodeViews[reuseIdentity]){
                this._reuseNodeViews[reuseIdentity] = [];
            }
            this._reuseNodeViews[reuseIdentity].push(nodeView);
            var nodePath = nodeView.getNodePath();
            var nodeInfo = this._nodeInfos;
            var nodeDeepth = nodePath.length;
            for(var i=0;i<nodeDeepth;++i) {
                nodeInfo = nodeInfo.childNodes[nodePath[i]];
            }
            nodeInfo.view = null;
            nodeView.setNodePath(null);
            nodeView.removeFromParent(false);
            nodeView.setSelected(false);
            this._nodeViews.splice(i, 1);
        }
    }
    this._ergodicNode(dataSource,this._nodeRoot,contentOffsetY,contentMaxY);
    var minLayoutWidth = 0;
    for(var i=this._nodeViews.length-1;i>=0;--i){
        var nodeView = this._nodeViews[i];
        if(minLayoutWidth < nodeView.getMinLayoutWidth()){
            minLayoutWidth = nodeView.getMinLayoutWidth();
        }
    }
    this.getContentView().setMinLayoutWidth(minLayoutWidth);
    this.getContentView().setWidth(minLayoutWidth);
}
hy.gui.TreeView.prototype._mallocTreeNodeViews = function(dataSource, nodeInfo ,offsetY , maxY){
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
                this._nodeViews.push(nodeView);
                this.getContentView().addChildNodeAtLayer(cellView, 0);
                nodeInfo.view = nodeView;
            }
        }
        if(nodeInfo.childNodes){
            var childNodeLength = nodeInfo.childNodes.length;
            for(var i=0;i<childNodeLength;++i){
                this._mallocTreeNodeViews(dataSource,nodeInfo.childNodes[i],offsetY,maxY);
            }
        }
    }
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
        var node = this._nodeRoot;
        for(var i= 0,nodeDeepth=nodePath.length ; i < nodeDeepth ; ++i){
            node = node.childNodes[nodePath[i]];
        }
        node.view = null;
        nodeView.setNodePath(null);
        nodeView.removeFromParent(false);
        nodeView.setSelected(false);
        this._nodeViews.splice(i,1);
    }
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