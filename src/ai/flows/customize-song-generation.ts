'use server';

/**
 * @fileOverview Flow for customizing song generation with voice type, language, song type, and music style.
 *
 * - customizeSongGeneration - A function that handles the customized song generation process.
 * - CustomizeSongGenerationInput - The input type for the customizeSongGeneration function.
 * - CustomizeSongGenerationOutput - The return type for the customizeSongGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const CustomizeSongGenerationInputSchema = z.object({
  lyrics: z.string().describe('The lyrics of the song to generate.'),
  voiceType: z.enum(['male', 'female']).describe('The type of voice for the song (male or female).'),
  language: z.enum(['arabic', 'english', 'spanish']).describe('The language of the song.'),
  songType: z.enum(['romantic', 'children', 'rap', 'religious']).describe('The type or genre of the song.'),
  musicStyle: z.enum(['piano', 'oud', 'electro', 'kpop']).describe('The music style or instrument for the song.'),
});
export type CustomizeSongGenerationInput = z.infer<typeof CustomizeSongGenerationInputSchema>;

const CustomizeSongGenerationOutputSchema = z.object({
  songUrl: z.string().describe('URL of the generated song in .mp3 format.'),
  coverImageUrl: z.string().describe('URL of the generated cover image for the song.'),
});
export type CustomizeSongGenerationOutput = z.infer<typeof CustomizeSongGenerationOutputSchema>;

export async function customizeSongGeneration(
  input: CustomizeSongGenerationInput
): Promise<CustomizeSongGenerationOutput> {
  return customizeSongGenerationFlow(input);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (lyrics) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: lyrics,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavData = await toWav(audioBuffer);
    return 'data:audio/wav;base64,' + wavData;
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


const customizeSongGenerationFlow = ai.defineFlow(
  {
    name: 'customizeSongGenerationFlow',
    inputSchema: CustomizeSongGenerationInputSchema,
    outputSchema: CustomizeSongGenerationOutputSchema,
  },
  async (input) => {
    // Generate song and image in parallel
    const [songUrl, imageResult] = await Promise.all([
      textToSpeechFlow(input.lyrics),
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Create a song cover for a ${input.songType} song with a ${input.musicStyle} style. The lyrics are: ${input.lyrics}`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    ]);

    const coverImageUrl = imageResult.media?.url ?? 'https://placehold.co/400x400.png';

    return { songUrl, coverImageUrl };
  }
);
