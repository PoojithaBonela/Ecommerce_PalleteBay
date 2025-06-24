document.addEventListener('DOMContentLoaded', fetchOrders);

        async function fetchOrders() {
            const ordersContainer = document.getElementById('ordersContainer');
            ordersContainer.innerHTML = '<p class="no-orders">Loading your orders...</p>';

            try {
                const response = await fetch('/api/orders');
                if (response.ok) {
                    const orders = await response.json();
                    displayOrders(orders);
                } else if (response.status === 401) {
                    ordersContainer.innerHTML = '<p class="no-orders">Please <a href="/login.html">log in</a> to view your orders.</p>';
                } else {
                    console.error('Error fetching orders:', response.statusText);
                    ordersContainer.innerHTML = '<p class="no-orders">Error loading orders. Please try again later.</p>';
                }
            } catch (error) {
                console.error('Network error fetching orders:', error);
                ordersContainer.innerHTML = '<p class="no-orders">Network error. Could not load orders.</p>';
            }
        }

        function displayOrders(orders) {
            const ordersContainer = document.getElementById('ordersContainer');
            ordersContainer.innerHTML = ''; // Clear loading message

            if (orders.length === 0) {
                ordersContainer.innerHTML = '<p class="no-orders">You have no orders yet.</p>';
                return;
            }

            orders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order-item');

                const orderDate = new Date(order.createdAt).toLocaleDateString();

                let addressHtml = 'N/A';
                if (order.shippingAddress) {
                    const addr = order.shippingAddress;
                    addressHtml = `
                        ${addr.fullname}<br>
                        ${addr.flat}, ${addr.area}<br>
                        ${addr.landmark ? addr.landmark + ', ' : ''}${addr.city}, ${addr.state} - ${addr.pincode}<br>
                        ${addr.country}<br>
                        Mobile: ${addr.mobile}
                    `;
                }

                orderDiv.innerHTML = `
                    <div class="order-header">
                        <span>Order ID: ${order._id}</span>
                        <span>Date: ${orderDate}</span>
                    </div>
                    <div class="order-details">
                        <p><strong>Shipping Address:</strong><br>${addressHtml}</p>
                        <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
                        <!-- Add View Items button -->
                        <button class="view-items-button" data-order-id="${order._id}">View Items</button>
                        <!-- Items list, initially hidden -->
                        <ul class="order-items-list" id="items-list-${order._id}" style="display: none;">
                            ${order.cart.map(item => `
                                <li>
                                    ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px; vertical-align: middle;">` : ''}
                                    ${item.name} (Qty: ${item.quantity}) - $${item.price.toFixed(2)}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="order-actions">
                        <button class="delete-order-button" data-order-id="${order._id}">Delete this Order</button>
                    </div>
                `;
                ordersContainer.appendChild(orderDiv);
            });
        }

        // Event delegation for "Delete this Order" and "View Items" buttons
        document.getElementById('ordersContainer').addEventListener('click', async (event) => {
            if (event.target.classList.contains('delete-order-button')) {
                const orderId = event.target.dataset.orderId;
                if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
                    await deleteOrder(orderId);
                }
            } else if (event.target.classList.contains('view-items-button')) {
                const orderId = event.target.dataset.orderId;
                const itemsList = document.getElementById(`items-list-${orderId}`);
                const button = event.target;
                if (itemsList.style.display === 'none') {
                    itemsList.style.display = 'block'; // Or 'flex', 'grid'
                    button.textContent = 'Hide Items';
                } else {
                    itemsList.style.display = 'none';
                    button.textContent = 'View Items';
                }
            }
        });

        async function deleteOrder(orderId) {
            try {
                const response = await fetch(`/api/orders/${orderId}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message);
                    fetchOrders(); // Re-fetch and display orders after successful deletion
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('An error occurred while deleting the order. Please try again.');
            }
        }
    