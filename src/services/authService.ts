import type { User } from '../types';
import { API_BASE_URL } from '../config/api';

export async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  

  const data = await response.json();
  return { data, ok: response.ok };
}

export async function register(userData: User) {
  try {
    const formData = new FormData();
    
    // Ajouter tous les champs obligatoires
    formData.append('prenom', userData.prenom || '');
    formData.append('nom', userData.nom || '');
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    formData.append('entreprise', userData.entreprise || '');
    formData.append('adress', userData.adress || '');
    formData.append('telephone', userData.telephone || '');
    
    // Ajouter le logo s'il existe
    if (userData.logo && userData.logo instanceof File) {
      console.log('Ajout du logo au FormData:', userData.logo.name, userData.logo.size);
      formData.append('logo', userData.logo);
    } else {
      console.log('Aucun logo fourni ou fichier invalide');
    }
    
    // Debug FormData
    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name}` : value);
    }
    
    console.log('Envoi de la requête d\'inscription...');
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: formData,
      // Note: Ne pas ajouter Content-Type header pour FormData avec fichiers
      // Le navigateur le définit automatiquement avec boundary
    });
    
    console.log('Réponse reçue:', response.status, response.statusText);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Le serveur a retourné du ${contentType} au lieu de JSON`);
    }

    const data = await response.json();
    return { data, ok: response.ok };
    
  } catch (error) {
    throw error;
  }
}


export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return response.ok;
}
