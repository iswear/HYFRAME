var contentView = new hy.gui.View({
    x:0,
    y:0,
    width:200,
    height:400
});
var imageNode = new hy.gui.ImageView({
    x:100,
    y:300,
    width:100,
    height:100,
    clipBound:false,
    image:hy.test.IMAGES_ROOT+"book.jpg",
    mirror: hy.gui.MIRROR_BOTH
});

contentView.addChildNodeAtLayer(imageNode, 0);

var testNode = new hy.gui.ScrollView({
    x:10,
    y:10,
    width:100,
    height:100,
    contentView:contentView,
    normalColor:'#ff0'
});

