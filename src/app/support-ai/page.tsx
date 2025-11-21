
import { PolicyQa } from '@/components/policy-qa';
import { getAdminPolicyAnswerStream } from '@/ai/flows/admin-qa-flow';
import { LifeBuoy } from 'lucide-react';
import { AppConfig } from '@/lib/app-config';

export default function SupportAiPage() {
  return (
    <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
       <div className="flex items-center gap-4">
        <LifeBuoy className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">{AppConfig.appName}: Support AI</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
             <PolicyQa 
                title="Support AI"
                description="Ask me anything about how to use Retail-Assist 3.0 for your business."
                qaStreamer={getAdminPolicyAnswerStream}
                placeholder="e.g., How do I connect my WhatsApp number?"
             />
        </div>
      </div>
    </main>
  );
}
