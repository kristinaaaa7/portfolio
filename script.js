/* ============================================
   SCRAPBOOK PORTFOLIO — JAVASCRIPT
   Mobile menu, dark mode, filters, lightbox,
   contact form, animations and more!
============================================ */

document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // 1. SELECT ELEMENTS
    // =========================================

    const body = document.body;
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const themeToggle = document.querySelector(".theme-toggle");
    const toast = document.querySelector(".toast");


    // =========================================
    // 2. TOAST NOTIFICATIONS
    // =========================================

    let toastTimer;

    function showToast(message) {
        if (!toast) {
            alert(message);
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    // =========================================
    // 3. MOBILE NAVIGATION
    // =========================================

    if (menuToggle && navLinks) {

        function closeMenu() {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
            menuToggle.textContent = "☰";
        }

        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        // Close menu after clicking a navigation link.
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        // Close menu when clicking outside it.
        document.addEventListener("click", event => {
            if (
                navLinks.classList.contains("open") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Close the mobile menu when switching to desktop.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });

    }


    // =========================================
    // 4. DARK MODE TOGGLE
    // =========================================

    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "dark") {
        body.classList.add("dark-theme");
    }

    function updateThemeButton() {
        if (!themeToggle) return;

        const darkMode = body.classList.contains("dark-theme");

        themeToggle.textContent = darkMode ? "☀️" : "🌙";

        themeToggle.setAttribute(
            "aria-label",
            darkMode ? "Switch to light mode" : "Switch to dark mode"
        );

        themeToggle.setAttribute("title", darkMode ? "Light mode" : "Dark mode");
    }

    updateThemeButton();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {

            body.classList.toggle("dark-theme");

            const darkMode = body.classList.contains("dark-theme");

            localStorage.setItem(
                "portfolio-theme",
                darkMode ? "dark" : "light"
            );

            updateThemeButton();

            showToast(
                darkMode
                    ? "Night mode activated 🌙"
                    : "Hello, sunshine! ☀️"
            );

        });
    }


    // =========================================
    // 5. CURRENT YEAR IN FOOTER
    // =========================================

    const yearElement = document.querySelector("#current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // =========================================
    // 6. PROJECT FILTERS
    // =========================================

    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedFilter = button.dataset.filter;

            // Update the active filter button.
            filterButtons.forEach(filterButton => {
                filterButton.classList.remove("active");
                filterButton.setAttribute("aria-pressed", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            // Show or hide matching projects.
            projectCards.forEach(card => {

                const category = card.dataset.category;

                const shouldShow =
                    selectedFilter === "all" ||
                    category === selectedFilter;

                card.hidden = !shouldShow;

            });

        });

    });


    // =========================================
    // 7. IMAGE LIGHTBOX
    // =========================================

    const lightbox = document.querySelector(".lightbox");
    const lightboxImage = lightbox?.querySelector("img");
    const lightboxClose = lightbox?.querySelector(".lightbox-close");

    let previousFocus = null;

    function openLightbox(image) {

        if (!lightbox || !lightboxImage) return;

        previousFocus = document.activeElement;

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt || "Portfolio image";

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");

        body.classList.add("no-scroll");

        lightboxClose?.focus();

    }

    function closeLightbox() {

        if (!lightbox) return;

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        body.classList.remove("no-scroll");

        if (lightboxImage) {
            lightboxImage.removeAttribute("src");
        }

        previousFocus?.focus();

    }

    // Only images with the "lightbox-image" class are clickable.
    document.querySelectorAll(".lightbox-image").forEach(image => {

        image.style.cursor = "zoom-in";

        image.addEventListener("click", () => {
            openLightbox(image);
        });

        image.addEventListener("keydown", event => {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(image);
            }

        });

    });

    lightboxClose?.addEventListener("click", closeLightbox);

    lightbox?.addEventListener("click", event => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });


    // =========================================
    // 8. KEYBOARD CONTROLS
    // =========================================

    document.addEventListener("keydown", event => {

        // Close the lightbox with Escape.
        if (
            event.key === "Escape" &&
            lightbox?.classList.contains("active")
        ) {
            closeLightbox();
        }

        // Close the mobile navigation with Escape.
        if (
            event.key === "Escape" &&
            navLinks?.classList.contains("open")
        ) {
            navLinks.classList.remove("open");

            menuToggle?.setAttribute("aria-expanded", "false");

            if (menuToggle) {
                menuToggle.textContent = "☰";
            }
        }

    });


    // =========================================
    // 9. SCROLL REVEAL ANIMATIONS
    // =========================================

    const revealElements = document.querySelectorAll("[data-reveal]");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("revealed");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("revealed");
        });

    }


    // =========================================
    // 10. CONTACT FORM VALIDATION
    // =========================================

    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {

        contactForm.addEventListener("submit", event => {

            event.preventDefault();

            const nameInput = contactForm.querySelector(
                '[name="name"]'
            );

            const emailInput = contactForm.querySelector(
                '[name="email"]'
            );

            const messageInput = contactForm.querySelector(
                '[name="message"]'
            );

            if (!nameInput || !emailInput || !messageInput) {
                showToast("Please check your contact form fields.");
                return;
            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !email || !message) {
                showToast("Please fill in all the fields. 💌");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                showToast("Please enter a valid email address.");
                emailInput.focus();
                return;
            }

            /*
             * IMPORTANT:
             * This form only validates the information.
             * It does not send emails without a backend
             * or a connected form service.
             */

            showToast(
                "Your form looks good! Connect an email service to send it. 💌"
            );

        });

    }


    // =========================================
    // 11. SMOOTH SCROLL FOR INTERNAL LINKS
    // =========================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                event.preventDefault();
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                // Update the URL hash without jumping.
                history.replaceState(null, "", targetId);

            }

        });

    });


    // =========================================
    // 12. PROJECT LINK PLACEHOLDERS
    // =========================================

    document.querySelectorAll("[data-placeholder-link]").forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            showToast(
                "Add your actual project or GitHub link here! 💻"
            );

        });

    });


    // =========================================
    // 13. CURRENT NAVIGATION HIGHLIGHT
    // =========================================

    const sections = document.querySelectorAll("main section[id]");
    const navigationLinks = document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

    if ("IntersectionObserver" in window && sections.length) {

        const sectionObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const currentId = entry.target.id;

                    navigationLinks.forEach(link => {

                        const isCurrent =
                            link.getAttribute("href") === `#${currentId}`;

                        link.classList.toggle("current-section", isCurrent);

                    });

                });

            },
            {
                rootMargin: "-25% 0px -65% 0px"
            }
        );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    // =========================================
    // 14. BACK-TO-TOP BUTTON
    // =========================================

    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {

        backToTop.addEventListener("click", event => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // =========================================
    // 15. IMAGE ERROR HANDLING
    // =========================================

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            // Avoid repeatedly handling the same failed image.
            if (image.dataset.errorHandled === "true") return;

            image.dataset.errorHandled = "true";

            image.style.display = "none";

            const placeholder = document.createElement("div");

            placeholder.className = "image-placeholder";

            const label =
                image.dataset.placeholder ||
                image.alt ||
                "Your photo goes here";

            placeholder.innerHTML = `
                <div>
                    <span aria-hidden="true">🌷</span>
                    ${escapeHTML(label)}
                </div>
            `;

            image.insertAdjacentElement("afterend", placeholder);

        });

    });


    // Safely escape text inserted into the image placeholder.
    function escapeHTML(text) {

        return String(text).replace(/[&<>"']/g, character => {

            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return characters[character];

        });

    }


    // =========================================
    // 16. WELCOME MESSAGE IN CONSOLE
    // =========================================

    console.log(
        "%c🌷 Welcome to my little corner of the internet! 💗",
        "color: #c87591; font-size: 16px; font-weight: bold;"
    );

    console.log(
        "%cMade with HTML, CSS, JavaScript and lots of creativity.",
        "color: #777b4c; font-size: 12px;"
    );

});