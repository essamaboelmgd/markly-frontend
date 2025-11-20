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
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Bookmark Management</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Never Lose Track of
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Important Content
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Intelligent bookmark manager that organizes, summarizes, and helps you
              rediscover your saved content with the power of AI.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="rounded-full bg-gradient-primary text-lg px-8">
                <Link to="/register">Start Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full text-lg px-8">
                <Link to="/#demo">Watch Demo</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <Card className="relative p-8 bg-gradient-card border-2">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop"
                  alt="Dashboard Preview"
                  className="w-full rounded-xl shadow-2xl"
                />
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

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="p-8 bg-gradient-card">
            <h2 className="text-3xl font-bold mb-6 text-center">
              See Markly in Action
            </h2>
            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground">Interactive Demo Coming Soon</p>
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

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
              <Card
                key={index}
                className={`p-8 relative ${
                  plan.popular ? "border-primary border-2 shadow-glow" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-full ${
                    plan.popular ? "bg-gradient-primary" : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </Card>
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
            Ready to Transform Your Bookmarks?
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
