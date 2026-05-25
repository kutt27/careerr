import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onLogoClick?: () => void;
}

export default function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="px-6 h-16 flex items-center justify-between">
        <motion.button
          onClick={onLogoClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="text-xl font-medium text-[#444746] hover:text-gray-900 tracking-tight cursor-pointer transition-colors duration-200 focus:outline-none"
        >
          careerr
        </motion.button>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden border border-gray-200">
            <img 
              src="https://picsum.photos/seed/user/32/32" 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
