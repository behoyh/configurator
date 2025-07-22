import { message } from 'antd'
export const toType = (obj) => {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase()
}

export const filterNull = (obj) => {
  for (const key in obj) {
    if (obj[key] === null) {
      delete obj[key]
    } else {
      if (toType(obj[key]) === 'string') {
        obj[key] = obj[key].trim()
      } else if (toType(obj[key]) === 'object') {
        obj[key] = filterNull(obj[key])
      } else if (toType(obj[key]) === 'array') {
        obj[key] = filterNull(obj[key])
      }
    }
  }
  return obj
}

export const errorHandle = (status, info) => {
  let errorInfo = info
  switch (status) {
    case 400:
      errorInfo = '401'
    case 401:
      errorInfo = '401'
    case 403:
      errorInfo = '403'
    case 404:
      errorInfo = '404'
    case 405:
      errorInfo = '405'
    case 408:
      errorInfo = '408'
    case 450:
      errorInfo = '450'
    case 500:
      errorInfo = '500'
    case 501:
      errorInfo = '501'
    case 502:
      errorInfo = '502'
    case 503:
      errorInfo = '503'
    default:
      message.error(errorInfo)
      break
  }
}
