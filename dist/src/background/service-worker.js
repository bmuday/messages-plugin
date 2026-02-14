import { n as normalizeUrl, h as hashUrl, e as extractDomain } from "../../assets/url-utils-CAMNiPlT.js";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var browserPonyfill = { exports: {} };
(function(module, exports$1) {
  var global2 = typeof self !== "undefined" ? self : commonjsGlobal;
  var __self__ = function() {
    function F() {
      this.fetch = false;
      this.DOMException = global2.DOMException;
    }
    F.prototype = global2;
    return new F();
  }();
  (function(self2) {
    (function(exports$12) {
      var support = {
        searchParams: "URLSearchParams" in self2,
        iterable: "Symbol" in self2 && "iterator" in Symbol,
        blob: "FileReader" in self2 && "Blob" in self2 && function() {
          try {
            new Blob();
            return true;
          } catch (e) {
            return false;
          }
        }(),
        formData: "FormData" in self2,
        arrayBuffer: "ArrayBuffer" in self2
      };
      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj);
      }
      if (support.arrayBuffer) {
        var viewClasses = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ];
        var isArrayBufferView = ArrayBuffer.isView || function(obj) {
          return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
        };
      }
      function normalizeName(name) {
        if (typeof name !== "string") {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
          throw new TypeError("Invalid character in header field name");
        }
        return name.toLowerCase();
      }
      function normalizeValue(value) {
        if (typeof value !== "string") {
          value = String(value);
        }
        return value;
      }
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return { done: value === void 0, value };
          }
        };
        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator;
          };
        }
        return iterator;
      }
      function Headers(headers) {
        this.map = {};
        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }
      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ", " + value : value;
      };
      Headers.prototype["delete"] = function(name) {
        delete this.map[normalizeName(name)];
      };
      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null;
      };
      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name));
      };
      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };
      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };
      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items);
      };
      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items);
      };
      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items);
      };
      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }
      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError("Already read"));
        }
        body.bodyUsed = true;
      }
      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        });
      }
      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise;
      }
      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise;
      }
      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);
        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join("");
      }
      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0);
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer;
        }
      }
      function Body() {
        this.bodyUsed = false;
        this._initBody = function(body) {
          this._bodyInit = body;
          if (!body) {
            this._bodyText = "";
          } else if (typeof body === "string") {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }
          if (!this.headers.get("content-type")) {
            if (typeof body === "string") {
              this.headers.set("content-type", "text/plain;charset=UTF-8");
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set("content-type", this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
            }
          }
        };
        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as blob");
            } else {
              return Promise.resolve(new Blob([this._bodyText]));
            }
          };
          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
            } else {
              return this.blob().then(readBlobAsArrayBuffer);
            }
          };
        }
        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected;
          }
          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob);
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
          } else if (this._bodyFormData) {
            throw new Error("could not read FormData body as text");
          } else {
            return Promise.resolve(this._bodyText);
          }
        };
        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode);
          };
        }
        this.json = function() {
          return this.text().then(JSON.parse);
        };
        return this;
      }
      var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method;
      }
      function Request(input, options) {
        options = options || {};
        var body = options.body;
        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError("Already read");
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }
        this.credentials = options.credentials || this.credentials || "same-origin";
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || "GET");
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;
        if ((this.method === "GET" || this.method === "HEAD") && body) {
          throw new TypeError("Body not allowed for GET or HEAD requests");
        }
        this._initBody(body);
      }
      Request.prototype.clone = function() {
        return new Request(this, { body: this._bodyInit });
      };
      function decode(body) {
        var form = new FormData();
        body.trim().split("&").forEach(function(bytes) {
          if (bytes) {
            var split = bytes.split("=");
            var name = split.shift().replace(/\+/g, " ");
            var value = split.join("=").replace(/\+/g, " ");
            form.append(decodeURIComponent(name), decodeURIComponent(value));
          }
        });
        return form;
      }
      function parseHeaders(rawHeaders) {
        var headers = new Headers();
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts = line.split(":");
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(":").trim();
            headers.append(key, value);
          }
        });
        return headers;
      }
      Body.call(Request.prototype);
      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }
        this.type = "default";
        this.status = options.status === void 0 ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = "statusText" in options ? options.statusText : "OK";
        this.headers = new Headers(options.headers);
        this.url = options.url || "";
        this._initBody(bodyInit);
      }
      Body.call(Response.prototype);
      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        });
      };
      Response.error = function() {
        var response = new Response(null, { status: 0, statusText: "" });
        response.type = "error";
        return response;
      };
      var redirectStatuses = [301, 302, 303, 307, 308];
      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError("Invalid status code");
        }
        return new Response(null, { status, headers: { location: url } });
      };
      exports$12.DOMException = self2.DOMException;
      try {
        new exports$12.DOMException();
      } catch (err) {
        exports$12.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports$12.DOMException.prototype = Object.create(Error.prototype);
        exports$12.DOMException.prototype.constructor = exports$12.DOMException;
      }
      function fetch(input, init) {
        return new Promise(function(resolve, reject) {
          var request = new Request(input, init);
          if (request.signal && request.signal.aborted) {
            return reject(new exports$12.DOMException("Aborted", "AbortError"));
          }
          var xhr = new XMLHttpRequest();
          function abortXhr() {
            xhr.abort();
          }
          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || "")
            };
            options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
            var body = "response" in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };
          xhr.onerror = function() {
            reject(new TypeError("Network request failed"));
          };
          xhr.ontimeout = function() {
            reject(new TypeError("Network request failed"));
          };
          xhr.onabort = function() {
            reject(new exports$12.DOMException("Aborted", "AbortError"));
          };
          xhr.open(request.method, request.url, true);
          if (request.credentials === "include") {
            xhr.withCredentials = true;
          } else if (request.credentials === "omit") {
            xhr.withCredentials = false;
          }
          if ("responseType" in xhr && support.blob) {
            xhr.responseType = "blob";
          }
          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });
          if (request.signal) {
            request.signal.addEventListener("abort", abortXhr);
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                request.signal.removeEventListener("abort", abortXhr);
              }
            };
          }
          xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
        });
      }
      fetch.polyfill = true;
      if (!self2.fetch) {
        self2.fetch = fetch;
        self2.Headers = Headers;
        self2.Request = Request;
        self2.Response = Response;
      }
      exports$12.Headers = Headers;
      exports$12.Request = Request;
      exports$12.Response = Response;
      exports$12.fetch = fetch;
      Object.defineProperty(exports$12, "__esModule", { value: true });
      return exports$12;
    })({});
  })(__self__);
  __self__.fetch.ponyfill = true;
  delete __self__.fetch.polyfill;
  var ctx = __self__;
  exports$1 = ctx.fetch;
  exports$1.default = ctx.fetch;
  exports$1.fetch = ctx.fetch;
  exports$1.Headers = ctx.Headers;
  exports$1.Request = ctx.Request;
  exports$1.Response = ctx.Response;
  module.exports = exports$1;
})(browserPonyfill, browserPonyfill.exports);
var browserPonyfillExports = browserPonyfill.exports;
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
class Service {
  constructor(client2) {
    this.client = client2;
  }
  static flatten(data, prefix = "") {
    let output = {};
    for (const [key, value] of Object.entries(data)) {
      let finalKey = prefix ? prefix + "[" + key + "]" : key;
      if (Array.isArray(value)) {
        output = Object.assign(Object.assign({}, output), Service.flatten(value, finalKey));
      } else {
        output[finalKey] = value;
      }
    }
    return output;
  }
}
Service.CHUNK_SIZE = 5 * 1024 * 1024;
class Query {
  constructor(method, attribute, values) {
    this.method = method;
    this.attribute = attribute;
    if (values !== void 0) {
      if (Array.isArray(values)) {
        this.values = values;
      } else {
        this.values = [values];
      }
    }
  }
  toString() {
    return JSON.stringify({
      method: this.method,
      attribute: this.attribute,
      values: this.values
    });
  }
}
Query.equal = (attribute, value) => new Query("equal", attribute, value).toString();
Query.notEqual = (attribute, value) => new Query("notEqual", attribute, value).toString();
Query.lessThan = (attribute, value) => new Query("lessThan", attribute, value).toString();
Query.lessThanEqual = (attribute, value) => new Query("lessThanEqual", attribute, value).toString();
Query.greaterThan = (attribute, value) => new Query("greaterThan", attribute, value).toString();
Query.greaterThanEqual = (attribute, value) => new Query("greaterThanEqual", attribute, value).toString();
Query.isNull = (attribute) => new Query("isNull", attribute).toString();
Query.isNotNull = (attribute) => new Query("isNotNull", attribute).toString();
Query.between = (attribute, start, end) => new Query("between", attribute, [start, end]).toString();
Query.startsWith = (attribute, value) => new Query("startsWith", attribute, value).toString();
Query.endsWith = (attribute, value) => new Query("endsWith", attribute, value).toString();
Query.select = (attributes) => new Query("select", void 0, attributes).toString();
Query.search = (attribute, value) => new Query("search", attribute, value).toString();
Query.orderDesc = (attribute) => new Query("orderDesc", attribute).toString();
Query.orderAsc = (attribute) => new Query("orderAsc", attribute).toString();
Query.cursorAfter = (documentId) => new Query("cursorAfter", void 0, documentId).toString();
Query.cursorBefore = (documentId) => new Query("cursorBefore", void 0, documentId).toString();
Query.limit = (limit) => new Query("limit", void 0, limit).toString();
Query.offset = (offset) => new Query("offset", void 0, offset).toString();
Query.contains = (attribute, value) => new Query("contains", attribute, value).toString();
Query.or = (queries) => new Query("or", void 0, queries.map((query) => JSON.parse(query))).toString();
Query.and = (queries) => new Query("and", void 0, queries.map((query) => JSON.parse(query))).toString();
class AppwriteException extends Error {
  constructor(message, code = 0, type = "", response = "") {
    super(message);
    this.name = "AppwriteException";
    this.message = message;
    this.code = code;
    this.type = type;
    this.response = response;
  }
}
class Client {
  constructor() {
    this.config = {
      endpoint: "https://cloud.appwrite.io/v1",
      endpointRealtime: "",
      project: "",
      jwt: "",
      locale: "",
      session: ""
    };
    this.headers = {
      "x-sdk-name": "Web",
      "x-sdk-platform": "client",
      "x-sdk-language": "web",
      "x-sdk-version": "14.0.1",
      "X-Appwrite-Response-Format": "1.5.0"
    };
    this.realtime = {
      socket: void 0,
      timeout: void 0,
      url: "",
      channels: /* @__PURE__ */ new Set(),
      subscriptions: /* @__PURE__ */ new Map(),
      subscriptionsCounter: 0,
      reconnect: true,
      reconnectAttempts: 0,
      lastMessage: void 0,
      connect: () => {
        clearTimeout(this.realtime.timeout);
        this.realtime.timeout = window === null || window === void 0 ? void 0 : window.setTimeout(() => {
          this.realtime.createSocket();
        }, 50);
      },
      getTimeout: () => {
        switch (true) {
          case this.realtime.reconnectAttempts < 5:
            return 1e3;
          case this.realtime.reconnectAttempts < 15:
            return 5e3;
          case this.realtime.reconnectAttempts < 100:
            return 1e4;
          default:
            return 6e4;
        }
      },
      createSocket: () => {
        var _a2, _b, _c;
        if (this.realtime.channels.size < 1) {
          this.realtime.reconnect = false;
          (_a2 = this.realtime.socket) === null || _a2 === void 0 ? void 0 : _a2.close();
          return;
        }
        const channels = new URLSearchParams();
        channels.set("project", this.config.project);
        this.realtime.channels.forEach((channel) => {
          channels.append("channels[]", channel);
        });
        const url = this.config.endpointRealtime + "/realtime?" + channels.toString();
        if (url !== this.realtime.url || // Check if URL is present
        !this.realtime.socket || // Check if WebSocket has not been created
        ((_b = this.realtime.socket) === null || _b === void 0 ? void 0 : _b.readyState) > WebSocket.OPEN) {
          if (this.realtime.socket && ((_c = this.realtime.socket) === null || _c === void 0 ? void 0 : _c.readyState) < WebSocket.CLOSING) {
            this.realtime.reconnect = false;
            this.realtime.socket.close();
          }
          this.realtime.url = url;
          this.realtime.socket = new WebSocket(url);
          this.realtime.socket.addEventListener("message", this.realtime.onMessage);
          this.realtime.socket.addEventListener("open", (_event) => {
            this.realtime.reconnectAttempts = 0;
          });
          this.realtime.socket.addEventListener("close", (event) => {
            var _a3, _b2, _c2;
            if (!this.realtime.reconnect || ((_b2 = (_a3 = this.realtime) === null || _a3 === void 0 ? void 0 : _a3.lastMessage) === null || _b2 === void 0 ? void 0 : _b2.type) === "error" && // Check if last message was of type error
            ((_c2 = this.realtime) === null || _c2 === void 0 ? void 0 : _c2.lastMessage.data).code === 1008) {
              this.realtime.reconnect = true;
              return;
            }
            const timeout = this.realtime.getTimeout();
            console.error(`Realtime got disconnected. Reconnect will be attempted in ${timeout / 1e3} seconds.`, event.reason);
            setTimeout(() => {
              this.realtime.reconnectAttempts++;
              this.realtime.createSocket();
            }, timeout);
          });
        }
      },
      onMessage: (event) => {
        var _a2, _b;
        try {
          const message = JSON.parse(event.data);
          this.realtime.lastMessage = message;
          switch (message.type) {
            case "connected":
              const cookie = JSON.parse((_a2 = window.localStorage.getItem("cookieFallback")) !== null && _a2 !== void 0 ? _a2 : "{}");
              const session = cookie === null || cookie === void 0 ? void 0 : cookie[`a_session_${this.config.project}`];
              const messageData = message.data;
              if (session && !messageData.user) {
                (_b = this.realtime.socket) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                  type: "authentication",
                  data: {
                    session
                  }
                }));
              }
              break;
            case "event":
              let data = message.data;
              if (data === null || data === void 0 ? void 0 : data.channels) {
                const isSubscribed = data.channels.some((channel) => this.realtime.channels.has(channel));
                if (!isSubscribed)
                  return;
                this.realtime.subscriptions.forEach((subscription) => {
                  if (data.channels.some((channel) => subscription.channels.includes(channel))) {
                    setTimeout(() => subscription.callback(data));
                  }
                });
              }
              break;
            case "error":
              throw message.data;
            default:
              break;
          }
        } catch (e) {
          console.error(e);
        }
      },
      cleanUp: (channels) => {
        this.realtime.channels.forEach((channel) => {
          if (channels.includes(channel)) {
            let found = Array.from(this.realtime.subscriptions).some(([_key, subscription]) => {
              return subscription.channels.includes(channel);
            });
            if (!found) {
              this.realtime.channels.delete(channel);
            }
          }
        });
      }
    };
  }
  /**
   * Set Endpoint
   *
   * Your project endpoint
   *
   * @param {string} endpoint
   *
   * @returns {this}
   */
  setEndpoint(endpoint) {
    this.config.endpoint = endpoint;
    this.config.endpointRealtime = this.config.endpointRealtime || this.config.endpoint.replace("https://", "wss://").replace("http://", "ws://");
    return this;
  }
  /**
   * Set Realtime Endpoint
   *
   * @param {string} endpointRealtime
   *
   * @returns {this}
   */
  setEndpointRealtime(endpointRealtime) {
    this.config.endpointRealtime = endpointRealtime;
    return this;
  }
  /**
   * Set Project
   *
   * Your project ID
   *
   * @param value string
   *
   * @return {this}
   */
  setProject(value) {
    this.headers["X-Appwrite-Project"] = value;
    this.config.project = value;
    return this;
  }
  /**
   * Set JWT
   *
   * Your secret JSON Web Token
   *
   * @param value string
   *
   * @return {this}
   */
  setJWT(value) {
    this.headers["X-Appwrite-JWT"] = value;
    this.config.jwt = value;
    return this;
  }
  /**
   * Set Locale
   *
   * @param value string
   *
   * @return {this}
   */
  setLocale(value) {
    this.headers["X-Appwrite-Locale"] = value;
    this.config.locale = value;
    return this;
  }
  /**
   * Set Session
   *
   * The user session to authenticate with
   *
   * @param value string
   *
   * @return {this}
   */
  setSession(value) {
    this.headers["X-Appwrite-Session"] = value;
    this.config.session = value;
    return this;
  }
  /**
   * Subscribes to Appwrite events and passes you the payload in realtime.
   *
   * @param {string|string[]} channels
   * Channel to subscribe - pass a single channel as a string or multiple with an array of strings.
   *
   * Possible channels are:
   * - account
   * - collections
   * - collections.[ID]
   * - collections.[ID].documents
   * - documents
   * - documents.[ID]
   * - files
   * - files.[ID]
   * - executions
   * - executions.[ID]
   * - functions.[ID]
   * - teams
   * - teams.[ID]
   * - memberships
   * - memberships.[ID]
   * @param {(payload: RealtimeMessage) => void} callback Is called on every realtime update.
   * @returns {() => void} Unsubscribes from events.
   */
  subscribe(channels, callback) {
    let channelArray = typeof channels === "string" ? [channels] : channels;
    channelArray.forEach((channel) => this.realtime.channels.add(channel));
    const counter = this.realtime.subscriptionsCounter++;
    this.realtime.subscriptions.set(counter, {
      channels: channelArray,
      callback
    });
    this.realtime.connect();
    return () => {
      this.realtime.subscriptions.delete(counter);
      this.realtime.cleanUp(channelArray);
      this.realtime.connect();
    };
  }
  call(method, url, headers = {}, params = {}) {
    var _a2, _b;
    return __awaiter(this, void 0, void 0, function* () {
      method = method.toUpperCase();
      headers = Object.assign({}, this.headers, headers);
      let options = {
        method,
        headers,
        credentials: "include"
      };
      if (typeof window !== "undefined" && window.localStorage) {
        headers["X-Fallback-Cookies"] = (_a2 = window.localStorage.getItem("cookieFallback")) !== null && _a2 !== void 0 ? _a2 : "";
      }
      if (method === "GET") {
        for (const [key, value] of Object.entries(Service.flatten(params))) {
          url.searchParams.append(key, value);
        }
      } else {
        switch (headers["content-type"]) {
          case "application/json":
            options.body = JSON.stringify(params);
            break;
          case "multipart/form-data":
            let formData = new FormData();
            for (const key in params) {
              if (Array.isArray(params[key])) {
                params[key].forEach((value) => {
                  formData.append(key + "[]", value);
                });
              } else {
                formData.append(key, params[key]);
              }
            }
            options.body = formData;
            delete headers["content-type"];
            break;
        }
      }
      try {
        let data = null;
        const response = yield browserPonyfillExports.fetch(url.toString(), options);
        if ((_b = response.headers.get("content-type")) === null || _b === void 0 ? void 0 : _b.includes("application/json")) {
          data = yield response.json();
        } else {
          data = {
            message: yield response.text()
          };
        }
        if (400 <= response.status) {
          throw new AppwriteException(data === null || data === void 0 ? void 0 : data.message, response.status, data === null || data === void 0 ? void 0 : data.type, data);
        }
        const cookieFallback = response.headers.get("X-Fallback-Cookies");
        if (typeof window !== "undefined" && window.localStorage && cookieFallback) {
          window.console.warn("Appwrite is using localStorage for session management. Increase your security by adding a custom domain as your API endpoint.");
          window.localStorage.setItem("cookieFallback", cookieFallback);
        }
        return data;
      } catch (e) {
        if (e instanceof AppwriteException) {
          throw e;
        }
        throw new AppwriteException(e.message);
      }
    });
  }
}
class Account extends Service {
  constructor(client2) {
    super(client2);
  }
  /**
   * Get account
   *
   * Get the currently logged in user.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  get() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create account
   *
   * Use this endpoint to allow a new user to register a new account in your
   * project. After the user registration completes successfully, you can use
   * the
   * [/account/verfication](https://appwrite.io/docs/references/cloud/client-web/account#createVerification)
   * route to start verifying the user email address. To allow the new user to
   * login to their new account, you need to create a new [account
   * session](https://appwrite.io/docs/references/cloud/client-web/account#createEmailSession).
   *
   * @param {string} userId
   * @param {string} email
   * @param {string} password
   * @param {string} name
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  create(userId, email, password, name) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof email === "undefined") {
        throw new AppwriteException('Missing required parameter: "email"');
      }
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      const apiPath = "/account";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof email !== "undefined") {
        payload["email"] = email;
      }
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      if (typeof name !== "undefined") {
        payload["name"] = name;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update email
   *
   * Update currently logged in user account email address. After changing user
   * address, the user confirmation status will get reset. A new confirmation
   * email is not sent automatically however you can use the send confirmation
   * email endpoint again to send the confirmation email. For security measures,
   * user password is required to complete this request.
   * This endpoint can also be used to convert an anonymous account to a normal
   * one, by passing an email address and a new password.
   *
   *
   * @param {string} email
   * @param {string} password
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateEmail(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof email === "undefined") {
        throw new AppwriteException('Missing required parameter: "email"');
      }
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      const apiPath = "/account/email";
      const payload = {};
      if (typeof email !== "undefined") {
        payload["email"] = email;
      }
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * List Identities
   *
   * Get the list of identities for the currently logged in user.
   *
   * @param {string[]} queries
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  listIdentities(queries) {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/identities";
      const payload = {};
      if (typeof queries !== "undefined") {
        payload["queries"] = queries;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Delete identity
   *
   * Delete an identity by its unique ID.
   *
   * @param {string} identityId
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  deleteIdentity(identityId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof identityId === "undefined") {
        throw new AppwriteException('Missing required parameter: "identityId"');
      }
      const apiPath = "/account/identities/{identityId}".replace("{identityId}", identityId);
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("delete", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create JWT
   *
   * Use this endpoint to create a JSON Web Token. You can use the resulting JWT
   * to authenticate on behalf of the current user when working with the
   * Appwrite server-side API and SDKs. The JWT secret is valid for 15 minutes
   * from its creation and will be invalid if the user will logout in that time
   * frame.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createJWT() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/jwt";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * List logs
   *
   * Get the list of latest security activity logs for the currently logged in
   * user. Each log returns user IP address, location and date and time of log.
   *
   * @param {string[]} queries
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  listLogs(queries) {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/logs";
      const payload = {};
      if (typeof queries !== "undefined") {
        payload["queries"] = queries;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update MFA
   *
   * Enable or disable MFA on an account.
   *
   * @param {boolean} mfa
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateMFA(mfa) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof mfa === "undefined") {
        throw new AppwriteException('Missing required parameter: "mfa"');
      }
      const apiPath = "/account/mfa";
      const payload = {};
      if (typeof mfa !== "undefined") {
        payload["mfa"] = mfa;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Add Authenticator
   *
   * Add an authenticator app to be used as an MFA factor. Verify the
   * authenticator using the [verify
   * authenticator](/docs/references/cloud/client-web/account#verifyAuthenticator)
   * method.
   *
   * @param {AuthenticatorType} type
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createMfaAuthenticator(type) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof type === "undefined") {
        throw new AppwriteException('Missing required parameter: "type"');
      }
      const apiPath = "/account/mfa/authenticators/{type}".replace("{type}", type);
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Verify Authenticator
   *
   * Verify an authenticator app after adding it using the [add
   * authenticator](/docs/references/cloud/client-web/account#addAuthenticator)
   * method.
   *
   * @param {AuthenticatorType} type
   * @param {string} otp
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateMfaAuthenticator(type, otp) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof type === "undefined") {
        throw new AppwriteException('Missing required parameter: "type"');
      }
      if (typeof otp === "undefined") {
        throw new AppwriteException('Missing required parameter: "otp"');
      }
      const apiPath = "/account/mfa/authenticators/{type}".replace("{type}", type);
      const payload = {};
      if (typeof otp !== "undefined") {
        payload["otp"] = otp;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Delete Authenticator
   *
   * Delete an authenticator for a user by ID.
   *
   * @param {AuthenticatorType} type
   * @param {string} otp
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  deleteMfaAuthenticator(type, otp) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof type === "undefined") {
        throw new AppwriteException('Missing required parameter: "type"');
      }
      if (typeof otp === "undefined") {
        throw new AppwriteException('Missing required parameter: "otp"');
      }
      const apiPath = "/account/mfa/authenticators/{type}".replace("{type}", type);
      const payload = {};
      if (typeof otp !== "undefined") {
        payload["otp"] = otp;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("delete", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create 2FA Challenge
   *
   * Begin the process of MFA verification after sign-in. Finish the flow with
   * [updateMfaChallenge](/docs/references/cloud/client-web/account#updateMfaChallenge)
   * method.
   *
   * @param {AuthenticationFactor} factor
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createMfaChallenge(factor) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof factor === "undefined") {
        throw new AppwriteException('Missing required parameter: "factor"');
      }
      const apiPath = "/account/mfa/challenge";
      const payload = {};
      if (typeof factor !== "undefined") {
        payload["factor"] = factor;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create MFA Challenge (confirmation)
   *
   * Complete the MFA challenge by providing the one-time password. Finish the
   * process of MFA verification by providing the one-time password. To begin
   * the flow, use
   * [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge)
   * method.
   *
   * @param {string} challengeId
   * @param {string} otp
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateMfaChallenge(challengeId, otp) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof challengeId === "undefined") {
        throw new AppwriteException('Missing required parameter: "challengeId"');
      }
      if (typeof otp === "undefined") {
        throw new AppwriteException('Missing required parameter: "otp"');
      }
      const apiPath = "/account/mfa/challenge";
      const payload = {};
      if (typeof challengeId !== "undefined") {
        payload["challengeId"] = challengeId;
      }
      if (typeof otp !== "undefined") {
        payload["otp"] = otp;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * List Factors
   *
   * List the factors available on the account to be used as a MFA challange.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  listMfaFactors() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/mfa/factors";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Get MFA Recovery Codes
   *
   * Get recovery codes that can be used as backup for MFA flow. Before getting
   * codes, they must be generated using
   * [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes)
   * method. An OTP challenge is required to read recovery codes.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  getMfaRecoveryCodes() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/mfa/recovery-codes";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create MFA Recovery Codes
   *
   * Generate recovery codes as backup for MFA flow. It's recommended to
   * generate and show then immediately after user successfully adds their
   * authehticator. Recovery codes can be used as a MFA verification type in
   * [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge)
   * method.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createMfaRecoveryCodes() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/mfa/recovery-codes";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Regenerate MFA Recovery Codes
   *
   * Regenerate recovery codes that can be used as backup for MFA flow. Before
   * regenerating codes, they must be first generated using
   * [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes)
   * method. An OTP challenge is required to regenreate recovery codes.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateMfaRecoveryCodes() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/mfa/recovery-codes";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update name
   *
   * Update currently logged in user account name.
   *
   * @param {string} name
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateName(name) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof name === "undefined") {
        throw new AppwriteException('Missing required parameter: "name"');
      }
      const apiPath = "/account/name";
      const payload = {};
      if (typeof name !== "undefined") {
        payload["name"] = name;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update password
   *
   * Update currently logged in user password. For validation, user is required
   * to pass in the new password, and the old password. For users created with
   * OAuth, Team Invites and Magic URL, oldPassword is optional.
   *
   * @param {string} password
   * @param {string} oldPassword
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updatePassword(password, oldPassword) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      const apiPath = "/account/password";
      const payload = {};
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      if (typeof oldPassword !== "undefined") {
        payload["oldPassword"] = oldPassword;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update phone
   *
   * Update the currently logged in user's phone number. After updating the
   * phone number, the phone verification status will be reset. A confirmation
   * SMS is not sent automatically, however you can use the [POST
   * /account/verification/phone](https://appwrite.io/docs/references/cloud/client-web/account#createPhoneVerification)
   * endpoint to send a confirmation SMS.
   *
   * @param {string} phone
   * @param {string} password
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updatePhone(phone, password) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof phone === "undefined") {
        throw new AppwriteException('Missing required parameter: "phone"');
      }
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      const apiPath = "/account/phone";
      const payload = {};
      if (typeof phone !== "undefined") {
        payload["phone"] = phone;
      }
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Get account preferences
   *
   * Get the preferences as a key-value object for the currently logged in user.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  getPrefs() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/prefs";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update preferences
   *
   * Update currently logged in user account preferences. The object you pass is
   * stored as is, and replaces any previous value. The maximum allowed prefs
   * size is 64kB and throws error if exceeded.
   *
   * @param {Partial<Preferences>} prefs
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updatePrefs(prefs) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof prefs === "undefined") {
        throw new AppwriteException('Missing required parameter: "prefs"');
      }
      const apiPath = "/account/prefs";
      const payload = {};
      if (typeof prefs !== "undefined") {
        payload["prefs"] = prefs;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create password recovery
   *
   * Sends the user an email with a temporary secret key for password reset.
   * When the user clicks the confirmation link he is redirected back to your
   * app password reset URL with the secret key and email address values
   * attached to the URL query string. Use the query string params to submit a
   * request to the [PUT
   * /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#updateRecovery)
   * endpoint to complete the process. The verification link sent to the user's
   * email address is valid for 1 hour.
   *
   * @param {string} email
   * @param {string} url
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createRecovery(email, url) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof email === "undefined") {
        throw new AppwriteException('Missing required parameter: "email"');
      }
      if (typeof url === "undefined") {
        throw new AppwriteException('Missing required parameter: "url"');
      }
      const apiPath = "/account/recovery";
      const payload = {};
      if (typeof email !== "undefined") {
        payload["email"] = email;
      }
      if (typeof url !== "undefined") {
        payload["url"] = url;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create password recovery (confirmation)
   *
   * Use this endpoint to complete the user account password reset. Both the
   * **userId** and **secret** arguments will be passed as query parameters to
   * the redirect URL you have provided when sending your request to the [POST
   * /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#createRecovery)
   * endpoint.
   *
   * Please note that in order to avoid a [Redirect
   * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md)
   * the only valid redirect URLs are the ones from domains you have set when
   * adding your platforms in the console interface.
   *
   * @param {string} userId
   * @param {string} secret
   * @param {string} password
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateRecovery(userId, secret, password) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof secret === "undefined") {
        throw new AppwriteException('Missing required parameter: "secret"');
      }
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      const apiPath = "/account/recovery";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof secret !== "undefined") {
        payload["secret"] = secret;
      }
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * List sessions
   *
   * Get the list of active sessions across different devices for the currently
   * logged in user.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  listSessions() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/sessions";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Delete sessions
   *
   * Delete all sessions from the user account and remove any sessions cookies
   * from the end client.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  deleteSessions() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/sessions";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("delete", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create anonymous session
   *
   * Use this endpoint to allow a new user to register an anonymous account in
   * your project. This route will also create a new session for the user. To
   * allow the new user to convert an anonymous account to a normal account, you
   * need to update its [email and
   * password](https://appwrite.io/docs/references/cloud/client-web/account#updateEmail)
   * or create an [OAuth2
   * session](https://appwrite.io/docs/references/cloud/client-web/account#CreateOAuth2Session).
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createAnonymousSession() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/sessions/anonymous";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create email password session
   *
   * Allow the user to login into their account by providing a valid email and
   * password combination. This route will create a new session for the user.
   *
   * A user is limited to 10 active sessions at a time by default. [Learn more
   * about session
   * limits](https://appwrite.io/docs/authentication-security#limits).
   *
   * @param {string} email
   * @param {string} password
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createEmailPasswordSession(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof email === "undefined") {
        throw new AppwriteException('Missing required parameter: "email"');
      }
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      const apiPath = "/account/sessions/email";
      const payload = {};
      if (typeof email !== "undefined") {
        payload["email"] = email;
      }
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update magic URL session
   *
   * Use this endpoint to create a session from token. Provide the **userId**
   * and **secret** parameters from the successful response of authentication
   * flows initiated by token creation. For example, magic URL and phone login.
   *
   * @param {string} userId
   * @param {string} secret
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateMagicURLSession(userId, secret) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof secret === "undefined") {
        throw new AppwriteException('Missing required parameter: "secret"');
      }
      const apiPath = "/account/sessions/magic-url";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof secret !== "undefined") {
        payload["secret"] = secret;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create OAuth2 session
   *
   * Allow the user to login to their account using the OAuth2 provider of their
   * choice. Each OAuth2 provider should be enabled from the Appwrite console
   * first. Use the success and failure arguments to provide a redirect URL's
   * back to your app when login is completed.
   *
   * If there is already an active session, the new session will be attached to
   * the logged-in account. If there are no active sessions, the server will
   * attempt to look for a user with the same email address as the email
   * received from the OAuth2 provider and attach the new session to the
   * existing user. If no matching user is found - the server will create a new
   * user.
   *
   * A user is limited to 10 active sessions at a time by default. [Learn more
   * about session
   * limits](https://appwrite.io/docs/authentication-security#limits).
   *
   *
   * @param {OAuthProvider} provider
   * @param {string} success
   * @param {string} failure
   * @param {string[]} scopes
   * @throws {AppwriteException}
   * @returns {void|string}
  */
  createOAuth2Session(provider, success, failure, scopes) {
    if (typeof provider === "undefined") {
      throw new AppwriteException('Missing required parameter: "provider"');
    }
    const apiPath = "/account/sessions/oauth2/{provider}".replace("{provider}", provider);
    const payload = {};
    if (typeof success !== "undefined") {
      payload["success"] = success;
    }
    if (typeof failure !== "undefined") {
      payload["failure"] = failure;
    }
    if (typeof scopes !== "undefined") {
      payload["scopes"] = scopes;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    payload["project"] = this.client.config.project;
    for (const [key, value] of Object.entries(Service.flatten(payload))) {
      uri.searchParams.append(key, value);
    }
    if (typeof window !== "undefined" && (window === null || window === void 0 ? void 0 : window.location)) {
      window.location.href = uri.toString();
    } else {
      return uri;
    }
  }
  /**
   * Update phone session
   *
   * Use this endpoint to create a session from token. Provide the **userId**
   * and **secret** parameters from the successful response of authentication
   * flows initiated by token creation. For example, magic URL and phone login.
   *
   * @param {string} userId
   * @param {string} secret
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updatePhoneSession(userId, secret) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof secret === "undefined") {
        throw new AppwriteException('Missing required parameter: "secret"');
      }
      const apiPath = "/account/sessions/phone";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof secret !== "undefined") {
        payload["secret"] = secret;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create session
   *
   * Use this endpoint to create a session from token. Provide the **userId**
   * and **secret** parameters from the successful response of authentication
   * flows initiated by token creation. For example, magic URL and phone login.
   *
   * @param {string} userId
   * @param {string} secret
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createSession(userId, secret) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof secret === "undefined") {
        throw new AppwriteException('Missing required parameter: "secret"');
      }
      const apiPath = "/account/sessions/token";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof secret !== "undefined") {
        payload["secret"] = secret;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Get session
   *
   * Use this endpoint to get a logged in user's session using a Session ID.
   * Inputting 'current' will return the current session being used.
   *
   * @param {string} sessionId
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  getSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof sessionId === "undefined") {
        throw new AppwriteException('Missing required parameter: "sessionId"');
      }
      const apiPath = "/account/sessions/{sessionId}".replace("{sessionId}", sessionId);
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update session
   *
   * Use this endpoint to extend a session's length. Extending a session is
   * useful when session expiry is short. If the session was created using an
   * OAuth provider, this endpoint refreshes the access token from the provider.
   *
   * @param {string} sessionId
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof sessionId === "undefined") {
        throw new AppwriteException('Missing required parameter: "sessionId"');
      }
      const apiPath = "/account/sessions/{sessionId}".replace("{sessionId}", sessionId);
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Delete session
   *
   * Logout the user. Use 'current' as the session ID to logout on this device,
   * use a session ID to logout on another device. If you're looking to logout
   * the user on all devices, use [Delete
   * Sessions](https://appwrite.io/docs/references/cloud/client-web/account#deleteSessions)
   * instead.
   *
   * @param {string} sessionId
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  deleteSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof sessionId === "undefined") {
        throw new AppwriteException('Missing required parameter: "sessionId"');
      }
      const apiPath = "/account/sessions/{sessionId}".replace("{sessionId}", sessionId);
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("delete", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update status
   *
   * Block the currently logged in user account. Behind the scene, the user
   * record is not deleted but permanently blocked from any access. To
   * completely delete a user, use the Users API instead.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateStatus() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/status";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create push target
   *
   *
   * @param {string} targetId
   * @param {string} identifier
   * @param {string} providerId
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createPushTarget(targetId, identifier, providerId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof targetId === "undefined") {
        throw new AppwriteException('Missing required parameter: "targetId"');
      }
      if (typeof identifier === "undefined") {
        throw new AppwriteException('Missing required parameter: "identifier"');
      }
      const apiPath = "/account/targets/push";
      const payload = {};
      if (typeof targetId !== "undefined") {
        payload["targetId"] = targetId;
      }
      if (typeof identifier !== "undefined") {
        payload["identifier"] = identifier;
      }
      if (typeof providerId !== "undefined") {
        payload["providerId"] = providerId;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update push target
   *
   *
   * @param {string} targetId
   * @param {string} identifier
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updatePushTarget(targetId, identifier) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof targetId === "undefined") {
        throw new AppwriteException('Missing required parameter: "targetId"');
      }
      if (typeof identifier === "undefined") {
        throw new AppwriteException('Missing required parameter: "identifier"');
      }
      const apiPath = "/account/targets/{targetId}/push".replace("{targetId}", targetId);
      const payload = {};
      if (typeof identifier !== "undefined") {
        payload["identifier"] = identifier;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Delete push target
   *
   *
   * @param {string} targetId
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  deletePushTarget(targetId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof targetId === "undefined") {
        throw new AppwriteException('Missing required parameter: "targetId"');
      }
      const apiPath = "/account/targets/{targetId}/push".replace("{targetId}", targetId);
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("delete", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create email token (OTP)
   *
   * Sends the user an email with a secret key for creating a session. If the
   * provided user ID has not be registered, a new user will be created. Use the
   * returned user ID and secret and submit a request to the [POST
   * /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession)
   * endpoint to complete the login process. The secret sent to the user's email
   * is valid for 15 minutes.
   *
   * A user is limited to 10 active sessions at a time by default. [Learn more
   * about session
   * limits](https://appwrite.io/docs/authentication-security#limits).
   *
   * @param {string} userId
   * @param {string} email
   * @param {boolean} phrase
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createEmailToken(userId, email, phrase) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof email === "undefined") {
        throw new AppwriteException('Missing required parameter: "email"');
      }
      const apiPath = "/account/tokens/email";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof email !== "undefined") {
        payload["email"] = email;
      }
      if (typeof phrase !== "undefined") {
        payload["phrase"] = phrase;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create magic URL token
   *
   * Sends the user an email with a secret key for creating a session. If the
   * provided user ID has not been registered, a new user will be created. When
   * the user clicks the link in the email, the user is redirected back to the
   * URL you provided with the secret key and userId values attached to the URL
   * query string. Use the query string parameters to submit a request to the
   * [POST
   * /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession)
   * endpoint to complete the login process. The link sent to the user's email
   * address is valid for 1 hour. If you are on a mobile device you can leave
   * the URL parameter empty, so that the login completion will be handled by
   * your Appwrite instance by default.
   *
   * A user is limited to 10 active sessions at a time by default. [Learn more
   * about session
   * limits](https://appwrite.io/docs/authentication-security#limits).
   *
   *
   * @param {string} userId
   * @param {string} email
   * @param {string} url
   * @param {boolean} phrase
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createMagicURLToken(userId, email, url, phrase) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof email === "undefined") {
        throw new AppwriteException('Missing required parameter: "email"');
      }
      const apiPath = "/account/tokens/magic-url";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof email !== "undefined") {
        payload["email"] = email;
      }
      if (typeof url !== "undefined") {
        payload["url"] = url;
      }
      if (typeof phrase !== "undefined") {
        payload["phrase"] = phrase;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create OAuth2 token
   *
   * Allow the user to login to their account using the OAuth2 provider of their
   * choice. Each OAuth2 provider should be enabled from the Appwrite console
   * first. Use the success and failure arguments to provide a redirect URL's
   * back to your app when login is completed.
   *
   * If authentication succeeds, `userId` and `secret` of a token will be
   * appended to the success URL as query parameters. These can be used to
   * create a new session using the [Create
   * session](https://appwrite.io/docs/references/cloud/client-web/account#createSession)
   * endpoint.
   *
   * A user is limited to 10 active sessions at a time by default. [Learn more
   * about session
   * limits](https://appwrite.io/docs/authentication-security#limits).
   *
   * @param {OAuthProvider} provider
   * @param {string} success
   * @param {string} failure
   * @param {string[]} scopes
   * @throws {AppwriteException}
   * @returns {void|string}
  */
  createOAuth2Token(provider, success, failure, scopes) {
    if (typeof provider === "undefined") {
      throw new AppwriteException('Missing required parameter: "provider"');
    }
    const apiPath = "/account/tokens/oauth2/{provider}".replace("{provider}", provider);
    const payload = {};
    if (typeof success !== "undefined") {
      payload["success"] = success;
    }
    if (typeof failure !== "undefined") {
      payload["failure"] = failure;
    }
    if (typeof scopes !== "undefined") {
      payload["scopes"] = scopes;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    payload["project"] = this.client.config.project;
    for (const [key, value] of Object.entries(Service.flatten(payload))) {
      uri.searchParams.append(key, value);
    }
    if (typeof window !== "undefined" && (window === null || window === void 0 ? void 0 : window.location)) {
      window.location.href = uri.toString();
    } else {
      return uri;
    }
  }
  /**
   * Create phone token
   *
   * Sends the user an SMS with a secret key for creating a session. If the
   * provided user ID has not be registered, a new user will be created. Use the
   * returned user ID and secret and submit a request to the [POST
   * /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession)
   * endpoint to complete the login process. The secret sent to the user's phone
   * is valid for 15 minutes.
   *
   * A user is limited to 10 active sessions at a time by default. [Learn more
   * about session
   * limits](https://appwrite.io/docs/authentication-security#limits).
   *
   * @param {string} userId
   * @param {string} phone
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createPhoneToken(userId, phone) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof phone === "undefined") {
        throw new AppwriteException('Missing required parameter: "phone"');
      }
      const apiPath = "/account/tokens/phone";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof phone !== "undefined") {
        payload["phone"] = phone;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create email verification
   *
   * Use this endpoint to send a verification message to your user email address
   * to confirm they are the valid owners of that address. Both the **userId**
   * and **secret** arguments will be passed as query parameters to the URL you
   * have provided to be attached to the verification email. The provided URL
   * should redirect the user back to your app and allow you to complete the
   * verification process by verifying both the **userId** and **secret**
   * parameters. Learn more about how to [complete the verification
   * process](https://appwrite.io/docs/references/cloud/client-web/account#updateVerification).
   * The verification link sent to the user's email address is valid for 7 days.
   *
   * Please note that in order to avoid a [Redirect
   * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md),
   * the only valid redirect URLs are the ones from domains you have set when
   * adding your platforms in the console interface.
   *
   *
   * @param {string} url
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createVerification(url) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof url === "undefined") {
        throw new AppwriteException('Missing required parameter: "url"');
      }
      const apiPath = "/account/verification";
      const payload = {};
      if (typeof url !== "undefined") {
        payload["url"] = url;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create email verification (confirmation)
   *
   * Use this endpoint to complete the user email verification process. Use both
   * the **userId** and **secret** parameters that were attached to your app URL
   * to verify the user email ownership. If confirmed this route will return a
   * 200 status code.
   *
   * @param {string} userId
   * @param {string} secret
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateVerification(userId, secret) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof secret === "undefined") {
        throw new AppwriteException('Missing required parameter: "secret"');
      }
      const apiPath = "/account/verification";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof secret !== "undefined") {
        payload["secret"] = secret;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create phone verification
   *
   * Use this endpoint to send a verification SMS to the currently logged in
   * user. This endpoint is meant for use after updating a user's phone number
   * using the
   * [accountUpdatePhone](https://appwrite.io/docs/references/cloud/client-web/account#updatePhone)
   * endpoint. Learn more about how to [complete the verification
   * process](https://appwrite.io/docs/references/cloud/client-web/account#updatePhoneVerification).
   * The verification code sent to the user's phone number is valid for 15
   * minutes.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createPhoneVerification() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/verification/phone";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create phone verification (confirmation)
   *
   * Use this endpoint to complete the user phone verification process. Use the
   * **userId** and **secret** that were sent to your user's phone number to
   * verify the user email ownership. If confirmed this route will return a 200
   * status code.
   *
   * @param {string} userId
   * @param {string} secret
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updatePhoneVerification(userId, secret) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof secret === "undefined") {
        throw new AppwriteException('Missing required parameter: "secret"');
      }
      const apiPath = "/account/verification/phone";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof secret !== "undefined") {
        payload["secret"] = secret;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
}
class Databases extends Service {
  constructor(client2) {
    super(client2);
  }
  /**
   * List documents
   *
   * Get a list of all the user's documents in a given collection. You can use
   * the query params to filter your results.
   *
   * @param {string} databaseId
   * @param {string} collectionId
   * @param {string[]} queries
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  listDocuments(databaseId2, collectionId, queries) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof databaseId2 === "undefined") {
        throw new AppwriteException('Missing required parameter: "databaseId"');
      }
      if (typeof collectionId === "undefined") {
        throw new AppwriteException('Missing required parameter: "collectionId"');
      }
      const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents".replace("{databaseId}", databaseId2).replace("{collectionId}", collectionId);
      const payload = {};
      if (typeof queries !== "undefined") {
        payload["queries"] = queries;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create document
   *
   * Create a new Document. Before using this route, you should create a new
   * collection resource using either a [server
   * integration](https://appwrite.io/docs/server/databases#databasesCreateCollection)
   * API or directly from your database console.
   *
   * @param {string} databaseId
   * @param {string} collectionId
   * @param {string} documentId
   * @param {Omit<Document, keyof Models.Document>} data
   * @param {string[]} permissions
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createDocument(databaseId2, collectionId, documentId, data, permissions) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof databaseId2 === "undefined") {
        throw new AppwriteException('Missing required parameter: "databaseId"');
      }
      if (typeof collectionId === "undefined") {
        throw new AppwriteException('Missing required parameter: "collectionId"');
      }
      if (typeof documentId === "undefined") {
        throw new AppwriteException('Missing required parameter: "documentId"');
      }
      if (typeof data === "undefined") {
        throw new AppwriteException('Missing required parameter: "data"');
      }
      const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents".replace("{databaseId}", databaseId2).replace("{collectionId}", collectionId);
      const payload = {};
      if (typeof documentId !== "undefined") {
        payload["documentId"] = documentId;
      }
      if (typeof data !== "undefined") {
        payload["data"] = data;
      }
      if (typeof permissions !== "undefined") {
        payload["permissions"] = permissions;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Get document
   *
   * Get a document by its unique ID. This endpoint response returns a JSON
   * object with the document data.
   *
   * @param {string} databaseId
   * @param {string} collectionId
   * @param {string} documentId
   * @param {string[]} queries
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  getDocument(databaseId2, collectionId, documentId, queries) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof databaseId2 === "undefined") {
        throw new AppwriteException('Missing required parameter: "databaseId"');
      }
      if (typeof collectionId === "undefined") {
        throw new AppwriteException('Missing required parameter: "collectionId"');
      }
      if (typeof documentId === "undefined") {
        throw new AppwriteException('Missing required parameter: "documentId"');
      }
      const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}".replace("{databaseId}", databaseId2).replace("{collectionId}", collectionId).replace("{documentId}", documentId);
      const payload = {};
      if (typeof queries !== "undefined") {
        payload["queries"] = queries;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update document
   *
   * Update a document by its unique ID. Using the patch method you can pass
   * only specific fields that will get updated.
   *
   * @param {string} databaseId
   * @param {string} collectionId
   * @param {string} documentId
   * @param {Partial<Omit<Document, keyof Models.Document>>} data
   * @param {string[]} permissions
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateDocument(databaseId2, collectionId, documentId, data, permissions) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof databaseId2 === "undefined") {
        throw new AppwriteException('Missing required parameter: "databaseId"');
      }
      if (typeof collectionId === "undefined") {
        throw new AppwriteException('Missing required parameter: "collectionId"');
      }
      if (typeof documentId === "undefined") {
        throw new AppwriteException('Missing required parameter: "documentId"');
      }
      const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}".replace("{databaseId}", databaseId2).replace("{collectionId}", collectionId).replace("{documentId}", documentId);
      const payload = {};
      if (typeof data !== "undefined") {
        payload["data"] = data;
      }
      if (typeof permissions !== "undefined") {
        payload["permissions"] = permissions;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Delete document
   *
   * Delete a document by its unique ID.
   *
   * @param {string} databaseId
   * @param {string} collectionId
   * @param {string} documentId
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  deleteDocument(databaseId2, collectionId, documentId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof databaseId2 === "undefined") {
        throw new AppwriteException('Missing required parameter: "databaseId"');
      }
      if (typeof collectionId === "undefined") {
        throw new AppwriteException('Missing required parameter: "collectionId"');
      }
      if (typeof documentId === "undefined") {
        throw new AppwriteException('Missing required parameter: "documentId"');
      }
      const apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}".replace("{databaseId}", databaseId2).replace("{collectionId}", collectionId).replace("{documentId}", documentId);
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("delete", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
}
var _a, _ID_hexTimestamp;
class ID {
  static custom(id) {
    return id;
  }
  static unique(padding = 7) {
    const baseId = __classPrivateFieldGet(ID, _a, "m", _ID_hexTimestamp).call(ID);
    let randomPadding = "";
    for (let i = 0; i < padding; i++) {
      const randomHexDigit = Math.floor(Math.random() * 16).toString(16);
      randomPadding += randomHexDigit;
    }
    return baseId + randomPadding;
  }
}
_a = ID, _ID_hexTimestamp = function _ID_hexTimestamp2() {
  const now = /* @__PURE__ */ new Date();
  const sec = Math.floor(now.getTime() / 1e3);
  const msec = now.getMilliseconds();
  const hexTimestamp = sec.toString(16) + msec.toString(16).padStart(5, "0");
  return hexTimestamp;
};
var AuthenticatorType;
(function(AuthenticatorType2) {
  AuthenticatorType2["Totp"] = "totp";
})(AuthenticatorType || (AuthenticatorType = {}));
var AuthenticationFactor;
(function(AuthenticationFactor2) {
  AuthenticationFactor2["Email"] = "email";
  AuthenticationFactor2["Phone"] = "phone";
  AuthenticationFactor2["Totp"] = "totp";
  AuthenticationFactor2["Recoverycode"] = "recoverycode";
})(AuthenticationFactor || (AuthenticationFactor = {}));
var OAuthProvider;
(function(OAuthProvider2) {
  OAuthProvider2["Amazon"] = "amazon";
  OAuthProvider2["Apple"] = "apple";
  OAuthProvider2["Auth0"] = "auth0";
  OAuthProvider2["Authentik"] = "authentik";
  OAuthProvider2["Autodesk"] = "autodesk";
  OAuthProvider2["Bitbucket"] = "bitbucket";
  OAuthProvider2["Bitly"] = "bitly";
  OAuthProvider2["Box"] = "box";
  OAuthProvider2["Dailymotion"] = "dailymotion";
  OAuthProvider2["Discord"] = "discord";
  OAuthProvider2["Disqus"] = "disqus";
  OAuthProvider2["Dropbox"] = "dropbox";
  OAuthProvider2["Etsy"] = "etsy";
  OAuthProvider2["Facebook"] = "facebook";
  OAuthProvider2["Github"] = "github";
  OAuthProvider2["Gitlab"] = "gitlab";
  OAuthProvider2["Google"] = "google";
  OAuthProvider2["Linkedin"] = "linkedin";
  OAuthProvider2["Microsoft"] = "microsoft";
  OAuthProvider2["Notion"] = "notion";
  OAuthProvider2["Oidc"] = "oidc";
  OAuthProvider2["Okta"] = "okta";
  OAuthProvider2["Paypal"] = "paypal";
  OAuthProvider2["PaypalSandbox"] = "paypalSandbox";
  OAuthProvider2["Podio"] = "podio";
  OAuthProvider2["Salesforce"] = "salesforce";
  OAuthProvider2["Slack"] = "slack";
  OAuthProvider2["Spotify"] = "spotify";
  OAuthProvider2["Stripe"] = "stripe";
  OAuthProvider2["Tradeshift"] = "tradeshift";
  OAuthProvider2["TradeshiftBox"] = "tradeshiftBox";
  OAuthProvider2["Twitch"] = "twitch";
  OAuthProvider2["Wordpress"] = "wordpress";
  OAuthProvider2["Yahoo"] = "yahoo";
  OAuthProvider2["Yammer"] = "yammer";
  OAuthProvider2["Yandex"] = "yandex";
  OAuthProvider2["Zoho"] = "zoho";
  OAuthProvider2["Zoom"] = "zoom";
  OAuthProvider2["Mock"] = "mock";
})(OAuthProvider || (OAuthProvider = {}));
var Browser;
(function(Browser2) {
  Browser2["AvantBrowser"] = "aa";
  Browser2["AndroidWebViewBeta"] = "an";
  Browser2["GoogleChrome"] = "ch";
  Browser2["GoogleChromeIOS"] = "ci";
  Browser2["GoogleChromeMobile"] = "cm";
  Browser2["Chromium"] = "cr";
  Browser2["MozillaFirefox"] = "ff";
  Browser2["Safari"] = "sf";
  Browser2["MobileSafari"] = "mf";
  Browser2["MicrosoftEdge"] = "ps";
  Browser2["MicrosoftEdgeIOS"] = "oi";
  Browser2["OperaMini"] = "om";
  Browser2["Opera"] = "op";
  Browser2["OperaNext"] = "on";
})(Browser || (Browser = {}));
var CreditCard;
(function(CreditCard2) {
  CreditCard2["AmericanExpress"] = "amex";
  CreditCard2["Argencard"] = "argencard";
  CreditCard2["Cabal"] = "cabal";
  CreditCard2["Consosud"] = "censosud";
  CreditCard2["DinersClub"] = "diners";
  CreditCard2["Discover"] = "discover";
  CreditCard2["Elo"] = "elo";
  CreditCard2["Hipercard"] = "hipercard";
  CreditCard2["JCB"] = "jcb";
  CreditCard2["Mastercard"] = "mastercard";
  CreditCard2["Naranja"] = "naranja";
  CreditCard2["TarjetaShopping"] = "targeta-shopping";
  CreditCard2["UnionChinaPay"] = "union-china-pay";
  CreditCard2["Visa"] = "visa";
  CreditCard2["MIR"] = "mir";
  CreditCard2["Maestro"] = "maestro";
})(CreditCard || (CreditCard = {}));
var Flag;
(function(Flag2) {
  Flag2["Afghanistan"] = "af";
  Flag2["Angola"] = "ao";
  Flag2["Albania"] = "al";
  Flag2["Andorra"] = "ad";
  Flag2["UnitedArabEmirates"] = "ae";
  Flag2["Argentina"] = "ar";
  Flag2["Armenia"] = "am";
  Flag2["AntiguaAndBarbuda"] = "ag";
  Flag2["Australia"] = "au";
  Flag2["Austria"] = "at";
  Flag2["Azerbaijan"] = "az";
  Flag2["Burundi"] = "bi";
  Flag2["Belgium"] = "be";
  Flag2["Benin"] = "bj";
  Flag2["BurkinaFaso"] = "bf";
  Flag2["Bangladesh"] = "bd";
  Flag2["Bulgaria"] = "bg";
  Flag2["Bahrain"] = "bh";
  Flag2["Bahamas"] = "bs";
  Flag2["BosniaAndHerzegovina"] = "ba";
  Flag2["Belarus"] = "by";
  Flag2["Belize"] = "bz";
  Flag2["Bolivia"] = "bo";
  Flag2["Brazil"] = "br";
  Flag2["Barbados"] = "bb";
  Flag2["BruneiDarussalam"] = "bn";
  Flag2["Bhutan"] = "bt";
  Flag2["Botswana"] = "bw";
  Flag2["CentralAfricanRepublic"] = "cf";
  Flag2["Canada"] = "ca";
  Flag2["Switzerland"] = "ch";
  Flag2["Chile"] = "cl";
  Flag2["China"] = "cn";
  Flag2["CoteDIvoire"] = "ci";
  Flag2["Cameroon"] = "cm";
  Flag2["DemocraticRepublicOfTheCongo"] = "cd";
  Flag2["RepublicOfTheCongo"] = "cg";
  Flag2["Colombia"] = "co";
  Flag2["Comoros"] = "km";
  Flag2["CapeVerde"] = "cv";
  Flag2["CostaRica"] = "cr";
  Flag2["Cuba"] = "cu";
  Flag2["Cyprus"] = "cy";
  Flag2["CzechRepublic"] = "cz";
  Flag2["Germany"] = "de";
  Flag2["Djibouti"] = "dj";
  Flag2["Dominica"] = "dm";
  Flag2["Denmark"] = "dk";
  Flag2["DominicanRepublic"] = "do";
  Flag2["Algeria"] = "dz";
  Flag2["Ecuador"] = "ec";
  Flag2["Egypt"] = "eg";
  Flag2["Eritrea"] = "er";
  Flag2["Spain"] = "es";
  Flag2["Estonia"] = "ee";
  Flag2["Ethiopia"] = "et";
  Flag2["Finland"] = "fi";
  Flag2["Fiji"] = "fj";
  Flag2["France"] = "fr";
  Flag2["MicronesiaFederatedStatesOf"] = "fm";
  Flag2["Gabon"] = "ga";
  Flag2["UnitedKingdom"] = "gb";
  Flag2["Georgia"] = "ge";
  Flag2["Ghana"] = "gh";
  Flag2["Guinea"] = "gn";
  Flag2["Gambia"] = "gm";
  Flag2["GuineaBissau"] = "gw";
  Flag2["EquatorialGuinea"] = "gq";
  Flag2["Greece"] = "gr";
  Flag2["Grenada"] = "gd";
  Flag2["Guatemala"] = "gt";
  Flag2["Guyana"] = "gy";
  Flag2["Honduras"] = "hn";
  Flag2["Croatia"] = "hr";
  Flag2["Haiti"] = "ht";
  Flag2["Hungary"] = "hu";
  Flag2["Indonesia"] = "id";
  Flag2["India"] = "in";
  Flag2["Ireland"] = "ie";
  Flag2["IranIslamicRepublicOf"] = "ir";
  Flag2["Iraq"] = "iq";
  Flag2["Iceland"] = "is";
  Flag2["Israel"] = "il";
  Flag2["Italy"] = "it";
  Flag2["Jamaica"] = "jm";
  Flag2["Jordan"] = "jo";
  Flag2["Japan"] = "jp";
  Flag2["Kazakhstan"] = "kz";
  Flag2["Kenya"] = "ke";
  Flag2["Kyrgyzstan"] = "kg";
  Flag2["Cambodia"] = "kh";
  Flag2["Kiribati"] = "ki";
  Flag2["SaintKittsAndNevis"] = "kn";
  Flag2["SouthKorea"] = "kr";
  Flag2["Kuwait"] = "kw";
  Flag2["LaoPeopleSDemocraticRepublic"] = "la";
  Flag2["Lebanon"] = "lb";
  Flag2["Liberia"] = "lr";
  Flag2["Libya"] = "ly";
  Flag2["SaintLucia"] = "lc";
  Flag2["Liechtenstein"] = "li";
  Flag2["SriLanka"] = "lk";
  Flag2["Lesotho"] = "ls";
  Flag2["Lithuania"] = "lt";
  Flag2["Luxembourg"] = "lu";
  Flag2["Latvia"] = "lv";
  Flag2["Morocco"] = "ma";
  Flag2["Monaco"] = "mc";
  Flag2["Moldova"] = "md";
  Flag2["Madagascar"] = "mg";
  Flag2["Maldives"] = "mv";
  Flag2["Mexico"] = "mx";
  Flag2["MarshallIslands"] = "mh";
  Flag2["NorthMacedonia"] = "mk";
  Flag2["Mali"] = "ml";
  Flag2["Malta"] = "mt";
  Flag2["Myanmar"] = "mm";
  Flag2["Montenegro"] = "me";
  Flag2["Mongolia"] = "mn";
  Flag2["Mozambique"] = "mz";
  Flag2["Mauritania"] = "mr";
  Flag2["Mauritius"] = "mu";
  Flag2["Malawi"] = "mw";
  Flag2["Malaysia"] = "my";
  Flag2["Namibia"] = "na";
  Flag2["Niger"] = "ne";
  Flag2["Nigeria"] = "ng";
  Flag2["Nicaragua"] = "ni";
  Flag2["Netherlands"] = "nl";
  Flag2["Norway"] = "no";
  Flag2["Nepal"] = "np";
  Flag2["Nauru"] = "nr";
  Flag2["NewZealand"] = "nz";
  Flag2["Oman"] = "om";
  Flag2["Pakistan"] = "pk";
  Flag2["Panama"] = "pa";
  Flag2["Peru"] = "pe";
  Flag2["Philippines"] = "ph";
  Flag2["Palau"] = "pw";
  Flag2["PapuaNewGuinea"] = "pg";
  Flag2["Poland"] = "pl";
  Flag2["NorthKorea"] = "kp";
  Flag2["Portugal"] = "pt";
  Flag2["Paraguay"] = "py";
  Flag2["Qatar"] = "qa";
  Flag2["Romania"] = "ro";
  Flag2["Russia"] = "ru";
  Flag2["Rwanda"] = "rw";
  Flag2["SaudiArabia"] = "sa";
  Flag2["Sudan"] = "sd";
  Flag2["Senegal"] = "sn";
  Flag2["Singapore"] = "sg";
  Flag2["SolomonIslands"] = "sb";
  Flag2["SierraLeone"] = "sl";
  Flag2["ElSalvador"] = "sv";
  Flag2["SanMarino"] = "sm";
  Flag2["Somalia"] = "so";
  Flag2["Serbia"] = "rs";
  Flag2["SouthSudan"] = "ss";
  Flag2["SaoTomeAndPrincipe"] = "st";
  Flag2["Suriname"] = "sr";
  Flag2["Slovakia"] = "sk";
  Flag2["Slovenia"] = "si";
  Flag2["Sweden"] = "se";
  Flag2["Eswatini"] = "sz";
  Flag2["Seychelles"] = "sc";
  Flag2["Syria"] = "sy";
  Flag2["Chad"] = "td";
  Flag2["Togo"] = "tg";
  Flag2["Thailand"] = "th";
  Flag2["Tajikistan"] = "tj";
  Flag2["Turkmenistan"] = "tm";
  Flag2["TimorLeste"] = "tl";
  Flag2["Tonga"] = "to";
  Flag2["TrinidadAndTobago"] = "tt";
  Flag2["Tunisia"] = "tn";
  Flag2["Turkey"] = "tr";
  Flag2["Tuvalu"] = "tv";
  Flag2["Tanzania"] = "tz";
  Flag2["Uganda"] = "ug";
  Flag2["Ukraine"] = "ua";
  Flag2["Uruguay"] = "uy";
  Flag2["UnitedStates"] = "us";
  Flag2["Uzbekistan"] = "uz";
  Flag2["VaticanCity"] = "va";
  Flag2["SaintVincentAndTheGrenadines"] = "vc";
  Flag2["Venezuela"] = "ve";
  Flag2["Vietnam"] = "vn";
  Flag2["Vanuatu"] = "vu";
  Flag2["Samoa"] = "ws";
  Flag2["Yemen"] = "ye";
  Flag2["SouthAfrica"] = "za";
  Flag2["Zambia"] = "zm";
  Flag2["Zimbabwe"] = "zw";
})(Flag || (Flag = {}));
var ExecutionMethod;
(function(ExecutionMethod2) {
  ExecutionMethod2["GET"] = "GET";
  ExecutionMethod2["POST"] = "POST";
  ExecutionMethod2["PUT"] = "PUT";
  ExecutionMethod2["PATCH"] = "PATCH";
  ExecutionMethod2["DELETE"] = "DELETE";
  ExecutionMethod2["OPTIONS"] = "OPTIONS";
})(ExecutionMethod || (ExecutionMethod = {}));
var ImageGravity;
(function(ImageGravity2) {
  ImageGravity2["Center"] = "center";
  ImageGravity2["Topleft"] = "top-left";
  ImageGravity2["Top"] = "top";
  ImageGravity2["Topright"] = "top-right";
  ImageGravity2["Left"] = "left";
  ImageGravity2["Right"] = "right";
  ImageGravity2["Bottomleft"] = "bottom-left";
  ImageGravity2["Bottom"] = "bottom";
  ImageGravity2["Bottomright"] = "bottom-right";
})(ImageGravity || (ImageGravity = {}));
var ImageFormat;
(function(ImageFormat2) {
  ImageFormat2["Jpg"] = "jpg";
  ImageFormat2["Jpeg"] = "jpeg";
  ImageFormat2["Gif"] = "gif";
  ImageFormat2["Png"] = "png";
  ImageFormat2["Webp"] = "webp";
})(ImageFormat || (ImageFormat = {}));
const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "68e6c7fe00284317800e";
const APPWRITE_DATABASE_ID = "6990a8e0003648edd559";
const COLLECTIONS = {
  USERS: "users",
  COMMUNITIES: "communities",
  PAGES: "pages",
  REACTIONS: "reactions",
  TRENDING: "trending"
};
const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
const account = new Account(client);
const databases = new Databases(client);
const databaseId = APPWRITE_DATABASE_ID;
const STORAGE_KEYS = {
  SESSION: "emojifeed_session",
  USER: "emojifeed_user",
  SELECTED_COMMUNITY: "emojifeed_selected_community",
  SETTINGS: "emojifeed_settings"
};
async function get(key) {
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      const result = await chrome.storage.sync.get(key);
      return result[key];
    }
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Storage get error:", error);
    return null;
  }
}
async function set(key, value) {
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      await chrome.storage.sync.set({ [key]: value });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("Storage set error:", error);
  }
}
async function remove(key) {
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      await chrome.storage.sync.remove(key);
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("Storage remove error:", error);
  }
}
async function clear() {
  const keys = Object.values(STORAGE_KEYS);
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      await chrome.storage.sync.remove(keys);
    } else {
      keys.forEach((key) => localStorage.removeItem(key));
    }
  } catch (error) {
    console.error("Storage clear error:", error);
  }
}
async function getSession$1() {
  return await get(STORAGE_KEYS.SESSION);
}
async function setSession(session) {
  await set(STORAGE_KEYS.SESSION, session);
}
async function removeSession() {
  await remove(STORAGE_KEYS.SESSION);
}
async function getUser() {
  return await get(STORAGE_KEYS.USER);
}
async function setUser(user) {
  await set(STORAGE_KEYS.USER, user);
}
async function removeUser() {
  await remove(STORAGE_KEYS.USER);
}
const storageService = {
  get,
  set,
  remove,
  clear,
  getSession: getSession$1,
  setSession,
  removeSession,
  getUser,
  setUser,
  removeUser,
  STORAGE_KEYS
};
async function register(email, password, username) {
  try {
    const accountResponse = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    const userDoc = await databases.createDocument(
      databaseId,
      COLLECTIONS.USERS,
      ID.unique(),
      {
        userId: accountResponse.$id,
        username,
        email,
        communities: [],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
    const session = await login(email, password);
    return {
      account: accountResponse,
      user: userDoc,
      session
    };
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}
async function login(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    const accountDetails = await account.get();
    const userDocs = await databases.listDocuments(
      databaseId,
      COLLECTIONS.USERS,
      [`userId:${accountDetails.$id}`]
    );
    const userDoc = userDocs.documents[0];
    await setSession(session);
    await setUser({
      id: accountDetails.$id,
      email: accountDetails.email,
      username: (userDoc == null ? void 0 : userDoc.username) || accountDetails.name,
      avatarUrl: (userDoc == null ? void 0 : userDoc.avatarUrl) || null,
      communities: (userDoc == null ? void 0 : userDoc.communities) || []
    });
    return {
      session,
      user: userDoc
    };
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
async function logout() {
  try {
    await account.deleteSession("current");
    await removeSession();
    await removeUser();
  } catch (error) {
    console.error("Logout failed:", error);
    await removeSession();
    await removeUser();
  }
}
async function getSession() {
  try {
    const session = await account.getSession("current");
    return session;
  } catch (error) {
    return null;
  }
}
async function getCurrentUser() {
  try {
    const accountDetails = await account.get();
    const userDocs = await databases.listDocuments(
      databaseId,
      COLLECTIONS.USERS,
      [`userId:${accountDetails.$id}`]
    );
    const userDoc = userDocs.documents[0];
    const user = {
      id: accountDetails.$id,
      email: accountDetails.email,
      username: (userDoc == null ? void 0 : userDoc.username) || accountDetails.name,
      avatarUrl: (userDoc == null ? void 0 : userDoc.avatarUrl) || null,
      communities: (userDoc == null ? void 0 : userDoc.communities) || []
    };
    await setUser(user);
    return user;
  } catch (error) {
    console.error("Get current user failed:", error);
    return null;
  }
}
async function isAuthenticated() {
  try {
    const session = await getSession();
    return session !== null;
  } catch (error) {
    return false;
  }
}
async function updateProfile(updates) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("No user logged in");
    }
    const userDocs = await databases.listDocuments(
      databaseId,
      COLLECTIONS.USERS,
      [`userId:${currentUser.id}`]
    );
    if (userDocs.documents.length === 0) {
      throw new Error("User document not found");
    }
    const userDocId = userDocs.documents[0].$id;
    const updatedDoc = await databases.updateDocument(
      databaseId,
      COLLECTIONS.USERS,
      userDocId,
      updates
    );
    await setUser({
      ...currentUser,
      ...updates
    });
    return updatedDoc;
  } catch (error) {
    console.error("Update profile failed:", error);
    throw error;
  }
}
const authService = {
  register,
  login,
  logout,
  getSession,
  getCurrentUser,
  isAuthenticated,
  updateProfile
};
async function createReaction(pageId, emoji, comment, communityId, userId) {
  try {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const reaction = await databases.createDocument(
      databaseId,
      COLLECTIONS.REACTIONS,
      ID.unique(),
      {
        pageId,
        userId,
        communityId,
        emoji,
        comment: comment || "",
        createdAt: now,
        updatedAt: now
      }
    );
    return reaction;
  } catch (error) {
    console.error("Create reaction failed:", error);
    throw error;
  }
}
async function updateReaction(reactionId, updates) {
  try {
    const reaction = await databases.updateDocument(
      databaseId,
      COLLECTIONS.REACTIONS,
      reactionId,
      {
        ...updates,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
    return reaction;
  } catch (error) {
    console.error("Update reaction failed:", error);
    throw error;
  }
}
async function deleteReaction(reactionId) {
  try {
    await databases.deleteDocument(
      databaseId,
      COLLECTIONS.REACTIONS,
      reactionId
    );
  } catch (error) {
    console.error("Delete reaction failed:", error);
    throw error;
  }
}
async function getReactionsForPage(pageId, options = {}) {
  try {
    const { communityId, limit = 50, offset = 0 } = options;
    const queries = [
      Query.equal("pageId", pageId),
      Query.orderDesc("createdAt"),
      Query.limit(limit),
      Query.offset(offset)
    ];
    if (communityId) {
      queries.push(Query.equal("communityId", communityId));
    }
    const response = await databases.listDocuments(
      databaseId,
      COLLECTIONS.REACTIONS,
      queries
    );
    return response.documents;
  } catch (error) {
    console.error("Get reactions for page failed:", error);
    throw error;
  }
}
async function getUserReactionForPage(pageId, userId) {
  try {
    const response = await databases.listDocuments(
      databaseId,
      COLLECTIONS.REACTIONS,
      [
        Query.equal("pageId", pageId),
        Query.equal("userId", userId),
        Query.limit(1)
      ]
    );
    return response.documents[0] || null;
  } catch (error) {
    console.error("Get user reaction failed:", error);
    return null;
  }
}
async function getReactionCounts(pageId) {
  try {
    const reactions = await getReactionsForPage(pageId, { limit: 1e3 });
    const counts = reactions.reduce((acc, reaction) => {
      const emoji = reaction.emoji;
      acc[emoji] = (acc[emoji] || 0) + 1;
      return acc;
    }, {});
    return counts;
  } catch (error) {
    console.error("Get reaction counts failed:", error);
    return {};
  }
}
const reactionService = {
  createReaction,
  updateReaction,
  deleteReaction,
  getReactionsForPage,
  getUserReactionForPage,
  getReactionCounts
};
async function createOrGetPage(url, title) {
  try {
    const normalizedUrl = normalizeUrl(url);
    const urlHash = await hashUrl(normalizedUrl);
    const domain = extractDomain(normalizedUrl);
    const existingPages = await databases.listDocuments(
      databaseId,
      COLLECTIONS.PAGES,
      [
        Query.equal("urlHash", urlHash),
        Query.limit(1)
      ]
    );
    if (existingPages.documents.length > 0) {
      const page = existingPages.documents[0];
      await databases.updateDocument(
        databaseId,
        COLLECTIONS.PAGES,
        page.$id,
        {
          lastActivityAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      );
      return page;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newPage = await databases.createDocument(
      databaseId,
      COLLECTIONS.PAGES,
      ID.unique(),
      {
        urlHash,
        normalizedUrl,
        pageTitle: title || domain,
        domain,
        totalReactions: 0,
        reactionBreakdown: JSON.stringify({}),
        firstSeenAt: now,
        lastActivityAt: now
      }
    );
    return newPage;
  } catch (error) {
    console.error("Create or get page failed:", error);
    throw error;
  }
}
async function getPageByHash(urlHash) {
  try {
    const pages = await databases.listDocuments(
      databaseId,
      COLLECTIONS.PAGES,
      [
        Query.equal("urlHash", urlHash),
        Query.limit(1)
      ]
    );
    return pages.documents[0] || null;
  } catch (error) {
    console.error("Get page by hash failed:", error);
    return null;
  }
}
async function updatePageStats(pageId, reactionCounts) {
  try {
    const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
    const page = await databases.updateDocument(
      databaseId,
      COLLECTIONS.PAGES,
      pageId,
      {
        totalReactions,
        reactionBreakdown: JSON.stringify(reactionCounts),
        lastActivityAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
    return page;
  } catch (error) {
    console.error("Update page stats failed:", error);
    throw error;
  }
}
async function getTrendingPages(period = "24h", limit = 20) {
  try {
    const pages = await databases.listDocuments(
      databaseId,
      COLLECTIONS.PAGES,
      [
        Query.orderDesc("totalReactions"),
        Query.limit(limit)
      ]
    );
    return pages.documents;
  } catch (error) {
    console.error("Get trending pages failed:", error);
    return [];
  }
}
async function getPageById(pageId) {
  try {
    const page = await databases.getDocument(
      databaseId,
      COLLECTIONS.PAGES,
      pageId
    );
    return page;
  } catch (error) {
    console.error("Get page by ID failed:", error);
    return null;
  }
}
const pageService = {
  createOrGetPage,
  getPageByHash,
  updatePageStats,
  getTrendingPages,
  getPageById
};
async function getAllCommunities() {
  try {
    const response = await databases.listDocuments(
      databaseId,
      COLLECTIONS.COMMUNITIES,
      [
        Query.orderAsc("name"),
        Query.limit(100)
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Get all communities failed:", error);
    return [];
  }
}
async function getCommunityBySlug(slug) {
  try {
    const response = await databases.listDocuments(
      databaseId,
      COLLECTIONS.COMMUNITIES,
      [
        Query.equal("slug", slug),
        Query.limit(1)
      ]
    );
    return response.documents[0] || null;
  } catch (error) {
    console.error("Get community by slug failed:", error);
    return null;
  }
}
async function getCommunityById(communityId) {
  try {
    const community = await databases.getDocument(
      databaseId,
      COLLECTIONS.COMMUNITIES,
      communityId
    );
    return community;
  } catch (error) {
    console.error("Get community by ID failed:", error);
    return null;
  }
}
async function joinCommunity(userId, communityId) {
  try {
    console.log(`User ${userId} joined community ${communityId}`);
  } catch (error) {
    console.error("Join community failed:", error);
    throw error;
  }
}
async function leaveCommunity(userId, communityId) {
  try {
    console.log(`User ${userId} left community ${communityId}`);
  } catch (error) {
    console.error("Leave community failed:", error);
    throw error;
  }
}
const communityService = {
  getAllCommunities,
  getCommunityBySlug,
  getCommunityById,
  joinCommunity,
  leaveCommunity
};
console.log("EmojiFeed background service worker loaded");
const MESSAGE_TYPES = {
  // Auth
  AUTH_LOGIN: "AUTH_LOGIN",
  AUTH_REGISTER: "AUTH_REGISTER",
  AUTH_LOGOUT: "AUTH_LOGOUT",
  AUTH_GET_SESSION: "AUTH_GET_SESSION",
  AUTH_GET_CURRENT_USER: "AUTH_GET_CURRENT_USER",
  // Reactions
  REACTION_CREATE: "REACTION_CREATE",
  REACTION_UPDATE: "REACTION_UPDATE",
  REACTION_DELETE: "REACTION_DELETE",
  REACTION_GET_FOR_PAGE: "REACTION_GET_FOR_PAGE",
  REACTION_GET_USER_FOR_PAGE: "REACTION_GET_USER_FOR_PAGE",
  REACTION_GET_COUNTS: "REACTION_GET_COUNTS",
  // Pages
  PAGE_CREATE_OR_GET: "PAGE_CREATE_OR_GET",
  PAGE_GET_TRENDING: "PAGE_GET_TRENDING",
  PAGE_UPDATE_STATS: "PAGE_UPDATE_STATS",
  // Communities
  COMMUNITY_GET_ALL: "COMMUNITY_GET_ALL",
  COMMUNITY_GET_BY_ID: "COMMUNITY_GET_BY_ID",
  // Storage
  STORAGE_GET: "STORAGE_GET",
  STORAGE_SET: "STORAGE_SET"
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, data } = message;
  console.log("Background received message:", type, data);
  handleMessage(type, data).then((result) => {
    sendResponse({ success: true, data: result });
  }).catch((error) => {
    console.error(`Error handling ${type}:`, error);
    sendResponse({ success: false, error: error.message });
  });
  return true;
});
async function handleMessage(type, data) {
  switch (type) {
    case MESSAGE_TYPES.AUTH_LOGIN:
      return await authService.login(data.email, data.password);
    case MESSAGE_TYPES.AUTH_REGISTER:
      return await authService.register(data.email, data.password, data.username);
    case MESSAGE_TYPES.AUTH_LOGOUT:
      return await authService.logout();
    case MESSAGE_TYPES.AUTH_GET_SESSION:
      return await authService.getSession();
    case MESSAGE_TYPES.AUTH_GET_CURRENT_USER:
      return await authService.getCurrentUser();
    case MESSAGE_TYPES.REACTION_CREATE:
      return await reactionService.createReaction(
        data.pageId,
        data.emoji,
        data.comment,
        data.communityId,
        data.userId
      );
    case MESSAGE_TYPES.REACTION_UPDATE:
      return await reactionService.updateReaction(data.reactionId, data.updates);
    case MESSAGE_TYPES.REACTION_DELETE:
      return await reactionService.deleteReaction(data.reactionId);
    case MESSAGE_TYPES.REACTION_GET_FOR_PAGE:
      return await reactionService.getReactionsForPage(data.pageId, data.options);
    case MESSAGE_TYPES.REACTION_GET_USER_FOR_PAGE:
      return await reactionService.getUserReactionForPage(data.pageId, data.userId);
    case MESSAGE_TYPES.REACTION_GET_COUNTS:
      return await reactionService.getReactionCounts(data.pageId);
    case MESSAGE_TYPES.PAGE_CREATE_OR_GET:
      return await pageService.createOrGetPage(data.url, data.title);
    case MESSAGE_TYPES.PAGE_GET_TRENDING:
      return await pageService.getTrendingPages(data.period, data.limit);
    case MESSAGE_TYPES.PAGE_UPDATE_STATS:
      return await pageService.updatePageStats(data.pageId, data.reactionCounts);
    case MESSAGE_TYPES.COMMUNITY_GET_ALL:
      return await communityService.getAllCommunities();
    case MESSAGE_TYPES.COMMUNITY_GET_BY_ID:
      return await communityService.getCommunityById(data.communityId);
    case MESSAGE_TYPES.STORAGE_GET:
      return await storageService.get(data.key);
    case MESSAGE_TYPES.STORAGE_SET:
      await storageService.set(data.key, data.value);
      return { success: true };
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
}
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("EmojiFeed installed:", details.reason);
  if (details.reason === "install") {
    console.log("Welcome to EmojiFeed!");
  } else if (details.reason === "update") {
    console.log("EmojiFeed updated to", chrome.runtime.getManifest().version);
  }
});
chrome.alarms.create("keepAlive", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "keepAlive") {
    console.log("Service worker keepalive ping");
  }
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    console.log("Tab updated:", tab.url);
  }
});
