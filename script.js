async function getWeather(place) {
  const API_KEY = "42a9b5d54a1d47e3b2755237242401";
  const url = `https://api.weatherapi.com/v1/forecast.json?q=${place}&days=4&key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather data not found for "${place}"`);
    }

    const data = await response.json();

    console.log(data);

    let location = data.location.name;
    let country = data.location.country;
    let tempCelcius = Math.round(data.current.temp_c);
    let tempFahrenheit = data.current.temp_f;
    let description = data.current.condition.text;
    let humidity = data.current.humidity;
    let wind = data.current.wind_kph;
    let feelsLike = data.current.feelslike_c;

    let weather = {
      location,
      country,
      tempCelcius,
      tempFahrenheit,
      description,
      humidity,
      wind,
      feelsLike,
    };

    return weather;
  } catch (error) {
    console.error(error.message);
    alert(error.message);
    return null;
  }
}

function displayWeather(weather) {
  if (!weather) return;

  let location = document.querySelector(".location");
  let description = document.querySelector(".description");
  let temperature = document.querySelector(".temperature");
  let humidity = document.querySelector(".humidity");
  let wind = document.querySelector(".wind");
  let feelsLike = document.querySelector(".feelsLike");
  let weatherInfo = document.querySelector(".info");

  location.innerHTML = `${weather.location}, ${weather.country}`;
  description.innerHTML = weather.description;
  temperature.innerHTML = `${weather.tempCelcius}<span class="degree">°C</span>`;

  feelsLike.innerHTML = `FEELS LIKE: ${weather.feelsLike}<sup>°C</sup>`;
  humidity.innerHTML = `HUMIDITY: ${weather.humidity}%`;
  wind.innerHTML = `WIND: ${weather.wind}km/h`;
  weatherInfo.classList.add("loaded");
}

getWeather("Nairobi").then((weather) => {
  displayWeather(weather);
});

// Search functionality
function search(location) {
  getWeather(location).then((weather) => {
    displayWeather(weather);
  });
}

let searchBar = document.querySelector("#searchInput");
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submitSearch();
  }
});

function submitSearch() {
  const query = searchInput.value.trim();
  if (query !== "") {
    search(query);
    searchInput.value = "";
  }
}

function changeBackground(weatherCondition) {
  let backgroundImage = "";

  switch (weatherCondition.toLowerCase()) {
    case "clear":
      backgroundImage = "url('https://source.unsplash.com/1600x900/?sunny')";
      break;
    case "clouds":
      backgroundImage = "url('https://source.unsplash.com/1600x900/?cloudy')";
      break;
    case "rain":
      backgroundImage = "url('https://source.unsplash.com/1600x900/?rain')";
      break;
    case "snow":
      backgroundImage = "url('https://source.unsplash.com/1600x900/?snow')";
      break;
    case "thunderstorm":
      backgroundImage =
        "url('https://source.unsplash.com/1600x900/?thunderstorm')";
      break;
    default:
      backgroundImage = "url('https://source.unsplash.com/1600x900/?weather')";
      break;
  }

  document.body.style.backgroundImage = backgroundImage;
  document.body.style.backgroundSize = "cover";
}
