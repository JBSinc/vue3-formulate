(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('is-plain-object'), require('@braid/vue-formulate-i18n'), require('vue')) :
  typeof define === 'function' && define.amd ? define(['is-plain-object', '@braid/vue-formulate-i18n', 'vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Formulate = factory(global.isPlainObject, global.VueFormulateI18n, global.Vue));
})(this, (function (isPlainObject, vueFormulateI18n, vue) { 'use strict';

  /**
   * library.js
   *
   * Note: We're shipping front end code here, file size is critical. This file is
   * overly terse for that reason alone, we wouldn't necessarily recommend this.
   */
  var fi = 'FormulateInput';
  var add = function (n, c) { return ({
    classification: n,
    component: fi + (c || (n[0].toUpperCase() + n.substr(1)))
  }); };
  var library = Object.assign({}, [
      'text',
      'email',
      'number',
      'color',
      'date',
      'hidden',
      'month',
      'password',
      'search',
      'tel',
      'time',
      'url',
      'week',
      'datetime-local'
    ].reduce(function (lib, type) {
      var obj;

      return (Object.assign({}, lib, ( obj = {}, obj[type] = add('text'), obj )));
  }, {}),

    // === SLIDER INPUTS
    {range: add('slider'),

    // === MULTI LINE TEXT INPUTS
    textarea: add('textarea', 'TextArea'),

    // === BOX STYLE INPUTS
    checkbox: add('box'),
    radio: add('box'),

    // === BUTTON STYLE INPUTS
    submit: add('button'),
    button: add('button'),

    // === SELECT STYLE INPUTS
    select: add('select'),

    // === FILE TYPE
    file: add('file'),
    image: add('file'),

    // === GROUP TYPE
    group: add('group')});

  /**
   * Function to map over an object.
   * @param {Object} obj An object to map over
   * @param {Function} callback
   */
  function map (original, callback) {
    var obj = {};
    for (var key in original) {
      obj[key] = callback(key, original[key]);
    }
    return obj
  }

  /**
   * Shallow equal.
   * @param {} objA
   * @param {*} objB
   */
  function equals (objA, objB, deep) {
    if ( deep === void 0 ) deep = false;

    if (objA === objB) {
      return true
    }
    if (!objA || !objB) {
      return false
    }
    if (typeof objA !== 'object' && typeof objB !== 'object') {
      // Compare scalar values
      return objA === objB
    }
    var aKeys = Object.keys(objA);
    var bKeys = Object.keys(objB);
    var len = aKeys.length;

    if (bKeys.length !== len) {
      return false
    }

    for (var i = 0; i < len; i++) {
      var key = aKeys[i];
      if ((!deep && objA[key] !== objB[key]) || (deep && !equals(objA[key], objB[key], deep))) {
        return false
      }
    }
    return true
  }

  /**
   * Given a string, convert snake_case to camelCase
   * @param {String} string
   */
  function camel (string) {
    if (typeof string === 'string') {
      return string.replace(/([_-][a-z0-9])/ig, function ($1) {
        if (string.indexOf($1) !== 0 && !/[_-]/.test(string[string.indexOf($1) - 1])) {
          return $1.toUpperCase().replace(/[_-]/, '')
        }
        return $1
      })
    }
    return string
  }

  /**
   * Given a string, capitalize it. happyDay => HappyDay
   * @param {string} str
   */
  function cap (str) {
    return typeof str === 'string' ? str[0].toUpperCase() + str.substr(1) : str
  }

  /**
   * Given a string, object, falsey, or array - return an array.
   * @param {mixed} item
   */
  function arrayify (item) {
    if (!item) {
      return []
    }
    if (typeof item === 'string') {
      return [item]
    }
    if (Array.isArray(item)) {
      return item
    }
    if (typeof item === 'object') {
      return Object.values(item)
    }
    return []
  }

  /**
   * Given an array or string return an array of callables.
   * @param {array|string} validation
   * @param {array} rules and array of functions
   * @return {array} an array of functions
   */
  function parseRules (validation, rules) {
    if (typeof validation === 'string') {
      return parseRules(validation.split('|'), rules)
    }
    if (!Array.isArray(validation)) {
      return []
    }
    return validation.map(function (rule) { return parseRule(rule, rules); }).filter(function (f) { return !!f; })
  }

  /**
   * Given a string or function, parse it and return an array in the format
   * [fn, [...arguments]]
   * @param {string|function} rule
   */
  function parseRule (rule, rules) {
    if (typeof rule === 'function') {
      return [rule, []]
    }
    if (Array.isArray(rule) && rule.length) {
      rule = rule.map(function (r) { return r; }); // light clone
      var ref = parseModifier(rule.shift());
      var ruleName = ref[0];
      var modifier = ref[1];
      if (typeof ruleName === 'string' && rules.hasOwnProperty(ruleName)) {
        return [rules[ruleName], rule, ruleName, modifier]
      }
      if (typeof ruleName === 'function') {
        return [ruleName, rule, ruleName, modifier]
      }
    }
    if (typeof rule === 'string' && rule) {
      var segments = rule.split(':');
      var ref$1 = parseModifier(segments.shift());
      var ruleName$1 = ref$1[0];
      var modifier$1 = ref$1[1];
      if (rules.hasOwnProperty(ruleName$1)) {
        return [rules[ruleName$1], segments.length ? segments.join(':').split(',') : [], ruleName$1, modifier$1]
      } else {
        throw new Error(("Unknown validation rule " + rule))
      }
    }
    return false
  }

  /**
   * Return the rule name with the applicable modifier as an array.
   * @param {string} ruleName
   * @return {array} [ruleName, modifier]
   */
  function parseModifier (ruleName) {
    if (/^[\^]/.test(ruleName.charAt(0))) {
      return [camel(ruleName.substr(1)), ruleName.charAt(0)]
    }
    return [camel(ruleName), null]
  }

  /**
   * Given an array of rules, group them by bail signals. For example for this:
   * bail|required|min:10|max:20
   * we would expect:
   * [[required], [min], [max]]
   * because any sub-array failure would cause a shutdown. While
   * ^required|min:10|max:10
   * would return:
   * [[required], [min, max]]
   * and no bailing would produce:
   * [[required, min, max]]
   * @param {array} rules
   */
  function groupBails (rules) {
    var groups = [];
    var bailIndex = rules.findIndex(function (ref) {
      var rule = ref[2];

      return rule.toLowerCase() === 'bail';
    });
    var optionalIndex = rules.findIndex(function (ref) {
      var rule = ref[2];

      return rule.toLowerCase() === 'optional';
    });
    if (optionalIndex >= 0) {
      var rule = rules.splice(optionalIndex, 1);
      groups.push(Object.defineProperty(rule, 'bail', { value: true }));
    }
    if (bailIndex >= 0) {
      // Get all the rules until the first bail rule (dont include the bail)
      var preBail = rules.splice(0, bailIndex + 1).slice(0, -1);
      // Rules before the `bail` rule are non-bailing
      preBail.length && groups.push(preBail);
      // All remaining rules are bailing rule groups
      rules.map(function (rule) { return groups.push(Object.defineProperty([rule], 'bail', { value: true })); });
    } else {
      groups.push(rules);
    }

    return groups.reduce(function (groups, group) {
      // Recursively split rules into groups based on the modifiers.
      var splitByMod = function (group, bailGroup) {
        if ( bailGroup === void 0 ) bailGroup = false;

        if (group.length < 2) {
          return Object.defineProperty([group], 'bail', { value: bailGroup })
        }
        var splits = [];
        var modIndex = group.findIndex(function (ref) {
          var modifier = ref[3];

          return modifier === '^';
        });
        if (modIndex >= 0) {
          var preMod = group.splice(0, modIndex);
          // rules before the modifier are non-bailing rules.
          preMod.length && splits.push.apply(splits, splitByMod(preMod, bailGroup));
          splits.push(Object.defineProperty([group.shift()], 'bail', { value: true }));
          // rules after the modifier are non-bailing rules.
          group.length && splits.push.apply(splits, splitByMod(group, bailGroup));
        } else {
          splits.push(group);
        }
        return splits
      };
      return groups.concat(splitByMod(group))
    }, [])
  }

  /**
   * Escape a string for use in regular expressions.
   * @param {string} string
   */
  function escapeRegExp (string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  }

  /**
   * Given a string format (date) return a regex to match against.
   * @param {string} format
   */
  function regexForFormat (format) {
    var escaped = "^" + (escapeRegExp(format)) + "$";
    var formats = {
      MM: '(0[1-9]|1[012])',
      M: '([1-9]|1[012])',
      DD: '([012][0-9]|3[01])',
      D: '([012]?[0-9]|3[01])',
      YYYY: '\\d{4}',
      YY: '\\d{2}'
    };
    return new RegExp(Object.keys(formats).reduce(function (regex, format) {
      return regex.replace(format, formats[format])
    }, escaped))
  }

  /**
   * Given a locale string, parse the options.
   * @param {string} locale
   */
  function parseLocale (locale) {
    var segments = locale.split('-');
    return segments.reduce(function (options, segment) {
      if (options.length) {
        options.unshift(((options[0]) + "-" + segment));
      }
      return options.length ? options : [segment]
    }, [])
  }

  /**
   * Shorthand for Object.prototype.hasOwnProperty.call (space saving)
   */
  function has (ctx, prop) {
    return Object.prototype.hasOwnProperty.call(ctx, prop)
  }

  /**
   * Set a unique Symbol identifier on an object.
   * @param {object} o
   * @param {Symbol} id
   */
  function setId (o, id) {
    if (!has(o, '__id') || id) {
      return Object.defineProperty(o, '__id', Object.assign(Object.create(null), { value: id || token(9) }))
    }
    return o
  }

  /**
   * Determines if a given value is considered "empty"
   * @param {any} value
   */
  function isEmpty (value) {
    if (typeof value === 'number') {
      return false
    }
    return (
      value === undefined ||
      value === '' ||
      value === null ||
      value === false ||
      (
        Array.isArray(value) && !value.some(function (v) { return !isEmpty(v); })
      ) ||
      (
        (value && !Array.isArray(value) && typeof value === 'object' && isEmpty(Object.values(value)))
      )
    )
  }

  /**
   * Extract a set of attributes.
   * @param {object} obj object to extract from
   * @param {array} array of keys to extract
   */
  function extractAttributes (obj, keys) {
    return Object.keys(obj).reduce(function (props, key) {
      var propKey = camel(key);
      if (keys.includes(propKey)) {
        props[propKey] = obj[key];
      }
      return props
    }, {})
  }

  /**
   * Create a hash of a given string.
   * Credit: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript#answer-52171480
   *
   * @param {string} str
   * @param {int} seed
   */
  function cyrb43 (str, seed) {
    if ( seed === void 0 ) seed = 0;

    var h1 = 0xdeadbeef ^ seed;
    var h2 = 0x41c6ce57 ^ seed;
    for (var i = 0, ch = (void 0); i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0)
  }
  /**
   * Create a new debouncer — will debounce any function calls.
   */
  function createDebouncer () {
    var timeout;
    return function debounceFn (fn, args, delay) {
      var this$1$1 = this;

      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function () { return fn.call.apply(fn, [ this$1$1 ].concat( args )); }, delay);
    }
  }

  /**
   * Creates a unique id of a given length.
   * @param {number} length
   * @returns
   */
  function token (length) {
    if ( length === void 0 ) length = 13;

    return Math.random().toString(36).substring(2, length + 2)
  }

  var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;

  var localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/;
  var nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;

  /**
   * Loosely validate a URL `string`.
   *
   * Credit: https://github.com/segmentio/is-url
   *
   * @param {String} string
   * @return {Boolean}
   */

  function isUrl (string) {
    if (typeof string !== 'string') {
      return false
    }

    var match = string.match(protocolAndDomainRE);
    if (!match) {
      return false
    }

    var everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
      return false
    }

    if (localhostDomainRE.test(everythingAfterProtocol) ||
        nonLocalhostDomainRE.test(everythingAfterProtocol)) {
      return true
    }

    return false
  }

  /**
   * The file upload class holds and represents a file’s upload state durring
   * the upload flow.
   */
  var FileUpload = function FileUpload (input, context, globalOptions) {
    if ( globalOptions === void 0 ) globalOptions = {};

    this.input = input;
    this.fileList = input.files;
    this.files = [];
    this.options = Object.assign({}, {mimes: {}},
      globalOptions);
    this.results = false;
    this.context = context;
    this.dataTransferCheck();
    if (context && context.uploadUrl) {
      this.options.uploadUrl = context.uploadUrl;
    }
    this.uploadPromise = null;
    if (Array.isArray(this.fileList)) {
      this.rehydrateFileList(this.fileList);
    } else {
      this.addFileList(this.fileList);
    }
  };

  /**
   * Given a pre-existing array of files, create a faux FileList.
   * @param {array} items expects an array of objects [{ url: '/uploads/file.pdf' }]
   * @param {string} pathKey the object-key to access the url (defaults to "url")
   */
  FileUpload.prototype.rehydrateFileList = function rehydrateFileList (items) {
      var this$1$1 = this;

    var fauxFileList = items.reduce(function (fileList, item) {
      var key = this$1$1.options ? this$1$1.options.fileUrlKey : 'url';
      var url = item[key];
      var ext = (url && url.lastIndexOf('.') !== -1) ? url.substr(url.lastIndexOf('.') + 1) : false;
      var mime = this$1$1.options.mimes[ext] || false;
      fileList.push(Object.assign({}, item, url ? {
        name: item.name || url.substr((url.lastIndexOf('/') + 1) || 0),
        type: item.type ? item.type : mime,
        previewData: url
      } : {}));
      return fileList
    }, []);
    this.addFileList(fauxFileList);
    this.results = this.mapUUID(items);
  };

  /**
   * Produce an array of files and alert the callback.
   * @param {FileList}
   */
  FileUpload.prototype.addFileList = function addFileList (fileList) {
      var this$1$1 = this;

    var loop = function ( i ) {
      var file = fileList[i];
      var uuid = token();
      var removeFile = function () {
        this.removeFile(uuid);
      };
      this$1$1.files.push({
        progress: false,
        error: false,
        complete: false,
        justFinished: false,
        name: file.name || 'file-upload',
        file: file,
        uuid: uuid,
        path: false,
        removeFile: removeFile.bind(this$1$1),
        previewData: file.previewData || false
      });
    };

      for (var i = 0; i < fileList.length; i++) loop( i );
  };

  /**
   * Check if the file has an.
   */
  FileUpload.prototype.hasUploader = function hasUploader () {
    return !!this.context.uploader
  };

  /**
   * Check if the given uploader is axios instance. This isn't a great way of
   * testing if it is or not, but AFIK there isn't a better way right now:
   *
   * https://github.com/axios/axios/issues/737
   */
  FileUpload.prototype.uploaderIsAxios = function uploaderIsAxios () {
    if (
      this.hasUploader() &&
      typeof this.context.uploader.request === 'function' &&
      typeof this.context.uploader.get === 'function' &&
      typeof this.context.uploader.delete === 'function' &&
      typeof this.context.uploader.post === 'function'
    ) {
      return true
    }
    return false
  };

  /**
   * Get a new uploader function.
   */
  FileUpload.prototype.getUploader = function getUploader () {
      var ref;

      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];
    if (this.uploaderIsAxios()) {
      var formData = new FormData();
      formData.append(this.context.name || 'file', args[0]);
      if (this.context.uploadUrl === false) {
        throw new Error('No uploadURL specified: https://vueformulate.com/guide/inputs/file/#props')
      }
      return this.context.uploader.post(this.context.uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: function (progressEvent) {
          // args[1] here is the upload progress handler function
          args[1](Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      })
        .then(function (res) { return res.data; })
        .catch(function (err) { return args[2](err); })
    }
    return (ref = this.context).uploader.apply(ref, args)
  };

  /**
   * Perform the file upload.
   */
  FileUpload.prototype.upload = function upload () {
      var this$1$1 = this;

    // If someone calls upload() when an upload is already in process or there
    // already was an upload completed, chain the upload request to the
    // existing one. Already uploaded files wont re-upload and it ensures any
    // files that were added after the initial list are completed too.
    this.uploadPromise = this.uploadPromise
      ? this.uploadPromise.then(function () { return this$1$1.__performUpload(); })
      : this.__performUpload();
    return this.uploadPromise
  };

  /**
   * Perform the actual upload event. Intended to be a private method that is
   * only called through the upload() function as chaining utility.
   */
  FileUpload.prototype.__performUpload = function __performUpload () {
      var this$1$1 = this;

    return new Promise(function (resolve, reject) {
      if (!this$1$1.hasUploader()) {
        return reject(new Error('No uploader has been defined'))
      }
      Promise.all(this$1$1.files.map(function (file) {
        file.error = false;
        file.complete = !!file.path;
        return file.path ? Promise.resolve(file.path) : this$1$1.getUploader(
          file.file,
          function (progress) {
            file.progress = progress;
            this$1$1.context.rootEmit('file-upload-progress', progress);
            if (progress >= 100) {
              if (!file.complete) {
                file.justFinished = true;
                setTimeout(function () { file.justFinished = false; }, this$1$1.options.uploadJustCompleteDuration);
              }
              file.complete = true;
              this$1$1.context.rootEmit('file-upload-complete', file);
            }
          },
          function (error) {
            file.progress = 0;
            file.error = error;
            file.complete = true;
            this$1$1.context.rootEmit('file-upload-error', error);
            reject(error);
          },
          this$1$1.options
        )
      }))
        .then(function (results) {
          this$1$1.results = this$1$1.mapUUID(results);
          resolve(results);
        })
        .catch(function (err) {
          throw new Error(err)
        });
    })
  };

  /**
   * Remove a file from the uploader (and the file list)
   * @param {string} uuid
   */
  FileUpload.prototype.removeFile = function removeFile (uuid) {
    var originalLength = this.files.length;
    this.files = this.files.filter(function (file) { return file && file.uuid !== uuid; });
    if (Array.isArray(this.results)) {
      this.results = this.results.filter(function (file) { return file && file.__id !== uuid; });
    }
    this.context.performValidation();
    if (window && this.fileList instanceof FileList && this.supportsDataTransfers) {
      var transfer = new DataTransfer();
      this.files.forEach(function (file) { return transfer.items.add(file.file); });
      this.fileList = transfer.files;
      this.input.files = this.fileList;
    } else {
      this.fileList = this.fileList.filter(function (file) { return file && file.__id !== uuid; });
    }
    if (originalLength > this.files.length) {
      this.context.rootEmit('file-removed', this.files);
    }
  };

  /**
   * Given another input element, add the files from that FileList to the
   * input being represented by this FileUpload.
   *
   * @param {HTMLElement} input
   */
  FileUpload.prototype.mergeFileList = function mergeFileList (input) {
    this.addFileList(input.files);
    // Create a new mutable FileList
    if (this.supportsDataTransfers) {
      var transfer = new DataTransfer();
      this.files.forEach(function (file) {
        if (file.file instanceof File) {
          transfer.items.add(file.file);
        }
      });
      this.fileList = transfer.files;
      this.input.files = this.fileList;
      // Reset the merged FileList to empty
      input.files = (new DataTransfer()).files;
    }
    this.context.performValidation();
    this.loadPreviews();
    if (this.context.uploadBehavior !== 'delayed') {
      this.upload();
    }
  };

  /**
   * load image previews for all uploads.
   */
  FileUpload.prototype.loadPreviews = function loadPreviews () {
    this.files.map(function (file) {
      if (!file.previewData && window && window.FileReader && /^image\//.test(file.file.type)) {
        var reader = new FileReader();
        reader.onload = function (e) { return Object.assign(file, { previewData: e.target.result }); };
        reader.readAsDataURL(file.file);
      }
    });
  };

  /**
   * Check if the current browser supports the DataTransfer constructor.
   */
  FileUpload.prototype.dataTransferCheck = function dataTransferCheck () {
    try {
      new DataTransfer(); // eslint-disable-line
      this.supportsDataTransfers = true;
    } catch (err) {
      this.supportsDataTransfers = false;
    }
  };

  /**
   * Get the files.
   */
  FileUpload.prototype.getFiles = function getFiles () {
    return this.files
  };

  /**
   * Run setId on each item of a pre-existing array of items.
   * @param {array} items expects an array of objects [{ url: '/uploads/file.pdf' }]
   */
  FileUpload.prototype.mapUUID = function mapUUID (items) {
      var this$1$1 = this;

    return items.map(function (result, index) {
      this$1$1.files[index].path = result !== undefined ? result : false;
      return result && setId(result, this$1$1.files[index].uuid)
    })
  };

  FileUpload.prototype.toString = function toString () {
    var descriptor = this.files.length ? this.files.length + ' files' : 'empty';
    return this.results ? JSON.stringify(this.results, null, '  ') : ("FileUpload(" + descriptor + ")")
  };

  /**
   * Library of rules
   */
  var rules = {
    /**
     * Rule: the value must be "yes", "on", "1", or true
     */
    accepted: function (ref) {
      var value = ref.value;

      return Promise.resolve(['yes', 'on', '1', 1, true, 'true'].includes(value))
    },

    /**
     * Rule: checks if a value is after a given date. Defaults to current time
     */
    after: function (ref, compare) {
      var value = ref.value;
      if ( compare === void 0 ) compare = false;

      var timestamp = Date.parse(compare || new Date());
      var fieldValue = Date.parse(value);
      return Promise.resolve(isNaN(fieldValue) ? false : (fieldValue > timestamp))
    },

    /**
     * Rule: checks if the value is only alpha
     */
    alpha: function (ref, set) {
      var value = ref.value;
      if ( set === void 0 ) set = 'default';

      var sets = {
        default: /^[a-zA-ZÀ-ÖØ-öø-ÿĄąĆćĘęŁłŃńŚśŹźŻż]+$/,
        latin: /^[a-zA-Z]+$/
      };
      var selectedSet = sets.hasOwnProperty(set) ? set : 'default';
      return Promise.resolve(sets[selectedSet].test(value))
    },

    /**
     * Rule: checks if the value is alpha numeric
     */
    alphanumeric: function (ref, set) {
      var value = ref.value;
      if ( set === void 0 ) set = 'default';

      var sets = {
        default: /^[a-zA-Z0-9À-ÖØ-öø-ÿĄąĆćĘęŁłŃńŚśŹźŻż]+$/,
        latin: /^[a-zA-Z0-9]+$/
      };
      var selectedSet = sets.hasOwnProperty(set) ? set : 'default';
      return Promise.resolve(sets[selectedSet].test(value))
    },

    /**
     * Rule: checks if a value is after a given date. Defaults to current time
     */
    before: function (ref, compare) {
      var value = ref.value;
      if ( compare === void 0 ) compare = false;

      var timestamp = Date.parse(compare || new Date());
      var fieldValue = Date.parse(value);
      return Promise.resolve(isNaN(fieldValue) ? false : (fieldValue < timestamp))
    },

    /**
     * Rule: checks if the value is between two other values
     */
    between: function (ref, from, to, force) {
      var value = ref.value;
      if ( from === void 0 ) from = 0;
      if ( to === void 0 ) to = 10;

      return Promise.resolve((function () {
        if (from === null || to === null || isNaN(from) || isNaN(to)) {
          return false
        }
        if ((!isNaN(value) && force !== 'length') || force === 'value') {
          value = Number(value);
          from = Number(from);
          to = Number(to);
          return (value > from && value < to)
        }
        if (typeof value === 'string' || force === 'length') {
          value = !isNaN(value) ? value.toString() : value;
          return value.length > from && value.length < to
        }
        return false
      })())
    },

    /**
     * Confirm that the value of one field is the same as another, mostly used
     * for password confirmations.
     */
    confirm: function (ref, field) {
      var value = ref.value;
      var getGroupValues = ref.getGroupValues;
      var name = ref.name;

      return Promise.resolve((function () {
        var values = getGroupValues();
        var confirmationFieldName = field;
        if (!confirmationFieldName) {
          confirmationFieldName = /_confirm$/.test(name) ? name.substr(0, name.length - 8) : (name + "_confirm");
        }
        return values[confirmationFieldName] === value
      })())
    },

    /**
     * Rule: ensures the value is a date according to Date.parse(), or a format
     * regex.
     */
    date: function (ref, format) {
      var value = ref.value;
      if ( format === void 0 ) format = false;

      return Promise.resolve((function () {
        if (format && typeof format === 'string') {
          return regexForFormat(format).test(value)
        }
        return !isNaN(Date.parse(value))
      })())
    },

    /**
     * Rule: tests
     */
    email: function (ref) {
      var value = ref.value;

      // eslint-disable-next-line
      var isEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      return Promise.resolve(isEmail.test(value))
    },

    /**
     * Rule: Value ends with one of the given Strings
     */
    endsWith: function (ref) {
      var value = ref.value;
      var stack = [], len = arguments.length - 1;
      while ( len-- > 0 ) stack[ len ] = arguments[ len + 1 ];

      return Promise.resolve((function () {
        if (typeof value === 'string' && stack.length) {
          return stack.find(function (item) {
            return value.endsWith(item)
          }) !== undefined
        } else if (typeof value === 'string' && stack.length === 0) {
          return true
        }
        return false
      })())
    },

    /**
     * Rule: Value is in an array (stack).
     */
    in: function (ref) {
      var value = ref.value;
      var stack = [], len = arguments.length - 1;
      while ( len-- > 0 ) stack[ len ] = arguments[ len + 1 ];

      return Promise.resolve(stack.find(function (item) {
        if (typeof item === 'object') {
          return equals(item, value)
        }
        return item === value
      }) !== undefined)
    },

    /**
     * Rule: Match the value against a (stack) of patterns or strings
     */
    matches: function (ref) {
      var value = ref.value;
      var stack = [], len = arguments.length - 1;
      while ( len-- > 0 ) stack[ len ] = arguments[ len + 1 ];

      return Promise.resolve(!!stack.find(function (pattern) {
        if (typeof pattern === 'string' && pattern.substr(0, 1) === '/' && pattern.substr(-1) === '/') {
          pattern = new RegExp(pattern.substr(1, pattern.length - 2));
        }
        if (pattern instanceof RegExp) {
          return pattern.test(value)
        }
        return pattern === value
      }))
    },

    /**
     * Check the file type is correct.
     */
    mime: function (ref) {
      var value = ref.value;
      var types = [], len = arguments.length - 1;
      while ( len-- > 0 ) types[ len ] = arguments[ len + 1 ];

      return Promise.resolve((function () {
        if (value instanceof FileUpload) {
          var fileList = value.getFiles();
          for (var i = 0; i < fileList.length; i++) {
            var file = fileList[i].file;
            if (!types.includes(file.type)) {
              return false
            }
          }
        }
        return true
      })())
    },

    /**
     * Check the minimum value of a particular.
     */
    min: function (ref, minimum, force) {
      var value = ref.value;
      if ( minimum === void 0 ) minimum = 1;

      return Promise.resolve((function () {
        if (Array.isArray(value)) {
          minimum = !isNaN(minimum) ? Number(minimum) : minimum;
          return value.length >= minimum
        }
        if ((!isNaN(value) && force !== 'length') || force === 'value') {
          value = !isNaN(value) ? Number(value) : value;
          return value >= minimum
        }
        if (typeof value === 'string' || (force === 'length')) {
          value = !isNaN(value) ? value.toString() : value;
          return value.length >= minimum
        }
        return false
      })())
    },

    /**
     * Check the maximum value of a particular.
     */
    max: function (ref, maximum, force) {
      var value = ref.value;
      if ( maximum === void 0 ) maximum = 10;

      return Promise.resolve((function () {
        if (Array.isArray(value)) {
          maximum = !isNaN(maximum) ? Number(maximum) : maximum;
          return value.length <= maximum
        }
        if ((!isNaN(value) && force !== 'length') || force === 'value') {
          value = !isNaN(value) ? Number(value) : value;
          return value <= maximum
        }
        if (typeof value === 'string' || (force === 'length')) {
          value = !isNaN(value) ? value.toString() : value;
          return value.length <= maximum
        }
        return false
      })())
    },

    /**
     * Rule: Value is not in stack.
     */
    not: function (ref) {
      var value = ref.value;
      var stack = [], len = arguments.length - 1;
      while ( len-- > 0 ) stack[ len ] = arguments[ len + 1 ];

      return Promise.resolve(stack.find(function (item) {
        if (typeof item === 'object') {
          return equals(item, value)
        }
        return item === value
      }) === undefined)
    },

    /**
     * Rule: checks if the value is only alpha numeric
     */
    number: function (ref) {
      var value = ref.value;

      return Promise.resolve(!isNaN(value))
    },

    /**
     * Rule: must be a value - allows for an optional argument "whitespace" with a possible value 'trim' and default 'pre'.
     */
    required: function (ref, whitespace) {
      var value = ref.value;
      if ( whitespace === void 0 ) whitespace = 'pre';

      return Promise.resolve((function () {
        if (Array.isArray(value)) {
          return !!value.length
        }
        if (value instanceof FileUpload) {
          return value.getFiles().length > 0
        }
        if (typeof value === 'string') {
          return whitespace === 'trim' ? !!value.trim() : !!value
        }
        if (typeof value === 'object') {
          return (!value) ? false : !!Object.keys(value).length
        }
        return true
      })())
    },

    /**
     * Rule: Value starts with one of the given Strings
     */
    startsWith: function (ref) {
      var value = ref.value;
      var stack = [], len = arguments.length - 1;
      while ( len-- > 0 ) stack[ len ] = arguments[ len + 1 ];

      return Promise.resolve((function () {
        if (typeof value === 'string' && stack.length) {
          return stack.find(function (item) {
            return value.startsWith(item)
          }) !== undefined
        } else if (typeof value === 'string' && stack.length === 0) {
          return true
        }
        return false
      })())
    },

    /**
     * Rule: checks if a string is a valid url
     */
    url: function (ref) {
      var value = ref.value;

      return Promise.resolve(isUrl(value))
    },

    /**
     * Rule: not a true rule — more like a compiler flag.
     */
    bail: function () {
      return Promise.resolve(true)
    },

    /**
     * Rule: not a true rule - more like a compiler flag.
     */
    optional: function (ref) {
      var value = ref.value;

      // So technically we "fail" this rule anytime the field is empty. This rule
      // is automatically hoisted to the top of the validation stack, and marked
      // as a "bail" rule, meaning if it fails, no further validation will be run.
      // Finally, the error message associated with this rule is filtered out.
      return Promise.resolve(!isEmpty(value))
    }
  };

  var i = 'image/';
  var mimes = {
    'csv': 'text/csv',
    'gif': i + 'gif',
    'jpg': i + 'jpeg',
    'jpeg': i + 'jpeg',
    'png': i + 'png',
    'pdf': 'application/pdf',
    'svg': i + 'svg+xml'
  };

  /**
   * A list of available class keys in core. These can be added to by extending
   * the `classKeys` global option when registering formulate.
   */
  var classKeys = [
    // Globals
    'outer',
    'wrapper',
    'label',
    'element',
    'input',
    'help',
    'errors',
    'error',
    // Box
    'decorator',
    // Slider
    'rangeValue',
    // File
    'uploadArea',
    'uploadAreaMask',
    'files',
    'file',
    'fileName',
    'fileAdd',
    'fileAddInput',
    'fileRemove',
    'fileProgress',
    'fileUploadError',
    'fileImagePreview',
    'fileImagePreviewImage',
    'fileProgressInner',
    // Groups
    'grouping',
    'groupRepeatable',
    'groupRepeatableRemove',
    'groupAddMore',
    // Forms
    'form',
    'formErrors',
    'formError'
  ];

  /**
   * State keys by default
   */
  var states = {
    hasErrors: function (c) { return c.hasErrors; },
    hasValue: function (c) { return c.hasValue; },
    isValid: function (c) { return c.isValid; }
  };

  /**
   * This function is responsible for providing VueFormulate’s default classes.
   * This function is called with the specific classKey ('wrapper' for example)
   * that it needs to generate classes for, and the context object. It always
   * returns an array.
   *
   * @param {string} classKey
   * @param {Object} context
   */
  var classGenerator = function (classKey, context) {
    // camelCase to dash-case
    var key = classKey.replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); });
    var prefix = ['form', 'file'].includes(key.substr(0, 4)) ? '' : '-input';
    var element = ['decorator', 'range-value'].includes(key) ? '-element' : '';
    var base = "formulate" + prefix + element + (key !== 'outer' ? ("-" + key) : '');
    return key === 'input' ? [] : [base].concat(classModifiers(base, classKey, context))
  };

  /**
   * Given a class key and a modifier, produce any additional classes.
   * @param {string} classKey
   * @param {Object} context
   */
  var classModifiers = function (base, classKey, context) {
    var modifiers = [];
    switch (classKey) {
      case 'label':
        modifiers.push((base + "--" + (context.labelPosition)));
        break
      case 'element':
        var type = context.classification === 'group' ? 'group' : context.type;
        modifiers.push((base + "--" + type));
        // @todo DEPRECATED! This should be removed in a future version:
        if (type === 'group') {
          modifiers.push('formulate-input-group');
        }
        break
      case 'help':
        modifiers.push((base + "--" + (context.helpPosition)));
        break
      case 'form':
        if (context.name) {
          modifiers.push((base + "--" + (context.name)));
        }
    }
    return modifiers
  };

  /**
   * Generate a list of all the class props to accept.
   */
  var classProps = (function () {
    var stateKeys = [''].concat(Object.keys(states).map(function (s) { return cap(s); }));
    // This reducer produces a key for every element key + state key variation
    return classKeys.reduce(function (props, classKey) {
      return props.concat(stateKeys.reduce(function (keys, stateKey) {
        keys.push(("" + classKey + stateKey + "Class"));
        return keys
      }, []))
    }, [])
  })();

  /**
   * Given a string or array of classes and a modifier (function, string etc) apply
   * the modifications.
   *
   * @param {mixed} baseClass The initial class for a given key
   * @param {mixed} modifier A function, string, array etc that can be a class prop.
   * @param {Object} context The class context
   */
  function applyClasses (baseClass, modifier, context) {
    switch (typeof modifier) {
      case 'string':
        return modifier
      case 'function':
        return modifier(context, arrayify(baseClass))
      case 'object':
        if (Array.isArray(modifier)) {
          return arrayify(baseClass).concat(modifier)
        }
      /** allow fallthrough if object that isn’t an array */
      default:
        return baseClass
    }
  }

  /**
   * Given element class key
   * @param {string} elementKey the element class key we're generating for
   * @param {mixed} baseClass The initial classes for this key
   * @param {object} global Class definitions globally registered with options.classes
   * @param {Object} context Class context for this particular field, props included.
   */
  function applyStates (elementKey, baseClass, globals, context) {
    return Object.keys(states).reduce(function (classes, stateKey) {
      // Step 1. Call the state function to determine if it has this state
      if (states[stateKey](context)) {
        var key = "" + elementKey + (cap(stateKey));
        var propKey = key + "Class";
        // Step 2. Apply any global state class keys
        if (globals[key]) {
          var modifier = (typeof globals[key] === 'string') ? arrayify(globals[key]) : globals[key];
          classes = applyClasses(classes, modifier, context);
        }
        // Step 3. Apply any prop state class keys
        if (context[propKey]) {
          var modifier$1 = (typeof context[propKey] === 'string') ? arrayify(context[propKey]) : context[(key + "Class")];
          classes = applyClasses(classes, modifier$1, context);
        }
      }
      return classes
    }, baseClass)
  }

  /**
   * Function that produces all available classes.
   * @param {Object} context
   */
  function coreClasses (context) {
    return classKeys.reduce(function (classes, classKey) {
      var obj;

      return Object.assign(classes, ( obj = {}, obj[classKey] = classGenerator(classKey, context), obj ));
    }, {})
  }

  /**
   * A fake uploader used by default.
   *
   * @param {File} file
   * @param {function} progress
   * @param {function} error
   * @param {object} options
   */
  function fauxUploader (file, progress, error, options) {
    return new Promise(function (resolve, reject) {
      var totalTime = (options.fauxUploaderDuration || 1500) * (0.5 + Math.random());
      var start = performance.now();

      /**
       * Create a recursive timeout that advances the progress.
       */
      var advance = function () { return setTimeout(function () {
        var elapsed = performance.now() - start;
        var currentProgress = Math.min(100, Math.round(elapsed / totalTime * 100));
        progress(currentProgress);

        if (currentProgress >= 100) {
          return resolve({
            url: 'http://via.placeholder.com/350x150.png',
            name: file.name
          })
        } else {
          advance();
        }
      }, 20); };
      advance();
    })
  }

  function objectWithoutProperties$5 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var FormulateSlot = {
    inheritAttrs: false,
    functional: true,
    render: function render (h, ref) {
      var props = ref.props;
      var data = ref.data;
      var parent = ref.parent;
      var children = ref.children;

      var p = parent;
      props.name;
      var forceWrap = props.forceWrap;
      var context = props.context;
      var rest = objectWithoutProperties$5( props, ["name", "forceWrap", "context"] );
      var mergeWithContext = rest;

      // Look up the ancestor tree for the first FormulateInput
      while (p && p.$options.name !== 'FormulateInput') {
        p = p.$parent;
      }

      // if we never found the proper parent, just end it.
      if (!p) {
        return null
      }

      // If we found a formulate input, check for a matching scoped slot
      if (p.$scopedSlots && p.$scopedSlots[props.name]) {
        return p.$scopedSlots[props.name](Object.assign({}, context, mergeWithContext))
      }

      // If we found no scoped slot, take the children and render those inside a wrapper if there are multiple
      if (Array.isArray(children) && (children.length > 1 || (forceWrap && children.length > 0))) {
        var ref$1 = data.attrs;
        ref$1.name;
        ref$1.context;
        var rest = objectWithoutProperties$5( ref$1, ["name", "context"] );
        var attrs = rest;
        return h('div', Object.assign({}, data, {attrs: attrs}), children)

      // If there is only one child, render it alone
      } else if (Array.isArray(children) && children.length === 1) {
        return children[0]
      }

      // If there are no children, render nothing
      return null
    }
  };

  function objectWithoutProperties$4 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  /**
   * Given an object and an index, complete an object for schema-generation.
   * @param {object} item
   * @param {int} index
   */
  function leaf (item, index, rootListeners) {
    if ( index === void 0 ) index = 0;
    if ( rootListeners === void 0 ) rootListeners = {};

    if (item && typeof item === 'object' && !Array.isArray(item)) {
      var children = item.children; if ( children === void 0 ) children = null;
      var component = item.component; if ( component === void 0 ) component = 'FormulateInput';
      var depth = item.depth; if ( depth === void 0 ) depth = 1;
      var key = item.key; if ( key === void 0 ) key = null;
      var rest = objectWithoutProperties$4( item, ["children", "component", "depth", "key"] );
      var attrs = rest;
      // these next two lines are required since `class` is a keyword and should
      // not be used in rest/spread operators.
      var cls = attrs.class || {};
      delete attrs.class;
      // Event bindings
      var on = {};

      // Extract events from this instance
      var events = Object.keys(attrs)
        .reduce(function (events, key) {
          var obj;

          return /^@/.test(key) ? Object.assign(events, ( obj = {}, obj[key.substr(1)] = attrs[key], obj )) : events;
      }, {});

      // delete all events from the item
      Object.keys(events).forEach(function (event) {
        delete attrs[("@" + event)];
        on[event] = createListener(event, events[event], rootListeners);
      });

      var type = component === 'FormulateInput' ? (attrs.type || 'text') : component;
      var name = attrs.name || type || 'el';
      if (!key) {
        // We need to generate a unique key if at all possible
        if (attrs.id) {
          // We've been given an id, so we should use it.
          key = attrs.id;
        } else if (component !== 'FormulateInput' && typeof children === 'string') {
          // This is a simple text node container.
          key = type + "-" + (cyrb43(children));
        } else {
          // This is a wrapper element
          key = type + "-" + name + "-" + depth + (attrs.name ? '' : '-' + index);
        }
      }
      var els = Array.isArray(children)
        ? children.map(function (child) { return Object.assign(child, { depth: depth + 1 }); })
        : children;
      return Object.assign({ key: key, depth: depth, attrs: attrs, component: component, class: cls, on: on }, els ? { children: els } : {})
    }
    return null
  }

  /**
   * Recursive function to create vNodes from a schema.
   * @param {Functon} h createElement
   * @param {Array|string} schema
   */
  function tree (h, schema, rootListeners) {
    if (Array.isArray(schema)) {
      return schema.map(function (el, index) {
        var item = leaf(el, index, rootListeners);
        return h(
          item.component,
          { attrs: item.attrs, class: item.class, key: item.key, on: item.on },
          item.children ? tree(h, item.children, rootListeners) : null
        )
      })
    }
    return schema
  }

  /**
   * Given an event name and handler, return a handler function that re-emits.
   *
   * @param {string} event
   * @param {string|boolean|function} handler
   */
  function createListener (eventName, handler, rootListeners) {
    return function () {
      var ref, ref$1;

      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];
      // For event leafs like { '@blur': function () { ..do things... } }
      if (typeof handler === 'function') {
        return handler.call.apply(handler, [ this ].concat( args ))
      }
      // For event leafs like { '@blur': 'nameBlur' }
      if (typeof handler === 'string' && has(rootListeners, handler)) {
        return (ref = rootListeners[handler]).call.apply(ref, [ this ].concat( args ))
      }
      // For event leafs like { '@blur': true }
      if (has(rootListeners, eventName)) {
        return (ref$1 = rootListeners[eventName]).call.apply(ref$1, [ this ].concat( args ))
      }
    }
  }

  var FormulateSchema = {
    functional: true,
    render: function (h, ref) {
      var props = ref.props;
      var listeners = ref.listeners;

      return tree(h, props.schema, listeners);
  }
  };

  function objectWithoutProperties$3 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  /**
   * Component registry with inherent depth to handle complex nesting. This is
   * important for features such as grouped fields.
   */
  var Registry = function Registry (ctx) {
    this.registry = new Map();
    this.errors = {};
    this.ctx = ctx;
  };

  /**
   * Add an item to the registry.
   * @param {string|array} key
   * @param {vue} component
   */
  Registry.prototype.add = function add (name, component) {
      var obj;

    this.registry.set(name, component);
    this.errors = Object.assign({}, this.errors, ( obj = {}, obj[name] = component.getErrorObject().hasErrors, obj ));
    return this
  };

  /**
   * Remove an item from the registry.
   * @param {string} name
   */
  Registry.prototype.remove = function remove (name) {
    // Clean up dependent validations
    this.ctx.deps.delete(this.registry.get(name));
    this.ctx.deps.forEach(function (dependents) { return dependents.delete(name); });

    // Determine if we're keep the model data or destroying it
    var keepData = this.ctx.keepModelData;
    if (!keepData && this.registry.has(name) && this.registry.get(name).keepModelData !== 'inherit') {
      keepData = this.registry.get(name).keepModelData;
    }
    if (this.ctx.preventCleanup) {
      keepData = true;
    }

    this.registry.delete(name);
    var ref = this.errors;
      ref[name];
      var rest = objectWithoutProperties$3( ref, [String(name)] );
      var errorValues = rest;
    this.errors = errorValues;

    // Clean up the model if we don't explicitly state otherwise
    if (!keepData) {
      var ref$1 = this.ctx.proxy;
        ref$1[name];
        var rest = objectWithoutProperties$3( ref$1, [String(name)] );
        var newProxy = rest;
      if (this.ctx.uuid) {
        // If the registry context has a uuid (row.__id) be sure to include it in
        // this input event so it can replace values in the proper row.
        setId(newProxy, this.ctx.uuid);
      }
      this.ctx.proxy = newProxy;
      this.ctx.$emit('input', this.ctx.proxy);
    }
    return this
  };

  /**
   * Check if the registry has the given key.
   * @param {string|array} key
   */
  Registry.prototype.has = function has (key) {
    return this.registry.has(key)
  };

  /**
   * Get a particular registry value.
   * @param {string} key
   */
  Registry.prototype.get = function get (key) {
    return this.registry.get(key)
  };

  /**
   * Map over the registry (recursively).
   * @param {function} callback
   */
  Registry.prototype.map = function map (callback) {
    var value = {};
    this.registry.forEach(function (component, field) {
        var obj;

        return Object.assign(value, ( obj = {}, obj[field] = callback(component, field), obj ));
      });
    return value
  };

  /**
   * Return the keys of the registry.
   */
  Registry.prototype.keys = function keys () {
    return Array.from(this.registry.keys())
  };

  /**
   * Fully register a component.
   * @param {string} field name of the field.
   * @param {vm} component the actual component instance.
   */
  Registry.prototype.register = function register (field, component) {
      var this$1$1 = this;

    if (has(component.$options.propsData, 'ignored')) {
      // Any presence of the `ignored` prop will ensure this input is skipped.
      return false
    }
    if (this.registry.has(field)) {
      // Here we check to see if the field we are about to register is going to
      // immediately be removed. That indicates this field is switching like in
      // a v-if:
      //
      // <FormulateInput name="foo" v-if="condition" />
      // <FormulateInput name="foo" v-else />
      //
      // Because created() fires _before_ destroyed() the new field would not
      // register because the old one would not have yet unregistered. By
      // checking if field we're trying to register is gone on the nextTick we
      // can assume it was supposed to register, and do so "again".
      this.ctx.$nextTick(function () { return !this$1$1.registry.has(field) ? this$1$1.register(field, component) : false; });
      return false
    }
    this.add(field, component);
    var hasVModelValue = has(component.$options.propsData, 'formulateValue');
    var hasValue = has(component.$options.propsData, 'value');
    // This is not reactive
    var debounceDelay = this.ctx.debounce || this.ctx.debounceDelay || (this.ctx.context && this.ctx.context.debounceDelay);
    if (debounceDelay && !has(component.$options.propsData, 'debounce')) {
      component.debounceDelay = debounceDelay;
    }
    if (
      !hasVModelValue &&
      this.ctx.hasInitialValue &&
      !isEmpty(this.ctx.initialValues[field])
    ) {
      // In the case that the form is carrying an initial value and the
      // element is not, set it directly.
      component.context.model = this.ctx.initialValues[field];
    } else if (
      (hasVModelValue || hasValue) &&
      !equals(component.proxy, this.ctx.initialValues[field], true)
    ) {
      // In this case, the field is v-modeled or has an initial value and the
      // registry has no value or a different value, so use the field value
      this.ctx.setFieldValue(field, component.proxy);
    }
    if (this.childrenShouldShowErrors) {
      component.formShouldShowErrors = true;
    }
  };

  /**
   * Reduce the registry.
   * @param {function} callback
   */
  Registry.prototype.reduce = function reduce (callback, accumulator) {
    this.registry.forEach(function (component, field) {
      accumulator = callback(accumulator, component, field);
    });
    return accumulator
  };

  /**
   * Data props to expose.
   */
  Registry.prototype.dataProps = function dataProps () {
      var this$1$1 = this;

    return {
      proxy: {},
      registry: this,
      register: this.register.bind(this),
      deregister: function (field) { return this$1$1.remove(field); },
      childrenShouldShowErrors: false,
      errorObservers: [],
      deps: new Map(),
      preventCleanup: false
    }
  };

  /**
   * The context component.
   * @param {component} contextComponent
   */
  function useRegistry (contextComponent) {
    var registry = new Registry(contextComponent);
    return registry.dataProps()
  }

  /**
   * Computed properties related to the registry.
   */
  function useRegistryComputed (options) {

    return {
      hasInitialValue: function hasInitialValue () {
        return (
          (this.formulateValue && typeof this.formulateValue === 'object') ||
          (this.values && typeof this.values === 'object') ||
          (this.isGrouping && typeof this.context.model[this.index] === 'object')
        )
      },
      isVmodeled: function isVmodeled () {
        return !!(this.$options.propsData.hasOwnProperty('formulateValue') &&
          this._events &&
          Array.isArray(this._events.input) &&
          this._events.input.length)
      },
      initialValues: function initialValues () {
        if (
          has(this.$options.propsData, 'formulateValue') &&
          typeof this.formulateValue === 'object'
        ) {
          // If there is a v-model on the form/group, use those values as first priority
          return Object.assign({}, this.formulateValue) // @todo - use a deep clone to detach reference types?
        } else if (
          has(this.$options.propsData, 'values') &&
          typeof this.values === 'object'
        ) {
          // If there are values, use them as secondary priority
          return Object.assign({}, this.values)
        } else if (
          this.isGrouping && typeof this.context.model[this.index] === 'object'
        ) {
          return this.context.model[this.index]
        }
        return {}
      },
      mergedGroupErrors: function mergedGroupErrors () {
        var this$1$1 = this;

        var hasSubFields = /^([^.\d+].*?)\.(\d+\..+)$/;
        return Object.keys(this.mergedFieldErrors)
          .filter(function (k) { return hasSubFields.test(k); })
          .reduce(function (groupErrorsByRoot, k) {
            var obj;

            var ref = k.match(hasSubFields);
            var rootField = ref[1];
            var groupKey = ref[2];
            if (!groupErrorsByRoot[rootField]) {
              groupErrorsByRoot[rootField] = {};
            }
            Object.assign(groupErrorsByRoot[rootField], ( obj = {}, obj[groupKey] = this$1$1.mergedFieldErrors[k], obj ));
            return groupErrorsByRoot
          }, {})
      }
    }
  }

  /**
   * Methods used in the registry.
   */
  function useRegistryMethods (without) {
    if ( without === void 0 ) without = [];

    var methods = {
      applyInitialValues: function applyInitialValues () {
        if (this.hasInitialValue) {
          this.proxy = Object.assign({}, this.initialValues);
        }
      },
      setFieldValue: function setFieldValue (field, value) {
        var obj;

        if (value === undefined) {
          // undefined values should be removed from the form model
          var ref = this.proxy;
          ref[field];
          var rest = objectWithoutProperties$3( ref, [String(field)] );
          var proxy = rest;
          this.proxy = proxy;
        } else {
          Object.assign(this.proxy, ( obj = {}, obj[field] = value, obj ));
        }
        this.$emit('input', Object.assign({}, this.proxy));
      },
      valueDeps: function valueDeps (callerCmp) {
        var this$1$1 = this;

        return Object.keys(this.proxy)
          .reduce(function (o, k) { return Object.defineProperty(o, k, {
            enumerable: true,
            get: function () {
              var callee = this$1$1.registry.get(k);
              this$1$1.deps.set(callerCmp, this$1$1.deps.get(callerCmp) || new Set());
              if (callee) {
                this$1$1.deps.set(callee, this$1$1.deps.get(callee) || new Set());
                this$1$1.deps.get(callee).add(callerCmp.name);
              }
              this$1$1.deps.get(callerCmp).add(k);
              return this$1$1.proxy[k]
            }
          }); }, Object.create(null))
      },
      validateDeps: function validateDeps (callerCmp) {
        var this$1$1 = this;

        if (this.deps.has(callerCmp)) {
          this.deps.get(callerCmp).forEach(function (field) { return this$1$1.registry.has(field) && this$1$1.registry.get(field).performValidation(); });
        }
      },
      hasValidationErrors: function hasValidationErrors () {
        return Promise.all(this.registry.reduce(function (resolvers, cmp, name) {
          resolvers.push(cmp.performValidation() && cmp.getValidationErrors());
          return resolvers
        }, [])).then(function (errorObjects) { return errorObjects.some(function (item) { return item.hasErrors; }); })
      },
      showErrors: function showErrors () {
        this.childrenShouldShowErrors = true;
        this.registry.map(function (input) {
          input.formShouldShowErrors = true;
        });
      },
      hideErrors: function hideErrors () {
        this.childrenShouldShowErrors = false;
        this.registry.map(function (input) {
          input.formShouldShowErrors = false;
          input.behavioralErrorVisibility = false;
        });
      },
      setValues: function setValues (values) {
        var this$1$1 = this;

        // Collect all keys, existing and incoming
        var keys = Array.from(new Set(Object.keys(values || {}).concat(Object.keys(this.proxy))));
        keys.forEach(function (field) {
          var input = this$1$1.registry.has(field) && this$1$1.registry.get(field);
          var value = values ? values[field] : undefined;
          if (input && !equals(input.proxy, value, true)) {
            input.context.model = value;
          }
          if (!equals(value, this$1$1.proxy[field], true)) {
            this$1$1.setFieldValue(field, value);
          }
        });
      },
      updateValidation: function updateValidation (errorObject) {
        if (has(this.registry.errors, errorObject.name)) {
          this.registry.errors[errorObject.name] = errorObject.hasErrors;
        }
        this.$emit('validation', errorObject);
      },
      addErrorObserver: function addErrorObserver (observer) {
        if (!this.errorObservers.find(function (obs) { return observer.callback === obs.callback; })) {
          this.errorObservers.push(observer);
          if (observer.type === 'form') {
            observer.callback(this.mergedFormErrors);
          } else if (observer.type === 'group' && has(this.mergedGroupErrors, observer.field)) {
            observer.callback(this.mergedGroupErrors[observer.field]);
          } else if (has(this.mergedFieldErrors, observer.field)) {
            observer.callback(this.mergedFieldErrors[observer.field]);
          }
        }
      },
      removeErrorObserver: function removeErrorObserver (observer) {
        this.errorObservers = this.errorObservers.filter(function (obs) { return obs.callback !== observer; });
      }
    };
    return Object.keys(methods).reduce(function (withMethods, key) {
      var obj;

      return without.includes(key) ? withMethods : Object.assign({}, withMethods, ( obj = {}, obj[key] = methods[key], obj ))
    }, {})
  }

  /**
   * Unified registry watchers.
   */
  function useRegistryWatchers () {
    return {
      mergedFieldErrors: {
        handler: function handler (errors) {
          this.errorObservers
            .filter(function (o) { return o.type === 'input'; })
            .forEach(function (o) { return o.callback(errors[o.field] || []); });
        },
        immediate: true
      },
      mergedGroupErrors: {
        handler: function handler (errors) {
          this.errorObservers
            .filter(function (o) { return o.type === 'group'; })
            .forEach(function (o) { return o.callback(errors[o.field] || {}); });
        },
        immediate: true
      }
    }
  }

  /**
   * Providers related to the registry.
   */
  function useRegistryProviders (ctx, without) {
    if ( without === void 0 ) without = [];

    var providers = {
      formulateSetter: ctx.setFieldValue,
      formulateRegister: ctx.register,
      formulateDeregister: ctx.deregister,
      formulateFieldValidation: ctx.updateValidation,
      // Provided on forms only to let getFormValues to fall back to form
      getFormValues: ctx.valueDeps,
      // Provided on groups only to expose group-level items
      getGroupValues: ctx.valueDeps,
      validateDependents: ctx.validateDeps,
      observeErrors: ctx.addErrorObserver,
      removeErrorObserver: ctx.removeErrorObserver
    };
    var p = Object.keys(providers)
      .filter(function (provider) { return !without.includes(provider); })
      .reduce(function (useProviders, provider) {
        var obj;

        return Object.assign(useProviders, ( obj = {}, obj[provider] = providers[provider], obj ));
    }, {});
    return p
  }

  /**
   * A simple (somewhat non-comprehensive) cloneDeep function, valid for our use
   * case of needing to unbind reactive watchers.
   */
  function cloneDeep (obj) {
      if (typeof obj !== 'object') {
        return obj
      }
      var isArr = Array.isArray(obj);
      var newObj = isArr ? [] : {};
      for (var key in obj) {
        if (obj[key] instanceof FileUpload || isValueType(obj[key])) {
          newObj[key] = obj[key];
        } else {
          newObj[key] = cloneDeep(obj[key]);
        }
      }
      return newObj
    }

  var FormSubmission = function FormSubmission (form) {
    this.form = form;
  };

  /**
   * Determine if the form has any validation errors.
   *
   * @return {Promise} resolves a boolean
   */
  FormSubmission.prototype.hasValidationErrors = function hasValidationErrors () {
    return this.form.hasValidationErrors()
  };

  /**
   * Asynchronously generate the values payload of this form.
   * @return {Promise} resolves to json
   */
  FormSubmission.prototype.values = function values () {
      var this$1$1 = this;

    return new Promise(function (resolve, reject) {
      var pending = [];
      var values = cloneDeep(this$1$1.form.proxy);
      var loop = function ( key ) {
        if (typeof this$1$1.form.proxy[key] === 'object' && this$1$1.form.proxy[key] instanceof FileUpload) {
          pending.push(
            this$1$1.form.proxy[key].upload().then(function (data) {
                var obj;

                return Object.assign(values, ( obj = {}, obj[key] = data, obj ));
            })
          );
        }
      };

        for (var key in values) loop( key );
      Promise.all(pending)
        .then(function () { return resolve(values); })
        .catch(function (err) { return reject(err); });
    })
  };

  function objectWithoutProperties$2 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  var script$l = {
    name: 'FormulateForm',
    inheritAttrs: false,
    provide: function provide () {
      return Object.assign({}, useRegistryProviders(this, ['getGroupValues']),
        {observeContext: this.addContextObserver,
        removeContextObserver: this.removeContextObserver})
    },
    model: {
      prop: 'formulateValue',
      event: 'input'
    },
    props: {
      name: {
        type: [String, Boolean],
        default: false
      },
      formulateValue: {
        type: Object,
        default: function () { return ({}); }
      },
      values: {
        type: [Object, Boolean],
        default: false
      },
      errors: {
        type: [Object, Boolean],
        default: false
      },
      formErrors: {
        type: Array,
        default: function () { return ([]); }
      },
      schema: {
        type: [Array, Boolean],
        default: false
      },
      keepModelData: {
        type: [Boolean, String],
        default: false
      },
      invalidMessage: {
        type: [Boolean, Function, String],
        default: false
      },
      debounce: {
        type: [Boolean, Number],
        default: false
      }
    },
    data: function data () {
      return Object.assign({}, useRegistry(this),
        {formShouldShowErrors: false,
        contextObservers: [],
        namedErrors: [],
        namedFieldErrors: {},
        isLoading: false,
        hasFailedSubmit: false})
    },
    computed: Object.assign({}, useRegistryComputed(),
      {schemaListeners: function schemaListeners () {
        var ref = this.$listeners;
        ref.submit;
        var rest = objectWithoutProperties$2( ref, ["submit"] );
        var listeners = rest;
        return listeners
      },
      pseudoProps: function pseudoProps () {
        return extractAttributes(this.$attrs, classProps.filter(function (p) { return /^form/.test(p); }))
      },
      attributes: function attributes () {
        var this$1$1 = this;

        var attrs = Object.keys(this.$attrs)
          .filter(function (attr) { return !has(this$1$1.pseudoProps, camel(attr)); })
          .reduce(function (fields, field) {
            var obj;

            return (Object.assign({}, fields, ( obj = {}, obj[field] = this$1$1.$attrs[field], obj )));
        }, {}); // Create an object of attributes to re-bind
        if (typeof this.name === 'string') {
          Object.assign(attrs, { name: this.name });
        }
        return attrs
      },
      hasErrors: function hasErrors () {
        return Object.values(this.registry.errors).some(function (hasErrors) { return hasErrors; })
      },
      isValid: function isValid () {
        return !this.hasErrors
      },
      formContext: function formContext () {
        return {
          errors: this.mergedFormErrors,
          pseudoProps: this.pseudoProps,
          hasErrors: this.hasErrors,
          value: this.proxy,
          hasValue: !isEmpty(this.proxy), // These have to be explicit for really silly nextTick reasons
          isValid: this.isValid,
          isLoading: this.isLoading,
          classes: this.classes
        }
      },
      classes: function classes () {
        return this.$formulate.classes(Object.assign({}, this.$props,
          this.pseudoProps,
          {value: this.proxy,
          errors: this.mergedFormErrors,
          hasErrors: this.hasErrors,
          hasValue: !isEmpty(this.proxy),
          isValid: this.isValid,
          isLoading: this.isLoading,
          type: 'form',
          classification: 'form',
          attrs: this.$attrs}))
      },
      invalidErrors: function invalidErrors () {
        if (this.hasFailedSubmit && this.hasErrors) {
          switch (typeof this.invalidMessage) {
            case 'string':
              return [this.invalidMessage]
            case 'object':
              return Array.isArray(this.invalidMessage) ? this.invalidMessage : []
            case 'function':
              var ret = this.invalidMessage(this.failingFields);
              return Array.isArray(ret) ? ret : [ret]
          }
        }
        return []
      },
      mergedFormErrors: function mergedFormErrors () {
        return this.formErrors.concat(this.namedErrors).concat(this.invalidErrors)
      },
      mergedFieldErrors: function mergedFieldErrors () {
        var errors = {};
        if (this.errors) {
          for (var fieldName in this.errors) {
            errors[fieldName] = arrayify(this.errors[fieldName]);
          }
        }
        for (var fieldName$1 in this.namedFieldErrors) {
          errors[fieldName$1] = arrayify(this.namedFieldErrors[fieldName$1]);
        }
        return errors
      },
      hasFormErrorObservers: function hasFormErrorObservers () {
        return !!this.errorObservers.filter(function (o) { return o.type === 'form'; }).length
      },
      failingFields: function failingFields () {
        var this$1$1 = this;

        return Object.keys(this.registry.errors)
          .reduce(function (fields, field) {
            var obj;

            return (Object.assign({}, fields,
            (this$1$1.registry.errors[field] ? ( obj = {}, obj[field] = this$1$1.registry.get(field), obj ) : {})));
        }, {})
      }}),
    watch: Object.assign({}, useRegistryWatchers(),
      {formulateValue: {
        handler: function handler (values) {
          if (this.isVmodeled &&
            values &&
            typeof values === 'object'
          ) {
            this.setValues(values);
          }
        },
        deep: true
      },
      mergedFormErrors: function mergedFormErrors (errors) {
        this.errorObservers
          .filter(function (o) { return o.type === 'form'; })
          .forEach(function (o) { return o.callback(errors); });
      }}),
    created: function created () {
      this.$formulate.register(this);
      this.applyInitialValues();
      this.$emit('created', this);
    },
    destroyed: function destroyed () {
      this.$formulate.deregister(this);
    },
    methods: Object.assign({}, useRegistryMethods(),
      {applyErrors: function applyErrors (ref) {
        var formErrors = ref.formErrors;
        var inputErrors = ref.inputErrors;

        // given an object of errors, apply them to this form
        this.namedErrors = formErrors;
        this.namedFieldErrors = inputErrors;
      },
      addContextObserver: function addContextObserver (callback) {
        if (!this.contextObservers.find(function (observer) { return observer === callback; })) {
          this.contextObservers.push(callback);
          callback(this.formContext);
        }
      },
      removeContextObserver: function removeContextObserver (callback) {
        this.contextObservers.filter(function (observer) { return observer !== callback; });
      },
      registerErrorComponent: function registerErrorComponent (component) {
        if (!this.errorComponents.includes(component)) {
          this.errorComponents.push(component);
        }
      },
      formSubmitted: function formSubmitted () {
        var this$1$1 = this;

        if (this.isLoading) {
          return undefined
        }
        this.isLoading = true;

        // perform validation here
        this.showErrors();
        var submission = new FormSubmission(this);

        // Wait for the submission handler
        var submitRawHandler = this.$listeners['submit-raw'] || this.$listeners.submitRaw;
        var rawHandlerReturn = typeof submitRawHandler === 'function'
          ? submitRawHandler(submission)
          : Promise.resolve(submission);
        var willResolveRaw = rawHandlerReturn instanceof Promise
          ? rawHandlerReturn
          : Promise.resolve(rawHandlerReturn);
        return willResolveRaw
          .then(function (res) {
            var sub = (res instanceof FormSubmission ? res : submission);
            return sub.hasValidationErrors().then(function (hasErrors) { return [sub, hasErrors]; })
          })
          .then(function (ref) {
            var sub = ref[0];
            var hasErrors = ref[1];

            if (!hasErrors && typeof this$1$1.$listeners.submit === 'function') {
              return sub.values()
                .then(function (values) {
                  // If the listener returns a promise, we want to wait for that
                  // that promise to resolve, but when we do resolve, we only
                  // want to resolve the submission values
                  this$1$1.hasFailedSubmit = false;
                  var handlerReturn = this$1$1.$listeners.submit(values);
                  return (handlerReturn instanceof Promise ? handlerReturn : Promise.resolve())
                    .then(function () { return values; })
                })
            }
            return this$1$1.onFailedValidation()
          })
          .finally(function () {
            this$1$1.isLoading = false;
          })
      },
      onFailedValidation: function onFailedValidation () {
        this.hasFailedSubmit = true;
        this.$emit('failed-validation', Object.assign({}, this.failingFields));
        return this.$formulate.failedValidation(this)
      }})
  };

  function render$l(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSchema = vue.resolveComponent("FormulateSchema");
    var _component_FormulateErrors = vue.resolveComponent("FormulateErrors");

    return (vue.openBlock(), vue.createElementBlock("form", vue.mergeProps({
      class: $options.classes.form
    }, $options.attributes, {
      onSubmit: _cache[0] || (_cache[0] = vue.withModifiers(function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return ($options.formSubmitted && $options.formSubmitted.apply($options, args));
    }, ["prevent"]))
    }), [
      ($props.schema)
        ? (vue.openBlock(), vue.createBlock(_component_FormulateSchema, vue.mergeProps({
            key: 0,
            schema: $props.schema
          }, vue.toHandlers($options.schemaListeners)), null, 16 /* FULL_PROPS */, ["schema"]))
        : vue.createCommentVNode("v-if", true),
      (!$options.hasFormErrorObservers)
        ? (vue.openBlock(), vue.createBlock(_component_FormulateErrors, {
            key: 1,
            context: $options.formContext
          }, null, 8 /* PROPS */, ["context"]))
        : vue.createCommentVNode("v-if", true),
      vue.renderSlot(_ctx.$slots, "default", vue.normalizeProps(vue.guardReactiveProps($options.formContext)))
    ], 16 /* FULL_PROPS */))
  }

  script$l.render = render$l;
  script$l.__file = "src/FormulateForm.vue";

  function objectWithoutProperties$1 (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  /**
   * For a single instance of an input, export all of the context needed to fully
   * render that element.
   * @return {object}
   */
  var context = {
    context: function context () {
      return defineModel.call(this, Object.assign({}, {addLabel: this.logicalAddLabel,
        removeLabel: this.logicalRemoveLabel,
        attributes: this.elementAttributes,
        blurHandler: blurHandler.bind(this),
        classification: this.classification,
        component: this.component,
        debounceDelay: this.debounceDelay,
        disableErrors: this.disableErrors,
        errors: this.explicitErrors,
        formShouldShowErrors: this.formShouldShowErrors,
        getValidationErrors: this.getValidationErrors.bind(this),
        groupErrors: this.mergedGroupErrors,
        hasGivenName: this.hasGivenName,
        hasValue: this.hasValue,
        hasLabel: (this.label && this.classification !== 'button'),
        hasValidationErrors: this.hasValidationErrors.bind(this),
        help: this.help,
        helpPosition: this.logicalHelpPosition,
        id: this.id || this.defaultId,
        ignored: has(this.$options.propsData, 'ignored'),
        isValid: this.isValid,
        imageBehavior: this.imageBehavior,
        label: this.label,
        labelPosition: this.logicalLabelPosition,
        limit: this.limit === Infinity ? this.limit : parseInt(this.limit, 10),
        name: this.nameOrFallback,
        minimum: parseInt(this.minimum, 10),
        performValidation: this.performValidation.bind(this),
        pseudoProps: this.pseudoProps,
        preventWindowDrops: this.preventWindowDrops,
        removePosition: this.mergedRemovePosition,
        repeatable: this.repeatable,
        rootEmit: this.$emit.bind(this),
        rules: this.ruleDetails,
        setErrors: this.setErrors.bind(this),
        showValidationErrors: this.showValidationErrors,
        slotComponents: this.slotComponents,
        slotProps: this.slotProps,
        type: this.type,
        uploadBehavior: this.uploadBehavior,
        uploadUrl: this.mergedUploadUrl,
        uploader: this.uploader || this.$formulate.getUploader(),
        validationErrors: this.validationErrors,
        value: this.value,
        visibleValidationErrors: this.visibleValidationErrors,
        isSubField: this.isSubField,
        classes: this.classes},
        this.typeContext))
    },
    // Used in context
    nameOrFallback: nameOrFallback,
    hasGivenName: hasGivenName,
    typeContext: typeContext,
    elementAttributes: elementAttributes,
    logicalLabelPosition: logicalLabelPosition,
    logicalHelpPosition: logicalHelpPosition,
    mergedRemovePosition: mergedRemovePosition,
    mergedUploadUrl: mergedUploadUrl,
    mergedGroupErrors: mergedGroupErrors,
    hasValue: hasValue,
    visibleValidationErrors: visibleValidationErrors,
    slotComponents: slotComponents,
    logicalAddLabel: logicalAddLabel,
    logicalRemoveLabel: logicalRemoveLabel,
    classes: classes,
    showValidationErrors: showValidationErrors,
    slotProps: slotProps,
    pseudoProps: pseudoProps,
    isValid: isValid,
    ruleDetails: ruleDetails,

    // Not used in context
    isVmodeled: isVmodeled,
    mergedValidationName: mergedValidationName,
    explicitErrors: explicitErrors,
    allErrors: allErrors,
    hasVisibleErrors: hasVisibleErrors,
    hasErrors: hasErrors,
    filteredAttributes: filteredAttributes,
    typeProps: typeProps,
    listeners: listeners
  };

  /**
   * The label to display when adding a new group.
   */
  function logicalAddLabel () {
    if (this.classification === 'file') {
      return this.addLabel === true ? ("+ Add " + (cap(this.type))) : this.addLabel
    }
    if (typeof this.addLabel === 'boolean') {
      var label = this.label || this.name;
      return ("+ " + (typeof label === 'string' ? label + ' ' : '') + " Add")
    }
    return this.addLabel
  }
  /**
   * The label to display when removing a group.
   */
  function logicalRemoveLabel () {
    if (typeof this.removeLabel === 'boolean') {
      return 'Remove'
    }
    return this.removeLabel
  }

  /**
   * Given (this.type), return an object to merge with the context
   * @return {object}
   * @return {object}
   */
  function typeContext () {
    var this$1$1 = this;

    switch (this.classification) {
      case 'select':
        return {
          options: createOptionList.call(this, this.options),
          optionGroups: this.optionGroups ? map(this.optionGroups, function (k, v) { return createOptionList.call(this$1$1, v); }) : false,
          placeholder: this.$attrs.placeholder || false
        }
      case 'slider':
        return { showValue: !!this.showValue }
      default:
        if (this.options) {
          return {
            options: createOptionList.call(this, this.options)
          }
        }
        return {}
    }
  }

  /**
   * Items in $attrs that are better described as props.
   */
  function pseudoProps () {
    // Remove any "class key props" from the attributes.
    return extractAttributes(this.localAttributes, classProps)
  }

  /**
   * Remove props that are defined as slot props.
   */
  function typeProps () {
    return extractAttributes(this.localAttributes, this.$formulate.typeProps(this.type))
  }

  /**
   * Attributes with pseudoProps filtered out.
   */
  function filteredAttributes () {
    var this$1$1 = this;

    var filterKeys = Object.keys(this.pseudoProps)
      .concat(Object.keys(this.typeProps));
    return Object.keys(this.localAttributes).reduce(function (props, key) {
      if (!filterKeys.includes(camel(key))) {
        props[key] = this$1$1.localAttributes[key];
      }
      return props
    }, {})
  }

  /**
   * Reducer for attributes that will be applied to each core input element.
   * @return {object}
   */
  function elementAttributes () {
    var attrs = Object.assign({}, this.filteredAttributes);
    // pass the ID prop through to the root element
    if (this.id) {
      attrs.id = this.id;
    } else {
      attrs.id = this.defaultId;
    }
    // pass an explicitly given name prop through to the root element
    if (this.hasGivenName) {
      attrs.name = this.name;
    }

    // If there is help text, have this element be described by it.
    if (this.help && !has(attrs, 'aria-describedby')) {
      attrs['aria-describedby'] = (attrs.id) + "-help";
    }

    // Ensure we dont have a class attribute unless we are actually applying classes.
    if (this.classes.input && (!Array.isArray(this.classes.input) || this.classes.input.length)) {
      attrs.class = this.classes.input;
    }

    // @todo Filter out "local props" for custom inputs.

    return attrs
  }

  /**
   * Apply the result of the classes computed prop to any existing prop classes.
   */
  function classes () {
    return this.$formulate.classes(Object.assign({}, this.$props,
      this.pseudoProps,
      {attrs: this.filteredAttributes,
        classification: this.classification,
        hasErrors: this.hasVisibleErrors,
        hasValue: this.hasValue,
        helpPosition: this.logicalHelpPosition,
        isValid: this.isValid,
        labelPosition: this.logicalLabelPosition,
        type: this.type,
        value: this.proxy}))
  }

  /**
   * Determine the best-guess location for the label (before or after).
   * @return {string} before|after
   */
  function logicalLabelPosition () {
    if (this.labelPosition) {
      return this.labelPosition
    }
    switch (this.classification) {
      case 'box':
        return 'after'
      default:
        return 'before'
    }
  }

  /**
   * Determine the best location for the label based on type (before or after).
   */
  function logicalHelpPosition () {
    if (this.helpPosition) {
      return this.helpPosition
    }
    switch (this.classification) {
      case 'group':
        return 'before'
      default:
        return 'after'
    }
  }

  /**
   * Set remove button position for repeatable inputs
   */
  function mergedRemovePosition () {
    return (this.type === 'group') ? this.removePosition || 'before' : false
  }

  /**
   * The validation label to use.
   */
  function mergedValidationName () {
    var this$1$1 = this;

    var strategy = this.$formulate.options.validationNameStrategy || ['validationName', 'name', 'label', 'type'];
    if (Array.isArray(strategy)) {
      var key = strategy.find(function (key) { return typeof this$1$1[key] === 'string'; });
      return this[key]
    }
    if (typeof strategy === 'function') {
      return strategy.call(this, this)
    }
    return this.type
  }

  /**
   * Use the uploadURL on the input if it exists, otherwise use the uploadURL
   * that is defined as a plugin option.
   */
  function mergedUploadUrl () {
    return this.uploadUrl || this.$formulate.getUploadUrl()
  }

  /**
   * Merge localGroupErrors and groupErrors props.
   */
  function mergedGroupErrors () {
    var this$1$1 = this;

    var keys = Object.keys(this.groupErrors).concat(Object.keys(this.localGroupErrors));
    var isGroup = /^(\d+)\.(.*)$/;
    // Using new Set() to remove duplicates.
    return Array.from(new Set(keys))
      .filter(function (k) { return isGroup.test(k); })
      .reduce(function (groupErrors, fieldKey) {
        var obj;

        var ref = fieldKey.match(isGroup);
        var index = ref[1];
        var subField = ref[2];
        if (!has(groupErrors, index)) {
          groupErrors[index] = {};
        }
        var fieldErrors = Array.from(new Set(
          arrayify(this$1$1.groupErrors[fieldKey]).concat(arrayify(this$1$1.localGroupErrors[fieldKey]))
        ));
        groupErrors[index] = Object.assign(groupErrors[index], ( obj = {}, obj[subField] = fieldErrors, obj ));
        return groupErrors
      }, {})
  }

  /**
   * Takes the parsed validation rules and makes them a bit more readable.
   */
  function ruleDetails () {
    return this.parsedValidation
      .map(function (ref) {
        var args = ref[1];
        var ruleName = ref[2];

        return ({ ruleName: ruleName, args: args });
    })
  }

  /**
   * Determines if the field should show it's error (if it has one)
   * @return {boolean}
   */
  function showValidationErrors () {
    if (this.showErrors || this.formShouldShowErrors) {
      return true
    }
    if (this.classification === 'file' && this.uploadBehavior === 'live' && modelGetter.call(this)) {
      return true
    }
    return this.behavioralErrorVisibility
  }

  /**
   * All of the currently visible validation errors (does not include error handling)
   * @return {array}
   */
  function visibleValidationErrors () {
    return (this.showValidationErrors && this.validationErrors.length) ? this.validationErrors : []
  }

  /**
   * Return the element’s name, or select a fallback.
   */
  function nameOrFallback () {
    if (this.name === true && this.classification !== 'button') {
      var id = this.id || this.elementAttributes.id.replace(/[^0-9]/g, '');
      return ((this.type) + "_" + id)
    }
    if (this.name === false || (this.classification === 'button' && this.name === true)) {
      return false
    }
    return this.name
  }

  /**
   * determine if an input has a user-defined name
   */
  function hasGivenName () {
    return typeof this.name !== 'boolean'
  }

  /**
   * Determines if the current input has a value or not. To do this we need to
   * check for various falsey values. But we cannot assume that all falsey values
   * mean an empty or unselected field (for example 0) and we cant assume that
   * all truthy values are empty like [] or {}.
   */
  function hasValue () {
    var this$1$1 = this;

    var value = this.proxy;
    if (
      (this.classification === 'box' && this.isGrouped) ||
      (this.classification === 'select' && has(this.filteredAttributes, 'multiple'))
    ) {
      return Array.isArray(value) ? value.some(function (v) { return v === this$1$1.value; }) : this.value === value
    }
    return !isEmpty(value)
  }

  /**
   * Determines if this formulate element is v-modeled or not.
   */
  function isVmodeled () {
    return !!(this.$options.propsData.hasOwnProperty('formulateValue') &&
      this._events &&
      Array.isArray(this._events.input) &&
      this._events.input.length)
  }

  /**
   * Given an object or array of options, create an array of objects with label,
   * value, and id.
   * @param {array|object}
   * @return {array}
   */
  function createOptionList (optionData) {
    if (!optionData) {
      return []
    }
    var options = Array.isArray(optionData) ? optionData : Object.keys(optionData).map(function (value) { return ({ label: optionData[value], value: value }); });
    return options.map(createOption.bind(this))
  }

  /**
   * Given a wide ranging input (string, object, etc) return an option item
   * @param {typeof} option
   */
  function createOption (option) {
    // Numbers are not allowed
    if (typeof option === 'number') {
      option = String(option);
    }
    if (typeof option === 'string') {
      return { label: option, value: option, id: ((this.elementAttributes.id) + "_" + option) }
    }
    if (typeof option.value === 'number') {
      option.value = String(option.value);
    }
    return Object.assign({
      value: '',
      label: '',
      id: ((this.elementAttributes.id) + "_" + (option.value || option.label))
    }, option)
  }

  /**
   * These are errors we that have been explicity passed to us.
   */
  function explicitErrors () {
    return arrayify(this.errors)
      .concat(this.localErrors)
      .concat(arrayify(this.error))
  }

  /**
   * The merged errors computed property.
   */
  function allErrors () {
    return this.explicitErrors
      .concat(arrayify(this.validationErrors))
  }

  /**
   * Does this computed property have errors
   */
  function hasErrors () {
    return !!this.allErrors.length
  }

  /**
   * True when the field has no errors at all.
   */
  function isValid () {
    return !this.hasErrors
  }

  /**
   * Returns if form has actively visible errors (of any kind)
   */
  function hasVisibleErrors () {
    return (
      (Array.isArray(this.validationErrors) && this.validationErrors.length && this.showValidationErrors) ||
      !!this.explicitErrors.length
    )
  }

  /**
   * The component that should be rendered in the label slot as default.
   */
  function slotComponents () {
    var fn = this.$formulate.slotComponent.bind(this.$formulate);
    return {
      addMore: fn(this.type, 'addMore'),
      buttonContent: fn(this.type, 'buttonContent'),
      errors: fn(this.type, 'errors'),
      file: fn(this.type, 'file'),
      help: fn(this.type, 'help'),
      label: fn(this.type, 'label'),
      prefix: fn(this.type, 'prefix'),
      remove: fn(this.type, 'remove'),
      repeatable: fn(this.type, 'repeatable'),
      suffix: fn(this.type, 'suffix'),
      uploadAreaMask: fn(this.type, 'uploadAreaMask')
    }
  }

  /**
   * Any extra props to pass to slot components.
   */
  function slotProps () {
    var fn = this.$formulate.slotProps.bind(this.$formulate);
    return {
      label: fn(this.type, 'label', this.typeProps),
      help: fn(this.type, 'help', this.typeProps),
      errors: fn(this.type, 'errors', this.typeProps),
      repeatable: fn(this.type, 'repeatable', this.typeProps),
      addMore: fn(this.type, 'addMore', this.typeProps),
      remove: fn(this.type, 'remove', this.typeProps),
      component: fn(this.type, 'component', this.typeProps)
    }
  }

  /**
   * Bound into the context object.
   */
  function blurHandler () {
    var this$1$1 = this;

    if (this.errorBehavior === 'blur' || this.errorBehavior === 'value') {
      this.behavioralErrorVisibility = true;
    }
    this.$nextTick(function () { return this$1$1.$emit('blur-context', this$1$1.context); });
  }

  /**
   * Bound listeners.
   */
  function listeners () {
    var ref = this.$listeners;
    ref.input;
    var rest = objectWithoutProperties$1( ref, ["input"] );
    var listeners = rest;
    return listeners
  }

  /**
   * Defines the model used throughout the existing context.
   * @param {object} context
   */
  function defineModel (context) {
    var this$1$1 = this;

    return Object.defineProperty(context, 'model', {
      get: modelGetter.bind(this),
      set: function (value) {
        if (!this$1$1.mntd || !this$1$1.debounceDelay) {
          return modelSetter.call(this$1$1, value)
        }
        this$1$1.dSet(modelSetter, [value], this$1$1.debounceDelay);
      },
      enumerable: true
    })
  }

  /**
   * Get the value from a model.
   **/
  function modelGetter () {
    var model = this.isVmodeled ? 'formulateValue' : 'proxy';
    if (this.type === 'checkbox' && !Array.isArray(this[model]) && this.options) {
      return []
    }
    if (!this[model] && this[model] !== 0) {
      return ''
    }
    return this[model]
  }

  /**
   * Set the value from a model.
   **/
  function modelSetter (value) {
    var didUpdate = false;
    if (!equals(value, this.proxy, this.type === 'group')) {
      this.proxy = value;
      didUpdate = true;
    }
    if (!this.context.ignored && this.context.name && typeof this.formulateSetter === 'function') {
      this.formulateSetter(this.context.name, value);
    }
    if (didUpdate) {
      this.$emit('input', value);
    }
  }

  var script$k = {
    name: 'FormulateInput',
    inheritAttrs: false,
    provide: function provide () {
      return {
        // Allows sub-components of this input to register arbitrary rules.
        formulateRegisterRule: this.registerRule,
        formulateRemoveRule: this.removeRule
      }
    },
    inject: {
      formulateSetter: { default: undefined },
      formulateFieldValidation: { default: function () { return function () { return ({}); }; } },
      formulateRegister: { default: undefined },
      formulateDeregister: { default: undefined },
      getFormValues: { default: function () { return function () { return ({}); }; } },
      getGroupValues: { default: undefined },
      validateDependents: { default: function () { return function () {}; } },
      observeErrors: { default: undefined },
      removeErrorObserver: { default: undefined },
      isSubField: { default: function () { return function () { return false; }; } }
    },
    model: {
      prop: 'formulateValue',
      event: 'input'
    },
    props: {
      type: {
        type: String,
        default: 'text'
      },
      name: {
        type: [String, Boolean],
        default: true
      },
      /* eslint-disable */
      formulateValue: {
        default: ''
      },
      value: {
        default: false
      },
      /* eslint-enable */
      options: {
        type: [Object, Array, Boolean],
        default: false
      },
      optionGroups: {
        type: [Object, Boolean],
        default: false
      },
      id: {
        type: [String, Boolean, Number],
        default: false
      },
      label: {
        type: [String, Boolean],
        default: false
      },
      labelPosition: {
        type: [String, Boolean],
        default: false
      },
      limit: {
        type: [String, Number],
        default: Infinity,
        validator: function (value) { return Infinity || parseInt(value, 10) == value; } // eslint-disable-line eqeqeq
      },
      minimum: {
        type: [String, Number],
        default: 0,
        validator: function (value) { return parseInt(value, 10) == value; } // eslint-disable-line eqeqeq
      },
      help: {
        type: [String, Boolean],
        default: false
      },
      helpPosition: {
        type: [String, Boolean],
        default: false
      },
      isGrouped: {
        type: Boolean,
        default: false
      },
      errors: {
        type: [String, Array, Boolean],
        default: false
      },
      removePosition: {
        type: [String, Boolean],
        default: false
      },
      repeatable: {
        type: Boolean,
        default: false
      },
      validation: {
        type: [String, Boolean, Array],
        default: false
      },
      validationName: {
        type: [String, Boolean],
        default: false
      },
      error: {
        type: [String, Boolean],
        default: false
      },
      errorBehavior: {
        type: String,
        default: 'blur',
        validator: function (value) {
          return ['blur', 'live', 'submit', 'value'].includes(value)
        }
      },
      showErrors: {
        type: Boolean,
        default: false
      },
      groupErrors: {
        type: Object,
        default: function () { return ({}); },
        validator: function (value) {
          var isK = /^\d+\./;
          return !Object.keys(value).some(function (k) { return !isK.test(k); })
        }
      },
      imageBehavior: {
        type: String,
        default: 'preview'
      },
      uploadUrl: {
        type: [String, Boolean],
        default: false
      },
      uploader: {
        type: [Function, Object, Boolean],
        default: false
      },
      uploadBehavior: {
        type: String,
        default: 'live'
      },
      preventWindowDrops: {
        type: Boolean,
        default: true
      },
      showValue: {
        type: [String, Boolean],
        default: false
      },
      validationMessages: {
        type: Object,
        default: function () { return ({}); }
      },
      validationRules: {
        type: Object,
        default: function () { return ({}); }
      },
      checked: {
        type: [String, Boolean],
        default: false
      },
      disableErrors: {
        type: Boolean,
        default: false
      },
      addLabel: {
        type: [Boolean, String],
        default: true
      },
      removeLabel: {
        type: [Boolean, String],
        default: false
      },
      keepModelData: {
        type: [Boolean, String],
        default: 'inherit'
      },
      ignored: {
        type: [Boolean, String],
        default: false
      },
      debounce: {
        type: [Boolean, Number],
        default: false
      },
      preventDeregister: {
        type: Boolean,
        default: false
      }
    },
    data: function data () {
      return {
        defaultId: this.$formulate.nextId(this),
        localAttributes: {},
        localErrors: [],
        localGroupErrors: {},
        proxy: this.getInitialValue(),
        behavioralErrorVisibility: (this.errorBehavior === 'live'),
        formShouldShowErrors: false,
        validationErrors: [],
        pendingValidation: Promise.resolve(),
        // These registries are used for injected messages registrants only (mostly internal).
        ruleRegistry: [],
        messageRegistry: {},
        touched: false,
        debounceDelay: this.debounce,
        dSet: createDebouncer(),
        mntd: false
      }
    },
    computed: Object.assign({}, context,
      {classification: function classification () {
        var classification = this.$formulate.classify(this.type);
        return (classification === 'box' && this.options) ? 'group' : classification
      },
      component: function component () {
        return (this.classification === 'group') ? 'FormulateInputGroup' : this.$formulate.component(this.type)
      },
      parsedValidationRules: function parsedValidationRules () {
        var this$1$1 = this;

        var parsedValidationRules = {};
        Object.keys(this.validationRules).forEach(function (key) {
          parsedValidationRules[camel(key)] = this$1$1.validationRules[key];
        });
        return parsedValidationRules
      },
      parsedValidation: function parsedValidation () {
        return parseRules(this.validation, this.$formulate.rules(this.parsedValidationRules))
      },
      messages: function messages () {
        var this$1$1 = this;

        var messages = {};
        Object.keys(this.validationMessages).forEach(function (key) {
          messages[camel(key)] = this$1$1.validationMessages[key];
        });
        Object.keys(this.messageRegistry).forEach(function (key) {
          messages[camel(key)] = this$1$1.messageRegistry[key];
        });
        return messages
      }}),
    watch: {
      '$attrs': {
        handler: function handler (value) {
          this.updateLocalAttributes(value);
        },
        deep: true
      },
      proxy: {
        handler: function (newValue, oldValue) {
          this.performValidation();
          if (!this.isVmodeled && !equals(newValue, oldValue, this.type === 'group')) {
            this.context.model = newValue;
          }
          this.validateDependents(this);
          if (!this.touched && newValue) {
            this.touched = true;
          }
        },
        deep: true
      },
      formulateValue: {
        handler: function (newValue, oldValue) {
          if (this.isVmodeled && !equals(newValue, oldValue, this.type === 'group')) {
            this.context.model = newValue;
          }
        },
        deep: true
      },
      showValidationErrors: {
        handler: function handler (val) {
          this.$emit('error-visibility', val);
        },
        immediate: true
      },
      validation: {
        handler: function handler () {
          this.performValidation();
        },
        deep: true
      },
      touched: function touched (value) {
        if (this.errorBehavior === 'value' && value) {
          this.behavioralErrorVisibility = value;
        }
      },
      debounce: function debounce (value) {
        this.debounceDelay = value;
      }
    },
    created: function created () {
      this.applyInitialValue();
      if (this.formulateRegister && typeof this.formulateRegister === 'function') {
        this.formulateRegister(this.nameOrFallback, this);
      }
      this.applyDefaultValue();
      if (!this.disableErrors && typeof this.observeErrors === 'function') {
        this.observeErrors({ callback: this.setErrors, type: 'input', field: this.nameOrFallback });
        if (this.type === 'group') {
          this.observeErrors({ callback: this.setGroupErrors, type: 'group', field: this.nameOrFallback });
        }
      }
      this.updateLocalAttributes(this.$attrs);
      this.performValidation();
      if (this.hasValue) {
        this.touched = true;
      }
    },
    mounted: function mounted () {
      this.mntd = true;
    },
    beforeDestroy: function beforeDestroy () {
      if (!this.disableErrors && typeof this.removeErrorObserver === 'function') {
        this.removeErrorObserver(this.setErrors);
        if (this.type === 'group') {
          this.removeErrorObserver(this.setGroupErrors);
        }
      }
      if (typeof this.formulateDeregister === 'function' && !this.preventDeregister) {
        this.formulateDeregister(this.nameOrFallback);
      }
    },
    methods: {
      getInitialValue: function getInitialValue () {
        // Manually request classification, pre-computed props
        var classification = this.$formulate.classify(this.type);
        classification = (classification === 'box' && this.options) ? 'group' : classification;
        if (classification === 'box' && this.checked) {
          return this.value || true
        } else if (has(this.$options.propsData, 'value') && classification !== 'box') {
          return this.value
        } else if (has(this.$options.propsData, 'formulateValue')) {
          return this.formulateValue
        } else if (classification === 'group') {
          // Set the value of an empty group
          return Object.defineProperty(this.type === 'group' ? [{}] : [], '__init', { value: true })
        }
        return ''
      },
      applyInitialValue: function applyInitialValue () {
        // This should only be run immediately on created and ensures that the
        // proxy and the model are both the same before any additional registration.
        if (
          !equals(this.context.model, this.proxy) &&
          // we dont' want to set the model if we are a sub-box of a multi-box field
          (this.classification !== 'box' || has(this.$options.propsData, 'options'))
        ) {
          this.context.model = this.proxy;
          this.$emit('input', this.proxy);
        }
      },
      applyDefaultValue: function applyDefaultValue () {
        // Some inputs have may have special logic determining what to do if they
        // are still strictly undefined after applyInitialValue and registration.
        if (
          this.type === 'select' &&
          !this.context.placeholder &&
          isEmpty(this.proxy) &&
          !this.isVmodeled &&
          this.value === false &&
          this.context.options.length
        ) {
          if (!has(this.$attrs, 'multiple')) {
            // In this condition we have a blank select input with no value, by
            // default HTML will select the first element, so we emulate that.
            // See https://github.com/wearebraid/vue-formulate/issues/165
            this.context.model = this.context.options[0].value;
          } else {
            // In this condition we have a multi select input, which should use
            // an array as it's v-model base state.
            this.context.model = [];
          }
        }
      },
      updateLocalAttributes: function updateLocalAttributes (value) {
        if (!equals(value, this.localAttributes)) {
          this.localAttributes = value;
        }
      },
      performValidation: function performValidation () {
        var this$1$1 = this;

        var rules = parseRules(this.validation, this.$formulate.rules(this.parsedValidationRules));
        // Add in ruleRegistry rules. These are added directly via injection from
        // children and not part of the standard validation rule set.
        rules = this.ruleRegistry.length ? this.ruleRegistry.concat(rules) : rules;
        this.pendingValidation = this.runRules(rules)
          .then(function (messages) { return this$1$1.didValidate(messages); });
        return this.pendingValidation
      },
      runRules: function runRules (rules) {
        var this$1$1 = this;

        var run = function (ref) {
          var rule = ref[0];
          var args = ref[1];
          var ruleName = ref[2];
          ref[3];

          var res = rule.apply(void 0, [ {
            value: this$1$1.context.model,
            getFormValues: function () {
              var ref;

              var args = [], len = arguments.length;
              while ( len-- ) args[ len ] = arguments[ len ];
              return (ref = this$1$1).getFormValues.apply(ref, [ this$1$1 ].concat( args ));
          },
            getGroupValues: function () {
              var ref;

              var args = [], len = arguments.length;
              while ( len-- ) args[ len ] = arguments[ len ];
              return (ref = this$1$1)[("get" + (this$1$1.getGroupValues ? 'Group' : 'Form') + "Values")].apply(ref, [ this$1$1 ].concat( args ));
          },
            name: this$1$1.context.name
          } ].concat( args ));
          res = (res instanceof Promise) ? res : Promise.resolve(res);
          return res.then(function (result) { return result ? false : this$1$1.getMessage(ruleName, args); })
        };

        return new Promise(function (resolve) {
          // We break our rules into resolvable groups. These groups are
          // adjacent rules that can be resolved simultaneously. For example
          // consider: required|min:6,length here both rules resolve in parallel.
          // but ^required|min:6,length cannot be resolved in parallel because
          // the execution of the min rule requires passing resolution of the
          // required rule due to bailing. `resolveGroups` runs/resolves each of
          // these resolution groups, while `groupBails` is responsible for
          // producing them.
          var resolveGroups = function (groups, allMessages) {
            if ( allMessages === void 0 ) allMessages = [];

            var ruleGroup = groups.shift();
            if (Array.isArray(ruleGroup) && ruleGroup.length) {
              Promise.all(ruleGroup.map(run))
                // Filter out any simple falsy values to prevent triggering errors
                .then(function (messages) { return messages.filter(function (m) { return !!m; }); })
                .then(function (messages) {
                  messages = Array.isArray(messages) ? messages : [];
                  // The rule passed or its a non-bailing group, and there are additional groups to check, continue
                  if ((!messages.length || !ruleGroup.bail) && groups.length) {
                    return resolveGroups(groups, allMessages.concat(messages))
                  }
                  // Filter out any empty error messages, this is important for
                  // the `optional` rule. It uses a hard-coded empty array [] as
                  // the message to trigger bailing, but we obviously don’t want
                  // this message to make it out of this resolver.
                  return resolve(allMessages.concat(messages).filter(function (m) { return !isEmpty(m); }))
                });
            } else {
              resolve([]);
            }
          };
          // Produce our resolution groups, and then run them
          resolveGroups(groupBails(rules));
        })
      },
      didValidate: function didValidate (messages) {
        var validationChanged = !equals(messages, this.validationErrors);
        this.validationErrors = messages;
        if (validationChanged) {
          var errorObject = this.getErrorObject();
          this.$emit('validation', errorObject);
          if (this.formulateFieldValidation && typeof this.formulateFieldValidation === 'function') {
            this.formulateFieldValidation(errorObject);
          }
        }
      },
      getMessage: function getMessage (ruleName, args) {
        var this$1$1 = this;

        return this.getMessageFunc(ruleName)({
          args: args,
          name: this.mergedValidationName,
          value: this.context.model,
          vm: this,
          formValues: this.getFormValues(this),
          getFormValues: function () {
            var ref;

            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];
            return (ref = this$1$1).getFormValues.apply(ref, [ this$1$1 ].concat( args ));
        },
          getGroupValues: function () {
            var ref;

            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];
            return (ref = this$1$1)[("get" + (this$1$1.getGroupValues ? 'Group' : 'Form') + "Values")].apply(ref, [ this$1$1 ].concat( args ));
        }
        })
      },
      getMessageFunc: function getMessageFunc (ruleName) {
        var this$1$1 = this;

        ruleName = camel(ruleName);
        if (ruleName === 'optional') {
          // Optional rules need to trigger bailing by having a message, but pass
          // the simple double bang (!!) filer, any non-string value will have
          // this effect.
          return function () { return ([]); }
        }
        if (this.messages && typeof this.messages[ruleName] !== 'undefined') {
          switch (typeof this.messages[ruleName]) {
            case 'function':
              return this.messages[ruleName]
            case 'string':
            case 'boolean':
              return function () { return this$1$1.messages[ruleName]; }
          }
        }
        return function (context) { return this$1$1.$formulate.validationMessage(ruleName, context, this$1$1); }
      },
      hasValidationErrors: function hasValidationErrors () {
        var this$1$1 = this;

        return new Promise(function (resolve) {
          this$1$1.$nextTick(function () {
            this$1$1.pendingValidation.then(function () { return resolve(!!this$1$1.validationErrors.length); });
          });
        })
      },
      getValidationErrors: function getValidationErrors () {
        var this$1$1 = this;

        return new Promise(function (resolve) {
          this$1$1.$nextTick(function () { return this$1$1.pendingValidation.then(function () { return resolve(this$1$1.getErrorObject()); }); });
        })
      },
      getErrorObject: function getErrorObject () {
        return {
          name: this.context.nameOrFallback || this.context.name,
          errors: this.validationErrors.filter(function (s) { return typeof s === 'string'; }),
          hasErrors: !!this.validationErrors.length
        }
      },
      setErrors: function setErrors (errors) {
        this.localErrors = arrayify(errors);
      },
      setGroupErrors: function setGroupErrors (groupErrors) {
        this.localGroupErrors = groupErrors;
      },
      registerRule: function registerRule (rule, args, ruleName, message) {
        if ( message === void 0 ) message = null;

        if (!this.ruleRegistry.some(function (r) { return r[2] === ruleName; })) {
          // These are the raw rule format since they will be used directly.
          this.ruleRegistry.push([rule, args, ruleName]);
          if (message !== null) {
            this.messageRegistry[ruleName] = message;
          }
        }
      },
      removeRule: function removeRule (key) {
        var ruleIndex = this.ruleRegistry.findIndex(function (r) { return r[2] === key; });
        if (ruleIndex >= 0) {
          this.ruleRegistry.splice(ruleIndex, 1);
          delete this.messageRegistry[key];
        }
      }
    }
  };

  var _hoisted_1$e = ["data-classification", "data-has-errors", "data-is-showing-errors", "data-has-value", "data-type"];

  function render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(_ctx.context.classes.outer),
      "data-classification": $options.classification,
      "data-has-errors": _ctx.hasErrors,
      "data-is-showing-errors": _ctx.hasVisibleErrors,
      "data-has-value": _ctx.hasValue,
      "data-type": $props.type
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(_ctx.context.classes.wrapper)
      }, [
        (_ctx.context.labelPosition === 'before')
          ? vue.renderSlot(_ctx.$slots, "label", vue.normalizeProps(vue.mergeProps({ key: 0 }, _ctx.context)), function () { return [
              (_ctx.context.hasLabel)
                ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.label), vue.mergeProps({ key: 0 }, _ctx.context.slotProps.label, { context: _ctx.context }), null, 16 /* FULL_PROPS */, ["context"]))
                : vue.createCommentVNode("v-if", true)
            ]; })
          : vue.createCommentVNode("v-if", true),
        (_ctx.context.helpPosition === 'before')
          ? vue.renderSlot(_ctx.$slots, "help", vue.normalizeProps(vue.mergeProps({ key: 1 }, _ctx.context)), function () { return [
              (_ctx.context.help)
                ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.help), vue.mergeProps({ key: 0 }, _ctx.context.slotProps.help, { context: _ctx.context }), null, 16 /* FULL_PROPS */, ["context"]))
                : vue.createCommentVNode("v-if", true)
            ]; })
          : vue.createCommentVNode("v-if", true),
        vue.renderSlot(_ctx.$slots, "element", vue.normalizeProps(vue.guardReactiveProps(_ctx.context)), function () { return [
          (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.component), vue.mergeProps({ context: _ctx.context }, _ctx.context.slotProps.component, vue.toHandlers(_ctx.listeners)), {
            default: vue.withCtx(function () { return [
              vue.renderSlot(_ctx.$slots, "default", vue.normalizeProps(vue.guardReactiveProps(_ctx.context)))
            ]; }),
            _: 3 /* FORWARDED */
          }, 16 /* FULL_PROPS */, ["context"]))
        ]; }),
        (_ctx.context.labelPosition === 'after')
          ? vue.renderSlot(_ctx.$slots, "label", vue.normalizeProps(vue.mergeProps({ key: 2 }, _ctx.context)), function () { return [
              (_ctx.context.hasLabel)
                ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.label), vue.mergeProps({
                    key: 0,
                    context: _ctx.context
                  }, _ctx.context.slotProps.label), null, 16 /* FULL_PROPS */, ["context"]))
                : vue.createCommentVNode("v-if", true)
            ]; })
          : vue.createCommentVNode("v-if", true)
      ], 2 /* CLASS */),
      (_ctx.context.helpPosition === 'after')
        ? vue.renderSlot(_ctx.$slots, "help", vue.normalizeProps(vue.mergeProps({ key: 0 }, _ctx.context)), function () { return [
            (_ctx.context.help)
              ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.help), vue.mergeProps({
                  key: 0,
                  context: _ctx.context
                }, _ctx.context.slotProps.help), null, 16 /* FULL_PROPS */, ["context"]))
              : vue.createCommentVNode("v-if", true)
          ]; })
        : vue.createCommentVNode("v-if", true),
      vue.renderSlot(_ctx.$slots, "errors", vue.normalizeProps(vue.guardReactiveProps(_ctx.context)), function () { return [
        (!_ctx.context.disableErrors)
          ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.errors), vue.mergeProps({
              key: 0,
              type: _ctx.context.slotComponents.errors === 'FormulateErrors' ? 'input' : false,
              context: _ctx.context
            }, _ctx.context.slotProps.errors), null, 16 /* FULL_PROPS */, ["type", "context"]))
          : vue.createCommentVNode("v-if", true)
      ]; })
    ], 10 /* CLASS, PROPS */, _hoisted_1$e))
  }

  script$k.render = render$k;
  script$k.__file = "src/FormulateInput.vue";

  var script$j = {
    inject: {
      observeErrors: {
        default: false
      },
      removeErrorObserver: {
        default: false
      },
      observeContext: {
        default: false
      },
      removeContextObserver: {
        default: false
      }
    },
    props: {
      context: {
        type: Object,
        default: function () { return ({}); }
      },
      type: {
        type: String,
        default: 'form'
      }
    },
    data: function data () {
      return {
        boundSetErrors: this.setErrors.bind(this),
        boundSetFormContext: this.setFormContext.bind(this),
        localErrors: [],
        formContext: {
          classes: {
            formErrors: 'formulate-form-errors',
            formError: 'formulate-form-error'
          }
        }
      }
    },
    computed: {
      visibleValidationErrors: function visibleValidationErrors () {
        return Array.isArray(this.context.visibleValidationErrors) ? this.context.visibleValidationErrors : []
      },
      errors: function errors () {
        return Array.isArray(this.context.errors) ? this.context.errors : []
      },
      mergedErrors: function mergedErrors () {
        return this.errors.concat(this.localErrors)
      },
      visibleErrors: function visibleErrors () {
        return Array.from(new Set(this.mergedErrors.concat(this.visibleValidationErrors)))
          .filter(function (message) { return typeof message === 'string'; })
      },
      outerClass: function outerClass () {
        if (this.type === 'input' && this.context.classes) {
          return this.context.classes.errors
        }
        return this.formContext.classes.formErrors
      },
      itemClass: function itemClass () {
        if (this.type === 'input' && this.context.classes) {
          return this.context.classes.error
        }
        return this.formContext.classes.formError
      },
      role: function role () {
        return this.type === 'form' ? 'alert' : 'status'
      },
      ariaLive: function ariaLive () {
        return this.type === 'form' ? 'assertive' : 'polite'
      },
      slotComponent: function slotComponent () {
        return this.$formulate.slotComponent(null, 'errorList')
      }
    },
    created: function created () {
      // This registration is for <FormulateErrors /> that are used for displaying
      // Form errors in an override position.
      if (this.type === 'form' && typeof this.observeErrors === 'function') {
        if (!Array.isArray(this.context.errors)) {
          this.observeErrors({ callback: this.boundSetErrors, type: 'form' });
        }
        this.observeContext(this.boundSetFormContext);
      }
    },
    destroyed: function destroyed () {
      if (this.type === 'form' && typeof this.removeErrorObserver === 'function') {
        if (!Array.isArray(this.context.errors)) {
          this.removeErrorObserver(this.boundSetErrors);
        }
        this.removeContextObserver(this.boundSetFormContext);
      }
    },
    methods: {
      setErrors: function setErrors (errors) {
        this.localErrors = arrayify(errors);
      },
      setFormContext: function setFormContext (context) {
        this.formContext = context;
      }
    }
  };

  function render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($options.slotComponent), {
      "visible-errors": $options.visibleErrors,
      "item-class": $options.itemClass,
      "outer-class": $options.outerClass,
      role: $options.role,
      "aria-live": $options.ariaLive,
      type: $props.type
    }, null, 8 /* PROPS */, ["visible-errors", "item-class", "outer-class", "role", "aria-live", "type"]))
  }

  script$j.render = render$j;
  script$j.__file = "src/FormulateErrors.vue";

  var script$i = {
    props: {
      context: {
        type: Object,
        required: true
      }
    }
  };

  var _hoisted_1$d = ["id", "textContent"];

  function render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return ($props.context.help)
      ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          id: (($props.context.id) + "-help"),
          class: vue.normalizeClass($props.context.classes.help),
          textContent: vue.toDisplayString($props.context.help)
        }, null, 10 /* CLASS, PROPS */, _hoisted_1$d))
      : vue.createCommentVNode("v-if", true)
  }

  script$i.render = render$i;
  script$i.__file = "src/slots/FormulateHelp.vue";

  var script$h = {
    props: {
      file: {
        type: Object,
        required: true
      },
      imagePreview: {
        type: Boolean,
        default: false
      },
      context: {
        type: Object,
        required: true
      }
    }
  };

  var _hoisted_1$c = ["src"];
  var _hoisted_2$7 = ["title", "textContent"];
  var _hoisted_3$4 = ["data-just-finished", "data-is-finished"];

  function render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass($props.context.classes.file)
    }, [
      (!!($props.imagePreview && $props.file.previewData))
        ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass($props.context.classes.fileImagePreview)
          }, [
            vue.createElementVNode("img", {
              src: $props.file.previewData,
              class: vue.normalizeClass($props.context.classes.fileImagePreviewImage)
            }, null, 10 /* CLASS, PROPS */, _hoisted_1$c)
          ], 2 /* CLASS */))
        : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("div", {
        class: vue.normalizeClass($props.context.classes.fileName),
        title: $props.file.name,
        textContent: vue.toDisplayString($props.file.name)
      }, null, 10 /* CLASS, PROPS */, _hoisted_2$7),
      ($props.file.progress !== false)
        ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            "data-just-finished": $props.file.justFinished,
            "data-is-finished": !$props.file.justFinished && $props.file.complete,
            class: vue.normalizeClass($props.context.classes.fileProgress)
          }, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass($props.context.classes.fileProgressInner),
              style: vue.normalizeStyle({width: $props.file.progress + '%'})
            }, null, 6 /* CLASS, STYLE */)
          ], 10 /* CLASS, PROPS */, _hoisted_3$4))
        : vue.createCommentVNode("v-if", true),
      (($props.file.complete && !$props.file.justFinished) || $props.file.progress === false)
        ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 2,
            class: vue.normalizeClass($props.context.classes.fileRemove),
            onClick: _cache[0] || (_cache[0] = function () {
              var ref;

              var args = [], len = arguments.length;
              while ( len-- ) args[ len ] = arguments[ len ];
              return ($props.file.removeFile && (ref = $props.file).removeFile.apply(ref, args));
    })
          }, null, 2 /* CLASS */))
        : vue.createCommentVNode("v-if", true)
    ], 2 /* CLASS */))
  }

  script$h.render = render$h;
  script$h.__file = "src/slots/FormulateFile.vue";

  var script$g = {
    name: 'FormulateGrouping',
    props: {
      context: {
        type: Object,
        required: true
      }
    },
    provide: function provide () {
      return {
        isSubField: function () { return true; },
        registerProvider: this.registerProvider,
        deregisterProvider: this.deregisterProvider
      }
    },
    data: function data () {
      return {
        providers: [],
        keys: []
      }
    },
    inject: ['formulateRegisterRule', 'formulateRemoveRule'],
    computed: {
      items: function items () {
        var this$1$1 = this;

        if (Array.isArray(this.context.model)) {
          if (!this.context.repeatable && this.context.model.length === 0) {
            // This is the default input.
            return [this.setId({}, 0)]
          }
          if (this.context.model.length < this.context.minimum) {
            return (new Array(this.context.minimum || 1)).fill('')
              .map(function (t, index) { return this$1$1.setId(this$1$1.context.model[index] || {}, index); })
          }
          return this.context.model.map(function (item, index) { return this$1$1.setId(item, index); })
        }
        // This is an unset group
        return (new Array(this.context.minimum || 1)).fill('').map(function (_i, index) { return this$1$1.setId({}, index); })
      },
      formShouldShowErrors: function formShouldShowErrors () {
        return this.context.formShouldShowErrors
      },
      groupErrors: function groupErrors () {
        var this$1$1 = this;

        return this.items
          .map(function (item, index) { return has(this$1$1.context.groupErrors, index) ? this$1$1.context.groupErrors[index] : {}; })
      }
    },
    watch: {
      providers: function providers () {
        if (this.formShouldShowErrors) {
          this.showErrors();
        }
      },
      formShouldShowErrors: function formShouldShowErrors (val) {
        if (val) {
          this.showErrors();
        }
      },
      items: {
        handler: function handler (items, oldItems) {
          if (!equals(items, oldItems, true)) {
            this.keys = items.map(function (item) { return item.__id; });
          }
        },
        immediate: true
      }
    },
    created: function created () {
      // We register with an error message of 'true' which causes the validation to fail but no message output.
      this.formulateRegisterRule(this.validateGroup.bind(this), [], 'formulateGrouping', true);
    },
    destroyed: function destroyed () {
      this.formulateRemoveRule('formulateGrouping');
    },
    methods: {
      validateGroup: function validateGroup () {
        return Promise.all(this.providers.reduce(function (resolvers, provider) {
          if (provider && typeof provider.hasValidationErrors === 'function') {
            resolvers.push(provider.hasValidationErrors());
          }
          return resolvers
        }, [])).then(function (providersHasErrors) { return !providersHasErrors.some(function (hasErrors) { return !!hasErrors; }); })
      },
      showErrors: function showErrors () {
        this.providers.forEach(function (p) { return p && typeof p.showErrors === 'function' && p.showErrors(); });
      },
      setItem: function setItem (index, groupProxy) {
        var this$1$1 = this;

        // Note: value must have an __id to use this function
        if (Array.isArray(this.context.model) && this.context.model.length >= this.context.minimum && !this.context.model.__init) {
          this.context.model.splice(index, 1, this.setId(groupProxy, index));
        } else {
          this.context.model = this.items.map(function (item, i) { return i === index ? this$1$1.setId(groupProxy, index) : item; });
        }
      },
      removeItem: function removeItem (index) {
        var this$1$1 = this;

        if (Array.isArray(this.context.model) && this.context.model.length > this.context.minimum) {
          // In this context we actually have data
          this.context.model = this.context.model.filter(function (item, i) { return i === index ? false : item; });
          this.context.rootEmit('repeatableRemoved', this.context.model);
        } else if (!Array.isArray(this.context.model) && this.items.length > this.context.minimum) {
          // In this context the fields have never been touched (not "dirty")
          this.context.model = (new Array(this.items.length - 1)).fill('').map(function (_i, idx) { return this$1$1.setId({}, idx); });
          this.context.rootEmit('repeatableRemoved', this.context.model);
        }
        // Otherwise, do nothing, we're at our minimum
      },
      registerProvider: function registerProvider (provider) {
        if (!this.providers.some(function (p) { return p === provider; })) {
          this.providers.push(provider);
        }
      },
      deregisterProvider: function deregisterProvider (provider) {
        this.providers = this.providers.filter(function (p) { return p !== provider; });
      },
      setId: function setId$1 (item, index) {
        return item.__id ? item : setId(item, this.keys[index])
      }
    }
  };

  function render$g(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateRepeatableProvider = vue.resolveComponent("FormulateRepeatableProvider");
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");

    return (vue.openBlock(), vue.createBlock(_component_FormulateSlot, {
      name: "grouping",
      class: vue.normalizeClass($props.context.classes.grouping),
      context: $props.context,
      "force-wrap": $props.context.repeatable
    }, {
      default: vue.withCtx(function () { return [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.items, function (item, index) {
          return (vue.openBlock(), vue.createBlock(_component_FormulateRepeatableProvider, {
            key: item.__id,
            index: index,
            context: $props.context,
            uuid: item.__id,
            errors: $options.groupErrors[index],
            onRemove: $options.removeItem,
            onInput: function (values) { return $options.setItem(index, values); }
          }, {
            default: vue.withCtx(function () { return [
              vue.renderSlot(_ctx.$slots, "default")
            ]; }),
            _: 2 /* DYNAMIC */
          }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["index", "context", "uuid", "errors", "onRemove", "onInput"]))
        }), 128 /* KEYED_FRAGMENT */))
      ]; }),
      _: 3 /* FORWARDED */
    }, 8 /* PROPS */, ["class", "context", "force-wrap"]))
  }

  script$g.render = render$g;
  script$g.__file = "src/FormulateGrouping.vue";

  var script$f = {
    props: {
      context: {
        type: Object,
        required: true
      }
    }
  };

  var _hoisted_1$b = ["id", "for", "textContent"];

  function render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createElementBlock("label", {
      id: (($props.context.id) + "_label"),
      class: vue.normalizeClass($props.context.classes.label),
      for: $props.context.id,
      textContent: vue.toDisplayString($props.context.label)
    }, null, 10 /* CLASS, PROPS */, _hoisted_1$b))
  }

  script$f.render = render$f;
  script$f.__file = "src/slots/FormulateLabel.vue";

  var script$e = {
    props: {
      context: {
        type: Object,
        required: true
      },
      addMore: {
        type: Function,
        required: true
      }
    }
  };

  function render$e(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateInput = vue.resolveComponent("FormulateInput");

    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass($props.context.classes.groupAddMore)
    }, [
      vue.createVNode(_component_FormulateInput, {
        type: "button",
        label: $props.context.addLabel,
        "data-minor": "",
        "data-ghost": "",
        onClick: $props.addMore
      }, null, 8 /* PROPS */, ["label", "onClick"])
    ], 2 /* CLASS */))
  }

  script$e.render = render$e;
  script$e.__file = "src/slots/FormulateAddMore.vue";

  /**
   * Default base for input components.
   */
  var FormulateInputMixin = {
    props: {
      context: {
        type: Object,
        required: true
      }
    },
    computed: {
      type: function type () {
        return this.context.type
      },
      attributes: function attributes () {
        return this.context.attributes || {}
      },
      hasValue: function hasValue () {
        return this.context.hasValue
      }
    }
  };

  var script$d = {
    name: 'FormulateInputBox',
    mixins: [FormulateInputMixin],
    computed: {
      usesDecorator: function usesDecorator () {
        return this.$formulate.options.useInputDecorators
      }
    }
  };

  var _hoisted_1$a = ["data-type"];
  var _hoisted_2$6 = ["value"];
  var _hoisted_3$3 = ["value"];

  function render$d(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");

    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(_ctx.context.classes.element),
      "data-type": _ctx.context.type
    }, [
      vue.createVNode(_component_FormulateSlot, {
        name: "prefix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.prefix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"]),
      vue.createCommentVNode("\n      This explicit break out of types is due to a Vue bug that causes IE11 to\n      not when using v-model + dynamic :type + :value (thanks @Christoph-Wagner)\n      https://github.com/vuejs/vue/issues/8379\n    "),
      (_ctx.type === 'radio')
        ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", vue.mergeProps({
            key: 0,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) { return ((_ctx.context.model) = $event); }),
            type: "radio",
            value: _ctx.context.value
          }, _ctx.attributes, vue.toHandlers(_ctx.$listeners, true), {
            onBlur: _cache[1] || (_cache[1] = function () {
              var ref;

              var args = [], len = arguments.length;
              while ( len-- ) args[ len ] = arguments[ len ];
              return (_ctx.context.blurHandler && (ref = _ctx.context).blurHandler.apply(ref, args));
    })
          }), null, 16 /* FULL_PROPS */, _hoisted_2$6)), [
            [vue.vModelRadio, _ctx.context.model]
          ])
        : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", vue.mergeProps({
            key: 1,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) { return ((_ctx.context.model) = $event); }),
            type: "checkbox",
            value: _ctx.context.value
          }, _ctx.attributes, vue.toHandlers(_ctx.$listeners, true), {
            onBlur: _cache[3] || (_cache[3] = function () {
              var ref;

              var args = [], len = arguments.length;
              while ( len-- ) args[ len ] = arguments[ len ];
              return (_ctx.context.blurHandler && (ref = _ctx.context).blurHandler.apply(ref, args));
    })
          }), null, 16 /* FULL_PROPS */, _hoisted_3$3)), [
            [vue.vModelCheckbox, _ctx.context.model]
          ]),
      vue.createCommentVNode("\n      Ok, so for reasons that we cannot explain, the <label> here will not\n      update when the attribute.id changes. Possible bug in core? Either way,\n      making this a <component> forces vue to re-render this label when the\n      id changes.\n\n      https://github.com/wearebraid/vue-formulate/issues/75\n    "),
      ($options.usesDecorator)
        ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent("label"), {
            key: 2,
            class: vue.normalizeClass(_ctx.context.classes.decorator),
            for: _ctx.attributes.id
          }, null, 8 /* PROPS */, ["class", "for"]))
        : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_FormulateSlot, {
        name: "suffix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.suffix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"])
    ], 10 /* CLASS, PROPS */, _hoisted_1$a))
  }

  script$d.render = render$d;
  script$d.__file = "src/inputs/FormulateInputBox.vue";

  var script$c = {
    props: {
      visibleErrors: {
        type: Array,
        required: true
      },
      itemClass: {
        type: [String, Array, Object, Boolean],
        default: false
      },
      outerClass: {
        type: [String, Array, Object, Boolean],
        default: false
      },
      role: {
        type: [String],
        default: 'status'
      },
      ariaLive: {
        type: [String, Boolean],
        default: 'polite'
      },
      type: {
        type: String,
        required: true
      }
    }
  };

  var _hoisted_1$9 = ["role", "aria-live", "textContent"];

  function render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return ($props.visibleErrors.length)
      ? (vue.openBlock(), vue.createElementBlock("ul", {
          key: 0,
          class: vue.normalizeClass($props.outerClass)
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.visibleErrors, function (error) {
            return (vue.openBlock(), vue.createElementBlock("li", {
              key: error,
              class: vue.normalizeClass($props.itemClass),
              role: $props.role,
              "aria-live": $props.ariaLive,
              textContent: vue.toDisplayString(error)
            }, null, 10 /* CLASS, PROPS */, _hoisted_1$9))
          }), 128 /* KEYED_FRAGMENT */))
        ], 2 /* CLASS */))
      : vue.createCommentVNode("v-if", true)
  }

  script$c.render = render$c;
  script$c.__file = "src/slots/FormulateErrorList.vue";

  var script$b = {
    name: 'FormulateInputText',
    mixins: [FormulateInputMixin]
  };

  var _hoisted_1$8 = ["data-type"];
  var _hoisted_2$5 = ["type"];

  function render$b(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");

    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(_ctx.context.classes.element),
      "data-type": _ctx.context.type
    }, [
      vue.createVNode(_component_FormulateSlot, {
        name: "prefix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.prefix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"]),
      vue.withDirectives(vue.createElementVNode("input", vue.mergeProps({
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) { return ((_ctx.context.model) = $event); }),
        type: _ctx.type
      }, _ctx.attributes, {
        onBlur: _cache[1] || (_cache[1] = function () {
          var ref;

          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];
          return (_ctx.context.blurHandler && (ref = _ctx.context).blurHandler.apply(ref, args));
    })
      }, vue.toHandlers(_ctx.$listeners, true)), null, 16 /* FULL_PROPS */, _hoisted_2$5), [
        [vue.vModelDynamic, _ctx.context.model]
      ]),
      vue.createVNode(_component_FormulateSlot, {
        name: "suffix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.suffix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"])
    ], 10 /* CLASS, PROPS */, _hoisted_1$8))
  }

  script$b.render = render$b;
  script$b.__file = "src/inputs/FormulateInputText.vue";

  var script$a = {
    name: 'FormulateFiles',
    props: {
      files: {
        type: FileUpload,
        required: true
      },
      imagePreview: {
        type: Boolean,
        default: false
      },
      context: {
        type: Object,
        required: true
      }
    },
    computed: {
      fileUploads: function fileUploads () {
        return this.files.files || []
      },
      isMultiple: function isMultiple () {
        return has(this.context.attributes, 'multiple')
      }
    },
    watch: {
      files: function files () {
        if (this.imagePreview) {
          this.files.loadPreviews();
        }
      }
    },
    mounted: function mounted () {
      if (this.imagePreview) {
        this.files.loadPreviews();
      }
    },
    methods: {
      appendFiles: function appendFiles () {
        var input = this.$refs.addFiles;
        if (input.files.length) {
          this.files.mergeFileList(input);
        }
      }
    }
  };

  var _hoisted_1$7 = ["data-has-error", "data-has-preview"];
  var _hoisted_2$4 = ["textContent"];

  function render$a(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");

    return ($options.fileUploads.length)
      ? (vue.openBlock(), vue.createElementBlock("ul", {
          key: 0,
          class: vue.normalizeClass($props.context.classes.files)
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.fileUploads, function (file) {
            return (vue.openBlock(), vue.createElementBlock("li", {
              key: file.uuid,
              "data-has-error": !!file.error,
              "data-has-preview": !!($props.imagePreview && file.previewData)
            }, [
              vue.createVNode(_component_FormulateSlot, {
                name: "file",
                context: $props.context,
                file: file,
                "image-preview": $props.imagePreview
              }, {
                default: vue.withCtx(function () { return [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.context.slotComponents.file), {
                    context: $props.context,
                    file: file,
                    "image-preview": $props.imagePreview
                  }, null, 8 /* PROPS */, ["context", "file", "image-preview"]))
                ]; }),
                _: 2 /* DYNAMIC */
              }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["context", "file", "image-preview"]),
              (file.error)
                ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    class: vue.normalizeClass($props.context.classes.fileUploadError),
                    textContent: vue.toDisplayString(file.error)
                  }, null, 10 /* CLASS, PROPS */, _hoisted_2$4))
                : vue.createCommentVNode("v-if", true)
            ], 8 /* PROPS */, _hoisted_1$7))
          }), 128 /* KEYED_FRAGMENT */)),
          ($options.isMultiple && $props.context.addLabel)
            ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass($props.context.classes.fileAdd),
                role: "button"
              }, [
                vue.createTextVNode(vue.toDisplayString($props.context.addLabel) + " ", 1 /* TEXT */),
                vue.createElementVNode("input", {
                  ref: "addFiles",
                  type: "file",
                  multiple: "",
                  class: vue.normalizeClass($props.context.classes.fileAddInput),
                  onChange: _cache[0] || (_cache[0] = function () {
                    var args = [], len = arguments.length;
                    while ( len-- ) args[ len ] = arguments[ len ];

                    return ($options.appendFiles && $options.appendFiles.apply($options, args));
    })
                }, null, 34 /* CLASS, NEED_HYDRATION */)
              ], 2 /* CLASS */))
            : vue.createCommentVNode("v-if", true)
        ], 2 /* CLASS */))
      : vue.createCommentVNode("v-if", true)
  }

  script$a.render = render$a;
  script$a.__file = "src/FormulateFiles.vue";

  var script$9 = {
    name: 'FormulateInputFile',
    components: {
      FormulateFiles: script$a
    },
    mixins: [FormulateInputMixin],
    data: function data () {
      return {
        isOver: false
      }
    },
    computed: {
      hasFiles: function hasFiles () {
        return !!(this.context.model instanceof FileUpload && this.context.model.files.length)
      }
    },
    created: function created () {
      if (Array.isArray(this.context.model)) {
        if (typeof this.context.model[0][this.$formulate.getFileUrlKey()] === 'string') {
          this.context.model = this.$formulate.createUpload({
            files: this.context.model
          }, this.context);
        }
      }
    },
    mounted: function mounted () {
      // Add a listener to the window to prevent drag/drops that miss the dropzone
      // from opening the file and navigating the user away from the page.
      if (window && this.context.preventWindowDrops) {
        window.addEventListener('dragover', this.preventDefault);
        window.addEventListener('drop', this.preventDefault);
      }
    },
    destroyed: function destroyed () {
      if (window && this.context.preventWindowDrops) {
        window.removeEventListener('dragover', this.preventDefault);
        window.removeEventListener('drop', this.preventDefault);
      }
    },
    methods: {
      preventDefault: function preventDefault (e) {
        if (e.target.tagName !== 'INPUT' && e.target.getAttribute('type') !== 'file') {
          e = e || event;
          e.preventDefault();
        }
      },
      handleFile: function handleFile () {
        var this$1$1 = this;

        this.isOver = false;
        var input = this.$refs.file;
        if (input.files.length) {
          this.context.model = this.$formulate.createUpload(input, this.context);
          // nextTick required for attemptImmediateUpload to pass instanceof reliably
          this.$nextTick(function () { return this$1$1.attemptImmediateUpload(); });
        }
      },
      attemptImmediateUpload: function attemptImmediateUpload () {
        var this$1$1 = this;

        if (this.context.uploadBehavior === 'live' &&
          this.context.model instanceof FileUpload) {
          this.context.hasValidationErrors().then(function (errors) {
            if (!errors) {
              this$1$1.context.model.upload();
            }
          });
        }
      },
      handleDragOver: function handleDragOver (e) {
        e.preventDefault();
        this.isOver = true;
      },
      handleDragLeave: function handleDragLeave (e) {
        e.preventDefault();
        this.isOver = false;
      }
    }
  };

  var _hoisted_1$6 = ["data-type", "data-has-files"];
  var _hoisted_2$3 = ["data-has-files"];
  var _hoisted_3$2 = ["data-is-drag-hover"];

  function render$9(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");
    var _component_FormulateFiles = vue.resolveComponent("FormulateFiles");

    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(_ctx.context.classes.element),
      "data-type": _ctx.context.type,
      "data-has-files": $options.hasFiles
    }, [
      vue.createVNode(_component_FormulateSlot, {
        name: "prefix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.prefix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"]),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(_ctx.context.classes.uploadArea),
        "data-has-files": $options.hasFiles
      }, [
        vue.createElementVNode("input", vue.mergeProps({
          ref: "file",
          "data-is-drag-hover": $data.isOver,
          type: "file"
        }, _ctx.attributes, vue.toHandlers(_ctx.$listeners, true), {
          onBlur: _cache[0] || (_cache[0] = function () {
            var ref;

            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];
            return (_ctx.context.blurHandler && (ref = _ctx.context).blurHandler.apply(ref, args));
    }),
          onChange: _cache[1] || (_cache[1] = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return ($options.handleFile && $options.handleFile.apply($options, args));
    }),
          onDragover: _cache[2] || (_cache[2] = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return ($options.handleDragOver && $options.handleDragOver.apply($options, args));
    }),
          onDragleave: _cache[3] || (_cache[3] = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return ($options.handleDragLeave && $options.handleDragLeave.apply($options, args));
    })
        }), null, 16 /* FULL_PROPS */, _hoisted_3$2),
        vue.createVNode(_component_FormulateSlot, {
          name: "uploadAreaMask",
          context: _ctx.context,
          "has-files": $options.hasFiles
        }, {
          default: vue.withCtx(function () { return [
            vue.withDirectives((vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.uploadAreaMask), {
              "has-files": _ctx.context.slotComponents.uploadAreaMask === 'div' ? false : $options.hasFiles,
              "data-has-files": _ctx.context.slotComponents.uploadAreaMask === 'div' ? $options.hasFiles : false,
              class: vue.normalizeClass(_ctx.context.classes.uploadAreaMask)
            }, null, 8 /* PROPS */, ["has-files", "data-has-files", "class"])), [
              [vue.vShow, !$options.hasFiles]
            ])
          ]; }),
          _: 1 /* STABLE */
        }, 8 /* PROPS */, ["context", "has-files"]),
        ($options.hasFiles)
          ? (vue.openBlock(), vue.createBlock(_component_FormulateFiles, {
              key: 0,
              files: _ctx.context.model,
              "image-preview": _ctx.context.type === 'image' && _ctx.context.imageBehavior === 'preview',
              context: _ctx.context
            }, null, 8 /* PROPS */, ["files", "image-preview", "context"]))
          : vue.createCommentVNode("v-if", true)
      ], 10 /* CLASS, PROPS */, _hoisted_2$3),
      vue.createVNode(_component_FormulateSlot, {
        name: "suffix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.suffix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"])
    ], 10 /* CLASS, PROPS */, _hoisted_1$6))
  }

  script$9.render = render$9;
  script$9.__file = "src/inputs/FormulateInputFile.vue";

  var script$8 = {
    props: {
      context: {
        type: Object,
        required: true
      },
      removeItem: {
        type: Function,
        required: true
      },
      index: {
        type: Number,
        required: true
      }
    }
  };

  function render$8(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");

    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass($props.context.classes.groupRepeatable)
    }, [
      ($props.context.removePosition === 'after')
        ? vue.renderSlot(_ctx.$slots, "default", { key: 0 })
        : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_FormulateSlot, {
        name: "remove",
        context: $props.context,
        index: $props.index,
        "remove-item": $props.removeItem
      }, {
        default: vue.withCtx(function () { return [
          (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.context.slotComponents.remove), vue.mergeProps({
            context: $props.context,
            index: $props.index,
            "remove-item": $props.removeItem
          }, $props.context.slotProps.remove), null, 16 /* FULL_PROPS */, ["context", "index", "remove-item"]))
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context", "index", "remove-item"]),
      ($props.context.removePosition === 'before')
        ? vue.renderSlot(_ctx.$slots, "default", { key: 1 })
        : vue.createCommentVNode("v-if", true)
    ], 2 /* CLASS */))
  }

  script$8.render = render$8;
  script$8.__file = "src/slots/FormulateRepeatable.vue";

  function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  var script$7 = {
    name: 'FormulateInputGroup',
    props: {
      context: {
        type: Object,
        required: true
      }
    },
    computed: {
      options: function options () {
        return this.context.options || []
      },
      subType: function subType () {
        return (this.context.type === 'group') ? 'grouping' : 'inputs'
      },
      optionsWithContext: function optionsWithContext () {
        var this$1$1 = this;

        var ref = this.context;
        var ref_attributes = ref.attributes;
        ref_attributes.id;
        var rest = objectWithoutProperties( ref_attributes, ["id"] );
        var groupApplicableAttributes = rest;
        ref.blurHandler;
        ref.classification;
        ref.component;
        ref.getValidationErrors;
        ref.hasLabel;
        ref.hasValidationErrors;
        ref.isSubField;
        ref.isValid;
        ref.labelPosition;
        ref.options;
        ref.performValidation;
        ref.setErrors;
        ref.slotComponents;
        ref.slotProps;
        ref.validationErrors;
        ref.visibleValidationErrors;
        ref.classes;
        ref.showValidationErrors;
        ref.rootEmit;
        ref.help;
        ref.pseudoProps;
        ref.rules;
        ref.model;
        var rest$1 = objectWithoutProperties( ref, ["attributes", "blurHandler", "classification", "component", "getValidationErrors", "hasLabel", "hasValidationErrors", "isSubField", "isValid", "labelPosition", "options", "performValidation", "setErrors", "slotComponents", "slotProps", "validationErrors", "visibleValidationErrors", "classes", "showValidationErrors", "rootEmit", "help", "pseudoProps", "rules", "model"] );
        var context = rest$1;
        return this.options.map(function (option) { return this$1$1.groupItemContext(
          context,
          option,
          groupApplicableAttributes
        ); })
      },
      totalItems: function totalItems () {
        return Array.isArray(this.context.model) && this.context.model.length > this.context.minimum
          ? this.context.model.length
          : this.context.minimum || 1
      },
      canAddMore: function canAddMore () {
        return (this.context.repeatable && this.totalItems < this.context.limit)
      },
      labelledBy: function labelledBy () {
        return this.context.label && ((this.context.id) + "_label")
      }
    },
    methods: {
      addItem: function addItem () {
        if (Array.isArray(this.context.model)) {
          var minDiff = (this.context.minimum - this.context.model.length) + 1;
          var toAdd = Math.max(minDiff, 1);
          for (var i = 0; i < toAdd; i++) {
            this.context.model.push(setId({}));
          }
        } else {
          this.context.model = (new Array(this.totalItems + 1)).fill('').map(function () { return setId({}); });
        }
        this.context.rootEmit('repeatableAdded', this.context.model);
      },
      groupItemContext: function groupItemContext (context, option, groupAttributes) {
        var optionAttributes = { isGrouped: true };
        var ctx = Object.assign({}, context, option, groupAttributes, optionAttributes, !context.hasGivenName ? {
          name: true
        } : {});
        return ctx
      }
    }
  };

  var _hoisted_1$5 = ["data-is-repeatable", "aria-labelledby"];

  function render$7(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");
    var _component_FormulateInput = vue.resolveComponent("FormulateInput");
    var _component_FormulateGrouping = vue.resolveComponent("FormulateGrouping");

    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass($props.context.classes.element),
      "data-is-repeatable": $props.context.repeatable,
      role: "group",
      "aria-labelledby": $options.labelledBy
    }, [
      vue.createVNode(_component_FormulateSlot, {
        name: "prefix",
        context: $props.context
      }, {
        default: vue.withCtx(function () { return [
          ($props.context.slotComponents.prefix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.context.slotComponents.prefix), {
                key: 0,
                context: $props.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"]),
      ($options.subType !== 'grouping')
        ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList($options.optionsWithContext, function (optionContext) {
            return (vue.openBlock(), vue.createBlock(_component_FormulateInput, vue.mergeProps({
              key: optionContext.id,
              modelValue: $props.context.model,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) { return (($props.context.model) = $event); }),
              ref_for: true
            }, optionContext, {
              "disable-errors": true,
              "prevent-deregister": true,
              class: "formulate-input-group-item",
              onBlur: $props.context.blurHandler
            }), null, 16 /* FULL_PROPS */, ["modelValue", "onBlur"]))
          }), 128 /* KEYED_FRAGMENT */))
        : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createVNode(_component_FormulateGrouping, { context: $props.context }, {
              default: vue.withCtx(function () { return [
                vue.renderSlot(_ctx.$slots, "default")
              ]; }),
              _: 3 /* FORWARDED */
            }, 8 /* PROPS */, ["context"]),
            ($options.canAddMore)
              ? (vue.openBlock(), vue.createBlock(_component_FormulateSlot, {
                  key: 0,
                  name: "addmore",
                  context: $props.context,
                  "add-more": $options.addItem
                }, {
                  default: vue.withCtx(function () { return [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.context.slotComponents.addMore), vue.mergeProps({
                      context: $props.context,
                      "add-more": $options.addItem
                    }, $props.context.slotProps.addMore, { onAdd: $options.addItem }), null, 16 /* FULL_PROPS */, ["context", "add-more", "onAdd"]))
                  ]; }),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["context", "add-more"]))
              : vue.createCommentVNode("v-if", true)
          ], 64 /* STABLE_FRAGMENT */)),
      vue.createVNode(_component_FormulateSlot, {
        name: "suffix",
        context: $props.context
      }, {
        default: vue.withCtx(function () { return [
          ($props.context.slotComponents.suffix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.context.slotComponents.suffix), {
                key: 0,
                context: $props.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"])
    ], 10 /* CLASS, PROPS */, _hoisted_1$5))
  }

  script$7.render = render$7;
  script$7.__file = "src/inputs/FormulateInputGroup.vue";

  var script$6 = {
    name: 'FormulateInputButton',
    mixins: [FormulateInputMixin]
  };

  var _hoisted_1$4 = ["data-type"];
  var _hoisted_2$2 = ["type"];

  function render$6(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");

    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(_ctx.context.classes.element),
      "data-type": _ctx.context.type
    }, [
      vue.createVNode(_component_FormulateSlot, {
        name: "prefix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.prefix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"]),
      vue.createElementVNode("button", vue.mergeProps({ type: _ctx.type }, _ctx.attributes, vue.toHandlers(_ctx.$listeners, true)), [
        vue.renderSlot(_ctx.$slots, "default", { context: _ctx.context }, function () { return [
          (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.buttonContent), { context: _ctx.context }, null, 8 /* PROPS */, ["context"]))
        ]; })
      ], 16 /* FULL_PROPS */, _hoisted_2$2),
      vue.createVNode(_component_FormulateSlot, {
        name: "suffix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.suffix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"])
    ], 10 /* CLASS, PROPS */, _hoisted_1$4))
  }

  script$6.render = render$6;
  script$6.__file = "src/inputs/FormulateInputButton.vue";

  var script$5 = {
    name: 'FormulateInputSelect',
    mixins: [FormulateInputMixin],
    computed: {
      options: function options () {
        return this.context.options || {}
      },
      optionGroups: function optionGroups () {
        return this.context.optionGroups || false
      },
      placeholderSelected: function placeholderSelected () {
        return !!(!this.hasValue && this.context.attributes && this.context.attributes.placeholder)
      }
    }
  };

  var _hoisted_1$3 = ["data-type", "data-multiple"];
  var _hoisted_2$1 = ["data-placeholder-selected"];
  var _hoisted_3$1 = ["selected"];
  var _hoisted_4 = ["value", "disabled", "textContent"];
  var _hoisted_5 = ["label"];
  var _hoisted_6 = ["value", "disabled", "textContent"];

  function render$5(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");

    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(_ctx.context.classes.element),
      "data-type": _ctx.context.type,
      "data-multiple": _ctx.attributes && _ctx.attributes.multiple !== undefined
    }, [
      vue.createVNode(_component_FormulateSlot, {
        name: "prefix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.prefix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"]),
      vue.withDirectives(vue.createElementVNode("select", vue.mergeProps({
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) { return ((_ctx.context.model) = $event); })
      }, _ctx.attributes, { "data-placeholder-selected": $options.placeholderSelected }, vue.toHandlers(_ctx.$listeners, true), {
        onBlur: _cache[1] || (_cache[1] = function () {
          var ref;

          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];
          return (_ctx.context.blurHandler && (ref = _ctx.context).blurHandler.apply(ref, args));
    })
      }), [
        (_ctx.context.placeholder)
          ? (vue.openBlock(), vue.createElementBlock("option", {
              key: 0,
              value: "",
              hidden: "hidden",
              disabled: "",
              selected: !_ctx.hasValue
            }, vue.toDisplayString(_ctx.context.placeholder), 9 /* TEXT, PROPS */, _hoisted_3$1))
          : vue.createCommentVNode("v-if", true),
        (!$options.optionGroups)
          ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList($options.options, function (option) {
              return (vue.openBlock(), vue.createElementBlock("option", vue.mergeProps({
                key: option.id,
                value: option.value,
                disabled: !!option.disabled,
                ref_for: true
              }, option.attributes || option.attrs || {}, {
                textContent: vue.toDisplayString(option.label)
              }), null, 16 /* FULL_PROPS */, _hoisted_4))
            }), 128 /* KEYED_FRAGMENT */))
          : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 2 }, vue.renderList($options.optionGroups, function (subOptions, label) {
              return (vue.openBlock(), vue.createElementBlock("optgroup", {
                key: label,
                label: label
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(subOptions, function (option) {
                  return (vue.openBlock(), vue.createElementBlock("option", vue.mergeProps({
                    key: option.id,
                    value: option.value,
                    disabled: !!option.disabled,
                    ref_for: true
                  }, option.attributes || option.attrs || {}, {
                    textContent: vue.toDisplayString(option.label)
                  }), null, 16 /* FULL_PROPS */, _hoisted_6))
                }), 128 /* KEYED_FRAGMENT */))
              ], 8 /* PROPS */, _hoisted_5))
            }), 128 /* KEYED_FRAGMENT */))
      ], 16 /* FULL_PROPS */, _hoisted_2$1), [
        [vue.vModelSelect, _ctx.context.model]
      ]),
      vue.createVNode(_component_FormulateSlot, {
        name: "suffix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.suffix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"])
    ], 10 /* CLASS, PROPS */, _hoisted_1$3))
  }

  script$5.render = render$5;
  script$5.__file = "src/inputs/FormulateInputSelect.vue";

  var script$4 = {
    name: 'FormulateInputSlider',
    mixins: [FormulateInputMixin]
  };

  var _hoisted_1$2 = ["data-type"];
  var _hoisted_2 = ["type"];
  var _hoisted_3 = ["textContent"];

  function render$4(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");

    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(_ctx.context.classes.element),
      "data-type": _ctx.context.type
    }, [
      vue.createVNode(_component_FormulateSlot, {
        name: "prefix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.prefix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"]),
      vue.withDirectives(vue.createElementVNode("input", vue.mergeProps({
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) { return ((_ctx.context.model) = $event); }),
        type: _ctx.type
      }, _ctx.attributes, vue.toHandlers(_ctx.$listeners, true), {
        onBlur: _cache[1] || (_cache[1] = function () {
          var ref;

          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];
          return (_ctx.context.blurHandler && (ref = _ctx.context).blurHandler.apply(ref, args));
    })
      }), null, 16 /* FULL_PROPS */, _hoisted_2), [
        [vue.vModelDynamic, _ctx.context.model]
      ]),
      (_ctx.context.showValue)
        ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(_ctx.context.classes.rangeValue),
            textContent: vue.toDisplayString(_ctx.context.model)
          }, null, 10 /* CLASS, PROPS */, _hoisted_3))
        : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_FormulateSlot, {
        name: "suffix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.suffix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"])
    ], 10 /* CLASS, PROPS */, _hoisted_1$2))
  }

  script$4.render = render$4;
  script$4.__file = "src/inputs/FormulateInputSlider.vue";

  var script$3 = {
    props: {
      context: {
        type: Object,
        required: true
      }
    }
  };

  var _hoisted_1$1 = ["textContent"];

  function render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createElementBlock("span", {
      class: vue.normalizeClass(("formulate-input-element--" + ($props.context.type) + "--label")),
      textContent: vue.toDisplayString($props.context.value || $props.context.label || $props.context.name || 'Submit')
    }, null, 10 /* CLASS, PROPS */, _hoisted_1$1))
  }

  script$3.render = render$3;
  script$3.__file = "src/slots/FormulateButtonContent.vue";

  var script$2 = {
    name: 'FormulateInputTextArea',
    mixins: [FormulateInputMixin]
  };

  function render$2(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");

    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(_ctx.context.classes.element),
      "data-type": "textarea"
    }, [
      vue.createVNode(_component_FormulateSlot, {
        name: "prefix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.prefix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"]),
      vue.withDirectives(vue.createElementVNode("textarea", vue.mergeProps({
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) { return ((_ctx.context.model) = $event); })
      }, _ctx.attributes, vue.toHandlers(_ctx.$listeners, true), {
        onBlur: _cache[1] || (_cache[1] = function () {
          var ref;

          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];
          return (_ctx.context.blurHandler && (ref = _ctx.context).blurHandler.apply(ref, args));
    })
      }), null, 16 /* FULL_PROPS */), [
        [vue.vModelText, _ctx.context.model]
      ]),
      vue.createVNode(_component_FormulateSlot, {
        name: "suffix",
        context: _ctx.context
      }, {
        default: vue.withCtx(function () { return [
          (_ctx.context.slotComponents.suffix)
            ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
                key: 0,
                context: _ctx.context
              }, null, 8 /* PROPS */, ["context"]))
            : vue.createCommentVNode("v-if", true)
        ]; }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["context"])
    ], 2 /* CLASS */))
  }

  script$2.render = render$2;
  script$2.__file = "src/inputs/FormulateInputTextArea.vue";

  var script$1 = {
    provide: function provide () {
      var this$1$1 = this;

      return Object.assign({}, useRegistryProviders(this, ['getFormValues']),
        {formulateSetter: function (field, value) { return this$1$1.setGroupValue(field, value); }})
    },
    inject: {
      registerProvider: 'registerProvider',
      deregisterProvider: 'deregisterProvider'
    },
    props: {
      index: {
        type: Number,
        required: true
      },
      context: {
        type: Object,
        required: true
      },
      uuid: {
        type: String,
        required: true
      },
      errors: {
        type: Object,
        required: true
      }
    },
    data: function data () {
      return Object.assign({}, useRegistry(this),
        {isGrouping: true})
    },
    computed: Object.assign({}, useRegistryComputed(),
      {mergedFieldErrors: function mergedFieldErrors () {
        return this.errors
      }}),
    watch: Object.assign({}, useRegistryWatchers(),
      {'context.model': {
        handler: function handler (values) {
          if (!equals(values[this.index], this.proxy, true)) {
            this.setValues(values[this.index]);
          }
        },
        deep: true
      }}),
    created: function created () {
      this.applyInitialValues();
      this.registerProvider(this);
    },
    beforeDestroy: function beforeDestroy () {
      this.preventCleanup = true;
      this.deregisterProvider(this);
    },
    methods: Object.assign({}, useRegistryMethods(),
      {setGroupValue: function setGroupValue (field, value) {
        if (!equals(this.proxy[field], value, true)) {
          this.setFieldValue(field, value);
        }
      },
      removeItem: function removeItem () {
        this.$emit('remove', this.index);
      }})
  };

  function render$1(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_FormulateSlot = vue.resolveComponent("FormulateSlot");

    return (vue.openBlock(), vue.createBlock(_component_FormulateSlot, {
      name: "repeatable",
      context: $props.context,
      index: $props.index,
      "remove-item": $options.removeItem
    }, {
      default: vue.withCtx(function () { return [
        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.context.slotComponents.repeatable), vue.mergeProps({
          context: $props.context,
          index: $props.index,
          "remove-item": $options.removeItem
        }, $props.context.slotProps.repeatable), {
          default: vue.withCtx(function () { return [
            vue.createVNode(_component_FormulateSlot, {
              context: $props.context,
              index: $props.index,
              name: "default"
            }, null, 8 /* PROPS */, ["context", "index"])
          ]; }),
          _: 1 /* STABLE */
        }, 16 /* FULL_PROPS */, ["context", "index", "remove-item"]))
      ]; }),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["context", "index", "remove-item"]))
  }

  script$1.render = render$1;
  script$1.__file = "src/FormulateRepeatableProvider.vue";

  var script = {
    props: {
      index: {
        type: Number,
        default: null
      },
      context: {
        type: Object,
        required: true
      },
      removeItem: {
        type: Function,
        required: true
      }
    }
  };

  var _hoisted_1 = ["data-disabled", "textContent"];

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    return ($props.context.repeatable)
      ? (vue.openBlock(), vue.createElementBlock("a", {
          key: 0,
          class: vue.normalizeClass($props.context.classes.groupRepeatableRemove),
          "data-disabled": $props.context.model.length <= $props.context.minimum,
          role: "button",
          onClick: _cache[0] || (_cache[0] = vue.withModifiers(function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return ($props.removeItem && $props.removeItem.apply($props, args));
    }, ["prevent"])),
          onKeypress: _cache[1] || (_cache[1] = vue.withKeys(function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return ($props.removeItem && $props.removeItem.apply($props, args));
    }, ["enter"])),
          textContent: vue.toDisplayString($props.context.removeLabel)
        }, null, 42 /* CLASS, PROPS, NEED_HYDRATION */, _hoisted_1))
      : vue.createCommentVNode("v-if", true)
  }

  script.render = render;
  script.__file = "src/slots/FormulateRepeatableRemove.vue";

  /**
   * The base formulate library.
   */
  var Formulate = function Formulate () {
    this.options = {};
    this.defaults = {
      components: {
        FormulateSlot: FormulateSlot,
        FormulateForm: script$l,
        FormulateFile: script$h,
        FormulateHelp: script$i,
        FormulateLabel: script$f,
        FormulateInput: script$k,
        FormulateErrors: script$j,
        FormulateSchema: FormulateSchema,
        FormulateAddMore: script$e,
        FormulateGrouping: script$g,
        FormulateInputBox: script$d,
        FormulateInputText: script$b,
        FormulateInputFile: script$9,
        FormulateErrorList: script$c,
        FormulateRepeatable: script$8,
        FormulateInputGroup: script$7,
        FormulateInputButton: script$6,
        FormulateInputSelect: script$5,
        FormulateInputSlider: script$4,
        FormulateButtonContent: script$3,
        FormulateInputTextArea: script$2,
        FormulateRepeatableRemove: script,
        FormulateRepeatableProvider: script$1
      },
      slotComponents: {
        addMore: 'FormulateAddMore',
        buttonContent: 'FormulateButtonContent',
        errorList: 'FormulateErrorList',
        errors: 'FormulateErrors',
        file: 'FormulateFile',
        help: 'FormulateHelp',
        label: 'FormulateLabel',
        prefix: false,
        remove: 'FormulateRepeatableRemove',
        repeatable: 'FormulateRepeatable',
        suffix: false,
        uploadAreaMask: 'div'
      },
      slotProps: {},
      library: library,
      rules: rules,
      mimes: mimes,
      locale: false,
      uploader: fauxUploader,
      uploadUrl: false,
      fileUrlKey: 'url',
      uploadJustCompleteDuration: 1000,
      errorHandler: function (err) { return err; },
      plugins: [ vueFormulateI18n.en ],
      locales: {},
      failedValidation: function () { return false; },
      idPrefix: 'formulate-',
      baseClasses: function (b) { return b; },
      coreClasses: coreClasses,
      classes: {},
      useInputDecorators: true,
      validationNameStrategy: false
    };
    this.registry = new Map();
    this.idRegistry = {};
  };

  /**
   * Install vue formulate, and register it’s components.
   */
  Formulate.prototype.install = function install (Vue, options) {
      var this$1$1 = this;

    Vue.prototype.$formulate = this;
    this.options = this.defaults;
    var plugins = this.defaults.plugins;
    if (options && Array.isArray(options.plugins) && options.plugins.length) {
      plugins = plugins.concat(options.plugins);
    }
    plugins.forEach(function (plugin) { return (typeof plugin === 'function') ? plugin(this$1$1) : null; });
    this.extend(options || {});
    for (var componentName in this.options.components) {
      Vue.component(componentName, this.options.components[componentName]);
    }
  };

  /**
   * Produce a deterministically generated id based on the sequence by which it
   * was requested. This should be *theoretically* the same SSR as client side.
   * However, SSR and deterministic ids can be very challenging, so this
   * implementation is open to community review.
   */
  Formulate.prototype.nextId = function nextId (vm) {
    var path = vm.$route && vm.$route.path ? vm.$route.path : false;
    var pathPrefix = path ? vm.$route.path.replace(/[/\\.\s]/g, '-') : 'global';
    if (!Object.prototype.hasOwnProperty.call(this.idRegistry, pathPrefix)) {
      this.idRegistry[pathPrefix] = 0;
    }
    return ("" + (this.options.idPrefix) + pathPrefix + "-" + (++this.idRegistry[pathPrefix]))
  };

  /**
   * Given a set of options, apply them to the pre-existing options.
   * @param {Object} extendWith
   */
  Formulate.prototype.extend = function extend (extendWith) {
    if (typeof extendWith === 'object') {
      this.options = this.merge(this.options, extendWith);
      return this
    }
    throw new Error(("Formulate.extend expects an object, was " + (typeof extendWith)))
  };

  /**
   * Create a new object by copying properties of base and mergeWith.
   * Note: arrays don't overwrite - they push
   *
   * @param {Object} base
   * @param {Object} mergeWith
   * @param {boolean} concatArrays
   */
  Formulate.prototype.merge = function merge (base, mergeWith, concatArrays) {
      if ( concatArrays === void 0 ) concatArrays = true;

    var merged = {};
    for (var key in base) {
      if (mergeWith.hasOwnProperty(key)) {
        if (isPlainObject(mergeWith[key]) && isPlainObject(base[key])) {
          merged[key] = this.merge(base[key], mergeWith[key], concatArrays);
        } else if (concatArrays && Array.isArray(base[key]) && Array.isArray(mergeWith[key])) {
          merged[key] = base[key].concat(mergeWith[key]);
        } else {
          merged[key] = mergeWith[key];
        }
      } else {
        merged[key] = base[key];
      }
    }
    for (var prop in mergeWith) {
      if (!merged.hasOwnProperty(prop)) {
        merged[prop] = mergeWith[prop];
      }
    }
    return merged
  };

  /**
   * Determine what "class" of input this element is given the "type".
   * @param {string} type
   */
  Formulate.prototype.classify = function classify (type) {
    if (this.options.library.hasOwnProperty(type)) {
      return this.options.library[type].classification
    }
    return 'unknown'
  };

  /**
   * Generate all classes for a particular context.
   * @param {Object} context
   */
  Formulate.prototype.classes = function classes (classContext) {
      var this$1$1 = this;

    // Step 1: We get the global classes for all keys.
    var coreClasses = this.options.coreClasses(classContext);
    // Step 2: We extend those classes with a user defined baseClasses.
    var baseClasses = this.options.baseClasses(coreClasses, classContext);
    return Object.keys(baseClasses).reduce(function (classMap, key) {
        var obj;

      // Step 3: For each key, apply any global overrides for that key.
      var classesForKey = applyClasses(baseClasses[key], this$1$1.options.classes[key], classContext);
      // Step 4: Apply any prop-level overrides for that key.
      classesForKey = applyClasses(classesForKey, classContext[(key + "Class")], classContext);
      // Step 5: Add state based classes from props.
      classesForKey = applyStates(key, classesForKey, this$1$1.options.classes, classContext);
      // Now we have our final classes, assign to the given key.
      return Object.assign(classMap, ( obj = {}, obj[key] = classesForKey, obj ))
    }, {})
  };

  /**
   * Given a particular type, report any "additional" props to pass to the
   * various slots.
   * @param {string} type
   * @return {array}
   */
  Formulate.prototype.typeProps = function typeProps (type) {
    var extract = function (obj) { return Object.keys(obj).reduce(function (props, slot) {
      return Array.isArray(obj[slot]) ? props.concat(obj[slot]) : props
    }, []); };
    var props = extract(this.options.slotProps);
    return this.options.library[type]
      ? props.concat(extract(this.options.library[type].slotProps || {}))
      : props
  };

  /**
   * Given a type and a slot, get the relevant slot props object.
   * @param {string} type
   * @param {string} slot
   * @return {object}
   */
  Formulate.prototype.slotProps = function slotProps (type, slot, typeProps) {
    var props = Array.isArray(this.options.slotProps[slot]) ? this.options.slotProps[slot] : [];
    var def = this.options.library[type];
    if (def && def.slotProps && Array.isArray(def.slotProps[slot])) {
      props = props.concat(def.slotProps[slot]);
    }
    return props.reduce(function (props, prop) {
        var obj;

        return Object.assign(props, ( obj = {}, obj[prop] = typeProps[prop], obj ));
      }, {})
  };

  /**
   * Determine what type of component to render given the "type".
   * @param {string} type
   */
  Formulate.prototype.component = function component (type) {
    if (this.options.library.hasOwnProperty(type)) {
      return this.options.library[type].component
    }
    return false
  };

  /**
   * What component should be rendered for the given slot location and type.
   * @param {string} type the type of component
   * @param {string} slot the name of the slot
   */
  Formulate.prototype.slotComponent = function slotComponent (type, slot) {
    var def = this.options.library[type];
    if (def && def.slotComponents && def.slotComponents[slot]) {
      return def.slotComponents[slot]
    }
    return this.options.slotComponents[slot]
  };

  /**
   * Get validation rules by merging any passed in with global rules.
   * @return {object} object of validation functions
   */
  Formulate.prototype.rules = function rules (rules) {
      if ( rules === void 0 ) rules = {};

    return Object.assign({}, this.options.rules, rules)
  };

  /**
   * Attempt to get the vue-i18n configured locale.
   */
  Formulate.prototype.i18n = function i18n (vm) {
    if (vm.$i18n) {
      switch (typeof vm.$i18n.locale) {
        case 'string':
          return vm.$i18n.locale
        case 'function':
          return vm.$i18n.locale()
      }
    }
    return false
  };

  /**
   * Select the proper locale to use.
   */
  Formulate.prototype.getLocale = function getLocale (vm) {
      var this$1$1 = this;

    if (!this.selectedLocale) {
      this.selectedLocale = [
        this.options.locale,
        this.i18n(vm),
        'en'
      ].reduce(function (selection, locale) {
        if (selection) {
          return selection
        }
        if (locale) {
          var option = parseLocale(locale)
            .find(function (locale) { return has(this$1$1.options.locales, locale); });
          if (option) {
            selection = option;
          }
        }
        return selection
      }, false);
    }
    return this.selectedLocale
  };

  /**
   * Change the locale to a pre-registered one.
   * @param {string} localeTag
   */
  Formulate.prototype.setLocale = function setLocale (locale) {
    if (has(this.options.locales, locale)) {
      this.options.locale = locale;
      this.selectedLocale = locale;
      // Trigger validation on all forms to swap languages
      this.registry.forEach(function (form, name) {
        form.hasValidationErrors();
      });
    }
  };

  /**
   * Get the validation message for a particular error.
   */
  Formulate.prototype.validationMessage = function validationMessage (rule, validationContext, vm) {
    var generators = this.options.locales[this.getLocale(vm)];
    if (generators.hasOwnProperty(rule)) {
      return generators[rule](validationContext)
    }
    if (generators.hasOwnProperty('default')) {
      return generators.default(validationContext)
    }
    return 'Invalid field value'
  };

  /**
   * Given an instance of a FormulateForm register it.
   * @param {vm} form
   */
  Formulate.prototype.register = function register (form) {
    if (form.$options.name === 'FormulateForm' && form.name) {
      this.registry.set(form.name, form);
    }
  };

  /**
   * Given an instance of a form, remove it from the registry.
   * @param {vm} form
   */
  Formulate.prototype.deregister = function deregister (form) {
    if (
      form.$options.name === 'FormulateForm' &&
      form.name &&
      this.registry.has(form.name)
    ) {
      this.registry.delete(form.name);
    }
  };

  /**
   * Given an array, this function will attempt to make sense of the given error
   * and hydrate a form with the resulting errors.
   *
   * @param {error} err
   * @param {string} formName
   * @param {error}
   */
  Formulate.prototype.handle = function handle (err, formName, skip) {
      if ( skip === void 0 ) skip = false;

    var e = skip ? err : this.options.errorHandler(err, formName);
    if (formName && this.registry.has(formName)) {
      this.registry.get(formName).applyErrors({
        formErrors: arrayify(e.formErrors),
        inputErrors: e.inputErrors || {}
      });
    }
    return e
  };

  /**
   * Reset a form.
   * @param {string} formName
   * @param {object} initialValue
   */
  Formulate.prototype.reset = function reset (formName, initialValue) {
      if ( initialValue === void 0 ) initialValue = {};

    this.resetValidation(formName);
    this.setValues(formName, initialValue);
  };

  /**
   * Submit a named form.
   * @param {string} formName
   */
  Formulate.prototype.submit = function submit (formName) {
    var form = this.registry.get(formName);
    form.formSubmitted();
  };

  /**
   * Reset the form's validation messages.
   * @param {string} formName
   */
  Formulate.prototype.resetValidation = function resetValidation (formName) {
    var form = this.registry.get(formName);
    form.hideErrors(formName);
    form.namedErrors = [];
    form.namedFieldErrors = {};
  };

  /**
   * Set the form values.
   * @param {string} formName
   * @param {object} values
   */
  Formulate.prototype.setValues = function setValues (formName, values) {
    if (values && !Array.isArray(values) && typeof values === 'object') {
      var form = this.registry.get(formName);
      form.setValues(Object.assign({}, values));
    }
  };

  /**
   * Get the file uploader.
   */
  Formulate.prototype.getUploader = function getUploader () {
    return this.options.uploader || false
  };

  /**
   * Get the global upload url.
   */
  Formulate.prototype.getUploadUrl = function getUploadUrl () {
    return this.options.uploadUrl || false
  };

  /**
   * When re-hydrating a file uploader with an array, get the sub-object key to
   * access the url of the file. Usually this is just "url".
   */
  Formulate.prototype.getFileUrlKey = function getFileUrlKey () {
    return this.options.fileUrlKey || 'url'
  };

  /**
   * Create a new instance of an upload.
   */
  Formulate.prototype.createUpload = function createUpload (fileList, context) {
    return new FileUpload(fileList, context, this.options)
  };

  /**
   * A FormulateForm failed to submit due to existing validation errors.
   */
  Formulate.prototype.failedValidation = function failedValidation (form) {
    return this.options.failedValidation(this)
  };

  var Formulate$1 = new Formulate();

  return Formulate$1;

}));
