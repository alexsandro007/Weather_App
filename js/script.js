const apiKey = '4641bafd2559b2bd4a5c10fbcfee7a09';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');

const weatherDetails = document.querySelector('.weather-details');
const weatherIcon = document.querySelector('.weather-icon');
const cityElement = document.querySelector('.city');
const tempElement = document.querySelector('.temp');
const changeTempElement = document.querySelector('.change_temp');
const humidityElement = document.querySelector('.humidity');
const windElement = document.querySelector('.wind');

let celcius = true;
let tempValue = 0;

weatherDetails.style.display = 'none';

// Функция получения погоды по названию города
async function checkWeather(city) {
     if (!city) {
          weatherDetails.style.display = 'none';
          return;
     }
     
     const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
     let data = await response.json();

     if (data.cod === 200) {
          tempValue = 0;
          weatherDetails.style.display = 'block';

          cityElement.innerHTML = data.name;
          
          tempValue = data.main.temp;
          tempElement.innerHTML = Math.round(data.main.temp) + '°C';
          changeTempElement.innerHTML = '°F';
          
          humidityElement.innerHTML = data.main.humidity + '%';
          windElement.innerHTML = data.wind.speed + ' km/h';

          weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
     } else {
          weatherDetails.style.display = 'none';
          alert("City not found!");
     }
}

// Функция получения погоды по координатам
async function checkWeatherByCoords(lat, lon) {
     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
     let data = await response.json();

     if (data.cod === 200) {
          tempValue = data.main.temp;
          weatherDetails.style.display = 'block';

          cityElement.innerHTML = data.name;
          tempElement.innerHTML = Math.round(data.main.temp) + '°C';
          changeTempElement.innerHTML = '°F';
          humidityElement.innerHTML = data.main.humidity + '%';
          windElement.innerHTML = data.wind.speed + ' km/h';
          weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
     } else {
          weatherDetails.style.display = 'none';
          alert("Unable to fetch weather data!");
     }
}

// Получение текущего местоположения при загрузке
function getLocation() {
     if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
               (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    checkWeatherByCoords(lat, lon);
               },
               (error) => {
                    console.error("Geolocation error:", error);
                    alert("Unable to get location. Please enter a city manually.");
               }
          );
     } else {
          alert("Geolocation is not supported by this browser.");
     }
}

searchBtn.addEventListener('click', () => {
     tempValue = 0;
     celcius = true;
     checkWeather(searchBox.value);
     searchBox.value = '';
});

searchBox.addEventListener('keypress', (e) => {
     if (e.key === 'Enter') {
          tempValue = 0;
          celcius = true;
          checkWeather(searchBox.value);
          searchBox.value = '';
     }
});

changeTempElement.addEventListener('click', () => {
     if (celcius){
          tempValue = Math.round((tempValue * 9 / 5) + 32);
          tempElement.innerHTML = tempValue + '°F';
          changeTempElement.innerHTML = '°C';
     } else {
          tempValue = Math.round((tempValue - 32) * 5 / 9);
          tempElement.innerHTML = tempValue + '°C';
          changeTempElement.innerHTML = '°F';
     }

     celcius = !celcius;
});

// Запускаем получение погоды при загрузке страницы
window.addEventListener('load', getLocation);