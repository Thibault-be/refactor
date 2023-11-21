import apiKey from "./config.js";

const button = document.querySelector('#submit-search');
const inputField = document.querySelector('#cityName');
const cityNameContainer = document.querySelector('.city-info')
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const container = document.querySelector(".container");
const today = new Date()

const getCityName = () =>{ return inputField.value }

const getWeatherData = async(cityName) => {
    const apiURL = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey.key}&q=${cityName}&days=7&aqi=no&alerts=no`
    
    try{
        const response = await fetch(apiURL);
        const weatherData = await response.json();
        return weatherData;
    }catch(error){
        console.error(error)
        return alert("Hey are you sure you are not holding up your map upside down?")
    };
};

const removeContainerChildren = () => {container.replaceChildren()};

const displayLocation = (weatherData) => {
    const city = weatherData["location"]["name"];
    const country = weatherData["location"]["country"];
    cityNameContainer.textContent = `${city}, ${country}`
};

const createElement = (elementType, className) => {
    const newDiv = document.createElement(elementType)
    newDiv.classList.add(className)
    return newDiv
};

const createWeatherCards = (weatherData) => {
    for(let i= 0; i < 5; i++) {
        const d = new Date()
        const dayOfTheWeek = weekdays[(today.getDay() + i) %7]

        const card = createElement("div", "card");
        if (i === 0) card.classList.add("main-card");

        container.appendChild(card);

        const initialContentBeforeSlideAnimation = createElement("div", "imgBx")
        card.appendChild(initialContentBeforeSlideAnimation);
        
        const cardImg = createElement("img", "cardImg");
        cardImg.src = weatherData.forecast.forecastday[i].day.condition.icon;
        cardImg.alt = "Icon describing the following weather: " + weatherData.forecast.forecastday[i].day.condition.text;
        initialContentBeforeSlideAnimation.appendChild(cardImg);
       
        const contentBox = createElement("div", "contentBx");
        card.appendChild(contentBox);

        const dowContentBeforeSliderAnimation = createElement("h2", "title")
        dowContentBeforeSliderAnimation.innerHTML = dayOfTheWeek;
        contentBox.appendChild(dowContentBeforeSliderAnimation);

        const tempDescription = createElement("h4", "temp-description");
        tempDescription.innerHTML = weatherData.forecast.forecastday[i].day.condition.text;
        contentBox.appendChild(tempDescription);

        const currentTempBox = createElement("div", "color")
        contentBox.appendChild(currentTempBox)

        const currentTempHeader = createElement("h3", "current-temp-header");
        currentTempHeader.innerHTML = "Temp:"
        currentTempBox.appendChild(currentTempHeader);

        const currentTemp = createElement("span","current-temp"); 
        currentTemp.innerHTML = weatherData.forecast.forecastday[i].day.avgtemp_c + "°C";
        currentTempBox.appendChild(currentTemp);
    
        const minMaxTemperatures = createElement("div","details");
        contentBox.appendChild(minMaxTemperatures);
    
        const minMaxTempHeader = createElement("h3", "min-max-temp-header");
        minMaxTempHeader.innerHTML = "More:"
        minMaxTemperatures.appendChild(minMaxTempHeader);
    
        const minTemp = createElement("span","min-temp")
        minTemp.innerHTML = weatherData.forecast.forecastday[i].day.mintemp_c  + "°C";
        minMaxTemperatures.appendChild(minTemp);
    
        const maxTemp = createElement("span", "max-temp")
        maxTemp.innerHTML = weatherData.forecast.forecastday[i].day.maxtemp_c + "°C";
        minMaxTemperatures.appendChild(maxTemp);
    };
};

const startWeatherApp = async() => {
    const cityName = getCityName();
    if (cityName !== ""){
        const weatherData = await getWeatherData(cityName);
        removeContainerChildren();
        displayLocation(weatherData);
        createWeatherCards(weatherData);
    };
};

inputField.addEventListener('keyup', async function(event) {
    if (event.code === "Enter") {
        startWeatherApp();
    };
});

button.addEventListener('click', function() {
    startWeatherApp();
});
