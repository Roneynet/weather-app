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

// Weather App Functionality
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');

searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') fetchWeather();
});

async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  try {
    weatherInfo.innerHTML = '<p class="loading">Loading weather data...</p>';
    const response = await fetch(`/.netlify/functions/weather?city=${city}`);
    const data = await response.json();

    if (data.error) {
      weatherInfo.innerHTML = `<p class="error">${data.error}</p>`;
    } else {
      displayWeather(data);
    }
  } catch (error) {
    weatherInfo.innerHTML = `<p class="error">Failed to fetch weather data</p>`;
  }
}

function displayWeather(data) {
  const { name, main, weather, wind, clouds, sys, visibility } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

  // Create display HTML with all available data
  weatherInfo.innerHTML = `
    <div class="weather-content">
      <h3>${name}, ${sys.country}</h3>
      <img src="${iconUrl}" alt="${
    weather[0].description
  }" class="weather-icon">
      <p class="temperature">${Math.round(main.temp)}°C</p>
      <p class="description">${weather[0].main} (${weather[0].description})</p>
      
      <div class="weather-details">
        <div class="detail-card">
          <h4>Temperature</h4>
          <p>Feels like: ${Math.round(main.feels_like)}°C</p>
          <p>Min: ${Math.round(main.temp_min)}°C</p>
          <p>Max: ${Math.round(main.temp_max)}°C</p>
        </div>
        
        <div class="detail-card">
          <h4>Conditions</h4>
          <p>Humidity: ${main.humidity}%</p>
          <p>Pressure: ${main.pressure}hPa</p>
          <p>Visibility: ${visibility / 1000}km</p>
          <p>Clouds: ${clouds.all}%</p>
        </div>
        
        <div class="detail-card">
          <h4>Wind</h4>
          <p>Speed: ${wind.speed}m/s</p>
          ${wind.deg ? `<p>Direction: ${wind.deg}°</p>` : ''}
          ${wind.gust ? `<p>Gust: ${wind.gust}m/s</p>` : ''}
        </div>
        
        <div class="detail-card">
          <h4>System</h4>
          <p>Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p>Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}</p>
        </div>
      </div>
      
      <div class="raw-data">
        <details>
          <summary>View Raw API Data</summary>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </details>
      </div>
    </div>
  `;
}
