import { fetchSales, createSale } from '../services/venteService';
import { fetchProducts } from '../services/productService';
import type { Product, Sale } from '../types';
import { showError, showSuccess } from '../utils/errorHandler';
import { showDashboard } from './dashboardView';

const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let allSales: Sale[] = [];
const linkSales = document.getElementById('link-ventes') as HTMLAnchorElement;

function renderSalesPage(sales: Sale[], page: number): void {
  const list = document.getElementById('sales-list') as HTMLUListElement;
  list.innerHTML = '';

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginated = sales.slice(start, end);

  paginated.forEach((sale) => {
    list.appendChild(renderSaleItem(sale));
  });

  renderPaginationControls(sales.length, page);
}

function renderPaginationControls(totalItems: number, current: number): void {
  const pagination = document.getElementById('sales-pagination') as HTMLDivElement;
  pagination.innerHTML = '';

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i.toString();
    btn.className = `px-3 py-1 rounded ${i === current ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} hover:bg-blue-700 hover:text-white`;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderSalesPage(allSales, currentPage);
    });
    pagination.appendChild(btn);
  }
}

function renderSaleItem(sale: Sale): HTMLTableRowElement {
  const tr = document.createElement('tr');
  tr.className = 'border-b border-gray-200';

  const productsHTML = sale.products.map(p => 
    `<div><span class="block text-gray-700 font-medium">${p.product.name}</span></div>`
  ).join('');

  tr.innerHTML = `
    <td class="px-4 py-2 border-r align-top">${productsHTML}</td>
    <td class="px-4 py-2 border-r align-top">${sale.client.name}</td>
    <td class="px-4 py-2 border-r align-top">${sale.client.phone}</td>
    <td class="px-4 py-2 border-r align-top">${new Date(sale.date).toLocaleDateString()}</td>
    <td class="px-4 py-2 align-top font-bold text-green-700">${sale.totalAmount} FCFA</td>
  `;

  return tr;
}

export async function showSales(): Promise<void> {
  const section = document.getElementById('sales-section') as HTMLElement;
  const list = document.getElementById('sales-list') as HTMLUListElement;
  const pagination = document.getElementById('sales-pagination') as HTMLDivElement;

  if (!section || !list || !pagination) return;

  section.style.display = 'block';
  linkSales.classList.add('sidebar-active');
  linkSales.style.color = 'blue';
  list.innerHTML = '';
  pagination.innerHTML = '';

  try {
    allSales = await fetchSales();
    currentPage = 1;
    renderSalesPage(allSales, currentPage);
    showDashboard();
  } catch (err) {
    console.error(err);
    list.innerHTML = '<li class="text-red-500">Erreur de chargement</li>';
  }
}

let productSelect: HTMLSelectElement;

async function populateProductSelect(): Promise<void> {
  try {
    const products: Product[] = await fetchProducts();
    
    productSelect.innerHTML = '<option value="">Sélectionner un produit</option>';
    
    products.forEach((product) => {
      const option = document.createElement('option');
      option.value = product.id || product._id || '';
      option.textContent = `${product.name} - Stock: ${product.quantity}`;
      
      productSelect.appendChild(option);
    });
    
  } catch (err) {
    console.error("Erreur de chargement des produits :", err);
    productSelect.innerHTML = '<option value="">Erreur de chargement</option>';
  }
}

function removeProductLine(button: HTMLButtonElement): void {
  const container = document.getElementById('products-container')!;
  if (container.children.length > 1) {
    button.closest('.product-line')?.remove();
  } else {
    alert('Vous devez avoir au moins un produit');
  }
}

function addProductLine(): void {
  const container = document.getElementById('products-container')!;
  const productLine = document.createElement('div');
  productLine.className = 'product-line';
  
  productLine.innerHTML = `
    <div class="flex gap-2 product-group mb-3">
      <select class="product-select border p-2 rounded w-92 bg-gray-300 text-gray-800" name="products[]" >
        ${productSelect.innerHTML}
      </select>
      <input type="number" class="quantity-input w-full py-1 border border-gray-400 bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-500" name="quantities[]" min="1" value="1" required>
      <button type="button" class="remove-btn text-xl text-red-400 hover:text-red-600 bg-red-100 hover:bg-red-200 rounded-full w-6 h-6 flex items-center justify-center transition-colors" onclick="removeProductLine(this)">×</button>
    </div>
  `;
  
  container.appendChild(productLine);
}

async function refreshSalesList(): Promise<void> {
  try {
    allSales = await fetchSales();
    renderSalesPage(allSales, currentPage);
    console.log('Liste des ventes mise à jour');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la liste des ventes:', error);
  }
}


export function setupSaleModal(): void {
  const openBtn = document.getElementById('btn-add-sale')!;
  const modal = document.getElementById('sale-modal')!;
  const closeBtn = document.getElementById('close-sale-modal')!;
  const form = document.getElementById('sale-form') as HTMLFormElement;
  productSelect = document.getElementById('product-select') as HTMLSelectElement;

  openBtn.onclick = async () => {
    modal.style.display = 'flex';
    await populateProductSelect();
    
    const container = document.getElementById('products-container')!;
    container.innerHTML = '';
    addProductLine();
  };

  closeBtn.onclick = () => {
    form.reset();
     modal.style.display = 'none'
    };

  const addBtn = document.getElementById('add-product-btn');
  if (addBtn) {
    addBtn.onclick = addProductLine;
  }

  form.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const clientInfo = {
      name: (formData.get('client_name') as string)?.trim(),
      email: (formData.get('client_email') as string)?.trim(),
      phone: (formData.get('client_phone') as string)?.trim(),
    };

    const productIds = formData.getAll('products[]') as string[];
    const quantities = formData.getAll('quantities[]') as string[];

    if (!clientInfo.name || clientInfo.phone === '' || clientInfo.email === '') {
      showError(form, 'Vueillez remplir tous les champs obligatoire');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senegalPhoneRegex = /^(?:\+221|00221)?(7[05678]\d{7})$/;

    if (!senegalPhoneRegex.test(clientInfo.phone)) {
      showError(form, 'Le téléphone du client n est pas valide');
      return;
    }

    if (!emailRegex.test(clientInfo.email)) {
      showError(form, 'L email du client n est pas valide');
      return;
    }

    if (productIds.length === 0 || productIds.some(id => !id)) {
      showError(form, 'veuillez selectionner au moin un produit !');
      return;
    }

    const products = productIds.map((productId, index) => ({
      productId: productId.trim(),
      quantity: parseInt(quantities[index]) || 1,
    })).filter(p => p.productId !== '');

    const saleData = {
      clientInfo,
      products,
    };

    try {
      await createSale(saleData);
      
      modal.style.display = 'none';
      form.reset();
      
      await showDashboard();
      showSuccess('Vente enregistrée avec succès !.');
      
      const salesSection = document.getElementById('sales-section') as HTMLElement;
      if (salesSection && salesSection.style.display === 'block') {
        await refreshSalesList();
      }
      
    } catch (error: any) {
      showError(form, 'Erreur lors de l creation de la vente ');
    }
  };
}

export { linkSales };
