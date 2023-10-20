// const express = require('express')

// const app = express()

// app.use(express.json())

// app.get("/", (req, res)=>{
//     res.json("Welcome to the Joke Generator")
// })

// const  OpenAI  = require("openai");
// require("dotenv").config();

// const openai = new OpenAI({key: process.env.OPENAI_API_KEY});

// app.get('/joke', async (req, res) => {
//     const keyword = req.body
//     const prompt = `Tell me a joke about ${keyword}`;
    
//     try {
//         const response = await openai.createCompletion({
//             model: "text-davinci-003",
//             prompt,
//             max_tokens: 50,
//             temperature: 0.7,
//         });
// console.log("res",response);
//         let data = response.data.choices[0].text.trim();
//         if (data ) {
//             let stringWithoutNewlines = data.text.replace(/\n\n/g, "");
//             return res.status(200).json({
//                 success: true,
//                 data: data
//             });
//         } else {
//             return res.status(500).json({ error: 'Invalid API Response' });
//         }
//     } catch (error) {
//       console.log(error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.listen(8080, () => {
//     console.log("Server listening on port 8080");
// });



// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const { connection } = require("./config/db");

// // const { QuestionRoute } = require("./Routes/Questions.Routes");


// const app = express();
// app.use(cors())
// app.use(express.json());

// //Routes
// app.get("/", (req, res) => {
//     res.status(200).send("Welcome to the backend of JokeApp");
// });

// // app.use("/joke", QuestionRoute);



// const port = process.env.PORT || 8080;

// app.listen(port, async () => {
// 	try {
// 		await connection();
// 		console.log(`Listening at port - ${port}`);
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// });



// const express = require('express');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 8080;

// app.use(express.json());

// app.get('/joke', async (req, res) => {
//   try {
//     const keyword = req.query.keyword;
//     const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
//       prompt: `Shayari about ${keyword}`,
//       max_tokens: 100,
//       temperature: 0.7,
//       n: 1
//     }, {
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     const shayari = response.data.choices[0].text.trim();
//     res.json({ shayari });
//   } catch (error) {
//     console.error('Error:', error.response.data);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });



const express = require('express');
const  OpenAI  = require("openai");
require("dotenv").config();
const path = require('path');
const cors = require("cors");
const app = express();
const port = 8080;
app.use(express.json());
app.use(cors());
const { Configuration, OpenAIApi } = require("openai");
app.use(express.static(path.join(__dirname, 'public')));
const openai = new OpenAI({key: process.env.OPENAI_API_KEY});
// async function generateCompletion(input) {
//   try {
//     const prompt = input;
//     const maxTokens = 500;
//     const n = 1;
//     // const configuration = new Configuration({
//     //   apiKey: process.env.OPENAI_API_KEY,
//     // });
//     // const openai = new OpenAIApi(configuration);
    
//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: prompt,
//       max_tokens: maxTokens,
//       n: n
//     });
//     const { choices } = response.data;
//     if (choices && choices.length > 0) {
//       const completion = choices[0].text.trim();
//       return completion;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// }
app.post('/generate', async (req, res) => {
  try { 
    const { content, language, input } = req.body;
    console.log(content, language, input);
    // const response = await generateCompletion(`Give me a ${content} in ${language} of ${input}`);

    const response = await main(content, language, input)
    

    res.json( response[0].message );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

async function main(content, language, input) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: `act as a Professional artist 
    I want you to give me great lines for (quotes,jokes,shayari) and i could ask you to give me specific type of content in hindi or english language and  i will give you a keyword , based on which you could decide the subject for required data, Give me specific response in more than 40 words,
    
    based on above data here is the prompt ,  
    tell me a ${content} in ${language} language about ${input} ` }],
    model: 'gpt-3.5-turbo', //it will be costly to use
    // model:'GPT-3',
  });

  return(chatCompletion.choices);
}

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.send("Welcome to the backend of PunnyPulse")
});
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});