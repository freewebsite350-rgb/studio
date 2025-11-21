import { ReturnForm } from '@/components/return-form';
import { Package } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3 ring-4 ring-primary/20">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-headline tracking-tight">
            ReturnFlow
          </h1>
          <p className="mt-2 text-muted-foreground">
            Initiate your return request quickly and easily.
          </p>
        </div>
        <ReturnForm />
      </div>
    </main>
  );
}
