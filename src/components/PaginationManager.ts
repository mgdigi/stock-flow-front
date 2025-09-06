export class PaginationManager<T> {
  private items: T[] = [];
  private currentPage: number = 1;
  private itemsPerPage: number = 10;
  private container: HTMLElement;
  private renderCallback: (items: T[], startIndex: number) => void;
  private paginationContainer: string;

  constructor(
    container: HTMLElement,
    paginationContainer: string,
    renderCallback: (items: T[], startIndex: number) => void,
    itemsPerPage: number = 10
  ) {
    this.container = container;
    this.paginationContainer = paginationContainer;
    this.renderCallback = renderCallback;
    this.itemsPerPage = itemsPerPage;
  }

  setItems(items: T[]) {
    this.items = items;
    this.currentPage = 1;
    this.render();
  }

  private render() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedItems = this.items.slice(startIndex, endIndex);
    
    // Render items
    this.renderCallback(paginatedItems, startIndex);
    
    // Render pagination controls
    this.renderPaginationControls();
  }

  private renderPaginationControls() {
    const totalPages = Math.ceil(this.items.length / this.itemsPerPage);
    const paginationEl = this.container.querySelector(this.paginationContainer);
    
    if (!paginationEl || totalPages <= 1) {
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    let paginationHTML = `
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Affichage de ${((this.currentPage - 1) * this.itemsPerPage) + 1} à ${Math.min(this.currentPage * this.itemsPerPage, this.items.length)} sur ${this.items.length} résultats
        </div>
        <nav class="flex space-x-1" aria-label="Pagination">
    `;

    // Previous button
    paginationHTML += `
      <button 
        ${this.currentPage === 1 ? 'disabled' : ''} 
        onclick="changePage(${this.currentPage - 1})"
        class="pagination-btn ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white'} bg-white border border-gray-300 text-gray-700 px-3 py-2 text-sm font-medium rounded-l-md"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>
    `;

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button 
          onclick="changePage(${i})"
          class="pagination-btn ${i === this.currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-600 hover:text-white'} border border-gray-300 px-3 py-2 text-sm font-medium"
        >
          ${i}
        </button>
      `;
    }

    // Next button
    paginationHTML += `
      <button 
        ${this.currentPage === totalPages ? 'disabled' : ''} 
        onclick="changePage(${this.currentPage + 1})"
        class="pagination-btn ${this.currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white'} bg-white border border-gray-300 text-gray-700 px-3 py-2 text-sm font-medium rounded-r-md"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    `;

    paginationHTML += `
        </nav>
      </div>
    `;

    paginationEl.innerHTML = paginationHTML;

    // Setup global change page function
    (window as any).changePage = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== this.currentPage) {
        this.currentPage = page;
        this.render();
      }
    };
  }

  getItemsPerPage(): number {
    return this.itemsPerPage;
  }

  setItemsPerPage(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.render();
  }
}
