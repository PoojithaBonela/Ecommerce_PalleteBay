// Dropdown functionality
    const dropdownButtons = document.querySelectorAll('.dropdown-button');
    
    dropdownButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const content = document.getElementById(targetId);
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
          if (dropdown.id !== targetId) {
            dropdown.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        content.classList.toggle('active');
      });
    });

    // Handle credit/debit card radio button selection and pay button display
    const cardRadioButtons = document.querySelectorAll('#cardDropdown input[type="radio"]');
    const cardPayButton = document.getElementById('cardPayButton');

    cardRadioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          cardPayButton.style.display = 'block';
          cardPayButton.textContent = `Pay Now with ${this.nextElementSibling.textContent}`;
        }
      });
    });

    // Handle card pay button click
    document.getElementById('cardPayButton').addEventListener('click', async function() {
        const selectedMethod = document.querySelector('#cardDropdown input[type="radio"]:checked').value;
        const orderId = sessionStorage.getItem('currentOrderId');

        if (!orderId) {
            alert('Order ID not found. Please complete the checkout process first.');
            return;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}/paymentMethod`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentMethod: selectedMethod })
            });

            if (response.ok) {
                alert(`Processing payment with ${selectedMethod}...`);
                sessionStorage.removeItem('currentOrderId'); // Clear order ID after successful payment
                window.location.href = 'ordersuccess.html';
            } else {
                const errorData = await response.json();
                alert('Failed to update payment method: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error updating payment method:', error);
            alert('An error occurred while processing your payment.');
        }
    });

    // Handle pay later radio button selection and pay button display
    const payLaterRadioButtons = document.querySelectorAll('#payLaterDropdown input[type="radio"]');
    const payLaterButton = document.getElementById('payLaterButton');

    payLaterRadioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          payLaterButton.style.display = 'block';
          payLaterButton.textContent = `Pay Now with ${this.nextElementSibling.textContent}`;
        }
      });
    });

    // Handle pay later button click
    payLaterButton.addEventListener('click', async function() {
      const selectedMethod = document.querySelector('#payLaterDropdown input[type="radio"]:checked').value;
      const orderId = sessionStorage.getItem('currentOrderId');

      if (!orderId) {
          alert('Order ID not found. Please complete the checkout process first.');
          return;
      }

      try {
          const response = await fetch(`/api/orders/${orderId}/paymentMethod`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ paymentMethod: selectedMethod })
          });

          if (response.ok) {
              alert(`Processing payment with ${selectedMethod}...`);
              sessionStorage.removeItem('currentOrderId'); // Clear order ID after successful payment
              window.location.href = 'ordersuccess.html';
          } else {
              const errorData = await response.json();
              alert('Failed to update payment method: ' + errorData.message);
          }
      } catch (error) {
          console.error('Error updating payment method:', error);
          alert('An error occurred while processing your payment.');
      }
    });

    // Handle wallets radio button selection and pay button display
    const walletsRadioButtons = document.querySelectorAll('#walletsDropdown input[type="radio"]');
    const walletsButton = document.getElementById('walletsButton');

    walletsRadioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          walletsButton.style.display = 'block';
          walletsButton.textContent = `Pay Now with ${this.nextElementSibling.textContent}`;
        }
      });
    });

    // Handle wallets button click
    walletsButton.addEventListener('click', async function() {
      const selectedMethod = document.querySelector('#walletsDropdown input[type="radio"]:checked').value;
      const orderId = sessionStorage.getItem('currentOrderId');

      if (!orderId) {
          alert('Order ID not found. Please complete the checkout process first.');
          return;
      }

      try {
          const response = await fetch(`/api/orders/${orderId}/paymentMethod`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ paymentMethod: selectedMethod })
          });

          if (response.ok) {
              alert(`Processing payment with ${selectedMethod}...`);
              sessionStorage.removeItem('currentOrderId'); // Clear order ID after successful payment
              window.location.href = 'ordersuccess.html';
          } else {
              const errorData = await response.json();
              alert('Failed to update payment method: ' + errorData.message);
          }
      } catch (error) {
          console.error('Error updating payment method:', error);
          alert('An error occurred while processing your payment.');
      }
    });

    // Handle EMI radio button selection and pay button display
    const emiRadioButtons = document.querySelectorAll('#emiDropdown input[type="radio"]');
    const emiButton = document.getElementById('emiButton');

    emiRadioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          emiButton.style.display = 'block';
          emiButton.textContent = `Pay Now with ${this.nextElementSibling.textContent}`;
        }
      });
    });

    // Handle EMI button click
    emiButton.addEventListener('click', async function() {
      const selectedMethod = document.querySelector('#emiDropdown input[type="radio"]:checked').value;
      const orderId = sessionStorage.getItem('currentOrderId');

      if (!orderId) {
          alert('Order ID not found. Please complete the checkout process first.');
          return;
      }

      try {
          const response = await fetch(`/api/orders/${orderId}/paymentMethod`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ paymentMethod: selectedMethod })
          });

          if (response.ok) {
              alert(`Processing payment with ${selectedMethod}...`);
              sessionStorage.removeItem('currentOrderId'); // Clear order ID after successful payment
              window.location.href = 'ordersuccess.html';
          } else {
              const errorData = await response.json();
              alert('Failed to update payment method: ' + errorData.message);
          }
      } catch (error) {
          console.error('Error updating payment method:', error);
          alert('An error occurred while processing your payment.');
      }
    });

    // Handle net banking radio button selection and pay button display
    const netBankingRadioButtons = document.querySelectorAll('#netBankingDropdown input[type="radio"]');
    const netBankingButton = document.getElementById('netBankingButton');

    netBankingRadioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          netBankingButton.style.display = 'block';
          netBankingButton.textContent = `Pay Now with ${this.nextElementSibling.textContent}`;
        }
      });
    });

    // Handle net banking button click
    netBankingButton.addEventListener('click', async function() {
      const selectedMethod = document.querySelector('#netBankingDropdown input[type="radio"]:checked').value;
      const orderId = sessionStorage.getItem('currentOrderId');

      if (!orderId) {
          alert('Order ID not found. Please complete the checkout process first.');
          return;
      }

      try {
          const response = await fetch(`/api/orders/${orderId}/paymentMethod`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ paymentMethod: selectedMethod })
          });

          if (response.ok) {
              alert(`Processing payment with ${selectedMethod}...`);
              sessionStorage.removeItem('currentOrderId'); // Clear order ID after successful payment
              window.location.href = 'ordersuccess.html';
          } else {
              const errorData = await response.json();
              alert('Failed to update payment method: ' + errorData.message);
          }
      } catch (error) {
          console.error('Error updating payment method:', error);
          alert('An error occurred while processing your payment.');
      }
    });

    // Handle UPI radio button selection and pay button display
    const upiRadioButtons = document.querySelectorAll('#upiDropdown input[type="radio"]');
    const upiPayButton = document.getElementById('upiPayButton');

    upiRadioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          upiPayButton.style.display = 'block';
          upiPayButton.textContent = `Pay Now with ${this.nextElementSibling.textContent}`;
        }
      });
    });

    // Handle UPI pay button click
    document.getElementById('upiPayButton').addEventListener('click', async function() {
        const selectedMethod = document.querySelector('#upiDropdown input[type="radio"]:checked').value;
        const orderId = sessionStorage.getItem('currentOrderId');

        if (!orderId) {
            alert('Order ID not found. Please complete the checkout process first.');
            return;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}/paymentMethod`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentMethod: selectedMethod })
            });

            if (response.ok) {
                alert(`Processing payment with ${selectedMethod}...`);
                sessionStorage.removeItem('currentOrderId'); // Clear order ID after successful payment
                window.location.href = 'ordersuccess.html';
            } else {
                const errorData = await response.json();
                alert('Failed to update payment method: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error updating payment method:', error);
            alert('An error occurred while processing your payment.');
        }
    });

    // Handle card pay button click
    document.getElementById('cardPayButton').addEventListener('click', function() {
        window.location.href = 'ordersuccess.html';
    });

    // Handle pay later button click
    document.getElementById('payLaterButton').addEventListener('click', function() {
        window.location.href = 'ordersuccess.html';
    });

    // Handle wallets button click
    document.getElementById('walletsButton').addEventListener('click', function() {
        window.location.href = 'ordersuccess.html';
    });

    // Handle EMI button click
    document.getElementById('emiButton').addEventListener('click', function() {
        window.location.href = 'ordersuccess.html';
    });

    // Handle net banking button click
    document.getElementById('netBankingButton').addEventListener('click', function() {
        window.location.href = 'ordersuccess.html';
    });

    // Handle recommended Google Pay radio button selection
    document.getElementById('recommendedGooglePay').addEventListener('change', function() {
        const payButton = document.getElementById('recommendedPayButton');
        if (this.checked) {
            payButton.style.display = 'block';
        } else {
            payButton.style.display = 'none';
        }
    });

    // Handle recommended pay button click
    document.getElementById('recommendedPayButton').addEventListener('click', async function() {
        const selectedMethod = 'Recommended Google Pay'; // Assuming this is the method for this button
        const orderId = sessionStorage.getItem('currentOrderId');

        if (!orderId) {
            alert('Order ID not found. Please complete the checkout process first.');
            return;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}/paymentMethod`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentMethod: selectedMethod })
            });

            if (response.ok) {
                alert(`Processing payment with ${selectedMethod}...`);
                sessionStorage.removeItem('currentOrderId'); // Clear order ID after successful payment
                window.location.href = 'ordersuccess.html';
            } else {
                const errorData = await response.json();
                alert('Failed to update payment method: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error updating payment method:', error);
            alert('An error occurred while processing your payment.');
        }
    });

    // Handle Recommended Google Pay button click
    document.getElementById('recommendedPayButton').addEventListener('click', async function() {
        const selectedMethod = 'Google Pay'; // Or get from a radio button if applicable
        const orderId = sessionStorage.getItem('currentOrderId');

        if (!orderId) {
            alert('Order ID not found. Please complete the checkout process first.');
            return;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}/paymentMethod`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentMethod: selectedMethod })
            });

            if (response.ok) {
                alert(`Processing payment with ${selectedMethod}...`);
                sessionStorage.removeItem('currentOrderId'); // Clear order ID after successful payment
                window.location.href = 'ordersuccess.html';
            } else {
                const errorData = await response.json();
                alert('Failed to update payment method: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error updating payment method:', error);
            alert('An error occurred while processing your payment.');
        }
    });

    // Handle Cash on Delivery radio button selection
    document.getElementById('cashOnDelivery').addEventListener('change', function() {
        const codButton = document.getElementById('codButton');
        if (this.checked) {
            codButton.style.display = 'block';
        } else {
            codButton.style.display = 'none';
        }
    });

    // Handle Cash on Delivery button click
    document.getElementById('codButton').addEventListener('click', async function() {
        const selectedMethod = 'Cash on Delivery';
        const orderId = sessionStorage.getItem('currentOrderId');

        if (!orderId) {
            alert('Order ID not found. Please complete the checkout process first.');
            return;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}/paymentMethod`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentMethod: selectedMethod })
            });

            if (response.ok) {
                alert(`Processing payment with ${selectedMethod}...`);
                sessionStorage.removeItem('currentOrderId');
                window.location.href = 'ordersuccess.html';
            } else {
                const errorData = await response.json();
                alert('Failed to update payment method: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error updating payment method:', error);
            alert('An error occurred while processing your payment.');
        }
    });

    // Handle recommended Google Pay radio button selection
    document.getElementById('recommendedGooglePay').addEventListener('change', function() {
        const payButton = document.getElementById('recommendedPayButton');
        if (this.checked) {
            payButton.style.display = 'block';
        } else {
            payButton.style.display = 'none';
        }
    });

    // Handle recommended pay button click
    document.getElementById('recommendedPayButton').addEventListener('click', async function() {
        const selectedMethod = 'Recommended Google Pay'; // Assuming this is the method for this button
        const orderId = sessionStorage.getItem('currentOrderId');

        if (!orderId) {
            alert('Order ID not found. Please complete the checkout process first.');
            return;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}/paymentMethod`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentMethod: selectedMethod })
            });

            if (response.ok) {
                alert(`Processing payment with ${selectedMethod}...`);
                sessionStorage.removeItem('currentOrderId'); // Clear order ID after successful payment
                window.location.href = 'ordersuccess.html';
            } else {
                const errorData = await response.json();
                alert('Failed to update payment method: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error updating payment method:', error);
            alert('An error occurred while processing your payment.');
        }
    });
