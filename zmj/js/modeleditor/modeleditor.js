var modeleditor = modeleditor || {};
modeleditor.app = modeleditor.app || {};
modeleditor.app.menu = new hy.gui.Menu({
    normalColor:'#0f0',
    menuItems:[
        {
            name:"item1",
            dropItems: [
                {
                    name:"item1-1"
                },
                {
                    name:"item1-2"
                }
            ]
        },
        {
            name:"item2",
            dropItems: [
                {
                    name:"item2-1"
                },
                {
                    name:"item2-2"
                }
            ]
        }
    ]
});
modeleditor.app.structTree = new modeleditor.class.StructTree({});
modeleditor.app.namesTree = new modeleditor.class.NameTree({});
modeleditor.app.timesTree = new modeleditor.class.TimeTree({});
modeleditor.app.actionsList = new hy.gui.SimpleListView({});
modeleditor.app.window = new hy.gui.SplitView({
    normalColor:null,
    activeColor:null,
    splitViews:[
        modeleditor.app.menu,
        new hy.gui.SplitView({
            normalColor:null,
            activeColor:null,
            splitViews:[
                new hy.gui.Panel({
                    contentView:modeleditor.app.structTree
                }),
                new hy.gui.SplitView({
                    normalColor:null,
                    activeColor:null,
                    splitViews:[
                        new hy.gui.Panel({
                            contentView:modeleditor.app.actionsList
                        }),
                        new hy.gui.Panel({
                            contentView:new hy.gui.SplitView({
                                normalColor:null,
                                activeColor:null,
                                splitViews:[
                                    modeleditor.app.namesTree,
                                    modeleditor.app.timesTree
                                ],
                                splitSpace:3,
                                splitDirection:0,
                                splitInitLayout:[25, 100],
                                adjustEnable:true,
                                autoAdjustViewIndex:1
                            })
                        })
                    ],
                    splitSpace:3,
                    splitDirection:0,
                    splitInitLayout:[25, 100],
                    adjustEnable:true,
                    autoAdjustViewIndex:1
                })
            ],
            splitSpace:3,
            splitDirection:0,
            splitInitLayout:[25, 100],
            adjustEnable:true,
            autoAdjustViewIndex:1
        }),
    ],
    splitSpace:1,
    splitDirection:1,
    splitInitLayout:[25, 100],
    adjustEnable:false,
    autoAdjustViewIndex:1
});
modeleditor.app.notifyCenter = new hy.Notification({});
