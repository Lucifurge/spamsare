const serverUrls = {
    server1: 'https://autoshare-ya35.onrender.com'
};

async function checkServerStatus() {
    const servers = document.querySelectorAll('#server option');
    let allDown = true;
    let retries = 0;

    for (const server of servers) {
        const serverKey = server.value;
        try {
            const response = await fetch(serverUrls[serverKey]);
            if (response.ok) {
                server.textContent = `${serverKey.replace('server', 'Server ')} (active)`;
                allDown = false;
            } else {
                server.textContent = `${serverKey.replace('server', 'Server ')} (down)`;
            }
        } catch (error) {
            server.textContent = `${serverKey.replace('server', 'Server ')} (down)`;
        }
        retries++;
    }

    const submitButton = document.getElementById('submit-button');
    if (allDown) {
        submitButton.disabled = true;
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Server Error: Unable to retrieve servers. This might be due to no available servers or a connectivity issue. Please reload the page and ensure your internet connection is stable. Retries: ' + retries;
        errorMessage.style.color = '#f44336';
        errorMessage.style.textAlign = 'center';
        errorMessage.style.marginTop = '15px';
        errorMessage.style.fontSize = '14px';
        document.querySelector('.wrapper-container').appendChild(errorMessage);
    } else {
        submitButton.disabled = false;
    }
}

window.onload = checkServerStatus;

function validateAppState(appState) {
    return appState.length > 0;
}

async function submitForm(event) {
    event.preventDefault();
    const result = document.getElementById('result');
    const button = document.getElementById('submit-button');
    const selectedServer = document.getElementById('server').value;
    const server = serverUrls[selectedServer];
    const appState = document.getElementById('cookies').value;

    if (!validateAppState(appState)) {
        result.style.display = 'block';
        result.className = 'error';
        result.innerHTML = 'Invalid Appstate. Please check and try again.';
        return;
    }

    try {
        result.style.display = 'block';
        button.disabled = true;
        result.className = '';
        const response = await fetch(`${server}/api/submit`, {
            method: 'POST',
            body: JSON.stringify({
                cookie: appState,
                url: document.getElementById('urls').value,
                amount: document.getElementById('amounts').value,
                interval: document.getElementById('intervals').value,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === 200) {
            result.className = 'success';
            result.innerHTML = `Successfully shared!`;
        } else {
            result.className = 'error';
            result.innerHTML = `Submission failed. Error: ${data.message}`;
        }
    } catch (error) {
        result.className = 'error';
        result.innerHTML = `Submission failed. Please try again later. Error: ${error.message}`;
    } finally {
        button.disabled = false;
    }
}

function toggleVideo() {
    const videoContainer = document.getElementById('video-container');
    videoContainer.style.display = videoContainer.style.display === 'none' ? 'block' : 'none';
}

const modeToggle = document.getElementById('modeToggle');
const modeIcon = document.getElementById('mode-icon');
const currentDate = document.getElementById('current-date');
const currentTime = document.getElementById('current-time');
const networkStatus = document.getElementById('network-status');
const batteryStatus = document.getElementById('battery-status');
const totalVisitors = document.getElementById('total-visitors');

// Mode toggle event
modeToggle.addEventListener('change', () => {
    if (modeToggle.checked) {
        // Light Mode
        document.body.style.backgroundColor = "#f0f0f0";
        document.body.style.color = "#333";
        modeIcon.textContent = "🌞";
    } else {
        // Dark Mode
        document.body.style.backgroundColor = "#333";
        document.body.style.color = "#f0f0f0";
        modeIcon.textContent = "🌙";
    }
});

// Update current date and time
function updateDateTime() {
    const now = new Date();
    currentDate.textContent = now.toLocaleDateString();
    currentTime.textContent = now.toLocaleTimeString();
}

// Update network status
function updateNetworkStatus() {
    if (navigator.onLine) {
        networkStatus.textContent = 'Online';
    } else {
        networkStatus.textContent = 'Offline';
    }
}

// Update battery status
function updateBatteryStatus() {
    navigator.getBattery().then(battery => {
        const batteryLevel = Math.round(battery.level * 100);
        batteryStatus.textContent = `Battery: ${batteryLevel}%`;
    });
}

// Simulate total visitors count
let visitorsCount = 0;
function updateVisitorsCount() {
    visitorsCount++;
    totalVisitors.textContent = `Visitors: ${visitorsCount}`;
}

// Call functions to update information
setInterval(updateDateTime, 1000);
setInterval(updateNetworkStatus, 1000);
setInterval(updateBatteryStatus, 1000);
setInterval(updateVisitorsCount, 5000);

// Initial updates
updateDateTime();
updateNetworkStatus();
updateBatteryStatus();
updateVisitorsCount();
