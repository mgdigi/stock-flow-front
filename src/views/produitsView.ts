import { fetchProducts, createProduct} from '../services/productService';
import { fetchCategories, createCategory } from '../services/categoryService';
import { showError, showGlobalError, showSuccess } from '../utils/errorHandler';
import type { Product, Category } from '../types';
import { showDashboard } from './dashboardView';

const linkProduits = document.getElementById('link-produits') as HTMLAnchorElement;
const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let allProducts: Product[] = [];

function renderProductsPage(products: Product[], page: number): void {
  const list = document.getElementById('product-list') as HTMLUListElement;
  list.innerHTML = '';

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginated = products.slice(start, end);

  paginated.forEach((p) => {
    list.appendChild(renderProductItem(p));
  });

  renderPaginationControls(products.length, page);
}

function renderPaginationControls(totalItems: number, current: number): void {
  const pagination = document.getElementById('pagination') as HTMLDivElement;
  pagination.innerHTML = '';

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i.toString();
    btn.className = `px-3 py-1 rounded ${i === current ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} hover:bg-blue-700 hover:text-white`;

    btn.addEventListener('click', () => {
      currentPage = i;
      renderProductsPage(allProducts, currentPage);
    });

    pagination.appendChild(btn);
  }
}

function renderProductItem(product: Product): HTMLTableRowElement {
  const tr = document.createElement('tr');
  tr.className = 'border-b border-gray-200';

  tr.innerHTML = `
    <span class="px-4 py-2 border-r align-top">${product.reference}</span>
    <td class="px-4 py-2 border-r align-top">${product.name}</td>
    <td class="px-4 py-2 border-r align-top">${product.quantity}</td>
    <td class="text-green-600 px-4 py-2 font-bold border-r align-top">${product.price.toLocaleString()} FCFA</td>
    <td class="px-4 py-2 border-r align-top">${product.threshold}</td>
    <td class="px-4 py-2 border-r align-top">${product.category.name}</td>
    <td class="px-4 py-2 border-r align-top">${new Date(product.createdAt).toLocaleDateString()}</td>
  `;

  return tr;
}

export async function showProduits(): Promise<void> {
  const section = document.getElementById('produits-section') as HTMLElement;
  const list = document.getElementById('product-list') as HTMLUListElement;
  const pagination = document.getElementById('pagination') as HTMLDivElement;

  if (!section || !list || !pagination) return;

  section.style.display = 'block';
  linkProduits.classList.add('sidebar-active');
  linkProduits.style.color = 'blue';
  list.innerHTML = '';
  pagination.innerHTML = '';

  try {
    allProducts = await fetchProducts();
    currentPage = 1;
    renderProductsPage(allProducts, currentPage);
  } catch (err) {
    console.error(err);
    list.innerHTML = '<li class="text-red-500">Erreur de chargement</li>';
  }
}

let categorySelect: HTMLSelectElement;

async function loadCategories(): Promise<void> {
  const select = document.getElementById('category-select') as HTMLSelectElement;
  if (!select) return;

  try {
    const categories = await fetchCategories();
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat._id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des catégories', error);
  }
}

async function populateCategorySelect(): Promise<void> {
  try {
    const categories: Category[] = await fetchCategories();
    
    categorySelect.innerHTML = '<option value="">-- Choisissez une catégorie --</option>';
    
    categories.forEach((cat) => {
      const option = document.createElement('option');
      option.value = cat._id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
    
  } catch (err) {
    showError(err, 'Erreur de chargement des catégories');
  }
}

function resetProductForm(): void {
  const form = document.getElementById('product-form') as HTMLFormElement;
  const catInputDiv = document.getElementById('new-category-form')!; // Corrigé l'ID
  const newCatInput = document.getElementById('new-category-name') as HTMLInputElement;
  
  form.reset();
  
  if (categorySelect) {
    categorySelect.value = '';
  }
  
  catInputDiv.classList.add('hidden');
  if (newCatInput) {
    newCatInput.value = '';
  }
  
  const existingErrors = form.querySelectorAll('.error-message');
  existingErrors.forEach(error => error.remove());
  
  console.log('Formulaire complètement réinitialisé');
}

function cancelCategoryCreation(): void {
  const catInputDiv = document.getElementById('new-category-form')!; // Corrigé l'ID
  const newCatInput = document.getElementById('new-category-name') as HTMLInputElement;
  
  catInputDiv.classList.add('hidden');
  if (newCatInput) {
    newCatInput.value = '';
  }
  
  console.log('Création de catégorie annulée');
}

async function refreshProductsList(): Promise<void> {
  try {
    allProducts = await fetchProducts();
    renderProductsPage(allProducts, currentPage);
    console.log('Liste des produits mise à jour');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la liste des produits:', error);
  }
}





export function setupProductModal(): void {
  const openBtn = document.getElementById('btn-add-product')!;
  const modal = document.getElementById('product-modal')!;
  const closeBtn = document.getElementById('close-modal')!;
  const form = document.getElementById('product-form') as HTMLFormElement;
  categorySelect = document.getElementById('category-select') as HTMLSelectElement;
  const btnShowCatInput = document.getElementById('btn-show-cat-input') as HTMLButtonElement;
  const catInputDiv = document.getElementById('new-category-form')!; 

  openBtn.onclick = async () => {
    modal.style.display = 'flex';
    await populateCategorySelect();
    resetProductForm();
  };

  closeBtn.onclick = () => {
    modal.style.display = 'none';
    resetProductForm();
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      resetProductForm();
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
      resetProductForm();
    }
  });

  btnShowCatInput.onclick = () => {
    catInputDiv.classList.add('hidden');
    if (catInputDiv.classList.contains('hidden')) {
      const newCatInput = document.getElementById('new-category-name') as HTMLInputElement;
      if (newCatInput) {
        newCatInput.value = '';
      }
    }
  };

  form.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data: any = Object.fromEntries(formData.entries());

    data.price = parseFloat(data.price);
    data.quantity = parseInt(data.quantity, 10);
    if (data.threshold) data.threshold = parseInt(data.threshold, 10);

    if (!data.name || !data.price || !data.quantity || !data.category) {
      showError(form, 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    data.category = [data.category]; 


    try {
      await createProduct(data);
      
      modal.style.display = 'none';
      resetProductForm();
      
      await showDashboard();
      
      showSuccess('Produit créé avec succès ! ');
      
      const produitsSection = document.getElementById('produits-section') as HTMLElement;
      if (produitsSection && produitsSection.style.display === 'block') {
        await refreshProductsList();
      }
      
    } catch (error: any) {
      console.error('Erreur lors de la création du produit:', error);
      showError(form, 'Erreur lors de la création du produit');
    }
  };

  loadCategories();

  const saveCatBtn = document.getElementById('save-category-btn') as HTMLButtonElement;
  const newCatInput = document.getElementById('new-category-name') as HTMLInputElement;

  const cancelCatBtn = document.getElementById('cancel-category-btn') as HTMLButtonElement;
  if (cancelCatBtn) {
    cancelCatBtn.addEventListener('click', cancelCategoryCreation);
  }

  if (saveCatBtn) {
    saveCatBtn.addEventListener('click', async () => {
      const name = newCatInput?.value?.trim();
      
      if (!name) {
        showGlobalError('Veuillez saisir un nom de catégorie');
        return;
      }

      try {
        const newCategory = await createCategory(name);
        
        const option = document.createElement('option');
        option.value = newCategory._id;
        option.textContent = newCategory.name;
        categorySelect.appendChild(option);
        
        categorySelect.value = newCategory._id;
        
        cancelCategoryCreation();
        
        showSuccess(`Catégorie "${newCategory.name}" créée avec succès !`);
        
      } catch (error: any) {
        console.error('Erreur lors de la création de la catégorie:', error);
        showGlobalError('Erreur lors de la création de la catégorie');
      }
    });
  }
}

export { linkProduits };
