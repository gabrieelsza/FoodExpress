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
export function calculateItemPrice(product, selectedVariation, selectedAddons = []) {
  if (!product) return 0;
  const basePrice = selectedVariation ? selectedVariation.price : (product.basePrice || 0);
  const addons = Array.isArray(selectedAddons) ? selectedAddons : [];
  const addonsTotal = addons.reduce((sum, addon) => sum + (addon?.price || 0), 0);
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
    `*NOVO PEDIDO #${order.id} — FoodExpress*`,
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

/**
 * Verified food images dictionary to replace inappropriate stock images or broken links
 */
export const VERIFIED_FOOD_IMAGES = {
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop',
  chicken: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=450&fit=crop',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=450&fit=crop',
  nuggets: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=450&fit=crop',
  onionRings: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=450&fit=crop',
  soda: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=450&fit=crop',
  beer: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&h=450&fit=crop',
  juice: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&h=450&fit=crop',
  water: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=450&fit=crop',
  milkshake: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=450&fit=crop',
  brownie: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=450&fit=crop',
  pudim: 'https://images.unsplash.com/photo-1532556660262-1c45d5fae825?w=600&h=450&fit=crop',
};

/**
 * Sanitizes and guarantees that an item image strictly represents that item.
 * Fixes any inappropriate photos (e.g. gym workout photo or cat photo) or broken URLs.
 */
export function sanitizeProductImageUrl(url, productName = '') {
  const nameLower = (productName || '').toLowerCase();

  // Specifically check for known problematic Unsplash IDs
  const isGymGuy = url && url.includes('photo-1581636625402');
  const isCatPhoto = url && url.includes('photo-1584282479261');
  const isBrokenBeer = url && url.includes('photo-1535958636474');

  if (isGymGuy || nameLower.includes('refrigerante') || nameLower.includes('coca') || nameLower.includes('refri')) {
    return VERIFIED_FOOD_IMAGES.soda;
  }

  if (isBrokenBeer || nameLower.includes('chopp') || nameLower.includes('cerveja')) {
    return VERIFIED_FOOD_IMAGES.beer;
  }

  if (isCatPhoto || nameLower.includes('pudim') || nameLower.includes('flan')) {
    return VERIFIED_FOOD_IMAGES.pudim;
  }

  if (nameLower.includes('suco')) {
    return VERIFIED_FOOD_IMAGES.juice;
  }

  if (nameLower.includes('água') || nameLower.includes('agua')) {
    return VERIFIED_FOOD_IMAGES.water;
  }

  if (nameLower.includes('milkshake')) {
    return VERIFIED_FOOD_IMAGES.milkshake;
  }

  if (nameLower.includes('brownie')) {
    return VERIFIED_FOOD_IMAGES.brownie;
  }

  if (nameLower.includes('batata') || nameLower.includes('fries')) {
    return VERIFIED_FOOD_IMAGES.fries;
  }

  if (nameLower.includes('nugget')) {
    return VERIFIED_FOOD_IMAGES.nuggets;
  }

  if (nameLower.includes('onion')) {
    return VERIFIED_FOOD_IMAGES.onionRings;
  }

  if (nameLower.includes('frango') || nameLower.includes('crispy')) {
    return VERIFIED_FOOD_IMAGES.chicken;
  }

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return VERIFIED_FOOD_IMAGES.burger;
  }

  return url;
}

export function getFallbackFoodImage(productName = '') {
  return sanitizeProductImageUrl('', productName);
}

/**
 * Sanitizes and guarantees menu data integrity, preventing stale inappropriate images
 * and ensuring new dishes (like Chopp and Pudim) are properly present.
 */
export function getSanitizedMenuData(rawMenuData, fallbackMenu) {
  if (!rawMenuData || !Array.isArray(rawMenuData.categories)) return fallbackMenu;

  const hasChopp = rawMenuData.categories.some((c) =>
    (c.products || []).some((p) => p.name.toLowerCase().includes('chopp'))
  );
  const hasPudim = rawMenuData.categories.some((c) =>
    (c.products || []).some((p) => p.name.toLowerCase().includes('pudim'))
  );

  if (!hasChopp || !hasPudim) {
    return fallbackMenu;
  }

  return {
    ...rawMenuData,
    categories: rawMenuData.categories.map((cat) => ({
      ...cat,
      products: (cat.products || []).map((prod) => ({
        ...prod,
        imageUrl: sanitizeProductImageUrl(prod.imageUrl, prod.name),
      })),
    })),
  };
}


