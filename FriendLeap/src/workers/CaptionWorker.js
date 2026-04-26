import { pipeline } from '@huggingface/transformers';
 
let caption = null;

self.onmessage = async (e) => {
    const { image } = e.data;
    if(!caption){
        caption = await pipeline(
            'image-to-text',
            'Xenova/vit-gpt2-image-captioning'
        )
    }
    const result = await caption(image);
    self.postMessage(result[0].generated_text);
};