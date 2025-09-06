export function renderInventaireView(): string {
  return `
    <section id="inventaire-section" class="section">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Gestion de l'Inventaire</h1>
        
        <div id="stock-alerts" class="mb-8"></div>
        
        <div id="inventory-value" class="mb-8"></div>
        
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">Produits les Plus Vendus</h2>
          <div id="top-products"></div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Mouvements de Stock Récents</h2>
          <div id="stock-movements"></div>
        </div>
      </div>
    </section>
  `;
}
