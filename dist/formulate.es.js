var ke = Object.defineProperty, Ie = Object.defineProperties;
var je = Object.getOwnPropertyDescriptors;
var W = Object.getOwnPropertySymbols;
var le = Object.prototype.hasOwnProperty, ue = Object.prototype.propertyIsEnumerable;
var ae = (e, t, r) => t in e ? ke(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, f = (e, t) => {
  for (var r in t || (t = {}))
    le.call(t, r) && ae(e, r, t[r]);
  if (W)
    for (var r of W(t))
      ue.call(t, r) && ae(e, r, t[r]);
  return e;
}, F = (e, t) => Ie(e, je(t));
var Z = (e) => typeof e == "symbol" ? e : e + "", I = (e, t) => {
  var r = {};
  for (var s in e)
    le.call(e, s) && t.indexOf(s) < 0 && (r[s] = e[s]);
  if (e != null && W)
    for (var s of W(e))
      t.indexOf(s) < 0 && ue.call(e, s) && (r[s] = e[s]);
  return r;
};
import { resolveComponent as V, openBlock as l, createElementBlock as c, mergeProps as g, withModifiers as me, createBlock as h, toHandlers as R, createCommentVNode as d, renderSlot as $, normalizeProps as U, guardReactiveProps as J, normalizeClass as p, createElementVNode as S, resolveDynamicComponent as m, withCtx as b, toDisplayString as C, normalizeStyle as De, Fragment as _, renderList as N, createVNode as v, withDirectives as G, vModelRadio as Re, vModelCheckbox as Le, vModelDynamic as ye, createTextVNode as Me, vShow as Ue, vModelSelect as _e, vModelText as Be, withKeys as Ne } from "vue";
const Ge = "FormulateInput", j = (e, t) => ({
  classification: e,
  component: Ge + (t || e[0].toUpperCase() + e.substr(1))
}), Te = F(f({}, [
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
].reduce((e, t) => F(f({}, e), { [t]: j("text") }), {})), {
  // === SLIDER INPUTS
  range: j("slider"),
  // === MULTI LINE TEXT INPUTS
  textarea: j("textarea", "TextArea"),
  // === BOX STYLE INPUTS
  checkbox: j("box"),
  radio: j("box"),
  // === BUTTON STYLE INPUTS
  submit: j("button"),
  button: j("button"),
  // === SELECT STYLE INPUTS
  select: j("select"),
  // === FILE TYPE
  file: j("file"),
  image: j("file"),
  // === GROUP TYPE
  group: j("group")
});
function qe(e, t) {
  const r = {};
  for (let s in e)
    r[s] = t(s, e[s]);
  return r;
}
function A(e, t, r = !1) {
  if (e === t)
    return !0;
  if (!e || !t)
    return !1;
  if (typeof e != "object" && typeof t != "object")
    return e === t;
  const s = Object.keys(e), i = Object.keys(t), o = s.length;
  if (i.length !== o)
    return !1;
  for (let n = 0; n < o; n++) {
    const a = s[n];
    if (!r && e[a] !== t[a] || r && !A(e[a], t[a], r))
      return !1;
  }
  return !0;
}
function L(e) {
  return typeof e == "string" ? e.replace(/([_-][a-z0-9])/ig, (t) => e.indexOf(t) !== 0 && !/[_-]/.test(e[e.indexOf(t) - 1]) ? t.toUpperCase().replace(/[_-]/, "") : t) : e;
}
function se(e) {
  return typeof e == "string" ? e[0].toUpperCase() + e.substr(1) : e;
}
function O(e) {
  return e ? typeof e == "string" ? [e] : Array.isArray(e) ? e : typeof e == "object" ? Object.values(e) : [] : [];
}
function te(e, t) {
  return typeof e == "string" ? te(e.split("|"), t) : Array.isArray(e) ? e.map((r) => He(r, t)).filter((r) => !!r) : [];
}
function He(e, t) {
  if (typeof e == "function")
    return [e, []];
  if (Array.isArray(e) && e.length) {
    e = e.map((i) => i);
    const [r, s] = de(e.shift());
    if (typeof r == "string" && t.hasOwnProperty(r))
      return [t[r], e, r, s];
    if (typeof r == "function")
      return [r, e, r, s];
  }
  if (typeof e == "string" && e) {
    const r = e.split(":"), [s, i] = de(r.shift());
    if (t.hasOwnProperty(s))
      return [t[s], r.length ? r.join(":").split(",") : [], s, i];
    throw new Error(`Unknown validation rule ${e}`);
  }
  return !1;
}
function de(e) {
  return /^[\^]/.test(e.charAt(0)) ? [L(e.substr(1)), e.charAt(0)] : [L(e), null];
}
function Ke(e) {
  const t = [], r = e.findIndex(([, , i]) => i.toLowerCase() === "bail"), s = e.findIndex(([, , i]) => i.toLowerCase() === "optional");
  if (s >= 0) {
    const i = e.splice(s, 1);
    t.push(Object.defineProperty(i, "bail", { value: !0 }));
  }
  if (r >= 0) {
    const i = e.splice(0, r + 1).slice(0, -1);
    i.length && t.push(i), e.map((o) => t.push(Object.defineProperty([o], "bail", { value: !0 })));
  } else
    t.push(e);
  return t.reduce((i, o) => {
    const n = (a, u = !1) => {
      if (a.length < 2)
        return Object.defineProperty([a], "bail", { value: u });
      const y = [], P = a.findIndex(([, , , k]) => k === "^");
      if (P >= 0) {
        const k = a.splice(0, P);
        k.length && y.push(...n(k, u)), y.push(Object.defineProperty([a.shift()], "bail", { value: !0 })), a.length && y.push(...n(a, u));
      } else
        y.push(a);
      return y;
    };
    return i.concat(n(o));
  }, []);
}
function ze(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ye(e) {
  let t = `^${ze(e)}$`;
  const r = {
    MM: "(0[1-9]|1[012])",
    M: "([1-9]|1[012])",
    DD: "([012][0-9]|3[01])",
    D: "([012]?[0-9]|3[01])",
    YYYY: "\\d{4}",
    YY: "\\d{2}"
  };
  return new RegExp(Object.keys(r).reduce((s, i) => s.replace(i, r[i]), t));
}
function We(e) {
  return e.split("-").reduce((r, s) => (r.length && r.unshift(`${r[0]}-${s}`), r.length ? r : [s]), []);
}
function x(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
function z(e, t) {
  return !x(e, "__id") || t ? Object.defineProperty(e, "__id", Object.assign(/* @__PURE__ */ Object.create(null), { value: t || ge(9) })) : e;
}
function M(e) {
  return typeof e == "number" ? !1 : e === void 0 || e === "" || e === null || e === !1 || Array.isArray(e) && !e.some((t) => !M(t)) || e && !Array.isArray(e) && typeof e == "object" && M(Object.values(e));
}
function ie(e, t) {
  return Object.keys(e).reduce((r, s) => {
    const i = L(s);
    return t.includes(i) && (r[i] = e[s]), r;
  }, {});
}
function Ze(e, t = 0) {
  let r = 3735928559 ^ t, s = 1103547991 ^ t;
  for (let i = 0, o; i < e.length; i++)
    o = e.charCodeAt(i), r = Math.imul(r ^ o, 2654435761), s = Math.imul(s ^ o, 1597334677);
  return r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(s ^ s >>> 13, 3266489909), s = Math.imul(s ^ s >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), 4294967296 * (2097151 & s) + (r >>> 0);
}
function Je() {
  let e;
  return function(r, s, i) {
    e && clearTimeout(e), e = setTimeout(() => r.call(this, ...s), i);
  };
}
function ge(e = 13) {
  return Math.random().toString(36).substring(2, e + 2);
}
const Qe = /^(?:\w+:)?\/\/(\S+)$/, Xe = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/, et = /^[^\s.]+\.\S{2,}$/;
function tt(e) {
  if (typeof e != "string")
    return !1;
  const t = e.match(Qe);
  if (!t)
    return !1;
  const r = t[1];
  return r ? !!(Xe.test(r) || et.test(r)) : !1;
}
class B {
  /**
   * Create a file upload object.
   * @param {FileList} fileList
   * @param {object} context
   */
  constructor(t, r, s = {}) {
    this.input = t, this.fileList = t.files, this.files = [], this.options = f({
      mimes: {}
    }, s), this.results = !1, this.context = r, this.dataTransferCheck(), r && r.uploadUrl && (this.options.uploadUrl = r.uploadUrl), this.uploadPromise = null, Array.isArray(this.fileList) ? this.rehydrateFileList(this.fileList) : this.addFileList(this.fileList);
  }
  /**
   * Given a pre-existing array of files, create a faux FileList.
   * @param {array} items expects an array of objects [{ url: '/uploads/file.pdf' }]
   * @param {string} pathKey the object-key to access the url (defaults to "url")
   */
  rehydrateFileList(t) {
    const r = t.reduce((s, i) => {
      const o = this.options ? this.options.fileUrlKey : "url", n = i[o], a = n && n.lastIndexOf(".") !== -1 ? n.substr(n.lastIndexOf(".") + 1) : !1, u = this.options.mimes[a] || !1;
      return s.push(Object.assign({}, i, n ? {
        name: i.name || n.substr(n.lastIndexOf("/") + 1 || 0),
        type: i.type ? i.type : u,
        previewData: n
      } : {})), s;
    }, []);
    this.addFileList(r), this.results = this.mapUUID(t);
  }
  /**
   * Produce an array of files and alert the callback.
   * @param {FileList}
   */
  addFileList(t) {
    for (let r = 0; r < t.length; r++) {
      const s = t[r], i = ge(), o = function() {
        this.removeFile(i);
      };
      this.files.push({
        progress: !1,
        error: !1,
        complete: !1,
        justFinished: !1,
        name: s.name || "file-upload",
        file: s,
        uuid: i,
        path: !1,
        removeFile: o.bind(this),
        previewData: s.previewData || !1
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
    return !!(this.hasUploader() && typeof this.context.uploader.request == "function" && typeof this.context.uploader.get == "function" && typeof this.context.uploader.delete == "function" && typeof this.context.uploader.post == "function");
  }
  /**
   * Get a new uploader function.
   */
  getUploader(...t) {
    if (this.uploaderIsAxios()) {
      const r = new FormData();
      if (r.append(this.context.name || "file", t[0]), this.context.uploadUrl === !1)
        throw new Error("No uploadURL specified: https://vueformulate.com/guide/inputs/file/#props");
      return this.context.uploader.post(this.context.uploadUrl, r, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (s) => {
          t[1](Math.round(s.loaded * 100 / s.total));
        }
      }).then((s) => s.data).catch((s) => t[2](s));
    }
    return this.context.uploader(...t);
  }
  /**
   * Perform the file upload.
   */
  upload() {
    return this.uploadPromise = this.uploadPromise ? this.uploadPromise.then(() => this.__performUpload()) : this.__performUpload(), this.uploadPromise;
  }
  /**
   * Perform the actual upload event. Intended to be a private method that is
   * only called through the upload() function as chaining utility.
   */
  __performUpload() {
    return new Promise((t, r) => {
      if (!this.hasUploader())
        return r(new Error("No uploader has been defined"));
      Promise.all(this.files.map((s) => (s.error = !1, s.complete = !!s.path, s.path ? Promise.resolve(s.path) : this.getUploader(
        s.file,
        (i) => {
          s.progress = i, this.context.rootEmit("file-upload-progress", i), i >= 100 && (s.complete || (s.justFinished = !0, setTimeout(() => {
            s.justFinished = !1;
          }, this.options.uploadJustCompleteDuration)), s.complete = !0, this.context.rootEmit("file-upload-complete", s));
        },
        (i) => {
          s.progress = 0, s.error = i, s.complete = !0, this.context.rootEmit("file-upload-error", i), r(i);
        },
        this.options
      )))).then((s) => {
        this.results = this.mapUUID(s), t(s);
      }).catch((s) => {
        throw new Error(s);
      });
    });
  }
  /**
   * Remove a file from the uploader (and the file list)
   * @param {string} uuid
   */
  removeFile(t) {
    const r = this.files.length;
    if (this.files = this.files.filter((s) => s && s.uuid !== t), Array.isArray(this.results) && (this.results = this.results.filter((s) => s && s.__id !== t)), this.context.performValidation(), window && this.fileList instanceof FileList && this.supportsDataTransfers) {
      const s = new DataTransfer();
      this.files.forEach((i) => s.items.add(i.file)), this.fileList = s.files, this.input.files = this.fileList;
    } else
      this.fileList = this.fileList.filter((s) => s && s.__id !== t);
    r > this.files.length && this.context.rootEmit("file-removed", this.files);
  }
  /**
   * Given another input element, add the files from that FileList to the
   * input being represented by this FileUpload.
   *
   * @param {HTMLElement} input
   */
  mergeFileList(t) {
    if (this.addFileList(t.files), this.supportsDataTransfers) {
      const r = new DataTransfer();
      this.files.forEach((s) => {
        s.file instanceof File && r.items.add(s.file);
      }), this.fileList = r.files, this.input.files = this.fileList, t.files = new DataTransfer().files;
    }
    this.context.performValidation(), this.loadPreviews(), this.context.uploadBehavior !== "delayed" && this.upload();
  }
  /**
   * load image previews for all uploads.
   */
  loadPreviews() {
    this.files.map((t) => {
      if (!t.previewData && window && window.FileReader && /^image\//.test(t.file.type)) {
        const r = new FileReader();
        r.onload = (s) => Object.assign(t, { previewData: s.target.result }), r.readAsDataURL(t.file);
      }
    });
  }
  /**
   * Check if the current browser supports the DataTransfer constructor.
   */
  dataTransferCheck() {
    try {
      new DataTransfer(), this.supportsDataTransfers = !0;
    } catch (t) {
      this.supportsDataTransfers = !1;
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
   * @param {array} items expects an array of objects [{ url: '/uploads/file.pdf' }]
   */
  mapUUID(t) {
    return t.map((r, s) => (this.files[s].path = r !== void 0 ? r : !1, r && z(r, this.files[s].uuid)));
  }
  toString() {
    const t = this.files.length ? this.files.length + " files" : "empty";
    return this.results ? JSON.stringify(this.results, null, "  ") : `FileUpload(${t})`;
  }
}
const rt = {
  /**
   * Rule: the value must be "yes", "on", "1", or true
   */
  accepted: function({ value: e }) {
    return Promise.resolve(["yes", "on", "1", 1, !0, "true"].includes(e));
  },
  /**
   * Rule: checks if a value is after a given date. Defaults to current time
   */
  after: function({ value: e }, t = !1) {
    const r = Date.parse(t || /* @__PURE__ */ new Date()), s = Date.parse(e);
    return Promise.resolve(isNaN(s) ? !1 : s > r);
  },
  /**
   * Rule: checks if the value is only alpha
   */
  alpha: function({ value: e }, t = "default") {
    const r = {
      default: /^[a-zA-ZÀ-ÖØ-öø-ÿĄąĆćĘęŁłŃńŚśŹźŻż]+$/,
      latin: /^[a-zA-Z]+$/
    }, s = r.hasOwnProperty(t) ? t : "default";
    return Promise.resolve(r[s].test(e));
  },
  /**
   * Rule: checks if the value is alpha numeric
   */
  alphanumeric: function({ value: e }, t = "default") {
    const r = {
      default: /^[a-zA-Z0-9À-ÖØ-öø-ÿĄąĆćĘęŁłŃńŚśŹźŻż]+$/,
      latin: /^[a-zA-Z0-9]+$/
    }, s = r.hasOwnProperty(t) ? t : "default";
    return Promise.resolve(r[s].test(e));
  },
  /**
   * Rule: checks if a value is after a given date. Defaults to current time
   */
  before: function({ value: e }, t = !1) {
    const r = Date.parse(t || /* @__PURE__ */ new Date()), s = Date.parse(e);
    return Promise.resolve(isNaN(s) ? !1 : s < r);
  },
  /**
   * Rule: checks if the value is between two other values
   */
  between: function({ value: e }, t = 0, r = 10, s) {
    return Promise.resolve(t === null || r === null || isNaN(t) || isNaN(r) ? !1 : !isNaN(e) && s !== "length" || s === "value" ? (e = Number(e), t = Number(t), r = Number(r), e > t && e < r) : typeof e == "string" || s === "length" ? (e = isNaN(e) ? e : e.toString(), e.length > t && e.length < r) : !1);
  },
  /**
   * Confirm that the value of one field is the same as another, mostly used
   * for password confirmations.
   */
  confirm: function({ value: e, getGroupValues: t, name: r }, s) {
    return Promise.resolve((() => {
      const i = t();
      var o = s;
      return o || (o = /_confirm$/.test(r) ? r.substr(0, r.length - 8) : `${r}_confirm`), i[o] === e;
    })());
  },
  /**
   * Rule: ensures the value is a date according to Date.parse(), or a format
   * regex.
   */
  date: function({ value: e }, t = !1) {
    return Promise.resolve(t && typeof t == "string" ? Ye(t).test(e) : !isNaN(Date.parse(e)));
  },
  /**
   * Rule: tests
   */
  email: function({ value: e }) {
    const t = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return Promise.resolve(t.test(e));
  },
  /**
   * Rule: Value ends with one of the given Strings
   */
  endsWith: function({ value: e }, ...t) {
    return Promise.resolve(typeof e == "string" && t.length ? t.find((r) => e.endsWith(r)) !== void 0 : typeof e == "string" && t.length === 0);
  },
  /**
   * Rule: Value is in an array (stack).
   */
  in: function({ value: e }, ...t) {
    return Promise.resolve(t.find((r) => typeof r == "object" ? A(r, e) : r === e) !== void 0);
  },
  /**
   * Rule: Match the value against a (stack) of patterns or strings
   */
  matches: function({ value: e }, ...t) {
    return Promise.resolve(!!t.find((r) => (typeof r == "string" && r.substr(0, 1) === "/" && r.substr(-1) === "/" && (r = new RegExp(r.substr(1, r.length - 2))), r instanceof RegExp ? r.test(e) : r === e)));
  },
  /**
   * Check the file type is correct.
   */
  mime: function({ value: e }, ...t) {
    return Promise.resolve((() => {
      if (e instanceof B) {
        const r = e.getFiles();
        for (let s = 0; s < r.length; s++) {
          const i = r[s].file;
          if (!t.includes(i.type))
            return !1;
        }
      }
      return !0;
    })());
  },
  /**
   * Check the minimum value of a particular.
   */
  min: function({ value: e }, t = 1, r) {
    return Promise.resolve(Array.isArray(e) ? (t = isNaN(t) ? t : Number(t), e.length >= t) : !isNaN(e) && r !== "length" || r === "value" ? (e = isNaN(e) ? e : Number(e), e >= t) : typeof e == "string" || r === "length" ? (e = isNaN(e) ? e : e.toString(), e.length >= t) : !1);
  },
  /**
   * Check the maximum value of a particular.
   */
  max: function({ value: e }, t = 10, r) {
    return Promise.resolve(Array.isArray(e) ? (t = isNaN(t) ? t : Number(t), e.length <= t) : !isNaN(e) && r !== "length" || r === "value" ? (e = isNaN(e) ? e : Number(e), e <= t) : typeof e == "string" || r === "length" ? (e = isNaN(e) ? e : e.toString(), e.length <= t) : !1);
  },
  /**
   * Rule: Value is not in stack.
   */
  not: function({ value: e }, ...t) {
    return Promise.resolve(t.find((r) => typeof r == "object" ? A(r, e) : r === e) === void 0);
  },
  /**
   * Rule: checks if the value is only alpha numeric
   */
  number: function({ value: e }) {
    return Promise.resolve(!isNaN(e));
  },
  /**
   * Rule: must be a value - allows for an optional argument "whitespace" with a possible value 'trim' and default 'pre'.
   */
  required: function({ value: e }, t = "pre") {
    return Promise.resolve(Array.isArray(e) ? !!e.length : e instanceof B ? e.getFiles().length > 0 : typeof e == "string" ? t === "trim" ? !!e.trim() : !!e : typeof e == "object" ? e ? !!Object.keys(e).length : !1 : !0);
  },
  /**
   * Rule: Value starts with one of the given Strings
   */
  startsWith: function({ value: e }, ...t) {
    return Promise.resolve(typeof e == "string" && t.length ? t.find((r) => e.startsWith(r)) !== void 0 : typeof e == "string" && t.length === 0);
  },
  /**
   * Rule: checks if a string is a valid url
   */
  url: function({ value: e }) {
    return Promise.resolve(tt(e));
  },
  /**
   * Rule: not a true rule — more like a compiler flag.
   */
  bail: function() {
    return Promise.resolve(!0);
  },
  /**
   * Rule: not a true rule - more like a compiler flag.
   */
  optional: function({ value: e }) {
    return Promise.resolve(!M(e));
  }
}, K = "image/", st = {
  csv: "text/csv",
  gif: K + "gif",
  jpg: K + "jpeg",
  jpeg: K + "jpeg",
  png: K + "png",
  pdf: "application/pdf",
  svg: K + "svg+xml"
}, be = [
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
], re = {
  hasErrors: (e) => e.hasErrors,
  hasValue: (e) => e.hasValue,
  isValid: (e) => e.isValid
}, it = (e, t) => {
  const r = e.replace(/[A-Z]/g, (n) => "-" + n.toLowerCase()), s = ["form", "file"].includes(r.substr(0, 4)) ? "" : "-input", i = ["decorator", "range-value"].includes(r) ? "-element" : "", o = `formulate${s}${i}${r !== "outer" ? `-${r}` : ""}`;
  return r === "input" ? [] : [o].concat(ot(o, e, t));
}, ot = (e, t, r) => {
  const s = [];
  switch (t) {
    case "label":
      s.push(`${e}--${r.labelPosition}`);
      break;
    case "element":
      const i = r.classification === "group" ? "group" : r.type;
      s.push(`${e}--${i}`), i === "group" && s.push("formulate-input-group");
      break;
    case "help":
      s.push(`${e}--${r.helpPosition}`);
      break;
    case "form":
      r.name && s.push(`${e}--${r.name}`);
  }
  return s;
}, xe = (() => {
  const e = [""].concat(Object.keys(re).map((t) => se(t)));
  return be.reduce((t, r) => t.concat(e.reduce((s, i) => (s.push(`${r}${i}Class`), s), [])), []);
})();
function Q(e, t, r) {
  switch (typeof t) {
    case "string":
      return t;
    case "function":
      return t(r, O(e));
    case "object":
      if (Array.isArray(t))
        return O(e).concat(t);
    default:
      return e;
  }
}
function nt(e, t, r, s) {
  return Object.keys(re).reduce((i, o) => {
    if (re[o](s)) {
      const n = `${e}${se(o)}`, a = `${n}Class`;
      if (r[n]) {
        const u = typeof r[n] == "string" ? O(r[n]) : r[n];
        i = Q(i, u, s);
      }
      if (s[a]) {
        const u = typeof s[a] == "string" ? O(s[a]) : s[`${n}Class`];
        i = Q(i, u, s);
      }
    }
    return i;
  }, t);
}
function at(e) {
  return be.reduce((t, r) => Object.assign(t, {
    [r]: it(r, e)
  }), {});
}
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function ce(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function he(e) {
  var t, r;
  return ce(e) === !1 ? !1 : (t = e.constructor, t === void 0 ? !0 : (r = t.prototype, !(ce(r) === !1 || r.hasOwnProperty("isPrototypeOf") === !1)));
}
function w(e) {
  return typeof e == "string" ? e[0].toUpperCase() + e.substr(1) : e;
}
var lt = { accepted: function(e) {
  return "Please accept the " + e.name + ".";
}, after: function(e) {
  var t = e.name, r = e.args;
  return Array.isArray(r) && r.length ? w(t) + " must be after " + r[0] + "." : w(t) + " must be a later date.";
}, alpha: function(e) {
  return w(e.name) + " can only contain alphabetical characters.";
}, alphanumeric: function(e) {
  return w(e.name) + " can only contain letters and numbers.";
}, before: function(e) {
  var t = e.name, r = e.args;
  return Array.isArray(r) && r.length ? w(t) + " must be before " + r[0] + "." : w(t) + " must be an earlier date.";
}, between: function(e) {
  var t = e.name, r = e.value, s = e.args, i = !(!Array.isArray(s) || !s[2]) && s[2];
  return !isNaN(r) && i !== "length" || i === "value" ? w(t) + " must be between " + s[0] + " and " + s[1] + "." : w(t) + " must be between " + s[0] + " and " + s[1] + " characters long.";
}, confirm: function(e) {
  var t = e.name;
  return e.args, w(t) + " does not match.";
}, date: function(e) {
  var t = e.name, r = e.args;
  return Array.isArray(r) && r.length ? w(t) + " is not a valid date, please use the format " + r[0] : w(t) + " is not a valid date.";
}, default: function(e) {
  return e.name, "This field isn’t valid.";
}, email: function(e) {
  e.name;
  var t = e.value;
  return t ? "“" + t + "” is not a valid email address." : "Please enter a valid email address.";
}, endsWith: function(e) {
  e.name;
  var t = e.value;
  return t ? "“" + t + "” doesn’t end with a valid value." : "This field doesn’t end with a valid value.";
}, in: function(e) {
  var t = e.name, r = e.value;
  return typeof r == "string" && r ? "“" + w(r) + "” is not an allowed " + t + "." : "This is not an allowed " + t + ".";
}, matches: function(e) {
  return w(e.name) + " is not an allowed value.";
}, max: function(e) {
  var t = e.name, r = e.value, s = e.args;
  if (Array.isArray(r)) return "You may only select " + s[0] + " " + t + ".";
  var i = !(!Array.isArray(s) || !s[1]) && s[1];
  return !isNaN(r) && i !== "length" || i === "value" ? w(t) + " must be less than or equal to " + s[0] + "." : w(t) + " must be less than or equal to " + s[0] + " characters long.";
}, mime: function(e) {
  var t = e.name, r = e.args;
  return w(t) + " must be of the type: " + (r[0] || "No file formats allowed.");
}, min: function(e) {
  var t = e.name, r = e.value, s = e.args;
  if (Array.isArray(r)) return "You need at least " + s[0] + " " + t + ".";
  var i = !(!Array.isArray(s) || !s[1]) && s[1];
  return !isNaN(r) && i !== "length" || i === "value" ? w(t) + " must be at least " + s[0] + "." : w(t) + " must be at least " + s[0] + " characters long.";
}, not: function(e) {
  var t = e.name;
  return "“" + e.value + "” is not an allowed " + t + ".";
}, number: function(e) {
  return w(e.name) + " must be a number.";
}, required: function(e) {
  return w(e.name) + " is required.";
}, startsWith: function(e) {
  e.name;
  var t = e.value;
  return t ? "“" + t + "” doesn’t start with a valid value." : "This field doesn’t start with a valid value.";
}, url: function(e) {
  return e.name, "Please include a valid url.";
} };
function ut(e) {
  var t;
  e.extend({ locales: (t = {}, t.en = lt, t) });
}
function dt(e, t, r, s) {
  return new Promise((i, o) => {
    const n = (s.fauxUploaderDuration || 1500) * (0.5 + Math.random()), a = performance.now(), u = () => setTimeout(() => {
      const y = performance.now() - a, P = Math.min(100, Math.round(y / n * 100));
      if (t(P), P >= 100)
        return i({
          url: "http://via.placeholder.com/350x150.png",
          name: e.name
        });
      u();
    }, 20);
    u();
  });
}
const ct = {
  inheritAttrs: !1,
  functional: !0,
  render(e, { props: t, data: r, parent: s, children: i }) {
    for (var o = s, P = t, { name: n, forceWrap: a, context: u } = P, y = I(P, ["name", "forceWrap", "context"]); o && o.$options.name !== "FormulateInput"; )
      o = o.$parent;
    if (!o)
      return null;
    if (o.$scopedSlots && o.$scopedSlots[t.name])
      return o.$scopedSlots[t.name](f(f({}, u), y));
    if (Array.isArray(i) && (i.length > 1 || a && i.length > 0)) {
      const k = r.attrs, { name: q, context: X } = k, H = I(k, ["name", "context"]);
      return e("div", F(f({}, r), { attrs: H }), i);
    } else if (Array.isArray(i) && i.length === 1)
      return i[0];
    return null;
  }
};
function ht(e, t = 0, r = {}) {
  if (e && typeof e == "object" && !Array.isArray(e)) {
    let s = e, { children: i = null, component: o = "FormulateInput", depth: n = 1, key: a = null } = s, u = I(s, ["children", "component", "depth", "key"]);
    const y = u.class || {};
    delete u.class;
    const P = {}, k = Object.keys(u).reduce((D, Y) => /^@/.test(Y) ? Object.assign(D, { [Y.substr(1)]: u[Y] }) : D, {});
    Object.keys(k).forEach((D) => {
      delete u[`@${D}`], P[D] = ft(D, k[D], r);
    });
    const q = o === "FormulateInput" ? u.type || "text" : o, X = u.name || q || "el";
    a || (u.id ? a = u.id : o !== "FormulateInput" && typeof i == "string" ? a = `${q}-${Ze(i)}` : a = `${q}-${X}-${n}${u.name ? "" : "-" + t}`);
    const H = Array.isArray(i) ? i.map((D) => Object.assign(D, { depth: n + 1 })) : i;
    return Object.assign({ key: a, depth: n, attrs: u, component: o, class: y, on: P }, H ? { children: H } : {});
  }
  return null;
}
function ve(e, t, r) {
  return Array.isArray(t) ? t.map((s, i) => {
    const o = ht(s, i, r);
    return e(
      o.component,
      { attrs: o.attrs, class: o.class, key: o.key, on: o.on },
      o.children ? ve(e, o.children, r) : null
    );
  }) : t;
}
function ft(e, t, r) {
  return function(...s) {
    if (typeof t == "function")
      return t.call(this, ...s);
    if (typeof t == "string" && x(r, t))
      return r[t].call(this, ...s);
    if (x(r, e))
      return r[e].call(this, ...s);
  };
}
const pt = {
  functional: !0,
  render: (e, { props: t, listeners: r }) => ve(e, t.schema, r)
};
class mt {
  /**
   * Create a new registry of components.
   * @param {vm} ctx The host vm context of the registry.
   */
  constructor(t) {
    this.registry = /* @__PURE__ */ new Map(), this.errors = {}, this.ctx = t;
  }
  /**
   * Add an item to the registry.
   * @param {string|array} key
   * @param {vue} component
   */
  add(t, r) {
    return this.registry.set(t, r), this.errors = F(f({}, this.errors), { [t]: r.getErrorObject().hasErrors }), this;
  }
  /**
   * Remove an item from the registry.
   * @param {string} name
   */
  remove(t) {
    this.ctx.deps.delete(this.registry.get(t)), this.ctx.deps.forEach((a) => a.delete(t));
    let r = this.ctx.keepModelData;
    !r && this.registry.has(t) && this.registry.get(t).keepModelData !== "inherit" && (r = this.registry.get(t).keepModelData), this.ctx.preventCleanup && (r = !0), this.registry.delete(t);
    const o = this.errors, { [t]: s } = o, i = I(o, [Z(t)]);
    if (this.errors = i, !r) {
      const n = this.ctx.proxy, { [t]: a } = n, u = I(n, [Z(t)]);
      this.ctx.uuid && z(u, this.ctx.uuid), this.ctx.proxy = u, this.ctx.$emit("input", this.ctx.proxy);
    }
    return this;
  }
  /**
   * Check if the registry has the given key.
   * @param {string|array} key
   */
  has(t) {
    return this.registry.has(t);
  }
  /**
   * Get a particular registry value.
   * @param {string} key
   */
  get(t) {
    return this.registry.get(t);
  }
  /**
   * Map over the registry (recursively).
   * @param {function} callback
   */
  map(t) {
    const r = {};
    return this.registry.forEach((s, i) => Object.assign(r, { [i]: t(s, i) })), r;
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
  register(t, r) {
    if (x(r.$options.propsData, "ignored"))
      return !1;
    if (this.registry.has(t))
      return this.ctx.$nextTick(() => this.registry.has(t) ? !1 : this.register(t, r)), !1;
    this.add(t, r);
    const s = x(r.$options.propsData, "formulateValue"), i = x(r.$options.propsData, "value"), o = this.ctx.debounce || this.ctx.debounceDelay || this.ctx.context && this.ctx.context.debounceDelay;
    o && !x(r.$options.propsData, "debounce") && (r.debounceDelay = o), !s && this.ctx.hasInitialValue && !M(this.ctx.initialValues[t]) ? r.context.model = this.ctx.initialValues[t] : (s || i) && !A(r.proxy, this.ctx.initialValues[t], !0) && this.ctx.setFieldValue(t, r.proxy), this.childrenShouldShowErrors && (r.formShouldShowErrors = !0);
  }
  /**
   * Reduce the registry.
   * @param {function} callback
   */
  reduce(t, r) {
    return this.registry.forEach((s, i) => {
      r = t(r, s, i);
    }), r;
  }
  /**
   * Data props to expose.
   */
  dataProps() {
    return {
      proxy: {},
      registry: this,
      register: this.register.bind(this),
      deregister: (t) => this.remove(t),
      childrenShouldShowErrors: !1,
      errorObservers: [],
      deps: /* @__PURE__ */ new Map(),
      preventCleanup: !1
    };
  }
}
function Ee(e) {
  return new mt(e).dataProps();
}
function Fe(e = {}) {
  return {
    hasInitialValue() {
      return this.formulateValue && typeof this.formulateValue == "object" || this.values && typeof this.values == "object" || this.isGrouping && typeof this.context.model[this.index] == "object";
    },
    isVmodeled() {
      return !!(this.$options.propsData.hasOwnProperty("formulateValue") && this._events && Array.isArray(this._events.input) && this._events.input.length);
    },
    initialValues() {
      return x(this.$options.propsData, "formulateValue") && typeof this.formulateValue == "object" ? f({}, this.formulateValue) : x(this.$options.propsData, "values") && typeof this.values == "object" ? f({}, this.values) : this.isGrouping && typeof this.context.model[this.index] == "object" ? this.context.model[this.index] : {};
    },
    mergedGroupErrors() {
      const t = /^([^.\d+].*?)\.(\d+\..+)$/;
      return Object.keys(this.mergedFieldErrors).filter((r) => t.test(r)).reduce((r, s) => {
        let [, i, o] = s.match(t);
        return r[i] || (r[i] = {}), Object.assign(r[i], { [o]: this.mergedFieldErrors[s] }), r;
      }, {});
    }
  };
}
function we(e = []) {
  const t = {
    applyInitialValues() {
      this.hasInitialValue && (this.proxy = f({}, this.initialValues));
    },
    setFieldValue(r, s) {
      if (s === void 0) {
        const i = this.proxy, { [r]: o } = i, n = I(i, [Z(r)]);
        this.proxy = n;
      } else
        Object.assign(this.proxy, { [r]: s });
      this.$emit("input", f({}, this.proxy));
    },
    valueDeps(r) {
      return Object.keys(this.proxy).reduce((s, i) => Object.defineProperty(s, i, {
        enumerable: !0,
        get: () => {
          const o = this.registry.get(i);
          return this.deps.set(r, this.deps.get(r) || /* @__PURE__ */ new Set()), o && (this.deps.set(o, this.deps.get(o) || /* @__PURE__ */ new Set()), this.deps.get(o).add(r.name)), this.deps.get(r).add(i), this.proxy[i];
        }
      }), /* @__PURE__ */ Object.create(null));
    },
    validateDeps(r) {
      this.deps.has(r) && this.deps.get(r).forEach((s) => this.registry.has(s) && this.registry.get(s).performValidation());
    },
    hasValidationErrors() {
      return Promise.all(this.registry.reduce((r, s, i) => (r.push(s.performValidation() && s.getValidationErrors()), r), [])).then((r) => r.some((s) => s.hasErrors));
    },
    showErrors() {
      this.childrenShouldShowErrors = !0, this.registry.map((r) => {
        r.formShouldShowErrors = !0;
      });
    },
    hideErrors() {
      this.childrenShouldShowErrors = !1, this.registry.map((r) => {
        r.formShouldShowErrors = !1, r.behavioralErrorVisibility = !1;
      });
    },
    setValues(r) {
      Array.from(new Set(Object.keys(r || {}).concat(Object.keys(this.proxy)))).forEach((i) => {
        const o = this.registry.has(i) && this.registry.get(i);
        let n = r ? r[i] : void 0;
        o && !A(o.proxy, n, !0) && (o.context.model = n), A(n, this.proxy[i], !0) || this.setFieldValue(i, n);
      });
    },
    updateValidation(r) {
      x(this.registry.errors, r.name) && (this.registry.errors[r.name] = r.hasErrors), this.$emit("validation", r);
    },
    addErrorObserver(r) {
      this.errorObservers.find((s) => r.callback === s.callback) || (this.errorObservers.push(r), r.type === "form" ? r.callback(this.mergedFormErrors) : r.type === "group" && x(this.mergedGroupErrors, r.field) ? r.callback(this.mergedGroupErrors[r.field]) : x(this.mergedFieldErrors, r.field) && r.callback(this.mergedFieldErrors[r.field]));
    },
    removeErrorObserver(r) {
      this.errorObservers = this.errorObservers.filter((s) => s.callback !== r);
    }
  };
  return Object.keys(t).reduce((r, s) => e.includes(s) ? r : F(f({}, r), { [s]: t[s] }), {});
}
function Ve() {
  return {
    mergedFieldErrors: {
      handler(e) {
        this.errorObservers.filter((t) => t.type === "input").forEach((t) => t.callback(e[t.field] || []));
      },
      immediate: !0
    },
    mergedGroupErrors: {
      handler(e) {
        this.errorObservers.filter((t) => t.type === "group").forEach((t) => t.callback(e[t.field] || {}));
      },
      immediate: !0
    }
  };
}
function Pe(e, t = []) {
  const r = {
    formulateSetter: e.setFieldValue,
    formulateRegister: e.register,
    formulateDeregister: e.deregister,
    formulateFieldValidation: e.updateValidation,
    // Provided on forms only to let getFormValues to fall back to form
    getFormValues: e.valueDeps,
    // Provided on groups only to expose group-level items
    getGroupValues: e.valueDeps,
    validateDependents: e.validateDeps,
    observeErrors: e.addErrorObserver,
    removeErrorObserver: e.removeErrorObserver
  };
  return Object.keys(r).filter((i) => !t.includes(i)).reduce((i, o) => Object.assign(i, { [o]: r[o] }), {});
}
function Ae(e) {
  if (typeof e != "object")
    return e;
  const r = Array.isArray(e) ? [] : {};
  for (const s in e)
    e[s] instanceof B || isValueType(e[s]) ? r[s] = e[s] : r[s] = Ae(e[s]);
  return r;
}
class fe {
  /**
   * Initialize a formulate form.
   * @param {vm} form an instance of FormulateForm
   */
  constructor(t) {
    this.form = t;
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
    return new Promise((t, r) => {
      const s = [], i = Ae(this.form.proxy);
      for (const o in i)
        typeof this.form.proxy[o] == "object" && this.form.proxy[o] instanceof B && s.push(
          this.form.proxy[o].upload().then((n) => Object.assign(i, { [o]: n }))
        );
      Promise.all(s).then(() => t(i)).catch((o) => r(o));
    });
  }
}
const E = (e, t) => {
  const r = e.__vccOpts || e;
  for (const [s, i] of t)
    r[s] = i;
  return r;
}, yt = {
  name: "FormulateForm",
  inheritAttrs: !1,
  provide() {
    return F(f({}, Pe(this, ["getGroupValues"])), {
      observeContext: this.addContextObserver,
      removeContextObserver: this.removeContextObserver
    });
  },
  model: {
    prop: "formulateValue",
    event: "input"
  },
  props: {
    name: {
      type: [String, Boolean],
      default: !1
    },
    formulateValue: {
      type: Object,
      default: () => ({})
    },
    values: {
      type: [Object, Boolean],
      default: !1
    },
    errors: {
      type: [Object, Boolean],
      default: !1
    },
    formErrors: {
      type: Array,
      default: () => []
    },
    schema: {
      type: [Array, Boolean],
      default: !1
    },
    keepModelData: {
      type: [Boolean, String],
      default: !1
    },
    invalidMessage: {
      type: [Boolean, Function, String],
      default: !1
    },
    debounce: {
      type: [Boolean, Number],
      default: !1
    }
  },
  data() {
    return F(f({}, Ee(this)), {
      formShouldShowErrors: !1,
      contextObservers: [],
      namedErrors: [],
      namedFieldErrors: {},
      isLoading: !1,
      hasFailedSubmit: !1
    });
  },
  computed: F(f({}, Fe()), {
    schemaListeners() {
      const r = this.$listeners, { submit: e } = r;
      return I(r, ["submit"]);
    },
    pseudoProps() {
      return ie(this.$attrs, xe.filter((e) => /^form/.test(e)));
    },
    attributes() {
      const e = Object.keys(this.$attrs).filter((t) => !x(this.pseudoProps, L(t))).reduce((t, r) => F(f({}, t), { [r]: this.$attrs[r] }), {});
      return typeof this.name == "string" && Object.assign(e, { name: this.name }), e;
    },
    hasErrors() {
      return Object.values(this.registry.errors).some((e) => e);
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
        hasValue: !M(this.proxy),
        // These have to be explicit for really silly nextTick reasons
        isValid: this.isValid,
        isLoading: this.isLoading,
        classes: this.classes
      };
    },
    classes() {
      return this.$formulate.classes(F(f(f({}, this.$props), this.pseudoProps), {
        value: this.proxy,
        errors: this.mergedFormErrors,
        hasErrors: this.hasErrors,
        hasValue: !M(this.proxy),
        isValid: this.isValid,
        isLoading: this.isLoading,
        type: "form",
        classification: "form",
        attrs: this.$attrs
      }));
    },
    invalidErrors() {
      if (this.hasFailedSubmit && this.hasErrors)
        switch (typeof this.invalidMessage) {
          case "string":
            return [this.invalidMessage];
          case "object":
            return Array.isArray(this.invalidMessage) ? this.invalidMessage : [];
          case "function":
            const e = this.invalidMessage(this.failingFields);
            return Array.isArray(e) ? e : [e];
        }
      return [];
    },
    mergedFormErrors() {
      return this.formErrors.concat(this.namedErrors).concat(this.invalidErrors);
    },
    mergedFieldErrors() {
      const e = {};
      if (this.errors)
        for (const t in this.errors)
          e[t] = O(this.errors[t]);
      for (const t in this.namedFieldErrors)
        e[t] = O(this.namedFieldErrors[t]);
      return e;
    },
    hasFormErrorObservers() {
      return !!this.errorObservers.filter((e) => e.type === "form").length;
    },
    failingFields() {
      return Object.keys(this.registry.errors).reduce((e, t) => f(f({}, e), this.registry.errors[t] ? { [t]: this.registry.get(t) } : {}), {});
    }
  }),
  watch: F(f({}, Ve()), {
    formulateValue: {
      handler(e) {
        this.isVmodeled && e && typeof e == "object" && this.setValues(e);
      },
      deep: !0
    },
    mergedFormErrors(e) {
      this.errorObservers.filter((t) => t.type === "form").forEach((t) => t.callback(e));
    }
  }),
  created() {
    this.$formulate.register(this), this.applyInitialValues(), this.$emit("created", this);
  },
  destroyed() {
    this.$formulate.deregister(this);
  },
  methods: F(f({}, we()), {
    applyErrors({ formErrors: e, inputErrors: t }) {
      this.namedErrors = e, this.namedFieldErrors = t;
    },
    addContextObserver(e) {
      this.contextObservers.find((t) => t === e) || (this.contextObservers.push(e), e(this.formContext));
    },
    removeContextObserver(e) {
      this.contextObservers.filter((t) => t !== e);
    },
    registerErrorComponent(e) {
      this.errorComponents.includes(e) || this.errorComponents.push(e);
    },
    formSubmitted() {
      if (this.isLoading)
        return;
      this.isLoading = !0, this.showErrors();
      const e = new fe(this), t = this.$listeners["submit-raw"] || this.$listeners.submitRaw, r = typeof t == "function" ? t(e) : Promise.resolve(e);
      return (r instanceof Promise ? r : Promise.resolve(r)).then((i) => {
        const o = i instanceof fe ? i : e;
        return o.hasValidationErrors().then((n) => [o, n]);
      }).then(([i, o]) => !o && typeof this.$listeners.submit == "function" ? i.values().then((n) => {
        this.hasFailedSubmit = !1;
        const a = this.$listeners.submit(n);
        return (a instanceof Promise ? a : Promise.resolve()).then(() => n);
      }) : this.onFailedValidation()).finally(() => {
        this.isLoading = !1;
      });
    },
    onFailedValidation() {
      return this.hasFailedSubmit = !0, this.$emit("failed-validation", f({}, this.failingFields)), this.$formulate.failedValidation(this);
    }
  })
};
function gt(e, t, r, s, i, o) {
  const n = V("FormulateSchema"), a = V("FormulateErrors");
  return l(), c("form", g({
    class: o.classes.form
  }, o.attributes, {
    onSubmit: t[0] || (t[0] = me((...u) => o.formSubmitted && o.formSubmitted(...u), ["prevent"]))
  }), [
    r.schema ? (l(), h(n, g({
      key: 0,
      schema: r.schema
    }, R(o.schemaListeners)), null, 16, ["schema"])) : d("", !0),
    o.hasFormErrorObservers ? d("", !0) : (l(), h(a, {
      key: 1,
      context: o.formContext
    }, null, 8, ["context"])),
    $(e.$slots, "default", U(J(o.formContext)))
  ], 16);
}
const bt = /* @__PURE__ */ E(yt, [["render", gt]]), xt = {
  context() {
    return Jt.call(this, f({
      addLabel: this.logicalAddLabel,
      removeLabel: this.logicalRemoveLabel,
      attributes: this.elementAttributes,
      blurHandler: Wt.bind(this),
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
      ignored: x(this.$options.propsData, "ignored"),
      isValid: this.isValid,
      imageBehavior: this.imageBehavior,
      label: this.label,
      labelPosition: this.logicalLabelPosition,
      limit: this.limit === 1 / 0 ? this.limit : parseInt(this.limit, 10),
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
      classes: this.classes
    }, this.typeContext));
  },
  // Used in context
  nameOrFallback: Mt,
  hasGivenName: Ut,
  typeContext: Ft,
  elementAttributes: At,
  logicalLabelPosition: $t,
  logicalHelpPosition: St,
  mergedRemovePosition: Ct,
  mergedUploadUrl: It,
  mergedGroupErrors: jt,
  hasValue: _t,
  visibleValidationErrors: Lt,
  slotComponents: zt,
  logicalAddLabel: vt,
  logicalRemoveLabel: Et,
  classes: Ot,
  showValidationErrors: Rt,
  slotProps: Yt,
  pseudoProps: wt,
  isValid: Ht,
  ruleDetails: Dt,
  // Not used in context
  isVmodeled: Bt,
  mergedValidationName: kt,
  explicitErrors: Gt,
  allErrors: Tt,
  hasVisibleErrors: Kt,
  hasErrors: qt,
  filteredAttributes: Pt,
  typeProps: Vt,
  listeners: Zt
};
function vt() {
  if (this.classification === "file")
    return this.addLabel === !0 ? `+ Add ${se(this.type)}` : this.addLabel;
  if (typeof this.addLabel == "boolean") {
    const e = this.label || this.name;
    return `+ ${typeof e == "string" ? e + " " : ""} Add`;
  }
  return this.addLabel;
}
function Et() {
  return typeof this.removeLabel == "boolean" ? "Remove" : this.removeLabel;
}
function Ft() {
  switch (this.classification) {
    case "select":
      return {
        options: ee.call(this, this.options),
        optionGroups: this.optionGroups ? qe(this.optionGroups, (e, t) => ee.call(this, t)) : !1,
        placeholder: this.$attrs.placeholder || !1
      };
    case "slider":
      return { showValue: !!this.showValue };
    default:
      return this.options ? {
        options: ee.call(this, this.options)
      } : {};
  }
}
function wt() {
  return ie(this.localAttributes, xe);
}
function Vt() {
  return ie(this.localAttributes, this.$formulate.typeProps(this.type));
}
function Pt() {
  const e = Object.keys(this.pseudoProps).concat(Object.keys(this.typeProps));
  return Object.keys(this.localAttributes).reduce((t, r) => (e.includes(L(r)) || (t[r] = this.localAttributes[r]), t), {});
}
function At() {
  const e = Object.assign({}, this.filteredAttributes);
  return this.id ? e.id = this.id : e.id = this.defaultId, this.hasGivenName && (e.name = this.name), this.help && !x(e, "aria-describedby") && (e["aria-describedby"] = `${e.id}-help`), this.classes.input && (!Array.isArray(this.classes.input) || this.classes.input.length) && (e.class = this.classes.input), e;
}
function Ot() {
  return this.$formulate.classes(F(f(f({}, this.$props), this.pseudoProps), {
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
function $t() {
  if (this.labelPosition)
    return this.labelPosition;
  switch (this.classification) {
    case "box":
      return "after";
    default:
      return "before";
  }
}
function St() {
  if (this.helpPosition)
    return this.helpPosition;
  switch (this.classification) {
    case "group":
      return "before";
    default:
      return "after";
  }
}
function Ct() {
  return this.type === "group" ? this.removePosition || "before" : !1;
}
function kt() {
  const e = this.$formulate.options.validationNameStrategy || ["validationName", "name", "label", "type"];
  if (Array.isArray(e)) {
    const t = e.find((r) => typeof this[r] == "string");
    return this[t];
  }
  return typeof e == "function" ? e.call(this, this) : this.type;
}
function It() {
  return this.uploadUrl || this.$formulate.getUploadUrl();
}
function jt() {
  const e = Object.keys(this.groupErrors).concat(Object.keys(this.localGroupErrors)), t = /^(\d+)\.(.*)$/;
  return Array.from(new Set(e)).filter((r) => t.test(r)).reduce((r, s) => {
    let [, i, o] = s.match(t);
    x(r, i) || (r[i] = {});
    const n = Array.from(new Set(
      O(this.groupErrors[s]).concat(O(this.localGroupErrors[s]))
    ));
    return r[i] = Object.assign(r[i], { [o]: n }), r;
  }, {});
}
function Dt() {
  return this.parsedValidation.map(([, e, t]) => ({ ruleName: t, args: e }));
}
function Rt() {
  return this.showErrors || this.formShouldShowErrors || this.classification === "file" && this.uploadBehavior === "live" && Oe.call(this) ? !0 : this.behavioralErrorVisibility;
}
function Lt() {
  return this.showValidationErrors && this.validationErrors.length ? this.validationErrors : [];
}
function Mt() {
  if (this.name === !0 && this.classification !== "button") {
    const e = this.id || this.elementAttributes.id.replace(/[^0-9]/g, "");
    return `${this.type}_${e}`;
  }
  return this.name === !1 || this.classification === "button" && this.name === !0 ? !1 : this.name;
}
function Ut() {
  return typeof this.name != "boolean";
}
function _t() {
  const e = this.proxy;
  return this.classification === "box" && this.isGrouped || this.classification === "select" && x(this.filteredAttributes, "multiple") ? Array.isArray(e) ? e.some((t) => t === this.value) : this.value === e : !M(e);
}
function Bt() {
  return !!(this.$options.propsData.hasOwnProperty("formulateValue") && this._events && Array.isArray(this._events.input) && this._events.input.length);
}
function ee(e) {
  return e ? (Array.isArray(e) ? e : Object.keys(e).map((r) => ({ label: e[r], value: r }))).map(Nt.bind(this)) : [];
}
function Nt(e) {
  return typeof e == "number" && (e = String(e)), typeof e == "string" ? { label: e, value: e, id: `${this.elementAttributes.id}_${e}` } : (typeof e.value == "number" && (e.value = String(e.value)), Object.assign({
    value: "",
    label: "",
    id: `${this.elementAttributes.id}_${e.value || e.label}`
  }, e));
}
function Gt() {
  return O(this.errors).concat(this.localErrors).concat(O(this.error));
}
function Tt() {
  return this.explicitErrors.concat(O(this.validationErrors));
}
function qt() {
  return !!this.allErrors.length;
}
function Ht() {
  return !this.hasErrors;
}
function Kt() {
  return Array.isArray(this.validationErrors) && this.validationErrors.length && this.showValidationErrors || !!this.explicitErrors.length;
}
function zt() {
  const e = this.$formulate.slotComponent.bind(this.$formulate);
  return {
    addMore: e(this.type, "addMore"),
    buttonContent: e(this.type, "buttonContent"),
    errors: e(this.type, "errors"),
    file: e(this.type, "file"),
    help: e(this.type, "help"),
    label: e(this.type, "label"),
    prefix: e(this.type, "prefix"),
    remove: e(this.type, "remove"),
    repeatable: e(this.type, "repeatable"),
    suffix: e(this.type, "suffix"),
    uploadAreaMask: e(this.type, "uploadAreaMask")
  };
}
function Yt() {
  const e = this.$formulate.slotProps.bind(this.$formulate);
  return {
    label: e(this.type, "label", this.typeProps),
    help: e(this.type, "help", this.typeProps),
    errors: e(this.type, "errors", this.typeProps),
    repeatable: e(this.type, "repeatable", this.typeProps),
    addMore: e(this.type, "addMore", this.typeProps),
    remove: e(this.type, "remove", this.typeProps),
    component: e(this.type, "component", this.typeProps)
  };
}
function Wt() {
  (this.errorBehavior === "blur" || this.errorBehavior === "value") && (this.behavioralErrorVisibility = !0), this.$nextTick(() => this.$emit("blur-context", this.context));
}
function Zt() {
  const r = this.$listeners, { input: e } = r;
  return I(r, ["input"]);
}
function Jt(e) {
  return Object.defineProperty(e, "model", {
    get: Oe.bind(this),
    set: (t) => {
      if (!this.mntd || !this.debounceDelay)
        return pe.call(this, t);
      this.dSet(pe, [t], this.debounceDelay);
    },
    enumerable: !0
  });
}
function Oe() {
  const e = this.isVmodeled ? "formulateValue" : "proxy";
  return this.type === "checkbox" && !Array.isArray(this[e]) && this.options ? [] : !this[e] && this[e] !== 0 ? "" : this[e];
}
function pe(e) {
  let t = !1;
  A(e, this.proxy, this.type === "group") || (this.proxy = e, t = !0), !this.context.ignored && this.context.name && typeof this.formulateSetter == "function" && this.formulateSetter(this.context.name, e), t && this.$emit("input", e);
}
const Qt = {
  name: "FormulateInput",
  inheritAttrs: !1,
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
    isSubField: { default: () => () => !1 }
  },
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
      default: !0
    },
    /* eslint-disable */
    formulateValue: {
      default: ""
    },
    value: {
      default: !1
    },
    /* eslint-enable */
    options: {
      type: [Object, Array, Boolean],
      default: !1
    },
    optionGroups: {
      type: [Object, Boolean],
      default: !1
    },
    id: {
      type: [String, Boolean, Number],
      default: !1
    },
    label: {
      type: [String, Boolean],
      default: !1
    },
    labelPosition: {
      type: [String, Boolean],
      default: !1
    },
    limit: {
      type: [String, Number],
      default: 1 / 0,
      validator: (e) => 1 / 0
      // eslint-disable-line eqeqeq
    },
    minimum: {
      type: [String, Number],
      default: 0,
      validator: (e) => parseInt(e, 10) == e
      // eslint-disable-line eqeqeq
    },
    help: {
      type: [String, Boolean],
      default: !1
    },
    helpPosition: {
      type: [String, Boolean],
      default: !1
    },
    isGrouped: {
      type: Boolean,
      default: !1
    },
    errors: {
      type: [String, Array, Boolean],
      default: !1
    },
    removePosition: {
      type: [String, Boolean],
      default: !1
    },
    repeatable: {
      type: Boolean,
      default: !1
    },
    validation: {
      type: [String, Boolean, Array],
      default: !1
    },
    validationName: {
      type: [String, Boolean],
      default: !1
    },
    error: {
      type: [String, Boolean],
      default: !1
    },
    errorBehavior: {
      type: String,
      default: "blur",
      validator: function(e) {
        return ["blur", "live", "submit", "value"].includes(e);
      }
    },
    showErrors: {
      type: Boolean,
      default: !1
    },
    groupErrors: {
      type: Object,
      default: () => ({}),
      validator: (e) => {
        const t = /^\d+\./;
        return !Object.keys(e).some((r) => !t.test(r));
      }
    },
    imageBehavior: {
      type: String,
      default: "preview"
    },
    uploadUrl: {
      type: [String, Boolean],
      default: !1
    },
    uploader: {
      type: [Function, Object, Boolean],
      default: !1
    },
    uploadBehavior: {
      type: String,
      default: "live"
    },
    preventWindowDrops: {
      type: Boolean,
      default: !0
    },
    showValue: {
      type: [String, Boolean],
      default: !1
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
      default: !1
    },
    disableErrors: {
      type: Boolean,
      default: !1
    },
    addLabel: {
      type: [Boolean, String],
      default: !0
    },
    removeLabel: {
      type: [Boolean, String],
      default: !1
    },
    keepModelData: {
      type: [Boolean, String],
      default: "inherit"
    },
    ignored: {
      type: [Boolean, String],
      default: !1
    },
    debounce: {
      type: [Boolean, Number],
      default: !1
    },
    preventDeregister: {
      type: Boolean,
      default: !1
    }
  },
  data() {
    return {
      defaultId: this.$formulate.nextId(this),
      localAttributes: {},
      localErrors: [],
      localGroupErrors: {},
      proxy: this.getInitialValue(),
      behavioralErrorVisibility: this.errorBehavior === "live",
      formShouldShowErrors: !1,
      validationErrors: [],
      pendingValidation: Promise.resolve(),
      // These registries are used for injected messages registrants only (mostly internal).
      ruleRegistry: [],
      messageRegistry: {},
      touched: !1,
      debounceDelay: this.debounce,
      dSet: Je(),
      mntd: !1
    };
  },
  computed: F(f({}, xt), {
    classification() {
      const e = this.$formulate.classify(this.type);
      return e === "box" && this.options ? "group" : e;
    },
    component() {
      return this.classification === "group" ? "FormulateInputGroup" : this.$formulate.component(this.type);
    },
    parsedValidationRules() {
      const e = {};
      return Object.keys(this.validationRules).forEach((t) => {
        e[L(t)] = this.validationRules[t];
      }), e;
    },
    parsedValidation() {
      return te(this.validation, this.$formulate.rules(this.parsedValidationRules));
    },
    messages() {
      const e = {};
      return Object.keys(this.validationMessages).forEach((t) => {
        e[L(t)] = this.validationMessages[t];
      }), Object.keys(this.messageRegistry).forEach((t) => {
        e[L(t)] = this.messageRegistry[t];
      }), e;
    }
  }),
  watch: {
    $attrs: {
      handler(e) {
        this.updateLocalAttributes(e);
      },
      deep: !0
    },
    proxy: {
      handler: function(e, t) {
        this.performValidation(), !this.isVmodeled && !A(e, t, this.type === "group") && (this.context.model = e), this.validateDependents(this), !this.touched && e && (this.touched = !0);
      },
      deep: !0
    },
    formulateValue: {
      handler: function(e, t) {
        this.isVmodeled && !A(e, t, this.type === "group") && (this.context.model = e);
      },
      deep: !0
    },
    showValidationErrors: {
      handler(e) {
        this.$emit("error-visibility", e);
      },
      immediate: !0
    },
    validation: {
      handler() {
        this.performValidation();
      },
      deep: !0
    },
    touched(e) {
      this.errorBehavior === "value" && e && (this.behavioralErrorVisibility = e);
    },
    debounce(e) {
      this.debounceDelay = e;
    }
  },
  created() {
    this.applyInitialValue(), this.formulateRegister && typeof this.formulateRegister == "function" && this.formulateRegister(this.nameOrFallback, this), this.applyDefaultValue(), !this.disableErrors && typeof this.observeErrors == "function" && (this.observeErrors({ callback: this.setErrors, type: "input", field: this.nameOrFallback }), this.type === "group" && this.observeErrors({ callback: this.setGroupErrors, type: "group", field: this.nameOrFallback })), this.updateLocalAttributes(this.$attrs), this.performValidation(), this.hasValue && (this.touched = !0);
  },
  mounted() {
    this.mntd = !0;
  },
  beforeDestroy() {
    !this.disableErrors && typeof this.removeErrorObserver == "function" && (this.removeErrorObserver(this.setErrors), this.type === "group" && this.removeErrorObserver(this.setGroupErrors)), typeof this.formulateDeregister == "function" && !this.preventDeregister && this.formulateDeregister(this.nameOrFallback);
  },
  methods: {
    getInitialValue() {
      var e = this.$formulate.classify(this.type);
      return e = e === "box" && this.options ? "group" : e, e === "box" && this.checked ? this.value || !0 : x(this.$options.propsData, "value") && e !== "box" ? this.value : x(this.$options.propsData, "formulateValue") ? this.formulateValue : e === "group" ? Object.defineProperty(this.type === "group" ? [{}] : [], "__init", { value: !0 }) : "";
    },
    applyInitialValue() {
      !A(this.context.model, this.proxy) && // we dont' want to set the model if we are a sub-box of a multi-box field
      (this.classification !== "box" || x(this.$options.propsData, "options")) && (this.context.model = this.proxy, this.$emit("input", this.proxy));
    },
    applyDefaultValue() {
      this.type === "select" && !this.context.placeholder && M(this.proxy) && !this.isVmodeled && this.value === !1 && this.context.options.length && (x(this.$attrs, "multiple") ? this.context.model = [] : this.context.model = this.context.options[0].value);
    },
    updateLocalAttributes(e) {
      A(e, this.localAttributes) || (this.localAttributes = e);
    },
    performValidation() {
      let e = te(this.validation, this.$formulate.rules(this.parsedValidationRules));
      return e = this.ruleRegistry.length ? this.ruleRegistry.concat(e) : e, this.pendingValidation = this.runRules(e).then((t) => this.didValidate(t)), this.pendingValidation;
    },
    runRules(e) {
      const t = ([r, s, i, o]) => {
        var n = r({
          value: this.context.model,
          getFormValues: (...a) => this.getFormValues(this, ...a),
          getGroupValues: (...a) => this[`get${this.getGroupValues ? "Group" : "Form"}Values`](this, ...a),
          name: this.context.name
        }, ...s);
        return n = n instanceof Promise ? n : Promise.resolve(n), n.then((a) => a ? !1 : this.getMessage(i, s));
      };
      return new Promise((r) => {
        const s = (i, o = []) => {
          const n = i.shift();
          Array.isArray(n) && n.length ? Promise.all(n.map(t)).then((a) => a.filter((u) => !!u)).then((a) => (a = Array.isArray(a) ? a : [], (!a.length || !n.bail) && i.length ? s(i, o.concat(a)) : r(o.concat(a).filter((u) => !M(u))))) : r([]);
        };
        s(Ke(e));
      });
    },
    didValidate(e) {
      const t = !A(e, this.validationErrors);
      if (this.validationErrors = e, t) {
        const r = this.getErrorObject();
        this.$emit("validation", r), this.formulateFieldValidation && typeof this.formulateFieldValidation == "function" && this.formulateFieldValidation(r);
      }
    },
    getMessage(e, t) {
      return this.getMessageFunc(e)({
        args: t,
        name: this.mergedValidationName,
        value: this.context.model,
        vm: this,
        formValues: this.getFormValues(this),
        getFormValues: (...r) => this.getFormValues(this, ...r),
        getGroupValues: (...r) => this[`get${this.getGroupValues ? "Group" : "Form"}Values`](this, ...r)
      });
    },
    getMessageFunc(e) {
      if (e = L(e), e === "optional")
        return () => [];
      if (this.messages && typeof this.messages[e] != "undefined")
        switch (typeof this.messages[e]) {
          case "function":
            return this.messages[e];
          case "string":
          case "boolean":
            return () => this.messages[e];
        }
      return (t) => this.$formulate.validationMessage(e, t, this);
    },
    hasValidationErrors() {
      return new Promise((e) => {
        this.$nextTick(() => {
          this.pendingValidation.then(() => e(!!this.validationErrors.length));
        });
      });
    },
    getValidationErrors() {
      return new Promise((e) => {
        this.$nextTick(() => this.pendingValidation.then(() => e(this.getErrorObject())));
      });
    },
    getErrorObject() {
      return {
        name: this.context.nameOrFallback || this.context.name,
        errors: this.validationErrors.filter((e) => typeof e == "string"),
        hasErrors: !!this.validationErrors.length
      };
    },
    setErrors(e) {
      this.localErrors = O(e);
    },
    setGroupErrors(e) {
      this.localGroupErrors = e;
    },
    registerRule(e, t, r, s = null) {
      this.ruleRegistry.some((i) => i[2] === r) || (this.ruleRegistry.push([e, t, r]), s !== null && (this.messageRegistry[r] = s));
    },
    removeRule(e) {
      const t = this.ruleRegistry.findIndex((r) => r[2] === e);
      t >= 0 && (this.ruleRegistry.splice(t, 1), delete this.messageRegistry[e]);
    }
  }
}, Xt = ["data-classification", "data-has-errors", "data-is-showing-errors", "data-has-value", "data-type"];
function er(e, t, r, s, i, o) {
  return l(), c("div", {
    class: p(e.context.classes.outer),
    "data-classification": o.classification,
    "data-has-errors": e.hasErrors,
    "data-is-showing-errors": e.hasVisibleErrors,
    "data-has-value": e.hasValue,
    "data-type": r.type
  }, [
    S("div", {
      class: p(e.context.classes.wrapper)
    }, [
      e.context.labelPosition === "before" ? $(e.$slots, "label", U(g({ key: 0 }, e.context)), () => [
        e.context.hasLabel ? (l(), h(m(e.context.slotComponents.label), g({ key: 0 }, e.context.slotProps.label, { context: e.context }), null, 16, ["context"])) : d("", !0)
      ]) : d("", !0),
      e.context.helpPosition === "before" ? $(e.$slots, "help", U(g({ key: 1 }, e.context)), () => [
        e.context.help ? (l(), h(m(e.context.slotComponents.help), g({ key: 0 }, e.context.slotProps.help, { context: e.context }), null, 16, ["context"])) : d("", !0)
      ]) : d("", !0),
      $(e.$slots, "element", U(J(e.context)), () => [
        (l(), h(m(e.context.component), g({ context: e.context }, e.context.slotProps.component, R(e.listeners)), {
          default: b(() => [
            $(e.$slots, "default", U(J(e.context)))
          ]),
          _: 3
        }, 16, ["context"]))
      ]),
      e.context.labelPosition === "after" ? $(e.$slots, "label", U(g({ key: 2 }, e.context)), () => [
        e.context.hasLabel ? (l(), h(m(e.context.slotComponents.label), g({
          key: 0,
          context: e.context
        }, e.context.slotProps.label), null, 16, ["context"])) : d("", !0)
      ]) : d("", !0)
    ], 2),
    e.context.helpPosition === "after" ? $(e.$slots, "help", U(g({ key: 0 }, e.context)), () => [
      e.context.help ? (l(), h(m(e.context.slotComponents.help), g({
        key: 0,
        context: e.context
      }, e.context.slotProps.help), null, 16, ["context"])) : d("", !0)
    ]) : d("", !0),
    $(e.$slots, "errors", U(J(e.context)), () => [
      e.context.disableErrors ? d("", !0) : (l(), h(m(e.context.slotComponents.errors), g({
        key: 0,
        type: e.context.slotComponents.errors === "FormulateErrors" ? "input" : !1,
        context: e.context
      }, e.context.slotProps.errors), null, 16, ["type", "context"]))
    ])
  ], 10, Xt);
}
const tr = /* @__PURE__ */ E(Qt, [["render", er]]), rr = {
  inject: {
    observeErrors: {
      default: !1
    },
    removeErrorObserver: {
      default: !1
    },
    observeContext: {
      default: !1
    },
    removeContextObserver: {
      default: !1
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
      return Array.from(new Set(this.mergedErrors.concat(this.visibleValidationErrors))).filter((e) => typeof e == "string");
    },
    outerClass() {
      return this.type === "input" && this.context.classes ? this.context.classes.errors : this.formContext.classes.formErrors;
    },
    itemClass() {
      return this.type === "input" && this.context.classes ? this.context.classes.error : this.formContext.classes.formError;
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
    this.type === "form" && typeof this.observeErrors == "function" && (Array.isArray(this.context.errors) || this.observeErrors({ callback: this.boundSetErrors, type: "form" }), this.observeContext(this.boundSetFormContext));
  },
  destroyed() {
    this.type === "form" && typeof this.removeErrorObserver == "function" && (Array.isArray(this.context.errors) || this.removeErrorObserver(this.boundSetErrors), this.removeContextObserver(this.boundSetFormContext));
  },
  methods: {
    setErrors(e) {
      this.localErrors = O(e);
    },
    setFormContext(e) {
      this.formContext = e;
    }
  }
};
function sr(e, t, r, s, i, o) {
  return l(), h(m(o.slotComponent), {
    "visible-errors": o.visibleErrors,
    "item-class": o.itemClass,
    "outer-class": o.outerClass,
    role: o.role,
    "aria-live": o.ariaLive,
    type: r.type
  }, null, 8, ["visible-errors", "item-class", "outer-class", "role", "aria-live", "type"]);
}
const ir = /* @__PURE__ */ E(rr, [["render", sr]]), or = {
  props: {
    context: {
      type: Object,
      required: !0
    }
  }
}, nr = ["id", "textContent"];
function ar(e, t, r, s, i, o) {
  return r.context.help ? (l(), c("div", {
    key: 0,
    id: `${r.context.id}-help`,
    class: p(r.context.classes.help),
    textContent: C(r.context.help)
  }, null, 10, nr)) : d("", !0);
}
const lr = /* @__PURE__ */ E(or, [["render", ar]]), ur = {
  props: {
    file: {
      type: Object,
      required: !0
    },
    imagePreview: {
      type: Boolean,
      default: !1
    },
    context: {
      type: Object,
      required: !0
    }
  }
}, dr = ["src"], cr = ["title", "textContent"], hr = ["data-just-finished", "data-is-finished"];
function fr(e, t, r, s, i, o) {
  return l(), c("div", {
    class: p(r.context.classes.file)
  }, [
    r.imagePreview && r.file.previewData ? (l(), c("div", {
      key: 0,
      class: p(r.context.classes.fileImagePreview)
    }, [
      S("img", {
        src: r.file.previewData,
        class: p(r.context.classes.fileImagePreviewImage)
      }, null, 10, dr)
    ], 2)) : d("", !0),
    S("div", {
      class: p(r.context.classes.fileName),
      title: r.file.name,
      textContent: C(r.file.name)
    }, null, 10, cr),
    r.file.progress !== !1 ? (l(), c("div", {
      key: 1,
      "data-just-finished": r.file.justFinished,
      "data-is-finished": !r.file.justFinished && r.file.complete,
      class: p(r.context.classes.fileProgress)
    }, [
      S("div", {
        class: p(r.context.classes.fileProgressInner),
        style: De({ width: r.file.progress + "%" })
      }, null, 6)
    ], 10, hr)) : d("", !0),
    r.file.complete && !r.file.justFinished || r.file.progress === !1 ? (l(), c("div", {
      key: 2,
      class: p(r.context.classes.fileRemove),
      onClick: t[0] || (t[0] = (...n) => r.file.removeFile && r.file.removeFile(...n))
    }, null, 2)) : d("", !0)
  ], 2);
}
const pr = /* @__PURE__ */ E(ur, [["render", fr]]), mr = {
  name: "FormulateGrouping",
  props: {
    context: {
      type: Object,
      required: !0
    }
  },
  provide() {
    return {
      isSubField: () => !0,
      registerProvider: this.registerProvider,
      deregisterProvider: this.deregisterProvider
    };
  },
  data() {
    return {
      providers: [],
      keys: []
    };
  },
  inject: ["formulateRegisterRule", "formulateRemoveRule"],
  computed: {
    items() {
      return Array.isArray(this.context.model) ? !this.context.repeatable && this.context.model.length === 0 ? [this.setId({}, 0)] : this.context.model.length < this.context.minimum ? new Array(this.context.minimum || 1).fill("").map((e, t) => this.setId(this.context.model[t] || {}, t)) : this.context.model.map((e, t) => this.setId(e, t)) : new Array(this.context.minimum || 1).fill("").map((e, t) => this.setId({}, t));
    },
    formShouldShowErrors() {
      return this.context.formShouldShowErrors;
    },
    groupErrors() {
      return this.items.map((e, t) => x(this.context.groupErrors, t) ? this.context.groupErrors[t] : {});
    }
  },
  watch: {
    providers() {
      this.formShouldShowErrors && this.showErrors();
    },
    formShouldShowErrors(e) {
      e && this.showErrors();
    },
    items: {
      handler(e, t) {
        A(e, t, !0) || (this.keys = e.map((r) => r.__id));
      },
      immediate: !0
    }
  },
  created() {
    this.formulateRegisterRule(this.validateGroup.bind(this), [], "formulateGrouping", !0);
  },
  destroyed() {
    this.formulateRemoveRule("formulateGrouping");
  },
  methods: {
    validateGroup() {
      return Promise.all(this.providers.reduce((e, t) => (t && typeof t.hasValidationErrors == "function" && e.push(t.hasValidationErrors()), e), [])).then((e) => !e.some((t) => !!t));
    },
    showErrors() {
      this.providers.forEach((e) => e && typeof e.showErrors == "function" && e.showErrors());
    },
    setItem(e, t) {
      Array.isArray(this.context.model) && this.context.model.length >= this.context.minimum && !this.context.model.__init ? this.context.model.splice(e, 1, this.setId(t, e)) : this.context.model = this.items.map((r, s) => s === e ? this.setId(t, e) : r);
    },
    removeItem(e) {
      Array.isArray(this.context.model) && this.context.model.length > this.context.minimum ? (this.context.model = this.context.model.filter((t, r) => r === e ? !1 : t), this.context.rootEmit("repeatableRemoved", this.context.model)) : !Array.isArray(this.context.model) && this.items.length > this.context.minimum && (this.context.model = new Array(this.items.length - 1).fill("").map((t, r) => this.setId({}, r)), this.context.rootEmit("repeatableRemoved", this.context.model));
    },
    registerProvider(e) {
      this.providers.some((t) => t === e) || this.providers.push(e);
    },
    deregisterProvider(e) {
      this.providers = this.providers.filter((t) => t !== e);
    },
    setId(e, t) {
      return e.__id ? e : z(e, this.keys[t]);
    }
  }
};
function yr(e, t, r, s, i, o) {
  const n = V("FormulateRepeatableProvider"), a = V("FormulateSlot");
  return l(), h(a, {
    name: "grouping",
    class: p(r.context.classes.grouping),
    context: r.context,
    "force-wrap": r.context.repeatable
  }, {
    default: b(() => [
      (l(!0), c(_, null, N(o.items, (u, y) => (l(), h(n, {
        key: u.__id,
        index: y,
        context: r.context,
        uuid: u.__id,
        errors: o.groupErrors[y],
        onRemove: o.removeItem,
        onInput: (P) => o.setItem(y, P)
      }, {
        default: b(() => [
          $(e.$slots, "default")
        ]),
        _: 2
      }, 1032, ["index", "context", "uuid", "errors", "onRemove", "onInput"]))), 128))
    ]),
    _: 3
  }, 8, ["class", "context", "force-wrap"]);
}
const gr = /* @__PURE__ */ E(mr, [["render", yr]]), br = {
  props: {
    context: {
      type: Object,
      required: !0
    }
  }
}, xr = ["id", "for", "textContent"];
function vr(e, t, r, s, i, o) {
  return l(), c("label", {
    id: `${r.context.id}_label`,
    class: p(r.context.classes.label),
    for: r.context.id,
    textContent: C(r.context.label)
  }, null, 10, xr);
}
const Er = /* @__PURE__ */ E(br, [["render", vr]]), Fr = {
  props: {
    context: {
      type: Object,
      required: !0
    },
    addMore: {
      type: Function,
      required: !0
    }
  }
};
function wr(e, t, r, s, i, o) {
  const n = V("FormulateInput");
  return l(), c("div", {
    class: p(r.context.classes.groupAddMore)
  }, [
    v(n, {
      type: "button",
      label: r.context.addLabel,
      "data-minor": "",
      "data-ghost": "",
      onClick: r.addMore
    }, null, 8, ["label", "onClick"])
  ], 2);
}
const Vr = /* @__PURE__ */ E(Fr, [["render", wr]]), T = {
  props: {
    context: {
      type: Object,
      required: !0
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
}, Pr = {
  name: "FormulateInputBox",
  mixins: [T],
  computed: {
    usesDecorator() {
      return this.$formulate.options.useInputDecorators;
    }
  }
}, Ar = ["data-type"], Or = ["value"], $r = ["value"];
function Sr(e, t, r, s, i, o) {
  const n = V("FormulateSlot");
  return l(), c("div", {
    class: p(e.context.classes.element),
    "data-type": e.context.type
  }, [
    v(n, {
      name: "prefix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.prefix ? (l(), h(m(e.context.slotComponents.prefix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"]),
    e.type === "radio" ? G((l(), c("input", g({
      key: 0,
      "onUpdate:modelValue": t[0] || (t[0] = (a) => e.context.model = a),
      type: "radio",
      value: e.context.value
    }, e.attributes, R(e.$listeners, !0), {
      onBlur: t[1] || (t[1] = (...a) => e.context.blurHandler && e.context.blurHandler(...a))
    }), null, 16, Or)), [
      [Re, e.context.model]
    ]) : G((l(), c("input", g({
      key: 1,
      "onUpdate:modelValue": t[2] || (t[2] = (a) => e.context.model = a),
      type: "checkbox",
      value: e.context.value
    }, e.attributes, R(e.$listeners, !0), {
      onBlur: t[3] || (t[3] = (...a) => e.context.blurHandler && e.context.blurHandler(...a))
    }), null, 16, $r)), [
      [Le, e.context.model]
    ]),
    o.usesDecorator ? (l(), h(m("label"), {
      key: 2,
      class: p(e.context.classes.decorator),
      for: e.attributes.id
    }, null, 8, ["class", "for"])) : d("", !0),
    v(n, {
      name: "suffix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.suffix ? (l(), h(m(e.context.slotComponents.suffix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, Ar);
}
const Cr = /* @__PURE__ */ E(Pr, [["render", Sr]]), kr = {
  props: {
    visibleErrors: {
      type: Array,
      required: !0
    },
    itemClass: {
      type: [String, Array, Object, Boolean],
      default: !1
    },
    outerClass: {
      type: [String, Array, Object, Boolean],
      default: !1
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
      required: !0
    }
  }
}, Ir = ["role", "aria-live", "textContent"];
function jr(e, t, r, s, i, o) {
  return r.visibleErrors.length ? (l(), c("ul", {
    key: 0,
    class: p(r.outerClass)
  }, [
    (l(!0), c(_, null, N(r.visibleErrors, (n) => (l(), c("li", {
      key: n,
      class: p(r.itemClass),
      role: r.role,
      "aria-live": r.ariaLive,
      textContent: C(n)
    }, null, 10, Ir))), 128))
  ], 2)) : d("", !0);
}
const Dr = /* @__PURE__ */ E(kr, [["render", jr]]), Rr = {
  name: "FormulateInputText",
  mixins: [T]
}, Lr = ["data-type"], Mr = ["type"];
function Ur(e, t, r, s, i, o) {
  const n = V("FormulateSlot");
  return l(), c("div", {
    class: p(e.context.classes.element),
    "data-type": e.context.type
  }, [
    v(n, {
      name: "prefix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.prefix ? (l(), h(m(e.context.slotComponents.prefix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"]),
    G(S("input", g({
      "onUpdate:modelValue": t[0] || (t[0] = (a) => e.context.model = a),
      type: e.type
    }, e.attributes, {
      onBlur: t[1] || (t[1] = (...a) => e.context.blurHandler && e.context.blurHandler(...a))
    }, R(e.$listeners, !0)), null, 16, Mr), [
      [ye, e.context.model]
    ]),
    v(n, {
      name: "suffix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.suffix ? (l(), h(m(e.context.slotComponents.suffix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, Lr);
}
const _r = /* @__PURE__ */ E(Rr, [["render", Ur]]), Br = {
  name: "FormulateFiles",
  props: {
    files: {
      type: B,
      required: !0
    },
    imagePreview: {
      type: Boolean,
      default: !1
    },
    context: {
      type: Object,
      required: !0
    }
  },
  computed: {
    fileUploads() {
      return this.files.files || [];
    },
    isMultiple() {
      return x(this.context.attributes, "multiple");
    }
  },
  watch: {
    files() {
      this.imagePreview && this.files.loadPreviews();
    }
  },
  mounted() {
    this.imagePreview && this.files.loadPreviews();
  },
  methods: {
    appendFiles() {
      const e = this.$refs.addFiles;
      e.files.length && this.files.mergeFileList(e);
    }
  }
}, Nr = ["data-has-error", "data-has-preview"], Gr = ["textContent"];
function Tr(e, t, r, s, i, o) {
  const n = V("FormulateSlot");
  return o.fileUploads.length ? (l(), c("ul", {
    key: 0,
    class: p(r.context.classes.files)
  }, [
    (l(!0), c(_, null, N(o.fileUploads, (a) => (l(), c("li", {
      key: a.uuid,
      "data-has-error": !!a.error,
      "data-has-preview": !!(r.imagePreview && a.previewData)
    }, [
      v(n, {
        name: "file",
        context: r.context,
        file: a,
        "image-preview": r.imagePreview
      }, {
        default: b(() => [
          (l(), h(m(r.context.slotComponents.file), {
            context: r.context,
            file: a,
            "image-preview": r.imagePreview
          }, null, 8, ["context", "file", "image-preview"]))
        ]),
        _: 2
      }, 1032, ["context", "file", "image-preview"]),
      a.error ? (l(), c("div", {
        key: 0,
        class: p(r.context.classes.fileUploadError),
        textContent: C(a.error)
      }, null, 10, Gr)) : d("", !0)
    ], 8, Nr))), 128)),
    o.isMultiple && r.context.addLabel ? (l(), c("div", {
      key: 0,
      class: p(r.context.classes.fileAdd),
      role: "button"
    }, [
      Me(C(r.context.addLabel) + " ", 1),
      S("input", {
        ref: "addFiles",
        type: "file",
        multiple: "",
        class: p(r.context.classes.fileAddInput),
        onChange: t[0] || (t[0] = (...a) => o.appendFiles && o.appendFiles(...a))
      }, null, 34)
    ], 2)) : d("", !0)
  ], 2)) : d("", !0);
}
const qr = /* @__PURE__ */ E(Br, [["render", Tr]]), Hr = {
  name: "FormulateInputFile",
  components: {
    FormulateFiles: qr
  },
  mixins: [T],
  data() {
    return {
      isOver: !1
    };
  },
  computed: {
    hasFiles() {
      return !!(this.context.model instanceof B && this.context.model.files.length);
    }
  },
  created() {
    Array.isArray(this.context.model) && typeof this.context.model[0][this.$formulate.getFileUrlKey()] == "string" && (this.context.model = this.$formulate.createUpload({
      files: this.context.model
    }, this.context));
  },
  mounted() {
    window && this.context.preventWindowDrops && (window.addEventListener("dragover", this.preventDefault), window.addEventListener("drop", this.preventDefault));
  },
  destroyed() {
    window && this.context.preventWindowDrops && (window.removeEventListener("dragover", this.preventDefault), window.removeEventListener("drop", this.preventDefault));
  },
  methods: {
    preventDefault(e) {
      e.target.tagName !== "INPUT" && e.target.getAttribute("type") !== "file" && (e = e || event, e.preventDefault());
    },
    handleFile() {
      this.isOver = !1;
      const e = this.$refs.file;
      e.files.length && (this.context.model = this.$formulate.createUpload(e, this.context), this.$nextTick(() => this.attemptImmediateUpload()));
    },
    attemptImmediateUpload() {
      this.context.uploadBehavior === "live" && this.context.model instanceof B && this.context.hasValidationErrors().then((e) => {
        e || this.context.model.upload();
      });
    },
    handleDragOver(e) {
      e.preventDefault(), this.isOver = !0;
    },
    handleDragLeave(e) {
      e.preventDefault(), this.isOver = !1;
    }
  }
}, Kr = ["data-type", "data-has-files"], zr = ["data-has-files"], Yr = ["data-is-drag-hover"];
function Wr(e, t, r, s, i, o) {
  const n = V("FormulateSlot"), a = V("FormulateFiles");
  return l(), c("div", {
    class: p(e.context.classes.element),
    "data-type": e.context.type,
    "data-has-files": o.hasFiles
  }, [
    v(n, {
      name: "prefix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.prefix ? (l(), h(m(e.context.slotComponents.prefix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"]),
    S("div", {
      class: p(e.context.classes.uploadArea),
      "data-has-files": o.hasFiles
    }, [
      S("input", g({
        ref: "file",
        "data-is-drag-hover": i.isOver,
        type: "file"
      }, e.attributes, R(e.$listeners, !0), {
        onBlur: t[0] || (t[0] = (...u) => e.context.blurHandler && e.context.blurHandler(...u)),
        onChange: t[1] || (t[1] = (...u) => o.handleFile && o.handleFile(...u)),
        onDragover: t[2] || (t[2] = (...u) => o.handleDragOver && o.handleDragOver(...u)),
        onDragleave: t[3] || (t[3] = (...u) => o.handleDragLeave && o.handleDragLeave(...u))
      }), null, 16, Yr),
      v(n, {
        name: "uploadAreaMask",
        context: e.context,
        "has-files": o.hasFiles
      }, {
        default: b(() => [
          G((l(), h(m(e.context.slotComponents.uploadAreaMask), {
            "has-files": e.context.slotComponents.uploadAreaMask === "div" ? !1 : o.hasFiles,
            "data-has-files": e.context.slotComponents.uploadAreaMask === "div" ? o.hasFiles : !1,
            class: p(e.context.classes.uploadAreaMask)
          }, null, 8, ["has-files", "data-has-files", "class"])), [
            [Ue, !o.hasFiles]
          ])
        ]),
        _: 1
      }, 8, ["context", "has-files"]),
      o.hasFiles ? (l(), h(a, {
        key: 0,
        files: e.context.model,
        "image-preview": e.context.type === "image" && e.context.imageBehavior === "preview",
        context: e.context
      }, null, 8, ["files", "image-preview", "context"])) : d("", !0)
    ], 10, zr),
    v(n, {
      name: "suffix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.suffix ? (l(), h(m(e.context.slotComponents.suffix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, Kr);
}
const Zr = /* @__PURE__ */ E(Hr, [["render", Wr]]), Jr = {
  props: {
    context: {
      type: Object,
      required: !0
    },
    removeItem: {
      type: Function,
      required: !0
    },
    index: {
      type: Number,
      required: !0
    }
  }
};
function Qr(e, t, r, s, i, o) {
  const n = V("FormulateSlot");
  return l(), c("div", {
    class: p(r.context.classes.groupRepeatable)
  }, [
    r.context.removePosition === "after" ? $(e.$slots, "default", { key: 0 }) : d("", !0),
    v(n, {
      name: "remove",
      context: r.context,
      index: r.index,
      "remove-item": r.removeItem
    }, {
      default: b(() => [
        (l(), h(m(r.context.slotComponents.remove), g({
          context: r.context,
          index: r.index,
          "remove-item": r.removeItem
        }, r.context.slotProps.remove), null, 16, ["context", "index", "remove-item"]))
      ]),
      _: 1
    }, 8, ["context", "index", "remove-item"]),
    r.context.removePosition === "before" ? $(e.$slots, "default", { key: 1 }) : d("", !0)
  ], 2);
}
const Xr = /* @__PURE__ */ E(Jr, [["render", Qr]]), es = {
  name: "FormulateInputGroup",
  props: {
    context: {
      type: Object,
      required: !0
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
      const zs = this.context, {
        attributes: Se
      } = zs, oe = Se, { id: e } = oe, t = I(oe, ["id"]), ne = zs, {
        blurHandler: r,
        classification: s,
        component: i,
        getValidationErrors: o,
        hasLabel: n,
        hasValidationErrors: a,
        isSubField: u,
        isValid: y,
        labelPosition: P,
        options: k,
        performValidation: q,
        setErrors: X,
        slotComponents: H,
        slotProps: D,
        validationErrors: Y,
        visibleValidationErrors: _s,
        classes: Bs,
        showValidationErrors: Ns,
        rootEmit: Gs,
        help: Ts,
        pseudoProps: qs,
        rules: Hs,
        model: Ks
      } = ne, $e = I(ne, [
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
      return this.options.map((Ce) => this.groupItemContext(
        $e,
        Ce,
        t
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
        const e = this.context.minimum - this.context.model.length + 1, t = Math.max(e, 1);
        for (let r = 0; r < t; r++)
          this.context.model.push(z({}));
      } else
        this.context.model = new Array(this.totalItems + 1).fill("").map(() => z({}));
      this.context.rootEmit("repeatableAdded", this.context.model);
    },
    groupItemContext(e, t, r) {
      return Object.assign({}, e, t, r, { isGrouped: !0 }, e.hasGivenName ? {} : {
        name: !0
      });
    }
  }
}, ts = ["data-is-repeatable", "aria-labelledby"];
function rs(e, t, r, s, i, o) {
  const n = V("FormulateSlot"), a = V("FormulateInput"), u = V("FormulateGrouping");
  return l(), c("div", {
    class: p(r.context.classes.element),
    "data-is-repeatable": r.context.repeatable,
    role: "group",
    "aria-labelledby": o.labelledBy
  }, [
    v(n, {
      name: "prefix",
      context: r.context
    }, {
      default: b(() => [
        r.context.slotComponents.prefix ? (l(), h(m(r.context.slotComponents.prefix), {
          key: 0,
          context: r.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"]),
    o.subType !== "grouping" ? (l(!0), c(_, { key: 0 }, N(o.optionsWithContext, (y) => (l(), h(a, g({
      key: y.id,
      modelValue: r.context.model,
      "onUpdate:modelValue": t[0] || (t[0] = (P) => r.context.model = P),
      ref_for: !0
    }, y, {
      "disable-errors": !0,
      "prevent-deregister": !0,
      class: "formulate-input-group-item",
      onBlur: r.context.blurHandler
    }), null, 16, ["modelValue", "onBlur"]))), 128)) : (l(), c(_, { key: 1 }, [
      v(u, { context: r.context }, {
        default: b(() => [
          $(e.$slots, "default")
        ]),
        _: 3
      }, 8, ["context"]),
      o.canAddMore ? (l(), h(n, {
        key: 0,
        name: "addmore",
        context: r.context,
        "add-more": o.addItem
      }, {
        default: b(() => [
          (l(), h(m(r.context.slotComponents.addMore), g({
            context: r.context,
            "add-more": o.addItem
          }, r.context.slotProps.addMore, { onAdd: o.addItem }), null, 16, ["context", "add-more", "onAdd"]))
        ]),
        _: 1
      }, 8, ["context", "add-more"])) : d("", !0)
    ], 64)),
    v(n, {
      name: "suffix",
      context: r.context
    }, {
      default: b(() => [
        r.context.slotComponents.suffix ? (l(), h(m(r.context.slotComponents.suffix), {
          key: 0,
          context: r.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, ts);
}
const ss = /* @__PURE__ */ E(es, [["render", rs]]), is = {
  name: "FormulateInputButton",
  mixins: [T]
}, os = ["data-type"], ns = ["type"];
function as(e, t, r, s, i, o) {
  const n = V("FormulateSlot");
  return l(), c("div", {
    class: p(e.context.classes.element),
    "data-type": e.context.type
  }, [
    v(n, {
      name: "prefix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.prefix ? (l(), h(m(e.context.slotComponents.prefix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"]),
    S("button", g({ type: e.type }, e.attributes, R(e.$listeners, !0)), [
      $(e.$slots, "default", { context: e.context }, () => [
        (l(), h(m(e.context.slotComponents.buttonContent), { context: e.context }, null, 8, ["context"]))
      ])
    ], 16, ns),
    v(n, {
      name: "suffix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.suffix ? (l(), h(m(e.context.slotComponents.suffix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, os);
}
const ls = /* @__PURE__ */ E(is, [["render", as]]), us = {
  name: "FormulateInputSelect",
  mixins: [T],
  computed: {
    options() {
      return this.context.options || {};
    },
    optionGroups() {
      return this.context.optionGroups || !1;
    },
    placeholderSelected() {
      return !!(!this.hasValue && this.context.attributes && this.context.attributes.placeholder);
    }
  }
}, ds = ["data-type", "data-multiple"], cs = ["data-placeholder-selected"], hs = ["selected"], fs = ["value", "disabled", "textContent"], ps = ["label"], ms = ["value", "disabled", "textContent"];
function ys(e, t, r, s, i, o) {
  const n = V("FormulateSlot");
  return l(), c("div", {
    class: p(e.context.classes.element),
    "data-type": e.context.type,
    "data-multiple": e.attributes && e.attributes.multiple !== void 0
  }, [
    v(n, {
      name: "prefix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.prefix ? (l(), h(m(e.context.slotComponents.prefix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"]),
    G(S("select", g({
      "onUpdate:modelValue": t[0] || (t[0] = (a) => e.context.model = a)
    }, e.attributes, { "data-placeholder-selected": o.placeholderSelected }, R(e.$listeners, !0), {
      onBlur: t[1] || (t[1] = (...a) => e.context.blurHandler && e.context.blurHandler(...a))
    }), [
      e.context.placeholder ? (l(), c("option", {
        key: 0,
        value: "",
        hidden: "hidden",
        disabled: "",
        selected: !e.hasValue
      }, C(e.context.placeholder), 9, hs)) : d("", !0),
      o.optionGroups ? (l(!0), c(_, { key: 2 }, N(o.optionGroups, (a, u) => (l(), c("optgroup", {
        key: u,
        label: u
      }, [
        (l(!0), c(_, null, N(a, (y) => (l(), c("option", g({
          key: y.id,
          value: y.value,
          disabled: !!y.disabled,
          ref_for: !0
        }, y.attributes || y.attrs || {}, {
          textContent: C(y.label)
        }), null, 16, ms))), 128))
      ], 8, ps))), 128)) : (l(!0), c(_, { key: 1 }, N(o.options, (a) => (l(), c("option", g({
        key: a.id,
        value: a.value,
        disabled: !!a.disabled,
        ref_for: !0
      }, a.attributes || a.attrs || {}, {
        textContent: C(a.label)
      }), null, 16, fs))), 128))
    ], 16, cs), [
      [_e, e.context.model]
    ]),
    v(n, {
      name: "suffix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.suffix ? (l(), h(m(e.context.slotComponents.suffix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, ds);
}
const gs = /* @__PURE__ */ E(us, [["render", ys]]), bs = {
  name: "FormulateInputSlider",
  mixins: [T]
}, xs = ["data-type"], vs = ["type"], Es = ["textContent"];
function Fs(e, t, r, s, i, o) {
  const n = V("FormulateSlot");
  return l(), c("div", {
    class: p(e.context.classes.element),
    "data-type": e.context.type
  }, [
    v(n, {
      name: "prefix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.prefix ? (l(), h(m(e.context.slotComponents.prefix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"]),
    G(S("input", g({
      "onUpdate:modelValue": t[0] || (t[0] = (a) => e.context.model = a),
      type: e.type
    }, e.attributes, R(e.$listeners, !0), {
      onBlur: t[1] || (t[1] = (...a) => e.context.blurHandler && e.context.blurHandler(...a))
    }), null, 16, vs), [
      [ye, e.context.model]
    ]),
    e.context.showValue ? (l(), c("div", {
      key: 0,
      class: p(e.context.classes.rangeValue),
      textContent: C(e.context.model)
    }, null, 10, Es)) : d("", !0),
    v(n, {
      name: "suffix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.suffix ? (l(), h(m(e.context.slotComponents.suffix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"])
  ], 10, xs);
}
const ws = /* @__PURE__ */ E(bs, [["render", Fs]]), Vs = {
  props: {
    context: {
      type: Object,
      required: !0
    }
  }
}, Ps = ["textContent"];
function As(e, t, r, s, i, o) {
  return l(), c("span", {
    class: p(`formulate-input-element--${r.context.type}--label`),
    textContent: C(r.context.value || r.context.label || r.context.name || "Submit")
  }, null, 10, Ps);
}
const Os = /* @__PURE__ */ E(Vs, [["render", As]]), $s = {
  name: "FormulateInputTextArea",
  mixins: [T]
};
function Ss(e, t, r, s, i, o) {
  const n = V("FormulateSlot");
  return l(), c("div", {
    class: p(e.context.classes.element),
    "data-type": "textarea"
  }, [
    v(n, {
      name: "prefix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.prefix ? (l(), h(m(e.context.slotComponents.prefix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"]),
    G(S("textarea", g({
      "onUpdate:modelValue": t[0] || (t[0] = (a) => e.context.model = a)
    }, e.attributes, R(e.$listeners, !0), {
      onBlur: t[1] || (t[1] = (...a) => e.context.blurHandler && e.context.blurHandler(...a))
    }), null, 16), [
      [Be, e.context.model]
    ]),
    v(n, {
      name: "suffix",
      context: e.context
    }, {
      default: b(() => [
        e.context.slotComponents.suffix ? (l(), h(m(e.context.slotComponents.suffix), {
          key: 0,
          context: e.context
        }, null, 8, ["context"])) : d("", !0)
      ]),
      _: 1
    }, 8, ["context"])
  ], 2);
}
const Cs = /* @__PURE__ */ E($s, [["render", Ss]]), ks = {
  provide() {
    return F(f({}, Pe(this, ["getFormValues"])), {
      formulateSetter: (e, t) => this.setGroupValue(e, t)
    });
  },
  inject: {
    registerProvider: "registerProvider",
    deregisterProvider: "deregisterProvider"
  },
  props: {
    index: {
      type: Number,
      required: !0
    },
    context: {
      type: Object,
      required: !0
    },
    uuid: {
      type: String,
      required: !0
    },
    errors: {
      type: Object,
      required: !0
    }
  },
  data() {
    return F(f({}, Ee(this)), {
      isGrouping: !0
    });
  },
  computed: F(f({}, Fe()), {
    mergedFieldErrors() {
      return this.errors;
    }
  }),
  watch: F(f({}, Ve()), {
    "context.model": {
      handler(e) {
        A(e[this.index], this.proxy, !0) || this.setValues(e[this.index]);
      },
      deep: !0
    }
  }),
  created() {
    this.applyInitialValues(), this.registerProvider(this);
  },
  beforeDestroy() {
    this.preventCleanup = !0, this.deregisterProvider(this);
  },
  methods: F(f({}, we()), {
    setGroupValue(e, t) {
      A(this.proxy[e], t, !0) || this.setFieldValue(e, t);
    },
    removeItem() {
      this.$emit("remove", this.index);
    }
  })
};
function Is(e, t, r, s, i, o) {
  const n = V("FormulateSlot");
  return l(), h(n, {
    name: "repeatable",
    context: r.context,
    index: r.index,
    "remove-item": o.removeItem
  }, {
    default: b(() => [
      (l(), h(m(r.context.slotComponents.repeatable), g({
        context: r.context,
        index: r.index,
        "remove-item": o.removeItem
      }, r.context.slotProps.repeatable), {
        default: b(() => [
          v(n, {
            context: r.context,
            index: r.index,
            name: "default"
          }, null, 8, ["context", "index"])
        ]),
        _: 1
      }, 16, ["context", "index", "remove-item"]))
    ]),
    _: 1
  }, 8, ["context", "index", "remove-item"]);
}
const js = /* @__PURE__ */ E(ks, [["render", Is]]), Ds = {
  props: {
    index: {
      type: Number,
      default: null
    },
    context: {
      type: Object,
      required: !0
    },
    removeItem: {
      type: Function,
      required: !0
    }
  }
}, Rs = ["data-disabled", "textContent"];
function Ls(e, t, r, s, i, o) {
  return r.context.repeatable ? (l(), c("a", {
    key: 0,
    class: p(r.context.classes.groupRepeatableRemove),
    "data-disabled": r.context.model.length <= r.context.minimum,
    role: "button",
    onClick: t[0] || (t[0] = me((...n) => r.removeItem && r.removeItem(...n), ["prevent"])),
    onKeypress: t[1] || (t[1] = Ne((...n) => r.removeItem && r.removeItem(...n), ["enter"])),
    textContent: C(r.context.removeLabel)
  }, null, 42, Rs)) : d("", !0);
}
const Ms = /* @__PURE__ */ E(Ds, [["render", Ls]]);
class Us {
  /**
   * Instantiate our base options.
   */
  constructor() {
    this.options = {}, this.defaults = {
      components: {
        FormulateSlot: ct,
        FormulateForm: bt,
        FormulateFile: pr,
        FormulateHelp: lr,
        FormulateLabel: Er,
        FormulateInput: tr,
        FormulateErrors: ir,
        FormulateSchema: pt,
        FormulateAddMore: Vr,
        FormulateGrouping: gr,
        FormulateInputBox: Cr,
        FormulateInputText: _r,
        FormulateInputFile: Zr,
        FormulateErrorList: Dr,
        FormulateRepeatable: Xr,
        FormulateInputGroup: ss,
        FormulateInputButton: ls,
        FormulateInputSelect: gs,
        FormulateInputSlider: ws,
        FormulateButtonContent: Os,
        FormulateInputTextArea: Cs,
        FormulateRepeatableRemove: Ms,
        FormulateRepeatableProvider: js
      },
      slotComponents: {
        addMore: "FormulateAddMore",
        buttonContent: "FormulateButtonContent",
        errorList: "FormulateErrorList",
        errors: "FormulateErrors",
        file: "FormulateFile",
        help: "FormulateHelp",
        label: "FormulateLabel",
        prefix: !1,
        remove: "FormulateRepeatableRemove",
        repeatable: "FormulateRepeatable",
        suffix: !1,
        uploadAreaMask: "div"
      },
      slotProps: {},
      library: Te,
      rules: rt,
      mimes: st,
      locale: !1,
      uploader: dt,
      uploadUrl: !1,
      fileUrlKey: "url",
      uploadJustCompleteDuration: 1e3,
      errorHandler: (t) => t,
      plugins: [ut],
      locales: {},
      failedValidation: () => !1,
      idPrefix: "formulate-",
      baseClasses: (t) => t,
      coreClasses: at,
      classes: {},
      useInputDecorators: !0,
      validationNameStrategy: !1
    }, this.registry = /* @__PURE__ */ new Map(), this.idRegistry = {};
  }
  /**
   * Install vue formulate, and register it’s components.
   */
  install(t, r) {
    t.prototype.$formulate = this, this.options = this.defaults;
    var s = this.defaults.plugins;
    r && Array.isArray(r.plugins) && r.plugins.length && (s = s.concat(r.plugins)), s.forEach(
      (o) => typeof o == "function" ? o(this) : null
    ), this.extend(r || {});
    for (var i in this.options.components)
      t.component(i, this.options.components[i]);
  }
  /**
   * Produce a deterministically generated id based on the sequence by which it
   * was requested. This should be *theoretically* the same SSR as client side.
   * However, SSR and deterministic ids can be very challenging, so this
   * implementation is open to community review.
   */
  nextId(t) {
    const s = (t.$route && t.$route.path ? t.$route.path : !1) ? t.$route.path.replace(/[/\\.\s]/g, "-") : "global";
    return Object.prototype.hasOwnProperty.call(this.idRegistry, s) || (this.idRegistry[s] = 0), `${this.options.idPrefix}${s}-${++this.idRegistry[s]}`;
  }
  /**
   * Given a set of options, apply them to the pre-existing options.
   * @param {Object} extendWith
   */
  extend(t) {
    if (typeof t == "object")
      return this.options = this.merge(this.options, t), this;
    throw new Error(
      `Formulate.extend expects an object, was ${typeof t}`
    );
  }
  /**
   * Create a new object by copying properties of base and mergeWith.
   * Note: arrays don't overwrite - they push
   *
   * @param {Object} base
   * @param {Object} mergeWith
   * @param {boolean} concatArrays
   */
  merge(t, r, s = !0) {
    var i = {};
    for (var o in t)
      r.hasOwnProperty(o) ? he(r[o]) && he(t[o]) ? i[o] = this.merge(t[o], r[o], s) : s && Array.isArray(t[o]) && Array.isArray(r[o]) ? i[o] = t[o].concat(r[o]) : i[o] = r[o] : i[o] = t[o];
    for (var n in r)
      i.hasOwnProperty(n) || (i[n] = r[n]);
    return i;
  }
  /**
   * Determine what "class" of input this element is given the "type".
   * @param {string} type
   */
  classify(t) {
    return this.options.library.hasOwnProperty(t) ? this.options.library[t].classification : "unknown";
  }
  /**
   * Generate all classes for a particular context.
   * @param {Object} context
   */
  classes(t) {
    const r = this.options.coreClasses(t), s = this.options.baseClasses(r, t);
    return Object.keys(s).reduce((i, o) => {
      let n = Q(
        s[o],
        this.options.classes[o],
        t
      );
      return n = Q(
        n,
        t[`${o}Class`],
        t
      ), n = nt(
        o,
        n,
        this.options.classes,
        t
      ), Object.assign(i, { [o]: n });
    }, {});
  }
  /**
   * Given a particular type, report any "additional" props to pass to the
   * various slots.
   * @param {string} type
   * @return {array}
   */
  typeProps(t) {
    const r = (i) => Object.keys(i).reduce((o, n) => Array.isArray(i[n]) ? o.concat(i[n]) : o, []), s = r(this.options.slotProps);
    return this.options.library[t] ? s.concat(r(this.options.library[t].slotProps || {})) : s;
  }
  /**
   * Given a type and a slot, get the relevant slot props object.
   * @param {string} type
   * @param {string} slot
   * @return {object}
   */
  slotProps(t, r, s) {
    let i = Array.isArray(this.options.slotProps[r]) ? this.options.slotProps[r] : [];
    const o = this.options.library[t];
    return o && o.slotProps && Array.isArray(o.slotProps[r]) && (i = i.concat(o.slotProps[r])), i.reduce(
      (n, a) => Object.assign(n, { [a]: s[a] }),
      {}
    );
  }
  /**
   * Determine what type of component to render given the "type".
   * @param {string} type
   */
  component(t) {
    return this.options.library.hasOwnProperty(t) ? this.options.library[t].component : !1;
  }
  /**
   * What component should be rendered for the given slot location and type.
   * @param {string} type the type of component
   * @param {string} slot the name of the slot
   */
  slotComponent(t, r) {
    const s = this.options.library[t];
    return s && s.slotComponents && s.slotComponents[r] ? s.slotComponents[r] : this.options.slotComponents[r];
  }
  /**
   * Get validation rules by merging any passed in with global rules.
   * @return {object} object of validation functions
   */
  rules(t = {}) {
    return f(f({}, this.options.rules), t);
  }
  /**
   * Attempt to get the vue-i18n configured locale.
   */
  i18n(t) {
    if (t.$i18n)
      switch (typeof t.$i18n.locale) {
        case "string":
          return t.$i18n.locale;
        case "function":
          return t.$i18n.locale();
      }
    return !1;
  }
  /**
   * Select the proper locale to use.
   */
  getLocale(t) {
    return this.selectedLocale || (this.selectedLocale = [this.options.locale, this.i18n(t), "en"].reduce(
      (r, s) => {
        if (r)
          return r;
        if (s) {
          const i = We(s).find(
            (o) => x(this.options.locales, o)
          );
          i && (r = i);
        }
        return r;
      },
      !1
    )), this.selectedLocale;
  }
  /**
   * Change the locale to a pre-registered one.
   * @param {string} localeTag
   */
  setLocale(t) {
    x(this.options.locales, t) && (this.options.locale = t, this.selectedLocale = t, this.registry.forEach((r, s) => {
      r.hasValidationErrors();
    }));
  }
  /**
   * Get the validation message for a particular error.
   */
  validationMessage(t, r, s) {
    const i = this.options.locales[this.getLocale(s)];
    return i.hasOwnProperty(t) ? i[t](r) : i.hasOwnProperty("default") ? i.default(r) : "Invalid field value";
  }
  /**
   * Given an instance of a FormulateForm register it.
   * @param {vm} form
   */
  register(t) {
    t.$options.name === "FormulateForm" && t.name && this.registry.set(t.name, t);
  }
  /**
   * Given an instance of a form, remove it from the registry.
   * @param {vm} form
   */
  deregister(t) {
    t.$options.name === "FormulateForm" && t.name && this.registry.has(t.name) && this.registry.delete(t.name);
  }
  /**
   * Given an array, this function will attempt to make sense of the given error
   * and hydrate a form with the resulting errors.
   *
   * @param {error} err
   * @param {string} formName
   * @param {error}
   */
  handle(t, r, s = !1) {
    const i = s ? t : this.options.errorHandler(t, r);
    return r && this.registry.has(r) && this.registry.get(r).applyErrors({
      formErrors: O(i.formErrors),
      inputErrors: i.inputErrors || {}
    }), i;
  }
  /**
   * Reset a form.
   * @param {string} formName
   * @param {object} initialValue
   */
  reset(t, r = {}) {
    this.resetValidation(t), this.setValues(t, r);
  }
  /**
   * Submit a named form.
   * @param {string} formName
   */
  submit(t) {
    this.registry.get(t).formSubmitted();
  }
  /**
   * Reset the form's validation messages.
   * @param {string} formName
   */
  resetValidation(t) {
    const r = this.registry.get(t);
    r.hideErrors(t), r.namedErrors = [], r.namedFieldErrors = {};
  }
  /**
   * Set the form values.
   * @param {string} formName
   * @param {object} values
   */
  setValues(t, r) {
    r && !Array.isArray(r) && typeof r == "object" && this.registry.get(t).setValues(f({}, r));
  }
  /**
   * Get the file uploader.
   */
  getUploader() {
    return this.options.uploader || !1;
  }
  /**
   * Get the global upload url.
   */
  getUploadUrl() {
    return this.options.uploadUrl || !1;
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
  createUpload(t, r) {
    return new B(t, r, this.options);
  }
  /**
   * A FormulateForm failed to submit due to existing validation errors.
   */
  failedValidation(t) {
    return this.options.failedValidation(this);
  }
}
const Zs = new Us();
export {
  Zs as default
};
//# sourceMappingURL=formulate.es.js.map
