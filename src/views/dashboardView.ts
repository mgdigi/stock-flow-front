import { fetchProducts } from "../services/productService";
import { fetchSales } from "../services/venteService";

const linkDashboard = document.getElementById('link-dashboard') as HTMLAnchorElement;

export async function showDashboard() {
  const lastUpdate = document.getElementById('last-update') as HTMLElement;
          
  lastUpdate.textContent = `${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}`
  const products = await fetchProducts();   
  const sales = await fetchSales();

  updateStatsCards(products, sales);
  
  renderDashboardContent(products, sales);
  
  calculateStockState();

}

function updateStatsCards(products: any[], sales: any[]) {
  const stock = document.getElementById('total-stock') as HTMLElement;
  const faibleStock = document.getElementById('faible-stock') as HTMLElement;
  const totalSales = document.getElementById('total-facture') as HTMLElement;

  const totalStock = products.reduce((sum, product) => sum + (product.quantity || 0), 0);
  stock.textContent = `${totalStock}`;

  const leastStockProduct = products.reduce((min, p) => p.quantity < min.quantity ? p : min, products[0]);
  faibleStock.textContent = leastStockProduct ? `${leastStockProduct.name} (${leastStockProduct.quantity})` : 'Aucun produit en stock';

  const totalAmount = sales.length;
  totalSales.textContent = `${totalAmount}`;

  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  document.getElementById('total-revenue')!.textContent = `${totalRevenue.toLocaleString('fr-FR')}`;
}

// function renderDashboardContent(products: any[], sales: any[]) {
//   const dashboardContent = document.getElementById('dashboard-content');
//   if (!dashboardContent) return;

//   const today = new Date();
//   const todayStr = today.toISOString().split('T')[0];
  
//   const todaySales = sales.filter(sale => {
//     const saleDate = new Date(sale.date).toISOString().split('T')[0];
//     return saleDate === todayStr;
//   });

//   const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

//   const weekAgo = new Date();
//   weekAgo.setDate(weekAgo.getDate() - 7);
//   const weekSales = sales.filter(sale => new Date(sale.date) >= weekAgo);

//   const productSales = getProductSalesStats(products, sales);

//   dashboardContent.innerHTML = `
//     <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      
//       <!-- Ventes du jour -->
//       <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
//         <div class="flex items-center justify-between">
//           <div>
//             <h3 class="text-lg font-semibold text-gray-800 mb-2">📈 Ventes du Jour</h3>
//             <p class="text-3xl font-bold text-green-600">${todaySales.length}</p>
//             <p class="text-sm text-gray-600">vente(s) aujourd'hui</p>
//           </div>
//           <div class="text-right">
//             <p class="text-xl font-bold text-green-600">${todayRevenue.toLocaleString('fr-FR')} FCFA</p>
//             <p class="text-sm text-gray-600">revenus du jour</p>
//           </div>
//         </div>
        
//         ${todaySales.length > 0 ? `
//           <div class="mt-4 pt-4 border-t border-gray-200">
//             <h4 class="text-sm font-medium text-gray-700 mb-2">Dernières ventes :</h4>
//             <div class="space-y-2 max-h-32 overflow-y-auto">
//               ${todaySales.slice(0, 3).map(sale => `
//                 <div class="flex justify-between text-sm">
//                   <span class="text-gray-600">${sale.client.name}</span>
//                   <span class="font-medium text-green-600">${sale.totalAmount.toLocaleString('fr-FR')} FCFA</span>
//                 </div>
//               `).join('')}
//             </div>
//           </div>
//         ` : `
//           <div class="mt-4 pt-4 border-t border-gray-200 text-center">
//             <p class="text-gray-500 text-sm">Aucune vente aujourd'hui</p>
//           </div>
//         `}
//       </div>

//       <!-- Activité de la semaine -->
//       <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
//         <h3 class="text-lg font-semibold text-gray-800 mb-4">📊 Cette Semaine</h3>
//         <div class="space-y-3">
//           <div class="flex justify-between">
//             <span class="text-gray-600">Ventes totales</span>
//             <span class="font-bold text-blue-600">${weekSales.length}</span>
//           </div>
//           <div class="flex justify-between">
//             <span class="text-gray-600">Revenus</span>
//             <span class="font-bold text-blue-600">${weekSales.reduce((sum, sale) => sum + sale.totalAmount, 0).toLocaleString('fr-FR')} FCFA</span>
//           </div>
//           <div class="flex justify-between">
//             <span class="text-gray-600">Moyenne/jour</span>
//             <span class="font-bold text-blue-600">${Math.round(weekSales.length / 7)}</span>
//           </div>
//         </div>
        
//         <!-- Mini graphique des ventes par jour -->
//         <div class="mt-4 pt-4 border-t border-gray-200">
//           <h4 class="text-sm font-medium text-gray-700 mb-2">Ventes par jour :</h4>
//           ${renderWeeklyChart(sales)}
//         </div>
//       </div>

//       <!-- Produits populaires -->
//       <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
//         <h3 class="text-lg font-semibold text-gray-800 mb-4">🏆 Top Produits</h3>
//         <div class="space-y-3">
//           ${productSales.slice(0, 5).map((item, index) => `
//             <div class="flex items-center justify-between">
//               <div class="flex items-center">
//                 <span class="w-6 h-6 bg-purple-100 text-purple-600 text-xs rounded-full flex items-center justify-center mr-2">
//                   ${index + 1}
//                 </span>
//                 <span class="text-gray-700 text-sm">${item.name}</span>
//               </div>
//               <span class="font-bold text-purple-600">${item.totalSold}</span>
//             </div>
//           `).join('')}
//         </div>
//       </div>

//       <!-- Alertes importantes -->
//       <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
//         <h3 class="text-lg font-semibold text-gray-800 mb-4">⚠️ Alertes</h3>
//         ${renderAlerts(products)}
//       </div>

//       <!-- Résumé financier -->
//       <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
//         <h3 class="text-lg font-semibold text-gray-800 mb-4">💰 Résumé Financier</h3>
//         ${renderFinancialSummary(sales, products)}
//       </div>

//       <!-- Activité récente -->
//       <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
//         <h3 class="text-lg font-semibold text-gray-800 mb-4">🕒 Activité Récente</h3>
//         ${renderRecentActivity(sales)}
//       </div>

//     </div>
//   `;
// }




// function renderDashboardContent(products: any[], sales: any[]) {
//   const dashboardContent = document.getElementById('dashboard-content');
//   if (!dashboardContent) {
//     console.error('❌ Élément dashboard-content non trouvé !');
//     return;
//   }

//   console.log('🎨 Rendu du contenu dashboard...');

//   const today = new Date();
//   const todayStr = today.toISOString().split('T')[0];
  
//   // Ventes du jour
//   const todaySales = sales.filter(sale => {
//     const saleDate = new Date(sale.date).toISOString().split('T')[0];
//     return saleDate === todayStr;
//   });

//   // Revenus du jour
//   const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

//   // Ventes de la semaine
//   const weekAgo = new Date();
//   weekAgo.setDate(weekAgo.getDate() - 7);
//   const weekSales = sales.filter(sale => new Date(sale.date) >= weekAgo);

//   // Produits en stock faible (seuil d'alerte = 5)
//   const lowStockProducts = products.filter(p => p.quantity <= 5);

//   dashboardContent.innerHTML = `
//     <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      
//       <!-- Ventes du jour -->
//       <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 card-hover border-l-4 border-green-500">
//         <div class="flex items-center justify-between">
//           <div>
//             <h3 class="text-lg font-semibold text-gray-800 mb-2">📈 Ventes du Jour</h3>
//             <p class="text-3xl font-bold text-green-600">${todaySales.length}</p>
//             <p class="text-sm text-gray-600">vente(s) aujourd'hui</p>
//           </div>
//           <div class="text-right">
//             <p class="text-xl font-bold text-green-600">${todayRevenue.toLocaleString('fr-FR')} FCFA</p>
//             <p class="text-sm text-gray-600">revenus du jour</p>
//           </div>
//         </div>
//       </div>

//       <!-- Activité de la semaine -->
//       <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 card-hover border-l-4 border-blue-500">
//         <h3 class="text-lg font-semibold text-gray-800 mb-4">📊 Cette Semaine</h3>
//         <div class="space-y-3">
//           <div class="flex justify-between">
//             <span class="text-gray-600">Ventes totales</span>
//             <span class="font-bold text-blue-600">${weekSales.length}</span>
//           </div>
//           <div class="flex justify-between">
//             <span class="text-gray-600">Revenus</span>
//             <span class="font-bold text-blue-600">${weekSales.reduce((sum, sale) => sum + sale.totalAmount, 0).toLocaleString('fr-FR')} FCFA</span>
//           </div>
//           <div class="flex justify-between">
//             <span class="text-gray-600">Moyenne/jour</span>
//             <span class="font-bold text-blue-600">${Math.round(weekSales.length / 7)}</span>
//           </div>
//         </div>
//       </div>

//       <!-- ALERTES STOCK CLIQUABLES -->
//       <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 card-hover border-l-4 border-red-500">
//         <h3 class="text-lg font-semibold text-gray-800 mb-4">⚠️ Alertes Stock</h3>
//         ${lowStockProducts.length > 0 ? `
//           <div class="space-y-2">
//             <p class="text-red-600 font-medium mb-3">${lowStockProducts.length} produit(s) en alerte :</p>
//             <div class="max-h-48 overflow-y-auto space-y-2">
//               ${lowStockProducts.map(product => `
//                 <div class="restock-item flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors border border-red-200 hover:border-red-300"
//                      data-product-id="${product._id}"
//                      data-product-name="${product.name}"
//                      data-current-stock="${product.quantity}"
//                      data-product-price="${product.price || 0}">
//                   <div class="flex-1">
//                     <p class="font-medium text-gray-800">${product.name}</p>
//                     <p class="text-sm text-red-600">Stock: ${product.quantity} (Seuil: 5)</p>
//                   </div>
//                   <div class="flex items-center space-x-2">
//                     <span class="text-red-500 font-bold">${product.quantity}</span>
//                     <div class="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm transition-colors">
//                       +
//                     </div>
//                   </div>
//                 </div>
//               `).join('')}
//             </div>
//             <div class="mt-3 pt-3 border-t border-red-200">
//               <p class="text-xs text-gray-500 text-center">
//                 💡 Cliquez sur un produit pour le réapprovisionner
//               </p>
//             </div>
//           </div>
//         ` : `
//           <div class="text-center py-6">
//             <span class="text-green-500 text-4xl">✅</span>
//             <p class="text-green-600 font-medium mt-2">Tous les stocks sont OK</p>
//             <p class="text-gray-500 text-sm">Aucune alerte de stock faible</p>
//           </div>
//         `}
//       </div>

//       <!-- Résumé financier -->
//       <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 card-hover border-l-4 border-yellow-500">
//         <h3 class="text-lg font-semibold text-gray-800 mb-4">💰 Résumé Financier</h3>
//         <div class="space-y-3">
//           <div class="flex justify-between">
//             <span class="text-gray-600">Revenus totaux</span>
//             <span class="font-bold text-green-600">${sales.reduce((sum, sale) => sum + sale.totalAmount, 0).toLocaleString('fr-FR')} FCFA</span>
//           </div>
//           <div class="flex justify-between">
//             <span class="text-gray-600">Vente moyenne</span>
//             <span class="font-bold text-blue-600">${sales.length > 0 ? Math.round(sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length).toLocaleString('fr-FR') : '0'} FCFA</span>
//           </div>
//           <div class="flex justify-between">
//             <span class="text-gray-600">Valeur stock</span>
//             <span class="font-bold text-purple-600">${products.reduce((sum, product) => sum + (product.quantity * (product.price || 0)), 0).toLocaleString('fr-FR')} FCFA</span>
//           </div>
//         </div>
//       </div>

//     </div>
//   `;

//   // Configurer les événements de clic pour le réapprovisionnement
//   setupRestockClickEvents();
//   console.log('✅ Contenu dashboard rendu avec réapprovisionnement');
// }


function renderDashboardContent(products: any[], sales: any[]) {
  const dashboardContent = document.getElementById('dashboard-content');
  if (!dashboardContent) {
    console.error('❌ Élément dashboard-content non trouvé !');
    return;
  }

  console.log('🎨 Rendu du contenu dashboard...');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.date).toISOString().split('T')[0];
    return saleDate === todayStr;
  });

  const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekSales = sales.filter(sale => new Date(sale.date) >= weekAgo);

  const productSales = getProductSalesStats(products, sales);

  dashboardContent.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      
      <!-- Ventes du jour -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">📈 Ventes du Jour</h3>
            <p class="text-3xl font-bold text-green-600">${todaySales.length}</p>
            <p class="text-sm text-gray-600">vente(s) aujourd'hui</p>
          </div>
          <div class="text-right">
            <p class="text-xl font-bold text-green-600">${todayRevenue.toLocaleString('fr-FR')} FCFA</p>
            <p class="text-sm text-gray-600">revenus du jour</p>
          </div>
        </div>
        
        ${todaySales.length > 0 ? `
          <div class="mt-4 pt-4 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Dernières ventes :</h4>
            <div class="space-y-2 max-h-32 overflow-y-auto">
              ${todaySales.slice(0, 3).map(sale => `
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">${sale.client.name}</span>
                  <span class="font-medium text-green-600">${sale.totalAmount.toLocaleString('fr-FR')} FCFA</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="mt-4 pt-4 border-t border-gray-200 text-center">
            <p class="text-gray-500 text-sm">Aucune vente aujourd'hui</p>
          </div>
        `}
      </div>

      <!-- Activité de la semaine -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">📊 Cette Semaine</h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Ventes totales</span>
            <span class="font-bold text-blue-600">${weekSales.length}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Revenus</span>
            <span class="font-bold text-blue-600">${weekSales.reduce((sum, sale) => sum + sale.totalAmount, 0).toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Moyenne/jour</span>
            <span class="font-bold text-blue-600">${Math.round(weekSales.length / 7)}</span>
          </div>
        </div>
        
        <!-- Mini graphique des ventes par jour -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Ventes par jour :</h4>
          ${renderWeeklyChart(sales)}
        </div>
      </div>

      <!-- Produits populaires -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">🏆 Top Produits</h3>
        <div class="space-y-3">
          ${productSales.slice(0, 5).map((item, index) => `
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="w-6 h-6 bg-purple-100 text-purple-600 text-xs rounded-full flex items-center justify-center mr-2">${index + 1}</span>
                <span class="text-gray-700 text-sm">${item.name}</span>
              </div>
              <span class="font-bold text-purple-600">${item.totalSold}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Alertes importantes AVEC RÉAPPROVISIONNEMENT -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">⚠️ Alertes</h3>
        ${renderAlertsWithRestock(products)}
      </div>

      <!-- Résumé financier -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">💰 Résumé Financier</h3>
        ${renderFinancialSummary(sales, products)}
      </div>

      <!-- Activité récente -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">🕒 Activité Récente</h3>
        ${renderRecentActivity(sales)}
      </div>

    </div>
  `;

  // Configurer les événements de clic pour le réapprovisionnement
  setupRestockClickEvents();
  console.log('✅ Contenu dashboard rendu avec réapprovisionnement');
}

function renderAlertsWithRestock(products: any[]): string {
  const lowStockProducts = products.filter(p => p.quantity <= p.threshold);
  const outOfStockProducts = products.filter(p => p.quantity === 0);
  
  if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
    return `
      <div class="text-center py-6">
        <span class="text-green-500 text-4xl">✅</span>
        <p class="text-green-600 font-medium mt-2">Tous les stocks sont OK</p>
        <p class="text-gray-500 text-sm">Aucune alerte de stock</p>
      </div>
    `;
  }

  let alertsHtml = '';

  if (outOfStockProducts.length > 0) {
    alertsHtml += `
      <div class="mb-4">
        <p class="text-red-700 font-bold mb-2">🚨 Rupture de stock (${outOfStockProducts.length})</p>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          ${outOfStockProducts.slice(0, 3).map(product => `
            <div class="restock-item flex items-center justify-between p-2 bg-red-100 hover:bg-red-200 rounded-lg cursor-pointer transition-colors border border-red-300"
                 data-product-id="${product._id}"
                 data-product-name="${product.name}"
                 data-current-stock="${product.quantity}"
                 data-product-price="${product.price || 0}"
                 data-product-threshold="${product.threshold}">
              <span class="text-red-800 text-sm font-medium">${product.name}</span>
              <div class="flex items-center space-x-2">
                <span class="text-red-700 font-bold text-sm">0</span>
                <div class="w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white text-xs transition-colors">
                  +
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        ${outOfStockProducts.length > 3 ? `
          <p class="text-xs text-gray-600 mt-2">Et ${outOfStockProducts.length - 3} autre(s)...</p>
        ` : ''}
      </div>
    `;
  }

  // Produits en stock faible
  const lowStockOnly = lowStockProducts.filter(p => p.quantity > 0);
  if (lowStockOnly.length > 0) {
    alertsHtml += `
      <div class="mb-4">
        <p class="text-orange-600 font-medium mb-2">⚠️ Stock faible (${lowStockOnly.length})</p>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          ${lowStockOnly.slice(0, 3).map(product => `
            <div class="restock-item flex items-center justify-between p-2 bg-orange-50 hover:bg-orange-100 rounded-lg cursor-pointer transition-colors border border-orange-200"
                 data-product-id="${product._id}"
                 data-product-name="${product.name}"
                 data-current-stock="${product.quantity}"
                 data-product-price="${product.price || 0}"
                 data-product-threshold="${product.threshold}">
              <span class="text-orange-800 text-sm">${product.name}</span>
              <div class="flex items-center space-x-2">
                <span class="text-orange-600 font-bold text-sm">${product.quantity}</span>
                <div class="w-6 h-6 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white text-xs transition-colors">
                  +
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        ${lowStockOnly.length > 3 ? `
          <p class="text-xs text-gray-600 mt-2">Et ${lowStockOnly.length - 3} autre(s)...</p>
        ` : ''}
      </div>
    `;
  }

  alertsHtml += `
    <div class="mt-3 pt-3 border-t border-gray-200">
      <p class="text-xs text-gray-500 text-center">
        💡 Cliquez sur un produit pour le réapprovisionner
      </p>
    </div>
  `;

  return alertsHtml;
}

function setupRestockClickEvents() {
  const restockItems = document.querySelectorAll('.restock-item');
  
  restockItems.forEach(item => {
    item.addEventListener('click', () => {
      const productId = item.getAttribute('data-product-id');
      const productName = item.getAttribute('data-product-name');
      const currentStock = parseInt(item.getAttribute('data-current-stock') || '0');
      const productPrice = parseFloat(item.getAttribute('data-product-price') || '0');
      const productThreshold = parseInt(item.getAttribute('data-product-threshold') || '0');
      
      if (productId && productName) {
        showQuickRestockModal(productId, productName, currentStock, productPrice, productThreshold);
      }
    });
  });
}

function showQuickRestockModal(productId: string, productName: string, currentStock: number, productPrice: number, rest: number) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
      <div class="text-center mb-6">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-red-600 text-3xl">📦</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-800">Réapprovisionner</h3>
        <p class="text-lg text-gray-700 mt-2 font-medium">${productName}</p>
        <div class="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <p class="text-red-600 font-medium">⚠️ Stock critique: ${currentStock}</p>
          <p class="text-sm text-gray-600">Seuil d'alerte: ${rest}</p>
        </div>
      </div>
      
      <form id="quick-restock-form" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Quantité à ajouter
          </label>
          <div class="flex items-center space-x-3">
            <button type="button" class="qty-btn w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold" data-action="decrease">-</button>
            <input 
              type="number" 
              id="add-quantity" 
              min="1" 
              value="10"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-bold"
              required
            >
            <button type="button" class="qty-btn w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold" data-action="increase">+</button>
          </div>
          
          <!-- Boutons de quantité rapide -->
          <div class="flex space-x-2 mt-3">
            <button type="button" class="quick-qty-btn flex-1 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium" data-qty="5">+5</button>
            <button type="button" class="quick-qty-btn flex-1 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium" data-qty="10">+10</button>
            <button type="button" class="quick-qty-btn flex-1 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium" data-qty="20">+20</button>
            <button type="button" class="quick-qty-btn flex-1 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium" data-qty="50">+50</button>
          </div>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600">Stock actuel:</span>
            <span class="font-bold text-red-600">${currentStock}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600">Quantité ajoutée:</span>
            <span id="display-add-qty" class="font-bold text-blue-600">+10</span>
          </div>
          <div class="flex justify-between items-center text-lg border-t pt-2">
            <span class="font-medium text-gray-800">Nouveau stock:</span>
            <span id="display-new-total" class="font-bold text-green-600">${currentStock + 10}</span>
          </div>
        </div>
        
        <div class="flex space-x-3 pt-4">
          <button 
            type="button" 
            id="cancel-quick-restock"
            class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </button>
          <button 
            type="submit"
            class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ✅ Confirmer
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Éléments du modal
  const quantityInput = modal.querySelector('#add-quantity') as HTMLInputElement;
  const displayAddQty = modal.querySelector('#display-add-qty') as HTMLSpanElement;
  const displayNewTotal = modal.querySelector('#display-new-total') as HTMLSpanElement;
  const form = modal.querySelector('#quick-restock-form') as HTMLFormElement;
  const cancelBtn = modal.querySelector('#cancel-quick-restock') as HTMLButtonElement;
  const qtyBtns = modal.querySelectorAll('.qty-btn') as NodeListOf<HTMLButtonElement>;
  const quickQtyBtns = modal.querySelectorAll('.quick-qty-btn') as NodeListOf<HTMLButtonElement>;

  // Fonction pour mettre à jour l'affichage
  const updateDisplay = () => {
    const addQty = parseInt(quantityInput.value) || 0;
    displayAddQty.textContent = `+${addQty}`;
    displayNewTotal.textContent = (currentStock + addQty).toString();
  };

  // Événements pour les boutons +/-
  qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      let currentValue = parseInt(quantityInput.value) || 0;
      
      if (action === 'increase') {
        currentValue += 1;
      } else if (action === 'decrease' && currentValue > 1) {
        currentValue -= 1;
      }
      
      quantityInput.value = currentValue.toString();
      updateDisplay();
    });
  });

  // Événements pour les boutons de quantité rapide
  quickQtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const qty = parseInt(btn.getAttribute('data-qty') || '0');
      quantityInput.value = qty.toString();
      updateDisplay();
    });
  });

  // Événement pour l'input manuel
  quantityInput.addEventListener('input', updateDisplay);

  // Fermer le modal
  const closeModal = () => {
    document.body.removeChild(modal);
  };

  // Événement pour fermer
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Événement pour soumettre le formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const addQuantity = parseInt(quantityInput.value);
    
    if (addQuantity > 0) {
      await performQuickRestock(productId, productName, currentStock, addQuantity, closeModal);
    } else {
      alert('⚠️ Veuillez entrer une quantité valide');
    }
  });

  // Focus sur l'input
  quantityInput.focus();
  quantityInput.select();
}

async function performQuickRestock(productId: string, productName: string, currentStock: number, addQuantity: number, closeModal: () => void) {
  try {
    console.log(`📦 Réapprovisionnement rapide: ${productName} +${addQuantity}`);
    
    // Afficher un loader dans le modal
    const modal = document.querySelector('.fixed.inset-0') as HTMLElement;
    const submitBtn = modal.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Traitement...
      </div>
    `;
    submitBtn.disabled = true;

    // Récupérer le produit actuel
    const products = await fetchProducts();
    const product = products.find(p => p._id === productId);
    
    if (!product) {
      throw new Error('Produit non trouvé');
    }

    const newQuantity = currentStock + addQuantity;
    
    // Appel API pour mettre à jour le stock
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...product,
        quantity: newQuantity
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    // Succès
    closeModal();
    
    // Notification de succès
    showSuccessNotification(`✅ ${productName} réapprovisionné avec succès!`, `Stock: ${currentStock} → ${newQuantity} (+${addQuantity})`);
    
    // Recharger le dashboard
    await showDashboard();
    
  } catch (error) {
    console.error('Erreur lors du réapprovisionnement:', error);
    
    // Restaurer le bouton
    const modal = document.querySelector('.fixed.inset-0') as HTMLElement;
    const submitBtn = modal.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitBtn.innerHTML = '✅ Confirmer';
    submitBtn.disabled = false;
    
    // Afficher l'erreur
    alert(`❌ Erreur lors du réapprovisionnement: ${error}`);
  }
}

// Fonction pour afficher une notification de succès
function showSuccessNotification(title: string, message: string) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
  notification.innerHTML = `
    <div class="flex items-center">
      <span class="text-2xl mr-3">✅</span>
      <div>
        <p class="font-bold">${title}</p>
        <p class="text-sm opacity-90">${message}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animation d'entrée
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Suppression automatique après 4 secondes
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);
}
// Fonction pour configurer les actions rapides
function setupQuickActions() {
  console.log('⚡ Configuration des actions rapides...');

  // Configurer les événements de réapprovisionnement
  setupRestockClickEvents();

  // ... autres actions rapides
  console.log('✅ Actions rapides configurées');
}



function renderRecentActivity(sales: any[]) {
  const recentSales = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (recentSales.length === 0) {
    return `
      <div class="text-center py-6">
        <span class="text-gray-400 text-3xl">📋</span>
        <p class="text-gray-500 mt-2">Aucune activité récente</p>
        <p class="text-gray-400 text-sm">Les ventes apparaîtront ici</p>
      </div>
    `;
  }

  return `
    <div class="space-y-3">
      ${recentSales.map(sale => {
        const saleDate = new Date(sale.date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - saleDate.getTime());
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        
        let timeAgo = '';
        if (diffHours < 1) {
          timeAgo = 'À l\'instant';
        } else if (diffHours < 24) {
          timeAgo = `Il y a ${diffHours}h`;
        } else {
          const diffDays = Math.ceil(diffHours / 24);
          timeAgo = `Il y a ${diffDays} jour(s)`;
        }

        return `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3">
                💰
              </div>
              <div>
                <p class="font-medium text-gray-800 text-sm">${sale.client.name}</p>
                <p class="text-gray-500 text-xs">${timeAgo}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-indigo-600">${sale.totalAmount.toLocaleString('fr-FR')} FCFA</p>
              <p class="text-gray-500 text-xs">${sale.products.length} produit(s)</p>
            </div>
          </div>
        `;
      }).join('')}
      
      ${sales.length > 5 ? `
        <div class="text-center pt-2">
          <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            Voir toutes les ventes →
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function getProductSalesStats(products: any[], sales: any[]) {
  const soldQuantities: Record<string, number> = {};

  sales.forEach(sale => {
    sale.products.forEach((item: any) => {
      let productId: string;
      
      if (typeof item.product._id === 'string') {
        productId = item.product._id;
      } else {
        return;
      }

      soldQuantities[productId] = (soldQuantities[productId] || 0) + item.quantity;
    });
  });

  return products
    .map(product => ({
      ...product,
      totalSold: soldQuantities[product._id] || 0
    }))
    .sort((a, b) => b.totalSold - a.totalSold);
}

function renderWeeklyChart(sales: any[]) {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const today = new Date();
  const weekData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const daySales = sales.filter(sale => {
      const saleDate = new Date(sale.date).toISOString().split('T')[0];
      return saleDate === dateStr;
    });

    weekData.push({
      day: days[date.getDay()],
      sales: daySales.length,
      isToday: i === 0
    });
  }

  const maxSales = Math.max(...weekData.map(d => d.sales), 1);

  return `
    <div class="flex items-end justify-between h-16 space-x-1">
      ${weekData.map(day => `
        <div class="flex flex-col items-center flex-1">
          <div class="w-full bg-blue-200 rounded-t ${day.isToday ? 'bg-blue-400' : ''}" 
               style="height: ${(day.sales / maxSales) * 40 + 8}px">
          </div>
          <span class="text-xs text-gray-500 mt-1">${day.day}</span>
          <span class="text-xs font-bold text-blue-600">${day.sales}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAlerts(products: any[]) {
  const lowStockProducts = products.filter(p => p.quantity <= (p.threshold || 5));
  const outOfStockProducts = products.filter(p => p.quantity === 0);

  if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
    return `
      <div class="text-center py-4">
        <span class="text-green-600 text-2xl">✅</span>
        <p class="text-green-600 font-medium mt-2">Tout va bien !</p>
        <p class="text-gray-500 text-sm">Aucune alerte en cours</p>
      </div>
    `;
  }

  return `
    <div class="space-y-3">
      ${outOfStockProducts.length > 0 ? `
        <div class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-800 font-medium text-sm">🚫 ${outOfStockProducts.length} produit(s) en rupture</p>
          <div class="mt-1 space-y-1">
            ${outOfStockProducts.slice(0, 2).map(p => `
              <p class="text-red-600 text-xs">• ${p.name}</p>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${lowStockProducts.length > 0 ? `
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p class="text-yellow-800 font-medium text-sm">⚠️ ${lowStockProducts.length} produit(s) en stock faible</p>
          <div class="mt-1 space-y-1">
            ${lowStockProducts.slice(0, 2).map(p => `
              <p class="text-yellow-600 text-xs">• ${p.name} (${p.quantity})</p>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderFinancialSummary(sales: any[], products: any[]) {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const inventoryValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  const averageSale = sales.length > 0 ? totalRevenue / sales.length : 0;

  const thisMonth = new Date();
  thisMonth.setDate(1);
  const monthSales = sales.filter(sale => new Date(sale.date) >= thisMonth);
  const monthRevenue = monthSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  return `
    <div class="space-y-3">
      <div class="flex justify-between">
        <span class="text-gray-600">Revenus totaux</span>
        <span class="font-bold text-green-600">${totalRevenue.toLocaleString('fr-FR')} FCFA</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Ce mois</span>
        <span class="font-bold text-blue-600">${monthRevenue.toLocaleString('fr-FR')} FCFA</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Valeur stock</span>
        <span class="font-bold text-purple-600">${inventoryValue.toLocaleString('fr-FR')} FCFA</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Vente moyenne</span>
        <span class="font-bold text-orange-600">${averageSale.toLocaleString('fr-FR')} FCFA</span>
      </div>
      <div class="mt-4 pt-3 border-t border-gray-200">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Nombre de ventes</span>
          <span class="font-medium text-gray-700">${sales.length}</span>
        </div>
        <div class="flex justify-between text-sm mt-1">
          <span class="text-gray-500">Produits en stock</span>
          <span class="font-medium text-gray-700">${products.reduce((sum, p) => sum + p.quantity, 0)}</span>
        </div>
      </div>
    </div>
  `;
}

async function calculateStockState() {
  try {
    const products = await fetchProducts();
    const sales = await fetchSales();

    const soldQuantities: Record<string, number> = {};

    for (const sale of sales) {
      for (const item of sale.products) {
        if (!item || !item.product || !item.product._id) {
          console.warn("Produit invalide dans une vente :", item);
          continue;
        }

        let productId: string;

        if (typeof item.product._id === 'string') {
          productId = item.product._id;
        } else {
          console.warn("Product ID introuvable dans l'item :", item);
          continue;
        }

        soldQuantities[productId] = (soldQuantities[productId] || 0) + item.quantity;
      }
    }

    let totalInitialStock = 0;
    let totalCurrentStock = 0;

    for (const product of products) {
      const currentQuantity = product.quantity || 0;
      const soldQuantity = soldQuantities[product._id] || 0;

      const initialQuantity = currentQuantity + soldQuantity;

      totalInitialStock += initialQuantity;
      totalCurrentStock += currentQuantity;
    }

    const stockPercentage =
      totalInitialStock > 0
        ? (totalCurrentStock / totalInitialStock) * 100
        : 0;

    const progressText = document.querySelector('.progress-text');
    if (progressText) {
      progressText.textContent = `${stockPercentage.toFixed(1)}%`;
    } else {
      console.warn('Élément .progress-text non trouvé !');
    }


  } catch (error) {
    console.error('Erreur lors du calcul de l\'état du stock :', error);
  }
}



export {linkDashboard};