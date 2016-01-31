HY.Game.GameWindow = function(config){
    this.init(config);
}
HY.Game.GameWindow.prototype = new HY.GUI.View();
HY.Game.GameWindow.prototype.defaultBackgroundColor = "#0000ff";
HY.Game.GameWindow.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._map = new HY.Game.Terrain({backgroundColor:'red',width:400,height:400,dragEnable:true});
    this._stickPanel = new HY.Game.JoyStickPanel({});
    this._userAvatarImg = new HY.Game.Node({dragEnable:true,backgroundImage:'resources/game/gameui/userAvatar_base.png',anchorX:0,anchorY:0});
    this._bagInfoBtn = new HY.Game.Node({backgroundImage:'resources/game/gameui/bag.png'});
    this._skillInfoBtn = new HY.Game.Node({backgroundImage:'resources/game/gameui/skill.png'});
    this._messionInfoBtn = new HY.Game.Node({backgroundImage:'resources/game/gameui/mession.png'});

    this._skillBtn1 = new HY.Game.Node({backgroundImage:'resources/game/gameui/skill_base.png'});
    this._skillBtn2 = new HY.Game.Node({backgroundImage:'resources/game/gameui/skill_base.png'});
    this._skillBtn3 = new HY.Game.Node({backgroundImage:'resources/game/gameui/skill_base.png'});
    this._skillBtnNor = new HY.Game.Node({backgroundImage:'resources/game/gameui/skill_base.png'});
}
HY.Game.GameWindow.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    this.addChildNodeAtLayer(this._map,0);
    this.addChildNodeAtLayer(this._userAvatarImg,0);
    this.addChildNodeAtLayer(this._stickPanel,1);
    this.addChildNodeAtLayer(this._messionInfoBtn,1);
    this.addChildNodeAtLayer(this._bagInfoBtn,1);
    this.addChildNodeAtLayer(this._skillInfoBtn,1);
    this.addChildNodeAtLayer(this._skillBtnNor,1);
    this.addChildNodeAtLayer(this._skillBtn1,1);
    this.addChildNodeAtLayer(this._skillBtn2,1);
    this.addChildNodeAtLayer(this._skillBtn3,1);
}
HY.Game.GameWindow.prototype.onWidthChanged = function(){
    this.superCall("onWidthChanged");
    this.needLayoutUI();
}
HY.Game.GameWindow.prototype.onHeightChanged = function(pHeight){
    this.superCall("onHeightChanged");
    this.needLayoutUI();
}
HY.Game.GameWindow.prototype.layoutUI = function(){
    this.superCall("layoutUI");
    this._stickPanel.setX(90);
    this._stickPanel.setY(this.getHeight() - 90);
    this._stickPanel.setWidth(120);
    this._stickPanel.setHeight(120);

    this._skillInfoBtn.setX(this.getWidth()-330);
    this._skillInfoBtn.setY(this.getHeight()-40);
    this._skillInfoBtn.setWidth(50);
    this._skillInfoBtn.setHeight(50);

    this._messionInfoBtn.setX(this.getWidth()-270);
    this._messionInfoBtn.setY(this.getHeight()-40);
    this._messionInfoBtn.setWidth(50);
    this._messionInfoBtn.setHeight(50);

    this._bagInfoBtn.setX(this.getWidth() - 210);
    this._bagInfoBtn.setY(this.getHeight()-40);
    this._bagInfoBtn.setWidth(50);
    this._bagInfoBtn.setHeight(50);

    this._skillBtnNor.setX(this.getWidth() - 50);
    this._skillBtnNor.setY(this.getHeight() - 50);
    this._skillBtnNor.setWidth(80);
    this._skillBtnNor.setHeight(80);

    this._skillBtn1.setX(this.getWidth() - 130);
    this._skillBtn1.setY(this.getHeight() - 40);
    this._skillBtn1.setWidth(60);
    this._skillBtn1.setHeight(60);

    this._skillBtn2.setX(this.getWidth() - 110);
    this._skillBtn2.setY(this.getHeight() - 110);
    this._skillBtn2.setWidth(60);
    this._skillBtn2.setHeight(60);

    this._skillBtn3.setX(this.getWidth() - 40);
    this._skillBtn3.setY(this.getHeight() - 130);
    this._skillBtn3.setWidth(60);
    this._skillBtn3.setHeight(60);

    this._userAvatarImg.setX(10);
    this._userAvatarImg.setY(10);
    this._userAvatarImg.setWidth(170);
    this._userAvatarImg.setHeight(60);
}
