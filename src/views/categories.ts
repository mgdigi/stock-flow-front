export function renderCategoriesView(): string {
  return `
    <section id="categories-section" class="lg:col-span-3 space-y-6">
      <div class="lg:col-span-2 bg-white/80 rounded-3xl shadow-xl p-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold text-gray-800">Liste des Catégories</h3>
          <button id="btn-add-category" class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
            + Ajouter une catégorie
          </button>
        </div>

        <div class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-xl text-base">
            <thead class="bg-blue-600 text-white font-bold text-xl">
              <tr class="text-left">
                <th class="px-4 py-2 border-r">#</th>
                <th class="px-4 py-2 border-r">NOM</th>
                <th class="px-4 py-2 border-r">DATE CREATION</th>
              </tr>
            </thead>
            <tbody id="category-list" class="bg-white text-gray-800">
            </tbody>
          </table>
        </div>

        <div id="category-pagination" class="flex justify-center mt-6 space-x-2 text-sm text-white"></div>
      </div>
    </section>

    <!-- Modal Ajout Catégorie -->
    <div id="category-modal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 hidden items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-fitt">
        <h2 class="text-xl text-black font-bold mb-4 text-center">Ajouter une Catégorie</h2>
        <form id="category-form" class="space-y-4">
          <label for="categori nom" class="block text-black text-base font-bold">Nom Catégorie
            <input type="text" name="name" placeholder="Nom de la catégorie" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600">
          </label>
          <div class="flex justify-end space-x-2">
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enregistrer</button>
            <button type="button" id="close-cat-modal" class="bg-gray-300 text-gray-800 px-4 py-2 rounded">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
