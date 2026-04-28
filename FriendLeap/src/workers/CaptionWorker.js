import { pipeline, env } from '@huggingface/transformers';

env.allowRemoteModels = true;
env.useFSCache = true;


let caption = null;

self.onmessage = async (e) => {
    const { image, requestId } = e.data;


    try {
        if (!caption) {
            caption = await pipeline(
                'image-to-text',
                'Xenova/vit-gpt2-image-captioning',
                { revision: 'main', dtype: 'fp32'}
            );
        }

        const result = await caption(image);

        self.postMessage({
            success: true,
            requestId,
            data: { caption: result[0].generated_text }
        });

    } catch (err) {
        console.error("FULL ERROR:", err);

        self.postMessage({
            success: false,
            requestId,
            error: err.message
        });
    }
};