'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart,
  TrendingUp,
  Shield,
  FileText,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500">
                <span className="text-xl">₿</span>
              </div>
              <span className="text-lg font-bold">Crypto Market</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted source for real-time cryptocurrency market data and insights.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="mailto:contact@cryptomarket.com">
                  <Mail className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="h-3 w-3" />
                  Market Overview
                </Link>
              </li>
              <li>
                <Link 
                  href="/watchlist" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Heart className="h-3 w-3" />
                  Watchlist
                </Link>
              </li>
              <li>
                <Link 
                  href="/portfolio" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Shield className="h-3 w-3" />
                  Portfolio
                </Link>
              </li>
              <li>
                <Link 
                  href="/settings" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <FileText className="h-3 w-3" />
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/docs" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <FileText className="h-3 w-3" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="/api" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="h-3 w-3" />
                  API Reference
                </Link>
              </li>
              <li>
                <Link 
                  href="/help" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="h-3 w-3" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/support" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="h-3 w-3" />
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/disclaimer" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Crypto Market. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            <span>for crypto enthusiasts</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> Cryptocurrency prices are highly volatile and may be affected by external factors. 
            This platform is for informational purposes only and does not constitute financial advice. 
            Always do your own research before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
