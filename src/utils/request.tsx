import { message } from "antd";
import axios from "axios";

const baseURL = "https://sg-mock-api.lalamove.com";

const request = axios.create({
  url: baseURL,
  timeout: 5 * 1000,

});

request.interceptors.request.use((config) => {
  return config;
});

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("拦截器error", error);
    //网络超时异常处理
    if (
      error.code === "ECONNABORTED" ||
      error.message === "Network Error" ||
      error.message.includes("timeout")
    ) {
      message.error("请求超时，请稍后重试");
    }
    return error;
  }
);

export default request;
