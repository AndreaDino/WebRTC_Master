(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@yandeu/events/cjs/version.js
  var require_version = __commonJS({
    "node_modules/@yandeu/events/cjs/version.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.VERSION = void 0;
      exports.VERSION = "0.0.6";
    }
  });

  // node_modules/@yandeu/events/cjs/index.js
  var require_cjs = __commonJS({
    "node_modules/@yandeu/events/cjs/index.js"(exports) {
      "use strict";
      var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
        if (pack || arguments.length === 2)
          for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
              if (!ar)
                ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
            }
          }
        return to.concat(ar || Array.prototype.slice.call(from));
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Events = void 0;
      var version_1 = require_version();
      var EE = (
        /** @class */
        function() {
          function EE2(fn, context, once) {
            if (once === void 0) {
              once = false;
            }
            this.fn = fn;
            this.context = context;
            this.once = once;
          }
          return EE2;
        }()
      );
      var addListener = function(emitter, event, fn, context, once) {
        if (typeof fn !== "function") {
          throw new TypeError("The listener must be a function");
        }
        var listener = new EE(fn, context || emitter, once);
        if (!emitter._events.has(event))
          emitter._events.set(event, listener), emitter._eventsCount++;
        else if (!emitter._events.get(event).fn)
          emitter._events.get(event).push(listener);
        else
          emitter._events.set(event, [emitter._events.get(event), listener]);
        return emitter;
      };
      var clearEvent = function(emitter, event) {
        if (--emitter._eventsCount === 0)
          emitter._events = /* @__PURE__ */ new Map();
        else
          emitter._events.delete(event);
      };
      var Events2 = (
        /** @class */
        function() {
          function Events3() {
            this._events = /* @__PURE__ */ new Map();
            this._eventsCount = 0;
          }
          Object.defineProperty(Events3, "VERSION", {
            get: function() {
              return version_1.VERSION;
            },
            enumerable: false,
            configurable: true
          });
          Events3.prototype.eventNames = function() {
            return Array.from(this._events.keys());
          };
          Events3.prototype.listeners = function(event) {
            var handlers = this._events.get(event);
            if (!handlers)
              return [];
            if (handlers.fn)
              return [handlers.fn];
            for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
              ee[i] = handlers[i].fn;
            }
            return ee;
          };
          Events3.prototype.listenerCount = function(event) {
            var listeners = this._events.get(event);
            if (!listeners)
              return 0;
            if (listeners.fn)
              return 1;
            return listeners.length;
          };
          Events3.prototype.emit = function(event) {
            var _a, _b;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
            }
            if (!this._events.has(event))
              return false;
            var listeners = this._events.get(event);
            var i;
            if (listeners.fn) {
              if (listeners.once)
                this.removeListener(event, listeners.fn, void 0, true);
              return (_a = listeners.fn).call.apply(_a, __spreadArray([listeners.context], args, false)), true;
            } else {
              var length_1 = listeners.length;
              for (i = 0; i < length_1; i++) {
                if (listeners[i].once)
                  this.removeListener(event, listeners[i].fn, void 0, true);
                (_b = listeners[i].fn).call.apply(_b, __spreadArray([listeners[i].context], args, false));
              }
            }
            return true;
          };
          Events3.prototype.on = function(event, fn, context) {
            return addListener(this, event, fn, context, false);
          };
          Events3.prototype.once = function(event, fn, context) {
            return addListener(this, event, fn, context, true);
          };
          Events3.prototype.removeListener = function(event, fn, context, once) {
            if (!this._events.has(event))
              return this;
            if (!fn) {
              clearEvent(this, event);
              return this;
            }
            var listeners = this._events.get(event);
            if (listeners.fn) {
              if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
                clearEvent(this, event);
              }
            } else {
              for (var i = 0, events = [], length = listeners.length; i < length; i++) {
                if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
                  events.push(listeners[i]);
                }
              }
              if (events.length)
                this._events.set(event, events.length === 1 ? events[0] : events);
              else
                clearEvent(this, event);
            }
            return this;
          };
          Events3.prototype.removeAllListeners = function(event) {
            if (event) {
              if (this._events.delete(event))
                clearEvent(this, event);
            } else {
              this._events = /* @__PURE__ */ new Map();
              this._eventsCount = 0;
            }
            return this;
          };
          Object.defineProperty(Events3.prototype, "off", {
            // alias
            get: function() {
              return this.removeListener;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(Events3.prototype, "addListener", {
            // alias
            get: function() {
              return this.on;
            },
            enumerable: false,
            configurable: true
          });
          return Events3;
        }()
      );
      exports.Events = Events2;
    }
  });

  // node_modules/@geckos.io/common/lib/bridge.js
  var import_events = __toESM(require_cjs(), 1);
  var Bridge = class {
    constructor() {
      this.eventEmitter = new import_events.Events();
    }
    emit(eventName, data, connection = {}) {
      this.eventEmitter.emit(eventName, data, connection);
    }
    on(eventName, cb) {
      return this.eventEmitter.on(eventName, (data, options) => {
        cb(data, options);
      });
    }
    removeAllListeners() {
      this.eventEmitter.removeAllListeners();
    }
  };
  var bridge = new Bridge();

  // node_modules/@geckos.io/common/lib/constants.js
  var EVENTS = {
    CONNECT: "connect",
    CONNECTION: "connection",
    DATA_CHANNEL_IS_OPEN: "dataChannelIsOpen",
    DISCONNECT: "disconnect",
    DISCONNECTED: "disconnected",
    DROP: "dropped",
    ERROR: "error",
    RAW_MESSAGE: "rawMessage",
    RECEIVED_FROM_DATA_CHANNEL: "receiveFromDataChannel",
    SEND_OVER_DATA_CHANNEL: "sendOverDataChannel"
  };
  var ERRORS = {
    BROWSER_NOT_SUPPORTED: "BROWSER_NOT_SUPPORTED",
    COULD_NOT_PARSE_MESSAGE: "COULD_NOT_PARSE_MESSAGE",
    DROPPED_FROM_BUFFERING: "DROPPED_FROM_BUFFERING",
    MAX_MESSAGE_SIZE_EXCEEDED: "MAX_MESSAGE_SIZE_EXCEEDED"
  };

  // node_modules/@geckos.io/common/lib/types.js
  var ArrayBufferView = Object.getPrototypeOf(Object.getPrototypeOf(new Uint8Array())).constructor;

  // node_modules/@geckos.io/common/lib/helpers.js
  var tick = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;
  var isStringMessage = (data) => {
    return typeof data === "string";
  };
  var isBufferMessage = (data) => {
    return data instanceof ArrayBuffer || data instanceof ArrayBufferView;
  };
  var isJSONMessage = (data) => {
    try {
      if (typeof data !== "string")
        return false;
      if (!isNaN(parseInt(data)))
        return false;
      JSON.parse(data);
      return true;
    } catch (error) {
      return false;
    }
  };

  // node_modules/@geckos.io/common/lib/parseMessage.js
  var ParseMessage = (ev) => {
    let { data } = ev;
    if (!data)
      data = ev;
    const isBuffer = isBufferMessage(data);
    const isJson = isJSONMessage(data);
    const isString = isStringMessage(data);
    if (isJson) {
      const object = JSON.parse(data);
      const key = Object.keys(object)[0];
      const value = object[key];
      return { key, data: value };
    }
    if (isBuffer) {
      return { key: EVENTS.RAW_MESSAGE, data };
    }
    if (isString) {
      return { key: EVENTS.RAW_MESSAGE, data };
    }
    return { key: "error", data: new Error(ERRORS.COULD_NOT_PARSE_MESSAGE) };
  };

  // node_modules/@geckos.io/common/lib/sendMessage.js
  var SendMessage = (dataChannel, maxMessageSize, eventName, data = null) => {
    var _a;
    const send = (data2, isBuffer) => {
      var _a2;
      const bytes = (_a2 = data2.byteLength) !== null && _a2 !== void 0 ? _a2 : data2.length * 2;
      if (typeof maxMessageSize === "number" && bytes > maxMessageSize) {
        throw new Error(`maxMessageSize of ${maxMessageSize} exceeded`);
      } else {
        Promise.resolve().then(() => {
          if (dataChannel.send)
            dataChannel.send(data2);
          else {
            if (!isBuffer)
              dataChannel.sendMessage(data2);
            else
              dataChannel.sendMessageBinary(Buffer.from(data2));
          }
        }).catch((error) => {
          console.log("error", error);
        });
      }
    };
    if (!dataChannel)
      return;
    if (dataChannel.readyState === "open" || ((_a = dataChannel.isOpen) === null || _a === void 0 ? void 0 : _a.call(dataChannel))) {
      try {
        if (eventName === EVENTS.RAW_MESSAGE && data !== null && (isStringMessage(data) || isBufferMessage(data))) {
          send(data, isBufferMessage(data));
        } else {
          send(JSON.stringify({ [eventName]: data }), false);
        }
      } catch (error) {
        console.error("Error in sendMessage.ts: ", error.message);
        return error;
      }
    }
  };

  // node_modules/@geckos.io/client/lib/wrtc/connectionsManager.js
  var ConnectionsManagerClient = class {
    emit(eventName, data = null) {
      SendMessage(this.dataChannel, this.maxMessageSize, eventName, data);
    }
    constructor(url, authorization, label, rtcConfiguration) {
      this.url = url;
      this.authorization = authorization;
      this.label = label;
      this.rtcConfiguration = rtcConfiguration;
      this.bridge = new Bridge();
      this.onDataChannel = (ev) => {
        const { channel } = ev;
        if (channel.label !== this.label)
          return;
        this.dataChannel = channel;
        this.dataChannel.binaryType = "arraybuffer";
        this.dataChannel.onmessage = (ev2) => {
          const { key, data } = ParseMessage(ev2);
          this.bridge.emit(key, data);
        };
      };
    }
    // fetch additional candidates
    async fetchAdditionalCandidates(host, id) {
      var _a;
      if (((_a = this.dataChannel) === null || _a === void 0 ? void 0 : _a.readyState) === "closed")
        return;
      const res = await fetch(`${host}/connections/${id}/additional-candidates`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        const candidates = await res.json();
        candidates.forEach((c2) => {
          this.localPeerConnection.addIceCandidate(c2);
        });
      }
    }
    async connect() {
      const host = `${this.url}/.wrtc/v2`;
      let headers = { "Content-Type": "application/json" };
      if (this.authorization)
        headers = { ...headers, ["Authorization"]: this.authorization };
      let userData = {};
      try {
        const res = await fetch(`${host}/connections`, {
          method: "POST",
          headers
        });
        if (res.status >= 300) {
          throw {
            name: "Error",
            message: `Connection failed with status code ${res.status}.`,
            status: res.status,
            statusText: res.statusText
          };
        }
        const json = await res.json();
        userData = json.userData;
        this.remotePeerConnection = json;
      } catch (error) {
        console.error(error.message);
        return { error };
      }
      const { id, localDescription } = this.remotePeerConnection;
      const configuration = {
        // @ts-ignore
        sdpSemantics: "unified-plan",
        ...this.rtcConfiguration
      };
      const RTCPc = RTCPeerConnection || webkitRTCPeerConnection;
      this.localPeerConnection = new RTCPc(configuration);
      const showBackOffIntervals = (attempts = 10, initial = 50, factor = 1.8, jitter = 20) => Array(attempts).fill(0).map((_, index) => parseInt((initial * factor ** index).toString()) + parseInt((Math.random() * jitter).toString()));
      showBackOffIntervals().forEach((ms) => {
        setTimeout(() => {
          this.fetchAdditionalCandidates(host, id).catch(() => {
          });
        }, ms);
      });
      try {
        await this.localPeerConnection.setRemoteDescription(localDescription);
        this.localPeerConnection.addEventListener("datachannel", this.onDataChannel, { once: true });
        const originalAnswer = await this.localPeerConnection.createAnswer();
        const updatedAnswer = new RTCSessionDescription({
          type: "answer",
          sdp: originalAnswer.sdp
        });
        await this.localPeerConnection.setLocalDescription(updatedAnswer);
        try {
          await fetch(`${host}/connections/${id}/remote-description`, {
            method: "POST",
            body: JSON.stringify(this.localPeerConnection.localDescription),
            headers: {
              "Content-Type": "application/json"
            }
          });
        } catch (error) {
          console.error(error.message);
          return { error };
        }
        const waitForDataChannel = () => {
          return new Promise((resolve) => {
            this.localPeerConnection.addEventListener("datachannel", () => {
              resolve();
            }, { once: true });
          });
        };
        if (!this.dataChannel)
          await waitForDataChannel();
        return {
          userData,
          localPeerConnection: this.localPeerConnection,
          dataChannel: this.dataChannel,
          id
        };
      } catch (error) {
        console.error(error.message);
        this.localPeerConnection.close();
        return { error };
      }
    }
  };

  // node_modules/@geckos.io/client/lib/wrtc/peerConnection.js
  var PeerConnection = class {
    async connect(connectionsManager) {
      const webRTCPcSupported = RTCPeerConnection || webkitRTCPeerConnection;
      if (webRTCPcSupported) {
        const { localPeerConnection, dataChannel, id, userData, error } = await connectionsManager.connect();
        if (error)
          return { error };
        if (!localPeerConnection || !dataChannel || !id || !userData)
          return { error: new Error('Something went wrong in "await connectionsManager.connect()"') };
        this.localPeerConnection = localPeerConnection;
        this.dataChannel = dataChannel;
        this.id = id;
        return { userData };
      } else {
        const error = new Error(ERRORS.BROWSER_NOT_SUPPORTED);
        console.error(error.message);
        return { error };
      }
    }
  };

  // node_modules/@geckos.io/common/lib/makeRandomId.js
  var makeRandomId = (length = 24) => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < length; i++) {
      id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
  };

  // node_modules/@geckos.io/common/lib/runInterval.js
  var runInterval = (interval = 200, runs = 1, cb) => {
    let counter = 0;
    if (typeof cb !== "function") {
      console.error("You have to define your callback function!");
      return;
    }
    const i = setInterval(() => {
      cb();
      counter++;
      if (counter === runs - 1) {
        clearInterval(i);
      }
    }, interval);
    cb();
  };

  // node_modules/@geckos.io/common/lib/reliableMessage.js
  var makeReliable = (options, cb) => {
    const { interval = 150, runs = 10 } = options;
    const id = makeRandomId(24);
    runInterval(interval, runs, () => {
      cb(id);
    });
  };

  // node_modules/@geckos.io/client/lib/geckos/channel.js
  var ClientChannel = class {
    constructor(url, authorization, port, label, rtcConfiguration) {
      this.userData = {};
      this.receivedReliableMessages = [];
      this.url = port ? `${url}:${port}` : url;
      this.connectionsManager = new ConnectionsManagerClient(this.url, authorization, label, rtcConfiguration);
      this.bridge = this.connectionsManager.bridge;
      this.bridge.on(EVENTS.DISCONNECTED, () => this.bridge.removeAllListeners());
    }
    onconnectionstatechange() {
      const lpc = this.peerConnection.localPeerConnection;
      lpc.onconnectionstatechange = () => {
        if (lpc.connectionState === "disconnected" || lpc.connectionState === "closed")
          this.bridge.emit(EVENTS.DISCONNECTED);
      };
    }
    /** Get the channel's id. */
    get id() {
      return this.peerConnection.id;
    }
    /** Close the WebRTC connection */
    close() {
      this.peerConnection.localPeerConnection.close();
      this.bridge.emit(EVENTS.DISCONNECTED);
      try {
        const host = `${this.url}/.wrtc/v2`;
        fetch(`${host}/connections/${this.id}/close`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (error) {
        console.error(error.message);
      }
    }
    /** Emit a message to the server. */
    emit(eventName, data = null, options) {
      if (options && options.reliable) {
        makeReliable(options, (id) => this.connectionsManager.emit(eventName, {
          MESSAGE: data,
          RELIABLE: 1,
          ID: id
        }));
      } else {
        this.connectionsManager.emit(eventName, data);
      }
    }
    /** Emit a raw message to the server */
    get raw() {
      return {
        /**
         * Emit a raw message.
         * @param rawMessage The raw message. Can be of type 'USVString | ArrayBuffer | ArrayBufferView'
         */
        emit: (rawMessage) => this.emit(EVENTS.RAW_MESSAGE, rawMessage)
      };
    }
    /**
     * Listen for a raw message from the server.
     * @param callback The event callback.
     */
    onRaw(callback) {
      this.bridge.on(EVENTS.RAW_MESSAGE, (rawMessage) => {
        const cb = (rawMessage2) => callback(rawMessage2);
        cb(rawMessage);
      });
    }
    /**
     * Listen for the connect event.
     * @param callback The event callback.
     */
    async onConnect(callback) {
      var _a;
      this.peerConnection = new PeerConnection();
      const response = await this.peerConnection.connect(this.connectionsManager);
      if (response.error)
        callback(response.error);
      else {
        if (response.userData)
          this.userData = response.userData;
        this.maxMessageSize = this.connectionsManager.maxMessageSize = (_a = this.peerConnection.localPeerConnection.sctp) === null || _a === void 0 ? void 0 : _a.maxMessageSize;
        this.onconnectionstatechange();
        callback();
      }
    }
    /**
     * Listen for the disconnect event.
     * @param callback The event callback.
     */
    onDisconnect(callback) {
      this.bridge.on(EVENTS.DISCONNECTED, callback);
    }
    /**
     * Listen for a message from the server.
     * @param eventName The event name.
     * @param callback The event callback.
     */
    on(eventName, callback) {
      this.bridge.on(eventName, (data) => {
        const isReliableMessage = data && data.RELIABLE === 1 && data.ID !== "undefined";
        const expireTime = 15e3;
        const deleteExpiredReliableMessages = () => {
          const currentTime = (/* @__PURE__ */ new Date()).getTime();
          this.receivedReliableMessages.forEach((msg, index, object) => {
            if (msg.expire <= currentTime) {
              object.splice(index, 1);
            }
          });
        };
        if (isReliableMessage) {
          deleteExpiredReliableMessages();
          if (this.receivedReliableMessages.filter((obj) => obj.id === data.ID).length === 0) {
            this.receivedReliableMessages.push({
              id: data.ID,
              timestamp: /* @__PURE__ */ new Date(),
              expire: (/* @__PURE__ */ new Date()).getTime() + expireTime
            });
            callback(data.MESSAGE);
          } else {
          }
        } else {
          callback(data);
        }
      });
    }
  };
  var geckosClient = (options = {}) => {
    const { authorization = void 0, iceServers = [], iceTransportPolicy = "all", label = "geckos.io", port = 9208, url = `${location.protocol}//${location.hostname}` } = options;
    return new ClientChannel(url, authorization, port, label, { iceServers, iceTransportPolicy });
  };
  var channel_default = geckosClient;

  // node_modules/@geckos.io/client/lib/index.js
  var lib_default = channel_default;

  // public/js/index.js
  var socket = lib_default({ port: location.port });
  var canvas = document.querySelector("canvas");
  var c = canvas.getContext("2d");
  var gameField = {
    x: 0,
    y: 0,
    width: 1280,
    height: 720,
    lineWidth: 5,
    color: "white"
  };
  var Player = class {
    constructor({ x: x2, y: y2, radius, color, index, score, username }) {
      this.x = x2;
      this.y = y2;
      this.radius = radius;
      this.color = color;
      this.index = index;
      this.score = score;
      this.username = username;
    }
    draw() {
      let hsl = `hsl(${this.color} , 100%,50%)`;
      c.save();
      c.shadowColor = `hsl(${this.color} , 100%,30%)`;
      c.shadowBlur = 5;
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = hsl;
      c.fill();
      c.restore();
    }
  };
  var Wall = class {
    constructor({ x: x2, y: y2, color, h, w }) {
      this.x = x2;
      this.y = y2;
      this.color = color;
      this.h = h;
      this.w = w;
    }
    draw() {
      let hsl = `hsl(${this.color} , 100%,50%)`;
      c.save();
      c.shadowColor = `hsl(${this.color} , 100%,30%)`;
      c.shadowBlur = 5;
      c.beginPath();
      c.rect(this.x - 5, this.y - 5, this.h, this.w);
      c.fillStyle = hsl;
      c.fill();
      c.restore();
    }
  };
  var devicePixelRation = window.devicePixelRatio || 1;
  canvas.width = 1280 * devicePixelRation;
  canvas.height = 720 * devicePixelRation;
  c.scale(devicePixelRation, devicePixelRation);
  var x = canvas.width / 2;
  var y = canvas.height / 2;
  var frontendPlayers = {};
  var frontendWalls = {};
  socket.onConnect(function(error) {
    console.log("Hello everyone, I'm " + socket.id);
    socket.on("updateWalls", (backendWalls) => {
      for (const id in backendWalls) {
        for (const index in backendWalls[id]) {
          frontendWalls[id][index] = new Wall({
            x: backendWalls[id][index].x,
            y: backendWalls[id][index].y,
            color: backendWalls[id][index].color,
            h: backendWalls[id][index].h,
            w: backendWalls[id][index].w
          });
        }
      }
    });
    socket.on("updatePlayers", (backendPlayers) => {
      console.log(performance.now());
      for (const id in backendPlayers) {
        const backendPlayer = backendPlayers[id];
        if (!frontendWalls[id]) {
          frontendWalls[id] = [];
        }
        if (!frontendPlayers[id]) {
          frontendPlayers[id] = new Player({
            x: backendPlayer.x,
            y: backendPlayer.y,
            radius: 10,
            color: backendPlayer.color,
            index: backendPlayer.index,
            score: backendPlayer.score,
            username: backendPlayer.username
          });
          console.log(frontendPlayers[id].username);
          document.querySelector(
            "#playerLabels"
          ).innerHTML += `<div data-id="${id}" data-score="${frontendPlayers[id].score}">${frontendPlayers[id].username}: ${frontendPlayers[id].score} </div>`;
        } else {
          if (id === socket.id) {
            frontendPlayers[id].x = backendPlayer.x;
            frontendPlayers[id].y = backendPlayer.y;
            frontendPlayers[id].score = backendPlayer.score;
            document.querySelector(
              `div[data-id="${id}"]`
            ).innerHTML = `${frontendPlayers[id].username}: ${frontendPlayers[id].score}`;
            document.querySelector(`div[data-id="${id}"]`).setAttribute("data-score", frontendPlayers[id].score);
            const parentDiv = document.querySelector("#playerLabels");
            const childDiv = Array.from(parentDiv.querySelectorAll("div"));
            childDiv.sort((a, b) => {
              const scoreA = Number(a.getAttribute("data-score"));
              const scoreB = Number(b.getAttribute("data-score"));
              return scoreB - scoreA;
            });
            childDiv.forEach((div) => {
              parentDiv.removeChild(div);
            });
            childDiv.forEach((div) => {
              parentDiv.appendChild(div);
            });
            const lastBackendInputIndex = playerInputs.findIndex((input) => {
              return backendPlayer.sequenceNumber === input.sequenceNumber;
            });
            if (lastBackendInputIndex > -1)
              playerInputs.splice(0, lastBackendInputIndex + 1);
            playerInputs.forEach((input) => {
              frontendPlayers[id].x += input.dx;
              frontendPlayers[id].y += input.dy;
            });
          } else {
            frontendPlayers[id].x = backendPlayer.x;
            frontendPlayers[id].y = backendPlayer.y;
            frontendPlayers[id].score = backendPlayer.score;
            document.querySelector(
              `div[data-id="${id}"]`
            ).innerHTML = `${frontendPlayers[id].username}: ${frontendPlayers[id].score}`;
            document.querySelector(`div[data-id="${id}"]`).setAttribute("data-score", frontendPlayers[id].score);
            const parentDiv = document.querySelector("#playerLabels");
            const childDiv = Array.from(parentDiv.querySelectorAll("div"));
            childDiv.sort((a, b) => {
              const scoreA = Number(a.getAttribute("data-score"));
              const scoreB = Number(b.getAttribute("data-score"));
              return scoreB - scoreA;
            });
            childDiv.forEach((div) => {
              parentDiv.removeChild(div);
            });
            childDiv.forEach((div) => {
              parentDiv.appendChild(div);
            });
          }
        }
      }
      for (const id in frontendPlayers) {
        if (!backendPlayers[id]) {
          const divToDelete = document.querySelector(`div[data-id="${id}"]`);
          divToDelete.parentNode.removeChild(divToDelete);
          if (id === socket.id) {
            document.querySelector("#usernameForm").style.display = "block";
          }
          delete frontendPlayers[id];
          delete frontendWalls[id];
          if (id === socket.id) {
            console.log("audio");
            var audio = new Audio("/audio/destroyed.wav");
            audio.volume = 0.4;
            audio.play();
          }
        }
      }
    });
    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      c.fillStyle = "rgba(0, 0, 0, 0.1)";
      c.fillRect(gameField.x, gameField.y, gameField.width, gameField.height);
      for (const id in frontendWalls) {
        for (const index in frontendWalls[id]) {
          const wall = frontendWalls[id][index];
          wall.draw();
        }
      }
      for (const id in frontendPlayers) {
        const player = frontendPlayers[id];
        player.draw();
      }
      c.strokeStyle = gameField.color;
      c.lineWidth = gameField.lineWidth;
      c.strokeRect(gameField.x, gameField.y, gameField.width, gameField.height);
    }
    animate();
    const keys = {
      w: {
        pressed: false
      },
      a: {
        pressed: false
      },
      s: {
        pressed: false
      },
      d: {
        pressed: false
      }
    };
    const SPEED = 10;
    const playerInputs = [];
    let sequenceNumber = 0;
    setInterval(() => {
      if (!frontendPlayers[socket.id])
        return;
      if (keys.w.pressed) {
        sequenceNumber++;
        playerInputs.push({ sequenceNumber, dx: 0, dy: -SPEED });
        frontendPlayers[socket.id].y -= SPEED;
        socket.emit(
          "keydown",
          { keycode: "KeyW", sequenceNumber },
          {
            reliable: true,
            interval: 20,
            runs: 5
          }
        );
      }
      if (keys.a.pressed) {
        sequenceNumber++;
        playerInputs.push({ sequenceNumber, dx: -SPEED, dy: 0 });
        frontendPlayers[socket.id].x -= SPEED;
        socket.emit(
          "keydown",
          { keycode: "KeyA", sequenceNumber },
          {
            reliable: true,
            interval: 20,
            runs: 5
          }
        );
      }
      if (keys.s.pressed) {
        sequenceNumber++;
        playerInputs.push({ sequenceNumber, dx: 0, dy: +SPEED });
        frontendPlayers[socket.id].y += SPEED;
        socket.emit(
          "keydown",
          { keycode: "KeyS", sequenceNumber },
          {
            reliable: true,
            interval: 20,
            runs: 5
          }
        );
      }
      if (keys.d.pressed) {
        sequenceNumber++;
        playerInputs.push({ sequenceNumber, dx: +SPEED, dy: 0 });
        frontendPlayers[socket.id].x += SPEED;
        socket.emit(
          "keydown",
          { keycode: "KeyD", sequenceNumber },
          {
            reliable: true,
            interval: 20,
            runs: 5
          }
        );
      }
    }, 15);
    window.addEventListener("keydown", (event) => {
      if (!frontendPlayers[socket.id])
        return;
      switch (event.code) {
        case "KeyW":
          keys.w.pressed = true;
          break;
        case "KeyA":
          keys.a.pressed = true;
          break;
        case "KeyS":
          keys.s.pressed = true;
          break;
        case "KeyD":
          keys.d.pressed = true;
          break;
      }
    });
    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyW":
          keys.w.pressed = false;
          break;
        case "KeyA":
          keys.a.pressed = false;
          break;
        case "KeyS":
          keys.s.pressed = false;
          break;
        case "KeyD":
          keys.d.pressed = false;
          break;
      }
    });
    document.querySelector("#usernameForm").addEventListener("submit", (event) => {
      event.preventDefault();
      document.querySelector("#usernameForm").style.display = "none";
      console.log(document.querySelector("#usernameId").value);
      socket.emit("initGame", document.querySelector("#usernameId").value, {
        reliable: true,
        interval: 20,
        runs: 5
      });
    });
  });
})();
/*! Bundled license information:

@yandeu/events/cjs/index.js:
  (**
   * @package      npmjs.com/package/@yandeu/events (events.min.js)
   *
   * @author       Arnout Kazemier (https://github.com/3rd-Eden)
   * @copyright    Copyright (c) 2014 Arnout Kazemier
   * @license      {@link https://github.com/primus/eventemitter3/blob/master/LICENSE|MIT}
   *
   * @author       Yannick Deubel (https://github.com/yandeu)
   * @copyright    Copyright (c) 2021 Yannick Deubel; Project Url: https://github.com/yandeu/events
   * @license      {@link https://github.com/yandeu/events/blob/master/LICENSE|MIT}
   *)
*/
