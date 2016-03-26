var modeleditor = modeleditor || {};
modeleditor.class = modeleditor || {};
modeleditor.class.ModelEditor = hy.extend(hy.gui.View);
modeleditor.class.ModelEditor.prototype.defaultBorderWidth = 0;
modeleditor.class.ModelEditor.prototype.defaultBorderColor = null;
modeleditor.class.ModelEditor.prototype.init = function(config){
    this.superCall("init", [config]);
    this._menu = new hy.gui.Menu({
        menuItems:[
            {
                name:'项目',
                dropItems:[
                    {
                        name:'新建项目'
                    }, {
                        name:'保存到服务器'
                    }
                ]
            }, {
                name:'帮助',
                dropItems:[
                    {
                        name:'说明'
                    }, {
                        name:'关于'
                    }
                ]
            }
        ]
    });
    this._menuSplitView = new hy.gui.View({normalColor:'#aaa',activeColor:'#aaa',mouseEnable:false});
    this._modelView = new hy.gui.View({});
    this._model = new hy.game.Model({
        x:0,
        y:0,
        width:200,
        height:200,
        normalColor:'#0f0',
        activeColor:'#0f0',
        name:"模型",
        dragEnable:false,
        anchorMoveEnable:false,
        resizeEnable:false,
        rotateEnable:false,
        actionNames:[{name:'行走1'},{name:"行走2"}]
    });
    this._testUnit1 = new hy.game.Unit({
        x:0,
        y:0,
        width:100,
        height:100,
        name:"unit1",
        normalColor:'#0f0',
        activeColor:'#0f0',
        dragEnable:false,
        anchorMoveEnable:false,
        resizeEnable:false,
        rotateEnable:false
    });
    this._testUnit2 = new hy.game.Unit({
        x:0,
        y:0,
        width:100,
        height:100,
        name:"unit2",
        normalColor:'#0f0',
        activeColor:'#0f0',
        dragEnable:false,
        anchorMoveEnable:false,
        resizeEnable:false,
        rotateEnable:false
    });
    this._model.addChildUnit(this._testUnit1);
    this._model.addChildUnit(this._testUnit2);
    this._structTree = new modeleditor.class.StructTree({
        root:this._model,
        nodeEditEnable:true,
        nodeEditEnable:true,
        nodeSelectEnable:true
    });
    this._actionList = new hy.gui.SimpleListView({
        items:this._model.getActionNames(),
        cellMoveEnable:true,
        cellEditEnable:true,
        cellSelectEnable:true
    });
    this._nameTree = new modeleditor.class.NameTree({
        root:this._model
    });
    this._timeTree = new modeleditor.class.TimeTree({
        headerView:new hy.gui.TimelineRule({height:23, normalColor:hy.gui.colors.DGRAY}),
        headerViewFloat:true,
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
    this.addChildNodeAtLayer(this._menuSplitView, 0);
    this.addChildNodeAtLayer(this._mainView, 0);
    this._structTree.addObserver(this._structTree.notifyTreeNodeSelected, this , this._modelUnitSelected);
    this._nameTree.addObserver(this._nameTree.notifyTreeNodeSelected, this, this._modelUnitSelected);
    this._timeTree.addObserver(this._timeTree.notifyTreeNodeSelected, this, this._modelUnitSelected);
    this._structTree.addObserver(this._structTree.notifyTreeNodeUnSelected, this, this._modelUnitUnSelected);
    this._nameTree.addObserver(this._nameTree.notifyTreeNodeUnSelected, this, this._modelUnitUnSelected);
    this._timeTree.addObserver(this._timeTree.notifyTreeNodeUnSelected, this, this._modelUnitUnSelected);
    this.addObserver(this.notifyLayoutSubNodes, this, this._layoutModelEditor);
}
modeleditor.class.ModelEditor.prototype._layoutModelEditor = function(sender){
    this._menu.setX(0);
    this._menu.setY(0);
    this._menu.setWidth(this.getWidth());
    this._menu.setHeight(27);
    this._menuSplitView.setX(0);
    this._menuSplitView.setY(27);
    this._menuSplitView.setWidth(this.getWidth());
    this._menuSplitView.setHeight(5);
    this._mainView.setX(0);
    this._mainView.setY(32);
    this._mainView.setWidth(this.getWidth());
    this._mainView.setHeight(this.getHeight() - 32);
}
modeleditor.class.ModelEditor.prototype._modelUnitSelected = function(sender, nodePath){
    if(sender != this._structTree){
        this._structTree.setSelectedNodePath(nodePath);
        this._structTree.needReloadTree();
    }
    if(sender != this._nameTree){
        this._nameTree.setSelectedNodePath(nodePath);
        this._nameTree.needReloadTree();
    }
    if(sender != this._timeTree){
        this._timeTree.setSelectedNodePath(nodePath);
        this._timeTree.needReloadTree();
    }
    var nodeUnit = this._structTree.getNodeUnitOfNodePath(nodePath, nodePath.length);
    if(nodeUnit){
        nodeUnit.setDragEnable(true);
        nodeUnit.setResizeEnable(true);
        nodeUnit.setRotateEnable(true);
        nodeUnit.setAnchorMoveEnable(true);
    }
}
modeleditor.class.ModelEditor.prototype._modelUnitUnSelected = function(sender, nodePath){
    var nodeUnit = this._structTree.getNodeUnitOfNodePath(nodePath, nodePath.length);
    if(nodeUnit){
        nodeUnit.setDragEnable(false);
        nodeUnit.setResizeEnable(false);
        nodeUnit.setRotateEnable(false);
        nodeUnit.setAnchorMoveEnable(false);
    }
}