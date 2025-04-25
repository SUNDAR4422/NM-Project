import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Star, Film, History, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfileSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Mock user data - in a real app, this would come from authentication
  const mockUser = {
    name: "Movie Lover",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=150&auto=format&fit=crop",
    favorites: 5,
    watched: 12,
    watchTime: 1240, // minutes
  };
  
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <Card className="bg-gradient-to-b from-cinema to-cinema-dark border border-white/10 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="gradient-text">Your Profile</CardTitle>
        <Button variant="outline" size="sm" className="border-cinema-purple/50 hover:bg-cinema-purple/20">
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-14 w-14 border-2 border-cinema-purple">
            <AvatarImage src={mockUser.image} />
            <AvatarFallback className="bg-cinema-purple/20">ML</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{mockUser.name}</h3>
            <p className="text-sm text-cinema-muted">Movie Enthusiast</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-black/20">
            <div className="flex items-center text-cinema-accent mb-1">
              <Star className="h-4 w-4 mr-1" />
              <span className="font-semibold">{mockUser.favorites}</span>
            </div>
            <span className="text-xs text-cinema-muted">Favorites</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-lg bg-black/20">
            <div className="flex items-center text-cinema-accent mb-1">
              <Film className="h-4 w-4 mr-1" />
              <span className="font-semibold">{mockUser.watched}</span>
            </div>
            <span className="text-xs text-cinema-muted">Watched</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-lg bg-black/20">
            <div className="flex items-center text-cinema-accent mb-1">
              <Clock className="h-4 w-4 mr-1" />
              <span className="font-semibold">{Math.floor(mockUser.watchTime / 60)}</span>
            </div>
            <span className="text-xs text-cinema-muted">Hours</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full border-cinema-purple/50 hover:bg-cinema-purple/20"
        >
          <History className="h-4 w-4 mr-2" />
          View History
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
