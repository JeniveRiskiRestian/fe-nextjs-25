import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
interface CallAPIProps extends AxiosRequestConfig {
  data?: FormData;
  token?: boolean;
  serverToken?: string;
  contentType?: string;
}

export default async function callAPI({
  url,
  method,
  data,
  token,
  serverToken,
  contentType,
}: CallAPIProps) {
  let headers = {};
  if (serverToken) {
    headers = {
      Authorization: `Bearer ${serverToken}`,
    };
  } else if (token) {
    const tokenCookies = Cookies.get('token');
    if (tokenCookies) {
      const jwtToken = atob(tokenCookies);
      headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
    }
  }
  try {
    const response = await axios({
      url,
      method,
      data,
      headers: {
        ...headers,
        'Content-Type': contentType ? contentType : 'application/json',
      },
    });

    if (response.status > 300) {
      const res = {
        error: true,
        message: response.data?.message || 'Request failed',
        data: null,
      };
      return res;
    }

    // Handle array responses (direct array from API)
    if (Array.isArray(response.data)) {
      return {
        error: false,
        message: 'success',
        data: response.data,
      };
    }

    // Handle object responses
    const { length } = Object.keys(response.data);
    const res = {
      error: false,
      message: 'success',
      data: length > 1 ? response.data : response.data.data,
    };

    return res;
  } catch (err: any) {
    // Handle network errors, timeouts, or other errors where err.response might be undefined
    const errorResponse = err?.response;
    if (errorResponse) {
      return {
        error: true,
        message: errorResponse.data?.message || 'Request failed',
        data: null,
      };
    }
    
    // Handle cases where there's no response (network error, timeout, etc.)
    return {
      error: true,
      message: err?.message || 'Network error or server unavailable',
      data: null,
    };
  }
}
