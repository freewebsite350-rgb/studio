import { VisualSearchForm } from '@/components/visual-search-form';
import { Camera } from 'lucide-react';

export default function VisualSearchPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3 ring-4 ring-primary/20">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-headline tracking-tight">
            Retail-Assist 3.0: Visual Search
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload a photo to find similar products.
          </p>
        </div>
        <VisualSearchForm />
      </div>
    </main>
  );
}
