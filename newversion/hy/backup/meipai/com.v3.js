/* 
 * name: meipai 
 */
!
	function(a) {
		a.site = "http://www.meipai.com/",
			a.$doc = $(document),
			a.$win = $(window),
			a.$body = $("body"),
			a.loadNoMoreTxt = "亲，没有更多可加载了...",
			a.RR = function(a) {
				return a.replace("Reply", "回复")
			},
			a.checkPlatformIsIphone = function() {
				return a.currentPlatform == a.platform.iphone
			},
			a.checkPlatformIsAndroid = function() {
				return a.currentPlatform == a.platform.android
			},
			a._spanA = function(b, c) {
				a.$doc.delegate(b, c,
					function(b) {
						var c = $(this),
							d = c.attr("data-type");
						return d && a.tongji(d),
							a.redirectToHref(c, d ? 200 : 0),
							!1
					})
			},
			a.runSpanAClick = function() {
				a._spanA(".js-span-a-click", "click")
			},
			a.runSpanATap = function() {
				a._spanA(".js-span-a", "tap")
			},
			a.autoRedirectScheme = function() {
				if (a.currentPlatform == a.platform.iphone) {
					var b = location.hash;
					b && (b = decodeURIComponent(b.replace("#", "")), -1 != b.indexOf("mtmv://") && a.redirect(b), setTimeout(function() {
							location.hash = "",
								location.reload()
						},
						200))
				}
			},
			a.weixinLoginWithSuccess = function() {
				var b = a.url.get("wx");
				if ("success" == b) {
					var c = sessionStorage.getItem("wx-login");
					1 == c && (sessionStorage.removeItem("wx-login"), a.alert("登录成功"))
				}
			},
			a.runVideoCommentTap = function() {
				a.$doc.delegate(".js-span-comment", "tap",
					function() {
						return a.isLogin ? a.redirectToHref($(this)) : dialogLogin.show(),
							!1
					})
			},
			a.runVideoLikeTap = function() {
				a.$doc.delegate(".js-span-liked", "tap",
					function() {
						return a.isLogin ? videoLiked.run($(this)) : dialogLogin.show(),
							!1
					})
			},
			a.runDescriptionTap = function() {},
			a.redirectToHref = function(b, c) {
				if (this._isRedirect_) return ! 1;
				this._isRedirect_ = !0;
				var d = b.attr("data-href");
				d || (d = b.attr("href"));
				var e = this;
				setTimeout(function() {
						e._isRedirect_ = !1
					},
					300),
				d && (c ? setTimeout(function() {
						a.redirect(d)
					},
					c) : a.redirect(d))
			},
			window.MP = a
	} (MP || {}),
	function(a) {
		a.Event = function() {
			function a() {}
			return a.prototype = {
				_get: function(a) {
					return this._events = this._events || {},
						this._events[a] = this._events[a] || [],
						this._events[a]
				},
				on: function(a, b) {
					return "function" == (typeof b).toLowerCase() && this._get(a).unshift([b, 0]),
						this
				},
				trigger: function(a) {
					var b = this._get(a);
					if (b) {
						for (var c = b.length - 1; c >= 0; c--) {
							var d = Array.prototype.slice.apply(arguments);
							d.splice(0, 1);
							var e = b[c];
							e[0].apply(this, d),
							e[1] && this._get(a).splice(c, 1)
						}
						this._get(a).length || this.unbind(a)
					}
					return this
				},
				once: function(a, b) {
					return "function" == (typeof b).toLowerCase() && this._get(a).unshift([b, 1]),
						this
				},
				unbind: function(a, b) {
					if ("function" == (typeof b).toLowerCase()) {
						var c = this._get(a);
						if (c) {
							for (var d = c.length - 1; d >= 0; d--) c[d][0] == b && this._get(a).splice(d, 1);
							this._get(a).length || this.unbind(a)
						}
					} else this._events = this._events || {},
						delete this._events[a];
					return this
				}
			},
				a.prototype.emit = a.prototype.trigger,
				a.create = function() {
					return new a
				},
				a.EventEmitter = a,
				a
		} (),
			window.MP = a
	} (MP || {}),
	function(a) {
		var b = 0;
		a.alert = function(a, c, d) {
			d = d || 3e3,
				$(".alert").remove(),
				clearTimeout(b);
			var e = '<div class="alert m-center br">@s</div>';
			a && (c ? $msg = $(e.replace("@s", '<i style="font-size:15px" class="mp-iconfont dbl animate-spin">&#xe615;</i><br/>' + a)) : $msg = $(e.replace("@s", a)), this.$body.append($msg), b = setTimeout(function() {
					$(".alert").remove()
				},
				d))
		},
			a.alertSend = function(a) {
				this.alert(a, 1)
			},
			window.MP = a
	} (MP || {}),
	function(a) {
		a.cookie = {
			set: function(a, b, c) {
				var d = new Date;
				d.setDate(d.getDate() + c);
				var e = ["path=/", "domain=.meipai.com", c ? "expires=" + d.toGMTString() : ""];
				a && (e.unshift(a + "=" + encodeURIComponent(b)), document.cookie = e.join(";"))
			},
			get: function(a) {
				var b = new RegExp("(?:^| )" + a + "=([^;]*)(?:;|$)"),
					c = document.cookie.match(b);
				return c ? decodeURIComponent(c[1]) : ""
			},
			del: function(a) {
				var b = this.get(a);
				b && this.set(a, b, -1)
			}
		},
			window.MP = a
	} (MP || {}),
	function(a) {
		var b = a.GIU = function(a, b) {
			return b = b ? "!" + b: "",
			a.split("!")[0] + b
		};
		a.GAU = function(a, c) {
			return a ? b(a, c) : "http://img.app.meitudata.com/meitumv/images/default_avatar_60.png"
		},
			a.getImageUrl = a.GIU,
			a.getAvaterUrl = a.GAU,
			window.MP = a
	} (MP || {}),
	function(a, b, c) {
		"use strict";
		function d() {
			for (var a, b, c = 0; a = l.styleSheets.item(c++);) try {
				if (a.cssRules) return a
			} catch(d) {}
			return b = l.createElement("style"),
				b.type = "text/css",
				l.getElementsByTagName("head")[0].appendChild(b),
				b.sheet
		}
		function e(a) {
			return (a + "").replace(/^-ms-/, "ms-").replace(/-([a-z]|[0-9])/gi,
				function(a, b) {
					return (b + "").toUpperCase()
				})
		}
		function f(a) {
			m.call(l.styleSheets).forEach(function b(c) {
				m.call(c.cssRules).forEach(function(d, e) {
					d.type == o ? b(d.styleSheet || d.sheet) : d.type == p ? b(d) : d.type == q && a(d, e, c)
				})
			})
		}
		function g(a) {
			var b = e(a),
				c = e(s + b);
			return b in r && a || c in r && s + a || a
		}
		function h(a) {
			return {
					from: "0%",
					to: "100%"
				} [a] || (a + "").replace("%", "") + "%"
		}
		function i(a, b) {
			var c = "";
			if ("string" == typeof a) {
				if (t.test(a)) return a.replace(t, v);
				c = a.replace(/^\s*{\s*(?={)|}\s*(?=}\s*$)/gi, "")
			} else Array.isArray(a) ? c = a.map(function(b, c) {
				return (c / (a.length - 1) * 100 || 0) + "% { " + j(b) + " }"
			}).join(" ") : a && (c = Object.keys(a).map(function(b) {
				var c = j(a[b]);
				return k(b).map(function(a) {
					return h(a) + " { " + c + " }"
				}).join(" ")
			}).join(" "));
			return v + " " + b + " { " + c + " }"
		}
		function j(a) {
			var b = "";
			return "string" == typeof a ? b = j(a.split(/\s*;\s*/g)) : Array.isArray(a) ? b = j(a.reduce(function(a, b) {
					var c = b.split(/\s*:\s*/);
					return c.length > 1 && (a[c[0]] = c[1]),
						a
				},
				{})) : a && (b = Object.keys(a).map(function(b) {
				return g(b) + ": " + a[b] + ";"
			}).join(" ")),
				b
		}
		function k(a) {
			return (a + "").trim().split(/\s*[\s,]\s*/)
		}
		var l = document,
			m = [].slice,
			n = a.CSSRule || {},
			o = n.IMPORT_RULE,
			p = n.MEDIA_RULE,
			q = n.KEYFRAMES_RULE || n.WEBKIT_KEYFRAMES_RULE || n.MOZ_KEYFRAMES_RULE || n.O_KEYFRAMES_RULE,
			r = document.documentElement.style,
			s = function() {
				for (var a, b = "-webkit- -moz- -o- -ms-".split(" "); a = b.shift();) if (e(a + "animation") in r) return a;
				return ""
			} (),
			t = new RegExp("@(?:" + s + ")?keyframes", "i"),
			u = g("animation"),
			v = "@" + u.replace("animation", "keyframes");
		b.prototype = {
			constructor: b,
			init: function(a, c) {
				var e;
				if (!b.support) return this;
				if (("object" == typeof a || t.test(a)) && (a.cssRules && a.type == q ? e = a: (c = a, a = null)), a || (a = "js2keyframes-" + parseInt(1e10 * Math.random())), !e) {
					var f = d(),
						g = f.insertRule(i(c, a), f.cssRules.length);
					e = f.cssRules[g]
				}
				return this.keyframesRule = e || {},
					this.extract()
			},
			extract: function() {
				return this.keyframes = m.call(this.cssRules).reduce(function(a, b) {
						return a[b.keyText] = b,
							a
					},
					{}),
					this
			},
			get: function(a) {
				return this.keyframes[h(k(a)[0])]
			},
			add: function(a, b) {
				var c, d = this.keyframesRule,
					e = "appendRule" in d ? "appendRule": "insertRule";
				if ("object" == typeof a) for (var f in a) this.add(f, a[f]);
				else c = j(b),
					k(a).forEach(function(a) {
						this.remove(a),
							d[e](h(a) + " { " + c + " }")
					}.bind(this));
				return this.extract()
			},
			remove: function(a) {
				var b = this.keyframesRule;
				return k(a).forEach(function(a) {
					b.deleteRule(h(a))
				}),
					this.extract()
			},
			clear: function() {
				return m.call(this.cssRules).forEach(function(a) {
					this.remove(a.keyText)
				}.bind(this)),
					this.extract()
			}
		};
		var w = {
			vendor: s,
			get: function(a) {
				return this.CSSKeyframes[a]
			},
			add: function() {
				return this.apply(null, arguments)
			},
			remove: function(a) {
				return f(function(b, c, d) {
					b.name == (a.name || a) && d.deleteRule(c)
				}),
					!0
			},
			getSheet: d,
			"animation-css": u,
			animation: e(u),
			support: e(u) in r
		};
		"function" == typeof Object.defineProperties && ("name duration timing-function delay iteration-count direction play-state fill-mode".split(" ").forEach(function(a) {
			var c = "animation-" + a,
				d = e(c);
			b[d] = e(b[c] = g(c))
		}), Object.keys(w).forEach(function(a) {
			b[a] = w[a]
		}), "name cssText cssRules".split(" ").forEach(function(a) {
			Object.defineProperty(b.prototype, a, {
				get: function() {
					return (this.keyframesRule || {})[a]
				},
				enumerable: !0
			})
		}), Object.defineProperty(b, "CSSKeyframes", {
			get: function() {
				var a = {};
				return f(function(b) {
					a[b.name] = this(b)
				}.bind(this)),
					a
			},
			enumerable: !0
		})),
			"function" == typeof define && define.amd ? define("JS2CSSKeyframes",
				function() {
					return b
				}) : a.JS2CSSKeyframes = b
	} (window,
		function(a, b) {
			return this instanceof arguments.callee ? void(arguments.callee.support && this.init(a, b)) : new arguments.callee(a, b)
		}),
	function(a) {
		var b = JS2CSSKeyframes.getSheet(),
			c = JS2CSSKeyframes["animation-css"];
		a.js2keyCount = {
			loop: "infinite",
			normal: "1"
		},
			a.js2keyTiming = {
				normal: "ease",
				linear: "linear",
				easeIn: "ease-in",
				easeOut: "ease-out",
				easeInOut: "ease-in-out"
			},
			a.js2keyMode = {
				none: "",
				forwards: "forwards",
				backwards: "backwards",
				both: "both"
			},
			a.js2cssAnimate = function(d, e, f) {
				if (!d || !e) return d;
				var g = new JS2CSSKeyframes(e),
					h = {
						duration: "1s",
						timing: a.js2keyTiming.linear,
						delay: "0s",
						count: a.js2keyCount.normal,
						mode: a.js2keyMode.none
					};
				if (f) for (var i in h) h.hasOwnProperty(i) && f[i] && (h[i] = f[i]);
				var j = ["." + d, "{", c + ":", [g.name, h.duration, h.timing, h.delay, h.count, h.mode].join(" "), "}"].join("");
				return b.insertRule(j, b.cssRules.length),
					d
			},
			window.MP = a
	} (MP || {}),
	function(a) {
		var b = {
				media: "media?id=",
				user: "user?id=",
				topic: "square?name=",
				live: "lives?id="
			},
			c = function() {
				var a = location.pathname.split("/");
				return b[a[1]] ? "mtmv://" + b[a[1]] + a[2] : null
			},
			d = function(a) {
				a && !location.hash && (location.hash = encodeURIComponent(a))
			};
		a.openAppByScheme = function() {
			if (!a.isLogin && a.checkPlatformIsIphone()) {
				var b = $("#openApp"),
					e = c();
				e && b.attr("data-href", e),
					b.on("click",
						function() {
							if (a.inWx || a.inQQ) {
								$(".d-login-o").show();
								var e = c();
								e || (e = "mtmv://"),
									d(e)
							} else {
								var f = b.attr("data-href");
								a.redirect(f),
									setTimeout(function() {
											a.redirect(a.DOWNLOAD_ADDRESS)
										},
										200)
							}
							return ! 1
						})
			}
		},
			window.MP = a
	} (MP || {}),
	function(a) {
		a.shareInWeixin = function() {
			function b(b) {
				c.hideTipInWeixin(),
					c._$wxTip = $(ejs.render(d, {
						platform: c.currentPlatform,
						type: b,
						MP: a
					})),
					c.$body.append(c._$wxTip),
					c.tongji(b)
			}
			var c = this,
				d = $("#shareTipTemplate").text();
			this.$doc.delegate(".js-wxs", "click",
				function() {
					return b("wxs"),
						!1
				}).delegate(".js-wx", "click",
				function() {
					return b("wx"),
						!1
				}).delegate(".js-copy", "click",
				function() {
					return b("copy"),
						!1
				})
		},
			a.hideTipInWeixin = function() {
				this._$wxTip && (this._$wxTip.remove(), this._$wxTip = null)
			},
			window.MP = a
	} (MP || {}),
	function(a) {
		a.statistic = function(b) {
			if (b) {
				var c = this.url.get("from");
				if (this.inWx) c = "weixin";
				else {
					var d = sessionStorage.getItem("STFROM");
					d ? c = d: c && sessionStorage.setItem("STFROM", c)
				}
				var e = function(b, c) {
					var d = a.play_video_uid,
						e = ['{"is_mobile":"1","id":"', b, '","source":"', c];
					return d && (e.push('","uid":"'), e.push(d)),
						e.push('"}'),
						e.join("")
				};
				$.post("http://statistics.meipai.com/statistics/play_video.json?client_id=1089867313", {
					data: e(b, c || "web")
				})
			}
		},
			window.MP = a
	} (MP || {}),
	function(a) {
		a.str = {
			checkLength: function(a, b) {
				for (var c = b || 110,
						 d = a,
						 e = 0,
						 f = 0; f < d.length && 2 * c >= e; f++) e += d.charCodeAt(f) > 0 && d.charCodeAt(f) < 128 ? 1 : 2;
				return e > 2 * c ? !1 : !0
			}
		},
			window.MP = a
	} (MP || {}),
	function(a) {
		a.tipMask = function() {
			var a = {
				_init: function() {
					this._$layout = $("#pageLayout"),
						this._layoutClass = this._$layout.attr("data-animate-class").split(",")
				},
				_show: function() {
					this._$layout.removeClass(this._layoutClass[1]).addClass(this._layoutClass[0])
				},
				_hide: function() {
					this._$layout.removeClass(this._layoutClass[0]).addClass(this._layoutClass[1])
				},
				_run: function() {
					return this._instance || (this._init(), this._instance = !0),
						this
				}
			};
			return {
				show: function() {
					a._run()._show()
				},
				hide: function() {
					a._run()._hide()
				},
				get: function() {
					return a._run()._$layout
				}
			}
		} (),
			window.MP = a
	} (MP || {}),
	function(a) {
		a.tongji = function(a, b, c, d) {
			var e = b || "click",
				f = c || "",
				g = d || "";
			"undefined" != typeof _hmt && _hmt.push(["_trackEvent", a, e, f, g]),
			"undefined" != typeof _czc && _czc.push(["_trackEvent", a, e, f, g])
		},
			window.MP = a
	} (MP || {}),
	function(a) {
		a.url = {
			get: function(a) {
				var b = new RegExp("(^|&)" + a + "=([^&]*)(&|$)", "i"),
					c = window.location.search.substr(1).match(b);
				return null != c ? c[2] : null
			}
		},
			window.MP = a
	} (MP || {}),
	function(a) {
		var b = navigator.userAgent;
		a.inMOMO = /momoWebView/gi.test(b),
			a.inWx = /MicroMessenger/gi.test(b),
			a.inQQ = /QQ/gi.test(b),
			a.inMp = /meipai/gi.test(b),
			a.noSUA = ["MQQBrowser", "baidubrowser", "U3", "SogouMobileBrowser"],
			a.checkSupportVideo = function() {
				for (var a = navigator.userAgent,
						 b = this.noSUA,
						 c = !1,
						 d = 0,
						 e = b.length; e > d && !(c = new RegExp(b[d] + "/", "g").test(a)); d++);
				return ! c
			},
			a.iOSSUA = function() {
				return ! (this.inMOMO || this.inWx || this.inQQ || this.inMp)
			},
			window.MP = a
	} (MP || {}),
	function(a, b, c) {
		"use strict";
		"function" == typeof define && define.amd ? define(["JS2CSSKeyframes"],
			function(a) {
				return a.support ? b(a) : void 0
			}) : JS2CSSKeyframes.support && (a.css3Ani = b(JS2CSSKeyframes))
	} (window,
		function(a) {
			var b = a.getSheet(),
				c = {},
				d = {
					bounce: {
						"20,50,80,100": "transform:translate(0)",
						40 : "transform:translateY(-30px)",
						60 : "transform:translateY(-15px)"
					},
					bounceIn: {
						0 : "transform:scale(0.3);opacity:0",
						50 : "transform:scale(1.05);opacity:1",
						75 : "transform:scale(0.9)",
						100 : "transform:scale(1)"
					},
					bounceOut: {
						100 : "transform:scale(0.3);opacity:0",
						50 : "transform:scale(1.1);opacity:1",
						25 : "transform:scale(0.96)"
					},
					flash: {
						"50,100": "opacity:1;",
						"25,75": "opacity:0;"
					},
					shake: {
						"10,30,50,70,90": "transform:translateX(-10px)",
						"20,40,60,80": "transform:translateX(10px)",
						100 : "transform:translateX(0)"
					},
					rubberBand: {
						30 : "transform:scale(1.25,0.75)",
						40 : "transform:scale(0.75,1.25)",
						50 : "transform:scale(1.15,0.85)",
						65 : "transform:scale(.95,1.05)",
						75 : "transform:scale(1.05,.95)",
						100 : "transform:scale(1,1)"
					},
					tada: {
						"10,20": "transform:scale(.9) rotate(-3deg)",
						"30,50,70,90": "transform:scale(1.1) rotate(3deg)",
						"40,60,80": "transform:scale(1.1) rotate(-3deg)",
						100 : "transform:scale(1) rotate(0)"
					},
					hinge: {
						0 : "transform-origin:0 0",
						"20,60": "transform-origin:0 0;transform:rotate(30deg)",
						"40,80": "transform-origin:0 0;transform:rotate(60deg);opacity:1",
						100 : "transform-origin:0 0;transform:translateY(200%);opacity:0"
					},
					pulse: {
						50 : "transform:scale(1.05)",
						100 : "transform:scale(1)"
					},
					wiggle: ["transform:skewX(-10deg)", "transform:skewX(9deg)", "transform:skewX(-8deg)", "transform:skewX(7deg)", "transform:skewX(-6deg)", "transform:skewX(5deg)", "transform:skewX(-4deg)", "transform:skewX(3deg)", "transform:skewX(-2deg)", "transform:skewX(1deg)", "transform:skewX(0)"],
					swing: ["", "transform:rotate(15deg)", "transform:rotate(-10deg)", "transform:rotate(5deg)", "transform:rotate(-5deg)", "transform:rotate(0)"],
					wobble: ["", "transform:translateX(-100px) rotate(-5deg)", "transform:translateX(80px) rotate(3deg)", "transform:translateX(-65px) rotate(-3deg)", "transform:translateX(40px) rotate(2deg)", "transform:translateX(-20px) rotate(-1deg)", "transform:translateX(0) rotate(0)"],
					ring: {
						"10,20": "transform:scale(0.9) rotate(-3deg)",
						"30,50,70,90": "transform:scale(1.1) rotate(3deg)",
						"40,60,80": "transform:scale(1.1) rotate(-3deg)",
						100 : "transform:scale(1) rotate(0)"
					},
					rotate360: ["", "transform:rotate(360deg)"]
				};
			"X Y".split(" ").forEach(function(a) {
				var b = "X" == a ? "Y": "X";
				d["flip" + a] = {
					50 : "transform:perspective(400px) translateZ(150px) rotate" + b + "(170deg)",
					60 : "transform:perspective(400px) translateZ(150px) rotate" + b + "(190deg)",
					100 : "transform:perspective(400px) rotate" + b + "(360deg)"
				},
					d["flipin" + a] = {
						0 : "transform:perspective(400px) rotate" + a + "(90deg);opacity:0",
						40 : "transform:perspective(400px) rotate" + a + "(-10deg);opacity:1",
						70 : "transform:perspective(400px) rotate" + a + "(10deg)",
						100 : "transform:perspective(400px) rotate" + a + "(0)"
					},
					d["flipout" + a] = {
						50 : "opacity:1",
						100 : "transform:perspective(400px) rotate" + a + "(90deg);opacity:0"
					}
			}),
				"In Out ".split(" ").forEach(function(a, b) {
					var c = b % 2 ? "reverse": "slice",
						e = a ? "opacity:0;": "";
					a && (d["fade" + a] = ["opacity:0", ""][c]()),
						d["roll" + a] = [e + "transform:translateX(-100px) rotate(-120deg)", "transform:translateX(0) rotate(0)"][c](),
						d["scale" + a] = [e + "transform:scale(0)", "transform:scale(1)"][c](),
						d["zoom" + a] = [e + "transform:scale(2)", "transform:scale(1)"][c](),
						d["flyTop" + a] = [e + "transform:translateY(-50px)", "transform:translateY(0)"][c](),
						d["flyRight" + a] = [e + "transform:translateX(50px)", "transform:translateX(0)"][c](),
						d["flyBottom" + a] = [e + "transform:translateY(50px)", "transform:translateY(0)"][c](),
						d["flyLeft" + a] = [e + "transform:translateX(-50px)", "transform:translateX(0)"][c](),
						d["rotate" + a] = [e + "transform:rotate(-200deg)", "transform:rotate(0)"][c](),
						d["lightSpeed" + a] = [e + "transform:translateX(100%) skewX(-30deg)", "transform:translateX(0) skewX(0)"][c](),
						d["slideX" + a] = [e + "width:0;overflow:hidden", "overflow:hidden"][c](),
						d["slideY" + a] = [e + "height:0;overflow:hidden", "overflow:hidden"][c]()
				}),
				a.setAnimate = function(e) {
					if (e) {
						var f = e.replace("_", "-");
						e = e.replace("_", "."),
						"1s" == e && (f = ""),
							Object.keys(d).forEach(function(g) {
								c[g] = a(g, d[g]),
									b.insertRule(".a" + f + "-" + g + " { " + a["animation-css"] + ": " + g + " " + e + " ease both }", b.cssRules.length)
							})
					}
				},
				a.setAnimate("1s");
			for (var e = 100; 1e4 > e;) b.insertRule(".delay" + e + "{ " + a["animation-delay"] + ": " + e + "ms !important; " + a["animation-fill-mode"] + ": both !important }", b.cssRules.length),
				e += 3e3 > e ? 100 : 1e3;
			return c
		}),
	MP.js2cssAnimate("animate-spin", {
			from: {
				transform: "rotate(0deg)"
			},
			to: {
				transform: "rotate(360deg)"
			}
		},
		{
			duration: "2s",
			count: MP.js2keyCount.loop
		}),
	MP.js2cssAnimate("animate-beat", {
			"0%": {
				transform: "scale(1)",
				opacity: ".8"
			},
			"50%": {
				transform: "scale(1.4)",
				opacity: "1"
			},
			"100%": {
				transform: "scale(1)",
				opacity: ".8"
			}
		},
		{
			duration: ".5s",
			count: MP.js2keyCount.loop
		});
var commentLoadMore = function(a) {
		var b = {
			_offset: 50,
			_islast: !1,
			_isload: !1,
			_init: function() {
				this._$win = $(window),
					this._$loading = $("#commentLoading"),
					this._tmp = $("#commentTmp").text(),
					this._$content = $("#commentListWrap")
			},
			_bind: function() {
				var a = this;
				this._bindFn = function() {
					if (!a._isload) {
						var b = a._$loading.offset().top,
							c = a._$win.scrollTop(),
							d = a._$win.height();
						b < c + d - a._offset && (a._isload = !0, a._get())
					}
				},
					this._$win.on("scroll", this._bindFn)
			},
			_unbind: function() {
				this._$win.unbind("scroll", this._bindFn),
					this._$loading.text("没有更多评论...")
			},
			_get: function() {
				var a = this;
				$.get("/medias/comments_timeline", {
						id: this._mid,
						page: this._page,
						count: this._count,
						maxid: this._maxid
					},
					function(b) {
						b = JSON.parse(b),
						(b.error_code || b.length < a._count) && a._unbind(),
						0 != b.length && (a._maxid = b[b.length - 1].id.toString(), a._render(b)),
							a._isload = !1,
							a._page++
					})
			},
			_render: function(b) {
				var c = a.render(this._tmp, {
					MP: MP,
					comments_list: b,
					get_avatar_url: MP.GAU,
					get_image_url: MP.GIU,
					replace_comment_at: MP.RR
				});
				this._$content.append($(c))
			}
		};
		return {
			run: function(a, c, d, e) {
				b._mid = a || 0,
					b._page = c || 2,
					b._count = d || 10,
					b._maxid = e || null,
					b._init(),
					b._bind()
			}
		}
	} (ejs),
	commentSend = function(a) {
		var b = {
			_init: function() {
				this._$send = $("#commentSend"),
					this._$input = $("#commentInput"),
					this._$list = $("#commentList"),
					this._$content = $("#commentListWrap"),
					this._tmp = $("#commentTmp").text(),
					this._$win = $(window),
					this._$commentQuantity = $("#commentQuantity"),
					this._placeholder = this._$input.attr("placeholder")
			},
			_bind: function() {
				var b = this;
				this._$send.on("click",
					function() {
						var c = b._$input.val().trim();
						if (!c) return ! 1;
						if (!MP.str.checkLength(c)) return MP.alert("最多只能输入110个字哦，请重新编辑。"),
							!1;
						b._$input.val("");
						var d = $(this);
						MP.alertSend("发送中...");
						var e = {
								id: d.attr("data-id"),
								comment: c,
								rcid: d.attr("data-rcid"),
								timing: null
							},
							f = detailPlayer.getTiming(!1);
						return ! f || e.rcid && "null" != e.rcid || (e.timing = f),
							$.post("/medias/comments_create", e,
								function(c) {
									if (d.attr("data-rcid", null), b._$input.attr("placeholder", b._placeholder), b._$input.attr("data-placeholder", b._placeholder), c = JSON.parse(c), c.error_code) 20306 == c.error_code ? MP.alert("请不要回复相同的评论.") : MP.alert(c.error);
									else {
										MP.alert(null);
										var f = a.render(b._tmp, {
												MP: MP,
												comments_list: [c],
												get_avatar_url: MP.GAU,
												get_image_url: MP.GIU,
												replace_comment_at: MP.RR
											}),
											g = b._$commentQuantity.text();
										g = parseInt(g, 10),
											g = isNaN(g) ? 0 : g,
											g += 1,
											b._$commentQuantity.text(g),
											b._$list.after($(f)),
										e.timing && detailPlayer.sendBarrageCallback(c.content_origin, c.barrage)
									}
								},
								function(a) {
									MP.alert("回复失败")
								}),
							!1
					}),
					this._$content.delegate(".d-comment-txt,.d-comment-date", "click",
						function() {
							var a = $(this),
								c = a.parent(),
								d = c.attr("data-name"),
								e = c.attr("data-id");
							return b._$send.attr("data-rcid", e),
								b._$input.attr("placeholder", "回复" + d + ":"),
								b._$input.attr("data-placeholder", "回复" + d + ":"),
								!1
						}),
					$(document).on("tap",
						function(a) {
							"commentInput" != a.target.id && (b._$send.attr("data-rcid", null), b._$input.attr("placeholder", b._placeholder))
						})
			}
		};
		return {
			run: function() {
				b._init(),
					b._bind()
			}
		}
	} (ejs),
	commentSend_wx = function(a) {
		var b = {
			_init: function() {
				this._$send = $("#commentSend"),
					this._$input = $("#commentInput"),
					this._$list = $("#commentList"),
					this._tmp = $("#commentTmp").text(),
					this._$no_comment = $(".f-no-comment"),
					this._$content = $(".f-content-wrap"),
					this._$win = $(window),
					this._$comment_num = $(".comment-num"),
					this._placeholder = this._$input.attr("placeholder")
			},
			_bind: function() {
				var b = this;
				this._$input.on("keyup",
					function() {
						var a = $(this).val().trim().length;
						0 == a ? b._$send.removeClass("on") : b._$send.addClass("on")
					}),
					this._$send.on("click",
						function() {
							if (MP.isLogin) {
								var c = b._$input.val().trim();
								if (c) {
									if (!MP.str.checkLength(c)) return void MP.alert("最多只能输入110个字哦，请重新编辑。");
									b._$input.val(""),
										b._$send.removeClass("on");
									var d = $(this);
									MP.alertSend("发送中...");
									var e = {
											id: d.attr("data-id"),
											comment: c,
											rcid: d.attr("data-rcid"),
											timing: null
										},
										f = detailPlayer.getTiming(!1);
									return ! f || e.rcid && "null" != e.rcid || (e.timing = f),
										$.post("/medias/comments_create", e,
											function(c) {
												if (c = JSON.parse(c), d.attr("data-rcid", null), b._$input.attr("placeholder", b._placeholder), c.error_code) 20306 == c.error_code ? MP.alert("请不要回复重复的评论.") : MP.alert(c.error);
												else {
													MP.alert(null);
													var f = a.render(b._tmp, {
															MP: MP,
															comments_list: [c],
															get_avatar_url: MP.GAU,
															get_image_url: MP.GIU,
															replace_comment_at: MP.RR
														}),
														g = b._$comment_num.text();
													g = parseInt(g, 10),
														g = isNaN(g) ? 0 : g,
														g += 1,
														b._$comment_num.text(g),
														b._$list.prepend($(f)),
													e.timing && detailPlayer.sendBarrageCallback(c.content_origin, c.barrage)
												}
											},
											function(a) {
												MP.alert("回复失败")
											}),
										!1
								}
							}
						}),
					this._$content.on("click", ".f-conment-text",
						function(a) {
							var c = $(this),
								d = c.parents(".item"),
								e = d.attr("data-name"),
								f = d.attr("data-id");
							return b._$send.attr("data-rcid", f),
								b._$input.attr("placeholder", "回复" + e + ":"),
								!1
						}),
					$(document).on("tap",
						function(a) {
							"commentInput" != a.target.id && (b._$send.attr("data-rcid", null), b._$input.attr("placeholder", b._placeholder))
						})
			}
		};
		return {
			run: function() {
				b._init(),
					b._bind()
			},
			setPlaceholder: function(a) {
				b._placeholder = a
			}
		}
	} (ejs),
	commentLiked = function() {
		return {
			run: function(a) {
				function b(b) {
					if (b = JSON.parse(b), b.error_code) 1001 == b.error_code ? dialogLogin.show() : MP.alert(b.error);
					else {
						a.attr("data-liked", e ? 0 : 1).attr("data-count", f);
						var c = a.find("i");
						e ? c.removeClass(g).removeClass(h) : c.addClass(g).addClass(h),
							setTimeout(function() {
									a.html(f || "").prepend(c)
								},
								100)
					}
				}
				var c = $(".f-content-list").attr("data-id"),
					d = a.parents(".f-comment_list").attr("data-id"),
					e = a.attr("data-liked"),
					f = parseInt(a.attr("data-count"), 10),
					g = "icon-heart-extend",
					h = "icon-liked-an";
				e = 1 == e || "true" == e,
					e ? (f > 0 && f--, $.post("/medias/comments_like_destroy", {
							id: c,
							comment_id: d
						},
						b)) : (f++, $.post("/medias/comments_like_create", {
							id: c,
							comment_id: d
						},
						b))
			}
		}
	} (); !
	function(a) {
		a.detailComment = function() {
			var b = {
				_init: function() {
					a.$body.append($("#commentFormTmp").html()),
						this._$commnetForm = $("#fCommnetForm"),
						this._$commentInput = $("#commentInput"),
						this._$detailCommentLayer = $("#detailCommentLayer")
				},
				_bind: function() {
					function b() {
						var a = e.height(),
							b = d.height(),
							c = e.scrollTop();
						d.css({
							position: "absolute",
							top: a + c - b
						})
					}
					if (this._$commentInput.on("focus",
							function() {
								a.isLogin || dialogLogin.show()
							}), a.currentPlatform == a.platform.iphone) {
						var c = this._$commentInput,
							d = this._$commnetForm,
							e = a.$win;
						c.on("focus",
							function() {
								setTimeout(function() {
										b(),
											e.on("scroll", b)
									},
									100)
							}),
							c.on("blur",
								function() {
									d.removeAttr("style"),
										e.off("scroll", b)
								})
					}
				},
				_run: function() {
					return this._instance || (this._init(), this._bind(), this._instance = !0),
						this
				},
				_show: function() {
					this._$commnetForm.removeClass("hide"),
						this._$detailCommentLayer.show()
				},
				_hide: function() {
					this._$commnetForm.addClass("hide"),
						this._$detailCommentLayer.hide()
				}
			};
			return {
				run: function(a) {
					a.on("moveTo",
						function(a, c, d) {
							d ? b._hide() : b._show()
						}),
						b._run(),
						commentSend_wx.run()
				}
			}
		} (),
			window.MP = a
	} (MP || {});
var detailPlayer = function() {
	function a(a, c, e, h) {
		b = MeipaiPlayer.create(c, {
			endedShow: !0,
			data: {
				endedShowLink: MeipaiPlayer.dataHref
			},
			controls: {
				right: {
					fullscreen: MeipaiPlayer.isAndroid() && !MeipaiPlayer.isChrome() ? !1 : !0
				}
			},
			onlyVideo: MeipaiPlayer.isSimple,
			type: "simple",
			autoplay: !1,
			loop: !1,
			width: f,
			height: f,
			barrage: {
				open: e,
				top: !0,
				bottom: !0,
				data: "/comments/barrage?video_id=" + a
			},
			onloadstart: function() {},
			oncanplay: function(a) {},
			onended: function(a) {},
			ontimeupdate: function(a) {},
			onwaiting: function(a) {},
			onplay: function() {
				d && d.blur()
			},
			onfullscreen: function() {
				this.$video.height(g)
			},
			onfullscreenexit: function() {
				this.$video.height(f)
			}
		})
	}
	var b, c, d, e = localStorage.getItem("barrage-tip", 1),
		f = 320,
		g = $(window).height();
	e = 1 == e ? !0 : !1;
	var h;
	return {
		run: function(d, e) {
			function g(a, c) {
				a && j._$danmuBtn.removeClass(a);
				var d = "骚年，来一发弹幕吧！";
				MP.inWx && commentSend_wx.setPlaceholder(d),
					j._$commentInput.attr(k, d),
					j._$commentInput.attr("data-placeholder", d),
				b && b.barrage.open(),
				c || localStorage.setItem("barrage", "open")
			}
			function i(a, c) {
				a && j._$danmuBtn.addClass(a),
				MP.inWx && commentSend_wx.setPlaceholder(j.defaultPlaceholder),
					j._$commentInput.attr(k, j.defaultPlaceholder),
					j._$commentInput.attr("data-placeholder", j.defaultPlaceholder),
				b && b.barrage.close(),
				c || localStorage.setItem("barrage", "close")
			}
			this._isOpenBarrage = e;
			var j = this,
				k = "placeholder";
			if (this._$context = $(d), f = this._$context.width(), h = parseInt(this._$context.attr("data-time"), 10) - 3, e) {
				var l = localStorage.getItem("barrage");
				l || localStorage.setItem("barrage", "close"),
					l = localStorage.getItem("barrage"),
					this._$head = this._$context.parent().find(".f-head"),
					this._$head.find(".f-name").css("padding-right", "168px"),
					this._$head.find(".f-location").css("padding-right", "168px"),
					"close" == l ? this._$danmuBtn = $('<span class="pa f-danmu-on f-danmu-off js-span-a-click" data-type="弹幕-开"></span>') : (this._$danmuBtn = $('<span class="pa f-danmu-on js-span-a-click" data-type="弹幕-关"></span>'), g()),
					$(".f-user-head-info").append(this._$danmuBtn),
					this._$danmuBtn.tap(function() {
						var a = j.getBarrageState();
						a.isClose ? g(a.css) : i(a.css)
					})
			}
			return this.openBarrageFn = g,
				this.closeBarrageFn = i,
				this._$context.click(function() {
					var d = j.getBarrageState(),
						e = this.getAttribute("data-video"),
						f = this.getAttribute("data-poster"),
						g = this.getAttribute("data-id"),
						h = this.getAttribute("data-time"),
						i = "playerDanmu" + g;
					c = j._$context.html(),
						j._$context.html('<div id="' + i + '" class="meipai-player" video="' + e + '" poster="' + f + '"></div>'),
						a(g, i, d.isOpen, h),
						b.play(),
						MP.statistic(g),
						j._$context.unbind()
				}),
			1 == this._$context.attr("data-auto") && MP.currentPlatform == MP.platform.iphone && this._$context.click(),
				this
		},
		getBarrageState: function() {
			var a = "f-danmu-off",
				b = !this._isOpenBarrage;
			return this._$danmuBtn && (b = this._$danmuBtn.hasClass(a)),
			{
				isOpen: !b,
				isClose: b,
				css: a
			}
		},
		barrage: function(a) {
			var c = this;
			this._$commentInput = $(a);
			var f = "placeholder";
			this.defaultPlaceholder = this._$commentInput.attr(f),
				this._$commentInput.attr("data-placeholder", this.defaultPlaceholder),
			MP.inWx && commentSend_wx.setPlaceholder(this.defaultPlaceholder);
			var g = $("#commentSend");
			return this._$commentInput.focus(function() {
				var a = g.attr("data-rcid");
				if (!a || "null" == a) {
					var d = c.getBarrageState();
					d.isOpen && (e || (localStorage.setItem("barrage-tip", 1), MP.alert("在视频播放过程中，也可以发弹幕哦~"), e = !0), c._$commentInput.attr(f, c.getTiming(!0) + " 来一发弹幕"))
				}
				b && b.pause()
			}).blur(function() {
				var a = c._$commentInput.attr("data-placeholder");
				c._$commentInput.attr(f, a)
			}),
				d = this._$commentInput,
				this
		},
		getTiming: function(a) {
			return this.getBarrageState().isOpen ? b ? b.video.ended ? a ? "00:00": this.getRandom() : b.currentTime(a) : a ? "00:00": this.getRandom() : null
		},
		getRandom: function() {
			var a = 1e3 * Math.random() % h;
			return 0 == a ? 1 : a
		},
		sendBarrageCallback: function(a, c) {
			var d = this.getBarrageState();
			d.isOpen && (b ? (c.content = a, b.barrage.addFire(c, "bottom"), b.play()) : this._$context.click())
		}
	}
} (); !
	function(a) {
		a.detailSlider = function(b, c, d) {
			function e() {
				var a = f.refresh();
				p.removeClass(n);
				var b = p.eq(m);
				b.addClass(n),
					q.moveToPoint(m),
					r.$titleTap = b,
					r.$contentTap = a,
					r.currentPoint = m,
					f.emit("moveTo", b, a, m)
			}
			var f = a.Event.create(),
				g = $(b),
				h = g.parent(),
				i = g.children(),
				j = i.length,
				k = h.width(),
				l = k * j;
			d = d || j,
				d = d > j ? j: d;
			var m = d - 1,
				n = "current",
				o = $(c),
				p = o.children(),
				q = Flipsnap(b, {
					distance: k
				});
			a.$win.resize(function() {
				k = g.parent().width(),
					i.width(k),
					l = k * j,
					q.distance = k,
					g.width(l),
					q.refresh(),
					f.refresh()
			}),
				i.width(k),
				g.width(l),
				q.element.addEventListener("fstouchend",
					function(a) {
						m = a.newPoint,
							e()
					},
					!1),
				p.eq(m).addClass(n),
				$.each(p,
					function(a, b) {
						$(b).data("iflag", a)
					}),
				p.tap(function() {
					var a = $(this),
						b = parseInt(a.data("iflag"), 10);
					b != m && (m = b, e())
				});
			var r = {
				$sliderTitle: o
			};
			return f.getPoint = function() {
				return m
			},
				f.run = function() {
					e()
				},
				f.getNode = function() {
					return r
				},
				f.refresh = function() {
					var a = i.eq(m),
						b = a.height();
					return g.height(b),
						a
				},
				f
		},
			window.MP = a
	} (MP || {}),
	function(a) {
		a.detailTimeline = function() {
			var b = a.Event.create(),
				c = $("#mediaHotTemplate").text(),
				d = $("#commentTmp").text(),
				e = $("#commentList"),
				f = $("#userTimelineList"),
				g = $("#hotTimelineList"),
				h = a.$win,
				i = $("#tipLoading"),
				j = $("#allLoading");
			b.on("showTip",
				function() {
					i.show(),
						j.hide()
				}),
				b.on("hideTip",
					function() {
						i.hide(),
							j.show()
					}),
				b.once("scroll",
					function() {
						var c, d = $(".J_f_tab"),
							e = $(".f-content-wrap"),
							f = $(".f-tab-wrap").css("position"),
							g = function() {
								var a = e.offset().top,
									b = h.scrollTop();
								b >= a ? d.addClass("fixed") : d.removeClass("fixed")
							};
						a.$win.scroll(function() {
							l.refresh(),
							-1 == f.indexOf("sticky") && g(),
								clearTimeout(c),
								c = setTimeout(function() {
										var c = i.offset().top,
											d = h.scrollTop(),
											e = h.height();
										d + e + 500 > c && (b.emit("load"), a.tongji("上拉加载", "scroll"))
									},
									100)
						})
					}),
				b.on("load",
					function() {
						var a = l.getNode(),
							c = a.$titleTap.data("cmd"),
							d = a.$titleTap.data("stop");
						d ? b.emit("hideTip") : (b.emit("showTip"), b.emit(c, a.$sliderTitle))
					});
			var k = {
				loadCmd: !1,
				loadUserTimeline: !1,
				loadHotTimeline: !1
			};
			b.on("loadCmd",
				function(c) {
					if (!k.loadCmd) {
						var f = c.find('[data-cmd="loadCmd"]'),
							g = f.data("url"),
							h = {
								page: f.data("page"),
								count: f.data("count"),
								id: f.data("mid"),
								maxid: f.data("maxid")
							};
						k.loadCmd = !0,
							b.emit("ajax", g, h, f,
								function(b) {
									var c = ejs.render(d, {
										MP: a,
										comments_list: b,
										get_avatar_url: a.GAU,
										get_image_url: a.GIU,
										replace_comment_at: a.RR
									});
									e.append(c),
										l.refresh(),
										f.data("page", ++h.page),
										f.data("maxid", b[b.length - 1].id.toString()),
										k.loadCmd = !1
								})
					}
				}),
				b.on("loadUserTimeline",
					function(d) {
						if (!k.loadUserTimeline) {
							var e = d.find('[data-cmd="loadUserTimeline"]'),
								g = e.data("url"),
								h = {
									page: e.data("page"),
									count: e.data("count"),
									id: e.data("uid"),
									category: 0
								},
								i = e.data("mid");
							k.loadUserTimeline = !0,
								b.emit("ajax", g, h, e,
									function(b) {
										var d = ejs.render(c, {
											MP: a,
											recommend_medias: b,
											get_avatar_url: a.GAU,
											get_image_url: a.GIU,
											id: i,
											dataType1: "我的",
											dataType2: "我的"
										});
										f.append(d),
											l.refresh(),
											e.data("page", ++h.page),
											k.loadUserTimeline = !1
									})
						}
					}),
				b.on("loadHotTimeline",
					function(d) {
						if (!k.loadHotTimeline) {
							var e = d.find('[data-cmd="loadHotTimeline"]'),
								f = e.data("url"),
								h = {
									page: e.data("page"),
									count: e.data("count"),
									category: 0
								},
								i = e.data("mid");
							k.loadHotTimeline = !0,
								b.emit("ajax", f, h, e,
									function(b) {
										var d = ejs.render(c, {
											MP: a,
											recommend_medias: b,
											get_avatar_url: a.GAU,
											get_image_url: a.GIU,
											id: i
										});
										g.append(d),
											l.refresh(),
											e.data("page", ++h.page),
											k.loadHotTimeline = !1
									})
						}
					}),
				b.on("ajax",
					function(a, c, d, e) {
						$.ajax({
							url: a,
							type: "get",
							data: c,
							dataType: "json",
							success: function(a) {
								a.error_code || !a.length ? (d.data("stop", 1), b.emit("hideTip")) : e(a)
							}
						})
					});
			var l;
			return {
				run: function(a) {
					return l = a,
						b.emit("scroll"),
						this
				}
			}
		} (),
			window.MP = a
	} (MP || {});
var dialogLogin = function() {
	var a = {
			_instance: null,
			_handle: 0,
			_init: function() {
				this._$page = $(".page"),
					this._$layout = $("#pageLayout"),
					this._$content = $("#dialogLogin"),
					this._$cancel = $("#dialogLoginCancel"),
					this._$dLogin = $(".d-login-o"),
					this._pageClass = this._$content.attr("data-page-class"),
					this._layoutClass = this._$layout.attr("data-animate-class").split(","),
					this._animateClass = this._$content.attr("data-animate-class").split(",")
			},
			_bind: function() {
				this._$cancel.on("click", this._hide.bind(this))
			},
			_show: function() {
				clearTimeout(this._handle),
					this._$page.addClass(this._pageClass),
					this._$layout.removeClass(this._layoutClass[1]).addClass(this._layoutClass[0]),
					this._$content.show().removeClass(this._animateClass[1]).addClass(this._animateClass[0])
			},
			_hide: function() {
				var a = this;
				return this._$dLogin.hide(),
					this._$page.removeClass(this._pageClass),
					this._$layout.removeClass(this._layoutClass[0]).addClass(this._layoutClass[1]),
					this._$content.removeClass(this._animateClass[0]).addClass(this._animateClass[1]),
					this._handle = setTimeout(function() {
							a._$content.hide()
						},
						250),
					!1
			},
			_run: function() {
				return this._instance || (this._init(), this._bind(), this._instance = !0),
					this
			}
		},
		b = {
			show: function() {
				var b = MP.WeixinLoginUrl;
				MP.inWx && b ? (sessionStorage.setItem("wx-login", 1), location.replace(b)) : MP.inQQ && MP.QQLoginUrl ? (sessionStorage.setItem("wx-login", 1), location.replace(MP.QQLoginUrl)) : a._run()._show()
			},
			hide: function() {
				a._run()._hide()
			}
		};
	return window.addEventListener("MeipaiJsBridgeReady",
		function() {
			b.show = function() {
				MPJs.nativeCall("loginweb", {
						auto: 1
					},
					function(a) {
						$.post("/connect/meipaiapp", {
								access_token: a.access_token
							},
							function(a) {
								a.error_code ? MP.alert(a.error) : location.reload()
							})
					})
			}
		},
		!1),
		b
} ();
$.fn.MPScroll = function(a) {
	var b = this,
		c = b.children(),
		d = c.eq(0).width() * c.length,
		e = b.parent().width(),
		f = d - e,
		g = Flipsnap(a, {
			distance: f > 0 ? f / 3 : 0,
			maxPoint: 3
		});
	$(window).resize(function() {
		d = c.eq(0).width() * c.length,
			e = b.parent().width(),
			f = d - e,
			g.distance = f > 0 ? f / 3 : 0,
			g.refresh()
	}),
		this.width(d)
};
var login_wx = function() {
		return {
			run: function() {
				window.location.replace("/connect/weixin?referer=" + encodeURIComponent(location.href))
			}
		}
	} (),
	oauthWeibo = function() {
		function a(b, c) {
			var d = prompt(b);
			d && d.trim() && (c.screen_name = d, $.post("/users/create", c,
				function(b) {
					b = JSON.parse(b),
						20112 == b.error_code ? a(b.error, b.user) : b.error_code ? MP.alert(b.error) : location.reload()
				}))
		}
		return {
			run: function(b, c, d) {
				2010 == b ? MP.alert(c) : 20112 == b && a(c, d)
			}
		}
	} (); !
	function(a) {
		a.openAppTip = function() {
			var b = {
				_init: function() {
					var b = $("#detail_dialog_tip_template").text();
					this._$content = $(b),
						a.$body.append(this._$content)
				},
				_show: function() {
					a.tipMask.show(),
						a.tipMask.get().on("click", this._maskEvent.bind(this)),
						this._$content.show()
				},
				_hide: function() {
					a.tipMask.hide(),
						a.tipMask.get().off("click", this._maskEvent.bind(this)),
						this._$content.hide()
				},
				_maskEvent: function() {
					return this._hide(),
						!1
				},
				_bind: function() {
					var b = this;
					$(".js_open_app").on("click",
						function() {
							a.inQQ || a.inWx || !b.isNeedCallApp ? a.currentPlatform == a.platform.android ? a.redirect(b.redirect) : b._show() : a.callApp(b.scheme)
						})
				},
				_run: function() {
					return this._instance || (this._init(), this._bind(), this._instance = !0),
						this
				}
			};
			return {
				run: function(a) {
					a && $.extend(b, a),
						b._run()
				}
			}
		} (),
			window.MP = a
	} (MP || {});
var shareModule = function() {
		var a = {
			_init: function() {
				if (!MP.inWx) {
					var a = $("#shareModuleTemplate").html();
					$("#moduleMediaShareList").html(a)
				}
				this._$doc = $(document),
					this._$page = $(".page"),
					this._$weibo = $("#shareWeibo"),
					this._$qzone = $("#shareQzone"),
					this._$qq = $("#shareQQ"),
					this._$wxs = $("#shareWxs"),
					this._$wx = $("#shareWx"),
					this._$copy = $("#shareCopy"),
					this._$shareModule = $("#shareModule").hide(),
					this._$cancel = $("#shareModuleCancel"),
					this._pageClass = this._$shareModule.attr("data-page-class"),
					this._animateClass = this._$shareModule.attr("data-animate-class").split(",")
			},
			_bind: function() {
				var a = this,
					b = 0,
					c = location.pathname,
					d = -1 != c.indexOf("/media/");
				d || (d = -1 != c.indexOf("/live/")),
					this._$doc.delegate(".js-span-export", "tap",
						function() {
							var c;
							c = MP.inWx ? "分享（其他）": "分享（微信）",
								MP.tongji(c),
								MP.hideTipInWeixin();
							var e = $(this);
							return 1 == e.attr("data-islocked") ? (MP.alert("由于你的隐私设置，该美拍不能转发和分享。"), !1) : (a._shareUrl_ = e.attr("data-shareUrl"), clearTimeout(b), a._shareName = e.attr("data-share-name"), a._shareCaption = e.attr("data-share-caption"), a._shareId = e.attr("data-id"), a._shareImg = e.attr("data-share-img"), a._shareQzoneCaption = e.attr("data-share-qzone-caption"), a._shareWeiboCaption = e.attr("data-share-weibo-caption"), a._dataIsphoto = null, a._dataSharePic = null, a._showRepost_ = !1, a._dataIsphoto = e.attr("data-isphoto"), a._dataSharePic = e.attr("data-share-pic"), a._$page.addClass(a._pageClass), MP.tipMask.show(), a._$shareModule.show().removeClass(a._animateClass[1]).addClass(a._animateClass[0]), a._initMPScroll || (MP.inWx && d ? MP.shareInWeixin() : (a._$wxs.remove(), a._$wx.remove(), a._$copy.remove()), $("#moduleMediaShareList").MPScroll("#moduleMediaShareList"), a._initMPScroll = !0), a._shareWeibo(), a._shareQzone(), a._shareQzone(1), !1)
						}),
					this._$cancel.on("tap",
						function() {
							return a._$page.removeClass(a._pageClass),
								a._$shareModule.removeClass(a._animateClass[0]).addClass(a._animateClass[1]),
								a._$weibo.attr("href", "javascript:;"),
								a._$qzone.attr("href", "javascript:;"),
								a._$qq.attr("href", "javascript:;"),
								b = setTimeout(function() {
										a._$shareModule.hide(),
										a._showRepost_ || MP.tipMask.hide()
									},
									400),
								MP.hideTipInWeixin(),
								!1
						})
			},
			_shareWeibo: function() {
				var a = this,
					b = {
						appkey: 680740738,
						url: a._shareUrl_,
						title: this._shareWeiboCaption,
						ralateUid: 2312920530,
						source: "美拍",
						sourceUrl: "http://www.meipai.com",
						content: "utf8",
						searchPic: "false"
					};
				1 == this._dataIsphoto && (b.pic = this._dataSharePic);
				var c = [];
				for (var d in b) c.push(d + "=" + encodeURIComponent(b[d] || ""));
				setTimeout(function() {
						a._$weibo.attr("href", "http://service.weibo.com/share/share.php?" + c.join("&"))
					},
					500)
			},
			_shareQzone: function(a) {
				var b = this,
					c = {
						url: b._shareUrl_,
						summary: this._shareQzoneCaption,
						site: "美拍"
					},
					d = {
						page: "shareindex.html",
						style: "9",
						summary: this._shareQzoneCaption,
						site: "美拍",
						sdkv: "0",
						title: "美拍",
						status_os: "0",
						sdkp: "0",
						imageUrl: b._shareImg,
						action: "shareToQQ",
						targetUrl: b._shareUrl_,
						page_url: b._shareUrl_,
						appid: 2004
					},
					e = [];
				for (var f in d) e.push(f + "=" + encodeURIComponent(d[f] || ""));
				1 == this._dataIsphoto && (c.pics = this._dataSharePic);
				var g = [];
				for (var f in c) g.push(f + "=" + encodeURIComponent(c[f] || ""));
				setTimeout(function() {
						a ? b._$qq.attr("href", "http://connect.qq.com/widget/shareqq/index.html?" + g.join("&")) : b._$qzone.attr("href", "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + g.join("&"))
					},
					500)
			},
			_repost: function() {
				var a = $("#shareModuleRepost"),
					b = $("#shareModuleRepostWarp").hide(),
					c = $("#shareModuleRepostImg"),
					d = $("#shareModuleRepostBtn"),
					e = $("#shareModuleRepostTxt"),
					f = $("#shareModuleRepostCancel"),
					g = b.attr("data-page-class"),
					h = b.attr("data-animate-class").split(","),
					i = this,
					j = 0;
				a.on("tap",
					function() {
						return MP.hideTipInWeixin(),
							i._showRepost_ = !0,
							i._$cancel.trigger("tap"),
							clearTimeout(j),
							i._$page.addClass(g),
							MP.tipMask.show(),
							b.show().removeClass(h[1]).addClass(h[0]),
							c.attr("src", i._shareImg),
							e.val(""),
							!1
					}),
					f.on("tap",
						function() {
							return i._$page.removeClass(g),
								b.removeClass(h[0]).addClass(h[1]),
								j = setTimeout(function() {
										MP.tipMask.hide(),
											b.hide()
									},
									250),
								!1
						}),
					d.on("tap",
						function() {
							var a = e.val();
							return MP.str.checkLength(a) ? (f.trigger("tap"), MP.alertSend("发送中..."), $.post("/medias/reposts_create", {
									id: i._shareId,
									caption: a
								},
								function(a) {
									a = JSON.parse(a),
										a.error_code ? 21401 == a.error_code ? MP.alert("同样的转发已经发过一次啦") : MP.alert(a.error) : MP.alert("转发成功")
								},
								function(a) {
									MP.alert("转发失败")
								}), !1) : void MP.alert("最多只能输入110个字哦，请重新编辑。")
						})
			}
		};
		return {
			run: function() {
				MP.isLogin && a._repost(),
					a._init(),
					a._bind()
			}
		}
	} (),
	timelineLoadMore = function(a) {
		var b = {
			_offset: 50,
			_islast: !1,
			_isload: !1,
			_nomore: MP.loadNoMoreTxt,
			_init: function(a) {
				this._$win = $(window),
					this._$tip = $("#loading"),
					this._$content = $("#timelineContent"),
					this._template = $("#" + (a || "timelineItemTmp")).text()
			},
			_bind: function() {
				var a = this;
				this._bindFn = function() {
					if (!a._isload) {
						var b = a._$tip.offset().top,
							c = a._$win.scrollTop(),
							d = a._$win.height();
						b < c + d - a._offset && (a._isload = !0, a._get())
					}
				},
					this._$win.on("scroll", this._bindFn)
			},
			_unbind: function() {
				this._$win.unbind("scroll", this._bindFn),
					this._$tip.text(this._nomore)
			},
			_get: function() {
				var a = this,
					b = {
						page: this._page,
						count: this._count,
						maxid: this._maxid
					};
				b = $.extend(b, this._params),
					$.get(this._url, b,
						function(b) {
							if (b = JSON.parse(b), (b.error_code || !b.length) && a._unbind(), 0 != b.length) {
								var c = b[b.length - 1].id;
								a._maxid = c ? c.toString() : "",
									a._render(b)
							}
							a._isload = !1,
								a._page++
						})
			},
			_render: function(b) {
				var c = a.render(this._template, {
					MP: MP,
					recommend_medias: b,
					get_avatar_url: MP.GAU,
					get_image_url: MP.GIU,
					replace_comment_at: MP.RR,
					is_login: MP.isLogin
				});
				this._$content.append($(c))
			}
		};
		return {
			run: function(a, c, d, e, f) {
				if (a && "string" == typeof a) {
					b._url = a,
						b._page = c || 2,
						b._count = d || 8,
						b._maxid = e || 0,
						b._params = f || {},
						b._init(this.templateId),
						b._bind();
					var g = location.search;
					return - 1 != g.indexOf("hasfooter=no") && (b._offset = 0, $(".page").css("padding-bottom", 0)),
						this
				}
			}
		}
	} (ejs),
	timelinePlayEmo = function() {
		function a(a, c, d) {
			var e = ejs.render(b, {
				_data: {
					emotags: c
				},
				width: d,
				height: d,
				size: d,
				MP: MP
			});
			$(a).append($(e)).find(".js-hide").hide()
		}
		var b;
		return {
			run: function(c) {
				b = $("#emoItemTemplate").text();
				var d = "click",
					e = this.MPAudio = {},
					f = this;
				$(document).delegate(".f-emo-img", d,
					function() {
						if (e._timer) return ! 1;
						var a = $(this).parent(),
							b = a.find(".emotags"),
							c = a.find(".emo-wrap");
						b.removeClass("emo-hide").removeClass("emo-show");
						var d = a.attr("data-state");
						return "show" == d ? (b.addClass("emo-hide"), e._timer = setTimeout(function() {
								c.hide(),
									e._timer = null
							},
							400), e.crrentMp3 = null, e.$audio && e.$audio.get(0) && e.$audio.get(0).pause(), f.emoVoicePause(e.tipsElement), a.attr("data-state", "hide")) : (b.addClass("emo-show"), c.show(), a.attr("data-state", "show")),
							!1
					}).delegate(".emo-tags-audio", d,
					function() {
						var a = $(this),
							b = a.attr("data-audio"),
							c = a.attr("data-duration");
						return clearTimeout(e.currentTimer),
							f.emoVoicePause(e.tipsElement),
							b == e.crrentMp3 ? (e.$audio.get(0).pause(), e.crrentMp3 = null) : (e.crrentMp3 = b, e.$audio && e.$audio.get(0).pause(), e.$audio = $("<audio>").attr("src", b), e.$audio.get(0).play(), "onended" in e.$audio.get(0) ? e.$audio.get(0).onended = function() {
								e.crrentMp3 = null,
									f.emoVoicePause(e.tipsElement)
							}: e.currentTimer = setTimeout(function() {
									e.crrentMp3 = null,
										f.emoVoicePause(e.tipsElement)
								},
								1e3 * c), e.tipsElement = a.find(".emo-voice-pause"), f.emoVoicePlay(e.tipsElement)),
							!1
					});
				var g, h = $(window).width();
				0 != MP.currentPlatform && (h = h > 450 ? 320 : h);
				var i = $(window);
				return i.scroll(function() {
					clearTimeout(g),
						g = setTimeout(function() {
								var b = i.scrollTop(),
									c = i.height();
								$(".f-emo-init").each(function(d, e) {
									var f = $(this),
										g = f.offset().top,
										i = g + .5 * h;
									if (i > b && b + c > i) {
										var j = f,
											k = decodeURIComponent(j.attr("data-emo"));
										if (k && "undefined" != k) {
											var l = JSON.parse(k);
											a(e, l, h),
												j.css({
													width: h,
													height: h
												});
											var m = j.find(".emotags"),
												n = j.find(".emo-wrap").hide();
											n.show(),
												m.addClass("emo-show"),
												j.attr("data-state", "show")
										}
										return j.removeClass("f-emo-init"),
											!1
									}
								})
							},
							500)
				}).scroll(),
					this
			},
			stop: function() {
				return this.MPAudio && (this.MPAudio.crrentMp3 = null, this.MPAudio.$audio && this.MPAudio.$audio.get(0) && this.MPAudio.$audio.get(0).pause(), this.emoVoicePause(this.MPAudio.tipsElement)),
					this
			},
			emoVoicePause: function(a) {
				if (a) {
					var b = a.attr("data-origin-class");
					return b && (a.attr("class", b), a.attr("data-origin-class", "")),
					this.MPAudio && clearInterval(this.MPAudio.playTimer),
						this
				}
			},
			emoVoicePlay: function(a) {
				if (a) {
					timelinePlayVideo.stop(),
						a.attr("data-origin-class", a.attr("class")),
						a.removeClass("emo-voice-pause");
					var b = a.attr("class");
					if (this.MPAudio) {
						var c = -1;
						this.MPAudio.playTimer = setInterval(function() {
								a.attr("class", b + " emo-voice-play" + (++c % 3 + 1))
							},
							350)
					}
					return this
				}
			},
			refresh: function() {
				var b = $(window).width();
				0 != MP.currentPlatform && (b = b > 450 ? 320 : b),
					$(".f-emo-init").each(function(c, d) {
						var e = $(d),
							f = decodeURIComponent(e.attr("data-emo"));
						if (f && "undefined" != f) {
							var g = JSON.parse(f);
							a(d, g, b),
								e.css({
									width: b,
									height: b
								});
							var h = e.find(".emotags"),
								i = e.find(".emo-wrap").hide();
							i.show(),
								h.addClass("emo-show"),
								e.attr("data-state", "show")
						} else e.removeClass("f-emo-init")
					})
			}
		}
	} (),
	timelinePlayVideo = function() {
		function a(a, b, c, d) {
			return MeipaiPlayer.create(b, {
				endedShow: !0,
				controls: {
					right: {
						fullscreen: MeipaiPlayer.isAndroid() && !MeipaiPlayer.isChrome() ? !1 : !0
					}
				},
				data: {
					endedShowLink: MeipaiPlayer.dataHref
				},
				onlyVideo: MeipaiPlayer.isSimple,
				type: "simple",
				autoplay: !1,
				loop: !1,
				width: e,
				height: e,
				barrage: {
					open: c,
					top: !0,
					bottom: !0,
					data: "/comments/barrage?video_id=" + a
				},
				onfullscreen: function() {
					this.$video.height(f)
				},
				onfullscreenexit: function() {
					this.$video.height(e)
				}
			})
		}
		var b, c, d, e = 320,
			f = $(window).height();
		return {
			run: function() {
				var f = this;
				MeipaiPlayer.isSupport = MP.checkSupportVideo(),
					MP.currentPlatform == MP.platform.android ? MeipaiPlayer.isSimple = !MeipaiPlayer.isSupport: MeipaiPlayer.isSimple = MP.iOSSUA(),
					MP.$doc.delegate(".js-play", "click",
						function() {
							timelinePlayEmo.stop();
							var g = this.getAttribute("data-id");
							if (g != c) {
								f.stop();
								var h = $(this),
									i = this.getAttribute("data-video"),
									j = h.find("img").attr("src"),
									k = this.getAttribute("data-time"),
									l = "playerDanmu" + g;
								b = h.html(),
									$(this).html('<div id="' + l + '" class="meipai-player" video="' + i + '" poster="' + j + '"></div>'),
									e = h.width();
								var m = a(g, l, !1, k);
								m.play(),
									MP.statistic(g),
									c = g,
									d = h
							}
						})
			},
			stop: function() {
				d && (d.html(b), d = null, c = null)
			}
		}
	} (),
	userFollowed = function() {
		var a = {
			followed: "user-btn-followed",
			follow: "user-btn-follow",
			_get: function(a) {
				switch (a) {
					case 1:
						return $("<span>").addClass(this.followed).html('<i class="micon m-icon-followed-e"></i>互相关注');
					case 2:
						return $("<span>").addClass(this.followed).html('<i class="micon m-icon-followed"></i>已关注');
					default:
						return $("<span>").addClass(this.follow).html('<i class="mp-iconfont mp-s18">&#xe60a;</i>关注')
				}
			},
			_bind: function() {
				var a = this;
				$(document).delegate("." + this.followed, "click",
					function() {
						var b = $(this),
							c = b.parent(),
							d = b.attr("data-id");
						return confirm("确定取消关注吗？") && $.post("/users/friendships_destroy", {
								id: d
							},
							function(e) {
								if (e = JSON.parse(e), e.error_code) MP.alert(e.error);
								else {
									var f = a._get(3);
									f.attr("data-id", d),
										b.remove(),
										c.append(f)
								}
							}),
							!1
					}).delegate("." + this.follow, "click",
					function() {
						if (!MP.isLogin) return void dialogLogin.show();
						var b = $(this),
							c = b.parent(),
							d = b.attr("data-id");
						return $.post("/users/friendships_create", {
								id: d
							},
							function(e) {
								if (e = JSON.parse(e), e.error_code) MP.alert(e.error);
								else if ("media" != a._type) {
									if (e.following && e.followed_by) var f = a._get(1);
									else var f = a._get(2);
									f.attr("data-id", d),
										b.remove(),
										c.append(f)
								} else b.next().show(),
									b.remove()
							}),
							!1
					})
			}
		};
		return {
			run: function(b) {
				a._type = b,
					a._bind()
			}
		}
	} (),
	userLoadMore = function(a) {
		var b = {
			_offset: 50,
			_islast: !1,
			_isload: !1,
			_nomore: MP.loadNoMoreTxt,
			_init: function() {
				this._$win = $(window),
					this._$tip = $("#userLoading"),
					this._$content = $("#userContent"),
					this._template = $("#userItemTmp").text()
			},
			_bind: function() {
				var a = this;
				this._bindFn = function() {
					if (!a._isload) {
						var b = a._$tip.offset();
						if (b) var c = b.top;
						var d = a._$win.scrollTop(),
							e = a._$win.height();
						c < d + e - a._offset && (a._isload = !0, a._get())
					}
				},
					this._$win.on("scroll", this._bindFn)
			},
			_unbind: function() {
				this._$win.unbind("scroll", this._bindFn),
					this._$tip.text(this._nomore)
			},
			_get: function() {
				var a = this,
					b = {
						page: this._page,
						count: this._count,
						id: this._uid
					};
				b = $.extend(b, this._params),
					$.get(this._url, b,
						function(b) {
							b = JSON.parse(b),
								a._isload = !1,
								a._page++,
							(b.error_code || b.length < a._count) && a._unbind(),
							0 != b.length && a._render(b)
						})
			},
			_render: function(b) {
				var c = a.render(this._template, {
					MP: MP,
					recommend_medias: b,
					get_avatar_url: MP.GAU,
					get_image_url: MP.GIU,
					replace_comment_at: MP.RR,
					is_login: MP.isLogin
				});
				this._$content.append($(c))
			}
		};
		return {
			run: function(a, c, d, e, f) {
				a && "string" == typeof a && (b._url = a, b._page = c || 2, b._count = d || 8, b._uid = e, b._params = f || {},
					b._init(), b._bind())
			}
		}
	} (ejs),
	userShareModule = MP.userShareModule = function() {
		var a = {
			_init: function() {
				this._$doc = $(document),
					this._$page = $(".page"),
					this._$weibo = $("#usershareWeibo"),
					this._$qzone = $("#usershareQzone"),
					this._$qq = $("#usershareQQ"),
					this._$wxs = $("#usershareWxs"),
					this._$wx = $("#usershareWx"),
					this._$copy = $("#usershareCopy"),
					this._$layout = $("#pageLayout"),
					this._$shareModule = $("#userShareModule").hide(),
					this._$cancel = $("#userShareModuleCancel"),
					this._pageClass = this._$shareModule.attr("data-page-class"),
					this._layoutClass = this._$layout.attr("data-animate-class").split(","),
					this._animateClass = this._$shareModule.attr("data-animate-class").split(",")
			},
			_bind: function() {
				var a = this,
					b = 0;
				this._$doc.delegate(".js-share-page", "tap",
					function() {
						MP.tongji("shareModule"),
							MP.hideTipInWeixin();
						var c = $(this);
						return clearTimeout(b),
							a._shareName = c.attr("data-share-name"),
							a._shareId = c.attr("data-id"),
							a._$page.addClass(a._pageClass),
							a._$layout.removeClass(a._layoutClass[1]).addClass(a._layoutClass[0]),
							a._$shareModule.show().removeClass(a._animateClass[1]).addClass(a._animateClass[0]),
						a._initMPScroll || (MP.inWx ? MP.shareInWeixin() : (a._$wxs.remove(), a._$wx.remove(), a._$copy.remove()), $("#moduleShareList").MPScroll("#moduleShareList"), a._initMPScroll = !0),
							a._shareWeibo(),
							a._shareQzone(),
							a._shareQzone(1),
							!1
					}),
					this._$cancel.on("tap",
						function() {
							return a._$page.removeClass(a._pageClass),
								a._$layout.removeClass(a._layoutClass[0]).addClass(a._layoutClass[1]),
								a._$shareModule.removeClass(a._animateClass[0]).addClass(a._animateClass[1]),
								a._$weibo.attr("href", "javascript:;"),
								a._$qzone.attr("href", "javascript:;"),
								a._$qq.attr("href", "javascript:;"),
								b = setTimeout(function() {
										a._$shareModule.hide()
									},
									400),
								MP.hideTipInWeixin(),
								!1
						})
			},
			_shareWeibo: function() {
				var a = {
					appkey: 680740738,
					ralateUid: 2312920530,
					sourceUrl: MP.site,
					content: "utf8",
					searchPic: "false"
				};
				"user" == this._type ? (a.url = MP.site + "user/" + this._shareId, a.title = "分享 @" + this._shareName + " 的美拍主页，快来看看吧！") : "square" == this._type ? (a.url = MP.site + "square/" + this._shareId, a.title = "分享了美拍广场“" + this._shareName + "”，快来看看吧！", this._isparent && (a.url = MP.site + "squares/more/?id=" + this._shareId)) : (a.url = MP.site + "topic/" + this._shareId, a.title = "分享了美拍话题#" + this._shareName + "#，快来看看吧！");
				var b = [];
				for (var c in a) b.push(c + "=" + encodeURIComponent(a[c] || ""));
				this._$weibo.attr("href", "http://service.weibo.com/share/share.php?" + b.join("&"))
			},
			_shareQzone: function(a) {
				if ("user" == this._type) var b = {
					url: MP.site + "user/" + this._shareId,
					summary: "分享 " + this._shareName + " 的美拍主页，快来看看吧！",
					site: "美拍"
				};
				else if ("square" == this._type) {
					var b = {
						url: MP.site + "square/" + this._shareId,
						summary: "分享了美拍广场“" + this._shareName + "”，快来看看吧！",
						site: "美拍"
					};
					this._isparent && (b.url = MP.site + "squares/more/?id=" + this._shareId)
				} else var b = {
					url: MP.site + "topic/" + this._shareId,
					summary: "分享了美拍话题#" + this._shareName + "#，快来看看吧！",
					site: "美拍"
				};
				b.pics = "http://img.app.meitudata.com/meitumv/icon/meipai.png";
				var c = [];
				for (var d in b) c.push(d + "=" + encodeURIComponent(b[d] || ""));
				a ? this._$qq.attr("href", "http://connect.qq.com/widget/shareqq/index.html?" + c.join("&")) : this._$qzone.attr("href", "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + c.join("&"))
			}
		};
		return {
			run: function(b, c) {
				a._init(),
					a._bind(),
					a._type = b || "user",
					a._isparent = c
			}
		}
	} (),
	videoLiked = function() {
		return {
			run: function(a) {
				function b(b) {
					if (b = JSON.parse(b), b.error_code) 1001 == b.error_code ? dialogLogin.show() : MP.alert(b.error);
					else {
						a.attr("data-liked", d ? 0 : 1).attr("data-count", e);
						var c = a.find("i");
						d ? c.removeClass(g) : c.addClass(g);
						MP.inWx && f || MP.live ? d ? c.addClass(h) : c.removeClass(h) : d ? c.removeClass(i) : c.addClass(i),
							setTimeout(function() {
									a.html(" " + (e || "赞")).prepend(c)
								},
								100)
					}
				}
				var c = a.attr("data-id"),
					d = a.attr("data-liked"),
					e = parseInt(a.attr("data-count"), 10),
					f = -1 != location.pathname.indexOf("/media/"),
					g = "icon-heart-extend",
					h = "animate-beat",
					i = "icon-liked-an";
				d = 1 == d || "true" == d,
					d ? (e > 0 && e--, $.post("/medias/likes_destroy", {
							id: c
						},
						b)) : (e++, $.post("/medias/likes_create", {
							id: c
						},
						b))
			}
		}
	} ();