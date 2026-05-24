/* ═══════════════════════════════════════
   IBNI — script.js
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL ──────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /* ── HAMBURGER MENU ─────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ── SCROLL REVEAL (Intersection Observer) ── */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          const idx = Array.from(siblings).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, idx * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
  }

  /* ── REGISTRATION MULTI-STEP FORM ───── */
  const registerGrid = document.getElementById('registerGrid');
  if (registerGrid) {
    const formData = {
      childName: '',
      age: null,
      interests: [],
      superpowers: [],
      parentName: '',
      phone: '',
      wilaya: ''
    };

    const cards = registerGrid.querySelectorAll('.step-card');

    function showStep(num) {
      cards.forEach(card => {
        card.classList.remove('active-step');
        if (parseInt(card.dataset.step) === num) {
          card.classList.add('active-step');
          if (num === 6) fireConfetti(card);
        }
      });
    }

    function restoreState() {
      const nameInput = document.getElementById('childName');
      if (nameInput && formData.childName) nameInput.value = formData.childName;

      document.querySelectorAll('.age-btn').forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.age) === formData.age);
      });

      document.querySelectorAll('#interestsGrid .selection-card').forEach(card => {
        card.classList.toggle('selected', formData.interests.includes(card.dataset.value));
      });

      document.querySelectorAll('#superpowersGrid .selection-card').forEach(card => {
        card.classList.toggle('selected', formData.superpowers.includes(card.dataset.value));
      });

      const pName = document.getElementById('regParentName');
      const pPhone = document.getElementById('regPhone');
      const pWilaya = document.getElementById('regWilaya');
      if (pName && formData.parentName) pName.value = formData.parentName;
      if (pPhone && formData.phone) pPhone.value = formData.phone;
      if (pWilaya && formData.wilaya) pWilaya.value = formData.wilaya;
    }

    function saveState() {
      const nameInput = document.getElementById('childName');
      if (nameInput) formData.childName = nameInput.value;

      const pName = document.getElementById('regParentName');
      const pPhone = document.getElementById('regPhone');
      const pWilaya = document.getElementById('regWilaya');
      if (pName) formData.parentName = pName.value;
      if (pPhone) formData.phone = pPhone.value;
      if (pWilaya) formData.wilaya = pWilaya.value;
    }

    function validateStep(num) {
      if (num === 2) {
        const nameInput = document.getElementById('childName');
        let valid = true;
        if (!nameInput.value.trim()) {
          nameInput.classList.add('error');
          valid = false;
          setTimeout(() => nameInput.classList.remove('error'), 600);
        }
        if (formData.age === null) {
          document.querySelectorAll('.age-btn').forEach(b => {
            b.style.borderColor = '#E74C3C';
            setTimeout(() => b.style.borderColor = '', 600);
          });
          valid = false;
        }
        return valid;
      }
      if (num === 5) {
        let valid = true;
        const pName = document.getElementById('regParentName');
        const pPhone = document.getElementById('regPhone');
        const pWilaya = document.getElementById('regWilaya');
        [pName, pPhone, pWilaya].forEach(el => {
          if (!el.value.trim()) {
            el.classList.add('error');
            valid = false;
            setTimeout(() => el.classList.remove('error'), 600);
          }
        });
        if (pPhone.value && !/^0[5-7][0-9]{8}$/.test(pPhone.value)) {
          pPhone.classList.add('error');
          valid = false;
          setTimeout(() => pPhone.classList.remove('error'), 600);
        }
        return valid;
      }
      return true;
    }

    /* Next / Prev buttons */
    registerGrid.addEventListener('click', (e) => {
      const nextBtn = e.target.closest('[data-next]');
      const prevBtn = e.target.closest('[data-prev]');

      if (nextBtn) {
        const currentStep = parseInt(nextBtn.closest('.step-card').dataset.step);
        saveState();
        if (!validateStep(currentStep)) return;
        showStep(parseInt(nextBtn.dataset.next));
        restoreState();
      }
      if (prevBtn) {
        saveState();
        showStep(parseInt(prevBtn.dataset.prev));
        restoreState();
      }
    });

    /* Age picker */
    const agePicker = document.getElementById('agePicker');
    if (agePicker) {
      agePicker.addEventListener('click', (e) => {
        const btn = e.target.closest('.age-btn');
        if (!btn) return;
        agePicker.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        formData.age = parseInt(btn.dataset.age);
      });
    }

    /* Interest cards (multi-select) */
    const interestsGrid = document.getElementById('interestsGrid');
    if (interestsGrid) {
      interestsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.selection-card');
        if (!card) return;
        card.classList.toggle('selected');
        const val = card.dataset.value;
        if (formData.interests.includes(val)) {
          formData.interests = formData.interests.filter(v => v !== val);
        } else {
          formData.interests.push(val);
        }
      });
    }

    /* Superpower cards (multi-select) */
    const superpowersGrid = document.getElementById('superpowersGrid');
    if (superpowersGrid) {
      superpowersGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.selection-card');
        if (!card) return;
        card.classList.toggle('selected');
        const val = card.dataset.value;
        if (formData.superpowers.includes(val)) {
          formData.superpowers = formData.superpowers.filter(v => v !== val);
        } else {
          formData.superpowers.push(val);
        }
      });
    }
  }

  /* ── CONFETTI ───────────────────────── */
  function fireConfetti(card) {
    const container = card.querySelector('#confettiContainer');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#F39C12', '#2ECC71', '#3498DB', '#E74C3C', '#8B5CF6'];
    for (let i = 0; i < 30; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      const color = colors[i % colors.length];
      const isCircle = i % 2 === 0;
      const size = isCircle ? 8 : 6;
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${isCircle ? '50%' : '0'};
        animation-delay: ${(Math.random() * 2.5).toFixed(2)}s;
        animation-duration: ${(2.5 + Math.random() * 1.5).toFixed(2)}s;
      `;
      container.appendChild(piece);
    }
  }

  /* ── CTA FORM (index page) ──────────── */
  const ctaForm = document.getElementById('ctaForm');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('parentName');
      const phone = document.getElementById('parentPhone');
      let valid = true;
      if (!name.value.trim()) {
        name.classList.add('error');
        valid = false;
        setTimeout(() => name.classList.remove('error'), 600);
      }
      if (phone.value && !/^0[5-7][0-9]{8}$/.test(phone.value)) {
        phone.classList.add('error');
        valid = false;
        setTimeout(() => phone.classList.remove('error'), 600);
      }
      if (valid) {
        alert('تم التسجيل بنجاح! سنتواصل معك قريباً');
        ctaForm.reset();
      }
    });
  }

});
