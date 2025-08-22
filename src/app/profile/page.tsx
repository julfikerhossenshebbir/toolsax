
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
import { updateUserProfile, getUserData, updateUserData } from '@/lib/firebase';
import { Loader2, Upload, User, Scissors, Eye as EyeIcon, Twitter, Github, Globe } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';


async function uploadToImgBB(imageFile: File | Blob): Promise<string | null> {
    const apiKey = "81b8c0708e71005a41112b81b0c0375b";
    if (!apiKey) {
        console.error("imgbb API key is not set.");
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


function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight,
    )
}

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.resolve(null);
  }

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png', 1);
  });
}


export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [bio, setBio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  
  
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/');
      return;
    }
    
    // Always fetch fresh data when user object is available or changes
    const fetchUserData = async () => {
        setDisplayName(user.displayName || '');
        setPhotoURL(user.photoURL || ''); // Set initial basic info

        const data = await getUserData(user.uid);
        if (data) {
            setUsername(data.username || '');
            setContactNumber(data.contactNumber || '');
            setPhotoURL(data.photoURL || user.photoURL || '');
            setBio(data.bio || '');
            setTwitter(data.social?.twitter || '');
            setGithub(data.social?.github || '');
            setWebsite(data.social?.website || '');
        }
    };

    fetchUserData();
  }, [user, loading, router]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Reset crop state
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
      setIsCropModalOpen(true);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };
  
  const handleCropAndUpload = async () => {
    if (!completedCrop || !imgRef.current || !user) {
      return;
    }
    setIsCropModalOpen(false);
    setIsSaving(true);
    try {
        const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
        if (!croppedImageBlob) {
            throw new Error("Could not crop image.");
        }

        const uploadedUrl = await uploadToImgBB(croppedImageBlob);
        if (uploadedUrl) {
            await updateUserProfile(user, { photoURL: uploadedUrl });
            await updateUserData(user.uid, { photoURL: uploadedUrl });
            setPhotoURL(uploadedUrl);
            toast({ title: "Profile picture updated!" });
        } else {
            throw new Error("Image upload failed.");
        }
    } catch (err: any) {
        toast({ variant: 'destructive', title: "Update failed", description: err.message });
    } finally {
        setIsSaving(false);
        setImgSrc('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      await updateUserProfile(user, { displayName });
      const socialLinks = {
          twitter: twitter,
          github: github,
          website: website,
      };
      await updateUserData(user.uid, { 
          name: displayName, 
          contactNumber,
          bio,
          social: socialLinks,
      });
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
    return (
      <div className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto px-4 py-12 flex-grow flex flex-col justify-center">
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>Update your personal information and profile picture.</CardDescription>
                </div>
                {username && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button asChild variant="outline" size="icon">
                            <Link href={`/u/${username}`}>
                                <EyeIcon className="h-4 w-4"/>
                                <span className="sr-only">View Public Profile</span>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Public Profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoURL} alt={displayName} />
                  <AvatarFallback className="text-3xl">
                    {displayName ? displayName.charAt(0).toUpperCase() : <User />}
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
                    {isSaving && !isCropModalOpen ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                disabled
                className="cursor-not-allowed bg-muted"
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
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a little about yourself"
                maxLength={160}
              />
               <p className="text-xs text-muted-foreground text-right">{bio.length}/160</p>
            </div>

            <div className="space-y-4">
                <h3 className="text-base font-medium">Social Links</h3>
                <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/username" className="pl-10" />
                </div>
                <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="twitter.com/username" className="pl-10" />
                </div>
                <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="your-website.com" className="pl-10" />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    
    <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Crop your new profile picture</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
            {imgSrc && (
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                >
                    <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} />
                </ReactCrop>
            )}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCropAndUpload}><Scissors className="mr-2 h-4 w-4" /> Crop & Save</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
