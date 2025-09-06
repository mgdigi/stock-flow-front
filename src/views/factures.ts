export function renderFacturesView(): string {
  return `
    <section id="invoice-section">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="bg-blue-100 p-3 rounded-full">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-3xl font-bold text-gray-900">Génération de Factures</h2>
              <p class="text-gray-600">Générez des factures PDF pour vos ventes</p>
            </div>
          </div>
        </div>
      </div>

      <div id="invoice-sales-list" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 overflow-auto snap-y">
      </div>

      <!-- Élément de pagination -->
      <div id="factures-pagination" class="flex justify-center mt-8">
        <!-- La pagination sera injectée ici -->
      </div>
      
      <div id="invoice-pagination" class="flex justify-center mt-6 space-x-2 text-sm text-white"></div>
    </section>
  `;
}
