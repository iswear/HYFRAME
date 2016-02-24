HY.GUI.ModelNameTreeNodeView  = function(config){
    this.init(config);
}
HY.GUI.ModelNameTreeNodeView.prototype = new HY.GUI.TreeNodeView();
HY.GUI.ModelNameTreeNodeView.prototype.defaultReuseIdentity = "modelnamenode";
HY.GUI.ModelNameTreeNodeView.prototype.defaultEditEnable = false;
HY.GUI.ModelNameTreeNodeView.prototype.defaultSelected = false;
HY.GUI.ModelNameTreeNodeView.prototype.init = function(config){
    this._nodeIcon = new HY.GUI.ImageView({mouseEnable:false});
    this._nodeTextBox = new HY.GUI.TextBox({mouseEnable:false,editDelay:300,cursor:'default'});
    this._nodeUnit = null;
    this._nodePath = null;
    this.addChildNodeAtLayer(this._nodeIcon,0);
    this.addChildNodeAtLayer(this._nodeTextBox,0);
    this.superCall("initMember",[config]);
    if(config.selected != undefined){ this._selected = config.selected; } else { this._selected = this.defaultSelected; }
    if(config.editEnable != undefined){ this._editEnable = config.editEnable; } else { this._editEnable = this.defaultEditEnable; }
}
HY.GUI.ModelNameTreeNodeView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    this._nodeIcon.setX(0);
    this._nodeIcon.setY(0);
    this._nodeIcon.setWidth(this.getHeight());
    this._nodeIcon.setHeight(this.getHeight());
    this._nodeTextBox.setX(this.getHeight());
    this._nodeTextBox.setY(0);
    this._nodeTextBox.setWidth(this.getWidth()-this._nodeIcon.getWidth());
    this._nodeTextBox.setHeight(this.getHeight());
}
HY.GUI.ModelNameTreeNodeView.prototype.getNodeIcon = function(){
    return this._nodeIcon;
}
HY.GUI.ModelNameTreeNodeView.prototype.getNodeTextBox = function(){
    return this._nodeTextBox;
}
HY.GUI.ModelNameTreeNodeView.prototype.getEditEnable = function(){
    return this._editEnable;
}
HY.GUI.ModelNameTreeNodeView.prototype.setEditEnable = function(editEnable){
    this._editEnable = editEnable;
}
HY.GUI.ModelNameTreeNodeView.prototype.getNodePath = function(){
    return this._nodePath;
}
HY.GUI.ModelNameTreeNodeView.prototype.setNodePath = function(nodePath){
    if(nodePath){
        this._nodePath = nodePath;
    }
}
HY.GUI.ModelNameTreeNodeView.prototype.getNodeUnit = function(){
    return this._nodeUnit;
}
HY.GUI.ModelNameTreeNodeView.prototype.setNodeUnit = function(nodeUnit){
    if(nodeUnit){
        this._nodeTextBox.setText(nodeUnit.getName());
        this.setMinLayoutWidth(this._nodeTextBox.getMinLayoutWidth()+this.getHeight());
        this._nodeUnit = nodeUnit;
    }
}

HY.GUI.ModelNameTreeView = function(config){
    this.init(config);
}
HY.GUI.ModelNameTreeView.prototype = new HY.GUI.TreeView();
HY.GUI.ModelNameTreeView.prototype.defaultNodeHeight = 20;
HY.GUI.ModelNameTreeView.prototype.defaultNodeNormalColor = null;
HY.GUI.ModelNameTreeView.prototype.defaultNodeHoverColor = null;
HY.GUI.ModelNameTreeView.prototype.defaultNodeActiveColor = "#0000ff";
HY.GUI.ModelNameTreeView.prototype.defaultNodeIcon = {
    key:"systemicons",
    src:HY.ImageData.systemIcon,
    srcX:80,
    srcY:0,
    srcWidth:20,
    srcHeight:20
};
HY.GUI.ModelNameTreeView.prototype.init = function(config){
    this._selectedNodePath = null;
    this.superCall("init",[config]);
    if(config.nodeHeight != undefined){ this.setNodeHeight(config.nodeHeight); } else { this.setNodeHeight(this.defaultNodeHeight); }
    if(config.nodeIcon != undefined){ this.setNodeIcon(config.nodeIcon); } else { this.setNodeIcon(this.defaultNodeIcon); }
    if(config.nodeNormalColor != undefined){ this.setNodeNormalColor(config.nodeNormalColor); } else { this.setNodeNormalColor(this.defaultNodeNormalColor); }
    if(config.nodeHoverColor != undefined){ this.setNodeHoverColor(config.nodeHoverColor); } else { this.setNodeHoverColor(this.defaultNodeHoverColor); }
    if(config.nodeActiveColor != undefined){ this.setNodeActiveColor(config.nodeActiveColor); } else { this.setNodeActiveColor(this.defaultNodeActiveColor); }
    this.addEventListener("nodemousedown",this._nodeSelected,this);
}
HY.GUI.ModelNameTreeView.prototype.getSelectedNodePath = function(){
    return this._selectedNodePath;
}
HY.GUI.ModelNameTreeView.prototype.setSelectedNodePath = function(nodePath){
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
            this.onNodeSelected(this, nodePath);
        }
    }
}
HY.GUI.ModelNameTreeView.prototype.getNodeHeight = function(){
    return this._nodeHeight;
}
HY.GUI.ModelNameTreeView.prototype.setNodeHeight = function(nodeHeight){
    this._nodeHeight = nodeHeight;
    this.reloadData();
}
HY.GUI.ModelNameTreeView.prototype.getNodeIcon = function(){
    return this._nodeIcon;
}
HY.GUI.ModelNameTreeView.prototype.setNodeIcon = function(nodeIcon){
    this._nodeIcon = nodeIcon;
}
HY.GUI.ModelNameTreeView.prototype.getNodeNormalColor = function(){
    return this._nodeNormalColor;
}
HY.GUI.ModelNameTreeView.prototype.setNodeNormalColor = function(normalColor){
    this._nodeNormalColor = normalColor;
}
HY.GUI.ModelNameTreeView.prototype.getNodeHoverColor = function(){
    return this._nodeHoverColor;
}
HY.GUI.ModelNameTreeView.prototype.setNodeHoverColor = function(hoverColor){
    this._nodeHoverColor = hoverColor;
}
HY.GUI.ModelNameTreeView.prototype.getNodeActiveColor = function(){
    return this._nodeActiveColor;
}
HY.GUI.ModelNameTreeView.prototype.setNodeActiveColor = function(activeColor){
    this._nodeActiveColor = activeColor;
}
HY.GUI.ModelNameTreeView.prototype.getNodeUnitOfNodePath = function(nodePath,nodeDeepth){
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

HY.GUI.ModelNameTreeView.prototype._compareNodePath = function(srcNodePath,srcDeepth,targetNodePath,targetDeepth){
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
HY.GUI.ModelNameTreeView.prototype._nodeSelected = function(sender, e, nodeView){
    this.setSelectedNodePath(nodeView.getNodePath());
}
HY.GUI.ModelNameTreeView.prototype.onNodeSelected = function(sender, nodePath){
    this.launchEvent("nodeselected",[this, nodePath]);
}
HY.GUI.ModelNameTreeView.prototype.onNodeUnSelected = function(sender, nodePath){
    this.launchEvent("nodeunselected",[this, nodePath]);
}

HY.GUI.ModelNameTreeView.prototype.numberOfNodeInPath = function(treeView, nodePath){
    var node = this.getRoot();
    for(var i= 0,nodeDeepth=nodePath.length;i<nodeDeepth;++i){
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
HY.GUI.ModelNameTreeView.prototype.heightOfNodeInPath = function(treeView, nodePath){
    return this._nodeHeight;
}
HY.GUI.ModelNameTreeView.prototype.contextMenuOfNodeInPath = function(treeView, nodePath){
    return null;
}
HY.GUI.ModelNameTreeView.prototype.viewOfNodeInPath = function(treeView,nodePath){
    var node = this.getRoot();
    for(var i= 0,nodeDeepth = nodePath.length;i<nodeDeepth;++i){
        var childUnits = node.getChildUnits();
        node = childUnits[nodePath[i]];
    }
    var nodeView = treeView.getReuseNodeOfIdentity("modelnamenode");
    if(nodeView == null){
        nodeView = new HY.GUI.ModelNameTreeNodeView({reuseIdentity:"modelnamenode"});
        nodeView.setNormalColor(this._nodeNormalColor);
        nodeView.setHoverColor(this._nodeHoverColor);
        nodeView.setActiveColor(this._nodeActiveColor);
    }
    if(this._selectedNodePath && this._compareNodePath(nodePath,nodePath.length,this._selectedNodePath,this._selectedNodePath.length)){
        nodeView.setSelected(true);
    }else{
        nodeView.setSelected(false);
    }
    nodeView.setEditEnable(this._nodeEditEnable);
    nodeView.setNodeUnit(node);
    nodeView.getNodeIcon().setImage(this._nodeIcon);
    return nodeView;
}
