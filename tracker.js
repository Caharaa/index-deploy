// tracker.js
let trackingActive = true;  // Tracks if the activity is ongoing
let lastKnownPosition = { lat: null, lon: null };
let lastMovementTime = Date.now();
let exerciseStartTime = Date.now();
let distanceTravelled = 0; // Distance in meters
let totalCalories = 0; // Total calories burned
let exerciseDuration = 0; // Duration in seconds

const MET = 7.0;  
const weight = 70; 
const statusElement = document.getElementById("status");
const durationElement = document.getElementById("duration");
const distanceElement = document.getElementById("distance");
const caloriesElement = document.getElementById("calories");

const inactivityThreshold = 2 * 60 * 1000; 
const moveThreshold = 10; 
document.getElementById("pauseButton").addEventListener("click", pauseActivity);


function calculateDistance(pos1, pos2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (pos2.lat - pos1.lat) * (Math.PI / 180);
  const dLon = (pos2.lon - pos1.lon) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(pos1.lat * (Math.PI / 180)) * Math.cos(pos2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Return in meters
}

function calculateCalories(duration) {
  return MET * weight * (duration / 3600);
}

function updateActivity() {
  const currentTime = Date.now();
  exerciseDuration = Math.floor((currentTime - exerciseStartTime) / 1000);
  totalCalories = calculateCalories(exerciseDuration);
  durationElement.innerText = `Exercise Time: ${exerciseDuration} seconds`;
  caloriesElement.innerText = `Calories Burned: ${Math.floor(totalCalories)} kcal`;

  if (trackingActive) {
    distanceElement.innerText = `Distance: ${Math.floor(distanceTravelled)} meters`;
  }
}

// Function to handle the GPS location updates
function handleLocation(position) {
  const currentPosition = { lat: position.coords.latitude, lon: position.coords.longitude };
  const currentTime = Date.now();

  // If this is not the first position, calculate distance and update the time
  if (lastKnownPosition.lat && lastKnownPosition.lon) {
    const distance = calculateDistance(lastKnownPosition, currentPosition);
    if (distance < moveThreshold) {  // Movement threshold
      if (currentTime - lastMovementTime > inactivityThreshold) {
        pauseActivity();
      }
    } else {
      lastMovementTime = currentTime; // Update last movement time
      distanceTravelled += distance;
    }
  }

  lastKnownPosition = currentPosition; // Update position
}

// Function to start tracking
function startTracking() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(handleLocation, handleError, {
      enableHighAccuracy: true,
      maximumAge: 10000, // 10 seconds
      timeout: 30000  // 30 seconds
    });
  } else {
    statusElement.innerText = "Geolocation is not supported by your browser.";
  }
}

// Function to pause activity
function pauseActivity() {
  if (!trackingActive) return;
  
  trackingActive = false;
  statusElement.innerText = "Activity paused. Click resume to continue.";
  // Clear location tracking and stop the timer
  navigator.geolocation.clearWatch(handleLocation);
  updateActivity();
}

// Handle any errors with location tracking
function handleError(error) {
  statusElement.innerText = `Error: ${error.message}`;
}

startTracking();
setInterval(updateActivity, 1000);


