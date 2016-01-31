HY.Game.JoyStickPanel = function(config){
    this.init(config);
}
HY.Game.JoyStickPanel.prototype = new HY.Game.Node();
HY.Game.JoyStickPanel.prototype.defaultBackgroundImage = "resources/game/gameui/stick_base.png";
HY.Game.JoyStickPanel.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._stick = new HY.Game.Node({
        dragEnable:true,
        mouseEnable:true,
        dragZone:{x:-1000000,y:-1000000,width:2000000,height:2000000},
        backgroundImage:'resources/game/gameui/stick.png'
        //dragLimitZone:{
        //    type:2,
        //    x:0,
        //    y:0,
        //    radius:this.getWidth()/2
        //}
    });
}
HY.Game.JoyStickPanel.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this._stick.addEventListener("drag",function(pThis,pEvent){
        var parent = this.getParent();
        parent.onStickMoved();
    },null);
    this._stick.addEventListener("mouseup",function(pThis,pEvent){
        pThis.setX(0);
        pThis.setY(0);
        var parent = this.getParent();
        parent.onStickMoved();
    },null);
    this.addChildNodeAtLayer(this._stick,0);
}
HY.Game.JoyStickPanel.prototype.layoutUI = function(){
    this.superCall("layoutUI");
    this._stick.setX(0);
    this._stick.setY(0);
    this._stick.setWidth(this.getWidth()/2);
    this._stick.setHeight(this.getHeight()/2);
    this._stick.setDragLimitZone({type:2,x:0,y:0,radius:(this.getWidth()>this.getHeight()?this.getHeight():this.getWidth())/2});
}
HY.Game.JoyStickPanel.prototype.onWidthChanged = function(){
    this.superCall("onWidthChanged");
    this.needLayoutUI();
}
HY.Game.JoyStickPanel.prototype.onHeightChanged = function(){
    this.superCall("onHeightChanged");
    this.needLayoutUI();
}
HY.Game.JoyStickPanel.prototype.onStickMoved = function(){
    this.launchEvent("stickmoved");
}
HY.Game.JoyStickPanel.prototype.getDirectionVector = function(){
    return new HY.Vect2D({x:this._stick.getX(),y:this._stick.getY()});
}

