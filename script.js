document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-number');

    // Intersection Observer options
    const options = {
        root: null,
        threshold: 0.5,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                const suffix = target.getAttribute('data-suffix') || '';
                animateValue(target, 0, endValue, 2000, suffix);
                observer.unobserve(target);
            }
        });
    }, options);

    stats.forEach(stat => {
        observer.observe(stat);
    });

    function animateValue(obj, start, end, duration, suffix) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            obj.innerHTML = Math.floor(easeOutQuart * (end - start) + start) + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Service Card Infinite Scroll Logic



    // Brand Logo Infinite Scroll Logic
    const brandTrack = document.querySelector('.brand-track');
    if (brandTrack) {
        brandTrack.innerHTML += brandTrack.innerHTML;
    }

    // Mobile Menu Toggle Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon between bars and xmark if FontAwesome is available
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close menu when a link is clicked
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }
});

// General Scroll Animations
const animatedElements = document.querySelectorAll('.animate-on-scroll');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.1 });

animatedElements.forEach(el => scrollObserver.observe(el));


// Footer Reveal Logic
const footer = document.querySelector('footer');
const main = document.querySelector('main');

function updateFooterReveal() {
    if (footer && main) {
        main.style.marginBottom = `${footer.offsetHeight}px`;
    }
}

// Initial call
updateFooterReveal();

// Update on resize
// Update on resize
window.addEventListener('resize', updateFooterReveal);


// Smart Scroll Header Logic
let lastScrollTop = 0;
const headerElement = document.querySelector('header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scroll Down
        headerElement.classList.add('header-hidden');
    } else {
        // Scroll Up
        headerElement.classList.remove('header-hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling



    // Services Page Interaction - Mouse Follow Image & Dropdown Toggle
    const serviceRows = document.querySelectorAll('.service-row');

    if (serviceRows.length > 0) {
        serviceRows.forEach(row => {
            const image = row.querySelector('.service-hover-img');

            // Hover based Dropdown Toggle & Image Reveal
            row.addEventListener('mouseenter', () => {
                image.classList.add('active');
                row.classList.add('active'); // Expand dropdown
            });

            row.addEventListener('mouseleave', () => {
                image.classList.remove('active');
                row.classList.remove('active'); // Collapse dropdown
            });

            row.addEventListener('mousemove', (e) => {
                // Get mouse position
                const x = e.clientX;
                const y = e.clientY;

                // Center the image on the cursor
                image.style.left = `${x}px`;
                image.style.top = `${y}px`;
            });
        });
    }
});

// Timeline Scroll Animation
window.addEventListener('scroll', () => {
    const timelineContainer = document.querySelector('.process-steps');
    const timelineProgress = document.querySelector('.timeline-progress');
    const steps = document.querySelectorAll('.process-step');

    if (timelineContainer && timelineProgress) {
        const containerRect = timelineContainer.getBoundingClientRect();
        const containerTop = containerRect.top + window.scrollY;
        const containerHeight = timelineContainer.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        // Start filling when the top of the container reaches the middle of the viewport
        // Or when the container enters the viewport?
        // Let's say: Fill starts when container top is at 70% of viewport height (near bottom)
        const triggerPoint = windowHeight * 0.7;

        // Calculate how far we've scrolled past the start of the container relative to the trigger point
        // distanceScrolled = (scrollY + triggerPoint) - containerTop
        let scrollDist = (scrollY + triggerPoint) - containerTop;

        let timelineHeight = containerHeight;

        // Check for Let's Connect Card to limit timeline height
        const connectCard = document.querySelector('.lets-connect-card');
        if (connectCard) {
            timelineHeight = connectCard.offsetTop;
            // Also limit the background line height
            const timelineLine = document.querySelector('.timeline-line');
            if (timelineLine) {
                timelineLine.style.height = `${timelineHeight}px`;
            }
        }

        // Calculate progress based on scroll position relative to the timeline height
        // We want the line to fill as we scroll down to the card
        let progressPercent = (scrollDist / timelineHeight) * 100;

        // Clamp between 0 and 100
        progressPercent = Math.max(0, Math.min(100, progressPercent));

        // Use pixel height for precision if needed, or percent of the LIMITED height
        // timelineProgress is absolutely positioned in container. 
        // If we use %, it is % of container.
        // We want % of the LIMITED timelineHeight.
        // So: (progressPercent / 100) * timelineHeight

        const progressPx = (progressPercent / 100) * timelineHeight;
        timelineProgress.style.height = `${progressPx}px`;

        // Activate steps
        steps.forEach(step => {
            // Check if loop progress height exceeds step's offsetTop
            // Use calculated progressPx for consistent comparison
            if (progressPx > step.offsetTop) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Activate Let's Connect Card
        if (connectCard) {
            // Activate when line essentially reaches the card (near the top)
            // Use a small threshold to ensure activation
            if (progressPx >= (connectCard.offsetTop - 5)) {
                connectCard.classList.add('active');
            } else {
                connectCard.classList.remove('active');
            }
        }
    }
});
