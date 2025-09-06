import { StatsService } from '../services/StatsService';

export class DashboardStats {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async loadStats() {
    try {
      const stats = await StatsService.getStats();
      
      // Mettre à jour les cartes de stats
      this.updateStatsCard('#total-stock', stats.totalStock.toLocaleString());
      this.updateStatsCard('#faible-stock', stats.lowStockCount.toString());
      this.updateStatsCard('#total-revenue', stats.totalRevenue.toLocaleString());
      this.updateStatsCard('#total-facture', stats.monthlyInvoices.toString());

      // Mettre à jour le pourcentage de stock
      const stockPercentageElement = this.container.querySelector('#stock-percentage');
      if (stockPercentageElement) {
        stockPercentageElement.textContent = `${stats.stockPercentage}%`;
      }

      // Charger le contenu du dashboard avec les vraies données
      await this.loadDashboardContent(stats);

    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }

  private updateStatsCard(selector: string, value: string) {
    const element = this.container.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  }

  private async loadDashboardContent(stats: any) {
    const mainContent = this.container.querySelector('#main-content');
    if (!mainContent) return;

    // Chargement des alertes stock
    const lowStockAlerts = await StatsService.getLowStockAlerts();
    const topProducts = await StatsService.getTopProducts();

    mainContent.innerHTML = `
      <section id="dashboard-section">
        <div class="container mx-auto px-4 py-6">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
              <p class="text-gray-600 mt-1">Vue d'ensemble de votre activité commerciale</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Dernière mise à jour</p>
              <p class="text-lg font-semibold text-gray-800">${new Date().toLocaleString()}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <!-- Dernières Transactions -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold mb-4 text-blue-600">
                <i class="fa-solid fa-clock-rotate-left mr-2"></i>
                Dernières Transactions
              </h3>
              <div class="space-y-3">
                ${stats.recentSales.length > 0 ? stats.recentSales.map((sale: any) => `
                  <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p class="font-medium text-sm">${sale.client.name}</p>
                      <p class="text-xs text-gray-500">${new Date(sale.date).toLocaleDateString()}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-green-600">${this.calculateSaleTotal(sale)} FCFA</p>
                      <p class="text-xs text-gray-500">${sale.products.length} produit(s)</p>
                    </div>
                  </div>
                `).join('') : '<p class="text-gray-500 text-center py-4">Aucune transaction récente</p>'}
              </div>
            </div>

            <!-- Analyse des Ventes -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold mb-4 text-purple-600">
                <i class="fa-solid fa-chart-line mr-2"></i>
                Analyse des Ventes
              </h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">CA Total:</span>
                  <span class="font-bold text-purple-600">${stats.totalRevenue.toLocaleString()} FCFA</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Ventes ce mois:</span>
                  <span class="font-bold text-blue-600">${stats.monthlyInvoices}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Produits vendus:</span>
                  <span class="font-bold text-green-600">${stats.recentSales.reduce((sum: number, sale: any) => sum + sale.products.reduce((s: number, p: any) => s + (p.quantity || 0), 0), 0)}</span>
                </div>
                <div class="mt-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Top Produits:</h4>
                  <div class="space-y-1">
                    ${topProducts.slice(0, 3).map((item: any) => `
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">${item.product.name}</span>
                        <span class="font-medium">${item.quantity} vendus</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Alertes Stock -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold mb-4 text-orange-600">
                <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                Alertes Stock (${lowStockAlerts.length})
              </h3>
              <div class="space-y-3">
                ${lowStockAlerts.length > 0 ? lowStockAlerts.slice(0, 5).map(product => `
                  <div class="flex justify-between items-center p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                    <div>
                      <p class="font-medium text-sm text-gray-900">${product.name}</p>
                      <p class="text-xs text-orange-600">Stock: ${product.quantity || 0}</p>
                    </div>
                    <span class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                      Réapprovisionner
                    </span>
                  </div>
                `).join('') : '<p class="text-gray-500 text-center py-4">Aucune alerte stock</p>'}
                ${lowStockAlerts.length > 5 ? `
                  <div class="text-center pt-2">
                    <span class="text-sm text-gray-500">+${lowStockAlerts.length - 5} autres produits</span>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private calculateSaleTotal(sale: any): number {
    return sale.products.reduce((sum: number, product: any) => {
      return sum + ((product.unitPrice || 0) * (product.quantity || 0));
    }, 0);
  }
}
