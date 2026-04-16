import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/AuthContext';

export default function ManagerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, loginWithGoogle, isAuthenticated, isLoadingAuth } = useAuth();

  const [mode, setMode] = useState('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from || '/dashboard';

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        await login({ email: email.trim(), password });
      } else {
        await signup({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
        });
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="py-16 lg:py-24 min-h-[80vh]">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Manager Login
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to manage your building setup, subscription, and access codes.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-semibold"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading || isLoadingAuth}
            >
              {googleLoading ? 'Please wait...' : 'Continue with Google'}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Or
              </span>
              <div className="h-px bg-border flex-1" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {mode === 'signup' && (
              <div>
                <Label className="text-sm font-medium mb-1.5 block">
                  Full Name
                </Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            )}

            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@example.com"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-destructive hover:bg-destructive/90 text-white h-12 text-base font-semibold"
              disabled={loading || googleLoading || isLoadingAuth}
            >
              {loading
                ? 'Please wait...'
                : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
            </Button>
          </form>

          <Button
            variant="ghost"
            className="w-full mt-3"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            {mode === 'signin'
              ? 'Need an account? Sign up'
              : 'Already have an account? Sign in'}
          </Button>
        </div>
      </div>
    </div>
  );
}
