const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');

searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (city) {
    try {
      const response = await fetch(`/.netlify/functions/weather?city=${city}`);
      const data = await response.json();
      if (data.error) {
        weatherInfo.innerHTML = `<p>Error: ${data.error}</p>`;
      } else {
        displayWeather(data);
      }
    } catch (error) {
      weatherInfo.innerHTML = `<p>Error: Failed to fetch weather data</p>`;
    }
  }
});

function displayWeather(data) {
  const { name, main, weather } = data;
  weatherInfo.innerHTML = `
    <h2>${name}</h2>
    <p>${Math.round(main.temp)}°C</p>
    <p>${weather[0].description}</p>
    <p>Humidity: ${main.humidity}%</p>
  `;
}
