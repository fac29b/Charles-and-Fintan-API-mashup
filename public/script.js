// Object to contain info to send to chatGPT
const gptRequestData = {};
// Variable to pass the Object info as URL parameters
let queryParams;

document.getElementById('weatherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const postcode = document.getElementById('postcode').value; // Use the postcode input value

    fetch(`/geocode?postcode=${encodeURIComponent(postcode)}`) // Fetch geocode data using postcode
        .then(response => response.json())
        .then(geocodeData => {
            const { latitude, longitude } = geocodeData; // Extract latitude and longitude
            return fetch(`/weather?lat=${latitude}&lon=${longitude}`); // Fetch weather data using lat & lon
        })    
        
        .then(response => response.json())
        .then(weatherData => {
            // console.log('This is weather data', weatherData);
            gptRequestData.weather = weatherData.weather[0].main;
            gptRequestData.temperature = weatherData.main.temp;
            gptRequestData.maxTemp = weatherData.main.temp_max;
            gptRequestData.name = weatherData.name;
            gptRequestData.postcode = postcode;
            const resultDiv = document.getElementById('weatherResult');
            resultDiv.innerHTML = `<p>Temperature: ${weatherData.main.temp}°C</p>
                                    <p>Weather: ${weatherData.weather[0].main}</p>
                                    <p>Location: ${weatherData.name}</p>
                                    <p>Coords: ${weatherData.coord.lat}</p>
                                    <p>Postcode: ${postcode}</p>`;// Display weather data
            // Call function to make fetch request to chatGPT
            gptRequest()
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('weatherResult').textContent = 'Error fetching weather data';
        });
});

// Function to make the fetch request to the openAI API
function gptRequest() {
    fetch(`/chat?${queryParams = new URLSearchParams({
        postcode: gptRequestData.postcode,
        weather: gptRequestData.weather,
        temperature: gptRequestData.temperature,
        maxTemp: gptRequestData.maxTemp,
        name: gptRequestData.name,
        conversation: gptRequestData.reply,}).toString()}`)
        .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            gptRequestData.reply += data[0].message.content;
            const gptReply = document.getElementById('gptReply');
            console.log('this is gptRequestData', gptRequestData);
            gptReply.innerText = `${data[0].message.content}`;
          })
      .catch(error => {
        console.error('Error:', error);
      });
};