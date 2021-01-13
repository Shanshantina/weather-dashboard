// my api key number
var apiKey = "c6b02be382cc331562fa36791b952fda"
var searchWeather = document.getElementById("searchWeather");
var weatherIcon = document.querySelector(".weather-icon");
var city = document.getElementById("cityname");
// get the current day date
var today = new Date();
var date = today.getDate();
var month = today.getMonth()+1;
var year = today.getFullYear();



var getWeatherInfo = function(event) {
    event.preventDefault();
    // get the input search city name
    var cityName = city.value.trim();
    // get Openweather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    // request the information from Openweather website and use json to return the info
    fetch(apiUrl).then(function(response) {
        return response.json(); 
    // display the information to the dashboard   
    }) 
    .then(function(data) {    
        displayWeather(data); 
        displayUV(data); 
    })
}

// show the weather information of the searched city
function displayWeather(d) {
    // declare variables to html elements
    var searchedCity = document.getElementById("searchedCity");  
    var searchedTemperature = document.getElementById("cityTemperature");
    var searchedHumidity = document.getElementById("cityHumidity");
    var searchedWindSpeed = document.getElementById("cityWindSpeed");
    
    // get the current date and calculate the temperature to celsius and fahrenheit
    var currentDate = month + "/" + date + "/" + year;     
    var celsius = Math.round(parseFloat(d.main.temp) - 273.15);
    var fahrenheit = Math.round((parseFloat((d.main.temp)-273.15)*1.8) + 32);

    // get weather icon image from Openweather website
    var icon = d.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png";
    
    // display the city name, date, weather condition, temperature, humidity, and wind speed to the website
    searchedCity.innerHTML = d.name + " (" + currentDate + ") " + ("<img src = '" + iconUrl + "'>");
    searchedTemperature.innerHTML = celsius + "&#8451" + " / " + fahrenheit + "&#x2109";
    searchedHumidity.innerHTML = d.main.humidity + "%";
    searchedWindSpeed.innerHTML = d.wind.speed + "MPH";    
}


// display UV data linked from Openweather website
function displayUV (d) {
    var searchedUV= document.getElementById("cityUV");

    var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + d.coord.lat + "&lon=" + d.coord.lon + "&appid=" + apiKey + "&cnt";

   fetch(uvUrl).then(function(response) {
       return response.json();
   })
   .then(function(data) {   
       // display the current UVI 
       searchedUV.innerHTML = data.value;

       // compare the current UVI with the standard UVI, the background color change depend on the UVI number
       if (data.value >0 && data.value <=2.99) { 
           searchedUV.classList.remove("moderate");
           searchedUV.classList.remove("high");
           searchedUV.classList.remove("veryHigh");
           searchedUV.classList.remove("extreme");       
           searchedUV.classList.add("low");
       } else if (data.value >=3 && data.value <=5.99) {
           searchedUV.classList.remove("low");
           searchedUV.classList.remove("high");
           searchedUV.classList.remove("veryHigh");
           searchedUV.classList.remove("extreme");
           searchedUV.classList.add("moderate");
       } else if (data.value >=6 && data.value <=7.99) {
           searchedUV.classList.remove("low");
           searchedUV.classList.remove("moderate");
           searchedUV.classList.remove("veryHigh");
           searchedUV.classList.remove("extreme");
           searchedUV.classList.add("high");
       } else if (data.value >=8 && data.value <=10.99) {
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


// get 5-day forecast from Openweather website
function forecast (d) {

}


// when click the search button, get the city weather information
searchWeather.addEventListener("click", getWeatherInfo);