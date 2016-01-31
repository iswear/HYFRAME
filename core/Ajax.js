HY.Core.Ajax = function(config){
    this.init(config);
}
HY.Core.Ajax.prototype = new HY.Object();
HY.Core.Ajax.prototype.initMember = function(config){
    this.superCall("initMember");
    if(config.url != undefined){ this._url = config.url; } else { this._url = null; }
    if(config.arg != undefined){ this._arg = config.arg; } else { this._arg = null; }
    if(config.mode != undefined){ this._mode = config.mode; } else { this._mode = 'GET'; }
    if(config.callbackSelector != undefined){ this._callbackSelector = config.callbackSelector; } else { this._callbackSelector = null; }
    if(config.callbackTarget != undefined){ this._callbackTarget = config.callbackTarget; } else { this._callbackTarget = null }
    this._xmlHttp = new XMLHttpRequest();
}
HY.Core.Ajax.prototype.getUrl = function(){
    return this._url;
}
HY.Core.Ajax.prototype.setUrl = function(pUrl){
    this._url = pUrl;
}
HY.Core.Ajax.prototype.getArg = function(){
    return this._arg;
}
HY.Core.Ajax.prototype.setArg = function(pArg){
    this._arg = pArg;
}
HY.Core.Ajax.prototype.getMode = function(){
    return this._mode;
}
HY.Core.Ajax.prototype.setMode = function(pMode){
    this._mode = pMode;
}
HY.Core.Ajax.prototype.getCallbackSelector = function(){
    return this._callbackSelector;
}
HY.Core.Ajax.prototype.setCallbackSelector = function(pSelector){
    this._callbackSelector = pSelector;
}
HY.Core.Ajax.prototype.getCallbackTarget = function(){
    return this._callbackTarget;
}
HY.Core.Ajax.prototype.setCallbackTarget = function(pTarget){
    this._callbackTarget = pTarget;
}
HY.Core.Ajax.prototype.sendsync = function(){
    if(this._mode.toUpperCase() == "POST"){
        if(this._url){
            this._xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            this._xmlHttp.open("POST",this._url,false);
            this._xmlHttp.send(this._arg);
            return this._xmlHttp;
        }
    }else{
        if(this._url){
            this._xmlHttp.open("GET",this._url+"?"+this._arg,false);
            this._xmlHttp.send();
            return this._xmlHttp;
        }
    }
}
HY.Core.Ajax.prototype.sendAsync = function(){
    var $this = this;
    if(this._mode.toUpperCase() == "POST"){
        this._xmlHttp.onreadystatechange = function(){
            if(this.readyState == 4){
                if(this.status == 200){
                    if($this._callbackSelector){
                        if($this._callbackTarget){
                            $this._callbackSelector.apply($this._callbackTarget,[this,true]);
                        }else{
                            $this._callbackSelector.apply($this,[this,true]);
                        }
                    }
                }else{
                    if($this._callbackSelector){
                        if($this._callbackTarget){
                            $this._callbackSelector.apply($this._callbackTarget,[this,true]);
                        }else{
                            $this._callbackSelector.apply($this,[this,false]);
                        }
                    }
                }
            }
        }
        this._xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        this._xmlHttp.open("POST",this._url,false);
        this._xmlHttp.send(this._arg);
    }else{
        this._xmlHttp.onreadystatechange = function(){
            if(this.readyState == 4){
                if(this.status == 200){
                    $this._callbackSelector.apply($this._callbackTarget,[this,true]);
                }else{
                    $this._callbackSelector.apply($this._callbackTarget,[this,true]);
                }
            }
        }
        this._xmlHttp.open("GET",this._url+"?"+this._arg,false);
        this._xmlHttp.send();
    }
}
HY.Core.Ajax.prototype.sendWithParamSync = function(pUrl,pArg,pMode){
    this._url = pUrl;
    this._arg = pArg;
    this._mode = pMode;
    return this.sendsync();
}
HY.Core.Ajax.prototype.sendWithParamAsync = function(pUrl,pArg,pMode){
    this._url = pUrl;
    this._arg = pArg;
    this._mode = pMode;
    this.sendAsync();
}