import { fetchProducts, fetchSales, fetchCategories } from './dataService';
import type { Product } from '../types';

export class StatsService {
  private static async getAllData() {
    const [products, sales, categories] = await Promise.all([
      fetchProducts(),
      fetchSales(),
      fetchCategories()
    ]);
    return { products, sales, categories };
  }

  static async getStats() {
    try {
      const { products, sales } = await this.getAllData();
      
      // Calculer total stock
      const totalStock = products.reduce((sum, product) => sum + (product.quantity || 0), 0);
      
      // Stock faible : produits avec moins de 7 quantités
      const lowStockProducts = products.filter(p => (p.quantity || 0) < 7);
      
      // Chiffre d'affaires total
      const totalRevenue = sales.reduce((sum, sale) => {
        // Calculer le total de chaque vente
        const saleTotal = sale.products.reduce((saleSum, product) => {
          return saleSum + ((product.unitPrice || 0) * (product.quantity || 0));
        }, 0);
        return sum + saleTotal;
      }, 0);
      
      // Factures du mois actuel
      const currentMonth = new Date();
      const thisMonthSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === currentMonth.getMonth() && 
               saleDate.getFullYear() === currentMonth.getFullYear();
      });
      
      // Pourcentage de stock en bonne santé
      const stockPercentage = totalStock > 0 ? Math.round(((totalStock - lowStockProducts.reduce((sum, p) => sum + (p.quantity || 0), 0)) / totalStock) * 100) : 0;
      
      return {
        totalStock,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        totalRevenue,
        monthlyInvoices: thisMonthSales.length,
        stockPercentage,
        recentSales: sales.slice(0, 5).reverse() // 5 dernières ventes
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      throw error;
    }
  }

  static async getLowStockAlerts(): Promise<Product[]> {
    try {
      const products = await fetchProducts();
      return products.filter(p => (p.quantity || 0) < 7);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes stock:', error);
      return [];
    }
  }

  static async getTopProducts() {
    try {
      const { products, sales } = await this.getAllData();
      
      const productSales = new Map<string, { quantity: number, revenue: number, product: Product }>();
      
      // Calculer les ventes par produit
      sales.forEach(sale => {
        sale.products.forEach(p => {
          const productId = p.product;
          const product = products.find(prod => prod._id === productId);
          
          if (product) {
            const current = productSales.get(productId) || { quantity: 0, revenue: 0, product };
            current.quantity += p.quantity || 0;
            current.revenue += (p.unitPrice || 0) * (p.quantity || 0);
            productSales.set(productId, current);
          }
        });
      });
      
      return Array.from(productSales.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
    } catch (error) {
      console.error('Erreur lors du calcul des top produits:', error);
      return [];
    }
  }
}
