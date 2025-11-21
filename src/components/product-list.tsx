
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, addDoc, serverTimestamp, query, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const productSchema = z.object({
  productName: z.string().min(1, 'Product name is required.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  currency: z.string().min(1, 'Currency is required.'),
  imageUrl: z.string().url('Please enter a valid image URL.'),
  productUrl: z.string().url('Please enter a valid product page URL.'),
});

type ProductFormData = z.infer<typeof productSchema>;
type Product = ProductFormData & { id: string };

function AddProductDialog({ userId }: { userId: string }) {
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            productName: '',
            price: 0,
            currency: 'R',
            imageUrl: '',
            productUrl: '',
        }
    });

    const onSubmit = async (data: ProductFormData) => {
        if (!firestore) return;
        setIsSaving(true);
        try {
            const productsCollectionRef = collection(firestore, 'users', userId, 'products');
            await addDoc(productsCollectionRef, {
                ...data,
                createdAt: serverTimestamp(),
            });
            toast({
                title: 'Product Added!',
                description: `${data.productName} has been added to your catalog.`,
            });
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error('Error adding product:', error);
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'Could not add the product. Please try again.',
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="productName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl><Input placeholder="e.g., Leather Jacket" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 1499" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="currency" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <FormControl><Input placeholder="e.g., R or P" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="productUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Page URL</FormLabel>
                                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                             <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                             </DialogClose>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Product'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = useUser();
    const firestore = useFirestore();

    useEffect(() => {
        if (user && firestore) {
            setIsLoading(true);
            const productsQuery = query(collection(firestore, 'users', user.uid, 'products'));
            const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
                const productsData = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                    id: doc.id,
                    ...doc.data(),
                } as Product));
                setProducts(productsData);
                setIsLoading(false);
            }, (error) => {
                console.error("Error fetching products: ", error);
                setIsLoading(false);
            });

            return () => unsubscribe();
        } else if (!user) {
            setIsLoading(false);
        }
    }, [user, firestore]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Your Product Catalog</CardTitle>
                    <CardDescription>Manage your business's inventory here.</CardDescription>
                </div>
                {user && <AddProductDialog userId={user.uid} />}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Image src={product.imageUrl} alt={product.productName} width={40} height={40} className="rounded-md object-cover" />
                                    </TableCell>
                                    <TableCell className="font-medium">{product.productName}</TableCell>
                                    <TableCell>{product.currency}{product.price}</TableCell>
                                    <TableCell>
                                        <Button asChild variant="outline" size="sm">
                                            <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                View
                                            </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No products found. Add your first product to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
