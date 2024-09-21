(function () {
  'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
  function _assertClassBrand(e, t, n) {
    if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
    throw new TypeError("Private element is not present on this object");
  }
  function _assertThisInitialized(e) {
    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e;
  }
  function _callSuper(t, o, e) {
    return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, [], _getPrototypeOf(t).constructor) : o.apply(t, e));
  }
  function _checkPrivateRedeclaration(e, t) {
    if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _classPrivateFieldGet2(s, a) {
    return s.get(_assertClassBrand(s, a));
  }
  function _classPrivateFieldInitSpec(e, t, a) {
    _checkPrivateRedeclaration(e, t), t.set(e, a);
  }
  function _classPrivateFieldSet2(s, a, r) {
    return s.set(_assertClassBrand(s, a), r), r;
  }
  function _construct(t, e, r) {
    if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
    var o = [null];
    o.push.apply(o, e);
    var p = new (t.bind.apply(t, o))();
    return r && _setPrototypeOf(p, r.prototype), p;
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e;
  }
  function _createForOfIteratorHelper(r, e) {
    var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!t) {
      if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
        t && (r = t);
        var n = 0,
          F = function () {};
        return {
          s: F,
          n: function () {
            return n >= r.length ? {
              done: !0
            } : {
              done: !1,
              value: r[n++]
            };
          },
          e: function (r) {
            throw r;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o,
      a = !0,
      u = !1;
    return {
      s: function () {
        t = t.call(r);
      },
      n: function () {
        var r = t.next();
        return a = r.done, r;
      },
      e: function (r) {
        u = !0, o = r;
      },
      f: function () {
        try {
          a || null == t.return || t.return();
        } finally {
          if (u) throw o;
        }
      }
    };
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
  }
  function _get() {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
      var p = _superPropBase(e, t);
      if (p) {
        var n = Object.getOwnPropertyDescriptor(p, t);
        return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
      }
    }, _get.apply(null, arguments);
  }
  function _getPrototypeOf(t) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
      return t.__proto__ || Object.getPrototypeOf(t);
    }, _getPrototypeOf(t);
  }
  function _inherits(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
    t.prototype = Object.create(e && e.prototype, {
      constructor: {
        value: t,
        writable: !0,
        configurable: !0
      }
    }), Object.defineProperty(t, "prototype", {
      writable: !1
    }), e && _setPrototypeOf(t, e);
  }
  function _isNativeFunction(t) {
    try {
      return -1 !== Function.toString.call(t).indexOf("[native code]");
    } catch (n) {
      return "function" == typeof t;
    }
  }
  function _isNativeReflectConstruct() {
    try {
      var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (t) {}
    return (_isNativeReflectConstruct = function () {
      return !!t;
    })();
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _possibleConstructorReturn(t, e) {
    if (e && ("object" == typeof e || "function" == typeof e)) return e;
    if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
    return _assertThisInitialized(t);
  }
  function _setPrototypeOf(t, e) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
      return t.__proto__ = e, t;
    }, _setPrototypeOf(t, e);
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _superPropBase(t, o) {
    for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)););
    return t;
  }
  function _superPropGet(t, e, o, r) {
    var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), e, o);
    return 2 & r && "function" == typeof p ? function (t) {
      return p.apply(o, t);
    } : p;
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }
  function _wrapNativeSuper(t) {
    var r = "function" == typeof Map ? new Map() : void 0;
    return _wrapNativeSuper = function (t) {
      if (null === t || !_isNativeFunction(t)) return t;
      if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
      if (void 0 !== r) {
        if (r.has(t)) return r.get(t);
        r.set(t, Wrapper);
      }
      function Wrapper() {
        return _construct(t, arguments, _getPrototypeOf(this).constructor);
      }
      return Wrapper.prototype = Object.create(t.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }), _setPrototypeOf(Wrapper, t);
    }, _wrapNativeSuper(t);
  }

  var isEqualSets = function isEqualSets(set1, set2) {
    if (set1.size !== set2.size) {
      return false;
    }
    var _iterator = _createForOfIteratorHelper(set1),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        if (!set2.has(item)) {
          return false;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return true;
  };
  var cloneSet = function cloneSet(set) {
    return new Set(_toConsumableArray(set));
  };
  var _callback = /*#__PURE__*/new WeakMap();
  var MediaControlsList = /*#__PURE__*/function (_Set) {
    function MediaControlsList() {
      var _this;
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      _classCallCheck(this, MediaControlsList);
      _this = _callSuper(this, MediaControlsList);
      _classPrivateFieldInitSpec(_this, _callback, void 0);
      _classPrivateFieldSet2(_callback, _this, callback);
      return _this;
    }
    _inherits(MediaControlsList, _Set);
    return _createClass(MediaControlsList, [{
      key: "add",
      value: function add(value) {
        var _this2 = this;
        var before = cloneSet(this);
        value === null || value === void 0 || value.split(/\s+/).forEach(function (value) {
          return _superPropGet(MediaControlsList, "add", _this2, 3)([value]);
        });
        if (!isEqualSets(before, this)) {
          _classPrivateFieldGet2(_callback, this).call(this);
        }
      }
    }, {
      key: "delete",
      value: function _delete(value) {
        var _this3 = this;
        var before = cloneSet(this);
        value === null || value === void 0 || value.split(/\s+/).forEach(function (value) {
          return _superPropGet(MediaControlsList, "delete", _this3, 3)([value]);
        });
        if (!isEqualSets(before, this)) {
          _classPrivateFieldGet2(_callback, this).call(this);
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        var before = cloneSet(this);
        _superPropGet(MediaControlsList, "clear", this, 3)([]);
        if (!isEqualSets(before, this)) {
          _classPrivateFieldGet2(_callback, this).call(this);
        }
      }
    }, {
      key: "toString",
      value: function toString() {
        return Array.from(this).join(' ');
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(Set));

  var formatCurrentTime = function formatCurrentTime(time, duration) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    return "".concat(minutes, ":").concat(seconds.toString().padStart(2, '0'));
  };
  var _internals = /*#__PURE__*/new WeakMap();
  var _slot = /*#__PURE__*/new WeakMap();
  var _mediaElement = /*#__PURE__*/new WeakMap();
  var _containerElement = /*#__PURE__*/new WeakMap();
  var _clickTimeout = /*#__PURE__*/new WeakMap();
  var _autohideTimeout = /*#__PURE__*/new WeakMap();
  var _body = /*#__PURE__*/new WeakMap();
  var _controlsFrame = /*#__PURE__*/new WeakMap();
  var _playButton = /*#__PURE__*/new WeakMap();
  var _muteButton = /*#__PURE__*/new WeakMap();
  var _fullscreenButton = /*#__PURE__*/new WeakMap();
  var _timeline = /*#__PURE__*/new WeakMap();
  var _volumeSlider = /*#__PURE__*/new WeakMap();
  var _currentTimeDisplay = /*#__PURE__*/new WeakMap();
  var _durationDisplay = /*#__PURE__*/new WeakMap();
  var _controls = /*#__PURE__*/new WeakMap();
  var _controlslist = /*#__PURE__*/new WeakMap();
  var _for = /*#__PURE__*/new WeakMap();
  var _hasElementControls = /*#__PURE__*/new WeakMap();
  var _elementControlsObserver = /*#__PURE__*/new WeakMap();
  var _elementControlsObserverEnabled = /*#__PURE__*/new WeakMap();
  var MediaControls = /*#__PURE__*/function (_HTMLElement) {
    function MediaControls() {
      var _this;
      _classCallCheck(this, MediaControls);
      _this = _callSuper(this, MediaControls);
      _classPrivateFieldInitSpec(_this, _internals, void 0);
      _classPrivateFieldInitSpec(_this, _slot, void 0);
      _classPrivateFieldInitSpec(_this, _mediaElement, void 0);
      _classPrivateFieldInitSpec(_this, _containerElement, void 0);
      // Timeouts
      _classPrivateFieldInitSpec(_this, _clickTimeout, void 0);
      _classPrivateFieldInitSpec(_this, _autohideTimeout, void 0);
      // Wrapper
      _classPrivateFieldInitSpec(_this, _body, void 0);
      _classPrivateFieldInitSpec(_this, _controlsFrame, void 0);
      // Control References
      _classPrivateFieldInitSpec(_this, _playButton, void 0);
      _classPrivateFieldInitSpec(_this, _muteButton, void 0);
      _classPrivateFieldInitSpec(_this, _fullscreenButton, void 0);
      _classPrivateFieldInitSpec(_this, _timeline, void 0);
      _classPrivateFieldInitSpec(_this, _volumeSlider, void 0);
      _classPrivateFieldInitSpec(_this, _currentTimeDisplay, void 0);
      _classPrivateFieldInitSpec(_this, _durationDisplay, void 0);
      // Attributes
      _classPrivateFieldInitSpec(_this, _controls, null);
      _classPrivateFieldInitSpec(_this, _controlslist, null);
      _classPrivateFieldInitSpec(_this, _for, void 0);
      // Since we can't hide native media-controls by css in Firefox, we need to keeep track of the controls attribute
      _classPrivateFieldInitSpec(_this, _hasElementControls, false);
      _classPrivateFieldInitSpec(_this, _elementControlsObserver, null);
      _classPrivateFieldInitSpec(_this, _elementControlsObserverEnabled, true);
      _this.handleResize = _this.handleResize.bind(_this);
      _this.handleSlotChange = _this.handleSlotChange.bind(_this);
      _this.handlePlay = _this.handlePlay.bind(_this);
      _this.handlePause = _this.handlePause.bind(_this);
      _this.handleVolumeChange = _this.handleVolumeChange.bind(_this);
      _this.handleTimeUpdate = _this.handleTimeUpdate.bind(_this);
      _this.handleLoadedData = _this.handleLoadedData.bind(_this);
      _this.handleCanPlay = _this.handleCanPlay.bind(_this);
      _this.handlePlayButtonClick = _this.handlePlayButtonClick.bind(_this);
      _this.handleMuteButtonClick = _this.handleMuteButtonClick.bind(_this);
      _this.handleFullscreenButtonClick = _this.handleFullscreenButtonClick.bind(_this);
      _this.handleFullscreenChange = _this.handleFullscreenChange.bind(_this);
      _this.handleTimelineChange = _this.handleTimelineChange.bind(_this);
      _this.handleVolumeSliderChange = _this.handleVolumeSliderChange.bind(_this);
      _this.handleElementClick = _this.handleElementClick.bind(_this);
      _this.handleElementDblClick = _this.handleElementDblClick.bind(_this);

      // this.handleDblClick = this.handleDblClick.bind(this);

      _this.handlePointerMove = _this.handlePointerMove.bind(_this);
      _this.handlePointerLeave = _this.handlePointerLeave.bind(_this);
      _this.handleControlsListChange = _this.handleControlsListChange.bind(_this);
      _this.handleElementControlsChanged = _this.handleElementControlsChanged.bind(_this);
      _this.update = _this.update.bind(_this);
      _this.attachShadow({
        mode: "open"
      });
      _classPrivateFieldSet2(_internals, _this, _this.attachInternals());
      _classPrivateFieldSet2(_controlslist, _this, new MediaControlsList(_this.handleControlsListChange));
      _classPrivateFieldSet2(_elementControlsObserver, _this, new MutationObserver(_this.handleElementControlsChanged.bind(_this)));
      var html = "\n      <style>\n        :host {\n          display: block;\n          position: relative;\n          font-family: var(--x-font-family, sans-serif);\n          font-size: var(--x-font-size, 0.9rem);\n        }\n\n        :host figure {\n          display: flex;\n        }\n\n        :host video::-webkit-media-controls-panel {\n            display: none !important;\n            opacity: 1 !important;\n        }\n\n        /*:host slot {\n          display: block;\n          overflow: hidden;\n          pointer-events: none;\n          outline: 2px solid red;\n        }*/\n\n        :host([for]) {\n          display: block;\n          overflow: visible;\n        }\n\n        :host::part(body) {\n          position: relative;\n          display: flex;\n        }\n\n        :host::part(controls-frame) {\n          position: absolute;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          overflow: hidden;\n          pointer-events: none;\n        }\n\n        /* controls panel */\n        :host::part(controls-panel) {\n          pointer-events: auto;\n          position: absolute;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          /*background: var(--x-controls-bg, color-mix(in srgb, black 45%, transparent));*/\n          background: rgba(from var(--x-controls-bg, black) r g b / 0.55);\n          color: var(--x-controls-color, #fff);\n          transition-delay: 0s;\n          padding: var(--x-controls-padding-y, 0.5rem) var(--x-controls-padding-x, 0.5rem);\n          \n          /*gap: var(--x-controls-gap, 0.5rem);*/\n        }\n\n        :host::part(controls-panel) {\n          transform: translateY(\n            calc(\n              100% * var(--x-controls-slide, 1) +\n              0% * (1 - var(--x-controls-slide, 1))\n            )\n          );\n          opacity: calc(\n            0 * var(--x-controls-fade, 1) +\n            1 * (1 - var(--x-controls-fade, 1))\n          );\n        }\n\n        :host::part(controls-panel-body) {\n          display: flex;\n          justify-content: start;\n          align-items: center;\n          margin-left: calc(var(--x-controls-gap, 0.5rem) / 2 * -1);\n          margin-right: calc(var(--x-controls-gap, 0.5rem) / 2 * -1);\n        }\n\n        :host::part(control) {\n          padding-left: calc(var(--x-controls-gap, 0.5rem) / 2);\n          padding-right: calc(var(--x-controls-gap, 0.5rem) / 2);\n          box-sizing: border-box;\n          min-height: 1rem;\n        }\n\n        :host(:state(--nocontrols))::part(overlay-playbutton),\n        :host(:state(--nocontrols))::part(controls-panel) {\n          display: none;\n        }\n\n        :host(:state(--animated))::part(controls-panel) {\n          transition: transform 0.3s ease-in, opacity 0.3s ease-in;\n        }\n\n        :host(:state(--paused))::part(controls-panel) {\n        }\n\n        :host(:state(--fullscreen))::part(controls-panel) {\n        }\n\n        :host(:state(--controlsvisible))::part(controls-panel) {\n          transform: translateY(0);\n          transition-delay: 0.1s;\n          opacity: 1;\n        }\n\n        /* sliders */\n        :host::part(slider) {\n          -webkit-appearance: none;\n          appearance: none;\n          background: transparent;\n          cursor: pointer;\n          display: block;\n          /*width: max-content;\n          flex-grow: 1;\n          flex-shrink: 1; */\n          pointer-events: auto;\n          margin: 0;\n        }\n\n        :host::part(timeline) {\n          min-width: 65px;\n          flex-grow: 1;\n          flex-shrink: 1;\n        }\n\n        ".concat(['-webkit-slider-runnable-track', '-moz-range-track'].map(function (selector) {
        return "\n          *::".concat(selector, " {\n            width: 100%;\n            height: var(--x-slider-height, 0.5rem);\n            cursor: pointer;\n            box-shadow: var(--x-slider-shadow, inset 0 1px 2px color-mix(in srgb, black 5%, transparent));\n            background: var(--x-slider-bg, color-mix(in srgb, var(--x-controls-color, #fff) 50%, transparent));\n            border-radius: var(--x-slider-radius, 0.5rem);\n            border-width: var(--x-slider-border-width, 0);\n            border-style: var(--x-slider-border-style, solid);\n            border-color: var(--x-slider-border-color, #010101);\n            display: flex;\n          }\n          \n          input[type=range]:focus::").concat(selector, " {\n            /*background: initial;*/\n          }\n        ");
      }).join('\n'), "\n\n        ").concat(['-webkit-slider-thumb', '-moz-range-thumb'].map(function (selector) {
        return "\n          *::".concat(selector, " {\n            -webkit-appearance: none;\n            appearance: none;\n            width: var(--x-slider-thumb-width, 0.5rem); \n            height: var(--x-slider-thumb-height, 0.5rem);\n            border-radius: 50%;\n            background: var(--x-controls-color, #fff);\n            cursor: pointer;\n            margin-top: calc((var(--x-slider-height, 0.5rem) - var(--x-slider-thumb-height, 0.5rem)) / 2);\n          }\n        ");
      }).join('\n'), "\n\n        /* control buttons */\n        :host::part(control-button) {\n          aspect-ratio: 1;\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          line-height: 1;\n          height: 1rem;\n          box-sizing: content-box;\n          cursor: pointer;\n          pointer-events: auto;\n        }\n\n        :host::part(control-button):before,\n        :host::part(overlay-playbutton):before,\n        :host::part(control-button):after {\n          font-family: var(--x-icon-font-family, monospace);\n          font-weight: var(--x-icon-font-weight, normal);\n          color: var(--x-controls-color, #fff);\n        }\n\n        /* fullscreen button */\n        :host::part(fullscreen-button) {\n          grid-area: fullscreen-button;\n          margin-left: auto;\n        }\n\n        :host::part(fullscreen-button)::before {\n          content: var(--x-icon-expand, '\u26F6');\n        }\n\n        :host(:state(--fullscreen))::part(fullscreen-button)::before {\n          content: var(--x-icon-collapse, '\u26F6');\n        }\n\n        /* play button */\n        :host::part(play-button) {\n        }\n\n        :host(:state(--paused))::part(play-button):before {\n          content: var(--x-icon-play, \"\u25B6\");\n        }\n\n        :host::part(play-button):before {\n          content: var(--x-icon-pause, '\u23F8');\n        }\n\n        /* mute button */\n        :host::part(mute-button) {\n          position: relative;\n        }\n\n        :host::part(mute-button):before {\n          content: var(--x-icon-unmute, \"\\1F50A\");\n        }\n\n        :host(:state(--muted))::part(mute-button):before {\n          /* content: var(--x-icon-mute, '\uD83D\uDD07'); */\n        }\n\n        :host(:state(--muted))::part(mute-button):after {\n          /*content: var(--x-icon-strike, '\\2298');*/\n          content: '';\n          display: block;\n          position: absolute;\n          left: 0;\n          top: 0;\n          height: 1rem;\n          aspect-ratio: 1;\n          color: red;\n          font-size: 2rem;\n          width: 1rem;\n          background: linear-gradient(to right top, transparent, transparent 40%, #eee 40%, #eee 50%, #333 50%, #333 60%, transparent 60%, transparent);\n        }\n\n        :host::part(time-display) {\n          display: flex;\n          flex-wrap: nowrap;\n          white-space: nowrap;\n        }\n\n        /* duration-display */\n        :host::part(duration) {\n          color: var(--x-muted, color-mix(in srgb, var(--x-controls-color, #fff) 50%, transparent));\n        }\n\n        :host::part(duration)::before {\n          content: ' / ';\n        }\n\n        /* current-time-display */\n        :host::part(current-time) {\n        }\n\n        :host::part(display) {\n          \n        }\n\n        :host::part(duration):empty {\n          display: none;\n        }\n\n        /* overlay play button */\n        :host::part(overlay-playbutton) {\n          position: absolute;\n          top: 50%;\n          left: 50%;\n          transform: translate(-50%, -50%);\n          transition: all 0.3s ease-in;\n          padding: 1.3rem;\n          font: var(--x-icon-font, monospace);\n          font-size: 2rem;\n          background: rgba(from var(--x-controls-bg, black) r g b / 0.55);\n          border-radius: 50%;\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          box-sizing: content-box;\n          cursor: pointer;\n          text-align: center;\n          opacity: 0.5;\n          transition: all 0.09s linear;\n          visibility: hidden;\n          aspect-ratio: 1;\n          height: 1em;\n        }\n\n        :host::part(overlay-playbutton)::before {\n          content: var(--x-icon-play, \"\u25B6\");\n          display: block;\n          vertical-align: middle;\n        }\n\n        :host(:state(--canplay):state(--paused):not(:state(--played)))::part(overlay-playbutton) {\n          opacity: 1;\n          transform: translate(-50%, -50%) scale(1);\n          visibility: visible;\n        }\n\n        :host(:state(--played))::part(overlay-playbutton) {\n          opacity: 0;\n          transform: translate(-50%, -50%) scale(2.5);\n          transition: visibility 0s 0.4s, opacity 0.4s ease-out, transform 0.4s ease-in;\n          visibility: hidden;\n          pointer-events: none;\n          cursor: default;\n        }\n\n        /* volume-control */\n        .volume-control {\n          display: flex;\n          align-items: center;\n          position: relative;\n          /*margin-right: 0;*/\n          pointer-events: auto;\n        }\n\n        .mute-button ~ input[type=range] {\n          transition: all 0.2s ease-in;\n          width: 120px;\n        }\n\n        .mute-button {\n          /* outline: 1px solid green !important; */\n        }\n\n        .mute-button ~ input[type=range] {\n          /* outline: 1px solid pink !important; */\n        }\n\n        .mute-button ~ input[type=range] {\n          max-width: calc(\n            var(--x-volume-slider--width, 60px) * var(--x-volume-slider-expand, 1) +\n            0px * (1 - var(--x-volume-slider-expand, 1))\n          );\n          opacity: calc(\n            1 * var(--x-volume-slider-expand, 1) +\n            0 * (1 - var(--x-volume-slider-expand, 1))\n          );;\n          padding-left: calc(\n            0px * var(--x-volume-slider-expand, 1) +\n            var(--x-controls-gap, 0.5rem) / 2 * (1 - var(--x-volume-slider-expand, 1))\n          );\n          padding-right: calc(\n            0px * var(--x-volume-slider-expand, 1) +\n            var(--x-controls-gap, 0.5rem) / 2 * (1 - var(--x-volume-slider-expand, 1))\n          );\n        } \n\n        .mute-button:hover ~ input[type=range],\n        .mute-button ~ input[type=range]:hover {\n          /* outline: 1px solid yellow !important; */\n          opacity: 1;\n          max-width: var(--x-volume-slider--width, 60px);\n          padding-left: 0.5rem;\n        }\n\n        /* controlslist */\n      \n        ").concat(Object.entries({
        'play-button': ['noplay', 'noplaybutton'],
        'overlay-playbutton': ['noplay', 'nooverlayplaybutton'],
        'fullscreen-button': ['nofullscreen', 'nofullscreenbutton'],
        'mute-button': ['novolume', 'nomutebutton'],
        'volume-slider': ['novolume', 'novolumeslider'],
        'current-time': ['notime', 'nocurrenttime'],
        'duration': ['notime', 'noduration'],
        'timeline': ['notime', 'notimeline']
      }).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          part = _ref2[0],
          triggers = _ref2[1];
        return "\n            :host(:where(\n              ".concat(triggers.map(function (trigger) {
          return "\n                [controlslist=\"".concat(trigger, "\"],\n                [controlslist^=\"").concat(trigger, " \"],\n                [controlslist*=\" ").concat(trigger, " \"],\n                [controlslist$=\" ").concat(trigger, "\"]\n              ");
        }).join(',\n'), "\n            ))::part(").concat(part, ") {\n              /*outline: 2px solid blue;*/\n              display: none;\n              /*").concat(triggers.map(function (trigger) {
          return "--x-controlslist--".concat(trigger, ": 1;");
        }).join('\n'), "*/\n            }\n\n            /*\n            :host::part(").concat(part, ") {\n              --x-controlslist--novalue: ").concat(triggers.reduce(function (acc, trigger) {
          return "var(--x-controlslist--".concat(trigger, ", ").concat(acc, ")");
        }, '0'), ";\n              overflow: hidden;\n              max-width: calc(\n                0px * var(--x-controlslist--novalue, 0) +\n                1000px * (1 - var(--x-controlslist--novalue, 0))\n              );\n              padding-left: calc(\n                0px * var(--x-controlslist--novalue, 0) +\n                var(--x-controls-gap, 0.5rem) / 2 * (1 - var(--x-controlslist--novalue, 0))\n              );\n              padding-right: calc(\n                0px * var(--x-controlslist--novalue, 0) +\n                var(--x-controls-gap, 0.5rem) / 2 * (1 - var(--x-controlslist--novalue, 0))\n              );\n              outline: calc(\n                1px * var(--x-controlslist--novalue, 0) +\n                0px * (1 - var(--x-controlslist--novalue, 0))\n              ) solid yellow;\n            }\n              */\n          ");
      }).join('\n'), "\n\n\n        /*\n        :host([controlslist*=\"nofullscreen\"])::part(fullscreen-button),\n        :host([controlslist*=\"nooverlayplaybutton\"])::part(overlay-playbutton),\n        :host([controlslist*=\"noplaybutton\"])::part(play-button),\n        :host([controlslist*=\"nomutebutton\"])::part(mute-button),\n        :host([controlslist*=\"notimeline\"])::part(timeline),\n        :host([controlslist*=\"noduration\"])::part(duration),\n        :host([controlslist*=\"nocurrenttime\"])::part(current-time),\n        :host([controlslist*=\"novolumeslider\"])::part(volume-slider) {\n          display: none;\n        }\n        \n\n        :host(:where(\n          [controlslist^=\"noplaybutton\"],\n          [controlslist*=\" noplaybutton \"],\n          [controlslist$=\"noplaybutton\"],\n          [controlslist^=\"noplay\"],\n          [controlslist*=\" noplay \"],\n          [controlslist$=\"noplay\"],\n        ))::part(play-button),\n        \n        :host(:where(\n          [controlslist^=\"nooverlayplaybutton\"],\n          [controlslist*=\" nooverlayplaybutton \"],\n          [controlslist$=\"nooverlayplaybutton\"],\n          [controlslist^=\"noplay\"],\n          [controlslist*=\" noplay \"],\n          [controlslist$=\"noplay\"],\n        ))::part(overlay-playbutton),\n\n        :host(:where(\n          [controlslist^=\"nofullscreenbutton\"],\n          [controlslist*=\" nofullscreenbutton \"],\n          [controlslist$=\"nofullscreenbutton\"],\n          [controlslist^=\"nofullscreen\"],\n          [controlslist*=\" nofullscreen \"],\n          [controlslist$=\"nofullscreen\"],\n        ))::part(fullscreen-button),\n\n        :host(:where(\n          [controlslist^=\"nomutebutton\"],\n          [controlslist*=\" nomutebutton \"],\n          [controlslist$=\"nomutebutton\"],\n          [controlslist^=\"novolume\"],\n          [controlslist*=\" novolume \"],\n          [controlslist$=\"novolume\"],\n        ))::part(mute-button),\n\n        :host(:where(\n          [controlslist^=\"novolumeslider\"],\n          [controlslist*=\" novolumeslider \"],\n          [controlslist$=\"novolumeslider\"],\n          [controlslist^=\"novolume\"],\n          [controlslist*=\" novolume \"],\n          [controlslist$=\"novolume\"],\n        ))::part(volume-slider),\n\n        :host(:where(\n          [controlslist^=\"nocurrenttime\"],\n          [controlslist*=\" nocurrenttime \"],\n          [controlslist$=\"nocurrenttime\"],\n          [controlslist^=\"notime\"],\n          [controlslist*=\" notime \"],\n          [controlslist$=\"notime\"],\n        ))::part(current-time),\n\n        :host(:where(\n          [controlslist^=\"noduration\"],\n          [controlslist*=\" noduration \"],\n          [controlslist$=\"noduration\"],\n          [controlslist^=\"notime\"],\n          [controlslist*=\" notime \"],\n          [controlslist$=\"notime\"],\n        ))::part(duration),\n\n        :host(:where(\n          [controlslist^=\"notimeline\"],\n          [controlslist*=\" notimeline \"],\n          [controlslist$=\"notimeline\"],\n          [controlslist^=\"notime\"],\n          [controlslist*=\" notime \"],\n          [controlslist$=\"notime\"],\n        ))::part(timeline)\n        \n        {\n          display: none;\n        }\n\n        :host::part(play-button) {\n          position: relative;\n        }\n\n        :host::part(play-button) {\n          left: calc(\n            1000vw * var(--x-controlslist--noplaybutton, 0) +\n            0vw * (1 - var(--x-controlslist--noplaybutton, 0))\n          );;\n        }\n\n        */\n      </style>\n      <div part=\"body\">\n        <slot></slot>\n        <div part=\"controls-frame\">\n          <div part=\"controls-panel\">\n            <div part=\"controls-panel-body\">\n              <div part=\"control control-button play-button\"></div>\n\n              <input part=\"control slider timeline\" type=\"range\"/>\n              <div part=\"control display current-time\">0:00</div>\n              <div part=\"control display duration\">0:00</div>\n\n              <div class=\"mute-button\" part=\"control control-button mute-button\"></div>\n              <input part=\"control slider volume-slider\" type=\"range\"/>\n              \n              <div part=\"control control-button fullscreen-button\"></div>\n            </div>\n          </div>\n          <div part=\"overlay-playbutton\"></div>\n        </div>\n      </div>\n    ");
      _this.shadowRoot.innerHTML = html;
      _classPrivateFieldSet2(_slot, _this, _this.shadowRoot.querySelector('slot'));
      _classPrivateFieldSet2(_body, _this, _this.shadowRoot.querySelector('[part*="body"]'));
      _classPrivateFieldSet2(_controlsFrame, _this, _this.shadowRoot.querySelector('[part*="controls-frame"]'));

      // Controls
      _classPrivateFieldSet2(_playButton, _this, _this.shadowRoot.querySelector('[part*="play-button"]'));
      _classPrivateFieldSet2(_muteButton, _this, _this.shadowRoot.querySelector('[part*="mute-button"]'));
      _classPrivateFieldSet2(_fullscreenButton, _this, _this.shadowRoot.querySelector('[part*="fullscreen-button"]'));
      _classPrivateFieldSet2(_timeline, _this, _this.shadowRoot.querySelector('[part*="timeline"]'));
      _classPrivateFieldSet2(_currentTimeDisplay, _this, _this.shadowRoot.querySelector('[part*="current-time"]'));
      _classPrivateFieldSet2(_durationDisplay, _this, _this.shadowRoot.querySelector('[part*="duration"]'));
      _classPrivateFieldSet2(_volumeSlider, _this, _this.shadowRoot.querySelector('[part*="volume-slider"]'));
      _classPrivateFieldGet2(_volumeSlider, _this).value = 100;
      return _this;
    }
    _inherits(MediaControls, _HTMLElement);
    return _createClass(MediaControls, [{
      key: "setTargetElement",
      value: function setTargetElement(targetElement) {
        console.log('set target element', targetElement);
        var containerElement = this.contains(targetElement) ? _classPrivateFieldGet2(_body, this) : targetElement;
        console.log('targetElement: ', targetElement);
        // if (targetElement !== this.#containerElement) {

        if (_classPrivateFieldGet2(_containerElement, this)) {
          // Remove event listeners
          _classPrivateFieldGet2(_containerElement, this).removeEventListener('pointermove', this.handlePointerMove);
          _classPrivateFieldGet2(_containerElement, this).removeEventListener('pointerleave', this.handlePointerLeave);
        }
        _classPrivateFieldSet2(_containerElement, this, containerElement);
        if (_classPrivateFieldGet2(_containerElement, this)) {
          // Add event listeners
          _classPrivateFieldGet2(_containerElement, this).addEventListener('pointermove', this.handlePointerMove);
          _classPrivateFieldGet2(_containerElement, this).addEventListener('pointerleave', this.handlePointerLeave);
        }
        var mediaElement = null;
        if (targetElement) {
          mediaElement = targetElement.matches(MediaControls.MEDIA_SELECTOR) ? targetElement : targetElement.querySelector(MediaControls.MEDIA_SELECTOR);
        }
        this.mediaElement = mediaElement;
        // }
      }
    }, {
      key: "getTargetElement",
      value: function getTargetElement() {
        return _classPrivateFieldGet2(_containerElement, this);
      }
    }, {
      key: "mediaElement",
      get: function get() {
        return _classPrivateFieldGet2(_mediaElement, this);
      },
      set: function set(value) {
        if (value !== _classPrivateFieldGet2(_mediaElement, this)) {
          if (_classPrivateFieldGet2(_mediaElement, this)) {
            _classPrivateFieldGet2(_mediaElement, this).removeEventListener('loadeddata', this.handleLoadedData);
            _classPrivateFieldGet2(_mediaElement, this).removeEventListener('canplay', this.handleCanPlay);
            _classPrivateFieldGet2(_mediaElement, this).removeEventListener('play', this.handlePlay);
            _classPrivateFieldGet2(_mediaElement, this).removeEventListener('pause', this.handlePause);
            _classPrivateFieldGet2(_mediaElement, this).removeEventListener('timeupdate', this.handleTimeUpdate);
            _classPrivateFieldGet2(_mediaElement, this).removeEventListener('durationchange', this.handleTimeUpdate);
            _classPrivateFieldGet2(_mediaElement, this).removeEventListener('volumechange', this.handleVolumeChange);
            _classPrivateFieldGet2(_mediaElement, this).removeEventListener('click', this.handleElementClick);
            _classPrivateFieldGet2(_mediaElement, this).removeEventListener('dblclick', this.handleElementDblClick);
            _classPrivateFieldGet2(_elementControlsObserver, this).disconnect();
          }
          _classPrivateFieldSet2(_mediaElement, this, value);
          if (_classPrivateFieldGet2(_mediaElement, this)) {
            _classPrivateFieldGet2(_mediaElement, this).addEventListener('loadeddata', this.handleLoadedData);
            _classPrivateFieldGet2(_mediaElement, this).addEventListener('canplay', this.handleCanPlay);
            _classPrivateFieldGet2(_mediaElement, this).addEventListener('play', this.handlePlay);
            _classPrivateFieldGet2(_mediaElement, this).addEventListener('pause', this.handlePause);
            _classPrivateFieldGet2(_mediaElement, this).addEventListener('timeupdate', this.handleTimeUpdate);
            _classPrivateFieldGet2(_mediaElement, this).addEventListener('durationchange', this.handleTimeUpdate);
            _classPrivateFieldGet2(_mediaElement, this).addEventListener('volumechange', this.handleVolumeChange);
            _classPrivateFieldGet2(_mediaElement, this).addEventListener('click', this.handleElementClick);
            _classPrivateFieldGet2(_mediaElement, this).addEventListener('dblclick', this.handleElementDblClick);
            console.log('init media element', _classPrivateFieldGet2(_controls, this), _classPrivateFieldGet2(_mediaElement, this).controls);
            this.handleElementControlsChanged();
            _classPrivateFieldGet2(_elementControlsObserver, this).observe(_classPrivateFieldGet2(_mediaElement, this), {
              attributes: true,
              attributeFilter: ['muted']
            });
            _classPrivateFieldGet2(_mediaElement, this).muted ? _classPrivateFieldGet2(_internals, this).states.add('--muted') : _classPrivateFieldGet2(_internals, this).states["delete"]('--muted');
            _classPrivateFieldGet2(_volumeSlider, this).value = _classPrivateFieldGet2(_mediaElement, this).muted ? 0 : _classPrivateFieldGet2(_mediaElement, this).volume * 100;
            if (_classPrivateFieldGet2(_mediaElement, this).readyState === 0 && _classPrivateFieldGet2(_mediaElement, this).autoplay || !_classPrivateFieldGet2(_mediaElement, this).paused) {
              this.hideControls(0);
            } else {
              this.showControls();
            }
            if (_classPrivateFieldGet2(_mediaElement, this).readyState >= 2) {
              _classPrivateFieldGet2(_timeline, this).max = 100;
              _classPrivateFieldGet2(_internals, this).states.add('--loadeddata');
              if (_classPrivateFieldGet2(_mediaElement, this).readyState >= 3) {
                _classPrivateFieldGet2(_internals, this).states.add('--canplay');
              }
            }
          }
        }
        this.update();
      }
    }, {
      key: "toggleFullscreen",
      value: function toggleFullscreen() {
        console.log('this.#containerElement: ', _classPrivateFieldGet2(_containerElement, this));
        if (!document.fullscreenElement) {
          _classPrivateFieldGet2(_containerElement, this).requestFullscreen()["catch"](function (err) {
            alert("Error attempting to enable fullscreen mode: ".concat(err.message, " (").concat(err.name, ")"));
          });
        } else {
          document.exitFullscreen();
        }
      }
    }, {
      key: "handleSlotChange",
      value: function handleSlotChange(event) {
        console.log('SLOT CHANGE');
        if (this["for"]) {
          return;
        }
        var targetElement = event.target.assignedElements().find(function (element) {
          return element.matches(MediaControls.MEDIA_SELECTOR) || !!element.querySelector(MediaControls.MEDIA_SELECTOR);
        });
        this.setTargetElement(targetElement);
        this.update();
      }
    }, {
      key: "handleResize",
      value: function handleResize() {
        this.update();
      }
    }, {
      key: "handlePlayButtonClick",
      value: function handlePlayButtonClick(event) {
        _classPrivateFieldGet2(_mediaElement, this).paused ? _classPrivateFieldGet2(_mediaElement, this).play() : _classPrivateFieldGet2(_mediaElement, this).pause();
      }
    }, {
      key: "handleMuteButtonClick",
      value: function handleMuteButtonClick(event) {
        _classPrivateFieldGet2(_mediaElement, this).muted = !_classPrivateFieldGet2(_mediaElement, this).muted;
      }
    }, {
      key: "handleFullscreenButtonClick",
      value: function handleFullscreenButtonClick(event) {
        this.toggleFullscreen();
      }
    }, {
      key: "handleElementClick",
      value: function handleElementClick(event) {
        var _this2 = this;
        clearTimeout(_classPrivateFieldGet2(_clickTimeout, this));
        if (event.detail === 1) {
          _classPrivateFieldSet2(_clickTimeout, this, setTimeout(function () {
            _this2.handleElementSingleClick(event);
          }, 200));
        }
      }
    }, {
      key: "handleElementSingleClick",
      value: function handleElementSingleClick(event) {
        var noPlay = !this.controls || this.controlslist.has('noplay');
        if (noPlay) {
          return;
        }
        _classPrivateFieldGet2(_mediaElement, this).paused ? _classPrivateFieldGet2(_mediaElement, this).play() : _classPrivateFieldGet2(_mediaElement, this).pause();
      }
    }, {
      key: "handleElementDblClick",
      value: function handleElementDblClick(event) {
        if (event.target !== _classPrivateFieldGet2(_mediaElement, this)) {
          return;
        }
        this.toggleFullscreen();
      }
    }, {
      key: "handlePlay",
      value: function handlePlay() {
        if (_classPrivateFieldGet2(_mediaElement, this).played.length > 0) {
          _classPrivateFieldGet2(_internals, this).states.add('--played');
        }
        this.hideControls();
        this.update();
      }
    }, {
      key: "handlePause",
      value: function handlePause() {
        this.showControls();
        this.update();
      }
    }, {
      key: "handleFullscreenChange",
      value: function handleFullscreenChange() {
        var isAnimated = _classPrivateFieldGet2(_internals, this).states.has('--animated');
        _classPrivateFieldGet2(_internals, this).states["delete"]('--animated');
        this.update();
        this.handleControlsListChange();
        if (isAnimated) {
          _classPrivateFieldGet2(_internals, this).states.add('--animated');
        }
      }
    }, {
      key: "handleTimelineChange",
      value: function handleTimelineChange(event) {
        if (!_classPrivateFieldGet2(_mediaElement, this)) {
          return;
        }
        var newTime = _classPrivateFieldGet2(_mediaElement, this).duration * (event.target.value / 100);
        _classPrivateFieldGet2(_mediaElement, this).currentTime = newTime;
        this.update();
      }
    }, {
      key: "handleVolumeChange",
      value: function handleVolumeChange() {
        var isMuted = _classPrivateFieldGet2(_mediaElement, this).muted;
        var volume = isMuted ? 0 : _classPrivateFieldGet2(_mediaElement, this).volume;
        _classPrivateFieldGet2(_volumeSlider, this).value = volume * 100;
        if (volume === 0) {
          _classPrivateFieldGet2(_internals, this).states.add('--muted');
        } else {
          _classPrivateFieldGet2(_internals, this).states["delete"]('--muted');
        }
      }
    }, {
      key: "handleVolumeSliderChange",
      value: function handleVolumeSliderChange(event) {
        if (!_classPrivateFieldGet2(_mediaElement, this)) {
          return;
        }
        _classPrivateFieldGet2(_mediaElement, this).volume = event.target.value / 100;
        _classPrivateFieldGet2(_mediaElement, this).muted = event.target.value > 0 ? false : true;
        this.handleVolumeChange();
      }
    }, {
      key: "handlePointerMove",
      value: function handlePointerMove(event) {
        var _this3 = this;
        if (_classPrivateFieldGet2(_autohideTimeout, this)) {
          clearTimeout(_classPrivateFieldGet2(_autohideTimeout, this));
        }
        _classPrivateFieldGet2(_internals, this).states.add('--controlsvisible');
        if (_classPrivateFieldGet2(_mediaElement, this).paused) {
          return;
        }
        var originalTarget = event.composedPath()[0];
        var isControls = !!originalTarget.closest('[part*="controls"]');
        if (isControls) {
          return;
        }
        _classPrivateFieldSet2(_autohideTimeout, this, setTimeout(function () {
          _classPrivateFieldGet2(_internals, _this3).states["delete"]('--controlsvisible');
        }, MediaControls.CONTROLS_TIMEOUT));
      }
    }, {
      key: "handlePointerLeave",
      value: function handlePointerLeave(event) {
        if (_classPrivateFieldGet2(_autohideTimeout, this)) {
          clearTimeout(_classPrivateFieldGet2(_autohideTimeout, this));
        }
        if (_classPrivateFieldGet2(_mediaElement, this).paused) {
          return;
        }
        _classPrivateFieldGet2(_internals, this).states["delete"]('--controlsvisible');
      }
    }, {
      key: "handleLoadedData",
      value: function handleLoadedData(e) {
        _classPrivateFieldGet2(_timeline, this).max = 100;
        _classPrivateFieldGet2(_internals, this).states.add('--loadeddata');
        _classPrivateFieldGet2(_internals, this).states.add('--animated');
        this.update();
      }
    }, {
      key: "handleCanPlay",
      value: function handleCanPlay(e) {
        _classPrivateFieldGet2(_internals, this).states.add('--canplay');
        this.update();
      }
    }, {
      key: "handleTimeUpdate",
      value: function handleTimeUpdate() {
        var value = 100 / _classPrivateFieldGet2(_mediaElement, this).duration * _classPrivateFieldGet2(_mediaElement, this).currentTime;
        if (isNaN(value)) {
          return;
        }
        _classPrivateFieldGet2(_timeline, this).value = value;
        _classPrivateFieldGet2(_currentTimeDisplay, this).textContent = formatCurrentTime(_classPrivateFieldGet2(_mediaElement, this).currentTime, _classPrivateFieldGet2(_mediaElement, this).duration);
        _classPrivateFieldGet2(_durationDisplay, this).textContent = formatCurrentTime(_classPrivateFieldGet2(_mediaElement, this).duration);
      }
    }, {
      key: "handleElementControlsChanged",
      value: function handleElementControlsChanged() {
        if (!_classPrivateFieldGet2(_elementControlsObserverEnabled, this)) {
          return;
        }
        _classPrivateFieldSet2(_hasElementControls, this, _classPrivateFieldGet2(_mediaElement, this).hasAttribute('controls'));
        console.log('ELEMENT CONTROLS CHANGED', _classPrivateFieldGet2(_mediaElement, this).hasAttribute('controls'));
        _classPrivateFieldGet2(_mediaElement, this).setAttribute('data-controls', _classPrivateFieldGet2(_hasElementControls, this));
        this.update();
        _classPrivateFieldSet2(_elementControlsObserverEnabled, this, false);
        if (_classPrivateFieldGet2(_hasElementControls, this)) {
          _classPrivateFieldGet2(_mediaElement, this).setAttribute('controls', true);
        } else {
          _classPrivateFieldGet2(_mediaElement, this).removeAttribute('controls');
        }
        _classPrivateFieldSet2(_elementControlsObserverEnabled, this, true);
      }
    }, {
      key: "handleControlsListChange",
      value: function handleControlsListChange() {
        var controls = this.shadowRoot.querySelectorAll('[part="controls-panel"] *[part]');
        var hasVisibleControls = Array.from(controls).some(function (control) {
          return getComputedStyle(control).display !== 'none';
        });
        if (!hasVisibleControls) {
          _classPrivateFieldGet2(_internals, this).states.add('--nocontrols');
        } else {
          _classPrivateFieldGet2(_internals, this).states["delete"]('--nocontrols');
        }
        if (!_classPrivateFieldGet2(_mediaElement, this)) {
          return;
        }
        if (this.controlslist.has('noplay')) {
          var isPlaying = _classPrivateFieldGet2(_mediaElement, this).hasAttribute('autoplay');
          if (isPlaying) {
            _classPrivateFieldGet2(_mediaElement, this).play();
          } else {
            _classPrivateFieldGet2(_mediaElement, this).pause();
          }
        }
        if (this.controlslist.has('novolume') || this.controlslist.has('nomutebutton') && this.controlslist.has('novolumeslider')) {
          var isMuted = _classPrivateFieldGet2(_mediaElement, this).hasAttribute('muted');
          _classPrivateFieldGet2(_mediaElement, this).muted = isMuted;
        }
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        console.log('CONNECTED CALLBACK');
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('fullscreenchange', this.handleFullscreenChange);
        _classPrivateFieldGet2(_slot, this).addEventListener('slotchange', this.handleSlotChange);
        _classPrivateFieldGet2(_playButton, this).addEventListener('click', this.handlePlayButtonClick);
        _classPrivateFieldGet2(_muteButton, this).addEventListener('click', this.handleMuteButtonClick);
        _classPrivateFieldGet2(_fullscreenButton, this).addEventListener('click', this.handleFullscreenButtonClick);

        // this.shadowRoot.addEventListener('click', this.handleClick);
        // this.shadowRoot.addEventListener('dblclick', this.handleDblClick);
        // this.addEventListener('pointermove', this.handlePointerMove);
        // this.addEventListener('pointerleave', this.handlePointerLeave);

        _classPrivateFieldGet2(_timeline, this).addEventListener('change', this.handleTimelineChange);
        _classPrivateFieldGet2(_volumeSlider, this).addEventListener('change', this.handleVolumeSliderChange);
        this.update();
      }
    }, {
      key: "detachedCallback",
      value: function detachedCallback() {
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
        _classPrivateFieldGet2(_slot, this).addEventListener('slotchange', this.handleSlotChange);
        _classPrivateFieldGet2(_playButton, this).removeEventListener('click', this.handlePlayButtonClick);
        _classPrivateFieldGet2(_muteButton, this).removeEventListener('click', this.handleMuteButtonClick);
        _classPrivateFieldGet2(_fullscreenButton, this).removeEventListener('click', this.handleFullscreenButtonClick);

        // this.shadowRoot.removeEventListener('click', this.handleClick);
        // this.shadowRoot.removeEventListener('dblclick', this.handleDblClick);
        // this.removeEventListener('pointermove', this.handlePointerMove);
        // this.removeEventListener('pointerleave', this.handlePointerLeave);

        _classPrivateFieldGet2(_timeline, this).removeEventListener('change', this.handleTimelineChange);
        _classPrivateFieldGet2(_volumeSlider, this).removeEventListener('change', this.handleVolumeSliderChange);
        this.setTargetElement(null);
      }
    }, {
      key: "hideControls",
      value: function hideControls() {
        var _this4 = this;
        var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : MediaControls.CONTROLS_TIMEOUT;
        if (_classPrivateFieldGet2(_autohideTimeout, this)) {
          clearTimeout(_classPrivateFieldGet2(_autohideTimeout, this));
        }
        if (MediaControls.CONTROLS_TIMEOUT === 0) {
          _classPrivateFieldGet2(_internals, this).states["delete"]('--controlsvisible');
          return;
        }
        _classPrivateFieldSet2(_autohideTimeout, this, setTimeout(function () {
          if (!_classPrivateFieldGet2(_mediaElement, _this4).paused) {
            _classPrivateFieldGet2(_internals, _this4).states["delete"]('--controlsvisible');
          }
        }, timeout));
      }
    }, {
      key: "showControls",
      value: function showControls() {
        if (_classPrivateFieldGet2(_autohideTimeout, this)) {
          clearTimeout(_classPrivateFieldGet2(_autohideTimeout, this));
        }
        _classPrivateFieldGet2(_internals, this).states.add('--controlsvisible');
      }
    }, {
      key: "update",
      value: function update() {
        var _document$fullscreenE;
        if (!_classPrivateFieldGet2(_mediaElement, this)) {
          return;
        }
        var isPaused = _classPrivateFieldGet2(_mediaElement, this).paused;
        var isFullscreen = document.fullscreenElement === this || ((_document$fullscreenE = document.fullscreenElement) === null || _document$fullscreenE === void 0 ? void 0 : _document$fullscreenE.contains(this));
        if (isPaused) {
          _classPrivateFieldGet2(_internals, this).states.add('--paused');
        } else {
          _classPrivateFieldGet2(_internals, this).states["delete"]('--paused');
        }
        if (isFullscreen) {
          _classPrivateFieldGet2(_internals, this).states.add('--fullscreen');
        } else {
          _classPrivateFieldGet2(_internals, this).states["delete"]('--fullscreen');
        }
        var style = getComputedStyle(_classPrivateFieldGet2(_mediaElement, this));
        _classPrivateFieldGet2(_controlsFrame, this).style.setProperty('border-top-left-radius', style.getPropertyValue('border-top-left-radius'));
        _classPrivateFieldGet2(_controlsFrame, this).style.setProperty('border-top-right-radius', style.getPropertyValue('border-top-right-radius'));
        _classPrivateFieldGet2(_controlsFrame, this).style.setProperty('border-bottom-left-radius', style.getPropertyValue('border-bottom-left-radius'));
        _classPrivateFieldGet2(_controlsFrame, this).style.setProperty('border-bottom-right-radius', style.getPropertyValue('border-bottom-right-radius'));
        _classPrivateFieldGet2(_controlsFrame, this).style.setProperty('transform', '');

        // if (this.#for) {
        var mediaElementBounds = _classPrivateFieldGet2(_mediaElement, this).getBoundingClientRect();
        _classPrivateFieldGet2(_controlsFrame, this).style.setProperty('width', "".concat(mediaElementBounds.width, "px"));
        _classPrivateFieldGet2(_controlsFrame, this).style.setProperty('height', "".concat(mediaElementBounds.height, "px"));
        var targetBounds = _classPrivateFieldGet2(_controlsFrame, this).getBoundingClientRect();
        var top = mediaElementBounds.top - targetBounds.top;
        var left = mediaElementBounds.left - targetBounds.left;
        _classPrivateFieldGet2(_controlsFrame, this).style.setProperty('transform', "translate(".concat(left, "px, ").concat(top, "px)"));
        // }

        if (this.controls) {
          _classPrivateFieldGet2(_internals, this).states["delete"]('--nocontrols');
        } else {
          _classPrivateFieldGet2(_internals, this).states.add('--nocontrols');
        }
      }
    }, {
      key: "for",
      get: function get() {
        return _classPrivateFieldGet2(_for, this);
      },
      set: function set(value) {
        if (value !== this["for"]) {
          if (value) {
            this.setAttribute('for', value);
          } else {
            this.removeAttribute('for');
          }
          _classPrivateFieldSet2(_for, this, value);
          if (_classPrivateFieldGet2(_for, this)) {
            var targetElement = document.querySelector("#".concat(_classPrivateFieldGet2(_for, this)));
            this.setTargetElement(targetElement);
          }
        }
      }
    }, {
      key: "controlslist",
      get: function get() {
        return _classPrivateFieldGet2(_controlslist, this);
      }
    }, {
      key: "controls",
      get: function get() {
        if (_classPrivateFieldGet2(_controls, this) === null) {
          return _classPrivateFieldGet2(_hasElementControls, this);
        }
        return !!_classPrivateFieldGet2(_controls, this);
      },
      set: function set(value) {
        if (value !== _classPrivateFieldGet2(_controls, this)) {
          var attrValue = this.hasAttribute('controls') ? this.getAttribute('controls') : null;
          if (value !== attrValue) {
            this.setAttribute('controls', value);
          }
          _classPrivateFieldSet2(_controls, this, value);
          console.log('SET CONTROLS: ', value, _classPrivateFieldGet2(_mediaElement, this));
          if (_classPrivateFieldGet2(_mediaElement, this)) {
            _classPrivateFieldGet2(_mediaElement, this).controls = false;
          }
          this.update();
        }
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'controlslist') {
          this.controlslist.clear();
          this.controlslist.add(newValue);
          return;
        }
        if (Reflect.has(this, name)) {
          var isBool = typeof this[name] === 'boolean';
          var value = isBool ? this.hasAttribute(name) : newValue;
          if (value !== this[name]) {
            this[name] = value;
          }
        }
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['for', 'controlslist', 'controls'];
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
  _defineProperty(MediaControls, "MEDIA_SELECTOR", 'video, audio');
  _defineProperty(MediaControls, "CONTROLS_TIMEOUT", 3000);
  customElements.define('x-mediacontrols', MediaControls);

  console.log('Hello, world!');

})();
