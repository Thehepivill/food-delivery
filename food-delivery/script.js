// Данные меню
const menuItems = [
    {
        id: 1,
        name: "Пицца Маргарита",
        description: "Классическая пицца с томатным соусом, моцареллой и базиликом",
        price: 450,
        category: "pizza",
        image: "images/margherita.jpg"
    },
    {
        id: 2,
        name: "Пицца Пепперони",
        description: "Пицца с томатным соусом, моцареллой и острой колбаской пепперони",
        price: 550,
        category: "pizza",
        image: "images/pepperoni.jpg"
    },
    {
        id: 3,
        name: "Чизбургер",
        description: "Аппетитный бургер с говяжьей котлетой, сыром, луком и соусом",
        price: 250,
        category: "burger",
        image: "images/cheeseburger.jpg"
    },
    {
        id: 4,
        name: "Бургер с беконом",
        description: "Бургер с говяжьей котлетой, беконом, сыром и соусом барбекю",
        price: 350,
        category: "burger",
        image: "images/bacon-burger.jpg"
    },
    {
        id: 5,
        name: "Греческий салат",
        description: "Свежие овощи, оливки, сыр фета и оливковое масло",
        price: 300,
        category: "salad",
        image: "images/greek-salad.jpg"
    },
    {
        id: 6,
        name: "Цезарь",
        description: "Курица, листья салата, сухарики и соус цезарь",
        price: 350,
        category: "salad",
        image: "images/caesar.jpg"
    },
    {
        id: 7,
        name: "Кола",
        description: "Газированный напиток",
        price: 100,
        category: "drink",
        image: "images/cola.jpg"
    },
    {
        id: 8,
        name: "Лимонад",
        description: "Освежающий домашний лимонад",
        price: 150,
        category: "drink",
        image: "images/lemonade.jpg"
    }
];

// Корзина
let cart = [];

// DOM элементы
const menuItemsContainer = document.getElementById('menu-items');
const categoryButtons = document.querySelectorAll('.category-btn');
const cartCount = document.getElementById('cart-count');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeBtn = document.querySelector('.close');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');

// Загрузка меню
function loadMenuItems(category = 'all') {
    menuItemsContainer.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    filteredItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.innerHTML = `
            <div class="item-image" style="background-image: url('${item.image}')"></div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="item-price">
                    <span class="price">${item.price} руб.</span>
                    <button class="add-to-cart" data-id="${item.id}">В корзину</button>
                </div>
            </div>
        `;
        menuItemsContainer.appendChild(itemElement);
    });
    
    // Добавляем обработчики для кнопок "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Фильтрация по категориям
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const category = button.getAttribute('data-category');
        loadMenuItems(category);
    });
});

// Добавление в корзину
function addToCart(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    const item = menuItems.find(item => item.id === itemId);
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCart();
}

// Обновление корзины
function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Открытие/закрытие модального окна корзины
cartBtn.addEventListener('click', () => {
    renderCartItems();
    cartModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Отрисовка товаров в корзине
function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        totalPriceElement.textContent = '0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price} руб. x ${item.quantity} = ${itemTotal} руб.</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                <button class="remove-btn" data-id="${item.id}">×</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    totalPriceElement.textContent = totalPrice;
    
    // Добавляем обработчики для кнопок в корзине
    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Уменьшение количества
function decreaseQuantity(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === itemId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== itemId);
    }
    
    updateCart();
    renderCartItems();
}

// Увеличение количества
function increaseQuantity(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === itemId);
    
    item.quantity += 1;
    
    updateCart();
    renderCartItems();
}

// Удаление из корзины
function removeFromCart(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== itemId);
    
    updateCart();
    renderCartItems();
}

// Оформление заказа
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    alert(`Заказ оформлен! Сумма: ${totalPriceElement.textContent} руб.`);
    cart = [];
    updateCart();
    renderCartItems();
    cartModal.style.display = 'none';
});

// Загрузка корзины из localStorage при загрузке страницы
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
    loadCartFromStorage();
});