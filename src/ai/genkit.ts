import {genkit, type GenkitConfig} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This is a client-only file.
let config: GenkitConfig;
if (typeof window !== 'undefined') {
  const apiKey = localStorage.getItem('gemini-api-key') || undefined;
  config = {
    plugins: [
      googleAI({
        apiKey: apiKey,
      }),
    ],
    model: 'googleai/gemini-2.0-flash',
  };
} else {
  // Server-side or build-time configuration
  config = {
    plugins: [googleAI()],
    model: 'googleai/gemini-2.0-flash',
  };
}

export const ai = genkit(config);
