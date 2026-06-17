document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    if (themeToggle) themeToggle.textContent = '☀️';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-theme');
      const isDark = body.classList.contains('dark-theme');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.style.display === 'flex';
      nav.style.display = isOpen ? 'none' : 'flex';
      nav.style.position = isOpen ? '' : 'absolute';
      nav.style.top = isOpen ? '' : '100%';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = body.classList.contains('dark-theme')
        ? 'var(--dt-bg, #1F1F2E)'
        : 'white';
      nav.style.flexDirection = 'column';
      nav.style.padding = '20px';
      nav.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
      nav.style.zIndex = '99';
      burger.classList.toggle('active', !isOpen);
    });

    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.style.display = 'none';
        burger.classList.remove('active');
      });
    });
  }

  const cartCountEl = document.querySelector('.header__cart-count');
  const addToCartBtns = document.querySelectorAll('.add-to-cart, .btn-add-cart');
  let cartCount = parseInt(localStorage.getItem('cartCount') || '0');

  if (cartCountEl) cartCountEl.textContent = cartCount;

  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      cartCount++;
      localStorage.setItem('cartCount', cartCount);

      if (cartCountEl) {
        cartCountEl.textContent = cartCount;
        cartCountEl.style.transform = 'scale(1.3)';
        setTimeout(() => cartCountEl.style.transform = 'scale(1)', 200);
      }

      const originalText = this.textContent;
      const originalBg = this.style.background;
      this.textContent = '✓ Добавлено';
      this.style.background = '#43A047';
      this.style.color = 'white';

      setTimeout(() => {
        this.textContent = originalText;
        this.style.background = originalBg;
        this.style.color = '';
      }, 1500);
    });
  });

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showError = (input, show) => {
    if (!input) return;
    const errorEl = input.parentElement?.querySelector('.form__error');
    if (errorEl) errorEl.style.display = show ? 'block' : 'none';
    input.classList.toggle('invalid', show);
  };

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      let isValid = true;

      if (loginEmail && !validateEmail(loginEmail.value)) {
        showError(loginEmail, true);
        isValid = false;
      } else if (loginEmail) {
        showError(loginEmail, false);
      }

      if (loginPassword && loginPassword.value.length < 6) {
        showError(loginPassword, true);
        isValid = false;
      } else if (loginPassword) {
        showError(loginPassword, false);
      }

      if (isValid) {
        alert('Успешный вход! (Демо-режим)');
        window.location.href = 'personal.html';
      }
    });

    loginEmail?.addEventListener('input', () => showError(loginEmail, false));
    loginPassword?.addEventListener('input', () => showError(loginPassword, false));
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    const regName = document.getElementById('reg-name');
    const regEmail = document.getElementById('reg-email');
    const regPhone = document.getElementById('reg-phone');
    const regPass = document.getElementById('reg-pass');
    const regPassConfirm = document.getElementById('reg-pass-confirm');

    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      let isValid = true;

      if (regName && regName.value.trim().length < 2) {
        showError(regName, true);
        isValid = false;
      } else if (regName) {
        showError(regName, false);
      }

      if (regEmail && !validateEmail(regEmail.value)) {
        showError(regEmail, true);
        isValid = false;
      } else if (regEmail) {
        showError(regEmail, false);
      }

      if (regPhone && regPhone.value && regPhone.value.replace(/\D/g, '').length < 10) {
        showError(regPhone, true);
        isValid = false;
      } else if (regPhone) {
        showError(regPhone, false);
      }

      if (regPass && regPass.value.length < 6) {
        showError(regPass, true);
        isValid = false;
      } else if (regPass) {
        showError(regPass, false);
      }

      if (regPassConfirm && regPass && regPassConfirm.value !== regPass.value) {
        showError(regPassConfirm, true);
        isValid = false;
      } else if (regPassConfirm) {
        showError(regPassConfirm, false);
      }

      if (isValid) {
        alert('Регистрация успешна! (Демо-режим)');
        window.location.href = 'login.html';
      }
    });

    [regName, regEmail, regPhone, regPass, regPassConfirm].forEach(inp => {
      inp?.addEventListener('input', () => showError(inp, false));
    });
  }

  const panelMenuItems = document.querySelectorAll('.panel-menu li[data-tab]');
  const panelTabs = document.querySelectorAll('.panel-tab');

  panelMenuItems.forEach(item => {
    item.addEventListener('click', function () {
      panelMenuItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      const targetId = this.dataset.tab;
      panelTabs.forEach(tab => {
        tab.style.display = tab.id === targetId ? 'block' : 'none';
      });
    });
  });

  const applyFiltersBtn = document.getElementById('apply-filters');
  const productsGrid = document.getElementById('products-grid');
  const sortSelect = document.getElementById('sort-select');
  const productsCountEl = document.getElementById('products-count');

  if (applyFiltersBtn && productsGrid) {
    applyFiltersBtn.addEventListener('click', () => {
      const checkedCategories = Array.from(
        document.querySelectorAll('.filter-checkbox input:checked')
      ).map(cb => cb.value);

      const priceMinInput = document.querySelector('[data-filter="price-min"]');
      const priceMaxInput = document.querySelector('[data-filter="price-max"]');
      const minPrice = priceMinInput ? parseInt(priceMinInput.value) || 0 : 0;
      const maxPrice = priceMaxInput ? parseInt(priceMaxInput.value) || Infinity : Infinity;

      let visibleCount = 0;

      document.querySelectorAll('.product-card').forEach(card => {
        const category = card.dataset.category;
        const price = parseInt(card.dataset.price) || 0;
        const categoryMatch = checkedCategories.includes('all') || checkedCategories.includes(category);
        const priceMatch = price >= minPrice && price <= maxPrice;

        if (categoryMatch && priceMatch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (productsCountEl) productsCountEl.textContent = visibleCount;
    });
  }

  if (sortSelect && productsGrid) {
    sortSelect.addEventListener('change', function () {
      const cards = Array.from(productsGrid.querySelectorAll('.product-card'));
      cards.sort((a, b) => {
        const priceA = parseInt(a.dataset.price) || 0;
        const priceB = parseInt(b.dataset.price) || 0;
        const nameA = a.querySelector('.product-card__title')?.textContent || '';
        const nameB = b.querySelector('.product-card__title')?.textContent || '';

        switch (this.value) {
          case 'price-asc': return priceA - priceB;
          case 'price-desc': return priceB - priceA;
          case 'name': return nameA.localeCompare(nameB);
          default: return 0;
        }
      });
      cards.forEach(card => productsGrid.appendChild(card));
    });
  }

  const openModalBtn = document.getElementById('open-add-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const modalOverlay = document.getElementById('add-product-modal');
  const addProductForm = document.getElementById('add-product-form');
  const adminTableBody = document.getElementById('admin-products');

  if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
    closeModalBtn?.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  if (addProductForm && adminTableBody) {
    addProductForm.addEventListener('submit', e => {
      e.preventDefault();
      const inputs = addProductForm.querySelectorAll('input, select');
      const name = inputs[0]?.value || '';
      const price = inputs[1]?.value || '0';
      const category = inputs[2]?.value || '';

      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${Math.floor(Math.random() * 900) + 100}</td>
        <td>${name}</td>
        <td>${price} ₽</td>
        <td>${category}</td>
        <td>
          <button class="btn btn--sm btn--outline" style="margin-right:8px">✎</button>
          <button class="btn btn--sm delete-product" style="background:var(--color-text);color:#fff">🗑</button>
        </td>
      `;

      adminTableBody.insertBefore(newRow, adminTableBody.firstChild);

      newRow.querySelector('.delete-product')?.addEventListener('click', function () {
        if (confirm('Удалить товар?')) this.closest('tr')?.remove();
      });

      modalOverlay.classList.remove('active');
      addProductForm.reset();
    });
  }

  document.querySelectorAll('.table .btn--sm').forEach(btn => {
    if (btn.textContent.includes('🗑')) {
      btn.addEventListener('click', function () {
        if (confirm('Удалить этот товар?')) this.closest('tr')?.remove();
      });
    }
  });

  const reviewsTrack = document.querySelector('.reviews-track');
  const reviewsPrev = document.querySelector('.reviews-prev');
  const reviewsNext = document.querySelector('.reviews-next');
  const reviewsDots = document.querySelectorAll('.reviews-dot');

  if (reviewsTrack && reviewsPrev && reviewsNext && reviewsDots.length > 0) {
    let currentReview = 0;
    const totalReviews = document.querySelectorAll('.review-card').length;
    let autoplayInterval;

    const updateReviews = () => {
      reviewsTrack.style.transform = `translateX(-${currentReview * 100}%)`;
      reviewsDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentReview);
      });
    };

    const nextReview = () => {
      currentReview = (currentReview + 1) % totalReviews;
      updateReviews();
    };

    const startAutoplay = () => {
      autoplayInterval = setInterval(nextReview, 6000);
    };

    const stopAutoplay = () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
    };

    reviewsPrev.addEventListener('click', () => {
      currentReview = currentReview === 0 ? totalReviews - 1 : currentReview - 1;
      updateReviews();
      stopAutoplay();
      startAutoplay();
    });

    reviewsNext.addEventListener('click', () => {
      nextReview();
      stopAutoplay();
      startAutoplay();
    });

    reviewsDots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentReview = parseInt(dot.dataset.index);
        updateReviews();
        stopAutoplay();
        startAutoplay();
      });
    });

    const reviewsSlider = document.querySelector('.reviews-slider');
    reviewsSlider?.addEventListener('mouseenter', stopAutoplay);
    reviewsSlider?.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  const heroSlides = document.querySelectorAll('.hero__slide');
  if (heroSlides.length > 1) {
    let currentHeroSlide = 0;
    setInterval(() => {
      heroSlides[currentHeroSlide].classList.remove('active');
      currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
      heroSlides[currentHeroSlide].classList.add('active');
    }, 5000);
  }

  const fadeElements = document.querySelectorAll('.fade-in');
  const checkFadeElements = () => {
    const triggerBottom = window.innerHeight * 0.85;
    fadeElements.forEach(el => {
      if (el.getBoundingClientRect().top < triggerBottom) {
        el.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', checkFadeElements);
  checkFadeElements();

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  const searchBtn = document.querySelector('.header__btn[title="Поиск"]');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const searchTerm = prompt('Введите название товара для поиска:');
      if (searchTerm) {
        alert(`Поиск: "${searchTerm}"\n(В полной версии здесь будет поиск по каталогу)`);
        window.location.href = `catalog.html?search=${encodeURIComponent(searchTerm)}`;
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('cat');

  if (categoryParam && productsGrid && applyFiltersBtn) {
    document.querySelectorAll('.filter-checkbox input').forEach(cb => {
      cb.checked = cb.value === categoryParam || cb.value === 'all';
    });
    applyFiltersBtn.click();
  }
});