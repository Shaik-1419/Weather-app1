// OpenWeatherMap API Key (replace with your own key)
const apiKey = 'd0b60150d02787cf72438f232cbfe8a6';

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const forecastContainer = document.getElementById('forecast');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// Fetch Weather Data from OpenWeatherMap API
const getWeatherData = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('City not found');
    }
    const data = await response.json();
    return data;
};

// Fetch 5-day Weather Forecast from OpenWeatherMap API
const getForecastData = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Forecast not found');
    }
    const data = await response.json();
    return data;
};

// Clear previous weather display
const clearWeatherDisplay = () => {
    cityName.textContent = '';
    temperature.textContent = '';
    humidity.textContent = '';
    windSpeed.textContent = '';
    forecastContainer.innerHTML = '';
};

// Update Weather Info in DOM
const displayWeather = (data) => {
    cityName.textContent = `Weather in ${data.name}`;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
};

// Update Forecast Info in DOM (showing the next 5 days)
const displayForecast = (data) => {
    forecastContainer.innerHTML = ''; // Clear old forecast data
    
    // Filter the forecast data to show only one entry per day (usually noon)
    const forecastByDay = {};
    
    data.list.forEach(forecast => {
        const date = new Date(forecast.dt_txt).toLocaleDateString();
        if (!forecastByDay[date]) {
            forecastByDay[date] = forecast; // Store the first forecast for each day
        }
    });

    Object.keys(forecastByDay).slice(0, 5).forEach(date => {
        const forecast = forecastByDay[date];
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-item');
        forecastElement.innerHTML = `
            <p>${date}</p>
            <p>Temp: ${forecast.main.temp}°C</p>
            <p>Wind: ${forecast.wind.speed} m/s</p>
        `;
        forecastContainer.appendChild(forecastElement);
    });
};

// Handle Search Button Click
const handleSearch = async () => {
    const city = cityInput.value.trim();
    if (!city) {
        errorMessage.textContent = 'Please enter a city name';
        return;
    }

    try {
        errorMessage.textContent = ''; // Clear error message
        clearWeatherDisplay(); // Clear previous results
        const weatherData = await getWeatherData(city);
        const forecastData = await getForecastData(city);

        displayWeather(weatherData);
        displayForecast(forecastData);
        weatherInfo.style.display = 'block'; // Show the weather info
    } catch (error) {
        errorMessage.textContent = error.message; // Display error message
    }
};

// Search Button Click Event
searchBtn.addEventListener('click', handleSearch);

// Enable Search with "Enter" Key
cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});