var apiKey = "c6b02be382cc331562fa36791b952fda"


var getWeatherInfo = function(city) {
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        console.log(response);
    })
}

getWeatherInfo();