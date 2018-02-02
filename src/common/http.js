import axios from 'axios'
import qs from 'qs'

axios.interceptors.request.use(config => {
  // loading
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response.data
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

// hy add 暂不适用
function checkStatusu (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    var res = response.data;
    console.log(res)
    if (res.status == "ok") {
      return res;
    }else if(res.status == "error") {
      return {
        status: -404,
        msg: res.error
      }
    }else if(res.status == "pending"){
      return {
        status: -404,
        msg: "登录状态失效，请重新登录"
      }
    }
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
   console.log(res.msg)
  }
  if (res.data && (!res.data.success)) {
  }
  return res
}

export default {
  post (url, data ,baseURL='http://192.168.2.139:8080/erp/') {
    return axios({
      method: 'post',
      baseURL: baseURL,
      // baseURL: 'http://192.168.31.136:8080/sw/',
      // baseURL: 'http://192.168.1.177/',
      // baseURL: 'http://192.168.2.200:8080/sw/',
      // baseURL:"http://192.168.2.139:8080/erp/",
      url,
      data: qs.stringify(data),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get (url, params) {
    return axios({
      method: 'get',
      baseURL: 'static/json',
      url,
      params, // get 请求时带的参数
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
        //  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  // hy add
  postu (url, data, baseURL='http://192.168.2.139:8080/erp/') {
    data.account_name = window.sessionStorage.getItem('account_name');
    data.account_token =window.sessionStorage.getItem('account_token');
    return axios({
      method: 'post',
      baseURL: baseURL,
      // baseURL: 'http://192.168.31.136:8080/sw/',
      // baseURL: 'http://192.168.1.177/',
      // baseURL: 'http://192.168.2.200:8080/sw/',
      // baseURL:"http://192.168.2.139:8080/erp/",
      url,
      data: qs.stringify(data),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
