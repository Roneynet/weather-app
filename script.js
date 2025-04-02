// Dark Mode Toggle
const toggleButton = document.getElementById('dark-mode-toggle');
const body = document.body;
const toggleIcon = toggleButton.querySelector('span');

// Check for saved dark mode preference
if (localStorage.getItem('dark-mode') === 'enabled') {
  body.classList.add('dark-mode');
  toggleIcon.textContent = '☀️';
}

// Toggle dark mode
toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');

  localStorage.setItem('dark-mode', isDarkMode ? 'enabled' : 'disabled');
  toggleIcon.textContent = isDarkMode ? '☀️' : '🌙';
});

// Security variables
let lastRequestTime = 0;
const REQUEST_DELAY = 2000; // 2 seconds between requests
const MAX_CITY_LENGTH = 50;

// Example data for initial display - "My City" with clear sky
const exampleData = {
  name: 'Example',
  sys: { country: 'GB' },
  main: {
    temp: 28,
    feels_like: 26,
    temp_min: 25,
    temp_max: 32,
    humidity: 45,
    pressure: 1015,
  },
  weather: [
    {
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
  ],
  wind: {
    speed: 2.1,
    deg: 180,
  },
  clouds: { all: 0 },
  visibility: 10000,
};

// Weather App Functionality
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');

// Display example data when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  displayWeather(exampleData);
});

searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') fetchWeather();
});

async function fetchWeather() {
  const city = cityInput.value.trim();

  // Input validation
  if (!city) {
    showError('Please enter a city name');
    return;
  }

  if (city.length > MAX_CITY_LENGTH) {
    showError('City name is too long');
    return;
  }

  // Rate limiting
  const now = Date.now();
  if (now - lastRequestTime < REQUEST_DELAY) {
    showError('Please wait before searching again');
    return;
  }

  lastRequestTime = now;

  try {
    weatherInfo.innerHTML = `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading weather data...</p>
      </div>
    `;

    // Sanitize city input
    const sanitizedCity = city.replace(/[^a-zA-Z\u0080-\uFFFF\s-]/g, '');

    const response = await fetch(
      `/.netlify/functions/weather?city=${encodeURIComponent(sanitizedCity)}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      showError(data.error);
    } else {
      displayWeather(data);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    showError('Failed to get weather data. Please try again.');
  }
}

function displayWeather(data) {
  const { name, main, weather, wind, clouds, sys } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  weatherInfo.innerHTML = `
    <div class="weather-content">
      <div class="weather-header">
        <h3>${name}${sys.country ? `, ${sys.country}` : ''}</h3>
        <img src="${iconUrl}" alt="${
    weather[0].description
  }" class="weather-icon">
        <p class="temperature-display">${Math.round(main.temp)}</p>
        <p class="weather-condition">${weather[0].main}</p>
      </div>
      
      <div class="weather-meta">
        <div class="weather-meta-item">
          <svg viewBox="0 0 24 24"><path d="M12,3L4,12V21H20V12L12,3Z"></path></svg>
          <span>${Math.round(main.feels_like)}°C</span>
        </div>
        <div class="weather-meta-item">
          <svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"></path></svg>
          <span>${main.humidity}%</span>
        </div>
        <div class="weather-meta-item">
          <svg viewBox="0 0 24 24"><path d="M13,2.05V5.08C16.39,5.57 19,8.47 19,12C19,12.9 18.82,13.75 18.5,14.54L21.12,16.07C21.68,14.83 22,13.45 22,12C22,6.82 18.05,2.55 13,2.05M12,19A7,7 0 0,1 5,12C5,8.47 7.61,5.57 11,5.08V2.05C5.94,2.55 2,6.81 2,12A10,10 0 0,0 12,22C15.3,22 18.23,20.39 20.05,17.91L17.45,16.38C16.17,18 14.21,19 12,19Z"></path></svg>
          <span>${wind.speed} m/s</span>
        </div>
      </div>
      
      <div class="weather-details">
        <div class="detail-card">
          <h4>Details</h4>
          <p>Min: ${Math.round(main.temp_min)}°C</p>
          <p>Max: ${Math.round(main.temp_max)}°C</p>
          <p>Pressure: ${main.pressure} hPa</p>
          <p>Clouds: ${clouds.all}%</p>
        </div>
      </div>
    </div>
  `;
}

function showError(message) {
  weatherInfo.innerHTML = `
    <div class="error-state">
      <svg viewBox="0 0 24 24" width="48" height="48"><path fill="var(--accent-color)" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/></svg>
      <p>${message}</p>
    </div>
  `;
}
