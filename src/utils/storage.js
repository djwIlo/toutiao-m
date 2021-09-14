/**
 * 本地存储封装模块
 */
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  // 为什么把 JSON.parse 放到 try-catch 中？
  // 因为 data 可能不是 JSON 格式字符串
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

export const setItem = (name, value) => {
  // 如果 value 是对象，就把 value 转换为 JSON 格式字符串再存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export const removeItem = name => {
  window.localStorage.removeItem(name)
}