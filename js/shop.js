// Inside checkout button event listener:
checkoutButton.addEventListener('click', async () => {
    if (cart.length === 0) {
        alert('Your cart is empty. Add some items before checking out.');
        return;
    }

    checkoutButton.disabled = true;
    checkoutButton.textContent = 'Processing...';

    try {
        const res = await fetch('https://gallery-by-emily.onrender.com/create-checkout-session', {
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
