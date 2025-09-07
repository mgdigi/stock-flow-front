import { createSidebar } from "../components/sidebar";
import { createHeader } from "../components/header";
import { createStatsCards } from "../components/statsCards";
import { DashboardStats } from "../components/DashboardStats";
import { SalesManager } from "../components/SalesManager";
import { InventoryManager } from "../components/InventoryManager";
import { PaginationManager } from "../components/PaginationManager";
import { router } from "../router";
import { Notifications } from "../utils/notifications";
import { getSafeClient, calculateSafeTotal } from "../utils/safeAccess";

export class DashboardPage {
  private container: HTMLElement;
  private dashboardStats: DashboardStats;
  private salesManager: SalesManager;
  private inventoryManager: InventoryManager;

  constructor(container: HTMLElement) {
    this.container = container;
    this.dashboardStats = new DashboardStats(container);
    this.salesManager = new SalesManager(container);
    this.inventoryManager = new InventoryManager(container);
  }

  render() {
    this.container.innerHTML = `
      <div class="dashboard bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 h-screen overflow-hidden">
        <div class="flex w-screen h-full">
          <!-- Sidebar -->
          <div id="sidebar" class="w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 slide-in"></div>
          
          <div class="flex-1 overflow-auto">
            <!-- Header -->
            <header id="header" class="bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20"></header>
            
            <!-- Main Content -->
            <main class="p-8">
              <!-- Stats Cards -->
              <div id="stats-cards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12"></div>
              
              <!-- Main Dashboard Content -->
              <div id="main-content" class="dashboard flex-1"></div>
            </main>
          </div>
        </div>
      </div>

      <!-- Modals Container -->
      <div id="modals-container"></div>
    `;

    this.initializeComponents();
    this.setupEventListeners();
    this.loadDashboardWithStats();
  }

  private initializeComponents() {
    const sidebarElement = this.container.querySelector("#sidebar");
    const headerElement = this.container.querySelector("#header");
    const statsCardsElement = this.container.querySelector("#stats-cards");

    if (sidebarElement) {
      sidebarElement.innerHTML = createSidebar();
    }

    if (headerElement) {
      headerElement.innerHTML = createHeader();
    }

    if (statsCardsElement) {
      statsCardsElement.innerHTML = createStatsCards();
    }
  }

  private async loadDashboardWithStats() {
    await this.dashboardStats.loadStats();
  }

  private setupEventListeners() {
    const navLinks = this.container.querySelectorAll("[data-section]");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = (e.currentTarget as HTMLElement).dataset.section;
        if (section) {
          this.navigateToSection(section);
        }
      });
    });

    // Logout listener
    const logoutBtn = this.container.querySelector("#logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", this.handleLogout.bind(this));
    }

    // New sale button
    const newSaleBtn = this.container.querySelector("#btn-add-sale");
    if (newSaleBtn) {
      newSaleBtn.addEventListener("click", () => {
        import("../components/ModalManager").then(({ ModalManager }) => {
          const modalManager = new ModalManager(this.container);
          modalManager.showSaleModal();
        });
      });
    }
  }

  private navigateToSection(section: string) {
    this.container.querySelectorAll("[data-section]").forEach((link) => {
      link.classList.remove("sidebar-active", "text-blue-600");
      link.classList.add("text-gray-600");
    });

    const activeLink = this.container.querySelector(
      `[data-section="${section}"]`
    );
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

    const pageTitle = this.container.querySelector("#page-title");
    if (pageTitle && titles[section]) {
      pageTitle.textContent = titles[section];
    }

    // Load section content
    this.loadSectionContent(section);
  }

  private async loadSectionContent(section: string) {
    const mainContent = this.container.querySelector(
      "#main-content"
    ) as HTMLElement;
    if (!mainContent) return;

    mainContent.innerHTML = `
      <div class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement de ${section}...</p>
      </div>
    `;

    try {
      switch (section) {
        case "inventaire":
          const { renderInventaireView } = await import("../views/inventaire");
          mainContent.innerHTML = renderInventaireView();
          await this.inventoryManager.loadInventoryData();
          break;

        case "produits":
          const { renderProduitsView } = await import("../views/produits");
          mainContent.innerHTML = renderProduitsView();
          await this.loadProductsData(mainContent);
          this.setupProductModals(mainContent);
          break;

        case "categories":
          const { renderCategoriesView } = await import("../views/categories");
          mainContent.innerHTML = renderCategoriesView();
          await this.loadCategoriesData(mainContent);
          this.setupCategoryModals(mainContent);
          break;

        case "ventes":
          const { renderVentesView } = await import("../views/ventes");
          mainContent.innerHTML = renderVentesView();
          await this.salesManager.loadSalesData();
          break;

        case "factures":
          const { renderFacturesView } = await import("../views/factures");
          mainContent.innerHTML = renderFacturesView();
          await this.loadFacturesData(mainContent);
          break;

        default:
          await this.dashboardStats.loadStats();
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la section:", error);
      mainContent.innerHTML = `
        <div class="text-center py-12">
          <p class="text-red-600">Erreur lors du chargement de ${section}</p>
        </div>
      `;
    }
  }

  private async loadProductsData(container: HTMLElement) {
    try {
      const products = await (
        await import("../services/dataService")
      ).fetchProducts();

      // Configuration de la pagination pour les produits
      const productsPagination = new PaginationManager<any>(
        container,
        "#pagination",
        (paginatedProducts, startIndex) => {
          const tbody = container.querySelector("#product-list");
          if (tbody) {
            tbody.innerHTML = paginatedProducts
              .map(
                (product: any, index: number) => `
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-2 border-r text-center">${
                  startIndex + index + 1
                }</td>
                <td class="px-4 py-2 border-r">${
                  product.reference || product._id?.slice(-6) || "N/A"
                }</td>
                <td class="px-4 py-2 border-r">${product.name}</td>
                <td class="px-4 py-2 border-r ${
                  (product.quantity || 0) < 7
                    ? "text-red-600 font-bold bg-red-50"
                    : ""
                }">${product.quantity || 0}</td>
                <td class="px-4 py-2 border-r">${(
                  product.price || 0
                ).toLocaleString()} FCFA</td>
                <td class="px-4 py-2 border-r">${product.threshold || 7}</td>
                <td class="px-4 py-2 border-r">${product.category.name || "N/A"}</td>
                <td class="px-4 py-2">${new Date(
                  product.createdAt
                ).toLocaleDateString()}</td>
              </tr>
            `
              )
              .join("");
          }
        },
        6 
      );

      productsPagination.setItems(products);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    }
  }

  private async loadCategoriesData(container: HTMLElement) {
    try {
      const categories = await (
        await import("../services/dataService")
      ).fetchCategories();

      // Configuration de la pagination pour les catégories
      const categoriesPagination = new PaginationManager<any>(
        container,
        "#category-pagination",
        (paginatedCategories, startIndex) => {
          const tbody = container.querySelector("#category-list");
          if (tbody) {
            tbody.innerHTML = paginatedCategories
              .map(
                (category: any, index: number) => `
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-2 border-r text-center">${
                  startIndex + index + 1
                }</td>
                <td class="px-4 py-2 border-r">${category.name}</td>
                <td class="px-4 py-2">${new Date(
                  category.createdAt
                ).toLocaleDateString()}</td>
              </tr>
            `
              )
              .join("");
          }
        },
        6
      );

      categoriesPagination.setItems(categories);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  }


  private async loadFacturesData(container: HTMLElement) {
  try {
    const { fetchSales, fetchProducts } = await import("../services/dataService");
    const [sales, products] = await Promise.all([fetchSales(), fetchProducts()]);

    const sortedSales = [...sales].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const facturesContainer = container.querySelector("#invoice-sales-list");
    if (facturesContainer) {
      const facturesPagination = new PaginationManager<any>(
        container,
        "#factures-pagination", 
        (paginatedSales) => {
          facturesContainer.innerHTML = paginatedSales
            .map((sale) => {
              const total = calculateSafeTotal(sale);
              const productsDisplay = this.getProductNamesForSale(sale.products, products);
              const safeClient = getSafeClient(sale);

              return `
                <div class="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 backdrop-blur-sm mb-6">
                  <div class="flex justify-between items-start mb-6">
                    <div class="space-y-2">
                      <div class="flex items-center gap-2">
                        <i class="fa-solid fa-user-circle text-blue-500"></i>
                        <h3 class="text-xl font-semibold text-gray-800">
                          ${safeClient.name}
                        </h3>
                      </div>
                      <div class="flex items-center gap-2 text-gray-600">
                        <i class="fa-solid fa-envelope text-sm"></i>
                        <p class="text-sm">${safeClient.email}</p>
                      </div>
                      <div class="flex items-center gap-2 text-gray-600">
                        <i class="fa-solid fa-phone text-sm"></i>
                        <p class="text-sm">${safeClient.phone}</p>
                      </div>
                    </div>
                    <div class="text-right space-y-2">
                      <div class="flex items-center justify-end gap-2 text-gray-500">
                        <i class="fa-solid fa-calendar-alt"></i>
                        <p class="text-sm">${new Date(sale.date).toLocaleDateString()}</p>
                      </div>
                      <div class="bg-blue-50 rounded-lg p-2">
                        <p class="text-xl font-bold text-blue-600">
                          ${total.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-6">
                    <div class="flex items-center gap-2 mb-3">
                      <i class="fa-solid fa-box text-blue-500"></i>
                      <h4 class="font-medium text-gray-700">Produits</h4>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="text-sm text-gray-600 space-y-2 divide-y divide-gray-200">
                        ${productsDisplay}
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex justify-end mt-4">
                    <button 
                      onclick="window.generateInvoice('${sale._id}')" 
                      class="group bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                             transition-all duration-300 flex items-center gap-3 hover:gap-4">
                      <i class="fa-solid fa-file-pdf"></i>
                      <span>Générer Facture</span>
                      <i class="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 
                             transition-all duration-300"></i>
                    </button>
                  </div>
                </div>
              `;
            })
            .join("");
        },
        3
      );

      
       facturesPagination.setItems(sortedSales);

     
      (window as any).generateInvoice = async (saleId: string) => {
        try {
          const { generateInvoicePDF } = await import("../services/dataService");
          const sale = sales.find((s) => s._id === saleId);
          console.log("Génération de la facture pour la vente:", sale);
          if (sale) {
            await generateInvoicePDF(sale);
            Notifications.success("Succès", "Facture générée avec succès !");
          }
        } catch (error) {
          console.error("Erreur lors de la génération de la facture:", error);
          Notifications.error(
            "Erreur",
            "Erreur lors de la génération de la facture: " + (error as Error).message
          );
        }
      };
    }
  } catch (error) {
    console.error("Erreur lors du chargement des factures:", error);
  }
}


  private getProductNamesForSale(
    saleProducts: any[],
    allProducts: any[]
  ): string {
    return saleProducts
      .map((p) => {
        const product = allProducts.find((prod) => prod._id === p.product._id);
        const productName = product?.name || "Produit inconnu";
        const unitPrice = p.unitPrice || product?.price || 0;
        return `<div class="flex justify-between"><span>• ${productName} (Qté: ${
          p.quantity
        })</span><span>${unitPrice.toLocaleString()} FCFA</span></div>`;
      })
      .join("");
  }

  private setupProductModals(container: HTMLElement) {
    const addProductBtn = container.querySelector("#btn-add-product");
    if (addProductBtn) {
      addProductBtn.addEventListener("click", () => {
        import("../components/ModalManager").then(({ ModalManager }) => {
          const modalManager = new ModalManager(this.container);
          modalManager.showProductModal(async () => {
            await this.loadProductsData(container);
            await this.dashboardStats.loadStats();
          });
        });
      });
    }
  }

  private setupCategoryModals(container: HTMLElement) {
    const addCategoryBtn = container.querySelector("#btn-add-category");
    if (addCategoryBtn) {
      addCategoryBtn.addEventListener("click", () => {
        import("../components/ModalManager").then(({ ModalManager }) => {
          const modalManager = new ModalManager(this.container);
          modalManager.showCategoryModal(async () => {
            await this.loadCategoriesData(container);
          });
        });
      });
    }
  }

  private async handleLogout() {
    const result = await Notifications.confirm(
      "Confirmation",
      "Êtes-vous sûr de vouloir vous déconnecter ?"
    );
    if (result.isConfirmed) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      router.navigate("/auth/login");
    }
  }
}
