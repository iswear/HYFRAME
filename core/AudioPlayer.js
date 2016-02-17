HY.Core.AudioPlayer = function(config){
    this.init(config);
}
HY.Core.AudioPlayer.prototype = new HY.Object();
HY.Core.AudioPlayer.prototype.init = function(config){
    this._playerStack = [];
    this.superCall("init",[config]);
}
HY.Core.AudioPlayer.prototype.playAudio = function(pAudioItem){
    if(pAudioItem){
        for(var i = this._playerStack.length-1 ;i>=0;--i){
            if(this._playerStack[i] == pAudioItem){
                this._playerStack.splice(i,0);
            }
        }
        if(pAudioItem.paused){
            pAudioItem.play();
        }
        this._playerStack.push(pAudioItem);
    }
}
HY.Core.AudioPlayer.prototype.stopAudio = function(pAudioItem){
    pAudioItem.pause();
    pAudioItem.currentTime = 0;
    var i=this._playerStack.length-1;
    if(i > 0){
        if(this._playerStack[i] == pAudioItem){
            this._playerStack.splice(i,1);
        }else{
            for(;i>=0;--i){
                if(this._playerStack[i] == pAudioItem){
                    this._playerStack.splice(i,1);
                    break;
                }
            }
        }
        var j = this._playerStack.length-1;
        if(j>=0){
            var curaudioitem = this._playerStack[j];
            if(curaudioitem.paused){
                curaudioitem.play();
            }
        }
    }
}
HY.Core.AudioPlayer.prototype.pauseAudio = function(pAudioItem){
    pAudioItem.pause();
    var i = this._playerStack.length-1;
    if(i>0){
        if(this._playerStack[i] == pAudioItem){
            this._playerStack.splice(i,1);
        }else{
            for(;i>=0;--i){
                if(this._playerStack[i] == pAudioItem){
                    this._playerStack.splice(i,1);
                    break;
                }
            }
        }
    }
    var j = this._playerStack.length-1;
    if(j >= 0){
        var curaudioitem = this._playerStack[j];
        if(curaudioitem.paused){
            curaudioitem.play();
        }
    }
}
HY.Core.AudioPlayer.prototype.resumeAudio = function(pAudioItem){
    if(pAudioItem){

        for(var i = this._playerStack.length-1 ; i>=0 ; --i){
            if(this._playerStack[i] == pAudioItem){
                this._playerStack.splice(i,0);
            }
        }
        if(pAudioItem.paused){
            pAudioItem.play();
        }
        this._playerStack.push(pAudioItem);
    }
}
