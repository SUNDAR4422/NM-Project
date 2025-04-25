
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecommendationStep, UserPreferences } from '../types/movie';
import { 
  moods, watchingWith, ageRanges, 
  genres, languages, durationOptions, preferencesOptions 
} from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const QuestionnaireForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<RecommendationStep>('mood');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    mood: '',
    watchingWith: '',
    ageRange: '',
    genres: [],
    language: 'English',
    duration: 999,
    preferences: []
  });
  
  // Calculate progress percentage
  const steps: RecommendationStep[] = ['mood', 'watching_with', 'age_range', 'genres', 'language', 'duration', 'preferences'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  const handleNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    } else {
      // Submit and navigate to recommendations
      navigate('/recommendations', { state: { preferences: userPreferences } });
    }
  };
  
  const handlePrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };
  
  const canContinue = () => {
    switch (currentStep) {
      case 'mood': return !!userPreferences.mood;
      case 'watching_with': return !!userPreferences.watchingWith;
      case 'age_range': return !!userPreferences.ageRange;
      case 'genres': return userPreferences.genres.length > 0;
      case 'language': return !!userPreferences.language;
      case 'duration': return !!userPreferences.duration;
      case 'preferences': return true; // Optional
      default: return false;
    }
  };
  
  const renderFormStep = () => {
    switch (currentStep) {
      case 'mood':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center gradient-text">How are you feeling today?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    userPreferences.mood === mood.value
                      ? 'bg-cinema-purple/30 border-2 border-cinema-purple shadow-lg shadow-cinema-purple/20'
                      : 'bg-cinema/30 border border-white/10 hover:bg-cinema-purple/20'
                  }`}
                  onClick={() => setUserPreferences({ ...userPreferences, mood: mood.value })}
                >
                  <div className="text-3xl mb-1">{mood.icon}</div>
                  <div className="font-medium">{mood.label}</div>
                  {userPreferences.mood === mood.value && (
                    <Check className="h-5 w-5 text-cinema-accent mx-auto mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'watching_with':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center gradient-text">Who are you watching with?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {watchingWith.map((option) => (
                <button
                  key={option.value}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    userPreferences.watchingWith === option.value
                      ? 'bg-cinema-purple/30 border-2 border-cinema-purple shadow-lg shadow-cinema-purple/20'
                      : 'bg-cinema/30 border border-white/10 hover:bg-cinema-purple/20'
                  }`}
                  onClick={() => setUserPreferences({ ...userPreferences, watchingWith: option.value })}
                >
                  <div className="text-3xl mb-1">{option.icon}</div>
                  <div className="font-medium">{option.label}</div>
                  {userPreferences.watchingWith === option.value && (
                    <Check className="h-5 w-5 text-cinema-accent mx-auto mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'age_range':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center gradient-text">Select age range for content</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ageRanges.map((option) => (
                <button
                  key={option.value}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    userPreferences.ageRange === option.value
                      ? 'bg-cinema-purple/30 border-2 border-cinema-purple shadow-lg shadow-cinema-purple/20'
                      : 'bg-cinema/30 border border-white/10 hover:bg-cinema-purple/20'
                  }`}
                  onClick={() => setUserPreferences({ ...userPreferences, ageRange: option.value })}
                >
                  <div className="font-medium">{option.label}</div>
                  {userPreferences.ageRange === option.value && (
                    <Check className="h-5 w-5 text-cinema-accent mx-auto mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'genres':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center gradient-text">What genres do you enjoy?</h2>
            <p className="text-center text-cinema-muted">Select at least one genre</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {genres.map((genre) => (
                <div
                  key={genre}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    userPreferences.genres.includes(genre)
                      ? 'bg-cinema-purple/30 border-2 border-cinema-purple shadow-lg shadow-cinema-purple/20'
                      : 'bg-cinema/30 border border-white/10 hover:bg-cinema-purple/20'
                  }`}
                  onClick={() => {
                    const updatedGenres = userPreferences.genres.includes(genre)
                      ? userPreferences.genres.filter(g => g !== genre)
                      : [...userPreferences.genres, genre];
                    setUserPreferences({ ...userPreferences, genres: updatedGenres });
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{genre}</span>
                    {userPreferences.genres.includes(genre) && (
                      <Check className="h-4 w-4 text-cinema-accent" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'language':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center gradient-text">Preferred language?</h2>
            <div className="max-w-sm mx-auto">
              <Carousel>
                <CarouselContent>
                  {languages.map((language, i) => (
                    <CarouselItem key={language} className="basis-auto">
                      <div className="p-1">
                        <button
                          className={`w-full p-6 rounded-xl transition-all duration-300 ${
                            userPreferences.language === language
                              ? 'bg-cinema-purple/30 border-2 border-cinema-purple shadow-lg shadow-cinema-purple/20'
                              : 'bg-cinema/30 border border-white/10 hover:bg-cinema-purple/20'
                          }`}
                          onClick={() => setUserPreferences({ ...userPreferences, language })}
                        >
                          <div className="font-medium text-lg">{language}</div>
                          {userPreferences.language === language && (
                            <Check className="h-5 w-5 text-cinema-accent mx-auto mt-2" />
                          )}
                        </button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-4 space-x-2">
                  <CarouselPrevious className="static transform-none" />
                  <CarouselNext className="static transform-none" />
                </div>
              </Carousel>
            </div>
          </div>
        );
        
      case 'duration':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center gradient-text">How much time do you have?</h2>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    userPreferences.duration === option.value
                      ? 'bg-cinema-purple/30 border-2 border-cinema-purple shadow-lg shadow-cinema-purple/20'
                      : 'bg-cinema/30 border border-white/10 hover:bg-cinema-purple/20'
                  }`}
                  onClick={() => setUserPreferences({ ...userPreferences, duration: option.value })}
                >
                  <div className="font-medium">{option.label}</div>
                  {userPreferences.duration === option.value && (
                    <Check className="h-5 w-5 text-cinema-accent mx-auto mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'preferences':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center gradient-text">Any specific preferences?</h2>
            <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
              {preferencesOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 rounded-xl transition-all duration-300 flex items-center justify-between ${
                    userPreferences.preferences.includes(option.value as any)
                      ? 'bg-cinema-purple/30 border border-cinema-purple'
                      : 'bg-cinema/30 border border-white/10'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <Checkbox
                    checked={userPreferences.preferences.includes(option.value as any)}
                    onCheckedChange={(checked) => {
                      const updatedPrefs = checked
                        ? [...userPreferences.preferences, option.value as any]
                        : userPreferences.preferences.filter(p => p !== option.value);
                      setUserPreferences({ ...userPreferences, preferences: updatedPrefs });
                    }}
                    className="data-[state=checked]:bg-cinema-purple data-[state=checked]:border-cinema-purple"
                  />
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className="bg-gradient-to-b from-cinema to-cinema-dark border border-white/10 p-6 max-w-2xl w-full mx-auto shadow-xl">
      <div className="mb-8">
        <Progress value={progress} className="h-2 bg-cinema-dark" />
      </div>
      
      <div className="min-h-[400px] flex flex-col justify-between">
        <div className="flex-1">{renderFormStep()}</div>
        
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="border-cinema-purple/50 text-cinema-foreground hover:bg-cinema-purple/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Button
            onClick={handleNextStep}
            disabled={!canContinue()}
            className={`${currentStepIndex === steps.length - 1 ? 'button-glow' : 'bg-cinema-purple hover:bg-cinema-purple/90'}`}
          >
            {currentStepIndex === steps.length - 1 ? (
              'Get Recommendations'
            ) : (
              <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuestionnaireForm;
