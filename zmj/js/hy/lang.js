var hy = hy || {};
hy.extend = function(base){
    var zero = function(config){
        if(config){
            this.init(config);
            this.sync();
        }
    }
    if(base){
        zero.prototype = new base();
        zero.prototype._super_ = base.prototype;
    }else{
        zero.prototype.init = function(config){}
        zero.prototype.sync = function(){}
        zero.prototype.isUndefined = function(obj){
            return obj == undefined;
        }
    }
    return zero;
}
hy.setTimeout = function(target, callBack, time){
    window.setTimeout(callBack.bind(target), time);
}
hy.setInterval = function(target, callBack, time){
    window.setInterval(callBack.bind(target), time);
}
hy.clone = function(obj){
    if(obj instanceof  Array){
        var retArr = [];
        for(var i = 0, size = obj.length ; i < size ; ++i){
            retArr.push(hy.clone(obj[i]));
        }
        return retArr;
    }else if(obj instanceof Object){
        var retObj = {};
        for(var item in obj){
            retObj[item] = hy.clone(obj[item]);
        }
        return retObj;
    }else{
        return obj;
    }
}