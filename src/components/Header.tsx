import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="text-xl font-medium text-[#444746] tracking-tight">
          careerr
        </div>
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
