import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { signIn } from '../../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-6 py-12 transition-colors duration-300">
      <div className="w-full max-w-md bg-card border border-border/40 rounded-2xl p-8 shadow-xl transition-all">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white mb-4 shadow-md">
            <Icon icon="lucide:lock" className="text-xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight m-0">Admin Portal</h1>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider font-mono">
            Authorized Personnel Only
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-3 text-xs mb-6 flex items-start gap-2.5">
            <Icon icon="lucide:alert-circle" className="text-base flex-none mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="admin@q1clicks.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2.5 px-3.5 text-sm transition-all text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2.5 px-3.5 text-sm transition-all text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background font-semibold py-2.5 rounded-lg hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Icon icon="line-md:loading-twotone-loop" />
                Signing In...
              </>
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>

        {/* Link back */}
        <div className="text-center mt-6">
          <a href="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">
            <Icon icon="lucide:arrow-left" />
            Back to main website
          </a>
        </div>
      </div>
    </div>
  );
}
