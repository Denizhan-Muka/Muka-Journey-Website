(() => {
  const login = document.getElementById('admin-login');
  const tokenInput = document.getElementById('admin-token');
  const feedback = document.getElementById('admin-feedback');
  const dashboard = document.getElementById('dashboard');
  const loginPanel = document.getElementById('login-panel');
  let token = sessionStorage.getItem('muka-admin-token') || '';

  const formatDate = value => new Intl.DateTimeFormat('tr-TR', {dateStyle:'medium', timeStyle:'short'}).format(new Date(value));
  const cell = (row, value) => { const td = document.createElement('td'); td.textContent = value || '—'; row.appendChild(td); };
  function fillTable(bodyId, emptyId, rows, fields) {
    const body = document.getElementById(bodyId); body.replaceChildren();
    document.getElementById(emptyId).hidden = rows.length > 0;
    rows.forEach(item => { const row = document.createElement('tr'); fields.forEach(field => cell(row, field === 'created_at' ? formatDate(item[field]) : item[field])); body.appendChild(row); });
  }

  async function load() {
    feedback.textContent = 'Kayıtlar yükleniyor…';
    try {
      const response = await fetch('/api/admin/data', {headers:{Authorization:`Bearer ${token}`}});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error === 'admin_not_configured' ? 'Sunucuda ADMIN_TOKEN ayarlanmamış.' : 'Yönetim anahtarı geçersiz.');
      sessionStorage.setItem('muka-admin-token', token); feedback.textContent = '';
      loginPanel.hidden = true; dashboard.hidden = false;
      document.getElementById('inquiry-count').textContent = data.inquiries.length;
      document.getElementById('subscriber-count').textContent = data.subscribers.length;
      fillTable('inquiries-body','inquiries-empty',data.inquiries,['created_at','name','email','experience','guests','preferred_date','message','language']);
      fillTable('subscribers-body','subscribers-empty',data.subscribers,['created_at','email','language']);
    } catch (error) { dashboard.hidden = true; loginPanel.hidden = false; feedback.textContent = error.message; }
  }
  login.addEventListener('submit', event => { event.preventDefault(); token = tokenInput.value; load(); });
  document.getElementById('refresh').addEventListener('click', load);
  if (token) { tokenInput.value = token; load(); }
})();
