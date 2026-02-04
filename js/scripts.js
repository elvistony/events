/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
//

// CALENDAR INVITE FUNCTIONALITY
function addToCalendar(eventId) {
    // Event data - UPDATE THESE WITH YOUR ACTUAL EVENT DETAILS
    const events = {
        'madhuram': {
            title: 'Madhuram Veppu - Elvis & Maritta',
            description: 'Pre-Wedding Celebration - Traditional ceremony filled with joy, family, and cherished traditions.',
            location: '[Venue Name & Address]',
            startDateTime: '20260510T100000', // YYYYMMDDTHHMMSS (Update to your date/time)
            endDateTime: '20260510T133000'
        },
        'wedding': {
            title: 'Wedding Ceremony - Elvis & Maritta',
            description: 'Our Wedding Ceremony - Join us as we make our vows before God and our loved ones.',
            location: '[Venue Name & Address]',
            startDateTime: '20260525T100000', // YYYYMMDDTHHMMSS (Update to your date/time)
            endDateTime: '20260525T120000'
        },
        'uae-reception': {
            title: 'UAE Reception - Elvis & Maritta',
            description: 'Celebration in the Emirates - Evening of celebration, delicious food, and joyful dancing.',
            location: '[Venue Name & Address, UAE]',
            startDateTime: '20260602T183000', // YYYYMMDDTHHMMSS (Update to your date/time)
            endDateTime: '20260603T000000'
        },
        'thrissur-reception': {
            title: 'Thrissur Reception - Elvis & Maritta',
            description: 'Homecoming Celebration - Join us for a joyous homecoming reception with family and friends.',
            location: '[Venue Name & Address, Thrissur]',
            startDateTime: '20260620T180000', // YYYYMMDDTHHMMSS (Update to your date/time)
            endDateTime: '20260620T235900'
        }
    };

    const eventData = events[eventId];
    
    if (!eventData) {
        alert('Event not found');
        return;
    }

    // Create ICS file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Elvis & Maritta Wedding//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Elvis & Maritta Wedding Events
X-WR-TIMEZONE:UTC
BEGIN:VEVENT
UID:${eventId}-elvis-maritta-wedding@wedding.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${eventData.startDateTime}Z
DTEND:${eventData.endDateTime}Z
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.description}
LOCATION:${eventData.location}
SEQUENCE:0
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;

    // Create blob and download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = `${eventId}-elvis-maritta-wedding.ics`;
    link.click();
    
    URL.revokeObjectURL(url);
}

window.addEventListener('DOMContentLoaded', event => {

    // COUNTDOWN TIMER FUNCTIONALITY
    function initCountdown() {
        // Set the wedding date (CHANGE THIS TO YOUR ACTUAL WEDDING DATE)
        // Format: new Date('Month Day, Year Hour:Minute:Second')
        const weddingDate = new Date('July 23, 2026 12:00:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const timeRemaining = weddingDate - now;
            
            if (timeRemaining > 0) {
                // Calculate time units
                const totalSeconds = Math.floor(timeRemaining / 1000);
                const totalMinutes = Math.floor(totalSeconds / 60);
                const totalHours = Math.floor(totalMinutes / 60);
                const totalDays = Math.floor(totalHours / 24);
                const weeks = Math.floor(totalDays / 7);
                
                // Calculate individual units
                const days = totalDays % 7;
                const hours = totalHours % 24;
                const minutes = totalMinutes % 60;
                const seconds = totalSeconds % 60;
                
                // Update the DOM
                document.getElementById('weeks').textContent = weeks;
                document.getElementById('days').textContent = days;
                document.getElementById('hours').textContent = hours;
                document.getElementById('minutes').textContent = minutes;
                document.getElementById('seconds').textContent = seconds;
            } else {
                // Wedding date has passed
                document.getElementById('weeks').textContent = '0';
                document.getElementById('days').textContent = '0';
                document.getElementById('hours').textContent = '0';
                document.getElementById('minutes').textContent = '0';
                document.getElementById('seconds').textContent = '0';
            }
        }
        
        // Initial update
        updateCountdown();
        
        // Update every second
        setInterval(updateCountdown, 1000);
    }
    
    // Initialize countdown
    initCountdown();

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

});

// COLOR OVERLAY FUNCTIONALITY
function showColorOverlay(color) {
    const overlay = document.getElementById('colorOverlay');
    overlay.style.backgroundColor = color;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function hideColorOverlay() {
    const overlay = document.getElementById('colorOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // Allow scrolling again
}
