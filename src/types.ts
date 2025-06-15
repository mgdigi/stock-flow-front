export interface Product {
  id: string;        
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
  client: [{
    name: string;
    email: string;
    phone: string;}];
  products: [
    {
      product: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }
  ];
  date: string;
  total: number;  
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

