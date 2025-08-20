
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/firebase';
import { Loader2, Upload, User } from 'lucide-react';

async function uploadToImgBB(imageFile: File): Promise<string | null> {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
        console.error("imgbb API key is not set in environment variables.");
        return null;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        if (result.success) {
            return result.data.url;
        } else {
            console.error("imgbb upload failed:", result.error.message);
            return null;
        }
    } catch (error) {
        console.error("Error uploading to imgbb:", error);
        return null;
    }
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
      // Save/retrieve contact number to local storage, associated with user UID
      setContactNumber(localStorage.getItem(`contact_${user.uid}`) || '');
    }
  }, [user, loading, router]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setIsSaving(true);
    const uploadedUrl = await uploadToImgBB(file);
    setIsSaving(false);

    if (uploadedUrl) {
      try {
        setIsSaving(true);
        await updateUserProfile(user, { photoURL: uploadedUrl });
        setPhotoURL(uploadedUrl);
        toast({ title: "Profile picture updated!" });
      } catch (err: any) {
        toast({ variant: 'destructive', title: "Update failed", description: err.message });
      } finally {
        setIsSaving(false);
      }
    } else {
      toast({ variant: 'destructive', title: "Image upload failed", description: "Could not upload image to imgbb. Please check your API key." });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      await updateUserProfile(user, { displayName });
      localStorage.setItem(`contact_${user.uid}`, contactNumber);
      toast({ title: 'Profile saved successfully!' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Save failed',
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading || !user) {
      return null; // Or a loading skeleton
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your personal information and profile picture.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoURL} alt={displayName} />
                  <AvatarFallback className="text-3xl">
                    {displayName ? displayName[0].toUpperCase() : <User />}
                  </AvatarFallback>
                </Avatar>
                <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={handleAvatarClick}
                    disabled={isSaving}
                >
                    {isSaving && fileInputRef.current?.files?.length ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
                    <span className="sr-only">Upload picture</span>
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            
             <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
                className="cursor-not-allowed bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number (Optional)</Label>
              <Input
                id="contactNumber"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Your phone number"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

