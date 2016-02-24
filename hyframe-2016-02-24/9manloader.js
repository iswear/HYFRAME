function windowHeight() {
	var windowHeight;
	if (window.innerHeight) {
		windowHeight = window.innerHeight;
	}
	else if (document.documentElement && document.documentElement.clientHeight) {
		windowHeight = document.documentElement.clientHeight;
	}
	else if (document.body) {
		windowHeight = document.body.clientHeight;
	}
	return windowHeight;
}
function windowWidth() {
	var windowWidth;
	if (window.innerWidth) {
		windowWidth = window.innerWidth;
	}
	else if (document.documentElement && document.documentElement.clientWidth) {
		windowWidth = document.documentElement.clientWidth;
	}
	else if (document.body) {
		windowWidth = document.body.clientWidth;
	}
	return windowWidth;
}
function objectClone(pobject){
	if(pobject instanceof Array) {
		var retarr = [];
		for(var i=0;i<pobject.length;++i){
			retarr.push(objectClone(pobject[i]));
		}
		return retarr;
	}else if(pobject instanceof Object){
		var retobj = {};
		for(var item in pobject){
			retobj[item] = objectClone(pobject[item]);
		}
		return retobj;
	}else{
		return pobject;
	}
}
function formatSceneResTo(sceneObjs, resArray){
	if(sceneObjs && sceneObjs.datas){
		for(var yoindex=0;yoindex<sceneObjs.datas.length;++yoindex){
			var data = sceneObjs.datas[yoindex];
			if(data.type != 12){
				data.usemypath = 1;
				if(data.isgif == 1){
					if(data.imagetext >= 1){
						data.prepath = appConf.pathConf.templateRoot;
						for(var n=1;n<=data.totalimages;++n){
							if(n == 1){
								resArray.push(data.prepath+data.mypath);
							}else{
								resArray.push(data.prepath+data.mypath+"_"+n);
							}
						}
					}else{
						data.prepath = appConf.pathConf.templateRoot + "model/" + sceneObjs.prepath;
						data.mypath = data.imagepath;
						for(var n=1;n<=data.totalimages;++n){
							if(n == 1){
								resArray.push(data.prepath+data.imagepath);
							}else{
								resArray.push(data.prepath+data.imagepath+"_"+n);
							}
						}
					}
				}else if(data.imagetext >= 1){
					data.prepath = appConf.pathConf.templateRoot;
					resArray.push(appConf.pathConf.templateRoot+data.mypath);
				}else if(data.iscanreplace == 1){
					data.prepath = appConf.pathConf.workRoot;
					data.mypath = data.imagepath;
					resArray.push(appConf.pathConf.workRoot+data.imagepath);
				}else{
					data.prepath = appConf.pathConf.templateRoot + "model/" + sceneObjs.prepath;
					resArray.push(data.prepath+data.imagepath);
				}
			}else{
				data.prepath = appConf.pathConf.templateRoot;
				resArray.push(data.prepath+data.mypath);
			}
		}
	}
}
function formatDiyResTo(diyObjs,resArray){
	if(diyObjs && diyObjs.datas) {
		for(var yoindex=0;yoindex<diyObjs.datas.length;++yoindex){
			var data = diyObjs.datas[yoindex];
			if(data.version && data.version == 2){
				if(data.isgif){
					for(var m=1;m<=data.totalimages;++m){
						var gifprepath = data.mypath.substr(0,data.mypath.lastIndexOf("/"));
						if(m == 1){
							resArray.push(diyObjs.preurl+gifprepath+"/"+data.name+data.ext);
						}else{
							resArray.push(diyObjs.preurl+gifprepath+"/"+data.name+"_"+m+data.ext);
						}
					}
				}else{
					resArray.push(diyObjs.preurl+data.mypath);
				}
			}else{
				switch (data.type){
					case 1:case 2: {
					resArray.push(diyObjs.preurl+data.mypath);
					break;
				}
					case 3: {
						for(var m=1;m<=data.totalimages;++m){
							var gifprepath = data.mypath.substr(0,data.mypath.lastIndexOf("/"));
							if(m == 1){
								resArray.push(diyObjs.preurl+gifprepath+"/"+data.name+data.ext);
							}else{
								resArray.push(diyObjs.preurl+gifprepath+"/"+data.name+"_"+n+data.ext);
							}
						}
						break;
					}
					default : {
						break;
					}
				}
			}
		}
	}
}
function formatVideoResTo(sceneObjs,resArray){
	if(sceneObjs && sceneObjs.videodatas){
		for(var i = 0 ; i < sceneObjs.videodatas.length ; ++i){
			var data = sceneObjs.videodatas[i];
			resArray.push(appConf.pathConf.videosRoot+sceneObjs.videodatas[i].filename);
		}
	}
}

function DataLoaderItem(itemid,itemtype,itemsrcpath){
	this._itemid = itemid;
	this._itemtype = itemtype;						/*1表示image 2表示脚本script 3表示ajax数据*/
	this._itemsrcpath = itemsrcpath;
}
DataLoaderItem.prototype.setId = function(itemid){
	this._itemid = itemid;
}
DataLoaderItem.prototype.getId = function(){
	return this._itemid;
}
DataLoaderItem.prototype.setType = function(itemtype){
	this._itemtype = itemtype;
}
DataLoaderItem.prototype.getType = function(){
	return this._itemtype;
}
DataLoaderItem.prototype.setSrcPath = function(itemsrcpath){
	this._itemsrcpath = itemsrcpath;
}
DataLoaderItem.prototype.getSrcPath = function(){
	return this._itemsrcpath;
}
function DataLoader(items){
	this._dataitems = items;
	this._finishNum = 0;

	this._itemFinishedTarget = null;
	this._itemFinishedSelector = null;
	this._finishedTarget = null;
	this._finishedSelector = null;
}
DataLoader.prototype.getDataItems = function(){
	return this._dataitems;
}
DataLoader.prototype.setDataItems = function(items){
	this._dataitems = items;
	this._finishNum = 0;
}
DataLoader.prototype.addDataItem = function(item){
	this._dataitems.push(item);
}
DataLoader.prototype.insertDataItem = function(item,index){
	this._dataitems.splice(index,0,item);
}
DataLoader.prototype.getFinishNum = function(){
	return this._finishNum;
}
DataLoader.prototype.getProgress = function(){
	return this._finishNum / this._dataitems.length;
}
DataLoader.prototype.setItemFinishedCallback = function(target,selector){
	this._itemFinishedTarget = target;
	this._itemFinishedSelector = selector;
}
DataLoader.prototype.itemFinishedCallBack = function(element){
	if(this._itemFinishedSelector){
		if(this._itemFinishedTarget){
			return this._itemFinishedSelector.call(this._itemFinishedTarget,element);
		}else{
			return this._itemFinishedSelector.call(this,element);
		}
	}else{
		return true;
	}
}
DataLoader.prototype.setFinishedCallback = function(target,selector){
	this._finishedTarget = target;
	this._finishedSelector = selector;
}
DataLoader.prototype.finishedCallback = function(element){
	if(this._finishedSelector){
		if(this._finishedTarget){
			this._finishedSelector.call(this._finishedTarget,element);
		}else{
			this._finishedSelector.call(this,element);
		}
	}
}
DataLoader.prototype.loadCurData = function(){
	var d = document;
	var $this = this;
	function loadSuccess(element){
		var dataitem = element.dataitem;
		switch (dataitem.getType()){
			case 1:
				element.removeEventListener("load",loadSuccess,false);
				element.removeEventListener("error",loadFailed,false);
				break;
			case 2:
				element.removeEventListener("load",loadSuccess,false);
				element.removeEventListener("error",loadFailed,false);
				break;
			case 3:
				element.onreadystatechange = null;
				break;
			default :
				break;
		}
		if(this.itemFinishedCallBack(element)){
			this._finishNum ++;
			if(this._finishNum == this._dataitems.length){
				this.finishedCallback(element);
			}else{
				this.loadCurData();
			}
		}else{
			this.loadCurData();
		}
	}
	function loadFailed(element){
		var dataitem = element.dataitem;
		switch (dataitem.getType()){
			case 1:
				element.removeEventListener("load",element.loadSuccessFun,false);
				element.removeEventListener("error",element.loadFailedFun,false);
				element.loadSuccessFun = null;
				element.loadFailedFun = null;
				break;
			case 2:
				element.removeEventListener("load",element.loadSuccessFun,false);
				element.removeEventListener("error",element.loadFailedFun,false);
				element.loadSuccessFun = null;
				element.loadFailedFun = null;
				break;
			case 3:
				element.onreadystatechange = null;
				break;
			default :
				break;
		}
		if(this.itemFinishedCallBack(element)){
			this._finishNum ++;
			if(this._finishNum == this._dataitems.length){
				this.finishedCallback(element);
			}else{
				this.loadCurData();
			}
		}else{
			this.loadCurData();
		}
	}
	if(this._dataitems && this._dataitems.length > 0){
		var dataitem = this._dataitems[this._finishNum];
		switch (dataitem.getType()){
			case 1:
				var image = new Image();
				image.dataitem = dataitem;
				image.src = dataitem.getSrcPath();
				image.loadSuccessFun = loadSuccess.bind(this,image);
				image.loadFailedFun = loadFailed.bind(this,image);
				image.addEventListener("load",image.loadSuccessFun,false);
				image.addEventListener("error",image.loadFailedFun,false);
				break;
			case 2:
				var script = d.createElement("script");
				script.dataitem = dataitem;
				script.src = dataitem.getSrcPath();
				script.loadSuccessFun = loadSuccess.bind(this,script);
				script.loadFailedFun = loadFailed.bind(this,script);
				script.addEventListener("load",script.loadSuccessFun,false);
				script.addEventListener("error",script.loadFailedFun,false);
				document.body.appendChild(script);
				break;
			case 3:
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.dataitem = dataitem;
				xmlhttp.open("get",dataitem.getSrcPath(),true);
				xmlhttp.send();
				xmlhttp.onreadystatechange = function(){
					if(this.readyState == 4){
						if(this.status < 400){
							loadSuccess.call($this,this);
						}else{
							loadFailed.call($this,this);
						}
					}
				};
				break;
			default :
				break;
		}
	}else{
		this.finishedCallback(null);
	}
}
function LoadingPanel(){
	var d = document;
	this.background = d.createElement("div");
	this.background.style.position = "absolute";
	this.background.style.zIndex = "-99";

	this.appIcon = new Image();
	this.appIcon.src = appConf.pathConf.jsFrameRoot + "appicon.png";
	this.appIcon.style.position = "absolute";

	this.progressBar = d.createElement("div");
	this.progressBar.style.position = "absolute";
	this.progressBar.style.backgroundColor = "white";
	this.progressBar.style.borderWidth = "1px";
	this.progressBar.style.borderColor = "gray";
	this.progressBar.style.borderStyle = "solid";

	this.barCon = d.createElement("div");
	this.barCon.style.position = "relative";
	this.barCon.style.borderWidth = "1px";
	this.barCon.style.borderColor = "gray";
	this.barCon.style.borderStyle = "solid";
	this.barCon.style.backgroundColor = "white";
	this.barCon.style.boxShadow = "0px 0px 5px black inset";

	this.barBar = d.createElement("div");
	this.barBar.style.position = "relative";
	this.barBar.style.backgroundColor = "green";
	this.barBar.style.boxShadow = "0px 0px 7px white inset";

	this.barTip = d.createElement("div");
	this.barTip.style.position = "relative";
	this.barTip.style.textAlign = "center";

	this.barCon.appendChild(this.barBar);
	this.barCon.appendChild(this.barTip);
	this.progressBar.appendChild(this.barCon);
	this.background.appendChild(this.progressBar);
	this.background.appendChild(this.appIcon);

	this._progress = 0;
	this._shown = false;
}
LoadingPanel.prototype.getProgress = function(){
	return this._progress;
}
LoadingPanel.prototype.setProgress = function(progress){
	this._progress = (progress>=1.0)?1.0:progress;
	var winwidth = windowWidth();
	var winheight = windowHeight();
	var bkwidth,bkheight;
	if(winwidth/winheight > 1024/682){
		bkheight = winheight;
		bkwidth = winheight*1024/682;
	}else{
		bkwidth = winwidth;
		bkheight = winwidth * 682/1024;
	}
	if(0.46*bkwidth*this._progress > 0.02*bkwidth){
		this.barBar.style.width = 0.46*bkwidth*this._progress+"px";
		this.barTip.innerText = "脚本加载中("+Math.floor(this._progress*100)+"%)";
	}else{
		this.barBar.style.width = 0.02*bkwidth+"px";
		this.barTip.innerText = "脚本加载中("+Math.floor(this._progress*100)+"%)";
	}
}
LoadingPanel.prototype.layout = function(){
	var winWidth = windowWidth();
	var winHeight = windowHeight();
	var bkwidth,bkheight;
	if(winWidth/winHeight > 1024/682){
		bkheight = winHeight;
		bkwidth = winHeight * 1024/682;
	}else{
		bkwidth = winWidth;
		bkheight = winWidth * 682/1024;
	}

	this.appIcon.style.left = 0.375*bkwidth+"px";
	this.appIcon.style.top = bkheight/2-0.25*bkwidth+"px";
	this.appIcon.style.width = 0.25*bkwidth + "px";
	this.appIcon.style.height = 0.25*bkwidth + "px";

	this.progressBar.style.left = 0.26*bkwidth+"px";
	this.progressBar.style.top = 0.35*bkwidth+"px";
	this.progressBar.style.height = 0.02*bkwidth+2+"px";
	this.progressBar.style.width = 0.46*bkwidth+2+"px";
	this.progressBar.style.padding = 0.01*bkwidth+"px";
	this.progressBar.style.borderRadius = 0.05*bkwidth+1+"px";

	this.barCon.style.width = 0.46*bkwidth+"px";
	this.barCon.style.height = 0.02*bkwidth+"px";
	this.barCon.style.borderRadius = 0.01*bkwidth+"px";

	if(0.46*bkwidth*this._progress > 0.02*bkwidth){
		this.barBar.style.width = 0.46*bkwidth*this._progress+"px";
	}else{
		this.barBar.style.width = 0.02*bkwidth+"px";
	}
	this.barBar.style.height = 0.02*bkwidth+"px";
	this.barBar.style.borderRadius = 0.01*bkwidth+"px";
	this.barTip.style.top = "-"+(0.02*bkwidth)+"px";
	this.barTip.style.lineHeight = 0.02*bkwidth+"px";
	this.barTip.style.fontSize = 0.015*bkwidth*2/3+"px";
	this.barTip.style.width = 0.46*bkwidth+"px";
	this.barTip.style.height = 0.02*bkwidth+"px";
	this.barTip.style.borderRadius = 0.01*bkwidth+"px";

	this.background.style.left = (winWidth-bkwidth)/2+"px";
	this.background.style.top = (winHeight-bkheight)/2+"px";
	this.background.style.width = bkwidth + "px";
	this.background.style.height = bkheight + "px";

	this.setProgress(this._progress);
}
LoadingPanel.prototype.show = function(){
	document.body.appendChild(this.background);
	this.layout();
	var $this = this;
	window.addEventListener("resize",function(){ $this.layout(); },false);
}
LoadingPanel.prototype.hide = function(){
	document.body.removeChild(this.background);
}
function JMInit() {
	var chapterid,userid,indexno,qulity;
	var pageurl = location.href;
	var pageurlparams = pageurl.substring(pageurl.indexOf("?")+1,pageurl.length);
	if (pageurlparams.length > 1) {
		var params = pageurlparams.split("&");
		for (var i = 0; i < params.length; i++) {
			var keyvalue = params[i].split("=");
			if (keyvalue[0] == 'rpath') {
				appConf.workConf.relSoPath = decodeURIComponent(keyvalue[1]);
				continue;
			}
			if(keyvalue[0] == 'rid'){
				chapterid = keyvalue[1];
				continue;
			}
			if(keyvalue[0] == 'qulity'){
				qulity = parseInt(keyvalue[1]);
				continue;
			}
		}
	}

	var loadingpanel,dataloader,dataitems;
	function itemloadfinished(element){
		var retValue = true;
		var dataitem = element.dataitem;
		switch (dataitem.getId()){
			case 16:
				if(element.status < 400 && element.responseText && element.responseText.length > 0){
					var pathsconfig = eval("("+element.responseText+")");
					if(pathsconfig.code && pathsconfig.code > 0 && pathsconfig.datas && pathsconfig.datas.length > 0){
						var item = pathsconfig.datas[0];
						appConf.pathConf.imagesRoot = item.imagesroot;
						appConf.pathConf.workRoot = item.imagesroot;
						if(item.musicsroot && item.musicsroot.length > 0 && item.musicsroot.indexOf("http://") != -1){
							appConf.pathConf.musicsRoot = item.musicsroot;
						}
						if(item.datafile && item.datafile.length > 0){
							var datafile = item.datafile;
							var sofileindex = item.datafile.substr(2,datafile.length-5);
							this.addDataItem(new DataLoaderItem(50,2,appConf.pathConf.workRoot+appConf.workConf.relSoPath+"/modifysoundarray.so"));
							this.addDataItem(new DataLoaderItem(51,2,appConf.pathConf.workRoot+appConf.workConf.relSoPath+"/modifyimagesarray_1000.so"));
							this.addDataItem(new DataLoaderItem(17,3,appConf.pathConf.workRoot+appConf.workConf.relSoPath+"/diy.so"));
							this.addDataItem(new DataLoaderItem(31,3,appConf.pathConf.templateRoot+"model/"+sofileindex+".so"));
							this.addDataItem(new DataLoaderItem(20,3,"http://www.9man.com:8080/jmcomicv2/v2/appclient/data_infos.json?aid=1008&query_id="+chapterid));
							this.addDataItem(new DataLoaderItem(100,2,appConf.pathConf.jsFrameRoot+"main.js"));
						}else{
							this.addDataItem(new DataLoaderItem(50,2,appConf.pathConf.workRoot+appConf.workConf.relSoPath+"/modifysoundarray.so"));
							this.addDataItem(new DataLoaderItem(17,3,appConf.pathConf.workRoot+appConf.workConf.relSoPath+"/diy.so"));
							this.addDataItem(new DataLoaderItem(18,3,appConf.pathConf.workRoot+appConf.workConf.relSoPath+"/s0.so"));
							this.addDataItem(new DataLoaderItem(20,3,"http://www.9man.com:8080/jmcomicv2/v2/appclient/data_infos.json?aid=1008&query_id="+chapterid));
							this.addDataItem(new DataLoaderItem(100,2,appConf.pathConf.jsFrameRoot+"main.js"));
						}
					}else{
						retValue = false;
					}
				}else{
					retValue = false;
				}
				break;
			case 17:
				if(element.status < 400 && element.responseText != null && element.responseText != ""){
					try{
						appConf.workConf.diyJsonObj = eval("("+element.responseText+")");
						formatDiyResTo(appConf.workConf.diyJsonObj,appConf.resConf.diyimages);
					}catch (err){ appConf.workConf.diyJsonObj = null; }
				}
				break;
			case 18:
				if(element.status == 200 && element.responseText != null && element.responseText != ""){
					try{
						appConf.workConf.soJsonObj = eval("("+element.responseText+")");
					}catch(err){ appConf.workConf.soJsonObj = {}; }
				}
				break;
			case 20:
				if(element.status < 400 && element.responseText != null && element.responseText != ""){
					try{
						var songObj = eval("("+element.responseText+")");
						if(songObj && songObj.code && songObj.datas){
							appConf.workConf.songInfoObj.diytitle = songObj.datas[0].title;
							appConf.workConf.songInfoObj.songname = songObj.datas[0].songname;
							appConf.workConf.songInfoObj.ycname = songObj.datas[0].ycname;
							appConf.workConf.songInfoObj.fcname = songObj.datas[0].fcname;
							appConf.workConf.songInfoObj.introduction = songObj.datas[0].sharecontent;
							if(appConf.workConf.songInfoObj != null){
								if( appConf.workConf.songInfoObj.ycname == undefined ||
									appConf.workConf.songInfoObj.ycname == '' ) {
									var strs= [];
									strs = appConf.workConf.songInfoObj.songname.split('-');
									if(strs.length == 2)
									{
										strs[0] = strs[0].replace(/(^s+)|(s+$)/g,'');
										strs[1] = strs[1].replace(/(^s+)|(s+$)/g,'');
										appConf.workConf.songInfoObj.ycname =  strs[0];
										appConf.workConf.songInfoObj.songname =  strs[1];
									}
								}
							}

						}

					}catch(err) { appConf.workConf.songInfoObj = {diytitle:"",songname:"",ycname:"",fcname:"",introduction:""}; }
				}
				try{
					soundpathArray = soundpathArray || [];
					if(soundpathArray && soundpathArray[1] && soundpathArray[1][0] && soundpathArray[1][0].filename && soundpathArray[1][0].filename.length > 0){
						appConf.resConf.musics[0] = [];
						appConf.resConf.musics[0].push(soundpathArray[1][0].filename);
						var path = appConf.pathConf.musicsRoot + soundpathArray[1][0].filename;
						if(path){
							var lrcfilepath = path.substr(0,path.lastIndexOf("."))+".lrc";
							dataitem.setId(21);
							dataitem.setType(3);
							dataitem.setSrcPath(lrcfilepath);
							retValue = false;
						}
					}
				}catch(err){ }
				break;
			case 21:
				if(element.status < 400 && element.responseText != null && element.responseText != ""){
					appConf.workConf.lrcStr = element.responseText;
				}else{
					if(appConf.workConf.songInfoObj.songname.length > 0 || appConf.workConf.songInfoObj.ycname.length > 0){
						dataitem.setId(22);
						dataitem.setType(3);
						dataitem.setSrcPath("http://www.9man.com:8080/jmcomicv2/appclient_GeneralOperate?domethod=getlrc&songname="+appConf.workConf.songInfoObj.songname+"&ycname="+appConf.workConf.songInfoObj.ycname);
						retValue = false;
					}
				}
				break;
			case 22:
				if(element.status < 400 && element.responseText && element.responseText != ""){
					try{
						var lrcObj = eval("("+element.responseText+")");
						if(lrcObj && lrcObj.code && lrcObj.code > 0 && lrcObj.lrccontent){
							appConf.workConf.lrcStr = lrcObj.lrccontent;
						}
					}catch(err){ appConf.workConf.lrcStr = ""; }
				}
				break;
			case 31:
				if(element.status < 400 && element.responseText != null && element.responseText != ""){
					try{
						appConf.workConf.soJsonObj = eval("("+element.responseText+")");
						if(appConf.workConf.soJsonObj && appConf.workConf.soJsonObj.datas){
							var size = appConf.workConf.soJsonObj.datas.length;
							for(var i=0;i<size;++i){
								var datasitem = appConf.workConf.soJsonObj.datas[i];
								this.insertDataItem(new DataLoaderItem(100+i,3,appConf.pathConf.templateRoot+"model/"+datasitem.style+"s.so"),this.getFinishNum()+1);
								this.insertDataItem(new DataLoaderItem(200+i,3,appConf.pathConf.templateRoot+"model/"+datasitem.bg+"s.so"),this.getFinishNum()+1);
							}
						}
					}catch(err){ appConf.workConf.soJsonObj = null; }
				}
				break;
			default :
				if(dataitem.getType() == 3) {
					if(element.status < 400 && element.responseText != null && element.responseText != ""){
						if(dataitem.getId() >= 100 && dataitem.getId() < 200){
							appConf.workConf.modelStyleObjs.push(eval("("+element.responseText+")"));
						}else if(dataitem.getId() >= 200 && dataitem.getId() < 300){
							appConf.workConf.modelBkObjs.push(eval("("+element.responseText+")"));
						}

						if( appConf.workConf.modelStyleObjs.length == appConf.workConf.soJsonObj.datas.length &&
							appConf.workConf.modelBkObjs.length == appConf.workConf.soJsonObj.datas.length ){
							if(nextDiyImagesInit != undefined){
								nextDiyImagesInit();
							}
							if(updateImageArray && updateImageArray[1]){
								var updateimages = updateImageArray[1];
								var updateimagemap = null;
								var sceneindex = 0;
								var lastindex = 0;
								var updateimagesindex = 0;
								var updateimagescount = updateimages.length;
								for(;updateimagesindex<updateimagescount;){
									for(var j=0;j<appConf.workConf.modelStyleObjs.length;++j){
										updateimagemap = {};
										var modelStyleObj = objectClone(appConf.workConf.modelStyleObjs[j]);
										var modelBkObj = objectClone(appConf.workConf.modelBkObjs[j]);
										lastindex = 0;
										for(var k=0;k<modelStyleObj.datas.length;++k){
											var styleObjDataItem = modelStyleObj.datas[k];
											if(styleObjDataItem.iscanreplace && styleObjDataItem.iscanreplace == 1){
												lastindex = k;
												if(updateimagemap[styleObjDataItem.imagepath]){
													styleObjDataItem.imagepath = updateimagemap[styleObjDataItem.imagepath];
												}else{
													updateimagemap[styleObjDataItem.imagepath] = updateimages[updateimagesindex%updateimages.length].imagepath;
													styleObjDataItem.imagepath = updateimagemap[styleObjDataItem.imagepath];
													updateimagesindex++;
												}
											}
										}
										appConf.workConf.styleObjs.push(modelStyleObj);
										appConf.workConf.bkObjs.push(modelBkObj);
										if(!appConf.resConf.images[sceneindex]){
											appConf.resConf.images[sceneindex] = [];
										}
										formatSceneResTo(modelStyleObj,appConf.resConf.images[sceneindex]);
										formatSceneResTo(modelBkObj,appConf.resConf.images[sceneindex]);
										sceneindex++;
										if(sceneindex >= appConf.workConf.modelStyleObjs.length && updateimagesindex>=updateimagescount){
											break;
										}
									}
								}
								appConf.workConf.soJsonObj.sceneindex = sceneindex;
								appConf.workConf.soJsonObj.lastindex = lastindex;
								appConf.workConf.soJsonObj.imagenums = updateimages.length;
							}
						}
					}
				}
				break;
		}
		loadingpanel.setProgress(dataloader.getProgress());
		return retValue;
	}
	function loadfinished(element){
		loadingpanel.hide();
	}
	dataitems = [
		new DataLoaderItem(1,1,appConf.pathConf.jsFrameRoot+"loadingBg.jpg"),
		new DataLoaderItem(2,1,appConf.pathConf.jsFrameRoot+"loading.png"),
		new DataLoaderItem(3,1,appConf.pathConf.jsFrameRoot+"playericon.png"),
		new DataLoaderItem(4,1,appConf.pathConf.jsFrameRoot+"replayericon.png"),
		new DataLoaderItem(11,2,appConf.pathConf.jsFrameRoot+"9manengine.js"),
		new DataLoaderItem(12,2,appConf.pathConf.jsFrameRoot+"commonlib-mgr.js"),
		new DataLoaderItem(13,2,appConf.pathConf.jsFrameRoot+"scenelib.js"),
		new DataLoaderItem(14,2,appConf.pathConf.jsFrameRoot+"ac.js"),
		new DataLoaderItem(15,2,appConf.pathConf.jsFrameRoot+"scene.js"),
		new DataLoaderItem(16,3,"http://www.9man.com:8080/jmcomicv2/v2/appclient/data_infos.json?aid=600905&query_id="+chapterid)
	];
	loadingpanel = new LoadingPanel();
	dataloader = new DataLoader(dataitems);
	dataloader.setItemFinishedCallback(null,itemloadfinished);
	dataloader.setFinishedCallback(null,loadfinished);
	loadingpanel.show();
	dataloader.loadCurData();
}
JMInit();