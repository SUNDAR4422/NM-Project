import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Heart } from "lucide-react";
import { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button'; // Keep Button import

interface MovieDetailsModalProps {
    movie: Movie | null;
    isOpen: boolean;
    onClose: () => void;
}

const MovieDetailsModal = ({ movie, isOpen, onClose }: MovieDetailsModalProps) => {
    const { isAuthenticated, isFavorite, addFavoriteMovie, removeFavoriteMovie } = useAuth();
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    if (!movie) {
        return null;
    }

    const isCurrentlyFavorite = isAuthenticated && movie && isFavorite(movie.movie_id);

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated || !movie?.movie_id) return;
        setIsFavoriteLoading(true);
        try {
            if (isCurrentlyFavorite) {
                await removeFavoriteMovie(movie.movie_id);
            } else {
                await addFavoriteMovie(movie.movie_id);
            }
        } catch (error) {
            console.error("Error toggling favorite in modal:", error)
            // Optionally show a toast error message
        }
        finally {
            setIsFavoriteLoading(false);
        }
    };

    // Prepare display values
    const ratingDisplay = movie.rating !== null ? movie.rating.toFixed(1) : 'N/A';
    const durationDisplay = movie.duration !== null ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : 'N/A';
    const posterUrlDisplay = movie.posterUrl || '/placeholder-poster.png';
    const backdropUrlDisplay = movie.backdropUrl || posterUrlDisplay;
    const descriptionDisplay = movie.description || "No description available.";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {movie && (
                <DialogContent className="max-w-3xl bg-gradient-to-b from-cinema to-cinema-dark border-white/10 text-foreground">
                    <DialogHeader>
                        {/* Removed button from here */}
                        <DialogTitle className="text-2xl font-bold gradient-text">{movie.title}</DialogTitle>
                        <DialogDescription className="sr-only">
                            Details for the movie {movie.title}.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Make content scrollable */}
                    <div className="relative max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cinema-purple/50 scrollbar-track-transparent">
                        {/* Backdrop image */}
                        <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                            <img src={backdropUrlDisplay} alt={`${movie.title} backdrop`} className="w-full h-full object-cover" onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src='/placeholder-poster.png';}} loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/50 to-transparent"></div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Poster */}
                            <div className="relative">
                                <img src={posterUrlDisplay} alt={movie.title} className="w-full rounded-lg shadow-lg" onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src='/placeholder-poster.png';}} loading="lazy" />
                            </div>

                            {/* Details Column */}
                            <div className="md:col-span-2 space-y-4">
                                {/* Rating/Duration/Year */}
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-cinema-purple/20 text-cinema-purple">{movie.year ?? 'N/A'}</Badge>
                                    <div className="flex items-center text-yellow-500"><Star className="h-4 w-4 fill-current mr-1"/><span>{ratingDisplay}</span></div>
                                    <div className="flex items-center text-cinema-muted"><Clock className="h-4 w-4 mr-1"/><span>{durationDisplay}</span></div>
                                </div>
                                {/* Description */}
                                <p className="text-cinema-muted">{descriptionDisplay}</p>
                                {/* Genres */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Genres:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.genres?.map((genre) => (<Badge key={genre} variant="outline" className="border-cinema-purple/30">{genre}</Badge>)) ?? <span className="text-sm text-cinema-muted">N/A</span>}
                                    </div>
                                </div>
                                {/* Streaming */}
                                {movie.streamingOn && movie.streamingOn.length > 0 && (
                                    <div className="pt-2">
                                        <h4 className="text-sm font-medium mb-2">Available on:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.streamingOn.map((platform) => (
                                                <Badge key={platform} className="bg-cinema-purple/20 text-cinema-purple">{platform}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Special Badges */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {movie.isTrending && (<Badge className="bg-red-500/20 text-red-400 border-red-500/30">Trending 🔥</Badge>)}
                                    {movie.isClassic && (<Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Classic 🏆</Badge>)}
                                    {movie.isHiddenGem && (<Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Hidden Gem 💎</Badge>)}
                                </div>

                                {/* --- FAVORITE BUTTON MOVED HERE --- */}
                                {isAuthenticated && (
                                    <div className="pt-4 flex justify-end"> {/* Position button */}
                                        <Button
                                            variant={isCurrentlyFavorite ? "secondary" : "outline"} // Example: different variant
                                            size="sm"
                                            className={cn(
                                                "border-cinema-purple/50 hover:bg-cinema-purple/20",
                                                isCurrentlyFavorite && "bg-red-900/50 border-red-500/50 hover:bg-red-800/50 text-white" // Style when favorite
                                            )}
                                            onClick={handleFavoriteClick}
                                            disabled={isFavoriteLoading}
                                            aria-label={isCurrentlyFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                        >
                                            <Heart className={cn(
                                                "h-4 w-4 mr-2", // Icon styling
                                                isCurrentlyFavorite ? 'fill-red-500 text-red-500' : 'fill-transparent'
                                            )} />
                                            {isCurrentlyFavorite ? 'Remove Favorite' : 'Add to Favorites'}
                                        </Button>
                                    </div>
                                )}
                                {/* --- END FAVORITE BUTTON --- */}

                            </div> {/* End Details Column */}
                        </div> {/* End Main Content Grid */}
                    </div> {/* End Scrollable Area */}
                </DialogContent>
            )}
        </Dialog>
    );
};

export default MovieDetailsModal;