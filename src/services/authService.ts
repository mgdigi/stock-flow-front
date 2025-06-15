import type { User } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

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
    
    if (userData.prenom) formData.append('prenom', userData.prenom);
    if (userData.nom) formData.append('nom', userData.nom);
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    if (userData.entreprise) formData.append('entreprise', userData.entreprise);
    if (userData.adress) formData.append('adress', userData.adress);
    if (userData.telephone) formData.append('telephone', userData.telephone);
    
    if (userData.logo && userData.logo instanceof File) {
      formData.append('logo', userData.logo);
    }    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: formData
    });

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
