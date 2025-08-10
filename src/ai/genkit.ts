import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Server-side configuration for Server Components
const config = {
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
};

export const ai = genkit(config);
