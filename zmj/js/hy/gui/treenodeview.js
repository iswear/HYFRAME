var hy = hy || {};
hy.gui = hy.gui || {};
hy.gui.TreeNodeView = hy.extend(hy.gui.View);
hy.gui.TreeNodeView.prototype.defaultReuseIdentity = "treenode";
hy.gui.TreeNodeView.prototype.init = function(config){
    this.superCall("init",[config]);
    this._reuseIdentity = this.isUndefined(config.reuseIdentity) ? this.defaultReuseIdentity : config.reuseIdentity;
    this._nodePath = null;
    this._nodeInsertMode = 0;
    this.addObserver(this.notifyPaint, this, this._paintNodeInsertMode);
}
hy.gui.TreeNodeView.prototype.setReuseIdentity = function(reuseIdentity){
    this._reuseIdentity = reuseIdentity;
}
hy.gui.TreeNodeView.prototype.getReuseIdentity = function(){
    return this._reuseIdentity;
}
hy.gui.TreeNodeView.prototype.setNodePath = function(nodePath){
    this._nodePath = nodePath;
}
hy.gui.TreeNodeView.prototype.getNodePath = function(){
    return this._nodePath;
}
hy.gui.TreeNodeView.prototype.setNodeInsertMode = function(mode){
    if(this._nodeInsertMode != mode){
        this._nodeInsertMode = mode;
        this.refresh();
    }
}
hy.gui.TreeNodeView.prototype.getNodeInsertMode = function(){
    return this._nodeInsertMode;
}
hy.gui.TreeNodeView.prototype._paintNodeInsertMode = function(sender, dc, rect){
    switch(this._nodeInsertMode){
        case  1:{//插入上方
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                dc.setStrokeStyle(hy.gui.colors.DRED);
                dc.strokeRect(x, -1, this.getWidth()-x, 2);
            }
            break;
        }
        case 2:{//插入下方
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                dc.setStrokeStyle(hy.gui.colors.DRED);
                dc.strokeRect(x, this.getHeight()-1, this.getWidth()-x, 2);
            }
            break;
        }
        case 3:{//作为子节点
            if(this.getNodePath()){
                var nodeDeepth = this.getNodePath().length;
                var x = nodeDeepth * this.getHeight()+1;
                var y = 1;
                var width = this.getWidth()-x-1;
                var height = this.getHeight()-2;
                dc.setStrokeStyle(hy.gui.colors.DRED);
                dc.strokeRect(x,y,width,height);
            }
            break;
        }
        default :
            break;
    }
}