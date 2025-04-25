// shop.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-filter input');
    const categorySelect = document.querySelector('.category-filter select');
    const featuredSelect = document.querySelector('.featured-filter select');
    const productCards = document.querySelectorAll('.product-card');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartButton = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const checkoutButton = document.querySelector('.checkout-btn');
    const cartIconContainer = document.querySelector('.cart-icon-container');
    const cartCount = document.querySelector('.cart-count');

    let cart = [];

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
        const selectedFeatured = featuredSelect.value;

        productCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            const isFeatured = card.getAttribute('data-featured') === 'true';

            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
            const matchesFeatured = selectedFeatured === 'all' ||
                (selectedFeatured === 'featured' && isFeatured) ||
                (selectedFeatured === 'other' && !isFeatured);

            card.style.display = (matchesSearch && matchesCategory && matchesFeatured) ? 'block' : 'none';
        });
    }

    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);
    featuredSelect.addEventListener('change', filterProducts);

    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function updateCart() {
        cartItems.innerHTML = '';

        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            cartTotalAmount.textContent = '$0.00';
            cartCount.textContent = '0';
            localStorage.setItem('cart', JSON.stringify([]));
            return;
        }

        let total = 0;
        let itemCount = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            itemCount += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            `;

            cartItem.querySelector('.decrease').addEventListener('click', () => {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                saveCart();
                updateCart();
            });

            cartItem.querySelector('.increase').addEventListener('click', () => {
                cart[index].quantity++;
                saveCart();
                updateCart();
            });

            cartItem.querySelector('.cart-item-remove').addEventListener('click', () => {
                cart.splice(index, 1);
                saveCart();
                updateCart();
            });

            cartItems.appendChild(cartItem);
        });

        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = itemCount.toString();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // ADD TO CART
    window.addToCart = function (priceId) {
        const card = [...document.querySelectorAll('.product-card')]
            .find(card => card.querySelector('button[onclick*="' + priceId + '"]'));

        if (!card) return;

        const title = card.querySelector('h3').textContent;
        const price = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
        const image = card.querySelector('img').src;

        const existing = cart.find(item => item.priceId === priceId);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ priceId, title, price, image, quantity: 1 });
        }

        saveCart();
        updateCart();
        openCart();
    };

    // Checkout
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
            if (cart.length === 0) {
                alert('Your cart is empty.');
                return;
            }

            checkoutButton.disabled = true;
            checkoutButton.textContent = 'Processing...';

            try {
                const response = await fetch('/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: cart.map(item => ({
                            priceId: item.priceId,
                            quantity: item.quantity
                        }))
                    }),
                });

                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    throw new Error('Checkout failed.');
                }
            } catch (error) {
                console.error('Checkout Error:', error);
                alert('Checkout failed. Please try again.');
                checkoutButton.disabled = false;
                checkoutButton.textContent = 'Checkout';
            }
        });
    }

    // Initialize
    try {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = savedCart;
        updateCart();
    } catch (error) {
        console.error('Error loading saved cart:', error);
        cart = [];
    }

    cartOverlay.addEventListener('click', closeCart);
    closeCartButton.addEventListener('click', closeCart);
});