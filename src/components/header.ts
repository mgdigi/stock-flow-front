export function createHeader(): string {
  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;
  return `
    <div class="flex items-center justify-between px-8 py-6">
      <div class="flex items-center space-x-6">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent" id="page-title">Tableau de Bord</h1>
        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">En ligne</span>
      </div>
      <div class="flex items-center space-x-6">
        <div class="relative">
          <input type="search" placeholder="Rechercher produit, facture..." class="pl-12 pr-6 py-3 w-96 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-400">
          <svg class="w-6 h-6 text-gray-400 absolute left-4 top-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
        </div>
        
        <div class="flex items-center space-x-4">
        
          
          <div class="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div class="text-right">
              <p id="nom-user" class="text-sm font-semibold text-gray-800">${user.prenom.toUpperCase()} ${user.nom.toUpperCase()}</p>
              <p class="text-xs text-gray-500">Gérant Principal</p>
            </div>
            <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span id="initial-user" class="text-white font-bold text-lg">${user.prenom.charAt(0).toUpperCase()}${user.nom.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          
          <button id="btn-add-sale" class="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
            </svg>
            <span>Nouvelle Vente</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
