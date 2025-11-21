'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Search, Upload } from 'lucide-react';
import Image from 'next/image';

export function VisualSearchForm() {
    const [preview, setPreview] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSearch = async () => {
        if (!preview) return;

        setIsSearching(true);

        // Here is where you would make an API call to a Genkit flow
        // For example:
        // const result = await visualSearchFlow({ image: preview });
        // console.log(result);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSearching(false);
        // TODO: Display search results
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    }

    return (
        <Card className="w-full shadow-lg border-2 border-transparent focus-within:border-primary/50 transition-colors duration-300">
            <CardHeader>
              <CardTitle>Visual Search</CardTitle>
              <CardDescription>Upload a product photo to find matching items.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="product-photo">Product Photo</Label>
                    <Input id="product-photo" type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    
                    {preview ? (
                        <div className="relative group w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
                            <Image src={preview} alt="Product preview" fill className="object-contain rounded-lg" />
                            <div 
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={handleUploadClick}
                            >
                                <span className="text-white font-semibold">Change Photo</span>
                            </div>
                        </div>

                    ) : (
                        <div 
                            className="w-full aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-accent hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={handleUploadClick}
                        >
                            <Upload className="h-8 w-8 mb-2" />
                            <span>Click to upload</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSearch} className="w-full" disabled={!preview || isSearching}>
                    {isSearching ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Searching...
                        </>
                    ) : (
                        <>
                            <Search className="mr-2 h-4 w-4" />
                            Find Matching Products
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
