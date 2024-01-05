import axios from "axios";
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('user-token');
// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
const getAuthToken = (options) => {
  return {
    headers: {
      Authorization: `Bearer ` + localStorage.getItem("token"),
      ...options?.headers,
    },
  };
};
export function getBlobApi(params) {
  return axios.get(params.url, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ` + localStorage.getItem("user-token"),
    },
  });
}

export async function getApi(params) {
  try {
    return axios.get(params.url, getAuthToken());
  } catch (error) {
    if(error?.response?.status && error?.response?.status === 401) {
      localStorage.removeItem('token')
    }
  }
}

export function postApi(params) {
  try {
    return axios.post(params.url, params.body, getAuthToken(params.options));
  } catch (error) {
    if(error?.response?.status && error?.response?.status === 401) {
      localStorage.removeItem('token')
    }
  }
}

export function patchApi(params) {
  try {
    return axios.patch(params.url, params.body, getAuthToken(params.options));
  } catch (error) {
    if(error?.response?.status && error?.response?.status === 401) {
      localStorage.removeItem('token')
    }
  }
}

export function deleteApi(params) {
  try {
    return axios.delete(params.url, getAuthToken());
  } catch (error) {
    if(error?.response?.status && error?.response?.status === 401) {
      localStorage.removeItem('token')
    }
  }
}
