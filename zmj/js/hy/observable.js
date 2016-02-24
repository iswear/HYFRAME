var hy = hy || {};
hy.Observable = hy.extend(hy.Object);
hy.Observable.prototype.init = function(config){
    this.superCall("init",[config]);
    this._localNotification = new hy.Notification({});
}
hy.Observable.prototype.addObserver = function(name, target, callBack){
    this._localNotification.addObserver(name, target, callBack, this);
}
hy.Observable.prototype.removeObserver = function(name, target, callBack){
    this._localNotification.removeObserver(name, target, callBack, this);
}
hy.Observable.prototype.postNotification = function(name , params){
    this._localNotification.postNotification(name, this, params);
}
hy.Observable.prototype.clean = function(){
    this._localNotification.clean();
    this._localNotification = null;
    this.superCall("clean");
}