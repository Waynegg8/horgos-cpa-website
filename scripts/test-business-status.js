/**
 * 營業狀態測試腳本
 * 測試營業狀態計算邏輯
 */

// 模擬營業時間計算
function calculateBusinessStatus(date) {
  const day = date.getDay(); // 0 = 週日, 1-5 = 週一至週五, 6 = 週六
  const hour = date.getHours();
  const minute = date.getMinutes();
  const currentTime = hour * 60 + minute;
  
  // 營業時間定義
  const morningStart = 8 * 60 + 30; // 08:30
  const morningEnd = 12 * 60 + 30;  // 12:30
  const afternoonStart = 13 * 60 + 30; // 13:30
  const afternoonEnd = 17 * 60 + 30;  // 17:30
  
  // 檢查是否為工作日
  const isWeekday = day >= 1 && day <= 5;
  
  // 計算狀態
  let status = 'closed';
  let message = '休息中';
  let nextChangeTime = '';
  
  if (isWeekday) {
    if (currentTime >= morningStart && currentTime < morningEnd) {
      // 上午營業時間
      status = 'open';
      message = '營業中';
      nextChangeTime = '12:30';
    } else if (currentTime >= afternoonStart && currentTime < afternoonEnd) {
      // 下午營業時間
      status = 'open';
      message = '營業中';
      nextChangeTime = '17:30';
    } else if (currentTime >= morningEnd && currentTime < afternoonStart) {
      // 午休時間
      status = 'lunch';
      message = '午休中';
      nextChangeTime = '13:30';
    } else if (currentTime < morningStart) {
      // 早上未開始營業
      status = 'closed';
      message = '休息中';
      nextChangeTime = '08:30';
    } else {
      // 晚上已結束營業
      status = 'closed';
      message = '休息中';
      nextChangeTime = '明日08:30';
    }
  } else {
    // 週末
    status = 'closed';
    message = '休息中';
    nextChangeTime = '週一08:30';
  }
  
  return {
    status,
    message,
    nextChangeTime,
    currentTime: date.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
    dayOfWeek: ['日', '一', '二', '三', '四', '五', '六'][day]
  };
}

// 測試不同時間點
function testBusinessStatus() {
  console.log('=== 營業狀態測試 ===\n');
  
  const testTimes = [
    new Date('2024-01-15T08:00:00+08:00'), // 週一早上開始前
    new Date('2024-01-15T09:00:00+08:00'), // 週一早上營業中
    new Date('2024-01-15T12:00:00+08:00'), // 週一早上營業中
    new Date('2024-01-15T12:45:00+08:00'), // 週一午休中
    new Date('2024-01-15T14:00:00+08:00'), // 週一下午營業中
    new Date('2024-01-15T17:00:00+08:00'), // 週一下午營業中
    new Date('2024-01-15T18:00:00+08:00'), // 週一晚上休息
    new Date('2024-01-20T10:00:00+08:00'), // 週六
    new Date('2024-01-21T10:00:00+08:00'), // 週日
  ];
  
  testTimes.forEach(time => {
    const result = calculateBusinessStatus(time);
    console.log(`時間: ${result.currentTime} (週${result.dayOfWeek})`);
    console.log(`狀態: ${result.message}`);
    console.log(`下次變更: ${result.nextChangeTime}`);
    console.log('---');
  });
}

// 測試假日邏輯
function testHolidayLogic() {
  console.log('\n=== 假日邏輯測試 ===\n');
  
  // 模擬假日數據
  const holidays = [
    { date: '2024-01-01', name: '元旦', isWorkday: false },
    { date: '2024-02-17', name: '補班日', isWorkday: true },
  ];
  
  const testDates = [
    new Date('2024-01-01T10:00:00+08:00'), // 元旦
    new Date('2024-02-17T10:00:00+08:00'), // 補班日
  ];
  
  testDates.forEach(date => {
    const dateStr = date.toISOString().split('T')[0];
    const holiday = holidays.find(h => h.date === dateStr);
    
    console.log(`日期: ${dateStr}`);
    if (holiday) {
      console.log(`假日: ${holiday.name}`);
      console.log(`是否上班: ${holiday.isWorkday ? '是' : '否'}`);
    } else {
      console.log('非假日');
    }
    console.log('---');
  });
}

// 執行測試
testBusinessStatus();
testHolidayLogic(); 