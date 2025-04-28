document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-filter input');
    const categorySelect = document.querySelector('.category-filter select');
    const featuredSelect = document.querySelector('.featured-filter select');
    const productCards = document.querySelectorAll('.product-card');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartButton = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const checkoutButton = document.querySelector('.checkout-btn');
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const cartIconContainer = document.querySelector('.cart-icon-container');
    const cartCount = document.querySelector('.cart-count');

    let cart = [];

    // Featured products
    const featuredProducts = [
        'Quiet Strength',
        'Blossoming Day Dream',
        'Be Afraid To Stand Still'
    ];

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
        const selectedFeatured = featuredSelect.value;

        productCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            const isFeatured = card.getAttribute('data-featured') === 'true';

            // Check if product matches all criteria
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
            const matchesFeatured = selectedFeatured === 'all' ||
                (selectedFeatured === 'featured' && isFeatured) ||
                (selectedFeatured === 'other' && !isFeatured);

            if (matchesSearch && matchesCategory && matchesFeatured) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
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

        if (!cart || cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            cartTotalAmount.textContent = '$0.00';
            cartCount.textContent = '0';

            // Save empty cart to localStorage
            localStorage.setItem('cart', JSON.stringify([]));
            return;
        }

        let total = 0;
        let itemCount = 0;

        cart.forEach((item, index) => {
            // Skip invalid items
            if (!item || !item.title || !item.price) {
                return;
            }

            const itemPrice = item.price || 0;
            const itemQuantity = item.quantity || 1;

            total += itemPrice * itemQuantity;
            itemCount += itemQuantity;

            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.image || ''}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${itemPrice.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span>${itemQuantity}</span>
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

                    // Save updated cart to localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));
                }
            });

            cartItemElement.querySelector('.increase').addEventListener('click', () => {
                item.quantity++;
                updateCart();

                // Save updated cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
            });

            cartItemElement.querySelector('.cart-item-remove').addEventListener('click', () => {
                cart.splice(index, 1);
                updateCart();

                // Save updated cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
            });
        });

        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = itemCount.toString();
    }

    // Click on cart icon to open cart
    if (cartIconContainer) {
        cartIconContainer.addEventListener('click', openCart);
    }

    // Set data-price attribute for product cards
    productCards.forEach(card => {
        const priceText = card.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace('$', ''));
        card.setAttribute('data-price', price);
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const title = productCard.querySelector('h3').textContent;
            const price = parseFloat(productCard.getAttribute('data-price'));
            const image = productCard.querySelector('img').src;
            const priceId = button.getAttribute('data-price-id');

            if (!priceId) {
                console.error('No price ID found for product:', title);
                alert('Unable to add product to cart. Missing price information.');
                return;
            }

            const existingItemIndex = cart.findIndex(item => item.title === title);

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity++;
            } else {
                cart.push({ title, price, image, quantity: 1, priceId });
            }

            updateCart();
            openCart();

            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            button.textContent = 'Added!';
            button.style.backgroundColor = 'var(--success-color)';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '';
            }, 1500);
        });
    });

    // Function to add to cart from any page
    window.addToCart = function (title, price, image, priceId) {
        const existingItemIndex = cart.findIndex(item => item.title === title);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity++;
        } else {
            cart.push({ title, price, image, quantity: 1, priceId });
        }

        updateCart();
        openCart();

        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // Load cart from localStorage on page load
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);

            // Filter out invalid items
            cart = cart.filter(item => item && item.title && item.price);

            if (!Array.isArray(cart)) {
                cart = [];
            }
        } else {
            cart = [];
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }

    // Initialize cart
    updateCart();

    cartOverlay.addEventListener('click', closeCart);
    closeCartButton.addEventListener('click', closeCart);

    // Initialize quick view functionality
    const quickViewModal = document.createElement('div');
    quickViewModal.className = 'quick-view-modal';
    document.body.appendChild(quickViewModal);

    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            const productImage = productCard.querySelector('img').src;
            const productTitle = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productDescription = productCard.querySelector('.description').textContent;
            const priceId = productCard.querySelector('.add-to-cart').getAttribute('data-price-id');

            quickViewModal.innerHTML = `
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        <img src="${productImage}" alt="${productTitle}" id="quick-view-img">
                    </div>
                    <div class="quick-view-details">
                        <h2>${productTitle}</h2>
                        <p class="price">${productPrice}</p>
                        <p class="description">${productDescription}</p>
                        <button class="btn add-to-cart" data-price-id="${priceId}">Add to Cart</button>
                    </div>
                    <span class="quick-view-close">&times;</span>
                </div>
            `;

            quickViewModal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Initialize zoom functionality
            const quickViewImg = document.getElementById('quick-view-img');
            let isZoomed = false;

            quickViewImg.addEventListener('click', () => {
                if (!isZoomed) {
                    quickViewImg.style.transform = 'scale(2)';
                    quickViewImg.style.cursor = 'zoom-out';
                    isZoomed = true;
                } else {
                    quickViewImg.style.transform = 'scale(1)';
                    quickViewImg.style.cursor = 'zoom-in';
                    isZoomed = false;
                }
            });

            // Close modal functionality
            const closeBtn = quickViewModal.querySelector('.quick-view-close');
            closeBtn.addEventListener('click', () => {
                quickViewModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });

            quickViewModal.addEventListener('click', (e) => {
                if (e.target === quickViewModal) {
                    quickViewModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });

            // Add to cart from quick view
            const addToCartBtn = quickViewModal.querySelector('.add-to-cart');
            addToCartBtn.addEventListener('click', () => {
                const priceValue = parseFloat(productPrice.replace('$', ''));
                const itemPriceId = addToCartBtn.getAttribute('data-price-id');

                // Call global addToCart function with all parameters including priceId
                window.addToCart(productTitle, priceValue, productImage, itemPriceId);

                quickViewModal.style.display = 'none';
                document.body.style.overflow = 'auto';
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
                // Check if items have price IDs
                const itemsForCheckout = cart.map(item => {
                    return {
                        priceId: item.priceId,
                        quantity: item.quantity
                    };
                });

                // Log for debugging
                console.log('Checkout items:', itemsForCheckout);

                const res = await fetch('/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: itemsForCheckout
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
});