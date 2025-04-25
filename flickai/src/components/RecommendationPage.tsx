import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Movie, UserPreferences } from '../types/movie';
import { getMovieRecommendations } from '../data/mockData';
import MovieCard from './MovieCard';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import Navbar from './Navbar';
import ProfileSection from './ProfileSection';

const RecommendationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preferences = (location.state as { preferences: UserPreferences })?.preferences;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (preferences) {
        setLoading(true);
        const recommendedMovies = await getMovieRecommendations(preferences);
        setMovies(recommendedMovies);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [preferences]);

  return (
    <div className="min-h-screen cinema-background relative">
      <div className="film-grain"></div>
      <Navbar />
      
      <div className="container mx-auto max-w-5xl px-0 py-16">
        {isLoggedIn ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 justify-items-center">
            <div className="lg:col-span-1 max-w-sm mx-auto">
              <ProfileSection />
            </div>
            
            <div className="lg:col-span-3 flex items-center justify-center">
              <div className="w-full max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 gradient-text text-center">
                  Your Movie Recommendations
                </h1>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-cinema-purple" />
                  </div>
                ) : movies.length === 0 ? (
                  <div className="text-center">
                    <p className="text-cinema-muted mb-4">
                      No movies match your preferences. Try adjusting your selections.
                    </p>
                    <Button asChild>
                      <a href="/">Try Again</a>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <div className={`grid grid-cols-1 sm:grid-cols-2 ${movies.length < 3 ? 'md:grid-cols-2 lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6 justify-items-center w-fit mx-auto`}>
                        {movies.map((movie, index) => (
                          <MovieCard key={movie.id} movie={movie} priority={index} />
                        ))}
                      </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                      <Button
                        onClick={() => navigate('/', { state: { resetQuestionnaire: true } })}
                        className="button-glow text-lg px-8 py-6 neon-border"
                      >
                        Recommend Again
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="w-full max-w-5xl mx-auto">
              <h1 className="text-3xl font-bold mb-8 gradient-text text-center">
                Your Movie Recommendations
              </h1>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-cinema-purple" />
                </div>
              ) : movies.length === 0 ? (
                <div className="text-center">
                  <p className="text-cinema-muted mb-4">
                    No movies match your preferences. Try adjusting your selections.
                  </p>
                  <Button asChild>
                    <a href="/">Try Again</a>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${movies.length < 3 ? 'md:grid-cols-2 lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6 justify-items-center w-fit mx-auto`}>
                      {movies.map((movie, index) => (
                        <MovieCard key={movie.id} movie={movie} priority={index} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Button
                      onClick={() => navigate('/', { state: { resetQuestionnaire: true } })}
                      className="button-glow text-lg px-8 py-6 neon-border"
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