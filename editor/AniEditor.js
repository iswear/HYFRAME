var AniEditor = {};

AniEditor.DATA = {};
AniEditor.DATA.menu_items = [
    {
        title:"项目",
        dropItems:["新建","保存"]
    }
];

AniEditor.EVENT = {};
AniEditor.EVENT.window_autolayout = function(sender){
    var app = sender.getApplication();
    if(app){
        sender.setWidth(app.getAppWidth());
        sender.setHeight(app.getAppHeight());
    }
}
AniEditor.EVENT.modeltree_nodeselect = function(sender, nodePath){
    this.UI.modelStructTree.setSelectedNodePath(nodePath);
    this.UI.modelTimeNamesTree.setSelectedNodePath(nodePath);
    this.UI.modelTimeLinesTree.setSelectedNodePath(nodePath);
    this.FUNCTION.reloadModelTree();
}
AniEditor.EVENT.structtree_nodecontextmenu = function(sender,e,nodeView,menuCellView){
    if(nodeView && menuCellView){
        switch (menuCellView.getSectionIndex()){
            case 0:{
                switch (menuCellView.getCellIndex()){
                    case 0:
                    {
                        var newUnit = new HY.Game.Unit({backgroundColor:"#000000"});
                        var curUnit = nodeView.getNodeUnit();
                        curUnit.addChildUnit(newUnit);
                        this.FUNCTION.reloadModelTree();
                        break;
                    }
                    case 1:
                    {
                        var curUnit = nodeView.getNodeUnit();
                        curUnit.removeFromParent(true);
                        break;
                    }
                    case 2:
                    {
                        var curUnit = nodeView.getNodeUnit();
                        curUnit.setVisible(!curUnit.getVisible());
                        break;
                    }
                    default :
                        break;
                }
            }
            default :
                break;
        }
        this.UI.modelStructTree.reloadData();
        this.UI.modelTimeNamesTree.reloadData();
        this.UI.modelTimeLinesTree.reloadData();
    }
}
AniEditor.EVENT.modeltimetree_yscrolled = function(sender){
    if(sender){
        this.UI.modelTimeNamesTree.setContentOffsetY(sender.getContentOffsetY());
        this.UI.modelTimeLinesTree.setContentOffsetY(sender.getContentOffsetY());
    }
}

AniEditor.FUNCTION = {};
AniEditor.FUNCTION.reloadModelTree = function(){
    AniEditor.UI.modelStructTree.reloadData();
    AniEditor.UI.modelTimeNamesTree.reloadData();
    AniEditor.UI.modelTimeLinesTree.reloadData();
}

AniEditor.UI = {};
AniEditor.UI.menu = new HY.GUI.Menu({
    height:25,
    backgroundColor:'#ffffff',
    items:AniEditor.DATA.menu_items
});
AniEditor.UI.model = new HY.Game.Model({
    name:"新模型",
    x:0,
    y:0,
    width:200,
    height:200,
    backgroundColor:"#ffffff",
    actionNames:["walk"]
});
AniEditor.UI.modelContainer = new HY.GUI.Panel({
    title:"编辑",
    viewPort:new HY.GUI.View({backgroundColor:"#aaaaff"})
});
AniEditor.UI.modelActonsList = new HY.GUI.SimpleListView({
    cellSelectEnable:true,
    items:AniEditor.UI.model.getActionNames()
});
AniEditor.UI.modelStructTree = new HY.GUI.ModelStructTreeView({
    root:AniEditor.UI.model
});
AniEditor.UI.modelTimeNamesTree = new HY.GUI.ModelNameTreeView({
    scrollBarVisible:false,
    root:AniEditor.UI.model
});
AniEditor.UI.modelTimeLinesTree = new HY.GUI.ModelTimeTreeView({
    root:AniEditor.UI.model
});
AniEditor.UI.modelWindow = new HY.GUI.Window({
    width:610,
    height:100,
    resizeEnable:false,
    dragEnable:true,
    closeEnable:false,
    title:'地图编辑器',
    viewPort: new HY.GUI.SplitView({
        width: 600,
        adjustEnable: false,
        splitDirection: 1,
        splitInitLayout: [25, 25],
        splitViews: [
            AniEditor.UI.menu,
            new HY.GUI.SplitView({
                width: 600,
                autoAdjustViewIndex: 1,
                splitDirection: 0,
                splitInitLayout: [150, 450],
                splitViews: [
                    new HY.GUI.Panel({
                        title:"结构",
                        viewPort:AniEditor.UI.modelStructTree
                    }),
                    new HY.GUI.SplitView({
                        height:300,
                        autoAdjustViewIndex:0,
                        splitDirection: 1,
                        splitInitLayout:[150,150],
                        splitViews:[
                            new HY.GUI.SplitView({
                                width:400,
                                autoAdjustViewIndex:0,
                                splitDirection: 0,
                                splitInitLayout:[250,150],
                                splitViews:[
                                    AniEditor.UI.modelContainer ,
                                    new HY.GUI.Panel({
                                        title:"参数"
                                    })
                                ]
                            }),
                            new HY.GUI.SplitView({
                                width:400,
                                autoAdjustViewIndex:1,
                                splitDirection: 0,
                                splitInitLayout:[120,280],
                                splitViews:[
                                    new HY.GUI.Panel({
                                        title:"动作列表",
                                        viewPort:AniEditor.UI.modelActonsList
                                    }),
                                    new HY.GUI.Panel({
                                        title:"时间轴",
                                        viewPort:new HY.GUI.SplitView({
                                            width:280,
                                            autoAdjustViewIndex:1,
                                            splitDirection: 0,
                                            splitInitLayout:[120,160],
                                            splitViews:[
                                                AniEditor.UI.modelTimeNamesTree,
                                                AniEditor.UI.modelTimeLinesTree
                                            ]
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    })
});

AniEditor.UI.modelContainer.getViewPort().addChildNodeAtLayer(AniEditor.UI.model,0);

AniEditor.UI.modelWindow.addEventListener("finishlaunch",AniEditor.EVENT.window_autolayout,AniEditor.UI.window);
AniEditor.UI.modelWindow.addEventListener("canvassizechanged",AniEditor.EVENT.window_autolayout,AniEditor.UI.window);
AniEditor.UI.modelStructTree.addEventListener("nodeselected",AniEditor.EVENT.modeltree_nodeselect,AniEditor);
AniEditor.UI.modelStructTree.addEventListener("nodecontextmenu",AniEditor.EVENT.structtree_nodecontextmenu, AniEditor);
AniEditor.UI.modelTimeNamesTree.addEventListener("nodeselected",AniEditor.EVENT.modeltree_nodeselect,AniEditor);
AniEditor.UI.modelTimeNamesTree.addEventListener("contentoffsetychanged",AniEditor.EVENT.modeltimetree_yscrolled,AniEditor);
AniEditor.UI.modelTimeLinesTree.addEventListener("nodeselected",AniEditor.EVENT.modeltree_nodeselect,AniEditor);
AniEditor.UI.modelTimeLinesTree.addEventListener("contentoffsetychanged",AniEditor.EVENT.modeltimetree_yscrolled,AniEditor);
