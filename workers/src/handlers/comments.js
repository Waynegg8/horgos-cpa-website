// 留言系統處理器
export async function handleComments(request, env) {
  const url = new URL(request.url);
  
  if (request.method === 'GET') {
    // 獲取留言
    const pageId = url.searchParams.get('page');
    if (!pageId) {
      return new Response('Page ID required', { status: 400 });
    }
    
    try {
      const comments = await getComments(env, pageId);
      return new Response(JSON.stringify(comments), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response('Error fetching comments', { status: 500 });
    }
  }
  
  if (request.method === 'POST') {
    // 新增留言
    try {
      const data = await request.json();
      
      if (!data.pageId || !data.name || !data.content) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: '請填寫所有必要欄位' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const commentId = generateId();
      const timestamp = new Date().toISOString();
      
      const commentData = {
        id: commentId,
        pageId: data.pageId,
        name: data.name,
        email: data.email || '',
        content: data.content,
        timestamp,
        approved: false // 需要審核
      };
      
      await env.COMMENTS.put(commentId, JSON.stringify(commentData));
      
      return new Response(JSON.stringify({
        success: true,
        message: '留言已提交，審核通過後將會顯示'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: '留言提交失敗'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method Not Allowed', { status: 405 });
}

async function getComments(env, pageId) {
  // 從 KV 中獲取該頁面的所有已審核留言
  const list = await env.COMMENTS.list();
  const comments = [];
  
  for (const key of list.keys) {
    const commentData = await env.COMMENTS.get(key.name);
    const comment = JSON.parse(commentData);
    
    if (comment.pageId === pageId && comment.approved) {
      comments.push(comment);
    }
  }
  
  // 按時間排序
  return comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
