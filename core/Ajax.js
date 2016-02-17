HY.Core.Ajax = function(config){
    this.init(config);
}
HY.Core.Ajax.prototype = new HY.Object();
HY.Core.Ajax.prototype.init = function(config){
    this._xmlHttp = new XMLHttpRequest();
    this.superCall("init",[config]);
    if(config.url != undefined){ this.setUrl(config.url); } else { this.setUrl(null); }
    if(config.args != undefined){ this.setArgs(config.args); } else { this.setArgs(null); }
    if(config.mode != undefined){ this.setMode(config.mode); } else { this.setMode("GET"); }
    if(config.callBack != undefined){ this.setCallBack(config.callBack); } else { this.setCallBack(null); }
    if(config.target != undefined){ this.setTarget(config.target); } else { this.setTarget(null); }
}
HY.Core.Ajax.prototype.getUrl = function(){
    return this._url;
}
HY.Core.Ajax.prototype.setUrl = function(url){
    this._url = url;
}
HY.Core.Ajax.prototype.getArg = function(){
    return this._args;
}
HY.Core.Ajax.prototype.setArgs = function(args){
    this._args = args;
}
HY.Core.Ajax.prototype.getMode = function(){
    return this._mode;
}
HY.Core.Ajax.prototype.setMode = function(mode){
    this._mode = mode.toUpperCase();
}
HY.Core.Ajax.prototype.getCallBack = function(){
    return this._callBack;
}
HY.Core.Ajax.prototype.setCallBack = function(callBack){
    this._callBack = callBack;
}
HY.Core.Ajax.prototype.getTarget = function(){
    return this._target;
}
HY.Core.Ajax.prototype.setTarget = function(target){
    this._target = target;
}
HY.Core.Ajax.prototype.sendsync = function(){
    if(this._mode == "POST"){
        if(this._url){
            this._xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            this._xmlHttp.open("POST",this._url,false);
            this._xmlHttp.send(this._args);
            return this._xmlHttp;
        }
    }else{
        if(this._url){
            this._xmlHttp.open("GET",this._url+"?"+this._args,false);
            this._xmlHttp.send();
            return this._xmlHttp;
        }
    }
}
HY.Core.Ajax.prototype.sendAsync = function(){
    var $this = this;
    if(this._mode == "POST"){
        this._xmlHttp.onreadystatechange = function(){
            if(this.readyState == 4){
                if(this.status == 200){
                    if($this._callBack){
                        if($this._target){
                            $this._callBack.apply($this._target,[this,true]);
                        }else{
                            $this._callBack.apply($this,[this,true]);
                        }
                    }
                }else{
                    if($this._callBack){
                        if($this._target){
                            $this._callBack.apply($this._target,[this,true]);
                        }else{
                            $this._callBack.apply($this,[this,false]);
                        }
                    }
                }
            }
        }
        this._xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        this._xmlHttp.open("POST",this._url,false);
        this._xmlHttp.send(this._args);
    }else{
        this._xmlHttp.onreadystatechange = function(){
            if(this.readyState == 4){
                if(this.status == 200){
                    $this._callBack.apply($this._target,[this,true]);
                }else{
                    $this._callBack.apply($this._target,[this,true]);
                }
            }
        }
        this._xmlHttp.open("GET",this._url+"?"+this._args,false);
        this._xmlHttp.send();
    }
}
HY.Core.Ajax.prototype.sendWithParamSync = function(url,args,mode){
    this._url = url;
    this._args = args;
    this._mode = pMode;
    return this.sendsync();
}
HY.Core.Ajax.prototype.sendWithParamAsync = function(url,args,mode,callBack,target){
    this._url = url;
    this._args = args;
    this._mode = mode;
    this._callBack = callBack;
    this._target = target;
    this.sendAsync();
}