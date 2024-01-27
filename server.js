import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';


const app = express();
const PORT = 3000;

const WEATHER_API_KEY =process.env.WEATHER_API_KEY;

app.use(express.static('public'));

// Route for geocoding using Postcodes.io
app.get('/geocode', async (req, res) => {
    const { postcode } = req.query; // Receiving postcode from the client
    const geocodeUrl = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`;
    

    try {
        const response = await fetch(geocodeUrl);
        const geocodeData = await response.json();
        if (geocodeData.status === 200 && geocodeData.result) {
            // Directly accessing latitude and longitude from the geocodeData result
            const { latitude, longitude } = geocodeData.result;
            res.json({ latitude, longitude });
        } else {
            throw new Error('Invalid postcode or data not found');
        }
    } catch (error) {
        console.error('Error in geocoding:', error);
        res.status(500).send('Error in geocoding');
    }
});

// Route for fetching weather data
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query; // Receiving latitude and longitude from the client
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    
console.log(weatherUrl)
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

console.log("this is it", process.env)

