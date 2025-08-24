
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Download, Image as ImageIcon, Palette, Text, Brush, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Helper to convert hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const initialSettings = {
    title: '10 Things I Learned While Doing Nothing',
    organization: 'My Company',
    logo: 'https://i.ibb.co/3sW2bMh/logo.png',
    theme: '#8b5cf6', // Indigo-500
    fontFamily: 'Poppins',
    ratio: '16:9',
    background: 'pattern1',
    foreground: '#111827', // Gray-900
    subtext: '#4b5563', // Gray-600
};

export default function ThumbnailGenerator() {
    const [settings, setSettings] = useState(initialSettings);
    const { toast } = useToast();
    const previewRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (key: keyof typeof settings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };
    
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange('logo', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExport = () => {
        if (previewRef.current) {
            html2canvas(previewRef.current, {
                allowTaint: true,
                useCORS: true,
                backgroundColor: null, 
                scale: 2
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'thumbnail.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                toast({ title: 'Exported!', description: 'Your thumbnail has been downloaded.' });
            }).catch(err => {
                console.error("Oops, something went wrong!", err);
                toast({ variant: "destructive", title: 'Export Failed', description: 'Could not generate the image.' });
            });
        }
    };
    
    const handleReset = () => {
        setSettings(initialSettings);
        if(fileInputRef.current) fileInputRef.current.value = "";
        toast({ title: 'Reset!', description: 'All settings have been reset to their default values.' });
    };

    const aspectRatio = settings.ratio === '16:9' ? 16 / 9 : 1;

    const backgroundStyles = {
        pattern1: { background: `linear-gradient(135deg, ${hexToRgba(settings.theme, 0.1)} 25%, transparent 25%), linear-gradient(225deg, ${hexToRgba(settings.theme, 0.1)} 25%, transparent 25%), linear-gradient(45deg, ${hexToRgba(settings.theme, 0.1)} 25%, transparent 25%), linear-gradient(315deg, ${hexToRgba(settings.theme, 0.1)} 25%, #ffffff 25%)`, backgroundSize: '40px 40px' },
        pattern2: { background: `radial-gradient(circle, ${hexToRgba(settings.theme, 0.15)} 20%, transparent 20%), radial-gradient(circle, ${hexToRgba(settings.theme, 0.15)} 20%, transparent 20%) 20px 20px, radial-gradient(circle, #ffffff 10%, transparent 15%) 20px 0, radial-gradient(circle, #ffffff 10%, transparent 15%) 0 20px`, backgroundSize: '40px 40px', backgroundColor: '#ffffff' },
        gradient: { background: `linear-gradient(45deg, ${settings.theme}, ${hexToRgba(settings.theme, 0.5)})` },
        solid: { backgroundColor: '#f9fafb' }
    };
    
    const fontStyles = {
        Poppins: "'Poppins', sans-serif",
        Montserrat: "'Montserrat', sans-serif",
        Oswald: "'Oswald', sans-serif",
        Lato: "'Lato', sans-serif",
        'Playfair Display': "'Playfair Display', serif",
        'DM Sans': "'DM Sans', sans-serif",
    }

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Montserrat:wght@700&family=Oswald:wght@700&family=Lato:wght@700&family=Playfair+Display:wght@700&family=DM+Sans:wght@700&display=swap" rel="stylesheet" />

            <Card>
                <CardHeader>
                    <CardTitle>Thumbnail Generator</CardTitle>
                    <CardDescription>
                        Generate beautiful and professional thumbnails for your blog posts and videos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Controls */}
                        <div className="lg:col-span-1">
                            <Tabs defaultValue="content" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="content"><Text className="mr-2 h-4 w-4" /> Content</TabsTrigger>
                                    <TabsTrigger value="style"><Brush className="mr-2 h-4 w-4" /> Style</TabsTrigger>
                                </TabsList>
                                <TabsContent value="content" className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input id="title" value={settings.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="organization">Organization</Label>
                                        <Input id="organization" value={settings.organization} onChange={(e) => handleInputChange('organization', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="logo">Logo</Label>
                                        <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="mr-2 h-4 w-4"/> Upload Logo
                                        </Button>
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                    </div>
                                </TabsContent>
                                <TabsContent value="style" className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label>Background Style</Label>
                                        <Select value={settings.background} onValueChange={(value) => handleInputChange('background', value)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pattern1">Subtle Pattern</SelectItem>
                                                <SelectItem value="pattern2">Dotted Pattern</SelectItem>
                                                <SelectItem value="gradient">Gradient</SelectItem>
                                                <SelectItem value="solid">Solid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="theme">Theme Color</Label>
                                        <Input id="theme" type="color" value={settings.theme} onChange={(e) => handleInputChange('theme', e.target.value)} className="w-full h-10 p-1" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label>Font Family</Label>
                                        <Select value={settings.fontFamily} onValueChange={(value) => handleInputChange('fontFamily', value)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(fontStyles).map(font => (
                                                    <SelectItem key={font} value={font}>{font}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TabsContent>
                            </Tabs>
                             <div className="pt-6 flex gap-2">
                                <Button onClick={handleReset} variant="outline" className="w-full"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                                <Button onClick={handleExport} className="w-full"><Download className="mr-2 h-4 w-4" /> Export</Button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="lg:col-span-2 flex items-center justify-center bg-muted/50 rounded-lg p-4">
                            <div
                                ref={previewRef}
                                style={{
                                    fontFamily: fontStyles[settings.fontFamily as keyof typeof fontStyles],
                                    aspectRatio: aspectRatio,
                                    // @ts-ignore
                                    ...backgroundStyles[settings.background as keyof typeof backgroundStyles]
                                }}
                                className="w-full p-12 shadow-lg flex flex-col justify-center border bg-white"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    {settings.logo && <img src={settings.logo} alt="logo" className="h-8 w-auto object-contain" />}
                                    <span className="font-semibold text-lg" style={{ color: settings.subtext }}>{settings.organization}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: settings.foreground }}>
                                    {settings.title}
                                </h1>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
