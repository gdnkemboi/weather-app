function formatDateString(dateString) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(dateString);

  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const amPm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  const time = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${amPm}`;

  const formattedDate = {
    dayOfWeek,
    month,
    day,
    year,
    time,
  };

  return formattedDate;
}

async function fetchWeather(place) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?q=${place}&days=4&key=42a9b5d54a1d47e3b2755237242401`
  );
  const data = await response.json();

  let location = data.location.name;
  let country = data.location.country;
  let formattedDate = formatDateString(data.location.localtime);
  let date =
    formattedDate.dayOfWeek +
    ", " +
    formattedDate.month +
    " " +
    formattedDate.day +
    ", " +
    formattedDate.year;
  let time = formattedDate.time;
  let tempCelcius = data.current.temp_c;
  let tempFahrenheit = data.current.temp_f;
  let description = data.current.condition.text;
  let humidity = data.current.humidity;
  let wind = data.current.wind_kph;
  let feelsLike = data.current.feelslike_c;

  let currentWeather = {
    location,
    country,
    date,
    time,
    tempCelcius,
    tempFahrenheit,
    description,
    humidity,
    wind,
    feelsLike,
  };

  let forecastDays = data.forecast.forecastday;
  let forecast = { dayForecasts: [] };

  for (let day of forecastDays.slice(1)) {
    let dayForecast = {
      date: day.date,
      temp: day.day.maxtemp_c,
      description: day.day.condition.text,
      humidity: day.day.avghumidity,
      wind: day.day.maxwind_kph,
    };
    forecast.dayForecasts.push(dayForecast);
  }

  let weather = {
    currentWeather,
    forecast,
  };

  return weather;
}

function displayWeather(weather) {
  let currentWeather = weather.currentWeather;
  let forecast = weather.forecast;

  let location = document.querySelector(".location");
  let date = document.querySelector(".date");
  let description = document.querySelector(".description");
  let temperature = document.querySelector(".temperature");
  let humidity = document.querySelector(".humidity");
  let wind = document.querySelector(".wind");
  let feelsLike = document.querySelector(".feelsLike");

  location.innerHTML = `${currentWeather.location}, ${currentWeather.country}`;
  date.innerHTML = `${currentWeather.date} ${currentWeather.time}`;
  description.innerHTML = currentWeather.description;
  temperature.innerHTML = `${currentWeather.tempCelcius}°C`;
  humidity.innerHTML = `${currentWeather.humidity}%`;
  wind.innerHTML = `${currentWeather.wind}km/h`;
  feelsLike.innerHTML = `${currentWeather.feelsLike}°C`;

  let forecastDiv = document.querySelector(".forecast");
  forecastDiv.innerHTML = "";

  for (let day of forecast.dayForecasts) {
    let dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    let dayOfWeek = formatDateString(day.date).dayOfWeek
    dayDiv.innerHTML = `${dayOfWeek} <br /> ${day.temp}°C <br /> ${day.description}`;
    forecastDiv.appendChild(dayDiv);
  }
}

fetchWeather("Nairobi").then((weather) => {
  console.log(weather);
  displayWeather(weather);
});

(() => {
  function search(location) {
    fetchWeather(location)
      .then((weather) => {
        displayWeather(weather);
      })
      .catch((error) => {
        console.log(error);
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
})();
