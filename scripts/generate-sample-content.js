/*
  批量產生測試內容：articles / videos / faq / downloads
  - 針對每個 section 產生至多 20 筆完整內容（若已存在則跳過）
  - 內容為多段文字，方便測試分頁與樣式
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function countMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  function walk(p) {
    for (const name of fs.readdirSync(p)) {
      const full = path.join(p, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (name.endsWith('.md')) count++;
    }
  }
  walk(dir);
  return count;
}

function writeIfNotExists(filePath, content) {
  if (fs.existsSync(filePath)) return false;
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function fm(obj) {
  const yaml = Object.entries(obj)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n');
  return `---\n${yaml}\n---\n\n`;
}

function paragraphs(n = 6) {
  const base = [
    '本段內容為範例文字，用以模擬真實文章，描述背景、定義與情境說明。',
    '延伸解析重點與決策依據，提供讀者在實務上可以採取的具體行動。',
    '列出步驟與檢核表，確保流程可複製、可對照與可落地。',
    '補充法規、常見錯誤與風險提示，降低實務上的疑難與爭議。',
    '加入簡短案例，展示在不同規模或產業下的應用差異。',
    '最後提供整理與延伸閱讀建議，協助讀者建立結構化知識。',
  ];
  let out = '';
  for (let i = 0; i < n; i++) out += `${base[i % base.length]}\n\n`;
  return out;
}

// Articles
(function generateArticles() {
  const SECTION = path.join(ROOT, 'content', 'articles');
  const categories = [
    { slug: 'startup-guide', name: 'startup-guide' },
    { slug: 'tax-planning', name: 'tax-planning' },
    { slug: 'accounting-basics', name: 'accounting-basics' },
    { slug: 'legal-updates', name: 'legal-updates' },
  ];
  const need = Math.max(0, 20 - countMarkdownFiles(SECTION) + 1 /*_index*/);
  if (need <= 0) return;
  let created = 0;
  for (let i = 1; created < need; i++) {
    const cat = categories[i % categories.length];
    const dir = path.join(SECTION, cat.slug);
    const file = path.join(dir, `sample-article-${i}.md`);
    const title = `示範文章 ${i}（${cat.name}）`;
    const fmData = fm({
      title,
      date: `2024-09-${String((i % 28) + 1).padStart(2, '0')}`,
      category: cat.name,
      description: `${title} 的完整示範內容，用於測試分頁與樣式。`,
    });
    if (writeIfNotExists(file, fmData + paragraphs(10))) created++;
  }
})();

// Videos
(function generateVideos() {
  const SECTION = path.join(ROOT, 'content', 'videos');
  const categories = [
    { slug: 'popular', name: 'popular' },
    { slug: 'tutorials', name: 'tutorials' },
    { slug: 'case-studies', name: 'case-studies' },
    { slug: 'legal-explanation', name: 'legal-explanation' },
  ];
  const need = Math.max(0, 20 - countMarkdownFiles(SECTION) + 1);
  if (need <= 0) return;
  let created = 0;
  for (let i = 1; created < need; i++) {
    const cat = categories[i % categories.length];
    const dir = path.join(SECTION, cat.slug);
    const file = path.join(dir, `sample-video-${i}.md`);
    const title = `示範影片 ${i}（${cat.name}）`;
    const fmData = fm({
      title,
      date: `2024-08-${String((i % 28) + 1).padStart(2, '0')}`,
      category: cat.name,
      thumbnail: '/uploads/images/general/general-default.jpg',
      duration: '06:30',
      description: `${title} 的介紹與重點摘要。`,
    });
    if (writeIfNotExists(file, fmData + paragraphs(7))) created++;
  }
})();

// FAQ
(function generateFaq() {
  const SECTION = path.join(ROOT, 'content', 'faq');
  const categories = [
    { slug: 'startup', name: 'startup' },
    { slug: 'tax', name: 'tax' },
    { slug: 'accounting', name: 'accounting' },
    { slug: 'others', name: 'others' },
  ];
  const need = Math.max(0, 20 - countMarkdownFiles(SECTION) + 1);
  if (need <= 0) return;
  let created = 0;
  for (let i = 1; created < need; i++) {
    const cat = categories[i % categories.length];
    const dir = path.join(SECTION, cat.slug);
    const file = path.join(dir, `sample-faq-${i}.md`);
    const title = `常見問題 ${i}（${cat.name}）`;
    const fmData = fm({
      title,
      date: `2024-07-${String((i % 28) + 1).padStart(2, '0')}`,
      category: cat.name,
      description: `${title} 的完整解答。`,
    });
    const body = `### 問題說明\n\n${paragraphs(2)}### 解決方式\n\n${paragraphs(4)}### 延伸建議\n\n${paragraphs(2)}`;
    if (writeIfNotExists(file, fmData + body)) created++;
  }
})();

// Downloads
(function generateDownloads() {
  const SECTION = path.join(ROOT, 'content', 'downloads');
  const categories = [
    { slug: 'templates', name: 'templates' },
    { slug: 'forms', name: 'forms' },
    { slug: 'checklists', name: 'checklists' },
    { slug: 'regulations', name: 'regulations' },
  ];
  const types = ['pdf', 'docx', 'xlsx'];
  const need = Math.max(0, 20 - countMarkdownFiles(SECTION) + 1);
  if (need <= 0) return;
  let created = 0;
  for (let i = 1; created < need; i++) {
    const cat = categories[i % categories.length];
    const dir = path.join(SECTION, cat.slug);
    const file = path.join(dir, `sample-download-${i}.md`);
    const title = `下載資源 ${i}（${cat.name}）`;
    const filetype = types[i % types.length];
    const fmData = fm({
      title,
      date: `2024-06-${String((i % 28) + 1).padStart(2, '0')}`,
      category: cat.name,
      filetype,
      filesize: `${100 + i * 5}KB`,
      image: '/uploads/images/general/general-default.jpg',
      description: `${title} 的使用說明與適用情境。`,
    });
    if (writeIfNotExists(file, fmData + paragraphs(6))) created++;
  }
})();

console.log('Sample content generation complete.');

