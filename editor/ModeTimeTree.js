HY.GUI.ModelTimeTreeNodeView  = function(config){
    this.init(config);
}
HY.GUI.ModelTimeTreeNodeView.prototype = new HY.GUI.TreeNodeView();
HY.GUI.ModelTimeTreeNodeView.prototype.defaultReuseIdentity = "modelnamenode";
HY.GUI.ModelTimeTreeNodeView.prototype.defaultEditEnable = false;
HY.GUI.ModelTimeTreeNodeView.prototype.defaultSelected = false;
HY.GUI.ModelTimeTreeNodeView.prototype.defaultBackgroundColor = "#0000ff";
HY.GUI.ModelTimeTreeNodeView.prototype.init = function(config){
    this._nodeTimeLine = new HY.GUI.TimeLine({mouseEnable:true,contextMenu:["添加关键帧","删除关键帧","添加补间动画","删除补间动画"]});
    this._nodeUnit = null;
    this._nodePath = null;
    this.addChildNodeAtLayer(this._nodeTimeLine,0);
    this.superCall("init",[config]);
    if(config.selected != undefined){ this._selected = config.selected; } else { this._selected = this.defaultSelected; }
    if(config.editEnable != undefined){ this._editEnable = config.editEnable; } else { this._editEnable = this.defaultEditEnable; }
    this._nodeTimeLine.addEventListener("contextmenu", this._timelineContextMenu, this);
}
HY.GUI.ModelTimeTreeNodeView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    this._nodeTimeLine.setX(0);
    this._nodeTimeLine.setY(0);
    this._nodeTimeLine.setWidth(this.getWidth());
    this._nodeTimeLine.setHeight(this.getHeight());
}
HY.GUI.ModelTimeTreeNodeView.prototype.getNodePath = function(){
    return this._nodePath;
}
HY.GUI.ModelTimeTreeNodeView.prototype.setNodePath = function(nodePath){
    if(nodePath){
        this._nodePath = nodePath;
    }
}
HY.GUI.ModelTimeTreeNodeView.prototype.getNodeUnit = function(){
    return this._nodeUnit;
}
HY.GUI.ModelTimeTreeNodeView.prototype.setNodeUnit = function(nodeUnit){
    if(nodeUnit){
        this.setMinLayoutWidth(this._nodeTimeLine.getMinLayoutWidth()+this.getHeight());
        this._nodeUnit = nodeUnit;
    }
}
HY.GUI.ModelTimeTreeNodeView.prototype.setSelected = function(selected){
    this.superCall("setSelected",[selected]);
    this._nodeTimeLine.setMouseEnable(selected);
    this._nodeTimeLine.setSelectedFrameIndex(-1);
}
HY.GUI.ModelTimeTreeNodeView.prototype._timelineContextMenu = function(sender, e , menuCellView){
    switch (menuCellView.getCellIndex()){
        case 0:
            this._nodeTimeLine.addKeyFrameAt(this._nodeTimeLine.getSelectedFrameIndex());
            break;
        case 1:
            this._nodeTimeLine.removeKeyFrameAt(this._nodeTimeLine.getSelectedFrameIndex());
            break;
        case 2:
            this._nodeTimeLine.addTweenAniAt(this._nodeTimeLine.getSelectedFrameIndex());
            break;
        case 3:
            this._nodeTimeLine.removeTweenAniAt(this._nodeTimeLine.getSelectedFrameIndex());
            break;
        default :
            break;
    }
}


HY.GUI.ModelTimeTreeView = function(config){
    this.init(config);
}
HY.GUI.ModelTimeTreeView.prototype = new HY.GUI.TreeView();
HY.GUI.ModelTimeTreeView.prototype.defaultNodeHeight = 20;
HY.GUI.ModelTimeTreeView.prototype.defaultNodeNormalColor = null;
HY.GUI.ModelTimeTreeView.prototype.defaultNodeHoverColor = null;
HY.GUI.ModelTimeTreeView.prototype.defaultNodeActiveColor = "#0000ff";
HY.GUI.ModelTimeTreeView.prototype.defaultNodeIcon = {
    key:"systemicons",
    src:HY.ImageData.systemIcon,
    srcX:80,
    srcY:0,
    srcWidth:20,
    srcHeight:20
};
HY.GUI.ModelTimeTreeView.prototype.init = function(config){
    this._selectedNodePath = null;
    this.superCall("init",[config]);
    if(config.nodeHeight != undefined){ this.setNodeHeight(config.nodeHeight); } else { this.setNodeHeight(this.defaultNodeHeight); }
    if(config.nodeNormalColor != undefined){ this.setNodeNormalColor(config.nodeNormalColor); } else { this.setNodeNormalColor(this.defaultNodeNormalColor); }
    if(config.nodeHoverColor != undefined){ this.setNodeHoverColor(config.nodeHoverColor); } else { this.setNodeHoverColor(this.defaultNodeHoverColor); }
    if(config.nodeActiveColor != undefined){ this.setNodeActiveColor(config.nodeActiveColor); } else { this.setNodeActiveColor(this.defaultNodeActiveColor); }
    this.addEventListener("nodemousedown", this._nodeSelected, this);
}
HY.GUI.ModelTimeTreeView.prototype.getSelectedNodePath = function(){
    return this._selectedNodePath;
}
HY.GUI.ModelTimeTreeView.prototype.setSelectedNodePath = function(nodePath){
    if(this._selectedNodePath){
        if(nodePath){
            if(!this._compareNodePath(nodePath,nodePath.length,this._selectedNodePath,this._selectedNodePath.length)){
                var curSelNodeView = this.getNodeViewOfNodePath(this._selectedNodePath);
                var nextSelNodeView = this.getNodeViewOfNodePath(nodePath);
                var curSelNodePath = this._selectedNodePath;
                this._selectedNodePath = nodePath;
                if(curSelNodeView){
                    curSelNodeView.setSelected(false);
                }
                if(nextSelNodeView){
                    nextSelNodeView.setSelected(true);
                }
                this.onNodeSelected(this, nodePath);
                this.onNodeUnSelected(this, curSelNodePath);
            }
        }else{
            var curSelNodeView = this.getNodeViewOfNodePath(this._selectedNodePath,this._selectedNodePath.length);
            var curSelNodePath = this._selectedNodePath;
            this._selectedNodePath = null;
            if(curSelNodeView){
                curSelNodeView.setSelected(false);
            }
            this.onNodeUnSelected(this, curSelNodePath);
        }
    }else{
        if(nodePath){
            var nextSelNodeView = this.getNodeViewOfNodePath(nodePath,nodePath.length);
            this._selectedNodePath = nodePath;
            if(nextSelNodeView){
                nextSelNodeView.setSelected(true);
            }
            this.onNodeSelected(this,nodePath);
        }
    }
}
HY.GUI.ModelTimeTreeView.prototype.getNodeHeight = function(){
    return this._nodeHeight;
}
HY.GUI.ModelTimeTreeView.prototype.setNodeHeight = function(nodeHeight){
    this._nodeHeight = nodeHeight;
    this.reloadData();
}
HY.GUI.ModelTimeTreeView.prototype.getNodeNormalColor = function(){
    return this._nodeNormalColor;
}
HY.GUI.ModelTimeTreeView.prototype.setNodeNormalColor = function(normalColor){
    this._nodeNormalColor = normalColor;
}
HY.GUI.ModelTimeTreeView.prototype.getNodeHoverColor = function(){
    return this._nodeHoverColor;
}
HY.GUI.ModelTimeTreeView.prototype.setNodeHoverColor = function(hoverColor){
    this._nodeHoverColor = hoverColor;
}
HY.GUI.ModelTimeTreeView.prototype.getNodeActiveColor = function(){
    return this._nodeActiveColor;
}
HY.GUI.ModelTimeTreeView.prototype.setNodeActiveColor = function(activeColor){
    this._nodeActiveColor = activeColor;
}
HY.GUI.ModelTimeTreeView.prototype.getNodeUnitOfNodePath = function(nodePath,nodeDeepth){
    if(nodePath && nodeDeepth >= 0 && nodeDeepth <= nodePath.length){
        var node = this.getRoot();
        for(var i=0; i<nodeDeepth; ++i){
            var childUnits = node.getChildUnits();
            if(childUnits && nodePath[i] < childUnits.length){
                node = childUnits[nodePath[i]];
            }else{
                return null;
            }
        }
        return node;
    }else{
        return null;
    }
}

HY.GUI.ModelTimeTreeView.prototype._compareNodePath = function(srcNodePath,srcDeepth,targetNodePath,targetDeepth){
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
HY.GUI.ModelTimeTreeView.prototype._nodeSelected = function(sender, e, nodeView){
    this.setSelectedNodePath(nodeView.getNodePath());
}
HY.GUI.ModelTimeTreeView.prototype.onNodeSelected = function(sender, nodePath){
    this.launchEvent("nodeselected",[this, nodePath]);
}
HY.GUI.ModelTimeTreeView.prototype.onNodeUnSelected = function(sender, nodePath){
    this.launchEvent("nodeunselected",[this, nodePath]);
}

HY.GUI.ModelTimeTreeView.prototype.numberOfNodeInPath = function(treeView, nodePath){
    var node = this.getRoot();
    var nodeDeepth = nodePath.length;
    for(var i=0;i<nodeDeepth;++i){
        var childUnits = node.getChildUnits();
        node = childUnits[nodePath[i]];
    }
    if(!node){
        return 0;
    }else{
        var childUnits = node.getChildUnits();
        if(childUnits){
            return childUnits.length;
        }else{
            return 0;
        }
    }
}
HY.GUI.ModelTimeTreeView.prototype.heightOfNodeInPath = function(treeView, nodePath){
    return this._nodeHeight;
}
HY.GUI.ModelTimeTreeView.prototype.contextMenuOfNodeInPath = function(treeView, nodePath){
    if(nodePath != null && nodePath.length > 0){
        return ["添加子部件"];
    }else{
        return ["添加子部件","删除此部件"];
    }
}
HY.GUI.ModelTimeTreeView.prototype.viewOfNodeInPath = function(treeView,nodePath){
    var node = this.getRoot();
    var nodeDeepth = nodePath.length;
    for(var i=0;i<nodeDeepth;++i){
        var childUnits = node.getChildUnits();
        node = childUnits[nodePath[i]];
    }
    var nodeView = treeView.getReuseNodeOfIdentity("modelnamenode");
    if(nodeView == null){
        nodeView = new HY.GUI.ModelTimeTreeNodeView({reuseIdentity:"modelnamenode"});
        nodeView.setNormalColor(this._nodeNormalColor);
        nodeView.setHoverColor(this._nodeHoverColor);
        nodeView.setActiveColor(this._nodeActiveColor);
    }
    if(this._selectedNodePath && this._compareNodePath(nodePath,nodePath.length,this._selectedNodePath,this._selectedNodePath.length)){
        nodeView.setSelected(true);
    }else{
        nodeView.setSelected(false);
    }
    nodeView.setNodeUnit(node);
    return nodeView;
}