/* ===================================================
   DRAG & RESIZE EDITOR — Visual layout adjuster
   Toggle with the floating "✦ LIVE EDIT MODE" button
   =================================================== */

(function () {
  let editModeOn = false;
  let activeEl = null;
  let startX, startY, startLeft, startTop;
  let isDragging = false;
  let panel;

  // ── Build the toggle button ──
  const btn = document.createElement('button');
  btn.id = 'drag-editor-toggle';
  btn.textContent = '✦ LIVE EDIT: OFF';
  Object.assign(btn.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    zIndex: '99999', background: '#FFD200', color: '#0B0B0B',
    border: 'none', borderRadius: '50px', padding: '12px 20px',
    fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)', letterSpacing: '1px',
    fontFamily: 'Outfit, sans-serif', transition: 'all 0.3s',
  });
  document.body.appendChild(btn);

  // ── Build the live CSS readout panel ──
  panel = document.createElement('div');
  panel.id = 'drag-editor-panel';
  Object.assign(panel.style, {
    position: 'fixed', bottom: '80px', right: '24px',
    zIndex: '99999', background: '#0B0B0B', color: '#FFD200',
    border: '1px solid rgba(255,210,0,0.3)', borderRadius: '16px',
    padding: '16px 20px', fontFamily: 'monospace', fontSize: '0.82rem',
    lineHeight: '1.8', display: 'none', minWidth: '260px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
  });
  panel.innerHTML = `
    <div style="color:#fff;font-weight:700;margin-bottom:8px;font-family:Outfit,sans-serif;">📐 Live CSS Values</div>
    <div id="drag-el-name" style="color:rgba(255,255,255,0.5);font-size:0.75rem;margin-bottom:6px;">← click an element to edit</div>
    
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px;">
      <div>top: <span id="val-top" style="color:#ff6b00">—</span></div>
      <div>left: <span id="val-left" style="color:#ff6b00">—</span></div>
      <div>width: <span id="val-width" style="color:#ff6b00">—</span></div>
      <div>height: <span id="val-height" style="color:#ff6b00">—</span></div>
    </div>
    <hr style="border-color:rgba(255,255,255,0.1);margin:8px 0"/>
    <div style="color:rgba(255,255,255,0.4);font-size:0.72rem;">Drag to move. Use bottom-right corner to resize.</div>
  `;
  document.body.appendChild(panel);

  // Inject CSS for resizing
  const style = document.createElement('style');
  style.textContent = `
    .live-edit-hover {
      outline: 2px dashed rgba(255,210,0,0.4) !important;
      cursor: grab !important;
    }
    .live-edit-active {
      outline: 2px solid #FF6B00 !important;
      resize: both !important;
      overflow: auto !important;
      cursor: grab !important;
    }
    .live-edit-active:active {
      cursor: grabbing !important;
    }
  `;
  document.head.appendChild(style);

  // ── Toggle Edit Mode ──
  btn.addEventListener('click', () => {
    editModeOn = !editModeOn;
    btn.textContent = editModeOn ? '✦ LIVE EDIT: ON (click to exit)' : '✦ LIVE EDIT: OFF';
    btn.style.background = editModeOn ? '#FF6B00' : '#FFD200';
    btn.style.color = editModeOn ? '#fff' : '#0B0B0B';
    panel.style.display = editModeOn ? 'block' : 'none';

    if (!editModeOn) {
      if (activeEl) {
        activeEl.classList.remove('live-edit-active');
        activeEl = null;
      }
      document.querySelectorAll('.live-edit-hover').forEach(el => el.classList.remove('live-edit-hover'));
    }
  });

  // ── Hover logic ──
  document.addEventListener('mouseover', (e) => {
    if (!editModeOn) return;
    if (e.target.closest('#drag-editor-panel') || e.target.closest('#drag-editor-toggle')) return;
    
    e.target.classList.add('live-edit-hover');
  });
  
  document.addEventListener('mouseout', (e) => {
    if (!editModeOn) return;
    e.target.classList.remove('live-edit-hover');
  });

  // ── Drag & Select Logic ──
  document.addEventListener('mousedown', (e) => {
    if (!editModeOn) return;
    if (e.target.closest('#drag-editor-panel') || e.target.closest('#drag-editor-toggle')) return;
    
    // Check if we are clicking on the native resize handle (bottom right corner)
    // If so, let the native resize take over, don't initiate drag
    const rect = e.target.getBoundingClientRect();
    const isBottomRightCorner = (e.clientX > rect.right - 20) && (e.clientY > rect.bottom - 20);
    
    if (activeEl && activeEl !== e.target) {
      activeEl.classList.remove('live-edit-active');
    }
    
    activeEl = e.target;
    activeEl.classList.add('live-edit-active');
    
    // Update panel name
    document.getElementById('drag-el-name').textContent =
      (activeEl.className.replace(/live-edit-hover|live-edit-active/g, '').trim().split(' ')[0]) || activeEl.tagName.toLowerCase();

    // Ensure position:relative so top/left work if dragging
    const computed = window.getComputedStyle(activeEl);
    if (computed.position === 'static') {
      activeEl.style.position = 'relative';
    }

    if (!isBottomRightCorner) {
      isDragging = true;
      e.preventDefault(); // Prevent text selection
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(activeEl.style.left) || 0;
      startTop  = parseInt(activeEl.style.top)  || 0;
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!editModeOn || !activeEl) return;

    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newLeft = startLeft + dx;
      const newTop  = startTop  + dy;

      activeEl.style.left = newLeft + 'px';
      activeEl.style.top  = newTop  + 'px';
    }

    // Always update values (catches both dragging and resizing)
    const computed = window.getComputedStyle(activeEl);
    document.getElementById('val-top').textContent = activeEl.style.top || '0px';
    document.getElementById('val-left').textContent = activeEl.style.left || '0px';
    document.getElementById('val-width').textContent = computed.width;
    document.getElementById('val-height').textContent = computed.height;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

})();
