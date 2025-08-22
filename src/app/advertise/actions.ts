
'use server';

import { getAuth } from 'firebase-admin/auth';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getStorage } from 'firebase-admin/storage';


async function uploadToFirebaseStorage(image: File): Promise<string> {
    const storage = getStorage();
    const bucket = storage.bucket('gs://toolsaxdb.appspot.com'); 
    
    const fileName = `submitted-ads/${uuidv4()}-${image.name}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
        metadata: {
            contentType: image.type,
        },
    });

    const buffer = Buffer.from(await image.arrayBuffer());
    stream.end(buffer);
    
    return new Promise((resolve, reject) => {
        stream.on('finish', async () => {
            await fileUpload.makePublic();
            resolve(fileUpload.publicUrl());
        });
        stream.on('error', reject);
    });
}

export async function submitAdAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        await initFirebaseAdmin();
        const auth = getAuth();
        const firestore = getFirestore();

        // This is a placeholder for getting the current user's token from the client.
        // In a real app, you would pass the user's ID token from the client.
        // For this example, we'll assume a dummy user.
        const user = { uid: 'dummy-user-id' }; // Replace with actual user logic

        const advertiserName = formData.get('advertiserName') as string;
        const phone = formData.get('phone') as string;
        const linkUrl = formData.get('linkUrl') as string;
        const paymentMethod = formData.get('paymentMethod') as 'bKash' | 'Nagad' | 'Rocket';
        const transactionId = formData.get('transactionId') as string;
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return { success: false, error: 'Ad image is required.' };
        }

        const imageUrl = await uploadToFirebaseStorage(imageFile);
        
        const adData = {
            userId: user.uid,
            advertiserName,
            phone,
            linkUrl,
            imageUrl,
            paymentMethod,
            transactionId,
            status: 'pending' as const,
            submissionDate: new Date().toISOString(),
        };

        await firestore.collection('submittedAds').add(adData);

        return { success: true };
    } catch (error: any) {
        console.error('Error submitting ad:', error);
        return { success: false, error: error.message || 'An unexpected error occurred.' };
    }
}
