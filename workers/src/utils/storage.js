/**
 * 資料存儲工具
 * 使用Cloudflare KV Storage存儲和管理資料
 */

/**
 * 存儲資料
 * @param {string} namespace - 命名空間
 * @param {string} key - 鍵名
 * @param {Object|string} data - 要存儲的資料
 * @param {Object} options - 存儲選項
 * @param {number} options.expirationTtl - 過期時間（秒）
 * @param {Object} env - 環境變數和綁定
 * @returns {Object} 存儲結果
 */
export async function storeData(namespace, key, data, options = {}, env) {
  try {
    // 確保命名空間有效
    if (!namespace || !key) {
      return {
        success: false,
        error: 'Invalid namespace or key'
      };
    }
    
    // 準備存儲的資料
    const value = typeof data === 'string' ? data : JSON.stringify(data);
    
    // 構建完整的鍵名
    const fullKey = `${namespace}:${key}`;
    
    // 存儲資料
    await env.KV_STORAGE.put(fullKey, value, options);
    
    return {
      success: true,
      key: fullKey
    };
  } catch (error) {
    console.error('Error storing data:', error);
    return {
      success: false,
      error: 'Failed to store data'
    };
  }
}

/**
 * 獲取資料
 * @param {string} namespace - 命名空間
 * @param {string} key - 鍵名
 * @param {Object} options - 獲取選項
 * @param {string} options.type - 返回類型（'text'|'json'|'arrayBuffer'|'stream'）
 * @param {Object} env - 環境變數和綁定
 * @returns {Object} 獲取結果
 */
export async function getData(namespace, key, options = {}, env) {
  try {
    // 確保命名空間有效
    if (!namespace || !key) {
      return {
        success: false,
        error: 'Invalid namespace or key'
      };
    }
    
    // 構建完整的鍵名
    const fullKey = `${namespace}:${key}`;
    
    // 獲取資料
    const data = await env.KV_STORAGE.get(fullKey, options);
    
    // 檢查資料是否存在
    if (data === null) {
      return {
        success: false,
        error: 'Data not found'
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error getting data:', error);
    return {
      success: false,
      error: 'Failed to get data'
    };
  }
}

/**
 * 刪除資料
 * @param {string} namespace - 命名空間
 * @param {string} key - 鍵名
 * @param {Object} env - 環境變數和綁定
 * @returns {Object} 刪除結果
 */
export async function deleteData(namespace, key, env) {
  try {
    // 確保命名空間有效
    if (!namespace || !key) {
      return {
        success: false,
        error: 'Invalid namespace or key'
      };
    }
    
    // 構建完整的鍵名
    const fullKey = `${namespace}:${key}`;
    
    // 刪除資料
    await env.KV_STORAGE.delete(fullKey);
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting data:', error);
    return {
      success: false,
      error: 'Failed to delete data'
    };
  }
}

/**
 * 列出命名空間下的所有鍵
 * @param {string} namespace - 命名空間
 * @param {Object} options - 列表選項
 * @param {string} options.prefix - 鍵名前綴
 * @param {number} options.limit - 返回結果數量限制
 * @param {string} options.cursor - 分頁游標
 * @param {Object} env - 環境變數和綁定
 * @returns {Object} 列表結果
 */
export async function listKeys(namespace, options = {}, env) {
  try {
    // 確保命名空間有效
    if (!namespace) {
      return {
        success: false,
        error: 'Invalid namespace'
      };
    }
    
    // 構建列表選項
    const listOptions = {
      prefix: options.prefix ? `${namespace}:${options.prefix}` : `${namespace}:`,
      limit: options.limit || 1000,
      cursor: options.cursor || undefined
    };
    
    // 獲取鍵列表
    const result = await env.KV_STORAGE.list(listOptions);
    
    // 處理鍵名，移除命名空間前綴
    const keys = result.keys.map(key => {
      const fullKey = key.name;
      return fullKey.replace(`${namespace}:`, '');
    });
    
    return {
      success: true,
      keys,
      cursor: result.cursor,
      complete: result.list_complete
    };
  } catch (error) {
    console.error('Error listing keys:', error);
    return {
      success: false,
      error: 'Failed to list keys'
    };
  }
}

/**
 * 獲取並更新資料（原子操作）
 * @param {string} namespace - 命名空間
 * @param {string} key - 鍵名
 * @param {Function} updateFn - 更新函數，接收當前值並返回新值
 * @param {Object} options - 存儲選項
 * @param {Object} env - 環境變數和綁定
 * @returns {Object} 操作結果
 */
export async function getAndUpdate(namespace, key, updateFn, options = {}, env) {
  try {
    // 獲取當前資料
    const getResult = await getData(namespace, key, { type: 'json' }, env);
    
    // 準備當前值
    const currentValue = getResult.success ? getResult.data : null;
    
    // 使用更新函數生成新值
    const newValue = await updateFn(currentValue);
    
    // 存儲新值
    const storeResult = await storeData(namespace, key, newValue, options, env);
    
    if (!storeResult.success) {
      return {
        success: false,
        error: storeResult.error
      };
    }
    
    return {
      success: true,
      oldValue: currentValue,
      newValue
    };
  } catch (error) {
    console.error('Error in getAndUpdate:', error);
    return {
      success: false,
      error: 'Failed to update data'
    };
  }
}