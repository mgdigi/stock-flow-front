export function renderVentesView(): string {
  return `
    <section id="sales-section" class="lg:col-span-3 space-y-6">
      <div class="lg:col-span-2 bg-white/80 rounded-3xl shadow-xl p-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold text-gray-800">Liste des Ventes</h3>
        </div>

        <div class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-xl text-base">
            <thead class="bg-blue-600 text-white font-bold text-xl">
              <tr class="text-left">
                <th class="px-4 py-2 border-r">#</th>
                <th class="px-4 py-2 border-r">Produits</th>
                <th class="px-4 py-2 border-r">Client</th>
                <th class="px-4 py-2 border-r">Téléphone</th>
                <th class="px-4 py-2 border-r">Date</th>
                <th class="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody id="sales-list" class="bg-white text-gray-800">
            </tbody>
          </table>
        </div>

        <div id="sales-pagination" class="flex justify-center mt-6 space-x-2 text-sm text-white"></div>
      </div>
    </section>

    <!-- Modal Nouvelle Vente -->
    <div id="sale-modal" class="fixed inset-0 bg-black bg-opacity-50 justify-center items-center hidden z-50">
      <div class="bg-white text-black p-6 rounded-lg w-fitt">
        <h2 class="text-xl font-bold mb-4">Nouvelle vente</h2>
        <form id="sale-form" class="space-y-4">
          <label for="client_name" class="block text-gray-800 font-bold">Nom du Client :
            <input name="client_name" type="text" placeholder="Nom du client" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </label>
          
          <label for="client_email" class="block text-gray-800 font-bold">Email Client :
            <input name="client_email" type="text" placeholder="Email du client" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </label>
          
          <label for="client_phone" class="block text-gray-800 font-bold">Téléphone Client :
            <input name="client_phone" type="tel" placeholder="Téléphone client" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" />
          </label>
       
          <div class="flex gap-2">
            <div class="products-section">
              <label class="text-black">Produits :</label>
              
              <select id="product-select" class="border p-2 rounded w-92 bg-gray-300 text-gray-800" style="display: none;">
                <option value="">-- Choisissez un produit --</option>
              </select>
              
              <div id="products-container"></div>
              
              <button type="button" id="add-product-btn" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                + Ajouter un produit
              </button>
            </div>
          </div>

          <div class="flex justify-end space-x-2">
            <button type="button" id="close-sale-modal" class="text-gray-800 bg-gray-300 px-4 py-2">Annuler</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Créer</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
