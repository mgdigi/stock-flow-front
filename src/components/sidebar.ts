export function createSidebar(): string {
  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;
  return `
    <div class="p-8">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg text-2xl text-white font-bold">
        <!-- LOGO -->
        <img src="${user.logo}" alt="Logo" class="w-10 h-10 object-cover rounded-xl"/> <!-- IGNORE -->
          
        </div>
        <div>
          <span class="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">${user.entreprise}</span>
          <p class="text-sm text-gray-500 font-medium">Gestion Stocke </p>
        </div>
      </div>
    </div>
    
    <nav class="w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 slide-in h-full flex flex-col justify-center">
      <a href="#" id="link-dashboard" class="flex items-center px-4 py-4 text-blue-600 sidebar-active rounded-xl mb-2 font-medium">
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
          <i class="fa-solid fa-chart-pie text-xl"></i>
        </div>
        Vue d'ensemble
      </a>
      
      <a href="#" id="link-inventaire" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50/50 rounded-xl mb-2 font-medium transition-all" data-section="inventaire">
        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
          <i class="fa-solid fa-scale-balanced text-blue-600 text-xl"></i>
        </div>
        <div class="flex-1">
          <span>Inventaire</span>
          <div class="notification-dot inline-block ml-2"></div>
        </div>
      </a>
      
      <a href="#" id="link-produits" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50/50 rounded-xl mb-2 font-medium transition-all" data-section="produits">
        <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
          <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
            <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        Produits
      </a>
      
      <a href="#" id="link-categories" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50/50 rounded-xl mb-2 font-medium transition-all" data-section="categories">
        <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
          <i class="fa-solid fa-tag text-xl text-blue-600"></i>
        </div>
        Catégories
      </a>
      
      <a href="#" id="link-ventes" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50/50 rounded-xl mb-2 font-medium transition-all" data-section="ventes">
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
          <i class="fa-solid fa-scale-unbalanced-flip text-xl text-blue-600"></i>
        </div>
        Ventes
      </a>
      
      <a href="#" id="link-invoices" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50/50 rounded-xl mb-2 font-medium transition-all" data-section="factures">
        <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
          <i class="fa-solid fa-file-invoice text-xl text-blue-600"></i>
        </div>
        Factures
      </a>
      
      <a href="#" id="logout" class="flex bg-red-100 items-center px-4 py-3 text-gray-600 rounded-xl mb-2 font-medium transition-all mt-20">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-4">
          <i class="fa-solid fa-right-from-bracket text-xl"></i>
        </div>
        Déconnexion
      </a>
    </nav>
  `;
}
