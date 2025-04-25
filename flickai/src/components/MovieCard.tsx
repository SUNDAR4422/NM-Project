import { useState } from 'react';
import { Movie } from '../types/movie';
import { Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MovieDetailsModal from './MovieDetailsModal';

interface MovieCardProps {
  movie: Movie;
  priority?: number;
}

export const MovieCard = ({ movie, priority = 0 }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className={`cinema-card movie-card-hover neon-border animate-fade-in max-w-xs mx-auto`}
        style={{
          animationDelay: `${priority * 150}ms`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
          <img 
            src={movie.posterUrl} 
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
            style={{
              transform: isHovered ? 'scale(1.05) translateZ(20px)' : 'scale(1)'
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-transparent to-transparent opacity-80"></div>
          
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {movie.isTrending && (
              <Badge className="bg-red-500/80 backdrop-blur-sm hover:bg-red-600/80 floating-effect">
                Trending 🔥
              </Badge>
            )}
            {movie.isClassic && (
              <Badge className="bg-yellow-700/80 backdrop-blur-sm hover:bg-yellow-800/80 floating-effect">
                Classic 🏆
              </Badge>
            )}
            {movie.isHiddenGem && (
              <Badge className="bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/80 floating-effect">
                Hidden Gem 💎
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-4 space-y-2 glass-effect rounded-b-lg">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold line-clamp-1">{movie.title}</h3>
            <span className="text-sm text-cinema-muted">{movie.year}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-cinema-muted mr-1" />
              <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="outline" className="bg-opacity-20 bg-cinema-purple text-xs">
                {genre}
              </Badge>
            ))}
            {movie.genres.length > 2 && (
              <Badge variant="outline" className="bg-opacity-20 bg-cinema-muted text-xs">
                +{movie.genres.length - 2}
              </Badge>
            )}
          </div>
          
          {isHovered && (
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-cinema-dark/95 via-cinema-dark/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm line-clamp-4 mb-2 text-white/90">{movie.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {movie.streamingOn?.map((platform) => (
                  <Badge key={platform} className="bg-cinema-purple/80 backdrop-blur-sm">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <MovieDetailsModal 
        movie={movie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default MovieCard;