// Translation layer: alphanumeric codes mapped to event IDs
// Share the codes with guests, not the event names
const codeToEvents = {
    "a3ghd45d": {
        events: ["event-madhuram","event-wedding","event-reception-uae"]
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

// All event section IDs that can be hidden/shown
const allEvents = ["event-madhuram", "event-wedding", "event-reception-uae", "event-reception-thrissur"];

// Hide all event sections initially
function hideAllEvents() {
    allEvents.forEach(eventId => {
        const element = document.getElementById(eventId);
        if (element) {
            element.style.display = "none";
        }
    });
}

// Show specific events based on allowed list
function showEvents(allowedEvents) {
    allowedEvents.forEach(eventId => {
        const element = document.getElementById(eventId);
        if (element) {
            element.style.display = "block";
        }
    });
}

// Initialize page based on URL hash
function initializePageFromHash() {
    // Get the hash from the URL (without the #)
    const hash = window.location.hash.substring(1);
    
    // Hide all events first
    hideAllEvents();
    
    // Check if a valid code hash exists
    if (hash && codeToEvents[hash]) {
        // Show only the events for this code
        showEvents(codeToEvents[hash].events);
    } else if (hash === "") {
        // No hash provided - hide all events (guest needs to be invited)
        hideAllEvents();
    } else {
        // Invalid hash - hide all events for security
        hideAllEvents();
    }
}

// Run on page load only - don't react to hash changes from navigation links
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePageFromHash);
} else {
    // If script loads after DOMContentLoaded, run immediately
    initializePageFromHash();
}