const API_KEY = process.env.API_KEY; // For Node.js (not frontend)
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');

fetch('/.netlify/functions/weather')
  .then((response) => response.json())
  .then((data) => {
    console.log('Your API Key:', data.apiKey);
  })
  .catch((error) => console.error('Error fetching API key:', error));

searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (city) {
    try {
      const response = await fetch(`/.netlify/functions/weather?city=${city}`);
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      weatherInfo.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }
});

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<p>Error: City not found</p>`;
  }
}

function displayWeather(data) {
  const { name, main, weather } = data;
  weatherInfo.innerHTML = `
    <h2>${name}</h2>
    <p>${Math.round(main.temp)}°C</p>
    <p>${weather[0].description}</p>
    <p>Humidity: ${main.humidity}%</p>
  `;
}
