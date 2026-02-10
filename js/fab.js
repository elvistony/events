// const eventId = "12345"; // Placeholder for eventid-ignore

function toggleDrawer() {
    const drawer = document.getElementById("drawer");
    const menuIcon = document.getElementById("menuIcon");
    drawer.classList.toggle("show");

    // Toggle icon between bars and close
    if (drawer.classList.contains("show")) {
        menuIcon.classList.replace("fa-bars", "fa-times");
    } else {
        menuIcon.classList.replace("fa-times", "fa-bars");
    }
}

// function togglePlay() {
//     isPlaying = !isPlaying;
//     const playIcon = document.getElementById("playIcon");
//     if (isPlaying) {
//         playIcon.classList.replace("fa-play", "fa-pause");
//         console.log("Music Playing...");
//     } else {
//         playIcon.classList.replace("fa-pause", "fa-play");
//         console.log("Music Paused.");
//     }
// }

function openLangModal() {
    $("#langModal").modal("show");
    toggleDrawer(); // Close drawer when modal opens
}

// function setLanguage(langCode, langName) {
//     // Update UI
//     document.getElementById("currentLangDisplay").innerText = langName;

//     // Update URL Hash: #/e/<evenid-ignore>/lang/[code]
//     window.location.hash = `/e/${eventId}/lang/${langCode}`;

//     $("#langModal").modal("hide");
//     console.log("Language set to:", langCode);
// }

function shareLink() {
    const shareData = {
        title: "Check this out!",
        url: window.location.href,
    };

    if (navigator.share) {
        navigator.share(shareData).catch((err) => console.log("Error sharing", err));
    } else {
        alert("Sharing link: " + window.location.href);
    }
    toggleDrawer();
}

// Close drawer if clicking outside
window.onclick = function (event) {
    if (!event.target.closest(".position-relative") && !event.target.closest(".btn-play")) {
        document.getElementById("drawer").classList.remove("show");
        document.getElementById("menuIcon").classList.replace("fa-times", "fa-bars");
    }
};
