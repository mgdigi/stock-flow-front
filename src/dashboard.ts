import { createSidebar } from "./components/sidebar";
import { createHeader } from "./components/header";
import { createStatsCards } from "./components/statsCards";
import { Notifications } from "./utils/notifications";

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Vérifier l'authentification
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "../auth/login.html";
    return;
  }

  initializeDashboard();
});

function initializeDashboard(): void {
  // Render components
  const sidebarElement = document.getElementById("sidebar");
  const headerElement = document.getElementById("header");
  const statsCardsElement = document.getElementById("stats-cards");

  if (sidebarElement) {
    sidebarElement.innerHTML = createSidebar();
  }

  if (headerElement) {
    headerElement.innerHTML = createHeader();
  }

  if (statsCardsElement) {
    statsCardsElement.innerHTML = createStatsCards();
  }

  // Initialize event listeners
  setupEventListeners();

  // Load initial data
  loadDashboardData();
}

function setupEventListeners(): void {
  // Navigation listeners
  const navLinks = document.querySelectorAll("[data-section]");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = (e.currentTarget as HTMLElement).dataset.section;
      if (section) {
        navigateToSection(section);
      }
    });
  });

  // Logout listener
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

function navigateToSection(section: string): void {
  // Update active navigation
  document.querySelectorAll("[data-section]").forEach((link) => {
    link.classList.remove("sidebar-active", "text-blue-600");
    link.classList.add("text-gray-600");
  });

  const activeLink = document.querySelector(`[data-section="${section}"]`);
  if (activeLink) {
    activeLink.classList.add("sidebar-active", "text-blue-600");
    activeLink.classList.remove("text-gray-600");
  }

  // Update page title
  const titles: Record<string, string> = {
    inventaire: "Gestion de l'Inventaire",
    produits: "Gestion des Produits",
    categories: "Gestion des Catégories",
    ventes: "Gestion des Ventes",
    factures: "Gestion des Factures",
  };

  const pageTitle = document.getElementById("page-title");
  if (pageTitle && titles[section]) {
    pageTitle.textContent = titles[section];
  }

  // Load section content
  loadSectionContent(section);
}

function loadSectionContent(section: string): void {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) return;

  // Show loading state
  mainContent.innerHTML = `
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement de ${section}...</p>
    </div>
  `;

  // Load section content based on section type
  switch (section) {
    case "inventaire":
      import("./views/inventaire").then((module) => {
        mainContent.innerHTML = module.renderInventaireView();
      });
      break;
    case "produits":
      import("./views/produits").then((module) => {
        mainContent.innerHTML = module.renderProduitsView();
      });
      break;
    case "categories":
      import("./views/categories").then((module) => {
        mainContent.innerHTML = module.renderCategoriesView();
      });
      break;
    case "ventes":
      import("./views/ventes").then((module) => {
        mainContent.innerHTML = module.renderVentesView();
      });
      break;
    case "factures":
      import("./views/factures").then((module) => {
        mainContent.innerHTML = module.renderFacturesView();
      });
      break;
    default:
      loadDashboardContent();
  }
}

function loadDashboardContent(): void {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) return;

  mainContent.innerHTML = `
    <section id="dashboard-section">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
            <p class="text-gray-600 mt-1">Vue d'ensemble de votre activité commerciale</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Dernière mise à jour</p>
            <p class="text-lg font-semibold text-gray-800" id="last-update">${new Date().toLocaleString()}</p>
          </div>
        </div>
        
        <div id="dashboard-content">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold mb-4">Activité Récente</h3>
              <p class="text-gray-600">Dernières transactions et mises à jour</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold mb-4">Analyse des Ventes</h3>
              <p class="text-gray-600">Graphiques et tendances</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold mb-4">Alertes Stock</h3>
              <p class="text-gray-600">Produits nécessitant un réapprovisionnement</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function loadDashboardData(): void {
  // Update last update time
  const lastUpdateElement = document.getElementById("last-update");
  if (lastUpdateElement) {
    lastUpdateElement.textContent = new Date().toLocaleString();
  }
}

async function handleLogout(): Promise<void> {
  const result = await Notifications.confirm(
    "Confirmation",
    "Êtes-vous sûr de vouloir vous déconnecter ?"
  );
  if (result.isConfirmed) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    window.location.href = "../auth/login.html";
  }
}
