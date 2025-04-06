import React from "react";
import { Car } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} KARE V-Analyser. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
