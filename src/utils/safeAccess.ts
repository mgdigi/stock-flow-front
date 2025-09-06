// Utilitaires pour accès sécurisé aux données
export function getSafeClient(sale: any) {
  return {
    name: sale?.client?.name || sale?.clientInfo?.name || 'Client inconnu',
    email: sale?.client?.email || sale?.clientInfo?.email || 'N/A',
    phone: sale?.client?.phone || sale?.clientInfo?.phone || 'N/A'
  };
}

export function getSafeProduct(saleProduct: any, allProducts: any[]) {
  const product = allProducts?.find(p => p._id === (saleProduct.product || saleProduct.productId));
  return {
    name: product?.name || 'Produit inconnu',
    price: saleProduct.unitPrice || product?.price || 0,
    quantity: saleProduct.quantity || 0
  };
}

export function calculateSafeTotal(sale: any): number {
  if (sale.total) return sale.total;
  if (sale.totalAmount) return sale.totalAmount;
  
  // Calculer à partir des produits
  return sale.products?.reduce((sum: number, item: any) => {
    const unitPrice = item.unitPrice || item.price || 0;
    const quantity = item.quantity || 0;
    return sum + (unitPrice * quantity);
  }, 0) || 0;
}
