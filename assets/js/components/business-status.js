document.addEventListener('DOMContentLoaded', function() {
  updateBusinessStatus();
  setInterval(updateBusinessStatus, 60000); // 每分鐘更新一次
});

function updateBusinessStatus() {
  const now = new Date();
  const taipeiTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(now);
  
  const day = now.getDay(); // 0 = 週日, 1-5 = 週一至週五, 6 = 週六
  const hour = parseInt(taipeiTime.split(':')[0]);
  const minute = parseInt(taipeiTime.split(':')[1]);
  const currentTime = hour * 60 + minute; // 轉換為分鐘計算
  
  const morningStart = 8 * 60 + 30; // 08:30
  const morningEnd = 12 * 60 + 30;  // 12:30
  const afternoonStart = 13 * 60 + 30; // 13:30
  const afternoonEnd = 17 * 60 + 30;  // 17:30
  
  const statusText = document.getElementById('status-text');
  const statusDot = document.querySelector('.status-dot');
  
  // 判斷是否為工作日
  if (day >= 1 && day <= 5) {
    // 判斷是否在營業時間內
    if ((currentTime >= morningStart && currentTime < morningEnd) || 
        (currentTime >= afternoonStart && currentTime < afternoonEnd)) {
      statusText.textContent = '營業中';
      statusDot.classList.add('open');
      statusDot.classList.remove('closed', 'lunch');
    } else if (currentTime >= morningEnd && currentTime < afternoonStart) {
      statusText.textContent = '午休中 (13:30恢復營業)';
      statusDot.classList.add('lunch');
      statusDot.classList.remove('open', 'closed');
    } else if (currentTime < morningStart) {
      statusText.textContent = '休息中 (今日08:30開始營業)';
      statusDot.classList.add('closed');
      statusDot.classList.remove('open', 'lunch');
    } else {
      statusText.textContent = '休息中 (明日08:30開始營業)';
      statusDot.classList.add('closed');
      statusDot.classList.remove('open', 'lunch');
    }
  } else {
    statusText.textContent = '休息中 (週一08:30開始營業)';
    statusDot.classList.add('closed');
    statusDot.classList.remove('open', 'lunch');
  }
}
