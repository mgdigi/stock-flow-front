export function renderProduitsView(): string {
  return `
    <section id="produits-section" class="lg:col-span-3 space-y-6">
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold text-gray-800">Liste des Produits</h3>
          <button id="btn-add-product" class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
            + Ajouter un produit
          </button>
        </div>
        
        <div class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-xl text-base">
            <thead class="bg-blue-600 text-white font-bold text-xl">
              <tr class="text-left">
                <th class="px-4 py-2 border-r">#</th>
                <th class="px-4 py-2 border-r">REFERENCE</th>
                <th class="px-4 py-2 border-r">NOM PRODUIT</th>
                <th class="px-4 py-2 border-r">QUANTITÉ</th>
                <th class="px-4 py-2 border-r">PRIX</th>
                <th class="px-4 py-2 border-r">SEUIL D'ALERTE</th>
                <th class="px-4 py-2 border-r">CATEGORIE</th>
                <th class="px-4 py-2">DATE CREATION</th>
              </tr>
            </thead>
            <tbody id="product-list" class="bg-white text-gray-800">
            </tbody>
          </table>
        </div>
        <div id="pagination" class="flex justify-center mt-6 space-x-2 text-sm text-white"></div>
      </div>
    </section>

    <!-- Modal Ajout Produit -->
    <div id="product-modal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 hidden">
      <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 class="text-xl text-black font-bold mb-4 text-center">Ajouter un produit</h2>
        <form id="product-form" class="space-y-4">
          <label for="name" class="block text-black text-base font-bold">Nom Produit
            <input name="name" type="text" placeholder="Nom du produit" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" />
          </label>
          
          <label for="price" class="block text-black text-base font-bold">Prix du Produit
            <input name="price" type="number" placeholder="Prix"  class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" />
          </label>
          
          <label for="quantite" class="block text-black text-base font-bold">Quantité en stock
            <input name="quantity" type="number" placeholder="Quantité"  class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" />
          </label>
          
          <label for="threshold" class="block text-black text-base font-bold">Seuil d'alerte
            <input name="threshold" type="number" placeholder="Seuil d'alerte"  class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" />
          </label>
          
          <div class="mt-4 flex gap-2">
            <label for="categories" class="block text-black text-base font-bold">Catégorie du produit
              <select id="category-select" name="category" class="border p-2 rounded w-full bg-gray-300 text-gray-800">
                <option value="">-- Choisissez une catégorie --</option>
              </select>
            </label>
            <button type="button" id="btn-show-cat-input" class="bg-blue-500 text-white px-4 h-9 self-end rounded">+</button>
          </div>

          <div id="new-category-form" class="mt-2 hidden">
            <label for="name" class="block text-black text-base font-bold">Nom Catégorie
              <input type="text" id="new-category-name" placeholder="Nouvelle catégorie" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" />
              <button 
                type="button" 
                id="cancel-category-btn"
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </label>
            <button type="button" id="save-category-btn" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Créer</button>
          </div>

          <div class="flex justify-end space-x-2">
            <button type="button" id="close-modal" class="text-gray-800 bg-gray-300 px-4 py-2">Annuler</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Créer</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
