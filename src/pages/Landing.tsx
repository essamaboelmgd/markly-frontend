import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import {
  Bookmark,
  Sparkles,
  FolderOpen,
  Tag,
  Search,
  Zap,
  Shield,
  Cloud,
  Star,
  Check,
  Play,
  Pause,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ModernSection from "@/components/ModernSection";
import MagicSection from "@/components/MagicSection";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Landing() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = () => {
    togglePlayPause();
    setShowPlayButton(isPlaying);
  };

  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlayPause();
    setShowPlayButton(isPlaying);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Half-circle light effect in the center */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 -z-5">
          <div className="absolute inset-0 bg-gradient-primary rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-primary rounded-full filter blur-2xl opacity-10 animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>AI that makes you smarter, not dumber</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
               Organize your knowledge.
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                 Amplify your intelligence.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              An AI-powered knowledge management system that helps you capture, organize, and recall everything you learn online. Turn information overload into organized wisdom.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="rounded-full bg-gradient-primary text-lg px-8">
                <Link to="/register">Start Now</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full text-lg px-8"
                onClick={() => {
                  const element = document.getElementById('demo');
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="mt-16 animate-fade-in">
            <div className="relative max-w-5xl mx-auto">
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-30 blur-3xl rounded-full animate-pulse"></div>
              <Card className="relative p-6 bg-gradient-card border-2">
                {/* Video with play/pause controls */}
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full rounded-xl shadow-2xl max-h-[75vh]"
                  >
                    <source src="/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* Play/Pause button */}
                  <Button
                    size="icon"
                    onClick={togglePlayPause}
                    className="absolute bottom-4 left-4 rounded-full bg-black/50 hover:bg-black/70 text-white"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage your bookmarks efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Bookmark,
                title: "Smart Bookmarking",
                description: "Save any webpage with one click and let AI organize it automatically",
              },
              {
                icon: FolderOpen,
                title: "Categories & Collections",
                description: "Organize bookmarks into custom categories and themed collections",
              },
              {
                icon: Tag,
                title: "Tags & Filters",
                description: "Tag your bookmarks and find them instantly with powerful filters",
              },
              {
                icon: Sparkles,
                title: "AI Summaries",
                description: "Get instant AI-powered summaries of any saved content",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Section */}
      <ModernSection />

      {/* Magic Section */}
      <MagicSection />

      {/* Newsletter Subscription Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
              📧 Stay Updated
            </span>
          </div>
          
          <h2 className="text-33xl md:text-4xl font-bold mb-4 text-foreground">
            Get the Latest <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Markly</span> Updates
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and never miss product updates, tips, and exclusive offers.
          </p>
          
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <Button className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all">
              Subscribe
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="p-8 bg-gradient-card">
            <h2 className="text-3xl font-bold mb-6 text-center">
              See Markly in Action
            </h2>
            <div 
              className="relative aspect-video bg-muted rounded-xl flex items-center justify-center cursor-pointer"
              onClick={handleVideoClick}
            >
              {/* Video with lazy loading and play/pause controls */}
              <video
                ref={videoRef}
                preload="none"
                loop
                playsInline
                className="w-full h-full rounded-xl"
                poster="/placeholder.svg"
              >
                <source src="/action-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Play button in center - only visible when video is paused */}
              <Button
                size="icon"
                onClick={handlePlayButtonClick}
                className={`absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 text-white transition-opacity duration-300 ${
                  showPlayButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <Play className="w-8 h-8" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                features: [
                  "100 bookmarks",
                  "Basic organization",
                  "5 AI summaries/month",
                  "Mobile app access",
                ],
              },
              {
                name: "Pro",
                price: "$9",
                popular: true,
                features: [
                  "Unlimited bookmarks",
                  "Advanced organization",
                  "Unlimited AI summaries",
                  "Priority support",
                  "Team collaboration",
                ],
              },
              {
                name: "Enterprise",
                price: "$29",
                features: [
                  "Everything in Pro",
                  "Custom integrations",
                  "Advanced analytics",
                  "Dedicated support",
                  "SSO & Security",
                ],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card
                  className={`p-8 h-full relative transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    plan.popular ? "border-primary border-2 shadow-glow" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>
                  <div className="mb-8">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-full text-lg py-6 ${
                      plan.popular ? "bg-gradient-primary" : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "How does AI summarization work?",
                a: "Our AI analyzes the content of your bookmarked pages and generates concise, meaningful summaries that capture the key points.",
              },
              {
                q: "Can I import my existing bookmarks?",
                a: "Yes! Markly supports importing bookmarks from all major browsers and other bookmark managers.",
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use enterprise-grade encryption and security measures to protect your data.",
              },
              {
                q: "Can I share bookmarks with my team?",
                a: "Yes, Pro and Enterprise plans include team collaboration features for sharing and organizing bookmarks together.",
              },
            ].map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Organize Your World?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who are already organizing smarter with Markly
          </p>
          <Button size="lg" asChild className="rounded-full bg-gradient-primary text-lg px-8">
            <Link to="/register">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-primary">
                <Bookmark className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Markly</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 Markly. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Terms</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Add CSS for the blob animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

document.head.appendChild(style);
