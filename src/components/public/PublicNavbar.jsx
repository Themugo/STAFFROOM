import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';

export default function PublicNavbar({ onBookDemo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/' || location.pathname === '/Landing';

  const navLinks = [
    { label: 'Platform', href: isHome ? '#platform' : '/FeaturesPage' },
    { label: 'Solutions', href: isHome ? '#organization' : '/FeaturesPage#organization' },
    { label: 'Pricing', href: '/PricingPage' },
    { label: 'About', href: '/AboutPage' },
    { label: 'Blog & News', href: '/BlogPage' },
    { label: 'Contact', href: '/ContactPage' },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white border-b border-[#DCE6F2] ${
        scrolled ? 'shadow-sm py-3' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              SR
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#102A43]">
                StaffRoom
              </span>
              <span className="text-[10px] font-bold text-[#3B82F6] tracking-widest uppercase -mt-1">
                Enterprise
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              if (link.href.startsWith('/')) {
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-sm font-semibold text-[#52677F] hover:text-[#2563EB] transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold text-[#52677F] hover:text-[#2563EB] transition-colors"
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/Login"
              className="text-sm font-bold text-[#102A43] hover:text-[#2563EB] transition-colors px-3 py-2"
            >
              Sign In
            </Link>

            <button
              onClick={onBookDemo ? onBookDemo : () => window.location.href = '/ContactPage'}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Book a Demo</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl border border-[#DCE6F2] text-[#102A43] hover:bg-[#F6F9FD]"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#DCE6F2] px-6 py-6 space-y-4 animate-fade-in text-[#102A43]">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              if (link.href.startsWith('/')) {
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-semibold text-[#52677F] hover:text-[#2563EB] py-1"
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-[#52677F] hover:text-[#2563EB] py-1"
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#DCE6F2] flex flex-col gap-3">
            <Link
              to="/Login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-[#DCE6F2] text-[#102A43] font-bold text-sm hover:bg-[#F6F9FD]"
            >
              Sign In
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                if (onBookDemo) onBookDemo();
                else window.location.href = '/ContactPage';
              }}
              className="w-full py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Book a Demo</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

