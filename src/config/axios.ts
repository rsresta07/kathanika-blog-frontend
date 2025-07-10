import axios from "axios";
import { getCookie } from "cookies-next/client";
// import { getToken } from "@/utils/helpers/localStorage";

const axiosInstance: any = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config: any) {
    // Retrieve the token from the cookie
    // const id_token = localStorage.getItem("token");
    const id_token = getCookie("token");

    try {
      if (!!id_token) {
        config.headers["Authorization"] = `Bearer ${id_token}`;
      }

      return config;
    } catch (err) {
      // console.log("error in axios", err)
    }

    // Do something before request is sent
    return config;
  },
  function (error: any) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response: any) {
    return response.data;
  },
  function (error: any) {
    if (error.response && error.response.status === 401) {
      //when 401 i.e unauthorized comes
      //write function to clear session
      // console.log('its 401')
    }

    if (error.response && error.response.status === 403) {
      // store.dispatch(errorNotify('not authorized'))
    }

    return Promise.reject(error?.response?.data?.message);
  }
);

export default axiosInstance;
