/**
 * 日誌記錄工具
 * 提供請求日誌記錄功能
 */

/**
 * 記錄請求
 * @param {Request} request - 客戶端請求
 */
export function logRequest(request) {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const url = new URL(request.url);
  const path = url.pathname;
  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const userAgent = request.headers.get('User-Agent') || 'Unknown';
  const referer = request.headers.get('Referer') || 'Direct';
  
  console.log(`[${timestamp}] ${method} ${path} - IP: ${ip} - UA: ${userAgent} - Referer: ${referer}`);
}

/**
 * 記錄API錯誤
 * @param {string} endpoint - API端點
 * @param {Error} error - 錯誤對象
 * @param {Object} context - 上下文信息
 */
export function logApiError(endpoint, error, context = {}) {
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] API Error in ${endpoint}:`, {
    message: error.message,
    stack: error.stack,
    context
  });
}

/**
 * 記錄業務事件
 * @param {string} event - 事件名稱
 * @param {Object} data - 事件數據
 */
export function logBusinessEvent(event, data = {}) {
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${event}:`, data);
}

/**
 * 記錄性能指標
 * @param {string} operation - 操作名稱
 * @param {number} duration - 執行時間（毫秒）
 * @param {Object} metadata - 額外元數據
 */
export function logPerformance(operation, duration, metadata = {}) {
  console.log(`Performance: ${operation} - ${duration}ms`, metadata);
}