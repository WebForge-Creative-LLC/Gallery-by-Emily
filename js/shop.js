// Shop Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Elements
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

    // Shopping cart array
    let cart = [];

    // Filter and Sort Products
    function filterAndSortProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categorySelect.value;
        const sortBy = sortSelect.value;

        // First, filter products
        productCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const productCategory = card.getAttribute('data-category');
            
            // Check if product matches search term and category
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = category === 'all' || productCategory === category;
            
            // Show or hide based on filters
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Then, sort visible products
        const visibleProducts = Array.from(productCards).filter(card => card.style.display !== 'none');
        
        // Sort based on selected option
        visibleProducts.sort((a, b) => {
            if (sortBy === 'price-low') {
                return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
            } else if (sortBy === 'price-high') {
                return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
            } else if (sortBy === 'newest') {
                return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
            }
            // Default (featured) - no sorting needed
            return 0;
        });

        // Rearrange products in the DOM based on sort
        const shopGrid = document.querySelector('.shop-grid');
        visibleProducts.forEach(product => {
            shopGrid.appendChild(product);
        });
    }

    // Event listeners for filtering and sorting
    searchInput.addEventListener('input', filterAndSortProducts);
    categorySelect.addEventListener('change', filterAndSortProducts);
    sortSelect.addEventListener('change', filterAndSortProducts);

    // Shopping Cart Functions
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Allow scrolling
    }

    function updateCart() {
        // Clear cart items
        cartItems.innerHTML = '';

        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            cartTotalAmount.textContent = '$0.00';
            return;
        }

        // Add each item to cart
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
            
            // Add event listeners for quantity buttons
            const decreaseBtn = cartItemElement.querySelector('.decrease');
            const increaseBtn = cartItemElement.querySelector('.increase');
            const removeBtn = cartItemElement.querySelector('.cart-item-remove');
            
            decreaseBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    updateCart();
                }
            });
            
            increaseBtn.addEventListener('click', () => {
                item.quantity++;
                updateCart();
            });
            
            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1);
                updateCart();
            });
        });
        
        // Update total
        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
    }

    // Add to cart button click
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const title = productCard.querySelector('h3').textContent;
            const price = parseFloat(productCard.getAttribute('data-price'));
            const image = productCard.querySelector('img').src;
            
            // Check if item is already in cart
            const existingItemIndex = cart.findIndex(item => item.title === title);
            
            if (existingItemIndex !== -1) {
                // Increase quantity if already in cart
                cart[existingItemIndex].quantity++;
            } else {
                // Add new item to cart
                cart.push({
                    title,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            // Update cart and open it
            updateCart();
            openCart();
            
            // Animation feedback
            button.textContent = 'Added!';
            button.style.backgroundColor = 'var(--success-color)';
            
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '';
            }, 1500);
        });
    });

    // Cart open/close events
    cartOverlay.addEventListener('click', closeCart);
    closeCartButton.addEventListener('click', closeCart);

    // Quick View functionality
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productCard = button.closest('.product-card');
            const title = productCard.querySelector('h3').textContent;
            const category = productCard.querySelector('.product-category').textContent;
            const price = productCard.querySelector('.product-price').textContent;
            const image = productCard.querySelector('img').src;
            
            // Create lightbox
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
            
            // Add event listeners for lightbox
            closeButton.addEventListener('click', () => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
            });
            
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Add to cart from quick view
            const addToCartQuick = lightboxContent.querySelector('.add-to-cart-quick');
            addToCartQuick.addEventListener('click', () => {
                const priceValue = parseFloat(price.replace('$', ''));
                
                // Check if item is already in cart
                const existingItemIndex = cart.findIndex(item => item.title === title);
                
                if (existingItemIndex !== -1) {
                    // Increase quantity if already in cart
                    cart[existingItemIndex].quantity++;
                } else {
                    // Add new item to cart
                    cart.push({
                        title,
                        price: priceValue,
                        image,
                        quantity: 1
                    });
                }
                
                // Update cart
                updateCart();
                
                // Close lightbox and open cart
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
                openCart();
            });
        });
    });

    // Checkout button click
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
            const amount = Math.round(parseFloat(cartTotalAmount.textContent.replace('$', '')) * 100);
            
            if (amount <= 0) {
                alert('Your cart is empty. Add some items before checking out.');
                return;
            }
            
            // Disable button and show loading state
            checkoutButton.disabled = true;
            checkoutButton.textContent = 'Processing...';
            
            try {
                const res = await fetch('/.netlify/functions/create-checkout-session', {
                    method: 'POST',
                    body: JSON.stringify({ amount })
                });
                
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Network response was not ok');
                }
                
                const { id } = await res.json();
                // We'll load the publishable key directly into the HTML during deployment
                const stripe = Stripe(stripePublicKey || 'pk_test_your_test_key');
                await stripe.redirectToCheckout({ sessionId: id });
            } catch (error) {
                console.error('Error:', error);
                alert('There was a problem processing your payment. Please try again.');
                // Reset button state
                checkoutButton.disabled = false;
                checkoutButton.textContent = 'Checkout';
            }
        });
    }

    // Initialize with all products showing
    updateCart();
}); 