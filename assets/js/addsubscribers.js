async function handleSubscribe() {
    // Get the email input element
    const emailInput = document.querySelector('input[placeholder="Enter Your Email here"]');
    const email = emailInput.value.trim();
  
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
  
    try {
      const response = await fetch('https://kist-park-admin.onrender.com/api/v1/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Thank you for subscribing!');
        emailInput.value = ''; // Clear the input field
      } else {
        alert(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to subscribe. Please try again later.');
    }
  }