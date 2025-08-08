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

const generateSongPrompt = ai.definePrompt({
  name: 'generateSongPrompt',
  input: {schema: CustomizeSongGenerationInputSchema},
  output: {schema: CustomizeSongGenerationOutputSchema},
  prompt: `You are an AI music generator. Generate a song based on the following input:

Lyrics: {{{lyrics}}}
Voice Type: {{{voiceType}}}
Language: {{{language}}}
Song Type: {{{songType}}}
Music Style: {{{musicStyle}}}

Ensure the song is complete and downloadable in .mp3 format. Also, generate a cover image URL for the song.
`,
});

const customizeSongGenerationFlow = ai.defineFlow(
  {
    name: 'customizeSongGenerationFlow',
    inputSchema: CustomizeSongGenerationInputSchema,
    outputSchema: CustomizeSongGenerationOutputSchema,
  },
  async input => {
    const {output} = await generateSongPrompt(input);
    return output!;
  }
);
