/* ============================================================
   PETAR STEVKOVSKI — PERSONAL WEBSITE
   JavaScript: scroll reveals, navbar state, mobile menu, active link
   ============================================================ */

(function () {
    'use strict';

    // ─── Scroll Reveal (IntersectionObserver) ───────────────────
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target); // animate once
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        reveals.forEach((el) => revealObserver.observe(el));
    } else {
        // Fallback: show everything immediately
        reveals.forEach((el) => el.classList.add('visible'));
    }

    // ─── Navbar Scroll State ────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 40);
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    updateNavbar();

    // ─── Active Nav Link on Scroll ──────────────────────────────
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        navLinks.forEach((link) => {
                            link.classList.toggle(
                                'active',
                                link.dataset.section === id
                            );
                        });
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 56}px 0px -35% 0px`
            }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    // ─── Mobile Menu ────────────────────────────────────────────
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksList = document.querySelector('.nav-links');
    navLinksList.inert = window.innerWidth <= 768;

    // Create overlay element for mobile
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    function openMenu() {
        navLinksList.classList.add('open');
        navLinksList.inert = false;
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close navigation menu');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navLinksList.classList.remove('open');
        navLinksList.inert = window.innerWidth <= 768;
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        const isOpen = navLinksList.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    navToggle.addEventListener('click', toggleMenu);

    // Close menu when overlay is tapped
    overlay.addEventListener('click', closeMenu);

    // Close menu on nav link click
    navLinksList.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    document.querySelector('.navbar-brand').addEventListener('click', closeMenu);

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinksList.classList.contains('open')) {
            closeMenu();
            navToggle.focus();
        }
    });

    // ─── Smooth Scroll for Nav Links ────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                // Update URL without scroll jump
                history.pushState(null, '', targetId);
            }
        });
    });

})();
