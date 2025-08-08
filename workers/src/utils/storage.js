/**
 * 資料存取工具（精簡版）
 * 使用 Cloudflare KV：env.HUGO_CMS_KV
 * 簽名與 handlers 呼叫一致：key 優先，內部不做命名空間拼接
 */

/**
 * 存儲資料
 * @param {string} key
 * @param {any} data
 * @param {Object} env
 * @param {Object} options
 */
export async function storeData(key, data, env, options = {}) {
  try {
    const value = typeof data === 'string' ? data : JSON.stringify(data);
    await env.HUGO_CMS_KV.put(key, value, options);
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
}

/**
 * 讀取資料
 * @param {string} key
 * @param {Object} env
 * @param {Object} options - { type: 'json' | 'text' }
 */
export async function getData(key, env, options = { type: 'json' }) {
  try {
    return await env.HUGO_CMS_KV.get(key, options);
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
}

/**
 * 刪除資料
 */
export async function deleteData(key, env) {
  try {
    await env.HUGO_CMS_KV.delete(key);
    return true;
  } catch (error) {
    console.error('Error deleting data:', error);
    return false;
  }
}

/**
 * 列出鍵
 */
export async function listKeys(prefix = '', env, limit = 1000, cursor) {
  try {
    const result = await env.HUGO_CMS_KV.list({ prefix, limit, cursor });
    return result;
  } catch (error) {
    console.error('Error listing keys:', error);
    return { keys: [], list_complete: true };
  }
}

/**
 * 讀取並更新
 */
export async function getAndUpdate(key, updateFn, env, options = {}) {
  try {
    const current = await env.HUGO_CMS_KV.get(key, { type: 'json' });
    const next = await updateFn(current);
    const value = typeof next === 'string' ? next : JSON.stringify(next);
    await env.HUGO_CMS_KV.put(key, value, options);
    return { oldValue: current, newValue: next };
  } catch (error) {
    console.error('Error in getAndUpdate:', error);
    return null;
  }
}