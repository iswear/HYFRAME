var soundpathArray = [];
soundpathArray[1] = [];
soundpathArray[1][0] = {};
var g_preFullPath = null;
var appConf = {
	version:1,
	pathConf:{
		jsFrameRoot:"http://www.9man.com:8080/jmcomicv2/hol/lib_v20160203_bk/",
		imagesRoot:"http://img.9man.com/",
		musicsRoot:"http://www.9man.com:8890/",
		videosRoot:"http://img.9man.com:8890/videofiles/",
		templateRoot:"http://img.9man.com/jmcomicv2/moban/",
		workRoot:"http://img.9man.com/"
	},
	workConf:{
		relSoPath:null,
		diyJsonObj:null,
		soJsonObj:null,
		songInfoObj:{diytitle:"",songname:"",ycname:"",fcname:"",introduction:""},
		modelStyleObjs:[],
		modelBkObjs:[],
		styleObjs:[],
		bkObjs:[]
	},
	musicConf:{
		diytitle:"",
		songname:"",
		ycname:"",
		fcname:"",
		introduction:"",
		secondPlayMusic:false
	},
	resConf:{
		lrcStr:'',
		diyimages:[],
		images:[],
		musics:[],
		videos:[],
		resLoadStatus:[]
	},
	layoutConf:{
		viewWidth:0,
		viewHeight:0,
		scaleX:1,
		scaleY:1
	},
	lrcConf:{
		lrcArray:[],
		lrcPreArray:[],
		lrcFontSize:35,
		lrcShowFlag:false,
		lrcLastPlayLabelNum:0,
		lrcStartIndex:0,
		lrcStartTime:0,
		lrcStartPlay:false
	},
	playerConf:{
		curLayer:null,
		playStartTime:0,
		lastPauseTime:0,
		curSceneStartTime:0,
		cycleindex:0,
		linecycleindex:0
	}
};

(function() {
	var d = document;
	if (!d.createElement('canvas').getContext) {
		var s = d.createElement('div');
		s.innerHTML = '<h2>您的浏览器不支持canvas</h2>' + '<p>建议您下载google chrome浏览器以回去最佳体验</p>' + '<a href="http://www.google.com/chrome" target="_0"><img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
		var p = d.getElementById(c.tag).parentNode;
		p.style.background = 'none';
		p.style.border = 'none';
		p.insertBefore(s, d.getElementById(c.tag));
		d.body.style.background = '#ffffff';
		return
	}
	var fn;
	window.addEventListener('DOMContentLoaded', fn = function() {
		this.removeEventListener('DOMContentLoaded', fn, false);
		var loaderjs = d.createElement("script");
		loaderjs.src = appConf.pathConf.jsFrameRoot + "9manloader.js";
		d.body.appendChild(loaderjs);
	})
})();
