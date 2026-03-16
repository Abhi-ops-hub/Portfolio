document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       HERO TYPEWRITER
       ========================================= */
    const typeWriterEl = document.querySelector('.typewriter-text');
    if (typeWriterEl) {
        const phrasesAttr = typeWriterEl.getAttribute('data-phrases');
        if (phrasesAttr) {
            const phrases = JSON.parse(phrasesAttr);
            let phraseIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            function typeHeroText() {
                const currentPhrase = phrases[phraseIndex];

                if (isDeleting) {
                    typeWriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typeWriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
                    charIndex++;
                }

                let typeSpeed = isDeleting ? 30 : 60;

                if (!isDeleting && charIndex === currentPhrase.length) {
                    typeSpeed = 2000; // Pause before deleting
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typeSpeed = 500; // Pause before typing next phrase
                }

                setTimeout(typeHeroText, typeSpeed);
            }

            setTimeout(typeHeroText, 500);
        }
    }

    /* =========================================
       DYNAMIC YEAR
       ========================================= */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* =========================================
       NAVBAR SCROLL EFFECT
       ========================================= */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* =========================================
       MOBILE MENU
       ========================================= */
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    /* =========================================
       SCROLL ANIMATIONS (Intersection Observer)
       ========================================= */
    // Simple polyfill for data-aos
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Handle AOS elements
                if (entry.target.hasAttribute('data-aos')) {
                    const animationType = entry.target.getAttribute('data-aos');
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;

                    entry.target.style.transition = `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`;

                    if (animationType === 'fade-up') entry.target.style.transform = 'translateY(0)';
                    if (animationType === 'fade-right') entry.target.style.transform = 'translateX(0)';
                    if (animationType === 'fade-left') entry.target.style.transform = 'translateX(0)';
                    if (animationType === 'zoom-in') entry.target.style.transform = 'scale(1)';

                    entry.target.style.opacity = '1';
                }

                // Handle Progress Bars
                if (entry.target.classList.contains('progress')) {
                    const width = entry.target.getAttribute('data-width');
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 300); // slight delay for visual effect
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial setup for AOS elements
    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach(el => {
        el.style.opacity = '0';
        const animationType = el.getAttribute('data-aos');
        if (animationType === 'fade-up') el.style.transform = 'translateY(40px)';
        if (animationType === 'fade-right') el.style.transform = 'translateX(-40px)';
        if (animationType === 'fade-left') el.style.transform = 'translateX(40px)';
        if (animationType === 'zoom-in') el.style.transform = 'scale(0.8)';
        scrollObserver.observe(el);
    });

    // Observe progress bars
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => scrollObserver.observe(bar));

    /* =========================================
       GITHUB API FETCH (Abhi-ops-hub)
       ========================================= */
    const githubUsername = 'Abhi-ops-hub';
    const projectsContainer = document.getElementById('github-projects');

    async function fetchGithubProjects() {
        try {
            // Fetch public repositories sorted by recently updated
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=3`);

            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }

            const repos = await response.json();

            // Clear loader
            projectsContainer.innerHTML = '';

            if (repos.length === 0) {
                projectsContainer.innerHTML = '<p class="loader-text">No public repositories found.</p>';
                return;
            }

            // Create cards for each repo
            repos.forEach((repo, index) => {
                // Avoid forks if possible or showcase them if preferred. Let's show all for now.
                const delay = index * 100;

                const card = document.createElement('div');
                card.className = 'project-card glass-panel';
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `all 0.6s ease ${delay}ms`;

                // Fallback description
                const desc = repo.description || 'No description provided. Check out the repository for more details.';

                // Topics/Languages fallback
                const language = repo.language ? `<span class="tech-tag">${repo.language}</span>` : '';

                card.innerHTML = `
                    <div class="project-header">
                        <i class="far fa-folder-open fa-2x" style="color: var(--accent-neon);"></i>
                        <div class="project-links">
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>&nbsp;&nbsp;` : ''}
                            <a href="${repo.html_url}" target="_blank" title="GitHub Repo"><i class="fab fa-github"></i></a>
                        </div>
                    </div>
                    <h3 class="project-title">${repo.name.replace(/-/g, ' ')}</h3>
                    <p class="project-desc">${desc}</p>
                    <div class="project-tech">
                        ${language}
                    </div>
                `;

                projectsContainer.appendChild(card);

                // Trigger animation shortly after insertion
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                });
            });

        } catch (error) {
            console.error('Error fetching GitHub projects:', error);
            projectsContainer.innerHTML = `
                <div class="loader-container">
                    <i class="fas fa-exclamation-triangle fa-2x" style="color: var(--accent-auto); margin-bottom: 1rem;"></i>
                    <p class="loader-text">Failed to sync with secure GitHub servers. Please try again later.</p>
                </div>
            `;
        }
    }

    // Initiate fetch
    fetchGithubProjects();

    /* =========================================
       TERMINAL ANIMATION
       ========================================= */
    const termContent = document.getElementById('terminal-content');
    if (termContent) {
        const commands = [
            { cmd: "sys.initialize()", res: "[OK] Core systems online." },
            { cmd: "load_modules --category=ai --target=automotive", res: "[LOADING] Neural networks, Computer Vision, Predictors..." },
            { cmd: "check_status()", res: "<span class='term-success'>All systems nominal. Ready to innovate.</span>" }
        ];

        let cmdIndex = 0;
        let charIndex = 0;

        function renderTerminal() {
            let html = '';
            for (let i = 0; i < cmdIndex; i++) {
                html += `<div class="terminal-line"><span class="term-prompt">abhi_ops@root:~$</span> <span class="term-command">${commands[i].cmd}</span></div>`;
                html += `<div class="term-response">${commands[i].res}</div>`;
            }

            if (cmdIndex < commands.length) {
                const currentCmd = commands[cmdIndex].cmd.substring(0, charIndex);
                html += `<div class="terminal-line"><span class="term-prompt">abhi_ops@root:~$</span> <span class="term-command">${currentCmd}</span><span class="term-cursor"></span></div>`;
            } else {
                html += `<div class="terminal-line"><span class="term-prompt">abhi_ops@root:~$</span> <span class="term-cursor"></span></div>`;
            }
            termContent.innerHTML = html;
        }

        function typeCommand() {
            if (cmdIndex < commands.length) {
                if (charIndex < commands[cmdIndex].cmd.length) {
                    charIndex++;
                    renderTerminal();
                    setTimeout(typeCommand, Math.random() * 40 + 40); // Typing speed
                } else {
                    // Finished typing command
                    setTimeout(() => {
                        cmdIndex++;
                        charIndex = 0;
                        renderTerminal();
                        setTimeout(typeCommand, 600); // Delay before next command
                    }, 300); // Delay before response
                }
            }
        }

        // Start animation when terminal comes into view
        const termObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(typeCommand, 800);
                termObserver.disconnect();
            }
        });

        const termSection = document.querySelector('.terminal-section');
        if (termSection) termObserver.observe(termSection);

        renderTerminal(); // Initial render with just cursor
    }

    /* =========================================
       CUSTOM DROPDOWN LOGIC
       ========================================= */
    const customSelectUi = document.querySelector('.custom-select-ui');
    const selectTrigger = document.querySelector('.select-trigger');
    const selectOptions = document.querySelectorAll('.select-option');
    const hiddenSelect = document.getElementById('subject');
    const selectedText = document.querySelector('.selected-text');

    if (customSelectUi && hiddenSelect) {
        // Toggle dropdown
        selectTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelectUi.classList.toggle('open');
        });

        // Handle option selection
        selectOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();

                // Remove selected class from all
                selectOptions.forEach(opt => opt.classList.remove('selected'));

                // Add selected class to clicked
                option.classList.add('selected');

                // Update text and value
                const value = option.getAttribute('data-value');
                const text = option.querySelector('span').innerText;

                selectedText.innerText = text;
                hiddenSelect.value = value;

                customSelectUi.classList.remove('open');
                customSelectUi.classList.add('has-value');

                // Trigger change event for native select just in case
                hiddenSelect.dispatchEvent(new Event('change'));
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!customSelectUi.contains(e.target)) {
                customSelectUi.classList.remove('open');
            }
        });

        // Handle keyboard navigation (basic)
        customSelectUi.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                customSelectUi.classList.toggle('open');
            } else if (e.key === 'Escape') {
                customSelectUi.classList.remove('open');
            }
        });
    }

    /* =========================================
       CONTACT FORM SUBMIT
       ========================================= */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const toast = document.getElementById('toast');

    // Email validation RegEx
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Custom Email Validation
        if (data.email) data.email = data.email.trim();
        if (!emailRegex.test(data.email)) {
            formStatus.textContent = "please provide a valid email address";
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            return; // Stop form submission
        }

        // Disable button during "sending"
        const btn = contactForm.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Transmitting...</span> <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        // Add FormSubmit specific configurations programmatically
        data._captcha = "false";
        data._template = "table";
        // Make the email subject unique so Gmail doesn't group or block them as spam
        data._subject = `Portfolio Message from ${data.name || 'User'} - ${data.subject || 'Contact'}`;

        try {
            // Setup a timeout so the "lagging" doesn't freeze the page forever
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s wait maximum

            const response = await fetch("https://formsubmit.co/ajax/abhi.pvt2523@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                // Show toast for 2 seconds
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);

                contactForm.reset();
                formStatus.style.display = 'none';
            } else {
                throw new Error('Server returned an error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            formStatus.textContent = error.name === 'AbortError'
                ? 'Transmission timed out. Please try again.'
                : 'Transmission failed. Please check connection and try again.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
        }

        btn.innerHTML = originalText;
    });

    /* =========================================
       ABOUT SECTION PHOTO SLIDER
       ========================================= */
    const slides = document.querySelectorAll('.slider-img');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 1000);
    }
});
