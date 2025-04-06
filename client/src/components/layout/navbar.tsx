import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-primary font-bold text-xl cursor-pointer">Career Guidance System</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <span className={`text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium cursor-pointer ${location === link.href ? 'text-primary' : ''}`}>
                  {link.name}
                </span>
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <span className={`text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium cursor-pointer ${location === '/dashboard' ? 'text-primary' : ''}`}>
                    Dashboard
                  </span>
                </Link>
                <Link href="/quiz">
                  <span className={`text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium cursor-pointer ${location === '/quiz' ? 'text-primary' : ''}`}>
                    Career Quiz
                  </span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <span className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium cursor-pointer">
                  Login
                </span>
              </Link>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Button 
              variant="ghost" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <span 
                  className={`block pl-3 pr-4 py-2 border-l-4 cursor-pointer ${
                    location === link.href 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  } text-base font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </span>
              </Link>
            ))}
            
            {user ? (
              <>
                <Link href="/dashboard">
                  <span 
                    className={`block pl-3 pr-4 py-2 border-l-4 cursor-pointer ${
                      location === '/dashboard' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                    } text-base font-medium`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </span>
                </Link>
                <Link href="/quiz">
                  <span 
                    className={`block pl-3 pr-4 py-2 border-l-4 cursor-pointer ${
                      location === '/quiz' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                    } text-base font-medium`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Career Quiz
                  </span>
                </Link>
                <button
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={logoutMutation.isPending}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth">
                <span 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
