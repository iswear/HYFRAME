/**
 * Created by Administrator on 2014/12/11.
 */
HY.GUI.Frame = function(config){
    this.init(config);
}
HY.GUI.Frame.prototype = new HY.GUI.View();
HY.GUI.Frame.prototype.defaultBackgroundColor = "#0000ff";
HY.GUI.Frame.prototype.init = function(config){
    if(config.viewPort){ this.setViewPort(config.viewPort); } else { this.setViewPort(new HY.GUI.View({backgroundColor:"#ffffff"})); }
    this.superCall("init",[config]);
}
HY.GUI.Frame.prototype.setViewPort = function(pView){
    if(this._viewPort){
        this._viewPort.removeFromParent(false);
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
