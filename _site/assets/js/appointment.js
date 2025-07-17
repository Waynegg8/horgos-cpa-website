document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('appointment-form');
  const errorContainer = document.getElementById('form-errors');
  const submitButton = document.getElementById('submit-button');
  const siteData = { formspreeUrl: '{{ site.formspreeUrl }}' }; // 從 Eleventy 取得 Formspree URL

  if (!form) return;

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    let errors = [];

    // 檢查欄位
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const privacy = form.querySelector('#privacy-policy');

    if (name.value.trim() === '') errors.push('請填寫您的姓名');
    if (!validateEmail(email.value)) errors.push('請填寫有效的電子郵件格式');
    if (!validatePhone(phone.value)) errors.push('請填寫有效的台灣手機號碼格式');
    if (!privacy.checked) errors.push('您必須同意隱私權政策');
    
    // 顯示錯誤或提交表單
    if (errors.length > 0) {
      errorContainer.innerHTML = errors.join('<br>');
    } else {
      errorContainer.innerHTML = '';
      submitButton.disabled = true;
      submitButton.textContent = '傳送中...';
      
      const formData = new FormData(form);
      
      fetch(siteData.formspreeUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          window.location.href = '/appointment-success/'; // 跳轉到成功頁面
        } else {
          response.json().then(data => {
            if (Object.hasOwn(data, 'errors')) {
              errorContainer.innerHTML = data["errors"].map(error => error["message"]).join(", ");
            } else {
              errorContainer.innerHTML = '表單提交失敗，請稍後再試。';
            }
          })
        }
      }).catch(error => {
        errorContainer.innerHTML = '網路發生錯誤，請檢查您的連線並再試一次。';
      }).finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = '送出預約';
      });
    }
  });

  // --- 驗證函式 ---
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    // 允許 09xx-xxxxxx 或 09xxxxxxxx
    const re = /^(09\d{2}-?\d{6})$/;
    return re.test(String(phone));
  }
});