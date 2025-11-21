import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl">
      <div className="bg-card/80 backdrop-blur-lg border border-border rounded-3xl px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            {/* Fixed logo path and adjusted sizing for all screens */}
            <img 
              src={theme === 'dark' ? '/logo-white.png' : '/logo.png'} 
              alt="Logo" 
              className="h-8 w-auto" 
            />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Markly
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {/* Modified Home button to scroll to hero section */}
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('demo')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Demo
            </button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="rounded-full hidden md:inline-flex">
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild className="rounded-full bg-gradient-primary hidden md:inline-flex">
              <Link to="/register">Get Started</Link>
            </Button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {/* Modified Home button for mobile to scroll to hero section */}
              <button
                onClick={() => scrollToSection('hero')}
                className="text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('demo')}
                className="text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Demo
              </button>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" size="sm" asChild className="rounded-full flex-1">
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="rounded-full bg-gradient-primary flex-1">
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}