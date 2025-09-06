# ProStock - Application de Gestion de Stock

Application web moderne de gestion de stock et facturation avec architecture modulaire.

## 🏗️ Architecture

### Structure des fichiers
```
├── pages/                    # Pages HTML séparées
│   ├── auth/                 # Pages d'authentification
│   │   ├── login.html        # Page de connexion
│   │   └── register.html     # Page d'inscription
│   └── dashboard/            # Pages du tableau de bord
│       └── dashboard.html    # Page principale du dashboard
├── src/                      # Code source TypeScript
│   ├── components/           # Composants réutilisables
│   │   ├── header.ts         # Header du dashboard
│   │   ├── sidebar.ts        # Barre latérale de navigation
│   │   └── statsCards.ts     # Cartes de statistiques
│   ├── config/               # Configuration
│   │   └── api.ts            # Configuration API centralisée
│   ├── services/             # Services API
│   │   ├── authService.ts    # Authentification
│   │   ├── productService.ts # Gestion produits
│   │   ├── categoryService.ts# Gestion catégories
│   │   ├── venteService.ts   # Gestion ventes
│   │   └── invoiceService.ts # Génération factures
│   ├── views/                # Vues des sections
│   │   ├── inventaire.ts     # Vue inventaire
│   │   ├── produits.ts       # Vue produits
│   │   ├── categories.ts     # Vue catégories
│   │   ├── ventes.ts         # Vue ventes
│   │   └── factures.ts       # Vue factures
│   ├── utils/                # Utilitaires
│   ├── types.ts              # Types TypeScript
│   ├── auth.ts               # Logique authentification
│   ├── dashboard.ts          # Logique dashboard principal
│   └── style.css             # Styles CSS
├── .env.example              # Variables d'environnement exemple
├── vite.config.ts            # Configuration Vite
├── tsconfig.json             # Configuration TypeScript
└── tailwind.config.js        # Configuration Tailwind CSS
```

## 🚀 Installation

1. **Cloner le repository**
   ```bash
   git clone <url-du-repo>
   cd Gestion-Stock-Front
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos configurations
   ```

4. **Lancer en développement**
   ```bash
   npm run dev
   ```

## 📦 Déploiement

### Production Build
```bash
npm run build
```

### Variables d'environnement pour production
```bash
VITE_API_BASE_URL=https://votre-api.com/api
```

### Docker (optionnel)
```bash
docker-compose up -d
```

## 🛠️ Développement

### Structure modulaire
- **Composants** : Fonctions qui retournent du HTML
- **Services** : Communication avec l'API backend
- **Vues** : Sections spécifiques du dashboard
- **Types** : Définitions TypeScript pour la sécurité

### Ajout d'une nouvelle section
1. Créer la vue dans `src/views/nouvelleSection.ts`
2. Exporter la fonction `renderNouvelleSectionView()`
3. Ajouter le cas dans `src/dashboard.ts`
4. Ajouter le lien dans `src/components/sidebar.ts`

### API Configuration
L'URL de l'API est centralisée dans `src/config/api.ts` et utilise les variables d'environnement Vite.

## 🔧 Scripts disponibles

- `npm run dev` - Lancer en développement
- `npm run build` - Build pour production
- `npm run preview` - Preview du build
- `npm run typecheck` - Vérifier les types TypeScript

## 📋 Fonctionnalités

- ✅ Authentification (connexion/inscription)
- ✅ Tableau de bord avec statistiques
- ✅ Gestion des produits
- ✅ Gestion des catégories
- ✅ Gestion des ventes
- ✅ Génération de factures
- ✅ Suivi de l'inventaire
- ✅ Architecture modulaire
- ✅ Types TypeScript
- ✅ Configuration environnement

## 🎨 Technologies

- **Frontend** : HTML5, CSS3, TypeScript
- **Styling** : Tailwind CSS
- **Build** : Vite
- **Icons** : Font Awesome
- **Charts** : Chart.js

## 🔒 Sécurité

- Variables d'environnement pour l'API
- Authentification par token
- Validation côté client
- Échappement XSS automatique

## 📞 Support

Pour toute question ou problème, créer une issue sur le repository.
