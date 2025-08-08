'use server';

/**
 * @fileOverview Flow for generating speech from text.
 *
 * - textToSpeech - A function that handles the text to speech conversion.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voice: z.enum(['male', 'female']).describe('The type of voice for the speech (male or female).'),
  mood: z.enum(['none', 'sad', 'angry', 'comedy', 'romantic']).describe('The desired mood for the speech.'),
  dialect: z.enum(['egyptian', 'tunisian', 'saudi', 'kuwaiti', 'lebanese', 'libyan']).describe('The Arabic dialect for the speech.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioUrl: z.string().describe('URL of the generated speech in .wav format.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (input) => {
    // Construct the prompt with mood and dialect instructions.
    let prompt = `(speaking in a ${input.dialect} Arabic dialect) ${input.text}`;
    if (input.mood && input.mood !== 'none') {
        prompt = `(speaking in a ${input.mood} tone, in the ${input.dialect} Arabic dialect) ${input.text}`;
    }


    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // NOTE: Prebuilt voices are not designated as male/female.
            // We are just picking two different ones from the supported list.
            prebuiltVoiceConfig: { voiceName: input.voice === 'male' ? 'Algenib' : 'Achernar' },
          },
        },
      },
      prompt: prompt,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavData = await toWav(audioBuffer);
    const audioUrl = 'data:audio/wav;base64,' + wavData;
    return { audioUrl };
  }
);


async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
