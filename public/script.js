// Object to contain info to send to chatGPT
const gptRequestData = {};
// Variable to pass the Object info as URL parameters
let queryParams;
// Array to store conversation
const gptConversation = [];
// Variable to push user input & gpt replies to 
const gptAnswer = document.getElementById('gptAnswer');

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

// Make the activities & weather fetch request to the openAI API
function gptRequest() {
    fetch(`/activities?${queryParams = new URLSearchParams(gptRequestData).toString()}`)
        .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            // add gpt reply to conversation array if user wants to ask further questions
            gptConversation.push(data[0].message.content);
            console.log('this is gptConversation', gptConversation);
            const gptReply = document.getElementById('gptReply');
            console.log('this is gptRequestData', gptRequestData);
            gptReply.innerText = `${data[0].message.content}`;
          })
      .catch(error => {
        console.error('Error:', error);
      });
};

// Takes user response and adds it to gptConversation array before calling gptQuestion()
document.getElementById('userInput').addEventListener('submit', function(e) {
  e.preventDefault();
  let userQuestion = document.getElementById('userQuestion').value;
  gptConversation.push(userQuestion);
  gptAnswer.innerHTML += `<p>${userQuestion}</p>`;
  document.getElementById('userQuestion').value = '';

  gptQuestion();
});

// For continuing conversation between user and chatGPT
function gptQuestion() {
  const userInput = encodeURIComponent(JSON.stringify(gptConversation));
  const url = `/chat?userInput=${userInput}`;
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    gptConversation.push(data[0].message.content);
    console.log('this is 2nd gptConversation', gptConversation);    
    gptAnswer.innerHTML += `<p>${data[0].message.content}</p>`;
  })
};