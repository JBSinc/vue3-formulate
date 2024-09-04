import FileUpload from '../FileUpload'

//Split these out to get rid of circular import with utils and FileUpload

/**
 * Check if
 * @param {mixed} data
 */
export function isValueType (data) {
  switch (typeof data) {
    case 'symbol':
    case 'number':
    case 'string':
    case 'boolean':
    case 'undefined':
      return true
    default:
      if (data === null) {
        return true
      }
      return false
  }
}

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
