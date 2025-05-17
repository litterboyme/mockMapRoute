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
    console.log("error", error);

    if (
      error.code === "ECONNABORTED" ||
      error.message === "Network Error" ||
      error.message.includes("timeout")
    ) {
      message.error("try again later");
    }
    return error;
  }
);

export default request;
