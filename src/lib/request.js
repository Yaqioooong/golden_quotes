/**
 * 获取默认的请求头配置
 * @returns {Object} 包含认证信息的请求头对象
 */
export function getDefaultHeaders() {
  const tokenName = localStorage.getItem('tokenName');
  const tokenValue = localStorage.getItem('tokenValue');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // 如果存在token，则添加到headers中
  if (tokenName && tokenValue) {
    headers[tokenName] = tokenValue;
  }
  
  return headers;
}

/**
 * 封装的fetch请求函数，自动包含默认headers
 * @param {string} url - 请求URL
 * @param {Object} options - fetch选项
 * @returns {Promise<Response>} fetch响应对象
 */
export async function fetchWithAuth(url, options = {}) {
  const defaultHeaders = getDefaultHeaders();
  
  // 合并headers，用户自定义的headers优先级更高
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {})
  };
  
  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include' // 默认包含credentials
  };
  
  return fetch(url, fetchOptions);
}

/**
 * GET请求快捷方法
 * @param {string} url - 请求URL
 * @param {Object} options - fetch选项
 * @returns {Promise<Response>} fetch响应对象
 */
export async function get(url, options = {}) {
  return fetchWithAuth(url, {
    ...options,
    method: 'GET'
  });
}

/**
 * POST请求快捷方法
 * @param {string} url - 请求URL
 * @param {Object} data - 请求体数据
 * @param {Object} options - fetch选项
 * @returns {Promise<Response>} fetch响应对象
 */
export async function post(url, data, options = {}) {
  return fetchWithAuth(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  });
}

/**
 * PUT请求快捷方法
 * @param {string} url - 请求URL
 * @param {Object} data - 请求体数据
 * @param {Object} options - fetch选项
 * @returns {Promise<Response>} fetch响应对象
 */
export async function put(url, data, options = {}) {
  return fetchWithAuth(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  });
}

/**
 * DELETE请求快捷方法
 * @param {string} url - 请求URL
 * @param {Object} options - fetch选项
 * @returns {Promise<Response>} fetch响应对象
 */
export async function del(url, options = {}) {
  return fetchWithAuth(url, {
    ...options,
    method: 'DELETE'
  });
}