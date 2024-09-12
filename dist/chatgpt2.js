"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const dotenv = require("dotenv");
dotenv.config();
function getHuggingFaceResponse(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error('API key is not defined. Make sure you have an .env file with API_KEY defined.');
            return;
        }
        const model = 'EleutherAI/gpt-neo-1.3B';
        try {
            const response = yield axios_1.default.post(`https://api-inference.huggingface.co/models/${model}`, {
                inputs: prompt,
                parameters: {
                    max_length: 50,
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.length > 0) {
                let generatedText = response.data[0].generated_text;
                const formattedText = generatedText
                    .replace(/\n\s*\n/g, '\n') // Remove excessive line breaks
                    .trim(); // Remove extra spaces at start/end
                if (formattedText) {
                    console.log('Response:', formattedText);
                    return; // Stop further processing if valid text is found
                }
            }
        }
        catch (error) {
            if ((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.includes('currently loading')) {
                const waitTime = Math.ceil(error.response.data.estimated_time);
                console.log(`Model is still loading. Retrying in ${waitTime} seconds...`);
                setTimeout(() => {
                    getHuggingFaceResponse(prompt);
                }, waitTime * 1000); // Wait for the estimated loading time before retrying
            }
            else {
                console.error('Error:', ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
            }
        }
    });
}
getHuggingFaceResponse('How much is 3 + 2?');
