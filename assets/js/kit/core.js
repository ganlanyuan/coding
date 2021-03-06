// on off click mouseover mouseout focus blur submit keydown keyup
// find eq filter first last parent parents children firstChild lastChild siblings prev prevAll next nextAll
// hide show fadeIn remove 
// text html attr css addClass removeClass toggleClass hasClass 
// outerWidth outerHeight getTop getLeft offset(left top)
// before after append prepend

// READY
// HELPER FUNCTIONS
// LANGUAGE EXTENSIONS
// KIT START
// DOM MANIPULATION
// HANDLE ATTR
// STYLE INSTANCE METHODS
// STYLE INSTANCE METHODS
// HANDLE NODE
// GET ELEMENT SIZE
// GET WINDOW SIZE

// ========== READY ==========
// Author: Diego Perini (diego.perini at gmail.com)
// Summary: cross-browser wrapper for DOMContentLoaded
// URL: https://github.com/dperini/ContentLoaded/blob/master/src/contentloaded.js
function ready(fn) {
	var win = window, 
	done = false, 
	top = true,
	doc = win.document,
	root = doc.documentElement,
	modern = doc.addEventListener,
	add = modern ? 'addEventListener' : 'attachEvent',
	rem = modern ? 'removeEventListener' : 'detachEvent',
	pre = modern ? '' : 'on',
	init = function(e) {
		if (e.type === 'readystatechange' && doc.readyState !== 'complete') {return;}
		(e.type === 'load' ? win : doc)[rem](pre + e.type, init, false);
		if (!done && (done = true)) {fn.call(win, e.type || e);}
	},
	poll = function() {
		try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
		init('poll');
	};
	if (doc.readyState === 'complete') { fn.call(win, 'lazy'); }
	else {
		if (!modern && root.doScroll) {
			try { top = !win.frameElement; } catch(e) { }
			if (top) { poll(); }
		}
		doc[add](pre + 'DOMContentLoaded', init, false);
		doc[add](pre + 'readystatechange', init, false);
		win[add](pre + 'load', init, false);
	}
}

// ========== HELPER FUNCTIONS ==========
function toCamelCase(str) {
	return str.replace(/-([a-z])/ig, function( all, letter ) {
		return letter.toUpperCase();
	});
}

var getStyle = (function() {
	if (typeof getComputedStyle !== "undefined") {
		return function(el, cssProp) {
			return window.getComputedStyle(el, null).getPropertyValue(cssProp);
		};
	} else {
		return function(el, cssProp) {
			return el.currentStyle[toCamelCase(cssProp)];
		};
	}
}());

// ========== LANGUAGE EXTENSIONS ==========
if (typeof String.prototype.trim === "undefined") {
	String.prototype.trim = function() {
		return this.replace( /^\s+/, "" ).replace( /\s+$/, "" );
	};
}

if (typeof Array.prototype.indexOf !== 'function') {
	Array.prototype.indexOf = function (item) {
		for(var i = 0; i < this.length; i++) {
			if (this[i] === item) {
				return i;
			}
		}
		return -1;
	}; 
}

// ========== KIT START ==========
// (function (window, undefined) {
var dome = function (args, el) {
	if ( args.length > 0 ) {
		for (var i = 0; i < args.length; i++) {
			el[i] = args[i];
		}
		el.length = args.length;
	}
};

var k = function (selector) {
	if ( window === this ) {return new k(selector); }
	var type = typeof selector;
	if (type === 'string') {
		var result = document.querySelectorAll(selector);
		dome(result, this);
	} else if (type === "object" && selector.nodeType !== "undefined" && selector.nodeType === 1) {
		this[0] = selector;
		this.length = 1;
	}
	return this;
};

// ========= UTILS =========
var whitespace = "[\\x20\\t\\r\\n\\f]",
characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
identifier = characterEncoding.replace( "w", "w#" ),
attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
	"*([*^$|!~]?=)" + whitespace +
	"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
	"*\\]",
ID = new RegExp( "^#(" + characterEncoding + ")" ),
CLASS = new RegExp( "^\\.(" + characterEncoding + ")" ),
TAG = new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
ATTR = new RegExp( "^" + attributes );

k.filter = function (selector, els) {
	var match = [];
	if (selector.match(TAG)) {
		for (var i = 0; i < els.length; i++) {
			if(els[i].tagName.toLowerCase() === selector.replace(/(^\s*)|(\s*$)/g, '')){
				match.push(els[i]);
			}
		}
	} else if(selector.match(CLASS)){
		for (var j = 0; j < els.length; j++) {
			if ((" " + els[j].className + " ").indexOf(" " + selector.replace(/(^\s*\.)|(\s*$)/g, '') + " ") > -1) {
				match.push(els[j]);
			}
		}
	} else if(selector.match(ID)){
		for (var k = 0; k < els.length; k++) {
			if ((" " + els[k].getAttribute('id') + " ").indexOf(" " + selector.replace(/(^\s*\#)|(\s*$)/g, '') + " ") > -1) {
				match.push(els[k]);
			}
		}
	} else if(selector.match(ATTR)){
		for (var q = 0; q < els.length; q++) {
			if (els[q].hasAttribute(selector.replace(/(^\s*\[)|(\]\s*$)/g, ''))) {
				match.push(els[q]);
			}
		}
	}

	return match;
};

k.prototype.map = function (callback) {
	var results = [];
	for (var i = 0; i < this.length; i++) {
		results.push(callback.call(this, this[i], i));
	}
	return results;
};

k.prototype.mapOne = function (callback) {
	var m = this.map(callback);
	return m.length > 1 ? m : m[0];
};

k.prototype.forEach = function (callback) {
	this.map(callback);
	return this; 
};

k.prototype.filter = function (selector) {
	var results = k.filter(selector, this);

	if (results.length > 0) {
		dome(results, this);
		return this;
	} else { return; }
};

// ========= EVENT STATIC METHODS =========
if (typeof addEventListener !== "undefined") {
	k.addEvent = function(obj, evt, fn) {
		obj.addEventListener(evt, fn, false);
	};

	k.removeEvent = function(obj, evt, fn) {
		obj.removeEventListener(evt, fn, false);
	};
} else if (typeof attachEvent !== "undefined") {
	k.addEvent = function(obj, evt, fn) {
		var fnHash = "e_" + evt + fn;

		obj[fnHash] = function() {
			var type = event.type,
				relatedTarget = null;

			if (type === "mouseover" || type === "mouseout") {
				relatedTarget = (type === "mouseover") ? event.fromElement : event.toElement;
			}
			
			fn.call(obj, {
				target : event.srcElement,
				type : type,
				relatedTarget : relatedTarget,
				_event : event,
				preventDefault : function() {
					this._event.returnValue = false;
				},
				stopPropagation : function() {
					this._event.cancelBubble = true;
				}
			});
		};

		obj.attachEvent("on" + evt, obj[fnHash]);
	};

	k.removeEvent = function(obj, evt, fn) {
		var fnHash = "e_" + evt + fn;

		if (typeof obj[fnHash] !== "undefined") {
			obj.detachEvent("on" + evt, obj[fnHash]);
			delete obj[fnHash];
		}
	};
} else {
	k.addEvent = function(obj, evt, fn) {
		obj["on" + evt] = fn;
	};

	k.removeEvent = function(obj, evt) {
		obj["on" + evt] = null;
	};
}

// ========= EVENT INSTANCE METHODS =========
k.prototype.on = function (evt, fn) {
	return this.forEach(function (el) {
		k.addEvent(el, evt, fn);
	});
};

k.prototype.off = function (evt, fn) {
	return this.forEach(function (el) {
		k.removeEvent(el, evt, fn);
	});
};

k.prototype.click = function(fn) {
	return this.forEach(function (el) {
		k.addEvent(el, 'click', fn);
	});
};

k.prototype.mouseover = function(fn) {
	return this.forEach(function (el) {
		k.addEvent(el, 'mouseover', fn);
	});
};

k.prototype.mouseout = function(fn) {
	return this.forEach(function (el) {
		k.addEvent(el, 'mouseout', fn);
	});
};

k.prototype.focus = function(fn) {
	return this.forEach(function (el) {
		k.addEvent(el, 'focus', fn);
	});
};

k.prototype.blur = function(fn) {
	return this.forEach(function (el) {
		k.addEvent(el, 'blur', fn);
	});
};

k.prototype.submit = function(fn) {
	return this.forEach(function (el) {
		k.addEvent(el, 'submit', fn);
	});
};

k.prototype.keydown = function(fn) {
	return this.forEach(function (el) {
		k.addEvent(el, 'keydown', fn);
	});
};

k.prototype.keyup = function(fn) {
	return this.forEach(function (el) {
		k.addEvent(el, 'keyup', fn);
	});
};

// ========== DOM MANIPULATION ==========
k.prototype.hide = function() {
	return this.forEach(function (el) {
		el.style.display = 'none';
	});
};

k.prototype.show = function() {
	return this.forEach(function (el) {
		el.style.display = 'inherit';
	});
};

k.prototype.fadeIn = function (time) {
	return this.forEach(function (el) {
		var opacity = 0;

		el.style.opacity = 0;
		el.style.filter = '';

		var last = +new Date();
		var tick = function() {
		  opacity += (new Date() - last) / time;
		  el.style.opacity = opacity;
		  el.style.filter = 'alpha(opacity=' + (100 * opacity)|0 + ')';

		  last = +new Date();

		  if (opacity < 1) {
		    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
		  }
		};

		tick();
	});
};

k.prototype.find = function (selector) {
	var results = [];
	if (typeof selector === 'string') {
		this.forEach(function (el) {
			var selection = el.querySelectorAll(selector);
			for (var i = 0; i < selection.length; i++) {
				results.push(selection[i]);
			}
		});
	}
	if (results.length > 0) {
		dome(results, this);
		return this;
	} else { return; }
};

k.eq = function( args, i ) {
	if (args.length > i) {
		return k(args[i]);
	}
};

k.prototype.eq = function (i) {
	return k.eq(this, i);
};

k.prototype.first = function () {
	return k.eq(this, 0);
};

k.prototype.last = function () {
	return k.eq(this, this.length-1);
};

k.prototype.parent = function () {
	var results = [];
	this.forEach(function (el) {
		results.push(el.parentNode);
	});

	if (results.length > 0) {
		dome(results, this);
		return this;
	} else { return; }
};

k.prototype.prev = function () {
	var results = [];
	this.forEach(function (el) {
		do { el = el.previousSibling; } while ( el && el.nodeType !== 1 );
		results.push(el);
	});

	if (results.length > 0) {
		dome(results, this);
		return this;
	} else { return; }
};

k.prototype.next = function () {
	var results = [];
	this.forEach(function (el) {
		do { el = el.nextSibling; } while ( el && el.nodeType !== 1 );
		results.push(el);
	});

	if (results.length > 0) {
		dome(results, this);
		return this;
	} else { return; }
};

k.prototype.siblings = function (selector) {
	var results = [],
			type = typeof selector;
	this.forEach(function (el) {
		var siblings = el.parentNode.children;
		for (var i = 0; i < siblings.length; i++) {
			if (siblings[i] !== el) {
				results.push(siblings[i]);
			}
		}
	});
	if (type === 'string') {
		results = k.filter(selector, results);
	}

	if (results.length > 0) {
		dome(results, this);
		return this;
	} else { return; }
};

k.prototype.parents = function (selector) {
	if (typeof selector !== 'string') {return;}
	var results = [],
			parent = [];
	this.forEach(function (el) {
		while(el.parentNode && el.parentNode.tagName){
			parent.push(el.parentNode);
			el = el.parentNode;
		}
	});
	results = k.filter(selector, parent);

	if (results.length > 0) {
		dome(results, this);
		return this;
	} else { return; }
};

k.prototype.children = function (selector) {
	var children = [],
			type = typeof selector;
	this.forEach(function (el) {
		for (var i=el.children.length; i--;){
			if (el.children[i].nodeType === 1){
				children.unshift(el.children[i]);
			}
		}
	});
	if (type !== 'undefined' && type === 'string') {
		children = k.filter(selector, children);
	}

	if (children.length > 0) {
		dome(children, this);
		return this;
	} else { return; }
};

k.prototype.firstChild = function (selector) {
	var type = typeof selector;
	if (type !== 'undefined' && type === 'string') {
		return this.children(selector).eq(0);
	} else if(type === 'undefined'){
		return this.children().eq(0);
	}
};

k.prototype.lastChild = function (selector) {
	var type = typeof selector;
	if (type !== 'undefined' && type === 'string') {
		return this.children(selector).last();
	} else if(type === 'undefined'){
		return this.children().last();
	}
};

k.index = function(obj, current){
	for (var i = 0;i < obj.length; i++) {
		if (obj[i] === current) {
			return i;
		}
	}
};

k.prototype.prevAll = function () {
	var results = [];
	this.forEach(function (el) {
		var siblings = el.parentNode.children,
				index = k.index(siblings, el);
		for (var i = 0; i < index; i++) {
			results.push(siblings[i]);
		}
	});

	if (results.length > 0) {
		dome(results, this);
		return this;
	} else { return; }
};

k.prototype.nextAll = function () {
	var results = [];
	this.forEach(function (el) {
		var siblings = el.parentNode.children,
				index = k.index(siblings, el);
		for (var i = siblings.length-1; i > index; i--) {
			results.push(siblings[i]);
		}
	});

	if (results.length > 0) {
		dome(results, this);
		return this;
	} else { return; }
};

// ========== HANDLE ATTR ==========
k.prototype.text = function (text) {
	if (typeof text !== "undefined") {
		return this.forEach(function (el) {
			if (el.textContent) {
				el.textContent = text;
			} else{
				el.innerText = text;
			}
		});
	} else {
		return this.mapOne(function (el) {
			if (el.textContent) {
				return el.textContent;
			} else{
				return el.innerText;
			}
		});
	}
};

k.prototype.html = function (html) {
	if (typeof html !== "undefined") {
		return this.forEach(function (el) {
			el.innerHTML = html;
		});
	} else {
		return this.mapOne(function (el) {
			return el.innerHTML;
		});
	}
};

k.prototype.attr = function (attr, val) {
	if (typeof val !== 'undefined') {
		return this.forEach(function(el) {
			el.setAttribute(attr, val);
		});
	} else {
		return this.mapOne(function (el) {
			return el.getAttribute(attr);
		});
	}
};

// ========== STYLE INSTANCE METHODS ==========
k.css = function(el, css, value) {
	var cssType = typeof css,
		valueType = typeof value,
		elStyle = el.style;

	if (cssType !== "undefined" && valueType === "undefined") {
		if (cssType === "object") {
			// set style info
			for (var prop in css) {
				if (css.hasOwnProperty(prop)) {
					elStyle[toCamelCase(prop)] = css[prop];
				}
			}
		} else if (cssType === "string") {
			// get style info for specified property
			return getStyle(el, css);
		} else {
			throw { message: "Invalid parameter passed to css()" };
		}

	} else if (cssType === "string" && valueType === "string") {
		elStyle[toCamelCase(css)] = value;

	} else {
		throw { message: "Invalid parameters passed to css()" };
	}
};

k.hasClass = function(el, value) {   
	return (" " + el.className + " ").indexOf(" " + value + " ") > -1;
};

k.addClass = function(el, value) {
	var className = el.className;
	
	if (!className) {
		el.className = value;
	} else {
		var classNames = value.split(/\s+/),
			l = classNames.length;

		for ( var i = 0; i < l; i++ ) {		    
			if (!this.hasClass(el, classNames[i])) {
				className += " " + classNames[i];
			}
		}

		el.className = className.trim();
	}
};

k.removeClass = function(el, value) {
	if (value) {
		var classNames = value.split(/\s+/),
			className = " " + el.className + " ",
			l = classNames.length;

		for (var i = 0; i < l; i++) {
			className = className.replace(" " + classNames[i] + " ", " ");
		}

		el.className = className.trim();

	} else {
		el.className = "";
	}
};

k.toggleClass = function(el, value) {
	var classNames = value.split(/\s+/),
		i = 0,
		className;

	while (className = classNames[i++]) {
		this[this.hasClass(el, className) ? "removeClass" : "addClass"](el, className);
	}
};

// ========== STYLE INSTANCE METHODS ==========
k.prototype.css = function(css, value) {
	return this.forEach(function (el) {
		return k.css(el, css, value) || el;
	});
};

k.prototype.addClass = function(value) {
	return this.forEach(function (el) {
		k.addClass(el, value);
	});
};

k.prototype.removeClass = function(value) {
	return this.forEach(function (el) {
		k.removeClass(el, value);
	});
};

k.prototype.toggleClass = function(value) {
	return this.forEach(function (el) {
		k.toggleClass(el, value);
	});
};

k.prototype.hasClass = function(value) {
	return this.forEach(function (el) {
		k.hasClass(el, value);
	});
};

// ========== HANDLE NODE ==========
k.createElement = function(obj) {
	if (!obj || !obj.tagName) {
		throw { message : "Invalid argument" };
	}

	var el = document.createElement(obj.tagName);
	obj.id && (el.id = obj.id);
	obj.className && (el.className = obj.className);
	obj.html && (el.innerHTML = obj.html);
	
	if (typeof obj.attributes !== "undefined") {
		var attr = obj.attributes,
			prop;

		for (prop in attr) {
			if (attr.hasOwnProperty(prop)) {
				el.setAttribute(prop, attr[prop]);
			}
		}
	}

	if (typeof obj.children !== "undefined") {
		var child,
			i = 0;

		while (child = obj.children[i++]) {
			el.appendChild(this.createElement(child));
		}
	}

	return el;
};
// var el = k.createElement({
// 	tagName: 'div',
// 	id: 'foo',
// 	className: 'foo',
// 	children: [{
// 		tagName: 'div',
// 		html: '<b>Hello, creatElement</b>',
// 		attributes: {
// 			'am-button': 'primary'
// 		}
// 	}]
// });

k.prototype.clone = function () {
	return this.forEach(function (el) {
		el.cloneNode(true);
	});
};

k.prototype.remove = function () {
	return this.forEach(function (el) {
		return el.parentNode.removeChild(el);
	});
};

k.prototype.append = function(data) {
	if (typeof data.nodeType !== "undefined" && data.nodeType === 1) {
		return this.forEach(function (el) {
			el.appendChild(data);
		});
	// } else if (data instanceof k) {
	// 	return this.forEach(function (el) {
	// 		el.appendChild(data);
	// 	});
		// this.el.appendChild(data.el);
	} else if (typeof data === "string") {
		return this.forEach(function (el) {
			var html = el.innerHTML;
			el.innerHTML = html + data;
		});
	}
};

k.prototype.prepend = function(data) {
	if (typeof data.nodeType !== "undefined" && data.nodeType === 1) {
		return this.forEach(function (el) {
			el.insertBefore(data, el.firstChild);
		});
	} else if (typeof data === "string") {
		return this.forEach(function (el) {
			var html = el.innerHTML;
			el.innerHTML = data + html;
		});
	}
};

k.prototype.before = function (htmlString) {
	return this.forEach(function (el) {
		el.insertAdjacentHTML('beforebegin', htmlString);
	});
};

k.prototype.after = function (htmlString) {
	return this.forEach(function (el) {
		el.insertAdjacentHTML('afterend', htmlString);
	});
};

// ========== GET ELEMENT SIZE ==========
k.prototype.outerWidth = function () {
	return this.mapOne(function (el) {
		var box = el.getBoundingClientRect();
		var ow = box.width || (box.right - box.left);
		return ow;
	});
};

k.prototype.outerHeight = function () {
	return this.mapOne(function (el) {
		var box = el.getBoundingClientRect();
		var oh = box.height || (box.bottom - box.top);
		return oh;
	});
};

k.prototype.getTop = function () {
	return this.mapOne(function (el) {
		var actualTop = el.offsetTop, current = el.offsetParent;
		while (current !== null){
		actualTop += current.offsetTop;
		current = current.offsetParent;
		}
		return actualTop;
	});
};

k.prototype.getLeft = function () {
	return this.mapOne(function (el) {
		var actualLeft = el.offsetLeft, current = el.offsetParent;
		while (current !== null){
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
		}
		return actualLeft;
	});
};

k.prototype.offset = function () {
	return this.mapOne(function (el) {
		var rect = el.getBoundingClientRect();
		var offset = {
		  top: rect.top + document.body.scrollTop,
		  left: rect.left + document.body.scrollLeft
		};
		return offset;
	});
};

// ========== GET WINDOW SIZE ==========
k.win = {
	W: function  () {
		var d = document, w = window,
		winW = w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;
		return winW;  
	},

	H: function () {
		var winH, d = document, w = window;
		if(w.innerHeight) { // all except IE
			winH = w.innerHeight;
		} else if (d.documentElement && d.documentElement.clientHeight) {
		// IE 6 Strict Mode
			winH = d.documentElement.clientHeight;
		} else if (d.body) { // other
			winH = d.body.clientHeight;
		}
		return winH;
	},

	ST: function () {
		var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		return scrollTop;
	}
};

// 	window.k = k;
// })(window);