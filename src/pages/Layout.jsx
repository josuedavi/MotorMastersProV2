

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Car, Settings, MessageSquare, Package, BarChart3, Users, Files, LifeBuoy, Inbox, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/api/entities";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isHomePage = currentPageName === 'Home';

  const customerNavItems = [
    { name: "Home", path: createPageUrl("Home"), icon: Car },
    { name: "My Tunes", path: createPageUrl("CustomerPortal"), icon: Package },
    { name: "Support", path: createPageUrl("CustomerSupport"), icon: LifeBuoy },
  ];

  const adminNavItems = [
    { name: "Dashboard", path: createPageUrl("AdminDashboard"), icon: BarChart3 },
    { name: "Jobs", path: createPageUrl("AdminOrders"), icon: Package },
    { name: "Customers", path: createPageUrl("AdminCustomers"), icon: Users },
    { name: "Files", path: createPageUrl("AdminFiles"), icon: Files },
    { name: "Inbox", path: createPageUrl("AdminSocialInbox"), icon: Inbox },
  ];

  const navItems = isAdmin ? adminNavItems : customerNavItems;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <style>{`
        :root {
          --bmw-blue: #0066cc;
          --bmw-blue-dark: #004499;
          --bmw-silver: #c0c8d1;
          --gradient-primary: linear-gradient(135deg, #0066cc 0%, #004499 100%);
          --gradient-secondary: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        }
        
        .bmw-gradient {
          background: var(--gradient-primary);
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .hover-glow:hover {
          box-shadow: 0 0 20px rgba(0, 102, 204, 0.3);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Navigation Header */}
      {!isHomePage && (
        <header className="glass-effect border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
                <div className="w-8 h-8 bmw-gradient rounded-full flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">B58 Tuning</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? "text-blue-400 bg-blue-900/20"
                        : "text-gray-300 hover:text-blue-400 hover:bg-gray-800/50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-300 text-sm">
                      {user.full_name} {isAdmin && "(Admin)"}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => User.login()}
                    className="bmw-gradient hover:opacity-90 transition-opacity"
                  >
                    Login
                  </Button>
                )}

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-300"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-800">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        location.pathname === item.path
                          ? "text-blue-400 bg-blue-900/20"
                          : "text-gray-300 hover:text-blue-400 hover:bg-gray-800/50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {!isHomePage && (
        <footer className="bg-gray-950 border-t border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-6 h-6 bmw-gradient rounded-full flex items-center justify-center">
                  <Car className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">B58 Tuning</span>
              </div>
              <p className="text-gray-400 text-sm">
                Premium BMW B58 Engine Tuning & Performance Solutions
              </p>
              <p className="text-gray-500 text-xs mt-2">
                © 2024 B58 Tuning. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

