import React from 'react';
import { Menu } from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#D5DFEB] shadow-xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ONLY the name and logo of the online banking website bankofameriica */}
          <div className="flex items-center gap-3">
            {/* Bank of America Iconic Flag Logo */}
            <svg
              className="w-10 h-7 shrink-0"
              viewBox="0 0 38 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Bank of America Logo"
            >
              {/* Red Stripes on Left */}
              <rect x="0" y="1" width="15" height="4.5" rx="0.5" fill="#E31837" />
              <rect x="0" y="8" width="15" height="4.5" rx="0.5" fill="#E31837" />
              <rect x="0" y="15" width="15" height="4.5" rx="0.5" fill="#E31837" />
              <rect x="0" y="22" width="15" height="4.5" rx="0.5" fill="#E31837" />
              
              {/* Blue Stripes on Right */}
              <rect x="18" y="1" width="20" height="4.5" rx="0.5" fill="#012169" />
              <rect x="18" y="8" width="20" height="4.5" rx="0.5" fill="#012169" />
              <rect x="18" y="15" width="20" height="4.5" rx="0.5" fill="#012169" />
              <rect x="18" y="22" width="20" height="4.5" rx="0.5" fill="#012169" />
            </svg>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-xl text-[#012169] tracking-tight">
                  Bank of America
                </span>
                <span className="text-xs font-semibold text-[#E31837] tracking-wide font-mono">
                  bankofameriica
                </span>
              </div>
              <span className="text-[10px] text-[#757682] uppercase tracking-wider font-semibold">
                Online Banking & Institutional Treasury
              </span>
            </div>
          </div>

          {/* Mobile Off-Canvas Menu Toggle Button (visible on mobile lg:hidden) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={onToggleMobileMenu}
              className="p-2 rounded-[4px] border border-[#D5DFEB] hover:bg-[#F2F6FA] text-[#012169] transition-colors flex items-center gap-1.5 text-xs font-bold"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 text-[#012169]" />
              <span className="text-[11px] uppercase tracking-wider text-[#012169]">Menu</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
