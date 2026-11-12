import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerMenuPage from './pages/CustomerMenuPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminMenuPage from './pages/AdminMenuPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<CustomerMenuPage />} />
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
