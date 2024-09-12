"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
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
                    max_length: 100,
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.length > 0) {
                let generatedText = response.data[0].generated_text;
                const sentences = generatedText.split('. ');
                const uniqueSentences = Array.from(new Set(sentences));
                const formattedText = uniqueSentences.join('. ').trim();
                if (formattedText) {
                    console.log('Response:', formattedText);
                    return;
                }
            }
        }
        catch (error) {
            if ((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.includes('currently loading')) {
                const waitTime = Math.ceil(error.response.data.estimated_time);
                console.log(`Model is still loading. Retrying in ${waitTime} seconds...`);
                setTimeout(() => {
                    getHuggingFaceResponse(prompt);
                }, waitTime * 1000);
            }
            else {
                console.error('Error:', ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
            }
        }
    });
}
getHuggingFaceResponse('Where is USA?');
