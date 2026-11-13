import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0b0908] text-stone-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased flex flex-col">
      {/* 1. TOP NAVBAR (Consistente com todas as outras abas do FoodExpress) */}
      <Navbar isAdmin={false} />

      {/* 2. MAIN LOGIN AREA */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Dual-Panel Steakhouse Card with User Burger Image */}
        <div className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden border border-[#201a15] bg-[#0c0a08] shadow-2xl shadow-black/90 grid grid-cols-1 md:grid-cols-12 transition-all duration-300">
          
          {/* Left Column: Visual Burger Lateral Atmosphere (Um pouco invisível com fade suave) */}
          <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 bg-[#080605] overflow-hidden">
            {/* User Uploaded Bacon Burger with subtle opacity & feathered vignette */}
            <img
              src="/login-burger.jpg"
              alt="FoodExpress Artisan Burger"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-35 scale-105"
            />
            {/* Multi-stage feathered dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080605] via-[#080605]/70 to-black/50" />
            <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-r from-transparent via-[#0c0a08]/80 to-[#0c0a08]" />

            {/* Top Badge */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#100d0b] text-stone-300 border border-[#261f19] text-[10px] font-bold uppercase font-['Oswald',sans-serif] tracking-wider shadow-md">
                <Flame size={12} className="text-[#c2410c] fill-[#c2410c]" />
                Painel Operacional
              </span>
            </div>

            {/* Bottom Content / Highlights */}
            <div className="relative z-10 space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-tight leading-tight">
                  Gestão em Tempo Real
                </h2>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Acompanhe a fila de preparo da cozinha, gerencie o cardápio e atualize o status dos pedidos de mesa e delivery.
                </p>
              </div>

              {/* Status Points */}
              <div className="pt-2 space-y-2 border-t border-white/10 text-[11px] text-stone-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#c2410c] shrink-0" />
                  <span>Fila de pedidos com máquina de estados</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#c2410c] shrink-0" />
                  <span>Edição de itens, preços e adicionais</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#c2410c] shrink-0" />
                  <span>Atualização automática em tempo real</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Branded Login Form (Tom escuro, sóbrio e sem claridade) */}
          <div className="md:col-span-7 relative p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#0c0a08] overflow-hidden">
            {/* Header / Brand */}
            <div className="text-center md:text-left mb-6 sm:mb-8 space-y-2">
              <div className="inline-flex md:hidden items-center justify-center w-16 h-16 rounded-full bg-black border border-[#2c221a] p-1 mb-2 shadow-xl overflow-hidden">
                <img src="/logo.jpg" alt="FoodExpress" className="w-full h-full object-cover scale-105" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#120f0d] border border-[#241d18] text-[11px] font-bold text-[#ea580c] uppercase tracking-widest font-['Oswald',sans-serif]">
                <ShieldCheck size={13} className="text-[#c2410c]" />
                ACESSO RESTRITO AO STAFF
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-tight">
                Painel do Atendente
              </h1>
              <p className="text-xs sm:text-sm text-stone-400">
                Digite suas credenciais corporativas para acessar o painel de pedidos e cozinha.
              </p>
            </div>

            {/* Quick Demo Credentials Pill */}
            <div className="mb-6 p-3 rounded-xl bg-[#120f0d] border border-[#241d18] flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="text-left text-xs">
                <span className="block font-bold text-stone-300">Credenciais de Teste:</span>
                <span className="text-stone-400">
                  Usuário: <code className="text-amber-400 font-bold bg-black/60 px-1.5 py-0.5 rounded border border-white/5">admin</code> | Senha: <code className="text-amber-400 font-bold bg-black/60 px-1.5 py-0.5 rounded border border-white/5">admin123</code>
                </span>
              </div>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1a1411] hover:bg-[#c2410c] hover:text-white border border-[#2c221a] hover:border-[#c2410c] text-[11px] font-bold text-stone-300 uppercase tracking-wider font-['Oswald',sans-serif] transition-all cursor-pointer"
              >
                Preencher Dados
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-stone-400 font-['Oswald',sans-serif] mb-1.5">
                  Usuário Operacional
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: admin"
                    required
                    autoComplete="username"
                    className="w-full h-12 pl-10 pr-4 border border-[#26201a] bg-[#120f0d] focus:bg-[#161210] rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#c2410c] text-sm font-medium transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-stone-400 font-['Oswald',sans-serif] mb-1.5">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    autoComplete="current-password"
                    className="w-full h-12 pl-10 pr-12 border border-[#26201a] bg-[#120f0d] focus:bg-[#161210] rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#c2410c] text-sm font-medium transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-500 hover:text-stone-300 cursor-pointer"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs font-medium text-center shadow-md">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 bg-[#c2410c] hover:bg-[#d9531e] active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider font-['Oswald',sans-serif] rounded-xl shadow-lg shadow-black/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar no Painel</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Security Note & Back Link */}
            <div className="mt-6 pt-5 border-t border-[#1e1814] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#c2410c]" />
                Sessão segura de atendimento
              </span>

              <Link
                to="/nossos-produtos"
                className="text-stone-400 hover:text-stone-200 font-semibold transition-colors flex items-center gap-1"
              >
                ← Voltar ao cardápio
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}