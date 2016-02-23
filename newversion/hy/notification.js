var hy = hy || {};
hy.Notification = hy.extend(hy.Object);
hy.Notification.prototype.init = function(config){
    this.superCall("init",[config]);
    this._observers = {};
}
hy.Notification.prototype.addObserver = function(name, target, callBack, sender){
    if(!this._observers[name]){
        this._observers[name] = [];
    }
    var observer;
    for(var i = 0, len = this._observers[name].length ; i < len ; ++i){
        observer = this._observers[name][i];
        if(observer.target == target && observer.callBack == callBack && observer.sender == sender){
            return;
        }
    }
    this._observers[name].push({target:target,callBack:callBack,sender:sender});
}
hy.Notification.prototype.removeObserver = function(name, target, callBack, sender){
    if(this._observers[name]){
        for(var i = this._observers[name].length-1 ; i >= 0 ; --i){
            var observer = this._observers[name][i];
            if(observer.target == target && observer.callBack == callBack && observer.sender == sender){
                this._observers[name].splice(i, 1);
            }
        }
    }
}
hy.Notification.prototype.postNotification = function(name, sender , params){
    if(this._observers[name]){
        var observers = this._observers[name];
        var observer = null;
        params = params ? params : [];
        params.unshift(sender);
        for(var i = 0, len = observers.length ; i < len ; ++i){
            //try{
                observer = observers[i];
                if(observer.sender || observer.sender == sender){
                    observer.callBack.apply(observer.target, params);
                }
            //}catch (err){ window.console.log(err); }
        }
    }
}
hy.Notification.prototype.clean = function(){
    this._observers = {};
    this.superCall("clean");
}