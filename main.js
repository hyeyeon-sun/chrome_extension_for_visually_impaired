(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],5:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":3,"./encode":4}],6:[function(require,module,exports){

//dldzm
const axios = require('axios');
const deepai = require("deepai");
const qs = require('querystring');

const deepai_private_key = "";
const ocr_private_key    = "";

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'X-Naver-Client-Id': '',
  'X-Naver-Client-Secret': ''
};


deepai.setApiKey(deepai_private_key);
const stopwords               = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "him", "his", "himself", "her", "hers", "herself", "it", "its", "itself", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"];
const imgs_extension          = ['gif', 'jpg', 'jpeg', 'png', 'bmp' ,'ico', 'apng', 'psd', 'pdd', 'raw', 'svg'];

var removeStopWords = function(str) {
  str += " ";
  var res = [];
  var words = str.split(' ');
  for(let i = 0 ; i < words.length;i++){
    let word_clean = words[i].split(".").join("");
    if(!stopwords.includes(word_clean)) {
      res.push(word_clean);
    }
  }
  return res;
};

async function isImgLink(URL_LINK) {
  if (URL_LINK === undefined){
    return false;
  }
  var ext = URL_LINK.substring(URL_LINK.lastIndexOf('.') + 1);
  if (!ext){
    return false;
  }
  else if(URL_LINK.includes("banner")){
    return false;
  }
  var bool = false;
  ext = ext.toLocaleLowerCase();
  imgs_extension.forEach( function(element) {
    if (ext.includes(element)){
      bool = true;
    }
  });
  return bool;
}

async function selectImg(images) {
  let tempDictionary = {};
  for (let key = 0; key < images.length; key++) {
    if (images[key].alt === "") {
      let link = images[key].src;
      isImgLink(link)
      .then(function(result) {
        if (result) {
          tempDictionary[key] = unescape(link);
        }
        else{
          var firstDot = link.indexOf(".");
          if (link.slice(firstDot-3, firstDot) === "www"){ // https://www.youtube.com/ 이런 형식일 경우
            link = link.slice(firstDot+1);
            var lastDot = link.indexOf(".");
            link = link.slice(0, lastDot);  
          }
          else{ //https://velog.io/ 이런 형식일 경우
            link = link.slice(0, firstDot);
            var lastSlash = link.lastIndexOf('/');
            link = link.slice(lastSlash+1, firstDot);
          }
          images[key].alt = `${link} 의 로고입니다. 클릭하면 ${link} 사이트로 연결됩니다.`;
        }
      })
      .catch((err) => {
        console.log(key, err, tempDictionary[key])
      })
    } // if
    else if (images[key].src.includes("profile"))   { images[key].alt = "프로필 사진입니다."; } 
    else if (images[key].src.includes("logo"))      { images[key].alt = "로고 사진입니다.";   } 
    else if (images[key].src.includes("thumbnail")) { images[key].alt = "썸네일 사진입니다."; }
  }
  return tempDictionary;
};
  
async function densecapAPI(URL_LINK){
  const major = await deepai.callStandardApi("neuraltalk", {
    image: URL_LINK
  })
  const minor = await deepai.callStandardApi("densecap", {
    image : URL_LINK
  })

  const dirtyString = major.output;
  const standards = removeStopWords(dirtyString);
  const standards_length = standards.length;
  const repeat_time = parseInt(minor["output"]["captions"].length/2);

  let related = "";
  var sentenceArr=[];

  for (let i = 0; i < repeat_time; i++){ 
    let sentence = minor["output"]["captions"][i]["caption"];
    let find = false;
    let many  = false;
    for (let j = 0; j < standards_length; j++){
      if(sentence.includes(standards[j]) && !sentence.includes("<unk>")){
        for(k = 0 ; k < sentenceArr.length; k++){
          if (sentence == sentenceArr[k]){
            many = true;
            break;
          }
        }
        find = true;
        break;
      }
    }
    if (find && !many) {
      related += (sentence + ". ");
      sentenceArr.push(sentence);
    }
  }
  delete sentenceArr;
  const result = dirtyString +" "+ related;
  return result;
};

function ocrAPI(URL_LINK){
  if (URL_LINK.split(';')[0]=='data:image/jpeg'){
    var request_json = {
      "requests": [{
          "features": [{
              "type": "TEXT_DETECTION"  }],
          "image": { "content": URL_LINK.split(',')[1] }   
        }]
    };
  }
  else if (URL_LINK.split(':')[0]=='http' || URL_LINK.split(':')[0]=='https'){
    var request_json = {
      "requests": [ {
         "features": [ {"type": "TEXT_DETECTION"}],
          "image": {  "source": {"imageUri": URL_LINK  } } 
        } ]
    };
  }
  if (request_json)
    return request_json;
  else 
    return 'wrong_link';
};

const TRANSLATE_METHODS = {
    nmt: 'nmt',
    smt: 'smt',
};

class Papago_translation {
  constructor() {};

  async lookup(term, { method }) {
    if (term == null) {
      throw new Error('err');
    }
    const url = method === TRANSLATE_METHODS.smt ?
      'language/translate' : 'papago/n2mt';
    const params = qs.stringify({
      source: 'en',
      target: 'ko',
      text: term,
    });

    const config = {
      baseURL: 'https://cors-max-5.herokuapp.com/https://openapi.naver.com/v1/',
      headers: headers
    };
    const response = await axios.post(url, params, config);
    return response.data.message.result.translatedText;
  };
};

async function translate(term, images, j) {
  const papago = new Papago_translation();
  const result = await papago.lookup(term, { method: 'nmt' });
  images[j].alt = result;
};

(async function() {
  async function async_load() {
    var images = document.getElementsByTagName('img');
    let ImgDict = {};
    var ONocr = true;
    var ONdeepai = true;
    var timePerImg = 2000;

    if(ONocr) {
      selectImg(images)
      .then((res) => { 
        ImgDict = res;
        const dictionaryLength = Object.keys(ImgDict);
        if (dictionaryLength > 30){
          timePerImg = 5000;
        }
        else if (dictionaryLength > 20){
          timePerImg = 4000;
        }
        else if (dictionaryLength > 10){
          timePerImg = 3000;
        }
        else{
          timePerImg = 2000;
        }
      })
      .then(function(){
        for(let i in ImgDict){
          image_link = images[i].src;
          if (!image_link.includes('banner') && image_link != "" && (image_link.includes('http') || image_link.includes('jpeg') )){
            let request_json = ocrAPI(image_link);
            if (request_json == 'wrong_link')
              continue;
            else{
              const apiCall=`https://cors-max-5.herokuapp.com/https://vision.googleapis.com/v1/images:annotate?key=${ocr_private_key}`;
              axios.post(apiCall, request_json)
              .then((res)=>{
                let result = res.data.responses[0].fullTextAnnotation;
                if(!result){}
                else{
                  images[i].alt = result.text.replace(/\-/g,'');
                  delete ImgDict[i];
                }; 
              })
              .catch((err) => {
                console.log(err);
              });
            }; 
          };
        }; 
      });
    };
    if(ONdeepai){
      setTimeout(function(){
        for(let j in ImgDict){
          console.log(j);
          let ImgCptResult = densecapAPI(images[j].src);
          ImgCptResult
          .then(function(dairesult){
            translate(dairesult, images, j);
          })
          .then(() => {
            delete ImgDict[j];
          });
        }
      },timePerImg);
    };
  }; 
  window.attachEvent ? window.attachEvent('onload', async_load) : window.addEventListener('load', async_load, false);
})();

},{"axios":7,"deepai":34,"querystring":5}],7:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":9}],8:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/buildFullPath":15,"../core/createError":16,"./../core/settle":20,"./../helpers/buildURL":24,"./../helpers/cookies":26,"./../helpers/isURLSameOrigin":29,"./../helpers/parseHeaders":31,"./../utils":33}],9:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":10,"./cancel/CancelToken":11,"./cancel/isCancel":12,"./core/Axios":13,"./core/mergeConfig":19,"./defaults":22,"./helpers/bind":23,"./helpers/isAxiosError":28,"./helpers/spread":32,"./utils":33}],10:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],11:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":10}],12:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],13:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":24,"./../utils":33,"./InterceptorManager":14,"./dispatchRequest":17,"./mergeConfig":19}],14:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":33}],15:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":25,"../helpers/isAbsoluteURL":27}],16:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":18}],17:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":12,"../defaults":22,"./../utils":33,"./transformData":21}],18:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],19:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":33}],20:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":16}],21:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":33}],22:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,require('_process'))
},{"./adapters/http":8,"./adapters/xhr":8,"./helpers/normalizeHeaderName":30,"./utils":33,"_process":2}],23:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],24:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":33}],25:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],26:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":33}],27:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],28:[function(require,module,exports){
'use strict';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

},{}],29:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":33}],30:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":33}],31:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":33}],32:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],33:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":23}],34:[function(require,module,exports){
module.exports = require('./lib/deepai');

},{"./lib/deepai":38}],35:[function(require,module,exports){
(function (Buffer){(function (){
'use strict';

var utils = require('./../utils');
const axios = require('axios');
const formData = require('form-data');
// const Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const apiBaseUrl = require('./apiBaseUrl').baseUrl;
const resultRendering = require('./resultRendering');

const globalObject = Function('return this')();

/**
 * Create a new instance of DeepAI
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function DeepAI(instanceConfig) {
    this.defaults = instanceConfig;
    axios.defaults.headers.common['client-library'] = 'deepai-js-client';
}

DeepAI.prototype.setApiKey = function (apiKey) {
    this.apiKey = apiKey;
    axios.defaults.headers.common['api-key'] = apiKey;
};

function urlForModel(model_name) {
    return apiBaseUrl+"/api/" + model_name;
}


DeepAI.prototype.callStandardApi = async function request(model_name, inputs_object) {

    const form = new formData();
    for (var key of Object.keys(inputs_object)) {
        // Second argument  can take Buffer or Stream (lazily read during the request) too.
        // Third argument is filename if you want to simulate a file upload. Otherwise omit.
        if (inputs_object[key] === null || inputs_object[key] === undefined) {
            continue; // Input is blank, that is allowed sometimes.
        }

        if (typeof inputs_object[key] === 'string') {
            form.append(key, inputs_object[key]); // a string could be a URL or just some text data. both are OK
        } else if (globalObject.Element && inputs_object[key] instanceof globalObject.Element) {
            var element = inputs_object[key];
            if (element.tagName === 'IMG') {
                // got an IMG dom node element

                if (element.src) {
                    // pass the src url
                    form.append(key, element.src);

                    // TODO do something about data URLs
                    // TODO do something about blob URLs

                } else {
                    throw new Error("DeepAI error: Image element has no SRC: " + key);
                }
            } else if (element.tagName === 'INPUT' && element.files !== undefined) {
                // got a file picker
                if (element.files.length > 0) {
                    form.append(key, element.files[0], 'file.jpeg');
                } else {
                    throw new Error("DeepAI error: File picker has no file picked: " + key);
                }
            } else {
                throw new Error("DeepAI error: DOM Element type for key: " + key);
            }
        } else if (inputs_object[key].hasOwnProperty('fd')) {
            // Seems to be a nodejs stream.
            form.append(key, inputs_object[key]); // form-data in nodejs can handle this
        } else if (globalObject.Buffer && Buffer.isBuffer(inputs_object[key])) {
            form.append(key, inputs_object[key], 'file.jpeg'); // form-data in nodejs can handle this
        } else {
            throw new Error("DeepAI error: unknown input type for key: " + key);
        }
        // TODO do filenames need to be unique?

    }

    var req_options = {
        withCredentials: true
    };
    if (form.getHeaders !== undefined) {
        // formData is the nodejs based subsitute, only needed for node.js
        req_options.headers = form.getHeaders();
    }
    const response = await axios.post(urlForModel(model_name), form, req_options);
    return response.data;

};

DeepAI.prototype.renderResultIntoElement = resultRendering.renderResultIntoElement;
DeepAI.prototype.renderAnnotatedResultIntoElement = resultRendering.renderAnnotatedResultIntoElement;

module.exports = DeepAI;

}).call(this)}).call(this,{"isBuffer":require("../../../../AppData/Roaming/npm/node_modules/browserify/node_modules/is-buffer/index.js")})
},{"../../../../AppData/Roaming/npm/node_modules/browserify/node_modules/is-buffer/index.js":1,"./../utils":41,"./apiBaseUrl":36,"./resultRendering":37,"axios":7,"form-data":42}],36:[function(require,module,exports){
'use strict';


module.exports = {
    baseUrl: "https://api.deepai.org"
    //baseUrl: "http://localhost:8000" // for dev
}

},{}],37:[function(require,module,exports){
'use strict';
const apiBaseUrl = require('./apiBaseUrl').baseUrl;
var WAD_COLORS = [
    "rgb(173, 35, 35)", // Red
    "rgb(42, 75, 215)", // Blue
    "rgb(87, 87, 87)", // Dark Gray
    "rgb(29, 105, 20)", // Green
    "rgb(129, 74, 25)", // Brown
    "rgb(129, 38, 192)", // Purple
    "rgb(160, 160, 160)", // Lt Gray
    "rgb(129, 197, 122)", // Lt green
    "rgb(157, 175, 255)", // Lt blue
    "rgb(41, 208, 208)", // Cyan
    "rgb(255, 146, 51)", // Orange
    "rgb(199, 183, 0)", // Yellow
    "rgb(233, 222, 187)", // Tan
    "rgb(255, 205, 243)", // Pink
    // "rgb(255, 255, 255)", // White
    //"rgb(0, 0, 0)",       // Black
];
var isAbsolute = new RegExp('^([a-z]+://|//)', 'i');
var isDataOrBlob = new RegExp('^(data|blob):', 'i');

function prependApiBaseIfNeeded(url) {
    if(isAbsolute.test(url) || isDataOrBlob.test(url)) {
        return url; // already absolute
    } else {
        return apiBaseUrl + url; // turn relative into absolute
    }
}

function polygonToSvgPath(polygon, left, top) {
    // M 10,10 L 100,10 100,100 z    M 30,20 L 70,20 70,60 z
    var path_strings = [];
    for (var part of polygon) {

        if (part.length < 2) {
            continue;
        }

        path_strings.push('M');
        var first = true;
        for (var point of part) {
            path_strings.push((point[0]-left) + "," + (point[1]-top));
            if (isNaN(point[0]) || isNaN(point[1])) {
                console.log('not showing invalid polygon, found NaN');
                return "";
            }
            if (first) {
                path_strings.push('L');
                first = false;
            }
        }
        path_strings.push('z');
    }
    return path_strings.join(" ");
}

/*

Data structures basic info...

result
{
    output_url:
    output:
    id:
    err:
}


resultPageData
{
    result_data: {
        inputs:[
            {
                is_img: true,
                url: (relative or absolute)
            }
        ],
        visualizer_data: {
            list_key: 'Objects'
            label_key: 'Object'
        },
        scale_applied: 1.333
    }
}


annotatedResult - this is basically the merging of the 2 above
{   err:
    output_url:
    output:
    id:
    inputs:[
        {
            is_img: true,
            url: (relative or absolute)
        }
    ],
    visualizer_data: {
        list_key: 'Objects'
        label_key: 'Object'
    },
    scale_applied: 1.333
}


*/
// Take a result object from API call, and fetch additional data, and return the additional data merged in.
async function getAnnotatedResultFromResult(result) {
    if(result.err) {
        console.log('cannot get result page data for error result');
        return result;
    }
    var resultPageData = await fetch(apiBaseUrl + '/get_standard_api_result_data/' + result.id, {
        credentials: 'include'
    });
    resultPageData = await resultPageData.json();
    var result_data = resultPageData.result_data;

    // make merging of all the properties manually...
    return {
        err: result.err,
        output: result.output,
        output_url: result.output_url,
        id: result.id,
        inputs: result_data.inputs,
        visualizer_data: result_data.visualizer_data,
        scale_applied: result_data.scale_applied
    };
}
async function renderResultIntoElement(result, element) {
    console.log('getting result page data');
    var annotatedResult = await getAnnotatedResultFromResult(result);
    console.log('got result page data');
    return renderAnnotatedResultIntoElement(annotatedResult, element);
}

function renderAnnotatedResultIntoElement(annotatedResult, element) {
    element.innerHTML = ''; // remove everything to start
    if(annotatedResult.err) {
        element.innerHTML = err;
        return false;
    }
    if(annotatedResult.output) {
        // JSON or text output.
        console.log('got json or text output');
        if(typeof annotatedResult.output === 'string') {
            var scroller = document.createElement("div");
            scroller.style.width = '100%';
            scroller.style.height = '100%';
            scroller.style.overflow = 'auto';
            scroller.style.display = 'flex';
            scroller.style.alignItems = 'center';
            scroller.style.flexDirection = 'column';
            element.appendChild(scroller);
            var pre = document.createElement("pre");
            pre.textContent = annotatedResult.output;
            pre.style.whiteSpace = "pre-wrap";
            pre.style.margin = '0px';
            scroller.appendChild(pre);
            // Append inputs
            for(var input of annotatedResult.inputs) {
                if(input.is_img) {
                    var img_tag = document.createElement('img');
                    img_tag.src = prependApiBaseIfNeeded(input.url);
                    img_tag.style.position = 'relative';
                    img_tag.style.width = '100%';
                    img_tag.style.height = '100%%';
                    img_tag.style.objectFit = 'contain';
                    scroller.appendChild(img_tag);
                }
            }
            return true;
        } else if(typeof annotatedResult.output === 'object') {
            // If we uploaded an image, then we may be able to render the image with boxes on top
            if(annotatedResult.inputs.length == 1 &&
                annotatedResult.inputs[0].is_img &&
                annotatedResult.visualizer_data
            ) {
                // single image input and we know how to visualize it.
                console.log('have visualizer for result JSON');
                var resultscaler = document.createElement('iframe');
                // Set up a handler for when the frame loads - we need to handle this event
                resultscaler.onload = function() {
                    // Firefox doesnt allow inner iframe manip until the iframe is loaded...
                    var innerDoc = resultscaler.contentDocument.body;
                    innerDoc.style.margin = '0px';
                    innerDoc.style.overflow = 'hidden';

/*

                    var css = `
                        boundingbox:hover{
                            background-color: #00ff00
                        }
                    `;
                    var style = document.createElement('style');

                    if (style.styleSheet) {
                        style.styleSheet.cssText = css;
                    } else {
                        style.appendChild(document.createTextNode(css));
                    }

                    resultscaler.contentDocument.head.appendChild(style);
*/



                    var bbox_container = document.createElement('boundingboxcontainer');
                    bbox_container.style.position = 'relative'; // the absolute positions are relative to this element
                    bbox_container.style.opacity = '0.001'; // the result are hidden until the iframe reflows - which is first when the img loads
                    innerDoc.appendChild(bbox_container);
                    var img_tag = document.createElement('img');
                    img_tag.src = prependApiBaseIfNeeded(annotatedResult.inputs[0].url);
                    img_tag.style.position = 'absolute';
                    bbox_container.appendChild(img_tag);
                    var iframe_reflow = function() {
                        console.log('iframe resize');
                        resultscaler.contentDocument.body.style.transform = null;
                        var bodyWidth = resultscaler.contentDocument.body.scrollWidth;
                        var bodyHeight = resultscaler.contentDocument.body.scrollHeight;
                        var imgWidth = img_tag.offsetWidth;
                        var imgHeight = img_tag.offsetHeight;
                        var containerWidth = resultscaler.offsetWidth;
                        var containerHeight = resultscaler.offsetHeight;
                        var wExcess = 0;
                        var hExcess = 0;
                        if(imgWidth < bodyWidth && imgHeight < bodyHeight) {
                            var wScale = containerWidth / imgWidth;
                            var hScale = containerHeight / imgHeight;
                            var minScale = Math.min(wScale, hScale);
                            wExcess = containerWidth - imgWidth * minScale;
                            hExcess = containerHeight - imgHeight * minScale;
                        } else {
                            var wScale = containerWidth / bodyWidth;
                            var hScale = containerHeight / bodyHeight;
                            var minScale = Math.min(wScale, hScale);
                            wExcess = containerWidth - bodyWidth * minScale;
                            hExcess = containerHeight - bodyHeight * minScale;
                        }
                        wExcess = wExcess / minScale;
                        hExcess = hExcess / minScale;
                        resultscaler.contentDocument.body.style.transformOrigin = 'top left';

                        resultscaler.contentDocument.body.style.transform = 'scale(' + minScale + ')';
                        bbox_container.style.setProperty('--scaleapplied', minScale);
                        bbox_container.style.setProperty('--fontscale', (100 / minScale) + "%");

                        bbox_container.style.left = (wExcess / 2) + "px";
                        bbox_container.style.top = (hExcess / 2) + "px";
                        bbox_container.style.opacity = '1';
                    };
                    resultscaler.contentWindow.onresize = iframe_reflow;
                    img_tag.onload = iframe_reflow;
                    var processed_annotations = process_annotations(annotatedResult.output, annotatedResult.visualizer_data, annotatedResult.scale_applied);
                    console.log('processed annotations', processed_annotations);
                    var i = 0;
                    for(var annotation of processed_annotations) {
                        var bbox = document.createElement('boundingbox');
                        bbox.style.position = 'absolute';

                        var left;
                        var top;
                        var width;
                        var height;
                        var color = WAD_COLORS[i++ % WAD_COLORS.length];

                        if(annotation.mask_vertices){
                            var minx = null;
                            var miny = null;
                            var maxx = null;
                            var maxy = null;

                            for(var part of annotation.mask_vertices){
                                for(var point of part){
                                    var x = point[0];
                                    var y = point[1];

                                    if(minx === null || x < minx){
                                        minx = x;
                                    }
                                    if(miny === null || y < miny){
                                        miny = y;
                                    }
                                    if(maxx === null || x > maxx){
                                        maxx = x;
                                    }
                                    if(maxy === null || y > maxy){
                                        maxy = y;
                                    }
                                }
                            }

                            width = maxx - minx;
                            height = maxy - miny;

                            left = minx;
                            top = miny;

                            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

                            svg.style.position = 'absolute';
                            svg.style.overflow = 'visible';
                            svg.style.width = width + 'px';
                            svg.style.height = height + 'px';

                            var path = document.createElementNS('http://www.w3.org/2000/svg',"path");
                            path.setAttributeNS(null, "d", polygonToSvgPath(annotation.mask_vertices, left, top));
                            path.style.fill = 'none';
                            path.style.stroke = color;
                            path.style.strokeWidth = 'calc(2px / var(--scaleapplied))'; // 2px at all scale levels


                            svg.appendChild(path);
                            bbox.appendChild(svg);

                            bbox.style.border = 'none';
                        }else if(annotation.bounding_box){
                            left = annotation.bounding_box[0];
                            top = annotation.bounding_box[1];
                            width = annotation.bounding_box[2];
                            height = annotation.bounding_box[3];

                            bbox.style.border = 'calc(2px / var(--scaleapplied)) solid ' + color;
                        }else {
                            throw new Exception('Neither mask_vertices or bounding_box is passed, unknown annotation format');
                        }


                        bbox.style.left = left + 'px';
                        bbox.style.top = top + 'px';
                        bbox.style.width = width + 'px';
                        bbox.style.height = height + 'px';



                        bbox_container.appendChild(bbox);
                        var bbox_label = document.createElement('boundingboxlabel');
                        bbox_label.textContent = annotation.caption;
                        bbox_label.style.color = 'white';
                        bbox_label.style.fontFamily = 'arial';
                        bbox_label.style.backgroundColor = color;
                        bbox_label.style.fontSize = 'var(--fontscale)';
                        bbox_label.style.position = 'absolute';
                        bbox.appendChild(bbox_label);
                    }
                }
                // Set the src which will end up triggering the onload event in all browsers.
                resultscaler.src = 'about:blank';
                resultscaler.style.border = 'none';
                resultscaler.style.width = '100%';
                resultscaler.style.height = '100%';
                element.appendChild(resultscaler);
                return true;
            } else {
                // not single image - perhaps multi image or text input.
                // or no visualizer
                console.log('no visualizer for result JSON');
                var scroller = document.createElement("div");
                scroller.style.width = '100%';
                scroller.style.height = '100%';
                scroller.style.overflow = 'auto';
                scroller.style.display = 'flex';
                scroller.style.alignItems = 'center';
                scroller.style.flexDirection = 'column';
                element.appendChild(scroller);
                var pre = document.createElement("pre");
                pre.style.margin = '0px';
                pre.textContent = JSON.stringify(annotatedResult.output, null, 4);
                scroller.appendChild(pre);
                // Append inputs
                for(var input of annotatedResult.inputs) {
                    if(input.is_img) {
                        var img_tag = document.createElement('img');
                        img_tag.src = prependApiBaseIfNeeded(input.url);
                        img_tag.style.width = '100%';
                        img_tag.style.height = '79%';
                        img_tag.style.objectFit = 'contain';
                        scroller.appendChild(img_tag);
                    }
                }
                return true;
                // We got JSON output for a multi image or text input ... don't bother showing the input right now
            }
        } else {
            element.innerHTML = "Model returned an unknown data type.";
            return false;
        }
    } else if(annotatedResult.output_url) {
        // Image output.
        console.log('got image output');
        // Just show the image.
        var img_tag = document.createElement('img');
        img_tag.src = annotatedResult.output_url;
        img_tag.style.position = 'relative';
        img_tag.style.width = '100%';
        img_tag.style.height = '100%';
        img_tag.style.objectFit = 'contain';
        element.appendChild(img_tag);
        return true;
    } else {
        element.innerHTML = "Model did not return an output or an error.";
        return false;
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function process_annotations(input_struct, visualizer_data, scale_applied) {
    input_struct = JSON.parse(JSON.stringify(input_struct)); // cheap deep clone
    var detections = input_struct[visualizer_data.list_key];
    detections.sort(function(a, b) {
        return b.confidence - a.confidence;
    });
    var count = detections.length;
    var processed_annotations = [];
    for(var i = 0; i < count; i++) {
        var detection = detections[i];
        var caption;
        if(visualizer_data.label_key == 'demographic') {
            if(detection[visualizer_data.label_key]) {
                caption = detection[visualizer_data.label_key]; // backwards compatible demog format
            } else {
                //"White Male, 30-40"
                caption = detection['cultural_appearance'] + ' ' + detection['gender'] + ', ' + detection['age_range'][0] + '-' + detection['age_range'][1]
            }
        } else if(visualizer_data.label_key == 'people') {
            //produces "Sad, White Male, 30-40, Ted Cruz"
            var parts = [];
            if(detection['facial-expression-recognition'] && detection['facial-expression-recognition']['emotion'] != null) {
                parts.push(capitalizeFirstLetter(detection['facial-expression-recognition']['emotion']));
            }
            if(detection['demographic-recognition'] && detection['demographic-recognition']['cultural_appearance'] != null) {
                parts.push(detection['demographic-recognition']['cultural_appearance'] + ' ' + detection['demographic-recognition']['gender'] + ', ' + detection['demographic-recognition']['age_range'][0] + '-' + detection['demographic-recognition']['age_range'][1]);
            }
            if(detection['celebrity-recognition'] && detection['celebrity-recognition']['name'] != null && detection['celebrity-recognition']['name'] != 'unknown') {
                parts.push(toTitleCase(detection['celebrity-recognition']['name']));
            }
            if(parts.length > 0) {
                caption = parts.join(', ');
            } else {
                caption = "Face";
            }
        } else if(visualizer_data.label_key == 'pose') {
            const named_segments = [
                [
                    "nose",
                    "right_eye"
                ],
                [
                    "nose",
                    "left_eye"
                ],
                [
                    "right_eye",
                    "right_ear"
                ],
                [
                    "left_eye",
                    "left_ear"
                ],
                [
                    "right_shoulder",
                    "right_elbow"
                ],
                [
                    "left_shoulder",
                    "left_elbow"
                ],
                [
                    "right_elbow",
                    "right_hand"
                ],
                [
                    "left_elbow",
                    "left_hand"
                ],
                [
                    "right_hip",
                    "right_knee"
                ],
                [
                    "left_hip",
                    "left_knee"
                ],
                [
                    "right_knee",
                    "right_foot"
                ],
                [
                    "left_knee",
                    "left_foot"
                ]
            ];
            caption = ''; // no caption for pose parts

            var mask_vertices = [];
            for(var pair of named_segments){
                var p1 = detection[visualizer_data.label_key][pair[0]];
                var p2 = detection[visualizer_data.label_key][pair[1]];

                if(p1 && p2){
                    p1 = JSON.parse(JSON.stringify(p1)); // cheap deep clone
                    p2 = JSON.parse(JSON.stringify(p2)); // cheap deep clone
// Do not rescale here - let the mask rescale handle this
//                    p1[0] *= scale_applied;
//                    p1[1] *= scale_applied;
//                    p2[0] *= scale_applied;
//                    p2[1] *= scale_applied;
                    var polygon_part = [p1, p2];
                    mask_vertices.push(polygon_part);
                }
            }
            detection.mask_vertices = mask_vertices;

        } else {
            caption = detection[visualizer_data.label_key]; // non demographic mode
            if(caption && caption.constructor === String)
            {
                 //It's a string
            }else{
                // some other type of object
                var keys = Object.keys(caption);
                if(keys.length == 1){
                    caption = caption[keys[0]]; // get the only property
                }else{
                    caption = JSON.stringify(caption);
                }
            }

        }

        if (detection.bounding_box){
            detection.bounding_box[0] *= scale_applied;
            detection.bounding_box[1] *= scale_applied;
            detection.bounding_box[2] *= scale_applied;
            detection.bounding_box[3] *= scale_applied;
        }

        // Note: this also handles pose results!
        if (detection.mask_vertices){
            for(var part of detection.mask_vertices){
                for(var point of part){
                    point[0] *= scale_applied;
                    point[1] *= scale_applied;
                }
            }
        }
        processed_annotations.push({
            bounding_box: detection.bounding_box,
            mask_vertices: detection.mask_vertices,
            caption: caption
        });
    }
    return processed_annotations;
}

module.exports = {
    renderResultIntoElement: renderResultIntoElement,
    renderAnnotatedResultIntoElement: renderAnnotatedResultIntoElement
};

},{"./apiBaseUrl":36}],38:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var DeepAI = require('./core/DeepAI');
var defaults = require('./defaults');
var bind = require('./helpers/bind');


/**
 * Create an instance of DeepAI
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {DeepAI} A new instance of DeepAI
 */
function createInstance(defaultConfig) {
    var context = new DeepAI(defaultConfig);
    var instance = bind(DeepAI.prototype.request, context);

    // Copy deepai.prototype to instance
    utils.extend(instance, DeepAI.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    return instance;
}

// Create the default instance to be exported
var deepai = createInstance(defaults);

// Expose DeepAI class to allow class inheritance
deepai.DeepAI = DeepAI;

// Factory for creating new instances
deepai.create = function create(instanceConfig) {
    return createInstance(mergeConfig(deepai.defaults, instanceConfig));
};

module.exports = deepai;

// Allow use of default import syntax in TypeScript
module.exports.default = deepai;

},{"./core/DeepAI":35,"./defaults":39,"./helpers/bind":40,"./utils":41}],39:[function(require,module,exports){
'use strict';

var utils = require('./utils');

var defaults = {
    apiKey: null
};

module.exports = defaults;

},{"./utils":41}],40:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
    return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
    };
};

},{}],41:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to DeepAI

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
    return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
    return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
    } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
    return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
    return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
    return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
    return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
    return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
    return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
    return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
    return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows DeepAI to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
        navigator.product === 'NativeScript' ||
        navigator.product === 'NS')) {
        return false;
    }
    return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
    );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
        return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
    }

    if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    } else {
        // Iterate over object keys
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn.call(null, obj[key], key, obj);
            }
        }
    }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
            result[key] = merge(result[key], val);
        } else {
            result[key] = val;
        }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
    }
    return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
            result[key] = deepMerge(result[key], val);
        } else if (typeof val === 'object') {
            result[key] = deepMerge({}, val);
        } else {
            result[key] = val;
        }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
    }
    return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
            a[key] = bind(val, thisArg);
        } else {
            a[key] = val;
        }
    });
    return a;
}

module.exports = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber,
    isObject: isObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    deepMerge: deepMerge,
    extend: extend,
    trim: trim
};

},{"./helpers/bind":40}],42:[function(require,module,exports){
/* eslint-env browser */
module.exports = typeof self == 'object' ? self.FormData : window.FormData;

},{}]},{},[6]);
