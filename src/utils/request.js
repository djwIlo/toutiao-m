/**
 * 请求模块
 */
import axios from "axios";

// 在非组件模块中获取 store 必须通过这种方式
import store from "@/store/"

const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/' // 基础路径
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state

  // 如果用户已登录， 统一给接口设置 token 信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


// 响应拦截器

// 导出
export default request