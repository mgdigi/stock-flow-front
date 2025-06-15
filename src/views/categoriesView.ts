import { fetchCategories, createCategory } from '../services/categoryService';
import type { Category } from '../types';
import { showError, showSuccess } from '../utils/errorHandler';
import { showDashboard } from './dashboardView';



const linkCategories = document.getElementById('link-categories') as HTMLAnchorElement;

const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let allCategories: Category[] = [];

function renderCategoriesPage(categories: Category[], page: number): void {
  const list = document.getElementById('category-list') as HTMLUListElement;
  list.innerHTML = '';

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginated = categories.slice(start, end);

  paginated.forEach((cat) => {
    list.appendChild(renderCategoryItem(cat));
  });

  renderPaginationControls(categories.length, page);
}

function renderPaginationControls(totalItems: number, current: number): void {
  const pagination = document.getElementById('category-pagination') as HTMLDivElement;
  pagination.innerHTML = '';

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i.toString();
    btn.className = `px-3 py-1 rounded ${
      i === current ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'
    } hover:bg-blue-700 hover:text-white`;

    btn.addEventListener('click', () => {
      currentPage = i;
      renderCategoriesPage(allCategories, currentPage);
    });

    pagination.appendChild(btn);
  }
}

function renderCategoryItem(category: Category): HTMLTableRowElement {
  const tr = document.createElement('tr');
  tr.className = 'border-b border-gray-200';
  tr.innerHTML = `
  <td class="px-4 py-2 border-r align-top">${category.name}</td>
    <td class="px-4 py-2 border-r align-top">${new Date(category.createdAt).toLocaleDateString()}</td>
  `;
  return tr;
}

export async function showCategories(): Promise<void> {
  const section = document.getElementById('categories-section') as HTMLElement;
  const list = document.getElementById('category-list') as HTMLUListElement;
  const pagination = document.getElementById('category-pagination') as HTMLDivElement;
  if (!section || !list || !pagination) return;

  section.style.display = 'block';
  linkCategories.classList.add('sidebar-active');
  linkCategories.style.color = 'blue';
  list.innerHTML = '';
  pagination.innerHTML = '';

  try {
    allCategories = await fetchCategories();
    currentPage = 1;
    renderCategoriesPage(allCategories, currentPage);
    showDashboard()
  } catch (err) {
    console.error(err);
    list.innerHTML = '<li class="text-red-500">Erreur de chargement</li>';
  }
}

export function setupCategoryModal(): void {
  const openBtn = document.getElementById('btn-add-category')!;
  const modal = document.getElementById('category-modal')!;
  const closeBtn = document.getElementById('close-cat-modal')!;
  const form = document.getElementById('category-form') as HTMLFormElement;

  openBtn.onclick = () => {
    modal.style.display = 'flex';
  };

  closeBtn.onclick = () => {
    modal.style.display = 'none'
    form.reset();
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    if (!name) {
      showError(form, 'Le nom de la catégorie est requis.');
      return;
    }

    try {
      await createCategory(name);

      modal.style.display = 'none';
      form.reset();
      showSuccess('Catégorie créée avec succès.');
      await showCategories();
    } catch (error) {
      showError(form, 'Erreur lors de la création de la catégorie. Veuillez réessayer.');}
  };
}

export {linkCategories}
