// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== Navbar Scroll Effect =====
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');

  window.addEventListener('scroll', () => {
    // Toggle scrolled class
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ===== Mobile Nav Toggle =====
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  // ===== Scroll Reveal Animations =====
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== Staggered reveal for grid children =====
  const staggerContainers = document.querySelectorAll('[data-stagger]');

  staggerContainers.forEach(container => {
    const children = container.children;
    Array.from(children).forEach((child, index) => {
      child.style.transitionDelay = `${index * 0.1}s`;
    });
  });

  // ===== Counter Animation =====
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.getAttribute('data-count');
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        animateCounter(el, 0, parseInt(target), 1800, prefix, suffix);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, start, end, duration, prefix, suffix) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // ===== Theme Toggle Logic =====
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Check for saved theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      
      if (body.classList.contains('light-mode')) {
        localStorage.setItem('portfolio-theme', 'light');
      } else {
        localStorage.setItem('portfolio-theme', 'dark');
      }
    });
  }

  // ===== Dashboard Carousels (Supports Multiple & Touch Swipe) =====
const carousels = document.querySelectorAll('.dashboard-carousel');

carousels.forEach(carousel => {
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const prevBtn = carousel.querySelector('.carousel-arrow--prev');
  const nextBtn = carousel.querySelector('.carousel-arrow--next');
  const viewport = carousel.querySelector('.carousel-viewport');

  if (!slides.length) return;
  let currentSlide = 0;

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');

    currentSlide = index;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      goToSlide(currentSlide - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      goToSlide(currentSlide + 1);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const index = parseInt(dot.getAttribute('data-dot'), 10);
      if (!Number.isNaN(index)) {
        goToSlide(index);
      }
    });
  });

  // إضافة دعم التاتش (Swipe) للكاروسيل
  if (viewport) {
    let touchStartX = 0;
    let touchEndX = 0;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      const minSwipeDistance = 50;
      const isRTL = carousel.closest('[dir="rtl"]') !== null;

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance < 0) {
          isRTL ? (prevBtn && prevBtn.click()) : (nextBtn && nextBtn.click());
        } else {
          isRTL ? (nextBtn && nextBtn.click()) : (prevBtn && prevBtn.click());
        }
      }
    }, { passive: true });
  }

  goToSlide(0);
});

// ===== Swipe Carousels =====
const swipeCarousels = document.querySelectorAll('.swipe-carousel');

swipeCarousels.forEach(carousel => {
  const slides = carousel.querySelectorAll('.swipe-slide');
  const dots = carousel.querySelectorAll('.swipe-dot');
  const prevBtn = carousel.querySelector('.swipe-arrow--prev');
  const nextBtn = carousel.querySelector('.swipe-arrow--next');
  const track = carousel.querySelector('.swipe-carousel-track');
  
  if (!slides.length || !track) return;
  
  const isRTL = getComputedStyle(carousel).direction === 'rtl' || document.documentElement.dir === 'rtl';
  let currentSlide = 0;

  function getTrackOffset(index) {
    return isRTL ? index * 100 : -index * 100;
  }

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');

    track.style.transform = `translateX(${getTrackOffset(index)}%)`;

    currentSlide = index;
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-dot'), 10);
      if (!Number.isNaN(index)) {
        goToSlide(index);
      }
    });
  });

  goToSlide(0);
});

// ===== Lightbox (Fixed Mobile Scroll Jump) =====
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" id="lightboxClose" aria-label="Close Lightbox">&times;</button>
  <button class="lightbox-arrow lightbox-arrow--prev" id="lightboxPrev" aria-label="Previous image">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
  <button class="lightbox-arrow lightbox-arrow--next" id="lightboxNext" aria-label="Next image">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
  <div class="lightbox-content" id="lightboxContent"></div>
`;
document.body.appendChild(lightbox);

const lightboxContent = lightbox.querySelector('#lightboxContent');
const lightboxClose = lightbox.querySelector('#lightboxClose');
const lightboxPrev = lightbox.querySelector('#lightboxPrev');
const lightboxNext = lightbox.querySelector('#lightboxNext');

let currentLightboxGroup = [];
let currentLightboxIndex = 0;
let lastScrollPosition = 0; // متغير لحفظ موقع الصفحة بدقة

function renderLightboxImage() {
  lightboxContent.innerHTML = '';
  const element = currentLightboxGroup[currentLightboxIndex];
  if (!element) return;

  if (element.tagName.toLowerCase() === 'img') {
    const img = document.createElement('img');
    img.src = element.src;
    img.alt = element.alt || '';
    img.className = 'lightbox-img';
    lightboxContent.appendChild(img);
  } else {
    const clone = element.cloneNode(true);
    clone.className = 'lightbox-placeholder';
    lightboxContent.appendChild(clone);
  }

  if (currentLightboxGroup.length <= 1) {
    lightboxPrev.style.display = 'none';
    lightboxNext.style.display = 'none';
  } else {
    lightboxPrev.style.display = 'flex';
    lightboxNext.style.display = 'flex';
  }
}

function handleLightboxKeydown(e) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();
  }
  
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowRight') nextLightboxImage();
  else if (e.key === 'ArrowLeft') prevLightboxImage();
}

function openLightbox(element) {
  lastScrollPosition = window.scrollY;
  
  const swipeCarousel = element.closest('.swipe-carousel');
  const dashboardCarousel = element.closest('.dashboard-carousel');
  
  if (swipeCarousel) {
    currentLightboxGroup = Array.from(swipeCarousel.querySelectorAll('.swipe-slide img'));
  } else if (dashboardCarousel) {
    currentLightboxGroup = Array.from(dashboardCarousel.querySelectorAll('.carousel-slide img, .carousel-placeholder'));
  } else {
    currentLightboxGroup = [element];
  }
  
  currentLightboxIndex = currentLightboxGroup.indexOf(element);
  if (currentLightboxIndex === -1) currentLightboxIndex = 0;

  renderLightboxImage();
  lightbox.classList.add('active');
  
  document.body.style.top = `-${lastScrollPosition}px`;
  document.body.classList.add('lightbox-open'); 
  
  lightbox.setAttribute('tabindex', '-1');
  lightbox.style.outline = 'none';
  lightbox.focus();
  
  document.addEventListener('keydown', handleLightboxKeydown);

  // 👇 👇 الحل المضمون: ربط التاتش بمنطقة محتوى الصور مباشرة 👇 👇
  const contentArea = lightbox.querySelector('#lightboxContent');
  if (contentArea) {
    let lightboxTouchStartX = 0;
    let lightboxTouchEndX = 0;

    // تنظيف الأحداث القديمة لمنع التكرار
    contentArea.ontouchstart = null;
    contentArea.ontouchend = null;

    contentArea.addEventListener('touchstart', (e) => {
      // تسجيل أول نقطة لمس بصباع واحد
      lightboxTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    contentArea.addEventListener('touchend', (e) => {
      // تسجيل نقطة رفع الصباع
      lightboxTouchEndX = e.changedTouches[0].clientX;
      
      const swipeDistance = lightboxTouchEndX - lightboxTouchStartX;
      const minSwipeDistance = 40; // تقليل المسافة شوية عشان الموبايل يلقط السحبة أسرع

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance < 0) {
          // سحب لليسار (شمال) -> يجيب الصورة التالية
          nextLightboxImage();
        } else {
          // سحب لليمين (يمين) -> يرجع للصورة السابقة
          prevLightboxImage();
        }
      }
    }, { passive: true });
  }
}

function closeLightbox() {
  lightbox.classList.remove('active');
  
  // إعادة الوضع لطبيعته وإجبار المتصفح للعودة لنفس النقطة بالملي
  document.body.classList.remove('lightbox-open');
  document.body.style.top = '';
  window.scrollTo(0, lastScrollPosition); 
  
  currentLightboxGroup = [];
  document.removeEventListener('keydown', handleLightboxKeydown);
}

function nextLightboxImage() {
  if (currentLightboxGroup.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxGroup.length;
  renderLightboxImage();
}

function prevLightboxImage() {
  if (currentLightboxGroup.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxGroup.length) % currentLightboxGroup.length;
  renderLightboxImage();
}

lightboxClose.addEventListener('click', (e) => { e.preventDefault(); closeLightbox(); });
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevLightboxImage(); });
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextLightboxImage(); });

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

  // ===== Global Lightbox Fix Using Event Delegation =====
  document.addEventListener('click', e => {
    const target = e.target.closest('.carousel-slide img, .hero-image, .carousel-placeholder');
    if (target) {
      e.preventDefault();
      openLightbox(target);
    }
  });

  let touchStartY = 0;
  let touchEndY = 0;
  
  lightbox.addEventListener('touchstart', e => {
    touchStartY = e.changedTouches[0].screenY;
  }, {passive: true});
  
  lightbox.addEventListener('touchend', e => {
    touchEndY = e.changedTouches[0].screenY;
    if (Math.abs(touchEndY - touchStartY) > 50) closeLightbox();
  }, {passive: true});

});

// ===== Copy Text to Clipboard =====
window.copyContactText = function(event, text, tooltipId) {
  event.preventDefault();
  event.stopPropagation();
  
  navigator.clipboard.writeText(text).then(() => {
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
      const originalText = tooltip.textContent;
      tooltip.textContent = 'Copied!';
      tooltip.style.color = '#fff';
      setTimeout(() => {
        tooltip.textContent = originalText;
        tooltip.style.color = '';
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};



