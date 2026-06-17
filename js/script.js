console.log('=== SCRIPT STARTED ===');

// === КОРЗИНА ===
let cart = JSON.parse(localStorage.getItem('ghb_cart')) || [];

function saveCart() {
  localStorage.setItem('ghb_cart', JSON.stringify(cart));
  updateCartCounter();
}

function updateCartCounter() {
  const countEl = document.querySelector('.header__cart-count');
  if (countEl) {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = total;
  }
}

// Добавление товара (через data-атрибуты кнопки)
window.addToCartFromBtn = function (btn) {
  const id = btn.getAttribute('data-id');
  const title = btn.getAttribute('data-title');
  const price = parseInt(btn.getAttribute('data-price'));
  const img = btn.getAttribute('data-img');

  if (!id || !title || !price) {
    alert('Ошибка: нет данных о товаре в кнопке (проверьте HTML)');
    return;
  }

  const existing = cart.find(item => item.id == id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, title, price, img, qty: 1 });
  }

  saveCart();

  // Визуальный эффект
  const originalText = btn.innerText;
  btn.innerText = "✓ В корзине";
  btn.style.background = "#43A047";
  btn.style.color = "#fff";
  setTimeout(() => {
    btn.innerText = originalText;
    btn.style.background = "";
    btn.style.color = "";
  }, 1500);
};

// Изменение количества в корзине
window.changeQty = function (index, delta) {
  if (cart[index]) {
    cart[index].qty += delta;
    if (cart[index].qty < 1) cart[index].qty = 1;
    saveCart();
    renderCartPage();
  }
};

// Удаление из корзины
window.removeCartItem = function (index) {
  if (confirm("Удалить товар?")) {
    cart.splice(index, 1);
    saveCart();
    renderCartPage();
  }
};

// Очистка корзины
window.clearCartGlobal = function () {
  if (confirm("Очистить корзину?")) {
    cart = [];
    saveCart();
    renderCartPage();
  }
};

// Оформление заказа
window.checkoutOrder = function () {
  if (cart.length === 0) return;

  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toLocaleDateString(),
    total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    items: [...cart],
    status: 'Новый'
  };

  let orders = JSON.parse(localStorage.getItem('ghb_orders')) || [];
  orders.unshift(order);
  localStorage.setItem('ghb_orders', JSON.stringify(orders));

  cart = [];
  saveCart();
  renderCartPage();

  // Показываем модальное окно
  const modal = document.getElementById('order-success-modal');
  if (modal) modal.style.display = 'flex';
  else alert('Заказ оформлен!');
};

window.closeModal = function (id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
};

// Рендер страницы корзины
function renderCartPage() {
  const container = document.getElementById('cart-container');
  if (!container) return; // Мы не на странице корзины

  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px;"><h3>Корзина пуста</h3><a href="catalog.html" class="btn">В каталог</a></div>';
    const summary = document.getElementById('cart-summary');
    if (summary) summary.style.display = 'none';
    return;
  }

  const summary = document.getElementById('cart-summary');
  if (summary) summary.style.display = 'block';

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.style.cssText = "display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding:15px 0; flex-wrap:wrap; gap:10px;";
    div.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px;">
                <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; background:#f5f5f5;" onerror="this.src='https://via.placeholder.com/60'">
                <div>
                    <b>${item.title}</b><br>
                    <small>${item.price} ₽ x ${item.qty}</small>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <button onclick="changeQty(${index}, -1)" style="padding:5px 10px;">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${index}, 1)" style="padding:5px 10px;">+</button>
                <button onclick="removeCartItem(${index})" style="color:red; margin-left:10px;">✕</button>
            </div>
        `;
    container.appendChild(div);
  });

  const totalEl = document.getElementById('cart-total-price');
  if (totalEl) totalEl.innerText = total + ' ₽';
}

// Рендер истории заказов
function renderOrdersHistory() {
  const container = document.getElementById('orders-list');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('ghb_orders')) || [];
  if (orders.length === 0) {
    container.innerHTML = '<p style="color:#888;">У вас пока нет заказов.</p>';
    return;
  }

  let html = '<table class="table"><thead><tr><th>№</th><th>Дата</th><th>Сумма</th><th>Статус</th></tr></thead><tbody>';
  orders.forEach(o => {
    html += `<tr>
            <td>${o.id}</td>
            <td>${o.date}</td>
            <td>${o.total} ₽</td>
            <td><span style="background:#e0f2f1; color:#00695c; padding:4px 8px; border-radius:4px; font-size:12px;">${o.status}</span></td>
        </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}


// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Loaded');

  // 1. Счетчик корзины
  updateCartCounter();

  // 2. Если мы на странице корзины
  if (document.getElementById('cart-container')) {
    renderCartPage();
  }

  // 3. Если мы в личном кабинете
  if (document.getElementById('orders-list')) {
    renderOrdersHistory();

    // Логика переключения вкладок (Табы)
    document.querySelectorAll('.panel-menu li[data-tab]').forEach(tab => {
      tab.addEventListener('click', function () {
        // Убираем активный класс у всех пунктов меню
        document.querySelectorAll('.panel-menu li').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Скрываем все блоки контента
        document.querySelectorAll('.panel-tab').forEach(content => content.style.display = 'none');

        // Показываем нужный блок по ID
        const targetId = this.getAttribute('data-tab');
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.style.display = 'block';
      });
    });
  }

  // 4. Фильтры и сортировка (если мы в каталоге)
  const applyFiltersBtn = document.getElementById('apply-filters');
  const grid = document.getElementById('products-grid');

  if (applyFiltersBtn && grid) {
    // Кнопка "Применить фильтры"
    applyFiltersBtn.addEventListener('click', () => {
      const products = document.querySelectorAll('.product-card');
      let visibleCount = 0;

      // Получаем выбранные категории
      const checkedCats = Array.from(document.querySelectorAll('.filter-checkbox input:checked')).map(cb => cb.value);

      // Цена
      const minPrice = parseInt(document.querySelector('[data-filter="price-min"]')?.value) || 0;
      const maxPrice = parseInt(document.querySelector('[data-filter="price-max"]')?.value) || 999999;

      products.forEach(card => {
        const cat = card.dataset.category;
        const priceText = card.querySelector('.product-card__price')?.innerText || '0';
        const price = parseInt(priceText.replace(/\D/g, ''));

        const catMatch = checkedCats.includes('all') || checkedCats.includes(cat);
        const priceMatch = price >= minPrice && price <= maxPrice;

        if (catMatch && priceMatch) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const countEl = document.getElementById('products-count');
      if (countEl) countEl.innerText = visibleCount;
    });

    // Сортировка
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        const cards = Array.from(grid.children);
        cards.sort((a, b) => {
          const pA = parseInt(a.querySelector('.product-card__price').innerText.replace(/\D/g, ''));
          const pB = parseInt(b.querySelector('.product-card__price').innerText.replace(/\D/g, ''));

          if (this.value === 'price-asc') return pA - pB;
          if (this.value === 'price-desc') return pB - pA;
          return 0;
        });
        cards.forEach(c => grid.appendChild(c));
      });
    }
  }

  // 5. Кнопки "Добавить в корзину" (везде)
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.addToCartFromBtn(btn);
    });
  });

  // 6. Тема
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-theme');
      themeBtn.innerText = '☀️';
    }
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      themeBtn.innerText = isDark ? '☀️' : '';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // 7. Мобильное меню
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '72px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = '#fff';
      nav.style.padding = '20px';
      nav.style.zIndex = '100';
    });
  }
});