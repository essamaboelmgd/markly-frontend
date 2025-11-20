import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bookmark } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl">
      <div className="bg-card/80 backdrop-blur-lg border border-border rounded-3xl px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-primary">
              <Bookmark className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Markly
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/#demo"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Demo
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="rounded-full">
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild className="rounded-full bg-gradient-primary">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
