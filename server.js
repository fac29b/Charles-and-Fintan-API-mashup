// server.js
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// This is example code from the FAC guide. Not sure if it will be useful 
// or not. Please feel free to delete/re-write as necessary :)
app.get('/weather', async (req, res) => {
    const weatherData = await fetch('URL_TO_WEATHER_API').then(res => res.json());
    res.json(weatherData); // <-- respond to http request with json data
});

app.get('/police', async (req, res) => {
    const policeData = await fetch('URL_TO_POLICE_API').then(res => res.json());
    res.json(policeData);
});