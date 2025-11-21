
import { PolicyQa } from '@/components/policy-qa';
import { Bot } from 'lucide-react';
import { AppConfig } from '@/lib/app-config';

export default function PolicyAiPage() {
  return (
    <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
       <div className="flex items-center gap-4">
        <Bot className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">{AppConfig.appName}: Customer AI</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
             <PolicyQa 
                title="Customer-Facing AI"
                description="Ask a question on behalf of a customer to test your AI's responses."
             />
        </div>
      </div>
    </main>
  );
}
