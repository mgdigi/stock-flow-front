// Service centralisé pour tous les appels de données
export { fetchProducts, createProduct } from './productService';
export { fetchCategories, createCategory } from './categoryService';
export { fetchSales, createSale } from './venteService';
export { generateInvoicePDF } from './invoiceService';
