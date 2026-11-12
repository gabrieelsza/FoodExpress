import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
        <UtensilsCrossed className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Página não encontrada</h2>
      <p className="text-gray-500 max-w-sm mb-8 text-sm">
        Desculpe, o prato que você está procurando não existe no nosso cardápio ou a página foi movida.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl shadow-md transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para o Cardápio
      </Link>
    </div>
  );
}
