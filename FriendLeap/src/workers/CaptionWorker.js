import { pipeline } from '@huggingface/transformers';
 
let caption = null;

self.onmessage = async (e) => {
    const { image, requestId } = e.data;
    try {
        if(!caption) {
            caption = await pipeline(
                'image-to-text',
                'Xenova/vit-gpt2-image-captioning'
            );
        }
        const response = await fetch(image);
        const blob = await response.blob();
        const result = await caption(blob);
        self.postMessage({
            success: true,
            requestId,
            data: { caption: result[0].generated_text }
        });
    } catch(err) {
        self.postMessage({
            success: false,
            requestId,
            error: err.message,
            requestId, 
        });
    }
};