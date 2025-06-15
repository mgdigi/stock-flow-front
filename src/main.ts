import './style.css'

import { showProduits, setupProductModal } from './views/produitsView';
import { showCategories, setupCategoryModal } from './views/categoriesView';
import { showInventaire, linkInventaire } from './views/inventaireView';
import { showInvoices } from './views/invoiceView';
import { showSales, setupSaleModal } from './views/venteView';
import { linkProduits } from './views/produitsView';
import { linkCategories } from './views/categoriesView';
import { linkSales } from './views/venteView';
import { invoiceBtn } from './views/invoiceView';
import { showDashboard, linkDashboard } from './views/dashboardView';


function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
  window.location.href = '../index.html';
}

const hideAllSections = (): void => {
    document.querySelectorAll('section').forEach((s) => {
      (s as HTMLElement).style.display = 'none';
    });
  };

 const rendreSidebarActive = (): void => {
    document.querySelectorAll('a').forEach((link) => {
      link.classList.remove('sidebar-active');
      link.style.color = 'black';
    }) 
  }

window.addEventListener('DOMContentLoaded', () => {
  const pageTitle = document.getElementById('page-title') as HTMLElement;
  const nomUser = document.getElementById('nom-user') as HTMLElement;
  const initialUser = document.getElementById('initial-user') as HTMLElement;

  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const user = JSON.parse(userInfo);
    nomUser.textContent = user.prenom + ' ' + user.nom || 'Utilisateur';
    initialUser.textContent = (user.prenom.charAt(0) + user.nom.charAt(0)).toUpperCase() || 'UN';
  } else {
    nomUser.textContent = 'Utilisateur inconnu';
  }

  const token = localStorage.getItem('authToken');

  if (!token) {
    console.warn("Aucun token trouvé. Redirection vers la page de connexion.");
    window.location.href = 'index.html'; 
  }else{ 

   linkDashboard?.addEventListener('click', async (e) => {
     const dashboardSection = document.getElementById('dashboard-section') as HTMLElement;
      e.preventDefault();
      linkDashboard.classList.add('sidebar-active');
      linkCategories.classList.remove('sidebar-active');
      linkProduits.classList.remove('sidebar-active');
      linkInventaire.classList.remove('sidebar-active');
      linkSales.classList.remove('sidebar-active');
      invoiceBtn.classList.remove('sidebar-active');
      linkDashboard.style.color = 'blue';

     dashboardSection.classList.remove('hidden')   ;
      pageTitle.textContent = 'Tableau de bord';
      hideAllSections();
     dashboardSection.style.display = "block"    

      await showDashboard();
    });

    invoiceBtn?.addEventListener('click', async (e) => {
      e.preventDefault();
      pageTitle.textContent = 'Factures';
      hideAllSections();
      rendreSidebarActive();
      await showInvoices();
    });

    linkSales?.addEventListener('click', async (e) => {
      e.preventDefault();
      pageTitle.textContent = 'Ventes';
      hideAllSections();
      rendreSidebarActive();
      await showSales();
    });

    setupSaleModal();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  
  linkProduits?.addEventListener('click', async (e) => {
    e.preventDefault();
    pageTitle.textContent = 'Produits';
    rendreSidebarActive();
    hideAllSections();
    await showProduits(); 
  });

  setupProductModal();

  linkInventaire?.addEventListener('click', async (e) => {
    e.preventDefault();
    pageTitle.textContent = 'Inventaire';
    hideAllSections();
    rendreSidebarActive();
    await showInventaire();
  });

  
  linkCategories?.addEventListener('click', async (e) => {
    e.preventDefault();
    pageTitle.textContent = 'Catégories';
    hideAllSections();
    rendreSidebarActive();

    await showCategories(); 
  });

  setupCategoryModal();

linkSales?.addEventListener('click', async (e) => {
  e.preventDefault();
  pageTitle.textContent = 'Ventes';
  hideAllSections();
    rendreSidebarActive();

  await showSales(); 
   showDashboard()
});

document.getElementById('logout')?.addEventListener('click', (e) => {
    e.preventDefault();
   logout();
  })


  if (invoiceBtn) {
    invoiceBtn.addEventListener('click', () => {
      hideAllSections();
    rendreSidebarActive();

      showInvoices();
    });
  }


setupSaleModal();


  const showCatBtn = document.getElementById('btn-show-cat-input');
  const newCatForm = document.getElementById('new-category-form');

  if (showCatBtn && newCatForm) {
    showCatBtn.addEventListener('click', () => {
      newCatForm.classList.toggle('hidden');
    });
  }

   showDashboard();

   }
});

