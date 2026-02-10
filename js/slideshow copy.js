const btn = document.getElementById('playPauseBtn');
const sections = document.querySelectorAll('.page-section');

let isPlaying = false;
let animationId = null;
let startTime = null;
let startScrollPos = 0;
let targetScrollPos = 0;
let currentDuration = 0;

// 1. Find which section is currently most visible on screen
function getActiveSectionIndex() {
    let index = 0;
    let minDiff = Math.abs(sections[0].getBoundingClientRect().top);

    sections.forEach((section, i) => {
        const diff = Math.abs(section.getBoundingClientRect().top);
        if (diff < minDiff) {
            minDiff = diff;
            index = i;
        }
    });
    return index;
}

// 2. The custom slow-scroll animation loop
function slowScrollLoop(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / currentDuration, 1);

    // Linear interpolation for a constant, steady crawl
    const currentPos = startScrollPos + (targetScrollPos - startScrollPos) * progress;
    window.scrollTo(0, currentPos);

    if (progress < 1) {
        animationId = requestAnimationFrame(slowScrollLoop);
    } else {
        // Once finished with one section, move to the next
        startTime = null;
        startPlayback(); 
    }
}

function startPlayback() {
    const currentIndex = getActiveSectionIndex();
    
    // Stop if we're at the last section
    if (currentIndex >= sections.length - 1) {
        stopPlayback();
        return;
    }

    const currentSection = sections[currentIndex];
    const nextSection = sections[currentIndex + 1];
    
    // Set up the coordinates for the crawl
    startScrollPos = window.scrollY;
    targetScrollPos = nextSection.offsetTop;
    currentDuration = parseInt(currentSection.getAttribute('data-dwelltime')) * 1000 || 5000;

    startTime = null;
    animationId = requestAnimationFrame(slowScrollLoop);
}

function stopPlayback() {
    isPlaying = false;
    btn.textContent = 'Play';
    cancelAnimationFrame(animationId);
    startTime = null;
}

function togglePlay() {
    isPlaying = !isPlaying;
    btn.textContent = isPlaying ? 'Pause' : 'Play';

    if (isPlaying) {
        startPlayback();
    } else {
        stopPlayback();
    }
}

// 3. Interrupt logic
const interrupt = () => {
    if (isPlaying) {
        console.log("Manual scroll detected: Pausing auto-scroll.");
        togglePlay();
    }
};

// Listeners
btn.addEventListener('click', togglePlay);
window.addEventListener('wheel', interrupt, { passive: true });
window.addEventListener('touchstart', interrupt, { passive: true });