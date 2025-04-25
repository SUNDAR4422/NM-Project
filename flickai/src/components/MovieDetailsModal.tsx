
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";
import { Movie } from "@/types/movie";

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDetailsModal = ({ movie, isOpen, onClose }: MovieDetailsModalProps) => {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-cinema to-cinema-dark border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{movie.title}</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {/* Backdrop image with gradient overlay */}
          <div className="relative h-64 overflow-hidden rounded-lg mb-4">
            <img 
              src={movie.backdropUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/50 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Poster */}
            <div className="relative">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            
            {/* Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-cinema-purple/20 text-cinema-purple">
                  {movie.year}
                </Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1">{movie.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center text-cinema-muted">
                  <Clock className="h-4 w-4" />
                  <span className="ml-1">{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                </div>
              </div>
              
              <p className="text-cinema-muted">{movie.description}</p>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="border-cinema-purple/30">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {movie.streamingOn && movie.streamingOn.length > 0 && (
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Available on:</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.streamingOn.map((platform) => (
                      <Badge key={platform} className="bg-cinema-purple/20 text-cinema-purple">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Special badges */}
              <div className="flex flex-wrap gap-2 pt-4">
                {movie.isTrending && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    Trending 🔥
                  </Badge>
                )}
                {movie.isClassic && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Classic 🏆
                  </Badge>
                )}
                {movie.isHiddenGem && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Hidden Gem 💎
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailsModal;
