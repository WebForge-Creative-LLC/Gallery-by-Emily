document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const sortSelect = document.getElementById('sort-select');
    const productCards = document.querySelectorAll('.product-card');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartButton = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const checkoutButton = document.querySelector('.checkout-btn');
    const quickViewButtons = document.querySelectorAll('.product-overlay .btn');

    let cart = [];

    function filterAndSortProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categorySelect.value;
        const sortBy = sortSelect.value;

        productCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const productCategory = card.getAttribute('data-category');
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = category === 'all' || productCategory === category;

            card.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
        });

        const visibleProducts = Array.from(productCards).filter(card => card.style.display !== 'none');

        visibleProducts.sort((a, b) => {
            if (sortBy === 'price-low') {
                return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
            } else if (sortBy === 'price-high') {
                return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
            } else if (sortBy === 'newest') {
                return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
            }
            return 0;
        });

        const shopGrid = document.querySelector('.shop-grid');
        visibleProducts.forEach(product => shopGrid.appendChild(product));
    }

    searchInput.addEventListener('input', filterAndSortProducts);
    categorySelect.addEventListener('change', filterAndSortProducts);
    sortSelect.addEventListener('change', filterAndSortProducts);

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
            return;
        }

        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            `;

            cartItems.appendChild(cartItemElement);

            cartItemElement.querySelector('.decrease').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    updateCart();
                }
            });

            cartItemElement.querySelector('.increase').addEventListener('click', () => {
                item.quantity++;
                updateCart();
            });

            cartItemElement.querySelector('.cart-item-remove').addEventListener('click', () => {
                cart.splice(index, 1);
                updateCart();
            });
        });

        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const title = productCard.querySelector('h3').textContent;
            const price = parseFloat(productCard.getAttribute('data-price'));
            const image = productCard.querySelector('img').src;
            const priceId = button.getAttribute('data-price-id');

            const existingItemIndex = cart.findIndex(item => item.title === title);

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity++;
            } else {
                cart.push({ title, price, image, quantity: 1, priceId });
            }

            updateCart();
            openCart();

            button.textContent = 'Added!';
            button.style.backgroundColor = 'var(--success-color)';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '';
            }, 1500);
        });
    });

    cartOverlay.addEventListener('click', closeCart);
    closeCartButton.addEventListener('click', closeCart);

    quickViewButtons.forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            const title = productCard.querySelector('h3').textContent;
            const category = productCard.querySelector('.product-category').textContent;
            const price = productCard.querySelector('.product-price').textContent;
            const image = productCard.querySelector('img').src;
            const priceId = productCard.querySelector('.add-to-cart').getAttribute('data-price-id');

            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');

            const lightboxContent = document.createElement('div');
            lightboxContent.classList.add('lightbox-content');
            lightboxContent.innerHTML = `
                <div class="product-quick-view">
                    <div class="quick-view-image">
                        <img src="${image}" alt="${title}">
                    </div>
                    <div class="quick-view-info">
                        <h2>${title}</h2>
                        <p>${category}</p>
                        <p class="quick-view-price">${price}</p>
                        <button class="btn add-to-cart-quick">Add to Cart</button>
                    </div>
                </div>
            `;

            const closeButton = document.createElement('span');
            closeButton.classList.add('lightbox-close');
            closeButton.innerHTML = '&times;';
            lightbox.appendChild(lightboxContent);
            lightbox.appendChild(closeButton);
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            closeButton.addEventListener('click', () => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
            });

            lightbox.addEventListener('click', e => {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = 'auto';
                }
            });

            lightboxContent.querySelector('.add-to-cart-quick').addEventListener('click', () => {
                const priceValue = parseFloat(price.replace('$', ''));
                const existingItemIndex = cart.findIndex(item => item.title === title);

                if (existingItemIndex !== -1) {
                    cart[existingItemIndex].quantity++;
                } else {
                    cart.push({ title, price: priceValue, image, quantity: 1, priceId });
                }

                updateCart();
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
                openCart();
            });
        });
    });

    if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
            if (cart.length === 0) {
                alert('Your cart is empty. Add some items before checking out.');
                return;
            }

            checkoutButton.disabled = true;
            checkoutButton.textContent = 'Processing...';

            try {
                const res = await fetch('https://test-1-5w0d.onrender.com/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: cart.map(item => ({
                            priceId: item.priceId,
                            quantity: item.quantity
                        }))
                    })
                });

                const data = await res.json();

                if (data.url) {
                    window.location.href = data.url;
                } else {
                    throw new Error('Checkout failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('There was a problem processing your payment. Please try again.');
                checkoutButton.disabled = false;
                checkoutButton.textContent = 'Checkout';
            }
        });
    }

    updateCart();
});