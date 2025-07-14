// ✅ Populate city dropdown
function populateCities() {
  const cities = [
    { name: "Amsterdam", lat: 52.37, lon: 4.89 },
    { name: "Ankara", lat: 39.93, lon: 32.86 },
    { name: "Athens", lat: 37.98, lon: 23.72 },
    { name: "Barcelona", lat: 41.39, lon: 2.16 },
    { name: "Belgrade", lat: 44.82, lon: 20.46 },
    { name: "Berlin", lat: 52.52, lon: 13.40 },
    { name: "Bratislava", lat: 48.15, lon: 17.11 },
    { name: "Brussels", lat: 50.85, lon: 4.35 },
    { name: "Bucharest", lat: 44.43, lon: 26.10 },
    { name: "Budapest", lat: 47.50, lon: 19.04 }
  ];

  const select = document.getElementById('city');
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = `${city.lat},${city.lon}`;
    option.text = city.name;
    select.appendChild(option);
  });
}

window.onload = populateCities;

// ✅ Get weather forecast from 7timer
async function getWeather() {
  const latLon = document.getElementById('city').value;
  if (!latLon) {
    alert("Please select a city");
    return;
  }

  const [lat, lon] = latLon.split(',');
  const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = ""; // clear old data

    data.dataseries.slice(0, 7).forEach((day, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);

      const weather = day.weather.toLowerCase();
      const temp = day.temp2m;
      const iconName = matchIcon(weather);

      const dayBox = document.createElement('div');
      dayBox.classList.add('day');

      dayBox.innerHTML = `
        <p><strong>${date.toDateString()}</strong></p>
        <p>Weather: ${day.weather}</p>
        <p>Temperature: ${temp}°C</p>
        <img src="images/${iconName}" alt="${weather}" width="50" />
      `;

      forecastDiv.appendChild(dayBox);
    });

  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById('forecast').innerHTML = "<p>Error fetching weather data.</p>";
  }
}

// ✅ Match weather condition to icon
function matchIcon(condition) {
  condition = condition.toLowerCase();

  if (condition.includes("clear")) return "clear.png";
  if (condition.includes("pcloudy")) return "pcloudy.png";
  if (condition.includes("mcloudy")) return "mcloudy.png";
  if (condition.includes("cloudy")) return "cloud.png";
  if (condition.includes("humid")) return "fog.png";
  if (condition.includes("lightrain")) return "lightrain.png";
  if (condition.includes("oshower")) return "oshower.png";
  if (condition.includes("ishower")) return "ishower.png";
  if (condition.includes("rain")) return "rain.png";
  if (condition.includes("lightsnow")) return "lightsnow.png";
  if (condition.includes("snow")) return "snow.png";
  if (condition.includes("rainsnow")) return "rainsnow.png";
  if (condition.includes("tsrain")) return "tsrain.png";
  if (condition.includes("tstorm") || condition.includes("thunder")) return "tstorm.png";
  if (condition.includes("wind")) return "windy.png";
  if (condition.includes("cloudy-day")) return "cloudy-day.png";
  if (condition.includes("cloudy-night")) return "cloudy-night.png";

  return "pccloudy.png"; // default
}
