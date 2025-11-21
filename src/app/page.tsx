import { ReturnForm } from '@/components/return-form';
import { Package, Search, Bot } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PolicyQa } from '@/components/policy-qa';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
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
        
        <Separator className="my-8" />

        <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3 ring-4 ring-primary/20">
                <Bot className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground font-headline tracking-tight">
                Ask Our Policy Bot
            </h2>
            <p className="mt-2 text-muted-foreground">
                Have a question about our return policy? Ask our AI assistant.
            </p>
        </div>
        <PolicyQa />

        <Separator className="my-8" />

        <div className="text-center">
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
