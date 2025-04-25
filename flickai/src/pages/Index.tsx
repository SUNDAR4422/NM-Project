import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Film, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestionnaireForm from '@/components/QuestionnaireForm';
import Navbar from '@/components/Navbar';

const Index = () => {
  const location = useLocation();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);

  useEffect(() => {
    if (location.state?.resetQuestionnaire) {
      setShowQuestionnaire(true); // Immediately show questionnaire
    }
  }, [location.state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateElements(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen cinema-background relative">
      <div className="film-grain"></div>
      <Navbar />
      <div className="relative h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="spotlight"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cinema-purple/20 filter blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-cinema-accent/20 filter blur-3xl"></div>
          </div>
        </div>
        <div className="container mx-auto relative z-10">
          {showQuestionnaire ? (
            <QuestionnaireForm />
          ) : (
            <div className="max-w-3xl mx-auto text-center glass-card p-8 rounded-2xl">
              <div className={`inline-block mb-6 ${animateElements ? 'animate-fade-in' : 'opacity-0'}`}>
                <div className="p-4 rounded-full bg-cinema-purple/10 inline-flex border border-cinema-purple/30 animate-pulse-glow">
                  <Film className="h-10 w-10 text-cinema-purple" />
                </div>
              </div>
              <h1
                className={`text-4xl md:text-6xl font-bold mb-4 ${animateElements ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: '100ms' }}
              >
                <span className="gradient-text">FlickAI</span>
                <span className="block mt-2">Your Personal Movie & Show Guide</span>
              </h1>
              <p
                className={`text-xl md:text-2xl text-cinema-muted mb-8 ${animateElements ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: '200ms' }}
              >
                Tell us how you feel, and we'll find the perfect movie or show for your mood.
              </p>
              <div
                className={`space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center ${animateElements ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: '300ms' }}
              >
                <Button
                  onClick={() => setShowQuestionnaire(true)}
                  className="button-glow text-lg px-8 py-6 neon-border"
                >
                  Find My Perfect Movie or Show
                </Button>
              </div>
              <div
                className={`flex justify-center items-center mt-12 space-x-1 text-cinema-muted ${animateElements ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: '400ms' }}
              >
                <Star className="h-4 w-4 fill-cinema-accent text-cinema-accent" />
                <Star className="h-4 w-4 fill-cinema-accent text-cinema-accent" />
                <Star className="h-4 w-4 fill-cinema-accent text-cinema-accent" />
                <Star className="h-4 w-4 fill-cinema-accent text-cinema-accent" />
                <Star className="h-4 w-4 fill-cinema-accent text-cinema-accent" />
                <span className="ml-2">Trusted by movie & show lovers worldwide</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {!showQuestionnaire && (
        <div className="py-16 bg-cinema-dark/70 backdrop-blur-md relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 gradient-text">How It Works</h2>
              <p className="text-cinema-muted max-w-2xl mx-auto">
                Our AI-powered recommendation engine finds the perfect movie or show match based on your preferences and mood.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl glass-card neon-border">
                <div className="mb-4 p-3 rounded-full bg-cinema-purple/20 w-fit">
                  <span className="text-2xl floating-effect">🎭</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Share Your Mood</h3>
                <p className="text-cinema-muted">
                  Tell us how you're feeling and who you're watching with for personalized recommendations.
                </p>
              </div>
              <div className="p-6 rounded-xl glass-card neon-border">
                <div className="mb-4 p-3 rounded-full bg-cinema-purple/20 w-fit">
                  <span className="text-2xl floating-effect">🔍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-cinema-muted">
                  Our AI analyzes thousands of movies and shows to find perfect matches based on your preferences.
                </p>
              </div>
              <div className="p-6 rounded-xl glass-card neon-border">
                <div className="mb-4 p-3 rounded-full bg-cinema-purple/20 w-fit">
                  <span className="text-2xl floating-effect">🎬</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Discover Movies & Shows</h3>
                <p className="text-cinema-muted">
                  Get instant recommendations with details on where to watch and why it's perfect for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className="py-6 bg-cinema-dark/80 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Film className="h-5 w-5 text-cinema-purple" />
            <span className="gradient-text font-bold">FlickAI</span>
          </div>
          <p className="text-xs text-cinema-muted">© {new Date().getFullYear()} FlickAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;