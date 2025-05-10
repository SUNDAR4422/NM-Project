import { useState } from 'react';
import { Movie } from '../types/movie';
import { Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MovieDetailsModal from './MovieDetailsModal';
import { cn } from '@/lib/utils';

interface MovieCardProps {
    movie: Movie;
    priority?: number;
}

export const MovieCard = ({ movie, priority = 0 }: MovieCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!movie) {
        console.warn("MovieCard received incomplete movie data:", movie);
        return null;
    }

     const ratingDisplay = movie.rating !== null ? movie.rating.toFixed(1) : 'N/A';
     const durationDisplay = movie.duration !== null ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : 'N/A';
     const posterUrlDisplay = movie.posterUrl || '/placeholder-poster.png';
     const descriptionDisplay = movie.description || "No description available.";


    return (
        <>
            {/* Outer div: Layout */}
            <div className="w-56 mx-auto">
                {/* Inner div: Styling and Content */}
                <div
                    className={cn(
                        `group cinema-card movie-card-hover neon-border animate-fade-in flex flex-col h-[560px] w-full cursor-pointer shadow-md` // Added shadow-md
                    )}
                    style={{ animationDelay: `${priority * 150}ms` }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setIsModalOpen(true)}
                >

                    {/* Image container */}
                    <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg flex-shrink-0">
                        <img
                            src={posterUrlDisplay} alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-102"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; target.src = '/placeholder-poster.png';
                            }}
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-transparent to-transparent opacity-80"></div>
                        {/* Special badges */}
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
                            {movie.isTrending && (<Badge className="bg-red-500/80 ...">Trending 🔥</Badge>)}
                            {movie.isClassic && (<Badge className="bg-yellow-700/80 ...">Classic 🏆</Badge>)}
                            {movie.isHiddenGem && (<Badge className="bg-purple-600/80 ...">Hidden Gem 💎</Badge>)}
                        </div>
                    </div>

                    {/* Content below image */}
                    <div className="p-8 space-y-4 glass-effect rounded-b-lg flex flex-col flex-grow justify-between"> {/* Adjusted spacing */}
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold line-clamp-1">{movie.title}</h3>
                                <span className="text-sm text-cinema-muted flex-shrink-0 ml-2">{movie.year ?? 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm mt-1">
                                <div className="flex items-center"><Star className="h-4 w-4 text-yellow-500 mr-1"/><span>{ratingDisplay}</span></div>
                                <div className="flex items-center"><Clock className="h-4 w-4 text-cinema-muted mr-1"/><span>{durationDisplay}</span></div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {movie.genres?.slice(0, 3).map((genre) => (
                                <Badge key={genre} variant="outline" className="text-xs rounded-full border-cinema-purple/30 px-2 py-1">  {genre} </Badge>
                            ))}
                            {movie.genres && movie.genres.length > 3 && ( <Badge variant="outline" className="text-xs rounded-full border-cinema-purple/30 px-2 py-1"> +{movie.genres.length - 3} </Badge> )}
                        </div>
                    </div>
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