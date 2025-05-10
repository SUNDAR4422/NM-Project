import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Movie, UserPreferences } from '../types/movie';
import { getMovieRecommendations } from '../data/mockData';
import MovieCard from './MovieCard';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import Navbar from './Navbar';
import ProfileSection from './ProfileSection';
import { useAuth } from '@/context/AuthContext';

const RecommendationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const preferences = (location.state as { preferences: UserPreferences })?.preferences;
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        const fetchRecommendations = async () => {
            console.log("RecommendationPage useEffect - Preferences:", preferences);
            if (preferences) {
                setLoading(true);
                try {
                    const recommendedMovies = await getMovieRecommendations(preferences);
                    console.log("Data received from getMovieRecommendations:", recommendedMovies);
                    setMovies(Array.isArray(recommendedMovies) ? recommendedMovies : []);
                } catch (error) {
                    console.error("Error fetching recommendations in useEffect:", error);
                    setMovies([]);
                } finally {
                    setLoading(false);
                }
            } else {
                console.warn("No preferences found in location state.");
                setLoading(false);
                setMovies([]);
            }
        };

        if (preferences) {
            fetchRecommendations();
        } else {
            setLoading(false);
        }
    }, [preferences]);

    // Render loading state for auth check OR recommendation fetch
    if (isAuthLoading || loading) {
        return (
            <div className="min-h-screen cinema-background flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-cinema-purple" />
            </div>
        );
    }


    return (
        <div className="min-h-screen cinema-background relative">
            <div className="film-grain"></div>
            <Navbar />

            <div className="container mx-auto max-w-5xl px-4 py-16">
                {/* -------- Conditional Rendering based on isAuthenticated -------- */}
                {isAuthenticated ? (
                    // --- Logged-In View ---
                    <>
                        {/* Profile Section at the Top */}
                        <div className="w-full max-w-sm mx-auto mb-16 p-6 rounded-lg bg-black/20"> {/* Increased margin, padding, rounded corners */}
                            <ProfileSection />
                        </div>

                        {/* Recommendations Section */}
                        <h1 className="text-3xl font-bold mb-10 gradient-text text-center"> {/* Increased margin */}
                            Your Movie Recommendations
                        </h1>
                        {movies.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-lg text-cinema-muted mb-6"> {/* Increased margin */}
                                    No movies match your preferences. Try adjusting your selections.
                                </p>
                                <Button
                                    onClick={() => navigate('/', { state: { resetQuestionnaire: true } })}
                                    className="button-glow text-lg px-6 py-3 hover:bg-cinema-purple/20"  // Refined hover
                                >
                                    Try Again
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Using Flexbox here now */}
                                <div className="flex flex-wrap justify-center -mx-4 mb-12"> {/* Increased margin */}
                                    {Array.isArray(movies) && movies.map((movie, index) => {
                                        if (movie === undefined || movie === null) {
                                            console.error(`!!! Attempting to render MovieCard for undefined/null movie at index ${index} !!!`);
                                            return null;
                                        }
                                        return (
                                            <div key={movie.movie_id ?? index} className="w-1/4 px-4 mb-8">
                                                <MovieCard movie={movie} priority={index} />
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Recommend Again Button Centered Below Grid/Flex */}
                                <div className="mt-8 flex justify-center">
                                    <Button
                                        onClick={() => navigate('/', { state: { resetQuestionnaire: true } })}
                                        className="button-glow text-lg px-8 py-4 neon-border hover:bg-cinema-purple/20" // Refined hover
                                    >
                                        Recommend Again
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    // --- Logged-Out View ---
                    // Redirect to login or show message if user tries to access /recommendations directly?
                    // Or just show recommendations without profile section?
                    // For now, let's just show recommendations part for simplicity
                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-5xl mx-auto">
                            <h1 className="text-3xl font-bold mb-8 gradient-text text-center">
                                Your Movie Recommendations
                            </h1>
                            {/* Loading state handled above */}
                            {movies.length === 0 ? (
                                <div className="text-center">
                                    <p className="text-lg text-cinema-muted mb-4">
                                        No movies match your preferences. Please sign in to personalize. {/* Adjusted message */}
                                    </p>
                                    <Button onClick={() => navigate('/login')} className="button-glow text-lg px-6 py-3 hover:bg-cinema-purple/20">
                                        Sign In
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-wrap gap-6 justify-center px-4">
                                        {Array.isArray(movies) && movies.map((movie, index) => {
                                            if (movie === undefined || movie === null) {
                                                console.error(`!!! Attempting to render MovieCard for undefined/null movie at index ${index} !!!`);
                                                return null;
                                            }
                                            return <MovieCard key={movie.movie_id ?? index} movie={movie} priority={index} />;
                                        })}
                                    </div>
                                    <div className="mt-8 flex justify-center">
                                        <Button
                                            onClick={() => navigate('/', { state: { resetQuestionnaire: true } })}
                                            className="button-glow text-lg px-8 py-4 neon-border hover:bg-cinema-purple/20"
                                        >
                                            Recommend Again
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationPage;