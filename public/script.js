// Variables to contain info to send to chatGPT
const gptRequestData = {};
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
            gptRequestData.weather = weatherData.weather[0].main;
            gptRequestData.postcode = postcode;
            const resultDiv = document.getElementById('weatherResult');
            resultDiv.innerHTML = `<p>Temperature: ${weatherData.main.temp}°C</p>
                                    <p>Weather: ${weatherData.weather[0].main}</p>
                                    <p>Location: ${weatherData.name}</p>
                                    <p>Coords: ${weatherData.coord.lat}</p>
                                    <p>Postcode: ${postcode}</p>`;// Display weather data
            testChat()
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('weatherResult').textContent = 'Error fetching weather data';
        });
});

function testChat() {

    fetch(`/chat?${queryParams = new URLSearchParams({
        postcode: gptRequestData.postcode,
        weather: gptRequestData.weather}).toString()}`)
        .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            const gptReply = document.getElementById('gptReply')
            gptReply.innerText = `${data[0].message.content}`
          })
      .catch(error => {
        console.error('Error:', error);
      });
}