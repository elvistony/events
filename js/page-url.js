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
    },
    "edjgkd2s": {
        events: ["event-wedding", "event-reception-uae", "event-reception-thrissur"]
    },
    "fldfdgj4": {
        events: ["event-reception-uae","event-reception-thrissur"]
    }
};

// Global state
let SHOW_INVITE = false;
let eventId = ""; // Global variable for other scripts to access

const allEvents = ["event-madhuram", "event-wedding", "event-reception-uae", "event-reception-thrissur"];

// function hideAllEvents() {
    
//     allEvents.forEach(id => {
//         const element = document.getElementById(id);
//         // document.querySelector('.quote * > [data-content-id="bible-quote-*"]').style.display='none'
//         if (element) element.style.display = "none";
//     });
// }

// function showEvents(allowedEvents) {
//     allowedEvents.forEach(id => {
//         const element = document.getElementById(id);
//         if (element) {
//             element.style.display = "block";
//             document.querySelector('.quote * > [data-content-id="bible-quote-'+(allEvents.indexOf(element)+1)+'"]').style.display='none'
//             SHOW_INVITE = true;
//         }
//     });
// }

function hideAllEvents() {
    allEvents.forEach((id, index) => {
        const element = document.getElementById(id);
        const others = document.querySelectorAll("[data-event='"+id+"']");
        others.forEach(element => {
            element.style.display='none';
        });
        if (element) element.style.display = "none";
        
        // Hide the corresponding quote for this ID as well
        const quote = document.querySelectorAll(`.quote`)[index+1];
        if (quote) quote.style.display = "none";
    });
}

function showEvents(allowedEvents) {
    allowedEvents.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = "block";
            
            // Fix: Use the ID string to find the index, not the element object
            const eventIndex = allEvents.indexOf(id);
            const quote = document.querySelectorAll(`.quote`)[eventIndex+1];
            
            if (quote) quote.style.display = "block"; // Changed from 'none' to 'block' assuming you want to show it
            
            SHOW_INVITE = true; 
        }
        const others = document.querySelectorAll("[data-event='"+id+"']");
        others.forEach(element => {
            element.style.display='block';
        });
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