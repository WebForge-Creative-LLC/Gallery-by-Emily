// Cart functionality for all pages
document.addEventListener('DOMContentLoaded', () => {
    const cartIconContainer = document.querySelector('.cart-icon-container');
    const cartCount = document.querySelector('.cart-count');

    // Load cart from localStorage
    function loadCart() {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                let cart = JSON.parse(savedCart);

                // Validate cart data
                if (!Array.isArray(cart)) {
                    cart = [];
                    localStorage.setItem('cart', JSON.stringify([]));
                }

                // Filter out invalid items
                cart = cart.filter(item => item && item.title && item.price);

                updateCartCount(cart);
            } else {
                // Initialize empty cart
                localStorage.setItem('cart', JSON.stringify([]));
                updateCartCount([]);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            localStorage.setItem('cart', JSON.stringify([]));
            updateCartCount([]);
        }
    }

    // Update cart count in the UI
    function updateCartCount(cart) {
        if (!cartCount) return;

        if (!cart || cart.length === 0) {
            cartCount.textContent = '0';
            return;
        }

        let itemCount = 0;
        cart.forEach(item => {
            if (item && item.quantity) {
                itemCount += item.quantity;
            }
        });

        cartCount.textContent = itemCount.toString();
    }

    // Handle cart icon click
    if (cartIconContainer) {
        cartIconContainer.addEventListener('click', () => {
            // If on shop page, the shop.js will handle the click
            // If on other pages, redirect to shop page
            if (!window.location.pathname.includes('shop.html')) {
                window.location.href = 'shop.html';
            }
        });
    }

    // Load cart on page load
    loadCart();
}); 