document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. Gestion du Header et du défilement
    // =========================================
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        });
    }

    // =========================================
    // 2. Gestion du thème clair/sombre
    // =========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.add(currentTheme + '-theme');

        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            const newTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
        });
    }

    // =========================================
    // 3. Lazy loading pour les images
    // =========================================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            observer.observe(img);
        });
    } else {
        lazyImages.forEach(img => {
            img.classList.add('loaded');
        });
    }

    // =========================================
    // 4. Animation des éléments au défilement
    // =========================================
    const animateElements = document.querySelectorAll('[data-animate]');
    if ('IntersectionObserver' in window) {
        const animateObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.classList.add('is-visible');
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1
        });

        animateElements.forEach(el => {
            animateObserver.observe(el);
        });
    }

    // =========================================
    // 5. Gestion du formulaire de contact
    // =========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Fonction de validation du formulaire
        function validateForm() {
            let isValid = true;
            const requiredInputs = contactForm.querySelectorAll('[required]');
            const emailInput = document.getElementById('email');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const submitBtnText = submitBtn.querySelector('.btn-text');
            const submitBtnIcon = submitBtn.querySelector('.btn-icon');

            // Réinitialiser les erreurs
            contactForm.querySelectorAll('.form-control').forEach(input => {
                input.classList.remove('error');
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.style.display = 'none';
                }
            });

            // Vérifier les champs requis
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.style.display = 'block';
                    }
                    isValid = false;
                }
            });

            // Validation de l'email
            if (emailInput) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailInput.value.trim())) {
                    emailInput.classList.add('error');
                    const errorMsg = emailInput.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.textContent = 'Veuillez entrer une adresse email valide';
                        errorMsg.style.display = 'block';
                    }
                    isValid = false;
                }
            }

            return isValid;
        }

        // Gestion de la soumission du formulaire
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            if (!validateForm()) {
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const submitBtnText = submitBtn.querySelector('.btn-text');
            const submitBtnIcon = submitBtn.querySelector('.btn-icon');
            const formSuccess = document.getElementById('formSuccess');

            try {
                // Afficher l'état de chargement
                submitBtn.disabled = true;
                submitBtnText.textContent = 'Envoi en cours...';
                submitBtnIcon.innerHTML = '<div class="spinner"></div>';

                // Simuler l'envoi des données (à remplacer par un appel API réel)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Afficher le message de succès
                formSuccess.style.display = 'block';
                formSuccess.textContent = 'Votre message a bien été envoyé ! Je vous répondrai dès que possible.';
                formSuccess.style.opacity = '1';
                
                // Réinitialiser le formulaire
                contactForm.reset();
                
                // Cacher le message de succès après 5 secondes
                setTimeout(() => {
                    formSuccess.style.opacity = '0';
                    setTimeout(() => {
                        formSuccess.style.display = 'none';
                    }, 300);
                }, 5000);
                
            } catch (error) {
                console.error('Erreur lors de l\'envoi du formulaire:', error);
                formSuccess.textContent = 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.';
                formSuccess.style.display = 'block';
                formSuccess.style.color = '#e74c3c';
            } finally {
                // Réinitialiser le bouton d'envoi
                submitBtn.disabled = false;
                submitBtnText.textContent = 'Envoyer le message';
                submitBtnIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                `;
            }
        });

        // Gestion de la validation en temps réel
        contactForm.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.classList.remove('error');
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.style.display = 'none';
                    }
                }
            });
        });
    }

    // =========================================
    // 6. Gestion du filtre de projets (page project.html)
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.filter-btn--active').classList.remove('filter-btn--active');
                btn.classList.add('filter-btn--active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');

                    card.style.display = 'none';

                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'block';
                    }
                });
            });
        });
    }
});