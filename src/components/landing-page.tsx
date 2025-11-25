'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

export function LandingPage() {
  const router = useRouter();
  const user = useUser(); // can be null on first load

  const handleDemoClick = () => {
    if (!user) return router.push('/login');

<<<<<<< HEAD
    if (user.role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to the App</h1>

      <Button onClick={handleDemoClick} size="lg">
        Enter App
      </Button>
    </div>
  );
}
=======
            {/* Features Section */}
            <section className="py-20 px-4 bg-background">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Everything You Need to Scale Support</h2>
                    <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">{AppConfig.appName} provides the tools to enhance customer experience and streamline your operations.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-left hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    {feature.icon}
                                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-4 bg-secondary/30">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Limited Launch Partner Offer</h2>
                    <p className="text-lg text-muted-foreground mb-12">Become a Launch Partner and get exclusive benefits for helping us shape the future of local small business tools.</p>
                    <Card className="shadow-2xl border-2 border-primary">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Zap className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold">Launch Partner</h3>
                            <div className="flex items-baseline justify-center gap-2 mt-4">
                                <span className="text-5xl font-extrabold tracking-tight">P225</span>
                                <span className="text-xl font-medium text-muted-foreground">/ month</span>
                            </div>
                            <p className="text-muted-foreground">(R300 for SA businesses)</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ul className="space-y-4 text-left">
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span><span className="font-semibold">50% OFF</span> for life</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>Free "Done-For-You" On-site or Zoom setup</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>Direct influence on new features</span>
                                </li>
                                 <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>Connect to WhatsApp, Facebook & Instagram</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>Embeddable Website Chat Widget</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>All current & future features included</span>
                                </li>
                            </ul>
                            <Button className="w-full" size="lg" asChild>
                                <Link href="/signup">Become a Launch Partner</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
            
             {/* Footer */}
            <footer className="bg-background border-t">
                <div className="container mx-auto py-6 px-4 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} {AppConfig.appName}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
>>>>>>> 2ba44edd83bc773b40c2b703c6db219405268b79
