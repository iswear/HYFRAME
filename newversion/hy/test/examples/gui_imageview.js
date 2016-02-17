var testNode = new hy.gui.ImageView({
    x:100,
    y:100,
    width:100,
    height:100,
    clipBound:false,
    image:hy.test.IMAGES_ROOT+"book.jpg",
    mirror: hy.gui.MIRROR_BOTH
    //reverse:hy.gui.MIRROR_NONE
});

function change(){
    if(testNode.getMirror() == 1){
        testNode.setMirror(hy.gui.MIRROR_BOTH);
    }else{
        testNode.setMirror(testNode.getMirror()-1);
    }
}
testNode.addObserver(testNode.notifyMouseDown,window,change);