
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Download, Upload, Text, Brush, Palette, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';

const initialSettings = {
    title: '10 Things I Learned While Doing Nothing',
    subtitle: 'A fun list of lessons from doing absolutely nothing.',
    companyName: 'My Company',
    tag1: 'Tag 1',
    tag2: 'Tag 2',
    logo: 'https://i.ibb.co/3sW2bMh/logo.png',
    theme: '#FFFFFF',
    fontFamily: 'Poppins',
    background: 'pattern1',
    textColor: '#111827',
    tagColor: '#6b7280'
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
            if (!file.type.startsWith('image/')) {
                toast({ variant: 'destructive', title: 'Invalid File', description: 'Please upload a valid image file.' });
                return;
            }
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
                scale: 2 // Higher scale for better quality
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

    const backgroundStyles = {
        pattern1: { background: `linear-gradient(90deg, ${settings.theme} 1px, transparent 1px), linear-gradient(180deg, ${settings.theme} 1px, transparent 1px)`, backgroundSize: '20px 20px', backgroundColor: '#FFFFFF' },
        pattern2: { background: `radial-gradient(circle, ${settings.theme} 1px, transparent 1px)`, backgroundSize: '15px 15px', backgroundColor: '#FFFFFF' },
        solid: { backgroundColor: settings.theme }
    };
    
    const fontStyles = {
        Poppins: "'Poppins', sans-serif",
        Montserrat: "'Montserrat', sans-serif",
        Oswald: "'Oswald', sans-serif', 'sans-serif'",
        Lato: "'Lato', sans-serif",
        'Playfair Display': "'Playfair Display', serif",
        'DM Sans': "'DM Sans', sans-serif",
    };

    const instructions = (
        <div className="space-y-2">
            <p>Generate beautiful and professional thumbnails for your blog posts and videos. Here's how to use the generator:</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
                <li><strong>Customize Content:</strong> Use the "Content" tab to set the title, subtitle, tags, company name, and upload a logo.</li>
                <li><strong>Adjust Style:</strong> Switch to the "Style" tab to change the font, background pattern, and colors to match your brand.</li>
                <li><strong>Live Preview:</strong> See your changes reflected in the preview panel instantly.</li>
                <li><strong>Export Your Thumbnail:</strong> When you're happy with the result, click the "Export" button to download a high-quality PNG image.</li>
                <li><strong>Reset:</strong> Use the "Reset" button anytime to go back to the default settings.</li>
            </ol>
        </div>
    );

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Montserrat:wght@700&family=Oswald:wght@700&family=Lato:wght@700&family=Playfair+Display:wght@700&family=DM+Sans:wght@700&display=swap" rel="stylesheet" />

            <Card>
                <CardHeader>
                    <CardTitle>Thumbnail Generator</CardTitle>
                    <CardDescription>
                        {instructions}
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
                                        <Textarea id="title" value={settings.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subtitle">Subtitle</Label>
                                        <Input id="subtitle" value={settings.subtitle} onChange={(e) => handleInputChange('subtitle', e.target.value)} />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="companyName">Company Name</Label>
                                        <Input id="companyName" value={settings.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} />
                                    </div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="tag1">Tag 1</Label>
                                            <Input id="tag1" value={settings.tag1} onChange={(e) => handleInputChange('tag1', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tag2">Tag 2</Label>
                                            <Input id="tag2" value={settings.tag2} onChange={(e) => handleInputChange('tag2', e.target.value)} />
                                        </div>
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
                                                <SelectItem value="solid">Solid Color</SelectItem>
                                                <SelectItem value="pattern1">Subtle Grid</SelectItem>
                                                <SelectItem value="pattern2">Dotted</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="theme">Background Color</Label>
                                        <Input id="theme" type="color" value={settings.theme} onChange={(e) => handleInputChange('theme', e.target.value)} className="w-full h-10 p-1" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="textColor">Text Color</Label>
                                        <Input id="textColor" type="color" value={settings.textColor} onChange={(e) => handleInputChange('textColor', e.target.value)} className="w-full h-10 p-1" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="tagColor">Tag Color</Label>
                                        <Input id="tagColor" type="color" value={settings.tagColor} onChange={(e) => handleInputChange('tagColor', e.target.value)} className="w-full h-10 p-1" />
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
                                    // @ts-ignore
                                    ...backgroundStyles[settings.background as keyof typeof backgroundStyles],
                                    aspectRatio: 1200 / 630,
                                }}
                                className="w-full p-12 shadow-lg flex flex-col justify-between border"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        {settings.logo && <img src={settings.logo} alt="logo" className="h-8 w-auto object-contain" />}
                                        <span className="font-semibold text-lg" style={{ color: settings.tagColor }}>{settings.companyName}</span>
                                    </div>
                                </div>
                                <div className="flex-grow flex flex-col justify-center">
                                    <p className="text-xl mb-4" style={{ color: settings.tagColor }}>
                                        {settings.tag1 && <span>{settings.tag1}</span>}
                                        {settings.tag1 && settings.tag2 && <span className="mx-2">/</span>}
                                        {settings.tag2 && <span>{settings.tag2}</span>}
                                    </p>
                                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight" style={{ color: settings.textColor }}>
                                        {settings.title}
                                    </h1>
                                    <p className="text-lg mt-4" style={{ color: settings.tagColor }}>
                                        {settings.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
