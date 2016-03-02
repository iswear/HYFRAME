var modeleditor = modeleditor || {};
modeleditor.class = modeleditor || {};
modeleditor.class.ModelEditor = hy.extend(hy.gui.View);
modeleditor.class.ModelEditor.prototype.defaultBorderWidth = 5;
modeleditor.class.ModelEditor.prototype.defaultBorderColor = "#000";
modeleditor.class.ModelEditor.prototype.init = function(config){
    this.superCall("init", [config]);
    this._menu = new hy.gui.Menu({
        menuItems:[
            {
                name:'item1',
                dropItems:[
                    {
                        name:'item1-1'
                    },
                    {
                        name:'item1-1'
                    }
                ]
            },
            {
                name:'item2',
                dropItems:[
                    {
                        name:'item2-1'
                    },
                    {
                        name:'item2-2'
                    }
                ]
            }
        ]
    });
    this._modelView = new hy.gui.View({});
    this._model = new hy.game.Model({
        x:0,
        y:0,
        width:200,
        height:200,
        normalColor:"#f00",
        name:"模型",
        anchorMoveEnable:true,
        resizeEnable:true,
        rotateEnable:true
    });
    this._structTree = new modeleditor.class.StructTree({
        root:this._model
    });
    this._actionList = new hy.gui.SimpleListView({
        items:this._model.getActionNames()
    });
    this._nameTree = new modeleditor.class.NameTree({
        root:this._model
    });
    this._timeTree = new modeleditor.class.TimeTree({
        root:this._model
    });
    this._mainView = new hy.gui.SplitView({
        width:300,
        normalColor:null,
        activeColor:null,
        splitSpace:4,
        splitDirection:0,
        adjustEnable:true,
        autoAdjustViewIndex:1,
        splitViews:[
            new hy.gui.Panel({
                title:"结构树",
                mainView:this._structTree
            }),
            new hy.gui.SplitView({
                height:300,
                normalColor:null,
                activeColor:null,
                splitSpace:4,
                splitDirection:1,
                adjustEnable:true,
                autoAdjustViewIndex:0,
                splitViews:[
                    new hy.gui.Panel({
                        title:"编辑区",
                        mainView:this._modelView
                    }),
                    new hy.gui.SplitView({
                        width:200,
                        normalColor:null,
                        activeColor:null,
                        splitSpace:4,
                        splitDirection:0,
                        adjustEnable:true,
                        autoAdjustViewIndex:1,
                        splitViews:[
                            new hy.gui.Panel({
                                title:"动作列表",
                                mainView:this._actionList
                            }),
                            new hy.gui.Panel({
                                title:"时间轴",
                                mainView:new hy.gui.SplitView({
                                    width:200,
                                    normalColor:null,
                                    activeColor:null,
                                    splitSpace:4,
                                    splitDirection:0,
                                    adjustEnable:true,
                                    autoAdjustViewIndex:1,
                                    splitViews:[
                                        this._nameTree,
                                        this._timeTree
                                    ]
                                })
                            })
                        ]
                    })
                ]
            })
        ]
    });
    this._modelView.addChildNodeAtLayer(this._model, 0);
    this.addChildNodeAtLayer(this._menu, 0);
    this.addChildNodeAtLayer(this._mainView, 0);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutModelEditor);
}
modeleditor.class.ModelEditor.prototype._layoutModelEditor = function(sender){
    this._menu.setX(5);
    this._menu.setY(5);
    this._menu.setWidth(this.getWidth());
    this._menu.setHeight(25);
    this._mainView.setX(5);
    this._mainView.setY(30);
    this._mainView.setWidth(this.getWidth()-10);
    this._mainView.setHeight(this.getHeight() - 35);
}