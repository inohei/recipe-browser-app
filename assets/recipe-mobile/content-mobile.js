// node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var s;
var a;
var h;
var p = {};
var v = [];
var y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var w = Array.isArray;
function d(n2, l3) {
  for (var u4 in l3) n2[u4] = l3[u4];
  return n2;
}
function g(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _(l3, u4, t3) {
  var i4, r3, o3, e3 = {};
  for (o3 in u4) "key" == o3 ? i4 = u4[o3] : "ref" == o3 ? r3 = u4[o3] : e3[o3] = u4[o3];
  if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps) for (o3 in l3.defaultProps) void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
  return m(l3, e3, i4, r3, null);
}
function m(n2, t3, i4, r3, o3) {
  var e3 = { type: n2, props: t3, key: i4, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
  return null == o3 && null != l.vnode && l.vnode(e3), e3;
}
function k(n2) {
  return n2.children;
}
function x(n2, l3) {
  this.props = n2, this.context = l3;
}
function S(n2, l3) {
  if (null == l3) return n2.__ ? S(n2.__, n2.__i + 1) : null;
  for (var u4; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) return u4.__e;
  return "function" == typeof n2.type ? S(n2) : null;
}
function C(n2) {
  var l3, u4;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) {
      n2.__e = n2.__c.base = u4.__e;
      break;
    }
    return C(n2);
  }
}
function M(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !$.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)($);
}
function $() {
  for (var n2, u4, t3, r3, o3, f4, c3, s3 = 1; i.length; ) i.length > s3 && i.sort(e), n2 = i.shift(), s3 = i.length, n2.__d && (t3 = void 0, o3 = (r3 = (u4 = n2).__v).__e, f4 = [], c3 = [], u4.__P && ((t3 = d({}, r3)).__v = r3.__v + 1, l.vnode && l.vnode(t3), O(u4.__P, t3, r3, u4.__n, u4.__P.namespaceURI, 32 & r3.__u ? [o3] : null, f4, null == o3 ? S(r3) : o3, !!(32 & r3.__u), c3), t3.__v = r3.__v, t3.__.__k[t3.__i] = t3, N(f4, t3, c3), t3.__e != o3 && C(t3)));
  $.__r = 0;
}
function I(n2, l3, u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, y3, w3, d3, g2, _2 = t3 && t3.__k || v, m3 = l3.length;
  for (f4 = P(u4, l3, _2, f4, m3), a3 = 0; a3 < m3; a3++) null != (y3 = u4.__k[a3]) && (h3 = -1 == y3.__i ? p : _2[y3.__i] || p, y3.__i = a3, g2 = O(n2, y3, h3, i4, r3, o3, e3, f4, c3, s3), w3 = y3.__e, y3.ref && h3.ref != y3.ref && (h3.ref && B(h3.ref, null, y3), s3.push(y3.ref, y3.__c || w3, y3)), null == d3 && null != w3 && (d3 = w3), 4 & y3.__u || h3.__k === y3.__k ? f4 = A(y3, f4, n2) : "function" == typeof y3.type && void 0 !== g2 ? f4 = g2 : w3 && (f4 = w3.nextSibling), y3.__u &= -7);
  return u4.__e = d3, f4;
}
function P(n2, l3, u4, t3, i4) {
  var r3, o3, e3, f4, c3, s3 = u4.length, a3 = s3, h3 = 0;
  for (n2.__k = new Array(i4), r3 = 0; r3 < i4; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? (f4 = r3 + h3, (o3 = n2.__k[r3] = "string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? m(null, o3, null, null, null) : w(o3) ? m(k, { children: o3 }, null, null, null) : null == o3.constructor && o3.__b > 0 ? m(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : o3).__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = L(o3, u4, f4, a3)) && (a3--, (e3 = u4[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i4 > s3 ? h3-- : i4 < s3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f4 && (c3 == f4 - 1 ? h3-- : c3 == f4 + 1 ? h3++ : (c3 > f4 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
  if (a3) for (r3 = 0; r3 < s3; r3++) null != (e3 = u4[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = S(e3)), D(e3, e3));
  return t3;
}
function A(n2, l3, u4) {
  var t3, i4;
  if ("function" == typeof n2.type) {
    for (t3 = n2.__k, i4 = 0; t3 && i4 < t3.length; i4++) t3[i4] && (t3[i4].__ = n2, l3 = A(t3[i4], l3, u4));
    return l3;
  }
  n2.__e != l3 && (l3 && n2.type && !u4.contains(l3) && (l3 = S(n2)), u4.insertBefore(n2.__e, l3 || null), l3 = n2.__e);
  do {
    l3 = l3 && l3.nextSibling;
  } while (null != l3 && 8 == l3.nodeType);
  return l3;
}
function L(n2, l3, u4, t3) {
  var i4, r3, o3, e3 = n2.key, f4 = n2.type, c3 = l3[u4], s3 = null != c3 && 0 == (2 & c3.__u);
  if (null === c3 && null == n2.key || s3 && e3 == c3.key && f4 == c3.type) return u4;
  if (t3 > (s3 ? 1 : 0)) {
    for (i4 = u4 - 1, r3 = u4 + 1; i4 >= 0 || r3 < l3.length; ) if (null != (c3 = l3[o3 = i4 >= 0 ? i4-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f4 == c3.type) return o3;
  }
  return -1;
}
function T(n2, l3, u4) {
  "-" == l3[0] ? n2.setProperty(l3, null == u4 ? "" : u4) : n2[l3] = null == u4 ? "" : "number" != typeof u4 || y.test(l3) ? u4 : u4 + "px";
}
function j(n2, l3, u4, t3, i4) {
  var r3, o3;
  n: if ("style" == l3) if ("string" == typeof u4) n2.style.cssText = u4;
  else {
    if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u4 && l3 in u4 || T(n2.style, l3, "");
    if (u4) for (l3 in u4) t3 && u4[l3] == t3[l3] || T(n2.style, l3, u4[l3]);
  }
  else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(f, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u4, u4 ? t3 ? u4.u = t3.u : (u4.u = c, n2.addEventListener(l3, r3 ? a : s, r3)) : n2.removeEventListener(l3, r3 ? a : s, r3);
  else {
    if ("http://www.w3.org/2000/svg" == i4) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
      n2[l3] = null == u4 ? "" : u4;
      break n;
    } catch (n3) {
    }
    "function" == typeof u4 || (null == u4 || false === u4 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u4 ? "" : u4));
  }
}
function F(n2) {
  return function(u4) {
    if (this.l) {
      var t3 = this.l[u4.type + n2];
      if (null == u4.t) u4.t = c++;
      else if (u4.t < t3.u) return;
      return t3(l.event ? l.event(u4) : u4);
    }
  };
}
function O(n2, u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, p3, v3, y3, _2, m3, b, S2, C3, M2, $2, P2, A2, H, L2, T3, j3 = u4.type;
  if (null != u4.constructor) return null;
  128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f4 = u4.__e = t3.__e]), (a3 = l.__b) && a3(u4);
  n: if ("function" == typeof j3) try {
    if (b = u4.props, S2 = "prototype" in j3 && j3.prototype.render, C3 = (a3 = j3.contextType) && i4[a3.__c], M2 = a3 ? C3 ? C3.props.value : a3.__ : i4, t3.__c ? m3 = (h3 = u4.__c = t3.__c).__ = h3.__E : (S2 ? u4.__c = h3 = new j3(b, M2) : (u4.__c = h3 = new x(b, M2), h3.constructor = j3, h3.render = E), C3 && C3.sub(h3), h3.props = b, h3.state || (h3.state = {}), h3.context = M2, h3.__n = i4, p3 = h3.__d = true, h3.__h = [], h3._sb = []), S2 && null == h3.__s && (h3.__s = h3.state), S2 && null != j3.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = d({}, h3.__s)), d(h3.__s, j3.getDerivedStateFromProps(b, h3.__s))), v3 = h3.props, y3 = h3.state, h3.__v = u4, p3) S2 && null == j3.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), S2 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
    else {
      if (S2 && null == j3.getDerivedStateFromProps && b !== v3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(b, M2), !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(b, h3.__s, M2) || u4.__v == t3.__v) {
        for (u4.__v != t3.__v && (h3.props = b, h3.state = h3.__s, h3.__d = false), u4.__e = t3.__e, u4.__k = t3.__k, u4.__k.some(function(n3) {
          n3 && (n3.__ = u4);
        }), $2 = 0; $2 < h3._sb.length; $2++) h3.__h.push(h3._sb[$2]);
        h3._sb = [], h3.__h.length && e3.push(h3);
        break n;
      }
      null != h3.componentWillUpdate && h3.componentWillUpdate(b, h3.__s, M2), S2 && null != h3.componentDidUpdate && h3.__h.push(function() {
        h3.componentDidUpdate(v3, y3, _2);
      });
    }
    if (h3.context = M2, h3.props = b, h3.__P = n2, h3.__e = false, P2 = l.__r, A2 = 0, S2) {
      for (h3.state = h3.__s, h3.__d = false, P2 && P2(u4), a3 = h3.render(h3.props, h3.state, h3.context), H = 0; H < h3._sb.length; H++) h3.__h.push(h3._sb[H]);
      h3._sb = [];
    } else do {
      h3.__d = false, P2 && P2(u4), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
    } while (h3.__d && ++A2 < 25);
    h3.state = h3.__s, null != h3.getChildContext && (i4 = d(d({}, i4), h3.getChildContext())), S2 && !p3 && null != h3.getSnapshotBeforeUpdate && (_2 = h3.getSnapshotBeforeUpdate(v3, y3)), L2 = a3, null != a3 && a3.type === k && null == a3.key && (L2 = V(a3.props.children)), f4 = I(n2, w(L2) ? L2 : [L2], u4, t3, i4, r3, o3, e3, f4, c3, s3), h3.base = u4.__e, u4.__u &= -161, h3.__h.length && e3.push(h3), m3 && (h3.__E = h3.__ = null);
  } catch (n3) {
    if (u4.__v = null, c3 || null != o3) if (n3.then) {
      for (u4.__u |= c3 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; ) f4 = f4.nextSibling;
      o3[o3.indexOf(f4)] = null, u4.__e = f4;
    } else {
      for (T3 = o3.length; T3--; ) g(o3[T3]);
      z(u4);
    }
    else u4.__e = t3.__e, u4.__k = t3.__k, n3.then || z(u4);
    l.__e(n3, u4, t3);
  }
  else null == o3 && u4.__v == t3.__v ? (u4.__k = t3.__k, u4.__e = t3.__e) : f4 = u4.__e = q(t3.__e, u4, t3, i4, r3, o3, e3, c3, s3);
  return (a3 = l.diffed) && a3(u4), 128 & u4.__u ? void 0 : f4;
}
function z(n2) {
  n2 && n2.__c && (n2.__c.__e = true), n2 && n2.__k && n2.__k.forEach(z);
}
function N(n2, u4, t3) {
  for (var i4 = 0; i4 < t3.length; i4++) B(t3[i4], t3[++i4], t3[++i4]);
  l.__c && l.__c(u4, n2), n2.some(function(u5) {
    try {
      n2 = u5.__h, u5.__h = [], n2.some(function(n3) {
        n3.call(u5);
      });
    } catch (n3) {
      l.__e(n3, u5.__v);
    }
  });
}
function V(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : w(n2) ? n2.map(V) : d({}, n2);
}
function q(u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, v3, y3, d3, _2, m3, b = i4.props, k3 = t3.props, x2 = t3.type;
  if ("svg" == x2 ? o3 = "http://www.w3.org/2000/svg" : "math" == x2 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
    for (a3 = 0; a3 < e3.length; a3++) if ((d3 = e3[a3]) && "setAttribute" in d3 == !!x2 && (x2 ? d3.localName == x2 : 3 == d3.nodeType)) {
      u4 = d3, e3[a3] = null;
      break;
    }
  }
  if (null == u4) {
    if (null == x2) return document.createTextNode(k3);
    u4 = document.createElementNS(o3, x2, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
  }
  if (null == x2) b === k3 || c3 && u4.data == k3 || (u4.data = k3);
  else {
    if (e3 = e3 && n.call(u4.childNodes), b = i4.props || p, !c3 && null != e3) for (b = {}, a3 = 0; a3 < u4.attributes.length; a3++) b[(d3 = u4.attributes[a3]).name] = d3.value;
    for (a3 in b) if (d3 = b[a3], "children" == a3) ;
    else if ("dangerouslySetInnerHTML" == a3) v3 = d3;
    else if (!(a3 in k3)) {
      if ("value" == a3 && "defaultValue" in k3 || "checked" == a3 && "defaultChecked" in k3) continue;
      j(u4, a3, null, d3, o3);
    }
    for (a3 in k3) d3 = k3[a3], "children" == a3 ? y3 = d3 : "dangerouslySetInnerHTML" == a3 ? h3 = d3 : "value" == a3 ? _2 = d3 : "checked" == a3 ? m3 = d3 : c3 && "function" != typeof d3 || b[a3] === d3 || j(u4, a3, d3, b[a3], o3);
    if (h3) c3 || v3 && (h3.__html == v3.__html || h3.__html == u4.innerHTML) || (u4.innerHTML = h3.__html), t3.__k = [];
    else if (v3 && (u4.innerHTML = ""), I("template" == t3.type ? u4.content : u4, w(y3) ? y3 : [y3], t3, i4, r3, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o3, e3, f4, e3 ? e3[0] : i4.__k && S(i4, 0), c3, s3), null != e3) for (a3 = e3.length; a3--; ) g(e3[a3]);
    c3 || (a3 = "value", "progress" == x2 && null == _2 ? u4.removeAttribute("value") : null != _2 && (_2 !== u4[a3] || "progress" == x2 && !_2 || "option" == x2 && _2 != b[a3]) && j(u4, a3, _2, b[a3], o3), a3 = "checked", null != m3 && m3 != u4[a3] && j(u4, a3, m3, b[a3], o3));
  }
  return u4;
}
function B(n2, u4, t3) {
  try {
    if ("function" == typeof n2) {
      var i4 = "function" == typeof n2.__u;
      i4 && n2.__u(), i4 && null == u4 || (n2.__u = n2(u4));
    } else n2.current = u4;
  } catch (n3) {
    l.__e(n3, t3);
  }
}
function D(n2, u4, t3) {
  var i4, r3;
  if (l.unmount && l.unmount(n2), (i4 = n2.ref) && (i4.current && i4.current != n2.__e || B(i4, null, u4)), null != (i4 = n2.__c)) {
    if (i4.componentWillUnmount) try {
      i4.componentWillUnmount();
    } catch (n3) {
      l.__e(n3, u4);
    }
    i4.base = i4.__P = null;
  }
  if (i4 = n2.__k) for (r3 = 0; r3 < i4.length; r3++) i4[r3] && D(i4[r3], u4, t3 || "function" != typeof n2.type);
  t3 || g(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function E(n2, l3, u4) {
  return this.constructor(n2, u4);
}
function G(u4, t3, i4) {
  var r3, o3, e3, f4;
  t3 == document && (t3 = document.documentElement), l.__ && l.__(u4, t3), o3 = (r3 = "function" == typeof i4) ? null : i4 && i4.__k || t3.__k, e3 = [], f4 = [], O(t3, u4 = (!r3 && i4 || t3).__k = _(k, null, [u4]), o3 || p, p, t3.namespaceURI, !r3 && i4 ? [i4] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i4 ? i4 : o3 ? o3.__e : t3.firstChild, r3, f4), N(e3, u4, f4);
}
n = v.slice, l = { __e: function(n2, l3, u4, t3) {
  for (var i4, r3, o3; l3 = l3.__; ) if ((i4 = l3.__c) && !i4.__) try {
    if ((r3 = i4.constructor) && null != r3.getDerivedStateFromError && (i4.setState(r3.getDerivedStateFromError(n2)), o3 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n2, t3 || {}), o3 = i4.__d), o3) return i4.__E = i4;
  } catch (l4) {
    n2 = l4;
  }
  throw n2;
} }, u = 0, t = function(n2) {
  return null != n2 && null == n2.constructor;
}, x.prototype.setState = function(n2, l3) {
  var u4;
  u4 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n2 && (n2 = n2(d({}, u4), this.props)), n2 && d(u4, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), M(this));
}, x.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
}, x.prototype.render = k, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
  return n2.__v.__b - l3.__v.__b;
}, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(false), a = F(true), h = 0;

// src/core.ts
var unitMap = {
  // weight
  g: "g",
  gram: "g",
  grams: "g",
  \u30B0\u30E9\u30E0: "g",
  kg: "kg",
  kilogram: "kg",
  kilograms: "kg",
  \u30AD\u30ED: "kg",
  \u30AD\u30ED\u30B0\u30E9\u30E0: "kg",
  mg: "mg",
  \u30DF\u30EA\u30B0\u30E9\u30E0: "mg",
  // volume
  ml: "ml",
  \u30DF\u30EA\u30EA\u30C3\u30C8\u30EB: "ml",
  l: "l",
  litre: "l",
  liter: "l",
  \u30EA\u30C3\u30C8\u30EB: "l",
  \u2113: "l",
  cc: "ml",
  // spoons & cup
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  Tsp: "tsp",
  TSP: "tsp",
  "tsp.": "tsp",
  \u5C0F\u3055\u3058: "tsp",
  \u5C0F\u5319: "tsp",
  \u5C0F: "tsp",
  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  Tbsp: "tbsp",
  TBSP: "tbsp",
  TBS: "tbsp",
  "tbsp.": "tbsp",
  \u5927\u3055\u3058: "tbsp",
  \u5927\u5319: "tbsp",
  \u5927: "tbsp",
  cup: "cup",
  cups: "cup",
  Cup: "cup",
  Cups: "cup",
  \u30AB\u30C3\u30D7: "cup",
  \u676F: "cup",
  \u5408: "go",
  // counts/shapes
  \u500B: "piece",
  \u500B\u5206: "piece",
  \u500B\u5165\u308A: "piece",
  \u53F0: "piece",
  \u65A4: "piece",
  piece: "piece",
  pieces: "piece",
  \u679A: "slice",
  slice: "slice",
  slices: "slice",
  \u4E01: "block",
  \u584A: "block",
  block: "block",
  \u672C: "stalk",
  stalk: "stalk",
  stalks: "stalk",
  \u8449: "leaf",
  leaf: "leaf",
  leaves: "leaf",
  \u7247: "clove",
  clove: "clove",
  cloves: "clove",
  \u7F36: "can",
  can: "can",
  cans: "can",
  \u30D1\u30C3\u30AF: "pack",
  P: "pack",
  p: "pack",
  \u888B: "bag",
  \u5C0F\u888B: "bag",
  \u675F: "bunch",
  \u623F: "bunch",
  \u682A: "head",
  \u5207\u308C: "slice",
  cm: "cm",
  \u5C3E: "tail",
  \u7C92: "grain",
  \u7F36\u8A70: "can",
  \u304B\u3051: "clove",
  \u304B\u3051\u3089: "clove",
  // size modifiers
  \u5927\u7389: "piece",
  \u4E2D\u7389: "piece",
  \u5C0F\u7389: "piece",
  // micro
  \u5C11\u3005: "pinch",
  \u3072\u3068\u3064\u307E\u307F: "pinch",
  \u3064\u307E\u307F: "pinch",
  pinch: "pinch"
};
var unitDisplayJa = {
  g: "g",
  kg: "kg",
  mg: "mg",
  ml: "ml",
  l: "l",
  tsp: "\u5C0F\u3055\u3058",
  tbsp: "\u5927\u3055\u3058",
  cup: "\u30AB\u30C3\u30D7",
  go: "\u5408",
  cm: "cm",
  serving: "\u4EBA",
  piece: "\u500B",
  slice: "\u679A",
  block: "\u4E01",
  stalk: "\u672C",
  leaf: "\u679A",
  clove: "\u7247",
  can: "\u7F36",
  pinch: "\u5C11\u3005",
  pack: "\u30D1\u30C3\u30AF",
  bag: "\u888B",
  bunch: "\u675F",
  head: "\u682A",
  tail: "\u5C3E",
  grain: "\u7C92",
  unknown: ""
};
var nonScalableKeywords = [
  "\u9069\u91CF",
  "\u5C11\u3005",
  "\u304A\u597D\u307F\u3067",
  "\u597D\u307F\u3067",
  "\u304A\u597D\u307F\u306E\u91CF",
  "\u4F5C\u308A\u3084\u3059\u3044\u91CF",
  "\u4F5C\u308A\u3084\u3059\u3044\u5206\u91CF",
  "\u5FC5\u8981\u91CF",
  "\u5C11\u91CF",
  "\u3072\u3068\u3064\u304B\u307F",
  "\u3075\u305F\u3064\u304B\u307F",
  "\u5473\u3092\u898B\u3066",
  "to taste",
  "as needed",
  "as necessary",
  "\u9069\u5B9C",
  "\u5C71\u76DB\u308A",
  "\u305F\u3063\u3077\u308A",
  "\u3072\u305F\u3072\u305F"
];
var escapeRegExp = (s3) => s3.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var NON_SCALABLE_REGEX = new RegExp(
  `(?:${nonScalableKeywords.map(escapeRegExp).join("|")})`
);
var NUMBER_PATTERN = /(\d+(?:\.\d+)?(?:[\/／]\d+)?(?:\s*[〜～~-]\s*\d+(?:\.\d+)?(?:[\/／]\d+)?)?)/g;
var SORTED_UNIT_ENTRIES = Object.entries(unitMap).map(([k3, v3]) => [k3.toLowerCase(), v3]).sort(([a3], [b]) => b.length - a3.length);
function normalizeNumerals(text) {
  let s3 = text.replace(/[０-９]/g, (d3) => String.fromCharCode(d3.charCodeAt(0) - 65248)).replace(
    /[Ａ-Ｚａ-ｚ]/g,
    (ch) => String.fromCharCode(ch.charCodeAt(0) - 65248)
  ).replace(/一/g, "1").replace(/二/g, "2").replace(/三/g, "3").replace(/四/g, "4").replace(/五/g, "5").replace(/六/g, "6").replace(/七/g, "7").replace(/八/g, "8").replace(/九/g, "9").replace(/十/g, "10");
  s3 = s3.replace(/半分?/g, "1/2");
  s3 = s3.replace(/ひとつまみ/g, "1\u3064\u307E\u307F").replace(/ふたつまみ/g, "2\u3064\u307E\u307F").replace(/一つまみ/g, "1\u3064\u307E\u307F").replace(/二つまみ/g, "2\u3064\u307E\u307F");
  s3 = s3.replace(/ひとつ/g, "1").replace(/ふたつ/g, "2").replace(/みっつ/g, "3").replace(/よっつ/g, "4").replace(/いつつ/g, "5").replace(/むっつ/g, "6").replace(/ななつ/g, "7").replace(/やっつ/g, "8").replace(/ここのつ/g, "9").replace(/とお/g, "10");
  s3 = s3.replace(/(\d+)\s*と\s*(\d+\s*\/\s*\d+)/g, "$1 $2");
  s3 = s3.replace(/(\d+)\s*[・・]\s*(\d+\s*\/\s*\d+)/g, "$1 $2");
  s3 = s3.replace(/㎝/g, "cm");
  s3 = s3.replace(/㎖/g, "ml");
  return s3;
}
function stripAndCollectParentheticals(text) {
  const parens = [];
  const parensInner = [];
  let work = text;
  work = work.replace(/（[^）]*）/g, (m3) => {
    parens.push(m3);
    parensInner.push(m3.slice(1, -1));
    return " ";
  });
  work = work.replace(/\([^)]*\)/g, (m3) => {
    parens.push(m3);
    parensInner.push(m3.slice(1, -1));
    return " ";
  });
  return { stripped: work, parens, parensInner };
}
function toArray(x2) {
  if (!x2) return [];
  return Array.isArray(x2) ? x2 : [x2];
}
function checkNonScalableKeywords(text) {
  const m3 = text.match(NON_SCALABLE_REGEX);
  if (!m3) return void 0;
  const matched = m3[0];
  return { keyword: matched, match: matched };
}
function parseNumber(numStr) {
  if (numStr.includes("/") || numStr.includes("\uFF0F")) {
    const parts = numStr.split(/[\/／]/);
    if (parts.length === 2) {
      const num2 = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num2) && !isNaN(den) && den !== 0) {
        return num2 / den;
      }
    }
  }
  const num = parseFloat(numStr);
  return isNaN(num) ? void 0 : num;
}
function cleanIngredientName(nameWork, originalLine) {
  let cleaned = nameWork.replace(/\s+/g, " ").trim();
  cleaned = cleaned.replace(/^[・•\-\*\+★☆]\s*/, "");
  cleaned = cleaned.replace(/：$/, "");
  if (!cleaned || cleaned.length < 2) {
    const words = originalLine.split(/\s+/);
    cleaned = words.find((w3) => w3.length >= 2 && !/\d/.test(w3)) || originalLine;
    cleaned = cleaned.replace(/^[・•\-\*\+★☆]\s*/, "").replace(/：$/, "");
  }
  return cleaned;
}
function roundForUnit(value, unit) {
  if (!unit || unit === "unknown") return Math.round(value * 100) / 100;
  switch (unit) {
    case "tsp":
    case "tbsp":
    case "cup": {
      return Math.round(value * 4) / 4;
    }
    case "piece":
    case "slice":
    case "block":
    case "stalk":
    case "leaf":
    case "clove":
    case "can": {
      return Math.round(value * 10) / 10;
    }
    case "pinch":
      return value;
    default:
      return Math.round(value * 10) / 10;
  }
}

// src/parse.ts
function normalizeRecipe(raw) {
  const name = raw.name || raw.headline || void 0;
  const imageUrl = extractImageUrl(raw.image);
  const author = typeof raw.author === "string" ? raw.author : raw.author?.name;
  const yieldText = raw.recipeYield ? Array.isArray(raw.recipeYield) ? raw.recipeYield.join(", ") : String(raw.recipeYield) : void 0;
  const baseServings = (() => {
    const y3 = parseRecipeYield(yieldText);
    if (!y3) return 2;
    if (y3.unit === "serving") {
      if (y3.quantity != null) return y3.quantity;
      if (y3.quantityRange)
        return Math.round((y3.quantityRange.min + y3.quantityRange.max) / 2);
    }
    return 2;
  })();
  const ingredientsRaw = toArray(raw.recipeIngredient).map(String).filter(Boolean);
  const ingredients = ingredientsRaw.map(parseIngredientLine);
  const instructions = normalizeInstructions(raw.recipeInstructions);
  const times = {
    prep: raw.prepTime,
    cook: raw.cookTime,
    total: raw.totalTime
  };
  const nutrition = normalizeNutrition(raw.nutrition);
  return {
    name,
    imageUrl,
    author,
    yieldText,
    baseServings,
    ingredients,
    instructions,
    times,
    nutrition
  };
}
function extractImageUrl(imageField) {
  if (!imageField) return void 0;
  if (typeof imageField === "string") return imageField;
  if (Array.isArray(imageField)) {
    const s3 = imageField.find((v3) => typeof v3 === "string");
    if (s3) return s3;
    const o3 = imageField.find((v3) => typeof v3 === "object" && v3.url);
    return o3?.url;
  }
  if (typeof imageField === "object")
    return imageField.url || imageField["@id"];
  return void 0;
}
function stripDecorations(text) {
  return text.replace(/[《》「」『』【】]/g, "");
}
function parseRangeOrNumber(numStr) {
  if (/[〜～-]/.test(numStr)) {
    const parts = numStr.split(/[〜～-]/);
    if (parts.length === 2) {
      const a3 = parseNumber(parts[0].trim());
      const b = parseNumber(parts[1].trim());
      if (a3 != null && b != null) {
        return {
          r: { min: Math.min(a3, b), max: Math.max(a3, b) },
          q: (a3 + b) / 2
        };
      }
    }
  }
  const q2 = parseNumber(numStr);
  return { q: q2 };
}
function parseRecipeYield(text) {
  if (!text) return void 0;
  const original = String(text).trim();
  if (!original) return void 0;
  const normalized = normalizeNumerals(stripDecorations(original));
  const non = checkNonScalableKeywords(normalized);
  if (non) {
    return {
      originalText: original,
      scalable: false
    };
  }
  const { stripped, parensInner, parens } = stripAndCollectParentheticals(normalized);
  const work = stripped.trim();
  const personMatch = work.match(
    /(\d+(?:\.\d+)?(?:\s*[〜～-]\s*\d+(?:\.\d+)?)?)\s*人(分|前)?/i
  );
  if (personMatch) {
    const numStr = personMatch[1];
    const { q: q2, r: r3 } = parseRangeOrNumber(numStr);
    const beforeIdx = normalized.indexOf(numStr);
    const prefix = beforeIdx > 0 ? normalized.slice(0, beforeIdx).trim() || void 0 : void 0;
    const out = {
      originalText: original,
      quantity: r3 ? void 0 : q2,
      quantityRange: r3,
      unit: "serving",
      unitText: unitDisplayJa["serving"],
      prefix,
      suffix: personMatch[2] || void 0,
      scalable: true
    };
    const keptParens = [];
    for (let i4 = 0; i4 < parensInner.length; i4++) {
      const inner = parensInner[i4];
      const full = parens[i4];
      const alt = parseQuantityExpression(inner);
      const allowedSecondaryUnits = ["piece", "slice", "cup"];
      if (alt.hasNumber && alt.unit && allowedSecondaryUnits.includes(alt.unit)) {
        out.secondaryQuantity = alt.quantity;
        out.secondaryQuantityRange = alt.quantityRange;
        out.secondaryUnit = alt.unit;
        out.secondaryUnitText = alt.unitText;
        out.secondaryPrefix = alt.prefix;
        out.secondarySuffix = alt.suffix;
        continue;
      }
      keptParens.push(full);
    }
    if (keptParens.length) {
      out.prefix = [out.prefix, keptParens.join(" ")].filter(Boolean).join("").trim() || void 0;
    }
    return out;
  }
  const matches = Array.from(work.matchAll(NUMBER_PATTERN));
  if (matches.length > 0) {
    const candidates = matches.map((m4) => {
      const idx = m4.index || 0;
      const before = work.slice(0, idx).trim().toLowerCase();
      const after = work.slice(idx + m4[0].length).trim().toLowerCase();
      const unitMatch = extractUnitAdjacent(before, after);
      return { m: m4, idx, beforeLower: before, afterLower: after, unitMatch };
    });
    const withUnit = candidates.filter((c3) => c3.unitMatch);
    const chosen = (withUnit.length ? withUnit : candidates).slice(-1)[0];
    const numStr = chosen.m[1];
    const { q: q2, r: r3 } = parseRangeOrNumber(numStr);
    let unit = chosen.unitMatch?.unit;
    let unitText = chosen.unitMatch?.matched;
    let suffix;
    if (chosen.unitMatch && chosen.unitMatch.side === "after") {
      const rest = work.slice(chosen.idx + chosen.m[0].length).trim().slice(chosen.unitMatch.matched.length);
      const sm = rest.match(/^([一-龯ぁ-ゔァ-ヴーa-zA-Z]+)/);
      if (sm && sm[1]) suffix = sm[1];
    }
    const beforeWork = work.slice(0, chosen.idx).trim();
    let prefix = beforeWork ? beforeWork : void 0;
    if (chosen.unitMatch && chosen.unitMatch.side === "before" && prefix) {
      const rawTrim = prefix;
      if (rawTrim.toLowerCase().endsWith(chosen.unitMatch.matched)) {
        prefix = rawTrim.slice(0, rawTrim.length - chosen.unitMatch.matched.length).trim() || void 0;
      }
    }
    const out = {
      originalText: original,
      quantity: r3 ? void 0 : q2,
      quantityRange: r3,
      unit,
      unitText,
      prefix,
      suffix,
      scalable: q2 != null || !!r3
    };
    if ((out.quantity != null || out.quantityRange) && !out.unit) {
      out.unit = "serving";
      out.unitText = unitDisplayJa["serving"];
      out.suffix = out.suffix ?? "\u5206";
      out.scalable = true;
    }
    const keptParens = [];
    for (let i4 = 0; i4 < parensInner.length; i4++) {
      const inner = parensInner[i4];
      const full = parens[i4];
      const alt = parseQuantityExpression(inner);
      const allowedSecondaryUnits = ["piece", "slice", "cup"];
      if (alt.hasNumber && alt.unit && allowedSecondaryUnits.includes(alt.unit)) {
        out.secondaryQuantity = alt.quantity;
        out.secondaryQuantityRange = alt.quantityRange;
        out.secondaryUnit = alt.unit;
        out.secondaryUnitText = alt.unitText;
        out.secondaryPrefix = alt.prefix;
        out.secondarySuffix = alt.suffix;
        continue;
      }
      keptParens.push(full);
    }
    if (keptParens.length) {
      out.prefix = [out.prefix, keptParens.join(" ")].filter(Boolean).join("").trim() || void 0;
    }
    return out;
  }
  const t3 = work.toLowerCase();
  const m22 = t3.match(/serv(e|ing)s?\s*(\d+(?:\.\d+)?)/);
  if (m22) {
    return {
      originalText: original,
      quantity: Number(m22[2]),
      unit: "serving",
      unitText: unitDisplayJa["serving"],
      scalable: true
    };
  }
  const m3 = t3.match(/for\s*(\d+(?:\.\d+)?)\s*(people|persons|servings?)/);
  if (m3) {
    return {
      originalText: original,
      quantity: Number(m3[1]),
      unit: "serving",
      unitText: unitDisplayJa["serving"],
      scalable: true
    };
  }
  return {
    originalText: original,
    scalable: false
  };
}
function normalizeInstructions(instr) {
  if (!instr) return [];
  if (typeof instr === "string") return [instr.trim()].filter(Boolean);
  if (Array.isArray(instr)) {
    const res = [];
    for (const step of instr) {
      if (!step) continue;
      if (typeof step === "string") res.push(step.trim());
      else if (typeof step.text === "string") res.push(step.text.trim());
      else if (typeof step.name === "string") res.push(step.name.trim());
    }
    return res.filter(Boolean);
  }
  if (typeof instr === "object") {
    if (typeof instr.text === "string") return [instr.text.trim()];
    if (Array.isArray(instr.itemListElement))
      return normalizeInstructions(instr.itemListElement);
  }
  return [];
}
function normalizeNutrition(n2) {
  if (!n2 || typeof n2 !== "object") return void 0;
  const out = {};
  for (const k3 of Object.keys(n2)) {
    const v3 = n2[k3];
    if (v3 == null) continue;
    const s3 = typeof v3 === "string" ? v3 : String(v3);
    out[k3] = s3;
  }
  return Object.keys(out).length ? out : void 0;
}
function extractSecondaryFromParens(parensInner, allowedUnits) {
  for (const inner of parensInner) {
    const alt = parseQuantityExpression(inner);
    if (alt.hasNumber) {
      if (allowedUnits && alt.unit && !allowedUnits.includes(alt.unit)) {
        continue;
      }
      return {
        quantity: alt.quantity,
        quantityRange: alt.quantityRange,
        unit: alt.unit,
        unitText: alt.unitText,
        prefix: alt.prefix,
        suffix: alt.suffix
      };
    }
  }
  return void 0;
}
function parseIngredientLine(line) {
  const original = line.trim();
  const spaceSplit = original.split(/[\s　]+/);
  if (spaceSplit.length === 2 && !spaceSplit[0].match(/^[・•\-\*\+★☆]$/)) {
    const result = tryParseIngredientQuantity(
      spaceSplit[0],
      spaceSplit[1],
      original
    );
    if (result) return result;
  }
  const colonSplit = original.split("\uFF1A");
  if (colonSplit.length === 2) {
    const ingredientPart = colonSplit[0].trim().replace(/^[・•\-\*\+]\s*/, "");
    const result = tryParseIngredientQuantity(
      ingredientPart,
      colonSplit[1].trim(),
      original
    );
    if (result) return result;
  }
  return parseComplexIngredientLine(original);
}
function tryParseIngredientQuantity(ingredient, quantityStr, originalLine) {
  const normRaw = normalizeNumerals(quantityStr);
  const { stripped, parensInner, parens } = (() => {
    const r3 = stripAndCollectParentheticals(normRaw);
    return r3;
  })();
  const quantityInfo = parseQuantityExpression(stripped);
  let primaryFromParens;
  let secondary = extractSecondaryFromParens(parensInner);
  if (!quantityInfo.hasNumber && secondary) {
    primaryFromParens = secondary;
    secondary = void 0;
  }
  let parenNoteSuffix;
  if (!secondary && parens && parens.length) {
    const note = parens.join(" ").trim();
    if (note) parenNoteSuffix = note;
  }
  if (!quantityInfo.hasNumber && !quantityInfo.isNonScalable) {
    return null;
  }
  return {
    originalText: originalLine,
    name: cleanIngredientName(ingredient, originalLine),
    quantity: primaryFromParens?.quantity ?? quantityInfo.quantity,
    quantityRange: primaryFromParens?.quantityRange ?? quantityInfo.quantityRange,
    unit: primaryFromParens?.unit ?? quantityInfo.unit,
    unitText: primaryFromParens?.unitText ?? quantityInfo.unitText,
    prefix: primaryFromParens?.prefix ?? quantityInfo.prefix,
    suffix: [quantityInfo.suffix, parenNoteSuffix].filter(Boolean).join("") || void 0,
    secondaryQuantity: secondary?.quantity,
    secondaryQuantityRange: secondary?.quantityRange,
    secondaryUnit: secondary?.unit,
    secondaryUnitText: secondary?.unitText,
    secondaryPrefix: secondary?.prefix,
    secondarySuffix: secondary?.suffix,
    scalable: primaryFromParens != null || !quantityInfo.isNonScalable
  };
}
function parseComplexIngredientLine(line) {
  const original = line.trim();
  let work = normalizeNumerals(original);
  const { stripped: workNoParens, parensInner } = stripAndCollectParentheticals(work);
  work = workNoParens;
  const quantityInfo = parseQuantityExpression(work);
  let nameWork = work;
  if (quantityInfo.originalExpression) {
    nameWork = nameWork.replace(quantityInfo.originalExpression, " ");
  }
  if (quantityInfo.unit) {
    for (const [unitStr, canonicalUnit] of Object.entries(unitMap)) {
      if (canonicalUnit === quantityInfo.unit) {
        nameWork = nameWork.replace(new RegExp(`\\b${unitStr}\\b`, "g"), " ");
      }
    }
  }
  const name = cleanIngredientName(nameWork, original);
  let primaryFromParens;
  let secondary = extractSecondaryFromParens(parensInner);
  if (!quantityInfo.hasNumber && secondary) {
    primaryFromParens = secondary;
    secondary = void 0;
  }
  let parenNoteSuffix;
  if (!secondary) {
    const removed = stripAndCollectParentheticals(line);
    if (removed.parens && removed.parens.length) {
      parenNoteSuffix = removed.parens.join(" ");
    }
  }
  return {
    originalText: original,
    name,
    quantity: primaryFromParens?.quantity ?? quantityInfo.quantity,
    quantityRange: primaryFromParens?.quantityRange ?? quantityInfo.quantityRange,
    unit: primaryFromParens?.unit ?? quantityInfo.unit,
    unitText: primaryFromParens?.unitText ?? quantityInfo.unitText,
    prefix: primaryFromParens?.prefix ?? quantityInfo.prefix,
    suffix: [quantityInfo.suffix, parenNoteSuffix].filter(Boolean).join("") || void 0,
    secondaryQuantity: secondary?.quantity,
    secondaryQuantityRange: secondary?.quantityRange,
    secondaryUnit: secondary?.unit,
    secondaryUnitText: secondary?.unitText,
    secondaryPrefix: secondary?.prefix,
    secondarySuffix: secondary?.suffix,
    scalable: primaryFromParens != null || !quantityInfo.isNonScalable
  };
}
function parseQuantityExpression(text) {
  const nonScalableMatch = checkNonScalableKeywords(text);
  if (nonScalableMatch) {
    return {
      hasNumber: false,
      isNonScalable: true,
      prefix: void 0,
      // 非スケール語自体を表示に残す
      suffix: nonScalableMatch.match,
      originalExpression: nonScalableMatch.match
    };
  }
  const preNormalized = text.replace(
    /(\d+)\s*(?:と)?\s*(\d+[\/／]\d+)/g,
    (_m, a3, frac) => {
      const fv = parseNumber(frac);
      if (fv == null) return `${a3} ${frac}`;
      return String(Number(a3) + fv);
    }
  );
  let quantity;
  let quantityRange;
  let unit;
  let unitText;
  let prefix;
  let suffix;
  let originalExpression;
  const numberMatches = Array.from(preNormalized.matchAll(NUMBER_PATTERN));
  if (numberMatches.length > 0) {
    const numberMatch = numberMatches[0];
    originalExpression = numberMatch[0];
    const numberStr = numberMatch[1];
    const cleanNum = numberStr.replace(/[\/／〜～~-].*/, "");
    if (cleanNum.length >= 5) {
      return {
        hasNumber: false,
        isNonScalable: true
      };
    }
    if (/[〜～~-]/.test(numberStr)) {
      const rangeParts = numberStr.split(/[〜～~-]/);
      if (rangeParts.length === 2) {
        const min = parseNumber(rangeParts[0].trim());
        const max = parseNumber(rangeParts[1].trim());
        if (min !== void 0 && max !== void 0) {
          quantityRange = { min: Math.min(min, max), max: Math.max(min, max) };
          quantity = (min + max) / 2;
        }
      }
    } else {
      quantity = parseNumber(numberStr);
    }
    const beforeNumber = preNormalized.substring(0, numberMatch.index || 0);
    const afterNumber = preNormalized.substring(
      (numberMatch.index || 0) + numberMatch[0].length
    );
    const beforeLower = beforeNumber.trim().toLowerCase();
    const afterLower = afterNumber.trim().toLowerCase();
    let unitMatch = extractUnitAdjacent(beforeLower, afterLower);
    if (!unitMatch) {
      const fallback = extractUnit(beforeNumber + " " + afterNumber) || extractUnit(preNormalized);
      if (fallback) {
        unitMatch = { ...fallback, matched: fallback.unitText, side: "after" };
      }
    }
    if (unitMatch) {
      unit = unitMatch.unit;
      unitText = unitMatch.unitText;
      if (unitMatch.side === "after") {
        const afterTrim = afterNumber.trim();
        const rest = afterTrim.slice(unitMatch.matched.length).trim();
        const m3 = rest.match(/^([〜～-]?[一-龯ぁ-ゔァ-ヴーa-zA-Z]+(?:で)?)?/);
        if (m3 && m3[0]) suffix = m3[0].trim() || void 0;
      }
    }
    if (quantity !== void 0 && !quantityRange && /[〜～~-]/.test(afterNumber)) {
      const m3 = afterNumber.match(/[〜～~-]\s*(\d+(?:\.\d+)?(?:[\/／]\d+)?)/);
      if (m3) {
        const nextVal = parseNumber(m3[1]);
        if (nextVal !== void 0) {
          const minV = Math.min(quantity, nextVal);
          const maxV = Math.max(quantity, nextVal);
          quantityRange = { min: minV, max: maxV };
          quantity = (minV + maxV) / 2;
        }
      }
    }
    const beforeRaw = beforeNumber;
    if (beforeRaw && /\S$/.test(beforeRaw)) {
      let beforeForPrefix = beforeRaw;
      if (unitMatch && unitMatch.side === "before") {
        const rawTrim = beforeRaw.trimEnd();
        if (rawTrim.toLowerCase().endsWith(unitMatch.matched)) {
          beforeForPrefix = rawTrim.slice(
            0,
            rawTrim.length - unitMatch.matched.length
          );
        }
      }
      const m3 = beforeForPrefix.match(/([一-龯ぁ-ゔァ-ヴーa-zA-Z]+)$/);
      if (m3 && m3[1]) prefix = m3[1];
    }
  }
  return {
    quantity,
    quantityRange,
    unit,
    unitText,
    prefix,
    suffix,
    hasNumber: quantity !== void 0 || quantityRange !== void 0,
    isNonScalable: quantity === void 0 && quantityRange === void 0,
    originalExpression
  };
}
function extractUnit(text) {
  const haystack = text.toLowerCase();
  for (const [unitStrLower, canonicalUnit] of SORTED_UNIT_ENTRIES) {
    if (haystack.includes(unitStrLower)) {
      return {
        unit: canonicalUnit,
        unitText: unitDisplayJa[canonicalUnit] || unitStrLower
      };
    }
  }
  return void 0;
}
function extractUnitAdjacent(beforeLowerTrim, afterLowerTrim) {
  const countStarts = [
    ["\u500B", "piece"],
    ["\u672C", "stalk"],
    ["\u679A", "slice"],
    ["\u4E01", "block"],
    ["\u7247", "clove"],
    ["\u7F36", "can"],
    ["\u30D1\u30C3\u30AF", "pack"],
    ["\u888B", "bag"],
    ["\u675F", "bunch"],
    ["\u682A", "head"],
    ["\u5C3E", "tail"],
    ["\u7C92", "grain"]
  ];
  for (const [jp, cu] of countStarts) {
    if (afterLowerTrim.startsWith(jp)) {
      return {
        unit: cu,
        unitText: unitDisplayJa[cu] || jp,
        matched: jp,
        side: "after"
      };
    }
  }
  for (const [unitStrLower, canonicalUnit] of SORTED_UNIT_ENTRIES) {
    if (afterLowerTrim.startsWith(unitStrLower) || beforeLowerTrim.endsWith(unitStrLower)) {
      return {
        unit: canonicalUnit,
        unitText: unitDisplayJa[canonicalUnit] || unitStrLower,
        matched: unitStrLower,
        side: afterLowerTrim.startsWith(unitStrLower) ? "after" : "before"
      };
    }
  }
  if (afterLowerTrim.startsWith("\u3053") || beforeLowerTrim.endsWith("\u3053")) {
    return {
      unit: "piece",
      unitText: unitDisplayJa["piece"],
      matched: "\u3053",
      side: afterLowerTrim.startsWith("\u3053") ? "after" : "before"
    };
  }
  return void 0;
}

// src/format.ts
function convertForDisplay(value, unit) {
  if (unit === "tsp") {
    const tbspEq = value / 3;
    if (tbspEq >= 4) {
      return { value: tbspEq * 15, unit: "ml" };
    }
    if (value >= 3) {
      return { value: tbspEq, unit: "tbsp" };
    }
    return { value, unit };
  }
  if (unit === "tbsp") {
    if (value >= 4) {
      return { value: value * 15, unit: "ml" };
    }
    return { value, unit };
  }
  return { value, unit };
}
function toNaturalJapaneseFraction(value, unit) {
  const isSpoonOrCup = unit === "tsp" || unit === "tbsp" || unit === "cup";
  const clampForLarge = (v4) => v4 >= 10 ? Math.floor(v4) : v4;
  if (isSpoonOrCup) {
    const rounded2 = Math.round(value * 4) / 4;
    const v4 = clampForLarge(rounded2);
    return Number.isInteger(v4) ? `${Math.trunc(v4)}` : `${v4}`;
  }
  let rounded;
  switch (unit) {
    case "g":
    case "ml":
    case "mg":
    case "l":
    case "kg":
      rounded = Math.round(value * 10) / 10;
      break;
    default:
      rounded = Math.round(value * 10) / 10;
      break;
  }
  const v3 = clampForLarge(rounded);
  return Number.isInteger(v3) ? `${Math.trunc(v3)}` : `${v3}`;
}
function formatQuantity(value, unit) {
  if (value == null) return "";
  const { value: dispValue, unit: dispUnit } = convertForDisplay(value, unit);
  const frac = toNaturalJapaneseFraction(dispValue, dispUnit);
  const unitStr = dispUnit ? unitDisplayJa[dispUnit] ?? "" : "";
  if (dispUnit === "pinch") {
    const intLike = Math.abs(dispValue - Math.round(dispValue)) < 1e-6;
    if (Math.abs(value - 1) < 1e-6) return "\u3072\u3068\u3064\u307E\u307F";
    if (intLike) return `${Math.round(dispValue)}\u3064\u307E\u307F`;
    return `${frac} ${unitStr}`.trim();
  }
  if (dispUnit === "tbsp" || dispUnit === "tsp") {
    return `${unitStr}${frac}`;
  }
  return `${frac}${unitStr ? " " + unitStr : ""}`.trim();
}
function formatQuantityRange(min, max, unit) {
  const maxDisp = convertForDisplay(max, unit);
  let displayUnit = maxDisp.unit;
  let minValue;
  let maxValue;
  if (displayUnit === "ml") {
    const toMl = (v3) => {
      if (unit === "ml") return v3;
      if (unit === "tbsp") return v3 * 15;
      if (unit === "tsp") return v3 / 3 * 15;
      return v3;
    };
    minValue = toMl(min);
    maxValue = toMl(max);
  } else if (displayUnit === "tbsp") {
    const toTbsp = (v3) => {
      if (unit === "tbsp") return v3;
      if (unit === "tsp") return v3 / 3;
      return v3;
    };
    minValue = toTbsp(min);
    maxValue = toTbsp(max);
  } else if (displayUnit === "tsp") {
    minValue = min;
    maxValue = max;
  } else {
    const minStr2 = toNaturalJapaneseFraction(min, unit);
    const maxStr2 = toNaturalJapaneseFraction(max, unit);
    const unitStr2 = unit ? unitDisplayJa[unit] ?? "" : "";
    return `${minStr2}\u301C${maxStr2}${unitStr2 ? " " + unitStr2 : ""}`.trim();
  }
  const minStr = toNaturalJapaneseFraction(minValue, displayUnit);
  const maxStr = toNaturalJapaneseFraction(maxValue, displayUnit);
  const unitStr = displayUnit ? unitDisplayJa[displayUnit] ?? "" : "";
  if (displayUnit === "tbsp" || displayUnit === "tsp") {
    return `${unitStr}${minStr}\u301C${maxStr}`;
  }
  return `${minStr}\u301C${maxStr}${unitStr ? " " + unitStr : ""}`.trim();
}
function formatRecipeYield(y3) {
  if (!y3) return "";
  const parts = [];
  if (y3.prefix) parts.push(y3.prefix.trim());
  let core = "";
  if (y3.quantityRange) {
    if (y3.unitText) {
      const minStr = toNaturalJapaneseFraction(y3.quantityRange.min, y3.unit);
      const maxStr = toNaturalJapaneseFraction(y3.quantityRange.max, y3.unit);
      core = `${minStr}\u301C${maxStr}${y3.unitText}`;
    } else {
      core = formatQuantityRange(
        y3.quantityRange.min,
        y3.quantityRange.max,
        y3.unit
      );
    }
  } else if (y3.quantity != null) {
    if (y3.unitText) {
      const v3 = toNaturalJapaneseFraction(y3.quantity, y3.unit);
      core = `${v3}${y3.unitText}`;
    } else {
      core = formatQuantity(y3.quantity, y3.unit);
    }
  }
  if (core) parts.push(core);
  if (y3.suffix) parts.push(y3.suffix.trim());
  let txt = parts.join("").trim();
  let secondary = "";
  if (y3.secondaryQuantityRange) {
    secondary = formatQuantityRange(
      y3.secondaryQuantityRange.min,
      y3.secondaryQuantityRange.max,
      y3.secondaryUnit
    );
  } else if (y3.secondaryQuantity != null) {
    secondary = formatQuantity(y3.secondaryQuantity, y3.secondaryUnit);
  }
  if (secondary) {
    const secTxt = `${y3.secondaryPrefix ?? ""}${secondary}${y3.secondarySuffix ?? ""}`;
    txt = `${txt}\uFF08${secTxt}\uFF09`;
  }
  return txt;
}

// src/domain.ts
var Ingredient = class _Ingredient {
  constructor(data) {
    this.data = data;
  }
  static parse(line) {
    return new _Ingredient(parseIngredientLine(line));
  }
  // Convenience field getters
  get originalText() {
    return this.data.originalText;
  }
  get name() {
    return this.data.name;
  }
  get quantity() {
    return this.data.quantity;
  }
  get quantityRange() {
    return this.data.quantityRange;
  }
  get unit() {
    return this.data.unit;
  }
  get unitText() {
    return this.data.unitText;
  }
  get prefix() {
    return this.data.prefix;
  }
  get suffix() {
    return this.data.suffix;
  }
  get secondaryQuantity() {
    return this.data.secondaryQuantity;
  }
  get secondaryQuantityRange() {
    return this.data.secondaryQuantityRange;
  }
  get secondaryUnit() {
    return this.data.secondaryUnit;
  }
  get secondaryUnitText() {
    return this.data.secondaryUnitText;
  }
  get secondaryPrefix() {
    return this.data.secondaryPrefix;
  }
  get secondarySuffix() {
    return this.data.secondarySuffix;
  }
  get scalable() {
    return this.data.scalable;
  }
  scale(factor) {
    const ing = this.data;
    if (!ing.scalable) return new _Ingredient(ing);
    let quantity = ing.quantity;
    let quantityRange = ing.quantityRange;
    if (typeof quantity === "number") {
      quantity = roundForUnit(quantity * factor, ing.unit);
    }
    if (quantityRange) {
      quantityRange = {
        min: roundForUnit(quantityRange.min * factor, ing.unit),
        max: roundForUnit(quantityRange.max * factor, ing.unit)
      };
    }
    let secondaryQuantity = ing.secondaryQuantity;
    let secondaryQuantityRange = ing.secondaryQuantityRange;
    if (typeof secondaryQuantity === "number") {
      secondaryQuantity = roundForUnit(
        secondaryQuantity * factor,
        ing.secondaryUnit
      );
    }
    if (secondaryQuantityRange) {
      secondaryQuantityRange = {
        min: roundForUnit(
          secondaryQuantityRange.min * factor,
          ing.secondaryUnit
        ),
        max: roundForUnit(
          secondaryQuantityRange.max * factor,
          ing.secondaryUnit
        )
      };
    }
    const scaled = {
      ...ing,
      quantity,
      quantityRange,
      secondaryQuantity,
      secondaryQuantityRange
    };
    return new _Ingredient(scaled);
  }
  format() {
    const ing = this.data;
    let primaryCore = "";
    if (ing.quantityRange) {
      primaryCore = formatQuantityRange(
        ing.quantityRange.min,
        ing.quantityRange.max,
        ing.unit
      );
    } else {
      primaryCore = formatQuantity(ing.quantity, ing.unit);
    }
    const primary = `${ing.prefix ?? ""}${primaryCore}${ing.suffix ?? ""}`.trim();
    let secondary = "";
    if (ing.secondaryQuantityRange) {
      const secondaryCore = formatQuantityRange(
        ing.secondaryQuantityRange.min,
        ing.secondaryQuantityRange.max,
        ing.secondaryUnit
      );
      secondary = `${ing.secondaryPrefix ?? ""}${secondaryCore}${ing.secondarySuffix ?? ""}`;
    } else if (ing.secondaryQuantity != null) {
      const secondaryCore = formatQuantity(
        ing.secondaryQuantity,
        ing.secondaryUnit
      );
      secondary = `${ing.secondaryPrefix ?? ""}${secondaryCore}${ing.secondarySuffix ?? ""}`;
    }
    if (secondary) return `${primary}\uFF08${secondary}\uFF09`.trim();
    return primary.trim();
  }
  toJSON() {
    return { ...this.data };
  }
};
var Yield = class _Yield {
  constructor(data) {
    this.data = data;
  }
  static parse(text) {
    return new _Yield(parseRecipeYield(text));
  }
  // Accessors mirror NormalizedYield fields
  get originalText() {
    return this.data?.originalText;
  }
  get quantity() {
    return this.data?.quantity;
  }
  get quantityRange() {
    return this.data?.quantityRange;
  }
  get unit() {
    return this.data?.unit;
  }
  get unitText() {
    return this.data?.unitText;
  }
  get prefix() {
    return this.data?.prefix;
  }
  get suffix() {
    return this.data?.suffix;
  }
  get secondaryQuantity() {
    return this.data?.secondaryQuantity;
  }
  get secondaryQuantityRange() {
    return this.data?.secondaryQuantityRange;
  }
  get secondaryUnit() {
    return this.data?.secondaryUnit;
  }
  get secondaryUnitText() {
    return this.data?.secondaryUnitText;
  }
  get secondaryPrefix() {
    return this.data?.secondaryPrefix;
  }
  get secondarySuffix() {
    return this.data?.secondarySuffix;
  }
  get scalable() {
    return this.data?.scalable;
  }
  format() {
    return formatRecipeYield(this.data);
  }
  toJSON() {
    return this.data ? { ...this.data } : void 0;
  }
};
var Recipe = class _Recipe {
  constructor(data) {
    this.data = data;
  }
  static fromJsonLd(raw) {
    return new _Recipe(normalizeRecipe(raw));
  }
  get name() {
    return this.data.name;
  }
  get imageUrl() {
    return this.data.imageUrl;
  }
  get author() {
    return this.data.author;
  }
  get baseServings() {
    return this.data.baseServings;
  }
  get ingredients() {
    return this.data.ingredients.map((i4) => new Ingredient(i4));
  }
  get instructions() {
    return this.data.instructions;
  }
  get times() {
    return this.data.times;
  }
  get nutrition() {
    return this.data.nutrition;
  }
  get yield() {
    return new Yield(parseRecipeYield(this.data.yieldText));
  }
  formatYield() {
    return this.yield.format();
  }
  // Returns new Recipe instance (non-destructive)
  scale(toServings) {
    const base = this.data.baseServings && this.data.baseServings > 0 ? this.data.baseServings : 2;
    const factor = toServings / base;
    const scaledIngredients = this.data.ingredients.map(
      (i4) => new Ingredient(i4).scale(factor).toJSON()
    );
    const scaled = {
      ...this.data,
      ingredients: scaledIngredients,
      // baseServings は初期値を維持（連続スケール時のドリフト防止）
      baseServings: this.data.baseServings
    };
    return new _Recipe(scaled);
  }
  toJSON() {
    return { ...this.data };
  }
};

// node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var s2 = c2.__;
function p2(n2, t3) {
  c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
  var u4 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n2 >= u4.__.length && u4.__.push({}), u4.__[n2];
}
function d2(n2) {
  return o2 = 1, h2(D2, n2);
}
function h2(n2, u4, i4) {
  var o3 = p2(t2++, 2);
  if (o3.t = n2, !o3.__c && (o3.__ = [i4 ? i4(u4) : D2(void 0, u4), function(n3) {
    var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
    t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
  }], o3.__c = r2, !r2.__f)) {
    var f4 = function(n3, t3, r3) {
      if (!o3.__c.__H) return true;
      var u5 = o3.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u5.every(function(n4) {
        return !n4.__N;
      })) return !c3 || c3.call(this, n3, t3, r3);
      var i5 = o3.__c.props !== n3;
      return u5.forEach(function(n4) {
        if (n4.__N) {
          var t4 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i5 = true);
        }
      }), c3 && c3.call(this, n3, t3, r3) || i5;
    };
    r2.__f = true;
    var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n3, t3, r3) {
      if (this.__e) {
        var u5 = c3;
        c3 = void 0, f4(n3, t3, r3), c3 = u5;
      }
      e3 && e3.call(this, n3, t3, r3);
    }, r2.shouldComponentUpdate = f4;
  }
  return o3.__N || o3.__;
}
function y2(n2, u4) {
  var i4 = p2(t2++, 3);
  !c2.__s && C2(i4.__H, u4) && (i4.__ = n2, i4.u = u4, r2.__H.__h.push(i4));
}
function T2(n2, r3) {
  var u4 = p2(t2++, 7);
  return C2(u4.__H, r3) && (u4.__ = n2(), u4.__H = r3, u4.__h = n2), u4.__;
}
function j2() {
  for (var n2; n2 = f2.shift(); ) if (n2.__P && n2.__H) try {
    n2.__H.__h.forEach(z2), n2.__H.__h.forEach(B2), n2.__H.__h = [];
  } catch (t3) {
    n2.__H.__h = [], c2.__e(t3, n2.__v);
  }
}
c2.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, c2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
}, c2.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i4 = (r2 = n2.__c).__H;
  i4 && (u2 === r2 ? (i4.__h = [], r2.__h = [], i4.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i4.__h.forEach(z2), i4.__h.forEach(B2), i4.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n2) {
  v2 && v2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.forEach(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = void 0;
  })), u2 = r2 = null;
}, c2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.forEach(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], c2.__e(r3, n3.__v);
    }
  }), l2 && l2(n2, t3);
}, c2.unmount = function(n2) {
  m2 && m2(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.forEach(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w2(n2) {
  var t3, r3 = function() {
    clearTimeout(u4), k2 && cancelAnimationFrame(t3), setTimeout(n2);
  }, u4 = setTimeout(r3, 35);
  k2 && (t3 = requestAnimationFrame(r3));
}
function z2(n2) {
  var t3 = r2, u4 = n2.__c;
  "function" == typeof u4 && (n2.__c = void 0, u4()), r2 = t3;
}
function B2(n2) {
  var t3 = r2;
  n2.__c = n2.__(), r2 = t3;
}
function C2(n2, t3) {
  return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
    return t4 !== n2[r3];
  });
}
function D2(n2, t3) {
  return "function" == typeof t3 ? t3(n2) : t3;
}

// src/ui/styles.ts
var SHARED_STYLES = {
  // 基本的なコンテナスタイル
  CONTAINER_BASE: `
    font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif;
    line-height: 1.6;
    color: #333;
    background: #fff;
    box-sizing: border-box;
  `,
  // 基本的なiframe内で使用する通常のスタイル
  IFRAME_BASE: `
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  `,
  // RecipeSidebarAppの共通スタイル
  RECIPE_APP_STYLES: `
    .rb-body { 
      flex: 1; 
      overflow: visible; 
      color: #111; 
      background: #fff;
      box-sizing: border-box;
      display: block;
      font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif;
    }
    
    .rb-header {
      display: flex;
      justify-content: flex-end;
      padding: 8px 12px;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .rb-close-button {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: #f8f9fa;
      color: #666;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-family: inherit;
      line-height: 1;
    }
    
    .rb-close-button:hover {
      background: #e9ecef;
      color: #333;
      transform: scale(1.1);
    }
    
    .rb-header-image {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      margin: 0;
      padding: 0;
    }
    
    .rb-header-image .rb-image { 
      width: 100%; 
      height: 100%;
      object-fit: cover; 
      display: block;
      margin: 0;
      padding: 0;
    }
    
    .rb-title-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 15px;
      display: flex;
      align-items: flex-end;
    }
    
    .rb-title-overlay .rb-name {
      font-size: 20px; 
      font-weight: 800; 
      color: #fff;
      line-height: 1.2;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
      font-family: inherit;
      letter-spacing: 0.5px;
    }
    
    .rb-body > .rb-name { 
      font-size: 24px; 
      font-weight: 600; 
      margin: 20px 20px 16px 20px; 
      color: #333;
      line-height: 1.3;
      display: block;
      font-family: inherit;
    }
    
    .rb-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 20px 8px 20px;
      flex-wrap: nowrap;
      gap: 12px;
      min-height: 32px;
    }
    
    .rb-body .rb-section-title { 
      font-weight: 700; 
      margin: 0; 
      color: #333;
      font-size: 18px;
      display: block;
      font-family: inherit;
      flex-shrink: 0;
    }
    
    .rb-body .rb-yield { 
      margin: 0; 
      color: #333; 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      font-family: inherit;
      font-size: 14px;
      flex-shrink: 0;
      white-space: nowrap;
    }
    
    .rb-body .rb-yield .rb-yield-inline { 
      display: inline-flex; 
      align-items: center; 
      gap: 8px; 
    }
    
    .rb-body .rb-yield .rb-yield-display {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    
    .rb-body .rb-yield .rb-btn { 
      width: 28px; 
      height: 28px; 
      border: 1px solid #ddd; 
      border-radius: 4px; 
      background: #fff; 
      cursor: pointer; 
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #333;
      font-family: inherit;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }
    
    .rb-body .rb-yield .rb-btn-round {
      border-radius: 50%;
      font-weight: 600;
    }
    
    .rb-body .rb-yield .rb-btn:hover {
      background: #f8f9fa;
      transform: scale(1.05);
    }
    
    .rb-body .rb-yield .rb-num { 
      width: 36px;
      max-width: 36px;
      text-align: center; 
      height: 24px; 
      border: none;
      border-radius: 0;
      background: transparent;
      color: #333;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      display: inline-block;
      padding: 2px 4px;
      line-height: 1.2;
      font-weight: 500;
    }
    .rb-body .rb-list { 
      list-style: none; 
      padding: 0 20px; 
      margin: 0 0 12px 0; 
      display: block;
    }
    .rb-body .rb-list li { 
      display: flex; 
      justify-content: space-between; 
      gap: 8px; 
      padding: 8px 0; 
      border-bottom: 1px solid #f0f0f0;
      color: #333;
      font-family: inherit;
      box-sizing: border-box;
    }
    .rb-body .rb-list .rb-qty { 
      color: #666; 
      font-weight: 500;
      font-family: inherit;
    }
    .rb-body .rb-steps { 
      padding-left: 40px; 
      margin: 0 20px 20px 20px;
      color: #333;
      display: block;
      font-family: inherit;
      list-style-type: decimal;
      counter-reset: recipe-step;
    }
    .rb-body .rb-steps li { 
      margin: 8px 0; 
      color: #333;
      line-height: 1.6;
      display: list-item;
      font-family: inherit;
      list-style-type: decimal;
      padding-left: 8px;
    }
  `
};
function getShadowDOMContainerStyles() {
  return `
    :host {
      ${SHARED_STYLES.CONTAINER_BASE}
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    #recipe-sidebar-root {
      height: 100%;
      overflow: auto;
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      ${SHARED_STYLES.CONTAINER_BASE}
    }
    
    ${SHARED_STYLES.RECIPE_APP_STYLES}
  `;
}
function getIframeContainerStyles() {
  return getShadowDOMContainerStyles();
}
function getMobileContainerStyles() {
  return `
    #recipe-mobile-container { 
      ${SHARED_STYLES.CONTAINER_BASE}
      min-height: 100vh; 
      display: block; 
      width: 100%;
      overflow-x: hidden;
      overflow-y: visible;
      padding-bottom: 80px; /* \u30D5\u30C3\u30BF\u30FC\u30DC\u30BF\u30F3\u306E\u305F\u3081\u306E\u30B9\u30DA\u30FC\u30B9 */
      position: relative;
    }
    
    /* \u30E2\u30D0\u30A4\u30EB\u5411\u3051\u306E\u7279\u5225\u306A\u30B9\u30BF\u30A4\u30EB\u4FEE\u6B63 */
    #recipe-mobile-container .rb-body { 
      flex: none; 
      overflow: visible; 
      color: #111; 
      background: #fff;
      box-sizing: border-box;
      display: block;
      font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif;
    }
    
    /* \u753B\u50CF\u3068\u30BF\u30A4\u30C8\u30EB\u90E8\u5206\u3092\u56FA\u5B9A */
    #recipe-mobile-container .rb-header-image {
      position: sticky;
      top: 100px;
      width: 100%;
      height: 250px;
      overflow: hidden;
      margin: 0;
      padding: 0;
      z-index: 10;
      background: #fff;
    }
    
    #recipe-mobile-container .rb-header-image .rb-image { 
      width: 100%; 
      height: 100%;
      object-fit: cover; 
      display: block;
      margin: 0;
      padding: 0;
    }
    
    #recipe-mobile-container .rb-title-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      padding: 24px;
      display: flex;
      align-items: flex-end;
    }
    
    #recipe-mobile-container .rb-title-overlay .rb-name {
      font-size: 28px; 
      font-weight: 800; 
      color: #fff;
      line-height: 1.2;
      margin: 0;
      text-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.8),
        0 1px 3px rgba(0, 0, 0, 0.9),
        1px 1px 0 rgba(0, 0, 0, 0.7),
        -1px -1px 0 rgba(0, 0, 0, 0.7),
        1px -1px 0 rgba(0, 0, 0, 0.7),
        -1px 1px 0 rgba(0, 0, 0, 0.7);
      font-family: inherit;
      letter-spacing: 0.5px;
      backdrop-filter: blur(2px);
    }
    
    /* \u6750\u6599\u30D8\u30C3\u30C0\u30FC\u3092\u30B9\u30C6\u30A3\u30C3\u30AD\u30FC\u306B\uFF08\u753B\u50CF\u3042\u308A\u306E\u5834\u5408\uFF09 */
    #recipe-mobile-container .rb-header-image + .rb-section-header {
      position: sticky;
      top: 250px;
      background: #fff;
      z-index: 5;
      margin: 0;
      padding: 16px 20px 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    /* \u6750\u6599\u30D8\u30C3\u30C0\u30FC\u3092\u30B9\u30C6\u30A3\u30C3\u30AD\u30FC\u306B\uFF08\u753B\u50CF\u306A\u3057\u306E\u5834\u5408\uFF09 */
    #recipe-mobile-container .rb-name + .rb-section-header {
      position: sticky;
      top: 108px; /* \u30BF\u30A4\u30C8\u30EB\u9AD8\u3055\u5206 */
      background: #fff;
      z-index: 5;
      margin: 0;
      padding: 16px 20px 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    /* \u4F5C\u308A\u65B9\u30D8\u30C3\u30C0\u30FC\u3082\u30B9\u30C6\u30A3\u30C3\u30AD\u30FC\u306B\uFF08\u753B\u50CF\u3042\u308A\u306E\u5834\u5408\uFF09 */
    #recipe-mobile-container .rb-header-image ~ .rb-instructions-header {
      position: sticky;
      top: 250px;
      background: #fff;
      z-index: 5;
      margin: 20px 0 0 0;
      padding: 16px 20px 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* \u4F5C\u308A\u65B9\u30D8\u30C3\u30C0\u30FC\u3082\u30B9\u30C6\u30A3\u30C3\u30AD\u30FC\u306B\uFF08\u753B\u50CF\u306A\u3057\u306E\u5834\u5408\uFF09 */
    #recipe-mobile-container .rb-name ~ .rb-instructions-header {
      position: sticky;
      top: 108px; /* \u30BF\u30A4\u30C8\u30EB\u9AD8\u3055\u5206 */
      background: #fff;
      z-index: 5;
      margin: 20px 0 0 0;
      padding: 16px 20px 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    #recipe-mobile-container .rb-instructions-header .rb-section-title {
      font-weight: 700; 
      margin: 0; 
      color: #333;
      font-size: 18px;
      display: block;
      font-family: inherit;
    }
    
    /* \u753B\u50CF\u306A\u3057\u306E\u30BF\u30A4\u30C8\u30EB\u90E8\u5206\u306E\u30B9\u30BF\u30A4\u30EB\u8ABF\u6574 */
    #recipe-mobile-container .rb-name {
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 10;
      font-size: 28px; 
      font-weight: 700; 
      margin: 0; 
      padding: 20px;
      color: #333;
      line-height: 1.3;
      display: block;
      font-family: inherit;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    #recipe-mobile-container ${SHARED_STYLES.RECIPE_APP_STYLES}
    

    
    /* \u30E2\u30D0\u30A4\u30EB\u7528\u30D5\u30C3\u30BF\u30FC\u30DC\u30BF\u30F3\u30B9\u30BF\u30A4\u30EB */
    .recipe-mobile-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      border-top: 1px solid #eee;
      padding: 12px 20px;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
      z-index: 2147483648;
      box-sizing: border-box;
    }
    
    .recipe-mobile-footer button {
      width: 100%;
      background: #007AFF;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      ${SHARED_STYLES.IFRAME_BASE}
    }
    
    .recipe-mobile-footer button:hover {
      background: #0056b3;
    }
    
    /* \u30EC\u30B7\u30D4\u30D3\u30E5\u30FC\u306B\u623B\u308B\u30DC\u30BF\u30F3\u30B9\u30BF\u30A4\u30EB */
    .recipe-return-button {
      ${SHARED_STYLES.IFRAME_BASE}
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
      background: #ff6b35;
      color: white;
      border: none;
      border-radius: 25px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      transition: all 0.2s ease;
      font-family: ui-sans-serif, -apple-system, 'Segoe UI', Roboto, sans-serif;
    }
    
    .recipe-return-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
    }
  `;
}
function injectStyles(styleId, cssContent) {
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = cssContent;
  document.head.appendChild(style);
}

// node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f3 = 0;
var i3 = Array.isArray;
function u3(e3, t3, n2, o3, i4, u4) {
  t3 || (t3 = {});
  var a3, c3, p3 = t3;
  if ("ref" in p3) for (c3 in p3 = {}, t3) "ref" == c3 ? a3 = t3[c3] : p3[c3] = t3[c3];
  var l3 = { type: e3, props: p3, key: n2, ref: a3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i4, __self: u4 };
  if ("function" == typeof e3 && (a3 = e3.defaultProps)) for (c3 in a3) void 0 === p3[c3] && (p3[c3] = a3[c3]);
  return l.vnode && l.vnode(l3), l3;
}

// src/ui/RecipeSidebarApp.tsx
function clampToPeople(n2) {
  return Math.max(1, Math.round(n2));
}
function RecipeSidebarApp({
  initialRecipe,
  isMobile = false
}) {
  y2(() => {
    const STYLE_ID = "recipe-sidebar-app-styles";
    const styles = isMobile ? getMobileContainerStyles() : getIframeContainerStyles();
    injectStyles(STYLE_ID, styles);
  }, [isMobile]);
  const yieldParsed = T2(() => initialRecipe.yield, [initialRecipe]);
  const yieldText = T2(() => initialRecipe.formatYield(), [initialRecipe]);
  const isInteractiveRange = Boolean(
    (yieldParsed.quantityRange || yieldParsed.quantity != null) && (yieldParsed.unit === "cup" || yieldParsed.unit === "serving")
  );
  const isRange = Boolean(yieldParsed.quantityRange);
  const [minVal, setMinVal] = d2(() => {
    if (!isInteractiveRange) return 1;
    if (yieldParsed.quantityRange) return Math.round(yieldParsed.quantityRange.min);
    if (yieldParsed.quantity != null) return Math.round(yieldParsed.quantity);
    return 1;
  });
  const [maxVal, setMaxVal] = d2(() => {
    if (!isInteractiveRange) return 1;
    if (yieldParsed.quantityRange) return Math.round(yieldParsed.quantityRange.max);
    if (yieldParsed.quantity != null) return Math.round(yieldParsed.quantity);
    return 1;
  });
  const displayedRecipe = T2(() => {
    if (!isInteractiveRange) return initialRecipe;
    const min = clampToPeople(minVal);
    const max = clampToPeople(maxVal);
    const mid = (min + max) / 2;
    const base = Math.round(initialRecipe.baseServings ?? 2);
    const factorServings = Math.max(1, Math.round(base * (mid / base)));
    return initialRecipe.scale(factorServings);
  }, [initialRecipe, isInteractiveRange, minVal, maxVal]);
  return /* @__PURE__ */ u3(k, { children: /* @__PURE__ */ u3("div", { class: "rb-body", children: [
    /* @__PURE__ */ u3("div", { class: "rb-header", children: /* @__PURE__ */ u3(
      "button",
      {
        class: "rb-close-button",
        "data-action": "close",
        onClick: () => {
          const event = new CustomEvent("closeSidebar", { bubbles: true });
          const currentElement = document.querySelector("#recipe-sidebar-container");
          if (currentElement) {
            currentElement.dispatchEvent(event);
          }
        },
        children: "\xD7"
      }
    ) }),
    displayedRecipe.imageUrl && /* @__PURE__ */ u3("div", { class: "rb-header-image", children: [
      /* @__PURE__ */ u3("img", { class: "rb-image", src: displayedRecipe.imageUrl }),
      /* @__PURE__ */ u3("div", { class: "rb-title-overlay", children: /* @__PURE__ */ u3("h1", { class: "rb-name", children: displayedRecipe.name || "\u30EC\u30B7\u30D4" }) })
    ] }),
    !displayedRecipe.imageUrl && /* @__PURE__ */ u3("div", { class: "rb-name", children: displayedRecipe.name || "\u30EC\u30B7\u30D4" }),
    /* @__PURE__ */ u3("div", { class: "rb-section-header", children: [
      /* @__PURE__ */ u3("div", { class: "rb-section-title", children: "\u6750\u6599" }),
      yieldText && /* @__PURE__ */ u3("div", { class: "rb-yield", children: !isInteractiveRange ? /* @__PURE__ */ u3("span", { children: yieldText }) : /* @__PURE__ */ u3("span", { class: "rb-yield-inline", children: [
        /* @__PURE__ */ u3(
          "button",
          {
            class: "rb-btn rb-btn-round",
            onClick: () => {
              setMinVal((v3) => clampToPeople(v3 - 1));
              setMaxVal((v3) => clampToPeople(v3 - 1));
            },
            children: "\u2212"
          }
        ),
        /* @__PURE__ */ u3("span", { class: "rb-yield-display", children: [
          yieldParsed.prefix && /* @__PURE__ */ u3("span", { children: yieldParsed.prefix }),
          /* @__PURE__ */ u3(
            "input",
            {
              class: "rb-num",
              type: "number",
              value: String(minVal),
              onInput: (e3) => {
                const v3 = clampToPeople(
                  parseFloat(e3.target.value) || minVal
                );
                setMinVal(v3);
                if (!isRange) setMaxVal(v3);
              }
            }
          ),
          isRange && /* @__PURE__ */ u3("span", { children: "\u301C" }),
          isRange && /* @__PURE__ */ u3(
            "input",
            {
              class: "rb-num",
              type: "number",
              value: String(maxVal),
              onInput: (e3) => setMaxVal(
                clampToPeople(
                  parseFloat(e3.target.value) || maxVal
                )
              )
            }
          ),
          yieldParsed.unitText && /* @__PURE__ */ u3("span", { children: yieldParsed.unitText }),
          yieldParsed.suffix && /* @__PURE__ */ u3("span", { children: yieldParsed.suffix })
        ] }),
        /* @__PURE__ */ u3(
          "button",
          {
            class: "rb-btn rb-btn-round",
            onClick: () => {
              setMinVal((v3) => clampToPeople(v3 + 1));
              setMaxVal((v3) => clampToPeople(v3 + 1));
            },
            children: "+"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ u3("ul", { class: "rb-list", children: displayedRecipe.ingredients.map((ing) => /* @__PURE__ */ u3("li", { children: [
      /* @__PURE__ */ u3("span", { children: ing.name || ing.originalText }),
      /* @__PURE__ */ u3("span", { class: "rb-qty", children: ing.format() || "" })
    ] })) }),
    /* @__PURE__ */ u3("div", { class: "rb-instructions-header", children: /* @__PURE__ */ u3("div", { class: "rb-section-title", children: "\u4F5C\u308A\u65B9" }) }),
    /* @__PURE__ */ u3("ol", { class: "rb-steps", children: displayedRecipe.instructions.map((step) => /* @__PURE__ */ u3("li", { children: step })) })
  ] }) });
}

// extension/src/content-mobile.tsx
function renderRecipeFromJsonLd(jsonLd) {
  try {
    const normalized = Recipe.fromJsonLd(jsonLd);
    const container = document.getElementById("recipe-mobile-container");
    if (!container) {
      console.error("recipe-mobile-container not found");
      return;
    }
    console.log("render RecipeSidebarApp");
    G(
      /* @__PURE__ */ u3(
        RecipeSidebarApp,
        {
          initialRecipe: normalized,
          isMobile: true
        }
      ),
      container
    );
  } catch (_2) {
  }
}
window.renderRecipeData = function(recipeJson) {
  try {
    console.log("renderRecipeData called with:", recipeJson);
    renderRecipeFromJsonLd(recipeJson);
  } catch (e3) {
    console.error("renderRecipeData error:", e3);
  }
};
console.log("renderRecipeData");
console.log(window.renderRecipeData);
//# sourceMappingURL=content-mobile.js.map
