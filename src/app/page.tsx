import { ReturnForm } from '@/components/return-form';
import { Package, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
        <div className="mt-8 text-center">
            <Button asChild variant="outline">
                <Link href="/visual-search">
                    <Search className="mr-2 h-4 w-4" />
                    Go to Visual Search
                </Link>
            </Button>
        </div>
      </div>
    </main>
  );
}
