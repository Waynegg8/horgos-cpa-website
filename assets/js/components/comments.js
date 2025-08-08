const section = document.querySelector('.comments-section');
if (section) {
  const pageId = section.getAttribute('data-page-id');
  const listEl = document.getElementById('comments-list');
  const form = document.getElementById('comment-form');
  const nickname = document.getElementById('nickname');
  const lineId = document.getElementById('lineId');
  const content = document.getElementById('content');
  const parentId = document.getElementById('parentId');
  const recaptchaToken = document.getElementById('recaptchaToken');
  const cancelReply = document.getElementById('cancel-reply');

  const api = {
    async get() {
      const res = await fetch(`/api/comments/${pageId}`);
      const data = await res.json();
      return data.data || [];
    },
    async post(body) {
      const res = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      return await res.json();
    },
    async reply(commentId, body) {
      const res = await fetch(`/api/comments/${commentId}/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      return await res.json();
    }
  };

  function render(comments, container) {
    container.innerHTML = '';
    comments.forEach(c => container.appendChild(renderItem(c)));
  }

  function renderItem(c) {
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `
      <div class="comment-meta">
        <strong>${escapeHtml(c.nickname)}</strong>
        <span>${timeAgo(c.timestamp || Date.now())}</span>
      </div>
      <div class="comment-content">${renderMarkdown(c.content || '')}</div>
      <div class="comment-actions">
        <button type="button" class="btn btn-secondary btn-xs" data-reply="${c.id}"><i class="fas fa-reply"></i> 回覆</button>
      </div>
      <div class="replies"></div>
    `;
    if (Array.isArray(c.replies) && c.replies.length) {
      const repliesEl = item.querySelector('.replies');
      c.replies.forEach(r => repliesEl.appendChild(renderItem(r)));
    }
    item.querySelector('[data-reply]')?.addEventListener('click', () => {
      parentId.value = c.id;
      cancelReply.hidden = false;
      content.focus();
    });
    return item;
  }

  function escapeHtml(s = '') {
    return s.replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  }

  function renderMarkdown(text = '') {
    // 簡易 Markdown：粗體、連結、項目符號與換行
    let html = escapeHtml(text);
    html = html.replace(/^\-\s+(.*)$/gm, '<li>$1</li>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\[(.*?)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // 包裹清單
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    return html.replace(/\n/g, '<br>');
  }

  function timeAgo(ts) {
    const d = new Date(ts);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return `${diff} 秒前`;
    if (diff < 3600) return `${Math.floor(diff/60)} 分鐘前`;
    if (diff < 86400) return `${Math.floor(diff/3600)} 小時前`;
    if (diff < 2592000) return `${Math.floor(diff/86400)} 天前`;
    return d.toLocaleDateString();
  }

  async function init() {
    try {
      const comments = await api.get();
      // 依時間順序（舊到新）
      comments.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
      render(comments, listEl);
    } catch (e) {
      console.error('Load comments failed', e);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      pageId,
      nickname: nickname.value.trim(),
      lineId: lineId.value.trim(),
      content: content.value.trim(),
      recaptchaToken: '',
      parent_id: parentId.value || null,
    };
    // 前端驗證
    if (!body.nickname) { nickname.focus(); return; }
    if (!body.lineId) { lineId.focus(); return; }

    // 取得 reCAPTCHA v3 token（若載入失敗，阻止送出並提示）
    try {
      body.recaptchaToken = await getRecaptchaToken();
    } catch {}
    if (!body.recaptchaToken) {
      const status = document.getElementById('comment-status');
      if (status) status.textContent = 'reCAPTCHA 驗證載入失敗，請重新整理頁面後再送出。';
      return;
    }

    try {
      if (body.parent_id) await api.reply(body.parent_id, body);
      else await api.post(body);
      content.value = '';
      parentId.value = '';
      cancelReply.hidden = true;
      init();
    } catch (e) {
      console.error('Post comment failed', e);
    }
  });

  cancelReply.addEventListener('click', () => {
    parentId.value = '';
    cancelReply.hidden = true;
  });

  init();

  function getRecaptchaToken() {
    return new Promise((resolve) => {
      const script = document.querySelector('script[src*="recaptcha"]');
      const siteKey = script ? (script.src.split('render=')[1] || '') : (window.__RECAPTCHA_SITE_KEY__ || '');
      if (typeof grecaptcha !== 'undefined' && grecaptcha.execute && siteKey) {
        grecaptcha.ready(function() {
          grecaptcha.execute(siteKey, { action: 'comment_submit' }).then(resolve).catch(() => resolve(''));
        });
      } else {
        resolve('');
      }
    });
  }
}

