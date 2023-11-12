// Function to parse URL parameters
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Function to calculate time to the next Sunday
function getNextSunday() {
    let now = new Date();
    let nextSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
    return nextSunday;
}

// Function to calculate time for special countdowns
function getSpecialDeadline(hours) {
    let now = new Date();
    return new Date(now.getTime() + hours * 3600 * 1000);
}

// Function to start the countdown for a specific timer
function startCountdown(wrapper) {
    let timeParam = getParameterByName('time');
    let deadline;

    if (timeParam && !isNaN(timeParam)) {
        deadline = getSpecialDeadline(parseInt(timeParam));
    } else {
        deadline = getNextSunday();
    }

    let daysElem = wrapper.querySelector('.days');
    let hoursElem = wrapper.querySelector('.hours');
    let minutesElem = wrapper.querySelector('.minutes');
    let secondsElem = wrapper.querySelector('.seconds');

    function updateTimer() {
        let now = new Date();
        let totalSeconds = Math.floor((deadline - now) / 1000);

        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            startCountdown(wrapper);  // Reset the countdown for this timer
            return;
        }

        let days = Math.floor(totalSeconds / (3600 * 24));
        let hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        if (timeParam && !isNaN(timeParam)) {
            hours += days * 24; // Convert days to hours for special countdowns
            daysElem.style.display = 'none'; // Hide days for special countdowns
        } else {
            daysElem.style.display = ''; // Show days for the default countdown
        }

        daysElem.textContent = String(days).padStart(2, '0');
        hoursElem.textContent = String(hours).padStart(2, '0');
        minutesElem.textContent = String(minutes).padStart(2, '0');
        secondsElem.textContent = String(seconds).padStart(2, '0');
    }

    let countdownInterval = setInterval(updateTimer, 1000);
    updateTimer();  // Call immediately to set the initial value
}

// Initialize all timers on the page
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.countdown-timer').forEach(function(timer) {
        startCountdown(timer);
    });
});
