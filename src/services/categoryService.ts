import type { Category } from "../types";
import { API_BASE_URL } from '../config/api';

export async function fetchCategories(): Promise<Category[]> {

  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Aucun token trouvé');
  }
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  } );
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return await response.json();
}

export async function createCategory(name: string): Promise<Category> {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
      
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur création catégorie');
  }

  return await response.json();
}
