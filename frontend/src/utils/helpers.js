/**
 * Format price to BRL currency
 */
export function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Calculate item unit price based on variation and addons
 * unitPrice = (variationPrice ?? productBasePrice) + sum(addonsPrices)
 */
export function calculateItemPrice(product, selectedVariation, selectedAddons) {
  const basePrice = selectedVariation ? selectedVariation.price : product.basePrice;
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  return basePrice + addonsTotal;
}

/**
 * Calculate cart total
 */
export function calculateCartTotal(items) {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

/**
 * Generate WhatsApp message for delivery orders
 */
export function generateWhatsAppMessage(order) {
  const lines = [
    `*🍔 NOVO PEDIDO #${order.id} — FoodExpress*`,
    `*Modalidade:* ${order.orderType === 'DELIVERY' ? 'Entrega' : 'Consumo no local'}`,
  ];

  if (order.customerName) {
    lines.push(`*Cliente:* ${order.customerName}`);
  }
  if (order.deliveryAddress) {
    lines.push(`*Endereço/Ref:* ${order.deliveryAddress}`);
  }

  lines.push('');
  lines.push('*Itens do Pedido:*');

  order.items.forEach((item) => {
    let itemLine = `• ${item.quantity}x ${item.productNameSnapshot}`;
    if (item.variationNameSnapshot) {
      itemLine += ` (Variação: ${item.variationNameSnapshot})`;
    }
    lines.push(itemLine);

    const addons = typeof item.addonsJsonSnapshot === 'string'
      ? JSON.parse(item.addonsJsonSnapshot)
      : item.addonsJsonSnapshot;
    if (addons && addons.length > 0) {
      lines.push(`  + Adicionais: ${addons.map((a) => a.name).join(', ')}`);
    }
    if (item.notes) {
      lines.push(`  _Obs: ${item.notes}_`);
    }
    lines.push(`  Subtotal: ${formatPrice(item.unitPrice * item.quantity)}`);
  });

  lines.push('');
  lines.push(`*Valor Total: ${formatPrice(order.totalAmount)}*`);

  return lines.join('\n');
}

/**
 * Generate WhatsApp URL
 */
export function generateWhatsAppUrl(phoneNumber, message) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Calculate time elapsed since order creation in seconds
 */
export function getElapsedSeconds(createdAt) {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
}

/**
 * Check if customer can still cancel (within 5 minutes and status is RECEIVED)
 */
export function canCustomerCancel(order) {
  if (order.status !== 'RECEIVED') return false;
  const elapsed = getElapsedSeconds(order.createdAt);
  return elapsed <= 300; // 5 minutes = 300 seconds
}

/**
 * Get remaining cancel time in seconds
 */
export function getRemainingCancelSeconds(createdAt) {
  const elapsed = getElapsedSeconds(createdAt);
  return Math.max(0, 300 - elapsed);
}

/**
 * Format seconds as MM:SS
 */
export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format relative time (e.g., "há 5 min")
 */
export function formatRelativeTime(dateStr) {
  const elapsed = getElapsedSeconds(dateStr);
  if (elapsed < 60) return 'agora mesmo';
  if (elapsed < 3600) return `há ${Math.floor(elapsed / 60)} min`;
  if (elapsed < 86400) return `há ${Math.floor(elapsed / 3600)}h`;
  return `há ${Math.floor(elapsed / 86400)}d`;
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
