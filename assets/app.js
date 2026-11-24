/* Cleanroom & HVAC B2B Portal — Minimal Interactive Enhancements */
(() => {
  'use strict';

  /* 1. Copy Prompt to Clipboard with Visual SVG Feedback */
  const COPY_ICON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const CHECK_ICON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

  document.querySelectorAll('[data-copy-target]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      const text = codeEl.textContent.trim();
      let ok = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          ok = true;
        } catch (_) {
          ok = false;
        }
      }

      if (!ok) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          ok = document.execCommand('copy');
        } finally {
          document.body.removeChild(ta);
        }
      }

      if (ok) {
        btn.classList.add('copied');
        btn.innerHTML = CHECK_ICON + '<span>Đã sao chép</span>';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = COPY_ICON + '<span>Sao chép Prompt</span>';
        }, 2000);
      }
    });
  });

  /* 2. Quick View Filter Bar (All | Basic | Advanced | Prompt) */
  const filterButtons = document.querySelectorAll('[data-filter-view]');
  const filterPanels = document.querySelectorAll('[data-view-panel]');

  if (filterButtons.length && filterPanels.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-filter-view');
        filterButtons.forEach((b) => {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });

        filterPanels.forEach((panel) => {
          const panelType = panel.getAttribute('data-view-panel');
          const visible = mode === 'all' || panelType === mode;
          panel.classList.toggle('is-hidden', !visible);
        });
      });
    });
  }

  /* 3. Workflow Animation Pause/Play Toggle (Accessibility) */
  document.querySelectorAll('[data-toggle-motion]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.workflow-panel');
      if (!panel) return;
      const paused = panel.classList.toggle('motion-paused');
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      const label = btn.querySelector('[data-motion-label]');
      if (label) {
        label.textContent = paused ? 'Chạy lại hiệu ứng' : 'Tạm dừng hiệu ứng';
      }
    });
  });

  /* 4. Interactive Master Workflow Inspector on index.html */
  const masterNodes = document.querySelectorAll('[data-flow-node]');
  const inspector = document.getElementById('flow-inspector');

  if (masterNodes.length && inspector) {
    const elStep = inspector.querySelector('[data-ins-step]');
    const elTitle = inspector.querySelector('[data-ins-title]');
    const elInput = inspector.querySelector('[data-ins-input]');
    const elAction = inspector.querySelector('[data-ins-action]');
    const elOutput = inspector.querySelector('[data-ins-output]');
    const elLink = inspector.querySelector('[data-ins-link]');

    const activateNode = (node) => {
      masterNodes.forEach((n) => n.classList.remove('is-active'));
      node.classList.add('is-active');

      if (elStep) elStep.textContent = node.dataset.step || '';
      if (elTitle) elTitle.textContent = node.dataset.title || '';
      if (elInput) elInput.textContent = node.dataset.input || '';
      if (elAction) elAction.textContent = node.dataset.action || '';
      if (elOutput) elOutput.textContent = node.dataset.output || '';
      if (elLink) {
        const href = node.getAttribute('href') || '#';
        elLink.setAttribute('href', href);
        elLink.textContent = node.dataset.cta || 'Mở trang chi tiết';
      }
    };

    masterNodes.forEach((node) => {
      node.addEventListener('mouseenter', () => activateNode(node));
      node.addEventListener('focus', () => activateNode(node));
    });
  }
  /* 5. Auto-center active nav item on mobile horizontal nav */
  const activeNav = document.querySelector('.main-nav .nav-link[aria-current="page"]');
  if (activeNav && typeof activeNav.scrollIntoView === 'function') {
    activeNav.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
  }
})();
