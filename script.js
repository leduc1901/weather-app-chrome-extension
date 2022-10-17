let city = document.getElementById("city");
let content = document.getElementById("content");
let weatherImage = document.getElementById("weather-image");
let temp = document.getElementById("temp");
let weather = document.getElementById("weather");
let loadingContainer = document.getElementById("loading-container");
let clock = document.getElementById("clock");
let latitude = 0;
let longitude = 0;

function pad(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}
let currentDate;

setInterval(() => {
  currentDate = new Date();

  const hours = (currentDate && pad(currentDate.getHours(), 2)) || "";
  const minutes = (currentDate && pad(currentDate.getMinutes(), 2)) || "";
  const seconds = (currentDate && pad(currentDate.getSeconds(), 2)) || "";
  const date = (currentDate && pad(currentDate.getDate(), 2)) || "";
  const month = (currentDate && pad(currentDate.getMonth() + 1, 2)) || "";
  const year = (currentDate && currentDate.getFullYear()) || "";
  clock.innerHTML = `<span>
      ${hours}:${minutes}:${seconds}
    </span>
    <span>
        ${date}/${month}/${year}
    </span>`;
}, 500);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (_position) => {
        latitude = _position.coords.latitude;
        longitude = _position.coords.longitude;
        fetchWeatherData(latitude, longitude);
      },
      () => {
        alert("The system didn't approve location");
      }
    );
  } else {
    alert("The system didn't approve location");
  }
}

function fetchWeatherData(lat, lon) {
  fetch(
    `https://weatherbit-v1-mashape.p.rapidapi.com/current?&lat=${lat}&lon=${lon}`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "bb3232600dmshc6074583ada17bbp15777ejsn2bebd0784d75",
        "X-RapidAPI-Host": "weatherbit-v1-mashape.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((weatherData) => {
      const formattedData = weatherData.data[0];
      const weatherInfo = formattedData.weather;
      loadingContainer.style.opacity = 0;
      content.style.opacity = 1;
      weather.innerText = weatherInfo.description;
      city.innerText = `${formattedData.city_name}, ${formattedData.country_code}`;
      temp.innerText = `${Math.ceil(formattedData.app_temp)}°C`;
      weatherImage.src = `https://www.weatherbit.io/static/img/icons/${weatherInfo.icon}.png`;
    })
    .catch((e) => {
      console.log(e);
    });
}

getLocation();
