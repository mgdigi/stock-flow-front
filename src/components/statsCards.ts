export function createStatsCards(): string {
  return `
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 card-hover">
      <div class="flex items-start justify-between">
        <div>
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <i class="fa-solid fa-cart-shopping text-2xl"></i>
          </div>
          <h3 id="total-stock" class="text-4xl font-bold text-gray-900 mb-2">2,847</h3>
          <p class="text-gray-600 font-medium">Produits en Stock</p>
          <div class="flex items-center mt-3">
            <span class="text-green-600 text-sm font-semibold">+12.5%</span>
            <span class="text-gray-500 text-sm ml-2">vs mois dernier</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 card-hover">
      <div class="flex items-start justify-between">
        <div>
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
          </div>
          <h3 id="faible-stock" class="text-2xl font-bold text-gray-900 mb-2">23</h3>
          <p class="text-gray-600 font-medium">Stock Faible</p>
          <div class="flex items-center mt-3">
            <span class="text-orange-600 text-sm font-semibold pulse">Attention</span>
            <span class="text-gray-500 text-sm ml-2">Approvisionnez</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 card-hover">
      <div class="flex items-start justify-between">
        <div>
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <i class="fa-solid fa-cash-register text-2xl"></i>
          </div>
          <h3 id="total-revenue" class="text-4xl font-bold text-gray-900 mb-2">1,247,500</h3>
          <p class="text-gray-600 font-medium">Chiffre d'Affaires (FCFA)</p>
          <div class="flex items-center mt-3">
            <span class="text-blue-600 text-sm font-semibold">+8.2%</span>
            <span class="text-gray-500 text-sm ml-2">cette semaine</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 card-hover">
      <div class="flex items-start justify-between">
        <div>
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <i class="fa-solid fa-file-invoice text-2xl"></i>
          </div>
          <h3 id="total-facture" class="text-4xl font-bold text-gray-900 mb-2">189</h3>
          <p class="text-gray-600 font-medium">Factures ce Mois</p>
          <div class="flex items-center mt-3">
            <span class="text-purple-600 text-sm font-semibold">+15.3%</span>
            <span class="text-gray-500 text-sm ml-2">vs mois dernier</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 card-hover">
      <div class="flex items-center justify-center flex-col h-full">
        <h3 class="text-2xl font-bold text-gray-800">État du Stock</h3>
        <div class="flex flex-col items-center mt-8">
          <div class="progress-ring mb-4">
            <div class="progress-text" id="stock-percentage"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}
