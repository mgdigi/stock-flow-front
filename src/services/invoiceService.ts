export async function generateInvoicePDF(sale: Sale): Promise<void> {
  const userInfo = localStorage.getItem('userInfo');
  const COMPANY_INFO = JSON.parse(userInfo || '{}');

  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  
  const primaryColor: [number, number, number] = [79, 70, 229];       
  const lightBackground: [number, number, number] = [247, 250, 252];  
  
  
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 50, 'F');
  
  doc.setFillColor(...primaryColor);
  doc.rect(0, 45, 210, 5, 'F');
  
  doc.setFillColor(255, 255, 255);
  doc.setGState(doc.GState({opacity: 0.1}));
  doc.rect(0, 0, 210, 25, 'F');
  doc.setGState(doc.GState({opacity: 1}));
  
  
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(155, 8, 40, 32, 3, 3, 'FD');
  
  if (COMPANY_INFO.logo) {
    try {
      let logoBase64: string;
      let format: 'JPEG' | 'PNG' | 'WEBP';
      
      if (COMPANY_INFO.logo.startsWith('data:image/')) {
        logoBase64 = COMPANY_INFO.logo;
        format = getImageFormat(COMPANY_INFO.logo);
      } else if (COMPANY_INFO.logo instanceof File) {
        logoBase64 = await fileToBase64(COMPANY_INFO.logo);
        format = getImageFormatFromFile(COMPANY_INFO.logo.type);
      } else if (typeof COMPANY_INFO.logo === 'string') {
        logoBase64 = await loadImageViaFetch(COMPANY_INFO.logo);
        format = getImageFormatFromPath(COMPANY_INFO.logo);
      }
      
      doc.addImage(logoBase64!, format!, 160, 12, 30, 24);
      
    } catch (error) {
      console.warn('Erreur lors de l\'ajout du logo:', error);
      
      doc.setFillColor(...primaryColor);
      doc.circle(175, 24, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      const initials = COMPANY_INFO.entreprise?.substring(0, 2).toUpperCase() || 'CO';
      doc.text(initials, 175, 28, { align: 'center' });
    }
  } else {
    doc.setFillColor(...primaryColor);
    doc.circle(175, 24, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    const initials = COMPANY_INFO.entreprise?.substring(0, 2).toUpperCase() || 'CO';
    doc.text(initials, 175, 28, { align: 'center' });
  }
  
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont(undefined, 'bold');
  doc.text(String(COMPANY_INFO.entreprise || 'VOTRE ENTREPRISE'), 15, 22);
  

  doc.setFontSize(9);
  doc.setTextColor(220, 220, 220);
  
  doc.text(COMPANY_INFO.adress, 15, 28);
  doc.text(`Dakar, SENEGAL  | ${COMPANY_INFO.telephone}`, 15, 34);
  
 
  if (COMPANY_INFO.email) {
    doc.text('', 80, 40);
    doc.text(String(COMPANY_INFO.email), 85, 40);
  }
  
  
  doc.setFillColor(...lightBackground);
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.3);
  doc.roundedRect(120, 55, 75, 25, 2, 2, 'FD');
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('FACTURE', 157, 65, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...primaryColor);
  doc.text(`N° ${sale.id?.slice(-8).toUpperCase() || 'INV-' + Date.now().toString().slice(-6)}`, 157, 71, { align: 'center' });
  
  const formattedDate = new Date(sale.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`${formattedDate}`, 157, 76, { align: 'center' });
  
  
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.line(15, 85, 195, 85);
  
  doc.setFillColor(...primaryColor);
  for (let i = 0; i < 5; i++) {
    doc.circle(25 + (i * 30), 85, 1, 'F');
  }
  
  
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 92, 180, 35, 3, 3, 'FD');
  
  doc.setFillColor(...primaryColor);
  doc.rect(15, 92, 4, 35, 'F');
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('FACTURÉ À', 25, 102);
  
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(String(sale.client.name), 25, 110);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`${String(sale.client.phone)}`, 25, 116);
  
  if (sale.client.email) {
    doc.text(`${String(sale.client.email)}`, 25, 122);
  }
  
  // Date et heure de création (coin droit)
  doc.setTextColor(...primaryColor);
  doc.setFontSize(8);
  doc.text(`le ${new Date().toLocaleString('fr-FR')}`, 145, 122);
  
  // =============== TABLEAU DES PRODUITS (exemple) ===============
  
  let yPos = 140;
  
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, 180, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('PRODUIT', 20, yPos + 8);
  doc.text('QTÉ', 120, yPos + 8);
  doc.text('PRIX UNIT.', 140, yPos + 8);
  doc.text('TOTAL', 170, yPos + 8);
  
  yPos += 12;
  
  // Produits
  doc.setTextColor(60, 60, 60);
  doc.setFont(undefined, 'normal');
  
  sale.products.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, yPos, 180, 10, 'F');
    }
    
    doc.text(String(item.product.name), 20, yPos + 7);
    doc.text(String(item.quantity), 125, yPos + 7);
    doc.text(`${String(item.unitPrice)} FCFA`, 140, yPos + 7);
    doc.text(`${String(item.total)} FCFA`, 170, yPos + 7);
    
    yPos += 10;
  });
  
  
  yPos += 15;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(120, yPos, 195, yPos);
  
  yPos += 10;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);
  doc.text('Sous-total:', 120, yPos);
  doc.text(`${String(sale.totalAmount)} FCFA`, 170, yPos);
  
  yPos += 10;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.line(120, yPos, 195, yPos);
  
  yPos += 12;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text('TOTAL À PAYER:', 120, yPos);
  doc.setTextColor(...primaryColor);
  doc.text(`${String(sale.totalAmount)} FCFA`, 170, yPos);
  
  // =============== PIED DE PAGE ===============
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('Merci pour votre confiance !', 15, 270);
  doc.text(`${String(COMPANY_INFO.username || COMPANY_INFO.entreprise)} | ${String(COMPANY_INFO.adress)}`, 15, 276);
  
  // =============== TÉLÉCHARGEMENT FORCÉ ===============
  
  try {
    const filename = `Facture_${sale.id?.slice(-8) || 'N/A'}_${String(sale.client.name).replace(/\s+/g, '_')}.pdf`;
    
    
    
    setTimeout(() => {
      try {
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = 'none';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        console.log('✅ Facture téléchargée avec succès:', filename);
        
      } catch (blobError) {
        console.error('❌ Erreur téléchargement blob:', blobError);
        
        const pdfDataUri = doc.output('datauristring');
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>
            <p>Clic droit sur le PDF > Enregistrer sous...</p>
          `);
        } else {
          alert('Veuillez autoriser les pop-ups pour télécharger la facture');
        }
      }
    }, 500);
    
  } catch (saveError) {
    console.error('❌ Erreur lors de la sauvegarde:', saveError);
    
    const confirmDownload = confirm(
      'Le téléchargement automatique a échoué.\n' +
      'Voulez-vous ouvrir la facture dans un nouvel onglet ?\n' +
      '(Vous pourrez alors faire Ctrl+S pour la sauvegarder)'
    );
    
    if (confirmDownload) {
      const pdfDataUri = doc.output('datauristring');
      window.open(pdfDataUri, '_blank');
    }
  }
}

declare module 'jspdf' {
  interface jsPDF {
    roundedRect(x: number, y: number, width: number, height: number, rx: number, ry: number, style?: string): jsPDF;
  }
}

if (typeof (window as any).jsPDF !== 'undefined') {
  (window as any).jsPDF.API.roundedRect = function(x: number, y: number, width: number, height: number, rx: number, ry: number, style: string = 'S') {
    this.rect(x, y, width, height, style);
    return this;
  };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Erreur lors de la lecture du fichier'));
      }
    };
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsDataURL(file);
  });
}

function getImageFormat(base64String: string): 'JPEG' | 'PNG' | 'WEBP' {
  if (base64String.includes('data:image/png')) return 'PNG';
  if (base64String.includes('data:image/webp')) return 'WEBP';
  return 'JPEG';
}

function getImageFormatFromFile(mimeType: string): 'JPEG' | 'PNG' | 'WEBP' {
  if (mimeType.includes('png')) return 'PNG';
  if (mimeType.includes('webp')) return 'WEBP';
  return 'JPEG';
}

function getImageFormatFromPath(path: string): 'JPEG' | 'PNG' | 'WEBP' {
  const extension = path.toLowerCase().split('.').pop();
  if (extension === 'png') return 'PNG';
  if (extension === 'webp') return 'WEBP';
  return 'JPEG';
}

function getServerUrl(): string {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return window.location.origin;
}

async function loadImageViaFetch(imagePath: string): Promise<string> {
  try {
    const serverUrl = getServerUrl();
    const imageUrl = `${serverUrl}/${imagePath}`;
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Erreur lors de la conversion en base64'));
      reader.readAsDataURL(blob);
    });
    
  } catch (error) {
    console.error('Erreur lors du chargement via fetch:', error);
    throw error;
  }
}