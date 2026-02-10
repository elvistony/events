let isPlaying = false;
let isMuted = false;
let autoScrollThrottle;
let currentAnimationId = null;
let isUserInteracting = false;

// Configuration
const DEFAULT_DWELL_TIME = 10; // seconds

function togglePlay() {
    isPlaying = !isPlaying;
    const playIcon = document.getElementById('playIcon');
    
    if (isPlaying) {
        playIcon.className = 'fa fa-pause';
        playIcon.parentElement.classList.add('burgundy')
        startSlideshow();
    } else {
        playIcon.className = 'fa fa-play';
        playIcon.parentElement.classList.remove('burgundy')
        stopSlideshow();
    }
}

function toggleSound(){
    isMuted = !isMuted;
    const playSound = document.getElementById('playSound');
    
    if (!isMuted) {
        playSound.className = 'fa fa-volume-up';
        document.getElementById('bgm').volume=1
    } else {
        playSound.className = 'fa fa-volume-off';
        document.getElementById('bgm').volume=0
    }
}

function stopSlideshow() {
    isPlaying = false;
    document.getElementById('playIcon').className = 'fa fa-play';
    if (currentAnimationId) cancelAnimationFrame(currentAnimationId);
}

async function startSlideshow() {
    if (!isPlaying) return;

    // 1. Find the section currently most visible in the viewport
    const sections = Array.from(document.querySelectorAll('.page-section'));
    const currentSection = sections.find(sec => {
        const rect = sec.getBoundingClientRect();
        return rect.bottom > 100; // Returns the first section that hasn't scrolled away
    }) || sections[0];

    if (!currentSection) return;

    const dwellTime = parseInt(currentSection.getAttribute('data-dwelltime')) || DEFAULT_DWELL_TIME;
    const durationMs = dwellTime * 1000;

    // 2. Determine scroll logic
    const rect = currentSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionHeight = rect.height;
    
    // Target: The point where the bottom of the div meets the bottom of the screen
    // Distance to scroll is current scroll position + (bottom of element - viewport height)
    const startScroll = window.pageYOffset;
    const targetScroll = startScroll + rect.bottom - viewportHeight;
    const distance = targetScroll - startScroll;

    // 3. Perform the scroll/wait
    if (distance > 0) {
        // Section is taller than screen: Scroll slowly over the duration
        await animateScroll(startScroll, targetScroll, durationMs);
    } else {
        // Section is small: Just wait the duration
        await new Promise(resolve => {
            const timeout = setTimeout(resolve, durationMs);
            // Check every 100ms if we should stop
            const checkStop = setInterval(() => {
                if (!isPlaying) {
                    clearTimeout(timeout);
                    clearInterval(checkStop);
                }
            }, 100);
        });
    }

    // 4. Move to next section
    if (isPlaying) {
        const nextIndex = sections.indexOf(currentSection) + 1;
        if (nextIndex < sections.length) {
            // Snap to top of next section before starting next cycle
            window.scrollTo({
                top: sections[nextIndex].offsetTop,
                behavior: 'smooth'
            });
            // Brief pause for the snap animation to finish
            setTimeout(startSlideshow, 800);
        } else {
            stopSlideshow(); // End of page
        }
    }
}

function animateScroll(start, end, duration) {
    return new Promise((resolve) => {
        const startTime = performance.now();

        function step(currentTime) {
            if (!isPlaying) return resolve();

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Linear scroll to maintain "slow scroll" effect
            const currentPos = start + (end - start) * progress;
            window.scrollTo(0, currentPos);

            if (progress < 1) {
                currentAnimationId = requestAnimationFrame(step);
            } else {
                resolve();
            }
        }
        currentAnimationId = requestAnimationFrame(step);
    });
}

// Manual Scroll Detection
// We listen for user-specific events to avoid the auto-scroll triggering a pause
// const manualEvents = ['wheel', 'mousedown', 'touchstart', 'MSPointerDown'];
// manualEvents.forEach(eventName => {
//     window.addEventListener(eventName, () => {
//         if (isPlaying) {
//             console.log("Manual scroll detected. Pausing...");
//             stopSlideshow();
//         }
//     }, { passive: true });
// });

let touchStartY = 0;

// 1. Prevent FAB interactions from pausing the scroll
// This ensures clicking "Play", "Menu", or "Languages" doesn't stop the slideshow
document.querySelector('.fab-wrapper').addEventListener('mousedown', e => e.stopPropagation());
document.querySelector('.fab-wrapper').addEventListener('touchstart', e => e.stopPropagation());
document.querySelector('#langModal').addEventListener('touchstart', e => e.stopPropagation());

// 2. Detect Desktop Mouse Wheel
window.addEventListener('wheel', () => {
    if (isPlaying) {
        console.log("Mouse wheel detected. Pausing...");
        stopSlideshow();
    }
}, { passive: true });

// 3. Detect Mobile/Touch Dragging
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const deltaY = Math.abs(touchStartY - touchY);

    // Only pause if the user moves their finger more than 10 pixels (a real scroll)
    if (isPlaying && deltaY > 10) {
        console.log("Manual touch scroll detected. Pausing...");
        stopSlideshow();
    }
}, { passive: true });

// 4. Detect Mouse Dragging (for desktop users who click and drag)
window.addEventListener('mousemove', (e) => {
    // e.buttons === 1 means the left mouse button is held down while moving
    if (isPlaying && e.buttons === 1) {
        stopSlideshow();
    }
});