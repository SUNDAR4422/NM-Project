import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar'; // Assuming you want the Navbar here too
import { useToast } from '@/components/ui/use-toast'; // For success message


const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Optional name field
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth(); // Get register function from context
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
    }

    setLoading(true);
    try {
      const success = await register({ email, password, full_name: fullName || null });
      if (success) {
         toast({
            title: "Registration Successful!",
            description: "You can now log in with your credentials.",
          });
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        setError("Registration failed. Please try again."); // Generic error
      }
    } catch (err: any) {
       console.error("Register Page Error:", err);
       // Use error message from API if available
       setError(err.message || "An unexpected error occurred during registration.");
    } finally {
        setLoading(false);
    }
  };

  return (
     <div className="min-h-screen cinema-background">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4">
         <Card className="w-full max-w-md glass-card">
            <CardHeader className="text-center">
               <CardTitle className="gradient-text text-2xl">Create Account</CardTitle>
               <CardDescription>Sign up to get personalized movie recommendations.</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="fullName">Full Name (Optional)</Label>
                     <Input
                        id="fullName"
                        type="text"
                        placeholder="Your Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-input/50"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="email-register">Email</Label>
                     <Input
                        id="email-register" // Ensure unique ID if using alongside login form potentially
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-input/50"
                     />
                  </div>
                   <div className="space-y-2">
                     <Label htmlFor="password-register">Password</Label>
                     <Input
                        id="password-register"
                        type="password"
                        placeholder="Minimum 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="bg-input/50"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="confirmPassword">Confirm Password</Label>
                     <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-input/50"
                     />
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full button-glow" disabled={loading}>
                     {loading ? 'Registering...' : 'Register'}
                  </Button>
                   <p className="text-center text-sm text-cinema-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-cinema-accent hover:underline">
                      Sign In
                    </Link>
                  </p>
               </form>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default RegisterPage;