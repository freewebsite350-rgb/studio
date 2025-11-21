'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { CheckCircle, Bot, Package, Camera, BarChart2, Zap, FileText, Code } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AppConfig } from '@/lib/app-config';


const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "24/7 AI-Powered Support",
      description: "Stop replying to the same questions. Our AI handles delivery queries, support questions, and policy info instantly.",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Automated Workflows",
      description: "Free up your time by automating repetitive tasks like processing returns or answering initial client questions.",
    },
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      title: "Visual Product Search",
      description: "For retailers, allow customers to search for products by uploading a photo, just like the big brands do.",
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      title: "Smart Analytics",
      description: "Get actionable insights from your customer interactions to improve your products and services.",
    },
];

export function LandingPage() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="text-center py-20 px-4 bg-background">
                <h1 className="text-5xl font-extrabold tracking-tighter mb-4 text-foreground">
                    Give Your Small Business an AI Assistant
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-8">
                   Whether you sell physical products, digital downloads, or your time as a service, {AppConfig.appName} can handle your repetitive customer queries.
                </p>
                <div className="flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="/onboarding">Get Started for Free</Link>
                    </Button>
                    <Button size="lg" variant="outline">
                        Book a Demo
                    </Button>
                </div>
            </section>

            {/* Visual Feature Section */}
            <section className="py-20 px-4 bg-secondary/30">
                <div className="container mx-auto">
                    <div className="relative rounded-xl shadow-2xl overflow-hidden border border-border">
                        <Image 
                            src="https://picsum.photos/seed/retailhero/1200/600"
                            alt="Retail-Assist Dashboard"
                            width={1200}
                            height={600}
                            className="object-cover w-full"
                            data-ai-hint="dashboard analytics"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                         <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h2 className="text-3xl font-bold">See your business at a glance.</h2>
                            <p className="mt-2 max-w-lg">Our analytics dashboard gives you the insights you need to make smarter decisions.</p>
                         </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-background">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Everything You Need to Scale Support</h2>
                    <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">Retail-Assist 3.0 provides the tools to enhance customer experience and streamline your operations.</p>
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
                    <Card className="shadow-2xl border-2 border-primary scale-105">
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
                                    <span>All current & future features included</span>
                                </li>
                            </ul>
                            <Button className="w-full" size="lg" asChild>
                                <Link href="/onboarding">Become a Launch Partner</Link>
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
