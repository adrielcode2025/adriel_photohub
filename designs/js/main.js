/**
 * Adriel Photohub - Main JavaScript
 * Handles navigation, form validation, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    initSmoothScroll();
    initFormValidation();
    initDateConstraints();
    initTestimonialSlider();
});

/* =========================================
   1. MOBILE NAVIGATION TOGGLE
   ========================================= */
function initMobileNavigation() {
    const nav = document.querySelector('header nav');
    const headerContainer = document.querySelector('header div');

    // Create the hamburger button dynamically
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '&#9776;'; // Hamburger icon
    toggleBtn.className = 'mobile-menu-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle Navigation');
    
    // Style the button to match the theme (Uses CSS Variables)
    toggleBtn.style.display = 'none'; 
    toggleBtn.style.background = 'transparent';
    toggleBtn.style.border = 'none';
    toggleBtn.style.color = 'var(--color-primary)'; // Changed to match theme text
    toggleBtn.style.fontSize = '2rem';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.padding = '0';
    toggleBtn.style.boxShadow = 'none'; // Remove button shadow if present

    if (headerContainer && nav) {
        headerContainer.appendChild(toggleBtn);

        const checkMobile = () => {
            if (window.innerWidth <= 768) {
                toggleBtn.style.display = 'block';
                nav.querySelector('ul').style.display = 'none';
            } else {
                toggleBtn.style.display = 'none';
                nav.querySelector('ul').style.display = 'flex';
                // Reset styles if switching back to desktop
                nav.querySelector('ul').style.position = 'static';
                nav.querySelector('ul').style.flexDirection = 'row';
                nav.querySelector('ul').style.backgroundColor = 'transparent';
                nav.querySelector('ul').style.width = 'auto';
                nav.querySelector('ul').style.padding = '0';
                nav.querySelector('ul').style.boxShadow = 'none';
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Toggle Logic
        toggleBtn.addEventListener('click', () => {
            const ul = nav.querySelector('ul');
            const isHidden = ul.style.display === 'none';
            
            if (isHidden) {
                ul.style.display = 'flex';
                ul.style.flexDirection = 'column';
                ul.style.position = 'absolute';
                ul.style.top = '80px'; /* Matches header height */
                ul.style.left = '0';
                ul.style.width = '100%';
                
                // UPDATED: Uses CSS Variable for background (White)
                ul.style.backgroundColor = 'var(--color-secondary)'; 
                
                ul.style.padding = '30px';
                ul.style.gap = '20px';
                ul.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
                ul.style.borderBottom = '1px solid #eee';
                ul.style.zIndex = '999';
            } else {
                ul.style.display = 'none';
            }
        });
    }
}

/* =========================================
   2. SMOOTH SCROLLING
   ========================================= */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    const navUl = document.querySelector('header nav ul');
                    if (navUl) navUl.style.display = 'none';
                }
            }
        });
    });
}

/* =========================================
   3. DATE VALIDATION
   ========================================= */
function initDateConstraints() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        dateInput.addEventListener('change', (e) => {
            if (e.target.value < today) {
                alert('Please select a future date for your session.');
                e.target.value = '';
            }
        });
    }
}

/* =========================================
   4. FORM VALIDATION
   ========================================= */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const errors = [];

            // Simple validation checks...
            const nameInput = form.querySelector('input[name="fullname"], input[name="name"]');
            if (nameInput && nameInput.value.trim().length < 2) {
                isValid = false;
                highlightError(nameInput, true);
                errors.push("Name must be at least 2 characters.");
            } else if (nameInput) highlightError(nameInput, false);

            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                isValid = false;
                highlightError(emailInput, true);
                errors.push("Invalid email address.");
            } else if (emailInput) highlightError(emailInput, false);

            if (isValid) {
                showSuccessMessage(form);
            } else {
                alert("Please check the form:\n- " + errors.join("\n- "));
            }
        });
    });
}

function highlightError(element, isError) {
    element.style.borderColor = isError ? "var(--color-accent)" : "#ddd";
    element.style.borderBottomColor = isError ? "var(--color-accent)" : "#ddd";
}

function showSuccessMessage(form) {
    const originalContent = Array.from(form.children);
    originalContent.forEach(child => child.style.display = 'none');

    const successDiv = document.createElement('div');
    successDiv.style.textAlign = 'center';
    successDiv.style.padding = '40px';
    
    // UPDATED: Success message now uses Theme Colors
    successDiv.innerHTML = `
        <h3 style="color: var(--color-primary); font-weight:300;">Request Received</h3>
        <p style="color: #666;">Thank you. I will be in touch shortly.</p>
        <button type="button" onclick="location.reload()" style="
            background-color: var(--color-accent); 
            color: white; 
            border: none; 
            padding: 12px 30px; 
            border-radius: 30px; 
            cursor: pointer; 
            margin-top: 20px;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;">
            Return
        </button>
    `;

    form.appendChild(successDiv);
}

/* =========================================
   5. TESTIMONIAL SLIDER
   ========================================= */
function initTestimonialSlider() {
    const container = document.querySelector('.testimonial-grid');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (!container || cards.length === 0) return;

    let currentIndex = 0;
    let autoSlideInterval;

    // Reset styles for slider mode
    cards.forEach((card, index) => {
        card.style.display = index === 0 ? 'block' : 'none';
        card.classList.remove('active');
    });
    // Tiny timeout to ensure display:block applies before opacity transition
    setTimeout(() => {
        if(cards[0]) cards[0].classList.add('active');
    }, 50);

    // Create Buttons
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&#10094;'; 
    prevBtn.className = 'slider-btn prev-btn';

    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&#10095;'; 
    nextBtn.className = 'slider-btn next-btn';

    container.appendChild(prevBtn);
    container.appendChild(nextBtn);

    const showSlide = (index) => {
        if (index >= cards.length) currentIndex = 0;
        else if (index < 0) currentIndex = cards.length - 1;
        else currentIndex = index;

        cards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('active');
        });
        
        cards[currentIndex].style.display = 'block';
        setTimeout(() => {
            cards[currentIndex].classList.add('active');
        }, 10);
    };

    const nextSlide = () => showSlide(currentIndex + 1);
    const prevSlide = () => showSlide(currentIndex - 1);

    nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

    function startTimer() { autoSlideInterval = setInterval(nextSlide, 5000); }
    function resetTimer() { clearInterval(autoSlideInterval); startTimer(); }

    startTimer();
}