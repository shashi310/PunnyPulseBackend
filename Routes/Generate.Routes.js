const express = require("express");
const { verify } = require('../middleware/jwtAuth.middleware');
const Generate = express.Router();
const  OpenAI  = require("openai");
const { HistoryModel } = require("../Models/history.model");

require("dotenv").config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY ||"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"});




Generate.post('/generate',verify, async (req, res) => {
    try { 
        const { content, language, input } = req.body;
        console.log(content, language, input);
        // const response = await generateCompletion(`Give me a ${content} in ${language} of ${input}`);
    
        const response = await main(content, language, input)
    //saving Data in history model
        let data= response[0].message.content
        console.log("USER ID", req.body);
        const history = new HistoryModel({
          body: data,
          userID: req.body.userId,
          date: Date(),
        });
        await history.save();
    
        //display the response from OPen AI
        res.json( response[0].message );
    
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
   
})



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


// const main= async(content, language, input)=>{
//     const chatCompletion = await openai.chat.completions.create({
//         messages: [{ role: 'user', content: `act as a Professional artist 
//         I want you to give me great lines for (quotes,jokes,shayari) and i could ask you to give me specific type of content in hindi or english language and  i will give you a keyword , based on which you could decide the subject for required data, Give me specific response in more than 40 words,
        
//         based on above data here is the prompt ,  
//         tell me a ${content} in ${language} language about ${input} ` }],
//         model: 'gpt-3.5-turbo', //it will be costly to use
//         // model:'GPT-3',
//       });
    
//       return(chatCompletion.choices);
// }

module.exports = { Generate };