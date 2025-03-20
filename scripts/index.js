// -------------------------------------------------
// Date & Time
// -------------------------------------------------
function setDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateElement = document.querySelector(`.date`);
  dateElement.textContent = `${day}/${month}/${year}`;
}

function startClock() {
  const time = new Date();
  const timeEl = document.querySelector(`.time`);
  let hour = time.getHours();
  let min = time.getMinutes();
  let sec = time.getSeconds();

  if (hour === 0) {
    setDate();
  }

  min = addZero(min);
  sec = addZero(sec);

  timeEl.textContent = `${hour}:${min}:${sec}`;

  if (hour >= 18 || hour < 6) {
    document.body.classList.add("night");
  }

  setTimeout(startClock, 1000);
}

function addZero(num) {
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}

setDate();
startClock();

// -------------------------------------------------
// Weather
// -------------------------------------------------
const tempEl = document.querySelector(`.temperature`);
const weatherEl = document.querySelector(`.weather`);
const humidityEl = document.querySelector(`.humidity`);
const windEl = document.querySelector(`.wind`);
const weatherAPIKey = `4a8281ca022f942e79e774e72f71eb60`;

async function successWeather(loc) {
  console.log(loc);
  const { latitude, longitude } = loc.coords;
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude.toFixed(
    2
  )}&lon=${longitude.toFixed(2)}&units=metric&appid=${weatherAPIKey}`;

  try {
    const apiCall = await fetch(endpoint);
    if (!apiCall.ok) throw apiCall;
    const weatherData = await apiCall.json();
    const {
      main: { humidity, temp },
      weather: {
        [0]: { main },
      },
      wind: { speed },
    } = weatherData;

    tempEl.textContent = `Temperature: ${temp} °C`;
    weatherEl.textContent = `Weather: ${main}`;
    humidityEl.textContent = `Humidity: ${humidity}%`;
    windEl.textContent = `Wind Speed: ${speed} KM/H`;
  } catch (err) {
    console.log(err);
    tempEl.textContent = `Sorry, an error has occurred with updating your weather ${err}`;
  }
}

function errorWeather(err) {
  console.log(err);
  tempEl.textContent = `Sorry, I couldn't grab your location ${err}`;
}

function weather() {
  navigator.geolocation.getCurrentPosition(successWeather, errorWeather);
  setTimeout(weather, 1800000);
}

weather();

// -------------------------------------------------
// News
// -------------------------------------------------
const newsTitleEl = document.querySelector(`.news-title`);

async function successNews() {
  // const endpointTech = `https://www.reutersagency.com/feed/?best-topics=tech&post_type=best`;
  const endpointWorld = `https://cdn.feedcontrol.net/8/1115-TvWAhu4G064WT.xml`;
  // const endpointAPTech = `https://apnews.com/technology.rss`;
  // const endpointAPWorld = `https://apnews.com/world-news.rss`;
  // const endpointAPScience = `https://apnews.com/science.rss`;

  try {
    fetch(endpointWorld)
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((data) => {
        const items = data.querySelectorAll("item");

        function insertNews(element, index) {
          let title = element.querySelector("title");
          let link = element.querySelector("link");
          let newsEl = document.querySelector(`.world-headline-${index}`);
          if (!newsEl) {
            return;
          }

          newsEl.textContent = title.textContent;
          newsEl.href = `${link.textContent}`;
        }

        items.forEach(insertNews);
      });
  } catch (err) {
    console.log(err);
    newsTitleEl.textContent = `Sorry, an error has occurred with updating the news`;
  }
}

function news() {
  successNews();
  setTimeout(news, 10800000);
}

news();

// -------------------------------------------------
// Warframe
// -------------------------------------------------
const fissureEl = document.querySelector(`.fissure-info`);
const arbiEl = document.querySelector(`.arbi-info`);
const sortieEl = document.querySelector(`.sortie-boss`);
const sortieMissionEl1 = document.querySelector(`.sortie-mission-1`);
const sortieMissionEl2 = document.querySelector(`.sortie-mission-2`);
const sortieMissionEl3 = document.querySelector(`.sortie-mission-3`);
const plainsEl = document.querySelector(`.plains-cycle`);
const orbEl = document.querySelector(`.orb-cycle`);
const cambionEl = document.querySelector(`.cambion-cycle`);
const duviriEl = document.querySelector(`.duviri-cycle`);
const archonMissionEl1 = document.querySelector(`.archon-mission-1`);
const archonMissionEl2 = document.querySelector(`.archon-mission-2`);
const archonMissionEl3 = document.querySelector(`.archon-mission-3`);

async function successWarframe() {
  const endpointArbi = `https://api.warframestat.us/pc/arbitration/`;
  const endpointSortie = `https://api.warframestat.us/pc/sortie/`;
  const endpointArchon = `https://api.warframestat.us/pc/archonHunt/`;
  const endpointFissures = `https://api.warframestat.us/pc/fissures/`;
  const endpointPlains = `https://api.warframestat.us/pc/cetusCycle/`;
  const endpointOrb = `https://api.warframestat.us/pc/vallisCycle/`;
  const endpointCambion = `https://api.warframestat.us/pc/cambionCycle/`;
  const endpointDuviri = `https://api.warframestat.us/pc/duviriCycle/`;

  try {
    const apiCall = await fetch(endpointArbi);
    if (!apiCall.ok) throw apiCall;
    const data = await apiCall.json();
    const { enemy, expiry } = data;
    const expiryTime = new Date(expiry);
    const currentTime = new Date();
    const difference = expiryTime - currentTime;
    const minutesToExpiry = Math.floor((difference / (1000 * 60)) % 60);
    arbiEl.textContent = `${enemy} (${minutesToExpiry}m)`;
  } catch (err) {
    console.log(err);
    arbiEl.textContent = `Sorry, an error has occurred with updating this information (check log)`;
  }

  try {
    const apiCall = await fetch(endpointFissures);
    if (!apiCall.ok) throw apiCall;
    const data = await apiCall.json();
    function quick(el) {
      if (el.missionType === "Capture" || el.missionType === "Extermination") {
        return true;
      } else {
        return false;
      }
    }
    const mission = data.find(quick);
    if (mission) {
      fissureEl.textContent = `${mission.enemy} ${mission.missionType} - ${mission.node}`;
    } else {
      fissureEl.textContent = `No fast missions available`;
    }
  } catch (err) {
    console.log(err);
    fissureEl.textContent = `Sorry, an error has occurred with updating this information (check log)`;
  }

  try {
    const apiCall = await fetch(endpointSortie);
    if (!apiCall.ok) throw apiCall;
    const data = await apiCall.json();
    sortieMissionEl1.textContent = `Mission 1: ${data.variants[0].missionType}`;
    sortieMissionEl2.textContent = `Mission 2: ${data.variants[1].missionType}`;
    sortieMissionEl3.textContent = `Mission 3: ${data.variants[2].missionType}`;
  } catch (err) {
    console.log(err);
    sortieEl.textContent = `Sorry, an error has occurred with updating this information (check log)`;
  }

  try {
    const apiCall = await fetch(endpointArchon);
    if (!apiCall.ok) throw apiCall;
    const data = await apiCall.json();
    archonMissionEl1.textContent = `Mission 1: ${data.missions[0].typeKey}`;
    archonMissionEl2.textContent = `Mission 2: ${data.missions[1].typeKey}`;
    archonMissionEl3.textContent = `Mission 3: Assassination`; // ${data.missions[2].typeKey}`;
  } catch (err) {
    console.log(err);
    sortieEl.textContent = `Sorry, an error has occurred with updating this information (check log)`;
  }

  try {
    const apiCall = await fetch(endpointPlains);
    if (!apiCall.ok) throw apiCall;
    const data = await apiCall.json();
    const { state, shortString } = data;
    plainsEl.textContent = `${state.toUpperCase()} (${shortString})`;
  } catch (err) {
    console.log(err);
    plainsEl.textContent = `Sorry, an error has occurred with updating this information (check log)`;
  }

  try {
    const apiCall = await fetch(endpointOrb);
    if (!apiCall.ok) throw apiCall;
    const data = await apiCall.json();
    const { state, shortString } = data;
    orbEl.textContent = `${state.toUpperCase()} (${shortString})`;
  } catch (err) {
    console.log(err);
    orbEl.textContent = `Sorry, an error has occurred with updating this information (check log)`;
  }

  try {
    const apiCall = await fetch(endpointCambion);
    if (!apiCall.ok) throw apiCall;
    const data = await apiCall.json();
    const { state, timeLeft } = data;
    cambionEl.textContent = `${state.toUpperCase()} (${timeLeft})`;
  } catch (err) {
    console.log(err);
    cambionEl.textContent = `Sorry, an error has occurred with updating this information (check log)`;
  }

  try {
    const apiCall = await fetch(endpointDuviri);
    if (!apiCall.ok) throw apiCall;
    const data = await apiCall.json();
    const { state, expiry } = data;
    const expiryTime = new Date(expiry);
    const currentTime = new Date();
    const difference = expiryTime - currentTime;
    const minutesToExpiry = Math.floor((difference / (1000 * 60)) % 60);
    duviriEl.textContent = `${state.toUpperCase()} Spiral (${minutesToExpiry}m)`;
  } catch (err) {
    console.log(err);
    duviriEl.textContent = `Sorry, an error has occurred with updating this information (check log)`;
  }
}

function warframe() {
  successWarframe();
  setTimeout(warframe, 1800000);
}

warframe();
