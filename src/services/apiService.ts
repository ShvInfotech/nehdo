const API_URL = 'http://192.168.29.73:8001';

export const apiRequest = async (
  url: string,
  method: string = 'GET',
  bodyData: any = null,
  params: Record<string, any> = {}
) => {
  const token = localStorage.getItem('admin_token');

 
  // Query params build
  let finalUrl = `${API_URL}${url}`;

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });

    finalUrl += `?${query.toString()}`;
  }

  // Check FormData
  const isFormData = bodyData instanceof FormData;

  const response = await fetch(finalUrl, {
    method,
    body: bodyData? isFormData? bodyData: JSON.stringify(bodyData): null,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // Global error handling
  if (response.status === 401) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('nehdo_admin');
    window.location.href = '/nehdo/admin/login';
    return Promise.reject(new Error('Session expired'));
  }

  if (response.status === 403) {
    window.location.href = '/403';
    return Promise.reject(new Error('Access denied'));
  }

  if (response.status >= 500) {
    alert('Server Error')
    return Promise.reject(new Error('Server error'));
  }

  if (response.status === 409) {
    return Promise.reject(new Error(data?.message || 'Duplicate entry'));
  }

  if (response.status === 404) {
    return Promise.reject(new Error(data?.message || 'not found'));
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data;
};




export const userapiRequest = async (
  url: string,
  method: string = 'GET',
  bodyData: any = null,
  params: Record<string, any> = {}
) => {
  const token = localStorage.getItem('accessToken');

 
  // Query params build
  let finalUrl = `${API_URL}${url}`;

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });

    finalUrl += `?${query.toString()}`;
  }

  // Check FormData
  const isFormData = bodyData instanceof FormData;

  const response = await fetch(finalUrl, {
    method,
    body: bodyData? isFormData? bodyData: JSON.stringify(bodyData): null,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // Global error handling
  if (response.status === 401) {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');

  if (unauthorizedHandler) {
    unauthorizedHandler();
  }

  return Promise.reject(new Error('UNAUTHORIZED'));
}

  if (response.status === 403) {
    window.location.href = '/403';
    return Promise.reject(new Error('Access denied'));
  }

  if (response.status >= 500) {
    // window.location.href = '/server-error';
    return Promise.reject(new Error('Server error'));
  }

  if (response.status === 409) {
    return Promise.reject(new Error(data?.message || 'Duplicate entry'));
  }

  if (response.status === 404) {
    return Promise.reject(new Error(data?.message || 'not found'));
  }

 

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data;
};




let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler;
};