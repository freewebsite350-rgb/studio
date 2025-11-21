
import { ProductList } from '@/components/product-list';
import { AppConfig } from '@/lib/app-config';
import { ShoppingCart } from 'lucide-react';

export default function ProductsPage() {
  return (
    <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <ShoppingCart className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">{AppConfig.appName}: Products</h1>
      </div>
      <div className="flex-1 mt-6">
        <ProductList />
      </div>
    </main>
  );
}
