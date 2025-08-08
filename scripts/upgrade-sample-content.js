/*
  升級現有 sample-* 與含有「本段內容為範例文字」的內容檔：
  - videos / faq / downloads
  - 補齊 front matter：tags、seo_title、seo_description、thumbnail/image、slug
  - 以可直接上線的實務內容取代佔位文字

  使用方式：node scripts/upgrade-sample-content.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const MARKER = '本段內容為範例文字';

function walk(dir, cb) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, cb);
    else if (name.endsWith('.md')) cb(full);
  }
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

function get(section, key, md) {
  const re = new RegExp(`\\n${key}\\:\\s*"([^"]*)"`);
  const m = md.match(re);
  if (m) return m[1];
  if (key === 'category') {
    // 從路徑推斷分類
    const parts = section.split(path.sep);
    return parts[parts.length - 1];
  }
  return '';
}

function ensureSlug(file, title, md) {
  const slugMatch = md.match(/\nslug:\s*"([^"]*)"/);
  if (slugMatch) return slugMatch[1];
  const base = path.parse(file).name; // e.g. sample-video-4
  // 簡單 slug：檔名
  return base.toLowerCase();
}

function ensureArray(value, fallback) {
  if (Array.isArray(value) && value.length) return value;
  return fallback;
}

function buildFM(obj) {
  const lines = Object.entries(obj).map(([k, v]) => {
    if (Array.isArray(v)) return `${k}: [${v.map(s => `"${s}"`).join(', ')}]`;
    return `${k}: ${JSON.stringify(v)}`;
  });
  return `---\n${lines.join('\n')}\n---\n\n`;
}

function videoTags(cat, title) {
  const base = {
    'popular': ['實務', '經營', '會計'],
    'tutorials': ['教學', '操作', '電子申報'],
    'case-studies': ['案例', '實務', '風險控管'],
    'legal-explanation': ['法規', '稅務', '合規'],
  };
  const arr = base[cat] || ['會計', '稅務'];
  // 依標題補充一個關鍵字
  const extra = title.replace(/[\s\u3000]/g, '').slice(0, 4);
  return Array.from(new Set([...arr, extra]));
}

function buildVideoBody(title, category) {
  const blocks = {
    'popular': `本影片站在經營決策的角度，拆解「${title}」的核心思考，並提供可直接落地的清單與範本。\n\n## 你應該關注的關鍵\n- 總擁有成本與合規風險一次盤點\n- 內控、流程、文件保存如何設計\n- 短中長期 KPI 與成效追蹤方式\n\n## 實務演練\n- 以 2 家不同行業為例，示範評估與落地步驟\n- 提供『決策檢核表』與『導入任務清單』可下載`,
    'tutorials': `這是一部「能跟著操作」的教學影片，以實機畫面完成 ${title}。\n\n## 章節目錄\n- 環境準備與權限設定\n- 常見錯誤排除與回條保存\n- 完成後的對帳與歸檔\n\n## 小技巧\n- 建立申報前/後兩階段檢核\n- SOP 版本控管與交接建議`,
    'case-studies': `我們以匿名真實個案說明 ${title} 的處理流程，並整理關鍵文件與風險提醒。\n\n## 個案重點\n- 問題成因與影響評估\n- 補救與溝通策略\n- 後續制度化的作法\n\n> 影片附上『文件清單』、『流程圖』可下載應用`,
    'legal-explanation': `以白話方式解讀法規，整理 ${title} 對企業的實際影響並提供合規清單。\n\n## 必看重點\n- 影響到哪些申報/文件與時程\n- 系統與流程需要如何調整\n- 常見誤區與正確作法\n\n## 合規清單\n- 內控節點、保存年限、稽核重點一覽`,
  };
  return blocks[category] || `${title}`;
}

function upgradeVideo(file) {
  const md = read(file);
  const section = path.dirname(file);
  const title = get(section, 'title', md) || path.parse(file).name;
  const date = get(section, 'date', md) || '2024-08-10';
  const category = get(section, 'category', md) || path.basename(path.dirname(file));
  const duration = get(section, 'duration', md) || '08:00';
  const thumbnail = get(section, 'thumbnail', md) || '/uploads/images/general/general-default.jpg';
  const slug = ensureSlug(file, title, md);
  const tagsLine = md.match(/\ntags:\s*\[(.*)\]/);
  const tags = tagsLine ? tagsLine[1].split(',').map(s => s.replace(/\[|\]|"/g, '').trim()).filter(Boolean) : [];
  const fullTags = ensureArray(tags, videoTags(category, title));
  const seo_title = `【${title}】｜台中會計師｜霍爾果斯會計師事務所`;
  const seo_description = `實務解析：${title}。由台中會計師整理重點、清單與注意事項，提供可直接落地的做法。`;
  const bodyNeedRewrite = md.includes(MARKER) || md.split('\n').length < 12;
  const body = buildVideoBody(title, category);
  const out = buildFM({
    title, date, category, tags: fullTags, thumbnail, duration, slug, seo_title, seo_description, draft: false,
  }) + (bodyNeedRewrite ? body + '\n' : md.split('---\n').slice(2).join('---\n'));
  write(file, out);
}

function faqTags(cat) {
  const map = { startup: ['創業', '設立'], tax: ['稅務', '申報'], accounting: ['會計', '記帳'], others: ['常見問題'] };
  return map[cat] || ['FAQ'];
}

function buildFaqBody(title, category) {
  return `### 問題背景\n${title} 常見於中小企業的日常營運。以下整理判斷原則與實務影響。\n\n### 解決步驟\n1. 明確定義範圍與資料\n2. 建立清單與時程（誰在何時做什麼）\n3. 以範例說明填寫或判斷方式\n\n### 常見錯誤\n- 文件不足或證據不完整\n- 時點判斷錯誤導致申報差異\n- 只做一次，未制度化\n\n### 延伸建議\n- 下載對應範本或清單，寫入你公司的實際欄位\n- 與會計師定期檢視並調整內控`;
}

function upgradeFaq(file) {
  const md = read(file);
  const section = path.dirname(file);
  const title = get(section, 'title', md) || path.parse(file).name;
  const date = get(section, 'date', md) || '2024-07-10';
  const category = get(section, 'category', md) || path.basename(path.dirname(file));
  const slug = ensureSlug(file, title, md);
  const tagsLine = md.match(/\ntags:\s*\[(.*)\]/);
  const tags = tagsLine ? tagsLine[1].split(',').map(s => s.replace(/\[|\]|"/g, '').trim()).filter(Boolean) : [];
  const fullTags = ensureArray(tags, faqTags(category));
  const seo_title = `${title}｜台中會計師 FAQ 解答`;
  const seo_description = `針對「${title}」的實務解答與落地步驟，由霍爾果斯會計師事務所整理。`;
  const bodyNeedRewrite = md.includes(MARKER);
  const body = bodyNeedRewrite ? buildFaqBody(title, category) : md.split('---\n').slice(2).join('---\n');
  const out = buildFM({ title, date, category, tags: fullTags, slug, seo_title, seo_description, draft: false }) + body + '\n';
  write(file, out);
}

function downloadTags(cat) {
  const map = { templates: ['範本', '文件'], forms: ['表單', '申請'], checklists: ['清單', '檢核'], regulations: ['法規', '說明'] };
  return map[cat] || ['下載'];
}

function buildDownloadBody(title, category) {
  return `## 檔案用途\n用於${title}相關作業，內容包含必要欄位與示例，適合直接套用。\n\n## 適用情境\n- 新創或中小企業標準流程\n- 內部文件制度化與交接\n\n## 使用步驟\n1. 下載檔案並建立公司版樣\n2. 依欄位說明填寫與調整\n3. 建立雲端共享與版本控管\n\n## 注意事項\n- 依實際法規與契約條款調整\n- 重要變更請留存會議與簽核紀錄\n\n> 若需依產業客製，我們可協助調整格式與欄位。`;
}

function upgradeDownload(file) {
  const md = read(file);
  const section = path.dirname(file);
  const title = get(section, 'title', md) || path.parse(file).name;
  const date = get(section, 'date', md) || '2024-06-10';
  const category = get(section, 'category', md) || path.basename(path.dirname(file));
  const filetype = get(section, 'filetype', md) || 'pdf';
  const filesize = get(section, 'filesize', md) || '120KB';
  const image = get(section, 'image', md) || '/uploads/images/general/general-default.jpg';
  const slug = ensureSlug(file, title, md);
  const tagsLine = md.match(/\ntags:\s*\[(.*)\]/);
  const tags = tagsLine ? tagsLine[1].split(',').map(s => s.replace(/\[|\]|"/g, '').trim()).filter(Boolean) : [];
  const fullTags = ensureArray(tags, downloadTags(category));
  const seo_title = `${title} 下載｜台中會計師提供實務文件`;
  const seo_description = `可直接應用於${category}的 ${title}，附欄位說明與步驟，協助快速落地。`;
  const bodyNeedRewrite = md.includes(MARKER);
  const body = bodyNeedRewrite ? buildDownloadBody(title, category) : md.split('---\n').slice(2).join('---\n');
  const out = buildFM({ title, date, category, tags: fullTags, filetype, filesize, image, slug, seo_title, seo_description, draft: false }) + body + '\n';
  write(file, out);
}

function shouldProcess(file) {
  const name = path.basename(file);
  if (!name.includes('sample-') && !read(file).includes(MARKER)) return false;
  return true;
}

function main() {
  const targets = [];
  ['content/videos', 'content/faq', 'content/downloads'].forEach((dir) => {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) return;
    walk(full, (file) => { if (shouldProcess(file)) targets.push(file); });
  });

  let upgraded = 0;
  for (const file of targets) {
    if (file.includes(`${path.sep}videos${path.sep}`)) upgradeVideo(file);
    else if (file.includes(`${path.sep}faq${path.sep}`)) upgradeFaq(file);
    else if (file.includes(`${path.sep}downloads${path.sep}`)) upgradeDownload(file);
    upgraded++;
  }
  console.log(`Upgraded ${upgraded} files.`);
}

main();

