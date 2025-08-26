
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, createPageUrl } from "@/api/entities";
import { Car, Settings, MessageSquare, Package, BarChart3, Users, Files, LifeBuoy, Inbox, Menu, X, Loader2 } from "lucide-react";
import { Button } from "./components/ui/button";

export default function Layout({ children }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    User.me().then(setUser).finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await User.logout();
    window.location.href = createPageUrl("Home");
  };

  const isAdmin = user?.role === 'admin';
  const isHomePage = location.pathname === createPageUrl('Home');

  const customerNavItems = [
    { name: "Home", path: createPageUrl("Home"), icon: Car },
    { name: "My Tunes", path: createPageUrl("CustomerPortal"), icon: Package },
  ];

  const adminNavItems = [
    { name: "Dashboard", path: createPageUrl("AdminDashboard"), icon: BarChart3 },
    { name: "Jobs", path: createPageUrl("AdminOrders"), icon: Package },
    { name: "Customers", path: createPageUrl("AdminCustomers"), icon: Users },
    { name: "Inbox", path: createPageUrl("AdminSocialInbox"), icon: Inbox },
  ];

  const navItems = isAdmin ? adminNavItems : customerNavItems;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
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
        }
        .bmw-gradient { background: var(--gradient-primary); }
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

      {!isHomePage && (
        <header className="glass-effect border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
                <div className="w-8 h-8 bmw-gradient rounded-full flex items-center justify-center"><Car className="w-5 h-5 text-white" /></div>
                <span className="text-xl font-bold text-white">B58 Tuning</span>
              </Link>

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
                  ><item.icon className="w-4 h-4" /><span>{item.name}</span></Link>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <span className="text-gray-300 text-sm hidden md:block">{user.full_name} {isAdmin && "(Admin)"}</span>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="border-gray-600 text-gray-300 hover:bg-gray-800">Logout</Button>
                  </>
                ) : (
                  <Button onClick={() => User.login()} className="bmw-gradient hover:opacity-90">Login</Button>
                )}
                <Button variant="ghost" size="icon" className="md:hidden text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {!isHomePage && (
        <footer className="bg-gray-950 border-t border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} B58 Tuning. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
