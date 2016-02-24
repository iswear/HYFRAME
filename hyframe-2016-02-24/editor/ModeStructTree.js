HY.GUI.ModelStructTreeNodeView  = function(config){
    this.init(config);
}
HY.GUI.ModelStructTreeNodeView.prototype = new HY.GUI.TreeNodeView();
HY.GUI.ModelStructTreeNodeView.prototype.defaultReuseIdentity = "modelstructnode";
HY.GUI.ModelStructTreeNodeView.prototype.defaultEditEnable = false;
HY.GUI.ModelStructTreeNodeView.prototype.defaultSelected = false;
HY.GUI.ModelStructTreeNodeView.prototype.init = function(config){
    this._nodeIcon = new HY.GUI.ImageView({mouseEnable:false});
    this._nodeTextBox = new HY.GUI.TextBox({mouseEnable:false,editDelay:300,cursor:'default'});
    this._nodeExpandIcon = new HY.GUI.View({mouseEnable:true,cacheEnable:false});
    this._nodeUnit = null;
    this._nodePath = null;
    this._nodeInsertMode = 0;
    this.addChildNodeAtLayer(this._nodeIcon,0);
    this.addChildNodeAtLayer(this._nodeTextBox,0);
    this.addChildNodeAtLayer(this._nodeExpandIcon,0);

    this.superCall("init",[config]);
    if(config.selected != undefined){ this.setSelected(config.selected); } else { this.setSelected(this.defaultSelected); }
    if(config.editEnable != undefined){ this.setEditEnable(config.editEnable); } else { this.setEditEnable(this.defaultEditEnable); }

    this._nodeExpandIcon.addEventListener("paint",this._nodeExpandIconPaint,this);
    this.addEventListener("paint", this._nodeInsertModePaint, this);
}
HY.GUI.ModelStructTreeNodeView.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    var nodeDeepth = this._nodePath.length;
    this._nodeExpandIcon.setX(nodeDeepth*this.getHeight());
    this._nodeExpandIcon.setY(0);
    this._nodeExpandIcon.setWidth(this.getHeight());
    this._nodeExpandIcon.setHeight(this.getHeight());
    this._nodeIcon.setX(nodeDeepth*this.getHeight()+this.getHeight());
    this._nodeIcon.setY(0);
    this._nodeIcon.setWidth(this.getHeight());
    this._nodeIcon.setHeight(this.getHeight());
    this._nodeTextBox.setX(nodeDeepth*this.getHeight()+this.getHeight()+this.getHeight());
    this._nodeTextBox.setY(0);
    this._nodeTextBox.setWidth(this.getWidth()-this._nodeIcon.getWidth()-this._nodeIcon.getX());
    this._nodeTextBox.setHeight(this.getHeight());
}
HY.GUI.ModelStructTreeNodeView.prototype.getNodeIcon = function(){
    return this._nodeIcon;
}
HY.GUI.ModelStructTreeNodeView.prototype.getNodeTextBox = function(){
    return this._nodeTextBox;
}
HY.GUI.ModelStructTreeNodeView.prototype.getNodeExpandIcon = function(){
    return this._nodeExpandIcon;
}
HY.GUI.ModelStructTreeNodeView.prototype.getEditEnable = function(){
    return this._editEnable;
}
HY.GUI.ModelStructTreeNodeView.prototype.setEditEnable = function(editEnable){
    this._editEnable = editEnable;
}
HY.GUI.ModelStructTreeNodeView.prototype.getNodePath = function(){
    return this._nodePath;
}
HY.GUI.ModelStructTreeNodeView.prototype.setNodePath = function(nodePath){
    if(nodePath){
        var nodeDeepth = nodePath.length;
        this.setMinLayoutWidth(this._nodeTextBox.getMinLayoutWidth()+(nodeDeepth+2)*this.getHeight());
        this._nodePath = nodePath;
        this.needLayoutSubNodes();
    }
}
HY.GUI.ModelStructTreeNodeView.prototype.getNodeUnit = function(){
    return this._nodeUnit;
}
HY.GUI.ModelStructTreeNodeView.prototype.setNodeUnit = function(nodeUnit){
    if(nodeUnit){
        this._nodeTextBox.setText(nodeUnit.getName());
        var nodeDeepth = 0;
        if(this._nodePath){
            nodeDeepth = this._nodePath.length;
        }
        this.setMinLayoutWidth(this._nodeTextBox.getMinLayoutWidth()+(nodeDeepth+2)*this.getHeight());
        this._nodeUnit = nodeUnit;
    }
}
HY.GUI.ModelStructTreeNodeView.prototype.getNodeInsertMode = function(){
    return this._nodeInsertMode;
}
HY.GUI.ModelStructTreeNodeView.prototype.setNodeInsertMode = function(mode){
    this._nodeInsertMode = mode;
    this.reRender();
}
HY.GUI.ModelStructTreeNodeView.prototype._nodeInsertModePaint = function(sender, dc, rect){
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
HY.GUI.ModelStructTreeNodeView.prototype._nodeExpandIconPaint = function(sender,dc,rect){
    var width = sender.getWidth();
    var height = sender.getHeight();
    dc.beginPath();
    if(this._nodeUnit.getUserProperty("nodeexpanded")){
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


HY.GUI.ModelStructTreeView = function(config){
    this.init(config);
}
HY.GUI.ModelStructTreeView.prototype = new HY.GUI.TreeView();
HY.GUI.ModelStructTreeView.prototype.defaultNodeHeight = 20;
HY.GUI.ModelStructTreeView.prototype.defaultNodeNormalColor = null;
HY.GUI.ModelStructTreeView.prototype.defaultNodeHoverColor = null;
HY.GUI.ModelStructTreeView.prototype.defaultNodeActiveColor = "#0000ff";
HY.GUI.ModelStructTreeView.prototype.defaultNodeMoveEnable = true;
HY.GUI.ModelStructTreeView.prototype.defaultNodeEditEnable = false;
HY.GUI.ModelStructTreeView.prototype.defaultNodeIcon = {
    key:"systemicons",
    src:HY.ImageData.systemIcon,
    srcX:80,
    srcY:0,
    srcWidth:20,
    srcHeight:20
};
HY.GUI.ModelStructTreeView.prototype.init = function(config){
    this._selectedNodePath = null;
    this._mouseOverNodePath = null;
    this.__prepareNodeMove = false;
    this.superCall("init",[config]);
    if(config.nodeHeight != undefined){ this.setNodeHeight(config.nodeHeight); } else { this.setNodeHeight(this.defaultNodeHeight); }
    if(config.nodeIcon != undefined){ this.setNodeIcon( config.nodeIcon); } else { this.setNodeIcon(this.defaultNodeIcon); }
    if(config.nodeNormalColor != undefined){ this.setNodeNormalColor(config.nodeNormalColor); } else { this.setNodeNormalColor(this.defaultNodeNormalColor); }
    if(config.nodeHoverColor != undefined){ this.setNodeHoverColor(config.nodeHoverColor); } else { this.setNodeHoverColor(this.defaultNodeHoverColor); }
    if(config.nodeActiveColor != undefined){ this.setNodeActiveColor(config.nodeActiveColor); } else { this.setNodeActiveColor(this.defaultNodeActiveColor); }
    if(config.nodeEditEnable != undefined){ this.setNodeEditEnable(config.nodeEditEnable); } else { this.setNodeEditEnable(this.defaultNodeEditEnable); }
    if(config.nodeMoveEnable != undefined){ this.setNodeMoveEnable(config.nodeMoveEnable); } else { this.setNodeMoveEnable(this.defaultNodeMoveEnable); }

    this.addEventListener("nodemousedown", this._nodeSelected, this);
    this.addEventListener("nodemouseover", this._nodeMovingSel, this);
    this.addEventListener("nodemousemove", this._nodeMoving, this);
    this.addEventListener("nodemouseout", this._nodeMovingUnSel, this);
    this.addEventListener("nodemouseup", this._nodeMoveEnd, this);
}
HY.GUI.ModelStructTreeView.prototype.getSelectedNodePath = function(){
    return this._selectedNodePath;
}
HY.GUI.ModelStructTreeView.prototype.setSelectedNodePath = function(nodePath){
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
HY.GUI.ModelStructTreeView.prototype.getNodeHeight = function(){
    return this._nodeHeight;
}
HY.GUI.ModelStructTreeView.prototype.setNodeHeight = function(nodeHeight){
    this._nodeHeight = nodeHeight;
    this.reloadData();
}
HY.GUI.ModelStructTreeView.prototype.getNodeIcon = function(){
    return this._nodeIcon;
}
HY.GUI.ModelStructTreeView.prototype.setNodeIcon = function(nodeIcon){
    this._nodeIcon = nodeIcon;
}

HY.GUI.ModelStructTreeView.prototype.getNodeNormalColor = function(){
    return this._nodeNormalColor;
}
HY.GUI.ModelStructTreeView.prototype.setNodeNormalColor = function(normalColor){
    this._nodeNormalColor = normalColor;
}
HY.GUI.ModelStructTreeView.prototype.getNodeHoverColor = function(){
    return this._nodeHoverColor;
}
HY.GUI.ModelStructTreeView.prototype.setNodeHoverColor = function(hoverColor){
    this._nodeHoverColor = hoverColor;
}
HY.GUI.ModelStructTreeView.prototype.getNodeActiveColor = function(){
    return this._nodeActiveColor;
}
HY.GUI.ModelStructTreeView.prototype.setNodeActiveColor = function(activeColor){
    this._nodeActiveColor = activeColor;
}
HY.GUI.ModelStructTreeView.prototype.getNodeEditEnable = function(){
    return this._nodeEditEnable;
}
HY.GUI.ModelStructTreeView.prototype.setNodeEditEnable = function(editAble){
    this._nodeEditEnable = editAble;
}
HY.GUI.ModelStructTreeView.prototype.getNodeMoveEnable = function(){
    return this._nodeMoveEnable;
}
HY.GUI.ModelStructTreeView.prototype.setNodeMoveEnable = function(moveEnable){
    this._nodeMoveEnable = moveEnable;
}
HY.GUI.ModelStructTreeView.prototype.getNodeUnitOfNodePath = function(nodePath,nodeDeepth){
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

HY.GUI.ModelStructTreeView.prototype._compareNodePath = function(srcNodePath,srcDeepth,targetNodePath,targetDeepth){
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
HY.GUI.ModelStructTreeView.prototype._checkIsChildNode = function(parentNodePath,parentDeepth,childNodePath,childDeepth){
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
HY.GUI.ModelStructTreeView.prototype._nodeExpand = function(sender, e){
    var nodeView = sender.getParent();
    var nodeUnit = nodeView.getNodeUnit();
    if(nodeUnit.getUserProperty("nodeexpanded")){
        nodeUnit.setUserProperty("nodeexpanded",false);
    }else{
        nodeUnit.setUserProperty("nodeexpanded",true);
    }
    this.onNodeExpand(e, sender);
    this.reloadData();
}
HY.GUI.ModelStructTreeView.prototype._nodeSelected = function(sender, e, nodeView){
    this.setSelectedNodePath(nodeView.getNodePath());
    if(this._nodeMoveEnable){
        this.__prepareNodeMove = true;
    }
}
HY.GUI.ModelStructTreeView.prototype._nodeMovingSel = function(sender, e, nodeView){
    this._mouseOverNodePath = nodeView.getNodePath();
}
HY.GUI.ModelStructTreeView.prototype._nodeMoving = function(sender, e, nodeView){
    if(this.__prepareNodeMove){
        if(this._mouseOverNodePath && this._selectedNodePath){
            var insertMode = 0;
            var overNodeView = this.getNodeViewOfNodePath(this._mouseOverNodePath,this._mouseOverNodePath.length);
            if(overNodeView){
                if(!this._compareNodePath(this._mouseOverNodePath,this._mouseOverNodePath.length,this._selectedNodePath,this._selectedNodePath.length)){
                    var targetNodePath = HY.clone(this._mouseOverNodePath);
                    var coorInNodeView = overNodeView.transPointFromCanvas(new HY.Vect2D({x: e.offsetX,y: e.offsetY}));
                    insertMode = 0;
                    if(coorInNodeView.y < overNodeView.getHeight()/4 && targetNodePath.length > 0){
                        insertMode = 2;
                    }else if(coorInNodeView.y > 3*overNodeView.getHeight()/4 && targetNodePath.length > 0){
                        insertMode = 3;
                        targetNodePath[targetNodePath.length-1] = targetNodePath[targetNodePath.length-1] + 1;
                    }else{
                        insertMode = 1;
                        targetNodePath.push(0);
                    }
                    if(this._checkIsChildNode(this._selectedNodePath,this._selectedNodePath.length,targetNodePath,targetNodePath.length)){
                        insertMode = 0;
                    }
                    overNodeView.setNodeInsertMode(insertMode);
                }
            }
        }
    }
}
HY.GUI.ModelStructTreeView.prototype._nodeMovingUnSel = function(sender, e, nodeView){
    this._mouseOverNodePath = null;
    nodeView.setNodeInsertMode(0);
}
HY.GUI.ModelStructTreeView.prototype._nodeMoveEnd = function(sender, e, nodeView){
    if(this.__prepareNodeMove){
        if(this._mouseOverNodePath && this._selectedNodePath){
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
                var targetParNodeUnit = this.getNodeUnitOfNodePath(targetNodePath,targetNodePath.length-1);
                var selParNodeUnit = this.getNodeUnitOfNodePath(this._selectedNodePath,this._selectedNodePath.length-1);
                var selNodeUnit = this.getNodeUnitOfNodePath(this._selectedNodePath,this._selectedNodePath.length)
                var targetIndex = targetNodePath[targetNodePath.length-1];
                var selIndex = this._selectedNodePath[this._selectedNodePath.length-1];
                if(targetParNodeUnit == selParNodeUnit){
                    if(targetIndex > selIndex){
                        selParNodeUnit.removeChildUnitAt(selIndex,false);
                        targetParNodeUnit.addChildUnitAt(selNodeUnit,targetIndex-1);
                    }else{
                        selParNodeUnit.removeChildUnitAt(selIndex,false);
                        targetParNodeUnit.addChildUnitAt(selNodeUnit,targetIndex);
                    }
                }else{
                    selParNodeUnit.removeChildUnitAt(selIndex,false);
                    targetParNodeUnit.addChildUnitAt(selNodeUnit,targetIndex);
                }
                this.onNodeMove(this, this._selectedNodePath, targetNodePath);
                this.setSelectedNodePath(null);
                this.reloadData();
            }
        }
    }
    this.__prepareNodeMove = false;
}
HY.GUI.ModelStructTreeView.prototype.onNodeExpand = function(sender, nodepath){
    this.launchEvent("nodeexpand", [this, nodepath]);
}
HY.GUI.ModelStructTreeView.prototype.onNodeMove = function(sender,srcNodePath, targetNodePath){
    this.launchEvent("nodemove", [this, srcNodePath, targetNodePath]);
}
HY.GUI.ModelStructTreeView.prototype.onNodeSelected = function(sender, nodePath){
    this.launchEvent("nodeselected",[this, nodePath]);
}
HY.GUI.ModelStructTreeView.prototype.onNodeUnSelected = function(sender, nodePath){
    this.launchEvent("nodeunselected",[this, nodePath]);
}

HY.GUI.ModelStructTreeView.prototype.numberOfNodeInPath = function(treeView, nodePath){
    var node = this.getRoot();
    for(var i= 0,nodeDeepth = nodePath.length;i<nodeDeepth;++i){
        var childUnits = node.getChildUnits();
        node = childUnits[nodePath[i]];
    }
    if(!node){
        return 0;
    }else{
        var childUnits = node.getChildUnits();
        if(node.getUserProperty("nodeexpanded") && childUnits){
            return childUnits.length;
        }else{
            return 0;
        }
    }
}
HY.GUI.ModelStructTreeView.prototype.heightOfNodeInPath = function(treeView, nodePath){
    return this._nodeHeight;
}
HY.GUI.ModelStructTreeView.prototype.contextMenuOfNodeInPath = function(treeView, nodePath){
    if(nodePath != null && nodePath.length > 0){
        return ["添加结点","删除结点","隐藏/显示"];
    }else{
        return ["添加结点"];
    }
}
HY.GUI.ModelStructTreeView.prototype.viewOfNodeInPath = function(treeView,nodePath){
    var node = this.getRoot();
    for(var i= 0,nodeDeepth = nodePath.length;i<nodeDeepth;++i){
        var childUnits = node.getChildUnits();
        node = childUnits[nodePath[i]];
    }
    var nodeView = treeView.getReuseNodeOfIdentity("modelstructnode");
    if(nodeView == null){
        nodeView = new HY.GUI.ModelStructTreeNodeView({reuseIdentity:"modelstructnode"});
        nodeView.setNormalColor(this._nodeNormalColor);
        nodeView.setHoverColor(this._nodeHoverColor);
        nodeView.setActiveColor(this._nodeActiveColor);
        nodeView.getNodeExpandIcon().addEventListener("mouseup",this._nodeExpand, this);
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