// 聯絡表單處理器
export async function handleContact(request, env) {
  if (request.method === 'POST') {
    try {
      const data = await request.json();
      
      // 驗證資料
      if (!data.name || !data.email || !data.message) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: '請填寫所有必要欄位' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 產生聯絡ID
      const contactId = generateId();
      const timestamp = new Date().toISOString();
      
      // 儲存到 KV
      const contactData = {
        id: contactId,
        ...data,
        timestamp,
        status: 'new'
      };
      
      await env.CONTACTS.put(contactId, JSON.stringify(contactData));
      
      return new Response(JSON.stringify({
        success: true,
        message: '訊息已送出，我們將盡快回覆您'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Contact Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: '訊息發送失敗，請稍後再試'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method Not Allowed', { status: 405 });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
