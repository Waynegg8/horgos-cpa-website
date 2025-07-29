// Cloudflare Workers 主檔案
// 處理表單提交、預約系統、討論區功能

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    try {
      // 路由處理
      if (url.pathname.startsWith('/api/appointment')) {
        const { handleAppointment } = await import('./handlers/appointments.js');
        return await handleAppointment(request, env);
      }
      
      if (url.pathname.startsWith('/api/contact')) {
        const { handleContact } = await import('./handlers/contact.js');
        return await handleContact(request, env);
      }
      
      if (url.pathname.startsWith('/api/comments')) {
        const { handleComments } = await import('./handlers/comments.js');
        return await handleComments(request, env);
      }
      
      return new Response('Not Found', { status: 404 });
      
    } catch (error) {
      console.error('Worker Error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: corsHeaders 
      });
    }
  }
};
