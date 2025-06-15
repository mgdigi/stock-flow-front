import type { Sale } from "../types";

export async function fetchSales(): Promise<Sale[]> {
 const token = localStorage.getItem('authToken');

  const response = await fetch('http://localhost:5000/api/sales', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return await response.json();
}

  export async function createSale(saleData: {
    clientInfo: { name: string; email: string; phone: string };
    products: { productId: string; quantity: number }[];
  }): Promise<Sale> {
     const token = localStorage.getItem('authToken');

    const response = await fetch('http://localhost:5000/api/sales', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
      body: JSON.stringify(saleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur création vente');
    }

    return await response.json();
  }
