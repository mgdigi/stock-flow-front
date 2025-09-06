export interface Product {
  _id: string;
  id?: string; // Ajout pour compatibilité        
  name: string;
  price: number;
  quantity:number;
  description?: string;
  reference: string;
  category: string;
  threshold?: number;
  createdAt: string;
}

export interface Category{
  _id: string;
  name: string;
  createdAt: string;
}

export interface Sale {
  _id: string;
  id?: string; // Ajout pour compatibilité
  client?: {
    name: string;
    email: string;
    phone: string;
  };
  clientInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  products: {
    productId?: string; // Ajout pour compatibilité
    quantity: number;
    unitPrice?: number;
    total?: number;
    product:  { _id: string; name?: string };
  }[];
  date: string;
  total?: number;  
  totalAmount?: number;
}

export interface User {
   prenom: string;
  nom: string;
  username: string;
  password: string;
  entreprise: string;
  adress: string;
  telephone: string;
  logo?: string | File;
}

