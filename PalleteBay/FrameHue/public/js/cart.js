let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('subtotal-amount');
  const checkoutButton = document.getElementById('checkout-btn');

  // Only proceed if the cart display elements exist on the current page
  if (!cartItemsContainer || !cartTotalElement || !checkoutButton) {
    return; // Exit if elements are not found (e.g., on index.html or products.html)
  }

  let subtotal = 0;

  cartItemsContainer.innerHTML = ''; // Clear previous cart items

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalElement.textContent = '₹0.00';
    checkoutButton.style.display = 'none';
    return;
  } else {
    checkoutButton.style.display = 'block';
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    console.log('Image path for ' + item.name + ':', item.image);

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <div class="quantity-controls">
          <button onclick="decreaseQuantity(${index})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${index})">+</button>
          <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
        </div>
      </div>
      <span class="item-price">₹${itemTotal.toFixed(2)}</span>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotalElement.textContent = `₹${subtotal.toFixed(2)}`;

  // Dispatch a custom event after the cart is rendered/updated
  window.dispatchEvent(new Event('cartUpdated'));
}

function increaseQuantity(index) {
  cart[index].quantity++;
  updateCart();
}

function decreaseQuantity(index) {
  cart[index].quantity--;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  
if (cart.length === 0) {
  localStorage.removeItem('cart');
}
  renderCart();
}

function checkout() {
    window.location.href = 'checkout.html';
}

// Call renderCart initially and whenever cart changes (e.g., item removed, quantity changed)
// For example, in your removeItem function:
function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Re-render cart and dispatch event
}

// And in your updateQuantity function:
function updateQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Re-render cart and dispatch event
}
renderCart();
