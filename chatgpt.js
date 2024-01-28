import 'dotenv/config';
import { OpenAI } from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ key: OPENAI_API_KEY });

export async function handleChatRequest(weatherData) {
    console.log('test');
    if (!weatherData) {
        throw new Error('Weather data not available');
    }
    try {

          // Prepare data to send to ChatGPT
          const chatData = `Temperature: ${weatherData.main.temp}°C, Weather: ${weatherData.weather[0].main}, Location: ${weatherData.name}`;

          // Make a request to the OpenAI API for chat functionality
          const response = await openai.chat.completions.create({
              messages: [
                  { role: 'system', content: 'You are a helpful assistant.' },
                  { role: 'user', content: chatData },
              ],
              model: 'gpt-3.5-turbo',
              temperature: 0.7,
              max_tokens: 150,
          });
  
          const generatedText = response.choices[0].text;
          return generatedText;
      } catch (error) {
          console.error('Error handling chat:', error);
          throw new Error('Error handling chat');
      }      
};
