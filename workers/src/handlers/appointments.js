// 預約諮詢處理器
export async function handleAppointment(request, env) {
  if (request.method === 'POST') {
    try {
      const data = await request.json();
      
      // 驗證資料
      if (!data.name || !data.email || !data.phone || !data.service) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: '請填寫所有必要欄位' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 產生預約ID
      const appointmentId = generateId();
      const timestamp = new Date().toISOString();
      
      // 儲存到 KV
      const appointmentData = {
        id: appointmentId,
        ...data,
        timestamp,
        status: 'pending'
      };
      
      await env.APPOINTMENTS.put(appointmentId, JSON.stringify(appointmentData));
      
      // 發送通知郵件 (TODO: 實現郵件發送)
      
      return new Response(JSON.stringify({
        success: true,
        message: '預約已提交，我們將盡快與您聯絡',
        appointmentId
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Appointment Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: '預約提交失敗，請稍後再試'
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
