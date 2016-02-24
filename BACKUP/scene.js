var SceneVideoPlayer = ccui.VideoPlayer.extend({
	_dytime:0,
	_playEventCallBack:null,
	_playEventTarget:null,
	getDyTime:function(){
		return this._dytime;
	},
	setDyTime:function(dytime){
		this._dytime = dytime<0?0:dytime;
	},
	setPlayEventCallBack:function(callBack, target){
		this._playEventCallBack = callBack;
		this._playEventTarget = target;
	},
	delayPlayVideo:function(){
		this.setVisible(false);
		if(this._dytime > 0){
			this.scheduleOnce(this.immediatePlayVideo.bind(this), this._dytime, this.getURL());
		}else{
			this.immediatePlayVideo();
		}
	},
	immediatePlayVideo:function(){
		this.setVisible(true);
		this.play();
		if(this._playEventCallBack != null){
			this._playEventCallBack.call(this._playEventTarget);
		}
	}
});

SceneVideoPlayer.create = function(){
	var retObj = new SceneVideoPlayer();
	return retObj;
}

var JMScene = cc.Scene.extend({
	_bTouchReplayButton: false,
	_lastTime: null,
	_paused:false,
	_lrcPlaying:false,
	_stopping:false,
	_stoped:false,
	_curvolume: 1,
	_enterInitFlag:true,
	_playedSceneNumAddFlag:false,
	_playedSceneNum:0,

	/*diy资源当前场景场景开始时间*/
	_diyResourceLoaded:false,
	_curplayingindex:-1,
	_startPlaySceneTime:0,
	_imageplayfinishtimes:0,

	/*运行中的action和定时器*/
	_runningActions:null,
	_runningSchedules:null,

	/*场景是否由视频回调播放*/
	_sceneRunByCallBack:false,

	/*视频和播放中的视频*/
	_videoPlayingPlayers:{},
	_videoPlayers:{},

	/*控件*/
	_node: null,
	_loadingBackground:null,
	_loadingProgressIcon:null,
	_loadingProgressTip:null,
	_playBtn:null,
	_replayBtn:null,

	init: function () {
		this._super();
		var c = cc.winSize;
		var d = c.width / appConf.layoutConf.viewWidth;
		var b = c.height / appConf.layoutConf.viewHeight;
		this.setAnchorPoint(cc.p(0, 0));
		this.setScaleX(d);
		this.setScaleY(b);
		this._curplayingindex = -1;
		appConf.layoutConf.scaleX = d;
		appConf.layoutConf.scaleY = b;
	},
	onEnter: function(){
		this._super();
		this.SceneInit();
	},
	SceneInit: function () {
		/*添加背景*/
		var bgcolor = new cc.LayerColor(cc.color(255, 255, 255, 255), appConf.layoutConf.viewWidth, appConf.layoutConf.viewHeight);
		bgcolor.setAnchorPoint(0.5,0.5);
		this.addChild(bgcolor);

		/*添加精灵载体*/
		this._node = cc.Node.create();
		this.addChild(this._node,1);
		/*添加播放重播等控件*/

		var winSize = cc.winSize;
		var centerPos = cc.p(winSize.width / 2 / appConf.layoutConf.scaleX, winSize.height / 2 / appConf.layoutConf.scaleY);

		this._playBtn = cc.Sprite.create(appConf.pathConf.jsFrameRoot + 'playericon.png');
		this._playBtn.setAnchorPoint(cc.p(0.5, 0.5));
		this._playBtn.setPosition(centerPos);

		this._replayBtn = cc.Sprite.create(appConf.pathConf.jsFrameRoot + 'replayericon.png');
		this._replayBtn.setAnchorPoint(cc.p(0.5,0.5));
		this._replayBtn.setPosition(centerPos);

		this._loadingBackground = cc.Sprite.create(appConf.pathConf.jsFrameRoot+"loadingBg.jpg");
		this._loadingBackground.setPosition(centerPos);
		this._loadingBackground.setScaleX(winSize.width/800);
		this._loadingBackground.setScaleY(winSize.height/533);

		this._loadingProgressIcon = cc.Sprite.create(appConf.pathConf.jsFrameRoot+"loading.png");
		this._loadingProgressIcon.setPosition(centerPos);

		this._loadingProgressTip = cc.LabelTTF.create("0%", "Arial", 14);
		this._loadingProgressTip.setColor(cc.color(255, 0, 0,255));
		this._loadingProgressTip.setPosition(centerPos);


		/*事件注册等等*/
		if ('touches' in cc.sys.capabilities) {
			var eventlistener = cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: function (touch, event) {
					return event.getCurrentTarget().onTouchBegan(touch, event);
				},
				onTouchMoved: function (touch, event) {
					return event.getCurrentTarget().onTouchMoved(touch, event);
				},
				onTouchEnded: function (touch, event) {
					return event.getCurrentTarget().onTouchEnded(touch, event);
				}
			});
			cc.eventManager.addListener(eventlistener, this);
		}
		if ('mouse' in cc.sys.capabilities) {
			var eventlistener = cc.EventListener.create({
				event: cc.EventListener.MOUSE,
				swallowTouches: true,
				onMouseDown: function (event) {
					return event.getCurrentTarget().onTouchBegan(event.getLocation(), event);
				},
				onMouseMove: function (event) {
					return event.getCurrentTarget().onTouchMoved(event.getLocation(), event);
				},
				onMouseUp: function (event) {
					return event.getCurrentTarget().onTouchEnded(event.getLocation(), event);
				}
			});
			cc.eventManager.addListener(eventlistener, this);
		}
		/*创建各种歌词显示等等之类*/
		this.createTipLine();
		this.nextScene();
	},
	showPlayBtn:function(){
		this.hideReplayBtn();
		this._playBtn.removeFromParent();
		this.addChild(this._playBtn, 100000);
	},
	hidePlayBtn:function(){
		this._playBtn.removeFromParent();
	},
	showReplayBtn:function(){
		this.hidePlayBtn();
		this._replayBtn.removeFromParent();
		this.addChild(this._replayBtn, 100000);
	},
	hideReplayBtn:function(){
		this._replayBtn.removeFromParent();
	},
	showLoadingIcon:function(){
		if(this._curplayingindex == 0){
			this._node.addChild(this._loadingBackground);
		}
		this._node.addChild(this._loadingProgressIcon);
		this._node.addChild(this._loadingProgressTip);
		this._loadingProgressIcon.runAction(cc.RepeatForever.create(cc.RotateBy.create(1.0, 360)));
	},
	hideLoadingIcon:function(){
		this._loadingBackground.removeFromParent();
		this._loadingProgressIcon.removeFromParent();
		this._loadingProgressTip.removeFromParent();
	},
	/*主要播放功能*/
	getNextSceneIndex:function(){
		if(this.checkNeedStopScene())
			 return -1;
		if(this._curplayingindex < 0 || this._curplayingindex >= appConf.workConf.styleObjs.length - 1){
			return 0;
		}else{
			return this._curplayingindex+1;
		}
	},
	nextScene: function () {
		if(this._playedSceneNumAddFlag){
			this._playedSceneNum++;
		}else{
			this._playedSceneNumAddFlag = true;
		}
		if (this.checkNeedStopScene()) return;
		if(this._curplayingindex < 0 ||
			this._curplayingindex >= appConf.workConf.styleObjs.length-1){
			this._curplayingindex = 0;
		}else{
			this._curplayingindex += 1;
		}
		this.preLoadSceneResource(this._curplayingindex,false);
	},
	updateLoadProgress:function(sceneindex,background){
		appConf.resConf.resLoadStatus[sceneindex].loadednum += 1;
		if(appConf.resConf.resLoadStatus[sceneindex].loadednum == appConf.resConf.resLoadStatus[sceneindex].loadresnum){
			this._loadingProgressTip.setString("100%");
			if(!background){
				this.showCurrentScene();
			}
		}else{
			this._loadingProgressTip.setString(Math.round(appConf.resConf.resLoadStatus[sceneindex].loadednum/appConf.resConf.resLoadStatus[sceneindex].loadresnum*100)+"%");
		}
	},
	preLoadSceneResource:function(sceneindex,background){
		if(sceneindex < appConf.resConf.resLoadStatus.length &&
			appConf.resConf.resLoadStatus[sceneindex].loadresnum > 0 &&
			appConf.resConf.resLoadStatus[sceneindex].loadednum == appConf.resConf.resLoadStatus[sceneindex].loadresnum &&
			!background){
			this.showCurrentScene();
		}else{
			if(!background){
				this.showLoadingIcon();
			}
			if(sceneindex >= appConf.workConf.styleObjs.length){
				var $this = this;
				var step = 0;
				var styleXmlHttp = new XMLHttpRequest();
				styleXmlHttp.open("GET",appConf.pathConf.workRoot+appConf.workConf.relSoPath+"/s"+(sceneindex+1)+".so");
				styleXmlHttp.onreadystatechange = function(){
					if(styleXmlHttp.readyState == 4) {
						if (!appConf.resConf.images[sceneindex]) {
							appConf.resConf.images[sceneindex] = [];
						}
						if (!appConf.resConf.videos[sceneindex]) {
							appConf.resConf.videos[sceneindex] = [];
						}
						if (styleXmlHttp.status < 400) {
							var tempStyleObj = eval("(" + styleXmlHttp.responseText + ")");
							appConf.workConf.styleObjs.push(tempStyleObj);
							formatSceneResTo(tempStyleObj, appConf.resConf.images[sceneindex]);
							formatVideoResTo(tempStyleObj, appConf.resConf.videos[sceneindex]);
						}else{
							appConf.workConf.styleObjs.push({});
						}
						step++;
						if(step == 2){
							$this.loadSceneResource(sceneindex, background);
						}
					}
				};
				styleXmlHttp.send();
				var bkXmlHttp = new XMLHttpRequest();
				bkXmlHttp.open("GET",appConf.pathConf.workRoot+appConf.workConf.relSoPath+"/s"+(sceneindex+1)+".so");
				bkXmlHttp.onreadystatechange = function(){
					if(bkXmlHttp.readyState == 4){
						if(!appConf.resConf.images[sceneindex]){
							appConf.resConf.images[sceneindex] = [];
						}
						if(!appConf.resConf.videos[sceneindex]){
							appConf.resConf.videos[sceneindex] = [];
						}
						if(bkXmlHttp.status < 400){
							var tempBgObj = eval("("+bkXmlHttp.responseText+")");
							appConf.workConf.bkObjs.push(tempBgObj);
							formatSceneResTo(tempBgObj, appConf.resConf.images[sceneindex]);
							formatVideoResTo(tempBgObj, appConf.resConf.videos[sceneindex]);
						}else{
							appConf.workConf.bkObjs.push({});
						}
						step++;
						if(step == 2){
							$this.loadSceneResource(sceneindex, background);
						}
					}
				};
				bkXmlHttp.send();
			}else{
				this.loadSceneResource(sceneindex, background);
			}
		}
	},
	loadSceneResource:function(sceneindex, background){
		this._loadingProgressTip.setString("0%");
		appConf.resConf.resLoadStatus[sceneindex] = {loadednum:0, loadresnum:0};
		/*统计所有资源数量*/
		/*场景DIY资源*/
		if(!this._diyResourceLoaded){
			appConf.resConf.resLoadStatus[sceneindex].loadresnum += 2;
			appConf.resConf.resLoadStatus[sceneindex].loadresnum += appConf.resConf.diyimages.length;
		}
		/*场景Image资源*/
		if(appConf.resConf.images[sceneindex]){
			appConf.resConf.resLoadStatus[sceneindex].loadresnum += appConf.resConf.images[sceneindex].length;
		}
		/*场景Music资源*/
		if(appConf.resConf.musics[sceneindex]){
			appConf.resConf.resLoadStatus[sceneindex].loadresnum += appConf.resConf.musics[sceneindex].length;
		}
		/*场景Video资源*/
		if(appConf.resConf.videos[sceneindex]){
			appConf.resConf.resLoadStatus[sceneindex].loadresnum += appConf.resConf.videos[sceneindex].length;
		}
		/*加载所有资源*/
		/*加载DIY资源*/
		var $this = this;
		if(!this._diyResourceLoaded){
			cc.textureCache.addImage(appConf.pathConf.jsFrameRoot+"playericon.png" , function(){
				$this.updateLoadProgress(sceneindex,background);
			}, this);
			cc.textureCache.addImage(appConf.pathConf.jsFrameRoot+"replayericon.png" , function(){
				$this.updateLoadProgress(sceneindex,background);
			}, this);
			for(var i=appConf.resConf.diyimages.length-1 ; i>=0 ; --i){
				cc.textureCache.addImage(appConf.resConf.diyimages[i], function(){
					$this.updateLoadProgress(sceneindex,background);
				}, this);
			}
			this._diyResourceLoaded = true;
		}
		/*加载场景Image资源*/
		if(appConf.resConf.images[sceneindex]){
			for(var i=appConf.resConf.images[sceneindex].length-1 ; i>=0 ; --i){
				var imagepath = appConf.resConf.images[sceneindex][i];
				cc.textureCache.addImage(imagepath, function(){
					$this.updateLoadProgress(sceneindex,background);
				} , this);
			}
		}
		/*加载场景Music资源*/
		if(appConf.resConf.musics[sceneindex]){
			for(var i=appConf.resConf.musics[sceneindex].length-1 ; i>=0 ; --i){
				cc.loader.load(appConf.pathConf.musicsRoot+appConf.resConf.musics[sceneindex][i] , function(){
					$this.updateLoadProgress(sceneindex,background);
				});
			}
		}
		/*加载场景Video资源*/
		if(appConf.resConf.videos[sceneindex]){
			for(var i=appConf.resConf.videos[sceneindex].length-1 ; i>=0 ; --i){
				cc.loader.load(appConf.resConf.videos[sceneindex][i], function(){
					$this.updateLoadProgress(sceneindex,background);
				});
			}
		}
	},
	videoEventInPreLoad:function(){
		this.stop();
		this.setEventListener(ccui.VideoPlayer.EventType.PLAYING, null);
		/*重新定时播放*/
		if(this._enterInitFlag){
			if(this.getDyTime() <= 0){
				var scene = this.getParent();
				scene._videoPlayingPlayers[this.getURL()] = this;
			}else{
				var scene = this.getParent();
				this.setPlayEventCallBack(scene.videoEventPlaying,this);
			}
		}else{
			var scene = this.getParent();
			this.setPlayEventCallBack(scene.videoEventPlaying,this);
			this.delayPlayVideo();
		}

		/*动画暂停*/
		var scene = this.getParent();
		scene.playCurrentSceneRightNow();
	},
	videoEventPlaying:function(){
		var scene = this.getParent();
		scene._videoPlayingPlayers[this.getURL()] = this;
	},
	videoEventHeaderPlayCompleted:function(){
		var scene = this.getParent();
		this.removeFromParent(true);
		delete scene._videoPlayingPlayers[this.getURL()];
		delete scene._videoPlayers[this.getURL()];
		scene.playCurrentScene();
	},
	videoEventInPlayCompleted:function(){
		var scene = this.getParent();
		this.removeFromParent(true);
		delete scene._videoPlayingPlayers[this.getURL()];
		delete scene._videoPlayers[this.getURL()];
	},
	showCurrentScene: function() {
		this.playCurrentSceneHeaderVideo();
	},
	playCurrentSceneHeaderVideo:function(){
		/*移除所有的精灵*/
		this._node.removeAllChildren();
		/*隐藏加载信息*/
		this.hideLoadingIcon();
		/*创建所有场景精灵*/
		this.createSpriteObject(appConf.workConf.bkObjs[this._curplayingindex]);
		this.createSpriteObject(appConf.workConf.styleObjs[this._curplayingindex]);
		/*后台下载下一个场景的资源*/
		if (this.getNextSceneIndex() >= 0 && this.getNextSceneIndex() != this._curplayingindex) {
			var nextScene = this.getNextSceneIndex();
			appConf.resConf.resLoadStatus[nextScene] = {loadednum:0, loadresnum:0};
			this.preLoadSceneResource(this.getNextSceneIndex(), true);
		}
		/*如果有需要提前播放的视频那么播放视频，否则直接播放场景*/
		if(!this._stoped){
			if(this._curplayingindex < appConf.workConf.styleObjs.length){
				if(appConf.workConf.styleObjs[this._curplayingindex].videodatas){
					var videodatas = appConf.workConf.styleObjs[this._curplayingindex].videodatas;
					var len = videodatas.length;
					for(var i=0 ; i < len ; ++i){
						var videoobj = videodatas[i];
						if(videoobj.videotype == 0){
							var videoplayer = SceneVideoPlayer.create();
							videoplayer.setPosition(videoobj.x, videoobj.y);
							videoplayer.setContentSize(videoobj.width, videoobj.height);
							videoplayer.setScale(1);
							videoplayer.setFullScreenEnabled(false);
							videoplayer.setURL(appConf.pathConf.videosRoot+videoobj.filename);
							videoplayer.setDyTime(videoobj.dytime);
							this.addChild(videoplayer, 2);
							this._videoPlayers[videoplayer.getURL()] = videoplayer;
							videoplayer.setEventListener(ccui.VideoPlayer.EventType.COMPLETED,this.videoEventHeaderPlayCompleted);
							videoplayer.setPlayEventCallBack(this.videoEventPlaying,videoplayer);
							videoplayer.delayPlayVideo();
							if(this._enterInitFlag){
								this.pausePlay(this._enterInitFlag);
								this._enterInitFlag = false;
							}
							return;
						}
					}
					this.playCurrentScene();
				}else{
					this.playCurrentScene();
				}
			}
		}else{
			this.showReplayBtn();
		}
	},
	playCurrentSceneRightNow: function(){
		/*如果是第一个场景的话初始化歌曲开始时间*/
		if(this._curplayingindex == 0){
			var a = new Date();
			appConf.lrcConf.lrcStartTime = a.getTime();
		}
		if(this._curplayingindex == 0){
			this._startPlaySceneTime = (new Date()).getTime();
		}
		/*开始运行所有东西的精灵的脚本动作*/
		this.runSpriteAction(appConf.workConf.bkObjs[this._curplayingindex]);
		this.runSpriteAction(appConf.workConf.styleObjs[this._curplayingindex]);
		/*定时播放结尾视频*/
		if(appConf.workConf.soJsonObj.datas.length > this._curplayingindex){
			this.scheduleOnce(this.playCurrentSceneTailVideo.bind(this), appConf.workConf.soJsonObj.datas[this._curplayingindex].times, "playtailvideo");
		}
		if(this._enterInitFlag){
			this.pausePlay(this._enterInitFlag);
			this._enterInitFlag = false;
		}
	},
	playCurrentScene: function(){
		this._sceneRunByCallBack = false;
		/*准备开始播放视频*/
		if(appConf.resConf.videos[this._curplayingindex] &&
			appConf.resConf.videos[this._curplayingindex].length > 0){
			if(appConf.workConf.styleObjs[this._curplayingindex].videodatas){
				var styleVideoObjs = appConf.workConf.styleObjs[this._curplayingindex].videodatas;
				var len = styleVideoObjs.length;
				for(var i=0 ; i<len ; ++i){
					if(styleVideoObjs[i].videotype == 1){
						var videoplayer = SceneVideoPlayer.create();
						videoplayer.setPosition(styleVideoObjs[i].x, styleVideoObjs[i].y);
						videoplayer.setContentSize(styleVideoObjs[i].width, styleVideoObjs[i].height);
						videoplayer.setScale(1);
						videoplayer.setFullScreenEnabled(false);
						videoplayer.setURL(appConf.pathConf.videosRoot+styleVideoObjs[i].filename);
						videoplayer.setVisible(false);
						videoplayer.setDyTime(styleVideoObjs[i].dytime);

						this.addChild(videoplayer,2);
						this._videoPlayers[appConf.pathConf.videosRoot+styleVideoObjs[i].filename] = videoplayer;
						videoplayer.setEventListener(ccui.VideoPlayer.EventType.COMPLETED,this.videoEventInPlayCompleted);

						if(!this._sceneRunByCallBack){
							this._sceneRunByCallBack = true;
							videoplayer.setEventListener(ccui.VideoPlayer.EventType.PLAYING,this.videoEventInPreLoad);
							videoplayer.play();
						}else{
							if(this._enterInitFlag){
								if(videoplayer.getDyTime() <= 0){
									this._videoPlayingPlayers[this.getURL()] = this;
								}else{
									videoplayer.setPlayEventCallBack(this.videoEventPlaying,videoplayer);
								}
							}else{
								videoplayer.setPlayEventCallBack(this.videoEventPlaying,videoplayer);
								videoplayer.delayPlayVideo();
							}
						}
					}
				}
			}

			if(appConf.workConf.bkObjs[this._curplayingindex].videodatas){
				var bkVideoObjs = appConf.workConf.bkObjs[this._curplayingindex].videodatas;
				var len = bkVideoObjs.length;
				for(var i=0 ; i<len ; ++i){
					if(bkVideoObjs[i].videotype == 1){
						var videoplayer = SceneVideoPlayer.create();
						videoplayer.setPosition(bkVideoObjs[i].x, bkVideoObjs[i].y);
						videoplayer.setContentSize(bkVideoObjs[i].width, bkVideoObjs[i].height);
						videoplayer.setScale(1);
						videoplayer.setFullScreenEnabled(false);
						videoplayer.setURL(appConf.pathConf.videosRoot+bkVideoObjs[i].filename);
						videoplayer.setVisible(false);
						videoplayer.setDyTime(bkVideoObjs[i].dytime);

						this.addChild(videoplayer,0);
						this._videoPlayers[appConf.pathConf.videosRoot+bkVideoObjs[i].filename] = videoplayer;
						videoplayer.setEventListener(ccui.VideoPlayer.EventType.COMPLETED,this.videoEventInPlayCompleted);
						if(!this._sceneRunByCallBack){
							this._sceneRunByCallBack = true;
							videoplayer.setEventListener(ccui.VideoPlayer.EventType.PLAYING,this.videoEventInPreLoad);
							videoplayer.play();
						}else{
							if(this._enterInitFlag){
								if(videoplayer.getDyTime() <= 0){
									this._videoPlayingPlayers[this.getURL()] = this;
								}else{
									videoplayer.setPlayEventCallBack(this.videoEventPlaying,videoplayer);
								}
							}else{
								videoplayer.setPlayEventCallBack(this.videoEventPlaying,videoplayer);
								videoplayer.delayPlayVideo();
							}
						}
					}
				}
			}
		}

		if(!this._sceneRunByCallBack){
			this.playCurrentSceneRightNow();
		}
	},
	playCurrentSceneTailVideo:function(){
		/*如果有场景尾部视频那么播放视频,通过回调来播放下一个场景,否则直接播放下一个场景*/
		if(this._curplayingindex < appConf.workConf.styleObjs.length){
			if(appConf.workConf.styleObjs[this._curplayingindex].videodatas){
				var videodatas = appConf.workConf.styleObjs[this._curplayingindex].videodatas;
				var len = videodatas.length;
				for(var i=0 ; i < len ; ++i){
					var videoobj = videodatas[i];
					if(videoobj.videotype == 2){
						var videoplayer = SceneVideoPlayer.create();
						videoplayer.setPosition(videoobj.x, videoobj.y);
						videoplayer.setContentSize(videoobj.width, videoobj.height);
						videoplayer.setScale(1);
						videoplayer.setFullScreenEnabled(false);
						videoplayer.setURL(appConf.pathConf.videosRoot+videoobj.filename);
						videoplayer.setVisible(false);
						videoplayer.setDyTime(videoobj.dytime);
						this.addChild(videoplayer,2);
						this._videoPlayers[appConf.pathConf.videosRoot+videoobj.filename] = videoplayer;
						videoplayer.setPlayEventCallBack(this.videoEventPlaying,videoplayer);
						videoplayer.setEventListener(ccui.VideoPlayer.EventType.COMPLETED,this.videoEventInPlayCompleted);
						videoplayer.delayPlayVideo();
						return;
					}
				}
				this.nextScene();
			}else{
				this.nextScene();
			}
		}
	},
	createSpriteObject: function (jsonobj) {
		createSpriteObject2(jsonobj.datas, this._node, 0);
	},
	runSpriteAction:function(jsonobj){
		for(var i = 0;i<jsonobj.datas.length; ++i){
			if(jsonobj.datas[i].sprite && jsonobj.datas[i].ac && jsonobj.datas[i].ac.length > 0){
				if(jsonobj.datas[i].sprite && jsonobj.datas[i].sprite.runAction){
					runSpriteAction(jsonobj.datas[i].ac,jsonobj.datas[i].sprite,i, jsonobj.datas[i].dytime ,jsonobj.datas[i].actime,0,0,jsonobj.datas[i].prepath);
				}
			}
		}
	},


	/*播放状态监测*/
	getImageFinishTime:function(){
		if(appConf.workConf.soJsonObj.sceneindex && appConf.workConf.soJsonObj.sceneindex > 0){
			for(var i = 0, index = 0, maxtimes = 0, len = appConf.workConf.styleObjs[appConf.workConf.soJsonObj.sceneindex-1].datas.length ; i < len ; ++i){
				if(appConf.workConf.styleObjs[appConf.workConf.soJsonObj.sceneindex-1].datas[i].iscanreplace == 1){
					index ++;
					if(maxtimes < appConf.workConf.styleObjs[appConf.workConf.soJsonObj.sceneindex-1].datas[i].times){
						maxtimes = appConf.workConf.styleObjs[appConf.workConf.soJsonObj.sceneindex-1].datas[i].times;
					}
					if(index == appConf.workConf.soJsonObj.lastindex){
						this._imageplayfinishtimes = appConf.workConf.styleObjs[appConf.workConf.soJsonObj.sceneindex-1].datas[i].times;
						if(maxtimes > this._imageplayfinishtimes){
							this._imageplayfinishtimes = maxtimes;
							return;
						}
					}
				}
			}
		}else {
			this._imageplayfinishtimes = 0;
			return;
		}
	},
	checkNeedStopScene: function(){
		if(!this._enterInitFlag){
			if(appConf.workConf.soJsonObj.sceneindex && appConf.workConf.soJsonObj.sceneindex > 0){
				if(this._imageplayfinishtimes <= 0){
					this.getImageFinishTime();
				}
				var curTime = (new Date()).getTime();
				var playTimes = curTime - this._startPlaySceneTime;
				if((this._playedSceneNum == appConf.workConf.soJsonObj.sceneindex && this._imageplayfinishtimes >= playTimes) ||
					this._playedSceneNum > appConf.workConf.soJsonObj.sceneindex){
					if(appConf.resConf.musics[0] && appConf.resConf.musics[0].length > 0){
						if(!this._stopping){
							this.stopMusicVolumn();
						}
					}else{
						this.stopPlay();
					}
					return true;
				}else{
					if(appConf.resConf.musics[0] && appConf.resConf.musics[0].length > 0){
						if(!cc.audioEngine.isMusicPlaying() && !appConf.musicConf.secondPlayMusic){
							appConf.musicConf.secondPlayMusic = true;
							cc.audioEngine.playMusic(appConf.pathConf.musicsRoot+appConf.resConf.musics[0]);
						}
					}
					return false;
				}
			}else{
				if(this._playedSceneNum >= appConf.workConf.styleObjs.length){
					this.stopPlay();
					return true;
				}else{
					return false;
				}
			}
		}
	},

	/*停止播放*/
	stopPlay:function(){
		this._stoped = true;
		this.getActionManager().removeAllActions();
		this._runningSchedules = this.getScheduler().pauseAllTargets();
		cc.audioEngine.stopAllEffects();
		cc.audioEngine.stopMusic();
		for(var item in this._videoPlayingPlayers){
			try{
				this._videoPlayingPlayers[item].stop();
			}catch(err){}
		}
		this.showReplayBtn();
	},
	stopMusicVolumn: function () {
		this._curvolume = 1;
		this._stopping = true;
		if (cc.audioEngine.isMusicPlaying()) {
			this.schedule(this.stopMusicVolumnProcess, 1);
		}else{
			this._stopping = false;
			this.stopPlay();
		}
	},
	stopMusicVolumnProcess: function () {
		this._curvolume -= 0.05;
		if (this._curvolume >= 0) {
			cc.audioEngine.setMusicVolume(this._curvolume);
		} else {
			this._stopping = false;
			this.stopPlay();
			this.unschedule(this.stopMusicVolumnProcess);
		}
	},

	/*重新播放*/
	rePlay:function(){
		this.hideReplayBtn();
		if(!this._lrcPlaying){
			this._lrcPlaying = true;
			this.startLrcUpdate();
		}
		this._stoped = false;
		this._paused = false;
		this._curplayingindex = -1;
		this._playedSceneNumAddFlag = false;
		this._playedSceneNum = 0;
		appConf.musicConf.secondPlayMusic = false;
		/*恢复动作*/
		if(this._runningSchedules != null){
			this.getScheduler().resumeTargets(this._runningSchedules);
		}
		/*视频清除*/
		for(var item in this._videoPlayingPlayers){
			try{
				this._videoPlayingPlayers[item].stop();
				this._videoPlayingPlayers[item].removeFromParent(true);
				delete this._videoPlayingPlayers[item];
				delete this._videoPlayers[item];
			}catch(err){}
		}
		/*清除视频*/
		for(var item in this._videoPlayers){
			try{
				this._videoPlayers[item].removeFromParent(true);
				delete this._videoPlayers[item];
			}catch(err){}
		}
		/*重新开始播放声音*/
		if(appConf.resConf.musics[0] && appConf.resConf.musics[0].length > 0){
			cc.audioEngine.setMusicVolume(1);
			cc.audioEngine.playMusic(appConf.pathConf.musicsRoot+appConf.resConf.musics[0]);
		}
		appConf.resConf.resLoadStatus[0] = {loadednum:0, loadresnum:0};
		this.nextScene();
	},

	/*暂停播放*/
	pausePlay:function(initFlag){
		this.showPlayBtn();
		this._paused = true;
		cc.audioEngine.pauseAllEffects();
		cc.audioEngine.pauseMusic();
		this._runningActions = this.getActionManager().pauseAllRunningActions();
		this._runningSchedules = this.getScheduler().pauseAllTargets();
		for(var item in this._videoPlayingPlayers){
			try{
				this._videoPlayingPlayers[item].pause();
			}catch (err){}
		}
	},

	/*继续播放*/
	resumePlay:function(){
		this.hidePlayBtn();
		this._paused = false;
		cc.audioEngine.resumeAllEffects();
		cc.audioEngine.resumeMusic();
		if(!this._lrcPlaying){
			this._lrcPlaying = true;
			this.startLrcUpdate();
		}
		if(this._runningActions){
			this.getActionManager().resumeTargets(this._runningActions);
			this._runningActions = null;
		}
		if(this._runningSchedules){
			this.getScheduler().resumeTargets(this._runningSchedules);
			this._runningSchedules = null;
		}
		if(appConf.resConf.musics[0] && appConf.resConf.musics[0].length > 0){
			cc.audioEngine.setMusicVolume(1);
			cc.audioEngine.playMusic(appConf.pathConf.musicsRoot+appConf.resConf.musics[0]);
		}
		for(var item in this._videoPlayingPlayers){
			try{
				this._videoPlayingPlayers[item].setVisible(true);
				this._videoPlayingPlayers[item].play();
			}catch(err){}
		}
	},
	/*按钮交互时间*/
	onTouchBegan: function(touch, event){
		if(!this._enterInitFlag){
			if(this._stoped){
				this.rePlay();
			}else{
				if(this._paused){
					this.resumePlay();
				}else{
					this.pausePlay(false);
				}
			}
		}
	},
	onTouchMoved: function(touch, event){
	},
	onTouchEnded: function(touch, event){
	},

	/*歌词显示*/
	startLrcUpdate: function () {
		appConf.lrcConf.lrcStartIndex = 0;
		appConf.musicConf.playMusic = true;
		appConf.playerConf.curSceneStartTime = (new Date()).getTime();
		appConf.playerConf.playStartTime = appConf.playerConf.curSceneStartTime;
		appConf.lrcConf.lrcStartPlay = true;
		this._lastTime = appConf.playerConf.curSceneStartTime;
		this.schedule(this.updateLRCProcess, 0.5);
	},
	updateLRCProcess: function () {
		var a = new Date();
		var b = a.getTime();
		this.updateLRC(b);
		this.checkNeedStopScene();
	},
	updateLRC:function(curTime){
		var playTime;
		var bPlay = false;
		var lrcFontSize;

		if (appConf.version == 1)
			lrcFontSize = appConf.lrcConf.lrcFontSize / appConf.layoutConf.scaleX;
		else
			lrcFontSize = appConf.lrcConf.lrcFontSize;

		if (appConf.lrcConf.lrcStartPlay == false) return;

		for (i = appConf.lrcConf.lrcStartIndex; i < appConf.lrcConf.lrcArray.length; ++i) {
			bPlay = false;
			try {
				if (cc.audioEngine.IsCanPlayNow(appConf.lrcConf.lrcArray[i].timer - 300)) bPlay = true;
				if (bPlay && i < appConf.lrcConf.lrcArray.length - 1 && cc.audioEngine.IsCanPlayNow(appConf.lrcConf.lrcArray[i + 1].timer - 300))
					continue;
			} catch (e) {
				if (curTime >= appConf.lrcConf.lrcStartTime + appConf.lrcConf.lrcArray[i].timer - 300) bPlay = true;
				if (bPlay && i < appConf.lrcConf.lrcArray.length - 1 && curTime >= appConf.lrcConf.lrcStartTime + appConf.lrcConf.lrcArray[i + 1].timer - 300)
					continue;
			}
			if (bPlay) {
				if (i == appConf.lrcConf.lrcArray.length - 1)
					playTime = 0;
				else
					playTime = (appConf.lrcConf.lrcArray[i + 1].timer - appConf.lrcConf.lrcArray[i].timer - 20) / 1000;
				this.showLineLRCLabel(appConf.lrcConf.lrcArray[i].lyric, playTime);

				appConf.lrcConf.lrcStartIndex = i + 1;
			}
			else
				break;
		}
	},
	showLineLRCLabel:function(lrcContent, playtime) {
		var winsize = cc.winSize;
		var perWordTime = 0;
		var startTime = 0;
		var nOffset = 0, nWordSize, chinesecount;
		var szWord, k, wordwidth, szShowWord;
		var lrcFontSize, nMaxWidth;

		if (appConf.version == 1)
			lrcFontSize = appConf.lrcConf.lrcFontSize / appConf.layoutConf.scaleX;
		else
			lrcFontSize = appConf.lrcConf.lrcFontSize;
		if (lrcContent.length > 0) perWordTime = playtime / lrcContent.length;
		for (k = 0; k < appConf.lrcConf.lrcLastPlayLabelNum; k++) {
			var lrcLabel = this.getChildByTag(10000 + k);
			if (lrcLabel) {
				lrcLabel.setVisible(false);
				this.removeChild(lrcLabel, true);
			}
		}
		wordcount = getTextCount(lrcContent);
		chinesecount = getTextChineseCount(lrcContent);
		totalwidth = chinesecount * lrcFontSize / 2 + (wordcount - chinesecount) * (lrcFontSize / 2 + 5);

		for (k = 0; k < lrcContent.length; k++) {
			nWordSize = 1;
			szWord = lrcContent.charAt(k);
			szShowWord = szWord + ' ';
			var lrcLabel = cc.LabelTTF.create(szShowWord, 'Microsoft Yahei', lrcFontSize);
			if (isHasChn(szWord))
				wordwidth = lrcFontSize;
			else
				wordwidth = lrcFontSize / 2 + 5;
			lrcLabel.setAnchorPoint(cc.p(0.5, 0.5));
			lrcLabel.setPosition(cc.p((winsize.width / 2 + nOffset) / appConf.layoutConf.scaleX - totalwidth / 2 + lrcFontSize, lrcFontSize / 2 + 10 / appConf.layoutConf.scaleY));
			lrcLabel.zheshilrc = true;
			this.addChild(lrcLabel, 9999, 10000 + k);
			var action1 = cc.Sequence.create(cc.DelayTime.create(startTime), cc.TintTo.create(0, 255, 0, 0), cc.DelayTime.create(playtime - startTime), cc.Hide.create());
			lrcLabel.runAction(action1);
			startTime += perWordTime;
			nOffset += wordwidth * nWordSize * appConf.layoutConf.scaleX;
		}
		appConf.lrcConf.lrcLastPlayLabelNum = lrcContent.length;
	},

	/*标题歌曲名显示*/
	replaceDecodeWord: function (a) {
		a = a.replace("%3B", ";");
		a = a.replace("%23", "#");
		a = a.replace("%2C", ",");
		a = a.replace("%26", ",");
		return a
	},
	createTipLine: function () {
		var l = cc.winSize;
		var f, m, a = 0, g = 12;
		var nHeight = l.height / 2 / appConf.layoutConf.scaleY + 160 / appConf.layoutConf.scaleY;
		appConf.lrcConf.lrcPreArray.splice(0, appConf.lrcConf.lrcPreArray.length);
		var h = "";
		if (appConf.workConf.songInfoObj.diytitle != "") {
			try{
				h = decodeURI(appConf.workConf.songInfoObj.diytitle);
				h = this.replaceDecodeWord(h);
			}catch (err){
				h = appConf.workConf.songInfoObj.diytitle;
			}
			m = cc.LabelTTF.create(h, "Microsoft Yahei", 55 / appConf.layoutConf.scaleX);
			m.setAnchorPoint(cc.p(0.5, 0.5));
			m.setPosition(cc.p(l.width / 2 / appConf.layoutConf.scaleX, nHeight));
			m.setVisible(false);
			a = 1;
			this.addChild(m, 9999);
			var c = cc.Sequence.create(cc.DelayTime.create(a), cc.Show.create(), cc.FadeIn.create(1), cc.DelayTime.create(3), cc.TintTo.create(0, 255, 0, 0), cc.DelayTime.create(g - 3), cc.FadeOut.create(2), cc.Hide.create());
			m.runAction(c);
			nHeight -= m.getContentSize().height - 10 / appConf.layoutConf.scaleY;
		}
		h = "";
		if (appConf.workConf.songInfoObj.introduction != "") {
			try{
				h = decodeURI(appConf.workConf.songInfoObj.introduction);
				h = this.replaceDecodeWord(h);
			}catch (err){
				h = appConf.workConf.songInfoObj.introduction;
			}
			var n = h.split(/[+,;.?，。；！？\n\r]/);
			var e, d, b = 0;
			for (e = 0; e < n.length; e++) {
				if (n[e].length > 0) {
					b = 0;
					for (d = n[e].length; d > 0; d -= 20) {
						f = new Object();
						f.timer = (appConf.lrcConf.lrcPreArray.length + 1) * 6000;
						f.lyric = n[e].substr(b, 20);
						appConf.lrcConf.lrcPreArray.push(f);
						b = b + 20
					}
				}
			}
		}
		h = "";
		if (appConf.workConf.songInfoObj.songname != "") {
			try{
				h = decodeURI("%E6%AD%8C%E6%9B%B2%E5%90%8D:") + decodeURI(appConf.workConf.songInfoObj.songname);
				h = this.replaceDecodeWord(h);
			}catch (err){
				h = appConf.workConf.songInfoObj.songname;
			}
			f = new Object();
			f.timer = (appConf.lrcConf.lrcPreArray.length + 1) * 6000;
			f.lyric = h;
			appConf.lrcConf.lrcPreArray.push(f)
		}
		h = "";
		if (appConf.workConf.songInfoObj.ycname != "") {
			try{
				h = decodeURI("%E6%BC%94%E5%94%B1%E8%80%85:") + decodeURI(appConf.workConf.songInfoObj.ycname);
				h = this.replaceDecodeWord(h);
			}catch (err){
				h = decodeURI("%E6%BC%94%E5%94%B1%E8%80%85:") + appConf.workConf.songInfoObj.ycname;
			}
			f = new Object();
			f.timer = (appConf.lrcConf.lrcPreArray.length + 1) * 6000;
			f.lyric = h;
			appConf.lrcConf.lrcPreArray.push(f)
		}
		h = "";
		if (appConf.workConf.songInfoObj.fcname != "") {
			try{
				h = decodeURI("%e7%bf%bb%e5%94%b1%e8%80%85:") + decodeURI(appConf.workConf.songInfoObj.fcname);
				h = this.replaceDecodeWord(h);
			}catch (err){
				h = decodeURI("%e7%bf%bb%e5%94%b1%e8%80%85:") + appConf.workConf.songInfoObj.fcname;
			}
			f = new Object();
			f.timer = (appConf.lrcConf.lrcPreArray.length + 1) * 6000;
			f.lyric = h;
			appConf.lrcConf.lrcPreArray.push(f)
		}
	}
});

JMScene.create = function () {
	var a = new JMScene();
	a.init();
	return a;
};
