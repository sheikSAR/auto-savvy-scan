
import React from 'react';
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Car className="w-8 h-8 text-car-blue" />
          <h1 className="text-xl font-bold">Vehicle Condition Analyser</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-car-blue transition-colors">How it works</a>
          <a href="#" className="text-sm font-medium hover:text-car-blue transition-colors">Features</a>
          <a href="#" className="text-sm font-medium hover:text-car-blue transition-colors">Pricing</a>
          <Button size="sm" variant="default" className="bg-car-blue hover:bg-car-blue/90">Get Started</Button>
        </nav>
        <Button variant="outline" size="icon" className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;
