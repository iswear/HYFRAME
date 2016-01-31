/**
 * Created by Administrator on 2014/12/11.
 */
HY.GUI.Frame = function(config){
    this.init(config);
}
HY.GUI.Frame.prototype = new HY.GUI.View();
HY.GUI.Frame.prototype.defaultBackgroundColor = "#0000ff";
HY.GUI.Frame.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.viewPort){ this._viewPort=config.viewPort; } else { this._viewPort =new HY.GUI.View({backgroundColor:"#ffffff"}); }
}
HY.GUI.Frame.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addChildNodeAtLayer(this._viewPort,0);
}
HY.GUI.Frame.prototype.setViewPort = function(pView){
    if(this._viewPort){
        this.removeChildNode(this._viewPort);
    }
    this._viewPort = pView;
    this.addChildNodeAtLayer(this._viewPort,0);
    this.needLayoutSubNodes();
}
HY.GUI.Frame.prototype.getViewPort = function(){
    return this._viewPort;
}
HY.GUI.Frame.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    this._viewPort.setX(5);
    this._viewPort.setY(5);
    this._viewPort.setWidth(this.getWidth()-10);
    this._viewPort.setHeight(this.getHeight()-10);
}
