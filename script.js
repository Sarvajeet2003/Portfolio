// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after page loads
    const loader = document.querySelector('.loader');
    if (loader) {
        // Hide loader after a short delay
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            // Remove loader from DOM after transition completes
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 800);
    }

    // Initialize animations
    initAnimations();

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon && icon.classList.contains('fa-times')) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');

    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            updateThemeIcon(true);
        }

        themeToggle.addEventListener('click', function() {
            const isLightMode = document.body.classList.toggle('light-mode');
            updateThemeIcon(isLightMode);

            // Save theme preference
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        });
    }

    // Update theme toggle icon
    function updateThemeIcon(isLightMode) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (isLightMode) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }

    // Project filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                // Add animation to cards
                projectCards.forEach(card => {
                    card.classList.add('filter-transition');
                    
                    setTimeout(() => {
                        if (filter === 'all') {
                            card.style.display = 'flex';
                        } else if (card.classList.contains(filter)) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                        
                        setTimeout(() => {
                            card.classList.remove('filter-transition');
                        }, 300);
                    }, 300);
                });
            });
        });
    }

    // Project modal functionality
    const viewDetailsBtns = document.querySelectorAll('.view-details');
    const projectModal = document.querySelector('.project-modal');
    const closeModal = document.querySelector('.close-modal');

    if (viewDetailsBtns.length > 0 && projectModal && closeModal) {
        viewDetailsBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get project details
                const projectCard = this.closest('.project-card');
                const projectTitle = projectCard.querySelector('h3').textContent;
                const projectDesc = projectCard.querySelector('p').textContent;
                
                // Update modal content
                const modalTitle = projectModal.querySelector('h2');
                const modalDesc = projectModal.querySelector('.modal-description p');
                
                if (modalTitle) modalTitle.textContent = projectTitle;
                if (modalDesc) modalDesc.textContent = projectDesc;
                
                // Show modal
                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        closeModal.addEventListener('click', function() {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside content
        projectModal.addEventListener('click', function(e) {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                projectModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Custom cursor
    const cursor = document.querySelector('.custom-cursor');

    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mousedown', function() {
            cursor.classList.add('active');
        });

        document.addEventListener('mouseup', function() {
            cursor.classList.remove('active');
        });
        
        // Add hover effect to links and buttons
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    // Skill level animation
    const skillLevels = document.querySelectorAll('.skill-level-fill');

    if (skillLevels.length > 0) {
        skillLevels.forEach(level => {
            const width = level.getAttribute('data-level') || '80%';

            // Set initial width to 0
            level.style.width = '0';

            // Create intersection observer
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animate width when visible
                        setTimeout(() => {
                            level.style.width = width;
                        }, 200);
                        // Stop observing after animation
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(level);
        });
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all required fields', 'error');
                return;
            }
            
            // Here you would normally send the data to a server
            // For demo purposes, we'll just show a success message
            showFormMessage('Thank you for your message! I will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Function to show form messages
    function showFormMessage(message, type) {
        // Check if message element already exists
        let messageEl = document.querySelector('.form-message');
        
        // If not, create one
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'form-message';
            contactForm.appendChild(messageEl);
        }
        
        // Set message and class
        messageEl.textContent = message;
        messageEl.className = `form-message ${type}`;
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
    
    // Add active class to nav links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// Initialize animations
function initAnimations() {
    // Scroll reveal animation
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    if (scrollRevealElements.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        scrollRevealElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Add scroll-reveal class to all sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (!section.classList.contains('scroll-reveal')) {
            section.classList.add('scroll-reveal');
            observer.observe(section);
        }
    });
}