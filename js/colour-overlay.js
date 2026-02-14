// COLOR OVERLAY FUNCTIONALITY
function showColorOverlay(color) {
    const overlay = document.getElementById('colorOverlay');
    overlay.style.backgroundColor = color;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}


// 1. Your Lookup Dictionary
const colorLibrary = {
    "800020": { name: "Burgundy"},
    "ffd8d8": { name: "Blush"},
    "135013": { name: "Forest Green" },
    "fffff0": { name: "Ivory"},

};

function applyColorFromHash() {
    // Get hash, remove the '#' character, and convert to lowercase
    const hash = window.location.hash.substring(1).toLowerCase();
    
    const overlay = document.getElementById('colorOverlay');
    const title = document.querySelector('.colour-name');

    if (colorLibrary[hash]) {
        const colorData = colorLibrary[hash];
        
        // Update the UI
        title.innerText = colorData.name;
        overlay.style.backgroundColor = '#'+hash.trim();
    } else {
        console.log("Color not found in dictionary or no hash provided.");
    }
}

// Run on page load
window.addEventListener('load', applyColorFromHash);

// Run if the user changes the hash without refreshing (e.g., clicking a link)
window.addEventListener('hashchange', applyColorFromHash);

function hideColorOverlay() {
    // This mimics the user clicking the "Back" button in their browser
    // if (window.history.length > 1) {
    //     window.history.back();
    // } else {
    //     // Fallback: If there is no history (e.g., opened in a new tab), 
    //     // just clear the hash manually
    //     window.location.hash = '';
    // }
    window.close();
}