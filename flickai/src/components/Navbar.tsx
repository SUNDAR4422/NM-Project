import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { Film, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useToast } from '@/components/ui/use-toast'; // Keep if needed for other toasts
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  // const { toast } = useToast(); // Keep if used elsewhere
  const { isAuthenticated, user, logout } = useAuth(); // Get auth state and functions
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get current path

  // Scroll effect remains the same
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    logout();
    // Optionally navigate the user after logout
    navigate('/');
    console.log("User signed out.");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-cinema-purple" />
              <span className="text-xl font-bold gradient-text">FlickAI</span>
            </Link>
          </div>

          {/* Navigation Links and Auth Button */}
          <div className="flex items-center space-x-4">
            {location.pathname !== '/recommendations' && ( // Conditional rendering based on path
              <Button variant="ghost" className="hover:bg-white/10" asChild>
                {/* Use asChild to make the whole button a Link */}
                <Link to={isAuthenticated ? "/recommendations" : "/"} className="text-sm">
                  Recommendations
                </Link>
              </Button>
            )}

            {/* Conditional Rendering based on Auth State */}
            {isAuthenticated ? (
              <>
                {/* Display User Info (Optional) */}
                {/* <span className="text-sm text-cinema-muted hidden sm:block">
                  Welcome, {user?.full_name || user?.email}
                </span> */}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cinema-purple/50 hover:bg-cinema-purple/20"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 text-cinema-purple mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-cinema-purple/50 hover:bg-cinema-purple/20"
                asChild // Make the button a link trigger
              >
                <Link to="/login"> {/* Link to login page */}
                  <User className="h-4 w-4 text-cinema-purple mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;