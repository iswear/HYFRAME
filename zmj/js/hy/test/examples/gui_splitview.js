var testNode = new hy.gui.SplitView({
    x:10,
    y:10,
    width:500,
    height:200,
    normalColor:'#000',
    autoAdjustViewIndex:1,
    splitInitLayout:[100,200,100],
    splitViews:[
        new hy.gui.View({normalColor:"#f00"}),
        new hy.gui.View({normalColor:"#0f0"}),
        new hy.gui.View({normalColor:"#00f"})
    ]
});