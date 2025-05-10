import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar'; // Assuming you want the Navbar here too

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const success = await login({ email, password });
      if (success) {
        console.log("Login successful, navigating...");
        navigate('/'); // Redirect to home or dashboard after successful login
      } else {
        // Error state might be set within the login function via exceptions
        // Or handle specific return values if needed
        setError("Login failed. Please check your credentials."); // Generic error
      }
    } catch (err: any) {
       console.error("Login Page Error:", err);
       setError(err.message || "An unexpected error occurred during login.");
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen cinema-background">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
         <Card className="w-full max-w-md glass-card">
            <CardHeader className="text-center">
               <CardTitle className="gradient-text text-2xl">Sign In</CardTitle>
               <CardDescription>Enter your credentials to access your recommendations.</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-input/50" // Slightly transparent input
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-input/50"
                     />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full button-glow" disabled={loading}>
                     {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  <p className="text-center text-sm text-cinema-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-cinema-accent hover:underline">
                      Register
                    </Link>
                  </p>
               </form>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default LoginPage;