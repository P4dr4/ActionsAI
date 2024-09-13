import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function getHuggingFaceResponse(prompt: string) {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        console.error('API key is not defined.');
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
                    max_length: 50,
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

            const firstAnswer = generatedText.match(/\b(yes|no)\b/i);

            if (firstAnswer) {
                console.log('Response:', firstAnswer[0]);
                return firstAnswer[0];
            } else {
                console.log('Response:', generatedText);
                return generatedText;
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
getHuggingFaceResponse("Is this successful? (Only yes or no): " + sanitizedPrompt);
