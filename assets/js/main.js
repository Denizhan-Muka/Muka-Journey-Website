/**
 * MUKA JOURNEY — INTERACTIVE ENGINE
 * Sticky Header, IntersectionObserver Reveals, Experience Accordions,
 * Upcoming Events Engine, Bespoke Form Handler & Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSectionOrder();
  initNavigation();
  initActiveNavigation();
  initScrollReveals();
  initPillarsInteraction();
  initExperienceAccordions();
  initUpcomingEvents();
  initContactForm();
  initNotificationModal();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   0. PAGE SECTION ORDER
   Keeps the page flow aligned with the primary navigation: Experiences first,
   followed by Art · Gastronomy · Design.
   -------------------------------------------------------------------------- */
function initSectionOrder() {
  const heroSection = document.getElementById('hero');
  const aboutSection = document.getElementById('hakkinda');
  const experiencesSection = document.getElementById('deneyimler');
  const pillarsSection = document.getElementById('sanat-gastronomi');
  const upcomingSection = document.getElementById('yaklasanlar');
  const main = document.querySelector('main');

  if (heroSection && aboutSection && heroSection.nextElementSibling !== aboutSection) {
    heroSection.parentNode.insertBefore(aboutSection, heroSection.nextElementSibling);
  }

  if (experiencesSection && pillarsSection && experiencesSection.nextElementSibling !== pillarsSection) {
    pillarsSection.parentNode.insertBefore(experiencesSection, pillarsSection);
  }

  if (main && upcomingSection && main.lastElementChild !== upcomingSection) {
    main.appendChild(upcomingSection);
  }
}

/* --------------------------------------------------------------------------
   1. ACTIVE NAVIGATION STATE
   -------------------------------------------------------------------------- */
function initActiveNavigation() {
  const navLinks = [...document.querySelectorAll('.nav-menu .nav-link')];
  const targets = navLinks
    .map(link => link.getAttribute('href'))
    .filter(href => href?.startsWith('#'))
    .map(href => document.querySelector(href))
    .filter(Boolean);

  if (!navLinks.length || !targets.length || !('IntersectionObserver' in window)) return;

  const setActiveLink = id => {
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveLink(visible.target.id);
  }, { rootMargin: '-24% 0px -62% 0px', threshold: [0, 0.1, 0.25] });

  targets.forEach(target => observer.observe(target));
}

/* --------------------------------------------------------------------------
   1. NAVIGATION & STICKY HEADER
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const closeDrawer = () => {
    drawer?.classList.remove('is-open');
    toggleBtn?.classList.remove('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn?.focus({ preventScroll: true });
  };

  // Sticky header transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        drawer.classList.add('is-open');
        toggleBtn.classList.add('is-active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    closeBtn?.addEventListener('click', closeDrawer);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }
}

/* --------------------------------------------------------------------------
   2. SCROLL REVEALS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   3. PILLARS (SANAT · GASTRONOMİ · TASARIM) INTERACTION
   -------------------------------------------------------------------------- */
function initPillarsInteraction() {
  const pillarItems = document.querySelectorAll('.pillar-item');
  if (!pillarItems.length) return;

  pillarItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      pillarItems.forEach(p => p.classList.remove('is-active'));
      item.classList.add('is-active');
    });
  });

  // Activate first on mobile / view
  const pillarsSection = document.querySelector('.pillars-section');
  if (pillarsSection) {
    const pObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        pillarItems[0]?.classList.add('is-active');
      }
    }, { threshold: 0.3 });
    pObs.observe(pillarsSection);
  }
}

/* --------------------------------------------------------------------------
   4. EXPERIENCES ACCORDION (TÜMÜNÜ GÖR / DAHA AZ GÖSTER)
   -------------------------------------------------------------------------- */
function initExperienceAccordions() {
  const toggleBtns = document.querySelectorAll('.exp-toggle-btn');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.exp-card');
      const expandedList = card.querySelector('.exp-expanded-list');
      const isExpanded = expandedList.classList.contains('is-expanded');

      if (isExpanded) {
        expandedList.classList.remove('is-expanded');
        btn.innerHTML = 'Tümünü Gör <span class="arrow">↓</span>';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        expandedList.classList.add('is-expanded');
        btn.innerHTML = 'Daha Az Göster <span class="arrow">↑</span>';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. UPCOMING EVENTS DYNAMIC ENGINE
   -------------------------------------------------------------------------- */
// The data structure requested in the guide:
// When empty, renders the authentic Empty State.
// When events are added, dynamically renders the upcoming event cards!
const upcomingEvents = [
  /*
  Example future event entry:
  {
    title: "Şef Masası: Balkan & Akdeniz Lezzet Yolculuğu",
    category: "Gastronomi & Tadım",
    date: "14 Eylül 2026, 19:30",
    location: "Beyoğlu, İstanbul",
    description: "Özel seçilmiş menü eşliğinde samimi bir sofra ve lezzet anlatısı."
  }
  */
];

function initUpcomingEvents() {
  const container = document.getElementById('upcoming-events-container');
  if (!container) return;

  if (upcomingEvents.length === 0) {
    // Empty state as defined in specification
    container.innerHTML = `
      <div class="empty-state-box reveal">
        <div class="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <h3 class="empty-state-title">Yeni deneyimler hazırlanıyor.</h3>
        <p class="empty-state-text">Muka'nın sıradaki buluşmaları çok yakında burada paylaşılacaktır. İlk haberdar olanlardan olmak için kaydolun.</p>
        <button class="btn btn-primary open-modal-btn" type="button">
          Haberdar Ol <span class="arrow">→</span>
        </button>
      </div>
    `;
  } else {
    // Dynamic cards when events are announced
    let cardsHtml = '<div class="events-dynamic-grid">';
    upcomingEvents.forEach(evt => {
      cardsHtml += `
        <div class="event-live-card reveal">
          <div>
            <div class="event-live-date">${evt.date} · ${evt.category}</div>
            <h3 class="exp-card-title" style="margin-top: 0.5rem;">${evt.title}</h3>
            <p class="exp-card-desc">${evt.description}</p>
          </div>
          <a href="bilgi-al.html" class="btn btn-secondary" style="align-self: flex-start;">
            Rezervasyon Talebi <span class="arrow">→</span>
          </a>
        </div>
      `;
    });
    cardsHtml += '</div>';
    container.innerHTML = cardsHtml;
  }
}

/* --------------------------------------------------------------------------
   6. CONTACT & RESERVATION FORM HANDLER
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('reservation-form');
  const feedback = document.getElementById('form-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#form-name').value.trim();
    const email = form.querySelector('#form-email').value.trim();
    const experience = form.querySelector('#form-experience').value;
    const guests = form.querySelector('#form-guests').value.trim();
    const date = form.querySelector('#form-date').value.trim();
    const message = form.querySelector('#form-message').value.trim();

    if (!name || !email) {
      feedback.className = 'form-feedback is-error';
      feedback.textContent = window.mukaI18n?.t('Lütfen Ad Soyad ve E-posta alanlarını eksiksiz doldurun.') || 'Lütfen Ad Soyad ve E-posta alanlarını eksiksiz doldurun.';
      return;
    }

    const isEnglish = window.mukaI18n?.getLanguage() === 'en';
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    feedback.className = 'form-feedback is-loading';
    feedback.textContent = isEnglish ? 'Sending your request…' : 'Talebiniz gönderiliyor…';
    try {
      const response = await fetch('/api/inquiries', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,experience,guests,preferredDate:date,message,language:isEnglish?'en':'tr'})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'request_failed');
      feedback.className = 'form-feedback is-success';
      feedback.textContent = isEnglish ? `Thank you, ${name}. We received your request (${data.reference}) and will contact you soon.` : `Teşekkür ederiz ${name}. ${data.reference} numaralı talebinizi aldık; en kısa sürede sizinle iletişime geçeceğiz.`;
      form.reset();
    } catch {
      feedback.className = 'form-feedback is-error';
      feedback.textContent = isEnglish ? 'We could not save your request. Please try again or email info@mukajourney.com.' : 'Talebiniz kaydedilemedi. Lütfen yeniden deneyin veya info@mukajourney.com adresine yazın.';
    } finally { submit.disabled = false; }
  });
}

/* --------------------------------------------------------------------------
   7. NOTIFICATION MODAL (HABERDAR OL)
   -------------------------------------------------------------------------- */
function initNotificationModal() {
  const modal = document.getElementById('notification-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalForm = document.getElementById('modal-form');
  const modalFeedback = document.getElementById('modal-feedback');

  document.addEventListener('click', (e) => {
    if (e.target.closest('.open-modal-btn')) {
      e.preventDefault();
      modal?.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  });

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('is-active');
    document.body.style.overflow = '';
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  });

  modalForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = modalForm.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
      const isEnglish = window.mukaI18n?.getLanguage() === 'en';
      const submit = modalForm.querySelector('button[type="submit"]');
      submit.disabled = true;
      modalFeedback.style.display = 'block';
      modalFeedback.className = 'form-feedback is-loading';
      modalFeedback.textContent = isEnglish ? 'Saving your email…' : 'E-posta adresiniz kaydediliyor…';
      try {
        const response = await fetch('/api/subscribers', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:emailInput.value.trim(),language:isEnglish?'en':'tr'})});
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'request_failed');
        modalFeedback.className = 'form-feedback is-success';
        modalFeedback.textContent = data.alreadySubscribed ? (isEnglish ? 'This email is already on our list.' : 'Bu e-posta adresi zaten listemizde.') : (isEnglish ? 'Your email has been saved. You will be among the first to hear about new gatherings.' : 'E-posta adresiniz kaydedildi. Yeni buluşmalardan ilk siz haberdar olacaksınız.');
        modalForm.reset();
      } catch {
        modalFeedback.className = 'form-feedback is-error';
        modalFeedback.textContent = isEnglish ? 'We could not save your email. Please try again.' : 'E-posta adresiniz kaydedilemedi. Lütfen yeniden deneyin.';
      } finally { submit.disabled = false; }
    }
  });
}

/* --------------------------------------------------------------------------
   8. SMOOTH SCROLL FOR ANCHOR LINKS
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
