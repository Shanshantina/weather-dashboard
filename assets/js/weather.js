// my api key number
var apiKey = "c6b02be382cc331562fa36791b952fda"
var searchWeather = document.getElementById("searchWeather");
var weatherIcon = document.querySelector(".weather-icon");
var city = document.getElementById("cityname");
var date = moment().format("LL");


var getWeatherInfo = function(city) {
    // get Openweather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    // request the information from Openweather website and use json to return the info
    fetch(apiUrl).then(function(response) {
        // check if the request was successful
        if (response.ok) {
            // display the information to the dashboard   
            return response.json()
            .then(function(data) {    
                displayWeather(data); 
                displayUV(data);
                fiveDaysForecast(data);
                retreiveHistory(); 
            })
        } else {
            alert("Error: " + response.statusText);
        } 
    }) 
}

function inputCity(event) {
    event.preventDefault();
    // get the input search city name
    var cityName = city.value.trim().toUpperCase();

       if(!cityName) {
        alert("Please input a city name.");
        return false;
    } else {
        var inputNames = {
            cityName: cityName
        }
    }
    // save the history to location storage
    var searchHistory = localStorage.getItem("searchHistory");
    if (searchHistory === null) {
        searchHistory = [];
    } else {
        searchHistory = JSON.parse(searchHistory);
    }
    searchHistory.push(inputNames);
    var newCities = JSON.stringify(searchHistory);
    localStorage.setItem("searchHistory", newCities); 
    getWeatherInfo(cityName);
    city.value = "";
}

// when click the search button, get the city weather information
searchWeather.addEventListener("click", inputCity);

// show the weather information of the searched city
function displayWeather(d) {
    // declare variables to html elements
    var searchedCity = document.getElementById("searchedCity");  
    var searchedTemperature = document.getElementById("cityTemperature");
    var searchedHumidity = document.getElementById("cityHumidity");
    var searchedWindSpeed = document.getElementById("cityWindSpeed");
 
    
    // calculate the temperature to celsius and fahrenheit
    var celsius = Math.round(parseFloat(d.main.temp) - 273.15);
    var fahrenheit = Math.round((parseFloat((d.main.temp)-273.15)*1.8) + 32);

    // get weather icon image from Openweather website
    var icon = d.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png";
    
    // display the city name, date, weather condition, temperature, humidity, and wind speed to the website
    searchedCity.innerHTML = d.name + " (" + date + ") " + ("<img src = '" + iconUrl + "'>");
    searchedTemperature.innerHTML = "Temperature: "+ celsius + "&#8451" + " / " + fahrenheit + "&#x2109";
    searchedHumidity.innerHTML = "Humidity: " + d.main.humidity + "%";
    searchedWindSpeed.innerHTML = "Wind Speed: " + d.wind.speed + "MPH";
}

// display UV data linked from Openweather website
function displayUV (d) {
    
    var uvIndex = document.getElementById("uvIndex");
    uvIndex.innerHTML = "UV Index: ";

    var uvUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + d.coord.lat + "&lon=" + d.coord.lon + "&exclude=current,minutely,hourly,alerts" + "&appid=" + apiKey;

   fetch(uvUrl).then(function(response) {
       return response.json();
   })
   .then(function(data) {   
       // display the current UVI 
       var searchedUV= document.createElement("span");
       searchedUV.innerHTML = data.daily[0].uvi;
       uvIndex.appendChild(searchedUV);

       // compare the current UVI with the standard UVI, the background color change depend on the UVI number
       if (data.daily[0].uvi >0 && data.daily[0].uvi <=2.99) { 
           searchedUV.classList.remove("moderate");
           searchedUV.classList.remove("high");
           searchedUV.classList.remove("veryHigh");
           searchedUV.classList.remove("extreme");       
           searchedUV.classList.add("low");
       } else if (data.daily[0].uvi >=3 && data.daily[0].uvi <=5.99) {
           searchedUV.classList.remove("low");
           searchedUV.classList.remove("high");
           searchedUV.classList.remove("veryHigh");
           searchedUV.classList.remove("extreme");
           searchedUV.classList.add("moderate");
       } else if (data.daily[0].uvi >=6 && data.daily[0].uvi <=7.99) {
           searchedUV.classList.remove("low");
           searchedUV.classList.remove("moderate");
           searchedUV.classList.remove("veryHigh");
           searchedUV.classList.remove("extreme");
           searchedUV.classList.add("high");
       } else if (data.daily[0].uvi >=8 && data.daily[0].uvi <=10.99) {
           searchedUV.classList.remove("low");
           searchedUV.classList.remove("moderate");
           searchedUV.classList.remove("high");
           searchedUV.classList.remove("extreme");
           searchedUV.classList.add("veryHigh");
       } else {
           searchedUV.classList.remove("low");
           searchedUV.classList.remove("moderate");
           searchedUV.classList.remove("high");
           searchedUV.classList.remove("veryHigh");
           searchedUV.classList.add("extreme");
       }
   })
}


// display 5-days weather
function fiveDaysForecast(d) {
    var forecast = document.getElementById("forecast");
    forecast.textContent = "";
    var forecastUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + d.coord.lat + "&lon=" + d.coord.lon + "&exclude=current,minutely,hourly,alerts" + "&appid=" + apiKey;
    // use fetch to send the request and use json to receive the response
    fetch(forecastUrl).then(function(response) {
        return response.json();
    })
    // display 5-days forecast in here
    .then(function(data) {    

        for (var i = 0; i< 5; i++) {

            // put one day weather information in one card box
            var forecastEl = document.createElement("div");
            forecastEl.classList = "card-body";
            forecast.appendChild(forecastEl);

            // display dates
            var dateDiv = document.createElement("div");
            dateDiv.classList = "card-title";
            var forecasetDate = moment.utc(data.daily[i].dt * 1000).format("dddd, MMM DD");
            dateDiv.innerHTML = '<h5 class="font-weight-bold">' + forecasetDate + "</h5>";
            forecastEl.appendChild(dateDiv);

            // display weather icon
            var iconDiv = document.createElement("div");
            iconDiv.innerHTML = "<img src = '" + "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png" + "'>";
            forecastEl.appendChild(iconDiv);

            // display temperature
            var temperatureDiv = document.createElement("div");
            temperatureDiv.classList = "card-text";
            temperatureDiv.innerHTML = "<p>" + Math.round(parseFloat(data.daily[i].temp.day) - 273.15) + "&#8451" + " / " 
                               + Math.round((parseFloat((data.daily[i].temp.day)-273.15)*1.8) + 32) + "&#x2109" + "</p>";
            forecastEl.appendChild(temperatureDiv);

            // display humidity
            var humidityDiv = document.createElement("div");
            humidityDiv.classList = "card-text";
            humidityDiv.innerHTML = "<p>" + "Humidity: " + data.daily[i].humidity + "%" + "</p>";
            forecastEl.appendChild(humidityDiv);        
        }
    })
}


// clear the history
var clearHistory = document.getElementById("clear-history");
clearHistory.addEventListener("click", function() {
localStorage.clear();
location.reload();
});

// retreive search history
function retreiveHistory() {
    // retreive local storage
    var cityList = document.getElementById("history-list");
    var searchHistory = localStorage.getItem("searchHistory");
    searchHistory = JSON.parse(searchHistory);
    cityList.textContent="";
     
    if (searchHistory !==null) {
        for (var i=0; i<searchHistory.length;i++) {
            var createList = document.createElement("li");
            createList.textContent = searchHistory[i].cityName;
            createList.classList = "btn";
            createList.setAttribute("data-city", searchHistory[i].cityName);
            // createList.setAttribute("type", "submit");
            cityList.append(createList);
            createList.addEventListener("click", function() {
                var listButton = this.getAttribute("data-city");
                getWeatherInfo(listButton);
            })
        }   
    }
}
