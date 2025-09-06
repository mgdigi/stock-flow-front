import { router } from './router';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

class App {
  private container: HTMLElement;
  private authPage: AuthPage;
  private dashboardPage: DashboardPage;

  constructor() {
    this.container = document.getElementById('app') || document.body;
    this.authPage = new AuthPage(this.container);
    this.dashboardPage = new DashboardPage(this.container);
    
    this.setupRoutes();
    this.init();
  }

  private setupRoutes() {
    // Auth routes
    router.addRoute('/', () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        router.navigate('/dashboard');
      } else {
        router.navigate('/auth/login');
      }
    });

    router.addRoute('/auth/login', () => {
      // Check if already authenticated
      const token = localStorage.getItem('authToken');
      if (token) {
        router.navigate('/dashboard');
        return;
      }
      
      document.title = 'ProStock - Connexion';
      this.authPage.render(true);
    });

    router.addRoute('/auth/register', () => {
      // Check if already authenticated
      const token = localStorage.getItem('authToken');
      if (token) {
        router.navigate('/dashboard');
        return;
      }
      
      document.title = 'ProStock - Inscription';
      this.authPage.render(false);
    });

    // Dashboard routes
    router.addRoute('/dashboard', () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.navigate('/auth/login');
        return;
      }
      
      document.title = 'ProStock - Tableau de Bord';
      this.dashboardPage.render();
    });

    router.addRoute('/dashboard/*', () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.navigate('/auth/login');
        return;
      }
      
      document.title = 'ProStock - Dashboard';
      this.dashboardPage.render();
    });
  }

  private init() {
    // Initialize CSS
    this.loadCSS();
    
    // Initialize router
    router.init();
  }

  private loadCSS() {
    // Add CSS classes to body based on current route
    const updateBodyClass = () => {
      const path = window.location.pathname;
      document.body.className = '';
      
      if (path.includes('/auth/')) {
        document.body.className = 'auth-page';
      } else if (path.includes('/dashboard')) {
        document.body.className = 'dashboard-page';
      }
    };

    updateBodyClass();
    
    // Update on route changes
    window.addEventListener('popstate', updateBodyClass);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

export default App;
