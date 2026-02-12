let wakeLock = null;

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake Lock is active!');
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

// Request the lock when the page loads
requestWakeLock();

// Re-request if the user switches tabs and comes back
document.addEventListener('visibilitychange', async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    requestWakeLock();
  }
});