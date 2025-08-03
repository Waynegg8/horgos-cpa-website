/**
 * 留言處理器
 * 處理網站留言相關的API請求
 */

import { verifyRecaptcha } from '../utils/validation.js';
import { sendEmail } from '../utils/email.js';
import { storeData, getData } from '../utils/storage.js';

/**
 * 處理留言相關API請求
 * @param {Request} request - 客戶端請求
 * @param {Object} env - 環境變數和綁定
 * @param {Object} ctx - 執行上下文
 * @returns {Response} 回應
 */
export async function handleComments(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 獲取頁面留言
  if (request.method === 'GET') {
    const pageId = path.replace('/api/comments/', '');
    if (!pageId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Page ID is required'
      }), { status: 400 });
    }
    
    return await getComments(pageId, env);
  }
  
  // 新增留言
  if (request.method === 'POST' && path === '/api/comments') {
    return await addComment(request, env);
  }
  
  // 回覆留言
  if (request.method === 'POST' && path.includes('/reply')) {
    const commentId = path.split('/').slice(-2)[0];
    return await replyComment(commentId, request, env);
  }
  
  // 未支援的請求
  return new Response(JSON.stringify({
    success: false,
    error: 'Method not supported'
  }), { status: 405 });
}

/**
 * 獲取頁面留言
 * @param {string} pageId - 頁面ID
 * @param {Object} env - 環境變數和綁定
 * @returns {Response} 回應
 */
async function getComments(pageId, env) {
  try {
    // 從KV存儲中獲取留言
    const comments = await getData(`comments:${pageId}`, env) || [];
    
    // 按時間排序，最新的在前
    comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // 組織成樹狀結構
    const commentTree = buildCommentTree(comments);
    
    return new Response(JSON.stringify({
      success: true,
      data: commentTree
    }));
  } catch (error) {
    console.error('Error getting comments:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to get comments'
    }), { status: 500 });
  }
}

/**
 * 新增留言
 * @param {Request} request - 客戶端請求
 * @param {Object} env - 環境變數和綁定
 * @returns {Response} 回應
 */
async function addComment(request, env) {
  try {
    // 解析請求體
    const { pageId, nickname, lineId, content, recaptchaToken } = await request.json();
    
    // 驗證必填欄位
    if (!pageId || !nickname || !lineId || !content) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), { status: 400 });
    }
    
    // 驗證reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken, env);
    if (!recaptchaValid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'reCAPTCHA verification failed'
      }), { status: 400 });
    }
    
    // 創建留言對象
    const comment = {
      id: generateId(),
      pageId,
      nickname,
      lineId,
      content,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('CF-Connecting-IP') || '0.0.0.0',
      parent_id: null
    };
    
    // 從KV存儲中獲取現有留言
    const comments = await getData(`comments:${pageId}`, env) || [];
    
    // 添加新留言
    comments.push(comment);
    
    // 保存到KV存儲
    await storeData(`comments:${pageId}`, comments, env);
    
    // 發送通知郵件
    await sendEmail({
      to: env.ADMIN_EMAIL,
      subject: '新留言通知',
      body: `
        頁面: ${pageId}
        暱稱: ${nickname}
        LINE ID: ${lineId}
        內容: ${content}
        時間: ${comment.timestamp}
      `
    }, env);
    
    return new Response(JSON.stringify({
      success: true,
      data: comment
    }));
  } catch (error) {
    console.error('Error adding comment:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to add comment'
    }), { status: 500 });
  }
}

/**
 * 回覆留言
 * @param {string} commentId - 留言ID
 * @param {Request} request - 客戶端請求
 * @param {Object} env - 環境變數和綁定
 * @returns {Response} 回應
 */
async function replyComment(commentId, request, env) {
  try {
    // 解析請求體
    const { pageId, nickname, lineId, content, recaptchaToken } = await request.json();
    
    // 驗證必填欄位
    if (!pageId || !nickname || !lineId || !content) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), { status: 400 });
    }
    
    // 驗證reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken, env);
    if (!recaptchaValid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'reCAPTCHA verification failed'
      }), { status: 400 });
    }
    
    // 從KV存儲中獲取現有留言
    const comments = await getData(`comments:${pageId}`, env) || [];
    
    // 檢查父留言是否存在
    const parentComment = comments.find(c => c.id === commentId);
    if (!parentComment) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Parent comment not found'
      }), { status: 404 });
    }
    
    // 創建回覆留言對象
    const reply = {
      id: generateId(),
      pageId,
      nickname,
      lineId,
      content,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('CF-Connecting-IP') || '0.0.0.0',
      parent_id: commentId
    };
    
    // 添加回覆
    comments.push(reply);
    
    // 保存到KV存儲
    await storeData(`comments:${pageId}`, comments, env);
    
    // 發送通知郵件
    await sendEmail({
      to: env.ADMIN_EMAIL,
      subject: '新回覆通知',
      body: `
        頁面: ${pageId}
        回覆給: ${parentComment.nickname}
        暱稱: ${nickname}
        LINE ID: ${lineId}
        內容: ${content}
        時間: ${reply.timestamp}
      `
    }, env);
    
    return new Response(JSON.stringify({
      success: true,
      data: reply
    }));
  } catch (error) {
    console.error('Error replying to comment:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to reply to comment'
    }), { status: 500 });
  }
}

/**
 * 將留言列表組織成樹狀結構
 * @param {Array} comments - 留言列表
 * @returns {Array} 樹狀結構的留言列表
 */
function buildCommentTree(comments) {
  // 創建ID到留言的映射
  const commentMap = {};
  comments.forEach(comment => {
    // 創建回覆陣列
    comment.replies = [];
    // 添加到映射
    commentMap[comment.id] = comment;
  });
  
  // 組織成樹狀結構
  const rootComments = [];
  comments.forEach(comment => {
    if (comment.parent_id) {
      // 有父留言，添加到父留言的回覆陣列
      const parent = commentMap[comment.parent_id];
      if (parent) {
        parent.replies.push(comment);
      } else {
        // 父留言不存在，作為根留言處理
        rootComments.push(comment);
      }
    } else {
      // 無父留言，作為根留言
      rootComments.push(comment);
    }
  });
  
  return rootComments;
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}