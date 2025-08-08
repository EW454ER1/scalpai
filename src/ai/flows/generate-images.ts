// This file uses server-side code.
'use server';

/**
 * @fileOverview Image generation flow using Google Gemini Vision.
 *
 * - generateImages - A function that generates images based on a text prompt.
 * - GenerateImagesInput - The input type for the generateImages function.
 * - GenerateImagesOutput - The return type for the generateImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImagesInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate images from.'),
  style: z
    .string()
    .describe(
      'The style of the image (e.g., cartoon, realistic, 3D, sci-fi, artistic).'  
    )
    .optional(),
});
export type GenerateImagesInput = z.infer<typeof GenerateImagesInputSchema>;

const GenerateImagesOutputSchema = z.object({
  images: z.array(z.string()).describe('An array of generated image data URIs.'),
});
export type GenerateImagesOutput = z.infer<typeof GenerateImagesOutputSchema>;

export async function generateImages(input: GenerateImagesInput): Promise<GenerateImagesOutput> {
  return generateImagesFlow(input);
}

const generateImagesPrompt = ai.definePrompt({
  name: 'generateImagesPrompt',
  input: {schema: GenerateImagesInputSchema},
  output: {schema: GenerateImagesOutputSchema},
  prompt: `Generate 5 different images based on the following description, and return them as a JSON array of data URIs. The style of the image should be {{{style}}}.  If no style is provided, use a realistic style.\n\nDescription: {{{prompt}}}`,
});

const generateImagesFlow = ai.defineFlow(
  {
    name: 'generateImagesFlow',
    inputSchema: GenerateImagesInputSchema,
    outputSchema: GenerateImagesOutputSchema,
  },
  async input => {
    const imagePromises = [];
    for (let i = 0; i < 5; i++) {
      imagePromises.push(
        ai
          .generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: input.prompt,
            config: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
          })
          .then(result => {
            if (!result.media?.url) {
              throw new Error('No image was generated.  Check your prompt and try again.');
            }
            return result.media.url;
          })
      );
    }

    const images = await Promise.all(imagePromises);

    return {images};
  }
);
