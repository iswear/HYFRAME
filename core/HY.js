var HY = {};

HY.isMobilePlatformInitFlag = false;
HY.isMobilePlatformFlag = false;
HY.isMobilePlatform = function(){
    if(!HY.isMobilePlatformInitFlag){
        HY.isMobilePlatformFlag = (navigator.userAgent.toLowerCase().indexOf("mobile") != -1);
        HY.isMobilePlatformInitFlag = true;
    }
    return HY.isMobilePlatformFlag;
}

HY.Object = function(config){}
HY.Object.prototype.superCall = function(funName,args){
    var runflag = false;
    var retValue;
    if(this.__assistSuper == null){
        this.__assistSuper = {};
    }
    if(this.__assistPreSuper == null){
        this.__assistPreSuper = {};
    }
    while(!runflag){
        if(!this.__assistSuper[funName]){
            if(this._super){
                this.__assistPreSuper[funName] = this;
                this.__assistSuper[funName] = this._super;
            }
        }else{
            if(this.__assistPreSuper[funName]._super){
                this.__assistPreSuper[funName] = this.__assistPreSuper[funName]._super;
            }else{
                this.__assistPreSuper[funName] = null;
            }
            if(this.__assistSuper[funName]._super){
                this.__assistSuper[funName] = this.__assistSuper[funName]._super;
            }else{
                this.__assistSuper[funName] = null;
            }
        }
        var preSuper = this.__assistPreSuper[funName];
        var tempSuper = this.__assistSuper[funName];
        if(tempSuper && tempSuper[funName]){
            if(!(preSuper && preSuper[funName] && preSuper[funName] == tempSuper[funName])){
                retValue = tempSuper[funName].apply(this,args);
                runflag = true;
            }
        }else{
            runflag = true;
        }
    }
    this.__assistSuper[funName] = null;
    return retValue;
}
HY.Object.prototype.init = function(config){
    this._super = HY.Object.prototype.init.caller.prototype;
    if(config){
        this.initMember(config);
        this.initConstraint();
        config = null;
    }
}
HY.Object.prototype.initMember = function(config){}
HY.Object.prototype.initConstraint = function(){}
HY.Object.prototype.destory = function(){}

HY.Vect2D = function(config){
    this.init(config);
}
HY.Vect2D.prototype = new HY.Object();
HY.Vect2D.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.x != undefined){ this.x = config.x; } else { this.x = 0; }
    if(config.y != undefined){ this.y = config.y; } else { this.y = 0; }
}
HY.Vect2D.prototype.getAngle = function(){
    if(this.x == 0 && this.y == 0){
        return 0;
    }else {
        var angle = Math.atan2(this.y,this.x);
        return angle;
    }
}
HY.Vect2D.prototype.normalize = function(){
    var mold = this.mold();
    this.x = this.x/mold;
    this.y = this.y/mold;
}
HY.Vect2D.prototype.mold = function(){
    return Math.sqrt(this.moldSquare());
}
HY.Vect2D.prototype.moldSquare = function(){
    return this.x*this.x+this.y*this.y;
}

HY.Size2D = function(config){
    this.init(config);
}
HY.Size2D.prototype = new HY.Object();
HY.Size2D.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.width != undefined){ this.width = config.width; } else { this.width = 0; }
    if(config.height != undefined){ this.height = config.height; } else { this.height = 0; }
}

HY.Rect2D = function(config){
    this.init(config);
}
HY.Rect2D.prototype = new HY.Object();
HY.Rect2D.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.x != undefined){ this.x = config.x; } else { this.x = 0; }
    if(config.y != undefined){ this.y = config.y; } else { this.y = 0; }
    if(config.width != undefined){ this.width = config.width; } else { this.width = 0; }
    if(config.height != undefined){ this.height = config.height; } else { this.height = 0; }
}

HY.Circle = function(config){
    this.init(config);
}
HY.Circle.prototype = new HY.Object();
HY.Circle.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.x != undefined){ this.x = config.x; } else { this.x = 0; }
    if(config.y != undefined){ this.y = config.y; } else { this.y = 0; }
    if(config.radius != undefined){ this.radius = config.radius; } else { this.radius = 0; }
}

HY.Edge = function(config){
    this.init(config);
}
HY.Edge.prototype = new HY.Object();
HY.Edge.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.point1){ this.point1 = new HY.Vect2D(config.point1); } else { this.point1 = new HY.Vect2D({}); }
    if(config.point2){ this.point2 = new HY.Vect2D(config.point2); } else { this.point2 = new HY.Vect2D({}); }
}

HY.Polygon = function(config){
    this.init(config);
}
HY.Polygon.prototype = new HY.Object();
HY.Polygon.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._points = [];
    if(config.points){
        var len = config.points.length;
        for(var i=0;i<len;++i){
            this._points.push(new HY.Vect2D(config.points[i]));
        }
    }
}
HY.Polygon.prototype.getPoints = function(){
    return this._points;
}


HY.parsePxstrToInt = function(value){
    try{
        if(value.length > 2 && value.toLowerCase().indexOf("px") != -1){
            return parseInt(value.substr(0,value.length-2));
        }else{
            return 0;
        }
    }catch(err){
        return 0;
    }
}
HY.getElementPositionInPage = function(pNode){
    var position = new HY.Vect2D({});
    if(pNode.offsetLeft){
        alert("offsetleft:"+pNode.offsetLeft);
        position.x = pNode.offsetLeft;
    }else{
        position.x = HY.parsePxstrToInt(pNode.style.left);
    }
    if(pNode.offsetTop){
        alert("offsetTop:"+pNode.offsetTop);
        position.y = pNode.offsetTop;
    }else{
        position.y = HY.parsePxstrToInt(pNode.style.top);
    }
    return position;
}
HY.getDocumentSize = function(){
    var size = new HY.Size2D({});
    if(window.innerHeight){
        size.width = window.innerWidth;
        size.height = window.innerHeight;
    }else if(window.document.documentElement.clientHeight){
        size.width = window.document.documentElement.clientWidth;
        size.height = window.document.documentElement.clientHeight;
    }else if(window.document.body.clientHeight){
        size.width = window.document.body.clientWidth;
        size.height = window.document.body.clientHeight;
    }
    return size;
}

HY.setTimeout = function(pThis,pFun,pTime){
    window.setTimeout(pFun.bind(pThis),pTime);
}
HY.setInterval = function(pThis,pFun,pTime){
    window.setInterval(pFun.bind(pThis),pTime);
}

HY.clone = function(obj){
    if(obj instanceof Array){
        var ret = [];
        var size = obj.length;
        for(var i=0;i<size;++i){
            ret.push(HY.clone(obj[i]));
        }
        return ret;
    }else if(obj instanceof Object){
        var ret = {};
        for(var item in obj){
            ret[item] = HY.clone(obj[item]);
        }
        return ret;
    }else{
        return obj;
    }
}