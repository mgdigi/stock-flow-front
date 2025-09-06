import { fetchSales, fetchProducts } from '../services/dataService';
import { PaginationManager } from './PaginationManager';

export class SalesManager {
  private container: HTMLElement;
  private allProducts: any[] = [];
  private paginationManager: PaginationManager<any>;

  constructor(container: HTMLElement) {
    this.container = container;
    
    this.paginationManager = new PaginationManager(
      container,
      '#sales-pagination',
      (paginatedSales, startIndex) => this.renderSalesTable(paginatedSales, startIndex),
      10
    );
  }

  async loadSalesData() {
    try {
      const [sales, products] = await Promise.all([
        fetchSales(),
        fetchProducts()
      ]);
      
      this.allProducts = products;
      
      // Utiliser la pagination
      this.paginationManager.setItems(sales);
    } catch (error) {
      console.error('Erreur lors du chargement des ventes:', error);
    }
  }

  private renderSalesTable(sales: any[], startIndex: number) {
    const tbody = this.container.querySelector('#sales-list');
    if (tbody) {
      tbody.innerHTML = sales.map((sale, index) => {
        const total = this.calculateSaleTotal(sale);
        console.log('Calcul total pour vente:', sale);
        const productsDisplay = this.formatProductsDisplay(sale.products);
        
        return `
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 border-r text-center">${startIndex + index + 1}</td>
            <td class="px-4 py-2 border-r">${productsDisplay}</td>
            <td class="px-4 py-2 border-r">${sale.client.name}</td>
            <td class="px-4 py-2 border-r">${sale.client.phone}</td>
            <td class="px-4 py-2 border-r">${new Date(sale.date).toLocaleDateString()}</td>
            <td class="px-4 py-2 font-bold text-green-600">${total.toLocaleString()} FCFA</td>
          </tr>
        `;
      }).join('');
    }
  }

  private calculateSaleTotal(sale: any): number {
    return sale.products.reduce((sum: number, product: any) => {
      return sum + ((product.unitPrice || 0) * (product.quantity || 0));
    }, 0);
  }

  private formatProductsDisplay(products: any[]): string {
    return products.map(p => {
      const product = this.allProducts.find(prod => prod._id === p.product._id);
      const productName = product?.name || 'Produit inconnu';
      console.log('Produit pour affichage:', product);
      return `${productName} (${p.quantity})`;
    }).join(', ');
  }
}
