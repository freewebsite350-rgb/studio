'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Search, Upload, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type MockResult = {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  score: number;
};

const mockResults: MockResult[] = [
  { id: '1', name: 'Classic Leather Biker Jacket', price: 'R2,499', imageUrl: PlaceHolderImages[0].imageUrl, score: 95 },
  { id: '2', name: 'Faux Leather Bomber Jacket', price: 'R1,899', imageUrl: 'https://picsum.photos/seed/201/600/600', score: 88 },
  { id: '3', name: 'Suede Moto Jacket', price: 'R2,799', imageUrl: 'https://picsum.photos/seed/202/600/600', score: 85 },
];

export function VisualSearchForm() {
    const [preview, setPreview] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<MockResult[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setResults(null);
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
        
        await new Promise(resolve => setTimeout(resolve, 2500));

        setResults(mockResults);
        setIsSearching(false);
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleReset = () => {
        setPreview(null);
        setResults(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    if (results) {
        return (
             <Card className="w-full shadow-lg">
                <CardHeader>
                    <CardTitle>Search Results</CardTitle>
                    <CardDescription>We found these products based on your image.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {results.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="relative aspect-square w-full">
                                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                        <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs font-bold py-1 px-2 rounded-full">
                                            {item.score}% Match
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                                        <p className="text-muted-foreground text-sm">{item.price}</p>
                                         <Button variant="outline" size="sm" className="w-full mt-2">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            View Product
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={handleReset} className="w-full">
                        Start New Search
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full shadow-lg border-2 border-transparent focus-within:border-primary/50 transition-colors duration-300">
            <CardHeader>
              <CardTitle>Visual Search</CardTitle>
              <CardDescription>Upload a product photo to find matching items.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Input id="product-photo" type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    
                    {preview ? (
                        <div className="relative group w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
                            <Image src={preview} alt="Product preview" fill className="object-contain rounded-lg p-2" />
                            <div 
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
                                onClick={handleUploadClick}
                            >
                                <div className="text-center text-white">
                                    <Upload className="h-8 w-8 mx-auto mb-2"/>
                                    <span className="font-semibold">Change Photo</span>
                                </div>
                            </div>
                        </div>

                    ) : (
                        <div 
                            className="w-full aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-accent hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={handleUploadClick}
                        >
                            <Upload className="h-8 w-8 mb-2" />
                            <span>Click to upload image</span>
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
