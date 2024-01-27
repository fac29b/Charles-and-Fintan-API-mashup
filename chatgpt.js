import 'dotenv/config';
const OPENAI_KEY = process.env.OPENAI_KEY;

const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: OPENAI_KEY,
  });

async function main() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });
  
    console.log(completion.choices[0]);
  }
  


  async function chatReq(req, res){
    try {
      const message = "Which is the capital of Albania?";
      const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: message }],
        model: "gpt-3.5-turbo",
        
        temperature: 0,
        max_tokens: 1000,
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

main();
