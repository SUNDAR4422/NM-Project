
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();

  // Add scroll event listener
  useState(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const handleSignIn = () => {
    toast({
      title: "Authentication Required",
      description: "Please connect Supabase to enable authentication features.",
      variant: "default",
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-cinema-purple" />
              <span className="text-xl font-bold gradient-text">FlickAI</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hover:bg-white/10">
              <Link to="/recommendations" className="text-sm">
                Recommendations
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-cinema-purple/50 hover:bg-cinema-purple/20"
              onClick={handleSignIn}
            >
              <User className="h-4 w-4 text-cinema-purple mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
