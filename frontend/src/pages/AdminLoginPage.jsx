import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

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
    await new Promise((r) => setTimeout(r, 450));

    if (username.trim() === 'admin' && password === 'admin123') {
      login('mock-token-123', { username: 'admin' });
      navigate('/admin/pedidos', { replace: true });
    } else {
      setError('Usuário ou senha incorretos. Utilize as credenciais padrão de teste.');
    }

    setLoading(false);
  };

  const handleFillDemoCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased flex flex-col selection:bg-orange-600">
      {/* 1. TOP NAVBAR */}
      <Navbar isAdmin={false} />

      {/* 2. MAIN LOGIN AREA */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-black">
        {/* Subtle burger watermark on lateral background (pure neutral, no brown tint) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none opacity-20 overflow-hidden hidden md:block">
          <img
            src="/login-burger.jpg"
            alt=""
            className="w-full h-full object-cover rounded-full filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/80 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>

        {/* Login Card - Exact Match to user specifications: Clean, Pure Charcoal/Black, Zero Brown, No Neon */}
        <div className="relative z-10 w-full max-w-lg rounded-2xl sm:rounded-3xl border border-zinc-800 bg-[#121214] p-6 sm:p-9 shadow-2xl shadow-black transition-all">
          
          {/* Top Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700/80 text-[11px] font-bold text-orange-500 uppercase tracking-wider font-['Oswald',sans-serif]">
              <ShieldCheck size={14} className="text-orange-500" />
              ACESSO RESTRITO AO STAFF
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5 mb-6 text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-tight">
              PAINEL DO ATENDENTE
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Digite suas credenciais corporativas para acessar o painel de pedidos e cozinha.
            </p>
          </div>

          {/* Test Credentials Box */}
          <div className="mb-6 p-3 sm:p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="text-left text-xs leading-relaxed">
              <span className="block font-bold text-zinc-300">Credenciais de Teste:</span>
              <span className="text-zinc-400">
                Usuário: <code className="text-amber-400 font-bold bg-black px-1.5 py-0.5 rounded border border-zinc-800">admin</code>
                <span className="mx-1 text-zinc-600">|</span>
                Senha: <code className="text-amber-400 font-bold bg-black px-1.5 py-0.5 rounded border border-zinc-800">admin123</code>
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-orange-600 hover:text-white border border-zinc-700 hover:border-orange-500 text-[10px] sm:text-[11px] font-bold text-amber-400 hover:text-white uppercase tracking-wider font-['Oswald',sans-serif] transition-colors cursor-pointer"
            >
              PREENCHER DADOS
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="text-left">
              <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-['Oswald',sans-serif] mb-1.5">
                USUÁRIO OPERACIONAL
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: admin"
                  required
                  autoComplete="username"
                  className="w-full h-12 pl-10 pr-4 border border-zinc-800 bg-zinc-900/60 focus:bg-zinc-900 focus:border-zinc-600 rounded-xl text-white placeholder-zinc-600 text-sm font-medium transition-colors outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="text-left">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-['Oswald',sans-serif] mb-1.5">
                SENHA DE ACESSO
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  autoComplete="current-password"
                  className="w-full h-12 pl-10 pr-11 border border-zinc-800 bg-zinc-900/60 focus:bg-zinc-900 focus:border-zinc-600 rounded-xl text-white placeholder-zinc-600 text-sm font-medium transition-colors outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs font-medium text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider font-['Oswald',sans-serif] rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>ENTRAR NO PAINEL</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Bottom Security Note & Back Link */}
          <div className="mt-6 pt-5 border-t border-zinc-800 flex items-center justify-between gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck size={14} className="text-orange-500" />
              Sessão segura de atendimento
            </span>

            <Link
              to="/nossos-produtos"
              className="text-zinc-400 hover:text-zinc-200 font-semibold transition-colors"
            >
              ← Voltar ao cardápio
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
