import {
  createProduct,
  fetchProducts,
  createCategory,
  fetchCategories,
  createSale,
  generateInvoicePDF,
} from "../services/dataService";
import { Notifications } from "../utils/notifications";

export class ModalManager {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async showProductModal(onSuccess?: () => void) {
    const modalsContainer = this.getModalsContainer();

    // Charger les catégories pour le select
    let categories: any[] = [];
    try {
      categories = await fetchCategories();
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }

    modalsContainer.innerHTML = `
      <div id="product-modal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
          <h2 class="text-xl text-black font-bold mb-4 text-center">Ajouter un produit</h2>
          <form id="product-form" class="space-y-4">
            <label class="block text-black text-base font-bold">Nom Produit
              <input name="name" type="text" placeholder="Nom du produit" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" required />
            </label>
            
            <label class="block text-black text-base font-bold">Prix du Produit
              <input name="price" type="number" step="0.01" placeholder="Prix" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" required />
            </label>
            
            <label class="block text-black text-base font-bold">Quantité en stock
              <input name="quantity" type="number" placeholder="Quantité" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" required />
            </label>
            
            <label class="block text-black text-base font-bold">Seuil d'alerte
              <input name="threshold" type="number" placeholder="Seuil d'alerte (défaut: 7)" value="7" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" required />
            </label>
            
            <label class="block text-black text-base font-bold">Catégorie du produit
              <select name="category" class="w-full border p-2 rounded bg-gray-100 text-gray-800" required>
                <option value="">-- Choisissez une catégorie --</option>
                ${categories
                  .map(
                    (cat) => `<option value="${cat._id}">${cat.name}</option>`
                  )
                  .join("")}
              </select>
            </label>
        
            <div class="flex justify-end space-x-2">
              <button type="button" id="close-product-modal" class="text-gray-800 bg-gray-300 px-4 py-2 rounded">Annuler</button>
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Créer</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.setupProductModalEvents(modalsContainer, onSuccess);
  }

  async showCategoryModal(onSuccess?: () => void) {
    const modalsContainer = this.getModalsContainer();

    modalsContainer.innerHTML = `
      <div id="category-modal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-fit">
          <h2 class="text-xl text-black font-bold mb-4 text-center">Ajouter une Catégorie</h2>
          <form id="category-form" class="space-y-4">
            <label class="block text-black text-base font-bold">Nom Catégorie
              <input type="text" name="name" placeholder="Nom de la catégorie" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" required>
            </label>
            <div class="flex justify-end space-x-2">
              <button type="button" id="close-category-modal" class="bg-gray-300 text-gray-800 px-4 py-2 rounded">Annuler</button>
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.setupCategoryModalEvents(modalsContainer, onSuccess);
  }

  async showSaleModal() {
    const modalsContainer = this.getModalsContainer();

    // Charger les produits
    let products: any[] = [];
    try {
      products = await fetchProducts();
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    }

    modalsContainer.innerHTML = `
      <div id="sale-modal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white text-black p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-bold mb-4">Nouvelle vente</h2>
          <form id="sale-form" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label class="block text-gray-800 font-bold">Nom du Client :
                <input name="client_name" type="text" placeholder="Nom du client" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-500" required />
              </label>
              <label class="block text-gray-800 font-bold">Email Client :
                <input name="client_email" type="email" placeholder="Email du client" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-500" required />
              </label>
              <label class="block text-gray-800 font-bold">Téléphone Client :
                <input name="client_phone" type="tel" placeholder="Téléphone client" class="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-600" required />
              </label>
            </div>

            <div class="products-section border-t pt-4">
              <label class="text-black font-bold text-lg">Produits :</label>
              
              <div id="products-container">
                <div class="product-line flex gap-2 mb-3 items-end p-3 bg-gray-50 rounded-lg">
                  <div class="flex-1">
                    <label class="text-sm font-medium text-gray-700">Produit</label>
                    <select name="product" class="border p-2 rounded w-full bg-white text-gray-800" required>
                      <option value="">-- Choisissez un produit --</option>
                      ${products
                        .map(
                          (product) =>
                            `<option value="${product._id}" data-price="${product.price}" data-stock="${product.quantity}">${product.name} (Stock: ${product.quantity})</option>`
                        )
                        .join("")}
                    </select>
                  </div>
                  <div class="w-24">
                    <label class="text-sm font-medium text-gray-700">Quantité</label>
                    <input name="quantity" type="number" min="1" placeholder="Qty" class="border p-2 rounded w-full bg-white text-gray-800" required />
                  </div>
                  <div class="w-32">
                    <label class="text-sm font-medium text-gray-700">Prix unitaire</label>
                    <input name="unitPrice" type="number" step="0.01" placeholder="Prix" class="border p-2 rounded w-full bg-gray-100 text-gray-800" readonly />
                  </div>
                  <div class="w-32">
                    <label class="text-sm font-medium text-gray-700">Total</label>
                    <input name="total" type="number" step="0.01" placeholder="Total" class="border p-2 rounded w-full bg-gray-200 text-gray-800" readonly />
                  </div>
                  <button type="button" class="remove-product bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 h-10 hidden">
                    <i class="fa-solid fa-minus"></i>
                  </button>
                </div>
              </div>
              
              <button type="button" id="add-product-btn" class="mt-3 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <i class="fa-solid fa-plus mr-2"></i>Ajouter un produit
              </button>
            </div>

            <div class="total-section bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <div class="flex justify-between items-center text-2xl font-bold">
                <span class="text-blue-800">Total général :</span>
                <span id="grand-total" class="text-blue-600">0 FCFA</span>
              </div>
            </div>

            <div class="flex justify-end space-x-2 pt-4 border-t">
              <button type="button" id="close-sale-modal" class="text-gray-800 bg-gray-300 px-6 py-3 rounded-lg">Annuler</button>
              <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                <i class="fa-solid fa-shopping-cart mr-2"></i>Créer la vente
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.setupSaleModalEvents(modalsContainer);
  }

  private getModalsContainer(): HTMLElement {
    return this.container.querySelector("#modals-container") as HTMLElement;
  }

  private setupProductModalEvents(
    modalsContainer: HTMLElement,
    onSuccess?: () => void
  ) {
    // Close modal functionality
    const closeBtn = modalsContainer.querySelector("#close-product-modal");
    closeBtn?.addEventListener("click", () => {
      modalsContainer.innerHTML = "";
    });

    // Form submission
    const productForm = modalsContainer.querySelector("#product-form");
    productForm?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(productForm as HTMLFormElement);
      const productData = {
        name: formData.get("name") as string,
        price: parseFloat(formData.get("price") as string),
        quantity: parseInt(formData.get("quantity") as string),
        threshold: parseInt(formData.get("threshold") as string) || 7,
        category: formData.get("category") as string,
      };

      const submitBtn = productForm.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      submitBtn.disabled = true;
      submitBtn.textContent = "Création...";

      try {
        await createProduct(productData as any);
        Notifications.success("Succès", "Produit créé avec succès !");
        modalsContainer.innerHTML = "";
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Erreur lors de la création du produit:", error);
        Notifications.error("Erreur", "Erreur lors de la création du produit");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Créer";
      }
    });
  }

  private setupCategoryModalEvents(
    modalsContainer: HTMLElement,
    onSuccess?: () => void
  ) {
    // Close modal functionality
    const closeBtn = modalsContainer.querySelector("#close-category-modal");
    closeBtn?.addEventListener("click", () => {
      modalsContainer.innerHTML = "";
    });

    // Form submission
    const categoryForm = modalsContainer.querySelector("#category-form");
    categoryForm?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(categoryForm as HTMLFormElement);
      const categoryName = formData.get("name") as string;

      if (!categoryName?.trim()) {
        Notifications.warning(
          "Attention",
          "Veuillez saisir un nom de catégorie"
        );
        return;
      }

      const submitBtn = categoryForm.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      submitBtn.disabled = true;
      submitBtn.textContent = "Création...";

      try {
        await createCategory(categoryName.trim());
        Notifications.success("Succès", "Catégorie créée avec succès !");
        modalsContainer.innerHTML = "";
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Erreur lors de la création de la catégorie:", error);
        Notifications.error(
          "Erreur",
          "Erreur lors de la création de la catégorie"
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enregistrer";
      }
    });
  }

  private setupSaleModalEvents(modalsContainer: HTMLElement) {
    // Close modal functionality
    const closeBtn = modalsContainer.querySelector("#close-sale-modal");
    closeBtn?.addEventListener("click", () => {
      modalsContainer.innerHTML = "";
    });

    // Add product line functionality
    const addProductBtn = modalsContainer.querySelector("#add-product-btn");
    addProductBtn?.addEventListener("click", () => {
      this.addProductLineToSale(modalsContainer);
    });

    // Setup first product line events
    const firstLine = modalsContainer.querySelector(
      ".product-line"
    ) as HTMLElement;
    if (firstLine) {
      this.setupProductLineEvents(firstLine, modalsContainer);
    }

    // Form submission
    const saleForm = modalsContainer.querySelector("#sale-form");
    saleForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleSaleSubmission(
        saleForm as HTMLFormElement,
        modalsContainer
      );
    });
  }

  private addProductLineToSale(modalsContainer: HTMLElement) {
    const productsContainer = modalsContainer.querySelector(
      "#products-container"
    ) as HTMLElement;
    const firstLine = productsContainer.querySelector(
      ".product-line"
    ) as HTMLElement;
    const newLine = firstLine.cloneNode(true) as HTMLElement;

    // Reset inputs
    const inputs = newLine.querySelectorAll("input, select");
    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.value = "";
      } else if (input instanceof HTMLSelectElement) {
        input.selectedIndex = 0;
      }
    });

    // Show remove button
    const removeBtn = newLine.querySelector(
      ".remove-product"
    ) as HTMLButtonElement;
    removeBtn.classList.remove("hidden");
    removeBtn.addEventListener("click", () => {
      newLine.remove();
      this.updateGrandTotal(modalsContainer);
    });

    productsContainer.appendChild(newLine);
    this.setupProductLineEvents(newLine, modalsContainer);
  }

  private setupProductLineEvents(
    productLine: HTMLElement,
    modalsContainer: HTMLElement
  ) {
    const productSelect = productLine.querySelector(
      'select[name="product"]'
    ) as HTMLSelectElement;
    const quantityInput = productLine.querySelector(
      'input[name="quantity"]'
    ) as HTMLInputElement;
    const unitPriceInput = productLine.querySelector(
      'input[name="unitPrice"]'
    ) as HTMLInputElement;

    // When product changes, update unit price
    productSelect.addEventListener("change", () => {
      const selectedOption = productSelect.selectedOptions[0];
      if (selectedOption && selectedOption.dataset.price) {
        unitPriceInput.value = selectedOption.dataset.price;
        this.calculateLineTotal(productLine, modalsContainer);
      }
    });

    // When quantity changes, recalculate
    quantityInput.addEventListener("input", () => {
      this.calculateLineTotal(productLine, modalsContainer);
    });
  }

  private calculateLineTotal(
    productLine: HTMLElement,
    modalsContainer: HTMLElement
  ) {
    const quantityInput = productLine.querySelector(
      'input[name="quantity"]'
    ) as HTMLInputElement;
    const unitPriceInput = productLine.querySelector(
      'input[name="unitPrice"]'
    ) as HTMLInputElement;
    const totalInput = productLine.querySelector(
      'input[name="total"]'
    ) as HTMLInputElement;

    const quantity = parseFloat(quantityInput.value) || 0;
    const unitPrice = parseFloat(unitPriceInput.value) || 0;
    const total = quantity * unitPrice;

    totalInput.value = total.toFixed(2);
    this.updateGrandTotal(modalsContainer);
  }

  private updateGrandTotal(modalsContainer: HTMLElement) {
    const totalInputs = modalsContainer.querySelectorAll(
      'input[name="total"]'
    ) as NodeListOf<HTMLInputElement>;
    let grandTotal = 0;

    totalInputs.forEach((input) => {
      grandTotal += parseFloat(input.value) || 0;
    });

    const grandTotalElement = modalsContainer.querySelector(
      "#grand-total"
    ) as HTMLElement;
    if (grandTotalElement) {
      grandTotalElement.textContent = `${grandTotal.toLocaleString()} FCFA`;
    }
  }

  private async handleSaleSubmission(
    form: HTMLFormElement,
    modalsContainer: HTMLElement
  ) {
    const formData = new FormData(form);

    // Collect client data
    const clientData = {
      name: formData.get("client_name") as string,
      email: formData.get("client_email") as string,
      phone: formData.get("client_phone") as string,
    };

    // Collect products data
    const productLines = modalsContainer.querySelectorAll(".product-line");
    const products = Array.from(productLines)
      .map((line) => {
        const productSelect = line.querySelector(
          'select[name="product"]'
        ) as HTMLSelectElement;
        const quantityInput = line.querySelector(
          'input[name="quantity"]'
        ) as HTMLInputElement;

        return {
          productId: productSelect.value,
          quantity: parseInt(quantityInput.value),
        };
      })
      .filter((product) => product.productId && product.quantity > 0);

    if (products.length === 0) {
      Notifications.warning(
        "Attention",
        "Veuillez ajouter au moins un produit"
      );
      return;
    }

    const submitBtn = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    submitBtn.disabled = true;
    submitBtn.textContent = "Création...";

    try {
      // Créer la vente
      const newSale = await createSale({
        clientInfo: clientData,
        products: products,
      });

      // GÉNÉRATION AUTOMATIQUE DE FACTURE - FONCTIONNALITÉ ESSENTIELLE
      try {
        await generateInvoicePDF(newSale);
        Notifications.success(
          "Succès",
          "Vente créée avec succès ! Facture générée automatiquement !"
        );
      } catch (error) {
        console.error("Erreur lors de la génération de la facture:", error);
        Notifications.warning(
          "Succès partiel",
          "Vente créée avec succès ! Erreur lors de la génération de la facture: " +
            (error as Error).message
        );
      }

      modalsContainer.innerHTML = "";

      // Recharger toutes les données
      window.location.reload(); // Pour recharger toutes les stats
    } catch (error) {
      console.error("Erreur lors de la création de la vente:", error);
      Notifications.error(
        "Erreur",
        "Erreur lors de la création de la vente: " + (error as Error).message
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Créer la vente";
    }
  }
}
