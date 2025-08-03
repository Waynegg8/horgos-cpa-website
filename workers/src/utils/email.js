/**
 * 郵件發送工具
 * 使用Cloudflare Email Workers發送郵件
 */

/**
 * 發送郵件
 * @param {Object} options - 郵件選項
 * @param {string} options.to - 收件人郵箱
 * @param {string} options.subject - 郵件主題
 * @param {string} options.text - 純文本內容
 * @param {string} options.html - HTML內容
 * @param {Object} env - 環境變數和綁定
 * @returns {Object} 發送結果
 */
export async function sendEmail(options, env) {
  try {
    const { to, subject, text, html } = options;
    
    // 驗證必要參數
    if (!to || !subject || (!text && !html)) {
      return {
        success: false,
        error: 'Missing required email parameters'
      };
    }
    
    // 準備郵件數據
    const emailData = {
      from: env.EMAIL_FROM || 'noreply@hugo-accounting.com',
      to,
      subject,
      text,
      html: html || text
    };
    
    // 發送郵件
    const response = await fetch(env.EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.EMAIL_API_KEY}`
      },
      body: JSON.stringify(emailData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Email sending failed:', result);
      return {
        success: false,
        error: result.error || 'Failed to send email'
      };
    }
    
    return {
      success: true,
      messageId: result.id || 'unknown'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: 'Internal error sending email'
    };
  }
}

/**
 * 發送預約確認郵件
 * @param {Object} appointment - 預約資料
 * @param {Object} env - 環境變數和綁定
 * @returns {Object} 發送結果
 */
export async function sendAppointmentConfirmation(appointment, env) {
  const { name, email, service_type } = appointment;
  const appointmentId = appointment.id || generateAppointmentId();
  
  const subject = `【Hugo會計事務所】預約確認 #${appointmentId}`;
  
  const html = `
    <div style="font-family: 'Noto Sans TC', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://hugo-accounting.com/logo.png" alt="Hugo會計事務所" style="max-width: 200px;">
      </div>
      
      <h1 style="color: #204B6E; font-size: 24px; margin-bottom: 20px;">預約確認通知</h1>
      
      <p>親愛的 ${name} 您好：</p>
      
      <p>感謝您預約Hugo會計事務所的${getServiceTypeName(service_type)}服務。我們已收到您的預約申請，以下是您的預約詳情：</p>
      
      <div style="background-color: #F5F6F5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>預約編號：</strong> #${appointmentId}</p>
        <p><strong>服務類型：</strong> ${getServiceTypeName(service_type)}</p>
        <p><strong>預約狀態：</strong> <span style="color: #10B981;">已確認</span></p>
      </div>
      
      <p>我們的客服人員將會在一個工作日內與您聯繫，確認諮詢時間和詳細事項。</p>
      
      <p>如有任何問題，請隨時與我們聯繫：</p>
      <ul>
        <li>電話：(04) 2345-6789</li>
        <li>LINE：@hugo-accounting</li>
        <li>Email：contact@hugo-accounting.com</li>
      </ul>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 14px; color: #6B7280;">
        <p>此為系統自動發送的郵件，請勿直接回覆。</p>
        <p>© 2024 Hugo會計師事務所 版權所有</p>
      </div>
    </div>
  `;
  
  const text = `
預約確認通知

親愛的 ${name} 您好：

感謝您預約Hugo會計事務所的${getServiceTypeName(service_type)}服務。我們已收到您的預約申請，以下是您的預約詳情：

預約編號： #${appointmentId}
服務類型： ${getServiceTypeName(service_type)}
預約狀態： 已確認

我們的客服人員將會在一個工作日內與您聯繫，確認諮詢時間和詳細事項。

如有任何問題，請隨時與我們聯繫：
- 電話：(04) 2345-6789
- LINE：@hugo-accounting
- Email：contact@hugo-accounting.com

此為系統自動發送的郵件，請勿直接回覆。
© 2024 Hugo會計師事務所 版權所有
  `;
  
  return await sendEmail({ to: email, subject, html, text }, env);
}

/**
 * 發送管理員通知郵件
 * @param {Object} appointment - 預約資料
 * @param {Object} env - 環境變數和綁定
 * @returns {Object} 發送結果
 */
export async function sendAdminNotification(appointment, env) {
  const { name, email, phone, line_id, service_type, content } = appointment;
  const appointmentId = appointment.id || 'unknown';
  
  const subject = `【系統通知】新預約申請 #${appointmentId}`;
  
  const html = `
    <div style="font-family: 'Noto Sans TC', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
      <h1 style="color: #204B6E; font-size: 24px; margin-bottom: 20px;">新預約申請通知</h1>
      
      <p>系統收到一筆新的預約申請，詳情如下：</p>
      
      <div style="background-color: #F5F6F5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>預約編號：</strong> #${appointmentId}</p>
        <p><strong>姓名：</strong> ${name}</p>
        <p><strong>電子郵件：</strong> ${email}</p>
        <p><strong>聯絡電話：</strong> ${phone}</p>
        <p><strong>LINE ID：</strong> ${line_id}</p>
        <p><strong>服務類型：</strong> ${getServiceTypeName(service_type)}</p>
        <p><strong>諮詢內容：</strong></p>
        <div style="background-color: white; padding: 10px; border-radius: 4px;">
          ${content || '(無填寫)'}
        </div>
      </div>
      
      <p>請盡快安排客服人員與客戶聯繫，確認諮詢時間和詳細事項。</p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 14px; color: #6B7280;">
        <p>此為系統自動發送的郵件。</p>
        <p>© 2024 Hugo會計師事務所 版權所有</p>
      </div>
    </div>
  `;
  
  const text = `
新預約申請通知

系統收到一筆新的預約申請，詳情如下：

預約編號： #${appointmentId}
姓名： ${name}
電子郵件： ${email}
聯絡電話： ${phone}
LINE ID： ${line_id}
服務類型： ${getServiceTypeName(service_type)}
諮詢內容：
${content || '(無填寫)'}

請盡快安排客服人員與客戶聯繫，確認諮詢時間和詳細事項。

此為系統自動發送的郵件。
© 2024 Hugo會計師事務所 版權所有
  `;
  
  return await sendEmail({ 
    to: env.ADMIN_EMAIL || 'admin@hugo-accounting.com', 
    subject, 
    html, 
    text 
  }, env);
}

/**
 * 生成預約編號
 * @returns {string} 預約編號
 */
function generateAppointmentId() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `A${year}${month}${day}${random}`;
}

/**
 * 獲取服務類型名稱
 * @param {string} type - 服務類型代碼
 * @returns {string} 服務類型名稱
 */
function getServiceTypeName(type) {
  const types = {
    'business-registration': '工商登記',
    'tax-filing': '稅務申報',
    'audit-services': '財稅簽證',
    'consulting': '諮詢服務',
    'others': '其他服務'
  };
  
  return types[type] || '諮詢服務';
}