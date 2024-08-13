const apiKey = "597b0552542cb7169db54e3cfb37a460";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const locationInput = document.getElementById("location-input");
const weatherIcon = document.querySelector(".weather-icon");

async function fetchWeatherData(url) {
    const response = await fetch(url);
    if (response.status === 404) {
        alert("City not found!");
    } else {
        const data = await response.json();
        updateWeatherUI(data);
    }
}

function updateWeatherUI(data) {
    document.querySelector(".city-name").innerHTML = data.name;
    document.querySelector(".temperature").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".description").innerHTML = data.weather[0].description;
    document.getElementById("wind-speed").innerHTML = data.wind.speed + " km/h";
    document.getElementById("humidity").innerHTML = data.main.humidity + "%";
    document.getElementById("sunrise").innerHTML = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    document.getElementById("sunset").innerHTML = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    document.getElementById("visibility").innerHTML = data.visibility / 1000 + " km";
    const rainfall = data.rain ? data.rain['1h'] : 0;
    document.getElementById("rainfall").innerHTML = rainfall + " mm";

    const weatherCondition = data.weather[0].main.toLowerCase();
    if (weatherCondition === "clear") {
        weatherIcon.src = "images/clear.png";
    } else if (weatherCondition === "clouds") {
        weatherIcon.src = "images/clouds.png";
    } else if (weatherCondition === "rain") {
        weatherIcon.src = "images/rain.png";
    } else if (weatherCondition === "snow") {
        weatherIcon.src = "images/snow.png";
    } else {
        weatherIcon.src = "images/mist.png";
    }

    if (rainfall > 10 || data.wind.speed > 50) {
        document.getElementById("alert-box").classList.remove("hidden");
    } else {
        document.getElementById("alert-box").classList.add("hidden");
    }
}

searchBtn.addEventListener("click", () => {
    const city = locationInput.value;
    if (city) {
        const url = `${apiUrl}${city}&appid=${apiKey}`;
        fetchWeatherData(url);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
            fetchWeatherData(url);
        });
    }
});
