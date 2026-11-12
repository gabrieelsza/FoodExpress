import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/pedidos', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    if (username === 'admin' && password === 'admin123') {
      login('mock-token-123', { username: 'admin' });
      navigate('/admin/pedidos', { replace: true });
    } else {
      setError('Credenciais inválidas');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-[#18181c] border border-neutral-800 rounded-2xl shadow-2xl p-8">
          {/* Logo / Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Lock className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-orange-500" />
              FoodExpress
            </h1>
            <p className="text-neutral-400 mt-1 text-sm">Área do Restaurante</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-1">
                Usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
                autoComplete="username"
                className="w-full h-12 px-4 border border-neutral-700/80 bg-neutral-900 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  autoComplete="current-password"
                  className="w-full h-12 px-4 pr-12 border border-neutral-700/80 bg-neutral-900 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-200"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Entrar'
              )}
            </button>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm text-center font-medium">{error}</p>
            )}
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-neutral-400 hover:text-orange-400 transition inline-flex items-center gap-1"
          >
            ← Voltar ao cardápio
          </Link>
        </div>
      </div>
    </div>
  );
}
