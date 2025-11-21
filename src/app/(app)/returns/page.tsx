
import { ReturnForm } from '@/components/return-form';
import { Package } from 'lucide-react';
import { AppConfig } from '@/lib/app-config';

export default function ReturnsPage() {
  return (
    <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Package className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">{AppConfig.appName}: Returns</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
            <ReturnForm />
        </div>
      </div>
    </main>
  );
}
