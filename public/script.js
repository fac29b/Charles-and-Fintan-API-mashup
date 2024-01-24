const apiResponse = document.getElementById('chatGPTresponse');

// Make a fetch request to your server's /police endpoint
function fetchPolice() {
    
    fetch('/police')
    .then(response => response.json())
    .then(data => {
        // Handle the received police data
        console.log(data);
        apiResponse.innerText = `Temperature: ${data}, Description: ${data.description}`;
    })
    .catch(error => {
        // Handle errors
        console.error('the error is ', error);
        apiResponse.innerText = 'Failed to fetch police data.';
    });
}

// A global variable to store the data from the fetch request. I thought this might be
// a good way to get access to the data we'll need to send to chatGPT to produce the summary?
let weatherData = '';

// Make a fetch request to the server's /weather endpoint
function fetchWeather() {    
    fetch('/weather')
    .then(response => response.json())
    .then(data => {
        // The full JSON object gets logged to the console. Can view the different properties available
        // so it's easy to see what info we have to work with.
        console.log(data);
        // Handle the received weather data
        apiResponse.innerText = `Temperature: ${data.main.temp}, Description: ${data.weather[0].description}`;
        // Passing the data JSON to weatherData
        weatherData = data;
    })
    .catch(error => {
        // Handle errors
        console.error('the error is ', error);
        apiResponse.innerText = 'Failed to fetch weather data.';
    });
};