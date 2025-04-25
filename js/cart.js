// cart.js
document.addEventListener('DOMContentLoaded', () => {
    const cartIconContainer = document.querySelector('.cart-icon-container');
    const cartCount = document.querySelector('.cart-count');

    function loadCart() {
        try {
            const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
            updateCartCount(savedCart);
        } catch (error) {
            console.error('Error loading cart:', error);
            localStorage.setItem('cart', JSON.stringify([]));
            updateCartCount([]);
        }
    }

    function updateCartCount(cart) {
        if (!cartCount) return;

        const itemCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);
        cartCount.textContent = itemCount.toString();
    }

    // Handle cart icon click
    if (cartIconContainer) {
        cartIconContainer.addEventListener('click', () => {
            if (!window.location.pathname.includes('shop.html')) {
                window.location.href = 'shop.html';
            }
        });
    }

    loadCart();
});
