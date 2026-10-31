// ==========================================
// 1. MAHSULOTLAR MA'LUMOTLARI (DATA)
// ==========================================
const products = [
  {
    id: 1,
    title: "AirPods Max Wireless",
    price: 549,
    category: "audio",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    description: "Yuqori sifatli ovoz, faol shovqinni bekor qilish (ANC) va premium dizayn."
  },
  {
    id: 2,
    title: "Apple Watch Series 9",
    price: 399,
    category: "wearables",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
    description: "Sog'liqni kuzatish uchun aqlli funksiyalar va eng tezkor protsessor."
  },
  {
    id: 3,
    title: "MacBook Pro 16 M3",
    price: 2499,
    category: "electronics",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    description: "Professional foydalanuvchilar va dasturchilar uchun cheksiz unumdorlik."
  },
  {
    id: 4,
    title: "Sony WH-1000XM5",
    price: 349,
    category: "audio",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80",
    description: "Bozordagi eng yaxshi shovqinni to'suvchi quloqchinlar va uzoq batareya quvvati."
  },
  {
    id: 5,
    title: "Mechanical Keyboard RGB",
    price: 129,
    category: "electronics",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    description: "Yozish uchun qulay kalitlar va rang-barang RGB yoritgichi."
  },
  {
    id: 6,
    title: "Minimalist Smart Wallet",
    price: 59,
    category: "wearables",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
    description: "Ixcham, RFID hisob ma'lumotlarini himoya qiluvchi zamonaviy hamyon."
  }
];

// ==========================================
// 2. STATE (HOLAT) VA DOM ELEMENTLARI
// ==========================================
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
let activeCategory = 'all';
let searchQuery = '';

const productsGrid = document.getElementById('products-grid');
const noResults = document.getElementById('no-results');
const searchInput = document.getElementById('search-input');
const mobileSearchInput = document.getElementById('mobile-search-input');
const mobileSearchToggle = document.getElementById('mobile-search-toggle');
const mobileSearchBar = document.getElementById('mobile-search-bar');

const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartBadge = document.getElementById('cart-badge');
const checkoutBtn = document.getElementById('checkout-btn');

const productModalOverlay = document.getElementById('product-modal-overlay');
const productModal = document.getElementById('product-modal');
const modalContent = document.getElementById('modal-content');
const modalCloseBtn = document.getElementById('modal-close-btn');

// ==========================================
// 3. MAHSULOTLARNI RENDER QILISH
// ==========================================
function renderProducts() {
  const filtered = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productsGrid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');
  productsGrid.innerHTML = filtered.map(product => `
    <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div class="relative w-full h-52 bg-slate-100 rounded-xl overflow-hidden mb-4">
        <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <button onclick="openModal(${product.id})" class="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <i data-lucide="eye" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="flex items-center gap-1 text-amber-400 text-xs mb-2">
        <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
        <span class="font-semibold text-slate-700">${product.rating}</span>
      </div>

      <h3 class="font-bold text-slate-900 text-base mb-1 line-clamp-1">${product.title}</h3>
      <p class="text-slate-500 text-xs mb-4 line-clamp-2 flex-1">${product.description}</p>

      <div class="flex items-center justify-between pt-2 border-t border-slate-100">
        <span class="text-lg font-black text-slate-900">$${product.price}</span>
        <button onclick="addToCart(${product.id})" class="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-1.5">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          <span>Qo'shish</span>
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// ==========================================
// 4. SAVATCHA FUNKSIYALARI (CART)
// ==========================================
function updateCart() {
  localStorage.setItem('aura_cart', JSON.stringify(cart));
  
  // Badge yangilash
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalCount;
  cartBadge.style.opacity = totalCount > 0 ? '1' : '0';

  // Savatchani render qilish
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-12">
        <i data-lucide="shopping-bag" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
        <p class="text-slate-500 font-medium">Savatchangiz bo'sh</p>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded-xl bg-white">
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-slate-900 text-sm truncate">${item.title}</h4>
          <span class="text-xs font-semibold text-indigo-600">$${item.price}</span>
          <div class="flex items-center gap-3 mt-2">
            <button onclick="changeQuantity(${item.id}, -1)" class="w-6 h-6 bg-white border border-slate-200 rounded-md flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold">-</button>
            <span class="text-xs font-bold text-slate-800">${item.quantity}</span>
            <button onclick="changeQuantity(${item.id}, 1)" class="w-6 h-6 bg-white border border-slate-200 rounded-md flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.id})" class="p-2 text-slate-400 hover:text-rose-500 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `).join('');
  }

  // Umumiy narx
  const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotalPrice.textContent = `$${totalSum.toFixed(2)}`;

  lucide.createIcons();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  showToast(`"${product.title}" savatchaga qo'shildi!`);
}

function changeQuantity(productId, delta) {
  const index = cart.findIndex(item => item.id === productId);
  if (index > -1) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    updateCart();
  }
}

function removeFromCart(productId) {
  const item = cart.find(p => p.id === productId);
  cart = cart.filter(p => p.id !== productId);
  updateCart();
  if (item) showToast(`"${item.title}" o'chirildi`, 'remove');
}

// ==========================================
// 5. TOAST NOTIFICATION
// ==========================================
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  toastMessage.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 2500);
}

// ==========================================
// 6. MODAL FUNKSIYALARI
// ==========================================
function openModal(productId) {
  const product = products.find(p => p.id === productId);
  modalContent.innerHTML = `
    <div class="bg-slate-100 rounded-2xl overflow-hidden h-64 sm:h-full">
      <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover">
    </div>
    <div class="flex flex-col justify-between">
      <div>
        <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider">${product.category}</span>
        <h2 class="text-2xl font-bold text-slate-900 mt-1 mb-2">${product.title}</h2>
        <div class="flex items-center gap-1 text-amber-400 text-sm mb-4">
          <i data-lucide="star" class="w-4 h-4 fill-current"></i>
          <span class="font-semibold text-slate-700">${product.rating}</span>
        </div>
        <p class="text-slate-600 text-sm leading-relaxed mb-6">${product.description}</p>
      </div>
      <div class="space-y-4 pt-4 border-t border-slate-100">
        <span class="text-3xl font-black text-slate-900">$${product.price}</span>
        <button onclick="addToCart(${product.id}); closeModal();" class="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          <span>Savatchaga qo'shish</span>
        </button>
      </div>
    </div>
  `;

  productModalOverlay.classList.remove('opacity-0', 'pointer-events-none');
  productModal.classList.remove('scale-95');
  productModal.classList.add('scale-100');
  lucide.createIcons();
}

function closeModal() {
  productModalOverlay.classList.add('opacity-0', 'pointer-events-none');
  productModal.classList.remove('scale-100');
  productModal.classList.add('scale-95');
}

// ==========================================
// 7. EVENT LISTENERS & INITIALIZATION
// ==========================================
// Sidebar ochish/yopish
cartToggleBtn.addEventListener('click', () => {
  cartSidebar.classList.remove('translate-x-full');
  cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
});

const closeCart = () => {
  cartSidebar.classList.add('translate-x-full');
  cartOverlay.classList.add('opacity-0', 'pointer-events-none');
};

cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Category Filter
document.getElementById('category-filters').addEventListener('click', (e) => {
  if (e.target.classList.contains('category-btn')) {
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.className = 'category-btn px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all';
    });
    e.target.className = 'category-btn active px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap bg-indigo-600 text-white transition-all shadow-sm';
    
    activeCategory = e.target.dataset.category;
    renderProducts();
  }
});

// Real-time Search
const handleSearch = (e) => {
  searchQuery = e.target.value;
  renderProducts();
};
searchInput.addEventListener('input', handleSearch);
mobileSearchInput.addEventListener('input', handleSearch);

mobileSearchToggle.addEventListener('click', () => {
  mobileSearchBar.classList.toggle('hidden');
});

// Modal yopish
modalCloseBtn.addEventListener('click', closeModal);
productModalOverlay.addEventListener('click', (e) => {
  if (e.target === productModalOverlay) closeModal();
});

// Buyurtma tugmasi
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    showToast("Savatchangiz bo'sh!");
    return;
  }
  alert("Buyurtmangiz qabul qilindi! Rahmat.");
  cart = [];
  updateCart();
  closeCart();
});

// Dastlabki yuklanish
renderProducts();
updateCart();
lucide.createIcons();
