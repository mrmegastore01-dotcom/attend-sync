// ══════════════════════════════════════════════════
//  AttendSync — Shared App Utilities
// ══════════════════════════════════════════════════

/* ── Supabase singleton ─────────────────────────── */
let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = supabase.createClient(window.__SUPA_URL, window.__SUPA_ANON);
  }
  return _supabase;
}

/* ── Auth guard (call on every protected page) ──── */
async function requireAuth() {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

/* ── Sign out ────────────────────────────────────── */
async function signOut() {
  const sb = getSupabase();
  await sb.auth.signOut();
  window.location.href = 'login.html';
}

/* ── Toast notifications ─────────────────────────── */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  toast.innerHTML = `${icon}<span>${message}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ── Loading overlay ─────────────────────────────── */
function showLoading(show = true) {
  let overlay = document.querySelector('.loading-overlay');
  if (!overlay && show) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `<div class="loading-spinner"></div>`;
    document.body.appendChild(overlay);
  }
  if (overlay) {
    overlay.style.display = show ? 'flex' : 'none';
    if (!show) setTimeout(() => overlay.remove(), 100);
  }
}

/* ── Format date ─────────────────────────────────────
   FIX: new Date('YYYY-MM-DD') parses as UTC midnight.
   In any UTC- timezone the date shifts back by one day.
   We parse the parts manually to stay in local time.
─────────────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '—';
  // Handle both 'YYYY-MM-DD' strings and full ISO timestamps
  const dateStr = typeof d === 'string' ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10);
  const [year, month, day] = dateStr.split('-').map(Number);
  // Construct as local midnight — no UTC offset shift
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// FIX: toISOString() returns UTC midnight — in UTC+ timezones like PKT (UTC+5)
// this can produce yesterday's date. Use local date parts instead.
function todayISO() {
  const now = new Date();
  const y   = now.getFullYear();
  const m   = String(now.getMonth() + 1).padStart(2, '0');
  const d   = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* ── Render sidebar active state ─────────────────── */
function setActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

/* ── Sidebar HTML (shared) ───────────────────────── */
function renderSidebar(activePage, userEmail = '') {
  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <div class="brand-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
          <circle cx="12" cy="16" r="2"/>
        </svg>
      </div>
      <span class="brand-name">Attend<span style="color:var(--primary)">Sync</span></span>
    </div>

    <nav class="sidebar-nav">
      <span class="nav-section-label">Main</span>
      <a href="dashboard.html" class="nav-link ${activePage==='dashboard'?'active':''}" data-page="dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Dashboard
      </a>
      <a href="staff.html" class="nav-link ${activePage==='staff'?'active':''}" data-page="staff">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Staff
      </a>
      <a href="attendance.html" class="nav-link ${activePage==='attendance'?'active':''}" data-page="attendance">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        Attendance
      </a>
      <a href="reports.html" class="nav-link ${activePage==='reports'?'active':''}" data-page="reports">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        Reports
      </a>

      <span class="nav-section-label" style="margin-top:1rem">System</span>
      <a href="settings.html" class="nav-link ${activePage==='settings'?'active':''}" data-page="settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M4.93 4.93a10 10 0 0 1 14.14 14.14"/>
        </svg>
        Settings
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="user-chip">
        <div class="user-avatar">${(userEmail||'A')[0].toUpperCase()}</div>
        <div class="user-info">
          <span class="user-name">Admin</span>
          <span class="user-email">${userEmail || 'admin'}</span>
        </div>
        <button class="logout-btn" onclick="signOut()" title="Sign out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  </aside>`;
}

/* ── Header HTML (shared) ─────────────────────────── */
function renderHeader(title, subtitle = '') {
  return `
  <header class="top-header">
    <button class="menu-toggle" id="menuToggle" onclick="toggleSidebar()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
    <div class="header-title">
      <h1>${title}</h1>
      ${subtitle ? `<span class="header-sub">${subtitle}</span>` : ''}
    </div>
    <div class="header-date">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
      <span>${new Date().toLocaleDateString('en-GB', {weekday:'short', day:'2-digit', month:'short', year:'numeric'})}</span>
    </div>
  </header>`;
}

/* ── Footer HTML (shared) ─────────────────────────── */
function renderFooter() {
  return `<footer class="app-footer">© 2026 Made by <strong>JB Studios</strong></footer>`;
}

/* ── Sidebar toggle (mobile) ─────────────────────── */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

/* ── Shared CSS injected once ─────────────────────── */
const SHARED_CSS = `
/* ── Shared Toast ─────────────────────────────────── */
.toast {
  position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
  display: flex; align-items: center; gap: 0.625rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem; font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  transform: translateY(12px); opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}
.toast.show { transform: translateY(0); opacity: 1; pointer-events: auto; }
.toast svg { width: 18px; height: 18px; flex-shrink: 0; }
.toast-success { background: #1b5e20; color: #fff; }
.toast-error   { background: #b71c1c; color: #fff; }
.toast-info    { background: #0d47a1; color: #fff; }

/* ── Loading Overlay ──────────────────────────────── */
.loading-overlay {
  position: fixed; inset: 0; z-index: 9998;
  background: rgba(249,249,255,0.7);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(2px);
}
.loading-spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--surface-high, #dee9fd);
  border-top-color: var(--primary, #3525cd);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Sidebar base ─────────────────────────────────── */
.sidebar {
  width: var(--sidebar-w, 260px);
  background: var(--surface-low, #eff3ff);
  display: flex; flex-direction: column;
  position: fixed; top: 0; left: 0; height: 100%;
  z-index: 100; padding: 0 0 1.5rem;
  transition: transform 0.3s ease;
  border-right: 1px solid rgba(199,196,216,0.2);
}
.sidebar-brand {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 1.25rem 1.5rem; height: var(--header-h, 68px);
  border-bottom: 1px solid rgba(199,196,216,0.2);
}
.brand-mark {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, var(--primary, #3525cd), var(--primary-container, #4f46e5));
  border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.brand-mark svg { width: 20px; height: 20px; }
.brand-name { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 1.05rem; letter-spacing: -0.02em; color: var(--on-surface, #121c2a); }
.sidebar-nav { flex: 1; overflow-y: auto; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 2px; }
.nav-section-label { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--on-surface-variant, #4a5568); padding: 0.5rem 0.75rem 0.25rem; }
.nav-link {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.625rem 0.875rem; border-radius: 0.625rem;
  font-size: 0.875rem; font-weight: 500; color: var(--on-surface-variant, #4a5568);
  text-decoration: none; transition: all 0.15s ease;
}
.nav-link svg { width: 18px; height: 18px; flex-shrink: 0; }
.nav-link:hover { background: rgba(53,37,205,0.06); color: var(--primary, #3525cd); }
.nav-link.active { background: rgba(53,37,205,0.1); color: var(--primary, #3525cd); font-weight: 600; }
.sidebar-footer { padding: 0 0.75rem; }
.user-chip {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem; border-radius: 0.75rem;
  background: var(--surface-high, #dee9fd);
}
.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary, #3525cd), var(--primary-container, #4f46e5));
  color: #fff; font-weight: 700; font-size: 0.8125rem;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.user-info { flex: 1; min-width: 0; }
.user-name { display: block; font-size: 0.8125rem; font-weight: 600; color: var(--on-surface, #121c2a); }
.user-email { display: block; font-size: 0.6875rem; color: var(--on-surface-variant, #4a5568); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.logout-btn { background: none; border: none; cursor: pointer; color: var(--on-surface-variant, #4a5568); padding: 4px; border-radius: 6px; transition: color 0.15s; }
.logout-btn:hover { color: #c62828; }
.logout-btn svg { width: 16px; height: 16px; }

/* ── Top Header ───────────────────────────────────── */
.top-header {
  height: var(--header-h, 68px); background: var(--surface-lowest, #fff);
  border-bottom: 1px solid rgba(199,196,216,0.25);
  display: flex; align-items: center; gap: 1rem;
  padding: 0 2rem; position: sticky; top: 0; z-index: 50;
  box-shadow: 0 1px 4px rgba(18,28,42,0.04);
}
.menu-toggle { display: none; background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: var(--on-surface-variant, #4a5568); }
.menu-toggle svg { width: 20px; height: 20px; }
.header-title { flex: 1; }
.header-title h1 { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 1.15rem; letter-spacing: -0.02em; color: var(--on-surface, #121c2a); }
.header-sub { font-size: 0.75rem; color: var(--on-surface-variant, #4a5568); }
.header-date { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8125rem; color: var(--on-surface-variant, #4a5568); }
.header-date svg { width: 15px; height: 15px; }

/* ── Footer ──────────────────────────────────────── */
.app-footer {
  text-align: center; padding: 0.875rem;
  font-size: 0.75rem; color: var(--on-surface-variant, #4a5568);
  border-top: 1px solid rgba(199,196,216,0.2);
  background: var(--surface-lowest, #fff);
}
.app-footer strong { color: var(--primary, #3525cd); font-weight: 600; }

/* ── Responsive sidebar ──────────────────────────── */
@media (max-width: 900px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .menu-toggle { display: flex !important; }
  .main-content { margin-left: 0 !important; }
}
`;

function injectSharedCSS() {
  const style = document.createElement('style');
  style.textContent = SHARED_CSS;
  document.head.appendChild(style);
}
