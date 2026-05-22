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

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      localStorage.setItem('portfolio-theme', 'dark');
    }
  });

  // ===== Dashboard Carousels =====
  const carousels = document.querySelectorAll('.dashboard-carousel');

  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const label = carousel.querySelector('.carousel-label');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-arrow--prev');
    const nextBtn = carousel.querySelector('.carousel-arrow--next');
    
    let slideLabels = [];
    if (label && label.hasAttribute('data-labels')) {
      try {
        slideLabels = JSON.parse(label.getAttribute('data-labels').replace(/'/g, '"'));
      } catch (e) {
        console.error('Error parsing carousel labels', e);
      }
    }

    let currentSlide = 0;

    function goToSlide(index) {
      if (!slides.length) return;
      
      // Wrap around infinitely
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      // Update slides
      slides.forEach(slide => slide.classList.remove('active'));
      slides[index].classList.add('active');

      // Update dots
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');

      // Fade label out, update text, fade back in
      if (label && slideLabels.length > index) {
        label.classList.add('fade');
        setTimeout(() => {
          label.textContent = slideLabels[index];
          label.classList.remove('fade');
        }, 200);
      }

      currentSlide = index;
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
      nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-dot')));
      });
    });
  });



  // ===== Lightbox =====
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

  function renderLightboxImage() {
    lightboxContent.innerHTML = '';
    const element = currentLightboxGroup[currentLightboxIndex];
    if (!element) return;

    if (element.tagName.toLowerCase() === 'img') {
      const img = document.createElement('img');
      img.src = element.src;
      img.className = 'lightbox-img';
      lightboxContent.appendChild(img);
    } else {
      const clone = element.cloneNode(true);
      clone.className = 'lightbox-placeholder';
      lightboxContent.appendChild(clone);
    }

    // Hide arrows if there's only 1 image in the group
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
    // Determine group
    const carousel = element.closest('.dashboard-carousel');
    if (carousel) {
      currentLightboxGroup = Array.from(carousel.querySelectorAll('.carousel-slide img, .carousel-placeholder'));
    } else {
      currentLightboxGroup = [element]; // standalone image like hero
    }
    
    currentLightboxIndex = currentLightboxGroup.indexOf(element);
    if (currentLightboxIndex === -1) currentLightboxIndex = 0;

    renderLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    lightbox.setAttribute('tabindex', '-1');
    lightbox.style.outline = 'none';
    lightbox.focus();
    
    document.addEventListener('keydown', handleLightboxKeydown);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.height = '';
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

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevLightboxImage(); });
  lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextLightboxImage(); });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxContent) closeLightbox();
  });

  const clickableElements = document.querySelectorAll('.carousel-slide img, .hero-image, .carousel-placeholder');
  clickableElements.forEach(el => {
    el.addEventListener('click', () => openLightbox(el));
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
