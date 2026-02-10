/**
 * page-url.js
 * Drop-in replacement for managing event visibility and language routing
 */

// Translation layer: alphanumeric codes mapped to event IDs
const codeToEvents = {
    "a3ghd45d": {
        events: ["event-madhuram", "event-wedding", "event-reception-uae"]
    },
    "bjsg4st4": {
        events: ["event-reception-uae"]
    },
    "cqm9xw2p": {
        events: ["event-reception-thrissur"]
    },
    "dkdhguxb": {
        events: ["event-madhuram", "event-wedding", "event-reception-uae", "event-reception-thrissur"]
    }
};

// Global state
let SHOW_INVITE = false;
let eventId = ""; // Global variable for other scripts to access

const allEvents = ["event-madhuram", "event-wedding", "event-reception-uae", "event-reception-thrissur"];

function hideAllEvents() {
    allEvents.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = "none";
    });
}

function showEvents(allowedEvents) {
    allowedEvents.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = "block";
            SHOW_INVITE = true;
        }
    });
}

/**
 * Parses the custom hash format: #/e/<eventid>/lang/<langcode>
 */
function parseHash() {
    const hash = window.location.hash;
    // Regex matches /e/followed-by-id and optionally /lang/followed-by-code
    const regex = /#\/e\/([^/]+)(?:\/lang\/([^/]+))?/;
    const match = hash.match(regex);

    if (match) {
        return {
            extractedEventId: match[1],
            extractedLang: match[2] || null
        };
    }
    return null;
}

function initializePageFromHash() {
    const hashData = parseHash();
    const savedCode = localStorage.getItem('eventCode');
    
    hideAllEvents();

    let targetCode = "";

    // Priority 1: Valid code in the URL
    if (hashData && codeToEvents[hashData.extractedEventId]) {
        targetCode = hashData.extractedEventId;
        localStorage.setItem('eventCode', targetCode);
        
        // If a language was also in the URL, apply it via the global function
        if (hashData.extractedLang && typeof setLanguage === 'function') {
            const langMap = { 'en': 'English', 'ar': 'Arabic', 'hi': 'Hindi', 'ml': 'Malayalam' };
            if (langMap[hashData.extractedLang]) {
                // We use a slight delay or direct call to ensure translations.js is ready
                setLanguage(hashData.extractedLang, langMap[hashData.extractedLang]);
            }
        }
    } 
    // Priority 2: Fallback to localStorage
    else if (savedCode && codeToEvents[savedCode]) {
        targetCode = savedCode;
    }

    // Execution: Apply visibility
    if (targetCode) {
        eventId = targetCode; // Update global variable
        showEvents(codeToEvents[targetCode].events);
    } else {
        // Cleanup if an invalid code was stored
        localStorage.removeItem('eventCode');
    }
}

// Run on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initializePageFromHash();
        if (typeof loadEnvelope === 'function') loadEnvelope();
    });
} else {
    initializePageFromHash();
    if (typeof loadEnvelope === 'function') loadEnvelope();
}