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
  DollarSign,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_MENU } from '../data/mockData';
import { formatPrice } from '../utils/helpers';
import Navbar from '../components/Navbar';

const MENU_STORAGE_KEY = 'foodexpress_admin_menu_data';

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
        categoryId: categoryId || (selectedCategoryFilter !== 'ALL' ? Number(selectedCategoryFilter) : menu.categories[0]?.id || 1),
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
      imageUrl: productForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
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
      // First remove product from any category if editing
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

  const filteredProducts =
    selectedCategoryFilter === 'ALL'
      ? allProducts
      : allProducts.filter((p) => p.categoryId === Number(selectedCategoryFilter));

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 pb-20">
      <Navbar isAdmin={true} onLogout={() => { logout(); navigate('/admin/login'); }} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Gestão do Cardápio</h1>
            <p className="text-sm text-zinc-400">Configure categorias, itens, variações e adicionais do restaurante</p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'categories' ? (
              <button
                onClick={() => handleOpenCategoryModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ea580c] hover:bg-[#f97316] text-white font-medium text-sm rounded-xl shadow-md shadow-black/30 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Nova Categoria
              </button>
            ) : (
              <button
                onClick={() => handleOpenProductModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ea580c] hover:bg-[#f97316] text-white font-medium text-sm rounded-xl shadow-md shadow-black/30 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Novo Produto
              </button>
            )}
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-800 mb-6 bg-[#121214] rounded-t-2xl px-4 pt-2 shadow-sm">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Produtos ({allProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Categorias ({menu.categories.length})
          </button>
        </div>

        {/* ================= CATEGORIES VIEW ================= */}
        {activeTab === 'categories' && (
          <div className="bg-[#121214] rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 text-zinc-400 font-medium border-b border-zinc-800">
                  <tr>
                    <th className="py-3.5 px-4">Ordem</th>
                    <th className="py-3.5 px-4">Nome da Categoria</th>
                    <th className="py-3.5 px-4">Qtd. Produtos</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {menu.categories
                    .slice()
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((cat) => (
                      <tr key={cat.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-zinc-500">#{cat.displayOrder}</td>
                        <td className="py-3.5 px-4 font-bold text-white">{cat.name}</td>
                        <td className="py-3.5 px-4 text-zinc-400">{(cat.products || []).length} itens</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleCategory(cat.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                              cat.active
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/60'
                                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
                            }`}
                          >
                            {cat.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {cat.active ? 'Ativa' : 'Inativa'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenCategoryModal(cat)}
                            className="p-1.5 text-zinc-400 hover:text-orange-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                            title="Editar Categoria"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= PRODUCTS VIEW ================= */}
        {activeTab === 'products' && (
          <div>
            {/* Filter */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Filtrar por:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-[#121214] border border-zinc-800 text-zinc-200 text-sm rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="ALL">Todas as Categorias</option>
                  {menu.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-xs text-zinc-500 font-medium">
                Mostrando {filteredProducts.length} de {allProducts.length} produtos
              </span>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-[#121214] rounded-2xl p-4 border transition-all shadow-sm flex flex-col justify-between ${
                    product.active ? 'border-zinc-800' : 'border-zinc-800/60 bg-zinc-900/60 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex gap-3 mb-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover bg-zinc-900 shrink-0 border border-zinc-800"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-white text-base leading-tight truncate">
                            {product.name}
                          </h3>
                          <span
                            className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              product.active ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                            }`}
                          >
                            {product.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-orange-600 block mt-0.5">
                          {product.categoryName}
                        </span>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                          {product.description || 'Sem descrição'}
                        </p>
                      </div>
                    </div>

                    {/* Variations & Addons preview */}
                    <div className="flex flex-wrap gap-1.5 mb-3 text-[11px] text-gray-600">
                      {product.variations && product.variations.length > 0 && (
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-medium border border-amber-200/50">
                          {product.variations.length} variações
                        </span>
                      )}
                      {product.addons && product.addons.length > 0 && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium border border-blue-200/50">
                          {product.addons.length} adicionais
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer with price & actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">Preço Base</span>
                      <span className="text-base font-extrabold text-gray-900">
                        {formatPrice(product.basePrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleProduct(product.categoryId, product.id)}
                        className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                          product.active
                            ? 'text-gray-500 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={product.active ? 'Pausar/Inativar Produto' : 'Ativar Produto'}
                      >
                        {product.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenProductModal(product, product.categoryId)}
                        className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                        title="Editar Produto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.categoryId, product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Excluir Produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================= CATEGORY MODAL ================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Ex: Sobremesas, Bebidas..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  min="1"
                  value={categoryForm.displayOrder}
                  onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={categoryForm.active}
                  onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                />
                <label htmlFor="catActive" className="text-sm font-medium text-gray-700">
                  Categoria ativa no cardápio público
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm shadow-md transition-all"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PRODUCT MODAL ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl my-8 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b border-gray-100 z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  {menu.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ex: X-Bacon Artesanal"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Descrição dos Ingredientes
                </label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Ex: Pão brioche, hambúrguer 180g, bacon crocante..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Preço Base (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                    placeholder="25.00"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="prodActive"
                  checked={productForm.active}
                  onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                />
                <label htmlFor="prodActive" className="text-sm font-medium text-gray-700">
                  Produto ativo no cardápio público
                </label>
              </div>

              {/* VARIATIONS SECTION */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
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
                    className="text-xs text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>

                {productForm.variations.map((v, index) => (
                  <div key={v.id || index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nome (ex: Duplo, 500ml)"
                      value={v.name}
                      onChange={(e) => {
                        const next = [...productForm.variations];
                        next[index].name = e.target.value;
                        setProductForm({ ...productForm, variations: next });
                      }}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Preço R$"
                      value={v.price}
                      onChange={(e) => {
                        const next = [...productForm.variations];
                        next[index].price = e.target.value;
                        setProductForm({ ...productForm, variations: next });
                      }}
                      className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = productForm.variations.filter((_, i) => i !== index);
                        setProductForm({ ...productForm, variations: next });
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* ADDONS SECTION */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Adicionais Pagos
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
                    className="text-xs text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>

                {productForm.addons.map((a, index) => (
                  <div key={a.id || index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nome (ex: Bacon Extra, Cheddar)"
                      value={a.name}
                      onChange={(e) => {
                        const next = [...productForm.addons];
                        next[index].name = e.target.value;
                        setProductForm({ ...productForm, addons: next });
                      }}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="+ R$"
                      value={a.price}
                      onChange={(e) => {
                        const next = [...productForm.addons];
                        next[index].price = e.target.value;
                        setProductForm({ ...productForm, addons: next });
                      }}
                      className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = productForm.addons.filter((_, i) => i !== index);
                        setProductForm({ ...productForm, addons: next });
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Submit / Cancel */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm shadow-md transition-all"
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
