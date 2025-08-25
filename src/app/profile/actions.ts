'use server';

export async function uploadImageAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
    const imageFile = formData.get('image') as File;
    if (!imageFile) {
        return { success: false, error: 'No image file found.' };
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
        return { success: false, error: 'Image upload service is not configured.' };
    }

    const uploadFormData = new FormData();
    uploadFormData.append("image", imageFile);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: uploadFormData,
        });
        
        const result = await response.json();
        
        if (result.success) {
            return { success: true, url: result.data.url };
        } else {
            return { success: false, error: result.error.message || 'Image upload failed on the server.' };
        }
    } catch (error) {
        console.error("Error uploading to imgbb:", error);
        return { success: false, error: 'An unexpected error occurred during upload.' };
    }
}
