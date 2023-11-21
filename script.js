import apiKey from "./config.js";

const button = document.querySelector('#submit-search');
const inputField = document.querySelector('#cityName');
const cityNameContainer = document.querySelector('.city-info')
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const container = document.querySelector(".container");
const today = new Date()

function getCityName(){
    return inputField.value
}

async function getWeatherData(cityName){
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

function removeContainerChildren(){
    container.replaceChildren();
}

function displayLocation(weatherData){
    const city = weatherData["location"]["name"];
    const country = weatherData["location"]["country"];
    cityNameContainer.textContent = `${city}, ${country}`
}

function createWeatherCards(weatherData){

    for(let i= 0; i < 5; i++) {

        const d = new Date()
        const dayOfTheWeek = weekdays[(today.getDay() + i) %7]

        // Create the elements with Data
        const card = document.createElement('div');
        card.classList.add("card");
        if (i === 0) card.classList.add("main-card");

        container.appendChild(card);

        const initialContentBeforeSlideAnimation = document.createElement('div');
        initialContentBeforeSlideAnimation.classList.add("imgBx");
        card.appendChild(initialContentBeforeSlideAnimation);
        

        const cardImg = document.createElement('img');
        cardImg.src = weatherData.forecast.forecastday[i].day.condition.icon;
        cardImg.alt = "Icon describing the following weather: " + weatherData.forecast.forecastday[i].day.condition.text;
        initialContentBeforeSlideAnimation.appendChild(cardImg);
       
        const contentBox = document.createElement("div");
        contentBox.classList.add("contentBx");
        card.appendChild(contentBox);

        const dowContentBeforeSliderAnimation = document.createElement("h2");
        dowContentBeforeSliderAnimation.innerHTML = dayOfTheWeek;
        contentBox.appendChild(dowContentBeforeSliderAnimation);

        const tempDescription = document.createElement("h4");
        tempDescription.innerHTML = weatherData.forecast.forecastday[i].day.condition.text;
        contentBox.appendChild(tempDescription);

        const currentTempBox = document.createElement("div");
        currentTempBox.classList.add("color");
        contentBox.appendChild(currentTempBox)
        console.log(weatherData)

        const currentTempHeader = document.createElement("h3");
        currentTempHeader.innerHTML = "Temp:"
        currentTempBox.appendChild(currentTempHeader);

        const currentTemp = document.createElement("span");
        currentTemp.classList.add("current-temp");

        currentTemp.innerHTML = weatherData.forecast.forecastday[i].day.avgtemp_c + "°C";
        currentTempBox.appendChild(currentTemp);
    
        const minMaxTemperatures = document.createElement("div");
        minMaxTemperatures.classList.add("details");
        contentBox.appendChild(minMaxTemperatures);
    
        const minMaxTempHeader = document.createElement("h3");
        minMaxTempHeader.innerHTML = "More:"
        minMaxTemperatures.appendChild(minMaxTempHeader);
    
        const minTemp = document.createElement("span");
        minTemp.classList.add("min-temp")
        minTemp.innerHTML = weatherData.forecast.forecastday[i].day.mintemp_c  + "°C";
        minMaxTemperatures.appendChild(minTemp);
    
        const maxTemp = document.createElement("span");
        maxTemp.classList.add("max-temp")
        maxTemp.innerHTML = weatherData.forecast.forecastday[i].day.maxtemp_c + "°C";
        minMaxTemperatures.appendChild(maxTemp);
}}

const startWeatherApp = async() => {
    const cityName = getCityName();
    if (cityName !== ""){
        const weatherData = await getWeatherData(cityName);
        removeContainerChildren();
        displayLocation(weatherData);
        createWeatherCards(weatherData);
    };
}

inputField.addEventListener('keyup', async function(event) {
    if (event.code === "Enter") {
        startWeatherApp();
    };
});

button.addEventListener('click', function() {
    startWeatherApp();
})
