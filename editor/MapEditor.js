var MapEditor = {};

MapEditor.DATA = {};
MapEditor.DATA.menu_items = [
    {
        title:"项目",
        dropItems:["新建","保存"]
    },
    {
        title:"插入",
        dropItems:["组件","剧情"]
    },
    {
        title:"模式",
        dropItems:["编辑","运行"]
    },
    {
        title:"帮助",
        dropItems:["帮助说明","说明"]
    }];

MapEditor.EVENT = {};
MapEditor.EVENT.window_autosize = function(sender){
    var app = sender.getApplication();
    if(app){
        sender.setWidth(app.getAppWidth());
        sender.setHeight(app.getAppHeight());
    }
}
MapEditor.EVENT.menu_menuitem = function(sender,e,menuIndex,sectionIndex,cellIndex){
    alert("menuIndex:"+menuIndex+"sectionIndex:"+sectionIndex+"cellIndex:"+cellIndex);
}

MapEditor.UI = {};
MapEditor.UI.menu = new HY.GUI.Menu({
    height:25,
    backgroundColor:'#ffffff',
    items:MapEditor.DATA.menu_items
});
MapEditor.UI.projectTree = new HY.GUI.SimpleTreeView({
    x:0,
    y:0,
    width:100,
    height:100,
    root:{name:"项目名称",expanded:true,leaf:false,childNodes:[
        {name:"地图",leaf:false},
        {name:"剧情",leaf:false}
    ]}
});
MapEditor.UI.modelTree = new HY.GUI.SimpleTreeView({
    root:{name:"项目名称",expanded:true,leaf:false,childNodes:[
        {name:"地表",leaf:false},
        {name:"画笔",leaf:false},
        {name:"地表装饰",leaf:false},
        {name:"地面装饰",leaf:false},
        {name:"精灵",leaf:false}
    ]}
});
MapEditor.UI.window = new HY.GUI.Window({
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
            MapEditor.UI.menu,
            new HY.GUI.SplitView({
                width: 600,
                autoAdjustViewIndex: 1,
                splitInitLayout: [150, 300, 150],
                splitViews: [
                    new HY.GUI.Panel({
                        title:"项目工程",
                        viewPort:MapEditor.UI.projectTree
                    }),
                    new HY.GUI.Panel({
                        title:"地图编辑器"
                    }),
                    new HY.GUI.Panel({
                        title:"资源",
                        viewPort:MapEditor.UI.modelTree
                    })
                ]
            })
        ]
    })
});

MapEditor.UI.window.addEventListener("finishlaunch",MapEditor.EVENT.window_autosize,MapEditor.UI.window);
MapEditor.UI.window.addEventListener("canvassizechanged",MapEditor.EVENT.window_autosize,MapEditor.UI.window);
MapEditor.UI.menu.addEventListener("menuitem",MapEditor.EVENT.menu_menuitem,MapEditor.UI.menu);
