import { Link } from 'react-router-dom';
import { Camera, Search, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 gradient-primary shadow-lg shadow-secondary/20">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-primary tracking-tight">
                لومینو
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/discover"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-100/50 transition-all duration-300"
              >
                <Search className="w-4 h-4" />
                کشف عکاسان
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white btn-primary"
              >
                <LogIn className="w-4 h-4" />
                ورود
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100/50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-10">
                <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-secondary/20">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-black text-primary">لومینو</span>
                </Link>
              </div>

              <div className="space-y-2">
                <Link
                  to="/discover"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <Search className="w-5 h-5" />
                  کشف عکاسان
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-white gradient-primary mt-4"
                >
                  <LogIn className="w-5 h-5" />
                  ورود
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
