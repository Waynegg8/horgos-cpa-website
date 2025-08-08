/**
 * 請求驗證工具
 * 提供請求驗證和reCAPTCHA驗證功能
 */

/**
 * 驗證請求
 * @param {Request} request - 客戶端請求
 * @param {Object} env - 環境變數和綁定
 * @returns {Object} 驗證結果
 */
export async function validateRequest(request, env) {
  // 檢查請求方法
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
  if (!allowedMethods.includes(request.method)) {
    return {
      valid: false,
      error: 'Method not allowed',
      status: 405
    };
  }
  
  // 檢查Content-Type
  if (['POST', 'PUT'].includes(request.method)) {
    const contentType = request.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        valid: false,
        error: 'Content-Type must be application/json',
        status: 415
      };
    }
  }
  
  // 檢查請求速率（防止濫用）
  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const rateLimitResult = await checkRateLimit(ip, env);
  if (!rateLimitResult.valid) {
    return {
      valid: false,
      error: rateLimitResult.error,
      status: 429
    };
  }
  
  return { valid: true };
}

/**
 * 檢查請求速率限制
 * @param {string} ip - 客戶端IP
 * @param {Object} env - 環境變數和綁定
 * @returns {Object} 檢查結果
 */
async function checkRateLimit(ip, env) {
  try {
    // 獲取IP的請求計數
    const key = `rate_limit:${ip}`;
    const countData = await env.HUGO_CMS_KV.get(key, { type: 'json' });
    
    const now = Date.now();
    const windowMs = 60 * 1000; // 1分鐘窗口
    const maxRequests = 60; // 每分鐘最大請求數
    
    let count = 0;
    let timestamp = now;
    
    if (countData) {
      // 如果在窗口期內，增加計數
      if (now - countData.timestamp < windowMs) {
        count = countData.count + 1;
        timestamp = countData.timestamp;
      } else {
        // 窗口期已過，重置計數
        count = 1;
        timestamp = now;
      }
    } else {
      // 首次請求
      count = 1;
      timestamp = now;
    }
    
    // 更新計數
    await env.HUGO_CMS_KV.put(key, JSON.stringify({ count, timestamp }), {
      expirationTtl: 60 // 60秒後自動過期
    });
    
    // 檢查是否超過限制
    if (count > maxRequests) {
      return {
        valid: false,
        error: 'Rate limit exceeded. Try again later.'
      };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    // 發生錯誤時，允許請求通過
    return { valid: true };
  }
}

/**
 * 驗證reCAPTCHA令牌
 * @param {string} token - reCAPTCHA令牌
 * @param {Object} env - 環境變數和綁定
 * @returns {boolean} 驗證結果
 */
export async function verifyRecaptcha(token, env) {
  if (!token) return false;
  
  try {
    // 調用Google reCAPTCHA API驗證令牌
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `secret=${env.RECAPTCHA_SECRET_KEY}&response=${token}`
    });
    
    const result = await response.json();
    
    // 驗證成功且分數高於閾值
    return result.success && result.score >= 0.5;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}