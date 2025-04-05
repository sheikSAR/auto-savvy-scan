
import React from 'react';
import { Car } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-6 h-6 text-car-blue" />
              <h2 className="text-lg font-bold">Vehicle Condition Analyser</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Making used car buying decisions easier with advanced AI analysis.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Features</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">Image Analysis</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">Legal Checks</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">Price Estimation</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">Market Intelligence</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">Guidelines</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">API Documentation</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">About Us</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">Contact Us</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-car-blue">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Vehicle Condition Analyser. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
