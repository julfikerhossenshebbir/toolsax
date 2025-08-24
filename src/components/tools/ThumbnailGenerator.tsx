
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

const initialSettings = {
    layout: 'layout-0',
    alignment: 'left',
    title: '10 Things I Learned While Doing Nothing',
    description: 'A fun list of lessons from doing absolutely nothing.',
    organization: 'My Company',
    logo: 'https://i.ibb.co/3sW2bMh/logo.png',
    theme: '#db2777', // Rose-600
    fontFamily: 'DM Sans',
    ratio: '16:9',
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
                scale: 2 // Higher scale for better quality
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'thumbnail.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                toast({ title: 'Exported!', description: 'Your thumbnail has been downloaded.' });
            }).catch(err => {
                console.error("oops, something went wrong!", err);
                toast({ variant: "destructive", title: 'Export Failed', description: 'Could not generate the image.' });
            });
        }
    };
    
    const handleReset = () => {
        setSettings(initialSettings);
        if(fileInputRef.current) fileInputRef.current.value = "";
        toast({ title: 'Reset!', description: 'All settings have been reset to their default values.' });
    };

    const aspectRatio = settings.ratio === '16:9' ? 16 / 9 : settings.ratio === '1:1' ? 1 : 4 / 5;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thumbnail Generator</CardTitle>
                <CardDescription>
                    Generate your blog post thumbnails with ease (more features to be added).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Layout</Label>
                                <Select value={settings.layout} onValueChange={(value) => handleInputChange('layout', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="layout-0">Layout 0</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Alignment</Label>
                                <Select value={settings.alignment} onValueChange={(value) => handleInputChange('alignment', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="center">Center</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={settings.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" value={settings.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="organization">Organization</Label>
                                <Input id="organization" value={settings.organization} onChange={(e) => handleInputChange('organization', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="logo">Logo</Label>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-grow" onClick={() => fileInputRef.current?.click()}>Browse...</Button>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                    {settings.logo && (
                                        <Button variant="ghost" size="icon" onClick={() => handleInputChange('logo', '')}>
                                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Input id="theme" type="color" value={settings.theme} onChange={(e) => handleInputChange('theme', e.target.value)} className="w-full h-12 p-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Font family</Label>
                                <Select value={settings.fontFamily} onValueChange={(value) => handleInputChange('fontFamily', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DM Sans">DM Sans</SelectItem>
                                        <SelectItem value="Inter">Inter</SelectItem>
                                        <SelectItem value="Roboto">Roboto</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Ratio</Label>
                                <Select value={settings.ratio} onValueChange={(value) => handleInputChange('ratio', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="16:9">16:9</SelectItem>
                                        <SelectItem value="1:1">1:1 (Square)</SelectItem>
                                        <SelectItem value="4:5">4:5 (Portrait)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col items-center gap-4">
                        <div
                            ref={previewRef}
                            style={{ 
                                fontFamily: settings.fontFamily,
                                textAlign: settings.alignment as 'left' | 'center' | 'right',
                                aspectRatio: aspectRatio,
                            }}
                            className="w-full p-8 rounded-lg overflow-hidden relative flex flex-col justify-center"
                        >
                            {/* Background elements */}
                            <div className="absolute inset-0 bg-rose-50 -z-10"></div>
                            <div 
                                className="absolute top-0 right-0 w-48 h-48 -z-10 opacity-20" 
                                style={{
                                    backgroundImage: `radial-gradient(${settings.theme} 1px, transparent 1px)`,
                                    backgroundSize: '10px 10px'
                                }}
                            ></div>
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full" style={{ backgroundColor: `${settings.theme}1A` }}></div>

                            {/* Content */}
                            <div className="flex items-center gap-2 mb-4" style={{ justifyContent: settings.alignment === 'center' ? 'center' : settings.alignment === 'right' ? 'flex-end' : 'flex-start' }}>
                                {settings.logo && <img src={settings.logo} alt="logo" className="h-6 w-auto object-contain" />}
                                <span className="font-semibold text-gray-700">{settings.organization}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                {settings.title}
                            </h1>
                            <p className="mt-2 text-lg text-gray-600">
                                {settings.description}
                            </p>
                        </div>
                        <div className="flex gap-2">
                             <Button onClick={handleReset} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                             <Button onClick={handleExport} className="bg-gray-900 text-white hover:bg-gray-800"><Download className="mr-2 h-4 w-4" /> Export</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
