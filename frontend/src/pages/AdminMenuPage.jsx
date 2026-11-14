import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Layers,
  Utensils,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Search,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_MENU } from '../data/mockData';
import { formatPrice } from '../utils/helpers';
import Navbar from '../components/Navbar';
import ScrollReveal from '../components/ScrollReveal';

const MENU_STORAGE_KEY = 'foodexpress_admin_menu_data';

const PRESET_IMAGES = [
  { label: 'Hambúrguer Artesanal', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop' },
  { label: 'Smash Burger Duplo', url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=400&fit=crop' },
  { label: 'Frango Crispy Empanado', url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=400&fit=crop' },
  { label: 'Batata Rústica / Cheddar', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=400&fit=crop' },
  { label: 'Onion Rings Crocantes', url: 'https://images.unsplash.com/photo-1639024471287-0351860db52e?w=500&h=400&fit=crop' },
  { label: 'Thunder Brownie Especial', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=400&fit=crop' },
  { label: 'Chopp / Bebida Gelada', url: 'https://images.unsplash.com/photo-1608270191993-9c595080b06b?w=500&h=400&fit=crop' },
];

export default function AdminMenuPage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Load menu state from localStorage or MOCK_MENU
  const [menu, setMenu] = useState(() => {
    try {
      const saved = localStorage.getItem(MENU_STORAGE_KEY);
      return saved ? JSON.parse(saved) : MOCK_MENU;
    } catch {
      return MOCK_MENU;
    }
  });

  // Save changes
  useEffect(() => {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
  }, [menu]);

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'categories'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', displayOrder: 1, active: true });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    categoryId: 1,
    name: '',
    description: '',
    basePrice: '',
    imageUrl: '',
    active: true,
    variations: [],
    addons: [],
  });

  // --- Category Actions ---
  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({ name: cat.name, displayOrder: cat.displayOrder, active: cat.active });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        displayOrder: menu.categories.length + 1,
        active: true,
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    if (editingCategory) {
      setMenu((prev) => ({
        ...prev,
        categories: prev.categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, ...categoryForm, displayOrder: Number(categoryForm.displayOrder) }
            : c
        ),
      }));
    } else {
      const newCategory = {
        id: Date.now(),
        name: categoryForm.name.trim(),
        displayOrder: Number(categoryForm.displayOrder),
        active: categoryForm.active,
        products: [],
      };
      setMenu((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
    }
    setIsCategoryModalOpen(false);
  };

  const handleToggleCategory = (catId) => {
    setMenu((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === catId ? { ...c, active: !c.active } : c
      ),
    }));
  };

  const handleDeleteCategory = (catId) => {
    const cat = menu.categories.find((c) => c.id === catId);
    if (!cat) return;
    if ((cat.products || []).length > 0) {
      if (
        !confirm(
          `Esta categoria contém ${cat.products.length} produto(s). Excluir a categoria também removerá seus produtos. Deseja continuar?`
        )
      ) {
        return;
      }
    } else {
      if (!confirm(`Deseja realmente excluir a categoria "${cat.name}"?`)) return;
    }
    setMenu((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== catId),
    }));
  };

  // --- Product Actions ---
  const handleOpenProductModal = (product = null, categoryId = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        categoryId: product.categoryId || categoryId || menu.categories[0]?.id || 1,
        name: product.name,
        description: product.description || '',
        basePrice: String(product.basePrice),
        imageUrl: product.imageUrl || '',
        active: product.active,
        variations: product.variations ? JSON.parse(JSON.stringify(product.variations)) : [],
        addons: product.addons ? JSON.parse(JSON.stringify(product.addons)) : [],
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        categoryId:
          categoryId ||
          (selectedCategoryFilter !== 'ALL'
            ? Number(selectedCategoryFilter)
            : menu.categories[0]?.id || 1),
        name: '',
        description: '',
        basePrice: '',
        imageUrl: '',
        active: true,
        variations: [],
        addons: [],
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const basePriceNum = parseFloat(productForm.basePrice);
    if (!productForm.name.trim() || isNaN(basePriceNum) || basePriceNum <= 0) {
      alert('Informe um nome válido e um preço base maior que zero.');
      return;
    }

    const targetCatId = Number(productForm.categoryId);

    const productPayload = {
      id: editingProduct ? editingProduct.id : Date.now(),
      categoryId: targetCatId,
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      basePrice: basePriceNum,
      imageUrl:
        productForm.imageUrl.trim() ||
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      active: productForm.active,
      variations: productForm.variations.map((v) => ({
        id: v.id || Date.now() + Math.random(),
        name: v.name.trim(),
        price: parseFloat(v.price) || 0,
        active: v.active !== false,
      })),
      addons: productForm.addons.map((a) => ({
        id: a.id || Date.now() + Math.random(),
        name: a.name.trim(),
        price: parseFloat(a.price) || 0,
        active: a.active !== false,
      })),
    };

    setMenu((prev) => {
      // Remove product from any category if editing
      const updatedCategories = prev.categories.map((c) => ({
        ...c,
        products: (c.products || []).filter((p) => p.id !== productPayload.id),
      }));

      // Add to target category
      return {
        ...prev,
        categories: updatedCategories.map((c) =>
          c.id === targetCatId
            ? { ...c, products: [...(c.products || []), productPayload] }
            : c
        ),
      };
    });

    setIsProductModalOpen(false);
  };

  const handleToggleProduct = (catId, prodId) => {
    setMenu((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              products: (c.products || []).map((p) =>
                p.id === prodId ? { ...p, active: !p.active } : p
              ),
            }
          : c
      ),
    }));
  };

  const handleDeleteProduct = (catId, prodId) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;
    setMenu((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              products: (c.products || []).filter((p) => p.id !== prodId),
            }
          : c
      ),
    }));
  };

  // Helper arrays
  const allProducts = menu.categories.flatMap((c) =>
    (c.products || []).map((p) => ({ ...p, categoryId: c.id, categoryName: c.name }))
  );

  const filteredProducts = allProducts.filter((p) => {
    const matchesCategory =
      selectedCategoryFilter === 'ALL' || p.categoryId === Number(selectedCategoryFilter);
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalProductsCount = allProducts.length;
  const activeProductsCount = allProducts.filter((p) => p.active).length;
  const inactiveProductsCount = totalProductsCount - activeProductsCount;
  const totalCategoriesCount = menu.categories.length;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased pb-20 selection:bg-orange-600">
      <Navbar
        isAdmin={true}
        onLogout={() => {
          logout();
          navigate('/admin/login');
        }}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header & Fast Actions */}
        <ScrollReveal direction="up" duration={600}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-tight">
                  Gestão do Cardápio
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-[11px] font-bold text-orange-400 font-['Oswald',sans-serif] tracking-wider uppercase">
                  <Flame size={12} className="text-orange-500" />
                  Steakhouse Menu
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Cadastre e edite produtos, variações, adicionais, fotos e categorias em tempo real.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleOpenCategoryModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#141210] hover:bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white font-bold text-xs uppercase font-['Oswald',sans-serif] tracking-wider rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-orange-400" />
                <span>Nova Categoria</span>
              </button>

              <button
                onClick={() => handleOpenProductModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase font-['Oswald',sans-serif] tracking-wider rounded-xl shadow-lg shadow-orange-950/60 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Produto</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Operational KPI Summary */}
        <ScrollReveal direction="up" delay={50} duration={600}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
            <div className="bg-[#121214] p-4 rounded-2xl border border-zinc-800 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-['Oswald',sans-serif] block">
                  Total de Produtos
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white mt-0.5 block font-['Oswald',sans-serif]">
                  {totalProductsCount}
                </span>
                <span className="text-[10px] text-zinc-500">Cadastrados no sistema</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Utensils className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#121214] p-4 rounded-2xl border border-zinc-800 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-['Oswald',sans-serif] block">
                  Itens Ativos
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5 block font-['Oswald',sans-serif]">
                  {activeProductsCount}
                </span>
                <span className="text-[10px] text-zinc-500">Visíveis aos clientes</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#121214] p-4 rounded-2xl border border-zinc-800 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-['Oswald',sans-serif] block">
                  Pausados / Ocultos
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5 block font-['Oswald',sans-serif]">
                  {inactiveProductsCount}
                </span>
                <span className="text-[10px] text-zinc-500">Fora do cardápio público</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <EyeOff className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#121214] p-4 rounded-2xl border border-zinc-800 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-['Oswald',sans-serif] block">
                  Categorias
                </span>
                <span className="text-2xl sm:text-3xl font-black text-zinc-300 mt-0.5 block font-['Oswald',sans-serif]">
                  {totalCategoriesCount}
                </span>
                <span className="text-[10px] text-zinc-500">Seções organizadas</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center text-zinc-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Tab switch */}
        <ScrollReveal direction="up" delay={80} duration={600}>
          <div className="flex border-b border-zinc-800 mb-6 bg-[#121214] rounded-2xl p-1.5 shadow-xl">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs uppercase font-['Oswald',sans-serif] tracking-wider transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Produtos ({allProducts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs uppercase font-['Oswald',sans-serif] tracking-wider transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categorias ({menu.categories.length})</span>
            </button>
          </div>
        </ScrollReveal>

        {/* ================= CATEGORIES VIEW ================= */}
        {activeTab === 'categories' && (
          <ScrollReveal direction="up" duration={600}>
            <div className="bg-[#121214] rounded-2xl sm:rounded-3xl shadow-xl border border-zinc-800 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white uppercase font-['Oswald',sans-serif] tracking-wide">
                    Categorias do Cardápio
                  </h3>
                  <p className="text-xs text-zinc-400">Gerencie as abas de navegação visual do cliente</p>
                </div>
                <button
                  onClick={() => handleOpenCategoryModal()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase font-['Oswald',sans-serif] tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0e0d0b] text-zinc-400 font-bold uppercase font-['Oswald',sans-serif] text-xs border-b border-zinc-800">
                    <tr>
                      <th className="py-3.5 px-5">Ordem</th>
                      <th className="py-3.5 px-5">Nome da Categoria</th>
                      <th className="py-3.5 px-5">Qtd. Produtos</th>
                      <th className="py-3.5 px-5 text-center">Status</th>
                      <th className="py-3.5 px-5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {menu.categories
                      .slice()
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((cat) => (
                        <tr key={cat.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-4 px-5 font-bold text-orange-400 font-['Oswald',sans-serif]">
                            #{cat.displayOrder}
                          </td>
                          <td className="py-4 px-5 font-bold text-white text-base font-['Oswald',sans-serif] tracking-wide">
                            {cat.name}
                          </td>
                          <td className="py-4 px-5 text-zinc-400 text-xs">
                            <span className="px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 font-semibold">
                              {(cat.products || []).length} produtos
                            </span>
                          </td>
                          <td className="py-4 px-5 text-center">
                            <button
                              onClick={() => handleToggleCategory(cat.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-['Oswald',sans-serif] tracking-wider uppercase cursor-pointer transition-all ${
                                cat.active
                                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/60 shadow-xs'
                                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800'
                              }`}
                            >
                              {cat.active ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                              <span>{cat.active ? 'Ativa' : 'Inativa'}</span>
                            </button>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenCategoryModal(cat)}
                                className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                                title="Editar Categoria"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                                title="Excluir Categoria"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ================= PRODUCTS VIEW ================= */}
        {activeTab === 'products' && (
          <div>
            {/* Filter & Search Bar */}
            <ScrollReveal direction="up" duration={500}>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 bg-[#121214] border border-zinc-800 p-3 sm:p-4 rounded-2xl shadow-xl">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar lanche por nome ou ingrediente..."
                    className="w-full bg-[#0c0a08] border border-zinc-800 rounded-xl pl-9 pr-9 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Category Filter Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-zinc-400 uppercase font-['Oswald',sans-serif] tracking-wider whitespace-nowrap">
                    Categoria:
                  </span>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-[#0c0a08] border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 font-bold font-['Oswald',sans-serif] tracking-wider uppercase focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="ALL">Todas as Categorias</option>
                    {menu.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </ScrollReveal>

            {/* Results count */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs text-zinc-400 font-medium">
                Mostrando <strong className="text-white font-bold">{filteredProducts.length}</strong> de{' '}
                {allProducts.length} produtos
              </span>
              {searchQuery && (
                <span className="text-xs text-orange-400 font-medium">
                  Filtro por busca: "{searchQuery}"
                </span>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#121214] rounded-3xl border border-zinc-800 shadow-xl">
                <Utensils className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white uppercase font-['Oswald',sans-serif] tracking-wider">
                  Nenhum produto encontrado
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
                  Tente alterar os termos da busca ou mudar a categoria selecionada.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product, idx) => (
                  <ScrollReveal key={product.id} direction="up" delay={idx * 40} duration={500}>
                    <div
                      className={`h-full bg-[#121214] rounded-2xl p-4 sm:p-5 border transition-all shadow-xl flex flex-col justify-between hover:border-zinc-700/80 ${
                        product.active
                          ? 'border-zinc-800'
                          : 'border-zinc-800/60 bg-zinc-950/60 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex gap-3.5 mb-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop';
                            }}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-zinc-900 shrink-0 border border-zinc-800 shadow-md"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-black text-white text-base sm:text-lg leading-tight uppercase font-['Oswald',sans-serif] tracking-wide truncate">
                                {product.name}
                              </h3>
                              <span
                                className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-['Oswald',sans-serif] tracking-wider ${
                                  product.active
                                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                                }`}
                              >
                                {product.active ? 'Ativo' : 'Inativo'}
                              </span>
                            </div>

                            <span className="inline-block text-[11px] font-bold text-orange-400 uppercase font-['Oswald',sans-serif] tracking-wider mt-0.5">
                              {product.categoryName}
                            </span>

                            <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                              {product.description || 'Sem descrição cadastrada.'}
                            </p>
                          </div>
                        </div>

                        {/* Variations & Addons chips */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {product.variations && product.variations.length > 0 && (
                            <span className="bg-amber-950/40 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase font-['Oswald',sans-serif] tracking-wider">
                              {product.variations.length} variações
                            </span>
                          )}
                          {product.addons && product.addons.length > 0 && (
                            <span className="bg-orange-950/40 text-orange-300 border border-orange-800/40 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase font-['Oswald',sans-serif] tracking-wider">
                              {product.addons.length} adicionais
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer with price & actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                        <div>
                          <span className="text-[10px] text-zinc-500 block font-bold uppercase font-['Oswald',sans-serif] tracking-wider">
                            Preço Base
                          </span>
                          <span className="text-lg sm:text-xl font-black text-amber-400 font-['Oswald',sans-serif] tracking-tight">
                            {formatPrice(product.basePrice)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleProduct(product.categoryId, product.id)}
                            className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              product.active
                                ? 'text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10'
                                : 'text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                            title={product.active ? 'Pausar/Inativar Produto' : 'Ativar Produto'}
                          >
                            {product.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleOpenProductModal(product, product.categoryId)}
                            className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-xl transition-all cursor-pointer"
                            title="Editar Produto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.categoryId, product.id)}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                            title="Excluir Produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= CATEGORY MODAL (DARK THEME) ================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#141210] border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl text-white animate-scale-up">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg sm:text-xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-tight">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Oswald',sans-serif] mb-1.5">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Ex: Lanches Especiais, Porções..."
                  className="w-full px-4 py-2.5 bg-[#0c0a08] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Oswald',sans-serif] mb-1.5">
                  Ordem de Exibição na Barra
                </label>
                <input
                  type="number"
                  min="1"
                  value={categoryForm.displayOrder}
                  onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0c0a08] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={categoryForm.active}
                  onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded bg-[#0c0a08] border-zinc-700 cursor-pointer"
                />
                <label
                  htmlFor="catActive"
                  className="text-xs font-semibold text-zinc-300 cursor-pointer select-none"
                >
                  Categoria ativa e visível no cardápio público
                </label>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 py-2.5 border border-zinc-800 text-zinc-400 hover:text-white font-bold font-['Oswald',sans-serif] text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-['Oswald',sans-serif] text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-950/60 transition-all cursor-pointer"
                >
                  Salvar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PRODUCT MODAL (DARK THEME) ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#141210] border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#141210] pb-3 border-b border-zinc-800 z-10">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg sm:text-xl font-black text-white uppercase font-['Oswald',sans-serif] tracking-tight">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h2>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Category Select */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Oswald',sans-serif] mb-1.5">
                  Categoria *
                </label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0c0a08] border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                >
                  {menu.categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-zinc-900 text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Oswald',sans-serif] mb-1.5">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ex: Outback Aussie Burger 180g"
                  className="w-full px-4 py-2.5 bg-[#0c0a08] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Oswald',sans-serif] mb-1.5">
                  Descrição dos Ingredientes
                </label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Ex: Pão brioche selado na manteiga, blend bovino 180g grelhado na brasa viva, cheddar cremoso..."
                  className="w-full px-4 py-2.5 bg-[#0c0a08] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Price & Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Oswald',sans-serif] mb-1.5">
                    Preço Base (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                    placeholder="28.90"
                    className="w-full px-4 py-2.5 bg-[#0c0a08] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Oswald',sans-serif] mb-1.5">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-[#0c0a08] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Live Image Preview & Presets */}
              <div className="p-3.5 rounded-2xl bg-[#0c0a08] border border-zinc-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase font-['Oswald',sans-serif] tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={13} className="text-orange-400" />
                    Pré-visualização da Foto
                  </span>
                  <span className="text-[10px] text-zinc-500">Ou escolha uma foto de alta qualidade abaixo</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={
                      productForm.imageUrl.trim() ||
                      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
                    }
                    alt="Preview"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop';
                    }}
                    className="w-16 h-16 rounded-xl object-cover border border-zinc-800 bg-zinc-900 shrink-0 shadow-md"
                  />
                  <div className="flex-1 flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, imageUrl: preset.url })}
                        className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="prodActive"
                  checked={productForm.active}
                  onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded bg-[#0c0a08] border-zinc-700 cursor-pointer"
                />
                <label htmlFor="prodActive" className="text-xs font-semibold text-zinc-300 cursor-pointer select-none">
                  Produto ativo e disponível para pedidos no cardápio
                </label>
              </div>

              {/* VARIATIONS SECTION */}
              <div className="pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Oswald',sans-serif]">
                    Variações de Tamanho / Porção
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm({
                        ...productForm,
                        variations: [
                          ...productForm.variations,
                          { id: Date.now(), name: '', price: '', active: true },
                        ],
                      })
                    }
                    className="text-xs text-orange-400 hover:text-orange-300 font-bold uppercase font-['Oswald',sans-serif] tracking-wider inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Variação
                  </button>
                </div>

                {productForm.variations.length === 0 ? (
                  <p className="text-[11px] text-zinc-500 italic">
                    Nenhuma variação adicionada (o preço base será utilizado).
                  </p>
                ) : (
                  <div className="space-y-2">
                    {productForm.variations.map((v, index) => (
                      <div
                        key={v.id || index}
                        className="flex items-center gap-2 p-2 rounded-xl bg-[#0c0a08] border border-zinc-800"
                      >
                        <input
                          type="text"
                          placeholder="Nome (ex: Duplo 360g, Grande)"
                          value={v.name}
                          onChange={(e) => {
                            const next = [...productForm.variations];
                            next[index].name = e.target.value;
                            setProductForm({ ...productForm, variations: next });
                          }}
                          className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                        />
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
                            R$
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={v.price}
                            onChange={(e) => {
                              const next = [...productForm.variations];
                              next[index].price = e.target.value;
                              setProductForm({ ...productForm, variations: next });
                            }}
                            className="w-full pl-7 pr-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-amber-400 font-bold focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = productForm.variations.filter((_, i) => i !== index);
                            setProductForm({ ...productForm, variations: next });
                          }}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ADDONS SECTION */}
              <div className="pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Oswald',sans-serif]">
                    Adicionais Extras
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm({
                        ...productForm,
                        addons: [
                          ...productForm.addons,
                          { id: Date.now(), name: '', price: '', active: true },
                        ],
                      })
                    }
                    className="text-xs text-orange-400 hover:text-orange-300 font-bold uppercase font-['Oswald',sans-serif] tracking-wider inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Adicional
                  </button>
                </div>

                {productForm.addons.length === 0 ? (
                  <p className="text-[11px] text-zinc-500 italic">
                    Nenhum adicional cadastrado para este item.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {productForm.addons.map((a, index) => (
                      <div
                        key={a.id || index}
                        className="flex items-center gap-2 p-2 rounded-xl bg-[#0c0a08] border border-zinc-800"
                      >
                        <input
                          type="text"
                          placeholder="Nome (ex: Bacon Extra, Queijo Cheddar)"
                          value={a.name}
                          onChange={(e) => {
                            const next = [...productForm.addons];
                            next[index].name = e.target.value;
                            setProductForm({ ...productForm, addons: next });
                          }}
                          className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                        />
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
                            + R$
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={a.price}
                            onChange={(e) => {
                              const next = [...productForm.addons];
                              next[index].price = e.target.value;
                              setProductForm({ ...productForm, addons: next });
                            }}
                            className="w-full pl-8 pr-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-amber-400 font-bold focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = productForm.addons.filter((_, i) => i !== index);
                            setProductForm({ ...productForm, addons: next });
                          }}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex gap-2.5 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2.5 border border-zinc-800 text-zinc-400 hover:text-white font-bold font-['Oswald',sans-serif] text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-['Oswald',sans-serif] text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-950/60 transition-all cursor-pointer"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
