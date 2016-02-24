HY.GUI.TreeView = function(config){
    this.init(config);
}
HY.GUI.TreeView.prototype = new HY.GUI.ScrollView();
HY.GUI.TreeView.prototype.defaultWidthFit = true;
HY.GUI.TreeView.prototype.defaultAutoSizeFit = false;
HY.GUI.TreeView.prototype.defaultHeaderViewFloat = false;
HY.GUI.TreeView.prototype.defaultFooterViewFloat = false;
HY.GUI.TreeView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.dataSource != undefined){ this._dataSource = config.dataSource; } else { this._dataSource = null; }
    if(config.root != undefined){ this._root = config.root; } else { this._root = null; }
    if(config.autoSizeFit != undefined){ this._autoSizeFit = config.autoSizeFit; } else { this._autoSizeFit = this.defaultAutoSizeFit; }
    if(config.headerViewFloat != undefined){ this._headerViewFloat = config.headerViewFloat; } else { this._headerViewFloat = this.defaultHeaderViewFloat; }
    if(config.footerViewFloat != undefined){ this._footerViewFloat = config.footerViewFloat; } else { this._footerViewFloat = this.defaultFooterViewFloat; }
    this._reuseNodeViews = [];
    this._nodeViews = [];
    this._nodeRoot = [];
    this._headerView = null;
    this._footerView = null;
}
HY.GUI.TreeView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("contentoffsetychanged",this._mallocNodeViews,this);
    this.addEventListener("heightchanged",this._mallocNodeViews,this);
    this.reloadData();
}
HY.GUI.TreeView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    for(var i=this._nodeViews.length-1;i>=0;--i){
        this._nodeViews[i].setWidth(this.getContentWidth());
    }
}
HY.GUI.TreeView.prototype.getRoot = function(){
    return this._root;
}
HY.GUI.TreeView.prototype.setRoot = function(root){
    this._root = root;
}
HY.GUI.TreeView.prototype.getDataSource = function(){
    return this._dataSource;
}
HY.GUI.TreeView.prototype.setDataSource = function(dataSource){
    this._dataSource = dataSource;
    this.reloadData();
}
HY.GUI.TreeView.prototype.getNodeViewOfNodePath = function(nodePath,nodeDeepth){
    if(nodePath && nodeDeepth <= nodePath.length){
        var node = this._nodeRoot;
        if(nodePath.length > 0){
            for(var i=0;i<nodeDeepth;++i){
                if(node.childNodes && nodePath[i] < node.childNodes.length){
                    node = node.childNodes[nodePath[i]];
                }else{
                    return null;
                }
            }
        }
        if(node){
            return node.view;
        }
    }else{
        return null;
    }
}
HY.GUI.TreeView.prototype.getReuseNodeOfIdentity = function(reuseIdentity){
    if(this._reuseNodeViews[reuseIdentity] && this._reuseNodeViews[reuseIdentity].length > 0){
        return this._reuseNodeViews[reuseIdentity].pop();
    }else{
        return null;
    }
}

HY.GUI.TreeView.prototype.reloadData = function(){
    var dataSource = this._dataSource;
    if(dataSource == null){
        dataSource = this;
    }
    this._recycleAllNodeView();
    if(this._root != null){
        this._nodeRoot = {y:0,height:0,nodePath:null,view:null,childNodes:[]};
        var layoutY = this._treeCreate(dataSource, this._nodeRoot, "", 0);
        this.getContentView().setMinLayoutHeight(layoutY);
        this.getContentView().setHeight(layoutY);
        this._mallocNodeViews();
    }
}
HY.GUI.TreeView.prototype._treeCreate = function(dataSource , node, nodePathStr, layoutY){
    var nodePath = [];
    if(nodePathStr.length > 0){
        var nodePathSplit = nodePathStr.split("-");
        var nodePathLen = nodePathSplit.length;
        for(var i=0;i<nodePathLen;++i){
            nodePath.push(parseInt(nodePathSplit[i]));
        }
    }
    var nodeHeight = dataSource.heightOfNodeInPath(this,nodePath);
    node.y = layoutY;
    node.height = nodeHeight;
    node.nodePath = nodePath;
    layoutY += nodeHeight;
    var childNodeNum = dataSource.numberOfNodeInPath(this,nodePath);
    for(var i=0;i<childNodeNum;++i){
        var childNode = {y:0,height:0,view:null,childNodes:[]};
        var newNodePathStr = "";
        if(nodePathStr == ""){
            newNodePathStr = ""+i;
        }else{
            newNodePathStr = nodePathStr + "-" + i;
        }
        layoutY = this._treeCreate(dataSource, childNode, newNodePathStr, layoutY);
        node.childNodes.push(childNode);
    }
    return layoutY;
}
HY.GUI.TreeView.prototype._setNodeView = function(nodePath, nodeView){
    if(nodePath){
        var node = this._nodeRoot;
        var nodeDeepth = nodePath.length;
        for(var i=0;i<nodeDeepth;++i){
            node = node.childNodes[nodePath[i]];
        }
        node.view = nodeView;
        nodeView.setX(0);
        nodeView.setY(node.y);
        nodeView.setWidth(this.getContentWidth());
        nodeView.setHeight(node.height);
        nodeView.setNodePath(nodePath);
        this._nodeViews.push(nodeView);
        this.getContentView().addChildNodeAtLayer(nodeView,0);
    }
}
HY.GUI.TreeView.prototype._recycleNodeView = function(nodePath){
    if(nodePath){
        var node = this._nodeRoot;
        var nodeDeepth = nodePath.length;
        for(var i=0;i<nodeDeepth;++i) {
            node = node.childNodes[nodePath[i]];
        }
        var reuseIdentity = node.view.getReuseIdentity();
        if(!this._reuseNodeViews[reuseIdentity]){
            this._reuseNodeViews[reuseIdentity] = [];
        }
        this._reuseNodeViews[reuseIdentity].push(node.view);
        node.view.setNodePath(null);
        node.view.removeFromParent(true);
        node.view = null;
    }
}
HY.GUI.TreeView.prototype._recycleAllNodeView = function(){
    for(var i=this._nodeViews.length-1;i>=0;--i){
        var nodeView = this._nodeViews[i];
        this._recycleNodeView(nodeView.getNodePath());
        this._nodeViews.splice(i,1);
    }
}
HY.GUI.TreeView.prototype._mallocNodeViews = function(){
    var dataSource = this._dataSource;
    if(dataSource == null){
        dataSource = this;
    }
    var contentOffsetY = this.getContentOffsetY();
    var contentMaxY = contentOffsetY+this.getHeight();
    for(var i=this._nodeViews.length-1;i>=0;--i){
        var nodeView = this._nodeViews[i];
        if(nodeView.getY() > contentMaxY || (nodeView.getY()+nodeView.getHeight()<contentOffsetY)){
            this._recycleNodeView(nodeView.getNodePath());
            this._nodeViews.splice(i,1);
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
HY.GUI.TreeView.prototype._ergodicNode = function(dataSource,node,offsetY,maxY){
    if(node.y < maxY){
        if(node.y + node.height > offsetY && node.height > 0){
            if(!node.view){
                var nodeView = dataSource.viewOfNodeInPath(this,node.nodePath);
                if(nodeView != null){
                    if(!nodeView.checkEventListener("mousedown",this._nodeMouseDown,this)){
                        nodeView.addEventListener("mousedown",this._nodeMouseDown,this);
                        nodeView.addEventListener("mouseup",this._nodeMouseUp,this);
                        nodeView.addEventListener("mouseover",this._nodeMouseOver,this);
                        nodeView.addEventListener("mouseout",this._nodeMouseOut,this);
                        nodeView.addEventListener("mousemove",this._nodeMouseMove,this);
                        nodeView.addEventListener("dblclick",this._nodeDblClick,this);
                        nodeView.addEventListener("contextmenu",this._nodeContextMenu,this);
                    }
                }
                var contextMenu = dataSource.contextMenuOfNodeInPath(this,node.nodePath);
                if(contextMenu){
                    nodeView.setContextMenu(contextMenu);
                }
                this._setNodeView(node.nodePath,nodeView);
            }
        }
        if(node.childNodes){
            var childNodeLength = node.childNodes.length;
            for(var i=0;i<childNodeLength;++i){
                this._ergodicNode(dataSource,node.childNodes[i],offsetY,maxY);
            }
        }
    }
}

HY.GUI.TreeView.prototype._nodeMouseDown = function(sender,e){
    this.onNodeMouseDown(this, e, sender);
}
HY.GUI.TreeView.prototype._nodeMouseUp = function(sender,e){
    this.onNodeMouseUp(this, e, sender);
}
HY.GUI.TreeView.prototype._nodeMouseOver = function(sender,e){
    this.onNodeMouseOver(this, e, sender);
}
HY.GUI.TreeView.prototype._nodeMouseOut = function(sender,e){
    this.onNodeMouseOut(this, e, sender);
}
HY.GUI.TreeView.prototype._nodeMouseMove = function(sender,e){
    this.onNodeMouseMove(this, e, sender);
}
HY.GUI.TreeView.prototype._nodeDblClick = function(sender,e){
    this.onNodeDblClick(this, e, sender);
}
HY.GUI.TreeView.prototype._nodeContextMenu = function(sender,e,menuCellView){
    this.onNodeContextMenu(this, e, sender, menuCellView);
}

HY.GUI.TreeView.prototype.onNodeMouseDown = function(sender,e,nodeView){
    this.launchEvent("nodemousedown",[this,e,nodeView]);
}
HY.GUI.TreeView.prototype.onNodeMouseUp = function(sender,e,nodeView){
    this.launchEvent("nodemouseup",[this,e,nodeView]);
}
HY.GUI.TreeView.prototype.onNodeMouseOver = function(sender,e,nodeView){
    this.launchEvent("nodemouseover",[this,e,nodeView])
}
HY.GUI.TreeView.prototype.onNodeMouseOut = function(sender,e,nodeView){
    this.launchEvent("nodemouseout",[this,e,nodeView]);
}
HY.GUI.TreeView.prototype.onNodeMouseMove = function(sender,e,nodeView){
    this.launchEvent("nodemousemove",[this,e,nodeView]);
}
HY.GUI.TreeView.prototype.onNodeDblClick = function(sender,e,nodeView){
    this.launchEvent("nodedblclick",[this,e,nodeView]);
}
HY.GUI.TreeView.prototype.onNodeContextMenu = function(sender,e,nodeView,menuCellView){
    this.launchEvent("nodecontextmenu",[sender,e,nodeView,menuCellView]);
}

HY.GUI.TreeView.prototype.numberOfNodeInPath = function(treeView,nodePath){
    return 0;
}
HY.GUI.TreeView.prototype.heightOfNodeInPath = function(treeView,nodePath){
    return 0;
}
HY.GUI.TreeView.prototype.editEnableOfNodeInPath = function(treeView,nodePath){
    return false;
}
HY.GUI.TreeView.prototype.contextMenuOfNodeInPath = function(treeView,nodePath){
    return null;
}
HY.GUI.TreeView.prototype.viewOfNodeInPath = function(treeView,nodePath){
    return null;
}


