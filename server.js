import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config';


const app = express();
const PORT = 3000;

// Replace with your actual API keys
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const GEOCODER_API_KEY = process.env.GEOCODER_API_KEY;

app.use(express.static('public'));

// Route for geocoding
app.get('/geocode', async (req, res) => {
    const { city } = req.query;
    const geocodeUrl = `https://api.geocoder.com/v1/geocode?city=${encodeURIComponent(city)}&apikey=${GEOCODER_API_KEY}`;

    try {
        const response = await fetch(geocodeUrl);
        const geocodeData = await response.json();
        // Extract latitude and longitude from geocodeData based on its structure
        const { latitude, longitude } = geocodeData.results[0].geometry.location; // Modify according to actual API response
        res.json({ latitude, longitude });
    } catch (error) {
        console.error('Error in geocoding:', error);
        res.status(500).send('Error in geocoding');
    }
});

// Route for fetching weather data
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

    try {
        const response = await fetch(weatherUrl);
        const weatherData = await response.json();
        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error retrieving weather data');
    }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
