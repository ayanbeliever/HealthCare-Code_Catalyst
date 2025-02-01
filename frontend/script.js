// JavaScript for AI-Based Energy Monitoring System

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Form validation for the Sign-Up section
  const form = document.querySelector('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission for demonstration purposes
  
    const email = form.querySelector('input[type="text"]').value.trim();
    const password = form.querySelector('input[type="password"]').value.trim();
    // const user = document.getElementById('user-type').value.trim();
    const params = new URLSearchParams(window.location.search);
    const user = params.get('user');
  
    if (email === '' || password === '') {
      alert('Please fill in all fields.');
      return;
    }
  
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    // alert('Sign-up successful! Thank you for joining.');
    fetch(`http://localhost:5000/api/${user}/login`, {   
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'credentials': 'include'
        },
        body: JSON.stringify({ email, password })
        })  
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log(data);
                if(user === 'agent') {
                    window.location.href = `./patient.html`;
                }
                else if(user === 'doctor') {
                    window.location.href = `./doctor2.html`;
                }
            }
        })
        .catch(error => {
            alert('An error occurred. Please try again later.', error.message);
        });
  });
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  function redirectToSignIn() {
    window.location.href = "./signin.html";
  }
  // Smooth scrolling for navigation links
  document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSection = document.querySelector(this.getAttribute('href'));
      targetSection.scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  // Slider Functionality
  
  // Duplicate slides for seamless loop
  const sliderItems = document.querySelectorAll('.slider-item');
  sliderItems.forEach(item => {
    const clone = item.cloneNode(true);
    sliderContainer.appendChild(clone);
  });
  
  
  
  
  
  
  
  
  
  
  
  
  const wrapper = document.querySelector('.wrapper')
  const registerLink = document.querySelector('.register-link')
  const loginLink = document.querySelector('.login-link')
  
  registerLink.onclick = () => {
      wrapper.classList.add('active')
  }
  
  loginLink.onclick = () => {
      wrapper.classList.remove('active')
  }   
  
  
  // Smooth scrolling to sections
  document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
  
        const targetSection = document.querySelector(this.getAttribute('href'));
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
  });