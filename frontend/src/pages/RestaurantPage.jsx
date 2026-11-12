import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Sparkles,
  UtensilsCrossed,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Beer,
  Music,
  Wind,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function RestaurantPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0908] text-stone-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-orange-600 flex flex-col">
      {/* 1. Global Navbar with "RESTAURANTE & SALÃO" active */}
      <Navbar isAdmin={false} />

      {/* 2. Page Hero with Atmospheric Steakhouse Interior */}
      <div className="relative w-full min-h-[420px] sm:min-h-[500px] overflow-hidden flex items-center border-b border-[#241d18]">
        {/* Background photo */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=900&fit=crop"
            alt="Interior do restaurante FoodExpress Steakhouse"
            className="w-full h-full object-cover scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0908] via-[#0b0908]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0908] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-orange-500/40 text-amber-400 text-xs font-black uppercase font-['Oswald',sans-serif] tracking-wider shadow-lg">
              <Flame size={14} className="text-orange-500 fill-orange-500" />
              EXPERIÊNCIA PRESENCIAL COMPLETA
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight font-['Oswald',sans-serif] leading-tight">
              Restaurante &amp; Salão
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              O ambiente ideal para celebrar momentos memoráveis com amigos e família. Salão climatizado com iluminação quente de brasa, mesas confortáveis, chopp artesanal e carnes nobres grelhadas no fogo ao vivo.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/cardapio')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-500 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider font-['Oswald',sans-serif] shadow-xl shadow-orange-950/80 transition-all cursor-pointer"
              >
                <UtensilsCrossed size={16} />
                <span>Pedir na Mesa do Salão</span>
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate('/delivery')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#181310] hover:bg-[#201915] border border-[#382b22] text-stone-200 hover:text-white font-bold text-xs uppercase tracking-wider font-['Oswald',sans-serif] transition-colors cursor-pointer"
              >
                <span>Prefiro Pedir no Delivery</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The 4 Pillars of the Experience */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest font-['Oswald',sans-serif]">
            O PADRÃO STEAKHOUSE FOODEXPRESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-wide">
            Por Que Visitar Nosso Salão?
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-red-600 to-amber-500 mx-auto rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#14100e] border border-[#2b221c] space-y-3 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Flame size={24} />
            </div>
            <h3 className="text-lg font-bold text-white font-['Oswald',sans-serif] uppercase tracking-wide">
              Grelhados ao Vivo
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Cozinha aberta com brasa viva. Você acompanha os cortes nobres de 180g sendo selados no ponto exato com aromas inconfundíveis.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14100e] border border-[#2b221c] space-y-3 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Beer size={24} />
            </div>
            <h3 className="text-lg font-bold text-white font-['Oswald',sans-serif] uppercase tracking-wide">
              Caneca Ultracongelada
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Chopps artesanais puro malte servidos em canecas com camada espessa de gelo a -2°C, mantendo a bebida gelada até o último gole.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14100e] border border-[#2b221c] space-y-3 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Wind size={24} />
            </div>
            <h3 className="text-lg font-bold text-white font-['Oswald',sans-serif] uppercase tracking-wide">
              Salão 100% Climatizado
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Ambiente moderno, aconchegante e refrigerado, com sofás acolchoados e mesas para casais, famílias ou grupos grandes de comemoração.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14100e] border border-[#2b221c] space-y-3 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <UtensilsCrossed size={24} />
            </div>
            <h3 className="text-lg font-bold text-white font-['Oswald',sans-serif] uppercase tracking-wide">
              Pedido Digital na Mesa
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Sem precisar esperar garçom. Você escolhe na tela, envia o pedido para a cozinha e acompanha o preparo e a entrega em tempo real.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Location & Operating Hours */}
      <section className="bg-[#0e0c0a] border-y border-[#241d18] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-500 uppercase font-['Oswald',sans-serif] tracking-widest">
                  ONDE ESTAMOS &amp; COMO CHEGAR
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-wide">
                  Visite Nossa Unidade
                </h2>
              </div>

              <div className="space-y-4 text-sm text-stone-300">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#14100e] border border-[#292019]">
                  <MapPin size={20} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-semibold">Endereço Principal:</strong>
                    <span>Av. Paulista dos Burgers, 1200 · Centro Gastronômico</span>
                    <p className="text-xs text-stone-500 mt-1">Estacionamento conveniado e fácil acesso para motoristas de aplicativo.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#14100e] border border-[#292019]">
                  <Clock size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-semibold">Horários de Atendimento no Salão:</strong>
                    <span>Terça a Domingo: 18:00 às 23:30</span>
                    <p className="text-xs text-stone-500 mt-1">Segunda-feira: Fechado para descanso da equipe.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#14100e] border border-[#292019]">
                  <Phone size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-semibold">Contato &amp; Reservas:</strong>
                    <span>WhatsApp: (11) 99999-9999</span>
                    <p className="text-xs text-stone-500 mt-1">Atendimento imediato para dúvidas, reservas e encomendas.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Photo Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[#2b221c] shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop"
                alt="Mesa do restaurante FoodExpress"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                <div className="space-y-1">
                  <span className="text-amber-400 font-bold text-xs uppercase font-['Oswald',sans-serif] tracking-wider">
                    RESERVE OU VENHA DIRETO
                  </span>
                  <p className="text-white font-black text-xl font-['Oswald',sans-serif] uppercase">
                    Mesas disponíveis sem fila de espera
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Outback Steakhouse Dark Footer */}
      <footer className="w-full bg-[#090807] border-t border-[#241d18] text-stone-300 relative overflow-hidden mt-auto">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1f1915]">
            <div className="md:col-span-6 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black border-2 border-orange-500/50 shadow-xl ring-2 ring-orange-500/20 overflow-hidden">
                  <img src="/logo.jpg" alt="FoodExpress" className="w-full h-full object-cover scale-105" />
                </div>
                <div>
                  <span className="text-2xl font-black text-white tracking-tight leading-none block font-['Oswald',sans-serif]">
                    Food<span className="bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-clip-text text-transparent">Express</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-500/90 tracking-widest uppercase mt-0.5 block font-['Oswald',sans-serif]">
                    Steakhouse &amp; Artisan Burgers
                  </span>
                </div>
              </div>

              <p className="text-sm text-stone-400 max-w-lg leading-relaxed">
                Hambúrgueres artesanais preparados com cortes nobres grelhados na brasa viva, queijos fundidos e receitas autorais exclusivas no autêntico padrão steakhouse. Sabor marcante e generosidade do início ao fim.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14100d] border border-[#2d221a] text-xs font-bold text-stone-300 font-['Oswald',sans-serif] uppercase tracking-wider">
                  <Flame size={12} className="text-orange-500 fill-orange-500" /> Grelhado no Fogo
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14100d] border border-[#2d221a] text-xs font-bold text-stone-300 font-['Oswald',sans-serif] uppercase tracking-wider">
                  <Sparkles size={12} className="text-amber-400" /> Blends Nobres 180g
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14100d] border border-[#2d221a] text-xs font-bold text-stone-300 font-['Oswald',sans-serif] uppercase tracking-wider">
                  <UtensilsCrossed size={12} className="text-orange-400" /> Salão Acolhedor
                </span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-orange-500"></div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white font-['Oswald',sans-serif]">
                  Atendimento &amp; Salão
                </h4>
              </div>

              <div className="space-y-3 text-xs text-stone-400">
                <div className="rounded-xl bg-[#13100d] border border-[#261f19] p-3.5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-bold text-white uppercase font-['Oswald',sans-serif] tracking-wide">Aberto Hoje</span>
                  </div>
                  <p className="text-stone-300">Terça a Domingo: <strong className="text-amber-400 font-['Oswald',sans-serif]">18:00 às 23:30</strong></p>
                  <p className="text-[11px] text-stone-500">Segunda-feira: Fechado para descanso</p>
                </div>

                <div className="flex items-center gap-2 text-stone-400 text-xs">
                  <Clock size={14} className="text-amber-500 shrink-0" />
                  <span>Tempo médio: <strong className="text-stone-200">30 a 45 min</strong></span>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-orange-500"></div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white font-['Oswald',sans-serif]">
                  Pagamento &amp; Acesso
                </h4>
              </div>

              <div className="space-y-2 text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Pix (aprovação instantânea)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Cartões de Crédito e Débito</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Dinheiro (troco sob solicitação)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#171310] hover:bg-[#201a15] border border-[#382c23] hover:border-orange-500/70 text-stone-200 hover:text-white text-xs font-bold uppercase tracking-wider font-['Oswald',sans-serif] transition-all shadow-md cursor-pointer"
                >
                  <ShieldCheck size={15} className="text-orange-500" />
                  <span>Acesso do Atendente</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={14} className="text-orange-500" />
              <p>© {new Date().getFullYear()} FoodExpress Steakhouse. Todos os direitos reservados.</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-stone-600">
              <span>Cardápio Digital &amp; Sistema de Pedidos</span>
              <span>•</span>
              <span className="text-amber-500/80 font-bold font-['Oswald',sans-serif] uppercase tracking-wider">Sabor da Brasa</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
