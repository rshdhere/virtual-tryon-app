import { fal } from "@fal-ai/client";

interface TryOnRequest {
    personImage: string;
    garmentImage: string;
}

interface TryOnResponse {
    images: Array<{
        url: string;
        content_type: string;
        file_name: string;
    }>;
}

export async function processTryOn(data: TryOnRequest): Promise<TryOnResponse> {
    try {
        console.log('\n=== Starting Fal.ai Processing ===');
        console.log('Input data:', {
            modelImageUrl: data.personImage?.substring(0, 100),
            garmentImageUrl: data.garmentImage?.substring(0, 100)
        });

        // Verify fal.ai configuration
        console.log('Checking fal.ai credentials:', {
            hasFalKey: !!process.env.FAL_KEY,
            keyLength: process.env.FAL_KEY?.length
        });

        console.log('Calling fal.ai API...');
        const result = await fal.subscribe("fashn/tryon", {
            input: {
                model_image: data.personImage,
                garment_image: data.garmentImage,
                category: "tops",
                garment_photo_type: "auto",
                nsfw_filter: true,
                guidance_scale: 2,
                timesteps: 50,
            },
            logs: true,
            onQueueUpdate: (update) => {
                console.log('Fal.ai Queue Status:', update.status);
                if (update.status === "IN_PROGRESS") {
                    console.log("Processing logs:", update.logs);
                }
            },
        });

        console.log('Fal.ai API Response:', result);

        if (!result || !result.data) {
            throw new Error('Invalid response from fal.ai');
        }

        return result.data as TryOnResponse;
    } catch (error: any) {
        console.error('\n=== Fal.ai Error ===');
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }
} 