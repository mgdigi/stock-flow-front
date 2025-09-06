import { login, register } from "../services/authService";
import { router } from "../router";
import { Notifications } from "../utils/notifications";

export class AuthPage {
  private container: HTMLElement;
  private isLogin: boolean = true;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(isLogin: boolean = true) {
    this.isLogin = isLogin;

    this.container.innerHTML = `
      <div class="min-h-screen bg-gray-600 flex items-center justify-center p-4 relative overflow-hidden">
        

        <!-- Floating Elements -->
        <div class="floating-elements">
          <div class="absolute top-20 left-10 w-4 h-4 bg-blue-400/20 rounded-full animate-pulse"></div>
          <div class="absolute top-40 right-20 w-6 h-6 bg-gray-300/10 rounded-lg animate-bounce-slow"></div>
          <div class="absolute bottom-32 left-32 w-5 h-5 bg-blue-400/15 rounded-full animate-pulse-slow"></div>
          <div class="absolute bottom-20 right-40 w-3 h-3 bg-gray-300/20 rounded-full animate-bounce-slower"></div>
        </div>

        <!-- Main Container with responsive width -->
        <div class="w-full ${isLogin ? 'max-w-md' : 'max-w-4xl'} relative z-10">
          <!-- Header -->
          <div class="text-center mb-6 animate-fade-in">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-400 rounded-2xl mb-4 shadow-lg">
              <span class="text-white font-bold text-xl">SF</span>
            </div>
            <h1 class="text-3xl font-bold text-gray-400 mb-2">StockFlow</h1>
            <p class="text-gray-300">Gestion Intelligente des Stocks</p>
          </div>

          ${isLogin ? this.renderLoginForm() : this.renderRegisterForm()}

          <div class="text-center mt-6 text-gray-300 text-sm">
            <p>&copy; 2025 StockFlow. Tous droits réservés.</p>
          </div>
        </div>
      </div>

      <style>
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-slower {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
        .animate-bounce-slower { animation: bounce-slower 4s infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s infinite; }

        .glass-card {
          background: rgba(30, 30, 30, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(96, 165, 250, 0.2);
        }

        .input-field {
          background: rgba(30, 30, 30, 0.6);
          border: 1px solid rgba(156, 163, 175, 0.3);
          transition: all 0.3s ease;
        }

        .input-field:focus {
          border-color: rgb(96, 165, 250);
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
        }

        .btn-primary {
          background: rgb(96, 165, 250);
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: rgb(59, 130, 246);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(96, 165, 250, 0.3);
        }
      </style>
    `;

    this.attachEventListeners();
  }

  private renderLoginForm(): string {
    return `
      <div class="bg-gray-300 rounded-2xl p-8 shadow-2xl animate-slide-up">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-600 mb-2">Connexion</h2>
          <p class="text-gray-600">Accédez à votre tableau de bord</p>
        </div>

        <form id="loginForm" class="space-y-6">
          <div class="space-y-4">
            <div class="relative">
              <input 
                type="email" 
                name="username" 
                id="login-username" 
                class=" w-full bg-gray-600 px-4 py-4 rounded-xl text-white placeholder-gray-300 focus:outline-none" 
                placeholder="Adresse email" 
                required
              >
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
              </div>
            </div>

            <div class="relative">
              <input 
                type="password" 
                name="password" 
                id="login-password" 
                class=" bg-gray-600 w-full px-4 py-4 rounded-xl text-white placeholder-gray-300 focus:outline-none" 
                placeholder="Mot de passe" 
                required
              >
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button type="button" class="text-gray-300 bg-gray-600 transition-colors toggle-password">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center text-gray-300 cursor-pointer">
              <input type="checkbox" class="mr-2 w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-400 focus:ring-blue-400">
              Se souvenir de moi
            </label>
            <a href="#" class="text-gray-600 transition-colors">Mot de passe oublié ?</a>
          </div>

          <div id="login-error" class="hidden text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg"></div>

          <button type="submit" class="login-btn bg-gray-600 w-full py-4 rounded-xl font-semibold text-white">
            Se connecter
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-gray-800 mb-4">Pas encore de compte ?</p>
          <button class="to-register text-gray-600 bg-gray-300 transition-colors">
            Créer un compte
          </button>
        </div>
      </div>
    `;
  }

  private renderRegisterForm(): string {
    return `
      <div class="bg-gray-300 rounded-2xl p-8 shadow-2xl animate-slide-up">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-white mb-2">Inscription</h2>
          <p class="text-gray-300">Créez votre compte StockFlow</p>
        </div>

        <form id="registerForm" class="space-y-4" enctype="multipart/form-data">
          <!-- Grid Layout pour éviter le scroll -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Colonne Gauche -->
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <input 
                  id="prenom" 
                  type="text" 
                  class="bg-gray-600 w-full px-3 py-3 rounded-lg text-white placeholder-gray-300 focus:outline-none text-sm" 
                  placeholder="Prénom" 
                  required
                >
                <input 
                  id="nom" 
                  type="text" 
                  class="bg-gray-600 w-full px-3 py-3 rounded-lg text-white placeholder-gray-300 focus:outline-none text-sm" 
                  placeholder="Nom" 
                  required
                >
              </div>

              <input 
                id="username" 
                type="email" 
                class="bg-gray-600 w-full px-3 py-3 rounded-lg text-white placeholder-gray-300 focus:outline-none text-sm" 
                placeholder="Adresse email" 
                required
              >

              <input 
                id="entreprise" 
                type="text" 
                class="bg-gray-600 w-full px-3 py-3 rounded-lg text-white placeholder-gray-300 focus:outline-none text-sm" 
                placeholder="Nom de l'entreprise" 
                required
              >

              <div class="grid grid-cols-2 gap-3">
                <div class="relative">
                  <input 
                    id="password" 
                    type="password" 
                    class="bg-gray-600 w-full px-3 py-3 rounded-lg text-white placeholder-gray-300 focus:outline-none text-sm pr-10" 
                    placeholder="Mot de passe" 
                    required
                  >
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 bg-gray-600 transition-colors toggle-password">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                </div>
                <div class="relative">
                  <input 
                    type="password" 
                    id="confirm-password" 
                    class="bg-gray-600 w-full px-3 py-3 rounded-lg text-white placeholder-gray-300 focus:outline-none text-sm pr-10" 
                    placeholder="Confirmer" 
                    required
                  >
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 bg-gray-600 transition-colors toggle-password">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Colonne Droite -->
            <div class="space-y-4">
              <input 
                id="adresse" 
                type="text" 
                class="bg-gray-600 w-full px-3 py-3 rounded-lg text-white placeholder-gray-300 focus:outline-none text-sm" 
                placeholder="Adresse de l'entreprise" 
                required
              >

              <input 
                id="telephone" 
                type="text" 
                class="bg-gray-600 w-full px-3 py-3 rounded-lg text-white placeholder-gray-300 focus:outline-none text-sm" 
                placeholder="Téléphone de l'entreprise" 
                required
              >

              <div class="relative">
                <input 
                  type="file" 
                  id="logo" 
                  name="logo" 
                  accept="image/png,image/jpeg,image/jpg,image/webp" 
                  class="bg-gray-600 w-full px-3 py-3 rounded-lg text-white focus:outline-none text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-400/20 file:text-blue-400 file:text-xs" 
                  required
                >
                <div class="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </div>

              <!-- Prévisualisation du logo -->
              <div id="logo-preview" class="hidden text-center p-4 bg-gray-800/50 rounded-lg">
                <img id="logo-preview-img" class="w-16 h-16 object-cover rounded-lg mx-auto border-2 border-blue-400/30" />
                <p class="text-gray-300 text-xs mt-2">Aperçu du logo</p>
              </div>

              
            </div>
          </div>

          <div id="register-error" class="hidden text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg mt-4"></div>

          <button type="submit" id="register-btn" class=" bg-gray-600 w-full py-4 rounded-xl font-semibold text-white mt-6">
            Créer mon compte
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600 mb-3 text-sm">Déjà un compte ?</p>
          <button class="to-login text-gray-500  bg-gray-300 transition-colors font-semibold">
            Se connecter
          </button>
        </div>
      </div>
    `;
  }

  

  private attachEventListeners() {
    const toggleButtons = this.container.querySelectorAll(".toggle-password");
    toggleButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const input = (e.target as HTMLElement)
          .closest(".relative")
          ?.querySelector("input") as HTMLInputElement;
        if (input) {
          input.type = input.type === "password" ? "text" : "password";
        }
      });
    });

    // Logo preview
    const logoInput = this.container.querySelector("#logo") as HTMLInputElement;
    if (logoInput) {
      logoInput.addEventListener("change", (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        const preview = this.container.querySelector(
          "#logo-preview"
        ) as HTMLElement;
        const previewImg = this.container.querySelector(
          "#logo-preview-img"
        ) as HTMLImageElement;

        if (file && preview && previewImg) {
          const reader = new FileReader();
          reader.onload = (e) => {
            previewImg.src = e.target?.result as string;
            preview.classList.remove("hidden");
          };
          reader.readAsDataURL(file);
        } else if (preview) {
          preview.classList.add("hidden");
        }
      });
    }

    // Toggle between login and register
    const toRegisterBtn = this.container.querySelector(".to-register");
    if (toRegisterBtn) {
      toRegisterBtn.addEventListener("click", (e) => {
        e.preventDefault();
        router.navigate("/auth/register");
      });
    }

    const toLoginBtn = this.container.querySelector(".to-login");
    if (toLoginBtn) {
      toLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        router.navigate("/auth/login");
      });
    }

    // Form submissions
    if (this.isLogin) {
      const loginForm = this.container.querySelector("#loginForm");
      if (loginForm) {
        loginForm.addEventListener("submit", this.handleLogin.bind(this));
      }
    } else {
      const registerForm = this.container.querySelector("#registerForm");
      if (registerForm) {
        registerForm.addEventListener("submit", this.handleRegister.bind(this));
      }
    }
  }

  private async handleLogin(e: Event) {
    e.preventDefault();

    const username = (
      this.container.querySelector("#login-username") as HTMLInputElement
    )?.value;
    const password = (
      this.container.querySelector("#login-password") as HTMLInputElement
    )?.value;
    const loginBtn = this.container.querySelector(
      ".login-btn"
    ) as HTMLButtonElement;

    if (!username || !password) {
      this.showError("Veuillez remplir tous les champs", "login-error");
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Connexion...";

    try {
      const { data, ok } = await login(username, password);

      if (ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        console.log("Utilisateur connecté:", data.user.username);
        console.log("Token généré:", data.token);
        router.navigate("/dashboard");
      } else {
        this.showError(data.message || "Erreur de connexion", "login-error");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      this.showError("Erreur de connexion au serveur", "login-error");
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Se connecter";
    }
  }

  private async handleRegister(e: Event) {
    e.preventDefault();

    const prenom = (this.container.querySelector("#prenom") as HTMLInputElement)
      ?.value;
    const nom = (this.container.querySelector("#nom") as HTMLInputElement)
      ?.value;
    const username = (
      this.container.querySelector("#username") as HTMLInputElement
    )?.value;
    const password = (
      this.container.querySelector("#password") as HTMLInputElement
    )?.value;
    const confirmPassword = (
      this.container.querySelector("#confirm-password") as HTMLInputElement
    )?.value;
    const entreprise = (
      this.container.querySelector("#entreprise") as HTMLInputElement
    )?.value;
    const adress = (
      this.container.querySelector("#adresse") as HTMLInputElement
    )?.value;
    const telephone = (
      this.container.querySelector("#telephone") as HTMLInputElement
    )?.value;
    const logoInput = this.container.querySelector("#logo") as HTMLInputElement;
    const logo = logoInput?.files?.[0];
    const registerBtn = this.container.querySelector(
      "#register-btn"
    ) as HTMLButtonElement;

    console.log("Logo selected:", logo); // Debug
    console.log(
      "Logo file details:",
      logo ? { name: logo.name, size: logo.size, type: logo.type } : "No file"
    );

    // Validation du logo
    if (!logo) {
      this.showError(
        "Veuillez sélectionner un logo pour votre entreprise",
        "register-error"
      );
      return;
    }

    // Validation du type de fichier
    if (!logo.type.startsWith("image/")) {
      this.showError(
        "Le logo doit être un fichier image (JPG, PNG, etc.)",
        "register-error"
      );
      return;
    }

    // Validation de la taille (5MB max)
    if (logo.size > 5 * 1024 * 1024) {
      this.showError("Le logo ne doit pas dépasser 5MB", "register-error");
      return;
    }

    if (!username || !password || !confirmPassword || !entreprise) {
      this.showError(
        "Veuillez remplir tous les champs obligatoires",
        "register-error"
      );
      return;
    }

    if (password !== confirmPassword) {
      this.showError(
        "Les mots de passe ne correspondent pas",
        "register-error"
      );
      return;
    }

    if (password.length < 6) {
      this.showError(
        "Le mot de passe doit contenir au moins 6 caractères",
        "register-error"
      );
      return;
    }

    registerBtn.disabled = true;
    registerBtn.textContent = "Inscription...";

    try {
      const { data, ok } = await register({
        prenom,
        nom,
        username,
        password,
        entreprise,
        adress,
        telephone,
        logo,
      });

      if (ok) {
        router.navigate("/auth/login");
        Notifications.success(
          "Succès",
          "Inscription réussie ! Vous pouvez maintenant vous connecter."
        );
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors)
            .map((err: any) => err.message)
            .join(", ");
          this.showError(errorMessages, "register-error");
        } else {
          this.showError(
            data.message || "Erreur lors de l'inscription",
            "register-error"
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      this.showError(
        "Erreur lors de l'inscription: " + (error as Error).message,
        "register-error"
      );
    } finally {
      registerBtn.disabled = false;
      registerBtn.textContent = "Créer mon compte";
    }
  }

  private showError(message: string, elementId: string) {
    const errorDiv = this.container.querySelector(
      `#${elementId}`
    ) as HTMLElement;
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove("hidden");
      setTimeout(() => {
        errorDiv.classList.add("hidden");
      }, 5000);
    }
  }
}
