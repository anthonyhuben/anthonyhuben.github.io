// Shared behavior for the multi-page portfolio

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    const normalizePath = (pathname) => {
        const trimmed = pathname.replace(/\/+$/, '');
        if (!trimmed) {
            return 'index.html';
        }

        const fileName = trimmed.split('/').pop();
        return fileName || 'index.html';
    };

    const setDarkMode = (enabled) => {
        body.classList.toggle('dark-mode', enabled);
        localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');

        if (darkModeToggle) {
            darkModeToggle.setAttribute('aria-pressed', String(enabled));
        }
    };

    if (localStorage.getItem('darkMode') !== 'disabled') {
        body.classList.add('dark-mode');
    }

    if (darkModeToggle) {
        darkModeToggle.setAttribute('aria-pressed', String(body.classList.contains('dark-mode')));
        darkModeToggle.addEventListener('click', () => {
            setDarkMode(!body.classList.contains('dark-mode'));
        });
    }

    if (navbar) {
        const handleScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    if (navToggle && navLinks) {
        navToggle.setAttribute('aria-expanded', 'false');

        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const currentPage = normalizePath(window.location.pathname);

    document.querySelectorAll('.nav-links a').forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) {
            return;
        }

        const linkPath = normalizePath(new URL(href, window.location.href).pathname);
        const isActive = linkPath === currentPage;

        if (isActive) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length && projectCards.length) {
        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                filterBtns.forEach((button) => button.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach((card) => {
                    if (filter === 'all') {
                        card.classList.remove('hidden');
                        return;
                    }

                    const categories = card.getAttribute('data-category') || '';
                    if (categories.includes(filter)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    const revealElements = document.querySelectorAll(
        '.page-card, .page-hero-card, .about-grid, .upcoming-card, .project-card, .github-card, .timeline-item, .education-card, .contact-card, .art-card, .article-card'
    );

    revealElements.forEach((element) => element.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px',
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add('visible'));
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
