// src/components/ProfileSection.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Star, Film, History, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const ProfileSection = () => {
  // Get user, auth status, and favorites from context
  const { isAuthenticated, user, favorites } = useAuth();

  // Mock other stats - replace later if tracked
  const mockOtherStats = {
    watched: 12,
    watchTime: 1240,
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    // Handle case where name might not have spaces but is long
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="bg-gradient-to-b from-cinema to-cinema-dark border border-white/10 shadow-xl lg:sticky lg:top-20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="gradient-text">Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
           <Avatar className="h-14 w-14 border-2 border-cinema-purple">
             {/* <AvatarImage src={user.image || undefined} /> */}
             <AvatarFallback className="bg-cinema-purple/20">
               {getInitials(user.full_name || user.email)}
             </AvatarFallback>
           </Avatar>
          <div>
            <h3 className="font-medium text-lg">{user.full_name || user.email || 'User'}</h3>
            <p className="text-sm text-cinema-muted">Movie Enthusiast</p>
          </div>
         </div>

        {/* --- Use Real Favorite Count --- */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-black/20">
            <div className="flex items-center text-cinema-accent mb-1">
              <Star className="h-4 w-4 mr-1" />
              {/* Use length of favorites array from context */}
              <span className="font-semibold">{favorites.length}</span>
            </div>
            <span className="text-xs text-cinema-muted">Favorites</span>
          </div>
          {/* --- Keep other stats mocked for now --- */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-black/20">
            <div className="flex items-center text-cinema-accent mb-1">
              <Film className="h-4 w-4 mr-1" />
              <span className="font-semibold">{mockOtherStats.watched}</span>
            </div>
            <span className="text-xs text-cinema-muted">Watched</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-black/20">
            <div className="flex items-center text-cinema-accent mb-1">
              <Clock className="h-4 w-4 mr-1" />
              <span className="font-semibold">{Math.floor(mockOtherStats.watchTime / 60)}</span>
            </div>
            <span className="text-xs text-cinema-muted">Hours</span>
          </div>
        </div>

        {/* <Button ...>View History</Button> */}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;