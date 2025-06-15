// src/views/invoiceView.ts
import { fetchSales } from '../services/venteService';
import { generateInvoicePDF } from '../services/invoiceService';
import type { Sale } from '../types';

const invoiceBtn = document.getElementById('link-invoices')as HTMLAnchorElement;
let allSales: Sale[] = [];
const ITEMS_PER_PAGE = 3;
let currentPage = 1;

  const pagination = document.getElementById('invoice-pagination') as HTMLDivElement;

function renderInvoiceItem(sale: Sale): HTMLDivElement {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1';
    div.innerHTML = `
    <div class="p-6">
        <!-- En-tête de la vente -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center space-x-3">
            <div class="bg-blue-100 p-2 rounded-full">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Vente du</p>
              <p class="font-semibold text-gray-900">${new Date(sale.date).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Montant total</p>
            <p class="text-2xl font-bold text-green-600">${sale.totalAmount} FCFA</p>
          </div>
        </div>

        <!-- Informations client -->
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <div class="flex items-center space-x-2 mb-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <h4 class="font-semibold text-gray-900">${sale.client.name}</h4>
          </div>
          <div class="flex flex-wrap gap-4 text-sm text-gray-600">
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.052 11.052 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span>${sale.client.phone}</span>
            </div>
            ${sale.client.email ? `
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>${sale.client.email}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Liste des produits -->
        <div class="mb-4">
          <h5 class="font-medium text-gray-900 mb-2 flex items-center">
            <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            Produits (${sale.products.length})
          </h5>
          <div class="space-y-2">
            ${sale.products.map(item => `
              <div class="flex justify-between items-center py-2 px-3 bg-white border border-gray-100 rounded">
                <div class="flex-1">
                  <p class="font-medium text-gray-900">${item.product.name}</p>
                  <p class="text-sm text-gray-500">Qté: ${item.quantity} × ${item.unitPrice} FCFA</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">${item.total} FCFA</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Résumé financier -->
        <div class="border-t pt-4 mb-4">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Sous-total:</span>
              <span class="text-gray-900">${sale.totalAmount} FCFA</span>
            </div>
            
          </div>
        </div>

        <!-- Bouton de génération -->
        <button 
          onclick="handleGenerateInvoice('${sale._id || sale.id}')"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 transform hover:scale-105"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Générer la facture PDF</span>
        </button>
      </div>
    </div>
  `;
    
    return div;
}


function renderSalesForInvoices(sales: Sale[], page: number): void {
  const container = document.getElementById('invoice-sales-list') as HTMLDivElement;

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginated = sales.slice(start, end);

  if (!sales.length) {
    container.innerHTML = `
      <div class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">📄</div>
        <p class="text-gray-600 text-lg">Aucune vente disponible</p>
        <p class="text-gray-500 text-sm">Les ventes apparaîtront ici une fois créées</p>
      </div>
    `;
    
    return;
  }

  container.innerHTML = paginated.map(sale => `
    <div class="mb-6">
      ${renderInvoiceItem(sale).outerHTML}
    </div>
  `).join('');

  renderPaginationControls(sales.length, page);
}


function renderPaginationControls(totalItems: number, current: number): void {
  const pagination = document.getElementById('invoice-pagination') as HTMLDivElement;

  pagination.innerHTML = '';

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i.toString();
    btn.className = `mx-1 px-3 py-1 rounded ${
      i === current ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'
    } hover:bg-blue-700 hover:text-white`;

    btn.addEventListener('click', () => {
      if (i !== currentPage) {
        currentPage = i;
        renderSalesForInvoices(allSales, currentPage);
      }
    });

    pagination.appendChild(btn);
  }
}




async function handleGenerateInvoice(saleId: string): Promise<void> {
  try {
    const sale = allSales.find(s => (s.id || s._id) === saleId);
    if (!sale) {
      throw new Error('Vente non trouvée');
    }

    const button = document.querySelector(`button[onclick="handleGenerateInvoice('${saleId}')"]`) as HTMLButtonElement;
    const originalContent = button.innerHTML;
    button.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Génération...
    `;
    button.disabled = true;

    await generateInvoicePDF(sale);
    
    showNotification('Facture générée avec succès !', 'success');
    
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.disabled = false;
    }, 1000);

  } catch (error) {
    console.error('Erreur génération facture:', error);
    showNotification('Erreur lors de la génération de la facture', 'error');
    
    const button = document.querySelector(`button[onclick="handleGenerateInvoice('${saleId}')"]`) as HTMLButtonElement;
    if (button) {
      button.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span>Générer la facture PDF</span>
      `;
      button.disabled = false;
    }
  }
}

function showNotification(message: string, type: 'success' | 'error'): void {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
    type === 'success' 
      ? 'bg-green-500 text-white' 
      : 'bg-red-500 text-white'
  }`;
  notification.innerHTML = `
    <div class="flex items-center space-x-2">
      ${type === 'success' 
        ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
        : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
      }
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(full)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

export async function showInvoices(): Promise<void> {
  const section = document.getElementById('invoice-section') as HTMLElement;
  const container = document.getElementById('invoice-sales-list') as HTMLDivElement;
  
  if (!section || !container  || !pagination) return;

  section.style.display = 'block';
  invoiceBtn.classList.add('sidebar-active');
  invoiceBtn.style.color = 'blue';
  pagination.innerHTML = '';

  
  container.innerHTML = `
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Chargement des ventes...</span>
    </div>
  `;
    pagination.innerHTML = '';


  try {
    allSales = await fetchSales();
    currentPage = 1; 
    renderSalesForInvoices(allSales, currentPage);
  } catch (error) {
    console.error('Erreur chargement ventes:', error);
    container.innerHTML = `
      <div class="text-center py-12">
        <div class="text-red-400 text-6xl mb-4">⚠️</div>
        <p class="text-red-600 text-lg font-semibold">Erreur de chargement</p>
        <p class="text-gray-500 text-sm">Impossible de charger les ventes</p>
        <button onclick="showInvoices()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Réessayer
        </button>
      </div>
    `;
  }
}

export {invoiceBtn}

(window as any).handleGenerateInvoice = handleGenerateInvoice;