/**
 * Created by Administrator on 2015/11/8.
 */
/*
 nodeData:{
 id:,
 name:,
 leaf:,
 expanded:,
 childNodes:
 }
 */
HY.GUI.SimpleTreeNodeView  = function(config){
    this.init(config);
}
HY.GUI.SimpleTreeNodeView.prototype = new HY.GUI.TreeNodeView();
HY.GUI.SimpleTreeNodeView.prototype.defaultReuseIdentity = "nodeview";
HY.GUI.SimpleTreeNodeView.prototype.defaultEditEnable = false;
HY.GUI.SimpleTreeNodeView.prototype.defaultSelected = false;
HY.GUI.SimpleTreeNodeView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.selected != undefined){ this._selected = config.selected; } else { this._selected = this.defaultSelected; }
    if(config.editEnable != undefined){ this._editEnable = config.editEnable; } else { this._editEnable = this.defaultEditEnable; }

    this._nodeIcon = new HY.GUI.ImageView({mouseEnable:false});
    this._nodeTextBox = new HY.GUI.TextBox({mouseEnable:false,editEnable:true,cursor:'default'});
    this._nodeExpandIcon = new HY.GUI.View({mouseEnable:true,cacheEnable:false});
    this._nodeData = null;
    this._nodePath = null;
    this._nodeInsertMode = 0;
}
HY.GUI.SimpleTreeNodeView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this._nodeExpandIcon.addEventListener("paint",this._nodeExpandIconPaint,this);
    this.addEventListener("paint",this._nodeInsertModePaint,this);
    this.addChildNodeAtLayer(this._nodeIcon,0);
    this.addChildNodeAtLayer(this._nodeTextBox,0);
    this.addChildNodeAtLayer(this._nodeExpandIcon,0);
}
HY.GUI.SimpleTreeNodeView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
}
HY.GUI.SimpleTreeNodeView.prototype.getNodeIcon = function(){
    return this._nodeIcon;
}
HY.GUI.SimpleTreeNodeView.prototype.getNodeTextBox = function(){
    return this._nodeTextBox;
}
HY.GUI.SimpleTreeNodeView.prototype.getNodeExpandIcon = function(){
    return this._nodeExpandIcon;
}
HY.GUI.SimpleTreeNodeView.prototype.getEditEnable = function(){
    return this._editEnable;
}
HY.GUI.SimpleTreeNodeView.prototype.setEditEnable = function(editEnable){
    this._editEnable = editEnable;
}
HY.GUI.SimpleTreeNodeView.prototype.getNodePath = function(){
    return this._nodePath;
}
HY.GUI.SimpleTreeNodeView.prototype.setNodePath = function(nodePath){
    if(nodePath){
        var nodeDeepth = nodePath.length;
        this.setMinLayoutWidth(this._nodeTextBox.getMinLayoutWidth()+(nodeDeepth+2)*this.getHeight());
        this._nodePath = nodePath;
        this.needLayoutSubNodes();
    }
}
HY.GUI.SimpleTreeNodeView.prototype.getNodeData = function(){
    return this._nodeData;
}
HY.GUI.SimpleTreeNodeView.prototype.setNodeData = function(nodeData){
    if(nodeData){
        this._nodeTextBox.setText(nodeData.name);
        var nodeDeepth = 0;
        if(this._nodePath){
            nodeDeepth = this._nodePath.length;
        }
        if(nodeData.leaf){
            this._nodeExpandIcon.setVisible(false);
        }else{
            this._nodeExpandIcon.setVisible(true);
        }
        this.setMinLayoutWidth(this._nodeTextBox.getMinLayoutWidth()+(nodeDeepth+2)*this.getHeight());
        return this._nodeData = nodeData;
    }
}
HY.GUI.SimpleTreeNodeView.prototype.getNodeInsertMode = function(){
    return this._nodeInsertMode;
}
HY.GUI.SimpleTreeNodeView.prototype.setNodeInsertMode = function(mode){
    this._nodeInsertMode = mode;
    this.reRender();
}
HY.GUI.SimpleTreeNodeView.prototype._nodeInsertModePaint = function(sender, dc, rect){
    switch(this._nodeInsertMode){
        case  1:{//作为子节点
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                var y = 1;
                var width = this.getWidth()-x-1;
                var height = this.getHeight()-2;
                dc.setStrokeStyle("#ff0000");
                dc.strokeRect(x,y,width,height);
            }
            break;
        }
        case 2:{//插入上方
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                dc.setStrokeStyle("#ff0000");
                dc.beginPath();
                dc.moveTo(x,1);
                dc.lineTo(this.getWidth(),1);
                dc.stroke();
            }
            break;
        }
        case 3:{//插入下方
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                var y = this.getHeight()-1;
                dc.setStrokeStyle("#ff0000");
                dc.beginPath();
                dc.moveTo(x,y);
                dc.lineTo(this.getWidth(),y);
                dc.stroke();
            }
            break;
        }
        default :
            break;
    }
}
HY.GUI.SimpleTreeNodeView.prototype._nodeExpandIconPaint = function(sender,dc,rect){
    var width = sender.getWidth();
    var height = sender.getHeight();
    dc.beginPath();
    if(this._nodeData.expanded){
        dc.moveTo(width/2, height/3);
        dc.lineTo(5*width/6, height/3);
        dc.lineTo(2*width/3, 2*height/3);
    }else{
        dc.moveTo(width/2, height/3);
        dc.lineTo(5*width/6, height/2);
        dc.lineTo(width/2, 2*height/3);
    }
    dc.closePath();
    dc.setFillStyle("#000000");
    dc.fill();
}

HY.GUI.SimpleTreeView = function(config){
    this.init(config);
}
HY.GUI.SimpleTreeView.prototype = new HY.GUI.TreeView();
HY.GUI.SimpleTreeView.prototype.defaultNodeHeight = 20;
HY.GUI.SimpleTreeView.prototype.defaultNodeNormalColor = null;
HY.GUI.SimpleTreeView.prototype.defaultNodeHoverColor = null;
HY.GUI.SimpleTreeView.prototype.defaultNodeActiveColor = "#0000ff";
HY.GUI.SimpleTreeView.prototype.defaultNodeMoveEnable = true;
HY.GUI.SimpleTreeView.prototype.defaultNodeEditEnable = false;
HY.GUI.SimpleTreeView.prototype.defaultLeafNodeIcon = {
    key:"systemicons",
    src:HY.ImageData.systemIcon,
    srcX:60,
    srcY:0,
    srcWidth:20,
    srcHeight:20
};
HY.GUI.SimpleTreeView.prototype.defaultExpandedNodeIcon = {
    key:"systemicons",
    src:HY.ImageData.systemIcon,
    srcX:20,
    srcY:0,
    srcWidth:20,
    srcHeight:20
};
HY.GUI.SimpleTreeView.prototype.defaultUnExpandedNodeIcon = {
    key:"systemicons",
    src:HY.ImageData.systemIcon,
    srcX:40,
    srcY:0,
    srcWidth:20,
    srcHeight:20
};
HY.GUI.SimpleTreeView.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.nodeHeight != undefined){ this._nodeHeight = config.nodeHeight; } else { this._nodeHeight = this.defaultNodeHeight; }
    if(config.nodeNormalColor != undefined){ this._nodeNormalColor = config.nodeNormalColor; } else { this._nodeNormalColor = this.defaultNodeNormalColor; }
    if(config.nodeHoverColor != undefined){ this._nodeHoverColor = config.nodeHoverColor; } else { this._nodeHoverColor = this.defaultNodeHoverColor; }
    if(config.nodeActiveColor != undefined){ this._nodeActiveColor = config.nodeActiveColor; } else { this._nodeActiveColor = this.defaultNodeActiveColor; }
    if(config.nodeEditEnable != undefined){ this._nodeEditEnable = config.nodeEditEnable; } else { this._nodeEditEnable = this.defaultNodeEditEnable; }
    if(config.nodeMoveEnable != undefined){ this._nodeMoveEnable = config.nodeMoveEnable; } else { this._nodeMoveEnable = this.defaultNodeMoveEnable; }
    if(config.leafNodeIcon != undefined){ this._leafNodeIcon = config.leafNodeIcon; } else { this._leafNodeIcon = this.defaultLeafNodeIcon; }
    if(config.expandedNodeIcon != undefined){ this._expandedNodeIcon = config.expandedNodeIcon; } else { this._expandedNodeIcon = this.defaultExpandedNodeIcon; }
    if(config.unExpandedNodeIcon != undefined){ this._unExpandedNodeIcon = config.unExpandedNodeIcon; } else { this._unExpandedNodeIcon = this.defaultUnExpandedNodeIcon; }

    this._selNodePath = null;
    this._mouseOverNodePath = null;
    this.__prepareNodeMove = false;
}
HY.GUI.SimpleTreeView.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addEventListener("nodemousedown", this._nodeSelected, this);
    this.addEventListener("nodemouseover", this._nodeMovingSel, this);
    this.addEventListener("nodemousemove", this._nodeMoving, this);
    this.addEventListener("nodemouseout", this._nodeMovingUnSel, this);
    this.addEventListener("nodemouseup", this._nodeMoveEnd, this);
}
HY.GUI.SimpleTreeView.prototype.getSelectedNodePath = function(){
    return this._selNodePath;
}
HY.GUI.SimpleTreeView.prototype.setSelectedNodePath = function(nodePath){
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
                this.onNodeUnSelected(this, tempNodePath);
                this.onNodeSelected(this, this._selNodePath);
            }
        }else{
            this._selNodePath = nodePath;
            this.onNodeUnSelected(this, this._selNodePath);
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
HY.GUI.SimpleTreeView.prototype.getNodeHeight = function(){
    return this._nodeHeight;
}
HY.GUI.SimpleTreeView.prototype.setNodeHeight = function(nodeHeight){
    this._nodeHeight = nodeHeight;
    this.reloadData();
}
HY.GUI.SimpleTreeView.prototype.getNodeNormalColor = function(){
    return this._nodeNormalColor;
}
HY.GUI.SimpleTreeView.prototype.setNodeNormalColor = function(normalColor){
    this._nodeNormalColor = normalColor;
}
HY.GUI.SimpleTreeView.prototype.getHoverColor = function(){
    return this._nodeHoverColor;
}
HY.GUI.SimpleTreeView.prototype.setHoverColor = function(hoverColor){
    this._nodeHoverColor = hoverColor;
}
HY.GUI.SimpleTreeView.prototype.getActiveColor = function(){
    return this._nodeActiveColor;
}
HY.GUI.SimpleTreeView.prototype.setActiveColor = function(activeColor){
    this._nodeActiveColor = activeColor;
}
HY.GUI.SimpleTreeView.prototype.getNodeEditEnable = function(){
    return this._nodeEditEnable;
}
HY.GUI.SimpleTreeView.prototype.setNodeEditEnable = function(editAble){
    this._nodeEditEnable = editAble;
}
HY.GUI.SimpleTreeView.prototype.getNodeMoveEnable = function(){
    return this._nodeMoveEnable;
}
HY.GUI.SimpleTreeView.prototype.setNodeMoveEnable = function(moveEnable){
    this._nodeMoveEnable = moveEnable;
}
HY.GUI.SimpleTreeView.prototype.getNodeDataOfNodePath = function(nodePath,nodeDeepth){
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

HY.GUI.SimpleTreeView.prototype._compareNodePath = function(srcNodePath,srcDeepth,targetNodePath,targetDeepth){
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
HY.GUI.SimpleTreeView.prototype._checkIsChildNode = function(parentNodePath,parentDeepth,childNodePath,childDeepth){
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
HY.GUI.SimpleTreeView.prototype._nodeExpand = function(sender, e){
    var nodeView = sender.getParent();
    var nodeData = nodeView.getNodeData();
    if(nodeData.expanded){
        nodeData.expanded = false;
    }else{
        nodeData.expanded = true;
    }
    this.onNodeExpand(nodeView, nodeView.getNodePath());
    this.reloadData();
}
HY.GUI.SimpleTreeView.prototype._nodeSelected = function(sender, e, nodeView){
    this.setSelectedNodePath(nodeView.getNodePath());
    if(this._nodeMoveEnable){
        this.__prepareNodeMove = true;
    }
}
HY.GUI.SimpleTreeView.prototype._nodeMovingSel = function(sender, e, nodeView){
    this._mouseOverNodePath = nodeView.getNodePath();
}
HY.GUI.SimpleTreeView.prototype._nodeMoving = function(sender, e, nodeView){
    if(this.__prepareNodeMove){
        if(this._mouseOverNodePath && this._selNodePath){
            var insertMode = 0;
            var overNodeView = this.getNodeViewOfNodePath(this._mouseOverNodePath,this._mouseOverNodePath.length);
            if(overNodeView){
                if(!this._compareNodePath(this._mouseOverNodePath,this._mouseOverNodePath.length,this._selNodePath,this._selNodePath.length)){
                    var targetNodePath = HY.clone(this._mouseOverNodePath);
                    var overNodeData = overNodeView.getNodeData();
                    var coorInNodeView = overNodeView.transPointFromCanvas(new HY.Vect2D({x: e.offsetX,y: e.offsetY}));
                    if(overNodeData.leaf){
                        if(coorInNodeView.y < overNodeView.getHeight()/4 && targetNodePath.length > 0){
                            insertMode = 2;
                        }else if(coorInNodeView.y > 3*overNodeView.getHeight()/4 && targetNodePath.length > 0){
                            insertMode = 3;
                            targetNodePath[targetNodePath.length-1] = targetNodePath[targetNodePath.length-1] + 1;
                        }else{
                            insertMode = 0;
                        }
                    }else{
                        if(coorInNodeView.y < overNodeView.getHeight()/4 && targetNodePath.length > 0){
                            insertMode = 2;
                        }else if(coorInNodeView.y > 3*overNodeView.getHeight()/4 && targetNodePath.length > 0){
                            insertMode = 3;
                            targetNodePath[targetNodePath.length-1] = targetNodePath[targetNodePath.length-1] + 1;
                        }else{
                            insertMode = 1;
                            targetNodePath.push(0);
                        }
                    }
                    if(this._checkIsChildNode(this._selNodePath,this._selNodePath.length,targetNodePath,targetNodePath.length)){
                        insertMode = 0;
                    }
                    overNodeView.setNodeInsertMode(insertMode);
                }
            }
        }
    }
}
HY.GUI.SimpleTreeView.prototype._nodeMovingUnSel = function(sender, e, nodeView){
    this._mouseOverNodePath = null;
    nodeView.setNodeInsertMode(0);
}
HY.GUI.SimpleTreeView.prototype._nodeMoveEnd = function(sender, e, nodeView){
    if(this.__prepareNodeMove){
        if(this._mouseOverNodePath && this._selNodePath){
            var overNodeView = this.getNodeViewOfNodePath(this._mouseOverNodePath,this._mouseOverNodePath.length);
            var targetNodePath = HY.clone(overNodeView.getNodePath());
            var moveFlag = true;
            if(overNodeView){
                switch(overNodeView.getNodeInsertMode()){
                    case 1:{
                        targetNodePath.push(0);
                        break;
                    }
                    case 2:{
                        break;
                    }
                    case 3:{
                        targetNodePath[targetNodePath.length-1] = targetNodePath[targetNodePath.length-1]+1;
                        break;
                    }
                    default :
                        moveFlag = false;
                        break;
                }
            }
            if(moveFlag){
                var targetParNodeData = this.getNodeDataOfNodePath(targetNodePath,targetNodePath.length-1);
                var selParNodeData = this.getNodeDataOfNodePath(this._selNodePath,this._selNodePath.length-1);
                var selNodeData = this.getNodeDataOfNodePath(this._selNodePath,this._selNodePath.length)
                var targetIndex = targetNodePath[targetNodePath.length-1];
                var selIndex = this._selNodePath[this._selNodePath.length-1];
                if(targetParNodeData == selParNodeData){
                    if(!targetParNodeData.childNodes){
                        targetParNodeData.childNodes = [];
                    }
                    if(targetIndex > selIndex){
                        targetParNodeData.childNodes.splice(targetIndex,0,selNodeData);
                        selParNodeData.childNodes.splice(selIndex,1);
                    }else{
                        selParNodeData.childNodes.splice(selIndex,1);
                        targetParNodeData.childNodes.splice(targetIndex,0,selNodeData);
                    }
                }else{
                    if(!targetParNodeData.childNodes){
                        targetParNodeData.childNodes = [];
                    }
                    targetParNodeData.childNodes.splice(targetIndex,0,selNodeData);
                    selParNodeData.childNodes.splice(selIndex,1);
                }
                this.onNodeMove(this,this._selNodePath,targetNodePath);
                this.setSelectedNodePath(targetNodePath);
                this.reloadData();
            }
        }
    }
    this.__prepareNodeMove = false;
}
HY.GUI.SimpleTreeView.prototype.onNodeExpand = function(sender,nodepath){
    this.launchEvent("nodeexpand",[this, nodepath]);
}
HY.GUI.SimpleTreeView.prototype.onNodeMove = function(sender,srcNodePath,targetNodePath){
    this.launchEvent("novemove",[this,srcNodePath,targetNodePath]);
}
HY.GUI.SimpleTreeView.prototype.onNodeSelected = function(sender, nodePath){
    this.launchEvent("nodeselected",[this, nodePath]);
}
HY.GUI.SimpleTreeView.prototype.onNodeUnSelected = function(sender, nodePath){
    this.launchEvent("nodeunselected",[this, nodePath]);
}

HY.GUI.SimpleTreeView.prototype.numberOfNodeInPath = function(treeView, nodePath){
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
HY.GUI.SimpleTreeView.prototype.heightOfNodeInPath = function(treeView, nodePath){
    return this._nodeHeight;
}
HY.GUI.SimpleTreeView.prototype.contextMenuOfNodeInPath = function(treeView, nodePath){
    return null;
}
HY.GUI.SimpleTreeView.prototype.viewOfNodeInPath = function(treeView,nodePath){
    var node = this.getRoot();
    if(node){
        var nodeDeepth = nodePath.length;
        for(var i=0;i<nodeDeepth;++i){
            node = node.childNodes[nodePath[i]];
        }
        var nodeView = treeView.getReuseNodeOfIdentity("nodeview");
        if(nodeView == null){
            nodeView = new HY.GUI.SimpleTreeNodeView({reuseIdentity:"nodeview"});
            nodeView.setNormalColor(this._nodeNormalColor);
            nodeView.setHoverColor(this._nodeHoverColor);
            nodeView.setActiveColor(this._nodeActiveColor);
            nodeView.getNodeExpandIcon().addEventListener("mouseup", this._nodeExpand, this);
        }
        if(this._selNodePath && this._compareNodePath(nodePath,nodePath.length,this._selNodePath,this._selNodePath.length)){
            nodeView.setSelected(true);
        }else{
            nodeView.setSelected(false);
        }
        nodeView.setEditEnable(this._nodeEditEnable);
        nodeView.setNodeData(node);
        if(node.leaf){
            nodeView.getNodeIcon().setImage(this._leafNodeIcon);
        }else if(node.expanded){
            nodeView.getNodeIcon().setImage(this._expandedNodeIcon);
        }else{
            nodeView.getNodeIcon().setImage(this._unExpandedNodeIcon);
        }
        return nodeView;
    }else{
        return null;
    }
}