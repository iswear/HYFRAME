var guinode = new HY.GUI.Window({
    width:400,
    height:500,
    title:"测试窗口"
});

var SimpleTree = new HY.GUI.SimpleTreeView({
    x:0,
    y:0,
    width:150,
    height:200,
    root:{
        name:"1111",
        leaf:false,
        expanded:true,
        childNodes:[
            {
                name:"1112",
                leaf:true
            },
            {
                name:"1113",
                leaf:true
            },
            {
                name:"1114",
                leaf:true
            },
            {
                name:"1115",
                leaf:true
            }
        ]
    }
});

var textBox = new HY.GUI.TextBox({
    x:0,
    y:0,
    width:100,
    height:20,
    text:"helloworld"
});

guinode.getViewPort().addChildNode(SimpleTree);

/*
hyeditorevent.map.window.finishlaunch = function(pThis){
    var app = this.getApplication();
    if(app){
        this.setWidth(app.getAppWidth());
        this.setHeight(app.getAppHeight());
    }
};
hyeditorevent.map.window.canvassizechanged = function(pThis){
    var app = this.getApplication();
    if(app){
        this.setWidth(app.getAppWidth());
        this.setHeight(app.getAppHeight());
    }
};
    */