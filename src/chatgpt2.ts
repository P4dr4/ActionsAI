import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function getHuggingFaceResponse(prompt: string) {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        console.error('API key is not defined. Make sure you have an .env file with API_KEY defined.');
        return;
    }

    if (!prompt || prompt.trim() === '') {
        console.error('Prompt is empty or invalid.');
        return;
    }

    const model = 'EleutherAI/gpt-neo-1.3B';

    try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            {
                inputs: prompt,
                parameters: {
                    max_length: 100,
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.length > 0) {
            let generatedText = response.data[0].generated_text;

            const sentences = generatedText.split(/[.?!]\s+/);
            const uniqueSentences = Array.from(new Set(sentences));
            const formattedText = uniqueSentences.join('. ').trim();

            if (formattedText) {
                console.log('Response:', formattedText);
                return formattedText;
            }
        }

    } catch (error: any) {
        if (error.response?.data?.error?.includes('currently loading')) {
            const waitTime = Math.ceil(error.response.data.estimated_time);
            console.log(`Model is still loading. Retrying in ${waitTime} seconds...`);
            
            setTimeout(() => {
                getHuggingFaceResponse(prompt);
            }, waitTime * 1000);
        } else {
            console.error('Error:', error.response?.data || error.message);
        }
    }
}

const actionPrompt = process.env.INPUT_PROMPT || 'Default prompt text';

const sanitizedPrompt = actionPrompt.trim();

getHuggingFaceResponse("Is this sucessfull? (Only yes or no) :" + sanitizedPrompt);
