var testNode = new hy.gui.Menu({
    x:10,
    y:10,
    width:200,
    height:25,
    normalColor:'#f00',
    activeColor:'#0f0',
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