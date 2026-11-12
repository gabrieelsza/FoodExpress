import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import RestaurantPage from './pages/RestaurantPage'
import CustomerMenuPage from './pages/CustomerMenuPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminMenuPage from './pages/AdminMenuPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      {/* 1. ABA INÍCIO (Tela Demonstrativa Inicial Outback) */}
      <Route path="/" element={<HomePage />} />

      {/* 2. ABA NOSSOS PRODUTOS (Página Dedicada ao Catálogo de Produtos) */}
      <Route path="/nossos-produtos" element={<ProductsPage />} />
      <Route path="/produtos" element={<Navigate to="/nossos-produtos" replace />} />

      {/* 3. ABA RESTAURANTE & SALÃO (Página Dedicada ao Espaço Presencial) */}
      <Route path="/restaurante" element={<RestaurantPage />} />
      <Route path="/salao" element={<Navigate to="/restaurante" replace />} />

      {/* 4. ABA DELIVERY & CARDÁPIO OPERACIONAL */}
      <Route path="/delivery" element={<CustomerMenuPage />} />
      <Route path="/cardapio" element={<CustomerMenuPage />} />
      <Route path="/menu" element={<Navigate to="/delivery" replace />} />
      <Route path="/pedido/:orderId" element={<OrderTrackingPage />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
      <Route path="/admin/cardapio" element={<AdminMenuPage />} />

      {/* Aliases for English paths */}
      <Route path="/admin/orders" element={<Navigate to="/admin/pedidos" replace />} />
      <Route path="/admin/menu" element={<Navigate to="/admin/cardapio" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
