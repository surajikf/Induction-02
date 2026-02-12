console.log('Main.js loaded');

/**
 * Global Start App Function
 * Exposed for button onclick and external calls
 */
window.startApp = function (targetSection = 'intro') {
    console.log('Starting App... Target:', targetSection);
    const $hero = $('#hero-section');
    const $app = $('#app-shell');

    // Ensure elements exist
    if ($hero.length === 0 || $app.length === 0) {
        console.error('Critical Error: Hero or App Shell not found in DOM.');
        return;
    }

    // Creative "Smart" Effect: Confetti Burst on Start
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d9a417', '#ffffff'] // IKF Yellow & White
        });
    }

    $hero.fadeOut(600, () => {
        $hero.addClass('hidden');
        $app.removeClass('hidden').addClass('flex').hide().fadeIn(800);

        // Navigate
        if (window.AppNavigation && typeof window.AppNavigation.navigateTo === 'function') {
            window.AppNavigation.navigateTo(targetSection);
        } else {
            console.error('AppNavigation not initialized');
        }
    });
};

$(document).ready(async function () {
    try {
        console.log('Initializing App...');

        // 1. Check for existing state
        let state = null;
        if (window.AppStorage) {
            state = window.AppStorage.getState();
        }

        // 2. Initialize Navigation & Progress
        if (window.AppNavigation) await window.AppNavigation.init();
        if (window.AppProgress) window.AppProgress.init();

        // 3. Handle "Start Journey" Button (Redundant listener for safety)
        $(document).on('click', '#start-journey', function (e) {
            e.preventDefault();
            console.log('Start button clicked via listener');

            // Force start at intro as per user request
            window.startApp('intro');
        });

        // 4. Auto-resume logic (Only for deep links now)
        const initialHash = window.location.hash.substring(1);

        if (initialHash) {
            window.startApp(initialHash);
        }


        // 6. Mobile Sidebar Toggle
        $('#open-sidebar').on('click', function () {
            $('#sidebar').removeClass('-translate-x-full');
            $('#sidebar-overlay').fadeIn(300);
        });

        function closeMobileMenu() {
            $('#sidebar').addClass('-translate-x-full');
            $('#sidebar-overlay').fadeOut(300);
        }

        $('#close-sidebar, #sidebar-overlay').on('click', closeMobileMenu);

        // Close sidebar when clicking a nav link on mobile
        $(document).on('click', '.nav-link', function () {
            if (window.innerWidth < 1024) {
                closeMobileMenu();
            }
        });

        // 7. Hero Parallax Effect (Smart Interactivity)
        $(document).on('mousemove', '#hero-section', function (e) {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;


            // Move floating background icons with parallax effect
            $('#hero-section img[alt="LinkedIn"]').css('transform', `translate(${x * 1.5}px, ${y * 1.5}px)`);
            $('#hero-section img[alt="Facebook"]').css('transform', `translate(${x * 2}px, ${y * 2}px)`);
            $('#hero-section img[alt="Instagram"]').css('transform', `translate(${x * 1.8}px, ${y * 1.8}px)`);
            $('#hero-section img[alt="Heart"]').css('transform', `translate(${x * 1.3}px, ${y * 1.3}px)`);
            $('#hero-section img[alt="YouTube"]').css('transform', `translate(${x * 2.2}px, ${y * 2.2}px)`);
        });

        // 8. Smart Typing Effect for Hero Badge (Dynamic)
        const $badgeText = $('#hero-badge');
        if ($badgeText.length) {
            // Function to run typing effect
            const runTypingEffect = (text) => {
                $badgeText.text('');
                let charIndex = 0;
                function typeBadge() {
                    if (charIndex < text.length) {
                        $badgeText.text($badgeText.text() + text.charAt(charIndex));
                        charIndex++;
                        setTimeout(typeBadge, 80);
                    }
                }
                setTimeout(typeBadge, 500);
            };

            // If navigation already has data, run it. Otherwise wait.
            if (window.AppNavigation && window.AppNavigation.contentData) {
                runTypingEffect(window.AppNavigation.contentData.hero.badge || "Your Future Starts Here");
            } else {
                // Polling for data load if necessary, or default
                setTimeout(() => {
                    const dynamicText = window.AppNavigation?.contentData?.hero?.badge || "Your Future Starts Here";
                    runTypingEffect(dynamicText);
                }, 2000);
            }
        }

    } catch (error) {
        console.error('Error during App Initialization:', error);
    }
});
