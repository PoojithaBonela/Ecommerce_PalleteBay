const statesByCountry = {
    India: ["Andhra Pradesh", "Delhi", "Karnataka", "Maharashtra", "Tamil Nadu", "Telenagana"],
    USA: ["California", "Texas", "Florida", "New York", "Illinois"],
    UK: ["England", "Scotland", "Wales", "Northern Ireland", "Greater London"]
  };

  function updateStateOptions() {
    const country = document.getElementById("country").value;
    const stateSelect = document.getElementById("state");

    // Clear previous options
    stateSelect.innerHTML = '<option value="" disabled selected>Choose a state</option>';

    if (statesByCountry[country]) {
      statesByCountry[country].forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
      });
    }
  }

  // Function to display addresses
  function displayAddresses(addresses) {
    const addressesList = document.getElementById('addressesList');
    addressesList.innerHTML = ''; // Clear previous addresses

    if (addresses.length > 0) {
      addresses.forEach(address => {
        const addressDiv = document.createElement('div');
        addressDiv.classList.add('saved-address-item'); // Add a class for styling
        addressDiv.innerHTML = `
          <p><strong>${address.fullname}</strong></p>
          <p>${address.flat}, ${address.area}</p>
          <p>${address.landmark ? address.landmark + ', ' : ''}${address.city}, ${address.state} - ${address.pincode}</p>
          <p>${address.country}</p>
          <p>Mobile: ${address.mobile}</p>
          <div class="address-actions">
              <button class="use-address-button" data-address-id="${address._id}">Use this address</button>
              <button class="remove-address-button" data-address-id="${address._id}">Remove</button>
          </div>
        `;
        addressesList.appendChild(addressDiv);
      });
      document.getElementById('addressForm').style.display = 'none';
      document.getElementById('savedAddressesContainer').style.display = 'block';
    } else {
      document.getElementById('addressForm').style.display = 'block';
      document.getElementById('savedAddressesContainer').style.display = 'none';
    }
  }

  // Function to fetch addresses on page load
  async function fetchAddresses() {
    try {
      const response = await fetch('/api/addresses');
      if (response.ok) {
        const addresses = await response.json();
        displayAddresses(addresses);
      } else if (response.status === 401) {
        // User not authenticated, show the form to add new address
        document.getElementById('addressForm').style.display = 'block';
        document.getElementById('savedAddressesContainer').style.display = 'none';
      } else {
        console.error('Error fetching addresses:', response.statusText);
        alert('Error fetching saved addresses. Please try again.');
        document.getElementById('addressForm').style.display = 'block'; // Fallback to showing form
      }
    } catch (error) {
      console.error('Network error fetching addresses:', error);
      alert('Network error. Could not fetch saved addresses.');
      document.getElementById('addressForm').style.display = 'block'; // Fallback to showing form
    }
  }

  // Event listener for form submission
  document.getElementById('addressForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form values
    const country = document.getElementById('country').value;
    const fullname = document.getElementById('fullname').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    const flat = document.getElementById('flat').value.trim();
    const area = document.getElementById('area').value.trim();
    const landmark = document.getElementById('landmark').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value;

    // Basic validations
    if (!country || fullname === '' || !/^[0-9]{10}$/.test(mobile) || !/^[0-9]{6}$/.test(pincode) || flat === '' || area === '' || city === '' || !state) {
      alert('Please fill in all required address fields correctly.');
      return;
    }

    try {
      const response = await fetch('/api/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          country,
          fullname,
          mobile,
          pincode,
          flat,
          area,
          landmark,
          city,
          state
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        // After saving, re-fetch and display addresses
        fetchAddresses();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting address:', error);
      alert('An error occurred while saving your address. Please try again.');
    }
  });

  // Event listener for "Add New Address" button
  document.getElementById('addNewAddressButton').addEventListener('click', () => {
    document.getElementById('addressForm').style.display = 'block';
    document.getElementById('savedAddressesContainer').style.display = 'none';
    document.getElementById('addressForm').reset(); // Clear the form
  });

  // Initial fetch of addresses when the page loads
  document.addEventListener('DOMContentLoaded', fetchAddresses);

  // Event delegation for "Use this address" buttons
  document.getElementById('addressesList').addEventListener('click', async (event) => {
    if (event.target.classList.contains('use-address-button')) {
      const addressId = event.target.dataset.addressId;
      // Here you would typically store the selected address ID in session/local storage
      // or send it to the server to associate with the current order.
      console.log('Using address with ID:', addressId);

      // Retrieve cart data from localStorage
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      if (cart.length === 0) {
          alert('Your cart is empty. Please add items before checking out.');
          return; // Stop the checkout process if cart is empty
      }

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart, // Include the cart data
            shippingAddress: addressId,
          })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.orderId) {
                sessionStorage.setItem('currentOrderId', data.orderId);
            }
            alert('Proceeding to payment...');
            localStorage.removeItem('cart');
            window.location.href = 'payment.html';
        } else {
            const errorData = await response.json();
            alert('Checkout failed: ' + errorData.message);
        }
      } catch (error) {
        console.error('Error during checkout:', error);
        alert('An error occurred during checkout. Please try again.');
      }
    } else if (event.target.classList.contains('remove-address-button')) {
      const addressId = event.target.dataset.addressId;
      if (confirm('Are you sure you want to remove this address?')) {
        removeAddress(addressId);
      }
    }
  });

  async function removeAddress(addressId) {
    try {
      const response = await fetch(`/api/address/${addressId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        fetchAddresses(); // Re-fetch and display addresses after removal
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error removing address:', error);
      alert('An error occurred while removing the address. Please try again.');
    }
  }

