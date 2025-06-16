import type { Product } from '../types';

const API_BASE_URL = 'https://gestion-stock-back-production.up.railway.app/api';


export async function fetchProducts(): Promise<Product[]> {
 const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Aucun token trouvé');
  }

  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const data: Product[] = await response.json();
  return data;
}

export async function createProduct(product: Product): Promise<Product> {
 const token = localStorage.getItem('authToken');

  const response = await fetch(` ${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
     },
    body: JSON.stringify(product),
  });

  console.log(token)


  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la création du produit');
  }

  return await response.json();
}


