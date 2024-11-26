var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __restKey = (key) => typeof key === "symbol" ? key : key + "";
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import { h, resolveComponent, openBlock, createElementBlock, mergeProps, withModifiers, createBlock, toHandlers, createCommentVNode, renderSlot, normalizeProps, guardReactiveProps, normalizeClass, createElementVNode, resolveDynamicComponent, withCtx, toDisplayString, normalizeStyle, Fragment, renderList, createVNode, withDirectives, vModelRadio, vModelCheckbox, vModelDynamic, createTextVNode, vShow, vModelSelect, vModelText, withKeys } from "vue";
const fi = "FormulateInput";
const add = (n, c2) => ({
  classification: n,
  component: fi + (c2 || n[0].toUpperCase() + n.substr(1))
});
const library = __spreadProps(__spreadValues({}, [
  "text",
  "email",
  "number",
  "color",
  "date",
  "hidden",
  "month",
  "password",
  "search",
  "tel",
  "time",
  "url",
  "week",
  "datetime-local"
].reduce((lib, type) => __spreadProps(__spreadValues({}, lib), { [type]: add("text") }), {})), {
  // === SLIDER INPUTS
  range: add("slider"),
  // === MULTI LINE TEXT INPUTS
  textarea: add("textarea", "TextArea"),
  // === BOX STYLE INPUTS
  checkbox: add("box"),
  radio: add("box"),
  // === BUTTON STYLE INPUTS
  submit: add("button"),
  button: add("button"),
  // === SELECT STYLE INPUTS
  select: add("select"),
  // === FILE TYPE
  file: add("file"),
  image: add("file"),
  // === GROUP TYPE
  group: add("group")
});
function map(original, callback) {
  const obj = {};
  for (let key in original) {
    obj[key] = callback(key, original[key]);
  }
  return obj;
}
function equals(objA, objB, deep = false) {
  if (objA === objB) {
    return true;
  }
  if (!objA || !objB) {
    return false;
  }
  if (typeof objA !== "object" && typeof objB !== "object") {
    return objA === objB;
  }
  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);
  const len = aKeys.length;
  if (bKeys.length !== len) {
    return false;
  }
  for (let i2 = 0; i2 < len; i2++) {
    const key = aKeys[i2];
    if (!deep && objA[key] !== objB[key] || deep && !equals(objA[key], objB[key], deep)) {
      return false;
    }
  }
  return true;
}
function camel(string) {
  if (typeof string === "string") {
    return string.replace(/([_-][a-z0-9])/gi, ($1) => {
      if (string.indexOf($1) !== 0 && !/[_-]/.test(string[string.indexOf($1) - 1])) {
        return $1.toUpperCase().replace(/[_-]/, "");
      }
      return $1;
    });
  }
  return string;
}
function cap(str) {
  return typeof str === "string" ? str[0].toUpperCase() + str.substr(1) : str;
}
function arrayify(item) {
  if (!item) {
    return [];
  }
  if (typeof item === "string") {
    return [item];
  }
  if (Array.isArray(item)) {
    return item;
  }
  if (typeof item === "object") {
    return Object.values(item);
  }
  return [];
}
function parseRules(validation, rules2) {
  if (typeof validation === "string") {
    return parseRules(validation.split("|"), rules2);
  }
  if (!Array.isArray(validation)) {
    return [];
  }
  return validation.map((rule) => parseRule(rule, rules2)).filter((f) => !!f);
}
function parseRule(rule, rules2) {
  if (typeof rule === "function") {
    return [rule, []];
  }
  if (Array.isArray(rule) && rule.length) {
    rule = rule.map((r) => r);
    const [ruleName, modifier] = parseModifier(rule.shift());
    if (typeof ruleName === "string" && Object.hasOwn(rules2, ruleName)) {
      return [rules2[ruleName], rule, ruleName, modifier];
    }
    if (typeof ruleName === "function") {
      return [ruleName, rule, ruleName, modifier];
    }
  }
  if (typeof rule === "string" && rule) {
    const segments = rule.split(":");
    const [ruleName, modifier] = parseModifier(segments.shift());
    if (Object.hasOwn(rules2, ruleName)) {
      return [
        rules2[ruleName],
        segments.length ? segments.join(":").split(",") : [],
        ruleName,
        modifier
      ];
    } else {
      throw new Error(`Unknown validation rule ${rule}`);
    }
  }
  return false;
}
function parseModifier(ruleName) {
  if (/^[\^]/.test(ruleName.charAt(0))) {
    return [camel(ruleName.substr(1)), ruleName.charAt(0)];
  }
  return [camel(ruleName), null];
}
function groupBails(rules2) {
  const groups = [];
  const bailIndex = rules2.findIndex(
    ([, , rule]) => rule.toLowerCase() === "bail"
  );
  const optionalIndex = rules2.findIndex(
    ([, , rule]) => rule.toLowerCase() === "optional"
  );
  if (optionalIndex >= 0) {
    const rule = rules2.splice(optionalIndex, 1);
    groups.push(Object.defineProperty(rule, "bail", { value: true }));
  }
  if (bailIndex >= 0) {
    const preBail = rules2.splice(0, bailIndex + 1).slice(0, -1);
    preBail.length && groups.push(preBail);
    rules2.map(
      (rule) => groups.push(Object.defineProperty([rule], "bail", { value: true }))
    );
  } else {
    groups.push(rules2);
  }
  return groups.reduce((groups2, group) => {
    const splitByMod = (group2, bailGroup = false) => {
      if (group2.length < 2) {
        return Object.defineProperty([group2], "bail", { value: bailGroup });
      }
      const splits = [];
      const modIndex = group2.findIndex(([, , , modifier]) => modifier === "^");
      if (modIndex >= 0) {
        const preMod = group2.splice(0, modIndex);
        preMod.length && splits.push(...splitByMod(preMod, bailGroup));
        splits.push(
          Object.defineProperty([group2.shift()], "bail", { value: true })
        );
        group2.length && splits.push(...splitByMod(group2, bailGroup));
      } else {
        splits.push(group2);
      }
      return splits;
    };
    return groups2.concat(splitByMod(group));
  }, []);
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function regexForFormat(format) {
  let escaped = `^${escapeRegExp(format)}$`;
  const formats = {
    MM: "(0[1-9]|1[012])",
    M: "([1-9]|1[012])",
    DD: "([012][0-9]|3[01])",
    D: "([012]?[0-9]|3[01])",
    YYYY: "\\d{4}",
    YY: "\\d{2}"
  };
  return new RegExp(
    Object.keys(formats).reduce((regex, format2) => {
      return regex.replace(format2, formats[format2]);
    }, escaped)
  );
}
function parseLocale(locale) {
  const segments = locale.split("-");
  return segments.reduce((options, segment) => {
    if (options.length) {
      options.unshift(`${options[0]}-${segment}`);
    }
    return options.length ? options : [segment];
  }, []);
}
function has(ctx, prop) {
  return Object.prototype.hasOwnProperty.call(ctx, prop);
}
function setId(o, id) {
  if (!has(o, "__id") || id) {
    return Object.defineProperty(
      o,
      "__id",
      Object.assign(/* @__PURE__ */ Object.create(null), { value: id || token(9) })
    );
  }
  return o;
}
function isEmpty(value) {
  if (typeof value === "number") {
    return false;
  }
  return value === void 0 || value === "" || value === null || value === false || Array.isArray(value) && !value.some((v2) => !isEmpty(v2)) || value && !Array.isArray(value) && typeof value === "object" && isEmpty(Object.values(value));
}
function extractAttributes(obj, keys) {
  return Object.keys(obj).reduce((props, key) => {
    const propKey = camel(key);
    if (keys.includes(propKey)) {
      props[propKey] = obj[key];
    }
    return props;
  }, {});
}
function cyrb43(str, seed = 0) {
  let h1 = 3735928559 ^ seed;
  let h2 = 1103547991 ^ seed;
  for (let i2 = 0, ch; i2 < str.length; i2++) {
    ch = str.charCodeAt(i2);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
function createDebouncer() {
  let timeout;
  return function debounceFn(fn, args, delay) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => fn.call(this, ...args), delay);
  };
}
function token(length = 13) {
  return Math.random().toString(36).substring(2, length + 2);
}
const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
const localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/;
const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;
function isUrl(string) {
  if (typeof string !== "string") {
    return false;
  }
  const match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }
  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }
  if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }
  return false;
}
class FileUpload {
  /**
   * Create a file upload object.
   * @param {FileList} input
   * @param {object} context
   * @param {object} globalOptions
   */
  constructor(input, context2, globalOptions = {}) {
    this.input = input;
    this.fileList = input.files;
    this.files = [];
    this.options = __spreadValues(__spreadValues({}, { mimes: {} }), globalOptions);
    this.results = false;
    this.context = context2;
    this.dataTransferCheck();
    if (context2 && context2.uploadUrl) {
      this.options.uploadUrl = context2.uploadUrl;
    }
    this.uploadPromise = null;
    if (Array.isArray(this.fileList)) {
      this.rehydrateFileList(this.fileList);
    } else {
      this.addFileList(this.fileList);
    }
  }
  /**
   * Given a pre-existing array of files, create a faux FileList.
   * @param {Array} items expects an array of objects [{ url: '/uploads/file.pdf' }]   
   */
  rehydrateFileList(items) {
    const fauxFileList = items.reduce((fileList, item) => {
      const key = this.options ? this.options.fileUrlKey : "url";
      const url = item[key];
      const ext = url && url.includes(".") ? url.substr(url.lastIndexOf(".") + 1) : false;
      const mime = this.options.mimes[ext] || false;
      fileList.push(
        Object.assign(
          {},
          item,
          url ? {
            name: item.name || url.substr(url.lastIndexOf("/") + 1 || 0),
            type: item.type ? item.type : mime,
            previewData: url
          } : {}
        )
      );
      return fileList;
    }, []);
    this.addFileList(fauxFileList);
    this.results = this.mapUUID(items);
  }
  /**
   * Produce an array of files and alert the callback.
   * @param {FileList} fileList
   */
  addFileList(fileList) {
    for (let i2 = 0; i2 < fileList.length; i2++) {
      const file = fileList[i2];
      const uuid = token();
      const removeFile = function() {
        this.removeFile(uuid);
      };
      this.files.push({
        progress: false,
        error: false,
        complete: false,
        justFinished: false,
        name: file.name || "file-upload",
        file,
        uuid,
        path: false,
        removeFile: removeFile.bind(this),
        previewData: file.previewData || false
      });
    }
  }
  /**
   * Check if the file has an.
   */
  hasUploader() {
    return !!this.context.uploader;
  }
  /**
   * Check if the given uploader is axios instance. This isn't a great way of
   * testing if it is or not, but AFIK there isn't a better way right now:
   *
   * https://github.com/axios/axios/issues/737
   */
  uploaderIsAxios() {
    if (this.hasUploader() && typeof this.context.uploader.request === "function" && typeof this.context.uploader.get === "function" && typeof this.context.uploader.delete === "function" && typeof this.context.uploader.post === "function") {
      return true;
    }
    return false;
  }
  /**
   * Get a new uploader function.
   */
  getUploader(...args) {
    if (this.uploaderIsAxios()) {
      const formData = new FormData();
      formData.append(this.context.name || "file", args[0]);
      if (this.context.uploadUrl === false) {
        throw new Error(
          "No uploadURL specified: https://vueformulate.com/guide/inputs/file/#props"
        );
      }
      return this.context.uploader.post(this.context.uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          args[1](
            Math.round(progressEvent.loaded * 100 / progressEvent.total)
          );
        }
      }).then((res) => res.data).catch((err) => args[2](err));
    }
    return this.context.uploader(...args);
  }
  /**
   * Perform the file upload.
   */
  upload() {
    this.uploadPromise = this.uploadPromise ? this.uploadPromise.then(() => this.__performUpload()) : this.__performUpload();
    return this.uploadPromise;
  }
  /**
   * Perform the actual upload event. Intended to be a private method that is
   * only called through the upload() function as chaining utility.
   */
  __performUpload() {
    return new Promise((resolve, reject) => {
      if (!this.hasUploader()) {
        return reject(new Error("No uploader has been defined"));
      }
      Promise.all(
        this.files.map((file) => {
          file.error = false;
          file.complete = !!file.path;
          return file.path ? Promise.resolve(file.path) : this.getUploader(
            file.file,
            (progress) => {
              file.progress = progress;
              this.context.rootEmit("file-upload-progress", progress);
              if (progress >= 100) {
                if (!file.complete) {
                  file.justFinished = true;
                  setTimeout(() => {
                    file.justFinished = false;
                  }, this.options.uploadJustCompleteDuration);
                }
                file.complete = true;
                this.context.rootEmit("file-upload-complete", file);
              }
            },
            (error) => {
              file.progress = 0;
              file.error = error;
              file.complete = true;
              this.context.rootEmit("file-upload-error", error);
              reject(error);
            },
            this.options
          );
        })
      ).then((results) => {
        this.results = this.mapUUID(results);
        resolve(results);
      }).catch((err) => {
        throw new Error(err);
      });
    });
  }
  /**
   * Remove a file from the uploader (and the file list)
   * @param {string} uuid
   */
  removeFile(uuid) {
    const originalLength = this.files.length;
    this.files = this.files.filter((file) => file && file.uuid !== uuid);
    if (Array.isArray(this.results)) {
      this.results = this.results.filter((file) => file && file.__id !== uuid);
    }
    this.context.performValidation();
    if (window && this.fileList instanceof FileList && this.supportsDataTransfers) {
      const transfer = new DataTransfer();
      this.files.forEach((file) => transfer.items.add(file.file));
      this.fileList = transfer.files;
      this.input.files = this.fileList;
    } else {
      this.fileList = this.fileList.filter(
        (file) => file && file.__id !== uuid
      );
    }
    if (originalLength > this.files.length) {
      this.context.rootEmit("file-removed", this.files);
    }
  }
  /**
   * Given another input element, add the files from that FileList to the
   * input being represented by this FileUpload.
   *
   * @param {HTMLElement} input
   */
  mergeFileList(input) {
    this.addFileList(input.files);
    if (this.supportsDataTransfers) {
      const transfer = new DataTransfer();
      this.files.forEach((file) => {
        if (file.file instanceof File) {
          transfer.items.add(file.file);
        }
      });
      this.fileList = transfer.files;
      this.input.files = this.fileList;
      input.files = new DataTransfer().files;
    }
    this.context.performValidation();
    this.loadPreviews();
    if (this.context.uploadBehavior !== "delayed") {
      this.upload();
    }
  }
  /**
   * load image previews for all uploads.
   */
  loadPreviews() {
    this.files.map((file) => {
      if (!file.previewData && window && window.FileReader && /^image\//.test(file.file.type)) {
        const reader = new FileReader();
        reader.onload = (e2) => Object.assign(file, { previewData: e2.target.result });
        reader.readAsDataURL(file.file);
      }
    });
  }
  /**
   * Check if the current browser supports the DataTransfer constructor.
   */
  dataTransferCheck() {
    try {
      new DataTransfer();
      this.supportsDataTransfers = true;
    } catch (e2) {
      this.supportsDataTransfers = false;
    }
  }
  /**
   * Get the files.
   */
  getFiles() {
    return this.files;
  }
  /**
   * Run setId on each item of a pre-existing array of items.
   * @param {Array} items expects an array of objects [{ url: '/uploads/file.pdf' }]
   */
  mapUUID(items) {
    return items.map((result, index) => {
      this.files[index].path = result !== void 0 ? result : false;
      return result && setId(result, this.files[index].uuid);
    });
  }
  toString() {
    const descriptor = this.files.length ? this.files.length + " files" : "empty";
    return this.results ? JSON.stringify(this.results, null, "  ") : `FileUpload(${descriptor})`;
  }
}
const rules = {
  /**
   * Rule: the value must be "yes", "on", "1", or true
   */
  accepted: function({ value }) {
    return Promise.resolve(["yes", "on", "1", 1, true, "true"].includes(value));
  },
  /**
   * Rule: checks if a value is after a given date. Defaults to current time
   */
  after: function({ value }, compare = false) {
    const timestamp = Date.parse(compare || /* @__PURE__ */ new Date());
    const fieldValue = Date.parse(value);
    return Promise.resolve(Number.isNaN(fieldValue) ? false : fieldValue > timestamp);
  },
  /**
   * Rule: checks if the value is only alpha
   */
  alpha: function({ value }, set = "default") {
    const sets = {
      // eslint-disable-next-line regexp/no-obscure-range
      default: /^[a-zA-ZÀ-ÖØ-öø-ÿĄąĆćĘęŁłŃńŚśŹźŻż]+$/,
      latin: /^[a-z]+$/i
    };
    const selectedSet = Object.prototype.hasOwnProperty.call(sets, set) ? set : "default";
    return Promise.resolve(sets[selectedSet].test(value));
  },
  /**
   * Rule: checks if the value is alpha numeric
   */
  alphanumeric: function({ value }, set = "default") {
    const sets = {
      // eslint-disable-next-line regexp/no-obscure-range
      default: /^[a-zA-Z0-9À-ÖØ-öø-ÿĄąĆćĘęŁłŃńŚśŹźŻż]+$/,
      latin: /^[a-z0-9]+$/i
    };
    const selectedSet = Object.prototype.hasOwnProperty.call(sets, set) ? set : "default";
    return Promise.resolve(sets[selectedSet].test(value));
  },
  /**
   * Rule: checks if a value is after a given date. Defaults to current time
   */
  before: function({ value }, compare = false) {
    const timestamp = Date.parse(compare || /* @__PURE__ */ new Date());
    const fieldValue = Date.parse(value);
    return Promise.resolve(Number.isNaN(fieldValue) ? false : fieldValue < timestamp);
  },
  /**
   * Rule: checks if the value is between two other values
   */
  between: function({ value }, from = 0, to = 10, force) {
    return Promise.resolve((() => {
      if (from === null || to === null || Number.isNaN(from) || Number.isNaN(to)) {
        return false;
      }
      if (!Number.isNaN(value) && force !== "length" || force === "value") {
        value = Number(value);
        from = Number(from);
        to = Number(to);
        return value > from && value < to;
      }
      if (typeof value === "string" || force === "length") {
        value = !Number.isNaN(value) ? value.toString() : value;
        return value.length > from && value.length < to;
      }
      return false;
    })());
  },
  /**
   * Confirm that the value of one field is the same as another, mostly used
   * for password confirmations.
   */
  confirm: function({ value, getGroupValues, name }, field) {
    return Promise.resolve((() => {
      const values = getGroupValues();
      var confirmationFieldName = field;
      if (!confirmationFieldName) {
        confirmationFieldName = name.endsWith("_confirm") ? name.substr(0, name.length - 8) : `${name}_confirm`;
      }
      return values[confirmationFieldName] === value;
    })());
  },
  /**
   * Rule: ensures the value is a date according to Date.parse(), or a format
   * regex.
   */
  date: function({ value }, format = false) {
    return Promise.resolve((() => {
      if (format && typeof format === "string") {
        return regexForFormat(format).test(value);
      }
      return !Number.isNaN(Date.parse(value));
    })());
  },
  /**
   * Rule: tests
   */
  email: function({ value }) {
    const isEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return Promise.resolve(isEmail.test(value));
  },
  /**
   * Rule: Value ends with one of the given Strings
   */
  endsWith: function({ value }, ...stack) {
    return Promise.resolve((() => {
      if (typeof value === "string" && stack.length) {
        return stack.find((item) => {
          return value.endsWith(item);
        }) !== void 0;
      } else if (typeof value === "string" && stack.length === 0) {
        return true;
      }
      return false;
    })());
  },
  /**
   * Rule: Value is in an array (stack).
   */
  in: function({ value }, ...stack) {
    return Promise.resolve(stack.find((item) => {
      if (typeof item === "object") {
        return equals(item, value);
      }
      return item === value;
    }) !== void 0);
  },
  /**
   * Rule: Match the value against a (stack) of patterns or strings
   */
  matches: function({ value }, ...stack) {
    return Promise.resolve(!!stack.find((pattern) => {
      if (typeof pattern === "string" && pattern.substr(0, 1) === "/" && pattern.substr(-1) === "/") {
        pattern = new RegExp(pattern.substr(1, pattern.length - 2));
      }
      if (pattern instanceof RegExp) {
        return pattern.test(value);
      }
      return pattern === value;
    }));
  },
  /**
   * Check the file type is correct.
   */
  mime: function({ value }, ...types) {
    return Promise.resolve((() => {
      if (value instanceof FileUpload) {
        const fileList = value.getFiles();
        for (let i2 = 0; i2 < fileList.length; i2++) {
          const file = fileList[i2].file;
          if (!types.includes(file.type)) {
            return false;
          }
        }
      }
      return true;
    })());
  },
  /**
   * Check the minimum value of a particular.
   */
  min: function({ value }, minimum = 1, force) {
    return Promise.resolve((() => {
      if (Array.isArray(value)) {
        minimum = !Number.isNaN(minimum) ? Number(minimum) : minimum;
        return value.length >= minimum;
      }
      if (!Number.isNaN(value) && force !== "length" || force === "value") {
        value = !Number.isNaN(value) ? Number(value) : value;
        return value >= minimum;
      }
      if (typeof value === "string" || force === "length") {
        value = !Number.isNaN(value) ? value.toString() : value;
        return value.length >= minimum;
      }
      return false;
    })());
  },
  /**
   * Check the maximum value of a particular.
   */
  max: function({ value }, maximum = 10, force) {
    return Promise.resolve((() => {
      if (Array.isArray(value)) {
        maximum = !Number.isNaN(maximum) ? Number(maximum) : maximum;
        return value.length <= maximum;
      }
      if (!Number.isNaN(value) && force !== "length" || force === "value") {
        value = !Number.isNaN(value) ? Number(value) : value;
        return value <= maximum;
      }
      if (typeof value === "string" || force === "length") {
        value = !Number.isNaN(value) ? value.toString() : value;
        return value.length <= maximum;
      }
      return false;
    })());
  },
  /**
   * Rule: Value is not in stack.
   */
  not: function({ value }, ...stack) {
    return Promise.resolve(stack.find((item) => {
      if (typeof item === "object") {
        return equals(item, value);
      }
      return item === value;
    }) === void 0);
  },
  /**
   * Rule: checks if the value is only alpha numeric
   */
  number: function({ value }) {
    return Promise.resolve(!Number.isNaN(value));
  },
  /**
   * Rule: must be a value - allows for an optional argument "whitespace" with a possible value 'trim' and default 'pre'.
   */
  required: function({ value }, whitespace = "pre") {
    return Promise.resolve((() => {
      if (Array.isArray(value)) {
        return !!value.length;
      }
      if (value instanceof FileUpload) {
        return value.getFiles().length > 0;
      }
      if (typeof value === "string") {
        return whitespace === "trim" ? !!value.trim() : !!value;
      }
      if (typeof value === "object") {
        return !value ? false : !!Object.keys(value).length;
      }
      return true;
    })());
  },
  /**
   * Rule: Value starts with one of the given Strings
   */
  startsWith: function({ value }, ...stack) {
    return Promise.resolve((() => {
      if (typeof value === "string" && stack.length) {
        return stack.find((item) => {
          return value.startsWith(item);
        }) !== void 0;
      } else if (typeof value === "string" && stack.length === 0) {
        return true;
      }
      return false;
    })());
  },
  /**
   * Rule: checks if a string is a valid url
   */
  url: function({ value }) {
    return Promise.resolve(isUrl(value));
  },
  /**
   * Rule: not a true rule — more like a compiler flag.
   */
  bail: function() {
    return Promise.resolve(true);
  },
  /**
   * Rule: not a true rule - more like a compiler flag.
   */
  optional: function({ value }) {
    return Promise.resolve(!isEmpty(value));
  }
};
const i = "image/";
const mimes = {
  "csv": "text/csv",
  "gif": i + "gif",
  "jpg": i + "jpeg",
  "jpeg": i + "jpeg",
  "png": i + "png",
  "pdf": "application/pdf",
  "svg": i + "svg+xml"
};
const classKeys = [
  // Globals
  "outer",
  "wrapper",
  "label",
  "element",
  "input",
  "help",
  "errors",
  "error",
  // Box
  "decorator",
  // Slider
  "rangeValue",
  // File
  "uploadArea",
  "uploadAreaMask",
  "files",
  "file",
  "fileName",
  "fileAdd",
  "fileAddInput",
  "fileRemove",
  "fileProgress",
  "fileUploadError",
  "fileImagePreview",
  "fileImagePreviewImage",
  "fileProgressInner",
  // Groups
  "grouping",
  "groupRepeatable",
  "groupRepeatableRemove",
  "groupAddMore",
  // Forms
  "form",
  "formErrors",
  "formError"
];
const states = {
  hasErrors: (c2) => c2.hasErrors,
  hasValue: (c2) => c2.hasValue,
  isValid: (c2) => c2.isValid
};
const classGenerator = (classKey, context2) => {
  const key = classKey.replace(/[A-Z]/g, (c2) => "-" + c2.toLowerCase());
  const prefix = ["form", "file"].includes(key.substr(0, 4)) ? "" : "-input";
  const element = ["decorator", "range-value"].includes(key) ? "-element" : "";
  const base = `formulate${prefix}${element}${key !== "outer" ? `-${key}` : ""}`;
  return key === "input" ? [] : [base].concat(classModifiers(base, classKey, context2));
};
const classModifiers = (base, classKey, context2) => {
  const modifiers = [];
  switch (classKey) {
    case "label":
      modifiers.push(`${base}--${context2.labelPosition}`);
      break;
    case "element":
      const type = context2.classification === "group" ? "group" : context2.type;
      modifiers.push(`${base}--${type}`);
      if (type === "group") {
        modifiers.push("formulate-input-group");
      }
      break;
    case "help":
      modifiers.push(`${base}--${context2.helpPosition}`);
      break;
    case "form":
      if (context2.name) {
        modifiers.push(`${base}--${context2.name}`);
      }
  }
  return modifiers;
};
const classProps = (() => {
  const stateKeys = [""].concat(Object.keys(states).map((s) => cap(s)));
  return classKeys.reduce((props, classKey) => {
    return props.concat(
      stateKeys.reduce((keys, stateKey) => {
        keys.push(`${classKey}${stateKey}Class`);
        return keys;
      }, [])
    );
  }, []);
})();
function applyClasses(baseClass, modifier, context2) {
  switch (typeof modifier) {
    case "string":
      return modifier;
    case "function":
      return modifier(context2, arrayify(baseClass));
    case "object":
      if (Array.isArray(modifier)) {
        return arrayify(baseClass).concat(modifier);
      }
    default:
      return baseClass;
  }
}
function applyStates(elementKey, baseClass, globals, context2) {
  return Object.keys(states).reduce((classes2, stateKey) => {
    if (states[stateKey](context2)) {
      const key = `${elementKey}${cap(stateKey)}`;
      const propKey = `${key}Class`;
      if (globals[key]) {
        const modifier = typeof globals[key] === "string" ? arrayify(globals[key]) : globals[key];
        classes2 = applyClasses(classes2, modifier, context2);
      }
      if (context2[propKey]) {
        const modifier = typeof context2[propKey] === "string" ? arrayify(context2[propKey]) : context2[`${key}Class`];
        classes2 = applyClasses(classes2, modifier, context2);
      }
    }
    return classes2;
  }, baseClass);
}
function coreClasses(context2) {
  return classKeys.reduce(
    (classes2, classKey) => Object.assign(classes2, {
      [classKey]: classGenerator(classKey, context2)
    }),
    {}
  );
}
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainObject(o) {
  var ctor, prot;
  if (isObject(o) === false) return false;
  ctor = o.constructor;
  if (ctor === void 0) return true;
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function e(e2) {
  return "string" == typeof e2 ? e2[0].toUpperCase() + e2.substr(1) : e2;
}
var v = { accepted: function(e2) {
  return "Please accept the " + e2.name + ".";
}, after: function(r) {
  var n = r.name, a = r.args;
  return Array.isArray(a) && a.length ? e(n) + " must be after " + a[0] + "." : e(n) + " must be a later date.";
}, alpha: function(r) {
  return e(r.name) + " can only contain alphabetical characters.";
}, alphanumeric: function(r) {
  return e(r.name) + " can only contain letters and numbers.";
}, before: function(r) {
  var n = r.name, a = r.args;
  return Array.isArray(a) && a.length ? e(n) + " must be before " + a[0] + "." : e(n) + " must be an earlier date.";
}, between: function(r) {
  var n = r.name, a = r.value, t = r.args, i2 = !(!Array.isArray(t) || !t[2]) && t[2];
  return !isNaN(a) && "length" !== i2 || "value" === i2 ? e(n) + " must be between " + t[0] + " and " + t[1] + "." : e(n) + " must be between " + t[0] + " and " + t[1] + " characters long.";
}, confirm: function(r) {
  var n = r.name;
  r.args;
  return e(n) + " does not match.";
}, date: function(r) {
  var n = r.name, a = r.args;
  return Array.isArray(a) && a.length ? e(n) + " is not a valid date, please use the format " + a[0] : e(n) + " is not a valid date.";
}, default: function(e2) {
  e2.name;
  return "This field isn’t valid.";
}, email: function(e2) {
  e2.name;
  var r = e2.value;
  return r ? "“" + r + "” is not a valid email address." : "Please enter a valid email address.";
}, endsWith: function(e2) {
  e2.name;
  var r = e2.value;
  return r ? "“" + r + "” doesn’t end with a valid value." : "This field doesn’t end with a valid value.";
}, in: function(r) {
  var n = r.name, a = r.value;
  return "string" == typeof a && a ? "“" + e(a) + "” is not an allowed " + n + "." : "This is not an allowed " + n + ".";
}, matches: function(r) {
  return e(r.name) + " is not an allowed value.";
}, max: function(r) {
  var n = r.name, a = r.value, t = r.args;
  if (Array.isArray(a)) return "You may only select " + t[0] + " " + n + ".";
  var i2 = !(!Array.isArray(t) || !t[1]) && t[1];
  return !isNaN(a) && "length" !== i2 || "value" === i2 ? e(n) + " must be less than or equal to " + t[0] + "." : e(n) + " must be less than or equal to " + t[0] + " characters long.";
}, mime: function(r) {
  var n = r.name, a = r.args;
  return e(n) + " must be of the type: " + (a[0] || "No file formats allowed.");
}, min: function(r) {
  var n = r.name, a = r.value, t = r.args;
  if (Array.isArray(a)) return "You need at least " + t[0] + " " + n + ".";
  var i2 = !(!Array.isArray(t) || !t[1]) && t[1];
  return !isNaN(a) && "length" !== i2 || "value" === i2 ? e(n) + " must be at least " + t[0] + "." : e(n) + " must be at least " + t[0] + " characters long.";
}, not: function(e2) {
  var r = e2.name;
  return "“" + e2.value + "” is not an allowed " + r + ".";
}, number: function(r) {
  return e(r.name) + " must be a number.";
}, required: function(r) {
  return e(r.name) + " is required.";
}, startsWith: function(e2) {
  e2.name;
  var r = e2.value;
  return r ? "“" + r + "” doesn’t start with a valid value." : "This field doesn’t start with a valid value.";
}, url: function(e2) {
  e2.name;
  return "Please include a valid url.";
} };
function c(e2) {
  var r;
  e2.extend({ locales: (r = {}, r.en = v, r) });
}
function fauxUploader(file, progress, error, options) {
  return new Promise((resolve, reject) => {
    const totalTime = (options.fauxUploaderDuration || 1500) * (0.5 + Math.random());
    const start = performance.now();
    const advance = () => setTimeout(() => {
      const elapsed = performance.now() - start;
      const currentProgress = Math.min(100, Math.round(elapsed / totalTime * 100));
      progress(currentProgress);
      if (currentProgress >= 100) {
        return resolve({
          url: "http://via.placeholder.com/350x150.png",
          name: file.name
        });
      } else {
        advance();
      }
    }, 20);
    advance();
  });
}
const FormulateSlot = {
  inheritAttrs: false,
  functional: true,
  props: {
    name: {
      type: String,
      required: true
    },
    forceWrap: {
      type: Boolean,
      default: false
    },
    context: {
      type: Object,
      default: () => ({})
    }
  },
  render() {
    var p = this.$parent;
    const _a = this.$props, { name, forceWrap, context: context2 } = _a, mergeWithContext = __objRest(_a, ["name", "forceWrap", "context"]);
    while (p && p.$options.name !== "FormulateInput") {
      p = p.$parent;
    }
    if (!p) {
      return null;
    }
    if (p.$slots && p.$slots[name]) {
      return p.$slots[name](__spreadValues(__spreadValues({}, context2), mergeWithContext));
    }
    if (Array.isArray(this.$slots.default()) && (this.$slots.default().length > 1 || forceWrap && this.$slots.default().length > 0)) {
      const _b = this.$attrs, { name: name2, context: context3 } = _b, attrs2 = __objRest(_b, ["name", "context"]);
      return h("div", __spreadValues(__spreadValues({}, this.$attrs), attrs2), this.$slots.default());
    } else if (Array.isArray(this.$slots.default()) && this.$slots.default().length === 1) {
      return this.$slots.default()[0];
    }
    return null;
  }
};
function leaf(item, index = 0, rootListeners = {}) {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    let _a = item, { children = null, component = "FormulateInput", depth = 1, key = null } = _a, attrs2 = __objRest(_a, ["children", "component", "depth", "key"]);
    const cls = attrs2.class || {};
    delete attrs2.class;
    const on = {};
    const events = Object.keys(attrs2).reduce((events2, key2) => key2.startsWith("@") ? Object.assign(events2, { [key2.substr(1)]: attrs2[key2] }) : events2, {});
    Object.keys(events).forEach((event2) => {
      delete attrs2[`@${event2}`];
      on[event2] = createListener(event2, events[event2], rootListeners);
    });
    const type = component === "FormulateInput" ? attrs2.type || "text" : component;
    const name = attrs2.name || type || "el";
    if (!key) {
      if (attrs2.id) {
        key = attrs2.id;
      } else if (component !== "FormulateInput" && typeof children === "string") {
        key = `${type}-${cyrb43(children)}`;
      } else {
        key = `${type}-${name}-${depth}${attrs2.name ? "" : "-" + index}`;
      }
    }
    const els = Array.isArray(children) ? children.map((child) => Object.assign(child, { depth: depth + 1 })) : children;
    return Object.assign({ key, depth, attrs: attrs2, component, class: cls, on }, els ? { children: els } : {});
  }
  return null;
}
function tree(h2, schema, rootListeners) {
  if (Array.isArray(schema)) {
    return schema.map((el, index) => {
      const item = leaf(el, index, rootListeners);
      return h2(
        item.component,
        { attrs: item.attrs, class: item.class, key: item.key, on: item.on },
        item.children ? tree(h2, item.children, rootListeners) : null
      );
    });
  }
  return schema;
}
function createListener(eventName, handler, rootListeners) {
  return function(...args) {
    if (typeof handler === "function") {
      return handler.call(this, ...args);
    }
    if (typeof handler === "string" && has(rootListeners, handler)) {
      return rootListeners[handler].call(this, ...args);
    }
    if (has(rootListeners, eventName)) {
      return rootListeners[eventName].call(this, ...args);
    }
  };
}
const FormulateSchema = {
  functional: true,
  render: (h2, { props, listeners }) => tree(h2, props.schema, listeners)
};
class Registry {
  /**
   * Create a new registry of components.
   * @param {vm} ctx The host vm context of the registry.
   */
  constructor(ctx) {
    this.registry = /* @__PURE__ */ new Map();
    this.errors = {};
    this.ctx = ctx;
  }
  /**
   * Add an item to the registry.
   * @param {string | Array} name
   * @param {vue} component
   */
  add(name, component) {
    this.registry.set(name, component);
    this.errors = __spreadProps(__spreadValues({}, this.errors), { [name]: component.getErrorObject().hasErrors });
    return this;
  }
  /**
   * Remove an item from the registry.
   * @param {string} name
   */
  remove(name) {
    this.ctx.deps.delete(this.registry.get(name));
    this.ctx.deps.forEach((dependents) => dependents.delete(name));
    let keepData = this.ctx.keepModelData;
    if (!keepData && this.registry.has(name) && this.registry.get(name).keepModelData !== "inherit") {
      keepData = this.registry.get(name).keepModelData;
    }
    if (this.ctx.preventCleanup) {
      keepData = true;
    }
    this.registry.delete(name);
    const _a = this.errors, { [name]: trash } = _a, errorValues = __objRest(_a, [__restKey(name)]);
    this.errors = errorValues;
    if (!keepData) {
      const _b = this.ctx.proxy, { [name]: value } = _b, newProxy = __objRest(_b, [__restKey(name)]);
      if (this.ctx.uuid) {
        setId(newProxy, this.ctx.uuid);
      }
      this.ctx.proxy = newProxy;
      this.ctx.$emit("input", this.ctx.proxy);
    }
    return this;
  }
  /**
   * Check if the registry has the given key.
   * @param {string | Array} key
   */
  has(key) {
    return this.registry.has(key);
  }
  /**
   * Get a particular registry value.
   * @param {string} key
   */
  get(key) {
    return this.registry.get(key);
  }
  /**
   * Map over the registry (recursively).
   * @param {Function} callback
   */
  map(callback) {
    const value = {};
    this.registry.forEach((component, field) => Object.assign(value, { [field]: callback(component, field) }));
    return value;
  }
  /**
   * Return the keys of the registry.
   */
  keys() {
    return Array.from(this.registry.keys());
  }
  /**
   * Fully register a component.
   * @param {string} field name of the field.
   * @param {vm} component the actual component instance.
   */
  register(field, component) {
    if (has(component.$props, "ignored")) {
      return false;
    }
    if (this.registry.has(field)) {
      this.ctx.$nextTick(() => !this.registry.has(field) ? this.register(field, component) : false);
      return false;
    }
    this.add(field, component);
    const hasVModelValue = has(component.$props, "formulateValue");
    const hasValue2 = has(component.$props, "value");
    const debounceDelay = this.ctx.debounce || this.ctx.debounceDelay || this.ctx.context && this.ctx.context.debounceDelay;
    if (debounceDelay && !has(component.$props, "debounce")) {
      component.debounceDelay = debounceDelay;
    }
    if (!hasVModelValue && this.ctx.hasInitialValue && !isEmpty(this.ctx.initialValues[field])) {
      component.context.model = this.ctx.initialValues[field];
    } else if ((hasVModelValue || hasValue2) && !equals(component.proxy, this.ctx.initialValues[field], true)) {
      this.ctx.setFieldValue(field, component.proxy);
    }
    if (this.childrenShouldShowErrors) {
      component.formShouldShowErrors = true;
    }
  }
  /**
   * Reduce the registry.
   * @param {Function} callback
   */
  reduce(callback, accumulator) {
    this.registry.forEach((component, field) => {
      accumulator = callback(accumulator, component, field);
    });
    return accumulator;
  }
  /**
   * Data props to expose.
   */
  dataProps() {
    return {
      proxy: {},
      registry: this,
      register: this.register.bind(this),
      deregister: (field) => this.remove(field),
      childrenShouldShowErrors: false,
      errorObservers: [],
      deps: /* @__PURE__ */ new Map(),
      preventCleanup: false
    };
  }
}
function useRegistry(contextComponent) {
  const registry = new Registry(contextComponent);
  return registry.dataProps();
}
function useRegistryComputed(options = {}) {
  return {
    hasInitialValue() {
      return this.formulateValue && typeof this.formulateValue === "object" || this.values && typeof this.values === "object" || this.isGrouping && typeof this.context.model[this.index] === "object";
    },
    isVmodeled() {
      const hasFormulateValue = Object.prototype.hasOwnProperty.call(this.$props, "formulateValue");
      const handlesInputEvent = this.$attrs && (typeof this.$attrs["onInput"] === "function" || typeof this.$attrs["onUpdate:modelValue"] === "function");
      return !!(hasFormulateValue && handlesInputEvent);
    },
    initialValues() {
      if (has(this.$props, "formulateValue") && typeof this.formulateValue === "object") {
        return __spreadValues({}, this.formulateValue);
      } else if (has(this.$props, "values") && typeof this.values === "object") {
        return __spreadValues({}, this.values);
      } else if (this.isGrouping && typeof this.context.model[this.index] === "object") {
        return this.context.model[this.index];
      }
      return {};
    },
    mergedGroupErrors() {
      const hasSubFields = /^([^.\d+].*?)\.(\d+\..+)$/;
      return Object.keys(this.mergedFieldErrors).filter((k) => hasSubFields.test(k)).reduce((groupErrorsByRoot, k) => {
        let [, rootField, groupKey] = k.match(hasSubFields);
        if (!groupErrorsByRoot[rootField]) {
          groupErrorsByRoot[rootField] = {};
        }
        Object.assign(groupErrorsByRoot[rootField], { [groupKey]: this.mergedFieldErrors[k] });
        return groupErrorsByRoot;
      }, {});
    }
  };
}
function useRegistryMethods(without = []) {
  const methods = {
    applyInitialValues() {
      if (this.hasInitialValue) {
        this.proxy = __spreadValues({}, this.initialValues);
      }
    },
    setFieldValue(field, value) {
      if (value === void 0) {
        const _a = this.proxy, { [field]: value2 } = _a, proxy = __objRest(_a, [__restKey(field)]);
        this.proxy = proxy;
      } else {
        Object.assign(this.proxy, { [field]: value });
      }
      this.$emit("input", __spreadValues({}, this.proxy));
    },
    valueDeps(callerCmp) {
      return Object.keys(this.proxy).reduce((o, k) => Object.defineProperty(o, k, {
        enumerable: true,
        get: () => {
          const callee = this.registry.get(k);
          this.deps.set(callerCmp, this.deps.get(callerCmp) || /* @__PURE__ */ new Set());
          if (callee) {
            this.deps.set(callee, this.deps.get(callee) || /* @__PURE__ */ new Set());
            this.deps.get(callee).add(callerCmp.name);
          }
          this.deps.get(callerCmp).add(k);
          return this.proxy[k];
        }
      }), /* @__PURE__ */ Object.create(null));
    },
    validateDeps(callerCmp) {
      if (this.deps.has(callerCmp)) {
        this.deps.get(callerCmp).forEach((field) => this.registry.has(field) && this.registry.get(field).performValidation());
      }
    },
    hasValidationErrors() {
      return Promise.all(this.registry.reduce((resolvers, cmp, name) => {
        resolvers.push(cmp.performValidation() && cmp.getValidationErrors());
        return resolvers;
      }, [])).then((errorObjects) => errorObjects.some((item) => item.hasErrors));
    },
    showErrors() {
      this.childrenShouldShowErrors = true;
      this.registry.map((input) => {
        input.formShouldShowErrors = true;
      });
    },
    hideErrors() {
      this.childrenShouldShowErrors = false;
      this.registry.map((input) => {
        input.formShouldShowErrors = false;
        input.behavioralErrorVisibility = false;
      });
    },
    setValues(values) {
      const keys = Array.from(new Set(Object.keys(values || {}).concat(Object.keys(this.proxy))));
      keys.forEach((field) => {
        const input = this.registry.has(field) && this.registry.get(field);
        let value = values ? values[field] : void 0;
        if (input && !equals(input.proxy, value, true)) {
          input.context.model = value;
        }
        if (!equals(value, this.proxy[field], true)) {
          this.setFieldValue(field, value);
        }
      });
    },
    updateValidation(errorObject) {
      if (has(this.registry.errors, errorObject.name)) {
        this.registry.errors[errorObject.name] = errorObject.hasErrors;
      }
      this.$emit("validation", errorObject);
    },
    addErrorObserver(observer) {
      if (!this.errorObservers.find((obs) => observer.callback === obs.callback)) {
        this.errorObservers.push(observer);
        if (observer.type === "form") {
          observer.callback(this.mergedFormErrors);
        } else if (observer.type === "group" && has(this.mergedGroupErrors, observer.field)) {
          observer.callback(this.mergedGroupErrors[observer.field]);
        } else if (has(this.mergedFieldErrors, observer.field)) {
          observer.callback(this.mergedFieldErrors[observer.field]);
        }
      }
    },
    removeErrorObserver(observer) {
      this.errorObservers = this.errorObservers.filter((obs) => obs.callback !== observer);
    }
  };
  return Object.keys(methods).reduce((withMethods, key) => {
    return without.includes(key) ? withMethods : __spreadProps(__spreadValues({}, withMethods), { [key]: methods[key] });
  }, {});
}
function useRegistryWatchers() {
  return {
    mergedFieldErrors: {
      handler(errors) {
        this.errorObservers.filter((o) => o.type === "input").forEach((o) => o.callback(errors[o.field] || []));
      },
      immediate: true
    },
    mergedGroupErrors: {
      handler(errors) {
        this.errorObservers.filter((o) => o.type === "group").forEach((o) => o.callback(errors[o.field] || {}));
      },
      immediate: true
    }
  };
}
function useRegistryProviders(ctx, without = []) {
  const providers = {
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
  const p = Object.keys(providers).filter((provider) => !without.includes(provider)).reduce((useProviders, provider) => Object.assign(useProviders, { [provider]: providers[provider] }), {});
  return p;
}
function isValueType(data) {
  switch (typeof data) {
    case "symbol":
    case "number":
    case "string":
    case "boolean":
    case "undefined":
      return true;
    default:
      if (data === null) {
        return true;
      }
      return false;
  }
}
function cloneDeep(obj) {
  if (typeof obj !== "object") {
    return obj;
  }
  const isArr = Array.isArray(obj);
  const newObj = isArr ? [] : {};
  for (const key in obj) {
    if (obj[key] instanceof FileUpload || isValueType(obj[key])) {
      newObj[key] = obj[key];
    } else {
      newObj[key] = cloneDeep(obj[key]);
    }
  }
  return newObj;
}
class FormSubmission {
  /**
   * Initialize a formulate form.
   * @param {vm} form an instance of FormulateForm
   */
  constructor(form) {
    this.form = form;
  }
  /**
   * Determine if the form has any validation errors.
   *
   * @return {Promise} resolves a boolean
   */
  hasValidationErrors() {
    return this.form.hasValidationErrors();
  }
  /**
   * Asynchronously generate the values payload of this form.
   * @return {Promise} resolves to json
   */
  values() {
    return new Promise((resolve, reject) => {
      const pending = [];
      const values = cloneDeep(this.form.proxy);
      for (const key in values) {
        if (typeof this.form.proxy[key] === "object" && this.form.proxy[key] instanceof FileUpload) {
          pending.push(
            this.form.proxy[key].upload().then((data) => Object.assign(values, { [key]: data }))
          );
        }
      }
      Promise.all(pending).then(() => resolve(values)).catch((err) => reject(err));
    });
  }
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$l = {
  name: "FormulateForm",
  provide() {
    return __spreadProps(__spreadValues({}, useRegistryProviders(this, ["getGroupValues"])), {
      observeContext: this.addContextObserver,
      removeContextObserver: this.removeContextObserver
    });
  },
  inheritAttrs: false,
  model: {
    prop: "formulateValue",
    event: "input"
  },
  props: {
    name: {
      type: [String, Boolean],
      default: false
    },
    formulateValue: {
      type: Object,
      default: () => ({})
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
      default: () => []
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
  emits: ["created", "failed-validation", "validation"],
  data() {
    return __spreadProps(__spreadValues({}, useRegistry(this)), {
      formShouldShowErrors: false,
      contextObservers: [],
      namedErrors: [],
      namedFieldErrors: {},
      isLoading: false,
      hasFailedSubmit: false
    });
  },
  computed: __spreadProps(__spreadValues({}, useRegistryComputed()), {
    schemaAttrs() {
      const _a = this.$attrs, { submit } = _a, attrs2 = __objRest(_a, ["submit"]);
      return attrs2;
    },
    pseudoProps() {
      return extractAttributes(
        this.$attrs,
        // eslint-disable-next-line unicorn/prefer-string-starts-ends-with
        classProps.filter((p) => /^form/.test(p))
      );
    },
    attributes() {
      const attrs2 = Object.keys(this.$attrs).filter((attr) => !has(this.pseudoProps, camel(attr))).reduce(
        (fields, field) => __spreadProps(__spreadValues({}, fields), { [field]: this.$attrs[field] }),
        {}
      );
      if (typeof this.name === "string") {
        Object.assign(attrs2, { name: this.name });
      }
      return attrs2;
    },
    hasErrors() {
      return Object.values(this.registry.errors).some((hasErrors2) => hasErrors2);
    },
    isValid() {
      return !this.hasErrors;
    },
    formContext() {
      return {
        errors: this.mergedFormErrors,
        pseudoProps: this.pseudoProps,
        hasErrors: this.hasErrors,
        value: this.proxy,
        hasValue: !isEmpty(this.proxy),
        // These have to be explicit for really silly nextTick reasons
        isValid: this.isValid,
        isLoading: this.isLoading,
        classes: this.classes
      };
    },
    classes() {
      return this.$formulate.classes(__spreadProps(__spreadValues(__spreadValues({}, this.$props), this.pseudoProps), {
        value: this.proxy,
        errors: this.mergedFormErrors,
        hasErrors: this.hasErrors,
        hasValue: !isEmpty(this.proxy),
        isValid: this.isValid,
        isLoading: this.isLoading,
        type: "form",
        classification: "form",
        attrs: this.$attrs
      }));
    },
    invalidErrors() {
      if (this.hasFailedSubmit && this.hasErrors) {
        switch (typeof this.invalidMessage) {
          case "string":
            return [this.invalidMessage];
          case "object":
            return Array.isArray(this.invalidMessage) ? this.invalidMessage : [];
          case "function":
            const ret = this.invalidMessage(this.failingFields);
            return Array.isArray(ret) ? ret : [ret];
        }
      }
      return [];
    },
    mergedFormErrors() {
      return this.formErrors.concat(this.namedErrors).concat(this.invalidErrors);
    },
    mergedFieldErrors() {
      const errors = {};
      if (this.errors) {
        for (const fieldName in this.errors) {
          errors[fieldName] = arrayify(this.errors[fieldName]);
        }
      }
      for (const fieldName in this.namedFieldErrors) {
        errors[fieldName] = arrayify(this.namedFieldErrors[fieldName]);
      }
      return errors;
    },
    hasFormErrorObservers() {
      return !!this.errorObservers.filter((o) => o.type === "form").length;
    },
    failingFields() {
      return Object.keys(this.registry.errors).reduce(
        (fields, field) => __spreadValues(__spreadValues({}, fields), this.registry.errors[field] ? { [field]: this.registry.get(field) } : {}),
        {}
      );
    }
  }),
  watch: __spreadProps(__spreadValues({}, useRegistryWatchers()), {
    formulateValue: {
      handler(values) {
        if (this.isVmodeled && values && typeof values === "object") {
          this.setValues(values);
        }
      },
      deep: true
    },
    mergedFormErrors(errors) {
      this.errorObservers.filter((o) => o.type === "form").forEach((o) => o.callback(errors));
    }
  }),
  created() {
    this.$formulate.register(this);
    this.applyInitialValues();
    this.$emit("created", this);
  },
  unmounted() {
    this.$formulate.deregister(this);
  },
  methods: __spreadProps(__spreadValues({}, useRegistryMethods()), {
    applyErrors({ formErrors, inputErrors }) {
      this.namedErrors = formErrors;
      this.namedFieldErrors = inputErrors;
    },
    addContextObserver(callback) {
      if (!this.contextObservers.find((observer) => observer === callback)) {
        this.contextObservers.push(callback);
        callback(this.formContext);
      }
    },
    removeContextObserver(callback) {
      this.contextObservers.filter((observer) => observer !== callback);
    },
    registerErrorComponent(component) {
      if (!this.errorComponents.includes(component)) {
        this.errorComponents.push(component);
      }
    },
    formSubmitted() {
      if (this.isLoading) {
        return void 0;
      }
      this.isLoading = true;
      this.showErrors();
      const submission = new FormSubmission(this);
      const submitRawHandler = this.$attrs["submit-raw"] || this.$attrs.submitRaw;
      const rawHandlerReturn = typeof submitRawHandler === "function" ? submitRawHandler(submission) : Promise.resolve(submission);
      const willResolveRaw = rawHandlerReturn instanceof Promise ? rawHandlerReturn : Promise.resolve(rawHandlerReturn);
      return willResolveRaw.then((res) => {
        const sub = res instanceof FormSubmission ? res : submission;
        return sub.hasValidationErrors().then((hasErrors2) => [sub, hasErrors2]);
      }).then(([sub, hasErrors2]) => {
        if (!hasErrors2 && typeof this.$attrs.submit === "function") {
          return sub.values().then((values) => {
            this.hasFailedSubmit = false;
            const handlerReturn = this.$attrs.submit(values);
            return (handlerReturn instanceof Promise ? handlerReturn : Promise.resolve()).then(() => values);
          });
        }
        return this.onFailedValidation();
      }).finally(() => {
        this.isLoading = false;
      });
    },
    onFailedValidation() {
      this.hasFailedSubmit = true;
      this.$emit("failed-validation", __spreadValues({}, this.failingFields));
      return this.$formulate.failedValidation(this);
    }
  })
};
function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSchema = resolveComponent("FormulateSchema");
  const _component_FormulateErrors = resolveComponent("FormulateErrors");
  return openBlock(), createElementBlock("form", mergeProps({
    class: $options.classes.form
  }, $options.attributes, {
    onSubmit: _cache[0] || (_cache[0] = withModifiers((...args) => $options.formSubmitted && $options.formSubmitted(...args), ["prevent"]))
  }), [
    $props.schema ? (openBlock(), createBlock(_component_FormulateSchema, mergeProps({
      key: 0,
      schema: $props.schema
    }, toHandlers(_ctx.schemaListeners)), null, 16, ["schema"])) : createCommentVNode("", true),
    !$options.hasFormErrorObservers ? (openBlock(), createBlock(_component_FormulateErrors, {
      key: 1,
      context: $options.formContext
    }, null, 8, ["context"])) : createCommentVNode("", true),
    renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps($options.formContext)))
  ], 16);
}
const FormulateForm = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$l]]);
const context = {
  context() {
    const model = defineModel.call(this, __spreadValues({
      addLabel: this.logicalAddLabel,
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
      hasLabel: this.label && this.classification !== "button",
      hasValidationErrors: this.hasValidationErrors.bind(this),
      help: this.help,
      helpPosition: this.logicalHelpPosition,
      id: this.id || this.defaultId,
      ignored: has(this, "ignored"),
      isValid: this.isValid,
      imageBehavior: this.imageBehavior,
      label: this.label,
      labelPosition: this.logicalLabelPosition,
      limit: this.limit === Infinity ? this.limit : Number.parseInt(this.limit, 10),
      name: this.nameOrFallback,
      minimum: Number.parseInt(this.minimum, 10),
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
      classes: this.classes
    }, this.typeContext));
    return model;
  },
  // Used in context
  nameOrFallback,
  hasGivenName,
  typeContext,
  elementAttributes,
  logicalLabelPosition,
  logicalHelpPosition,
  mergedRemovePosition,
  mergedUploadUrl,
  mergedGroupErrors,
  hasValue,
  visibleValidationErrors,
  slotComponents,
  logicalAddLabel,
  logicalRemoveLabel,
  classes,
  showValidationErrors,
  slotProps,
  pseudoProps,
  isValid,
  ruleDetails,
  // Not used in context
  isVmodeled,
  mergedValidationName,
  explicitErrors,
  allErrors,
  hasVisibleErrors,
  hasErrors,
  filteredAttributes,
  typeProps,
  attrs
};
function logicalAddLabel() {
  if (this.classification === "file") {
    return this.addLabel === true ? `+ Add ${cap(this.type)}` : this.addLabel;
  }
  if (typeof this.addLabel === "boolean") {
    const label = this.label || this.name;
    return `+ ${typeof label === "string" ? label + " " : ""} Add`;
  }
  return this.addLabel;
}
function logicalRemoveLabel() {
  if (typeof this.removeLabel === "boolean") {
    return "Remove";
  }
  return this.removeLabel;
}
function typeContext() {
  switch (this.classification) {
    case "select":
      return {
        options: createOptionList.call(this, this.options),
        optionGroups: this.optionGroups ? map(this.optionGroups, (k, v2) => createOptionList.call(this, v2)) : false,
        placeholder: this.$attrs.placeholder || false
      };
    case "slider":
      return { showValue: !!this.showValue };
    default:
      if (this.options) {
        return {
          options: createOptionList.call(this, this.options)
        };
      }
      return {};
  }
}
function pseudoProps() {
  return extractAttributes(this.localAttributes, classProps);
}
function typeProps() {
  return extractAttributes(
    this.localAttributes,
    this.$formulate.typeProps(this.type)
  );
}
function filteredAttributes() {
  const filterKeys = Object.keys(this.pseudoProps).concat(
    Object.keys(this.typeProps)
  );
  return Object.keys(this.localAttributes).reduce((props, key) => {
    if (!filterKeys.includes(camel(key))) {
      props[key] = this.localAttributes[key];
    }
    return props;
  }, {});
}
function elementAttributes() {
  const attrs2 = Object.assign({}, this.filteredAttributes);
  if (this.id) {
    attrs2.id = this.id;
  } else {
    attrs2.id = this.defaultId;
  }
  if (this.hasGivenName) {
    attrs2.name = this.name;
  }
  if (this.help && !has(attrs2, "aria-describedby")) {
    attrs2["aria-describedby"] = `${attrs2.id}-help`;
  }
  if (this.classes.input && (!Array.isArray(this.classes.input) || this.classes.input.length)) {
    attrs2.class = this.classes.input;
  }
  return attrs2;
}
function classes() {
  return this.$formulate.classes(__spreadValues(__spreadValues(__spreadValues({}, this.$props), this.pseudoProps), {
    attrs: this.filteredAttributes,
    classification: this.classification,
    hasErrors: this.hasVisibleErrors,
    hasValue: this.hasValue,
    helpPosition: this.logicalHelpPosition,
    isValid: this.isValid,
    labelPosition: this.logicalLabelPosition,
    type: this.type,
    value: this.proxy
  }));
}
function logicalLabelPosition() {
  if (this.labelPosition) {
    return this.labelPosition;
  }
  switch (this.classification) {
    case "box":
      return "after";
    default:
      return "before";
  }
}
function logicalHelpPosition() {
  if (this.helpPosition) {
    return this.helpPosition;
  }
  switch (this.classification) {
    case "group":
      return "before";
    default:
      return "after";
  }
}
function mergedRemovePosition() {
  return this.type === "group" ? this.removePosition || "before" : false;
}
function mergedValidationName() {
  try {
    const strategy = this.$formulate.options.validationNameStrategy || [
      "validationName",
      "name",
      "label",
      "type"
    ];
    if (Array.isArray(strategy)) {
      const key = strategy.find((key2) => typeof this[key2] === "string");
      return this[key];
    }
    if (typeof strategy === "function") {
      return strategy.call(this, this);
    }
    return this.type;
  } catch (e2) {
    console.error(e2);
  }
}
function mergedUploadUrl() {
  return this.uploadUrl || this.$formulate.getUploadUrl();
}
function mergedGroupErrors() {
  const keys = Object.keys(this.groupErrors).concat(
    Object.keys(this.localGroupErrors)
  );
  const isGroup = /^(\d+)\.(.*)$/;
  return Array.from(new Set(keys)).filter((k) => isGroup.test(k)).reduce((groupErrors, fieldKey) => {
    let [, index, subField] = fieldKey.match(isGroup);
    if (!has(groupErrors, index)) {
      groupErrors[index] = {};
    }
    const fieldErrors = Array.from(
      new Set(
        arrayify(this.groupErrors[fieldKey]).concat(
          arrayify(this.localGroupErrors[fieldKey])
        )
      )
    );
    groupErrors[index] = Object.assign(groupErrors[index], {
      [subField]: fieldErrors
    });
    return groupErrors;
  }, {});
}
function ruleDetails() {
  return this.parsedValidation.map(([, args, ruleName]) => ({
    ruleName,
    args
  }));
}
function showValidationErrors() {
  if (this.showErrors || this.formShouldShowErrors) {
    return true;
  }
  if (this.classification === "file" && this.uploadBehavior === "live" && modelGetter.call(this)) {
    return true;
  }
  return this.behavioralErrorVisibility;
}
function visibleValidationErrors() {
  return this.showValidationErrors && this.validationErrors.length ? this.validationErrors : [];
}
function nameOrFallback() {
  if (this.name === true && this.classification !== "button") {
    const id = this.id || this.elementAttributes.id.replace(/[^0-9]/g, "");
    return `${this.type}_${id}`;
  }
  if (this.name === false || this.classification === "button" && this.name === true) {
    return false;
  }
  return this.name;
}
function hasGivenName() {
  return typeof this.name !== "boolean";
}
function hasValue() {
  const value = this.proxy;
  if (this.classification === "box" && this.isGrouped || this.classification === "select" && has(this.filteredAttributes, "multiple")) {
    return Array.isArray(value) ? value.includes(this.value) : this.value === value;
  }
  return !isEmpty(value);
}
function isVmodeled() {
  const hasFormulateValue = Object.prototype.hasOwnProperty.call(this, "formulateValue") || Object.prototype.hasOwnProperty.call(this.$props, "formulateValue");
  const handlesInputEvent = this.$attrs && (typeof this.$attrs["onInput"] === "function" || typeof this.$attrs["onUpdate:modelValue"] === "function");
  return !!(hasFormulateValue && handlesInputEvent);
}
function createOptionList(optionData) {
  if (!optionData) {
    return [];
  }
  const options = Array.isArray(optionData) ? optionData : Object.keys(optionData).map((value) => ({
    label: optionData[value],
    value
  }));
  return options.map(createOption.bind(this));
}
function createOption(option) {
  if (typeof option === "number") {
    option = String(option);
  }
  if (typeof option === "string") {
    return {
      label: option,
      value: option,
      id: `${this.elementAttributes.id}_${option}`
    };
  }
  if (typeof option.value === "number") {
    option.value = String(option.value);
  }
  return Object.assign(
    {
      value: "",
      label: "",
      id: `${this.elementAttributes.id}_${option.value || option.label}`
    },
    option
  );
}
function explicitErrors() {
  return arrayify(this.errors).concat(this.localErrors).concat(arrayify(this.error));
}
function allErrors() {
  return this.explicitErrors.concat(arrayify(this.validationErrors));
}
function hasErrors() {
  return !!this.allErrors.length;
}
function isValid() {
  return !this.hasErrors;
}
function hasVisibleErrors() {
  return Array.isArray(this.validationErrors) && this.validationErrors.length && this.showValidationErrors || !!this.explicitErrors.length;
}
function slotComponents() {
  const fn = this.$formulate.slotComponent.bind(this.$formulate);
  return {
    addMore: fn(this.type, "addMore"),
    buttonContent: fn(this.type, "buttonContent"),
    errors: fn(this.type, "errors"),
    file: fn(this.type, "file"),
    help: fn(this.type, "help"),
    label: fn(this.type, "label"),
    prefix: fn(this.type, "prefix"),
    remove: fn(this.type, "remove"),
    repeatable: fn(this.type, "repeatable"),
    suffix: fn(this.type, "suffix"),
    uploadAreaMask: fn(this.type, "uploadAreaMask")
  };
}
function slotProps() {
  const fn = this.$formulate.slotProps.bind(this.$formulate);
  return {
    label: fn(this.type, "label", this.typeProps),
    help: fn(this.type, "help", this.typeProps),
    errors: fn(this.type, "errors", this.typeProps),
    repeatable: fn(this.type, "repeatable", this.typeProps),
    addMore: fn(this.type, "addMore", this.typeProps),
    remove: fn(this.type, "remove", this.typeProps),
    component: fn(this.type, "component", this.typeProps)
  };
}
function blurHandler() {
  if (this.errorBehavior === "blur" || this.errorBehavior === "value") {
    this.behavioralErrorVisibility = true;
  }
  this.$nextTick(() => this.$emit("blur-context", this.context));
}
function attrs() {
  const _a = this.$attrs, { input } = _a, attrs2 = __objRest(_a, ["input"]);
  return attrs2;
}
function defineModel(context2) {
  return Object.defineProperty(context2, "model", {
    get: modelGetter.bind(this),
    set: (value) => {
      if (!this.mntd || !this.debounceDelay) {
        return modelSetter.call(this, value);
      }
      this.dSet(modelSetter, [value], this.debounceDelay);
    },
    enumerable: true
  });
}
function modelGetter() {
  const model = this.isVmodeled ? "formulateValue" : "proxy";
  if (this.type === "checkbox" && !Array.isArray(this[model]) && this.options) {
    return [];
  }
  if (!this[model] && this[model] !== 0) {
    return "";
  }
  return this[model];
}
function modelSetter(value) {
  let didUpdate = false;
  if (!equals(value, this.proxy, this.type === "group")) {
    this.proxy = value;
    didUpdate = true;
  }
  if (!this.context.ignored && this.context.name && typeof this.formulateSetter === "function") {
    this.formulateSetter(this.context.name, value);
  }
  if (didUpdate) {
    this.$emit("input", value);
  }
}
const _sfc_main$k = {
  name: "FormulateInput",
  provide() {
    return {
      // Allows sub-components of this input to register arbitrary rules.
      formulateRegisterRule: this.registerRule,
      formulateRemoveRule: this.removeRule
    };
  },
  inject: {
    formulateSetter: { default: void 0 },
    formulateFieldValidation: { default: () => () => ({}) },
    formulateRegister: { default: void 0 },
    formulateDeregister: { default: void 0 },
    getFormValues: { default: () => () => ({}) },
    getGroupValues: { default: void 0 },
    validateDependents: { default: () => () => {
    } },
    observeErrors: { default: void 0 },
    removeErrorObserver: { default: void 0 },
    isSubField: { default: () => () => false }
  },
  inheritAttrs: false,
  model: {
    prop: "formulateValue",
    event: "input"
  },
  props: {
    type: {
      type: String,
      default: "text"
    },
    name: {
      type: [String, Boolean],
      default: true
    },
    /* eslint-disable */
    formulateValue: {
      default: ""
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
      validator: (value) => Infinity
    },
    minimum: {
      type: [String, Number],
      default: 0,
      validator: (value) => Number.parseInt(value, 10) == value
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
      default: "blur",
      validator: function(value) {
        return ["blur", "live", "submit", "value"].includes(value);
      }
    },
    showErrors: {
      type: Boolean,
      default: false
    },
    groupErrors: {
      type: Object,
      default: () => ({}),
      validator: (value) => {
        const isK = /^\d+\./;
        return !Object.keys(value).some((k) => !isK.test(k));
      }
    },
    imageBehavior: {
      type: String,
      default: "preview"
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
      default: "live"
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
      default: () => ({})
    },
    validationRules: {
      type: Object,
      default: () => ({})
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
      default: "inherit"
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
  emits: ["error-visibility", "validation", "input"],
  data() {
    try {
      const ret = {
        defaultId: this.$formulate.nextId(this),
        localAttributes: {},
        localErrors: [],
        localGroupErrors: {},
        proxy: this.getInitialValue(),
        behavioralErrorVisibility: this.errorBehavior === "live",
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
      };
      return ret;
    } catch (e2) {
      console.error(e2);
    }
  },
  computed: __spreadProps(__spreadValues({}, context), {
    classification() {
      const classification = this.$formulate.classify(this.type);
      return classification === "box" && this.options ? "group" : classification;
    },
    component() {
      return this.classification === "group" ? "FormulateInputGroup" : this.$formulate.component(this.type);
    },
    parsedValidationRules() {
      const parsedValidationRules = {};
      Object.keys(this.validationRules).forEach((key) => {
        parsedValidationRules[camel(key)] = this.validationRules[key];
      });
      return parsedValidationRules;
    },
    parsedValidation() {
      return parseRules(
        this.validation,
        this.$formulate.rules(this.parsedValidationRules)
      );
    },
    messages() {
      const messages = {};
      Object.keys(this.validationMessages).forEach((key) => {
        messages[camel(key)] = this.validationMessages[key];
      });
      Object.keys(this.messageRegistry).forEach((key) => {
        messages[camel(key)] = this.messageRegistry[key];
      });
      return messages;
    },
    listeners() {
      const listeners = Object.entries(this.$attrs).filter(([key]) => key.startsWith("on"));
      return Object.fromEntries(listeners);
    }
  }),
  watch: {
    $attrs: {
      handler(value) {
        this.updateLocalAttributes(value);
      },
      deep: true
    },
    proxy: {
      handler: function(newValue, oldValue) {
        this.performValidation();
        if (!this.isVmodeled && !equals(newValue, oldValue, this.type === "group")) {
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
      handler: function(newValue, oldValue) {
        if (this.isVmodeled && !equals(newValue, oldValue, this.type === "group")) {
          this.context.model = newValue;
        }
      },
      deep: true
    },
    showValidationErrors: {
      handler(val) {
        this.$emit("error-visibility", val);
      },
      immediate: true
    },
    validation: {
      handler() {
        this.performValidation();
      },
      deep: true
    },
    touched(value) {
      if (this.errorBehavior === "value" && value) {
        this.behavioralErrorVisibility = value;
      }
    },
    debounce(value) {
      this.debounceDelay = value;
    }
  },
  created() {
    this.applyInitialValue();
    if (this.formulateRegister && typeof this.formulateRegister === "function") {
      this.formulateRegister(this.nameOrFallback, this);
    }
    this.applyDefaultValue();
    if (!this.disableErrors && typeof this.observeErrors === "function") {
      this.observeErrors({
        callback: this.setErrors,
        type: "input",
        field: this.nameOrFallback
      });
      if (this.type === "group") {
        this.observeErrors({
          callback: this.setGroupErrors,
          type: "group",
          field: this.nameOrFallback
        });
      }
    }
    this.updateLocalAttributes(this.$attrs);
    this.performValidation();
    if (this.hasValue) {
      this.touched = true;
    }
  },
  mounted() {
    this.mntd = true;
  },
  beforeUnmount() {
    if (!this.disableErrors && typeof this.removeErrorObserver === "function") {
      this.removeErrorObserver(this.setErrors);
      if (this.type === "group") {
        this.removeErrorObserver(this.setGroupErrors);
      }
    }
    if (typeof this.formulateDeregister === "function" && !this.preventDeregister) {
      this.formulateDeregister(this.nameOrFallback);
    }
  },
  methods: {
    getInitialValue() {
      const formulate = this.$formulate;
      let classification = formulate.classify(this.type);
      classification = classification === "box" && this.options ? "group" : classification;
      if (classification === "box" && this.checked) {
        return this.value || true;
      } else if (has(this, "value") && classification !== "box") {
        return this.value;
      } else if (has(this, "formulateValue")) {
        return this.formulateValue;
      } else if (classification === "group") {
        return Object.defineProperty(
          this.type === "group" ? [{}] : [],
          "__init",
          { value: true }
        );
      }
      return "";
    },
    applyInitialValue() {
      if (!equals(this.context.model, this.proxy) && // we dont' want to set the model if we are a sub-box of a multi-box field
      (this.classification !== "box" || has(this, "options"))) {
        this.context.model = this.proxy;
        this.$emit("input", this.proxy);
      }
    },
    applyDefaultValue() {
      if (this.type === "select" && !this.context.placeholder && isEmpty(this.proxy) && !this.isVmodeled && this.value === false && this.context.options.length) {
        if (!has(this.$attrs, "multiple")) {
          this.context.model = this.context.options[0].value;
        } else {
          this.context.model = [];
        }
      }
    },
    updateLocalAttributes(value) {
      if (!equals(value, this.localAttributes)) {
        this.localAttributes = value;
      }
    },
    performValidation() {
      let rules2 = parseRules(
        this.validation,
        this.$formulate.rules(this.parsedValidationRules)
      );
      rules2 = this.ruleRegistry.length ? this.ruleRegistry.concat(rules2) : rules2;
      this.pendingValidation = this.runRules(rules2).then(
        (messages) => this.didValidate(messages)
      );
      return this.pendingValidation;
    },
    runRules(rules2) {
      const run = ([rule, args, ruleName, modifier]) => {
        let res = rule(
          {
            value: this.context.model,
            getFormValues: (...args2) => this.getFormValues(this, ...args2),
            getGroupValues: (...args2) => this[`get${this.getGroupValues ? "Group" : "Form"}Values`](
              this,
              ...args2
            ),
            name: this.context.name
          },
          ...args
        );
        res = res instanceof Promise ? res : Promise.resolve(res);
        return res.then(
          (result) => result ? false : this.getMessage(ruleName, args)
        );
      };
      return new Promise((resolve) => {
        const resolveGroups = (groups, allMessages = []) => {
          const ruleGroup = groups.shift();
          if (Array.isArray(ruleGroup) && ruleGroup.length) {
            Promise.all(ruleGroup.map(run)).then((messages) => messages.filter((m) => !!m)).then((messages) => {
              messages = Array.isArray(messages) ? messages : [];
              if ((!messages.length || !ruleGroup.bail) && groups.length) {
                return resolveGroups(groups, allMessages.concat(messages));
              }
              return resolve(
                allMessages.concat(messages).filter((m) => !isEmpty(m))
              );
            });
          } else {
            resolve([]);
          }
        };
        resolveGroups(groupBails(rules2));
      });
    },
    didValidate(messages) {
      const validationChanged = !equals(messages, this.validationErrors);
      this.validationErrors = messages;
      if (validationChanged) {
        const errorObject = this.getErrorObject();
        this.$emit("validation", errorObject);
        if (this.formulateFieldValidation && typeof this.formulateFieldValidation === "function") {
          this.formulateFieldValidation(errorObject);
        }
      }
    },
    getMessage(ruleName, args) {
      return this.getMessageFunc(ruleName)({
        args,
        name: this.mergedValidationName,
        value: this.context.model,
        vm: this,
        formValues: this.getFormValues(this),
        getFormValues: (...args2) => this.getFormValues(this, ...args2),
        getGroupValues: (...args2) => this[`get${this.getGroupValues ? "Group" : "Form"}Values`](
          this,
          ...args2
        )
      });
    },
    getMessageFunc(ruleName) {
      ruleName = camel(ruleName);
      if (ruleName === "optional") {
        return () => [];
      }
      if (this.messages && typeof this.messages[ruleName] !== "undefined") {
        switch (typeof this.messages[ruleName]) {
          case "function":
            return this.messages[ruleName];
          case "string":
          case "boolean":
            return () => this.messages[ruleName];
        }
      }
      return (context2) => this.$formulate.validationMessage(ruleName, context2, this);
    },
    hasValidationErrors() {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          this.pendingValidation.then(
            () => resolve(!!this.validationErrors.length)
          );
        });
      });
    },
    getValidationErrors() {
      return new Promise((resolve) => {
        this.$nextTick(
          () => this.pendingValidation.then(() => resolve(this.getErrorObject()))
        );
      });
    },
    getErrorObject() {
      return {
        name: this.context.nameOrFallback || this.context.name,
        errors: this.validationErrors.filter((s) => typeof s === "string"),
        hasErrors: !!this.validationErrors.length
      };
    },
    setErrors(errors) {
      this.localErrors = arrayify(errors);
    },
    setGroupErrors(groupErrors) {
      this.localGroupErrors = groupErrors;
    },
    registerRule(rule, args, ruleName, message = null) {
      if (!this.ruleRegistry.some((r) => r[2] === ruleName)) {
        this.ruleRegistry.push([rule, args, ruleName]);
        if (message !== null) {
          this.messageRegistry[ruleName] = message;
        }
      }
    },
    removeRule(key) {
      const ruleIndex = this.ruleRegistry.findIndex((r) => r[2] === key);
      if (ruleIndex >= 0) {
        this.ruleRegistry.splice(ruleIndex, 1);
        delete this.messageRegistry[key];
      }
    }
  }
};
const _hoisted_1$e = ["data-classification", "data-has-errors", "data-is-showing-errors", "data-has-value", "data-type"];
function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.context.classes.outer),
    "data-classification": $options.classification,
    "data-has-errors": _ctx.hasErrors,
    "data-is-showing-errors": _ctx.hasVisibleErrors,
    "data-has-value": _ctx.hasValue,
    "data-type": $props.type
  }, [
    createElementVNode("div", {
      class: normalizeClass(_ctx.context.classes.wrapper)
    }, [
      _ctx.context.labelPosition === "before" ? renderSlot(_ctx.$slots, "label", normalizeProps(mergeProps({ key: 0 }, _ctx.context)), () => [
        _ctx.context.hasLabel ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.label), mergeProps({ key: 0 }, _ctx.context.slotProps.label, { context: _ctx.context }), null, 16, ["context"])) : createCommentVNode("", true)
      ]) : createCommentVNode("", true),
      _ctx.context.helpPosition === "before" ? renderSlot(_ctx.$slots, "help", normalizeProps(mergeProps({ key: 1 }, _ctx.context)), () => [
        _ctx.context.help ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.help), mergeProps({ key: 0 }, _ctx.context.slotProps.help, { context: _ctx.context }), null, 16, ["context"])) : createCommentVNode("", true)
      ]) : createCommentVNode("", true),
      renderSlot(_ctx.$slots, "element", normalizeProps(guardReactiveProps(_ctx.context)), () => [
        (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.component), mergeProps({ context: _ctx.context }, _ctx.context.slotProps.component, toHandlers($options.listeners)), {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(_ctx.context)))
          ]),
          _: 3
        }, 16, ["context"]))
      ]),
      _ctx.context.labelPosition === "after" ? renderSlot(_ctx.$slots, "label", normalizeProps(mergeProps({ key: 2 }, _ctx.context)), () => [
        _ctx.context.hasLabel ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.label), mergeProps({
          key: 0,
          context: _ctx.context
        }, _ctx.context.slotProps.label), null, 16, ["context"])) : createCommentVNode("", true)
      ]) : createCommentVNode("", true)
    ], 2),
    _ctx.context.helpPosition === "after" ? renderSlot(_ctx.$slots, "help", normalizeProps(mergeProps({ key: 0 }, _ctx.context)), () => [
      _ctx.context.help ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.help), mergeProps({
        key: 0,
        context: _ctx.context
      }, _ctx.context.slotProps.help), null, 16, ["context"])) : createCommentVNode("", true)
    ]) : createCommentVNode("", true),
    renderSlot(_ctx.$slots, "errors", normalizeProps(guardReactiveProps(_ctx.context)), () => [
      !_ctx.context.disableErrors ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.errors), mergeProps({
        key: 0,
        type: _ctx.context.slotComponents.errors === "FormulateErrors" ? "input" : false,
        context: _ctx.context
      }, _ctx.context.slotProps.errors), null, 16, ["type", "context"])) : createCommentVNode("", true)
    ])
  ], 10, _hoisted_1$e);
}
const FormulateInput = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$k]]);
const _sfc_main$j = {
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
      default: () => ({})
    },
    type: {
      type: String,
      default: "form"
    }
  },
  data() {
    return {
      boundSetErrors: this.setErrors.bind(this),
      boundSetFormContext: this.setFormContext.bind(this),
      localErrors: [],
      formContext: {
        classes: {
          formErrors: "formulate-form-errors",
          formError: "formulate-form-error"
        }
      }
    };
  },
  computed: {
    visibleValidationErrors() {
      return Array.isArray(this.context.visibleValidationErrors) ? this.context.visibleValidationErrors : [];
    },
    errors() {
      return Array.isArray(this.context.errors) ? this.context.errors : [];
    },
    mergedErrors() {
      return this.errors.concat(this.localErrors);
    },
    visibleErrors() {
      return Array.from(new Set(this.mergedErrors.concat(this.visibleValidationErrors))).filter((message) => typeof message === "string");
    },
    outerClass() {
      if (this.type === "input" && this.context.classes) {
        return this.context.classes.errors;
      }
      return this.formContext.classes.formErrors;
    },
    itemClass() {
      if (this.type === "input" && this.context.classes) {
        return this.context.classes.error;
      }
      return this.formContext.classes.formError;
    },
    role() {
      return this.type === "form" ? "alert" : "status";
    },
    ariaLive() {
      return this.type === "form" ? "assertive" : "polite";
    },
    slotComponent() {
      return this.$formulate.slotComponent(null, "errorList");
    }
  },
  created() {
    if (this.type === "form" && typeof this.observeErrors === "function") {
      if (!Array.isArray(this.context.errors)) {
        this.observeErrors({ callback: this.boundSetErrors, type: "form" });
      }
      this.observeContext(this.boundSetFormContext);
    }
  },
  unmounted() {
    if (this.type === "form" && typeof this.removeErrorObserver === "function") {
      if (!Array.isArray(this.context.errors)) {
        this.removeErrorObserver(this.boundSetErrors);
      }
      this.removeContextObserver(this.boundSetFormContext);
    }
  },
  methods: {
    setErrors(errors) {
      this.localErrors = arrayify(errors);
    },
    setFormContext(context2) {
      this.formContext = context2;
    }
  }
};
function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(resolveDynamicComponent($options.slotComponent), {
    "visible-errors": $options.visibleErrors,
    "item-class": $options.itemClass,
    "outer-class": $options.outerClass,
    role: $options.role,
    "aria-live": $options.ariaLive,
    type: $props.type
  }, null, 8, ["visible-errors", "item-class", "outer-class", "role", "aria-live", "type"]);
}
const FormulateErrors = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$j]]);
const _sfc_main$i = {
  props: {
    context: {
      type: Object,
      required: true
    }
  }
};
const _hoisted_1$d = ["id", "textContent"];
function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
  return $props.context.help ? (openBlock(), createElementBlock("div", {
    key: 0,
    id: `${$props.context.id}-help`,
    class: normalizeClass($props.context.classes.help),
    textContent: toDisplayString($props.context.help)
  }, null, 10, _hoisted_1$d)) : createCommentVNode("", true);
}
const FormulateHelp = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$i]]);
const _sfc_main$h = {
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
const _hoisted_1$c = ["src"];
const _hoisted_2$7 = ["title", "textContent"];
const _hoisted_3$4 = ["data-just-finished", "data-is-finished"];
function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($props.context.classes.file)
  }, [
    !!($props.imagePreview && $props.file.previewData) ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass($props.context.classes.fileImagePreview)
    }, [
      createElementVNode("img", {
        src: $props.file.previewData,
        class: normalizeClass($props.context.classes.fileImagePreviewImage)
      }, null, 10, _hoisted_1$c)
    ], 2)) : createCommentVNode("", true),
    createElementVNode("div", {
      class: normalizeClass($props.context.classes.fileName),
      title: $props.file.name,
      textContent: toDisplayString($props.file.name)
    }, null, 10, _hoisted_2$7),
    $props.file.progress !== false ? (openBlock(), createElementBlock("div", {
      key: 1,
      "data-just-finished": $props.file.justFinished,
      "data-is-finished": !$props.file.justFinished && $props.file.complete,
      class: normalizeClass($props.context.classes.fileProgress)
    }, [
      createElementVNode("div", {
        class: normalizeClass($props.context.classes.fileProgressInner),
        style: normalizeStyle({ width: $props.file.progress + "%" })
      }, null, 6)
    ], 10, _hoisted_3$4)) : createCommentVNode("", true),
    $props.file.complete && !$props.file.justFinished || $props.file.progress === false ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass($props.context.classes.fileRemove),
      onClick: _cache[0] || (_cache[0] = (...args) => $props.file.removeFile && $props.file.removeFile(...args))
    }, null, 2)) : createCommentVNode("", true)
  ], 2);
}
const FormulateFile = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h]]);
const _sfc_main$g = {
  name: "FormulateGrouping",
  inject: ["formulateRegisterRule", "formulateRemoveRule"],
  provide() {
    return {
      isSubField: () => true,
      registerProvider: this.registerProvider,
      deregisterProvider: this.deregisterProvider
    };
  },
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      providers: [],
      keys: []
    };
  },
  computed: {
    items() {
      if (Array.isArray(this.context.model)) {
        if (!this.context.repeatable && this.context.model.length === 0) {
          return [this.setId({}, 0)];
        }
        if (this.context.model.length < this.context.minimum) {
          return Array.from({ length: this.context.minimum || 1 }).fill("").map((t, index) => this.setId(this.context.model[index] || {}, index));
        }
        return this.context.model.map((item, index) => this.setId(item, index));
      }
      return Array.from({ length: this.context.minimum || 1 }).fill("").map((_i, index) => this.setId({}, index));
    },
    formShouldShowErrors() {
      return this.context.formShouldShowErrors;
    },
    groupErrors() {
      return this.items.map((item, index) => has(this.context.groupErrors, index) ? this.context.groupErrors[index] : {});
    }
  },
  watch: {
    providers() {
      if (this.formShouldShowErrors) {
        this.showErrors();
      }
    },
    formShouldShowErrors(val) {
      if (val) {
        this.showErrors();
      }
    },
    items: {
      handler(items, oldItems) {
        if (!equals(items, oldItems, true)) {
          this.keys = items.map((item) => item.__id);
        }
      },
      immediate: true
    }
  },
  created() {
    this.formulateRegisterRule(this.validateGroup.bind(this), [], "formulateGrouping", true);
  },
  unmounted() {
    this.formulateRemoveRule("formulateGrouping");
  },
  methods: {
    validateGroup() {
      return Promise.all(this.providers.reduce((resolvers, provider) => {
        if (provider && typeof provider.hasValidationErrors === "function") {
          resolvers.push(provider.hasValidationErrors());
        }
        return resolvers;
      }, [])).then((providersHasErrors) => !providersHasErrors.some((hasErrors2) => !!hasErrors2));
    },
    showErrors() {
      this.providers.forEach((p) => p && typeof p.showErrors === "function" && p.showErrors());
    },
    setItem(index, groupProxy) {
      if (Array.isArray(this.context.model) && this.context.model.length >= this.context.minimum && !this.context.model.__init) {
        this.context.model.splice(index, 1, this.setId(groupProxy, index));
      } else {
        this.context.model = this.items.map((item, i2) => i2 === index ? this.setId(groupProxy, index) : item);
      }
    },
    removeItem(index) {
      if (Array.isArray(this.context.model) && this.context.model.length > this.context.minimum) {
        this.context.model = this.context.model.filter((item, i2) => i2 === index ? false : item);
        this.context.rootEmit("repeatableRemoved", this.context.model);
      } else if (!Array.isArray(this.context.model) && this.items.length > this.context.minimum) {
        this.context.model = Array.from({ length: this.items.length - 1 }).fill("").map((_i, idx) => this.setId({}, idx));
        this.context.rootEmit("repeatableRemoved", this.context.model);
      }
    },
    registerProvider(provider) {
      if (!this.providers.includes(provider)) {
        this.providers.push(provider);
      }
    },
    deregisterProvider(provider) {
      this.providers = this.providers.filter((p) => p !== provider);
    },
    setId(item, index) {
      return item.__id ? item : setId(item, this.keys[index]);
    }
  }
};
function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateRepeatableProvider = resolveComponent("FormulateRepeatableProvider");
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  return openBlock(), createBlock(_component_FormulateSlot, {
    name: "grouping",
    class: normalizeClass($props.context.classes.grouping),
    context: $props.context,
    "force-wrap": $props.context.repeatable
  }, {
    default: withCtx(() => [
      (openBlock(true), createElementBlock(Fragment, null, renderList($options.items, (item, index) => {
        return openBlock(), createBlock(_component_FormulateRepeatableProvider, {
          key: item.__id,
          index,
          context: $props.context,
          uuid: item.__id,
          errors: $options.groupErrors[index],
          onRemove: $options.removeItem,
          onInput: (values) => $options.setItem(index, values)
        }, {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "default")
          ]),
          _: 2
        }, 1032, ["index", "context", "uuid", "errors", "onRemove", "onInput"]);
      }), 128))
    ]),
    _: 3
  }, 8, ["class", "context", "force-wrap"]);
}
const FormulateGrouping = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g]]);
const _sfc_main$f = {
  props: {
    context: {
      type: Object,
      required: true
    }
  }
};
const _hoisted_1$b = ["id", "for", "textContent"];
function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("label", {
    id: `${$props.context.id}_label`,
    class: normalizeClass($props.context.classes.label),
    for: $props.context.id,
    textContent: toDisplayString($props.context.label)
  }, null, 10, _hoisted_1$b);
}
const FormulateLabel = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f]]);
const _sfc_main$e = {
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
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateInput = resolveComponent("FormulateInput");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($props.context.classes.groupAddMore)
  }, [
    createVNode(_component_FormulateInput, {
      type: "button",
      label: $props.context.addLabel,
      "data-minor": "",
      "data-ghost": "",
      onClick: $props.addMore
    }, null, 8, ["label", "onClick"])
  ], 2);
}
const FormulateAddMore = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e]]);
const FormulateInputMixin = {
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  computed: {
    type() {
      return this.context.type;
    },
    attributes() {
      return this.context.attributes || {};
    },
    hasValue() {
      return this.context.hasValue;
    }
  }
};
const _sfc_main$d = {
  name: "FormulateInputBox",
  mixins: [FormulateInputMixin],
  computed: {
    usesDecorator() {
      return this.$formulate.options.useInputDecorators;
    }
  }
};
const _hoisted_1$a = ["data-type"];
const _hoisted_2$6 = ["value"];
const _hoisted_3$3 = ["value"];
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.context.classes.element),
    "data-type": _ctx.context.type
  }, [
    createVNode(_component_FormulateSlot, {
      name: "prefix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.prefix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"]),
    _ctx.type === "radio" ? withDirectives((openBlock(), createElementBlock("input", mergeProps({
      key: 0,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.context.model = $event),
      type: "radio",
      value: _ctx.context.value
    }, _ctx.attributes, toHandlers(_ctx.$attrs, true), {
      onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.context.blurHandler && _ctx.context.blurHandler(...args))
    }), null, 16, _hoisted_2$6)), [
      [vModelRadio, _ctx.context.model]
    ]) : withDirectives((openBlock(), createElementBlock("input", mergeProps({
      key: 1,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.context.model = $event),
      type: "checkbox",
      value: _ctx.context.value
    }, _ctx.attributes, toHandlers(_ctx.$attrs, true), {
      onBlur: _cache[3] || (_cache[3] = (...args) => _ctx.context.blurHandler && _ctx.context.blurHandler(...args))
    }), null, 16, _hoisted_3$3)), [
      [vModelCheckbox, _ctx.context.model]
    ]),
    $options.usesDecorator ? (openBlock(), createBlock(resolveDynamicComponent(`label`), {
      key: 2,
      class: normalizeClass(_ctx.context.classes.decorator),
      for: _ctx.attributes.id
    }, null, 8, ["class", "for"])) : createCommentVNode("", true),
    createVNode(_component_FormulateSlot, {
      name: "suffix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.suffix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, _hoisted_1$a);
}
const FormulateInputBox = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d]]);
const _sfc_main$c = {
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
      default: "status"
    },
    ariaLive: {
      type: [String, Boolean],
      default: "polite"
    },
    type: {
      type: String,
      required: true
    }
  }
};
const _hoisted_1$9 = ["role", "aria-live", "textContent"];
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return $props.visibleErrors.length ? (openBlock(), createElementBlock("ul", {
    key: 0,
    class: normalizeClass($props.outerClass)
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.visibleErrors, (error) => {
      return openBlock(), createElementBlock("li", {
        key: error,
        class: normalizeClass($props.itemClass),
        role: $props.role,
        "aria-live": $props.ariaLive,
        textContent: toDisplayString(error)
      }, null, 10, _hoisted_1$9);
    }), 128))
  ], 2)) : createCommentVNode("", true);
}
const FormulateErrorList = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c]]);
const _sfc_main$b = {
  name: "FormulateInputText",
  mixins: [FormulateInputMixin]
};
const _hoisted_1$8 = ["data-type"];
const _hoisted_2$5 = ["type"];
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.context.classes.element),
    "data-type": _ctx.context.type
  }, [
    createVNode(_component_FormulateSlot, {
      name: "prefix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.prefix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"]),
    withDirectives(createElementVNode("input", mergeProps({
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.context.model = $event),
      type: _ctx.type
    }, _ctx.attributes, {
      onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.context.blurHandler && _ctx.context.blurHandler(...args))
    }, toHandlers(_ctx.$attrs, true)), null, 16, _hoisted_2$5), [
      [vModelDynamic, _ctx.context.model]
    ]),
    createVNode(_component_FormulateSlot, {
      name: "suffix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.suffix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, _hoisted_1$8);
}
const FormulateInputText = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b]]);
const _sfc_main$a = {
  name: "FormulateFiles",
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
    fileUploads() {
      return this.files.files || [];
    },
    isMultiple() {
      return has(this.context.attributes, "multiple");
    }
  },
  watch: {
    files() {
      if (this.imagePreview) {
        this.files.loadPreviews();
      }
    }
  },
  mounted() {
    if (this.imagePreview) {
      this.files.loadPreviews();
    }
  },
  methods: {
    appendFiles() {
      const input = this.$refs.addFiles;
      if (input.files.length) {
        this.files.mergeFileList(input);
      }
    }
  }
};
const _hoisted_1$7 = ["data-has-error", "data-has-preview"];
const _hoisted_2$4 = ["textContent"];
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  return $options.fileUploads.length ? (openBlock(), createElementBlock("ul", {
    key: 0,
    class: normalizeClass($props.context.classes.files)
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.fileUploads, (file) => {
      return openBlock(), createElementBlock("li", {
        key: file.uuid,
        "data-has-error": !!file.error,
        "data-has-preview": !!($props.imagePreview && file.previewData)
      }, [
        createVNode(_component_FormulateSlot, {
          name: "file",
          context: $props.context,
          file,
          "image-preview": $props.imagePreview
        }, {
          default: withCtx(() => [
            (openBlock(), createBlock(resolveDynamicComponent($props.context.slotComponents.file), {
              context: $props.context,
              file,
              "image-preview": $props.imagePreview
            }, null, 8, ["context", "file", "image-preview"]))
          ]),
          _: 2
        }, 1032, ["context", "file", "image-preview"]),
        file.error ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass($props.context.classes.fileUploadError),
          textContent: toDisplayString(file.error)
        }, null, 10, _hoisted_2$4)) : createCommentVNode("", true)
      ], 8, _hoisted_1$7);
    }), 128)),
    $options.isMultiple && $props.context.addLabel ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass($props.context.classes.fileAdd),
      role: "button"
    }, [
      createTextVNode(toDisplayString($props.context.addLabel) + " ", 1),
      createElementVNode("input", {
        ref: "addFiles",
        type: "file",
        multiple: "",
        class: normalizeClass($props.context.classes.fileAddInput),
        onChange: _cache[0] || (_cache[0] = (...args) => $options.appendFiles && $options.appendFiles(...args))
      }, null, 34)
    ], 2)) : createCommentVNode("", true)
  ], 2)) : createCommentVNode("", true);
}
const FormulateFiles = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a]]);
const _sfc_main$9 = {
  name: "FormulateInputFile",
  components: {
    FormulateFiles
  },
  mixins: [FormulateInputMixin],
  data() {
    return {
      isOver: false
    };
  },
  computed: {
    hasFiles() {
      return !!(this.context.model instanceof FileUpload && this.context.model.files.length);
    }
  },
  created() {
    if (Array.isArray(this.context.model)) {
      if (typeof this.context.model[0][this.$formulate.getFileUrlKey()] === "string") {
        this.context.model = this.$formulate.createUpload({
          files: this.context.model
        }, this.context);
      }
    }
  },
  mounted() {
    if (window && this.context.preventWindowDrops) {
      window.addEventListener("dragover", this.preventDefault);
      window.addEventListener("drop", this.preventDefault);
    }
  },
  unmounted() {
    if (window && this.context.preventWindowDrops) {
      window.removeEventListener("dragover", this.preventDefault);
      window.removeEventListener("drop", this.preventDefault);
    }
  },
  methods: {
    preventDefault(e2) {
      if (e2.target.tagName !== "INPUT" && e2.target.getAttribute("type") !== "file") {
        e2 = e2 || event;
        e2.preventDefault();
      }
    },
    handleFile() {
      this.isOver = false;
      const input = this.$refs.file;
      if (input.files.length) {
        this.context.model = this.$formulate.createUpload(input, this.context);
        this.$nextTick(() => this.attemptImmediateUpload());
      }
    },
    attemptImmediateUpload() {
      if (this.context.uploadBehavior === "live" && this.context.model instanceof FileUpload) {
        this.context.hasValidationErrors().then((errors) => {
          if (!errors) {
            this.context.model.upload();
          }
        });
      }
    },
    handleDragOver(e2) {
      e2.preventDefault();
      this.isOver = true;
    },
    handleDragLeave(e2) {
      e2.preventDefault();
      this.isOver = false;
    }
  }
};
const _hoisted_1$6 = ["data-type", "data-has-files"];
const _hoisted_2$3 = ["data-has-files"];
const _hoisted_3$2 = ["data-is-drag-hover"];
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  const _component_FormulateFiles = resolveComponent("FormulateFiles");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.context.classes.element),
    "data-type": _ctx.context.type,
    "data-has-files": $options.hasFiles
  }, [
    createVNode(_component_FormulateSlot, {
      name: "prefix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.prefix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"]),
    createElementVNode("div", {
      class: normalizeClass(_ctx.context.classes.uploadArea),
      "data-has-files": $options.hasFiles
    }, [
      createElementVNode("input", mergeProps({
        ref: "file",
        "data-is-drag-hover": $data.isOver,
        type: "file"
      }, _ctx.attributes, toHandlers(_ctx.$attrs, true), {
        onBlur: _cache[0] || (_cache[0] = (...args) => _ctx.context.blurHandler && _ctx.context.blurHandler(...args)),
        onChange: _cache[1] || (_cache[1] = (...args) => $options.handleFile && $options.handleFile(...args)),
        onDragover: _cache[2] || (_cache[2] = (...args) => $options.handleDragOver && $options.handleDragOver(...args)),
        onDragleave: _cache[3] || (_cache[3] = (...args) => $options.handleDragLeave && $options.handleDragLeave(...args))
      }), null, 16, _hoisted_3$2),
      createVNode(_component_FormulateSlot, {
        name: "uploadAreaMask",
        context: _ctx.context,
        "has-files": $options.hasFiles
      }, {
        default: withCtx(() => [
          withDirectives((openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.uploadAreaMask), {
            "has-files": _ctx.context.slotComponents.uploadAreaMask === "div" ? false : $options.hasFiles,
            "data-has-files": _ctx.context.slotComponents.uploadAreaMask === "div" ? $options.hasFiles : false,
            class: normalizeClass(_ctx.context.classes.uploadAreaMask)
          }, null, 8, ["has-files", "data-has-files", "class"])), [
            [vShow, !$options.hasFiles]
          ])
        ]),
        _: 1
      }, 8, ["context", "has-files"]),
      $options.hasFiles ? (openBlock(), createBlock(_component_FormulateFiles, {
        key: 0,
        files: _ctx.context.model,
        "image-preview": _ctx.context.type === "image" && _ctx.context.imageBehavior === "preview",
        context: _ctx.context
      }, null, 8, ["files", "image-preview", "context"])) : createCommentVNode("", true)
    ], 10, _hoisted_2$3),
    createVNode(_component_FormulateSlot, {
      name: "suffix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.suffix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, _hoisted_1$6);
}
const FormulateInputFile = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9]]);
const _sfc_main$8 = {
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
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($props.context.classes.groupRepeatable)
  }, [
    $props.context.removePosition === "after" ? renderSlot(_ctx.$slots, "default", { key: 0 }) : createCommentVNode("", true),
    createVNode(_component_FormulateSlot, {
      name: "remove",
      context: $props.context,
      index: $props.index,
      "remove-item": $props.removeItem
    }, {
      default: withCtx(() => [
        (openBlock(), createBlock(resolveDynamicComponent($props.context.slotComponents.remove), mergeProps({
          context: $props.context,
          index: $props.index,
          "remove-item": $props.removeItem
        }, $props.context.slotProps.remove), null, 16, ["context", "index", "remove-item"]))
      ]),
      _: 1
    }, 8, ["context", "index", "remove-item"]),
    $props.context.removePosition === "before" ? renderSlot(_ctx.$slots, "default", { key: 1 }) : createCommentVNode("", true)
  ], 2);
}
const FormulateRepeatable = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8]]);
const _sfc_main$7 = {
  name: "FormulateInputGroup",
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  computed: {
    options() {
      return this.context.options || [];
    },
    subType() {
      return this.context.type === "group" ? "grouping" : "inputs";
    },
    optionsWithContext() {
      const _a = this.context, {
        attributes: _b
      } = _a, _c = _b, { id } = _c, groupApplicableAttributes = __objRest(_c, ["id"]), _d = _a, {
        blurHandler: blurHandler2,
        classification,
        component,
        getValidationErrors,
        hasLabel,
        hasValidationErrors,
        isSubField,
        isValid: isValid2,
        labelPosition,
        options,
        performValidation,
        setErrors,
        slotComponents: slotComponents2,
        slotProps: slotProps2,
        validationErrors,
        visibleValidationErrors: visibleValidationErrors2,
        classes: classes2,
        showValidationErrors: showValidationErrors2,
        rootEmit,
        help,
        pseudoProps: pseudoProps2,
        rules: rules2,
        model
      } = _d, context2 = __objRest(_d, [
        // The following are a list of items to pull out of the context object
        "attributes",
        "blurHandler",
        "classification",
        "component",
        "getValidationErrors",
        "hasLabel",
        "hasValidationErrors",
        "isSubField",
        "isValid",
        "labelPosition",
        "options",
        "performValidation",
        "setErrors",
        "slotComponents",
        "slotProps",
        "validationErrors",
        "visibleValidationErrors",
        "classes",
        "showValidationErrors",
        "rootEmit",
        "help",
        "pseudoProps",
        "rules",
        "model"
      ]);
      return this.options.map((option) => this.groupItemContext(
        context2,
        option,
        groupApplicableAttributes
      ));
    },
    totalItems() {
      return Array.isArray(this.context.model) && this.context.model.length > this.context.minimum ? this.context.model.length : this.context.minimum || 1;
    },
    canAddMore() {
      return this.context.repeatable && this.totalItems < this.context.limit;
    },
    labelledBy() {
      return this.context.label && `${this.context.id}_label`;
    }
  },
  methods: {
    addItem() {
      if (Array.isArray(this.context.model)) {
        const minDiff = this.context.minimum - this.context.model.length + 1;
        const toAdd = Math.max(minDiff, 1);
        for (let i2 = 0; i2 < toAdd; i2++) {
          this.context.model.push(setId({}));
        }
      } else {
        this.context.model = Array.from({ length: this.totalItems + 1 }).fill("").map(() => setId({}));
      }
      this.context.rootEmit("repeatableAdded", this.context.model);
    },
    groupItemContext(context2, option, groupAttributes) {
      const optionAttributes = { isGrouped: true };
      const ctx = Object.assign({}, context2, option, groupAttributes, optionAttributes, !context2.hasGivenName ? {
        name: true
      } : {});
      return ctx;
    }
  }
};
const _hoisted_1$5 = ["data-is-repeatable", "aria-labelledby"];
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  const _component_FormulateInput = resolveComponent("FormulateInput");
  const _component_FormulateGrouping = resolveComponent("FormulateGrouping");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($props.context.classes.element),
    "data-is-repeatable": $props.context.repeatable,
    role: "group",
    "aria-labelledby": $options.labelledBy
  }, [
    createVNode(_component_FormulateSlot, {
      name: "prefix",
      context: $props.context
    }, {
      default: withCtx(() => [
        $props.context.slotComponents.prefix ? (openBlock(), createBlock(resolveDynamicComponent($props.context.slotComponents.prefix), {
          key: 0,
          context: $props.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"]),
    $options.subType !== "grouping" ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList($options.optionsWithContext, (optionContext) => {
      return openBlock(), createBlock(_component_FormulateInput, mergeProps({
        key: optionContext.id,
        modelValue: $props.context.model,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $props.context.model = $event),
        ref_for: true
      }, optionContext, {
        "disable-errors": true,
        "prevent-deregister": true,
        class: "formulate-input-group-item",
        onBlur: $props.context.blurHandler
      }), null, 16, ["modelValue", "onBlur"]);
    }), 128)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      createVNode(_component_FormulateGrouping, { context: $props.context }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["context"]),
      $options.canAddMore ? (openBlock(), createBlock(_component_FormulateSlot, {
        key: 0,
        name: "addmore",
        context: $props.context,
        "add-more": $options.addItem
      }, {
        default: withCtx(() => [
          (openBlock(), createBlock(resolveDynamicComponent($props.context.slotComponents.addMore), mergeProps({
            context: $props.context,
            "add-more": $options.addItem
          }, $props.context.slotProps.addMore, { onAdd: $options.addItem }), null, 16, ["context", "add-more", "onAdd"]))
        ]),
        _: 1
      }, 8, ["context", "add-more"])) : createCommentVNode("", true)
    ], 64)),
    createVNode(_component_FormulateSlot, {
      name: "suffix",
      context: $props.context
    }, {
      default: withCtx(() => [
        $props.context.slotComponents.suffix ? (openBlock(), createBlock(resolveDynamicComponent($props.context.slotComponents.suffix), {
          key: 0,
          context: $props.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, _hoisted_1$5);
}
const FormulateInputGroup = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
const _sfc_main$6 = {
  name: "FormulateInputButton",
  mixins: [FormulateInputMixin]
};
const _hoisted_1$4 = ["data-type"];
const _hoisted_2$2 = ["type"];
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.context.classes.element),
    "data-type": _ctx.context.type
  }, [
    createVNode(_component_FormulateSlot, {
      name: "prefix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.prefix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"]),
    createElementVNode("button", mergeProps({ type: _ctx.type }, _ctx.attributes, toHandlers(_ctx.$attrs, true)), [
      renderSlot(_ctx.$slots, "default", { context: _ctx.context }, () => [
        (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.buttonContent), { context: _ctx.context }, null, 8, ["context"]))
      ])
    ], 16, _hoisted_2$2),
    createVNode(_component_FormulateSlot, {
      name: "suffix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.suffix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, _hoisted_1$4);
}
const FormulateInputButton = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
const _sfc_main$5 = {
  name: "FormulateInputSelect",
  mixins: [FormulateInputMixin],
  computed: {
    options() {
      return this.context.options || {};
    },
    optionGroups() {
      return this.context.optionGroups || false;
    },
    placeholderSelected() {
      return !!(!this.hasValue && this.context.attributes && this.context.attributes.placeholder);
    }
  }
};
const _hoisted_1$3 = ["data-type", "data-multiple"];
const _hoisted_2$1 = ["data-placeholder-selected"];
const _hoisted_3$1 = ["selected"];
const _hoisted_4 = ["value", "disabled", "textContent"];
const _hoisted_5 = ["label"];
const _hoisted_6 = ["value", "disabled", "textContent"];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.context.classes.element),
    "data-type": _ctx.context.type,
    "data-multiple": _ctx.attributes && _ctx.attributes.multiple !== void 0
  }, [
    createVNode(_component_FormulateSlot, {
      name: "prefix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.prefix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"]),
    withDirectives(createElementVNode("select", mergeProps({
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.context.model = $event)
    }, _ctx.attributes, { "data-placeholder-selected": $options.placeholderSelected }, toHandlers(_ctx.$attrs, true), {
      onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.context.blurHandler && _ctx.context.blurHandler(...args))
    }), [
      _ctx.context.placeholder ? (openBlock(), createElementBlock("option", {
        key: 0,
        value: "",
        hidden: "hidden",
        disabled: "",
        selected: !_ctx.hasValue
      }, toDisplayString(_ctx.context.placeholder), 9, _hoisted_3$1)) : createCommentVNode("", true),
      !$options.optionGroups ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList($options.options, (option) => {
        return openBlock(), createElementBlock("option", mergeProps({
          key: option.id,
          value: option.value,
          disabled: !!option.disabled,
          ref_for: true
        }, option.attributes || option.attrs || {}, {
          textContent: toDisplayString(option.label)
        }), null, 16, _hoisted_4);
      }), 128)) : (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList($options.optionGroups, (subOptions, label) => {
        return openBlock(), createElementBlock("optgroup", {
          key: label,
          label
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(subOptions, (option) => {
            return openBlock(), createElementBlock("option", mergeProps({
              key: option.id,
              value: option.value,
              disabled: !!option.disabled,
              ref_for: true
            }, option.attributes || option.attrs || {}, {
              textContent: toDisplayString(option.label)
            }), null, 16, _hoisted_6);
          }), 128))
        ], 8, _hoisted_5);
      }), 128))
    ], 16, _hoisted_2$1), [
      [vModelSelect, _ctx.context.model]
    ]),
    createVNode(_component_FormulateSlot, {
      name: "suffix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.suffix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, _hoisted_1$3);
}
const FormulateInputSelect = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
const _sfc_main$4 = {
  name: "FormulateInputSlider",
  mixins: [FormulateInputMixin]
};
const _hoisted_1$2 = ["data-type"];
const _hoisted_2 = ["type"];
const _hoisted_3 = ["textContent"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.context.classes.element),
    "data-type": _ctx.context.type
  }, [
    createVNode(_component_FormulateSlot, {
      name: "prefix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.prefix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"]),
    withDirectives(createElementVNode("input", mergeProps({
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.context.model = $event),
      type: _ctx.type
    }, _ctx.attributes, toHandlers(_ctx.$attrs, true), {
      onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.context.blurHandler && _ctx.context.blurHandler(...args))
    }), null, 16, _hoisted_2), [
      [vModelDynamic, _ctx.context.model]
    ]),
    _ctx.context.showValue ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(_ctx.context.classes.rangeValue),
      textContent: toDisplayString(_ctx.context.model)
    }, null, 10, _hoisted_3)) : createCommentVNode("", true),
    createVNode(_component_FormulateSlot, {
      name: "suffix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.suffix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, _hoisted_1$2);
}
const FormulateInputSlider = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
const _sfc_main$3 = {
  props: {
    context: {
      type: Object,
      required: true
    }
  }
};
const _hoisted_1$1 = ["textContent"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", {
    class: normalizeClass(`formulate-input-element--${$props.context.type}--label`),
    textContent: toDisplayString($props.context.value || $props.context.label || $props.context.name || "Submit")
  }, null, 10, _hoisted_1$1);
}
const FormulateButtonContent = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = {
  name: "FormulateInputTextArea",
  mixins: [FormulateInputMixin]
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.context.classes.element),
    "data-type": "textarea"
  }, [
    createVNode(_component_FormulateSlot, {
      name: "prefix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.prefix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.prefix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"]),
    withDirectives(createElementVNode("textarea", mergeProps({
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.context.model = $event)
    }, _ctx.attributes, toHandlers(_ctx.$attrs, true), {
      onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.context.blurHandler && _ctx.context.blurHandler(...args))
    }), null, 16), [
      [vModelText, _ctx.context.model]
    ]),
    createVNode(_component_FormulateSlot, {
      name: "suffix",
      context: _ctx.context
    }, {
      default: withCtx(() => [
        _ctx.context.slotComponents.suffix ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.context.slotComponents.suffix), {
          key: 0,
          context: _ctx.context
        }, null, 8, ["context"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["context"])
  ], 2);
}
const FormulateInputTextArea = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = {
  provide() {
    return __spreadProps(__spreadValues({}, useRegistryProviders(this, ["getFormValues"])), {
      formulateSetter: (field, value) => this.setGroupValue(field, value)
    });
  },
  inject: {
    registerProvider: "registerProvider",
    deregisterProvider: "deregisterProvider"
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
  emits: ["remove", "validation"],
  data() {
    return __spreadProps(__spreadValues({}, useRegistry(this)), {
      isGrouping: true
    });
  },
  computed: __spreadProps(__spreadValues({}, useRegistryComputed()), {
    mergedFieldErrors() {
      return this.errors;
    }
  }),
  watch: __spreadProps(__spreadValues({}, useRegistryWatchers()), {
    "context.model": {
      handler(values) {
        if (!equals(values[this.index], this.proxy, true)) {
          this.setValues(values[this.index]);
        }
      },
      deep: true
    }
  }),
  created() {
    this.applyInitialValues();
    this.registerProvider(this);
  },
  beforeUnmount() {
    this.preventCleanup = true;
    this.deregisterProvider(this);
  },
  methods: __spreadProps(__spreadValues({}, useRegistryMethods()), {
    setGroupValue(field, value) {
      if (!equals(this.proxy[field], value, true)) {
        this.setFieldValue(field, value);
      }
    },
    removeItem() {
      this.$emit("remove", this.index);
    }
  })
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormulateSlot = resolveComponent("FormulateSlot");
  return openBlock(), createBlock(_component_FormulateSlot, {
    name: "repeatable",
    context: $props.context,
    index: $props.index,
    "remove-item": $options.removeItem
  }, {
    default: withCtx(() => [
      (openBlock(), createBlock(resolveDynamicComponent($props.context.slotComponents.repeatable), mergeProps({
        context: $props.context,
        index: $props.index,
        "remove-item": $options.removeItem
      }, $props.context.slotProps.repeatable), {
        default: withCtx(() => [
          createVNode(_component_FormulateSlot, {
            context: $props.context,
            index: $props.index,
            name: "default"
          }, null, 8, ["context", "index"])
        ]),
        _: 1
      }, 16, ["context", "index", "remove-item"]))
    ]),
    _: 1
  }, 8, ["context", "index", "remove-item"]);
}
const FormulateRepeatableProvider = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = {
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
const _hoisted_1 = ["data-disabled", "textContent"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return $props.context.repeatable ? (openBlock(), createElementBlock("a", {
    key: 0,
    class: normalizeClass($props.context.classes.groupRepeatableRemove),
    "data-disabled": $props.context.model.length <= $props.context.minimum,
    role: "button",
    onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $props.removeItem && $props.removeItem(...args), ["prevent"])),
    onKeypress: _cache[1] || (_cache[1] = withKeys((...args) => $props.removeItem && $props.removeItem(...args), ["enter"])),
    textContent: toDisplayString($props.context.removeLabel)
  }, null, 42, _hoisted_1)) : createCommentVNode("", true);
}
const FormulateRepeatableRemove = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
class Formulate {
  /**
   * Instantiate our base options.
   */
  constructor() {
    this.options = {};
    this.defaults = {
      components: {
        FormulateSlot,
        FormulateForm,
        FormulateFile,
        FormulateHelp,
        FormulateLabel,
        FormulateInput,
        FormulateErrors,
        FormulateSchema,
        FormulateAddMore,
        FormulateGrouping,
        FormulateInputBox,
        FormulateInputText,
        FormulateInputFile,
        FormulateErrorList,
        FormulateRepeatable,
        FormulateInputGroup,
        FormulateInputButton,
        FormulateInputSelect,
        FormulateInputSlider,
        FormulateButtonContent,
        FormulateInputTextArea,
        FormulateRepeatableRemove,
        FormulateRepeatableProvider
      },
      slotComponents: {
        addMore: "FormulateAddMore",
        buttonContent: "FormulateButtonContent",
        errorList: "FormulateErrorList",
        errors: "FormulateErrors",
        file: "FormulateFile",
        help: "FormulateHelp",
        label: "FormulateLabel",
        prefix: false,
        remove: "FormulateRepeatableRemove",
        repeatable: "FormulateRepeatable",
        suffix: false,
        uploadAreaMask: "div"
      },
      slotProps: {},
      library,
      rules,
      mimes,
      locale: false,
      uploader: fauxUploader,
      uploadUrl: false,
      fileUrlKey: "url",
      uploadJustCompleteDuration: 1e3,
      errorHandler: (err) => err,
      plugins: [c],
      locales: {},
      failedValidation: () => false,
      idPrefix: "formulate-",
      baseClasses: (b) => b,
      coreClasses,
      classes: {},
      useInputDecorators: true,
      validationNameStrategy: false
    };
    this.registry = /* @__PURE__ */ new Map();
    this.idRegistry = {};
  }
  /**
   * Install vue formulate, and register it’s components.
   */
  install(Vue, options) {
    this.options = this.defaults;
    var plugins = this.defaults.plugins;
    if (options && Array.isArray(options.plugins) && options.plugins.length) {
      plugins = plugins.concat(options.plugins);
    }
    plugins.forEach(
      (plugin) => typeof plugin === "function" ? plugin(this) : null
    );
    this.extend(options || {});
    for (var componentName in this.options.components) {
      Vue.component(componentName, this.options.components[componentName]);
    }
  }
  /**
   * Produce a deterministically generated id based on the sequence by which it
   * was requested. This should be *theoretically* the same SSR as client side.
   * However, SSR and deterministic ids can be very challenging, so this
   * implementation is open to community review.
   */
  nextId(vm) {
    const path = vm.$route && vm.$route.path ? vm.$route.path : false;
    const pathPrefix = path ? vm.$route.path.replace(/[/\\.\s]/g, "-") : "global";
    if (!Object.prototype.hasOwnProperty.call(this.idRegistry, pathPrefix)) {
      this.idRegistry[pathPrefix] = 0;
    }
    return `${this.options.idPrefix}${pathPrefix}-${++this.idRegistry[pathPrefix]}`;
  }
  /**
   * Given a set of options, apply them to the pre-existing options.
   * @param {object} extendWith
   */
  extend(extendWith) {
    if (typeof extendWith === "object") {
      this.options = this.merge(this.options, extendWith);
      return this;
    }
    throw new Error(
      `Formulate.extend expects an object, was ${typeof extendWith}`
    );
  }
  /**
   * Create a new object by copying properties of base and mergeWith.
   * Note: arrays don't overwrite - they push
   *
   * @param {object} base
   * @param {object} mergeWith
   * @param {boolean} concatArrays
   */
  merge(base, mergeWith, concatArrays = true) {
    var merged = {};
    for (var key in base) {
      if (Object.prototype.hasOwnProperty.call(mergeWith, key)) {
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
      if (!Object.prototype.hasOwnProperty.call(merged, prop)) {
        merged[prop] = mergeWith[prop];
      }
    }
    return merged;
  }
  /**
   * Determine what "class" of input this element is given the "type".
   * @param {string} type
   */
  classify(type) {
    if (Object.prototype.hasOwnProperty.call(this.options.library, type)) {
      return this.options.library[type].classification;
    }
    return "unknown";
  }
  /**
   * Generate all classes for a particular context.
   * @param {object} classContext
   */
  classes(classContext) {
    const coreClasses2 = this.options.coreClasses(classContext);
    const baseClasses = this.options.baseClasses(coreClasses2, classContext);
    return Object.keys(baseClasses).reduce((classMap, key) => {
      let classesForKey = applyClasses(
        baseClasses[key],
        this.options.classes[key],
        classContext
      );
      classesForKey = applyClasses(
        classesForKey,
        classContext[`${key}Class`],
        classContext
      );
      classesForKey = applyStates(
        key,
        classesForKey,
        this.options.classes,
        classContext
      );
      return Object.assign(classMap, { [key]: classesForKey });
    }, {});
  }
  /**
   * Given a particular type, report any "additional" props to pass to the
   * various slots.
   * @param {string} type
   * @return {Array}
   */
  typeProps(type) {
    const extract = (obj) => Object.keys(obj).reduce((props2, slot) => {
      return Array.isArray(obj[slot]) ? props2.concat(obj[slot]) : props2;
    }, []);
    const props = extract(this.options.slotProps);
    return this.options.library[type] ? props.concat(extract(this.options.library[type].slotProps || {})) : props;
  }
  /**
   * Given a type and a slot, get the relevant slot props object.
   * @param {string} type
   * @param {string} slot
   * @return {object}
   */
  slotProps(type, slot, typeProps2) {
    let props = Array.isArray(this.options.slotProps[slot]) ? this.options.slotProps[slot] : [];
    const def = this.options.library[type];
    if (def && def.slotProps && Array.isArray(def.slotProps[slot])) {
      props = props.concat(def.slotProps[slot]);
    }
    return props.reduce(
      (props2, prop) => Object.assign(props2, { [prop]: typeProps2[prop] }),
      {}
    );
  }
  /**
   * Determine what type of component to render given the "type".
   * @param {string} type
   */
  component(type) {
    if (Object.prototype.hasOwnProperty.call(this.options.library, type)) {
      return this.options.library[type].component;
    }
    return false;
  }
  /**
   * What component should be rendered for the given slot location and type.
   * @param {string} type the type of component
   * @param {string} slot the name of the slot
   */
  slotComponent(type, slot) {
    const def = this.options.library[type];
    if (def && def.slotComponents && def.slotComponents[slot]) {
      return def.slotComponents[slot];
    }
    return this.options.slotComponents[slot];
  }
  /**
   * Get validation rules by merging any passed in with global rules.
   * @return {object} object of validation functions
   */
  rules(rules2 = {}) {
    return __spreadValues(__spreadValues({}, this.options.rules), rules2);
  }
  /**
   * Attempt to get the vue-i18n configured locale.
   */
  i18n(vm) {
    if (vm.$i18n) {
      switch (typeof vm.$i18n.locale) {
        case "string":
          return vm.$i18n.locale;
        case "function":
          return vm.$i18n.locale();
      }
    }
    return false;
  }
  /**
   * Select the proper locale to use.
   */
  getLocale(vm) {
    if (!this.selectedLocale) {
      this.selectedLocale = [this.options.locale, this.i18n(vm), "en"].reduce(
        (selection, locale) => {
          if (selection) {
            return selection;
          }
          if (locale) {
            const option = parseLocale(locale).find(
              (locale2) => has(this.options.locales, locale2)
            );
            if (option) {
              selection = option;
            }
          }
          return selection;
        },
        false
      );
    }
    return this.selectedLocale;
  }
  /**
   * Change the locale to a pre-registered one.
   * @param {string} locale
   */
  setLocale(locale) {
    if (has(this.options.locales, locale)) {
      this.options.locale = locale;
      this.selectedLocale = locale;
      this.registry.forEach((form, name) => {
        form.hasValidationErrors();
      });
    }
  }
  /**
   * Get the validation message for a particular error.
   */
  validationMessage(rule, validationContext, vm) {
    const generators = this.options.locales[this.getLocale(vm)];
    if (Object.prototype.hasOwnProperty.call(generators, rule)) {
      return generators[rule](validationContext);
    }
    if (Object.prototype.hasOwnProperty.call(generators, "default")) {
      return generators.default(validationContext);
    }
    return "Invalid field value";
  }
  /**
   * Given an instance of a FormulateForm register it.
   * @param {vm} form
   */
  register(form) {
    if (form.$options.name === "FormulateForm" && form.name) {
      this.registry.set(form.name, form);
    }
  }
  /**
   * Given an instance of a form, remove it from the registry.
   * @param {vm} form
   */
  deregister(form) {
    if (form.$options.name === "FormulateForm" && form.name && this.registry.has(form.name)) {
      this.registry.delete(form.name);
    }
  }
  /**
   * Given an array, this function will attempt to make sense of the given error
   * and hydrate a form with the resulting errors.
   *
   * @param {error} err
   * @param {string} formName
   * @param {error} skip
   */
  handle(err, formName, skip = false) {
    const e2 = skip ? err : this.options.errorHandler(err, formName);
    if (formName && this.registry.has(formName)) {
      this.registry.get(formName).applyErrors({
        formErrors: arrayify(e2.formErrors),
        inputErrors: e2.inputErrors || {}
      });
    }
    return e2;
  }
  /**
   * Reset a form.
   * @param {string} formName
   * @param {object} initialValue
   */
  reset(formName, initialValue = {}) {
    this.resetValidation(formName);
    this.setValues(formName, initialValue);
  }
  /**
   * Submit a named form.
   * @param {string} formName
   */
  submit(formName) {
    const form = this.registry.get(formName);
    form.formSubmitted();
  }
  /**
   * Reset the form's validation messages.
   * @param {string} formName
   */
  resetValidation(formName) {
    const form = this.registry.get(formName);
    form.hideErrors(formName);
    form.namedErrors = [];
    form.namedFieldErrors = {};
  }
  /**
   * Set the form values.
   * @param {string} formName
   * @param {object} values
   */
  setValues(formName, values) {
    if (values && !Array.isArray(values) && typeof values === "object") {
      const form = this.registry.get(formName);
      form.setValues(__spreadValues({}, values));
    }
  }
  /**
   * Get the file uploader.
   */
  getUploader() {
    return this.options.uploader || false;
  }
  /**
   * Get the global upload url.
   */
  getUploadUrl() {
    return this.options.uploadUrl || false;
  }
  /**
   * When re-hydrating a file uploader with an array, get the sub-object key to
   * access the url of the file. Usually this is just "url".
   */
  getFileUrlKey() {
    return this.options.fileUrlKey || "url";
  }
  /**
   * Create a new instance of an upload.
   */
  createUpload(fileList, context2) {
    return new FileUpload(fileList, context2, this.options);
  }
  /**
   * A FormulateForm failed to submit due to existing validation errors.
   */
  failedValidation(form) {
    return this.options.failedValidation(this);
  }
}
export {
  Formulate as default
};
//# sourceMappingURL=formulate.mjs.map
