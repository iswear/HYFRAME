var AniEditor = {};

AniEditor.DATA = {};
AniEditor.DATA.menu_items = [
    {
        title:"项目",
        dropItems:["新建","保存"]
    }
];

AniEditor.EVENT = {};
AniEditor.EVENT.window_autosize = function(sender){
    var app = sender.getApplication();
    if(app){
        sender.setWidth(app.getAppWidth());
        sender.setHeight(app.getAppHeight());
    }
}
AniEditor.EVENT.tree_nodeselect = function(sender, nodePath){
    this.UI.structTree.setSelectedNodePath(nodePath);
    this.UI.unitTimeNames.setSelectedNodePath(nodePath);
    this.UI.unitTimeLines.setSelectedNodePath(nodePath);
}
AniEditor.EVENT.mode

AniEditor.UI = {};
AniEditor.UI.menu = new HY.GUI.Menu({
    height:25,
    backgroundColor:'#ffffff',
    items:AniEditor.DATA.menu_items
});
AniEditor.UI.Model = new HY.Game.Model({
    name:"新模型",
    x:0,
    y:0,
    width:200,
    height:200,
    backgroundColor:"#ffffff",
    actionNames:["walk"]
});
AniEditor.UI.ModelContainer = new HY.GUI.Panel({
    title:"编辑",
    viewPort:new HY.GUI.View({backgroundColor:"#aaaaff"})
});
AniEditor.UI.structTree = new HY.GUI.ModelStructTreeView({
    root:AniEditor.UI.Model
});
AniEditor.UI.aniNamesList = new HY.GUI.SimpleListView({
    cellSelectEnable:true,
    items:AniEditor.UI.Model.getActionNames()
});
AniEditor.UI.unitTimeNames = new HY.GUI.ModelNameTreeView({
    root:AniEditor.UI.Model
});
AniEditor.UI.unitTimeLines = new HY.GUI.ModelTimeTreeView({
    root:AniEditor.UI.Model
});
AniEditor.UI.window = new HY.GUI.Window({
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
                        viewPort:AniEditor.UI.structTree
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
                                    AniEditor.UI.ModelContainer ,
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
                                        viewPort:AniEditor.UI.aniNamesList
                                    }),
                                    new HY.GUI.Panel({
                                        title:"时间轴",
                                        viewPort:new HY.GUI.SplitView({
                                            width:280,
                                            autoAdjustViewIndex:1,
                                            splitDirection: 0,
                                            splitInitLayout:[120,160],
                                            splitViews:[
                                                AniEditor.UI.unitTimeNames,
                                                AniEditor.UI.unitTimeLines
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

AniEditor.UI.ModelContainer.getViewPort().addChildNodeAtLayer(AniEditor.UI.Model,0);

AniEditor.UI.window.addEventListener("finishlaunch",AniEditor.EVENT.window_autosize,AniEditor.UI.window);
AniEditor.UI.window.addEventListener("canvassizechanged",AniEditor.EVENT.window_autosize,AniEditor.UI.window);
AniEditor.UI.structTree.addEventListener("nodeselected",AniEditor.EVENT.tree_nodeselect,AniEditor);
AniEditor.UI.unitTimeNames.addEventListener("nodeselected",AniEditor.EVENT.tree_nodeselect,AniEditor);
AniEditor.UI.unitTimeLines.addEventListener("nodeselected",AniEditor.EVENT.tree_nodeselect,AniEditor);