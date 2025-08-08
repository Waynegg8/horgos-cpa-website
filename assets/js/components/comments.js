const section = document.querySelector('.comments-section');
if (section) {
  const pageId = section.getAttribute('data-page-id');
  const listEl = document.getElementById('comments-list');
  const form = document.getElementById('comment-form');
  const nickname = document.getElementById('nickname');
  const email = document.getElementById('email');
  const content = document.getElementById('content');
  const parentId = document.getElementById('parentId');
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
        <span>${new Date(c.timestamp || Date.now()).toLocaleString()}</span>
      </div>
      <p class="comment-content">${escapeHtml(c.content)}</p>
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
    return s.replace(/[&<>"] /g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',' ':'&nbsp;'}[m]));
  }

  async function init() {
    try {
      const comments = await api.get();
      render(comments, listEl);
    } catch (e) {
      console.error('Load comments failed', e);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      page_id: pageId,
      nickname: nickname.value.trim() || '訪客',
      email: email.value.trim() || '',
      content: content.value.trim(),
      parent_id: parentId.value || null,
    };
    if (!body.content) return;
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
}

