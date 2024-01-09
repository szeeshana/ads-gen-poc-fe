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
    const response = await axios.get(params.url, getAuthToken());
    return response;
  } catch (error) {
    if(error?.response?.status && error?.response?.status === 401) {
      localStorage.removeItem('token')
    }
  }
}

export async function postApi(params) {
  try {
    const response = await axios.post(params.url, params.body, getAuthToken(params.options));
    return response;
  } catch (error) {
    if(error?.response?.status && error?.response?.status === 401) {
      localStorage.removeItem('token')
    }
  }
}

export async function patchApi(params) {
  try {
    const response = await axios.patch(params.url, params.body, getAuthToken(params.options));
    return response;
  } catch (error) {
    if(error?.response?.status && error?.response?.status === 401) {
      localStorage.removeItem('token')
    }
  }
}

export async function deleteApi(params) {
  try {
    const response = await axios.delete(params.url, getAuthToken());
    return response;
  } catch (error) {
    if(error?.response?.status && error?.response?.status === 401) {
      localStorage.removeItem('token')
    }
  }
}
