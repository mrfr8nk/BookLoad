export function useApi(token) {
  async function api(method, url, body) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { 'x-admin-token': token } : {}) },
    };
    if (body && method !== 'GET') opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  async function upload(url, formData) {
    const res = await fetch(url, {
      method: 'POST',
      headers: token ? { 'x-admin-token': token } : {},
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  return { api, upload };
}
