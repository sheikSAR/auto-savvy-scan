
import React from 'react';
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Car className="w-8 h-8 text-car-blue animate-pulse" />
          <h1 className="text-xl font-bold">
            <span className="text-car-blue">KARE</span> V-Analyser
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-car-blue transition-colors">How it works</a>
          <a href="#" className="text-sm font-medium hover:text-car-blue transition-colors">Features</a>
          <a href="#" className="text-sm font-medium hover:text-car-blue transition-colors">Pricing</a>
          <Button size="sm" variant="default" className="bg-gradient-to-r from-car-blue to-teal-accent hover:from-car-blue/90 hover:to-teal-accent/90 text-white">Get Started</Button>
          <ThemeToggle />
        </nav>
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
