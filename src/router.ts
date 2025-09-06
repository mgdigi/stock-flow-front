export class Router {
  private routes: Map<string, () => void> = new Map();
  private currentPath: string = '';

  constructor() {
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
    
    // Intercept all link clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[data-route]') as HTMLAnchorElement;
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute('data-route') || '/');
      }
    });
  }

  addRoute(path: string, handler: () => void) {
    this.routes.set(path, handler);
  }

  navigate(path: string) {
    if (this.currentPath === path) return;
    
    this.currentPath = path;
    history.pushState({}, '', path);
    this.handleRoute();
  }

  private handleRoute() {
    const path = window.location.pathname;
    this.currentPath = path;
    
    // Check for exact matches first
    if (this.routes.has(path)) {
      this.routes.get(path)!();
      return;
    }
    
    // Check for pattern matches
    for (const [routePath, handler] of this.routes) {
      if (this.matchRoute(routePath, path)) {
        handler();
        return;
      }
    }
    
    // Default to login if no route matches and not authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.navigate('/auth/login');
    } else {
      this.navigate('/dashboard');
    }
  }

  private matchRoute(routePath: string, actualPath: string): boolean {
    if (routePath === actualPath) return true;
    
    // Handle wildcard routes
    if (routePath.endsWith('/*')) {
      const basePath = routePath.slice(0, -2);
      return actualPath.startsWith(basePath);
    }
    
    return false;
  }

  init() {
    this.handleRoute();
  }
}

export const router = new Router();
