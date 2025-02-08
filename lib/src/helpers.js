const parsePath = (path) => {
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}

/** 分页相关默认值**/
export const DEFAULT_CURRENT = 1
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_TOTAL = 0

/**
 * 获取属性的值
 * @param target 或者属性的对象
 * @param path 属性的路径
 * @param defaultVal 默认值
 * @returns 值
 */
export const getVal = (target, path, defaultVal = '') => {
  if (!path) {
    return target
  }

  const val = parsePath(path)(target)
  if (val === undefined || val === null) {
    return defaultVal
  }

  return val
}

export const getParent = (target) => {
  if (hasClass(target, 'ant-table-row')) {
    return target
  } else {
    return getParent(target.parentElement)
  }
}

/**
 * 获取相当于目标元素的offsetTop
 * @param e
 * @param element
 * @returns
 */
export const getOffsetTop = (e, element) => {
  const rect = element.getBoundingClientRect()
  const scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
  const elementTop = rect.top + scrollTop
  return e.pageY - elementTop
}

/**
 * 为目标元素添加class样式
 * @param elem
 * @param cls
 */
export const addClass = (elem, cls) => {
  if (!hasClass(elem, cls)) {
    elem.className = elem.className === '' ? cls : elem.className + ' ' + cls
  }
}

/**
 * 移除目标元素的某个class样式
 * @param elem
 * @param cls
 */
export const removeClass = (elem, cls) => {
  if (hasClass(elem, cls)) {
    let newClass = ' ' + elem.className.replace(/[\t\r\n]/, '') + ' '
    while (newClass.indexOf(' ' + cls + ' ') >= 0) {
      newClass = newClass.replace(' ' + cls + ' ', ' ')
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '')
  }
}

/**
 * 判断目标元素是否含有某个class样式
 * @param elem
 * @param cls
 * @returns
 */
export const hasClass = (elem, cls) => {
  cls = cls || ''
  if (cls.replace(/\s/g, '').length === 0) {
    return false
  }
  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ')
}