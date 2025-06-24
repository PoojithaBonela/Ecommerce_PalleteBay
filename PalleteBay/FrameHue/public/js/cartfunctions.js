
console.log('cartfunctions.js loaded and executing');

async function addToCart(id, name, price, image) {
    console.log('addToCart function has been called!'); // Add this line
    console.log('addToCart called with:');
    console.log('  id:', id);
    console.log('  name:', name);
    console.log('  price:', price);
    console.log('  image:', image);

    if (id === undefined) {
        console.error('addToCart: Product ID is undefined. Cannot add to cart.');
        return;
    }
    try {
        const response = await fetch('/api/user', {
            credentials: 'include' // Add this line
        });
        if (!response.ok) {
            // User is not logged in or session expired
            alert('Please log in to add items to your cart.');
            return;
        }
        // User is logged in, proceed to add to cart
    } catch (error) {
        console.error('Error checking authentication status:', error);
        alert('Could not verify login status. Please try again.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');

    // Dispatch a custom event to notify other parts of the application that the cart has been updated
    window.dispatchEvent(new Event('cartUpdated'));

}
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cart-btn').forEach(button => {
        const productId = button.dataset.id;
        console.log('DOMContentLoaded: Processing button with dataset.id:', productId, 'Button element:', button);
    });

    // Handle navigation cart link
    const navCartLink = document.querySelector('nav a[href="cart.html"]');
    if (navCartLink) {
        console.log('navCartLink found:', navCartLink);
        navCartLink.addEventListener('click', async (e) => {
            e.preventDefault(); // Prevent default navigation immediately
            console.log('Cart link clicked!');
            try {
                const response = await fetch('/api/user', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    console.log('User not logged in.');
                    alert('Please log in to view your cart.');
                } else {
                    console.log('User logged in. Allowing navigation to cart.html');
                    window.location.href = '/cart.html'; // Manually navigate if logged in
                }
            } catch (error) {
                console.error('Error checking authentication status for cart link:', error);
                alert('Could not verify login status. Please try again.');
            }
        });
    } else {
        console.log('navCartLink not found.');
    }
});

window.addEventListener('cartUpdated', () => {
    document.querySelectorAll('.cart-btn').forEach(button => {
        const productId = button.dataset.id;
        console.log('cartUpdated: Processing button with dataset.id:', productId, 'Button element:', button);
    });
});
fetch('/api/user')
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(user => {
      // User is logged in, leave the link as-is
    })
    .catch(() => {
      // User is not logged in, disable the link
      const link = document.getElementById('ordersLink');
      if (link) {
        link.href = "#";
        link.onclick = (e) => {
          e.preventDefault();
          alert("Please log in to view your orders.");
        };
      }
    });
