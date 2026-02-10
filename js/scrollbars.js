// Section progress bar logic
document.addEventListener("DOMContentLoaded", function () {
    const sectionColors = [
        "#b6d7a8", // green
        "#f7c873", // gold
        "#b4a7d6", // lavender
        "#f5b6b6", // pink
        "#a2c4c9", // blue
        "#f7e6a2", // light gold
        "#e5a100", // deep gold
        "#d9ead3", // pastel green
        "#f9cb9c", // peach
        "#c27ba0", // mauve
    ];
    const sections = Array.from(document.querySelectorAll(".page-section"));
    const bar = document.getElementById("section-progress-bar");
    const barTrack = bar.querySelector(".section-bar-track");
    const flower = bar.querySelector(".section-bar-flower");
    let flowerTimeout = null;

    // Remove any old bars
    barTrack.querySelectorAll(".section-bar").forEach((e) => e.remove());
    // Add a bar for each section
    sections.forEach((section, idx) => {
        const barSeg = document.createElement("div");
        barSeg.className = "section-bar";
        barSeg.style.background = sectionColors[idx % sectionColors.length];
        barSeg.dataset.idx = idx;
        barSeg.addEventListener("click", (e) => {
            e.stopPropagation();
            sections[idx].scrollIntoView({ behavior: "smooth" });
        });
        barSeg.style.cursor = "pointer";
        barTrack.insertBefore(barSeg, flower);
    });

    function updateProgress() {
        const scrollY = window.scrollY;
        let currentIdx = 0;
        let progress = 0;
        let sectionTops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
        for (let i = 0; i < sections.length; i++) {
            if (scrollY + 10 >= sectionTops[i]) currentIdx = i;
        }
        // Progress within current section
        const section = sections[currentIdx];
        const top = sectionTops[currentIdx];
        const nextTop = sectionTops[currentIdx + 1] || document.body.scrollHeight;
        progress = Math.min(1, Math.max(0, (scrollY - top) / (nextTop - top)));

        // Set bar fill and dynamic size
        barTrack.querySelectorAll(".section-bar").forEach((seg, idx) => {
            if (idx === currentIdx) {
                seg.classList.add("section-bar-current");
                seg.classList.remove("section-bar-other");
                seg.style.opacity = 1;
                seg.style.filter = `brightness(${0.7 + 0.3 * progress})`;
            } else {
                seg.classList.remove("section-bar-current");
                seg.classList.add("section-bar-other");
                seg.style.opacity = 0.7;
                seg.style.filter = "brightness(0.7)";
            }
        });
        // Move flower
        const barRects = Array.from(barTrack.querySelectorAll(".section-bar")).map((e) => e.getBoundingClientRect());
        if (barRects[currentIdx]) {
            const start = barRects[currentIdx].top;
            const end = barRects[currentIdx].bottom;
            const y = start + (end - start) * progress;
            flower.style.top = y - barTrack.getBoundingClientRect().top - 16 + "px";
            flower.style.background = sectionColors[currentIdx % sectionColors.length];
        }
        // Animate flower if stopped
        if (flowerTimeout) clearTimeout(flowerTimeout);
        flower.classList.remove("flower-dance");
        flowerTimeout = setTimeout(() => {
            flower.classList.add("flower-dance");
        }, 600);
    }

    window.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);
    updateProgress();

    // Arrow navigation
    bar.querySelector(".section-arrow-up").onclick = function () {
        const scrollY = window.scrollY;
        let currentIdx = 0;
        let sectionTops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
        for (let i = 0; i < sections.length; i++) {
            if (scrollY + 10 >= sectionTops[i]) currentIdx = i;
        }
        if (currentIdx > 0) {
            sections[currentIdx - 1].scrollIntoView({ behavior: "smooth" });
        }
    };
    bar.querySelector(".section-arrow-down").onclick = function () {
        const scrollY = window.scrollY;
        let currentIdx = 0;
        let sectionTops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
        for (let i = 0; i < sections.length; i++) {
            if (scrollY + 10 >= sectionTops[i]) currentIdx = i;
        }
        if (currentIdx < sections.length - 1) {
            sections[currentIdx + 1].scrollIntoView({ behavior: "smooth" });
        }
    };
});
