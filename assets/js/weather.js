var apiKey = "c6b02be382cc331562fa36791b952fda"
var cityName = document.getElementById("cityname");
var searchName = document.getElementById("searchName");


var getWeatherInfo = function(event) {

    event.preventDefault();

    var input = cityName.value.trim();
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        return response.json(); 
        
    }) 
    .then(function(data) {
        console.log(data);
    })


}

// getWeatherInfo();

searchName.addEventListener("click", getWeatherInfo);