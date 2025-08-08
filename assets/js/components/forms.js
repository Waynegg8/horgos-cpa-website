/**
 * 表單處理腳本
 * 處理預約表單提交和驗證
 */

document.addEventListener('DOMContentLoaded', function() {
  // 獲取預約表單
  const appointmentForm = document.getElementById('appointment-form');
  
  if (appointmentForm) {
    // 初始化表單
    initAppointmentForm(appointmentForm);
  }
  
  /**
   * 初始化預約表單
   * @param {HTMLElement} form - 表單元素
   */
  function initAppointmentForm(form) {
    // 獲取服務類型按鈕
    const serviceTypeButtons = form.querySelectorAll('.service-type-btn');
    const serviceTypeInput = form.querySelector('input[name="service_type"]');
    
    // 設置服務類型按鈕點擊事件
    serviceTypeButtons.forEach(button => {
      button.addEventListener('click', function() {
        // 移除所有按鈕的選中狀態
        serviceTypeButtons.forEach(btn => btn.classList.remove('selected'));
        
        // 添加當前按鈕的選中狀態
        this.classList.add('selected');
        
        // 設置隱藏輸入框的值
        serviceTypeInput.value = this.dataset.value;
      });
    });
    
    // 設置表單提交事件
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // 表單驗證
      if (validateForm(form)) {
        // 顯示載入狀態
        showLoadingState(form);
        
        // 獲取表單數據
        const formData = new FormData(form);
        const formDataObject = {};
        
        formData.forEach((value, key) => {
          formDataObject[key] = value;
        });
        
        // 添加reCAPTCHA令牌
        getReCaptchaToken().then(token => {
          formDataObject.recaptcha_token = token;
          // 後端容錯：同時提供駝峰欄位，避免後端尚未更新時失配
          formDataObject.recaptchaToken = token;
          
          // 發送表單數據
          submitForm(formDataObject, form);
        }).catch(error => {
          console.error('獲取reCAPTCHA令牌失敗:', error);
          showError(form, '驗證失敗，請重試');
        });
      }
    });
  }
  
  /**
   * 表單驗證
   * @param {HTMLElement} form - 表單元素
   * @returns {boolean} 驗證結果
   */
  function validateForm(form) {
    // 獲取必填字段
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // 檢查每個必填字段
    requiredFields.forEach(field => {
      // 移除之前的錯誤提示
      const errorMessage = field.parentElement.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.remove();
      }
      
      // 檢查字段是否為空
      if (!field.value.trim()) {
        isValid = false;
        showFieldError(field, '此欄位為必填');
      } else {
        // 根據字段類型進行特定驗證
        switch (field.name) {
          case 'email':
            // 電子郵件格式驗證
            if (!validateEmail(field.value)) {
              isValid = false;
              showFieldError(field, '請輸入有效的電子郵件地址');
            }
            break;
          case 'phone':
            // 電話格式驗證
            if (!validatePhone(field.value)) {
              isValid = false;
              showFieldError(field, '請輸入有效的電話號碼');
            }
            break;
          case 'name':
            // 姓名長度驗證
            if (field.value.length < 2 || field.value.length > 20) {
              isValid = false;
              showFieldError(field, '姓名長度應為2-20個字');
            }
            break;
          case 'service_type':
            // 服務類型驗證
            if (!field.value) {
              isValid = false;
              showFieldError(field, '請選擇諮詢服務類型');
            }
            break;
          case 'privacy_consent':
            // 隱私權同意驗證
            if (!field.checked) {
              isValid = false;
              showFieldError(field, '請同意隱私權政策');
            }
            break;
        }
      }
    });
    
    return isValid;
  }
  
  /**
   * 顯示字段錯誤提示
   * @param {HTMLElement} field - 表單字段元素
   * @param {string} message - 錯誤訊息
   */
  function showFieldError(field, message) {
    // 創建錯誤訊息元素
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // 添加到字段後面
    field.parentElement.appendChild(errorElement);
    
    // 添加錯誤樣式
    field.classList.add('error');
    
    // 設置焦點事件，移除錯誤樣式
    field.addEventListener('focus', function() {
      this.classList.remove('error');
      const errorMessage = this.parentElement.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.remove();
      }
    }, { once: true });
  }
  
  /**
   * 驗證電子郵件格式
   * @param {string} email - 電子郵件地址
   * @returns {boolean} 驗證結果
   */
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  /**
   * 驗證電話格式
   * @param {string} phone - 電話號碼
   * @returns {boolean} 驗證結果
   */
  function validatePhone(phone) {
    // 支援台灣手機和市話格式
    const regex = /^(09\d{8}|0\d{1,2}-\d{6,8}|\d{2,3}-\d{6,8})$/;
    return regex.test(phone);
  }
  
  /**
   * 獲取reCAPTCHA令牌
   * @returns {Promise} 包含令牌的Promise
   */
    function getReCaptchaToken() {
    return new Promise((resolve, reject) => {
      // 檢查reCAPTCHA是否已載入
        const siteKey = (document.body && document.body.dataset && document.body.dataset.recaptchaSiteKey) || window.__RECAPTCHA_SITE_KEY__ || '6LdOlZkrAAAAAJUXslB2aaWOKbAbOt_DRx5aea-';
        if (typeof grecaptcha !== 'undefined' && grecaptcha.execute) {
        grecaptcha.ready(function() {
          grecaptcha.execute(siteKey, { action: 'appointment_submit' })
            .then(resolve)
            .catch(reject);
        });
      } else {
        // reCAPTCHA未載入，返回空令牌
        console.warn('reCAPTCHA未載入');
        resolve('');
      }
    });
  }
  
  /**
   * 顯示表單載入狀態
   * @param {HTMLElement} form - 表單元素
   */
  function showLoadingState(form) {
    // 獲取提交按鈕
    const submitButton = form.querySelector('button[type="submit"]');
    
    // 保存原始文字
    submitButton.dataset.originalText = submitButton.textContent;
    
    // 設置載入狀態
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    submitButton.innerHTML = '<span class="loading-spinner"></span> 送出中...';
    
    // 禁用所有輸入框
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(input => {
      input.disabled = true;
    });
  }
  
  /**
   * 恢復表單正常狀態
   * @param {HTMLElement} form - 表單元素
   */
  function restoreFormState(form) {
    // 獲取提交按鈕
    const submitButton = form.querySelector('button[type="submit"]');
    
    // 恢復原始文字
    submitButton.textContent = submitButton.dataset.originalText || '送出預約';
    
    // 移除載入狀態
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
    
    // 啟用所有輸入框
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(input => {
      input.disabled = false;
    });
  }
  
  /**
   * 提交表單
   * @param {Object} formData - 表單數據
   * @param {HTMLElement} form - 表單元素
   */
  function submitForm(formData, form) {
    // 發送API請求
    fetch('/api/forms/appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      // 恢復表單狀態
      restoreFormState(form);
      
      if (data.success) {
        // 顯示成功訊息
        showSuccess(form);
      } else {
        // 顯示錯誤訊息
        showError(form, data.error || '提交失敗，請稍後再試');
      }
    })
    .catch(error => {
      console.error('提交表單失敗:', error);
      
      // 恢復表單狀態
      restoreFormState(form);
      
      // 顯示錯誤訊息
      showError(form, '提交失敗，請稍後再試');
    });
  }
  
  /**
   * 顯示成功訊息
   * @param {HTMLElement} form - 表單元素
   */
  function showSuccess(form) {
    // 隱藏表單
    form.style.display = 'none';
    
    // 獲取或創建成功訊息容器
    let successMessage = document.getElementById('form-success-message');
    
    if (!successMessage) {
      successMessage = document.createElement('div');
      successMessage.id = 'form-success-message';
      successMessage.className = 'form-message success';
      
      // 創建成功訊息內容
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      
      // 添加成功圖示
      const icon = document.createElement('div');
      icon.className = 'success-icon';
      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
      
      // 添加成功標題
      const title = document.createElement('h3');
      title.textContent = '預約申請已送出';
      
      // 添加成功訊息
      const message = document.createElement('p');
      message.textContent = '感謝您的預約申請，我們已收到您的資訊，客服人員將會在一個工作日內與您聯繫確認諮詢時間和詳細事項。';
      
      // 組合成功訊息
      messageContent.appendChild(icon);
      messageContent.appendChild(title);
      messageContent.appendChild(message);
      successMessage.appendChild(messageContent);
      
      // 添加到表單後面
      form.parentElement.appendChild(successMessage);
    } else {
      // 顯示已存在的成功訊息
      successMessage.style.display = 'block';
    }
    
    // 滾動到成功訊息
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  /**
   * 顯示錯誤訊息
   * @param {HTMLElement} form - 表單元素
   * @param {string} message - 錯誤訊息
   */
  function showError(form, message) {
    // 獲取或創建錯誤訊息容器
    let errorContainer = form.querySelector('.form-error-message');
    
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.className = 'form-error-message';
      form.prepend(errorContainer);
    }
    
    // 設置錯誤訊息
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    
    // 5秒後自動隱藏
    setTimeout(() => {
      errorContainer.style.display = 'none';
    }, 5000);
    
    // 滾動到錯誤訊息
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});