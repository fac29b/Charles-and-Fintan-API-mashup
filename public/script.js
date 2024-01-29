// Object to contain info to send to chatGPT
const gptRequestData = {};
// Variable to pass the Object info as URL parameters
let queryParams;

// Array to store the conversation history
let conversationHistory = [];

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
            // Call function to make fetch request to chatGPT
            gptRequest()
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('weatherResult').textContent = 'Error fetching weather data';
        });
});

// Function to make the fetch request to the openAI API
function gptRequest(userInput) {
  // Add user input to conversation history
  if (userInput) {
      conversationHistory.push({ role: 'user', content: userInput });
  }

  fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory })
  })
  .then(response => response.json())
  .then(data => {
      const lastResponse = data[data.length - 1]; // Assuming the last message is from GPT
      conversationHistory.push({ role: 'system', content: lastResponse.content }); // Update history with GPT response

      // Display the latest GPT response
      const gptReply = document.getElementById('gptReply');
      gptReply.innerText += `\nGPT: ${lastResponse.content}`; // Append the latest response to the display
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

function sendToGPT() {
  const userInputField = document.getElementById('userInput');
  const userInput = userInputField.value;
  if (userInput.trim()) {
      gptRequest(userInput);
      userInputField.value = ''; // Clear the input field
  }
}

document.getElementById('sendButton').addEventListener('click', sendToGPT);




