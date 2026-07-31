const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const currentYear = document.getElementById("currentYear");

/* =========================
   MOBILE MENU
========================= */

if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
        const menuIsOpen = navLinks.classList.toggle("active");

        menuButton.setAttribute(
            "aria-expanded",
            menuIsOpen.toString()
        );

        menuButton.textContent = menuIsOpen ? "✕" : "☰";
    });

    const menuLinks = navLinks.querySelectorAll("a");

    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.textContent = "☰";
        });
    });
}

/* =========================
   CURRENT YEAR
========================= */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* =========================
   PROJECT CAROUSEL
========================= */

const projectTrack = document.getElementById("projectTrack");
const previousProject = document.getElementById("previousProject");
const nextProject = document.getElementById("nextProject");

function getProjectScrollDistance() {
    if (!projectTrack) {
        return 380;
    }

    const firstProject = projectTrack.querySelector(".project-card");

    if (!firstProject) {
        return 380;
    }

    const projectWidth = firstProject.getBoundingClientRect().width;
    const trackStyle = window.getComputedStyle(projectTrack);
    const gap = parseFloat(trackStyle.columnGap) || 22;

    return projectWidth + gap;
}

function updateCarouselButtons() {
    if (!projectTrack || !previousProject || !nextProject) {
        return;
    }

    const maximumScroll =
        projectTrack.scrollWidth - projectTrack.clientWidth;

    previousProject.disabled = projectTrack.scrollLeft <= 5;

    nextProject.disabled =
        projectTrack.scrollLeft >= maximumScroll - 5;
}

if (projectTrack && previousProject && nextProject) {
    previousProject.addEventListener("click", () => {
        projectTrack.scrollBy({
            left: -getProjectScrollDistance(),
            behavior: "smooth"
        });
    });

    nextProject.addEventListener("click", () => {
        projectTrack.scrollBy({
            left: getProjectScrollDistance(),
            behavior: "smooth"
        });
    });

    projectTrack.addEventListener(
        "scroll",
        updateCarouselButtons,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        updateCarouselButtons
    );

    updateCarouselButtons();
}

/* =========================
   ACTIVE NAVIGATION LINK
========================= */

const sections = document.querySelectorAll(
    "main section[id]"
);

const navigationAnchors = document.querySelectorAll(
    '.nav-links a[href^="#"]'
);

function updateActiveNavigation() {
    let activeSectionId = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 140;
        const sectionBottom =
            sectionTop + section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {
            activeSectionId = section.id;
        }
    });

    navigationAnchors.forEach((link) => {
        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${activeSectionId}`
        ) {
            link.classList.add("active");
        }
    });
}

window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

updateActiveNavigation();

/* =========================
   REPEATING SCROLL REVEAL
========================= */

const revealElements = document.querySelectorAll(
    "main .section, .hero-service-cards, .contact-section, .footer"
);

revealElements.forEach((element) => {
    element.classList.add("scroll-reveal");
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            } else {
                entry.target.classList.remove("is-visible");
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

/* =========================
   RESET TOUCH LINK STATES
========================= */

const isTouchDevice = window.matchMedia(
    "(hover: none), (pointer: coarse)"
).matches;

function resetTouchStates() {
    if (!isTouchDevice) {
        return;
    }

    /* Remove focus from the previously pressed link */

    if (
        document.activeElement &&
        typeof document.activeElement.blur === "function"
    ) {
        document.activeElement.blur();
    }

    /* Remove navigation active states on tablet and mobile */

    document
        .querySelectorAll(".nav-links a.active")
        .forEach((link) => {
            link.classList.remove("active");
        });
}

/* Runs when returning from TikTok, Instagram or another app */

window.addEventListener("pageshow", resetTouchStates);

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        resetTouchStates();
    }
});

window.addEventListener("focus", resetTouchStates);

/* Remove focus immediately after tapping a link */

document
    .querySelectorAll("a")
    .forEach((link) => {
        link.addEventListener("click", () => {
            if (isTouchDevice) {
                setTimeout(() => {
                    link.blur();
                }, 100);
            }
        });
    });