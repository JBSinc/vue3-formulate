import FileUpload from '../FileUpload'

/**
 * A simple (somewhat non-comprehensive) cloneDeep function, valid for our use
 * case of needing to unbind reactive watchers.
 */
export function cloneDeep (obj) {
    if (typeof obj !== 'object') {
      return obj
    }
    const isArr = Array.isArray(obj)
    const newObj = isArr ? [] : {}
    for (const key in obj) {
      if (obj[key] instanceof FileUpload || isValueType(obj[key])) {
        newObj[key] = obj[key]
      } else {
        newObj[key] = cloneDeep(obj[key])
      }
    }
    return newObj
  }
