import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Message } from "@arco-design/web-vue";
import qs from "qs";
import router from "@/router";
import store from "@/store";
const instance = axios.create({
  baseURL: "http://101.201.143.127:8090/api",
  timeout: 5000,
});
//post请求头
instance.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

// 添加请求拦截器

instance.interceptors.request.use(
  function (config) {
    Message.loading({ content: "加载中" });
    let token = localStorage.getItem("token");
    token && (config.headers!.token = token);
    return config;
    // 在发送请求之前做些什么
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (res) {
    const { code, data, message, success } = res.data;
    Message.clear();

    // 对响应数据做点什么
    if (code == 200) {
      return data;
    } else if (code === 4011) {
      Message.info({
        content: "未登录或登录超时，请重新登录哦",
      });
      localStorage.removeItem("token");
      router.push("/login");
      return Promise.reject("error");
    }
    if (!success) {
      Message.error({ content: `${message}` });
      return Promise.reject(message);
    }
  },
  function (error) {
    Message.error({ content: `${error}` });
    return Promise.reject(error);
  }
);

export default instance;
