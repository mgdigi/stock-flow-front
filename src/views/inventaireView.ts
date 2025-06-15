import { fetchProducts } from '../services/productService';
import { fetchSales } from '../services/venteService';
import type { Product, Sale } from '../types';

const linkInventaire = document.getElementById('link-inventaire') as HTMLAnchorElement;

export async function showInventaire(): Promise<void> {
  const section = document.getElementById('inventaire-section') as HTMLElement;
  if (!section) return;

  section.style.display = 'block';
  linkInventaire.classList.add('sidebar-active');
  linkInventaire.style.color = 'blue';

  showInventoryLoader();

  try {
    const products = await fetchProducts();
    const sales = await fetchSales();
    
    renderInventoryHeader(products);
    renderStockAlerts(products);
    renderInventoryValue(products);
    renderTopProducts(products, sales);
    renderStockMovements(products, sales);
    renderInventoryStats(products, sales);
    
  } catch (error) {
    console.error('Erreur lors du chargement de l\'inventaire:', error);
    showInventoryError();
  }
}

function showInventoryLoader(): void {
  const container = document.getElementById('inventaire-content');
  if (!container) return;
  
  container.innerHTML = `
    <div class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Chargement de l'inventaire...</p>
      </div>
    </div>
  `;
}

function showInventoryError(): void {
  const container = document.getElementById('inventaire-content');
  if (!container) return;
  
  container.innerHTML = `
    <div class="text-center py-20">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-red-600 text-3xl">❌</span>
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Erreur de chargement</h3>
      <p class="text-gray-600 mb-4">Impossible de charger les données d'inventaire</p>
      <button onclick="location.reload()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Réessayer
      </button>
    </div>
  `;
}

function renderInventoryHeader(products: Product[]): void {
  const container = document.getElementById('inventory-header');
  if (!container) return;

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockCount = products.filter(p => p.quantity <= 5).length;

  container.innerHTML = `
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">📦 Gestion d'Inventaire</h1>
          <p class="text-blue-100 text-lg">Vue d'ensemble de votre stock</p>
        </div>
        <div class="text-right">
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p class="text-2xl font-bold">${totalProducts}</p>
            <p class="text-blue-100 text-sm">Produits</p>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div class="flex items-center">
            <span class="text-2xl mr-3">📊</span>
            <div>
              <p class="text-2xl font-bold">${totalStock}</p>
              <p class="text-blue-100 text-sm">Articles en stock</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div class="flex items-center">
            <span class="text-2xl mr-3">⚠️</span>
            <div>
              <p class="text-2xl font-bold text-yellow-300">${lowStockCount}</p>
              <p class="text-blue-100 text-sm">Alertes stock</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div class="flex items-center">
            <span class="text-2xl mr-3">💰</span>
            <div>
              <p class="text-xl font-bold">${products.reduce((sum, p) => sum + (p.quantity * p.price), 0).toLocaleString('fr-FR')}</p>
              <p class="text-blue-100 text-sm">FCFA - Valeur totale</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStockAlerts(products: Product[]): void {
  const container = document.getElementById('stock-alerts');
  if (!container) return;

  const lowStockProducts = products.filter(p => p.quantity <= (p.threshold || 5));
  const outOfStockProducts = products.filter(p => p.quantity === 0);

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      <!-- Stock Faible -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-orange-200">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
              <i class="fa-solid fa-triangle-exclamation  text-2xl text-orange-600"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">Stock Faible</h3>
              <p class="text-orange-600 font-medium">${lowStockProducts.length} produit(s) concerné(s)</p>
            </div>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              Seuil:${lowStockProducts.reduce((sum, p) => sum + (p.threshold || 5), 0)}
            </span>
          </div>
        </div>
        
        <div class="space-y-3 max-h-64 overflow-y-auto">
          ${lowStockProducts.length > 0 ? lowStockProducts.slice(0, 8).map(p => `
            <div class="flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors border border-orange-200">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center mr-3">
                  <span class="text-orange-700 font-bold text-sm">${p.quantity}</span>
                </div>
                <div>
                  <p class="font-medium text-gray-800">${p.name}</p>
                  <p class="text-sm text-gray-600">${p.price.toLocaleString('fr-FR')} FCFA</p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-200 text-orange-800">
                  ${p.quantity} restant(s)
                </span>
              </div>
            </div>
          `).join('') : `
            <div class="text-center py-8">
              <span class="text-green-500 text-4xl">✅</span>
              <p class="text-green-600 font-medium mt-2">Aucun stock faible</p>
              <p class="text-gray-500 text-sm">Tous vos produits sont bien approvisionnés</p>
            </div>
          `}
          
          ${lowStockProducts.length > 8 ? `
            <div class="text-center pt-3 border-t border-orange-200">
              <p class="text-sm text-orange-600 font-medium">... et ${lowStockProducts.length - 8} autres produits</p>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Rupture de Stock -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-red-200">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
              <span class="text-red-600 text-2xl">🚫</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">Rupture de Stock</h3>
              <p class="text-red-600 font-medium">${outOfStockProducts.length} produit(s) épuisé(s)</p>
            </div>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Stock: 0
            </span>
          </div>
        </div>
        
        <div class="space-y-3 max-h-64 overflow-y-auto">
          ${outOfStockProducts.length > 0 ? outOfStockProducts.slice(0, 8).map(p => `
            <div class="flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center mr-3">
                  <span class="text-red-700 font-bold text-sm">0</span>
                </div>
                <div>
                  <p class="font-medium text-gray-800">${p.name}</p>
                  <p class="text-sm text-gray-600">${p.price.toLocaleString('fr-FR')} FCFA</p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800">
                  Épuisé
                </span>
              </div>
            </div>
          `).join('') : `
            <div class="text-center py-8">
                <i class="fa-solid fa-circle-check text-4xl text-green-800"></i>
            <p class="text-green-600 font-medium mt-2">Aucune rupture</p>
              <p class="text-gray-500 text-sm">Tous vos produits sont disponibles</p>
            </div>
          `}
          
          ${outOfStockProducts.length > 8 ? `
            <div class="text-center pt-3 border-t border-red-200">
              <p class="text-sm text-red-600 font-medium">... et ${outOfStockProducts.length - 8} autres produits</p>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderInventoryValue(products: Product[]): void {
  const container = document.getElementById('inventory-value');
  if (!container) return;

  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const averageValue = products.length > 0 ? totalValue / products.length : 0;
  const averagePrice = totalItems > 0 ? totalValue / totalItems : 0;

  container.innerHTML = `
    <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-blue-200 mb-8">
      <div class="flex items-center mb-6">
        <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
          <span class="text-blue-600 text-3xl">💰</span>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-gray-800">Valeur de l'Inventaire</h3>
          <p class="text-blue-600 font-medium">Analyse financière de votre stock</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span class="text-white text-xl">💵</span>
          </div>
          <p class="text-3xl font-bold text-green-600 mb-1">${totalValue.toLocaleString('fr-FR')}</p>
          <p class="text-sm font-medium text-green-700">FCFA - Valeur totale</p>
        </div>
        
        <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span class="text-white text-xl">📦</span>
          </div>
          <p class="text-3xl font-bold text-blue-600 mb-1">${totalItems}</p>
          <p class="text-sm font-medium text-blue-700">Articles en stock</p>
        </div>
        
        <div class="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i class="fa-solid fa-tag text-2xl"></i>
          </div>
          <p class="text-3xl font-bold text-purple-600 mb-1">${products.length}</p>
          <p class="text-sm font-medium text-purple-700">Produits différents</p>
        </div>
        
        <div class="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
          <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span class="text-white text-xl">📊</span>
          </div>
          <p class="text-3xl font-bold text-orange-600 mb-1">${averagePrice.toLocaleString('fr-FR')}</p>
          <p class="text-sm font-medium text-orange-700">FCFA - Prix moyen</p>
        </div>
      </div>
      
      <!-- Statistiques détaillées -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 rounded-xl p-4">
            <h4 class="font-semibold text-gray-800 mb-3">📈 Répartition par valeur</h4>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Valeur moyenne par produit:</span>
                <span class="font-medium text-gray-800">${averageValue.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Prix unitaire moyen:</span>
                <span class="font-medium text-gray-800">${averagePrice.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Articles par produit:</span>
                <span class="font-medium text-gray-800">${products.length > 0 ? Math.round(totalItems / products.length) : 0}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-xl p-4">
            <h4 class="font-semibold text-gray-800 mb-3">🎯 Indicateurs clés</h4>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Taux de rotation estimé:</span>
                <span class="font-medium text-gray-800">En cours de calcul</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Produits actifs:</span>
                <span class="font-medium text-gray-800">${products.filter(p => p.quantity > 0).length}/${products.length}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Couverture stock:</span>
                <span class="font-medium text-gray-800">${products.filter(p => p.quantity > 5).length} produits OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}


function renderTopProducts(products: Product[], sales: Sale[]): void {
  const container = document.getElementById('top-products');
  if (!container) return;

  const soldQuantities: Record<string, number> = {};
  sales.forEach(sale => {
    sale.products.forEach(item => {
      let productId: string;
      if (typeof item.product._id === 'string') {
        productId = item.product._id;
      } else if (item.productId && typeof item.productId === 'object' && item.productId._id) {
        productId = item.productId._id;
      } else {
        return;
      }
      soldQuantities[productId] = (soldQuantities[productId] || 0) + item.quantity;
    });
  });

  const productsWithSales = products.map(product => ({
    ...product,
    totalSold: soldQuantities[product._id] || 0
  }));

  const topProducts = productsWithSales.sort((a, b) => b.totalSold - a.totalSold).slice(0, 8);
  const neverSoldProducts = productsWithSales.filter(p => p.totalSold === 0);

  container.innerHTML = `
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
      
      <!-- Top Produits les Plus Vendus -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-green-200">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
            <i class="fa-solid fa-star text-2xl text-black"></i>
          </div>
          <div>
            <h4 class="text-xl font-bold text-gray-800">Top Produits</h4>
            <p class="text-green-600 font-medium">Les plus vendus</p>
          </div>
        </div>
        
        <div class="space-y-3 max-h-96 overflow-y-auto">
          ${topProducts.length > 0 ? topProducts.map((product, index) => `
            <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all duration-200 border border-green-200">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span class="font-bold text-lg">${index + 1}</span>
                </div>
                <div>
                  <p class="font-bold text-gray-800 text-lg">${product.name}</p>
                  <div class="flex items-center space-x-4 mt-1">
                    <span class="text-sm text-gray-600">Stock: ${product.quantity}</span>
                    <span class="text-sm text-green-600 font-medium">${product.price.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="bg-green-500 text-white px-4 py-2 rounded-xl shadow-md">
                  <p class="font-bold text-xl">${product.totalSold}</p>
                  <p class="text-xs text-green-100">vendus</p>
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="text-center py-12">
              <span class="text-gray-400 text-5xl">📊</span>
              <p class="text-gray-500 font-medium mt-4">Aucune vente enregistrée</p>
              <p class="text-gray-400 text-sm">Les statistiques apparaîtront après les premières ventes</p>
            </div>
          `}
        </div>
      </div>

      <!-- Produits Jamais Vendus -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-orange-200">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
            <i class="fa-solid fa-lock text-2xl text-black"></i>
          </div>
          <div>
            <h4 class="text-xl font-bold text-gray-800">Produits Dormants</h4>
            <p class="text-orange-600 font-medium">${neverSoldProducts.length} jamais vendus</p>
          </div>
        </div>
        
        <div class="space-y-3 max-h-96 overflow-y-auto">
          ${neverSoldProducts.length > 0 ? neverSoldProducts.slice(0, 10).map(product => `
            <div class="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 rounded-xl transition-all duration-200 border border-orange-200">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center mr-3">
                    <i class="fa-solid fa-notdef text-2xl text-black"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-800">${product.name}</p>
                  <p class="text-sm text-orange-600 font-medium">${product.price.toLocaleString('fr-FR')} FCFA</p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-200 text-orange-800">
                  Stock: ${product.quantity}
                </span>
              </div>
            </div>
          `).join('') : `
            <div class="text-center py-12">
              <span class="text-green-500 text-5xl">🎉</span>
              <p class="text-green-600 font-medium mt-4">Excellent !</p>
              <p class="text-gray-500 text-sm">Tous vos produits ont été vendus au moins une fois</p>
            </div>
          `}
          
          ${neverSoldProducts.length > 10 ? `
            <div class="text-center pt-4 border-t border-orange-200">
              <p class="text-sm text-orange-600 font-medium">... et ${neverSoldProducts.length - 10} autres produits dormants</p>
              <button class="mt-2 text-orange-600 hover:text-orange-800 text-sm font-medium underline">
                Voir tous les produits dormants
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderStockMovements(products: Product[], sales: Sale[]): void {
  const container = document.getElementById('stock-movements');
  if (!container) return;

  const recentMovements: Array<{
    date: Date;
    type: 'sortie' | 'entree';
    productName: string;
    quantity: number;
    reason: string;
    clientName?: string;
    value: number;
  }> = [];

  sales.forEach(sale => {
    sale.products.forEach(item => {
      let productName = 'Produit inconnu';
      let productPrice = 0;
      
      if (typeof item.product._id === 'string' && item.product.name) {
        productName = item.product.name;
        productPrice = item.product.price || 0;
      } else if (typeof item.productId === 'string') {
        const product = products.find(p => p._id === item.productId);
        productName = product ? product.name : 'Produit inconnu';
        productPrice = product ? product.price : 0;
      }

      recentMovements.push({
        date: new Date(sale.date),
        type: 'sortie',
        productName,
        quantity: item.quantity,
        reason: `Vente`,
        clientName: sale.client.name,
        value: item.quantity * productPrice
      });
    });
  });

  const sortedMovements = recentMovements
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 15);

  container.innerHTML = `
    <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-indigo-200 mb-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
            <i class="fa-solid fa-repeat text-2xl text-blue-600"></i>
          </div>
          <div>
            <h4 class="text-xl font-bold text-gray-800">Mouvements de Stock</h4>
            <p class="text-indigo-600 font-medium">Activité récente</p>
          </div>
        </div>
        <div class="text-right">
          <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            ${sortedMovements.length} mouvements
          </span>
        </div>
      </div>
      
      <div class="space-y-3 max-h-96 overflow-y-auto">
        ${sortedMovements.length > 0 ? sortedMovements.map(movement => `
          <div class="flex items-center justify-between p-4 bg-gradient-to-r ${
            movement.type === 'sortie' 
              ? 'from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200' 
              : 'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200'
          } rounded-xl transition-all duration-200 border">
            <div class="flex items-center">
              <div class="w-12 h-12 ${
                movement.type === 'sortie' 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-green-100 text-green-600'
              } rounded-xl flex items-center justify-center mr-4">
                <i class="fa-solid fa-right-to-bracket"></i>
              </div>
              <div>
                <p class="font-bold text-gray-800">${movement.productName}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-sm text-gray-600">${movement.reason}</span>
                  ${movement.clientName ? `<span class="text-sm text-blue-600 font-medium">→ ${movement.clientName}</span>` : ''}
                </div>
                <p class="text-xs text-gray-500 mt-1">${movement.date.toLocaleDateString('fr-FR')} à ${movement.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex flex-col items-end">
                <span class="font-bold text-lg ${
                  movement.type === 'sortie' ? 'text-red-600' : 'text-green-600'
                }">
                  ${movement.type === 'sortie' ? '-' : '+'}${movement.quantity}
                </span>
                <span class="text-sm text-gray-600 font-medium">
                  ${movement.value.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>
          </div>
        `).join('') : `
          <div class="text-center py-12">
            <span class="text-gray-400 text-5xl">📋</span>
            <p class="text-gray-500 font-medium mt-4">Aucun mouvement récent</p>
            <p class="text-gray-400 text-sm">Les mouvements de stock apparaîtront ici après les premières transactions</p>
          </div>
        `}
        
        ${sortedMovements.length === 15 ? `
          <div class="text-center pt-4 border-t border-gray-200">
            <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline transition-colors">
              Voir l'historique complet des mouvements →
            </button>
          </div>
        ` : ''}
      </div>
      
      <!-- Résumé des mouvements -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-red-50 rounded-xl">
            <p class="text-2xl font-bold text-red-600">${sortedMovements.filter(m => m.type === 'sortie').length}</p>
            <p class="text-sm text-red-700 font-medium">Sorties récentes</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-xl">
            <p class="text-2xl font-bold text-green-600">${sortedMovements.filter(m => m.type === 'entree').length}</p>
            <p class="text-sm text-green-700 font-medium">Entrées récentes</p>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-xl">
            <p class="text-2xl font-bold text-blue-600">${sortedMovements.reduce((sum, m) => sum + (m.type === 'sortie' ? -m.quantity : m.quantity), 0)}</p>
            <p class="text-sm text-blue-700 font-medium">Variation nette</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderInventoryStats(products: Product[], sales: Sale[]): void {
  const container = document.getElementById('inventory-stats');
  if (!container) return;

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.quantity > 0).length;
  const lowStockProducts = products.filter(p => p.quantity <= 5).length;
  const highValueProducts = products.filter(p => (p.quantity * p.price) > 50000).length;
  const outOfStockProducts = products.filter(p => p.quantity === 0).length;
  
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  const averageStockValue = totalProducts > 0 ? totalValue / totalProducts : 0;
  const stockTurnoverRate = sales.length > 0 ? (sales.length / totalProducts) * 100 : 0;
  
  const excellentStock = products.filter(p => p.quantity > 20).length;
  const goodStock = products.filter(p => p.quantity > 10 && p.quantity <= 20).length;
  const averageStock = products.filter(p => p.quantity > 5 && p.quantity <= 10).length;

  container.innerHTML = `
    <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-200 mb-8">
      <div class="flex items-center mb-8">
        <div class="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mr-4">
          <span class="text-indigo-600 text-3xl">📊</span>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-gray-800">Statistiques Avancées</h3>
          <p class="text-indigo-600 font-medium">Analyse détaillée de votre inventaire</p>
        </div>
      </div>

      <!-- Métriques principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span class="text-white text-xl">📦</span>
          </div>
          <p class="text-3xl font-bold text-blue-600 mb-1">${activeProducts}</p>
          <p class="text-sm font-medium text-blue-700">Produits actifs</p>
          <p class="text-xs text-blue-600 mt-1">${totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0}% du total</p>
        </div>

        <div class="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span class="text-white text-xl">✅</span>
          </div>
          <p class="text-3xl font-bold text-green-600 mb-1">${excellentStock}</p>
          <p class="text-sm font-medium text-green-700">Stock excellent</p>
          <p class="text-xs text-green-600 mt-1">> 20 unités</p>
        </div>

        <div class="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
          <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span class="text-white text-xl">⚠️</span>
          </div>
          <p class="text-3xl font-bold text-orange-600 mb-1">${lowStockProducts}</p>
          <p class="text-sm font-medium text-orange-700">Alertes stock</p>
          <p class="text-xs text-orange-600 mt-1">≤ 5 unités</p>
        </div>

        <div class="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span class="text-white text-xl">💎</span>
          </div>
          <p class="text-3xl font-bold text-purple-600 mb-1">${highValueProducts}</p>
          <p class="text-sm font-medium text-purple-700">Haute valeur</p>
          <p class="text-xs text-purple-600 mt-1">> 50k FCFA</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="bg-gray-50 rounded-xl p-6">
          <h4 class="text-lg font-bold text-gray-800 mb-4">📈 Répartition du Stock</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span class="text-sm font-medium text-gray-700">Excellent (>20)</span>
              </div>
              <div class="flex items-center">
                <span class="text-sm font-bold text-gray-800 mr-2">${excellentStock}</span>
                <div class="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-green-500 rounded-full" style="width: ${totalProducts > 0 ? (excellentStock / totalProducts) * 100 : 0}%"></div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span class="text-sm font-medium text-gray-700">Bon (11-20)</span>
              </div>
              <div class="flex items-center">
                <span class="text-sm font-bold text-gray-800 mr-2">${goodStock}</span>
                <div class="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full" style="width: ${totalProducts > 0 ? (goodStock / totalProducts) * 100 : 0}%"></div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span class="text-sm font-medium text-gray-700">Moyen (6-10)</span>
              </div>
              <div class="flex items-center">
                <span class="text-sm font-bold text-gray-800 mr-2">${averageStock}</span>
                <div class="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-yellow-500 rounded-full" style="width: ${totalProducts > 0 ? (averageStock / totalProducts) * 100 : 0}%"></div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                <span class="text-sm font-medium text-gray-700">Faible (1-5)</span>
              </div>
              <div class="flex items-center">
                <span class="text-sm font-bold text-gray-800 mr-2">${lowStockProducts}</span>
                <div class="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-orange-500 rounded-full" style="width: ${totalProducts > 0 ? (lowStockProducts / totalProducts) * 100 : 0}%"></div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span class="text-sm font-medium text-gray-700">Épuisé (0)</span>
              </div>
              <div class="flex items-center">
                <span class="text-sm font-bold text-gray-800 mr-2">${outOfStockProducts}</span>
                <div class="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-red-500 rounded-full" style="width: ${totalProducts > 0 ? (outOfStockProducts / totalProducts) * 100 : 0}%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-6">
          <h4 class="text-lg font-bold text-gray-800 mb-4">🎯 Indicateurs Clés</h4>
          <div class="space-y-4">
            <div class="flex justify-between items-center p-3 bg-white rounded-lg">
              <span class="text-sm font-medium text-gray-700">Taux de rotation</span>
              <span class="text-lg font-bold text-indigo-600">${stockTurnoverRate.toFixed(1)}%</span>
            </div>

            <div class="flex justify-between items-center p-3 bg-white rounded-lg">
              <span class="text-sm font-medium text-gray-700">Valeur moyenne/produit</span>
              <span class="text-lg font-bold text-green-600">${averageStockValue.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div class="flex justify-between items-center p-3 bg-white rounded-lg">
              <span class="text-sm font-medium text-gray-700">Taux de disponibilité</span>
              <span class="text-lg font-bold text-blue-600">${totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0}%</span>
            </div>

            <div class="flex justify-between items-center p-3 bg-white rounded-lg">
              <span class="text-sm font-medium text-gray-700">Produits à risque</span>
              <span class="text-lg font-bold text-red-600">${lowStockProducts + outOfStockProducts}</span>
            </div>

            <div class="flex justify-between items-center p-3 bg-white rounded-lg">
              <span class="text-sm font-medium text-gray-700">Performance globale</span>
              <span class="text-lg font-bold ${
                (activeProducts / totalProducts) > 0.8 ? 'text-green-600' : 
                (activeProducts / totalProducts) > 0.6 ? 'text-orange-600' : 'text-red-600'
              }">
                ${totalProducts > 0 ? 
                  (activeProducts / totalProducts) > 0.8 ? 'Excellente' : 
                  (activeProducts / totalProducts) > 0.6 ? 'Bonne' : 'À améliorer'
                : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommandations -->
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h4 class="text-lg font-bold text-gray-800 mb-4">💡 Recommandations</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${lowStockProducts > 0 ? `
            <div class="flex items-start p-3 bg-orange-100 rounded-lg">
              <span class="text-orange-600 text-xl mr-3">⚠️</span>
              <div>
                <p class="font-medium text-orange-800">Réapprovisionnement urgent</p>
                <p class="text-sm text-orange-700">${lowStockProducts} produit(s) en stock faible</p>
              </div>
            </div>
          ` : ''}
          
          ${outOfStockProducts > 0 ? `
            <div class="flex items-start p-3 bg-red-100 rounded-lg">
              <span class="text-red-600 text-xl mr-3">🚨</span>
              <div>
                <p class="font-medium text-red-800">Action immédiate requise</p>
                <p class="text-sm text-red-700">${outOfStockProducts} produit(s) en rupture</p>
              </div>
            </div>
          ` : ''}
          
          ${excellentStock > totalProducts * 0.7 ? `
            <div class="flex items-start p-3 bg-green-100 rounded-lg">
              <span class="text-green-600 text-xl mr-3">✅</span>
              <div>
                <p class="font-medium text-green-800">Excellent niveau de stock</p>
                <p class="text-sm text-green-700">Votre inventaire est bien géré</p>
              </div>
            </div>
          ` : ''}
          
          <div class="flex items-start p-3 bg-blue-100 rounded-lg">
            <span class="text-blue-600 text-xl mr-3">📊</span>
            <div>
              <p class="font-medium text-blue-800">Optimisation continue</p>
              <p class="text-sm text-blue-700">Surveillez régulièrement ces indicateurs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export {linkInventaire};