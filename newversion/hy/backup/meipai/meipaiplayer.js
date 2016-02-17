/*! MeipaiPlayer v0.6.4 | Meipai HTML5 Video Player | Copyright (c) 2015 Meitu, Inc. | By: Pandao | http://www.meipai.com/ | 2016-02-03 */
!
	function(t) {
		"use strict";
		"function" == typeof define && (define.amd || define.cmd) ? define(["jquery"], t) : window.MeipaiPlayer = t("undefined" != typeof jQuery ? jQuery: Zepto)
	} (function(t) {
		"use strict";
		function e() {
			return /iPhone|iPad|iPod/.test(navigator.userAgent)
		}
		function i() {
			return /MicroMessenger/.test(navigator.userAgent)
		}
		function n() {
			return /Android/.test(navigator.userAgent)
		}
		function o() {
			return /QQ\//.test(navigator.userAgent)
		}
		function r() {
			return /MQQBrowser/.test(navigator.userAgent)
		}
		function s() {
			return /Chrome/.test(navigator.userAgent)
		}
		function a() {
			return /Meitu/.test(navigator.userAgent)
		}
		function u() {
			return "undefined" != typeof t.zepto
		}
		function l() {
			var t = navigator.userAgent.match(/NetType\/(\w+)/),
				e = window.connection ? window.connection.type: t ? t[1] : 0;
			switch (e) {
				case 0:
					e = "UNKNOWN";
					break;
				case 1:
					e = "ETHERNET";
					break;
				case 2:
					e = "WIFI";
					break;
				case 3:
					e = "2G";
					break;
				case 4:
					e = "3G";
					break;
				case 5:
					e = "4G";
					break;
				case 6:
					e = "NONE"
			}
			return e
		}
		function c(t, e) {
			var i = e - t + 1;
			return Math.floor(Math.random() * i + t)
		}
		function d() {
			var t = "boolean" != typeof arguments[0] || arguments[0] ? "#": "";
			return t +
				function(t) {
					return new Array(7 - t.length).join("0") + t
				} ((16777216 * Math.random() << 0).toString(16))
		}
		function h(t) {
			t = "#" === t.charAt(0) ? t.substring(1, 7) : t;
			var e = {
				r: parseInt(t.substring(0, 2), 16),
				g: parseInt(t.substring(2, 4), 16),
				b: parseInt(t.substring(4, 6), 16)
			};
			return e
		}
		function p() {
			var t = document.body;
			return "function" == typeof(t.requestFullScreen || t.requestFullscreen || t.mozRequestFullScreen || t.webkitRequestFullScreen || t.msRequestFullscreen)
		}
		function f(t) {
			var e = t.requestFullScreen || t.mozRequestFullScreen || t.webkitRequestFullScreen || t.msRequestFullScreen;
			return e ? (e = e.toString().match(/function (\w+)\(\)/)[1], t[e](), !0) : !1
		}
		function g() {
			var t = document.cancelFullScreen || document.exitFullscreen || document.mozCancelFullScreen || document.webkitCancelFullScreen || document.msExitFullscreen;
			return t ? (t = t.toString().match(/function (\w+)\(\)/)[1], document[t](), !0) : !1
		}
		function m() {
			return document.fullscreenElement && null !== document.fullscreenElement || document.msFullscreenElement && null !== document.msFullscreenElement || document.mozFullScreen || document.webkitIsFullScreen
		}
		function v(t, e) {
			e = e || !0;
			var i = t,
				n = 0,
				o = 0,
				r = 0;
			return t > 60 && (o = t / 60, t %= 60, o > 60 && (n = o / 60, o %= 60)),
				n = Math.floor(n),
				o = Math.floor(o),
				r = Math.floor(t),
			10 > n && (n = "0" + n),
			10 > o && (o = "0" + o),
			10 > r && (r = "0" + r),
				"full" === e ? (e = n + ":" + o + ":" + r, n > 99 && (e = "99:59:59")) : "object" === e ? (e = {
					original: i,
					hour: n,
					minute: o,
					seconds: r
				},
				n > 99 && (e = {
					original: i,
					hour: 99,
					minute: 59,
					seconds: 59
				})) : e = o + ":" + r,
				e
		}
		function b() {
			var t = document.createElement("video"),
				e = !1;
			try {
				e = !!t.canPlayType
			} catch(i) {}
			return e
		}
		function y() {
			var t = document.createElement("audio"),
				e = !1;
			try {
				e = !!t.canPlayType
			} catch(i) {}
			return e
		}
		function w() {
			try {
				return document.createEvent("TouchEvent"),
					!0
			} catch(t) {
				return ! 1
			}
		}
		function T(t, e) {
			t = t || "click",
				e = e || "touchend";
			var i = t;
			try {
				document.createEvent("TouchEvent"),
					i = e
			} catch(n) {}
			return i
		}
		function x(t) {
			return T("click", t)
		}
		function C(t) {
			return "undefined" != typeof t && "" !== t
		}
		function E(t, e) {
			t.preventDefault(),
				t.stopPropagation(),
				e.addClass("hover")
		}
		function I(t, e) {
			t.preventDefault(),
				t.stopPropagation(),
				e.removeClass("hover")
		}
		function P(e, i) {
			i = i || {};
			var n, o, r = {
					target: null,
					container: null,
					touch: !0,
					x: !0,
					y: !0,
					start: function() {},
					end: function() {},
					moving: function() {},
					callback: function() {}
				},
				s = t.extend(r, i),
				a = e,
				u = s.target,
				l = {},
				c = !1;
			u || (u = a),
				s.touch && w() ? k(u, s) : (u.bind("mousedown",
					function(t) {
						t.preventDefault(),
							t.stopPropagation(),
							c = !0,
							n = t.clientX - parseInt(a.position().left),
							o = t.clientY - parseInt(a.position().top),
							l = {
								left: n,
								top: o
							},
							s.start(l),
							document.onmousemove = d
					}), document.onmouseup = function() {
					return u.dragging = !1,
						document.onselectstart = null,
						document.onmousemove = null,
					c && s.end(l),
						!1
				});
			var d = function(e) {
				e.preventDefault(),
					e.stopPropagation(),
					u.dragging = !0;
				var i, r, c = parseInt(a.position().left),
					d = parseInt(a.position().top),
					h = s.container ? s.container.width() : t(window).width();
				if (c >= 0 ? c + a.outerWidth() <= h ? i = e.clientX - n: (i = h - a.outerWidth(), s.x && (document.onmousemove = null)) : (i = 0, s.x && (document.onmousemove = null)), d >= 0) if (s.container) {
					var p = s.container.height();
					d + a.outerHeight() <= p ? r = e.clientY - o: (r = p - a.outerHeight(), s.y && (document.onmousemove = null))
				} else r = e.clientY - o;
				else r = 0,
				s.y && (document.onmousemove = null);
				return s.x && (a[0].style.left = i + "px"),
				s.y && (a[0].style.top = r + "px"),
					l = {
						left: i,
						top: r
					},
					s.callback(l),
					!1
			}
		}
		function k(e, i) {
			function n() {
				e.bind("touchstart", u).bind("touchend touchcancel",
					function(t) {
						l = !1,
							r.end(a),
							a = {}
					})
			}
			i = i || {};
			var o = {
					container: null,
					parent: !1,
					x: !0,
					y: !0,
					start: function() {},
					moving: function() {},
					end: function() {},
					callback: function() {}
				},
				r = t.extend(o, i),
				s = null,
				a = {},
				u = function(e) {
					e.preventDefault(),
						e.stopPropagation();
					var i = e.originalEvent ? e.originalEvent: e,
						n = r.parent ? t(this).parent() : t(this),
						o = n.position();
					s = {
						x: i.changedTouches[0].pageX - o.left,
						y: i.changedTouches[0].pageY - o.top
					},
						a = {
							top: s.y,
							left: s.x
						},
						r.start({
							left: s.x,
							top: s.y
						}),
						l = !1,
						t(this).bind("touchmove", c)
				},
				l = !0,
				c = function(i) {
					i.preventDefault(),
						i.stopPropagation(),
						e.dragging = !0,
						l = !1;
					var n, o, u = i.originalEvent ? i.originalEvent: i,
						c = r.parent ? t(this).parent() : t(this),
						d = parseInt(c.position().left),
						h = parseInt(c.position().top);
					r.moving({
						left: d,
						top: h
					});
					var p = r.container ? r.container.width() : t(window).width();
					if (d >= 0) {
						if (d + c.width() <= p) o = u.changedTouches[0].pageX - s.x;
						else if (o = p - c.width(), r.x) return c.dragging = !1,
							t(this).unbind("touchmove").trigger("touchend"),
							!1
					} else if (o = 0, r.x) return c.dragging = !1,
						t(this).unbind("touchmove").trigger("touchend"),
						!1;
					if (h >= 0) if (r.container) {
						var f = r.container.height();
						if (h + c.outerHeight() <= f) n = u.changedTouches[0].pageY - s.y;
						else if (n = f - c.outerHeight(), r.y) return c.dragging = !1,
							t(this).unbind("touchmove").trigger("touchend"),
							l = !0,
							!1
					} else n = u.changedTouches[0].pageY - s.y;
					else if (n = 0, r.y) return c.dragging = !1,
						t(this).unbind("touchmove").trigger("touchend"),
						!1;
					r.x && c.css("left", o),
					r.y && c.css("top", n),
						a = {
							top: n,
							left: o
						},
						r.callback(a)
				};
			n()
		}
		function S(e, i, n) {
			n = n || "",
				e.find("." + z + "tooltip").remove(),
				e.unbind("mouseenter mouseleave"),
				e.append('<span class="' + z + 'tooltip" style=" ' + n + ' ">' + i + "</span>"),
				e.mouseenter(function() {
					var e = t(this).find("." + z + "tooltip");
					t.isFunction(e.stop) && e.stop(),
						e.fadeIn(function() {
							u() && t(this).show()
						})
				}).mouseleave(function() {
					var e = t(this).find("." + z + "tooltip");
					t.isFunction(e.stop) && e.stop(),
						e.fadeOut(function() {
							u() && t(this).show()
						})
				})
		}
		function A(e) {
			e.bind("touchstart",
				function(e) {
					t(this).addClass("hover")
				}).bind("touchend touchmove touchcancel",
				function() {
					t(this).removeClass("hover")
				})
		}
		function F(e, i, n, o) {
			function r(t) {
				t.length < 1 || t.width() >= n.player.width() && t.css("margin-left", (n.player.width() - t.width()) / 2 + "px")
			}
			var s = [3],
				a = z + "barrage-",
				u = i.find("." + a + "queue"),
				l = u.length,
				d = n.settings.speeds.other,
				h = 1;
			"random" === d ? h = c(s[0], s[s.length - 1]) : "number" == typeof d && (h = parseInt(d > 2 ? 2 : d));
			var p = a + "fadeout-delay-" + h + "s";
			e.attr("data-class", p).attr("speed", h),
			u.find("span").length < 1 && ("top" === o ? n.topQueueIndex = 0 : "bottom" === o && (n.bottomQueueIndex = l - 1));
			var f = u.eq("top" === o ? n.topQueueIndex: n.bottomQueueIndex);
			f.append(e),
				r(e),
				e.hide();
			var g = f.find("span.barrage:first-child");
			r(g),
			g.attr("data-class") && g.addClass(g.attr("data-class")).attr("data-class", null).show(),
				e.one(O,
					function() {
						var e = t(this).next();
						e.addClass(e.attr("data-class")).attr("data-class", null).show(),
							t(this).unbind(O).remove()
					}),
				"top" === o ? n.topQueueIndex = n.topQueueIndex < l - 1 ? n.topQueueIndex + 1 : 0 : "bottom" === o && (n.bottomQueueIndex = n.bottomQueueIndex > 0 ? n.bottomQueueIndex - 1 : l - 1)
		}
		function D(t) {
			if (t.length < 1) return ! 1;
			var e = {};
			return t.forEach(function(t) {
				var i = parseFloat(t.timing);
				e[i] = []
			}),
				t.forEach(function(t) {
					var i = parseFloat(t.timing);
					e[i].push(t)
				}),
				e
		}
		function M() {
			return new M.fn.init(this)
		}
		function _(t, e) {
			return "object" == typeof t && (e = t, t = e.id),
				e = e || {},
				new _.fn.init(t, e)
		}
		function R() {}
		"undefined" == typeof t.fn && (t = "undefined" != typeof jQuery ? jQuery: Zepto);
		var z = "meipai-player-",
			q = b(),
			O = "webkitAnimationEnd mozAnimationEnd oAnimationEnd MSAnimationend animationend",
			B = "webkitfullscreenchange mozfullscreenchange MSFullscreenChange fullscreenchange",
			$ = (navigator.connection || navigator.mozConnection || navigator.webkitConnection, {
				isHidden: function() {
					return document.hidden || document.mozHidden || document.msHidden || document.webkitHidden
				},
				state: function() {
					return document.visibilityState || document.mozVisibilityState || document.msVisibilityState || document.webkitVisibilityState
				},
				changeEvent: function() {
					var t = "visibilitychange";
					return document.mozVisibilityState ? t = "mozvisibilitychange": document.msvisibilitychange ? t = "msvisibilitychange": document.webkitVisibilityState && (t = "webkitvisibilitychange"),
						t
				},
				listener: function(t) {
					t = t ||
					function() {};
					var e = this;
					document.addEventListener(this.changeEvent(),
						function(i) {
							t(e.state(), e.isHidden(), i)
						},
						!1)
				}
			});
		return function(t, e, i, n) {
			function o(t, e, i) {
				return setTimeout(c(t, i), e)
			}
			function r(t, e, i) {
				return Array.isArray(t) ? (s(t, i[e], i), !0) : !1
			}
			function s(t, e, i) {
				var o;
				if (t) if (t.forEach) t.forEach(e, i);
				else if (t.length !== n) for (o = 0; o < t.length;) e.call(i, t[o], o, t),
					o++;
				else for (o in t) t.hasOwnProperty(o) && e.call(i, t[o], o, t)
			}
			function a(t, e, i) {
				for (var o = Object.keys(e), r = 0; r < o.length;)(!i || i && t[o[r]] === n) && (t[o[r]] = e[o[r]]),
					r++;
				return t
			}
			function u(t, e) {
				return a(t, e, !0)
			}
			function l(t, e, i) {
				var n, o = e.prototype;
				n = t.prototype = Object.create(o),
					n.constructor = t,
					n._super = o,
				i && a(n, i)
			}
			function c(t, e) {
				return function() {
					return t.apply(e, arguments)
				}
			}
			function d(t, e) {
				return typeof t == ct ? t.apply(e ? e[0] || n: n, e) : t
			}
			function h(t, e) {
				return t === n ? e: t
			}
			function p(t, e, i) {
				s(v(e),
					function(e) {
						t.addEventListener(e, i, !1)
					})
			}
			function f(t, e, i) {
				s(v(e),
					function(e) {
						t.removeEventListener(e, i, !1)
					})
			}
			function g(t, e) {
				for (; t;) {
					if (t == e) return ! 0;
					t = t.parentNode
				}
				return ! 1
			}
			function m(t, e) {
				return t.indexOf(e) > -1
			}
			function v(t) {
				return t.trim().split(/\s+/g)
			}
			function b(t, e, i) {
				if (t.indexOf && !i) return t.indexOf(e);
				for (var n = 0; n < t.length;) {
					if (i && t[n][i] == e || !i && t[n] === e) return n;
					n++
				}
				return - 1
			}
			function y(t) {
				return Array.prototype.slice.call(t, 0)
			}
			function w(t, e, i) {
				for (var n = [], o = [], r = 0; r < t.length;) {
					var s = e ? t[r][e] : t[r];
					b(o, s) < 0 && n.push(t[r]),
						o[r] = s,
						r++
				}
				return i && (n = e ? n.sort(function(t, i) {
					return t[e] > i[e]
				}) : n.sort()),
					n
			}
			function T(t, e) {
				for (var i, o, r = e[0].toUpperCase() + e.slice(1), s = 0; s < ut.length;) {
					if (i = ut[s], o = i ? i + r: e, o in t) return o;
					s++
				}
				return n
			}
			function x() {
				return ft++
			}
			function C(t) {
				var e = t.ownerDocument;
				return e.defaultView || e.parentWindow
			}
			function E(t, e) {
				var i = this;
				this.manager = t,
					this.callback = e,
					this.element = t.element,
					this.target = t.options.inputTarget,
					this.domHandler = function(e) {
						d(t.options.enable, [t]) && i.handler(e)
					},
					this.init()
			}
			function I(t) {
				var e, i = t.options.inputClass;
				return new(e = i ? i: vt ? $: bt ? H: mt ? W: B)(t, P)
			}
			function P(t, e, i) {
				var n = i.pointers.length,
					o = i.changedPointers.length,
					r = e & Et && n - o === 0,
					s = e & (Pt | kt) && n - o === 0;
				i.isFirst = !!r,
					i.isFinal = !!s,
				r && (t.session = {}),
					i.eventType = e,
					k(t, i),
					t.emit("hammer.input", i),
					t.recognize(i),
					t.session.prevInput = i
			}
			function k(t, e) {
				var i = t.session,
					n = e.pointers,
					o = n.length;
				i.firstInput || (i.firstInput = F(e)),
					o > 1 && !i.firstMultiple ? i.firstMultiple = F(e) : 1 === o && (i.firstMultiple = !1);
				var r = i.firstInput,
					s = i.firstMultiple,
					a = s ? s.center: r.center,
					u = e.center = D(n);
				e.timeStamp = pt(),
					e.deltaTime = e.timeStamp - r.timeStamp,
					e.angle = z(a, u),
					e.distance = R(a, u),
					S(i, e),
					e.offsetDirection = _(e.deltaX, e.deltaY),
					e.scale = s ? O(s.pointers, n) : 1,
					e.rotation = s ? q(s.pointers, n) : 0,
					A(i, e);
				var l = t.element;
				g(e.srcEvent.target, l) && (l = e.srcEvent.target),
					e.target = l
			}
			function S(t, e) {
				var i = e.center,
					n = t.offsetDelta || {},
					o = t.prevDelta || {},
					r = t.prevInput || {}; (e.eventType === Et || r.eventType === Pt) && (o = t.prevDelta = {
					x: r.deltaX || 0,
					y: r.deltaY || 0
				},
					n = t.offsetDelta = {
						x: i.x,
						y: i.y
					}),
					e.deltaX = o.x + (i.x - n.x),
					e.deltaY = o.y + (i.y - n.y)
			}
			function A(t, e) {
				var i, o, r, s, a = t.lastInterval || e,
					u = e.timeStamp - a.timeStamp;
				if (e.eventType != kt && (u > Ct || a.velocity === n)) {
					var l = a.deltaX - e.deltaX,
						c = a.deltaY - e.deltaY,
						d = M(u, l, c);
					o = d.x,
						r = d.y,
						i = ht(d.x) > ht(d.y) ? d.x: d.y,
						s = _(l, c),
						t.lastInterval = e
				} else i = a.velocity,
					o = a.velocityX,
					r = a.velocityY,
					s = a.direction;
				e.velocity = i,
					e.velocityX = o,
					e.velocityY = r,
					e.direction = s
			}
			function F(t) {
				for (var e = [], i = 0; i < t.pointers.length;) e[i] = {
					clientX: dt(t.pointers[i].clientX),
					clientY: dt(t.pointers[i].clientY)
				},
					i++;
				return {
					timeStamp: pt(),
					pointers: e,
					center: D(e),
					deltaX: t.deltaX,
					deltaY: t.deltaY
				}
			}
			function D(t) {
				var e = t.length;
				if (1 === e) return {
					x: dt(t[0].clientX),
					y: dt(t[0].clientY)
				};
				for (var i = 0,
						 n = 0,
						 o = 0; e > o;) i += t[o].clientX,
					n += t[o].clientY,
					o++;
				return {
					x: dt(i / e),
					y: dt(n / e)
				}
			}
			function M(t, e, i) {
				return {
					x: e / t || 0,
					y: i / t || 0
				}
			}
			function _(t, e) {
				return t === e ? St: ht(t) >= ht(e) ? t > 0 ? At: Ft: e > 0 ? Dt: Mt
			}
			function R(t, e, i) {
				i || (i = qt);
				var n = e[i[0]] - t[i[0]],
					o = e[i[1]] - t[i[1]];
				return Math.sqrt(n * n + o * o)
			}
			function z(t, e, i) {
				i || (i = qt);
				var n = e[i[0]] - t[i[0]],
					o = e[i[1]] - t[i[1]];
				return 180 * Math.atan2(o, n) / Math.PI
			}
			function q(t, e) {
				return z(e[1], e[0], Ot) - z(t[1], t[0], Ot)
			}
			function O(t, e) {
				return R(e[0], e[1], Ot) / R(t[0], t[1], Ot)
			}
			function B() {
				this.evEl = $t,
					this.evWin = jt,
					this.allow = !0,
					this.pressed = !1,
					E.apply(this, arguments)
			}
			function $() {
				this.evEl = Xt,
					this.evWin = Wt,
					E.apply(this, arguments),
					this.store = this.manager.session.pointerEvents = []
			}
			function j() {
				this.evTarget = Lt,
					this.evWin = Qt,
					this.started = !1,
					E.apply(this, arguments)
			}
			function N(t, e) {
				var i = y(t.touches),
					n = y(t.changedTouches);
				return e & (Pt | kt) && (i = w(i.concat(n), "identifier", !0)),
					[i, n]
			}
			function H() {
				this.evTarget = Ut,
					this.targetIds = {},
					E.apply(this, arguments)
			}
			function X(t, e) {
				var i = y(t.touches),
					n = this.targetIds;
				if (e & (Et | It) && 1 === i.length) return n[i[0].identifier] = !0,
					[i, i];
				var o, r, s = y(t.changedTouches),
					a = [],
					u = this.target;
				if (r = i.filter(function(t) {
						return g(t.target, u)
					}), e === Et) for (o = 0; o < r.length;) n[r[o].identifier] = !0,
					o++;
				for (o = 0; o < s.length;) n[s[o].identifier] && a.push(s[o]),
				e & (Pt | kt) && delete n[s[o].identifier],
					o++;
				return a.length ? [w(r.concat(a), "identifier", !0), a] : void 0
			}
			function W() {
				E.apply(this, arguments);
				var t = c(this.handler, this);
				this.touch = new H(this.manager, t),
					this.mouse = new B(this.manager, t)
			}
			function Y(t, e) {
				this.manager = t,
					this.set(e)
			}
			function L(t) {
				if (m(t, ee)) return ee;
				var e = m(t, ie),
					i = m(t, ne);
				return e && i ? ie + " " + ne: e || i ? e ? ie: ne: m(t, te) ? te: Jt
			}
			function Q(t) {
				this.id = x(),
					this.manager = null,
					this.options = u(t || {},
						this.defaults),
					this.options.enable = h(this.options.enable, !0),
					this.state = oe,
					this.simultaneous = {},
					this.requireFail = []
			}
			function V(t) {
				return t & le ? "cancel": t & ae ? "end": t & se ? "move": t & re ? "start": ""
			}
			function U(t) {
				return t == Mt ? "down": t == Dt ? "up": t == At ? "left": t == Ft ? "right": ""
			}
			function G(t, e) {
				var i = e.manager;
				return i ? i.get(t) : t
			}
			function Z() {
				Q.apply(this, arguments)
			}
			function K() {
				Z.apply(this, arguments),
					this.pX = null,
					this.pY = null
			}
			function J() {
				Z.apply(this, arguments)
			}
			function tt() {
				Q.apply(this, arguments),
					this._timer = null,
					this._input = null
			}
			function et() {
				Z.apply(this, arguments)
			}
			function it() {
				Z.apply(this, arguments)
			}
			function nt() {
				Q.apply(this, arguments),
					this.pTime = !1,
					this.pCenter = !1,
					this._timer = null,
					this._input = null,
					this.count = 0
			}
			function ot(t, e) {
				return e = e || {},
					e.recognizers = h(e.recognizers, ot.defaults.preset),
					new rt(t, e)
			}
			function rt(t, e) {
				e = e || {},
					this.options = u(e, ot.defaults),
					this.options.inputTarget = this.options.inputTarget || t,
					this.handlers = {},
					this.session = {},
					this.recognizers = [],
					this.element = t,
					this.input = I(this),
					this.touchAction = new Y(this, this.options.touchAction),
					st(this, !0),
					s(e.recognizers,
						function(t) {
							var e = this.add(new t[0](t[1]));
							t[2] && e.recognizeWith(t[2]),
							t[3] && e.requireFailure(t[3])
						},
						this)
			}
			function st(t, e) {
				var i = t.element;
				s(t.options.cssProps,
					function(t, n) {
						i.style[T(i.style, n)] = e ? t: ""
					})
			}
			function at(t, i) {
				var n = e.createEvent("Event");
				n.initEvent(t, !0, !0),
					n.gesture = i,
					i.target.dispatchEvent(n)
			}
			var ut = ["", "webkit", "moz", "MS", "ms", "o"],
				lt = e.createElement("div"),
				ct = "function",
				dt = Math.round,
				ht = Math.abs,
				pt = Date.now,
				ft = 1,
				gt = /mobile|tablet|ip(ad|hone|od)|android/i,
				mt = "ontouchstart" in t,
				vt = T(t, "PointerEvent") !== n,
				bt = mt && gt.test(navigator.userAgent),
				yt = "touch",
				wt = "pen",
				Tt = "mouse",
				xt = "kinect",
				Ct = 25,
				Et = 1,
				It = 2,
				Pt = 4,
				kt = 8,
				St = 1,
				At = 2,
				Ft = 4,
				Dt = 8,
				Mt = 16,
				_t = At | Ft,
				Rt = Dt | Mt,
				zt = _t | Rt,
				qt = ["x", "y"],
				Ot = ["clientX", "clientY"];
			E.prototype = {
				handler: function() {},
				init: function() {
					this.evEl && p(this.element, this.evEl, this.domHandler),
					this.evTarget && p(this.target, this.evTarget, this.domHandler),
					this.evWin && p(C(this.element), this.evWin, this.domHandler)
				},
				destroy: function() {
					this.evEl && f(this.element, this.evEl, this.domHandler),
					this.evTarget && f(this.target, this.evTarget, this.domHandler),
					this.evWin && f(C(this.element), this.evWin, this.domHandler)
				}
			};
			var Bt = {
					mousedown: Et,
					mousemove: It,
					mouseup: Pt
				},
				$t = "mousedown",
				jt = "mousemove mouseup";
			l(B, E, {
				handler: function(t) {
					var e = Bt[t.type];
					e & Et && 0 === t.button && (this.pressed = !0),
					e & It && 1 !== t.which && (e = Pt),
					this.pressed && this.allow && (e & Pt && (this.pressed = !1), this.callback(this.manager, e, {
						pointers: [t],
						changedPointers: [t],
						pointerType: Tt,
						srcEvent: t
					}))
				}
			});
			var Nt = {
					pointerdown: Et,
					pointermove: It,
					pointerup: Pt,
					pointercancel: kt,
					pointerout: kt
				},
				Ht = {
					2 : yt,
					3 : wt,
					4 : Tt,
					5 : xt
				},
				Xt = "pointerdown",
				Wt = "pointermove pointerup pointercancel";
			t.MSPointerEvent && (Xt = "MSPointerDown", Wt = "MSPointerMove MSPointerUp MSPointerCancel"),
				l($, E, {
					handler: function(t) {
						var e = this.store,
							i = !1,
							n = t.type.toLowerCase().replace("ms", ""),
							o = Nt[n],
							r = Ht[t.pointerType] || t.pointerType,
							s = r == yt,
							a = b(e, t.pointerId, "pointerId");
						o & Et && (0 === t.button || s) ? 0 > a && (e.push(t), a = e.length - 1) : o & (Pt | kt) && (i = !0),
						0 > a || (e[a] = t, this.callback(this.manager, o, {
							pointers: e,
							changedPointers: [t],
							pointerType: r,
							srcEvent: t
						}), i && e.splice(a, 1))
					}
				});
			var Yt = {
					touchstart: Et,
					touchmove: It,
					touchend: Pt,
					touchcancel: kt
				},
				Lt = "touchstart",
				Qt = "touchstart touchmove touchend touchcancel";
			l(j, E, {
				handler: function(t) {
					var e = Yt[t.type];
					if (e === Et && (this.started = !0), this.started) {
						var i = N.call(this, t, e);
						e & (Pt | kt) && i[0].length - i[1].length === 0 && (this.started = !1),
							this.callback(this.manager, e, {
								pointers: i[0],
								changedPointers: i[1],
								pointerType: yt,
								srcEvent: t
							})
					}
				}
			});
			var Vt = {
					touchstart: Et,
					touchmove: It,
					touchend: Pt,
					touchcancel: kt
				},
				Ut = "touchstart touchmove touchend touchcancel";
			l(H, E, {
				handler: function(t) {
					var e = Vt[t.type],
						i = X.call(this, t, e);
					i && this.callback(this.manager, e, {
						pointers: i[0],
						changedPointers: i[1],
						pointerType: yt,
						srcEvent: t
					})
				}
			}),
				l(W, E, {
					handler: function(t, e, i) {
						var n = i.pointerType == yt,
							o = i.pointerType == Tt;
						if (n) this.mouse.allow = !1;
						else if (o && !this.mouse.allow) return;
						e & (Pt | kt) && (this.mouse.allow = !0),
							this.callback(t, e, i)
					},
					destroy: function() {
						this.touch.destroy(),
							this.mouse.destroy()
					}
				});
			var Gt = T(lt.style, "touchAction"),
				Zt = Gt !== n,
				Kt = "compute",
				Jt = "auto",
				te = "manipulation",
				ee = "none",
				ie = "pan-x",
				ne = "pan-y";
			Y.prototype = {
				set: function(t) {
					t == Kt && (t = this.compute()),
					Zt && (this.manager.element.style[Gt] = t),
						this.actions = t.toLowerCase().trim()
				},
				update: function() {
					this.set(this.manager.options.touchAction)
				},
				compute: function() {
					var t = [];
					return s(this.manager.recognizers,
						function(e) {
							d(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()))
						}),
						L(t.join(" "))
				},
				preventDefaults: function(t) {
					if (!Zt) {
						var e = t.srcEvent,
							i = t.offsetDirection;
						if (this.manager.session.prevented) return void e.preventDefault();
						var n = this.actions,
							o = m(n, ee),
							r = m(n, ne),
							s = m(n, ie);
						return o || r && i & _t || s && i & Rt ? this.preventSrc(e) : void 0
					}
				},
				preventSrc: function(t) {
					this.manager.session.prevented = !0,
						t.preventDefault()
				}
			};
			var oe = 1,
				re = 2,
				se = 4,
				ae = 8,
				ue = ae,
				le = 16,
				ce = 32;
			Q.prototype = {
				defaults: {},
				set: function(t) {
					return a(this.options, t),
					this.manager && this.manager.touchAction.update(),
						this
				},
				recognizeWith: function(t) {
					if (r(t, "recognizeWith", this)) return this;
					var e = this.simultaneous;
					return t = G(t, this),
					e[t.id] || (e[t.id] = t, t.recognizeWith(this)),
						this
				},
				dropRecognizeWith: function(t) {
					return r(t, "dropRecognizeWith", this) ? this: (t = G(t, this), delete this.simultaneous[t.id], this)
				},
				requireFailure: function(t) {
					if (r(t, "requireFailure", this)) return this;
					var e = this.requireFail;
					return t = G(t, this),
					-1 === b(e, t) && (e.push(t), t.requireFailure(this)),
						this
				},
				dropRequireFailure: function(t) {
					if (r(t, "dropRequireFailure", this)) return this;
					t = G(t, this);
					var e = b(this.requireFail, t);
					return e > -1 && this.requireFail.splice(e, 1),
						this
				},
				hasRequireFailures: function() {
					return this.requireFail.length > 0
				},
				canRecognizeWith: function(t) {
					return !! this.simultaneous[t.id]
				},
				emit: function(t) {
					function e(e) {
						i.manager.emit(i.options.event + (e ? V(n) : ""), t)
					}
					var i = this,
						n = this.state;
					ae > n && e(!0),
						e(),
					n >= ae && e(!0)
				},
				tryEmit: function(t) {
					return this.canEmit() ? this.emit(t) : void(this.state = ce)
				},
				canEmit: function() {
					for (var t = 0; t < this.requireFail.length;) {
						if (! (this.requireFail[t].state & (ce | oe))) return ! 1;
						t++
					}
					return ! 0
				},
				recognize: function(t) {
					var e = a({},
						t);
					return d(this.options.enable, [this, e]) ? (this.state & (ue | le | ce) && (this.state = oe), this.state = this.process(e), void(this.state & (re | se | ae | le) && this.tryEmit(e))) : (this.reset(), void(this.state = ce))
				},
				process: function(t) {},
				getTouchAction: function() {},
				reset: function() {}
			},
				l(Z, Q, {
					defaults: {
						pointers: 1
					},
					attrTest: function(t) {
						var e = this.options.pointers;
						return 0 === e || t.pointers.length === e
					},
					process: function(t) {
						var e = this.state,
							i = t.eventType,
							n = e & (re | se),
							o = this.attrTest(t);
						return n && (i & kt || !o) ? e | le: n || o ? i & Pt ? e | ae: e & re ? e | se: re: ce
					}
				}),
				l(K, Z, {
					defaults: {
						event: "pan",
						threshold: 10,
						pointers: 1,
						direction: zt
					},
					getTouchAction: function() {
						var t = this.options.direction,
							e = [];
						return t & _t && e.push(ne),
						t & Rt && e.push(ie),
							e
					},
					directionTest: function(t) {
						var e = this.options,
							i = !0,
							n = t.distance,
							o = t.direction,
							r = t.deltaX,
							s = t.deltaY;
						return o & e.direction || (e.direction & _t ? (o = 0 === r ? St: 0 > r ? At: Ft, i = r != this.pX, n = Math.abs(t.deltaX)) : (o = 0 === s ? St: 0 > s ? Dt: Mt, i = s != this.pY, n = Math.abs(t.deltaY))),
							t.direction = o,
						i && n > e.threshold && o & e.direction
					},
					attrTest: function(t) {
						return Z.prototype.attrTest.call(this, t) && (this.state & re || !(this.state & re) && this.directionTest(t))
					},
					emit: function(t) {
						this.pX = t.deltaX,
							this.pY = t.deltaY;
						var e = U(t.direction);
						e && this.manager.emit(this.options.event + e, t),
							this._super.emit.call(this, t)
					}
				}),
				l(J, Z, {
					defaults: {
						event: "pinch",
						threshold: 0,
						pointers: 2
					},
					getTouchAction: function() {
						return [ee]
					},
					attrTest: function(t) {
						return this._super.attrTest.call(this, t) && (Math.abs(t.scale - 1) > this.options.threshold || this.state & re)
					},
					emit: function(t) {
						if (this._super.emit.call(this, t), 1 !== t.scale) {
							var e = t.scale < 1 ? "in": "out";
							this.manager.emit(this.options.event + e, t)
						}
					}
				}),
				l(tt, Q, {
					defaults: {
						event: "press",
						pointers: 1,
						time: 500,
						threshold: 5
					},
					getTouchAction: function() {
						return [Jt]
					},
					process: function(t) {
						var e = this.options,
							i = t.pointers.length === e.pointers,
							n = t.distance < e.threshold,
							r = t.deltaTime > e.time;
						if (this._input = t, !n || !i || t.eventType & (Pt | kt) && !r) this.reset();
						else if (t.eventType & Et) this.reset(),
							this._timer = o(function() {
									this.state = ue,
										this.tryEmit()
								},
								e.time, this);
						else if (t.eventType & Pt) return ue;
						return ce
					},
					reset: function() {
						clearTimeout(this._timer)
					},
					emit: function(t) {
						this.state === ue && (t && t.eventType & Pt ? this.manager.emit(this.options.event + "up", t) : (this._input.timeStamp = pt(), this.manager.emit(this.options.event, this._input)))
					}
				}),
				l(et, Z, {
					defaults: {
						event: "rotate",
						threshold: 0,
						pointers: 2
					},
					getTouchAction: function() {
						return [ee]
					},
					attrTest: function(t) {
						return this._super.attrTest.call(this, t) && (Math.abs(t.rotation) > this.options.threshold || this.state & re)
					}
				}),
				l(it, Z, {
					defaults: {
						event: "swipe",
						threshold: 10,
						velocity: .65,
						direction: _t | Rt,
						pointers: 1
					},
					getTouchAction: function() {
						return K.prototype.getTouchAction.call(this)
					},
					attrTest: function(t) {
						var e, i = this.options.direction;
						return i & (_t | Rt) ? e = t.velocity: i & _t ? e = t.velocityX: i & Rt && (e = t.velocityY),
						this._super.attrTest.call(this, t) && i & t.direction && t.distance > this.options.threshold && ht(e) > this.options.velocity && t.eventType & Pt
					},
					emit: function(t) {
						var e = U(t.direction);
						e && this.manager.emit(this.options.event + e, t),
							this.manager.emit(this.options.event, t)
					}
				}),
				l(nt, Q, {
					defaults: {
						event: "tap",
						pointers: 1,
						taps: 1,
						interval: 300,
						time: 250,
						threshold: 2,
						posThreshold: 10
					},
					getTouchAction: function() {
						return [te]
					},
					process: function(t) {
						var e = this.options,
							i = t.pointers.length === e.pointers,
							n = t.distance < e.threshold,
							r = t.deltaTime < e.time;
						if (this.reset(), t.eventType & Et && 0 === this.count) return this.failTimeout();
						if (n && r && i) {
							if (t.eventType != Pt) return this.failTimeout();
							var s = this.pTime ? t.timeStamp - this.pTime < e.interval: !0,
								a = !this.pCenter || R(this.pCenter, t.center) < e.posThreshold;
							this.pTime = t.timeStamp,
								this.pCenter = t.center,
								a && s ? this.count += 1 : this.count = 1,
								this._input = t;
							var u = this.count % e.taps;
							if (0 === u) return this.hasRequireFailures() ? (this._timer = o(function() {
									this.state = ue,
										this.tryEmit()
								},
								e.interval, this), re) : ue
						}
						return ce
					},
					failTimeout: function() {
						return this._timer = o(function() {
								this.state = ce
							},
							this.options.interval, this),
							ce
					},
					reset: function() {
						clearTimeout(this._timer)
					},
					emit: function() {
						this.state == ue && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
					}
				}),
				ot.VERSION = "2.0.4",
				ot.defaults = {
					domEvents: !1,
					touchAction: Kt,
					enable: !0,
					inputTarget: null,
					inputClass: null,
					preset: [[et, {
						enable: !1
					}], [J, {
						enable: !1
					},
						["rotate"]], [it, {
						direction: _t
					}], [K, {
						direction: _t
					},
						["swipe"]], [nt], [nt, {
						event: "doubletap",
						taps: 2
					},
						["tap"]], [tt]],
					cssProps: {
						userSelect: "none",
						touchSelect: "none",
						touchCallout: "none",
						contentZooming: "none",
						userDrag: "none",
						tapHighlightColor: "rgba(0,0,0,0)"
					}
				};
			var de = 1,
				he = 2;
			rt.prototype = {
				set: function(t) {
					return a(this.options, t),
					t.touchAction && this.touchAction.update(),
					t.inputTarget && (this.input.destroy(), this.input.target = t.inputTarget, this.input.init()),
						this
				},
				stop: function(t) {
					this.session.stopped = t ? he: de
				},
				recognize: function(t) {
					var e = this.session;
					if (!e.stopped) {
						this.touchAction.preventDefaults(t);
						var i, n = this.recognizers,
							o = e.curRecognizer; (!o || o && o.state & ue) && (o = e.curRecognizer = null);
						for (var r = 0; r < n.length;) i = n[r],
							e.stopped === he || o && i != o && !i.canRecognizeWith(o) ? i.reset() : i.recognize(t),
						!o && i.state & (re | se | ae) && (o = e.curRecognizer = i),
							r++
					}
				},
				get: function(t) {
					if (t instanceof Q) return t;
					for (var e = this.recognizers,
							 i = 0; i < e.length; i++) if (e[i].options.event == t) return e[i];
					return null
				},
				add: function(t) {
					if (r(t, "add", this)) return this;
					var e = this.get(t.options.event);
					return e && this.remove(e),
						this.recognizers.push(t),
						t.manager = this,
						this.touchAction.update(),
						t
				},
				remove: function(t) {
					if (r(t, "remove", this)) return this;
					var e = this.recognizers;
					return t = this.get(t),
						e.splice(b(e, t), 1),
						this.touchAction.update(),
						this
				},
				on: function(t, e) {
					var i = this.handlers;
					return s(v(t),
						function(t) {
							i[t] = i[t] || [],
								i[t].push(e)
						}),
						this
				},
				off: function(t, e) {
					var i = this.handlers;
					return s(v(t),
						function(t) {
							e ? i[t].splice(b(i[t], e), 1) : delete i[t]
						}),
						this
				},
				emit: function(t, e) {
					this.options.domEvents && at(t, e);
					var i = this.handlers[t] && this.handlers[t].slice();
					if (i && i.length) {
						e.type = t,
							e.preventDefault = function() {
								e.srcEvent.preventDefault()
							};
						for (var n = 0; n < i.length;) i[n](e),
							n++
					}
				},
				destroy: function() {
					this.element && st(this, !1),
						this.handlers = {},
						this.session = {},
						this.input.destroy(),
						this.element = null
				}
			},
				a(ot, {
					INPUT_START: Et,
					INPUT_MOVE: It,
					INPUT_END: Pt,
					INPUT_CANCEL: kt,
					STATE_POSSIBLE: oe,
					STATE_BEGAN: re,
					STATE_CHANGED: se,
					STATE_ENDED: ae,
					STATE_RECOGNIZED: ue,
					STATE_CANCELLED: le,
					STATE_FAILED: ce,
					DIRECTION_NONE: St,
					DIRECTION_LEFT: At,
					DIRECTION_RIGHT: Ft,
					DIRECTION_UP: Dt,
					DIRECTION_DOWN: Mt,
					DIRECTION_HORIZONTAL: _t,
					DIRECTION_VERTICAL: Rt,
					DIRECTION_ALL: zt,
					Manager: rt,
					Input: E,
					TouchAction: Y,
					TouchInput: H,
					MouseInput: B,
					PointerEventInput: $,
					TouchMouseInput: W,
					SingleTouchInput: j,
					Recognizer: Q,
					AttrRecognizer: Z,
					Tap: nt,
					Pan: K,
					Swipe: it,
					Pinch: J,
					Rotate: et,
					Press: tt,
					on: p,
					off: f,
					each: s,
					merge: u,
					extend: a,
					inherit: l,
					bindFn: c,
					prefixed: T
				}),
				t[i] = ot
		} (window, document, "Hammer"),
		"undefined" == typeof t.fn.outerWidth && (t.fn.outerWidth = function() {
			return t(this).width() + 2 * parseInt(t(this).css("border-width"))
		}),
		"undefined" == typeof t.fn.outerHeight && (t.fn.outerHeight = function() {
			return t(this).height() + 2 * parseInt(t(this).css("border-width"))
		}),
			M.fn = M.prototype = {
				total: 0,
				queueIndex: 0,
				topQueueIndex: 0,
				bottomQueueIndex: 0,
				prefix: z + "barrage-",
				init: function(t) {
					return this.$super = t,
						this.settings = this.$super.settings.barrage,
						this.data = this.$super.settings.barrage.data,
						this.player = this.$super.$el,
						this.video = this.$super.video,
						this.state = {
							open: !1,
							paused: !1,
							dataloaded: !1
						},
						this
				},
				draw: function() {
					for (var t = "",
							 e = this.player,
							 i = this.settings,
							 n = e.find("." + z + "barrages"), o = e.find("." + z + "barrages-top"), r = e.find("." + z + "barrages-bottom"), s = 0; s < i.queues.list; s++) t += '<div class="' + this.prefix + 'queue"></div>';
					var a = n.length < 1 ? ['<div class="' + z + 'barrages">', t, "</div>"].join("\n") : "";
					if (i.top && o.length < 1) {
						t = "";
						for (var s = 0; s < i.queues.top; s++) t += '<div class="' + this.prefix + 'queue"></div>';
						a += ['<div class="' + z + 'barrages-top">', t, "</div>"].join("\n")
					}
					if (i.bottom && r.length < 1) {
						t = "";
						for (var s = 0; s < i.queues.bottom; s++) t += '<div class="' + this.prefix + 'queue"></div>';
						t += '<div class="' + this.prefix + 'queue-fired"></div>',
							a += ['<div class="' + z + 'barrages-bottom">', t, "</div>"].join("\n")
					}
					var u = this.player.find("." + this.prefix + "loading");
					return u.length < 1 && (a += '<span class="' + z + 'barrage-loading">弹幕加载中...</span>'),
						this.player.append(a),
						this
				},
				create: function() {
					this.draw();
					var t = this.$super,
						e = this.player,
						i = t.video,
						n = e.find("." + z + "barrages"),
						o = e.find("." + z + "barrages-top"),
						r = e.find("." + z + "barrages-bottom");
					return this.barrages = n,
						this.topBarrages = o,
						this.bottomBarrages = r,
					w() || e.find("." + z + "barrage-queue").bind("click",
						function(e) {
							e.preventDefault(),
								e.stopPropagation(),
								t[i.paused ? "play": "pause"]()
						}),
						this
				},
				play: function() {
					var t = this.settings,
						e = this.prefix + "paused";
					return this.state.paused = !1,
					this.barrages && this.barrages.removeClass(e),
					t.top && this.topBarrages && this.topBarrages.removeClass(e),
					t.bottom && this.bottomBarrages && this.bottomBarrages.removeClass(e),
						this
				},
				pause: function() {
					var t = this.settings,
						e = this.prefix + "paused";
					return this.state.paused = !0,
					this.barrages && this.barrages.addClass(e),
					t.top && this.topBarrages && this.topBarrages.addClass(e),
					t.bottom && this.bottomBarrages && this.bottomBarrages.addClass(e),
						this
				},
				defaultBarrage: function() {
					var t = this.video.currentTime.toFixed(3);
					return {
						type: 1,
						tempType: 1,
						size: 17,
						timing: t,
						color: d(),
						shadow_alpha: 1,
						shadow_color: "#ff3366",
						shadow_width: 2,
						index: 0
					}
				},
				barrageElement: function(e) {
					var i = t("<span/>");
					this.settings;
					return i.addClass("barrage").html(e.content).css({
						color: e.color,
						fontSize: e.size + "px"
					}),
					(e.type > 1 || e.tempType > 1) && (i.addClass("stroke").css({
						color: e.color,
						"-webkit-text-fill-color": e.color,
						"-webkit-text-stroke-color": e.shadow_color
					}), (4 === e.type || 4 === e.tempType) && i.addClass("self")),
						i.attr("timing", e.timing),
						i
				},
				fire: function(e, i, n) {
					i = i || "",
						n = n ||
						function() {},
						e = t.extend(this.defaultBarrage(), e);
					var o = this.barrageElement(e),
						r = this.settings;
					if ("top" === i) F(o, this.topBarrages, this, "top");
					else if ("bottom" === i) F(o, this.bottomBarrages, this, "bottom");
					else {
						var s = this.barrages.children("." + this.prefix + "queue"),
							a = s.eq(this.queueIndex),
							u = (a.find("span.barrage").length, a.find("span.barrage").last());
						o.bind(O,
							function() {
								t(this).fadeOut(function() {
									t(this).unbind(O).remove()
								})
							}),
							a.append(o);
						var l = this.barrages.width();
						u.length > 0 && (l += u.width() + 100),
							o.css("left", l + "px").attr("left", l);
						var d = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
							h = r.speeds.list,
							p = 6;
						"random" === h ? p = d[c(0, d.length - 1)] : "object" == typeof h && h.length > 0 ? (p = h[c(0, h.length - 1)], parseInt(u.attr("speed")) === p && (p -= 2)) : "number" == typeof h && (p = parseInt(h)),
						(o.width() <= 120 || o.text().length < 6) && 24 > p && (p = c(22, 24)),
						o.width() >= .9 * this.player.width() && (p = 14);
						var f = this.prefix + p + "s";
						o.addClass(f).attr("speed", p),
							this.queueIndex = this.queueIndex < s.length - 1 ? this.queueIndex + 1 : 0
					}
					return t.proxy(n, this)(e),
						this
				},
				addFire: function(e, i, n) {
					if ("object" != typeof e || "undefined" == typeof e.content) return alert("错误：传入的弹幕数据无效！"),
						!1;
					if ("" === e.content) return alert("错误：弹幕内容不能为空！"),
						!1;
					e = t.extend(this.defaultBarrage(), e);
					var o = this.video.currentTime.toFixed(3);
					if (e.timing <= o && o > 0 && !this.video.ended) {
						e.tempType = 4;
						var r = this["bottom" === i ? "bottomBarrages": "topBarrages"],
							s = r.find("." + z + "barrage-queue-fired"),
							a = this.barrageElement(e);
						a.addClass(this.prefix + "fadeout-delay-3s"),
							a.bind(O,
								function() {
									t(this).hide().remove()
								}),
						r.find("span.barrage").length > 1 && s.html(a),
							e.tempType = 1,
							this.append(e),
							this.fire(e, i, n)
					} else e.tempType = 1,
						this.append(e);
					return this
				},
				remove: function(t) {
					var e = this.$super.data.barragesClone;
					return e[t] ? (delete e[t], this) : (alert("错误：时间 " + t + " 的弹幕数据不存在，无法删除！"), !1)
				},
				append: function(e, i) {
					e = t.extend(this.defaultBarrage(), e);
					var n = this.$super.data.barrages,
						o = this.$super.data.barragesClone;
					return i = i || e.timing || this.video.currentTime.toFixed(3),
						i = Number(i).toFixed(3),
					o[i] || (o[i] = []),
						o[i].push(e),
					t.isEmptyObject(n) && (n = t.extend({},
						o)),
					this.video.paused && this.video.currentTime > 0 && !this.video.ended && (n[i] || (n[i] = []), n[i].push(e)),
						this
				},
				open: function(e) {
					function i() {
						n.total = 0;
						for (var t in o.data.barragesClone) n.total += 1
					}
					e = e ||
					function() {};
					var n = this,
						o = this.$super;
					this.settings;
					this.create();
					var r = this.player,
						s = r.toolbar,
						a = s.find("[barrage]"),
						u = this.data;
					return this.loading = r.find("." + this.prefix + "loading"),
						this.queueIndex = 0,
						this.state.open = !0,
					a.length > 0 && a.html("弹幕 [关]"),
						!this.$super.settings.barrage.open || "" !== u && u ? (this.$super.settings.barrage.open = !0, n.state.dataloaded ? (t.isEmptyObject(o.data.barrages) && (o.data.barrages = t.extend({},
							o.data.barragesClone)), i(), this.show().play()) : "object" == typeof u ? (u = D(u), n.state.dataloaded = !0, u = t.extend(!0, o.data.barragesClone, u), o.data.barrages = u, o.data.barragesClone = t.extend({},
							u), i(), n.show().play(), t.proxy(e, o)(u)) : (this.loading.show(), t.get(u,
							function(r) {
								n.video.paused && n.loading.hide(),
									r = D(r),
									n.state.dataloaded = !0,
									r = t.extend(!0, o.data.barragesClone, r),
									o.data.barrages = r,
									o.data.barragesClone = t.extend({},
										r),
									i(),
									n.show().play(),
									t.proxy(e, o)(r)
							})), this) : (alert("错误：弹幕数据的请求 URL 地址不能为空！"), this)
				},
				close: function() {
					return this.$super.settings.barrage.open = !1,
						this.state.open = !1,
						this.endClose(),
						this
				},
				endClose: function() {
					var t = (this.settings, this.player.toolbar),
						e = t.find("[barrage]");
					this.data;
					return e.length > 0 && e.html("弹幕 [开]"),
						this.clear(),
						this
				},
				empty: function() {
					var t = this.settings;
					return this.barrages && this.barrages.find("span").unbind(O).remove(),
					t.top && this.topBarrages && this.topBarrages.find("span").unbind(O).remove(),
					t.bottom && this.bottomBarrages && this.bottomBarrages.find("span").unbind(O).remove(),
						this
				},
				clear: function() {
					var t = this.settings;
					return this.barrages && (this.barrages.find("span").unbind(O), this.barrages.remove()),
					t.top && this.topBarrages && (this.topBarrages.find("span").unbind(O), this.topBarrages.remove()),
					t.bottom && this.bottomBarrages && (this.bottomBarrages.find("span").unbind(O), this.bottomBarrages.remove()),
						this
				},
				show: function() {
					var t = this.settings;
					return this.barrages.show(),
					t.top && this.topBarrages.show(),
					t.bottom && this.bottomBarrages.show(),
						this
				},
				hide: function() {
					var t = this.settings;
					return this.barrages.hide(),
					t.top && this.topBarrages.hide(),
					t.bottom && this.bottomBarrages.hide(),
						this
				}
			},
			M.prototype.init.prototype = M.prototype,
			_.defaults = {
				id: "",
				_id: "",
				src: "",
				type: "full",
				width: "100%",
				height: "100%",
				data: {},
				onlyVideo: !1,
				poster: "",
				link: "",
				linkBlank: !0,
				title: "",
				autoplay: !1,
				loop: !1,
				buffered: !0,
				toolbar: "position",
				preload: !0,
				hoverTimeout: 2e3,
				endedShow: !1,
				waitingTimes: 100,
				controls: {
					keyboard: !0,
					right: {
						volume: !0,
						barrage: !0,
						fullscreen: !0,
						share: !0,
						link: !0
					},
					addon: ""
				},
				barrage: {
					open: !1,
					queues: {
						list: 6,
						top: 5,
						bottom: 5
					},
					speeds: {
						list: [15, 16, 17, 18, 19, 20],
						other: "random"
					},
					data: "",
					top: !1,
					bottom: !1
				},
				mutedCached: !0,
				recommends: !1,
				onabort: function() {},
				oncanplay: function() {},
				oncanplaythrough: function() {},
				ondurationchange: function() {},
				onended: function() {},
				onemptied: function() {},
				onerror: function(t) {
					var e = t.error,
						i = "meipai.player.error : ";
					console.log(i, e.code, this.errorTypes[e.code])
				},
				onfullscreen: function() {},
				onfullscreenexit: function() {},
				onloadstart: function() {},
				onloadeddata: function() {},
				onloadedmetadata: function() {},
				onplay: function() {},
				onplaying: function() {},
				onpause: function() {},
				onprogress: function() {},
				onratechange: function() {},
				onready: function() {},
				onseeked: function() {},
				onshare: function() {},
				onseeking: function() {},
				onstalled: function() {},
				ontimeupdate: function() {},
				onvolumechange: function() {},
				onwaiting: function() {},
				onwaitingtimes: function() {}
			},
			_.fn = _.prototype = {
				$hooks: {},
				prefix: z,
				iconPrefix: z + "icon-",
				timeFormat: v,
				isZepto: u,
				pageVisibilityState: $,
				rand: c,
				randomColor: d,
				hexToRGB: h,
				support: R.support,
				errorTypes: [["UNKOWN", "未知错误"], ["MEDIA_ERR_ABORTED", "播放中止"], ["MEDIA_ERR_DECODE", "解析文件出现问题，请检查文件是否损坏或不正确！"], ["MEDIA_ERR_NETWORK", "存在网络问题，请检查！"], ["MEDIA_ERR_SRC_NOT_SUPPORTED", "源文件不存在或不支持源文件的格式"]],
				init: function(n, o) {
					var r = t("object" == typeof n ? n: "#" + n),
						s = t.extend(!0, {},
							_.defaults),
						a = t.extend(!0, s, o);
					window.localStorage && a.mutedCached && (this.defaultMuted = localStorage.meipaiPlayerMuted ? localStorage.meipaiPlayerMuted: "false");
					var u = a.width,
						l = a.height;
					"" !== u && "" !== l && r.css({
						width: "number" == typeof u ? u + "px": u,
						height: "number" == typeof l ? l + "px": l
					}),
						this.id = n,
						this._id = a._id,
						this.$el = r,
						this.el = r[0],
						a.id = n,
						this.settings = a,
						this.data = {
							barrages: {},
							barragesClone: {},
							originalWidth: a.width,
							originalHeight: a.height
						},
						this.defaultMuted = "false",
						this.state = {
							display: !0,
							play: !1,
							paused: !1,
							muted: !1,
							fullscreen: !1
						};
					"" !== a.src && r.attr("video", a.src),
					"" !== a.poster && r.attr("poster", a.poster);
					var c = r.attr("video"),
						d = r.attr("poster"),
						h = r.attr("link");
					if (C(c) || (c = a.src), C(d) || (d = a.poster), !C(c)) throw new TypeError("错误：视频源文件不能为空！");
					if (r.addClass(w() ? z + "touch": z + "no-touch"), w() && a.autoplay && (e() || i() || (a.autoplay = !1)), q) {
						var p = ['<div class="' + z + 'box">', '<video webkit-playsinline="true"' + (a.onlyVideo ? " controls": "") + ">", '<source src="' + c + '" type="video/mp4" />', '<p>你的浏览器不支持视频播放，请下载播放，<a href="' + c + '">点击下载</a>。</p>', "</video>", "</div>"].join("\n");
						r.addClass(z + "html5-video").html(p),
							this.$src = c,
							this.isHTML5Video = !0,
							this.settings.src = c;
						var f = r.find("video"),
							g = f[0];
						C(d) && f.attr("poster", d),
							a.preload === !0 ? f.attr("preload", "auto") : "string" == typeof a.preload && "" !== a.preload ? f.attr("preload", a.preload) : f.attr("preload", "none"),
							this.link = h,
							this.$video = f,
							this.video = g,
							this.$poster = d,
						a.onlyVideo || (this.video.controls = !1, this.drawPlayer(), this.controls(), this.barrage = M.call(this)),
							r.attr({
								video: null,
								poster: null,
								link: null
							}),
							t.proxy(a.onready, this)()
					} else this.isFlash = !0,
						r.addClass("flash"),
						console.log("不支持 HTML5 视频时，采用 Flash 解决方案。");
					return this
				},
				drawPlayer: function() {
					var t = this.settings,
						e = ['<div class="' + z + "progress " + z + "progress-vertical " + z + 'volume" style="display: none;">', '<div class="' + z + 'progress-track"></div>', '<div class="' + z + 'progress-thumb"></div>', '<div class="' + z + 'progress-btn"></div>', "</div>"].join("\n"),
						i = "",
						n = this.iconPrefix,
						o = "not-position" === t.toolbar ? " not-position": "",
						r = "";
					if ("simple" === t.type) {
						r = ['<div class="' + z + "progress " + z + "progress-time " + z + 'progress-full">', '<div class="' + z + 'progress-track"></div>', '<div class="' + z + 'progress-buffer"></div>', '<div class="' + z + 'progress-thumb"></div>', '<div class="' + z + 'progress-btn" style="display: none;"></div>', "</div>"].join("\n");
						var s = '<div class="' + z + 'controls-right" style="width: 8%;">                    <button fullscreen class="' + n + 'fullscreen"></button>                </div>';
						t.controls.right.fullscreen || (s = ""),
							i = ["not-position" === t.toolbar ? "": r, '<div class="' + z + 'controls" style="padding-top: 1px;">', '<div class="' + z + 'controls-left" style="width: 8%;">', '<button play class="' + n + 'play white"></button>', "</div>", '<div class="' + z + 'controls-left" style="width: 8%;text-align:right;">', '<span><i time class="white">00:00</i></span>', "</div>", '<div class="' + z + 'controls-left" style="width: ' + (t.controls.right.fullscreen ? "68%": "76%") + ';">', '<div class="' + z + "progress " + z + "progress-time " + z + 'progress-small" style="position: relative;margin-bottom: 1px;">', '<div class="' + z + 'progress-track"></div>', '<div class="' + z + 'progress-buffer"></div>', '<div class="' + z + 'progress-thumb"></div>', '<div class="' + z + 'progress-btn" style="display: none;"><span></span></div>', "</div>", "</div>", '<div class="' + z + 'controls-left" style="width: 8%;">', "<span><i total>00:00</i></span>", "</div>", s, "</div>"].join("\n")
					} else i = ['<div class="' + z + "progress " + z + 'progress-time">', '<div class="' + z + 'progress-track"></div>', '<div class="' + z + 'progress-buffer"></div>', '<div class="' + z + 'progress-thumb"></div>', '<div class="' + z + 'progress-btn" style="display: none;"></div>', "</div>", '<div class="' + z + 'controls">', '<div class="' + z + 'controls-left">', '<button play class="' + n + 'play white"></button>', '<span><i time class="white">00:00</i> / <i total>00:00</i></span>', "</div>", '<div class="' + z + 'controls-right">', t.controls.right.volume ? '<button volume><i class="' + n + 'volume"></i>' + e + "</button>": "", t.controls.right.barrage ? "<button barrage>弹幕 [开]</button>": "", t.controls.right.fullscreen ? '<button fullscreen class="' + n + 'fullscreen"></button>': "", t.controls.right.share ? '<button share class="' + n + 'share"></button>': "", t.controls.right.link ? '<a href="javascript:;" link>Ta 的美拍</a>': "", t.controls.addon, "</div>", "</div>"].join("\n");
					var a = ['<div class="' + z + "state " + z + 'state-progress">', "<dl>", "<dd>", '<span class="progress-panel"><i icon></i><i time>00:00</i><span progress><span thumb></span></span></span>', "</dd>", "</dl>", "</div>", '<div class="' + z + "state " + z + 'state-loading">', "<dl>", "<dd>", '<span class="loading"></span>', "</dd>", "</dl>", "</div>", '<div class="' + z + "state " + z + 'state-pause">', "<dl>", "<dd>", '<span class="pause"></span>', "</dd>", "</dl>", "</div>", '<div class="' + z + "toolbar" + o + '">', i, "</div>", "" !== t.title ? '<div class="' + z + 'title"><p>' + t.title + "</p></div>": ""].join("\n");
					return this.$el.append(a),
						this
				},
				controls: function() {
					function i() {
						m() && "simple" !== N.type && rt.width(t(window).width());
						var e = X.currentTime / X.duration,
							i = rt.width() * e;
						st.width(i + "px");
						var n = u() ? 0 : ut.width() / 2,
							o = i - ut.width(),
							r = rt.width() - n;
						0 > o ? o = 0 : o > r && (o = r),
							ut.css("left", o + "px")
					}
					function o(t) {
						t = t || "small";
						var e = H.find("." + z + "progress-time");
						rt = "full" === t ? e.first() : e.last(),
							st = rt.children("." + z + "progress-thumb"),
							at = rt.children("." + z + "progress-buffer"),
							ut = rt.children("." + z + "progress-btn"),
							at.width(j.preloadProgressPercent + "%")
					}
					function r() {
						clearTimeout(mt),
							clearTimeout(gt),
							clearTimeout(vt)
					}
					function a(t) {
						if (!j.barrage.state.open) return ! 1;
						if (j.barrage.bottomBarrages.length > 0) {
							var e = j.barrage.bottomBarrages,
								i = t || m() || H.hasClass(bt) ? Y.height() - 10 + "px": "2px";
							e.css("bottom", i)
						}
					}
					function l() {
						mt = setTimeout(function() {
								clearTimeout(mt),
								t.isFunction(Y.stop) && Y.stop();
								var e = "-" + (Y.height() - rt.height()) + "px";
								Y.animate({
										bottom: e
									},
									{
										duration: "slow",
										complete: function() {
											a(!1),
											"simple" === N.type && (ft.length < 1 && (ft = Y.find("." + z + "progress-full")), ft.show(), o("full"), i(), ut.hide())
										}
									}),
									ut.fadeOut()
							},
							N.hoverTimeout)
					}
					function c() {
						X.oldCurrentTime = X.currentTime,
							yt = ut.position().left;
						var t = H.find("." + z + "progress-time"),
							e = t.last().children("." + z + "progress-btn");
						if (w()) {
							var i, n, o, s, a;
							e.bind("touchstart",
								function(t) {
									t.stopPropagation()
								});
							var u = new Hammer(e[0]);
							u.on("panstart",
								function(t) {
									H.hasClass(bt) && (wt = !1, r(), i = t.deltaX, n = st.width(), Tt = X.currentTime)
								}),
								u.on("panmove",
									function(u) {
										if (H.hasClass(bt)) {
											r(),
												wt = !0,
												o = u.deltaX - i,
												s = n + o,
												s = s > rt.width() ? rt.width() : s,
												s = 0 > s ? 0 : s;
											var l = s - e.width();
											l = 0 > l ? 0 : l,
												e.css("left", l + "px"),
												st.width(s);
											var c = X.currentTime;
											o > a ? Tt = c - 4 : a > o && (Tt = c + 3),
												a = o;
											var d = s / t.last().width();
											d = d > 1 ? 1 : d,
												d = 0 > d ? 0 : d,
												k(s, X.duration * d)
										}
									}),
								u.on("panend",
									function(e) {
										if (H.hasClass(bt)) {
											r(),
												wt = !1;
											var n = s / t.last().width();
											n = n > 1 ? 1 : n,
												n = 0 > n ? 0 : n,
												X.currentTime = X.duration * n,
												i = 0
										}
									})
						} else P(e, {
							y: !1,
							container: t.last(),
							start: function(t) {
								r(),
									Tt = X.currentTime
							},
							end: function(t) {
								r()
							},
							callback: function(e) {
								r();
								var i = X.currentTime,
									n = e.left / t.last().width();
								X.currentTime = X.duration * n,
								i !== X.currentTime && (Tt = i),
									st.width(e.left + "px"),
									k(e.left)
							}
						});
						d()
					}
					function d() {
						var t = H.find("." + z + "progress-time");
						t.last().bind("touchstart",
							function() {
								Tt = X.currentTime
							}).bind(x(),
							function(t) {
								if (T(t), t.target === ut[0] || t.target === ut.find("span")[0]) return ! 1;
								r(),
									ut.dragging = !1;
								var e = (t.pageX || t.changedTouches[0].pageX) - rt.offset().left,
									i = e / rt.width(),
									n = ut.outerWidth();
								if (e > 0 && e < rt.width()) {
									var o = rt.width() * i,
										s = o - ut.width(),
										a = rt.width() - n / 2;
									0 > s ? s = 0 : s > a && (s = a),
										X.currentTime = X.duration * i,
										k(s, X.currentTime)
								}
							})
					}
					function h() {
						"simple" === N.type && ("none" !== ft.css("display") && "none" !== rt.css("display") && (ft.hide(), o("small")), i(), ut.show())
					}
					function f() {
						if (m()) return ! 1;
						H.removeClass(bt);
						var e = "-" + (Y.height() - 2) + "px";
						t.isFunction(Y.stop) && Y.stop(),
							Y.css("bottom", e),
							clearTimeout(gt),
							a(!1),
						"simple" === N.type && (ft.show(), o("full"), i()),
							ut.hide()
					}
					function g() {
						H.addClass(bt),
						t.isFunction(Y.stop) && Y.stop(),
						"simple" === N.type && (ft.hide(), o("small")),
							a(!0),
							Y.css("bottom", 0),
							ut.show(),
							h()
					}
					function b() {
						gt = setTimeout(f, N.hoverTimeout)
					}
					function y() {
						t(window).resize(function() {
							"simple" === N.type && (m() && ft.hide(), o("small")),
								i();
							var t = ("simple" === N.type ? 2 : rt.height(), "-" + (Y.height() - rt.height()) + "px");
							Y.css("bottom", Y.css("bottom") === t ? 0 : t)
						})
					}
					function T(t) {
						t.preventDefault(),
							t.stopPropagation()
					}
					function E(t) {
						t.stopPropagation(),
							clearTimeout(mt),
						X.paused || t.target === ft[0] || (H.hasClass(bt) ? (r(), X.ended || f()) : (g(), b(), vt = setTimeout(function() {
								clearTimeout(vt),
									f()
							},
							N.hoverTimeout), m() && (r(), a(!0)), h()))
					}
					function I(t) {
						j[X.paused ? "play": "pause"](),
							a(X.paused ? !0 : !1),
						w() && (X.paused || f(), xt = !1)
					}
					function k(i, n) {
						clearTimeout(Pt),
							ct.hide(),
						N.barrage.open && (H.find("." + z + "barrage-queue").html(""), j.data.barrages = t.extend([], j.data.barragesClone));
						var o = kt.find("[icon]"),
							r = kt.find("[time]"),
							s = kt.find("[progress]"),
							a = s.children("[thumb]");
						ht.css("opacity", 1).show(),
							o.attr("class", j.iconPrefix + (n >= Tt ? "forward": "backward")),
							r.html(v(n)),
							Q.html(v(n));
						var u = n / X.duration;
						u >= .98 && (u = 1),
							a.width(u * s.width() + "px").attr("class", u >= .95 ? "radius": ""),
							yt = ut.position().left,
							Pt = setTimeout(function() {
									if (clearTimeout(Pt), ut.keyboardAction = !1, ht.hide(), X.paused) dt.show();
									else {
										if (m()) return ! 1;
										w() && b()
									}
								},
								500),
						N.barrage.open && e() && j.barrage.play()
					}
					function F(e) {
						if (j.lastTimeUpdate = X.currentTime, wt) return ! 1;
						V.html(v(X.duration === 1 / 0 ? 0 : X.duration)),
							j.$video.removeClass("blur");
						var i = H.find("." + z + "recommends");
						V.removeClass("white"),
						i.length > 0 && i.fadeOut(),
						j.lastTimeUpdate > 0 && pt.hide(),
							Q.html(v(X.currentTime === 1 / 0 ? 0 : X.currentTime || 0)),
							yt = ut.position().left;
						var n = X.currentTime / X.duration,
							o = rt.width() * n;
						st.width(o + "px");
						var r = u() ? 0 : ut.width() / 2,
							s = o - ut.width(),
							a = rt.width() - r;
						0 > s ? s = 0 : s >= a && (s = a),
							ut.css("left", s + "px");
						var l = ut.keyboardAction;
						if ("string" == typeof l && (yt = "forward" === l ? s - 50 : s + 50, k(s, X.currentTime)), N.barrage.open && j.barrage.state.dataloaded) {
							var c = j.barrage;
							if (j.barrage.state.paused) c.play();
							else {
								var d = X.currentTime,
									h = t.extend({},
										j.data.barrages),
									p = H.find("." + c.prefix + "loading");
								p.hide(),
									c.show();
								var f = 0,
									g = 0;
								for (var m in h)(0 > m || m > X.duration) && delete j.data.barrages[m],
								d > m && 2 > d - m && f++;
								for (var m in h) if (d > m && 2 > d - m) {
									if (3 > f || g > f - 5) {
										var b = j.data.barrages[m];
										b.forEach(function(t) {
											var e = t.type > 1 ? "bottom": "";
											c.fire(t, e)
										})
									}
									delete j.data.barrages[m],
										g++
								}
								t.isEmptyObject(j.data.barrages) && (j.data.barrages = {}),
								X.paused && !X.ended && c.pause()
							}
						}
						t.proxy(N.ontimeupdate, j)(X, e)
					}
					function D(e) {
						function i() {
							j.barrage.endClose()
						}
						function n() {
							j.pause(),
							N.recommends && "" !== N.recommends && (ct.hide(), j.recommend()),
							"simple" === N.type && (ft.hide().css("display", "none"), o("small"), ut.show().css("left", rt.width() - ut.width()), st.width(rt.width()), h(), r()),
								clearTimeout(mt),
								Y.css("bottom", 0),
							w() && (H.addClass(z + "toolbar-up"), h(), j.settings.barrage.open && j.barrage.bottomBarrages.css("bottom", Y.height() - 10 + "px")),
								t.proxy(N.onended, j)(X, e)
						}
						function s(t) {
							t = t ||
							function() {},
								Dt = setTimeout(function() {
										clearTimeout(Dt),
											i(),
											t()
									},
									3e3)
						}
						V.addClass("white"),
							N.loop ? j.settings.barrage.open ? s(function() {
								j.replay(),
									t.proxy(N.onended, j)(X, e)
							}) : (j.replay(), t.proxy(N.onended, j)(X, e)) : (N.endedShow ? (clearTimeout(Pt), _.addons.endedShow(j)) : n(), j.settings.barrage.open && (j.barrage.play(), s()))
					}
					function M(e) {
						t.proxy(N.onwaiting, j)(X, e)
					}
					function R(e) {
						if (! (Z.length < 1)) {
							var i = 1 - X.volume;
							X.volume <= .5 && X.volume > 0 ? tt.attr("class", j.iconPrefix + "volume-low") : X.volume > .5 ? tt.attr("class", j.iconPrefix + "volume") : X.volume <= 0 ? tt.attr("class", j.iconPrefix + "volume-mute2") : tt.attr("class", j.iconPrefix + "volume"),
								0 > i ? i = 0 : i > 1 && (i = 1);
							var n = Z.height() * i,
								o = n - J.outerHeight() / 2,
								r = Z.height() - J.outerHeight();
							r > 68 && (r = 68),
								0 > o ? o = 0 : o > r && (o = r, n = Z.height()),
							0 === X.volume && u() && (o = n = 68),
							J.dragging || (J.css("top", o + "px"), K.css("top", n + "px")),
								J.dragging = !1,
								X.muted = X.volume <= 0 ? !0 : !1,
							window.localStorage && (localStorage.meipaiPlayerMuted = X.muted ? "true": "false"),
								t.proxy(N.onvolumechange, j)(X, e)
						}
					}
					function q(e) {
						clearTimeout(Rt);
						for (var i = 0,
								 n = X.buffered,
								 o = X.currentTime; ! (n.start(i) <= o && o <= n.end(i));) i += 1;
						var r = n.start(i) / X.duration,
							s = n.end(i) / X.duration,
							a = 100 * (s - r);
						if (j.preloadProgressPercent = a, at.width(a + "%"), _t = !0, j.lastTimeUpdate > 0) {
							Mt = !1,
								pt.css({
									background: "none",
									zIndex: 2
								});
							var u = pt.find("span");
							u.attr("class", z + "loading-ring")
						}
						X.paused || (j.waitingTimes >= N.waitingTimes && (j.waitingTimes = 0, t.proxy(N.onwaitingtimes, j)(pt, X, e)), j.lastTimeUpdate.toFixed(6) === X.currentTime.toFixed(6) ? (j.waitingTimes++, "none" === ht.css("display") ? pt.show() : Rt = setTimeout(function() {
								clearTimeout(Rt),
									pt.show()
							},
							400), N.barrage.open && j.barrage.state.dataloaded && !j.barrage.state.paused && j.barrage.pause()) : j.lastTimeUpdate > 0 && pt.hide()),
							t.proxy(N.onprogress, j)(X, e)
					}
					function O(e) {
						V.html(v(X.duration)),
						j.lastTimeUpdate > 0 && pt.hide(),
							j.firstCanplay = !0,
							t.proxy(N.oncanplay, j)(X, e)
					}
					var j = this,
						N = this.settings,
						H = this.$el,
						X = this.video,
						W = t(X),
						Y = H.find("." + z + "toolbar"),
						L = Y.find("[play]"),
						Q = Y.find("[time]"),
						V = Y.find("[total]"),
						U = Y.find("[fullscreen]"),
						G = Y.find("[volume]"),
						Z = G.children("." + z + "volume"),
						K = Z.children("." + z + "progress-thumb"),
						J = Z.children("." + z + "progress-btn"),
						tt = G.find("." + j.iconPrefix + "volume"),
						et = Y.find("[share]"),
						it = Y.find("[link]"),
						nt = H.attr("link"),
						ot = Y.find("[barrage]"),
						rt = H.find("." + z + "progress-time"),
						st = rt.children("." + z + "progress-thumb"),
						at = rt.children("." + z + "progress-buffer"),
						ut = rt.children("." + z + "progress-btn"),
						lt = "." + z + "state",
						ct = H.children(lt),
						dt = H.find(lt + "-pause"),
						ht = H.find(lt + "-progress"),
						pt = H.find(lt + "-loading"),
						ft = (pt.find(".loading"), Y.find("." + z + "progress-full"));
					t.extend(this.$el, {
						video: W,
						toolbar: Y,
						volumeIcon: tt,
						buttons: {
							time: Q,
							play: L,
							volume: G,
							totalTime: V,
							fullscreen: U
						},
						statePanel: {
							all: ct,
							loading: pt,
							pause: dt,
							progress: ht
						}
					}),
					"simple" === N.type && H.addClass(z + "simple"),
					"undefined" != typeof $.state() && $.listener(function(t, e, i) {
						e ? X.paused || j.pause() : N.autoplay && j.play()
					});
					var gt, mt, vt, bt = z + "toolbar-up";
					"true" === j.defaultMuted && (X.volume = 0, X.muted = !0);
					var yt = ut.position().left,
						wt = !1,
						Tt = X.currentTime;
					Y.attr("class") !== z + "toolbar not-position" ? (Y.css("bottom", "-" + (Y.height() - rt.height()) + "px"), w() ? (Y.bind("touchstart touchend",
						function(t) {
							r(),
								Tt = X.currentTime,
								t.stopPropagation()
						}), H.tap(E), c(), X.paused || y()) : (c(), H.mouseenter(function() {
						H.addClass("mouseenter"),
						t.isFunction(Y.stop) && Y.stop(),
						"simple" === N.type && (ft.hide(), o("small")),
							clearTimeout(mt),
							ut.fadeIn(function() {
								t(this).show()
							}),
							a(!0),
							Y.animate({
								bottom: 0
							})
					}).mouseleave(function() {
						H.removeClass("mouseenter"),
						X.ended || l()
					}), W.bind("click", I).bind("contextmenu",
						function(t) {
							return t.preventDefault(),
								!1
						}), y())) : (c(), ut.show()),
					C(nt) && (it.attr("href", nt), N.linkBlank === !0 && it.attr("target", "_blank"));
					var xt = !0;
					if (this.firstPlay = xt, L.bind(x(),
							function(t) {
								T(t),
									I(t)
							}), w()) {
						var Ct = !1;
						dt.tap(function() {
							X.paused && !Ct ? (dt.find("span").hide(), f(), Ct = !0) : X.paused && Ct && (dt.find("span").show(), g(), Ct = !1)
						}),
							dt.find(".pause").bind("touchstart",
								function(e) {
									T(e),
										t(this).addClass("hover")
								}).bind("touchend",
								function(e) {
									T(e),
										t(this).removeClass("hover"),
										I(e)
								})
					} else dt.bind("click",
						function(t) {
							I(t)
						});
					if (p()) {
						var Et = navigator.userAgent.match(/Android ([^;]*);/i);
						Et = Et ? Et[1].split(".")[0] : 0,
							(/momo/.test(navigator.userAgent) || !s()) && n() && 5 > Et ? U.parent().hide() : (H.bind(B,
								function(t) {
									T(t)
								}), U.bind(x(),
								function(e) {
									T(e),
										clearTimeout(gt),
										clearTimeout(mt),
										t.proxy(j.fullscreen, j)(e)
								}))
					} else e() ? U.bind(x(),
						function(t) {
							T(t),
								X.webkitEnterFullscreen(),
								X.play(),
							/iPhone OS 7/.test(navigator.userAgent) && setTimeout(function() {
									X.play()
								},
								500)
						}) : U.parent().hide();
					if (ot.length > 0 && ot.bind(x(),
							function(t) {
								T(t),
									N.barrage.open = N.barrage.open ? !1 : !0,
									j.barrage[N.barrage.open ? "open": "close"]()
							}), w()) G.length > 0 && G.bind("touchstart touchend",
						function(e) {
							e.preventDefault(),
								e.stopPropagation(),
							t.isFunction(Z.stop) && Z.stop(),
								Z.fadeIn(function() {
									u() && t(this).show()
								}),
								Z.bind("touchend",
									function(e) {
										e.preventDefault(),
											e.stopPropagation(),
										t.isFunction(Z.stop) && Z.stop(),
											Z.fadeOut()
									})
						}),
						A(U);
					else {
						S(L, "播放"),
							S(U, "全屏"),
							S(et, "分享给好友", "width: 250%;left:-60%;");
						var It = '<span class="' + z + 'tooltip timeline" style="line-height:1;left:-19px;top:-30px; width: auto;">00:00</span>';
						rt.append(It).fadeIn(function() {
							u() && t(this).show()
						}),
							G.mouseenter(function() {
								t.isFunction(Z.stop) && Z.stop(),
									Z.fadeIn(function() {
										u() && t(this).show()
									})
							}).mouseleave(function() {
								t.isFunction(Z.stop) && Z.stop(),
									Z.fadeOut()
							})
					}
					G.length > 0 && (J.dragging = !1, P(J, {
						x: !1,
						touch: !0,
						container: Z,
						callback: function(t) {
							var e = t.top / Z.height();
							K.css("top", t.top + "px"),
								.1 > e ? e = 0 : e > 1 && (e = 1),
							t.top + J.outerHeight() >= Z.height() && (e = 1);
							var i = X.volume;
							X.oldVolume = i,
								X.volume = (1 - e).toFixed(1)
						}
					}), tt.bind(x(),
						function(t) {
							t.preventDefault(),
								t.stopPropagation(),
								j.muted()
						}), Z.bind(x(),
						function(t) {
							if (t.preventDefault(), t.stopPropagation(), t.target === J[0]) return ! 1;
							J.dragging = !1;
							var e = t.pageY - Z.offset().top,
								i = e / Z.height();.1 > i ? i = 0 : 0 > i ? i = 0 : i > 1 && (i = 1);
							var n = X.volume;
							X.oldVolume = n,
								X.volume = (1 - i).toFixed(1)
						}));
					var Pt, kt = ht.find(".progress-panel");
					ut.dragging = !1,
						ut.keyboardAction = !1,
					w() || rt.bind("mouseenter mousemove",
						function(e) {
							e.preventDefault(),
								e.stopPropagation();
							var i = t(this).find("." + z + "tooltip"),
								n = m() ? e.pageX: e.pageX - rt.offset().left,
								o = n / rt.width(),
								r = m() ? e.pageX - i.width() / 2 - 4 : e.pageX - 19 + "px";
							"simple" === N.type && (r = parseFloat(r) - rt.offset().left + "px"),
								i.show().fadeIn().css("left", r).html(v(X.duration * o))
						}).mouseleave(function(e) {
							e.preventDefault();
							var i = t(this).find("." + z + "tooltip");
							i.fadeOut()
						});
					var St, At = !1;
					if (e()) {
						Y.bind("touchmove",
							function(t) {
								r(),
									t.stopPropagation()
							});
						var Ft = {};
						t(document).bind("touchstart",
							function(t) {
								var e = t.originalEvent ? t.originalEvent: t;
								Ft = {
									x: e.changedTouches[0].pageX,
									y: e.changedTouches[0].pageY
								}
							}).bind("touchmove",
							function(t) {
								t.stopPropagation();
								var i = t.originalEvent ? t.originalEvent: t,
									n = i.changedTouches[0].pageX - Ft.x,
									o = i.changedTouches[0].pageY - Ft.y;
								Math.abs(n) < 10 || Math.abs(o) < 10 || (At = !0, N.barrage.open && e() && j.barrage.pause())
							}).bind("touchend",
							function(t) {
								t.stopPropagation(),
								At && (At = !1, N.barrage.open && e() && (j.barrage.play(), St = setTimeout(function() {
										clearTimeout(St),
											j.barrage.empty()
									},
									600)))
							})
					}
					N.controls.keyboard && !w() && t(window).bind("keyup",
						function(t) {
							t.preventDefault(),
							32 === t.keyCode && I(t),
							39 === t.keyCode && (clearTimeout(Pt), ut.keyboardAction = "forward", j.forward(10)),
							37 === t.keyCode && (clearTimeout(Pt), ut.keyboardAction = "backward", j.backward(10)),
							27 !== t.keyCode || m() || "true" === H.attr("fullscreen") && j.fullscreen("exit")
						}),
					et.length > 0 && et.bind(x(),
						function(e) {
							t.proxy(N.onshare, j)(e)
						});
					var Dt, Mt = !0,
						_t = !1;
					j.waitingTimes = 0,
						j.lastTimeUpdate = 0;
					var Rt;
					return this.preloadProgressPercent = 0,
						this.firstCanplay = !1,
						t(X).bind({
							abort: function(e) {
								t.proxy(N.onabort, j)(X, e)
							},
							canplaythrough: function(e) {
								t.proxy(N.oncanplaythrough, j)(X, e)
							},
							canplay: O,
							durationchange: function(e) {
								V.html(v(X.duration)),
									t.proxy(N.ondurationchange, j)(X, e)
							},
							ended: D,
							error: function(e) {
								pt.show(),
									t.proxy(N.onerror, j)(X, e)
							},
							emptied: function(e) {
								t.proxy(N.onemptied, j)(X, e)
							},
							loadstart: function(e) {
								N.autoplay && X.paused && (j.state.play = !0, X.autoplay = !0, X.poster = "", dt.hide(), j.play()),
									t.proxy(N.onloadstart, j)(X, e)
							},
							loadeddata: function(e) {
								V.html(v(X.duration)),
									t.proxy(N.onloadeddata, j)(X, e)
							},
							loadedmetadata: function(e) {
								V.html(v(X.duration)),
									t.proxy(N.onloadedmetadata, j)(X, e)
							},
							progress: function(t) {
								j.firstCanplay && q(t)
							},
							pause: function(e) {
								j.state.play = !1,
									j.state.paused = !0,
								"simple" === N.type && (r(), N.loop || X.ended || g()),
								N.loop || X.ended || j.pause(),
									t.proxy(N.onpause, j)(X, e)
							},
							play: function(e) {
								j.state.play = !0,
									j.state.paused = !1,
									clearTimeout(Dt),
								"simple" === N.type && f(),
									dt.hide(),
									t.proxy(N.onplay, j)(X, e)
							},
							playing: function(e) {
								j.state.play = !0,
									j.state.paused = !1,
									clearTimeout(Dt),
									t.proxy(N.onplaying, j)(X, e)
							},
							ratechange: function(e) {
								t.proxy(N.onratechange, j)(X, e)
							},
							seeked: function(e) {
								t.proxy(N.onseeked, j)(X, e)
							},
							seeking: function(e) {
								j.lastTimeUpdate = X.currentTime,
									t.proxy(N.onseeking, j)(X, e)
							},
							stalled: function(e) {
								j.lastTimeUpdate > 0 && !X.paused && pt.show(),
									t.proxy(N.onstalled, j)(X, e)
							},
							timeupdate: F,
							volumechange: R,
							waiting: M
						}),
						this
				},
				config: function(t, e) {
					var i = this.settings;
					if ("object" == typeof t) for (var n in t) i[n] = t[n];
					else i[t] = e;
					return console.log(i),
						this
				},
				recreate: function(t) {
					return this.init(this.id, t || this.settings),
						this
				},
				src: function(t, e) {
					return audio = audio || !1,
						this.$src = t,
						this[audio ? "audio": "video"].src = t,
						this
				},
				play: function() {
					var t = this.$el,
						e = this.video,
						i = this.settings;
					if (e.paused) {
						this.firstPlay && (this.$video.attr("poster", null), this.$el.statePanel.loading.show()),
							this.firstPlay = !1;
						var n = t.find("[play]"),
							o = (t.children("." + z + "state"), t.children("." + z + "state-pause"));
						n.removeClass(this.iconPrefix + "play").addClass(this.iconPrefix + "pause"),
							o.hide(),
						i.endedShow && t.find("." + z + "ended-show").hide(),
							e.play(),
						i.barrage.open && (this.barrage.endClose(), this.barrage.open())
					}
					return this
				},
				pause: function() {
					var t = this.$el,
						e = this.video,
						i = this.settings;
					if (e.played) {
						var n = t.find("[play]"),
							o = t.children("." + z + "state-pause");
						n.removeClass(this.iconPrefix + "pause").addClass(this.iconPrefix + "play"),
							o.show(),
						e.paused || e.ended || e.pause()
					}
					if (i.barrage.open) {
						var r = t.find("." + z + "barrage-loading");
						r.hide(),
							this.barrage.pause()
					}
					return this
				},
				currentTime: function() {
					var t = this.video.currentTime;
					return "boolean" != typeof arguments[0] || arguments[0] ? t = v(t) : t
				},
				totalTime: function() {
					var t = this.video.duration;
					return "boolean" != typeof arguments[0] || arguments[0] ? t = v(t) : t
				},
				replay: function() {
					return this.$video.removeClass("blur"),
						this.video.currentTime = 0,
						this.play(),
						this
				},
				loop: function() {
					var e = this,
						i = this.video,
						n = this.settings;
					return n.loop && ($this.children("." + z + "state").hide(), t(i).bind("ended",
						function() {
							e.replay(),
								t.proxy(n.onended, e)(i)
						})),
						this
				},
				poster: function(t) {
					return this.video.poster = this.settings.poster = this.$poster = t,
						this
				},
				stop: function() {
					return this.video.currentTime = this.video.duration,
						this.pause(),
						this
				},
				show: function() {
					return this.$el.show(),
						this.state.display = !0,
						this
				},
				hide: function() {
					return this.$el.hide(),
						this.state.display = !1,
						this
				},
				resize: function(t, e) {
					var t = "number" == typeof t ? t + "px": t,
						e = "number" == typeof e ? e + "px": e;
					return this.$el.css({
						width: t,
						height: e
					}),
						this.settings.width = t,
						this.settings.height = e,
						this
				},
				"goto": function(t) {
					var e = this.video;
					return t > e.duration && (t = e.duration),
						e.currentTime = t,
						this
				},
				backward: function(t) {
					return this.video.currentTime -= t,
						this
				},
				forward: function(t) {
					return this.video.currentTime += t,
						this
				},
				muted: function() {
					var t = this.video,
						e = t.muted ? !1 : !0;
					return t.volume = t.muted ? t.oldVolume ? t.oldVolume: 1 : 0,
						t.muted = this.state.muted = e,
					this.settings.mutedCached && window.localStorage && (this.defaultMuted = t.muted ? "true": "false", localStorage.meipaiPlayerMuted = this.defaultMuted),
						this
				},
				volume: function(t) {
					if (1 >= t && t >= 0) {
						var e = this.video,
							i = e.volume;
						e.oldVolume = i,
							e.volume = t
					}
					return this
				},
				volumeUp: function(t) {
					t = t || .1;
					var e = this.video;
					if (e.volume <= 1 - t) {
						var i = e.volume;
						e.oldVolume = i,
							e.volume += t
					}
					return this
				},
				volumeDown: function(t) {
					t = t || .1;
					var e = this.video;
					if (e.volume >= t) {
						var i = e.volume;
						e.oldVolume = i,
							e.volume -= t
					}
					return this
				},
				on: function(t, e) {
					var i = (this.video, this.settings),
						n = "";
					if ("object" == typeof t) for (var o in t) t.hasOwnProperty(o) && (n = "on" + o, i.hasOwnProperty(n) && (i[n] = t[o]));
					else n = "on" + t,
					i.hasOwnProperty(n) && (i[n] = e);
					return this
				},
				hook: function(t, e) {
					var i = this.$hooks;
					if ("object" == typeof t) for (var n in t) t.hasOwnProperty(n) && (i[n] = t[n]);
					else i[t] = e;
					return this
				},
				trigger: function(e) {
					var i = this.video,
						n = this.settings,
						o = n["on" + e] ? n["on" + e] : this.$hooks[e];
					return t.proxy(o, this)(i),
						this
				},
				fullscreen: function(e) {
					e = e || !1;
					var i = this.$el,
						n = this.video,
						o = this.settings,
						r = i.toolbar,
						s = this.data,
						a = i.find("[fullscreen]") || null,
						u = this.iconPrefix;
					return p() ? (m() || "exit" === e ? (a && (a.removeClass(u + "unfullscreen").addClass(u + "fullscreen"), S(a, "全屏")), i.attr("fullscreen", null), g(), r.attr("class") === z + "toolbar not-position2" && r.removeClass("not-position2").addClass("not-position"), this.state.fullscreen = !1, this.resize(s.originalWidth, s.originalHeight), t.proxy(o.onfullscreenexit, this)(n)) : (a && (a.removeClass(u + "fullscreen").addClass(u + "unfullscreen"), S(a, "退出全屏", "width: 240%;left: -45%;")), i.attr("fullscreen", "true"), r.attr("class") === z + "toolbar not-position" && r.removeClass("not-position").addClass("not-position2").css("bottom", 0), s.originalWidth = "100%" === o.width ? "100%": i.width(), s.originalHeight = "100%" === o.height ? "100%": i.height(), f(i[0]), this.resize("100%", "100%"), this.state.fullscreen = !0, t.proxy(o.onfullscreen, this)(n)), this) : this
				},
				recommend: function() {
					function e(t) {
						if (!t || t.length < 1) return alert("没有传入推荐视频列表的数据或不能为空！"),
							!1;
						var e = "";
						for (var i in t) {
							var n = t[i],
								o = n.liked ? " liked": "";
							e += ["<li>", '<a href="' + n.url + '" title="' + n.caption.replace(/\<img(.*)\>/, "") + '" data-id="' + n.id + '">', '<span class="pause"></span>', '<div class="poster">', '<img data-src="' + n.cover_pic + '" class="picture" />', "<span>" + n.caption + "</span>", "</div>", "<p>", '<i class="' + v + "like" + o + '"></i><span likes>' + n.likes_count + "</span>&nbsp;&nbsp;&nbsp;", '<i class="' + v + 'comments"></i><span comments>' + n.comments_count + "</span>", "</p>", "</a>", "</li>"].join("\n")
						}
						return e
					}
					function i(t) {
						F = p.width() === p.height() ? 2 : 3;
						for (var e = (t + 1) * F, i = t; e > i; i++) {
							var o = k.find("li").eq(i).find("img.picture"),
								r = o.attr("data-src");
							C(o.attr("src")) || (o.attr("src", r), o.attr("data-src", null), o.onload = function() {
								n()
							})
						}
					}
					function n() {
						P.find("li").each(function() {
							var e = t(this);
							T = p.width() === p.height() ? 2 : 3,
								e.css({
									width: (P.width() - 20 * (T - 1)) / T + "px",
									height: k.height() + "px",
									marginRight: "20px"
								});
							var i = e.find(".pause"),
								n = (e.find("img.picture"), e.find(".poster"), i.width());
							0 === n && (n = 50);
							var o = (e.width() - n) / 2 + "px";
							i.css({
								top: o,
								left: o
							});
							var r = e.find("p");
							k.height() < 200 ? r.hide() : r.show()
						})
					}
					function o() {
						F = p.width() === p.height() ? 2 : 3,
							n();
						var t, e = (t = 32, P.height() / 2 + 4 + "px"),
							i = (g.width() - P.width()) / 2 - t - 20 + "px";
						S.css({
							top: e,
							left: i
						}),
							A.css({
								top: e,
								left: "auto",
								right: i
							})
					}
					function r() {
						D > 0 && (D -= 1),
							i(M - D - 1);
						var e = k.find("li:last-child");
						e.prependTo(k),
							e = k.find("li:last-child"),
							e.prependTo(k),
						(m() || p.width() > p.height()) && (e = k.find("li:last-child"), e.prependTo(k)),
							k.css("marginLeft", "-" + (P.width() + (m() ? 40 : 20)) + "px"),
						t.isFunction(k.stop) && k.stop(),
							k.animate({
									marginLeft: 0
								},
								800)
					}
					function s() {
						M - 1 > D && (D += 1),
							i(D),
						t.isFunction(k.stop) && k.stop(),
							k.animate({
									marginLeft: "-" + (P.width() + (m() ? 40 : 20)) + "px"
								},
								{
									duration: 800,
									complete: function() {
										var t = k.find("li:first-child");
										t.appendTo(k),
											t = k.find("li:first-child"),
											t.appendTo(k),
										(m() || p.width() > p.height()) && (t = k.find("li:first-child"), t.appendTo(k)),
											k.css("marginLeft", 0)
									}
								})
					}
					function a() {
						y = setInterval(s, 3e3)
					}
					function l(n) {
						M = Math.ceil(n.length / F),
							k.append(e(n)),
							i(D),
							g.fadeIn(function() {
								u() && t(this).show()
							}),
							S.show().bind("touchstart",
								function(e) {
									e.preventDefault(),
										e.stopPropagation(),
										t(this).addClass("hover")
								}).bind(x(),
								function(e) {
									e.preventDefault(),
										e.stopPropagation(),
										t(this).removeClass("hover"),
										r()
								}),
							A.show().bind("touchstart",
								function(e) {
									e.preventDefault(),
										e.stopPropagation(),
										t(this).addClass("hover"),
										clearInterval(y)
								}).bind(x(),
								function(e) {
									e.preventDefault(),
										e.stopPropagation(),
										t(this).removeClass("hover"),
										clearInterval(y),
										s()
								}),
							o(),
							a(),
							t(window).resize(o),
							w() ? (k.find("a").bind("touchstart",
								function(e) {
									E(e, t(this)),
										clearInterval(y)
								}).bind("touchend touchcancel",
								function(e) {
									I(e, t(this)),
										clearInterval(y)
								}), g.bind("touchstart touchend touchcancel",
								function() {
									clearInterval(y)
								})) : g.mouseenter(function() {
								clearInterval(y)
							}).mouseleave(function() {
								a()
							}),
						n.length <= F && (S.hide(), A.hide()),
							g.find(".replay").bind("touchstart",
								function(e) {
									E(e, t(this))
								}).bind(x(),
								function(e) {
									I(e, t(this)),
										g.hide(),
										clearInterval(y),
										a = function() {},
										c.replay()
								})
					}
					var c = this,
						d = this.settings,
						h = d.recommends;
					if ("" === h || !h) return this;
					this.$video.addClass("blur");
					var p = this.$el,
						f = "." + z + "recommends",
						g = p.find(f),
						v = this.iconPrefix;
					if (g.length < 1) {
						var b = ['<div class="' + z + 'recommends">', '<div class="recommends">', '<div class="recommends-box">', '<a href="javascript:;" class="' + v + 'prev2" prev></a>', '<a href="javascript:;" class="' + v + 'next2" next></a>', '<div class="play-list"><h1>猜你喜欢：</h1><ul></ul></div>', '<p><a href="javascript:;" class="replay"><i class="' + v + 'replay"></i> 重新播放</a></p>', "</div>", "</div>", "</div>"].join("\n");
						this.$el.append(b),
							g = p.find(f)
					}
					var y, T, P = (p.find(".recommends-box"), g.find(".play-list")),
						k = P.children("ul"),
						S = g.find("[prev]"),
						A = g.find("[next]"),
						F = p.width() === p.height() ? 2 : 3,
						D = 0,
						M = 0;
					if ("string" == typeof h) t.getJSON(h,
						function(t) {
							l(t)
						});
					else if ("object" == typeof h) l(h);
					else if ("" === h || null === h) return alert("没有传入推荐视频列表的数据！"),
						this;
					return this
				}
			},
			_.fn.init.prototype = _.fn,
			window.MeipaiPlayerCreator = _,
			_.addons = {},
			_.addons.endedShow = function(e, i) {
				if (e.video.ended) {
					var n = e.$el,
						o = e.settings,
						r = n.find("." + z + "toolbar"),
						s = n.children("." + z + "state"),
						a = "." + z + "ended-show";
					if (i = i ||
						function() {},
							s.hide(), n.find(a).length < 1) {
						var u = ['<div class="' + z + 'ended-show">', '<div class="' + z + 'ended-show-con">', '<div class="' + z + 'ended-show-box">', "<ul>", '<li><a href="' + (o.data.endedShowLink || "#") + '" class="read-more-btn"><i class="' + z + 'meipai-icon"></i>我的更多美拍</a></li>', '<li><a href="javascript:;" class="replay-btn"><i class="' + z + 'replay-icon"></i>重播</a></li>', "</ul>", "</div>", "</div>", "</div>"].join("\n");
						n.append(u),
							n.find(".read-more-btn, .replay-btn").on("touchstart",
								function() {
									t(this).addClass("hover")
								}).on("touchend touchcancel touchmove",
								function() {
									t(this).removeClass("hover")
								}),
							n.find(".replay-btn").on(w() ? "tap": "click",
								function(t) {
									t.preventDefault(),
										t.stopPropagation(),
										e.replay()
								})
					}
					r.css("bottom", "-38px"),
						n.find(a).fadeIn(),
						i(),
						t.proxy(o.onended, e)(e.video)
				}
			},
			R.version = "0.6.4",
			R.author = "Pandao, Meitu Inc.",
			R.prefix = z,
			R.timeFormat = v,
			R.clickOrTouch = x,
			R.rand = c,
			R.randomColor = d,
			R.isZepto = u,
			R.iOS = e,
			R.isAndroid = n,
			R.isChrome = s,
			R.isWechat = i,
			R.isQQ = o,
			R.isQQBrowser = r,
			R.netType = l,
			R.isMeitu = a,
			R.mobileCanSupport = function() {
				return e() && i() || e() && o() || n() && s()
			},
			R.pageVisibilityState = $,
			R.fullscreen = {
				"in": f,
				exit: g,
				support: p,
				isFullscreen: m,
				changeEvent: B
			},
			R.support = {
				touch: w,
				fullscreen: p,
				HTML5Audio: y,
				HTML5Video: b
			},
			R.events = {
				fullscreenChange: B,
				animationEnd: O
			},
			R.create = window.MeipaiPlayerCreator = _,
			R.preload = function() {
				var e = ['<div class="' + z + 'preload-container">', '<div class="' + z + "state " + z + 'state-loading" style="display: block;width:0;height:0;">', "<dl>", "<dd>", '<span class="loading" style="width:0;height:0;"></span>', "</dd>", "</dl>", "</div>", '<i class="meipai-player-icon-play" style="font-size:0;width:0;height:0;"></i>', '<i class="meipai-player-meipai-icon" style="width:0;height:0;"></i>', '<i class="meipai-player-replay-icon" style="width:0;height:0;"></i>', "</div>"].join("\n");
				t && t("body").append(t(e))
			},
			window.MeipaiPlayer = R,
			t.fn.meipaiPlayer = function(e) {
				var i = this.selector.replace("#", "");
				return t(i).length > 1 ? (alert("错误：创建播放器只允许使用 ID 选择器！"), !1) : R.create(i, e)
			},
			R
	});