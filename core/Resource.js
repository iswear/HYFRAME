HY.Core.Resource = {};
HY.Core.Resource.DesMode = {};
HY.Core.Resource.DesMode.AUTO = 1;
HY.Core.Resource.DesMode.NEVER = 2;

HY.Core.Resource.FileExt = {};
HY.Core.Resource.FileExt.IMAGE = ["png","jpg","bmp","gif"];
HY.Core.Resource.FileExt.AUDIO = ["mp3","mp3","m4a","acc","ogg","wav"];
HY.Core.Resource.FileExt.VEDIO = ["mp4","ogg"];

HY.Core.Resource.Manager = function(config){
    this.init(config);
}
HY.Core.Resource.Manager.prototype = new HY.Object();
HY.Core.Resource.Manager.prototype.init = function(config){
    this._loadingImageItems = {};
    this._loadedImageItems = {};
    this._loadingAudioItems = {};
    this._loadedAudioItems = {};
    this._loadingVedioItems = {};
    this._loadedVedioItems = {};
    this.superCall("init",[config]);
}
HY.Core.Resource.Manager.prototype.addImageAsync = function(key,url,callBack,target){
    if(!this._loadingImageItems[key] && !this._loadedImageItems[key]){
        var $this = this;
        var image = new Image();
        image.src = url;
        this._loadingImageItems[key] = image;

        function loadsuccess(){
            this.removeEventListener("load",loadsuccess,false);
            this.removeEventListener("error",loaderror,false);
            delete $this._loadingImageItems[key];
            $this._loadedImageItems[key] = image;
            $this._loadCallBack(callBack,target,url,true);
        }

        function loaderror(){
            this.removeEventListener("load",loadsuccess,false);
            this.removeEventListener("error",loaderror,false);
            delete $this._loadingImageItems[key];
            $this._loadCallBack(callBack,target,url,false);
        }

        image.addEventListener("load",loadsuccess,false);
        image.addEventListener("error",loaderror,false);
    }
}
HY.Core.Resource.Manager.prototype.addAudioAsync = function(key,url,callBack,target){
    if(!this._loadingAudioItems[key] && !this._loadedAudioItems[key]){
        var $this = this;
        var audio = new Audio();
        audio.src = url;
        this._loadingAudioItems[key] = audio;

        function loadsuccess(){
            this.removeEventListener("canplaythrough",loadsuccess,false);
            this.removeEventListener("error",loaderror,false);
            delete $this._loadingAudioItems[key];
            $this._loadingAudioItems[key] = audio;
            $this._loadCallBack(callBack,target,url,true);
        }
        function loaderror(){
            this.removeEventListener("canplaythrough",loadsuccess,false);
            this.removeEventListener("error",loaderror,false);
            delete $this._loadingAudioItems[key];
            $this._loadCallBack(callBack,target,url,false);
        }
        audio.addEventListener("canplaythrough",loadsuccess,false);
        audio.addEventListener("error",loaderror,false);
    }
}
HY.Core.Resource.Manager.prototype.addVedioAsync = function(key,url,callBack,target){
    if(!this._loadingVedioItems[key] && !this._loadedVedioItems[key]) {
        var $this = this;
        var vedio = new Video();
        vedio.src = url;
        this._loadingVedioItems[key] =  vedio;

        function loadsuccess(){
            this.removeEventListener("canplaythrough",loadsuccess,false);
            this.removeEventListener("error",loaderror,false);
            delete this._loadingVedioItems[key];
            this._loadedVedioItems[key] = vedio;
            $this._loadCallBack(callBack,target,url,true);
        }
        function loaderror(){
            this.removeEventListener("canplaythrough",loadsuccess,false);
            this.removeEventListener("error",loaderror,false);
            delete $this._loadingVedioItems[key];
            $this._loadCallBack(callBack,target,url,false);
        }
        vedio.addEventListener("canplaythrough",loadsuccess,false);
        vedio.addEventListener("error",loaderror,false);
    }
}
HY.Core.Resource.Manager.prototype.getImage = function(key,url,replaceUrl,callBack,target){
    var image = this._loadedImageItems[key];
    if(!image){
        if(url.indexOf("data") == 0){
            image = new Image();
            image.src = url;
            this._loadedImageItems[key] = image;
        }else{
            this.addImageAsync(key,url,callBack,target);
        }
    }
    if(!image && replaceUrl){
        image = this._loadedImageItems[replaceUrl];
    }
    return image;
}
HY.Core.Resource.Manager.prototype.getAudio = function(key,url,replaceUrl,callBack,target){
    var audio = this._loadedAudioItems[key];
    if(!audio){
        if(url.indexOf("data") == 0){
            audio = new Audio();
            audio.src = url;
            this._loadedAudioItems[key] = audio;
        }else{
            this.addAudioAsync(url,callBack,target);
        }
    }
    if(!audio && replaceUrl){
        audio = this._loadedAudioItems[replaceUrl];
    }
    return audio;
}
HY.Core.Resource.Manager.prototype.getVedio = function(key,url,replaceUrl,callBack,target){
    var vedio = this._loadedVedioItems[key];
    if(!vedio){
        if(url.indexOf("data") == 0){
            vedio = new Vedio();
            vedio.src = url;
            this._loadedVedioItems[key] = vedio;
        }else{
            this.addVedioAsync(url,callBack,target);
        }
    }
    if(!vedio && replaceUrl){
        vedio = this._loadedVedioItems[replaceUrl];
    }
    return vedio;
}
HY.Core.Resource.Manager.prototype.removeImage = function(key){
    if(this._loadingImageItems[key]){
        delete this._loadingImageItems[key];
    }
    if(this._loadedImageItems[key]){
        delete this._imageItems[key];
    }
}
HY.Core.Resource.Manager.prototype.removeAudio = function(key){
    if(this._loadingAudioItems[key]){
        delete this._loadingAudioItems[key];
    }
    if(this._loadedAudioItems[key]){
        delete this._loadedAudioItems[key];
    }
}
HY.Core.Resource.Manager.prototype.removeVedio = function(key){
    if(this._loadingVedioItems[key]){
        delete this._loadingVedioItems[key];
    }
    if(this._loadedVedioItems[key]){
        delete this._loadedVedioItems[key];
    }
}
HY.Core.Resource.Manager.prototype.removeAllImage = function(){
    for(var itemname in this._loadingImageItems){
        delete this._loadingImageItems[itemname];
    }
    for(var itemname in this._loadedImageItems){
        delete this._loadedImageItems[itemname];
    }
}
HY.Core.Resource.Manager.prototype.removeAllAudio = function(){
    for(var itemname in this._loadingAudioItems[itemname]){
        delete this._loadingAudioItems[itemname];
    }
    for(var itemname in this._loadedAudioItems){
        delete this._loadedAudioItems[itemname];
    }
}
HY.Core.Resource.Manager.prototype.removeAllVedio = function(){
    for(var itemname in this._loadingVedioItems){
        delete this._loadingVedioItems[itemname];
    }
    for(var itemname in this._loadedVedioItems){
        delete this._loadedVedioItems[itemname];
    }
}
HY.Core.Resource.Manager.prototype._loadCallBack = function(callBack,target,url,success){
    if(callBack){
        if(target){
            callBack.call(target,url,success);
        }else{
            callBack.call(this,url,success);
        }
    }
}