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
    this._structTree = new modeleditor.class.StructTree({});
    this._actionList = new hy.gui.SimpleListView({});
    this._nameTree = new modeleditor.class.NameTree({});
    this._timeTree = new modeleditor.class.TimeTree({});
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
                    new hy.gui.Panel({}),
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
                                mainView:this._actionList
                            }),
                            new hy.gui.Panel({
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
    this._mainView.setWidth(this.getWidth());
    this._mainView.setHeight(this.getHeight() - 35);
}