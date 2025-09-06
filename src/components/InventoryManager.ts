import { StatsService } from '../services/StatsService';
import { fetchProducts, fetchSales } from '../services/dataService';
import { getSafeClient } from '../utils/safeAccess';

export class InventoryManager {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async loadInventoryData() {
    try {
      const [products, sales] = await Promise.all([
        fetchProducts(),
        fetchSales()
      ]);

      // Alertes de stock faible
      const lowStockProducts = products.filter(p => (p.quantity || 0) < 7);
      const stockAlertsContainer = this.container.querySelector('#stock-alerts');
      if (stockAlertsContainer) {
        stockAlertsContainer.innerHTML = `
          <div class="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl shadow-xl p-6 text-white">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                  <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">Alertes Stock</h2>
                  <p class="text-white/80">Produits à réapprovisionner</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-4xl font-bold">${lowStockProducts.length}</div>
                <div class="text-sm text-white/80">Produits</div>
              </div>
            </div>
            
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              ${lowStockProducts.length > 0 ? `
                <div class="grid gap-3 max-h-60 overflow-y-auto">
                  ${lowStockProducts.map(product => `
                    <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <h3 class="font-semibold">${product.name}</h3>
                        <p class="text-sm text-white/80">Stock actuel: ${product.quantity || 0} | Seuil: ${product.threshold || 'N/A'}</p>
                      </div>
                      <div class="text-right">
                        <span class="bg-red-500/80 text-white text-xs px-3 py-1 rounded-full font-medium">
                          Critique
                        </span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="text-center py-6">
                  <i class="fa-solid fa-check-circle text-4xl text-white/60 mb-2"></i>
                  <p class="text-lg font-semibold">Excellent !</p>
                  <p class="text-white/80">Aucune alerte stock pour le moment</p>
                </div>
              `}
            </div>
          </div>
        `;
      }

      // Valeur de l'inventaire
      const inventoryValue = products.reduce((sum, product) => sum + ((product.price || 0) * (product.quantity || 0)), 0);
      const inventoryValueContainer = this.container.querySelector('#inventory-value');
      if (inventoryValueContainer) {
        inventoryValueContainer.innerHTML = `
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <div class="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                  <i class="fa-solid fa-coins text-2xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">Valeur Inventaire</h2>
                  <p class="text-white/80">Valeur totale du stock</p>
                </div>
              </div>
            </div>
            
            <div class="text-4xl font-bold mb-4">${inventoryValue.toLocaleString()} FCFA</div>
            
            <div class="grid grid-cols-3 gap-4 mt-6">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div class="text-2xl font-bold">${products.length}</div>
                <div class="text-sm text-white/80">Produits</div>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div class="text-2xl font-bold">${products.reduce((sum, p) => sum + (p.quantity || 0), 0)}</div>
                <div class="text-sm text-white/80">Unités</div>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div class="text-2xl font-bold">${products.length > 0 ? Math.round(inventoryValue / products.length).toLocaleString() : 0}</div>
                <div class="text-sm text-white/80">Moy. FCFA</div>
              </div>
            </div>
          </div>
        `;
      }

      // Top produits avec interface améliorée
      const topProducts = await StatsService.getTopProducts();
      const topProductsContainer = this.container.querySelector('#top-products');
      if (topProductsContainer) {
        topProductsContainer.innerHTML = `
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex items-center mb-6">
              <div class="bg-green-100 rounded-full p-3 mr-4">
                <i class="fa-solid fa-crown text-green-600 text-xl"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-800">Top Produits</h2>
                <p class="text-gray-600">Les plus vendus</p>
              </div>
            </div>
            
            <div class="space-y-4">
              ${topProducts.length > 0 ? topProducts.map((item, index) => `
                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <div class="flex items-center">
                    <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4">
                      ${index + 1}
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-800">${item.product.name}</h3>
                      <p class="text-sm text-gray-600">${item.quantity} unités vendues</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-green-600">${item.revenue.toLocaleString()} FCFA</div>
                    <div class="text-sm text-gray-500">Prix: ${item.product.price} FCFA</div>
                  </div>
                </div>
              `).join('') : `
                <div class="text-center py-8">
                  <i class="fa-solid fa-chart-bar text-4xl text-gray-300 mb-4"></i>
                  <p class="text-gray-600">Aucune vente enregistrée</p>
                </div>
              `}
            </div>
          </div>
        `;
      }

      // Mouvements de stock avec interface moderne
      const stockMovementsContainer = this.container.querySelector('#stock-movements');
      if (stockMovementsContainer) {
        const recentSales = sales.slice(0, 10).reverse(); // 10 dernières ventes
        stockMovementsContainer.innerHTML = `
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex items-center mb-6">
              <div class="bg-purple-100 rounded-full p-3 mr-4">
                <i class="fa-solid fa-arrows-rotate text-purple-600 text-xl"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-800">Mouvements Récents</h2>
                <p class="text-gray-600">Dernières transactions</p>
              </div>
            </div>
            
            <div class="space-y-3 max-h-96 overflow-y-auto">
              ${recentSales.length > 0 ? recentSales.map(sale => {
                const safeClient = getSafeClient(sale);
                const totalUnits = sale.products.reduce((sum: number, p: any) => sum + (p.quantity || 0), 0);
                return `
                  <div class="flex justify-between items-center p-4 border-l-4 border-red-400 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <div class="flex items-center">
                      <div class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <i class="fa-solid fa-arrow-down text-sm"></i>
                      </div>
                      <div>
                        <div class="font-semibold text-gray-800">${safeClient.name}</div>
                        <div class="text-sm text-gray-600">
                          ${this.formatProductsForMovement(sale.products, products)}
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm text-gray-500">${new Date(sale.date).toLocaleDateString()}</div>
                      <div class="font-bold text-red-600">-${totalUnits} unités</div>
                    </div>
                  </div>
                `;
              }).join('') : `
                <div class="text-center py-8">
                  <i class="fa-solid fa-timeline text-4xl text-gray-300 mb-4"></i>
                  <p class="text-gray-600">Aucun mouvement récent</p>
                </div>
              `}
            </div>
          </div>
        `;
      }

    } catch (error) {
      console.error('Erreur lors du chargement de l\'inventaire:', error);
    }
  }

  private formatProductsForMovement(saleProducts: any[], allProducts: any[]): string {
    return saleProducts.map(p => {
      const product = allProducts.find(prod => prod._id === p.product);
      return `${product?.name || 'Produit inconnu'} (${p.quantity})`;
    }).slice(0, 2).join(', ') + (saleProducts.length > 2 ? '...' : '');
  }
}
